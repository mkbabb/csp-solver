import { SolverError, isSerializedSolverError } from "./solverError";
import type { PingRequest, PingResponse } from "./protocol";

/**
 * The game-agnostic solver Worker transport — single-sourced for both games (T4-W4
 * solver-seam dedup; the singleton + pending map + `ensureWorker`/`call`/`prewarm`/
 * `throwIfError` machinery was byte-identical across the two `useSolver.ts` files). The
 * game keeps only the parameterized seams: the worker URL (via `createWorker`), the
 * board-shape marshalling, and its own `SolverRequest`/`SolverResponse` union (supplied
 * as `Req`/`Res`).
 *
 * ── Bounded respawn (T4-W4 FAM-13) ──────────────────────────────────────────────
 * A worker-level `error` (the wasm failed to instantiate, or the worker crashed) used to
 * leave the memoized singleton in place: every subsequent `call` posted into a dead
 * worker and hung forever — the sticky poison. Here, an `error` rejects every in-flight
 * call with `WORKER_FAILURE` AND retires the singleton, so the next `call` re-instantiates
 * a fresh worker. The respawn is BOUNDED: after `maxConsecutiveFailures` crashes with no
 * intervening success, the transport stops respawning and surfaces `WORKER_FAILURE`
 * immediately — no spin on a permanently-broken wasm. A single successful message from the
 * worker (any frame — it proves the worker is alive) resets the counter, so a transient
 * crash recovers without burning the budget.
 */
export interface SolverTransportOptions {
  /** Builds a fresh worker — the game supplies `() => new Worker(new URL('./solver.worker.ts', import.meta.url), { type: 'module' })`. */
  createWorker: () => Worker;
  /** console.debug tag for the prewarm smoke, e.g. `'sudoku-solver'`. */
  tag: string;
  /** Consecutive worker crashes tolerated before `WORKER_FAILURE` is surfaced without a respawn. Default 3. */
  maxConsecutiveFailures?: number;
}

export interface SolverTransport<
  Req extends { id: number },
  Res extends { id: number },
> {
  /** Monotonic request id — the game stamps it onto the request it builds. */
  nextId: () => number;
  /** Post a request and resolve with its correlated response (or reject `WORKER_FAILURE`). */
  call: (req: Req, transfer: ArrayBuffer[]) => Promise<Res>;
  /** Cold-start prewarm: spin the worker up and ping it so the wasm instantiates while idle. */
  prewarm: () => void;
  /** Throw a typed `SolverError` when a response is the `ok: false` failure frame. */
  throwIfError: (res: Res) => void;
}

export function createSolverTransport<
  Req extends { id: number },
  Res extends { id: number },
>(options: SolverTransportOptions): SolverTransport<Req, Res> {
  const maxConsecutiveFailures = options.maxConsecutiveFailures ?? 3;

  let worker: Worker | null = null;
  let consecutiveFailures = 0;
  let id = 1;
  const pending = new Map<
    number,
    { resolve: (r: Res) => void; reject: (e: Error) => void }
  >();

  function rejectAllPending(message: string): void {
    for (const [pid, p] of pending) {
      p.reject(new SolverError("WORKER_FAILURE", message));
      pending.delete(pid);
    }
  }

  /**
   * Return the live worker, re-instantiating a retired one — or `null` once the respawn
   * cap is hit (a permanently-broken worker). The `null` return is the bounded-respawn
   * signal `call`/`prewarm` translate into an immediate `WORKER_FAILURE`.
   */
  function ensureWorker(): Worker | null {
    if (worker) return worker;
    if (consecutiveFailures >= maxConsecutiveFailures) return null;
    const w = options.createWorker();
    worker = w;
    w.addEventListener("message", (event: MessageEvent<Res>) => {
      // Any frame from the worker proves it's alive — clear the crash budget.
      consecutiveFailures = 0;
      const res = event.data;
      const p = pending.get(res.id);
      if (!p) return;
      pending.delete(res.id);
      p.resolve(res);
    });
    w.addEventListener("error", (event: ErrorEvent) => {
      // A worker-level error (e.g. the wasm module failed to instantiate) has no request
      // `id` to correlate — reject every in-flight call so nothing hangs forever, then
      // RETIRE the singleton so the next request re-instantiates a fresh worker (bounded).
      consecutiveFailures++;
      worker = null;
      w.terminate();
      rejectAllPending(event.message || "solver worker crashed");
    });
    return w;
  }

  function call(req: Req, transfer: ArrayBuffer[]): Promise<Res> {
    return new Promise((resolve, reject) => {
      const w = ensureWorker();
      if (!w) {
        reject(
          new SolverError(
            "WORKER_FAILURE",
            "solver worker unavailable after repeated failures",
          ),
        );
        return;
      }
      pending.set(req.id, { resolve, reject });
      w.postMessage(req, transfer);
    });
  }

  let warmed = false;

  /**
   * Cold-start prewarm (T3-W8 §cold-start, A17 P1). Spin the Worker up and post a no-op
   * `ping` so it runs `ensureInit()` — fetch + compile + instantiate the wasm — while the
   * main thread is idle, ahead of the first real solve/generate. The gain only exists
   * against the built `dist/` (dev fetch is instant); games call it from a scene-mount
   * idle callback.
   *
   * Idempotent: the `warmed` guard makes repeated calls a no-op. The ping response carries
   * no pending `id`, so the standard message handler ignores it; a one-shot listener here
   * logs the warm confirmation for the smoke.
   */
  function prewarm(): void {
    if (warmed) return;
    warmed = true;
    const w = ensureWorker();
    if (!w) return;
    const pingId = id++;
    const onPong = (event: MessageEvent<Res | PingResponse>) => {
      if ("kind" in event.data && event.data.kind === "ping") {
        w.removeEventListener("message", onPong as EventListener);
        console.debug(`[${options.tag}] prewarm: worker hot (wasm instantiated)`);
      }
    };
    w.addEventListener("message", onPong as EventListener);
    w.postMessage({ id: pingId, kind: "ping" } satisfies PingRequest);
    console.debug(`[${options.tag}] prewarm: warm ping sent`);
  }

  function throwIfError(res: Res): void {
    if ((res as { ok?: unknown }).ok === false) {
      if (isSerializedSolverError(res)) {
        throw new SolverError(res.code, res.message);
      }
      throw new SolverError("WORKER_FAILURE", "unknown worker failure");
    }
  }

  return { nextId: () => id++, call, prewarm, throwIfError };
}

import { SolverError, isSerializedSolverError } from "./solverError";
import type { PingRequest, PingResponse } from "./protocol";
import { useDebug } from "@/composables/useDebug";

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
 *
 * ── The deal channel (T9-W4 §4.1) ────────────────────────────────────────────────
 * `call` above rides the RESIDENT worker, and every wasm verb on it is synchronous: whatever it
 * is running, it is running to completion before it reads another frame. That was fine while
 * every verb was milliseconds. It stopped being fine when V2 timed a thermo 16×16 HARD deal at
 * a 473s maximum — for those eight minutes the resident worker answered nothing, in any game,
 * because `postMessage` cannot interrupt a synchronous call. Cancellation is not a message; it
 * is `Worker.terminate`, and terminate takes the whole worker with it.
 *
 * So the long verb gets a worker the estate can afford to lose. `runLeashed` runs ONE request on
 * the deal channel, a second worker that is terminated when it outruns its leash or when a
 * newer deal supersedes it, and re-minted on the next deal. Solves and propagates never leave
 * the resident worker, so they never pay a cold wasm instantiation for a deal's misbehaviour.
 *
 * The channel holds AT MOST ONE request, which is not a simplification: the estate renders one
 * live board, so there is one deal. That is why a supersede can simply take the worker.
 *
 * WHAT IT COSTS, stated: two wasm instances resident instead of one, once a board has been
 * dealt. It does not cost the reader a slower first board — the opening deal instantiated a
 * cold worker before this change too, since `prewarm` rides an idle callback that has not
 * fired yet when the mount deal goes out. `solverSpine.workers` reads 2 by design now, and the
 * second one is the price of being able to hang up on a deal.
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
  /**
   * Run ONE request on the deal channel — a worker of its own, under a leash.
   *
   * Three ways out, and only one of them settles by answering: the worker replies; the leash
   * expires (the worker is terminated, and the promise rejects `DEAL_TIMEOUT`); or a newer
   * `runLeashed` supersedes this one (the worker is terminated, and the promise is DROPPED —
   * see below). A worker-level crash rejects `WORKER_FAILURE` as everywhere else.
   *
   * THE DROP IS DELIBERATE. A superseded deal never settles, because there is no honest thing
   * to settle it with: it did not fail, and the caller already asked for something else. It is
   * the seam's half of the rule `useGameState` keeps on the other side — a deal whose epoch
   * moved applies nothing and records nothing, latest wins — and rejecting instead would put a
   * paper note on screen for a board the reader themselves replaced. The superseding call owns
   * the pending flag it shares and clears it in its own `finally`.
   */
  runLeashed: (req: Req, transfer: ArrayBuffer[], leashMs: number) => Promise<Res>;
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

  // ── The deal channel ──────────────────────────────────────────────────────────
  // Its own worker, its own single slot. Kept BETWEEN deals rather than minted per deal: a
  // worker that was never terminated still has its wasm hot, so the common case (deal, play,
  // deal again) pays instantiation once, and only a leash or a supersede spends it.
  let dealWorker: Worker | null = null;
  let live: {
    id: number;
    settle: (r: Res) => void;
    fail: (e: Error) => void;
    timer: ReturnType<typeof setTimeout>;
  } | null = null;

  /** Take the channel down: terminate the worker, forget the slot. The next deal re-mints. */
  function retireDealWorker(): void {
    if (dealWorker) dealWorker.terminate();
    dealWorker = null;
    live = null;
  }

  function ensureDealWorker(): Worker {
    if (dealWorker) return dealWorker;
    const w = options.createWorker();
    dealWorker = w;
    w.addEventListener("message", (event: MessageEvent<Res>) => {
      if (!live || event.data.id !== live.id) return;
      const done = live;
      live = null;
      clearTimeout(done.timer);
      done.settle(event.data);
    });
    w.addEventListener("error", (event: ErrorEvent) => {
      // A crash on the deal channel takes only the deal channel. No respawn cap here and none
      // needed: a deal is a user gesture, so a broken wasm costs one worker per press rather
      // than a spin.
      const done = live;
      if (done) clearTimeout(done.timer);
      retireDealWorker();
      done?.fail(
        new SolverError("WORKER_FAILURE", event.message || "solver worker crashed"),
      );
    });
    return w;
  }

  function runLeashed(
    req: Req,
    transfer: ArrayBuffer[],
    leashMs: number,
  ): Promise<Res> {
    // Supersede: the in-flight deal is dropped and its worker goes with it, so an abandoned
    // 16×16 dig stops burning a core the moment the reader asks for a different board.
    if (live) {
      clearTimeout(live.timer);
      retireDealWorker();
    }
    const w = ensureDealWorker();
    const result = new Promise<Res>((settle, fail) => {
      const timer = setTimeout(() => {
        retireDealWorker();
        fail(
          new SolverError(
            "DEAL_TIMEOUT",
            `the deal passed its ${leashMs}ms leash and its worker was terminated`,
          ),
        );
      }, leashMs);
      live = { id: req.id, settle, fail, timer };
    });
    w.postMessage(req, transfer);
    return result;
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
   *
   * T6 mark 16 — the two smoke lines are DEBUG ink and shipped in the prod bundle. Gated on
   * the flag rather than `import.meta.env.DEV`-stripped on purpose: prewarm health is exactly
   * what a debug mode exists to show, and it is only interesting on the built artifact.
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
        if (useDebug().value)
          console.debug(`[${options.tag}] prewarm: worker hot (wasm instantiated)`);
      }
    };
    w.addEventListener("message", onPong as EventListener);
    w.postMessage({ id: pingId, kind: "ping" } satisfies PingRequest);
    if (useDebug().value) console.debug(`[${options.tag}] prewarm: warm ping sent`);
  }

  function throwIfError(res: Res): void {
    if ((res as { ok?: unknown }).ok === false) {
      if (isSerializedSolverError(res)) {
        throw new SolverError(res.code, res.message);
      }
      throw new SolverError("WORKER_FAILURE", "unknown worker failure");
    }
  }

  return { nextId: () => id++, call, runLeashed, prewarm, throwIfError };
}

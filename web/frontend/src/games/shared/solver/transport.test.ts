import { describe, it, expect, vi } from "vitest";
import { createSolverTransport } from "./transport";
import { SolverError } from "./solverError";

// FE-unit layer (T4-W4): the shared solver transport's BOUNDED RESPAWN — the fix for the
// sticky memoized-worker poison (FAM-13). The transport injects its worker via a factory,
// so these units drive a MockWorker and control exactly when it crashes / responds, with no
// real Worker and no Vite worker-transform in the loop. Covers both games at once (the
// transport is single-sourced); the per-game protocol.test.ts own the wire-shape framing.

type Frame = { id: number; ok?: boolean; kind?: string; [k: string]: unknown };

/** A hand-driven Worker double: capture listeners, record posts, fire error/message on cue. */
class MockWorker {
  listeners: Record<string, ((e: unknown) => void)[]> = {};
  posted: unknown[] = [];
  terminated = false;
  addEventListener(type: string, fn: (e: unknown) => void) {
    (this.listeners[type] ??= []).push(fn);
  }
  removeEventListener(type: string, fn: (e: unknown) => void) {
    this.listeners[type] = (this.listeners[type] ?? []).filter((f) => f !== fn);
  }
  postMessage(msg: unknown) {
    this.posted.push(msg);
  }
  terminate() {
    this.terminated = true;
  }
  emitError(message = "wasm failed to instantiate") {
    for (const fn of [...(this.listeners["error"] ?? [])]) fn({ message });
  }
  emitMessage(data: Frame) {
    for (const fn of [...(this.listeners["message"] ?? [])]) fn({ data });
  }
}

function makeHarness(maxConsecutiveFailures?: number) {
  const workers: MockWorker[] = [];
  const createWorker = vi.fn(() => {
    const w = new MockWorker();
    workers.push(w);
    return w as unknown as Worker;
  });
  const transport = createSolverTransport<Frame, Frame>({
    createWorker,
    tag: "test-solver",
    maxConsecutiveFailures,
  });
  return { workers, createWorker, transport };
}

async function rejection(p: Promise<unknown>): Promise<SolverError> {
  return (await p.catch((e: unknown) => e)) as SolverError;
}

describe("solver transport — bounded worker respawn (FAM-13)", () => {
  it("a worker-level error rejects the in-flight call with WORKER_FAILURE and retires the singleton", async () => {
    const { workers, createWorker, transport } = makeHarness();
    const p = transport.call({ id: 1 }, []);
    expect(createWorker).toHaveBeenCalledTimes(1);

    workers[0].emitError("boom");
    const err = await rejection(p);
    expect(err).toBeInstanceOf(SolverError);
    expect(err.code).toBe("WORKER_FAILURE");
    expect(workers[0].terminated).toBe(true);

    // The singleton was retired → the NEXT call re-instantiates a fresh worker (the
    // pre-fix poison would have reused the dead worker and hung forever).
    const p2 = transport.call({ id: 2 }, []);
    expect(createWorker).toHaveBeenCalledTimes(2);
    workers[1].emitMessage({ id: 2, ok: true, kind: "solve" });
    await expect(p2).resolves.toMatchObject({ id: 2, ok: true });
  });

  it("bounds the respawn: N consecutive crashes → WORKER_FAILURE with no further respawn", async () => {
    const { workers, createWorker, transport } = makeHarness(3);
    // Three crashes, each respawning a fresh worker.
    for (let i = 1; i <= 3; i++) {
      const p = transport.call({ id: i }, []);
      expect(createWorker).toHaveBeenCalledTimes(i);
      workers[i - 1].emitError();
      expect((await rejection(p)).code).toBe("WORKER_FAILURE");
    }
    // Cap hit: the 4th call surfaces WORKER_FAILURE WITHOUT spinning up a fourth worker —
    // no loop on a permanently-broken wasm.
    const capped = transport.call({ id: 4 }, []);
    expect((await rejection(capped)).code).toBe("WORKER_FAILURE");
    expect(createWorker).toHaveBeenCalledTimes(3);
    expect(workers.length).toBe(3);
  });

  it("a successful message resets the crash budget (a transient crash recovers, no lifetime cap)", async () => {
    const { workers, createWorker, transport } = makeHarness(2);
    // Crash #1 → respawn.
    const p1 = transport.call({ id: 1 }, []);
    workers[0].emitError();
    expect((await rejection(p1)).code).toBe("WORKER_FAILURE");

    // The respawned worker delivers a SUCCESS → the crash budget resets to zero.
    const p2 = transport.call({ id: 2 }, []);
    expect(createWorker).toHaveBeenCalledTimes(2);
    workers[1].emitMessage({ id: 2, ok: true, kind: "solve" });
    await expect(p2).resolves.toMatchObject({ ok: true });

    // Crash the (still-live, reused) worker again — with the budget reset this is only the
    // 1st consecutive failure, so the next call respawns rather than hitting the cap.
    const p3 = transport.call({ id: 3 }, []);
    expect(createWorker).toHaveBeenCalledTimes(2); // reused the live worker, no new one
    workers[1].emitError();
    expect((await rejection(p3)).code).toBe("WORKER_FAILURE");

    const p4 = transport.call({ id: 4 }, []);
    expect(createWorker).toHaveBeenCalledTimes(3); // fresh worker → the budget was reset
    workers[2].emitMessage({ id: 4, ok: true, kind: "solve" });
    await expect(p4).resolves.toMatchObject({ ok: true });
  });

  it("ignores a response whose id has no pending call (stale/pong frame)", async () => {
    const { workers, transport } = makeHarness();
    const p = transport.call({ id: 10 }, []);
    // A frame for an unknown id must not resolve/reject the in-flight call.
    workers[0].emitMessage({ id: 999, ok: true, kind: "ping" });
    workers[0].emitMessage({ id: 10, ok: true, kind: "solve" });
    await expect(p).resolves.toMatchObject({ id: 10 });
  });
});

describe("solver transport — throwIfError + prewarm", () => {
  it("throwIfError throws a typed SolverError on the ok:false frame, no-ops on success", () => {
    const { transport } = makeHarness();
    expect(() =>
      transport.throwIfError({ id: 1, ok: false, code: "UNSAT", message: "no" }),
    ).toThrow(SolverError);

    let caught: SolverError | undefined;
    try {
      transport.throwIfError({
        id: 1,
        ok: false,
        code: "BUDGET_EXCEEDED",
        message: "x",
      });
    } catch (e) {
      caught = e as SolverError;
    }
    expect(caught?.code).toBe("BUDGET_EXCEEDED");

    // An ok:false frame that isn't a serialized error collapses to WORKER_FAILURE.
    let caught2: SolverError | undefined;
    try {
      transport.throwIfError({ id: 1, ok: false });
    } catch (e) {
      caught2 = e as SolverError;
    }
    expect(caught2?.code).toBe("WORKER_FAILURE");

    expect(() =>
      transport.throwIfError({ id: 1, ok: true, kind: "ping" }),
    ).not.toThrow();
  });

  it("prewarm spins up the worker, posts a ping, and is idempotent", () => {
    const { workers, createWorker, transport } = makeHarness();
    transport.prewarm();
    expect(createWorker).toHaveBeenCalledTimes(1);
    expect(workers[0].posted).toHaveLength(1);
    expect(workers[0].posted[0]).toMatchObject({ kind: "ping" });

    transport.prewarm();
    expect(createWorker).toHaveBeenCalledTimes(1); // warmed guard → no second worker
    expect(workers[0].posted).toHaveLength(1);
  });
});

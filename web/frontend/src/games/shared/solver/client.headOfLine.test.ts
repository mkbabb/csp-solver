/**
 * THE HEAD-OF-LINE GATE (T9-W4 §4.1 — V2's production exposure).
 *
 * One worker served all five games, and every wasm verb on it is SYNCHRONOUS. So a thermo
 * 16×16 HARD deal — median 19.9s, max 473s in V2's seven-seed run — did not merely make its own
 * board slow: it held the only thread the estate solves on, and every other game's solve,
 * propagate and deal queued behind it for the whole eight minutes. Nothing anywhere on the path
 * could cancel it, because `postMessage` cannot interrupt a synchronous call and there is no
 * other lever: `Worker.terminate` is the only true cancel.
 *
 * The cure is architectural. Generation runs on a worker of its OWN, which a leash or a
 * supersede may terminate; solves and propagates stay on the resident worker whose wasm is
 * already hot. This file is the proof, and it is written against the mechanism rather than the
 * clock: the double below BLOCKS on a generate exactly the way the real worker does, so a shared
 * seam cannot pass it and a split seam cannot fail it.
 *
 * No wasm runs here. What a seam change can break is WHICH WORKER a verb lands on and WHEN the
 * caller is let go, and both are entirely this side of `postMessage`.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { classifyCode } from "./classifyError";
import type { SolverRequest, SolverResponse } from "./protocol";

/** Every worker minted this test, in mint order. */
let workers: MintedWorker[] = [];

/** The frame the double answers each verb with — shape only; no test reads the digits. */
function replyTo(req: SolverRequest): SolverResponse {
  switch (req.kind) {
    case "generate":
      return {
        id: req.id,
        ok: true,
        kind: "generate",
        board: new Uint32Array(16),
        clue: new Uint32Array(0),
      };
    case "solve":
      return {
        id: req.id,
        ok: true,
        kind: "solve",
        solved: true,
        solutionCount: 1,
        solutions: new Uint32Array(16).fill(1),
        backtracks: "0",
        nodesExplored: "0",
        propagations: "0",
        budgetExceeded: false,
        elapsedMs: 0.1,
      };
    case "propagate":
      return { id: req.id, ok: true, kind: "propagate", masks: new Uint32Array(16) };
    default:
      return { id: req.id, ok: true, kind: "ping" };
  }
}

/**
 * A Worker double that models the ONE fact the shared seam got wrong: the verbs are synchronous.
 * A generate BLOCKS the instance that takes it — every later message is held, unanswered, until
 * `finishDeal()` says the dig returned. That is what a real worker does; a mock that answers a
 * solve while a generate is outstanding would be modelling a seam nobody shipped.
 */
class BlockingWorker {
  readonly seen: SolverRequest[] = [];
  terminated = false;
  private listeners: ((e: MessageEvent<SolverResponse>) => void)[] = [];
  private held: SolverRequest[] = [];
  private blocked = false;

  addEventListener(type: string, fn: (e: MessageEvent<SolverResponse>) => void): void {
    if (type === "message") this.listeners.push(fn);
  }
  removeEventListener(): void {}
  terminate(): void {
    this.terminated = true;
  }

  postMessage(req: SolverRequest): void {
    this.seen.push(req);
    if (this.terminated) return; // a terminated worker runs nothing, ever again
    if (req.kind === "generate") {
      this.blocked = true;
      this.held.push(req);
      return;
    }
    if (this.blocked) {
      this.held.push(req);
      return;
    }
    this.answer(req);
  }

  /** The dig returns: drain everything the block was holding, in arrival order. */
  finishDeal(): void {
    if (this.terminated) return;
    this.blocked = false;
    for (const req of this.held.splice(0)) this.answer(req);
  }

  private answer(req: SolverRequest): void {
    const res = replyTo(req);
    // Async, like a real worker: the caller's promise must still be pending when this returns.
    queueMicrotask(() => {
      for (const fn of this.listeners)
        fn({ data: res } as MessageEvent<SolverResponse>);
    });
  }
}

class MintedWorker extends BlockingWorker {
  constructor() {
    super();
    workers.push(this);
  }
}

/**
 * The client's workers are MODULE state (one resident worker for the estate, one deal channel),
 * which is the whole point of the seam and would otherwise leak between the tests below — a
 * worker minted in one `it` is not in the next one's census, and a test that reads the census
 * would be reading a lie. A reset per test gives each one its own module registry, so every
 * worker every assertion names was minted by that test.
 */
let client: typeof import("./client");

beforeEach(async () => {
  workers = [];
  vi.stubGlobal("Worker", MintedWorker);
  vi.resetModules();
  client = await import("./client");
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const boxed = (n: number) => n ** 2;
const clientFor = (game: "sudoku" | "thermo") =>
  client.createSolverClient<void>({
    game,
    boardSide: boxed,
    clue: null,
    templates: null,
    nodeBudget: () => 1_000_000,
  });

/** The seam's bound, asserted rather than waited on: a promise that has not settled inside
 *  `ms` real milliseconds is a promise something is BLOCKING. */
function within<T>(ms: number, p: Promise<T>): Promise<T> {
  return Promise.race([
    p,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`the seam held the caller past ${ms}ms of the bound`)),
        ms,
      ),
    ),
  ]);
}

/** The worker a deal landed on — the one that took a `generate` frame. */
const dealWorker = () => workers.find((w) => w.seen.some((r) => r.kind === "generate"));

describe("the solver seam — a long deal may not hold the estate (T9-W4 §4.1)", () => {
  it("a blocked thermo deal does not delay a sudoku solve", async () => {
    const thermo = clientFor("thermo");
    const sudoku = clientFor("sudoku");

    // The 16×16 HARD deal goes out and its worker blocks, exactly as the wasm dig does.
    const deal = thermo.getRandomBoard(4, "HARD");
    await Promise.resolve();
    const dealt = dealWorker();
    expect(dealt).toBeDefined();

    // The other game's solve must come back while that deal is STILL in flight.
    const solved = await within(250, sudoku.solveBoard({ "0": 1 }, 2, undefined));
    expect(solved.solved).toBe(true);

    // And it must have come back because it rode a DIFFERENT worker, not because the deal
    // quietly finished: the blocked worker never saw the solve frame at all.
    expect(dealt!.seen.some((r) => r.kind === "solve")).toBe(false);
    expect(workers.length).toBeGreaterThan(1);

    dealt!.finishDeal();
    await expect(deal).resolves.toMatchObject({ clue: undefined });
  });

  it("a propagate is served too, with a deal blocked", async () => {
    const thermo = clientFor("thermo");
    const sudoku = clientFor("sudoku");
    void thermo.getRandomBoard(4, "HARD");
    await Promise.resolve();

    const masks = await within(250, sudoku.propagateBoard({ "0": 1 }, 2, undefined));
    expect(masks.length).toBe(16);
  });

  it("the deal leash terminates the worker and names the fault", async () => {
    vi.useFakeTimers();
    const thermo = clientFor("thermo");
    const deal = thermo.getRandomBoard(4, "HARD");
    const rejected = expect(deal).rejects.toMatchObject({ code: "DEAL_TIMEOUT" });

    await vi.advanceTimersByTimeAsync(client.DEAL_LEASH_MS);
    await rejected;
    // `terminate` is the ONLY cancel a synchronous wasm call has — the leash must use it.
    expect(dealWorker()!.terminated).toBe(true);
  });

  it("the leashed fault reads as a paper note that names the way out", () => {
    const fiction = classifyCode("DEAL_TIMEOUT");
    expect(fiction).toMatchObject({ kind: "paper-note", variant: "deal-timeout" });
    if (fiction.kind !== "paper-note") throw new Error("expected the paper note");
    expect(fiction.message).toBe(
      "this deal is taking too long. try again or pick a smaller board.",
    );
    expect(fiction.retryable).toBe(true);
  });

  it("a superseded deal terminates its worker instead of grinding on", async () => {
    const thermo = clientFor("thermo");
    void thermo.getRandomBoard(4, "HARD");
    await Promise.resolve();
    const first = dealWorker();
    expect(first).toBeDefined();

    // A second deal supersedes the first. The abandoned dig must not keep burning the CPU it
    // holds; the estate's own deal rule is latest-wins, and this is that rule at the worker.
    const second = thermo.getRandomBoard(2, "EASY");
    expect(first!.terminated).toBe(true);

    const nowDealing = workers[workers.length - 1]!;
    nowDealing.finishDeal();
    await expect(within(250, second)).resolves.toBeDefined();
  });

  it("solves keep the resident worker hot: a leashed deal never terminates it", async () => {
    vi.useFakeTimers();
    const sudoku = clientFor("sudoku");
    const thermo = clientFor("thermo");

    const first = sudoku.solveBoard({ "0": 1 }, 2, undefined);
    await vi.advanceTimersByTimeAsync(0);
    await first;
    const resident = workers.find((w) => w.seen.some((r) => r.kind === "solve"))!;

    const deal = thermo.getRandomBoard(4, "HARD");
    const rejected = expect(deal).rejects.toMatchObject({ code: "DEAL_TIMEOUT" });
    await vi.advanceTimersByTimeAsync(client.DEAL_LEASH_MS);
    await rejected;

    // The leash took the deal's worker and nothing else: the next solve does not pay a cold
    // wasm instantiation for a deal that misbehaved on another thread.
    expect(resident.terminated).toBe(false);
    const after = sudoku.solveBoard({ "0": 1 }, 2, undefined);
    await vi.advanceTimersByTimeAsync(0);
    await expect(after).resolves.toMatchObject({ solved: true });
    expect(resident.seen.filter((r) => r.kind === "solve").length).toBe(2);
  });
});

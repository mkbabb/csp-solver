/**
 * THE PARITY GATE for the solver-spine collapse (T5-W2 2.2c / F3).
 *
 * Grep rows are not a gate (MEASURE law 4): "one worker, one protocol" is provable by counting,
 * but "the one client posts what the five posted" is not. This file is that proof. It stands a
 * FAKE Worker in front of the transport and asserts, per family, the exact frame each verb puts
 * on the wire and the exact shape each verb returns — against fixtures read off the five deleted
 * `useSolver.ts`/`protocol.ts` pairs at `e63af853`, which are the record of what the estate did
 * before the collapse.
 *
 * The five facts a per-game client used to hold, and where each now comes from:
 *
 *   the wasm family      → `game`, the one place a game names itself on this seam
 *   the cells arithmetic → `boardSide`, the model's OWN `boardSizeOf` (`dim⁴` boxed, `dim²` latin)
 *   the clue buffer      → `spec.clues`' codec pair, or `null` → an empty buffer
 *   the template bank    → `templates`, or `null` → an empty buffer
 *   the tier ordinal     → one `DIFFICULTY_ORDINAL`, where there were five identical copies
 *
 * No wasm runs here, and none needs to: what a collapse can break is the MARSHALLING, and the
 * marshalling is entirely this side of `postMessage`. The codecs are stubbed rather than
 * imported — `games/shared` never reaches into a game (2.5), and each real codec is pinned to
 * its seam in that game's own `clue.test.ts`.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createSolverClient, type ClueCodec } from "./client";
import type { SolverRequest, SolverResponse } from "./protocol";

/** Every request the fake worker was handed this test, in order. */
let posted: SolverRequest[] = [];
/** What the fake worker answers with. `null` leaves the call pending. */
let reply: (req: SolverRequest) => SolverResponse | null;

class FakeWorker {
  private listeners: ((e: MessageEvent<SolverResponse>) => void)[] = [];
  addEventListener(type: string, fn: (e: MessageEvent<SolverResponse>) => void) {
    if (type === "message") this.listeners.push(fn);
  }
  removeEventListener() {}
  terminate() {}
  postMessage(req: SolverRequest) {
    posted.push(req);
    const res = reply(req);
    if (!res) return;
    // Async, like a real worker: the client's promise must still be pending when this returns.
    queueMicrotask(() => {
      for (const fn of this.listeners)
        fn({ data: res } as MessageEvent<SolverResponse>);
    });
  }
}

beforeEach(() => {
  posted = [];
  reply = () => null;
  vi.stubGlobal("Worker", FakeWorker);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

/** The one solve frame the worker answers with — the five games' `SolveResponse` was this,
 *  minus a dim echo nothing ever read. */
function solveReply(id: number, cells: number): SolverResponse {
  return {
    id,
    ok: true,
    kind: "solve",
    solved: true,
    solutionCount: 1,
    solutions: new Uint32Array(cells).fill(4),
    backtracks: "7",
    nodesExplored: "31",
    propagations: "129",
    budgetExceeded: false,
    elapsedMs: 1.5,
  };
}

function generateReply(id: number, cells: number, clue: number[]): SolverResponse {
  return {
    id,
    ok: true,
    kind: "generate",
    board: new Uint32Array(cells),
    clue: new Uint32Array(clue),
  };
}

/** A length-prefixed group codec — the shape thermo's tubes and both cage families share. */
const groupCodec: ClueCodec<number[][]> = {
  encode: (groups) => {
    const buf = new Uint32Array(groups.reduce((n, g) => n + 1 + g.length, 0));
    let i = 0;
    for (const g of groups) {
      buf[i++] = g.length;
      for (const c of g) buf[i++] = c;
    }
    return buf;
  },
  decode: (flat) => {
    const out: number[][] = [];
    let i = 0;
    while (i < flat.length) {
      const k = flat[i++];
      const g: number[] = [];
      for (let j = 0; j < k && i < flat.length; j++) g.push(flat[i++]);
      out.push(g);
    }
    return out;
  },
};

/** The two geometries, as the five models declare them in their own `boardSizeOf`. */
const boxed = (n: number) => n ** 2;
const latin = (n: number) => n;

/** A stand-in search cap. The real tables live on the five specs; this file proves the
 *  MARSHALLING, so any function will do — what matters is that the frame carries it. */
const budget = (dim: number) => 1_000 * dim;

const unclued = () =>
  createSolverClient<void>({
    game: "sudoku",
    boardSide: boxed,
    clue: null,
    templates: null,
    nodeBudget: budget,
  });

describe("the one solver client — what each family puts on the one wire", () => {
  it("sudoku: a TEMPLATE buffer, no clue buffer, dim⁴ cells", async () => {
    const templates = vi.fn(() => new Uint32Array([1, 2, 3]));
    const client = createSolverClient<void>({
      game: "sudoku",
      boardSide: boxed,
      clue: null,
      templates,
      nodeBudget: budget,
    });
    reply = (req) => generateReply(req.id, 16, []);
    const dealt = await client.getRandomBoard(2, "MEDIUM");

    const gen = posted[0];
    expect(gen).toMatchObject({
      game: "sudoku",
      kind: "generate",
      dim: 2,
      difficulty: 1,
    });
    expect(templates).toHaveBeenCalledWith(2, "MEDIUM");
    if (gen.kind !== "generate") throw new Error("expected a generate frame");
    expect(Array.from(gen.templates)).toEqual([1, 2, 3]);
    // A 2×2 sudoku board is 4×4 = 16 cells: `boardSide(2)² = (2²)² = 16`.
    expect(Object.keys(dealt.values)).toHaveLength(16);
    // `clues: null` is a STATED absence: `void` is what a clue-less game is dealt.
    expect(dealt.clue).toBeUndefined();
  });

  it("sudoku: solve flattens dim⁴ cells and sends an EMPTY clue buffer", async () => {
    const client = unclued();
    reply = (req) => solveReply(req.id, 16);
    const result = await client.solveBoard({ "0": 5 }, 2, undefined, 200_000);

    const solve = posted[0];
    if (solve.kind !== "solve") throw new Error("expected a solve frame");
    expect(solve).toMatchObject({ game: "sudoku", dim: 2, nodeBudget: 200_000 });
    expect(solve.board.length).toBe(16);
    expect(solve.board[0]).toBe(5);
    expect(solve.clue.length).toBe(0);
    // First-solution, exactly as all five clients posted it.
    expect(solve.maxSolutions).toBe(1);
    // The wasm bigint-strings are parsed back to numbers for the W6 stat-line.
    expect(result).toMatchObject({
      solved: true,
      backtracks: 7,
      nodesExplored: 31,
      propagations: 129,
      solutionCount: 1,
      budgetExceeded: false,
      elapsedMs: 1.5,
    });
    expect(Object.keys(result.values)).toHaveLength(16);
  });

  it("futoshiki: a LATIN board is dim² cells, and the clue rides beside it", async () => {
    const pairs: ClueCodec<[number, number][]> = {
      encode: (ineqs) => Uint32Array.from(ineqs.flat()),
      decode: (flat) => {
        const out: [number, number][] = [];
        for (let i = 0; i + 1 < flat.length; i += 2) out.push([flat[i], flat[i + 1]]);
        return out;
      },
    };
    const client = createSolverClient({
      game: "futoshiki",
      boardSide: latin,
      clue: pairs,
      templates: null,
      nodeBudget: budget,
    });
    reply = (req) => solveReply(req.id, 25);
    await client.solveBoard({ "0": 3 }, 5, [
      [1, 0],
      [7, 8],
    ]);

    const solve = posted[0];
    if (solve.kind !== "solve") throw new Error("expected a solve frame");
    expect(solve.game).toBe("futoshiki");
    // A Latin board side IS the raw selector value: 5×5 = 25 cells, never 5⁴.
    expect(solve.board.length).toBe(25);
    expect(Array.from(solve.clue)).toEqual([1, 0, 7, 8]);
    // No budget ARGUMENT passed → the frame carries THIS GAME's own cap (T5-W2 row 4: the
    // budget is `spec.solver.nodeBudget`, held by the client, not threaded by the machine).
    // It was `undefined` here before, which meant the wasm's flat 1,000,000-node default was
    // what a caller that forgot the argument got.
    expect(solve.nodeBudget).toBe(budget(5));
  });

  it("thermo/killer/kenken: the dealt clue comes back DECODED, and the bank is empty", async () => {
    const client = createSolverClient({
      game: "thermo",
      boardSide: boxed,
      clue: groupCodec,
      templates: null,
      nodeBudget: budget,
    });
    reply = (req) => generateReply(req.id, 16, [3, 0, 1, 2, 2, 10, 11]);
    const dealt = await client.getRandomBoard(2, "HARD");

    const gen = posted[0];
    if (gen.kind !== "generate") throw new Error("expected a generate frame");
    expect(gen).toMatchObject({ game: "thermo", difficulty: 2 });
    // A family that digs live sends an EMPTY bank, not an absent field.
    expect(gen.templates.length).toBe(0);
    expect(dealt.clue).toEqual([
      [0, 1, 2],
      [10, 11],
    ]);
  });

  it("propagate carries the clue too, and hands the masks back untouched", async () => {
    const client = createSolverClient({
      game: "killer",
      boardSide: boxed,
      clue: groupCodec,
      templates: null,
      nodeBudget: budget,
    });
    reply = (req) => ({
      id: req.id,
      ok: true,
      kind: "propagate",
      masks: new Uint32Array([0b110, 0b101]),
    });
    const masks = await client.propagateBoard({ "0": 0 }, 2, [[0, 1]]);

    const prop = posted[0];
    if (prop.kind !== "propagate") throw new Error("expected a propagate frame");
    expect(prop.game).toBe("killer");
    expect(prop.board.length).toBe(16);
    expect(Array.from(prop.clue)).toEqual([2, 0, 1]);
    expect(Array.from(masks)).toEqual([0b110, 0b101]);
  });

  it("the three tiers map to the ordinals all five clients used", async () => {
    const client = unclued();
    reply = (req) => generateReply(req.id, 16, []);
    for (const tier of ["EASY", "MEDIUM", "HARD"] as const) {
      await client.getRandomBoard(2, tier);
    }
    expect(posted.map((p) => (p.kind === "generate" ? p.difficulty : -1))).toEqual([
      0, 1, 2,
    ]);
  });

  it("a solved board reads the solution; an UNSAT one keeps the caller's values", async () => {
    const client = unclued();
    const given = { "0": 5 };

    reply = (req) => ({ ...solveReply(req.id, 16), solved: false });
    const unsat = await client.solveBoard(given, 2, undefined);
    // `solved=false` iff the given cells conflict with every completion — the caller's board
    // stands, identically to what the five clients returned.
    expect(unsat.values).toBe(given);

    // The solutions buffer may carry more than the one board; only the first dim⁴ cells are ours.
    reply = (req) => solveReply(req.id, 40);
    const sat = await client.solveBoard(given, 2, undefined);
    expect(Object.keys(sat.values)).toHaveLength(16);
  });

  it("an ok:false frame surfaces the typed SolverError, not a wrong answer", async () => {
    const client = unclued();
    reply = (req) => ({
      id: req.id,
      ok: false,
      code: "BUDGET_EXCEEDED",
      message: "gave up at node budget",
    });
    await expect(client.solveBoard({}, 2, undefined, 10)).rejects.toMatchObject({
      code: "BUDGET_EXCEEDED",
      message: "gave up at node budget",
    });
  });

  it("a MALFORMED success frame is a failure, never a silently-empty board", async () => {
    const client = unclued();
    // The worker answered the right id with the wrong op — the narrowing must not fall through.
    reply = (req) => ({ id: req.id, ok: true, kind: "ping" });
    await expect(client.getRandomBoard(2, "EASY")).rejects.toMatchObject({
      code: "WORKER_FAILURE",
    });
  });

  it("ONE transport serves all five families — the id counter proves it is shared", async () => {
    reply = (req) => generateReply(req.id, 4, []);
    const clients = (
      ["sudoku", "futoshiki", "thermo", "killer", "kenken"] as const
    ).map((game) =>
      createSolverClient<void>({
        game,
        boardSide: latin,
        clue: null,
        templates: null,
        nodeBudget: budget,
      }),
    );
    for (const c of clients) await c.getRandomBoard(2, "EASY");

    expect(posted.map((p) => p.kind === "generate" && p.game)).toEqual([
      "sudoku",
      "futoshiki",
      "thermo",
      "killer",
      "kenken",
    ]);
    // Five clients, one monotonic id sequence: a second transport would have restarted it,
    // and a second transport is a second Worker.
    const ids = posted.map((p) => p.id);
    expect(new Set(ids).size).toBe(5);
    expect([...ids].sort((a, b) => a - b)).toEqual(ids);
  });
});

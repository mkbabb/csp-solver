/**
 * THE solver client — one transport, one Worker, five games (T5-W2 2.2 / F3).
 *
 * Five `useSolver.ts` files (839 raw lines) each held a module-level `createSolverTransport`
 * call, which meant five Workers, five wasm instantiations, five copies of the same three
 * marshalling functions (`toFlat`/`toRecord`/`DIFFICULTY_ORDINAL`) and five copies of the same
 * `res.ok && res.kind === "…"` narrowing. The transport was already shared; what was not shared
 * was the decision to have ONE of it.
 *
 * It has one now. The `transport` below is a module singleton over the one
 * `solver.worker.ts`, and `createSolverClient` is a pure per-game FACADE over it — it holds no
 * state, so constructing it twice costs nothing and every game's board still rides the same hot
 * worker. A lazy game's first deal no longer pays a cold wasm instantiation the eager game
 * already paid.
 *
 * What a game still supplies is only what a game alone knows:
 *
 *   `game`      — which wasm family (the binary exports five).
 *   `boardSide` — the model's OWN `boardSizeOf`, handed here rather than re-derived: `dim⁴`
 *                 cells for a boxed family, `dim²` for a Latin one, from one function that is
 *                 already written one line away in `useGameState`'s domain slots.
 *   `clue`      — `spec.clues`' codec pair, or `null` — the same stated absence sudoku's spec
 *                 declares, carried through to an empty wire buffer.
 *   `templates` — the generation bank, or `null` where the family digs live.
 */
import { SolverError } from "./solverError";
import { createSolverTransport } from "./transport";
import type { GameId, SolverRequest, SolverResponse } from "./protocol";

/**
 * THE Worker. One `new Worker` in the whole estate (`solverSpine.workers: 1`), over the one
 * `?url` contract site the worker module owns.
 */
const transport = createSolverTransport<SolverRequest, SolverResponse>({
  createWorker: () =>
    new Worker(new URL("./solver.worker.ts", import.meta.url), { type: "module" }),
  tag: "solver",
});

/**
 * Cold-start prewarm (T3-W8 §cold-start, A17 P1): spin the Worker up and ping it so the wasm
 * instantiates while the main thread is idle, ahead of the first real solve/generate. The gain
 * only exists against the built `dist/` (dev fetch is instant); `GameShell` calls it from mount
 * via `requestIdleCallback`.
 *
 * It is imported from HERE, not read off a spec: with one worker there is one warm, and asking
 * each game for its own would be five handles onto one act. This is the death `spec.solver`'s
 * F1 `prewarm` amendment scheduled for itself, and the slot is back to the charter's `{
 * nodeBudget }`. Idempotent — every mount after the first is a no-op.
 */
export const prewarm = transport.prewarm;

/** The three tiers every one of the five games grades on, and their wasm ordinals. It was this
 *  same three-entry record, five times. */
type Tier = "EASY" | "MEDIUM" | "HARD";
const DIFFICULTY_ORDINAL: Record<Tier, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

/** `spec.clues`' wire head, structurally — the codec pair the seam already declares. */
export interface ClueCodec<TClue> {
  encode: (clue: TClue) => Uint32Array<ArrayBuffer>;
  decode: (buf: Uint32Array, dim: number) => TClue;
}

export interface SolverClientConfig<TClue> {
  /** which wasm family — the one place a game names itself on this seam. */
  game: GameId;
  /** the board SIDE for a raw selector size: the model's own `boardSizeOf`, one home. */
  boardSide: (dim: number) => number;
  /** the clue codec pair, or `null` for a game that prints no clue furniture (sudoku). */
  clue: ClueCodec<TClue> | null;
  /** the generation bank, or `null` for a family that digs live (all but sudoku). */
  templates: ((dim: number, difficulty: Tier) => Uint32Array<ArrayBuffer>) | null;
}

/** A dealt puzzle: the board, and the clue furniture it was dealt with. */
interface DealtBoard<TClue> {
  values: Record<string, number>;
  clue: TClue;
}

interface SolveResult {
  solved: boolean;
  values: Record<string, number>;
  /** `true` when the search gave up at its node budget without finding a solution-consistent
   *  completion of the given cells — distinct from provable UNSAT (`solved: false`). */
  budgetExceeded?: boolean;
  /** Search backtracks, tree nodes visited and domain-propagation steps — the W6 stat-line's
   *  machine-effort telemetry, each a worker bigint-string parsed here. */
  backtracks: number;
  nodesExplored: number;
  propagations: number;
  solutionCount: number;
  /** Wall-clock ms of the wasm call, measured inside the worker. */
  elapsedMs?: number;
}

export interface SolverClient<TClue> {
  getRandomBoard: (dim: number, difficulty: Tier) => Promise<DealtBoard<TClue>>;
  solveBoard: (
    values: Record<string, number>,
    dim: number,
    clue: TClue,
    nodeBudget?: number,
  ) => Promise<SolveResult>;
  propagateBoard: (
    values: Record<string, number>,
    dim: number,
    clue: TClue,
  ) => Promise<Uint32Array>;
}

/** An empty buffer, fresh per call — it is TRANSFERRED, and a transferred buffer is detached. */
const empty = (): Uint32Array<ArrayBuffer> => new Uint32Array(0);

export function createSolverClient<TClue>(
  config: SolverClientConfig<TClue>,
): SolverClient<TClue> {
  const cellsOf = (dim: number): number => config.boardSide(dim) ** 2;
  const encodeClue = (clue: TClue): Uint32Array<ArrayBuffer> =>
    config.clue ? config.clue.encode(clue) : empty();
  // `clues: null` is a STATED absence, and `void` is what a game with no clue furniture deals:
  // sudoku's spec is `GameSpec<…, void>`, so this is its clue, exactly typed.
  const decodeClue = (buf: Uint32Array, dim: number): TClue =>
    config.clue ? config.clue.decode(buf, dim) : (undefined as TClue);

  function toFlat(
    dim: number,
    values: Record<string, number>,
  ): Uint32Array<ArrayBuffer> {
    const buf = new Uint32Array(cellsOf(dim));
    for (const [k, v] of Object.entries(values)) buf[Number(k)] = v;
    return buf;
  }

  function toRecord(board: Uint32Array): Record<string, number> {
    const o: Record<string, number> = {};
    board.forEach((v, i) => {
      o[i] = v;
    });
    return o;
  }

  async function getRandomBoard(
    dim: number,
    difficulty: Tier,
  ): Promise<DealtBoard<TClue>> {
    const templates = config.templates ? config.templates(dim, difficulty) : empty();
    const id = transport.nextId();
    const res = await transport.call(
      {
        id,
        game: config.game,
        kind: "generate",
        dim,
        difficulty: DIFFICULTY_ORDINAL[difficulty],
        seed: Date.now(),
        templates,
      },
      [templates.buffer],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "generate") {
      return { values: toRecord(res.board), clue: decodeClue(res.clue, dim) };
    }
    throw new SolverError("WORKER_FAILURE", "malformed generate response");
  }

  /**
   * `nodeBudget` is optional and defaults to the wasm surface's own default (1,000,000 nodes,
   * `SolveConfig::default()`). A caller that wants a browser-tab-scale cap can pass a tighter
   * value; exhausting it surfaces a typed `BUDGET_EXCEEDED` `SolverError` — an `instanceof
   * Error`, `.code`-bearing exception rather than a silently-wrong `solved: false`.
   */
  async function solveBoard(
    values: Record<string, number>,
    dim: number,
    clue: TClue,
    nodeBudget?: number,
  ): Promise<SolveResult> {
    const board = toFlat(dim, values);
    const clueBuf = encodeClue(clue);
    const id = transport.nextId();
    const res = await transport.call(
      {
        id,
        game: config.game,
        kind: "solve",
        dim,
        board,
        clue: clueBuf,
        maxSolutions: 1,
        nodeBudget,
      },
      [board.buffer, clueBuf.buffer],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "solve") {
      return {
        solved: res.solved,
        // `solved=false` iff the given cells conflict with every completion.
        values: res.solved ? toRecord(res.solutions.subarray(0, cellsOf(dim))) : values,
        budgetExceeded: res.budgetExceeded,
        backtracks: Number(res.backtracks),
        nodesExplored: Number(res.nodesExplored),
        propagations: Number(res.propagations),
        solutionCount: res.solutionCount,
        elapsedMs: res.elapsedMs,
      };
    }
    throw new SolverError("WORKER_FAILURE", "malformed solve response");
  }

  /**
   * Propagate-only (W6 beat 9 — engine-domains pencil marks): run the solver's own root
   * AC-3/GAC over the current board + clue furniture and return each cell's surviving candidate
   * bitmask — bit v set ⇔ value v (1-based) remains. No search, no node budget; a contradictory
   * board rejects with a typed `UNSAT` `SolverError` (the caller treats that as "no marks to
   * show", never as broken machinery).
   */
  async function propagateBoard(
    values: Record<string, number>,
    dim: number,
    clue: TClue,
  ): Promise<Uint32Array> {
    const board = toFlat(dim, values);
    const clueBuf = encodeClue(clue);
    const id = transport.nextId();
    const res = await transport.call(
      { id, game: config.game, kind: "propagate", dim, board, clue: clueBuf },
      [board.buffer, clueBuf.buffer],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "propagate") return res.masks;
    throw new SolverError("WORKER_FAILURE", "malformed propagate response");
  }

  return { getRandomBoard, solveBoard, propagateBoard };
}

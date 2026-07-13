/**
 * Client-side wasm solve/generate path for Futoshiki — the only shipped solve
 * surface. The Futoshiki sibling of
 * `games/sudoku/solver/useSolver.ts`: same off-main-thread Worker discipline,
 * same `BoardResponse`/`SolveResponse` shapes consumed by `useFutoshiki.ts`.
 *
 * Zero `/api/v1/*` dependency of any kind — no fetch, no `/config` handshake, no
 * server to depend on. Unlike Sudoku there is no
 * template bank: generation is a fresh wasm `generateFutoshiki` call each time (seeded
 * from `Date.now()`), returning the given grid AND the printed inequality furniture.
 *
 * The wasm module only ever runs inside `solver.worker.ts` (off the DOM thread); see
 * that file's header. The `@mkbabb/csp-solver-wasm` import there is the package name —
 * the W12 registry swap flips only `package.json`, no source change.
 *
 * The Worker singleton + pending map + bounded respawn live in the shared
 * `@games/shared/solver/transport`; this file keeps only the Futoshiki-specific board +
 * inequality marshalling and request/response shapes.
 */
import type { Difficulty, Inequality } from "../types";
import { SolverError } from "@games/shared/solver/solverError";
import { createSolverTransport } from "@games/shared/solver/transport";
import type { SolverRequest, SolverResponse } from "./protocol";

export interface BoardResponse {
  values: Record<string, number>;
  boardSize: number;
  /** The printed `[greater, lesser]` inequality furniture for this board. */
  inequalities: Inequality[];
}

export interface SolveResponse {
  solved: boolean;
  values: Record<string, number>;
  /** `true` when the search gave up at its node budget without a solution-consistent
   * completion — distinct from provable UNSAT (`solved: false`). */
  budgetExceeded?: boolean;
  /** Search backtracks — already on the wire (worker `backtracks`, a bigint
   * carried as string); parsed here for the W6 stat-line. */
  backtracks: number;
  /** Search-tree nodes visited + domain-propagation steps — the telemetry
   * twins of `backtracks` (T4-W7 free-win getters), each a worker bigint-string
   * parsed here for the stat-line. */
  nodesExplored: number;
  propagations: number;
  solutionCount: number;
  /** Wall-clock ms of the wasm call, measured inside the worker. */
  elapsedMs?: number;
}

// The wasm `FutoshikiDifficulty` is numeric (Easy/Medium/Hard = 0/1/2); the wire
// carries the ordinal (structured-clone-safe), the worker re-narrows to the enum. Twin of
// the sudoku useSolver's `DIFFICULTY_ORDINAL`.
const DIFFICULTY_ORDINAL: Record<Difficulty, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

const transport = createSolverTransport<SolverRequest, SolverResponse>({
  createWorker: () =>
    new Worker(new URL("./solver.worker.ts", import.meta.url), { type: "module" }),
  tag: "futoshiki-solver",
});

/**
 * Cold-start prewarm (T3-W8 §cold-start, A17 P1): spin the Worker up and ping it so the
 * wasm instantiates while the main thread is idle, ahead of the first real solve/generate.
 * The gain only exists against the built `dist/` (dev fetch is instant); called from
 * Futoshiki's own (async) scene mount via `requestIdleCallback`.
 */
export const prewarm = transport.prewarm;

function toFlatBoard(
  boardSize: number,
  values: Record<string, number>,
): Uint32Array<ArrayBuffer> {
  const buf = new Uint32Array(boardSize * boardSize);
  for (const [k, v] of Object.entries(values)) buf[Number(k)] = v;
  return buf;
}

function toFlatInequalities(inequalities: Inequality[]): Uint32Array<ArrayBuffer> {
  const buf = new Uint32Array(inequalities.length * 2);
  inequalities.forEach(([a, b], i) => {
    buf[i * 2] = a;
    buf[i * 2 + 1] = b;
  });
  return buf;
}

function toRecord(board: Uint32Array): Record<string, number> {
  const o: Record<string, number> = {};
  board.forEach((v, i) => {
    o[i] = v;
  });
  return o;
}

function toPairs(flat: Uint32Array): Inequality[] {
  const out: Inequality[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) out.push([flat[i], flat[i + 1]]);
  return out;
}

export function useSolver() {
  async function getRandomBoard(
    boardSize: number,
    difficulty: Difficulty,
  ): Promise<BoardResponse> {
    const id = transport.nextId();
    const res = await transport.call(
      {
        id,
        kind: "generate",
        boardSize,
        difficulty: DIFFICULTY_ORDINAL[difficulty],
        seed: Date.now(),
      },
      [],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "generate") {
      return {
        values: toRecord(res.board),
        boardSize: res.boardSize,
        inequalities: toPairs(res.inequalities),
      };
    }
    throw new SolverError("WORKER_FAILURE", "malformed generate response");
  }

  async function solveBoard(
    values: Record<string, number>,
    boardSize: number,
    inequalities: Inequality[],
    nodeBudget?: number,
  ): Promise<SolveResponse> {
    const board = toFlatBoard(boardSize, values);
    const flatIneqs = toFlatInequalities(inequalities);
    const id = transport.nextId();
    const res = await transport.call(
      {
        id,
        kind: "solve",
        board,
        boardSize,
        inequalities: flatIneqs,
        maxSolutions: 1,
        nodeBudget,
      },
      [board.buffer, flatIneqs.buffer],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "solve") {
      const cells = boardSize * boardSize;
      return {
        solved: res.solved,
        values: res.solved ? toRecord(res.solutions.subarray(0, cells)) : values,
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
   * Propagate-only (W6 beat 9 — engine-domains pencil marks, twin of the
   * Sudoku composable's): run the solver's own root AC-3/GAC over the current
   * board + inequality furniture and return each cell's surviving candidate
   * bitmask — bit v set ⇔ value v (1-based) remains. No search, no node
   * budget; a contradictory board rejects with a typed `UNSAT` `SolverError`
   * (the caller treats that as "no marks to show", never as broken machinery).
   */
  async function propagateBoard(
    values: Record<string, number>,
    boardSize: number,
    inequalities: Inequality[],
  ): Promise<Uint32Array> {
    const board = toFlatBoard(boardSize, values);
    const flatIneqs = toFlatInequalities(inequalities);
    const id = transport.nextId();
    const res = await transport.call(
      { id, kind: "propagate", board, boardSize, inequalities: flatIneqs },
      [board.buffer, flatIneqs.buffer],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "propagate") return res.masks;
    throw new SolverError("WORKER_FAILURE", "malformed propagate response");
  }

  return { getRandomBoard, solveBoard, propagateBoard };
}

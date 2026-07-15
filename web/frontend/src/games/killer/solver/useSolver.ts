/**
 * Client-side wasm solve/generate/propagate path for Killer-Sudoku — the only shipped
 * solve surface (zero-backend deploy), the twin of the Sudoku/Futoshiki/Thermo `useSolver`s
 * (T4-W13). Produces the `{ values, cages }` / `SolveResponse` shapes `useKiller` consumes,
 * threading the cage clue furniture through solve + propagate exactly as Futoshiki threads
 * its inequalities.
 *
 * Zero `/api/v1/*` dependency. Killer generation is hole-dig (no template bank), so
 * `getRandomBoard` deals directly from the wasm generator and returns the board plus its
 * dealt cages. Difficulty reuses the sudoku `Difficulty` axis (a Killer-Sudoku IS a Sudoku
 * variant); the tiers stay per the sudoku `types.ts`, no fourth mirror.
 */
import type { Difficulty } from "@games/sudoku/types";
import type { KillerCage } from "../types";
import { SolverError } from "@games/shared/solver/solverError";
import { createSolverTransport } from "@games/shared/solver/transport";
import type { SolverRequest, SolverResponse } from "./protocol";
import { encodeCages, decodeCages } from "./killerWire";

export interface BoardResponse {
  values: Record<string, number>;
  size: number;
  /** The dealt puzzle's cage furniture (contiguous all-different sum-cages). */
  cages: KillerCage[];
}

export interface SolveResponse {
  solved: boolean;
  values: Record<string, number>;
  budgetExceeded?: boolean;
  backtracks: number;
  nodesExplored: number;
  propagations: number;
  solutionCount: number;
  elapsedMs?: number;
}

const DIFFICULTY_ORDINAL: Record<Difficulty, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

const transport = createSolverTransport<SolverRequest, SolverResponse>({
  createWorker: () =>
    new Worker(new URL("./solver.worker.ts", import.meta.url), { type: "module" }),
  tag: "killer-solver",
});

// NOTE: the sudoku/futoshiki `useSolver`s also export a `prewarm` (the cold-start Worker
// spin-up their eager scene calls on mount). Killer's mountable scene rides the W12 joint
// seal, so there is no consumer yet — `prewarm` is re-added when that scene lands rather
// than exported dead here (knip).

function toFlat(
  size: number,
  values: Record<string, number>,
): Uint32Array<ArrayBuffer> {
  const m = size * size;
  const buf = new Uint32Array(m * m);
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

export function useSolver() {
  async function getRandomBoard(
    size: number,
    difficulty: Difficulty,
  ): Promise<BoardResponse> {
    const id = transport.nextId();
    const res = await transport.call(
      {
        id,
        kind: "generate",
        n: size,
        difficulty: DIFFICULTY_ORDINAL[difficulty],
        seed: Date.now(),
      },
      [],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "generate") {
      return {
        values: toRecord(res.board),
        size,
        cages: decodeCages(res.cages),
      };
    }
    throw new SolverError("WORKER_FAILURE", "malformed generate response");
  }

  async function solveBoard(
    values: Record<string, number>,
    size: number,
    cages: KillerCage[],
    nodeBudget?: number,
  ): Promise<SolveResponse> {
    const board = toFlat(size, values);
    const cageBuf = encodeCages(cages);
    const id = transport.nextId();
    const res = await transport.call(
      {
        id,
        kind: "solve",
        board,
        n: size,
        cages: cageBuf,
        maxSolutions: 1,
        nodeBudget,
      },
      [board.buffer, cageBuf.buffer],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "solve") {
      return {
        solved: res.solved,
        values: res.solved ? toRecord(res.solutions.subarray(0, size ** 4)) : values,
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

  async function propagateBoard(
    values: Record<string, number>,
    size: number,
    cages: KillerCage[],
  ): Promise<Uint32Array> {
    const board = toFlat(size, values);
    const cageBuf = encodeCages(cages);
    const id = transport.nextId();
    const res = await transport.call(
      { id, kind: "propagate", board, n: size, cages: cageBuf },
      [board.buffer, cageBuf.buffer],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "propagate") return res.masks;
    throw new SolverError("WORKER_FAILURE", "malformed propagate response");
  }

  return { getRandomBoard, solveBoard, propagateBoard };
}

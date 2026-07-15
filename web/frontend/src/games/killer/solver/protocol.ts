import type {
  PingRequest,
  PingResponse,
  SolverErrorResponse,
} from "@games/shared/solver/protocol";

/**
 * Killer-Sudoku's solver Worker wire protocol. The game-agnostic frames (`ping`, the
 * `ok: false` error frame) are single-sourced in `@games/shared/solver/protocol`; this
 * file carries only the game-specific members.
 *
 * Killer threads its cage furniture the way Futoshiki threads its carets and Thermo its
 * tubes: a *separate* flat `Uint32Array` alongside the board. Cages are variable-size, so
 * the buffer is LENGTH-PREFIXED WITH THE SUM — `[k0, s0, c0_0, …, k1, s1, c1_0, …]`, a
 * count `k`, a target sum `s`, then `k` cells — the exact wire the wasm
 * `solveKiller`/`propagateKiller`/`generateKiller` surface decodes. Keeping the cages out
 * of the board buffer is what lets both marshal as tier-2 bulk-`memcpy` `Uint32Array`s.
 */

/** Requests the main thread can post to `solver.worker.ts`. */
export type SolverRequest =
  | {
      id: number;
      kind: "solve";
      board: Uint32Array;
      n: number;
      /** Length-prefixed flat cage buffer (`[k, sum, c, c, …]` per cage). */
      cages: Uint32Array;
      maxSolutions?: number;
      nodeBudget?: number;
    }
  | {
      id: number;
      kind: "generate";
      n: number;
      difficulty: number; // SudokuDifficulty ordinal (0/1/2) — Killer reuses the sudoku axis
      seed: number;
    }
  | {
      id: number;
      kind: "propagate";
      board: Uint32Array;
      n: number;
      cages: Uint32Array;
    }
  | PingRequest;

/** Responses the worker posts back, correlated by `id`. */
export type SolverResponse =
  | {
      id: number;
      ok: true;
      kind: "solve";
      solved: boolean;
      solutionCount: number;
      n: number;
      solutions: Uint32Array;
      backtracks: string; // bigint -> string, structured-clone-safe & JSON-safe
      nodesExplored: string;
      propagations: string;
      budgetExceeded: boolean;
      elapsedMs: number;
    }
  | {
      id: number;
      ok: true;
      kind: "generate";
      board: Uint32Array;
      /** Length-prefixed flat cage buffer of the dealt puzzle. */
      cages: Uint32Array;
    }
  | {
      id: number;
      ok: true;
      kind: "propagate";
      n: number;
      /** One u32 per cell; bit v set ⇔ value v (1-based) survives AC-3/GAC propagation. */
      masks: Uint32Array;
    }
  | PingResponse
  | SolverErrorResponse;

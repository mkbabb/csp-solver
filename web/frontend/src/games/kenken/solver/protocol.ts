import type {
  PingRequest,
  PingResponse,
  SolverErrorResponse,
} from "@games/shared/solver/protocol";

/**
 * KenKen / Calcudoku's solver Worker wire protocol. The game-agnostic frames (`ping`, the
 * `ok: false` error frame) are single-sourced in `@games/shared/solver/protocol`; this file
 * carries only the game-specific members.
 *
 * `boardSize`, never bare `size` (F5) — KenKen is a Latin family, so `boardSize` is the board
 * side directly (values `1..=boardSize`), not Sudoku's subgrid `n`. Cages cross as a
 * SEPARATE flat `Uint32Array`, each LENGTH-PREFIXED WITH THE OPERATOR AND TARGET —
 * `[k0, op0, t0, c0_0, …, k1, op1, t1, c1_0, …]`, a count `k`, an operator ordinal, a target
 * `t`, then `k` cells — the exact wire the wasm `solveKenKen`/`propagateKenKen`/`generateKenKen`
 * surface decodes. Keeping the cages out of the board buffer is what lets both marshal as
 * tier-2 bulk-`memcpy` `Uint32Array`s.
 */

/** Requests the main thread can post to `solver.worker.ts`. */
export type SolverRequest =
  | {
      id: number;
      kind: "solve";
      board: Uint32Array;
      boardSize: number;
      /** Length-prefixed flat cage buffer (`[k, op, target, c, c, …]` per cage). */
      cages: Uint32Array;
      maxSolutions?: number;
      nodeBudget?: number;
    }
  | {
      id: number;
      kind: "generate";
      boardSize: number;
      difficulty: number; // FutoshikiDifficulty ordinal (0/1/2) — KenKen reuses the Latin axis
      seed: number;
    }
  | {
      id: number;
      kind: "propagate";
      board: Uint32Array;
      boardSize: number;
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
      boardSize: number;
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
      boardSize: number;
    }
  | {
      id: number;
      ok: true;
      kind: "propagate";
      boardSize: number;
      /** One u32 per cell; bit v set ⇔ value v (1-based) survives AC-3/GAC propagation. */
      masks: Uint32Array;
    }
  | PingResponse
  | SolverErrorResponse;

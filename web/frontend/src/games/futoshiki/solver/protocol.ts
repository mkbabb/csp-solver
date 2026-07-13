import type {
  PingRequest,
  PingResponse,
  SolverErrorResponse,
} from "@games/shared/solver/protocol";

/**
 * Futoshiki's solver Worker wire protocol. The game-agnostic frames (`ping`, the `ok: false`
 * error frame) are single-sourced in `@games/shared/solver/protocol`; this file carries
 * only the game-specific members composed with them into the two unions.
 *
 * `boardSize`, never bare `size` (F5) — Sudoku's `size` is the subgrid side; here it is the
 * board side directly. `inequalities` crosses as a SEPARATE flat `Uint32Array` of
 * `[a0,b0,a1,b1,…]` pairs (each `a > b`), matching the wasm `solveFutoshiki` wire — kept out
 * of the board buffer so both marshal as tier-2 bulk-`memcpy` typed arrays.
 */

/** Requests the main thread can post to `solver.worker.ts` (Futoshiki). */
export type SolverRequest =
  | {
      id: number;
      kind: "solve";
      board: Uint32Array;
      boardSize: number;
      inequalities: Uint32Array;
      maxSolutions?: number;
      nodeBudget?: number;
    }
  | {
      id: number;
      kind: "generate";
      boardSize: number;
      difficulty: number; // FutoshikiDifficulty ordinal (0/1/2)
      seed: number;
    }
  | {
      id: number;
      kind: "propagate";
      board: Uint32Array;
      boardSize: number;
      inequalities: Uint32Array;
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
      budgetExceeded: boolean;
      /** Wall-clock ms of the wasm solve call, measured inside the worker (W6 stat-line). */
      elapsedMs: number;
    }
  | {
      id: number;
      ok: true;
      kind: "generate";
      board: Uint32Array;
      inequalities: Uint32Array;
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

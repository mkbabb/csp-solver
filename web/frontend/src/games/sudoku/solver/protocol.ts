import type {
  PingRequest,
  PingResponse,
  SolverErrorResponse,
} from "@games/shared/solver/protocol";

/**
 * Sudoku's solver Worker wire protocol. The game-agnostic frames (`ping`, the `ok: false`
 * error frame) are single-sourced in `@games/shared/solver/protocol`; this file carries
 * only the game-specific members — the board shape (`n` = subgrid side), node budget, and
 * the generate/propagate payloads — composed with the shared frames into the two unions.
 */

/** Requests the main thread can post to `solver.worker.ts`. */
export type SolverRequest =
  | {
      id: number;
      kind: "solve";
      board: Uint32Array;
      n: number;
      maxSolutions?: number;
      nodeBudget?: number;
    }
  | {
      id: number;
      kind: "generate";
      n: number;
      difficulty: number; // SudokuDifficulty ordinal (0/1/2)
      seed: number;
      templates: Uint32Array;
    }
  | {
      id: number;
      kind: "propagate";
      board: Uint32Array;
      n: number;
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
      budgetExceeded: boolean;
      /** Wall-clock ms of the wasm solve call, measured inside the worker (W6 stat-line). */
      elapsedMs: number;
    }
  | {
      id: number;
      ok: true;
      kind: "generate";
      board: Uint32Array;
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

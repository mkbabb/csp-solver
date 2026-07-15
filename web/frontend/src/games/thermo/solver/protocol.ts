import type {
  PingRequest,
  PingResponse,
  SolverErrorResponse,
} from "@games/shared/solver/protocol";

/**
 * Thermo-Sudoku's solver Worker wire protocol. The game-agnostic frames (`ping`, the
 * `ok: false` error frame) are single-sourced in `@games/shared/solver/protocol`; this
 * file carries only the game-specific members.
 *
 * Thermo threads its clue furniture the way Futoshiki threads its carets: a *separate*
 * flat `Uint32Array` alongside the board. Thermometers are variable-length, so the buffer
 * is LENGTH-PREFIXED — `[k0, c0_0, …, k1, c1_0, …]`, `k` cells following each count — the
 * exact wire the wasm `solveThermo`/`propagateThermo`/`generateThermo` surface decodes.
 * Keeping the tubes out of the board buffer is what lets both marshal as tier-2 bulk-
 * `memcpy` `Uint32Array`s.
 */

/** Requests the main thread can post to `solver.worker.ts`. */
export type SolverRequest =
  | {
      id: number;
      kind: "solve";
      board: Uint32Array;
      n: number;
      /** Length-prefixed flat thermometer buffer (`[k, c, c, …]` per tube). */
      thermometers: Uint32Array;
      maxSolutions?: number;
      nodeBudget?: number;
    }
  | {
      id: number;
      kind: "generate";
      n: number;
      difficulty: number; // SudokuDifficulty ordinal (0/1/2) — Thermo reuses the sudoku axis
      seed: number;
    }
  | {
      id: number;
      kind: "propagate";
      board: Uint32Array;
      n: number;
      thermometers: Uint32Array;
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
      /** Length-prefixed flat thermometer buffer of the dealt puzzle. */
      thermometers: Uint32Array;
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

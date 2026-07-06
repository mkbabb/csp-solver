import type { SerializedSolverError } from './lib/solverError'

/**
 * Requests the main thread can post to `solver.worker.ts` (Futoshiki).
 *
 * `boardSize`, never bare `size` (F5) — Sudoku's `size` is the subgrid side; here it
 * is the board side directly. `inequalities` crosses as a SEPARATE flat `Uint32Array`
 * of `[a0,b0,a1,b1,…]` pairs (each `a > b`), matching the wasm `solveFutoshiki` wire —
 * kept out of the board buffer so both marshal as tier-2 bulk-`memcpy` typed arrays.
 */
export type SolverRequest =
  | {
      id: number
      kind: 'solve'
      board: Uint32Array
      boardSize: number
      inequalities: Uint32Array
      maxSolutions?: number
      nodeBudget?: number
    }
  | {
      id: number
      kind: 'generate'
      boardSize: number
      seed: number
    }

/** Responses the worker posts back, correlated by `id`. */
export type SolverResponse =
  | {
      id: number
      ok: true
      kind: 'solve'
      solved: boolean
      solutionCount: number
      boardSize: number
      solutions: Uint32Array
      backtracks: string // bigint -> string, structured-clone-safe & JSON-safe
      budgetExceeded: boolean
    }
  | {
      id: number
      ok: true
      kind: 'generate'
      board: Uint32Array
      inequalities: Uint32Array
      boardSize: number
    }
  | ({ id: number; ok: false } & SerializedSolverError)

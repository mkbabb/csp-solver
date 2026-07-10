/**
 * Neutral domain-type module — has zero dependents inside games/sudoku/, only dependencies.
 *
 * Exists so `useSudoku.ts` and `useUrlState.ts` can both reference the same
 * `Difficulty`/`SolveState` vocabulary without importing types from one another. Before
 * this module existed, `Difficulty`/`SolveState` lived inline in `useSudoku.ts`, which
 * `useUrlState.ts` imported back — a type-only import cycle
 * (useSudoku → useUrlState → useSudoku).
 */
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
export type SolveState = 'idle' | 'solving' | 'solved' | 'failed' | 'error'

/** Search stats from the last completed solve — feeds the W6 margin stat-line.
 * The payload was already on the wire (worker `backtracks`/`solutionCount`);
 * `elapsedMs` is the worker-measured wall clock of the wasm call. */
export interface SolveStats {
  backtracks: number
  solutionCount: number
  elapsedMs?: number
}

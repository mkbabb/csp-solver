/**
 * Neutral domain-type module — has zero dependents inside games/sudoku/, only dependencies.
 *
 * Exists so `useSudoku.ts` and `useUrlState.ts` can both reference the same
 * `Difficulty`/`SolveState` vocabulary without importing types from one another. Before
 * this module existed, `Difficulty`/`SolveState` lived inline in `useSudoku.ts`, which
 * `useUrlState.ts` imported back — a type-only import cycle
 * (useSudoku → useUrlState → useSudoku).
 */
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

// SolveState/SolveStats are the shared game vocabulary — re-exported here so every
// existing `@games/sudoku/types` consumer is untouched (ballot Q3, one home).
export type { SolveState, SolveStats } from "../shared/types";

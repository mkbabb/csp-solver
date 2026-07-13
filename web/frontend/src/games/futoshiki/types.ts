/**
 * Neutral domain-type module for Futoshiki — has zero dependents inside
 * games/futoshiki/ (only dependencies), mirroring games/sudoku/types.ts's role:
 * it exists so `useFutoshiki`, `useSolver`, and `useUrlState` share one
 * vocabulary without importing types from one another.
 *
 * Two deliberate divergences from Sudoku's shape (F3/F5, futoshiki-wave-spec §2.4):
 *   1. `board_size` is the *board* side length directly (4..7) — NOT Sudoku's `size`,
 *      which is the sub-grid side. There is no subgrid tier here: a Futoshiki board is
 *      a plain N×N Latin square. Never spell it bare `size`.
 *   2. There is NO `Difficulty`. v1 ships a single high-density tier; fabricating
 *      EASY/MEDIUM/HARD bands with no measurement behind them is worse than none.
 */

// SolveState/SolveStats are the shared game vocabulary — re-exported here so every
// existing `@games/futoshiki/types` consumer is untouched (ballot Q3, one home).
export type { SolveState, SolveStats } from "../shared/types";

/**
 * A single inequality clue: `[greater, lesser]` cell positions (0-based, row-major),
 * meaning `cell[greater] > cell[lesser]`. Always orthogonally adjacent (the wire
 * boundary rejects non-adjacent pairs — a caret has no shared edge to render otherwise).
 *
 * Inequalities are permanent board FURNITURE, printed on the grid, never blanked — so
 * they never participate in the given/overridden/solved bookkeeping the cell values do.
 */
export type Inequality = [greater: number, lesser: number];

/** v1 Futoshiki board-size band. The selector offers exactly these. */
export const VALID_BOARD_SIZES = [4, 5, 6, 7] as const;

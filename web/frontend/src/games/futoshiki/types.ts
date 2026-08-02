/**
 * What is genuinely FUTOSHIKI, as types — has zero dependents inside games/futoshiki/, only
 * dependencies, so `useFutoshiki`, the clue seam and `useUrlState` share one vocabulary without
 * importing types from one another.
 *
 * `Difficulty` used to be declared here too, byte-identical to sudoku's, and kenken imported it
 * ACROSS the game boundary. T5-W2 2.5 moved the axis to `@games/shared/types` — one home, five
 * families — and what stayed is what actually diverges: the caret clue, and the board-size band.
 *
 * The band's one deliberate divergence (F5, futoshiki-wave-spec §2.4): `board_size` is the
 * *board* side length directly (4..7), never the sub-grid `size` the boxed families carry. There
 * is no subgrid tier here — a futoshiki board is a plain N×N Latin square. Never spell it bare
 * `size`.
 */

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

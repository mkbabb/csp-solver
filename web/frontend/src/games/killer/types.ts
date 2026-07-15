/**
 * Killer-Sudoku's on-board clue furniture type — the FE twin of Rust
 * `puzzles::killer::KillerCage`.
 *
 * A cage is a contiguous group of cells whose values are all-different (no repeat within
 * the cage) and sum to a printed target. It is the FOURTH `TClue` kind the game contract
 * carries — none of Sudoku's `void`, Futoshiki's `Inequality[]`, or Thermo's `ThermoLine[]`
 * — and the clue that CONSUMES the W13 `CageSum` primitive (the cage's authoritative
 * relation is enforced by the wasm solve; this shape is only what the board draws + threads).
 *
 * Difficulty is NOT redeclared here — a Killer-Sudoku IS a Sudoku variant, so its tiers are
 * the sudoku `Difficulty` axis, imported where needed (no fourth mirror; the
 * `difficulty_parity` discipline).
 */
export interface KillerCage {
  /** The value the cage's cells sum to (the corner label). */
  sum: number;
  /** The cage's cells, flat row-major indices; the smallest is the corner the sum prints in. */
  cells: number[];
}

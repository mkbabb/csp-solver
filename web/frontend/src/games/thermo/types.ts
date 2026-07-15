/**
 * Thermo-Sudoku's on-board clue furniture type — the FE twin of Rust
 * `puzzles::thermo::Thermometer`.
 *
 * A thermometer is an ordered path of cell indices whose values strictly increase from
 * the bulb (`line[0]`) to the tip (`line.at(-1)`). It is the THIRD `TClue` kind the game
 * contract carries — neither Sudoku's `void` nor Futoshiki's `Inequality[]` — and the
 * clue that made Thermo the W11 `defineGame` contract proof: a novel clue type plugged in
 * with zero shell edits.
 *
 * Difficulty is NOT redeclared here — a Thermo-Sudoku IS a Sudoku variant, so its tiers
 * are the sudoku `Difficulty` axis, imported where needed (no fourth mirror; the
 * `difficulty_parity` discipline).
 */
export type ThermoLine = number[];

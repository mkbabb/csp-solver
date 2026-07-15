/**
 * KenKen / Calcudoku's on-board clue furniture type — the FE twin of Rust
 * `puzzles::kenken::KenKenCage`.
 *
 * A cage is a contiguous group of cells carrying an arithmetic operator and a target the
 * cells produce under it (`+`→Σ, `−`→|a−b|, `×`→Π, `÷`→max/min). It is the FIFTH `TClue`
 * kind the game contract carries — none of Sudoku's `void`, Futoshiki's `Inequality[]`,
 * Thermo's `ThermoLine[]`, or Killer's `KillerCage[]` — and the clue that CONSUMES the W13
 * `CageProduct` primitive (`×`) plus `CageSum` (`+`) plus the free binary-lambda path
 * (`−`/`÷`). The cage's authoritative relation is enforced by the wasm solve; this shape is
 * only what the board draws + threads.
 *
 * Difficulty is NOT redeclared here — KenKen IS a Latin-square family, so its tiers are the
 * futoshiki `Difficulty` axis, imported where needed (no fifth mirror; the
 * `difficulty_parity` discipline).
 */

/** A cage operator glyph. Maps to the wasm wire ordinal `+ =0`, `− =1`, `× =2`, `÷ =3`. */
export type KenKenOp = "+" | "-" | "×" | "÷";

export interface KenKenCage {
  /** The arithmetic operator combining the cage's cells. */
  op: KenKenOp;
  /** The value the cells produce under `op` (the corner label). */
  target: number;
  /** The cage's cells, flat row-major indices; the smallest is the corner the label prints in. */
  cells: number[];
}

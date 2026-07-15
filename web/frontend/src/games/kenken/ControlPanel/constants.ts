import type { Difficulty } from "@games/futoshiki/types";

/**
 * Selector options for KenKen / Calcudoku — own file (games never depend on another game's
 * ControlPanel constants for their own selector data).
 *
 * `sizeOptions` values are the board side length directly (4..6) — `board_size`, never a
 * subgrid `size` (KenKen is a plain Latin square, no boxes). The 4/5/6 band is the sensible
 * KenKen default (the futoshiki banding, minus 7 — larger product cages stay legible at ≤6).
 *
 * `difficultyOptions` reuses the futoshiki `Difficulty` type (KenKen IS a Latin family — no
 * fifth `Difficulty` mirror; the `difficulty_parity` discipline); the tier maps to a
 * cage-size band in the generator (Easy = pairs, Hard = up to 4-cell cages).
 */
export const sizeOptions = [
  { value: 4, label: "4×4" },
  { value: 5, label: "5×5" },
  { value: 6, label: "6×6" },
];

/** Difficulty options, including the crayon-palette colorClass each maps to (twin of the
 *  sudoku/futoshiki `ControlPanel/constants.ts`). */
export const difficultyOptions: {
  value: Difficulty;
  label: string;
  colorClass: string;
}[] = [
  { value: "EASY", label: "Easy", colorClass: "crayon-green" },
  { value: "MEDIUM", label: "Medium", colorClass: "crayon-orange" },
  { value: "HARD", label: "Hard", colorClass: "crayon-rose" },
];

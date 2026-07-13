import type { Difficulty } from "@games/futoshiki/types";

/**
 * Selector options for the (pencil-side) OptionSelector — own file, not shared with
 * Sudoku's ControlPanel (games never import each other).
 *
 * `boardSizeOptions` values are the board side length directly (4..7) — `board_size`,
 * never the subgrid `size` Sudoku's options carry (F5).
 *
 * `difficultyOptions` is the twin of Sudoku's (T4-W6 GEN-2): Futoshiki grew a
 * measurement-backed difficulty axis, so the panel now carries the same three-tier
 * selector Sudoku does — no longer size-only.
 */
export const boardSizeOptions = [
  { value: 4, label: "4×4" },
  { value: 5, label: "5×5" },
  { value: 6, label: "6×6" },
  { value: 7, label: "7×7" },
];

/** Difficulty options, including the crayon-palette colorClass each maps to (twin of
 * Sudoku's `ControlPanel/constants.ts`). */
export const difficultyOptions: {
  value: Difficulty;
  label: string;
  colorClass: string;
}[] = [
  { value: "EASY", label: "Easy", colorClass: "crayon-green" },
  { value: "MEDIUM", label: "Medium", colorClass: "crayon-orange" },
  { value: "HARD", label: "Hard", colorClass: "crayon-rose" },
];

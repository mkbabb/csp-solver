/**
 * THE SELECTOR BANDS — what a game is dealt at, named once.
 *
 * `cards.ts` renders a game's range sub-line and its staging chips from these bands, and
 * `GameShell` renders the same bands into `ControlSection`s. Naming them here is what lets the
 * gallery read a band WITHOUT importing a game's spec (T5-W2 §1.2): a card row points at the
 * band constant, never at the module that mounts a board.
 *
 * WHY THE BANDS THEMSELVES MOVED HERE (T5-W2 2.5). The estate carried THREE
 * `ControlPanel/constants.ts` files whose `difficultyOptions` were byte-identical, and the two
 * families without one imported a sibling's — `thermo`/`killer` reached into `@games/sudoku`,
 * `kenken` into `@games/futoshiki`. That is four of the twelve boundary violations this wave
 * closes, and the cure is not a fourth copy: the three tiers are ONE band, spelled once, and
 * the size bands are three distinct value sets that never needed a game's directory to live in.
 * A game's spec names the band it deals at; nothing about a band is a game's secret.
 */
import type { Difficulty } from "@games/shared/types";

/** One option as the (pencil-side) OptionSelector renders it. */
interface SelectorOption {
  value: number | string;
  label: string;
  /** the crayon tint the difficulty band carries; sizes have none. */
  colorClass?: string;
}

/** A whole axis — a size band or the difficulty band. */
export type SelectorBand = readonly SelectorOption[];

/**
 * THE difficulty band, with the crayon-palette colorClass each tier maps to. Every family in
 * the estate offers exactly these three, so there is exactly one of them.
 */
export const difficultyOptions: {
  value: Difficulty;
  label: string;
  colorClass: string;
}[] = [
  { value: "EASY", label: "Easy", colorClass: "crayon-green" },
  { value: "MEDIUM", label: "Medium", colorClass: "crayon-orange" },
  { value: "HARD", label: "Hard", colorClass: "crayon-rose" },
];

/**
 * The BOXED families' size band (sudoku, thermo, killer). Values are the SUB-GRID side — 3 is a
 * 9×9 board — which is the same `size` those composables carry. Never the board edge.
 */
export const subgridSizes = [
  { value: 2, label: "4×4" },
  { value: 3, label: "9×9" },
  { value: 4, label: "16×16" },
];

/**
 * The LATIN band (futoshiki). Values are the board side length directly (4..7) — `board_size`,
 * never a subgrid `size`: a futoshiki board is a plain N×N Latin square with no boxes.
 */
export const latinSizes = [
  { value: 4, label: "4×4" },
  { value: 5, label: "5×5" },
  { value: 6, label: "6×6" },
  { value: 7, label: "7×7" },
];

/**
 * The CAGED-latin band (kenken). The futoshiki banding minus 7 — larger product cages stay
 * legible at ≤6. Board side length directly, same as `latinSizes`.
 */
export const cagedLatinSizes = [
  { value: 4, label: "4×4" },
  { value: 5, label: "5×5" },
  { value: 6, label: "6×6" },
];

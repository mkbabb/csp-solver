/**
 * The Sudoku game declared through the T4-W11 contract (`@games/registry`) — the
 * `{ model, cell-furniture, clue-furniture, options, solver payloads }` a game dir becomes.
 *
 * A DECLARATION, not new wiring: it bundles the pieces the shells already consume (the
 * `useSudoku` model, `SudokuCell`, the size/difficulty selector config, the W4-seam solver
 * payloads) so W12's carousel and W13's third game read one contract. The live scene mounts
 * these directly and is UNTOUCHED by this file (zero shell edits — the keystone rule).
 */
import { defineGame } from "@games/registry";
import { useSudoku } from "./composables/useSudoku";
import { useSolver } from "./solver/useSolver";
import SudokuCell from "./SudokuBoard/SudokuCell/SudokuCell.vue";
import { sizeOptions, difficultyOptions } from "./ControlPanel/constants";
import type { Difficulty } from "./types";

/**
 * Sudoku has NO on-board clue furniture (its subgrid ticks are drawn by the board from the
 * `subgridSize` value, not a slot); its solver threads no clue payload → `TClue` = `void`.
 */
export const sudokuGame = defineGame<
  ReturnType<typeof useSudoku>,
  typeof SudokuCell,
  void
>({
  model: useSudoku,
  cellFurniture: SudokuCell,
  clueFurniture: null,
  options: (m) => [
    {
      key: "size",
      heading: "Size",
      ariaLabel: "Size",
      options: sizeOptions,
      selected: m.pendingSize.value,
      onChange: (v) => (m.pendingSize.value = v as number),
    },
    {
      key: "difficulty",
      heading: "Difficulty",
      options: difficultyOptions,
      selected: m.difficulty.value,
      onChange: (v) => (m.difficulty.value = v as Difficulty),
    },
  ],
  solverPayloads: useSolver,
});

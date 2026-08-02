/**
 * Sudoku, whole — the union `GameSpec` (T5-W2 §1), and the wave's PROOF GAME.
 *
 * What used to be a scene, a board adapter, a cell and a declaration is this one file plus
 * the residue that is genuinely sudoku: its model, its selector bands, its URL/persist codec
 * and its solver client. `GameShell`/`BoardHost` read every slot below at mount — the
 * contract is live by construction, not by convention.
 *
 * Sudoku prints no on-board clue glyphs (its sub-grid ticks are drawn by the board from the
 * grammar's geometry, not from a slot), so `clues` is `null` — a STATED absence, never a
 * boolean. That `null` is what makes the shell's overlay branch honest for the four games
 * that do print furniture.
 *
 * The import edge that mattered: this module imports `defineGame` from `games/shared`, which
 * imports nothing back. The old `scene → game → registry → scene` cycle — the one that threw
 * `Cannot access 'sudokuGame' before initialization` and made the eager scene hand-copy its
 * own control sections — has no edge left to close on.
 */
import { defineGame } from "@games/shared/defineGame";
import DigitCell from "@games/shared/DigitCell.vue";
import { useSudoku, nodeBudgetForSize } from "./composables/useSudoku";
import { STORAGE_KEY } from "./composables/useUrlState";
import { subgridSizes, difficultyOptions } from "@games/shared/selectors";
import type { Difficulty } from "@games/shared/types";

export const sudokuSpec = defineGame<ReturnType<typeof useSudoku>, void>({
  id: "sudoku",
  model: useSudoku,
  grammar: {
    // A sub-grid band: peers include the box, and the board draws its ticks at √n.
    geometry: "boxed",
    noun: "sudoku board",
    // B-0: the margin says "— you asked for medium" until the engine has graded the board.
    requestVoice: true,
    // UI-13: the once-per-board "mark it and I'll grade" whisper.
    gradeHint: true,
  },
  clues: null,
  furniture: { cell: DigitCell },
  solver: { nodeBudget: nodeBudgetForSize },
  urlCodec: { key: STORAGE_KEY },
  deal: {
    sizes: subgridSizes,
    difficulty: difficultyOptions,
    options: (m) => [
      {
        key: "size",
        heading: "Size",
        ariaLabel: "Size",
        options: subgridSizes,
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
  },
});

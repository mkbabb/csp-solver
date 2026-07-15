/**
 * Killer-Sudoku declared through the T4-W11 contract (`@games/registry`) — the fourth game,
 * and the first CONSUMER of the W13 `CageSum` primitive. A `{ model, cell-furniture,
 * clue-furniture, options, solver payloads }` bundle with a NOVEL clue type — `KillerCage[]`
 * (contiguous all-different sum-cages), none of Sudoku's `void`, Futoshiki's `Inequality[]`,
 * or Thermo's `ThermoLine[]` — landed with ZERO edits to `games/shared/**` (the whole point).
 *
 * Maximal reuse (a Killer-Sudoku IS a Sudoku variant): the cell furniture, size/difficulty
 * selectors, and difficulty axis are sudoku's; the ONE divergence is the clue furniture (the
 * dotted cage boundaries + corner sums) and the cage payload the solver threads. W12's
 * carousel adds the `GAMES[]` row that mounts this; this file is a declaration, no shell
 * wiring.
 */
import { defineGame } from "@games/registry";
import { useKiller } from "./composables/useKiller";
import { useSolver } from "./solver/useSolver";
import SudokuCell from "@games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue";
import KillerCage from "./KillerCage/KillerCage.vue";
import { sizeOptions, difficultyOptions } from "@games/sudoku/ControlPanel/constants";
import type { Difficulty } from "@games/sudoku/types";
import type { KillerCage as KillerCageClue } from "./types";

/**
 * Killer's clue furniture is the dotted cage overlay (rendered in the board's `#overlay`
 * slot); its solver threads the dealt `KillerCage[]` → `TClue` = `KillerCage[]`. The cell
 * IS the sudoku cell (subgrid ticks, digits 1..9), reused verbatim.
 */
export const killerGame = defineGame<
  ReturnType<typeof useKiller>,
  typeof SudokuCell,
  KillerCageClue[]
>({
  model: useKiller,
  cellFurniture: SudokuCell,
  clueFurniture: KillerCage,
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

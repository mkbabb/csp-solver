/**
 * Thermo-Sudoku declared through the T4-W11 contract (`@games/registry`) — the third game,
 * and the one that PROVED the `defineGame` contract (W11's acceptance stub, now real). A
 * `{ model, cell-furniture, clue-furniture, options, solver payloads }` bundle with a NOVEL
 * clue type — `ThermoLine[]` (thermometer paths), neither Sudoku's `void` nor Futoshiki's
 * `Inequality[]` — landed with ZERO edits to `games/shared/**` (the whole point).
 *
 * Maximal reuse (a Thermo-Sudoku IS a Sudoku variant): the cell furniture, size/difficulty
 * selectors, and difficulty axis are sudoku's; the ONE divergence is the clue furniture (the
 * bulb+tube overlay) and the thermometer payload the solver threads. W12's carousel adds the
 * `GAMES[]` row that mounts this; this file is a declaration, no shell wiring.
 */
import { defineGame } from "@games/registry";
import { useThermo } from "./composables/useThermo";
import { useSolver } from "./solver/useSolver";
import SudokuCell from "@games/sudoku/SudokuBoard/SudokuCell/SudokuCell.vue";
import ThermoTube from "./ThermoTube/ThermoTube.vue";
import { sizeOptions, difficultyOptions } from "@games/sudoku/ControlPanel/constants";
import type { Difficulty } from "@games/sudoku/types";
import type { ThermoLine } from "./types";

/**
 * Thermo's clue furniture is the bulb+tube overlay (rendered in the board's `#overlay`
 * slot); its solver threads the dealt `ThermoLine[]` → `TClue` = `ThermoLine[]`. The cell
 * IS the sudoku cell (subgrid ticks, digits 1..9), reused verbatim.
 */
export const thermoGame = defineGame<
  ReturnType<typeof useThermo>,
  typeof SudokuCell,
  ThermoLine[]
>({
  model: useThermo,
  cellFurniture: SudokuCell,
  clueFurniture: ThermoTube,
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

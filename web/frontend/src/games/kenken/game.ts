/**
 * KenKen / Calcudoku declared through the T4-W11 contract (`@games/registry`) — the fifth
 * game, and the second CONSUMER of the W13 cage-primitive wave (the `CageProduct` consumer).
 * A `{ model, cell-furniture, clue-furniture, options, solver payloads }` bundle with a NOVEL
 * clue type — `KenKenCage[]` (operator cages over the boxless Latin grid), none of Sudoku's
 * `void`, Futoshiki's `Inequality[]`, Thermo's `ThermoLine[]`, or Killer's `KillerCage[]` —
 * landed with ZERO edits to `games/shared/**` (the whole point).
 *
 * Maximal reuse (KenKen IS a Latin family, like Futoshiki): the cell furniture (a plain Latin
 * cell, no subgrid) and the difficulty axis are futoshiki's; the divergences are the
 * operator-cage clue furniture (hand-drawn outlines + `"12×"`-style targets on the NEW boxless
 * board) and the cage payload the solver threads. W12's carousel adds the `GAMES[]` row that
 * mounts this; this file is a declaration, no shell wiring.
 */
import { defineGame } from "@games/registry";
import { useKenken } from "./composables/useKenken";
import { useSolver } from "./solver/useSolver";
import FutoshikiCell from "@games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue";
import KenKenCage from "./KenKenCage/KenKenCage.vue";
import { sizeOptions, difficultyOptions } from "./ControlPanel/constants";
import type { Difficulty } from "@games/futoshiki/types";
import type { KenKenCage as KenKenCageClue } from "./types";

/**
 * KenKen's clue furniture is the operator-cage overlay (rendered in the board's `#overlay`
 * slot — hand-drawn cage outlines + corner targets on the boxless Latin grid); its solver
 * threads the dealt `KenKenCage[]` → `TClue` = `KenKenCage[]`. The cell IS the futoshiki Latin
 * cell (ceil-√ marks, digits 1..n, no subgrid), reused verbatim.
 */
export const kenkenGame = defineGame<
  ReturnType<typeof useKenken>,
  typeof FutoshikiCell,
  KenKenCageClue[]
>({
  model: useKenken,
  cellFurniture: FutoshikiCell,
  clueFurniture: KenKenCage,
  options: (m) => [
    {
      key: "boardSize",
      heading: "Board Size",
      ariaLabel: "Board size",
      options: sizeOptions,
      selected: m.pendingBoardSize.value,
      onChange: (v) => (m.pendingBoardSize.value = v as number),
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

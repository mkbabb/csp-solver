/**
 * The Futoshiki game declared through the T4-W11 contract (`@games/registry`) — the
 * `{ model, cell-furniture, clue-furniture, options, solver payloads }` a game dir becomes.
 *
 * A DECLARATION, not new wiring: it bundles the pieces the shells already consume (the
 * `useFutoshiki` model, `FutoshikiCell`, the `FutoshikiCaret` clue layer, the board-size/
 * difficulty selector config, the W4-seam solver payloads) so W12's carousel and W13's third
 * game read one contract. The live scene mounts these directly and is UNTOUCHED by this file
 * (zero shell edits — the keystone rule).
 */
import { defineGame } from "@games/registry";
import { useFutoshiki } from "./composables/useFutoshiki";
import { useSolver } from "./solver/useSolver";
import FutoshikiCell from "./FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue";
import FutoshikiCaret from "./FutoshikiBoard/FutoshikiCaret/FutoshikiCaret.vue";
import { boardSizeOptions, difficultyOptions } from "./ControlPanel/constants";
import type { Difficulty, Inequality } from "./types";

/**
 * Futoshiki's clue furniture is the inequality caret layer (rendered in the board's
 * `#overlay` slot); its solver threads the printed `Inequality[]` → `TClue` = `Inequality[]`.
 */
export const futoshikiGame = defineGame<
  ReturnType<typeof useFutoshiki>,
  typeof FutoshikiCell,
  Inequality[]
>({
  model: useFutoshiki,
  cellFurniture: FutoshikiCell,
  clueFurniture: FutoshikiCaret,
  options: (m) => [
    {
      key: "boardSize",
      heading: "Board Size",
      ariaLabel: "Board size",
      options: boardSizeOptions,
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

/**
 * Thermo-Sudoku, whole — the union `GameSpec` (T5-W2 §1), the second game onto the contract.
 *
 * What used to be a scene, a board adapter and a declaration is this one file plus the residue
 * that is genuinely thermo: its model, its persistence, its tube furniture and its solver
 * client. `ThermoGame.vue` was `SudokuGame.vue` with the names changed; `ThermoBoard.vue` was
 * `SudokuBoard.vue` plus six lines of thermometer overlay. Both are gone: `GameShell` and
 * `BoardHost` read the slots below and the six lines are `grammar` + `clues`.
 *
 * A Thermo-Sudoku IS a Sudoku variant, and the spec says so in data rather than by copying a
 * component: `geometry: "boxed"` buys the sub-grid band, the box-peer adjacency and the √n tick
 * count; `requestVoice` buys the difficulty word in the grid label. The ONE genuine divergence — the bulb+tube furniture and the `ThermoLine[]` the
 * solver threads — is the `clues` seam, entire: what the board draws, how it is propped, and
 * how the wire carries it.
 *
 * The import edge that mattered: this module imports `defineGame` from `games/shared`, which
 * imports nothing back. `thermo/game.ts` reached into `@games/registry`, which reached back
 * into a game — the cycle F1 severed. There is no edge left to close on.
 */
import { defineGame } from "@games/shared/defineGame";
import DigitCell from "@games/shared/DigitCell.vue";
import ThermoTube from "./ThermoTube.vue";
import { useThermo, nodeBudgetForSize, persistence } from "./composables/useThermo";
import { thermoClue } from "./clue";
import { subgridSizes, difficultyOptions } from "@games/shared/selectors";
import type { Difficulty } from "@games/shared/types";
import type { ThermoLine } from "./types";

export const thermoSpec = defineGame<ReturnType<typeof useThermo>, ThermoLine[]>({
  id: "thermo",
  model: useThermo,
  grammar: {
    // A sub-grid band: peers include the box, and the board draws its ticks at √n — the
    // sudoku geometry, declared, where `ThermoBoard` re-typed it as thirty lines of adjacency.
    geometry: "boxed",
    noun: "thermo board",
    // B-0: the margin says "— medium" until the engine has graded the board.
    requestVoice: true,
    // UI-13: the once-per-board "a number repeats" whisper.
  },
  clues: {
    // The live clue, off the model — the seam names the field a generic shell cannot guess.
    from: (m) => m.thermometers.value,
    // THE clue overlay — the bulb+tube layer, mounted straight into `BoardHost`'s `#overlay`.
    overlay: ThermoTube,
    props: (thermometers, boardSize) => ({ thermometers, boardSize }),
    // The permalink/wire codec pair, NAMED not re-implemented: the same length-prefixed flat
    // buffer the one solver client already posts to the Worker. One codec, both consumers —
    // makes one shared `persistence.ts` possible when 2.4 lands it.
    ...thermoClue,
  },
  furniture: { cell: DigitCell },
  solver: { nodeBudget: nodeBudgetForSize },
  urlCodec: { key: persistence.key },
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
        heading: "Level",
        options: difficultyOptions,
        selected: m.difficulty.value,
        onChange: (v) => (m.difficulty.value = v as Difficulty),
      },
    ],
  },
});

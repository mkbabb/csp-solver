/**
 * Killer-Sudoku, whole — the union `GameSpec` (T5-W2 §1), migrated at F2.
 *
 * What used to be a scene, a board adapter and a `GameDefinition` is this one file plus the
 * residue that is genuinely killer: its model, its persistence codec, its cage vocabulary and
 * its solver client. `KillerGame.vue` and `KillerBoard.vue` were the sudoku twins with one
 * divergence each — the cage overlay in the board's `#overlay` slot — and that divergence is
 * exactly what `clues` carries, so both files die and `GameShell`/`BoardHost` read the slots.
 *
 * A Killer-Sudoku IS a Sudoku variant, and the grammar says so as DATA rather than by copying
 * a board: `geometry: "boxed"` picks the sub-grid peer band, the √n tick count and the boxed
 * conflict derivation; `requestVoice` carries the grid label's difficulty word, printed
 * verbatim from `SudokuBoard`. The cage SUM relation is enforced
 * authoritatively by the wasm solve — the board's red-pencil assist stays the cage-blind
 * sudoku box/row/col grader, unchanged, because that is what `geometry` alone decides.
 *
 * ONE codec, two consumers: `clues.encode/decode` names `killerWire`'s length-prefixed cage
 * buffer — the same pair the Worker already speaks — so the seam that draws the cage and the
 * seam that transmits it can never drift.
 */
import { defineGame } from "@games/shared/defineGame";
import DigitCell from "@games/shared/DigitCell.vue";
import CageOverlay from "@games/shared/CageOverlay.vue";
import { useKiller, nodeBudgetForSize, persistence } from "./composables/useKiller";
import { cageFigures, killerClue } from "./clue";
import { subgridSizes, difficultyOptions } from "@games/shared/selectors";
import type { Difficulty } from "@games/shared/types";
import type { KillerCage } from "./types";

export const killerSpec = defineGame<ReturnType<typeof useKiller>, KillerCage[]>({
  id: "killer",
  model: useKiller,
  grammar: {
    // A sub-grid band — killer shares sudoku's geometry outright; the cages sit over it.
    geometry: "boxed",
    noun: "killer board",
    // B-0: the margin says "— medium" until the engine has graded the board.
    requestVoice: true,
    // UI-13: the once-per-board "a number repeats" whisper.
  },
  clues: {
    // The live clue, off the model — the seam names the field a generic shell cannot guess.
    from: (m) => m.cages.value,
    overlay: CageOverlay,
    // The overlay owns the cage GEOMETRY; killer owns what its corner text says (the sum).
    // `fontSize` is stated rather than defaulted so a sibling game's tuning can never move
    // killer's label.
    props: (cages, dim) => ({
      cages: cageFigures(cages),
      boardSize: dim,
      family: "killer",
      fontSize: 0.26,
    }),
    ...killerClue,
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
        heading: "Difficulty",
        options: difficultyOptions,
        selected: m.difficulty.value,
        onChange: (v) => (m.difficulty.value = v as Difficulty),
      },
    ],
  },
});

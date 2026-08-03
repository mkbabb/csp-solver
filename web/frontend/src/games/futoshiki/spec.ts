/**
 * Futoshiki, whole — the union `GameSpec` (T5-W2 §1), the second game onto the contract.
 *
 * A scene, a board adapter and a declaration become this one file plus the residue that is
 * genuinely futoshiki: its model, its selector bands, its URL/permalink codec, its clue seam
 * and its solver client. `GameShell`/`BoardHost` read every slot below at mount.
 *
 * Where sudoku (the proof game) states `clues: null`, futoshiki is the first game to fill the
 * seam: the printed `[greater, lesser]` inequalities ARE its divergence from a plain Latin
 * square, and all four faces of them — what the overlay draws, how the board props it, and
 * how the wire carries it both ways — sit on the one slot. That is what keeps a single
 * `?board=` codec and a single worker protocol possible downstream: the seam hands them a
 * `Uint32Array` and they never learn the word "inequality".
 *
 * The import edge, as at F1: this module imports `defineGame` from `games/shared`, which
 * imports nothing back. `spec → defineGame` and `cards → spec`, never `spec → cards`.
 */
import { defineGame } from "@games/shared/defineGame";
import DigitCell from "@games/shared/DigitCell.vue";
import CaretOverlay from "./CaretOverlay.vue";
import {
  useFutoshiki,
  nodeBudgetForSize,
  persistence,
} from "./composables/useFutoshiki";
import { caretFigures, futoshikiClue } from "./clue";
import { latinSizes, difficultyOptions } from "@games/shared/selectors";
import type { Difficulty } from "@games/shared/types";
import type { Inequality } from "./types";

export const futoshikiSpec = defineGame<ReturnType<typeof useFutoshiki>, Inequality[]>({
  id: "futoshiki",
  model: useFutoshiki,
  grammar: {
    // A plain N×N Latin square: no box band, and the board draws one box, i.e. none.
    geometry: "latin",
    noun: "futoshiki board",
    // Futoshiki's margin carries the MEASURED signature only — it never says "you asked
    // for medium", and its grid label carries no difficulty word (the two co-vary).
    requestVoice: false,
    // No idle grade whisper: the carets are the board's own running commentary.
  },
  clues: {
    // The live clue, off the model — the seam names the field a generic shell cannot guess.
    from: (m) => m.inequalities.value,
    overlay: CaretOverlay,
    props: (inequalities, dim) => ({
      carets: caretFigures(inequalities, dim),
      boardSize: dim,
    }),
    ...futoshikiClue,
  },
  furniture: { cell: DigitCell },
  solver: { nodeBudget: nodeBudgetForSize },
  urlCodec: { key: persistence.key },
  deal: {
    sizes: latinSizes,
    difficulty: difficultyOptions,
    options: (m) => [
      {
        key: "boardSize",
        heading: "Size",
        ariaLabel: "Size",
        options: latinSizes,
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
  },
});

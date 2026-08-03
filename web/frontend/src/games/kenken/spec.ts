/**
 * KenKen / Calcudoku, whole — the union `GameSpec` (T5-W2 §1), migrated at F2.
 *
 * What used to be a scene, a board adapter and a `GameDefinition` is this one file plus the
 * residue that is genuinely kenken: its model, its persistence codec, its cage vocabulary and
 * its solver client. `KenKenGame.vue` was ThermoGame's wiring twin and `KenKenBoard.vue`
 * FutoshikiBoard's, each carrying ONE divergence — the operator-cage layer laid in the board's
 * `#overlay` slot — and that divergence is exactly what `clues` carries. So both files die and
 * `GameShell`/`BoardHost` read the slots instead.
 *
 * KenKen IS a Latin family, and the grammar says so as DATA rather than by copying a board:
 * `geometry: "latin"` picks the BOXLESS grid (`subgridSize = side`, so `HandDrawnGrid` draws
 * one box, i.e. none), the row/column peer band, and the cage-blind Latin conflict derivation.
 * `requestVoice` is FALSE, which is what `KenKenBoard` printed: its grid label carried no
 * difficulty word. (Its `gradeHint` twin died at T8-W6 with the string it gated.) The cage
 * ARITHMETIC is enforced
 * authoritatively by the wasm solve, which is why the red-pencil assist stays Latin-only.
 *
 * ONE codec, two consumers: `clues.encode/decode` names `kenkenWire`'s length-prefixed cage
 * buffer — the same pair the Worker already speaks — so the seam that DRAWS a cage and the seam
 * that TRANSMITS it can never drift.
 */
import { defineGame } from "@games/shared/defineGame";
import DigitCell from "@games/shared/DigitCell.vue";
import CageOverlay from "@games/shared/CageOverlay.vue";
import { useKenken, nodeBudgetForSize, persistence } from "./composables/useKenken";
import { cageFigures, kenkenClue } from "./clue";
import { cagedLatinSizes, difficultyOptions } from "@games/shared/selectors";
import type { Difficulty } from "@games/shared/types";
import type { KenKenCage } from "./types";

export const kenkenSpec = defineGame<ReturnType<typeof useKenken>, KenKenCage[]>({
  id: "kenken",
  model: useKenken,
  grammar: {
    // A plain Latin square — no box band, so the peers are row + column and the grid draws
    // no interior box lines.
    geometry: "latin",
    noun: "kenken board",
    // KenKen's margin names the MEASURED grade or nothing; it never carries the request.
    requestVoice: false,
    // No UI-13 whisper — `KenKenBoard` handed `GameBoard` no idle grade hint.
  },
  clues: {
    // The live clue, off the model — the seam names the field a generic shell cannot guess.
    from: (m) => m.cages.value,
    overlay: CageOverlay,
    // The overlay owns the cage GEOMETRY; kenken owns what its corner text says — the target
    // with its operator glyph, bare for a singleton given. `fontSize` is stated rather than
    // defaulted so a sibling game's tuning can never move kenken's label.
    props: (cages, dim) => ({
      cages: cageFigures(cages),
      boardSize: dim,
      family: "kenken",
      fontSize: 0.24,
    }),
    ...kenkenClue,
  },
  furniture: { cell: DigitCell },
  solver: { nodeBudget: nodeBudgetForSize },
  urlCodec: { key: persistence.key },
  deal: {
    sizes: cagedLatinSizes,
    difficulty: difficultyOptions,
    options: (m) => [
      {
        key: "boardSize",
        heading: "Size",
        ariaLabel: "Size",
        options: cagedLatinSizes,
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

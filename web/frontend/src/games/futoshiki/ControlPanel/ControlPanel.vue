<script setup lang="ts">
/**
 * Futoshiki control panel — a thin section-supplier over the game-agnostic
 * `@games/shared/GameControlPanel.vue` shell (T4-W11 R2). It owns only what genuinely
 * diverges from Sudoku's twin: the two provisional sections (`boardSize` + `difficulty`,
 * the axis T4-W6 GEN-2 grew) and their write-back — `board_size` is the board side length
 * directly (F5), never Sudoku's subgrid `size`. The shell owns the New-game staging, the
 * hold-to-peek divider, the live action + play-tool rows, and every `<style>`. The panel
 * keeps its full prop/emit/model interface unchanged, so FutoshikiGame's mount is untouched.
 */
import { computed } from "vue";
import GameControlPanel, {
  type ControlSection,
} from "@games/shared/GameControlPanel.vue";
import type { Difficulty } from "@games/futoshiki/types";
import type { PencilMode } from "@games/shared/useUserMarks";
import type { ErrorCheckMode } from "@games/shared/useAssists";
import { boardSizeOptions, difficultyOptions } from "./constants";

// T4-W10 idiom (§defineModel) — the two-way seams collapse to defineModel (twin of the sudoku
// panel's). boardSize/difficulty are TRANSFORM-ON-WRITE: the `as` cast rides the section's onChange,
// and the shell adds the underline boil on top (the boil lives OUTSIDE the model, so a same-value
// re-tap still boils). pencilMode/candidatesPinned are PLAIN relays; `errorCheckMode` STAYS a manual
// prop+emit (§1a): its same-value re-emit re-arms the on-demand snapshot.
const boardSize = defineModel<number>("boardSize", { required: true });
const difficulty = defineModel<Difficulty>("difficulty", { required: true });
const pencilMode = defineModel<PencilMode>("pencilMode", { required: true });
const candidatesPinned = defineModel<boolean>("candidatesPinned", {
  required: true,
});

defineProps<{
  loading: boolean;
  // T4-WU/U3 (twin of the sudoku panel's) — the board's dirty state, gating the coarse two-tap.
  isDirty: boolean;
  solveState: string;
  mobile?: boolean;
  // T4-W8 ROW 2 (twin of the sudoku panel's) — the error-check mode, relayed to the shell.
  errorCheckMode: ErrorCheckMode;
  // T4-W3 share-truth (twin of the sudoku panel's) — the share act as a callback so the outcome returns.
  share: () => Promise<void>;
}>();

const emit = defineEmits<{
  (e: "deal"): void;
  (e: "clear"): void;
  (e: "solve"): void;
  (e: "fill-forced"): void;
  (e: "peek-start"): void;
  (e: "peek-end"): void;
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "hint"): void;
  (e: "update:errorCheckMode", value: ErrorCheckMode): void;
}>();

// The two provisional sections — the ONLY divergence from Sudoku's twin. `boardSize` reads
// "Board size" (F5 — `board_size`, not the subgrid `size`); difficulty is the twin section (the
// shell reads its crayon tone from `difficultyOptions`' per-option `colorClass`).
const sections = computed<ControlSection[]>(() => [
  {
    key: "boardSize",
    heading: "Board Size",
    ariaLabel: "Board size",
    options: boardSizeOptions,
    selected: boardSize.value,
    onChange: (v) => (boardSize.value = v as number),
  },
  {
    key: "difficulty",
    heading: "Difficulty",
    options: difficultyOptions,
    selected: difficulty.value,
    onChange: (v) => (difficulty.value = v as Difficulty),
  },
]);
</script>

<template>
  <GameControlPanel
    :sections="sections"
    v-model:pencil-mode="pencilMode"
    v-model:candidates-pinned="candidatesPinned"
    :loading="loading"
    :is-dirty="isDirty"
    :mobile="mobile"
    :error-check-mode="errorCheckMode"
    :share="share"
    @deal="emit('deal')"
    @clear="emit('clear')"
    @solve="emit('solve')"
    @fill-forced="emit('fill-forced')"
    @peek-start="emit('peek-start')"
    @peek-end="emit('peek-end')"
    @undo="emit('undo')"
    @redo="emit('redo')"
    @hint="emit('hint')"
    @update:error-check-mode="emit('update:errorCheckMode', $event)"
  />
</template>

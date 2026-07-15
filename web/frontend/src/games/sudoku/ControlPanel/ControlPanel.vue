<script setup lang="ts">
/**
 * Sudoku control panel — a thin section-supplier over the game-agnostic
 * `@games/shared/GameControlPanel.vue` shell (T4-W11 R2). It owns only what genuinely
 * diverges from Futoshiki's twin: the two provisional sections (`size` + `difficulty`)
 * and their write-back. The shell owns the New-game staging, the hold-to-peek divider,
 * the live action + play-tool rows, and every `<style>`. The panel keeps its full
 * prop/emit/model interface unchanged, so SudokuGame's mount is untouched.
 */
import { computed } from "vue";
import GameControlPanel, {
  type ControlSection,
} from "@games/shared/GameControlPanel.vue";
import type { Difficulty } from "@games/sudoku/types";
import type { PencilMode } from "@games/shared/useUserMarks";
import type { ErrorCheckMode } from "@games/shared/useAssists";
import { sizeOptions, difficultyOptions } from "./constants";

// T4-W10 idiom (§defineModel) — the two-way seams collapse to defineModel. size/difficulty are
// TRANSFORM-ON-WRITE: the `as` cast rides the section's onChange, and the shell adds the underline
// boil on top (the boil lives OUTSIDE the model, so a same-value re-tap still boils). pencilMode/
// candidatesPinned are PLAIN relays to the shell; `errorCheckMode` STAYS a manual prop+emit (§1a):
// its same-value re-emit re-arms the on-demand snapshot, which defineModel's guard would swallow.
const size = defineModel<number>("size", { required: true });
const difficulty = defineModel<Difficulty>("difficulty", { required: true });
const pencilMode = defineModel<PencilMode>("pencilMode", { required: true });
const candidatesPinned = defineModel<boolean>("candidatesPinned", {
  required: true,
});

defineProps<{
  loading: boolean;
  // T4-WU/U3 — the board's dirty state (undo-depth non-empty), gating the coarse two-tap.
  isDirty: boolean;
  solveState: string;
  mobile?: boolean;
  // T4-W8 ROW 2 — the error-check mode, relayed to the shell's AssistSettings.
  errorCheckMode: ErrorCheckMode;
  // T4-W3 share-truth — the parent's share act, handed as a callback so the OUTCOME travels back.
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

// The two provisional sections — the ONLY divergence from Futoshiki's twin. The shell reads the
// difficulty crayon tone from `difficultyOptions`' per-option `colorClass` (the size options carry
// none), so no config flag names it.
const sections = computed<ControlSection[]>(() => [
  {
    key: "size",
    heading: "Size",
    ariaLabel: "Size",
    options: sizeOptions,
    selected: size.value,
    onChange: (v) => (size.value = v as number),
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

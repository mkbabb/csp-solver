<script setup lang="ts">
/**
 * The paper note — broken machinery pinned below the board (design-refinement.md
 * §5.2, D3). Game-agnostic: BOTH games mount this ONE card (T4-W11 R1 verdict-note
 * fold; formerly a byte-twin owned in each SudokuBoard/FutoshikiBoard). The other
 * half of the failure split is the on-board conflict render (grid recolor + shake +
 * conflict marks) — that stays per-game in the Board/Cell; a network/server fault is
 * THIS hand-drawn note card, `role="alert"` (assertive — not a comment on the puzzle,
 * a machine that broke).
 *
 * The card is honest and plain — the storybook dressing is the *paper* (HandDrawnOutline
 * + cartoon shadow + Patrick Hand), not purple copy. Copy + retryability are derived
 * upstream from the typed error taxonomy (`shared/solver/classifyError.ts`, W4) and
 * handed in — the shell renders, the game supplies the text.
 */
import { nextTick, onMounted, ref } from "vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";

defineProps<{
  text: string;
  retryable?: boolean;
}>();

const emit = defineEmits<{
  (e: "retry"): void;
}>();

// H5(b′): on show, bring the note to the reader — the card can mount below the fold
// (E1). scrollIntoView moves no focus and re-fires nothing (role=alert announced on
// insertion); the card itself stays a persistent alert, dismissed only by state change.
const rootRef = ref<HTMLElement | null>(null);
onMounted(async () => {
  await nextTick();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  rootRef.value?.scrollIntoView({
    block: "nearest",
    behavior: reduced ? "auto" : "smooth",
  });
});
</script>

<template>
  <div ref="rootRef" class="error-note" role="alert">
    <HandDrawnOutline :stroke-width="3">
      <div class="error-note-card cartoon-shadow-sm edge-outlined bg-card">
        <p class="error-note-text">{{ text }}</p>
        <button
          v-if="retryable"
          type="button"
          class="error-note-retry"
          @click="emit('retry')"
        >
          try again
        </button>
      </div>
    </HandDrawnOutline>
  </div>
</template>

<style scoped>
.error-note {
  pointer-events: auto; /* the strip container passes events through; the card takes them back */
  animation: note-in 250ms var(--ease-noteWrite) backwards;
}

.error-note-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-radius: 0.75rem;
  padding: 0.5rem 0.85rem;
}

.error-note-text {
  font-family: var(--font-hand);
  letter-spacing: 0.02em;
  font-size: var(--type-body);
  line-height: var(--type-leading-caption);
  margin: 0;
  /* Ink tier, not wax (T3-W9): body-size text earns the AA-darkened red. */
  color: var(--color-red-ink, var(--color-crayon-rose));
}

.error-note-retry {
  flex: none;
  font-family: var(--font-hand);
  font-size: var(--type-small);
  font-weight: 600;
  color: var(--color-foreground);
  background: transparent;
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.15rem 0.6rem;
  cursor: pointer;
  filter: url(#grain-static);
  transition: background 150ms;
}

.error-note-retry:hover {
  background: var(--color-accent);
}

.error-note-retry:active {
  transform: scale(0.94);
}
</style>

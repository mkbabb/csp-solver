<script setup lang="ts">
/**
 * The paper note — broken machinery pinned below the board (design-refinement.md
 * §5.2, D3). The other half of the failure split: a wrong answer is the teacher's
 * red pencil ON the board (grid recolor + shake + conflict marks); a network/server
 * fault is a hand-drawn note card, `role="alert"` (assertive — this is not a comment
 * on the puzzle, it's a machine that broke).
 *
 * The card is honest and plain — the storybook dressing is the *paper* (HandDrawnOutline
 * + cartoon shadow + Patrick Hand), not purple copy. Copy + retryability are derived
 * upstream from the typed error taxonomy (`apiError.ts`) and handed in.
 */
import { nextTick, onMounted, ref } from 'vue'
import HandDrawnOutline from '@pencil/grid/HandDrawnOutline.vue'

defineProps<{
  text: string
  retryable?: boolean
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()

// H5(b′): on show, bring the note to the reader — the card can mount below the fold
// (E1). scrollIntoView moves no focus and re-fires nothing (role=alert announced on
// insertion); the card itself stays a persistent alert, dismissed only by state change.
const rootRef = ref<HTMLElement | null>(null)
onMounted(async () => {
  await nextTick()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  rootRef.value?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
})
</script>

<template>
  <div ref="rootRef" class="error-note" role="alert">
    <HandDrawnOutline :stroke-width="3">
      <div class="error-note-card cartoon-shadow-sm bg-card">
        <p class="error-note-text">{{ text }}</p>
        <button v-if="retryable" type="button" class="error-note-retry" @click="emit('retry')">
          try again
        </button>
      </div>
    </HandDrawnOutline>
  </div>
</template>

<style scoped>
.error-note {
  pointer-events: auto; /* the strip container passes events through; the card takes them back */
  animation: note-slide-in 250ms cubic-bezier(0.22, 1, 0.36, 1) both;
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
  color: var(--color-teacher-red, var(--color-crayon-rose));
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

@keyframes note-slide-in {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* PRM: fade only, no translate (§5.2). */
@media (prefers-reduced-motion: reduce) {
  .error-note {
    animation: note-fade-in 200ms linear both;
  }
  @keyframes note-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>

<script setup lang="ts">
/**
 * Marginalia — the status voice of the page (design-refinement.md §4.3, D2/D3).
 *
 * One live region, hand-lettered: sighted users and assistive tech read the same
 * handwriting. `role="status"` (polite) — it comments on the *puzzle* ("solved it!",
 * "not quite — check row 4", "a fresh 9×9"), never on infrastructure (network faults
 * go to the assertive note card instead, §5.2).
 *
 * Generic by construction (pencil layer): it renders whatever text + tone it's handed
 * and owns none of the derivation — the domain (SudokuBoard) decides *what* to say.
 * The region element is always mounted so a text change is an announced mutation, not
 * a region that appears mid-solve (which some AT miss). Text writes in with a 250ms
 * clip-path wipe — the logo's own reveal mechanic, shortened; instant under PRM.
 */
withDefaults(
  defineProps<{
    text: string
    tone?: 'graphite' | 'teacher-red' | 'gold-star'
  }>(),
  { tone: 'graphite' },
)
</script>

<template>
  <p class="margin-note" :class="tone" role="status" aria-live="polite" aria-atomic="true">
    <span v-if="text" :key="text" class="margin-note-ink">{{ text }}</span>
  </p>
</template>

<style scoped>
.margin-note {
  font-family: var(--font-hand);
  letter-spacing: 0.02em;
  font-size: var(--type-body);
  line-height: var(--type-leading-caption);
  min-height: 1.3em; /* reserve the line so the layout doesn't jump when text arrives */
  margin: 0;
  pointer-events: none;
  user-select: none;
}

.graphite {
  color: var(--color-pencil-graphite, var(--grid-line-color));
}
.teacher-red {
  color: var(--color-teacher-red, var(--color-crayon-rose));
}
.gold-star {
  color: var(--color-gold-star, var(--color-crayon-green));
}

.margin-note-ink {
  display: inline-block;
  animation: note-write-in 250ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes note-write-in {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .margin-note-ink {
    animation: none;
    clip-path: none;
  }
}
</style>

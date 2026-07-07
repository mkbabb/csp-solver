<script setup lang="ts">
import CrayonHeart from './CrayonHeart.vue'
import { useHoverCard } from './useHoverCard'

defineProps<{
  mobile?: boolean
}>()

const { isOpen, toggle, close, onHoverEnter, onHoverLeave } = useHoverCard()

defineExpose({ close })
</script>

<template>
  <div
    :class="mobile ? 'mobile-attribution md:hidden' : 'corner-left hidden md:block'"
    @mouseenter="onHoverEnter"
    @mouseleave="onHoverLeave"
  >
    <button
      type="button"
      class="attribution-trigger font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
      :aria-expanded="isOpen"
      aria-label="Show attribution card"
      @click.stop="toggle"
      @keydown.enter.stop="toggle"
    >@mbabb</button>
    <div class="hover-card" :class="{ 'is-open': isOpen }">
      <div class="flex items-center gap-3">
        <img
          src="https://avatars.githubusercontent.com/u/2848617?v=4"
          alt="mkbabb"
          class="h-10 w-10 rounded-full"
        />
        <div class="flex-1">
          <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="font-mono text-sm font-semibold text-foreground hover:underline">@mbabb</a>
          <p class="mt-0.5 text-xs italic text-muted-foreground">CSP-powered Sudoku solver</p>
        </div>
        <CrayonHeart :size="32" />
      </div>
      <hr class="my-2 border-border/50" />
      <a href="https://github.com/mkbabb/csp-solver" target="_blank" rel="noopener noreferrer" class="block text-sm text-foreground hover:underline">View project on GitHub 🎉</a>
    </div>
  </div>
</template>

<style scoped>
/* Flush to the viewport corner (mirrors .corner-right's top:0/right:0 in App.vue) —
   the inset from the edge now comes from .attribution-trigger's own padding, not a
   gap on this wrapper, so the visible glyph lands in ~the same spot as before while
   the button's hit target grows to fill the whole corner instead of floating in it. */
.corner-left {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  cursor: pointer;
}

.mobile-attribution {
  position: relative;
  align-self: flex-start;
  cursor: pointer;
  z-index: 40;
  margin-bottom: 0.125rem;
}

/* Real <button> semantics (the a11y fix): reset it back to the inline text trigger.
   font-family used to be `inherit`, which Vue's scoped [data-v-xxx] attribute selector
   (specificity 0,2,0) defeated the template's `font-mono` utility (0,1,0) with — the
   button silently inherited body{}'s Fraunces serif instead of rendering mono. Naming
   the token directly here (with the Fira Code chain as its fallback, since no consumer
   in src/ defines --font-mono yet) both breaks that specificity trap and keeps the
   correct face live today, ready to pick up the real token the moment it's defined.
   Padding: 0 → √φ-ladder rungs (0.618rem block / 0.786rem inline, r = 1.272) — enough
   room for a real ~44px-ish tap target; paired with .corner-left's flush 0/0 above,
   the visible "@mbabb" lands almost exactly where it did before, just no longer glued
   to the literal pixel corner. */
.attribution-trigger {
  background: transparent;
  border: none;
  padding: 0.618rem 0.786rem;
  cursor: pointer;
  font-family: var(--font-mono, 'Fira Code', monospace);
}

/* The app's accidental proto-vellum: 80% popover, blur-0 (OD-1 / design-union UD2 —
   the prior blur(12px) on open was drift from the pure-pencil intent; removed so the
   no-glass build ships zero blurred-backdrop surfaces). */
.hover-card {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0;
  padding: 1rem;
  background: color-mix(in srgb, var(--color-popover) 80%, transparent);
  border: 2px solid color-mix(in srgb, var(--color-border) 30%, transparent);
  border-radius: 1rem;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.9) translateY(8px);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  min-width: 16rem;
}

.hover-card::before {
  content: '';
  position: absolute;
  top: -1rem;
  left: 0;
  right: 0;
  height: 1rem;
}

.hover-card.is-open {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1) translateY(0);
}
</style>

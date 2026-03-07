<script setup lang="ts">
import CrayonHeart from '@/components/decorative/CrayonHeart.vue'
import { useHoverCard } from '@/composables/useHoverCard'

defineProps<{
  mobile?: boolean
}>()

const { isOpen, toggle, close, onHoverEnter, onHoverLeave } = useHoverCard()

defineExpose({ close })
</script>

<template>
  <div
    :class="mobile ? 'mobile-attribution md:hidden' : 'corner-left hidden md:block'"
    role="button"
    tabindex="0"
    aria-label="Show attribution card"
    @click.stop="toggle"
    @keydown.enter="toggle"
    @mouseenter="onHoverEnter"
    @mouseleave="onHoverLeave"
  >
    <a
      href="https://github.com/mkbabb/csp-solver"
      target="_blank"
      rel="noopener noreferrer"
      class="font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
      @click.stop.prevent="toggle"
    >@mbabb</a>
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
      <a href="https://github.com/mkbabb/csp-solver" target="_blank" rel="noopener noreferrer" class="block text-sm text-foreground hover:underline">View project on GitHub 🎊</a>
    </div>
  </div>
</template>

<style scoped>
.corner-left {
  position: fixed;
  top: 0.5rem;
  left: 0.75rem;
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

.hover-card {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0;
  padding: 1rem;
  background: color-mix(in srgb, var(--color-popover) 80%, transparent);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
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
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>

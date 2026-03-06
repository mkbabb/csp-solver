<script setup lang="ts">
import { ref } from 'vue'
import { useSudoku } from '@/composables/useSudoku'
import SudokuBoard from '@/components/custom/SudokuBoard.vue'
import ControlPanel from '@/components/custom/ControlPanel.vue'
import DarkModeToggle from '@/components/custom/DarkModeToggle.vue'
import SvgFilters from '@/components/decorative/SvgFilters.vue'
import HandwrittenLogo from '@/components/decorative/HandwrittenLogo.vue'
// import FilterTuner from '@/components/custom/FilterTuner.vue'
import CrayonHeart from '@/components/decorative/CrayonHeart.vue'
import HandDrawnOutline from '@/components/custom/HandDrawnOutline.vue'
const sudoku = useSudoku()
const hoverCardOpen = ref(false)
let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null

function toggleHoverCard() {
  hoverCardOpen.value = !hoverCardOpen.value
}

function closeHoverCard() {
  hoverCardOpen.value = false
}

function onHoverEnter() {
  if (hoverCloseTimer) {
    clearTimeout(hoverCloseTimer)
    hoverCloseTimer = null
  }
  hoverCardOpen.value = true
}

function onHoverLeave() {
  hoverCloseTimer = setTimeout(() => {
    hoverCardOpen.value = false
    hoverCloseTimer = null
  }, 150)
}
</script>

<template>
  <div
    class="flex h-screen flex-col bg-background py-3 text-foreground"
    :style="{ backgroundImage: 'var(--paper-clean-texture)', backgroundAttachment: 'fixed', backgroundSize: '60px 60px' }"
    @click="closeHoverCard"
  >
    <!-- Shared SVG filter definitions -->
    <SvgFilters />

    <!-- Filter tuner — dev tool, disabled for production -->
    <!-- <FilterTuner /> -->

    <!-- Desktop: fixed corner overlay -->
    <div
      class="corner-left hidden md:block"
      @click.stop="toggleHoverCard"
      @mouseenter="onHoverEnter"
      @mouseleave="onHoverLeave"
    >
      <a
        href="https://github.com/mkbabb/csp-solver"
        target="_blank"
        rel="noopener noreferrer"
        class="font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
        @click.stop.prevent="toggleHoverCard"
      >@mbabb</a>
      <div class="hover-card" :class="{ 'is-open': hoverCardOpen }">
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
        <a href="https://github.com/mkbabb/csp-solver" target="_blank" rel="noopener noreferrer" class="block text-sm text-foreground hover:underline">View project on GitHub</a>
      </div>
    </div>

    <div class="corner-right" @click.stop>
      <DarkModeToggle />
    </div>

    <main class="main-content flex min-h-0 flex-1 flex-col items-center justify-center px-1 md:px-4">
      <div class="board-group">
        <!-- Mobile: @mbabb in-flow, left-aligned with logo -->
        <div
          class="mobile-attribution md:hidden"
          @click.stop="toggleHoverCard"
        >
          <a
            href="https://github.com/mkbabb/csp-solver"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            @click.stop.prevent="toggleHoverCard"
          >@mbabb</a>
          <div class="hover-card" :class="{ 'is-open': hoverCardOpen }">
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
            <a href="https://github.com/mkbabb/csp-solver" target="_blank" rel="noopener noreferrer" class="block text-sm text-foreground hover:underline">View project on GitHub</a>
          </div>
        </div>
        <!-- Logo: left-aligned with board -->
        <HandwrittenLogo />
        <!-- Board + Controls row -->
        <div class="app-layout">
          <!-- Board -->
          <SudokuBoard
            :size="sudoku.size.value"
            :board-size="sudoku.boardSize.value"
            :total-cells="sudoku.totalCells.value"
            :values="sudoku.values.value"
            :given-cells="sudoku.givenCells.value"
            :overridden-cells="sudoku.overriddenCells.value"
            :animating-cells="sudoku.animatingCells.value"
            :solve-state="sudoku.solveState.value"
            :solved-values="sudoku.solvedValues.value"
            :board-generation="sudoku.boardGeneration.value"
            @update-cell="(pos: number, val: number) => sudoku.setCell(pos, val)"
          />

          <!-- Mobile: unified controls card below board -->
          <div class="mobile-board-width md:hidden">
            <HandDrawnOutline :stroke-width="3">
              <div class="rounded-lg bg-card px-2 py-1.5">
                <ControlPanel
                  :size="sudoku.size.value"
                  :difficulty="sudoku.difficulty.value"
                  :loading="sudoku.loading.value"
                  :solve-state="sudoku.solveState.value"
                  mobile
                  @update:size="sudoku.size.value = $event"
                  @update:difficulty="sudoku.difficulty.value = $event"
                  @randomize="sudoku.randomize()"
                  @clear="sudoku.clearBoard()"
                  @solve="sudoku.solve()"
                />
              </div>
            </HandDrawnOutline>
          </div>

          <!-- Desktop sidebar: controls card (aligned with board top) -->
          <div class="hidden md:flex md:flex-col md:items-start">
            <HandDrawnOutline :stroke-width="3">
              <div class="controls-card rounded-xl bg-card p-5">
                <ControlPanel
                  :size="sudoku.size.value"
                  :difficulty="sudoku.difficulty.value"
                  :loading="sudoku.loading.value"
                  :solve-state="sudoku.solveState.value"
                  @update:size="sudoku.size.value = $event"
                  @update:difficulty="sudoku.difficulty.value = $event"
                  @randomize="sudoku.randomize()"
                  @clear="sudoku.clearBoard()"
                  @solve="sudoku.solve()"
                />
              </div>
            </HandDrawnOutline>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* Corner overlays: absolutely positioned, no layout influence */
.corner-left {
  position: fixed;
  top: 0.5rem;
  left: 0.75rem;
  z-index: 40;
  cursor: pointer;
}

/* Mobile: @mbabb in document flow, left-aligned with logo */
.mobile-attribution {
  position: relative;
  align-self: flex-start;
  cursor: pointer;
  z-index: 40;
  margin-bottom: 0.125rem;
}

.corner-right {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 60;
  --toggle-size: 5rem;
}

@media (min-width: 768px) {
  .corner-right {
    --toggle-size: 8rem;
  }
}

@media (min-width: 1024px) {
  .corner-right {
    --toggle-size: 13rem;
  }
}

.app-layout {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

@media (max-width: 767px) {
  .corner-right {
    top: 0.5rem;
    right: 0.75rem;
  }

  .app-layout {
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    width: 100%;
  }
}

.board-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: visible;
}

@media (max-width: 767px) {
  .board-group {
    align-items: center;
  }
}

@media (max-width: 767px) {
  .main-content {
    justify-content: center;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
  }
}

/* Controls card hover — subtle shadow lift only */
.controls-card {
  position: relative;
  z-index: 45;
  transition: box-shadow 300ms;
}

.controls-card:hover {
  box-shadow: 4px 6px 0px var(--color-foreground);
}

.mobile-board-width {
  width: min(42rem, calc(100vw - 1.5rem));
}

/* Hover card */
.hover-card-wrapper {
  position: relative;
  cursor: pointer;
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

/* Bridge the gap between trigger and card so hover doesn't break */
.hover-card::before {
  content: '';
  position: absolute;
  top: -1rem;
  left: 0;
  right: 0;
  height: 1rem;
}

/* Show card — covers both JS-driven hover and mobile tap */
.hover-card.is-open {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1) translateY(0);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

</style>

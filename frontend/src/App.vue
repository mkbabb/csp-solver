<script setup lang="ts">
import { ref } from 'vue'
import { useSudoku } from '@/composables/useSudoku'
import SudokuBoard from '@/components/custom/SudokuBoard.vue'
import ControlPanel from '@/components/custom/ControlPanel.vue'
import DarkModeToggle from '@/components/custom/DarkModeToggle.vue'
import SvgFilters from '@/components/decorative/SvgFilters.vue'
import HandwrittenLogo from '@/components/decorative/HandwrittenLogo.vue'
import FilterTuner from '@/components/custom/FilterTuner.vue'
import CrayonHeart from '@/components/decorative/CrayonHeart.vue'
import { ChevronDown, Shuffle, Eraser, Sparkles } from 'lucide-vue-next'

const sudoku = useSudoku()
const mobileControlsOpen = ref(false)
const hoverCardOpen = ref(false)

function toggleHoverCard() {
  hoverCardOpen.value = !hoverCardOpen.value
}

function closeHoverCard() {
  hoverCardOpen.value = false
}
</script>

<template>
  <div
    class="flex h-screen flex-col bg-background text-foreground"
    :style="{ backgroundImage: 'var(--paper-clean-texture)', backgroundAttachment: 'fixed', backgroundSize: '60px 60px' }"
    @click="closeHoverCard"
  >
    <!-- Shared SVG filter definitions -->
    <SvgFilters />

    <!-- Filter tuner — dev tool for real-time filter parameter editing -->
    <FilterTuner />

    <!-- Sun/moon toggle — fixed top-right corner -->
    <div class="sun-corner" @click.stop>
      <DarkModeToggle />
    </div>

    <!-- @mbabb — fixed top-left corner -->
    <div class="mbabb-corner" @click.stop>
      <div class="hover-card-wrapper" @click.stop="toggleHoverCard">
        <a
          href="https://github.com/mkbabb/csp-solver"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          @click.stop
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
    </div>

    <main class="main-content mx-auto flex min-h-0 max-w-4xl flex-1 flex-col items-center justify-center px-4">
      <div class="board-group">
        <HandwrittenLogo />

        <!-- Board + Controls row -->
        <div class="app-layout">
          <!-- Mobile: settings dropdown above board -->
          <div class="mobile-board-width sm:hidden">
            <button
              @click="mobileControlsOpen = !mobileControlsOpen"
              class="mobile-toggle-bar flex w-full items-center justify-end rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground"
              :class="mobileControlsOpen ? 'is-open rounded-b-none' : 'cartoon-shadow-sm'"
            >
              <ChevronDown
                :size="18"
                class="transition-transform duration-300 ease-out"
                :class="mobileControlsOpen ? 'rotate-180' : ''"
              />
            </button>

            <div
              class="mobile-panel"
              :class="{ 'is-open': mobileControlsOpen }"
            >
              <div class="mobile-panel-inner rounded-b-lg bg-card px-5 pb-4 pt-3 cartoon-shadow-sm">
                <ControlPanel
                  :size="sudoku.size.value"
                  :difficulty="sudoku.difficulty.value"
                  :loading="sudoku.loading.value"
                  :solve-state="sudoku.solveState.value"
                  :hide-actions="true"
                  @update:size="sudoku.size.value = $event"
                  @update:difficulty="sudoku.difficulty.value = $event"
                />
              </div>
            </div>
          </div>

          <!-- Board -->
          <SudokuBoard
            :size="sudoku.size.value"
            :board-size="sudoku.boardSize.value"
            :total-cells="sudoku.totalCells.value"
            :values="sudoku.values.value"
            :given-cells="sudoku.givenCells.value"
            :solve-state="sudoku.solveState.value"
            :solved-values="sudoku.solvedValues.value"
            :board-generation="sudoku.boardGeneration.value"
            @update-cell="(pos: number, val: number) => sudoku.setCell(pos, val)"
          />

          <!-- Mobile: action buttons below board -->
          <div class="mobile-board-width sm:hidden">
            <div class="flex items-center justify-center gap-2 rounded-lg bg-card px-4 py-2 cartoon-shadow-sm">
              <button
                @click="sudoku.randomize()"
                :disabled="sudoku.loading.value"
                class="action-btn"
                aria-label="Randomize board"
              >
                <Shuffle :size="28" />
              </button>
              <button
                @click="sudoku.clearBoard()"
                :disabled="sudoku.loading.value"
                class="action-btn"
                aria-label="Clear board"
              >
                <Eraser :size="28" />
              </button>
              <button
                @click="sudoku.solve()"
                :disabled="sudoku.loading.value"
                class="action-btn"
                aria-label="Solve puzzle"
              >
                <svg v-if="sudoku.loading.value" class="h-7 w-7 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                <Sparkles v-else :size="28" class="sparkle-icon" />
              </button>
            </div>
          </div>

          <!-- Desktop sidebar: controls card (aligned with board top) -->
          <div class="hidden sm:flex sm:flex-col sm:items-start">
            <div class="controls-card cartoon-shadow-sm rounded-xl bg-card p-5">
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
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* Sun/moon toggle pinned to top-right corner */
.sun-corner {
  position: fixed;
  top: 0;
  right: 0.25rem;
  z-index: 50;
}

@media (max-width: 640px) {
  .sun-corner {
    top: 0;
    right: 0;
  }
}

.app-layout {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 2rem;
}

@media (max-width: 640px) {
  .app-layout {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }
}

.board-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* @mbabb pinned to top-left corner */
.mbabb-corner {
  position: fixed;
  top: 0.75rem;
  left: 1rem;
  z-index: 50;
}

@media (max-width: 640px) {
  .board-group {
    align-items: center;
  }
}

/* Controls card hover — subtle shadow lift only */
.controls-card {
  transition: box-shadow 300ms;
}

.controls-card:hover {
  box-shadow: 4px 6px 0px var(--color-foreground);
}

.mobile-board-width {
  width: min(36rem, 85vw);
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
  margin-top: 0.5rem;
  padding: 1rem;
  background: color-mix(in srgb, var(--color-popover) 80%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 2px solid color-mix(in srgb, var(--color-border) 30%, transparent);
  border-radius: 1rem;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.9) translateY(8px);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  min-width: 16rem;
}

/* Desktop hover */
.hover-card-wrapper:hover .hover-card {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1) translateY(0);
}

/* Mobile tap-to-toggle */
.hover-card.is-open {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1) translateY(0);
}

/* Mobile toggle bar */
.mobile-toggle-bar {
  transition: border-radius 200ms ease, box-shadow 200ms ease;
}

.mobile-toggle-bar.is-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

/* Mobile panel — smooth CSS transition (no keyframes) */
.mobile-panel {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 250ms ease;
}

.mobile-panel.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.mobile-panel-inner {
  overflow: hidden;
}

/* Action buttons below board (mobile) */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  color: var(--color-muted-foreground);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 150ms;
}

.action-btn:hover {
  color: var(--color-foreground);
  background: var(--color-accent);
}

.action-btn:active {
  transform: scale(0.93);
}

.action-btn:disabled {
  opacity: 0.4;
  pointer-events: none;
}

/* Sparkle icon - pastel rainbow filled */
.sparkle-icon :deep(*) {
  stroke: url(#sparkle-rainbow) !important;
  fill: url(#sparkle-rainbow) !important;
}

</style>

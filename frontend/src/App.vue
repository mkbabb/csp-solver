<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useSudoku } from '@/composables/useSudoku'
import SudokuBoard from '@/components/custom/SudokuBoard.vue'
import ControlPanel from '@/components/custom/ControlPanel.vue'
import DarkModeToggle from '@/components/custom/DarkModeToggle.vue'
import { ChevronDown } from 'lucide-vue-next'

const { isDark } = useTheme()
const sudoku = useSudoku()
const mobileControlsOpen = ref(false)
</script>

<template>
  <div
    :class="{ dark: isDark }"
    class="min-h-screen overflow-x-hidden bg-background text-foreground"
    :style="{ backgroundImage: 'var(--paper-clean-texture)', backgroundAttachment: 'fixed', backgroundSize: '60px 60px' }"
  >
    <!-- Hidden SVG defs for pastel rainbow gradient -->
    <svg width="0" height="0" style="position: absolute">
      <defs>
        <linearGradient id="sparkle-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f9a8d4" />
          <stop offset="25%" stop-color="#c4b5fd" />
          <stop offset="50%" stop-color="#93c5fd" />
          <stop offset="75%" stop-color="#6ee7b7" />
          <stop offset="100%" stop-color="#fde68a" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Sticky header -->
    <header class="sticky top-0 z-40 mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:py-5">
      <h1 class="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
        sudoku
      </h1>
      <div class="flex items-center gap-3">
        <!-- @mbabb with hover card -->
        <div class="hover-card-wrapper">
          <a
            href="https://github.com/mkbabb/csp-solver"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >@mbabb</a>
          <div class="hover-card">
            <div class="flex gap-3">
              <img
                src="https://avatars.githubusercontent.com/u/2848617?v=4"
                alt="mkbabb"
                class="h-10 w-10 rounded-full"
              />
              <div>
                <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="font-mono text-sm font-semibold text-foreground hover:underline">@mbabb</a>
                <p class="mt-0.5 text-xs italic text-muted-foreground">CSP-powered Sudoku solver</p>
              </div>
            </div>
            <hr class="my-2 border-border/50" />
            <a href="https://github.com/mkbabb/csp-solver" target="_blank" rel="noopener noreferrer" class="block text-sm text-foreground hover:underline">View project on GitHub</a>
          </div>
        </div>
        <DarkModeToggle class="h-7 w-7" />
      </div>
    </header>

    <main class="main-content mx-auto flex max-w-4xl flex-col items-center justify-center px-4">
      <!-- Board + Controls row -->
      <div class="app-layout">
        <!-- Board -->
        <div class="min-w-0 flex-shrink">
          <SudokuBoard
            :size="sudoku.size.value"
            :board-size="sudoku.boardSize.value"
            :total-cells="sudoku.totalCells.value"
            :values="sudoku.values.value"
            :given-cells="sudoku.givenCells.value"
            :solve-state="sudoku.solveState.value"
            :solved-values="sudoku.solvedValues.value"
            @update-cell="(pos: number, val: number) => sudoku.setCell(pos, val)"
          />
        </div>

        <!-- Controls card (right side on desktop) -->
        <div class="hidden sm:block">
          <div class="cartoon-shadow-sm rounded-xl bg-card p-4">
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

      <!-- Mobile controls bar -->
      <div class="mt-4 w-full sm:hidden">
        <!-- Toggle bar -->
        <button
          @click="mobileControlsOpen = !mobileControlsOpen"
          class="flex w-full items-center justify-between rounded-lg bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200"
          :class="mobileControlsOpen ? 'rounded-b-none border-b-0' : 'cartoon-shadow-sm'"
        >
          <span>Controls</span>
          <ChevronDown
            :size="16"
            class="transition-transform duration-300"
            :class="mobileControlsOpen ? 'rotate-180' : ''"
          />
        </button>

        <!-- Expandable panel -->
        <Transition
          enter-active-class="mobile-panel-enter"
          leave-active-class="mobile-panel-leave"
        >
          <div
            v-if="mobileControlsOpen"
            class="overflow-hidden rounded-b-lg bg-card px-4 pb-4 cartoon-shadow-sm"
            style="border-top: 1px solid var(--color-border)"
          >
            <div class="pt-3">
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
        </Transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
.main-content {
  min-height: calc(100vh - 5.5rem);
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
  }
}

/* Hover card */
.hover-card-wrapper {
  position: relative;
}

.hover-card {
  position: absolute;
  top: 100%;
  right: 0;
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

.hover-card-wrapper:hover .hover-card {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1) translateY(0);
}

/* Mobile panel animations */
.mobile-panel-enter {
  animation: slideDown 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.mobile-panel-leave {
  animation: slideUp 200ms cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 24rem;
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    max-height: 24rem;
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
}
</style>

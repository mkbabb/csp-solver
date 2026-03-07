<script setup lang="ts">
import { ref } from 'vue'
import { useSudoku } from '@/composables/useSudoku'
import SudokuBoard from '@/components/custom/SudokuBoard.vue'
import ControlPanel from '@/components/custom/ControlPanel.vue'
import DarkModeToggle from '@/components/custom/DarkModeToggle.vue'
import SvgFilters from '@/components/decorative/SvgFilters.vue'
import HandwrittenLogo from '@/components/decorative/HandwrittenLogo.vue'
// import FilterTuner from '@/components/custom/FilterTuner.vue'
import AttributionCard from '@/components/custom/AttributionCard.vue'
import HandDrawnOutline from '@/components/custom/HandDrawnOutline.vue'
const sudoku = useSudoku()

const desktopAttribution = ref<InstanceType<typeof AttributionCard> | null>(null)
const mobileAttribution = ref<InstanceType<typeof AttributionCard> | null>(null)

function closeAll() {
  desktopAttribution.value?.close()
  mobileAttribution.value?.close()
}
</script>

<template>
  <div
    class="flex h-screen flex-col bg-background py-1 md:py-3 text-foreground"
    @click="closeAll"
  >
    <!-- Shared SVG filter definitions -->
    <SvgFilters />

    <!-- Filter tuner — dev tool, disabled for production -->
    <!-- <FilterTuner /> -->

    <!-- Desktop: fixed corner overlay -->
    <AttributionCard ref="desktopAttribution" />

    <div class="corner-right" @click.stop>
      <DarkModeToggle />
    </div>

    <main class="main-content flex min-h-0 flex-1 flex-col items-center justify-center px-1 md:px-4">
      <div class="board-group">
        <!-- Mobile: @mbabb in-flow, left-aligned with logo -->
        <AttributionCard ref="mobileAttribution" mobile />
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
    top: -0.25rem;
    right: 0.25rem;
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
    justify-content: flex-start;
    padding-top: 0.25rem;
    padding-bottom: 0.5rem;
  }
}

.controls-card {
  position: relative;
  z-index: 45;
}

.mobile-board-width {
  width: min(42rem, calc(100vw - 1.5rem));
}
</style>

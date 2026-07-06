<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { useSudoku } from '@games/sudoku/composables/useSudoku'
import SudokuBoard from '@games/sudoku/SudokuBoard/SudokuBoard.vue'
import ControlPanel from '@games/sudoku/ControlPanel/ControlPanel.vue'
import DarkModeToggle from '@pencil/celestial/DarkModeToggle.vue'
import SvgFilters from '@pencil/chrome/SvgFilters.vue'
import HandwrittenLogo from '@pencil/chrome/HandwrittenLogo.vue'
import AttributionCard from '@pencil/chrome/AttributionCard/AttributionCard.vue'
import HandDrawnOutline from '@pencil/grid/HandDrawnOutline.vue'
// Async + mounted-on-first-peek: keeps the laminate's ~227 LOC out of the main
// chunk (the W9 bundle gate) — same discipline as FilterTuner. The chunk loads
// on the first K/hold, imperceptible locally.
const AnswerKeyLaminate = defineAsyncComponent(() => import('@pencil/sheet/AnswerKeyLaminate.vue'))

// Dev-only tuning tool — explicit env gate, not a commented-out import. import.meta.env.DEV
// is statically inlined at build time, so the dynamic import()'s chunk is dead-code-eliminated
// from production builds rather than merely being unreferenced source.
const FilterTuner = import.meta.env.DEV
  ? defineAsyncComponent(() => import('@pencil/dev/FilterTuner.vue'))
  : null

const sudoku = useSudoku()

const desktopAttribution = ref<InstanceType<typeof AttributionCard> | null>(null)
const mobileAttribution = ref<InstanceType<typeof AttributionCard> | null>(null)

function closeAll() {
  desktopAttribution.value?.close()
  mobileAttribution.value?.close()
}

// ── Answer-key peek — hold-to-peek at the teacher's laminated key ────
// State lives here (App owns the board+laminate stacking context); ControlPanel
// drives it by holding the BoilDivider, and K/Esc are an unconditional motor-a11y
// alternative. The laminate is read-only — the peek never touches `values`.
const peekActive = ref(false)
const peekTouched = ref(false) // first peek mounts the async laminate; stays true
const peekSolutionValues = ref<Record<string, number>>({})

async function startPeek() {
  if (peekActive.value) return
  // Guard: no peek mid-solve (design-union §4.2).
  if (sudoku.solveState.value === 'solving') return
  peekTouched.value = true
  peekActive.value = true // freeze + lay the laminate down immediately
  try {
    peekSolutionValues.value = await sudoku.peekSolution()
  } catch {
    // solve unavailable — lift the (empty) laminate back off, fail quietly.
    peekActive.value = false
  }
}

function endPeek() {
  if (!peekActive.value) return
  peekActive.value = false
}

// Keyboard: K toggles the peek, Esc closes it (both unconditional).
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    endPeek()
    return
  }
  if (e.key === 'k' || e.key === 'K') {
    const t = e.target as HTMLElement | null
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
    e.preventDefault()
    if (peekActive.value) endPeek()
    else startPeek()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    class="flex h-screen flex-col bg-background py-1 md:py-3 text-foreground"
    @click="closeAll"
  >
    <!-- Shared SVG filter definitions -->
    <SvgFilters />

    <!-- Filter tuner — dev tool, env-gated (import.meta.env.DEV), absent from prod builds -->
    <component :is="FilterTuner" v-if="FilterTuner" />

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
          <!-- Board + the held answer-key laminate (a sibling over the board, never
               inside the grid's filtered group — kill-gate rule 6). The host tightly
               wraps the board box so the laminate's inset:0 aligns to .board-cells. -->
          <div class="board-peek-host">
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
              :difficulty="sudoku.difficulty.value"
              :error-code="sudoku.errorCode.value"
              @update-cell="(pos: number, val: number) => sudoku.setCell(pos, val)"
              @retry="sudoku.solve()"
            />
            <AnswerKeyLaminate
              v-if="peekTouched"
              :active="peekActive"
              :solution="peekSolutionValues"
              :board-size="sudoku.boardSize.value"
              :subgrid-size="sudoku.size.value"
              :original-given-cells="sudoku.originalGivenCells.value"
            />
          </div>

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
                  @peek-start="startPeek()"
                  @peek-end="endPeek()"
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
                  @peek-start="startPeek()"
                  @peek-end="endPeek()"
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

/* Positioning context for the answer-key laminate. Shrink-wraps the board box
   (the board-wrapper carries a definite, viewport-driven width + aspect-square),
   so the absolutely-positioned laminate's inset:0 tracks the board exactly. The
   below-board margin strip lives inside the board and paints past this host. */
.board-peek-host {
  position: relative;
  display: flex;
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

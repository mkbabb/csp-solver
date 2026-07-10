<script setup lang="ts">
/**
 * Self-contained Futoshiki scene — board + controls + answer-key laminate + hold/keyboard
 * peek wiring. App.vue mounts this behind `v-if="game === 'futoshiki'"`, so `useFutoshiki`
 * (and its Worker) only spin up when Futoshiki is actually selected; switching away unmounts
 * it and stops its keyboard listener, leaving Sudoku's own peek path untouched.
 *
 * The peek/laminate wiring mirrors App.vue's Sudoku block (the laminate is board-shape-
 * agnostic by design — G5). The gesture logic lives here (the game layer); only the
 * rendered laminate is pencil.
 */
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useFutoshiki } from './composables/useFutoshiki'
import FutoshikiBoard from './FutoshikiBoard/FutoshikiBoard.vue'
import ControlPanel from './ControlPanel/ControlPanel.vue'
import HandDrawnOutline from '@pencil/grid/HandDrawnOutline.vue'
// Statically imported (not async) so it mounts synchronously within the peek's nextTick,
// letting `active` transition false→true AFTER mount — AnswerKeyLaminate's watch(active)
// isn't immediate, so it must observe the change to lay the laminate down. This whole
// FutoshikiGame scene is already a lazy chunk, so the laminate rides that chunk, never the
// main bundle.
import AnswerKeyLaminate from '@pencil/sheet/AnswerKeyLaminate.vue'

const futoshiki = useFutoshiki()

// ── Answer-key peek — hold-to-peek at the teacher's laminated key ────
const peekActive = ref(false)
const peekTouched = ref(false)
const peekSolutionValues = ref<Record<string, number>>({})

async function startPeek() {
  if (peekActive.value) return
  if (futoshiki.solveState.value === 'solving') return
  peekTouched.value = true // mount the laminate (active still false)
  await nextTick() // …so the next assignment is an observed false→true transition
  peekActive.value = true
  try {
    peekSolutionValues.value = await futoshiki.peekSolution()
  } catch {
    peekActive.value = false
  }
}

function endPeek() {
  if (!peekActive.value) return
  peekActive.value = false
}

// Keyboard: K toggles the peek, Esc closes it (parity with Sudoku).
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
  <div class="app-layout">
    <!-- Board + the held answer-key laminate (a sibling over the board) -->
    <div class="board-peek-host">
      <FutoshikiBoard
        :board-size="futoshiki.boardSize.value"
        :total-cells="futoshiki.totalCells.value"
        :values="futoshiki.values.value"
        :given-cells="futoshiki.givenCells.value"
        :overridden-cells="futoshiki.overriddenCells.value"
        :animating-cells="futoshiki.animatingCells.value"
        :solve-state="futoshiki.solveState.value"
        :solved-values="futoshiki.solvedValues.value"
        :board-generation="futoshiki.boardGeneration.value"
        :inequalities="futoshiki.inequalities.value"
        :error-code="futoshiki.errorCode.value"
        @update-cell="(pos: number, val: number) => futoshiki.setCell(pos, val)"
        @retry="futoshiki.solve()"
      />
      <AnswerKeyLaminate
        v-if="peekTouched"
        :active="peekActive"
        :solution="peekSolutionValues"
        :board-size="futoshiki.boardSize.value"
        :subgrid-size="futoshiki.boardSize.value"
        :original-given-cells="futoshiki.originalGivenCells.value"
      />
    </div>

    <!-- Stacked (<lg, incl. iPad portrait — R3): unified controls card below board -->
    <div class="mobile-board-width lg:hidden">
      <HandDrawnOutline :stroke-width="3">
        <div class="rounded-lg bg-card px-2 py-1.5">
          <ControlPanel
            :board-size="futoshiki.boardSize.value"
            :loading="futoshiki.loading.value"
            :solve-state="futoshiki.solveState.value"
            mobile
            @update:board-size="futoshiki.boardSize.value = $event"
            @randomize="futoshiki.randomize()"
            @clear="futoshiki.clearBoard()"
            @solve="futoshiki.solve()"
            @peek-start="startPeek()"
            @peek-end="endPeek()"
          />
        </div>
      </HandDrawnOutline>
    </div>

    <!-- Row-regime sidebar (≥lg — R3): controls card, vertically centered against the
         board (H8-centering-only). -->
    <div class="hidden lg:flex lg:flex-col lg:items-start">
      <HandDrawnOutline :stroke-width="3">
        <div class="controls-card rounded-xl bg-card p-5">
          <ControlPanel
            :board-size="futoshiki.boardSize.value"
            :loading="futoshiki.loading.value"
            :solve-state="futoshiki.solveState.value"
            @update:board-size="futoshiki.boardSize.value = $event"
            @randomize="futoshiki.randomize()"
            @clear="futoshiki.clearBoard()"
            @solve="futoshiki.solve()"
            @peek-start="startPeek()"
            @peek-end="endPeek()"
          />
        </div>
      </HandDrawnOutline>
    </div>
  </div>
</template>

<style scoped>
/* H8-centering-only: row regime centers the controls card against the board. */
.app-layout {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Positioning context for the answer-key laminate — shrink-wraps the board box so the
   absolutely-positioned laminate's inset:0 tracks the board exactly. */
.board-peek-host {
  position: relative;
  display: flex;
}

.controls-card {
  position: relative;
  z-index: 45;
}

.mobile-board-width {
  width: min(42rem, calc(100vw - 1.5rem));
}

/* Stacked regime — <lg after R3 (iPad portrait clips in the row layout). */
@media (max-width: 1023px) {
  .app-layout {
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    width: 100%;
  }
}
</style>

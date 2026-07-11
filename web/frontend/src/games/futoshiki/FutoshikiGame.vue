<script setup lang="ts">
/**
 * Self-contained Futoshiki scene — board + controls + answer-key laminate + hold/keyboard
 * peek wiring. App.vue mounts this behind `v-if="game === 'futoshiki'"`, so `useFutoshiki`
 * (and its Worker) only spin up when Futoshiki is actually selected; switching away unmounts
 * it and stops its keyboard listener, leaving Sudoku's own peek path untouched.
 *
 * Structural mirror of SudokuGame.vue; the peek gesture lives in the shared `useAnswerKeyPeek`
 * composable (the laminate is board-shape-agnostic by design — G5), only the rendered laminate
 * is pencil.
 */
import { onMounted } from 'vue'
import { useFutoshiki } from './composables/useFutoshiki'
import { prewarm } from './solver/useSolver'
import FutoshikiBoard from './FutoshikiBoard/FutoshikiBoard.vue'
import ControlPanel from './ControlPanel/ControlPanel.vue'
import HandDrawnOutline from '@pencil/grid/HandDrawnOutline.vue'
import { useAnswerKeyPeek } from '@games/shared/useAnswerKeyPeek'
// Statically imported (not async): this whole FutoshikiGame scene is already a lazy chunk, so
// the laminate rides that chunk, never the main bundle. (Sudoku is eager, so it keeps the
// laminate async — either way `{immediate:true}` lays it down on mount, P2-L5 §R6(a).)
import AnswerKeyLaminate from '@pencil/sheet/AnswerKeyLaminate.vue'

// F6 page-turn (T3-W10): `leaving` routes the switch-away through the board's erase beat
// while the scene chrome fades (scene.css `.scene-leaving`); `erased` reports the seam back
// to App. Structural twin of SudokuGame's wiring (D16).
const props = defineProps<{ leaving?: boolean }>()
const emit = defineEmits<{ (e: 'erased'): void }>()

const futoshiki = useFutoshiki()

// Cold-start prewarm (T3-W8 §cold-start): this scene is async + v-if-gated, so it
// warms its own solver Worker + wasm on the first idle tick after its own mount —
// not at app mount (Sudoku owns that). `requestIdleCallback` keeps it off the
// critical mount path; `setTimeout` is the fallback. Idempotent.
onMounted(() => {
  const warm = () => prewarm()
  if ('requestIdleCallback' in window) requestIdleCallback(warm)
  else setTimeout(warm, 1)
})

const { peekActive, peekTouched, peekSolutionValues, startPeek, endPeek } = useAnswerKeyPeek({
  solveState: futoshiki.solveState,
  peekSolution: futoshiki.peekSolution,
  setMarksActive: futoshiki.setMarksActive,
})

// Share act (W6): encode the current Futoshiki board (values + inequalities) into
// `?board=`, write it to the address bar (URL wins over storage on reload), and copy the
// link. The clipboard write may reject without a gesture/permission — the param write
// already happened, so the shared link is live in the address bar regardless.
function onShare() {
  const url = futoshiki.shareBoard()
  navigator.clipboard?.writeText(url).catch(() => {})
}
</script>

<template>
  <div class="app-layout" :class="{ 'scene-leaving': props.leaving }">
    <!-- Board + the held answer-key laminate (a sibling over the board) -->
    <div class="board-peek-host">
      <FutoshikiBoard
        :leaving="props.leaving"
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
        :solve-stats="futoshiki.solveStats.value"
        :pencil-marks="futoshiki.pencilMarks.value"
        @update-cell="(pos: number, val: number) => futoshiki.setCell(pos, val)"
        @retry="futoshiki.solve()"
        @undo="futoshiki.undo()"
        @redo="futoshiki.redo()"
        @hint="(pos: number) => futoshiki.hintCell(pos)"
        @erased="emit('erased')"
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
            @share="onShare()"
            @peek-start="startPeek()"
            @peek-end="endPeek()"
          />
        </div>
      </HandDrawnOutline>
    </div>

    <!-- Row-regime sidebar (≥lg — R3): controls card, vertically centered against the
         board (H8-centering-only). -->
    <div class="scene-controls hidden lg:flex lg:flex-col lg:items-start">
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
            @share="onShare()"
            @peek-start="startPeek()"
            @peek-end="endPeek()"
          />
        </div>
      </HandDrawnOutline>
    </div>
  </div>
</template>

<style scoped src="@/games/shared/scene.css"></style>

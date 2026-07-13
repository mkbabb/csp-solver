<script setup lang="ts">
/**
 * Self-contained Sudoku scene — board + controls + answer-key laminate + hold/keyboard peek
 * wiring. App.vue mounts this behind `v-if="game === 'sudoku'"`, EAGER/static: the default
 * game rides the main chunk (ratified asymmetry, P4 #4). Structural mirror of FutoshikiGame.vue;
 * the peek gesture lives in the shared `useAnswerKeyPeek` composable, only the rendered laminate
 * is pencil.
 */
import { defineAsyncComponent, onMounted, onUnmounted, ref } from "vue";
import { useSudoku } from "./composables/useSudoku";
import { prewarm } from "./solver/useSolver";
import SudokuBoard from "./SudokuBoard/SudokuBoard.vue";
import ControlPanel from "./ControlPanel/ControlPanel.vue";
import DrawerTab from "@games/shared/DrawerTab.vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import { useAnswerKeyPeek } from "@games/shared/useAnswerKeyPeek";
import {
  registerDrawerScene,
  useControlsDrawer,
} from "@games/shared/useControlsDrawer";
// Async + mounted-on-first-peek: keeps the laminate's ~227 LOC out of the main chunk (the W9
// bundle gate) — same discipline as FilterTuner. The chunk loads on the first K/hold,
// imperceptible locally. (Futoshiki imports it statically since its whole scene already rides a
// lazy chunk; Sudoku is eager, so it keeps the laminate async. The `{immediate:true}` activation
// watch lays it down on the async mount regardless — P2-L5 §R6(a).)
const AnswerKeyLaminate = defineAsyncComponent(
  () => import("@pencil/sheet/AnswerKeyLaminate.vue"),
);

// F6 page-turn (T3-W10): `leaving` routes the switch-away through the board's erase beat
// (the grid's EXISTING animateErase, merely unrouted before) while the scene chrome fades
// (scene.css `.scene-leaving`); `erased` reports the seam back to App, which flips the v-if.
const props = defineProps<{ leaving?: boolean }>();
const emit = defineEmits<{ (e: "erased"): void }>();

const sudoku = useSudoku();

// T4-WM §2 — the board ref lets the ControlPanel's Hint button reach the board's focused
// cell (the panel is the board's sibling, so it can't read focusedPos directly). undo/redo
// need no ref — they route straight to the composable.
const sudokuBoard = ref<InstanceType<typeof SudokuBoard> | null>(null);

// Cold-start prewarm (T3-W8 §cold-start): the eager Sudoku scene mounts at app
// mount, so warm the solver Worker + wasm on the first idle tick — ahead of the
// user's first solve/generate. `requestIdleCallback` keeps it off the critical
// mount path; `setTimeout` is the fallback where it's unavailable. Idempotent.
onMounted(() => {
  const warm = () => prewarm();
  if ("requestIdleCallback" in window) requestIdleCallback(warm);
  else setTimeout(warm, 1);
});

const { peekActive, peekTouched, peekSolutionValues, startPeek, endPeek } =
  useAnswerKeyPeek({
    solveState: sudoku.solveState,
    peekSolution: sudoku.peekSolution,
    setMarksActive: sudoku.setMarksActive,
  });

// Share act (W6; T4-W3 share-truth): shareBoard() encodes the board into `?board=`, writes it to
// the address bar (URL wins over storage on reload — the shared link is live in the bar
// regardless), then returns the clipboard-copy promise. The control panel awaits it and confirms
// ONLY on resolve; a reject (insecure context, permission-policy denial, unfocused document, or
// an absent Clipboard API) surfaces "couldn't copy — link is in the address bar" instead of the
// old optimistic "copied!" over a possibly-empty clipboard.
function onShare(): Promise<void> {
  return sudoku.shareBoard();
}

// T4-WM §3 (lane E) — a long-press on a board cell opens the candidate glimpse: the same
// engine-domains pencil marks the answer-key peek rides, but marks-ONLY (no laminate), so the
// solver's surviving candidates show in place while held. Guarded exactly like startPeek — the
// answer-key peek owns the one marks surface while it's up, and the solve worker owns the board
// mid-solve (the marks ride a worker propagate) — so in both cases the long-press marks stand
// down. The end never strips marks out from under a held answer-key peek.
function onCandidatePeekStart() {
  if (peekActive.value || sudoku.solveState.value === "solving") return;
  sudoku.setMarksActive(true);
}
function onCandidatePeekEnd() {
  if (peekActive.value) return;
  sudoku.setMarksActive(false);
}

// ── The drawer (T3-W12 §6) ───────────────────────────────────────────
// The row-regime rail becomes the pencil case: the tab (inside .board-peek-host, so
// it rides the board's glide) toggles; the shared composable owns state, persistence,
// the ~480ms FLIP glide, and focus. Esc closes from within (the rail's keydown).
const { drawerOpen, drawerInert, toggleDrawer, closeDrawer } = useControlsDrawer();
const peekHost = ref<HTMLElement | null>(null);
const railEl = ref<HTMLElement | null>(null);
const panelEl = ref<HTMLElement | null>(null);
const drawerTab = ref<InstanceType<typeof DrawerTab> | null>(null);
let unregisterDrawer: (() => void) | null = null;
onMounted(() => {
  unregisterDrawer = registerDrawerScene(() => ({
    host: peekHost.value,
    rail: railEl.value,
    panel: panelEl.value,
    tab: (drawerTab.value?.el as HTMLElement | undefined) ?? null,
  }));
});
onUnmounted(() => unregisterDrawer?.());
</script>

<template>
  <div class="app-layout" :class="{ 'scene-leaving': props.leaving }">
    <!-- Board + the held answer-key laminate (a sibling over the board, never inside the
         grid's filtered group — kill-gate rule 6). The host tightly wraps the board box so
         the laminate's inset:0 aligns to .board-cells. -->
    <div ref="peekHost" class="board-peek-host">
      <SudokuBoard
        ref="sudokuBoard"
        :leaving="props.leaving"
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
        :link-error="sudoku.linkError.value"
        :error-code="sudoku.errorCode.value"
        :solve-stats="sudoku.solveStats.value"
        :pencil-marks="sudoku.pencilMarks.value"
        :hint="sudoku.hintReasoning.value"
        :grade-signature="sudoku.gradeSignature.value"
        @update-cell="(pos: number, val: number) => sudoku.setCell(pos, val)"
        @retry="sudoku.solve()"
        @undo="sudoku.undo()"
        @redo="sudoku.redo()"
        @hint="(pos: number) => sudoku.hintCell(pos)"
        @candidate-peek-start="onCandidatePeekStart"
        @candidate-peek-end="onCandidatePeekEnd"
        @erased="emit('erased')"
      />
      <AnswerKeyLaminate
        v-if="peekTouched"
        :active="peekActive"
        :solution="peekSolutionValues"
        :board-size="sudoku.boardSize.value"
        :subgrid-size="sudoku.size.value"
        :original-given-cells="sudoku.originalGivenCells.value"
      />
      <!-- The pull-tab (T3-W12 §6): the tucked case's tongue at the board's right
                 edge — inside the peek host so it rides the glide, outside the board
                 wrapper's containment (§2 P2). ≥1024 only (its own display gate). -->
      <DrawerTab ref="drawerTab" :expanded="drawerOpen" @toggle="toggleDrawer" />
    </div>

    <!-- Stacked (<lg, incl. iPad portrait — R3): unified controls card below board -->
    <div class="mobile-board-width lg:hidden">
      <HandDrawnOutline :stroke-width="3">
        <div class="bg-card rounded-lg px-2 py-1.5">
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
            @undo="sudoku.undo()"
            @redo="sudoku.redo()"
            @hint="sudokuBoard?.hintFocusedCell()"
            :share="onShare"
            @peek-start="startPeek()"
            @peek-end="endPeek()"
          />
        </div>
      </HandDrawnOutline>
    </div>

    <!-- Row-regime sidebar (≥lg — R3: iPad portrait clips at md): controls card,
         vertically centered against the board (H8-centering-only). T3-W12 §6: the rail
         IS the drawer — closed it parks under the board (scene.css), inert +
         visibility:hidden at rest (no invisible tab stops, W11 UI-6); Esc from within
         closes and returns focus to the tab. -->
    <div
      id="controls-drawer"
      ref="railEl"
      class="scene-controls hidden lg:flex lg:flex-col lg:items-start"
      :inert="drawerInert"
      @keydown.escape.stop="closeDrawer"
    >
      <HandDrawnOutline :stroke-width="3">
        <div ref="panelEl" class="controls-card bg-card rounded-xl p-5">
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
            @undo="sudoku.undo()"
            @redo="sudoku.redo()"
            @hint="sudokuBoard?.hintFocusedCell()"
            :share="onShare"
            @peek-start="startPeek()"
            @peek-end="endPeek()"
          />
        </div>
      </HandDrawnOutline>
    </div>
  </div>
</template>

<style scoped src="@/games/shared/scene.css"></style>

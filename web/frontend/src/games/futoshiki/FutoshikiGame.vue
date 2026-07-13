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
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useFutoshiki } from "./composables/useFutoshiki";
import { prewarm } from "./solver/useSolver";
import FutoshikiBoard from "./FutoshikiBoard/FutoshikiBoard.vue";
import ControlPanel from "./ControlPanel/ControlPanel.vue";
import DigitPad from "@games/shared/DigitPad.vue";
import DrawerTab from "@games/shared/DrawerTab.vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import { useAnswerKeyPeek } from "@games/shared/useAnswerKeyPeek";
import { useCoarsePointer } from "@games/shared/useCoarsePointer";
import { useStackedLayout } from "@games/shared/useStackedLayout";
import {
  registerDrawerScene,
  useControlsDrawer,
} from "@games/shared/useControlsDrawer";
// Statically imported (not async): this whole FutoshikiGame scene is already a lazy chunk, so
// the laminate rides that chunk, never the main bundle. (Sudoku is eager, so it keeps the
// laminate async — either way `{immediate:true}` lays it down on mount, P2-L5 §R6(a).)
import AnswerKeyLaminate from "@pencil/sheet/AnswerKeyLaminate.vue";

// F6 page-turn (T3-W10): `leaving` routes the switch-away through the board's erase beat
// while the scene chrome fades (scene.css `.scene-leaving`); `erased` reports the seam back
// to App. Structural twin of SudokuGame's wiring (D16).
const props = defineProps<{ leaving?: boolean }>();
const emit = defineEmits<{ (e: "erased"): void }>();

const futoshiki = useFutoshiki();

// Cold-start prewarm (T3-W8 §cold-start): this scene is async + v-if-gated, so it
// warms its own solver Worker + wasm on the first idle tick after its own mount —
// not at app mount (Sudoku owns that). `requestIdleCallback` keeps it off the
// critical mount path; `setTimeout` is the fallback. Idempotent.
onMounted(() => {
  const warm = () => prewarm();
  if ("requestIdleCallback" in window) requestIdleCallback(warm);
  else setTimeout(warm, 1);
});

const { peekActive, peekTouched, peekSolutionValues, startPeek, endPeek } =
  useAnswerKeyPeek({
    solveState: futoshiki.solveState,
    peekSolution: futoshiki.peekSolution,
    setMarksActive: futoshiki.setMarksActive,
  });

// Share act (W6; T4-W3 share-truth) — twin of SudokuGame's: shareBoard() encodes the board
// (values + inequalities) into `?board=`, writes it to the address bar (URL wins over storage
// on reload — the shared link is live in the bar regardless), then returns the clipboard-copy
// promise. The control panel awaits it and confirms ONLY on resolve; a reject (insecure context,
// permission-policy denial, unfocused document, or an absent Clipboard API) surfaces "couldn't
// copy — link is in the address bar" instead of an optimistic "copied!".
function onShare(): Promise<void> {
  return futoshiki.shareBoard();
}

// ── DigitPad (T3-W11 U-A) — twin of SudokuGame's wiring (D16) ────────
// Coarse pointer + stacked regime → the pad is the entry surface (cells flip to
// inputmode="none"); entry rides the board's exposed `enterValue` (the keyboard's path).
const isCoarse = useCoarsePointer();
const isStacked = useStackedLayout();
const padActive = computed(() => isCoarse.value && isStacked.value);
const boardRef = ref<InstanceType<typeof FutoshikiBoard> | null>(null);
const cellFocused = ref(false);

// ── The drawer (T3-W12 §6) — twin of SudokuGame's wiring (D16) ───────
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
    <!-- Board + the held answer-key laminate (a sibling over the board) -->
    <div ref="peekHost" class="board-peek-host">
      <FutoshikiBoard
        ref="boardRef"
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
        :link-error="futoshiki.linkError.value"
        :error-code="futoshiki.errorCode.value"
        :solve-stats="futoshiki.solveStats.value"
        :pencil-marks="futoshiki.pencilMarks.value"
        :pad-active="padActive"
        @cell-focus-change="cellFocused = $event"
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
      <!-- The pull-tab (T3-W12 §6) — twin of SudokuGame's: inside the peek host
                 (rides the glide), outside the board wrapper's containment (§2 P2). -->
      <DrawerTab ref="drawerTab" :expanded="drawerOpen" @toggle="toggleDrawer" />
    </div>

    <!-- Stacked (<lg, incl. iPad portrait — R3): unified controls card below board -->
    <div class="mobile-board-width lg:hidden">
      <HandDrawnOutline :stroke-width="3">
        <div class="bg-card rounded-lg px-2 py-1.5">
          <ControlPanel
            :board-size="futoshiki.boardSize.value"
            :loading="futoshiki.loading.value"
            :solve-state="futoshiki.solveState.value"
            mobile
            @update:board-size="futoshiki.boardSize.value = $event"
            @randomize="futoshiki.randomize()"
            @clear="futoshiki.clearBoard()"
            @solve="futoshiki.solve()"
            :share="onShare"
            @peek-start="startPeek()"
            @peek-end="endPeek()"
          />
          <!-- The touch entry tray (T3-W11 U-A): always present in this card on coarse
               pointers; keys write through the board's own input path. -->
          <DigitPad
            v-if="padActive"
            :board-size="futoshiki.boardSize.value"
            :enabled="cellFocused"
            @digit="boardRef?.enterValue($event)"
            @erase="boardRef?.enterValue(0)"
          />
        </div>
      </HandDrawnOutline>
    </div>

    <!-- Row-regime sidebar (≥lg — R3): controls card, vertically centered against the
         board (H8-centering-only). T3-W12 §6: the rail IS the drawer — twin of
         SudokuGame's (parked/inert/hidden closed; Esc closes from within). -->
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
            :board-size="futoshiki.boardSize.value"
            :loading="futoshiki.loading.value"
            :solve-state="futoshiki.solveState.value"
            @update:board-size="futoshiki.boardSize.value = $event"
            @randomize="futoshiki.randomize()"
            @clear="futoshiki.clearBoard()"
            @solve="futoshiki.solve()"
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

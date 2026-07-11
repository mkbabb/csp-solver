<script setup lang="ts">
/**
 * Self-contained Sudoku scene — board + controls + answer-key laminate + hold/keyboard peek
 * wiring. App.vue mounts this behind `v-if="game === 'sudoku'"`, EAGER/static: the default
 * game rides the main chunk (ratified asymmetry, P4 #4). Structural mirror of FutoshikiGame.vue;
 * the peek gesture lives in the shared `useAnswerKeyPeek` composable, only the rendered laminate
 * is pencil.
 */
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { useSudoku } from "./composables/useSudoku";
import { prewarm } from "./solver/useSolver";
import SudokuBoard from "./SudokuBoard/SudokuBoard.vue";
import ControlPanel from "./ControlPanel/ControlPanel.vue";
import DigitPad from "@games/shared/DigitPad.vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import { useAnswerKeyPeek } from "@games/shared/useAnswerKeyPeek";
import { useCoarsePointer } from "@games/shared/useCoarsePointer";
import { useStackedLayout } from "@games/shared/useStackedLayout";
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

// Share act (W6): encode the current Sudoku board into `?board=`, write it to the address bar
// (URL wins over storage on reload), and copy the full link. The clipboard write may reject
// without a user-gesture/permission — the param write already happened, so the shared link is
// live in the address bar regardless.
function onShare() {
    const url = sudoku.shareBoard();
    navigator.clipboard?.writeText(url).catch(() => {});
}

// ── DigitPad (T3-W11 U-A, ratified BUILD) ────────────────────────────
// Live exactly when the pad is the entry surface: coarse primary pointer (phones,
// tablets) AND the stacked regime (<lg — the mobile panel card is the pad's home; the
// row-regime sidebar keeps the OS keyboard instead, its 211px column can't hold 44px
// keys without overflow). `padActive` also flips the cells to inputmode="none", so
// focusing a cell no longer summons the OS keyboard the pad replaces. Entry rides the
// board's exposed `enterValue` → the SAME onCellUpdate path as typing (override rules,
// murmur hold, undo recording inherited); `cellFocused` is the pad's enablement.
const isCoarse = useCoarsePointer();
const isStacked = useStackedLayout();
const padActive = computed(() => isCoarse.value && isStacked.value);
const boardRef = ref<InstanceType<typeof SudokuBoard> | null>(null);
const cellFocused = ref(false);
</script>

<template>
    <div class="app-layout" :class="{ 'scene-leaving': props.leaving }">
        <!-- Board + the held answer-key laminate (a sibling over the board, never inside the
         grid's filtered group — kill-gate rule 6). The host tightly wraps the board box so
         the laminate's inset:0 aligns to .board-cells. -->
        <div class="board-peek-host">
            <SudokuBoard
                ref="boardRef"
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
                :error-code="sudoku.errorCode.value"
                :solve-stats="sudoku.solveStats.value"
                :pencil-marks="sudoku.pencilMarks.value"
                :pad-active="padActive"
                @cell-focus-change="cellFocused = $event"
                @update-cell="(pos: number, val: number) => sudoku.setCell(pos, val)"
                @retry="sudoku.solve()"
                @undo="sudoku.undo()"
                @redo="sudoku.redo()"
                @hint="(pos: number) => sudoku.hintCell(pos)"
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
        </div>

        <!-- Stacked (<lg, incl. iPad portrait — R3): unified controls card below board -->
        <div class="mobile-board-width lg:hidden">
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
                        @share="onShare()"
                        @peek-start="startPeek()"
                        @peek-end="endPeek()"
                    />
                    <!-- The touch entry tray (T3-W11 U-A): always present in this card on coarse
               pointers — the pencil tray already on the desk, never a focus-summoned
               pop-in. Keys write through the board's own input path. -->
                    <DigitPad
                        v-if="padActive"
                        :board-size="sudoku.boardSize.value"
                        :enabled="cellFocused"
                        @digit="boardRef?.enterValue($event)"
                        @erase="boardRef?.enterValue(0)"
                    />
                </div>
            </HandDrawnOutline>
        </div>

        <!-- Row-regime sidebar (≥lg — R3: iPad portrait clips at md): controls card, vertically
         centered against the board (H8-centering-only). -->
        <div class="scene-controls hidden lg:flex lg:flex-col lg:items-start">
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

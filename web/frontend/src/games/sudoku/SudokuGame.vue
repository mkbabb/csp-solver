<script setup lang="ts">
/**
 * Self-contained Sudoku scene — board + controls + answer-key laminate + hold/keyboard peek
 * wiring, over the game-agnostic `@games/shared/GameScene.vue` scaffold (the `.app-layout`
 * row, `.board-peek-host` + pull-tab, the doubled controls card, and the drawer registration
 * live there). App.vue mounts this behind `v-if="game === 'sudoku'"`, EAGER/static: the
 * default game rides the main chunk (ratified asymmetry, P4 #4). The peek gesture lives in the
 * shared `useAnswerKeyPeek` composable, only the rendered laminate is pencil.
 */
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useSudoku } from "./composables/useSudoku";
import { prewarm } from "./solver/useSolver";
import GameScene from "@games/shared/GameScene.vue";
import SudokuBoard from "./SudokuBoard/SudokuBoard.vue";
import GameControlPanel, {
  type ControlSection,
} from "@games/shared/GameControlPanel.vue";
import { sizeOptions, difficultyOptions } from "./ControlPanel/constants";
import type { Difficulty } from "./types";
import { useAnswerKeyPeek } from "@games/shared/useAnswerKeyPeek";
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

// The control sections, built here from the game's own selector constants. The per-game
// ControlPanel wrapper that used to relay them is gone — this is its entire surviving body.
// NOT read off `sudokuGame.options` (the thermo/killer/kenken route): Sudoku is the EAGER
// game, so `registry.ts` STATICALLY imports this scene (:24) as well as `./game` (:18).
// Importing `./game` here closes the cycle scene → game → registry → scene, and registry's
// module body evaluates `gameRegistry = { sudoku: sudokuGame }` while that const is still in
// its TDZ: the app dies at boot with "Cannot access 'sudokuGame' before initialization"
// (reproduced in-browser, Lane D ship 3). Futoshiki is lazy and has no such cycle, so its
// twin scene DOES read its declaration.
// EXERCISED ON THE ENGINE THAT MATTERS (R3b, closed T4-P1 pass 4). Cyclic-ESM evaluation
// order is engine-specific, so "it boots in Chromium" was never the question. The built dist
// was served to real MobileSafari on `perf-rig-iphone16` (iOS 19, AppleWebKit/605.1.15,
// 393×699 dpr3 coarse): 81 cells mounted, the two sections below rendered as `Size` +
// `Difficulty`, 14 chips, one Deal dealt a different board — and ZERO page errors or
// rejections, trapped from a hook installed in <head> ahead of the module script, so a
// TDZ throw at evaluation time would have been caught rather than inferred.
// The cycle forces a second copy; it does not excuse an unguarded one. `game.test.ts` mounts
// this scene and requires the list below to equal `sudokuGame.options(model)` in shape AND in
// what each onChange moves — edit one side alone and that test reds.
const sections = computed<ControlSection[]>(() => [
  {
    key: "size",
    heading: "Size",
    ariaLabel: "Size",
    options: sizeOptions,
    selected: sudoku.pendingSize.value,
    onChange: (v) => (sudoku.pendingSize.value = v as number),
  },
  {
    key: "difficulty",
    heading: "Difficulty",
    options: difficultyOptions,
    selected: sudoku.difficulty.value,
    onChange: (v) => (sudoku.difficulty.value = v as Difficulty),
  },
]);

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

// T4-W8 ROW 3 — the persistent-candidates pin adds a THIRD source that wants the engine marks up
// (beside the answer-key peek and the long-press glimpse). `longPressPeek` mirrors the glimpse so
// every marks decision is a union: a peek RELEASE never extinguishes a standing pin, and toggling
// the pin off never strips marks out from under a live peek. `setMarksActive` is idempotent, so
// re-asserting the union is free.
const longPressPeek = ref(false);

const { peekActive, peekTouched, peekSolutionValues, startPeek, endPeek } =
  useAnswerKeyPeek({
    solveState: sudoku.solveState,
    peekSolution: sudoku.peekSolution,
    // The peek reports its own edge (`active`); the union keeps marks up while the pin or a
    // held long-press still wants them, so a peek off never kills the persistent candidates.
    setMarksActive: (active) =>
      sudoku.setMarksActive(
        active || sudoku.candidatesPinned.value || longPressPeek.value,
      ),
  });

// ROW 3 — persistent candidates: hold the engine marks on while pinned (default off); releasing
// the pin clears them unless a peek / long-press still wants them. No new compute — this only
// holds `marksActive` on, and the existing `[values, boardGeneration]` refresh watch keeps the
// pinned candidates live as the board is written on.
watch(sudoku.candidatesPinned, (pinned) =>
  sudoku.setMarksActive(pinned || peekActive.value || longPressPeek.value),
);

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
  if (sudoku.solveState.value === "solving") return; // the solve worker owns the board mid-solve
  longPressPeek.value = true;
  sudoku.setMarksActive(true);
}
function onCandidatePeekEnd() {
  longPressPeek.value = false;
  // Keep marks up if the answer-key peek or the persistent pin still wants them.
  sudoku.setMarksActive(peekActive.value || sudoku.candidatesPinned.value);
}
</script>

<template>
  <GameScene :leaving="props.leaving">
    <template #board>
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
        :corner-marks="sudoku.cornerMarks.value"
        :center-marks="sudoku.centerMarks.value"
        :pencil-mode="sudoku.pencilMode.value"
        :hint="sudoku.hintReasoning.value"
        :grade-signature="sudoku.gradeSignature.value"
        :proactive-error-check="sudoku.proactiveCheck.value"
        :loading="sudoku.loading.value"
        @update-cell="(pos: number, val: number) => sudoku.setCell(pos, val)"
        @mark="(pos: number, val: number) => sudoku.toggleUserMark(pos, val)"
        @cycle-pencil-mode="sudoku.cyclePencilMode()"
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
    </template>

    <template #controls="{ mobile }">
      <GameControlPanel
        :sections="sections"
        :loading="sudoku.loading.value"
        :is-dirty="sudoku.isDirty.value"
        :pencil-mode="sudoku.pencilMode.value"
        :error-check-mode="sudoku.errorCheckMode.value"
        :proactive-check="sudoku.proactiveCheck.value"
        :candidates-pinned="sudoku.candidatesPinned.value"
        :mobile="mobile"
        :grade-tally="sudoku.gradeTally.value"
        @update:pencil-mode="sudoku.setPencilMode($event)"
        @update:error-check-mode="sudoku.setErrorCheckMode($event)"
        @update:candidates-pinned="sudoku.setCandidatesPinned($event)"
        @deal="sudoku.deal()"
        @clear="sudoku.clearBoard()"
        @solve="sudoku.solve()"
        @fill-forced="sudoku.fillForced()"
        @undo="sudoku.undo()"
        @redo="sudoku.redo()"
        @hint="sudokuBoard?.hintFocusedCell()"
        :share="onShare"
        @peek-start="startPeek()"
        @peek-end="endPeek()"
      />
    </template>
  </GameScene>
</template>

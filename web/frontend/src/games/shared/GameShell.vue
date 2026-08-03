<script setup lang="ts">
/**
 * GameShell — THE scene. One module, five games (T5-W2 2.1), and the `GameSpec`'s SOLE
 * consumer.
 *
 * The five `*Game.vue` scenes were 0.8–2.5% apart: the same model instantiation, the same
 * cold-start prewarm, the same three-source marks union (answer-key peek ∪ long-press glimpse
 * ∪ the persistent-candidates pin), the same share act, and the same two slots handed to
 * `GameScene`. What genuinely differed — which composable, which selectors, which cell, which
 * clue layer — is exactly what the spec's slots carry, so the scene is written once and READS
 * them:
 *
 *   `model()` at mount · `deal.options(model)` into the control panel · `grammar` + `clues` +
 *   `furniture` through `BoardHost` · `urlCodec.key` the game's board on disk. The cold-start
 *   warm is no longer asked of a game: 2.2 left ONE Worker, so the shell warms it directly.
 *
 * The registry cycle that forced the eager scene to hand-inline its own control sections is gone
 * with the table: `defineGame` imports nothing, so `spec → defineGame` and `cards → spec`
 * never close a loop, and the eager game reads its own `deal.options` like every other.
 *
 * FENCED, and untouched here: `GameScene`'s zone grammar and `GameControlPanel` are W4's
 * lanes. This shell only mounts them — the `.app-layout` row, the `.board-peek-host` +
 * pull-tab, the doubled controls card and the drawer registration all still live in
 * `GameScene`, byte-unchanged.
 */
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import GameScene from "@games/shared/GameScene.vue";
import BoardHost from "@games/shared/BoardHost.vue";
import GameControlPanel, {
  type ControlSection,
} from "@games/shared/GameControlPanel.vue";
import { useAnswerKeyPeek } from "@games/shared/useAnswerKeyPeek";
import { prewarm } from "@games/shared/solver/client";
import type { AnyGameSpec } from "@games/shared/defineGame";
// Async + mounted-on-first-peek: keeps the laminate's ~227 LOC out of the main chunk (the W9
// bundle gate) — same discipline as FilterTuner. The chunk loads on the first K/hold,
// imperceptible locally. The `{immediate:true}` activation watch lays it down on the async
// mount regardless (P2-L5 §R6(a)). One shell means ONE decision here, where the five scenes
// split it (sudoku async because it was eager, the other four static inside their own lazy
// chunks) — the async form is correct for both: a lazy scene's laminate simply rides a second
// small chunk that the same first peek pulls.
const AnswerKeyLaminate = defineAsyncComponent(
  () => import("@pencil/sheet/AnswerKeyLaminate.vue"),
);

const props = defineProps<{
  spec: AnyGameSpec;
  /** F6 page-turn (T3-W10): `leaving` routes the switch-away through the board's erase beat
   *  (the grid's own animateErase) while the scene chrome fades (scene.css `.scene-leaving`);
   *  `erased` reports the seam back to App, which flips the v-if. */
  leaving?: boolean;
}>();
const emit = defineEmits<{ (e: "erased"): void }>();

// SLOT READ — `model`. The one instantiation, at mount: five hand-written call sites become
// one, and a game's composable (with its Worker) still starts only when its scene mounts.
const model = props.spec.model();

// SLOT READ — `deal.options`. Built over the LIVE model, exactly as the four lazy scenes
// already did; the eager game's hand-inlined copy dies with the cycle that forced it.
const sections = computed<ControlSection[]>(() => props.spec.deal.options(model));

// SLOT READ — `clues.from`. The live clue the board prints, read off the model this shell just
// instantiated and handed straight back to the seam that declared it. `null` is a game's STATED
// absence and binds nothing — which is why sudoku shipped green over a seam that, until this
// binding landed, had never carried a value at all.
const clue = computed(() => props.spec.clues?.from(model));

// T4-WM §2 — the board ref lets the ControlPanel's Hint button reach the board's focused
// cell (the panel is the board's sibling, so it can't read focusedPos directly). undo/redo
// need no ref — they route straight to the composable.
const boardHost = ref<InstanceType<typeof BoardHost> | null>(null);

// Cold-start prewarm (T3-W8 §cold-start). The eager game mounts at app mount, so the first
// idle tick warms the solver Worker + wasm ahead of the user's first solve/generate.
// `requestIdleCallback` keeps it off the critical mount path; `setTimeout` is the fallback
// where it's unavailable.
//
// NOT a slot read any more (T5-W2 2.2/F3): there is ONE Worker over the one wasm binary, so
// there is one warm. It is imported here rather than asked of `spec.solver`, because a per-game
// handle onto a single act is exactly the parallel-table fiction this wave killed — and because
// with one worker every mount after the first is already a no-op, which five handles could only
// have obscured.
onMounted(() => {
  if ("requestIdleCallback" in window) requestIdleCallback(prewarm);
  else setTimeout(prewarm, 1);
});

// T4-W8 ROW 3 — the persistent-candidates pin adds a THIRD source that wants the engine marks
// up (beside the answer-key peek and the long-press glimpse). `longPressPeek` mirrors the
// glimpse so every marks decision is a union: a peek RELEASE never extinguishes a standing
// pin, and toggling the pin off never strips marks out from under a live peek.
// `setMarksActive` is idempotent, so re-asserting the union is free.
const longPressPeek = ref(false);

const { peekActive, peekTouched, peekSolutionValues, startPeek, endPeek } =
  useAnswerKeyPeek({
    solveState: model.solveState,
    peekSolution: model.peekSolution,
    // The peek reports its own edge (`active`); the union keeps marks up while the pin or a
    // held long-press still wants them, so a peek off never kills the persistent candidates.
    setMarksActive: (active) =>
      model.setMarksActive(
        active || model.candidatesPinned.value || longPressPeek.value,
      ),
  });

// ROW 3 — persistent candidates: hold the engine marks on while pinned (default off);
// releasing the pin clears them unless a peek / long-press still wants them. No new compute —
// this only holds `marksActive` on, and the existing `[values, boardGeneration]` refresh watch
// keeps the pinned candidates live as the board is written on.
watch(
  () => model.candidatesPinned.value,
  (pinned) => model.setMarksActive(pinned || peekActive.value || longPressPeek.value),
);

// Share act (W6; T4-W3 share-truth): shareBoard() encodes the board into `?board=`, writes it
// to the address bar (URL wins over storage on reload — the shared link is live in the bar
// regardless), then returns the clipboard-copy promise. The control panel awaits it and
// confirms ONLY on resolve; a reject (insecure context, permission-policy denial, unfocused
// document, or an absent Clipboard API) surfaces "couldn't copy — link is in the address bar"
// instead of the old optimistic "copied!" over a possibly-empty clipboard.
function onShare(): Promise<void> {
  return model.shareBoard();
}

// T4-WM §3 (lane E) — a long-press on a board cell opens the candidate glimpse: the same
// engine-domains pencil marks the answer-key peek rides, but marks-ONLY (no laminate), so the
// solver's surviving candidates show in place while held. Guarded exactly like startPeek — the
// answer-key peek owns the one marks surface while it's up, and the solve worker owns the
// board mid-solve (the marks ride a worker propagate) — so in both cases the long-press marks
// stand down. The end never strips marks out from under a held answer-key peek.
function onCandidatePeekStart() {
  if (model.solveState.value === "solving") return; // the solve worker owns the board mid-solve
  longPressPeek.value = true;
  model.setMarksActive(true);
}
function onCandidatePeekEnd() {
  longPressPeek.value = false;
  // Keep marks up if the answer-key peek or the persistent pin still wants them.
  model.setMarksActive(peekActive.value || model.candidatesPinned.value);
}
</script>

<template>
  <GameScene :leaving="props.leaving">
    <template #board>
      <BoardHost
        ref="boardHost"
        :spec="spec"
        :model="model"
        :clue="clue"
        :leaving="props.leaving"
        @candidate-peek-start="onCandidatePeekStart"
        @candidate-peek-end="onCandidatePeekEnd"
        @erased="emit('erased')"
      />
      <AnswerKeyLaminate
        v-if="peekTouched"
        :active="peekActive"
        :solution="peekSolutionValues"
        :board-size="model.boardSize.value"
        :original-given-cells="model.originalGivenCells.value"
      />
    </template>

    <template #controls="{ mobile }">
      <GameControlPanel
        :sections="sections"
        :loading="model.loading.value"
        :is-dirty="model.isDirty.value"
        :pencil-mode="model.pencilMode.value"
        :error-check-mode="model.errorCheckMode.value"
        :candidates-pinned="model.candidatesPinned.value"
        :mobile="mobile"
        :grade-tally="model.gradeTally.value"
        @update:pencil-mode="model.setPencilMode($event)"
        @update:error-check-mode="model.setErrorCheckMode($event)"
        @update:candidates-pinned="model.setCandidatesPinned($event)"
        @deal="model.deal()"
        @clear="model.clearBoard()"
        @solve="model.solve()"
        @fill-forced="model.fillForced()"
        @undo="model.undo()"
        @redo="model.redo()"
        @hint="boardHost?.hintFocusedCell()"
        :share="onShare"
        :share-session="model.shareSession"
        @peek-start="startPeek()"
        @peek-end="endPeek()"
      />
    </template>
  </GameScene>
</template>

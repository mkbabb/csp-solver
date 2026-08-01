<script setup lang="ts">
/**
 * Self-contained KenKen / Calcudoku scene — board + controls + answer-key laminate +
 * hold/keyboard peek wiring, over the game-agnostic `@games/shared/GameScene.vue` scaffold
 * (T4-W13). App.vue mounts this behind the registry-driven `card.scene()` loader, LAZY: the
 * whole scene (board + controls + useKenken + its Worker) rides a dynamic chunk that downloads
 * only on select. The structural twin of ThermoGame's wiring on the FutoshikiBoard grammar —
 * the divergences are the boxless Latin geometry (KenKenBoard) and the operator-cage furniture
 * threaded into its `#overlay` slot.
 *
 * KenKen ships no bespoke ControlPanel: the thin scene passes the shared `GameControlPanel` the
 * game declaration's own sections (`kenkenGame.options`, reactive under a computed).
 */
import { computed, ref, watch } from "vue";
import { useKenken } from "./composables/useKenken";
import { kenkenGame } from "./game";
import GameScene from "@games/shared/GameScene.vue";
import GameControlPanel, {
  type ControlSection,
} from "@games/shared/GameControlPanel.vue";
import KenKenBoard from "./KenKenBoard.vue";
import { useAnswerKeyPeek } from "@games/shared/useAnswerKeyPeek";
// Statically imported (not async): this whole scene is already a lazy chunk (the ThermoGame precedent).
import AnswerKeyLaminate from "@pencil/sheet/AnswerKeyLaminate.vue";

const props = defineProps<{ leaving?: boolean }>();
const emit = defineEmits<{ (e: "erased"): void }>();

const kenken = useKenken();

// T4-WM §2 — the board ref lets the ControlPanel's Hint button reach the board's focused cell.
const kenkenBoard = ref<InstanceType<typeof KenKenBoard> | null>(null);

// The control sections come from the game declaration itself (the R2 contract's `options`).
const sections = computed<ControlSection[]>(() => kenkenGame.options(kenken));

const longPressPeek = ref(false);

const { peekActive, peekTouched, peekSolutionValues, startPeek, endPeek } =
  useAnswerKeyPeek({
    solveState: kenken.solveState,
    peekSolution: kenken.peekSolution,
    setMarksActive: (active) =>
      kenken.setMarksActive(
        active || kenken.candidatesPinned.value || longPressPeek.value,
      ),
  });

watch(kenken.candidatesPinned, (pinned) =>
  kenken.setMarksActive(pinned || peekActive.value || longPressPeek.value),
);

// Share act (W6; T4-W3 share-truth) — KenKen's `?board=` is v1-deferred (writeShareUrl no-op).
function onShare(): Promise<void> {
  return kenken.shareBoard();
}

function onCandidatePeekStart() {
  if (kenken.solveState.value === "solving") return; // the solve worker owns the board mid-solve
  longPressPeek.value = true;
  kenken.setMarksActive(true);
}
function onCandidatePeekEnd() {
  longPressPeek.value = false;
  kenken.setMarksActive(peekActive.value || kenken.candidatesPinned.value);
}
</script>

<template>
  <GameScene :leaving="props.leaving">
    <template #board>
      <KenKenBoard
        ref="kenkenBoard"
        :leaving="props.leaving"
        :board-size="kenken.boardSize.value"
        :total-cells="kenken.totalCells.value"
        :values="kenken.values.value"
        :given-cells="kenken.givenCells.value"
        :overridden-cells="kenken.overriddenCells.value"
        :animating-cells="kenken.animatingCells.value"
        :solve-state="kenken.solveState.value"
        :solved-values="kenken.solvedValues.value"
        :board-generation="kenken.boardGeneration.value"
        :cages="kenken.cages.value"
        :link-error="kenken.linkError.value"
        :error-code="kenken.errorCode.value"
        :solve-stats="kenken.solveStats.value"
        :pencil-marks="kenken.pencilMarks.value"
        :corner-marks="kenken.cornerMarks.value"
        :center-marks="kenken.centerMarks.value"
        :pencil-mode="kenken.pencilMode.value"
        :hint="kenken.hintReasoning.value"
        :grade-signature="kenken.gradeSignature.value"
        :proactive-error-check="kenken.proactiveCheck.value"
        :loading="kenken.loading.value"
        @update-cell="(pos: number, val: number) => kenken.setCell(pos, val)"
        @mark="(pos: number, val: number) => kenken.toggleUserMark(pos, val)"
        @cycle-pencil-mode="kenken.cyclePencilMode()"
        @retry="kenken.solve()"
        @undo="kenken.undo()"
        @redo="kenken.redo()"
        @hint="(pos: number) => kenken.hintCell(pos)"
        @candidate-peek-start="onCandidatePeekStart"
        @candidate-peek-end="onCandidatePeekEnd"
        @erased="emit('erased')"
      />
      <AnswerKeyLaminate
        v-if="peekTouched"
        :active="peekActive"
        :solution="peekSolutionValues"
        :board-size="kenken.boardSize.value"
        :subgrid-size="kenken.boardSize.value"
        :original-given-cells="kenken.originalGivenCells.value"
      />
    </template>

    <template #controls="{ mobile }">
      <GameControlPanel
        :sections="sections"
        :pencil-mode="kenken.pencilMode.value"
        :candidates-pinned="kenken.candidatesPinned.value"
        :loading="kenken.loading.value"
        :is-dirty="kenken.isDirty.value"
        :mobile="mobile"
        :grade-tally="kenken.gradeTally.value"
        :error-check-mode="kenken.errorCheckMode.value"
        :proactive-check="kenken.proactiveCheck.value"
        :share="onShare"
        @update:pencil-mode="kenken.setPencilMode($event)"
        @update:candidates-pinned="kenken.setCandidatesPinned($event)"
        @deal="kenken.deal()"
        @clear="kenken.clearBoard()"
        @solve="kenken.solve()"
        @fill-forced="kenken.fillForced()"
        @undo="kenken.undo()"
        @redo="kenken.redo()"
        @hint="kenkenBoard?.hintFocusedCell()"
        @peek-start="startPeek()"
        @peek-end="endPeek()"
        @update:error-check-mode="kenken.setErrorCheckMode($event)"
      />
    </template>
  </GameScene>
</template>

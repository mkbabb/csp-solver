<script setup lang="ts">
/**
 * Self-contained Killer-Sudoku scene — board + controls + answer-key laminate + hold/keyboard
 * peek wiring, over the game-agnostic `@games/shared/GameScene.vue` scaffold (T4-W13). App.vue
 * mounts this behind the registry-driven `card.scene()` loader, LAZY: the whole scene (board +
 * controls + useKiller + its Worker) rides a dynamic chunk that downloads only on select. The
 * structural twin of ThermoGame's wiring — the ONE divergence is Killer's cage furniture,
 * threaded into the board's `#overlay` slot via KillerBoard.
 *
 * Killer ships no bespoke ControlPanel: the thin scene passes the shared `GameControlPanel` the
 * game declaration's own sections (`killerGame.options`, reactive under a computed).
 */
import { computed, ref, watch } from "vue";
import { useKiller } from "./composables/useKiller";
import { killerGame } from "./game";
import GameScene from "@games/shared/GameScene.vue";
import GameControlPanel, {
  type ControlSection,
} from "@games/shared/GameControlPanel.vue";
import KillerBoard from "./KillerBoard.vue";
import { useAnswerKeyPeek } from "@games/shared/useAnswerKeyPeek";
// Statically imported (not async): this whole scene is already a lazy chunk (the ThermoGame precedent).
import AnswerKeyLaminate from "@pencil/sheet/AnswerKeyLaminate.vue";

const props = defineProps<{ leaving?: boolean }>();
const emit = defineEmits<{ (e: "erased"): void }>();

const killer = useKiller();

// T4-WM §2 — the board ref lets the ControlPanel's Hint button reach the board's focused cell.
const killerBoard = ref<InstanceType<typeof KillerBoard> | null>(null);

// The control sections come from the game declaration itself (the R2 contract's `options`).
const sections = computed<ControlSection[]>(() => killerGame.options(killer));

const longPressPeek = ref(false);

const { peekActive, peekTouched, peekSolutionValues, startPeek, endPeek } =
  useAnswerKeyPeek({
    solveState: killer.solveState,
    peekSolution: killer.peekSolution,
    setMarksActive: (active) =>
      killer.setMarksActive(
        active || killer.candidatesPinned.value || longPressPeek.value,
      ),
  });

watch(killer.candidatesPinned, (pinned) =>
  killer.setMarksActive(pinned || peekActive.value || longPressPeek.value),
);

// Share act (W6; T4-W3 share-truth) — Killer's `?board=` is v1-deferred (writeShareUrl no-op).
function onShare(): Promise<void> {
  return killer.shareBoard();
}

function onCandidatePeekStart() {
  if (killer.solveState.value === "solving") return; // the solve worker owns the board mid-solve
  longPressPeek.value = true;
  killer.setMarksActive(true);
}
function onCandidatePeekEnd() {
  longPressPeek.value = false;
  killer.setMarksActive(peekActive.value || killer.candidatesPinned.value);
}
</script>

<template>
  <GameScene :leaving="props.leaving">
    <template #board>
      <KillerBoard
        ref="killerBoard"
        :leaving="props.leaving"
        :size="killer.size.value"
        :board-size="killer.boardSize.value"
        :total-cells="killer.totalCells.value"
        :values="killer.values.value"
        :given-cells="killer.givenCells.value"
        :overridden-cells="killer.overriddenCells.value"
        :animating-cells="killer.animatingCells.value"
        :solve-state="killer.solveState.value"
        :solved-values="killer.solvedValues.value"
        :board-generation="killer.boardGeneration.value"
        :cages="killer.cages.value"
        :difficulty="killer.difficulty.value"
        :link-error="killer.linkError.value"
        :error-code="killer.errorCode.value"
        :solve-stats="killer.solveStats.value"
        :pencil-marks="killer.pencilMarks.value"
        :corner-marks="killer.cornerMarks.value"
        :center-marks="killer.centerMarks.value"
        :pencil-mode="killer.pencilMode.value"
        :hint="killer.hintReasoning.value"
        :grade-signature="killer.gradeSignature.value"
        :grade-tally="killer.gradeTally.value"
        :proactive-error-check="killer.proactiveCheck.value"
        :loading="killer.loading.value"
        @update-cell="(pos: number, val: number) => killer.setCell(pos, val)"
        @mark="(pos: number, val: number) => killer.toggleUserMark(pos, val)"
        @cycle-pencil-mode="killer.cyclePencilMode()"
        @retry="killer.solve()"
        @undo="killer.undo()"
        @redo="killer.redo()"
        @hint="(pos: number) => killer.hintCell(pos)"
        @candidate-peek-start="onCandidatePeekStart"
        @candidate-peek-end="onCandidatePeekEnd"
        @erased="emit('erased')"
      />
      <AnswerKeyLaminate
        v-if="peekTouched"
        :active="peekActive"
        :solution="peekSolutionValues"
        :board-size="killer.boardSize.value"
        :subgrid-size="killer.size.value"
        :original-given-cells="killer.originalGivenCells.value"
      />
    </template>

    <template #controls="{ mobile }">
      <GameControlPanel
        :sections="sections"
        :pencil-mode="killer.pencilMode.value"
        :candidates-pinned="killer.candidatesPinned.value"
        :loading="killer.loading.value"
        :is-dirty="killer.isDirty.value"
        :mobile="mobile"
        :error-check-mode="killer.errorCheckMode.value"
        :share="onShare"
        @update:pencil-mode="killer.setPencilMode($event)"
        @update:candidates-pinned="killer.setCandidatesPinned($event)"
        @deal="killer.deal()"
        @clear="killer.clearBoard()"
        @solve="killer.solve()"
        @fill-forced="killer.fillForced()"
        @undo="killer.undo()"
        @redo="killer.redo()"
        @hint="killerBoard?.hintFocusedCell()"
        @peek-start="startPeek()"
        @peek-end="endPeek()"
        @update:error-check-mode="killer.setErrorCheckMode($event)"
      />
    </template>
  </GameScene>
</template>

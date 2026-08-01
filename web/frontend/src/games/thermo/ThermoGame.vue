<script setup lang="ts">
/**
 * Self-contained Thermo-Sudoku scene — board + controls + answer-key laminate + hold/keyboard
 * peek wiring, over the game-agnostic `@games/shared/GameScene.vue` scaffold (T4-W13). App.vue
 * mounts this behind the registry-driven `card.scene()` loader, LAZY: the whole scene (board +
 * controls + useThermo + its Worker) rides a dynamic chunk that downloads only on select. The
 * structural twin of FutoshikiGame's wiring — the ONE divergence is Thermo's thermometer
 * furniture, threaded into the board's `#overlay` slot via ThermoBoard.
 *
 * Thermo ships no bespoke ControlPanel: the thin scene passes the shared `GameControlPanel` the
 * game declaration's own sections (`thermoGame.options`, reactive under a computed) — the
 * contract's `options` field consumed at the mount, exactly as the R2 shell intends.
 */
import { computed, ref, watch } from "vue";
import { useThermo } from "./composables/useThermo";
import { thermoGame } from "./game";
import GameScene from "@games/shared/GameScene.vue";
import GameControlPanel, {
  type ControlSection,
} from "@games/shared/GameControlPanel.vue";
import ThermoBoard from "./ThermoBoard.vue";
import { useAnswerKeyPeek } from "@games/shared/useAnswerKeyPeek";
// Statically imported (not async): this whole scene is already a lazy chunk, so the laminate
// rides that chunk, never the main bundle (the FutoshikiGame precedent).
import AnswerKeyLaminate from "@pencil/sheet/AnswerKeyLaminate.vue";

// F6 page-turn (T3-W10): `leaving` routes the switch-away through the board's erase beat while
// the scene chrome fades (scene.css `.scene-leaving`); `erased` reports the seam back to App.
const props = defineProps<{ leaving?: boolean }>();
const emit = defineEmits<{ (e: "erased"): void }>();

const thermo = useThermo();

// T4-WM §2 — the board ref lets the ControlPanel's Hint button reach the board's focused cell.
const thermoBoard = ref<InstanceType<typeof ThermoBoard> | null>(null);

// The control sections come from the game declaration itself (the R2 contract's `options`),
// wrapped in a computed so the selected size/difficulty stay reactive on the shared panel.
const sections = computed<ControlSection[]>(() => thermoGame.options(thermo));

// T4-W8 ROW 3 (twin of the sudoku/futoshiki scenes') — the persistent-candidates pin is a third
// source that wants the engine marks up. Every marks decision is a union so a peek release never
// extinguishes a standing pin, and toggling the pin off never strips marks from under a live peek.
const longPressPeek = ref(false);

const { peekActive, peekTouched, peekSolutionValues, startPeek, endPeek } =
  useAnswerKeyPeek({
    solveState: thermo.solveState,
    peekSolution: thermo.peekSolution,
    setMarksActive: (active) =>
      thermo.setMarksActive(
        active || thermo.candidatesPinned.value || longPressPeek.value,
      ),
  });

watch(thermo.candidatesPinned, (pinned) =>
  thermo.setMarksActive(pinned || peekActive.value || longPressPeek.value),
);

// Share act (W6; T4-W3 share-truth) — Thermo's `?board=` is v1-deferred (writeShareUrl no-op),
// so this reproduces the board via localStorage; the copy still returns its real outcome.
function onShare(): Promise<void> {
  return thermo.shareBoard();
}

// T4-WM §3 — the long-press candidate glimpse (marks-only), guarded exactly like startPeek.
function onCandidatePeekStart() {
  if (thermo.solveState.value === "solving") return; // the solve worker owns the board mid-solve
  longPressPeek.value = true;
  thermo.setMarksActive(true);
}
function onCandidatePeekEnd() {
  longPressPeek.value = false;
  thermo.setMarksActive(peekActive.value || thermo.candidatesPinned.value);
}
</script>

<template>
  <GameScene :leaving="props.leaving">
    <template #board>
      <ThermoBoard
        ref="thermoBoard"
        :leaving="props.leaving"
        :size="thermo.size.value"
        :board-size="thermo.boardSize.value"
        :total-cells="thermo.totalCells.value"
        :values="thermo.values.value"
        :given-cells="thermo.givenCells.value"
        :overridden-cells="thermo.overriddenCells.value"
        :animating-cells="thermo.animatingCells.value"
        :solve-state="thermo.solveState.value"
        :solved-values="thermo.solvedValues.value"
        :board-generation="thermo.boardGeneration.value"
        :thermometers="thermo.thermometers.value"
        :difficulty="thermo.difficulty.value"
        :link-error="thermo.linkError.value"
        :error-code="thermo.errorCode.value"
        :solve-stats="thermo.solveStats.value"
        :pencil-marks="thermo.pencilMarks.value"
        :corner-marks="thermo.cornerMarks.value"
        :center-marks="thermo.centerMarks.value"
        :pencil-mode="thermo.pencilMode.value"
        :hint="thermo.hintReasoning.value"
        :grade-signature="thermo.gradeSignature.value"
        :proactive-error-check="thermo.proactiveCheck.value"
        :loading="thermo.loading.value"
        @update-cell="(pos: number, val: number) => thermo.setCell(pos, val)"
        @mark="(pos: number, val: number) => thermo.toggleUserMark(pos, val)"
        @cycle-pencil-mode="thermo.cyclePencilMode()"
        @retry="thermo.solve()"
        @undo="thermo.undo()"
        @redo="thermo.redo()"
        @hint="(pos: number) => thermo.hintCell(pos)"
        @candidate-peek-start="onCandidatePeekStart"
        @candidate-peek-end="onCandidatePeekEnd"
        @erased="emit('erased')"
      />
      <AnswerKeyLaminate
        v-if="peekTouched"
        :active="peekActive"
        :solution="peekSolutionValues"
        :board-size="thermo.boardSize.value"
        :subgrid-size="thermo.size.value"
        :original-given-cells="thermo.originalGivenCells.value"
      />
    </template>

    <template #controls="{ mobile }">
      <GameControlPanel
        :sections="sections"
        :pencil-mode="thermo.pencilMode.value"
        :candidates-pinned="thermo.candidatesPinned.value"
        :loading="thermo.loading.value"
        :is-dirty="thermo.isDirty.value"
        :mobile="mobile"
        :grade-tally="thermo.gradeTally.value"
        :error-check-mode="thermo.errorCheckMode.value"
        :proactive-check="thermo.proactiveCheck.value"
        :share="onShare"
        @update:pencil-mode="thermo.setPencilMode($event)"
        @update:candidates-pinned="thermo.setCandidatesPinned($event)"
        @deal="thermo.deal()"
        @clear="thermo.clearBoard()"
        @solve="thermo.solve()"
        @fill-forced="thermo.fillForced()"
        @undo="thermo.undo()"
        @redo="thermo.redo()"
        @hint="thermoBoard?.hintFocusedCell()"
        @peek-start="startPeek()"
        @peek-end="endPeek()"
        @update:error-check-mode="thermo.setErrorCheckMode($event)"
      />
    </template>
  </GameScene>
</template>

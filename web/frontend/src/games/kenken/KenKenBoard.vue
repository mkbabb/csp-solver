<script setup lang="ts">
/**
 * KenKenBoard — a thin adapter over the game-agnostic `@games/shared/GameBoard.vue` shell
 * (T4-W13, the FutoshikiBoard grammar). KenKen IS a plain Latin family (like Futoshiki), so
 * this reuses `FutoshikiCell` (no subgrid ticks), passes `subgridSize = boardSize` (the
 * BOXLESS grid — no interior box lines, the new KenKen geometry), and grades row/col only.
 * The ONE divergence from Futoshiki's twin is the operator-cage furniture (`KenKenCage`:
 * dotted boundaries + `"12×"`-style corner targets) inked into the `#overlay` slot in place
 * of the caret layer. The cage relations are enforced authoritatively by the wasm solve; the
 * board's red-pencil assist is the Latin (row/col) derivation only. Everything else lives in
 * the shell.
 */
import { computed, provide, ref } from "vue";
import GameBoard from "@games/shared/GameBoard.vue";
import FutoshikiCell from "@games/futoshiki/FutoshikiBoard/FutoshikiCell/FutoshikiCell.vue";
import KenKenCage from "./KenKenCage/KenKenCage.vue";
import { findConflicts, type Conflicts } from "@games/shared/conflicts";
import type { HintResult } from "@games/shared/techniqueEngine";
import type { PencilMode } from "@games/shared/useUserMarks";
import type { SolveState, SolveStats } from "@games/shared/types";
import type { KenKenCage as KenKenCageClue } from "./types";

const props = defineProps<{
  boardSize: number;
  totalCells: number;
  values: Record<string, number>;
  givenCells: Set<string>;
  overriddenCells: Set<string>;
  animatingCells: Set<string>;
  solveState: SolveState;
  solvedValues: Record<string, number>;
  boardGeneration: number;
  /** Printed operator-cage furniture — drives the boxless cage overlay. */
  cages: KenKenCageClue[];
  /** Optional typed error code (SolverErrorCode) for the paper-note copy. */
  errorCode?: string;
  /** Stats from the last completed solve — the margin tally. Null whenever idle. */
  solveStats?: SolveStats | null;
  /** Engine-domains pencil marks (peek glimpse): per-position surviving candidates. */
  pencilMarks?: Record<string, number[]>;
  /** T4-W8 ROW 1 — the player's own corner/center pencil marks, forwarded per-cell. */
  cornerMarks?: Record<string, number[]>;
  centerMarks?: Record<string, number[]>;
  /** T4-W8 ROW 1 — the active pencil mode (off/corner/center), forwarded to each cell. */
  pencilMode?: PencilMode;
  /** F6 page-turn (T3-W10): true while this scene is switch-away's outgoing exercise. */
  leaving?: boolean;
  /** T4-W3 share-truth: a `?board=` failed to decode — a one-line clause folds into the announce. */
  linkError?: boolean;
  /** T4-W7 — the armed hint's reasoning: highlights `becauseCells` + names the technique. */
  hint?: HintResult | null;
  /** T4-W7 — the measured difficulty signature (the first difficulty word this margin carries). */
  gradeSignature?: string;
  /** T4-W8 ROW 2 — the error-check mode's PROACTIVE display gate. */
  proactiveErrorCheck?: boolean;
  /** T4-WU race gate — true while a board op (generate/solve) is in flight. */
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "updateCell", position: number, value: number): void;
  (e: "retry"): void;
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "hint", position: number): void;
  (e: "erased"): void;
  (e: "mark", position: number, value: number): void;
  (e: "cyclePencilMode"): void;
  (e: "candidatePeekStart"): void;
  (e: "candidatePeekEnd"): void;
}>();

// T4-W10 idiom (§flourish) — provided HERE (not the shell): the slotted cells resolve
// `inject('flourish')` against this scene, not the shell that renders the slot outlet.
const celebrating = computed(
  () => props.solveState === "solved" && props.animatingCells.size > 0,
);
provide("flourish", celebrating);

// ── The grid a11y label — KenKen carries no difficulty word (the Latin family, like Futoshiki) ──
const gridLabel = computed(
  () => `${props.boardSize} by ${props.boardSize} kenken board`,
);

// ── Conflict + peer adjacency — plain Latin square (row/col). The cage arithmetic relations
// are enforced authoritatively by the wasm solve; the board's red-pencil assist is the Latin
// derivation only (the grader is `gradeFutoshiki` with an empty inequality set — cage-blind). ──
const conflictsFn = (values: Record<string, number>, boardSize: number): Conflicts =>
  findConflicts(values, boardSize);
function peersFn(pos: number, n: number): Set<string> {
  const set = new Set<string>();
  const row = Math.floor(pos / n);
  const col = pos % n;
  for (let i = 0; i < n; i++) {
    set.add(String(row * n + i)); // row peers
    set.add(String(i * n + col)); // column peers
  }
  // KenKen is a plain Latin square — NO box band (the boxless geometry).
  set.delete(String(pos)); // the focused cell keeps its own ghost; peers are its neighbours
  return set;
}

// ── The fresh-board announce — measured signature only (no request voice) + the one-shot
// corrupt-link clause (the Futoshiki-grammar marginalia). ──
let linkErrorPending = props.linkError === true;
function freshBoardCopy(): string {
  const fresh = `a fresh ${props.boardSize}×${props.boardSize}`;
  const measured = props.gradeSignature ? ` — ${props.gradeSignature}` : "";
  if (linkErrorPending) {
    linkErrorPending = false;
    return `this shared link couldn't be read — ${fresh}${measured}`;
  }
  return `${fresh}${measured}`;
}

// Re-expose the board's hint act (T4-WM §2) so KenKenGame's Hint button reaches it.
const boardRef = ref<InstanceType<typeof GameBoard> | null>(null);
defineExpose({ hintFocusedCell: () => boardRef.value?.hintFocusedCell() });
</script>

<template>
  <GameBoard
    ref="boardRef"
    :board-size="boardSize"
    :total-cells="totalCells"
    :values="values"
    :given-cells="givenCells"
    :animating-cells="animatingCells"
    :solve-state="solveState"
    :board-generation="boardGeneration"
    :subgrid-size="boardSize"
    :grid-label="gridLabel"
    :conflicts-fn="conflictsFn"
    :peers-fn="peersFn"
    :fresh-board-copy="freshBoardCopy"
    :pencil-marks="pencilMarks"
    :corner-marks="cornerMarks"
    :center-marks="centerMarks"
    :solve-stats="solveStats"
    :error-code="errorCode"
    :leaving="leaving"
    :hint="hint"
    :proactive-error-check="proactiveErrorCheck"
    :loading="loading"
    @update-cell="(pos: number, val: number) => emit('updateCell', pos, val)"
    @mark="(pos: number, val: number) => emit('mark', pos, val)"
    @cycle-pencil-mode="emit('cyclePencilMode')"
    @retry="emit('retry')"
    @undo="emit('undo')"
    @redo="emit('redo')"
    @hint="(pos: number) => emit('hint', pos)"
    @candidate-peek-start="emit('candidatePeekStart')"
    @candidate-peek-end="emit('candidatePeekEnd')"
    @erased="emit('erased')"
  >
    <template #cells="s">
      <FutoshikiCell
        v-for="pos in totalCells"
        :key="pos - 1"
        :ref="s.setCellApi"
        :position="pos - 1"
        :value="values[String(pos - 1)] ?? 0"
        :is-given="givenCells.has(String(pos - 1))"
        :is-overridden="overriddenCells.has(String(pos - 1))"
        :is-solved="String(pos - 1) in solvedValues"
        :is-revealed="s.isRevealed(pos - 1)"
        :is-invalid="s.conflicts.positions.has(String(pos - 1))"
        :is-because="s.hintBecause.has(String(pos - 1))"
        :is-peer="s.peerCells.has(String(pos - 1))"
        :noise-delay="s.noiseDelays.get(String(pos - 1)) ?? 0"
        :board-size="boardSize"
        :row-index="Math.floor((pos - 1) / boardSize) + 1"
        :col-index="((pos - 1) % boardSize) + 1"
        :tab-index="pos - 1 === s.focusedPos ? 0 : -1"
        :ghost-path="s.cellRects[pos - 1] ?? ''"
        :constraint-label="''"
        :marks="pencilMarks?.[String(pos - 1)]"
        :corner-marks="cornerMarks?.[String(pos - 1)]"
        :center-marks="centerMarks?.[String(pos - 1)]"
        :pencil-mode="pencilMode"
        @update="s.onCellUpdate"
        @mark="s.onMark"
        @cell-focus="s.onCellFocus"
        @candidate-peek-start="s.onPeekStart"
        @candidate-peek-end="s.onPeekEnd"
      />
    </template>

    <template #overlay>
      <!-- Operator-cage furniture — dotted boundaries + corner targets over the boxless Latin
           grid, a sibling over the cells. The whole layer is aria-hidden decorative (the cage
           rule is the puzzle's, read by the board's own labelling). -->
      <div class="kenken-clue-layer" aria-hidden="true">
        <KenKenCage :cages="cages" :board-size="boardSize" />
      </div>
    </template>
  </GameBoard>
</template>

<style scoped>
/* Operator-cage furniture layer — passes pointer events through; sits below the interactive
   cells (the cage overlay's own z-index:1 vs the cells' z-index:2). Scoped HERE (not the
   shell): the layer element is rendered in this scene's #overlay slot, so its data-v hash is
   this component's — the twin of FutoshikiBoard's caret-layer. */
.kenken-clue-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* F6 beat 1 (T3-W10) — the cage furniture leaves with the grid: opacity-only, 200ms,
   easeInCubic (the erase family). `.board-leaving` is the shell's board-shell (an ancestor
   carrying this component's scope through the child-root); `.kenken-clue-layer` is this
   scope's own element. */
@media (prefers-reduced-motion: no-preference) {
  .board-leaving .kenken-clue-layer {
    opacity: 0;
    transition: opacity 200ms var(--ease-fadeOut);
  }
}
</style>

<script setup lang="ts">
/**
 * FutoshikiBoard — a thin adapter over the game-agnostic `@games/shared/GameBoard.vue`
 * shell (T4-W11 R4). It owns only what diverges from Sudoku's twin: the `FutoshikiCell`,
 * the CARET furniture layer (the inequality glyphs + their a11y folding), the Latin-square
 * (row/col) + inequality-violation conflict/peer adjacency, and the (request-voice-free)
 * fresh-board margin. Everything shared lives in the shell; the prop/emit interface is
 * unchanged, so FutoshikiGame's mount is byte-untouched.
 */
import { computed, provide, ref } from "vue";
import GameBoard from "@games/shared/GameBoard.vue";
import FutoshikiCell from "./FutoshikiCell/FutoshikiCell.vue";
import FutoshikiCaret from "./FutoshikiCaret/FutoshikiCaret.vue";
import { findConflicts, type Conflicts } from "@games/shared/conflicts";
import type { TallyDescriptor } from "@games/shared/techniqueVoice";
import type { HintResult } from "@games/shared/techniqueEngine";
import type { PencilMode } from "@games/shared/useUserMarks";
import type { Inequality, SolveState, SolveStats } from "@games/futoshiki/types";

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
  /** Printed [greater, lesser] inequality furniture — drives the caret layer + a11y folding. */
  inequalities: Inequality[];
  /** Optional typed error code for the paper-note copy. */
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
  /** T4-W3 share-truth: a `?board=` was PRESENT but failed to decode — a one-line clause
   *  folds into the first fresh-board announce. */
  linkError?: boolean;
  /** T4-W7 — the armed hint's reasoning: highlights `becauseCells` + names the technique. */
  hint?: HintResult | null;
  /** T4-W7 — the measured difficulty signature (the first difficulty word this margin carries;
   *  Futoshiki has no request voice). */
  gradeSignature?: string;
  /** T4-W9-B1 — the displayed-quality tally descriptor; forwarded to the DifficultyTally. */
  gradeTally?: TallyDescriptor;
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

// T4-W10 idiom (§flourish) — provided HERE (not the shell): the slotted cells + caret resolve
// `inject('flourish')` against this scene. NOTE (c2-idiom.md §3): FutoshikiCaret's glyph DOES
// receive this, but its `:is-solved="false"` keeps flourish behind the glyph's isSolved gate.
const celebrating = computed(
  () => props.solveState === "solved" && props.animatingCells.size > 0,
);
provide("flourish", celebrating);

// ── The grid a11y label — Futoshiki carries no difficulty word ────────────────────
const gridLabel = computed(
  () => `${props.boardSize} by ${props.boardSize} futoshiki board`,
);

// ── Conflict + peer adjacency — Latin square (row/col) + inequality violations (§1.4) ──
const conflictsFn = (values: Record<string, number>, boardSize: number): Conflicts =>
  findConflicts(values, boardSize, {
    extra: (v, add) => {
      // Inequality violations: both endpoints filled but the printed `>` doesn't hold.
      for (const [gt, lt] of props.inequalities) {
        const a = v[String(gt)] ?? 0;
        const b = v[String(lt)] ?? 0;
        if (a !== 0 && b !== 0 && a <= b) {
          add(gt);
          add(lt);
        }
      }
    },
  });
function peersFn(pos: number, n: number): Set<string> {
  const set = new Set<string>();
  const row = Math.floor(pos / n);
  const col = pos % n;
  for (let i = 0; i < n; i++) {
    set.add(String(row * n + i)); // row peers
    set.add(String(i * n + col)); // column peers
  }
  // Futoshiki is a plain Latin square — NO box band (its structural divergence from sudoku).
  set.delete(String(pos)); // the focused cell keeps its own ghost; peers are its neighbours
  return set;
}

// ── The fresh-board announce — measured signature only (no request voice) + the one-shot
// corrupt-link clause. ──
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

// ── Caret layer — the inequality furniture (design-union §2.4 row 4) ─────────────
// A caret sits on the shared edge between an adjacent pair; its open mouth faces the
// larger value. Horizontal → `>`/`<`; vertical → the `>` glyph rotated ±90° (∨/∧).
interface CaretDescriptor {
  key: string;
  glyph: ">" | "<";
  rotation: number;
  leftPct: number;
  topPct: number;
  sizePct: number;
  hash: number;
}
const caretDescriptors = computed<CaretDescriptor[]>(() => {
  const n = props.boardSize;
  const cellPct = 100 / n;
  const out: CaretDescriptor[] = [];
  for (const [gt, lt] of props.inequalities) {
    const rg = Math.floor(gt / n);
    const cg = gt % n;
    const rl = Math.floor(lt / n);
    const cl = lt % n;
    let glyph: ">" | "<" = ">";
    let rotation = 0;
    let leftPct: number;
    let topPct: number;
    if (rg === rl) {
      // Horizontal pair — the shared edge is the column boundary between them.
      leftPct = (Math.min(cg, cl) + 1) * cellPct;
      topPct = (rg + 0.5) * cellPct;
      glyph = cg < cl ? ">" : "<"; // greater on the left → `>`
    } else {
      // Vertical pair — shared edge is the row boundary; rotate the `>` glyph.
      topPct = (Math.min(rg, rl) + 1) * cellPct;
      leftPct = (cg + 0.5) * cellPct;
      rotation = rg < rl ? 90 : -90; // greater on top → ∨ (+90); greater on bottom → ∧ (−90)
    }
    out.push({
      key: `${gt}-${lt}`,
      glyph,
      rotation,
      leftPct,
      topPct,
      sizePct: cellPct * 0.5,
      hash: gt * 131 + lt * 7 + 1,
    });
  }
  return out;
});

// ── Per-cell inequality clauses folded into aria-labels (F6) ─────────────────────
const constraintLabels = computed<Map<number, string>>(() => {
  const n = props.boardSize;
  const dir = (from: number, to: number): string => {
    const d = to - from;
    if (d === 1) return "to the right";
    if (d === -1) return "to the left";
    if (d === n) return "below";
    if (d === -n) return "above";
    return "";
  };
  const clauses = new Map<number, string[]>();
  const add = (pos: number, clause: string) => {
    const arr = clauses.get(pos);
    if (arr) arr.push(clause);
    else clauses.set(pos, [clause]);
  };
  for (const [gt, lt] of props.inequalities) {
    add(gt, `greater than the cell ${dir(gt, lt)}`);
    add(lt, `less than the cell ${dir(lt, gt)}`);
  }
  const out = new Map<number, string>();
  for (const [pos, arr] of clauses) out.set(pos, arr.join(" and "));
  return out;
});

// Re-expose the board's hint act (T4-WM §2) so FutoshikiGame's Hint button reaches it.
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
    :grade-tally="gradeTally"
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
        :constraint-label="constraintLabels.get(pos - 1) ?? ''"
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
      <!-- Caret layer — the inequality furniture, a sibling over the cells. Individual carets
           are aria-hidden; the constraint is folded into both adjacent cells' aria-labels. -->
      <div class="caret-layer" aria-hidden="true">
        <FutoshikiCaret
          v-for="c in caretDescriptors"
          :key="c.key"
          :glyph="c.glyph"
          :rotation="c.rotation"
          :board-size="boardSize"
          :hash="c.hash"
          :style="{
            left: c.leftPct + '%',
            top: c.topPct + '%',
            width: c.sizePct + '%',
            height: c.sizePct + '%',
          }"
        />
      </div>
    </template>
  </GameBoard>
</template>

<style scoped>
/* Caret furniture layer — passes pointer events through except on the carets themselves
   (which enable their own hover boil). Sits in the cell layer so the peek laminate (z-3)
   lays down over it. Scoped HERE (not the shell): the caret-layer element is rendered in
   this scene's #overlay slot, so its data-v hash is this component's. */
.caret-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

/* F6 beat 1 (T3-W10) — the caret furniture leaves with the grid: opacity-only, 200ms,
   easeInCubic (the erase family). `.board-leaving` is the shell's board-shell (an ancestor
   by class); `.caret-layer` carries this scope's data-v. */
@media (prefers-reduced-motion: no-preference) {
  .board-leaving .caret-layer {
    opacity: 0;
    transition: opacity 200ms var(--ease-fadeOut);
  }
}
</style>

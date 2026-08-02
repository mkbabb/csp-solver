<script setup lang="ts">
/**
 * BoardHost — THE board. One module, five games (T5-W2 2.1).
 *
 * The five `*Board.vue` adapters were 2.0% apart: each declared the same twenty-one props,
 * relayed the same ten emits, and differed only in the four functions `GameBoard` asks a game
 * for — the grid's a11y label, the conflict/peer adjacency, the fresh-board margin, and the
 * idle grade whisper — plus which cell it slotted and which clue layer it laid over them.
 *
 * All six are now READS off the spec:
 *   · `grammar.noun` names the grid · `grammar.geometry` picks the peer band and the sub-grid
 *     tick count · `grammar.requestVoice` gates the "— medium" difficulty clause (and the
 *     difficulty word in the grid label, which co-varies with it across all five games) ·
 *     `grammar.gradeHint` gates the UI-13 whisper · `furniture.cell` is what fills `#cells` ·
 *     `clues` is what fills `#overlay`, and `null` is a game's STATED absence.
 *
 * The prop-drill dies with the adapters: this host takes the MODEL, so the twenty-one
 * board props and the ten emit relays are bound once, here, instead of five times over.
 *
 * `GameBoard` itself — the grid scaffold, reveal wave, roving-tabindex ARIA, marginalia
 * machine, completion vignette, paper-note host, drawer voice, draw/erase state machine — is
 * untouched. This is its one caller.
 */
import { computed, provide, ref } from "vue";
import GameBoard from "@games/shared/GameBoard.vue";
import { findConflicts, type Conflicts } from "@games/shared/conflicts";
import type { AnyGameSpec, GameModel } from "@games/shared/defineGame";

const props = defineProps<{
  spec: AnyGameSpec;
  model: GameModel;
  /** F6 page-turn (T3-W10): true while this scene is switch-away's outgoing exercise. */
  leaving?: boolean;
  /** The live clue value the board prints — required exactly when `spec.clues` is non-null,
   *  and handed straight back to the seam that declared it. Sudoku's clue seam is `null`, so
   *  the proof game passes nothing. */
  clue?: unknown;
}>();

const emit = defineEmits<{
  (e: "erased"): void;
  (e: "candidatePeekStart"): void;
  (e: "candidatePeekEnd"): void;
}>();

const model = computed(() => props.model);
const grammar = computed(() => props.spec.grammar);
const boardSize = computed(() => props.model.boardSize.value);

// T4-W10 idiom (§flourish) — provide the celebrating derivation to the glyph by INJECT rather
// than a board→cell→glyph prop-drill. Provided HERE (not `GameBoard`): the slotted cells
// resolve `inject('flourish')` against this host, not the shell that renders the slot outlet.
const celebrating = computed(
  () =>
    props.model.solveState.value === "solved" &&
    props.model.animatingCells.value.size > 0,
);
provide("flourish", celebrating);

/**
 * The sub-grid root. A BOXED board's side is its root squared (`boardSizeOf: n => n**2`), so
 * the root is the exact square root — no second size ref to carry. A LATIN board has no box
 * band; passing its own side is what makes `GameBoard` draw one box, i.e. none.
 */
const subgridSize = computed(() =>
  grammar.value.geometry === "boxed"
    ? Math.round(Math.sqrt(boardSize.value))
    : boardSize.value,
);

// ── The grid a11y label ───────────────────────────────────────────────────────────
// The difficulty word rides `requestVoice`: the three boxed games print it and the two Latin
// games don't, and that is the same axis as the margin's request clause — re-derived across
// all five boards at F1, not assumed.
const difficultyWord = computed(() =>
  grammar.value.requestVoice ? props.model.difficulty.value.toLowerCase() : "",
);
const gridLabel = computed(
  () =>
    `${boardSize.value} by ${boardSize.value} ${grammar.value.noun}${
      difficultyWord.value ? ", " + difficultyWord.value : ""
    }`,
);

// ── Conflict + peer adjacency (§1.4, T4-W8 ROW 4) ─────────────────────────────────
// Row/column always; the BOX band only on a boxed geometry — sudoku's structural divergence
// from a Latin square, as one branch instead of five files.
const conflictsFn = (values: Record<string, number>, n: number): Conflicts =>
  grammar.value.geometry === "boxed"
    ? findConflicts(values, n, { subgridSize: subgridSize.value })
    : findConflicts(values, n);

function peersFn(pos: number, n: number): Set<string> {
  const set = new Set<string>();
  const row = Math.floor(pos / n);
  const col = pos % n;
  for (let i = 0; i < n; i++) {
    set.add(String(row * n + i)); // row peers
    set.add(String(i * n + col)); // column peers
  }
  if (grammar.value.geometry === "boxed") {
    const sg = subgridSize.value;
    const br = Math.floor(row / sg) * sg;
    const bc = Math.floor(col / sg) * sg;
    for (let r = 0; r < sg; r++) {
      for (let c = 0; c < sg; c++) set.add(String((br + r) * n + (bc + c)));
    }
  }
  set.delete(String(pos)); // the focused cell keeps its own ghost; peers are its neighbours
  return set;
}

// ── The fresh-board announce — the measured signature, the B-0 request voice where the
// grammar has one, and the one-shot corrupt-link clause. ──
let linkErrorPending = props.model.linkError.value;
function freshBoardCopy(): string {
  const fresh = `a fresh ${boardSize.value}×${boardSize.value}`;
  const measured = props.model.gradeSignature.value
    ? ` — ${props.model.gradeSignature.value}`
    : difficultyWord.value
      ? ` — ${difficultyWord.value}`
      : "";
  if (linkErrorPending) {
    linkErrorPending = false;
    return `this shared link couldn't be read. ${fresh}${measured}`;
  }
  return `${fresh}${measured}`;
}

// ── UI-13 — the once-per-board grade-hint whisper, where the grammar asks for it. ──
const idleGradeHint = computed(() =>
  grammar.value.gradeHint
    ? (values: Record<string, number>, n: number): string | null =>
        conflictsFn(values, n).positions.size > 0
          ? "a number repeats — turn on checking to see where"
          : null
    : undefined,
);

/**
 * The board's cells, grouped into rows (T5-W3 3.1) — `cellRows[r][c]` is the flat cell index,
 * the same 0..N²-1 the model keys every map on. The board is square by construction
 * (`totalCells === boardSize²`, useGameState.ts:188), so one derivation feeds both loops.
 */
const cellRows = computed(() =>
  Array.from({ length: boardSize.value }, (_, r) =>
    Array.from({ length: boardSize.value }, (_, c) => r * boardSize.value + c),
  ),
);

// The clue layer's live props — the seam's own mapping, applied to the live clue.
const clueProps = computed(() =>
  props.spec.clues ? props.spec.clues.props(props.clue, boardSize.value) : null,
);

// Re-expose the board's hint act (T4-WM §2) so the control panel's Hint button reaches it.
const boardRef = ref<InstanceType<typeof GameBoard> | null>(null);
defineExpose({ hintFocusedCell: () => boardRef.value?.hintFocusedCell() });
</script>

<template>
  <GameBoard
    ref="boardRef"
    :board-size="boardSize"
    :total-cells="model.totalCells.value"
    :values="model.values.value"
    :given-cells="model.givenCells.value"
    :animating-cells="model.animatingCells.value"
    :solve-state="model.solveState.value"
    :board-generation="model.boardGeneration.value"
    :subgrid-size="subgridSize"
    :grid-label="gridLabel"
    :conflicts-fn="conflictsFn"
    :peers-fn="peersFn"
    :fresh-board-copy="freshBoardCopy"
    :idle-grade-hint="idleGradeHint"
    :pencil-marks="model.pencilMarks.value"
    :solve-stats="model.solveStats.value"
    :error-code="model.errorCode.value"
    :leaving="leaving"
    :hint="model.hintReasoning.value"
    :proactive-error-check="model.proactiveCheck.value"
    :loading="model.loading.value"
    @update-cell="(pos: number, val: number) => model.setCell(pos, val)"
    @mark="(pos: number, val: number) => model.toggleUserMark(pos, val)"
    @cycle-pencil-mode="model.cyclePencilMode()"
    @retry="model.solve()"
    @undo="model.undo()"
    @redo="model.redo()"
    @hint="(pos: number) => model.hintCell(pos)"
    @candidate-peek-start="emit('candidatePeekStart')"
    @candidate-peek-end="emit('candidatePeekEnd')"
    @erased="emit('erased')"
  >
    <template #cells="s">
      <!-- The row layer (T5-W3 3.1). `role="grid"` owns ROWS, never bare cells: the AX tree
           read grid → gridcell×N² on all five boards, so the coordinates the cells carry in
           their names had no structure behind them and row-wise reading commands had nothing
           to walk. The wrapper is a BOX-LESS row: `display:contents` means the cells stay
           direct grid items of `.board-cells`, placed by the same `grid-template-*`, so the
           tree gains a level and the layout gains nothing. `aria-rowindex` rides the row AND
           its cells (`DigitCell`'s own `rowIndex`) — one truth, both places. -->
      <div
        v-for="(cells, r) in cellRows"
        :key="`row-${r}`"
        class="board-row"
        role="row"
        :aria-rowindex="r + 1"
      >
        <!-- T6 mark 13 — THE PLAYER'S COLOUR, IN ONE BINDING. `HandwrittenGlyph` already
             strokes with `var(--color-user-ink)`, so re-binding that var on a cell re-inks
             the digit drawn in it with no component change at all; `authorInk` holds an
             entry only for cells a PEER wrote, so your own board binds nothing and solo is
             byte-identical. `DigitCell` is single-root with no `inheritAttrs: false`, so
             the style falls through — five games, one line. -->
        <component
          :is="spec.furniture.cell"
          v-for="pos in cells"
          :key="pos"
          :ref="s.setCellApi"
          :position="pos"
          :value="model.values.value[String(pos)] ?? 0"
          :is-given="model.givenCells.value.has(String(pos))"
          :is-overridden="model.overriddenCells.value.has(String(pos))"
          :is-solved="String(pos) in model.solvedValues.value"
          :is-revealed="s.isRevealed(pos)"
          :is-invalid="s.conflicts.positions.has(String(pos))"
          :is-because="s.hintBecause.has(String(pos))"
          :is-peer="s.peerCells.has(String(pos))"
          :noise-delay="s.noiseDelays.get(String(pos)) ?? 0"
          :board-size="boardSize"
          :geometry="grammar.geometry"
          :row-index="r + 1"
          :col-index="(pos % boardSize) + 1"
          :tab-index="pos === s.focusedPos ? 0 : -1"
          :style="model.authorInk.value[String(pos)]"
          :ghost-path="s.cellRects[pos] ?? ''"
          :marks="s.marksFor(pos)"
          :corner-marks="model.cornerMarks.value[String(pos)]"
          :center-marks="model.centerMarks.value[String(pos)]"
          :pencil-mode="model.pencilMode.value"
          @update="s.onCellUpdate"
          @mark="s.onMark"
          @cell-focus="s.onCellFocus"
          @candidate-peek-start="s.onPeekStart"
          @candidate-peek-end="s.onPeekEnd"
        />
      </div>
    </template>

    <template v-if="spec.clues" #overlay>
      <!-- The clue layer — the game's own furniture, a sibling over the cells, propped by the
           seam that declared it. Individual glyphs are aria-hidden; the constraint folds into
           the adjacent cells' accessible names. -->
      <component :is="spec.clues.overlay" v-bind="clueProps ?? {}" />
    </template>
  </GameBoard>
</template>

<style scoped>
/* THE ROW LAYER MUST NOT BE A BOX. `.board-cells` is the CSS grid and the cells are its items,
   placed by `grid-template-columns/rows`; a rendered wrapper would become the single item and
   collapse all N² cells into one track. `display:contents` puts the wrapper in the DOM (and so
   in the accessibility tree) while leaving the box tree exactly as it was — the π condition
   this row ships under. */
.board-row {
  display: contents;
}
</style>

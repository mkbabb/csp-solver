<script setup lang="ts">
/**
 * Futoshiki board — a ~90% structural copy of SudokuBoard.vue (games never import each
 * other, so it's an owned port, not a shared component). Same CSS-grid-of-inputs over an
 * absolute-SVG structure; the divergences are:
 *   - It hands `generateCellRects(boardSize, boardSize, …)` — subgridSize === boardSize —
 *     for the ghost paths; a subgrid-free Latin grid (verified zero-cost reuse).
 *   - A CARET layer (sibling of the cells) draws the inequality furniture from
 *     `inequalities`; the carets fold into both adjacent cells' aria-labels (F6).
 *   - Conflict detection is Latin-square (row/col) + inequality violation, no boxes.
 *   - No `difficulty` (F3).
 */
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import FutoshikiCell from "./FutoshikiCell/FutoshikiCell.vue";
import FutoshikiCaret from "./FutoshikiCaret/FutoshikiCaret.vue";
import SolverErrorNote from "./SolverErrorNote.vue";
import HandDrawnGrid from "@pencil/grid/HandDrawnGrid/HandDrawnGrid.vue";
import CelebrationHeart from "@pencil/chrome/CelebrationHeart.vue";
import CompletionVignette from "@pencil/chrome/CompletionVignette.vue";
import MarginNote from "@pencil/chrome/MarginNote.vue";
import DifficultyTally from "@games/shared/DifficultyTally.vue";
import type { TallyDescriptor } from "@games/shared/techniqueVoice";
import { mulberry32 } from "@mkbabb/pencil-boil";
import { generateCellRects } from "@pencil/grid/gridPaths";
import { revealStaggerMs } from "@pencil/config/pencilConfig";
import {
  setMurmurSeed,
  notifyUserEdit,
  resetMurmur,
} from "@pencil/composables/celebration";
import { findConflicts } from "./conflicts";
import { classifyCode, PAPER_NOTE_COPY } from "@games/shared/solver/classifyError";
import { BOARD_CELLS_CLASS } from "@games/shared/constants";
import { formatSolveTally } from "@games/shared/solveTally";
import { formatHintNote } from "@games/shared/techniqueVoice";
import { toDisplayChar } from "@pencil/glyph/glyphRegistry";
import {
  consumeDrawerHint,
  useControlsDrawer,
  vignetteDocked,
} from "@games/shared/useControlsDrawer";
import type { HintResult } from "@games/shared/techniqueEngine";
import type { PencilMode } from "@games/shared/useUserMarks";
import type { Inequality, SolveState, SolveStats } from "@games/futoshiki/types";
import type { AnimationState } from "@pencil/types";

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
  /** Optional typed error code for the paper-note copy. Absent → default BUDGET_EXCEEDED copy. */
  errorCode?: string;
  /** Stats from the last completed solve — the margin tally (MarginNote meta, pencil
   *  hand, understated). Null whenever the grade is idle; the composable owns the
   *  lifecycle. */
  solveStats?: SolveStats | null;
  /** Engine-domains pencil marks (W6 beat 9): per-position surviving candidates
   *  from the solver's own propagation. Populated only while the peek gesture is
   *  held (opt-in — never ambient); only positions where propagation actually
   *  pruned something are present. Twin of SudokuBoard's (D16). */
  pencilMarks?: Record<string, number[]>;
  /** T4-W8 ROW 1 — the player's own pencil marks (corner + center slots; twin of SudokuBoard's),
   *  distinct in store and render from the engine peek marks above. Forwarded per-cell. */
  cornerMarks?: Record<string, number[]>;
  centerMarks?: Record<string, number[]>;
  /** T4-W8 ROW 1 — the active pencil mode (off/corner/center), forwarded to each cell so its
   *  frozen native input routes a digit to a mark instead of a value while a slot is armed. */
  pencilMode?: PencilMode;
  /** F6 page-turn (T3-W10): true while this scene is switch-away's outgoing exercise.
   *  Routes the grid through the EXISTING erase beat and fades glyphs + marginalia;
   *  on the erase's completion the board emits `erased` (the seam) instead of redrawing. */
  leaving?: boolean;
  /** T4-W3 share-truth (twin of SudokuBoard's): a `?board=` was PRESENT but failed to decode —
   *  the composable already fell back to a fresh deal. Folds a one-line "this shared link
   *  couldn't be read" clause into the FIRST fresh-board announce. One-shot. */
  linkError?: boolean;
  /** T4-W7 — the armed hint's reasoning (twin of SudokuBoard's): the board highlights
   *  `becauseCells` in the peek-laminate tone + writes the technique name in the margin. */
  hint?: HintResult | null;
  /** T4-W7 — the measured difficulty signature ("singles only" / "needs an inequality chain"),
   *  keyed to the deal-time grade. Futoshiki has no request voice, so this is the first
   *  difficulty word its fresh-board margin carries; empty for an ungraded (restored) board. */
  gradeSignature?: string;
  /** T4-W9-B1 (twin of SudokuBoard's) — the displayed-quality tally descriptor. Derived in the
   *  composable; the board forwards it to the shared DifficultyTally. */
  gradeTally?: TallyDescriptor;
  /** T4-W8 ROW 2 (twin of SudokuBoard's) — the error-check mode's PROACTIVE display gate (live,
   *  or an armed on-demand snapshot). ORed below with `solveState === 'failed'`: the teacher's
   *  red pencil grades actual work regardless; the mode governs only the live cadence. */
  proactiveErrorCheck?: boolean;
}>();

const emit = defineEmits<{
  (e: "updateCell", position: number, value: number): void;
  (e: "retry"): void;
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "hint", position: number): void;
  (e: "erased"): void;
  /** T4-W8 ROW 1 (twin of SudokuBoard's) — a cell authored a user mark (digit toggles, 0 erases);
   *  forwarded to the game's user-mark store. Distinct from `updateCell` (the value write). */
  (e: "mark", position: number, value: number): void;
  /** T4-W8 ROW 1 — the bare-'P' keyboard toggle cycles the pencil mode (off→corner→center). */
  (e: "cyclePencilMode"): void;
  /** Long-press peek (T4-WM §3) — twin of SudokuBoard's: forwarded from a cell's hold to the
   *  game's marks activation (candidate glimpse, marks-only). Release ends it. */
  (e: "candidatePeekStart"): void;
  (e: "candidatePeekEnd"): void;
}>();

const gridTemplateColumns = computed(
  () => `repeat(${props.boardSize}, minmax(0, 1fr))`,
);

// Pre-computed ghost rect paths in board viewBox coordinates (1000×1000). The ghost geometry
// is subgrid-independent, so passing boardSize as the subgrid arg only keys the cache; the
// frame/box-line pass generateGridPaths ran and threw away is gone (T3-W8, LRU-backed).
const VIEWBOX_SIZE = 1000;
const cellRects = computed(() =>
  generateCellRects(props.boardSize, props.boardSize, VIEWBOX_SIZE, 42),
);

// R3: the viewport-share/dvh caps ride the row regime, which now starts at lg: —
// iPad-portrait (768) stacks, so the stacked width formula governs there.
// T3-W12 §6: `shell-*` keys the drawer-closed grow (scoped CSS below) — twin of
// SudokuBoard's.
const boardSizeClasses = computed(() => {
  if (props.boardSize <= 4)
    return "shell-sm w-[min(26rem,calc(100vw-1.5rem))] lg:w-[min(26rem,85vw)] lg:max-w-[calc(100dvh-10rem)]";
  return "shell-md w-[min(42rem,calc(100vw-1.5rem))] lg:w-[min(42rem,85vw)] lg:max-w-[calc(100dvh-10rem)]";
});

// P4 (T3-W12 §2): scoped to the gold/red shadow it exists for — twin of SudokuBoard's.
const boardClasses = computed(() => {
  const base = "transition-[box-shadow] duration-500";
  if (props.solveState === "solved") return `${base} solve-success`;
  if (props.solveState === "failed") return `${base} solve-failure`;
  return base;
});

// ── Conflict detection — Latin-square (row/col) + inequality violations (§1.4) + error-check
// MODE (T4-W8 ROW 2, twin of SudokuBoard's) ──
// The SAME pure `findConflicts` derivation, un-gated from the 'failed'-only gate: `solveState ===
// 'failed'` (the grade) is ORed with the mode's proactive display (live continuous / on-demand
// armed snapshot / off nothing). Event-driven (a value mutation), never the boil beat, so live
// adds zero idle paints — the E7 idle-paint invariant holds by construction.
const conflictsVisible = computed(
  () => props.solveState === "failed" || props.proactiveErrorCheck === true,
);
const conflicts = computed(() =>
  conflictsVisible.value
    ? findConflicts(props.values, props.boardSize, props.inequalities)
    : { positions: new Set<string>(), firstRow: null },
);

// ── T4-W9 board FILL fraction (the progress trace's number) ──────────────
// Twin of SudokuBoard's — a pure derivation over `values`/`givenCells`, re-evaluated on a
// fill/clear (NEVER on the boil beat): filled non-given cells / fillable cells. FILL, not
// correctness. The render is HandDrawnGrid's; this is the only new code the twin needs.
const fillProgress = computed(() => {
  let filled = 0;
  for (const [pos, v] of Object.entries(props.values)) {
    if (v !== 0 && !props.givenCells.has(pos)) filled++;
  }
  const fillable = Math.max(1, props.totalCells - props.givenCells.size);
  return Math.max(0, Math.min(1, filled / fillable));
});

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

// Beat 1 — the reveal wave (board-normalized noise stagger).
const noiseDelays = computed(() => {
  const delays = new Map<string, number>();
  const cells = Array.from(props.animatingCells);
  if (cells.length === 0) return delays;

  const stagger = revealStaggerMs(cells.length);
  const rng = mulberry32(cells.length * 17 + 7);
  const shuffled = [...cells];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  for (let i = 0; i < shuffled.length; i++) {
    delays.set(shuffled[i], i * stagger);
  }
  return delays;
});

// Celebration presence (T3-W12 §1 P5): STATE-derived so the composition survives
// remounts while solved; only the murmur seed stays on the transition edge. Twin of
// SudokuBoard's — see its comment for the full rationale.
const celebrating = computed(
  () => props.solveState === "solved" && props.animatingCells.size > 0,
);
watch(
  () => props.solveState,
  (state, prev) => {
    if (state === "solved" && prev !== "solved" && props.animatingCells.size > 0) {
      setMurmurSeed(props.boardGeneration * 31 + 1);
    }
  },
);
watch(
  () => props.boardGeneration,
  () => {
    resetMurmur();
  },
);

function onCellUpdate(pos: number, value: number) {
  notifyUserEdit();
  emit("updateCell", pos, value);
}

// ── ARIA grid + roving tabindex (§4.1) ───────────────────────────────
const gridLabel = computed(
  () => `${props.boardSize} by ${props.boardSize} futoshiki board`,
);

const focusedPos = ref(0);
const cellApi = new Map<number, { focus: () => void }>();
function setCellApi(pos: number, el: unknown) {
  if (el && typeof (el as { focus?: unknown }).focus === "function") {
    cellApi.set(pos, el as { focus: () => void });
  } else {
    cellApi.delete(pos);
  }
}
function focusCell(pos: number) {
  const clamped = Math.max(0, Math.min(props.totalCells - 1, pos));
  focusedPos.value = clamped;
  nextTick(() => cellApi.get(clamped)?.focus());
}
function onCellFocus(pos: number) {
  focusedPos.value = pos;
}

// ── Peer-unit highlight on selection (T4-W8 ROW 4, twin of SudokuBoard's) ──
// A pure derivation over `focusedPos`: the cells sharing the focused cell's row or column take a
// faint pencil wash. Futoshiki is a plain Latin square, so there is NO box band (its structural
// divergence from sudoku). Gated on the board actually holding focus (`unitFocused`) so a fresh
// load washes nothing; the focused cell itself is excluded (it keeps its own ghost).
const unitFocused = ref(false);
function onGridFocusin() {
  unitFocused.value = true;
}
function onGridFocusout(e: FocusEvent) {
  const grid = e.currentTarget as HTMLElement;
  const next = e.relatedTarget as Node | null;
  if (!next || !grid.contains(next)) unitFocused.value = false;
}
const peerCells = computed(() => {
  const set = new Set<string>();
  if (!unitFocused.value) return set;
  const n = props.boardSize;
  const pos = focusedPos.value;
  const row = Math.floor(pos / n);
  const col = pos % n;
  for (let i = 0; i < n; i++) {
    set.add(String(row * n + i)); // row peers
    set.add(String(i * n + col)); // column peers
  }
  set.delete(String(pos)); // the focused cell keeps its own ghost; peers are its neighbours
  return set;
});

// T4-WM §2 — the hint act, factored so the ControlPanel's Hint button and the board's H key
// share ONE path (twin of Sudoku's, D16): both reveal the currently focused cell. On coarse
// the last tap sets focusedPos and it survives the button tap (only a board reset clears it),
// so tapping Hint reveals the cell you last touched. Exposed for the parent (sibling panel).
function hintFocusedCell() {
  emit("hint", focusedPos.value);
}
defineExpose({ hintFocusedCell });

function onBoardKeydown(e: KeyboardEvent) {
  const n = props.boardSize;
  const pos = focusedPos.value;
  const row = Math.floor(pos / n);
  const col = pos % n;
  let handled = true;
  switch (e.key) {
    case "ArrowUp":
      focusCell(row > 0 ? pos - n : pos);
      break;
    case "ArrowDown":
      focusCell(row < n - 1 ? pos + n : pos);
      break;
    case "ArrowLeft":
      focusCell(col > 0 ? pos - 1 : pos);
      break;
    case "ArrowRight":
      focusCell(col < n - 1 ? pos + 1 : pos);
      break;
    case "Home":
      focusCell(e.ctrlKey ? 0 : row * n);
      break;
    case "End":
      focusCell(e.ctrlKey ? n * n - 1 : row * n + (n - 1));
      break;
    // ── Bounded undo/redo (W6) — sibling case, disjoint e.key from the K-peek
    // ('k'/'Escape') and Backspace/Delete layers. Gate on ctrlKey OR metaKey (Cmd on
    // macOS); a plain 'z' falls through unhandled. Shift → redo. Twin of Sudoku's (D16).
    case "z":
    case "Z":
      if (e.ctrlKey || e.metaKey) {
        if (e.shiftKey) emit("redo");
        else emit("undo");
      } else handled = false;
      break;
    // ── Hint tier (W6) — 'H' fills the focused cell from the peek cache (solver-ink).
    // Bare key only; a modified H falls through. Twin of Sudoku's (D16).
    case "h":
    case "H":
      if (e.ctrlKey || e.metaKey) handled = false;
      else hintFocusedCell();
      break;
    // ── Pencil-mode toggle (T4-W8 ROW 1) — 'P' cycles off→corner→center. Bare key only;
    // preventDefault keeps 'p' out of the focused cell's native input. Twin of Sudoku's.
    case "p":
    case "P":
      if (e.ctrlKey || e.metaKey) handled = false;
      else emit("cyclePencilMode");
      break;
    default:
      handled = false;
  }
  if (handled) e.preventDefault();
}

// ── Marginalia — the status voice (§4.3) ─────────────────────────────
const marginText = ref("");
const marginTone = ref<"graphite" | "teacher-red" | "gold-star">("graphite");
function setMargin(text: string, tone: "graphite" | "teacher-red" | "gold-star") {
  marginText.value = text;
  marginTone.value = tone;
}

// ── The named hint (T4-W7) — twin of SudokuBoard's ───────────────────
// The becauseCells highlighted in the peek-laminate tone (FutoshikiCell's `is-because`
// tier); the margin voice writes the technique name via the existing note wipe on arm.
const hintBecause = computed(
  () => new Set((props.hint?.becauseCells ?? []).map(String)),
);
watch(
  () => props.hint,
  (hint) => {
    if (hint) {
      setMargin(
        formatHintNote(
          hint.technique,
          toDisplayChar(hint.value, props.boardSize),
          hint.houseAxis,
        ),
        "graphite",
      );
    }
  },
);

let slowSolveTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => props.solveState,
  (state) => {
    if (slowSolveTimer) {
      clearTimeout(slowSolveTimer);
      slowSolveTimer = null;
    }
    if (state === "solved") {
      setMargin("solved it!", "gold-star");
    } else if (state === "failed") {
      const c = conflicts.value;
      setMargin(
        c.firstRow
          ? `not quite — check row ${c.firstRow}`
          : "not quite — no solution from here.",
        "teacher-red",
      );
    } else if (state === "solving") {
      slowSolveTimer = setTimeout(() => {
        if (props.solveState === "solving")
          setMargin("still sharpening the pencil…", "graphite");
      }, 2500);
    } else if (state === "idle" && marginTone.value !== "graphite") {
      // Stale-note clear (W6, verify-14's widening): once the grade reverts, the red
      // "check row N" AND the gold "solved it!" go stale by the same path — clear any
      // non-graphite tone. Graphite board-load copy is not a grade; it stays.
      setMargin("", "graphite");
    }
  },
);

// ── The drawer's margin voice (T3-W12 §6) — twin of SudokuBoard's: hint once,
// ever, on the first close; graphite-only window so a grade is never talked over.
const { drawerOpen } = useControlsDrawer();
watch(drawerOpen, (open, prev) => {
  if (prev && !open && marginTone.value === "graphite" && consumeDrawerHint()) {
    setMargin("your pencil case is under the board", "graphite");
  }
});

// Board-load announcements.
let mounted = false;
let prevBoardSize = props.boardSize;
// UI-11 race guard (twin of SudokuBoard's): the async initial randomize can land its givens
// 0→N before onMounted; the old `!mounted` early-return then dropped the fresh-board voice
// entirely — the desktop-futoshiki-empty the audit found. Defer a pre-mount announce and flush
// it as a post-mount live-region mutation instead. Restore never trips it (its givens are set
// synchronously at composable setup, before this watch registers — no 0→N transition fires).
let pendingFreshAnnounce: string | null = null;
// T4-W3 share-truth (twin of SudokuBoard's): a corrupt `?board=` fell back to a fresh deal.
// Say so ONCE, folded into that first fresh-board announce, so the one status voice reports
// both the failed link AND what arrived instead. Consumed on use.
let linkErrorPending = props.linkError === true;
// T4-W7 — the measured difficulty signature, once graded, is the futoshiki margin's first
// difficulty word (there is no EASY/MEDIUM/HARD request voice here). Empty for an ungraded
// board (a restored permalink), which keeps the bare "a fresh N×N".
function freshBoardCopy(): string {
  const fresh = `a fresh ${props.boardSize}×${props.boardSize}`;
  const measured = props.gradeSignature ? ` — ${props.gradeSignature}` : "";
  if (linkErrorPending) {
    linkErrorPending = false;
    return `this shared link couldn't be read — ${fresh}${measured}`;
  }
  return `${fresh}${measured}`;
}
watch(
  () => props.givenCells.size,
  (n, prev) => {
    if (n > 0 && (prev ?? 0) === 0 && props.solveState !== "solved") {
      if (mounted) setMargin(freshBoardCopy(), "graphite");
      else pendingFreshAnnounce = freshBoardCopy(); // flushed in onMounted (post-mount mutation)
    }
  },
);
watch(
  () => props.boardGeneration,
  () => {
    focusedPos.value = 0;
    const sizeChanged = props.boardSize !== prevBoardSize;
    prevBoardSize = props.boardSize;
    if (!mounted || sizeChanged) return;
    if (props.givenCells.size === 0) setMargin("a fresh page.", "graphite");
  },
);

// ── The paper note (§5.2) ────────────────────────────────────────────
const showErrorNote = computed(() => props.solveState === "error");
const errorNote = computed(() => {
  if (props.errorCode) {
    const f = classifyCode(props.errorCode);
    if (f.kind === "paper-note") return { text: f.message, retryable: f.retryable };
  }
  return { text: PAPER_NOTE_COPY.budget, retryable: true };
});

// ── The tally (T3-W9 §2) — preformatted upstream, rendered by MarginNote's meta line ──
// The W6 derivation twins were deleted from both boards; formatSolveTally is the one home.
const tally = computed(() => formatSolveTally(props.solveStats));

// Grid animation state machine
const gridAnimState = ref<AnimationState>("hidden");
function onGridAnimComplete(state: "drawn" | "hidden") {
  if (state === "drawn") {
    gridAnimState.value = "drawn";
  } else if (state === "hidden") {
    if (props.leaving) {
      // F6 beat 2 — the seam: the page is erased; App flips the v-if on this tick.
      emit("erased");
    } else {
      gridAnimState.value = "drawing";
    }
  }
}

// F6 beat 1 (T3-W10) — switch-away routes the switch through the EXISTING animateErase
// via the same state machine the boardGeneration cycle drives; a cancelled page-turn
// (`leaving` drops while erased) redraws this exercise. Twin of SudokuBoard's (D16).
watch(
  () => props.leaving,
  (isLeaving) => {
    if (isLeaving) {
      gridAnimState.value = "erasing";
    } else if (gridAnimState.value === "hidden") {
      gridAnimState.value = "drawing";
    }
  },
);

onMounted(() => {
  gridAnimState.value = "drawing";
  mounted = true;
  // UI-11: flush a pre-mount fresh-board announce now that the live region is in the DOM.
  if (pendingFreshAnnounce && props.solveState !== "solved") {
    setMargin(pendingFreshAnnounce, "graphite");
    pendingFreshAnnounce = null;
  }
});

onUnmounted(() => {
  if (slowSolveTimer) clearTimeout(slowSolveTimer);
});

watch(
  () => props.boardGeneration,
  (_newVal, oldVal) => {
    if (oldVal === undefined) return;
    if (gridAnimState.value === "drawn") {
      gridAnimState.value = "erasing";
    } else {
      gridAnimState.value = "drawing";
    }
  },
);

function isRevealed(pos: number): boolean {
  return props.animatingCells.has(String(pos));
}
</script>

<template>
  <!-- H9 (in-flow-on-mobile): shell carries the width; the square board and the margin
       strip are siblings inside it — the strip is in flow when stacked (<lg), overlay
       in the row regime (≥lg). Twin of SudokuBoard's shape (D16). -->
  <div class="board-shell" :class="[boardSizeClasses, { 'board-leaving': leaving }]">
    <div
      class="board-wrapper cartoon-shadow-md bg-card aspect-square w-full rounded-xl"
      :class="boardClasses"
    >
      <!-- Hand-drawn SVG grid overlay — subgridSize === boardSize → plain Latin grid -->
      <HandDrawnGrid
        :board-size="boardSize"
        :subgrid-size="boardSize"
        :anim-state="gridAnimState"
        :progress="fillProgress"
        @animation-complete="onGridAnimComplete"
      />

      <!-- Interactive cell grid -->
      <div
        class="grid"
        :class="BOARD_CELLS_CLASS"
        role="grid"
        :aria-label="gridLabel"
        :aria-rowcount="boardSize"
        :aria-colcount="boardSize"
        :style="{
          gridTemplateColumns,
          gridTemplateRows: gridTemplateColumns,
        }"
        @keydown="onBoardKeydown"
        @focusin="onGridFocusin"
        @focusout="onGridFocusout"
      >
        <FutoshikiCell
          v-for="pos in totalCells"
          :key="pos - 1"
          :ref="(el) => setCellApi(pos - 1, el)"
          :position="pos - 1"
          :value="values[String(pos - 1)] ?? 0"
          :is-given="givenCells.has(String(pos - 1))"
          :is-overridden="overriddenCells.has(String(pos - 1))"
          :is-solved="String(pos - 1) in solvedValues"
          :is-revealed="isRevealed(pos - 1)"
          :is-invalid="conflicts.positions.has(String(pos - 1))"
          :is-because="hintBecause.has(String(pos - 1))"
          :is-peer="peerCells.has(String(pos - 1))"
          :noise-delay="noiseDelays.get(String(pos - 1)) ?? 0"
          :board-size="boardSize"
          :row-index="Math.floor((pos - 1) / boardSize) + 1"
          :col-index="((pos - 1) % boardSize) + 1"
          :tab-index="pos - 1 === focusedPos ? 0 : -1"
          :ghost-path="cellRects[pos - 1] ?? ''"
          :constraint-label="constraintLabels.get(pos - 1) ?? ''"
          :marks="pencilMarks?.[String(pos - 1)]"
          :corner-marks="cornerMarks?.[String(pos - 1)]"
          :center-marks="centerMarks?.[String(pos - 1)]"
          :pencil-mode="pencilMode"
          :flourish="celebrating"
          @update="onCellUpdate"
          @mark="(p: number, v: number) => emit('mark', p, v)"
          @cell-focus="onCellFocus"
          @candidate-peek-start="emit('candidatePeekStart')"
          @candidate-peek-end="emit('candidatePeekEnd')"
        />
      </div>

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

      <!-- The felt heart (T3-W9, F2-C/F7 §3.2) — the Heart Fruit crests the board's
         bottom-right corner at the star's moment, diagonal opposite of the margin
         voice. Anchored to the square itself (the sticker register). -->
      <CelebrationHeart :active="celebrating" />
    </div>

    <!-- The grade in the margin (T3-W12 §1 R1) — twin of SudokuBoard's: the gold
         composition beside the work; the strip's live region below still announces.
         `docked` = the §6 drawer hook (corner-press early when drawer-open <1360). -->
    <CompletionVignette
      :active="celebrating"
      :text="marginText"
      :meta="tally"
      :docked="vignetteDocked"
    />

    <!-- Below-board margin: status voice + paper note — a sibling of the board square
         (H9): in flow when stacked, overlay in the row regime. R1: the strip goes
         sr-only-quiet on the gold path (the vignette carries the paint); graphite/red/
         error keep it exactly as before. Twin of SudokuBoard's. -->
    <div class="board-margin">
      <!-- The DIFFICULTY signal (T4-W9-B1, twin of Sudoku's) — the tally glyph beside its
           prose voice; persistent, distinct from FILL (border) and CORRECTNESS (verdict). -->
      <DifficultyTally v-if="gradeTally" :descriptor="gradeTally" />
      <MarginNote
        :text="marginText"
        :tone="marginTone"
        :meta="tally"
        :quiet="celebrating"
      />
      <SolverErrorNote
        v-if="showErrorNote"
        :text="errorNote.text"
        :retryable="errorNote.retryable"
        @retry="emit('retry')"
      />
    </div>
  </div>
</template>

<style scoped>
.board-shell {
  position: relative;
}

.board-wrapper {
  position: relative;
  overflow: visible;
  contain: layout style;
  /* P2 (T3-W12 §2) — fence the boil damage on a promoted layer; twin of
       SudokuBoard's (see its comment for the contain:paint counter-case). */
  will-change: transform;
}

.board-cells {
  position: absolute;
  inset: 0;
  z-index: 2;
}

/* Caret furniture layer — passes pointer events through except on the carets themselves
   (which enable their own hover boil). Sits in the cell layer so the peek laminate (z-3)
   lays down over it. */
.caret-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

/* F6 beat 1 (T3-W10) — glyphs + caret furniture + marginalia leave with the grid:
   opacity-only, 200ms, easeInCubic (the erase family — things LEAVING the page).
   The orchestrator never raises `leaving` under PRM (same-frame cut); the media
   gate keeps even a stray class-flip instant there. Twin of SudokuBoard's. */
@media (prefers-reduced-motion: no-preference) {
  .board-leaving .board-cells,
  .board-leaving .caret-layer,
  .board-leaving .board-margin,
  .board-leaving .completion-vignette {
    opacity: 0;
    transition: opacity 200ms cubic-bezier(0.32, 0, 0.67, 0);
  }
}

/* Stacked (<lg): in flow — its real height (note + error card) pushes the controls
   panel down (H9 in-flow variant; carries H5's mobile case). */
.board-margin {
  margin-top: 0.4rem;
  margin-inline: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  pointer-events: none;
}

/* Row regime (≥lg): overlay strip anchored to the square — no layout shift. */
@media (min-width: 1024px) {
  .board-margin {
    position: absolute;
    top: 100%;
    inset-inline: 0.25rem;
    margin-inline: 0;
    z-index: 50;
  }
}

/* The T3-W9 completion block is retired — the gold composition lives in
   CompletionVignette (T3-W12 §1 R1). Twin of SudokuBoard's. */

/* ── The drawer-closed grow (T3-W12 §6, ≥1024 only) — twin of SudokuBoard's:
   width allowance +1 step per rung, dvh cap 10rem → 9rem; lands in the settle's
   ONE layout step (never a filtered-element size tween). */
@media (min-width: 1024px) {
  html.drawer-closed .board-shell.shell-sm {
    width: min(28rem, 85vw);
    max-width: calc(100dvh - 9rem);
  }

  html.drawer-closed .board-shell.shell-md {
    width: min(46rem, 85vw);
    max-width: calc(100dvh - 9rem);
  }
}
</style>

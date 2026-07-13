<script setup lang="ts">
import { computed, ref, watch, provide, onMounted, onUnmounted, nextTick } from "vue";
import SudokuCell from "./SudokuCell/SudokuCell.vue";
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
import type { Difficulty, SolveState, SolveStats } from "@games/sudoku/types";
import type { AnimationState } from "@pencil/types";

const props = defineProps<{
  size: number;
  boardSize: number;
  totalCells: number;
  values: Record<string, number>;
  givenCells: Set<string>;
  overriddenCells: Set<string>;
  animatingCells: Set<string>;
  solveState: SolveState;
  solvedValues: Record<string, number>;
  boardGeneration: number;
  /** Optional — enriches the grid a11y label + marginalia ("a fresh 9×9 — you asked for
   *  medium"; B-0 request voice, never a measured grade). Wired by the union lane (see
   *  fictions-a11y report §insertion-specs). */
  difficulty?: Difficulty;
  /** Optional typed error code (SolverErrorCode) for the paper-note copy.
   *  Absent → the default 'error' cause (BUDGET_EXCEEDED) copy. Wired by the union lane. */
  errorCode?: string;
  /** Stats from the last completed solve — the margin tally (MarginNote meta, pencil
   *  hand, understated). Null whenever the grade is idle; the composable owns the
   *  lifecycle. */
  solveStats?: SolveStats | null;
  /** Engine-domains pencil marks (W6 beat 9): per-position surviving candidates
   *  from the solver's own propagation. Populated only while the peek gesture is
   *  held (opt-in — never ambient); only positions where propagation actually
   *  pruned something are present. */
  pencilMarks?: Record<string, number[]>;
  /** T4-W8 ROW 1 — the player's own pencil marks (corner + center slots), distinct in store and
   *  render from the engine peek marks above. Forwarded per-cell; empty when a cell has none. */
  cornerMarks?: Record<string, number[]>;
  centerMarks?: Record<string, number[]>;
  /** T4-W8 ROW 1 — the active pencil mode (off/corner/center), forwarded to each cell so its
   *  frozen native input routes a digit to a mark instead of a value while a slot is armed. */
  pencilMode?: PencilMode;
  /** F6 page-turn (T3-W10): true while this scene is switch-away's outgoing exercise.
   *  Routes the grid through the EXISTING erase beat and fades glyphs + marginalia;
   *  on the erase's completion the board emits `erased` (the seam) instead of redrawing. */
  leaving?: boolean;
  /** T4-W3 share-truth: a `?board=` was PRESENT but failed to decode — the composable already
   *  fell back to a fresh deal. Folds a one-line "this shared link couldn't be read" clause into
   *  the FIRST fresh-board announce so the corrupt link doesn't degrade silently. One-shot. */
  linkError?: boolean;
  /** T4-W7 — the armed hint's reasoning: the first press names the cheapest technique and
   *  hands this over; the board highlights `becauseCells` in the peek-laminate tone and writes
   *  the technique name in the margin. Null between hint transactions. */
  hint?: HintResult | null;
  /** T4-W7 — the measured difficulty signature ("singles only" / "needs an X-wing"), keyed to
   *  the deal-time grade's hardest technique. Replaces W6's request bucket in the fresh-board
   *  announce ONCE graded; empty for an ungraded board (W6's request voice stays the fallback). */
  gradeSignature?: string;
  /** T4-W9-B1 — the displayed-quality tally descriptor (the glyph twin of `gradeSignature`).
   *  Fully derived in the composable; the board just forwards it to the DifficultyTally. */
  gradeTally?: TallyDescriptor;
  /** T4-W8 ROW 2 — the error-check mode's PROACTIVE display gate (live, or an armed on-demand
   *  snapshot). ORed below with the `solveState === 'failed'` grade: the teacher's red pencil
   *  still grades actual work regardless of this setting; the mode governs only the live cadence. */
  proactiveErrorCheck?: boolean;
  /** T4-WU race gate — true while a board op (generate/solve) is in flight. Gates keyboard
   *  Cmd/Ctrl+Z on the SAME signal the coarse buttons already honor (`:disabled="loading"`),
   *  closing the last ungated undo seam so an undo can't race a pending generate. */
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "updateCell", position: number, value: number): void;
  (e: "retry"): void;
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "hint", position: number): void;
  (e: "erased"): void;
  /** T4-W8 ROW 1 — a cell authored a user mark (digit toggles, 0 erases); forwarded to the
   *  game's user-mark store. Distinct from `updateCell` (the value write). */
  (e: "mark", position: number, value: number): void;
  /** T4-W8 ROW 1 — the bare-'P' keyboard toggle cycles the pencil mode (off→corner→center). */
  (e: "cyclePencilMode"): void;
  /** Long-press peek (T4-WM §3): forwarded from a cell's hold to the game's marks activation —
   *  the candidate glimpse is marks-only (no answer laminate). Release ends it. */
  (e: "candidatePeekStart"): void;
  (e: "candidatePeekEnd"): void;
}>();

const gridTemplateColumns = computed(
  () => `repeat(${props.boardSize}, minmax(0, 1fr))`,
);

// Pre-computed ghost rect paths in board viewBox coordinates (1000×1000).
// generateCellRects emits ONLY the ghost half (the frame/line pass is dead weight for
// this consumer) and is LRU-backed (T3-W8) — a 9→16→9 round-trip is a cache hit, not a
// 256-rect regen on the switch's synchronous main-thread burst.
const VIEWBOX_SIZE = 1000;
const cellRects = computed(() =>
  generateCellRects(props.boardSize, props.size, VIEWBOX_SIZE, 42),
);

// ── Marks idle-chunk gate (T3-W8, G7 R-7) ────────────────────────────
// Holding K populates pencilMarks for every empty cell in one shot. At 16×16 that's ~2,700
// mark nodes mounting synchronously — a felt hitch. We release marks row-by-row on idle
// (requestIdleCallback, rAF fallback) so the peek reads as a fast top-down ripple — in the
// pencil grammar — instead of one blank hold. Small boards (9×9 free already) and reduced-
// motion both render instantly: no ripple, no regression. `marksFor` gates each cell's marks
// on its row having been released; clearing (K up) resets the gate immediately.
const MARKS_CHUNK_MIN_BOARD = 10; // boards below this render marks all at once
const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
const revealedMarkRows = ref(0);
let marksIdleHandle: number | null = null;

const scheduleIdle: (cb: () => void) => number =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? (cb) =>
        (
          window as unknown as {
            requestIdleCallback: (c: () => void) => number;
          }
        ).requestIdleCallback(cb)
    : (cb) => requestAnimationFrame(() => cb());
const cancelIdle = (h: number) => {
  if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
    (
      window as unknown as { cancelIdleCallback: (h: number) => void }
    ).cancelIdleCallback(h);
  } else {
    cancelAnimationFrame(h);
  }
};
function stopMarksReveal() {
  if (marksIdleHandle !== null) {
    cancelIdle(marksIdleHandle);
    marksIdleHandle = null;
  }
}

const hasMarks = computed(
  () => !!props.pencilMarks && Object.keys(props.pencilMarks).length > 0,
);
watch(hasMarks, (has) => {
  stopMarksReveal();
  if (!has) {
    revealedMarkRows.value = 0; // K released — clear the gate at once
    return;
  }
  // Small board or reduced-motion: everything at once, no ripple.
  if (props.boardSize < MARKS_CHUNK_MIN_BOARD || prefersReducedMotion?.matches) {
    revealedMarkRows.value = props.boardSize;
    return;
  }
  revealedMarkRows.value = 0;
  const step = () => {
    revealedMarkRows.value = Math.min(revealedMarkRows.value + 1, props.boardSize);
    marksIdleHandle =
      revealedMarkRows.value < props.boardSize ? scheduleIdle(step) : null;
  };
  marksIdleHandle = scheduleIdle(step);
});

function marksFor(pos: number): number[] | undefined {
  const m = props.pencilMarks?.[String(pos)];
  if (!m) return undefined;
  return Math.floor(pos / props.boardSize) < revealedMarkRows.value ? m : undefined;
}

// R3: the viewport-share/dvh caps ride the row regime, which now starts at lg: —
// iPad-portrait (768) stacks, so the stacked width formula governs there (the md:
// 85vw board under-filled the 42rem mobile controls card by ~19px at 768).
// T3-W12 §6: the `shell-*` rung class keys the drawer-closed grow — the loosened
// width/height allowances live in this component's scoped CSS under
// `html.drawer-closed` (unlayered, so they beat the layered Tailwind utilities)
// and land in the settle's ONE layout step, never a tween.
const boardSizeClasses = computed(() => {
  if (props.boardSize <= 4)
    return "shell-sm w-[min(26rem,calc(100vw-1.5rem))] lg:w-[min(26rem,85vw)] lg:max-w-[calc(100dvh-10rem)]";
  if (props.boardSize <= 9)
    return "shell-md w-[min(42rem,calc(100vw-1.5rem))] lg:w-[min(42rem,85vw)] lg:max-w-[calc(100dvh-10rem)]";
  return "shell-lg w-[min(52rem,calc(100vw-1.5rem))] lg:w-[min(52rem,90vw)] lg:max-w-[calc(100dvh-10rem)]";
});

// P4 (T3-W12 §2): the wrapper's transition is SCOPED to the gold/red shadow it exists
// for (index.css solve-success/-failure) — `transition-all` volunteered every future
// property change (the drawer's transforms included) into surprise 500ms tweens.
const boardClasses = computed(() => {
  const base = "transition-[box-shadow] duration-500";
  if (props.solveState === "solved") return `${base} solve-success`;
  if (props.solveState === "failed") return `${base} solve-failure`;
  return base;
});

// ── Conflict detection — the teacher's red pencil (§1.4) + error-check MODE (T4-W8 ROW 2) ──
// The SAME pure `findConflicts` derivation over `values`, un-gated from the 'failed'-only gate:
// it now feeds the cells (aria-invalid + the red ghost) + the marginalia (the row to check) at
// the chosen cadence. `solveState === 'failed'` (the teacher grading actual work) is ORed with
// the mode's proactive display — live is continuous, on-demand shows an armed snapshot, off shows
// nothing proactively (the grade still grades). Event-driven (a value mutation), never the boil
// beat, so live adds ZERO idle paints — the E7 idle-paint invariant holds by construction.
const conflictsVisible = computed(
  () => props.solveState === "failed" || props.proactiveErrorCheck === true,
);
const conflicts = computed(() =>
  conflictsVisible.value
    ? findConflicts(props.values, props.boardSize, props.size)
    : { positions: new Set<string>(), firstRow: null },
);

// ── T4-W9 board FILL fraction (the progress trace's number) ──────────────
// A pure derivation over `values`/`givenCells` (re-evaluated on a fill/clear, NEVER on
// the boil beat): filled non-given cells / fillable cells. FILL, not correctness — wrong
// digits count (the app grades correctness only on Solve). HandDrawnGrid owns the render.
const fillProgress = computed(() => {
  let filled = 0;
  for (const [pos, v] of Object.entries(props.values)) {
    if (v !== 0 && !props.givenCells.has(pos)) filled++;
  }
  const fillable = Math.max(1, props.totalCells - props.givenCells.size);
  return Math.max(0, Math.min(1, filled / fillable));
});

// Beat 1 — the reveal wave. Noise-order stagger (Fisher-Yates + mulberry32), but
// board-normalized (design §1.3): stagger = clamp(round(1200 / blankCount), 4, 24) so the
// reveal window is ~1.2s at every board size instead of the old fixed 15ms/cell (which ran
// ~0.75s on a 9×9 but ~3s on a full 16×16 — outstaying its welcome exactly when the board is
// most impressive).
const noiseDelays = computed(() => {
  const delays = new Map<string, number>();
  const cells = Array.from(props.animatingCells);
  if (cells.length === 0) return delays;

  const stagger = revealStaggerMs(cells.length);

  // Fisher-Yates shuffle with seeded RNG
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

// Celebration presence (design §1.3; T3-W12 §1 P5): STATE-derived, never edge-
// triggered — `celebrating` is a pure derivation over solveState + animatingCells, so
// the composition (star, heart, vignette) survives any remount while solved (HMR, a
// future keep-alive/regime swap, solved-state drawer toggling). The a1 forensics
// caught the edge-triggered ref dropping star + heart while the gold note persisted.
// An idempotent re-solve (zero new cells) still skips the fanfare — the grid recolor
// carries it. Only the murmur SEED stays on the transition edge (a fresh crest seeds
// a fresh classroom; a remount must not reseed).
const celebrating = computed(
  () => props.solveState === "solved" && props.animatingCells.size > 0,
);
// T4-W10 idiom (§flourish) — provide the celebrating derivation to the glyph by INJECT rather
// than the board→cell→glyph prop-drill (the cell no longer declares a pass-through `flourish`
// prop). The glyph reads `inject('flourish', ref(false))`; scoped to this flag only (every
// other cell prop stays a prop). See c2-idiom.md §3 for the caret gate.
provide("flourish", celebrating);
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
  notifyUserEdit(); // the page is being written on — hold the murmur this window (§1.3)
  emit("updateCell", pos, value);
}

// ── ARIA grid + roving tabindex (§4.1) ───────────────────────────────
// One Tab stop for the whole board; Arrow keys move cell focus, Home/End to row ends,
// Ctrl+Home/End to board corners. Exactly one cell carries tabindex 0 at a time.
const DIFFICULTY_WORD: Record<Difficulty, string> = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};
const difficultyWord = computed(() =>
  props.difficulty ? DIFFICULTY_WORD[props.difficulty] : "",
);
const gridLabel = computed(
  () =>
    `${props.boardSize} by ${props.boardSize} sudoku board${difficultyWord.value ? ", " + difficultyWord.value : ""}`,
);

const focusedPos = ref(0);
const cellApi = new Map<number, { focus: () => void }>();
// T4-W10 idiom (§:ref) — a STABLE bound handler, not a per-render inline closure. The old
// per-cell arrow (setCellApi(pos - 1, el) wrapped inline on the ref) allocated N fresh arrows
// every re-render and forced Vue to unbind→rebind every cell ref each patch. The cell now
// exposes its own `position`
// (defineExpose), so the map keys off the instance rather than a captured index — ref identity
// is stable across renders, and the {0..totalCells-1} → {focus} slot map is byte-identical.
function setCellApi(el: unknown) {
  if (
    el &&
    typeof (el as { focus?: unknown }).focus === "function" &&
    typeof (el as { position?: unknown }).position === "number"
  ) {
    const inst = el as { focus: () => void; position: number };
    cellApi.set(inst.position, inst);
  }
  // Vue calls the ref with `null` on unmount; a shrink carries no index to delete through the
  // null callback, so the totalCells watch prunes stale keys ≥ N — keeping the map = {0..N-1}.
}
watch(
  () => props.totalCells,
  (n) => {
    for (const key of cellApi.keys()) if (key >= n) cellApi.delete(key);
  },
);
function focusCell(pos: number) {
  const clamped = Math.max(0, Math.min(props.totalCells - 1, pos));
  focusedPos.value = clamped;
  nextTick(() => cellApi.get(clamped)?.focus());
}
function onCellFocus(pos: number) {
  focusedPos.value = pos;
}

// ── Peer-unit highlight on selection (T4-W8 ROW 4) ────────────────────
// A pure derivation over `focusedPos`: the cells sharing the focused cell's row, column, or box
// take a faint pencil wash so the active unit reads at a glance. Gated on the board actually
// HOLDING focus (`unitFocused`) so a fresh load — focusedPos 0 with nothing selected — washes
// nothing; focusin/focusout on the grid track it (a cell→cell arrow keeps focus WITHIN the grid,
// tabbing to a control drops it). The focused cell itself is excluded — it carries its own ghost;
// the wash is its neighbours' tint.
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
  // Box peers — the subgrid band (sudoku's structural divergence from futoshiki's Latin square).
  const sg = props.size;
  const br = Math.floor(row / sg) * sg;
  const bc = Math.floor(col / sg) * sg;
  for (let r = 0; r < sg; r++) {
    for (let c = 0; c < sg; c++) set.add(String((br + r) * n + (bc + c)));
  }
  set.delete(String(pos)); // the focused cell keeps its own ghost; peers are its neighbours
  return set;
});

// T4-WM §2 — the hint act, factored so the ControlPanel's Hint button and the board's H key
// share ONE path: both reveal the currently focused cell. On coarse the last tap sets
// focusedPos, and it survives the button tap (only a board reset clears it, L442), so tapping
// Hint reveals the cell you last touched. Exposed because the panel is the board's SIBLING,
// not its child — the game calls this on the panel's @hint (W7 later re-voices the content).
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
    // ── Bounded undo/redo (W6) — a sibling case, disjoint e.key from the K-peek
    // ('k'/'Escape') and Backspace/Delete layers. Gate on ctrlKey OR metaKey (Cmd on
    // macOS — the original native-undo phantom was reproduced via Cmd+Z); a plain 'z'
    // falls through unhandled so it's never swallowed. Shift → redo.
    case "z":
    case "Z":
      if (e.ctrlKey || e.metaKey) {
        // T4-WU refuse-while-pending: swallow the key but no-op while a board op is in flight,
        // matching the coarse buttons' `:disabled="loading"`. The composable also refuses at
        // its choke point; this closes the seam at the keydown too.
        if (props.loading) break;
        if (e.shiftKey) emit("redo");
        else emit("undo");
      } else handled = false;
      break;
    // ── Hint tier (W6) — 'H' fills the focused cell from the peek cache (solver-ink).
    // Bare key only; a modified H (Ctrl/Cmd+H → browser history/hide) falls through.
    case "h":
    case "H":
      if (e.ctrlKey || e.metaKey) handled = false;
      else hintFocusedCell();
      break;
    // ── Pencil-mode toggle (T4-W8 ROW 1) — 'P' cycles off→corner→center. Bare key only (a
    // modified P → browser print falls through); preventDefault keeps 'p' out of the focused
    // cell's native input. Sibling case, disjoint from the H/Z/K layers.
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

// ── The named hint (T4-W7) — the reasoning the first press draws ──────
// The cells the argument turns on, highlighted in the peek-laminate tone (SudokuCell's
// `is-because` tier). The margin voice writes the technique name via the existing 250ms
// note wipe when a hint arms — graphite, so it never masquerades as a grade.
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
      // Fast solves (the common case) resolve well under 2.5s and never reach this (§5.1 tiers).
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
    // 'error' — marginalia stays quiet; a network/server fault is the note card's
    // domain (role=alert), never the page commenting on the puzzle (§4.3).
  },
);

// ── UI-13 (ratified: KEEP grade-after-Solve + say-it) ────────────────
// The teacher still grades actual work — `conflicts` above stays gated on 'failed', so cells
// gain `aria-invalid` and the maroon beat ONLY after a Solve (that beat is untouched). What
// was missing is discoverability: a fresh user doesn't know the grader exists. The first time
// a duplicate is visibly present while idle, the margin voice whispers that it does — once per
// board, graphite (never the red verdict tone), and it marks NOTHING. `findConflicts` here is
// a read-only peek used solely to decide whether to speak.
const gradeHintShown = ref(false);
watch(
  () => props.values,
  () => {
    if (!mounted || gradeHintShown.value) return;
    if (props.solveState !== "idle") return; // a real grade owns the voice; don't talk over it
    if (findConflicts(props.values, props.boardSize, props.size).positions.size > 0) {
      gradeHintShown.value = true;
      setMargin("mark it and I'll grade", "graphite");
    }
  },
  { deep: true },
);

// ── The drawer's margin voice (T3-W12 §6): hint once, ever, on the first close —
// "your pencil case is under the board". Graphite-only window: a gold/red note is a
// grade mid-speech (and the gold verdict feeds the vignette) — don't talk over it,
// and don't burn the once-flag (consumeDrawerHint is only called inside the guard).
const { drawerOpen } = useControlsDrawer();
watch(drawerOpen, (open, prev) => {
  if (prev && !open && marginTone.value === "graphite" && consumeDrawerHint()) {
    setMargin("your pencil case is under the board", "graphite");
  }
});

// Board-load announcements (also fixes the silent randomize, §4.3).
let mounted = false;
let prevBoardSize = props.boardSize;
// UI-11 race guard: the initial randomize is async, so its givens 0→N can land in the tiny
// window between this watch registering and onMounted. Announcing pre-mount would set the
// text before the live region is in the DOM (some AT miss a text that's present at mount
// rather than mutated after) — the reason the old guard dropped it outright, which is exactly
// how the futoshiki desktop voice went empty. Instead we DEFER: stash the copy and flush it
// as a post-mount mutation in onMounted. A restored board never trips this — restore sets the
// givens synchronously at composable setup, before this watch registers, so no 0→N ever fires.
let pendingFreshAnnounce: string | null = null;
// T4-W3 share-truth: a corrupt `?board=` fell back to a fresh deal. Say so ONCE, folded into
// that first fresh-board announce, so the one status voice reports both the failed link AND
// what arrived instead — never a silent degrade, never a second live region. Consumed on use.
let linkErrorPending = props.linkError === true;
// B-0 de-launder (T4-W6 ROW-4) → T4-W7 measured signature. The EASY/MEDIUM/HARD dropdown is a
// bucket REQUEST, never a grade — so before a board is graded the margin speaks the request
// voice, "you asked for medium". T4-W7 grades the DEALT board and, once graded, the measured
// signature ("singles only" / "needs an X-wing") REPLACES the request word — the honest,
// live-measured difficulty. An ungraded board (a restored permalink or a hand-typed board:
// gradeSignature empty) keeps the request voice, or silence with no difficulty prop — never a
// fabricated grade. The three-signal spine holds: this is DIFFICULTY, distinct from FILL and
// CORRECTNESS.
function freshBoardCopy(): string {
  const fresh = `a fresh ${props.boardSize}×${props.boardSize}`;
  const measured = props.gradeSignature
    ? ` — ${props.gradeSignature}`
    : difficultyWord.value
      ? ` — you asked for ${difficultyWord.value}`
      : "";
  if (linkErrorPending) {
    linkErrorPending = false;
    return `this shared link couldn't be read — ${fresh}${measured}`;
  }
  return `${fresh}${measured}`;
}
watch(
  () => props.givenCells.size,
  (n, prev) => {
    // Givens populate (0 → N) on randomize / initial fetch — a fresh puzzle arrived.
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
    gradeHintShown.value = false; // a fresh board re-arms the UI-13 grade hint
    const sizeChanged = props.boardSize !== prevBoardSize;
    prevBoardSize = props.boardSize;
    // A same-size generation bump that leaves the board empty is a clear (§5.3). A size
    // change is announced by the givens 0→N watch instead, so skip it here.
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
  // The default 'error' cause on the Worker (W6) path is BUDGET_EXCEEDED — the head-scratcher.
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
      // After erase, redraw (the boardGeneration cycle)
      gridAnimState.value = "drawing";
    }
  }
}

// F6 beat 1 (T3-W10) — switch-away routes the switch through the EXISTING animateErase
// (easeInCubic, the "leave the page" curve — ~250ms on a 9×9's line count) via the same
// state machine the boardGeneration cycle already drives. If a mid-erase re-select cancels
// the page-turn (`leaving` drops while we sit erased), the exercise redraws itself.
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
  // UI-11: flush a pre-mount fresh-board announce now that the live region is in the DOM,
  // so it lands as a mutation the status region announces (and renders in the margin).
  if (pendingFreshAnnounce && props.solveState !== "solved") {
    setMargin(pendingFreshAnnounce, "graphite");
    pendingFreshAnnounce = null;
  }
});

onUnmounted(() => {
  if (slowSolveTimer) clearTimeout(slowSolveTimer);
  stopMarksReveal();
});

// On board generation change (size change, randomize, clear), erase and redraw
watch(
  () => props.boardGeneration,
  (_newVal, oldVal) => {
    if (oldVal === undefined) return; // skip initial
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
  <!-- H9 (in-flow-on-mobile): the shell carries the width; the square board and the
       margin strip are siblings inside it. Stacked (<lg) the strip is in flow, so a
       showing error card pushes the controls panel down instead of overlaying it at
       z-50; in the row regime (≥lg) it reverts to the overlay strip (true margin-
       writing, no layout shift). -->
  <div class="board-shell" :class="[boardSizeClasses, { 'board-leaving': leaving }]">
    <div
      class="board-wrapper cartoon-shadow-md bg-card aspect-square w-full rounded-xl"
      :class="boardClasses"
    >
      <!-- Hand-drawn SVG grid overlay -->
      <HandDrawnGrid
        :board-size="boardSize"
        :subgrid-size="size"
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
        <SudokuCell
          v-for="pos in totalCells"
          :key="pos - 1"
          :ref="setCellApi"
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
          :subgrid-size="size"
          :row-index="Math.floor((pos - 1) / boardSize) + 1"
          :col-index="((pos - 1) % boardSize) + 1"
          :tab-index="pos - 1 === focusedPos ? 0 : -1"
          :ghost-path="cellRects[pos - 1] ?? ''"
          :marks="marksFor(pos - 1)"
          :corner-marks="cornerMarks?.[String(pos - 1)]"
          :center-marks="centerMarks?.[String(pos - 1)]"
          :pencil-mode="pencilMode"
          @update="onCellUpdate"
          @mark="(p: number, v: number) => emit('mark', p, v)"
          @cell-focus="onCellFocus"
          @candidate-peek-start="emit('candidatePeekStart')"
          @candidate-peek-end="emit('candidatePeekEnd')"
        />
      </div>

      <!-- The felt heart (T3-W9, F2-C/F7 §3.2) — the Heart Fruit crests the board's
         bottom-right corner at the star's moment, diagonal opposite of the margin
         voice. Anchored to the square itself (the sticker register). -->
      <CelebrationHeart :active="celebrating" />
    </div>

    <!-- The grade in the margin (T3-W12 §1 R1): the completion moment's visual home —
         star at grading-sticker scale + verdict + one-line tally beside the work, in
         the teacher's margin (rungs: left column ≥1280, corner-press top-right
         1024–1279, in flow <1024). aria-hidden decoration: the strip's live region
         below still announces the grade. Anchored to the board-shell so it travels
         with the board's drawer transform (§6 interplay); drawer-open below ~1360 the
         margin is too narrow for the full vignette — it takes the corner-press rung
         early (`docked`, the §6 hook). -->
    <CompletionVignette
      :active="celebrating"
      :text="marginText"
      :meta="tally"
      :docked="vignetteDocked"
    />

    <!-- Below-board margin: the status voice + the paper note (§4.3, §5.2). Two distinct
         live regions — marginalia (role=status, polite; the page on the puzzle) and the
         error card (role=alert; broken machinery). A sibling of the board square (H9):
         in flow when stacked, overlay in the row regime. R1: while the vignette carries
         the gold verdict, the strip goes visually quiet (sr-only — still announcing) so
         the gold path renders NOTHING below the board; graphite/teacher-red/error keep
         the strip exactly as before (transient, one line — those fit the fold gap). -->
    <div class="board-margin">
      <!-- The DIFFICULTY signal (T4-W9-B1): the tally glyph beside its own prose voice.
           Persistent (not tied to the voice's quiet toggle) — difficulty is a fact of the
           dealt board, distinct from FILL (the border) and CORRECTNESS (the solve verdict). -->
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
  /* P2 (T3-W12 §2) — fence the boil damage: the wrapper is promoted to its own
       composited layer, so a glyph/grid swap dirties this board-sized backing store
       instead of the full scrolling-contents layer (~50 full-viewport paints/s in
       the a1 baseline). Promotion over `contain: paint` deliberately: the grid frame
       rides the viewBox edge (gridPaths frameYPad 0, svg overflow: visible) and the
       heart/ghost strokes overhang the border box — paint containment would shave
       them; a promoted layer's ink overflow clips nothing. */
  will-change: transform;
}

.board-cells {
  position: absolute;
  inset: 0;
  z-index: 2;
}

/* F6 beat 1 (T3-W10) — glyphs + marginalia leave with the grid: opacity-only, 200ms,
   easeInCubic (the erase family — things LEAVING the page, design §1.2 canon). The
   orchestrator never raises `leaving` under PRM (same-frame cut), and the media gate
   keeps even a stray class-flip instant there. */
@media (prefers-reduced-motion: no-preference) {
  .board-leaving .board-cells,
  .board-leaving .board-margin,
  .board-leaving .completion-vignette {
    opacity: 0;
    transition: opacity 200ms var(--ease-fadeOut);
  }
}

/* The status/alert strip just below the board. pointer-events pass through to whatever
   is beneath (the marginalia never blocks); the error card re-enables them on itself.
   Stacked (<lg): in flow — its real height (note + error card) pushes the controls
   panel down (H9 in-flow variant; carries H5's mobile case). */
.board-margin {
  margin-top: 0.4rem;
  margin-inline: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  pointer-events: none;
}

/* Row regime (≥lg): overlay strip anchored to the square — true margin-writing,
   no layout shift when a note arrives. */
@media (min-width: 1024px) {
  .board-margin {
    position: absolute;
    top: 100%;
    inset-inline: 0.25rem;
    margin-inline: 0;
    z-index: 50;
  }
}

/* The T3-W9 completion block (sticker slot beside the voice) is retired — the gold
   composition lives in CompletionVignette (T3-W12 §1 R1); the strip carries only the
   voice + tally, and goes sr-only-quiet on the gold path (MarginNote `quiet`). */

/* ── The drawer-closed grow (T3-W12 §6, ≥1024 only) ───────────────────
   With the case tucked, the worksheet gets the whole desk: width allowance +1 step
   per rung, the dvh cap loosens 10rem → 9rem. Unlayered scoped rules beat the
   layered Tailwind utilities above; the swap lands in the settle's ONE layout step
   (the glide already covered the move with a transform — no filtered-element size
   tween, the §6 binding constraint). */
@media (min-width: 1024px) {
  html.drawer-closed .board-shell.shell-sm {
    width: min(28rem, 85vw);
    max-width: calc(100dvh - 9rem);
  }

  html.drawer-closed .board-shell.shell-md {
    width: min(46rem, 85vw);
    max-width: calc(100dvh - 9rem);
  }

  html.drawer-closed .board-shell.shell-lg {
    width: min(56rem, 90vw);
    max-width: calc(100dvh - 9rem);
  }
}
</style>

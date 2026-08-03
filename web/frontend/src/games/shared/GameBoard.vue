<script setup lang="ts">
/**
 * GameBoard — the game-agnostic board-scene shell (T4-W11 R4). Both boards
 * (SudokuBoard, FutoshikiBoard) were ~90% line-identical: the grid scaffold, the
 * reveal-wave stagger, the conflict/peer highlight plumbing, the roving-tabindex ARIA
 * grid, the marginalia status machine, the completion vignette + celebration heart, the
 * paper-note host, the drawer margin voice, and the draw/erase animation state machine
 * are all HERE, once. What genuinely diverges stays a per-game slot or function, never a
 * config flag (the god-interface guard):
 *   - the cell component + its furniture props (subgrid ticks / inequality caret) → the
 *     scoped `#cells` slot, fed the shell's per-cell derived state.
 *   - overlay furniture (Futoshiki's caret layer) → the `#overlay` slot (empty for Sudoku).
 *   - conflict/peer adjacency, the ghost/grid subgrid, the grid a11y label, the fresh-board
 *     announce, and the (Sudoku-only) idle grade hint → per-game function/value props.
 */
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import HandDrawnGrid from "@pencil/grid/HandDrawnGrid/HandDrawnGrid.vue";
import CelebrationHeart from "@pencil/chrome/CelebrationHeart.vue";
import CelebrationStar from "@pencil/chrome/CelebrationStar.vue";
import CompletionVignette from "@pencil/chrome/CompletionVignette.vue";
import MarginNote from "@pencil/chrome/MarginNote.vue";
import SolverErrorNote from "@games/shared/SolverErrorNote.vue";
import { mulberry32 } from "@mkbabb/pencil-boil";
import { generateCellRects } from "@pencil/grid/gridPaths";
import { revealStaggerMs } from "@pencil/config/pencilConfig";
import {
  setMurmurSeed,
  notifyUserEdit,
  resetMurmur,
} from "@pencil/composables/celebration";
import type { Conflicts } from "@games/shared/conflicts";
import { classifyCode, PAPER_NOTE_COPY } from "@games/shared/solver/classifyError";
import { BOARD_CELLS_CLASS } from "@games/shared/constants";
import { formatSolveTally } from "@games/shared/solveTally";
import { formatHintNote } from "@games/shared/techniqueVoice";
import { toDisplayChar } from "@pencil/glyph/glyphRegistry";
import {
  consumeDrawerHint,
  useControlsDrawer,
  vignetteDocked,
  vignetteHasTally,
} from "@games/shared/useControlsDrawer";
import { useDebug } from "@/composables/useDebug";
import type { HintResult } from "@games/shared/techniqueEngine";
import type { SolveState, SolveStats } from "@games/shared/types";
import type { AnimationState } from "@pencil/types";

const props = defineProps<{
  boardSize: number;
  totalCells: number;
  values: Record<string, number>;
  givenCells: Set<string>;
  animatingCells: Set<string>;
  solveState: SolveState;
  boardGeneration: number;
  /** The sub-grid edge for the hand-drawn grid + ghost rects: Sudoku passes `size` (3×3
   *  bands), Futoshiki passes `boardSize` (a plain Latin grid — the ghost geometry is
   *  subgrid-independent, so it only keys the LRU cache). The furniture divergence the
   *  spec names (subgrid lines vs none). */
  subgridSize: number;
  /** The grid's ARIA label — game-specific text ("N by N sudoku board, medium" /
   *  "N by N futoshiki board"); the difficulty word folds in game-side. */
  gridLabel: string;
  /** The teacher's-red-pencil derivation over `values` — per-game adjacency closed over
   *  (Sudoku boxes / Futoshiki inequalities). Gated by `conflictsVisible` below. */
  conflictsFn: (values: Record<string, number>, boardSize: number) => Conflicts;
  /** The peer-unit set for the focused cell's selection wash — Sudoku adds its box band,
   *  Futoshiki is a plain Latin square (row/col only). Returns the peers minus the focused
   *  cell; the shell gates it on the grid actually holding focus. */
  peersFn: (focusedPos: number, boardSize: number) => Set<string>;
  /** The fresh-board margin announce ("a fresh 9×9 — medium" / "a fresh 5×5").
   *  Game-side so the difficulty request voice + the one-shot link-error clause
   *  stay per-game; called by the shell at the deferred/live announce moments. */
  freshBoardCopy: () => string;
  /** T7-W7 — the generation bump's PROVENANCE: true iff this board arrived from a deal.
   *  A no-givens family (KenKen prints no digit on 69% of deals) reaches the generation
   *  watch with an empty grid, and a dealt empty grid and a wiped one are the same pixels
   *  — so the receipt cannot be read off the board. The model can tell them apart: it
   *  grades every dealt board and blanks that grade on clear/restore, and `dealt` carries
   *  that bit here. Absent → the pre-T7 read (an empty grid is taken for a clear). */
  dealt?: boolean;
  /** Sudoku-only (UI-13): the once-per-board discoverability whisper. Receives the live
   *  values + boardSize, returns the copy iff a duplicate is visibly present while idle,
   *  else null. Absent for Futoshiki → the shell's idle-values watch no-ops. */
  idleGradeHint?: (values: Record<string, number>, boardSize: number) => string | null;
  /** Engine-domains pencil marks (peek glimpse): per-position surviving candidates from the
   *  solver's own propagation. Opt-in (held only), released row-by-row on idle at ≥10-wide. */
  pencilMarks?: Record<string, number[]>;
  /** Stats from the last completed solve — the margin tally (MarginNote meta). */
  solveStats?: SolveStats | null;
  /** Optional typed error code (SolverErrorCode) for the paper-note copy. Absent → the
   *  default 'error' cause (BUDGET_EXCEEDED). */
  errorCode?: string;
  /** F6 page-turn (T3-W10): true while this scene is switch-away's outgoing exercise —
   *  routes the grid through the erase beat and fades glyphs + marginalia; on erase
   *  completion the board emits `erased` (the seam) instead of redrawing. */
  leaving?: boolean;
  /** T4-W7 — the armed hint's reasoning: highlights `becauseCells` in the peek-laminate
   *  tone and writes the technique name in the margin. Null between hint transactions. */
  hint?: HintResult | null;
  /** T4-W8 ROW 2 — the error-check mode's PROACTIVE display gate. ORed with the
   *  `solveState === 'failed'` grade below: the teacher's red pencil grades actual work
   *  regardless; the mode governs only the live cadence. */
  proactiveErrorCheck?: boolean;
  /** T4-WU race gate — true while a board op (generate/solve) is in flight. Gates keyboard
   *  Cmd/Ctrl+Z on the same signal the coarse buttons honor (`:disabled="loading"`). */
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "updateCell", position: number, value: number): void;
  (e: "retry"): void;
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "hint", position: number): void;
  (e: "erased"): void;
  /** A cell authored a user mark (digit toggles, 0 erases); forwarded to the game's store. */
  (e: "mark", position: number, value: number): void;
  /** The bare-'P' keyboard toggle cycles the pencil mode (off→corner→center). */
  (e: "cyclePencilMode"): void;
  /** Long-press peek: a cell's hold activates the game's marks glimpse (marks-only). */
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
  generateCellRects(props.boardSize, props.subgridSize, VIEWBOX_SIZE, 42),
);

// ── Marks idle-chunk gate (T3-W8, G7 R-7) ────────────────────────────
// Holding K populates pencilMarks for every empty cell in one shot. At 16×16 that's ~2,700
// mark nodes mounting synchronously — a felt hitch. We release marks row-by-row on idle
// (requestIdleCallback, rAF fallback) so the peek reads as a fast top-down ripple — in the
// pencil grammar — instead of one blank hold. Small boards (below 10, Futoshiki's whole 4–7
// range and Sudoku's 4×4/9×9) and reduced-motion both render instantly: no ripple, no
// regression. `marksFor` gates each cell's marks on its row having been released; clearing
// (K up) resets the gate immediately.
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
// and land in the settle's ONE layout step, never a tween. (The lg rung is
// Sudoku's 16×16-only reach; Futoshiki's 4–7 boards land on sm/md, byte-identical
// to its former 2-rung classes.)
// T4-P1 mark 6 — THE STACKED REGIME GETS A HEIGHT BOUND, and it is the SAME GUTTER the width
// arm already uses. It had a width bound and none on height: at 844×390 the 9×9 shell asked for
// `min(42rem, 100vw − 1.5rem)` = 672px of board inside a 390px viewport, so the BOARD ITSELF
// did not fit the screen — the worst mobile number in the estate, and the "<lg board rung"
// F3's pass-1 critique named as required and left undesigned.
//
// The pass-3 cure was to unprefix the ROW regime's own `100dvh − 10rem`, and it was priced by
// nobody: that cap allows 10rem for chrome that below 1024 is not beside the board, so the
// landscape 9×9 fell to a 230px board — a 25.11px CELL, 43% under the estate's 44px coarse
// floor and 38% under what the same phone shows in PORTRAIT. Pass 4 measured the whole ladder
// on a built dist, both engines identical, at 844×390 (rig `pass4/rigF3/landladder.mjs`):
//
//   cap             board  cell    fits   pageVh   board-top→first chip   foldOverflow*
//   none (pre-P3)     672  74.22  false    3.667   841.27                 392.58
//   100dvh − 10rem    230  25.11   true    2.533   399.27   ← pass 3's rung      0
//   100dvh − 4rem     326  35.77   true    2.779   495.27                  46.58
//   100dvh − 1.5rem   366  40.22   true    2.882   535.27   ← SHIPPED        88.58
//   100dvh            390  42.88   true    2.944   559.27   ← whole short edge  110.58
//
// *T5-W4c added the fold column, because it is the ONE dimension the ladder never priced and
// the renamed gate ("a board no larger than the screen it is drawn on" = height ≤ innerHeight)
// is satisfied at every rung above, including the two that put a third of the board under the
// fold. `.board-cells` referent, chromium, this pass's build (`pass5/f3/rig/landladder.mjs`);
// the drawn-frame referent runs 2px higher (see the box table below). It is now a GATE, with a
// real bound: `board-covisibility.spec.ts` pins the shipped rung's overflow and REDS on the
// `100dvh` rung — the election can no longer drift a cap without a red.
//
// So: the 44px floor is UNREACHABLE at 844×390 by any cap — a 9×9 at 44px cells is a 400px
// board and the viewport is 390 tall. The floor is a CONTROL tap-target rule (`.ctrl-btn`
// coarse min-height) and has never bound a board cell: this estate ships 40.22px cells at
// 390 portrait and 32.44 at 320. And landscape CO-VISIBILITY, the thing pass 3's rung was
// reaching for, costs a 24.08px cell (the chip needs the board under 220.73) — it was never
// 9.27px away from anything a finger could use.
//
// `100dvh − 1.5rem` is the honest form because it is not a tuned number: it is the page's own
// gutter, the constant the WIDTH arm spends. Board = the SHORT EDGE minus the gutter, capped
// at the rung — so a rotation cannot change the cell. 844×390 lands 40.22, byte-identical to
// the 390-wide portrait cell of the same phone; 926×428 lands 44.44 and clears the coarse
// floor outright; 740×360 lands 36.88, its own portrait cell. Inert at every portrait cell
// (390×844, 390×664, 320×568, 820×1180 all read identically with the cap on or off).
//
// WHAT IT COSTS, disclosed rather than discovered later: pass 3's 230px board fitted WHOLE
// above the fold at 844×390 (bottom 342.58 of 390) and this one does not — the last two rows
// are a scroll away at rest. The page is 2.533 → 2.882 viewports.
//
// T5-W4c (pass 5) — THE OVERFLOW NOW NAMES ITS BOX AND ITS ENGINE, which is the correction the
// row actually needed. Three numbers were in the record for one quantity because three boxes
// were being measured and none of them was named. Re-derived on this pass's build, 844×390,
// shipped cap, both engines (`pass5/f3/rig/foldref.mjs`, `logs/foldref.log`) — and reproduced
// byte-for-byte on the pre-collapse dist as the build control:
//
//   box                        chromium            webkit
//   .board-cells (the grid)    86.58               85.98
//   .board-wrapper (the frame) 88.58  ← the comment's number, and it is RIGHT
//   .board-wrapper                                 87.98
//   .board-shell / peek-host   119.06              118.44   (board + mark 6's reserved line)
//
// So the shipped 88.58 is CORRECT for chromium at the `.board-wrapper` referent — pass 4's own
// `logs/F3/masthead-844x390.log` reads `boardBottom 478.58` against `vh 390`, and this pass
// reads 478.58 again. The pass-4 registry's F3-G4 correction (`90.58 / 89.98`) is exactly
// +2.00px on BOTH engines against every box in the table and does not reproduce at any referent;
// it is routed back to the adjudicator rather than copied into this file, because writing an
// unreproducible number here is the defect the row exists to fix. The honest engine pair is
// 88.58 chromium / 87.98 webkit, and the box is the drawn frame.
//
// That loss was taken deliberately and then REDEEMED: pass 6 executed the named cure (the
// masthead move at 844×390 — the chrome above the board fell 114.58 → 16px), and at head the
// drawn frame sits WHOLE above the fold, overflow 0 both engines
// (`e2e/board-covisibility.spec.ts`, the fold-overflow gate; restamped at the pass-6 seal,
// L6-G1). The 88.58/114.58 arithmetic above is the pre-move pricing, kept as the derivation
// that chose the cure. Landscape's defect WAS the masthead, which is what pass 3's §5 said in
// words; the pixels are now attached to the fix, not the debt. CH-39's owner eye remains the
// closure leg — this comment records geometry, not the mark's closure.
// `lg:` restores the row regime's 10rem verbatim — at 1280×800 the golden board is 640 with
// it and 672 without, so the cap at ≥1024 is a golden subject and is not touched.
// A media cap is not a gesture: it bakes at load and rotate, so it costs nothing against the
// pass-3 stall lane's per-gesture re-bake.
const boardSizeClasses = computed(() => {
  if (props.boardSize <= 4)
    return "shell-sm w-[min(26rem,calc(100vw-1.5rem))] max-w-[calc(100dvh-1.5rem)] lg:max-w-[calc(100dvh-10rem)] lg:w-[min(26rem,85vw)]";
  if (props.boardSize <= 9)
    return "shell-md w-[min(42rem,calc(100vw-1.5rem))] max-w-[calc(100dvh-1.5rem)] lg:max-w-[calc(100dvh-10rem)] lg:w-[min(42rem,85vw)]";
  return "shell-lg w-[min(52rem,calc(100vw-1.5rem))] max-w-[calc(100dvh-1.5rem)] lg:max-w-[calc(100dvh-10rem)] lg:w-[min(52rem,90vw)]";
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
// The SAME pure derivation over `values` (per-game adjacency closed over), un-gated from the
// 'failed'-only gate: it feeds the cells (aria-invalid + the red ghost) + the marginalia (the
// row to check) at the chosen cadence. `solveState === 'failed'` (the teacher grading actual
// work) is ORed with the mode's proactive display. Event-driven (a value mutation), never the
// boil beat, so live adds ZERO idle paints — the E7 idle-paint invariant holds by construction.
const conflictsVisible = computed(
  () => props.solveState === "failed" || props.proactiveErrorCheck === true,
);
const conflicts = computed<Conflicts>(() =>
  conflictsVisible.value
    ? props.conflictsFn(props.values, props.boardSize)
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
// reveal window is ~1.2s at every board size instead of the old fixed 15ms/cell.
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
// the composition (star, heart, vignette) survives any remount while solved. Only the
// murmur SEED stays on the transition edge (a fresh crest seeds a fresh classroom; a
// remount must not reseed). The `flourish` inject is provided game-side (slotted cells/
// caret resolve inject against their own scene, not this shell).
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
  notifyUserEdit(); // the page is being written on — hold the murmur this window (§1.3)
  emit("updateCell", pos, value);
}
function onMark(pos: number, value: number) {
  emit("mark", pos, value);
}
function onPeekStart() {
  emit("candidatePeekStart");
}
function onPeekEnd() {
  emit("candidatePeekEnd");
}

// ── ARIA grid + roving tabindex (§4.1) ───────────────────────────────
// One Tab stop for the whole board; Arrow keys move cell focus, Home/End to row ends,
// Ctrl+Home/End to board corners. Exactly one cell carries tabindex 0 at a time.
const focusedPos = ref(0);
const cellApi = new Map<number, { focus: () => void }>();
// T4-W10 idiom (§:ref) — a STABLE bound handler, not a per-render inline closure. The cell
// exposes its own `position` (defineExpose), so the map keys off the instance rather than a
// captured index — ref identity is stable across renders, and the {0..totalCells-1} → {focus}
// slot map is byte-identical.
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
// Gated on the board actually HOLDING focus (`unitFocused`) so a fresh load — focusedPos 0
// with nothing selected — washes nothing; focusin/focusout on the grid track it (a cell→cell
// arrow keeps focus WITHIN the grid, tabbing to a control drops it). The per-game `peersFn`
// owns the geometry (Sudoku's box band vs Futoshiki's plain Latin square) and excludes the
// focused cell itself (it carries its own ghost).
const unitFocused = ref(false);
function onGridFocusin() {
  unitFocused.value = true;
}
function onGridFocusout(e: FocusEvent) {
  const grid = e.currentTarget as HTMLElement;
  const next = e.relatedTarget as Node | null;
  if (!next || !grid.contains(next)) unitFocused.value = false;
}
const peerCells = computed(() =>
  unitFocused.value
    ? props.peersFn(focusedPos.value, props.boardSize)
    : new Set<string>(),
);

// T4-WM §2 — the hint act, factored so the ControlPanel's Hint button and the board's H key
// share ONE path: both reveal the currently focused cell. On coarse the last tap sets
// focusedPos, and it survives the button tap, so tapping Hint reveals the cell you last
// touched. Exposed because the panel is the board's SIBLING, not its child.
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
    // macOS); a plain 'z' falls through unhandled so it's never swallowed. Shift → redo.
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
// The cells the argument turns on, highlighted in the peek-laminate tone (the cell's
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
        if (props.solveState === "solving") setMargin("still solving…", "graphite");
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

// ── UI-13 (ratified: KEEP grade-after-Solve + say-it) — Sudoku-only via `idleGradeHint` ──
// The teacher still grades actual work — `conflicts` above stays gated on 'failed'. What was
// missing is discoverability: a fresh user doesn't know the grader exists. The first time a
// duplicate is visibly present while idle, the margin voice whispers that it does — once per
// board, graphite (never the red verdict tone), and it marks NOTHING. The per-game hook reads
// the values (a read-only peek used solely to decide whether to speak); Futoshiki omits it.
const gradeHintShown = ref(false);
watch(
  () => props.values,
  () => {
    if (!mounted || gradeHintShown.value || !props.idleGradeHint) return;
    if (props.solveState !== "idle") return; // a real grade owns the voice; don't talk over it
    const copy = props.idleGradeHint(props.values, props.boardSize);
    if (copy) {
      gradeHintShown.value = true;
      setMargin(copy, "graphite");
    }
  },
  { deep: true },
);

// ── The drawer's margin voice (T3-W12 §6): hint once, ever, on the first close —
// "the controls are under the board". Graphite-only window: a gold/red note is a
// grade mid-speech (and the gold verdict feeds the vignette) — don't talk over it,
// and don't burn the once-flag (consumeDrawerHint is only called inside the guard).
const { drawerOpen } = useControlsDrawer();
watch(drawerOpen, (open, prev) => {
  if (prev && !open && marginTone.value === "graphite" && consumeDrawerHint()) {
    setMargin("the controls are under the board", "graphite");
  }
});

// Board-load announcements (also fixes the silent randomize, §4.3).
let mounted = false;
let prevBoardSize = props.boardSize;
// UI-11 race guard: the initial randomize is async, so its givens 0→N can land in the tiny
// window between this watch registering and onMounted. Announcing pre-mount would set the
// text before the live region is in the DOM — so we DEFER: stash the copy and flush it as a
// post-mount mutation in onMounted. A restored board never trips this — restore sets the
// givens synchronously at composable setup, before this watch registers, so no 0→N ever fires.
let pendingFreshAnnounce: string | null = null;
watch(
  () => props.givenCells.size,
  (n, prev) => {
    // Givens populate (0 → N) on randomize / initial fetch — a fresh puzzle arrived.
    if (n > 0 && (prev ?? 0) === 0 && props.solveState !== "solved") {
      if (mounted) setMargin(props.freshBoardCopy(), "graphite");
      else pendingFreshAnnounce = props.freshBoardCopy(); // flushed in onMounted
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
    // A size change is announced by the givens 0→N watch instead, so skip it here.
    if (!mounted || sizeChanged) return;
    // A board that arrived WITH givens is the 0→N watch's to announce.
    if (props.givenCells.size > 0) return;
    // T7-W7 — the wipe receipt used to be the whole of this branch, on the reasoning that a
    // same-size bump leaving no givens could only be a clear (§5.3). That reasoning holds for
    // the games that print givens and fails outright for the ones that don't: every KenKen
    // deal that prints no digit — 69% of them — announced "the board is clear" for a board
    // nobody had cleared. The act decides the receipt now, not the emptiness:
    //   · dealt → the no-givens family's fresh line, the same voice every other deal gets.
    //   · not dealt, and the grid is genuinely blank → the wipe receipt.
    // Anything else (a restored link with work on it, say) keeps its peace.
    if (props.dealt) setMargin(props.freshBoardCopy(), "graphite");
    else if (boardIsBlank()) setMargin("the board is clear", "graphite");
  },
);

/** Every cell empty — a clear's own signature, and the second half of the wipe gate. */
function boardIsBlank(): boolean {
  return Object.values(props.values).every((v) => !v);
}

// ── The paper note (§5.2) ────────────────────────────────────────────
const showErrorNote = computed(() => props.solveState === "error");
const errorNote = computed(() => {
  if (props.errorCode) {
    const f = classifyCode(props.errorCode);
    if (f.kind === "paper-note") return { text: f.message, retryable: f.retryable };
  }
  // The default 'error' cause on the Worker (W6) path is BUDGET_EXCEEDED.
  return { text: PAPER_NOTE_COPY.budget, retryable: true };
});

// ── The tally (T3-W9 §2) — preformatted upstream, rendered by MarginNote's meta line ──
// T6 mark 16 — and DEBUG ink, so it flows through the one gate. This is the single point
// all tally string-making passes: both mounts below guard on `v-if="meta"`, and `""` is
// already the formatter's own idle value for null stats, so the flag off unmounts the line
// in every game, at every width, on the solved and the failed grade alike.
const debug = useDebug();
const tally = computed(() => (debug.value ? formatSolveTally(props.solveStats) : ""));

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
// (easeInCubic, the "leave the page" curve) via the same state machine the boardGeneration
// cycle already drives. If a mid-erase re-select cancels the page-turn (`leaving` drops
// while we sit erased), the exercise redraws itself.
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
      <!-- Hand-drawn SVG grid overlay — subgridSize keys the box lines (Sudoku bands /
           Futoshiki plain Latin). -->
      <HandDrawnGrid
        :board-size="boardSize"
        :subgrid-size="subgridSize"
        :anim-state="gridAnimState"
        :progress="fillProgress"
        :solve-success="solveState === 'solved'"
        @animation-complete="onGridAnimComplete"
      />

      <!-- Interactive cell grid. The shell owns the grid container (ARIA, roving
           tabindex, focus tracking); the game fills it with its own cell component via
           the scoped slot, fed the shell's per-cell derived state. -->
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
        <slot
          name="cells"
          :set-cell-api="setCellApi"
          :is-revealed="isRevealed"
          :conflicts="conflicts"
          :hint-because="hintBecause"
          :peer-cells="peerCells"
          :noise-delays="noiseDelays"
          :focused-pos="focusedPos"
          :cell-rects="cellRects"
          :marks-for="marksFor"
          :on-cell-update="onCellUpdate"
          :on-mark="onMark"
          :on-cell-focus="onCellFocus"
          :on-peek-start="onPeekStart"
          :on-peek-end="onPeekEnd"
        />
      </div>

      <!-- Overlay furniture (Futoshiki's caret layer over the cells); empty for Sudoku. -->
      <slot name="overlay" />

      <!-- The star BLOOMS over the whole board (T6 mark 14) — small at 2.05s, grown to
         the square by the crest, outline flashed, gone by 3.19s. Absolute inside the
         wrapper, so the page never moves for it; unfiltered, so the census never sees
         it. The corner sticker is the same component's other instance, in the vignette. -->
      <CelebrationStar :active="celebrating" bloom />

      <!-- The felt heart (T3-W9, F2-C/F7 §3.2) — the Heart Fruit crests the board's
         bottom-right corner at the star's moment, diagonal opposite of the margin
         voice. Anchored to the square itself (the sticker register). -->
      <CelebrationHeart :active="celebrating" />
    </div>

    <!-- The grade in the margin (T3-W12 §1 R1): the completion moment's visual home —
         star at grading-sticker scale + verdict + one-line tally beside the work, in
         the teacher's margin. aria-hidden decoration: the strip's live region below
         still announces the grade. Anchored to the board-shell so it travels with the
         board's drawer transform (§6 interplay); drawer-open below ~1360 the margin is
         too narrow for the full vignette — it takes the corner-press rung early
         (`docked`, the §6 hook). -->
    <CompletionVignette
      :active="celebrating"
      :text="marginText"
      :meta="vignetteHasTally ? tally : undefined"
      :docked="vignetteDocked"
    />

    <!-- Below-board margin: the status voice + the paper note (§4.3, §5.2). Two distinct
         live regions — marginalia (role=status, polite; the page on the puzzle) and the
         error card (role=alert; broken machinery). A sibling of the board square (H9):
         in flow when stacked, overlay in the row regime. R1: while the vignette carries
         the gold verdict, the strip goes visually quiet (sr-only — still announcing) so
         the gold path renders NOTHING below the board; graphite/teacher-red/error keep
         the strip exactly as before. -->
    <!-- T4-P1 mark 6 — the DIFFICULTY tally has LEFT this strip for the ticket's deal row.
         It was the strip's only permanent tenant: the voice reserves one line and the error
         card is conditional, but the tally rendered on every board at every width, and below
         1024 this strip is IN FLOW, so it was 30.4px of standing height between the work and
         the controls on every phone. Difficulty is a fact of the DEAL, so it files with the
         deal (`GameControlPanel` `.deal-row`) and the strip goes back to being what it is:
         the page's voice, and the note when the machinery breaks. -->
    <!-- T4-P1 pass 4 — THE TALLY LINE HAS ONE HOME AT A TIME. `quiet` moves the VOICE to the
         sticker, not the strip: below 1280 (and drawer-docked under 1360) the sticker is
         7–8rem of star + verdict with no room for a tally, so the tally stays here, on the
         line the strip already reserves. Handing the same string to both mounts would print
         it twice at ≥1280; handing it to neither — which is what shipped at the pass-3 close
         — printed it nowhere below 1280 on every solved board. `vignetteHasTally` is the one
         ref both mounts read. -->
    <div class="board-margin">
      <MarginNote
        :text="marginText"
        :tone="marginTone"
        :meta="celebrating && vignetteHasTally ? undefined : tally"
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
   keeps even a stray class-flip instant there. (The caret layer's own leave rule lives
   in the Futoshiki board's scope, where the caret-layer element is rendered.) */
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
   tween, the §6 binding constraint). The shell-lg rung is Sudoku's 16×16-only reach.
   The WIDTH arm rides every height: below the height gate the 10rem cap is the smaller
   number at every rung, so it binds and the widened allowance never renders. */
@media (min-width: 1024px) {
  html.drawer-closed .board-shell.shell-sm {
    width: min(28rem, 85vw);
  }

  html.drawer-closed .board-shell.shell-md {
    width: min(46rem, 85vw);
  }

  html.drawer-closed .board-shell.shell-lg {
    width: min(56rem, 90vw);
  }
}

/* ── …AND THE HEIGHT ARM IS HEIGHT-AWARE (T7-W7, the closed-pose residue) ──────────────────
   PAIRED WITH `html.drawer-closed .masthead { --logo-scale: 1.05 }` in App.vue — the two halves
   of the closed grow, and they flip on the SAME condition or the pose trades one overflow for
   another. Plain CSS has no shared custom media, so that condition is duplicated there verbatim
   with a cross-reference back to this block; edit neither alone. (The estate's pair idiom, as
   SheetWashiLabel and its z-order sibling cite each other.)

   THE 896px IS DERIVED, not chosen. Closed, the desk asks the page's height for four authored
   things, and the page supplies exactly its own height:

     masthead at --logo-scale: 1.05    124.53   measured, invariant across width; webkit 123.94
     board                             min(46rem, 100dvh − 9rem)   ← the 9×9 rung, the desk's own
     .board-margin margin-top            6.40   0.4rem, authored above
     the strip's one caption line      ≤ 28.60   --type-body's own ceiling 1.375rem × leading 1.3
                                                 (typography.css) — so this term is width-free

   The column centres in `.page-root`'s content box, so an over-tall column hangs HALF above the
   fold and half below: overflow = (demand − vh) / 2, and the masthead's box top is −that (which
   is why the two numbers are always the same 5–6px, opposite signs). While the dvh cap binds,
   demand − vh = noteH − 13.07 — POSITIVE AT EVERY HEIGHT: no page is ever tall enough to pay for
   a cap that grows with it, which is the whole reason 1366×768 / 1280×720 / 1024×768 / 1280×800
   all overflow and none of them is a width problem. The pose can only come clean where the WIDTH
   rung binds instead:

     demand ≤ vh   ⇔   124.53 + 736 + 6.4 + noteH ≤ vh   ⇔   vh ≥ 866.93 + noteH

   At the type ceiling that is 895.53 → 896px, width-independent by construction (85vw exceeds
   46rem at every viewport this regime covers, so the 736 always binds). Measured on both sides
   of the boundary: 1280×800 asks 810.54 of 800 — over by 10.54, the 5–6px — and 1440×900 asks
   891.12 of 900, under by 8.88, predicting a masthead box top of +4.44 against a surface that
   reads +4.45 chromium / +4.75 webkit. BELOW the gate the closed pose takes the open pose's
   geometry exactly (masthead 118.92, cap 10rem) and asks vh − 34.68 + noteH, clean at every
   height by the same ceiling. Both sides of the flip are clean; that is the property this number
   was solved for, not the number itself.

   THE OTHER TWO RUNGS by the same arithmetic, since one condition governs all three: shell-sm's
   own threshold is 607.53 (28rem), so gating it costs a 4×4 desk nothing above 608 — there the
   10rem cap already exceeds 448 and the width rung binds either way — and it cures 1024×600.
   shell-lg's is 1055.53 (56rem), so a 16×16 desk above 896 keeps a residue of the same shape;
   measured, disclosed and NOT claimed cured in `evidence/w7/closed-pose-cure.md`. */
@media (min-width: 1024px) and (min-height: 896px) {
  html.drawer-closed .board-shell.shell-sm,
  html.drawer-closed .board-shell.shell-md,
  html.drawer-closed .board-shell.shell-lg {
    max-width: calc(100dvh - 9rem);
  }
}
</style>

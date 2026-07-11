<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import SudokuCell from './SudokuCell/SudokuCell.vue'
import SolverErrorNote from './SolverErrorNote.vue'
import { HandDrawnGrid } from '@pencil/grid'
import CelebrationStar from '@pencil/chrome/CelebrationStar.vue'
import CelebrationHeart from '@pencil/chrome/CelebrationHeart.vue'
import MarginNote from '@pencil/chrome/MarginNote.vue'
import { mulberry32 } from '@mkbabb/pencil-boil'
import { generateCellRects } from '@pencil/grid/gridPaths'
import { revealStaggerMs } from '@pencil/config/pencilConfig'
import { setMurmurSeed, notifyUserEdit, resetMurmur } from '@pencil/composables/celebration'
import { findConflicts } from './conflicts'
import { classifyCode, PAPER_NOTE_COPY } from '@games/sudoku/solver/classifyError'
import { BOARD_CELLS_CLASS } from '@games/shared/constants'
import { formatSolveTally } from '@games/shared/solveTally'
import type { Difficulty, SolveState, SolveStats } from '@games/sudoku/types'
import type { AnimationState } from '@pencil/types'

const props = defineProps<{
  size: number
  boardSize: number
  totalCells: number
  values: Record<string, number>
  givenCells: Set<string>
  overriddenCells: Set<string>
  animatingCells: Set<string>
  solveState: SolveState
  solvedValues: Record<string, number>
  boardGeneration: number
  /** Optional — enriches the grid a11y label + marginalia ("a fresh 9×9, medium").
   *  Wired by the union lane (see fictions-a11y report §insertion-specs). */
  difficulty?: Difficulty
  /** Optional typed error code (SolverErrorCode) for the paper-note copy.
   *  Absent → the default 'error' cause (BUDGET_EXCEEDED) copy. Wired by the union lane. */
  errorCode?: string
  /** Stats from the last completed solve — the margin tally (MarginNote meta, pencil
   *  hand, understated). Null whenever the grade is idle; the composable owns the
   *  lifecycle. */
  solveStats?: SolveStats | null
  /** Engine-domains pencil marks (W6 beat 9): per-position surviving candidates
   *  from the solver's own propagation. Populated only while the peek gesture is
   *  held (opt-in — never ambient); only positions where propagation actually
   *  pruned something are present. */
  pencilMarks?: Record<string, number[]>
  /** F6 page-turn (T3-W10): true while this scene is switch-away's outgoing exercise.
   *  Routes the grid through the EXISTING erase beat and fades glyphs + marginalia;
   *  on the erase's completion the board emits `erased` (the seam) instead of redrawing. */
  leaving?: boolean
}>()

const emit = defineEmits<{
  (e: 'updateCell', position: number, value: number): void
  (e: 'retry'): void
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'hint', position: number): void
  (e: 'erased'): void
}>()

const gridTemplateColumns = computed(() => `repeat(${props.boardSize}, minmax(0, 1fr))`)

// Pre-computed ghost rect paths in board viewBox coordinates (1000×1000).
// generateCellRects emits ONLY the ghost half (the frame/line pass is dead weight for
// this consumer) and is LRU-backed (T3-W8) — a 9→16→9 round-trip is a cache hit, not a
// 256-rect regen on the switch's synchronous main-thread burst.
const VIEWBOX_SIZE = 1000
const cellRects = computed(() =>
  generateCellRects(props.boardSize, props.size, VIEWBOX_SIZE, 42)
)

// ── Marks idle-chunk gate (T3-W8, G7 R-7) ────────────────────────────
// Holding K populates pencilMarks for every empty cell in one shot. At 16×16 that's ~2,700
// mark nodes mounting synchronously — a felt hitch. We release marks row-by-row on idle
// (requestIdleCallback, rAF fallback) so the peek reads as a fast top-down ripple — in the
// pencil grammar — instead of one blank hold. Small boards (9×9 free already) and reduced-
// motion both render instantly: no ripple, no regression. `marksFor` gates each cell's marks
// on its row having been released; clearing (K up) resets the gate immediately.
const MARKS_CHUNK_MIN_BOARD = 10 // boards below this render marks all at once
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null
const revealedMarkRows = ref(0)
let marksIdleHandle: number | null = null

const scheduleIdle: (cb: () => void) => number =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? (cb) => (window as unknown as { requestIdleCallback: (c: () => void) => number }).requestIdleCallback(cb)
    : (cb) => requestAnimationFrame(() => cb())
const cancelIdle = (h: number) => {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    ;(window as unknown as { cancelIdleCallback: (h: number) => void }).cancelIdleCallback(h)
  } else {
    cancelAnimationFrame(h)
  }
}
function stopMarksReveal() {
  if (marksIdleHandle !== null) {
    cancelIdle(marksIdleHandle)
    marksIdleHandle = null
  }
}

const hasMarks = computed(
  () => !!props.pencilMarks && Object.keys(props.pencilMarks).length > 0,
)
watch(hasMarks, (has) => {
  stopMarksReveal()
  if (!has) {
    revealedMarkRows.value = 0 // K released — clear the gate at once
    return
  }
  // Small board or reduced-motion: everything at once, no ripple.
  if (props.boardSize < MARKS_CHUNK_MIN_BOARD || prefersReducedMotion?.matches) {
    revealedMarkRows.value = props.boardSize
    return
  }
  revealedMarkRows.value = 0
  const step = () => {
    revealedMarkRows.value = Math.min(revealedMarkRows.value + 1, props.boardSize)
    marksIdleHandle = revealedMarkRows.value < props.boardSize ? scheduleIdle(step) : null
  }
  marksIdleHandle = scheduleIdle(step)
})

function marksFor(pos: number): number[] | undefined {
  const m = props.pencilMarks?.[String(pos)]
  if (!m) return undefined
  return Math.floor(pos / props.boardSize) < revealedMarkRows.value ? m : undefined
}

// R3: the viewport-share/dvh caps ride the row regime, which now starts at lg: —
// iPad-portrait (768) stacks, so the stacked width formula governs there (the md:
// 85vw board under-filled the 42rem mobile controls card by ~19px at 768).
const boardSizeClasses = computed(() => {
  if (props.boardSize <= 4) return 'w-[min(26rem,calc(100vw-1.5rem))] lg:w-[min(26rem,85vw)] lg:max-w-[calc(100dvh-10rem)]'
  if (props.boardSize <= 9) return 'w-[min(42rem,calc(100vw-1.5rem))] lg:w-[min(42rem,85vw)] lg:max-w-[calc(100dvh-10rem)]'
  return 'w-[min(52rem,calc(100vw-1.5rem))] lg:w-[min(52rem,90vw)] lg:max-w-[calc(100dvh-10rem)]'
})

const boardClasses = computed(() => {
  const base = 'transition-all duration-500'
  if (props.solveState === 'solved') return `${base} solve-success`
  if (props.solveState === 'failed') return `${base} solve-failure`
  return base
})

// ── Conflict detection — the teacher's red pencil (§1.4) ──────────────
// Only while the solve is graded 'failed' (the teacher grades actual work); a pure
// derivation over `values`, fed to the cells as `aria-invalid` + the red ghost mark
// and to the marginalia as the row to check.
const conflicts = computed(() =>
  props.solveState === 'failed'
    ? findConflicts(props.values, props.boardSize, props.size)
    : { positions: new Set<string>(), firstRow: null },
)

// Beat 1 — the reveal wave. Noise-order stagger (Fisher-Yates + mulberry32), but
// board-normalized (design §1.3): stagger = clamp(round(1200 / blankCount), 4, 24) so the
// reveal window is ~1.2s at every board size instead of the old fixed 15ms/cell (which ran
// ~0.75s on a 9×9 but ~3s on a full 16×16 — outstaying its welcome exactly when the board is
// most impressive).
const noiseDelays = computed(() => {
  const delays = new Map<string, number>()
  const cells = Array.from(props.animatingCells)
  if (cells.length === 0) return delays

  const stagger = revealStaggerMs(cells.length)

  // Fisher-Yates shuffle with seeded RNG
  const rng = mulberry32(cells.length * 17 + 7)
  const shuffled = [...cells]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  for (let i = 0; i < shuffled.length; i++) {
    delays.set(shuffled[i], i * stagger)
  }
  return delays
})

// Celebration trigger (design §1.3: the trigger lives on the board; the skin owns the beats).
// A solve success with newly-filled cells crests the gold-star garnish; an idempotent re-solve
// (zero new cells) skips the fanfare — the grid recolor carries it.
const celebrating = ref(false)
watch(
  () => props.solveState,
  (state, prev) => {
    if (state === 'solved' && prev !== 'solved' && props.animatingCells.size > 0) {
      setMurmurSeed(props.boardGeneration * 31 + 1)
      celebrating.value = true
    } else if (state !== 'solved') {
      celebrating.value = false
    }
  },
)
watch(
  () => props.boardGeneration,
  () => {
    celebrating.value = false
    resetMurmur()
  },
)

function onCellUpdate(pos: number, value: number) {
  notifyUserEdit() // the page is being written on — hold the murmur this window (§1.3)
  emit('updateCell', pos, value)
}

// ── ARIA grid + roving tabindex (§4.1) ───────────────────────────────
// One Tab stop for the whole board; Arrow keys move cell focus, Home/End to row ends,
// Ctrl+Home/End to board corners. Exactly one cell carries tabindex 0 at a time.
const DIFFICULTY_WORD: Record<Difficulty, string> = { EASY: 'easy', MEDIUM: 'medium', HARD: 'hard' }
const difficultyWord = computed(() => (props.difficulty ? DIFFICULTY_WORD[props.difficulty] : ''))
const gridLabel = computed(
  () =>
    `${props.boardSize} by ${props.boardSize} sudoku board${difficultyWord.value ? ', ' + difficultyWord.value : ''}`,
)

const focusedPos = ref(0)
const cellApi = new Map<number, { focus: () => void }>()
function setCellApi(pos: number, el: unknown) {
  if (el && typeof (el as { focus?: unknown }).focus === 'function') {
    cellApi.set(pos, el as { focus: () => void })
  } else {
    cellApi.delete(pos)
  }
}
function focusCell(pos: number) {
  const clamped = Math.max(0, Math.min(props.totalCells - 1, pos))
  focusedPos.value = clamped
  nextTick(() => cellApi.get(clamped)?.focus())
}
function onCellFocus(pos: number) {
  focusedPos.value = pos
}
function onBoardKeydown(e: KeyboardEvent) {
  const n = props.boardSize
  const pos = focusedPos.value
  const row = Math.floor(pos / n)
  const col = pos % n
  let handled = true
  switch (e.key) {
    case 'ArrowUp':
      focusCell(row > 0 ? pos - n : pos)
      break
    case 'ArrowDown':
      focusCell(row < n - 1 ? pos + n : pos)
      break
    case 'ArrowLeft':
      focusCell(col > 0 ? pos - 1 : pos)
      break
    case 'ArrowRight':
      focusCell(col < n - 1 ? pos + 1 : pos)
      break
    case 'Home':
      focusCell(e.ctrlKey ? 0 : row * n)
      break
    case 'End':
      focusCell(e.ctrlKey ? n * n - 1 : row * n + (n - 1))
      break
    // ── Bounded undo/redo (W6) — a sibling case, disjoint e.key from the K-peek
    // ('k'/'Escape') and Backspace/Delete layers. Gate on ctrlKey OR metaKey (Cmd on
    // macOS — the original native-undo phantom was reproduced via Cmd+Z); a plain 'z'
    // falls through unhandled so it's never swallowed. Shift → redo.
    case 'z':
    case 'Z':
      if (e.ctrlKey || e.metaKey) {
        if (e.shiftKey) emit('redo')
        else emit('undo')
      } else handled = false
      break
    // ── Hint tier (W6) — 'H' fills the focused cell from the peek cache (solver-ink).
    // Bare key only; a modified H (Ctrl/Cmd+H → browser history/hide) falls through.
    case 'h':
    case 'H':
      if (e.ctrlKey || e.metaKey) handled = false
      else emit('hint', focusedPos.value)
      break
    default:
      handled = false
  }
  if (handled) e.preventDefault()
}

// ── Marginalia — the status voice (§4.3) ─────────────────────────────
const marginText = ref('')
const marginTone = ref<'graphite' | 'teacher-red' | 'gold-star'>('graphite')
function setMargin(text: string, tone: 'graphite' | 'teacher-red' | 'gold-star') {
  marginText.value = text
  marginTone.value = tone
}

let slowSolveTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => props.solveState,
  (state) => {
    if (slowSolveTimer) {
      clearTimeout(slowSolveTimer)
      slowSolveTimer = null
    }
    if (state === 'solved') {
      setMargin('solved it!', 'gold-star')
    } else if (state === 'failed') {
      const c = conflicts.value
      setMargin(
        c.firstRow ? `not quite — check row ${c.firstRow}` : 'not quite — no solution from here.',
        'teacher-red',
      )
    } else if (state === 'solving') {
      // Fast solves (the common case) resolve well under 2.5s and never reach this (§5.1 tiers).
      slowSolveTimer = setTimeout(() => {
        if (props.solveState === 'solving') setMargin('still sharpening the pencil…', 'graphite')
      }, 2500)
    } else if (state === 'idle' && marginTone.value !== 'graphite') {
      // Stale-note clear (W6, verify-14's widening): once the grade reverts, the red
      // "check row N" AND the gold "solved it!" go stale by the same path — clear any
      // non-graphite tone. Graphite board-load copy is not a grade; it stays.
      setMargin('', 'graphite')
    }
    // 'error' — marginalia stays quiet; a network/server fault is the note card's
    // domain (role=alert), never the page commenting on the puzzle (§4.3).
  },
)

// Board-load announcements (also fixes the silent randomize, §4.3).
let mounted = false
let prevBoardSize = props.boardSize
watch(
  () => props.givenCells.size,
  (n, prev) => {
    if (!mounted) return
    // Givens populate (0 → N) on randomize / initial fetch — a fresh puzzle arrived.
    if (n > 0 && (prev ?? 0) === 0 && props.solveState !== 'solved') {
      setMargin(
        `a fresh ${props.boardSize}×${props.boardSize}${difficultyWord.value ? ', ' + difficultyWord.value : ''}`,
        'graphite',
      )
    }
  },
)
watch(
  () => props.boardGeneration,
  () => {
    focusedPos.value = 0
    const sizeChanged = props.boardSize !== prevBoardSize
    prevBoardSize = props.boardSize
    // A same-size generation bump that leaves the board empty is a clear (§5.3). A size
    // change is announced by the givens 0→N watch instead, so skip it here.
    if (!mounted || sizeChanged) return
    if (props.givenCells.size === 0) setMargin('a fresh page.', 'graphite')
  },
)

// ── The paper note (§5.2) ────────────────────────────────────────────
const showErrorNote = computed(() => props.solveState === 'error')
const errorNote = computed(() => {
  if (props.errorCode) {
    const f = classifyCode(props.errorCode)
    if (f.kind === 'paper-note') return { text: f.message, retryable: f.retryable }
  }
  // The default 'error' cause on the Worker (W6) path is BUDGET_EXCEEDED — the head-scratcher.
  return { text: PAPER_NOTE_COPY.budget, retryable: true }
})

// ── The tally (T3-W9 §2) — preformatted upstream, rendered by MarginNote's meta line ──
// The W6 derivation twins were deleted from both boards; formatSolveTally is the one home.
const tally = computed(() => formatSolveTally(props.solveStats))

// Grid animation state machine
const gridAnimState = ref<AnimationState>('hidden')

function onGridAnimComplete(state: 'drawn' | 'hidden') {
  if (state === 'drawn') {
    gridAnimState.value = 'drawn'
  } else if (state === 'hidden') {
    if (props.leaving) {
      // F6 beat 2 — the seam: the page is erased; App flips the v-if on this tick.
      emit('erased')
    } else {
      // After erase, redraw (the boardGeneration cycle)
      gridAnimState.value = 'drawing'
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
      gridAnimState.value = 'erasing'
    } else if (gridAnimState.value === 'hidden') {
      gridAnimState.value = 'drawing'
    }
  },
)

onMounted(() => {
  gridAnimState.value = 'drawing'
  mounted = true
})

onUnmounted(() => {
  if (slowSolveTimer) clearTimeout(slowSolveTimer)
  stopMarksReveal()
})

// On board generation change (size change, randomize, clear), erase and redraw
watch(
  () => props.boardGeneration,
  (_newVal, oldVal) => {
    if (oldVal === undefined) return // skip initial
    if (gridAnimState.value === 'drawn') {
      gridAnimState.value = 'erasing'
    } else {
      gridAnimState.value = 'drawing'
    }
  },
)

function isRevealed(pos: number): boolean {
  return props.animatingCells.has(String(pos))
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
      class="board-wrapper cartoon-shadow-md aspect-square w-full rounded-xl bg-card"
      :class="boardClasses"
    >
    <!-- Hand-drawn SVG grid overlay -->
    <HandDrawnGrid
      :board-size="boardSize"
      :subgrid-size="size"
      :anim-state="gridAnimState"
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
    >
      <SudokuCell
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
        :noise-delay="noiseDelays.get(String(pos - 1)) ?? 0"
        :board-size="boardSize"
        :subgrid-size="size"
        :row-index="Math.floor((pos - 1) / boardSize) + 1"
        :col-index="((pos - 1) % boardSize) + 1"
        :tab-index="pos - 1 === focusedPos ? 0 : -1"
        :ghost-path="cellRects[pos - 1] ?? ''"
        :marks="marksFor(pos - 1)"
        @update="onCellUpdate"
        @cell-focus="onCellFocus"
      />
    </div>

    <!-- The felt heart (T3-W9, F2-C/F7 §3.2) — the Heart Fruit crests the board's
         bottom-right corner at the star's moment, diagonal opposite of the margin
         voice. Anchored to the square itself (the sticker register). -->
    <CelebrationHeart :active="celebrating" />
    </div>

    <!-- Below-board margin: the status voice + the paper note (§4.3, §5.2). Two distinct
         live regions — marginalia (role=status, polite; the page on the puzzle) and the
         error card (role=alert; broken machinery). A sibling of the board square (H9):
         in flow when stacked, overlay in the row regime. -->
    <div class="board-margin">
      <!-- The completion block (T3-W9 §2): one grid composition — the foil sticker slot
           beside the text column (voice over meta), no absolutely-positioned strangers.
           The slot exists on the gold-star celebration only (no box when absent, so
           graphite/red states are visually identical to the slotless layout). -->
      <div class="completion-note">
        <!-- v-show (NOT v-if): the star must stay mounted so its `active` watch sees the
             false→true flip — a v-if slot would mount it with active already true and the
             draw-on would never fire. display:none = no box, so the absent state is
             layout-identical to a slotless margin. -->
        <div
          v-show="celebrating && marginTone === 'gold-star'"
          class="sticker-slot"
          aria-hidden="true"
        >
          <CelebrationStar :active="celebrating" />
        </div>
        <MarginNote :text="marginText" :tone="marginTone" :meta="tally" />
      </div>
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
  .board-leaving .board-margin {
    opacity: 0;
    transition: opacity 200ms cubic-bezier(0.32, 0, 0.67, 0);
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

/* The completion block (T3-W9 §2) — [sticker slot] beside [voice over meta], one
   composition in both layout regimes. The slot is 3.25rem (CelebrationStar fills it,
   in flow — the old overlay anchor is retired); when the slot isn't rendered the note
   auto-places into the first (auto) track, flush left, layout identical to today.
   The tally's tone/type/PRM rules live in MarginNote — the one home. */
.completion-note {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.5rem;
  align-items: start;
}

.sticker-slot {
  width: 3.25rem;
  height: 3.25rem;
}
</style>

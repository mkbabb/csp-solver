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
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import FutoshikiCell from './FutoshikiCell/FutoshikiCell.vue'
import FutoshikiCaret from './FutoshikiCaret/FutoshikiCaret.vue'
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
import { classifyCode, PAPER_NOTE_COPY } from '@games/futoshiki/solver/classifyError'
import { BOARD_CELLS_CLASS } from '@games/shared/constants'
import { formatSolveTally } from '@games/shared/solveTally'
import type { Inequality, SolveState, SolveStats } from '@games/futoshiki/types'
import type { AnimationState } from '@pencil/types'

const props = defineProps<{
  boardSize: number
  totalCells: number
  values: Record<string, number>
  givenCells: Set<string>
  overriddenCells: Set<string>
  animatingCells: Set<string>
  solveState: SolveState
  solvedValues: Record<string, number>
  boardGeneration: number
  /** Printed [greater, lesser] inequality furniture — drives the caret layer + a11y folding. */
  inequalities: Inequality[]
  /** Optional typed error code for the paper-note copy. Absent → default BUDGET_EXCEEDED copy. */
  errorCode?: string
  /** Stats from the last completed solve — the margin tally (MarginNote meta, pencil
   *  hand, understated). Null whenever the grade is idle; the composable owns the
   *  lifecycle. */
  solveStats?: SolveStats | null
  /** Engine-domains pencil marks (W6 beat 9): per-position surviving candidates
   *  from the solver's own propagation. Populated only while the peek gesture is
   *  held (opt-in — never ambient); only positions where propagation actually
   *  pruned something are present. Twin of SudokuBoard's (D16). */
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

// Pre-computed ghost rect paths in board viewBox coordinates (1000×1000). The ghost geometry
// is subgrid-independent, so passing boardSize as the subgrid arg only keys the cache; the
// frame/box-line pass generateGridPaths ran and threw away is gone (T3-W8, LRU-backed).
const VIEWBOX_SIZE = 1000
const cellRects = computed(() =>
  generateCellRects(props.boardSize, props.boardSize, VIEWBOX_SIZE, 42),
)

// R3: the viewport-share/dvh caps ride the row regime, which now starts at lg: —
// iPad-portrait (768) stacks, so the stacked width formula governs there.
const boardSizeClasses = computed(() => {
  if (props.boardSize <= 4)
    return 'w-[min(26rem,calc(100vw-1.5rem))] lg:w-[min(26rem,85vw)] lg:max-w-[calc(100dvh-10rem)]'
  return 'w-[min(42rem,calc(100vw-1.5rem))] lg:w-[min(42rem,85vw)] lg:max-w-[calc(100dvh-10rem)]'
})

const boardClasses = computed(() => {
  const base = 'transition-all duration-500'
  if (props.solveState === 'solved') return `${base} solve-success`
  if (props.solveState === 'failed') return `${base} solve-failure`
  return base
})

// ── Conflict detection — Latin-square (row/col) + inequality violations (§1.4) ──
const conflicts = computed(() =>
  props.solveState === 'failed'
    ? findConflicts(props.values, props.boardSize, props.inequalities)
    : { positions: new Set<string>(), firstRow: null },
)

// ── Caret layer — the inequality furniture (design-union §2.4 row 4) ─────────────
// A caret sits on the shared edge between an adjacent pair; its open mouth faces the
// larger value. Horizontal → `>`/`<`; vertical → the `>` glyph rotated ±90° (∨/∧).
interface CaretDescriptor {
  key: string
  glyph: '>' | '<'
  rotation: number
  leftPct: number
  topPct: number
  sizePct: number
  hash: number
}
const caretDescriptors = computed<CaretDescriptor[]>(() => {
  const n = props.boardSize
  const cellPct = 100 / n
  const out: CaretDescriptor[] = []
  for (const [gt, lt] of props.inequalities) {
    const rg = Math.floor(gt / n)
    const cg = gt % n
    const rl = Math.floor(lt / n)
    const cl = lt % n
    let glyph: '>' | '<' = '>'
    let rotation = 0
    let leftPct: number
    let topPct: number
    if (rg === rl) {
      // Horizontal pair — the shared edge is the column boundary between them.
      leftPct = (Math.min(cg, cl) + 1) * cellPct
      topPct = (rg + 0.5) * cellPct
      glyph = cg < cl ? '>' : '<' // greater on the left → `>`
    } else {
      // Vertical pair — shared edge is the row boundary; rotate the `>` glyph.
      topPct = (Math.min(rg, rl) + 1) * cellPct
      leftPct = (cg + 0.5) * cellPct
      rotation = rg < rl ? 90 : -90 // greater on top → ∨ (+90); greater on bottom → ∧ (−90)
    }
    out.push({
      key: `${gt}-${lt}`,
      glyph,
      rotation,
      leftPct,
      topPct,
      sizePct: cellPct * 0.5,
      hash: gt * 131 + lt * 7 + 1,
    })
  }
  return out
})

// ── Per-cell inequality clauses folded into aria-labels (F6) ─────────────────────
const constraintLabels = computed<Map<number, string>>(() => {
  const n = props.boardSize
  const dir = (from: number, to: number): string => {
    const d = to - from
    if (d === 1) return 'to the right'
    if (d === -1) return 'to the left'
    if (d === n) return 'below'
    if (d === -n) return 'above'
    return ''
  }
  const clauses = new Map<number, string[]>()
  const add = (pos: number, clause: string) => {
    const arr = clauses.get(pos)
    if (arr) arr.push(clause)
    else clauses.set(pos, [clause])
  }
  for (const [gt, lt] of props.inequalities) {
    add(gt, `greater than the cell ${dir(gt, lt)}`)
    add(lt, `less than the cell ${dir(lt, gt)}`)
  }
  const out = new Map<number, string>()
  for (const [pos, arr] of clauses) out.set(pos, arr.join(' and '))
  return out
})

// Beat 1 — the reveal wave (board-normalized noise stagger).
const noiseDelays = computed(() => {
  const delays = new Map<string, number>()
  const cells = Array.from(props.animatingCells)
  if (cells.length === 0) return delays

  const stagger = revealStaggerMs(cells.length)
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

// Celebration trigger (the trigger lives on the board; the pencil layer owns the beats).
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
  notifyUserEdit()
  emit('updateCell', pos, value)
}

// ── ARIA grid + roving tabindex (§4.1) ───────────────────────────────
const gridLabel = computed(() => `${props.boardSize} by ${props.boardSize} futoshiki board`)

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
    // ── Bounded undo/redo (W6) — sibling case, disjoint e.key from the K-peek
    // ('k'/'Escape') and Backspace/Delete layers. Gate on ctrlKey OR metaKey (Cmd on
    // macOS); a plain 'z' falls through unhandled. Shift → redo. Twin of Sudoku's (D16).
    case 'z':
    case 'Z':
      if (e.ctrlKey || e.metaKey) {
        if (e.shiftKey) emit('redo')
        else emit('undo')
      } else handled = false
      break
    // ── Hint tier (W6) — 'H' fills the focused cell from the peek cache (solver-ink).
    // Bare key only; a modified H falls through. Twin of Sudoku's (D16).
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
      slowSolveTimer = setTimeout(() => {
        if (props.solveState === 'solving') setMargin('still sharpening the pencil…', 'graphite')
      }, 2500)
    } else if (state === 'idle' && marginTone.value !== 'graphite') {
      // Stale-note clear (W6, verify-14's widening): once the grade reverts, the red
      // "check row N" AND the gold "solved it!" go stale by the same path — clear any
      // non-graphite tone. Graphite board-load copy is not a grade; it stays.
      setMargin('', 'graphite')
    }
  },
)

// Board-load announcements.
let mounted = false
let prevBoardSize = props.boardSize
watch(
  () => props.givenCells.size,
  (n, prev) => {
    if (!mounted) return
    if (n > 0 && (prev ?? 0) === 0 && props.solveState !== 'solved') {
      setMargin(`a fresh ${props.boardSize}×${props.boardSize}`, 'graphite')
    }
  },
)
watch(
  () => props.boardGeneration,
  () => {
    focusedPos.value = 0
    const sizeChanged = props.boardSize !== prevBoardSize
    prevBoardSize = props.boardSize
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
      gridAnimState.value = 'drawing'
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
})

watch(
  () => props.boardGeneration,
  (_newVal, oldVal) => {
    if (oldVal === undefined) return
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
  <!-- H9 (in-flow-on-mobile): shell carries the width; the square board and the margin
       strip are siblings inside it — the strip is in flow when stacked (<lg), overlay
       in the row regime (≥lg). Twin of SudokuBoard's shape (D16). -->
  <div class="board-shell" :class="[boardSizeClasses, { 'board-leaving': leaving }]">
    <div
      class="board-wrapper cartoon-shadow-md aspect-square w-full rounded-xl bg-card"
      :class="boardClasses"
    >
    <!-- Hand-drawn SVG grid overlay — subgridSize === boardSize → plain Latin grid -->
    <HandDrawnGrid
      :board-size="boardSize"
      :subgrid-size="boardSize"
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
        :noise-delay="noiseDelays.get(String(pos - 1)) ?? 0"
        :board-size="boardSize"
        :row-index="Math.floor((pos - 1) / boardSize) + 1"
        :col-index="((pos - 1) % boardSize) + 1"
        :tab-index="pos - 1 === focusedPos ? 0 : -1"
        :ghost-path="cellRects[pos - 1] ?? ''"
        :constraint-label="constraintLabels.get(pos - 1) ?? ''"
        :marks="pencilMarks?.[String(pos - 1)]"
        @update="onCellUpdate"
        @cell-focus="onCellFocus"
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

    <!-- Below-board margin: status voice + paper note — a sibling of the board square
         (H9): in flow when stacked, overlay in the row regime. -->
    <div class="board-margin">
      <!-- The completion block (T3-W9 §2): one grid composition — the foil sticker slot
           beside the text column (voice over meta). Twin of SudokuBoard's. -->
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
  .board-leaving .board-margin {
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

/* The completion block (T3-W9 §2) — [sticker slot] beside [voice over meta], one
   composition in both layout regimes; the tally's tone/type/PRM rules live in
   MarginNote — the one home. Twin of SudokuBoard's. */
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

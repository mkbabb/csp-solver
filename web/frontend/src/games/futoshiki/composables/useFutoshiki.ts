import { computed, ref, watch } from 'vue'
// The solve/generate path is the in-browser wasm Worker (`useSolver`), the only
// shipped solve surface, with zero `/api/v1/*` dependency and no server to depend
// on. The off-main-thread Worker structurally retires the GIL/DoS class for the
// served sizes.
import { useSolver } from './useSolver'
import {
  resolveInitialState,
  syncToUrl,
  persistBoard,
  clearPersistedBoard,
  encodeBoard,
  writeBoardToUrl,
  dropBoardParam,
  type PersistedBoard,
} from './useUrlState'
import { classifyError } from '../lib/apiError'
import type { Inequality, SolveState, SolveStats } from '../types'

/**
 * Size-scaled node budget for the client solve. v1 sizes (N=4..7) solve an empty board
 * in 0 backtracks under the wasm AC-3+MRV config (the F1 production override), so these
 * caps are generous headroom for user-entered boards, not a tight leash — exhausting one
 * surfaces a typed `BUDGET_EXCEEDED` error (distinct from provable UNSAT).
 */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  4: 2_000_000,
  5: 4_000_000,
  6: 10_000_000,
  7: 20_000_000,
}
function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 4_000_000
}

export function useFutoshiki() {
  const api = useSolver()

  const initial = resolveInitialState()

  const boardSize = ref(initial.boardSize)
  const totalCells = computed(() => boardSize.value ** 2)

  // values[position] = number (0 = empty)
  const values = ref<Record<string, number>>({})
  const givenCells = ref<Set<string>>(new Set())
  const originalGivenCells = ref<Set<string>>(new Set())
  const overriddenCells = ref<Set<string>>(new Set())
  // Printed inequality furniture — [greater, lesser] pairs. NEVER in the given/overridden
  // bookkeeping (they aren't cell values); they ride along the board and feed the carets.
  const inequalities = ref<Inequality[]>([])
  const animatingCells = ref<Set<string>>(new Set())
  const solveState = ref<SolveState>('idle')
  const solvedValues = ref<Record<string, number>>({})
  // Stats from the last completed solve (W6 stat-line). Set only by solve() —
  // the peek path never touches it. Cleared wherever the grade reverts to idle.
  const solveStats = ref<SolveStats | null>(null)
  const loading = ref(false)
  const errorMessage = ref('')
  const errorCode = ref('')
  const boardGeneration = ref(0)

  // ── Bounded undo/redo (W6) — a capped {pos,prev,next}[] linear history ─────────
  // Twin of useSudoku's (D16). Only user edits (setCell) are recorded — solve/randomize/
  // clear/hint are not; the stack is reset whenever the board itself is replaced.
  const UNDO_CAP = 128
  const undoStack = ref<{ pos: number; prev: number; next: number }[]>([])
  const undoIndex = ref(0)
  function clearUndo() {
    undoStack.value = []
    undoIndex.value = 0
  }
  function recordEdit(pos: number, prev: number, next: number) {
    if (prev === next) return
    // Drop the redo tail — a fresh edit forks the timeline.
    if (undoIndex.value < undoStack.value.length) undoStack.value.splice(undoIndex.value)
    undoStack.value.push({ pos, prev, next })
    if (undoStack.value.length > UNDO_CAP) undoStack.value.shift()
    undoIndex.value = undoStack.value.length
  }
  function undo() {
    if (undoIndex.value === 0) return
    undoIndex.value--
    const e = undoStack.value[undoIndex.value]
    applyCellValue(e.pos, e.prev)
  }
  function redo() {
    if (undoIndex.value >= undoStack.value.length) return
    const e = undoStack.value[undoIndex.value]
    undoIndex.value++
    applyCellValue(e.pos, e.next)
  }

  function initBoard() {
    values.value = {}
    givenCells.value = new Set()
    originalGivenCells.value = new Set()
    overriddenCells.value = new Set()
    inequalities.value = []
    animatingCells.value = new Set()
    solveState.value = 'idle'
    solvedValues.value = {}
    solveStats.value = null
    errorMessage.value = ''
    errorCode.value = ''
    for (let i = 0; i < totalCells.value; i++) {
      values.value[String(i)] = 0
    }
    clearUndo()
    boardGeneration.value++
  }

  function clearBoard() {
    solveState.value = 'idle'
    solvedValues.value = {}
    solveStats.value = null
    errorMessage.value = ''
    errorCode.value = ''
    for (let i = 0; i < totalCells.value; i++) {
      values.value[String(i)] = 0
    }
    givenCells.value = new Set()
    originalGivenCells.value = new Set()
    overriddenCells.value = new Set()
    // Inequalities are permanent furniture — a "clear" blanks the cells but leaves the
    // printed constraints, so the board stays a solvable Futoshiki puzzle.
    animatingCells.value = new Set()
    clearUndo()
    boardGeneration.value++
    clearPersistedBoard()
    dropBoardParam() // the shared configuration is stale once the cells are blanked
  }

  // The cell-write primitive, shared by user edits and undo/redo replay. Given-cell
  // immunity is structural: a pristine given is never a recorded edit target (editing one
  // overrides it first), so undo/redo never writes into a live given.
  function applyCellValue(pos: number, value: number) {
    const key = String(pos)
    if (originalGivenCells.value.has(key)) {
      givenCells.value.delete(key)
      overriddenCells.value.add(key)
    }
    if (key in solvedValues.value) {
      const { [key]: _, ...rest } = solvedValues.value
      solvedValues.value = rest
      overriddenCells.value.add(key)
    }
    values.value[key] = value
    if (solveState.value !== 'idle') {
      solveState.value = 'idle'
      solveStats.value = null // the stat-line goes stale with the grade (W6)
    }
    queueSave()
  }

  function setCell(pos: number, value: number) {
    const prev = values.value[String(pos)] ?? 0
    applyCellValue(pos, value)
    recordEdit(pos, prev, value)
  }

  async function randomize() {
    loading.value = true
    errorMessage.value = ''
    errorCode.value = ''
    solveState.value = 'idle'
    solvedValues.value = {}
    solveStats.value = null

    try {
      const board = await api.getRandomBoard(boardSize.value)
      values.value = {}
      givenCells.value = new Set()
      originalGivenCells.value = new Set()
      overriddenCells.value = new Set()

      for (let i = 0; i < totalCells.value; i++) values.value[String(i)] = 0
      for (const [pos, val] of Object.entries(board.values)) {
        values.value[pos] = val
        if (val !== 0) givenCells.value.add(pos)
      }

      inequalities.value = board.inequalities
      originalGivenCells.value = new Set(givenCells.value)
      animatingCells.value = new Set(givenCells.value)
      clearUndo() // a fresh board voids the prior board's history
      dropBoardParam() // a freshly-dealt board voids the shared permalink
      boardGeneration.value++
      queueSave()
    } catch (e) {
      solveState.value = classifyError(e).kind === 'teacher-red' ? 'failed' : 'error'
      errorCode.value = e instanceof Error && 'code' in e ? String((e as { code?: unknown }).code ?? '') : ''
      errorMessage.value = e instanceof Error ? e.message : 'Failed to get board'
    } finally {
      loading.value = false
    }
  }

  async function solve() {
    loading.value = true
    solveState.value = 'solving'
    solveStats.value = null // never show a previous solve's numbers mid-solve
    errorMessage.value = ''
    errorCode.value = ''

    try {
      const result = await api.solveBoard(
        values.value,
        boardSize.value,
        inequalities.value,
        nodeBudgetForSize(boardSize.value),
      )
      const newlySolved: Record<string, number> = {}
      const cellsToAnimate = new Set<string>()

      for (const [pos, val] of Object.entries(result.values)) {
        if (values.value[pos] === 0) {
          values.value[pos] = val
          newlySolved[pos] = val
          cellsToAnimate.add(pos)
        }
      }

      solvedValues.value = { ...solvedValues.value, ...newlySolved }
      solveState.value = result.solved ? 'solved' : 'failed'
      solveStats.value = {
        backtracks: result.backtracks,
        solutionCount: result.solutionCount,
        elapsedMs: result.elapsedMs,
      }
      animatingCells.value = cellsToAnimate
      queueSave()
    } catch (e) {
      solveState.value = classifyError(e).kind === 'teacher-red' ? 'failed' : 'error'
      errorCode.value = e instanceof Error && 'code' in e ? String((e as { code?: unknown }).code ?? '') : ''
      errorMessage.value = e instanceof Error ? e.message : 'Solve failed'
    } finally {
      loading.value = false
    }
  }

  // ── Answer-key peek: solve the PRISTINE givens + inequalities, cache per generation ──
  const peekCache = ref<{ gen: number; values: Record<string, number> } | null>(null)
  async function peekSolution(): Promise<Record<string, number>> {
    if (peekCache.value && peekCache.value.gen === boardGeneration.value) {
      return peekCache.value.values
    }
    const givensOnly: Record<string, number> = {}
    for (let i = 0; i < totalCells.value; i++) {
      const key = String(i)
      givensOnly[key] = originalGivenCells.value.has(key) ? (values.value[key] ?? 0) : 0
    }
    const result = await api.solveBoard(
      givensOnly,
      boardSize.value,
      inequalities.value,
      nodeBudgetForSize(boardSize.value),
    )
    peekCache.value = { gen: boardGeneration.value, values: { ...result.values } }
    return peekCache.value.values
  }

  // ── Hint tier (W6) — fill the focused cell from the peek cache, solver-ink ──────
  // 'H' on the board reveals one cell in the solver's own tone (added to solvedValues,
  // so it renders sparkle-rainbow like any solver answer). No bookkeeping, no penalties;
  // pristine givens are immune. Not recorded on the undo stack — a hint is a reveal, not
  // a user edit. Twin of useSudoku's (D16).
  async function hintCell(pos: number) {
    const key = String(pos)
    if (originalGivenCells.value.has(key)) return // givens already show the answer
    let solution: Record<string, number>
    try {
      solution = await peekSolution()
    } catch {
      return // solve unavailable — fail quietly
    }
    const val = solution[key] ?? 0
    if (val === 0 || values.value[key] === val) return
    values.value[key] = val
    solvedValues.value = { ...solvedValues.value, [key]: val } // solver-ink tone
    overriddenCells.value.delete(key)
    if (solveState.value !== 'idle') {
      solveState.value = 'idle'
      solveStats.value = null
    }
    queueSave()
  }

  // ── Engine-domains pencil marks (W6 beat 9 — P4 landed as product; D16 twin) ──
  // The marks ARE the solver's propagated domains (root AC-3 + GAC, zero search),
  // but they are OPT-IN, never ambient: at full GAC strength most served boards
  // collapse to all-singleton domains (the P4 spoiler finding), so always-on
  // marks would be a disclosure, not a hint. They ride the existing peek gesture
  // — FutoshikiGame.vue mirrors `peekActive` into `setMarksActive`, no new
  // handler — visible only while the hold-to-peek is held; release clears them.
  // UNSAT or any worker fault simply clears the marks: a courtesy, never an
  // error surface.
  const marksActive = ref(false)
  const pencilMasks = ref<Uint32Array | null>(null)
  let marksTimer: ReturnType<typeof setTimeout> | null = null
  let marksSeq = 0
  function refreshMarks(delayMs = 150) {
    if (marksTimer) clearTimeout(marksTimer)
    marksTimer = setTimeout(async () => {
      marksTimer = null
      const seq = ++marksSeq
      try {
        const masks = await api.propagateBoard(
          values.value,
          boardSize.value,
          inequalities.value,
        )
        // Last-write-wins seq guard + the gesture may have released mid-flight.
        if (seq === marksSeq && marksActive.value) pencilMasks.value = masks
      } catch {
        if (seq === marksSeq) pencilMasks.value = null
      }
    }, delayMs)
  }
  function setMarksActive(on: boolean) {
    if (marksActive.value === on) return
    marksActive.value = on
    if (on) {
      refreshMarks(0) // the gesture is held NOW — no debounce on the first paint
    } else {
      if (marksTimer) {
        clearTimeout(marksTimer)
        marksTimer = null
      }
      marksSeq++ // void any in-flight round-trip
      pencilMasks.value = null
    }
  }

  const pencilMarks = computed<Record<string, number[]>>(() => {
    const masks = pencilMasks.value
    const bs = boardSize.value
    // Stale-shape guard: a size switch mid-flight leaves masks from the
    // previous geometry; render nothing until the next round-trip lands.
    if (!masks || masks.length !== totalCells.value) return {}
    const out: Record<string, number[]> = {}
    for (let i = 0; i < masks.length; i++) {
      if ((values.value[String(i)] ?? 0) !== 0) continue
      const cand: number[] = []
      for (let v = 1; v <= bs; v++) {
        if (masks[i] & (1 << v)) cand.push(v)
      }
      // Only show marks where propagation has actually bitten — a cell
      // with its full domain intact carries no information, just noise.
      if (cand.length > 0 && cand.length < bs) out[String(i)] = cand
    }
    return out
  })

  // ── Restore from persisted state (no animation) ──────────────────
  function restoreBoard(persisted: PersistedBoard) {
    values.value = { ...persisted.values }
    givenCells.value = new Set(persisted.givenCells)
    originalGivenCells.value = new Set(persisted.originalGivenCells)
    overriddenCells.value = new Set(persisted.overriddenCells)
    inequalities.value = persisted.inequalities.map(([a, b]) => [a, b] as Inequality)
    solvedValues.value = { ...persisted.solvedValues }
    boardGeneration.value = persisted.boardGeneration
    animatingCells.value = new Set()
    solveState.value = 'idle'
    solveStats.value = null
    errorMessage.value = ''
    errorCode.value = ''
    clearUndo()
  }

  function saveBoardState() {
    persistBoard({
      boardSize: boardSize.value,
      values: values.value,
      givenCells: Array.from(givenCells.value),
      originalGivenCells: Array.from(originalGivenCells.value),
      overriddenCells: Array.from(overriddenCells.value),
      inequalities: inequalities.value,
      solvedValues: solvedValues.value,
      boardGeneration: boardGeneration.value,
    })
  }

  // ── Share-on-demand permalink (W6) ───────────────────────────────
  // The explicit share act: encode the current board (values + inequality furniture)
  // into `?board=`, write it to the address bar (so a reload reproduces it — URL wins
  // over storage), and hand the full href back for the caller to copy. The ONLY writer.
  function shareBoard(): string {
    writeBoardToUrl(encodeBoard(boardSize.value, values.value, totalCells.value, inequalities.value))
    return window.location.href
  }

  // ── Initialization ───────────────────────────────────────────────
  syncToUrl(boardSize.value)

  const canRestore =
    (initial.source === 'url+storage' ||
      initial.source === 'storage-only' ||
      initial.source === 'url-board') &&
    initial.persisted != null &&
    Object.values(initial.persisted.values).some((v) => v !== 0)

  if (canRestore) {
    restoreBoard(initial.persisted!)
  } else {
    if (initial.persisted) clearPersistedBoard()
    initBoard()
    randomize() // fire-and-forget
  }

  // ── Watchers ─────────────────────────────────────────────────────
  watch(boardSize, () => {
    syncToUrl(boardSize.value)
    clearPersistedBoard()
    initBoard()
    randomize()
  })

  // Engine-domains pencil marks: while the peek gesture is held, any cell
  // mutation or board swap re-propagates (K-peek is a toggle, so the page can
  // still be written on with the marks up). `values` is mutated in place at
  // `setCell`, so the deep watch is load-bearing; `boardGeneration` covers
  // clear/randomize/size swaps. Inert (one boolean test) while marks are off.
  watch(
    [values, boardGeneration],
    () => {
      if (marksActive.value) refreshMarks()
    },
    { deep: true },
  )

  // Debounced persistence — called explicitly at mutation points.
  let saveTimer: ReturnType<typeof setTimeout> | null = null
  function queueSave() {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      saveBoardState()
      saveTimer = null
    }, 300)
  }

  return {
    boardSize,
    totalCells,
    values,
    givenCells,
    originalGivenCells,
    overriddenCells,
    inequalities,
    animatingCells,
    solveState,
    solvedValues,
    solveStats,
    loading,
    errorMessage,
    errorCode,
    boardGeneration,
    initBoard,
    clearBoard,
    setCell,
    randomize,
    solve,
    peekSolution,
    undo,
    redo,
    hintCell,
    shareBoard,
    pencilMarks,
    setMarksActive,
  }
}

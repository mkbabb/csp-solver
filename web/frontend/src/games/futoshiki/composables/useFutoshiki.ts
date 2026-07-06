import { computed, ref, watch } from 'vue'
// The DEFAULT solve/generate path is the in-browser wasm Worker (`useSolver`), not the
// FastAPI backend — a drop-in for `useApi` (identical shapes) with zero `/api/v1/*`
// dependency, so it degrades gracefully when the API origin is absent. The off-main-
// thread Worker structurally retires the GIL/DoS class for the served sizes.
import { useSolver } from './useSolver'
import {
  resolveInitialState,
  syncToUrl,
  persistBoard,
  clearPersistedBoard,
  type PersistedBoard,
} from './useUrlState'
import { classifyError } from '../lib/apiError'
import type { Inequality, SolveState } from '../types'

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
  const loading = ref(false)
  const errorMessage = ref('')
  const errorCode = ref('')
  const boardGeneration = ref(0)

  function initBoard() {
    values.value = {}
    givenCells.value = new Set()
    originalGivenCells.value = new Set()
    overriddenCells.value = new Set()
    inequalities.value = []
    animatingCells.value = new Set()
    solveState.value = 'idle'
    solvedValues.value = {}
    errorMessage.value = ''
    errorCode.value = ''
    for (let i = 0; i < totalCells.value; i++) {
      values.value[String(i)] = 0
    }
    boardGeneration.value++
  }

  function clearBoard() {
    solveState.value = 'idle'
    solvedValues.value = {}
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
    boardGeneration.value++
    clearPersistedBoard()
  }

  function setCell(pos: number, value: number) {
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
    }
    queueSave()
  }

  async function randomize() {
    loading.value = true
    errorMessage.value = ''
    errorCode.value = ''
    solveState.value = 'idle'
    solvedValues.value = {}

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
    errorMessage.value = ''
    errorCode.value = ''
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

  // ── Initialization ───────────────────────────────────────────────
  syncToUrl(boardSize.value)

  const canRestore =
    (initial.source === 'url+storage' || initial.source === 'storage-only') &&
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
  }
}

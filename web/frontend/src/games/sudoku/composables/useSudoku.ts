import { computed, ref, watch } from 'vue'
// Option C (W6): the DEFAULT solve/generate path is the in-browser wasm
// Worker, not the FastAPI backend. `useSolver` is a drop-in for `useApi`
// (identical `BoardResponse`/`SolveResponse` shapes) with zero `/api/v1/*`
// dependency — no fetch, no `/config` client-timeout handshake — so it
// degrades gracefully when the API origin is absent (wave §Residual). The
// off-main-thread Worker structurally retires the GIL/DoS class for the
// served sizes. `useApi.ts` remains in the tree as the Option-A path but
// is no longer on this composable's solve path.
import { useSolver } from './useSolver'
import {
  resolveInitialState,
  syncToUrl,
  persistBoard,
  clearPersistedBoard,
  type PersistedBoard,
} from './useUrlState'
import { classifyError } from '../lib/apiError'
import type { Difficulty, SolveState } from '../types'

/**
 * Size-scaled node budget for the client solve — the user-facing cap on
 * search effort, keyed to sub-grid size. The worker's wasm default is
 * 1,000,000 nodes; larger boards legitimately explore more, so the cap
 * scales up with `n`: generous enough that every served template solves,
 * finite enough to structurally retire the unbounded-search DoS class the
 * Option-A server timeout used to guard. Exhausting it surfaces a typed
 * `BUDGET_EXCEEDED` error (distinct from provable UNSAT) — see `solve()`.
 */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  2: 200_000,
  3: 2_000_000,
  4: 50_000_000,
}
function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 1_000_000
}

export function useSudoku() {
  const api = useSolver()

  const initial = resolveInitialState()

  const size = ref(initial.size)
  const difficulty = ref<Difficulty>(initial.difficulty)
  const boardSize = computed(() => size.value ** 2)
  const totalCells = computed(() => boardSize.value ** 2)

  // values[position] = number (0 = empty)
  const values = ref<Record<string, number>>({})
  const givenCells = ref<Set<string>>(new Set())
  const originalGivenCells = ref<Set<string>>(new Set())
  const overriddenCells = ref<Set<string>>(new Set())
  const animatingCells = ref<Set<string>>(new Set())
  const solveState = ref<SolveState>('idle')
  const solvedValues = ref<Record<string, number>>({})
  const loading = ref(false)
  const errorMessage = ref('')
  // The typed error code (ApiErrorCode | SolverErrorCode) behind the paper note,
  // consumed by SudokuBoard for the §5.2 copy split. Kept coherent with errorMessage.
  const errorCode = ref('')
  const boardGeneration = ref(0)

  function initBoard() {
    values.value = {}
    givenCells.value = new Set()
    originalGivenCells.value = new Set()
    overriddenCells.value = new Set()
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
    // If overriding a solver-introduced cell, remove only THIS cell from solvedValues
    // (other solved cells keep their sparkle-rainbow styling)
    if (key in solvedValues.value) {
      const { [key]: _, ...rest } = solvedValues.value
      solvedValues.value = rest
      overriddenCells.value.add(key)
    }
    values.value[key] = value
    // Revert solve state so the board no longer shows success/failure
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
      const board = await api.getRandomBoard(size.value, difficulty.value)
      values.value = {}
      givenCells.value = new Set()
      originalGivenCells.value = new Set()
      overriddenCells.value = new Set()

      for (const [pos, val] of Object.entries(board.values)) {
        values.value[pos] = val
        if (val !== 0) {
          givenCells.value.add(pos)
        }
      }

      originalGivenCells.value = new Set(givenCells.value)
      animatingCells.value = new Set(givenCells.value)
      queueSave()
    } catch (e) {
      // A generate failure was fully silent before — route it through the shared
      // fiction classifier and surface it (paper note for machinery faults).
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
      const result = await api.solveBoard(values.value, size.value, nodeBudgetForSize(size.value))
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
      // solved=false means the solver *proved* no completion exists for the
      // user-entered cells (provable UNSAT) — distinct from the budget case below.
      solveState.value = result.solved ? 'solved' : 'failed'
      animatingCells.value = cellsToAnimate
      queueSave()
    } catch (e) {
      // Route by the shared fiction classifier (games/sudoku/lib/apiError): provable
      // UNSAT / INVALID_INPUT → the teacher's red pencil ('failed'); everything else
      // — BUDGET_EXCEEDED, TIMEOUT, WORKER_FAILURE, a bare network TypeError — → the
      // paper note ('error'). Fixes the Pass-1 F5 corner where WORKER_FAILURE wrongly
      // read as a wrong answer; the two are never conflated on the wire or in the UI.
      solveState.value = classifyError(e).kind === 'teacher-red' ? 'failed' : 'error'
      errorCode.value = e instanceof Error && 'code' in e ? String((e as { code?: unknown }).code ?? '') : ''
      errorMessage.value = e instanceof Error ? e.message : 'Solve failed'
    } finally {
      loading.value = false
    }
  }

  // ── Answer-key peek: solve the PRISTINE givens, cache per generation ──
  // Feeds the read-only laminate overlay; NEVER mutates `values`. The W6 Worker
  // solve path makes this API-free (no /board/solve round-trip), and boards derive
  // from solution banks so the pristine givens are always satisfiable.
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
    const result = await api.solveBoard(givensOnly, size.value, nodeBudgetForSize(size.value))
    peekCache.value = { gen: boardGeneration.value, values: { ...result.values } }
    return peekCache.value.values
  }

  // ── Restore from persisted state (no animation) ──────────────────
  function restoreBoard(persisted: PersistedBoard) {
    values.value = { ...persisted.values }
    givenCells.value = new Set(persisted.givenCells)
    originalGivenCells.value = new Set(persisted.originalGivenCells)
    overriddenCells.value = new Set(persisted.overriddenCells)
    solvedValues.value = { ...persisted.solvedValues }
    boardGeneration.value = persisted.boardGeneration
    animatingCells.value = new Set() // no re-animation on restore
    solveState.value = 'idle'
    errorMessage.value = ''
    errorCode.value = ''
  }

  // ── Persistence helper ───────────────────────────────────────────
  function saveBoardState() {
    persistBoard({
      size: size.value,
      difficulty: difficulty.value,
      values: values.value,
      givenCells: Array.from(givenCells.value),
      originalGivenCells: Array.from(originalGivenCells.value),
      overriddenCells: Array.from(overriddenCells.value),
      solvedValues: solvedValues.value,
      boardGeneration: boardGeneration.value,
    })
  }

  // ── Initialization ───────────────────────────────────────────────
  syncToUrl(size.value, difficulty.value)

  const canRestore =
    (initial.source === 'url+storage' || initial.source === 'storage-only') &&
    initial.persisted != null &&
    Object.values(initial.persisted.values).some((v) => v !== 0)

  if (canRestore) {
    restoreBoard(initial.persisted!)
  } else {
    // No meaningful persisted state — init empty board then auto-fetch
    if (initial.persisted) clearPersistedBoard()
    initBoard()
    randomize() // fire-and-forget
  }

  // ── Watchers ─────────────────────────────────────────────────────

  // Sync URL when size or difficulty changes
  watch([size, difficulty], () => {
    syncToUrl(size.value, difficulty.value)
  })

  // Re-init when size changes — old board dimensions invalid
  watch(size, () => {
    clearPersistedBoard()
    initBoard()
    randomize()
  })

  // Debounced persistence — called explicitly at mutation points
  let saveTimer: ReturnType<typeof setTimeout> | null = null
  function queueSave() {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      saveBoardState()
      saveTimer = null
    }, 300)
  }

  return {
    size,
    difficulty,
    boardSize,
    totalCells,
    values,
    givenCells,
    originalGivenCells,
    overriddenCells,
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

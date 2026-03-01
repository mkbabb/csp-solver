import { computed, ref, watch } from 'vue'
import { useApi } from './useApi'

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
export type SolveState = 'idle' | 'solving' | 'solved' | 'failed' | 'error'

export function useSudoku() {
  const api = useApi()

  const size = ref(3)
  const difficulty = ref<Difficulty>('EASY')
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
    for (let i = 0; i < totalCells.value; i++) {
      values.value[String(i)] = 0
    }
    boardGeneration.value++
  }

  function clearBoard() {
    solveState.value = 'idle'
    solvedValues.value = {}
    errorMessage.value = ''
    for (let i = 0; i < totalCells.value; i++) {
      values.value[String(i)] = 0
    }
    givenCells.value = new Set()
    originalGivenCells.value = new Set()
    overriddenCells.value = new Set()
    animatingCells.value = new Set()
    boardGeneration.value++
  }

  function setCell(pos: number, value: number) {
    const key = String(pos)
    if (originalGivenCells.value.has(key)) {
      givenCells.value.delete(key)
      overriddenCells.value.add(key)
    }
    values.value[key] = value
    if (solveState.value !== 'idle') {
      solveState.value = 'idle'
      solvedValues.value = {}
    }
  }

  async function randomize() {
    loading.value = true
    errorMessage.value = ''
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
    } catch (e) {
      errorMessage.value = e instanceof Error ? e.message : 'Failed to get board'
    } finally {
      loading.value = false
    }
  }

  async function solve() {
    loading.value = true
    solveState.value = 'solving'
    errorMessage.value = ''

    try {
      const result = await api.solveBoard(values.value, size.value)
      const newlySolved: Record<string, number> = {}
      const cellsToAnimate = new Set<string>()

      for (const [pos, val] of Object.entries(result.values)) {
        if (values.value[pos] === 0) {
          values.value[pos] = val
          newlySolved[pos] = val
          cellsToAnimate.add(pos)
        }
      }

      solvedValues.value = newlySolved
      solveState.value = 'solved'
      animatingCells.value = cellsToAnimate
    } catch (e) {
      solveState.value = 'failed'
      errorMessage.value = e instanceof Error ? e.message : 'Solve failed'
    } finally {
      loading.value = false
    }
  }

  // Re-init when size changes
  watch(size, () => {
    initBoard()
  })

  // Init on creation
  initBoard()

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
    boardGeneration,
    initBoard,
    clearBoard,
    setCell,
    randomize,
    solve,
  }
}

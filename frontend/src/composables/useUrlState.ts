import type { Difficulty } from './useSudoku'

const STORAGE_KEY = 'sudoku-board-state'
const VALID_SIZES = [2, 3, 4]
const VALID_DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']
const SIZE_WEIGHTS = [2, 3, 3, 3, 4] // weighted toward 3

export type InitSource = 'fresh' | 'url-only' | 'storage-only' | 'url+storage'

export interface PersistedBoard {
  size: number
  difficulty: Difficulty
  values: Record<string, number>
  givenCells: string[]
  originalGivenCells: string[]
  overriddenCells: string[]
  solvedValues: Record<string, number>
  boardGeneration: number
}

export interface InitialState {
  size: number
  difficulty: Difficulty
  source: InitSource
  persisted: PersistedBoard | null
}

function parseUrlParams(): { size: number | null; difficulty: Difficulty | null } {
  const params = new URLSearchParams(window.location.search)
  const rawSize = params.get('size')
  const rawDiff = params.get('difficulty')

  const size = rawSize ? parseInt(rawSize, 10) : null
  const difficulty = rawDiff?.toUpperCase() as Difficulty | undefined

  return {
    size: size !== null && VALID_SIZES.includes(size) ? size : null,
    difficulty: difficulty && VALID_DIFFICULTIES.includes(difficulty) ? difficulty : null,
  }
}

function loadPersistedBoard(): PersistedBoard | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PersistedBoard
    // Basic shape validation
    if (
      !VALID_SIZES.includes(data.size) ||
      !VALID_DIFFICULTIES.includes(data.difficulty) ||
      typeof data.values !== 'object' ||
      !Array.isArray(data.givenCells)
    ) {
      return null
    }
    return data
  } catch {
    return null
  }
}

function randomSize(): number {
  return SIZE_WEIGHTS[Math.floor(Math.random() * SIZE_WEIGHTS.length)]
}

function randomDifficulty(): Difficulty {
  return VALID_DIFFICULTIES[Math.floor(Math.random() * VALID_DIFFICULTIES.length)]
}

export function resolveInitialState(): InitialState {
  const url = parseUrlParams()
  const persisted = loadPersistedBoard()
  const hasUrl = url.size !== null || url.difficulty !== null

  if (hasUrl && persisted) {
    const urlSize = url.size ?? persisted.size
    const urlDiff = url.difficulty ?? persisted.difficulty
    if (urlSize === persisted.size && urlDiff === persisted.difficulty) {
      return { size: urlSize, difficulty: urlDiff, source: 'url+storage', persisted }
    }
    // URL disagrees with storage — URL wins
    clearPersistedBoard()
    return { size: urlSize, difficulty: urlDiff, source: 'url-only', persisted: null }
  }

  if (hasUrl) {
    return {
      size: url.size ?? 3,
      difficulty: url.difficulty ?? 'EASY',
      source: 'url-only',
      persisted: null,
    }
  }

  if (persisted) {
    return {
      size: persisted.size,
      difficulty: persisted.difficulty,
      source: 'storage-only',
      persisted,
    }
  }

  return {
    size: randomSize(),
    difficulty: randomDifficulty(),
    source: 'fresh',
    persisted: null,
  }
}

export function syncToUrl(size: number, difficulty: Difficulty) {
  const url = new URL(window.location.href)
  url.searchParams.set('size', String(size))
  url.searchParams.set('difficulty', difficulty)
  history.replaceState(null, '', url.toString())
}

export function persistBoard(state: PersistedBoard) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked — silently fail
  }
}

export function clearPersistedBoard() {
  localStorage.removeItem(STORAGE_KEY)
}

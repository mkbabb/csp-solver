/**
 * URL + localStorage persistence for Futoshiki. Own file (games never import each
 * other) with a materially different shape from Sudoku's:
 *   - The URL param is `board_size`, never bare `size` (F5). Sudoku owns `?size=` +
 *     `?difficulty=`; Futoshiki owns `?board_size=`, so both games can co-exist in one
 *     URL while `?game=` (App.vue) selects which is active.
 *   - There is no `difficulty` (F3).
 *   - `PersistedBoard` carries `inequalities` — permanent board furniture — which does
 *     NOT participate in given/overridden bookkeeping.
 */
import { VALID_BOARD_SIZES, type Inequality } from '../types'

const STORAGE_KEY = 'futoshiki-board-state'
const DEFAULT_BOARD_SIZE = 5
const VALID_SIZES: readonly number[] = VALID_BOARD_SIZES

export type InitSource = 'fresh' | 'url-only' | 'storage-only' | 'url+storage'

export interface PersistedBoard {
  boardSize: number
  values: Record<string, number>
  givenCells: string[]
  originalGivenCells: string[]
  overriddenCells: string[]
  inequalities: Inequality[]
  solvedValues: Record<string, number>
  boardGeneration: number
}

export interface InitialState {
  boardSize: number
  source: InitSource
  persisted: PersistedBoard | null
}

function parseUrlParams(): { boardSize: number | null } {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('board_size')
  const n = raw ? parseInt(raw, 10) : null
  return { boardSize: n !== null && VALID_SIZES.includes(n) ? n : null }
}

function loadPersistedBoard(): PersistedBoard | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PersistedBoard
    if (
      !VALID_SIZES.includes(data.boardSize) ||
      typeof data.values !== 'object' ||
      !Array.isArray(data.givenCells) ||
      !Array.isArray(data.inequalities)
    ) {
      return null
    }
    return data
  } catch {
    return null
  }
}

export function resolveInitialState(): InitialState {
  const url = parseUrlParams()
  const persisted = loadPersistedBoard()
  const hasUrl = url.boardSize !== null

  if (hasUrl && persisted) {
    if (url.boardSize === persisted.boardSize) {
      return { boardSize: url.boardSize!, source: 'url+storage', persisted }
    }
    // URL disagrees with storage — URL wins.
    clearPersistedBoard()
    return { boardSize: url.boardSize!, source: 'url-only', persisted: null }
  }

  if (hasUrl) {
    return { boardSize: url.boardSize!, source: 'url-only', persisted: null }
  }

  if (persisted) {
    return { boardSize: persisted.boardSize, source: 'storage-only', persisted }
  }

  return { boardSize: DEFAULT_BOARD_SIZE, source: 'fresh', persisted: null }
}

export function syncToUrl(boardSize: number) {
  const url = new URL(window.location.href)
  url.searchParams.set('board_size', String(boardSize))
  history.replaceState(null, '', url.toString())
}

export function persistBoard(state: PersistedBoard) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked — silently fail.
  }
}

export function clearPersistedBoard() {
  localStorage.removeItem(STORAGE_KEY)
}

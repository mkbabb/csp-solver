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
import { toBase64Url, fromBase64Url } from '@/lib/base64url'
import { VALID_BOARD_SIZES, type Inequality } from '../types'

const STORAGE_KEY = 'futoshiki-board-state'
const DEFAULT_BOARD_SIZE = 5
const VALID_SIZES: readonly number[] = VALID_BOARD_SIZES

// 'url-board' — a shared `?board=` permalink decoded into a full board (values +
// inequality furniture) and wins over storage. Distinct from 'url-only' so the
// composable RESTORES the synthesized board rather than auto-randomizing.
export type InitSource = 'fresh' | 'url-only' | 'storage-only' | 'url+storage' | 'url-board'

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

// ── Share-on-demand permalink codec (`?board=`) ─────────────────────────
// base64url of `${boardSize}.${cells}.${ineqs}` — `cells` is one base-36 char per
// cell value (0 = empty), length = boardSize**2; `ineqs` is the printed inequality
// furniture as `greater-lesser` position pairs joined by ',' (empty when none).
// Self-describing (carries its own size) so a board-only link still loads and a
// mismatch fails closed. Inequalities are carried — a Futoshiki share without its
// constraints is not the same puzzle. The base64url codec is hoisted to
// `@/lib/base64url` (shared with Sudoku's).

export function encodeBoard(
  boardSize: number,
  values: Record<string, number>,
  totalCells: number,
  inequalities: Inequality[],
): string {
  let cells = ''
  for (let i = 0; i < totalCells; i++) cells += (values[String(i)] ?? 0).toString(36)
  const ineqs = inequalities.map(([a, b]) => `${a}-${b}`).join(',')
  return toBase64Url(`${boardSize}.${cells}.${ineqs}`)
}

// Synthesize a PersistedBoard from a decoded `?board=` — the only board-shaped object
// ever built from URL content. Non-zero cells become the givens. Returns null —
// FAILING CLOSED — on any malformed/out-of-range/size-mismatched blob so a corrupt
// link degrades to the size-only path, never a corrupt board.
function decodeBoardParam(urlSize: number | null): PersistedBoard | null {
  const raw = new URLSearchParams(window.location.search).get('board')
  if (!raw) return null
  let payload: string
  try {
    payload = fromBase64Url(raw)
  } catch {
    return null
  }
  const parts = payload.split('.')
  if (parts.length !== 3) return null
  const [sizeStr, cells, ineqStr] = parts
  const boardSize = parseInt(sizeStr, 10)
  if (!VALID_SIZES.includes(boardSize)) return null
  // A `?board_size=` that disagrees with the board's own size fails closed.
  if (urlSize !== null && urlSize !== boardSize) return null
  const totalCells = boardSize ** 2
  // A length mismatch (wrong cell count for the declared size) fails closed.
  if (cells.length !== totalCells) return null
  const values: Record<string, number> = {}
  const givenCells: string[] = []
  for (let i = 0; i < totalCells; i++) {
    const v = parseInt(cells[i]!, 36)
    if (!Number.isInteger(v) || v < 0 || v > boardSize) return null
    values[String(i)] = v
    if (v !== 0) givenCells.push(String(i))
  }
  const inequalities: Inequality[] = []
  if (ineqStr.length > 0) {
    for (const pair of ineqStr.split(',')) {
      const ab = pair.split('-')
      if (ab.length !== 2) return null
      const a = parseInt(ab[0], 10)
      const b = parseInt(ab[1], 10)
      if (
        !Number.isInteger(a) ||
        !Number.isInteger(b) ||
        a < 0 ||
        a >= totalCells ||
        b < 0 ||
        b >= totalCells
      ) {
        return null
      }
      inequalities.push([a, b])
    }
  }
  return {
    boardSize,
    values,
    givenCells,
    originalGivenCells: givenCells,
    overriddenCells: [],
    inequalities,
    solvedValues: {},
    boardGeneration: 1,
  }
}

export function resolveInitialState(): InitialState {
  const url = parseUrlParams()
  // A shared board decoded into a PersistedBoard-shaped object (or null, failed closed).
  const boardState = decodeBoardParam(url.boardSize)
  const persisted = loadPersistedBoard()
  // hasUrl ORs in a VALID board so a board-only link isn't silently dropped.
  const hasUrl = url.boardSize !== null || boardState !== null

  // URL wins over storage: a valid shared board takes precedence over any saved game.
  if (boardState) {
    return { boardSize: boardState.boardSize, source: 'url-board', persisted: boardState }
  }

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

// Write `?board=` on an explicit share act only (never ambient). Separate from
// syncToUrl, which by design only ever `.set()`s `board_size` and never deletes.
export function writeBoardToUrl(encoded: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('board', encoded)
  history.replaceState(null, '', url.toString())
}

// Drop `?board=` on Randomize/Clear — the shared configuration is stale once a new
// board is dealt. A dedicated `.delete()` helper: syncToUrl never deletes keys. Guarded
// to the active game (`?game=futoshiki`) for symmetry with Sudoku's helper — Futoshiki's
// composable only mounts when active, so this is belt-and-suspenders, not load-bearing.
export function dropBoardParam() {
  const url = new URL(window.location.href)
  if (url.searchParams.get('game') !== 'futoshiki') return
  if (!url.searchParams.has('board')) return
  url.searchParams.delete('board')
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

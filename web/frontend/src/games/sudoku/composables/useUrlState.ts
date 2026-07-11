import { toBase64Url, fromBase64Url } from '@/lib/base64url'
import type { Difficulty } from '../types'

const STORAGE_KEY = 'sudoku-board-state'
const VALID_SIZES = [2, 3, 4]
const VALID_DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']

// 'url-board' — a shared `?board=` permalink was decoded into a full board and wins
// over storage (URL wins on load). Distinct from 'url-only' (bare size/difficulty) so
// the composable knows to RESTORE the synthesized board rather than auto-randomize.
export type InitSource = 'fresh' | 'url-only' | 'storage-only' | 'url+storage' | 'url-board'

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

function randomDifficulty(): Difficulty {
  return VALID_DIFFICULTIES[Math.floor(Math.random() * VALID_DIFFICULTIES.length)]
}

// ── Share-on-demand permalink codec (`?board=`) ─────────────────────────
// base64url of `${size}.${cells}` where `cells` is one base-36 char per cell
// value (0 = empty), length = size**4. Self-describing (carries its own size) so
// a board-only link — no `?size=` — still loads, and a mismatch fails closed. The
// base64url codec is hoisted to `@/lib/base64url` (shared with Futoshiki's).

export function encodeBoard(
  size: number,
  values: Record<string, number>,
  totalCells: number,
): string {
  let cells = ''
  for (let i = 0; i < totalCells; i++) cells += (values[String(i)] ?? 0).toString(36)
  return toBase64Url(`${size}.${cells}`)
}

// Synthesize a PersistedBoard from a decoded `?board=` — the only board-shaped
// object ever built from URL content (localStorage is the only other source).
// Non-zero cells become the givens (share = "solve this configuration"). Returns
// null — FAILING CLOSED — on any malformed/out-of-range/size-mismatched blob so a
// corrupt link degrades to the size/difficulty-only path, never a corrupt board.
function decodeBoardParam(
  urlSize: number | null,
  urlDifficulty: Difficulty | null,
): PersistedBoard | null {
  const raw = new URLSearchParams(window.location.search).get('board')
  if (!raw) return null
  let payload: string
  try {
    payload = fromBase64Url(raw)
  } catch {
    return null
  }
  const dot = payload.indexOf('.')
  if (dot < 1) return null
  const size = parseInt(payload.slice(0, dot), 10)
  if (!VALID_SIZES.includes(size)) return null
  // (c) a `?size=` that disagrees with the board's own size fails closed.
  if (urlSize !== null && urlSize !== size) return null
  const cells = payload.slice(dot + 1)
  const totalCells = size ** 4
  // (c) a length mismatch (wrong cell count for the declared size) fails closed.
  if (cells.length !== totalCells) return null
  const maxVal = size ** 2
  const values: Record<string, number> = {}
  const givenCells: string[] = []
  for (let i = 0; i < totalCells; i++) {
    const v = parseInt(cells[i]!, 36)
    if (!Number.isInteger(v) || v < 0 || v > maxVal) return null
    values[String(i)] = v
    if (v !== 0) givenCells.push(String(i))
  }
  return {
    size,
    difficulty: urlDifficulty ?? 'EASY',
    values,
    givenCells,
    originalGivenCells: givenCells,
    overriddenCells: [],
    solvedValues: {},
    boardGeneration: 1,
  }
}

export function resolveInitialState(): InitialState {
  const url = parseUrlParams()
  // (b) a shared board decoded into a PersistedBoard-shaped object (or null, failed closed).
  const boardState = decodeBoardParam(url.size, url.difficulty)
  const persisted = loadPersistedBoard()
  // (a) hasUrl ORs in a VALID board so a board-only link isn't silently dropped
  // (an invalid board already decoded to null → falls through to size/difficulty).
  const hasUrl = url.size !== null || url.difficulty !== null || boardState !== null

  // URL wins over storage: a valid shared board takes precedence over any saved game.
  if (boardState) {
    return {
      size: boardState.size,
      difficulty: boardState.difficulty,
      source: 'url-board',
      persisted: boardState,
    }
  }

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
    size: 3,
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

// Write `?board=` on an explicit share act only (never ambient — that would defeat
// the clean size/difficulty surface). Separate from syncToUrl, which by design only
// ever `.set()`s its own keys and never deletes.
export function writeBoardToUrl(encoded: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('board', encoded)
  history.replaceState(null, '', url.toString())
}

// Drop `?board=` on Randomize/Clear — the shared configuration is stale the moment a
// new board is dealt. A dedicated `.delete()` helper: syncToUrl never deletes keys.
// Only the ACTIVE game manages `?board=`: on a Futoshiki deep-link, App.vue still
// instantiates useSudoku in the background and its fire-and-forget init randomize would
// otherwise nuke Futoshiki's shared board before FutoshikiGame even mounts.
export function dropBoardParam() {
  const url = new URL(window.location.href)
  if (url.searchParams.get('game') === 'futoshiki') return
  if (!url.searchParams.has('board')) return
  url.searchParams.delete('board')
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

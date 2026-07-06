/**
 * Option-A (FastAPI backend) solve path for Futoshiki — the FALLBACK surface. Not on
 * `useFutoshiki`'s live path (that's the in-browser Worker, `useSolver.ts`); kept as
 * the drop-in server sibling with an identical `BoardResponse`/`SolveResponse` shape.
 *
 * Endpoints are the W10 api-surgeon routes (`web/api/src/app/games/futoshiki/`):
 *   GET  /api/v1/futoshiki/random/{board_size}   — generate (no difficulty param, F3)
 *   POST /api/v1/futoshiki/solve                 — solve a board + inequality set
 *
 * `board_size` on the wire, never bare `size` (F5). Every non-2xx surfaces a typed
 * `ApiError` parsed from the shared W4 envelope, split by `apiError.ts::classifyError`
 * into the teacher-red / paper-note fictions.
 */
import type { Inequality } from '../types'
import { apiErrorFromResponse } from '../lib/apiError'

const API_BASE = new URL('api/v1', document.baseURI).pathname

export interface BoardResponse {
  values: Record<string, number>
  boardSize: number
  inequalities: Inequality[]
}

export interface SolveResponse {
  solved: boolean
  values: Record<string, number>
  budgetExceeded?: boolean
}

/** Server response envelopes use snake_case `board_size` (F5). */
interface WireBoard {
  values: Record<string, number>
  board_size: number
  inequalities: [number, number][]
}
interface WireSolve {
  solved: boolean
  values: Record<string, number>
}

export function useApi() {
  async function getRandomBoard(boardSize: number): Promise<BoardResponse> {
    const res = await fetch(`${API_BASE}/futoshiki/random/${boardSize}`)
    if (!res.ok) throw await apiErrorFromResponse(res)
    const body = (await res.json()) as WireBoard
    return {
      values: body.values,
      boardSize: body.board_size,
      inequalities: body.inequalities.map(([a, b]) => [a, b] as Inequality),
    }
  }

  async function solveBoard(
    values: Record<string, number>,
    boardSize: number,
    inequalities: Inequality[],
    _nodeBudget?: number,
  ): Promise<SolveResponse> {
    const res = await fetch(`${API_BASE}/futoshiki/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values, inequalities, board_size: boardSize }),
    })
    if (!res.ok) throw await apiErrorFromResponse(res)
    const body = (await res.json()) as WireSolve
    return { solved: body.solved, values: body.values }
  }

  return { getRandomBoard, solveBoard }
}

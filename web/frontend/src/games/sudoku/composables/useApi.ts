import type { Difficulty } from '../types'
import { apiErrorFromResponse } from '../lib/apiError'

const API_BASE = new URL('api/v1', document.baseURI).pathname

export interface BoardResponse {
  values: Record<string, number>
  size: number
}

export interface SolveResponse {
  solved: boolean
  values: Record<string, number>
}

/**
 * Option-A solve path — the FastAPI backend. Not on `useSudoku`'s live path (that's
 * the in-browser Worker, `useSolver.ts`, W6), kept as the drop-in server sibling with
 * an identical `BoardResponse`/`SolveResponse` shape.
 *
 * Every non-2xx now surfaces a typed `ApiError` parsed from the shared W4 envelope
 * (`{error:{code,message,retryable}}`, `web/api/src/app/core/errors.py`) rather than a
 * bare `new Error("Solve failed: ...")` that erased the code. The caller's `catch` gets
 * a code-bearing error `apiError.ts::classifyError` can split into the teacher-red /
 * paper-note fictions (§1.4, §5.2) — killing the silent-error conflation where a network
 * fault masqueraded as a wrong answer (Pass-1 F5).
 */
export function useApi() {
  async function getRandomBoard(
    size: number,
    difficulty: Difficulty,
  ): Promise<BoardResponse> {
    const res = await fetch(`${API_BASE}/board/random/${size}/${difficulty}`)
    if (!res.ok) throw await apiErrorFromResponse(res)
    return res.json()
  }

  // `nodeBudget` mirrors `useSolver.solveBoard`'s signature (drop-in parity); the server
  // caps search on its own side, so it's forwarded when present and otherwise omitted.
  async function solveBoard(
    values: Record<string, number>,
    size: number,
    nodeBudget?: number,
  ): Promise<SolveResponse> {
    const res = await fetch(`${API_BASE}/board/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodeBudget === undefined ? { values, size } : { values, size, nodeBudget }),
    })
    if (!res.ok) throw await apiErrorFromResponse(res)
    return res.json()
  }

  return { getRandomBoard, solveBoard }
}

const API_BASE = new URL('api/v1', document.baseURI).pathname

export interface BoardResponse {
  values: Record<string, number>
  size: number
}

export interface SolveResponse {
  solved: boolean
  values: Record<string, number>
}

export function useApi() {
  async function getRandomBoard(
    size: number,
    difficulty: string,
  ): Promise<BoardResponse> {
    const res = await fetch(`${API_BASE}/board/random/${size}/${difficulty}`)
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Failed to get random board: ${text}`)
    }
    return res.json()
  }

  async function solveBoard(
    values: Record<string, number>,
    size: number,
  ): Promise<SolveResponse> {
    const res = await fetch(`${API_BASE}/board/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values, size }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Solve failed: ${text}`)
    }
    return res.json()
  }

  return { getRandomBoard, solveBoard }
}

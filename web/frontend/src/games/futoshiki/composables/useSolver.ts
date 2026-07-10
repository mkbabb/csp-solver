/**
 * Client-side wasm solve/generate path for Futoshiki — the DEFAULT surface (the
 * FastAPI `useApi.ts` is the fallback). The Futoshiki sibling of
 * `games/sudoku/composables/useSolver.ts`: same off-main-thread Worker discipline,
 * same `BoardResponse`/`SolveResponse` shapes so `useFutoshiki.ts` swaps between this
 * and `useApi.ts` by import alone.
 *
 * Zero `/api/v1/*` dependency of any kind — no fetch, no `/config` handshake — so it
 * degrades gracefully when the API origin is absent. Unlike Sudoku there is no
 * template bank: generation is a fresh wasm `generateFutoshiki` call each time (seeded
 * from `Date.now()`), returning the given grid AND the printed inequality furniture.
 *
 * The wasm module only ever runs inside `solver.worker.ts` (off the DOM thread); see
 * that file's header. The `@mkbabb/csp-solver-wasm` import there is the package name —
 * the W12 registry swap flips only `package.json`, no source change.
 */
import type { Inequality } from '../types'
import { SolverError, isSerializedSolverError, type SolverErrorCode } from '../lib/solverError'
import type { SolverRequest, SolverResponse } from '../protocol'

export interface BoardResponse {
  values: Record<string, number>
  boardSize: number
  /** The printed `[greater, lesser]` inequality furniture for this board. */
  inequalities: Inequality[]
}

export interface SolveResponse {
  solved: boolean
  values: Record<string, number>
  /** `true` when the search gave up at its node budget without a solution-consistent
   * completion — distinct from provable UNSAT (`solved: false`). */
  budgetExceeded?: boolean
}

let worker: Worker | null = null
let nextId = 1
const pending = new Map<number, { resolve: (r: SolverResponse) => void; reject: (e: Error) => void }>()

function ensureWorker(): Worker {
  if (worker) return worker
  worker = new Worker(new URL('../solver.worker.ts', import.meta.url), { type: 'module' })
  worker.addEventListener('message', (event: MessageEvent<SolverResponse>) => {
    const res = event.data
    const p = pending.get(res.id)
    if (!p) return
    pending.delete(res.id)
    p.resolve(res)
  })
  worker.addEventListener('error', (event: ErrorEvent) => {
    // A worker-level error (e.g. the wasm module failed to instantiate) has no request
    // `id` to correlate — reject every in-flight call so nothing hangs forever.
    for (const [id, p] of pending) {
      p.reject(new SolverError('WORKER_FAILURE', event.message || 'solver worker crashed'))
      pending.delete(id)
    }
  })
  return worker
}

function call(req: SolverRequest, transfer: ArrayBuffer[]): Promise<SolverResponse> {
  return new Promise((resolve, reject) => {
    pending.set(req.id, { resolve, reject })
    ensureWorker().postMessage(req, transfer)
  })
}

function toFlatBoard(boardSize: number, values: Record<string, number>): Uint32Array<ArrayBuffer> {
  const buf = new Uint32Array(boardSize * boardSize)
  for (const [k, v] of Object.entries(values)) buf[Number(k)] = v
  return buf
}

function toFlatInequalities(inequalities: Inequality[]): Uint32Array<ArrayBuffer> {
  const buf = new Uint32Array(inequalities.length * 2)
  inequalities.forEach(([a, b], i) => {
    buf[i * 2] = a
    buf[i * 2 + 1] = b
  })
  return buf
}

function toRecord(board: Uint32Array): Record<string, number> {
  const o: Record<string, number> = {}
  board.forEach((v, i) => {
    o[i] = v
  })
  return o
}

function toPairs(flat: Uint32Array): Inequality[] {
  const out: Inequality[] = []
  for (let i = 0; i + 1 < flat.length; i += 2) out.push([flat[i], flat[i + 1]])
  return out
}

function throwIfError(res: SolverResponse): void {
  if (res.ok === false) {
    if (isSerializedSolverError(res)) {
      throw new SolverError(res.code as SolverErrorCode, res.message)
    }
    throw new SolverError('WORKER_FAILURE', 'unknown worker failure')
  }
}

export function useSolver() {
  async function getRandomBoard(boardSize: number): Promise<BoardResponse> {
    const id = nextId++
    const res = await call({ id, kind: 'generate', boardSize, seed: Date.now() }, [])
    throwIfError(res)
    if (res.ok && res.kind === 'generate') {
      return {
        values: toRecord(res.board),
        boardSize: res.boardSize,
        inequalities: toPairs(res.inequalities),
      }
    }
    throw new SolverError('WORKER_FAILURE', 'malformed generate response')
  }

  async function solveBoard(
    values: Record<string, number>,
    boardSize: number,
    inequalities: Inequality[],
    nodeBudget?: number,
  ): Promise<SolveResponse> {
    const board = toFlatBoard(boardSize, values)
    const flatIneqs = toFlatInequalities(inequalities)
    const id = nextId++
    const res = await call(
      { id, kind: 'solve', board, boardSize, inequalities: flatIneqs, maxSolutions: 1, nodeBudget },
      [board.buffer, flatIneqs.buffer],
    )
    throwIfError(res)
    if (res.ok && res.kind === 'solve') {
      const cells = boardSize * boardSize
      return {
        solved: res.solved,
        values: res.solved ? toRecord(res.solutions.subarray(0, cells)) : values,
        budgetExceeded: res.budgetExceeded,
      }
    }
    throw new SolverError('WORKER_FAILURE', 'malformed solve response')
  }

  return { getRandomBoard, solveBoard }
}

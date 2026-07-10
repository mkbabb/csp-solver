/**
 * Client-side wasm replacement for `useApi.ts` — Option C (zero-backend
 * deploy). Same `BoardResponse`/`SolveResponse` shapes as `useApi.ts` so
 * `useSudoku.ts` needs zero changes beyond swapping the import
 * (client-wasm-solve.md §6.1's "useApi replacement shape", now built
 * rather than sketched).
 *
 * Zero `/api/v1/*` dependency of any kind — no `fetch`, no `/config`
 * endpoint (unlike `useApi.ts`'s sibling prototype, which fetches
 * `GET /api/v1/config` for a shared `AbortSignal.timeout`; that mechanism
 * is inherently server-relative and does not apply here — Option C has no
 * server to ask, and the worker's own promise rejection is the only
 * "timeout" signal this composable needs). This is the wave §Residual
 * "degrade gracefully when the API origin is absent" guarantee, met
 * structurally: there is no origin to be absent. Template boards are
 * resolved from the bundled `../data/templates.ts` asset (generated at
 * build time by the `sudokuTemplates` Vite plugin from the canonical
 * `csp-solver/data/sudoku_puzzles/` bank — single source of truth, never
 * hand-copied), never fetched.
 *
 * The actual wasm module only ever runs inside `solver.worker.ts` — see
 * that file's header for why (keeps solve/generate off the main thread
 * so the boil never janks) and for how it's imported
 * (`@mkbabb/csp-solver-wasm`, a `file:` link to the local pkg for now).
 *
 * ── Registry-package swap (W12, after the wasm-surgeon + LEAD land) ──
 * 1. `npm i @mkbabb/csp-solver-wasm@^0.1.x` (publishes off `csp-solver/wasm`).
 * 2. In `package.json`, flip the dep value `file:../../csp-solver/wasm/pkg`
 *    → the semver range. The `solver.worker.ts` import (`@mkbabb/csp-solver-wasm`)
 *    is already the package name, so no source changes.
 * 3. `csp-solver/wasm/pkg` reverts to pure build output (it's git-ignored);
 *    nothing in the frontend tree references it directly.
 */
import type { Difficulty } from '../types'
import { TEMPLATE_BANK } from '../data/templates'
import { SolverError, isSerializedSolverError, type SolverErrorCode } from '../lib/solverError'
import type { SolverRequest, SolverResponse } from '../protocol'

export interface BoardResponse {
  values: Record<string, number>
  size: number
}

export interface SolveResponse {
  solved: boolean
  values: Record<string, number>
  /** `true` when the search gave up at its node budget without finding a
   * solution-consistent completion of the given cells — see `useSolver`'s
   * `solveBoard` doc for how this composes with `SolverError`. */
  budgetExceeded?: boolean
}

const DIFFICULTY_ORDINAL: Record<Difficulty, number> = { EASY: 0, MEDIUM: 1, HARD: 2 }
const DIFFICULTY_KEY: Record<Difficulty, 'easy' | 'medium' | 'hard'> = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
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
    // A worker-level error (e.g. the wasm module failed to instantiate)
    // has no request `id` to correlate — reject every in-flight call so
    // nothing hangs forever.
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

function toFlat(size: number, values: Record<string, number>): Uint32Array<ArrayBuffer> {
  const m = size * size
  const buf = new Uint32Array(m * m)
  for (const [k, v] of Object.entries(values)) buf[Number(k)] = v
  return buf
}

function toRecord(board: Uint32Array): Record<string, number> {
  const o: Record<string, number> = {}
  board.forEach((v, i) => {
    o[i] = v
  })
  return o
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
  async function getRandomBoard(size: number, difficulty: Difficulty): Promise<BoardResponse> {
    const boards = TEMPLATE_BANK[size]?.[DIFFICULTY_KEY[difficulty]] ?? []
    const total = (size * size) ** 2
    const templates = new Uint32Array(boards.length * total)
    boards.forEach((b, i) => templates.set(b, i * total))

    const id = nextId++
    const res = await call(
      {
        id,
        kind: 'generate',
        n: size,
        difficulty: DIFFICULTY_ORDINAL[difficulty],
        seed: Date.now(),
        templates,
      },
      [templates.buffer],
    )
    throwIfError(res)
    if (res.ok && res.kind === 'generate') {
      return { values: toRecord(res.board), size }
    }
    throw new SolverError('WORKER_FAILURE', 'malformed generate response')
  }

  /**
   * `nodeBudget` is optional and defaults to the wasm surface's own
   * default (1,000,000 nodes, `SolveConfig::default()`). A caller that
   * wants a browser-tab-scale cap (e.g. to keep a 16x16-hard board from
   * running unbounded on a low-power device) can pass a tighter value;
   * see `solver.worker.ts` for how a `BUDGET_EXCEEDED` `SolverError`
   * from a too-tight budget propagates back through the worker boundary
   * as a typed, `instanceof Error`, `.code`-bearing exception rather
   * than a silently-wrong `solved: false`.
   */
  async function solveBoard(
    values: Record<string, number>,
    size: number,
    nodeBudget?: number,
  ): Promise<SolveResponse> {
    const board = toFlat(size, values)
    const id = nextId++
    const res = await call(
      { id, kind: 'solve', board, n: size, maxSolutions: 1, nodeBudget },
      [board.buffer],
    )
    throwIfError(res)
    if (res.ok && res.kind === 'solve') {
      return {
        solved: res.solved,
        // `solved=false` iff the given cells conflict with every
        // completion — same semantics the FastAPI backend returns
        // (useApi.ts's sibling contract).
        values: res.solved ? toRecord(res.solutions.subarray(0, size ** 4)) : values,
        budgetExceeded: res.budgetExceeded,
      }
    }
    throw new SolverError('WORKER_FAILURE', 'malformed solve response')
  }

  return { getRandomBoard, solveBoard }
}

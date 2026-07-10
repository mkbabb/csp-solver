/**
 * Web Worker host for the client-side wasm Futoshiki solver + generator.
 *
 * The Futoshiki sibling of `games/sudoku/solver.worker.ts` (games never import each
 * other — this is an owned port, not a shared module). Runs entirely off the main
 * thread so a hard solve never janks the ~6.7fps grid boil, and carries ZERO fetch /
 * `/api/v1/*` dependency — this in-browser Worker is the only shipped solve path.
 *
 * The wasm module is imported by package name (`@mkbabb/csp-solver-wasm`, a `file:`
 * link to the local `csp-solver/wasm/pkg`); the same binary already serves the Sudoku
 * worker. `solveFutoshiki` / `generateFutoshiki` are the purpose-built flat-wire
 * exports (`csp-solver/wasm/src/futoshiki.rs`, option (b)).
 */
import init, {
  generateFutoshiki,
  propagateFutoshiki,
  solveFutoshiki,
} from '@mkbabb/csp-solver-wasm'
// `--target web` fetches its `.wasm` via `new URL(..., import.meta.url)`, which Vite
// can't resolve from a bundled/HMR'd Worker — import the binary through the `?url`
// asset pipeline and hand the resolved URL to `init` (correct in dev + build).
import wasmUrl from '@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm?url'
import type { SolverRequest, SolverResponse } from './protocol'
import type { SolverErrorCode } from './lib/solverError'

let ready: Promise<unknown> | null = null
function ensureInit(): Promise<unknown> {
  if (ready === null) ready = init({ module_or_path: wasmUrl })
  return ready
}

/** wasm throws a real `js_sys::Error` with a `.code` string reflected onto it (see
 * `futoshiki.rs`, reusing `sudoku.rs::coded_error`). Extract `.code`/`.message` here,
 * INSIDE the worker, and post back a plain object — never the `Error` instance itself
 * (structured-clone of non-standard own properties like `.code` is not uniform across
 * engines). */
function describeError(e: unknown): { code: SolverErrorCode; message: string } {
  if (e && typeof e === 'object' && 'code' in e && typeof (e as { code: unknown }).code === 'string') {
    const code = (e as { code: string }).code
    if (code === 'INVALID_INPUT' || code === 'BUDGET_EXCEEDED' || code === 'UNSAT') {
      return { code, message: e instanceof Error ? e.message : String(e) }
    }
  }
  return { code: 'WORKER_FAILURE', message: e instanceof Error ? e.message : String(e) }
}

self.addEventListener('message', async (event: MessageEvent<SolverRequest>) => {
  const req = event.data
  try {
    await ensureInit()

    if (req.kind === 'solve') {
      const t0 = performance.now()
      const result = solveFutoshiki(
        req.board,
        req.boardSize,
        req.inequalities,
        req.maxSolutions,
        req.nodeBudget,
      )
      const elapsedMs = performance.now() - t0
      const solutions = result.solutions // Uint32Array, copied out of wasm memory
      const response: SolverResponse = {
        id: req.id,
        ok: true,
        kind: 'solve',
        solved: result.solved,
        solutionCount: result.solutionCount,
        boardSize: result.boardSize,
        solutions,
        backtracks: result.backtracks.toString(),
        budgetExceeded: result.budgetExceeded,
        elapsedMs,
      }
      result.free()
      ;(self as unknown as Worker).postMessage(response, [solutions.buffer])
      return
    }

    if (req.kind === 'propagate') {
      // Propagate-only op (W6 beat 9 — engine-domains pencil marks, twin of the
      // Sudoku worker's): AC-3/GAC to a fixpoint, zero search. Synchronous and
      // sub-solve cheap, but it rides the same worker so the main thread never
      // blocks on wasm.
      const masks = propagateFutoshiki(req.board, req.boardSize, req.inequalities)
      const response: SolverResponse = {
        id: req.id,
        ok: true,
        kind: 'propagate',
        boardSize: req.boardSize,
        masks,
      }
      ;(self as unknown as Worker).postMessage(response, [masks.buffer])
      return
    }

    // kind === 'generate' — the wasm generator needs an explicit seed (no wall clock
    // on wasm32); JS supplies the entropy (`Date.now()`).
    const puzzle = generateFutoshiki(req.boardSize, req.seed)
    const board = puzzle.board
    const inequalities = puzzle.inequalities
    const boardSize = puzzle.boardSize
    puzzle.free()
    const response: SolverResponse = {
      id: req.id,
      ok: true,
      kind: 'generate',
      board,
      inequalities,
      boardSize,
    }
    ;(self as unknown as Worker).postMessage(response, [board.buffer, inequalities.buffer])
  } catch (e) {
    const { code, message } = describeError(e)
    const response: SolverResponse = { id: req.id, ok: false, code, message }
    ;(self as unknown as Worker).postMessage(response)
  }
})

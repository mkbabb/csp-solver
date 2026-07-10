/**
 * Web Worker host for the client-side wasm Sudoku solver.
 *
 * Runs entirely off the main thread: `solveSudoku`/`generateSudoku` are
 * synchronous and block whatever thread calls them — this file is *why*
 * that block never reaches the DOM-owning main thread, so the ~6.7fps
 * grid boil (rAF on the main thread) keeps ticking through a hard solve
 * or generate instead of janking. Per pass-2's client-side generation
 * probe (`docs/tranches/2026-07-tranche-2/evidence/pass2/P2.md`, "THE
 * GATE"), all six generation tiers (N2/N3 × easy/medium/hard) clear
 * p95 ≤ 24ms, comfortably under the 50ms felt-latency budget.
 *
 * Zero fetch, zero `/api/v1/*` dependency of any kind — see
 * `useSolver.ts`'s header comment for the same guarantee at the
 * composable boundary. Templates are supplied by the caller (already
 * resolved from the bundled `data/templates.ts` asset on the main
 * thread) and cross as a transferable `Uint32Array`, never fetched
 * here.
 *
 * The wasm module is imported by *package name* (`@mkbabb/csp-solver-wasm`,
 * a `file:` link to the local `csp-solver/wasm/pkg` today). When the LEAD
 * publishes the registry package the import here does not change — only
 * the `package.json` version spec flips from `file:` to a semver range.
 * See `useSolver.ts`'s header for the full swap procedure.
 */
import init, {
  generateSudoku,
  propagateSudoku,
  solveSudoku,
  type SudokuDifficulty,
} from '@mkbabb/csp-solver-wasm'
// The `--target web` module fetches its `.wasm` from `new URL(..., import.meta.url)`
// by default; under Vite that URL does not resolve from a bundled/HMR'd Worker.
// Import the binary through Vite's `?url` asset pipeline instead and hand the
// resolved URL to `init` — correct in both dev (served asset) and build
// (emitted, hashed asset).
import wasmUrl from '@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm?url'
import type { SolverRequest, SolverResponse } from './protocol'
import type { SolverErrorCode } from './solverError'

let ready: Promise<unknown> | null = null
function ensureInit(): Promise<unknown> {
  if (ready === null) ready = init({ module_or_path: wasmUrl })
  return ready
}

/** wasm throws a real `js_sys::Error` with a `.code` string reflected
 * onto it (see `csp-solver/wasm/src/sudoku.rs::coded_error`). Extract
 * `.code`/`.message` here, *inside* the worker, and post back a plain
 * object — never the `Error` instance itself. Structured-clone support
 * for `Error` (and fidelity of non-standard own properties like `.code`
 * specifically) is not uniform across browser engines/versions; a
 * plain `{code, message}` literal is unambiguously structured-cloneable
 * everywhere, so this is the actual mechanism that makes "BudgetExceeded
 * surfaces as a typed error through the worker" true rather than
 * incidental to whichever engine runs the test.
 */
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
      const result = solveSudoku(req.board, req.n, req.maxSolutions, req.nodeBudget)
      const elapsedMs = performance.now() - t0
      const solutions = result.solutions // Uint32Array, copy out of wasm memory
      const response: SolverResponse = {
        id: req.id,
        ok: true,
        kind: 'solve',
        solved: result.solved,
        solutionCount: result.solutionCount,
        n: result.n,
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
      // Propagate-only op (W6 beat 9 — engine-domains pencil marks): AC-3/GAC
      // to a fixpoint, zero search. Synchronous and sub-solve cheap, but it
      // rides the same worker so the main thread never blocks on wasm.
      const masks = propagateSudoku(req.board, req.n)
      const response: SolverResponse = {
        id: req.id,
        ok: true,
        kind: 'propagate',
        n: req.n,
        masks,
      }
      ;(self as unknown as Worker).postMessage(response, [masks.buffer])
      return
    }

    // kind === 'generate' — the wire carries the difficulty as its numeric
    // ordinal (structured-clone-safe); re-narrow to the wasm enum here.
    const board = generateSudoku(
      req.n,
      req.difficulty as SudokuDifficulty,
      req.seed,
      req.templates,
    )
    const response: SolverResponse = { id: req.id, ok: true, kind: 'generate', board }
    ;(self as unknown as Worker).postMessage(response, [board.buffer])
  } catch (e) {
    const { code, message } = describeError(e)
    const response: SolverResponse = { id: req.id, ok: false, code, message }
    ;(self as unknown as Worker).postMessage(response)
  }
})

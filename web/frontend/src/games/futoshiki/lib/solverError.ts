/**
 * Typed error surfaced across the Futoshiki solver Worker boundary.
 *
 * Structurally identical to games/sudoku/lib/solverError.ts (the two games never
 * import each other — the boundary is enforced — so this is an owned copy, not a
 * shared import). The wasm module throws a real `js_sys::Error` with a `.code`
 * string stamped on it (`csp-solver/wasm/src/{sudoku,futoshiki}.rs::coded_error`);
 * that error is caught INSIDE the worker and re-serialized to a plain
 * `{code, message}` object before crossing `postMessage`, since structured-clone
 * of `Error` own-properties (`.code`) is not uniform across engines.
 */
export type SolverErrorCode = 'INVALID_INPUT' | 'BUDGET_EXCEEDED' | 'UNSAT' | 'WORKER_FAILURE'

export class SolverError extends Error {
  readonly code: SolverErrorCode

  constructor(code: SolverErrorCode, message: string) {
    super(message)
    this.name = 'SolverError'
    this.code = code
  }
}

/** Plain, structured-clone-safe shape the worker posts back on failure. */
export interface SerializedSolverError {
  code: SolverErrorCode
  message: string
}

export function isSerializedSolverError(v: unknown): v is SerializedSolverError {
  return (
    typeof v === 'object' &&
    v !== null &&
    'code' in v &&
    'message' in v &&
    typeof (v as { code: unknown }).code === 'string' &&
    typeof (v as { message: unknown }).message === 'string'
  )
}

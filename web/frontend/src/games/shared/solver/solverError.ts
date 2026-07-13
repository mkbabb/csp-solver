/**
 * Typed error surfaced across the solver Worker boundary — single-sourced for both
 * games (T4-W4 solver-seam dedup; the two copies were byte-identical).
 *
 * The wasm module throws a real `js_sys::Error` with a `.code` string property stamped
 * on it (`csp-solver/wasm/src/{sudoku,futoshiki}.rs::coded_error`). That error is caught
 * *inside* the worker and re-serialized to a plain `{code, message}` object before
 * crossing `postMessage` — deliberately, not relying on the browser's own
 * structured-clone of `Error` objects, whose handling of non-standard own properties
 * (like `.code`) is not uniform across engines/versions. The plain shape is guaranteed
 * structured-cloneable everywhere; `SolverError` is reconstructed with the original
 * `.code` on the main-thread side of the boundary.
 */
export type SolverErrorCode =
  "INVALID_INPUT" | "BUDGET_EXCEEDED" | "UNSAT" | "WORKER_FAILURE";

export class SolverError extends Error {
  readonly code: SolverErrorCode;

  constructor(code: SolverErrorCode, message: string) {
    super(message);
    this.name = "SolverError";
    this.code = code;
  }
}

/** Plain, structured-clone-safe shape the worker posts back on failure. */
export interface SerializedSolverError {
  code: SolverErrorCode;
  message: string;
}

export function isSerializedSolverError(v: unknown): v is SerializedSolverError {
  return (
    typeof v === "object" &&
    v !== null &&
    "code" in v &&
    "message" in v &&
    typeof (v as { code: unknown }).code === "string" &&
    typeof (v as { message: unknown }).message === "string"
  );
}

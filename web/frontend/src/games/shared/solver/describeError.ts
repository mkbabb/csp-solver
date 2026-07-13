import type { SolverErrorCode } from "./solverError";

/**
 * Map a value thrown INSIDE the solver Worker to the plain, structured-clone-safe
 * `{code, message}` failure frame posted back across `postMessage`. Single-sourced for
 * both games (T4-W4 solver-seam dedup; the two copies were byte-identical). Kept out of
 * `solver.worker.ts` so the mapping is unit-testable without instantiating the wasm
 * Worker (T4-W2 FE-unit layer) — each Worker just imports it.
 *
 * A wasm error carries a `.code` string (`csp-solver/wasm/src/{sudoku,futoshiki}.rs::
 * coded_error`); only the three the solver can actually raise (INVALID_INPUT |
 * BUDGET_EXCEEDED | UNSAT) pass through. Anything else — no `.code`, an unknown/non-string
 * `.code`, a non-Error throw — collapses to WORKER_FAILURE, so a broken worker never
 * masquerades as graded wrong work (the silent-error architecture this split killed; see
 * `classifyError.ts`).
 */
export function describeError(e: unknown): { code: SolverErrorCode; message: string } {
  if (
    e &&
    typeof e === "object" &&
    "code" in e &&
    typeof (e as { code: unknown }).code === "string"
  ) {
    const code = (e as { code: string }).code;
    if (code === "INVALID_INPUT" || code === "BUDGET_EXCEEDED" || code === "UNSAT") {
      return { code, message: e instanceof Error ? e.message : String(e) };
    }
  }
  return {
    code: "WORKER_FAILURE",
    message: e instanceof Error ? e.message : String(e),
  };
}

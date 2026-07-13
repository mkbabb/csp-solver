/**
 * Web Worker host for the client-side wasm Futoshiki solver + generator.
 *
 * The Futoshiki sibling of `games/sudoku/solver/solver.worker.ts` (games never import each
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
  type FutoshikiDifficulty,
} from "@mkbabb/csp-solver-wasm";
// `--target web` fetches its `.wasm` via `new URL(..., import.meta.url)`, which Vite
// can't resolve from a bundled/HMR'd Worker — import the binary through the `?url`
// asset pipeline and hand the resolved URL to `init` (correct in dev + build).
import wasmUrl from "@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm?url";
import type { SolverRequest, SolverResponse } from "./protocol";
// `describeError` (wasm-error → structured-clone-safe `{code, message}` frame) is
// single-sourced in the shared module so the mapping is unit-testable without instantiating
// this Worker (T4-W2) and shared with the Sudoku worker (T4-W4 solver-seam dedup).
import { describeError } from "@games/shared/solver/describeError";

let ready: Promise<unknown> | null = null;
function ensureInit(): Promise<unknown> {
  if (ready === null) ready = init({ module_or_path: wasmUrl });
  return ready;
}

self.addEventListener("message", async (event: MessageEvent<SolverRequest>) => {
  const req = event.data;
  try {
    await ensureInit();

    // Explicit request contract (SEC-4b): a typed `switch` on the discriminant, not a
    // wasm-bindgen-incidental fall-through — an unknown `kind` is rejected by the `default`
    // guard rather than silently routed into `generate`.
    switch (req.kind) {
      case "ping": {
        // Cold-start prewarm (T3-W8 §cold-start): `ensureInit()` above already
        // instantiated the wasm; pong back so the main thread can log that the
        // worker is hot before the first real solve/generate.
        const response: SolverResponse = { id: req.id, ok: true, kind: "ping" };
        (self as unknown as Worker).postMessage(response);
        return;
      }

      case "solve": {
        const t0 = performance.now();
        const result = solveFutoshiki(
          req.board,
          req.boardSize,
          req.inequalities,
          req.maxSolutions,
          req.nodeBudget,
        );
        const elapsedMs = performance.now() - t0;
        const solutions = result.solutions; // Uint32Array, copied out of wasm memory
        const response: SolverResponse = {
          id: req.id,
          ok: true,
          kind: "solve",
          solved: result.solved,
          solutionCount: result.solutionCount,
          boardSize: result.boardSize,
          solutions,
          backtracks: result.backtracks.toString(),
          nodesExplored: result.nodesExplored.toString(),
          propagations: result.propagations.toString(),
          budgetExceeded: result.budgetExceeded,
          elapsedMs,
        };
        result.free();
        (self as unknown as Worker).postMessage(response, [solutions.buffer]);
        return;
      }

      case "propagate": {
        // Propagate-only op (W6 beat 9 — engine-domains pencil marks, twin of the
        // Sudoku worker's): AC-3/GAC to a fixpoint, zero search. Synchronous and
        // sub-solve cheap, but it rides the same worker so the main thread never
        // blocks on wasm.
        const masks = propagateFutoshiki(req.board, req.boardSize, req.inequalities);
        const response: SolverResponse = {
          id: req.id,
          ok: true,
          kind: "propagate",
          boardSize: req.boardSize,
          masks,
        };
        (self as unknown as Worker).postMessage(response, [masks.buffer]);
        return;
      }

      case "generate": {
        // The wasm generator needs an explicit seed (no wall clock on wasm32); JS supplies
        // the entropy (`Date.now()`). The wire carries the difficulty as its numeric ordinal
        // (structured-clone-safe); re-narrow to the wasm enum here (twin of the sudoku worker).
        const puzzle = generateFutoshiki(
          req.boardSize,
          req.difficulty as FutoshikiDifficulty,
          req.seed,
        );
        const board = puzzle.board;
        const inequalities = puzzle.inequalities;
        const boardSize = puzzle.boardSize;
        puzzle.free();
        const response: SolverResponse = {
          id: req.id,
          ok: true,
          kind: "generate",
          board,
          inequalities,
          boardSize,
        };
        (self as unknown as Worker).postMessage(response, [
          board.buffer,
          inequalities.buffer,
        ]);
        return;
      }

      default: {
        // Request-shape validation (SEC-4b, defense-in-depth): the discriminated union is
        // exhaustive at compile time, but a malformed postMessage can still arrive at
        // runtime — reject an unknown `kind` explicitly (→ WORKER_FAILURE via the catch)
        // rather than passing unvalidated fields into wasm-bindgen.
        throw new Error(
          `unknown solver request kind: ${String((req as { kind?: unknown }).kind)}`,
        );
      }
    }
  } catch (e) {
    const { code, message } = describeError(e);
    const response: SolverResponse = { id: req.id, ok: false, code, message };
    (self as unknown as Worker).postMessage(response);
  }
});

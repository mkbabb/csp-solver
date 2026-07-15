/**
 * Web Worker host for the client-side wasm KenKen / Calcudoku solver — the twin of the
 * Sudoku/Futoshiki/Thermo/Killer workers (T4-W13). Runs entirely off the main thread so the
 * grid boil never janks through a hard solve or generate.
 *
 * Zero fetch, zero `/api/v1/*` dependency. The wasm module is imported by package name
 * (`@mkbabb/csp-solver-wasm`, a `file:` link to the local `csp-solver/wasm/pkg` today);
 * `solveKenKen`/`generateKenKen`/`propagateKenKen` are the T4-W13 flat-buffer surface. Cages
 * cross as a length-prefixed `Uint32Array` (`[k, op, target, c, c, …]` per cage), decoded
 * inside the wasm. Difficulty reuses the futoshiki Latin axis (`FutoshikiDifficulty`).
 */
import init, {
  generateKenKen,
  propagateKenKen,
  solveKenKen,
  type FutoshikiDifficulty,
} from "@mkbabb/csp-solver-wasm";
import wasmUrl from "@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm?url";
import type { SolverRequest, SolverResponse } from "./protocol";
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

    switch (req.kind) {
      case "ping": {
        const response: SolverResponse = { id: req.id, ok: true, kind: "ping" };
        (self as unknown as Worker).postMessage(response);
        return;
      }

      case "solve": {
        const t0 = performance.now();
        const result = solveKenKen(
          req.board,
          req.boardSize,
          req.cages,
          req.maxSolutions,
          req.nodeBudget,
        );
        const elapsedMs = performance.now() - t0;
        const solutions = result.solutions; // Uint32Array, copy out of wasm memory
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
        const masks = propagateKenKen(req.board, req.boardSize, req.cages);
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
        const data = generateKenKen(
          req.boardSize,
          req.difficulty as FutoshikiDifficulty,
          req.seed,
        );
        const board = data.board;
        const cages = data.cages;
        const response: SolverResponse = {
          id: req.id,
          ok: true,
          kind: "generate",
          board,
          cages,
          boardSize: data.boardSize,
        };
        data.free();
        (self as unknown as Worker).postMessage(response, [board.buffer, cages.buffer]);
        return;
      }

      default: {
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

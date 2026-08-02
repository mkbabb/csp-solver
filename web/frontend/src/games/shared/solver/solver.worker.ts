/**
 * THE solver Worker — one module, five families, one wasm binary (T5-W2 2.2 / F3).
 *
 * Five per-game workers (634 raw lines) ran the SAME message loop over the SAME binary. Their
 * `ensureInit` was byte-identical five times over (md5 `262633211412`, DIVERGED×0) and each one
 * carried its own `?url` import of the same `.wasm`, so the built dist emitted five worker
 * chunks all fetching one 121 kB module. What actually differed was three function names per
 * game — which is a table, not a module. So it is a table now, and the loop is written once.
 *
 * Runs entirely off the main thread: the wasm verbs are synchronous and block whatever thread
 * calls them — this file is *why* that block never reaches the DOM-owning main thread, so the
 * grid boil keeps ticking through a hard solve or generate instead of janking.
 *
 * Zero fetch, zero `/api/v1/*` dependency of any kind. The wasm module is imported by package
 * name (`@mkbabb/csp-solver-wasm`, a `file:` link to the local `csp-solver/wasm/pkg` today);
 * the registry swap flips only `package.json`, never a line here.
 */
import init, {
  generateFutoshiki,
  generateKenKen,
  generateKiller,
  generateSudoku,
  generateThermo,
  propagateFutoshiki,
  propagateKenKen,
  propagateKiller,
  propagateSudoku,
  propagateThermo,
  solveFutoshiki,
  solveKenKen,
  solveKiller,
  solveSudoku,
  solveThermo,
  type FutoshikiDifficulty,
  type SudokuDifficulty,
} from "@mkbabb/csp-solver-wasm";
// The `--target web` module fetches its `.wasm` from `new URL(..., import.meta.url)` by
// default; under Vite that URL does not resolve from a bundled/HMR'd Worker. Import the binary
// through Vite's `?url` asset pipeline instead and hand the resolved URL to `init` — correct in
// both dev (served asset) and build (emitted, hashed asset).
//
// THE ONE `?url` SITE (2.2a, `solverSpine.urlContractSites: 1`). It was five, one per worker,
// which is five modules that all had to be found and edited together for any change to the
// binary's delivery — I3's whole blast radius. It is this line.
import wasmUrl from "@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm?url";
import type { GameId, SolverRequest, SolverResponse } from "./protocol";
// `describeError` (wasm-error → structured-clone-safe `{code, message}` frame) is single-sourced
// in the shared module so the mapping is unit-testable without instantiating this Worker (T4-W2).
// A plain `{code, message}` literal — never the `Error` instance — is what crosses `postMessage`,
// since structured-clone fidelity of non-standard own props (`.code`) is not uniform across
// engines.
import { describeError } from "./describeError";

let ready: Promise<unknown> | null = null;
/** The ONE `ensureInit`. It was this exact function, five times, byte for byte. */
function ensureInit(): Promise<unknown> {
  if (ready === null) ready = init({ module_or_path: wasmUrl });
  return ready;
}

/** A family that prints no clue furniture answers with an empty buffer — never a null on the
 *  wire. Fresh each call: the buffer is TRANSFERRED, and a transferred buffer is detached. */
const noClue = (): Uint32Array<ArrayBuffer> => new Uint32Array(0);

/** The wasm solve-result surface, structurally — the five `*SolveResult` classes share it. */
interface SolveResultLike {
  readonly solved: boolean;
  readonly solutionCount: number;
  readonly solutions: Uint32Array;
  readonly backtracks: bigint;
  readonly nodesExplored: bigint;
  readonly propagations: bigint;
  readonly budgetExceeded: boolean;
  free(): void;
}

/**
 * One family = the three wasm verbs that game is solved by, adapted to the one wire. The
 * adapters are thin on purpose: every one is a call and a rename, so a family row can be read
 * against `csp-solver/wasm/src/<game>.rs` in a glance.
 */
interface Family {
  generate: (
    dim: number,
    difficulty: number,
    seed: number,
    templates: Uint32Array,
  ) => { board: Uint32Array; clue: Uint32Array };
  solve: (
    board: Uint32Array,
    dim: number,
    clue: Uint32Array,
    maxSolutions: number | undefined,
    nodeBudget: number | undefined,
  ) => SolveResultLike;
  propagate: (board: Uint32Array, dim: number, clue: Uint32Array) => Uint32Array;
}

const FAMILIES: Record<GameId, Family> = {
  // The one family that digs from a bank instead of generating live, and the one that prints
  // no clue furniture — both facts show up here as arguments, not as a forked module.
  sudoku: {
    generate: (dim, difficulty, seed, templates) => ({
      board: generateSudoku(dim, difficulty as SudokuDifficulty, seed, templates),
      clue: noClue(),
    }),
    solve: (board, dim, _clue, maxSolutions, nodeBudget) =>
      solveSudoku(board, dim, maxSolutions, nodeBudget),
    propagate: (board, dim) => propagateSudoku(board, dim),
  },
  futoshiki: {
    generate: (dim, difficulty, seed) => {
      const puzzle = generateFutoshiki(dim, difficulty as FutoshikiDifficulty, seed);
      const dealt = { board: puzzle.board, clue: puzzle.inequalities };
      puzzle.free();
      return dealt;
    },
    solve: (board, dim, clue, maxSolutions, nodeBudget) =>
      solveFutoshiki(board, dim, clue, maxSolutions, nodeBudget),
    propagate: (board, dim, clue) => propagateFutoshiki(board, dim, clue),
  },
  thermo: {
    generate: (dim, difficulty, seed) => {
      const puzzle = generateThermo(dim, difficulty as SudokuDifficulty, seed);
      const dealt = { board: puzzle.board, clue: puzzle.thermometers };
      puzzle.free();
      return dealt;
    },
    solve: (board, dim, clue, maxSolutions, nodeBudget) =>
      solveThermo(board, dim, clue, maxSolutions, nodeBudget),
    propagate: (board, dim, clue) => propagateThermo(board, dim, clue),
  },
  killer: {
    generate: (dim, difficulty, seed) => {
      const puzzle = generateKiller(dim, difficulty as SudokuDifficulty, seed);
      const dealt = { board: puzzle.board, clue: puzzle.cages };
      puzzle.free();
      return dealt;
    },
    solve: (board, dim, clue, maxSolutions, nodeBudget) =>
      solveKiller(board, dim, clue, maxSolutions, nodeBudget),
    propagate: (board, dim, clue) => propagateKiller(board, dim, clue),
  },
  kenken: {
    generate: (dim, difficulty, seed) => {
      const puzzle = generateKenKen(dim, difficulty as FutoshikiDifficulty, seed);
      const dealt = { board: puzzle.board, clue: puzzle.cages };
      puzzle.free();
      return dealt;
    },
    solve: (board, dim, clue, maxSolutions, nodeBudget) =>
      solveKenKen(board, dim, clue, maxSolutions, nodeBudget),
    propagate: (board, dim, clue) => propagateKenKen(board, dim, clue),
  },
};

function post(response: SolverResponse, transfer: ArrayBuffer[] = []): void {
  (self as unknown as Worker).postMessage(response, transfer);
}

self.addEventListener("message", async (event: MessageEvent<SolverRequest>) => {
  const req = event.data;
  try {
    await ensureInit();

    // Cold-start prewarm (T3-W8 §cold-start): `ensureInit()` above already instantiated the
    // wasm; pong back so the main thread can log that the worker is hot. Names no family — one
    // worker, one binary, one warm for all five games.
    if (req.kind === "ping") {
      post({ id: req.id, ok: true, kind: "ping" });
      return;
    }

    // Request-shape validation (SEC-4b, defense-in-depth): the union is exhaustive at compile
    // time, but a malformed postMessage can still arrive at runtime — an unknown family is
    // rejected explicitly (→ WORKER_FAILURE via the catch) rather than indexing into nothing.
    const family = FAMILIES[req.game];
    if (!family) {
      throw new Error(`unknown solver game: ${String(req.game)}`);
    }

    // Explicit request contract (SEC-4b): a typed `switch` on the discriminant, not a
    // wasm-bindgen-incidental fall-through — an unknown `kind` is rejected by the `default`
    // guard rather than silently routed into `generate`.
    switch (req.kind) {
      case "generate": {
        const { board, clue } = family.generate(
          req.dim,
          req.difficulty,
          req.seed,
          req.templates,
        );
        post({ id: req.id, ok: true, kind: "generate", board, clue }, [
          board.buffer as ArrayBuffer,
          clue.buffer as ArrayBuffer,
        ]);
        return;
      }

      case "solve": {
        const t0 = performance.now();
        const result = family.solve(
          req.board,
          req.dim,
          req.clue,
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
          solutions,
          backtracks: result.backtracks.toString(),
          nodesExplored: result.nodesExplored.toString(),
          propagations: result.propagations.toString(),
          budgetExceeded: result.budgetExceeded,
          elapsedMs,
        };
        result.free();
        post(response, [solutions.buffer as ArrayBuffer]);
        return;
      }

      case "propagate": {
        // Propagate-only op (W6 beat 9 — engine-domains pencil marks): AC-3/GAC to a fixpoint,
        // zero search. Synchronous and sub-solve cheap, but it rides the same worker so the
        // main thread never blocks on wasm.
        const masks = family.propagate(req.board, req.dim, req.clue);
        post({ id: req.id, ok: true, kind: "propagate", masks }, [
          masks.buffer as ArrayBuffer,
        ]);
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
    post({ id: req.id, ok: false, code, message });
  }
});

/**
 * Client-side wasm solve/generate path — the only shipped solve surface
 * (zero-backend deploy). Produces the `BoardResponse`/`SolveResponse`
 * shapes `useSudoku.ts` consumes directly.
 *
 * Zero `/api/v1/*` dependency of any kind — no `fetch`, no `/config`
 * endpoint. There is no server to ask; the worker's own promise rejection
 * is the only "timeout" signal this composable needs. Template boards are
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
 * The Worker singleton + pending map + bounded respawn live in the shared
 * `@games/shared/solver/transport`; this file keeps only the Sudoku-specific
 * board marshalling and request/response shapes.
 *
 * ── Registry-package swap (W12, after the wasm-surgeon + LEAD land) ──
 * 1. `npm i @mkbabb/csp-solver-wasm@^0.1.x` (publishes off `csp-solver/wasm`).
 * 2. In `package.json`, flip the dep value `file:../../csp-solver/wasm/pkg`
 *    → the semver range. The `solver.worker.ts` import (`@mkbabb/csp-solver-wasm`)
 *    is already the package name, so no source changes.
 * 3. `csp-solver/wasm/pkg` reverts to pure build output (it's git-ignored);
 *    nothing in the frontend tree references it directly.
 */
import type { Difficulty } from "../types";
import { TEMPLATE_BANK } from "../data/templates";
import { SolverError } from "@games/shared/solver/solverError";
import { createSolverTransport } from "@games/shared/solver/transport";
import type { SolverRequest, SolverResponse } from "./protocol";

export interface BoardResponse {
  values: Record<string, number>;
  size: number;
}

export interface SolveResponse {
  solved: boolean;
  values: Record<string, number>;
  /** `true` when the search gave up at its node budget without finding a
   * solution-consistent completion of the given cells — see `useSolver`'s
   * `solveBoard` doc for how this composes with `SolverError`. */
  budgetExceeded?: boolean;
  /** Search backtracks — already on the wire (worker `backtracks`, a bigint
   * carried as string); parsed here for the W6 stat-line. */
  backtracks: number;
  solutionCount: number;
  /** Wall-clock ms of the wasm call, measured inside the worker. */
  elapsedMs?: number;
}

const DIFFICULTY_ORDINAL: Record<Difficulty, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };
const DIFFICULTY_KEY: Record<Difficulty, "easy" | "medium" | "hard"> = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

const transport = createSolverTransport<SolverRequest, SolverResponse>({
  createWorker: () =>
    new Worker(new URL("./solver.worker.ts", import.meta.url), { type: "module" }),
  tag: "sudoku-solver",
});

/**
 * Cold-start prewarm (T3-W8 §cold-start, A17 P1): spin the Worker up and ping it so the
 * wasm instantiates while the main thread is idle, ahead of the first real solve/generate.
 * The gain only exists against the built `dist/` (dev fetch is instant); called from the
 * eager Sudoku scene's mount (app mount) via `requestIdleCallback`.
 */
export const prewarm = transport.prewarm;

function toFlat(
  size: number,
  values: Record<string, number>,
): Uint32Array<ArrayBuffer> {
  const m = size * size;
  const buf = new Uint32Array(m * m);
  for (const [k, v] of Object.entries(values)) buf[Number(k)] = v;
  return buf;
}

function toRecord(board: Uint32Array): Record<string, number> {
  const o: Record<string, number> = {};
  board.forEach((v, i) => {
    o[i] = v;
  });
  return o;
}

export function useSolver() {
  async function getRandomBoard(
    size: number,
    difficulty: Difficulty,
  ): Promise<BoardResponse> {
    const boards = TEMPLATE_BANK[size]?.[DIFFICULTY_KEY[difficulty]] ?? [];
    const total = (size * size) ** 2;
    const templates = new Uint32Array(boards.length * total);
    boards.forEach((b, i) => templates.set(b, i * total));

    const id = transport.nextId();
    const res = await transport.call(
      {
        id,
        kind: "generate",
        n: size,
        difficulty: DIFFICULTY_ORDINAL[difficulty],
        seed: Date.now(),
        templates,
      },
      [templates.buffer],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "generate") {
      return { values: toRecord(res.board), size };
    }
    throw new SolverError("WORKER_FAILURE", "malformed generate response");
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
    const board = toFlat(size, values);
    const id = transport.nextId();
    const res = await transport.call(
      { id, kind: "solve", board, n: size, maxSolutions: 1, nodeBudget },
      [board.buffer],
    );
    transport.throwIfError(res);
    if (res.ok && res.kind === "solve") {
      return {
        solved: res.solved,
        // `solved=false` iff the given cells conflict with every
        // completion.
        values: res.solved ? toRecord(res.solutions.subarray(0, size ** 4)) : values,
        budgetExceeded: res.budgetExceeded,
        backtracks: Number(res.backtracks),
        solutionCount: res.solutionCount,
        elapsedMs: res.elapsedMs,
      };
    }
    throw new SolverError("WORKER_FAILURE", "malformed solve response");
  }

  /**
   * Propagate-only (W6 beat 9 — engine-domains pencil marks): run the
   * solver's own root AC-3/GAC over the current board and return each
   * cell's surviving candidate bitmask — bit v set ⇔ value v (1-based)
   * remains. No search, no node budget; a contradictory board rejects
   * with a typed `UNSAT` `SolverError` (the caller treats that as "no
   * marks to show", never as broken machinery).
   */
  async function propagateBoard(
    values: Record<string, number>,
    size: number,
  ): Promise<Uint32Array> {
    const board = toFlat(size, values);
    const id = transport.nextId();
    const res = await transport.call({ id, kind: "propagate", board, n: size }, [
      board.buffer,
    ]);
    transport.throwIfError(res);
    if (res.ok && res.kind === "propagate") return res.masks;
    throw new SolverError("WORKER_FAILURE", "malformed propagate response");
  }

  return { getRandomBoard, solveBoard, propagateBoard };
}

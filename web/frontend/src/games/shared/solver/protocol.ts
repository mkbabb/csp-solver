import type { SerializedSolverError } from "./solverError";

/**
 * THE solver Worker wire protocol — one union, five games (T5-W2 2.2 / F3).
 *
 * Five per-game `protocol.ts` files (402 raw lines over a 32-line shared frame) declared the
 * SAME three operations five times, diverging at exactly two points: what the board dimension
 * was CALLED (`n` for the boxed families, `boardSize` for the Latin ones) and what the clue
 * buffer was CALLED (`inequalities` · `thermometers` · `cages` · `cages`). Neither is a
 * difference in the wire — both marshal as a `Uint32Array` beside the board, and both name the
 * same wasm argument slot. So the wire says what it carries:
 *
 *   `dim`   — the game's own dimension parameter, passed to wasm verbatim. A boxed family
 *             reads it as the sub-grid root (board side `dim²`, `dim⁴` cells); a Latin family
 *             reads it as the board side itself (`dim²` cells). One field, one meaning: the
 *             number the wasm verb takes. The CLIENT owns the cells arithmetic, off the
 *             model's own `boardSizeOf` — the wire never needs it.
 *   `clue`  — the game's clue furniture, already through `spec.clues.encode`. Sudoku prints
 *             no clue glyphs, so its buffer is empty — the wire form of `clues: null`, the
 *             same stated absence the spec declares, never a flag.
 *   `templates` — the generation bank. Sudoku alone digs from one; the other four generate
 *             live, and send an empty buffer. Same discipline as `clue`.
 *
 * `game` is the family selector, and it is the ONE place five game names still appear on this
 * seam — because the wasm binary's own surface is five families (`solveSudoku`/`solveThermo`/
 * …, 15 verbs), and a single worker over a single binary has to say which one it means. That
 * is the wasm's shape, not a table of games: nothing here declares what a game IS.
 *
 * Every request/response carries `id` (correlates a response to its request) and, on success,
 * a `kind` discriminant; a failure is `ok: false` plus the serialized error.
 */

/** The five wasm families the one binary exports, and the one worker dispatches over. */
export type GameId = "sudoku" | "futoshiki" | "thermo" | "killer" | "kenken";

/**
 * Cold-start prewarm (T3-W8 §cold-start): a no-op that forces the worker to run
 * `ensureInit()` — instantiate the wasm — ahead of the first real solve/generate. Carries no
 * payload and names no family: one worker, one wasm, one warm.
 */
export interface PingRequest {
  id: number;
  kind: "ping";
}

/** Prewarm pong — the wasm is instantiated and the worker is hot. */
export interface PingResponse {
  id: number;
  ok: true;
  kind: "ping";
}

/** The `ok: false` failure frame — the serialized typed error, correlated by `id`. Local:
 *  the five per-game protocols that composed it into their own unions are gone, and the one
 *  union below is its only reader. */
type SolverErrorResponse = { id: number; ok: false } & SerializedSolverError;

/** Requests the main thread can post to the one `solver.worker.ts`. */
export type SolverRequest =
  | {
      id: number;
      game: GameId;
      kind: "generate";
      dim: number;
      /** the tier ordinal (0/1/2) — structured-clone-safe; the worker re-narrows to the enum. */
      difficulty: number;
      seed: number;
      /** the generation bank, or empty where the family digs live. */
      templates: Uint32Array;
    }
  | {
      id: number;
      game: GameId;
      kind: "solve";
      dim: number;
      board: Uint32Array;
      /** the encoded clue furniture, or empty where the family prints none. */
      clue: Uint32Array;
      maxSolutions?: number;
      nodeBudget?: number;
    }
  | {
      id: number;
      game: GameId;
      kind: "propagate";
      dim: number;
      board: Uint32Array;
      clue: Uint32Array;
    }
  | PingRequest;

/** Responses the worker posts back, correlated by `id`. */
export type SolverResponse =
  | {
      id: number;
      ok: true;
      kind: "generate";
      board: Uint32Array;
      /** the dealt puzzle's clue furniture, empty where the family prints none. */
      clue: Uint32Array;
    }
  | {
      id: number;
      ok: true;
      kind: "solve";
      solved: boolean;
      solutionCount: number;
      solutions: Uint32Array;
      /** bigint -> string, structured-clone-safe & JSON-safe. */
      backtracks: string;
      /** Search-tree nodes visited + domain-propagation steps — machine-effort telemetry
       * twins of `backtracks` (T4-W7 free-win getters), each a wasm bigint carried as a
       * string for structured-clone/JSON safety. */
      nodesExplored: string;
      propagations: string;
      budgetExceeded: boolean;
      /** Wall-clock ms of the wasm solve call, measured inside the worker (W6 stat-line). */
      elapsedMs: number;
    }
  | {
      id: number;
      ok: true;
      kind: "propagate";
      /** One u32 per cell; bit v set ⇔ value v (1-based) survives AC-3/GAC propagation. */
      masks: Uint32Array;
    }
  | PingResponse
  | SolverErrorResponse;

// The Sudoku state machine — a THIN adapter over the shared `useGameState` machine (T4-W11 R5).
// The whole undo/epoch/deal/peek/marks/persist choreography lives in `@games/shared/useGameState`;
// this file supplies only Sudoku's DOMAIN OPS (the subgrid solver payloads, the size math, the
// grade/hint/fill hooks, the URL/persist codec) as a slot object, then re-labels the machine's
// neutral `solverSize` ref to Sudoku's public `size`. Everything else — the return surface the
// board/scene/panel consume — passes through unchanged.
//
// The solve/generate path is the ONE in-browser wasm Worker (`@games/shared/solver/client`), the
// only shipped solve surface. Zero `/api/v1/*` dependency — no fetch, no `/config` handshake, no
// server to depend on.
import { createSolverClient } from "@games/shared/solver/client";
import { TEMPLATE_BANK, tierSource } from "../data/templates";
import type { Difficulty } from "@games/shared/types";
import {
  resolveInitialState,
  syncToUrl,
  persistBoard,
  clearPersistedBoard,
  encodeBoard,
  writeBoardToUrl,
  dropBoardParam,
} from "./useUrlState";
import { gradeBoard, fillAllForced, findHint } from "@games/shared/techniqueEngine";
import { createBoardAdapter } from "@games/shared/techniqueAdapter";
import { useGameState } from "@games/shared/useGameState";

/**
 * Size-scaled node budget for the client solve — the user-facing cap on search effort, keyed to
 * sub-grid size. The worker's wasm default is 1,000,000 nodes; larger boards legitimately explore
 * more, so the cap scales with `n`: generous enough that every served template solves, finite
 * enough to structurally retire the unbounded-search DoS class. Exhausting it surfaces a typed
 * `BUDGET_EXCEEDED` error (distinct from provable UNSAT).
 */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  2: 200_000,
  3: 2_000_000,
  4: 50_000_000,
};
export function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 1_000_000;
}

/** Sudoku's raw selector value is the SUB-GRID root; the board side is its square. ONE home:
 *  `useGameState` sizes the board with it, the solver client counts cells with it. */
const boardSizeOf = (n: number) => n ** 2;

const DIFFICULTY_KEY: Record<Difficulty, "easy" | "medium" | "hard"> = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

/**
 * Sudoku is the one family that DIGS from a bank instead of generating live: the templates are
 * resolved from the bundled `../data/templates.ts` asset (generated at build time by the
 * `sudokuTemplates` Vite plugin from the canonical `csp-solver/data/sudoku_puzzles/` bank —
 * single source of truth, never hand-copied) and cross to the worker as one transferable
 * buffer. The other four send an empty one.
 *
 * WHICH TIERS RIDE THE BANK IS DECLARED, NOT INFERRED (T5-W2 2.4a). `tierSource` reads the
 * table the build checked the bank against, so an empty tier means `livegen` because someone
 * SAID so — the excised N=2 and N=3-easy/medium — and never because the directory went
 * missing. The old `TEMPLATE_BANK[n]?.[…] ?? []` could not tell those apart, and neither could
 * the build; a dropped `3/hard` shipped a silent live-gen regression on the one tier that has
 * a bank precisely because live generation breaches the in-browser budget there.
 */
function sudokuTemplates(n: number, difficulty: Difficulty): Uint32Array<ArrayBuffer> {
  const tier = DIFFICULTY_KEY[difficulty];
  if (tierSource(n, tier) === "livegen") return new Uint32Array(0);
  const boards = TEMPLATE_BANK[n][tier];
  const total = boardSizeOf(n) ** 2;
  const templates = new Uint32Array(boards.length * total);
  boards.forEach((b, i) => templates.set(b, i * total));
  return templates;
}

// Sudoku prints no on-board clue furniture, so its clue seam is `null` — the same stated
// absence `sudokuSpec.clues` declares, carried straight to an empty wire buffer.
const api = createSolverClient<void>({
  game: "sudoku",
  boardSide: boardSizeOf,
  clue: null,
  templates: sudokuTemplates,
});

export function useSudoku() {
  const initial = resolveInitialState();

  const { solverSize, ...machine } = useGameState({
    initial,
    initialSize: initial.size,
    boardSizeOf,
    nodeBudgetForSize,
    getRandomBoard: (n, difficulty) => api.getRandomBoard(n, difficulty),
    applyDealFurniture: () => {}, // Sudoku prints no on-board clue furniture
    resetFurniture: () => {},
    grade: (values, n) => gradeBoard(createBoardAdapter("boxed", n), values),
    solve: (values, n, budget) => api.solveBoard(values, n, undefined, budget),
    propagate: (values, n) => api.propagateBoard(values, n, undefined),
    fillForced: (values, n) => fillAllForced(createBoardAdapter("boxed", n), values),
    hint: (values, n, preferred) =>
      findHint(createBoardAdapter("boxed", n), values, preferred),
    snapshotExtra: () => ({}),
    restoreExtra: () => {},
    restorePersistedFurniture: () => {},
    syncToUrl,
    persist: (payload, n) => persistBoard({ size: n, ...payload }),
    clearPersisted: clearPersistedBoard,
    dropBoardParam,
    writeShareUrl: (n, values, totalCells) =>
      writeBoardToUrl(encodeBoard(n, values, totalCells)),
  });

  // Re-label the machine's neutral size ref to Sudoku's public `size`; everything else
  // (pendingSize, boardSize, totalCells, difficulty + the whole state surface) passes through.
  return { size: solverSize, ...machine };
}

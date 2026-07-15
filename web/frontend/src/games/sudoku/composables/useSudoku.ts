// The Sudoku state machine — a THIN adapter over the shared `useGameState` machine (T4-W11 R5).
// The whole undo/epoch/deal/peek/marks/persist choreography lives in `@games/shared/useGameState`;
// this file supplies only Sudoku's DOMAIN OPS (the subgrid solver payloads, the size math, the
// grade/hint/fill hooks, the URL/persist codec) as a slot object, then re-labels the machine's
// neutral `solverSize` ref to Sudoku's public `size`. Everything else — the return surface the
// board/scene/panel consume — passes through unchanged.
//
// The solve/generate path is the in-browser wasm Worker (`useSolver`), the only shipped solve
// surface. Zero `/api/v1/*` dependency — no fetch, no `/config` handshake, no server to depend on.
import { useSolver } from "../solver/useSolver";
import {
  resolveInitialState,
  syncToUrl,
  persistBoard,
  clearPersistedBoard,
  encodeBoard,
  writeBoardToUrl,
  dropBoardParam,
} from "./useUrlState";
import {
  gradeSudoku,
  hintSudoku,
  fillForcedSudoku,
} from "../technique/sudokuTechnique";
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
function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 1_000_000;
}

export function useSudoku() {
  const api = useSolver();
  const initial = resolveInitialState();

  const { solverSize, ...machine } = useGameState({
    initial,
    initialSize: initial.size,
    // Sudoku's raw selector value is the SUB-GRID root; the board side is its square.
    boardSizeOf: (n) => n ** 2,
    nodeBudgetForSize,
    getRandomBoard: (n, difficulty) => api.getRandomBoard(n, difficulty),
    applyDealFurniture: () => {}, // Sudoku prints no on-board clue furniture
    resetFurniture: () => {},
    grade: (values, n) => gradeSudoku(values, n),
    solve: (values, n, budget) => api.solveBoard(values, n, budget),
    propagate: (values, n) => api.propagateBoard(values, n),
    fillForced: (values, n) => fillForcedSudoku(values, n),
    hint: (values, n, preferred) => hintSudoku(values, n, preferred),
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

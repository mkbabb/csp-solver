// The Futoshiki state machine — a THIN adapter over the shared `useGameState` machine (T4-W11 R5),
// the twin of `useSudoku`. The whole undo/epoch/deal/peek/marks/persist choreography lives in
// `@games/shared/useGameState`; this file supplies only Futoshiki's DOMAIN OPS — the inequality
// furniture that rides every board, the solver payloads that thread it, the identity size math (a
// Futoshiki board is a plain N×N Latin square, no subgrid) — as a slot object, then re-labels the
// machine's neutral `pendingSize` ref to `pendingBoardSize` and adds the `inequalities` ref.
//
// The solve/generate path is the in-browser wasm Worker (`useSolver`), the only shipped solve
// surface, with zero `/api/v1/*` dependency and no server to depend on.
import { ref } from "vue";
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
  gradeFutoshiki,
  hintFutoshiki,
  fillForcedFutoshiki,
} from "../technique/futoshikiTechnique";
import { useGameState } from "@games/shared/useGameState";
import type { Inequality } from "../types";

/**
 * Size-scaled node budget for the client solve. v1 sizes (N=4..7) solve an empty board in 0
 * backtracks under the wasm AC-3+MRV config (the F1 production override), so these caps are
 * generous headroom for user-entered boards — exhausting one surfaces a typed `BUDGET_EXCEEDED`
 * error (distinct from provable UNSAT).
 */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  4: 2_000_000,
  5: 4_000_000,
  6: 10_000_000,
  7: 20_000_000,
};
function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 4_000_000;
}

export function useFutoshiki() {
  const api = useSolver();
  const initial = resolveInitialState();

  // Printed inequality furniture — [greater, lesser] pairs. NEVER in the given/overridden
  // bookkeeping (they aren't cell values); they ride along the board and feed the carets. Held in
  // the adapter (Futoshiki's genuine domain residue); the shared machine travels it via the hooks.
  const inequalities = ref<Inequality[]>([]);

  const {
    solverSize: _solverSize,
    pendingSize,
    ...machine
  } = useGameState({
    initial,
    initialSize: initial.boardSize,
    // A Futoshiki board side length IS the raw selector value (no subgrid tier).
    boardSizeOf: (n) => n,
    nodeBudgetForSize,
    getRandomBoard: (n, difficulty) => api.getRandomBoard(n, difficulty),
    applyDealFurniture: (board) => {
      inequalities.value = board.inequalities;
    },
    resetFurniture: () => {
      inequalities.value = [];
    },
    grade: (values, n) => gradeFutoshiki(values, n, inequalities.value),
    solve: (values, n, budget) => api.solveBoard(values, n, inequalities.value, budget),
    propagate: (values, n) => api.propagateBoard(values, n, inequalities.value),
    fillForced: (values, n) => fillForcedFutoshiki(values, n, inequalities.value),
    hint: (values, n, preferred) =>
      hintFutoshiki(values, n, inequalities.value, preferred),
    snapshotExtra: () => ({
      inequalities: inequalities.value.map(([a, b]) => [a, b] as [number, number]),
    }),
    restoreExtra: (blob) => {
      inequalities.value = blob.inequalities.map(([a, b]) => [a, b] as Inequality);
    },
    restorePersistedFurniture: (persisted) => {
      inequalities.value = persisted.inequalities.map(([a, b]) => [a, b] as Inequality);
    },
    syncToUrl,
    persist: (payload, n) =>
      persistBoard({ boardSize: n, ...payload, inequalities: inequalities.value }),
    clearPersisted: clearPersistedBoard,
    dropBoardParam,
    writeShareUrl: (n, values, totalCells) =>
      writeBoardToUrl(encodeBoard(n, values, totalCells, inequalities.value)),
  });
  void _solverSize; // Futoshiki exposes the derived `boardSize`, not the raw `solverSize`

  // Re-label `pendingSize` → `pendingBoardSize` and expose the `inequalities` ref; the machine's
  // derived `boardSize` (identity of the raw value) + the whole state surface pass through.
  return { ...machine, pendingBoardSize: pendingSize, inequalities };
}

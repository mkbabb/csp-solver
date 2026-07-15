// The KenKen / Calcudoku state machine — a THIN adapter over the shared `useGameState`
// machine (T4-W13, the R5 grammar). The whole undo/epoch/deal/peek/marks/persist choreography
// lives in `@games/shared/useGameState`; this file supplies only KenKen's DOMAIN OPS as a
// slot object, then re-labels the machine's neutral `pendingSize` ref to `pendingBoardSize`.
//
// KenKen IS a Latin-square family (like Futoshiki): the board side IS the raw selector value
// (identity `boardSizeOf`, no subgrid tier), and the Latin technique engine grades it. Its one
// genuine divergence is the operator-cage furniture, threaded through solve/propagate exactly
// as Futoshiki threads its inequalities and Killer its cages — but the cage RELATIONS are
// enforced authoritatively by the wasm solve, so the technique grader (Latin-only, cage-blind,
// empty inequality set) is the assist half only. The solve/generate path is the in-browser
// wasm Worker (`useSolver`) — zero `/api/v1/*`.
import { ref } from "vue";
import { useSolver } from "../solver/useSolver";
import {
  resolveInitialState,
  syncToUrl,
  persistBoard,
  clearPersistedBoard,
  dropBoardParam,
  writeShareUrl,
} from "./kenkenUrlState";
import {
  gradeFutoshiki,
  hintFutoshiki,
  fillForcedFutoshiki,
} from "@games/futoshiki/technique/futoshikiTechnique";
import { useGameState } from "@games/shared/useGameState";
import type { KenKenCage } from "../types";

/** Size-scaled node budget — a plain Latin board (4..6) solves in near-0 backtracks under the
 *  wasm AC-3+MRV config, so these caps are generous headroom for user-entered boards. */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  4: 2_000_000,
  5: 4_000_000,
  6: 10_000_000,
};
function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 4_000_000;
}

export function useKenken() {
  const api = useSolver();
  const initial = resolveInitialState();

  // The operator-cage furniture — the KenKen divergence, the mirror of Futoshiki's
  // `inequalities` / Killer's `cages`. Threaded into solve/propagate and carried through
  // undo/persist. The Latin technique grader is cage-blind (empty inequality set), so the
  // cages ride only the wasm solve.
  const cages = ref<KenKenCage[]>(initial.persisted?.cages ?? []);

  const {
    solverSize: _solverSize,
    pendingSize,
    ...machine
  } = useGameState({
    initial,
    initialSize: initial.boardSize,
    // A KenKen board side length IS the raw selector value (no subgrid tier).
    boardSizeOf: (n) => n,
    nodeBudgetForSize,
    getRandomBoard: (n, difficulty) => api.getRandomBoard(n, difficulty),
    applyDealFurniture: (board) => {
      cages.value = board.cages;
    },
    resetFurniture: () => {
      cages.value = [];
    },
    grade: (values, n) => gradeFutoshiki(values, n, []),
    solve: (values, n, budget) => api.solveBoard(values, n, cages.value, budget),
    propagate: (values, n) => api.propagateBoard(values, n, cages.value),
    fillForced: (values, n) => fillForcedFutoshiki(values, n, []),
    hint: (values, n, preferred) => hintFutoshiki(values, n, [], preferred),
    snapshotExtra: () => ({
      cages: cages.value.map((c) => ({
        op: c.op,
        target: c.target,
        cells: [...c.cells],
      })),
    }),
    restoreExtra: (blob) => {
      cages.value = blob.cages.map((c) => ({
        op: c.op,
        target: c.target,
        cells: [...c.cells],
      }));
    },
    restorePersistedFurniture: (persisted) => {
      cages.value = persisted.cages.map((c) => ({
        op: c.op,
        target: c.target,
        cells: [...c.cells],
      }));
    },
    syncToUrl,
    persist: (payload, n) =>
      persistBoard({ boardSize: n, ...payload, cages: cages.value }),
    clearPersisted: clearPersistedBoard,
    dropBoardParam,
    writeShareUrl,
  });
  void _solverSize; // KenKen exposes the derived `boardSize`, not the raw `solverSize`

  // Re-label `pendingSize` → `pendingBoardSize` and expose the `cages` ref; the machine's
  // derived `boardSize` (identity of the raw value) + the whole state surface pass through.
  return { ...machine, pendingBoardSize: pendingSize, cages };
}

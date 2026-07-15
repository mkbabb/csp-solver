// The Killer-Sudoku state machine — a THIN adapter over the shared `useGameState` machine
// (T4-W13, the R5 grammar). The whole undo/epoch/deal/peek/marks/persist choreography lives
// in `@games/shared/useGameState`; this file supplies only Killer's DOMAIN OPS as a slot
// object, then re-labels the machine's neutral `solverSize` ref to the public `size`.
//
// Killer IS a Sudoku variant, so it reuses the sudoku subgrid math (`n**2`), node-budget
// table, and technique engine; its one genuine divergence is the cage furniture, threaded
// through solve/propagate exactly as Futoshiki threads its inequalities and Thermo its
// tubes. The solve/generate path is the in-browser wasm Worker (`useSolver`) — zero
// `/api/v1/*`.
import { ref } from "vue";
import { useSolver } from "../solver/useSolver";
import {
  resolveInitialState,
  syncToUrl,
  persistBoard,
  clearPersistedBoard,
  dropBoardParam,
  writeShareUrl,
} from "./killerUrlState";
import {
  gradeSudoku,
  hintSudoku,
  fillForcedSudoku,
} from "@games/sudoku/technique/sudokuTechnique";
import { useGameState } from "@games/shared/useGameState";
import type { KillerCage } from "../types";

/** Size-scaled node budget — the sudoku table (Killer shares the subgrid geometry). */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  2: 200_000,
  3: 2_000_000,
  4: 50_000_000,
};
function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 1_000_000;
}

export function useKiller() {
  const api = useSolver();
  const initial = resolveInitialState();

  // The cage furniture — the Killer divergence, the mirror of Futoshiki's `inequalities`
  // ref. Threaded into solve/propagate and carried through undo/persist.
  const cages = ref<KillerCage[]>(initial.persisted?.cages ?? []);

  const { solverSize, ...machine } = useGameState({
    initial,
    initialSize: initial.size,
    // Killer's raw selector value is the SUB-GRID root; the board side is its square.
    boardSizeOf: (n) => n ** 2,
    nodeBudgetForSize,
    getRandomBoard: (n, difficulty) => api.getRandomBoard(n, difficulty),
    applyDealFurniture: (board) => {
      cages.value = board.cages;
    },
    resetFurniture: () => {
      cages.value = [];
    },
    grade: (values, n) => gradeSudoku(values, n),
    solve: (values, n, budget) => api.solveBoard(values, n, cages.value, budget),
    propagate: (values, n) => api.propagateBoard(values, n, cages.value),
    fillForced: (values, n) => fillForcedSudoku(values, n),
    hint: (values, n, preferred) => hintSudoku(values, n, preferred),
    snapshotExtra: () => ({
      cages: cages.value.map((c) => ({ sum: c.sum, cells: [...c.cells] })),
    }),
    restoreExtra: (blob) => {
      cages.value = blob.cages.map((c) => ({ sum: c.sum, cells: [...c.cells] }));
    },
    restorePersistedFurniture: (persisted) => {
      cages.value = persisted.cages.map((c) => ({ sum: c.sum, cells: [...c.cells] }));
    },
    syncToUrl,
    persist: (payload, n) => persistBoard({ size: n, ...payload, cages: cages.value }),
    clearPersisted: clearPersistedBoard,
    dropBoardParam,
    writeShareUrl,
  });

  // Re-label the machine's neutral size ref to the public `size`; expose the cage furniture
  // for the board's overlay slot. Everything else passes through unchanged.
  return { size: solverSize, cages, ...machine };
}

// The Thermo-Sudoku state machine — a THIN adapter over the shared `useGameState` machine
// (T4-W13, the R5 grammar). The whole undo/epoch/deal/peek/marks/persist choreography lives
// in `@games/shared/useGameState`; this file supplies only Thermo's DOMAIN OPS as a slot
// object, then re-labels the machine's neutral `solverSize` ref to the public `size`.
//
// Thermo IS a Sudoku variant, so it reuses the sudoku subgrid math (`n**2`), node-budget
// table, and technique engine; its one genuine divergence is the thermometer furniture,
// threaded through solve/propagate exactly as Futoshiki threads its inequalities. The
// solve/generate path is the in-browser wasm Worker (`useSolver`) — zero `/api/v1/*`.
import { ref } from "vue";
import { useSolver } from "../solver/useSolver";
import {
  resolveInitialState,
  syncToUrl,
  persistBoard,
  clearPersistedBoard,
  dropBoardParam,
  writeShareUrl,
} from "./thermoUrlState";
import {
  gradeSudoku,
  hintSudoku,
  fillForcedSudoku,
} from "@games/sudoku/technique/sudokuTechnique";
import { useGameState } from "@games/shared/useGameState";
import type { ThermoLine } from "../types";

/** Size-scaled node budget — the sudoku table (Thermo shares the subgrid geometry). */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  2: 200_000,
  3: 2_000_000,
  4: 50_000_000,
};
function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 1_000_000;
}

export function useThermo() {
  const api = useSolver();
  const initial = resolveInitialState();

  // The thermometer furniture — the Thermo divergence, the mirror of Futoshiki's
  // `inequalities` ref. Threaded into solve/propagate and carried through undo/persist.
  const thermometers = ref<ThermoLine[]>(initial.persisted?.thermometers ?? []);

  const { solverSize, ...machine } = useGameState({
    initial,
    initialSize: initial.size,
    // Thermo's raw selector value is the SUB-GRID root; the board side is its square.
    boardSizeOf: (n) => n ** 2,
    nodeBudgetForSize,
    getRandomBoard: (n, difficulty) => api.getRandomBoard(n, difficulty),
    applyDealFurniture: (board) => {
      thermometers.value = board.thermometers;
    },
    resetFurniture: () => {
      thermometers.value = [];
    },
    grade: (values, n) => gradeSudoku(values, n),
    solve: (values, n, budget) => api.solveBoard(values, n, thermometers.value, budget),
    propagate: (values, n) => api.propagateBoard(values, n, thermometers.value),
    fillForced: (values, n) => fillForcedSudoku(values, n),
    hint: (values, n, preferred) => hintSudoku(values, n, preferred),
    snapshotExtra: () => ({ thermometers: thermometers.value.map((t) => [...t]) }),
    restoreExtra: (blob) => {
      thermometers.value = blob.thermometers.map((t) => [...t]);
    },
    restorePersistedFurniture: (persisted) => {
      thermometers.value = persisted.thermometers.map((t) => [...t]);
    },
    syncToUrl,
    persist: (payload, n) =>
      persistBoard({ size: n, ...payload, thermometers: thermometers.value }),
    clearPersisted: clearPersistedBoard,
    dropBoardParam,
    writeShareUrl,
  });

  // Re-label the machine's neutral size ref to the public `size`; expose the thermometer
  // furniture for the board's overlay slot. Everything else passes through unchanged.
  return { size: solverSize, thermometers, ...machine };
}

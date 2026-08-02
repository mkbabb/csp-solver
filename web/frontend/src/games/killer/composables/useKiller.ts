// The Killer-Sudoku state machine — a THIN adapter over the shared `useGameState` machine
// (T4-W13, the R5 grammar). The whole undo/epoch/deal/peek/marks/persist choreography lives
// in `@games/shared/useGameState`; this file supplies only Killer's DOMAIN OPS as a slot
// object, then re-labels the machine's neutral `solverSize` ref to the public `size`.
//
// Killer IS a Sudoku variant, so it reuses the sudoku subgrid math (`n**2`), node-budget
// table, and technique engine; its one genuine divergence is the cage furniture, threaded
// through solve/propagate exactly as Futoshiki threads its inequalities and Thermo its
// tubes. The solve/generate path is the ONE in-browser wasm Worker
// (`@games/shared/solver/client`) — zero `/api/v1/*`.
import { ref } from "vue";
import { createSolverClient } from "@games/shared/solver/client";
import { killerClue } from "../clue";
import { createPersistence, type PersistedCore } from "@games/shared/persistence";
import { subgridSizes } from "@games/shared/selectors";
import type { Difficulty } from "@games/shared/types";
import { gradeBoard, fillAllForced, findHint } from "@games/shared/techniqueEngine";
import { createBoardAdapter } from "@games/shared/techniqueAdapter";
import { useGameState } from "@games/shared/useGameState";
import type { KillerCage } from "../types";

/** Size-scaled node budget — the sudoku table (Killer shares the subgrid geometry). Exported
 *  so `spec.solver.nodeBudget` NAMES this one table rather than mirroring it. */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  2: 200_000,
  3: 2_000_000,
  4: 50_000_000,
};
export function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 1_000_000;
}

/** Killer's raw selector value is the SUB-GRID root; the board side is its square. ONE home:
 *  `useGameState` sizes the board with it, the solver client counts cells with it. */
const boardSizeOf = (n: number) => n ** 2;

/** Killer's slice of the ONE solver client — the wasm family, the size math, and the clue
 *  codec `spec.clues` spreads. No worker of its own: there is one, and every game shares it. */
const api = createSolverClient({
  game: "killer",
  boardSide: boardSizeOf,
  clue: killerClue,
  templates: null,
  nodeBudget: nodeBudgetForSize,
});

/** Killer's board on disk: the common slice, its own size key, and its cage furniture. */
export interface KillerPersisted extends PersistedCore {
  size: number;
  difficulty: Difficulty;
  cages: KillerCage[];
}

/** Killer's slice of the ONE persistence codec — thermo's row with a different clue. */
export const persistence = createPersistence<KillerCage[], KillerPersisted>({
  game: "killer",
  key: "killer-board-v1",
  boardSide: boardSizeOf,
  validSizes: subgridSizes.map((o) => o.value),
  defaultSize: 3,
  freshDifficulty: () => "EASY",
  sizeParam: null,
  sizeField: "size",
  clue: killerClue,
  clueField: "cages",
});

export function useKiller() {
  const initial = persistence.resolveInitialState();

  // The cage furniture — the Killer divergence, the mirror of Futoshiki's `inequalities`
  // ref. Threaded into solve/propagate and carried through undo/persist.
  const cages = ref<KillerCage[]>(initial.persisted?.cages ?? []);

  const { solverSize, ...machine } = useGameState({
    initial,
    initialSize: initial.size,
    boardSizeOf,
    getRandomBoard: (n, difficulty) => api.getRandomBoard(n, difficulty),
    applyDealFurniture: (board) => {
      cages.value = board.clue;
    },
    resetFurniture: () => {
      cages.value = [];
    },
    grade: (values, n) => gradeBoard(createBoardAdapter("boxed", n), values),
    solve: (values, n) => api.solveBoard(values, n, cages.value),
    propagate: (values, n) => api.propagateBoard(values, n, cages.value),
    fillForced: (values, n) => fillAllForced(createBoardAdapter("boxed", n), values),
    hint: (values, n, preferred) =>
      findHint(createBoardAdapter("boxed", n), values, preferred),
    snapshotExtra: () => ({
      cages: cages.value.map((c) => ({ sum: c.sum, cells: [...c.cells] })),
    }),
    restoreExtra: (blob) => {
      cages.value = blob.cages.map((c) => ({ sum: c.sum, cells: [...c.cells] }));
    },
    restorePersistedFurniture: (persisted) => {
      cages.value = persisted.cages.map((c) => ({ sum: c.sum, cells: [...c.cells] }));
    },
    syncToUrl: persistence.syncToUrl,
    persist: (payload, n) =>
      persistence.persistBoard({ size: n, ...payload, cages: cages.value }),
    clearPersisted: persistence.clearPersistedBoard,
    dropBoardParam: persistence.dropBoardParam,
    writeShareUrl: (n, values, totalCells) =>
      persistence.writeShareUrl(n, values, totalCells, cages.value),
  });

  // Re-label the machine's neutral size ref to the public `size`; expose the cage furniture
  // for the board's overlay slot. Everything else passes through unchanged.
  return { size: solverSize, cages, ...machine };
}

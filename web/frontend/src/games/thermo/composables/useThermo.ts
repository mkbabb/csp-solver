// The Thermo-Sudoku state machine — a THIN adapter over the shared `useGameState` machine
// (T4-W13, the R5 grammar). The whole undo/epoch/deal/peek/marks/persist choreography lives
// in `@games/shared/useGameState`; this file supplies only Thermo's DOMAIN OPS as a slot
// object, then re-labels the machine's neutral `solverSize` ref to the public `size`.
//
// Thermo IS a Sudoku variant, so it reuses the sudoku subgrid math (`n**2`), node-budget
// table, and technique engine; its one genuine divergence is the thermometer furniture,
// threaded through solve/propagate exactly as Futoshiki threads its inequalities. The
// solve/generate path is the ONE in-browser wasm Worker (`@games/shared/solver/client`) —
// zero `/api/v1/*`.
import { ref } from "vue";
import { createSolverClient } from "@games/shared/solver/client";
import { thermoClue } from "../clue";
import { createPersistence, type PersistedCore } from "@games/shared/persistence";
import { subgridSizes } from "@games/shared/selectors";
import type { Difficulty } from "@games/shared/types";
import { gradeBoard, fillAllForced, findHint } from "@games/shared/techniqueEngine";
import { createBoardAdapter } from "@games/shared/techniqueAdapter";
import { useGameState } from "@games/shared/useGameState";
import type { ThermoLine } from "../types";

/** Size-scaled node budget — the sudoku table (Thermo shares the subgrid geometry). Exported
 *  so `spec.solver.nodeBudget` NAMES this one table; the model reads it through the same
 *  export, so the budget has one home. */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  2: 200_000,
  3: 2_000_000,
  4: 50_000_000,
};
export function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 1_000_000;
}

/** Thermo's raw selector value is the SUB-GRID root; the board side is its square. ONE home:
 *  `useGameState` sizes the board with it, the solver client counts cells with it. */
const boardSizeOf = (n: number) => n ** 2;

/** Thermo's slice of the ONE solver client — the wasm family, the size math, and the clue
 *  codec `spec.clues` spreads. No worker of its own: there is one, and every game shares it. */
const api = createSolverClient({
  game: "thermo",
  boardSide: boardSizeOf,
  clue: thermoClue,
  templates: null,
  nodeBudget: nodeBudgetForSize,
});

/** Thermo's board on disk: the common slice, its own size key, and its tube furniture. */
export interface ThermoPersisted extends PersistedCore {
  size: number;
  difficulty: Difficulty;
  thermometers: ThermoLine[];
}

/**
 * Thermo's slice of the ONE persistence codec. Where this row used to be 110 lines of
 * empty-body no-ops — `boardLink` hard-coded `"absent"`, a `writeShareUrl` that did nothing
 * behind a live Share button — it is now the same four facts every other game supplies, and
 * the `?board=` permalink carries the thermometers because `thermoClue` already knew how.
 */
export const persistence = createPersistence<ThermoLine[], ThermoPersisted>({
  game: "thermo",
  key: "thermo-board-v1",
  boardSide: boardSizeOf,
  validSizes: subgridSizes.map((o) => o.value),
  defaultSize: 3,
  freshDifficulty: () => "EASY",
  // Thermo's selectors live on disk, not in the query — the family never owned a size key.
  sizeParam: null,
  sizeField: "size",
  clue: thermoClue,
  clueField: "thermometers",
});

export function useThermo() {
  const initial = persistence.resolveInitialState();

  // The thermometer furniture — the Thermo divergence, the mirror of Futoshiki's
  // `inequalities` ref. Threaded into solve/propagate and carried through undo/persist.
  const thermometers = ref<ThermoLine[]>(initial.persisted?.thermometers ?? []);

  const { solverSize, ...machine } = useGameState({
    initial,
    initialSize: initial.size,
    boardSizeOf,
    getRandomBoard: (n, difficulty) => api.getRandomBoard(n, difficulty),
    applyDealFurniture: (board) => {
      thermometers.value = board.clue;
    },
    resetFurniture: () => {
      thermometers.value = [];
    },
    grade: (values, n) => gradeBoard(createBoardAdapter("boxed", n), values),
    solve: (values, n) => api.solveBoard(values, n, thermometers.value),
    propagate: (values, n) => api.propagateBoard(values, n, thermometers.value),
    fillForced: (values, n) => fillAllForced(createBoardAdapter("boxed", n), values),
    hint: (values, n, preferred) =>
      findHint(createBoardAdapter("boxed", n), values, preferred),
    snapshotExtra: () => ({ thermometers: thermometers.value.map((t) => [...t]) }),
    restoreExtra: (blob) => {
      thermometers.value = blob.thermometers.map((t) => [...t]);
    },
    restorePersistedFurniture: (persisted) => {
      thermometers.value = persisted.thermometers.map((t) => [...t]);
    },
    syncToUrl: persistence.syncToUrl,
    persist: (payload, n) =>
      persistence.persistBoard({
        size: n,
        ...payload,
        thermometers: thermometers.value,
      }),
    clearPersisted: persistence.clearPersistedBoard,
    dropBoardParam: persistence.dropBoardParam,
    writeShareUrl: (n, values, totalCells) =>
      persistence.writeShareUrl(n, values, totalCells, thermometers.value),
  });

  // Re-label the machine's neutral size ref to the public `size`; expose the thermometer
  // furniture for the board's overlay slot. Everything else passes through unchanged.
  return { size: solverSize, thermometers, ...machine };
}

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
// empty inequality set) is the assist half only. The solve/generate path is the ONE in-browser
// wasm Worker (`@games/shared/solver/client`) — zero `/api/v1/*`.
import { ref } from "vue";
import { createSolverClient } from "@games/shared/solver/client";
import { kenkenClue } from "../clue";
import { createPersistence, type PersistedCore } from "@games/shared/persistence";
import { cagedLatinSizes } from "@games/shared/selectors";
import type { Difficulty } from "@games/shared/types";
import { gradeBoard, fillAllForced, findHint } from "@games/shared/techniqueEngine";
import { createBoardAdapter } from "@games/shared/techniqueAdapter";
import { useGameState } from "@games/shared/useGameState";
import type { KenKenCage } from "../types";

/** Size-scaled node budget — a plain Latin board (4..6) solves in near-0 backtracks under the
 *  wasm AC-3+MRV config, so these caps are generous headroom for user-entered boards. Exported
 *  so `spec.solver.nodeBudget` NAMES this table rather than mirroring it; a KenKen board side
 *  IS the raw selector value, so the spec's slot and the machine's read the same key. */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  4: 2_000_000,
  5: 4_000_000,
  6: 10_000_000,
};
export function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 4_000_000;
}

/** A KenKen board side length IS the raw selector value (no subgrid tier). ONE home:
 *  `useGameState` sizes the board with it, the solver client counts cells with it. */
const boardSizeOf = (n: number) => n;

/** KenKen's slice of the ONE solver client — the wasm family, the size math, and the clue
 *  codec `spec.clues` spreads. No worker of its own: there is one, and every game shares it. */
const api = createSolverClient({
  game: "kenken",
  boardSide: boardSizeOf,
  clue: kenkenClue,
  templates: null,
  nodeBudget: nodeBudgetForSize,
});

/** KenKen's board on disk: the common slice, its own size key, and its operator-cage furniture. */
export interface KenKenPersisted extends PersistedCore {
  boardSize: number;
  difficulty: Difficulty;
  cages: KenKenCage[];
}

/** KenKen's slice of the ONE persistence codec — a LATIN family, so the raw selector size IS
 *  the board side, and the widest clue on the wire (an operator ordinal per cage). */
export const persistence = createPersistence<KenKenCage[], KenKenPersisted>({
  game: "kenken",
  key: "kenken-board-v1",
  boardSide: boardSizeOf,
  validSizes: cagedLatinSizes.map((o) => o.value),
  defaultSize: 4,
  freshDifficulty: () => "EASY",
  sizeParam: null,
  sizeField: "boardSize",
  clue: kenkenClue,
  clueField: "cages",
});

export function useKenken() {
  const initial = persistence.resolveInitialState();

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
    initialSize: initial.size,
    boardSizeOf,
    getRandomBoard: (n, difficulty) => api.getRandomBoard(n, difficulty),
    applyDealFurniture: (board) => {
      cages.value = board.clue;
    },
    resetFurniture: () => {
      cages.value = [];
    },
    grade: (values, n) => gradeBoard(createBoardAdapter("latin", n), values),
    solve: (values, n) => api.solveBoard(values, n, cages.value),
    propagate: (values, n) => api.propagateBoard(values, n, cages.value),
    fillForced: (values, n) => fillAllForced(createBoardAdapter("latin", n), values),
    hint: (values, n, preferred) =>
      findHint(createBoardAdapter("latin", n), values, preferred),
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
    syncToUrl: persistence.syncToUrl,
    persist: (payload, n) =>
      persistence.persistBoard({ boardSize: n, ...payload, cages: cages.value }),
    clearPersisted: persistence.clearPersistedBoard,
    dropBoardParam: persistence.dropBoardParam,
    writeShareUrl: (n, values, totalCells) =>
      persistence.writeShareUrl(n, values, totalCells, cages.value),
  });
  void _solverSize; // KenKen exposes the derived `boardSize`, not the raw `solverSize`

  // Re-label `pendingSize` → `pendingBoardSize` and expose the `cages` ref; the machine's
  // derived `boardSize` (identity of the raw value) + the whole state surface pass through.
  return { ...machine, pendingBoardSize: pendingSize, cages };
}

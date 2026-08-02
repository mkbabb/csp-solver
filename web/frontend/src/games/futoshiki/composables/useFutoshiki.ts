// The Futoshiki state machine — a THIN adapter over the shared `useGameState` machine (T4-W11 R5),
// the twin of `useSudoku`. The whole undo/epoch/deal/peek/marks/persist choreography lives in
// `@games/shared/useGameState`; this file supplies only Futoshiki's DOMAIN OPS — the inequality
// furniture that rides every board, the solver payloads that thread it, the identity size math (a
// Futoshiki board is a plain N×N Latin square, no subgrid) — as a slot object, then re-labels the
// machine's neutral `pendingSize` ref to `pendingBoardSize` and adds the `inequalities` ref.
//
// The solve/generate path is the ONE in-browser wasm Worker (`@games/shared/solver/client`),
// the only shipped solve surface, with zero `/api/v1/*` dependency and no server to depend on.
import { ref } from "vue";
import { createSolverClient } from "@games/shared/solver/client";
import { futoshikiClue, inequalitiesWellFormed } from "../clue";
import { createPersistence, type PersistedCore } from "@games/shared/persistence";
import { latinSizes } from "@games/shared/selectors";
import type { Difficulty } from "@games/shared/types";
import { gradeBoard, fillAllForced, findHint } from "@games/shared/techniqueEngine";
import { createBoardAdapter } from "@games/shared/techniqueAdapter";
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
export function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 4_000_000;
}

/** A Futoshiki board side length IS the raw selector value (no subgrid tier). ONE home:
 *  `useGameState` sizes the board with it, the solver client counts cells with it. */
const boardSizeOf = (n: number) => n;

/** Futoshiki's slice of the ONE solver client — the wasm family, the size math, and the clue
 *  codec `spec.clues` spreads. No worker of its own: there is one, and every game shares it. */
const api = createSolverClient({
  game: "futoshiki",
  boardSide: boardSizeOf,
  clue: futoshikiClue,
  templates: null,
  nodeBudget: nodeBudgetForSize,
});

/** Futoshiki's board on disk: the common slice, its own size key, and the inequality furniture
 *  (permanent board decoration — never part of the given/overridden bookkeeping). */
export interface PersistedBoard extends PersistedCore {
  boardSize: number;
  difficulty: Difficulty;
  inequalities: Inequality[];
}

/**
 * Futoshiki's slice of the ONE persistence codec. Its whole divergence from sudoku's row is
 * three values: the `board_size` query key it owns (sudoku owns `size`), the clue codec pair
 * `spec.clues` already spreads, and the semantic guard a crafted pair would otherwise
 * weaponize — a floating caret per pair is a main-thread freeze.
 */
export const persistence = createPersistence<Inequality[], PersistedBoard>({
  game: "futoshiki",
  key: "futoshiki-board-state",
  boardSide: boardSizeOf,
  validSizes: latinSizes.map((o) => o.value),
  defaultSize: 5,
  freshDifficulty: () => "EASY",
  sizeParam: "board_size",
  sizeField: "boardSize",
  clue: futoshikiClue,
  clueField: "inequalities",
  validateClue: inequalitiesWellFormed,
});

export function useFutoshiki() {
  const initial = persistence.resolveInitialState();

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
    initialSize: initial.size,
    boardSizeOf,
    getRandomBoard: (n, difficulty) => api.getRandomBoard(n, difficulty),
    applyDealFurniture: (board) => {
      inequalities.value = board.clue;
    },
    resetFurniture: () => {
      inequalities.value = [];
    },
    grade: (values, n) =>
      gradeBoard(createBoardAdapter("latin", n, inequalities.value), values),
    solve: (values, n) => api.solveBoard(values, n, inequalities.value),
    propagate: (values, n) => api.propagateBoard(values, n, inequalities.value),
    fillForced: (values, n) =>
      fillAllForced(createBoardAdapter("latin", n, inequalities.value), values),
    hint: (values, n, preferred) =>
      findHint(createBoardAdapter("latin", n, inequalities.value), values, preferred),
    snapshotExtra: () => ({
      inequalities: inequalities.value.map(([a, b]) => [a, b] as [number, number]),
    }),
    restoreExtra: (blob) => {
      inequalities.value = blob.inequalities.map(([a, b]) => [a, b] as Inequality);
    },
    restorePersistedFurniture: (persisted) => {
      inequalities.value = persisted.inequalities.map(([a, b]) => [a, b] as Inequality);
    },
    syncToUrl: persistence.syncToUrl,
    persist: (payload, n) =>
      persistence.persistBoard({
        boardSize: n,
        ...payload,
        inequalities: inequalities.value,
      }),
    clearPersisted: persistence.clearPersistedBoard,
    dropBoardParam: persistence.dropBoardParam,
    writeShareUrl: (n, values, totalCells) =>
      persistence.writeShareUrl(n, values, totalCells, inequalities.value),
  });
  void _solverSize; // Futoshiki exposes the derived `boardSize`, not the raw `solverSize`

  // Re-label `pendingSize` → `pendingBoardSize` and expose the `inequalities` ref; the machine's
  // derived `boardSize` (identity of the raw value) + the whole state surface pass through.
  return { ...machine, pendingBoardSize: pendingSize, inequalities };
}

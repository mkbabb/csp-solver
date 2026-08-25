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

/**
 * Thermo's generation bank (T9-W4 §4.1) — the 16×16 tiers, dealt instead of dug.
 *
 * Thermo used to hand `templates: null` because the wasm had no thermo template surface to hand
 * one to; the slot was inert, and the family dug live at every size. At 0.7.0 the surface
 * exists, and the measurements say what to do with it: 16×16 HARD live generation still runs a
 * 3.6s median and a 53.9s worst case with the crate's attempt-stop in place. The stop bounds the
 * algorithm, the bank removes the search.
 *
 * TWO THINGS ARE DELIBERATE HERE.
 *
 * The source is DECLARED, not inferred: `thermoTierSource` answers `livegen` for the small
 * boards because the table says so, never because the bank came up empty. That is the tier-table
 * discipline sudoku bought after a `git rm` shipped a silent live-gen regression, and it costs
 * one function call to keep.
 *
 * The bank is IMPORTED WHEN IT IS NEEDED, not when this module loads (§4.4). A static import
 * would pin 28 kB of board literal into whatever chunk holds this composable; the `import()`
 * puts it in a chunk of its own that only a 16×16 deal ever fetches. The client's `templates`
 * slot takes a promise for exactly this reason.
 */
const DIFFICULTY_KEY: Record<Difficulty, "easy" | "medium" | "hard"> = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

async function thermoTemplates(
  n: number,
  difficulty: Difficulty,
): Promise<Uint32Array<ArrayBuffer>> {
  const { thermoTierSource, THERMO_BANK } = await import("../data/templates");
  const tier = DIFFICULTY_KEY[difficulty];
  if (thermoTierSource(n, tier) === "livegen") return new Uint32Array(0);
  // `bank_pick` reads the buffer as back-to-back records; the flat concatenation IS the wire
  // form, so the join is the encoding (csp-solver/wasm/src/errors.rs).
  const records = THERMO_BANK[n][tier];
  const flat = new Uint32Array(records.reduce((len, r) => len + r.length, 0));
  let at = 0;
  for (const record of records) {
    flat.set(record, at);
    at += record.length;
  }
  return flat;
}

/** Thermo's slice of the ONE solver client — the wasm family, the size math, the clue codec
 *  `spec.clues` spreads, and now its bank. Its DEALS run on the leashed deal channel; its
 *  solves ride the resident worker with every other game's (T9-W4 §4.1). */
const api = createSolverClient({
  game: "thermo",
  boardSide: boardSizeOf,
  clue: thermoClue,
  templates: thermoTemplates,
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

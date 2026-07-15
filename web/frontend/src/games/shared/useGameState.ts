import { computed, nextTick, ref, watch } from "vue";
// The whole board state machine both games run — the undo/history spine, the
// epoch/race discipline, the staged deal, the dirty signal, the peek/marks
// lifecycles, and the URL/persist choreography — lifted out of the twin
// `use<Game>` composables (T4-W11 R5). Everything here is GAME-AGNOSTIC: the two
// domains (Sudoku's subgrid boards, Futoshiki's inequality furniture) enter
// ONLY through the `GameStateDomain` slot object — per-game functions/values,
// never a config boolean (the P12 god-interface guard). The thin adapters
// (`useSudoku`/`useFutoshiki`) build that slot, call this, and re-label the two
// size refs to their own public names.
import { classifyError } from "@games/shared/solver/classifyError";
import { useUndoHistory, type BatchDelta } from "./useUndoHistory";
import { usePencilMarks } from "./usePencilMarks";
import { useUserMarks } from "./useUserMarks";
import { useAssists } from "./useAssists";
import { formatGradeSignature, describeTally } from "@games/shared/techniqueVoice";
import type { HintResult, TechniqueId } from "@games/shared/techniqueEngine";
import type { SolveState, SolveStats } from "@games/shared/types";

/** The whole-puzzle pool blob's shared core (T4-WU) — the cell state a `board` entry
 *  restores. Sets flatten to sorted arrays for a canonical content hash. A game's own
 *  furniture (Futoshiki's printed inequalities) rides along as `TExtra`, merged in by the
 *  domain's `snapshotExtra`, so a restored board is complete. */
interface CoreBoardBlob {
  values: Record<string, number>;
  given: string[];
  origGiven: string[];
  overridden: string[];
  solved: Record<string, number>;
}
/** The user pencil-marks that annotated a board — travelled alongside it in the pool. */
interface MarksBlob {
  corner: Record<string, number[]>;
  center: Record<string, number[]>;
}

/** The persisted-board fields the machine restores directly (both games' `PersistedBoard`
 *  carry these; each adds its own size key + furniture, restored via the domain hooks). */
interface CommonPersisted {
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  overriddenCells: string[];
  solvedValues: Record<string, number>;
  boardGeneration: number;
}

/** The init-resolution the machine reads — the game-agnostic slice of each game's
 *  `resolveInitialState()` (its own `size`/`boardSize` field enters via `initialSize`). */
interface CommonInitial<TDiff extends string, TPersisted extends CommonPersisted> {
  difficulty: TDiff;
  source: string;
  persisted: TPersisted | null;
  boardLink: "absent" | "ok" | "invalid";
}

/** The common persist payload the machine hands the domain — the domain adds its size key
 *  (`size` vs `boardSize`) and any furniture, then writes localStorage. */
interface CommonPersistPayload<TDiff extends string> {
  difficulty: TDiff;
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  overriddenCells: string[];
  solvedValues: Record<string, number>;
  boardGeneration: number;
}

/** The last-solve result the machine reads off `domain.solve` (both games' `SolveResponse`). */
interface SolveResultLike {
  solved: boolean;
  values: Record<string, number>;
  backtracks: number;
  nodesExplored: number;
  propagations: number;
  solutionCount: number;
  elapsedMs?: number;
}
/** The measured grade the machine reads off `domain.grade` (both games' technique result). */
interface GradeResultLike {
  hardestTechnique: TechniqueId | null;
  solved: boolean;
}
/** The forced-placement sweep the machine reads off `domain.fillForced` (W7's `fillAllForced`). */
interface FillResultLike {
  placements: { cell: number; value: number }[];
}

/**
 * The per-game domain — every seam where Sudoku and Futoshiki genuinely diverge, as slots.
 * `TDiff` the game's difficulty tier, `TDealt` its `getRandomBoard` response, `TExtra` its
 * board-blob furniture (`{}` for Sudoku, `{ inequalities }` for Futoshiki), `TPersisted` its
 * saved-board shape. Every field is a value or a per-game function — the KISS guard.
 */
export interface GameStateDomain<
  TDiff extends string,
  TDealt extends { values: Record<string, number> },
  TExtra,
  TPersisted extends CommonPersisted,
> {
  /** The init state (game-agnostic slice) + the raw selector size read from it. */
  initial: CommonInitial<TDiff, TPersisted>;
  initialSize: number;
  /** Raw selector value → board side length: Sudoku `n**2` (subgrid → dim), Futoshiki `n`. */
  boardSizeOf: (rawSize: number) => number;
  /** Size-scaled node budget for the client solve (per-game table). */
  nodeBudgetForSize: (rawSize: number) => number;
  /** Deal a fresh board at a raw size + difficulty (the game's solver client). */
  getRandomBoard: (rawSize: number, difficulty: TDiff) => Promise<TDealt>;
  /** Apply the dealt board's own furniture (Futoshiki: set inequalities; Sudoku: noop). */
  applyDealFurniture: (board: TDealt) => void;
  /** Reset the furniture on a full re-init (Futoshiki: inequalities = []; Sudoku: noop). */
  resetFurniture: () => void;
  /** Grade the dealt board (W7 technique engine, over self-computed candidates). */
  grade: (values: Record<string, number>, rawSize: number) => GradeResultLike;
  /** First-solution solve via the game's solver client (threads clues where it has them). */
  solve: (
    values: Record<string, number>,
    rawSize: number,
    nodeBudget: number,
  ) => Promise<SolveResultLike>;
  /** Root AC-3/GAC propagation → per-cell surviving-candidate bitmasks (engine marks). */
  propagate: (values: Record<string, number>, rawSize: number) => Promise<Uint32Array>;
  /** Every naked+hidden single present, in one sweep (W7 fill-all-forced). */
  fillForced: (values: Record<string, number>, rawSize: number) => FillResultLike;
  /** The cheapest named single that places a digit (W7 hint), or null. */
  hint: (
    values: Record<string, number>,
    rawSize: number,
    preferred: number | undefined,
  ) => HintResult | null;
  /** The board-blob furniture (merged into the pool blob; Sudoku `{}`, Futoshiki inequalities). */
  snapshotExtra: () => TExtra;
  /** Restore that furniture from a pool blob (undo/redo replay). */
  restoreExtra: (blob: CoreBoardBlob & TExtra) => void;
  /** Restore that furniture from a persisted board (localStorage/permalink). */
  restorePersistedFurniture: (persisted: TPersisted) => void;
  /** URL sync of the size/difficulty pair (the game's own `?size=`/`?board_size=` writer). */
  syncToUrl: (rawSize: number, difficulty: TDiff) => void;
  /** Persist the board (the domain adds its size key + furniture, writes localStorage). */
  persist: (payload: CommonPersistPayload<TDiff>, rawSize: number) => void;
  /** Drop the persisted board (localStorage). */
  clearPersisted: () => void;
  /** Drop the `?board=` permalink (stale the moment a new board is dealt/cleared). */
  dropBoardParam: () => void;
  /** Encode the current board into `?board=` and write it to the address bar (the share act). */
  writeShareUrl: (
    rawSize: number,
    values: Record<string, number>,
    totalCells: number,
  ) => void;
}

/**
 * The shared board state machine (T4-W11 R5). Returns the whole reactive surface both games
 * expose under their common public names, plus the two size refs (`solverSize`/`pendingSize`)
 * the adapters re-label (`size`/`pendingSize` for Sudoku; `boardSize`/`pendingBoardSize` for
 * Futoshiki). Preserves EXACTLY the owner-audited T4-WU behaviours: the epoch parity ruling
 * (board-REPLACING resolves bump the generation; solve does not), single-writer
 * push-after-resolve (a stale resolve records nothing), the `restoring` flag walking marks
 * past the void-watch, refuse-while-pending, the Fill batch entry, and session-only history.
 */
export function useGameState<
  TDiff extends string,
  TDealt extends { values: Record<string, number> },
  TExtra,
  TPersisted extends CommonPersisted,
>(domain: GameStateDomain<TDiff, TDealt, TExtra, TPersisted>) {
  const initial = domain.initial;

  // T4-W3 share-truth: a `?board=` that was PRESENT but failed to decode (the discriminated
  // 'invalid', never conflated with 'absent'). The board folds a one-line corrupt-link notice
  // into that first fresh-board announce so the bad link doesn't degrade silently. Fixed at init.
  const linkError = ref(initial.boardLink === "invalid");

  // T4-WU/U2 — the LIVE raw selector value (Sudoku's sub-grid `size`, Futoshiki's `boardSize`)
  // and the STAGED one the New-game selector binds to. Arm-not-live: picking a size no longer
  // wipes the board (the retired `watch(size)` re-deal); only `deal()` commits it. `boardSize` is
  // the derived side length (Sudoku `size**2`, Futoshiki identity); `totalCells` its square.
  const solverSize = ref(domain.initialSize);
  const pendingSize = ref(domain.initialSize);
  const difficulty = ref<TDiff>(initial.difficulty);
  const boardSize = computed(() => domain.boardSizeOf(solverSize.value));
  const totalCells = computed(() => boardSize.value ** 2);

  // values[position] = number (0 = empty)
  const values = ref<Record<string, number>>({});
  const givenCells = ref<Set<string>>(new Set());
  const originalGivenCells = ref<Set<string>>(new Set());
  const overriddenCells = ref<Set<string>>(new Set());
  const animatingCells = ref<Set<string>>(new Set());
  const solveState = ref<SolveState>("idle");
  const solvedValues = ref<Record<string, number>>({});
  // Stats from the last completed solve (W6 stat-line). Set only by solve() — the peek path
  // never touches it. Cleared wherever the grade reverts to idle.
  const solveStats = ref<SolveStats | null>(null);
  const loading = ref(false);
  const errorMessage = ref("");
  // The typed error code (SolverErrorCode) behind the paper note, consumed by the Board for the
  // §5.2 copy split. Kept coherent with errorMessage.
  const errorCode = ref("");
  const boardGeneration = ref(0);

  // ── The honest grade (T4-W7) — the hardest technique the engine needed to solve the DEALT
  // board IS its difficulty. Held on the game state: W9-B1 reads `hardestTechnique` for the
  // tally; the margin signature reads `gradeSignature`. Set at deal; null on clear/init/restore.
  const hardestTechnique = ref<TechniqueId | null>(null);
  const gradeSolved = ref(false);
  // T4-W9-B1 — the honesty gate: `graded` is true ONLY after the engine has run on a dealt,
  // supported board. A restored permalink or hand-typed board never trips it, so the tally shows
  // the dashed placeholder rather than a fabricated tier (ROW 5).
  const graded = ref(false);
  const gradeSignature = computed(() =>
    formatGradeSignature(hardestTechnique.value, gradeSolved.value),
  );
  // The displayed-quality tally descriptor (W9-B1) — fully derived here (DifficultyTally renders).
  const gradeTally = computed(() =>
    describeTally(graded.value, hardestTechnique.value, gradeSolved.value),
  );

  // ── The named hint (T4-W7) — two presses: the first names the cheapest human deduction and
  // arms the reasoning; the second inks the digit through the existing reveal draw-in. Null
  // between transactions. Any board mutation disarms it (a hint the board changed under is stale).
  const hintReasoning = ref<HintResult | null>(null);

  type BoardBlob = CoreBoardBlob & TExtra;

  // The history spine (T4-WU / E9) — one tagged log + content-hash board pool (D16 twin). The
  // effects are arrow wrappers so the call is hoisting-safe: every primitive is declared below.
  // `pending` refuses undo/redo while a board op is in flight — the race gate at its single choke.
  const {
    clearUndo,
    recordEdit,
    recordHintInk,
    recordBatch,
    recordMark,
    recordBoard,
    undo,
    redo,
    canUndo,
    canRedo,
    undoDepth,
  } = useUndoHistory<BoardBlob, MarksBlob>({
    applyValue: (pos, value) => applyCellValue(pos, value),
    applyHintInk: (pos, value) => applyHintInk(pos, value),
    removeHintInk: (pos, prev) => removeHintInk(pos, prev),
    applyMark: (slot, pos, list) => setMarkSlot(slot, String(pos), list),
    restoreBoard: (board, marks) => restoreBoardState(board, marks),
    pending: () => loading.value,
  });

  // T4-WU/U3 — the conditional-confirm dirty gate. `isDirty` = undo-depth non-empty (E9 crit #8,
  // spec ROW 3): ONE derived signal off U1's spine, no parallel bool to desynchronize. A pristine
  // board reads 0 (the mount deal is off-log; a size-changing Deal + a permalink restore clear the
  // log), so Deal + Clear act instantly there; any recorded value/mark/board-swap lifts it.
  const isDirty = computed(() => undoDepth.value > 0);

  function initBoard() {
    values.value = {};
    givenCells.value = new Set();
    originalGivenCells.value = new Set();
    overriddenCells.value = new Set();
    domain.resetFurniture();
    animatingCells.value = new Set();
    solveState.value = "idle";
    solvedValues.value = {};
    solveStats.value = null;
    errorMessage.value = "";
    errorCode.value = "";
    clearGrade();
    for (let i = 0; i < totalCells.value; i++) {
      values.value[String(i)] = 0;
    }
    clearUndo();
    boardGeneration.value++;
  }

  // T4-W7 — the measured grade + any armed hint are properties of the DEALT board; a blank or
  // reset board carries neither. Cleared wherever the board is emptied or swapped.
  function clearGrade() {
    hardestTechnique.value = null;
    gradeSolved.value = false;
    graded.value = false; // W9-B1 — a blank/reset/restored board is ungraded (dashed placeholder)
    hintReasoning.value = null;
  }

  function clearBoard() {
    const prevBlob = snapshotBoard(); // T4-WU — the board this clear blanks (undo restores it)
    const prevMarks = snapshotMarks();
    solveState.value = "idle";
    solvedValues.value = {};
    solveStats.value = null;
    errorMessage.value = "";
    errorCode.value = "";
    clearGrade();
    for (let i = 0; i < totalCells.value; i++) {
      values.value[String(i)] = 0;
    }
    givenCells.value = new Set();
    originalGivenCells.value = new Set();
    overriddenCells.value = new Set();
    animatingCells.value = new Set();
    // Furniture (Futoshiki's inequalities) is permanent: a clear blanks the cells but leaves the
    // printed constraints, so the board stays solvable. `clearUndo` DIES (T4-WU): a clear is now
    // one undoable `board` entry — undo restores the board AND its marks; the generation bump voids
    // the live notes (void-watch), and the pool carries `prevMarks` for the restore.
    boardGeneration.value++;
    domain.clearPersisted();
    domain.dropBoardParam(); // the shared configuration is stale once the board is blanked
    recordBoard(prevBlob, snapshotBoard(), prevMarks, EMPTY_MARKS, "clear");
  }

  // The cell-write primitive, shared by user edits and undo/redo replay. Given-cell immunity is
  // structural: a pristine given is never a recorded edit target (editing one overrides it first),
  // so undo/redo never writes into a live given.
  function applyCellValue(pos: number, value: number) {
    const key = String(pos);
    if (originalGivenCells.value.has(key)) {
      givenCells.value.delete(key);
      overriddenCells.value.add(key);
    }
    // If overriding a solver-introduced cell, remove only THIS cell from solvedValues (other
    // solved cells keep their sparkle-rainbow styling).
    if (key in solvedValues.value) {
      const { [key]: _, ...rest } = solvedValues.value;
      solvedValues.value = rest;
      overriddenCells.value.add(key);
    }
    values.value[key] = value;
    hintReasoning.value = null; // T4-W7 — an edit disarms a stale armed hint
    // Revert solve state so the board no longer shows success/failure.
    if (solveState.value !== "idle") {
      solveState.value = "idle";
      solveStats.value = null; // the stat-line goes stale with the grade (W6)
    }
    queueSave();
  }

  function setCell(pos: number, value: number) {
    const prev = values.value[String(pos)] ?? 0;
    applyCellValue(pos, value);
    recordEdit(pos, prev, value);
  }

  // A fresh/blank board carries no marks — the constant `nextMarks` for a deal/clear/resize board
  // entry (all void the notes going forward). Deduped to one pool slot.
  const EMPTY_MARKS: MarksBlob = { corner: {}, center: {} };

  // Snapshot the whole puzzle state into a pool blob (T4-WU). Sets flatten to sorted arrays so two
  // identical boards hash identically (content-addressed dedup); the domain merges its furniture.
  function snapshotBoard(): BoardBlob {
    return {
      values: { ...values.value },
      given: Array.from(givenCells.value).sort(),
      origGiven: Array.from(originalGivenCells.value).sort(),
      overridden: Array.from(overriddenCells.value).sort(),
      solved: { ...solvedValues.value },
      ...domain.snapshotExtra(),
    } as BoardBlob;
  }

  // Redo of hint ink — write the digit in the solver's own tone (no record); the reveal draw-in
  // path, factored so `inkReveal` and the undo-replay share it.
  function applyHintInk(pos: number, value: number) {
    const key = String(pos);
    values.value[key] = value;
    solvedValues.value = { ...solvedValues.value, [key]: value };
    overriddenCells.value.delete(key);
    animatingCells.value = new Set([key]);
    if (solveState.value !== "idle") {
      solveState.value = "idle";
      solveStats.value = null;
    }
    queueSave();
  }

  // Undo of hint ink (T4-WU) — write `prev` and STRIP the `solvedValues` membership, so the reveal
  // leaves no solver-tone residue and the flourish gate is re-armed (a board later completed with
  // no solver ink standing can celebrate honestly).
  function removeHintInk(pos: number, prev: number) {
    const key = String(pos);
    values.value[key] = prev;
    if (key in solvedValues.value) {
      const { [key]: _, ...rest } = solvedValues.value;
      solvedValues.value = rest;
    }
    animatingCells.value = new Set();
    if (solveState.value !== "idle") {
      solveState.value = "idle";
      solveStats.value = null;
    }
    queueSave();
  }

  async function randomize(opts?: { record?: boolean }) {
    loading.value = true;
    errorMessage.value = "";
    errorCode.value = "";
    solveState.value = "idle";
    solvedValues.value = {};
    solveStats.value = null;
    const dispatchGen = boardGeneration.value; // T4-WU epoch — capture at dispatch

    try {
      const board = await domain.getRandomBoard(solverSize.value, difficulty.value);
      // Push-after-resolve, drop-on-mismatch (T4-WU): a superseded/stale deal (a newer board op
      // bumped the generation while this awaited) applies nothing and records nothing — no orphan
      // entry can ever disagree with the board. Latest-wins.
      if (boardGeneration.value !== dispatchGen) return;
      const prevBlob = snapshotBoard(); // the board this deal replaces
      const prevMarks = snapshotMarks();
      values.value = {};
      givenCells.value = new Set();
      originalGivenCells.value = new Set();
      overriddenCells.value = new Set();

      for (let i = 0; i < totalCells.value; i++) values.value[String(i)] = 0;
      for (const [pos, val] of Object.entries(board.values)) {
        values.value[pos] = val;
        if (val !== 0) givenCells.value.add(pos);
      }
      domain.applyDealFurniture(board); // Futoshiki: adopt the printed inequality furniture

      originalGivenCells.value = new Set(givenCells.value);
      animatingCells.value = new Set(givenCells.value);
      // T4-W7 — grade the DEALT board synchronously: the hardest technique the ladder needed IS
      // its honest difficulty. Pure TS over self-computed candidates (never the GAC masks);
      // bounded, no search. Feeds the margin signature + W9-B1's tally.
      const gradeResult = domain.grade(values.value, solverSize.value);
      hardestTechnique.value = gradeResult.hardestTechnique;
      gradeSolved.value = gradeResult.solved;
      graded.value = true; // W9-B1 — the engine ran on a dealt board; the tally is defensible
      hintReasoning.value = null; // a fresh deal voids any armed hint
      domain.dropBoardParam(); // a freshly-dealt board voids the shared permalink
      // T4-WU epoch parity (crit #3): a deal bumps the generation — the void-watch voids user
      // marks, the peek cache invalidates, and the generation becomes a valid per-op stale-drop
      // discriminant. `clearUndo` DIES: deals APPEND a board entry (undo restores the prior board).
      boardGeneration.value++;
      if (opts?.record !== false) {
        recordBoard(prevBlob, snapshotBoard(), prevMarks, EMPTY_MARKS, "deal");
      }
      queueSave();
    } catch (e) {
      // A generate failure was fully silent before — route it through the shared fiction
      // classifier and surface it (paper note for machinery faults).
      solveState.value = classifyError(e).kind === "teacher-red" ? "failed" : "error";
      errorCode.value =
        e instanceof Error && "code" in e
          ? String((e as { code?: unknown }).code ?? "")
          : "";
      errorMessage.value = e instanceof Error ? e.message : "Failed to get board";
    } finally {
      loading.value = false;
    }
  }

  // T4-WU/U2 — the Deal commit. Commits the staged size + difficulty as ONE act. A SAME-size Deal
  // records one undoable board entry (size-undo falls out of the Deal button). A size-CHANGING
  // Deal resets to the new dimensions and deals off-log: the board blob carries no size, so a
  // cross-size undo can't restore honestly, so a size commit is a clean-reset deal — exactly what
  // the retired `watch(size)` did, now behind the guarded button instead of a bare chip tap.
  async function deal() {
    if (pendingSize.value !== solverSize.value) {
      solverSize.value = pendingSize.value;
      domain.clearPersisted();
      initBoard();
      await randomize({ record: false });
    } else {
      await randomize();
    }
  }

  async function solve() {
    loading.value = true;
    solveState.value = "solving";
    solveStats.value = null; // never show a previous solve's numbers mid-solve
    errorMessage.value = "";
    errorCode.value = "";
    const dispatchGen = boardGeneration.value; // T4-WU epoch — capture at dispatch
    const prevBlob = snapshotBoard(); // the pre-solve board (undo target)
    const prevMarks = snapshotMarks();

    try {
      const result = await domain.solve(
        values.value,
        solverSize.value,
        domain.nodeBudgetForSize(solverSize.value),
      );
      // Drop a stale solve (a board op superseded it mid-flight) — append nothing (T4-WU).
      if (boardGeneration.value !== dispatchGen) return;
      const newlySolved: Record<string, number> = {};
      const cellsToAnimate = new Set<string>();

      for (const [pos, val] of Object.entries(result.values)) {
        if (values.value[pos] === 0) {
          values.value[pos] = val;
          newlySolved[pos] = val;
          cellsToAnimate.add(pos);
        }
      }

      solvedValues.value = { ...solvedValues.value, ...newlySolved };
      // solved=false means the solver *proved* no completion exists for the user-entered cells
      // (provable UNSAT) — distinct from the budget case.
      solveState.value = result.solved ? "solved" : "failed";
      solveStats.value = {
        backtracks: result.backtracks,
        nodesExplored: result.nodesExplored,
        propagations: result.propagations,
        solutionCount: result.solutionCount,
        elapsedMs: result.elapsedMs,
      };
      animatingCells.value = cellsToAnimate;
      // T4-WU — a solve that FILLED cells is one undoable `board` entry (undo restores the
      // pre-solve board, redo re-fills). Solve MUTATES in place (givens + furniture stay), so it
      // does NOT bump the generation: the marks survive under the filled cells (prev/next marks are
      // the same blob) and the celebration crest is untouched. A no-fill solve records nothing.
      if (cellsToAnimate.size > 0) {
        recordBoard(prevBlob, snapshotBoard(), prevMarks, snapshotMarks(), "solve");
      }
      queueSave();
    } catch (e) {
      // Route by the shared fiction classifier: provable UNSAT / INVALID_INPUT → the teacher's red
      // pencil ('failed'); everything else — BUDGET_EXCEEDED, TIMEOUT, WORKER_FAILURE, a bare
      // network TypeError — → the paper note ('error'). The two are never conflated.
      solveState.value = classifyError(e).kind === "teacher-red" ? "failed" : "error";
      errorCode.value =
        e instanceof Error && "code" in e
          ? String((e as { code?: unknown }).code ?? "")
          : "";
      errorMessage.value = e instanceof Error ? e.message : "Solve failed";
    } finally {
      loading.value = false;
    }
  }

  // ── Answer-key peek: solve the PRISTINE givens, cache per generation ──
  // Feeds the read-only laminate overlay; NEVER mutates `values`. The W6 Worker solve path makes
  // this API-free, and boards derive from solution banks so the pristine givens are satisfiable.
  const peekCache = ref<{ gen: number; values: Record<string, number> } | null>(null);
  async function peekSolution(): Promise<Record<string, number>> {
    if (peekCache.value && peekCache.value.gen === boardGeneration.value) {
      return peekCache.value.values;
    }
    const givensOnly: Record<string, number> = {};
    for (let i = 0; i < totalCells.value; i++) {
      const key = String(i);
      givensOnly[key] = originalGivenCells.value.has(key)
        ? (values.value[key] ?? 0)
        : 0;
    }
    const result = await domain.solve(
      givensOnly,
      solverSize.value,
      domain.nodeBudgetForSize(solverSize.value),
    );
    peekCache.value = { gen: boardGeneration.value, values: { ...result.values } };
    return peekCache.value.values;
  }

  // Ink a revealed digit through the EXISTING reveal path (350ms solver-ink draw-in, grain
  // suppressed during the tween, PRM-instant branch) — one grammar, zero new timing constants.
  // Added to solvedValues so it renders in the solver's own tone. T4-WU: hint ink enters history as
  // a `value` entry with `tone:'solved'`, so undoing a hint strips the solver-tone membership (via
  // `removeHintInk`) and re-arms the flourish gate — owner-taste flag (B5).
  function inkReveal(pos: number, val: number) {
    const key = String(pos);
    if (val === 0 || values.value[key] === val) return;
    const prev = values.value[key] ?? 0;
    applyHintInk(pos, val);
    recordHintInk(pos, prev, val);
  }

  // ── Fill-all-forced (T4-W8 — the partial-solve button; W7 owns the detector) ──────────
  // Apply every naked+hidden single present in ONE sweep, inking each through the EXISTING reveal
  // draw-in — `solvedValues` (solver-ink tone) + `animatingCells` (the reveal wave) — the same bulk
  // path `solve()` uses, zero new timing constants. Sourced from the W7 technique engine
  // (self-computed candidates), NOT the wasm solver: synchronous, no worker, no loading/solve state
  // — so the epoch/race machinery does not apply (nothing awaits; the sweep is atomic). T4-WU: the
  // sweep enters history as ONE `{kind:'batch'}` entry — one gesture, one undo/redo — recorded AFTER
  // it resolves (single-writer). A sweep that forces nothing (Δ0 stop) records NOTHING.
  function fillForced() {
    const { placements } = domain.fillForced(values.value, solverSize.value);
    const newlyFilled: Record<string, number> = {};
    const cellsToAnimate = new Set<string>();
    const deltas: BatchDelta[] = [];
    for (const p of placements) {
      const key = String(p.cell);
      if (values.value[key] !== 0) continue; // ink empties only (the detector never targets a filled cell)
      const prev = values.value[key] ?? 0;
      values.value[key] = p.value;
      newlyFilled[key] = p.value;
      overriddenCells.value.delete(key);
      cellsToAnimate.add(key);
      deltas.push({ pos: p.cell, prev, next: p.value, tone: "solved" });
    }
    if (cellsToAnimate.size === 0) return; // nothing forced — leave the board (and its grade/hint) untouched
    solvedValues.value = { ...solvedValues.value, ...newlyFilled };
    animatingCells.value = cellsToAnimate;
    hintReasoning.value = null; // the board changed under any armed hint
    if (solveState.value !== "idle") {
      solveState.value = "idle";
      solveStats.value = null;
    }
    queueSave();
    recordBatch(deltas); // one entry = one gesture = one undo (push-after-resolve)
  }

  // ── The named hint (T4-W7) — reasoning first, digit second ──────────────────────
  // First press: name the cheapest human deduction (naked/hidden single) and arm its reasoning —
  // the board highlights the `becauseCells` in the peek-laminate tone and writes the technique name
  // in the margin. Second press: ink the digit through `inkReveal`. When no single is available,
  // degrade honestly to the answer-key reveal of the focused cell — named `reveal`, so the two-press
  // shape holds.
  async function hintCell(pos: number) {
    // Second press: ink the armed reasoning.
    if (hintReasoning.value) {
      const h = hintReasoning.value;
      hintReasoning.value = null;
      inkReveal(h.cell, h.value);
      return;
    }
    // First press: the cheapest named single, preferring the focused cell when it is forced.
    const key = String(pos);
    const preferred = originalGivenCells.value.has(key) ? undefined : pos;
    const step = domain.hint(values.value, solverSize.value, preferred);
    if (step) {
      hintReasoning.value = step;
      return;
    }
    // Fallback — no nameable single: reveal the focused cell from the answer key, unnamed.
    if (originalGivenCells.value.has(key)) return; // givens already show the answer
    let solution: Record<string, number>;
    try {
      solution = await peekSolution();
    } catch {
      return; // solve unavailable — fail quietly
    }
    const val = solution[key] ?? 0;
    if (val === 0 || values.value[key] === val) return;
    hintReasoning.value = {
      technique: "reveal",
      cell: pos,
      value: val,
      becauseCells: [pos],
    };
  }

  // Engine-domains pencil marks (W6 beat 9 — the shared marks machine). Each scene mirrors
  // `peekActive` into `setMarksActive`; the propagate thunk closes over the live solver + board.
  const { marksActive, refreshMarks, setMarksActive, pencilMarks } = usePencilMarks(
    () => domain.propagate(values.value, solverSize.value),
    values,
    boardSize,
    totalCells,
  );

  // User pencil marks (T4-W8 ROW 1 — the player's own notes). A SEPARATE store from the engine
  // marks above. `boardGeneration` voids the notes on clear/randomize/size-swap; the mode survives.
  const {
    pencilMode,
    cornerMarks,
    centerMarks,
    setPencilMode,
    cyclePencilMode,
    toggleUserMark: rawToggleUserMark,
    setMarkSlot,
    setUserMarks,
    restoring,
  } = useUserMarks(boardGeneration);

  // Snapshot the user pencil marks into a pool blob (T4-WU) — the notes that annotate the current
  // board, so a `board` entry can travel them alongside the board it restores.
  function snapshotMarks(): MarksBlob {
    return {
      corner: { ...cornerMarks.value },
      center: { ...centerMarks.value },
    };
  }

  // The board-undo/redo replay (T4-WU) — the restore-order edge. Raise `restoring` so the marks
  // void-watch no-ops on the generation bump this restore performs, then re-hydrate the board AND
  // the marks that annotated it; lower the flag next tick, after the watch flushed.
  function restoreBoardState(board: BoardBlob, marks: MarksBlob) {
    restoring.value = true;
    values.value = { ...board.values };
    givenCells.value = new Set(board.given);
    originalGivenCells.value = new Set(board.origGiven);
    overriddenCells.value = new Set(board.overridden);
    domain.restoreExtra(board); // Futoshiki: re-hydrate the inequality furniture
    solvedValues.value = { ...board.solved };
    animatingCells.value = new Set();
    solveState.value = "idle";
    solveStats.value = null;
    errorMessage.value = "";
    errorCode.value = "";
    clearGrade(); // a restored board carries no live measured grade (W6's request voice)
    peekCache.value = null; // the cached answer key is stale for the restored board
    boardGeneration.value++; // board replaced — bump the epoch (void-watch suppressed here)
    setUserMarks(marks.corner, marks.center);
    queueSave();
    void nextTick(() => {
      restoring.value = false;
    });
  }

  // The tracked user-mark author (T4-WU) — wraps the raw toggle so every note gesture enters
  // history as ONE `mark` entry. A digit toggles the active slot; an erase (`value===0`) hits both
  // corner + center, so both slot deltas ride the single entry (one gesture, one undo).
  function toggleUserMark(pos: number, value: number) {
    if (pencilMode.value === "off") return;
    const key = String(pos);
    if (value === 0) {
      const prevCorner = [...(cornerMarks.value[key] ?? [])];
      const prevCenter = [...(centerMarks.value[key] ?? [])];
      rawToggleUserMark(pos, 0);
      recordMark(pos, {
        corner: prevCorner.length ? { prev: prevCorner, next: [] } : undefined,
        center: prevCenter.length ? { prev: prevCenter, next: [] } : undefined,
      });
      return;
    }
    const slot = pencilMode.value; // 'corner' | 'center'
    const mapRef = slot === "corner" ? cornerMarks : centerMarks;
    const prev = [...(mapRef.value[key] ?? [])];
    rawToggleUserMark(pos, value);
    const next = [...(mapRef.value[key] ?? [])];
    recordMark(pos, { [slot]: { prev, next } });
  }

  // Board assists (T4-W8 ROW 2 + ROW 3 — the player's check settings; D16 twin). ROW 2: the
  // error-check MODE over the SAME pure `findConflicts` — `proactiveCheck` is the display gate the
  // board ORs with its 'failed' grade. ROW 3: `candidatesPinned` holds the engine marks on.
  const {
    errorCheckMode,
    proactiveCheck,
    setErrorCheckMode,
    candidatesPinned,
    setCandidatesPinned,
  } = useAssists(values);

  // ── Restore from persisted state (no animation) ──────────────────
  function restoreBoard(persisted: TPersisted) {
    values.value = { ...persisted.values };
    givenCells.value = new Set(persisted.givenCells);
    originalGivenCells.value = new Set(persisted.originalGivenCells);
    overriddenCells.value = new Set(persisted.overriddenCells);
    domain.restorePersistedFurniture(persisted); // Futoshiki: inequalities from the saved board
    solvedValues.value = { ...persisted.solvedValues };
    boardGeneration.value = persisted.boardGeneration;
    animatingCells.value = new Set(); // no re-animation on restore
    solveState.value = "idle";
    solveStats.value = null;
    errorMessage.value = "";
    errorCode.value = "";
    clearGrade(); // a restored board carries no measured grade (W6's request voice is the fallback)
    clearUndo();
  }

  // ── Persistence helper ───────────────────────────────────────────
  function saveBoardState() {
    domain.persist(
      {
        difficulty: difficulty.value,
        values: values.value,
        givenCells: Array.from(givenCells.value),
        originalGivenCells: Array.from(originalGivenCells.value),
        overriddenCells: Array.from(overriddenCells.value),
        solvedValues: solvedValues.value,
        boardGeneration: boardGeneration.value,
      },
      solverSize.value,
    );
  }

  // ── Share-on-demand permalink (W6; T4-W3 share-truth) ────────────
  // The explicit share act: encode the current board into `?board=`, write it to the address bar
  // (so a reload reproduces it — URL wins over storage), then COPY the full href. The replaceState
  // already landed, so the shared link is live in the bar regardless of the copy's fate. Returns the
  // clipboard promise so the caller confirms ONLY on a real resolve; an absent Clipboard API
  // (insecure context) REJECTS rather than silently "succeeding" (the write-side mirror of the
  // corrupt-link signal). The ONLY writer of `?board=`.
  function shareBoard(): Promise<void> {
    domain.writeShareUrl(solverSize.value, values.value, totalCells.value);
    if (!navigator.clipboard) {
      return Promise.reject(new Error("Clipboard API unavailable"));
    }
    return navigator.clipboard.writeText(window.location.href);
  }

  // ── Initialization ───────────────────────────────────────────────
  domain.syncToUrl(solverSize.value, difficulty.value);

  const canRestore =
    (initial.source === "url+storage" ||
      initial.source === "storage-only" ||
      initial.source === "url-board") &&
    initial.persisted != null &&
    Object.values(initial.persisted.values).some((v) => v !== 0);

  if (canRestore) {
    restoreBoard(initial.persisted!);
  } else {
    // No meaningful persisted state — init empty board then auto-fetch.
    if (initial.persisted) domain.clearPersisted();
    initBoard();
    randomize({ record: false }); // fire-and-forget mount deal — not a user gesture, off-log
  }

  // ── Watchers ─────────────────────────────────────────────────────

  // Sync URL when size or difficulty changes. T4-WU/U2 — size is ARM-NOT-LIVE: the live re-deal
  // `watch(size)` is RETIRED. Picking a size stages `pendingSize`; only `deal()` commits it. This
  // watch is URL-sync ONLY — a size change writes at the Deal commit, a difficulty change on
  // selection, neither wipes the board.
  watch([solverSize, difficulty], () => {
    domain.syncToUrl(solverSize.value, difficulty.value);
  });

  // Engine-domains pencil marks: while the peek gesture is held, any cell mutation or board swap
  // re-propagates (K-peek is a toggle, so the page can still be written on with the marks up).
  // `values` is mutated in place at `setCell`, so the deep watch is load-bearing; `boardGeneration`
  // covers clear/randomize/size swaps. Inert (one boolean test) while marks are off.
  watch(
    [values, boardGeneration],
    () => {
      if (marksActive.value) refreshMarks();
    },
    { deep: true },
  );

  // Debounced persistence — called explicitly at mutation points.
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  function queueSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveBoardState();
      saveTimer = null;
    }, 300);
  }

  return {
    solverSize,
    pendingSize,
    difficulty,
    boardSize,
    totalCells,
    values,
    givenCells,
    originalGivenCells,
    overriddenCells,
    animatingCells,
    solveState,
    solvedValues,
    solveStats,
    loading,
    errorMessage,
    errorCode,
    boardGeneration,
    initBoard,
    clearBoard,
    setCell,
    randomize,
    deal,
    solve,
    fillForced,
    peekSolution,
    undo,
    redo,
    canUndo,
    canRedo,
    undoDepth,
    isDirty,
    hintCell,
    hintReasoning,
    hardestTechnique,
    gradeSignature,
    gradeTally,
    shareBoard,
    linkError,
    pencilMarks,
    setMarksActive,
    pencilMode,
    cornerMarks,
    centerMarks,
    setPencilMode,
    cyclePencilMode,
    toggleUserMark,
    errorCheckMode,
    proactiveCheck,
    setErrorCheckMode,
    candidatesPinned,
    setCandidatesPinned,
  };
}

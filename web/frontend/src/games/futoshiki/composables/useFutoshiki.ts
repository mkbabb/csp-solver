import { computed, nextTick, ref, watch } from "vue";
// The solve/generate path is the in-browser wasm Worker (`useSolver`), the only
// shipped solve surface, with zero `/api/v1/*` dependency and no server to depend
// on. The off-main-thread Worker structurally retires the GIL/DoS class for the
// served sizes.
import { useSolver } from "../solver/useSolver";
import {
  resolveInitialState,
  syncToUrl,
  persistBoard,
  clearPersistedBoard,
  encodeBoard,
  writeBoardToUrl,
  dropBoardParam,
  type PersistedBoard,
} from "./useUrlState";
import { classifyError } from "@games/shared/solver/classifyError";
import { useUndoHistory, type BatchDelta } from "../../shared/useUndoHistory";
import { usePencilMarks } from "../../shared/usePencilMarks";
import { useUserMarks } from "../../shared/useUserMarks";
import { useAssists } from "../../shared/useAssists";
import {
  gradeFutoshiki,
  hintFutoshiki,
  fillForcedFutoshiki,
} from "../technique/futoshikiTechnique";
import { formatGradeSignature, describeTally } from "@games/shared/techniqueVoice";
import type { HintResult, TechniqueId } from "@games/shared/techniqueEngine";
import type { Difficulty, Inequality, SolveState, SolveStats } from "../types";

/** The T4-WU board pool's snapshot shapes (JSON-serialisable — the pool hashes by content).
 *  Futoshiki's `BoardBlob` carries the printed inequality furniture too, so a restored board
 *  is a complete puzzle. A `MarksBlob` is the user pencil-marks that annotated it. */
interface BoardBlob {
  values: Record<string, number>;
  given: string[];
  origGiven: string[];
  overridden: string[];
  solved: Record<string, number>;
  inequalities: [number, number][];
}
interface MarksBlob {
  corner: Record<string, number[]>;
  center: Record<string, number[]>;
}

/**
 * Size-scaled node budget for the client solve. v1 sizes (N=4..7) solve an empty board
 * in 0 backtracks under the wasm AC-3+MRV config (the F1 production override), so these
 * caps are generous headroom for user-entered boards, not a tight leash — exhausting one
 * surfaces a typed `BUDGET_EXCEEDED` error (distinct from provable UNSAT).
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

  // T4-W3 share-truth (twin of useSudoku's): a `?board=` that was PRESENT but failed to decode
  // (the discriminated 'invalid' from resolveInitialState). The composable falls back to a fresh
  // deal below; the board folds a one-line corrupt-link notice into that first fresh-board
  // announce so the bad link doesn't degrade silently. Fixed once at init.
  const linkError = ref(initial.boardLink === "invalid");

  const boardSize = ref(initial.boardSize);
  // T4-WU/U2 — the STAGED board-size, decoupled from the LIVE `boardSize` that drives the
  // board's dimensions. The New-game selector binds to this; `deal()` commits it. Arm-not-live:
  // picking a size no longer wipes the board (the retired `watch(boardSize)` re-deal); only Deal
  // does. Seeded to the live size so the selector reads the current board until the player stages.
  const pendingBoardSize = ref(initial.boardSize);
  // Difficulty axis (T4-W6 GEN-2). T4-WU/U2 closes the W6 residue: difficulty now threads through
  // `?difficulty=`/localStorage (twin of Sudoku's), so a staged tier survives reload instead of
  // resetting to EASY each mount. Still arm-not-live — a change is picked up by the next deal.
  const difficulty = ref<Difficulty>(initial.difficulty);
  const totalCells = computed(() => boardSize.value ** 2);

  // values[position] = number (0 = empty)
  const values = ref<Record<string, number>>({});
  const givenCells = ref<Set<string>>(new Set());
  const originalGivenCells = ref<Set<string>>(new Set());
  const overriddenCells = ref<Set<string>>(new Set());
  // Printed inequality furniture — [greater, lesser] pairs. NEVER in the given/overridden
  // bookkeeping (they aren't cell values); they ride along the board and feed the carets.
  const inequalities = ref<Inequality[]>([]);
  const animatingCells = ref<Set<string>>(new Set());
  const solveState = ref<SolveState>("idle");
  const solvedValues = ref<Record<string, number>>({});
  // Stats from the last completed solve (W6 stat-line). Set only by solve() —
  // the peek path never touches it. Cleared wherever the grade reverts to idle.
  const solveStats = ref<SolveStats | null>(null);
  const loading = ref(false);
  const errorMessage = ref("");
  const errorCode = ref("");
  const boardGeneration = ref(0);

  // ── The honest grade (T4-W7) — twin of useSudoku's: the hardest technique the engine
  // needed to solve the DEALT board IS its difficulty. Held on the game state (W9-B1 reads
  // `hardestTechnique`; the margin signature reads `gradeSignature`). Futoshiki has no
  // difficulty request voice, so the signature is the first difficulty word its margin gets.
  const hardestTechnique = ref<TechniqueId | null>(null);
  const gradeSolved = ref(false);
  // T4-W9-B1 — the honesty gate (twin of useSudoku's): `graded` is true ONLY after the engine
  // has run on a dealt board. A restored permalink never trips it, so the tally shows the
  // dashed placeholder, never a fabricated tier (ROW 5).
  const graded = ref(false);
  const gradeSignature = computed(() =>
    formatGradeSignature(hardestTechnique.value, gradeSolved.value),
  );
  // The displayed-quality tally descriptor (W9-B1) — fully derived here; DifficultyTally renders.
  const gradeTally = computed(() =>
    describeTally(graded.value, hardestTechnique.value, gradeSolved.value),
  );

  // ── The named hint (T4-W7) — twin of useSudoku's two-press act: the first press names the
  // cheapest human deduction and arms the reasoning; the second inks the digit through the
  // existing reveal draw-in. Null between transactions; any board mutation disarms it.
  const hintReasoning = ref<HintResult | null>(null);

  // The history spine (T4-WU / E9) — one tagged log + content-hash board pool (D16 twin of
  // useSudoku's). The effects are arrow wrappers so the call is hoisting-safe: every primitive
  // is declared below. `pending` refuses undo/redo while a board op is in flight (the race gate).
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

  // T4-WU/U3 — the conditional-confirm dirty gate (twin of useSudoku's). `isDirty` = undo-depth
  // non-empty (E9 crit #8, spec ROW 3): ONE derived signal off U1's spine, no parallel bool to
  // desynchronize. A pristine board reads 0 — the mount deal is off-log, a size-changing Deal + a
  // permalink restore clear the log — so Deal + Clear act instantly there (no nag by construction);
  // any recorded value / mark / board-swap lifts it, arming the coarse two-tap on Deal and Clear.
  const isDirty = computed(() => undoDepth.value > 0);

  function initBoard() {
    values.value = {};
    givenCells.value = new Set();
    originalGivenCells.value = new Set();
    overriddenCells.value = new Set();
    inequalities.value = [];
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

  // T4-W7 — the measured grade + any armed hint belong to the DEALT board; a blank or reset
  // board carries neither. Twin of useSudoku's.
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
    // Inequalities are permanent furniture — a "clear" blanks the cells but leaves the
    // printed constraints, so the board stays a solvable Futoshiki puzzle.
    animatingCells.value = new Set();
    // `clearUndo` DIES (T4-WU): a clear is now one undoable `board` entry — undo restores the
    // board AND its marks; the generation bump voids the live notes, the pool carries `prevMarks`.
    boardGeneration.value++;
    clearPersistedBoard();
    dropBoardParam(); // the shared configuration is stale once the cells are blanked
    recordBoard(prevBlob, snapshotBoard(), prevMarks, EMPTY_MARKS, "clear");
  }

  // The cell-write primitive, shared by user edits and undo/redo replay. Given-cell
  // immunity is structural: a pristine given is never a recorded edit target (editing one
  // overrides it first), so undo/redo never writes into a live given.
  function applyCellValue(pos: number, value: number) {
    const key = String(pos);
    if (originalGivenCells.value.has(key)) {
      givenCells.value.delete(key);
      overriddenCells.value.add(key);
    }
    if (key in solvedValues.value) {
      const { [key]: _, ...rest } = solvedValues.value;
      solvedValues.value = rest;
      overriddenCells.value.add(key);
    }
    values.value[key] = value;
    hintReasoning.value = null; // T4-W7 — an edit disarms a stale armed hint
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

  // A fresh/blank board carries no marks — the constant `nextMarks` for a deal/clear/resize
  // board entry (all void the notes going forward). Deduped to one pool slot.
  const EMPTY_MARKS: MarksBlob = { corner: {}, center: {} };

  // Snapshot the whole puzzle state (values + the inequality furniture) into a pool blob
  // (T4-WU). Sets flatten to sorted arrays for a canonical content hash.
  function snapshotBoard(): BoardBlob {
    return {
      values: { ...values.value },
      given: Array.from(givenCells.value).sort(),
      origGiven: Array.from(originalGivenCells.value).sort(),
      overridden: Array.from(overriddenCells.value).sort(),
      solved: { ...solvedValues.value },
      inequalities: inequalities.value.map(([a, b]) => [a, b] as [number, number]),
    };
  }

  // Redo of hint ink — write the digit in the solver's own tone (no record); the reveal
  // draw-in path, factored so `inkReveal` and the undo-replay share it.
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

  // Undo of hint ink (T4-WU) — write `prev` and STRIP the `solvedValues` membership, so the
  // reveal leaves no solver-tone residue and the flourish gate is re-armed.
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
      const board = await api.getRandomBoard(boardSize.value, difficulty.value);
      // Push-after-resolve, drop-on-mismatch (T4-WU): a superseded/stale deal applies nothing
      // and records nothing — no orphan entry can disagree with the board. Latest-wins.
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

      inequalities.value = board.inequalities;
      originalGivenCells.value = new Set(givenCells.value);
      animatingCells.value = new Set(givenCells.value);
      // T4-W7 — grade the DEALT board synchronously (twin of useSudoku's): the hardest
      // technique the ladder needed — singles, inequality-forcing, or chains — IS the honest
      // difficulty, over self-computed candidates, never the AC-pruned masks.
      const gradeResult = gradeFutoshiki(
        values.value,
        boardSize.value,
        inequalities.value,
      );
      hardestTechnique.value = gradeResult.hardestTechnique;
      gradeSolved.value = gradeResult.solved;
      graded.value = true; // W9-B1 — the engine ran on a dealt board; the tally is defensible
      hintReasoning.value = null; // a fresh deal voids any armed hint
      dropBoardParam(); // a freshly-dealt board voids the shared permalink
      // T4-WU: `clearUndo` DIES — the deal APPENDS a board entry (undo restores the prior
      // board + its marks). The generation bump (futoshiki already did this) voids the live
      // notes via the void-watch and invalidates the peek cache — now also the stale-drop epoch.
      boardGeneration.value++;
      if (opts?.record !== false) {
        recordBoard(prevBlob, snapshotBoard(), prevMarks, EMPTY_MARKS, "deal");
      }
      queueSave();
    } catch (e) {
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

  // T4-WU/U2 — the Deal commit. The re-homed dice (lifted out of the live action row into the
  // New-game staged zone) commits the staged size + difficulty as ONE act. A SAME-size Deal
  // records one undoable board entry (size-undo falls out of the Deal button — U1's deferral
  // closes here). A size-CHANGING Deal resets to the new dimensions and deals off-log: the board
  // blob carries no size, so a cross-size undo can't restore honestly, so a size commit is a
  // clean-reset deal — exactly what the retired `watch(boardSize)` did, now behind the guarded
  // button instead of a bare, unguarded chip tap (the loudest live hazard, staged away).
  async function deal() {
    if (pendingBoardSize.value !== boardSize.value) {
      boardSize.value = pendingBoardSize.value;
      clearPersistedBoard();
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
      const result = await api.solveBoard(
        values.value,
        boardSize.value,
        inequalities.value,
        nodeBudgetForSize(boardSize.value),
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
      solveState.value = result.solved ? "solved" : "failed";
      solveStats.value = {
        backtracks: result.backtracks,
        nodesExplored: result.nodesExplored,
        propagations: result.propagations,
        solutionCount: result.solutionCount,
        elapsedMs: result.elapsedMs,
      };
      animatingCells.value = cellsToAnimate;
      // T4-WU — a solve that FILLED cells is one undoable `board` entry. Solve mutates in place
      // (givens + inequalities stay), so it does NOT bump the generation: marks survive under
      // the filled cells and the celebration crest is untouched. A no-fill solve records nothing.
      if (cellsToAnimate.size > 0) {
        recordBoard(prevBlob, snapshotBoard(), prevMarks, snapshotMarks(), "solve");
      }
      queueSave();
    } catch (e) {
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

  // ── Answer-key peek: solve the PRISTINE givens + inequalities, cache per generation ──
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
    const result = await api.solveBoard(
      givensOnly,
      boardSize.value,
      inequalities.value,
      nodeBudgetForSize(boardSize.value),
    );
    peekCache.value = { gen: boardGeneration.value, values: { ...result.values } };
    return peekCache.value.values;
  }

  // Ink a revealed digit through the EXISTING reveal path (twin of useSudoku's, D16): added to
  // solvedValues (solver-ink tone), routed through animatingCells (350ms draw-in). T4-WU: hint
  // ink NOW enters history as a `value` entry with `tone:'solved'` — undoing strips the
  // solver-tone membership (`removeHintInk`) and re-arms the flourish gate (owner-taste, B5).
  function inkReveal(pos: number, val: number) {
    const key = String(pos);
    if (val === 0 || values.value[key] === val) return;
    const prev = values.value[key] ?? 0;
    applyHintInk(pos, val);
    recordHintInk(pos, prev, val);
  }

  // ── Fill-all-forced (T4-W8 — the partial-solve button; W7 owns the detector; twin of
  // useSudoku's) ──────────────────────────────────────────────────────────────────────────
  // Apply every naked+hidden single present on the board in ONE sweep, inking each through the
  // EXISTING reveal draw-in — `solvedValues` (solver-ink tone) + `animatingCells` (the board-
  // normalized reveal wave) — the same bulk path `solve()` uses, zero new timing constants.
  // Sourced from the W7 technique engine (self-computed candidates + the inequality furniture),
  // NOT the wasm solver: synchronous, no worker, no loading/solve state — so the epoch/race
  // machinery the async recorders need does not apply (nothing awaits; the sweep is atomic over
  // the local board). T4-WU: the sweep now enters history as ONE `{kind:'batch'}` entry — one
  // gesture, one undo/redo — recorded AFTER it resolves (single-writer, push-after-resolve). Each
  // placement rides the solver tone the fill applies, so undo strips the `solvedValues`
  // membership exactly as the hint-ink path does. A sweep that forces nothing (Δ0) records NOTHING.
  function fillForced() {
    const { placements } = fillForcedFutoshiki(
      values.value,
      boardSize.value,
      inequalities.value,
    );
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

  // ── The named hint (T4-W7) — reasoning first, digit second (twin of useSudoku's) ────
  // First press: name the cheapest single that PLACES a digit (naked/hidden — the inequality
  // rungs prune candidates, they don't place, so they grade but never surface as the placement
  // hint) and arm its reasoning; the board highlights the `becauseCells` and writes the name in
  // the margin. Second press: ink the digit. No nameable single → the answer-key reveal.
  async function hintCell(pos: number) {
    if (hintReasoning.value) {
      const h = hintReasoning.value;
      hintReasoning.value = null;
      inkReveal(h.cell, h.value);
      return;
    }
    const key = String(pos);
    const preferred = originalGivenCells.value.has(key) ? undefined : pos;
    const step = hintFutoshiki(
      values.value,
      boardSize.value,
      inequalities.value,
      preferred,
    );
    if (step) {
      hintReasoning.value = step;
      return;
    }
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

  // Engine-domains pencil marks (W6 beat 9 — the shared marks machine; D16 twin).
  // FutoshikiGame mirrors `peekActive` into `setMarksActive`; the propagate thunk
  // closes over the live solver + board state (values, boardSize, inequalities).
  const { marksActive, refreshMarks, setMarksActive, pencilMarks } = usePencilMarks(
    () => api.propagateBoard(values.value, boardSize.value, inequalities.value),
    values,
    boardSize,
    totalCells,
  );

  // User pencil marks (T4-W8 ROW 1 — the player's own notes; D16 twin of useSudoku's). A
  // SEPARATE store from the engine marks above: the peek marks are the solver's domains, these
  // are the player's authored candidates. `boardGeneration` voids the notes on
  // clear/randomize/size-swap; the mode survives. Corner vs center (Snyder) is one store, two
  // slots.
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

  // Snapshot the user pencil marks into a pool blob (T4-WU) — the notes annotating the current
  // board, so a `board` entry travels them alongside the board it restores.
  function snapshotMarks(): MarksBlob {
    return {
      corner: { ...cornerMarks.value },
      center: { ...centerMarks.value },
    };
  }

  // The board-undo/redo replay (T4-WU) — the restore-order edge (twin of useSudoku's). Raise
  // `restoring` so the marks void-watch no-ops on the generation bump, re-hydrate the board
  // (values + inequalities) AND its marks, then lower the flag next tick.
  function restoreBoardState(board: BoardBlob, marks: MarksBlob) {
    restoring.value = true;
    values.value = { ...board.values };
    givenCells.value = new Set(board.given);
    originalGivenCells.value = new Set(board.origGiven);
    overriddenCells.value = new Set(board.overridden);
    solvedValues.value = { ...board.solved };
    inequalities.value = board.inequalities.map(([a, b]) => [a, b] as Inequality);
    animatingCells.value = new Set();
    solveState.value = "idle";
    solveStats.value = null;
    errorMessage.value = "";
    errorCode.value = "";
    clearGrade(); // a restored board carries no live measured grade
    peekCache.value = null; // the cached answer key is stale for the restored board
    boardGeneration.value++; // board replaced — bump the epoch (void-watch suppressed here)
    setUserMarks(marks.corner, marks.center);
    queueSave();
    void nextTick(() => {
      restoring.value = false;
    });
  }

  // The tracked user-mark author (T4-WU) — wraps the raw toggle so every note gesture enters
  // history as ONE `mark` entry. A digit toggles the active slot; an erase (`value===0`) hits
  // both slots, so both slot deltas ride the single entry (one gesture, one undo).
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

  // Board assists (T4-W8 ROW 2 + ROW 3 — twin of useSudoku's). ROW 2: the error-check MODE over
  // the SAME pure `findConflicts`; `proactiveCheck` is the board's display gate ORed with 'failed'.
  // ROW 3: `candidatesPinned` holds the engine marks on persistently; the game reconciles it
  // against the peek in `FutoshikiGame`.
  const {
    errorCheckMode,
    proactiveCheck,
    setErrorCheckMode,
    candidatesPinned,
    setCandidatesPinned,
  } = useAssists(values);

  // ── Restore from persisted state (no animation) ──────────────────
  function restoreBoard(persisted: PersistedBoard) {
    values.value = { ...persisted.values };
    givenCells.value = new Set(persisted.givenCells);
    originalGivenCells.value = new Set(persisted.originalGivenCells);
    overriddenCells.value = new Set(persisted.overriddenCells);
    inequalities.value = persisted.inequalities.map(([a, b]) => [a, b] as Inequality);
    solvedValues.value = { ...persisted.solvedValues };
    boardGeneration.value = persisted.boardGeneration;
    animatingCells.value = new Set();
    solveState.value = "idle";
    solveStats.value = null;
    errorMessage.value = "";
    errorCode.value = "";
    clearGrade(); // a restored board carries no measured grade
    clearUndo();
  }

  function saveBoardState() {
    persistBoard({
      boardSize: boardSize.value,
      difficulty: difficulty.value,
      values: values.value,
      givenCells: Array.from(givenCells.value),
      originalGivenCells: Array.from(originalGivenCells.value),
      overriddenCells: Array.from(overriddenCells.value),
      inequalities: inequalities.value,
      solvedValues: solvedValues.value,
      boardGeneration: boardGeneration.value,
    });
  }

  // ── Share-on-demand permalink (W6; T4-W3 share-truth) ────────────
  // The explicit share act: encode the current board (values + inequality furniture) into
  // `?board=`, write it to the address bar (so a reload reproduces it — URL wins over storage),
  // then COPY the full href. The replaceState already landed, so the shared link is live in the
  // bar regardless of the copy's fate. Returns the clipboard promise so the caller confirms ONLY
  // on a real resolve; an absent Clipboard API (insecure context) REJECTS rather than silently
  // "succeeding". Twin of useSudoku's. The ONLY writer of `?board=`.
  function shareBoard(): Promise<void> {
    writeBoardToUrl(
      encodeBoard(boardSize.value, values.value, totalCells.value, inequalities.value),
    );
    if (!navigator.clipboard) {
      return Promise.reject(new Error("Clipboard API unavailable"));
    }
    return navigator.clipboard.writeText(window.location.href);
  }

  // ── Initialization ───────────────────────────────────────────────
  syncToUrl(boardSize.value, difficulty.value);

  const canRestore =
    (initial.source === "url+storage" ||
      initial.source === "storage-only" ||
      initial.source === "url-board") &&
    initial.persisted != null &&
    Object.values(initial.persisted.values).some((v) => v !== 0);

  if (canRestore) {
    restoreBoard(initial.persisted!);
  } else {
    if (initial.persisted) clearPersistedBoard();
    initBoard();
    randomize({ record: false }); // fire-and-forget mount deal — not a user gesture, off-log
  }

  // ── Watchers ─────────────────────────────────────────────────────
  // T4-WU/U2 — size is now ARM-NOT-LIVE: the live re-deal `watch(boardSize)` is RETIRED. Picking a
  // size stages `pendingBoardSize`; only `deal()` commits it. This watch is URL-sync ONLY (the twin
  // of sudoku's `watch([size, difficulty])`) — a size or difficulty change writes `?board_size=` +
  // `?difficulty=` but never wipes the board. `boardSize` changes only at a Deal commit; difficulty
  // changes on selection (both non-destructive), so the URL tracks the staged pair honestly.
  watch([boardSize, difficulty], () => {
    syncToUrl(boardSize.value, difficulty.value);
  });

  // Engine-domains pencil marks: while the peek gesture is held, any cell
  // mutation or board swap re-propagates (K-peek is a toggle, so the page can
  // still be written on with the marks up). `values` is mutated in place at
  // `setCell`, so the deep watch is load-bearing; `boardGeneration` covers
  // clear/randomize/size swaps. Inert (one boolean test) while marks are off.
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
    boardSize,
    pendingBoardSize,
    difficulty,
    totalCells,
    values,
    givenCells,
    originalGivenCells,
    overriddenCells,
    inequalities,
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

import { computed, ref, watch } from "vue";
// The solve/generate path is the in-browser wasm Worker (`useSolver`), the
// only shipped solve surface. Zero `/api/v1/*` dependency — no fetch, no
// `/config` handshake, no server to depend on. The off-main-thread Worker
// structurally retires the GIL/DoS class for the served sizes.
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
import { useUndoHistory } from "../../shared/useUndoHistory";
import { usePencilMarks } from "../../shared/usePencilMarks";
import { useUserMarks } from "../../shared/useUserMarks";
import { useAssists } from "../../shared/useAssists";
import {
  gradeSudoku,
  hintSudoku,
  fillForcedSudoku,
} from "../technique/sudokuTechnique";
import { formatGradeSignature, describeTally } from "@games/shared/techniqueVoice";
import type { HintResult, TechniqueId } from "@games/shared/techniqueEngine";
import type { Difficulty, SolveState, SolveStats } from "../types";

/**
 * Size-scaled node budget for the client solve — the user-facing cap on
 * search effort, keyed to sub-grid size. The worker's wasm default is
 * 1,000,000 nodes; larger boards legitimately explore more, so the cap
 * scales up with `n`: generous enough that every served template solves,
 * finite enough to structurally retire the unbounded-search DoS class
 * outright — there is no server timeout to lean on, and none is needed.
 * Exhausting it surfaces a typed
 * `BUDGET_EXCEEDED` error (distinct from provable UNSAT) — see `solve()`.
 */
const NODE_BUDGET_BY_SIZE: Record<number, number> = {
  2: 200_000,
  3: 2_000_000,
  4: 50_000_000,
};
function nodeBudgetForSize(n: number): number {
  return NODE_BUDGET_BY_SIZE[n] ?? 1_000_000;
}

export function useSudoku() {
  const api = useSolver();

  const initial = resolveInitialState();

  // T4-W3 share-truth: a `?board=` that was PRESENT but failed to decode (the discriminated
  // 'invalid' from resolveInitialState — never conflated with 'absent'). The composable falls
  // back to a fresh deal below; the board folds a one-line corrupt-link notice into that first
  // fresh-board announce so the bad link doesn't degrade silently. Fixed once at init.
  const linkError = ref(initial.boardLink === "invalid");

  const size = ref(initial.size);
  const difficulty = ref<Difficulty>(initial.difficulty);
  const boardSize = computed(() => size.value ** 2);
  const totalCells = computed(() => boardSize.value ** 2);

  // values[position] = number (0 = empty)
  const values = ref<Record<string, number>>({});
  const givenCells = ref<Set<string>>(new Set());
  const originalGivenCells = ref<Set<string>>(new Set());
  const overriddenCells = ref<Set<string>>(new Set());
  const animatingCells = ref<Set<string>>(new Set());
  const solveState = ref<SolveState>("idle");
  const solvedValues = ref<Record<string, number>>({});
  // Stats from the last completed solve (W6 stat-line). Set only by solve() —
  // the peek path never touches it. Cleared wherever the grade reverts to idle.
  const solveStats = ref<SolveStats | null>(null);
  const loading = ref(false);
  const errorMessage = ref("");
  // The typed error code (SolverErrorCode) behind the paper note,
  // consumed by SudokuBoard for the §5.2 copy split. Kept coherent with errorMessage.
  const errorCode = ref("");
  const boardGeneration = ref(0);

  // ── The honest grade (T4-W7) — the hardest technique the engine needed to solve the DEALT
  // board IS its difficulty (arXiv 1403.7373). Held on the game state: W9-B1 reads
  // `hardestTechnique` for the tally; the board's margin signature reads `gradeSignature`,
  // which replaces W6's opaque bucket ("you asked for medium") once a board is graded. Set at
  // deal (randomize); null on clear/init/restore (an ungraded board keeps W6's request voice).
  const hardestTechnique = ref<TechniqueId | null>(null);
  const gradeSolved = ref(false);
  // T4-W9-B1 — the honesty gate: `graded` is true ONLY after the engine has run on a dealt,
  // supported board. A restored permalink or a hand-typed board never trips it, so the tally
  // shows the dashed placeholder rather than a fabricated tier (ROW 5). Distinct from
  // `hardestTechnique === null`, which a genuinely hard board (no basic step available first)
  // also reads — that board IS graded, just past the ladder's naming.
  const graded = ref(false);
  const gradeSignature = computed(() =>
    formatGradeSignature(hardestTechnique.value, gradeSolved.value),
  );
  // The displayed-quality tally descriptor (W9-B1) — the glyph twin of the signature, fully
  // derived here (the DifficultyTally component is a pure renderer of it).
  const gradeTally = computed(() =>
    describeTally(graded.value, hardestTechnique.value, gradeSolved.value),
  );

  // ── The named hint (T4-W7) — two presses: the first names the cheapest human deduction and
  // arms the reasoning (becauseCells to highlight + the value to ink); the second inks the
  // digit through the existing reveal draw-in. Null between transactions. Any board mutation
  // disarms it (a hint the board changed under is stale). The answer-reveal-with-no-name (the
  // W6 one-press reveal) is retired — a hint says WHY before it shows WHAT.
  const hintReasoning = ref<HintResult | null>(null);

  // Bounded undo/redo (W6) — the shared {pos,prev,next}[] history machine. The arrow
  // wrapper keeps the call hoisting-safe: `applyCellValue` is declared below.
  const { clearUndo, recordEdit, undo, redo } = useUndoHistory((pos, value) =>
    applyCellValue(pos, value),
  );

  function initBoard() {
    values.value = {};
    givenCells.value = new Set();
    originalGivenCells.value = new Set();
    overriddenCells.value = new Set();
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
    clearUndo();
    boardGeneration.value++;
    clearPersistedBoard();
    dropBoardParam(); // the shared configuration is stale once the board is blanked
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
    // If overriding a solver-introduced cell, remove only THIS cell from solvedValues
    // (other solved cells keep their sparkle-rainbow styling)
    if (key in solvedValues.value) {
      const { [key]: _, ...rest } = solvedValues.value;
      solvedValues.value = rest;
      overriddenCells.value.add(key);
    }
    values.value[key] = value;
    hintReasoning.value = null; // T4-W7 — an edit disarms a stale armed hint
    // Revert solve state so the board no longer shows success/failure
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

  async function randomize() {
    loading.value = true;
    errorMessage.value = "";
    errorCode.value = "";
    solveState.value = "idle";
    solvedValues.value = {};
    solveStats.value = null;

    try {
      const board = await api.getRandomBoard(size.value, difficulty.value);
      values.value = {};
      givenCells.value = new Set();
      originalGivenCells.value = new Set();
      overriddenCells.value = new Set();

      for (const [pos, val] of Object.entries(board.values)) {
        values.value[pos] = val;
        if (val !== 0) {
          givenCells.value.add(pos);
        }
      }

      originalGivenCells.value = new Set(givenCells.value);
      animatingCells.value = new Set(givenCells.value);
      // T4-W7 — grade the DEALT board synchronously: the hardest technique the R1–R3 ladder
      // needed to solve it IS its honest difficulty. Pure TS over self-computed candidates
      // (never the GAC masks); bounded, no search. Feeds the margin signature + W9-B1's tally.
      const gradeResult = gradeSudoku(values.value, size.value);
      hardestTechnique.value = gradeResult.hardestTechnique;
      gradeSolved.value = gradeResult.solved;
      graded.value = true; // W9-B1 — the engine ran on a dealt board; the tally is defensible
      hintReasoning.value = null; // a fresh deal voids any armed hint
      clearUndo(); // a fresh board voids the prior board's history
      dropBoardParam(); // a freshly-dealt board voids the shared permalink
      queueSave();
    } catch (e) {
      // A generate failure was fully silent before — route it through the shared
      // fiction classifier and surface it (paper note for machinery faults).
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

  async function solve() {
    loading.value = true;
    solveState.value = "solving";
    solveStats.value = null; // never show a previous solve's numbers mid-solve
    errorMessage.value = "";
    errorCode.value = "";

    try {
      const result = await api.solveBoard(
        values.value,
        size.value,
        nodeBudgetForSize(size.value),
      );
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
      // solved=false means the solver *proved* no completion exists for the
      // user-entered cells (provable UNSAT) — distinct from the budget case below.
      solveState.value = result.solved ? "solved" : "failed";
      solveStats.value = {
        backtracks: result.backtracks,
        nodesExplored: result.nodesExplored,
        propagations: result.propagations,
        solutionCount: result.solutionCount,
        elapsedMs: result.elapsedMs,
      };
      animatingCells.value = cellsToAnimate;
      queueSave();
    } catch (e) {
      // Route by the shared fiction classifier (games/shared/solver/classifyError): provable
      // UNSAT / INVALID_INPUT → the teacher's red pencil ('failed'); everything else
      // — BUDGET_EXCEEDED, TIMEOUT, WORKER_FAILURE, a bare network TypeError — → the
      // paper note ('error'). Fixes the Pass-1 F5 corner where WORKER_FAILURE wrongly
      // read as a wrong answer; the two are never conflated on the wire or in the UI.
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
  // Feeds the read-only laminate overlay; NEVER mutates `values`. The W6 Worker
  // solve path makes this API-free (no /board/solve round-trip), and boards derive
  // from solution banks so the pristine givens are always satisfiable.
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
      size.value,
      nodeBudgetForSize(size.value),
    );
    peekCache.value = { gen: boardGeneration.value, values: { ...result.values } };
    return peekCache.value.values;
  }

  // Ink a revealed digit through the EXISTING reveal path (350ms solver-ink draw-in, grain
  // suppressed during the tween, PRM-instant branch) — one grammar, zero new timing constants.
  // Added to solvedValues so it renders in the solver's own tone; NOT recorded on the undo
  // stack (a reveal is not a user edit); the flourish gate stays closed (no gold star).
  function inkReveal(pos: number, val: number) {
    const key = String(pos);
    if (val === 0 || values.value[key] === val) return;
    values.value[key] = val;
    solvedValues.value = { ...solvedValues.value, [key]: val }; // solver-ink tone
    overriddenCells.value.delete(key);
    animatingCells.value = new Set([key]);
    if (solveState.value !== "idle") {
      solveState.value = "idle";
      solveStats.value = null;
    }
    queueSave();
  }

  // ── Fill-all-forced (T4-W8 — the partial-solve button; W7 owns the detector) ──────────
  // Apply every naked+hidden single present on the board in ONE sweep, inking each through the
  // EXISTING reveal draw-in — `solvedValues` (solver-ink tone) + `animatingCells` (the board-
  // normalized reveal wave) — the same bulk path `solve()` uses, zero new timing constants.
  // Sourced from the W7 technique engine (self-computed candidates), NOT the wasm solver:
  // synchronous, no worker, no loading/solve state. Not recorded on the undo stack (a forced
  // fill is app-ink, like a reveal). A sweep that forces nothing is a no-op; a cell that only
  // becomes forced AFTER this sweep is left for the next press (fillAllForced is one sweep by
  // contract — the honest "fill what's forced," distinct from the whole-board solve).
  function fillForced() {
    const { placements } = fillForcedSudoku(values.value, size.value);
    const newlyFilled: Record<string, number> = {};
    const cellsToAnimate = new Set<string>();
    for (const p of placements) {
      const key = String(p.cell);
      if (values.value[key] !== 0) continue; // ink empties only (the detector never targets a filled cell)
      values.value[key] = p.value;
      newlyFilled[key] = p.value;
      overriddenCells.value.delete(key);
      cellsToAnimate.add(key);
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
  }

  // ── The named hint (T4-W7) — reasoning first, digit second ──────────────────────
  // First press: name the cheapest human deduction (naked/hidden single) and arm its
  // reasoning — the board highlights the `becauseCells` in the peek-laminate tone and writes
  // the technique name in the margin. Second press: ink the digit through `inkReveal`. When no
  // single is available (the board needs an elimination first), degrade honestly to the
  // answer-key reveal of the focused cell — named `reveal`, so the two-press shape holds.
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
    const step = hintSudoku(values.value, size.value, preferred);
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

  // Engine-domains pencil marks (W6 beat 9 — the shared marks machine). SudokuGame
  // mirrors `peekActive` into `setMarksActive`; the propagate thunk closes over the
  // live solver + board state.
  const { marksActive, refreshMarks, setMarksActive, pencilMarks } = usePencilMarks(
    () => api.propagateBoard(values.value, size.value),
    values,
    boardSize,
    totalCells,
  );

  // User pencil marks (T4-W8 ROW 1 — the player's own notes). A SEPARATE store from the engine
  // marks above: the peek marks are the solver's domains, these are the player's authored
  // candidates. `boardGeneration` voids the notes on clear/randomize/size-swap; the mode
  // survives. Corner vs center (Snyder) is one store, two slots (D16 twin — futoshiki mounts
  // the identical thing).
  const {
    pencilMode,
    cornerMarks,
    centerMarks,
    setPencilMode,
    cyclePencilMode,
    toggleUserMark,
  } = useUserMarks(boardGeneration);

  // Board assists (T4-W8 ROW 2 + ROW 3 — the player's check settings; D16 twin, both games mount
  // the identical thing). ROW 2: the error-check MODE (off / on-demand / live, default on-demand)
  // over the SAME pure `findConflicts` the board already runs — `proactiveCheck` is the display
  // gate the board ORs with its 'failed' grade. ROW 3: `candidatesPinned` (default off) holds the
  // engine marks on persistently — the game reconciles it against the peek in `SudokuGame`.
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
    persistBoard({
      size: size.value,
      difficulty: difficulty.value,
      values: values.value,
      givenCells: Array.from(givenCells.value),
      originalGivenCells: Array.from(originalGivenCells.value),
      overriddenCells: Array.from(overriddenCells.value),
      solvedValues: solvedValues.value,
      boardGeneration: boardGeneration.value,
    });
  }

  // ── Share-on-demand permalink (W6; T4-W3 share-truth) ────────────
  // The explicit share act: encode the current board into `?board=`, write it to the
  // address bar (so a reload reproduces it — URL wins over storage), then COPY the full
  // href. The replaceState already landed, so the shared link is live in the bar regardless
  // of the copy's fate. Returns the clipboard promise so the caller confirms ONLY on a real
  // resolve; an absent Clipboard API (insecure context) REJECTS rather than silently
  // "succeeding" (the write-side mirror of the corrupt-link signal). The ONLY writer of
  // `?board=`; nothing ambient sets it.
  function shareBoard(): Promise<void> {
    writeBoardToUrl(encodeBoard(size.value, values.value, totalCells.value));
    if (!navigator.clipboard) {
      return Promise.reject(new Error("Clipboard API unavailable"));
    }
    return navigator.clipboard.writeText(window.location.href);
  }

  // ── Initialization ───────────────────────────────────────────────
  syncToUrl(size.value, difficulty.value);

  const canRestore =
    (initial.source === "url+storage" ||
      initial.source === "storage-only" ||
      initial.source === "url-board") &&
    initial.persisted != null &&
    Object.values(initial.persisted.values).some((v) => v !== 0);

  if (canRestore) {
    restoreBoard(initial.persisted!);
  } else {
    // No meaningful persisted state — init empty board then auto-fetch
    if (initial.persisted) clearPersistedBoard();
    initBoard();
    randomize(); // fire-and-forget
  }

  // ── Watchers ─────────────────────────────────────────────────────

  // Sync URL when size or difficulty changes
  watch([size, difficulty], () => {
    syncToUrl(size.value, difficulty.value);
  });

  // Re-init when size changes — old board dimensions invalid
  watch(size, () => {
    clearPersistedBoard();
    initBoard();
    randomize();
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

  // Debounced persistence — called explicitly at mutation points
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  function queueSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveBoardState();
      saveTimer = null;
    }, 300);
  }

  return {
    size,
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
    solve,
    fillForced,
    peekSolution,
    undo,
    redo,
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

/**
 * Frontend rendering of the client Worker's SolverError — one classifier that decides
 * which of the two failure FICTIONS a given failure wears (design-refinement.md §1.4 +
 * §5.2, D3). Single-sourced for both games (T4-W4 solver-seam dedup; the two copies were
 * byte-identical): the fiction split is the SAME contract on both boards, so it lives in
 * the game-agnostic shared floor rather than as twin owned copies.
 *
 *   - teacher-red-pencil — the puzzle was graded and the answer is wrong. The teacher
 *     only grades actual work: a provable UNSAT, or a board whose own given/entered cells
 *     (or inequalities) already conflict (INVALID_INPUT). Rendered ON the board (grid
 *     recolor + shake + conflict marks + marginalia), never as a note card.
 *   - paper-note — the machinery broke, not the answer. Budget exhaustion, a dead worker.
 *     Rendered as a hand-drawn note pinned below the board (role="alert"), never on the grid.
 *
 * This split KILLS the silent-error architecture (Pass-1 F5): before it, a broken worker
 * collapsed into solveState='failed' and told the user their correct answer was wrong.
 *
 * The Worker codes are `games/shared/solver/solverError.ts::SolverErrorCode`; they funnel
 * through `classifyError` / `classifyCode` so the in-browser Worker solve path renders the
 * two fictions consistently.
 */
import { SolverError } from "./solverError";

// ── the fiction split ────────────────────────────────────────────────────────

// Only the three variants the in-browser Worker can actually produce survive: the
// server taxonomy (timeout/rate-limited/not-found/server) is unreachable on the
// Worker path (SolverErrorCode = INVALID_INPUT | BUDGET_EXCEEDED | UNSAT |
// WORKER_FAILURE), so those rows were pruned as dead (K1b).
export type PaperNoteVariant = "budget" | "network" | "unknown";

export type Fiction =
  | { kind: "teacher-red" }
  | {
      kind: "paper-note";
      variant: PaperNoteVariant;
      message: string;
      retryable: boolean;
    };

/**
 * The page's own handwriting for each broken-machinery variant (§5.2). Honest and
 * plain — the storybook dressing is the paper, not purple copy.
 */
export const PAPER_NOTE_COPY: Record<PaperNoteVariant, string> = {
  budget: "this one's a real head-scratcher — the solver gave up.",
  network: "couldn't reach the solver.",
  unknown: "something went sideways. try again?",
};

/** Codes graded as wrong work — the teacher's red pencil, on the board (never a card). */
const TEACHER_RED_CODES = new Set(["UNSAT", "INVALID_INPUT"]);

const PAPER_NOTE_VARIANT: Record<string, PaperNoteVariant> = {
  BUDGET_EXCEEDED: "budget",
  WORKER_FAILURE: "network", // a dead Worker is the Option-C analogue of an unreachable origin
};

/** Classify a bare typed-error `code` string into its fiction. */
export function classifyCode(code: string | undefined, retryable = true): Fiction {
  if (code && TEACHER_RED_CODES.has(code)) return { kind: "teacher-red" };
  const variant: PaperNoteVariant =
    (code ? PAPER_NOTE_VARIANT[code] : undefined) ?? "unknown";
  return { kind: "paper-note", variant, message: PAPER_NOTE_COPY[variant], retryable };
}

/**
 * Classify any thrown value — a `SolverError` (Option-C Worker), a `TypeError`
 * (an unexpected runtime fault with no envelope), or anything else — into its
 * fiction.
 */
export function classifyError(e: unknown): Fiction {
  if (e instanceof SolverError)
    return classifyCode(e.code, e.code === "BUDGET_EXCEEDED");
  if (e instanceof TypeError) {
    return {
      kind: "paper-note",
      variant: "network",
      message: PAPER_NOTE_COPY.network,
      retryable: true,
    };
  }
  return {
    kind: "paper-note",
    variant: "unknown",
    message: PAPER_NOTE_COPY.unknown,
    retryable: true,
  };
}

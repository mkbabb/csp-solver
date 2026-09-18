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

// Only the variants the in-browser Worker can actually produce survive: the
// server taxonomy (rate-limited/not-found/server) is unreachable on the
// Worker path (SolverErrorCode = INVALID_INPUT | BUDGET_EXCEEDED | UNSAT |
// WORKER_FAILURE | DEAL_TIMEOUT), so those rows were pruned as dead (K1b).
//
// `deal-timeout` is T9-W4 §4.1's row and the one fault the estate can now NAME instead of
// waiting through: a deal that outran its leash. It is a machinery fault, not wrong work, so
// it wears the paper note; and it is the only variant whose copy tells the reader what to do
// next, because it is the only one where a smaller board is an actual answer.
export type PaperNoteVariant = "budget" | "network" | "deal-timeout" | "unknown";

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
 *
 * T9-W7 · B1b — M16, and the machine stops naming itself HERE too. Two of these sentences
 * said `solver` to a player: the ballot's own scope was two other strings, so B1 left them
 * standing and booked them (exec/B1 §7 gap 5). Each keeps the contract the note is for — it
 * names WHAT broke, in the player's words:
 *
 *   - `budget` is a step budget spent before the board came out. A second press can clear it
 *     (`RETRYABLE_CODES`), and the card draws its own `try again` button beside the sentence
 *     (measured: `GameBoard.vue:904` renders through `classifyCode(code)`, whose `retryable`
 *     defaults to `true`, so every paper note carries that button) — so the sentence says what
 *     broke and lets the button say what to do.
 *   - `network` is the in-browser helper failing: a dead worker, or a fault with no envelope.
 *     It is the one fault of the two a second press does NOT clear, so its sentence carries the
 *     act that does.
 */
export const PAPER_NOTE_COPY: Record<PaperNoteVariant, string> = {
  budget: "this board took too many steps to finish.",
  network: "the board's helper stopped working. reload the page.",
  "deal-timeout": "this deal is taking too long. try again or pick a smaller board.",
  unknown: "something went wrong.",
};

/** Codes graded as wrong work — the teacher's red pencil, on the board (never a card). */
const TEACHER_RED_CODES = new Set(["UNSAT", "INVALID_INPUT"]);

const PAPER_NOTE_VARIANT: Record<string, PaperNoteVariant> = {
  BUDGET_EXCEEDED: "budget",
  WORKER_FAILURE: "network", // a dead Worker is the Option-C analogue of an unreachable origin
  DEAL_TIMEOUT: "deal-timeout",
};

/** The faults a second press can actually clear. A dead worker is not one of them; a deal that
 *  outran its leash is (another seed, or a smaller board, is a different amount of work). */
const RETRYABLE_CODES = new Set(["BUDGET_EXCEEDED", "DEAL_TIMEOUT"]);

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
    return classifyCode(e.code, RETRYABLE_CODES.has(e.code));
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

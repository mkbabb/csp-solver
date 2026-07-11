/**
 * Frontend rendering of the client Worker's SolverError, for Futoshiki — one
 * classifier deciding which of the two failure FICTIONS a given failure wears.
 *
 * Owned copy of games/sudoku/solver/classifyError.ts (games never import each other): the
 * fiction split is the SAME shared contract, but the boundary forbids reaching
 * across, so each game owns its renderer.
 *
 *   - teacher-red-pencil — the puzzle was graded and the answer is wrong: a provable
 *     UNSAT, or a board whose own cells/inequalities already conflict (INVALID_INPUT).
 *     Rendered ON the board (grid recolor + shake + conflict marks + marginalia).
 *   - paper-note — the machinery broke: budget exhaustion, a dead worker. Rendered as
 *     a hand-drawn note card (role="alert").
 */
import { SolverError } from './solverError'

// ── the fiction split ────────────────────────────────────────────────────────

// Only the three variants the in-browser Worker can actually produce survive: the
// server taxonomy (timeout/rate-limited/not-found/server) is unreachable on the
// Worker path (SolverErrorCode = INVALID_INPUT | BUDGET_EXCEEDED | UNSAT |
// WORKER_FAILURE), so those rows were pruned as dead (K1b).
export type PaperNoteVariant = 'budget' | 'network' | 'unknown'

export type Fiction =
  | { kind: 'teacher-red' }
  | { kind: 'paper-note'; variant: PaperNoteVariant; message: string; retryable: boolean }

/** The page's own handwriting for each broken-machinery variant. Honest and plain. */
export const PAPER_NOTE_COPY: Record<PaperNoteVariant, string> = {
  budget: "this one's a real head-scratcher — the solver gave up.",
  network: "couldn't reach the solver.",
  unknown: 'something went sideways. try again?',
}

/** Codes graded as wrong work — the teacher's red pencil, on the board (never a card). */
const TEACHER_RED_CODES = new Set(['UNSAT', 'INVALID_INPUT'])

const PAPER_NOTE_VARIANT: Record<string, PaperNoteVariant> = {
  BUDGET_EXCEEDED: 'budget',
  WORKER_FAILURE: 'network', // a dead Worker is the Option-C analogue of an unreachable origin
}

/** Classify a bare typed-error `code` string into its fiction. */
export function classifyCode(code: string | undefined, retryable = true): Fiction {
  if (code && TEACHER_RED_CODES.has(code)) return { kind: 'teacher-red' }
  const variant: PaperNoteVariant = (code ? PAPER_NOTE_VARIANT[code] : undefined) ?? 'unknown'
  return { kind: 'paper-note', variant, message: PAPER_NOTE_COPY[variant], retryable }
}

/**
 * Classify any thrown value — a `SolverError`, a `TypeError`, or anything else —
 * into its fiction.
 */
export function classifyError(e: unknown): Fiction {
  if (e instanceof SolverError) return classifyCode(e.code, e.code === 'BUDGET_EXCEEDED')
  if (e instanceof TypeError) {
    return { kind: 'paper-note', variant: 'network', message: PAPER_NOTE_COPY.network, retryable: true }
  }
  return { kind: 'paper-note', variant: 'unknown', message: PAPER_NOTE_COPY.unknown, retryable: true }
}

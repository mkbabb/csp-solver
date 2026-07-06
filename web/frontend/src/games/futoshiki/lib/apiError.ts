/**
 * Frontend rendering of the W4 typed error taxonomy AND the client Worker's
 * SolverError, for Futoshiki — one classifier deciding which of the two failure
 * FICTIONS a given failure wears.
 *
 * Owned copy of games/sudoku/lib/apiError.ts (games never import each other): the
 * taxonomy, the seven codes, and the fiction split are the SAME shared contract —
 * the backend envelope (`web/api/src/app/core/errors.py`) is identical for both
 * games — but the boundary forbids reaching across, so each game owns its renderer.
 *
 *   - teacher-red-pencil — the puzzle was graded and the answer is wrong: a provable
 *     UNSAT, or a board whose own cells/inequalities already conflict (INVALID_INPUT).
 *     Rendered ON the board (grid recolor + shake + conflict marks + marginalia).
 *   - paper-note — the machinery broke: budget/timeout, rate-limit, a dead worker, an
 *     unreachable origin, a 5xx. Rendered as a hand-drawn note card (role="alert").
 */
import { SolverError } from './solverError'

/** The seven codes the backend envelope can carry (core/errors.py::ApiErrorCode). */
export type ApiErrorCode =
  | 'UNSATISFIABLE'
  | 'BUDGET_EXCEEDED'
  | 'INVALID_INPUT'
  | 'TIMEOUT'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INTERNAL'

/** The exact body `core/errors.py::envelope()` emits on every non-2xx response. */
export interface ApiErrorEnvelope {
  error: { code: string; message: string; retryable: boolean }
}

/**
 * A typed failure crossing the `/api/v1/*` boundary. `instanceof Error`,
 * `.code`-bearing — the drop-in replacement for a bare `throw new Error(...)`
 * that erased the code.
 */
export class ApiError extends Error {
  readonly code: string
  readonly retryable: boolean
  readonly status: number | null

  constructor(code: string, message: string, retryable: boolean, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.retryable = retryable
    this.status = status
  }
}

export function isApiErrorEnvelope(v: unknown): v is ApiErrorEnvelope {
  if (typeof v !== 'object' || v === null || !('error' in v)) return false
  const e = (v as { error: unknown }).error
  return (
    typeof e === 'object' &&
    e !== null &&
    typeof (e as { code: unknown }).code === 'string' &&
    typeof (e as { message: unknown }).message === 'string'
  )
}

/**
 * Parse a non-OK `fetch` Response into a typed `ApiError`. Bodies that aren't the
 * shared envelope synthesize an `INTERNAL` carrying the raw text — this never
 * throws, so a caller's `catch` always receives a code-bearing `ApiError`.
 */
export async function apiErrorFromResponse(res: Response): Promise<ApiError> {
  let body: unknown = null
  let text = ''
  try {
    text = await res.text()
    body = text ? JSON.parse(text) : null
  } catch {
    /* non-JSON body — fall through to the synthesized INTERNAL below */
  }
  if (isApiErrorEnvelope(body)) {
    const { code, message, retryable } = body.error
    return new ApiError(code, message, retryable, res.status)
  }
  return new ApiError('INTERNAL', text || `HTTP ${res.status}`, res.status >= 500, res.status)
}

// ── the fiction split ────────────────────────────────────────────────────────

export type PaperNoteVariant =
  | 'budget'
  | 'timeout'
  | 'rate-limited'
  | 'network'
  | 'server'
  | 'not-found'
  | 'unknown'

export type Fiction =
  | { kind: 'teacher-red' }
  | { kind: 'paper-note'; variant: PaperNoteVariant; message: string; retryable: boolean }

/** The page's own handwriting for each broken-machinery variant. Honest and plain. */
export const PAPER_NOTE_COPY: Record<PaperNoteVariant, string> = {
  budget: "this one's a real head-scratcher — the solver gave up.",
  timeout: "this one's a real head-scratcher — the solver gave up at 30 seconds.",
  'rate-limited': 'easy there — too many tries. give it a moment.',
  network: "couldn't reach the solver.",
  server: 'the solver tripped on its own pencil. try again?',
  'not-found': "couldn't find that puzzle.",
  unknown: 'something went sideways. try again?',
}

/** Codes graded as wrong work — the teacher's red pencil, on the board (never a card). */
const TEACHER_RED_CODES = new Set(['UNSATISFIABLE', 'INVALID_INPUT'])

const PAPER_NOTE_VARIANT: Record<string, PaperNoteVariant> = {
  BUDGET_EXCEEDED: 'budget',
  TIMEOUT: 'timeout',
  RATE_LIMITED: 'rate-limited',
  NOT_FOUND: 'not-found',
  INTERNAL: 'server',
  WORKER_FAILURE: 'network', // a dead Worker is the Option-C analogue of an unreachable origin
}

/** Classify a bare typed-error `code` string into its fiction. */
export function classifyCode(code: string | undefined, retryable = true): Fiction {
  if (code && TEACHER_RED_CODES.has(code)) return { kind: 'teacher-red' }
  const variant: PaperNoteVariant = (code ? PAPER_NOTE_VARIANT[code] : undefined) ?? 'unknown'
  return { kind: 'paper-note', variant, message: PAPER_NOTE_COPY[variant], retryable }
}

/**
 * Classify any thrown value — an `ApiError`, a `SolverError`, a `TypeError` from a
 * failed `fetch`, or anything else — into its fiction.
 */
export function classifyError(e: unknown): Fiction {
  if (e instanceof ApiError) return classifyCode(e.code, e.retryable)
  if (e instanceof SolverError) return classifyCode(e.code, e.code === 'BUDGET_EXCEEDED')
  if (e instanceof TypeError) {
    return { kind: 'paper-note', variant: 'network', message: PAPER_NOTE_COPY.network, retryable: true }
  }
  return { kind: 'paper-note', variant: 'unknown', message: PAPER_NOTE_COPY.unknown, retryable: true }
}

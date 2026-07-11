/**
 * Shared game domain-types — the twin `SolveState`/`SolveStats` vocabulary both games
 * duplicated (identical state machine, identical stat payload). Folded to one home per
 * ballot Q3; each game re-exports these from its own `types.ts` so consumers keep their
 * existing `@games/{game}/types` import (zero consumer churn). `Difficulty`/`Inequality`/
 * `BoardSize` stay per-game — they genuinely diverge.
 */

/** Solve lifecycle — the state machine is shared verbatim by both games. */
export type SolveState = 'idle' | 'solving' | 'solved' | 'failed' | 'error'

/** Search stats from the last completed solve — feeds the W6 margin stat-line.
 * The payload was already on the wire (worker `backtracks`/`solutionCount`);
 * `elapsedMs` is the worker-measured wall clock of the wasm call. */
export interface SolveStats {
  backtracks: number
  solutionCount: number
  elapsedMs?: number
}

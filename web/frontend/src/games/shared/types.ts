/**
 * Shared game domain-types — the vocabulary every family in the estate speaks.
 *
 * `SolveState`/`SolveStats` folded here at T3 (ballot Q3), behind a per-game re-export shell
 * that kept consumers untouched. T5-W2 2.3 kills the shells and 2.5 kills the last reason for
 * them: `Difficulty` was declared TWICE with identical bodies and then imported ACROSS games
 * (thermo/killer read sudoku's, kenken read futoshiki's) — five families, one axis, two homes
 * and four boundary violations. One home, imported directly. What genuinely diverges stays in
 * the game that owns it: `Inequality`, `ThermoLine`, `KillerCage`, `KenKenCage`, the size bands.
 */

/** The three tiers every family deals at. Each maps onto its own wasm difficulty ordinal
 *  (0/1/2) at the worker seam; the ladder behind the ordinal is the game's own. */
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

/** Solve lifecycle — the state machine is shared verbatim by both games. */
export type SolveState = "idle" | "solving" | "solved" | "failed" | "error";

/** Search stats from the last completed solve — feeds the W6 margin stat-line.
 * The payload was already on the wire (worker `backtracks`/`solutionCount`);
 * `elapsedMs` is the worker-measured wall clock of the wasm call. */
export interface SolveStats {
  backtracks: number;
  /** Search-tree nodes visited (assignments made) and domain-propagation steps
   * (AC-3/GAC revisions) — machine-effort telemetry twins of `backtracks`, on
   * the wire since T4-W7's free-win wasm getters. Present on the stat-line
   * object; the margin rendering of them is W9's. */
  nodesExplored: number;
  propagations: number;
  solutionCount: number;
  elapsedMs?: number;
}

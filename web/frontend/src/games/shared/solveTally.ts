/**
 * The margin tally, preformatted (T3-W9 §2, f3 §4 NO-duplication) — "128 backtracks — 42ms":
 * search effort in the pencil hand, understated. Both boards used to carry this derivation
 * as byte-identical `statLine` twins; it now lives here and arrives at MarginNote as a
 * preformatted `meta` string (the pencil layer stays derivation-free — same contract as
 * `text`). Present on 'solved' AND 'failed' (a refutation's search effort is honest
 * metadata); the composables null `solveStats` on every other grade, so absence is
 * upstream lifecycle, not this formatter's concern.
 */
import type { SolveStats } from "./types";

export function formatSolveTally(stats: SolveStats | null | undefined): string {
  if (!stats) return "";
  const word = stats.backtracks === 1 ? "backtrack" : "backtracks";
  const time =
    stats.elapsedMs == null
      ? ""
      : stats.elapsedMs < 1000
        ? ` — ${Math.max(1, Math.round(stats.elapsedMs))}ms`
        : ` — ${(stats.elapsedMs / 1000).toFixed(1)}s`;
  return `${stats.backtracks} ${word}${time}`;
}

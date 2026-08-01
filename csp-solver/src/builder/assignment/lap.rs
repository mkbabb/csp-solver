//! The closed-form path: a group-free / pin-free instance is a pure linear
//! assignment problem, solved by the hand-rolled Kuhn-Munkres in O(n³).
//!
//! Split out of the module root at T5-W2. The two solve paths are separate
//! concerns joined only by the dispatch in
//! [`AssignmentBuilder::solve`](super::AssignmentBuilder::solve): this one is
//! integer-quantized, always optimal, and never opens a search; the
//! `branch_and_bound` sibling is the general CSP.

use crate::SolveStats;

use super::{AssignmentBuilder, AssignmentSolution, SENTINEL};

impl AssignmentBuilder {
    /// Closed-form linear-assignment solve (hand-rolled Kuhn-Munkres, see
    /// `crate::builder::kuhn_munkres`) for the group-free / pin-free case. Always
    /// optimal; the returned
    /// [`SolveStats`] is the `Default` (no search ran, `budget_exceeded` is
    /// `false`).
    pub(super) fn solve_lap(self) -> AssignmentSolution {
        let n = self.n_rows;
        let m = self.n_cols;

        // Augmented integer cost matrix, `n` rows × `m + n` columns:
        //   cols 0..m       real per-cell costs
        //   cols m..m+n     one "unmatched" sentinel slot per row, every one
        //                   priced at `unmatch_penalty`. With `n` such slots any
        //                   subset of rows may go unmatched simultaneously and a
        //                   perfect matching of all `n` rows always exists, so
        //                   the LAP result maps cleanly back onto the CSP's
        //                   "sentinel is shareable" semantics.
        //
        // Costs are quantized to i64 (the crate's integer API); the scale keeps
        // six decimal digits, ample for any realistic cost function.
        const SCALE: f64 = 1_000_000.0;
        let width = m + n;
        let pen = (self.unmatch_penalty * SCALE) as i64;
        let mut matrix: Vec<i64> = Vec::with_capacity(n * width);
        for i in 0..n {
            let row_off = i * m;
            for k in 0..m {
                matrix.push((self.cost_matrix[row_off + k] * SCALE) as i64);
            }
            for _ in 0..n {
                matrix.push(pen);
            }
        }

        // Shift to non-negative. Adding a constant to every cell shifts the
        // total by a fixed `n × c` (every row is matched exactly once in an
        // `n × (m+n ≥ n)` assignment), so the argmin — the chosen columns — is
        // unchanged. The hand-rolled Kuhn-Munkres handles negative costs via its
        // potentials, so this is a defensive normalization that also keeps the
        // running potentials small.
        if let Some(&min) = matrix.iter().min()
            && min < 0
        {
            for c in matrix.iter_mut() {
                *c -= min;
            }
        }

        let assignment = crate::builder::kuhn_munkres::minimize(&matrix, n, width);

        // Project back: a real column (< m) is a match at its cost; a sentinel
        // slot (≥ m) — or an unexpected `None` — is the shared unmatched token
        // at the penalty. Cost is recomputed from the original f64 matrix so
        // callers see exact inputs, not the quantized/shifted integers.
        let mut assign: Vec<i32> = vec![SENTINEL; n];
        let mut cost = 0.0;
        for (i, slot) in assign.iter_mut().enumerate() {
            match assignment.get(i).copied().flatten() {
                Some(k) if k < m => {
                    *slot = k as i32;
                    cost += self.cost_matrix[i * m + k];
                }
                _ => {
                    *slot = SENTINEL;
                    cost += self.unmatch_penalty;
                }
            }
        }

        AssignmentSolution {
            assign,
            cost,
            stats: SolveStats::default(),
        }
    }
}

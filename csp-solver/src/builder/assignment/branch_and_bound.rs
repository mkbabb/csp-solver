//! The general path: a grouped or pinned instance carries constraints the LAP
//! cannot express, so it is materialized as a `Csp<CostFiniteDomain>` and
//! driven by branch-and-bound.
//!
//! Split out of the module root at T5-W2. Proven-optimal to roughly n ≈ 15–18;
//! past that the search exhausts its node budget and returns a best-so-far
//! assignment with [`SolveStats::budget_exceeded`](crate::SolveStats::budget_exceeded)
//! set.

use crate::constraint::{AllDifferentExcept, ConstraintEnum};
use crate::domain::CostFiniteDomain;
use crate::{Csp, OptimizationMode, Pruning, SolveConfig};

use super::{AssignmentBuilder, AssignmentError, AssignmentSolution, SENTINEL};

/// Default node budget applied to the branch-and-bound search when the caller
/// does not override it via [`AssignmentBuilder::node_budget`].
const DEFAULT_NODE_BUDGET: u64 = 1_000_000;

impl AssignmentBuilder {
    /// The general branch-and-bound CSP path. Reached from
    /// [`solve`](Self::solve) for grouped/pinned instances and unconditionally
    /// from [`solve_branch_and_bound`](Self::solve_branch_and_bound).
    pub(super) fn solve_csp(self) -> Result<AssignmentSolution, AssignmentError> {
        // 1. Default groups to all-zero if the caller did not supply
        //    them; otherwise verify lengths match the declared
        //    dimensions.
        let row_groups: Vec<u8> = if self.row_groups.is_empty() {
            vec![0; self.n_rows]
        } else if self.row_groups.len() == self.n_rows {
            self.row_groups
        } else {
            return Err(AssignmentError::GroupLengthMismatch);
        };
        let col_groups: Vec<u8> = if self.col_groups.is_empty() {
            vec![0; self.n_cols]
        } else if self.col_groups.len() == self.n_cols {
            self.col_groups
        } else {
            return Err(AssignmentError::GroupLengthMismatch);
        };

        // 2. Pre-validate pins and collapse them into a per-row map.
        //    Pins are baked directly into each row's CostFiniteDomain
        //    at construction time so the variable's `original_domain`
        //    already encodes the singleton; this matters because
        //    `Csp::solve_optimized` calls `Variable::reset()` at
        //    search start and would otherwise undo any post-hoc
        //    domain mutation. Multiple pins on the same row are
        //    accepted only if they agree.
        let mut row_pin: Vec<Option<i32>> = vec![None; self.n_rows];
        for &(row, col) in &self.pins {
            if row >= self.n_rows {
                return Err(AssignmentError::InvalidPin { row, col });
            }
            if col != SENTINEL && (col < 0 || col as usize >= self.n_cols) {
                return Err(AssignmentError::InvalidPin { row, col });
            }
            // Verify pin is compatible with the row's group: SENTINEL
            // is always allowed, otherwise the column's group must
            // match the row's.
            if col != SENTINEL && col_groups[col as usize] != row_groups[row] {
                return Err(AssignmentError::InvalidPin { row, col });
            }
            match row_pin[row] {
                None => row_pin[row] = Some(col),
                Some(prev) if prev == col => {} // duplicate, fine
                Some(_) => return Err(AssignmentError::Infeasible),
            }
        }

        // 3. Build one CostFiniteDomain per row, restricted to columns
        //    whose group matches the row's group (and to the pinned
        //    singleton when a pin is present). SENTINEL is always
        //    available at the unmatch penalty unless overridden by a
        //    non-SENTINEL pin.
        let mut csp: Csp<CostFiniteDomain> = Csp::new();
        let mut row_var_ids: Vec<u32> = Vec::with_capacity(self.n_rows);

        for i in 0..self.n_rows {
            let row_group = row_groups[i];
            let row_offset = i * self.n_cols;

            let mut values: Vec<i32> = Vec::with_capacity(self.n_cols + 1);
            let mut costs: Vec<f64> = Vec::with_capacity(self.n_cols + 1);

            match row_pin[i] {
                Some(SENTINEL) => {
                    values.push(SENTINEL);
                    costs.push(self.unmatch_penalty);
                }
                Some(col) => {
                    // col is guaranteed in 0..n_cols and group-compatible
                    // by the pin validation above.
                    values.push(col);
                    costs.push(self.cost_matrix[row_offset + col as usize]);
                }
                None => {
                    // SENTINEL first; CostFiniteDomain canonicalises to
                    // ascending value order internally so the order at
                    // construction is irrelevant for correctness, but
                    // starting from SENTINEL keeps the (values, costs)
                    // slices easy to read in a debugger.
                    values.push(SENTINEL);
                    costs.push(self.unmatch_penalty);
                    for (k, &cg) in col_groups.iter().enumerate() {
                        if cg == row_group {
                            values.push(k as i32);
                            costs.push(self.cost_matrix[row_offset + k]);
                        }
                    }
                }
            }

            let domain = CostFiniteDomain::new(values, costs);
            row_var_ids.push(csp.add_variable(domain));
        }

        // 4. Add one AllDifferentExcept per distinct row group.
        let mut unique_groups: Vec<u8> = row_groups.clone();
        unique_groups.sort_unstable();
        unique_groups.dedup();
        for group in unique_groups {
            let scope: Vec<u32> = (0..self.n_rows)
                .filter(|&i| row_groups[i] == group)
                .map(|i| row_var_ids[i])
                .collect();
            // A single-row group still benefits from the constraint
            // for symmetry — it's a no-op at search time but keeps
            // the adjacency structure uniform across groups.
            csp.add_constraint_enum(ConstraintEnum::AllDifferentExcept(AllDifferentExcept::new(
                scope, SENTINEL,
            )));
        }

        // 5. Finalize and run branch-and-bound.
        csp.finalize();

        let config = SolveConfig {
            optimization_mode: OptimizationMode::MinimizeCost,
            max_solutions: 1,
            pruning: Pruning::Ac3,
            node_budget: self.node_budget.or(Some(DEFAULT_NODE_BUDGET)),
            ..SolveConfig::default()
        };

        let solutions = csp.solve_optimized(&config);
        let stats = csp.stats().clone();

        let solution = match solutions.into_iter().next() {
            Some(s) => s,
            // No complete assignment came back. Two distinct causes share
            // this branch and must not be conflated: a genuinely infeasible
            // constraint set, versus a search that aborted on its node
            // budget before reaching any leaf. `budget_exceeded` is the
            // discriminator (a partial best-so-far would have returned via
            // the `Some` arm above with the flag set on its stats).
            None if stats.budget_exceeded => return Err(AssignmentError::BudgetExceeded),
            None => return Err(AssignmentError::Infeasible),
        };

        // 6. Project the Solution<CostFiniteDomain> back into the
        //    row-indexed `assign` vector and recompute the total cost
        //    from the cost matrix + unmatch penalty so callers see a
        //    value that matches their inputs exactly (as opposed to
        //    the search's running total, which can drift through
        //    floating-point summation order).
        let mut assign: Vec<i32> = vec![SENTINEL; self.n_rows];
        let mut cost: f64 = 0.0;
        for i in 0..self.n_rows {
            let v = solution[row_var_ids[i] as usize];
            assign[i] = v;
            if v == SENTINEL {
                cost += self.unmatch_penalty;
            } else {
                cost += self.cost_matrix[i * self.n_cols + v as usize];
            }
        }

        Ok(AssignmentSolution {
            assign,
            cost,
            stats,
        })
    }
}

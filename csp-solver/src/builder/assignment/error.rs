//! [`AssignmentError`] — the builder's failure vocabulary.
//!
//! Split out of the module root at T5-W2: a closed taxonomy with its own
//! `Display` prose, read by every caller and touched by neither solve path. It
//! converts into the crate-wide [`CspError`](crate::CspError) through the
//! `From` impl in `src/error.rs`.

/// Errors from [`AssignmentBuilder::solve`](super::AssignmentBuilder::solve).
#[derive(Debug)]
pub enum AssignmentError {
    /// `.rows()` or `.cols()` was not called before `.solve()` (or
    /// either was set to zero).
    DimensionsNotSet,
    /// `.cost()` was not called before `.solve()`.
    CostNotSet,
    /// A custom `row_group` / `col_group` slice did not match the
    /// declared dimensions.
    GroupLengthMismatch,
    /// A pin references an out-of-range row or a column that is
    /// neither [`SENTINEL`](super::SENTINEL) nor a valid `0..n_cols` index, or whose
    /// row-group does not match its target column's group.
    InvalidPin {
        /// Row index supplied to [`AssignmentBuilder::pin`](super::AssignmentBuilder::pin).
        row: usize,
        /// Column index (or [`SENTINEL`](super::SENTINEL)) supplied to
        /// [`AssignmentBuilder::pin`](super::AssignmentBuilder::pin).
        col: i32,
    },
    /// The CSP has no feasible solution under the supplied
    /// constraints. Note that with [`SENTINEL`](super::SENTINEL) always available a
    /// pure assignment problem is always feasible; this variant
    /// surfaces when pins or group constraints are mutually
    /// incompatible.
    Infeasible,
    /// The branch-and-bound search hit its
    /// [`AssignmentBuilder::node_budget`](super::AssignmentBuilder::node_budget) before scoring a single
    /// complete assignment, so there is no best-so-far solution to
    /// return. Distinct from [`Infeasible`](Self::Infeasible): the
    /// problem may well be satisfiable — the search simply ran out of
    /// budget. Retry with a larger (or `None`) `node_budget`. When the
    /// budget is hit *after* at least one complete assignment was
    /// scored, `.solve()` instead returns `Ok` with
    /// [`SolveStats::budget_exceeded`](crate::SolveStats::budget_exceeded) set on the best-so-far solution.
    BudgetExceeded,
}

impl std::fmt::Display for AssignmentError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::DimensionsNotSet => {
                write!(
                    f,
                    "AssignmentBuilder: .rows() and .cols() must both be set to a non-zero value before .solve()"
                )
            }
            Self::CostNotSet => {
                write!(
                    f,
                    "AssignmentBuilder: .cost() must be called before .solve()"
                )
            }
            Self::GroupLengthMismatch => {
                write!(
                    f,
                    "AssignmentBuilder: row_groups / col_groups length does not match the declared dimensions"
                )
            }
            Self::InvalidPin { row, col } => {
                write!(
                    f,
                    "AssignmentBuilder: invalid pin (row={row}, col={col}); col must be SENTINEL or a valid 0..n_cols index sharing the row's group"
                )
            }
            Self::Infeasible => {
                write!(
                    f,
                    "AssignmentBuilder: CSP is infeasible under the supplied constraints"
                )
            }
            Self::BudgetExceeded => {
                write!(
                    f,
                    "AssignmentBuilder: node budget exhausted before any complete assignment was scored; increase node_budget (or pass None) or reduce the problem size"
                )
            }
        }
    }
}

impl std::error::Error for AssignmentError {}

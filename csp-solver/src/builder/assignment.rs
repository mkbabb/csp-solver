//! Bipartite assignment COP builder.
//!
//! Tests: `tests/assignment_builder.rs`, `tests/assignment_proptest.rs`.
//!
//! Fluent API for the common pattern of "assign N source rows to M
//! target columns with per-cell costs, role-based AllDifferent groups,
//! and optional hard pin constraints."
//!
//! # Two solve paths
//!
//! [`AssignmentBuilder::solve`] dispatches on the shape; each path owns a
//! module:
//!
//! * **Group-free / pin-free** instances are a pure linear assignment problem,
//!   solved in closed form by a hand-rolled Kuhn-Munkres
//!   ([`kuhn_munkres`](super::kuhn_munkres)) in O(n³) — microseconds even at
//!   n=200. The `lap` module owns it: always proven-optimal, never
//!   budget-blows.
//! * **Grouped or pinned** instances go through the general CSP, in
//!   `branch_and_bound`: a [`Csp<CostFiniteDomain>`](crate::Csp) with one
//!   variable per row, an
//!   [`AllDifferentExcept`](crate::constraint::AllDifferentExcept) per
//!   row-group, and `-1` as the unmatched sentinel, driven by branch-and-bound
//!   via [`Csp::solve_optimized`](crate::Csp::solve_optimized)
//!   ([`OptimizationMode::MinimizeCost`](crate::OptimizationMode::MinimizeCost)
//!   + [`Pruning::Ac3`](crate::Pruning::Ac3)).
//!
//! The B&B path is only proven-optimal to roughly **n ≈ 15–18**; past that it
//! exhausts its node budget and returns a *best-so-far* assignment with
//! [`SolveStats::budget_exceeded`] set (n=20 budget-blows at ~1 M nodes). The
//! closed-form dispatch exists precisely to keep the common group-free/pin-free
//! shape off that cliff. [`AssignmentBuilder::solve_branch_and_bound`] forces
//! the CSP path regardless of shape (benchmarking / the B&B node-count gate).
//!
//! # Example
//!
//! ```
//! use csp_solver::assignment;
//!
//! let sol = assignment()
//!     .rows(3)
//!     .cols(3)
//!     .cost(|i, k| if i == k { 0.0 } else { 10.0 })
//!     .unmatch_penalty(100.0)
//!     .solve()
//!     .expect("solvable");
//!
//! assert_eq!(sol.assign, vec![0, 1, 2]);
//! assert_eq!(sol.cost, 0.0);
//! ```

mod branch_and_bound;
mod error;
mod lap;

pub use error::AssignmentError;

use crate::SolveStats;

/// Sentinel value used in [`AssignmentSolution::assign`] to denote an
/// unmatched row.
///
/// Encoded as a negative `i32` so it can never collide with a valid
/// 0-indexed column. The internal `CostFiniteDomain` for each row
/// always carries this value as a real domain entry priced at the
/// caller-supplied [`AssignmentBuilder::unmatch_penalty`]; the
/// branch-and-bound search treats it as just another option whose
/// dominance is decided by total cost.
pub const SENTINEL: i32 = -1;

/// Fluent builder for bipartite assignment COPs.
///
/// Construct via [`assignment()`] (preferred) or [`Default::default`].
/// All setters consume `self` and return `self`, allowing chained
/// configuration. The terminal [`AssignmentBuilder::solve`] call
/// validates the configuration, materializes the underlying
/// [`Csp<CostFiniteDomain>`], runs branch-and-bound, and returns an
/// [`AssignmentSolution`] (or an [`AssignmentError`] on
/// mis-configuration / infeasibility).
#[derive(Debug, Default)]
pub struct AssignmentBuilder {
    n_rows: usize,
    n_cols: usize,
    /// Row-major `n_rows × n_cols` matrix of per-cell costs. Populated
    /// eagerly by [`AssignmentBuilder::cost`] so the builder owns no
    /// closure state.
    cost_matrix: Vec<f64>,
    /// Length `n_rows`; defaults to all-zero (single group) if the
    /// caller never invoked [`AssignmentBuilder::row_group`].
    row_groups: Vec<u8>,
    /// Length `n_cols`; defaults to all-zero (single group) if the
    /// caller never invoked [`AssignmentBuilder::col_group`].
    col_groups: Vec<u8>,
    /// Hard `(row, col)` equality pins. Validated against the row's
    /// computed domain at [`AssignmentBuilder::solve`] time.
    pins: Vec<(usize, i32)>,
    /// Per-row cost paid when the assigned column is [`SENTINEL`].
    unmatch_penalty: f64,
    /// Optional cap on branch-and-bound nodes; `None` means use the
    /// crate default of `1_000_000`. See
    /// [`crate::SolveConfig::node_budget`] for the contract.
    node_budget: Option<u64>,
    /// Tracks whether [`AssignmentBuilder::cost`] has been called so
    /// `.solve()` can return [`AssignmentError::CostNotSet`] without
    /// guessing from `cost_matrix.is_empty()`.
    cost_set: bool,
}

/// Result of a successful [`AssignmentBuilder::solve`] call.
#[derive(Debug, Clone)]
pub struct AssignmentSolution {
    /// Length `n_rows`. Each entry is the assigned column index in
    /// `0..n_cols`, or [`SENTINEL`] (`-1`) if the row was left
    /// unmatched.
    pub assign: Vec<i32>,
    /// Total cost of the assignment: the sum of `cost_matrix[i][k]`
    /// for each matched row `i → k`, plus
    /// [`AssignmentBuilder::unmatch_penalty`] for each unmatched row.
    pub cost: f64,
    /// Statistics from the underlying branch-and-bound run. Inspect
    /// [`SolveStats::budget_exceeded`] to distinguish best-so-far
    /// from optimal solutions.
    pub stats: SolveStats,
}

/// Top-level constructor for an empty [`AssignmentBuilder`].
///
/// Equivalent to [`AssignmentBuilder::default`] but reads more
/// naturally at the call site:
///
/// ```
/// use csp_solver::assignment;
///
/// let sol = assignment()
///     .rows(2)
///     .cols(2)
///     .cost(|i, k| (i + k) as f64)
///     .solve()
///     .expect("trivially solvable");
/// assert_eq!(sol.assign.len(), 2);
/// ```
pub fn assignment() -> AssignmentBuilder {
    AssignmentBuilder::default()
}

impl AssignmentBuilder {
    /// Set the number of source rows.
    pub fn rows(mut self, n: usize) -> Self {
        self.n_rows = n;
        self
    }

    /// Set the number of target columns.
    pub fn cols(mut self, n: usize) -> Self {
        self.n_cols = n;
        self
    }

    /// Eagerly populate the row-major cost matrix.
    ///
    /// Calls `f(i, k)` exactly once per `(row, col)` cell during this
    /// method, stores the result in an internal `Vec<f64>`, and
    /// returns `self`. No closure is retained, which keeps the
    /// builder `Send + Sync` even when constructed from non-`'static`
    /// captures.
    ///
    /// # Panics
    ///
    /// Panics if [`AssignmentBuilder::rows`] or
    /// [`AssignmentBuilder::cols`] has not been called yet — both
    /// dimensions are required to know how to walk `f`.
    pub fn cost(mut self, f: impl Fn(usize, usize) -> f64) -> Self {
        assert!(
            self.n_rows > 0 && self.n_cols > 0,
            "AssignmentBuilder::cost() requires .rows() and .cols() to be set first"
        );
        let mut matrix = Vec::with_capacity(self.n_rows * self.n_cols);
        for i in 0..self.n_rows {
            for k in 0..self.n_cols {
                matrix.push(f(i, k));
            }
        }
        self.cost_matrix = matrix;
        self.cost_set = true;
        self
    }

    /// Tag each row with a `u8` group identifier.
    ///
    /// Rows in different groups are placed in independent
    /// [`AllDifferentExcept`] scopes, and a row may only be assigned
    /// to a column whose group identifier matches. Omitting the call
    /// (or supplying `|_| 0`) puts every row in a single group, which
    /// is the standard bipartite-assignment shape.
    pub fn row_group(mut self, f: impl Fn(usize) -> u8) -> Self {
        self.row_groups = (0..self.n_rows).map(f).collect();
        self
    }

    /// Tag each column with a `u8` group identifier.
    ///
    /// See [`AssignmentBuilder::row_group`] for the semantics.
    pub fn col_group(mut self, f: impl Fn(usize) -> u8) -> Self {
        self.col_groups = (0..self.n_cols).map(f).collect();
        self
    }

    /// Hard-pin row `row` to column `col`.
    ///
    /// `col` may be [`SENTINEL`] to force the row unmatched. Multiple
    /// pins are accumulated; conflicting pins on the same row are
    /// detected at [`AssignmentBuilder::solve`] time as
    /// [`AssignmentError::Infeasible`].
    pub fn pin(mut self, row: usize, col: i32) -> Self {
        self.pins.push((row, col));
        self
    }

    /// Set the per-row cost paid when a row is assigned to
    /// [`SENTINEL`] (left unmatched).
    pub fn unmatch_penalty(mut self, penalty: f64) -> Self {
        self.unmatch_penalty = penalty;
        self
    }

    /// Override the underlying branch-and-bound node budget.
    ///
    /// Passing `None` here is *not* the same as never calling this
    /// method: `None` requests an unbounded search, while the default
    /// (no call) installs a `1_000_000` node guard so a pathological
    /// problem cannot hang the caller. See
    /// [`crate::SolveConfig::node_budget`].
    pub fn node_budget(mut self, budget: Option<u64>) -> Self {
        self.node_budget = budget;
        self
    }

    /// Validate the configuration and solve for the minimum-cost assignment.
    ///
    /// A **group-free, pin-free** instance is dispatched to the closed-form
    /// Kuhn-Munkres LAP solver (always optimal, microsecond-scale, never
    /// budget-blows). Grouped or pinned instances fall through to the general
    /// branch-and-bound CSP path. See the module docs for the n≈15–18 B&B
    /// ceiling; use [`solve_branch_and_bound`](Self::solve_branch_and_bound) to
    /// force the CSP path on any shape.
    pub fn solve(self) -> Result<AssignmentSolution, AssignmentError> {
        // 1. Dimensions + cost must be set.
        if self.n_rows == 0 || self.n_cols == 0 {
            return Err(AssignmentError::DimensionsNotSet);
        }
        if !self.cost_set {
            return Err(AssignmentError::CostNotSet);
        }

        // Closed-form dispatch: a group-free, pin-free instance is a pure
        // linear assignment problem — Kuhn-Munkres solves it optimally in
        // O(n³), sidestepping the exponential B&B that only reaches optimality
        // to n≈15–18 (n=20 budget-blows). Grouped/pinned instances carry
        // constraints the LAP cannot express and stay on the CSP path.
        if self.pins.is_empty() && self.row_groups.is_empty() && self.col_groups.is_empty() {
            return Ok(self.solve_lap());
        }

        self.solve_csp()
    }

    /// Force the branch-and-bound CSP path regardless of shape, bypassing the
    /// closed-form LAP dispatch in [`solve`](Self::solve).
    ///
    /// Exists for benchmarking the general solver and for the node-count
    /// invariance gate — a group-free/pin-free instance solved here exercises
    /// the exact same B&B trajectory it did before the LAP dispatch landed, so
    /// its `nodes_explored` / `backtracks` counts are a stable regression
    /// tripwire. Prefer [`solve`](Self::solve) in production.
    pub fn solve_branch_and_bound(self) -> Result<AssignmentSolution, AssignmentError> {
        if self.n_rows == 0 || self.n_cols == 0 {
            return Err(AssignmentError::DimensionsNotSet);
        }
        if !self.cost_set {
            return Err(AssignmentError::CostNotSet);
        }
        self.solve_csp()
    }
}

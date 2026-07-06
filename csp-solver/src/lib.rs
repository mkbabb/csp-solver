//! A generalized CSP (Constraint Satisfaction Problem) solver.
//!
//! Isomorphic to the Python CSP solver. Supports:
//! - Backtracking search with configurable pruning and variable ordering
//! - AC-3 (Maintaining Arc Consistency) propagation
//! - Forward checking
//! - AC-FC hybrid
//! - Lattice domains for monotonic fixed-point propagation

pub mod adjacency;
pub(crate) mod bitscan;
pub mod builder;
pub mod cancel;
pub mod constraint;
pub mod domain;
pub mod error;
pub mod ordering;
pub mod puzzles;
#[cfg(feature = "py")]
pub mod py;
pub mod solver;
pub mod variable;

pub use builder::assignment::{
    AssignmentBuilder, AssignmentError, AssignmentSolution, SENTINEL, assignment,
};
pub use cancel::CancelToken;
pub use error::CspError;
pub use puzzles::sudoku;

use adjacency::Adjacency;
use constraint::{AllDifferent, Constraint, ConstraintEnum, NotEqual, SoftLambdaConstraint, VarId};
use domain::Domain;
use ordering::Ordering;
use solver::Solution;
use solver::optimize;
use solver::search::{self, SearchParams};
use variable::Variable;

/// Pruning strategy for backtracking search.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Pruning {
    /// No pruning — pure backtracking.
    None,
    /// Forward checking: prune neighbors of the assigned variable.
    ForwardChecking,
    /// MAC: Maintaining Arc Consistency (AC-3 after each assignment).
    Ac3,
    /// Hybrid: forward checking + singleton propagation.
    AcFc,
}

/// Propagation strategy for `propagate_with()`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PropagationStrategy {
    /// Auto-select: AC-3 if finalize() was called, sweep otherwise.
    Auto,
    /// AC-3 worklist with adjacency graph. Requires finalize().
    Ac3,
    /// Fixed-point sweep over all constraints. No adjacency needed.
    Sweep,
}

/// Optimization mode for the solver.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OptimizationMode {
    /// Find any feasible solution (existing behavior).
    Feasibility,
    /// Find the solution minimizing total cost (domain costs + soft penalties).
    MinimizeCost,
    /// Find the solution maximizing total cost.
    MaximizeCost,
}

/// Solve configuration, isomorphic to Python's CSP constructor arguments.
#[derive(Debug, Clone)]
pub struct SolveConfig {
    pub pruning: Pruning,
    pub ordering: Ordering,
    pub max_solutions: usize,
    /// Enable Luby restarts with phase saving and (if `Ordering::Chs`) dynamic
    /// conflict-history weighting. Opt-in; production sudoku stays `Ac3 + Mrv`.
    /// The restart *driver* is not yet wired onto the unified kernel (see the
    /// pass-3 composition report — chs backtrack.rs re-authoring is deferred);
    /// today this flag is accepted but inert.
    pub restarts: bool,
    /// Optimization mode. Defaults to `Feasibility` (pure constraint satisfaction).
    pub optimization_mode: OptimizationMode,
    /// Maximum number of search nodes (backtrack / branch-and-bound
    /// recursions) before the solver aborts early and returns whatever
    /// solutions it has found so far. `None` disables the budget.
    ///
    /// Defaults to `Some(1_000_000)` so an unbounded pathological
    /// search cannot hang a caller. When the budget is hit,
    /// [`SolveStats::budget_exceeded`] is set to `true` on the
    /// returning `Csp::stats()`. Callers that care about optimality
    /// should branch on this flag and either accept the best-so-far
    /// solution or fall back to a trivial per-variable pick.
    pub node_budget: Option<u64>,
    /// Cooperative cancellation flag, checked at the same cadence as
    /// `node_budget`. `None` (the default) means the search cannot be
    /// cancelled externally. Set this to a [`CancelToken`] clone and keep
    /// another clone on the calling side to request an early stop — e.g.
    /// from Python, released via `Python::allow_threads`, when an
    /// `asyncio.wait_for` timeout elapses. See [`SolveStats::cancelled`].
    pub cancel: Option<CancelToken>,
}

impl Default for SolveConfig {
    fn default() -> Self {
        Self {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 1,
            restarts: false,
            optimization_mode: OptimizationMode::Feasibility,
            node_budget: Some(1_000_000),
            cancel: None,
        }
    }
}

/// Solver statistics.
#[derive(Debug, Clone, Default)]
pub struct SolveStats {
    pub backtracks: u64,
    pub nodes_explored: u64,
    pub propagations: u64,
    /// Set to `true` when the last search hit its
    /// [`SolveConfig::node_budget`] and aborted early.
    /// Solutions returned alongside this flag are best-so-far, not
    /// necessarily optimal.
    pub budget_exceeded: bool,
    /// Set to `true` when the last search was stopped early via
    /// [`SolveConfig::cancel`] rather than hitting `node_budget`.
    /// Distinct from `budget_exceeded`: this is an externally requested
    /// stop, not a self-imposed cap.
    pub cancelled: bool,
}

/// The main CSP solver struct.
///
/// Generic over the domain type `D`. Build a problem by adding variables and
/// constraints, call `finalize()` to build the adjacency graph, then `solve()`.
pub struct Csp<D: Domain> {
    pub variables: Vec<Variable<D>>,
    constraints: Vec<ConstraintEnum<D>>,
    adjacency: Option<Adjacency>,
    stats: SolveStats,
    /// Per-constraint weights for the Mrv / Chs weighted-degree scan.
    constraint_weights: Vec<f64>,
    /// For each variable, the indices of constraints involving it.
    var_constraint_ids: Vec<Vec<usize>>,
}

impl<D: Domain> Csp<D> {
    /// Create a new empty CSP.
    pub fn new() -> Self {
        Self {
            variables: Vec::new(),
            constraints: Vec::new(),
            adjacency: None,
            stats: SolveStats::default(),
            constraint_weights: Vec::new(),
            var_constraint_ids: Vec::new(),
        }
    }

    /// Add a variable with the given domain. Returns its VarId.
    pub fn add_variable(&mut self, domain: D) -> VarId {
        let id = self.variables.len() as VarId;
        self.variables.push(Variable::new(domain));
        id
    }

    /// Add multiple variables sharing the same domain. Returns their VarIds.
    pub fn add_variables(&mut self, domain: &D, count: usize) -> Vec<VarId> {
        (0..count)
            .map(|_| self.add_variable(domain.clone()))
            .collect()
    }

    /// Add a custom constraint (wrapped in the `Custom` enum variant).
    pub fn add_constraint(&mut self, c: impl Constraint<D> + 'static) {
        self.constraints.push(ConstraintEnum::Custom(Box::new(c)));
    }

    /// Add a pre-typed constraint enum directly (avoids boxing for built-in types).
    pub fn add_constraint_enum(&mut self, c: ConstraintEnum<D>) {
        self.constraints.push(c);
    }

    /// Add a soft constraint (contributes penalty cost when violated, never prunes).
    pub fn add_soft_constraint(&mut self, c: SoftLambdaConstraint<D>) {
        self.constraints.push(ConstraintEnum::Soft(c));
    }

    /// Add a not-equal constraint (devirtualized fast path).
    pub fn add_not_equal(&mut self, x: VarId, y: VarId) {
        self.constraints
            .push(ConstraintEnum::NotEqual(NotEqual::new(x, y)));
    }

    /// Add an all-different constraint (devirtualized fast path).
    pub fn add_all_different(&mut self, vars: Vec<VarId>) {
        self.constraints
            .push(ConstraintEnum::AllDifferent(AllDifferent::new(vars)));
    }

    /// Fix a variable to a specific value.
    pub fn add_equals(&mut self, var: VarId, value: D::Value)
    where
        D: 'static,
        D::Value: Send + Sync,
    {
        self.add_constraint(constraint::LambdaConstraint::new(
            vec![var],
            move |assignment| match &assignment[var as usize] {
                Some(v) => *v == value,
                None => true,
            },
            format!("equals({var})"),
        ));
    }

    /// Constrain x < y (for Ord-comparable values).
    pub fn add_less_than(&mut self, x: VarId, y: VarId)
    where
        D: 'static,
        D::Value: PartialOrd + Send + Sync,
    {
        self.add_constraint(constraint::LambdaConstraint::new(
            vec![x, y],
            move |assignment| match (&assignment[x as usize], &assignment[y as usize]) {
                (Some(a), Some(b)) => a < b,
                _ => true,
            },
            format!("less_than({x},{y})"),
        ));
    }

    /// Constrain x > y (for Ord-comparable values).
    pub fn add_greater_than(&mut self, x: VarId, y: VarId)
    where
        D: 'static,
        D::Value: PartialOrd + Send + Sync,
    {
        self.add_constraint(constraint::LambdaConstraint::new(
            vec![x, y],
            move |assignment| match (&assignment[x as usize], &assignment[y as usize]) {
                (Some(a), Some(b)) => a > b,
                _ => true,
            },
            format!("greater_than({x},{y})"),
        ));
    }

    /// Build the adjacency graph. Must be called after all variables and
    /// constraints have been added, before calling `solve()`.
    pub fn finalize(&mut self)
    where
        D::Value: PartialEq + 'static,
    {
        let num_vars = self.variables.len();
        self.adjacency = Some(Adjacency::build(num_vars, &self.constraints));

        self.constraint_weights = vec![1.0; self.constraints.len()];
        self.var_constraint_ids = vec![Vec::new(); num_vars];
        for (ci, c) in self.constraints.iter().enumerate() {
            for &v in c.scope() {
                self.var_constraint_ids[v as usize].push(ci);
            }
        }
    }

    /// Propagate constraints to a fixed point (auto-select strategy).
    pub fn propagate(&mut self) -> Result<(), Unsatisfiable>
    where
        D::Value: PartialEq + 'static,
    {
        self.propagate_with(PropagationStrategy::Auto)
    }

    /// Propagate constraints with an explicit strategy.
    pub fn propagate_with(&mut self, strategy: PropagationStrategy) -> Result<(), Unsatisfiable>
    where
        D::Value: PartialEq + 'static,
    {
        match strategy {
            PropagationStrategy::Auto => {
                if self.adjacency.is_some() {
                    self.propagate_with(PropagationStrategy::Ac3)
                } else {
                    self.propagate_with(PropagationStrategy::Sweep)
                }
            }
            PropagationStrategy::Ac3 => {
                // Disjoint field borrows — no adjacency clone (kernel S5).
                let adjacency = self.adjacency.as_ref().ok_or(Unsatisfiable)?;
                // Caller-owned reusable AC-3 worklist scratch (zero-alloc P2-2).
                let mut worklist = solver::ac3::BitsetWorklist::new(self.constraints.len());
                solver::ac3::ac3_full(
                    &mut self.variables,
                    &self.constraints,
                    adjacency,
                    &mut self.stats,
                    &mut worklist,
                    search::PERMANENT_DEPTH,
                )
            }
            PropagationStrategy::Sweep => solver::monotonic::propagate_monotonic(
                &mut self.variables,
                &self.constraints,
                &mut self.stats,
            ),
        }
    }

    /// Run backtracking search with the given configuration.
    ///
    /// Returns up to `config.max_solutions` solutions.
    /// When `optimization_mode` is `MinimizeCost` or `MaximizeCost`, uses
    /// branch-and-bound search and returns solutions sorted by cost (best first).
    pub fn solve(&mut self, config: &SolveConfig) -> Vec<Solution<D>>
    where
        D::Value: PartialEq + 'static,
    {
        assert!(self.adjacency.is_some(), "call finalize() before solve()");

        self.stats = SolveStats::default();

        // Reset all variables to their original domains.
        for v in &mut self.variables {
            v.reset();
        }

        // Root propagation, symmetric with `solve_with_given`'s initial AC-3.
        // Only the MAC (`Ac3`) strategy establishes global arc-consistency, so
        // it is the one whose contract calls for propagating the root before
        // search; the weaker forward-checking strategies prune relative to an
        // assignment and do no root work (`forward_check` on an empty
        // assignment is a no-op). Runs at `PERMANENT_DEPTH` so search's
        // depth-keyed undo never reverts it.
        if config.pruning == Pruning::Ac3 {
            let adjacency = self.adjacency.as_ref().unwrap();
            let mut worklist = solver::ac3::BitsetWorklist::new(self.constraints.len());
            let _ = solver::ac3::ac3_full(
                &mut self.variables,
                &self.constraints,
                adjacency,
                &mut self.stats,
                &mut worklist,
                search::PERMANENT_DEPTH,
            );
        }

        let params = SearchParams {
            pruning: config.pruning,
            ordering: config.ordering,
            max_solutions: config.max_solutions,
            node_budget: config.node_budget,
            cancel: config.cancel.clone(),
        };
        let adjacency = self.adjacency.as_ref().unwrap();

        match config.optimization_mode {
            OptimizationMode::Feasibility => search::feasibility_search(
                &mut self.variables,
                &self.constraints,
                adjacency,
                &mut self.constraint_weights,
                &self.var_constraint_ids,
                &params,
                &mut self.stats,
                None,
            ),
            mode @ (OptimizationMode::MinimizeCost | OptimizationMode::MaximizeCost) => {
                // ZeroCost evaluator — domain costs are 0. For CostDomain-aware
                // optimization, use `solve_optimized()`.
                search::branch_and_bound(
                    &mut self.variables,
                    &self.constraints,
                    adjacency,
                    &mut self.constraint_weights,
                    &self.var_constraint_ids,
                    &params,
                    &mut self.stats,
                    mode == OptimizationMode::MaximizeCost,
                    &optimize::ZeroCost,
                )
            }
        }
    }

    /// Solve with initial propagation for pre-assigned ("given") values.
    ///
    /// Analogous to Python's `solve_with_initial_propagation`.
    /// Pre-assigns the given values, propagates constraints, then searches.
    pub fn solve_with_given(
        &mut self,
        config: &SolveConfig,
        given: &[(VarId, D::Value)],
    ) -> Vec<Solution<D>>
    where
        D::Value: PartialEq + 'static,
    {
        assert!(
            self.adjacency.is_some(),
            "call finalize() before solve_with_given()"
        );

        self.stats = SolveStats::default();

        // Reset all variables to their original domains.
        for v in &mut self.variables {
            v.reset();
        }

        // Apply given values: restrict domain to singleton. Uses
        // `Domain::restrict_to` directly (not `Variable::restrict_to`) —
        // these reductions are permanent, not undo-logged (zero-alloc: O(1)
        // bitmask restrict for `BitsetDomain`, not a collect-then-remove loop).
        for (var, val) in given {
            let _ = self.variables[*var as usize].domain.restrict_to(val);
        }

        // One-hop propagation: remove each given value from its non-given
        // neighbors. Also permanent (direct `remove`).
        {
            let adjacency = self.adjacency.as_ref().unwrap();
            for (var, val) in given {
                for &neighbor in adjacency.neighbors_of_var(*var) {
                    let is_given = given.iter().any(|(gv, _)| *gv == neighbor);
                    if !is_given {
                        self.variables[neighbor as usize].domain.remove(val);
                    }
                }
            }
        }

        // Initial AC-3 propagation from the given cells, at `PERMANENT_DEPTH`.
        // The kernel searches from a strictly deeper frame, so its depth-keyed
        // undo can never revert these reductions — closing the depth-0 seam
        // where the first failed root candidate un-pruned this AC-3 via
        // `restore(0)`. Worklist is caller-owned reusable scratch (zero-alloc).
        {
            let adjacency = self.adjacency.as_ref().unwrap();
            let mut worklist = solver::ac3::BitsetWorklist::new(self.constraints.len());
            let _ = solver::ac3::ac3_full(
                &mut self.variables,
                &self.constraints,
                adjacency,
                &mut self.stats,
                &mut worklist,
                search::PERMANENT_DEPTH,
            );
        }

        let params = SearchParams {
            pruning: config.pruning,
            ordering: config.ordering,
            max_solutions: config.max_solutions,
            node_budget: config.node_budget,
            cancel: config.cancel.clone(),
        };
        let adjacency = self.adjacency.as_ref().unwrap();

        search::feasibility_search(
            &mut self.variables,
            &self.constraints,
            adjacency,
            &mut self.constraint_weights,
            &self.var_constraint_ids,
            &params,
            &mut self.stats,
            Some(given),
        )
    }

    /// Run optimization search with a custom cost evaluator.
    ///
    /// This is the most flexible entry point: you supply a `DomainCostEval`
    /// that defines how domain values are costed. Use `solve()` with
    /// `OptimizationMode::MinimizeCost` if you only need soft constraint
    /// penalties (zero domain cost), or `solve_optimized()` if your domain
    /// implements `CostDomain`.
    pub fn solve_with_cost_eval(
        &mut self,
        config: &SolveConfig,
        cost_eval: &dyn optimize::DomainCostEval<D>,
    ) -> Vec<Solution<D>>
    where
        D::Value: PartialEq + 'static,
    {
        assert!(
            self.adjacency.is_some(),
            "call finalize() before solve_with_cost_eval()"
        );

        self.stats = SolveStats::default();
        for v in &mut self.variables {
            v.reset();
        }

        let params = SearchParams {
            pruning: config.pruning,
            ordering: config.ordering,
            max_solutions: config.max_solutions,
            node_budget: config.node_budget,
            cancel: config.cancel.clone(),
        };
        let adjacency = self.adjacency.as_ref().unwrap();
        search::branch_and_bound(
            &mut self.variables,
            &self.constraints,
            adjacency,
            &mut self.constraint_weights,
            &self.var_constraint_ids,
            &params,
            &mut self.stats,
            config.optimization_mode == OptimizationMode::MaximizeCost,
            cost_eval,
        )
    }

    /// Get solver statistics from the last run.
    pub fn stats(&self) -> &SolveStats {
        &self.stats
    }

    /// Get a reference to the adjacency graph (available after `finalize()`).
    pub fn adjacency(&self) -> Option<&Adjacency> {
        self.adjacency.as_ref()
    }
}

impl<D: Domain> Default for Csp<D> {
    fn default() -> Self {
        Self::new()
    }
}

impl<D: domain::CostDomain> Csp<D> {
    /// Run optimization search using the domain's `CostDomain` implementation
    /// for value costing. This is the ergonomic entry point when your domain
    /// type implements `CostDomain`.
    pub fn solve_optimized(&mut self, config: &SolveConfig) -> Vec<Solution<D>>
    where
        D::Value: PartialEq + 'static,
    {
        self.solve_with_cost_eval(config, &optimize::CostDomainEval)
    }
}

/// Error type for unsatisfiable constraints.
#[derive(Debug, Clone)]
pub struct Unsatisfiable;

impl std::fmt::Display for Unsatisfiable {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "CSP is unsatisfiable")
    }
}

impl std::error::Error for Unsatisfiable {}

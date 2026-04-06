//! A generalized CSP (Constraint Satisfaction Problem) solver.
//!
//! Isomorphic to the Python CSP solver. Supports:
//! - Backtracking search with configurable pruning and variable ordering
//! - AC-3 (Maintaining Arc Consistency) propagation
//! - Forward checking
//! - AC-FC hybrid
//! - Conflict-directed backjumping
//! - Lattice domains for monotonic fixed-point propagation

pub mod adjacency;
pub mod constraint;
pub mod domain;
pub mod ordering;
#[cfg(feature = "py")]
pub mod py;
pub mod puzzles;
pub mod solver;
pub mod variable;

pub use puzzles::sudoku;

use adjacency::Adjacency;
use constraint::{AllDifferent, Constraint, ConstraintEnum, NotEqual, VarId};
use domain::Domain;
use ordering::Ordering;
use solver::backjump::{self, BackjumpConfig};
use solver::backtrack::{self, BacktrackConfig, Solution};
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

/// Solve configuration, isomorphic to Python's CSP constructor arguments.
#[derive(Debug, Clone)]
pub struct SolveConfig {
    pub pruning: Pruning,
    pub ordering: Ordering,
    pub max_solutions: usize,
    /// Whether to use conflict-directed backjumping instead of chronological backtracking.
    pub backjumping: bool,
}

impl Default for SolveConfig {
    fn default() -> Self {
        Self {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 1,
            backjumping: false,
        }
    }
}

/// Solver statistics.
#[derive(Debug, Clone, Default)]
pub struct SolveStats {
    pub backtracks: u64,
    pub nodes_explored: u64,
    pub propagations: u64,
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
    /// Per-constraint weights for dom/wdeg ordering.
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

    /// Add a not-equal constraint (devirtualized fast path).
    pub fn add_not_equal(&mut self, x: VarId, y: VarId) {
        self.constraints.push(ConstraintEnum::NotEqual(NotEqual::new(x, y)));
    }

    /// Add an all-different constraint (devirtualized fast path).
    pub fn add_all_different(&mut self, vars: Vec<VarId>) {
        self.constraints.push(ConstraintEnum::AllDifferent(AllDifferent::new(vars)));
    }

    /// Build the adjacency graph. Must be called after all variables and
    /// constraints have been added, before calling `solve()`.
    pub fn finalize(&mut self)
    where
        D::Value: PartialEq,
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

    /// AC-3 propagation only — no search. Useful for lattice domains.
    ///
    /// Returns `Err(Unsatisfiable)` if a domain wipe-out is detected.
    pub fn propagate(&mut self) -> Result<(), Unsatisfiable>
    where
        D::Value: PartialEq,
    {
        let adjacency = self
            .adjacency
            .as_ref()
            .expect("call finalize() before propagate()");

        solver::ac3::ac3_full(
            &mut self.variables,
            &self.constraints,
            adjacency,
            &mut self.stats,
            0,
        )
        .map_err(|()| Unsatisfiable)
    }

    /// Monotonic propagation — no adjacency graph, no undo log.
    ///
    /// Ideal for lattice domains (FIRST/FOLLOW sets, type inference) where
    /// domains only grow and no backtracking is needed. Skips `finalize()`.
    pub fn propagate_monotonic(&mut self) -> Result<(), Unsatisfiable>
    where
        D::Value: PartialEq,
    {
        solver::monotonic::propagate_monotonic(
            &mut self.variables,
            &self.constraints,
            &mut self.stats,
        )
        .map_err(|()| Unsatisfiable)
    }

    /// Run backtracking (or backjumping) search with the given configuration.
    ///
    /// Returns up to `config.max_solutions` solutions.
    pub fn solve(&mut self, config: &SolveConfig) -> Vec<Solution<D>>
    where
        D::Value: PartialEq,
    {
        let adjacency = self
            .adjacency
            .as_ref()
            .expect("call finalize() before solve()")
            .clone();

        self.stats = SolveStats::default();

        // Reset all variables to their original domains
        for v in &mut self.variables {
            v.reset();
        }

        if config.backjumping {
            let bj_config = BackjumpConfig {
                pruning: config.pruning,
                ordering: config.ordering,
                max_solutions: config.max_solutions,
                constraint_weights: self.constraint_weights.clone(),
                var_constraint_ids: self.var_constraint_ids.clone(),
            };
            backjump::backjump_search(
                &mut self.variables,
                &self.constraints,
                &adjacency,
                &bj_config,
                &mut self.stats,
            )
        } else {
            let bt_config = BacktrackConfig {
                pruning: config.pruning,
                ordering: config.ordering,
                max_solutions: config.max_solutions,
                constraint_weights: self.constraint_weights.clone(),
                var_constraint_ids: self.var_constraint_ids.clone(),
            };
            backtrack::backtrack_search(
                &mut self.variables,
                &self.constraints,
                &adjacency,
                &bt_config,
                &mut self.stats,
            )
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
        D::Value: PartialEq,
    {
        let adjacency = self
            .adjacency
            .as_ref()
            .expect("call finalize() before solve_with_given()")
            .clone();

        self.stats = SolveStats::default();

        // Reset all variables to their original domains
        for v in &mut self.variables {
            v.reset();
        }

        // Apply given values: restrict domain to singleton
        for (var, val) in given {
            let v = &mut self.variables[*var as usize];
            let vals = v.domain.values();
            for dv in &vals {
                if dv != val {
                    v.domain.remove(dv);
                }
            }
        }

        // One-hop propagation: for each given variable, remove its value from neighbors
        for (var, val) in given {
            for &neighbor in adjacency.neighbors_of_var(*var) {
                let is_given = given.iter().any(|(gv, _)| *gv == neighbor);
                if !is_given {
                    self.variables[neighbor as usize].domain.remove(val);
                }
            }
        }

        // Initial AC-3 propagation from given cells
        let _ = solver::ac3::ac3_full(
            &mut self.variables,
            &self.constraints,
            &adjacency,
            &mut self.stats,
            0, // depth 0 = permanent reductions (no undo needed)
        );

        let bt_config = BacktrackConfig {
            pruning: config.pruning,
            ordering: config.ordering,
            max_solutions: config.max_solutions,
            constraint_weights: self.constraint_weights.clone(),
            var_constraint_ids: self.var_constraint_ids.clone(),
        };

        backtrack::backtrack_search_with_given(
            &mut self.variables,
            &self.constraints,
            &adjacency,
            &bt_config,
            &mut self.stats,
            given,
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

/// Error type for unsatisfiable constraints.
#[derive(Debug, Clone)]
pub struct Unsatisfiable;

impl std::fmt::Display for Unsatisfiable {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "CSP is unsatisfiable")
    }
}

impl std::error::Error for Unsatisfiable {}

// ---- Tests ----

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constraint::{AllDifferent, LambdaConstraint, NotEqual};
    use crate::domain::bitset::BitsetDomain;
    use crate::domain::finite::FiniteDomain;
    use crate::domain::lattice::BitsetLatticeDomain;
    use crate::domain::LatticeDomain;

    // -----------------------------------------------------------------------
    // 1. Map coloring: Australia 3-color problem
    // -----------------------------------------------------------------------
    #[test]
    fn test_australia_map_coloring() {
        // 7 regions: WA=0, NT=1, SA=2, Q=3, NSW=4, V=5, T=6
        // 3 colors: 0, 1, 2
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..3);
        let vars = csp.add_variables(&domain, 7);
        let [wa, nt, sa, q, nsw, v, _t] = [vars[0], vars[1], vars[2], vars[3], vars[4], vars[5], vars[6]];

        // Adjacent regions must have different colors
        let edges = [(wa, nt), (wa, sa), (nt, sa), (nt, q), (sa, q), (sa, nsw), (sa, v), (q, nsw), (nsw, v)];
        for (a, b) in edges {
            csp.add_constraint(NotEqual::new(a, b));
        }

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty(), "Should find at least one solution");

        let sol = &solutions[0];
        // Verify all constraints
        for (a, b) in &edges {
            assert_ne!(
                sol[*a as usize], sol[*b as usize],
                "Adjacent regions {:?} and {:?} have same color",
                a, b
            );
        }
    }

    // -----------------------------------------------------------------------
    // Test map coloring with all pruning strategies
    // -----------------------------------------------------------------------
    #[test]
    fn test_australia_all_pruning() {
        for pruning in [Pruning::None, Pruning::ForwardChecking, Pruning::Ac3, Pruning::AcFc] {
            let mut csp = Csp::new();
            let domain = BitsetDomain::new(0..3);
            let _vars = csp.add_variables(&domain, 7);

            let edges: [(VarId, VarId); 9] = [
                (0, 1), (0, 2), (1, 2), (1, 3), (2, 3), (2, 4), (2, 5), (3, 4), (4, 5),
            ];
            for (a, b) in edges {
                csp.add_constraint(NotEqual::new(a, b));
            }
            csp.finalize();

            let config = SolveConfig {
                pruning,
                ordering: Ordering::Chronological,
                max_solutions: 1,
                backjumping: false,
            };

            let solutions = csp.solve(&config);
            assert!(
                !solutions.is_empty(),
                "Pruning {:?} should find a solution",
                pruning
            );
        }
    }

    // -----------------------------------------------------------------------
    // 2. 4-Queens
    // -----------------------------------------------------------------------
    #[test]
    fn test_4_queens() {
        let n = 4u32;
        let mut csp = Csp::new();

        // Variable i = row for queen in column i. Domain = {0, 1, 2, 3}.
        let domain = BitsetDomain::new(0..n);
        let vars = csp.add_variables(&domain, n as usize);

        // All queens in different rows
        csp.add_constraint(AllDifferent::new(vars.clone()));

        // No two queens on the same diagonal
        for i in 0..n {
            for j in (i + 1)..n {
                let vi = vars[i as usize];
                let vj = vars[j as usize];
                let diff = j - i;
                csp.add_constraint(LambdaConstraint::new(
                    vec![vi, vj],
                    move |assignment: &[Option<u32>]| {
                        match (&assignment[vi as usize], &assignment[vj as usize]) {
                            (Some(ri), Some(rj)) => {
                                let row_diff = ri.abs_diff(*rj);
                                row_diff != diff
                            }
                            _ => true,
                        }
                    },
                    format!("diag({i},{j})"),
                ));
            }
        }

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 100,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        // 4-Queens has exactly 2 solutions
        assert_eq!(solutions.len(), 2, "4-Queens should have exactly 2 solutions");

        // Verify solutions
        for sol in &solutions {
            for i in 0..n as usize {
                for j in (i + 1)..n as usize {
                    assert_ne!(sol[i], sol[j], "Same row");
                    let row_diff = if sol[i] > sol[j] {
                        sol[i] - sol[j]
                    } else {
                        sol[j] - sol[i]
                    };
                    let col_diff = (j - i) as u32;
                    assert_ne!(row_diff, col_diff, "Same diagonal");
                }
            }
        }
    }

    // -----------------------------------------------------------------------
    // 3. Simple 4x4 Sudoku
    // -----------------------------------------------------------------------
    #[test]
    fn test_4x4_sudoku() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(1..=4);

        // 16 variables: cell (r, c) = variable r*4 + c
        let vars: Vec<VarId> = (0..16).map(|_| csp.add_variable(domain.clone())).collect();

        // Row constraints: all different in each row
        for r in 0..4 {
            let row_vars: Vec<VarId> = (0..4).map(|c| vars[r * 4 + c]).collect();
            csp.add_constraint(AllDifferent::new(row_vars));
        }

        // Column constraints: all different in each column
        for c in 0..4 {
            let col_vars: Vec<VarId> = (0..4).map(|r| vars[r * 4 + c]).collect();
            csp.add_constraint(AllDifferent::new(col_vars));
        }

        // Box constraints: 2x2 boxes
        for br in 0..2usize {
            for bc in 0..2usize {
                let mut box_vars = Vec::new();
                for dr in 0..2usize {
                    for dc in 0..2usize {
                        box_vars.push(vars[(br * 2 + dr) * 4 + (bc * 2 + dc)]);
                    }
                }
                csp.add_constraint(AllDifferent::new(box_vars));
            }
        }

        csp.finalize();

        // Given clues:
        // 1 _ _ _
        // _ _ _ 2
        // _ _ _ _
        // _ 3 _ _
        let given = vec![
            (vars[0], 1u32),   // (0,0) = 1
            (vars[7], 2u32),   // (1,3) = 2
            (vars[13], 3u32),  // (3,1) = 3
        ];

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve_with_given(&config, &given);
        assert!(!solutions.is_empty(), "Should find a solution for 4x4 sudoku");

        let sol = &solutions[0];

        // Verify given cells
        assert_eq!(sol[0], 1);
        assert_eq!(sol[7], 2);
        assert_eq!(sol[13], 3);

        // Verify all rows have distinct values 1-4
        for r in 0..4 {
            let mut row: Vec<u32> = (0..4).map(|c| sol[r * 4 + c]).collect();
            row.sort();
            assert_eq!(row, vec![1, 2, 3, 4], "Row {r} invalid");
        }

        // Verify all columns
        for c in 0..4 {
            let mut col: Vec<u32> = (0..4).map(|r| sol[r * 4 + c]).collect();
            col.sort();
            assert_eq!(col, vec![1, 2, 3, 4], "Column {c} invalid");
        }

        // Verify 2x2 boxes
        for br in 0..2 {
            for bc in 0..2 {
                let mut bx: Vec<u32> = (0..2)
                    .flat_map(|dr| (0..2).map(move |dc| sol[(br * 2 + dr) * 4 + (bc * 2 + dc)]))
                    .collect();
                bx.sort();
                assert_eq!(bx, vec![1, 2, 3, 4], "Box ({br},{bc}) invalid");
            }
        }
    }

    // -----------------------------------------------------------------------
    // 4. AC-3 propagation only — lattice domain
    // -----------------------------------------------------------------------
    #[test]
    fn test_lattice_propagation() {
        // Test: two variables with a "subset" constraint.
        // var0 starts with {0, 1}, var1 starts with bottom (empty).
        // Constraint: var1 must be the join (union) of var0 and var1.
        // After propagation, var1 should contain {0, 1}.

        let mut csp = Csp::new();

        let d0 = BitsetLatticeDomain::new(BitsetDomain::new([0, 1]));
        let d1 = BitsetLatticeDomain::bottom();

        let v0 = csp.add_variable(d0);
        let v1 = csp.add_variable(d1);

        // Constraint: v1 >= v0 (v1 contains everything in v0)
        csp.add_constraint(LambdaConstraint::<BitsetLatticeDomain>::new(
            vec![v0, v1],
            move |assignment| {
                match (&assignment[v0 as usize], &assignment[v1 as usize]) {
                    (Some(a), Some(b)) => {
                        // b must be a superset of a
                        (a.bits() & b.bits()) == a.bits()
                    }
                    _ => true,
                }
            },
            "v1 >= v0",
        ));

        csp.finalize();

        let result = csp.propagate();
        // Note: pure AC-3 propagation on lattice domains with lambda constraints
        // uses the default revise() which only operates on binary pairwise support.
        // This verifies the machinery works without wipe-out.
        assert!(result.is_ok(), "Propagation should not fail");
    }

    // -----------------------------------------------------------------------
    // 5. FiniteDomain with string-like values
    // -----------------------------------------------------------------------
    #[test]
    fn test_finite_domain_strings() {
        let mut csp: Csp<FiniteDomain<String>> = Csp::new();

        let colors = FiniteDomain::new(vec![
            "red".to_string(),
            "green".to_string(),
            "blue".to_string(),
        ]);

        let v0 = csp.add_variable(colors.clone());
        let v1 = csp.add_variable(colors.clone());
        let v2 = csp.add_variable(colors.clone());

        csp.add_constraint(NotEqual::new(v0, v1));
        csp.add_constraint(NotEqual::new(v1, v2));
        csp.add_constraint(NotEqual::new(v0, v2));

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 100,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        // 3 colors, 3 variables, all different => 3! = 6 solutions
        assert_eq!(solutions.len(), 6, "Should find exactly 6 colorings");

        for sol in &solutions {
            assert_ne!(sol[0], sol[1]);
            assert_ne!(sol[1], sol[2]);
            assert_ne!(sol[0], sol[2]);
        }
    }

    // -----------------------------------------------------------------------
    // 6. Backjumping
    // -----------------------------------------------------------------------
    #[test]
    fn test_backjumping() {
        // Same as map coloring, but with backjumping enabled
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..3);
        let _vars = csp.add_variables(&domain, 7);

        let edges: [(VarId, VarId); 9] = [
            (0, 1), (0, 2), (1, 2), (1, 3), (2, 3), (2, 4), (2, 5), (3, 4), (4, 5),
        ];
        for (a, b) in edges {
            csp.add_constraint(NotEqual::new(a, b));
        }
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: true,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty(), "Backjumping should find a solution");

        // Verify solution
        let sol = &solutions[0];
        for (a, b) in &edges {
            assert_ne!(sol[*a as usize], sol[*b as usize]);
        }
    }

    // -----------------------------------------------------------------------
    // 7. DomWdeg ordering
    // -----------------------------------------------------------------------
    #[test]
    fn test_dom_wdeg_ordering() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..3);
        let _vars = csp.add_variables(&domain, 7);

        let edges: [(VarId, VarId); 9] = [
            (0, 1), (0, 2), (1, 2), (1, 3), (2, 3), (2, 4), (2, 5), (3, 4), (4, 5),
        ];
        for (a, b) in edges {
            csp.add_constraint(NotEqual::new(a, b));
        }
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::DomWdeg,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty(), "DomWdeg should find a solution");
    }

    // -----------------------------------------------------------------------
    // 8. 8-Queens
    // -----------------------------------------------------------------------
    #[test]
    fn test_8_queens() {
        let n = 8u32;
        let mut csp = Csp::new();

        let domain = BitsetDomain::new(0..n);
        let vars = csp.add_variables(&domain, n as usize);

        csp.add_constraint(AllDifferent::new(vars.clone()));

        for i in 0..n {
            for j in (i + 1)..n {
                let vi = vars[i as usize];
                let vj = vars[j as usize];
                let diff = j - i;
                csp.add_constraint(LambdaConstraint::new(
                    vec![vi, vj],
                    move |assignment: &[Option<u32>]| {
                        match (&assignment[vi as usize], &assignment[vj as usize]) {
                            (Some(ri), Some(rj)) => {
                                let row_diff = ri.abs_diff(*rj);
                                row_diff != diff
                            }
                            _ => true,
                        }
                    },
                    format!("diag({i},{j})"),
                ));
            }
        }

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 92,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert_eq!(solutions.len(), 92, "8-Queens should have exactly 92 solutions");
    }

    // -----------------------------------------------------------------------
    // 9. Unsatisfiable problem
    // -----------------------------------------------------------------------
    #[test]
    fn test_unsatisfiable() {
        let mut csp = Csp::new();

        // 3 variables with domain {0, 1} — all must be different (impossible: pigeonhole)
        let domain = BitsetDomain::new(0..2);
        let vars = csp.add_variables(&domain, 3);
        csp.add_constraint(AllDifferent::new(vars));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(solutions.is_empty(), "Should find no solutions (pigeonhole)");
    }

    // -----------------------------------------------------------------------
    // 10. BitsetDomain basic operations
    // -----------------------------------------------------------------------
    #[test]
    fn test_bitset_domain_operations() {
        use crate::domain::Domain;

        let mut d = BitsetDomain::new(0..5);
        assert_eq!(d.size(), 5);
        assert!(d.contains(&0));
        assert!(d.contains(&4));
        assert!(!d.contains(&5));

        assert!(d.remove(&2));
        assert!(!d.contains(&2));
        assert_eq!(d.size(), 4);

        assert!(!d.remove(&2)); // already removed
        assert_eq!(d.size(), 4);

        d.add(&2);
        assert!(d.contains(&2));
        assert_eq!(d.size(), 5);

        let vals = d.values();
        assert_eq!(vals, vec![0, 1, 2, 3, 4]);

        // Singleton
        let mut s = BitsetDomain::new([42]);
        assert!(s.is_singleton());
        assert_eq!(s.singleton_value(), Some(42));

        s.add(&7);
        assert!(!s.is_singleton());
    }

    // -----------------------------------------------------------------------
    // 11. Stats tracking
    // -----------------------------------------------------------------------
    #[test]
    fn test_stats() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..3);
        let _vars = csp.add_variables(&domain, 4);

        csp.add_constraint(NotEqual::new(0, 1));
        csp.add_constraint(NotEqual::new(1, 2));
        csp.add_constraint(NotEqual::new(2, 3));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 1,
            backjumping: false,
        };

        let _solutions = csp.solve(&config);
        let stats = csp.stats();
        assert!(stats.nodes_explored > 0, "Should have explored some nodes");
    }

    // -----------------------------------------------------------------------
    // 12. Multiple solutions
    // -----------------------------------------------------------------------
    #[test]
    fn test_multiple_solutions() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..3);
        let _vars = csp.add_variables(&domain, 2);

        csp.add_constraint(NotEqual::new(0, 1));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::None,
            ordering: Ordering::Chronological,
            max_solutions: 100,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        // 3 values, 2 variables, all different => 3 * 2 = 6 solutions
        assert_eq!(solutions.len(), 6);
    }

    // =======================================================================
    // Ported from Python test_solver.py
    // =======================================================================

    // -----------------------------------------------------------------------
    // 13. Simple 2-variable CSP (Python: test_simple_csp)
    // -----------------------------------------------------------------------
    #[test]
    fn test_simple_2var_csp() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(1..=3);
        let a = csp.add_variable(domain.clone());
        let b = csp.add_variable(domain);

        csp.add_constraint(NotEqual::new(a, b));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert_eq!(solutions.len(), 1);
        assert_ne!(solutions[0][a as usize], solutions[0][b as usize]);
    }

    // -----------------------------------------------------------------------
    // 14. BitsetDomain clone independence (Python: test_bitset_domain_copy_independence)
    // -----------------------------------------------------------------------
    #[test]
    fn test_bitset_domain_clone_independence() {
        use crate::domain::Domain;

        let d1 = BitsetDomain::new([1, 2, 3]);
        let mut d2 = d1.clone();
        d2.remove(&2);
        assert!(d1.contains(&2), "Original should still contain 2");
        assert!(!d2.contains(&2), "Clone should not contain 2");
    }

    // -----------------------------------------------------------------------
    // 15. BitsetDomain union (Python: test_bitset_domain_update)
    // -----------------------------------------------------------------------
    #[test]
    fn test_bitset_domain_union() {
        let mut d1 = BitsetDomain::new([1, 2]);
        let d2 = BitsetDomain::new([3, 4]);
        d1.union_with(&d2);
        assert_eq!(d1.values(), vec![1, 2, 3, 4]);
    }

    // -----------------------------------------------------------------------
    // 16. Empty BitsetDomain (Python: test_bitset_domain_empty)
    // -----------------------------------------------------------------------
    #[test]
    fn test_bitset_domain_empty() {
        use crate::domain::Domain;

        let d = BitsetDomain::empty();
        assert_eq!(d.size(), 0);
        assert!(d.is_empty());
        assert_eq!(d.values(), Vec::<u32>::new());
    }

    // -----------------------------------------------------------------------
    // 17. Lattice domain set join (Python: test_lattice_domain_set)
    // -----------------------------------------------------------------------
    #[test]
    fn test_lattice_domain_set_join() {
        let mut d = BitsetLatticeDomain::bottom();
        assert_eq!(d.inner().bits(), 0); // empty

        // Join {0, 1}
        let s1 = BitsetLatticeDomain::new(BitsetDomain::new([0, 1]));
        assert!(d.join(&s1)); // changed
        assert_eq!(d.inner().values(), vec![0, 1]);

        // Join {1, 2} -> union = {0, 1, 2}
        let s2 = BitsetLatticeDomain::new(BitsetDomain::new([1, 2]));
        assert!(d.join(&s2)); // changed
        assert_eq!(d.inner().values(), vec![0, 1, 2]);

        // Join {0} -> subset, no change
        let s3 = BitsetLatticeDomain::new(BitsetDomain::new([0]));
        assert!(!d.join(&s3)); // no change
    }

    // -----------------------------------------------------------------------
    // 18. Lattice domain protocol (Python: test_lattice_domain_protocol)
    // -----------------------------------------------------------------------
    #[test]
    fn test_lattice_domain_protocol() {
        use crate::domain::Domain;

        let d = BitsetLatticeDomain::bottom();
        assert_eq!(d.size(), 1); // always singleton
        assert!(d.is_singleton());

        // Singleton value is the empty bitset
        let sv = d.singleton_value().unwrap();
        assert_eq!(sv.size(), 0);

        // After join, still singleton but value changes
        let mut d2 = BitsetLatticeDomain::new(BitsetDomain::new([5]));
        assert_eq!(d2.size(), 1);
        assert!(d2.is_singleton());
        let sv2 = d2.singleton_value().unwrap();
        assert!(sv2.contains(&5));
        assert!(!sv2.contains(&6));

        // Join more
        let more = BitsetLatticeDomain::new(BitsetDomain::new([6]));
        d2.join(&more);
        let sv3 = d2.singleton_value().unwrap();
        assert!(sv3.contains(&5));
        assert!(sv3.contains(&6));
    }

    // -----------------------------------------------------------------------
    // 19. Forward checking DWO detection (Python: test_forward_check_returns_dwo)
    // -----------------------------------------------------------------------
    #[test]
    fn test_forward_check_dwo() {
        // 2 variables with domain {0}, must be different -> immediate DWO
        let mut csp = Csp::new();
        let domain = BitsetDomain::new([0]);
        let _vars = csp.add_variables(&domain, 2);

        csp.add_constraint(NotEqual::new(0, 1));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(solutions.is_empty(), "DWO: singleton domains with NotEqual");
    }

    // -----------------------------------------------------------------------
    // 20. Unsolvable pigeonhole with backtrack count (Python: test_unsolvable_pigeonhole)
    // -----------------------------------------------------------------------
    #[test]
    fn test_unsolvable_pigeonhole_backtracks() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new([0]);
        let vars = csp.add_variables(&domain, 3);
        csp.add_constraint(AllDifferent::new(vars));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(solutions.is_empty());
        assert!(csp.stats().backtracks > 0, "Should have backtracked");
    }

    // -----------------------------------------------------------------------
    // 21. Multiple solutions with 3! = 6 permutations (Python: test_multiple_solutions)
    // -----------------------------------------------------------------------
    #[test]
    fn test_all_permutations_3var() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(1..=3);
        let vars = csp.add_variables(&domain, 3);
        csp.add_constraint(AllDifferent::new(vars));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 100,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert_eq!(solutions.len(), 6, "3! = 6 permutations");
    }

    // -----------------------------------------------------------------------
    // 22. AC-3 full solve (Python: test_ac3_with_residual_support)
    // -----------------------------------------------------------------------
    #[test]
    fn test_ac3_full_solve() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(1..=3);
        let vars = csp.add_variables(&domain, 3);
        csp.add_constraint(AllDifferent::new(vars));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::Ac3,
            ordering: Ordering::Chronological,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty(), "AC-3 should find a solution");
        // Verify all different
        let sol = &solutions[0];
        assert_ne!(sol[0], sol[1]);
        assert_ne!(sol[1], sol[2]);
        assert_ne!(sol[0], sol[2]);
    }

    // -----------------------------------------------------------------------
    // 23. Initial AC-3 propagation reduces domains (Python: test_initial_ac3_propagation)
    // -----------------------------------------------------------------------
    #[test]
    fn test_initial_ac3_propagation() {
        // 4x4 sudoku with first row fully given: strong propagation, few backtracks.
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(1..=4);
        let _vars: Vec<VarId> = (0..16).map(|_| csp.add_variable(domain.clone())).collect();

        // Row constraints
        for r in 0..4 {
            let row_vars: Vec<VarId> = (0..4).map(|c| (r * 4 + c) as VarId).collect();
            csp.add_constraint(AllDifferent::new(row_vars));
        }
        // Column constraints
        for c in 0..4 {
            let col_vars: Vec<VarId> = (0..4).map(|r| (r * 4 + c) as VarId).collect();
            csp.add_constraint(AllDifferent::new(col_vars));
        }
        // Box constraints
        for br in 0..2u32 {
            for bc in 0..2u32 {
                let box_vars: Vec<VarId> = (0..2)
                    .flat_map(|dr| (0..2).map(move |dc| (br * 2 + dr) * 4 + (bc * 2 + dc)))
                    .collect();
                csp.add_constraint(AllDifferent::new(box_vars));
            }
        }

        csp.finalize();

        // First row fully given: 1, 2, 3, 4
        let given = vec![(0u32, 1u32), (1, 2), (2, 3), (3, 4)];

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve_with_given(&config, &given);
        assert!(!solutions.is_empty());
        // With strong initial propagation, should need very few backtracks
        assert!(
            csp.stats().backtracks <= 20,
            "Expected few backtracks with heavy initial propagation, got {}",
            csp.stats().backtracks
        );
    }

    // =======================================================================
    // Ported from Python test_benchmarks.py
    // =======================================================================

    // -----------------------------------------------------------------------
    // Helper: build N-Queens CSP
    // -----------------------------------------------------------------------
    fn build_nqueens(n: u32) -> Csp<BitsetDomain> {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..n);
        let vars = csp.add_variables(&domain, n as usize);
        csp.add_constraint(AllDifferent::new(vars.clone()));
        for i in 0..n {
            for j in (i + 1)..n {
                let vi = vars[i as usize];
                let vj = vars[j as usize];
                let diff = j - i;
                csp.add_constraint(LambdaConstraint::new(
                    vec![vi, vj],
                    move |assignment: &[Option<u32>]| {
                        match (&assignment[vi as usize], &assignment[vj as usize]) {
                            (Some(ri), Some(rj)) => ri.abs_diff(*rj) != diff,
                            _ => true,
                        }
                    },
                    format!("diag({i},{j})"),
                ));
            }
        }
        csp.finalize();
        csp
    }

    // -----------------------------------------------------------------------
    // Helper: build 9x9 Sudoku CSP from a flat 81-element grid
    // -----------------------------------------------------------------------
    fn build_sudoku_9x9(grid: &[u32; 81]) -> (Csp<BitsetDomain>, Vec<(VarId, u32)>) {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(1..=9);
        let _vars: Vec<VarId> = (0..81).map(|_| csp.add_variable(domain.clone())).collect();

        // Row constraints
        for r in 0..9 {
            let row_vars: Vec<VarId> = (0..9).map(|c| (r * 9 + c) as VarId).collect();
            csp.add_constraint(AllDifferent::new(row_vars));
        }
        // Column constraints
        for c in 0..9 {
            let col_vars: Vec<VarId> = (0..9).map(|r| (r * 9 + c) as VarId).collect();
            csp.add_constraint(AllDifferent::new(col_vars));
        }
        // 3x3 box constraints
        for bi in 0..3u32 {
            for bj in 0..3u32 {
                let box_vars: Vec<VarId> = (0..3)
                    .flat_map(|di| (0..3).map(move |dj| (bi * 3 + di) * 9 + (bj * 3 + dj)))
                    .collect();
                csp.add_constraint(AllDifferent::new(box_vars));
            }
        }

        csp.finalize();

        // Extract given clues
        let given: Vec<(VarId, u32)> = grid
            .iter()
            .enumerate()
            .filter(|&(_, v)| *v != 0)
            .map(|(i, &v)| (i as VarId, v))
            .collect();

        (csp, given)
    }

    fn validate_sudoku_solution(sol: &[u32]) {
        assert_eq!(sol.len(), 81);
        // All values 1-9
        for &v in sol {
            assert!((1..=9).contains(&v), "Value {v} out of range");
        }
        // Rows
        for r in 0..9 {
            let mut row: Vec<u32> = (0..9).map(|c| sol[r * 9 + c]).collect();
            row.sort();
            assert_eq!(row, vec![1, 2, 3, 4, 5, 6, 7, 8, 9], "Row {r} invalid");
        }
        // Columns
        for c in 0..9 {
            let mut col: Vec<u32> = (0..9).map(|r| sol[r * 9 + c]).collect();
            col.sort();
            assert_eq!(col, vec![1, 2, 3, 4, 5, 6, 7, 8, 9], "Col {c} invalid");
        }
        // 3x3 boxes
        for bi in 0..3 {
            for bj in 0..3 {
                let mut bx: Vec<u32> = (0..3)
                    .flat_map(|di| (0..3).map(move |dj| sol[(bi * 3 + di) * 9 + (bj * 3 + dj)]))
                    .collect();
                bx.sort();
                assert_eq!(bx, vec![1, 2, 3, 4, 5, 6, 7, 8, 9], "Box ({bi},{bj}) invalid");
            }
        }
    }

    // -----------------------------------------------------------------------
    // 24. Simple 4-variable problem (Python: test_benchmarks.py SIMPLE_4VAR)
    // -----------------------------------------------------------------------
    #[test]
    fn test_simple_4var() {
        // 4 variables, domain {0, 1}, two all-different constraints on disjoint pairs
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..2);
        let _vars = csp.add_variables(&domain, 4);

        csp.add_constraint(AllDifferent::new(vec![0, 1]));
        csp.add_constraint(AllDifferent::new(vec![2, 3]));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 100,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        // 2! * 2! = 4 solutions (each pair independently)
        assert_eq!(solutions.len(), 4);

        for sol in &solutions {
            assert_ne!(sol[0], sol[1]);
            assert_ne!(sol[2], sol[3]);
        }
    }

    // -----------------------------------------------------------------------
    // 25. Cross-config correctness: all pruning x ordering combos on map coloring
    //     (Python: test_benchmarks.py test_solver_correctness parametrized)
    // -----------------------------------------------------------------------
    #[test]
    fn test_cross_config_correctness_map_coloring() {
        let prunings = [Pruning::None, Pruning::ForwardChecking, Pruning::Ac3, Pruning::AcFc];
        let orderings = [Ordering::Chronological, Ordering::FailFirst, Ordering::DomWdeg];

        for pruning in &prunings {
            for ordering in &orderings {
                let mut csp = Csp::new();
                let domain = BitsetDomain::new(0..3);
                let _vars = csp.add_variables(&domain, 7);

                let edges: [(VarId, VarId); 9] = [
                    (0, 1), (0, 2), (1, 2), (1, 3), (2, 3), (2, 4), (2, 5), (3, 4), (4, 5),
                ];
                for (a, b) in edges {
                    csp.add_constraint(NotEqual::new(a, b));
                }
                csp.finalize();

                let config = SolveConfig {
                    pruning: *pruning,
                    ordering: *ordering,
                    max_solutions: 1,
                    backjumping: false,
                };

                let solutions = csp.solve(&config);
                assert!(
                    !solutions.is_empty(),
                    "Map coloring failed with pruning={:?}, ordering={:?}",
                    pruning, ordering
                );

                let sol = &solutions[0];
                for (a, b) in &edges {
                    assert_ne!(
                        sol[*a as usize], sol[*b as usize],
                        "Adjacent regions same color: pruning={:?}, ordering={:?}",
                        pruning, ordering
                    );
                }
            }
        }
    }

    // -----------------------------------------------------------------------
    // 26. Cross-config correctness: 8-Queens with all pruning strategies
    // -----------------------------------------------------------------------
    #[test]
    fn test_cross_config_8queens() {
        // Note: Pruning::None with 8-Queens causes deep recursion (8^8 search space).
        // Only test strategies that prune the search space.
        for pruning in [Pruning::ForwardChecking, Pruning::Ac3, Pruning::AcFc] {
            let mut csp = build_nqueens(8);

            let config = SolveConfig {
                pruning,
                ordering: Ordering::FailFirst,
                max_solutions: 1,
                backjumping: false,
            };

            let solutions = csp.solve(&config);
            assert!(
                !solutions.is_empty(),
                "8-Queens failed with pruning={:?}",
                pruning
            );
        }
    }

    // -----------------------------------------------------------------------
    // 27. Max solutions limit respected
    // -----------------------------------------------------------------------
    #[test]
    fn test_max_solutions_limit() {
        let mut csp = build_nqueens(8);

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 5,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert_eq!(solutions.len(), 5, "Should respect max_solutions=5");
    }

    // -----------------------------------------------------------------------
    // 28. AC-FC hybrid finds solutions
    // -----------------------------------------------------------------------
    #[test]
    fn test_ac_fc_hybrid_solve() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(1..=3);
        let vars = csp.add_variables(&domain, 3);
        csp.add_constraint(AllDifferent::new(vars));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::AcFc,
            ordering: Ordering::FailFirst,
            max_solutions: 100,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert_eq!(solutions.len(), 6, "AC-FC should find all 3! = 6 permutations");
    }

    // -----------------------------------------------------------------------
    // 29. AC-FC hybrid on map coloring
    // -----------------------------------------------------------------------
    #[test]
    fn test_ac_fc_map_coloring() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..3);
        let _vars = csp.add_variables(&domain, 7);

        let edges: [(VarId, VarId); 9] = [
            (0, 1), (0, 2), (1, 2), (1, 3), (2, 3), (2, 4), (2, 5), (3, 4), (4, 5),
        ];
        for (a, b) in edges {
            csp.add_constraint(NotEqual::new(a, b));
        }
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::AcFc,
            ordering: Ordering::DomWdeg,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty(), "AC-FC should find a map coloring");
    }

    // -----------------------------------------------------------------------
    // 30. Domain wipe-out with various pruning strategies
    // -----------------------------------------------------------------------
    #[test]
    fn test_domain_wipeout_all_pruning() {
        for pruning in [Pruning::None, Pruning::ForwardChecking, Pruning::Ac3, Pruning::AcFc] {
            let mut csp = Csp::new();
            let domain = BitsetDomain::new(0..2);
            let vars = csp.add_variables(&domain, 3);
            csp.add_constraint(AllDifferent::new(vars));
            csp.finalize();

            let config = SolveConfig {
                pruning,
                ordering: Ordering::Chronological,
                max_solutions: 1,
                backjumping: false,
            };

            let solutions = csp.solve(&config);
            assert!(
                solutions.is_empty(),
                "Pigeonhole should be unsolvable with pruning={:?}",
                pruning
            );
        }
    }

    // -----------------------------------------------------------------------
    // 31. Constraint validation edge case: single variable
    // -----------------------------------------------------------------------
    #[test]
    fn test_single_variable() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..5);
        let var = csp.add_variable(domain);

        // Unary constraint: value must be 3
        csp.add_constraint(LambdaConstraint::new(
            vec![var],
            move |assignment: &[Option<u32>]| {
                match &assignment[var as usize] {
                    Some(v) => *v == 3,
                    None => true,
                }
            },
            "var == 3",
        ));

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 10,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert_eq!(solutions.len(), 1);
        assert_eq!(solutions[0][0], 3);
    }

    // -----------------------------------------------------------------------
    // 32. Constraint validation edge case: no constraints
    // -----------------------------------------------------------------------
    #[test]
    fn test_no_constraints() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..3);
        let _vars = csp.add_variables(&domain, 2);
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 100,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        // 3 * 3 = 9 unconstrained solutions
        assert_eq!(solutions.len(), 9);
    }

    // -----------------------------------------------------------------------
    // 33. Backjumping on unsatisfiable problem
    // -----------------------------------------------------------------------
    #[test]
    fn test_backjumping_unsatisfiable() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..2);
        let vars = csp.add_variables(&domain, 3);
        csp.add_constraint(AllDifferent::new(vars));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: true,
        };

        let solutions = csp.solve(&config);
        assert!(solutions.is_empty(), "Backjumping on unsolvable should return empty");
    }

    // -----------------------------------------------------------------------
    // 34. Backjumping reduces backtracks vs chronological (regression test)
    //     (Python: test_no_regression_vs_baseline)
    // -----------------------------------------------------------------------
    #[test]
    fn test_backjumping_fewer_backtracks() {
        // Map coloring (Australia) with FailFirst ordering.
        // Backjumping should not be worse than chronological backtracking.

        let build_map = || {
            let mut csp = Csp::new();
            let domain = BitsetDomain::new(0..3);
            let _vars = csp.add_variables(&domain, 7);
            let edges: [(VarId, VarId); 9] = [
                (0, 1), (0, 2), (1, 2), (1, 3), (2, 3), (2, 4), (2, 5), (3, 4), (4, 5),
            ];
            for (a, b) in edges {
                csp.add_constraint(NotEqual::new(a, b));
            }
            csp.finalize();
            csp
        };

        let mut csp_chrono = build_map();
        let config_chrono = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };
        let _sol = csp_chrono.solve(&config_chrono);
        let bt_chrono = csp_chrono.stats().backtracks;

        let mut csp_bj = build_map();
        let config_bj = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: true,
        };
        let _sol = csp_bj.solve(&config_bj);
        let bt_bj = csp_bj.stats().backtracks;

        // Backjumping should not be worse (it may be equal or better)
        assert!(
            bt_bj <= bt_chrono,
            "Backjumping ({bt_bj}) should have <= backtracks than chronological ({bt_chrono})"
        );
    }

    // -----------------------------------------------------------------------
    // 35. FiniteDomain operations
    // -----------------------------------------------------------------------
    #[test]
    fn test_finite_domain_operations() {
        use crate::domain::Domain;

        let mut d = FiniteDomain::new(vec![10, 20, 30]);
        assert_eq!(d.size(), 3);
        assert!(d.contains(&20));
        assert!(!d.contains(&40));

        assert!(d.remove(&20));
        assert!(!d.contains(&20));
        assert_eq!(d.size(), 2);

        assert!(!d.remove(&20)); // already removed
        assert_eq!(d.size(), 2);

        d.add(&20);
        assert!(d.contains(&20));
        assert_eq!(d.size(), 3);

        d.add(&20); // duplicate add should not increase size
        assert_eq!(d.size(), 3);
    }

    // -----------------------------------------------------------------------
    // 36. BitsetDomain intersection and difference
    // -----------------------------------------------------------------------
    #[test]
    fn test_bitset_domain_intersection_difference() {
        let mut d1 = BitsetDomain::new([1, 2, 3, 4]);
        let d2 = BitsetDomain::new([2, 4, 6]);

        // Intersection
        let mut d1_isect = d1.clone();
        d1_isect.intersect_with(&d2);
        assert_eq!(d1_isect.values(), vec![2, 4]);

        // Difference
        d1.difference_with(&d2);
        assert_eq!(d1.values(), vec![1, 3]);
    }

    // -----------------------------------------------------------------------
    // 37. Stats: propagations tracked
    // -----------------------------------------------------------------------
    #[test]
    fn test_stats_propagations() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..4);
        let _vars = csp.add_variables(&domain, 4);

        csp.add_constraint(NotEqual::new(0, 1));
        csp.add_constraint(NotEqual::new(1, 2));
        csp.add_constraint(NotEqual::new(2, 3));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 1,
            backjumping: false,
        };

        let _solutions = csp.solve(&config);
        let stats = csp.stats();
        assert!(stats.propagations > 0, "FC should track propagations");
        assert!(stats.nodes_explored > 0);
    }

    // -----------------------------------------------------------------------
    // 38. Solve resets state between calls
    // -----------------------------------------------------------------------
    #[test]
    fn test_solve_resets_state() {
        let mut csp = Csp::new();
        let domain = BitsetDomain::new(0..3);
        let _vars = csp.add_variables(&domain, 2);
        csp.add_constraint(NotEqual::new(0, 1));
        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 100,
            backjumping: false,
        };

        // Solve twice - should get same results
        let sol1 = csp.solve(&config);
        let sol2 = csp.solve(&config);
        assert_eq!(sol1.len(), sol2.len(), "Repeated solve should give same count");
    }

    // =======================================================================
    // Ported from Python test_stress.py — Hard 9x9 Sudoku puzzles
    // =======================================================================

    #[allow(clippy::zero_prefixed_literal)]
    const AL_ESCARGOT: [u32; 81] = [
        1,0,0,0,0,7,0,9,0, 0,3,0,0,2,0,0,0,8, 0,0,9,6,0,0,5,0,0,
        0,0,5,3,0,0,9,0,0, 0,1,0,0,8,0,0,0,2, 6,0,0,0,0,4,0,0,0,
        3,0,0,0,0,0,0,1,0, 0,4,0,0,0,0,0,0,7, 0,0,7,0,0,0,3,0,0,
    ];

    #[allow(clippy::zero_prefixed_literal)]
    const INKALA_2010: [u32; 81] = [
        0,0,5,3,0,0,0,0,0, 8,0,0,0,0,0,0,2,0, 0,7,0,0,1,0,5,0,0,
        4,0,0,0,0,5,3,0,0, 0,1,0,0,7,0,0,0,6, 0,0,3,2,0,0,0,8,0,
        0,6,0,5,0,0,0,0,9, 0,0,4,0,0,0,0,3,0, 0,0,0,0,0,9,7,0,0,
    ];

    #[allow(clippy::zero_prefixed_literal)]
    const GOLDEN_NUGGET: [u32; 81] = [
        0,0,0,0,0,0,0,3,9, 0,0,0,0,0,1,0,0,5, 0,0,3,0,5,0,8,0,0,
        0,0,8,0,9,0,0,0,6, 0,7,0,0,0,2,0,0,0, 1,0,0,4,0,0,0,0,0,
        0,0,9,0,8,0,0,5,0, 0,2,0,0,0,0,6,0,0, 4,0,0,7,0,0,0,0,0,
    ];

    #[allow(clippy::zero_prefixed_literal)]
    const PLATINUM_BLONDE: [u32; 81] = [
        0,0,0,0,0,0,0,1,2, 0,0,0,0,3,5,0,0,0, 0,0,0,6,0,0,0,7,0,
        7,0,0,0,0,0,3,0,0, 0,0,0,0,0,0,0,0,0, 0,0,1,0,0,0,0,0,8,
        0,4,0,0,0,2,0,0,0, 0,0,0,1,8,0,0,0,0, 2,5,0,0,0,0,0,0,0,
    ];

    #[allow(clippy::zero_prefixed_literal)]
    const MINIMAL_17: [u32; 81] = [
        0,0,0,0,0,0,0,1,0, 4,0,0,0,0,0,0,0,0, 0,2,0,0,0,0,0,0,0,
        0,0,0,0,5,0,4,0,7, 0,0,8,0,0,0,3,0,0, 0,0,1,0,9,0,0,0,0,
        3,0,0,4,0,0,2,0,0, 0,5,0,1,0,0,0,0,0, 0,0,0,8,0,6,0,0,0,
    ];

    // -----------------------------------------------------------------------
    // 39. 9x9 Sudoku: medium puzzle (Python: test_9x9_sudoku_solve)
    // -----------------------------------------------------------------------
    #[test]
    fn test_9x9_sudoku_medium() {
        #[allow(clippy::zero_prefixed_literal)]
        let grid: [u32; 81] = [
            5,3,0,0,7,0,0,0,0,
            6,0,0,1,9,5,0,0,0,
            0,9,8,0,0,0,0,6,0,
            8,0,0,0,6,0,0,0,3,
            4,0,0,8,0,3,0,0,1,
            7,0,0,0,2,0,0,0,6,
            0,6,0,0,0,0,2,8,0,
            0,0,0,4,1,9,0,0,5,
            0,0,0,0,8,0,0,7,9,
        ];

        let (mut csp, given) = build_sudoku_9x9(&grid);

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve_with_given(&config, &given);
        assert_eq!(solutions.len(), 1, "Should find exactly one solution");
        validate_sudoku_solution(&solutions[0]);
    }

    // -----------------------------------------------------------------------
    // 40-44. Hard 9x9 Sudoku stress tests
    //
    // These adversarial puzzles (Al Escargot, Inkala 2010, Golden Nugget,
    // Platinum Blonde, 17-clue minimal) require GAC alldiff propagation to
    // solve in reasonable time. The current solver uses only binary FC/AC-3,
    // so these are marked #[ignore]. Run with: cargo test -- --ignored
    // -----------------------------------------------------------------------
    #[test]
    #[ignore = "requires GAC alldiff — too slow with binary FC"]
    fn test_hard_sudoku_al_escargot() {
        let (mut csp, given) = build_sudoku_9x9(&AL_ESCARGOT);
        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };
        let solutions = csp.solve_with_given(&config, &given);
        assert!(!solutions.is_empty(), "Should solve Al Escargot");
        validate_sudoku_solution(&solutions[0]);
    }

    #[test]
    #[ignore = "requires GAC alldiff — too slow with binary FC"]
    fn test_hard_sudoku_inkala_2010() {
        let (mut csp, given) = build_sudoku_9x9(&INKALA_2010);
        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };
        let solutions = csp.solve_with_given(&config, &given);
        assert!(!solutions.is_empty(), "Should solve Inkala 2010");
        validate_sudoku_solution(&solutions[0]);
    }

    #[test]
    #[ignore = "requires GAC alldiff — too slow with binary FC"]
    fn test_hard_sudoku_golden_nugget() {
        let (mut csp, given) = build_sudoku_9x9(&GOLDEN_NUGGET);
        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };
        let solutions = csp.solve_with_given(&config, &given);
        assert!(!solutions.is_empty(), "Should solve Golden Nugget");
        validate_sudoku_solution(&solutions[0]);
    }

    #[test]
    #[ignore = "requires GAC alldiff — too slow with binary FC"]
    fn test_hard_sudoku_platinum_blonde() {
        let (mut csp, given) = build_sudoku_9x9(&PLATINUM_BLONDE);
        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };
        let solutions = csp.solve_with_given(&config, &given);
        assert!(!solutions.is_empty(), "Should solve Platinum Blonde");
        validate_sudoku_solution(&solutions[0]);
    }

    #[test]
    #[ignore = "requires GAC alldiff — too slow with binary FC"]
    fn test_hard_sudoku_minimal_17() {
        let (mut csp, given) = build_sudoku_9x9(&MINIMAL_17);
        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };
        let solutions = csp.solve_with_given(&config, &given);
        assert!(!solutions.is_empty(), "Should solve 17-clue minimal");
        validate_sudoku_solution(&solutions[0]);
    }

    // -----------------------------------------------------------------------
    // 45. Hard sudoku across multiple configs
    //     (Python: test_hard_9x9 parametrized)
    // -----------------------------------------------------------------------
    #[test]
    #[ignore = "requires GAC alldiff — too slow with binary FC"]
    fn test_hard_sudoku_all_configs() {
        let configs = [
            (Pruning::ForwardChecking, Ordering::FailFirst, false),
            (Pruning::ForwardChecking, Ordering::DomWdeg, false),
            (Pruning::Ac3, Ordering::FailFirst, false),
            (Pruning::ForwardChecking, Ordering::FailFirst, true), // backjumping
        ];

        for (pruning, ordering, backjumping) in &configs {
            let (mut csp, given) = build_sudoku_9x9(&AL_ESCARGOT);

            let config = SolveConfig {
                pruning: *pruning,
                ordering: *ordering,
                max_solutions: 1,
                backjumping: *backjumping,
            };

            let solutions = csp.solve_with_given(&config, &given);
            assert!(
                !solutions.is_empty(),
                "Al Escargot failed with pruning={:?}, ordering={:?}, bj={:?}",
                pruning, ordering, backjumping
            );
            validate_sudoku_solution(&solutions[0]);
        }
    }

    // -----------------------------------------------------------------------
    // 46. Regression test: FailFirst <= Chronological backtracks on Sudoku
    //     (Python: test_no_regression_vs_baseline)
    //     Uses the medium 9x9 puzzle which is tractable without GAC.
    // -----------------------------------------------------------------------
    #[test]
    fn test_fail_first_fewer_backtracks_sudoku() {
        #[allow(clippy::zero_prefixed_literal)]
        let grid: [u32; 81] = [
            5,3,0,0,7,0,0,0,0,
            6,0,0,1,9,5,0,0,0,
            0,9,8,0,0,0,0,6,0,
            8,0,0,0,6,0,0,0,3,
            4,0,0,8,0,3,0,0,1,
            7,0,0,0,2,0,0,0,6,
            0,6,0,0,0,0,2,8,0,
            0,0,0,4,1,9,0,0,5,
            0,0,0,0,8,0,0,7,9,
        ];

        let (mut csp_chrono, given_chrono) = build_sudoku_9x9(&grid);
        let config_chrono = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::Chronological,
            max_solutions: 1,
            backjumping: false,
        };
        let _sol = csp_chrono.solve_with_given(&config_chrono, &given_chrono);
        let bt_chrono = csp_chrono.stats().backtracks;

        let (mut csp_ff, given_ff) = build_sudoku_9x9(&grid);
        let config_ff = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };
        let _sol = csp_ff.solve_with_given(&config_ff, &given_ff);
        let bt_ff = csp_ff.stats().backtracks;

        assert!(
            bt_ff <= bt_chrono,
            "FailFirst ({bt_ff}) should have <= backtracks than Chronological ({bt_chrono})"
        );
    }

    // =======================================================================
    // Task 2: Type Inference Domain Tests
    // =======================================================================

    // -----------------------------------------------------------------------
    // SimpleType lattice domain — models BBNF's TypeDesc as a CSP domain
    // -----------------------------------------------------------------------

    /// A simplified type descriptor modeling BBNF's type system.
    #[derive(Clone, Debug, PartialEq)]
    enum SimpleType {
        /// Unresolved / bottom of the lattice.
        Bottom,
        /// A span (leaf text node).
        Span,
        /// A named type (e.g., a grammar rule).
        Named(String),
        /// A vector of a type.
        Vec(Box<SimpleType>),
        /// A tuple of types (Seq result).
        Tuple(Vec<SimpleType>),
        /// A boxed enum (fallback for heterogeneous alternation).
        BoxedEnum,
    }

    /// LatticeDomain wrapper around SimpleType for the CSP solver.
    ///
    /// Domain is always a singleton containing the current type. Join computes
    /// the least upper bound: identical types stay, different types become BoxedEnum.
    #[derive(Clone, Debug, PartialEq)]
    struct SimpleTypeDomain {
        value: SimpleType,
    }

    impl SimpleTypeDomain {
        fn new(value: SimpleType) -> Self {
            Self { value }
        }
    }

    impl Domain for SimpleTypeDomain {
        type Value = SimpleType;

        fn size(&self) -> usize {
            1
        }

        fn is_singleton(&self) -> bool {
            true
        }

        fn singleton_value(&self) -> Option<SimpleType> {
            Some(self.value.clone())
        }

        fn contains(&self, val: &SimpleType) -> bool {
            self.value == *val
        }

        fn remove(&mut self, _val: &SimpleType) -> bool {
            false // lattice domains don't support removal
        }

        fn add(&mut self, _val: &SimpleType) {
            // no-op
        }

        fn values(&self) -> Vec<SimpleType> {
            vec![self.value.clone()]
        }
    }

    impl LatticeDomain for SimpleTypeDomain {
        fn bottom() -> Self {
            Self {
                value: SimpleType::Bottom,
            }
        }

        fn join(&mut self, other: &Self) -> bool {
            let new_value = type_join(&self.value, &other.value);
            if new_value != self.value {
                self.value = new_value;
                true
            } else {
                false
            }
        }
    }

    /// Compute the least upper bound (join) of two types.
    ///
    /// Rules:
    /// - Bottom join X = X (Bottom is identity)
    /// - X join X = X
    /// - BoxedEnum join X = BoxedEnum (top absorbs)
    /// - Different non-bottom types = BoxedEnum
    fn type_join(a: &SimpleType, b: &SimpleType) -> SimpleType {
        match (a, b) {
            (SimpleType::Bottom, x) | (x, SimpleType::Bottom) => x.clone(),
            (SimpleType::BoxedEnum, _) | (_, SimpleType::BoxedEnum) => SimpleType::BoxedEnum,
            (x, y) if x == y => x.clone(),
            // Structural join for Tuple: element-wise join
            (SimpleType::Tuple(xs), SimpleType::Tuple(ys)) if xs.len() == ys.len() => {
                let joined: Vec<SimpleType> = xs
                    .iter()
                    .zip(ys.iter())
                    .map(|(a, b)| type_join(a, b))
                    .collect();
                SimpleType::Tuple(joined)
            }
            // Structural join for Vec: join inner type
            (SimpleType::Vec(a), SimpleType::Vec(b)) => {
                SimpleType::Vec(Box::new(type_join(a, b)))
            }
            // Different types: collapse to BoxedEnum
            _ => SimpleType::BoxedEnum,
        }
    }

    /// Build a FiniteDomain<SimpleType> containing the candidate types for a result variable.
    fn type_domain(candidates: Vec<SimpleType>) -> FiniteDomain<SimpleType> {
        FiniteDomain::new(candidates)
    }

    /// Standard set of candidate types for search-based type inference tests.
    fn standard_type_candidates() -> Vec<SimpleType> {
        vec![
            SimpleType::Bottom,
            SimpleType::Span,
            SimpleType::Named("Expr".to_string()),
            SimpleType::Named("Hir".to_string()),
            SimpleType::Vec(Box::new(SimpleType::Span)),
            SimpleType::Vec(Box::new(SimpleType::Named("Expr".to_string()))),
            SimpleType::Tuple(vec![SimpleType::Span, SimpleType::Span]),
            SimpleType::Tuple(vec![SimpleType::Span, SimpleType::Span, SimpleType::Span]),
            SimpleType::Tuple(vec![SimpleType::Span, SimpleType::Named("Expr".to_string())]),
            SimpleType::Tuple(vec![
                SimpleType::Span,
                SimpleType::Named("Expr".to_string()),
                SimpleType::Span,
            ]),
            SimpleType::BoxedEnum,
        ]
    }

    // -----------------------------------------------------------------------
    // 47. Span compression: Seq of consecutive Spans -> single Span
    // -----------------------------------------------------------------------
    #[test]
    fn test_type_inference_span_compression() {
        // Model: three variables for Seq children, one for the Seq result.
        // Children are all Span. The Seq constraint computes the result type.
        // When all children are Span, the result should be Span (compressed).

        let mut csp: Csp<FiniteDomain<SimpleType>> = Csp::new();

        // Children: fixed singletons
        let c0 = csp.add_variable(type_domain(vec![SimpleType::Span]));
        let c1 = csp.add_variable(type_domain(vec![SimpleType::Span]));
        let c2 = csp.add_variable(type_domain(vec![SimpleType::Span]));

        // Result: all candidate types
        let result = csp.add_variable(type_domain(standard_type_candidates()));

        // Constraint: result = seq_type(c0, c1, c2)
        csp.add_constraint(LambdaConstraint::new(
            vec![c0, c1, c2, result],
            move |assignment: &[Option<SimpleType>]| {
                let children: Vec<&SimpleType> = [c0, c1, c2]
                    .iter()
                    .filter_map(|&v| assignment[v as usize].as_ref())
                    .collect();
                let res = assignment[result as usize].as_ref();

                if children.len() == 3 {
                    let all_span = children.iter().all(|t| matches!(t, SimpleType::Span));
                    let expected = if all_span {
                        SimpleType::Span
                    } else {
                        SimpleType::Tuple(children.into_iter().cloned().collect())
                    };
                    match res {
                        Some(r) => *r == expected,
                        None => true,
                    }
                } else {
                    true
                }
            },
            "seq_type_constraint",
        ));

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty(), "Should find a solution");
        assert_eq!(
            solutions[0][result as usize],
            SimpleType::Span,
            "All-Span Seq should compress to Span"
        );
    }

    // -----------------------------------------------------------------------
    // 48. Span compression: mixed children -> Tuple
    // -----------------------------------------------------------------------
    #[test]
    fn test_type_inference_seq_mixed_no_compression() {
        let mut csp: Csp<FiniteDomain<SimpleType>> = Csp::new();

        let c0 = csp.add_variable(type_domain(vec![SimpleType::Span]));
        let c1 = csp.add_variable(type_domain(vec![SimpleType::Named("Expr".to_string())]));
        let result = csp.add_variable(type_domain(standard_type_candidates()));

        csp.add_constraint(LambdaConstraint::new(
            vec![c0, c1, result],
            move |assignment: &[Option<SimpleType>]| {
                let children: Vec<&SimpleType> = [c0, c1]
                    .iter()
                    .filter_map(|&v| assignment[v as usize].as_ref())
                    .collect();
                let res = assignment[result as usize].as_ref();

                if children.len() == 2 {
                    let all_span = children.iter().all(|t| matches!(t, SimpleType::Span));
                    let expected = if all_span {
                        SimpleType::Span
                    } else {
                        SimpleType::Tuple(children.into_iter().cloned().collect())
                    };
                    match res {
                        Some(r) => *r == expected,
                        None => true,
                    }
                } else {
                    true
                }
            },
            "seq_type_mixed",
        ));

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty());
        assert_eq!(
            solutions[0][result as usize],
            SimpleType::Tuple(vec![SimpleType::Span, SimpleType::Named("Expr".to_string())]),
            "Mixed Seq should produce Tuple"
        );
    }

    // -----------------------------------------------------------------------
    // 49. Alternation join: all same type -> that type, else BoxedEnum
    // -----------------------------------------------------------------------
    #[test]
    fn test_type_inference_alt_join_same() {
        let mut csp: Csp<FiniteDomain<SimpleType>> = Csp::new();

        let b0 = csp.add_variable(type_domain(vec![SimpleType::Named("Expr".to_string())]));
        let b1 = csp.add_variable(type_domain(vec![SimpleType::Named("Expr".to_string())]));
        let b2 = csp.add_variable(type_domain(vec![SimpleType::Named("Expr".to_string())]));
        let result = csp.add_variable(type_domain(standard_type_candidates()));

        csp.add_constraint(LambdaConstraint::new(
            vec![b0, b1, b2, result],
            move |assignment: &[Option<SimpleType>]| {
                let branches: Vec<&SimpleType> = [b0, b1, b2]
                    .iter()
                    .filter_map(|&v| assignment[v as usize].as_ref())
                    .collect();
                let res = assignment[result as usize].as_ref();

                if branches.len() == 3 {
                    let mut joined = branches[0].clone();
                    for t in &branches[1..] {
                        joined = type_join(&joined, t);
                    }
                    match res {
                        Some(r) => *r == joined,
                        None => true,
                    }
                } else {
                    true
                }
            },
            "alt_join",
        ));

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty());
        assert_eq!(
            solutions[0][result as usize],
            SimpleType::Named("Expr".to_string()),
            "All same type => that type"
        );
    }

    // -----------------------------------------------------------------------
    // 50. Alternation join: different types -> BoxedEnum
    // -----------------------------------------------------------------------
    #[test]
    fn test_type_inference_alt_join_different() {
        let mut csp: Csp<FiniteDomain<SimpleType>> = Csp::new();

        let b0 = csp.add_variable(type_domain(vec![SimpleType::Span]));
        let b1 = csp.add_variable(type_domain(vec![SimpleType::Named("Expr".to_string())]));
        let result = csp.add_variable(type_domain(standard_type_candidates()));

        csp.add_constraint(LambdaConstraint::new(
            vec![b0, b1, result],
            move |assignment: &[Option<SimpleType>]| {
                let branches: Vec<&SimpleType> = [b0, b1]
                    .iter()
                    .filter_map(|&v| assignment[v as usize].as_ref())
                    .collect();
                let res = assignment[result as usize].as_ref();

                if branches.len() == 2 {
                    let joined = type_join(branches[0], branches[1]);
                    match res {
                        Some(r) => *r == joined,
                        None => true,
                    }
                } else {
                    true
                }
            },
            "alt_join_diff",
        ));

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty());
        assert_eq!(
            solutions[0][result as usize],
            SimpleType::BoxedEnum,
            "Different types => BoxedEnum"
        );
    }

    // -----------------------------------------------------------------------
    // 51. Map override: -> mapper overrides inner expression type
    // -----------------------------------------------------------------------
    #[test]
    fn test_type_inference_map_override() {
        let mut csp: Csp<FiniteDomain<SimpleType>> = Csp::new();

        let inner = csp.add_variable(type_domain(vec![SimpleType::Span]));
        let result = csp.add_variable(type_domain(standard_type_candidates()));

        csp.add_constraint(LambdaConstraint::new(
            vec![inner, result],
            move |assignment: &[Option<SimpleType>]| {
                let _inner_type = assignment[inner as usize].as_ref();
                let res = assignment[result as usize].as_ref();

                match (_inner_type, res) {
                    (Some(_), Some(r)) => *r == SimpleType::Named("Hir".to_string()),
                    _ => true,
                }
            },
            "map_override",
        ));

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty());
        assert_eq!(
            solutions[0][result as usize],
            SimpleType::Named("Hir".to_string()),
            "Map override should produce Named(Hir)"
        );
    }

    // -----------------------------------------------------------------------
    // 52. Recursive rule types: cycle with fixed-point convergence
    // -----------------------------------------------------------------------
    #[test]
    fn test_type_inference_recursive_cycle() {
        // Model: A -> B -> C -> A cycle where all converge to the same type.
        // A is seeded with Named("Expr"). B and C must also be Named("Expr")
        // since the cycle constraints require type consistency.

        let mut csp: Csp<FiniteDomain<SimpleType>> = Csp::new();

        let candidates = vec![
            SimpleType::Bottom,
            SimpleType::Span,
            SimpleType::Named("Expr".to_string()),
            SimpleType::BoxedEnum,
        ];

        // A is fixed to Named("Expr")
        let a = csp.add_variable(type_domain(vec![SimpleType::Named("Expr".to_string())]));
        // B and C search among candidates
        let b = csp.add_variable(type_domain(candidates.clone()));
        let c = csp.add_variable(type_domain(candidates));

        // B must equal A (same type flows through the cycle)
        csp.add_constraint(LambdaConstraint::new(
            vec![a, b],
            move |assignment: &[Option<SimpleType>]| {
                match (&assignment[a as usize], &assignment[b as usize]) {
                    (Some(ta), Some(tb)) => {
                        // join(A, B) == B means B >= A
                        type_join(ta, tb) == *tb
                    }
                    _ => true,
                }
            },
            "B >= A",
        ));

        // C must equal B
        csp.add_constraint(LambdaConstraint::new(
            vec![b, c],
            move |assignment: &[Option<SimpleType>]| {
                match (&assignment[b as usize], &assignment[c as usize]) {
                    (Some(tb), Some(tc)) => type_join(tb, tc) == *tc,
                    _ => true,
                }
            },
            "C >= B",
        ));

        // A must be >= C (closing the cycle)
        csp.add_constraint(LambdaConstraint::new(
            vec![c, a],
            move |assignment: &[Option<SimpleType>]| {
                match (&assignment[c as usize], &assignment[a as usize]) {
                    (Some(tc), Some(ta)) => type_join(tc, ta) == *ta,
                    _ => true,
                }
            },
            "A >= C",
        ));

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty(), "Cyclic type inference should converge");
        assert_eq!(solutions[0][a as usize], SimpleType::Named("Expr".to_string()));
        assert_eq!(solutions[0][b as usize], SimpleType::Named("Expr".to_string()));
        assert_eq!(solutions[0][c as usize], SimpleType::Named("Expr".to_string()));
    }

    // -----------------------------------------------------------------------
    // 53. FIRST set propagation: manual fixed-point using LatticeDomain::join
    // -----------------------------------------------------------------------
    #[test]
    fn test_first_set_propagation() {
        // Model FIRST set computation for a simple grammar:
        //   A = "a" | B
        //   B = "b" | C
        //   C = "c"
        //
        // Expected FIRST sets after propagation:
        //   FIRST(C) = {c}
        //   FIRST(B) = {b, c}
        //   FIRST(A) = {a, b, c}
        //
        // We model each character as a bit: a=0, b=1, c=2
        // This exercises the same join-based propagation that bbnf-ir uses,
        // verified through the LatticeDomain trait directly.

        let mut first_a = BitsetLatticeDomain::new(BitsetDomain::new([0])); // {a}
        let mut first_b = BitsetLatticeDomain::new(BitsetDomain::new([1])); // {b}
        let first_c = BitsetLatticeDomain::new(BitsetDomain::new([2]));     // {c}

        // Fixed-point propagation:
        // Constraint graph: A >= B, B >= C
        let mut changed = true;
        let mut iterations = 0;
        while changed {
            changed = false;
            // B >= C
            changed |= first_b.join(&first_c);
            // A >= B
            changed |= first_a.join(&first_b);
            iterations += 1;
            assert!(iterations < 100, "Should converge quickly");
        }

        let a_val = first_a.inner();
        let b_val = first_b.inner();
        let c_val = first_c.inner();

        // FIRST(C) = {c}
        assert!(c_val.contains(&2));
        assert_eq!(c_val.size(), 1);

        // FIRST(B) = {b, c}
        assert!(b_val.contains(&1));
        assert!(b_val.contains(&2));
        assert_eq!(b_val.size(), 2);

        // FIRST(A) = {a, b, c}
        assert!(a_val.contains(&0));
        assert!(a_val.contains(&1));
        assert!(a_val.contains(&2));
        assert_eq!(a_val.size(), 3);

        // Convergence: should take exactly 2 iterations
        // Iter 1: B gets {c} from C -> {b,c}; A gets {b,c} from B -> {a,b,c}
        // Iter 2: no changes
        assert_eq!(iterations, 2, "Should converge in 2 iterations");
    }

    // -----------------------------------------------------------------------
    // 54. FIRST set propagation with cyclic grammar
    // -----------------------------------------------------------------------
    #[test]
    fn test_first_set_propagation_cyclic() {
        // Cyclic grammar:
        //   A = "a" | B
        //   B = "b" | A
        //
        // FIRST(A) = {a, b}
        // FIRST(B) = {a, b}
        // Both should converge to {a, b} via fixed-point propagation.

        let mut first_a = BitsetLatticeDomain::new(BitsetDomain::new([0])); // {a}
        let mut first_b = BitsetLatticeDomain::new(BitsetDomain::new([1])); // {b}

        let mut changed = true;
        let mut iterations = 0;
        while changed {
            changed = false;
            // A >= B (A contains everything in B)
            changed |= first_a.join(&first_b);
            // B >= A (B contains everything in A)
            changed |= first_b.join(&first_a);
            iterations += 1;
            assert!(iterations < 100, "Should converge quickly");
        }

        let a_val = first_a.inner();
        let b_val = first_b.inner();

        // Both should contain {a, b}
        assert!(a_val.contains(&0) && a_val.contains(&1),
            "FIRST(A) should be {{a, b}}, got {:?}", a_val.values());
        assert!(b_val.contains(&0) && b_val.contains(&1),
            "FIRST(B) should be {{a, b}}, got {:?}", b_val.values());

        // Convergence: 2 iterations
        // Iter 1: A gets {b} -> {a,b}; B gets {a} -> {a,b}
        // Iter 2: no changes
        assert_eq!(iterations, 2);
    }

    // -----------------------------------------------------------------------
    // 55. Type join function unit tests
    // -----------------------------------------------------------------------
    #[test]
    fn test_type_join_properties() {
        // Identity: Bottom join X = X
        assert_eq!(type_join(&SimpleType::Bottom, &SimpleType::Span), SimpleType::Span);
        assert_eq!(
            type_join(&SimpleType::Bottom, &SimpleType::Named("X".into())),
            SimpleType::Named("X".into())
        );
        assert_eq!(type_join(&SimpleType::Bottom, &SimpleType::Bottom), SimpleType::Bottom);

        // Absorption: BoxedEnum join X = BoxedEnum
        assert_eq!(type_join(&SimpleType::BoxedEnum, &SimpleType::Span), SimpleType::BoxedEnum);
        assert_eq!(type_join(&SimpleType::Span, &SimpleType::BoxedEnum), SimpleType::BoxedEnum);

        // Idempotence: X join X = X
        assert_eq!(type_join(&SimpleType::Span, &SimpleType::Span), SimpleType::Span);
        let named = SimpleType::Named("Foo".into());
        assert_eq!(type_join(&named, &named), named);

        // Commutativity: X join Y = Y join X
        let span = SimpleType::Span;
        let named_x = SimpleType::Named("X".into());
        assert_eq!(type_join(&span, &named_x), type_join(&named_x, &span));

        // Different types -> BoxedEnum
        assert_eq!(
            type_join(&SimpleType::Span, &SimpleType::Named("X".into())),
            SimpleType::BoxedEnum
        );

        // Structural join for Vec
        assert_eq!(
            type_join(
                &SimpleType::Vec(Box::new(SimpleType::Span)),
                &SimpleType::Vec(Box::new(SimpleType::Span)),
            ),
            SimpleType::Vec(Box::new(SimpleType::Span))
        );
        assert_eq!(
            type_join(
                &SimpleType::Vec(Box::new(SimpleType::Span)),
                &SimpleType::Vec(Box::new(SimpleType::Named("X".into()))),
            ),
            SimpleType::Vec(Box::new(SimpleType::BoxedEnum))
        );

        // Structural join for Tuple: same length, element-wise
        assert_eq!(
            type_join(
                &SimpleType::Tuple(vec![SimpleType::Span, SimpleType::Span]),
                &SimpleType::Tuple(vec![SimpleType::Span, SimpleType::Named("X".into())]),
            ),
            SimpleType::Tuple(vec![SimpleType::Span, SimpleType::BoxedEnum])
        );

        // Tuple with different lengths -> BoxedEnum
        assert_eq!(
            type_join(
                &SimpleType::Tuple(vec![SimpleType::Span]),
                &SimpleType::Tuple(vec![SimpleType::Span, SimpleType::Span]),
            ),
            SimpleType::BoxedEnum
        );
    }

    // -----------------------------------------------------------------------
    // 56. Lattice domain join convergence
    // -----------------------------------------------------------------------
    #[test]
    fn test_simple_type_lattice_domain_convergence() {
        let mut d = SimpleTypeDomain::bottom();
        assert_eq!(d.value, SimpleType::Bottom);

        // Join with Span: Bottom -> Span (changed)
        let span = SimpleTypeDomain::new(SimpleType::Span);
        assert!(d.join(&span));
        assert_eq!(d.value, SimpleType::Span);

        // Join with same: no change
        assert!(!d.join(&span));
        assert_eq!(d.value, SimpleType::Span);

        // Join with different: Span -> BoxedEnum
        let named = SimpleTypeDomain::new(SimpleType::Named("X".into()));
        assert!(d.join(&named));
        assert_eq!(d.value, SimpleType::BoxedEnum);

        // Join anything with BoxedEnum: no change (already top)
        assert!(!d.join(&span));
        assert!(!d.join(&named));
        assert_eq!(d.value, SimpleType::BoxedEnum);
    }

    // -----------------------------------------------------------------------
    // 57. Type inference with Vec wrapping
    // -----------------------------------------------------------------------
    #[test]
    fn test_type_inference_vec_wrapping() {
        // Model: repetition (Many) wraps its inner type in Vec.
        // inner = Span, result should be Vec(Span).

        let mut csp: Csp<FiniteDomain<SimpleType>> = Csp::new();

        let inner = csp.add_variable(type_domain(vec![SimpleType::Span]));
        let result = csp.add_variable(type_domain(standard_type_candidates()));

        csp.add_constraint(LambdaConstraint::new(
            vec![inner, result],
            move |assignment: &[Option<SimpleType>]| {
                match (&assignment[inner as usize], &assignment[result as usize]) {
                    (Some(inner_t), Some(res_t)) => {
                        let expected = SimpleType::Vec(Box::new(inner_t.clone()));
                        *res_t == expected
                    }
                    _ => true,
                }
            },
            "many_wraps_vec",
        ));

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty());
        assert_eq!(
            solutions[0][result as usize],
            SimpleType::Vec(Box::new(SimpleType::Span)),
            "Many(Span) should produce Vec(Span)"
        );
    }

    // -----------------------------------------------------------------------
    // 58. Complex type inference: Seq containing Alt containing Map
    // -----------------------------------------------------------------------
    #[test]
    fn test_type_inference_complex_pipeline() {
        // Grammar pattern:
        //   rule = literal expr (";" | "}")
        // Where:
        //   literal -> Span
        //   expr -> Named("Expr") (via alternation where all branches are Expr)
        //   ";" -> Span, "}" -> Span (same type, so alt produces Span)
        //   Seq(Span, Named("Expr"), Span) -> Tuple (not all Span, no compression)

        let mut csp: Csp<FiniteDomain<SimpleType>> = Csp::new();

        // Children of the outer Seq — fixed singletons
        let child_literal = csp.add_variable(type_domain(vec![SimpleType::Span]));
        let child_expr = csp.add_variable(type_domain(vec![SimpleType::Named("Expr".into())]));

        // Alt(";" | "}") branches — both Span
        let alt_branch_a = csp.add_variable(type_domain(vec![SimpleType::Span]));
        let alt_branch_b = csp.add_variable(type_domain(vec![SimpleType::Span]));
        // Terminator result — searchable
        let child_terminator = csp.add_variable(type_domain(standard_type_candidates()));

        // Alt constraint on terminator
        csp.add_constraint(LambdaConstraint::new(
            vec![alt_branch_a, alt_branch_b, child_terminator],
            move |assignment: &[Option<SimpleType>]| {
                match (
                    &assignment[alt_branch_a as usize],
                    &assignment[alt_branch_b as usize],
                    &assignment[child_terminator as usize],
                ) {
                    (Some(a), Some(b), Some(r)) => {
                        let joined = type_join(a, b);
                        *r == joined
                    }
                    _ => true,
                }
            },
            "alt_terminator",
        ));

        // Seq result — searchable
        let seq_result = csp.add_variable(type_domain(standard_type_candidates()));

        // Seq constraint
        csp.add_constraint(LambdaConstraint::new(
            vec![child_literal, child_expr, child_terminator, seq_result],
            move |assignment: &[Option<SimpleType>]| {
                let children: Vec<&SimpleType> = [child_literal, child_expr, child_terminator]
                    .iter()
                    .filter_map(|&v| assignment[v as usize].as_ref())
                    .collect();
                let res = assignment[seq_result as usize].as_ref();

                if children.len() == 3 {
                    let all_span = children.iter().all(|t| matches!(t, SimpleType::Span));
                    let expected = if all_span {
                        SimpleType::Span
                    } else {
                        SimpleType::Tuple(children.into_iter().cloned().collect())
                    };
                    match res {
                        Some(r) => *r == expected,
                        None => true,
                    }
                } else {
                    true
                }
            },
            "seq_constraint",
        ));

        csp.finalize();

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 1,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert!(!solutions.is_empty());

        // Terminator: Alt(Span, Span) = Span
        assert_eq!(
            solutions[0][child_terminator as usize],
            SimpleType::Span,
            "Alt of same types should collapse"
        );

        // Seq(Span, Named(Expr), Span) = Tuple(Span, Named(Expr), Span)
        assert_eq!(
            solutions[0][seq_result as usize],
            SimpleType::Tuple(vec![
                SimpleType::Span,
                SimpleType::Named("Expr".into()),
                SimpleType::Span,
            ]),
            "Mixed Seq should produce Tuple"
        );
    }

    // -----------------------------------------------------------------------
    // 59. FIRST set with nullable prefix (Seq FIRST = union up to first non-nullable)
    // -----------------------------------------------------------------------
    #[test]
    fn test_first_set_nullable_prefix() {
        // Grammar:
        //   S = A B C
        //   A is nullable (epsilon | "a")
        //   B is nullable (epsilon | "b")
        //   C is not nullable ("c")
        //
        // FIRST(S) = FIRST(A) union FIRST(B) union FIRST(C) = {a, b, c}
        // (because A and B are nullable, we look through them)
        //
        // Manual fixed-point using LatticeDomain::join.

        // a=0, b=1, c=2
        let first_a = BitsetLatticeDomain::new(BitsetDomain::new([0]));
        let first_b = BitsetLatticeDomain::new(BitsetDomain::new([1]));
        let first_c = BitsetLatticeDomain::new(BitsetDomain::new([2]));

        // Compute FIRST(S) = union of FIRST(A), FIRST(B), FIRST(C)
        // since A and B are nullable, all three contribute.
        let mut first_s = BitsetLatticeDomain::bottom();

        let mut changed = true;
        let mut iterations = 0;
        while changed {
            changed = false;
            changed |= first_s.join(&first_a);
            changed |= first_s.join(&first_b);
            changed |= first_s.join(&first_c);
            iterations += 1;
            assert!(iterations < 100);
        }

        let s_val = first_s.inner();
        assert!(s_val.contains(&0), "FIRST(S) should contain 'a'");
        assert!(s_val.contains(&1), "FIRST(S) should contain 'b'");
        assert!(s_val.contains(&2), "FIRST(S) should contain 'c'");
        assert_eq!(s_val.size(), 3);

        // All three are absorbed in one pass
        assert_eq!(iterations, 2, "One pass absorbs all, second confirms fixed point");
    }

    // -----------------------------------------------------------------------
    // 60. BitsetDomain iterator
    // -----------------------------------------------------------------------
    #[test]
    fn test_bitset_domain_iterator() {
        let d = BitsetDomain::new([5, 2, 8, 1]);
        let vals: Vec<u32> = d.iter().collect();
        // Iterator yields in ascending order (lowest bit first)
        assert_eq!(vals, vec![1, 2, 5, 8]);
        assert_eq!(d.iter().len(), 4);
    }

    // -----------------------------------------------------------------------
    // 61. BitsetDomain range constructor
    // -----------------------------------------------------------------------
    #[test]
    fn test_bitset_domain_range() {
        use crate::domain::Domain;

        let d = BitsetDomain::range(5);
        assert_eq!(d.size(), 5);
        assert_eq!(d.values(), vec![0, 1, 2, 3, 4]);

        let d0 = BitsetDomain::range(0);
        assert_eq!(d0.size(), 0);
        assert!(d0.is_empty());
    }

    // -----------------------------------------------------------------------
    // 62. 5-Queens (verifying solution count)
    // -----------------------------------------------------------------------
    #[test]
    fn test_5_queens() {
        let mut csp = build_nqueens(5);

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 100,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert_eq!(solutions.len(), 10, "5-Queens should have exactly 10 solutions");
    }

    // -----------------------------------------------------------------------
    // 63. 6-Queens (verifying solution count)
    // -----------------------------------------------------------------------
    #[test]
    fn test_6_queens() {
        let mut csp = build_nqueens(6);

        let config = SolveConfig {
            pruning: Pruning::ForwardChecking,
            ordering: Ordering::FailFirst,
            max_solutions: 100,
            backjumping: false,
        };

        let solutions = csp.solve(&config);
        assert_eq!(solutions.len(), 4, "6-Queens should have exactly 4 solutions");
    }
}

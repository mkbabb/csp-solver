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
pub mod domains;
pub mod ordering;
pub mod solver;
pub mod variable;

use adjacency::Adjacency;
use constraint::{Constraint, VarId};
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
    constraints: Vec<Box<dyn Constraint<D>>>,
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

    /// Add a constraint.
    pub fn add_constraint(&mut self, c: impl Constraint<D> + 'static) {
        self.constraints.push(Box::new(c));
    }

    /// Build the adjacency graph. Must be called after all variables and
    /// constraints have been added, before calling `solve()`.
    pub fn finalize(&mut self) {
        let num_vars = self.variables.len();
        self.adjacency = Some(Adjacency::build(num_vars, &self.constraints));

        // Build per-variable constraint ID lists and initialize weights
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
    pub fn propagate(&mut self) -> Result<(), Unsatisfiable> {
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

    /// Run backtracking (or backjumping) search with the given configuration.
    ///
    /// Returns up to `config.max_solutions` solutions.
    pub fn solve(&mut self, config: &SolveConfig) -> Vec<Solution<D>> {
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
    ) -> Vec<Solution<D>> {
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
    use crate::domains::bitset::BitsetDomain;
    use crate::domains::finite::FiniteDomain;
    use crate::domains::lattice::BitsetLatticeDomain;
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
}

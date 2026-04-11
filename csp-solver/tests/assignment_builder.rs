//! Integration tests for [`csp_solver::AssignmentBuilder`].
//!
//! Each test exercises a single ergonomic shape of the bipartite
//! assignment COP wrapper: trivial diagonal, hard pin overrides,
//! penalty-driven unmatching, role groups, brute-force ground truth,
//! node-budget abort, and the two builder-validation error paths.

use csp_solver::{AssignmentError, SENTINEL, assignment};

// ---------------------------------------------------------------------------
// 1. Trivial 3×3 — eye-shape cost matrix, no groups, optimal is the identity
// ---------------------------------------------------------------------------
#[test]
fn simple_3x3_diagonal() {
    let sol = assignment()
        .rows(3)
        .cols(3)
        .cost(|i, k| if i == k { 0.0 } else { 10.0 })
        .unmatch_penalty(100.0)
        .solve()
        .expect("3x3 identity must be solvable");

    assert_eq!(sol.assign, vec![0, 1, 2]);
    assert_eq!(sol.cost, 0.0);
}

// ---------------------------------------------------------------------------
// 2. A pin overrides what would otherwise be the optimal assignment
// ---------------------------------------------------------------------------
#[test]
fn with_pin_overrides_cost() {
    // Diagonal-best matrix: row 0 → col 0 is the cheapest unconstrained
    // pick. Force row 0 to col 2 with a pin and verify the solver
    // honours it (and re-routes the rest of the assignment around it).
    let sol = assignment()
        .rows(3)
        .cols(3)
        .cost(|i, k| if i == k { 0.0 } else { 10.0 })
        .unmatch_penalty(1_000.0)
        .pin(0, 2)
        .solve()
        .expect("pin must not make a 3x3 problem infeasible");

    assert_eq!(
        sol.assign[0], 2,
        "row 0 must respect the hard pin to col 2"
    );

    // Every column should be visited exactly once (no row falls back
    // to SENTINEL because the unmatch penalty dominates any reroute).
    let mut sorted = sol.assign.clone();
    sorted.sort();
    assert_eq!(sorted, vec![0, 1, 2], "all rows must be matched");
}

// ---------------------------------------------------------------------------
// 3. Unmatch penalty cheaper than every cell — both rows go to SENTINEL
// ---------------------------------------------------------------------------
#[test]
fn unmatch_when_penalty_low() {
    let sol = assignment()
        .rows(2)
        .cols(3)
        .cost(|_, _| 1_000.0)
        .unmatch_penalty(1.0)
        .solve()
        .expect("unmatching must always be feasible");

    assert_eq!(
        sol.assign,
        vec![SENTINEL, SENTINEL],
        "both rows must opt into the cheaper unmatch sentinel"
    );
    assert_eq!(sol.cost, 2.0);
}

// ---------------------------------------------------------------------------
// 4. Role groups: rows in group 0 may only match cols in group 0, etc.
// ---------------------------------------------------------------------------
#[test]
fn role_groups_separate_assignments() {
    // Four rows, four cols, split into two role groups of two each.
    // Costs are uniform, so the search has nothing to optimize beyond
    // group membership — the structural assertion is what we care
    // about.
    let row_groups = [0u8, 0, 1, 1];
    let col_groups = [0u8, 0, 1, 1];

    let sol = assignment()
        .rows(4)
        .cols(4)
        .cost(|_, _| 1.0)
        .row_group(|i| row_groups[i])
        .col_group(|k| col_groups[k])
        .unmatch_penalty(1_000.0)
        .solve()
        .expect("4x4 group-partitioned problem must be solvable");

    for (row, &assigned_col) in sol.assign.iter().enumerate() {
        assert_ne!(
            assigned_col, SENTINEL,
            "row {row} should not unmatch when a same-group column is available"
        );
        let col = assigned_col as usize;
        assert_eq!(
            row_groups[row], col_groups[col],
            "row {row} (group {}) was matched to col {col} (group {})",
            row_groups[row], col_groups[col],
        );
    }

    // Both groups should saturate their two-column capacity.
    let mut sorted = sol.assign.clone();
    sorted.sort();
    assert_eq!(sorted, vec![0, 1, 2, 3]);
}

// ---------------------------------------------------------------------------
// 5. Brute-force ground truth: 5 random 4×4 matrices, deterministic LCG
// ---------------------------------------------------------------------------
#[test]
fn brute_force_match_4x4() {
    const N: usize = 4;
    const TRIALS: usize = 5;

    let mut rng = Lcg::new(0xC0FFEE_u64);

    for trial in 0..TRIALS {
        let matrix: Vec<f64> = (0..N * N).map(|_| rng.next_unit() * 100.0).collect();

        // Brute-force minimum over all N! = 24 permutations.
        let mut perm: Vec<usize> = (0..N).collect();
        let mut best = f64::INFINITY;
        permute(&mut perm, 0, &mut |p| {
            let total: f64 = (0..N).map(|i| matrix[i * N + p[i]]).sum();
            if total < best {
                best = total;
            }
        });

        let sol = assignment()
            .rows(N)
            .cols(N)
            .cost(|i, k| matrix[i * N + k])
            .unmatch_penalty(1e9) // make unmatching prohibitively expensive
            .solve()
            .unwrap_or_else(|e| panic!("trial {trial}: builder failed: {e}"));

        // Costs may differ from `best` only by floating-point noise
        // (rounding from the bound check + summation order). Assert
        // a tight tolerance and bail otherwise.
        let delta = (sol.cost - best).abs();
        assert!(
            delta < 1e-9,
            "trial {trial}: builder cost {} disagrees with brute-force best {} (delta = {delta})",
            sol.cost,
            best,
        );

        // Sanity: every row must be matched (no SENTINEL leakage).
        assert!(
            sol.assign.iter().all(|&v| v != SENTINEL),
            "trial {trial}: rows should match under prohibitive unmatch penalty"
        );
    }
}

// ---------------------------------------------------------------------------
// 6. Node-budget exhaustion: a 6×6 worst-case matrix forced to abort
// ---------------------------------------------------------------------------
#[test]
fn node_budget_exceeded() {
    // Uniform-cost 6×6 forces the solver to explore many equivalent
    // branches before bound-pruning kicks in. With a 5-node budget
    // the search aborts almost immediately. The contract is that the
    // builder either:
    //   (a) returns Ok(sol) with stats.budget_exceeded == true and a
    //       best-so-far assignment, or
    //   (b) returns Err(Infeasible) if the budget aborted before any
    //       complete assignment was scored.
    // Both are valid; we accept either and merely assert the contract.
    let result = assignment()
        .rows(6)
        .cols(6)
        .cost(|_, _| 1.0)
        .unmatch_penalty(2.0)
        .node_budget(Some(5))
        .solve();

    match result {
        Ok(sol) => {
            assert!(
                sol.stats.budget_exceeded,
                "tiny budget must trip budget_exceeded if a solution is returned"
            );
            assert_eq!(sol.assign.len(), 6, "assign length must equal n_rows");
        }
        Err(AssignmentError::Infeasible) => {
            // Acceptable — the budget aborted before any complete
            // assignment was scored. Nothing else to assert.
        }
        Err(other) => panic!("unexpected error from budget-exhausted solve: {other}"),
    }
}

// ---------------------------------------------------------------------------
// 7. Validation: solving without dimensions returns DimensionsNotSet
// ---------------------------------------------------------------------------
#[test]
fn dimensions_not_set_returns_err() {
    let err = assignment()
        .solve()
        .expect_err("a builder with no dimensions cannot solve");
    assert!(matches!(err, AssignmentError::DimensionsNotSet));
}

// ---------------------------------------------------------------------------
// 8. Validation: solving without cost returns CostNotSet
// ---------------------------------------------------------------------------
#[test]
fn cost_not_set_returns_err() {
    let err = assignment()
        .rows(2)
        .cols(2)
        .solve()
        .expect_err("a builder with no cost matrix cannot solve");
    assert!(matches!(err, AssignmentError::CostNotSet));
}

// ===========================================================================
// Helpers
// ===========================================================================

/// Tiny linear-congruential generator. Used in lieu of pulling in
/// `rand` for a single deterministic test fixture; the constants are
/// the standard Numerical Recipes triple.
struct Lcg {
    state: u64,
}

impl Lcg {
    fn new(seed: u64) -> Self {
        Self { state: seed }
    }

    fn next_u64(&mut self) -> u64 {
        // Numerical Recipes constants — adequate for fixture
        // generation, not cryptographic quality.
        self.state = self
            .state
            .wrapping_mul(6364136223846793005)
            .wrapping_add(1442695040888963407);
        self.state
    }

    fn next_unit(&mut self) -> f64 {
        // Top 53 bits → uniform in [0, 1).
        ((self.next_u64() >> 11) as f64) / ((1u64 << 53) as f64)
    }
}

/// Heap's-algorithm-style permutation generator: invokes `f` once per
/// permutation of `perm`.
fn permute<F: FnMut(&[usize])>(perm: &mut Vec<usize>, k: usize, f: &mut F) {
    if k == perm.len() {
        f(perm);
        return;
    }
    for i in k..perm.len() {
        perm.swap(k, i);
        permute(perm, k + 1, f);
        perm.swap(k, i);
    }
}

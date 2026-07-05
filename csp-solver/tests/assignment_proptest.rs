//! Property-based tests for [`csp_solver::AssignmentBuilder`] via proptest.
//!
//! Six properties validate the solver against brute-force enumeration,
//! role-group partitioning, pin constraints, unmatch-penalty monotonicity,
//! and the single-row degenerate case. Each property runs 256 cases with
//! a deterministic seed for reproducibility.

use csp_solver::{SENTINEL, assignment};
use proptest::prelude::*;

// ---------------------------------------------------------------------------
// Brute-force oracle
// ---------------------------------------------------------------------------

/// Read-only problem parameters shared across the brute-force recursion.
/// Bundled into one struct so the recursive helper stays within clippy's
/// argument-count bound (the varying state — `row`, `assign`, `running_cost`,
/// `best` — remains explicit).
struct Problem<'a> {
    costs: &'a [f64],
    rows: usize,
    cols: usize,
    unmatch_penalty: f64,
}

/// Enumerate all valid assignments for an `rows x cols` problem and return
/// the minimum total cost. Each row picks a column or UNMATCHED (SENTINEL).
/// No two rows may share the same non-SENTINEL column.
///
/// For rows R and cols C the search space is (C+1)^R candidates, filtered
/// for validity. At R,C <= 5 this is at most 6^5 = 7776 candidates.
fn bruteforce_min_assignment(costs: &[f64], rows: usize, cols: usize, unmatch_penalty: f64) -> f64 {
    let problem = Problem {
        costs,
        rows,
        cols,
        unmatch_penalty,
    };
    let mut best = f64::INFINITY;
    let mut assign: Vec<Option<usize>> = vec![None; rows];
    bruteforce_recurse(&problem, 0, &mut assign, 0.0, &mut best);
    best
}

fn bruteforce_recurse(
    p: &Problem,
    row: usize,
    assign: &mut Vec<Option<usize>>,
    running_cost: f64,
    best: &mut f64,
) {
    if row == p.rows {
        if running_cost < *best {
            *best = running_cost;
        }
        return;
    }

    // Early pruning: if running cost already >= best, skip.
    if running_cost >= *best {
        return;
    }

    // Option: unmatched (SENTINEL).
    assign[row] = None;
    bruteforce_recurse(p, row + 1, assign, running_cost + p.unmatch_penalty, best);

    // Option: assign to each column not already taken.
    for c in 0..p.cols {
        let taken = (0..row).any(|r| assign[r] == Some(c));
        if taken {
            continue;
        }
        assign[row] = Some(c);
        bruteforce_recurse(
            p,
            row + 1,
            assign,
            running_cost + p.costs[row * p.cols + c],
            best,
        );
    }
    assign[row] = None;
}

// ---------------------------------------------------------------------------
// Strategies
// ---------------------------------------------------------------------------

/// Generate an N x M cost matrix with N in [1, max_n] and M in [1, max_m].
fn cost_matrix_strategy(
    max_n: usize,
    max_m: usize,
) -> impl Strategy<Value = (usize, usize, Vec<f64>)> {
    (1..=max_n, 1..=max_m).prop_flat_map(|(n, m)| {
        proptest::collection::vec(0.0..100.0_f64, n * m).prop_map(move |costs| (n, m, costs))
    })
}

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

proptest! {
    #![proptest_config(ProptestConfig {
        cases: 256,
        // Deterministic seed for reproducibility.
        failure_persistence: None,
        .. ProptestConfig::default()
    })]

    /// Square N x N (N in [1,5]): solver cost matches brute-force minimum
    /// within floating-point tolerance.
    #[test]
    fn prop_square_matches_bruteforce(
        (n, _, costs) in cost_matrix_strategy(5, 5)
            .prop_filter("square only", |(n, m, _)| *n == *m)
    ) {
        let rows = n;
        let cols = n;
        let penalty = 1e9;

        let bf = bruteforce_min_assignment(&costs, rows, cols, penalty);

        let sol = assignment()
            .rows(rows)
            .cols(cols)
            .cost(|i, k| costs[i * cols + k])
            .unmatch_penalty(penalty)
            .solve()
            .expect("square problem must be solvable");

        let delta = (sol.cost - bf).abs();
        prop_assert!(
            delta < 1e-9,
            "solver cost {} differs from brute-force {} by {}",
            sol.cost,
            bf,
            delta,
        );
    }

    /// Rectangular N x M (N,M in [1,4], N != M): solver cost matches
    /// brute-force minimum within floating-point tolerance.
    #[test]
    fn prop_rectangular_matches_bruteforce(
        (rows, cols, costs) in cost_matrix_strategy(4, 4)
            .prop_filter("rectangular only", |(n, m, _)| *n != *m)
    ) {
        let penalty = 1e9;

        let bf = bruteforce_min_assignment(&costs, rows, cols, penalty);

        let sol = assignment()
            .rows(rows)
            .cols(cols)
            .cost(|i, k| costs[i * cols + k])
            .unmatch_penalty(penalty)
            .solve()
            .expect("rectangular problem must be solvable");

        let delta = (sol.cost - bf).abs();
        prop_assert!(
            delta < 1e-9,
            "solver cost {} differs from brute-force {} by {} ({}x{})",
            sol.cost,
            bf,
            delta,
            rows,
            cols,
        );
    }

    /// Role groups: no row is assigned to a column outside its group.
    #[test]
    fn prop_roles_partition(
        (n, _, costs) in cost_matrix_strategy(4, 4)
            .prop_filter("even square", |(n, m, _)| *n == *m && *n >= 2 && *n % 2 == 0),
        split in 1..=3usize
    ) {
        let rows = n;
        let cols = n;
        // Split rows and cols into two groups at the midpoint (clamped).
        let mid = (split.min(rows - 1)).max(1);

        let row_groups: Vec<u8> = (0..rows).map(|i| if i < mid { 0 } else { 1 }).collect();
        let col_groups: Vec<u8> = (0..cols).map(|k| if k < mid { 0 } else { 1 }).collect();

        let sol = assignment()
            .rows(rows)
            .cols(cols)
            .cost(|i, k| costs[i * cols + k])
            .row_group(|i| row_groups[i])
            .col_group(|k| col_groups[k])
            .unmatch_penalty(1e9)
            .solve()
            .expect("grouped problem must be solvable");

        for (row, &assigned_col) in sol.assign.iter().enumerate() {
            if assigned_col != SENTINEL {
                let col = assigned_col as usize;
                prop_assert_eq!(
                    row_groups[row],
                    col_groups[col],
                    "row {} (group {}) assigned to col {} (group {})",
                    row,
                    row_groups[row],
                    col,
                    col_groups[col],
                );
            }
        }
    }

    /// Hard pins are always respected in the solution.
    #[test]
    fn prop_pins_respected(
        (n, _, costs) in cost_matrix_strategy(4, 4)
            .prop_filter("square >= 2", |(n, m, _)| *n == *m && *n >= 2),
        pin_row in 0..4usize,
        pin_col in 0..4usize,
    ) {
        let rows = n;
        let cols = n;
        // Clamp pin indices to actual dimensions.
        let pr = pin_row % rows;
        let pc = pin_col % cols;

        let sol = assignment()
            .rows(rows)
            .cols(cols)
            .cost(|i, k| costs[i * cols + k])
            .unmatch_penalty(1e9)
            .pin(pr, pc as i32)
            .solve()
            .expect("pinned problem must be solvable");

        prop_assert_eq!(
            sol.assign[pr],
            pc as i32,
            "pin ({}, {}) not respected: assign[{}] = {}",
            pr,
            pc,
            pr,
            sol.assign[pr],
        );
    }

    /// Monotonicity: as unmatch_penalty increases, matched count is
    /// non-decreasing.
    #[test]
    fn prop_unmatched_penalty_monotone(
        (rows, cols, costs) in cost_matrix_strategy(4, 4)
    ) {
        let penalties = [0.0, 1.0, 10.0, 100.0, 1e6];
        let mut prev_matched = 0usize;

        for (step, &penalty) in penalties.iter().enumerate() {
            let sol = assignment()
                .rows(rows)
                .cols(cols)
                .cost(|i, k| costs[i * cols + k])
                .unmatch_penalty(penalty)
                .solve()
                .expect("problem must be solvable at any penalty");

            let matched = sol.assign.iter().filter(|&&c| c != SENTINEL).count();

            if step > 0 {
                prop_assert!(
                    matched >= prev_matched,
                    "matched count dropped from {} to {} when penalty rose to {}",
                    prev_matched,
                    matched,
                    penalty,
                );
            }
            prev_matched = matched;
        }
    }

    /// Single-row degenerate case: the solver picks the minimum-cost column.
    #[test]
    fn prop_single_row(
        cols in 1..8usize,
        costs in proptest::collection::vec(0.0..100.0_f64, 1..8),
    ) {
        let cols = cols.min(costs.len());
        let cost_slice = &costs[..cols];

        let sol = assignment()
            .rows(1)
            .cols(cols)
            .cost(|_, k| cost_slice[k])
            .unmatch_penalty(1e9)
            .solve()
            .expect("1xM must be solvable");

        // Find the minimum cost column.
        let (min_col, min_cost) = cost_slice
            .iter()
            .enumerate()
            .min_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap())
            .unwrap();

        prop_assert_eq!(
            sol.assign[0],
            min_col as i32,
            "1x{}: expected col {} (cost {}), got col {} (cost {})",
            cols,
            min_col,
            min_cost,
            sol.assign[0],
            sol.cost,
        );
        let delta = (sol.cost - min_cost).abs();
        prop_assert!(delta < 1e-9, "cost mismatch: {} vs {}", sol.cost, min_cost);
    }
}

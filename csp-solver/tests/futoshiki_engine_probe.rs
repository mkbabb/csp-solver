//! Futoshiki engine-correctness probe (T3-W6, A24 G13).
//!
//! A24 G13: the Futoshiki *solve engine* — the AllDifferent + inequality
//! interaction under the AC-3 trail — was never probed against ground truth.
//! `tests/futoshiki.rs::generated_puzzles_are_unique_and_valid` trusts the solver
//! as its own oracle (it asserts the generator's board solves to one board). This
//! probe supplies the missing INDEPENDENT check:
//!
//!  1. **Brute-force differential.** A hand-built 4×4 board (a Latin square known
//!     by construction, four inner cells blanked) is enumerated two ways — by the
//!     solver (enumerate-all) and by exhaustive 4⁴ candidate filtering against the
//!     Latin + inequality constraints. The solver's solution SET must equal the
//!     brute-force set: no invented, no dropped board.
//!  2. **Config invariance.** The same board solved under the production config
//!     (`Ac3` + `Mrv`) and an independent strategy (`ForwardChecking` +
//!     `FailFirst`) must enumerate the identical set — a solution set is a property
//!     of the CSP, not the search order; divergence means an unsound prune.
//!
//! No global state touched — fully parallel-safe.

use std::collections::BTreeSet;

use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::{FutoshikiPuzzle, create_futoshiki_csp};
use csp_solver::{Pruning, SolveConfig};

const N: u32 = 4;
const NN: usize = 16;

// A known-valid 4×4 Latin square (rows, columns each a permutation of 1..=4):
//   1 2 3 4
//   2 1 4 3
//   3 4 1 2
//   4 3 2 1
const SOLUTION: [u32; NN] = [1, 2, 3, 4, 2, 1, 4, 3, 3, 4, 1, 2, 4, 3, 2, 1];

// The four blanked (free) cells — an inner 2×2 block. Everything else is a given.
const FREE: [usize; 4] = [5, 6, 9, 10];

// Inequalities (cell_a > cell_b), each orthogonally adjacent and satisfied by
// SOLUTION — verified against the grid above.
const INEQUALITIES: [(usize, usize); 6] = [
    (1, 0),  // 2 > 1  (row 0)
    (3, 2),  // 4 > 3  (row 0)
    (4, 0),  // 2 > 1  (col 0)
    (12, 8), // 4 > 3  (col 0)
    (4, 5),  // 2 > 1  (row 1)
    (6, 7),  // 4 > 3  (row 1)
];

fn givens() -> Vec<(usize, u32)> {
    (0..NN)
        .filter(|i| !FREE.contains(i))
        .map(|i| (i, SOLUTION[i]))
        .collect()
}

fn puzzle() -> FutoshikiPuzzle {
    FutoshikiPuzzle::from_parts(N, givens(), INEQUALITIES.to_vec())
        .expect("hand-built board must pass from_parts validation")
}

fn solve_all(pruning: Pruning, ordering: Ordering) -> BTreeSet<Vec<u32>> {
    let mut csp = create_futoshiki_csp(&puzzle());
    let config = SolveConfig {
        pruning,
        ordering,
        max_solutions: usize::MAX,
        ..Default::default()
    };
    csp.solve(&config).into_iter().collect()
}

/// Reference oracle: every full grid consistent with the givens, a Latin square,
/// and every inequality — computed by exhaustive filtering, no solver.
fn brute_force() -> BTreeSet<Vec<u32>> {
    let fixed = givens();
    let mut out = BTreeSet::new();
    // 4⁴ candidate fills of the four free cells.
    for combo in 0..4u32.pow(FREE.len() as u32) {
        let mut grid = [0u32; NN];
        for &(i, v) in &fixed {
            grid[i] = v;
        }
        for (k, &cell) in FREE.iter().enumerate() {
            grid[cell] = 1 + (combo / 4u32.pow(k as u32)) % 4;
        }
        if is_valid(&grid) {
            out.insert(grid.to_vec());
        }
    }
    out
}

fn is_valid(grid: &[u32; NN]) -> bool {
    let n = N as usize;
    // Rows + columns each all-different (a Latin square over 1..=4).
    for i in 0..n {
        let mut row = BTreeSet::new();
        let mut col = BTreeSet::new();
        for j in 0..n {
            if !row.insert(grid[i * n + j]) || !col.insert(grid[j * n + i]) {
                return false;
            }
        }
    }
    // Inequalities.
    INEQUALITIES.iter().all(|&(a, b)| grid[a] > grid[b])
}

#[test]
fn solver_matches_bruteforce_oracle() {
    let oracle = brute_force();
    assert!(
        oracle.contains(SOLUTION.as_slice()),
        "the known Latin square must itself be a valid oracle solution — test data is wrong"
    );

    let solver = solve_all(Pruning::Ac3, Ordering::Mrv);
    assert_eq!(
        solver, oracle,
        "Futoshiki solve engine diverged from the brute-force oracle (invented or dropped a board)"
    );
}

#[test]
fn solution_set_is_config_invariant() {
    let production = solve_all(Pruning::Ac3, Ordering::Mrv);
    let alternate = solve_all(Pruning::ForwardChecking, Ordering::FailFirst);
    assert_eq!(
        production, alternate,
        "Futoshiki solution set changed with the search strategy — an unsound prune"
    );
    assert!(
        !production.is_empty(),
        "the board must have at least one solution"
    );
}

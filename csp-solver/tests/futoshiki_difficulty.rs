//! Futoshiki difficulty-axis truth (T4-W6 ROW 1, GEN-2).
//!
//! The axis is a keep-density + inequality-density ladder wired through the
//! already-existing [`generate_futoshiki_tuned_seeded`]: givens fall and carets
//! rise together Easy→Hard, so a Hard deal is a genuine inequality-driven puzzle
//! rather than a near-full Latin square. These are the wave's born-RED gates —
//! before the axis existed the `Difficulty` type and
//! `generate_futoshiki_difficulty_seeded` were unresolved symbols and this file
//! did not compile (there was "no `Difficulty` type at any layer"). After: three
//! distinct givens-tiers, seeded-deterministic, each unique.
//!
//! [`generate_futoshiki_tuned_seeded`]:
//! csp_solver::puzzles::futoshiki::generate_futoshiki_tuned_seeded

use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::{
    Difficulty, create_futoshiki_csp, generate_futoshiki_difficulty_seeded, validate_futoshiki,
};
use csp_solver::{Pruning, SolveConfig};

/// The canonical futoshiki size from the r2 density sweep (a 25-cell board).
const N: u32 = 5;

/// Every tier, in the order the ladder promises (givens descending).
const TIERS: [Difficulty; 3] = [Difficulty::Easy, Difficulty::Medium, Difficulty::Hard];

/// Count the non-blank (given) cells of a dense board.
fn given_count(board: &[u32]) -> usize {
    board.iter().filter(|&&v| v != 0).count()
}

/// Solve with a uniqueness-probing config (`Ac3` + `FailFirst`, up to 2
/// solutions) — enough to distinguish "unique" from "ambiguous".
fn solve_up_to_two(board: &[u32], inequalities: &[(usize, usize)]) -> Vec<Vec<u32>> {
    let (mut csp, given) = create_futoshiki_csp(board, N, inequalities);
    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions: 2,
        ..Default::default()
    };
    csp.solve_with_given(&config, &given)
}

/// Same `(n, difficulty, seed)` ⇒ byte-identical board + inequality set. This
/// determinism is the invariant the native↔wasm parity harness exploits for a
/// bit-exact cross-target check of the new axis.
#[test]
fn axis_is_seeded_deterministic() {
    for &d in &TIERS {
        for seed in [1u64, 42, 12345, 0xBEEF] {
            let a = generate_futoshiki_difficulty_seeded(N, d, seed);
            let b = generate_futoshiki_difficulty_seeded(N, d, seed);
            assert_eq!(
                a, b,
                "n={N} {d:?} seed={seed}: same seed+difficulty must deal the same puzzle"
            );
        }
    }
}

/// The ladder the dropdown promises: givens fall **strictly** Easy→Medium→Hard
/// on every seed. This is the born-RED heart of the gate — today futoshiki has a
/// single frozen `KEEP_DENSITY = 0.75` tier (19 givens on a 5×5, every deal),
/// so no such ordering exists.
#[test]
fn givens_strictly_decrease_easy_to_hard() {
    for seed in [1u64, 2, 3, 7, 42, 99, 12345, 0xF00D] {
        let e = given_count(&generate_futoshiki_difficulty_seeded(N, Difficulty::Easy, seed).0);
        let m = given_count(&generate_futoshiki_difficulty_seeded(N, Difficulty::Medium, seed).0);
        let h = given_count(&generate_futoshiki_difficulty_seeded(N, Difficulty::Hard, seed).0);
        assert!(
            e > m && m > h,
            "seed={seed}: givens must strictly decrease Easy→Hard, got E={e} M={m} H={h}"
        );
    }
}

/// Each tier deals a genuinely *unique* puzzle across 30 seeds — the gate's
/// "each unique 30/30" — and every dealt board round-trips the wire validator
/// (adjacency-valid carets, in-range givens).
#[test]
fn each_tier_is_unique_30_of_30() {
    for &d in &TIERS {
        for seed in 0u64..30 {
            let (board, inequalities) = generate_futoshiki_difficulty_seeded(N, d, seed);
            assert_eq!(
                board.len(),
                (N * N) as usize,
                "{d:?} seed={seed}: board size"
            );

            validate_futoshiki(&board, N, &inequalities).unwrap_or_else(|e| {
                panic!("{d:?} seed={seed}: validation rejected a generated board: {e}")
            });

            let solutions = solve_up_to_two(&board, &inequalities);
            assert_eq!(
                solutions.len(),
                1,
                "{d:?} seed={seed}: generated puzzle must have exactly one solution"
            );
        }
    }
}

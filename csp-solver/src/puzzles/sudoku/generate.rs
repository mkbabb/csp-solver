//! Board generation and difficulty measurement.

use crate::ordering::Ordering;
use crate::{Pruning, SolveConfig};

use super::csp::{create_sudoku_csp, solve_sudoku};
use super::rng::SimpleRng;

/// Puzzle difficulty level.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Difficulty {
    Easy,
    Medium,
    Hard,
}

/// Measure difficulty by backtrack count (FC + FailFirst).
pub fn measure_difficulty(board: &[u32], n: u32) -> u32 {
    let (mut csp, given) = create_sudoku_csp(board, n);
    let config = SolveConfig {
        pruning: Pruning::ForwardChecking,
        ordering: Ordering::FailFirst,
        max_solutions: 1,
        backjumping: false,
    };
    csp.solve_with_given(&config, &given);
    csp.stats().backtracks as u32
}

/// Generate a Sudoku board with the given sub-grid size and difficulty.
///
/// Returns a flat `Vec<u32>` of length `M*M` where `0` = empty.
pub fn generate_board(n: u32, difficulty: Difficulty) -> Vec<u32> {
    let m = n * n;
    let total = (m * m) as usize;
    let mut rng = SimpleRng::from_time();

    // Step 1: Generate a complete valid solution.
    let mut seed_board = vec![0u32; total];
    let mut first_row: Vec<u32> = (1..=m).collect();
    rng.shuffle(&mut first_row);
    seed_board[..m as usize].copy_from_slice(&first_row);

    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions: 1,
        backjumping: false,
    };

    let solution = solve_sudoku(&seed_board, n, &config)
        .expect("seeded board must be solvable");

    // Step 2: Remove cells by random hole-digging with uniqueness check.
    let target_holes = match difficulty {
        Difficulty::Easy => total / 4,
        Difficulty::Medium => (total as f64 / 1.75) as usize,
        Difficulty::Hard => (total as f64 / 1.25) as usize,
    };

    let mut board = solution.clone();
    let mut indices: Vec<usize> = (0..total).collect();
    rng.shuffle(&mut indices);

    let mut holes = 0usize;
    let uniqueness_config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::FailFirst,
        max_solutions: 2,
        backjumping: false,
    };

    for &idx in &indices {
        if holes >= target_holes {
            break;
        }

        let saved = board[idx];
        board[idx] = 0;

        let (mut csp, given) = create_sudoku_csp(&board, n);
        let solutions = csp.solve_with_given(&uniqueness_config, &given);

        if solutions.len() == 1 {
            holes += 1;
        } else {
            board[idx] = saved;
        }
    }

    board
}

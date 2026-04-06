//! PyO3 bindings for the CSP solver's Sudoku module.
//!
//! Gated behind `#[cfg(feature = "py")]`. Build with maturin:
//! ```sh
//! PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 maturin develop --release
//! ```

use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;

use crate::ordering::Ordering;
use crate::sudoku::{self, Difficulty};
use crate::{Pruning, SolveConfig};

/// Solve a Sudoku puzzle.
///
/// Args:
///     board: Flat list of M*M integers (0 = empty).
///     size: Sub-grid size N (3 for 9x9, 4 for 16x16, etc.)
///     config: Solver config string, or None for defaults.
///
/// Returns:
///     (solved, solution, backtracks, propagations)
#[pyfunction]
#[pyo3(signature = (board, size, config=None))]
fn solve_sudoku(
    board: Vec<u32>,
    size: u32,
    config: Option<&str>,
) -> PyResult<(bool, Vec<u32>, u64, u64)> {
    let solve_config = parse_config(config)?;
    let (mut csp, given) = sudoku::create_sudoku_csp(&board, size);
    let solutions = csp.solve_with_given(&solve_config, &given);
    let stats = csp.stats();
    match solutions.into_iter().next() {
        Some(solution) => Ok((true, solution, stats.backtracks, stats.propagations)),
        None => Ok((false, board, stats.backtracks, stats.propagations)),
    }
}

/// Generate a random Sudoku board.
#[pyfunction]
fn generate_board(size: u32, difficulty: &str) -> PyResult<Vec<u32>> {
    let diff = match difficulty.to_lowercase().as_str() {
        "easy" => Difficulty::Easy,
        "medium" => Difficulty::Medium,
        "hard" => Difficulty::Hard,
        _ => return Err(PyValueError::new_err(format!("Invalid difficulty: {difficulty}"))),
    };
    Ok(sudoku::generate_board(size, diff))
}

/// Measure puzzle difficulty (backtrack count with FC + FailFirst).
#[pyfunction]
fn measure_difficulty(board: Vec<u32>, size: u32) -> PyResult<u32> {
    Ok(sudoku::measure_difficulty(&board, size))
}

/// Apply a random symmetry transform preserving Sudoku constraints.
#[pyfunction]
fn apply_random_transform(board: Vec<u32>, size: u32) -> PyResult<Vec<u32>> {
    Ok(sudoku::apply_random_transform(&board, size))
}

fn parse_config(config: Option<&str>) -> PyResult<SolveConfig> {
    match config {
        None => Ok(SolveConfig {
            pruning: Pruning::Ac3,
            ordering: Ordering::DomWdeg,
            max_solutions: 1,
            backjumping: false,
        }),
        Some(s) => {
            let mut cfg = SolveConfig::default();
            for pair in s.split(',') {
                let parts: Vec<&str> = pair.split('=').collect();
                if parts.len() != 2 {
                    continue;
                }
                match parts[0].trim() {
                    "pruning" => {
                        cfg.pruning = match parts[1].trim() {
                            "none" => Pruning::None,
                            "fc" => Pruning::ForwardChecking,
                            "ac3" => Pruning::Ac3,
                            "acfc" => Pruning::AcFc,
                            _ => {
                                return Err(PyValueError::new_err(format!(
                                    "Invalid pruning: {}",
                                    parts[1]
                                )));
                            }
                        };
                    }
                    "ordering" => {
                        cfg.ordering = match parts[1].trim() {
                            "chronological" => Ordering::Chronological,
                            "failfirst" => Ordering::FailFirst,
                            "domwdeg" => Ordering::DomWdeg,
                            _ => {
                                return Err(PyValueError::new_err(format!(
                                    "Invalid ordering: {}",
                                    parts[1]
                                )));
                            }
                        };
                    }
                    "max_solutions" => {
                        cfg.max_solutions = parts[1]
                            .trim()
                            .parse()
                            .map_err(|_| PyValueError::new_err("max_solutions must be integer"))?;
                    }
                    "backjumping" => {
                        cfg.backjumping = parts[1].trim() == "true";
                    }
                    _ => {}
                }
            }
            Ok(cfg)
        }
    }
}

/// Python module: sudoku_rs
#[pymodule]
pub fn sudoku_rs(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(solve_sudoku, m)?)?;
    m.add_function(wrap_pyfunction!(generate_board, m)?)?;
    m.add_function(wrap_pyfunction!(measure_difficulty, m)?)?;
    m.add_function(wrap_pyfunction!(apply_random_transform, m)?)?;
    Ok(())
}

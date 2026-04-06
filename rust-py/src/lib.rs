//! PyO3 bindings for the Rust CSP solver's Sudoku module.
//!
//! Exposes: solve_sudoku, generate_board, measure_difficulty, apply_random_transform.
//! All CPU-bound work runs in Rust; the Python FastAPI layer handles HTTP/async.

use pyo3::prelude::*;
use pyo3::exceptions::PyValueError;

use csp_solver::ordering::Ordering;
use csp_solver::sudoku::{self, Difficulty};
use csp_solver::{Pruning, SolveConfig};

/// Solve a Sudoku puzzle.
///
/// Args:
///     board: Flat list of M*M integers (0 = empty).
///     size: Sub-grid size N (3 for 9x9, 4 for 16x16, etc.)
///     config: JSON string of solver config, or None for defaults.
///
/// Returns:
///     (solved: bool, solution: list[int]) — solved flag + flat board.
#[pyfunction]
#[pyo3(signature = (board, size, config=None))]
fn solve_sudoku(board: Vec<u32>, size: u32, config: Option<&str>) -> PyResult<(bool, Vec<u32>)> {
    let solve_config = parse_config(config)?;

    match sudoku::solve_sudoku(&board, size, &solve_config) {
        Some(solution) => Ok((true, solution)),
        None => Ok((false, board)),
    }
}

/// Generate a random Sudoku board.
///
/// Args:
///     size: Sub-grid size N (2, 3, 4, ...).
///     difficulty: "easy", "medium", or "hard".
///
/// Returns:
///     Flat list of M*M integers (0 = empty).
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

/// Measure the difficulty of a puzzle (backtrack count).
///
/// Returns the number of backtracks needed to solve with FC + FailFirst.
#[pyfunction]
fn measure_difficulty(board: Vec<u32>, size: u32) -> PyResult<u32> {
    Ok(sudoku::measure_difficulty(&board, size))
}

/// Apply a random symmetry transform to a board.
///
/// Preserves all Sudoku constraints (rows, columns, sub-grids).
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
            // Simple key=value parsing: "pruning=ac3,ordering=failfirst,max_solutions=1"
            let mut cfg = SolveConfig::default();
            for pair in s.split(',') {
                let parts: Vec<&str> = pair.split('=').collect();
                if parts.len() != 2 { continue; }
                match parts[0].trim() {
                    "pruning" => {
                        cfg.pruning = match parts[1].trim() {
                            "none" => Pruning::None,
                            "fc" => Pruning::ForwardChecking,
                            "ac3" => Pruning::Ac3,
                            "acfc" => Pruning::AcFc,
                            _ => return Err(PyValueError::new_err(format!("Invalid pruning: {}", parts[1]))),
                        };
                    }
                    "ordering" => {
                        cfg.ordering = match parts[1].trim() {
                            "chronological" => Ordering::Chronological,
                            "failfirst" => Ordering::FailFirst,
                            "domwdeg" => Ordering::DomWdeg,
                            _ => return Err(PyValueError::new_err(format!("Invalid ordering: {}", parts[1]))),
                        };
                    }
                    "max_solutions" => {
                        cfg.max_solutions = parts[1].trim().parse()
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
fn sudoku_rs(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(solve_sudoku, m)?)?;
    m.add_function(wrap_pyfunction!(generate_board, m)?)?;
    m.add_function(wrap_pyfunction!(measure_difficulty, m)?)?;
    m.add_function(wrap_pyfunction!(apply_random_transform, m)?)?;
    Ok(())
}

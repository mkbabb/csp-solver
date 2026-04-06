//! PyO3 bindings — isomorphic to the Python CSP solver's Sudoku API.
//!
//! Drop-in replacement: `from sudoku_rs import SudokuDifficulty, create_sudoku_csp, solve_sudoku, create_random_board`
//!
//! Build: `PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 maturin develop --release --features py`

use std::collections::HashMap;

use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;
use pyo3::types::PyType;

use crate::ordering::Ordering;
use crate::sudoku::{self, Difficulty};
use crate::{Pruning, SolveConfig};

// ---------------------------------------------------------------------------
// SudokuDifficulty — mirrors Python's SudokuDifficulty enum
// ---------------------------------------------------------------------------

#[pyclass]
#[derive(Clone)]
pub enum SudokuDifficulty {
    EASY,
    MEDIUM,
    HARD,
}

#[pymethods]
impl SudokuDifficulty {
    #[classmethod]
    #[pyo3(signature = (key, default=None))]
    fn get(_cls: &Bound<'_, PyType>, key: &str, default: Option<SudokuDifficulty>) -> Option<SudokuDifficulty> {
        match key {
            "EASY" => Some(SudokuDifficulty::EASY),
            "MEDIUM" => Some(SudokuDifficulty::MEDIUM),
            "HARD" => Some(SudokuDifficulty::HARD),
            _ => default,
        }
    }
}

impl From<SudokuDifficulty> for Difficulty {
    fn from(d: SudokuDifficulty) -> Self {
        match d {
            SudokuDifficulty::EASY => Difficulty::Easy,
            SudokuDifficulty::MEDIUM => Difficulty::Medium,
            SudokuDifficulty::HARD => Difficulty::Hard,
        }
    }
}

// ---------------------------------------------------------------------------
// SudokuCSP — opaque handle mirroring Python's CSP object
// ---------------------------------------------------------------------------

/// Holds the puzzle state and solutions. The actual Rust CSP is built and
/// solved transiently — only the board, config, and results cross the boundary.
#[pyclass]
#[derive(Clone)]
pub struct SudokuCSP {
    board: Vec<u32>,
    n: u32,
    max_solutions: usize,
    #[pyo3(get)]
    solutions: Vec<HashMap<String, i32>>,
    #[pyo3(get)]
    backtrack_count: u64,
    /// Given values stored for solve_with_initial_propagation parity.
    _given_values: HashMap<String, i32>,
}

#[pymethods]
impl SudokuCSP {
    #[getter]
    fn backtracks(&self) -> u64 {
        self.backtrack_count
    }
}

// ---------------------------------------------------------------------------
// create_sudoku_csp(N, values, max_solutions) → SudokuCSP
// ---------------------------------------------------------------------------

#[pyfunction]
#[pyo3(signature = (N, values, max_solutions=1))]
fn create_sudoku_csp(
    #[allow(non_snake_case)] N: u32,
    values: HashMap<String, i32>,
    max_solutions: usize,
) -> PyResult<SudokuCSP> {
    let n = N;
    let m = n * n;
    let total = (m * m) as usize;

    let mut board = vec![0u32; total];
    let mut given = HashMap::new();
    for (pos_str, val) in &values {
        let pos: usize = pos_str
            .parse()
            .map_err(|_| PyValueError::new_err(format!("Invalid position: {pos_str}")))?;
        if pos >= total {
            return Err(PyValueError::new_err(format!("Position {pos} out of range")));
        }
        if *val > 0 {
            board[pos] = *val as u32;
            given.insert(pos_str.clone(), *val);
        }
    }

    Ok(SudokuCSP {
        board,
        n,
        max_solutions,
        solutions: Vec::new(),
        backtrack_count: 0,
        _given_values: given,
    })
}

// ---------------------------------------------------------------------------
// solve_sudoku(csp) → bool
// ---------------------------------------------------------------------------

#[pyfunction]
fn solve_sudoku(csp: &mut SudokuCSP) -> PyResult<bool> {
    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::DomWdeg,
        max_solutions: csp.max_solutions,
        backjumping: false,
    };

    let (mut rust_csp, given) = sudoku::create_sudoku_csp(&csp.board, csp.n);
    let solutions = rust_csp.solve_with_given(&config, &given);
    let stats = rust_csp.stats();
    csp.backtrack_count = stats.backtracks;

    csp.solutions = solutions
        .into_iter()
        .map(|sol| {
            sol.into_iter()
                .enumerate()
                .map(|(i, v)| (i.to_string(), v as i32))
                .collect()
        })
        .collect();

    Ok(!csp.solutions.is_empty())
}

// ---------------------------------------------------------------------------
// create_random_board(N, difficulty) → dict[str, int]
// ---------------------------------------------------------------------------

#[pyfunction]
#[pyo3(signature = (N, difficulty=SudokuDifficulty::EASY))]
fn create_random_board(
    #[allow(non_snake_case)] N: u32,
    difficulty: SudokuDifficulty,
) -> PyResult<HashMap<String, i32>> {
    let board = sudoku::generate_board(N, difficulty.into());
    Ok(board
        .into_iter()
        .enumerate()
        .map(|(i, v)| (i.to_string(), v as i32))
        .collect())
}

// ---------------------------------------------------------------------------
// Module
// ---------------------------------------------------------------------------

#[pymodule]
pub fn sudoku_rs(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<SudokuDifficulty>()?;
    m.add_class::<SudokuCSP>()?;
    m.add_function(wrap_pyfunction!(create_sudoku_csp, m)?)?;
    m.add_function(wrap_pyfunction!(solve_sudoku, m)?)?;
    m.add_function(wrap_pyfunction!(create_random_board, m)?)?;
    Ok(())
}

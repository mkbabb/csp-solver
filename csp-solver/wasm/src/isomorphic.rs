//! Isomorphic mirror of `csp-solver/src/py.rs`.
//!
//! Every `#[pyclass]` becomes `#[wasm_bindgen]`. Every `#[pymethods]
//! impl` becomes a `#[wasm_bindgen] impl`. Every `#[pyo3(get, set)]`
//! field becomes a `#[wasm_bindgen(getter)]` + `#[wasm_bindgen(setter)]`
//! method pair, because wasm-bindgen does not support direct field
//! exposure on `cdylib` types.
//!
//! Method names, argument orders, and return shapes match `py.rs`
//! exactly. Where the two binding mechanisms diverge:
//!
//! - **HashMap parameters / returns** — PyO3 maps `HashMap<u32, u32>`
//!   to a Python dict natively. wasm-bindgen has no built-in dict
//!   conversion, so this binding takes / returns `JsValue` and uses
//!   `serde-wasm-bindgen` for the conversion. The JS surface still
//!   sees a plain object.
//! - **Result handling** — PyO3 maps `Result<T, E>` to Python
//!   exceptions. wasm-bindgen maps `Result<T, JsError>` to JS
//!   exceptions; we convert errors via `JsError::new(&format!(...))`.
//! - **Generic methods** — wasm-bindgen does not support generic
//!   `#[wasm_bindgen]` items. The `Csp` wrapper monomorphizes to
//!   `BitsetDomain` exactly as `py.rs` does.

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

use csp_solver::constraint::VarId;
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering as RustOrdering;
use csp_solver::sudoku::{self, Difficulty};
use csp_solver::{
    Csp as RustCsp, PropagationStrategy as RustPropagation, Pruning as RustPruning,
    SolveConfig as RustSolveConfig,
};

// ═══════════════════════════════════════════════════════════════════════════
// Core enums
// ═══════════════════════════════════════════════════════════════════════════

/// Pruning strategy for backtracking search.
///
/// Mirrors `csp_solver::Pruning`. Variants are explicit C-style
/// discriminants so the value is stable across the wasm-bindgen ABI.
/// `non_camel_case_types` is allowed because the variant casing is
/// chosen to match `py.rs` exactly — Python convention is
/// `SCREAMING_SNAKE_CASE` for enum members, and the binding is
/// deliberately isomorphic.
#[wasm_bindgen]
#[allow(non_camel_case_types)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Pruning {
    /// No pruning — pure backtracking.
    NONE = 0,
    /// Forward checking: prune neighbors of the assigned variable.
    FORWARD_CHECKING = 1,
    /// MAC: Maintaining Arc Consistency (AC-3 after each assignment).
    AC3 = 2,
    /// Hybrid: forward checking + singleton propagation.
    AC_FC = 3,
}

impl From<Pruning> for RustPruning {
    fn from(p: Pruning) -> Self {
        match p {
            Pruning::NONE => RustPruning::None,
            Pruning::FORWARD_CHECKING => RustPruning::ForwardChecking,
            Pruning::AC3 => RustPruning::Ac3,
            Pruning::AC_FC => RustPruning::AcFc,
        }
    }
}

/// Variable ordering heuristic.
///
/// Mirrors `csp_solver::ordering::Ordering`.
#[wasm_bindgen]
#[allow(non_camel_case_types)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Ordering {
    /// Pick variables in declaration order.
    CHRONOLOGICAL = 0,
    /// Pick the variable with the smallest current domain.
    FAIL_FIRST = 1,
    /// Pick the variable with the largest weighted constraint degree.
    DOM_WDEG = 2,
}

impl From<Ordering> for RustOrdering {
    fn from(o: Ordering) -> Self {
        match o {
            Ordering::CHRONOLOGICAL => RustOrdering::Chronological,
            Ordering::FAIL_FIRST => RustOrdering::FailFirst,
            Ordering::DOM_WDEG => RustOrdering::DomWdeg,
        }
    }
}

/// Propagation strategy for `Csp::propagate_with`.
///
/// Mirrors `csp_solver::PropagationStrategy`.
#[wasm_bindgen]
#[allow(non_camel_case_types)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum PropagationStrategy {
    /// Auto-select: AC-3 if `finalize()` was called, sweep otherwise.
    AUTO = 0,
    /// AC-3 worklist with adjacency graph. Requires `finalize()`.
    AC3 = 1,
    /// Fixed-point sweep over all constraints. No adjacency needed.
    SWEEP = 2,
}

impl From<PropagationStrategy> for RustPropagation {
    fn from(s: PropagationStrategy) -> Self {
        match s {
            PropagationStrategy::AUTO => RustPropagation::Auto,
            PropagationStrategy::AC3 => RustPropagation::Ac3,
            PropagationStrategy::SWEEP => RustPropagation::Sweep,
        }
    }
}

/// Optimization mode for the solver.
///
/// Mirrors `csp_solver::OptimizationMode`. Note that `py.rs` does
/// not currently expose this enum (the Python binding is feasibility-
/// only); the WASM binding goes one step further so JS consumers can
/// drive `solve_optimized` paths in commit C5.
#[wasm_bindgen]
#[allow(non_camel_case_types)]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum OptimizationMode {
    /// Find any feasible solution.
    FEASIBILITY = 0,
    /// Find the solution minimizing total cost.
    MINIMIZE_COST = 1,
    /// Find the solution maximizing total cost.
    MAXIMIZE_COST = 2,
}

impl From<OptimizationMode> for csp_solver::OptimizationMode {
    fn from(m: OptimizationMode) -> Self {
        match m {
            OptimizationMode::FEASIBILITY => csp_solver::OptimizationMode::Feasibility,
            OptimizationMode::MINIMIZE_COST => csp_solver::OptimizationMode::MinimizeCost,
            OptimizationMode::MAXIMIZE_COST => csp_solver::OptimizationMode::MaximizeCost,
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SolveConfig + SolveStats
// ═══════════════════════════════════════════════════════════════════════════

/// Solver configuration.
///
/// Mirrors `csp_solver::SolveConfig`. Field access is via `getter` /
/// `setter` method pairs because wasm-bindgen does not surface struct
/// fields directly across the ABI.
#[wasm_bindgen]
#[derive(Clone)]
pub struct SolveConfig {
    pruning: Pruning,
    ordering: Ordering,
    max_solutions: usize,
    backjumping: bool,
    optimization_mode: OptimizationMode,
    node_budget: Option<u64>,
}

#[wasm_bindgen]
impl SolveConfig {
    /// Construct a `SolveConfig` with explicit field values.
    ///
    /// Defaults match `csp_solver::SolveConfig::default()`:
    /// `FORWARD_CHECKING` pruning, `CHRONOLOGICAL` ordering, one
    /// solution, no backjumping, feasibility mode, and a 1_000_000-
    /// node budget.
    #[wasm_bindgen(constructor)]
    pub fn new(
        pruning: Option<Pruning>,
        ordering: Option<Ordering>,
        max_solutions: Option<usize>,
        backjumping: Option<bool>,
        optimization_mode: Option<OptimizationMode>,
        node_budget: Option<u64>,
    ) -> Self {
        Self {
            pruning: pruning.unwrap_or(Pruning::FORWARD_CHECKING),
            ordering: ordering.unwrap_or(Ordering::CHRONOLOGICAL),
            max_solutions: max_solutions.unwrap_or(1),
            backjumping: backjumping.unwrap_or(false),
            optimization_mode: optimization_mode.unwrap_or(OptimizationMode::FEASIBILITY),
            node_budget: Some(node_budget.unwrap_or(1_000_000)),
        }
    }

    /// Pruning strategy used during search.
    #[wasm_bindgen(getter)]
    pub fn pruning(&self) -> Pruning {
        self.pruning
    }
    #[wasm_bindgen(setter)]
    pub fn set_pruning(&mut self, value: Pruning) {
        self.pruning = value;
    }

    /// Variable-ordering heuristic.
    #[wasm_bindgen(getter)]
    pub fn ordering(&self) -> Ordering {
        self.ordering
    }
    #[wasm_bindgen(setter)]
    pub fn set_ordering(&mut self, value: Ordering) {
        self.ordering = value;
    }

    /// Maximum number of solutions to enumerate.
    #[wasm_bindgen(getter, js_name = maxSolutions)]
    pub fn max_solutions(&self) -> usize {
        self.max_solutions
    }
    #[wasm_bindgen(setter, js_name = maxSolutions)]
    pub fn set_max_solutions(&mut self, value: usize) {
        self.max_solutions = value;
    }

    /// Enable conflict-directed backjumping.
    #[wasm_bindgen(getter)]
    pub fn backjumping(&self) -> bool {
        self.backjumping
    }
    #[wasm_bindgen(setter)]
    pub fn set_backjumping(&mut self, value: bool) {
        self.backjumping = value;
    }

    /// Optimization mode (feasibility / minimize / maximize).
    #[wasm_bindgen(getter, js_name = optimizationMode)]
    pub fn optimization_mode(&self) -> OptimizationMode {
        self.optimization_mode
    }
    #[wasm_bindgen(setter, js_name = optimizationMode)]
    pub fn set_optimization_mode(&mut self, value: OptimizationMode) {
        self.optimization_mode = value;
    }

    /// Maximum number of search nodes before aborting early.
    /// `undefined` disables the budget. Defaults to `1_000_000`.
    #[wasm_bindgen(getter, js_name = nodeBudget)]
    pub fn node_budget(&self) -> Option<u64> {
        self.node_budget
    }
    #[wasm_bindgen(setter, js_name = nodeBudget)]
    pub fn set_node_budget(&mut self, value: Option<u64>) {
        self.node_budget = value;
    }
}

impl From<&SolveConfig> for RustSolveConfig {
    fn from(c: &SolveConfig) -> Self {
        RustSolveConfig {
            pruning: c.pruning.into(),
            ordering: c.ordering.into(),
            max_solutions: c.max_solutions,
            backjumping: c.backjumping,
            optimization_mode: c.optimization_mode.into(),
            node_budget: c.node_budget,
            // Neither cancellation nor Luby restarts are exposed through the
            // wasm ABI (no cross-thread timeout in a single-threaded worker;
            // restarts stay opt-in and off for the deterministic sudoku wire).
            restarts: false,
            cancel: None,
        }
    }
}

/// Solver statistics from the most recent `solve()` call.
///
/// Mirrors `csp_solver::SolveStats`. All fields are read-only —
/// the wasm-bindgen ABI exposes them as JavaScript getters.
#[wasm_bindgen]
#[derive(Clone)]
pub struct SolveStats {
    backtracks: u64,
    nodes_explored: u64,
    propagations: u64,
    budget_exceeded: bool,
}

#[wasm_bindgen]
impl SolveStats {
    /// Number of backtracking events.
    #[wasm_bindgen(getter)]
    pub fn backtracks(&self) -> u64 {
        self.backtracks
    }

    /// Number of search nodes visited.
    #[wasm_bindgen(getter, js_name = nodesExplored)]
    pub fn nodes_explored(&self) -> u64 {
        self.nodes_explored
    }

    /// Number of constraint-propagation steps.
    #[wasm_bindgen(getter)]
    pub fn propagations(&self) -> u64 {
        self.propagations
    }

    /// `true` when the last search hit `SolveConfig.nodeBudget` and
    /// returned best-so-far rather than optimal results.
    #[wasm_bindgen(getter, js_name = budgetExceeded)]
    pub fn budget_exceeded(&self) -> bool {
        self.budget_exceeded
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Generic Csp class (wraps Csp<BitsetDomain>)
// ═══════════════════════════════════════════════════════════════════════════

/// JavaScript-facing CSP solver.
///
/// Holds an internal `csp_solver::Csp<BitsetDomain>` and exposes the
/// same surface as `py.rs::Csp`. The bitset specialization matches the
/// Python binding's choice — `BitsetDomain` is `u128`-backed and covers
/// values in `0..128` (out-of-range values panic; see the R7 release-mode
/// guard in `csp-solver/src/domain/bitset.rs`), spanning the integer-CSP
/// puzzles the solver was originally written for.
#[wasm_bindgen]
pub struct Csp {
    inner: RustCsp<BitsetDomain>,
}

#[wasm_bindgen]
impl Csp {
    /// Construct an empty CSP.
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            inner: RustCsp::new(),
        }
    }

    /// Add a variable with the given domain values. Returns its `VarId`.
    ///
    /// JS callers pass a `Uint32Array`; wasm-bindgen converts it to
    /// `Vec<u32>` for free.
    #[wasm_bindgen(js_name = addVariable)]
    pub fn add_variable(&mut self, domain: Vec<u32>) -> u32 {
        self.inner.add_variable(BitsetDomain::new(domain))
    }

    /// Add a not-equal constraint between two variables.
    #[wasm_bindgen(js_name = addNotEqual)]
    pub fn add_not_equal(&mut self, x: u32, y: u32) {
        self.inner.add_not_equal(x, y);
    }

    /// Add an all-different constraint over a group of variables.
    #[wasm_bindgen(js_name = addAllDifferent)]
    pub fn add_all_different(&mut self, vars: Vec<u32>) {
        self.inner.add_all_different(vars);
    }

    /// Fix a variable to a specific value.
    #[wasm_bindgen(js_name = addEquals)]
    pub fn add_equals(&mut self, var: u32, value: u32) {
        self.inner.add_equals(var, value);
    }

    /// Constrain `x < y`.
    #[wasm_bindgen(js_name = addLessThan)]
    pub fn add_less_than(&mut self, x: u32, y: u32) {
        self.inner.add_less_than(x, y);
    }

    /// Constrain `x > y`.
    #[wasm_bindgen(js_name = addGreaterThan)]
    pub fn add_greater_than(&mut self, x: u32, y: u32) {
        self.inner.add_greater_than(x, y);
    }

    /// Build the adjacency graph. Required before `solve()`, optional
    /// before `propagate()`.
    pub fn finalize(&mut self) {
        self.inner.finalize();
    }

    /// Propagate constraints to a fixed point (auto-selects AC-3 if
    /// `finalize()` was called, sweep otherwise).
    ///
    /// Returns `true` on success; throws on `Unsatisfiable`.
    pub fn propagate(&mut self) -> Result<bool, JsError> {
        self.inner
            .propagate()
            .map(|()| true)
            .map_err(|e| JsError::new(&format!("{e}")))
    }

    /// Propagate constraints with an explicit strategy.
    #[wasm_bindgen(js_name = propagateWith)]
    pub fn propagate_with(&mut self, strategy: PropagationStrategy) -> Result<bool, JsError> {
        self.inner
            .propagate_with(strategy.into())
            .map(|()| true)
            .map_err(|e| JsError::new(&format!("{e}")))
    }

    /// Solve with the given configuration.
    ///
    /// Returns an array of solution objects; each solution is a
    /// `Record<VarId, Value>` keyed by variable index. Returned via
    /// serde-wasm-bindgen as a plain JS value.
    pub fn solve(&mut self, config: &SolveConfig) -> Result<JsValue, JsError> {
        let rust_config: RustSolveConfig = config.into();
        let solutions: Vec<HashMap<u32, u32>> = self
            .inner
            .solve(&rust_config)
            .into_iter()
            .map(|sol| {
                sol.into_iter()
                    .enumerate()
                    .map(|(i, v)| (i as u32, v))
                    .collect()
            })
            .collect();
        serde_wasm_bindgen::to_value(&solutions).map_err(|e| JsError::new(&e.to_string()))
    }

    /// Solve with pre-assigned ("given") values.
    ///
    /// `given` is a JS object keyed by `VarId`-as-string with `u32`
    /// values, deserialized via serde-wasm-bindgen.
    #[wasm_bindgen(js_name = solveWithGiven)]
    pub fn solve_with_given(
        &mut self,
        config: &SolveConfig,
        given: JsValue,
    ) -> Result<JsValue, JsError> {
        let given_map: HashMap<u32, u32> =
            serde_wasm_bindgen::from_value(given).map_err(|e| JsError::new(&e.to_string()))?;
        let rust_config: RustSolveConfig = config.into();
        let given_vec: Vec<(VarId, u32)> = given_map.into_iter().collect();
        let solutions: Vec<HashMap<u32, u32>> = self
            .inner
            .solve_with_given(&rust_config, &given_vec)
            .into_iter()
            .map(|sol| {
                sol.into_iter()
                    .enumerate()
                    .map(|(i, v)| (i as u32, v))
                    .collect()
            })
            .collect();
        serde_wasm_bindgen::to_value(&solutions).map_err(|e| JsError::new(&e.to_string()))
    }

    /// Solver statistics from the last run.
    #[wasm_bindgen(getter)]
    pub fn stats(&self) -> SolveStats {
        let s = self.inner.stats();
        SolveStats {
            backtracks: s.backtracks,
            nodes_explored: s.nodes_explored,
            propagations: s.propagations,
            budget_exceeded: s.budget_exceeded,
        }
    }
}

impl Default for Csp {
    fn default() -> Self {
        Self::new()
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Sudoku convenience API (mirrors py.rs::SudokuCSP / create_sudoku_csp /
// solve_sudoku / create_random_board)
// ═══════════════════════════════════════════════════════════════════════════

/// Sudoku puzzle difficulty.
///
/// Mirrors `py.rs::SudokuDifficulty`.
#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum SudokuDifficulty {
    EASY = 0,
    MEDIUM = 1,
    HARD = 2,
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

/// Wire format for `create_sudoku_csp` / `solve_sudoku` round-trips.
///
/// Mirrors `py.rs::SudokuCSP`'s field set. The wasm binding stores
/// these as a serde-friendly struct so the entire object can move
/// across the ABI in a single `JsValue` exchange.
#[derive(Clone, Serialize, Deserialize)]
pub struct SudokuCspWire {
    /// Flat row-major board, length `(n * n)^2`. Zero entries are blanks.
    pub board: Vec<u32>,
    /// Block side length: standard Sudoku is `n = 3` (`9 × 9` grid).
    pub n: u32,
    /// Maximum number of solutions to enumerate.
    #[serde(rename = "maxSolutions")]
    pub max_solutions: usize,
    /// Solutions found by the most recent `solve_sudoku` call.
    /// Each solution is a position-keyed map.
    pub solutions: Vec<HashMap<String, i32>>,
    /// Number of backtracks the last solve required.
    #[serde(rename = "backtrackCount")]
    pub backtrack_count: u64,
}

/// Construct a Sudoku CSP wire object from a position-keyed value map.
///
/// Mirrors `py.rs::create_sudoku_csp`. Positions are stringified
/// row-major indices into the `n^2 × n^2` grid.
#[wasm_bindgen(js_name = createSudokuCsp)]
pub fn create_sudoku_csp(
    n: u32,
    values: JsValue,
    max_solutions: Option<usize>,
) -> Result<JsValue, JsError> {
    let values_map: HashMap<String, i32> =
        serde_wasm_bindgen::from_value(values).map_err(|e| JsError::new(&e.to_string()))?;

    let m = n * n;
    let total = (m * m) as usize;

    let mut board = vec![0u32; total];
    for (pos_str, val) in &values_map {
        let pos: usize = pos_str
            .parse()
            .map_err(|_| JsError::new(&format!("Invalid position: {pos_str}")))?;
        if pos >= total {
            return Err(JsError::new(&format!("Position {pos} out of range")));
        }
        if *val > 0 {
            board[pos] = *val as u32;
        }
    }

    let wire = SudokuCspWire {
        board,
        n,
        max_solutions: max_solutions.unwrap_or(1),
        solutions: Vec::new(),
        backtrack_count: 0,
    };
    serde_wasm_bindgen::to_value(&wire).map_err(|e| JsError::new(&e.to_string()))
}

/// Solve a Sudoku CSP previously built by `createSudokuCsp`.
///
/// Mirrors `py.rs::solve_sudoku`. Returns the updated wire object
/// (with `solutions` and `backtrackCount` populated). Note that
/// because wasm-bindgen passes structs by value rather than by `&mut`
/// reference across the ABI, this returns a fresh wire object instead
/// of mutating in place.
#[wasm_bindgen(js_name = solveSudoku)]
pub fn solve_sudoku(csp: JsValue) -> Result<JsValue, JsError> {
    let mut wire: SudokuCspWire =
        serde_wasm_bindgen::from_value(csp).map_err(|e| JsError::new(&e.to_string()))?;

    let config = RustSolveConfig {
        pruning: RustPruning::Ac3,
        ordering: RustOrdering::DomWdeg,
        max_solutions: wire.max_solutions,
        backjumping: false,
        ..Default::default()
    };

    let (mut rust_csp, given) = sudoku::create_sudoku_csp(&wire.board, wire.n);
    let solutions = rust_csp.solve_with_given(&config, &given);
    let stats = rust_csp.stats();
    wire.backtrack_count = stats.backtracks;

    wire.solutions = solutions
        .into_iter()
        .map(|sol| {
            sol.into_iter()
                .enumerate()
                .map(|(i, v)| (i.to_string(), v as i32))
                .collect()
        })
        .collect();

    serde_wasm_bindgen::to_value(&wire).map_err(|e| JsError::new(&e.to_string()))
}

/// Generate a random Sudoku board for the given difficulty.
///
/// Mirrors `py.rs::create_random_board`. The optional `templates`
/// argument is a `JsValue` array of position-keyed value maps; when
/// provided, the generator picks a template at random and digs holes
/// from it.
#[wasm_bindgen(js_name = createRandomBoard)]
pub fn create_random_board(
    n: u32,
    difficulty: Option<SudokuDifficulty>,
    templates: JsValue,
) -> Result<JsValue, JsError> {
    let difficulty = difficulty.unwrap_or(SudokuDifficulty::EASY);

    let board = if !templates.is_undefined() && !templates.is_null() {
        let tmpls: Vec<HashMap<String, i32>> =
            serde_wasm_bindgen::from_value(templates).map_err(|e| JsError::new(&e.to_string()))?;
        let m = (n * n) as usize;
        let total = m * m;
        let flat_templates: Vec<Vec<u32>> = tmpls
            .iter()
            .map(|t| {
                let mut flat = vec![0u32; total];
                for (k, v) in t {
                    if let Ok(pos) = k.parse::<usize>()
                        && pos < total
                    {
                        flat[pos] = *v as u32;
                    }
                }
                flat
            })
            .collect();
        sudoku::generate_board_with_templates(n, difficulty.into(), &flat_templates)
    } else {
        sudoku::generate_board(n, difficulty.into())
    };

    let result: HashMap<String, i32> = board
        .into_iter()
        .enumerate()
        .map(|(i, v)| (i.to_string(), v as i32))
        .collect();
    serde_wasm_bindgen::to_value(&result).map_err(|e| JsError::new(&e.to_string()))
}

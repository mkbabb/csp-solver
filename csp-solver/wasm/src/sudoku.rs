//! Flat-index Sudoku wire for client-side solve + generate + propagate.
//!
//! This is the purpose-built browser surface: the frontend needs exactly
//! three operations — solve a board, generate a puzzle, and propagate a
//! board's candidate domains (the engine-domains pencil marks) — and
//! nothing that crosses the wasm boundary here is a string-keyed map.
//!
//! Boards are flat, row-major `Uint32Array`s of length `(n*n)^2`, `0` for a
//! blank cell. wasm-bindgen marshals `Vec<u32>` params / returns as
//! `Uint32Array` via a single bulk `memcpy` into / out of linear memory —
//! the tier-2 fast path — so there is no per-cell `Reflect` reflection and
//! no `i.to_string()` position-key allocation (the cost a string-keyed
//! position-map wire would pay on every cell).
//!
//! Generation takes an explicit `seed` from JS. The native generator seeds
//! its RNG from `SystemTime::now()`, which **panics** on
//! `wasm32-unknown-unknown` (no wall clock) — so a JS caller must supply
//! the entropy (e.g. `Date.now()` or a `crypto.getRandomValues` draw). The
//! same seed yields the same board on native and wasm, which the parity
//! harness exploits for a bit-exact cross-target check.

use wasm_bindgen::prelude::*;

use csp_solver::domain::Domain;
use csp_solver::ordering::Ordering;
use csp_solver::sudoku::{self, Difficulty};
use csp_solver::{Pruning, SolveConfig};

/// Stamp a stable `.code` string onto a genuine `js_sys::Error` (not a
/// plain object) so `instanceof Error` and `.message` both behave as JS
/// callers expect, while still giving them a machine-checkable
/// discriminant. Self-contained here (no shared serde-carrying error
/// module) so it rides the lean, `--no-default-features` deploy-fork build
/// this module ships in without dragging the serde graph into the compile.
/// `pub(crate)` so the sibling always-on `futoshiki` wire stamps its coded
/// errors identically.
pub(crate) fn coded_error(code: &str, message: &str) -> JsValue {
    let err = js_sys::Error::new(message);
    let _ = js_sys::Reflect::set(&err, &JsValue::from_str("code"), &JsValue::from_str(code));
    err.into()
}

/// Sudoku puzzle difficulty. Flat re-declaration so this module stands
/// alone in the lean, `--no-default-features` deploy build.
#[wasm_bindgen]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum SudokuDifficulty {
    Easy = 0,
    Medium = 1,
    Hard = 2,
}

impl From<SudokuDifficulty> for Difficulty {
    fn from(d: SudokuDifficulty) -> Self {
        match d {
            SudokuDifficulty::Easy => Difficulty::Easy,
            SudokuDifficulty::Medium => Difficulty::Medium,
            SudokuDifficulty::Hard => Difficulty::Hard,
        }
    }
}

/// Result of [`solve_sudoku`].
///
/// `solutions` is a flat concatenation of `solution_count` boards, each
/// `(n*n)^2` cells, row-major. For the frontend's single-solution use the
/// buffer is exactly one board; `max_solutions > 1` packs them end to end.
#[wasm_bindgen]
pub struct SudokuSolveResult {
    solved: bool,
    solution_count: usize,
    n: u32,
    solutions: Vec<u32>,
    backtracks: u64,
    budget_exceeded: bool,
}

#[wasm_bindgen]
impl SudokuSolveResult {
    /// `true` when at least one solution was found.
    #[wasm_bindgen(getter)]
    pub fn solved(&self) -> bool {
        self.solved
    }

    /// Number of solutions packed into `solutions`.
    #[wasm_bindgen(getter, js_name = solutionCount)]
    pub fn solution_count(&self) -> usize {
        self.solution_count
    }

    /// Sub-grid size the board was solved at (2, 3, or 4).
    #[wasm_bindgen(getter)]
    pub fn n(&self) -> u32 {
        self.n
    }

    /// Backtracks the search required (difficulty proxy).
    #[wasm_bindgen(getter)]
    pub fn backtracks(&self) -> u64 {
        self.backtracks
    }

    /// Flat solution buffer, `solution_count * (n*n)^2` cells. Crosses as a
    /// `Uint32Array` (bulk copy). Slice per board client-side.
    #[wasm_bindgen(getter)]
    pub fn solutions(&self) -> Vec<u32> {
        self.solutions.clone()
    }

    /// `true` when the search hit [`SolveConfig::node_budget`] before
    /// exhausting the search space. Only ever `true` here when
    /// `solved` is also `true` — the zero-solution/budget-exceeded
    /// case throws a typed `BUDGET_EXCEEDED` error from [`solve_sudoku`]
    /// instead of returning a result, so a caller can distinguish "gave
    /// up early, here's a best-effort board" (this field) from "gave up
    /// early, found nothing" (the thrown error) from "provably no
    /// solution exists" (`solved: false`, this field `false`).
    #[wasm_bindgen(getter, js_name = budgetExceeded)]
    pub fn budget_exceeded(&self) -> bool {
        self.budget_exceeded
    }
}

/// Solve a flat, row-major Sudoku board (`0` = blank).
///
/// `n` is the sub-grid size — 2 (`4x4`), 3 (`9x9`), or 4 (`16x16`).
/// Uses the same AC-3 + MRV config the shipped PyO3 `solve_sudoku`
/// path uses, not the pathological library default.
///
/// `node_budget` mirrors [`SolveConfig::node_budget`] — pass `None`/`0`
/// (JS `undefined`) for the library default (1,000,000 nodes); browser
/// callers on a low-power device or a strict per-tab time slice can pass
/// a tighter cap. When the budget is exhausted with zero solutions
/// found, this throws a typed error (`instanceof Error`, `.code ===
/// "BUDGET_EXCEEDED"`) rather than returning `solved: false` — that
/// value is reserved for a board this solver has *proven* has no
/// completion, which a caller must not confuse with "gave up early."
#[wasm_bindgen(js_name = solveSudoku)]
pub fn solve_sudoku(
    board: Vec<u32>,
    n: u32,
    max_solutions: Option<usize>,
    node_budget: Option<u32>,
) -> Result<SudokuSolveResult, JsValue> {
    let m = (n * n) as usize;
    let total = m * m;
    if board.len() != total {
        return Err(coded_error(
            "INVALID_INPUT",
            &format!(
                "board length {} does not match (n*n)^2 = {total} for n = {n}",
                board.len()
            ),
        ));
    }

    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions: max_solutions.unwrap_or(1).max(1),
        node_budget: node_budget.map(u64::from).or(Some(1_000_000)),
        ..Default::default()
    };

    let (mut csp, given) = sudoku::create_sudoku_csp(&board, n);
    let solutions = csp.solve_with_given(&config, &given);
    let stats = csp.stats();
    let backtracks = stats.backtracks;
    let budget_exceeded = stats.budget_exceeded;

    let solution_count = solutions.len();

    if budget_exceeded && solution_count == 0 {
        return Err(coded_error(
            "BUDGET_EXCEEDED",
            &format!(
                "search exhausted its node budget ({} nodes) before finding a solution",
                config.node_budget.unwrap_or_default()
            ),
        ));
    }

    let mut flat = Vec::with_capacity(solution_count * total);
    for sol in &solutions {
        flat.extend_from_slice(sol);
    }

    Ok(SudokuSolveResult {
        solved: solution_count > 0,
        solution_count,
        n,
        solutions: flat,
        backtracks,
        budget_exceeded,
    })
}

/// Constraint-propagate a flat, row-major Sudoku board (`0` = blank)
/// WITHOUT searching, and return each cell's surviving candidate set as a
/// bitmask — the engine-domains pencil-marks surface (W6 beat 9, landed
/// from the P4 spike). The frontend surfaces these ONLY behind the
/// hold-to-peek gesture: at full GAC strength most served boards collapse
/// to all-singleton domains, so ambient marks would be a disclosure, not
/// a hint.
///
/// The returned buffer has one `u32` per cell (crosses as a `Uint32Array`,
/// same bulk-copy fast path as the boards); bit `v` is set iff value `v`
/// (1-based) survives propagation in that cell's domain. A given cell comes
/// back as the singleton mask `1 << value`. Values run 1..=n², so the
/// widest surface (n = 5, 25 values) still fits a `u32` with room.
///
/// This runs exactly the root propagation `solve_with_given` opens with —
/// pin the givens as permanent singleton restrictions, then AC-3 to a
/// fixpoint (`create_sudoku_csp` finalizes, so `propagate()` auto-selects
/// AC-3) — and never enters the search kernel: zero backtracks, no
/// node budget needed.
///
/// A board whose filled cells are *contradictory* (propagation wipes some
/// domain empty) throws a typed error (`instanceof Error`, `.code ===
/// "UNSAT"`) rather than returning a half-propagated buffer.
#[wasm_bindgen(js_name = propagateSudoku)]
pub fn propagate_sudoku(board: Vec<u32>, n: u32) -> Result<Vec<u32>, JsValue> {
    let m = (n * n) as usize;
    let total = m * m;
    if board.len() != total {
        return Err(coded_error(
            "INVALID_INPUT",
            &format!(
                "board length {} does not match (n*n)^2 = {total} for n = {n}",
                board.len()
            ),
        ));
    }

    let (mut csp, given) = sudoku::create_sudoku_csp(&board, n);

    // Pin the givens: permanent singleton restriction, the same
    // `Domain::restrict_to` move `solve_with_given` opens with (O(1)
    // bitmask restrict for `BitsetDomain`; the returned removed-values
    // iterator is deliberately dropped — the mutation is eager).
    for (var, val) in &given {
        let _ = csp.variables[*var as usize].domain.restrict_to(val);
    }

    if csp.propagate().is_err() {
        return Err(coded_error(
            "UNSAT",
            "the filled cells contradict each other — some cell has no surviving candidate",
        ));
    }

    let masks = csp
        .variables
        .iter()
        .map(|v| v.domain.iter().fold(0u32, |acc, val| acc | (1u32 << val)))
        .collect();

    Ok(masks)
}

/// Generate a flat, row-major Sudoku puzzle for `n` and `difficulty`.
///
/// `seed` supplies the RNG entropy — pass `Date.now()` or a
/// `crypto.getRandomValues` draw. `templates` is a flat concatenation of
/// full puzzle templates (each `(n*n)^2` cells); when non-empty the fast
/// path picks one and applies a random symmetry transform. An empty
/// `templates` falls back to hole-digging generation.
#[wasm_bindgen(js_name = generateSudoku)]
pub fn generate_sudoku(
    n: u32,
    difficulty: SudokuDifficulty,
    seed: f64,
    templates: Vec<u32>,
) -> Result<Vec<u32>, JsError> {
    let m = (n * n) as usize;
    let total = m * m;
    if total == 0 {
        return Err(JsError::new("n must be >= 1"));
    }
    // JS numbers are f64; `Date.now()` and typical seeds are exact integers
    // below 2^53. Reinterpret to a u64 seed for the LCG.
    let seed_u64 = seed as u64;

    let board = if templates.is_empty() {
        sudoku::generate_board_seeded(n, difficulty.into(), seed_u64)
    } else {
        if !templates.len().is_multiple_of(total) {
            return Err(JsError::new(&format!(
                "templates length {} is not a multiple of (n*n)^2 = {total}",
                templates.len()
            )));
        }
        let tmpls: Vec<Vec<u32>> = templates.chunks(total).map(<[u32]>::to_vec).collect();
        sudoku::generate_board_with_templates_seeded(n, difficulty.into(), &tmpls, seed_u64)
    };

    Ok(board)
}

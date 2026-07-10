//! Flat-index Futoshiki wire for client-side solve + generate + propagate.
//!
//! The purpose-built browser surface (option (b) per the wave spec — a
//! second purpose-built module, not a second axis of variation on the
//! generic `Csp` mirror): the frontend needs exactly three operations —
//! solve a board, generate a puzzle, and propagate a board's candidate
//! domains (the engine-domains pencil marks, mirroring the Sudoku wire) —
//! and nothing crossing the wasm boundary is a string-keyed map.
//!
//! Boards are flat, row-major `Uint32Array`s of length `board_size²`, `0`
//! for a blank cell. Inequalities cross as a *separate* flat
//! `Uint32Array` of `[a0, b0, a1, b1, …]` pairs, each meaning
//! `cell_a > cell_b`; keeping them out of the board buffer is what lets
//! both marshal as tier-2 bulk-`memcpy` `Uint32Array`s with no per-cell
//! reflection and no `i.to_string()` position-key allocation.
//!
//! This module compiles in the lean, `--no-default-features` deploy build
//! (Futoshiki *is* a shipped product surface) alongside `sudoku`; it
//! reuses that sibling's `coded_error` helper so both wires stamp a
//! machine-checkable `.code` onto a genuine JS `Error`.
//!
//! Generation takes an explicit `seed` from JS. The native generator seeds
//! its RNG from `SystemTime::now()`, which **panics** on
//! `wasm32-unknown-unknown` (no wall clock) — so a JS caller must supply
//! the entropy (e.g. `Date.now()` or a `crypto.getRandomValues` draw). The
//! same seed yields the same board on native and wasm, the invariant the
//! parity harness exploits for a bit-exact cross-target check.

use wasm_bindgen::prelude::*;

use csp_solver::ordering::Ordering;
use csp_solver::puzzles::futoshiki::{
    self, FutoshikiPuzzle, create_futoshiki_csp as build_futoshiki_csp,
};
use csp_solver::{Pruning, SolveConfig};

use crate::sudoku::coded_error;

/// v1 Futoshiki board-size band. The frontend selector offers exactly
/// these; a request outside the band is `INVALID_INPUT`, never a silent
/// clamp or a panic in the generator.
const MIN_BOARD_SIZE: u32 = 4;
const MAX_BOARD_SIZE: u32 = 7;

/// Result of [`solve_futoshiki`].
///
/// `solutions` is a flat concatenation of `solution_count` boards, each
/// `board_size²` cells, row-major. For the frontend's single-solution use
/// the buffer is exactly one board; `max_solutions > 1` packs them end to
/// end.
#[wasm_bindgen]
pub struct FutoshikiSolveResult {
    solved: bool,
    solution_count: usize,
    board_size: u32,
    solutions: Vec<u32>,
    backtracks: u64,
    budget_exceeded: bool,
}

#[wasm_bindgen]
impl FutoshikiSolveResult {
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

    /// Board side length the puzzle was solved at (`4..=7`). Named
    /// `boardSize`, never bare `n`/`size` — Sudoku's `n` is the *subgrid*
    /// side, a different quantity (F5).
    #[wasm_bindgen(getter, js_name = boardSize)]
    pub fn board_size(&self) -> u32 {
        self.board_size
    }

    /// Backtracks the search required (difficulty proxy).
    #[wasm_bindgen(getter)]
    pub fn backtracks(&self) -> u64 {
        self.backtracks
    }

    /// Flat solution buffer, `solution_count * board_size²` cells. Crosses
    /// as a `Uint32Array` (bulk copy). Slice per board client-side.
    #[wasm_bindgen(getter)]
    pub fn solutions(&self) -> Vec<u32> {
        self.solutions.clone()
    }

    /// `true` when the search hit [`SolveConfig::node_budget`] before
    /// exhausting the search space. Only ever `true` here when `solved`
    /// is also `true` — the zero-solution/budget-exceeded case throws a
    /// typed `BUDGET_EXCEEDED` error from [`solve_futoshiki`] instead of
    /// returning a result, so a caller distinguishes "gave up early,
    /// here's a best-effort board" (this field) from "gave up early, found
    /// nothing" (the thrown error) from "provably no solution exists"
    /// (`solved: false`, this field `false`).
    #[wasm_bindgen(getter, js_name = budgetExceeded)]
    pub fn budget_exceeded(&self) -> bool {
        self.budget_exceeded
    }
}

/// A generated Futoshiki puzzle. `board` is the dense row-major given grid
/// (`0` = blank); `inequalities` is the flat `[a0, b0, …]` pair buffer,
/// each `a > b`, every pair orthogonally adjacent.
#[wasm_bindgen]
pub struct FutoshikiPuzzleData {
    board: Vec<u32>,
    inequalities: Vec<u32>,
    board_size: u32,
}

#[wasm_bindgen]
impl FutoshikiPuzzleData {
    /// Dense row-major given grid, `board_size²` cells, `0` = blank.
    #[wasm_bindgen(getter)]
    pub fn board(&self) -> Vec<u32> {
        self.board.clone()
    }

    /// Flat `[a0, b0, a1, b1, …]` inequality pairs, each `cell_a > cell_b`.
    #[wasm_bindgen(getter)]
    pub fn inequalities(&self) -> Vec<u32> {
        self.inequalities.clone()
    }

    /// Board side length (`4..=7`).
    #[wasm_bindgen(getter, js_name = boardSize)]
    pub fn board_size(&self) -> u32 {
        self.board_size
    }
}

/// Validate the wire parts into a [`FutoshikiPuzzle`], rejecting a
/// non-adjacent / out-of-range inequality pair with a coded
/// `INVALID_INPUT` error (G3 wasm boundary) rather than solving it
/// silently — a caret has no shared edge to render a non-adjacent pair on.
/// Reuses the single Rust adjacency check ([`FutoshikiPuzzle::from_parts`])
/// so the wasm boundary and the PyO3/HTTP boundary reject the exact same
/// inputs.
fn validated_puzzle(
    board: &[u32],
    board_size: u32,
    inequalities: &[u32],
) -> Result<FutoshikiPuzzle, JsValue> {
    let total = (board_size * board_size) as usize;
    if board.len() != total {
        return Err(coded_error(
            "INVALID_INPUT",
            &format!(
                "board length {} does not match board_size² = {total} for board_size = {board_size}",
                board.len()
            ),
        ));
    }
    if !inequalities.len().is_multiple_of(2) {
        return Err(coded_error(
            "INVALID_INPUT",
            &format!(
                "inequalities length {} is odd — expected a flat array of [a, b] pairs",
                inequalities.len()
            ),
        ));
    }

    let fixed_cells: Vec<(usize, u32)> = board
        .iter()
        .enumerate()
        .filter(|&(_, &v)| v != 0)
        .map(|(i, &v)| (i, v))
        .collect();
    // The odd-length guard above means the remainder is empty; `as_chunks`
    // gives the complete `[a, b]` pairs with no per-element bounds checks.
    let pairs: Vec<(usize, usize)> = inequalities
        .as_chunks::<2>()
        .0
        .iter()
        .map(|&[a, b]| (a as usize, b as usize))
        .collect();

    FutoshikiPuzzle::from_parts(board_size, fixed_cells, pairs)
        .map_err(|e| coded_error(e.code(), &e.to_string()))
}

/// Solve a flat, row-major Futoshiki board (`0` = blank) with a flat
/// inequality-pair buffer.
///
/// Uses the same AC-3 + MRV config the shipped native `solve_futoshiki` and
/// PyO3 `solve_futoshiki` paths use — the F1 production override, not the
/// pathological library default that cannot solve an empty N≥6 board.
///
/// `node_budget` mirrors [`SolveConfig::node_budget`] — pass `None`/`0`
/// (JS `undefined`) for the library default (1,000,000 nodes). When the
/// budget is exhausted with zero solutions found, this throws a typed
/// error (`instanceof Error`, `.code === "BUDGET_EXCEEDED"`) rather than
/// returning `solved: false` — that value is reserved for a board this
/// solver has *proven* has no completion.
#[wasm_bindgen(js_name = solveFutoshiki)]
pub fn solve_futoshiki(
    board: Vec<u32>,
    board_size: u32,
    inequalities: Vec<u32>,
    max_solutions: Option<usize>,
    node_budget: Option<u32>,
) -> Result<FutoshikiSolveResult, JsValue> {
    let total = (board_size * board_size) as usize;
    let puzzle = validated_puzzle(&board, board_size, &inequalities)?;

    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions: max_solutions.unwrap_or(1).max(1),
        node_budget: node_budget.map(u64::from).or(Some(1_000_000)),
        ..Default::default()
    };

    let mut csp = build_futoshiki_csp(&puzzle);
    // `solve_with_given` (feasibility-only) with an empty given — NOT `solve`.
    // The fixed cells are already baked as `add_equals` constraints, so an
    // empty given is behaviorally identical: both AC-3 the root then run
    // `feasibility_search` over every variable (`Some(&[])` yields the same
    // initial stack as `None`). Critically, `solve` also monomorphizes the
    // branch-and-bound *optimization* arm (`ScoredSolution` sorts, `BranchBound`,
    // `optimistic_bound`) — ~20 KB Futoshiki never runs but would drag into the
    // lean wasm artifact and blow the size band. The sudoku wire takes this same
    // feasibility-only path for the same reason.
    let solutions = csp.solve_with_given(&config, &[]);
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

    Ok(FutoshikiSolveResult {
        solved: solution_count > 0,
        solution_count,
        board_size,
        solutions: flat,
        backtracks,
        budget_exceeded,
    })
}

/// Constraint-propagate a flat, row-major Futoshiki board (`0` = blank)
/// with its flat inequality-pair buffer WITHOUT searching, and return each
/// cell's surviving candidate set as a bitmask — the engine-domains
/// pencil-marks surface, the Futoshiki twin of `propagateSudoku` (D16).
/// Surfaced by the frontend ONLY behind the hold-to-peek gesture, never
/// ambient.
///
/// One `u32` per cell (crosses as a `Uint32Array`); bit `v` is set iff
/// value `v` (1-based) survives propagation. Values run 1..=board_size
/// (≤ 7 in the v1 band), so the mask fits a `u32` with room. Fixed cells
/// are baked into the CSP as `add_equals` constraints (see
/// [`create_futoshiki_csp`](build_futoshiki_csp)), so the root AC-3
/// fixpoint — the same one `solve_futoshiki` opens with — pins them to
/// singleton masks with no explicit given-pinning step.
///
/// A board whose filled cells are *contradictory* (propagation wipes some
/// domain empty) throws a typed error (`instanceof Error`, `.code ===
/// "UNSAT"`) rather than returning a half-propagated buffer; a malformed
/// board/inequality wire rejects with `INVALID_INPUT` exactly as the
/// solve/generate ops do.
#[wasm_bindgen(js_name = propagateFutoshiki)]
pub fn propagate_futoshiki(
    board: Vec<u32>,
    board_size: u32,
    inequalities: Vec<u32>,
) -> Result<Vec<u32>, JsValue> {
    let puzzle = validated_puzzle(&board, board_size, &inequalities)?;

    let mut csp = build_futoshiki_csp(&puzzle);
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

/// Generate a flat, row-major Futoshiki puzzle for `board_size` at the
/// single shipped high-density tier (no difficulty parameter — v1 scope).
///
/// `seed` supplies the RNG entropy — pass `Date.now()` or a
/// `crypto.getRandomValues` draw. The same `seed` + `board_size` yields the
/// same puzzle here as the native `generate_futoshiki_seeded`, which the
/// parity harness relies on. `board_size` outside `4..=7` throws
/// `INVALID_INPUT`.
#[wasm_bindgen(js_name = generateFutoshiki)]
pub fn generate_futoshiki(board_size: u32, seed: f64) -> Result<FutoshikiPuzzleData, JsValue> {
    if !(MIN_BOARD_SIZE..=MAX_BOARD_SIZE).contains(&board_size) {
        return Err(coded_error(
            "INVALID_INPUT",
            &format!(
                "board_size {board_size} out of range [{MIN_BOARD_SIZE}, {MAX_BOARD_SIZE}] \
                 (v1 Futoshiki scope)"
            ),
        ));
    }

    // JS numbers are f64; `Date.now()` and typical seeds are exact integers
    // below 2^53. Reinterpret to a u64 seed for the LCG.
    let seed_u64 = seed as u64;

    let (board, pairs) = futoshiki::generate_futoshiki_seeded(board_size, seed_u64);
    let inequalities: Vec<u32> = pairs
        .iter()
        .flat_map(|&(a, b)| [a as u32, b as u32])
        .collect();

    Ok(FutoshikiPuzzleData {
        board,
        inequalities,
        board_size,
    })
}

//! Flat-index Thermo-Sudoku wire for client-side solve + generate + propagate.
//!
//! The purpose-built browser surface for the T4-W13 contract-proof game — the
//! third puzzle module beside `sudoku` and `futoshiki`, sharing their flat-buffer
//! discipline: nothing crossing the wasm boundary is a string-keyed map.
//!
//! Boards are flat, row-major `Uint32Array`s of length `(n*n)²`, `0` for a blank
//! cell — identical to the sudoku wire (Thermo-Sudoku *is* a Sudoku variant). The
//! thermometer furniture crosses as a *separate* flat `Uint32Array`, each tube
//! **length-prefixed**: `[k0, c0_0, c0_1, …, k1, c1_0, …]` — `k` cells follow
//! each count. Length-prefixing (not the fixed `[a, b]` pairs the futoshiki caret
//! wire uses) is what lets a variable-length tube ride the same tier-2 bulk
//! `memcpy` `Uint32Array` with no per-cell reflection.
//!
//! Difficulty reuses [`SudokuDifficulty`](crate::SudokuDifficulty) verbatim — a
//! Thermo-Sudoku's tiers ARE the sudoku keep bands, so no fourth wire mirror is
//! minted (the `difficulty_parity` discipline).
//!
//! Generation takes an explicit `seed` from JS (the native generator's
//! `SystemTime::now()` panics on `wasm32-unknown-unknown`); the same seed yields
//! the same puzzle on native and wasm — the parity invariant.

use wasm_bindgen::prelude::*;

use csp_solver::domain::Domain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::thermo::{self, Thermometer, create_thermo_csp};
use csp_solver::{Pruning, SolveConfig};

use crate::SudokuDifficulty;
use crate::errors::{coded_error, domain_masks, flatten_solutions};

/// Result of [`solve_thermo`]. `solutions` is a flat concatenation of
/// `solution_count` boards, each `(n*n)²` cells, row-major.
#[wasm_bindgen]
pub struct ThermoSolveResult {
    solved: bool,
    solution_count: usize,
    n: u32,
    solutions: Vec<u32>,
    backtracks: u64,
    nodes_explored: u64,
    propagations: u64,
    budget_exceeded: bool,
}

#[wasm_bindgen]
impl ThermoSolveResult {
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

    /// Search-tree nodes the solver visited (assignments made).
    #[wasm_bindgen(getter, js_name = nodesExplored)]
    pub fn nodes_explored(&self) -> u64 {
        self.nodes_explored
    }

    /// Domain-propagation steps the solver performed (AC-3/GAC revisions).
    #[wasm_bindgen(getter)]
    pub fn propagations(&self) -> u64 {
        self.propagations
    }

    /// Flat solution buffer, `solution_count * (n*n)²` cells (bulk copy).
    #[wasm_bindgen(getter)]
    pub fn solutions(&self) -> Vec<u32> {
        self.solutions.clone()
    }

    /// `true` when the search hit the node budget before exhausting the space.
    #[wasm_bindgen(getter, js_name = budgetExceeded)]
    pub fn budget_exceeded(&self) -> bool {
        self.budget_exceeded
    }
}

/// A generated Thermo-Sudoku puzzle. `board` is the dense row-major given grid
/// (`0` = blank); `thermometers` is the length-prefixed flat tube buffer
/// (`[k, c, c, …]` per tube).
#[wasm_bindgen]
pub struct ThermoPuzzleData {
    board: Vec<u32>,
    thermometers: Vec<u32>,
    n: u32,
}

#[wasm_bindgen]
impl ThermoPuzzleData {
    /// Dense row-major given grid, `(n*n)²` cells, `0` = blank.
    #[wasm_bindgen(getter)]
    pub fn board(&self) -> Vec<u32> {
        self.board.clone()
    }

    /// Length-prefixed flat thermometer buffer: `[k0, c0_0, …, k1, c1_0, …]`,
    /// each tube's `k` cells (bulb → tip) following its count.
    #[wasm_bindgen(getter)]
    pub fn thermometers(&self) -> Vec<u32> {
        self.thermometers.clone()
    }

    /// Sub-grid size (2, 3, or 4).
    #[wasm_bindgen(getter)]
    pub fn n(&self) -> u32 {
        self.n
    }
}

/// Decode the length-prefixed flat tube buffer into thermometers, rejecting a
/// truncated buffer, a degenerate (<2-cell) tube, or an out-of-range cell with a
/// coded `INVALID_INPUT` error rather than solving it silently.
fn decode_thermometers(flat: &[u32], total: usize) -> Result<Vec<Thermometer>, JsValue> {
    let mut thermos = Vec::new();
    let mut i = 0usize;
    while i < flat.len() {
        let k = flat[i] as usize;
        i += 1;
        if k < 2 {
            return Err(coded_error(
                "INVALID_INPUT",
                &format!("thermometer must have at least 2 cells (got {k})"),
            ));
        }
        if i + k > flat.len() {
            return Err(coded_error(
                "INVALID_INPUT",
                "thermometer buffer is truncated — a tube's cell count overruns the buffer",
            ));
        }
        let mut cells = Vec::with_capacity(k);
        for &c in &flat[i..i + k] {
            let c = c as usize;
            if c >= total {
                return Err(coded_error(
                    "INVALID_INPUT",
                    &format!("thermometer cell {c} out of range (board has {total} cells)"),
                ));
            }
            cells.push(c);
        }
        i += k;
        thermos.push(cells);
    }
    Ok(thermos)
}

/// Encode thermometers into the length-prefixed flat wire buffer.
fn encode_thermometers(thermos: &[Thermometer]) -> Vec<u32> {
    let mut out = Vec::new();
    for t in thermos {
        out.push(t.len() as u32);
        out.extend(t.iter().map(|&c| c as u32));
    }
    out
}

/// Validate the board length for sub-grid size `n`, returning the cell total.
fn board_total(board: &[u32], n: u32) -> Result<usize, JsValue> {
    let m = (n * n) as usize;
    let total = m * m;
    if board.len() != total {
        return Err(coded_error(
            "INVALID_INPUT",
            &format!(
                "board length {} does not match (n*n)² = {total} for n = {n}",
                board.len()
            ),
        ));
    }
    Ok(total)
}

/// Solve a flat, row-major Thermo-Sudoku board (`0` = blank) with a
/// length-prefixed thermometer buffer.
///
/// Uses the same AC-3 + MRV config the sudoku/futoshiki wires use — the F1
/// production override, not the pathological library default. `node_budget`
/// mirrors [`SolveConfig::node_budget`] (pass `None`/`0` for the 1,000,000-node
/// default). A budget exhausted with zero solutions throws a typed
/// `BUDGET_EXCEEDED` error; `solved: false` is reserved for a provably
/// no-completion board.
#[wasm_bindgen(js_name = solveThermo)]
pub fn solve_thermo(
    board: Vec<u32>,
    n: u32,
    thermometers: Vec<u32>,
    max_solutions: Option<usize>,
    node_budget: Option<u32>,
) -> Result<ThermoSolveResult, JsValue> {
    let total = board_total(&board, n)?;
    let thermos = decode_thermometers(&thermometers, total)?;

    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions: max_solutions.unwrap_or(1).max(1),
        node_budget: node_budget.map(u64::from).or(Some(1_000_000)),
        ..Default::default()
    };

    let (mut csp, given) = create_thermo_csp(&board, n, &thermos);
    let solutions = csp.solve_with_given(&config, &given);
    let stats = csp.stats();
    let backtracks = stats.backtracks;
    let nodes_explored = stats.nodes_explored;
    let propagations = stats.propagations;
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

    Ok(ThermoSolveResult {
        solved: solution_count > 0,
        solution_count,
        n,
        solutions: flatten_solutions(&solutions),
        backtracks,
        nodes_explored,
        propagations,
        budget_exceeded,
    })
}

/// Constraint-propagate a flat, row-major Thermo-Sudoku board (`0` = blank) with
/// its length-prefixed thermometer buffer WITHOUT searching, returning each
/// cell's surviving-candidate set as a bitmask — the engine-domains pencil-marks
/// surface, the Thermo twin of `propagateSudoku`.
///
/// One `u32` per cell (crosses as a `Uint32Array`); bit `v` set iff value `v`
/// (1-based) survives. The thermometer `less_than` chains sharpen the fixpoint —
/// a tube's bulb loses the top values, its tip the bottom — so a Thermo peek is
/// strictly more informative than a bare Sudoku one. A board whose filled cells
/// or tubes contradict throws a typed `UNSAT` error.
#[wasm_bindgen(js_name = propagateThermo)]
pub fn propagate_thermo(
    board: Vec<u32>,
    n: u32,
    thermometers: Vec<u32>,
) -> Result<Vec<u32>, JsValue> {
    let total = board_total(&board, n)?;
    let thermos = decode_thermometers(&thermometers, total)?;

    let (mut csp, given) = create_thermo_csp(&board, n, &thermos);

    // Pin the givens: the same singleton restriction `solve_with_given` opens
    // with (O(1) bitmask restrict; the removed-values iterator is dropped — the
    // mutation is eager).
    for (var, val) in &given {
        let _ = csp.variables[*var as usize].domain.restrict_to(val);
    }

    if csp.propagate().is_err() {
        return Err(coded_error(
            "UNSAT",
            "the filled cells or thermometers contradict each other — some cell has no \
             surviving candidate",
        ));
    }

    Ok(domain_masks(&csp.variables))
}

/// Generate a flat, row-major Thermo-Sudoku puzzle for `n` and `difficulty`.
///
/// `seed` supplies the RNG entropy — pass `Date.now()` or a
/// `crypto.getRandomValues` draw. Returns the dense given grid plus the
/// length-prefixed thermometer buffer; the same `n` + `difficulty` + `seed`
/// yields the same puzzle here as native `generate_thermo_seeded`.
#[wasm_bindgen(js_name = generateThermo)]
pub fn generate_thermo(
    n: u32,
    difficulty: SudokuDifficulty,
    seed: f64,
) -> Result<ThermoPuzzleData, JsError> {
    let m = (n * n) as usize;
    if m * m == 0 {
        return Err(JsError::new("n must be >= 1"));
    }
    // JS numbers are f64; `Date.now()` and typical seeds are exact integers
    // below 2^53. Reinterpret to a u64 seed for the LCG.
    let seed_u64 = seed as u64;

    let (board, thermos) = thermo::generate_thermo_seeded(n, difficulty.into(), seed_u64);

    Ok(ThermoPuzzleData {
        board,
        thermometers: encode_thermometers(&thermos),
        n,
    })
}

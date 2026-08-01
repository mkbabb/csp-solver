//! Flat-index Killer-Sudoku wire for client-side solve + generate + propagate.
//!
//! The purpose-built browser surface for the T4-W13 `CageSum` consumer — the
//! fourth puzzle module beside `sudoku`, `futoshiki`, and `thermo`, sharing their
//! flat-buffer discipline: nothing crossing the wasm boundary is a string-keyed
//! map.
//!
//! Boards are flat, row-major `Uint32Array`s of length `(n*n)²`, `0` for a blank
//! cell — identical to the sudoku wire (Killer-Sudoku *is* a Sudoku variant). The
//! cage furniture crosses as a *separate* flat `Uint32Array`, each cage
//! **length-prefixed with its sum**: `[k0, s0, c0_0, …, k1, s1, c1_0, …]` — a
//! count `k`, then the target sum `s`, then `k` cell indices. Length-prefixing
//! (not the fixed pairs the futoshiki caret wire uses) lets a variable-size cage
//! ride the same tier-2 bulk `memcpy` `Uint32Array` with no per-cell reflection.
//!
//! Difficulty reuses [`SudokuDifficulty`](crate::SudokuDifficulty) verbatim — a
//! Killer-Sudoku's tiers ARE the sudoku keep bands, so no fourth wire mirror is
//! minted (the `difficulty_parity` discipline).
//!
//! Generation takes an explicit `seed` from JS (the native generator's
//! `SystemTime::now()` panics on `wasm32-unknown-unknown`); the same seed yields
//! the same puzzle on native and wasm — the parity invariant.

use wasm_bindgen::prelude::*;

use csp_solver::domain::Domain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::killer::{self, KillerCage, create_killer_csp};
use csp_solver::{Pruning, SolveConfig};

use crate::SudokuDifficulty;
use crate::errors::{board_total, coded_error, domain_masks, flatten_solutions};

/// Result of [`solve_killer`]. `solutions` is a flat concatenation of
/// `solution_count` boards, each `(n*n)²` cells, row-major.
#[wasm_bindgen]
pub struct KillerSolveResult {
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
impl KillerSolveResult {
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

/// A generated Killer-Sudoku puzzle. `board` is the dense row-major given grid
/// (`0` = blank); `cages` is the length-prefixed flat cage buffer
/// (`[k, s, c, …]` per cage).
#[wasm_bindgen]
pub struct KillerPuzzleData {
    board: Vec<u32>,
    cages: Vec<u32>,
    n: u32,
}

#[wasm_bindgen]
impl KillerPuzzleData {
    /// Dense row-major given grid, `(n*n)²` cells, `0` = blank.
    #[wasm_bindgen(getter)]
    pub fn board(&self) -> Vec<u32> {
        self.board.clone()
    }

    /// Length-prefixed flat cage buffer: `[k0, s0, c0_0, …, k1, s1, c1_0, …]`,
    /// each cage's count `k`, sum `s`, then its `k` cells.
    #[wasm_bindgen(getter)]
    pub fn cages(&self) -> Vec<u32> {
        self.cages.clone()
    }

    /// Sub-grid size (2, 3, or 4).
    #[wasm_bindgen(getter)]
    pub fn n(&self) -> u32 {
        self.n
    }
}

/// Decode the length-prefixed flat cage buffer into cages, rejecting a truncated
/// buffer, a degenerate (0-cell) cage, or an out-of-range cell with a coded
/// `INVALID_INPUT` error rather than solving it silently.
fn decode_cages(flat: &[u32], total: usize) -> Result<Vec<KillerCage>, JsValue> {
    let mut cages = Vec::new();
    let mut i = 0usize;
    while i < flat.len() {
        let k = flat[i] as usize;
        i += 1;
        if k == 0 {
            return Err(coded_error(
                "INVALID_INPUT",
                "cage must have at least 1 cell (got 0)",
            ));
        }
        if i >= flat.len() {
            return Err(coded_error(
                "INVALID_INPUT",
                "cage buffer is truncated — a cage's sum overruns the buffer",
            ));
        }
        let sum = flat[i];
        i += 1;
        if i + k > flat.len() {
            return Err(coded_error(
                "INVALID_INPUT",
                "cage buffer is truncated — a cage's cell count overruns the buffer",
            ));
        }
        let mut cells = Vec::with_capacity(k);
        for &c in &flat[i..i + k] {
            let c = c as usize;
            if c >= total {
                return Err(coded_error(
                    "INVALID_INPUT",
                    &format!("cage cell {c} out of range (board has {total} cells)"),
                ));
            }
            cells.push(c);
        }
        i += k;
        cages.push(KillerCage { sum, cells });
    }
    Ok(cages)
}

/// Encode cages into the length-prefixed flat wire buffer.
fn encode_cages(cages: &[KillerCage]) -> Vec<u32> {
    let mut out = Vec::new();
    for cage in cages {
        out.push(cage.cells.len() as u32);
        out.push(cage.sum);
        out.extend(cage.cells.iter().map(|&c| c as u32));
    }
    out
}

/// Solve a flat, row-major Killer-Sudoku board (`0` = blank) with a
/// length-prefixed cage buffer.
///
/// Uses the same AC-3 + MRV config the sudoku/futoshiki/thermo wires use — the F1
/// production override, not the pathological library default. `node_budget`
/// mirrors [`SolveConfig::node_budget`] (pass `None`/`0` for the 1,000,000-node
/// default). A budget exhausted with zero solutions throws a typed
/// `BUDGET_EXCEEDED` error; `solved: false` is reserved for a provably
/// no-completion board.
#[wasm_bindgen(js_name = solveKiller)]
pub fn solve_killer(
    board: Vec<u32>,
    n: u32,
    cages: Vec<u32>,
    max_solutions: Option<usize>,
    node_budget: Option<u32>,
) -> Result<KillerSolveResult, JsValue> {
    let total = board_total(&board, n * n)?;
    let cage_vec = decode_cages(&cages, total)?;

    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions: max_solutions.unwrap_or(1).max(1),
        node_budget: node_budget.map(u64::from).or(Some(1_000_000)),
        ..Default::default()
    };

    let (mut csp, given) = create_killer_csp(&board, n, &cage_vec);
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

    Ok(KillerSolveResult {
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

/// Constraint-propagate a flat, row-major Killer-Sudoku board (`0` = blank) with
/// its length-prefixed cage buffer WITHOUT searching, returning each cell's
/// surviving-candidate set as a bitmask — the engine-domains pencil-marks
/// surface, the Killer twin of `propagateSudoku`.
///
/// One `u32` per cell (crosses as a `Uint32Array`); bit `v` set iff value `v`
/// (1-based) survives. The cage `CageSum` + all-different sharpen the fixpoint —
/// a low-sum cage loses its high candidates — so a Killer peek is strictly more
/// informative than a bare Sudoku one. A board whose filled cells or cages
/// contradict throws a typed `UNSAT` error.
#[wasm_bindgen(js_name = propagateKiller)]
pub fn propagate_killer(board: Vec<u32>, n: u32, cages: Vec<u32>) -> Result<Vec<u32>, JsValue> {
    let total = board_total(&board, n * n)?;
    let cage_vec = decode_cages(&cages, total)?;

    let (mut csp, given) = create_killer_csp(&board, n, &cage_vec);

    // Pin the givens: the same singleton restriction `solve_with_given` opens
    // with (O(1) bitmask restrict; the removed-values iterator is dropped — the
    // mutation is eager).
    for (var, val) in &given {
        let _ = csp.variables[*var as usize].domain.restrict_to(val);
    }

    if csp.propagate().is_err() {
        return Err(coded_error(
            "UNSAT",
            "the filled cells or cages contradict each other — some cell has no \
             surviving candidate",
        ));
    }

    Ok(domain_masks(&csp.variables))
}

/// Generate a flat, row-major Killer-Sudoku puzzle for `n` and `difficulty`.
///
/// `seed` supplies the RNG entropy — pass `Date.now()` or a
/// `crypto.getRandomValues` draw. Returns the dense given grid plus the
/// length-prefixed cage buffer; the same `n` + `difficulty` + `seed` yields the
/// same puzzle here as native `generate_killer_seeded`.
///
/// `n = 0` throws a typed error (`instanceof Error`, `.code ===
/// "INVALID_INPUT"`) — the same discriminant every other verb on this wire
/// throws.
#[wasm_bindgen(js_name = generateKiller)]
pub fn generate_killer(
    n: u32,
    difficulty: SudokuDifficulty,
    seed: f64,
) -> Result<KillerPuzzleData, JsValue> {
    let m = (n * n) as usize;
    if m * m == 0 {
        return Err(coded_error("INVALID_INPUT", "n must be >= 1"));
    }
    // JS numbers are f64; `Date.now()` and typical seeds are exact integers
    // below 2^53. Reinterpret to a u64 seed for the LCG.
    let seed_u64 = seed as u64;

    let (board, cages) = killer::generate_killer_seeded(n, difficulty.into(), seed_u64);

    Ok(KillerPuzzleData {
        board,
        cages: encode_cages(&cages),
        n,
    })
}

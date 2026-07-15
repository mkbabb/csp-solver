//! Flat-index KenKen / Calcudoku wire for client-side solve + generate + propagate.
//!
//! The purpose-built browser surface for the T4-W13 second cage-primitive consumer
//! — the fifth puzzle module beside `sudoku`, `futoshiki`, `thermo`, and `killer`,
//! sharing their flat-buffer discipline: nothing crossing the wasm boundary is a
//! string-keyed map.
//!
//! Boards are flat, row-major `Uint32Array`s of length `board_size²`, `0` for a
//! blank cell — the Latin-square layout (KenKen *is* a Latin family, like
//! Futoshiki), so `board_size` is the board side directly (values `1..=board_size`),
//! never Sudoku's sub-grid `n` (F5). The cage furniture crosses as a *separate* flat
//! `Uint32Array`, each cage **length-prefixed with its operator and target**:
//! `[k0, op0, t0, c0_0, …, k1, op1, t1, c1_0, …]` — a count `k`, an operator ordinal
//! (`+ =0`, `− =1`, `× =2`, `÷ =3`), the target `t`, then `k` cell indices.
//!
//! Difficulty reuses [`FutoshikiDifficulty`](crate::FutoshikiDifficulty) verbatim —
//! KenKen is a Latin family, so its tiers ARE the futoshiki axis and no fifth wire
//! mirror is minted (the `difficulty_parity` discipline).
//!
//! Generation takes an explicit `seed` from JS (the native generator's
//! `SystemTime::now()` panics on `wasm32-unknown-unknown`); the same seed yields the
//! same puzzle on native and wasm — the parity invariant.

use wasm_bindgen::prelude::*;

use csp_solver::domain::Domain;
use csp_solver::ordering::Ordering;
use csp_solver::puzzles::kenken::{self, CageOp, KenKenCage, create_kenken_csp};
use csp_solver::{Pruning, SolveConfig};

use crate::FutoshikiDifficulty;
use crate::errors::{coded_error, domain_masks, flatten_solutions};

/// Result of [`solve_kenken`]. `solutions` is a flat concatenation of
/// `solution_count` boards, each `board_size²` cells, row-major.
#[wasm_bindgen]
pub struct KenKenSolveResult {
    solved: bool,
    solution_count: usize,
    board_size: u32,
    solutions: Vec<u32>,
    backtracks: u64,
    nodes_explored: u64,
    propagations: u64,
    budget_exceeded: bool,
}

#[wasm_bindgen]
impl KenKenSolveResult {
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

    /// Board side length the puzzle was solved at. Named `boardSize`, never bare
    /// `n`/`size` — the Latin-family convention (F5).
    #[wasm_bindgen(getter, js_name = boardSize)]
    pub fn board_size(&self) -> u32 {
        self.board_size
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

    /// Flat solution buffer, `solution_count * board_size²` cells (bulk copy).
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

/// A generated KenKen puzzle. `board` is the dense row-major given grid (`0` =
/// blank — usually all-blank for KenKen); `cages` is the length-prefixed flat cage
/// buffer (`[k, op, t, c, …]` per cage).
#[wasm_bindgen]
pub struct KenKenPuzzleData {
    board: Vec<u32>,
    cages: Vec<u32>,
    board_size: u32,
}

#[wasm_bindgen]
impl KenKenPuzzleData {
    /// Dense row-major given grid, `board_size²` cells, `0` = blank.
    #[wasm_bindgen(getter)]
    pub fn board(&self) -> Vec<u32> {
        self.board.clone()
    }

    /// Length-prefixed flat cage buffer: `[k0, op0, t0, c0_0, …, k1, op1, t1, c1_0, …]`,
    /// each cage's count `k`, operator ordinal `op`, target `t`, then its `k` cells.
    #[wasm_bindgen(getter)]
    pub fn cages(&self) -> Vec<u32> {
        self.cages.clone()
    }

    /// Board side length (values run `1..=board_size`).
    #[wasm_bindgen(getter, js_name = boardSize)]
    pub fn board_size(&self) -> u32 {
        self.board_size
    }
}

/// Decode the length-prefixed flat cage buffer into cages, rejecting a truncated
/// buffer, a degenerate (0-cell) cage, an unknown operator ordinal, a `−`/`÷` cage
/// that is not exactly 2 cells, or an out-of-range cell with a coded `INVALID_INPUT`
/// error rather than solving it silently.
fn decode_cages(flat: &[u32], total: usize) -> Result<Vec<KenKenCage>, JsValue> {
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
        if i + 1 >= flat.len() {
            return Err(coded_error(
                "INVALID_INPUT",
                "cage buffer is truncated — a cage's operator/target overruns the buffer",
            ));
        }
        let op = CageOp::from_ordinal(flat[i]).ok_or_else(|| {
            coded_error(
                "INVALID_INPUT",
                &format!("unknown cage operator ordinal {} (expected 0..=3)", flat[i]),
            )
        })?;
        i += 1;
        let target = flat[i];
        i += 1;
        if i + k > flat.len() {
            return Err(coded_error(
                "INVALID_INPUT",
                "cage buffer is truncated — a cage's cell count overruns the buffer",
            ));
        }
        if op.is_binary() && k != 2 {
            return Err(coded_error(
                "INVALID_INPUT",
                &format!("a {op:?} cage must be exactly 2 cells (got {k})"),
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
        cages.push(KenKenCage { op, target, cells });
    }
    Ok(cages)
}

/// Encode cages into the length-prefixed flat wire buffer.
fn encode_cages(cages: &[KenKenCage]) -> Vec<u32> {
    let mut out = Vec::new();
    for cage in cages {
        out.push(cage.cells.len() as u32);
        out.push(cage.op.ordinal());
        out.push(cage.target);
        out.extend(cage.cells.iter().map(|&c| c as u32));
    }
    out
}

/// Validate the board length for board side `board_size`, returning the cell total.
fn board_total(board: &[u32], board_size: u32) -> Result<usize, JsValue> {
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
    Ok(total)
}

/// Solve a flat, row-major KenKen board (`0` = blank) with a length-prefixed cage
/// buffer.
///
/// Uses the same AC-3 + MRV config the sudoku/futoshiki/thermo/killer wires use — the
/// F1 production override, not the pathological library default. `node_budget`
/// mirrors [`SolveConfig::node_budget`] (pass `None`/`0` for the 1,000,000-node
/// default). A budget exhausted with zero solutions throws a typed `BUDGET_EXCEEDED`
/// error; `solved: false` is reserved for a provably no-completion board.
#[wasm_bindgen(js_name = solveKenKen)]
pub fn solve_kenken(
    board: Vec<u32>,
    board_size: u32,
    cages: Vec<u32>,
    max_solutions: Option<usize>,
    node_budget: Option<u32>,
) -> Result<KenKenSolveResult, JsValue> {
    let total = board_total(&board, board_size)?;
    let cage_vec = decode_cages(&cages, total)?;

    let config = SolveConfig {
        pruning: Pruning::Ac3,
        ordering: Ordering::Mrv,
        max_solutions: max_solutions.unwrap_or(1).max(1),
        node_budget: node_budget.map(u64::from).or(Some(1_000_000)),
        ..Default::default()
    };

    let (mut csp, given) = create_kenken_csp(&board, board_size, &cage_vec);
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

    Ok(KenKenSolveResult {
        solved: solution_count > 0,
        solution_count,
        board_size,
        solutions: flatten_solutions(&solutions),
        backtracks,
        nodes_explored,
        propagations,
        budget_exceeded,
    })
}

/// Constraint-propagate a flat, row-major KenKen board (`0` = blank) with its
/// length-prefixed cage buffer WITHOUT searching, returning each cell's
/// surviving-candidate set as a bitmask — the engine-domains pencil-marks surface,
/// the KenKen twin of `propagateFutoshiki`.
///
/// One `u32` per cell (crosses as a `Uint32Array`); bit `v` set iff value `v`
/// (1-based) survives. The cage `CageSum`/`CageProduct`/binary constraints sharpen
/// the fixpoint — a low-target cage loses its high candidates — so a KenKen peek is
/// strictly more informative than a bare Latin one. A board whose filled cells or
/// cages contradict throws a typed `UNSAT` error.
#[wasm_bindgen(js_name = propagateKenKen)]
pub fn propagate_kenken(
    board: Vec<u32>,
    board_size: u32,
    cages: Vec<u32>,
) -> Result<Vec<u32>, JsValue> {
    let total = board_total(&board, board_size)?;
    let cage_vec = decode_cages(&cages, total)?;

    let (mut csp, given) = create_kenken_csp(&board, board_size, &cage_vec);

    // Pin the givens: the same singleton restriction `solve_with_given` opens with
    // (O(1) bitmask restrict; the removed-values iterator is dropped — the mutation
    // is eager).
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

/// Generate a flat, row-major KenKen puzzle for `board_size` and `difficulty`.
///
/// `seed` supplies the RNG entropy — pass `Date.now()` or a `crypto.getRandomValues`
/// draw. Returns the dense given grid (usually all-blank) plus the length-prefixed
/// cage buffer; the same `board_size` + `difficulty` + `seed` yields the same puzzle
/// here as native `generate_kenken_seeded`. `board_size` outside `3..=9` throws
/// `INVALID_INPUT`.
#[wasm_bindgen(js_name = generateKenKen)]
pub fn generate_kenken(
    board_size: u32,
    difficulty: FutoshikiDifficulty,
    seed: f64,
) -> Result<KenKenPuzzleData, JsValue> {
    if !(3..=9).contains(&board_size) {
        return Err(coded_error(
            "INVALID_INPUT",
            &format!("board_size {board_size} out of range [3, 9] (KenKen scope)"),
        ));
    }
    // JS numbers are f64; `Date.now()` and typical seeds are exact integers below
    // 2^53. Reinterpret to a u64 seed for the LCG.
    let seed_u64 = seed as u64;

    let (board, cages) = kenken::generate_kenken_seeded(board_size, difficulty.into(), seed_u64);

    Ok(KenKenPuzzleData {
        board,
        cages: encode_cages(&cages),
        board_size,
    })
}

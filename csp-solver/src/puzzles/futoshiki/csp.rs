//! Futoshiki CSP construction and solving.
//!
//! Flat, row-major boards of `n²` cells, `0` = empty — the wire every other
//! family in `puzzles::` takes. The clue furniture is the inequality set:
//! `(a, b)` pairs meaning `board[a] > board[b]`, each pair orthogonally
//! adjacent (a caret can only sit on a shared cell edge).
//!
//! `create_futoshiki_csp(board, n, inequalities) -> (Csp, given)` and
//! `solve_futoshiki(board, n, inequalities, config)` are the five-family shape
//! — sudoku, thermo, killer and kenken name the same two seams. Until T5-W2
//! this module took a sparse `FutoshikiPuzzle` struct and baked its own solve
//! policy; the struct is gone and the policy is the caller's, as everywhere
//! else.

use crate::constraint::VarId;
use crate::domain::bitset::BitsetDomain;
use crate::error::CspError;
use crate::puzzles::sudoku::csp::sudoku_given;
use crate::{Csp, SolveConfig};

/// Parse the CSC411 CLI text format into `(n, board, inequalities)`:
///
/// ```text
/// N
/// L0 L1 ... (cell indices with fixed values)
/// V0 V1 ... (corresponding values)
/// A0 A1 ... (greater-than left sides)
/// B0 B1 ... (greater-than right sides)
/// ```
///
/// The reader for the assignment's own fixture format, consumed by
/// `tests/futoshiki.rs` and `tests/oracle_and_invariance.rs`. It must **not**
/// reach a network boundary (F11): it panics on malformed input, where
/// [`validate_futoshiki`] returns a typed error.
pub fn parse_futoshiki(input: &str) -> (u32, Vec<u32>, Vec<(usize, usize)>) {
    let mut lines = input.lines();
    let n: u32 = lines.next().unwrap().trim().parse().unwrap();

    let ints = |line: Option<&str>| -> Vec<usize> {
        line.unwrap()
            .split_whitespace()
            .map(|s| s.parse().unwrap())
            .collect()
    };

    let cells = ints(lines.next());
    let values = ints(lines.next());
    let mut board = vec![0u32; (n * n) as usize];
    for (&cell, &value) in cells.iter().zip(&values) {
        board[cell] = value as u32;
    }

    let left = ints(lines.next());
    let right = ints(lines.next());
    let inequalities: Vec<(usize, usize)> = left.into_iter().zip(right).collect();

    (n, board, inequalities)
}

/// Structural validation of wire-supplied puzzle parts — the network-facing
/// gate. It rejects invalid input up front with the existing
/// [`CspError::InvalidInput`], minting no bespoke error variant:
///
/// - `board` is exactly `n²` cells, every value in `0..=n`;
/// - every inequality index `< n²`, and each pair orthogonally adjacent
///   (`|Δrow| + |Δcol| == 1`) — the only relation a boundary caret can render,
///   so a valid-per-solver but unrenderable-per-frontend pair (opposite
///   corners, say) is rejected here rather than solved silently.
///
/// One implementation serves every boundary (wasm, PyO3, HTTP), so they all
/// reject the exact same inputs. [`create_futoshiki_csp`] does *not* call it:
/// in-crate callers (the generator, the benches) build their own boards, and
/// the walk is paid only where the input is untrusted.
pub fn validate_futoshiki(
    board: &[u32],
    n: u32,
    inequalities: &[(usize, usize)],
) -> Result<(), CspError> {
    let nn = n as usize;
    let total = nn * nn;

    if board.len() != total {
        return Err(CspError::invalid_input(format!(
            "board length {} does not match n² = {total} for a {n}×{n} board",
            board.len()
        )));
    }

    for (cell, &value) in board.iter().enumerate() {
        if value as usize > nn {
            return Err(CspError::invalid_input(format!(
                "cell {cell} value {value} out of range for a {n}×{n} board (must be 0..={n})"
            )));
        }
    }

    for &(a, b) in inequalities {
        if a >= total || b >= total {
            return Err(CspError::invalid_input(format!(
                "inequality pair ({a}, {b}) out of range for a {n}×{n} board \
                 (both indices must be < {total})"
            )));
        }
        let (ra, ca) = (a / nn, a % nn);
        let (rb, cb) = (b / nn, b % nn);
        let manhattan = ra.abs_diff(rb) + ca.abs_diff(cb);
        if manhattan != 1 {
            return Err(CspError::invalid_input(format!(
                "inequality pair ({a}, {b}) is not orthogonally adjacent: cells \
                 ({ra},{ca}) and ({rb},{cb}) are Manhattan distance {manhattan} apart, \
                 but a caret can only sit on a shared cell edge (distance 1)"
            )));
        }
    }

    Ok(())
}

/// Create a Futoshiki CSP from a flat board array where `0` = empty cell.
///
/// `n` is the board side (values run `1..=n`) — the Latin-family convention,
/// never Sudoku's sub-grid `n`. `inequalities` are the `(a, b)` caret pairs,
/// each meaning `board[a] > board[b]`.
///
/// Returns the CSP (finalized) and the given values for `solve_with_given`.
pub fn create_futoshiki_csp(
    board: &[u32],
    n: u32,
    inequalities: &[(usize, usize)],
) -> (Csp<BitsetDomain>, Vec<(VarId, u32)>) {
    let total = (n * n) as usize;
    assert_eq!(board.len(), total, "board must have n*n = {total} elements");

    let mut csp = Csp::new();
    let domain = BitsetDomain::new(1..=n);

    for _ in 0..total {
        csp.add_variable(domain.clone());
    }

    // Inequality constraints: cell_a > cell_b.
    for &(a, b) in inequalities {
        csp.add_greater_than(a as VarId, b as VarId);
    }

    // Row all-different.
    for i in 0..n {
        let row: Vec<VarId> = (0..n).map(|j| (i * n + j) as VarId).collect();
        csp.add_all_different(row);
    }

    // Column all-different.
    for j in 0..n {
        let col: Vec<VarId> = (0..n).map(|i| (i * n + j) as VarId).collect();
        csp.add_all_different(col);
    }

    csp.finalize();

    // The same non-zero-cells-as-(VarId, value) extraction the other four
    // families use: givens ride the search's given path instead of a wall of
    // `add_equals` constraints, so one skeleton serves every board.
    let given = sudoku_given(board);
    (csp, given)
}

/// Solve a Futoshiki puzzle under `config`. Returns `None` if unsolvable.
///
/// **F1 production override.** Every shipped caller passes `Ac3` + `Mrv`. The
/// library default (`ForwardChecking` + `FailFirst`) cannot find a first
/// solution to an *empty* N≥6 board inside the 1M-node budget (measured: 4.56M
/// backtracks at N=6, budget-dead); `Ac3` + `Mrv` solves N=4–9 empty boards in
/// 0 backtracks, sub-0.1 ms each. Regression guarded at N=6/7 in
/// `tests/futoshiki.rs`. The policy is the caller's here exactly as it is for
/// the other four families — it is not baked into this function.
pub fn solve_futoshiki(
    board: &[u32],
    n: u32,
    inequalities: &[(usize, usize)],
    config: &SolveConfig,
) -> Option<Vec<u32>> {
    let (mut csp, given) = create_futoshiki_csp(board, n, inequalities);
    csp.solve_with_given(config, &given).into_iter().next()
}

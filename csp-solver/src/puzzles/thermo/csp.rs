//! Thermo-Sudoku CSP construction and solving.
//!
//! A Thermo-Sudoku board is a standard Sudoku (row/column/box all-different)
//! plus *thermometer* clue furniture. A thermometer is an orthogonally-adjacent
//! path of cells whose values strictly increase from the bulb to the tip; each
//! consecutive pair along the tube is a binary `less_than`, so a thermometer of
//! length `k` compiles to `k − 1` binary constraints — the **free propagation
//! path** (`csp/traits.rs` binary revise), never an n-ary lambda. Thermo-Sudoku
//! therefore ships with **zero new engine constraints**: it is the contract
//! proof for W11's [`PuzzleClass`](crate::PuzzleClass), the smallest surface a
//! third family can land on.

use crate::constraint::VarId;
use crate::domain::bitset::BitsetDomain;
use crate::puzzles::sudoku::csp::sudoku_given;
use crate::{Csp, SolveConfig};

/// A thermometer: cell indices from the bulb (smallest value) to the tip
/// (largest), each orthogonally adjacent to the last. The solution's values
/// strictly increase along it. The THIRD `PuzzleClass::Clue` kind — distinct
/// from sudoku's `()` and futoshiki's `(a, b)` caret.
pub type Thermometer = Vec<usize>;

/// Build a finalized Thermo-Sudoku CSP from a dense board (`0` = empty) for
/// sub-grid size `n`, plus the thermometer furniture. Returns the CSP and the
/// given values for [`Csp::solve_with_given`].
///
/// The Sudoku skeleton is the same row/column/box all-different structure
/// [`sudoku_csp_skeleton`](crate::puzzles::sudoku::csp::sudoku_csp_skeleton)
/// builds; the thermometers add `less_than` chains along each tube BEFORE
/// `finalize` (the binary sugar must be present when the adjacency graph is
/// built). No thermometer touches `constraint/`: each edge is
/// [`Csp::add_less_than`], the binary path that already propagates.
pub fn create_thermo_csp(
    board: &[u32],
    n: u32,
    thermometers: &[Thermometer],
) -> (Csp<BitsetDomain>, Vec<(VarId, u32)>) {
    let m = n * n;
    let total = (m * m) as usize;
    assert_eq!(board.len(), total, "board must have M*M = {total} elements");

    let mut csp = Csp::new();
    let domain = BitsetDomain::new(1..=m);

    for _ in 0..total {
        csp.add_variable(domain.clone());
    }

    // Sudoku skeleton: row / column / box all-different. Explicit push loops
    // (not iterator adapters) — the lean wasm pays for every distinct
    // `Range::map/flat_map` monomorphization, and this is a fresh function, so
    // the plain loops stay byte-frugal in the deploy build.
    let mut group: Vec<VarId> = Vec::with_capacity(m as usize);
    for r in 0..m {
        group.clear();
        for c in 0..m {
            group.push((r * m + c) as VarId);
        }
        csp.add_all_different(group.clone());
    }
    for c in 0..m {
        group.clear();
        for r in 0..m {
            group.push((r * m + c) as VarId);
        }
        csp.add_all_different(group.clone());
    }
    for bi in 0..n {
        for bj in 0..n {
            group.clear();
            for di in 0..n {
                for dj in 0..n {
                    group.push(((bi * n + di) * m + (bj * n + dj)) as VarId);
                }
            }
            csp.add_all_different(group.clone());
        }
    }

    // Thermometer chains: strictly increasing bulb → tip. Each consecutive pair
    // is a binary `less_than` (`board[a] < board[b]`) — the propagating path.
    for thermo in thermometers {
        for pair in thermo.windows(2) {
            csp.add_less_than(pair[0] as VarId, pair[1] as VarId);
        }
    }

    csp.finalize();

    // The given-cell extraction is the sudoku wire's — reuse it (already
    // compiled into the lean build) rather than mint a thermo-specific twin.
    let given = sudoku_given(board);
    (csp, given)
}

/// Solve a Thermo-Sudoku puzzle under `config`. Returns `None` if unsolvable.
pub fn solve_thermo(
    board: &[u32],
    n: u32,
    thermometers: &[Thermometer],
    config: &SolveConfig,
) -> Option<Vec<u32>> {
    let (mut csp, given) = create_thermo_csp(board, n, thermometers);
    csp.solve_with_given(config, &given).into_iter().next()
}

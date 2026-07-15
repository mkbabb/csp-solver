//! Killer-Sudoku CSP construction and solving.
//!
//! A Killer-Sudoku board is a standard Sudoku (row/column/box all-different)
//! whose cells are partitioned into *cages*: a cage is a contiguous group whose
//! cells are all-different (no repeat within a cage) and whose values sum to a
//! printed target. The sudoku all-different is the skeleton `sudoku` and
//! `thermo` already build; a cage adds one [`AllDifferent`](crate::Csp::add_all_different)
//! over its cells (skipped for a singleton — trivially satisfied) plus one
//! [`CageSum`](crate::Csp::add_cage_sum) = target.
//!
//! [`CageSum`] is the W13 lane-P primitive: an n-ary bounds-propagation
//! `revise_impl` that clears the engine's n-ary-lambda blindness wall (a cage
//! modelled as a 3+-variable lambda prunes nothing). Killer therefore ships
//! **zero new constraint code of its own** — it CONSUMES `CageSum`, exactly the
//! second-half of the contract Thermo's zero-constraint proof set up.

use crate::constraint::VarId;
use crate::domain::bitset::BitsetDomain;
use crate::puzzles::sudoku::csp::sudoku_given;
use crate::{Csp, SolveConfig};

/// A Killer cage: the cells that make it up (row-major flat indices) and the
/// target their values sum to. The FOURTH `PuzzleClass::Clue` kind — distinct
/// from sudoku's `()`, futoshiki's `(a, b)` caret, and thermo's `Vec<usize>`
/// tube. Its cells are all-different and (by construction) contiguous.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct KillerCage {
    /// The value the cage's cells sum to.
    pub sum: u32,
    /// The cage's cells, flat row-major indices (the smallest is the corner the
    /// sum label prints in).
    pub cells: Vec<usize>,
}

/// Build a finalized Killer-Sudoku CSP from a dense board (`0` = empty) for
/// sub-grid size `n`, plus the cage furniture. Returns the CSP and the given
/// values for [`Csp::solve_with_given`].
///
/// The Sudoku skeleton is the same row/column/box all-different structure
/// [`create_thermo_csp`](crate::puzzles::thermo::create_thermo_csp) builds; each
/// cage then adds its `AllDifferent` (≥2 cells) and `CageSum` BEFORE `finalize`
/// (the constraints must be present when the adjacency graph is built). No cage
/// touches `constraint/` beyond lane P's `CageSum`: `add_cage_sum` is the
/// devirtualized n-ary propagator, `add_all_different` the existing GAC.
pub fn create_killer_csp(
    board: &[u32],
    n: u32,
    cages: &[KillerCage],
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
    // `Range::map/flat_map` monomorphization, so plain loops stay byte-frugal.
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

    // Cage furniture: each cage's cells are all-different (skipped for a
    // singleton — no pair to differ) and sum to the target (the CageSum n-ary
    // propagator, lane P). Both are added before `finalize`.
    for cage in cages {
        let scope: Vec<VarId> = cage.cells.iter().map(|&c| c as VarId).collect();
        if scope.len() >= 2 {
            csp.add_all_different(scope.clone());
        }
        csp.add_cage_sum(scope, cage.sum);
    }

    csp.finalize();

    // Reuse the sudoku given-cell extraction (already compiled into the lean
    // build) rather than mint a killer-specific twin.
    let given = sudoku_given(board);
    (csp, given)
}

/// Solve a Killer-Sudoku puzzle under `config`. Returns `None` if unsolvable.
pub fn solve_killer(
    board: &[u32],
    n: u32,
    cages: &[KillerCage],
    config: &SolveConfig,
) -> Option<Vec<u32>> {
    let (mut csp, given) = create_killer_csp(board, n, cages);
    csp.solve_with_given(config, &given).into_iter().next()
}

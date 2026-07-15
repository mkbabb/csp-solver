//! KenKen / Calcudoku CSP construction and solving.
//!
//! A KenKen board is a plain `n×n` Latin square (row + column all-different, **no
//! sub-grid boxes**) whose cells partition into *cages*. Each cage carries an
//! operator and a target its cells produce:
//!
//! - `+` → one [`CageSum`](crate::Csp::add_cage_sum) = target (lane P's n-ary
//!   bounds propagator — shared with Killer);
//! - `×` → one [`CageProduct`](crate::Csp::add_cage_product) = target (lane P's
//!   n-ary product propagator — KenKen's exclusive consumer, over the clean
//!   `1..=n` no-zero product bounds);
//! - `−` / `÷` → a 2-cell binary [`LambdaConstraint`](crate::constraint::LambdaConstraint)
//!   (`|a − b| == target` / `max(a,b) / min(a,b) == target`, divisibility
//!   enforced). A 2-cell lambda propagates via the engine's free
//!   `revise_binary_default` path (Wall-1's binary sugar), so `−`/`÷` prune
//!   without any new constraint.
//!
//! KenKen therefore ships **zero new constraint code of its own** — it CONSUMES
//! `CageSum` + `CageProduct` (lane P) and the existing binary-lambda path, the
//! second half of the contract Thermo's zero-constraint proof + Killer's
//! `CageSum` consumption set up. Unlike Killer, KenKen cages do **not** carry an
//! `AllDifferent`: a KenKen cage may repeat a value across two cells that share
//! neither row nor column (the Latin constraint is the only all-different).

use crate::constraint::{LambdaConstraint, VarId};
use crate::domain::bitset::BitsetDomain;
use crate::puzzles::sudoku::csp::sudoku_given;
use crate::{Csp, SolveConfig};

/// A cage's arithmetic operator. `+`/`×` are n-ary (any cell count); `−`/`÷` are
/// strictly 2-cell (a binary relation). A singleton "given" cage is modelled as
/// [`CageOp::Add`] with the cell's own value as target (the [`CageSum`] pins it).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum CageOp {
    /// `Σ cells == target` — the [`CageSum`](crate::Csp::add_cage_sum) consumer.
    Add,
    /// `|a − b| == target` — a 2-cell binary lambda (propagates free).
    Sub,
    /// `Π cells == target` — the [`CageProduct`](crate::Csp::add_cage_product) consumer.
    Mul,
    /// `max(a,b) / min(a,b) == target` (min divides max) — a 2-cell binary lambda.
    Div,
}

impl CageOp {
    /// Stable wire ordinal (`Add=0`, `Sub=1`, `Mul=2`, `Div=3`) — the single
    /// source of the mapping the wasm cage codec round-trips.
    pub fn ordinal(self) -> u32 {
        match self {
            CageOp::Add => 0,
            CageOp::Sub => 1,
            CageOp::Mul => 2,
            CageOp::Div => 3,
        }
    }

    /// Decode a wire ordinal, or `None` for an out-of-range code.
    pub fn from_ordinal(o: u32) -> Option<CageOp> {
        match o {
            0 => Some(CageOp::Add),
            1 => Some(CageOp::Sub),
            2 => Some(CageOp::Mul),
            3 => Some(CageOp::Div),
            _ => None,
        }
    }

    /// Whether this operator is strictly 2-cell (`−`/`÷`). `+`/`×` are n-ary.
    pub fn is_binary(self) -> bool {
        matches!(self, CageOp::Sub | CageOp::Div)
    }
}

/// A KenKen cage: an operator, the target its cells produce under that operator,
/// and the cells (flat row-major indices, smallest is the corner the target
/// label prints in). The FIFTH `PuzzleClass::Clue` kind — distinct from sudoku's
/// `()`, futoshiki's `(a, b)`, thermo's `Vec<usize>`, and killer's `KillerCage`.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct KenKenCage {
    /// The arithmetic operator combining the cage's cells.
    pub op: CageOp,
    /// The value the cells produce under `op` (the corner label).
    pub target: u32,
    /// The cage's cells, flat row-major indices.
    pub cells: Vec<usize>,
}

/// Build a finalized KenKen CSP from a dense board (`0` = empty) for board side
/// `n`, plus the cage furniture. Returns the CSP and the given values for
/// [`Csp::solve_with_given`].
///
/// The Latin skeleton is row + column all-different over `n×n` variables of
/// domain `1..=n` — **no box constraint** (the KenKen geometry). Each cage then
/// adds its operator constraint BEFORE `finalize` (constraints must be present
/// when the adjacency graph is built): `+`→`add_cage_sum`, `×`→`add_cage_product`
/// (both lane P), `−`/`÷`→a binary lambda over the two cells. No cage authors a
/// propagator — every one is a consumed primitive or the free binary path.
///
/// A malformed `−`/`÷` cage (not exactly 2 cells) is skipped rather than
/// panicking; the wasm/native callers only ever build well-formed cages, and a
/// dropped binary cage degrades to a looser (still sound) puzzle rather than a
/// crash.
pub fn create_kenken_csp(
    board: &[u32],
    n: u32,
    cages: &[KenKenCage],
) -> (Csp<BitsetDomain>, Vec<(VarId, u32)>) {
    let total = (n * n) as usize;
    assert_eq!(board.len(), total, "board must have n*n = {total} elements");

    let mut csp = Csp::new();
    let domain = BitsetDomain::new(1..=n);

    for _ in 0..total {
        csp.add_variable(domain.clone());
    }

    // Latin skeleton: row + column all-different (NO box). Explicit push loops
    // (not iterator adapters) — the lean wasm pays for every distinct
    // `Range::map` monomorphization, so plain loops stay byte-frugal.
    let mut group: Vec<VarId> = Vec::with_capacity(n as usize);
    for r in 0..n {
        group.clear();
        for c in 0..n {
            group.push((r * n + c) as VarId);
        }
        csp.add_all_different(group.clone());
    }
    for c in 0..n {
        group.clear();
        for r in 0..n {
            group.push((r * n + c) as VarId);
        }
        csp.add_all_different(group.clone());
    }

    // Cage furniture: each cage's operator constraint. `+`/`×` are the lane-P
    // n-ary primitives (they prune past the n-ary wall); `−`/`÷` are 2-cell
    // binary lambdas (they prune via the free binary-revise path).
    for cage in cages {
        let scope: Vec<VarId> = cage.cells.iter().map(|&c| c as VarId).collect();
        match cage.op {
            CageOp::Add => csp.add_cage_sum(scope, cage.target),
            CageOp::Mul => csp.add_cage_product(scope, cage.target),
            CageOp::Sub => {
                if let [a, b] = scope[..] {
                    let target = cage.target;
                    csp.add_constraint(LambdaConstraint::new(
                        vec![a, b],
                        move |assignment: &[Option<u32>]| match (
                            &assignment[a as usize],
                            &assignment[b as usize],
                        ) {
                            (Some(x), Some(y)) => x.abs_diff(*y) == target,
                            _ => true,
                        },
                        format!("cage_sub({a},{b})=|·|={target}"),
                    ));
                }
            }
            CageOp::Div => {
                if let [a, b] = scope[..] {
                    let target = cage.target;
                    csp.add_constraint(LambdaConstraint::new(
                        vec![a, b],
                        move |assignment: &[Option<u32>]| match (
                            &assignment[a as usize],
                            &assignment[b as usize],
                        ) {
                            (Some(x), Some(y)) => {
                                let (hi, lo) = (*x.max(y), *x.min(y));
                                lo != 0 && hi.is_multiple_of(lo) && hi / lo == target
                            }
                            _ => true,
                        },
                        format!("cage_div({a},{b})=max/min={target}"),
                    ));
                }
            }
        }
    }

    csp.finalize();

    // Reuse the sudoku given-cell extraction (already compiled into the lean
    // build; it is just "non-zero cells as (VarId, value)") rather than mint a
    // KenKen-specific twin.
    let given = sudoku_given(board);
    (csp, given)
}

/// Solve a KenKen puzzle under `config`. Returns `None` if unsolvable.
pub fn solve_kenken(
    board: &[u32],
    n: u32,
    cages: &[KenKenCage],
    config: &SolveConfig,
) -> Option<Vec<u32>> {
    let (mut csp, given) = create_kenken_csp(board, n, cages);
    csp.solve_with_given(config, &given).into_iter().next()
}

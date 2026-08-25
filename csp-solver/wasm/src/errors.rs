//! Shared wire helpers for the lean, `--no-default-features` deploy build.
//!
//! All five purpose-built game surfaces — [`crate::sudoku`],
//! [`crate::futoshiki`], [`crate::thermo`], [`crate::killer`] and
//! [`crate::kenken`] — stamp a machine-checkable `.code` onto a genuine JS
//! `Error`, validate their board length, and pack their flat `Uint32Array`
//! result buffers the same way. Those moves live here, in one place every wire
//! depends on, so no game module back-depends on a sibling (previously
//! `futoshiki` reached into `sudoku` for `coded_error` — a sibling-to-sibling
//! coupling with no ordering rationale). Tranche-2 logged the gap and closed
//! the `coded_error` half; T5-W2 brought `board_total` home from its three
//! hand-copied twins.
//!
//! Deliberately self-contained: no `csp_solver::error::CspError`, no serde.
//! Dragging the serde-carrying error graph into the compile would defeat
//! the point of the lean deploy fork these two wires ship in — the JS-side
//! contract is the `.code` string, not a Rust error type crossing the
//! boundary.

use wasm_bindgen::prelude::*;

use csp_solver::domain::Domain;
use csp_solver::puzzles::sudoku::rng::SimpleRng;
use csp_solver::variable::Variable;

/// Stamp a stable `.code` string onto a genuine `js_sys::Error` (not a
/// plain object) so `instanceof Error` and `.message` both behave as JS
/// callers expect, while still giving them a machine-checkable
/// discriminant.
pub(crate) fn coded_error(code: &str, message: &str) -> JsValue {
    let err = js_sys::Error::new(message);
    let _ = js_sys::Reflect::set(&err, &JsValue::from_str("code"), &JsValue::from_str(code));
    err.into()
}

/// Validate a flat board against the side length it claims, returning the cell
/// total. `side` is the *board* side — the Latin wires (`futoshiki`, `kenken`)
/// pass their `board_size` straight through, the boxed wires (`sudoku`,
/// `thermo`, `killer`) pass `n * n`, since a sub-grid `n` means an `n²×n²`
/// board. One message vocabulary for all five.
pub(crate) fn board_total(board: &[u32], side: u32) -> Result<usize, JsValue> {
    let total = (side * side) as usize;
    if board.len() != total {
        return Err(coded_error(
            "INVALID_INPUT",
            &format!(
                "board length {} does not match side² = {total} for a {side}×{side} board",
                board.len()
            ),
        ));
    }
    Ok(total)
}

/// One record read out of a template bank: the dense row-major board and the
/// family's own flat clue buffer, in the shapes that family's `PuzzleData`
/// getters return them.
pub(crate) type BankedDeal = (Vec<u32>, Vec<u32>);

/// Pick one record out of a template bank, or `None` when the bank is empty
/// (the caller falls back to a live dig).
///
/// A bank is a flat `Uint32Array` of records, each
///
/// ```text
/// [ clue_len, board[0..total], clue[0..clue_len] ]
/// ```
///
/// — the count first so a record can be skipped by arithmetic without reading a
/// cell, then the dense row-major board, then exactly the clue buffer this
/// family's `PuzzleData` getter emits (`thermometers`, `cages`,
/// `inequalities`). A JS caller banks a deal by concatenating
/// `[d.cages.length, ...d.board, ...d.cages]`, and the record's tail is
/// byte-identical to what `solve*` would be handed — so the family's own
/// decoder is the bank's validator, and there is no second encoding to keep in
/// step.
///
/// [`generateSudoku`](crate::generate_sudoku) keeps the bare `total`-chunked
/// bank it shipped with in 0.4.0: sudoku carries no clue furniture, so every
/// record's prefix would be a constant `0`, and the wire that shipped first
/// keeps its bytes rather than paying a per-record word for a field it cannot
/// use.
///
/// **No symmetry transform.** Sudoku's bank fans out through
/// `SudokuTransform`, whose digit permutation is *unsound* for every family
/// that reads values rather than merely distinguishing them — it inverts a
/// thermometer's `less_than` chain and it falsifies a Killer/KenKen cage
/// target. The position half (bands, stacks, rows-in-band, transpose) would be
/// sound if each clue's cells were re-indexed through the same permutation, but
/// that transform belongs to the crate beside the one it mirrors, not to this
/// wire. Until it exists, bank breadth is the bank's own size: a record deals
/// exactly as it was banked.
///
/// A record that overruns the buffer is `INVALID_INPUT` — a bank is read
/// whole before anything is dealt from it, so a malformed tail cannot hide
/// behind a lucky pick.
pub(crate) fn bank_pick(
    bank: &[u32],
    total: usize,
    seed: u64,
) -> Result<Option<BankedDeal>, JsValue> {
    if bank.is_empty() {
        return Ok(None);
    }

    // One record's worth of skip, validated. Reading a record is arithmetic on
    // its length prefix — no cell is touched — so a walk costs O(records), not
    // O(cells): a 16×16 bank of 64 deals is 64 additions, not 16,384 reads.
    // Cheap enough that the pick walks twice (count, then seek) rather than
    // carry an index vector.
    //
    // Every add is checked. `usize` is 32 bits on wasm32, and the prefix is a
    // caller-supplied `u32`, so a hostile `[0xFFFF_FFFF, …]` would wrap a bare
    // sum straight past the length test and index out of bounds.
    let step = |at: usize| -> Result<usize, JsValue> {
        (bank[at] as usize)
            .checked_add(1 + total)
            .and_then(|span| at.checked_add(span))
            .filter(|&end| end <= bank.len())
            .ok_or_else(|| {
                coded_error(
                    "INVALID_INPUT",
                    "template bank is truncated — a record's board + clue cells overrun \
                     the buffer",
                )
            })
    };

    let mut count = 0usize;
    let mut i = 0usize;
    while i < bank.len() {
        i = step(i)?;
        count += 1;
    }

    // The same first draw sudoku's `generate_board_with_templates_seeded`
    // takes, off a fresh RNG at the caller's seed: one seed, one record, on
    // every target.
    let want = SimpleRng::new(seed).next_usize(count);
    let mut at = 0usize;
    for _ in 0..want {
        at = step(at)?;
    }
    let clue_len = bank[at] as usize;
    let board = bank[at + 1..at + 1 + total].to_vec();
    let clues = bank[at + 1 + total..at + 1 + total + clue_len].to_vec();
    Ok(Some((board, clues)))
}

/// Concatenate a slice of solution boards into one flat, row-major buffer
/// for the `Uint32Array` bulk-copy return. Each board is appended end to
/// end in order; the caller slices it back into `solution_count` boards.
pub(crate) fn flatten_solutions(solutions: &[Vec<u32>]) -> Vec<u32> {
    let mut flat = Vec::with_capacity(solutions.iter().map(Vec::len).sum());
    for sol in solutions {
        flat.extend_from_slice(sol);
    }
    flat
}

/// Collect each variable's surviving domain as a 1-based value bitmask —
/// bit `v` set iff value `v` is still a candidate. One `u32` per variable,
/// row-major, for the engine-domains pencil-marks `Uint32Array`. Values run
/// 1.. in both game surfaces (n² ≤ 25, board_size ≤ 7), well within a `u32`.
pub(crate) fn domain_masks<D>(variables: &[Variable<D>]) -> Vec<u32>
where
    D: Domain<Value = u32>,
{
    variables
        .iter()
        .map(|v| v.domain.iter().fold(0u32, |acc, val| acc | (1u32 << val)))
        .collect()
}

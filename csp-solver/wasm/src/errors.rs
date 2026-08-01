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

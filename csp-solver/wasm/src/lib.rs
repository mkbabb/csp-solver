//! WebAssembly bindings for csp-solver.
//!
//! Exposes the csp-solver public API to JavaScript via wasm-bindgen.
//!
//! ## Layers
//!
//! - **`sudoku`** (always compiled) — the purpose-built browser
//!   client-solve surface: `solveSudoku` / `generateSudoku` over flat
//!   `Uint32Array` boards (no string-keyed maps). This is the layer the
//!   frontend deploy fork ships; `--no-default-features` builds it alone.
//! - **`futoshiki`** (always compiled) — the sibling purpose-built
//!   Futoshiki surface: `solveFutoshiki` / `generateFutoshiki` over a flat
//!   `Uint32Array` board plus a flat inequality-pair buffer. Futoshiki is a
//!   shipped product surface, so it rides the lean `--no-default-features`
//!   build alongside `sudoku`.
//! - **`isomorphic`** (feature `full-mirror`) — the generic `Csp`,
//!   `SolveConfig`, `SolveStats`, and `Pruning` / `Ordering` /
//!   `PropagationStrategy` / `OptimizationMode` mirror of `src/py.rs`.
//!   Kept for PyO3-parity reference; excluded from the lean deploy build.
//! - **`assignment`** (feature `assignment`) — convenience
//!   `solveAssignmentCop` for bipartite assignment COPs (bbnf-buddy's live
//!   consumer). Thin adapter over the upstream Rust
//!   [`AssignmentBuilder`](csp_solver::AssignmentBuilder).

use wasm_bindgen::prelude::*;

#[cfg(feature = "assignment")]
mod assignment;
mod futoshiki;
#[cfg(feature = "full-mirror")]
mod isomorphic;
mod sudoku;

#[cfg(feature = "assignment")]
pub use assignment::{
    AssignmentRequest, AssignmentResponse, assignment_sentinel, solve_assignment_cop,
};
pub use futoshiki::*;
#[cfg(feature = "full-mirror")]
pub use isomorphic::*;
pub use sudoku::*;

/// Initialize the WASM module.
///
/// Installs `console_error_panic_hook` so a Rust panic surfaces as a
/// readable JavaScript stack trace in the browser console instead of
/// the opaque `RuntimeError: unreachable executed`. Marked
/// `#[wasm_bindgen(start)]` so it runs automatically the first time
/// the module is instantiated.
#[wasm_bindgen(start)]
pub fn init() {
    console_error_panic_hook::set_once();
}

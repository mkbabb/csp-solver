//! WebAssembly bindings for csp-solver.
//!
//! Exposes the csp-solver public API to JavaScript via wasm-bindgen.
//! Mirrors the Python binding in `csp-solver/src/py.rs` — same surface,
//! different binding mechanism. The two bindings are deliberately
//! isomorphic so a Python user reading `py.rs` and a TypeScript user
//! reading `csp_solver_wasm.d.ts` see the same shape.
//!
//! ## Layers
//!
//! - **`isomorphic`** — line-for-line mirror of `src/py.rs`. The
//!   low-level `Csp`, `SolveConfig`, `SolveStats`, and the
//!   `Pruning` / `Ordering` / `PropagationStrategy` /
//!   `OptimizationMode` enums.
//! - **(future)** `assignment` — convenience `solveAssignmentCop` for
//!   bipartite assignment COPs. Lands in commit C5.

use wasm_bindgen::prelude::*;

mod isomorphic;

pub use isomorphic::*;

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

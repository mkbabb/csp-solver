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
//! - **`thermo`** (always compiled) — the T4-W13 Thermo-Sudoku surface:
//!   `solveThermo` / `generateThermo` / `propagateThermo` over a flat
//!   `Uint32Array` board plus a length-prefixed thermometer buffer. A Sudoku
//!   variant carrying no new engine constraint (a tube is a `less_than`
//!   chain), so it rides the lean build alongside `sudoku`/`futoshiki`.
//! - **`killer`** (always compiled) — the T4-W13 Killer-Sudoku surface:
//!   `solveKiller` / `generateKiller` / `propagateKiller` over a flat
//!   `Uint32Array` board plus a length-prefixed cage buffer (`[k, sum, cells…]`
//!   per cage). A Sudoku variant that CONSUMES the `CageSum` n-ary primitive (no
//!   killer-specific constraint), so it too rides the lean build.
//! - **`kenken`** (always compiled) — the T4-W13 KenKen/Calcudoku surface:
//!   `solveKenKen` / `generateKenKen` / `propagateKenKen` over a flat
//!   `Uint32Array` Latin board plus a length-prefixed operator-cage buffer
//!   (`[k, op, target, cells…]` per cage). The second cage consumer — `+`→`CageSum`,
//!   `×`→`CageProduct`, `−`/`÷`→a free binary lambda (no KenKen-specific
//!   constraint), so it too rides the lean build.
//! - **`assignment`** (feature `assignment`) — convenience
//!   `solveAssignmentCop` for bipartite assignment COPs (bbnf-buddy's live
//!   consumer). Thin adapter over the upstream Rust
//!   [`AssignmentBuilder`](csp_solver::AssignmentBuilder).

use wasm_bindgen::prelude::*;

#[cfg(feature = "assignment")]
mod assignment;
mod errors;
mod futoshiki;
mod kenken;
mod killer;
mod sudoku;
mod thermo;

#[cfg(feature = "assignment")]
pub use assignment::{
    AssignmentRequest, AssignmentResponse, assignment_sentinel, solve_assignment_cop,
};
pub use futoshiki::*;
pub use kenken::*;
pub use killer::*;
pub use sudoku::*;
pub use thermo::*;

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

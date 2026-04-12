//! WebAssembly bindings for morph-core.
//!
//! Exposes the morph-core pairwise form alignment pipeline to
//! JavaScript via wasm-bindgen. Single export: [`alignForms`](wire::align_forms).
//!
//! ## Layers
//!
//! - **`wire`** — serde-compatible wire types mirroring morph-core's
//!   domain types with camelCase field names for JS ergonomics.
//!   Conversion between wire and domain types, plus the
//!   `#[wasm_bindgen]` entry point.

use wasm_bindgen::prelude::*;

mod wire;

pub use wire::align_forms;

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

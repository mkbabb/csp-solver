# Changelog

## 0.1.0 — Initial scaffold + isomorphic Csp/SolveConfig/enums mirror

- Promoted `csp-solver` to a cargo workspace with two members: the
  existing `.` package and the new `wasm` sub-crate.
- Added `csp-solver-wasm` cdylib + rlib sub-crate that path-deps the
  parent.
- Mirrored `csp-solver/src/py.rs` line-for-line as
  `wasm/src/isomorphic.rs`: `Csp`, `SolveConfig`, `SolveStats`, the
  `Pruning` / `Ordering` / `PropagationStrategy` / `OptimizationMode`
  enums, and the Sudoku convenience helpers (`createSudokuCsp`,
  `solveSudoku`, `createRandomBoard`).
- Wired `console_error_panic_hook` via a `#[wasm_bindgen(start)]` init
  function so Rust panics surface as readable JS stack traces.
- Configured `wasm-pack` size optimization via
  `[package.metadata.wasm-pack.profile.release]` so the parent crate's
  release profile remains untouched.
- Added a `Makefile` with `wasm`, `docs`, and `clean` targets.
- Committed the first `pkg/` artifact alongside the source so
  consumers can `npm install file:.../wasm/pkg` without rebuilding.

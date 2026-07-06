# Changelog

## 0.2.0 — 2026-07-06 (grand-uplift tranche)

- **Split surface, four layers** (`src/lib.rs`): `sudoku` + `futoshiki` always
  compiled (the lean deploy artifact under `--no-default-features`),
  `full-mirror` and `assignment` behind features (`default = ["full-mirror",
  "assignment"]`). `isomorphic.rs` split its Sudoku bindings out to
  `sudoku.rs`; `futoshiki.rs` is new.
- **`solveSudoku` / `generateSudoku`** — purpose-built browser surface over flat
  `Uint32Array` boards with a seeded RNG. `SudokuSolveResult` carries a
  `budgetExceeded` getter distinguishing a node-budget abort from a real UNSAT.
- **`solveFutoshiki` / `generateFutoshiki`** — the sibling Futoshiki surface
  (flat board + flat inequality-pair buffer); Futoshiki is a shipped product,
  so it rides the lean `--no-default-features` build.
- **`solveAssignmentCop` / `assignmentSentinel`** shipped (feature
  `assignment`) — the bipartite assignment COP entry point, a thin adapter over
  `csp_solver::AssignmentBuilder`. (The 0.1.0 README advertised this as landing
  in a future commit; it's here.)
- **Mirror tracks `csp-solver@0.2.0`**: `MRV` on the wire (was `DomWdeg`), the
  vestigial `backjumping` field removed, `SolveConfig::default` now `Ac3` +
  `FailFirst`.
- **Package identity** `@mkbabb/csp-solver-wasm`; hardened difficulty-parity
  contract tests (`wasm/src/sudoku.rs::SudokuDifficulty` idiomatic-casing case);
  `wasm-pack ≥ 0.14` build floor, lean artifact under a ≤93 KB twiggy budget.

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

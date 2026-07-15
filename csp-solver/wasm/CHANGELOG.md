# Changelog

The npm registry carries this package through `0.2.0`. The `0.4.0` and `0.5.0`
bumps below are source-only version stamps: the frontend file-links the lean
build (`file:../../csp-solver/wasm/pkg`), so no tarball was published for them.

## 0.5.0 — 2026-07-13 (futoshiki difficulty axis)

_Source-only; the npm registry stays at `0.2.0`._

- **BREAKING — `generateFutoshiki` gains a `difficulty` argument.**
  `generateFutoshiki(boardSize, seed)` → `generateFutoshiki(boardSize,
  difficulty, seed)`, mirroring `generateSudoku(n, difficulty, seed)`. New
  `FutoshikiDifficulty` (`Easy`/`Medium`/`Hard`) enum export; the frontend Worker
  call-site updates alongside. Tracks `csp-solver@0.5.0`.
- Version stamped `0.4.0 → 0.5.0`: the minor bump encodes the breaking signature
  change across the 0.x slot and tracks the core crate's `0.5.0` surface.

## 0.4.0 — 2026-07-10 (dead-surface excision)

_Source-only; the npm registry stays at `0.2.0`._

- **BREAKING — `isomorphic` / `full-mirror` excised.** The `full-mirror` feature
  and its `isomorphic` module are removed; the published `.d.ts` drops `Csp`,
  `SolveConfig`, `SolveStats`, `OptimizationMode`, `Ordering`,
  `PropagationStrategy`, `Pruning` — the 7 generic py-mirror exports the
  published `0.2.0` tarball shipped. The surface is now the purpose-built
  `sudoku` + `futoshiki` + `assignment` layers only.
- `default = ["assignment"]` (was `["full-mirror", "assignment"]`); serde stays
  via `assignment`, so `Cargo.lock` is unchanged. The lean
  `--no-default-features` deploy artifact is byte-identical pre/post (it never
  compiled the isomorphic surface). No in-repo consumer is affected.
- Version stamped `0.2.0 → 0.4.0`: the minor bump encodes the breaking removal
  across the 0.x slot and realigns the package to the core crate's `0.4.0`
  surface (it had lagged the core through 0.3.0).

## 0.2.0 — 2026-07-06 (split surface)

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
  `wasm-pack ≥ 0.14` build floor, lean two-game artifact under its ≤93 KB twiggy
  budget (the band at `0.2.0`; the five-game band is now 127,500 B).

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

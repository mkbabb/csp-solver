# Changelog

This workspace ships four publishable artifacts across two registries:

- `csp-solver` — the CSP solver crate (crates.io)
- `morph-core` — the form-alignment crate, built on `csp-solver` (crates.io)
- `@mkbabb/csp-solver-wasm` — wasm-pack bindings for `csp-solver` (npm)
- `@mkbabb/morph` — wasm-pack bindings for `morph-core` (npm)

## 0.1.0 — 2026-05-28 (G.W5 — first publish)

First registry publish of the workspace, landed as part of the muster tranche G
release-engineering wave (G.W5 sub-wave A, CSC411-fold pass).

### crates.io

- **`csp-solver@0.1.0`** — generic constraint satisfaction problem solver: chronological
  backtracking + conflict-directed backjumping, AC-3 + AC-FC propagation, GAC
  all-different (Regin 1994), min-conflicts local search, bitset + finite + lattice
  domains. Cargo.toml carries the crates.io-mandatory `description` + `license = "MIT"`
  + `repository` fields.
- **`morph-core@0.1.0`** — form alignment + landmark matching primitives, built on
  `csp-solver`. Depends on `csp-solver` via a registry version pin alongside the
  workspace-internal path (`csp-solver = { version = "0.1.0", path = ".." }`); the
  path resolves local builds, the version resolves the crates.io edge.

### npm (@mkbabb scope)

- **`@mkbabb/csp-solver-wasm@0.1.0`** — wasm-pack-emitted bindings for `csp-solver`.
  Published under the `@mkbabb/*` scope; emitted JS surface is `csp_solver_wasm.{js,d.ts,_bg.wasm}`.
- **`@mkbabb/morph@0.1.0`** — wasm-pack-emitted bindings for `morph-core`. The
  underlying Rust crate is named `morph`; the emitted JS surface is
  `morph.{js,d.ts,_bg.wasm}`. Consumed by bbnf-buddy through the npm registry.

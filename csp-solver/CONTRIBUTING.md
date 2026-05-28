# Contributing to csp-solver

This workspace ships four publishable artifacts: two Rust crates (`csp-solver`,
`morph-core`) to crates.io, and two wasm-pack-emitted npm packages
(`@mkbabb/csp-solver-wasm`, `@mkbabb/morph`).

## Clone + build

```bash
git clone git@github.com:mkbabb/csp-solver.git
cd csp-solver
cargo build            # builds the workspace (csp-solver + morph-core + wasm crates)
cargo test             # native test suite
cargo bench            # criterion benchmarks
```

The toolchain is edition 2024 / nightly. `morph-core` depends on `csp-solver` via a
registry version pin alongside the workspace-internal path
(`csp-solver = { version = "0.1.0", path = ".." }`) — the path resolves local builds,
the version resolves the crates.io edge.

## Build the wasm packages

```bash
wasm-pack build wasm          # → wasm/pkg → @mkbabb/csp-solver-wasm
wasm-pack build wasm-morph    # → wasm-morph/pkg → @mkbabb/morph
```

The wasm crates keep their `path = ".."` Cargo deps for the wasm-pack build; the
published npm artifact is the wasm-pack `pkg/` output, which JS consumers (bbnf-buddy)
resolve through the npm registry.

## Version bumps + releasing

The Rust crates publish to crates.io via **manual `cargo publish` on tag** — there is
no changesets flow on the Rust side. The dependency order is binding: `csp-solver`
publishes before `morph-core` (crates.io's pre-publish dep-resolution gate blocks
otherwise).

1. Bump the version in the crate's `Cargo.toml`.
2. Update `CHANGELOG.md`.
3. Tag + push (`v*.*.*`); CI runs `cargo publish` via `CARGO_REGISTRY_TOKEN`.

The wasm npm packages publish on the same tag flow via `wasm-pack build` + `npm publish
--access public` (CI-driven via `NPM_TOKEN`); a fresh `wasm-pack build` precedes each
npm publish so the emitted `pkg/` matches the source at HEAD.

**Never `cargo publish` or `npm publish` from a dev machine** — the publish operation
belongs to CI on tag. See
[`docs/precepts/cross-repo-dev-iteration.md`](https://github.com/mkbabb/glass-ui/blob/master/docs/precepts/cross-repo-dev-iteration.md)
in glass-ui (the perimeter-level dev-iteration doc; Rust members use the workspace
`path = ".."` pattern as the active-feature equivalent of `npm link`).

## Conventions

Rust edition 2024; the solver's behavior is the single source of truth — the wasm +
PyO3 bindings mirror it rather than reimplementing logic; new solver strategies land in
`src/solver/` with a benchmark; CHANGELOG.md updated when crate source or `Cargo.toml`
changes.

## PR flow

1. Branch off the default branch.
2. Make the change + add/update tests + a benchmark for new solver strategies.
3. Ensure `cargo build` + `cargo test` exit 0.
4. Open the PR — CI runs the same gates.

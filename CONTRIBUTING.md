# Contributing

The workspace ships two artifacts: the `csp-solver` crate (crates.io) and its
`@mkbabb/csp-solver-wasm` sibling (npm). The Rust solver's behavior is the single
source of truth—the wasm and PyO3 bindings mirror it, they don't reimplement it.

## Toolchain

Edition 2024, stable toolchain pinned in `rust-toolchain.toml` (MSRV 1.88). The
prerequisite matrix (cargo / uv / npm) is in the root [`README.md`](./README.md)
§Development; the build and test recipes single-home in
[`csp-solver/README.md`](csp-solver/README.md)—don't duplicate them here.

## PR flow

1. Branch off the default branch.
2. Make the change plus tests—and a bench under `csp-solver/benches/` for any new
   solver strategy.
3. `cargo test --workspace` exits 0 (never per-crate—the workspace build is what CI
   gates).
4. Update `CHANGELOG.md` whenever crate source or a `Cargo.toml` changes.
5. Open the PR—CI runs the same ten-lane gate matrix (`.github/workflows/ci.yml`).

## Releasing

Publication belongs to CI on tag. **Never `cargo publish` or `npm publish` from a
dev machine.** Bump the version, update `CHANGELOG.md`, tag, and push; the tag flow
publishes the crate and the wasm package.

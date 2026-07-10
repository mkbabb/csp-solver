# T2-W1 Lane R — Rust toolchain pin + workspace currency

Machine: Apple M5 Max, darwin 25.4.0. Toolchain: stable `cargo 1.97.0 (c980f4866 2026-06-30)`.
Scope touched: `rust-toolchain.toml` (new), root `Cargo.toml`, `csp-solver/Cargo.toml`,
`csp-solver/wasm/Cargo.toml`, `Cargo.lock`. `.github/workflows/ci.yml` and `web/**` untouched.

## Changes
1. `rust-toolchain.toml` created — `channel = "stable"`, components `rustfmt`+`clippy`,
   target `wasm32-unknown-unknown` (nightly pin was vestigial).
2. MSRV `rust-version = "1.88"` hoisted to `[workspace.package]`; both members inherit via
   `rust-version.workspace = true`.
3. Currency edict:
   - `[workspace.package] edition = "2024"` — members inherit `edition.workspace = true`.
   - `[workspace.dependencies]` centralizes every non-pyo3 dep; members reference
     `{ workspace = true }` adding only local `optional`/`features`. pyo3 left inline in
     `csp-solver` (NOT hoisted) so the pyo3-migration lane moves it in one place.
   - `[workspace.lints]` — `rust.warnings = "deny"` + `clippy.all = { level = "deny",
     priority = -1 }`; members opt in with `[lints] workspace = true`. Encodes the CI
     `-D warnings` bar as the default build posture; code satisfies both tiers on stable.
4. Dep bumps: `wasm-bindgen 0.2.117 → 0.2.126`, `criterion 0.5 → 0.8.2`. pyo3 EXACTLY as-is
   (`0.24`, `extension-module`, optional).
5. `cargo update` — fresh lockfile.

## Currency check — `cargo +stable outdated` (verbatim)

`cargo +stable outdated --root-deps-only --exit-code 1` → exit 1:

```
csp-solver
================
Name  Project  Compat  Latest  Kind    Platform
----  -------  ------  ------  ----    --------
pyo3  0.24.2   ---     0.29.0  Normal  ---
```

`cargo +stable outdated --workspace` (verbatim):

```
csp-solver
================
Name                 Project  Compat  Latest   Kind         Platform
----                 -------  ------  ------   ----         --------
autocfg              1.5.1    ---     Removed  Build        ---
cfg-if               1.0.4    ---     Removed  Normal       ---
indoc                2.0.7    ---     Removed  Normal       ---
memoffset            0.9.1    ---     Removed  Normal       ---
once_cell            1.21.4   ---     Removed  Normal       ---
pyo3                 0.24.2   ---     0.29.0   Normal       ---
pyo3-build-config    0.24.2   ---     0.29.0   Build        ---
pyo3-build-config    0.24.2   ---     Removed  Normal       ---
pyo3-ffi             0.24.2   ---     0.29.0   Normal       ---
pyo3-macros          0.24.2   ---     0.29.0   Normal       ---
pyo3-macros-backend  0.24.2   ---     0.29.0   Normal       ---
rustversion          1.0.23   ---     Removed  Development  ---
target-lexicon       0.13.5   ---     Removed  Normal       ---
unindent             0.2.4    ---     Removed  Normal       ---
```

Every outstanding entry is pyo3 (0.24.2 → 0.29.0) or a pyo3-only transitive
(`pyo3-*`, plus `indoc`/`memoffset`/`unindent`/`target-lexicon`/`autocfg`/`once_cell`
pulled solely by pyo3). The entire currency delta is the single justified **pyo3 ceiling
class**: held for the next lane's migration, and hard-gated by the host — PyO3 0.24 caps at
Python 3.13 while the host Python is 3.14. `cargo-outdated` v0.19.0 installed via
`cargo install cargo-outdated --locked`.

## Proofs (stable)
- `cargo +stable test --workspace` → **150 passed / 0 failed / 6 ignored** (17 binaries).
- `cargo +stable clippy --workspace --all-targets -- -D warnings` → clean (exit 0).
- `cargo +stable check -p csp-solver --features py` → compiles (pyo3 0.24.2 untouched),
  built against `PYO3_PYTHON=…/cpython-3.13.5-macos-aarch64/bin/python3.13` (the CI-style
  3.13 interpreter; host 3.14 trips the documented PyO3 max-version guard).
- `cargo +stable bench -p csp-solver --bench queens -- --test` → all cases `Success`.

## Lean wasm contingency
Rebuilt exactly as CI (`wasm-pack build csp-solver/wasm --scope mkbabb --profile
wasm-release --no-default-features`, measuring `pkg/csp_solver_wasm_bg.wasm`) under stable:

- old: 87,853 B
- new: **87,282 B** (−571 B, from the wasm-bindgen 0.2.117→0.2.126 bump)
- band: fail > 93,000 B — comfortably under. Report-only; references not chased.

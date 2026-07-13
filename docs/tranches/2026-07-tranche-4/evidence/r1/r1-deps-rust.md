# r1-deps-rust — Rust/wasm dependency currency + modern-wasm facilities

Lens: dependency currency, edition/toolchain, PyO3/maturin/abi3, wasm-bindgen/wasm-pack,
post-MVP wasm features (SIMD/threads/etc.), twiggy on the built artifact. No upgrades performed.
Subject: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/csp-solver` (+ `wasm/`), HEAD 65425697.

## Environment probed
```
rustc 1.97.0 (2026-07-07) · cargo 1.97.0 · wasm-pack 0.15.0 · wasm-opt v129 · twiggy 0.8.0
cargo-outdated 0.19.0 (installed) · maturin 1.12.6 (installed) · cargo-audit NOT installed
```

## Currency verdict: EXCELLENT — no dep-major-lag
Every workspace dep resolves to the exact crates.io latest (queried live 2026-07-12):

| Dep | Locked | crates.io latest | Δ |
|---|---|---|---|
| wasm-bindgen | 0.2.126 | 0.2.126 | current |
| wasm-bindgen-test | 0.3.76 | 0.3.76 | current |
| js-sys | 0.3.103 | 0.3.103 | current |
| pyo3 | 0.29.0 | 0.29.0 | current |
| serde | 1.0.228 | 1.0.228 | current |
| serde-wasm-bindgen | 0.6.5 | 0.6.5 | current |
| include_dir | 0.7.4 | 0.7.4 | current |
| criterion | 0.8.2 | 0.8.2 | current |
| iai-callgrind | 0.16.1 | 0.16.1 | current |
| proptest | 1.11.0 | 1.11.0 | current |
| console_error_panic_hook | 0.1.7 | 0.1.7 | current |

Probe (rerunnable):
```
cd csp-solver.. ; cargo outdated --workspace        # → "All dependencies are up to date, yay!"
for c in wasm-bindgen pyo3 serde-wasm-bindgen criterion iai-callgrind include_dir; do \
  curl -s "https://crates.io/api/v1/crates/$c" -H 'User-Agent: audit' | \
  python3 -c "import sys,json;d=json.load(sys.stdin);print(d['crate']['name'],d['crate']['max_stable_version'])"; done
```
- Edition **2024** (stable since 1.85), MSRV **1.88**, both workspace-hoisted (`Cargo.toml:12-13`). Modern.
- Toolchain `rust-toolchain.toml` pins **`channel = "stable"`** — the nightly pin was retired (vestigial); wasm target + clippy/rustfmt components declared. No nightly needed anywhere. (Note: audit-context/memory still reference "nightly" — that's stale context, the tree is stable.)
- PyO3 0.29 latest; `abi3` opt-in feature present (`csp-solver/Cargo.toml:20`, `pyo3/abi3-py310` — single forward-compat cp310-abi3 wheel). `extension-module` hoisted. No PyO3 currency gap.
- No `unsafe` in either crate's `src/` (grep clean).
- maturin 1.12.6 locally < 1.14.1 latest — a host tool, NOT repo-pinned; trivial, no action.

## Modern-wasm posture (the lens's core question)
Built lean artifact's `target_features` custom section (probe: `strings pkg/csp_solver_wasm_bg.wasm | grep -A20 target_features`; corroborated by `wasm-opt --print-features`):
```
mutable-globals, sign-ext, nontrapping-fptoint, bulk-memory, bulk-memory-opt,
reference-types, multivalue, call-indirect-overlong   [ENABLED]
simd128, threads/atomics/shared-memory                 [FORGONE]
```
- **Enabled set = the current rustc-1.97 "widely available" wasm baseline** — this is modern; nothing to chase. reference-types + multivalue + bulk-memory are all ON by default now.
- **SIMD forgone (reasonable):** the hot path is backtracking search over small bitset domains (9×9 / 6×6 fit a `u16`/`u32`); simd128 would gate Safari <16.4 and buy ~0 on non-vectorizable search. Size cost of enabling: neutral-to-slightly-larger code, no runtime win here.
- **Threads forgone (reasonable):** would require SharedArrayBuffer + COOP/COEP cross-origin isolation on CF Pages plus a parallel-search rewrite; the solver already runs in one Worker. Not worth it for interactive puzzles.
- No action on features — the posture is current and the two omissions are correctly costed away.

## twiggy on the built artifact
`twiggy top -n 25 pkg/csp_solver_wasm_bg.wasm` returns only `code[N]`/`data[N]` indices — **the name section is stripped by the `-Oz` wasm-opt pass**, so twiggy cannot attribute bytes to functions on the shipped artifact. Function-level size attribution would need an unstripped/debug build. Observation, not a defect. (Top rows: code[67] 6404 B/7.38%, code[0] 4869 B, code[7] 4740 B, data[0] 4206 B; 423 total rows / 86,746 B.)

## Findings

### F1 (P2) — Makefile `wasm` target diverges from the real ship/CI build → produces a 2.8× fat, wrong-profile, wrong-feature artifact
`csp-solver/wasm/Makefile:8-10`:
```
wasm:
	wasm-pack build --target web --release --out-dir pkg
	rm -f pkg/.gitignore
```
The actual ship command (docs/tranches/2026-07-tranche-3/evidence/T3-WGATE-ship.md:13) and every CI build/deploy lane (`.github/workflows/ci.yml:393,454`) use:
`wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release --no-default-features`.
The Makefile drops `--no-default-features` (→ compiles the `assignment` feature + its `serde`/`ndarray` graph) and uses `--release` instead of `--profile wasm-release` (→ opt-level default, not `z`).
**Demonstrated** (built to a throwaway out-dir, committed pkg untouched):
```
wasm-pack build --target web --release --out-dir <scratch>   # = the Makefile recipe
  → csp_solver_wasm_bg.wasm = 243,329 B, exports solveAssignmentCop  (vs shipped lean 86,746 B)
wasm-pack build --target web --profile wasm-release --no-default-features --out-dir <scratch2>
  → 86,746 B, BYTE-IDENTICAL to committed pkg (cmp: WASM IDENTICAL, JS IDENTICAL)
```
Cost: a developer running `make wasm` silently overwrites the frontend-linked `pkg/` (frontend deps `file:../../csp-solver/wasm/pkg`, package.json) with a 243 KB fat build carrying a surface the lean deploy excludes — 2.8× size, wrong profile, over the CI lean budget (fail >93 KB). CI itself is correct; this is a local-recipe footgun. family_hint: `build-recipe-drift`.

### F2 (P3) — Stale orphan `pkg/csp_solver_wasm_bg.js` lies about the wasm surface
`csp-solver/wasm/pkg/csp_solver_wasm_bg.js` (mtime 2026-07-10 21:24, older than the wasm/main-js/d.ts at 07-11 12:23) is a leftover from a prior `--target bundler` build. The current ship/CI target is `--target web`, which **does not emit a `_bg.js`** (proven: the fresh byte-identical ship out-dir contains no `csp_solver_wasm_bg.js`). This orphan still declares `export function solveAssignmentCop`/`assignmentSentinel` (lines 248, 408) that call `wasm.solveAssignmentCop()` / `wasm.assignmentSentinel()` — exports **absent from the current lean binary** (`strings pkg/*.wasm` shows only generateSudoku/solveSudoku/solveFutoshiki). It is also not in `pkg/package.json` `files`. `pkg/` is gitignored (`.gitignore:58`) so this is local-only cruft, but it's stale, misleading, and would `TypeError` if imported. family_hint: `stale-build-artifact`.

### F3 (P3) — Dead/un-invokable wasm-opt profile table `[...profile.custom]` + 14 lines of comment guarding a path that cannot exist
`csp-solver/wasm/Cargo.toml:43-61`. The comment justifies DUPLICATING the wasm-opt array under `.profile.release` AND `.profile.custom` so "wasm-pack ≥0.14's `--profile <name>` keys the wasm-opt metadata to the literal `custom` table … guarantees neither invocation path silently drops `--enable-nontrapping-float-to-int`." **The `custom` path cannot be invoked**: `wasm-pack build --target web --profile custom …` → `error: profile 'custom' is not defined` (no cargo `[profile.custom]` in the workspace root — only `[profile.wasm-release]` exists). Every real build uses `--profile wasm-release`, and `wasm-pack -v` shows its wasm-opt flags resolve from `.profile.release`:
```
[INFO wasm_pack::command::build] executing wasm-opt with ["-Oz","--enable-bulk-memory","--enable-nontrapping-float-to-int"]
```
So the `.profile.custom` duplication (Cargo.toml:60-61) and the "three-file atomicity / neither invocation path" rationale (lines 43-56) are vestigial — one of the two "invocation paths" doesn't exist. Also: `--enable-bulk-memory` is now redundant with rustc 1.97's default target features (already in the binary's `target_features` section). Superfluity, harmless but stale-reasoned. family_hint: `vestigial-config`.

### F4 (P3) — No supply-chain advisory gate
No `cargo-audit`/`cargo-deny` lane in `.github/workflows/ci.yml` (grep: no audit/rustsec/deny hit), no `deny.toml`, and `cargo-audit` isn't installed locally so no RustSec scan could be run this audit. Dep set is tiny and all-latest → low current risk, but there's no tripwire for a future advisory against any of the ~11 deps (e.g. a proptest/serde/pyo3 RustSec). family_hint: `missing-advisory-gate`.

### F5 (P3) — Stale wasm size figures in the record
Actual current builds (probed, `--profile wasm-release`):
- lean (`--no-default-features`, `--target web`): **86,746 B** — matches README/benchmarks & the shipped `dist/` asset (correct).
- full module (default features): **188,095 B**.

But the record states the full module as **222,436 B** — `docs/benchmarks.md:51` ("not re-measured this tranche") and `.github/workflows/ci.yml:322` — a **−34 KB / −15% stale** figure (build shrank under the current toolchain/wasm-bindgen). The ci.yml comment additionally still cites "90,602 B lean" (T2-W7) while README/benchmarks and the real build say 86,746 B — cross-doc figure drift. CI budgets (fail >240 KB full / >93 KB lean) still hold with wide headroom, so no gate breaks; these are stale numbers in comments/docs, not a broken gate. family_hint: `stale-doc-figure`.

## Banked probes (rerunnable)
```
# currency
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion && cargo outdated --workspace
# reproduce shipped lean artifact byte-identically
cd csp-solver/wasm && wasm-pack build --target web --profile wasm-release --out-dir /tmp/ship --no-default-features
cmp /tmp/ship/csp_solver_wasm_bg.wasm pkg/csp_solver_wasm_bg.wasm    # → identical
# reproduce the Makefile footgun (fat build)
wasm-pack build --target web --release --out-dir /tmp/mk ; wc -c /tmp/mk/csp_solver_wasm_bg.wasm   # → 243329
# dead profile
wasm-pack build --target web --profile custom --out-dir /tmp/x --no-default-features  # → error: profile `custom` is not defined
# wasm-opt flag resolution
RUST_LOG=info wasm-pack -v build --target web --profile wasm-release --out-dir /tmp/v1 --no-default-features 2>&1 | grep 'executing wasm-opt'
# feature set
strings pkg/csp_solver_wasm_bg.wasm | grep -A20 target_features
# full-module size
wasm-pack build csp-solver/wasm --scope mkbabb --profile wasm-release --out-dir /tmp/full ; wc -c /tmp/full/csp_solver_wasm_bg.wasm  # → 188095
```

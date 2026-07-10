# A20 — Library Audit (Rust + py): does every Cargo dep earn its keep?

Lane: TRANCHE-III audit32. Read-only. Every claim is `file:line`, a `cargo tree` quote, or a URL.
Consumes pass-1 `R1-pyo3-python-native-sota.md` + `crit-P3-py-stub-shipping-spike.md` (does not duplicate; extends with the library-choice angle).

## Method
Enumerated the full dependency graph and every dep's transitive subtree with `cargo tree`; traced each dep to its sole call site in the tree; cross-checked currency (registry-current major vs pinned) and reachability into the two shipped artifacts (the maturin PyO3 wheel, the wasm cdylib).

Workspace deps are hoisted in the root `Cargo.toml` `[workspace.dependencies]` (root:29-46). Members reference `{ workspace = true }`. 61 nodes in the no-dev graph (`cargo tree -e no-dev | wc -l`).

---

## The headline finding: `hungarian` drags a dead 2020-era numeric stack

`hungarian = "1"` (root `Cargo.toml:39`, resolves to **1.1.1**) is csp-solver's Kuhn-Munkres LAP crate, used at **exactly one call site**:

```
csp-solver/src/builder/assignment.rs:411:  let assignment = hungarian::minimize(&matrix, n, width);
```

`minimize(&[i64], rows, cols) -> Vec<Option<usize>>` is the entire consumed surface. The caller already does all the hard parts itself — quantizes f64→i64 (`assignment.rs:384-396`), builds the augmented sentinel-column matrix, and shifts to non-negative (`assignment.rs:398-409`) — so the crate contributes only the O(n³) inner solve on a flat slice.

For that one function `hungarian v1.1.1` pulls a **9-crate transitive subtree** (`cargo tree -p hungarian`):

```
hungarian v1.1.1
├── fixedbitset v0.3.2
├── ndarray v0.13.1          ← 2020 release; registry-current is 0.16.x
│   ├── matrixmultiply v0.2.4 └─ rawpointer v0.2.1
│   ├── num-complex v0.2.4    └─ num-traits → libm, autocfg   ← complex-number algebra, DEAD for an integer LAP
│   ├── num-integer v0.1.46
│   └── num-traits v0.2.19    └─ libm, autocfg
└── num-traits v0.2.19
```

Two facts make this the biggest single mass-and-risk lever in the workspace:
1. **`ndarray 0.13.1` is EOL-adjacent** — pinned by `hungarian` at a 2020 minor, four majors behind current 0.16. It is the largest crate in the whole no-dev graph and exists solely to back `hungarian`'s internal matrix ops.
2. **`num-complex` is entirely dead weight** — complex-number algebra compiled for an integer linear-assignment problem. Nothing in csp-solver touches it; it rides in only because old `ndarray` unconditionally depends on it.

### Reachability — who actually pays
The LAP/`AssignmentBuilder` surface is **not used by either shipped game**. Sudoku and Futoshiki never call it (`grep -rln AssignmentBuilder src/ tests/` → only `builder/`, `error.rs`, `lib.rs`, `tests/assignment_*`, `benches/assignment.rs`, `examples/parity_probe.rs`). Its only real consumer is the external **morph / bbnf-buddy** crate (`wasm/src/lib.rs:20-23`, "bbnf-buddy's live" assignment COP). So `hungarian`'s whole numeric stack is:
- **always compiled** into the PyO3 wheel and the native build (`hungarian` is a non-optional dep of csp-solver core, `Cargo.toml:33`),
- **feature-gated off** in the *deployed lean-sudoku* wasm (`--no-default-features` drops the wasm `assignment` feature, `wasm/Cargo.toml:38-40`), but **on** in the full-mirror wasm and every native/py build.

The repo's own product carries ~9 transitive crates (incl. an EOL `ndarray` + a dead `num-complex`) to serve an *external* downstream. That is the textbook "does it earn its keep" failure.

### Alternatives (owner's explicit prompt: pathfinding? hand-rolled Kuhn-Munkres?)
| Option | Transitive mass | Currency | Verdict |
|---|---|---|---|
| `hungarian 1.1.1` (status quo) | ~9 crates: ndarray 0.13, num-complex, matrixmultiply, num-integer, libm, autocfg, rawpointer, fixedbitset | **stale** (ndarray 2020) | replace |
| `pathfinding::kuhn_munkres` | pure-Rust, no ndarray, but pathfinding is a large multi-algorithm crate pulling num-traits/indexmap/rustc-hash/thiserror/integer-sqrt (~6-8) — most of it dead code for one fn | actively maintained (v4.x) | swaps stale mass for modern mass; not a clean win |
| **hand-rolled Kuhn-Munkres (O(n³))** | **zero** transitive crates | n/a | **recommended** |

The hand-rolled path is the idiomatic-gestalt move the owner mandates. Textbook O(n³) Hungarian is ~80-120 lines of safe Rust over the `Vec<i64>` the caller *already* materializes; the surface is a drop-in `fn minimize(&[i64], rows, cols) -> Vec<Option<usize>>`. Correctness is already fenced by `tests/assignment_proptest.rs` (LAP-optimality property test) — a hand impl inherits that oracle for free. The B&B path is proven-optimal only to n≈15-18 (`assignment.rs:14`), so the instances are small; O(n³) needs no Jonker-Volgenant speedup and JV crates (`lapjv`, `lap`) re-introduce ndarray anyway. Killing `hungarian` deletes the workspace's only 2020-era numeric stack and its sole dead-code crate in one move.

---

## `include_dir` — earns its keep
`include_dir = "0.7.4"` (root:31), compile-time embed of `data/sudoku_puzzles/` (`puzzles/sudoku/generate.rs`). Subtree is a **build-time proc-macro only**:
```
include_dir v0.7.4 └── include_dir_macros (proc-macro) └── proc-macro2, quote, unicode-ident
```
Those three are already in the graph via every `serde`/`pyo3`/`wasm-bindgen` derive — **zero marginal mass**, zero runtime cost (ships `&'static [u8]`), wasm-clean. Alternatives are worse: `rust-embed` drags hot-reload/compression machinery; bare `include_bytes!` needs a `build.rs` to enumerate the dir tree and loses the `Dir` walk API. **KEEP.**

---

## `pyo3` — keep the dep, fix the posture (extends pass-1 R1/crit-P3 with the library-choice angle)
`pyo3 = { version = "0.29", features = ["extension-module"] }` (root:36); sole consumer csp-solver behind `feature = "py"` (`Cargo.toml:24`). Subtree is unavoidable for any native py binding. **KEEP the crate.** The library-choice deltas, consuming pass-1 (not re-deriving):

- **`abi3` tradeoff (adopt).** Today `extension-module` **without `abi3`** forces one wheel per CPython minor (R1 §1.4, scored 2/5 at R1:57). The crate uses only stable-API surface, so adding the `abi3` PyO3 feature at `requires-python = ">=3.10"` collapses the CI matrix to a single forward-compatible wheel. Cost: a marginally narrower API (none of which csp-solver uses) and, per PEP-803, a *separate* `abi3t`/`cp314t` wheel still needed for free-threaded 3.14+ (R1:28-29). Net: strong adopt for the standard matrix, with the free-threaded wheel as a known additional lane, not a blocker.
- **stub-gen adoption cost (adopt the cheap variant).** Zero `.pyi` today (R1:56, scored 0/5). crit-P3 **confirmed against a real built wheel** that the *pure-Rust* layout ships a stub with **zero `pyproject`/`Cargo` config** — maturin auto-detects a root `csp_solver.pyi` → `__init__.pyi` and adds `py.typed` (crit-P3 C2/C3). The library-choice decision crit-P3 leaves open: **maturin-native `maturin build --generate-stubs`** (pyo3-introspection) generates into the same pure-Rust folder with **no** mixed-layout / `_internal` rename and **no** `pyo3-stub-gen` dependency (crit-P3 C5, still flagged experimental). Recommendation: adopt stub *shipping* via the pure layout; prefer maturin-native generation over adding the `pyo3-stub-gen` dep — one fewer build-dep, and it neutralizes the hand-maintenance drift crit-P3 C6 shows the hand-written stub can't self-guard. Do **not** adopt the mixed layout (crit-P3 C5 confirms it's unnecessary).
- **Packaging drift (fix, rides along).** `pyproject.toml` version `0.2.0` vs crate `0.3.0` — CI stamps a mislabeled wheel (R1:58/67, crit-P3 C4). Not a dep choice but a library-hygiene fix the stub/abi3 wave must reconcile.

---

## `criterion` vs `iai-callgrind` — NOT duplication (owner's question)
Both are dev-deps (never in the wheel or wasm). They measure **orthogonal** quantities:
- `criterion 0.8.2` (root:37) — wall-clock statistical distributions; noisy, needs many samples. 74-node subtree.
- `iai-callgrind 0.16.1` (inline, `Cargo.toml:44-49`) — deterministic Valgrind **instruction counts**; Linux/CI-only (Valgrind can't run arm64-macOS). The Cargo comment records the justification: "**deterministic across 3 ephemeral runners, 0.000000% delta**" (`Cargo.toml:48`), which wall-clock criterion structurally cannot deliver on shared CI runners. **KEEP both** — complementary, not redundant.

One real trim inside criterion: the `html_reports` feature (root:37) pulls **`plotters` + `plotters-svg` + `plotters-backend` + `cast` + `rayon` + `regex`** (`cargo tree -p criterion`). CI **never renders HTML** — it runs only `cargo bench --bench queens -- --test` smoke mode (`.github/workflows/ci.yml:107`) and the iai lane (ci.yml:491-495). So the plotters/rayon/regex mass is local-dev-only convenience. Dropping `features = ["html_reports"]` cuts a large chunk of the dev subtree with zero CI impact (low priority — dev-only, no shipped-artifact effect).

`proptest 1` (root:40) — single consumer `tests/assignment_proptest.rs`; the LAP-optimality oracle that would also validate a hand-rolled Kuhn-Munkres. **KEEP.**

---

## keep / kill / adopt ledger

| Dep | Where | Role / sole call site | Ships in wheel? | Ships in lean wasm? | Verdict |
|---|---|---|---|---|---|
| `hungarian 1.1.1` | core (non-opt) `Cargo.toml:33` | one `minimize()` @ `assignment.rs:411`; drags ndarray 0.13/num-complex/matrixmultiply/libm/… (~9) | **yes** | no (feature-gated off) | **KILL → hand-rolled Kuhn-Munkres** (zero deps, ~100 ln, oracle already exists at `tests/assignment_proptest.rs`); eliminates EOL ndarray 0.13 + dead num-complex |
| `ndarray 0.13.1` (transitive) | via hungarian | hungarian-internal matrix ops | yes | no | **KILL** (falls out when hungarian dies) |
| `num-complex 0.2.4` (transitive) | via ndarray | **unused** — complex algebra for an integer LAP | yes | no | **KILL** (falls out) |
| `include_dir 0.7.4` | core `Cargo.toml:29` | embed template bank; proc-macro subtree already present | yes (as `&'static [u8]`) | yes | **KEEP** |
| `pyo3 0.29` | core, `feature=py` | sole py binding surface | yes | no | **KEEP crate; ADOPT `abi3` + maturin `--generate-stubs` (no pyo3-stub-gen dep, no mixed layout); FIX pyproject version 0.2.0→0.3.0** |
| `wasm-bindgen 0.2.126`, `js-sys 0.3`, `console_error_panic_hook 0.1` | wasm | always-on wasm glue (typed `.code` errors need js-sys, `wasm/Cargo.toml`) | no | yes | **KEEP** |
| `serde 1` + `serde-wasm-bindgen 0.6` | wasm, `full-mirror`/`assignment` features | generic mirror + assignment COP marshaling | no | no (dropped in `--no-default-features`) | **KEEP** (correctly feature-gated out of the lean deploy) |
| `criterion 0.8.2` | dev | wall-clock benches | no | no | **KEEP; consider dropping `html_reports`** (plotters/rayon/regex never rendered in CI, ci.yml:107) |
| `iai-callgrind 0.16.1` | dev, inline | deterministic instruction-count baselines | no | no | **KEEP** — orthogonal to criterion, not duplication (`Cargo.toml:48`) |
| `proptest 1` | dev | LAP + solver property tests | no | no | **KEEP** (also the oracle for the hand-rolled LAP) |

## Priority ranking of actions
1. **Kill `hungarian`, hand-roll Kuhn-Munkres** — single largest mass + supply-chain-risk reduction (drops ~9 transitive crates incl. EOL ndarray 0.13 and dead num-complex); property-test oracle already in place. Idiomatic-gestalt per owner mandate.
2. **pyo3 posture: adopt `abi3` + maturin-native stub generation; reconcile pyproject 0.2.0→0.3.0** — packaging/distribution, from pass-1; verified mechanically in crit-P3.
3. **Drop criterion `html_reports`** — dev-only trim, zero shipped-artifact effect, cuts plotters/rayon/regex from local builds.

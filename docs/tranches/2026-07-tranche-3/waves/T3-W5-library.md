# T3-W5 — Library

**The dependency-hygiene wave: the workspace's last 2020-era numeric stack dies, the py binding gets its typed skin and its single forward-compatible wheel, and knip becomes the durable FE dead-export gate.** `hungarian`→hand-rolled Kuhn-Munkres was the one census-gated row of the three G5 cleared — morph never reaches the LAP path on two independent grounds (R-5), so the swap loses its external-consumer gate. The ballot answered Q1 at option 1 (no PyPI, maximal prune), so the hand stub stands **as built** (`__all__`=15, 135 lines) and the abi3 wheel ships CI-only — no re-derivation branch executes (R-1). Every stub/abi3/stubtest mechanism was exercised against P3's stub verbatim in the P2-L4 worktree; this wave lands the proven apparatus on the W3-pruned, W4-encapsulated tree.

**Dependencies**: ← W4 (0.4.0 version-triple landed — the wheel and npm stanza name 0.4.0; builds on the W3-pruned tree). ∥ the FE chain. **Effort**: M.

---

## Scope

### `hungarian` → hand-rolled Kuhn-Munkres (A20 / G5-unblocked)

`hungarian = "1"` (root `Cargo.toml:39`, resolves **1.1.1**) is consumed at **exactly one call site** — `csp-solver/src/builder/assignment.rs:411`, `hungarian::minimize(&matrix, n, width)`. The caller already quantizes f64→i64, builds the augmented sentinel-column matrix, and shifts to non-negative (`assignment.rs:384-409`), so the crate contributes only the O(n³) inner solve on a flat slice. For that one function it drags a **9-crate transitive subtree** (`cargo tree -p hungarian`): `ndarray 0.13.1` (a 2020 minor, four majors behind current 0.16 — the largest crate in the whole no-dev graph), `num-complex 0.2.4` (**entirely dead** — complex-number algebra compiled for an integer LAP), plus matrixmultiply, num-integer, libm, autocfg, rawpointer, fixedbitset.

- **Replace with a hand-rolled O(n³) Kuhn-Munkres** — a drop-in `fn minimize(&[i64], rows, cols) -> Vec<Option<usize>>`, ~80–120 lines of safe Rust over the `Vec<i64>` the caller already materializes. Killing `hungarian` deletes the workspace's only 2020-era numeric stack **and** its sole dead-code crate (`num-complex`) in one move; `Cargo.lock` sheds all 9. The B&B path is proven-optimal only to n≈15–18 (`assignment.rs:14`), so instances are small — O(n³) needs no Jonker-Volgenant speedup, and JV crates (`lapjv`, `lap`) re-introduce ndarray anyway.
- **Oracle inherited free:** `tests/assignment_proptest.rs` (the LAP-optimality property test) compares the hand impl against the CSP path across random instances — the correctness guard for the swap itself, independent of any consumer census.
- **G5 UNBLOCKED (R-5):** morph is invisible to the swap on two independent walls — Wall A (structural): morph's single `assignment()` call site is unconditionally group-full (`row_group`/`col_group` set every invocation, tier2.rs:91-103), so the dispatch guard (`builder/assignment.rs:340`) always routes to `solve_csp()`, never the `solve_lap()`/`hungarian::minimize` path; Wall B (temporal): morph's pin `csp-solver = "0.2"` predates the LAP dispatch entirely and won't auto-resolve past 0.2.x. Zero `hungarian` in morph's lockfile. **No coordination with morph required.**
- **`pathfinding::kuhn_munkres` REJECTED** — swaps stale mass for modern mass (~6–8 crates: num-traits/indexmap/rustc-hash/thiserror/integer-sqrt, most dead for one fn); not a clean win. KISS ledger.
- **Quiet-box A/B assignment baseline is owned by THIS lane** (R-12): G6 hit a pathological `square_roled/csp/50x50_2roles` group (est. **745 s** for one sample) under load and excluded `assignment` from the `pre-t3` bank — the hungarian-kill needs its own before/after, run quiet, in-wave.

### abi3-py310 CI-only + the hand stub as built (P2-L4 / ballot Q1)

- **Opt-in feature** `abi3 = ["py", "pyo3/abi3-py310"]` (`csp-solver/Cargo.toml`); `--features py` stays version-specific. No source change — `create_exception!`, `#[pyclass(eq, eq_int)]`, `py.detach` all compile under `abi3-py310`.
- `maturin build --release --features abi3 -i <tests-py venv python>` → a **single `cp310-abi3` wheel** (`csp_solver-0.4.0-cp310-abi3-…whl`, inner `csp_solver/csp_solver.abi3.so`). CI-only, **no PyPI**, **abi3t dropped** (ballot Q1). Cross-version proof (P2-L4 §2): the wheel built on 3.13 **imports and solves** on 3.10 / 3.11 / 3.12 — one wheel collapses the 3.10–3.14 matrix.
- **The hand stub stands as built** (Q1 opt 1, no re-derivation — R-1/RES-3 moot): `csp-solver/csp_solver.pyi`, **135 lines** (K31, not 130), full signatures + `__all__` = **15 names**. Ships via maturin's pure-Rust auto-detection (root `csp_solver.pyi` → `csp_solver/__init__.pyi` + auto `py.typed`), **zero `[tool.maturin]` config**; the mixed-layout rejection (S7) stands unreopened. Contents were frozen post-prune in W3; the file **lands here**.
- **`maturin generate-stubs` REJECTED on demonstrated emptiness** (P2-L4 §1, K32): at maturin 1.14.1 + pyo3 0.29's `experimental-inspect`, the command succeeds but emits a type-empty `from _typeshed import Incomplete / def __getattr__(name: str) -> Incomplete: …` stub — **worse than none**, since `py.typed` would advertise typing that doesn't exist (mypy treats every symbol as `Incomplete`≈`Any`). Hand-written wins on stated grounds; re-spike only if pyo3 introspection matures past #5137 **and** the crate pins that pyo3 — not a tranche-III option.
- **RES-6 C5 advisory recorded:** the stub apparatus is kept **without** PyPI — tests-py + editor types justify it under ballot Q1; the KISS bar is stated, not left uneven.

### stubtest wired flag-free + injected-drift proof (P2-L4 §3–§5)

- Wired into the **py-runtime CI lane** after `pytest`, **flag-free**: `uv run --no-sync python -m mypy.stubtest csp_solver --allowlist stubtest_allowlist.txt`; `mypy>=1.11.0` added to `tests-py`'s dev group (uv.lock re-synced).
- **`csp-solver/tests-py/stubtest_allowlist.txt` holds ONE regex** — `csp_solver\.csp_solver` (maturin's pure-Rust layout nests the compiled extension as that private submodule). Surgical, **not** `--ignore-missing-stub` (which would also swallow real surface growth). With it: `Success: no issues found in 2 modules`.
- **`__all__` = 15 declared in the stub** matching runtime (pyo3 0.29 auto-populates the module `__all__`; maturin's `__init__.py` passes it through). Flag-free stubtest requires the stub to declare it — **and** the `__all__` cross-check is a separate error class `--ignore-missing-stub` does not suppress, so surface **growth** is caught even under that flag (narrows the crit-P3 C6 hazard).
- **Injected-drift matrix — 5/5 caught loud (exit 1):** remove a module fn (surface shrink), remove a class method (member presence), rename a param (param-name), drop a live name from `__all__` (`__all__` mismatch), add a runtime symbol absent from the stub (surface growth — the one `--ignore-missing-stub` would have silently passed). The proof is **re-shown in-wave** (the gate).
- **Module-name / stub-stem tripwire** (P2-L4 §5): a CI step (pre-build) asserts `module-name` == stub stem — a future module/stub rename else silently drops the stub **and** `py.typed`, shipping an untyped wheel with no build error.
- **Honest limit (documented, not a defect):** stubtest cannot catch parameter/return **type-annotation** changes — Python has no runtime type info; that is mypy's job on consumer code. The high-value drift band (symbol add/remove, futoshiki re-add, `__all__`, member/arity) fails loud.

### knip — the durable FE dead-export gate (A20 / A19)

Add **knip** to the frontend CI lane as the standing dead-export / dead-file gate. It **subsumes A16 K3/K4 durably** — the hand-maintained kill lists are KISS-rejected (ledger: "hand-maintained kill lists where knip is the gate"); knip is the mechanism, so the `.fira-code` orphan and the 11 type exports A16 flagged stop needing manual chase.

### FE dep drops (A19)

- **`@lucide/vue` → two inline pencil-register glyphs.** Only `Eraser` + `Share2` ship in prod (FilterTuner's 4 icons are `import.meta.env.DEV`-gated, `App.vue:61-62`); inline both as `<svg>` / pencil glyphs — Lucide's clean-line icons are off-register with the hand-drawn aesthetic anyway. Retires the dep outright.
- **`autoprefixer` — verify-then-drop.** It runs a redundant second vendor-prefixing PostCSS pass atop Tailwind v4's `@tailwindcss/vite` (Lightning CSS, which already prefixes per browser targets); it is the only PostCSS consumer (`vite.config.ts:110-119`, no `postcss.config.*`). **Verify** browser-target prefixing under Lightning CSS alone, **then** drop `autoprefixer` + the `css.postcss` block — removes a whole PostCSS pipeline.
- **`esbuild` (direct devDep) — drop.** Deduped with vite@8.1.4's own `esbuild@0.28.1`, imported by no config or script; a redundant explicit pin of a transitive Vite dep. Use an `overrides` entry if a pin is ever truly needed.

### `criterion` `html_reports` drop (A20)

Drop `features = ["html_reports"]` from `criterion` (root `Cargo.toml:37`) — it pulls plotters + plotters-svg + plotters-backend + cast + rayon + regex, and **CI never renders HTML** (only smoke mode `queens -- --test`, `ci.yml:107`). Dev-only trim, zero shipped-artifact effect; low priority, rides the wave.

### `py/common.rs` seam (R9 / RES-7)

Post-prune **recount** of the R9 `py/common.rs` extraction — adopt-with-enums or drop. No pass-2 lane touched it; the recount runs against the maximal-pruned surface (`__all__`=15) this wave lands on.

### maturin `-i` interpreter pin (G6 / R-11a)

The **G6 trap:** a bare `maturin build --release --features py` picks host Python **3.14** and emits an **uninstallable cp314** wheel (the tests-py venv is cp313, pinned `>=3.13,<3.14` for the pyo3-0.29 ABI). **Every wheel-building step pins `-i <tests-py venv python>`** — the CI py-runtime lane and the abi3 build above. R-11a.

### bbnf py-stage vs the abi3 build (RES-4)

Re-run `sync-csp-solver-vendor.sh --verify`'s **py stage against the abi3 build** before landing — the abi3 flip changes the ABI surface after W3/W4's non-abi3 bbnf arms proved green (P2-L2 §5 flag). Nil differential expected; the re-run is the guard, not new work.

## Gates

Verbatim from the reconciliation (§2 DAG, T3-W5):

| Gate | Value |
|---|---|
| Headline | `assignment_proptest` green on hand impl; cp310-abi3 wheel + tests-py + 3.10/11/12 import-solve; stubtest fails-loud proof re-shown; knip lane green |

Component checks:

| Gate | Value |
|---|---|
| KM swap | `tests/assignment_proptest.rs` green on the hand-rolled impl; `cargo tree` shows `ndarray`/`num-complex`/`matrixmultiply`/… gone (9 crates dropped); `Cargo.lock` has zero `hungarian` |
| assignment A/B | quiet-box before/after banked in-lane (G6's `square_roled/csp/50x50` pathology avoided by running quiet, named targets only) |
| abi3 | `maturin build --features abi3 -i <tests-py venv>` → one `cp310-abi3` wheel; tests-py **27/0** (post-W4); imports+solves on 3.10 / 3.11 / 3.12 |
| stub | stub `__all__`=15; stub-stem tripwire passes; flag-free stubtest `Success`; injected-drift matrix **5/5 exit-1** re-shown |
| knip | FE knip lane green (no unreported dead exports/files) |
| FE deps | lucide retired (2 inline glyphs); `autoprefixer` + the `css.postcss` block removed after Lightning-CSS target verify; direct `esbuild` devDep removed |
| bbnf | `--verify` py stage green **against the abi3 build** (RES-4) |
| maturin | every wheel step carries `-i <tests-py venv python>` (no bare cp314 build) |

## Seeds

- [`audit32/A20-library-audit.md`](../evidence/audit32/A20-library-audit.md) — the `hungarian` 9-crate subtree + hand-rolled-KM recommendation, `abi3`/stub posture, `html_reports` trim, the keep/kill/adopt ledger.
- [`audit32/A19-library-audit-fe.md`](../evidence/audit32/A19-library-audit-fe.md) — the lucide/autoprefixer/esbuild drops, the knip-adjacent dead-export census.
- [`pass2/P2-L4.md`](../evidence/pass2/P2-L4.md) — hand-stub decided (generate-stubs rejected on emptiness), abi3-py310 GO, stubtest wired flag-free + the 5/5 injected-drift matrix, `__all__`=15, the stub-stem tripwire.
- [`pass3/G5-morph-census.md`](../evidence/pass3/G5-morph-census.md) — the KM swap external-consumer-clean on two independent walls.
- [`pass3/G6-baseline-run.md`](../evidence/pass3/G6-baseline-run.md) — the maturin `-i` cp314 trap (R-11a), the `assignment` 745 s pathology exclusion, the `pre-t3` bank.
- reconciliation §1.1/§1.4 (py + library rows), R-5 (morph clean), R-11a (maturin pin).

## Residual risks

- **The KM swap is invisible to morph, so the ONLY correctness guard is `assignment_proptest`** — it must exercise the group-free **and** pin-free LAP path the swap targets (morph is structurally group-full, so the oracle, not the census, is the guard). A weak proptest that never hits the closed-form branch would pass a broken hand impl.
- **The assignment A/B baseline does not exist until measured quiet** — G6 hit a 745 s `square_roled/csp/50x50_2roles` group under load and excluded it from `pre-t3`. Run the before/after quiet, in-lane, on **named** bench targets (`cargo bench --workspace -- --save-baseline` fails — the flag is rejected by the lib libtest harness, G6 `criterion.log`).
- **The maturin `-i` pin is a build-order trap, not a nicety** — a bare build silently emits a cp314 wheel that installs nowhere; the pin is load-bearing in every wheel step, or the tests-py/abi3 gates run against an uninstallable artifact.
- **abi3 flips the ABI after the W3/W4 non-abi3 bbnf arms** — the RES-4 py-stage re-run against the abi3 build is the guard; skipping it leaves the abi3 wheel's bbnf-consumer surface unproven (mechanics carry from P2-L4, only the ABI tag moves).
- **`autoprefixer` drop is verify-gated** — confirm Lightning CSS covers the browser targets **before** removing the `css.postcss` block, or silent prefix regressions ship. The drop is an architectural simplification only if the coverage holds.

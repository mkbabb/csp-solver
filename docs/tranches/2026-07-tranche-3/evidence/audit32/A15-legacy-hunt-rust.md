# A15 — LEGACY HUNT (Rust)

Repo `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` @ `3b75eca2`. Read-only.
Every claim cites `file:line` / a quoted command / a pass-1 artifact. Consumes pass-1 R3 + crit-P5 + crit-P2 (does not duplicate their pub-surface sweep).

## Headline

The Rust tree is **remarkably clean** under the NO-legacy order. The two mechanical census sweeps come back empty:

- **TODO/FIXME/XXX/HACK/`todo!`/`unimplemented!`/`#[deprecated]`**: `grep -rn` over `src wasm/src examples tests benches` → **zero hits**.
- **`#[allow(dead_code)]` / `#[allow(unused…)]` / `#[allow(deprecated)]`**: over `src wasm/src` → **zero hits**.

No compat shims, no `#[allow]` warts, no stale `deprecated` markers. The dead surface that remains is **structural** (whole functions/files/features that lost their consumer), not lint-suppressed rot. The kill list below is 3 true removals + a bounded example-excision set; the larger over-`pub` surface is P5's lane (referenced, not re-litigated).

Non-obvious cfg gates are all legitimate: `cfg(debug_assertions)` guards two sudoku-gen invariant checks (`puzzles/sudoku/generate.rs:156,194`); the `cfg(feature="py")` / `cfg(not(feature="py"))` split on `trait ThreadSafe` (`constraint/traits.rs:44-51`) is the deliberate Send+Sync-vs-not divergence kept honest by the sync gate (documented `traits.rs:41-43`). **Not legacy.**

---

## KILL LIST — true removals (dead, zero consumers)

### K1 — `propagate_stratified` (`solver/monotonic.rs:58-110`, ~52 LOC). **DEAD. REMOVE.**
SCC-stratified monotonic propagation. Repo-wide `grep -rn propagate_stratified src wasm/src tests benches examples` → **only the definition** (`monotonic.rs:58`), **zero callers**. Dispatch drives `PropagationStrategy::Sweep` through `propagate_monotonic` (its sibling `monotonic.rs:21`), never the stratified variant. It is `pub`, so `dead_code` is silent today — a latent unwired optimization that never landed a driver.
- **Blast radius: nil.** Delete the fn. No dispatch site, no test, no bench, no example, no doc references it. Corroborates crit-P5 §C5 ("zero callers"). P5 files it under "2 removals" — this is one of them, and it is unambiguously a *removal*, not a demotion (a `pub(crate)` demotion would immediately trip `dead_code` under `-D warnings`, forcing removal anyway).

### K2 — `Csp::adjacency()` accessor (`csp/solve.rs:271-273`, 3 LOC). **DEAD. REMOVE (accessor only).**
`pub fn adjacency(&self) -> Option<&crate::adjacency::Adjacency>`. `grep -rn '\.adjacency()' src wasm/src tests benches examples` → **empty**. The underlying `self.adjacency` **field stays** — 17 internal reads (`grep -c self.adjacency src`). Only the public accessor is dead.
- **Blast radius: nil.** Delete the 3-line method. This is P5's second "removal" and also the *sixth* `crate::adjacency` importer (crit-P5 §"omissions" #2) — removing it must be sequenced with / before the adjacency-file relocation P5 proposes, or the importer count is wrong. Confirms crit-P5 §C5.

### K3 — `wasm/src/isomorphic.rs` (460 LOC) + the `full-mirror` cargo feature. **DEAD. EXCISE.**
Verified at HEAD: `isomorphic.rs` is **460 L** (`wc -l`), gated `#[cfg(feature="full-mirror")]` (`wasm/src/lib.rs:30-31,39-40`), and `full-mirror` is in `default = ["full-mirror","assignment"]` (`wasm/Cargo.toml:38-40`). Pass-1 **R3** established zero consumers constellation-wide: the frontend workers import only the purpose-built flat-wire fns (`solveSudoku`/`solveFutoshiki`), the shipped lean `pkg` `.d.ts` contains **no `class Csp`/`SolveConfig`**, and no test constructs the wasm `Csp` (R3 §3). It carries dead *intent*: `OptimizationMode` (`isomorphic.rs:123-149`) exists only "to drive `solve_optimized` paths in **commit C5**" (`isomorphic.rs:128`) — a commit that never arrived.
- **Blast radius: bounded, safe.** Delete the file; drop the `full-mirror` feature; `default` → `["assignment"]`. **serde stays** (`assignment` also pulls `dep:serde-wasm-bindgen`+`dep:serde`, `Cargo.toml:40`) → no dep/lockfile churn. **Lean 93 KB band untouched** (isomorphic never enters `--no-default-features`); **full-module band shrinks**. Zero consumer/test breakage. Doc updates only: `wasm/src/lib.rs:16-19`, `wasm/README.md`, `CHANGELOG.md`. Full rationale + rejected fold-in alternative: R3 §6. **Do NOT conflate with `wasm/src/assignment.rs`** (221 L) — that has a wasm test (`tests/dualization.rs`), a live bbnf-buddy/morph consumer, and an explicit keep-mandate; it is KEEP, not legacy (R3 §6 note).

---

## KILL LIST — stale examples (closed-tranche one-shot probes)

Examples are **auto-discovered** — `grep -c '\[\[example\]\]' Cargo.toml` → **0**, and **0** `required-features`. So `cargo test --workspace` compiles them, but each is a standalone file; **deletion has zero blast radius on the crate/library/CI** (no bench/CI lane declares them). The discriminator is doc-citation: three examples are one-shot verification harnesses for **closed** tranches, cited only in archived tranche READMEs, never in live `docs/`.

| Example | LOC | Self-description | Live-doc cite? | Verdict |
|---|---|---|---|---|
| `parity_probe.rs` | 253 | "Byte-parity probe … (pass-3 critique)" — diffs baseline commit **91bb8b0** vs the composed kernel tree (`examples/parity_probe.rs:1-6`) | No — only `docs/tranches/2026-07-grand-uplift/` archive | **EXCISE** — baseline `91bb8b0` no longer in tree; comparison DONE |
| `alloc_count.rs` | 251 | self-flags "**throwaway prototype-evidence harness (Pass-2** zero-alloc-hot-path beat)" (`examples/alloc_count.rs:1-6`) | **No hits** | **EXCISE** — author-declared throwaway, Pass-2 closed |
| `probe_futoshiki_gen.rs` | 122 | "G1/G2 probe … v1 ships no tiers regardless" (`examples/probe_futoshiki_gen.rs:1-15`) | **No hits** | **EXCISE (soft)** — one-shot calibration; reusable but currently vestigial |

Combined: **~626 LOC** of closed-tranche scaffolding. `grep -rn 'parity_probe\|alloc_count\|probe_futoshiki_gen' docs` excluding the `2026-07-grand-uplift`/`2026-07-tranche` archives → **empty**.

**KEEP (not legacy — ongoing / live-doc-cited):**
- `gac_timing_probe.rs` — the **committed home** of the GAC 12.6–12.7× speedup number, cited live at `docs/benchmarks.md:14,20`.
- `gac_ab_corpus.rs` — the false-UNSAT **soundness gate**, cited live at `docs/benchmarks.md:16,37,87,97`. Distinct role from gac_timing_probe; not redundant.
- `generate_templates.rs`, `verify_bank_uniqueness.rs` — puzzle-bank tooling (regenerate/verify the `include_dir!` bank).
- `profile_csp.rs`, `profile_sudoku.rs`, `time_sudoku.rs` — generic reusable profiling/timing harnesses (samply/wall-time), not tranche-bound.

---

## Adjacent (NOT my kill — cross-referenced)

- **Over-`pub` internal surface (13 demotions):** `BitsetWorklist`/`::new`, `propagate_monotonic`, `PropResult`, `SearchParams`+5 fields, `PERMANENT_DEPTH`, `ZeroCost`, `CostDomainEval`, `GAC_CORE_CALLS`, + the 3 fenced fns (`ac3_full`, `feasibility_search`, `branch_and_bound`) forced by `private_interfaces` under `-D warnings`. These are **internally-live, merely too-public** → *demote*, not kill. Owned by **P5**; crit-P5 corrects the label ("E0446" → `private_interfaces`) and the scope ("10" → 13 demotions + 2 removals + 1 relocation). K1/K2 above ARE P5's "2 removals."
- **`OptimizationMode` / `solve_optimized`:** LIVE via bbnf's two `finalize()+solve_optimized()` consumers (`config.rs:91`). The *core* enum is not dead; only the isomorphic *mirror* of it (K3) is.
- **Py dead surface** (`solve_sudoku_board`, `template_count`, `add_equals/less_than/greater_than`, `PropagationStrategy`+`propagate_with`, futoshiki-py surface): caller-dead in tests-py but tangled with product/design decisions (Futoshiki-py deletion is an unratified amputation, not hygiene). Owned by **P2**; crit-P2 refutes bundling it as pure dead-code. Out of A15 scope.

## Summary counts
- Census warts (TODO/FIXME/`#[allow(dead)]`/deprecated): **0**.
- True dead removals: **3** — `propagate_stratified` (~52 L), `Csp::adjacency()` (3 L), `isomorphic.rs`+`full-mirror` (460 L + feature).
- Stale example excisions: **2 firm + 1 soft** (~626 L), zero crate blast radius.
- All removals: zero consumer/test breakage; lean wasm band byte-identical; full wasm band shrinks.

# T3-W4 — Core structure (0.4.0)

**The encapsulation wave: the 12+2+1 sweep seals the over-public surface, one module splits at its true seam, and the version-triple lands at 0.4.0 together.** Ratified by ballot Q2 (12+2+1, `propagate_stratified` removed, `Timeout` RESERVED, stamps advance together). The whole sweep was applied and the full merge bar run **green at real HEAD** in a P2-L7 worktree — this wave re-runs the bar at the merged HEAD, where the mechanics carry and only the SHA moves. Two design forks are settled: `gac/mod.rs` earns a **scratch-substrate** split (not the stale "Tarjan half" — Tarjan already lives in `matching.rs:102`), and `search.rs` earns a **waiver** (a split would re-widen the private kernel, an encapsulation regression inside an encapsulation tranche).

**Dependencies**: ← W3 (the pruned tree; T9 removals landed). **Effort**: M–L.

---

## Scope

### The 12+2+1 sweep (P2-L7 §1, ballot Q2, K28)

**12 `pub → pub(crate)` demotions** (all compiler-accepted under `-D warnings`; "13" is dead everywhere — K28):

| # | Symbol | Site (post-sweep) |
|---|---|---|
| 1–2 | `BitsetWorklist` (struct) + `::new` | `solver/ac3.rs:20,28` |
| 3 | `propagate_monotonic` | `solver/monotonic.rs:21` |
| 4 | `PropResult` (type) | `solver/propagate.rs:17` |
| 5 | `SearchParams` (struct **+ all 5 fields**) | `solver/search.rs:51-60` |
| 6 | `PERMANENT_DEPTH` | `solver/search.rs:41` |
| 7 | `ZeroCost` | `solver/optimize.rs:38` |
| 8 | `CostDomainEval` | `solver/optimize.rs:56` |
| 9 | `GAC_CORE_CALLS` | `solver/gac/mod.rs:49` |
| 10 | `ac3_full` | `solver/ac3.rs:76` — **forced** (`private_interfaces`: takes `&mut BitsetWorklist` **and** `&Adjacency`) |
| 11 | `feasibility_search` | `solver/search.rs:289` — **forced** (`&SearchParams` + `&Adjacency`) |
| 12 | `branch_and_bound` | `solver/search.rs:444` — **forced** (`&SearchParams` + `&Adjacency`) |

The forcing lint is **`private_interfaces` erroring under `-D warnings`**, not E0446 (crit-P5 correction, K34). The `&Adjacency` param independently forces items 10–12, doubly-coupling them to the relocation.

**2 removals** — already applied in W3 per T9 (ride here if not: `propagate_stratified`, `Csp::adjacency()` accessor). **1 relocation:** `git mv src/adjacency.rs src/solver/adjacency.rs` (pure R100 rename, 0 body edits); drop `pub mod adjacency;` (`lib.rs:18`); add `pub(crate) mod adjacency;` (`solver/mod.rs:4`). Rewrite **5** in-crate importers `crate::adjacency:: → crate::solver::adjacency::`: `config.rs:10`, `solver/ac3.rs:5`, `solver/propagate.rs:9`, `solver/search.rs:27`, `csp/mod.rs:10`. The **6th** reference was inside `Csp::adjacency()` and dissolves with that method's removal — **sequence the accessor kill with / before the relocation** (A15-K2), the removal and relocation ride the same commit.

### `gac/mod.rs` split — the scratch seam (P2-L7 §4, K33)

The charter's "Tarjan half out" is **stale** — `tarjan_scc` already lives at `gac/matching.rs:102`. The real seam is the ≈130-LOC scratch-pool substrate → new **`gac/scratch.rs`** as `pub(super)`: `GacScratch` (81-113), `MAX_FAST_INDEX` + `fast_index` (115-139), `impl Default` (141-168), `thread_local! SCRATCH` + `with_scratch` (170-189), `resize_tarjan` (549-555). `mod.rs` drops to **≈425 LOC** (pure propagator pipeline). No logic edits — a `use super::scratch::{…}` line + `pub(super)` on the moved items. This is a stronger seam than slicing `propagate_inner`'s interleaved Phase-2 block.

### `search.rs` WAIVER (P2-L7 §5, ballot A Q8, closed no owner row)

`search.rs` (504 L) stays whole. A B&B split would force `trait SearchPolicy` (`:166`, private) and `fn search` (`:182`, private) — and likely `Step` (`:66`) — to widen to `pub(super)`: three kernel internals re-widened to enable a cosmetic 4-LOC-over-budget file cut, an encapsulation regression during an encapsulation tranche. The module doc (`:6-24`) is explicit — one skeleton parameterized by a zero-sized `SearchPolicy`; the policies are co-designed leaves. **Land the single-reason-to-change waiver text** (no owner row needed — CLOSED).

### `wasm/src/errors.rs` extraction (A21-S5)

Extract a shared `coded_error` (+ solution-marshalling) into new `wasm/src/errors.rs`, closing the `error.rs:19` dangling doc ref (which now self-documents the gap as "not reconciled in this pass") **and** the futoshiki→sudoku back-dependency. Tranche-2 logged the gap; tranche-III is the designated closer.

### `ImplicationConstraint` — keep-pub + in-repo test (A21-S6, P2-T2)

Keep `pub` (bbnf-lang constructs it live: `bbnf-lang/crates/ir/.../constraints/engine.rs:86,170` — a genuine external consumer). Add the in-repo test (currently 0 hits in `csp-solver/tests/`; **10 tests**, built + count-confirmed in P2-L2 — lands from the worktree).

### `CspError::Timeout` RESERVE + delete the 2 skipped py tests (ballot Q2, R-3, G6)

`CspError::Timeout` + `CspTimeoutError` are RESERVED — variant kept, add `// reserved: no constructor until cancel-driver` (Q2 verbatim). RESERVE is a **permanent recorded disposition** (neither wire nor defer — the L25-06/59 "no third defer" clause is honored: one resolution, recorded, final). Under RESERVE the variant has no constructor → the two end-to-end tests are unexercisable by construction → **delete `test_budget_exceeded_error_end_to_end` + `test_csp_timeout_error_end_to_end`** (`tests-py/test_wheel_contracts.py`, the exact pair G6 identified as skipped-not-failed at HEAD — removal loses nothing green). **tests-py goes 27 passed / 0 skipped.**

### S3 unified Constraint trait — FOLD-EVALUATE (L25-04)

The one chronic the structure mandate strongly captures. Land it **through** the ThreadSafe/sync-gate tripwire (`constraint/traits.rs:41-51` — the deliberate `cfg(feature="py")` Send+Sync-vs-not divergence, kept honest by the sync gate), never around it.

### `cargo doc` — option (a) (P2-L7 §3, RES-6, K34)

`cargo doc` is **pre-broken at HEAD (20 errors) and CI never runs it**; the sweep nudges it +3/−1 links (`optimize.rs:4-6`'s three intra-doc links to now-`pub(crate)` `branch_and_bound`/`ZeroCost`/`CostDomainEval` become errors; `PERMANENT_DEPTH→SEARCH_ROOT_DEPTH` disappears). Adopt **option (a)**: `RUSTDOCFLAGS='-A rustdoc::private_intra_doc_links' cargo doc --document-private-items` as the canonical internal-doc invocation (these ARE internal modules) + fix the pre-existing `invalid_html_tags` (`unclosed HTML tag 'T'/'bool'`). Wave-level call, not an owner row.

### Version-triple → 0.4.0 together (T8)

`csp-solver/Cargo.toml`, `csp-solver/pyproject.toml`, and `wasm/Cargo.toml` all advance to **0.4.0** in this wave's surface (W3 stamped wasm 0.4.0 already; here the crate + pyproject join it). The W2 interim 0.3.0 pyproject stamp must not survive past this bump.

## Gates

Verbatim from the reconciliation (§2 DAG, T3-W4):

| Gate | Value |
|---|---|
| Headline | `cargo test --workspace` + queens `--test` + `check --features py` + clippy `-D warnings` + `wasm-pack test --node` + the internal-doc invocation; **bbnf gate re-run**; tests-py **27/0** |

Component checks (all green at real HEAD in the P2-L7 worktree; re-run at merged HEAD):

| Gate | Value |
|---|---|
| build/lint | `cargo build --workspace` 0 errors; `cargo clippy --workspace --all-targets -- -D warnings` 0 warnings |
| test | `cargo test --workspace` all binaries 0-failed + doctests 4 passed + wasm crate 0-failed |
| queens | `cargo bench -p csp-solver --bench queens -- --test` every case Success |
| py | `cargo check --features py` 0 errors |
| wasm | `cargo clippy -p csp-solver-wasm --target wasm32 -- -D warnings` + `wasm-pack test --node csp-solver/wasm` (5+9 passed) |
| doc | the `-A private_intra_doc_links --document-private-items` internal invocation clean |
| bbnf | `--update && --verify` re-run at merged HEAD |
| tests-py | **27 passed / 0 skipped** (the 2 Timeout-gated tests deleted) |

## Seeds

- [`pass2/P2-L7.md`](../evidence/pass2/P2-L7.md) — the applied sweep table, the full merge bar (all green), the gac scratch-split sketch (§4), the search.rs waiver (§5), the cargo-doc finding (§3), T9 (§6).
- [`audit32/A21-module-structure-be.md`](../evidence/audit32/A21-module-structure-be.md) §3 — S4/S5/S6 (relocation, errors.rs, ImplicationConstraint).
- [`pass3/G6-baseline-run.md`](../evidence/pass3/G6-baseline-run.md) — the two skipped py tests identified as the Timeout pair (R-3).
- Synthesis §2.2 (structure rows), §2.6 L25-04, reconciliation R-3 / §1.2.

## Residual risks

- **The full merge bar was green in a worktree at `3b75eca2`; the wave re-runs it at merged HEAD** — main is ahead, so integers refresh (RES-2); the wasm lane (the PASS-1 gap) is now proven, so no new class of gate is untested.
- **The relocation and the accessor kill are doubly-coupled** (`&Adjacency` param + the sixth importer) — botched sequencing miscounts the importers and reddens the sweep. Ride removal + relocation + demotions in one commit, as P2-L7 did.
- **RESERVE is a disposition, not a code change beyond a comment + two test deletions** — the risk is treating it as a defer and re-litigating it; the reconciliation (R-3) is explicit that this is final. If the cancel-driver ever lands, the reserved variant is the wire point.
- **`cargo doc` option (a) does not green the public `cargo doc`** — it can't (20 pre-existing errors, non-CI). The gate is the *internal* invocation; do not scope-creep into a full doc-link repair here (that's a doc-pass concern).

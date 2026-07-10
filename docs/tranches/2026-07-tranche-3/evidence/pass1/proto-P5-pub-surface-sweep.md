# Prototype P5 — pub-surface tightening sweep

**Lane key:** P5-pub-surface-sweep
**Worktree:** `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8f3bd831-d64-14`
**Verdict: SHAPE-CHANGED → GO** (the demotions are all achievable and all three gates pass, but the set had to *expand* by 3 items and 2 "demotions" are really *removals*).

---

## The ONE question

Do the 10 visibility demotions plus the adjacency relocation survive every consumer — the in-crate call
sites, `cargo test --workspace` (all binaries incl. bench `--test` asserts), `cargo check --features py`,
and the **bbnf vendored compile** (root `{bbnf, bbnf-ir, egraph}` ∪ skinny `{passes}` ∪
vendored-csp-solver × `{default, py}` ∪ lattice test)?

**Answer:** Yes — every target lands below every consumer's surface, but two structural facts the charter's
line-numbered list did not anticipate forced a shape change (both proven by the compiler, not guessed):

1. **Three "do-NOT-touch" pub functions had to be demoted too** to make two of the ten demotions legal at all
   (private-in-public, E0446).
2. **Two of the ten targets are already dead code** — demoting them to `pub(crate)` trips `warnings = "deny"`
   (`Cargo.toml:40-41`), so the honest disposition is *removal*, not demotion.

---

## What I built / probed

### Applied in the worktree (`git diff --stat HEAD -- src/`: 12 files, +23 −92)

The 10 charter demotions, verbatim, all landed:

| Item | Site | New vis |
|---|---|---|
| `BitsetWorklist` (struct) | `solver/ac3.rs:20` | `pub(crate)` |
| `BitsetWorklist::new` | `solver/ac3.rs:28` | `pub(crate)` |
| `propagate_monotonic` | `solver/monotonic.rs:21` | `pub(crate)` |
| `propagate_stratified` | `solver/monotonic.rs:58` | **REMOVED** (see §Shape-change B) |
| `PropResult` (type) | `solver/propagate.rs:17` | `pub(crate)` |
| `SearchParams` + its 5 fields | `solver/search.rs:51-60` | `pub(crate)` |
| `PERMANENT_DEPTH` | `solver/search.rs:41` | `pub(crate)` |
| `ZeroCost` | `solver/optimize.rs:38` | `pub(crate)` |
| `CostDomainEval` | `solver/optimize.rs:56` | `pub(crate)` |
| `GAC_CORE_CALLS` | `solver/gac/mod.rs:49` | `pub(crate)` |
| `Csp::adjacency()` | `csp/solve.rs:272` | **REMOVED** (see §Shape-change B) |

Plus the **adjacency relocation**: `git mv src/adjacency.rs → src/solver/adjacency.rs`; dropped
`pub mod adjacency;` from `lib.rs:18`; added `pub(crate) mod adjacency;` to `solver/mod.rs:4`; rewrote the 5
in-crate importers `crate::adjacency::` → `crate::solver::adjacency::` (`config.rs:10`, `csp/mod.rs:10`,
`solver/ac3.rs:5`, `solver/propagate.rs:9`, `solver/search.rs:27`). `adjacency.rs`'s own body uses only
`crate::constraint`/`crate::domain` absolute paths, so the move needed no edits inside it.

### Consumer census (grep, before touching anything)

Ran `grep -rn` for every target across the whole repo (`tests/ benches/ examples/ src/py/ wasm/src/`) and across
**bbnf-lang's non-vendored crates**. Result: **zero external consumers** of any of the 10 targets. Every real
use site is crate-internal (`src/csp/solve.rs` + `src/solver/*`); the only hits outside `src/` are doc-comment
prose containing the word "adjacency"/"ZeroCost". bbnf-lang imports only kept-pub symbols —
`csp_solver::{Csp, SolveConfig, OptimizationMode, Pruning}`, `constraint::{Constraint, Revision, VarId,
ImplicationConstraint}`, `domain::{Domain, LatticeDomain, CostDomain}`, `variable::Variable` — plus one method
call `csp.solve_optimized(&config)` (`bbnf-lang/crates/ir/src/passes/csp_strategy/mod.rs:603`). `solve_optimized`
is kept-pub and internally routes to `CostDomainEval`, so bbnf never *names* `CostDomainEval` — demoting it is safe.

---

## Two shape changes (both compiler-forced, not stylistic)

### Shape-change A — three fenced pub functions must be demoted with their param types

`cargo build --workspace` on the literal 10-item set produced:

```
error: type `BitsetWorklist` is more private than the item `ac3_full`
error: type `SearchParams` is more private than the item `feasibility_search`
error: type `SearchParams` is more private than the item `branch_and_bound`
```

Root cause: `ac3_full(…, worklist: &mut BitsetWorklist, …)` (`ac3.rs:76`),
`feasibility_search(…, params: &SearchParams, …)` (`search.rs:289`), and
`branch_and_bound(…, params: &SearchParams, …)` (`search.rs:444`) are `pub` and take the demoted types in
their signatures. Rust forbids a `pub` item exposing a `pub(crate)` type (E0446). The charter's "do NOT touch
… branch_and_bound … ac3_full, feasibility_search" is therefore **incompatible** with demoting
`BitsetWorklist`/`SearchParams` unless those three are *also* demoted.

**Resolution + justification:** I demoted all three to `pub(crate)`. This is safe and correct because they have
**zero external consumers** — verified by grep across repo + bbnf: the free functions are called only from
`src/csp/solve.rs` (internal). (The `solve_branch_and_bound` hits in `tests/` are an unrelated
`AssignmentBuilder` method, `builder/assignment.rs:355`; the `test_ac3_full_solve` hit is just a test name.)
The charter's fence was precautionary, not consumer-driven. **The critique pass must ratify expanding the
demotion set to 13: add `ac3_full`, `feasibility_search`, `branch_and_bound`.** The alternative — keeping
`BitsetWorklist` and `SearchParams` `pub` — would drop 2 of the 10 wins and is strictly worse encapsulation.

*Rustdoc note:* `optimize.rs:4` has an intra-doc link `[crate::solver::search::branch_and_bound]`. Intra-doc
links to `pub(crate)` items resolve fine within the crate's own docs; `cargo build/test/check` don't run
rustdoc, and the bbnf gate is `cargo check`, so no gate is affected. A `cargo doc -D warnings` lane (not in
scope here) could warn — flag for W-C doc pass.

### Shape-change B — two targets are dead code; demotion → removal

`propagate_stratified` (`monotonic.rs:58`, SCC-stratified propagation) and `Csp::adjacency()`
(`csp/solve.rs:272`, an accessor) have **zero callers anywhere** (not even in-crate). While `pub`, the
dead-code lint treats them as reachable and stays silent; demoting to `pub(crate)` immediately yields:

```
error: function `propagate_stratified` is never used
error: method `adjacency` is never used   (`-D dead-code` implied by `-D warnings`)
```

`propagate_stratified` was built but never wired into dispatch (`solve.rs:51` uses `propagate_monotonic` for
`PropagationStrategy::Sweep`); `Csp::adjacency()` is an unused public accessor (the `self.adjacency` *field*
stays — it's read internally by search/finalize). **The honest disposition is removal, not demotion** — the
demotion merely *surfaces* that these are pre-existing dead public API. I removed both to get a green gate.
**These two belong in the dead-surface excision wave (W-B), not the encapsulation wave (W-C).** If the owner
prefers to keep them as reserved surface, the only way to satisfy `-D warnings` is `#[allow(dead_code)]` on a
`pub(crate)` item — a smell this campaign otherwise rejects.

---

## Gate results (quoted)

**GATE 1a — `cargo test --workspace`** (run after all fixes): every binary green.
```
test result: ok. 13 passed; 0 failed; ...        (the big integration binary, 42.05s)
test result: ok. 42 passed; 0 failed; 6 ignored  (48-test binary; 6 pre-existing ignores)
   Doc-tests csp_solver
test result: ok. 4 passed; 0 failed; 0 ignored
```
(17 binaries + both doc-test targets, all `0 failed`.)

**GATE 1b — bench `--test` asserts compile + run:**
```
cargo bench -p csp-solver --bench queens -- --test
Testing queens_configs/8q_all/acfc_failfirst
Success                          ← every case "Success", EXIT=0
cargo bench --workspace --no-run → Finished `bench` profile … (all benches compile)
```

**GATE 2 — `cargo check --features py`:**
```
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 5.31s   (0 errors)
```

**GATE 3 — bbnf vendored compile.** Method: rsync'd bbnf-lang → scratch (excl `target/.git`), symlinked its
two out-of-tree sibling patch deps (`../parse-that`, `../pprint` from `.cargo/config.toml:48
[patch.crates-io]`), then **replaced `scratch/crates/csp-solver/src` wholesale with my modified worktree src**
(the exact operation `sync-csp-solver-vendor.sh --update` performs — the gate diffs only `src/`+`data/`, never
`Cargo.toml`), and ran the `--verify` stages:
```
[1/4] root: cargo check -p bbnf -p bbnf-ir -p egraph
      Finished `dev` profile … in 9.89s   (0 errors; 190 pre-existing warnings in generated grammar code)
[2/4] skinny: cargo check -p passes
      Checking csp-solver v0.1.0 (…/bbnf-scratch/crates/csp-solver)  ← recompiled from overlaid src
      Finished `dev` profile … in 2.84s   (0 errors)
[3/4] vendored csp-solver default: cargo check
      Checking csp-solver v0.1.0 (…/bbnf-scratch/crates/csp-solver)
      Finished `dev` profile … in 1.10s   (0 errors)
test:  cargo test --test lattice
      test result: ok. 16 passed; 0 failed; 0 ignored
```
The vendored crate recompiled from the overlaid path (log confirms), and every bbnf consumer built. Because a
demoted symbol referenced by bbnf would fail with E0603 (private), a clean compile **proves bbnf references
none of the 13 demoted/2 removed symbols** — corroborating the grep census. (The `--features py` isolated stage
`verify_py_isolated` was not re-run inside bbnf's scratch; GATE 2 covers the identical py surface, and the py
bindings reference no demoted symbol — grep of `src/py/` shows only doc-comment mentions.)

**No target had a hidden consumer that forced it to stay `pub`.** All 10 charter targets + the 3 forced
additions demote cleanly; the only surprises were the E0446 coupling (A) and the two dead items (B).

---

## What the critique pass should attack

1. **Ratify the expanded set (13, not 10).** Is demoting `ac3_full`/`feasibility_search`/`branch_and_bound` to
   `pub(crate)` acceptable given they're grep-proven internal-only, or is the charter's fence load-bearing for
   a reason not visible here (e.g., a future benchmark/example intended to call them directly, or an external
   crates.io consumer of the *published* 0.3.0 that this worktree's bbnf snapshot doesn't represent)? The
   published-crate surface is the one blind spot — my census covers this repo + local bbnf, not arbitrary
   crates.io downstreams. If csp-solver 0.3.0 is published with these `pub`, demoting them is a semver-major
   removal (consistent with the intended 0.4.0 bump, but worth stating).
2. **Re-file the two dead items (`propagate_stratified`, `Csp::adjacency()`) under W-B, not W-C.** Confirm the
   owner wants them *removed* (surface honesty) vs kept as reserved API. `propagate_stratified` is real,
   non-trivial SCC-stratified code that was never wired in — removal discards a latent optimization; flag
   whether it should instead be *wired* (a separate question entirely outside this lane).
3. **Isolation rigor of GATE 3.** I ran only the treatment (my src overlaid), not a paired baseline
   (clean-0.3.0 src overlaid) — justified because the grep census makes the demotion differential provably nil
   for bbnf, and E0603 would have fired on any hidden reference. If the critique wants belt-and-suspenders,
   re-run with the un-demoted src to confirm identical (0-error) output. Note the scratch vendored crate
   carries version string `0.1.0` (bbnf-local, decoupled from csc411's `0.3.0`); it already declares the
   0.3.0-era `hungarian` dep, so the src overlay was low-drift and compiled clean.
4. **`solve_with_cost_eval` visibility.** The charter keeps it `pub`, and bbnf reaches optimization only through
   `solve_optimized` (which wraps it). If nothing external calls `solve_with_cost_eval` directly (grep shows
   only `csp/solve.rs:291` internal + the pub `solve_optimized`), it's a *candidate for a future demotion* the
   charter did not list — but it takes a `&dyn DomainCostEval`/generic evaluator, which is the documented
   extension point (`optimize.rs:16`), so keeping it pub is defensible. Not touched here; flagged for completeness.

# Critique — proto-P5-pub-surface-sweep

**Lane:** crit-proto-P5-pub-surface-sweep · **Stance:** refute-by-default
**Target report:** `proto-P5-pub-surface-sweep.md` (claim: "All 10 charter demotions + the adjacency
relocation land below every consumer; all three gates GREEN").
**Verdict:** The prototype's *own* SHAPE-CHANGED finding is CONFIRMED and well-evidenced. The headline claim
**as phrased in the convergence target ("10 demotions") is CORRECTED** — the honest scope is **13 demotions +
2 removals + 1 file relocation**. Structural preconditions all check out against `csp-solver@3b75eca2`; the gate
*result numbers* are UNVERIFIABLE from the critique seat (demotions live only in the prototype's worktree; the
main tree carries unrelated uncommitted changes, so a rebuild here would test the wrong tree).

---

## Claim-by-claim adjudication

### C1 — The 10 targets exist, are `pub`, at cited locations. **CONFIRMED.**
Every target present and `pub` in the live tree (line numbers match the report within ±0):
- `BitsetWorklist` struct `solver/ac3.rs:20`; `::new` `ac3.rs:28` (`impl` at 27, `pub fn new` at 28).
- `propagate_monotonic` `solver/monotonic.rs:21`; `propagate_stratified` `monotonic.rs:58`.
- `PropResult` `solver/propagate.rs:17` (`pub type`).
- `SearchParams` `solver/search.rs:51` with **exactly 5 pub fields** (`pruning, ordering, max_solutions,
  node_budget, cancel`, `search.rs:52-60`) — the "+ its 5 fields" is exact.
- `PERMANENT_DEPTH` `search.rs:41`; `ZeroCost` `optimize.rs:38`; `CostDomainEval` `optimize.rs:56`;
  `GAC_CORE_CALLS` `gac/mod.rs:49`.
- `Csp::adjacency()` `csp/solve.rs:272` (`pub fn adjacency(&self) -> Option<&crate::adjacency::Adjacency>`).

### C2 — `src/adjacency.rs` movable with no internal edits. **CONFIRMED.**
`src/adjacency.rs` exists; its only `use`s are `crate::constraint::{ConstraintEnum, VarId}` and
`crate::domain::Domain` (`adjacency.rs:3-4`) — both absolute, so `git mv` needs no body edit. `lib.rs:18` is
`pub mod adjacency;`. `src/solver/adjacency.rs` does not exist in the live tree (relocation is worktree-local, as
claimed).

### C3 — Zero external consumers of the 10 (repo + bbnf). **CONFIRMED.**
Grep across `tests/ benches/ examples/ wasm/src/ src/py/` returns only non-binding hits, exactly as the report
enumerates: `ZeroCost` → one doc-comment `py/config.rs:65`; `ac3_full` → test *name* `tests/solver.rs:689`;
`feasibility_search` → doc-comment `wasm/src/futoshiki.rs:228`; `branch_and_bound` → the unrelated builder method
`solve_branch_and_bound()` (`tests/gac_kernel_beats.rs:308`, `tests/assignment_builder.rs:186`) + test name
`tests/optimize.rs:194`. All other targets: zero hits.
bbnf non-vendored crates: I ran the full symbol sweep — **all 13 demoted symbols score 0**; the only kept-pub
hit is `csp.solve_optimized(&config)` at `crates/ir/src/passes/csp_strategy/mod.rs:603` (exact match to the
report). bbnf imports resolve to `Csp`, `constraint::{Constraint, Revision, VarId, ImplicationConstraint}`,
`domain::{Domain, LatticeDomain, CostDomain}`, `variable::Variable`, `OptimizationMode` — none demoted.

### C4 — Shape-change A (3 fenced `pub` fns must demote too). **CONFIRMED (mechanism), CORRECTED (label + under-stated cause).**
- `ac3_full` (`ac3.rs:76`), `feasibility_search` (`search.rs:289`), `branch_and_bound` (`search.rs:444`) are all
  `pub` and take `&mut BitsetWorklist` / `&SearchParams` in signature → leaving them `pub` while demoting those
  types trips the lint under `[workspace.lints.rust] warnings = "deny"` (root `Cargo.toml:40-41`, applied to
  *all* builds, not just clippy). So the demotion is genuinely forced. **CONFIRMED.**
- **CORRECTION (label):** the report calls this **E0446**. E0446 is the legacy hard-error for a *fully private*
  type in a `pub` signature. A `pub(crate)` type in a `pub` fn fires the **`private_interfaces`** lint
  (warn-by-default), which only errors *because* of `-D warnings`. The quoted message ("type … is more private
  than the item …") is the `private_interfaces` wording, not E0446. Outcome identical; the wave text must not
  cite E0446.
- **CORRECTION (under-stated cause):** the report attributes the forced demotion of the three *solely* to the
  `BitsetWorklist`/`SearchParams` coupling. All three **also** take `&Adjacency` (`ac3.rs:79`, `search.rs:292`,
  `search.rs:447`), so the **adjacency relocation independently forces the same three demotions**. This
  *strengthens* the prototype (the three are doubly-coupled) but the rationale as written is incomplete. I
  verified no *other* pub item leaks `Adjacency`: `forward_check`/`ac_fc` (`propagate.rs:25,88`) and
  `ac3_from_variable` (`ac3.rs:117`) are already `pub(crate)`; `config.rs:133` is a `pub(crate)` field. So after
  the three demote, the relocation is clean — no fourth surprise.

### C5 — Shape-change B (two dead items → removal). **CONFIRMED.**
- `propagate_stratified`: repo-wide grep yields only its definition (`monotonic.rs:58`) — **zero callers**.
  Dispatch uses `propagate_monotonic` for `PropagationStrategy::Sweep`.
- `Csp::adjacency()`: `\.adjacency()` grep is **empty**; the `self.adjacency` *field* is read internally
  (`search.rs:99,130,141,153`; `csp/solve.rs:31,39,68,85,104`; built `csp/mod.rs:120`) — so the field stays,
  only the accessor is dead. **CONFIRMED.**
- Mechanism: while `pub` (reachable public API) `dead_code` is silent; demote to `pub(crate)` on a truly-unused
  item → `dead_code` fires → denied by `warnings = "deny"`. Sound. Removal (not `#[allow(dead_code)]`) is the
  honest disposition. **CONFIRMED.**

### C6 — Gate *results* (test counts, bbnf compile, `check --features py`). **UNVERIFIABLE (plausible).**
The demotions exist only in the prototype's worktree; the live tree has unrelated `M` changes, so re-running the
three gates here would not exercise P5's diff. I therefore cannot confirm "13 passed / 42 passed / 4 doc-tests /
16 lattice / Finished 0 errors" numerically. What I *can* attest: every structural precondition the gates depend
on holds (symbols/coupling/dead-code/census all verified), so a GREEN outcome is plausible. The specific numbers
rest on the prototype's word.

### C7 — GATE 3 (bbnf) isolation. **PLAUSIBLE, self-flagged weak.**
Single-arm: the prototype overlaid its *entire* modified `src/` onto bbnf's vendored `0.1.0` crate and compiled.
Any drift between csc411 HEAD `src/` and bbnf's pinned vendor rides along, so a clean compile proves "the whole
overlay builds," not "the demotion differential is nil." The census (C3) independently proves bbnf names none of
the 13, and E0603 would fire on any hidden reference — so GATE 3 is corroborative, acceptable for a PASS-1 probe.
The report itself asks for the paired baseline; that belongs in the authoring wave's gate run.

### C8 — Kept-pub surface (`solve_optimized`, `solve_with_cost_eval`). **CONFIRMED.**
`solve_optimized` (`csp/solve.rs:287`) and `solve_with_cost_eval` (`csp/solve.rs:227`) are `pub`; bbnf uses only
the former (C3). `solve_with_cost_eval` as a future demotion candidate is correctly flagged, not acted on.

---

## Blast-radius findings the report missed or under-stated

1. **Count inconsistency (material).** The convergence target and the report's prose say "**10** charter
   demotions." The delivered table has **11 rows** (row 11 = `Csp::adjacency()`), and shape-change A adds 3 more,
   and 2 rows are *removals* not demotions. The true, authorable scope is **13 demotions + 2 removals + 1 file
   relocation** — the "10 + relocation" framing must not survive into the wave.
2. **Sixth adjacency importer unreconciled (minor).** The report lists "5 in-crate importers" of
   `crate::adjacency` (`config.rs:10`, `csp/mod.rs:10`, `ac3.rs:5`, `propagate.rs:9`, `search.rs:27`). There is a
   **sixth** inline reference at `csp/solve.rs:272` inside `Csp::adjacency()`. It disappears *because* shape-change
   B removes that method — coherent, but the two shape changes' interaction is never stated; the wave must sequence
   "remove `Csp::adjacency()`" before/with "relocate adjacency" or the importer count is wrong.
3. **wasm CI lane never run (gate-coverage gap).** The prototype ran `test --workspace`, `check --features py`,
   and the bbnf compile — not the CI `wasm` lane (`wasm-pack test --node` + clippy `--target wasm32`). Census
   shows wasm references the targets only in doc-comments (`wasm/src/futoshiki.rs:228`), so risk is low, but the
   authoring wave's real merge bar includes that lane; "all gates GREEN" overstates coverage.

---

## Convergence

**60%.** The structural core is settled and authorable; the item cannot be authored *verbatim* as stated.

Deductions:
- **−12%** headline scope is wrong: "10 demotions + relocation" must become "13 demotions + 2 removals +
  relocation" before authoring; the convergence-target sentence is not truthful as written.
- **−8%** gate result numbers unverifiable from the critique seat — need a confirming run inside the authoring
  worktree against the real HEAD.
- **−8%** owner decision fork on the two dead items: *removed* (W-B surface honesty) vs *kept as reserved API* vs
  `propagate_stratified` *wired in* (latent SCC-stratified optimization). Splits which wave owns them.
- **−7%** owner ratification of demoting the three fenced fns (`ac3_full`/`feasibility_search`/`branch_and_bound`)
  — semver-major removal on published `csp-solver 0.3.0`; the published-crate downstream is the one census blind
  spot (only repo + local bbnf covered).
- **−3%** GATE 3 single-arm; wasm lane unrun — belt-and-suspenders confirmation still owed.
- **−2%** `E0446` mislabel must be corrected to `private_interfaces` in the wave text.

---

## kill_list (claims that must die as literally phrased)
1. "All **10** charter demotions … land" — REPLACE with "13 demotions + 2 removals + 1 relocation."
2. "the **adjacency relocation** … land below every consumer" — the accessor `Csp::adjacency()` is **removed as
   dead code**, not relocated; and the relocation **independently forces** the 3-fn demotion (not stated).
3. "private-in-public, **E0446**" — it is the **`private_interfaces`** lint erroring under `-D warnings`.
4. Implicit: the 3 fenced fns demote **only** because of `BitsetWorklist`/`SearchParams` — false; `&Adjacency`
   exposure forces them too.
5. "**all three gates** GREEN" (as a completeness claim) — the wasm CI lane was not run and the numbers are
   unconfirmed outside the prototype's worktree.

# Pass-3 Critique — Q9: Kernel-beat risk (singletons-Vec fuse & GAC adjacency scratch vs the warm-start/scratch invariants)

**Question (synthesis §6, Q9):** Can the singletons-Vec fuse (`all_different.rs:55`) or the adjacency value→index scratch (`gac/mod.rs:236,239`) regress the GAC warm-start / scratch invariants (`GacScratch`, matching cache)? Name the EXACT invariants a W3 gate must assert, as runnable test predicates.

**Discipline:** adversarial, fresh evidence. Repo READ-ONLY at HEAD `8913023e` (`git rev-parse` confirmed). Every source line re-read; GAC-relevant test suite rebuilt and run green (42/0/6 in `solver` + `all_different_except` + `solution_set_invariance`).

**Verdict: YES — both beats can silently regress correctness, and the current W3 gate as authored would NOT catch it.** The two beats touch state that no existing test targets. The gate line in T2-W3 needs six named predicates added and the beats pinned to their safe variants. Amendment below.

---

## 1. What the beats actually touch (re-derived from source)

**Beat A — GAC adjacency value→index scratch.** L26 candidate #1 (verify-26 grade A). The adjacency build (`gac/mod.rs:230-248`) linear-scans the value universe twice per edge:
- `s.assigned_ns.contains(&val)` — `mod.rs:236` — O(n_singletons)
- `s.all_vals.iter().position(|x| *x == val)` — `mod.rs:239` — O(n_vals)

both inside `for pu in 0..n_vars { for val in domain.iter() }` → O(E·n_vals). The beat replaces them with an O(1) reverse map (integer value → `all_vals` index). **This introduces a NEW `GacScratch` field.** The SAME `position` scan is reused at `mod.rs:271` in the **warm-start cache read** — so the beat directly touches the matching-cache path, not just adjacency.

**Beat B — singletons-Vec pool/fuse.** L26 candidate #2 (verify-26 grade A). `all_different.rs:55` allocates `let singletons: Vec<(VarId, D::Value)> = self.scope.iter().filter_map(…).collect()` on every `revise`. Confirmed dominant malloc source (86% gen_holedig / 75% sudoku16 / ~55% futoshiki7). **There is a TWIN** at `all_different_except.rs:112-119` (the small-scope <4 path) that any pool must handle identically or leave untouched. L26's fix text says "fuse … (prune inline, no materialization), **or** pool a thread-local scratch" — those two are NOT behaviorally equivalent (see INV-D).

**Not in W3 (stays DEFER — do not conflate):** CSR/flat-arena adjacency (`Vec<Vec<u32>>`→arena) and the Vec-indexed warm cache (`HashMap<u32,…>`→`Vec`). L26 candidate #1 marks both DEFER; synthesis D20 confirms "CSR adjacency + Vec-indexed warm cache … all DEFER." So the `gac_id`-keyed `HashMap` and its `CACHE_CAP=8192` wholesale-clear stay untouched in W3. Any W3 diff that alters cache keying is out of scope and must be rejected.

---

## 2. The invariants at risk (the load-bearing answer)

### GacScratch invariants

**INV-A — per-call scratch reset / zero cross-call leakage.** Every `GacScratch` buffer is cleared or fully overwritten at the top of `propagate_inner` (`assigned_ns.clear()` :186, `participants.clear()` :199, `all_vals.clear()` :228, `reset_adj` :229, the `match_*`/`dist` resizes :257-262, `reachable`/`bfs` :330-332, `resize_tarjan` :360). The **new value→index buffer must join this discipline.** A `Vec<u32>` direct-indexed by integer value must be invalidated for exactly the entries the previous call wrote (or generation-stamped) — a `resize(max_val+1, NONE)` without a per-call clear leaks call N's index for a value that call N+1 assigns a DIFFERENT index. Failure mode: `adj[pu]` points at the wrong `all_vals` slot → wrong value pruned at `mod.rs:406` → **silent mis-pruning** (drops valid solutions or admits invalid ones). Highest-severity regression; no crash.

**INV-B — all_vals bijection.** After the build, `all_vals` holds each distinct non-sentinel, non-assigned live value exactly once and `adj[pu]` contains `vi` iff `all_vals[vi] ∈ dom(participant pu) \ {sentinel} \ assigned_ns`. Later code (`mod.rs:309,406`) recovers the value via `all_vals[vi]`, so the specific index numbering is free, but dedup must be exact. A reverse map that fails to dedup a repeated value inflates `n_vals`, corrupts the bipartite dimensions, and breaks matching coverage (`mod.rs:293-297`).

**INV-C — generic value-type bound preserved (bbnf blast radius).** `propagate_gac_core` deliberately requires only `D::Value: PartialEq + 'static` — "no `Ord`, `Hash`, or `ValueIndex` bound, so `FiniteDomain<String>` still compiles" (`mod.rs:160-162`, verbatim). A reverse map as `HashMap<V,u32>` (needs `Hash+Eq`) or `BTreeMap` (needs `Ord`) tightens the bound; that propagates to `impl Constraint<D> for AllDifferent where D::Value: PartialEq + 'static` (`all_different.rs:114-116`) — a **semver-visible signature narrowing** that the bbnf vendored-copy sync-gate (`sync-csp-solver-vendor.sh --verify`, the W3 precondition named in synthesis §2 T2-W3 and Residual #3) must re-clear. The integer fast path must be gated (specialization/helper trait) so the generic path stays bound-free.

### Matching-cache invariants

**INV-G — cache stores VALUES, round-trips through them; warm-start is a pure hint.** The cache is `HashMap<gac_id, Vec<Option<V>>>` storing matched **values** per scope position (`mod.rs:100,309`), decoupled from per-call `all_vals` indices by design (indices are per-call-unstable as domains shrink). Warm read re-resolves each cached value to the current call's index via `all_vals.iter().position(|x| x==cv)` (`mod.rs:271`). Two regression modes:
- A beat that "optimizes" the cache to store INDICES → breaks across calls. Must NOT (and is DEFER-only anyway).
- The value→index scratch may serve the `mod.rs:271` read ONLY if built over the CURRENT call's `all_vals` (it is — the build at :228-248 runs first). Serving it from a stale prior-call map silently mis-seeds. Per the documented pure-hint property (`mod.rs:30-33`: "a stale cache costs extra augmentation, never correctness"), a bad seed is a **perf** regression invisible to correctness tests → needs a warm-vs-cold parity gate, not just a solve-succeeds gate.

**INV-3 (Régin soundness under any cache) — must survive both beats.** For ANY cache contents (valid, stale, garbage), the final domains after `hopcroft_karp` completion are identical to a cold (`gac_id=None`) run. This is the property that makes warm-start safe; both beats must preserve it and it is the single most important predicate to assert.

### all_different.rs invariants

**INV-D — snapshot semantics (pool vs fuse-live divergence).** Current `revise_impl` takes a SNAPSHOT of which vars are singletons BEFORE pruning, then prunes (`all_different.rs:55-78`). **Pool** (reuse a scratch `Vec`, same snapshot-then-prune) preserves this exactly — byte-identical. **Fuse-live** (read `singleton_value()` inline while pruning) prunes MORE within one call: a peer that becomes singleton after the first prune gets re-processed. That is SOUND (never drops a valid solution) — so `solution_set_invariance.rs` passes it — but it changes node counts and the `max_solutions=1` trajectory (CLAUDE.md declares that trajectory-dependent). Divergence surfaces specifically when `live < GAC_MIN_PARTICIPANTS=3` (GAC skipped, singleton pass is the ONLY propagation) or `GAC_IN_ALLDIFF_ENABLED=false`. So the fuse cannot be validated by the existing enumerate test; it needs a domain-state/node-count equivalence predicate.

**INV-E — pool re-entrancy / borrow disjointness.** `revise_impl` calls `propagate_gac_core` at `all_different.rs:93`, which borrows the `SCRATCH` thread-local (`mod.rs:140-141`). If the singletons buffer is folded into `GacScratch` and held across that call → `RefCell` double-borrow panic; if a separate thread-local held across → aliasing. A pooled buffer must be dropped/released before the core call, and must be disjoint from `assigned_ns`.

**INV-F — assigned_ns independence.** The core recomputes `assigned_ns` itself (`mod.rs:186-197`); the `revise_impl` singletons Vec is a SEPARATE structure with a DIFFERENT scope (it prunes across the whole scope including assigned peers; `assigned_ns` feeds Phase-1 GAC pruning at :377-390). A pool must keep them disjoint — conflating them changes GAC pruning strength.

---

## 3. Fresh evidence: NONE of these is covered today

| Invariant | Existing coverage | Gap |
|---|---|---|
| INV-A (scratch reset, cross-universe) | indirect only, via full solves that re-enter the core | no test forces stale-map reuse across a value-universe SHRINK on one thread |
| INV-B (all_vals dedup) | `gac_ab_corpus` 0/112 (sudoku scale) catches gross unsoundness | not targeted; no non-square-uniform universe |
| INV-C (generic bound) | **NONE** — the only `Csp<FiniteDomain<String>>` test (`solver.rs:277-313`) uses `NotEqual`, never `AllDifferent` → `propagate_gac_core::<FiniteDomain<String>>` is **never monomorphized** in the whole suite | a Hash/Ord bound would compile clean here and only break bbnf downstream |
| INV-G (cache value round-trip / warm==cold) | **NONE** — `gac_ab_corpus` toggles `GAC_IN_ALLDIFF_ENABLED` (GAC fully on/off, `gac_ab_corpus.rs:171`), never `gac_id` Some-vs-None with GAC machinery ON both ways | no cold-cache vs warm-cache differential exists anywhere |
| INV-3 (Régin soundness under any cache) | implied by solve success | not asserted as a differential |
| INV-D (snapshot equivalence) | `solution_set_invariance.rs` catches only DROPPED/ADDED solutions | blind to a sound fuse that prunes more → node-count/trajectory drift uncaught |
| INV-E (borrow safety) | sudoku suite runs 27 AllDifferents → would panic if borrow held | adequate as-is, but must stay green under the pool |
| INV-F (assigned_ns disjoint) | none targeted | none |

**Direct greps:** no test file references `propagate_gac_core`, `next_gac_id`, or `GacScratch` (0 hits across `csp-solver/tests`). `solution_set_invariance.rs` enumerates all pruning×ordering combos and asserts set-equality — a strong SOUNDNESS net (catches INV-A/INV-B/INV-G when they corrupt hard enough to drop a solution on the tested shapes) but it (a) uses only `BitsetDomain`, (b) rebuilds each CSP fresh so never exercises cross-call scratch reuse on a shrinking universe, (c) is blind to node-count-only drift. The current W3 gate ("criterion no-regression · malloc down from 86% · `gac_ab_corpus` 0/112 both modes") measures TIME, ALLOCATIONS, and GAC-on/off correctness — **not one of the warm-start/scratch invariants above.**

---

## 4. The EXACT W3 gate predicates (runnable)

Each is a new `#[test]` (or CI step). They need a `#[cfg(test)]` or `pub(crate)` re-export of `propagate_gac_core` so cold (`None`) and warm (`Some(id)`) can be driven on identical inputs — a one-line test-visibility change, itself part of the beat's diff.

- **P1 — warm==cold pruning parity (INV-3, INV-G, INV-A, INV-B).** For a battery of `AllDifferent` and `AllDifferentExcept` states across live counts {3,4,9,16} and varied universes, clone the variables and call `propagate_gac_core(scope, sentinel, &mut a, d, Some(id))` vs `…(scope, sentinel, &mut b, d, None)`; `assert_eq!(a.domains, b.domains)` and `assert_eq!(rev_a, rev_b)`. Then a **multi-call** variant: replay a search path (progressively shrink domains) on one `id`, asserting warm domains == an independent cold recompute at EVERY step. Predicate: `∀ step: domains_warm == domains_cold`.

- **P2 — cross-value-universe scratch reset, one thread, one V (INV-A).** On a single thread: run the core on constraint A over universe {1..=16}, then constraint B (fresh `gac_id`) over {100..=108}, then A again over a SHRUNK {1..=6}. Assert each result equals a recompute performed on a FRESH thread (fresh thread-local `SCRATCH`). Must stay same `V` (u32) — a value-type switch resets the whole slot (`mod.rs:142-143`) and would mask a stale-map bug. Predicate: `assert_eq!(same_thread_result, fresh_thread_result)` for all three calls.

- **P3 — generic non-integer instantiation (INV-C).** New test: `Csp<FiniteDomain<String>>`, 4 vars over ≥3 colors, `add_all_different` (forces `live ≥ GAC_MIN_PARTICIPANTS`), `solve` enumerate; assert the exact solution set. This MONOMORPHIZES `propagate_gac_core::<FiniteDomain<String>>` so any added `Hash`/`Ord`/`ValueIndex` bound is a COMPILE error caught in-crate. Plus a hard gate: `sync-csp-solver-vendor.sh --verify` green (AllDifferent Constraint-impl bound unchanged — Residual #3, now a W3 blocker not a note).

- **P4 — singleton-removal snapshot equivalence (INV-D, INV-E, INV-F).** Assert post-beat `revise_impl` domains + `Revision` are byte-identical to the pre-beat snapshot on: (a) two vars singleton on the same value → `Unsatisfiable`; (b) a peer that becomes singleton after the first prune (the snapshot/live divergence case); (c) `live < 3` so GAC is skipped and the singleton pass is the only propagation; (d) the `all_different_except.rs` <4 twin path. Predicate: `assert_eq!(domains_beat, domains_snapshot) && assert_eq!(rev_beat, rev_snapshot)`. A fuse-live implementation FAILS (b)/(c) — this is the tripwire that pins the beat to snapshot-faithful pool.

- **P5 — node/backtrack freeze (INV-D at integration scale).** Freeze exact counts from the verify-26 profile and assert unchanged post-beat: assign n=10 → 506 nodes / 515 bt; n=15 → 4016 / 4043; n=20 → 1_000_000 / 1_000_019; plus escargot, sudoku16, queens8-enumerate (=92 solutions). A correct pool + correct value→index scratch changes ONLY wall-time; ANY node-count delta means propagation strength moved → block. Predicate: `assert_eq!(stats.nodes, FROZEN)`.

- **P6 — re-entrancy under the pool (INV-E).** Full sudoku + futoshiki suites green with the pooled buffer live (27 concurrent AllDifferents per sudoku board exercise the borrow path); no `RefCell` panic. Predicate: existing suites pass.

---

## 5. WAVE-SPEC AMENDMENT

Amend **T2-W3** (synthesis §2). Two edits — the beat spec and the gate line.

**(a) Beat spec — replace the L26-kernel-beats bullet's two kernel items with pinned-safe variants:**

> - **GAC adjacency value→index scratch** (`gac/mod.rs:236,239`): integer-indexed reverse-map fast path ONLY; the generic `PartialEq`-only fallback (`position`/`contains` scan) MUST be retained for non-integer `D::Value` — no `Hash`/`Ord`/`ValueIndex` bound may be added to `propagate_gac_core` or `AllDifferent`'s `Constraint` impl (`mod.rs:160-162`). The new scratch buffer joins the per-call reset discipline (cleared/generation-stamped, never leaked across calls). It may serve the warm-cache read at `mod.rs:271` only when built over the current call's `all_vals`.
> - **Singletons buffer: POOL, not fuse-live** (`all_different.rs:55` + the `all_different_except.rs` <4 twin): reuse a thread-local scratch `Vec` preserving the existing snapshot-then-prune semantics EXACTLY (byte-identical domains). The buffer must be released before the `propagate_gac_core` call (no `RefCell` re-entrancy) and kept disjoint from `assigned_ns`. A fuse-live rewrite is admissible ONLY if it passes P4/P5 unchanged; otherwise it is a behavioral change that re-bases the ledger's node counts and is out of W3 scope.
> - Unchanged: the `HashMap<gac_id,…>` warm cache keying and `CACHE_CAP` stay as-is (Vec-indexed cache + CSR adjacency remain DEFER per D20).

**(b) Gate line — append to T2-W3 "Gates:" (after "`gac_ab_corpus` 0/112 both modes"):**

> · **GAC warm/scratch invariant battery green: P1 warm(`Some`)==cold(`None`) pruning parity incl. multi-call universe-shrink · P2 cross-value-universe scratch reset (same-thread==fresh-thread) · P3 `Csp<FiniteDomain<String>>` + `add_all_different` monomorphizes & solves (generic bound unbroken) AND `sync-csp-solver-vendor.sh --verify` green · P4 singleton-removal snapshot equivalence (incl. the AllDifferentExcept <4 twin, live<3, and same-value-collision UNSAT) · P5 node/backtrack counts frozen at the verify-26 values (assign 506/515·4016/4043·1e6/1e6+19, queens8=92) · P6 sudoku+futoshiki suites green under the pool (no `RefCell` panic).** Requires a `#[cfg(test)]`/`pub(crate)` re-export of `propagate_gac_core` (part of the beat diff).

**(c) Residual promotion:** synthesis Residual #3 (bbnf vendored-copy sync-gate) is upgraded from "a W3 precondition" to a **hard gate item inside P3** — the generic-bound narrowing is the exact mechanism by which the adjacency scratch would break bbnf, so the sync-verify must run AFTER the beat lands, not only before the excision.

---

## 6. Bottom line

Both beats CAN regress the named invariants: the adjacency scratch endangers INV-A (stale-map leakage → silent mis-prune), INV-C (a Hash/Ord bound silently narrows AllDifferent and breaks bbnf), and INV-G (mis-served warm read → invisible perf loss); the singletons beat endangers INV-D (fuse-live prunes more → node-count/trajectory drift) and INV-E (pool re-entrancy panic). The existing suite — `solution_set_invariance` + `gac_ab_corpus` 0/112 + criterion + malloc-attribution — is a soundness/perf net but asserts NONE of these six as a targeted predicate; in particular the generic-bound path and the cold-vs-warm-cache differential have **zero** coverage today. The amendment adds P1–P6 and pins each beat to its safe variant. **Amendment REQUIRED — does not hold as authored** (the W3 gate line is under-specified for these beats).

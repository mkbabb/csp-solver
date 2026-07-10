# T2-W3 — Kernel + test hygiene

**R4 GO: the substrate island goes at 0.3.0, the inline tests migrate, the benches get honest, and the three L26 hot-path beats land pinned to their safe variants.** Q6 rewrote the substrate/bbnf bullet (semver label holds; the precondition prose didn't); Q9 proved both kernel beats CAN silently regress GAC invariants no existing test asserts—its P1–P6 predicate battery is now the gate.

**Dependencies**: ← W1. **Effort**: L.

---

## Scope

### Inline-test migration (owner constraint 3)

Exactly as verify-08 compiled it: `error.rs` (2-pass) + `puzzles/sudoku/generate.rs` (7→10 tests), R13 debug/release behavior preserved. Zero-widening—revokes W13's two-discipline statement.

### Substrate excision → csp-solver 0.3.0 (Q6-amended, verbatim)

Breaking pub-API removal from tagged `v0.2.0`; the minor bump is load-bearing—it protects the crates.io `morph` `csp-solver = "0.2"` consumer (a `0.2.1` would violate the `^0.2` compat range). Remove:

- `restart.rs` + `heuristic.rs` + `nogoods.rs` (335 LOC) with their three `solver/mod.rs` `pub mod` lines; `Ordering::Chs` (`ordering.rs:22`); `SolveConfig.restarts` (`config.rs:71` + its `Default` line);
- the **`SoftConstraint` island—5 parts, not one trait**: the trait (`traits.rs:218`) + its `constraint/mod.rs:19` re-export + `SoftLambdaConstraint`/`constraint/soft.rs` (whole file) + `mod.rs:18` re-export + `ConstraintEnum::Soft` (`dispatch.rs:24`) + `Csp::add_soft_constraint` (`csp/mod.rs:56`)—**keep `OptimizationMode`/`CostDomain`/`DomainCostEval`** (bbnf's live `MinimizeCost` path);
- `variable.rs` `clear_log`/`reset_to`; `ordering.rs` doc-links.
- Trim (don't delete) `csp-solver/tests/optimize.rs`—drop the SoftConstraint cases, keep the CostDomain cases; delete `tests/nogoods.rs`, `tests/restart_nogood_soundness.rs`. CHANGELOG `0.3.0` entry + version bump.

**bbnf vendored-copy sync — LOCAL-ONLY (bbnf-lang stays never-push), run AFTER the csc411 excision commits, not before** (the "check first" sequencing was inverted—there's no `0.3.0` rev to vendor until it exists). `cd ~/Programming/bbnf-lang && ./scripts/sync-csp-solver-vendor.sh --update <0.3.0-rev>` then `--verify`. Expect the field-set tripwire to **WARN** (not fail) on `restarts`—the sole downstream literal (`skinny/.../decision_csp.rs:85`) already spreads `..Default::default()` and absorbs cleanly; then **delete the `restarts` line from `scripts/.csp-solver-fields.baseline`** to re-green future runs. Note the gate's known blind spot: `--update`'s `rsync --existing` + lattice-only test compile never cover the other vendored test targets, which are ALREADY rotted at bbnf HEAD (`tests/local_search.rs`, `tests/gac.rs` fail against 0.2.0 excisions)—prune the newly-orphaned `tests/nogoods.rs` (and, opportunistically, those two) in the re-vendor commit. The coupling axis is SHA-pin + byte-diff + field-set, NOT semver—the `0.3.0` label is for morph, invisible to bbnf.

### Bench hygiene

- Excise `fc_chrono` (panics at `sudoku.rs:161`, reproduced live).
- Add a sweep-path lattice bench variant (drop `finalize()`—today's lattice benches exercise AC-3, not BBNF's actual sweep path).
- Criterion `--save-baseline` discipline (the phantom −17% self-baseline pathology reproduced).
- **iai-callgrind CI lane — ADOPT, P6 cleared**: deterministic instruction counts across 3 separate ephemeral runners (1,585,722 / 0.000000% delta, re-derived from raw GitHub job logs). Seed: [`../evidence/pass2/P6.diff`](../evidence/pass2/P6.diff) / branch `spike/iai-callgrind` @ `ff5d9de3`. Budget note (verify-P5-P7 correction): ~2 m cache-cold, **~40 s cache-warm**—cite the right figure per context. Keep `CARGO_TERM_COLOR` off in the parse path (the run-1/2 ANSI bug).

### L26 kernel beats — pinned safe (Q9)

- **GAC adjacency value→index scratch** (`gac/mod.rs:236,239`): integer-indexed reverse-map fast path ONLY; the generic `PartialEq`-only fallback (`position`/`contains` scan) MUST be retained for non-integer `D::Value`—no `Hash`/`Ord`/`ValueIndex` bound may be added to `propagate_gac_core` or `AllDifferent`'s `Constraint` impl (`mod.rs:160-162`). The new scratch buffer joins the per-call reset discipline (cleared or generation-stamped, never leaked across calls); it may serve the warm-cache read at `mod.rs:271` only when built over the CURRENT call's `all_vals`.
- **Singletons buffer: POOL, not fuse-live** (`all_different.rs:55` + the `all_different_except.rs:112-119` <4 twin): reuse a thread-local scratch `Vec` preserving snapshot-then-prune semantics EXACTLY (byte-identical domains). Release the buffer before the `propagate_gac_core` call (no `RefCell` re-entrancy); keep it disjoint from `assigned_ns`. A fuse-live rewrite is admissible ONLY if it passes P4/P5 unchanged—otherwise it re-bases the ledger's node counts and is out of W3 scope. (This beat is quantified: the singletons `Vec` is 86% / 75% / ~55% of malloc on gen_holedig / sudoku16 / futoshiki7.)
- **Assignment Hungarian dispatch** for group-free/pin-free (the `hungarian` crate is the linked bench floor; µs vs the 3.4–7.5 s budget-blown B&B at n=20; proven-optimal ceiling ~15–18) + the doc-ceiling fix at `assignment.rs:14` + surface `budget_exceeded` louder.
- **Unchanged, DEFER stands (D20)**: the `HashMap<gac_id,…>` warm-cache keying + `CACHE_CAP`, CSR/flat-arena adjacency, Vec-indexed cache, mimalloc, GAC on/off policy. Any diff altering cache keying is out of scope—reject it.

## Gates

| Gate | Value |
|---|---|
| Suite | full `cargo test --workspace` green (count grows with the migration); feature-sweep clean post-excision |
| Criterion | no-regression vs saved baseline |
| Malloc | gen_holedig singletons attribution demonstrably down from 86% |
| Assignment | n=20 proven-optimal via the LAP path (no budget blow) |
| Corpus | `gac_ab_corpus` **0/112 both modes** |
| **Q9 invariant battery** | **P1** warm(`Some`)==cold(`None`) pruning parity incl. multi-call universe-shrink · **P2** cross-value-universe scratch reset (same-thread == fresh-thread) · **P3** `Csp<FiniteDomain<String>>` + `add_all_different` monomorphizes & solves (generic bound unbroken) AND `sync-csp-solver-vendor.sh --verify` green **after the beats land** (Residual-3 promoted to a hard gate—the bound narrowing is exactly how the scratch would break bbnf) · **P4** singleton-removal snapshot equivalence (incl. the AllDifferentExcept <4 twin, live<3, same-value-collision UNSAT) · **P5** node/backtrack counts FROZEN at the verify-26 values (assign n=10 506/515 · n=15 4016/4043 · n=20 1,000,000/1,000,019 · queens8 enumerate = 92) · **P6** sudoku+futoshiki suites green under the pool (no `RefCell` panic). Requires a `#[cfg(test)]`/`pub(crate)` re-export of `propagate_gac_core`—part of the beat diff |

## Seeds

- [`../evidence/pass3/Q6-substrate-semver.md`](../evidence/pass3/Q6-substrate-semver.md) — the excision + sync spec (ran the tripwires against a scratch-excised tree).
- [`../evidence/pass3/Q9-kernel-beat-risk.md`](../evidence/pass3/Q9-kernel-beat-risk.md) — the invariants + runnable predicates.
- [`../evidence/pass2/P6.md`](../evidence/pass2/P6.md) + `P6.diff` — the iai lane.
- [`../evidence/synthesis-pass1.md`](../evidence/synthesis-pass1.md) D6/D7/D8/D20 (verify-08/-06/-10/-26 chains; the L26 profile: 35,650 samples, cliff deterministic, node counts exact).

## Residual risks

- The invariant battery has zero pre-existing coverage to lean on (Q9 §3: no test references `propagate_gac_core`, `GacScratch`, or a warm-vs-cold differential today)—the predicates are new code and themselves need review.
- bbnf's vendored-test rot predates this wave; pruning it is opportunistic, not owed—don't let it grow the re-vendor commit unbounded.
- Wall-time gains are regimes, not SLAs; the criterion baseline is the arbiter, saved same-box.

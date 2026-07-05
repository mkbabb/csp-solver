# W2 — GAC + search control

**Confirms the propagation-strength decisions on the landed tree and settles the search-control posture.** Mostly verification + small edits—the heavy content landed inside W1's composed tree.

**Dependencies**: ← W1. **Effort**: S–M (1–2 days).

---

## Scope (file-level)

### GAC default-ON, confirmed with the minority cost disclosed

- Keep GAC wired into `AllDifferent` (`constraint/all_different.rs` → `solver/gac/mod.rs::propagate_gac_core`, warm-started per-constraint matching cache), **default ON**, `GAC_MIN_PARTICIPANTS = 3`—thresholds 2–6 are within ~7% of each other, 9 is 1.79× worse; every N-keyed gate is ≤ blanket ON ([`synthesis-pass3.md`](../evidence/synthesis-pass3.md) §1 #2).
- **Document the minority cost, never bury it**: 3/5 named hard 9×9 boards are reproducibly 1.3–2.5× slower ON (Al Escargot 0.50×, Golden Nugget 0.79×, Inkala 0.40× speedup ratios), dominated by N=4's up-to-112× wins—13.36× corpus aggregate (14.2–14.6× across reruns), nodes 41,807 → 5,948 (`pass3/gac-default-on.md`).
- The GAC causal story for docs (W13): the headline lever was the `AcFc→Ac3` builder wiring (~2,670×), not incrementalization (1.2–1.6×)—Pass-2 D1 inverted Pass-1's narrative.

### Builder + morph-lazy composition

- `builder/assignment.rs:10` doc-comment fix: says `Pruning::AcFc`, code uses `Ac3` (`pass3/builder-ac3-x-morph-lazy.md` §6 note 5a).
- Confirm the morph-lazy `align/` decomposition composes on the landed tree—already adversarially verified: applies clean, 170/170, 6-property × 256-case proptest vs brute force green, the weak case `stress_n6` improves 1.5× → **8.3×** (ibid.). The decomposition itself lands via W11 phase 1 (it travels with the crate); this wave's job is the joint verification run.
- **Scope the selection claim correctly**: "bit-identical pair selection" holds *under a fixed builder pruning config*; tie-heavy symmetric-cost inputs select a different-but-verified-optimal permutation, caused by the Ac3 wiring alone (morph-lazy is tie-break-neutral, proven by same-host stash A/B).

### Search control: chs-driver explicitly deferred

- The restart/nogood **substrate** is landed (W1): blame signal, `NogoodStore` (sound in isolation, mutation-tested), `restart.rs` (Luby), `heuristic.rs` (CHS/ERWA). The **driver** (re-authoring restart orchestration onto `search.rs::search`) is distinct, optional, deferrable engineering—`SearchParams` currently drops `config.restarts` on the floor and `Chs ≡ DomWdeg` bit-for-bit ([`synthesis-pass3.md`](../evidence/synthesis-pass3.md) §1 #4). **Do NOT gate any other wave on it**; production (Ac3 + FailFirst/Mrv, `restarts:false`) is unaffected.
- If the driver ever lands it must: add `restarts`/`conflicts` to `SolveStats` (today a restart is unobservable); invert the 3 `witness_*` canaries onto a heavy-tailed instance; re-prove the no-dupes/no-losses/determinism gate; fix NogoodStore's LRU eviction (generation counter, not O(total-pairs) rebuild—Pass-2 GF-5).
- CHS stays opt-in, never the sudoku default (net-negative on 4/5 puzzles under the production config; Minimal17 +419%—Pass-2 D2).

### Pass-1 ledger items verified still open in the v2 tree (booked here)

- **R8 (FAIL-EXPLICIT)**: `AssignmentError` still has only `Infeasible` (verified: `builder/assignment.rs:113–137`)—budget exhaustion returns `Infeasible` at `:333`/`:417`. Prototype 2 cured the practical manifestation (n=12: 25 s Infeasible → 2–5 ms solve) but the typed `BudgetExceeded` variant never landed. Add it; EXCISE the ambiguity-blessing test. morph-core is unaffected (it `.expect()`s the Result—[`morph-excision-spec.md`](../evidence/morph-excision-spec.md) §2.2).
- **R1 (WIRE-or-EXCISE)**: `ConstraintEnum::Lambda` still has zero construction sites (verified—`add_greater_than` boxes through `Custom`). Decide here: EXCISE the dead variant (Pass-1 default), or WIRE `add_constraint` to devirtualize `LambdaConstraint` into it—which would also take Futoshiki's inequality clues off the boxed slow path (its F10 flag). Default EXCISE unless W10 profiling argues otherwise.
- **R10 (EXCISE)**: `tests/optimize.rs` still hand-rolls a duplicate `CostFiniteDomain` (verified: `:14`)—use the production type.

### Solver excisions (decided in Pass 1/2, still unexecuted in the composed tree—measured by [`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §2.3)

- `solver/local_search.rs` (`min_conflicts`, 176 L): **EXCISE** + its tests—Pass-2 settled #26, "no principled slot"; a silent fallback is precept-banned.
- `constraint/cardinality.rs` (`CardinalityConstraint`, 134 L): **EXCISE** (Pass-1 R2, "re-add on real consumer"; still zero production constructors—not in the dispatch enum, `pub use` only).
- `solver/gac_alldiff.rs` + `gac_alldiff_except.rs`: **MOVE** to `solver/gac/{alldiff,alldiff_except}.rs` + add the one-line doc-comment "no production caller; kept as a differential-test oracle against `propagate_gac_core`'s incremental path, exercised from `tests/gac{,_alldiff_except}.rs`". Do not delete—live test coverage, defensible oracle rationale, currently undocumented ([`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §2.3; the oracle hypothesis is inferred, see risks).

## Acceptance gates

| Gate | Proven value | Evidence |
|---|---|---|
| GAC corpus aggregate | 13.4× reproduced within ~10% run noise (113 boards, exact production config) | `pass3/gac-default-on.md` |
| Builder proptest | 6 properties × 256 brute-force-checked cases green | `pass3/builder-ac3-x-morph-lazy.md` |
| `stress_n6` | ≥8× (measured 8.3×) | ibid. |
| Tier-2 morph corpus | 10–12× held (10.2×/12.0×/10.4×) | `pass2/morph-lazy-cost.md` |
| Post-excision | `cargo test --workspace` green; excised symbols grep to zero |  |
| Driver (only if landed) | witness canaries inverted on a heavy-tailed instance + enumerate-vs-brute-force under restarts green | `pass3/restart-nogood-soundness.md` |

## Seed artifacts

- GAC + corpus harness: [`../artifacts/gac_ab_corpus.rs`](../artifacts/gac_ab_corpus.rs) (threshold-sweep instrumentation stripped—re-add `GAC_MIN_PARTICIPANTS_OVERRIDE` only if re-tuning).
- morph-lazy content: `pass2/morph-lazy-cost.diff` re-verified by `pass3/builder-ac3-x-morph-lazy.md`—**apply clean on the composed base** (verified).
- Excisions/moves: re-derive (mechanical deletions + `git mv`).

## Residual risks

- The `gac_alldiff` differential-oracle hypothesis was inferred from doc-comments + call-graph shape, not confirmed by reading an actual differential assertion—if `tests/gac.rs` turns out to assert nothing against the incremental path, the honest verdict flips to S4-style EXCISE ([`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §5.2). Read the test before choosing move-vs-delete.
- Excising `local_search.rs`/`cardinality.rs` after the composed tree carried them means the parity baselines (built with them present) stay valid—they're dead code paths—but re-run the workspace suite and `time_sudoku` to prove it, not assert it.

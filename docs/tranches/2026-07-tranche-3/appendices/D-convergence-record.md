# Appendix D — Convergence record: 64 → 72/83 → 91

Convergence = the fraction of the plan settled on evidence rather than assertion; a refuted claim counts *against* until replaced with a verified posture. This tranche ran the owner's 5-step loop across five phases; each closed with a floored number, and the arc — **pass-1 64 → audit-32 72 → pass-2 83 → owner ballot → pass-3 91** — is the record of the loop converging on author-ready. Sources: `pass1/pass1-agglomeration.md` §4, `audit32/synthesis-path-forward.md` §4, `pass2/pass2-agglomeration.md` §4, the **owner ballot 2026-07-10**, `pass3/reconciliation.md` §3.

**The method, constant across passes:** **wave-effort weighting, not item count.** Each critiqued artifact (or wave) is weighted by the authoring effort of the wave rows it gates, in wave-effort units (S ≤ ½-day, M = wave-day, L = multi-day). The weighted mean is floored, never rounded up — "a hollow round-up poisons the tranche" (pass-1 §4). The number measures *authoring-readiness*, not implementation completeness: the waves aren't executed, they're specified.

---

## Phase 1 — Pass 1, the encapsulation loop → **64%**

21 lanes (8 research + 6 prototypes + 7 critiques) + synthesis + agglomeration, scoped to Mandate I (py/isomorphic/structure). Seven critiqued artifacts weighted over 16 units:

| Artifact | Weight | Conv. |
|---|---|---|
| crit-spec-coherence (W-A + W-D non-stub + W-F non-P6 + W-G) | 5.5 | 60 |
| P1 isomorphic-excision half | 1.5 | 77 |
| P2 py-dead-surface half (adj. 62) | 1.5 | 62 |
| P3 py-stub row | 1.0 | 70 |
| P4 FE sudoku-game extraction | 3.0 | 74 |
| P5 pub-surface sweep | 3.0 | 60 |
| P6 index.css partials | 0.5 | 52 |

**1036.5 / 16.0 = 64.8 → 64%** (floored). The macro-shape was settled and author-ready; the gap to 100 concentrated in owner gates (R2/R7/R8/R10), two unexamined technical forks (stub gen-vs-hand, abi3), the un-prototyped W-F rows, and in-wave re-runs pass-1 could only *simulate* (the bbnf combined-diff gate, the npm tarball).

## Phase 2 — Audit-32 synthesis → **72%**

32 read-only lanes (perf, library, UI, structure, design F1–F8, deferred/chronic, doc-truth, A24 completeness) + synthesis. This was a **floored narrative read, not a re-weighted table** — the decision set was fully dispositioned (every audited row homed, the macro-shape internally consistent), but three classes held it below author-ready:

- The **owner memo (W1)** carried eleven ungated-by-evidence calls — until answered, W3's futoshiki row, W4's Timeout row, W7's Q7/Q9 rows, and W9's star form were placeholders.
- The **pass-1 gaps stood** — the combined-diff bbnf gate and npm tarball simulated-not-run; the god-composable rows un-prototyped; stub-gen and abi3 unspiked.
- The **A24 gaps were real** — no morph census (gating three rows), no baseline suite run, no live felt-perf trace, no security probe, design rows on mixed evidence footing.

Pass-1's 64% sat on the encapsulation half; the synthesis added the design/perf/library/UI axes at *higher* evidence quality (A23 live-probed, A18 first-party-measured, A20 tree-verified) but also added the un-run W0-class verifications. **72%, floored.** Its output was the 13-wave skeleton + the 14 open questions that chartered pass-2.

## Phase 3 — Pass 2, prototype + adversarial critique → **83%**

8 prototype/verification lanes (P2-L1…L8) + 4 adversarial critiques (py/be/fe/coherence). Four clusters weighted over 16 units, with two agglomeration adjustments (both directional-honest): coherence 76→87 (C1 healed at the distillation layer, C4 folded into the ballot; C2/C3 stay deducted as open owner gates), be 87→82 (−5 symmetric pricing of the pending owner gates crit-be declined to count, parity with crit-py's −8):

| Cluster | Weight | Conv. |
|---|---|---|
| py (P2-L1/L2/L4) | 4.0 | 78 |
| be (P2-L7/L8, adj.) | 3.5 | 82 |
| fe (P2-L5/L6) | 5.0 | 85 |
| coherence (P2-L3 + corpus, adj.) | 3.5 | 87 |

**1328.5 / 16.0 = 83.03 → 83%** (floored). The 19-point advance over pass-1 is earned: every pass-1 technical residual executed and critique-survived, with **zero hard refutations across all four adversarial critiques** (the kill ledger K28–K41 records corrections, downgrades, and composition failures — not one prototype was refuted). The remaining 17 points were concentrated in exactly two shapes: the owner ballot (Q1–Q4) and in-wave re-runs at the merged HEAD. **No unexamined technical fork remained** — pass-2's charter for pass-3 was explicitly *fold-and-author, not investigate*.

## Phase 4 — The owner ballot (2026-07-10) → **4/4 at recommended**

The ballot was the designed resolution path for pass-2's two deducted clusters — the C2 shared-home contradiction and the C3 `PropagationStrategy` reclassification were genuine owner gates, not author-closable. Four questions, each answered at the recommended option:

- **Q1** — no PyPI, maximal prune (futoshiki_api REMOVED, `PropagationStrategy`/`propagate_with` removed, abi3 CI-only, stub `__all__`=15 as built).
- **Q2** — core **0.4.0** ratified (12+2+1, `propagate_stratified` removed with a backlog item, `Timeout` RESERVED, stamps advance together).
- **Q3** — the **three-home rule** (`games/shared/` + undo/marks relocation + the eslint tripwire).
- **Q4** — index.css **DROP, HELD-again** (byte-identity proof banked).

The ballot **IS** the output of T3-W1 — delivered before authoring, retiring the wave from the DAG. It closed the coherence C2/C3 deductions, crit-py's R2 −8, and crit-be's symmetric −5; its consequences were folded everywhere by the reconciliation (R-1). See [README §2](../README.md#2-the-ballot-ledger--q1q4-owner-2026-07-10-all-at-recommended) for the verbatim ledger.

## Phase 5 — Pass 3, the gap-lanes + the grand reconciliation → **91%, author-ready**

6 gap-lanes (G3 pencil-boil pin, G5 morph census, G6 baseline, G7 felt-perf, G8 security, G10 design re-probe) + the reconciliation. The five A24 gaps that held audit-32 below author-ready all executed: G5 clean (two independent walls, three rows unblocked), G6 observed-green + SHA-stamped, G7 measured (99–103 ms @4×, the one >100 ms gesture), G8 passed-with-one-LOW, G10 live-verified (with F4-M4 killed, K43). Per-wave weighting over the 12-wave DAG:

| Wave | Weight | Conv. | Weighted |
|---|---|---|---|
| W0 | 1.0 | 90 | 90 |
| W2 | 1.5 | 96 | 144 |
| W3 | 2.0 | 95 | 190 |
| W4 | 2.5 | 93 | 232.5 |
| W5 | 2.0 | 90 | 180 |
| W6 | 2.0 | 88 | 176 |
| W7 | 3.0 | 92 | 276 |
| W8 | 2.0 | 87 | 174 |
| W9 | 3.0 | 90 | 270 |
| W10 | 3.0 | 92 | 276 |
| W11 | 2.0 | 93 | 186 |
| WGATE | 1.0 | 95 | 95 |
| **Σ** | **25.0** | | **2289.5** |

**2289.5 / 25.0 = 91.58 → 91%** (floored). The 8-point advance over pass-2 is earned by the ballot (all four questions answered) and by the five gap-lanes executing.

## Author-ready — the semantics

**91% is author-ready, per a stated criterion**, not a round number chased. Every remaining sub-100 row is one of exactly two shapes:

1. **A gate the owning wave itself runs** — re-runs at merged HEAD (RES-2/RES-4: bbnf `--update && --verify`, wasm byte re-measure, the merge bar), quiet-box measurements (W5 assignment A/B, W6 before/after under R-12 discipline), the dist-preview trace (W8's `probe-felt.mjs`), the RES-5 memo edit (WGATE).
2. **A corpus-lean default that executes in-wave with a named owner-veto window** at that wave's gate — the [three non-blocking defaults](../README.md#4-non-blocking-defaults-register): F2 star form (inline glyph, veto W9), UI-13 pedagogy (keep+hint, veto W11), mod.rs self-named flip (post-tranche, veto WGATE).

**Not 100 because** (the honest residue): the integers are worktree/load-local until the waves re-run them; W6/W8's headline numbers don't exist until measured under discipline; and three defaults carry veto windows rather than signatures. **None of these can be closed by another investigation pass** — only by authoring and executing the waves. That is what author-ready means here: **the loop has nothing left to investigate.**

**Zero deferrals minted.** The KISS ledger is closed and unified ([appendix A §10](A-decisions-and-kills.md)); every deferred and chronic item lands, closes, or excludes ([appendix C](C-deferred-disposition.md)); every owner ask is homed ([appendix B](B-prompt-recap.md)). WGATE writes the closing execution-earned number, as tranche-2 did (98.2% at `c14995eb`).

---

*The loop converged. Five phases, each floored on evidence: 64 (the encapsulation half), 72 (the full audited shape), 83 (prototype-proven, zero hard refutations), the ballot (four answers), 91 (the gap-lanes executed). The gap to 100 is exactly what only authoring and execution can earn — merged-HEAD integers, quiet-box measurements, and three veto windows the owner exercises at a gate. The investigation phase closes here; authoring begins.*

---

## Execution record {#execution-record}

Authoring closed at 91%; the tranche then **executed in full**. Thirteen wave slots: **twelve code waves landed** (T3-W0, W2–W12), **T3-W1 was discharged by the owner ballot** (2026-07-10, before authoring — the numbering keeps the gap), and **T3-WGATE** (this record) closes the ledger. The gate SHA is `b4d7aedf` (T3-W12). Each wave landed as one commit + CI-green, with a `fixup` where a gate missed `fmt --check` (§ the execution-lessons ledger, [appendix A §11.3](A-decisions-and-kills.md)).

### The twelve waves landed

| Wave | Scope (one line) | SHA | Fixup |
|---|---|---|---|
| **W0** | anchor — execution base `0c044ef6` stamped, docs-only delta from the G6 baseline | `9e101fd5` | — |
| **W2** | packaging + doc truth — the retired triplet retruthed, interim 0.3.0 stamp, `_headers` append fix | `f6f28420` | `ab828d6f` (clean `target/wheels` before maturin) |
| **W3** | dead surface — isomorphic excised, py pruned to the ballot's 15 names, 0.4.0 opens | `d78fef8e` | — |
| **W4** | core structure — the 12+2+1 sweep seals 0.4.0, the scratch seam splits, **tests-py reads 27/0** | `044f2526` | `1d55c6dc` (rustfmt import-rewrite drift) |
| **W5** | library — the last 2020 stack dies, the wheel gets its typed skin, knip stands guard | `b8af49d2` | `5c736f4c` (rustfmt `kuhn_munkres.rs`) |
| **W6** | engine perf — flat CSR, the Vec-indexed cache, a spine that guards itself (lean → 86,746 B) | `02965a56` | — |
| **W7** | FE structure — `App.vue` becomes a shell, the three-home rule lands, the suite hardens | `d0565631` | — |
| **W8** | FE perf — marks burst tamed, the cold chain warmed, the chunk husk dies | `ed439104` | — |
| **W9** | the gold move — gold is earned light, and only a finished page can pull it down | `08f3ddd9` | — |
| **W10** | design — the page turns, the frame registers, the toggle stays itself (as dispositioned) | `165878f7` | — |
| **W11** | UI completeness + security — the app speaks to touch, and the wire tells the truth | `7c967416` | `53398825` (pin digit-pad spec to chromium) |
| **W12** | owner-audit addendum — the grade moves into the margin, the page goes quiet, the drawer arrives | `b4d7aedf` | authored doc `58406465` |

**DAG honored:** `W0 → W2 → W3 → W4 → {W5, W6}` · `W2 → W7 → W8` · `W7 → W9 → W10 → [W10 disposition] → W11 → W12 → WGATE`. T9's W3→W4 binding held (the two `-D warnings`-forced removals rode W4's commit). W11-before-W12 held (the drawer re-homes the card W11 labels).

### The W10 disposition — the owner overruled mid-wave

The owner audited the **live tree at `:3001` on 2026-07-11 — W10's lanes actively writing** — and returned six verdicts (README §3a, shots at `evidence/owner-audit-2/`). **Owner verdicts overrule wave content.** W10's uncommitted deliverables were dispositioned one-by-one against that tree *before* W11/W12 ran:

- **S2 spiral color — REVERTED verbatim** (`pencilConfig.ts` `#DF9A1E` → `#F0B030`): the owner named it, and the measurement agreed — S2 had *lowered* its own stated contrast metric (1.175 → 1.063 vs the disc); the yellow-on-orange hue pop was the charm.
- **F5 Set-and-Rise — CUT then RE-CUT** in W12 as the ~950 ms before-shaped whirl (squash / star-pop / dusk-ease salvaged into it): the staged phase machine went empty mid-gesture, the deferred flip read as lag.
- The rest (F6 page-turn, celestial rewire, F1 registration *goal*, F4 draftsmanship rows, PRM contract) **KEPT** — uncritiqued or the registration win the owner's own F1 finding demanded.

The full register (KEEP / REVERT / RE-CUT, 17 rows) is durably homed in [README §3a](../README.md#3a-addendum-2026-07-11--the-owner-live-audit--the-w10-disposition-register). The board's top-left barb was attributed **PRE-EXISTING, committed** (byte-identical at `08f3ddd9`) — W10 innocent.

### The W12 addendum loop — a sixth convergence pass

The audit spawned a scoped loop off the main five-phase arc: **4 forensic/design lanes (a1 completion+perf, a2 boil/outline, a3 toggle+spiral, a4 artifact) + 2 adversarial critiques (crit-design 61%, crit-forensics 94%)**, both kill-lists folded into the answering wave. Two mandated lanes (a5 drawer, a6 attribution) were not produced — a6's table was diff-reconstructed by crit-forensics and adopted interim; a5's drawer spec was authored in the wave file against crit-design's recorded hazards. The wave's eight rows, effort-implicit-equal:

| Row | Convergence |
|---|---|
| completion re-formulation (R1, rung-corrected) | 92 |
| solved-page perf rows | 92 |
| boil / outline fix | 98 |
| toggle re-cut | 90 |
| spiral revert | 100 |
| corner artifact | 98 |
| **the drawer** (spec-first, zero lane prototype) | 65 |
| attribution register (a6 interim) | 88 |

**Σ 723 / 8 = 90.375 → 90%** (floored). The drawer at 65 is the honest drag — the one owner feature authored without a live lane; its ~480 ms / 17 rem / scale-1.05 numbers were earned at the wave's own live gate, not before.

### The final counts — re-stamped at the gate SHA `b4d7aedf`

| Suite | G6 authoring base `3b75eca2` | Gate `b4d7aedf` | Delta |
|---|---|---|---|
| Rust `cargo test --workspace` | 151 / 0 / 6 across 18 harnesses | **171 / 0 / 6 across 21 harnesses** | +20 pass, +3 harnesses (`gac_alldiff_oracle`, `futoshiki_engine_probe`, `ImplicationConstraint`) |
| tests-py (installed wheel) | 27 / 2 | **27 / 0** | −2 skips (the Timeout-gated tests deleted at W4, R-3) |
| e2e (Playwright) | 33 in 5 files | **43 in 8 files** | +10 (digit-pad, drawer, throttled-void) |
| lean wasm (`pkg/` == `dist/`) | 90,602 B | **86,746 B** | −3,856 B (W6 engine-perf trim) |

Zero failures at the gate; the lean artifact holds under the `fail>93,000` budget with ~6.3 KB headroom (up from ~2.4 KB). The G6 set stays the *authoring-base* citation (the "13" for the count-blacklist analogy: it is the anchor, not the current claim — K45); these integers are the *gate* stamp.

---

*Authoring floored at 91; execution ran the waves and floored again. Twelve code waves landed clean, one ballot discharged a wave before it was written, and one live audit mid-flight bent W10 into its dispositioned shape and spun a sixth convergence pass that closed at 90 — the drawer the honest drag, earned at its own gate. The counts moved the way real work moves them: twenty more Rust tests, two skips retired, ten more e2e, four kilobytes lighter. Every retruthed number traces to a wave artifact or a quoted command; every deferred item lands, closes, excludes, or files as a scoped backlog row with an owner and a trigger; the security surface was probed and passed; the three owner reminders are carried, not left open. As tranche-II closed at 98.2% at `c14995eb`, tranche-III closes here — the ledger auditable, the loop with nothing left to investigate and nothing left to build.*

# Appendix D — Convergence record

Convergence = how much of the plan is settled on evidence rather than assertion; refuted claims count *against* until replaced with a verified posture. Calibration inherits the tranche-1 arc (72 → 90 → 91 → 95): this campaign's synthesis opened far above tranche-1's Pass-1 because it sat on a completed adversarial critique layer and all nine ratifications pre-landed.

## Pass 1 — 33-lane audit (no number assigned)

`pass1/01..33` (session-scoped). 25 in-scope lanes + 8 supplements (26–33) covering profiling, wasm perf, FE runtime, SOTA, benchmark truth, security, tooling, hardening. No convergence stated—by design, the critique layer prices it.

## Pass-1 critique — 40 lanes → READY-CONDITIONAL

`verify-01..25` + 7 meta-lanes + `verify-26..33` ([`../evidence/32-synthesis-readiness.md`](../evidence/32-synthesis-readiness.md)):

- **Grades**: 15× A/A− (01, 04, 05, 06, 07, 08, 10, 13, 14, 15, 17, 18, 19, 20, 22) · 9× B-class (02, 03, 09, 11 B+, 12, 16, 21, 23, 25) · **1× C (24-wave-drift** — quote-only-with-reverification). Meta: forensics A · drift-map B+ · contradictions B · completeness B · reproducibility B (A− deterministic, C wall-clock). Supplements verify-26..33: **7 A / 1 B** (33), most numbers byte-exact.
- **Corpus trust grade B+**; not one Pass-1 lane's ultimate disposition fell to the critique—every refutation localized, several verdicts strengthened under correction.
- The owner's structural fears (wall-corrupted reports, HEAD-move contamination) investigated to ground: **did not materialize** (0 completion-suspect reports; no frontend-sensitive lane completed pre-move; deterministic numbers reproduced to the byte).

## Synthesis — 89%

[`../evidence/synthesis-pass1.md`](../evidence/synthesis-pass1.md) §4. 27 decisions: 23 ER · 2 PG · 2 RETIRED-BY-R1. The withheld 11, as decomposed there: ~4 the seven unrun prototypes · ~2 W2 execution risk · ~2 design/taste residue · ~2 un-re-driven measurements · ~1 environment-bound ms.

## Pass 2 — 7/7 prototypes built + measured

| P | Question | Gate result |
|---|---|---|
| P1 | sparse embed end-to-end | PASS — 81,963 B, 150/0/6 + 116/116 sweep |
| P2 | browser hole-dig gen cost | PASS — all six tiers p95 ≤ 50 ms |
| P3 | transition grain-hoist | PASS — −60%-class raster, soul intact |
| P4 | engine-domains pencil marks | PASS → BOOK (tranche III) |
| P5 | font subset bytes | PASS — 17,228 B total, CSP-tight build renders |
| P6 | iai-callgrind CI | PASS — deterministic counts, green lane |
| P7 | Vite 8/Rolldown | PASS — build + identical e2e set |

## Pass 3 — 13-lane adversarial critique

| Lane | Verdict (one line) |
|---|---|
| Q1 W2 manifest | ~85% complete as authored; **5 gaps closed** (dev.sh, tests-py pyproject, gate scope, doc-comment sweep, the ApiError compile-coupling) + the exact live-symbol map |
| Q2 N=5 blast radius | correctness-complete, completeness-incomplete — 6 unowned prose sites named; zero functional breakage; zero wasm delta |
| Q3 W1/W2 ordering | **no collision either direction** (live-rebuilt proof); rename rides W1 as authored |
| Q4 W5/W6 cache-vs-PWA | **no contradiction — they compose**; the one real gap is the woff2 glob; SW strategy written |
| Q5 P1 gate sufficiency | sweep sufficient for `parse_puzzle_field`; **one unnamed fourth reader** (`gac_ab_corpus`) added to W4's gates — empirically pre-cleared on the sparse bank |
| Q6 substrate semver | 0.3.0 label HOLDS; precondition prose rewritten (sequencing, coupling axis, the 5-part soft island, WARN semantics, vendored-test rot) |
| Q7 affordance interlocks | 4 findings, none fatal: resolver needs real branching; accretion generalizes to `?board=`; `start_url` clean; **the Mac `metaKey` gap** |
| Q8 hardening coherence | slate coherent-in-shape, inconsistent on 2 seams — both repaired (full-declaration H1, toast struck); owner line re-enumerated to 4 clauses |
| Q9 kernel-beat risk | **both beats CAN silently regress** — 6 invariants named, P1–P6 runnable predicates now the W3 gate; beats pinned to safe variants |
| Q10 W7 fold fidelity | zero orphaned facts; the W2-gate self-contradiction found + fixed (doc-reference sweep); 2 under-granular destinations widened |
| verify-P1-P2 | P1 **CONFIRMED** byte-exact ×2; P2 gate **CONFIRMED** ×8, device bound **SHAKY** → conservative split authored |
| verify-P3-P4 | P3 **CONFIRMED** (effect larger: −62/−56); P4 **AMENDED** — booking stands, spoiler finding strengthened (109/116), decisions coupled |
| verify-P5-P7 | P5/P6/P7 all **CONFIRMED** (independent rebuilds, raw CI logs, negative-control test) |

## This fold — 94%

**89 + 3.5 + 1.0 + 0.5 = 94**, recovered:

| Movement | Δ | Basis |
|---|---|---|
| Prototypes: all 7 run AND adversarially re-verified | **+3.5** of 4 | five CONFIRMED byte-exact-class; P2's unknown no longer shapes W4 (conservative split authored); P4 is tranche-III material. 0.5 withheld: the genuine-low-power-device run has never happened |
| W2 execution risk | **+1.0** of 2 | Q1's fresh-grep manifest closure, Q3's two-way ordering proof, Q10's gate fix. 1.0 withheld: no red-to-green worktree rehearsal (Q1 FAIL-EXPLICIT); box decommission spec-only |
| Design coherence | **+0.5** of 2 | Q8's slate repair + the correctly-enumerated owner line. 1.5 withheld: the line is outstanding (default executes) and the root-README register is taste-gated |
| Measurements | *(counted inside the rows above where re-driven)* | the transition trace re-driven 3× interleaved; e2e now a measured-at-HEAD figure; P4's spoiler re-derived natively over the full bank |

**The missing 6, enumerated** (all execution-earned, none author-closable):

1. **−1.5** W2 never rehearsed end-to-end + the owner-side box decommission is out-of-repo and unrehearsed.
2. **−1.0** the GAC 13.36×-class ratios rest on a deleted scratch harness until W-GATE commits the probe.
3. **−1.0** e2e: 12/14 measured at HEAD, but the 2 frame-line reds are diagnosed-not-fixed and futoshiki coverage is zero until W0 lands.
4. **−1.0** the one owner line (the four amended-slate clauses) + the W7 register sample review.
5. **−0.5** P2's low-power-device confirmation (gates only the aggressive N=3 branch).
6. **−1.0** environment-bound wall-clock: regimes/ratios only; every absolute-ms gate re-measures at execution time.

The remaining 6 points are post-implementation by construction—earned only by running the waves. W-GATE writes the closing number here.

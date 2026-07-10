# Tranche II — Grand Refinement, Pruning, SOTA Performance

**THE TRANCHE, second campaign.** The exact wave set to prune, modernize, and harden the post-uplift stack—server abrogation, kernel excisions + hot-path beats, data-bank reshape, FE hardening + affordances, docs fold. Authored from a four-pass, ~93-agent-beat campaign (33-lane audit → 40-lane critique → 7/7 prototypes → 13-lane adversarial Pass-3). Every claim carries an evidence pointer into [`evidence/`](evidence/); a reader with zero session context implements from here.

Repo baseline: `8913023e` (feat(pencil): the wordmark becomes the game selector). Predecessor: [`../2026-07-grand-uplift/`](../2026-07-grand-uplift/) (all 14 waves landed + released 2026-07-06). Development-only campaign—nothing here is implemented yet; the waves are the implementation order.

---

## 1. Provenance

| Pass | Shape | Output | Convergence |
|---|---|---|---|
| **1 — audit** | 33 read-only lanes: parity/perf/abrogation-blast, Rust/wasm/py modernity, examples/benches/data, UI/mobile/glass/FE-perf/pencil-boil, repo-org/docs/prompts/precepts/deferred, profiling/runtime/SOTA/security/tooling/hardening | `scratchpad …/tranche2/pass1/01..33` (session-scoped, see §6 caveat) | — |
| **1c — critique** | 40 lanes: `verify-01..25` adversarial re-verification + 7 meta-lanes (forensics, drift-map, contradictions, completeness, reproducibility, report-quality, readiness) + `verify-26..33` supplements (7 A / 1 B) | [`evidence/32-synthesis-readiness.md`](evidence/32-synthesis-readiness.md) — READY-CONDITIONAL; §5 corrections ledger; grades 15×A/A−, 9×B-class, 1×C | — |
| **— synthesis** | 27-decision set, T2-W0..W7+GATE skeleton, 7 prototypes, all nine ratifications resolved | [`evidence/synthesis-pass1.md`](evidence/synthesis-pass1.md) | **89%** |
| **2 — prototype** | 7/7 prototypes built + measured, worktree-isolated (sparse embed, wasm gen cost, grain-hoist, engine-domains marks, font subset, iai-CI, Vite 8) | [`evidence/pass2/`](evidence/pass2/) — P1..P7 reports + diffs + screenshots | — |
| **3 — critique fleet** | 13 lanes: the 10 dispatch questions (Q1–Q10) + 3 prototype re-verifiers (P1/P2, P3/P4, P5–P7); ELEVEN amendment sets folded into the waves below | [`evidence/pass3/`](evidence/pass3/) | — |
| **— this fold** | Amendments folded, gates re-derived from the corrected ledger, record authored | this directory | **94%** |

**Convergence arithmetic** (full record: [appendix D](appendices/D-convergence-record.md)). 89 → 94: the synthesis withheld 11 points; Pass-2/Pass-3 recovered 5 of them—+3.5 prototypes (all seven run AND adversarially re-verified: P1/P3/P5/P6/P7 CONFIRMED with byte-exact reproductions, P2's gate confirmed 8× with its device bound re-judged and the wave re-authored conservative, P4 amended-and-booked), +1.0 W2 execution risk (Q1 re-derived the manifest fresh and closed five gaps; Q3 cleared the wave ordering both directions; Q10 fixed the gate self-contradiction), +0.5 design coherence (Q8 made the hardening slate internally consistent; the owner delta is now one correctly-enumerated line). The missing 6, honestly: −1.5 W2 never rehearsed end-to-end (Q1's own FAIL-EXPLICIT) + the owner-side box decommission is spec-only · −1.0 the GAC 13.36×-class ratios rest on a deleted scratch harness until W-GATE commits a probe · −1.0 e2e is measured at HEAD (12/14, reproduced twice) but the 2 frame-line reds are diagnosed-not-fixed and futoshiki coverage is zero until W0 · −1.0 the one outstanding owner line (§4) + the taste-gated root-README register · −0.5 P2's genuine-low-power-device run (gates only the aggressive N=3 branch) · −1.0 environment-bound wall-clock (regimes/ratios only; absolute ms re-derive at execution).

---

## 2. The ratification ledger — R1–R9 (owner, 2026-07-09, all at recommended)

| # | Ratification |
|---|---|
| **R1** | **FULL ABROGATION**: FastAPI server + docker/nginx/compose EXCISED (`apiError.ts` SPLIT not deleted—live for wasm errors); N=5/25×25 killed outright (28% of the embed retired); API box service decommissioned; py/ bindings + 4 wheel-contract tests survive at `csp-solver/tests-py/`, CI py-runtime retargets |
| **R2** | **FOLD + MIT**: CLAUDE.mds/CONTRIBUTING removed with live content folded into lean per-package READMEs; MIT coherent across root/crates/npm/py |
| **R3** | **WHOLESALE affordances**: print CSS → K-peek input-exemption → stale-note clear → backtracks stat-line → bounded undo → share-on-demand permalink → minimal PWA → hint tier (after undo); REJECTED: manual pencil marks (engine-domains variant = prototype P4), upfront hints, input-mode toggle. Plus the L33 hardening ten (wordmark ladder-binding, dark-menu figure-ground, error-note fold, mobile `md:`→`lg:` + 44 px floors) |
| **R4** | Substrate island excised (restart/CHS/nogoods 335 LOC + `SoftConstraint` + dead `variable.rs` methods) at **0.3.0**—the restart-driver deferral ends foreclosed |
| **R5+R6** | 28 GB worktree purge + `java` branch delete; e2e wired into CI (2 red specs fixed + first futoshiki spec) |
| **R7+R8** | `rust-toolchain.toml` pinned STABLE + `rust-version = "1.88"`; `@mkbabb/keyframes.js` excised from package.json (zero imports) |
| **R9** | The never-push-csp-solver-origin order is RETIRED (0.2.0 published from here; identity current); bbnf-lang's own never-push STANDS |

**Binding constraints (override prior bookings where stated):** the demo STAYS in this repo—the **csp-solver repo split is VOID** (tranche-1 N9 de-booked); **tests NEVER inline**—`tests/` dir only (revokes W13's two-discipline statement); docs are **fold-not-delete + MIT** (R2); UI work is **KISS-forward, no overengineering** (owner constraint 7); everything grounded in profiling/benches/results (constraint 8). Standing quote rules: never quote an original the [corrections ledger](appendices/A-corrections-ledger.md) corrects; the stale-echo blacklist stays blacklisted; wall-clock ms are regimes and ratios, never SLAs.

---

## 3. Wave index

Dependency notation: `←` requires. Full specs in [`waves/`](waves/). Prototype gates are all CLEARED (Pass-2 + Pass-3)—no wave is prototype-blocked anymore; the one conditional left is W4's device-gated aggressive branch.

| Wave | Scope (one line) | Depends | Effort | Headline gate |
|---|---|---|---|---|
| [T2-W0](waves/T2-W0-gates-hygiene.md) | e2e at HEAD fixed + futoshiki spec + CI wiring; stale-literal refresh; `.env` untrack | — | S | e2e full green in CI; `gac_ab_corpus` prints derived 0/112 |
| [T2-W1](waves/T2-W1-toolchain-deps.md) | Stable pin + MSRV 1.88; PyO3 0.29 + dist-info rename; Node 24, Vite 7→8 (P7 cleared), TS 6.0.3 | ← W0 | M | 150/0/6 · 108/2 · clean build under vue-tsc + clippy `-D warnings` |
| [T2-W2](waves/T2-W2-abrogation.md) | R1 executed: server/docker/nginx excision, `apiError.ts` split, tests-py rehome, doc-reference sweep | ← W0, W1 | L | zero `web/api` hits (source, config, prose); py-runtime green from `tests-py/` |
| [T2-W3](waves/T2-W3-kernel-tests.md) | Inline-test migration; substrate excision @0.3.0 + bbnf sync; bench hygiene + iai-CI; L26 kernel beats pinned safe | ← W1 | L | Q9 invariant battery P1–P6 green; node counts frozen; 0/112 both modes |
| [T2-W4](waves/T2-W4-data-reshape.md) | N=5 kill; sparse embed (P1); conservative bank excision—keep N=3-hard | ← W2 | M | sweep green · `gac_ab_corpus` + Vite-plugin parse green on the reshaped bank |
| [T2-W5](waves/T2-W5-fe-perf-hardening.md) | Transport headers + font self-host (P5); grain-hoist (P3); mobile; the Q8-final hardening slate; pencil-boil 0.7.0 | ← W1, W3ᵇ | L | −60%-class size-switch raster; SSIM soul-gate; focused-conflict ring computes red/10 |
| [T2-W6](waves/T2-W6-affordances.md) | R3's bound order 1–8 with the Q7 interlock fixes + the Q4 SW strategy | ← W5 | L | per-affordance e2e + the shared keyboard spec; offline reload serves fonts+wasm from Cache Storage |
| [T2-W7](waves/T2-W7-docs-record.md) | Fold-not-delete per the Q10-amended plan; MIT; the record (reversals, ledgers, corrections) | ← all prior | M | zero CLAUDE.md tracked; zero stale-echo entries; zero retired-N=5 claims carried |
| [T2-W-GATE](waves/T2-WGATE-recertification.md) | Re-certification: 30-repro template re-run, committed GAC probe, ledger close | ← all | S | every headline number reproduced at final HEAD from committed harnesses |

ᵇ W5's only W3 coupling is sequencing hygiene (kernel beats don't touch the FE); W5 may start after W1 if W3 is in flight.

**DAG:** `W0 → W1 → {W2, W3} · W2 → W4 · W1 → W5 → W6 · {W0..W6} → W7 → W-GATE`.

**Dropped from wave candidacy** (settled REJECT/DEFER/RETIRED): granian, wire reshape (dead with R1), reka/glass-ui component adoption, manual pencil marks, solve timer, simd128, opt-level 3, opt-level s (deferred w/ felt-latency trigger), divan, the L29 SOTA list wholesale, repo split (VOID), H2-placement, H6-burst, H7, H10.

---

## 4. Decisions + the owner-line register

The full 27-row decision set (23 EXECUTION-READY · 2 PROTOTYPE-GATED, both now cleared · 2 RETIRED-BY-R1) lives at [`evidence/synthesis-pass1.md`](evidence/synthesis-pass1.md) §1, amended by the Pass-3 reports cited per-wave. Everything is settled except:

**OWNER LINE — one outstanding confirmation.** The verify-33 hardening amendments extend R3's ratified ten by one notch: **H2-elevation-only** (placement half dropped) · **H6 enlarge-in-place** (2.5→~3.25 rem; reposition+burst dropped) · **H7 dropped, I2 promoted into its slot** (suppress the wordmark-reveal replay on game swap) · **H10 → DEFER**. One line confirms or reverts all four clauses ([`evidence/pass3/Q8-hardening-slate-coherence.md`](evidence/pass3/Q8-hardening-slate-coherence.md) §c—the correct enumeration; H8-centering-only is within-spec selection, no confirmation needed). **Default: the amended slate executes** (W5 is authored to it).

**TRANCHE-III BOOKING — engine-domains pencil marks (P4).** Feasibility PASSED (+265/−6, zero new deps, 6/6 harness checks, pencil-soul rendering—[`evidence/pass2/P4.md`](evidence/pass2/P4.md)); booked for tranche III, NOT this tranche (W6 doesn't depend on it). The two named design decisions—**what the marks know** (propagation tier) × **when they appear** (ambient vs opt-in)—were re-derived as **coupled, not orthogonal**: 109/116 bank boards (100% of easy+medium at every size) collapse to a verbatim answer key under the full-GAC op, and the fixpoint cascade alone (AC-3 sans Régin) still collapses 20/20 EASY—the default surface. Three coherent bundles: ambient-naive (client-derivable; **the wasm op doesn't ship**), opt-in full-GAC behind the peek/hint grammar (the op as built, +1,779 B), or hybrid. Tier-(b) needs a new engine revise mode, not an op param ([`evidence/pass3/verify-P3-P4.md`](evidence/pass3/verify-P3-P4.md) A4).

Reversals of record (W7 writes them): R4-inline-tests (revoked), D2-CLAUDE.md (rewrite→removal), N9-repo-split (VOID), R9's never-push retirement (bbnf's own order stands), the T2-1 de-booking.

---

## 5. Artifact map

**[`evidence/`](evidence/)** — durable copies (verbatim, unmodified) of the synthesis chain:

| File | Role |
|---|---|
| `synthesis-pass1.md` | The decision set, wave skeleton, prototype list, §5 corrections ledger, convergence 89 |
| `32-synthesis-readiness.md` | The Pass-1-critique gate: trust topology, S1–S19, ratification queue, the ledger's source of record |
| `pass2/P1..P7.md` + `*.diff` | The seven prototypes: reports, patches (`P1.diff` 119 files re-applies clean at HEAD; `p3.diff` 2 files; `P6.diff` rides branch `spike/iai-callgrind` @ `ff5d9de3`; `P7.diff` the Vite-8 bump), `P1-reshape_bank.py` (W4's generator), `p3-ssim.py` |
| `pass2/p3-shots/`, `pass2/p4-shots/` | The grain-hoist soul-gate captures and the pencil-marks rendering judgment set |
| `pass3/Q1..Q10-*.md` | The ten critique questions—each ends in an exact wave-spec amendment, all folded into `waves/` |
| `pass3/verify-P1-P2.md`, `verify-P3-P4.md`, `verify-P5-P7.md` | Adversarial re-verification of all seven prototypes (fresh rebuilds, 8× browser re-runs, raw GitHub log pulls, full-bank native re-derivation) |

**[`appendices/`](appendices/)**: [A — corrections ledger](appendices/A-corrections-ledger.md) (the law: refuted/corrected/blacklisted + Pass-3 additions) · [B — prompt recap](appendices/B-prompt-recap.md) (the L22 matrix, both campaigns → waves) · [C — deferred fold-in](appendices/C-deferred-foldin.md) (the 58+1-item ledger, every row homed) · [D — convergence record](appendices/D-convergence-record.md).

**Session-scoped, NOT copied (FAIL-EXPLICIT):** the full 73-report Pass-1 corpus (`pass1/01..33`, `pass1-critique/verify-01..33` + meta-lanes) lives at `/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche2/`—a session scratchpad that will not survive cleanup. Its load-bearing conclusions are folded into `synthesis-pass1.md`, the readiness gate, and appendix A; any citation below to a `verify-NN`/`L-NN` lane resolves through those durable copies first, the scratchpad second while it lives.

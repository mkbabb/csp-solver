# T5 formulation — the finding-family registry

Families group findings by DEFECT MECHANISM, not wording. Sources: r1/*.md (12 lenses). Status: OPEN (single-lens), CORROBORATED (≥2 independent lenses), CONFIRMED (adversarial verify survived), REFUTED, ABSORBED-BY-WAVE.

**Round log**: R1A landed 13:20 EDT 2026-08-01 (6/6, `wf_dbfeb0d4-26b`) · R1B landed 13:34 (6/6, `wf_555fb4aa-b92`) · v2 cut 13:38 · R2 landed 13:53 (6/6, `wf_7847aab1-98d`) · **v3 = v2 + the VERDICT DELTA at the foot of this file** · batch-3 launched (thrice ALPHA/BETA + 4 R3 lenses). Stability law: two consecutive rounds adding no family and no row.

## FAM-A — Gate ABSENT or UNWIRED

| Row | Finding | Evidence | Status |
|---|---|---|---|
| A1 | FE unit layer (332 blocks / 31 files) runs in NO CI lane; `test:unit` declared, never invoked | gate-soundness V1 | OPEN→R2 |
| A2 | P1 perf thresholds (`gates.json`) have ZERO executors; rig absent by the wave's own admission (p-w3-adoption.md:188); scheduler park asserted by no test; no JS/CSS byte band | gate-soundness V2 + perf-disposition #2/#3 | CORROBORATED (2 lenses) |
| A3 | EVIDENCE-POLICY's byte-cap gate never built; 31 T4 PNGs breach 150KB; 3 waves breach 2MB | plan-vs-landed L1 | OPEN→R2 |
| A4 | eslint cross-game boundary covers 2/20 ordered pairs | gate-soundness V4 + census #3 | CORROBORATED |
| A5 | cargo-audit push-only (no `schedule:`) | gate-soundness V5 | OPEN |

**Sound-gates ledger (earned green, verified by ≥1 lens)**: filterBudget census (both engines, retries:0, positive control raises by exactly 1) · lean-wasm band hard-exit · preload hygiene throws at build · knip all-rules-error exit 0 · zero TODO/ts-ignore/allow(dead_code) machine-clean · PRM source-gated (0 rAF under reduce, probe-verified) · contrast ledger reproduces · glass-ui zero (one declared vendoring with reason at copy site) · file:-link discipline (June divergence structurally blocked, ci.yml:481-501).

## FAM-B — Vacuity by SCOPE-NARROWING or SKIP

| Row | Finding | Evidence | Status |
|---|---|---|---|
| B1 | wordmark linux `test.skip` swallows the edge-clip assertion on the only CI platform; `retries:1` flaky-green | gate-soundness V3 (critiques `71456713`) | OPEN→R2 |
| B2 | T4-W14 doc gate greps 2 files; FAM-8 "CLOSED" over a stale product README at the gate SHA | plan-vs-landed L2 | OPEN |

## FAM-C — DOC/RECORD DRIFT (22 STALE claims + memory drift)

Headliners: `web/frontend/README.md` = two-game app, `^0.7.0`, bare `--write` (rewrite, not patch) · root README e2e "82/13" vs measured 206/15/20-specs · README:117 "CI Chromium alone; Safari known-broken" now FALSE (webkit runs 91) · benchmarks node spine self-refuting (ci.yml already declares it stale) · lean-wasm 121,855B stale in SIX sites (second bite ⇒ class) · sudoku.md 10³ error · three cited APIs don't exist · csp-solver README Install pins "0.5" vs 0.6.0 crate · README.md:127 pencil-boil `^0.9.2` vs `^0.10.1` · indirect meta-leak via docs/precepts link · ci.yml:406 band comment (CH-32) · theme-key disagreement (L5). **MEMORY DRIFT (root's own index)**: "FastAPI at web/api" (deleted at `98fe2562`, T2!) · crates.io 0.6.0 listed open (executed 07-15) · "scripts/sync-csp-solver-vendor.sh" placed in this repo (lives in bbnf-lang). Full tables: doc-canon-drift.md.

## FAM-D — CLOSE-CEREMONY / RECORD INTEGRITY

| Row | Finding | Status |
|---|---|---|
| D1 | NINE rows dropped from T4's "100%" ledger (CH-24–29, 47–49); 2nd occurrence ⇒ CLASS DEFECT in the close ceremony | CONFIRMED (chronic §2d) |
| D2 | "CI green throughout" over a failed run (the owned process scars) | CONFIRMED |
| D3 | Close-count corrected 5→7 (T3 closed twice; T4 §9 a separate ride) | ACCEPTED |
| D4 | CH-29 N=5 FOLD-DO claimed, never landed (file pre-dates the claiming close) | CONFIRMED (git) |
| D5 | Design-loop record was scratchpad-volatile — **CURED 13:25**: full text record lifted in-tree (evidence/design-loop/, 6.4MB, binaries pruned per policy) | CURED |
| D6 | D7/W8 row carries OPPOSITE dispositions in two live records (README "FOLD" vs WGATE "retire-with-measurement") | OPEN (perf #1) |
| D7 | CH-16 permalinks LANDED-unrecorded; CH-34 adjudication lives only in memory ledger; deployment IDs cited in SHA position | OPEN (chronic §4) |
| D8 | PyPI `csp_solver` name is third-party-owned (0.1.2, other project); pyproject declares it at 0.6.0 ⇒ `maturin publish` will 403; **unrecorded anywhere** | OPEN (cross-repo, latent) |
| D9 | pencil-boil 0.10.0/0.10.1 published UNTAGGED (breaks 13-release convention) | OPEN |

## FAM-E — DUPLICATION ESTATE / DISTILLATION TARGETS

| Row | Finding | Status |
|---|---|---|
| E1 | Thermo↔Killer twins (Game 2 diff-lines; Board 14); S6: 5-way useSolver/worker/protocol/urlState estate (useSolver killer↔thermo 48/151 diverged) | CORROBORATED (census + dead-code) → R2 full matrix |
| E2 | Dead-bound props: AnswerKeyLaminate.subgridSize; GameBoard cornerMarks/centerMarks (bound by all 5, read by none) | OPEN |
| E3 | 15 unreferenced @theme tokens, 10 = shadcn defaults at default HSL (the abrogation concrete); .crayon-blue dead | CORROBORATED |
| E4 | filterBudget.ts e2e-only (by design? adjudicate); PENCIL 5/6 keys dead; YOSHI_COLORS 6 dead entries + rename orphan (CH-31) | OPEN |
| E5 | registry.ts asserts a boundary its own family violates (thermo/killer/kenken ← futoshiki) | CORROBORATED (census + consumer-truth) |
| E6 | SHADOWS of lib capability: createGlyphDrawIn ≡ pencil-boil createStrokeDrawIn (same comment!); boilRectFrames, ellipsePoints; 20/44 pencil-boil exports unconsumed | OPEN→R2 |
| E7 | Dead rust surface: `set_domain` (dead since 04-06, doc cites phantom call site); `abi3` feature nothing compiles; dead getters ThermoPuzzleData.n/Killer.n | OPEN |

## FAM-I — ARCHITECTURE FICTION (declared contract ≠ running truth) — NEW at v2

| Row | Finding | Status |
|---|---|---|
| I1 | `gameRegistry` has ZERO production consumers (tests only); holds 2/5 games; 4/5 GameDefinition slots test-only; SudokuGame.vue bypasses the contract (TDZ recorded) — "the defineGame registry" story is not the running architecture | OPEN→R2 (headline) |
| I2 | PropagationStrategy + Csp::propagate_with zero callers anywhere; bbnf tripwires don't cover it | OPEN |
| I3 | 5 workers import undeclared subpath `…_bg.wasm?url` (pkg has no exports map) — works via file:-link, latent break on registry publish | OPEN |
| I4 | bbnf vendored pin 105 commits behind, declares 0.1.0 vs 0.6.0 — BY DESIGN but "OK:" invites misread; disclosure row | OPEN (record) |

## FAM-J — MASKED FALLBACK / silent degradation (FAIL-EXPLICIT violations) — NEW at v2

| Row | Finding | Status |
|---|---|---|
| J1 | TEMPLATE_BANK `?? []` collapses excised/present/build-lost; 9×9 easy+medium ship EMPTY bank → silent live-gen path; vite generator masks missing dir | OPEN→R2 (user-facing) |
| J2 | 11 hand-copied `try{h.stop()}catch{/*ignore*/}` across 6 files | OPEN |
| J3 | Safari<14 MQL shims written NEW 07-31, below the repo's own Safari-26.4 floor | OPEN |

## FAM-K — ACCESSIBILITY (3H/6M/6L, AX-tree-probed) — NEW at v2

H1 grid role owns 81 gridcells with no row layer (all five boards, table nav dead) · H2 destructive-work guard silent to AT (second Enter discards unheard) · H3 picker publishes 1/5 options (`:inert` on inactive cards) · M4 `k` peek no modifier guard (Ctrl+K collides) + 2.1.4 single-key failures (k/g/h/p/d) · M5/M6 digit double-announce; 93 unnamed image nodes · lows in a11y.md. Clean: PRM, contrast ledger, no raw-crayon text. **Interacts with the design loop** (picker family, guard naming row, mobile band).

## FAM-F — DISEASE ROWS (chronic-ledger.md is the reference: 61 rows)

14 HARD (CH-35 E8 ride-4 · CH-33 sudoku.md fired-trigger · CH-29 · CH-32 · CH-31 · CH-25/24 six-ride orphans · CH-28 · CH-37 dependabot #68/#69 · CH-36 zone RUM/purge · CH-38 blind readers · CH-39 landscape · CH-40 keypad rig · CH-58 F3-G1 · CH-61 marks 3/5/6) + 6 BY-LETTER (CH-23 useCelestialSun ride-6 parked-in-no-living-record, CH-26/27, CH-47/48/49) + record gaps §4. T5 law: terminal decision each; the DECIDE work is its own wave.

## FAM-G — UNADDRESSED ASKS (prompt-recap gaps)

G1 mbabb-logo font/padding · G2 board-border progress bar (+ verify crosswords-retire covers the ask) · G3 "bake a game" control differentiation · G4 marks 3/5/6 (ABSORBED by design loop pending) · G5 edict origins traced (abrogation + colocation BORN HERE 2026-03-04, Codex). → R2 consolidated recap matrix resolves G1–G3 against ALL corpora.

## FAM-H — PROCESS FRICTION

Re-exhortation: no-quick-solutions 8× · Fable/Opus routing 8× · no-legacy 6× · recap 6× · design-through-Fable+plugin 6× · colocation 4×. 52 cron replays of the resume string. No Safari MCP (CH-45). Friction wave: encode the re-exhorted edicts repo-durably; MEMORY.md true-up (C-family drift); the close-ceremony class defect (D1) gets a structural cure (the ledger-diff gate: next close must machine-diff its ledger against the prior close's open set).

## v3 VERDICT DELTA (R2, 13:53 — full evidence in r2/*.md)

**CONFIRMED**: A1 (every hatch closed: no composite actions, no hooks, no transitive runner) · A3 **worse** (policy cited by the goldens script that then exempts the estate; live breach 31 images + 3 waves) · A5 (push/PR only) · K H1/H2/H3 all reproduced live (H2 through to the destroyed board: modal=false, no live-region, entries 1→0) · I1 a–d (true consumer set = declaration + tests; every dynamic-import/glob/bracket/plugin hatch null; TDZ REPRODUCED in an isomorphic 4-module ESM repro) · I2 (bbnf host uses bare `csp.propagate()` ×9; zero callers anywhere) · D4/CH-29 · dup-matrix E1 quantified.
**NARROWED**: B1 — an INKED clip still reds on linux (the skip guards only the blank case); what stands: exit-0 on 5-skip runs, the invariant exists in NO other spec, logo golden is chromium-only, theme-bake residual guard covers 1/5 labels, `retries:1` on 2/6 projects with no failOnFlakyTests and one real flake-green banked. Repair shape: hoist the edge-clip assertion out of the skip + widen the residual guard + retries policy. · I3 — the break trigger is an UNGATED wasm-pack regen (exports map would 403 the subpath), not a human edit; cure = exports-map row + regen gate.
**RECLASSIFIED**: J1 → DESIGNED-DOCUMENTED (README:58, sudoku.md:53, ratified T2-W4 record; latency p95 2.98/6.84ms vs 50ms budget; calibration delta ZERO; both paths seeded). Residual LOW row: a build-lost bank dir would degrade silently to slower deals — an explicit bank-state assertion is a W1 nicety, not a breach. R1's S1-HIGH withdrawn. · J2 → DISTILL row, not a breach: `stop()` cannot throw (lib source cited), 5 sites already unguarded, helper importable (one site already does) — 11 sites (R1 missed HandwrittenGlyph.vue:178) collapse to one composable in W2. · J3 → provenance FALSE (authored 07-11 `7c967416`, hoisted verbatim 07-31); "below-floor" only PLAUSIBLE because **no browserslist/floor is declared anywhere — NEW ROW C5: declare the support floor** (the Safari 26.4/iOS 19 figures are rig devices, not policy).
**CORRECTED**: lean-wasm stale in FOUR sites not six; cause = toolchain drift (zero .rs changes), which the W1 doc-truth gate must tolerate by re-derivation, not pinning.
**FAM-G COLLAPSES**: G1 mbabb-logo ADDRESSED (`8913023e`, 68 min after the ask — AttributionCard font+padding on the √φ rhythm; every corpus missed it because T2's recap homed it as "@mbabb attribution fix") · G2 board-border progress bar ADDRESSED (chain → T4-W9 `8875d261`, live HandDrawnGrid.vue:26,78-85,290-296,449-458; the crosswords retire is solver-domain and does NOT cover it — but W9 did) · G3 bake-a-game ADDRESSED-with-successor (ruling: size+difficulty behind one guarded Deal, `766aa068`; the verb "bake"→"Deal" lost a ratify-me row; open successor = mark 5's Deal weight = CH-61). Remaining FAM-G = the recap matrix's 11 UNADDRESSED rows with owning waves (r2/prompt-recap-matrix.md).
**NEW ROWS**: N1 — `sudokuGame` ships 315 dead bytes in the prod chunk (undeletable by author or bundler while the cycle stands) · C5 — browserslist/support-floor undeclared · D10 — rust no-god-modules REGRESSED unrecorded (`assignment.rs` 607, `cage.rs` 558; only `search.rs` 528 has a waiver) · D11 — `f1adfca5` joins the deployment-id-in-SHA-position trap set.
**DESIGN WALLS (binding on thrice)**: the TDZ cycle wall dissolves ONLY if the registry decision restructures the import graph; provide/inject flourish scoping; knip prewarm. Loop collisions ruled: guard-names+H2 → A-wave · picker-inert+H3 → A-wave · k-peek+keypad → F3-wave · drawer/band × twin estate → BC cashes T′, F3 measures; **the 56% duplication is a DISTILL row, not a design-lane row**.

## v4 FINAL DELTA (batch-3, 14:15) + THE STABILITY RULING

**Thrice designs in** (evidence/design/alpha-gestalt.md ∥ beta-mechanics.md): both converge on one-spec/one-shell/slots-live-by-construction, −4,150 raw LOC, boundary 20/20 by construction, TEMPLATE_BANK→TIER_SOURCE, 11 catches→0; they split on retire-vs-make-true for the registry — ADJUDICATED in waves/T5-W2-distill.md (the table dies, the contract lives).
**R3 verdicts**: completeness — 12 gaps, 3 critical: GAP-1 T5 corpus untracked (TRUE; cured by the formation commit — D5 "CURED" was premature until then), GAP-2 zero live-production rows (PARTIALLY discharged in the same batch by r3/security's live curls: _headers byte-match, poisoning guard confirmed BETTER than documented; WGATE carries the full production re-pass), GAP-3 loop numbers self-reported (disposition: W4's pass-6 non-author audit IS the loop's own law — in-tranche, not a formation defect); GAP-5 OFL LICENSES.md figures stale (third site of the stale-figure class → W0), GAP-6 no coverage instrument (→ W1.14). Security: postcss ≥8.5.18 in-caret lockfile-only; sharp via wrangler →4.116.0 HARD STOP before 4.117 (miniflare 5 alpha); brace-expansion HIGH invisible to dependabot (→W1.15); CSP strong live, unsafe-inline ballot, COOP/CORP free. Rust-gestalt: core healthy (clippy clean, gac/ split held); edges rot — assignment.rs 607 UNWAIVED god module, cage.rs 558 resolves by test-extraction (colocation act), search.rs waiver stale 24L, **futoshiki surface diverges 1/5** (no given, no SolveConfig, hardcoded Ac3+Mrv), SudokuClass lacks from_difficulty, py-futoshiki claimed in 2 docs and doesn't exist, **tests 204 not the docs' 208**, thermo lacks an oracle, 12/15 wasm verbs unboundary-tested, lean build never test-executed, wasm family dup 0.84–0.86 with board_total triplicated, JsError untyped 3/5, CspTimeoutError unraisable. Goldens: inventory clean 8/8; totalBytes summed-never-gated; 4 shadow fossils; **the BLIND BAND** (0.017 < drift 0.03 < 0.05 on ubuntu-only CI); CH-42 needs a magnitude instrument — n-run sampling REFUTED as null (my own W1.9 draft amended on this verdict).
**STABILITY RULING**: R2 added families I/J/K; **batch-3 added ZERO families** — every new row lands in an existing family and an existing wave (W0/W1/W2). Family-level stability: reached. Row-level tail: acknowledged, dispositioned in the README's completeness table. Budget spent 30/32; the return-contract clause governs the residue: the strongest converged core ships with its exact remaining gap named (GAP-2's full production sweep + GAP-3's non-author re-verify live INSIDE the tranche at WGATE and W4 respectively).

## R2 roster (launched at v2)

1. verify-gate-criticals (A1, A3, B1 scope, A5, retries; independent re-probe of K H1–H3)
2. verify-architecture-fiction (I1 dynamic-import escape hatches, TDZ, I2, I3 publish-risk)
3. verify-masked-fallbacks + doc headliners (J1 user impact, J2 count, J3; e2e counts, chromium-alone, spine, 6-site wasm figure, 10³)
4. dup-matrix (full five-game pairwise quantification per file class + shared-absorption counterfactual) — DISTILL wave input
5. recap-consolidate (95 CC + 29 Codex + B-prompt-recap + T2/T3/T4 appendices → one matrix; resolve G1–G3)
6. loop-state-fold (lifted design-loop tree → the definitive open-rows spec for the T5 design waves; flag K-family collisions)

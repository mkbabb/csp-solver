# Lane 32 — Synthesis Readiness (Pass-1 Critique, Tranche II)

**Charter.** The gate: is this corpus fit to author a tranche on? Inputs read in full: all 25 in-scope Pass-1 reports (`pass1/01..25`), the 8 late-landing lanes (`pass1/26..33`, on disk as of 07-09 but **uncritiqued**), and every critique report extant at my turn — `verify-01..25` plus the five meta-lanes (`26-interruption-forensics`, `27-head-drift-map`, `28-contradictions`, `29-completeness`, `30-reproducibility`). This lane adjudicates at decision granularity, not claim granularity — the claim-level verdicts live in the verify layer and are folded here, not re-run.

**GATE VERDICT: READY — CONDITIONAL.** The corpus is fit to author on, provided the synthesis (1) folds the standing corrections/refutations ledger in §5 verbatim, (2) treats lanes 26–33 as evidence-grade-pending until a verify pass lands (or authors their items as verify-then-apply beats), (3) routes the §3 ratification queue to the owner before the affected wave boundaries, and (4) never quotes any single lane's number without the verify layer's correction (the 28-contradictions rule). The owner's structural fears — wall-corrupted reports, HEAD-move contamination — were investigated to ground and **did not materialize**: zero completion-suspect reports (forensics, grade A), zero lanes wall-clock-straddle `8913023e` (drift map), and every deterministic number re-run in the reproducibility lane reproduced to the byte.

---

## 0. Trust topology (what the synthesis may lean on, and how hard)

Grades from the verify layer, lanes 01–25:

| Grade | Lanes | Synthesis posture |
|---|---|---|
| A / A− | 01, 04, 05, 06, 07(A−), 08, 10, 13, 14, 15, 17(A−), 18, 19, 20(A−), 22 | Quote directly; corrections cosmetic |
| B+ / B | 02, 03, 09, 11(B+), 12, 16, 21, 23, 25 | Quote only with the specific correction folded (§5) |
| C | **24-wave-drift** | Do NOT cite its "still live / materialized" verdicts without independent re-verification — two of its highest-stakes claims (both W9 a11y "materialized risks") are REFUTED, a third (lattice hang) half-stale |

Meta-layer: forensics A · drift-map B+ · contradictions B · completeness B · reproducibility B (A− on deterministic numbers, C on wall-clock ms — quote regimes and ratios, never absolute ms as SLA).

Structural findings the synthesis inherits:
- **Corpus integrity intact.** 25/25 reports complete, authored by their completing agents; the one provenance caveat is lane 14 (on-disk report is the lighter second re-dispatch — content coherent, depth possibly lost).
- **HEAD move contained.** `8913023e` touches exactly 14 files, all `web/frontend/src` — Rust/Python/data/bench claims are baseline-invariant across d43fae28→8913023e (`git log d43fae28..HEAD -- csp-solver/ web/api/` empty). Owner framing "early frontend lanes saw the old tree and late ones the new" is REFUTED as stated: no frontend-sensitive lane completed pre-move. Two residual contaminations only: lane 17's WIN-2 font attribution (post-move source cited under pre-move bytes) and lane 15's F7 (pre-flagged, superseded — re-measured by verify-15 at HEAD).
- **Stale-echo blacklist** (never quote): "83 integration tests" (now 141), "107 Python tests" (108), `search.rs` 507 (517), "19–380×" perf band (~10–330×), "~33 KB on the wire" brotli (~38.6 KB edge-served), "0.4975 vs 0.6 ms" wasm 9×9 (corpus-internal 21% split; fresh ~0.42 ms), the harness-embedded pre-`dc5bd4c4` CLAUDE.md snapshot (trapped lane 23; my own system prompt carries it too).

---

## 1. (a) Decisions the corpus settles beyond reasonable doubt

Each row: decision → evidence chain (Pass-1 lane → verify verdict → independent corroboration where it exists).

| # | Settled decision | Evidence chain |
|---|---|---|
| S1 | **The abrogation IFF's factual condition is MET**: wasm has full user-facing parity on the shipped surface (sudoku n≤4, futoshiki 4–7; N=5-easy is the lone server-only feature, and it is both unreachable (`vite.config.ts:30 SIZES=[2,3,4]`) and unrenderable (glyphPaths stops at G)) and superior perf at every interactive touch, ≥10× | L01 → verify-01 (A, byte-exact) · L02 → verify-02 (B, band corrected ~10–330×, direction rock-solid) · 30-repro re-run: wasm ~0.42 ms vs live-warm ~16 ms ≈ 40× |
| S2 | **Server+docker excision manifest membership is correct** — with two mandatory corrections: `apiError.ts` is LIVE (imported by both game boards for the wasm error path; only `useApi.ts` is dead — split the file, don't delete it), and the DNS/App-Runner question is RESOLVED (api.sudoku.babb.dev = owner box, Apache→nginx per domains.md; OD-4 executed at d43fae28, NXDOMAIN live-confirmed) | L03 → verify-03 (B; two refutations folded) |
| S3 | **KEEP PyO3 `py/` + relocate the 4 wheel-contract tests (618 L) to `csp-solver/tests-py/`; CI py-runtime retargets** | L04 → verify-04 (A, exact to the line in two repos) |
| S4 | **Nightly is vestigial; MSRV = exactly 1.88 (let-chains); stable 1.97 passes workspace+wasm+clippy -D warnings clean** | L05 → verify-05 (A, verifier bisected 1.87-fail/1.88-pass) · independently reproduced by L32-tooling |
| S5 | **PyO3 0.24.2 → 0.29.0 is mechanical**: 9 `allow_threads`→`detach` sites, wheel rebuilds byte-consistent, 108/2 pytest green; bundle `strip=true` (−21.6% .so) | L13 → verify-13 (A, most-corroborated report in the corpus; live changelog/PyPI/compile) · independently reproduced by L32-tooling worktree |
| S6 | **Inline-test migration is zero-widening** — 2 modules, 5 tests; verify-08 actually compiled the migration in a worktree (error.rs 2-pass, sudoku.rs 7→10, R13 debug/release behavior preserved) | L08 → verify-08 (A, stronger than the report itself) |
| S7 | **The substrate island is inert and py/wasm-safe**: restart.rs+heuristic.rs+nogoods.rs (335 LOC) + `Ordering::Chs` + `SolveConfig.restarts` + `SoftConstraint` trait — zero live call sites, canary-only, feature-sweep clean; plus `variable.rs` `clear_log`/`reset_to` (verifier addition) | L06 → verify-06 (A, 0 refuted). Execution is owner-gated (§3-R4) |
| S8 | **Benches**: sudoku `fc_chrono` panic real (reproduced live at `sudoku.rs:161`), stale self-baseline pathology real (verifier's own run printed a phantom −17%), lattice benches exercise AC-3 not BBNF's sweep, six benches not four; **the lattice n=20 hang is FIXED at HEAD** (L24's "remains live" refuted by first-party run) | L10 → verify-10 (A) · 28-contradictions C10 |
| S9 | **Data bank**: all 116 boards proven correct against the wheel (116/116 unique-solution match); embed reducible — true sparse+compact = **81,963 B (−72.5%)**, not the report's mislabeled 60%; N=5-easy is 28% of the embed and UI-dead; the N=4-hard >1 s generate wall is real → bank load-bearing there | L11 → verify-11 (B+, headline corrected upward) · 30-repro: embed 298,006 B/116 files byte-exact |
| S10 | **Backend runtime**: uvicorn KEEP (granian wash at 4 workers, and 30–65% WORSE on the real thread-pool-hop route — reproduced); wire reshape DEFER, and its true location is `sudoku_api.rs`/`futoshiki_api.rs` (string-keyed at the Rust FFI), not Python — lane 13 adjudicated over lane 12 | L12 → verify-12 (B, §2a refuted) · verify-13 + 28-contradictions C1 |
| S11 | **UI affordance slate**: 6 ADOPT / 3 REJECT upheld by the design-authority re-judgment with binding amendments — priority order print→K-peek→stale-note→stat-line→undo→permalink→PWA→hint; hint gated AFTER undo; permalink amended to share-on-demand; stale-note fix widened to any non-graphite tone | L14 → verify-14 (A, 0 refuted; every mechanism re-derived + play-log corroborated) |
| S12 | **Mobile**: F1 iPad-portrait clipping CRITICAL and ~11 px WORSE at HEAD (`md:`→`lg:` fix stands); 16×16 cells ~21.7 px (sub-44 arithmetic impossibility real); sub-44 extends to the new logo-menu items (36.2 px); F7 superseded → new finding: 42×32 px hit-target contention logo-button↔toggle at 375 | L15 → verify-15 (A, re-measured at HEAD with independent harness) |
| S13 | **glass-ui**: adopt ZERO components/composables; vendor only the pure math; AND **excise `@mkbabb/keyframes.js` from package.json** — zero imports at both HEADs (the report's KEEP misread comments as imports); its removal also flushes the transitive glass-ui+reka-ui installs | L16 → verify-16 (B, 4b refuted → verdict flipped) |
| S14 | **FE perf wins all real**: immutable cache headers (wasm max-age=0!), font self-host/subset, avatar `?s=64` (104 KB→6 KB), CSP-vs-beacon fix, LCP already fine (72.0% third-party cold-load reproduced to the point) | L17 → verify-17 (A−; WIN-2 sizing rationale carries the §0 provenance caveat) |
| S15 | **pencil-boil 0.7.0 shape**: `useBoilCache<T>`, `boilLine/RectFrames` prebake, `createStrokeDrawIn`, app-local easings EXCISE, README/CONTRIBUTING/CHANGELOG fixes — every number byte-exact | L18 → verify-18 (A) |
| S16 | **Repo org**: 28 GB/34 stale worktrees (execution owner-gated §3), duplicate `apiError`/`solverError` are genuinely code-identical owned copies (DEFER stands — "~90% structural copy" premise refuted, twins diverge 68–92%), `web/frontend/CLAUDE.md` stale, `.env.example` dead DEPLOY_HOST, dead `java` branch | L19 → verify-19 (A) · L23 → verify-23 (B) |
| S17 | **Docs**: fold-not-delete strategy sound; the "living docs rot faster than process" thesis triply proven (OD-4 line stale in root CLAUDE.md+README; ANIMATION.md values falsify W13's own "fixed" ledger row); root CLAUDE.md is otherwise CURRENT (L23's F1 "stale root doc" was a phantom from the prompt snapshot) | L20 → verify-20 (A−) · verify-23 · 28-contradictions C3/C4 |
| S18 | **Deferred ledger (58 items)**: kernel/gate/docs spine exact; four edits mandatory — strike L25-28 (file doesn't exist; refuted), close L25-35 (BoilDivider parity landed W12), re-base L25-49 (the `--type-*` scale IS vendored at HEAD; only 3 logo-height literals remain), add the `test_budget_exceeded_error_end_to_end` skip as an item | L25 → verify-25 (B) |
| S19 | **Prompt-recap matrix complete**: 27/27 wave-commit hashes real, 6/6 campaign-2 asks + 9/9 binding constraints carried, T2-1..T2-9 = the requirement set; three owner reversals to record (R4 inline-tests, D2 CLAUDE.md, N9 repo-split VOID) | L22 → verify-22 (A) · 29-completeness Part A (no mandate clause orphaned) |

## 2. (b) Decisions resting on lanes 26–33 — landed, UNCRITIQUED

The brief said "in flight"; all eight landed 07-09 (forensics confirms results 21:41–22:41 UTC). They exist on disk but no verify-26..33 pass has run. Partial corroboration already exists from the meta-lanes (30-repro re-ran L27's wasm ms — −16% drift, regime confirmed — and confirmed L33's 112 px wordmark + chains=1/subscribers=10; verify-10 independently confirmed the CI-comment staleness L27 reports; 29-completeness confirmed L31's CORS static premise at `settings.py:22`). Treat as **evidence-grade-pending**:

| Decision | Carrier | State |
|---|---|---|
| Kernel-perf priorities: GAC `propagate_inner` 20–73% self-time; per-revise `Vec` in `all_different.rs:55`; NEW assignment-B&B cliff at n≈18 | L26 | uncritiqued; profiling artifacts in `pass1/profiles/` |
| wasm `opt-level=s` adoption (+17% solve, +2.1 KB, in-budget); simd128 REJECT (−3.4%); opt-3 REJECT (busts 93 KB); CI size-comment refresh (72,429→87,853; 201,053→211,639) | L27 | uncritiqued; size numbers independently reproduced byte-exact by 30-repro |
| Board-size-switch grain fix — extend the W8 grain-hoist to the transition layer (842 ms/s raster, 133 ms frame @4×); everything else KEEP at 60fps | L28 | uncritiqued; measured at d43fae28 (self-flagged; mount mechanism HEAD-invariant) |
| SOTA adopt/reject list — mostly NOT-APPLICABLE at demo scale (501 bt / 1.43 ms worst case) | L29 | uncritiqued; low-risk (rejections, not adoptions) |
| Headline re-cert: gac_ab_corpus is a STALE-CITATION repro path (can't produce 13.36×/nodes at all); corpus 112 not 113; wheel dist-info `sudoku_rs-0.1.0` rename | L30-bench-truth | uncritiqued; overlaps verify-09/10 confirmations |
| CORS env-prefix P0 (`SUDOKU_API_CORS_ORIGINS` vs unprefixed) + API-origin exposure (live, unused, misconfigured) | L31 | uncritiqued; static premise confirmed by 29-completeness; interlocks with S1/R1 — if the server is abrogated the fix is moot |
| Toolchain DO-NOW slate: pin stable, Node 22→24, Vite 6→7 (7→8 DEFER), wasm-bindgen 0.2.126, criterion 0.8.2 | L32-tooling | uncritiqued; nightly/pyo3 halves independently confirmed by verify-05/13 |
| FE hardening H1–H10 (wordmark/menu off-ladder, dark-menu figure-ground, error-note off-fold, dead right quadrant) | L33 | uncritiqued; 2 of its numbers (112 px, chains=1) confirmed by 30-repro |

**Synthesis rule:** anything from this table entering a wave gets authored as *verify-then-apply* (the wave's first beat re-derives the lane's load-bearing number) unless a verify-26..33 pass lands first.

## 3. (c) Decisions needing OWNER RATIFICATION

The four named by the brief, plus five found:

- **R1 — The abrogation IFF (T2-2/T2-7).** Evidence says the condition is met (S1). Ratifying = excising server+docker+nginx per the corrected S2 manifest, deciding the API box's fate (L31: decommission vs fix-CORS-and-keep — pure attack surface today), and accepting the lone casualty: N=5-easy dies with the server. Since N=5 is already client-unreachable AND 28% of the embed (S9), the clean ratification is "kill 25×25 outright."
- **R2 — Docs removal shape (T2-4).** The constraint says ALL CLAUDE.md-class docs are removal candidates; L20's evidence argues fold-into-READMEs, not delete. Ratify the fold shape + the root README register rewrite (King-James pastiche vs the ~5% florid ceiling) + **license coherence** (29-completeness G2: Unlicense root vs MIT crates vs license-less npm/py manifests — a decision, not a bug).
- **R3 — The affordance set (T2-8).** S11's slate + the three binding amendments (order binding; hint-after-undo; permalink as share-on-demand). Cheap to ratify wholesale.
- **R4 — Substrate excision.** S7 proves inertness, but excision forecloses the deferred restart/CHS driver (L25-01, N2/N3) and is a semver-visible pub-API removal vs bbnf's vendored copy. Owner call: excise now vs hold the substrate one more tranche.
- **R5 — 28 GB worktree purge + dead `java` branch** (destructive, owner's machine/history).
- **R6 — e2e-in-CI policy** (29-completeness G1: suite never re-run at HEAD, 2 known-red specs, futoshiki has ZERO e2e — wiring it into CI is a standing-cost decision).
- **R7 — Toolchain convention change**: pinning stable + `rust-toolchain.toml` contradicts the stated "Nightly toolchain" convention in CLAUDE.md — one-line ratification, then DO-NOW.
- **R8 — keyframes.js excision** (S13 flip): one-line package.json removal of an owner-authored dep.
- **R9 — Repo-identity reconciliation**: the working repo's `origin` already IS `github.com/mkbabb/csp-solver` while the standing order says "never push mkbabb/csp-solver" (verify-25 LB1 observation). The order and reality need one sentence from the owner.

## 4. (d) Genuine unknowns → Pass-2 prototypes

1. **Sparse+compact embed reshape** — 81,963 B was measured by re-serialization only; nobody has proven `parse_puzzle_field` + the template pipeline against sparse puzzle-only files. Prototype: regenerate bank → rebuild → full `cargo test` + the 116-board correctness sweep.
2. **wasm-side hole-dig generate cost** — every L11 gen timing is native; the browser multiplier is unmeasured (L27 measured solve, not bank-less gen). Gates the "excise N=2/N=3 bank, live-gen instead" option. Expected ~1.8× native (→ N=3-hard ~20–30 ms) but that's exactly the number to prototype.
3. **Transition-layer grain-hoist** (L28 F1) — mechanism proposed, escape hatch pre-booked at `pencilConfig.ts:170-189`, never built. Needs a measured before/after trace.
4. **Engine-domains pencil marks** — verify-14's elevated pick ("the one feature where the fiction and the engine are the same object"): requires a `propagate`-only worker op the protocol lacks. Prototype the protocol op + rendering spike before committing a wave.
5. **Font subset/self-host byte win** — L17 WIN-2's "~67 KB for two strings" sizing rationale is the corpus's one mixed-provenance claim (drift-map). Prototype the subset build and measure actual bytes; the action survives either way.
6. **iai-callgrind/codspeed CI harness** — can't run on arm64-macOS (no Valgrind); a CI-lane spike is the only way to validate (booked appendix C/D).
7. **Vite 7→8 (Rolldown)** — L32 defers pending a test pass of the custom `sudokuTemplates()` plugin + worker bundling under the new bundler. Prototype-shaped by definition.
8. **Flat wire reshape** (`sudoku_api.rs`/`futoshiki_api.rs`) — only if R1 ratifies KEEP-server; otherwise moot. If live: prototype at the two Rust FFI files lane 13 named, not `csp.rs`.

## 5. The corrections/refutations ledger the synthesis MUST fold

**Refuted (12 corpus claims + 1 owner framing) — blacklisted as stated:**
1. L03: `apiError.ts` dead-code/free-delete (LIVE — split it). 2. L03 §F: DNS/App-Runner "unresolved" (resolved; OD-4 executed). 3. L02: "ratios are load-robust" (low-end moved 19→11 with load). 4. L09: `alloc_count.rs` "same hand-rolled binary construction" (uses `add_all_different`/GAC). 5. L12 §2a: "PyO3 boundary already int-keyed" (live path is string-keyed in Rust). 6. L16: keyframes.js KEEP (zero imports; excise). 7. L21: `ci.yml:201` e2e comment (no such match — zero e2e anywhere, stronger). 8. L23 F1: stale root CLAUDE.md (phantom from prompt snapshot; file is current). 9. L24: lattice hang "remains live" (fixed at W2). 10–11. L24: both W9 a11y "materialized risks" (fixed within W9's own landing commit). 12. L25-28: useReducedMotion retirement pending (file gone; consumers migrated). 13. Owner framing: "early frontend lanes saw the old tree, late ones the new" (no frontend-sensitive lane completed pre-move).

**Corrected (the load-bearing subset — quote these values, not the originals):**
perf band ~10–330× (not 19–380×) · live-API warm ~16–24 ms, cold ~47 ms · wasm 9×9-hard ~0.42 ms · `allow_threads` = 9 call sites · `search.rs` = 517 · web/api tests = 12 files · edge-served wasm ≈ 38.6 KB (br-q11 local = 32,847 B — different things) · dense-with-zeros files = 106 · optimal embed = 81,963 B / −72.5% (sparse+compact) · `make wasm` = 284,009 B at current toolchain · `pkg/` is gitignored, not committed · e2e "12/14" = pre-HEAD W12 figure, unmeasured at HEAD · one-shot probes = 5 added in range, not 2 · L20 doc total = 2,158 L · session walls = 2 reset windows in the Pass-1 journal (not 5); hangs = 2 (37 min lane 07 + 49.8 min lane 13) · L15 F7 superseded by the 42×32 px hit-target contention · glass-ui reka wrappers = 8/9 (notification hand-rolled), and reka-ui 2.8.2 IS transitively installed · L17 provenance: measured the d43fae28 deploy, cited 8913023e source · L11 embed path: now `csp-solver/data/sudoku_puzzles/` (bytes identical) · Chs ≡ **Mrv** (DomWdeg renamed) · glyph ceiling lives in `glyphPaths.ts`, not `toDisplayChar`.

## 6. The synthesis skeleton — wave-set shape I'd author

Ordered so every owner gate sits at a wave boundary, verify-then-apply beats open each uncritiqued-lane wave, and prototypes precede their dependent waves.

- **T2-W0 · Gates + hygiene (no ratification needed).** Run e2e at HEAD; fix the 2 red frame-line specs; author a futoshiki spec; wire e2e into CI (pending R6 → else keep local). Refresh every stale literal the corpus proved: CI size comments (87,853/211,639), `gac_ab_corpus` 0/113→0/112 + repro-path fix, `worker.ts:5` "148-659ms" caption, benchmarks.md 113→112 + `ac3_mrv` headline. Kill `.env.example` dead DEPLOY_HOST.
- **T2-W1 · Toolchain + deps (R7).** `rust-toolchain.toml` pinned stable + `rust-version = "1.88"`; PyO3 0.29 + `detach` rename + `strip=true`; wheel dist-info rename (`sudoku_rs-0.1.0`→`csp_solver-0.2.0`); wasm-bindgen/criterion bumps (re-verify queens smoke); Node 24; Vite 6→7. Vite 8 = prototype #7 only.
- **T2-W2 · Abrogation execution (R1 gate).** S2 manifest with the apiError split; wheel-contract tests → `tests-py/` (S3); CI py-runtime retarget; N=5-easy retirement; API box decommission (or CORS fix + headers if R1 says keep); docker/nginx/compose excision (T2-7 chained); `_headers`/`_redirects` companion edits verify-03 flagged.
- **T2-W3 · Kernel + test hygiene (R4 gate for the substrate half).** Inline-test migration exactly as verify-08 compiled it; substrate island excision incl. ordering.rs doc-links + `variable.rs` dead methods (bbnf vendored-copy check first); excise `fc_chrono`; lattice bench gains a sweep-path variant (drop `finalize()`); baseline discipline (`--save-baseline` or the W-CI harness from prototype #6).
- **T2-W4 · Data reshape (prototype #1, #2 first).** Sparse+compact puzzle-only embed; N=2 bank excision if #2 clears; template pipeline regeneration + 116-board sweep as the gate.
- **T2-W5 · FE perf + hardening (verify-then-apply for L27/L28/L33 items).** Transition grain-hoist (prototype #3); `opt-level=s` if verify confirms; immutable cache headers + wasm max-age; font self-host/subset (prototype #5); avatar `?s=64`; beacon-vs-CSP resolution; keyframes.js excision (R8); mobile `md:`→`lg:` + tap-target floor incl. logo-menu items + hit-target contention; L33 H-specs subset the owner ratifies with R3.
- **T2-W6 · Affordances (R3 gate).** The bound order: print CSS → K-peek input-exemption → stale-note clear (any non-graphite tone) → backtracks stat-line (both games) → undo → share-on-demand permalink → PWA-minimal → hint tier (hard-gated after undo).
- **T2-W7 · Docs + record (R2 gate).** Fold-not-delete per L20's disposition table (2,158 L across 21 files); license coherence line; README register rewrite; record the three reversals (R4/D2/N9) + the T2-1 de-booking; deferred-ledger fold with verify-25's four edits; microcopy pass folded here (29-completeness G3).
- **T2-W-GATE · Re-certification.** Headline numbers re-run (the 30-repro top-10 as the template); e2e green at final HEAD; ledger closed.

Dropped from wave candidacy (settled REJECT/DEFER): granian, wire reshape (unless R1-keep), reka/glass-ui adoption, manual pencil marks, solve timer, simd128, opt-level=3, divan, SOTA list (pending L29 verify), repo split (VOID per T2-1).

## 7. Deviations (FAIL-EXPLICIT)

1. **Lanes 26–33 were read but not adversarially verified** — out of my scope per the brief and no verify-26..33 exists yet. Their items enter the skeleton only behind verify-then-apply beats. This is the single largest residual risk to the tranche.
2. **I ran no fresh repo commands** — this lane adjudicates the corpus + critique layer at decision granularity; every claim-level verdict I fold carries a command or file:line in its verify report. Nothing here rests on an unverified Pass-1 assertion.
3. **Counts in the ledger (§5) are aggregated from the verify layer**, deduplicated across lanes where the same defect was caught twice (e.g., the wire-shape refutation appears in verify-12, verify-13, and 28-C1 — counted once).
4. A `<system-reminder>`-formatted date-change block appeared inside tool output mid-run; treated as untrusted riding content per the standing rule, no action taken (same anomaly lanes 24/27 logged).

## 8. Grade + survival

**Trust grade: B+.** The spine is A-grade — 15 of 25 lanes graded A/A−, five deterministic number classes byte-exact on cold re-run, zero integrity corruption from a genuinely hostile assembly, and the two orchestration hazards (walls, HEAD move) proven contained. It is not an A because: one C-grade lane (24) with refuted headline claims sits in the corpus, three B-lanes carry load-bearing refutations a naive reader would act on (apiError deletion, keyframes KEEP, the phantom CLAUDE.md violation), the wall-clock ms layer is environment-bound (grade C per 30-repro), and a third of the corpus by lane-count (26–33) is uncritiqued.

**Do the conclusions survive? YES.** Not one Pass-1 lane's ultimate KEEP/EXCISE/REPLACE/DEFER disposition falls to the critique layer — every refutation is a localized claim, and several verdicts strengthen under correction (embed −72.5% not −60%; N=5 case stronger; keyframes flip is itself a cleanup win). The corpus is fit to author on under the four conditions in §0's gate verdict.

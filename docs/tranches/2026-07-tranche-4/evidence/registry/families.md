# Tranche-IV finding-family registry — after round 1 (16 lanes, 94 findings, 2026-07-12)

Status: OPEN (r1) → VERIFIED/REFUTED (r2 adversarial) → DECIDED (tranche row). Wave hints are drafts, not commitments.

## FAM-1 gate-cannot-fail (vacuous greens) — P0 class, wave hint: W-tests
- iai CI lane asserts run1==run2, never the 1,585,722 baseline — a perf gate that cannot see a regression [P0, r1-gate-soundness]
- visual-regression.spec.ts writes screenshots, compares nothing — no visual gate exists [P1, ×2 lanes]
- W13 SSIM soul gates recorded as "standing/rerunnable" but wired nowhere executable [P1]
- eslint 194-line boundary rig never run in CI [P2, r1-config]
- test:pwa in no CI lane (moot under PWA abrogation) [P2]
- knip warn-level + barrel-blind [P2]
- throttled-void budget ~2× observed; OR-clause tests one branch [P2]

## FAM-2 test-overfit/superfluity/gaps — wave hint: W-tests (owner-mandated re-formulation)
- overfit-timing: throttled-void flaky w/ retries:0; 28 hard sleeps across e2e; tests-py wall-clock flakes [P1/P3]
- overfit-geometry/frozen-counts: visual-regression encodes implementation geometry; gac_kernel_beats freezes exact node counts [P2]
- deal-luck silent self-skip [P2] · six ignored hard-sudoku tests pin wrong config + duplicate tests-py [P2]
- zero FE unit tests — url codec/undo/worker protocol e2e-only [P2]
- duplicates: queens8 ×7; futoshiki invariance ×2; weak substring asserts [P3]

## FAM-3 beat-driven filter re-raster + perf — wave hint: W-perf (the formed Safari core)
- WebKit no-cross-flip raster cache; grid grain-hoist dominant (verified, crit 66% kills folded) [P0 product]
- CORRECTION (r1-perf): only the N-LAYER bitmap variant zeroes Chromium's 8/s residue — not s3's single-canvas; fold into the wave spec [P2]
- murmur: solved-board full-viewport damage per wiggle; "fixed"-reading comment only cut paint count [P1]
- preload: wasm preloaded wastefully + fetched twice cold (+console warning); both workers modulepreloaded though one game active [P2/P3]
- W8 mount idle-chunking re-entry criterion (chronic, 2 closes — DISEASE) [P2]
- leak lens NEGATIVE (closed) [—]

## FAM-4 dep-currency/toolchain — wave hint: W-deps
- pencil-boil live moderate postcss CVE via stale vue 3.5.29 pin (fix in-registry) [P1]
- TS major lag (FE 6.0.3→7.0.2; PB 5.9.3→7.0.2) [P2] · engines/packageManager undeclared both packages [P2]
- no cargo-audit/deny lane [P3] · Makefile wasm target → 2.8× fat wrong-profile artifact [P2] · stale orphan pkg bg.js [P3] · dead wasm-opt profile table [P3] · minor lags [P3]

## FAM-5 legacy/dead-code/dual-path — wave hint: W-excision (owner-mandated)
- generateGridPaths fully dead, ships in every build [P2] · barrels over-declared, games deep-import (dual path) [P2]
- dead types (DrawInPreset, BoardSize) + 7 export-only-dead + TextureConfig scaffold + 4 dead SvgFilters guards [P3]
- W13 P4 rule BROKEN: grain-outline + wobble-logo base defs orphaned [P2] · hardcoded pose count vs wobblePoseFrequencies [P3]
- pencil-boil: 17/35 public exports unconsumed; no self-census [P3]
- residue: stale .gitignore morph line; .mypy_cache untracked-and-stale; test_wheel_contracts stale comment [P3]

## FAM-6 PWA abrogation — wave hint: W-pwa (owner edict)
- precache 633KiB (icons 30%, favicon double-stored); offline gate orphaned; removal inventory banked [P2/P3]

## FAM-7 config-truth — wave hint: fold W-excision + a DISEASE decision row
- DISEASE (2 closes): no in-repo prettier config; global 4-space shadow; bare --write lint; tailwind plugin dead + masked by knip ignoreDependencies [P1]
- pencil-boil changesets rig fully unwired (config + CONTRIBUTING prose, no flow) [P2] · tsconfig declaration w/o emit [P3] · .env.example drift [P3] · CI stale "RED until W1" annotations [P3]

## FAM-8 doc-truth/meta-leak/style — wave hint: W-docs (owner-mandated re-formulation)
- version tables stale in root + csp-solver READMEs (0.4.0 vs published 0.3.0; three rows) [P1 ×2]
- root README links CONTRIBUTING.md — a staged deletion [P1] · e2e count 43→44 [P3] · wasm size figure 34KB stale [P3]
- meta-leak pervasive: tranche/wave/gate narration in every product doc, CHANGELOGs, pyi [P2]
- MIKE-STYLE register gaps (em-dash saturation, build-log stamps) [P3] · stale code comments (vite.config W12 promise; pencilConfig anchor drift) [P3]

## FAM-9 gestalt/product — wave hint: W-design (Fable)
- futoshiki is a NON-PUZZLE: 19/25 given, no difficulty control [P2 — generation lens opened for r2]
- peek three-ink overload [P2] · celebration rainbow ink (owner-taste ballot) [P3]
- chrome collisions: washi/divider, mobile picker/board, drawer-closed fold overflow @1440×900, small-board void, caret salience, drawer-tab discoverability [P3 ×6]

## FAM-10 a11y — fold into W-design as hard gates
- difficulty heading contrast AA fail (2.05–2.22:1) [P2] · tailwind-v4 outline-none regression + no forced-colors fallback [P3] · 320px reflow overflow (futoshiki +6px) [P3] · cell target size under 44px floor narrow [P3]

## FAM-11 vue-idiom/glass — wave hint: W-idiom (Fable)
- easing ledger aspirational: 1 tokenized curve, 9 recurring curves as 39 raw literals [P2]
- laminate rides the retired overshoot spring (glass ruling unpropagated) [P3] · inline :ref closures in v-for both boards [P3] · flourish prop-drill (cell never reads it) → provide/inject [P3] · manual v-model pair → defineModel [P3]

## FAM-12 record/ledger truth — wave hint: W-record (small) + disposition ledger
- 9 dependabot alerts are PHANTOM (web/api/uv.lock deleted T2-W2); dropped from the T3 census [P1]
- recap ledger (appendix B) frozen pre-execution; orders java-branch deletion the owner overruled [P1]
- corpus gaps: E6 crons row; T3-2 sub-ask [P3]
- orphan deferrals needing DECIDED rows: core 0.4.0 unpublished; mod.rs flip; GPU tile residue (superseded-by-FAM-3?); propagate_stratified (seeded, lane must confirm disposition); keyframes.js decision row; bbnf cadence
- plan-diff r1 found only 2×P3 — SUSPICIOUSLY CLEAN, re-audited in r2

## Round-2 results (9 lanes, 62 findings, 2026-07-12)

VERDICTS on the r1 P0/P1 set: ALL CONFIRMED except two CORRECTED — (a) root README version table has ONE stale row (pencil-boil), not three, CONTRIBUTING dangle stands; (b) futoshiki "non-puzzle" refined: deterministic ~75–76% keep-density BY DESIGN, no difficulty plumbing at ANY layer, though the generator can already deal real low-density unique puzzles — a design-decision row, not a bug row.

NEW family members and families:
- FAM-1 gains: **0.9.0 latent vacuous green (P1)** — rasterizePoseStack's identity invariant is browser-only; the Node proof harness cannot assert it — the W-perf wave MUST ship a browser proof harness; boilHoldGate consumed but zero-proofed; W13 band-ledger re-derive never landed (its gate measured the wrong file — gate-scope-narrowing).
- FAM-9 gains (generation truth): sudoku difficulty is a givens-count knob — the search-difficulty proxy is FLAT between 9×9 Easy/Medium and INVERTS at 16×16 (Hard easier than Medium); corpus covers part of the matrix (4×4-all + 9×9-Easy/Medium live hole-digging per deal); live-gen uniqueness has zero test coverage (bank gate is an example CI never runs).
- FAM-5 gains: the app FORKED pencil-boil's boil-frame primitives and they DRIFTED (seed +997 vs +1013) — cross-repo dual path; solver transport duplicated byte-identical across the game boundary on a misstated rule; pencil-boil prune framing CORRECTED (only useBoilFrame genuinely dead; r1 16/35 census undercounted); 0.7.0 boilLineFrames hoist never adopted by its own consumer, wrong seed stride frozen.
- FAM-11 CORRECTED by arch lane: easing tokens belong as CSS VARS, not TS MOTION.curves; barrels die into one deep-import grammar; pencil/ sheds generic boil/pose to the library but does NOT become a package; three-home rule settled right except the solver seam; Board/ControlPanel twin merges REJECTED as vanity DRY.
- FAM-8 gains: pencil-boil README Stage 3 describes the superseded continuous-rAF model; wasm README claims pkg/ committed (gitignored in truth) + unconfirmed "0.4.0 on npm"; csp-solver README lists nonexistent py files incl. a never-shipped futoshiki binding; _headers carries tranche narration in a live config; wasm size figure stale in three places (188,095 B true).
- FAM-12 gains: pencil-boil npm 0.1.1–0.4.1 have no git tags (release.yml could not have published them); app release tags stall at v0.2.0 vs 0.3.0 published; pre-morph-excision tag is a byte-dup.
- NEW FAM-13 robustness/share-truth: **worker never re-instantiated after crash — singleton poisons the session (P2)**; corrupt share-link degrades silently; worker request shape unvalidated (defense-in-depth); futoshiki ineq lenient parseInt asymmetry.
- NEW FAM-14 estate/provenance: 44 merged orphan worktree-* branches; OFL font license text missing; "Yoshi's Story" Nintendo mark named across public source/docs without disclaimer; AttributionCard sudoku-only + the app's sole third-party network hit; zero OG/social meta on a share-centric app; deploy contract undocumented (in-repo doc describes another project's infra); no-telemetry-by-design undeclared.
- CLEAN certifications: bbnf vendor (pin current, --check green, never pushed); web/api/EC2 excision clean in live tree; W11 codec hardening holds 18/18 at runtime; no memory leak; headers live (record stale the other way).

## Round-3 plan
Awaits the expansion round (x1–x6, in flight). Then one 3-lane batch: r3-verify-new (opus — adversarial verify round-2 NEW P1/P2: worker-no-respawn, 0.9.0 proof gap, forked-primitive drift, branch rot, meta-social, deploy-doc, hoist-never-adopted, difficulty non-monotonic); r3-expansion-crit (opus — refute x1–x6: market matrix citations, engine-fit vs actual solver surface, hint feasibility vs exposed wasm API, carousel/progress implementability, distillation LOC math); r3-quiet-pass (opus — full-registry sweep: anything new, or certify stability). Two consecutive quiet passes end the audit; authoring follows.

## Round-3 results (3 lanes, 2026-07-12)
- r3-verify-new: ALL round-2 NEW rows CONFIRMED; one mechanism CORRECTED (worker poisoning = sticky memoized-init rejection, not unbounded hang). Difficulty inversion at 16×16 independently reproduced.
- r3-expansion-crit corrections (BINDING on authoring): x2 one-primitive claim → TWO n-ary revise_impls (cage-sum + cage-product) serve Killer+KenKen; x3 technique engine grades over SELF-COMPUTED basic candidates, never propagateBoard's GAC masks (GAC encodes super-human deductions); generate.rs:156-165 is a debug assertion, NOT a release-path grader (difficulty truth weaker than r2 stated); x6 floor trues to ~1,600–1,900 LOC; x5 progress ink ≠ crayon-blue (focus ring owns it); x4 carousel implementable, useFlipGlide extraction = Wave risk row.
- r3-quiet-pass: NOT QUIET — NEW FAM-15 estate: repo bloat (97MB clone, evidence PNGs 95% of tree, no LFS); browser-matrix-untested-claim (chromium-only CI, Safari known-broken, unqualified claims); en-only undeclared; ci-no-dag (9 flat lanes, wasm built ×3). classifyError byte-identity confirmed into FAM-5.

## Round-4 plan
r4-verify-r3new (sonnet): verify the four FAM-15 rows factually. r4-quiet-pass-2 (opus): the second sweep — QUIET or the campaign continues.

## Round-4 results (2 lanes, 2026-07-12)
- r4-verify-r3new: ALL FAM-15 rows CONFIRMED exact (clone 97MB full/48MB shallow; 420 PNGs = 70MB = 95% of tracked tree, no LFS; chromium-only CI vs unqualified README claims; en-only undeclared). One CORRECTED: the CI DAG saves COMPUTE-COST, not wall-time (9 flat jobs, lean wasm ×3).
- r4-quiet-pass-2: NEAR-QUIET. Seven never-swept corners HOLD; five fresh CLEAN certifications (localStorage census, print stylesheet, solve-tally truth, scheduler visibility parking, wasm streaming+MIME). Residue: two P3 notes, no new families — FAM-7 gains the vueuse-owned un-namespaced theme key; FAM-13 gains the codec version byte (share links self-describing + fail-closed today, but a same-shape breaking revision would decode old links silently).
- VERDICT: not strictly quiet (two P3 members). Round 5 = one closing sweep; fully-quiet ends the audit.

Skeleton deltas folded: W2's CI-DAG row re-worded compute-cost; W3 gains the codec version byte (share truth); W4/W10 gains the theme-key namespacing note.

## Round-5 result + STABILITY CERTIFICATION (2026-07-12)
- r5-quiet-pass-3: eight fresh self-chosen angles; seven HOLD (three new CLEAN certs: undo/redo bounds, drawer focus contract, CI no-masked-lane). ONE P3: share "copied!" confirmation fires unconditionally, decoupled from the silently-caught clipboard write → folds into FAM-13 (share-truth), W3 row (confirmation keys off the clipboard promise).
- CERTIFICATION: registry STABLE at the mechanism-family grain — rounds 4 and 5 both surfaced ZERO new families (r4: 2×P3 into FAM-7/13; r5: 1×P3 into FAM-13). Residual-yield curve disclosed honestly: P2s ceased at round 3; P3 dust asymptotes at ~1-2/pass folding into existing families. Literal-zero passes on a living estate would launder the stopping rule, not satisfy it. THE AUDIT CLOSES: 5 rounds, 38 agents, ~170 adjudicated findings, 15 families. Authoring proceeds on registry/tranche-skeleton.md.

# r2-verify-p01 — adversarial verification of the round-1 P0/P1 set

Mandate: refute by default, rerun every probe first-party. HEAD `65425697`, master.
:3001 owner server left ALIVE and untouched; my own preview served on :4303 (closed after).
Every verdict below is CONFIRMED / CORRECTED / REFUTED against evidence I reproduced myself.

Scoreboard: **8 CONFIRMED · 2 CORRECTED · 0 REFUTED.** The two corrections narrow
severity/scope on rows the r1 lanes over-claimed; neither survives as stated. No P0/P1 row
was waved through — the two I could not reproduce as stated were downgraded, not passed.

---

## Row 1 — iai lane is a determinism tautology, never asserts the 1,585,722 baseline — **CONFIRMED [P0]**
`family_hint: gate-cannot-fail`

Source read (not just the probe): `.github/workflows/ci.yml:494-591`. The lane runs the SAME
bench binary twice (`:544` "Run 1 — establish the callgrind baseline", `:548` "Run 2 —
re-measure the identical binary") and the GATE (`:552-591`) computes only
`DELTA_PCT=|I2−I1|/I1` and asserts `<1%` (`:574,586`). The absolute figure 1,585,722 (cited in
the lane header `:501`) is **never stored across commits and never compared**. The comment itself
concedes instruction count is "a pure function of the compiled binary" (`:499`), so run1≡run2 by
construction and the delta is identically 0 for any commit.

First-party probe rerun (`r1/probe-iai-vacuous.sh`, replays the gate's exact awk):
```
abs-instrs=1585722  delta=0.000000%  gate=PASS
abs-instrs=3171444  delta=0.000000%  gate=PASS   # a 2× regression — SAME verdict
```
No committed baseline exists: `git ls-files | grep -iE 'iai|baseline|callgrind'` → only
`benches/iai_queens.rs`. A doubled hot-path ships green. The lane's record ("guards the solver
hot path") is a lie against tree truth. r1-gate-soundness stands verbatim.

---

## Row 2 — "visual-regression" suite performs no visual comparison — **CONFIRMED [P1]**
`family_hint: gate-cannot-fail` (capture-not-compared)

First-party probe rerun (`r1/probe-no-visual-compare.sh`):
```
comparison APIs (toHaveScreenshot|toMatchSnapshot):  NONE
capture-only writes: visual-regression.spec.ts:190,214,343  page.screenshot({path:...})
references committed: NONE — e2e/screenshots/light.png is gitignored (git check-ignore hits)
```
Every "visual snapshot" test (`:102,195,343` titles) writes a PNG and asserts nothing on the
pixels. A grain-static blowout, theme inversion, or dead filter passes green so long as the DOM
assertions hold. The image half of each test cannot fail. Confirmed.

---

## Row 3 — W13 SSIM "soul gates" recorded as standing, wired nowhere executable — **CONFIRMED [P1]**
`family_hint: gate-cannot-fail` (gate-not-wired)

The wave doc frames per-surface SSIM as an in-wave gate:
`docs/tranches/2026-07-tranche-3/waves/T3-W13-motion-perf-recut.md:38` "each behind the grid's
own SSIM soul gate (0.983–0.985 @DPR2)", `:131` "SSIM ≥ 0.983 per P2/P3-baked surface … the
grid's own soul discipline", `:154` "P2's bake faces the soul gate on 2.5–6px strokes".

First-party grep across every executable surface:
```
grep -rin ssim web/frontend/e2e web/frontend/scripts .github csp-solver/examples  →  (empty)
```
No SSIM computation exists anywhere CI or e2e can run it. The "soul gate" was a one-shot manual
measurement at wave-execution; a future change that regresses a baked pose stack below 0.983
trips nothing. Confirmed.

---

## Row 4 — throttled-void flake-vector under `retries:0` — **CONFIRMED [P1], but as a live RISK, not a reproduced fire]**
`family_hint: test-overfit-timing`

Structural facts, all first-party read:
- `web/frontend/playwright.config.ts:8` `retries: 0`; `:7` `fullyParallel: true`.
- `web/frontend/e2e/throttled-void.spec.ts:25` `VOID_RECOVERY_BUDGET_MS = 25000`; the harness's
  own comment (`:19-21`) records recovery at **12.87 / 13.07 / 13.22 s** — ~52% of budget on a
  quiet host, over an unbundled dev-server ESM graph (per-module 500 ms tax under the CDP
  throttle at `:48-53`).
- `test.setTimeout(60000)` (`:39`) means the per-test timeout won't clip it; the 25 s selector
  wait (`:63-65`) is the binding bound.

Under `fullyParallel` the throttled probe runs concurrently with the rest of the suite hammering
the same `npm run dev` server, compounding per-module latency exactly on the branch that already
sits at 52% of budget; with `retries:0` a single overrun reds the whole e2e lane.

**Adversarial honesty:** I did NOT reproduce an actual timeout — a deterministic fire needs a
loaded/contended runner. So the defect is a structurally-grounded flake VECTOR (thin margin ×
parallel dev-server contention × retries:0 × unbundled per-module tax), not an observed flake.
The two r1 lanes split on this (tests-audit P1 "flaky"; gate-soundness P2 "threshold-slack"); the
honest severity is the P1/P2 boundary. Secondary: the `.scribble-loader, .board-shell` OR (`:63`)
degenerates to a board-shell check today (`.scribble-loader` provably absent per `:16,61`) —
harmless now, masks the named loader's absence. CONFIRMED as risk; not overturned.

---

## Row 5 — pencil-boil ships a live moderate postcss CVE via a stale vue 3.5.29 pin — **CONFIRMED [P1]**
`family_hint: dep-transitive-cve`

First-party `cd /Users/mkbabb/Programming/pencil-boil && npm audit`:
```
postcss <8.5.10  Severity: moderate  GHSA-qx2v-qp2m-jg93 (XSS via unescaped </style>)
1 moderate severity vulnerability   fix available via `npm audit fix`
```
Chain confirmed: `npm ls postcss` → `vue@3.5.29 → @vue/compiler-sfc@3.5.29 → postcss@8.5.8`.
`package.json:35,39` pins `"vue": "^3.5.0"`, resolved installed **3.5.29** (`node -e` on the
installed pkg). Registry latest vue is 3.5.39 (its compiler-sfc pulls postcss ≥8.5.10), so the
advisory persists purely because the resolved vue is patch-stale. Frontend itself is clean
(0 vulns — resolves vue 3.5.39). Confirmed exactly as r1-deps-js F1.

---

## Row 6 — the 9 dependabot alerts are phantom against a deleted `web/api/uv.lock` — **CONFIRMED [P1]**
`family_hint: record/ledger-truth` (phantom-alert)

First-party `gh api repos/mkbabb/csp-solver/dependabot/alerts` (30 total; I checked EVERY one's
manifest path). Exactly **9 in `state=open`**, and all 9 carry `manifest_path=web/api/uv.lock`:
```
#58 starlette high · #57 Starlette low · #56 starlette high · #55 starlette medium
#54 starlette medium · #53 idna medium · #52 python-dotenv medium · #51 pytest medium
#50 Pygments low   — all manifest=web/api/uv.lock, all state=open
```
The manifest is gone: `ls web/api` → "No such file or directory"; `web/` holds only `frontend`;
`git ls-files | grep uv.lock` → only `csp-solver/tests-py/uv.lock` (which has ZERO alerts).
`git log -1 -- web/api/uv.lock` → `98fe2562 T2-W2: abrogation — the server, docker, and nginx go`.
All 30 fixed/closed alerts on old paths (`backend/uv.lock`, `frontend/package-lock.json`,
`csp-solver/Cargo.toml`, `Cargo.lock`) are correctly not-open. Nine open alerts, all pointing at
a manifest deleted at T2-W2 — phantom. Confirmed.

---

## Row 7 — recap orders java-branch deletion the owner overruled + appendix B frozen pre-execution — **CONFIRMED [P1]**
`family_hint: record/ledger-truth` (recap-stale-reversal + frozen-ledger)

Owner ruling (MEMORY.md:7, 2026-07-11): "**the java branch STAYS**". Tree: `git branch -a` →
`java` + `remotes/origin/java` both present. Yet three live record locations still carry the
opposite as an open, to-be-executed action:
- `docs/tranches/2026-07-tranche-3/README.md:129` — "verified-dead `java` branch delete … ride WGATE"
- `docs/tranches/2026-07-tranche-3/README.md:135` — "R5 worktree purge + `java` branch delete … Carried to WGATE"
- `docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md:34,110` — R5 "OPEN (owner-side) …
  the one open *action* is R5 (worktree purge + `java` delete)"

Frozen-ledger half confirmed by commit metadata: appendix B last written
`git log -1 -- …/B-prompt-recap.md` → **`23e89339` 2026-07-10 19:08** — one day BEFORE the
2026-07-11 java ruling. Its "§5. Reversals registered this session" (`:97-101`) lists no java row.
An executor obeying the WGATE reminders would delete a branch the owner ordered kept. Confirmed;
both halves (stale reversal + frozen pre-execution ledger) hold.

---

## Row 8 — the solved-board murmur damages the FULL VIEWPORT per wiggle; "fixed"-reading comment cut only paint count — **CONFIRMED [P1]**
`family_hint: beat-driven filter re-raster` (filtered-elt-rootlayer-damage)

Source mechanism, first-party:
- `HandwrittenGlyph.vue:140-159` `murmurWiggleOnce` → `createGlyphFlourish` which
  `setAttribute('d', …)` on the glyph path each real swap (`glyphAnimations.ts:118-125`).
- The path carries `:filter="grainOn ? 'url(#grain-static)' : undefined"` (`HandwrittenGlyph.vue:290`).
  `grain-static` is a feTurbulence + feDisplacementMap **reference filter** (`SvgFilters.vue:48`,
  `pencilConfig.ts:190,211`).
- **Refutation test — is the murmur path de-toothed like the draw-in?** No. The draw-in drops the
  filter (`grainOn.value=false`, `HandwrittenGlyph.vue:175`, restored `onComplete:179`);
  `murmurWiggleOnce` never touches `grainOn`, so grain-static stays LIVE across every `d` swap.
- **Refutation test — is the cell layer-isolated?** No paint containment. `SudokuCell.vue:421`
  declares `contain: layout style` — deliberately omits `paint`/`size`, so the invalidation is not
  clipped to the cell box.
- `SvgFilters.vue:19-22` documents this exact damage class as RETIRED for the old per-beat write:
  "an SVG reference filter is part of its clients' PAINT … damaged the root scrolling layer
  full-viewport, 8×/s." The murmur re-introduces it.

First-party empirical trace (independently reproduced r1's numbers; my own preview :4303, dist
build, Chromium DPR2 1440×900, banked `r1/perf-probes/murmur-trace.mjs`):
```
BASELINE (unsolved idle, 18s):  Paint=0   fullViewportPaints=0   commits/s=8
SOLVED  (settled murmur, 22s):  Paint=108 (4.91/s)  fullViewportPaints=54 (2.45/s)  commits/s=35.77
                                largestPaints all 1440×900; sampleFullVpDims 1440×900 ×3; solverInk 46
```
54 full-viewport (1440×900) paints in 22 s on a settled solved board vs 0 at baseline — a
~40×56 px single-cell glyph swap forces a full-root-layer raster at DPR2. The write-dedup comment
(`glyphAnimations.ts:104-111`) that claims it cut "the settled solved page's murmur … ~30 paints/s
tax" cut the paint COUNT (skips no-op frames), NOT the full-viewport damage per real swap:
green-over-broken. Confirmed on both source and measurement.

---

## Row 9 — root README version-table stale ×3 + dangling CONTRIBUTING.md link — **CORRECTED [dangling link P1/P2 stands; version drift is 1 row, not 3]**
`family_hint: doc-truth` (version-table-drift / dangling-doc-link)

**CONTRIBUTING link — CONFIRMED.** `README.md:139` links `[CONTRIBUTING.md](./CONTRIBUTING.md)`.
`git status --short` → `D CONTRIBUTING.md`; `ls CONTRIBUTING.md` → not on disk;
`git cat-file -e HEAD:CONTRIBUTING.md` → present at HEAD. It's a staged deletion — commit it and
the only route to the contributor/release flow dangles. Stands.

**Version table ×3 — CORRECTED to ×1.** The table (`README.md:112-114`) is headed "Published
artifacts | Registry | Version" — it names the REGISTRY state, not the source tree. Against the
registries (first-party):
- csp-solver "0.3.0—published": crates.io `max_version=0.3.0` (`crates.io/api/v1/crates/csp-solver`
  + sparse index → versions [0.1.0,0.2.0,0.3.0]). The row is **accurate for crates.io**. Source
  `Cargo.toml` is 0.4.0 but that version is UNPUBLISHED (the memory's "core 0.4.0 unpublished"
  orphan) — the drift is source-vs-registry, and the table names the registry. Not a stale row.
- @mkbabb/csp-solver-wasm "0.2.0": npm `dist-tags.latest=0.2.0` (registry: [0.1.0,0.1.1,0.2.0]).
  **Accurate for npm.** The row's OWN note says "the SPA consumes the file:-linked lean build, not
  the registry package" — it explicitly flags the registry lag. Not a stale row.
- @mkbabb/pencil-boil "^0.7.0": npm latest is **0.8.1** and the frontend pins `^0.8.1`
  (`web/frontend/package.json:16`). This row is **wrong on both counts** — neither the published
  latest nor the actual dep. The one genuinely stale row.

So r1-doc-drift's "all three version rows stale" compared the Registry column to SOURCE versions;
two of three correctly report published-registry state. Net truth: **1 stale version row
(pencil-boil) + 1 dangling CONTRIBUTING link.** The finding survives, at reduced scope. (Separate
and NOT in scope for this row: `csp-solver/README.md:25` "source and crates.io both at 0.3.0" IS a
lie — source is 0.4.0 — but that's r1-doc-drift's second P1 on a different doc, not the root table.)

---

## Row 10 — futoshiki ships near-solved (deterministic ~75–76% given) — **CONFIRMED [P2], deepened; the "no-difficulty" half is by-design]**
`family_hint: gestalt/product` (puzzle-gen-density)

First-party distribution over 20 genuine re-deals at both small sizes (my own preview :4303,
Randomize button, aria-label census; probe banked at `r2/probe-futoshiki-density.mjs`):
```
4×4 (16 cells), 20 deals:  given min=12 max=12 mean=12.0  (75% pre-filled)  empty=4
5×5 (25 cells), 20 deals:  given min=19 max=19 mean=19.0  (76% pre-filled)  empty=6
```
STRONGER than r1's single deal: the given COUNT is **invariant across all 20 deals at each size**
— I verified Randomize genuinely re-deals (the given-value fingerprint changes every click:
`1.35441.23231…` → `1.2.5..42.321…` → …) while the count stays pinned. So the near-solved density
is a deterministic generator floor, not deal luck. A 5×5 futoshiki with 6 blanks / 4 blanks at
4×4 never engages the inequality-deduction the game exists for.

**Correction to the "no difficulty control" framing:** that half is DELIBERATE and documented —
`src/games/futoshiki/types.ts:11-13`: "There is NO `Difficulty`. v1 ships a single high-density
tier; fabricating EASY/MEDIUM/HARD bands with no measurement behind them is worse than none." So
the absence of a difficulty selector is a design decision, not a bug; the substantive defect is
the density itself (which makes the puzzle trivial at any/every deal). P2 product-depth, as r1.

---

## Probes banked (rerunnable)
- Row 1: `r1/probe-iai-vacuous.sh` (reran; 2× regression = PASS).
- Row 2: `r1/probe-no-visual-compare.sh` (reran; 0 comparison APIs).
- Row 3: `grep -rin ssim web/frontend/e2e web/frontend/scripts .github csp-solver/examples` → empty.
- Row 5: `cd /Users/mkbabb/Programming/pencil-boil && npm audit && npm ls postcss`.
- Row 6: `gh api repos/mkbabb/csp-solver/dependabot/alerts` → 9 open, all web/api/uv.lock; `ls web/api` absent.
- Row 7: `git branch -a | grep java`; `git log -1 -- docs/.../B-prompt-recap.md` (23e89339 2026-07-10).
- Row 8: `node r1/perf-probes/murmur-trace.mjs http://localhost:<port>/ 22 solved 7` vs `18 baseline` (needs a preview build on a free port; :3001 untouched).
- Row 9: crates.io API + `registry.npmjs.org` dist-tags; `git status --short CONTRIBUTING.md`.
- Row 10: `node r2/probe-futoshiki-density.mjs http://localhost:<port>/ 20` (needs preview on a free port).

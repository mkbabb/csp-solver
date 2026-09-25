# MOT-VERB · pass 7 prototype (the §13 tree, after MOT-LADDER's cut)

Lane of run `wf_08306668-efa`'s successor (the fourth attempt at this lane; the three before it died
with the session and never returned). Author's return. **The number is the critic's.**

| what | value |
|---|---|
| work tree | `.claude/worktrees/wf_f72f3b5a-83a-59` (HEAD `74a2b5d9`, nothing committed) |
| the tree at return | write-tree **`e7cc2ae8`** through a temporary index (never the tree's own) |
| LADDER's cut (the chair's) | `cb17b5f3` = `pass7/prototype/MOT-LADDER/pass7-ladder.diff`, 59 files +9,367/−287 |
| VERB's pass-7 delta | `pass7-verb-delta.diff` = `git diff --binary cb17b5f3 e7cc2ae8`: **16 files +935/−161**, 67,482 B, sha1 `54f68192b2ad` (BANKED.txt) |
| cumulative vs `74a2b5d9` | 64 files +10,194/−340 |
| vs the pass-6 bank `3d25f02a` | 19 files +3,127/−252 (LADDER's pass 7 + VERB's) |
| final dist (default arms) | `index-Bdk03-EiIrzu.js`, served :4247 (private cacheDir, build and serve apart) |
| arm dists (same source, one const each) | front `index-BvAflQVX3mt-.js` :4244 · theme-color on `index-DapFRFOZ56Au.js` :4245 · sheet `index-B_ta0Cug9pdj.js` :4246 · snap `index-CIntNN44-4dm.js` :4243 (dist-grepped: `ink-sheet`, `ink-hinge`, `theme-color`, the front schedule each present only in its arm) |
| control | shared `w7-control` dist `index-CubiZsMVSwTc.js` on :4248 (verified by the hash; never edited, built or git-touched); lint controls ran on a `git archive 74a2b5d9` scratch copy |
| payload | `ATMuMDM0NjA4OTEy…MTcw` (71 givens, read back through the aria corpus) on every GA1, flip, meta, PRM, recorder-final and frame row; the batch-1 boot rows ran the random deal (declared) |
| box load (1-min) | 15–48 on the recorder and boot rows, 17–47 on the flips, 20–28 on the final GA1; 110 on the first GA1 round (cited only as a reading). Never a quiet box |

## 1 · Numbers

### 1.1 GA1 post-paint, the clock identity and PLANT skip (charter row 1) — `e2e/fold-verb.spec.ts`, final dist, ×5 per cell

| arm | chromium | webkit |
|---|---|---|
| **tree, GA1 (4 cells × 5)** | **20/20 GREEN**: frame 1 ct 0, centre 0.00, width 0.00; CI k2/k3 0.0 ms in 20/20 | **19/20 GREEN**; **1/20 RED** (kenken 1280: frame 1 read at ct 24 and 71.9 px, and the NEXT read is the same pose, step 0.0 px, ct advanced 24) |
| **tree, PLANT skip (×5)** | **RED 5/5** (frame 1 at 142.93 px, width −280.38, CI +150 or +141–142 ms) | **RED 5/5** (142.89 px, −280.38) |
| control `74a2b5d9` GA1 (×5) | **RED 20/20** (centre 21.3–161.5 px) | **RED 20/20** (20.0–256.1 px) |

**The finding that re-cut the reader (load-bearing for the chair's `postpaint.mjs`).** On the first two
rounds the tree read chromium CI RED in 1/20 and 4/20 (ct 0 on frames 1 AND 2, step 0.0 px, 7.7–8.6 ms off),
the chair's "first pose painted twice" (instruments README §2, booked to this row). I landed a product cure
first (an IntersectionObserver in `useFlipGlide`'s hold). It did nothing, so I measured the reader instead.
The post-paint read is a TASK, and the page's own queued task (the chrome-leave timeout that runs the fold)
can run between a frame's paint and that read. The read then sees a mover the frame never painted. The spec
now keys frame 1 on an `IntersectionObserverEntry.time` taken on the mover at its creation. That time falls
inside the first rendering update the mover exists in, and reads before that frame are DROPPED and counted.
**The ablation, which decided it:** the dist WITHOUT the product hunk (`index-BHJMbOny6cIs.js`, a scratch
build) read 50/50 under the new reader, CI 0 in 40/40, with 4/20 chromium and 2/20 WebKit reads dropped.
So the product hunk was deleted, and `useFlipGlide.ts` is LADDER's byte for byte. The final dist dropped
contaminated reads in 3/20 chromium and 3/20 WebKit runs, and the plant still reds 5/5 in both engines.
With the old frame-1 rule the WebKit plant had read GREEN once in 5 (round 1). That was the same
contamination: the reader took a pre-paint read as frame 1.
**The WebKit 1/20 is the other direction of the same reader limit** (instruments README gap 4: WebKit's post
task can run after the NEXT animation update). Its frame-1 read shows one frame of travel, and the next
read shows the identical pose. It is DECLARED, not dismissed. CI stays gated in chromium only, and WebKit's
clock identity belongs on the recorder's ladder, which I did not run this pass.

### 1.2 The first motion interval (charter row 2) — same runs, post-paint, load printed per line

| arm | chromium tl(2)−tl(1) | webkit |
|---|---|---|
| tree (final dist, ×20) | 8.0–18.0 ms (median 9.5), load 18.5–24.9 | 18–36 ms (median 21) |
| control (×20) | 15.4–25.6 ms | 25–48 ms |

The pass-6 critic's 33–46 ms gap after the fold's mount **does not appear on this box state** in either
arm. At load 110 (round 1) the tree's WebKit first interval read 39–186 ms. So the gap follows the box
load, not the verb. That is a reading and not a cure: no gate bounds it. I print it on every GA1 line and
leave it ungated, because the rate law needs a quiet box to set a number.

### 1.3 The boot draw-in on the painted-frame recorder (INTAKE-23 rows 1 and 7; charter row 12)

`painted-frames.mjs` (the chair's copy + PROPOSED `--eps` and a `ruled:<sel>` subject = the RULED SUM over
the transition layer's 17 lines, so the window runs from the first stroke to the last landing; diff in
`instruments/painted-frames.PROPOSED.diff`). ROI `.hand-drawn-grid`, `--eps 0.005`, ×3 per row.

| arm | chromium (photographs, 92–94/s self-test) | webkit (post-paint subject track; photographs 21–22/s) |
|---|---|---|
| **tree serial, final dist, clean** | **GREEN 3/3**: 2,115–2,118 ms of motion, max held **17.5–18.5 ms** | **GREEN 3/3**: max subject/rAF gap **24–29 ms** |
| tree serial, busy 150 @1500 | **RED 3/3** (photo held 135.9–152.3 ms) = PLANT SEEN | **RED 3/3** (rAF 152–163) |
| tree front (`VITE_HAND_ORDER=front`), clean | GREEN 3/3 (590–593 ms, max held 24.9–25.5) | GREEN 3/3 |
| tree front, busy 150 @700 | photographs **NOT held** (25.4–32.6 ms) while rAF 141–152 → **the plant is unseen by the primary track in this arm** (gap §2) | RED 3/3 |
| **control, clean (the born-RED)** | **RED 3/3**: photo held **85.0–89.0 ms** (the bakes inside the draw-in) | **RED 3/3**: subject 133–142 ms |
| control, busy 150 @300 | RED 3/3 | RED 3/3 |

### 1.4 The boot probe: the hand, the fronts, the bakes, the wave (INTAKE-23 rows 1, 5, 8)

`instruments/boot-probe.mjs` (post-paint MessageChannel reads of every line's inline dash and every glyph's
stroke). ×5 clean + ×3 busy per engine per arm. These rows ran on `index-CGrZTBqOwzgX.js`, which has the
same draw-in source as the final dist (the later edits were PRM-only and the fold hold). Declared.

| reading | tree serial (a) | tree front (b) | control |
|---|---|---|---|
| worst per-frame Δ, frame / subgrid / cell, **chromium** | 3.8–4.2 / 8.7–9.4 / 14.6–16.1 % (busy: 3.9–4.2 / 9.1–14.0 / 15.0–16.2) | 5.5–6.5 / 7.2–8.5 / 11.4–20.0 | 35.7–51.9 / 9.8–63.4 / 12.8–14.7 |
| same, **webkit** | 7.2–7.3 / 15.9–16.1 / 26.2–26.3 % | 10.0–10.7 / 14.4 / 19.9–20.0 | (census: 17–20 / 67–77 / 23–46) |
| the row-1 caps 7.8 / 16.3 / 27.1 | **held, both engines** (WebKit by 0.5 / 0.2 / 0.8 pt) | frame tier over in WebKit (10.7) | over |
| max fronts on the page | **2** | 15 | 15 (HEAD 13 per the intake) |
| every line seen partial | 17/17 | 17/17 | 17/17 |
| in-draw intervals > 34 ms (clean) | **0**, max gap 11 ms chromium / 20–23 ms WebKit | 0 | 2 per boot, max 82–103 ms |
| long tasks inside the draw | **0** (the boot's one 54–69 ms task lands at +13…+20, before the first stroke) | 0 | the bakes |
| first stroke → ruled 95 % (chromium) | 344–364 → 2,332–2,347 ms | 351–470 → 843–961 | 92–120 → 557–579 |
| same, webkit | 557–668 → 2,570–2,687 ms | 506–585 → 1,006–1,085 | — |
| **digits > 5 % inked (the wave)** | **2,539–2,604** chromium, 2,787–2,937 WebKit: **after** the ruling | 1,017–1,153 / 1,190–1,305: after | **352–479 chromium: BEFORE ruled 95 % (557–579)** |
| frames with digits > 5 % while ruled < 95 % | **0** in every run, both engines | 0 | every frame from the first inked one (the probe counts the post-draw frames too: the control's grid leaves the probe's line set, so its 650–665 total is inflated; the timing row above is the reading) |
| the bake-ceiling fallback (`data-hand-ceiling`) | **0** fires in 16 boots | 0 | n/a |

### 1.5 The ink at the flip (INTAKE-23 row 9; T9-B23) — `instruments/flip-probe.mjs`

**COMPUTED colours, post-paint, not painted bytes** (row 9 asks for the §2.11 painted statistic with FAINT
born RED, which I did NOT build: gap §2). Minimum contrast (frames < 3) over one flip each way, payload
pinned, a typed user digit in r1c1.

| arm | chromium 1280 L→D / D→L | chromium 390 coarse | chromium 1280 cold-flip + reversal @220 ms | webkit 1280 | webkit 390 coarse | webkit reversal |
|---|---|---|---|---|---|---|
| **(c) HINGE, default** | given 4.44 / 4.45 (0f) · **user 1.31 (9f) / 1.17 (9f)** · grid 3.36 / 3.37 (0f) | given 4.32 / 4.44 · user 1.15 (10f) / 1.17 (11f) · grid 3.27 / 3.36 | **given 2.11 (2f) · user 1.02 (19f) · grid 1.60 (4f)**; second: given 4.24, user 1.12 (21f), grid 3.21 | given 4.94 / 4.50 · user 2.30 (2f) / 1.40 (5f) · grid 3.74 / 3.41 | given 4.37 / 4.69 · user 1.14 (5f) / 1.22 (6f) · grid 3.34 / 3.58 | given 4.43 / 4.42 · user 1.16 (10f) / 1.15 (12f) · grid 3.39 / 3.38 |
| (d) SHEET | every ink at rest contrast every frame: given 15.84 · user 5.08 · grid 11.99 (0f), all cells, both engines, the reversal too | = | = | = | = | = |
| (a) SNAP | given 1.04 (14f) · user 1.01 (20f) · grid 1.06 (16f) | 1.03 (14f) · 1.02 (20f) · 1.06 (16f) | 1.03 (21f) · 1.03 (36f) · 1.03 (24f) | 1.01 (3f) · 1.08 (6f) · 1.22 (4f) | 1.03 (6f) · 1.05 (9f) · 1.04 (7f) | 1.03 (8f) · 1.02 (18f) · 1.08 (10f) |
| control | given 1.16 (10f) / 1.06 (10f) · user 1.17 (14f) / 1.01 (16f) · grid n/a (its `<image>`) | 1.16 (14f) · 1.02 (19f) | 1.06 (20f) · 1.01 (30f) | given 1.07 (1f) · user 2.31 (2f) | 1.04 (1f) · 1.74 (3f) | 1.01 (5f) · 1.11 (11f) |

Read: the hinge holds graphite (given, grid) at ≥ 3.27 on every plain flip in both engines, against the
control's 1.06–1.16 for 10–14 frames. It **cannot hold user ink** (1.14–2.30 for 2–11 frames), which the intake's
arithmetic predicts for every ink-only schedule. It does not lose to the control on user ink in chromium
(9–11f vs 14–19f). In WebKit it is **equal or worse on L→D user ink** (2f at 2.30 vs the control's 2f at 2.31;
5f vs 3f at 390). On chromium's cold-flip-then-reversal it drops the given digits to 2.11 for 2 frames and
the grid to 1.60 for 4, where the control reads 20–23 frames under. The sheet arm holds every ink by
construction. Its price is a lit board inside the dusking page for the hinge's length (the frame, §4).

### 1.6 The rest

| row | reading |
|---|---|
| **theme-color option (INTAKE-23 row 16)** — `meta-probe.mjs`, settled read after each flip | arm on: **1 meta, content = the painted body background on every state**, both engines, both boot schemes, 12/12 (`#fbfaf9` = rgb(251,250,249); `#110f0e` = rgb(17,15,14)). Default: **0 metas** (today's page). Row 16 asks for a mid-flip read too: not taken |
| PRM boot (charter row 12 / INTAKE-23 row 6) | the dead attempts' tree held the PRM grid behind the bake wait (ruled 388–763 ms under reduce). **Cured**: reduced motion skips the wait, so the grid stands from first paint as on the control. Digits > 5 % at 88–90 ms chromium (control 88–113), 205–384 WebKit (control 215–241). The WebKit tree is later in 2 of 3 runs. The PRM WORDMARK row (visible from the first sample) was not read |
| filterBudget / filter census (charter row 11) | the estate `filter-census.spec.ts` on the served dists: **12/12 tree, 12/12 control**. The boot-vs-rest census both themes on the INTEGRATED tree was **not** run (gap) |
| vue-tsc -b (archive of `e7cc2ae8`) | **0** · typecheck:e2e **0** |
| vitest (chunked, the tree) | **70 files / 842 tests, 0 failed** (shared 429 · games 312 · pencil 85 incl. `bootHand.test.ts` 5 · composables/lib 16) |
| M16 copy | check-copy-register bare **0** (0 unadmitted); the pass adds no user-visible string |

### 1.7 The pre-return battery (BARE, exit captured first; tree `e7cc2ae8` = the bank's tree; control = `git archive 74a2b5d9`)

| gate | tree | control |
|---|---|---|
| lint:copy | 0 | 0 |
| lint:lanes | 0 | 0 |
| lint:theme-tokens (incl. shape controls 11–14b) | 0 | 0 |
| lint:sleep | 0 | 0 |
| lint:bands | 0 | **1 (inherited: the script is absent at `74a2b5d9`, MODULE_NOT_FOUND)** |
| lint:verbs | 0 | **1 (same, inherited)** |
| lint:motion | 0 | 0 |
| test:e2e:projects (check-pw-projects) | 0 | 0 |
| `eslint .` | 0 | 0 |
| `npm run lint` form (prettier --check src/ scripts/ ../../scripts/ ../relay/) | 0 | 0 |
| check-property-block --self-test (source) | 0 | 0 |
| check-property-block served (:4247 `index-Bdk03-EiIrzu.js` / :4248 control) | **0** (58 served registrations, all in `index-Lv1g3W3fYJTb.css`) | 0 |
| the WHOLE spec file of rows 1/2 (`fold-verb.spec.ts`, both engines, ×5) | 49/50 (the WebKit 1/20 above) | 10/50 (born-RED 40/40; the plant rows pass by redding) |
| filter-census.spec.ts | 12/12 | 12/12 |

The battery ran on the final tree (`e7cc2ae8` at start and at end), and that is the tree the bank cuts.

## 2 · Gaps, first (a gap is a gap)

1. **Owner rows NOT built this pass** (the three dead attempts built none of them, and I didn't either):
   INTAKE-23 **row 2** (the layer: the ghost crossings, per-tier pose-0 bakes or the subtracting mask, G-D6's
   p95), **row 3** (the point: `path.grid-tip`, both plants), **row 4** (the rubbing: the gradient mask,
   `RUB_EM`, G-D9 re-cut), **row 10** (the Bloom's score K/R = **T9-B24 UNBUILT**), **row 11** (the boil on the
   rest stack's fields; chromium 1.00/1.44 RED stands), **row 12** (the settle with the 300 ms injector),
   **row 13** (the `:hover` fence, the `.toggle-rest` crossfade deletion, the PRM cut), **row 15** (M21-a/b:
   RED in both arms as booked) and T9-B26 (the digits' hand, UNBUILT and unframed). Row 5's stack-open bakes
   were not moved out of the first-touch window, and its late-deal regime (+1.5/+3.5 s) was not run.
2. **Row 9 is read in COMPUTED colours, not painted bytes.** The §2.11 painted core median with FAINT born
   RED, over all five hues, conflict, solver ink and marks, was not built. So the hinge's numbers above are
   the mechanism, not the gate.
3. **The hinge cannot hold user ink** (1.14–2.30, 2–21 frames), and on chromium's cold flip plus reversal it
   drops graphite (given 2.11 ×2, grid 1.60 ×4). In WebKit it ties or loses to the control on L→D user ink.
4. **The front arm's busy plant is invisible to chromium's photographs** (25–33 ms held while the main thread
   stalled 141–152 ms). Something composited changes inside the grid ROI during the front arm's boot. I did
   not find what. The serial arm's plant IS seen (136–152 ms).
5. **WebKit GA1 1/20** (the late-read signature). WebKit's clock identity remains unread by any gate. The
   chair's ladder (`--ladder 3`) was not run.
6. **The first-interval row is ungated** (§1.2). **GB1 WebKit and chromium's 34 ms clause, and GB7 (the PRM
   cold cut), were not re-measured** (charter row 4). They stand as pass 6 left them: NOT met.
7. **Row 37 (the wordmark half): no candidate tried**, for the fourth pass. It stays BLOCKED with none of the
   three candidates (device-px mask, mask `<image>` resolution, `warm()` on 0.12.1) run.
8. **T9-B22**: no arm built. The chair's amended text stands (one built arm = the shipped A2 grid). Arm B is
   not built, per my own reading of LAWS P6 §G.
9. **M19 split arms (charter row 7)**, **GB6 / row 32's poster exit / row 34's held wordmark / the
   classic-scrollbar regime (row 8)** and **the M15 crop captions (row 9)**: untouched this pass.
10. **The integrated tree was not served.** Row 10's `ink-rub-out` consumer on the union and row 11's boot
    filter census on the integrated tree are unread. The pass-7 delta's one reject there is named in §3.
11. **Row 16's theme-color is read settled, not mid-flip.** The TAB-PEN row-31 coupling is by name only.
12. **The census (charter row 3)** reads the four missing shapes now, each planted at ONE site (the
    self-test's controls 11–14b), not at every consumer site. Its scanner now lives in the ONE library
    (`scripts/shape-census.mjs` `consumerSites`/`hasCompound`), not hand-rolled in `check-theme-tokens`.
13. **The ballot frames for T9-B25 (the hand's order) are not banked.** VERB has one retirable pass-6 frame
    left beyond B21, and B21 stands. The B25 pair is built and served (§4) but not photographed.
14. **n = 3 on the recorder** (row 1 asks for n ≥ 5 on a quiet box). The box was never quiet (15–48).
15. **Row 1's drawn-at-20 % (≤ 25 %)** is asserted on the CURVE only (`bootHand.test.ts`: handStroke(0.2) <
    0.25). It was not read on the painted surface.

## 3 · The replay route and the resumption

- **In place**, on the shared §13 tree. LADDER's pass-7 delta was already in it (cut `cb17b5f3`, never touched).
  First act: the tree's product diff through a temporary index (`d04b152f`) against `cb17b5f3`. The dead
  attempts had added **14 files +853/−156** beyond the cut. I read every hunk.
  - **KEPT whole** (verified and re-measured here): `bootHand.ts` + its test (the capped hand clock, the
    ruling hold D15, the wordmark latch); `pencilConfig.ts` (`MOTION.hand`, `curves.handStroke`,
    `cubicBezier`, the dusk verb's props gaining `stroke, fill`); `usePathAnimation.ts` (the serial/front
    schedule behind `VITE_HAND_ORDER`, the frame's corners read off the path, `runHand`, `hideLines`);
    `HandDrawnGrid.vue` (the stacks wait with its counted ceiling, the ruling hold, the draw token, and the
    deletion of `INK_JOINS_DUSK` = T9-B23 arm (b), which the chair struck); `HandwrittenLogo.vue` (the latch);
    `HandwrittenGlyph.vue` (the reveal held by `afterRuling`); `index.css` (THE HINGE, arm (c), and the
    sheet, arm (d)); `DarkModeToggle.vue` (`VITE_INK_AT_FLIP` arm classes); `useTheme.ts` (the theme-color
    option); `env.d.ts`; `check-motion-bands.mjs` (three EXEMPT_KEYS rows + one ADMITTED_ARITH row);
    `check-theme-tokens.mjs` (shape controls 11–14b); `fold-verb.spec.ts` (the post-paint reader + PLANT skip).
  - **FINISHED**: the census scanner moved into the ONE library (LAWS §I); the GA1 reader keyed on the
    observer's paint frame, printing the first interval and the load; `e2e/node.d.ts` declares `node:os`
    `loadavg`; reduced motion skips the bake wait (§1.6).
  - **REVERTED**: no dead hunk. My own `useFlipGlide` hunk was reverted after its ablation (§1.1).
- **apply --check**: the cumulative diff on a fresh `74a2b5d9` index **0**. `pass7-verb-delta.diff` on
  `cb17b5f3` **0**. The pass-7 delta (vs the pass-6 bank `3d25f02a`) on `74a2b5d9 + s13-s7-s3.diff` gives
  **1**, and **only `HandDrawnGrid.vue:2`, the import block** rejects: both sides expand the `pencilConfig`
  import identically, and the integrated side also expands the pencil-boil and gridPaths imports for
  GRAPHITE's fronts. `git merge-file` gives ONE conflict hunk, resolved by the integrated side's block (a
  superset). No other file rejects. Line count: `merge-file --ours` gives 841 = the integrated 795 + VERB's net
  +51 − the 5 lines of the `pencilConfig` import both sides expanded identically; both `frontGate`
  (GRAPHITE) and `stacksResident`/`beginRuling` (VERB) survive.

## 4 · Ballots (for the owner; both arms built on ONE payload, one variable each)

- **T9-B23 (RESTATED by the chair)** — one const `VITE_INK_AT_FLIP`. **(c) HINGE, default** (`index-Bdk03-EiIrzu.js`);
  **(d) SHEET** (`index-B_ta0Cug9pdj.js`); **(a) SNAP** (`index-CIntNN44-4dm.js`); (b) STRUCK and its code
  deleted; **(e) UNDERLAY UNBUILT**. **Frame**
  `t9-b23-ink-at-flip-t100-hinge-left-sheet-right-chromium-light2dark-390x844-coarse-dpr2-retires-p6-t9-b23-snap-left-dusk-right.png`
  (11,717 B, pngquant 60–90, sha1 `3f316585895b`): chromium · light→dark · 390×844 · **coarse (hasTouch)** ·
  **DPR 2** · the board's top-left 3×3 with the typed user digit 5 in r1c1. Every animation and transition is
  frozen at +100 ms of the flip (430 / 429 animations paused), and 71 givens were read back in each arm. Left (c):
  old graphite on the dusking paper. Right (d): old graphite on the undusked white sheet (the lit rectangle).
  **It RETIRES** `pass6/prototype/MOT-VERB/t9-b23-ink-at-flip-t175-snap-left-dusk-right-chromium-light2dark-1280x800-fine.png`
  (its arm (b) is struck). **The default's losses:** user ink under 3:1 for 2–21 frames (the control 2–30).
  Chromium's cold flip + reversal takes graphite under 3 for 2–4 frames. WebKit L→D user ink ties or loses to
  the control. And these are computed, not painted (gap 2).
- **T9-B25 (the hand's order)** — one const `VITE_HAND_ORDER`. **(a) ONE HAND, default** (`index-Bdk03-EiIrzu.js`)
  vs **(b) THE RULING FRONT** (`index-BvAflQVX3mt-.js`). Built and served. **Not framed** (gap 13). **The
  default's losses, whole:** the ruling takes 2.0 s (ruled 95 % at 2.33–2.35 s chromium / 2.57–2.69 s WebKit
  against front 0.84–0.96 / 1.01–1.09 and the control 0.56–0.58). The digits wait until 2.54–2.94 s (control
  0.35–0.48). Every deal re-rules. The frame tier's WebKit per-frame Δ passes the cap by 0.5 pt only.
  **(b)'s losses:** 15 fronts at once, and the frame tier over its cap in WebKit (10.7 %).
- **Row 16 (theme-color, OPTION, not a ballot of mine; coupled to TAB-PEN row 31 by name)** — one const
  `VITE_THEME_COLOR`. On (`index-DapFRFOZ56Au.js`), one meta equals the painted paper on every settled state.
  Off (the default), none ships. Not framed.
- **T9-B24 (the Bloom's score K/R), T9-B26 (the digits' hand), T9-B22 arm B**: UNBUILT (gap 1, gap 8). The
  charter's row 15 names B24–B26 as "the draw-in's clock; the toggle's clocks; the theme-color". The
  intake's §5 names B24 = the Bloom, B25 = the hand's order, B26 = the digits' hand. I follow the intake's
  numbers and flag the mismatch to the chair.

## 5 · Rows by number

**Charter (pass6/charters/MOT-VERB.md):**
1 GA1 post-paint + PLANT skip: **closed in chromium** (20/20, plant 5/5), **WebKit 19/20** (gap 5) ·
2 first interval: **measured, ungated** · 3 census on SHAPE: **closed for the four shapes at one site each;
the scanner is in the library** · 4 GB1/GB7: **open, not re-read** · 5 row 37: **open, no candidate** ·
6 T9-B22: **open, no arm** · 7 M19 split arms: **open** · 8 GB6/row 32/34/scrollbar: **open** · 9 M15
captions/B21/B23: **B23 re-framed (c) vs (d); B21 stands; captions open** · 10 seams: **B1 DELETED is
LADDER's (landed in its cut; `check-motion-bands.mjs:886`); the settle-curve paint move is the chair's
DECLARED move (pass7 CHAIR §2), cited; `ink-rub-out` on the union unread** · 11 filter census: **12 = 12
at rest, served dists; integrated boot census unread** · 12 = INTAKE-23 rows 1–7 below · 13 = rows 8–15
below · 14 = row 16 below · 15 = §4 · 16 = §3's apply exits.

**INTAKE-23 §4 (MOT-VERB rows 1–16):**
1 D1 the hand: **CLOSED on the rAF/post-paint probe and the recorder** (per-frame Δ under the caps both
engines; 2 fronts; 0 intervals > 34; the recorder GREEN 3/3 both engines, where the control is RED 3/3 on
the bakes), **open on n ≥ 5 / quiet box / painted drawn-at-20 %** · 2 D2 the layer: **OPEN (unbuilt)** ·
3 D3 the point: **OPEN** · 4 D4 the rubbing: **OPEN** · 5 D5 order and bakes: **the ruling waits on BOTH
stacks with a counted ceiling (0 fires in 16 boots), and no encode lands inside the draw on the default boot;
the stack-open move, the late-deal regime and G-D12 are OPEN** · 6 D6 declared moves: **the PRM grid
cured (no wait); the PRM wordmark row and π-3 unread** · 7 D7 the recorder: **used as the primary read, with
the self-test printed (93/s chromium; WebKit 21/s photographs, 60/s rAF)** · 8 D15 the wave waits for the
last lift: **CLOSED on the default boot, both engines** (digits > 5 % never while ruled < 95 %; 0 frames),
a `?board=` restore's hold is not read separately · 9 P7-M21-1 the hinge: **built; graphite holds;
user ink can't (the intake's arithmetic); read COMPUTED, not painted — OPEN as a gate** · 10 the Bloom's
score K/R: **OPEN (unbuilt)** · 11 the boil: **OPEN** · 12 the settle: **OPEN** · 13 the fence/PRM cut:
**OPEN** · 14 P7-π on the merged §13 tree: **the toggle diff was re-built, not pasted (the hinge and arm
classes only); π whole-DOM, goldens 4/4 and the dark-boot census were not run this pass — OPEN** · 15
M21-a/b: **OPEN, RED in both arms as booked** · 16 theme-color: **built as an option, the settled read
equal; mid-flip unread**.

**INTAKE-22 §7 (rows 30–41):** 30 the fold: **landed at pass 5/6; its GA1 is row 1 above** · 31 the lift's
π: **landed (pass 6), not re-read** · 32 the unfold/poster exit: **open** · 33 the fallback that isn't:
**landed (pass 6)** · 34 the held wordmark: **open** · 35 M16 escalation: **not triggered** · 36 the grid
half of the cold flip: **landed (pass 6); GB1 not re-read** · 37 the wordmark half: **BLOCKED, no
candidate** · 38 arm A's price: **carried in B22's text, not re-measured** · 39 the spec estate: **the
fold spec and filter-census re-run; the rest of the estate not run** · 40 the recorder as estate specs:
**the recorder read the boot (chair's copy + PROPOSED); not an `e2e/` spec** · 41 PRM a cut: **not re-read
cold**.

## 6 · Incidents (self-declared)

- The fourth attempt at this lane. The chair's resumption notice was followed: the dead attempts' scratch in
  `<scratchpad>/verb7/` (their scripts, logs, and five dists) was READ for direction, and every number cited
  here was re-measured by me on dists I built after my last edit. None of their logs is cited.
- **A product cure landed on a reader artifact, then came out.** The IntersectionObserver hold in
  `useFlipGlide` was built against a CI "double hold" that the ablation proved was the reader's, not the
  product's (§1.1). The finding goes to the chair's `postpaint.mjs` (PROPOSED: key frame 1 on the mover's first
  IntersectionObserver entry time and drop the earlier reads). The gate was not re-worded: the plant reds
  5/5 in both engines on the re-cut reader, and the control still reds 40/40.
- **The first temporary-index tree I cut (`a69c62f4`) was wrong**: I ran `git add -A .` from `web/frontend`,
  so `.github/workflows/ci.yml` read `74a2b5d9`'s. It was caught on the stat (ci.yml −34). Every tree cited
  comes from the root-level cut (`e7cc2ae8`).
- **The ablation dist was built from a scratch snapshot**, and its hash (`BHJMbOny6cIs`) differs from the tree's
  rebuild of the same source (`Bdk03-EiIrzu`, paths differ in the bundle). So the FINAL dist's GA1 was re-run
  on its own (§1.1). The two agree.
- **The flip, meta and PRM rows ran on `index-kIUrpPTIeg9L.js`, and the arm dists they used were built
  before the IO hunk's removal.** That hunk touched only the fold's hold, so the rows stand on the final
  source, but the dist identities differ. The boot probe (§1.4) ran on `index-CGrZTBqOwzgX.js` (before the PRM
  edit and with the IO hunk). Its no-preference draw-in path is identical source.
- The first battery's logs collided (tree and control both named `web`), and the tree's prettier red was
  hidden behind the control's green log. It was caught, `useFlipGlide.ts` was formatted, and the script
  re-tagged. The table above is the final run's.
- A first control `git archive` was extracted from `web/frontend` (a subtree archive) and was moved to
  `<scratchpad>/trash-verb7-1/`. The control cited is `ctl-arch2` (root archive).
- The first recorder batch used a single-element subject (the last cell line), which windows only that line's
  160 ms. It was stopped by PID (26813/30582) and re-cut with the `ruled:` subject. Only the re-cut is cited.
- The first GA1 round ran at load 97–113 (a foreign workload), and is not cited for timing.
- No `rm` of any form. No git in the control tree. Servers were killed by their recorded listener PIDs. The
  scratch PW configs in `web/frontend/.verb7/` were moved to `<scratchpad>/trash-verb7-2/` before return, so
  the tree's `git status` = product files only.

## 7 · Banked here

`README.md` · `pass7-verb-delta.diff` + `BANKED.txt` · one replacement crop (§4) · `instruments/`:
`painted-frames.mjs` (the chair's copy + PROPOSED `--eps` and `ruled:`) with `painted-frames.PROPOSED.diff`,
`boot-probe.mjs`, `flip-probe.mjs`, `meta-probe.mjs`, `frame-b23.mjs`, `batch1–3.sh`, `battery.sh`.
Raw logs stay in the scratchpad (`<scratchpad>/verb7/logs/`) and are summarised above, not banked whole.

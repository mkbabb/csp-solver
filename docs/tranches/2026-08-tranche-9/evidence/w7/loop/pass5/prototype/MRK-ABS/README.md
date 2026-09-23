# MRK-ABS, pass 5: the absolute wobble (§5, §6)

Work tree `.claude/worktrees/wf_f72f3b5a-83a-39`. It advanced in place from the pass-4 bank, with no reset and no replay. Control is `74a2b5d9`: the control tree's prebuilt `index-CubiZsMVSwTc.js` (never built, edited or git-touched), plus a `git archive` of 74a2b5d9 in scratch for the browserless battery. The final lane dist is `index-vRwXgZxlV82x.js`. It was rebuilt after the scratch dir was deleted, came out byte-identical (`diff -rq`, 37 assets) to the dist every reading below was taken on, and is named as the final write.

Diff: 13 tracked files, +193/−62, plus the untracked `e2e/focus-ring.spec.ts` (518 lines). Nothing was committed, stashed or pushed.

## Numbers

**Board ring.** Figures are ledger truth: G-ABS-5's statistic is the left side, 3×3 max-changed, WORST of 60, tier 2 at stroke-opacity 0.95. They are listed chromium | webkit. All boards share one codec payload, with identical given-sets across arms (102 at 16×16, 32 at 9×9).

| arm | 16×16 frame light | 16×16 frame dark | 16×16 paper light / dark | 9×9 paper light / dark |
|---|---|---|---|---|
| **A, the tree** (one value, 0.95) | **2.812 \| 2.85** | **2.404 \| 2.404** | 3.972 \| 3.965 / 3.989 \| 3.997 | 3.92 \| 3.965 / 3.989 \| 3.989 |
| B, two values at 0.95 | 3.334 \| 3.389 | 3.088 \| 3.082 | 3.368 \| 3.353 / 3.084 \| 3.096 | 3.326 \| 3.32 / 3.084 \| 3.09 |
| C, two values at 1.0 (row 1's third arm) | 3.569 \| 3.569 | 3.303 \| 3.303 | 3.581 \| 3.581 / 3.28 \| 3.28 | 3.581 \| 3.581 / 3.28 \| 3.28 |
| HEAD 74a2b5d9 | 2.693 \| 2.911 | 2.32 \| 2.992 | 3.679 \| 3.685 / 3.763 \| 3.755 | 2.693 \| 2.693 / 2.309 \| 2.316 |

- **The frame row stays RED on the shipped one value** (row 2). The ledger in `index.css` says so in words, and G-ABS-5 holds the tree to it: all 6 rows are within 0.1 of paint on both engines.
- **Sensitivity** (row 8), ghost-hidden differencing, 16×16, desk dpr1:
  - Arm A, frame: 90% worst 3.362–3.501 (0 under 3), 70% worst 2.50–2.59.
  - Arm A, paper at 90% mass: 3.44–3.49 (0/60).
  - Arm C, dark paper at 90%: 2.905–2.95 with 2–5/60 under 3. Arm B: 2.728–2.737 with 5–14/60 under 3.
  - **The two values move contrast from the paper to the frame.** They lift the frame's worst above 3 but put the dark paper's shoulder under 3 at 90% mass.
  - The full table is in `logs/density-summary.txt`.
- **Whole ring, not the left side.**
  - Arm A: 33–35% of stations are under 3 on the frame, in every regime.
  - Arms B and C: 0–1.7%. One bottom-left station sits on a [143,143,143] ground, worst 1.13–2.10, and the webkit top reads 2.35–2.67.
  - The ledger statistic does not see the corner stations (gap G4).
- **Density and coarse rows** (row 11). The ledger rows hold at desk dpr1/2/3, phone 390×844 coarse (boardPx 366) and landscape 844×390 coarse, on both engines:
  - Arm A frame: light 2.408–2.858, dark 2.361–2.436.
  - Arm C frame: dark 3.20–3.28, light 3.467–3.581.
  - HEAD frame whole-ring worst: 1.03–2.31 (coarse), 1.03–1.61 (desk).
  - Anomaly: one C station at desk-dpr2 webkit light reads 2.891 (1/60).

**The chrome cost of arm C** (row 1). Worst per stop, parked where stated, arm A → arm C:
- Page stops: 4.188/4.379 → 3.496/3.351.
- Card, ctrl-btn and staging: 4.289/4.286 → 3.581/3.28.
- Guard: 4.227/4.346 → 3.528/3.326 (chromium).
- `.icon-btn`: 3.574/3.614 → 3.048/2.854 in chromium, 3.011/2.813 in webkit. Dark goes under 3 on 2/27 stations.
- `.info-btn`: 2.608/2.418 → 3.124/3.159 in chromium (it clears).

**Chrome floor, boil parked** (rows 6 and 7: PRM, 5 reps, spread 0 unless noted):
- The law-39 tab, dashed: chromium 1.043 / 1.655, webkit 3.606 / 2.903.
- The same tab in the PROPOSED token form: 4.009 / 3.558 (chromium), 3.883 / 3.567 (webkit), 0 lines under 3. In the default regime it swings 1.04–4.34.
- Deck centre card, parked: 4.188 / 3.739 (chromium), 4.048 / 3.788 (webkit). Default regime: 1.808–4.188, and 1 run in 5 dips.
- Guard over 3 runs: 4.227 / 4.346 (chromium), 4.153 / 4.283 (webkit). The pass-4 3.922 did not recur.
- `.info-btn`: 2.608 / 2.418 (chromium, 3/44 lines), 3.600 / 3.004 (webkit). Stable across runs.

**Forced colours** (row 7): the block moved out of `@layer base` to an unlayered `!important` rule on the four hosts.
- Chromium: every stop paints Highlight, which resolves to `rgba(5,0,73,0.8)` in this build, at 11.31. Staging reads 7.878 and guard 4.581 (HEAD: CanvasText 13.21 / 21).
- Deck card: lane worst 1.06, median 7.94, 45% under 3. HEAD: 1.08 / 2.45 / 52%. **Still OPEN**: the ring sits on the card's own sketched edge.
- WebKit's emulation matches the media query but forces no palette. Highlight resolves to `rgba(128,188,254,0.6)` and reads **1.46 on light at every stop**, while HEAD kept its authored colours. The regression is emulation-only (Safari has no forced-colors), and it is declared.

**π** (row 10), 16×16 board route, 1097 nodes:
- Parked: the only lane-vs-control delta is `outline-color` ×1097 and `path.cell-ghost-path` rect 6.92–6.93 px. Control vs control: 0/0.
- Default regime: chromium light adds 12 boil-pose opacity deltas, a phase race that is absent when parked.
- π does not cover the deck, guard or home routes. The deck card's offset moved 4 → 3 px there (a pass-4 hunk).

**MA-N** (rows 9 and 12). Clearance of the ring's outer ink from its own cell edge at 16×16:

| inset | stroke 10, offline | stroke 10, DOM (G-ABS-7) | stroke 7, DOM |
|---|---|---|---|
| 0.86 (tree) | +2.577 u | +1.639 px | +2.373 px |
| 0.90 (arm D) | +1.616 u | +1.027 px | +1.761 px |
| 1.00 (witness) | −0.788 u | −0.501 px | +0.232 px |
| HEAD | +3.078 u | — | — |

- G-ABS-8: DOM `d` equals the library recipe 256/256 on both engines (scale 0.489 px/u, boardPx 640).
- σ: 0.76 / 1.02 / 1.03 px (1.1 / 2.5 / 4.5% of the drawn edge). G-ABS-1 and G-ABS-2 are GREEN offline (`logs/k-window-086.txt`).
- The offline-u and DOM-px columns agree in sign and in order. They do not agree in magnitude (2.577 u × 0.489 = 1.26 ≠ 1.639). **Unreconciled** (gap G9).

**Filter census, light and dark on both engines:**
- Lane and control fail the same 4 of 24: G3.1 and G3.3 in the dark projects, both engines. The cause is an inherited unclaimed `svg.crayon-heart.idle ⟨saturate(0.85)⟩` in the attribution hover card.
- Light is 12/12 green on both. filterBudget is unchanged by this lane.

## Gaps (open, most severe first)

1. **G1, the ballot is not answerable from the ledger alone.**
   - Arm C lifts the 16×16 frame to 3.30–3.57, but costs the chrome 0.7–1.0 of contrast on every stop and puts `.icon-btn` dark under 3 (2.813–2.854).
   - It also ties the invalid rung, a conflict with MRK-LIVE's G-LIVE-14.
   - Arm B leaves dark paper at 2.73 under 90% mass.
   - B or C would need a restated ledger and a restated `.dark` comment. Neither arm is applied; both are banked as PROPOSED diffs.
2. **G2, the deck card's forced-colours ring is unfixed.** 45% of stations are under 3 (1.06 worst). This is geometry: the ring lands on the card's sketched edge. Recolouring cannot cure it.
3. **G3, the deck card's normal-mode ring is mostly hidden.** Offset 3 (the token) against HEAD's 4 leaves 4–13 painted stations at 90% mass on the lane, against 18–23 on HEAD, and crop p5-4 shows a blue sliver under the card's stroke. Its contrast passes only on the pixels it paints. The cure is a deck-specific offset or a paint order above the sketch; neither was prototyped.
4. **G4, the ledger's left-side statistic hides the corner stations.** Arm A's whole-ring frame is 33–35% under 3, and B/C's bottom-left corner reads 1.13–2.10. The ledger is true about what it measures and silent about the rest.
5. **G5, WebKit forced-colours emulation regression** (1.46 at every stop). Emulation-only, but it is a delta against HEAD.
6. **G6, the two methods disagree.** Blur-vs-focus and ghost-hidden differencing agree on the ledger rows but differ on the corners and the dark shoulder. The ghost-hidden reading is the cleaner of the two (FACE's method), and the ledger uses the blur-based reading.
7. **G7, law 39's tab is NOT moved.** The deletion is PROPOSED with parked numbers (4.009 / 3.558 and 3.883 / 3.567). Chromium light stays at 1.043 on the shipped dashed rule.
8. **G8, `.info-btn` chromium stays at 2.608 / 2.418.** It needs a re-read after T9-B8/M18.
9. **G9, MA-N offline-u vs DOM-px magnitude is unreconciled** (see the table).
10. **G10, the deck card still dips in the default regime** (1 run in 5 at 1.808).
11. **G11, unrun rows:**
    - G-ABS-9 to G-ABS-13.
    - visual-golden.
    - The phone perf trace.
    - A real Safari reading (M19: no osascript).
    - (The a11y suites did run: 71 passed and 1 skipped on lane and control alike.)
12. **G12, MRK-LIVE's RING_GEOMETRY decline is refuted by the DOM witness.** f = 1.00 enters at stroke 10 (−0.501 px); f = 0.86 clears (+1.639 px). The graft to LIVE (row 12) is handed over, not applied: LIVE's tree is not this lane's to edit.

## Charter rows

| row | state |
|---|---|
| 1 third arm | BUILT (C, `index-CkDshfGAUkxf.js`), framed (p5-1), chrome cost read (above) |
| 2 16×16 frame RED on one value | HELD: the ledger says RED, G-ABS-5 holds it |
| 3 guard spread; strike 1.78 and the gridPaths claim | spread banked (3 runs, 0 spread); 1.78 and 2.15 struck from `index.css`; gridPaths claim re-cut to MA-N |
| 4 R1 a truth gate, 9.99 as negative control | MOVED (below): R1 reds on the control, stray-figure and two-declaration trees; the 9.99 tree is caught by G-ABS-5 (B1), not by R1's browserless half |
| 5 re-measure; census off `--focus-ring` | re-measured; the census reads the resolved outline ink per host through a canvas |
| 6 law 39 parked spread | banked (above); deletion PROPOSED, not applied |
| 7 deck card, `.info-btn`, forced block | forced block unlayered; control read once; deck and info-btn OPEN (G2, G3, G8) |
| 8 sensitivity rows | on every painted figure (`sensitivity[]` 50/70/90/100%) |
| 9 G-ABS-3/4 with negative controls; G-ABS-5 in `focus-ring.spec.ts` | LANDED: 8/8 lane, 8/8 red on control, 4 breaks red as named |
| 10 pose-pinned π | parked π: outline-color only, plus the ghost rect |
| 11 unrun rows | coarse, phone and 844×390 run (density); MA-N and σ at f=0.90 run; G-ABS-1/2/7/8 run; the rest are listed in G11 |
| 12 RING_GEOMETRY graft to LIVE | witness banked; graft handed over (G12) |

## Moved rows (PROPOSED only, never applied to r0 or registry files)

- **R1** (law probe): moved from a declaration count to a truth gate. The re-cut probe is `probe/law-probe.R1-moved.mjs`.
  - GREEN on the lane.
  - RED on control 74a2b5d9: unguarded 2.86 / 3.60, no ledger.
  - RED on the stray figure "4.15." and on arm B's two declarations.
  - The 9.99 tree passes its browserless half by design; its painted half is G-ABS-5, which reds (B1).
- **R3-a**: unchanged from pass 3.
- **Law 39**: NOT moved. The deletion diff is in `instruments/`.

## Landed spec and breaks

`e2e/focus-ring.spec.ts`, run by `probe/cfg/landed.config.ts`, 1280×800. Every break was restored by sha1 (`logs/final/chain4.log`).

| run | dist | result |
|---|---|---|
| lane | A `vRwXgZxlV82x` | **8 passed**, exit 0 |
| control | 74a2b5d9 `CubiZsMVSwTc` | **8 failed**, exit 1. Each fails for its named reason: G-ABS-5 computed 0.9; G-ABS-8 0/256; G-ABS-4 `auto` ×4 plus two inks; G-ABS-3 chromium logo-trigger 2.702 and webkit bands 3 |
| B1 ledger → 9.99 | A | 2 failed: "painted 3.972 ledger 9.99" |
| B3 source opacity → 0.9 | A | 2 failed: "source 0.9, computed 0.95" |
| B4 inset → 1, dist E | E `CE8whaeg3E1b` | 2 failed: stroke 10 −0.501 px, identity 256/256 |
| arm D inset 0.9 | D `BvIWcQ5XZ1-3` | 2 passed: +1.027 px |

G-ABS-5 also carries four in-test controls: ablated 0.9, a scoped source mutation, a falsified 9.99 ledger, and a stray figure.

## Battery (each gate bare; control exit beside)

Logs are in `logs/final/`. Lane = the work tree after the scratch dir was deleted. Control = a `git archive` of 74a2b5d9 (web/frontend, relay, scripts, `.github`, csp-solver/data) with node_modules symlinked.

| gate | lane | control |
|---|---|---|
| `e2e/focus-ring.spec.ts`, whole file, both engines | 0 (8 passed) | 1 (8 failed, by verdict) |
| lint:lanes | 0 | 0 |
| lint:theme-tokens | 0 | 0 |
| lint:theme-selectors | 0 | 0 |
| lint:sleep | 0 | 0 |
| lint:copy | 0 | 0 |
| lint:motion | 0 | 0 |
| lint:ink | 0 | 0 |
| test:e2e:projects | 0 | 0 |
| check-pw-projects | 0 | 0 |
| check-copy-register (M16) | 0 | 0 |
| `eslint .` | 0 | 0 |
| `prettier --check` (npm run lint: src, scripts, ../../scripts, ../relay) | 0 | 0 |
| vue-tsc -b | 0 | 0 |
| typecheck:e2e | 0 | 0 |
| vitest, per-dir chunks | 0: 68 files / 830 tests | 0: 68 / 830 |
| a11y + access + spoken-gallery + spoken-controls, both engines, on served dist | 0: 71 passed, 1 skipped | 0: 71 passed, 1 skipped |
| filter-census light/dark, both engines, on served dist | 1: 20 passed, 4 failed | 1: the same 4 failed (inherited crayon-heart, dark only) |

Notes on the table:
- `e2e/` is in `.prettierignore` (a standing rule), so the new spec sits outside prettier. It is inside `eslint .` and `typecheck:e2e`, both 0.
- check-pw-projects is 0 because the spec is registered in SPEC_MANIFEST (+1 line).
- filterBudget stays at 9 in the light census.
- Unrun: visual-golden and the phone perf trace (G11).

## Frames (≤4, each ≤150 KB)

| file | engine · theme · viewport · pointer | retires |
|---|---|---|
| `frames/p5-1-ballot-three-arms-cell0-16x16-light-dark-chromium-fine.png` (19 KB) | chromium · light and dark · 1280×800 · fine | `p4-A-ballot-cell0-frame-16x16-one-vs-two-light-dark-chromium-fine.png` |
| `frames/p5-2-inset-086-vs-090-cell0-16x16-light-dark-chromium-fine.png` (14 KB) | chromium · light and dark · 1280×800 · fine | `p4-C-inset-086-vs-090-cell0-16x16-light-chromium-fine.png` |
| `frames/p5-3-forced-colours-deck-card-lane-vs-control-chromium-fine.png` (10 KB) | chromium · light, forced-colors active · 1280×800 · fine | none (new: charter row 7) |
| `frames/p5-4-deck-centre-and-armed-guard-lane-vs-control-light-webkit-fine.png` (9 KB) | webkit · light, PRM · 1280×800 · fine | `p4-B-deck-centre-and-armed-guard-light-webkit-fine.png` |

p5-1 columns are A | B | C. p5-2 columns are A (0.86) | D (0.90). p5-3 and p5-4 columns are lane | control. Every board panel is cell 0 of the same 16×16 payload.

## Replay route

In place. At pass-5 start the tree equalled pass4.diff exactly: the same 12 files (the pass-4 README's "+197" is its own count; `git diff --stat` read +200/−62). Pass 5 added `check-pw-projects.mjs` (+1) and the untracked spec, and re-cut comments in `index.css`, `pencilConfig.ts`, `gridPaths.ts` and `HandwrittenLogo.vue`.

The patch is banked as `pass5.diff`: `git diff --binary 74a2b5d9` plus the untracked spec as a new-file hunk, 1003 lines. To replay onto a clean 74a2b5d9 tree: `git apply --3way pass5.diff`.

Verified: the patch was applied to a `git archive` of 74a2b5d9 in scratch, and all 14 files came out byte-identical to the work tree. The line-count check is `git diff --shortstat 74a2b5d9`, which reads 13 files, +193/−62, plus the 518-line spec.

The work tree's ignored `web/frontend/dist/` (`index-Dj7OsGbllDmU.js`, dated Sep 18) is stale and is NOT this pass's build. Every dist here was built to scratch.

## Incidents

1. **The scratchpad's `logs/` directory vanished mid-pass**, taking the pass's first chain, landed, break, battery and vitest logs with it. The cause is unknown; the scratchpad is shared with other sessions. Every lost gate was re-run into `logs/final/`. The JSON the probes wrote straight to evidence survived.
2. **The first p5-3 crop caught the lane's deck card mid route transition**, with the title at partial opacity. A timed probe proved lane and control identical at 900–6000 ms, with and without focus, on both engines. The crop was re-shot after polling for zero running finite animations.
3. **p5-board's HEAD arm crashed.** HEAD has 2 segments per side at 16×16. Fixed with a generic left-side slice and re-run.
4. **An unquoted heredoc** executed backticks in the R1 probe's python. It was rewritten quoted. The neg-stray tree took a double insertion, which is harmless.
5. **G-ABS-5 was red on the tree.** The opacity regex missed the new comment's word order. Parser fixed.
6. **The stray-figure control caught a FIGURE regex blind to "4.15."** (a sentence-ending figure). The regex was re-cut.
7. **G-ABS-3's placeholder admissions went STALE** on webkit light (the tab obeys at 3.606). The exact parked values were measured; `null` means not admitted.
8. **lint:motion** went red for a missing PRM declaration, and **prettier** went red for a blank line in `index.css`. Both fixed.
9. **chrome-lib could not parse `color(srgb … / a)`**, so HEAD's deck, staging and guard went unread. The parser was fixed and the census re-run; the first run is kept in `logs/census-run1-parser-blind/`.
10. **The landed G-ABS-3 crashed on HEAD's `oklab()`.** Fixed by resolving colours through a 1-px canvas.
11. **The control battery's lint:lanes read 2** because the archive lacked `.github`. It re-ran at 0.
12. **The density-BH background task reported "failed".** Its log redirect targeted the vanished `logs/`. Its JSON (`density-coarse-BH-*.json`) had already landed and is complete (arms B and HEAD, 3 regimes, both engines).

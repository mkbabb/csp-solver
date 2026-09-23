# Pass 6 · MRK-LIVE · the live ring (prototype record)

Work tree `.claude/worktrees/wf_f72f3b5a-83a-35` (base `74a2b5d9`), uncommitted, advanced IN PLACE on
the chair's bank `pass5/prototype/MRK-LIVE/pass5.diff`. At the start `git diff --stat` matched the
pass-5 README exactly (19 tracked files +510/−159, 3 untracked). At return: the same 19 tracked files
+591/−175, plus the same 3 untracked files (`focus-ring.spec.ts` 1,302 lines, `FocusRing.vue` 312,
`gridPaths.test.ts` 48). `git status` shows product files only. The dist is built outside the tree and
rebuilt after the last edit: `index-528cEhaQTW0a.js` / `index-Y0-Or2JtQSIH.css`, identical on both
builds. Control = `74a2b5d9`: the chair's `w7-control` dist (`index-CubiZsMVSwTc.js`, hash-verified)
for dist rows, a dev server of that tree for spec rows (private cacheDir in the scratchpad, no git in
the control), and a `git archive` of `74a2b5d9` for the lint battery. The pass-6 number is the critic's.

## 0 · Gaps first (open, each with the number that holds it)

1. **The RING_GEOMETRY graft is taken, and it regresses the 16×16 frame cell.** This is the row that
   costs most. Cell 0 is the frame crossing, measured on the 16×16 payload `mintSudoku(4)`: 60 stations
   along the drawn path, with a dropped station counted as under 3.
   - Alias@0.95, fraction under 3:1: **10 % before the graft, 33.3 % (20/60) after**, in every engine ×
     theme × motion arm. The worst station falls from 2.40–2.85 to **1.0–1.5**. This matches ABS's
     78/240 (32.5 %) on ABS's tree.
   - Every arm moves: #4589d2 goes from 5–8 % to 1.7–3.3 %, with worst 1.11–1.65. #2f68aa goes from
     0 % to 1.7–3.3 %, with worst 1.8–1.9.
   - The same graft CURES the 9×9 frame cell. On `mintSudoku(3)`, cell 0 goes from **26.7 % (16/60)
     under 3, worst 2.40–2.85, to 0 %, worst 3.92–3.99**, both engines, both themes.
   - The medians do not move: 3.972/3.965 light, 3.989/3.997 dark.
   - This is a trade for the owner, not a cure, and the ballot carries it (§5). A tree that wants both
     would need a size-keyed inset. That is not built.
2. **G-ABS-5's parser precondition is unmet by the batch order.** The registry takes the graft
   "after ABS fixes G-ABS-5's parser". ABS sits in batch 4 and this lane in batch 1.
   - This tree carries no ledger figure clause. The product figures the graft brings (pencilConfig's
     MA-N table, restated at 0.636 px/u) are held by G-LIVE-22's printed line, not by a parser.
   - The index.css figure table is ungated. That was already true in pass 5.
3. **GRAPHITE's retrace is not carried.** The inbound §6 hunks ride behind `RING_ARM` (§1 row 10), but
   `.cell-ghost-retrace` needs a reversed second path in `gridPaths.ts` and `DigitCell.vue`. That is
   GRAPHITE's hunk, and the graphite arm here draws one 12-unit pass.
   - Under `RING_ARM = "graphite"`, G-LIVE-14 reds by construction: tier 2 at opacity 1 ties the
     invalid rung. This is stated in the const's comment. The arm is proven to compute in both engines
     (`logs/P6-graphite-arm-computes.txt`) but was not painted or framed.
4. **The reversal-only negative cannot exist in WebKit.** A second press 140 ms into the desk dock's
   glide does NOT reverse in WebKit.
   - Every glide animation leaves the path within one frame, and the dock lands shut.
   - The same holds on `74a2b5d9` (`logs/P6-reversal-webkit-cut-lane-and-control.txt`). This is the
     dock's mechanics, W2/§13's, not the ring's.
   - G-LIVE-4 asserts each engine's dealt interleave explicitly: Chromium reverses (rate −1), WebKit
     cuts. So R2 (the ring stops following a reversed glide) reds in Chromium only.
5. **G-LIVE-17 and G-LIVE-21 are guards, not born-REDs.** Both are green on the dev control in both
   engines, and the file header says so for G-LIVE-17.
   - G-LIVE-21's new guard clause reds under its plant, G (`.guard-btn:focus-visible { outline: none }`),
     in both engines.
   - The tape's covering, 4 cells / 2,303.91 px² chromium and 6 / 3,189.17 webkit, is T9-R5 (the
     chair's). Tape arm B is the owner's and is not built.
6. **The cured undefined-token census reds this tree +2 over the control.** Both findings are at
   `gameCell.css:300/302`, on `--color-peer-cursor-ink`.
   - That token's one publisher is BoardHost's inline `cellStyle`, and the pass-5 fallback strike made
     its consumers bare.
   - The cure is a PROPOSED `INHERITED` ledger row (`instruments/undefined-token-census.inherited-row.PROPOSED.diff`),
     not a restored fallback. With the row applied, the lane reads the control's own baseline: 0 bare
     and the inherited `--refuse-dur` STALE. The row itself reads STALE on the control, so it is bound
     to this tree. It lands with the chair's copy at the fold.
7. **The `vsIn` ("over its own fill") WORST column is still not a statistic.** With the inward-sample
   guard, the medians hold (3.619/3.615 light, 3.691/3.695 dark), but the worst column reads 1.00–2.76.
   The guard (`d2 ≥ 30` from the core) still admits an antialiased ink flank. Only the median is quoted.
8. **G-LIVE-16's noise arm is live on two stops even with the boil parked.** `button.logo-trigger`
   has 3,380–4,681 px moving between two ring-ON shots, and the second `button.icon-btn` has 2,417–2,470.
   Paint is counted pixel by pixel, excluding every moving pixel, and still reads 3,465–3,635 and
   2,179–2,190. What moves there under `reduce` is unread.
9. **The dark filter census stays RED, identical to the control.** Both read 4 failed / 8 passed on
   `svg.crayon-heart.idle saturate(0.85)`. The chair made the deletion a fold pick. With the deletion
   planted on a scratch build (`index-BJSTTjPE_beB.js`), both themes read 12/12 green (budget 9) in
   both engines.

## 1 · The charter rows

| # | row | status | numbers (lane · control `74a2b5d9`) |
|---|---|---|---|
| 1 | **G-LIVE-16 reads PAINT** (see note 1) | **CLOSED** | Both engines, ring pixels read ON vs OFF, with anything that also moves between two ON shots excluded. Drawn stops paint 461–3,635 px chromium and 466–3,465 webkit; the board's cells paint 914–971 px; the stranded control is caught; FLOOR 30. See note 1 for the plants. Control: red, "the walk judged a stop good by its drawn ring" (no FocusRing). |
| 2 | **G-LIVE-19 masked default in SOURCE** | **CLOSED** | Every `.css` and every `.vue <style>` is walked, comments stripped. The walk must reach `AnswerKeyLaminate.vue` and `SudokuPoster.vue`, and 0 masked defaults stand behind a registered name. **X3 in-run**: the laminate's own text with the plant appended is caught. **X3 file plant** reds G-LIVE-19 in both engines, and only that row. |
| 3 | the ballot at BOTH statistics + ABS's whole ring | **CLOSED** (§5); the pass-5 geometry reproduces to the digit | On the pass-5 geometry, 16×16 FRAME, median · worst · fraction under 3: alias@0.95 3.972/3.965 · 2.812/2.850 · 10 % light and 3.989/3.997 · 2.436/2.404 · 10 % dark; #4589d2@1.0 3.581 · 2.918/2.891 · 5 %/6.7 %; #2f68aa@1.0 3.28 · 3.28 · 0 %. ABS's 3.569 is struck as a left-side reading: it is the p30 of these same rows (chromium #4589d2@1.0 FRAME p30 3.569). Whole ring on the returned tree: gap 1. |
| 4 | the webkit `isTheRing` refusals re-read; the reduced-motion arm; **law 39's tab parked** | **CLOSED** (see note 2) | #4589d2@1.0 FRAME webkit: TRUE, Δ0, worst 2.891, median 3.581. Alias@1.0 dark paper webkit: TRUE, Δ0, 4.286. Every station is painted, 60/60. The `reduce` arm reads every median and fraction the same except #4589d2@1.0 light chromium (5 % → 3.3 %). The one other difference is a p30 (alias webkit light FRAME, 3.297 → 3.92). Law 39's tab: note 2. |
| 5 | **G-LIVE-4 reversal strict** + reversal-only negative | **CLOSED** (Chromium) / declared (WebKit, gap 4) | No `if`; the end read is polled for {ring, 1 ring, framed ≤ 0.5}. The reversal is dealt in-page and witnessed. Per-frame framing error through it: **max 0.02 px (28 frames) chromium, 0 (10 frames) webkit**. **R2** (FocusRing stops following a reversed animation) reds chromium at **157.77 px**. In-run negative: the tab moved by an unobserved `translate` → framing error > 0.5, both engines. |
| 6 | **G-LIVE-17** as a guard; no clock; air negative | **CLOSED** | Restated as a guard (green on the control). `waitForTimeout(900)` and `waitForTimeout(400)` became `poseSettled` (nothing finite running, the subject's box still over 3 frames). Air is 11.5 / 11.58 px. **Planted overlap** (tape laid 6 px into the ring) reads **−6 px** in both engines, and the row sees it. The header's false "no clock anywhere below" is rewritten to say which waits are gestures. |
| 7 | `.guard-btn` in G-LIVE-21's forced walk | **CLOSED** | Armed guard under forced colours: `outline-style: solid` on the button, **painted 260 px chromium / 256 px webkit**, focus vs blur, noise 0. Plant G reds both engines (`btn none · face none · painted 0 px`). |
| 8 | crops 1/2 (the sun's phase) | **CLOSED by retiring them into numbers** | With the sun parked (`reduce`), the sun's ink is 17,635/17,634 px and bbox 174×175 in BOTH arms, so modality is the only variable. Keyboard: `:focus-visible`, 1 ring. Mouse: 0 rings (chromium focus stays on the toggle without `:focus-visible`; webkit on `body`). Both engines, payload `mintSudoku(3)`. No PNG: the pair is not a ballot. |
| 9 | 'over its own fill' with the inward guard | **CLOSED for the median, the worst column open** (gap 7) | 3.619/3.615 light, 3.691/3.695 dark; unchanged by the graft and by `reduce`. |
| 10 | **the RING_GEOMETRY graft + the inbound gameCell rows** | **TAKEN**, with the cost (gap 1) and precondition (gap 2) declared | **G-LIVE-22** (G-ABS-7/8 whole): identity **256/256**, product **+1.639 px** (stroke 10) / **+2.373 px** (stroke 7), f=1.00 witness **−0.501 px**, ghost CTM 0.489 px/u, cell 39.75 px, both engines identical. Born-RED: the control reads identity 0/256; plant `inset: 1` → product −0.501 px, red in both engines. `generateCellRects` and `generateCellFrames` share ONE `ringRecipe`; the pose-0 identity unit is extended to 16×16 (cells 0 and 255). Inbound rows: see note 3. |
| 11 | 60/120 Hz; the dark filter census | **STATED** (a reading, not a gate) / declared (gap 9) | Under `rate-clock.ts` (chair's copy), the living mark writes `data-mark-pose` 1,2,3,0 and settles 428–497 ms after landing at 50/62.5 Hz shim, 125/130 Hz driven and 100/128 Hz native, in both engines. That is 4 writes per landing whatever the clock (one extra initial `0` write in webkit native). |
| 12 | π on real payloads | **CLOSED** | Whole-DOM, keyed by semantic ancestry, 16 paint properties, lane dist vs control dist, three driven poses (board light, deck, board dark). **Boil parked: 4,136 nodes, 0 deltas, both engines; floor 0/0.** Boil live: 3,976 nodes, deltas 2 chromium / 8 webkit, every one a boil-pose opacity swap between pose siblings. That is the floor's own class: chromium's floor is 14. The same 113 labelled cells are read back by aria-label in both arms. |

Notes on the table:

1. **G-LIVE-16's plants.** The five in-run plants each turn their stop false in both engines: X1 the
   ink deleted, X1b the ink transparent, X1c the ring at opacity 0, X2 `.cell-ghost.is-active` at
   opacity 0, and X2b the ghost's stroke transparent. The **X1 and X2 file plants** (the critic's
   pass-5 plants) each red G-LIVE-16, "every judged estate stop PAINTS an indicator", in both engines,
   and only that row.
2. **Law 39's tab, parked** (runs 1 and 2 identical). The lane's drawn ring reads median **4.188
   light / 4.286 dark**, worst 2.126–2.528, **10 %** of stations under 3, 60/60 stations painted. The
   control's dashed ring paints only **20–23/60** stations (the dashes). Over the painted ones its median
   is 10.9/8.29 chromium and 14.85/12.43 webkit, and its worst is 1.67–3.61. With the dash gaps counted
   as under the floor, **65–72 %** of its stations are under 3.
3. **The inbound gameCell rows.** LADDER's `var(--motion-note)` ✓. TIN's fallback strikes ✓. ABS's
   0.95 cite ✓. **GRAPHITE's tier-2/2×3 `fill: none` + pencil ink** land behind the new const
   `RING_ARM` (`"blue"` ships), published once on `<html>`. The flip also re-points `--ring-ink` to the
   pencil, so `--color-focus-sketch` is read by nothing and dies with it.

### Also re-measured

- **check-property-block** (chair's copy): lane 0 (3 registrations / 3 names, `inherits` read), self-test
  0, control 0.
- **Undefined-token census** (chair's cured copy, as a DIFF): see gap 6.
- **vitest**, chunked by directory: pencil 9/76, games 57/743, composables 3/16, so **69 files / 835
  tests, EXIT 0**. `src/lib` has no tests, and its exit 1 is the loop's "No test files found".
- **vue-tsc -b**: 0.
- **Filter census light**: 12/12 on the lane and the control, both engines (budget 9).
- **The whole spec file, 18 rows × 2 engines**:
  - lane: **18/18 EXIT 0**
  - dev control `74a2b5d9`: **14 failed / 4 passed, EXIT 1**. G-LIVE-17 and G-LIVE-21 are green there
    (the guards). G-LIVE-4/15/20 red with "the ring lands…", because there is no FocusRing on the
    control. G-LIVE-14 reds "tier 2 outranks tier 1 in the more arm". G-LIVE-16 has no drawn stop.
    G-LIVE-19 reds "registered exactly once". G-LIVE-22 reads identity 0/256.

## 2 · Break tests (final battery, the final spec; each restored sha1-equal; `logs/P6-breaks-final.txt`)

| plant (file) | reds | and nothing else |
|---|---|---|
| X1 `--ring-ink` deleted (index.css) | G-LIVE-16, both engines: "every judged estate stop PAINTS an indicator" | 16 passed |
| X2 `.cell-ghost.is-active { opacity: 0 }` (gameCell.css) | G-LIVE-16, both engines, same message | 16 passed |
| X3 `var(--motion-note, 280ms)` in the lazy laminate | G-LIVE-19, both engines: "no var(…, fallback) … in any source style" | 16 passed |
| R2 the ring stops following a reversed animation (FocusRing.vue) | G-LIVE-4 chromium: "worst per-frame framing error through the reversed glide" (157.77 px) | 17 passed (WebKit deals no reversal, gap 4) |
| G `.guard-btn:focus-visible { outline: none }` (GameGallery.vue) | G-LIVE-21, both engines: "the armed guard verb … carries an outline" | 16 passed |
| G22 `RING_GEOMETRY.inset: 1` (pencilConfig.ts) | G-LIVE-22, both engines: "stroke 10: the ring's outer ink stays inside its own cell" (−0.501 px) | 16 passed |
| restored | — | **18 passed** |

The first cut of the reversal-only plant, R, froze the chain on a NEW animation in the set. It stayed
green, because the dock reverses the SAME animation in place (`anim.reverse()`). That exposed
`FocusRing.vue`'s false comment ("the cancelled glide leaves the set and the new one enters it"),
which is corrected here. R2 is the plant that has a subject.

## 3 · Pre-return battery (bare; lane final tree with scratch moved out · control `git archive 74a2b5d9`)

| gate | lane | control |
|---|---|---|
| the whole spec file (`focus-ring.spec.ts`, both engines) | 0 (18/18) | 1 (14 failed / 4 passed; the design-relative rows above) |
| lint:lanes | 0 | 0 |
| lint:theme-tokens | 0 | 0 |
| lint:sleep | 0 (first run 1: my in-page 140 ms window before a one-shot read; the reads after it are now polled, not tagged — an in-page window takes no `sleep-ok`) | 0 |
| test:e2e:projects | 0 (35 specs, 565 resolved tests) | 0 |
| check-pw-projects | 0 | 0 |
| lint:copy (check-copy-register) | 0 (no new UI string) | 0 |
| lint:motion | 0 | 0 |
| lint:knip | 0 | 0 |
| prettier, `npm run lint` (the scoped form: `src/ scripts/ ../../scripts/ ../relay/`) | 0 | 0 |
| eslint . | 0 (first run 1: two errors in my scratch probes under `.mrklive-p6/`, before they were moved out) | 0 |
| vue-tsc -b | 0 | 0 |

## 4 · Crops (2; each a lawful ballot frame, one payload, one variable)

| crop | bytes | engine · theme · viewport · pointer · payload | retires (`pass5/SWEEP.md` names) |
|---|---|---|---|
| `ballot-ring-token-3arms-16x16-cells0-1-light-chromium-1280x800-fine-prm.png` | 10,344 | chromium · light · 1280×800 · fine · `?size=4&board=mintSudoku(4)`, cells 0–1, boil parked, ×3 nearest-neighbour | `1-toggle-keyboard-activated-ring-light-webkit.png` + `2-toggle-mouse-activated-no-ring-light-webkit.png` (the unlawful pair; now numbers, §1 row 8) |
| `ballot-ring-token-3arms-16x16-cells0-1-dark-chromium-1280x800-fine-prm.png` | 10,166 | the same, dark | `3-ballot-alias-095-16x16-cell0-frame-dark-chromium.png` |

In each crop the three columns are A alias `#3a7bc4`@0.95 · B two values @0.95 · C two values @1.0.
The ink is `#4589d2` in light and `#2f68aa` in dark. The label is burned in with the COMPUTED opacity.
All three columns are on the returned (grafted) geometry: the ring's left side sits on the frame rule,
which is gap 1's cost, visible. I looked at both frames. `4-forced-colours-…` is retired into
numbers (§1 row 7). 20.5 KB total.

## 5 · Ballots (U-10; nothing fires before the eye)

- **The ring token, three arms, one payload** (§2.6; the crops above). Both statistics are given per
  arm on the returned tree, 16×16 FRAME cell, median · worst · fraction under 3 of 60
  (chromium/webkit):
  - **A** alias@0.95: light 3.972/3.965 · 1.34/1.34 · 33.3 %; dark 3.989/3.997 · 1.10/1.04 · 33.3 %.
  - **B** @0.95: light #4589d2 3.368/3.353 · 1.60/1.40 · 1.7 %/3.3 %; dark #2f68aa 3.084/3.09 ·
    1.91/1.81 · 1.7 %/3.3 %.
  - **C** @1.0: light #4589d2 3.581 · 1.65/1.11 · 1.7 %/3.3 %; dark #2f68aa 3.28 · 1.81/1.86 ·
    1.7 %/3.3 %.
  - On paper (cell 1), every arm has 0 % under 3.
  - At the median every arm clears and A has the most headroom. By the fraction, A is 10× worse on
    this geometry. **No arm clears the whole frame cell.** C ties the invalid rung (G-LIVE-14 reds).
  - Default: A, per the chair.
- **The ring's geometry** (new, gap 1): **inset 0.86 (MA-N, the graft, returned)** against **HEAD's
  geometry (`74a2b5d9` and this lane's pass-5 bank)**. Both are buildable.
  - 16×16 frame cell: 33.3 % vs 10 % under 3.
  - 9×9 frame cell: 0 % vs 26.7 %.
  - MA-N at stroke 10: +1.639 px vs −0.501 px (the neighbour entered).
  - ABS's 0.90 alternate (+1.027 px) is not built here.
- **The section fork's ring arm** (`RING_ARM`): blue ships; graphite is carried and computes. It is
  not framed, because the retrace is uncarried (gap 3).
- **Tape arm B**: the owner's, not built (declared).

## 6 · Replay route, incidents, moved rows

**Replay.** IN PLACE: no replay. At the start the tree equalled `pass5.diff` (the file list and stat
match the pass-5 README). The same 22 paths are touched now; no new path. The PROPOSED census row is a
diff against the chair's copy, not this tree.

**Incidents.**
1. `run_in_background` combined with an inner `&` let the harness reap one whole-spec run after 4
   tests. It was re-run without the `&`.
2. I ran `npx prettier --write e2e/focus-ring.spec.ts`. `e2e/` is in `.prettierignore`, so config
   refused it and nothing was written.
3. In battery 1, an HMR reload landed mid-test during the X2 plant: G-LIVE-20 chromium failed with
   "Execution context was destroyed". It was transient, not the plant, and the final battery is clean.
4. The first reversal-only plant (R) proved nothing (see §2), and R2 replaced it.
5. Product files were edited temporarily for the plants (X1, X2, X3, R, R2, G, G22) and for the
   crayon-heart scratch build. Every one was restored and sha1-verified equal before the next step.
6. Scratch configs lived in `web/frontend/.mrklive-p6/` and were moved to
   `<scratchpad>/trash-mrklive-p6-1/`. Caches and dists are in `<scratchpad>/mrklive-p6/`. No `rm` was
   run.
7. Servers were killed by recorded PID: 20764 (lane dev :4238), 20738 (control dist :4239), 28674
   (control dev :4240), 64712 (lane dist :4237), 73136 (heart scratch :4236), plus the npx parents
   20707 and 20709. Ports 4236–4240 are empty. No git command ran in the control tree.

**Moved rows.**
- **R6 law 39's form list is MOVED on this tree, and has been since pass 4.** The tab's
  `2px dashed currentColor` form (`DrawerTab.vue:151`) and the ribbon face's `color-mix` form are
  replaced by the one drawn ring. The law's claim ("non-negotiable and visible") holds, with the
  painted numbers in §1 row 4. This is the chair's row, PROPOSED, not re-landed. Pass-4 rulings
  refused the same tab deletion as ABS's lane edit.
- **R1 stays booked.**
- **The L-rows and the r0 probe are untouched.**
- **The chair's undefined-token census copy** gets a PROPOSED `INHERITED` row (gap 6).

`instruments/` holds every probe, config and script that ran, and every OUT path points here or at
the scratchpad. `logs/` holds summaries only; no raw JSON is banked.

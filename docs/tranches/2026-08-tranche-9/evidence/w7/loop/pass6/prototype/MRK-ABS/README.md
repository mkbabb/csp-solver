# MRK-ABS, pass 6: the absolute wobble (§5, §6)

Work tree `.claude/worktrees/wf_f72f3b5a-83a-39`, advanced in place from the pass-5 bank. No reset, no replay, no commit. Base and π control `74a2b5d9` (the control tree's prebuilt `index-CubiZsMVSwTc.js`, served read-only on :4240 and verified by hash; never built, edited or git-touched). The browserless control is a `git archive` of `74a2b5d9` in scratch (`mrkabs6-ctl`).

- **Final lane dist: `index-CJzSS7mwBmS6.js`** (37 assets), built to scratch after the last edit. The earlier build `index-CGzXVLrpeQgX.js` carried every probe in this file. A normalised diff (hashed names and `data-v` ids masked) shows the two dists are identical: 0 of 31 asset keys differ. The one edit between them is a comment in `GameCard.vue`, which moves the scope id. The landed spec and the filter census were re-run on the final dist.
- **Arms, all built from scratch copies of this tree (one declaration each):**
  - B, `index-fsv-KnHYkuoG.js`: two values, #4589d2 / #2f68aa at 0.95.
  - C, `index-BfWqSO0HDc9E.js`: B at stroke-opacity 1.
  - D0, `index-OeVkxKhTTeoz.js`: the deck card's `outline-offset: 0`.
  - I90, `index-aYi5Ct1jl9xx.js`: `RING_GEOMETRY.inset` 0.9.
  - L39, `index-DiOYDJtGTF19.js`: the drawer tab's own focus rule deleted.

  Each is banked as a PROPOSED diff under `instruments/`, and all five pass `git apply --check` against the tree. None is applied.
- **Diff:** 13 tracked files, +202/−62, plus the untracked `e2e/focus-ring.spec.ts` (715 lines; it was 518). The pass-5 README's file list agreed with `git diff --stat` at start: 13 files, +193/−62, plus the spec.

## Gaps (open, most severe first)

1. **The frame cell's whole ring is a regression against HEAD, and nothing on this tree cures it.** It is now declared in the ledger and gated.
   - Lane: 78–79 of 240 stations under 3:1 (32.5–32.9 %) on every engine × theme × DPR. The left side is 60/60.
   - HEAD: 43–51/240 in chromium and 24–41/240 in webkit.
   - The inset does not cause it. Arm I90 (inset 0.90) reads 80/240.
   - The two-value arms B and C read 0–1/240 on the same statistic, but lose elsewhere (row 3 of the ballot).
   - A size-keyed inset is unbuilt. It is MRK-LIVE's pass-7 row (chair A.3), not this lane's.
2. **WebKit regresses on the ledger's own left-side statistic.** This is declared with HEAD's spread over 4 runs at DPR 1.
   - HEAD webkit dark: 2.851–3.157 (spread 0.306). Lane: 2.404, which is 0.45–0.75 under every HEAD reading.
   - HEAD webkit light: 2.911–3.124 (spread 0.213). Lane: 2.85, which is 0.06–0.27 under.
   - Chromium is flat run to run and the lane is higher: HEAD 2.69 / 2.32 against lane 2.812 / 2.404.
3. **The deck card's ring stays mostly hidden on this tree.**
   - Visible on 23 % (light) and 40 % (dark) of 1,512 perimeter positions, both engines.
   - The charter's premise was a larger offset that clears the sketch. That is **refuted**: the card's sketch is drawn 4–8 px out (`HandDrawnOutline :outset="6"`, stroke 4), so larger offsets lose ground until 7 px.
     - 5 px: 12 %.
     - 6 px: 25 %.
     - 7 px: 48 %, with 0.59 px of air at the end cards, under LAWS P5's 4 css px of daylight.
   - The clear window is INWARD: offset 0 gives 51 % / 79 % visible, worst 3.88–3.93 / 3.60–3.73, 0 under 3, with 7.59 px of air.
   - Arm D0 is BUILT and read on both engines. It is not applied, because the chair booked the deck's offset for the deck's owners (pass6 CHAIR-RULINGS §1.4).
   - G-ABS-3's deck row bands only 5 (light) and 12 (dark) of 44 lines. It gates the painted floor, not visibility, so a 20 %-visible ring passes it.
4. **The two-value comparison inverts once dropped stations count.** The ledger statistic lifts the light frame from 2.81 to 3.33 / 3.57 under B and C.
   - At 90 % mass on equal denominators, with dropped stations counted under, the light frame reads A 20/60, B 21–27/60, C 20–21/60. That is **no gain in light**.
   - The dark frame gains: A 20–21, B 13–19, C 4–8.
   - The dark paper loses: A 0, B 9–17, C 3–9.
   - The pass-5 sentence "the two values move contrast from the paper to the frame" holds only in dark.
5. **G-ABS-11's webkit arm reads no ring.** At 393×699 with hasTouch, `focus()` after a Shift press does not match `:focus-visible` in webkit on either arm, so reach is 0. The chromium arm is the only real reading: 19/19 WHOLE on lane and control.
6. **INTAKE §7 row 44 is OPEN.** Its subject change (the foot's drawn edge, M18) lives on §10's trees, not this one.
   - On this tree `.info-btn`'s ring still exists, and its chromium right side still reads 2.608 / 2.418, admitted at 0.068.
   - The painted "i"/"keys" glyph re-read (glyph-text statistic, 2×, both themes) was not run.
7. **Unrun, and struck by name with the reason:**
   - `visual-golden`: grep finds no focus or outline pose in `visual-golden.spec.ts`. Whole-DOM π with focus carries identity instead, and Plant K says the goldens are not identity evidence anyway.
   - The phone perf trace: the resident `d` at 16×16 goes 58,761 → 119,894 B (the segment pin) and was **never priced on a phone**.
   - A real Safari reading (M19).
   - The own-ground vs tinted-fill ring statistic (PAL-TIN's graft).
8. **G-ABS-5's paint reads are one photograph pair.** They reproduce to the third decimal over 3 runs with spread 0.000, but the second-bare-photograph law (A.5.7) is met in the arms probe (H2 column), not in the landed row.
9. **Two gates have no plant.** G-ABS-4/4f's "host REACHED" clause has no planted negative (for example a de-tabbable viewport). G-ABS-11 is a reading, not a gate.
10. **WebKit forced-colours emulation (pass-5 G5) is unchanged.** Highlight resolves to `rgba(128,188,254,0.6)` at every stop. It is emulation-only, and G-ABS-4f asserts equality with the resolved Highlight, not contrast.

## Numbers

### The board ring: three arms, HEAD and I90 on one payload (`mint(4)`, 16×16; cell 0 = frame, cell 1 = paper)

Full rows are in `logs/ring-arms-summary.txt` (DPR 1 and 2, both engines), `logs/ring-arm-I90-summary.txt` and `logs/ring-head-spread-summary.txt`.

The column groups:
- **Ledger method:** blur vs focus, the 3×3 max change, 60 stations per side.
- **Ghost-hidden differencing:** 60 stations along the path, a normal scan at each. A station that paints nothing (d < 8) or misses the mass bar is counted UNDER.

| arm | left-side worst, light (cr / wk) | left-side worst, dark (cr / wk) | whole ring under 3:1 of 240 | core median | stations under 3 of 60 | 90 % mass: frame light / frame dark / paper dark (of 60, n counted) |
|---|---|---|---|---|---|---|
| **A, the tree** (#3a7bc4 @ 0.95) | 2.812 / 2.85 | 2.404 / 2.404 | **78–79 (32.5–32.9 %)** | 3.965–3.997 | 20 | 20 (n40) / 20–21 (n39–40) / 0 (n60) |
| B (#4589d2 / #2f68aa @ 0.95) | 3.334 / 3.389 | 3.088–3.132 / 3.082 | 0–1 | 3.084–3.368 | 0–2 | 21–27 (n40) / 13–19 (n58–60) / 9–17 (n60) |
| C (B @ 1.0) | 3.569 / 3.569 | 3.303 / 3.303 | 0 | 3.28–3.581 | 0–2 | 20–21 (n39–40) / 4–8 (n58–60) / 3–9 (n60) |
| I90 (inset 0.90) | 2.812 / 2.85 | 2.404 / 2.404 | 80 | 3.965–3.997 | 21 | 21 (n39) / 21 (n39) / 0 |
| HEAD 74a2b5d9 | 2.69 / 2.911–3.124 | 2.32 / 2.851–3.157 | cr 43–51 · wk 24–41 | 3.679–3.763 | 6–14 | 6–21 (n39–54) / 7–21 / 0 |

- **The corner station.** The ghost-hidden minimum on the frame cell at DPR 1 is A 1.19–1.48, B 1.22–1.73, C 1.11–1.67 (1–2 stations each), and HEAD 2.32–2.69. At DPR 2 it is A 2.20–2.85, B 3.07–3.33 and C 2.89–3.31. The second bare photograph moves these by ≤ 0.04 except HEAD webkit DPR 2 light (2.313 against 1.735).
- **Visibility plants** (A.5.3, G-ABS-5 in-run, 16×16 light). Faint ink at 0.15 reads paper 1.304–1.316 and frame 1.231–1.252, with 240/240 under. X1 (`opacity: 0` on `.cell-ghost`) and X2 (a transparent stroke and fill) read null, 240/240 under. Each reds the paint, visibility and whole-ring clauses.
- **No arm clears the whole ring.** A fails the frame cell's fraction. B and C fail the corner station, and in dark the paper at 90 % mass.

### The chrome cost of B and C (identical on chrome: it is the outline at full alpha)

G-ABS-3 on arms B and C, boil parked (`logs/g-abs-3-armB-chrome.txt`, `-armC-`), tree → arm:

- Page stops: 4.188 → 3.496 (light) and 4.379 → 3.351 (dark).
- `ctrl-btn` and staging: 4.289 → 3.581 and 4.286 → 3.28.
- Guard: 4.153 → 3.459 (webkit light).
- `.icon-btn` webkit dark: 3.603 → **2.813, with 7.4 % of lines under 3**.
- `.info-btn` chromium light: 2.608 → 3.124. It clears, and its admission reds STALE.

### The deck's centre card (`?view=gallery&size=3&board=mint(3)`, PRM, 1280×800 fine)

Tables are in `logs/deck-summary.txt` and `logs/deck-offset-sweep-chromium.txt`.

| arm | offset | visible, light / dark (of ~1,500 positions) | worst, light / dark | positions under 3 | end-card air |
|---|---|---|---|---|---|
| tree | 3 | 23.1–23.5 % / 39.9–40.0 % | 3.77–3.88 / 3.44–3.51 | 0 | 4.59 px |
| **D0** (one declaration) | 0 | **51.4 % / 78.7 %** | 3.88–3.93 / 3.60–3.73 | 0 | 7.59 px |
| HEAD (grey @ 0.4) | 4 | 87.8 % / 62.7–87.7 % | 1.04–1.05 / 1.04–1.05 | **all visible positions** | 3.59 px |

- The chromium sweep reads 0: 51/79 · 1: 49/72 · 2: 33/53 · 3: 23/40 · 5: 12/22 · 6: 25/36 · 7: 48/49 (% light / % dark).
- The viewport is `:focus-visible` at load on every arm, both engines, so the deck ring is a first-impression pixel.

### Geometry, read in the DOM (1280×800)

- **G-ABS-7 and G-ABS-8**, both engines identical; identity 256/256 at the product's recipe. Clearance of the ring's outer ink from its own cell:
  - Product (0.86): +1.639 px at stroke 10, +2.373 at stroke 7.
  - I90 (0.90): +1.027 / +1.761.
  - This wander at inset 1.00: −0.501 / +0.232.
  - **HEAD's own recipe** (roughness 0.4, 2 segments, inset 1): **+1.958 / +2.691**. This matches the chair's A.5 witness to the thousandth.
  - Cell pitch 0.636 px/u. The ghost path is drawn at 0.489 px/u.
- **σ read in the DOM once** (`logs/sigma-dom.txt`, W4, every resident `d` through its own CTM):
  - Lane: 2.419 / 2.407 / 2.443 path units at 4×4 / 9×9 / 16×16, **drawn at 0.767 / 1.177 / 1.195 px**, which is 1.1 / 2.5 / 4.5 % of the drawn edge.
  - HEAD: 0.673 / 0.298 / 0.141 u, drawn at 0.213 / 0.146 / 0.069 px. Max excursion 5.40 u on the lane against 0.375 u on HEAD at 16×16 (×14.4).
  - The critic's "σ ≈ 1.54 px" is σ at the cell pitch (0.636). The ring is drawn at 0.489, so the drawn figure is 1.20 px. The pass-5 comment's 1.02 / 1.03 used a stale boardPx of 556. The DOM reads 636 at 9×9 and 16×16.
- **G-ABS-13, the MA-R table** (`logs/ma-r-table.txt`, desk boardPx re-pointed to the DOM). This is a table, never a verdict. The 16×16 frame shares ink with the ring at every inset: tier 2 frame neg% 59.8 (0.86), 66.4 (0.90), 91.8 (HEAD).

### π driving focus, against 74a2b5d9 (`logs/pi-focus-summary.txt`)

Whole DOM, with a control-vs-control arm in the same run. Poses: cell 0 of 9×9 keyboard-focused, and the deck viewport keyboard-focused. PRM, both themes, both engines.

- 1,117 nodes (cell pose) and 1,815 (deck pose). Node sets match on the lane vs control in 7 of 8 cells. Chromium deck light: 0/4 unmatched (four sun rest-pose images); control vs control there: 8/20.
- `outline-color` differs on every node except one. The base `* { outline-ring/50 }` was deleted, and the token ink applies.
- Every other delta is claimed:
  - The focused cell's struck `:focus-within` pair: outline-offset −1 → 0 and radius 2 → 0. It painted nothing on HEAD (`outline: none`, transparent background).
  - The input's outline width and offset: `none` on both arms.
  - Tier 2's stroke-opacity 0.9 → 0.95.
  - The ghost path rect: 6.92–6.93 px.
  - The deck card's offset 4 → 3 and radius 8 → 0.
  - The viewport's offset 0 → 3: `none` on both arms.
- One unclaimed paint delta, chromium deck light `svg.rest-pose` opacity, is also in the control-vs-control floor (the sun's phase).
- **Correction to the tree's own comment.** `.live-face-slot` computes a 0 px radius blurred and focused, on HEAD and lane, both engines (`logs/live-face-slot-radius.txt`). Its parent is `.game-card-face`, and `border-radius` does not inherit past it. GameCard.vue's claim that HEAD's 0.5rem "rounded the projected live board's clip by 8px" was false. The sentence is struck.

### The chrome floor on this tree, boil parked (G-ABS-3, both engines; `logs/landed-lane-v3.txt`)

Worst, light / dark, chromium | webkit:
- Home page stops: 4.188 / 4.379 | the same.
- `ctrl-btn`: 4.289 / 4.286.
- `.icon-btn`: 3.574 / 3.614 | 3.494 / 3.603.
- `.info-btn`: 2.608 / 2.418, admitted at 0.068 | 3.6 / 3.004.
- **Deck card**: 4.188 / 3.739 (5 / 12 lines banded) | 4.048 / 3.788.
- **Staging**: 4.289 / 4.286.
- **Guard face**: 4.227 / 4.346 | 4.153 / 4.283.

**Forced colours** (G-ABS-4f):
- Every drawn ring, the three descendant hosts included, paints the resolved Highlight: chromium `rgba(5,0,73,0.8)`, webkit `rgba(128,188,254,0.6)`.
- Control, the staging face on CanvasText: reds.
- On the control tree, the chromium deck card and staging paint `rgb(0,0,0)`.

### Law 39's tab, parked, both statistics (`logs/law39-tab-three-arms.txt`, two bare photographs, identical)

| arm | chromium light | chromium dark | webkit light | webkit dark |
|---|---|---|---|---|
| tree = HEAD (dashed `currentColor`) | worst 1.043, median 6.246, 15.4 % under (26 lines) | 1.655 / 5.607 / 13.0 % (23) | 3.606 / 12.854 / 0 (23) | 2.903 / 10.23 / 8.7 % (23) |
| L39 (the token) | 4.009 / 4.188 / 0 (14 lines) | 3.558 / 4.379 / 0 (16) | 3.883 / 4.188 / 0 (14) | 3.567 / 4.379 / 0 (16) |

- The token wins at the minimum and loses at the median.
- It bands 14–16 lines against 23–26, because the tab's own drawn edge covers part of it (crop p6-4).
- Law 39 is NOT moved. The deletion stays PROPOSED.

## Charter rows

| row | state |
|---|---|
| 1 G-ABS-5 figure clause | **RE-CUT and shipped with its negatives.** Every numeral token is read against a named allowlist of 12 phrases; `splice` is guarded on `indexOf ≥ 0`. In-run plants: 4.15, 1.8, 2.4:1, 35 %, 4 px, 2,40, and a one-decimal opacity with a stray (it eats nothing). **The pass-5 plant first:** "1.8" planted in `index.css` reds the landed row, exit 1, "every numeral … is a ledger figure" (`logs/break-B1-onedecimal-1.8.txt`). The file was restored by sha1 (c5a90ca7… before and after). |
| 2 frame fraction + regression | LANDED as a gated ledger row ("under 3:1 of 240 light 78 / 78 dark 78 / 78", within 6 stations). The comment says REGRESSION. Break B5 (the count falsified to 40) reds, exit 1. HEAD's count and the webkit left-side regression are declared with spread (gaps 1 and 2). |
| 3 sensitivity de-biased | Dropped stations are counted under and n/60 is printed on every arm. The comparison is restated (gap 4). |
| 4 deck ring | Arm D0 BUILT (offset 0; a larger offset is refuted) and read on both engines. The two "spends LESS air" sentences are struck (`GameCard.vue`, `index.css`). Not applied: chair §1.4. |
| 5 landed spec reaches the hosts | G-ABS-4 walks the gallery and the armed guard, both themes, and each host must be REACHED. Control: `outline: auto` on the guard face. G-ABS-4f adds forced colours (control: CanvasText). G-ABS-3 bands the deck card, a staging face and a guard face. `HOSTS` is live. |
| 6 px figures in the DOM | `pencilConfig.ts` restated from G-ABS-7 and the DOM σ read (0.50 / 1.64 / 0.23 / 2.37 / 1.96 / 1.03 px; σ 0.77 / 1.18 / 1.20 px). G9 is resolved as two scales, both named. |
| 7 ballot rows | Whole-ring, corner and dark-paper rows are in the table above. "No arm clears the whole ring" is said. p5-1 is re-shot with in-frame labels (p6-1). |
| 8 record law | Nothing raw is banked. `logs/` holds classified summaries only (≈ 80 KB of text). The pass-5 raw JSON was already trimmed by the chair's sweep. |
| 9 π drives focus | Done: cell and deck poses, control vs control, both engines, both themes. |
| 10 own rows | `.info-btn` is unchanged here; INTAKE 44 stays OPEN (gap 6). Law 39 is read both engines and both themes at both statistics. G-ABS-9/10/12 are GREEN on the lane and RED on the control (`logs/g-abs-9-10-12.txt`: the control's 3 focus-radius rules and 2 cell focus-within rules; `RING_GEOMETRY` absent there). G-ABS-11 is 19/19 WHOLE in chromium on both arms (gap 5). G-ABS-13 is re-run. visual-golden and the phone trace are struck (gap 7). |
| 11 "one ink cannot clear both" | Softened to "No value this family has read clears both grounds at once". |
| 12 RING_GEOMETRY graft | **WITHDRAWN by the chair** (A.5.1). The witness is restated at HEAD's recipe inside G-ABS-7 (+1.958 / +2.691 px). Nothing is handed to LIVE. |

## Ballots for the owner (U-10, one payload, one variable per adjacent pair)

- **T9-B8, the ring token.** A (tree) | B (two values) | C (B at 1.0), with both statistics and the whole-ring row (table above).
  - Frame: `frames/p6-1-…` (chromium, light and dark, DPR 2, PRM). A|B differ by the two hexes; B|C differ by the opacity.
  - Default stays A per the chair. Its cost is the whole-ring fraction: 32.5 % against HEAD's 10–21 %.
  - B and C cost the chrome 0.7–1.0 of contrast and put `.icon-btn` webkit dark at 2.813.
- **The inset, 0.86 against 0.90.** +1.639 against +1.027 px at stroke 10; whole ring 78 against 80/240. Frame: `frames/p6-3-…` (cell 17, a given, light and dark).
- **The deck offset** (booked for the deck's owners). Tree 3 against D0 0: visible 23/40 % against 51/79 %, 0 under 3 in either; HEAD 88 % with all visible positions under 3. Frame: `frames/p6-2-…` (chromium light, PRM).
- **Law 39** (the chair's row). Dashed against the token, both statistics (table above). Frame: `frames/p6-4-…`.

## Moved rows (PROPOSED, never applied to r0)

- **R1-moved:** as pass 5 (`pass5/prototype/MRK-ABS/probe/law-probe.R1-moved.mjs`). Its truth half is G-ABS-5, which now reads every numeral.
- **R3-a:** unchanged.
- **Law 39:** NOT moved. The deletion is re-banked against this tree as `instruments/law39-tab-ring-deletion.PROPOSED.diff`.

No r0 row moved this pass.

## Battery (each gate bare; the control is a `git archive` of 74a2b5d9)

| gate | lane | control |
|---|---|---|
| `e2e/focus-ring.spec.ts`, whole file, both engines, final dist `CJzSS7mwBmS6` | **0: 10 passed** (3.8 min) | **1: 10 failed**, each for its named reason (`logs/landed-control.txt`): G-ABS-5 computed 0.9; G-ABS-8 identity; G-ABS-4 `auto` ×4 and two inks; G-ABS-4f the deck/staging on `rgb(0,0,0)` (chromium) and the logo off Highlight (webkit); G-ABS-3 logo-trigger |
| the same on the pre-comment dist `CGzXVLrpeQgX` | 0: 10 passed (4.1 min) | — |
| break B1: "1.8" in the ledger | 1 (figure clause) | — |
| break B5: count → 40 | 1 (whole-ring clause) | — |
| lint:lanes · lint:theme-tokens · lint:theme-selectors · lint:sleep · lint:motion · lint:copy · lint:ink | 0 each | 0 each |
| test:e2e:projects · check-pw-projects · check-copy-register (M16) | 0 · 0 · 0 | 0 · 0 · 0 |
| `eslint .` · `npm run lint` (scoped prettier: src, scripts, ../../scripts, ../relay) | 0 · 0 | 0 · 0 |
| `vue-tsc -b` · typecheck:e2e | 0 · 0 | 0 · 0 |
| `check-property-block.mjs` (pass6 instrument, source) | 0 | 0 |
| undefined-token census (pass6 instrument) | 1 = the one declared STALE `--refuse-dur` row, 0 findings (GREEN net, A.1 ruling 4) | 1, the same row |
| vitest, per-directory chunks | 0: 68 files / 830 tests | 0: 68 / 830 |
| filter census, light and dark, both engines, served dist | 1: 20 passed / 4 failed | 1: the same 4 (dark G3.1/G3.3, the inherited `svg.crayon-heart.idle ⟨saturate(0.85)⟩`, declared; the chair's fold pick) |

- Light is 12/12 on both trees, and filterBudget stays 9.
- The diff adds no `@property` and no filter.
- `e2e/` stays in `.prettierignore`. The spec is inside `eslint .` and `typecheck:e2e`.

## Frames (4, each ≤ 150 KB, 82 KB in total)

| file | engine · theme · viewport · pointer · payload | retires |
|---|---|---|
| `p6-1-ballot-three-arms-labelled-cell0-16x16-light-dark-chromium-dpr2-fine-prm.png` (27 KB) | chromium · light and dark · 1280×800 DPR 2 · fine · `mint(4)` cell 0, PRM | `p5-1-ballot-three-arms-cell0-16x16-light-dark-chromium-fine.png` |
| `p6-2-deck-ring-offset3-vs-offset0-light-chromium-fine-prm.png` (22 KB) | chromium · light · 1280×800 · fine · `?view=gallery&size=3&board=mint(3)`, PRM | `p5-4-deck-centre-and-armed-guard-lane-vs-control-light-webkit-fine.png` |
| `p6-3-inset-086-vs-090-cell17-16x16-light-dark-chromium-dpr2-fine-prm.png` (21 KB) | chromium · light and dark · 1280×800 DPR 2 · fine · `mint(4)` cell 17, PRM | `p5-2-inset-086-vs-090-cell0-16x16-light-dark-chromium-fine.png` |
| `p6-4-law39-tab-dashed-vs-token-light-dark-chromium-dpr2-fine-prm.png` (11 KB) | chromium · light and dark · 1280×800 DPR 2 · fine · `mint(3)`, PRM | none. A new pair. `p5-3-forced-colours-…` is retired without a replacement; its numbers are now G-ABS-4f |

Each frame carries its arm label in-frame. The boil is parked in all four, so the sun's phase and the grid's pose are not variables.

## Replay route

- In place. The chair banked the pass-5 tree as `pass5.diff`, verified to apply on a clean `74a2b5d9`.
- At pass-6 start the tree matched the pass-5 README: 13 files, +193/−62, plus the 518-line spec.
- Pass 6 edited `index.css` (the ledger row, the regression, the softened claim, the struck offset sentence), `GameCard.vue` (two false sentences struck), `pencilConfig.ts` (DOM px) and `e2e/focus-ring.spec.ts`.
- Line-count check: `git diff --shortstat 74a2b5d9` reads 13 files, +202/−62, plus the 715-line untracked spec.
- To replay onto a clean `74a2b5d9`: `git apply --3way` of `git diff --binary 74a2b5d9`, plus the spec as a new-file hunk. The chair cuts `pass6.diff`.

## Incidents

1. **The probe variable `on` was shadowed** (the cell label and the photograph shared a name). The first ring run printed a function as its label. It was killed by PID after 13 rows and re-run whole. Its readings matched the re-run and are not cited.
2. **G-ABS-4's first gallery run red on a disabled `ctrl-btn`**, which never takes focus. The walk now skips a stop that does not take focus, with the same rule in G-ABS-4f.
3. **Port 4243 was held by another lane** when arm D0 started, so `--strictPort` refused it. It was re-served on 4244. The scan now runs before every bind.
4. **The first deck sweep assumed a larger offset would clear the sketch.** It lost ground (5 px: 12 %), so an inward sweep was added. The charter's premise is reported refuted (gap 3).
5. **The first G-ABS-11 run passed `preventScroll`.** Stops below the card's fold then read as clipped (−54 / −136 px). It was re-run letting focus scroll them into view, as a Tab would. The first run is not cited.
6. **The first p6-1 crop was taken with the boil live and its labels were truncated.** It was re-shot under PRM with shorter labels. The first file was moved to `<scratchpad>/trash-mrkabs6-1/`.
7. **A comment-only edit to `GameCard.vue`** (striking the false `.live-face-slot` sentence) moved the dist identity from `CGzXVLrpeQgX` to `CJzSS7mwBmS6`. The two dists were diffed and are identical under masking, and the landed spec and filter census were re-run on the final one.
8. **The L39 G-ABS-3 run was started, then superseded** by a dedicated tab probe, because G-ABS-3 stops at the tab's STALE admission. The run had already exited when the kill was sent, and nothing from it is cited.
9. **Scratch hygiene.** No `rm` of any kind was run. Everything scratch lives under `<scratchpad>/mrkabs6-*` and `trash-mrkabs6-*`, and the in-tree `.mrkabs6/` was moved out before the battery. The work tree's `git status` is product files only. All seven servers (4239, 4240, 4241, 4242, 4244, 4246, 4247) were killed by recorded PID and the ports read free. At return, 4241 and 4242 were re-bound by another lane's servers (`scratchpad/tincrit6`, started after this lane released them). They are not this lane's and were left alone.

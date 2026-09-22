# PASS-4 PROTOTYPE · MRK-ABS · The absolute ring

It RUNS. Work tree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39`,
off `74a2b5d9`, uncommitted, **12 files, +197/−62** (pass 3: 13 files, +180/−66; `DrawerTab.vue`
left the diff, see row 5). π control `74a2b5d9` = the chair's `w7-control` dist, served
read-only on `:4240`, verified by `index-CubiZsMVSwTc.js`. Lane dev server `:4239` (private
cacheDir), this tree's built dist `:4241` (`index-CwmyA5rfIqi3.js`, own cacheDir). All three are
killed by PID; 4239–4241 read empty at return. Every board row loads a REAL encoded `?board=`
(the app's codec: `base64url("\x01" + "<sub>.<cells base36>")`, cells 0 and 1 empty, verified
still in the URL after load, both engines).

**Replay route: in place.** The chair reset this tree to `pass3.diff` on 2026-09-22. At start,
`git diff --stat` read 13 files +180/−66, matching the pass-3 README's list; no replay was
needed. One untracked leftover came with the patch (`web/frontend/.p3-mrkabs/`, pass 3's scratch
probes, 14 files); it tripped `lint:eslint` and is deleted. The record keeps it in `pass3.diff`.

---

## 0 · Gaps first (every one still open)

1. **The 16×16 frame row is still RED on the shipped value**: 2.81 / 2.85 light, 2.40 / 2.40 dark
   (WORST of 60, chromium / webkit). The colour axis moves it (row 1 below). Closing it is the
   owner's ballot, not this lane's edit.
2. **The dark two-value window does not survive pin-with-headroom.** Its ceiling is **3.08** on
   both board grounds (#2f68aa: frame 3.088 / 3.082, paper 3.084 / 3.096). PAL-TIN's rule wants
   3.10. It clears 3:1 bare, by under 0.1. Contrast here is luminance only, so no hue buys more at
   stroke-opacity 0.95.
3. **The two-value arm costs the chrome.** Painted, both engines: light page 4.19 → 3.50, card
   4.29 → 3.58; dark page 4.38 → 3.35, card 4.29 → 3.28. It also **puts a new stop under the
   floor**: `.icon-btn`'s rounded left side in dark, **2.85 / 2.81**, 2 of 27 samples. What it
   buys: the frame crossing (to 3.33 light / 3.08 dark) and `.info-btn`'s right side (3.12–3.28).
4. **`.info-btn`'s right side stays under the floor on the shipped value**: 2.61 light / 2.42
   dark chromium, 3.60 / 3.00 webkit, **3 of 44 samples** in chromium. The ground is named: the
   controls card's drawn case edge (`.outline-container.drawer-case`, 15 of 15 probe points);
   the worst-sample grounds are that edge's ink, `[58,58,57]` light and `[193,193,189]` dark.
   This is a layout row. It rides T9-B8, since the default moves the bar to `#card-foot`.
5. **The deck's centre card: banded, but not steady.** The ring reads on only **4 to 13 of 44**
   sample lines. The rest sits under the card's own drawn outline or is clipped by the scrollport.
   Chromium dark read **3.78 in one run and 1.81 (2 of 11) in the next**, on the same code,
   beside the live board's boiling edge. Webkit reads 3.56. Light reads 4.08–4.19.
6. **Forced colors (chromium, emulated): three stops fail.** The base rule paints `Highlight`
   at **11.31** on every token stop. The three stops whose outline lives in an UNLAYERED host rule
   are out of reach of the `@layer base` forced block: the deck card, the staging faces and the
   guard faces. The UA paints those CanvasText black. The deck card reads **1.08, 19 of 44 under
   3**, because the black ring lands on the card's black drawn edge. Staging reads 11.79, guard
   5.77. The tab in its law-39 form reads 1.69. WebKit's emulation matches the media query but
   forces no palette, so `Highlight` resolves to `rgba(128,188,254,0.6)` and reads **1.21–1.48 on
   light**. Safari ships no forced-colors mode, so this is an emulation regime, not a shipped one.
   It is still a hazard for any engine that matches without forcing. Unfixed.
7. **Law 39's tab (row 5): neither form clears 3:1 at every sample.** Numbers are in
   `instruments/law39-tab-ring.PROPOSED.md`. Both forms' worst samples move run to run.
8. **G-ABS-5's born-RED reds 5 of 6 rows, not 6.** The 16×16 dark-frame row moves only
   0.084–0.088 under the 0.9 ablation, inside the ±0.10 tolerance. The gate as a whole goes RED
   (opacity clause and paint clause), but that one row cannot see an opacity move of this size.
9. **The two-value arm is not BUILT.** It is `instruments/two-value-ballot-arm.PROPOSED.diff`,
   which passes `git apply --check`. It was measured by injecting its two declarations at runtime.
10. **f = 0.90 is a frame only** (crop C). MA-N, σ and the MA-R table were not re-measured at 0.90.
11. **Pass-3 geometry gates not re-run**: G-ABS-1/2/7/8/9/10/11/12/13. `pencilConfig.ts` and
    `gridPaths.ts` are byte-identical to pass 3's hunks. The π census below confirms the only
    rect deltas are the 81 ghost paths.
12. **π has no head-vs-head negative control this pass.** WebKit dark showed 8 pose-opacity keys
    (`img.rest-pose`, `g.boil-pose`, `image.boil-frame-bitmap`). The same keys appeared in chromium
    dark in one run and in neither engine in the run before. Read as a boil-phase race, unproven.
13. **No coarse-pointer, phone or 844×390 row ran this pass.** The charter names none. Pass 3's
    G-ABS-11 dock reading (393×699) is not re-taken.
14. **G-ABS-4 is scoped and restated.** Five games × two themes × two engines at 1280×800, 9 stops
    each. That count includes the dev-only `tuner-toggle`: the route census ran on the dev server.
    Every route reads ONE token colour `rgb(58,123,196)` and 0 `auto`, **plus law 39's dashed
    `currentColor` on the tab**. With the tab restored, "one colour" means one token colour plus
    law 39's third form. Arrival is same-frame on every stop.
15. **MRK-LIVE's `gameCell.css` rows still ride this diff**: tier 2 at 0.95, the struck
    fallbacks, the `:294` deletion. They are cited, not owned (chair §6.6), and leave at the fold.
16. **Not run:** `visual-golden` (no re-mint in the loop), the phone performance trace, the
    estate a11y suites (`spoken-gallery` / `access` / `a11y`).

---

## 1 · Charter rows, with the numbers that hold them

### Row 1 — the two-value search, then the sentence (CLOSED as a ballot, gap 2/3 stand)

Painted board search, 16×16, 60 samples per side, WORST / MEDIAN, chromium | webkit. The full
ladders are 10 values dark and 9 light, plus a fine pass: `logs/board-search{,-fine}-*.json`.
The critic's four figures reproduce exactly (2.404, 3.989, 3.168 / 3.004, 3.171).

| value | dark frame | dark paper | light frame | light paper |
|---|---|---|---|---|
| `#3a7bc4` shipped | 2.404 / 2.404 | 3.989 / 3.997 | 2.812 / 2.850 | 3.972 / 3.965 |
| `#3a7bc4` @ 0.9 (law 39's opacity) | 2.312 / 2.316 | 3.763 / 3.755 | 2.693 / 2.693 | 3.679 / 3.685 |
| `#2f68aa` (dark balance point) | 3.088 / 3.082 | 3.084 / 3.096 | — | — |
| `#2f66a8` (critic) | 3.168 / 3.161 | 3.004 / 3.010 | — | — |
| `#4589d2` (light balance point) | — | — | 3.334 / 3.389 | 3.368 / 3.353 |
| `#4285ce` (critic) | — | — | 3.171 / 3.219 | 3.536 / 3.524 |

Every ground is the same pixel in both engines: frame `[49,49,49]` light / `[199,197,190]` dark,
paper `[253,253,252]` / `[19,18,17]`. Chrome under the two-value arm, both engines (from
`logs/census-two-summary.txt`): see gap 3.

`index.css`'s "No colour fixes that" is gone. Its declaration comment now carries the measured
window, its cost (two new hexes against law 23, R1's one declaration) and the dark ceiling.
It says the choice is the owner's (U-10). The `.dark` block's comment is rewritten the same way.

### Row 2 — the three unbacked figures (CLOSED)

`2.71`, `2.44 "both engines"` and the unnamed `3.97 / 3.99` are struck. Every board figure in
the comment is now a LEDGER row that names its board, ground, theme, engine, statistic (WORST
of 60) and opacity (0.95). The paper rows' worst equals the median at 16×16. At 9×9, chromium
light's worst is 3.92 against a median of 3.97, and the ledger carries the worst. The chrome
figures are painted worsts. The comment names which figures used to be arithmetic.

### Row 3 — G-ABS-5 re-cut (CLOSED; gap 8)

`probe/p4-gabs5.spec.ts` parses the ledger out of `index.css` and reads tier 2's
`stroke-opacity` out of `gameCell.css`. GREEN needs (a) ledger opacity == source == the painted
ring's computed value, and (b) every painted WORST within 0.10 of its row. Run 3
(`logs/gabs5-run3-green-and-born-red.log`), both engines:

| arm | opacity clause | paint clause | verdict |
|---|---|---|---|
| the tree (0.95) | GREEN (0.95 / 0.95 / 0.95) | GREEN, 6 of 6 rows, max \|Δ\| 0.005 | **GREEN** |
| runtime ablation → 0.9 | RED (computed 0.9) | RED, 5 of 6 rows (Δ −0.117 … −0.291) | **RED** |
| source text mutated → 0.9 (in memory) | RED | — | **RED** |

Run 1 (`logs/gabs5-run1-ledger-incomplete.log`) is a born-RED of its own: the 9×9 row was a
placeholder, and the gate read RED on it in both engines.

### Row 4 — R1 re-pointed (CLOSED, MOVED)

`instruments/R1-MOVED.md`, probe `probe/law-probe.R1-moved.mjs`. The moved R1 reads RED on the
control, GREEN on this tree, and RED on the two-value arm. r0's own sentence reads the opposite
on the two-value arm. The two wordings split exactly on the ballot.

### Row 5 — law 39 (REVERTED in the tree; the deletion is PROPOSED)

Per pass4 CHAIR-RULINGS §1.3, `.drawer-tab:focus-visible { 2px dashed currentColor; offset 3 }`
is restored, byte-identical to `74a2b5d9`. The deletion is
`instruments/law39-tab-ring-deletion.PROPOSED.diff`. The painted AA of both forms is in
`instruments/law39-tab-ring.PROPOSED.md`. Tier 2's opacity is **0.95**, the value §6's leader
names (MRK-LIVE pass-4 §1.9–1.10). The ledger comment states it, and G-ABS-5 reds when it moves.

### Row 6 — G-ABS-3 as n/8, the clip widened (CLOSED as a reading; gap 4)

The band now reads along each side's normal across the element's OWN `outline-offset + width`
(the toggle's 54 px ring is in reach). The changed pixel must BE the computed outline ink
(isTheRing): the first cut of this run read the attribution card opening on focus as a ring.
Home route, shipped value, worst per stop:

| stop | light c / w | dark c / w |
|---|---|---|
| `.attribution-trigger` `.logo-trigger` `.sun-moon-toggle` (54 px offset) | 4.188 / 4.188 | 4.379 / 4.379 |
| `.ctrl-btn` | 4.289 / 4.289 | 4.286 / 4.286 |
| `.icon-btn` (radius 8, left side) | 3.574 / 3.494 | 3.614 / 3.603 |
| `.info-btn` (right side) | **2.608** / 3.600 | **2.418** / 3.004 |
| `.drawer-tab` (law 39 dashed) | 1.043 / 3.377 | 1.263 / 1.085 |
| `.cell-native-input` | exempt (the ghost is its mark) | exempt |

That is **7 of 8 stops banded, 2 with samples under 3**. With the deck card and the guard faces
the walk bands **9**; the 8th home stop is the exempt cell input.

### Row 7 — the deck's centre card (BANDED; gap 5)

It is banded through a host map (`.gallery-viewport` → `.game-card.is-center`, `.staging-btn` →
`.staging-face`, `.guard-btn` → `.guard-face`). Light 4.188 / 4.188, dark 1.81–3.78 / 3.56.
Coverage is 4–13 of 44 lines.

### Row 8 — G-ABS-4 across the five games (CLOSED as scoped; gap 14)

`logs/routes-gabs4.log`, re-run after the last CSS edit.

### Row 9 — forced colors by instrument (EXECUTED; gap 6)

`logs/census-forced.log`, `logs/census-forced-summary.txt`.

### Row 10 — crops 2 and 4 (TAKEN)

Crop C is f = 0.86 vs 0.90. The 0.90 arm is a transient edit to `RING_GEOMETRY.inset`, reverted
and diff-verified. Crop B's lower panel is the armed guard: dirty board, deck, step to kenken,
`deal`, keyboard focus on the `deal` face.

### Grafts

- **Taken:** MRK-LIVE's `--ring-ink` (`index.css`, copied with its cite), consumed BARE at all
  five chrome sites as `outline: 2px solid var(--ring-ink)`. Pass 3's `--focus-ring` shorthand is
  struck; one name for the ink is left. `lint:theme-tokens` read **RED** when the ink was
  consumed only inside another custom property (`logs/theme-tokens-RED-…log`), then GREEN.
- **Applied, not a graft:** PAL-TIN's pin-with-headroom rule is used as the judge in gap 2.

---

## 2 · Guards, all run BARE

| guard | reading |
|---|---|
| `vue-tsc -b --noEmit` | exit 0 |
| vitest, chunked in 10 runs | **68 files / 830 tests**, all exit 0 (`logs/battery-summary.log`) |
| `lint:theme-tokens` | exit 0 (52 declared, 0 dead; negative control RED as required) |
| `lint:theme-selectors` `lint:ink` `lint:motion` `lint:copy` `lint:knip` | exit 0 |
| `lint:eslint` | exit 0 (after the scratch dirs left; it read `.p3-mrkabs` and `.p4-mrkabs` before) |
| prettier (`npm run lint`) | exit 0, after `--write` on `AttributionCard.vue` + `OptionSelector.vue` (pass 3's class order) |
| `check-copy-register` bare | 0 em/en dashes, 0 unadmitted jargon, lexicon 25, exit 0 (the diff adds no rendered string) |
| filter census, BUILT dist, both engines | `e2e/filter-census.spec.ts` **12 passed** on `:4241` (`index-CwmyA5rfIqi3.js`) |
| r0 law probe (moved-R1 copy) | L1–L6 GREEN; R1 GREEN (moved); R2, R3 RED (other families') |
| hue census | byte-identical, control vs prototype |
| undefined-token check (the diff's added `var()`s) | `--ring-ink`, `--focus-offset`, `--color-focus-sketch`, `--color-crayon-blue` each declared |
| π vs control, dist vs dist, home 9×9 pinned, both themes, both engines | 1097 / 1097 nodes, tags identical; **0 paint deltas** in 3 of 4 arms (gap 12 for the 4th); rect deltas ONLY `path.cell-ghost-path` ×81, max 6.93 px (the claimed ring geometry) |

---

## 3 · Frames (3 crops, 77 KB in total; each a REPLACEMENT)

| file | engine · theme · viewport · pointer | retires |
|---|---|---|
| `frames/p4-A-ballot-cell0-frame-16x16-one-vs-two-light-dark-chromium-fine.png` (15 KB) | chromium · light (top) + dark (bottom) · 1280×800 · fine, keyboard modality · 16×16 cell 0 focused, left = one value, right = two value, 4× nearest | pass3 `frames/crop1-cell0-frame-dark-16x16-proto.png` |
| `frames/p4-B-deck-centre-and-armed-guard-light-webkit-fine.png` (55 KB) | webkit · light · 1280×800 · fine, keyboard modality · deck centre card focused (top), armed guard with `deal` focused (bottom) | pass3 `frames/crop3-deck-centre-focused-light-webkit.png` |
| `frames/p4-C-inset-086-vs-090-cell0-16x16-light-chromium-fine.png` (7 KB) | chromium · light · 1280×800 · fine, keyboard modality · 16×16 cell 0, f = 0.86 (left) vs 0.90 (right), 4× | `research/MRK-ABS/readings/crop1-corner-frame-light-16x16-head.png` |

Both pass-3 crops named above were already absent from `pass3/prototype/MRK-ABS/frames/` when this
pass opened (the directory is empty). They are retired by name.

---

## 4 · Ballot and fork rows for the owner (U-10)

- **The ring's token: one value vs two** (law 23 vs the frame crossing). Frames: crop A, both
  arms, both themes. The one value keeps the frame row RED (2.40–2.85) and the chrome at 4.19–4.38.
  The two values (`#4589d2` / `#2f68aa`) lift the frame to 3.33 / 3.08. They cost two new hexes
  and R1's one declaration, drop the chrome to 3.28–3.58, and put `.icon-btn`'s dark corner at
  2.81–2.85. The dark arm's margin is under 0.1. **Default: one value** (the chair's lean, law 23
  as written). Diff: `instruments/two-value-ballot-arm.PROPOSED.diff`.
- **Inset 0.86 vs 0.90** (the pass-2 banked alternate). Frames: crop C. Only the frame is new
  this pass (gap 10). **Default: 0.86.**
- **Law 39's tab form** is the chair's row, not a ballot: it is REVERTED and the deletion is
  PROPOSED with its painted AA.

## 5 · r0 / R6 rows MOVED

- **R1**: MOVED (`instruments/R1-MOVED.md`).
- **R3-a**: MOVED in pass 3 (`pass3/prototype/MRK-ABS/instruments/R3-a-MOVED.md`); unchanged.
- **Law 39**: not moved. The tree is back on the law, and the deletion is a PROPOSED diff.

## 6 · Incidents, self-declared

1. The first WebKit board search was **killed mid-run**: a `( … ) &` inside a backgrounded
   shell dies with its parent. It was re-run alone.
2. The first shipped-arm census was **polluted**: the band took the attribution card's
   focus-open pixels as ring (1.259). I stopped it by its recorded PIDs, added the isTheRing ink
   filter, and re-ran it.
3. `p4-gabs5` imported `p4-board.spec.ts`, so the board test **re-ran inside two G-ABS-5 runs**
   and rewrote `board-search-{chromium,webkit}.json` with the same default ladder. The render is
   deterministic and the numbers are unchanged. `readRing` moved into the shared lib.
4. G-ABS-5 run 2, chromium: a **mount race**. A cell list was read mid-mount on the ablated
   arm's 16×16 load. A 900 ms settle was added. `logs/gabs5-run2-chromium-incident.log`.
5. The fine ladder's chromium dark paper row for `#3069ab` read **0 painted samples** (null);
   it was not re-run.
6. The last CSS edits came after the band census: `--focus-ring` struck, `--ring-ink` bare.
   The computed outline was re-verified by the route census (same colour and style, all five
   games, both engines), and the filter census and π ran after them. The band numbers were
   not re-taken.
7. Two comment claims I first wrote were false and were corrected before return: "both arms
   built" (the two-value arm is not built) and "deck 3.56 dark" (chromium read 1.81 in the
   final run).

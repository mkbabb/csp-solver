# PLR-SELF · pass 6 (PROTOTYPE): the space measured, the edge that paints, the seam's second arm

T9-W7 §11's leader. This pass advanced IN PLACE in `.claude/worktrees/w7-p4-PLR-SELF` (branch
`w7/p4-plr-self`). Base and π control are **`74a2b5d9`**. Nothing is committed. Under U-10 this lane
proposes and the owner disposes. The pass-6 number is the critic's.

| | |
|---|---|
| worktree diff | **24 files, +1,901 / −402** vs `74a2b5d9` (pass 5: 23 / +1,762 / −401). Pass 6's own delta over `pass5.diff` is **6 files, +334 / −196** (`pass6-delta.diff`, 37,207 B). Of that, product `src/` is **+108 / −87**: `PlayerMark.vue` +65/−61, `HeadSheet.vue` +21/−6, `useSession.ts` +16/−20, `App.vue` +6/−0. The rest is the unit `useSession.test.ts` (+24/−1) and the spec `player-mark.spec.ts` (+202/−108) |
| replay route | **In place.** Nothing was replayed. Before any file was touched, `git diff --stat` matched the pass-5 README (23 / +1,762 / −401). The five files this pass edits were `cmp`-identical to a clean `git archive 74a2b5d9` with `pass5.diff` applied (`git apply --check` 0, apply 0) |
| `substrate.diff` | **Re-banked here** for COUNT and PLACE: 140,664 B, sha1 `6bd899d54199`, 24 patches, `--binary`, the scratch `.plr-self/` excluded. On a clean `git archive 74a2b5d9` (web/frontend + LEDGER.md), `git apply --check` exits 0 and apply exits 0. **All 24 files are byte-identical** to the tree (`cmp`, 0 mismatches) |
| dists cited | **FULL `index-ClQ9zdg0iHHI.js`** (the shipping const) and **QUIET `index-DtXPs5DQ4FGs.js`** (`EDGE_QUIET = true`, flipped for the build, then restored with sha1 verified). Each has 43 files, the same as the control's 43. Both were built after the last source edit, with every scratch file outside the tree. The first pair (`DGCZG1r5ObmH` / `CF8eOMmR5Vjc`) predated a prettier fix and was rebuilt and re-read (incident 5) |
| servers | dev `127.0.0.1:4241` (private cacheDir in the scratchpad) · control dist `:4230` (`index-CubiZsMVSwTc.js`, verified by hash) · FULL `:4231` · QUIET `:4233`. Every server was killed by its recorded PID before return |

## 0 · Gaps first (what still holds this family)

1. **Landscape keeps four rows, and that has a price.** The measured key compresses only when the
   board runs under the rows from where they start. On a coarse landscape phone the board sits
   beside them (board left 241 / 232.5), so the sheet keeps four rows and laps extra cells:
   - 844×390, 9×9: 6 cells, against 4 for one row.
   - 812×375, 9×9: 5, against 3.
   - 844×390, 16×16 (the widest board): **9, against 6**.
   - 812×375, 16×16: **18, against 12**.

   The comment now says this and the record prices it. The code is not changed. Compressing in
   landscape without compressing the desk (CH-71's ratified corner lap: 2–3 cells, one row laps
   1–2) needs a third fact the key does not read. That arm is **unbuilt**. The chair already reads
   the landscape cell as ONE π row across four trees (pass6/CHAIR-RULINGS §1.4).
2. **The state line fails the glyph-text median in light at DPR 1.** Core median 3.52 (ch) / 3.25
   (wk), against a floor of 4.5. The control's own shipped `@mbabb` caption reads worse under the
   same instrument: 2.97 / 2.94. The fraction of core pixels under 4.5 is 0.61 / 0.71, against the
   caption's 0.88 / 0.90. At DPR 2 the line passes (5.159, fraction 0.30 / 0.36). **In dark the
   median passes (5.50–6.10), but the fraction (0.21–0.23 at DPR 1) is ABOVE the caption's
   (0.03–0.04).** The caption is a different ink at full alpha, so the "control + slack" bound does
   not hold in dark without a slack of about 0.2. This is the hand's tag rung, **T9-R6** (the
   chair's estate row, pass6/CHAIR-RULINGS §1.4). No floor is landed here.
3. **The quiet-ink edge arm is thin in light.** Its stroke median is 4.34–4.40 on the card and
   4.38–4.66 on the lobby, but **22–26 % of its columns sit under 3.0** in light (9–16 % in dark).
   The full arm has 3.3–5.2 %. Both arms beat the control hairline (1.06, 100 % under 3.0), so
   neither firing default loses to the control. But the quiet arm fails §2.4's fraction statistic
   more often than the full one. It is the owner's pick (U-10), and that number goes with it.
4. **Nothing standing reads the head is only half closed.** The re-cut `:566` row now reads paint
   (row 3), and L5b is keyed on every consumer (row 4, the chair's instrument). But the goldens
   (4/4 on both dists) and `visual-regression` still contain neither the mark nor a sheet, and r0's
   landed L5 still reads the guard verbs until the chair lands L5b.
5. **Every room row is dev-vs-dev.** That covers the seam's wire reading, F1's deck row, the band
   census and the edge-tap probe (`?wire=local` is DEV-only). This is W8 §8.3's relay arm, and it
   is inherited.
6. **I have not seen COUNT's and PLACE's leader rows closed.** They run in batch 5, after this lane:
   COUNT's G14 painted-text dark arm, arm (c) under 2.5.3, frames 2/3 on one payload; PLACE's
   K-GHOST cure and the outside-edge band. PLACE's ghost lives in PLACE's chart (`PlayerMark.vue`'s
   leave loop in PLACE's tree). This tree has no chart and no per-key timer map, so there is
   nothing here to cure.
7. **Inherited, unmoved:**
   - `visual-regression.spec.ts:790` in WebKit (**1228.06 > 1227.5 on BOTH dists**, T9-R3).
   - The dark `filter-census` count: 11 on both arms, the chair's `crayon-heart` fold pick.
   - The undefined-token census's `STALE --refuse-dur` row (exit 1 on both trees).
   - The accent-family law (PAL-WALK), r0 I4/I5, and M19 real iOS: whether a real iOS tap on a
     prevented `<button>` behaves like the emulated one.
   - `multiplayer.spec.ts:962`, which is env-gated (1 skip per engine).
8. **The seam's price moves with the arm.** Under (b), dismissing the sheet with a tap ON it (2 px
   inside its bottom edge) sends focus to BODY in Chromium. The cell lets go, so the room hears
   `null`. In WebKit the same tap focused the cell beneath (edge-tap probe, §2.6). Under (b) a tap
   on the mark is a look, and a tap on the open sheet is still a look-away in Chromium.

## 1 · The charter's eleven rows

| # | row | pass-6 reading | state |
|---|---|---|---|
| 1 | the short-band key MEASURED | The media query is **deleted**. `fit()` runs at the open and whenever the room's size changes while the sheet is open. It renders tall, then reads the sheet's own untransformed offset box and the board's box (`App.vue` passes a `.board-peek-host` reader; pencil imports no board). It compresses when `board.left ≤ rows' start && board.top < sheet bottom`. **390×800 and 360×800 now draw 1 row and lap 0** (pass 5: 4 rows, 7 lapped). 390×799, 390×820 and 430×800 also lap 0. 390×844 keeps 4 rows and laps 0. A 29-char quiet slug that wraps at 390×844 compresses (lap 0). The landed row is `a portrait phone compresses exactly where four rows would lap the board`. In the same run it evaluates the pass-5 query as FALSE at 390×800 / 360×800. **R1** (the pass-5 query restored) reds it in both engines. **R1b** (the board-under-rows clause struck) reds the desk row and this row in both engines. **R1c** (a one-line row-count height in place of the measured box) reds the long-slug cell in both engines. A rAF + MutationObserver sampler over 6 opens in both engines found **0 painted tall frames**: the 4→1 flip lands 0–1 ms apart inside one task (§2.1) | **closed** |
| 2 | the landscape +2 | Priced (gap 1). The `PlayerMark.vue` comment is corrected with the 9×9 and 16×16 figures. The row asserts 844×390 → 4 rows, `lapped: 6`, stated, not denied | **priced, not cured** |
| 3 | `:566` on paint | The re-cut row is `both head disclosures paint a drawn edge and no CSS border`. It photographs the top band twice, edge ON and then `.head-sheet-edge { visibility: hidden }`, and counts the columns whose best contrast against the sheet's own ground rises ≥1.5× with the edge on. It needs >0.9 of the middle 60 % on both sheets. **X1** (`opacity: 0`) and **X2** (`color: transparent` + `stroke: rgba(0,0,0,0)`) are planted in-run and must read **0**. As **file** breaks both red the row in both engines (0 received). **B5** (the border back) still reds (8). The row passes on both edge-arm dists (it is an EXISTENCE reading; the contrast is in §2.2) | **closed** |
| 4 | L5b at every consumer | The chair's `pass6/instruments/l5b.mjs` on this tree: **GREEN, 8 sheet sites** (`.hover-card`, `::before`, HeadSheet ×5 incl. `.is-quiet`, `.player-lobby`). `l5b.plants.mjs`: clean GREEN, **plants A–H every one RED** (exit 0). Control `74a2b5d9`: RED (exit 1) | **closed** (the chair lands it) |
| 5 | the lawful edge pair | `const EDGE_QUIET = false` in `HeadSheet.vue` is the one const. `true` adds `.is-quiet` → `.head-sheet-edge.is-quiet { color: var(--ink-press-quiet) }`. Both arms are built as dists and shot on ONE payload with the mark in both arms (crop 1) | **framed** |
| 6 | the corners | **The frame's radius is taken from the ground**: 15 (the 1rem ground less the edge's 1px inset), not 3. Corner pixels outside the 16 px ground that moved ≥40/255 vs the control: **1 of 106** full, **0** quiet, **0** noise, in all four engine × theme readings (pass 5: 67–70) | **cured** |
| 7 | the state line's AA | Read under the glyph-text statistic (§2.3; gap 2). Booked by the chair as **T9-R6** and cited, not re-landed | **cited (T9-R6)** |
| 8 | nothing reads the head | Rows 3 + 4 read paint and every consumer; the goldens and VR still do not (gap 4) | **half** |
| 9 | F1's one name | `export const SELF_TAKES_A_HAND: boolean = true` in `useSession.ts` is the one home. **`SELF_TAKES_ROOM_INK` is struck** (grep 0 in `src/` and `e2e/`). Its consumer is `useSession.test.ts`'s new F1 unit, which reads BOTH paths (`mint` at the join, `adoptInk` from `k`) under whichever arm is set. **U1** (mint ignores the const) and **U2** (adoptInk ignores it) each red the unit. **B6** (const false) reds the deck row in both engines. Files: `src/games/shared/useSession.ts`, `src/games/shared/useSession.test.ts` | **closed** |
| 10 | the seam arm (b) BUILT | `const TAP_IS_A_LOOK = true` in `PlayerMark.vue`. **(b) is the default.** The touch is prevented like the mouse press, the sheet toggles on the touch's own `pointerup`, and Chromium's click for that touch is ignored. `false` is arm (a). **The wire, both engines, one payload** (§2.5): under (b), A taps a cell, then its mark → B still draws A's ring (1 → **1**) and A's focus stays in the cell. Under (a) → B's ring goes (1 → **0**), and A's focus is on the mark (ch) / BODY (wk). The landed row is `a tap opens the mark on a coarse phone, keeps the cell, and tells the room nothing` (0 `cur` frames in a tagged 500 ms absence; the cell keeps focus; a second tap shuts once). Its in-run negative control swallows `pointerup` → shut in BOTH engines. **S1** (arm a) reds both engines. **S2** (no toggle on release) reds both. **S3** (Chromium's touch click toggles too) reds **Chromium only**, because WebKit sends no click for a prevented touch. Crop 3 | **built, framed** |
| 11 | pose floor · dark filters · rooms · VR:790 | Pose floor **70 of 229** inked px move ≥8/255 (ch), **68 of 228** (wk); crop 2, U-10. Dark filters **11 = control 11** (gap 7). Room rows dev-vs-dev (gap 5). VR:790 WebKit declared (gap 7) | **U-10 / declared** |

**Leader duties.**
- **The substrate.** Replayed as `substrate.diff` above, and `pass6-delta.diff` is the pass-6 hunk
  set COUNT and PLACE must take FIRST. Their re-cuts:
  - (i) `PlayerMark.vue`: the module `<script>` block (the `probe`/`shortBand` media query) is
    **deleted**. `ref` now comes from `vue` in `<script setup>`. The budget comes from `cramped` +
    `fit()`, and `boardBox` is a new prop. A chart or a tally in the sheet is measured
    automatically, because `fit()` reads the rendered sheet (so PLACE's 182.38-tall chart and its
    +20.79 wrapped rows enter the key with no law arithmetic).
  - (ii) the seam: `@click.stop="onClick"` + `@pointerup="onRelease"`, and `onPress` prevents
    touch too. PLACE's arm (a) comment is superseded. Under (b), PLACE's chart and the room agree
    after a tap, which is the price PLACE's gap 3 named.
  - (iii) `App.vue`: `boardBox` and `:board-box` on both instances.
  - (iv) `HeadSheet.vue`: `:radius="15"`, `EDGE_QUIET`, `.head-sheet-edge.is-quiet`.
  - (v) `useSession.ts`: `SELF_TAKES_A_HAND` exported. COUNT strips its own copy of the switch.
  - (vi) `player-mark.spec.ts`: the band, tap and edge rows are re-cut. `REGIME`/`PASS4` are gone
    and `PASS5` is added.
- **The wrapper, declared to both.** `AttributionCard.vue` wraps the trigger and the sheet in
  **`div.attribution-disclosure`** (pass 5). It carries the hover/focus handlers so the mark
  sibling cannot open the card. It is static and establishes no containing block (the card's rect
  `{0, 52, 256, 131}` is identical on all four arms). The π census here keys it as transparent,
  and COUNT's semantic-ancestry census should do the same.
- **The height law's longest-string row is landed.** `long-66737` slugs to
  `straightforward-tyrannosaurus` (29 chars). Quiet, it wraps its row to 43.19 px: the tall sheet
  measures 212.13 at 390×1000, bottom 256.1. At 390×844 the measured key therefore compresses it
  (lap 0), where a row-count law (R1c) laps. The law is this family's. The chart's number is
  PLACE's.
- **T9-D2, quoted verbatim** (pass5/CHAIR-RULINGS §1.4); nothing new is landed for it:

> **T8-W3 M14 (the roster fold) and T7-W2 A4 — ONE disposition row, adopted from PLR-SELF's
> draft** (its README §4): REASON retired — a roster inside the controls card was a tab stop
> whose content no keyboard reader could act on; REPLACING SURFACE — the head's mark, a single
> `<button>` in the natural head order whose accessible name IS the state line, the roster kept
> mounted `sr-only` as the room's one `role="log"`; HOLDING GATE — `e2e/player-mark.spec.ts`'s
> keyboard row + `GameControlPanel.liveRegions.test.ts`'s re-cut rows. Booked as **T9-D2**;
> COUNT and PLACE inherit it; SELF quotes it verbatim in its return and lands nothing new for it.
> T8-W3 M14's own frame (the roster fold) is retired by this row, not silently — the owner sees
> the row at the re-look.

## 2 · The numbers

### 2.1 The band census (`readings/regime-census.txt`): dev, seven at the table, both engines identical to ±0.3 px

| cell | pointer | rows | sheet bottom | board top | board left | lapped | one row would lap | pass-5 key |
|---|---|---|---|---|---|---|---|---|
| 390×664 | coarse | 1 + `and 6 more` | 147.4 | 131.7 | 14 | 7 | — | true |
| 390×799 | coarse | 1 | 147.4 | 199.2 | 14 | **0** | — | true |
| **390×800** | coarse | **1** | 147.4 | 199.7 | 14 | **0** (pass 5: 7) | — | false |
| **360×800** | coarse | **1** | 147.4 | 210.3 | 14 | **0** (pass 5: 7) | — | false |
| 390×820 | coarse | 1 | 147.4 | 209.7 | 14 | **0** (pass 5: 7) | — | false |
| 430×800 | coarse | 1 | 147.4 | 179.7 | 14 | **0** (pass 5: 6) | — | false |
| 390×844 | coarse | 4 + `and 3 more` | 214.5 | 221.7 | 14 | 0 | 0 | false |
| 390×844, 29-char slug, quiet | coarse | **1** | 147.4 | 221.7 | 14 | 0 | — | false |
| 390×1000, same | coarse | 4 (rows 22.39 / **43.19** / 22.39 / **43.19**) | 256.1 (h 212.13) | 299.7 | 14 | 0 | 0 | false |
| 844×390 9×9 | coarse | 4 | 226.5 | 16 | 241 | **6** | 4 | false |
| 812×375 9×9 | coarse | 4 | 226.5 | 16 | 232.5 | **5** | 3 | false |
| 844×390 16×16 | coarse | 4 | 226.5 | 16 | 241 | **9** | 6 | false |
| 812×375 16×16 | coarse | 4 | 226.5 | 16 | 232.5 | **18** | 12 | false |
| 700×780 | fine | 1 | 152 | 67.6 | 16 | 8 | — | true |
| 1280×800 | fine | 4 | 222.4 | 118 / 124.2 | 128.2 / 131.8 | 2 / 3 | 1 / 2 | false |
| 1280×720 | fine | 4 | 222.4 | 121.3 / 124.2 | 168.5 / 165.6 | 2 | 1 / 2 | false |

`readings/noflash.txt`: at 390×800, seven at the table, a rAF sampler and a MutationObserver ran
over 3 opens per engine (82 / 62 frames each). Painted frames with the sheet visible and more than
one row: **0**. The DOM went 4 → 1 at 21 → 22 ms (ch) and 18 → 18 ms (wk), inside one task.

### 2.2 The edge, dist vs control, one minted payload per theme (`readings/dist-edge-corners-filters.txt`)

1280×800 fine. The control runs twice (noise). The card is opened by its own hover, the lobby by a
click. Givens (61) read back identical on all four arms. The card rect is `{0, 52, 256, 131}` on
every arm. Each cell below is the median ratio / fraction of columns under 3.0, taken over 153
columns (the middle 60 % of the top band). Edge-OFF reads 1.00 on every drawn arm.

| | control hairline | FULL card · lobby | QUIET card · lobby | corners moved (of 106): noise · full · quiet |
|---|---|---|---|---|
| ch light | 1.063 / 1.00 | **16.14** / 0.039 · 17.52 / 0.039 | **4.335** / 0.248 · 4.657 / 0.261 | 0 · **1** · 0 |
| ch dark | 1.062 / 1.00 | **13.47** / 0.046 · 14.37 / 0.033 | **5.226** / 0.163 · 5.575 / 0.092 | 0 · 1 · 0 |
| wk light | 1.064 / 1.00 | **15.03** / 0.052 · 15.77 / 0.052 | **4.398** / 0.222 · 4.384 / 0.137 | 0 · 1 · 0 |
| wk dark | 1.064 / 1.00 | **12.82** / 0.046 · 13.34 / 0.033 | **5.352** / 0.157 · 5.287 / 0.105 | 0 · 1 · 0 |

The full arm reads 1–2.6 lower than pass 5's 14.1–17.6, and its under-3.0 fraction rose from
≤0.007 to 0.033–0.052. The radius-15 path (arc-sampled corners, a new jitter draw) is what changed.

**Filters** (the estate's rule), shut / card / lobby, both engines: **light 9 / 9 / 9 on FULL and
QUIET = control 9 / 9**, **dark 11 / 11 / 11 = control 11 / 11**. The filterBudget does not grow.

### 2.3 AA on text, the glyph-text statistic (`readings/aa-glyph-text.txt`), 1280×800, PRM

Each cell is the core median, then the fraction of core pixels under 4.5. The second bare
photograph matches the first in every cell.

| | control caption | state `1 player` | qualifier `you` |
|---|---|---|---|
| ch DPR1 light | 2.974 · 0.879 | **3.515** · 0.610 | 3.562 · 0.710 |
| wk DPR1 light | 2.937 · 0.895 | **3.246** · 0.714 | 3.377 · 0.732 |
| ch / wk DPR2 light | 4.461 · 0.51 | **5.159** · 0.296 / 0.359 | 5.159 · 0.384 / 0.401 |
| ch / wk DPR1 dark | 6.508 / 6.346 · 0.037 / 0.030 | 5.814 / 5.497 · **0.232 / 0.214** | 5.739 / 5.497 · 0.183 / 0.236 |
| ch / wk DPR2 dark | 7.802 · 0.016 / 0.010 | 6.021 / 6.099 · 0.098 / 0.103 | 6.021 / 6.099 · 0.095 / 0.075 |

The caption reads identically on this tree and the control in every cell (π on text).

### 2.4 π: WHOLE-DOM, dist vs dist (`readings/pi-whole-dom.txt`)

- **Cells.** Eight: desk 1280×800 fine and phone 390×844 coarse (witnessed), × light/dark ×
  chromium/webkit. Each is read shut and with the `@mbabb` card DRIVEN open by its own gesture
  (hover / tap), with PRM on.
- **Keying.** Every `<body>` descendant, keyed by semantic ancestry. The new
  `.attribution-disclosure`, HeadSheet's own `head-sheet` class and the `is-open` state class are
  transparent. Each element contributes 25 paint properties + tag + rect.
- **Floor.** Every read saw 1,155 (desk) / 1,115 (phone) elements, against an in-run floor of 400.
- **Noise.** Control vs control: **0 in all 16 readings.**
- **Mine vs control: 14 property deltas + 48 ONLY-MINE nodes in every reading, all claimed:**
  - The head row, `.corner-left` / `.mobile-attribution`: +45 w, `display` block → flex (the mark).
  - Both `.hover-card` instances: `border-top-width` / `border-left-width` 2px → 0px,
    `border-top-color`, and padding 16 → 18 (the box is byte-identical).
  - `.players-roster`, the 1×1 `sr-only` log: flex → block, −1 x, −3 / −3.5 y (paint-free).
  - ONLY-MINE: the two marks, the two lobbies, and the edge layer (on all four sheets; the SVG
    only on the painted head's two).
- **The card's corners** are not a computed property. §2.2's corner count is their π row.

### 2.5 The seam, wire reading (`readings/edgetap-seam.txt`): dev, one payload `ATMuMDM0OTUy…`, one context 390×844 coarse

| arm | B's ring for A before → after A taps its mark | A's focus after | the sheet |
|---|---|---|---|
| **(b)** `TAP_IS_A_LOOK = true` (default) | 1 → **1** (ch, wk) | the cell (ch, wk) | open |
| (a) `false` | 1 → **0** (ch, wk) | `BUTTON.player-mark` (ch) · `BODY` (wk) | open |

### 2.6 The outside-edge band (LAWS P5): 390×664 coarse, seven at the table, arm (b)

Taps 1 / 2 / 3 / 4 px below the open lobby's bottom edge land in the **cell under the tap, both
engines** (focus `Row 1, column 2`), and the sheet shuts. A tap 2 px INSIDE the edge lands on the
sheet: Chromium's focus goes to **BODY**, while WebKit focuses the cell beneath it. Both shut the
sheet (gap 8).

### 2.7 Gates, bare, with the control's exit code beside each (`readings/battery-final.txt`, final tree)

| gate | tree | control |
|---|---|---|
| lint:sleep · lint:lanes · lint:theme-tokens · test:e2e:projects · check-pw-projects · `eslint .` · lint:copy · **check-copy-register (bare)** · test:font-coverage · lint:motion · lint:live-regions · lint:knip · lint:boundary · lint:ink · lint:catch · lint:theme-selectors · lint:tdz | 0 each | 0 each |
| `npm run lint` form: `prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/` | **0** (after formatting my 4 files, incident 4) | 0 |
| vue-tsc -b · vue-tsc --noEmit -p tsconfig.e2e.json | 0 · 0 (the e2e check was 2 on my spec before the fix, incident 3) | not run (it writes build info) |
| vitest, 9 directory chunks + the two top-level `src/games` files | **68 files / 830 tests, 0 failed** (pass 5: 829; +1 = the F1 unit) | — |
| `player-mark.spec.ts`, the whole file, dev, both engines, final source | **24 / 24** | — |
| the estate on dev (player-mark, multiplayer, session-substrate, join-language-prm, presence, masthead-alignment, a11y) | ch **59 / 1 skip / 0**, wk **59 / 1 skip / 0** | — |
| `visual-golden` (golden config) | 4 / 4 on FULL | 4 / 4 |
| `visual-regression.spec.ts`, whole, both engines | 23 / 1 (wk `:790` 1228.06 > 1227.5) | 23 / 1 (same, 1228.06) |
| r0 law probe (copy, FE by env) | exit 0; L1–L6 GREEN, R1–R3 born-RED still red | identical |
| L5b (the chair's) · its plants A–H | GREEN (8 sites) · all RED, exit 0 | RED |
| `check-property-block.mjs` (the chair's), source + served FULL dist | **GREEN**, exit 0 (43 served registrations, stamp `index-ClQ9zdg0iHHI.js`) | GREEN, exit 0 |
| undefined-token census (the chair's copy) | **2 bare `--tap-floor`** (PlayerMark.vue) + the inherited STALE `--refuse-dur`, exit 1 | 0 bare + STALE, exit 1 |
| same, with the PROPOSED INHERITED row `--tap-floor :: App.vue -> pencil/chrome/PlayerMark/PlayerMark.vue` (`instruments/undefined-token-census.tap-floor.PROPOSED.diff`) | **0 bare**; self-test controls 1–9 as required; exit 1 only on the inherited STALE | 0 bare; 2 STALE (the new row has no crossing on the control, as the ledger's STALE rule demands) |

**The break battery**, run on THIS tree against each landed row in both engines. Each break was
restored and sha1-verified (`readings/breaks-*.txt`):

| break | reds |
|---|---|
| R1 · R1b · R1c | RED ×2 each |
| X1 · X2 (file) | RED ×2 each |
| B5 | RED ×2 |
| S1 · S2 | RED ×2 each |
| S3 | RED Chromium only (WebKit sends no click) |
| B1 · B2 · B6 · B7 | RED ×2 each |
| U1 · U2 (unit) | RED each |

### 2.8 M16

No new product string this pass: the diff adds comments only to `src/`. `check-copy-register` bare
reads 0 dashes and 0 unadmitted on the tree and the control. The font-coverage lobby group is
unchanged (exit 0).

## 3 · r0 / R6 rows

- **L5b: PROPOSED, re-keyed.** The chair's instruments lane re-cut it from this family's critic
  (`pass6/instruments/l5b.mjs`, every consumer site, plants A–H). This tree reads GREEN and every
  plant reds. **MOVED row: the chair's to land.**
- **L3 spent**: no admission is added (copy-register: 0 admitted, 0 unadmitted).
- **L17 cited** (pass-4 rulings §1.3): `data-lobby` and `data-player-mark` are test hooks, and no
  style selects them.
- **Law 39 adopted**: the mark's ring is `DrawerTab`'s form, unchanged.
- **L5 (landed)** stays GREEN here and on the control. It cannot see the head sheets (gap 4).
- **MOVED (a lane instrument's subject):** the undefined-token census's INHERITED ledger gains
  `--tap-floor`. That is a PROPOSED diff, not a gate re-worded to pass.

## 4 · For the owner (U-10): each pair on ONE payload, ONE variable, both frames looked at

| crop | engine · theme · viewport · pointer | payload | retires (pass5/SWEEP.md) | the question |
|---|---|---|---|---|
| `1-edge-full-vs-quiet-chromium-light-1280x800-fine.png` (14,286 B) | chromium · light · 1280×800 · fine (mouse) · PRM | `ATMuMDM0OTUy…` (FULL `ClQ9zdg0iHHI` left, QUIET `DtXPs5DQ4FGs` right) | `prototype/PLR-SELF/1-edge-control-card-vs-drawn-card-and-lobby.png` | **The head sheet's edge ink.** Top: the `@mbabb` card open by hover. Bottom: the lobby open by a click. The mark is present in BOTH arms, and the corners are the ground's in both. One variable, the edge's ink: full inherited ink (median 13–16 : 1) vs `--ink-press-quiet` (4.3–5.4 : 1, 22–26 % of columns under 3.0 in light). Both replace a 1.06 : 1 hairline. Uncontrolled: the card is translucent over the wordmark in both arms (parked by PRM). The lobby shot's mark is in its lifted pose in both arms (the click hovered it). Default: FULL (what ships) |
| `2-pose-rest-vs-lifted-chromium-light-1280x800-fine-x4.png` (886 B) | chromium · light · 1280×800 · fine (mouse hover) | same | `prototype/PLR-SELF/3-pose-floor-rest-vs-lifted-x4.png` | **The pose floor.** The stub at rest (a flat bar) and lifted (a blob), ×4 nearest. **70 of 229** inked px move ≥8/255 (wk 68 / 228). Does a bar read as a player? |
| `3-seam-b-vs-a-chromium-light-390x844-coarse.png` (24,526 B) | chromium · light · 390×844 · **coarse (`hasTouch`)** · two pages in one room (dev) | `ATMuMDM0OTUy…` | `prototype/PLR-SELF/4-phone-dark-coarse-seven.png` | **The touch seam.** Left (b), right (a). Top: A's head after tapping a cell and then its mark (sheet open). Under (b) the column highlight shows A's cell still focused; under (a) it is gone. Bottom: B's board, where A's ring is present under (b) and absent under (a). The wire: 1 → 1 vs 1 → 0, both engines. Uncontrolled: each arm's slugs are the pages' random ids (`homely-quelea` / `minimal-ferret`), not a seam variable. Default: **(b)** |
| `2-f1-true-vs-false.png` (pass 5, kept) | — | — | stands | F1, unchanged. The switch is now `SELF_TAKES_A_HAND` |

Three new crops, 39,698 B together. There is no dark crop and no WebKit crop: the WebKit readings
are numbers (§2.2, §2.5).

## 5 · Incidents, self-declared

1. **The first F1 unit could not fail.** U1 (mint ignoring the const) left it green, because the
   row's `k` adoption re-bound the ink. It was re-cut to read the join (`mint`) before the `st`,
   and U1 and U2 then each red it.
2. **The first edge re-cut could not hold the quiet arm.** Its predicate was ≥3:1 ON and <3:1 OFF,
   which is an AA threshold. It read 0.83 on the QUIET dist in Chromium, so the landed row would
   have red-flagged a lawful owner arm. It was re-cut to an EXISTENCE ratio (ON ≥ 1.5 × OFF) and
   re-run green on both arm dists. X1/X2 still read 0.
3. **`vue-tsc -p tsconfig.e2e.json` exited 2 on my spec** (`.remove()` on a `Node` handle, two
   sites). Fixed with an `Element` cast and re-run to 0.
4. **Prettier was red on four of my files** (App.vue, useSession.test.ts, HeadSheet.vue,
   PlayerMark.vue; control 0). I formatted those four only, and `e2e/` was never written.
5. **The first dist pair and the first π / AA / dist readings predated the formatting.** Both dists
   were rebuilt (`DGCZG1r5ObmH` → `ClQ9zdg0iHHI`, `CF8eOMmR5Vjc` → `DtXPs5DQ4FGs`). Every dist
   number above is from the rebuilt pair, and the edge and AA figures reproduce to the third
   decimal.
6. **π read the sheet twice under the wrong key.** HeadSheet's root class sorts first, and `is-open`
   first when open, so the census read the card as a new node (136, then 103 open deltas). The
   instrument was re-keyed to make both classes transparent and re-run. The first two runs are
   discarded, not cited.
7. **The first no-flash probe read both head instances**, including the hidden desktop one, and
   counted every frame as tall. It was re-cut to the visible instance, with visibility and opacity
   read per frame.
8. **My first long-slug cell used a 26-char slug**, which did not wrap. I searched 66,737 ids on
   the dev server's own `slugFor` for the 29-char pair. Even that one does not wrap without a
   qualifier, so the cell uses a clock shift of 21 s (`page.clock.setSystemTime`) to make every
   peer quiet.
9. **The undefined-token census's first run wrote to `/tmp/_x` and `/tmp/_y`**, outside the
   session scratchpad. Those are two files for one command, not deleted (no `rm`, P5), and the
   chair's to clean.
10. **Break and seam runs edited `PlayerMark.vue` / `HeadSheet.vue` / `useSession.ts` under the
    running dev server (HMR).** Every edit was restored from its text and sha1-verified, and the
    whole spec file then ran 24 / 24.
11. **The scratch `.plr-self/` configs sat inside the tree during dev runs.** They were moved out of
    the tree for both builds, and moved to `<scratchpad>/trash-plr-self-6` at return (no `rm`).
12. The `vitest run scripts` chunk exits 1 with "No test files found": `include` is `src/**` only.
    That is not a red, and it is declared.
13. **The golden config's own HTML reporter wrote `web/frontend/playwright-report/`** into the
    tree. It is gitignored, so `git status` at return lists the 24 product files and nothing else,
    but the directory is there and is the chair's to clean (no `rm`, P5). The ignored
    `tsconfig.tsbuildinfo` is `vue-tsc -b`'s.
14. **A shell slip ran commands I did not intend.** A README patch sent through an UNQUOTED heredoc
    let the shell execute its backtick spans:
    - `vitest run scripts` ran in the main repo root. It found 0 tests, and `git status` on main
      shows no new file.
    - A bare `rm` with no operand printed its usage and deleted nothing. The call was not held.
    - The other spans failed as commands.

    The patch itself did not apply, and it was redone through a quoted heredoc.

Instruments (copies, each OUT an env var): `instruments/`:
- specs: `p6-regime`, `p6-dist`, `p6-pi`, `p6-aa`, `p6-frames`, `p6-edgetap`, `p6-noflash`
- `breaks.py`, `battery.sh`, `compose.mjs`, `posefloor.mjs`
- `law-probe.copy.mjs`, `undefined-token-census.copy.mjs` + its PROPOSED diff
- the scratch vite/PW configs and driver scripts

Raw census JSON is summarised in `readings/`, not banked.

# census:panel-bar — T9-M17 (the new-game panel) · T9-M18 (the tool strip)

MAIN `1e6cfbbf`, read-only, served by this lane on 127.0.0.1:4252 (`vite --strictPort`, private cacheDir
`web/frontend/.owner-intake/panel-bar/.vite-cache`, killed by recorded PID at return). Instrument:
`probe.mjs` (Playwright 1.61.1, DPR 2, `?size=3&difficulty=MEDIUM`, drawer opened by `.drawer-tab`
tap/click, settle = the card rect agreeing across 3 polls ≥120 ms apart). Every number below is
both engines × both themes unless marked; the compact per-cell record is `summary.json` (24 rows).
Themes never moved a geometry number (light = dark to the hundredth in every cell); only `bg` differs.

## 0 · The finding that reframes M17 and M18: both owner frames are the DESK RAIL, not the phone

| evidence | reading |
|---|---|
| the frame's grammar (`size` h2 · three chips one per line · rule · `level` h2 · three chips · rule · deal) | rendered ONLY by the `!mobile` arm: `GameControlPanel.vue:822-835` (`staged-section`) + `OptionSelector.vue:44` (`flex flex-col … md:items-stretch`) |
| `mobile` = `!rowRegime` (`GameScene.vue:198`), `rowRegime` = `(min-width: 1024px)` (`useCoarsePointer.ts:21`) | below 1024 px the panel is the TAB arm: `Size` / `Level·Medium` tabs (`GameControlPanel.vue:781`) over ONE chip row |
| m18 shows the `i` | `info-btn` is `v-if="!mobile"` (`GameControlPanel.vue:1335`) AND `display: none` unless `(hover: hover) and (pointer: fine)` (`:2310`): the `i` exists only on the ≥1024 fine-pointer rail |
| chip pitch in m17 (≈91 image px at 2×) | 45.19 CSS measured on the fine rail (38 chip + 7.2 seam) — the frame is a 2× capture of the rail |
| reproduced | crop `c1` (m17's pose) and crop `c3` (m18's pose, brackets included) |

The intake file's "the new-game panel in the dock, phone width" (design-marks-2026-09-22.md, M17 row) is
**refuted by measurement**: at 390×844 / 430×932 `hasTouch` the dock already lays the size values in a
ROW (60×44 · 60×44 · 84×44). The owner's M17 subject is the ≥1024 rail (fine and coarse). The dock is
measured anyway (§1b) because its own space budget has a defect of the same family.

Residual: the owner's card reads ≈369 CSS px wide in m17 (zone ≈320); the rail card measures
315.59–339.69 fine across 1024×768 … 1728×1117 (zone 275.59–299.69). The grammar reproduces at every
rung; the ~30 px width delta is unexplained (owner-side state unknown — a room roster, a zoom, another
window). A gap, not a claim.

## 1 · M17 — the new-game panel

### 1a · The rail (the owner's frame) — chromium / webkit

| cell | card w × clientH / scrollH | zone w × h | size section h · ink · span-x | level section h · ink · span-x | deal row h · ink | chip box | chips' text w |
|---|---|---|---|---|---|---|---|
| 1280×800 fine | 324.22 / 332.31 × 608 / 1142 / 1143 | 284.22 / 292.31 × 503.19 / 504.16 | 163.44 · 0.12 · 0.22 | 178.03 · 0.13 · 0.27 | 120.17 · 0.08 | 268.22 / 276.31 × 38 | 36 · 36 · 60 ; 48 · 72 · 48 |
| 1440×900 fine | 330 / 338 × 640 / 1144 | 290 / 298 × 503.61 | 163.44 · 0.11 · 0.22 | 178.03 · 0.13 · 0.26 | 120.58 · 0.08 | 274 / 282 × 38 | same |
| 1280×800 coarse | 224 × 608 (webkit 591) / 1303 | 184 × 532.78 | 181.44 · 0.17 · 0.36 | 196.03 · 0.19 · 0.43 | 113.77 · 0.13 | 168 × 44 | same |
| 1024×768 fine (chromium) | 315.59 × 576 / 1139 | 275.59 × 502.56 | — | — | — | 259.59 × 38 | same |

`ink` = painted text line boxes + icon boxes ÷ section area; `span-x` = the widest text run ÷ section
width. **The size and level sections spend 87–89 % of their area on paper and their text occupies
22–27 % of the width.** The mechanism is one arm, not a budget choice:

- `OptionSelector.vue:44` — every non-`mobile`, non-binary group is `flex-col`, and `md:items-stretch` +
  `md:text-left` (`:54`) make each chip a full-width 268.22 px row holding a 36–72 px word.
- The arm's premise is stale. `OptionSelector.vue:175` says "The rail is a 165px column"; the fine rail's
  content column measures **259.59 (1024) · 268.22 (1280) · 271.25 (1366) · 274 (1440) · 276.31 (1512) ·
  283.69 (1728)**. The rail grew because the folded crib's max-content sizes it (the fold keeps its
  width while closed, `GameControlPanel.vue` §keys-fold): the coarse rail, which mounts no crib, is
  still narrow (168).
- **Row-fit arithmetic (not measured paint):** chip = text + 24 px padding; seam 7.2.
  size `4×4 · 9×9 · 16×16` = 60+60+84+14.4 = **218.4**; level `Easy · Medium · Hard` = 72+96+72+14.4 =
  **254.4**; futoshiki's `latinSizes` (four 3-glyph labels) = 4×60+21.6 = **261.6**.
  Fine rail: size fits everywhere (≥41 px spare); level fits with **5.19 px** spare at 1024, 13.82 at
  1280; the four-chip latin band **does not fit at 1024 (−2.01)** and fits from 1280 (+6.62).
  Coarse rail (168): nothing fits a single row; the column (or a wrap) is forced there.
- Height a one-row arm would return on the fine rail at 1280 (arithmetic): size 163.44 → ~73.1;
  level 178.03 → ~101.3; zone 503.19 → ~336 (−167, −33 %); card scrollH 1142 → ~975 against a
  608 scrollport. At 1280×800 scrollTop 0 today the Deal verb's label and the tally sit under the
  bar's 32 px fade (Deal 560.47–633.27, bar top 627.64): the verb that commits the zone is below the
  fold of its own card at the reference desk rung.

**Rhythm (1280 fine, chromium; webkit within 0.3 px):** the `new game` tape 151.72–175.03 (sticky, in
flow, straddling the well's top at 166.05) · tape bottom → `size` h2 top **2.19 px** · h2 31.06 tall
(Fraunces 25.888/800) · h2 → first chip **4.00** · chip pitch **45.19** (38 + 7.2) · last chip →
rule 13.6 · rule 1 px (declared 1.5, `GameControlPanel.vue:1550`) · rule → next h2 13.6 · h2-to-h2
pitch **191.62** · the deal row repeats the rule + 13.6 (`:1867`). The compartment name and the first
section name are 2.19 px apart (the tape crowds `size`), while a single chip-to-chip seam is 7.2: the
spacing ladder runs 2.19 < 4.00 < 7.2 < 28.2, and the smallest step is between the two NAMES.

**Tap boxes (M01's floor, `--tap-floor` 44 px on coarse):** coarse rail chips 168×44 ✓ (0 headroom
vertically); fine rail chips 268.22×38 (no floor on a fine pointer — M01 does not reach it).

### 1b · The dock (390×844 · 430×932 `hasTouch`) — what a phone actually shows

| cell | case/card | zone h | tabs | chip row | deal row h · ink | zone ink · span-x |
|---|---|---|---|---|---|---|
| 390×844 | 390 × 628, scrollH 699 (71 px under the fold) | 241.73 / 242.23 | `Size` 44×44 · `Level` 50.38×44 | 60×44 · 60×44 · 84×44, row, centred | **117.77 / 118.27 · 0.07** | 0.12 · 0.71 |
| 430×932 | 430 × 675/676, no overflow | 241.73 / 242.23 | same | same | 117.77 · 0.06 | 0.10 · 0.69 |

The phone's own space defect: **the deal row is 48.7 % of the zone's height at 7 % ink** (a 56×70.39
verb and a 91×30.39 tally stacked with 27.2 px of rule air above). The tab arm shows one axis at a time,
so choosing a level is two presses (tab, chip). All tap boxes clear 44; the `Size` tab is exactly 44×44
(0 headroom). Crop `c2`.

## 2 · M18 — the tool strip (`clear · fill · solve · share · i`)

| cell | bar w × h | verbs | `i` | inset L/R from card edge | above card bottom | above viewport bottom |
|---|---|---|---|---|---|---|
| 1280×800 fine | 284.22 / 292.31 × 64.81 | 4 × 46×56.03 | 32×32 (trailing grid track) | 20 / 20 | 56 | 107.55 / 107.84 |
| 1440×900 fine | 290 / 298 × 65.16 | 4 × 46×56.38 | 32×32 | 20 / 20 | 56 | 141.83 / 142.13 |
| 1280×800 coarse | 184 × 64.81 | 4 × 46×56.03 | `display:none` | 20 / 20 | 56 (webkit 73) | 107.55 / 124.84 |
| 390×844 coarse | 374 × 66.77 | 4 × 48×57.98 | absent (`v-if`) | 8 / 8 | 6 | **6.00 / 6.02** |
| 430×932 coarse | 414 × 66.77 | 4 × 48×57.98 | absent | 8 / 8 | 6 | 6.00 / 5.84 |

**What `.action-bar` paints (`GameControlPanel.vue:2104-2111`, `::before :2123`, `::after :2228`):**
border 0 on all four sides, `box-shadow: none`, `outline: none`, radius 0; background = the card's own
colour (rgb 253,253,252 light / 19,18,17 dark); `::before` a 32 px card→transparent fade above the bar
(opacity 1 only under `data-fold-below`); `::after` a card-coloured skirt the card's `padding-bottom`
tall (6 px dock / 56 px rail). No child is a `HandDrawnOutline` (children: `action-verbs`, `info-btn`,
`berth-note`). **Painted:** ink in the bar's top 3 px band = 0–9 px of 736–1496 (≤ 0.8 %, icon tips),
both engines, both themes. R6 row R3 is RED on the rendered DOM as well as on the source.

**The brackets in m18 are not the bar's edge — they are the wells' strokes leaking round it.** Every
tray well draws its `HandDrawnOutline` 4 px OUTSIDE its box (`:outset="4"`, `GameControlPanel.vue:763`;
`HandDrawnOutline.vue:183` `inset: calc(outset × −1)`), while the bar's opaque slab is exactly the
content width (bar edge to content edge 0.00 both sides). A well scrolled under the bar therefore keeps
painting its side strokes in 4 px flanks beside the slab. Measured at the pose with the second well's top
stroke on the bar's mid-line: **flank ink 88–142 px (left) · 68–151 px (right) per 7 px column over the
bar's height**, every cell that scrolls, both engines, both themes (none at 430×932, whose card does not
overflow). Crop `c3` reproduces the owner's frame, brackets included; crop `c4` shows the same leak on
the phone around the `players` well.

**Relation to the case edge.** Rail: the case's drawn frame (`.drawer-case`, stroke 3, outset 4) sits at
the card rect ±4, so the bar is 24 px inside the case stroke L/R and 60 px above its bottom stroke. Dock:
the case is full-bleed (svg −4 … 394 × 212 … 848 at 390), so its side and bottom strokes are OFF the
viewport; on the phone nothing drawn is anywhere near the bar.

**Safe area.** `index.html:12` sets `viewport-fit=cover`; no product rule consumes
`env(safe-area-inset-bottom)` (the only hits are `src/probe/devicePaint.ts:677/792`). The dock bar's
bottom is 6.00 px above the layout viewport's bottom on both engines. Playwright supplies no inset, so
the home-indicator overlap on a real iPhone is UNMEASURED; the pass-4 rulings §6.1 foot-on-the-inset
row applies to whatever edge lands.

**The strip's one existing edge is a CSS border**: the `i` glyph's ring, `border: 1.5px solid
var(--ink-press-rule)`, radius 50 % (`GameControlPanel.vue:2328`). A drawn bar edge (law 37 / R6 L5,
`HandDrawnOutline`) and that ring would be two hands in one strip unless they are cut together.

**Dev-only occlusion (seen on the owner's 3001, never in dist):** the DEV `FilterTuner` disc
(`src/pencil/dev/FilterTuner.vue:77`, `fx`) at 334–374 × 788–828 covers 462–464 px² of `share`'s
2783 px² box (16.6 %) at 390×844, both engines. Not a product defect; it is in the owner's frame class.

## 3 · Charter rows for pass 5 (owning families; the owner disposes at the re-look, U-10)

- **§10 leader (CTRL-FACE) · M17, rail.** The rail's staged zone lays each group as ONE ROW of chips
  where the content width allows it (fine rail: size always, level ≥1024, the four-chip latin band
  from 1280 or with a wrap), falling back to a wrap — not a full-width chip per value — on the coarse
  rail. Gate: per-section ink ratio and span-x rise from 0.11–0.13 / 0.22–0.27 (this census's reading
  is the HEAD control), zone height ≤ ~340 at 1280×800 fine, the Deal verb above the bar's fade at
  scrollTop 0 at 1280×800, M01's 44 px floor unchanged on the coarse rail, the 7.2 px seam (T4-P1 gate
  "option chips keep their separation") unchanged. Re-derive `OptionSelector.vue:175`'s premise in the
  same commit. Couplings: `visual-regression` test 10's 0.23 px iPad coarse headroom, the `panelH ≤
  1098.25` ceiling, the pair branch, and π at every surface the mark does not name.
- **§10 leader · M17 rhythm.** The 2.19 px tape→`size` step is the smallest on the ladder; the tape and
  the first h2 must stop crowding (a rhythm row, measured tape-bottom → h2-top, both engines).
- **§10 leader · M17, dock.** The deal row is 48.7 % of the zone at 7 % ink; re-budget it (the verb and
  its tally side by side, or the tally in the tab row) without moving the 44 px floor or the tab arm.
- **B8 default (CTRL-TAPE / CTRL-RULE, the bar's movers) · M18.** The bar wears a drawn edge in the house
  hand. Two measured facts bind the form: (1) the slab must cover the wells' 4 px outset (the bar's
  box or its drawn frame spans content-edge −4 at least, or the wells' strokes keep leaking around it —
  the flank-ink row above is the born-RED gate: 0 ink in both 7 px flanks at the leak pose); (2) on the
  dock the case edge is off-screen, so the bar's edge is the ONLY drawn edge at the bottom of the phone
  and must sit above `env(safe-area-inset-bottom)` (§6.1). The `i` ring and the new edge are cut together.
- **Chair's row (not a family's):** the intake's "dock, phone width" reading of m17 is corrected to "the
  ≥1024 rail"; §10's pass-5 lanes must measure M17 at 1280×800 fine and coarse, not at 390.

## 4 · Gaps

- AA was NOT read from painted bytes in this lane (the muted chips and the bar's sublabels); computed
  colours only. A design row must read it.
- The owner's ~369 px card width does not reproduce (315.59–339.69 across six fine rungs).
- WebKit 1280×800 coarse reads the card 591 tall (chromium 608) and the bar 73 px above the card bottom at
  scrollTop 0 (chromium 56); unattributed.
- WebKit 430×932 with `isMobile` read the drawer CLOSED at measure in 2 of 4 contexts (the excluded rows);
  a 3-context trace without `isMobile` held it open 30/30 samples each. Unattributed, not this lane's
  subject; the webkit 430 rows banked are the open ones.
- The row-arm heights in §1a are arithmetic from measured parts, not a rendered prototype.
- The real-device safe-area overlap is unmeasured (Playwright has no inset).
- Four crops, 1× CSS scale, all ≤ 30 KB: `c1` chromium · light · 1280×800 · fine (m17's pose) · `c2`
  chromium · light · 390×844 · coarse (the dock's zone) · `c3` webkit · dark · 1280×800 · fine (m18's pose,
  wells leaking round the bar) · `c4` webkit · light · 390×844 · coarse (the dock bar, 6 px off the
  bottom, the players well leaking round it, the DEV `fx` disc on `share`).

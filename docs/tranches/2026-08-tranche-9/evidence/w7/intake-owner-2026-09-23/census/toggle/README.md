# census:toggle — T9-M21 ("the darkmode toggle story book needs improvement"), M15 restated

Two trees, measured the same way in the same session, interleaved run by run:

- **main**: master `1d0dc4fd` (the tree the owner audited). Vite dev server on 127.0.0.1:4251 with a private cacheDir, main `src/` read-only (`dr-xr-xr-x`). `git status` is unchanged by the lane.
- **VERB**: `git archive 74a2b5d9`, then `evidence/w7/loop/pass5/prototype/MOT-VERB/pass5.diff` applied with `--3way`. It applied clean on all 55 files. Served by vite dev on 127.0.0.1:4259, with node_modules symlinked from main. This is what the §13 fold would ship. Note that it lacks W8's `fontGatedBox` hunks (see gaps).

Both servers were killed by their recorded PIDs (97931, 97932), and both ports were read free afterwards. The owner's 3001 was untouched.

**Instrument.** Playwright headless chromium and webkit at DPR 2. The rAF sampler reads, on every frame:

- the Bloom's warp transform (scale and rotation), the icon's opacity, visibility, CSS `scale` and `filter`
- the rest stacks' visibility and pose, and the button's `scale`
- `html.dark`
- `.page-root` and `.board-wrapper` background
- the grid's ink key (main: the `<image>` hrefs; VERB: the `.grid-ink` background) and the wordmark hrefs

A `drawImage` hook counts bakes, and LoAF (chromium only) gives attribution.

Each run boots twice (so the vite reload lands outside the window), then flips four times: flip0 is cold, flips 1–3 are warm. The runs split into three sets:

- **t-runs** (rAF only): both boots × 1280×800 fine and 390×844 hasTouch (tap) × both engines × both trees. 16 runs, 64 flips.
- **s-runs**: add a CDP screencast in chromium (the painted frames).
- **p-runs**: the PRM arm.

`series.json` holds a summary row per flip: min, median and max frame, counts over 16.7/34/50 ms, the born pose, the largest step, the page's swap and the grid contrast. The raw frames stay in scratch. `probe/` holds the scripts.

**Box load:** t-runs ran at a load average of 10–30. s-runs and p-runs ran at **100–150** because another lane spiked the box. Their frame numbers are inflated, and only the A/B inside a run set discriminates.

## 1 · Numbers — the Bloom, per cell (t-runs; ranges over flips)

"born" is the incoming body's warp scale on its first visible frame; the design value is about 0.22. "dS" is the largest per-frame step of the incoming body's scale; the GB1 gate is ≤ 0.08. "outLast" is the outgoing body's scale on its last visible frame; the design value is about 0.21. WebKit headless paints at 60 Hz here (median 16–20 ms), so its ">16.7" count is meaningless and only >34/>50 are read.

| tree · engine · viewport · pointer · flip | max frame ms | frames >34 / >50 (+0…+1100) | born | dS | outLast | bakes |
|---|---|---|---|---|---|---|
| main · chromium · 1280 · fine · **cold** | **108.6–109.2** | 2 / 2 | **0.48–0.51** | **0.33–0.35** | 0.22 | 8 |
| VERB · chromium · 1280 · fine · cold | 16.6–23.4 | 0 / 0 | 0.22–0.23 | 0.04 | 0.21–0.22 | 4 (the wordmark) |
| main · chromium · 1280 · fine · warm | 10.0–17.5 | 0 / 0 | 0.21–0.23 | 0.04 | 0.21–0.22 | 0 |
| VERB · chromium · 1280 · fine · warm | 10.3–25.2 | 0 / 0 | 0.22–0.23 | 0.04 | 0.21–0.22 | 0 |
| main · chromium · 390 · coarse · cold | 17.4–18.1 | 0 / 0 | 0.22 | 0.08 | 0.22 | 8 |
| VERB · chromium · 390 · coarse · cold | 10.2–10.3 | 0 / 0 | 0.22 | 0.04 | 0.22 | 4 |
| main · **webkit** · 1280 · fine · **cold** | **334–520** | 3–4 / 1–2 | **1.00–1.09** (arrives full size) | — | **0.99** (leaves at full size) | 8 |
| VERB · webkit · 1280 · fine · cold | 69–147 | 2–10 / 2–3 | 0.25–0.35 | 0.15–**0.44** | 0.22–**0.64** | 4 |
| main · webkit · 1280 · fine · warm | 41–78 | 1–9 / 0–3 | 0.20–0.46 | 0.09–0.20 | 0.26–0.59 | 0 |
| VERB · webkit · 1280 · fine · warm | 44–126 | 1–8 / 0–2 | 0.19–0.26 | 0.08–0.20 | 0.24–0.40 | 0 |
| main · webkit · 390 · coarse · cold | 193–297 | 3–6 / 3–5 | 0.72–0.99 | 0.06–0.21 | 0.27–0.98 | 8 |
| VERB · webkit · 390 · coarse · cold | 88–164 | 4–6 / 3–5 | 0.28–0.40 | 0.14–0.18 | 0.25–0.33 | 4 |
| main · webkit · 390 · coarse · warm | 70–116 | 3–8 / 1–6 | 0.20–0.44 | 0.09–0.22 | 0.26–0.36 | 0 |
| VERB · webkit · 390 · coarse · warm | 74–108 | 1–10 / 1–6 | 0.21–0.37 | 0.12–0.34 | 0.27–0.45 | 0 |

- **Main's cold flip reproduces M15.** On chromium at 1280, LoAF names two frames of 105–107 ms at +69…+182. Each holds two `IMG[blob].onload @mkbabb_pencil-boil` at 51–52 ms, for 4 × 1272² grid poses plus 4 × 765×224 wordmark poses. The incoming body is born at about 0.5 scale. On WebKit, cold, one 334–520 ms frame swallows the whole wring. The outgoing body's last visible frame is at 0.99 and the incoming body's first is at 1.00–1.09: it is replaced, not turned.
- **VERB cures the chromium cold flip at every cell.** Its cold flip is indistinguishable from a warm one.
- **VERB does not cure WebKit.** The cold flip still has 2–10 frames over 34 ms, and dS reaches 0.44 against the 0.08 gate. The warm flip is no better than main's: 44–126 ms against 41–116 ms. The 1280 dark-boot VERB run (78–126 ms) is worse than main's (67–78 ms), which is row 38's price reappearing.
- **The settle can snap in WebKit.** One VERB WebKit cold flip (390 dark) handed off to the rest stack with the live body at **0.936**, at a crest of only 1.0095. `plush-land`'s `animationend` cleared the gesture while the bloom transition was still behind, so the settle snapped 6.4 %.

### What changed since the 2026-09-22 census (`1e6cfbbf`)

**Nothing in the product.** `git diff 1e6cfbbf 1d0dc4fd -- web/frontend/src` is empty, so every difference below comes from box conditions.

| cell | 09-22 | 09-23 (this lane) |
|---|---|---|
| chromium · 1280 · light · cold | 150.4 + 149.8 ms, born 0.686 | 108.6–109.2 ms, born 0.48–0.51 |
| chromium · 390 · coarse · cold | 108.2 ms, born 0.544 | 17.4–18.1 ms, born 0.22. **Not reproduced.** The bakes still run (8), but on this box they stayed under a frame. |
| webkit · 1280 · cold | 829 / 862 ms single frame | 334 / 520 ms, born 1.00–1.09 |
| webkit · 1280 · warm | max 108–112, 4–7 frames > 50 | 41–78, 0–3 frames > 50 |

**The mechanism is identical:** 8 theme-keyed bakes on the first flip into a theme, landing inside the Bloom. The magnitude tracks the box.

## 2 · Numbers — the Bloom against the page (the design half's evidence)

These readings come from the rAF series, chromium warm unless stated. They are the same on both trees, because VERB leaves the gesture's numbers verbatim.

| reading | chromium | webkit |
|---|---|---|
| the page's swap (`.page-root` first → last change) | +16…+38 → **+333…+371** | +46…+215 → +346…+501 |
| outgoing scale when the page is half-swapped (+124…+133) | **0.945–0.947 at opacity 1** | 0.87–0.95 |
| incoming at the page's last change | 0.955–0.983, opacity 0.99 | 0.96–1.04 |
| **double exposure**: both bodies > 0.5 scale and > 0.5 opacity | **13 frames (~100 ms, +182…+291)** on every warm flip, both trees | 2–8 frames |
| incoming crest | 1.0919 at +524…+546 | 1.0899–1.0919 at +541…+661 |
| the gesture after the page has settled (crest, stars at 560/640/720 + 150, plush 860–1010, hand-off) | hand-off at +1024…+1046, about **690 ms** after the page's last change | +1040…+1158 |
| button squash minimum / plush flex maximum deviation | 0.940–0.942 / 0.037–0.040 | 0.94–0.99 / 0.018–0.040 |
| **grid ink against its board**, contrast of the grid token vs `.board-wrapper` (rest 14.87 light, 11.99 dark) | **min 1.00–1.21 at +45…+116; under 3:1 for 5–17 frames (+3…+191)** on every warm flip, both trees, both directions, 1280 (s-runs) and 390 (t- and s-runs) | min 1.02–2.55, 1–8 frames under 3:1 |
| main · chromium · cold: the grid ink's theme swap | lands at **+363…+371** in the t-runs and +477…+809 in the loaded s-runs, after the dusk. Old ink sits on new paper as it darkens, the inverse crossing: **under 3:1 for 12–23 frames (+266…+794)**. VERB cold: 7–16 frames, the same as its warm flip. | +414…+641 |
| **hand-off field jump**: the live body at identity vs its own rest pose 0 (the button box, painted bytes) | mean Δ 1.86 light / 2.69 dark; 5.0 % / 3.0 % of pixels over 16 | 1.43 / 2.03; 3.7 % / 2.4 % |
| … against one boil step (rest pose to rest pose) | mean 4.3–5.5 / 3.1–6.8; 8.9–11.4 % / 3.3–5.3 % | 4.1–5.5 / 3.0–6.7 |

- **The painted frames (s-runs, chromium screencast, load 100–150).** The recorder delivered 67–98 painted frames per 1150 ms window, and its own gaps run 20–143 ms on warm flips on both trees. It isn't a clean painted-frame count on this box (see gaps). In the cold flip on main, the screencast shows the sun held full through the stall and then the moon large over it (crop c3, top row). VERB's cold row reads like a warm flip.
- **PRM arm (p-runs, 1280 fine, light boot).**
  - **The cut itself conforms.** 0 live gesture, a page swap of one step (2 distinct values), both trees and both engines.
  - **Main's cold PRM flip leaves the board inked in the wrong theme.** In chromium the paper cuts at +11 and the grid ink lands at +470, so the board sits at contrast **1.24 for 16 frames**. In WebKit the paper cuts at +118 and the ink lands at +818 across a 640 ms frame. On warm PRM flips on main, the ink trails the paper by 8–50 ms (1–6 frames at 1.24–1.53).
  - **VERB's PRM cut is atomic:** the ink and the paper change in the same frame, and the contrast never leaves 11.99.
  - **Frame times are not readable here.** PRM flips run 96–194 ms (VERB) and 59–156 ms (main) per WebKit flip at load 100+.

## 3 · Mechanism (file:line, main `1d0dc4fd`)

1. **Cold stall (M15, unchanged).** The theme-keyed caches are `HandDrawnGrid.vue:233` (`grid-…-${isDark ? "d" : "l"}`) and `HandwrittenLogo.vue:456`. The claim at `HandDrawnGrid.vue:180` that the re-bake is "masked by the toggle's Bloom" is false on main. VERB drops the grid's theme term, but the wordmark half stays BLOCKED (INTAKE row 37), so 4 wordmark draws per cold flip remain on VERB, at +83…+175 in chromium and +166…+429 in WebKit.
2. **The Bloom is painted on the main thread.** The warp tweens inside the filter input (`DarkModeToggle.vue:797–817`, with `filter="url(#wobble-celestial)"` at `:24,:119`). Any main-thread stall freezes the Bloom, and the CSS transitions jump to elapsed time. WebKit's warm cost follows the Vue `isDark` path (09-22 ablation F) and is still unattributed. This is the whole WebKit residue on VERB.
3. **The page's swap and the Bloom run on two clocks that don't meet.** The dusk is 350 ms `ease` on the five grounds only (`index.css:661–671`, class held 400 ms at `DarkModeToggle.vue:677–679`). The wring is 340 ms `easeInCubic` (`--ease-accelIn`, `:800–801`), which back-loads the shrink: the outgoing body holds ≥ 0.85 scale through +200 while the page is already 75 % dark. The outgoing fade starts at 240 ms (`:780`). The incoming rises from 60 ms (`:786`) and blooms 800 ms on springPop from 60 ms (`:816`).
   - **The result is a double exposure.** A translucent moon grows over a full, opaque sun for about 100 ms (crop c1), the full sun sits on a half-dark page at the dusk's midpoint, and the page has finished before the incoming body crests.
   - **The Bloom then runs about 690 ms on a still page.** That covers the crest, the stars (`:884–898`, 560/640/720 ms) and the plush tail (`:849`, 1010 ms).
4. **The board's ink crosses its paper.** vueuse's `disableTransition` (`composables/useTheme.ts:35`) kills every transition for the flip frame, and only the five named grounds out-rank it (`index.css:661–671`). The grid ink and the digits therefore snap to the new theme within the first 1–2 frames, while the board ground takes 350 ms. Light ink on light paper (or dark on dark) reads under 3:1 for about 100 ms, and the board washes out (crop c2: digits and grid both, both trees).
   - This is **T9-B23 arm (a) as measured**: "SNAPS at frame 2" is a ~100 ms board blank, not an invisible snap.
   - On main's cold flip the same crossing runs the other way. The ink lands late (+363) onto paper that has already darkened.
5. **The outgoing body's accents leave before it does.** `.toggle-icon .twinkle-star, .dot-star` tuck undelayed in 150 ms (`:875–881`), so the sun's sparkles and the moon's stars are gone by about +125 while the body is still at 0.95 (crop c1, +125).
6. **A dark smudge at the end of the wring.** The outgoing body reaches its last visible frames at 0.21–0.33 scale and opacity 0.03–0.13. Over the new ground, the sun's orange at low alpha on near-black reads as a **brown blot** behind the moon (crop c3, both rows at +331/+356).
7. **Pencil character: the Bloom doesn't boil, and the hand-offs jump fields.**
   - The live instance runs through ONE static field: `wobble-celestial`, baseFrequency 0.02 (`SvgFilters.vue:67–88`; preset `pencilConfig.ts:363–373`).
   - The rest stack steps four frozen fields, at 0.0185, 0.023, 0.017 and 0.0215 (`pencilConfig.ts:455–461`, `SvgFilters.vue:133–155`). None of them is the live field.
   - **So the wobble never steps during the ~1040 ms gesture.** The sun's ray and sparkle geometry does step at 4 Hz (`DarkModeToggle.vue:401–410`, the `gestureBound` bindings at `:654–661`). The moon's body and detail paths carry no pose geometry, so the moon doesn't boil at all for the gesture.
   - Both hand-offs, rest→live at click and live→rest at `turning=false`, change the field. That costs 30–60 % of a boil step in painted bytes, both engines (crop c4).
   - The motion itself is a vector zoom with a spring overshoot (crest 1.092) plus a CSS twist. Nothing in it is drawn, rubbed or erased.
8. **The settle is keyed to the wrong clock.** `onGestureEnd` (`:691`) clears `turning` on `plush-land`'s end, which comes 1010 ms after the class lands. It doesn't check the bloom transition, which, delayed by a stall, can still be short of 1.0. WebKit measured one snap at 0.936.

## 4 · What "needs improvement" means beyond smoothness (the design half)

Main is what the owner saw, and it still has M15's cold stall. VERB's bank cures that stall in Chromium, but neither tree addresses the rest of this list. Smoothness is necessary and not sufficient. Measured against the house hand, the Bloom falls short in five ways:

- **It isn't a pop-up page.** The code's own metaphor (`:751–758`: "rises out of the page and sinks back into it") isn't what paints. What paints is two bodies zooming through each other on one centre, with a translucent double exposure for about 100 ms.
- **It is out of step with the night.** The sky turns while the old body is still full (0.95 at the dusk's midpoint). The new body finishes rising just as the page settles, and then it keeps performing for about 690 ms on a still page.
- **It takes the board with it.** The ink blank below 3:1 for ~100 ms is the loudest artefact on the page, and it sits outside the toggle.
- **It isn't pencil.** Its line doesn't boil, it enters and leaves on a field jump, and it goes out as a brown smudge.
- **Its accents lead the body.** The stars vanish before their body moves, and the plush tail (±4 %) is under the threshold of notice at 390.

## 5 · Pass-7 charter rows (owning family: §13 MOT-VERB unless named)

| # | row | gate (measured the same way, both engines, both directions, cold and warm, 1280 fine + 390 hasTouch) |
|---|---|---|
| M21-a | **WebKit is the open half of M15.** GB1 is unmet on VERB, cold and warm. Attribute the warm cost along `isDark` to functions (a Safari timeline on the owner's word, or an in-engine `performance.mark` census). Cure it at the source. No compositor move without T9-B22's (b). | 0 frames > 34 in +0…+1100; born ≤ 0.30; dS ≤ 0.08; outLast ≤ 0.25 |
| M21-b | **The wordmark half (row 37)** has to land, or its 4 cold draws stay inside the Bloom. | 0 draws in +0…+1100 on the first flip into each theme |
| M21-c | **The board's ink may never cross its paper.** Either the ink joins the dusk on the same curve (T9-B23 (b), priced), or the ground and ink swap together under the Bloom's cover. Frame the two arms on one payload. | grid token AND digit ink ≥ 3:1 vs `.board-wrapper` on every frame of every flip, PRM included (main PRM cold 1.24 × 16 frames is the born-RED) |
| M21-d | **One clock for the turn.** Time the wring, the dusk and the bloom as one sentence: the old body gone or small before the dusk's midpoint, the new body arriving as the page lands. No double exposure. The Bloom's numbers are the owner's auditioned beats (the VERB beat table), so any re-time is a U-10 frame pair for the owner, not a lane's choice. R6 law 1 isn't touched (it's the drawer's). | frames with both bodies > 0.5 scale and > 0.5 opacity: 0; outgoing ≤ 0.5 at the page's half-swap; crest within ±60 ms of the page's last change (or the owner's frame decides) |
| M21-e | **The accents follow their body.** The outgoing stars tuck on the wring's clock, not undelayed. The outgoing body's last visible frames don't paint a low-alpha blot over the new ground. | outgoing accents visible while body ≥ 0.8; 0 frames with outgoing opacity in (0.02, 0.2) at scale > 0.25 |
| M21-f | **Pencil character.** The live body boils on the one beat (R6 law 7, sun ÷2 / moon ÷1.5, law 8) through the rest stack's pose fields, not one frozen field. The hand-offs land field-identical. This is a live-filter change inside the 9 (law 9: the pair is already counted). | live vs rest same pose: mean Δ ≤ 0.5 and ≤ 1 % px > 16, both engines, both themes; the live field steps ≥ 4× per gesture; filterBudget 9 unchanged |
| M21-g | **The settle waits for the bloom**, not only for `plush-land`. | live scale at the hand-off 1.000 ± 0.005 on every flip, including under a stall |
| M21-h | **The PRM cut is atomic.** VERB conforms and main doesn't. Keep it in the fold's gate. | ink and paper change in the same frame, contrast never < 11 |
| M21-i | **The painted-frame recorder (row 40) must run on a quiet box.** This lane's screencast gaps (20–143 ms warm) are the recorder under load 100+. | a recorder self-test: a CSS-only spinner reads ≥ 55 painted frames/s at the same load |

## 6 · Crops (four, 420 KB total, each ≤ 150 KB)

- `c1-m21-bloom-both-directions-verb-chromium-1280x800-fine.png`: VERB · chromium · light↔dark · 1280×800 · fine. Two warm flips at +0…+1060. The page is dark at +200 with the sun full, the translucent moon lies over the sun at +250–300, the stars are gone by +125, and there's a brown remnant at +360.
- `c2-m21-grid-ink-crosses-the-paper-chromium-light2dark-390x844-coarse.png`: VERB (top) and main (bottom) · chromium · light→dark · 390×844 · coarse (hasTouch). The board's grid and digits wash out at +48…+100 on both trees. The two rows are different deals, because each arm dealt its own board.
- `c3-m21-cold-flip-main-vs-verb-chromium-light2dark-1280x800-fine.png`: main (top) and VERB (bottom) · chromium · light→dark · 1280×800 · fine · cold. The box was at load ~100, so the recorder inflates stalls.
- `c4-m21-handoff-field-jump-live-vs-rest-chromium-light-webkit-dark-1280x800-fine.png`: main · chromium light and webkit dark · 1280×800 · fine · DPR 2 · the button box. Rest pose 0, the live body at identity, |Δ|×4 against one boil step's |Δ|×4.

## 7 · Gaps (a gap is a gap)

- **No Safari or iOS.** Every WebKit number is headless Playwright under M19's law. The WebKit warm cost is still unattributed to a function.
- **The dev server, not a dist,** on both trees. The owner audited the dev server (3001), but the §13 fold ships a dist, and nothing here measured one.
- **VERB's scratch tree lacks W8.** It is `74a2b5d9 + pass5.diff`, while main is `74a2b5d9 + W8`. W8's `fontGatedBox` (`DarkModeToggle.vue:575,581`, `HandDrawnGrid.vue:238`) and `rasterPose.ts` are absent. The fold onto main will interleave both, and that interleave is unmeasured.
- **Load.** t-runs ran at a load average of 10–30. s-runs and p-runs ran at 100–150 (another lane spiked the box), so their frame times and screencast gaps are loaded-box readings. Only the within-run A/B and the non-timing readings discriminate there: page order, contrast, born pose, hand-off bytes.
- **Contrast figures:**
  - The chromium 1280 t-runs predate the per-frame active-grid field, so their contrast rows are blank; 390 t-runs and all s-runs carry it.
  - The contrast figure is the grid **token** (`--grid-line-color`), not painted bytes. The strokes paint at partial opacity, so the painted figure is lower.
  - Digit ink is shown in c2 but not measured per frame.
- **The hand-off bytes cover only the 104-css-px button box,** the disc and inner rays. The outer rays, sparkles and stars outside the keep aren't in the figure. In the WebKit-dark rest pair, part of the page behind the icon is inside the diff.
- **Settle hand-offs read from the screencast are unreliable** (recorder lag). The static element-screenshot read (c4, `handoff-static.json`) is the figure of record.
- **n is small:** 2 cold flips per cell, and 1 cold flip per cell per boot direction. The one WebKit settle snap (0.936) was seen once, in 32 WebKit t-run flips.
- **Not measured:**
  - a re-click mid-flight
  - hover on fine pointers while the toggle turns
  - 1440×900 / landscape
  - the gallery view (09-22 measured it on main; not repeated here)
  - forced colours
- **Nothing here retires T9-M21 or M15** (U-10). The owner disposes at the re-look.

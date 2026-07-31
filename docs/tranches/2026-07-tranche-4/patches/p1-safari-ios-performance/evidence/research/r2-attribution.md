# R2 — causal attribution on real Safari

Lane L2. L1 built the rig and read the baseline; this lane runs the ablation matrix that says
**which surface owns the deficit**. Everything below is real desktop Safari 26.4 and real
MobileSafari on the iOS 26 simulator, driving `web/frontend/dist` as built at
`981353c0`—the bundle that carries the divider freeze—through L1's `__ablate` hook. Zero
commits. Rig at `$RIG` (§8), evidence here.

---

## 1. The headline

**One surface owns nearly all of it, and it is not a pose stack.**

The board's filled digits each render `<path filter="url(#grain-static)">`—**63 live SVG
reference filters** sitting inside the board's paint region. Nothing about them is animated.
They cost because *every repaint of that region re-executes all 63*, and the shared boil beat
repaints that region eight times a second forever.

| rank | cause | what it buys (desktop) | mechanism |
| --- | --- | --- | --- |
| **1** | 63 `url(#grain-static)` filters on `.glyph-svg path` (the cell digits) | idle **79.0 → 98.3 fps**, long frames **24 → 0**; solveCelebration 63.6 → 96.8; themeToggle 32.0 → 67.4; deal 72.4 → 89.2; galleryGlide 69.9 → 83.1 | WebKit caches no filter result for unlayered SVG content. The beat writes `is-active` on the grid's pose siblings every 125 ms; that dirties the board's tiles; re-rastering those tiles re-runs 63 feTurbulence chains. Measured in cycles: the GPU process burns **10.3–11.2 CPU-seconds per 30 s of idle** with the filters live and **3.6 s** without (§6) |
| **2** | the theme swap's transition tween | themeToggle **32.0 → 55.5 fps** on its own; +7.6 more on top of the filter cure | `useTheme` runs vueuse `useDark` with `disableTransition: false`, so the `.dark` class flip does *not* suppress transitions—46 elements computing `transition: all` with a live duration tween their colour channels across the swap, and 16 of them carry a reference filter that re-executes on every frame of the tween |
| **3** | reference filters on **HTML** elements: 16 `button.icon-btn` (`url(#grain-static)`) + 2 `div.control-panel-filtered` (`url(#stroke-*)`) | deal **72.4 → 84.7 fps**; themeToggle +12 on top of the glyph cure (aB 79.5 vs a10 67.4); panel alone +9.3 on themeToggle | an SVG reference filter on an HTML element takes WebKit's software filter path. Both control-panel twins are mounted, so the 3-pass stroke filter is paid twice |

**The measured ceiling the cure can buy** (best combination `aB2`, against L1's app-free
desktop ceiling of **98.4 fps**):

| scenario | base | best combination | % of ceiling | long>50 | jank ms |
| --- | --- | --- | --- | --- | --- |
| idle3s | 78.97 | **98.44** | **100%** | 0 | 0 |
| deal | 72.44 | **97.05** | **99%** | 0 | 0 |
| solveCelebration | 63.64 | **97.60** | **99%** | 0 | 0 |
| themeToggle | 31.99 | **87.13** | **89%** | 2 | 256 |
| galleryGlide | 69.92 | **84.23** | **86%** | 3 | 308 |

Idle, deal and the celebration go all the way to the display. Two residuals survive every
ablation and belong to the cure lanes as separate work (§5).

And the good news for the look: **`a13`—keeping the grain and giving each `.glyph-svg` its own
compositing layer (`transform: translateZ(0)`)—recovers idle to 98.24 fps and the celebration
to 92.29.** The filter need not go; its result needs to be cached. That cure carries a
mobile caveat (§7).

---

## 2. What the DOM actually holds, read in real Safari

L1's census counted filtered elements; this lane enumerated them by selector so the ablations
address real nodes rather than guesses. `styleDump` (run `sd-1`, a diagnostic scenario added to
`probe.js`) after settle, desktop, dark, 9×9 board:

| population | count | note |
| --- | --- | --- |
| `svg:path ← url(#grain-static)` | **63** | the filled cells' handwritten digits (`HandwrittenGlyph`, `grainOn`) |
| `html:button.icon-btn ← url(#grain-static)` | **16** | software filter path; each also `transition: all 150ms` |
| `html:div.control-panel-filtered ← url(#stroke-dark)` | **2** | both panel twins mounted, 3-pass |
| `svg:g.boil-pose ← url(#grain-static)` | **8** | the two `BoilDivider` instances |
| `svg:g.boil-frame-layer ← url(#grain-static)` | **4** | `display: none` (baked-hidden)—inert |
| `svg:svg.toggle-icon ← url(#wobble-celestial)` | 2 | |
| `svg:g ← url(#wobble-heart)`, `svg.crayon-heart`, `svg.sparkle-icon` | 2 / 2 / 2 | |
| pose stacks: `boil-frame-bitmap` / `boil-pose` / `rest-pose` / `progress-pose` / `dt-pose` | 4 / 16 / 8 / 4 / **0** | all filterless baked geometry except the divider's 8 |
| `.cell-reveal-animated` | **0** | |
| CSS animations with a name | **3** | `vignette-write-in`, `controls-fade-in` ×2 |
| `document.getAnimations()` | **0** | |

Two orientation claims die here, and L1's reading stands:

- **The "35 cell-reveal CSSAnimations running at idle" does not exist.** Zero
  `.cell-reveal-animated` nodes, three named animations on the whole page, an empty
  `getAnimations()`. The ablation agrees: `a7` (`animation: none` inside `.game-cell`) moves
  idle by −0.1 fps and *costs* 16.1 fps on `deal`.
- **The divider freeze holds.** Its 8 `boil-pose` nodes read opacity `1,0,0,0` twice over—pose 0
  pinned, per the `frameCount ≤ 1` contract at `fb15253d`. Pinning it again in CSS (`a1`) moves
  idle by +0.3 fps, which is how this lane knows its own noise floor (§3).

---

## 3. Method, and the noise floor that makes it readable

Nine of the task's candidates plus four this lane added, each a CSS file injected before the
app boots. **`a1` is a sham**: it re-pins a stack the engine gate already froze, so whatever it
"buys" is the instrument's noise. Every pin was verified per-node with `styleDump` rather than
assumed—the L1 starter's `:first-of-type` pin *blanked* `progress-pose` instead of pinning it
(the poses are `<g>` siblings that follow other `<g>`), so `a6`/`a9` take a `display: none`
form there and read as an upper bound.

| cell | ablation |
| --- | --- |
| `a1-divider-pin` | **sham** — the divider's pose stack pinned to pose 0 in CSS |
| `a2-grid-bitmap-pin` | `image.boil-frame-bitmap` pinned—the four full-board bitmap flips stop |
| `a3-toggle-pin` | `.rest-pose` pinned + `filter: none` on the two `svg.toggle-icon` |
| `a4-panel-filter-none` | `.control-panel-filtered { filter: none }` |
| `a5-html-filters-none` | every reference filter on an HTML element (icon-btn, panel, hovers) |
| `a6-progress-dt-pin` | `.progress-pose` + `.dt-pose` removed |
| `a7-cell-anim-none` | `animation: none; transition: none` inside `.game-cell` |
| `a8-celebration-off` | star, gleam, heart, vignette `display: none` |
| `a9-all-pose-pin` | every pose family across the estate stilled |
| `a10-glyph-grain-none` | **lane addition** — `.glyph-svg path { filter: none }` (the 63) |
| `a11-transition-none` | **lane addition** — `* { transition: none }` |
| `a12-theme-combo` | **lane addition** — a11 + a5 |
| `a13-glyph-layerize` | **lane addition** — `.glyph-svg { transform: translateZ(0) }`, grain KEPT |
| `aB-best` / `aB2-best-plus-transitions` | every reference filter off / that plus `a11` |

Scenarios `idle3s,deal,solveCelebration,galleryGlide,themeToggle`, **9 rounds, 83 runs**, cell
order **shuffled per round** (`matrix.sh`). Shuffling is load-bearing on this machine: a backup
daemon holds ~100% of a core throughout, an editor and a second browser come and go, and a
fixed order would map that drift onto the same cells every round and read as an effect. One
window out of 83 runs came back tainted and was dropped.

**Read absolute post-ablation fps first, deltas second.** The baseline is the noisy term: over
seven replicates `base` idle spans 72.1–81.1 and `base` themeToggle spans 27.5–39.2, while the
cured cells sit inside ±0.5 fps of each other. From the sham, the noise floor is ±2 fps on idle,
deal, solveCelebration and galleryGlide, and about ±8 on themeToggle.

**Round 1 is a pilot, not evidence.** L1 left the iOS simulator booted with the app's page
still open in MobileSafari—still boiling, still burning the shared GPU process. It was shut
down four cells into round 1, so that round straddles two machines. Its numbers are kept in
`runs/*-r1.jsonl` as the record and excluded from every table here.

---

## 4. The matrix

Medians across rounds 2–9, desktop Safari 26.4, ceiling 98.4 fps. `n` = clean windows.

### idle3s

| cell | n | fps | Δfps | >33 | >50 | worst ms | p95 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| base | 7 | 78.97 | — | 24 | 0 | 46 | 39 |
| **aB2-best-plus-transitions** | 3 | **98.44** | **+19.5** | **0** | 0 | 15 | 12 |
| **aB-best** | 3 | **98.37** | **+19.4** | **0** | 0 | 19 | 12 |
| **a10-glyph-grain-none** | 8 | **98.32** | **+19.3** | **0** | 0 | 17 | 12 |
| **a13-glyph-layerize** | 3 | **98.24** | **+19.3** | **0** | 0 | 17 | 12 |
| a9-all-pose-pin | 5 | 81.89 | +2.9 | 24 | 0 | 41 | 37 |
| a2-grid-bitmap-pin | 7 | 79.45 | +0.5 | 24 | 0 | 44 | 40 |
| a1-divider-pin *(sham)* | 5 | 79.31 | +0.3 | 24 | 0 | 44 | 39 |
| a6-progress-dt-pin | 5 | 79.25 | +0.3 | 24 | 0 | 44 | 39 |
| a3-toggle-pin | 5 | 79.17 | +0.2 | 24 | 0 | 44 | 39 |
| a12-theme-combo | 5 | 78.89 | −0.1 | 24 | 0 | 44 | 40 |
| a8-celebration-off | 5 | 78.92 | 0.0 | 24 | 0 | 46 | 39 |
| a7-cell-anim-none | 5 | 78.83 | −0.1 | 24 | 0 | 44 | 39 |
| a5-html-filters-none | 5 | 77.87 | −1.1 | 24 | 0 | 44 | 39 |
| a11-transition-none | 8 | 77.63 | −1.3 | 24 | 0 | 45.5 | 40 |
| a4-panel-filter-none | 5 | 77.43 | −1.5 | 24 | 0 | 46 | 40 |

The `long33` column is the cleanest signal in this lane. **Every cell that leaves the glyph
filters live carries 24–26 long frames**—median 24 for all but `a4` and `a8`, which land 25—at a
median gap of 122–126 ms, in every one of 40-odd replicates. Every cell that removes or
layerizes them carries **zero**. The beat train is binary in this variable, and it answers to
one surface.

### deal

| cell | n | fps | Δfps | >33 | >50 | worst ms |
| --- | --- | --- | --- | --- | --- | --- |
| base | 7 | 72.44 | — | 3 | 1 | 56 |
| **aB2** | 3 | **97.05** | **+24.6** | 0 | 0 | 22 |
| **aB** | 3 | **96.65** | **+24.2** | 0 | 0 | 20 |
| **a10-glyph-grain-none** | 8 | **89.15** | **+16.7** | 0 | 0 | 21 |
| a5-html-filters-none | 5 | 84.71 | +12.3 | 2 | 1 | 54 |
| a12-theme-combo | 5 | 82.57 | +10.1 | 3 | 1 | 55 |
| a13-glyph-layerize | 3 | 80.73 | +8.3 | 2 | 2 | 112 |
| a9-all-pose-pin | 5 | 75.04 | +2.6 | 1 | 1 | 59 |
| a6 / a3 / a1(sham) | 5 / 5 / 5 | 74.35 / 73.13 / 70.37 | +1.9 / +0.7 / −2.1 | | | |
| a2 / a4 / a8 / a11 | 7 / 5 / 5 / 8 | 69.24 / 68.95 / 67.99 / 67.79 | −3.2 … −4.6 | | | |
| a7-cell-anim-none | 5 | 56.35 | **−16.1** | 3 | 1 | 55 |

`deal` is the one place the HTML-element filters show clearly on their own: +12.3 fps for `a5`.
Dealing re-runs the reveal across 81 cells while the panel and its 16 filtered buttons repaint.
`a7` is the standout negative—killing the cells' own animations and transitions collapses the
reveal into undifferentiated repaint work and costs 16 fps.

### solveCelebration

| cell | n | fps | Δfps | >33 | >50 | worst ms |
| --- | --- | --- | --- | --- | --- | --- |
| base | 7 | 63.64 | — | 34 | 1 | 73 |
| **aB2** | 3 | **97.60** | **+34.0** | **0** | 0 | 22 |
| **aB** | 3 | **97.35** | **+33.7** | **0** | 0 | 19 |
| **a10-glyph-grain-none** | 8 | **96.75** | **+33.1** | **0** | 0 | 22 |
| **a13-glyph-layerize** | 3 | **92.29** | **+28.7** | 1 | 1 | 126 |
| a9 / a12 | 5 / 5 | 67.63 / 67.61 | +4.0 | 34 / 32 | | |
| everything else | 5–8 | 62.1–65.1 | −1.5 … +1.5 | 33–40 | | |

The crest is the harshest case for the filters and the clearest result: the solve *fills the
board*, so the 63 filtered digits become 81, and the base window spends 34 of ~250 frames over
33 ms. Removing the filters takes `long33` to zero and the window to 99% of ceiling.
`a8-celebration-off`—deleting the star, gleam, heart and vignette outright—moves it **−0.5**.
The celebration layers are not the cost; the board underneath them is.

### galleryGlide

| cell | n | fps | Δfps | >33 | >50 | worst ms | jank ms |
| --- | --- | --- | --- | --- | --- | --- | --- |
| base | 7 | 69.92 | — | 8 | 5 | 188 | 514 |
| **aB2** | 3 | **84.23** | **+14.3** | 3 | 3 | 150 | 308 |
| **a10-glyph-grain-none** | 8 | **83.14** | **+13.2** | 4 | 3 | 154 | 306 |
| **aB** | 3 | **81.45** | **+11.5** | 4 | 3 | 151 | 303 |
| a8 / a2 / a9 / a5 / a12 / a6 / a1(sham) | 5–7 | 70.2–71.4 | +0.3 … +1.5 | | | | |
| a11 / a13 / a3 / a4 | 3–8 | 68.98–69.86 | −0.1 … −0.9 | | | | |
| a7-cell-anim-none | 5 | 67.90 | −2.0 | 11 | 7 | 186 | 603 |

The fold's fixed frame at ~900 ms **survives everything**: 215 ms @ 934 and 184 ms @ 904 at
base, 150 ms @ 869 and 180 ms @ 908 under the best combination. The filters make it worse—they
are a third of it—but they do not cause it. `a13` is *negative* here, and diagnostically so
(§5).

### themeToggle

| cell | n | fps | Δfps | >33 | >50 | worst ms | jank ms | p95 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| base | 7 | 31.99 | — | 28 | 13 | 203 | 1268 | 99 |
| **aB2-best-plus-transitions** | 3 | **87.13** | **+55.1** | 2 | 2 | 130 | 256 | 15 |
| **aB-best** | 3 | **79.50** | **+47.5** | 2 | 2 | 134 | 260 | 19 |
| **a10-glyph-grain-none** | 8 | **67.40** | **+35.4** | 9.5 | 2 | 144.5 | 283 | 34.5 |
| **a13-glyph-layerize** | 3 | **63.97** | **+32.0** | 10 | 4 | 272 | 575 | 37 |
| **a12-theme-combo** | 5 | **57.53** | **+25.5** | 22 | 3 | 195 | 441 | 45 |
| **a11-transition-none** | 8 | **55.48** | **+23.5** | 21 | 5 | 203.5 | 569 | 48 |
| a4-panel-filter-none | 5 | 41.29 | +9.3 | 25 | 11 | 190 | 1047 | 89 |
| a8 / a5 / a3 / a9 / a1(sham) | 5 | 33.5–37.5 | +1.5 … +5.5 | | | | | |
| a7 / a2 / a6 | 5–7 | 31.1–31.9 | −0.1 … −0.9 | | | | | |

The worst scenario in the estate, and the only one with two independent causes of comparable
size. The tween alone (`a11`) buys +23.5; the glyph filters alone buy +35.4; together they buy
+55.1 and land the window at 89% of ceiling. `a4` clears the sham's floor on its own at +9.3—the
two 3-pass stroke filters are real, just an order down. Note `a3`, which pins the 208 px
celestial stacks *and* strips their wobble: **+3.1, inside the noise.** The toggle is not the
toggle's problem.

---

## 5. What survives the cure

Two residuals, both fixed costs at fixed points, neither attributable to a filter:

1. **The gallery fold, ~150 ms at ~870–910 ms.** Base 215 @ 934 · 184 @ 904; best combination
   150 @ 869 · 180 @ 908. It shrinks by about a third and never leaves. `useFlipGlide` lands
   the target layout once and reads LAST rects—one forced layout—then tweens transform only.
   That single synchronous layout across the board⇄card fold is what this frame is, and no CSS
   ablation can remove it. It also costs *more* on the simulator's smaller raster (211–260 ms),
   which points at layout rather than pixels.
2. **The theme swap, two ~125 ms whole-page repaints.** Base 228 @ 254 and 163 @ 929 (the click
   and the toggle-back); best combination 125 @ 156 and 120 @ 946. With every filter and every
   transition gone, flipping `.dark` on `<html>` still restyles and repaints 1180 nodes twice.

And one instrumentation finding worth carrying forward: 81 ms of the WebContent main thread's
474 ms per 12 s idle window goes to `WebCore::Document::updateIntersectionObservations`—17% of
main-thread time, on every rendering update, at rest (§6).

---

## 6. Where the cycles go

The frame curve says *which* cell is slow. Process CPU says *where*, and WebKit splits the
work: script, style and layout in `com.apple.WebKit.WebContent`, **raster—and therefore filter
execution—in `com.apple.WebKit.GPU`**. Six back-to-back `idle3s` windows (~30 s of measured
idle) per cell, CPU-seconds consumed per process family (`cpu-attrib.sh`; every run verified to
have collected all six windows, since a short window reads as a cheap one):

| cell | GPU process | WebContent | idle fps, the six windows |
| --- | --- | --- | --- |
| base | **10.28 s** / 11.21 s | 2.38 / 2.44 s | 79.1, 79.2, 80.4, 81.1, 78.7, 80.6 |
| a2-grid-bitmap-pin | **10.81 s** | 2.57 s | 80.2, 81.3, 80.6, 81.1, 81.0, 80.3 |
| a10-glyph-grain-none | **3.56 s** | 4.23 s | 98.6, 98.1, 98.4, 98.1, 98.3, 98.5 |
| a13-glyph-layerize | **3.57 s** | 3.72 s | 98.5, 98.4, 98.3, 97.7, 98.4, 98.5 |
| aB2-best-plus-transitions | **3.24 s** | 3.68 s | 98.7, 98.4, 98.2, 98.6, 98.4, 98.4 |

Read the first column. **A settled, untouched page burns ~10.3 CPU-seconds of raster per 30
seconds—a third of a core, to sit still—and about 7 of those seconds are the 63 glyph
filters.** Pinning the grid's bitmap flips (`a2`) changes it by nothing. Layerizing the glyphs
while *keeping* the filter (`a13`) buys the same 6.7 seconds back as deleting it (`a10`), which
is the mechanism proved in cycles: the filter is not expensive to run once, it is expensive to
re-run, and a compositing layer is what stops the re-run. WebContent goes *up* under the cure
because the page now services 98 frames a second instead of 79.

**Time Profiler**, `--attach` on the rig's WebContent pid (identified by CPU delta across a
page load, not guessed), 12 s of idle, 474 ms of main-thread CPU sampled:

```
316 ms  WebKit::RemoteLayerTreeDrawingArea::updateRendering()
235 ms    WebCore::Page::updateRendering()
164 ms      Page::updateRendering()::$_22  (the rendering-update step loop)
 81 ms        WebCore::Document::updateIntersectionObservations()
 80 ms          WebCore::IntersectionObserver::updateObservations(Frame const&)
 61 ms      WebCore::Page::layoutIfNeeded() → LocalFrameView::updateLayoutAndStyleIfNeededRecursive()
 54 ms      WebCore::ScriptedAnimationController::serviceRequestAnimationFrameCallbacks()
```

SIP is enabled and `--attach` on a hardened WebKit service worked anyway, so the trap did not
bite. The GPU process was a different story: `xctrace --attach` on `com.apple.WebKit.GPU`
recorded and exported cleanly but returned **zero time-profile samples**, so its cost is
quantified by process CPU above rather than by symbol stacks. Traces kept at
`$RIG/wc2.trace`, `$RIG/gpu-base.trace`.

---

## 7. The simulator — does the mobile path agree?

Real MobileSafari, `perf-rig-iphone16` (iOS 26), ceiling **59.76 fps**, two rounds per cell,
mean of two. **These are not iPhone numbers**—the simulator runs against the host's M5 Max. Read
it for *does the mobile path rank the same*.

| scenario | base | a10-glyph-grain-none | a13-glyph-layerize | aB2 (best) | ceiling |
| --- | --- | --- | --- | --- | --- |
| idle3s | 54.86 | **59.39** | **59.94** | **60.03** | 59.76 |
| deal | 58.46 | **59.75** | 54.74 | **59.41** | 59.76 |
| solveCelebration | 55.36 | **58.99** | 56.72 | **59.13** | 59.76 |
| galleryGlide | 46.80 | **49.79** | 41.30 | **50.87** | 59.76 |
| themeToggle | 38.19 | **44.44** | 32.26 | **49.71** | 59.76 |

The ranking transfers: the glyph filters own idle here too (idle goes to the ceiling), the best
combination wins every scenario, and the two residuals are the same two—the gallery fold
(215–244 ms worst, *worse* than desktop) and the theme swap.

**One divergence, and it matters to the cure.** `a13`—the look-preserving layerize—**is a
regression on mobile**: deal 58.5 → 54.7, galleryGlide 46.8 → 41.3, themeToggle 38.2 → 32.3.
Promoting 81 glyph layers at dpr 3 trades filter re-execution for compositing and memory
pressure, and on the mobile regime the trade goes the wrong way. It also shows on desktop, in
the right place: `a13` is −0.5 on `galleryGlide` and carries a 272 ms worst frame on
`themeToggle` against `a10`'s 144. **A blanket `translateZ(0)` is not the cure. Bake the grain
into the glyph geometry, the way the grid and the outlines already are** — that is L3's call,
and the evidence for it is that `a13` and `a10` buy identical GPU seconds at idle (§6).

---

## 8. How to reproduce

Server left running for later phases, port **4894**, `dist` unmodified on disk:

```bash
RIG=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/perf-rig
node $RIG/probe-server.mjs                       # health: curl -sf localhost:4894/__ping
cd $RIG
KEEP_SAFARI_FRONT=1 ./run-safari.sh <id> styleDump                      # the selector census
KEEP_SAFARI_FRONT=1 ./run-safari.sh <id> idle3s ablations/a10-glyph-grain-none.css
./matrix.sh <round>                              # one shuffled round of the cell list
CELLS="base a10-glyph-grain-none" ./matrix.sh 99  # a subset
./sim-matrix.sh 1 2                              # the simulator (boots the device itself)
./cpu-attrib.sh a10-glyph-grain-none             # GPU-vs-WebContent CPU over 6 idle windows
node matrix-fold.mjs --rounds 2,3,4,5,6,7,8,9    # the tables in §4
```

Added by this lane: `matrix.sh`, `rounds.sh`, `phase-b.sh`, `sim-matrix.sh`, `cpu-attrib.sh`,
`matrix-fold.mjs`, `parse-tp.py`, `ablations/a1…a13,aB,aB2`, and a `styleDump` scenario in
`probe.js` (additive; every L1 scenario untouched). Folded tables kept as `fold-master.txt`,
`fold-r2to6.txt`, `fold-phaseb.txt`.

Run IDs: `sd-1`, `sd-a5`, `sd-a9`, `sd-a10` (censuses) · `*-r1` (**pilot, excluded**) ·
`*-r2…r6` (the screening matrix) · `*-r7…r9` (phase B) · `sim-*-s1,s2` · `ca-*` (CPU
attribution) · `xct-*` (profiler load). `base-r5` holds an `env` line and nothing else—the
driver's backgrounded tab cleanup occasionally races the next run's tab open and closes it; the
run self-heals on the timeout and the fold skips it.

---

## 9. Flags

- **No real iOS device was touched.** E8 device smoke stays an owner row.
- **Round 1 is excluded** (§3): L1's simulator was still booted and boiling for its first four
  cells. The shutdown is also why this lane's `base` reads 79 fps at idle against L1's 80.0—same
  page, quieter machine.
- The machine was never quiet. A backup daemon held ~100% of a core throughout, plus an editor
  and a second browser. Cell order is shuffled per round and every headline is a median over
  5–8 windows with a sham control alongside; the ±0.5 fps agreement among the cured cells says
  contention is not driving the result.
- Desktop Safari ran on the external 4K panel at a ~98 fps ceiling, not the built-in 120 Hz XDR.
  The **% of ceiling** column is the portable one.
- `a6`/`a9` remove `progress-pose` rather than pin it (`:first-of-type` cannot reach it) and so
  read as upper bounds. `.dt-pose` count is 0 in this regime, so `a6` is progress-trace only.
- The GPU process yielded no time-profile samples; its cost is process CPU, not symbols (§6).
- Safari tabs opened by this lane were closed: the driver's cleanup ran on every run, one
  survivor was swept at the end, and a re-count returns **0** `localhost:4894` tabs. The
  owner's own ~77 tabs were never touched. A tab reaper this lane briefly armed was killed and
  deleted within the minute—it could have closed a live measuring tab, and the pileup it was
  written for turned out not to exist.
- `.dark`-mode dark theme was in effect for every desktop run (`prefersDark: true`); the
  simulator ran light. The panel filter differs by theme (`stroke-dark` vs `stroke-light`) and
  `a4` was only measured against the dark one.

## 10. What the cure lanes should reach for

1. **Bake the grain into the glyph geometry.** One surface, ~19 fps at idle, ~33 on the
   celebration, ~35 on the theme toggle, and 7 of the 10 GPU CPU-seconds a settled page burns
   per 30 s. The estate already owns this move twice over—`HandDrawnGrid`'s bitmap poses and
   `HandDrawnOutline`'s grain-in-geometry siblings. `a13` proves a layer is enough on desktop
   and shows why a layer is the wrong answer on mobile (§7).
2. **Suppress transitions across the theme swap** (`useDark({ disableTransition: true })`, or a
   scoped no-transition class for the duration). +23.5 fps on the estate's worst scenario, and
   it composes with (1) rather than overlapping it.
3. **Retire the reference filters on HTML elements**—16 `icon-btn`, 2 `control-panel-filtered`.
   WebKit's software filter path, +12.3 fps on `deal`, +9.3 for the panel alone on the toggle.
4. **The gallery fold's ~150 ms forced layout** and **the theme swap's two ~125 ms whole-page
   repaints** are what remain at 86% and 89% of ceiling. Different instrument, different lane.
5. **`updateIntersectionObservations` at 17% of main-thread idle time** is unexamined and cheap
   to check.

# T9-W8 §8.1 — THE ATTRIBUTION TABLE

    AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB · newest mtime 2026-09-17T17:53:45.987Z

Dated 2026-09-17. Dist built at HEAD `58014efd` (tree HEAD at synthesis `7b0610cc`—the CI cure,
no `src/` delta); identity re-printed at synthesis, unmoved; every lane and refuter bracketed it
and none saw it move. Host darwin 25.4.0 arm64, 18 cpus, up to six sibling lanes live; load
5.44 at synthesis. FROZEN: this file is the 8.1 record. No cure landed. Seven lanes (A1–A7),
seven refuters (`refute/A1–A7`); index in `README.md`.

**Reading rules.** Every number is a PROXY: Playwright chromium under CDP throttle, or Playwright
WebKit unthrottled (no CDP, no `longtask`). No WebKit number is a Safari number; none is an iOS
claim; the device closes the wave (8.3). `board-ready` is the one W8 definition (`.board-group`
visible + first `.game-cell` rect non-zero + one rAF; a bare `.cell` matches nothing on this
tree—A3, A4). ~~struck~~ = the refuter said REFUTED. ADJ = ADJUSTED, both cites given.

**The DPR split, a synthesis reconciliation (no lane stated it).** "desk" is not one pose: A1, A5,
A7 boot 1280×800 at **dpr 2** (grid bake 1272²); A2, A3, A6 and GATE D boot desk at **dpr 1**
(≈636²); mobile is 390×844 dpr 3 (1092² chromium, 728² WebKit under the licensed cap) in every
lane BUT A4, whose drawer instruments set no scale factor—its "mobile" is dpr 1. This is why
A1 reads desk 4× TBT 1,454 ms and A6 reads 221: bake cost follows bake PIXELS (0.40 MP → 221 ms
· 1.19 MP → 1,020 · 1.62 MP → 1,454). A6's "mobile costs 4.6×" is that fact.
Read from the banked instruments' `deviceScaleFactor` lines; not separately measured.

## 1. THE TABLE

### 1a. The cold path, ranked by ms

| # | suspect | ms | engine · CPU · link · cache · pose | on critical path | instrument | refuter | cure | law | budget |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **The kept bake raster** (drawn → bitmaps mounted, "leg 2"). 0 of 28 bakes finish before board-ready; LCP ≡ the bake (within ~20 ms, 16/16 cells) | **1,637** mobile · **906** desk (ADJ from 2,381 / 1,566—the gap is two legs) | chromium · 4× · unthrottled · cold · dpr3 / dpr1 | board-ready NO · board-DRAWN YES | `A6/readiness-timeline.mjs`; split by `refute/A6/refute-probes.mjs --mode gapsplit` | ADJUSTED; gap reproduced 2,415 / 1,569, legs stable at load 3.1 and 6.3. Desk leg 2 is 81 % idle (175 busy of 906) | C03 | MECHANISM | B1 |
| 2 | **The discarded bake round.** Every cold boot bakes grid + both celestials TWICE. Chromium: `pencil-boil/dist/vue.js:603` `fontsReady.then(() => { clearStacks(); return bake(); })`. WebKit: a cssSize re-key 1240→1272 px, 3/3 | **992.8** blocking (ADJ from 799.4, which was the grid alone; refuter's own 1,034.3). WebKit 258–289, and it **starves the board-ready stamp ~282 ms** (condition true at 115–125, stamp at 397–412) | chromium · 4× · Fast-3G · cold · desk dpr2 // webkit · 1× · unthrottled · cold · desk dpr2 | chromium: drawn YES, ready NO · webkit: ready YES (contention) | `A1/double-bake-proof.mjs`, `A1/bake-census.mjs`; `refute/A1/cp-probe.mjs` | ADJUSTED number, mechanism CONFIRMED at source. Warm runs 20 encodes, not 28—the cached font wins the race | C01 | MECHANISM | B1 |
| 3 | **Transfer of the critical bytes on a slow link** (131,853 B JS+CSS, 22,572 B fonts; `<div id="app">` is empty, no shell) | **874.8** board-ready cold→warm (refuter 894.6) | chromium · 4× · Fast-3G · cold→warm · desk dpr1 | YES, slow-link regime only | `A3/A3-cache-probe.mjs` | reproduced (1,416.9 → 522.3). Already `immutable` 1 y—the layer is cached as well as it can be | C10 (bounded) · C09 | MECHANISM | B1 |
| 4 | **Draw-in, "leg 1"** (board-ready → `animState==='drawn'`; both bitmap and live fallback sit behind it, `HandDrawnGrid.vue:255-257`) | **779** mobile (715 busy) · **669** desk (581 busy) | chromium · 4× · unthrottled · cold | drawn YES | `refute/A6/refute-probes.mjs` | refuter's own finding | — | **REFUSED as a target**—a designed transition. Its CONTENTION is row 2's and is C01/C03's to clear | B1 |
| 5 | **The wasm is fetched and compiled twice** (resident + deal-channel worker); cells at 1,341, givens at 3,048 = 1,714 ms of blank board; warm gap 0.0 | **593** removable (ADJ from 716: one fetch 744.6 vs two concurrent 1,338.0) | chromium · 4× · Fast-3G · true first visit · desk dpr1 | ready NO · GIVENS YES | `A3/A3-wasm-probe.mjs`, `A3-truecold-probe.mjs`; `refute/A3/R3-wasm-single-flight.mjs` | ADJUSTED. Not a CDP artifact (2 requests on a true first visit, 3/3). Link-dominated: the gap is 1,298 ms at 1× CPU | C04 | MECHANISM | B5 |
| 6 | **WebKit misses the font preloads**—7 woff2 GETs cold, all 200 (fraunces ×3); chromium 4 (second fraunces a 300 B cache hit) | **79.0** of WebKit board-ready (237.0→158.0 with hints stripped; font-abort arm −77.0). The same strip COSTS chromium **+23.5** | webkit · 1× · unthrottled · cold // chromium · 4× | YES (webkit) | `A2/webkit-font-confirm.mjs`; `refute/A2/xablate.mjs --mode nopreload` | CONFIRMED, strengthened; the cure must be engine-aware | C07 | MECHANISM | B6 |
| 7 | **The edge**: `.wasm` reads `cf-cache-status: DYNAMIC` (5/5 GETs) under the same `immutable` directive; `/` is DYNAMIC on every load. Live build is T8.1's, so these are POLICY facts | wasm TTFB 142–179 vs HIT 88–110 ≈ **50–70**. A3's "−120…−150 for `/`" is ADJ: refuter's `/` reads 138–178 | curl from this host, live edge | every load's first hop | `A3/edge-census.sh`; `refute/A3/r3-edge-get.jsonl` | CONFIRMED headers, ADJUSTED ms | C09 (owner config) | MECHANISM | B1 |
| 8 | Entry-chunk freight: GameGallery 6 %, techniqueEngine 3 %, useSession 13 % executed at ready; entry 52.6 % overall | **≤ 6** (102,000 chars of dead code appended: 294.3→300.0, inside ±10 spread) | chromium · 4× · unthrottled · cold · desk dpr1 | ADJ → NO for readiness; a slow-link byte fact (~9 KB br) | `A2/module-map.jsonl`; `refute/A2/xablate.mjs --mode jspad` | ADJUSTED. `module-map.mjs` and `coverage-attrib.mjs` no longer run (sourcemaps deleted)—per-module figures do not verify; chunk-level 52.6 % does | C10 | MECHANISM | — |
| 9 | Render-blocking CSS, 48.4 % used at ready (93,735 B raw / 16,427 br) | **0** unthrottled (sheet doubled: −0.5); the WHOLE sheet ≈ **85** on Fast-3G | chromium · 4× · cold · desk dpr1 | slow link only | `A2/boot-freight.mjs`; `refute/A2/xablate.mjs --mode css2x` | ADJUSTED | C10 | MECHANISM | — |
| 10 | `bakeFace()` re-fetches Fraunces (`HandwrittenLogo.vue:35`) | **1** true first visit (300 B hit); a full 14,936 B under cache-disabled; a third 200 in WebKit. The Fast-3G 155 ms is emulator RTT on a cached response—not claimed | chromium · 4× | NO | `A2/boot-freight.mjs --cache firstvisit` | CONFIRMED | C07 | MECHANISM | B6 |
| 11 | Sudoku 16×16 bank fetched before ready in 39/45 windows, 0 boards read | **−0.1** (refuter −2.4)—nil | chromium · 4× · cold | NO | `A2/ablate-templates.mjs` | CONFIRMED | C10 | MECHANISM | — |
| 12 | AttributionCard avatar fetched 1 ms before ready | not ablated | chromium · 4× | unknown | `A2/boot-freight.mjs` | not taken | C10 | MECHANISM | — |
| 13 | ~~Sixteen gallery/poster chunks inside the boot window, "on the bake's critical path"~~ | abort-all moves firstBake 27 / 42 ms against a 41–133 ms spread; ready, TBT, page errors: 0 | chromium · 4× · cold · mobile dpr3 | **REFUTED → NO** | `refute/A6/refute-probes.mjs --mode ablate` | REFUTED (and it's sixteen, not fifteen) | ~~defer posters~~ | lawful, buys nothing | — |
| 14 | ~~`prewarm()` is built and unwired—"the cheapest lever"~~ | — | source census | — | — | **REFUTED**: `GameShell.vue:84-87` arms it on mount via `requestIdleCallback`; the grep wanted parens | ~~arm prewarm~~ | — | — |
| 15 | ~~Move the `solver.worker` modulepreload off the boot burst~~ (the chunk IS preloaded and unused before ready—fact stands) | stripping it: **+7.0** (slower; ≤ spread) | chromium · 4× · cold · desk | NO | `refute/A2/xablate.mjs --mode noworkerpreload` | fact CONFIRMED, cure REFUTED on efficacy | ~~C5~~ | — | — |

**CLEARED, so nobody re-opens them**: wasm on the board-ready path (0/45 windows; first request
from inside the Worker after ready)—CONFIRMED · thermo's 24 KB bank at boot (0/45)—CONFIRMED · W4
§4.4's bank in the entry chunk (entry statically imports only `vue-vendor` + `animation-vendor`,
13 dynamic imports)—CONFIRMED · dark mode as CSS freight (1,433 B = 1.5 %, zero
`prefers-color-scheme`)—CONFIRMED · a service worker (none) · font re-fetch, the `@theme`
cascade, wasm and image decode as the first toggle's cost (A5, all refuted with numbers; the
refuter reproduced 0 post-click resources).

Rows 1, 2 and 4 share one window and must not be summed: the two rounds of row 2 run across legs
4 and 1. A1's 2,051 ms pipeline total (28 encodes, desk dpr2) already contains row 2's 993.

### 1b. The gesture path (after board-ready; ranked by ms)

| # | suspect | ms / frames | regime | instrument | refuter | cure | law | budget |
|---|---|---|---|---|---|---|---|---|
| G1 | **The first theme flip re-bakes 8 poses** (4 wordmark 765×224 + 4 grid 1272²; the theme token is in both `cacheKey`s, `HandDrawnGrid.vue:214/216`, `HandwrittenLogo.vue:343`); N2..N4 bake 0. Symmetric (dark→light 1,202.4). HTTP-warm pays it in full (1,233.9). Per-document cache | N1 − median(N2..N4) = **1,103.5** (ADJ from 1,018.4, which was N1−N2; refuter 1,093–1,143). Blocking **436** (refuter 437) mobile dpr3; repaint held **373** vs 24. Whirl: **6 of ~100 frames** at 4×, **0** at 6×. WebKit 308–338 (325) | chromium 4× · desk dpr2 · cold Fast-3G; A6 rows mobile dpr3 unthrottled | `A5/toggle-probe.mjs`, `A6/toggle-and-trace.mjs`, `A1/bake-census.mjs`; `refute/A5/critpath-ablate.mjs` | CONFIRMED ×3. Pricing ADJ: free `toBlob` removes only 169.6 ms—the cost is blob-SVG load → `drawImage`. Cache is per SURFACE (4 slots each), not shared. **Mobile 882.0 is unstable** (refuter 950 / 1,318 / 3,772)—don't quote it | C02 | MECHANISM | B2 |
| G2 | **The fold's long frame IS a bake frame**, both directions. The wordmark's `<svg>` is re-created by the `component :is` swap inside it (`HandwrittenLogo.vue:215`, CH-67 species) and a bake tick follows: 4 bakes per direction forever, 8 on the first fold (16 at 6×). WHY its 4-slot stack cache misses is NOT established—C05's first act | entry worst **57.7** (long33 1, long50 1) at 253–284 ms; exit **42.5–68** at 49–70 ms. 6×: 91.7 / 82.4. 1×: 9.4, clean. WebKit 1×: 35 / 27 | chromium 4× · desk dpr2 · warm | `A7/fold-frames.mjs`; `refute/A7/worst-frame-offset.mjs` | ADJUSTED: magnitude CONFIRMED, the lane's offsets (205–212; 0–43) and mount/unmount mechanism REFUTED—the frame moves with throttle and the first bake lands 1–14 ms into it. Findings 2/3/4 are one | C05 | MECHANISM | B4 |
| G3 | **The exit's board mover is killed at birth**: `restoreBoardAnims` (`App.vue:447`) finishes it 0.3 ms after `runFold` creates it; the wordmark glides 520 ms beside an instant swap | NO TRAVEL 3/3, span 0 px—chromium desk, chromium 4× mobile, webkit desk. Entry GLIDES (640→304, 45 widths) | all | `A7/mover-census.mjs`, `fold-geometry.mjs` | CONFIRMED. Park COUNT isn't the cause (entry parks five times and glides)—ORDER is | C06 | MECHANISM (draws MORE) | B4 |
| G4 | **The drawer's first gesture rasters the sheet** (it's `visibility:hidden` until opened: 80 paints vs 12) | 4×: worst 32.5 / 25, long33 **0**. 6×: worst **49.5–59**, long33 **1**, 3/3 (refuter 41.9 / 57.9 / 50.2) | chromium · mobile 390×844 **dpr 1** (A4 set no scale factor) | `A4/drawer-trace.mjs` | CONFIRMED. Pre-rastering moves the cost toward the load path—a trade to size | C08 | MECHANISM | B3 |
| G5 | **The drawer's onset and SETTLE restyle**: `inert` on `.board-cells` 599–665 elements, `html.drawer-closed` 276–325, the tongue's Teleport 58–139; close-settle restyles 912–979 elements with raster exactly 0 | onset recalc 14.0 at 4× (first gesture: 21.8 at 4×, 30–31 at 6×); settle 8.2–13.0 (12.5–20.5 at 6×). Layout ≤ 3.1 ms; `backdrop-filter`: 0 sites | chromium · mobile 390×844 dpr 1 | `A4/onset-ablate.mjs` | CONFIRMED to the node | C08 | MECHANISM | B3 |
| G6 | The drawer's flip latency (click → `aria-expanded` → 2 rAF) | 28–34 at 1× · **75** desk / **116** mobile at 4× · 175–185 at 6× (refuter 68 / 105 / 186) | chromium | `A6/readiness-timeline.mjs` | CONFIRMED | C08 | MECHANISM | B3 |
| G7 | The tongue's berth swap: a one-frame rect jump | close **459.16 px** (both engines, to the pixel) but OCCLUDED ≈100 ms under the risen sheet—a disappearance and late reveal, not a flight. OPEN is the visible one: **157–158 px** chromium, 130–136 WebKit | both | `A4/gesture-geometry.mjs`; `refute/A4/tongue-visible.mjs` | ADJUSTED | — | GRAMMAR → W7 §13 | — |
| G8 | Steady-state theme flip: one long frame per toggle even when nothing bakes (`UpdateLayoutTree` 256.9 ms / 16,713 elements over the whirl) | whirl worst 41–75 at 4× (long33 1); 9.4 at 1× | chromium 4× · desk dpr2 | `A5/trace-restyle.mjs` | reproduced; not ablated | none yet—re-read after C02 | — | B2 |

Nothing in 1b can move board-ready (A4, A5, A7 refuters, lens 3: every gesture begins ≥ 400 ms after it).

## 2. THE BORN-RED BUDGET ROWS

Every proxy below is darwin chromium under CDP throttle. It says where to look and lets a cure
iterate without the phone. It never grades. **The RED is the device baseline**: 8.3's owner-run
instrument reads the same marks by the same rules on the real iOS instance at HEAD, and the
cure must beat THAT, on the device.

| id | budget | metric | proxy RED at chromium 4× on this tree | proxy method | device method |
|---|---|---|---|---|---|
| B1 | **first-load readiness** | `boardDrawnMs`: the first `is-active` MOVE between `.boil-frame-bitmap` / `.boil-frame-layer` siblings after board-ready. (A6 wrote `.boil-frame`—it matches nothing; corrected per refuter before anything is stamped.) Components: `boardReadyMs`, `firstBakeMs` | **3,317** (390×844 dpr3, Fast-3G, cold) · 2,813 unthrottled · desk dpr1 2,698 / 2,067. 6× Fast-3G mobile: **never fires inside 3.6 s**—the device window must be ≥ 8 s | `A6/readiness-timeline.mjs` | MutationObserver on the same class attribute; visible to every engine |
| B2 | **first dark-toggle latency** | `N1 − median(N2..N4)` click→settle (A5's settle rule) AND `N1 bakes == 0`; companion first-toggle blocking (rAF-gap PROXY on WebKit, labelled so) | **1,103.5** desk dpr2 (refuter 1,093–1,143) · blocking **436** mobile dpr3 · N1 bakes **8** | `A5/toggle-probe.mjs`, `A6/toggle-and-trace.mjs` | four taps ≥ 2 s apart; shape proposed ≤ 150 ms, SET from the device |
| B3 | **drawer open/close frame-time** | long33 / long50 / worst rAF delta per direction, the page's FIRST gesture reported apart from steady state; companion flip latency | **NOT RED at 4×—and taken at dpr 1 (gap 15)**: steady long33 0, worst 15.7 open / 9.4 close; first gesture worst 32.5, long33 0. RED only at 6× first gesture (49.5–59, long33 1, 3/3). Flip 116 ms. M02's RED is the owner's device word; the proxy doesn't reproduce a burst | `A4/drawer-trace.mjs` | rAF census across one open + one close, first and third gesture |
| B4 | **gallery in/out** (earned, A7) | per direction: long33 / worst; exit `boardTravel` = distinct rendered widths > 1; bakes per fold | entry worst **57.7** (long33 1) · exit **42.5–68** (long33 1) · exit travel **0 px, 3/3, every engine**—RED by construction · bakes 4 per fold, 8 first | `A7/fold-frames.mjs`, `fold-geometry.mjs` | same census; travel read off `getBoundingClientRect` per rAF |
| B5 | **time-to-givens** (earned, A3) | first `.game-cell` carrying text, from navigationStart; and `givens − cells` | **3,048** (gap 1,714); refuter 2,996–3,086. Warm 485, gap 0.0. Desk dpr1, Fast-3G | `A3/A3-wasm-probe.mjs` | one more mark in the 8.3 probe |
| B6 | **woff2 request census** (earned, A2) | max requests per subset on a cold boot, from the DRIVER's stream; timing-free, load-proof | RED: WebKit **7** GETs (2/2/3), chromium 4 (1/1/2). Gate ≤ 1 (fraunces ≤ 2 until C07's bake half lands) | `A2/webkit-font-confirm.mjs` | `getEntriesByType('resource')` count per `.woff2` name |

## 3. CURVE vs FRAMES

| transition | verdict | the numbers | routing |
|---|---|---|---|
| **drawer** | **NOT FRAMES in steady state; GRAMMAR defect present; FRAMES only on gesture one.** Compositor-clean: Layout ≤ 3.1 ms, no `backdrop-filter`, p50 8.3 (chromium) / 17 (WebKit), long33 0 everywhere at ≤ 4× | tongue jump 157–158 px visible on open; vanish + ≈100 ms late reveal on close; settle frame restyles 912–979 elements | the tongue's berth swap → **W7 §13**. First-gesture raster + onset/settle restyle + flip latency → **8.2 C08**. If the device also reads clean frames, M02 is W7's whole |
| **gallery in** | **FRAMES** (one bake frame at 253–284 ms, ~60 ms into the glide); the curve isn't at fault (p95 9.3 outside that frame) | 57.7 / 91.7 ms at 4× / 6×; +558 DOM nodes mount on the fold's first frame; three clocks (CSS, WAAPI, pencil-boil rAF) coupled by a literal `× 0.42` | bake frame → **8.2 C05**. Clocks and the mount-on-glide collision → **W7 §13** |
| **gallery out** | **UNDEFINED, and BROKEN**: the board never travels; no beat 0; no un-deal; `glassGlide` + `linear` + bare `ease` in one exit; controls settle at 400 ms under a 520 ms wordmark | NO TRAVEL 3/3, every engine; 5 concurrent animations from frame 0; worst 42.5–68 | mover ownership → **8.2 C06**, landed against W7's declared exit. Everything else → **W7 §13** |
| **toggle whirl** (the Bloom, ~1,010 ms; 340 ms accel-in, 800 ms springPop) | **FRAMES, by starvation**—the warp is an SVG transform feeding a filter, main-thread raster by construction, so it doesn't slow, it stops | N1: 6 frames (5.5 fps) at 4×, 28 mobile, **0 at 6×**; WebKit 49 (44.7 fps). N2+: ~100 frames at 91 fps, one 41–75 ms frame | contention → **8.2 C02**. Compositor-only whirl **REFUSED** (scales the filter's output, not its input). W7 §13: the grammar has to survive a starved main thread; the G8 frame is re-read after C02 |

## 4. THE COLD → WARM LAYER TABLE (A3; chromium 4× · Fast-3G · 1280×800 dpr1; medians of 3)

| layer | cold | warm | Δ | mechanism | refuter |
|---|---|---|---|---|---|
| HTML first hop | edge TTFB 138–258, DYNAMIC | same (`max-age=0`) | 0 | the edge won't hold the document | headers CONFIRMED; the claimed −120…−150 ADJ to ≈50–70 |
| critical JS+CSS (131,853 B) | last byte 1,114.2 | 343.7 | **−770.5** | HTTP cache, `immutable` | 1,119.6 → 350.9 |
| fonts (22,572 B) | `fonts.ready` 1,414.6 | 848.9 | −565.7 | HTTP cache; fetch, not parse | 1,449 → 867.2 |
| wasm (123,336 B; 48,561 gz) | 2 fetches, bodies 193 + 716 | 1 fetch, 0.1–0.4 | one worker fewer | HTTP cache | not an artifact; removable 593, not 716 |
| bakes | 28 encodes / 56 object URLs | **20–28**, a race on `fonts.ready` | ≈ 0 | **none**—the stacks live in a page-lifetime `Map`; nothing reaches IndexedDB or Cache Storage | A1's refuter: warm 20, not 28 |
| main-thread blocking | 10 tasks / 701 | 10 / 601 | −100 | only the font gate's re-bake | 730 → 613 |
| **board-ready** | **1,385.3** | **510.5** | **−874.8 (−63 %)** | network | 1,416.9 → 522.3 |
| **time-to-givens** | **3,048.4** | **485.3** | **−2,563 (−84 %)** | wasm cache + one worker fewer | 2,996–3,086 → 463–482 |
| wire | 188,822 B / 29 req (true first visit; 212,064 is a CDP double-count) | ≈ 0 / 27 | — | — | 188,822 exact |

The owner's sentence as numbers: "subsequent invocations are better" is the HTTP cache—board-ready
−63 %, givens −84 %. "Could be improved dramatically" is the compute, paid in full on every load:
mobile dpr3 warm still bakes at 1,994 ms (−25 %) with TBT 950 (−7 %) (A6; refuter 1,913 / 901).

## 5. GATE D ON THIS TREE, AND THE WGATE RESTAMP ROW

Four `ci-subset.mjs` runs, no `--build`, chromium 4×, desk 1440×900 dpr 1 (`A6/gate-d-run1..4.txt`):
**373 / 413 / VOID / 242 ms**; the median of the graded medians is **373** against
`boot.tbt.maxTbtMs` 1750—21 % of budget. WebKit NOT MEASURED in every run, never a pass.

- **They restamp nothing.** The row binds to n ≥ 3 RUNNER (ubuntu) readings; these are the
  darwin basis, inside T7-W3's 256 / 309 / 373 band—the bundle hasn't regressed; the runner's
  floor is unaddressed.
- **GATE D has never measured the defect.** It boots dpr 1 (`ci-subset.mjs:241`, `:449`); the
  cost is bake pixels. The same rate reads TBT(3000) **1,020** at dpr3 (refuter 1,000) and
  **1,454** at desk dpr2 (A1). For 8.3's executor: add the 390×844 dpr3 pose; restamp per pose.
- **Two executor defects, both CONFIRMED at source.** `ANCHOR_CEILING_MS` is tested on the
  MEDIAN anchor (`:720-730`): run 2 carried a window with anchor 876 ms and TBT 2,204 (over
  threshold) into the grade. And one control-window stall discards the whole chromium leg,
  boot TBT included (run 3, exit 2)—T7-W6's grade-before-exit cure, never applied to the
  instrument-failure case. Run 1's GATE B breach (125.5 < 130.68) is a HOST fact at load 32.
- `profilerBusyToBoardReadyMs` is **bimodal** (≈250 or ≈1,000, nothing between; the lane drew
  median 274, the refuter 952 at lower load). Don't quote it under n ≥ 9.

## 6. GAPS—what did not land

1. **No device number exists.** Real Safari and iOS were forbidden here (M19). Every row is a proxy; B1–B6's REDs are unset until 8.3 runs.
2. **WebKit throttled, in any lane.** No CDP: no CPU rate, no link, no `longtask`, no trace. Its TBT, busy and per-stage ms are NOT MEASURED; rAF gaps are proxies and are labelled so.
3. **Lane returns reached the synthesizer truncated**; A1's, A3's, A4's, A5's and A7's cure lists were rebuilt from their banked files and refuters. **A6's candidates C3 and C4 are on no disk** and aren't chartered. A7's C2..Cn were never law-checked (its refuter got the same truncation).
4. **A2's per-module figures cannot be re-run** (sourcemaps deleted with the scratch build; 8.1 forbids a rebuild). 8.2 rebuilds with maps before C10 quotes one.
5. **The readiness move of any entry-chunk split is unmeasured**—bounded at ≤ 6 ms by proxy ablation, not read.
6. **A7's per-stage split of the fold** (`fold-cdp-trace.mjs`: `Tracing.dataCollected` never fired). The bake-frame attribution rests on rAF + `longtask` + `drawImage` offsets.
7. **The visible-ink mark on the toggle** (`inkSwapMs` null 3/3); the background repaint carried the lens.
8. **CSS used at FIRST PAINT** as distinct from board-ready (A2's fcp arm sampled late).
9. **Toggle N1 at mobile dpr3** is unstable (882 lane; 950 / 1,318 / 3,772 refuter). Re-take at controlled load before B2 quotes a mobile proxy.
10. **Unsourced numbers, struck**: A7's board-ready 464.6 (its file says 502.3; refuter 500.6); A4's 498.4 (in no banked file); A4's 6× mobile board-ready 1,054 (refuter 708–718, −32 %).
11. **Persisting the stacks across loads has no measurement**, only an argument (C11, spike-first).
12. **The avatar** was never ablated; **the G8 flip frame** was never ablated; **desk warm** at A6 (−38 % / −41 %) was not independently re-taken.
13. **C01's π trap, already visible**: at chromium 1× the grid's two rounds are NOT byte-identical (958,892 / 958,179 vs the kept 957,715); at 4× they are. The first round captures something still in flux. The cure keeps the round the estate shows today.
14. **The edge's served brotli bytes on THIS tree**—live is T8.1's build; `vite preview` serves gzip. The brotli column is q11 off disk.
15. **The drawer has never been traced at dpr 3.** A4's and its refuter's "mobile" is 390×844 at dpr 1; the first gesture's cost is raster, and raster follows pixels (9× at dpr 3). The "frames are clean" verdict is a dpr-1 verdict. C08's first act re-takes it at dpr 3.
16. Instrument hygiene, recorded: A6's `RUN:` headers name port 4390 (`ci-subset`'s own, outside the band); refuters A4, A5 and A7 exceed their 30 KiB share (README).

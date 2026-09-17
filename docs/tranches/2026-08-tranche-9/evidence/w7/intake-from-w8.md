# W7 intake — from W8 §8.1: the transitions as they ARE, measured

2026-09-17 · dist `index-9rZPzI5DEcpe.js` (built at `58014efd`; md5 `fa3d1af9870916cc728de11e97f57a90`).
A FILE W7's design loop reads, not a call. W8's law (M09): speed is never bought with drawn
quality, so W8 cures mechanism and routes every CURVE and GRAMMAR question here. §13 defines
the animations against these numbers. Source of record: `evidence/w8/attribution/ATTRIBUTION.md`
§3; raws under `evidence/w8/attribution/A4`, `A5`, `A7` and their `refute/` twins.

Every number is a PROXY—Playwright chromium under CDP CPU throttle (4× = GATE D's rate), or
Playwright WebKit unthrottled. None is a Safari number; none is an iOS claim. "desk" here is
1280×800 dpr 2 (A5, A7) or dpr 1 (A4); mobile is 390×844 touch at dpr 3—EXCEPT every drawer
row from A4, taken at dpr 1 (its instruments set no scale factor). The drawer's "clean frames"
is a dpr-1 verdict until C08 re-takes it at dpr 3.

## 1. The grammar census (A7; refuter CONFIRMED the census, ADJUSTED two mechanisms)

**ENTRY, playing → gallery** (`enterGallery`, `App.vue:606`)—sequenced, three beats, THREE CLOCKS:

| beat | element | property | duration · easing | trigger | clock |
|---|---|---|---|---|---|
| B0 | `.scene-controls` | opacity 1→0 | 200 ms · `--ease-fadeOut` | keypress (`html.gallery-leaving`) | CSS, `scene.css:627` |
| B1 | `.board-peek-host` | translate + scale 2.105→1 | 520 ms · `cubic-bezier(0.32,0.72,0,1)` | +200 ms (`MOTION.chromeLeaveMs`) | WAAPI, `useFlipGlide` |
| B1 | `.logo-menu` | translate + scale 1.546→1 | 520 ms · same curve, same `startTime` | same | WAAPI |
| B2 | 4 flank `.game-card-deal` | opacity + lift | 350 ms · `easeOutCubic` | base 218 ms (`boardFoldMs × 0.42`, `GameGallery.vue:371`) + 90 ms per slot outward | pencil-boil rAF sequence |

B1 onset measured at 205–222 ms (chromium), 223–236 (WebKit); whole gesture ≈ 720 ms, the
deal's tail to ≈ 790. The clocks agree only through a hand-derived literal.

**EXIT, gallery → playing** (`unfoldToBoard`, `App.vue:639`)—everything concurrent from frame 0:

| element | property | duration · easing | note |
|---|---|---|---|
| `.board-peek-host` | scale 0.520→1 | 520 ms DECLARED · glass curve | **never runs**—§2 |
| `.logo-menu` | scale 0.647→1 | 520 ms · glass curve | runs |
| `.game-gallery` | opacity 1→0 | 200 ms · `--ease-glassGlide` | the whole deck, flat, no stagger |
| `.scene-controls` | `controls-fade-in` | 250 ms · **`linear`** · 150 ms delay | settles at 400 ms, 120 ms before the wordmark |
| `.washi-label`, `.action-bar` | opacity | 150 ms · **bare `ease`** | — |

The undefined parts, all CONFIRMED: no beat 0 on the way out; no un-deal (the entry's 90 ms
outward stagger has no inverse); three easing vocabularies in one exit, two of them defaults;
the chrome lands before the gesture that carries it. Five animations run from frame 0.

## 2. The verdicts, with their frame numbers

| transition | verdict | numbers (chromium 4× unless said) | who |
|---|---|---|---|
| **drawer, steady state** | **NOT FRAMES—at dpr 1.** Compositor-clean | long33 0, worst 9.4–17 ms, p50 8.3 (WebKit p50 17, long33 0); Layout ≤ 3.1 ms; `backdrop-filter`: 0 sites | — |
| **drawer, the tongue's berth swap** | **GRAMMAR** | the tongue Teleports between `board-edge` and `drawer-handle` on frame 1. OPEN: a visible one-frame jump of **157–158 px** (chromium), 130–136 (WebKit), tongue topmost before and after. CLOSE: the rect moves **459.16 px** in one frame (both engines, to the pixel) but lands UNDER the still-risen sheet—wholly occluded 11–12 frames chromium, 5–6 WebKit, **≈100 ms in both**—so the eye gets a disappearance and a late reveal, not a flight | **W7 §13** |
| **drawer, the sheet's travel** | recorded, no verdict | sheet max per-frame step 42–45 px at 120 Hz, 84–87 px at WebKit's 60 Hz; desk 16–17 / 30–39 px; desk visibility flips at frame 63 (≈520 ms) | W7, if the curve is reopened |
| **drawer, first gesture + onset/settle restyle + flip latency** | **FRAMES / MECHANISM** | first open: worst 32.5 ms at 4×, **49.5–59 ms long33 1 (3/3)** at 6×; settle frame restyles 912–979 elements with raster 0; click → `aria-expanded` 116 ms mobile / 75 desk at 4×, 28–34 at 1× | W8 8.2 C08 |
| **gallery in** | **FRAMES** (a bake frame), curve innocent | one long frame, **57.7 ms** (91.7 at 6×; 9.4 at 1×), at **253–284 ms**—~60 ms INTO the glide; p95 outside it 9.3. WebKit 1×: 35 ms. The wordmark bakes 4 poses per fold, 8 on the first (16 at 6×) | W8 8.2 C05 |
| **gallery in, the mount** | **GRAMMAR** | the deck mounts **+558 DOM nodes (1,218 → 1,776)** on the frame `chromeLeaveMs` expires—the fold's own first frame. Beat 0 doesn't cover the mount; it schedules the collision | **W7 §13** |
| **gallery out, the board** | **BROKEN**—a killed animation, not a curve | `restoreBoardAnims` (`App.vue:447`) finishes the fold's own board mover 0.3 ms after creation: **NO TRAVEL, span 0 px, 3/3, every engine**, beside a wordmark gliding 520 ms. Entry glides 640 → 304 px over 45 widths | W8 8.2 **C06**, landed against YOUR declared exit |
| **gallery out, everything else** | **UNDEFINED** | §1's five items; worst frame 42.5–68 ms at 49–70 ms after the press (also a bake frame) | **W7 §13** |
| **toggle whirl** (the Bloom: ~1,010 ms `plush-land`; `.warp` 340 ms accel-in, 800 ms springPop) | **FRAMES, by starvation** | first invocation: **6 of ~100 frames (5.5 fps)** desk, 28 mobile, **0 frames in the whole window at 6×**; WebKit 49 frames / 44.7 fps, worst 271 ms. Later invocations ~100 frames / 91 fps with ONE 41–75 ms frame each (the theme-class restyle; 9.4 ms at 1×). Background repaint held 373 ms vs 24 | W8 8.2 C02 |

## 3. What W8 needs W7 to decide

1. **The exit's grammar**, whole: beat 0, an un-deal or a declared reason for none, one easing vocabulary, where the controls land against the 520 ms fold. C06 makes the board travel again; it needs the declared exit to land against, and the travel is a motion DELTA yours to declare.
2. **The tongue's berth swap**—a defined hand-off (or a declared cut) in both directions.
3. **One clock for the fold**, or a declared coupling: CSS + WAAPI + pencil-boil rAF are joined by `× 0.42`.
4. **The deck's mount vs the glide's first frame.** If C10 lazy-mounts the gallery, may a declared animation begin on a frame that also evaluates a module—or must it gate on the prefetch?
5. **The Bloom has to survive a starved main thread.** The warp is an SVG transform feeding a filter—main-thread raster by construction. Compositor-only whirl is REFUSED (it scales the filter's output, not its input); shortening it is REFUSED. W8 removes the contention; the grammar should still say what the gesture is at 6 frames.
6. **The stale-ink window.** C02's fallback on a pose-cache miss holds the previous theme's ink, at full quality, ~1 s through the whirl and re-bakes after. Accept it in writing, or refuse it.
7. **The draw-in** (board-ready → drawn, 669–790 ms at 4×) is M09-protected and W8 won't touch its timing. It plays under the bake burst today (715 ms busy of 779); C01/C03 clear that. If §13 re-times it, W8's B1 proxy moves with it—say so.
8. **The WebKit FOUT window**: the real Fraunces face starts arriving at ~130 ms, not ~22, because the preload isn't consumed. Is the fallback pose an acceptable first frame?
9. **`color-scheme` is declared nowhere** (`colorScheme === "normal"` under `.dark`): scrollbars, form controls and `cell-native-input` stay light in dark mode. Quality, not perf.
10. **Pre-rastering the drawer's sheet** (C08 A) and **the avatar in first paint** (C10): presentation calls with a perf price; W8 brings the price.

Frame budgets for each transition get set on the DEVICE (8.3) once §13 has defined them.

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

---

## ADDENDUM 2026-09-18 — what §8.2 changed under §13's feet (the fold, `evidence/w8/cures/FOLD-MANIFEST.md`)

Six cures fold onto master (8.3, C01, C06, C10, C07a, C07b); C02, C03, C04, C05, C08 and C11 do
not (the manifest's §3 has each one's numbers). Every number below is still a PROXY—chromium
under CDP throttle or Playwright WebKit unthrottled—and the device sets the frame budgets.
Nothing here is a Safari or iOS claim. Append only; §1–§3 above stand as written.

### A. The exit now travels, on the entry's tuple mirrored (C06, `0bf9cb0e`; §2's "gallery out, the board" row is CURED at ownership)

The board's exit mover is tagged (`useFlipGlide.ts` `FLIP_GLIDE_ANIM_ID = "flip-glide"`) and
`App.vue`'s `boardAnimations()` no longer sweeps it, so `restoreBoardAnims` stops finishing it
0.3 ms after birth. No curve, no duration was minted: the exit rides `foldCtl`—the SAME
`useFlipGlide` controller, `MOTION.boardFoldMs` 520 and `MOTION.curves.drawerGlide` the entry
rides—so what §1's exit table showed as "scale 0.520→1 · 520 ms DECLARED · never runs" now
runs, and the mover reaches its own CANCEL at 518–531 ms. Measured (`fold-geometry.mjs`,
warm, 6/6 windows per regime, both engines): exit `boardTravel` 0 px → **296 px** chromium desk
1280×800 dpr 2, **78 px** chromium 390×844 dpr 3, 218–264 / 64–73 px WebKit (PROXY). Step share
sits inside the entry's own band on quiet hosts (0.071 vs 0.072 chromium 1× desk); at load
100–170 the WebKit exit reads COARSER than the entry (0.660 vs 0.471)—not closable there. The
exit's animation census carries exactly one more live animation (5 → 6 at 82–216 ms; 2 → 3 at
300 ms): that one is the board. The exit's worst frame is bracketed at zero across three passes
(−6.3 / +1.5 / +27 against a +29 untouched control).

**What is still yours, unchanged**: §3.1 whole—no beat 0, no un-deal, three easing vocabularies,
controls settling at 400 ms under a 520 ms wordmark. C06 gives the declared exit a board to land
against; it declares nothing. If §13 re-points the exit's curve or duration, it re-points the
board with it (one controller).

### B. What the fold's bake frame looks like after C05—and C05 is NOT in the fold

C05 (`c003c1d0`) is held: it is one reschedule inside C02's `usePosePrewarm`, and the frame it
moves is a frame C02 would introduce—on a C02 tree the first fold's 1,100 ms window carries a
>150 ms task in 38 of 38 base windows (a 1,272² grid pose from the idle warm, released at
`BOOT_CENSUS_MS` 3,000 ms, which is where a fold lands). Without C02 that task does not exist,
and the fold's frames are the ones §2 already quotes: **entry worst 57.7 ms at 253–284 ms, the
steady-state G2 frame, UNMOVED** (C05 leaves it inside spread even where it lands: 57.5 → 52.7).

What C05's attribution DID settle, and §13 should read (`cures/C05/RECORD.md` §1):

- **A7's "the wordmark bakes 4 poses per fold, 8 on the first" is the CH-62 `posePaints`
  probe**: 24 × 24 device px `drawImage`s, one per pose, on every ADMITTED stack (a cache hit
  re-admits), a 1.2–3.0 ms burst per direction. The magnitude A7 measured is real; the surface
  it was attributed to is not.
- **The first entry's four REAL encodes are a legitimate re-key, once**: `.board-group.is-gallery
  .masthead { --logo-scale: 0.72 }` takes the `<svg>`'s box 382.39 × 111.92 → 275.36 × 80.59, so
  `captureH` latches 112 → 81 and the key goes `logo-sudoku-l-205|2|382.5x112|4` →
  `…|2|277x81|4`; four encodes at 310–350 ms, 9 of 9 runs, BOTH arms. The 4-slot cache holds
  both boxes thereafter. A label change (ArrowRight on the deck) bakes 4 at 41–98 ms, 9/9.
- **The deck's mount is still on the fold's first frame** (+558 nodes → 1,776; C10 adds 3 head
  elements, 1,779). §3.4 is live.

So the fold's first-entry frame on the folded tree = the wordmark's legitimate re-key encodes
(~4 × a few ms at 310–350 ms) + the deck's +558-node mount + the `posePaints` probe burst; the
steady-state 57.7 ms frame is the mount and the killed-mover residue, not a bake. If §13 wants
the re-key gone, the cure is pre-warming the gallery identity before the fold (C05 §7: needs an
alternate-box token `.board-group { --logo-scale-alt: 0.72 }` no component owns today, and its
number does not move on any proxy here).

### C. C02's cache-miss fallback still needs your written acceptance—and C02 is not landed

§3.6 stands exactly as asked. C02 (`84a4ad45` …) reproduced B2's mark −1,108 ms with N1 bakes
8 → 0 (chromium 4× Fast-3G cold desk dpr 2) and the whirl un-starved (2 → 95 frames) but does
not land: it needs pencil-boil 0.12.1 (`prewarm`, local only, unpublished), and its one-pose
idle encodes red GATE A's WebKit idle census (long33 1/1 vs 0/0 base)—a trade the chair rules
on, not the code. The hold-through-the-whirl fallback on a pose-cache miss (DPR or box changed
since boot) was **NOT TAKEN** in any round: the miss path today is exactly HEAD's—the library
bakes inside the gesture. Your acceptance or refusal of "the previous theme's ink, at full
quality, ~1 s through the whirl, re-bake after" is a precondition to C02 re-opening, not a
consequence of it.

Two things C02's readings settle for §13 regardless (`cures/C02/README.md` §2): with the bakes
gone, N1's `UpdateLayoutTree` reads 277 ms / ~100 elements like N2–N4 (base N1's 86 ms is
TRUNCATED because the whirl never ran)—**G8's 41–75 ms restyle frame is the top item on the
toggle once the contention goes**, and it is a grammar-and-CSS fact, yours; and the first flip's
background repaint stays ~110 ms longer than steady state with zero bakes (383 → 135.5 vs 24
ms)—first-time invalidation of the dark ladder, not a bake.

### D. C10's idle-vs-intent prefetch (your ask 4), now a measured shape

C10 (`83ee20b6` + `db43df48`) lazy-mounts the deck: `GameGallery` is a `shallowRef<Component |
null>` behind `<component :is>` at the view flip; its chunk is warmed at idle by a TWO-condition
gate (board cells exist AND `load` has fired, later wins, +2 rAF of margin, 3,000 ms backstop)
AND on intent at the head of `enterGallery`—whichever comes first. Chunk fetch starts at
board-ready +86…+280 ms and is in hand at +290…+503 ms (a load band; before the repair it was
+800 / +1,550). The A7 first fold after the split: entry worst 117.5 → 108.7, long33 2/2, bakes
8/8/8—no long frame attributable to chunk evaluation. **The residue that is yours to declare**:
a fold pressed inside ~0.3 s of board-ready pays the chunk on the gesture—+298 ms (author, load
12–18) to +1,010 ms (verifier, load 46), level by a 400 ms delay. So the answer to ask 4 on the
proxy is: the declared animation does not begin on a frame that evaluates the module EXCEPT when
the press beats the warm; §13 decides whether that press waits (gate on the prefetch), plays the
deck's fade over a not-yet-mounted frame, or accepts the band. The "avatar in first paint" half
of ask 10 was not ablated by C10.

### E. Smaller facts §13 inherits

- **Drawer (asks 2, and M02)**: C08 did not land. Its dpr-3 re-take (chromium 390×844, cold)
  closes the dpr-1 caveat in this file's head: steady long33 0 in 20/20 windows both arms, first
  gesture open worst 34.8 ms at 4× / 58.4 at 6×, and the first gesture's extra cost is
  **recalc, not raster** (+9.3 of +15 ms vs +1.6)—the sheet's first style resolution, with
  `inert` invalidating 601 of 991 elements from a 415-element subtree. Deferring the a11y writes
  out of the settle frame SPLITS a coalesced 826-element / 7.24 ms pass into two (994 / 10.97).
  M02 ("not smooth") has no proxy at dpr 1 or dpr 3. If the device reads clean frames too, M02 is
  the tongue's berth swap—yours, whole.
- **The draw-in (ask 7)**: untouched, as promised. C03's lane queue moved its blocking 665 → 353
  ms (chromium 4× unthrottled mobile dpr 3) but regressed firstBake +610 ms at 6× Fast-3G and
  was reset; the draw-in still plays under C01's now-single bake round.
- **The WebKit FOUT window (ask 8)**: unchanged by C07a/C07b—`link`/`css` woff2 loads start at
  the same 172–186 ms in both arms. What C07b changes is that the wordmark's BITMAPS mount
  ~330 ms later on WebKit (first logo encode t0 182–221 → 521–577 ms); in that window the
  wordmark is its pose-0 live filter painting the page's own Fraunces, not a fallback face. The
  owner's eye decides whether that is visible.
- **8.3's fold direction question**: the probe reads the fold's travel off `.board-cells`
  (`galleryWidthsNode`), A7 off the projected card; the captures read 20 distinct widths TO THE
  PICKER and 1 TO THE BOARD (the mirror of G3). After C06 both directions should read > 1 on the
  device; if the way back still reads 1, the two instruments watch different nodes.

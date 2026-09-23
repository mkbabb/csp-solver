# G-MOTION: prototype read (T9-M15 theme flip, T9-M19 board glide)

Prototyper: Opus. Worktree `.claude/worktrees/wf_3b66f064-970-16`, HEAD `b9ba5c42` (src byte-identical to `1e6cfbbf`). Nothing committed.
The arms are the prototype (`dist-proto`, 127.0.0.1:4253) and the control, HEAD's own build (`dist-base`, 127.0.0.1:4254). Both are served by `vite preview` from the same `.intake/build.mts`.
Engines: Playwright Chromium and Playwright WebKit, both headless. Headless WebKit is not Safari.
The box was loaded by other lanes for the whole read. Any WebKit number over about 40 ms is noise unless the interleaved A/B shows it too.

## Numbers (prototype vs HEAD)

### M19: the board glide (gates GA1 to GA9)

| gate | read | prototype | HEAD |
|---|---|---|---|
| GA1 enter, frame 1 | Chromium 1280 and 390, both themes: centre / width error in px | 0 / 0 in all four cells | 97.9 to 98.5 / −33 to −35 at 1280; 23.7 centre at 390 |
| GA1 | WebKit 1280 and 390, both themes | centre 0.1 to 3.0, width −2.2 to −5.9 (1280 dark is 3.0 / −5.9) | centre 101 to 104.5, width 26.8 to 28.8 |
| GA2 | visible fraction of the board through the fold (rAF, clip-aware geometry) | 1.0 in every cell | 0.25 at 1280, 0.49 to 0.54 at 390 |
| GA2 | brief-exact variant, slot unclip only | 0.712 (the viewport clipped the 640 px board at a 456 px case height) | n/a |
| GA3 | first painted frame of the fold (Chromium screencast) | the whole board at FIRST, centre error 0.5 to 1 px; 0 frames rest in the face | at 390 the first painted frame is already face-sized (257 px), centre error 57 px |
| GA4 | Chromium: frames over 34 ms (rAF and painted) / frames in fold / encodes in fold | 0 / 64 to 72 / 0 | 0 / similar / 4 (wordmark 554×162 at about +234) |
| GA4 | WebKit: frames over 34 ms (rAF) / frames in fold / encodes in fold | 1 to 2, max 36 to 44 / 50 to 52 / 0 | 0 to 1 / 50 to 52 / 4 |
| GA5 | exit, live anchor dx / dy / dw in px | 0 / 0 to −0.1 / 0 in both engines; WebKit 1280 dx −3 | dy −35.2, dw +28.8 at 1280; dy −34, dw +46.4 at 390 |
| GA5 | poster exit (lazy scene) | 1 mover; the board cuts 632 px | same: 1 mover, 632 px cut. Pre-existing, RED in both arms |
| GA6 | card height through the exit | constant: 407.9 at 1280, 357.8 at 390, 180.9 at 390×560 | collapses to 104 / 132.7 at 1280 and 101.6 / 130.3 at 390 |
| GA6 | 390: board-centre steps over 20 px after frame 1 | 0 | 1 (a 135 px drop) |
| GA6 | negative control (the leave left in flow) | card falls to 101.6, the 135 px drop comes back | n/a |
| GA7 | outline-whole fraction | discriminates at 390 only (0.94). At 1280 prototype 0.11 to 0.37, negative control 0, HEAD 0.33. VOID at 1280 | |
| GA8 | pre-scrolled page | VACUOUS. At 390×844 and 390×560 the page never scrolls (max scrollTop 0) | |
| GA9 | interrupt mid-verb, both directions, both engines | settles clean: 0 marks, no pin, slot overflow hidden, 0 style writes over 3 frames, still frames | same |
| PRM | movers on both verbs | 0 in both engines | 0 |

The fold's z-order was cured after the first read (see Rungs, cure 3). A re-read of the prototype after the cure (`numbers/summary-zfix-clean.jsonl`, `numbers/summary-zfix2.jsonl`) found no change at Chromium 1280 light or 390 dark: GA1 0 / 0, GA2 1.0, GA4 0 over 34 ms, 0 encodes, GA5 0 / 0 / 0, GA6 card constant. At WebKit 1280 light it also found no change: GA1 3.0 / −5.9, GA4 1 frame over 34 ms, GA5 dx −3. WebKit 390 dark: a first read after the cure gave GA1 15.2 / −33.6, but its first rAF landed 19 ms after the start. The interleaved re-read (×2 per arm) gave:
- prototype: GA1 1.2 / −2.8 both times, GA2 1.0, GA4 1 frame over 34 ms, 0 encodes;
- HEAD: GA1 26.8 to 27.6 / −23 to −25.9, GA2 0.52 to 0.53, GA4 1 frame over 34 ms, 4 encodes at +282 to +294.

So WebKit GA4 is at parity at 390 when both arms share the box.

### M15: the theme flip (gates GB1 to GB7)

| gate | read | prototype | HEAD |
|---|---|---|---|
| GB1/GB2 | Chromium cold flip: bloom scale at birth / max frame 0 to 900 ms / encodes / href swaps | 0.20 to 0.28 / 13 to 47 ms / 0 / 0 | 0.47 to 0.62 / 104 to 189 ms / 8 / 8 (hrefs swap on every flip) |
| GB1/GB2 | WebKit cold flip, interleaved A/B round 3 (the quiet round) | 44 ms, born 0.195 | 254 ms, born 0.848 |
| GB1/GB2 | WebKit warm flips, round 3 | max 36 to 37 ms, 1 frame over 34 each | max 30 to 32 ms, 0 frames over 34. The prototype is about 5 ms worse warm |
| GB1/GB2 | WebKit rounds 1 and 2 (noisy box) | frames of 50 to 330 ms | frames of 50 to 330 ms. Both arms, so this is the box |
| GB1/GB2 | Δscale ≤ 0.08 | mostly met in Chromium (0.04 to 0.15); RED in noisy WebKit | |
| GB3 | ink identity at rest, max channel Δ, grid (target ≤ 1/255) | Chromium 2 / 2 at 1280 (74 and 21 px over 1), 6 / 5 at 390; WebKit 9 / 2 / 10 / 7, px over 4 ≤ 586 | reference |
| GB3 | ink identity at rest, logo | Chromium 73 to 75 at 1280, 27 to 57 at 390 (edge resampling; AA pixels 3471 → 2321); WebKit ≤ 14 | reference |
| GB4 | idle, 3 s rAF window | Chromium 133.4 fps, 0 frames over 33 ms; WebKit 97.5 to 98.1 fps, 0 over 33 ms, worst 13 to 30 ms | Chromium 133.9; WebKit 98.2, worst 13 to 15 |
| GB4 | filter census | identical to HEAD: 9 playing light, 11 dark, 13 gallery. `filter-census.spec` passes in both engines | same |
| GB4 | raster union within ±2% during the fold | NOT MEASURED | |
| GB5 | | carried; the A/B above is the read | |
| GB6 | stall injector | NOT BUILT (RED, carried) | |
| GB7 | PRM cold flip, max frame | Chromium 19.9 to 34.8 ms; WebKit 37 to 48 ms on every flip | Chromium 125.5; WebKit 240 cold, 32 to 35 warm |

### GC: code gates

| gate | read |
|---|---|
| GC1 | `@property --live-fit { syntax: "<number>"; inherits: true; initial-value: 0 }` ships in the first static stylesheet (`index-*.css`). Ablation (strip the inline fit): the prototype face is scale 0 and the board width 0 in both engines. HEAD shows a 640 px board spilling out of the face |
| GC2 | no timing literals in the diff. The deal stagger (`MOTION.dealStaggerMs = 90`) and the gallery leave (`MOTION.chromeLeaveMs`, formerly a 200 ms literal) are now homed |
| GC3 | `lint:copy` GREEN (0 em or en dashes, 0 jargon). `lint:motion` GREEN (35 specs) |
| GC4 π | movedOutsideZone 0 in all 16 cells (2 engines × 2 viewports × 2 themes × playing/gallery). Tag delta: see "Structural change" |

### Batteries

- vue-tsc: 0 errors. vitest: 69 files, 847 tests passed. Both ran before the z-order cure, which is two CSS rules in SFC style blocks. Re-run after the cure: eslint on the 8 changed files clean, `lint:motion` and `lint:copy` GREEN.
- `drawer.spec`: 8/8 in Chromium and WebKit.
- Goldens: 4/4 on both arms with the selector-patched copy (`instruments/pw-golden.config.mts`). The raw config fails 4/4 on both arms, on `waitForSelector('image.…')`.
- `gallery.spec` CH-67 and `wordmark-integrity` (6, WebKit) fail only on the `image.logo-pose-bmp` selector. The patched copies pass 29/29.
- `theme-bake-freshness` (20 fails) is SUPERSEDED, not regressed. It reads the baked blob's ink, and that blob is now theme-free coverage. It needs a rewrite that asserts painted ink.

## What was built

- **M19 enter** (`App.vue`, `useFlipGlide.ts`).
  - `flipTransform(first, last, parentScale)` divides the translate by the `--live-fit` ancestor scale.
  - `run(movers, { holdFirstFrame })` leaves `startTime` pending, so the first painted frame is FIRST.
  - During the fold (`.is-folding`) the slot unclips and the centre card rises.
  - Beyond the brief, the scrollport also lifts:
    - the viewport stops scrolling and clips x only (`clip-path: inset(-100vmax 0)`);
    - the track holds the scrolled pose by a translate;
    - scrollLeft is restored at the settle.
- **M19 exit.**
  - FIRST is the face (`.game-card.is-center .board-peek-host`).
  - The leaving deck is pinned `position: fixed` in `@before-leave`, at a rect read before the state flip. PRM skips the pin.
  - `.board-group.is-unfolding` goes to z 1.
  - The gallery leave runs on `MOTION.chromeLeaveMs` over `--ease-glassGlide`.
- **`--live-fit`** is registered with initial 0 (GC1).
- **M15, "ink is paint".**
  - The grid and logo bakes are theme-free coverage (`#000`) with cache keys that carry no theme, so a flip re-bakes nothing.
  - The theme colour is painted live:
    - grid (A2): an HTML `.grid-ink` layer of divs, each carrying `mask-image: url(bake)` over `background: var(--grid-line-color)`;
    - logo (A1): an SVG `<mask maskUnits="userSpaceOnUse">` around the baked `<image>`, and a `<rect fill: currentColor>` that uses it.
- **Wordmark.** The bake key is held for the length of a verb (`holdBake` = `folding`), so the fold re-bakes nothing. The label re-bake lands at the settle.

## Rungs

1. **A1**, all ink as in-SVG masks (`instruments/rung-A1.diff`).
   - Chromium: max Δ 83 under the default objectBoundingBox mask region. An explicit userSpaceOnUse region brought it to Δ 2.
   - WebKit re-rendered the SVG masks on every repaint: idle worst 36 ms, 95 fps, 1 frame over 33 ms; a gallery flip gave 7 to 8 frames over 50 ms.
   - Retired for the grid.
2. **A2**, the grid moves to an HTML CSS-mask layer.
   - WebKit idle back to 97.5 to 98.1 fps, 0 frames over 33 ms.
   - A CSS `mask` on an SVG `<rect>` paints unmasked in WebKit, so the logo stays on A1. At the logo's size the cost doesn't show: idle equals HEAD.
3. **Fold z-order.**
   - At +60 ms of the fold (animations paused, both engines), two things painted over the full board in flight:
     - the centre card's own outline, because the fit's transform walls the board's z 20 inside a z-auto context under the outline's z 1;
     - the staging band's outline (z 1) and washi tag (z 50), because the band has no stacking context of its own.
   - Cure, fold-only:
     - `.game-card.is-folding .live-face-fit { z-index: 2 }`;
     - `.gallery-viewport.is-folding ~ .staging-band { isolation: isolate }`.
   - Verified clean in both engines (`shots/` not banked; crop c2 is re-cut after the cure). Rest state unchanged, since both rules key on the fold class.

## Structural change for the chair (A2)

π tag delta:
- grid: 4 `<image>` inside the svg become `div.grid-ink` with 4 `div`s, outside the svg;
- logo: 4 `<image>` become 4 `<mask><image/></mask>` plus 4 `<rect>`.

The paint order is unchanged (movedOutsideZone 0). Four specs select `image.*` and need their selectors updated. `theme-bake-freshness` needs a rewrite.

## Frames

The crops are in `crops/`. Each one names engine · theme · viewport · pointer.

- `c1-m15-toggle-cold-flip-chromium-light-to-dark-1280x800-fine.png`: HEAD's grid vanishes mid-flip at +270; the prototype's ink has already turned.
- `c2-m19-enter-fold-chromium-light-1280x800-fine.png`: the whole board unclipped and on top at +282, landing at +520. HEAD shows the crop.
- `c3-m19-exit-webkit-dark-390x844-coarse.png`: the exit paused at +60 and +205 into the glide (every animation seeked on its own clock).
  - HEAD: the deck collapses (card 130 px), so the page rides up and the wordmark clips at the top. Then comes the 135 px drop at removal (GA6).
  - Prototype: the card holds at 358 px, and the board glides straight to its rest pose.
  - A first cut paused on time since the key press and caught both arms already landed. It was discarded.
- `c4-m15-grid-rest-diff-armA-vs-head-1280x800-fine.png`: GB3 grid diff maps (|Δ|×8), Chromium and WebKit × light and dark, fine pointer, PRM pose 0.

## Gaps (every one)

- Poster exit (lazy scene): 1 mover, a 632 px cut, in BOTH arms. Pre-existing; not cured here.
- GB3 strictly RED. Logo Chromium Δ 73 to 75 (edge resampling through the mask). Grid Δ 2 to 10.
- WebKit GA1 is marginal (up to 3.0 px / −5.9 px). WebKit GA4 shows 1 to 2 frames over 34 ms in the prototype vs 0 to 1 in HEAD in the separate batteries, and parity (1 vs 1) in the interleaved 390 re-read.
- WebKit warm flip is about 5 ms worse than HEAD (36 to 37 vs 30 to 32 ms). M15-b is carried.
- GB6 (stall injector) not built. GB5 carried.
- Instruments void or vacuous: GA7 at 1280; GA8 (the page never scrolls); the painted GA2 metric (HEAD also read 1.0).
- Raster union within ±2% during the fold: not measured.
- The wordmark label re-bake is deferred to the fold's settle. In one WebKit 390 read its 4 encodes landed at +515 of the fold. The frame cost at the landing is not isolated.
- `theme-bake-freshness` is superseded; 4 specs need selector updates.
- The scrollport lift and the fold z-order cure go beyond the brief. The chair should rule on both.
- A2 is a structural tag change (above).
- Headless WebKit is not Safari. The box was loaded by other lanes throughout.

## Files

- `prototype.diff`: the 8 source files.
- `instruments/`: probes, batteries, configs, the A1 rung.
- `numbers/`: summary jsonl per battery (per-frame series not banked), rest logs, A/B aggregates.

Re-run everything with the scripts in `instruments/`: `serve.sh`, then `motion-battery.sh <engine>`, `rest-battery.sh`, `ab-toggle.sh`, `extra-battery.sh`, `e2e-battery.sh`.

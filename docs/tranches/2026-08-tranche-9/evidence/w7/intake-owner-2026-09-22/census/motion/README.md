# census:motion — T9-M15 + T9-M19 on main `1e6cfbbf`

Measured on the product the owner audited: master `1e6cfbbf`, vite dev server on 127.0.0.1:4250
with its own cacheDir, main `src/` untouched (`git status` clean, `src` is `dr-xr-xr-x`). The
server was killed by its recorded PIDs (npx 33510, listener 33544). Instrument: headless Playwright
chromium-1223 and webkit at DPR 2. A rAF sampler reads getBoundingClientRect plus the computed
transform, opacity and visibility on every frame. An `Element.animate` hook logs each FLIP mover's
keyframes and the rect at the moment of the call. LoAF gives script attribution (chromium only), and
a `drawImage` hook records the bakes. Each boot loads the page twice so a vite dependency reload
lands before the sampling window. `series.json` holds the per-run summaries (min/median/max frame,
counts over 16.7/25/50 ms, and every discontinuity). The raw per-frame JSON stays in
`web/frontend/.owner-intake/motion/v2/runs/`. `probe/` holds the scripts.

**Reading of the owner's sentence.** "The storybook animation for the darkmode toggle" is the
toggle's own Bloom. The code uses the same word for it (`DarkModeToggle.vue:778`: "Without these
the storybook dies silently — found by the owner's eye"). The chair's intake reading was that the
shrink is a poster re-cut and the teleport is the carousel's FLIP DOM move. **The measurement
refutes that reading.** Across 8 flips in the gallery view (chromium and webkit at 1280), the deck
cards show a 0 px rect delta, 0 poster `src` changes and 0 transform or opacity changes. The shrink
and the teleport both belong to the sun and moon. The chair needs to reconcile this row.

## 1. Numbers: T9-M15, the toggle's Bloom

Design reference: a warm chromium flip at 1280 (flips 1–3 in `t-chromium-playing-1280-light`). The
longest frame is 10.3 ms, with 0 frames over 16.7 ms. The incoming body first shows at warp scale
0.22 with opacity 0.03, which the opacity hides. The largest step in visible scale is about 0.05
per 8.3 ms frame. The outgoing body wrings 1 → 0.2 over 340 ms and the incoming blooms to a 1.092
crest at about +530 ms. **The curve is continuous whenever the main thread is free.**

"Born" in the table below is the incoming body's warp scale on the first frame it's visible. The
designed value is about 0.22.

| engine · view · viewport · pointer | flip 0 (cold theme) | born | largest jump | flips 1–3 (warm) |
|---|---|---|---|---|
| chromium · playing · 1280×800 · fine, light boot | frames of 150.4 ms and 149.8 ms at +113→+263→+413 | **0.686** at +263 (op 0.77) | sun 0.767 → gone and moon 0.686 → 1.004 in one 149.8 ms frame | max 17.1 ms; born 0.22 |
| chromium · playing · 1280×800 · fine, dark boot | 192.7 ms frame ending +333; 5 frames over 50 ms | **0.659** | 0.659 (sun appears) | max 33.7 ms; 0 over 50 ms; born 0.26–0.30 |
| chromium · gallery · 1280×800 · fine | 158.4 / 133.3 / 123.9 / 126.1 ms | **0.544** at +272 | 0.544 | max 41.8 ms; 0 over 50 ms; born 0.22–0.30 |
| chromium · playing · 390×844 · coarse (hasTouch) | 108.2 ms ending +212 | **0.544** | 0.544 | max 10.4 ms; born 0.22 |
| webkit · playing · 1280×800 · fine, light boot | **829 ms** single frame (+129→+958) | 0.253 | **0.954**: the sun jumps from 0.954 to gone and the moon arrives full in one frame | max 108 ms; **5–7 frames over 50 ms per flip**; born **0.48–0.53** |
| webkit · playing · 1280×800 · fine, dark boot | **862 ms** single frame | **1.00** (the sun's first visible frame is full size) | 1.0 | max 112 ms; 4–5 frames over 50 ms; born **0.39–0.41** |
| webkit · gallery · 1280×800 · fine | **791 ms** single frame | 0.394 | 0.925 | max 164 ms; 4–6 frames over 50 ms; born **0.63–0.71** |
| webkit · playing · 390×844 · coarse (hasTouch) | 141 ms ending +181 | **0.511** | 0.511 | max 56 ms; born 0.18–0.20 (close to clean) |

**The discontinuity.** On a cold flip, the outgoing body shrinks for about 100 ms. The frame then
freezes for 108–193 ms (chromium) or 790–862 ms (webkit). The next painted frame shows the incoming
body at 0.54–1.0 of full size. That's the owner's "shrinks the item and then teleports it"
verbatim. Crop c1 is the chromium light→dark cold flip: the sun holds large through the stall and
the moon lands full over it. On WebKit the same thing happens on **every** flip at 1280, not just
the first. Frames run 50–164 ms and the incoming is first seen at 0.40–0.71 scale.

## 2. Mechanism, M15 (file:line)

1. **The cold theme bakes land inside the Bloom's frames.** `HandDrawnGrid.vue:233` keys the grid
   raster by theme (`grid-…-${isDark ? "d" : "l"}`), and `HandwrittenLogo.vue:456` does the same
   for the logo. The first flip into a theme triggers 4 × 1272² grid poses plus 4 logo poses (765×224
   playing, 554×162 gallery, 485×142 at 390). LoAF names them `IMG[src=blob:…].onload
   @mkbabb_pencil-boil` at 69–113 ms each, two per frame. The design comment at
   `HandDrawnGrid.vue:179-180` says the re-bake is "masked by the toggle's Bloom". **It isn't
   masked. It starves the Bloom.**
2. **The Bloom has to be painted on the main thread.** The live icons carry
   `filter="url(#wobble-celestial)"` (`DarkModeToggle.vue:24,119`), and the gesture tweens the
   `g.warp` transform inside the filter's input (`DarkModeToggle.vue:797-817`, the §2 crispness
   contract). A stalled main thread therefore freezes the gesture, and the CSS transitions jump to
   whatever time has elapsed on the next paint.
3. **WebKit's warm-flip cost isn't the Bloom and isn't the dusk.** Ablations below are warm, WebKit,
   1280, counting frames over 50 ms per flip:

   | arm | playing | gallery |
   |---|---|---|
   | A: as shipped | 5–6 | 4 |
   | B: live filter attribute removed | 5 | 5–6 |
   | C: no gesture (icons `display:none`) | 3 | 5–6 |
   | D: no gesture and no dusk | 3–5 | 5–6 |
   | E: gesture, no dusk | 6–9 | 4 |
   | F: only `html.dark` toggled, Vue's `isDark` untouched | **1** (52–57 ms, then smooth) | not run |

   Most of the cost follows Vue's theme state: the `isDark` consumers and the theme-keyed raster
   swaps, even with every raster cached. It's heavier at 1280 than at 390. WebKit has no LoAF, so
   it isn't attributed to a function (see gaps).

The deck is not in this path. Neither `useCarouselGlide.ts` nor `useFlipGlide.ts` runs during a
flip (the `animate` hook logged 0 movers).

## 3. Numbers: T9-M19, the ONE board's move (`App.vue` §"THE ONE BOARD'S MOVE")

All rows are light theme. The fold is 520 ms on `cubic-bezier(0.32, 0.72, 0, 1)`, which is the
ratified curve, and the `animate` log confirms it.

| verb · engine · viewport · pointer | fold window | per-frame travel min/median/max | largest discontinuity | frames over 25 ms |
|---|---|---|---|---|
| enter (`g`) · chromium · 1280×800 · fine | animate +245 → end +765 | 0.4 / 1.9 / **110.4 px** | **92.7 px** center jump on the reparent frame, then −110 px width across a 57.9 ms frame; board **visible fraction 0.234** | 1 |
| enter · webkit · 1280×800 · fine | +263 → +783 | 0.4 / 2.1 / **167.2 px** | 127.4 px center plus −167 px width in one 80 ms frame, then −130 px in a 96 ms frame; visible 0.413 | 4 |
| enter · chromium · 390×844 · coarse | +216 → +736 | 0.4 / 2.2 / 21.5 px | 21.5 px center on the first fold frame; visible 0.468 | 0 |
| enter · webkit · 390×844 · coarse | +316 → +836 | 2.6 / 13.2 / **110.1 px** | **the whole fold in 3 frames** (162 / 123 / 78 ms) | 5 |
| exit (Enter) · chromium · 1280×800 · fine | +27 → +547 | 0.5 / 4.0 / 52.5 px | first-frame pop from the face (304 px, cy 388.6) to the card anchor (+41.8 px width, 32.1 px center); **center card 407.9 → 104 px tall** at once | 1 |
| exit · webkit · 1280×800 · fine | +35 → +555 | 0.4 / 2.0 / **131.4 px** | 94.8 px width in a 42 ms frame, then 131.4 px in a 58 ms frame; card 407.9 → 132.7 px | 1 |
| exit · chromium · 390×844 · coarse | +10 → +530 | 0.4 / 2.2 / **135.3 px** | **135.3 px drop at +227** when the deck unmounts mid-glide (the wordmark `h1` drops 135.5 px in the same frame) | 0 |
| exit · webkit · 390×844 · coarse | +47 → +567 | 0.4 / 0.9 / **135.7 px** | **135.7 px drop at +322** on deck unmount; a 71.4 px width pop in a 56 ms frame | 1 |
| PRM · both engines · 1280 · fine | no fold (0 movers) | single step | same-frame **cut**, as the law requires. webkit exit adds a 3 px x-nudge at +168 after the cut | chromium 1, webkit 1–4 |

For comparison, the pass-1 attempt of this lane measured the exit at 390×844 fine at 166 px (not
re-run here; its data is in the `prior-attempt-banked` scratch directory).

## 4. Mechanism, M19 (file:line)

- **Enter, the translate runs inside the fit scale (the "teleport").** `onLiveFace` runs the fold
  with `flipTransform(from, last)` on `.board-peek-host` (`App.vue:636-642`). The Teleport has
  already put the board inside `.live-face-fit`, which is `scale(var(--live-fit))`
  (`GameCard.vue:467`, with the fit set at `App.vue:602`). The scale term comes out right: 2.105 ×
  0.475 = 1.0, so the board reads 640 px wide. The translate is written in viewport px but applied
  in the fit's local space, so it's shrunk by `--live-fit`. The error is (1 − fit) × Δ: 0.525 ×
  (161.9, 55.9) = **89.9 px** at 1280 against 92.7 px measured, and 0.348 × 57.6 = **20.0 px** at
  390 against 21.5 px measured. The logged FIRST is exact (0 px anchor error). The board starts
  about 90 px off its rest pose and travels a compressed path.
- **Enter, the fold is clipped.** `.live-face-slot { overflow: hidden }` (`GameCard.vue:459`)
  clips the full-size FLIP pose to the card window. The visible fraction climbs 0.23 → 0.91 over
  the fold, so the full board is never seen shrinking into the card. It reads as a cut from the
  board to a zoomed crop inside a card that's already drawn (crop c2).
- **Enter, the head frame is starved.** The chrome-leave timer (`App.vue:711-713`) mounts the deck
  in a 41 ms `setTimeout` task (LoAF). That makes a 57.9 ms frame in chromium and 80–162 ms frames
  in webkit, and the gallery-pose wordmark re-bake (`HandwrittenLogo.vue:456`, keyed by
  `vbWidth`) runs 4× inside the fold.
- **Exit, FIRST is the card rather than the board.** `unfoldToBoard` reads
  `centerCardEl().getBoundingClientRect()` (`App.vue:725`). That's the whole card (332.8 × 407.9),
  not the board's painted face (304 × 304 at 1280, 238.6 wide at 390). The anchor error is **dy
  −35.2, dw +28.8** at 1280 and **dy −34, dw +46.4** at 390, so the board pops on the first frame.
- **Exit, the deck collapses (the "shrink").** `moveLiveBoard(null)` (`App.vue:729`) parks the
  board home, and the view flips, while the deck is still fading out under the 200 ms leave
  transition (`App.vue:963`, `.gallery-fade-leave-active` at `App.vue:1227`). The deck gets
  squeezed into the space left in the playing layout. The center card goes 407.9 → 104 px in
  chromium and → 132.7 px in webkit on the first frame, and the fading strips sit under the rising
  board (crop c3).
- **Exit, a mid-glide drop at deck unmount.** `runFold` (`App.vue:667`) reads LAST while the
  leaving deck is still in flow. When the leave ends (+227 chromium, +322 webkit), removing the
  deck moves the home layout 135 px (390 coarse). The glide's delta was never told, so the board
  and the wordmark drop in one frame (crop c4). At 1280 the same unmount moves the board 0 px.
- **PRM.** `enterGallery` and `unfoldToBoard` both return before any mover, which gives a
  same-frame cut and conforms to "PRM is a cut". The toggle's PRM crossfade still stalls on the
  cold flip (chromium 175 / 191 ms frames, webkit 783 ms), so the cut lands late. It doesn't jump.

## 5. Pass-5 charter rows

| # | owning family / § | the row | gate (measured the same way) |
|---|---|---|---|
| M15-a | §13 MOT-VERB/MOT-LADDER × pencil bakes | The Bloom never shares frames with theme bakes. Either warm the other theme's grid and logo poses at idle, or hold the old-theme raster until after the Bloom's settle (about 1.1 s). M09 forbids buying the fix with a lower-resolution bake. | cold first flip, both engines, both directions: born ≤ 0.30, no frame over 34 ms in +0…+900 ms, per-frame Δscale ≤ 0.08 |
| M15-b | §13 × W6 substrate | WebKit's warm-flip cost of 4–7 frames over 50 ms at 1280 follows Vue's `isDark` path (ablation F). Attribute it to a function (Safari timeline, not headless) and cure it at the source. The warp can't move to a compositor channel, because the §2 crispness contract and the soul gate forbid it. If the owner wants that traded, it's the chair's row. | warm flip at webkit 1280: 0 frames over 50 ms, born ≤ 0.30 |
| M19-a | §13 × W2 gallery mechanics | The fold's translate has to survive `.live-face-fit`'s scale. Divide the translate by `--live-fit`, or put the mover on the fit wrapper. | enter, frame 1: board center within 3 px of its rest pose (1280 and 390) |
| M19-b | §13 × GameCard | The fold isn't clipped. Lift the slot's `overflow: hidden` for the fold's 520 ms, or fly an unclipped board above the deck. | visible fraction = 1.0 on every fold frame |
| M19-c | §13 | Exit FIRST is the board's painted face rect, not the card's. | exit frame-1 anchor error ≤ 2 px |
| M19-d | §13 × App layout | The deck's leave can't reflow the home under a running glide. Take the deck out of flow while it leaves (absolute during leave), or read LAST after the unmount. It also can't collapse the center card. | 390 coarse exit: 0 frames with a > 20 px step after frame 1; card height stays constant while it fades |
| M19-e | §13 | Keep bakes and mount work out of the fold's first frames (deck mount task 41 ms, wordmark re-bake). | enter: 0 frames over 25 ms from +200 to +800 on both engines; webkit 390 fold ≥ 20 frames |
| law | chair | PRM stays a cut on both verbs, and it conforms today. The cold-flip PRM crossfade is the M15-a row. | not applicable |

## 6. Crops (four, ≤ 150 KB each)

- `c1-m15-toggle-first-flip-chromium-light-to-dark-1280x800-fine.png`: chromium · light→dark ·
  1280×800 · fine. Frames at rest, the stall, and after. The sun holds large, then the moon lands
  full over it. The screencast inflates the stall to 273 ms, so the numbers come from the clean
  run.
- `c2-m19-enter-fold-clipped-chromium-light-1280x800-fine.png`: chromium · light · 1280×800 ·
  fine. The last full-board frame (+227), then the next painted frame (+282): the board is
  reparented into the card and clipped at visible fraction 0.23–0.34.
- `c3-m19-exit-card-anchor-deck-collapse-chromium-light-1280x800-fine.png`: chromium · light ·
  1280×800 · fine. The board in the card face, then +71 and +93 ms: the deck cards collapsed from
  408 px to strips under the rising board.
- `c4-m19-exit-deck-unmount-drop-chromium-light-390x844-coarse.png`: chromium · light · 390×844 ·
  coarse (hasTouch). +205 and +214 with the deck still in flow, then +232 and +238 after the
  unmount: the board and wordmark have dropped 135 px.

## 7. Gaps (unoptimistic)

- **Headless WebKit is not Safari.** M19's rule forbids osascript and `open -a Safari`, so neither
  Safari nor iOS was measured. The WebKit frame costs (791–862 ms cold, 50–164 ms warm) are a
  proxy.
- **The WebKit warm-flip cost isn't attributed to a function.** WebKit has no LoAF. Ablation F only
  narrows it to the Vue `isDark` path, and the raster swaps are a candidate, not a finding.
- **This is the dev server.** The owner audited the dev server too (3001), but the production dist
  wasn't measured.
- **Box noise.** The box is shared with the live pass-4 lanes (4230–4249). Warm chromium runs vary
  between max 10 ms and 42 ms from run to run. The cold stalls (≥ 108 ms) and the WebKit costs sit
  well outside that noise.
- **rAF timing.** A rAF timestamp marks the frame's start, and the DOM read can come after the
  task that ran in that frame. For the "reparent frame" at enter +208.6 (chromium 1280), this
  sampler can't say whether that frame painted before the fold's `animate` at +245. The screencast
  (c2) shows no intermediate pose between the full board and the clipped card.
- **Not measured:** the move scenario in dark theme; exit at 390 fine in v2 (the pass-1 attempt of
  this lane read 166 px there); `useCarouselGlide` step jank under a flip (none observed, but only
  the flip was driven); the settle hand-off from the live instance to the rest stack (scale is
  continuous at 1 → 1, but the pixel identity between the live filter and the baked pose was not
  diffed).
- **A superseded attempt.** A first attempt of this lane (15:04–15:19) banked four crops and a
  `series.json` without a README. Its flip-0 figures were contaminated by a vite dependency reload
  (negative event times), so it's superseded. It was moved, not deleted, to
  `web/frontend/.owner-intake/motion/prior-attempt-banked/`.
- **Nothing here retires M15 or M19** (U-10). The owner disposes at the re-look.

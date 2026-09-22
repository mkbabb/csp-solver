# G-MOTION · adjudication — the apotheosis (T9-M15 + T9-M19)

Adjudicator: Fable 5.1, 2026-09-22. Two designs competed against MAIN `1e6cfbbf`:
`portfolio/G-MOTION/fable.md` (A VERB NEVER BAKES) and `portfolio/G-MOTION/opus.md` (THE POP-UP
CAN'T FREEZE). Ground: `census/motion/README.md` + `series.json` (read whole; every number below is
the census's unless marked NEW), the marks file, pass-4 `CHAIR-RULINGS.md`, registry-v3 §1/§2.7/§2.11,
registry-v0 §13, R6 Motion laws 1–8 + §8, W7 §13, and main's own source (`App.vue` §THE ONE BOARD'S
MOVE, `useFlipGlide.ts`, `GameCard.vue`, `GameGallery.vue`, `HandDrawnGrid.vue`, `HandwrittenLogo.vue`,
`DarkModeToggle.vue`, `index.css`, pencil-boil 0.12.0 `vue.js`/`raster.d.ts`). No server was
started, no port bound, no file outside `docs/` touched. Nothing here retires a mark (U-10).

## 0 · Verdict

**Fable's LAW is the thesis; Opus's INK IS PAINT is how the law is kept without a library.** The
owner's "shrinks then teleports" is a stall (M15) and a clip plus a space error (M19), and both
designs read that correctly. They part on *who plays the Bloom* and *how the flip stops baking*.

- Fable keeps the vector warp (the §2 crispness contract) and warms the counter-theme rasters at
  idle through a NEW pencil-boil seam (`warm()`). Right law, wrong vehicle: the seam is a library
  minor that isn't published (0.12.1 is HELD to the W8 seal), so its G7/G8 cannot go green on a
  fresh worktree off main, and it DOUBLES the grid's residency (~8 → ~16 MB at DPR2) and needs a
  counter-theme colour probe that has no in-cascade form.
- Opus makes the grid and wordmark bakes theme-FREE (alpha coverage under a colour the cascade
  owns): the 8 cold encodes per first flip go to 0 with no library change, residency HALVES, and
  the WebKit warm cost's named candidate (theme-keyed `href` swaps, ablation F) is removed rather
  than worked around. This is grafted as the DEFAULT arm; Fable's warm seam is its fallback arm.
- Opus's second bold move—the Bloom played on the compositor from a 1.08× flight sheet—crosses
  the §2 crispness contract and the soul gate. The census says that trade is the chair's row;
  the adjudication makes it an owner ballot (T9-B11) and does NOT build it in the prototype slice.
  Everything Opus re-times on its account (park 0.06 → 0.182, the twist off springPop onto the
  glass at 520, crest 1.0919 → 1.0802, the live filtered pair retired 9 → 7) rides that arm only;
  under the default arm the Bloom's numbers stay VERBATIM (chair §1.3: a rung is not a licence to
  re-time a ratified pose).

The M19 fold and unfold are agreed in substance by both designs (the fit-divided translate, the
state-scoped unclip, FIRST = the painted face, the deck out of flow, nothing baking inside the
fold). Where they differ, the smaller mechanism wins: Opus's inline `position: fixed` pin in
`onBeforeLeave` over Fable's registered `--deck-top`; Opus's two-case FIRST (live face / poster
face) over Fable's one; Opus's hold-the-re-key over Fable's warmed second width. One claim of
Opus's is REFUTED by main's own engine and corrected below (§2.3, the head frame).

## 1 · The census, reconciled (what the design answers)

| surface | on main (census) | the apotheosis's target |
|---|---|---|
| M15 cold flip, chromium 1280 light→dark | 150.4 + 149.8 ms frames; moon born 0.686 at +263; 8 bakes (4 grid 1272², 4 logo) | born ≤ 0.30; no painted interval > 34 ms in +0…+900; Δscale ≤ 0.08/frame; 0 encodes |
| M15 cold flip, webkit 1280 | ONE 829–862 ms frame; born 0.253–1.00 | same |
| M15 warm flip, webkit 1280 | 4–7 frames > 50 ms/flip; born 0.39–0.71 (ablation F: follows Vue's `isDark` path, 1 frame when only `html.dark` flips) | measured under arm A, NOT claimed (W6's row, M15-b) |
| M19 enter, chromium 1280 | 92.7 px centre jump (= (1 − 0.475)·Δ, 89.9 derived); visible fraction 0.234; 57.9 ms head frame carrying −110 px | centre ≤ 3 px; visible 1.0 every frame; first painted fold frame = the FIRST pose |
| M19 enter, webkit 390 coarse | the whole fold in 3 frames (162/123/78 ms) | ≥ 20 painted frames |
| M19 exit, chromium 1280 | pop dy −35.2 / dw +28.8 (FIRST is the 332.8×407.9 card, not the 304² face); centre card 407.9 → 104 | anchor ≤ 2 px; card height constant ± 1 px |
| M19 exit, 390 coarse both engines | 135.3 / 135.7 px drop at deck unmount | 0 frames with a > 20 px step after frame 1 |
| PRM, both verbs | same-frame cut, 0 movers (conforms); the toggle's PRM crossfade stalls 175–783 ms cold | unchanged; the toggle's cut lands on time once nothing bakes |

The chair's intake reading ("the shrink is the poster re-cut, the teleport the carousel's FLIP")
is refuted by the census (0 px, 0 `src`, 0 movers on the deck across 8 flips) and both designs
accept the refutation. The chair's row to reconcile stands as the census wrote it.

## 2 · The apotheosis

**Thesis (Fable's, kept whole):** a verb never bakes—every raster a move lands on is inked before
the gesture—so the sun's wring, the board's fold into its page and the page's unfold back to the
desk are each ONE unbroken sheet on the glass curve: no clip, no reparent in view, no frame the
main thread owes to a bitmap. The curves are already right when the frame is free (census §1);
the design is a law plus geometry, not a new curve, a crossfade or a re-time.

### 2.1 Tokens (values; nothing new is minted)

| token | value | home | status |
|---|---|---|---|
| fold / unfold | 520 ms on `cubic-bezier(0.32, 0.72, 0, 1)` | `MOTION.boardFoldMs`, `MOTION.curves.drawerGlide` | unchanged (R6 L1/L2; chair §1.3) |
| chrome leaves · deck dissolves | 200 ms on `--ease-glassGlide` | `MOTION.chromeLeaveMs`; `App.vue:1228`'s literal `200ms` is BOUND to it (Opus; clears an R6 L4 debt, 0 px moves) | rebound, not re-timed |
| the deal's stagger | 90 ms | `GameGallery.vue:372`'s literal goes HOME to `MOTION` (LADDER names the rung on its tree; on main's worktree `MOTION.dealStaggerMs`) | homed (Fable named the breach) |
| the Bloom | press 120 · wring 340 accelIn · bloom 800@60 springPop · fade 300@60 · dusk 350 · plush 1010 · backstop 1100 | `DarkModeToggle.vue` + `index.css`, VERBATIM | untouched under arm A; MOT-VERB's homing row (pass 4) not re-opened here |
| `--live-fit` | `<number>`, `inherits: true`, `initial-value: 0` (a board scaled to nothing is a visible failure), consumed BARE | the first static stylesheet (`index.css` head on the worktree; the ONE `@property` block on the merged tree, chair §6.7/6.8) | REGISTERED; `var(--live-fit, 1)` at `GameCard.vue:467` DIES |
| `--deck-top` (Fable) | — | — | REFUSED: a registered property for a one-shot measurement; Opus's inline pin needs no token |
| ink colour | `--grid-line-color` (`:root` hsl 0 0% 15%, `.dark` hsl 48 10% 80%); the wordmark's `currentColor` | `index.css:308/401` | consumed live by the mask's fill (arm A); no pencilConfig pair, no CSSOM probe |

### 2.2 M15 — the flip: the ink is paint (arm A, default) · the warm seam (arm B, fallback)

**Arm A (Opus, grafted as the default).** `gridPoseSvg` and `logoPoseSvg` are monochrome by
construction (one stroke colour with three opacities; `fill:${ink}` on the glyphs; `grain-static`
is displacement only). Bake them ONCE per size as alpha coverage—stroke `#000` at the same
`stroke-opacity`s—and drop `-${isDark ? "d" : "l"}` from both `cacheKey`s (`HandDrawnGrid.vue:233`,
`HandwrittenLogo.vue:456`). Each pose paints through an SVG `<mask maskContentUnits="userSpaceOnUse"
style="mask-type: alpha">` holding the pose `<image>`, over a `<rect>` whose `fill` is
`var(--grid-line-color)` (the wordmark: `currentColor`). The beat's opacity swap moves from the
`<image>` siblings to the masked `<rect>` siblings. The DOM stays SVG (tags: `<mask>` + `<image>`
+ `<rect>` where `<image>` stood)—the tag delta is enumerated for the chair; π is read on painted
bytes and computed paint. The flip then re-bakes nothing and swaps no `href`; the ink colour follows
the theme class at frame 2, which is what `HandDrawnGrid.vue:236` already claims ("the grid line
color snaps with the theme class")—today it changes LATE, pose by pose, as the bakes land
(+147/+275/+405/+530 chromium). Sub-fork inside the arm, the prototyper's, decided by the idle
gate GB4: (A1, default) SVG `<mask>` on the existing element; (A2) an HTML `mask-image` layer,
only if A1 re-rasterises the masked rect on WebKit's opacity flip (the reason the raster stack
exists). The false comment "masked by the toggle's Bloom" (`HandDrawnGrid.vue:179–180`) DIES.

**Arm B (Fable's, the fallback if arm A fails GB3 or GB4).** pencil-boil gains `warm(opts)` on the
raster handle (encode + `retain` under a given key, no swap; the cache is per instance,
`vue.js:471`); App warms the counter-theme grid + logo stacks after the W8 boot seam's first
paint, one pose per `MOTION.beatMs` window, the colour read once from the `:root`/`.dark` rules.
A library minor; the W8 seal's 0.12.1 is the vehicle. Residency doubles. Fable's "hold the
old-theme raster until settle" stays REFUSED (a light grid on a dusked dark ground vanishes 1.1 s).

**The Bloom itself is untouched under arm A**: the vector warp inside the filter's input stays
(the §2 crispness contract; the soul gate); the gesture is main-thread by construction, so it is
continuous whenever the main thread is free—which arm A makes true of the flip's own work. It is
NOT true of an arbitrary stall (a solver message, GC, multiplayer traffic): that residue is
Opus's honest point and is the ballot T9-B11, not this slice's claim (GB6 carried RED).

**M15-b** (WebKit's warm-flip cost, 4–7 frames > 50 ms at 1280, following Vue's `isDark` path)
stays W6's attribution row, RED and unclaimed. Arm A removes the theme-keyed `href` swaps, the
census's named candidate; GB5 measures whether that was it. If it wasn't, the row needs a Safari
timeline on the owner's RUNSHEET (headless WebKit has no LoAF; no osascript).

### 2.3 M19 — the board's two verbs (fold / unfold), one grammar

```
ENTER (fold)                                     EXIT (unfold)
t=0     FIRST = board host + wordmark box;        t=0   FIRST = the PAINTED FACE: `.board-peek-host`
        chrome leaves (200); the board HOLDS            (live card) or `.game-card-face` (poster
t=200   deck mounts; face mounts; fit; LAST;            card after a carousel step); wordmark box
        the fold's first painted frame IS the           moveLiveBoard(null); onBeforeLeave PINS
        FIRST pose (startTime pending, §(c))            the deck fixed at its rect, pointer-events
t=200…720  the board shrinks UNCLIPPED over the         none; applyState(); LAST is final
        deck (`.is-folding`); the flanks deal      t=0…520  the board rises over the pinned deck
        from under its edges (0.42·520 + stagger)        (`.is-unfolding` z 1 / deck z 0); the deck
t=720   settle: slot clips again; z rests               dissolves (200); unmount moves nothing
PRM     cut (no beat 0, no fold, no deal)         PRM   cut
```

(a) **One space** (both designs). `flipTransform(first, last, parentScale = 1)` divides the
translate by the fit: `translate(dx/f, dy/f) scale(s)`; `f` read from the mount's own inline
`--live-fit`. The error (1 − f)·Δ = 89.9 / 20.0 px goes to 0 by construction; the drawer (f = 1)
is byte-identical.

(b) **Seen whole** (both). `.game-card.is-center.is-folding` for the fold's lifetime:
`.live-face-slot { overflow: visible }` and the centre card lifted above its flanks inside the
deck's own stacking context. The class drops at settle or cancel; π at rest untouched. The full
board shrinks over the deck; the flanks deal from under its edges on the existing clock (T9-B10).

(c) **The head frame is the FIRST pose** (Fable's aim, Opus's claim corrected). Opus says "the
WAAPI mover's pending start absorbs the long task". On main it does not: `useFlipGlide.run` pins
every mover's `startTime` to `document.timeline.currentTime` (the S3 no-dead-frame rule), so a
41 ms mount task whose frame paints at +58 shows the curve already 58/520 in—the census's 57.9 ms
frame carrying −110 px. Fable's cure (run on the rAF after the LAST read) would paint the small
board at rest in the face for one frame before the fold starts. The cure is the engine's own
grammar read the other way: for the FOLD only, `run` leaves `startTime` pending, so the frame
the mount task paints renders progress 0—the full board at its old place—and the UA starts the
clock on the next frame. One option on `run` (`holdFirstFrame`), the drawer's default unchanged.

(d) **Nothing bakes in the fold** (Opus). The wordmark's re-key (`vbWidth` and the gallery box
via `--logo-scale` 0.72 change the stack key) is HELD until the fold's `finished`: one bake,
after the move—the "one re-bake at settle" the `App.vue` comment already promises. Under arm A
the cache's 4 slots then hold both widths (no theme axis), so the second entry is a hit.

(e) **FIRST is the face, both cases** (Opus). `centerCardEl()` DIES with its last consumer.

(f) **The deck steps back out of flow** (Opus's mechanism, Fable's gates). `<Transition
name="gallery-fade" @before-leave>` pins the leaving deck `position: fixed` at its measured rect
as inline px, `pointer-events: none`, `z-index: 0`; the home layout is final before `runFold`'s
`nextTick` reads LAST; the unmount at +200 moves nothing; the centre card holds 407.9 px while it
fades (the face wrapper keeps the poster's 1/1 box). No token minted. Scroll anchoring under a
shortened document is GA8's question, negative control the in-flow leave.

(g) **The board rises over the deck.** `.board-group.is-unfolding { position: relative; z-index:
1 }`, never a negative index. Read on painted bytes (GA7), not `elementFromPoint`—with
`pointer-events: none` on the deck that instrument cannot fail (chair ruling 10).

**PRM**: both verbs cut in the same frame (conforms today; kept). **Copy (M16)**: zero strings,
zero aria change. **Desk and phone**: 1280 fine—the 640 px sheet covers both flanks until ~60 % of
the fold; 390×844 coarse (`hasTouch`)—fit 0.7, the sheet covers the edge cards ~300 ms; the verbs
read rects, never a media query (W2 §2.2 unchanged). **Light and dark**: the verbs move bitmaps
and mint no colour; every M19 gate runs both themes (the census's unmeasured arm).

### 2.4 What dies · what is refused

DIES: `var(--live-fit, 1)`; `centerCardEl()`; the slot's clip DURING the fold; the in-flow deck
leave; the pinned `startTime` on the fold's first frame; `stagger = 90` and `App.vue:1228`'s
`200ms` as literals; `-${isDark ? "d" : "l"}` in two cache keys (arm A); the "masked by the
toggle's Bloom" comment; the in-Bloom cold bakes and the mid-fold wordmark re-bake.

REFUSED, with the constraint that forbids each: a crossfade or longer Bloom to cover the stall,
a lower-res bake (M09); the compositor flight sheet as a default (§2 crispness + soul gate—the
chair's row → T9-B11); park 0.182 / twist on glass / crest 1.0802 / `MOTION.characters.bloom` /
the live pair retired 9 → 7 outside that arm (chair §1.3; law 9 exact-match is the chair's);
a lift shadow, tilt or spring on the flying board, a 600 re-time (ruling 1); a slide-up deck
entrance (the deal IS the entrance); `--deck-top` as a registered property (no token for a
measurement); Fable's second `useRasterStack` instance (its cache isn't the live one's); Opus's
"the sky wheel" (two dead idioms, self-refused); `elementFromPoint` as the z-order gate (vacuous
under `pointer-events: none`).

## 3 · Prototype brief — the smallest runnable build that proves it on the real surface

**Tree.** A fresh worktree off main `1e6cfbbf` (node_modules symlinked; no `npm install`; never
`git commit/push/stash`). Dev server: the two-line `.mts` config (`cacheDir` lane-named) on the
lane's port within 4250–4260, `127.0.0.1`, `--strictPort`; the HEAD CONTROL is main's own tree
served the same way on a second lane port (the census's form; main's `src/` is read-only and
stays so). Kill both by RECORDED PID before returning. Ports 3000/3001 and 4230–4249 untouched.

**Build, in this order (≈ 150 lines of product diff across 6 files; stop and bank at each rung):**

1. `useFlipGlide.ts`: `flipTransform(first, last, parentScale = 1)`; `run(movers, {holdFirstFrame})`
   leaving `startTime` pending when set. Drawer path byte-identical (its e2e is the guard).
2. `App.vue`: `onLiveFace` reads `--live-fit` off the mount and passes it; `run` with
   `holdFirstFrame`; `.is-folding` set on the centre card for the fold's lifetime (cleared in
   `onSettle` and on supersede); `unfoldToBoard` FIRST = `.board-peek-host` rect (live) else the
   centre `.game-card-face`; `@before-leave` pin (fixed, inline px, `pointer-events: none`);
   `.board-group.is-unfolding` for the unfold's lifetime; `.gallery-fade-leave-active` reads
   `MOTION.chromeLeaveMs`; `centerCardEl()` deleted.
3. `GameCard.vue`: `.is-folding .live-face-slot { overflow: visible }` + the centre card's lift;
   `scale(var(--live-fit))` bare.
4. `index.css` head: `@property --live-fit`. `pencilConfig.ts`: `dealStaggerMs: 90`;
   `GameGallery.vue:372` reads it.
5. `HandDrawnGrid.vue` + `HandwrittenLogo.vue` (arm A1): theme dropped from the key; alpha bake;
   `<mask>` + `<rect fill=var(--grid-line-color)>` per pose; the beat's opacity on the rects;
   the wordmark's key HELD while a fold is in flight (a `hold` ref App sets around the fold).
6. Only if GB3 or GB4 reads RED on A1: A2 (HTML `mask-image` layer), then bank; arm B (the
   `warm()` seam) is NOT built in this slice—it is a library row and the ballot's paper arm.

**Instruments** (in `<worktree>/web/frontend/.<lane>/`, never a product dir; reuse
`census/motion/probe/census.mjs`, `an-move.mjs`, `an-toggle.mjs`, `summarize.mjs` as the base):
the rAF sampler + `Element.animate` hook + `drawImage`/encode hook + LoAF (chromium) as the
census ran them; NEW: a painted-frame recorder (chromium CDP `Page.startScreencast`; webkit
Playwright `recordVideo`) as the PRIMARY read for every compositor mover (rAF stays secondary
and never gates a compositor mover alone); a painted-centre read for GA7; a `scrollTop` read
for GA8; a three-still-frame settle read for GA9; a 300 ms busy-loop injector for GB6 (carried).
Each gate is a shell script run `run_in_background` with a log, polled ~60 s, chunked by engine
(chromium then webkit), never a foreground timeout above 120 s. Both arms and the control load
ONE encoded `?board=` payload minted with `persistence.ts:190–201`; the row states it.

**Regimes.** chromium + webkit · light + dark · 1280×800 fine · 390×844 coarse with
`hasTouch: true` · PRM on both verbs and the toggle · cold (first flip after a fresh load,
both boots) and warm (flips 1–3).

**Poses to frame (≤ 4 crops, ≤ 150 KB, each naming engine · theme · viewport · pointer):**
c1 chromium · light→dark · 1280 · fine: rest / +270 / +530 of the cold flip beside the census's
c1 (the moon born ≤ 0.30, the grid's ink already turned); c2 chromium · light · 1280 · fine: the
enter fold at the census's +282 (the whole board over the deck, unclipped) and +520; c3 webkit ·
dark · 390 · coarse: the exit at +205 / +232 beside the census's c4 (no 135 px drop; the card's
box held); c4 the grid at rest, arm A vs the HEAD control, as a difference image with its max
channel Δ printed (both themes on one sheet). Raw per-frame JSON summarised (min/median/max, the
discontinuity), never banked whole.

**Numbers that mean success:** every gate in §4 GREEN except the three CARRIED rows (GB5, GB6,
and M15-b's attribution), which are reported as measured; π (GC4) 0 moved; the crops' numbers
equal the gates' numbers.

## 4 · Born-RED gates (each RED on main by the census's instrument, or a NEW instrument with its negative control)

| id | gate | RED on main |
|---|---|---|
| GA1 | enter frame 1: board centre within 3 px of its rest pose; 1280 fine + 390 coarse, both engines, both themes | 92.7 / 127.4 / 21.5 px |
| GA2 | enter: painted visible fraction 1.0 on EVERY fold frame | 0.234 → 0.91 |
| GA3 | enter: the first PAINTED fold frame shows the board at its FIRST pose (progress 0, ≤ 3 px); no painted frame between the full board and the fold shows the board at rest in the face (screencast) | the 57.9 ms head frame carries −110 px; webkit 80–162 ms |
| GA4 | enter: painted intervals ≤ 34 ms in +200…+800 both engines (rAF: 0 frames > 25 ms secondary); webkit 390 fold ≥ 20 painted frames; 0 encodes inside [fold start, `finished`] | 1 / 4 / 5 frames; 3 frames at webkit 390; wordmark ×4 |
| GA5 | exit frame-1 anchor ≤ 2 px (dy, dw) vs the painted face, live-card AND poster-card cases | dy −35.2 / dw +28.8; dy −34 / dw +46.4 |
| GA6 | exit: centre card height constant ± 1 px while it fades; 390 coarse 0 frames with a > 20 px step after frame 1; the wordmark `h1` the same | 407.9 → 104 / 132.7; 135.3 / 135.7 px |
| GA7 | exit: a 32×32 painted crop at the board's centre matches the board's rest raster (SSIM ≥ 0.9) and not the fading card (≤ 0.5) on every fold frame; negative control: the pinned deck given `z-index: 2` | NEW instrument |
| GA8 | exit at 390×844 scrolled to the deck: `scrollingElement.scrollTop` unmoved (± 1 px) across the pinned leave; negative control: the in-flow leave | NEW instrument |
| GA9 | a fold interrupted by a re-press settles with `.is-folding` / `.is-unfolding` / the inline pin cleared and the slot clipping: three still frames, 0 style writes | NEW instrument |
| GB1 | cold first flip, both engines, both directions, both boots: incoming born ≤ 0.30; no painted interval > 34 ms in +0…+900; per-frame Δscale ≤ 0.08 | born 0.544–1.00; 150–862 ms frames |
| GB2 | 0 encodes and 0 `href` swaps in the flip window +0…+1100 (arm A); arm B: 0 inside the window | 8 encodes per cold flip |
| GB3 | arm A ink identity: grid + wordmark at rest vs the HEAD control, painted bytes, both themes both engines: max channel Δ ≤ 1/255; painted AA equal; the tag delta enumerated | NEW (the arm's guard) |
| GB4 | idle after arm A: T4-P1's idle gate (idle ≥ 97.6, long33 0) holds at rest both engines; filterBudget exactly 9 at rest AND during the fold, hovered and not; raster union area ± 2 % during the fold | guard (9 today; the fold unmeasured) |
| GB5 | warm flip webkit 1280: frames > 50 ms — CARRIED, W6's row (M15-b), measured under arm A, not claimed | 4–7 |
| GB6 | a 300 ms busy-loop at gesture +100: painted poses of the incoming body inside the stall ≥ 4 — CARRIED RED by construction (main-thread warp); T9-B11's gate | 0–1 |
| GB7 | PRM: 0 movers on both verbs (cut); the toggle's PRM cut lands with no frame > 34 ms cold | cut lands late: 175–783 ms |
| GC1 | `@property --live-fit` in the first static stylesheet, `inherits: true`, initial 0, consumed bare; ablation on a declaring host shows the empty face | `var(--live-fit, 1)`; unregistered |
| GC2 | `lint:motion` bare; no timing literal outside `pencilConfig` in the diff (the stagger and `App.vue:1228` homed) | `stagger = 90`; `200ms` |
| GC3 | `lint:copy` bare: rendered-string delta 0, a planted string as the negative control | holds (0) |
| GC4 | π at rest vs HEAD `1e6cfbbf`: computed paint properties + tags, playing + gallery × light + dark × 1280 + 390, one encoded `?board=` payload stated; goldens 4/4; the drawer's e2e green | must read 0 moved |

Budgets are rates; every gate names its negative control; the pass-5 number is the CRITIC's.

## 5 · Owning families and pass-5 charter rows

§13's leader is **MOT-VERB** (registry-v3 §1, 71); §13 is one design in two lanes with
**MOT-LADDER**'s delta applied first on one worktree (ruling 7). W2 (gallery mechanics), W6
(the pencil substrate) and W8 (the device RUNSHEET) are crossings, not loop families.

| row | family | the sentence | gates |
|---|---|---|---|
| P5-M15-1 INK IS PAINT | MOT-VERB × W6 substrate | theme-free alpha stacks + masked colour for the grid and wordmark (A1 default, A2 measured); the two keys de-themed; the wordmark's key held across the fold; the false comment struck | GB1 GB2 GB3 GB4 GB7 |
| P5-M15-2 THE WARM SEAM (fallback) | W6 (pencil-boil) | `warm()` on the raster handle + the boot seam's idle warm—built only if P5-M15-1 fails GB3/GB4; 0.12.1 the vehicle | GB1 GB2 |
| P5-M15-3 M15-b | W6 (carried) | WebKit's `isDark`-path cost attributed to a function on a Safari timeline; a RUNSHEET row | GB5 |
| P5-M19-1 THE FOLD | MOT-VERB × W2 | fit-divided translate; `.is-folding` unclip + lift; the first frame held at FIRST (pending start); the wordmark's bake after the move | GA1 GA2 GA3 GA4 |
| P5-M19-2 THE UNFOLD | MOT-VERB × W2 | FIRST = the painted face (two cases); the fixed pin in `onBeforeLeave`; the card's box held; `.is-unfolding` z-order | GA5 GA6 GA7 GA8 GA9 |
| P5-M19-3 THE LADDER | MOT-LADDER | `--live-fit` in the one `@property` block; the stagger and `App.vue:1228` as rungs; `lint:motion`; the undefined-token census (§2.11) over the diff | GC1 GC2 |
| P5-GATES | §13 critics | the painted-frame recorder and the stall injector become estate specs (registry-v3 §2.10), the rAF-only compositor gates struck | GA3 GA4 GB6 |
| P5-π | both | π + goldens + filterBudget + copy on the merged §13 tree, dark arm included | GC3 GC4 |
| RUNSHEET | W8 (chair's row) | two device rows: the cold flip and the fold on the real iPhone under arm A | owner-run |

## 6 · Ballots (the owner disposes; both arms buildable; numbers provisional, the chair assigns)

- **T9-B10 — the deal under the sheet.** On enter, the flanks deal from under the shrinking
  board on the existing 0.42·520 + stagger clock (DEFAULT: the neighbours revealed as the board
  becomes its page) — or the deal waits for the settle (the deck dealt onto a still page). One
  class; frames at 1280 light for the re-look.
- **T9-B11 — who plays the Bloom.** Arm A (DEFAULT, this slice): the vector warp inside the
  filter stays (the §2 crispness contract, the soul gate, filterBudget 9); the flip's own work
  no longer stalls it; any OTHER main-thread stall still freezes it (GB6 RED by construction);
  WebKit's warm cost is W6's row. Arm B (Opus, the chair's row opened for the owner): a 1.08×
  flight sheet per body played on the compositor—continuous under any stall—at the price of a
  raster crest (native at 1.0802, soul-gated ≥ 0.983), park 0.06 → 0.182 derived, the twist
  re-timed onto the glass at 520, the live filtered pair retired (9 → 7, law 9 exact-match
  moved), ≈ 6.5 MB GPU while turning at desk DPR2. Arm B is framed on paper with arm A's
  measured numbers; it is built only on the chair's or owner's word.
- **T9-B12 — the ink at the flip.** Under arm A the grid's and wordmark's ink SNAPS to the new
  theme at frame 2 while the five grounds dusk over 350 ms (DEFAULT: the code's documented
  intent; zero paint cost) — or the ink JOINS the dusk (a `fill` transition on the masked rects
  under `html.theme-turning`: 4 masked 1272² repaints per frame for 350 ms, against P1-W3's
  +23.5 fps narrowing of the dusk's selector set). Today the ink lands late and pose by pose,
  so neither arm is what the owner has seen; both are framed at 1280 light→dark.

## 7 · Gaps (unoptimistic)

- **Arm A's rest identity is a hypothesis until GB3 reads.** Alpha-mask compositing should equal
  a coloured raster to ≤ 1/255, but premultiplied rounding, WebKit's mask path and the SVG
  `mask-type: alpha` support are measured, not assumed; A2 changes tags and needs the chair.
- **WebKit may re-rasterise a masked rect on an opacity flip** (the very reason the raster stack
  exists). GB4's idle gate is the tell; if A1 and A2 both fail it, arm B (the warm seam) is the
  route and it waits on 0.12.1.
- **Headless WebKit is not Safari** (census §7). Every WebKit number is a proxy; M19's rule
  forbids osascript / `open -a Safari`; the owner's device re-look is the only Safari reading.
- **The pending-start hold is one UA behaviour**, not a spec guarantee of "exactly one frame at
  progress 0": chromium and webkit each assign the start at the next commit; GA3 reads it on
  painted frames, and if either engine paints two held frames the rAF-after-LAST route with an
  inline FROM transform is the fallback.
- **Scroll anchoring under the fixed pin** (GA8) is unmeasured; if it jumps, the alternative
  (read LAST after the unmount, start the unfold 200 ms late) demotes the board from protagonist.
- **The fit divided into the translate assumes one scale on the mount's path** (true today);
  a second scale from the case's height law needs the product—GA1 catches it.
- **GB6 stays RED under the default arm.** That is the honest residue of keeping the crispness
  contract; T9-B11 is where it is traded, not here.
- **M15-b is not cured or attributed by this design**; arm A removes one candidate and measures.
- **Nothing here retires M15 or M19** (U-10). The owner disposes at the re-look.

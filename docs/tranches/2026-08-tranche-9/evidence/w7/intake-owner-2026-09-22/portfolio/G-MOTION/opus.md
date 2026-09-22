# G-MOTION: opus design spec (T9-M15 + T9-M19)

Designed against main `1e6cfbbf`, the product the owner audited. Every number here comes from
`census/motion/README.md` (cited as `census §n`) or is derived in this file from curves that are
already in the product (the derivation is shown). Nothing here was prototyped; nothing retires a
mark (U-10). This spec becomes pass-5 charter rows (§8) for §13's families (MOT-VERB leading,
MOT-LADDER's ladder underneath), for W2's gallery mechanics, and for the pencil bakes.

The frontend-design skill was invoked and its two passes (plan, review against the tells, then
specify) are §2 and §3.

---

## 0 · The memorable thing

**The pop-up can't freeze.** The sun and moon's Bloom plays on the compositor from baked poses
that are native-resolution at the crest, and the theme flip stops re-baking ink. With both done,
a busy main thread can delay the page's colours but can't make the celestial jump. The board's
move into and out of the deck follows the same rule: one rigid object on one clock, from a
measured first pose to a measured last pose, with nothing reflowing, clipping or re-baking
underneath it.

This is the one bold move. Everything else in this spec is quiet correction.

---

## 1 · Ground (what binds the design)

### 1.1 The owner's sentence is a mechanism, and the census found it

- **M15.** "Shrinks the item and then teleports it" is the toggle's own Bloom, not the deck.
  Across 8 flips the deck moved 0 px, changed 0 poster `src` and ran 0 movers (census §1–2). On a
  cold flip the outgoing body shrinks for about 100 ms, then the main thread stalls for 108–193 ms
  (chromium) or **790–862 ms** (webkit), and the next painted frame shows the incoming body at
  **0.54–1.00** of full size. On WebKit at 1280 it happens on **every** flip: 4–7 frames over
  50 ms, with the incoming first seen at scale 0.40–0.71.
- **Why a stall becomes a teleport.** The Bloom tweens `g.warp` *inside* the filter input
  (`DarkModeToggle.vue:797-817`, the T3-W13 §2 crispness contract). So every frame of the gesture
  is main-thread paint. When the main thread stalls, the transition's clock keeps running and the
  next paint lands wherever the curve has got to by then.
- **What stalls it.** Cold theme bakes land inside the gesture: 4 grid poses at 1272² and 4
  wordmark poses, 69–113 ms each (`HandDrawnGrid.vue:233`, `HandwrittenLogo.vue:456`). The comment
  at `HandDrawnGrid.vue:179-180` claims the Bloom masks the re-bake. The census refutes that. On
  WebKit the warm cost follows Vue's `isDark` path (ablation F: toggling only `html.dark` gives
  1 frame over 50 ms, against 5–6 as shipped).
- **M19.** The fold already runs on WAAPI (`useFlipGlide`, 520 ms, glass curve; census §3). Its
  defects are geometry and layout, not the clock:
  - the translate is written in viewport px but applied inside `scale(var(--live-fit))`, an
    error of (1 − fit) × Δ (**89.9 px** at 1280 against 92.7 measured);
  - `.live-face-slot { overflow: hidden }` clips the fold, so the visible fraction starts at
    **0.234**;
  - the exit's FIRST is the whole card, not the painted board (**dy −35.2, dw +28.8**);
  - the leaving deck stays in flow, so the centre card collapses **407.9 → 104 px**, and the deck
    unmounting mid-glide drops the board **135 px** at 390;
  - four wordmark re-bakes run inside the fold.

### 1.2 The lineage: what's already decided and must not come back

| Idiom | Status | Cite |
|---|---|---|
| The −270° whirl and the `translateX(-50%)` slide ("carousel travel") | **DEAD**, killed by the owner: "a pop-up piece doesn't travel, it rises out of the page and sinks back into it" | T3-W13 §2; `DarkModeToggle.vue:751` |
| Set-and-Rise: a sunset under a porthole, a deferred 360 ms flip, an empty stage | **DEAD**: "the stage goes empty", "the deferred flip reads as lag", "solemn where it should bounce" | T3 a3-toggle-recut (b) |
| Storybook pop-up, "shrinking and growing" | **The owner's standing directive** (T3 finding 5, verbatim) | T3-W13 §2 |
| Crispness: never show an upscaled raster at the crest ("renders in a low-res variant on animation — this is totally wrong") | **The owner's standing directive**. The blur was a 1.088 stretch of a 1.0 raster | T3-W13 §2, b2 forensics |
| A compositor rotate or scale of a pose raster **at rest** | **REFUSED**: the soul gate fails (sun 0.9145 against the 0.983 line) | `DarkModeToggle.vue:188-191` |
| The glass curve at 520 ms (R6 law 1); the fold borrows its ceiling | **LAW** | R6 L1/L4; `MOTION.boardFoldMs` |
| PRM is a cut | **LAW** (the intake constraint) | chair |

The design keeps the pop-up sentence (shrink into the page, bloom out of it, never an empty
stage, the flip at the click, the squash, the star pop and the plush tail). What it changes is
**who plays the gesture** and three visible beats. It adds no new idiom.

---

## 2 · Pass one: the plan, then the review against the tells

**Plan (a motion group's token system).**
- *Palette:* none moves. The celestial's colours are theme-independent literals
  (`DarkModeToggle.vue:497`), and the page's inks are the existing theme tokens.
- *Type:* none.
- *Layout:* none. W2's mechanics (sticky tag, dock, bottom tab, tap floor, the deck's height law)
  stay as they are.
- *Principles:* (1) every surface that moves is one rigid object on one clock; (2) the clock
  belongs to the compositor wherever the art is raster; (3) the first and last poses are measured
  from what's painted, never from a proxy box; (4) work happens before or after the move, never
  during it; (5) the house's existing numbers, homed once.

**Review against the tells.** The generic motion default is scattered fade-and-slide entrances and
a hover transition on everything. This plan adds no new moving surface and no new verb. It cures
two existing gestures. It's one orchestrated moment per verb.

**Revisions made at review, and why:**
1. **REFUSED, my own first idea: "the sky wheel."** The sun and moon ride one rigid disc pivoted
   at the page corner, and the sun sets past the viewport edge as the moon rises. It's
   continuous by construction and runs on the compositor, but it's the travel idiom the owner
   killed, plus the solemn sunset the owner called ruined. Two dead idioms in one. Struck before
   specifying.
2. **REFUSED: fly the Bloom on the existing rest stack (raster at 1.0).** It's the smallest
   diff, but the crest would bitmap-stretch 1.08× (and 1.166× under a mouse hover). That's the
   T3 finding-5 failure the owner called "totally wrong."
3. **REFUSED: bake the rest stacks at 1.08× and show them downscaled at rest.** The rest
   poses would be resampled at 0.926 all the time, which is the class of failure the soul gate
   has already caught. M09 forbids buying the fix with quality at rest.
4. **KEPT, as the design:** separate **flight sheets**, the same pose SVGs baked once at 1.08×
   and shown only during the gesture. The crest (exactly 1.080, derived in §3.2) is then
   **1:1 native**, and every other frame is a downscale.
5. **KEPT, as the second half:** the ink stops being baked per theme, so the flip has no bakes to
   stall on. Without this the compositor still carries the celestial, but the dusk and the grid
   hitch.

---

## 3 · The spec

### 3.1 Tokens (motion). Every value is a shipped number or derived from one

| Token | Value | Home | Status |
|---|---|---|---|
| fold clock | `520` ms (`throw`) | `MOTION.boardFoldMs` (main); `MOTION.rungs.throw` on the §13 tree | unchanged, ratified |
| fold curve | `cubic-bezier(0.32, 0.72, 0, 1)` | `MOTION.curves.drawerGlide`, borrowed by the fold (T4-W12 precedent); verb `turn` on the §13 tree | unchanged |
| chrome and deck leave | `200` ms (`leave`) | `MOTION.chromeLeaveMs`. `App.vue:1228`'s literal `200ms` gets bound to it (clears R6 L4 debt; 0 px move) | rebound, not re-timed |
| **Bloom character** | `press 120 · wring 340 (accelIn) · wringFade @240 for 100 · bloom @60 for 800 (springPop) · fadeIn @60 for 300 · accents @560/640/720 for 150 (anticipatePop) · tail 1010 · backstop 1100` | `MOTION.characters.bloom`, MOT-LADDER's `characters` member (the `refuse: 600` precedent: "auditioned WHOLE and never a rung"), bound at the consumer as `--bloom-*` custom properties (the `--draw-dur` precedent) | **MOVED** from `DarkModeToggle.vue`'s CSS literals into one home. Same numbers; no new literal |
| **Bloom twist and sink** | rotate +12° → 0 and sink 3 % → 0, on **`throw` (520) glass**, @60 | `characters.bloom.twist` reads rung `throw` | **RE-TIMED ON A RUNG** (the owner's "re-designed it"; §3.2 beat 3) |
| **Park pose** | `scale 0.182 · rotate +12° · sink 3 %` (the wring lands at −15°) | `characters.bloom.park`. 0.182 = (P − 1.08)/(P − 1) with P = 1.09780, springPop's own maximum; sink 3 % = the shipped 6 px / 200 viewBox | **DERIVED.** Replaces 0.06, so the crest reads 1.0919 → **1.0802** (T3 owner-taste checkpoint 2) |
| **Flight raster** | `1.08` × the ornament's CSS size × DPR | `CRISP.cssLayerBound = 0.08`: the crispness contract's rule-2 bound, which lives only in comments today, named once in `pencilConfig`; the flight raster is 1 + it | **NAMED** (not a new number) |
| `--live-fit` | `@property { syntax: "<number>"; inherits: true; initial-value: 0 }` | THE one `@property` block (pass-4 chair §4, the §10 leader's file), cited, not re-minted | **REGISTERED.** Initial 0 is a visible failure (an unmeasured fit paints no board). `var(--live-fit, 1)` (`GameCard.vue:467`) **dies** |
| gate rate ceilings | painted step ≤ **1.1 ×** the designed curve's analytic peak rate × the painted interval (bloom 4.68 scale/s, visible wring 5.11 scale/s, glass fold 8.11 × travel/s), **and** a painted interval ≤ 34 ms. A stall doesn't show as a rate spike (the frozen curve's average rate over a long frame stays under the peak); it shows as the interval | gate parameters in the specs, not product tokens | new gate grammar (§5) |

The rungs this spec spends are `throw` and `leave`, plus the `bloom` character. It adds no rung
and re-times no ratified pose outside the mark's own subject.

### 3.2 T9-M15: THE BLOOM ON THE GLASS (the storybook toggle, re-seated)

**Components.** Per body, `DarkModeToggle.vue` keeps its **rest stack** (4 baked poses, the idle
boil on the 125 ms beat, unchanged at rest) and gains a **flight stack**:

- The flight stack uses the *same* `sunPoseSvg` / `moonPoseSvg` pose functions, a second
  `useRasterStack` at `cssSize × 1.08`, `cacheKey …-flight`, and 4 poses, so the boil keeps
  stepping during the flight. That answers b2-B's old objection that the crinkle freezes
  mid-gesture.
- Each body's accents (sparkles and stars) are split into **≤ 3 cropped accent sheets**, one
  per stagger group, so the star pop survives as its own compositor transition.
- Flight stacks are `display: none` when parked. That's CH-66's parked discipline verbatim:
  no box, no layer, and outside the filter census, because they're unfiltered `<img>` siblings.
- **The live warped pair dies** (§6).

**The wrapper that moves.** It's an HTML box `.toggle-flight` per body, driven by pure CSS
transitions of `transform`, `scale` and `rotate`, all compositor channels in both engines.
Pure transitions keep the property that the T3 audits fought for: a re-click mid-flight
retargets from the painted pose for free. The transitions stay `!important` so that vueuse's
flip-frame `* { transition: none !important }` can't cancel them
(`DarkModeToggle.vue:775-779`'s own idiom, kept).

**The choreography.** It's the shipped sentence. The three beats that change are in **bold**.

```
t(ms)  0    60        240 340         518 580        860   1010
press  [squash 120]                                                 button `scale`, ±8% rule 2
out    [==== wring: scale 1→0.182, rotate→−15°, sink 3% (accelIn 340) ====]
out            [fade 100]                                         opacity, last beat only
in        [======= bloom: scale 0.182→1, crest 1.080 @518 (springPop 800) =======]
in        [== twist/sink +12°→0, 3%→0 (glass, throw 520) ==]       ← beat 3: square by the crest
in        [fade-in 300]
stars                               [pop ×3 @560/640/720, 150]    cropped sheets
tail                                             [plush 1010]      icon `scale`, ±8% rule 2
page        [dusk 350: 5 grounds, frame 2]                        unchanged selector set
```

1. **Beat 1: the press owns the button.** Under `.is-turning` the fine-pointer hover lift
   (`scale(1.08)`) steps down to 1.0 on its own 200 ms transition, so the button reads as
   pressed. That leaves exactly one scale factor, the crest, above 1.0, which is what lets the
   crest be native.
2. **Beat 2: the crest is honest.** The park scale goes 0.06 → **0.182**, so springPop's own
   overshoot tops out at **1.0802**. That's the ±8 % bound, and it's exactly the flight raster's
   native scale, so the crest frame is 1:1 with no resample. Every other frame is a downscale.
   The incoming body is first *visible* at scale ≈ 0.22–0.25, the census's own "designed born
   ≈ 0.22", at opacity ≈ 0.03 (fade-in @60 on `--ease-standard`).
3. **Beat 3: the twist resolves before the crest.** The rotate and sink move off springPop onto
   the glass curve at `throw` (520). At the crest (t = 518) the residual rotation is
   12° × (1 − glass(458/520)) = **0.018°**, so the crest is square as well as native. On the
   shipped curve the twist overshoots to about −1.2° at the crest, which resamples a raster.
   The visible change is small: the moon settles upright and *then* pops.

**States.**

| State | What paints | Notes |
|---|---|---|
| rest · light / dark | the rest stack of the active body; the other body parked | **π-identical** to HEAD (the same baked poses, the same beat) |
| hover (fine) | rest stack × `scale(1.08)` | unchanged (rule 2, the ratified precedent) |
| **intent** (`pointerenter` fine, `pointerdown`, `keydown` Enter/Space, `focus-visible`) | flight stacks un-parked and `img.decode()`d, still invisible (opacity 0, park pose) | the first gesture frame needs no decode. The cost is ≤ 8 decodes, once per intent, re-parked 2 s after intent ends with no click |
| **turning · frame 1** (the click's frame) | roles swap on a local `pose` ref (not `isDark`): the flight stacks' transitions start, and the rest stacks yield | the gesture is committed to the compositor before any theme work. `aria-label` flips here; the text is unchanged |
| **turning · frame 2** (the next `requestAnimationFrame`) | `html.theme-turning` goes on, then `toggleDark()` (the dusk arms first, the T8-W2 M9 order kept) | the theme flips ≤ 1 frame after the click. That's the chair's row CR-5, and 8–16 ms is far from the 360 ms lag the owner killed |
| turning · stalled main thread | the compositor keeps advancing both bodies. The boil holds its pose and the dusk's colour may step | **the memorable thing**, gated by G-M15-1 |
| settle (the `plush-land` animationend, or the 1100 ms backstop) | the rest stack retakes, the flight stacks park | settle = the same pose index, so no hop |
| re-click mid-flight | the transitions retarget from the painted value, the theme flips back in the next frame, the backstop extends | the pure-transition property is kept |
| flight not yet baked (a gesture before the boot-idle bake lands) | the Bloom plays on the rest stack at 1.0 raster: the crest stretches ≤ 8 % (rule 2), and the gesture still runs on the compositor | logged by a dev counter. The flight bake is scheduled after first paint on W8's post-paint chain |
| **PRM** | **a cut**: the same-frame swap of the rest stacks, the theme at the click, no dusk | the 200 ms crossfade → 0 (it reads `leave`, and the ladder's reduce arm zeroes it). Chair's row CR-4 |
| focus-visible | the ring is unchanged (law 39) | — |

**The ink becomes paint (the half that removes the stalls).** The grid's and wordmark's pose
rasters are monochrome by construction:

- `gridPoseSvg` strokes a single `--grid-line-color` (`HandDrawnGrid.vue:209`), and `grain-static`
  is displacement only (`SvgFilters.vue:54-61`);
- the logo bake is `fill:${ink}` (`HandwrittenLogo.vue`).

- **Arm A (the design):** bake them **theme-free** as alpha coverage. `isDark` leaves both
  `cacheKey`s. Each pose paints as an HTML layer with `mask-image: url(<pose blob>)` and
  `background-color: var(--grid-line-color)` (the logo uses its `color`). The flip re-bakes and
  re-swaps nothing. At the flip frame the ink colour changes with the theme class, as the code
  comment already claims it does. Today it actually changes *late*, when the bake lands.
  The ink doesn't join the dusk. The dusk's selector set stays the five grounds (P1-W3's
  +23.5 fps narrowing stands). The theme-keyed bake population halves: 8 cold encodes per first
  flip → 0.
- **Arm B (the fallback, if A fails π):** keep the theme-keyed rasters and warm the other theme's
  poses after first paint, one pose per post-paint slice (W8's chain; Safari has no
  `requestIdleCallback`). A flip before the warm finishes holds the old raster until after the
  settle (1100 ms) and never bakes inside the Bloom. This costs 2× resident blobs and 2× encodes
  per resize or deal. It's priced in §7.

Arm A also plausibly removes the WebKit warm cost, which ablation F tied to the `isDark` path.
The theme-keyed `<image href>` swaps of cached blobs are the named candidate (census §7). That's a
hypothesis. G-M15-3 and M15-b measure it.

### 3.3 T9-M19: THE FOLD, one grammar and two verbs

Grammar: **the board turns; the cast lifts.** The protagonist, the board with the wordmark
riding the same `run` as it already does, always moves on `turn` (glass, `throw` 520). The
supporting cast (the scene chrome on the way in, the deck on the way out) always lifts on
`leave` (200). Each verb has one clock, and nothing under the mover reflows, clips or bakes.

**ENTER (`g` / the wordmark).**

| Beat | t | What happens | The change |
|---|---|---|---|
| E0 | 0 | read FIRST (the board host and the wordmark's own box); `gallery-leaving` (chrome lifts, `leave` 200); the board holds | unchanged |
| E1 | 200 | `openGallery` → the deck and the face mount → `moveLiveBoard(face)` → fit → the fold | **(a)** `flipTransform` takes the fit: the translate is Δ ÷ `--live-fit` and the scale is `first.w / last.w` (already correct). **(b)** the centre card carries `is-folding` for the fold's lifetime: `.live-face-slot` `overflow: visible` and the card raised above its neighbours, so the full board is seen setting down into the card, never cropped. The clip returns on `finished` or cancel, when the contain-fit clips nothing |
| E1+ | 200–720 | the board and wordmark turn on one clock | **(c)** the wordmark's re-key (`vbWidth`) is held until the fold's `finished`: one bake, after the fold, the masthead precedent the code comment already promises (`App.vue` "one re-bake at settle"). Today it runs 4× inside the fold |
| E2 | on the deck's mount | the deal | unchanged |

The deck's 41 ms mount task stays *before* the fold. LAST is read after the mount, and the
WAAPI mover's pending start absorbs the long task. The census's "57.9 ms frame, −110 px" is a
**main-thread rAF reading of a compositor mover**, so its gate is re-cut on painted frames
(§5, G-M19-6).

**EXIT (select / cancel / Enter).**

| Beat | t | What happens | The change |
|---|---|---|---|
| X0 | 0 | read FIRST | **(d)** FIRST is the *painted face*: `.board-peek-host`'s rect while it's still inside the fit (a live centre card), else the centre card's `.game-card-face` (a poster card, the game-swap seam). Never `.game-card`, which includes its caption |
| X1 | 0 | `moveLiveBoard(null)`, `applyState()`; the Transition's `onBeforeLeave(el)` **pins the leaving deck**: `position: fixed` at its measured rect as inline px, `pointer-events: none` | **(e)** the deck leaves the flow in the same flush that flips the view. The home layout is final *before* `runFold`'s `nextTick` reads LAST, so there's no mid-glide drop at unmount and the centre card keeps 407.9 px while it fades. Inline px, not tokens: no new custom property, so the @property law isn't engaged |
| X2 | 0–520 | the board and wordmark turn (`throw`, glass); the pinned deck lifts (`leave` 200, its existing tuple) | the deck steps back as the board lifts out of it |
| PRM | 0 | a cut: no fold, no leave, no pin | conforms today; kept |

### 3.4 Desktop and phone · light and dark

| | Desk 1280×800 fine | Phone 390×844 coarse (`hasTouch: true`) |
|---|---|---|
| toggle ornament | 13 rem = 208 px; flight raster 208 × 2 × 1.08 = **449 px** square per pose | 4 rem = 64 px; flight raster at DPR 3 = **207 px** square |
| flight texture while turning | 8 body poses × 449² × 4 B ≈ **6.45 MB** plus accent crops (gated ≤ 10 MB, T3-W13's resident-GPU row) | ≈ 1.4 MB |
| hover | the lift is suspended under `.is-turning` | no hover (coarse); unchanged |
| fold travel | board 640 → face 304 (fit 0.475) | board ≈ 366 → face 238.6 (fit ≈ 0.652) |
| exit risk the design removes | card anchor pop dy −35.2 | the 135 px unmount drop |
| **light → dark** and **dark → light** | both directions are the same gesture with the roles swapped; the celestial's colours are theme-independent | same |
| dusk | 350 ms on the five grounds, frame 2 | same |

The deck's dark-theme fold is unmeasured (census §7). Every M19 gate runs in both themes (§5).

### 3.5 Copy (M16)

**No string is added, removed or reworded.** The toggle keeps "Switch to dark mode" /
"Switch to light mode" (`DarkModeToggle.vue:7`). Motion speaks through pose, not words.
`check-copy-register` runs bare and must read the same count as HEAD.

### 3.6 The constraint ledger, row by row

| Constraint | This design |
|---|---|
| filterBudget 9 never grows | **it shrinks**: the live pair (`button.sun-moon-toggle svg.toggle-icon`, count 2) retires, 9 → **7**. Exact-match law 9 moves, so it's the chair's row CR-3. Until the chair rules, the pair stays mounted and parked and the census reads 9. The flight stacks and accent sheets are unfiltered `<img>`s (0 added) |
| AA from painted bytes, both themes | the celestial is non-text art (unchanged). Arm A repaints the grid and wordmark ink through a mask, so the grid's 3:1 non-text contrast and the wordmark's text contrast are re-read from **painted bytes** at both themes and both engines (G-PI-2) |
| π identity on unnamed surfaces | the rest poses, the deck at rest, the card at rest and the board at rest are byte-compared against the HEAD control (painted pixels plus computed paint properties and tags). The named surfaces are the toggle *during* the gesture and the fold *during* 520 ms |
| W2's mechanics | untouched: sticky tag, dock, bottom tab, tap floor, the deck's height law. `is-folding` lives only on a centre card mid-fold |
| M09: no speed bought with quality | the crest goes from vector-crisp to **1:1 native raster**, every other frame is a downscale, and the rest stays byte-identical. Arm A holds the ink at the same resolution (≤ 1/255 rounding, gated) |
| PRM is a cut | both verbs and the toggle cut in the same frame |
| the @property law | `--live-fit` is registered in the one block with a visibly failing initial value and its fallback struck. No other token is minted: the Bloom binds `--bloom-*` from `characters` at the consumer, and the deck pin is inline px |
| budgets as rates | every motion gate is a painted rate against the curve's analytic peak (§5) |
| the dock sheet slides (~700 ms settle) | untouched; no gate reads a dock pose before it settles |
| drawer curve R6 L1 | untouched; the fold *borrows* it (T4-W12), and no surface re-eases under it |
| no osascript / `open -a Safari` | the gates are Playwright chromium and webkit only; Safari and iOS go to the owner's RUNSHEET (W8) |

---

## 4 · Why this and not the other readings

- *"Just remove the bakes and keep the warp."* That cures the chromium cold flip. It doesn't
  cure WebKit's warm cost (not yet attributed), or the next main-thread stall from a solver
  message, a GC or multiplayer traffic. A main-thread gesture teleports under *any* stall.
  G-M15-1 is RED for the warp by construction and GREEN only for a compositor-played gesture.
- *"Move the warp to the compositor."* The census forbids it, and so does the soul gate. The
  warp's reason to exist was vector crispness above 1.0. The flight sheet puts the only
  above-1.0 frame at the raster's native scale, so the contract's purpose survives without a
  per-frame filter.
- *"Hinge on the glass."* The literal pop-up fold (b3 Alt A) becomes buildable on the
  compositor, which dissolves its sliver-wobble objection. It isn't specified here, because the
  owner's complaint is the discontinuity, not the fold axis. It's the alternate frame an
  adjudicator can build if the re-look says "still the same animation."

---

## 5 · Born-RED gates

Every row runs in **chromium and webkit** at **1280×800 fine** and **390×844 coarse with
`hasTouch: true`** (the witnessed regime), in **light and dark**, on a pinned board (a real
codec payload minted with `persistence.ts:190-201`, per the pass-4 addendum; the payload is
stated in the row). Motion is read from **painted frames**: chromium through the CDP
`Page.startScreencast` series, webkit through the Playwright `recordVideo` frames. rAF DOM
sampling is kept as a secondary read and never gates a compositor mover.

| id | reading | HEAD `1e6cfbbf` | target | kind |
|---|---|---|---|---|
| **G-M15-1 STALL** | inject a 300 ms synchronous busy-loop at gesture +100 ms; count distinct painted poses of the incoming body inside the stall window | **0–1** (frozen: main-thread warp) | **≥ 4** painted poses, scale strictly increasing | born-RED, **the memorable thing's gate** |
| G-M15-2 NO FREEZE | cold first flip and warm flips, both directions, +0…+1100: the painted-frame **interval**, and each painted step of visible scale (opacity ≥ 0.3) | intervals of **108–193 ms** (chromium, cold) and **790–862 ms** (webkit, cold); 50–164 ms (webkit, warm); born 0.54–1.00 | every interval ≤ **34 ms**; every step ≤ 1.1 × peak rate × interval (bloom 5.15/s, wring 5.62/s); born ≤ 0.30 | born-RED |
| G-M15-3 NO FLIP BAKES | `drawImage` / encode hook count from click to +1100 | **8** cold (4 grid + 4 logo); warm raster swaps > 0 | **0** encodes, **0** `href` swaps (arm A); arm B: 0 inside the window | born-RED |
| G-M15-4 NATIVE CREST | at t = 518 ± 1 frame: painted width ÷ the flight sheet's natural width, and rotation | vector warp: n/a | ratio ≤ 1.000 on every frame (never upscaled); rotation ≤ 0.1°; the crest crop's SSIM against the vector warp's crest ≥ **0.983** (the soul line) | guard (HEAD is vector-crisp) |
| G-M15-5 RETARGET | a re-click at +200: the painted scale path | continuous (pure transitions) | continuous: no step above the G-M15-2 ceiling | guard |
| G-M15-6 PRM | under `reduce`: the number of frames between the click and the final pose | 200 ms crossfade (≈ 12 frames) | **1** (a cut) | born-RED (pending CR-4) |
| G-M15-7 WEBKIT WARM | warm flip, webkit 1280: frames over 50 ms per flip | **4–7** | **0** (arm A); otherwise the M15-b attribution row stays open | born-RED, measured |
| G-M19-1 ENTER ANCHOR | enter, first painted fold frame: board centre against its FIRST | **92.7 px** (1280) / **21.5 px** (390) | ≤ **3 px** | born-RED |
| G-M19-2 UNCLIPPED | the painted visible fraction of the board on every fold frame | **0.234** → 0.91 | **1.000** | born-RED |
| G-M19-3 EXIT ANCHOR | exit, first painted frame: board rect against the painted face | dy **−35.2**, dw **+28.8** | ≤ **2 px** | born-RED |
| G-M19-4 NO REFLOW UNDER GLIDE | exit: frames after frame 1 with a > 20 px step; centre-card height across the leave | **135 px** drop at 390; card **407.9 → 104** | **0** frames; the card height constant ± 0.5 px | born-RED |
| G-M19-5 NO BAKE IN FOLD | wordmark encode count inside [fold start, `finished`] | **4** | **0** (exactly 1 after `finished`) | born-RED |
| G-M19-6 PAINTED FOLD | the board centre's painted steps and intervals on the fold | unmeasured on paint (the census read rAF: 162/123/78 ms frames at webkit 390) | intervals ≤ 34 ms; steps ≤ 1.1 × 8.11 × travel/s × interval; webkit 390 fold ≥ 20 painted frames (census rAF: 3) | born-RED at 390 webkit |
| G-PROP | `--live-fit` registered in the one block; `var(--live-fit,` fallback count | not registered; **1** fallback | registered; **0** | born-RED |
| G-PI-1 | rest poses (toggle, deck, card, board), painted bytes plus computed paint and tags, against the HEAD control, both themes | — | 0 moved; filter census 9 (or 7 on CR-3) | guard |
| G-PI-2 (arm A) | grid and wordmark ink painted through the mask against HEAD's raster, both themes | — | max channel Δ ≤ 1/255; painted AA equal | guard |
| G-PRM-FOLD | both verbs under `reduce` | a cut (conforms) | a cut | guard |

Evidence discipline: numbers first; ≤ 4 cited crops ≤ 150 KB per lane, each naming engine ·
theme · viewport · pointer; per-frame JSON summarised as min/median/max plus the discontinuity;
long runs in the background with a log, polled.

---

## 6 · What dies

- **The live warped pair**: the two filtered `svg.toggle-icon`s, `g.warp`, `gestureBound`, the six
  `live*` computeds, and `.toggle-icon`'s transition block (about 170 lines in
  `DarkModeToggle.vue`). Its only job was vector crispness above 1.0, and the flight sheet does
  that at the crest natively. `#wobble-celestial`'s base definition survives only if a bake
  still reads it (the rest bakes read the `-p0..3` presets).
- **The theme key in two bakes**: `-${isDark ? "d" : "l"}` in `HandDrawnGrid.vue:233` and
  `HandwrittenLogo.vue:456` (arm A), together with the false claim "masked by the toggle's Bloom"
  (`HandDrawnGrid.vue:179-180`, 257).
- **The Bloom's CSS literals** (`340ms`, `800ms`, `60ms`, `100ms 240ms`, `300ms 60ms`,
  `1010ms`, `120ms`, `150ms 560/640/720ms`, the `1100` backstop): moved into
  `MOTION.characters.bloom`.
- **Park scale 0.06**, replaced by the derived 0.182; the crest goes 1.092 → 1.080.
- **The twist on springPop**, moved to the glass curve at `throw`.
- **The PRM 200 ms crossfade** on the toggle (pending CR-4).
- **`var(--live-fit, 1)`**, a fallback on a measured token.
- **The exit's FIRST from `centerCardEl().getBoundingClientRect()`** (`App.vue:725`).
- **The deck's in-flow leave**, replaced by the pinned leave.
- **`App.vue:1228`'s literal `200ms`**, bound to `leave` / `chromeLeaveMs`.
- **The census's rAF-only gates for compositor movers** (M19-e as worded), re-cut on painted
  frames.
- Refused before specifying: the sky wheel (travel plus sunset, both dead), the rest-stack flight
  at 1.0 (the finding-5 blur), and the 1.08× rest bake (resampled at rest).

---

## 7 · Price and parsimony (stated, not hidden)

- **Code:** the toggle about −170 (the live pair) and +60 (the flight stack: one more
  `useRasterStack` call on the existing pose functions, accent crops as a pose-function flag,
  intent un-park). App.vue about +25 (the fit-aware `flipTransform`, `is-folding`, the pin hook,
  the FIRST read). GameCard about +6. Bakes, arm A: two pose components switch `<image>` for a
  masked layer, about +40 / −20.
- **Boot:** 8 flight encodes (≤ 449 px each) and ≤ 6 accent crops, once, after first paint, not
  theme-keyed. Arm A removes 8 cold encodes on every first flip into each theme.
- **Memory:** ≤ 10 MB GPU while turning at desk DPR2; parked afterwards (display none).
  Arm B would instead hold 2× theme blobs resident.

---

## 8 · Pass-5 charter rows (for the owning families)

| Row | Family / § | The row | Gate |
|---|---|---|---|
| **GM-1 THE BLOOM ON THE GLASS** | §13 **MOT-VERB** (leader) × the toggle | flight stacks at 1.08 × (4 poses, the same pose functions), accent crops, `.toggle-flight` compositor transitions (`!important` kept), local `pose` ref, theme flip on the next rAF, intent un-park and decode, hover suspended under `.is-turning`, the pre-bake fallback on the rest stack | G-M15-1, -2, -4, -5 |
| **GM-2 THE CHARACTER HOMED** | §13 **MOT-LADDER** | `MOTION.characters.bloom` with the shipped numbers moved, `park.scale` derived as (P − 1.08)/(P − 1) in code (not typed), the twist on rung `throw`, bound as `--bloom-*` at the consumer; B6 / `lint:bands` see the toggle's lengths | the ladder's own B-rows; G-M15-4 |
| **GM-3 THE INK IS PAINT** | pencil bakes (W6 substrate) × §13 | arm A: theme-free alpha bakes plus a masked layer for the grid and the wordmark; arm B framed as the fallback; the "masked by the Bloom" claim struck | G-M15-3, G-M15-7, G-PI-2 |
| **GM-4 M15-b ATTRIBUTION** | §13 × W6 | if G-M15-7 stays > 0 under arm A: attribute WebKit's warm cost to a function (a Safari timeline on the owner's RUNSHEET, not headless) and cure it at its source | G-M15-7 |
| **GM-5 THE FOLD SURVIVES THE FIT** | §13 × W2 gallery | `flipTransform(first, last, fit)` divides the translate by `--live-fit` | G-M19-1 |
| **GM-6 THE FOLD UNCLIPPED** | §13 × `GameCard` | `is-folding`: slot `overflow: visible` plus the centre card raised, for the fold's lifetime only | G-M19-2, G-PI-1 |
| **GM-7 THE EXIT FROM THE FACE** | §13 × App | FIRST is the painted board (live) or `.game-card-face` (poster) | G-M19-3 |
| **GM-8 THE DECK STEPS BACK** | §13 × App layout (NOTE-ERASE's Vue-leave finding applies: max(transition, animation) off the leaving node) | pin the leaving deck in `onBeforeLeave`; LAST read after the pin | G-M19-4 |
| **GM-9 WORK AFTER THE MOVE** | §13 × pencil bakes | the wordmark's re-key is held until the fold's `finished` | G-M19-5 |
| **GM-10 GATES ON PAINT** | §13 critics | the painted-frame recorder (CDP screencast / `recordVideo`) and the stall injector become estate specs (not probe files, per registry-v3 §2.10); the rAF-only compositor gates are struck | G-M19-6, G-M15-1 |
| **GM-11 --live-fit** | §10 leader's @property block | register it; strike the fallback | G-PROP |

## 9 · The chair's rows (moved laws; none is a lane's)

- **CR-1:** T3-W13 §2 ruled "WARP XOR over-raster → WARP" with over-raster (b2-B) as the
  recorded fallback. M15 is the owner's trigger. This design is b2-B refined: native at the
  crest, the boil continuing through the flight. The chair rules.
- **CR-2:** crispness contract rule 1 re-worded from "excursions > ±8 % ride the in-SVG warp" to
  "**no cached raster is ever painted above its native scale**" (rule 2 unchanged). The owner's
  finding-5 sentence is the invariant; the warp was one means.
- **CR-3:** filter census law 9, "exactly 9" → "exactly 7" (a decrease). Until then the pair is
  parked and the count is 9.
- **CR-4:** the T3-W10 PRM contract's 200 ms toggle crossfade → a cut, to conform to "PRM is a
  cut".
- **CR-5:** T3's gate "theme flips at click (≤ 1 frame)" → "≤ 1 frame after the gesture commits".
- **CR-6:** the crest 1.092 → 1.080 is T3 owner-taste checkpoint 2. The owner disposes at the
  re-look (U-10), with both crest frames shown.

## 10 · Gaps (my optimism rejected)

- **Compositor behaviour is claimed, not measured.** WebKit's accelerated transitions of the
  individual `scale` and `rotate` properties, and of a `transform` on a box inside
  `.corner-right`'s promoted layer, are believed to run off the main thread. Headless WebKit on
  macOS is not iOS Safari. G-M15-1 is the proof, and the RUNSHEET gets one row (stall a real
  iPhone with the dev tools, watch the moon).
- **Whether CSS transitions start with a pending start time** (so the first frame after a long
  frame doesn't jump) differs by engine. The one-frame theme deferral is the hedge, and the gate
  is G-M15-2 on the cold flip.
- **Arm A's π is unproven.** mask-image compositing, 8-bit rounding and colour-space handling
  may differ from the `<image>` raster, and WebKit masks on layers need the painted diff.
  Arm B exists for this.
- **The accent pop from cropped sheets** peaks at 0.2 + 0.8 × 1.0927 = **1.074** of a
  1.08-baked crop: native, but the stagger groups' crops are unmeasured in area.
- **The flight bake before first use:** a gesture in the first seconds after boot plays on the
  rest stack (the crest stretched ≤ 8 %). That's rule 2's precedent, but it's the finding-5 class
  at a smaller magnitude. It needs to be counted, not hidden.
- **M15-b is unattributed.** Arm A curing it is a hypothesis.
- **Dark-theme folds and the exit at 390 fine are unmeasured** (census §7).
- **This spec ran no browser.** Every HEAD number is the census's. Every target is designed, and
  none is observed.

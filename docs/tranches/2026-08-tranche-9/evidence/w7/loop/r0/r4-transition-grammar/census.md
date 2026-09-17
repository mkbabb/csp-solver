# R4 — THE TRANSITION GRAMMAR

Round-zero census for T9-W7 §12/§13, answering owner marks T9-M02 ("the controls drawer
animation is not smooth") and T9-M09 ("the animations from going into and out of game
selection view are not properly defined and smoothed--as is the controls drawer animation").
Read-only on the product. Every number re-derived on THIS tree (uncommitted W3/W6 in flight),
not recited from the formation census.

**Measured against a BUILT dist** (`npx vite build` off this tree, served on
127.0.0.1:4231), chromium and webkit headless, 390×844 dsf3 touch and 1440×900 dsf2.
Probe scripts and raw JSON in `data/`; born-RED instruments in `instruments/`.

Zero frames banked. Everything here is a number or a file:line — the evidence-policy cap
buys nothing that a currentTime table does not already say better.

---

## 0. The headline, in three sentences

1. **The gallery EXIT does not animate the board.** The 520ms unfold is created and lands
   `playState: "finished"` at `currentTime: 520` before it paints a single frame, on both
   engines and both widths, while the wordmark beside it glides the full 520ms. The exit's
   own doc calls the board "the exit's protagonist". It cuts.
2. **The drawer's frames are clean where we can measure them; the drawer's CURVE is the only
   suspect left locally.** At 390×844 the dock rides ONE compositor-only WAAPI mover
   (transform, 520ms, the glass curve), costs 3–4 layouts per gesture, and produces zero
   frames over 33ms at 1× and one 53ms frame at 4× CPU throttle. M02's jank did not reproduce
   on this rig. W8 owns the real device; this census hands it a clean local baseline so a
   device reading means something.
3. **16 of 39 shipped `transition:` declarations carry no house curve at all** — the browser's
   default `cubic-bezier(0.25,0.1,0.25,1)` IS the design. The dusk ease, which is the theme
   swap's own page-colour tween and the exact surface M09 names, is one of them
   (`assets/index.css:667`, `350ms ease`).

---

## 1. The homes, and what is actually in them

`src/pencil/config/pencilConfig.ts` MOTION (lines 121–199) exposes **four** duration
constants and **one** curve:

| constant | value | consumers |
| --- | --- | --- |
| `beatMs` | 125 | `boilBeat.ts:32`, `HandwrittenLogo.vue:129`, `DarkModeToggle.vue:427` |
| `cardStepMs` | 440 | `useCarouselGlide.ts:27`; published to CSS as `--card-step-ms` (`GameGallery.vue:930`) and read by `GameCard.vue:411` |
| `boardFoldMs` | 520 | `App.vue:376` (`useFlipGlide`), `GameGallery.vue:371` |
| `chromeLeaveMs` | 200 | `App.vue:630` (a `setTimeout`) — the CSS twin is hand-typed `200ms` in `scene.css:617/629` |
| `curves.drawerGlide` | `cubic-bezier(0.32, 0.72, 0, 1)` | `useFlipGlide.ts:115`, `useCarouselGlide.ts:28` |

`src/assets/index.css` @theme §EASING (lines 349–358) holds **ten** `--ease-*` tokens.
Site use, measured: `standard` 17 · `glassGlide` 10 · `drawOn` 10 · `springPop` 6 ·
`noteWrite` 6 · `fadeOut` 5 · `accelIn` 5 · `ghostDraw` 2 · `anticipatePop` 2 ·
`loaderScrub` 1.

**The mirror holds.** `MOTION.curves.drawerGlide` and `--ease-glassGlide` both read
`cubic-bezier(0.32, 0.72, 0, 1)` (I3 check A, GREEN). Nothing enforces it — `lint:motion`
(`scripts/check-motion-contract.mjs`) is the e2e PRM-declaration gate, not an easing gate,
and no other script reads either side.

**The durations have no home.** Across shipped `.vue`/`.css` (dev rig excluded):
**73 live `transition:`/`animation:` declarations, 28 distinct literal duration values,
6 durations v-bound from config** (the celebration star and heart, off `CELEBRATION`).
The ONE glass curve alone is spent at **six** durations — 200, 240, 280, 320, 440, 520ms —
of which two resolve to a MOTION constant. Eight call sites type the other four by hand
(I3 check B, RED).

---

## 2. The inventory

HOME is one of **MOTION** (a pencilConfig band reaches this surface) · **TOKEN** (a
`--ease-*` curve, duration typed at the call site) · **INCIDENTAL** (no named curve — a bare
UA keyword or none at all; the owner's "not properly defined" class).

### 2.1 The gallery

| # | transition | trigger | dur | curve | properties | HOME | PRM |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G1 | chrome leave (BEAT 0) | `g` / wordmark → `enterGallery` | 200ms | `--ease-fadeOut` | opacity | TOKEN (`scene.css:617,629`; the 200 is `MOTION.chromeLeaveMs` in JS only, `App.vue:630`) | armed, CSS `no-preference` gate + JS `reducedMotion` cut |
| G2 | board fold IN (BEAT 1) | center card's face mounts | 520ms | glass (WAAPI) | transform | MOTION (`boardFoldMs`) | armed (`App.vue:612`) |
| G3 | wordmark fold IN | same clock as G2 | 520ms | glass (WAAPI) | transform | MOTION | armed |
| G4 | deal (BEAT 2) | deck mount | — | — | — | — | — |
| G5 | **board unfold OUT** | select / cancel / Esc | 520ms declared | glass (WAAPI) | transform | MOTION | armed — **but never plays; see §3** |
| G6 | wordmark unfold OUT | same call as G5 | 520ms | glass (WAAPI) | transform | MOTION | armed |
| G7 | deck leave-only fade | view flips to playing | 200ms | `--ease-glassGlide` | opacity | TOKEN (`App.vue:1142`) | armed (`App.vue:1149`) |
| G8 | controls fade-in | scene mounts | 250ms +150ms delay | `--ease-drawOn` | opacity | TOKEN (`scene.css:612`) | armed (whole block `no-preference`) |
| G9 | card step | ArrowLeft/Right, pip, snap | 440ms | glass | transform (track, WAAPI) + transform/opacity (3 cards, CSS) | MOTION (`cardStepMs`, both layers) | armed (`useCarouselGlide.ts:293`) |
| G10 | guard ribbon arm/retire | guarded select | 240ms | `--ease-glassGlide` | transform + opacity | TOKEN (`GameGallery.vue:1473`) | armed (`:1486`) |
| G11 | gallery pip | snap | — | — | — | — | armed (`GameGallery.vue:1511`) |

G7 is documented as "the twin of BEAT 0's chrome-leave, on the same clock"
(`App.vue:1141`). Same clock, **different curve**: G1 is `--ease-fadeOut`, G7 is
`--ease-glassGlide`. Two curves for one declared twin.

### 2.2 The controls drawer

| # | transition | trigger | dur | curve | properties | HOME | PRM |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D1 | sheet/board (desk, ≥1024) | tab click / Esc | 520ms | glass (WAAPI) | transform | MOTION-adjacent — `GLIDE_MS = 520` is a **module literal** at `useControlsDrawer.ts:86`, not a MOTION band | armed (`:423`) |
| D2 | case (rail) | same clock | 520ms | glass | transform | same | armed |
| D3 | tab counter-scale | same clock | 520ms | glass | transform | same | armed |
| D4 | masthead | same clock | 520ms | glass | transform | same | armed |
| D5 | **dock sheet (<1024)** | tab tap | 520ms | glass | transform (`translate(0,±628px)` at 390×844) | same | armed |
| D6 | dock rest pose | state, not a gesture | — | — | `translate:` channel (`scene.css:486/490`) | — | n/a |
| D7 | tab tongue tilt | hover | 150ms | **`ease-out`** | transform | **INCIDENTAL** (`DrawerTab.vue:144`) | **none** — file has no PRM block |
| D8 | sparkle icon | hover / any change | 200ms | **none given** | **`all`** | **INCIDENTAL** (`GameControlPanel.vue:2082`) | not gated |
| D9 | action-bar fold hint | scroll state | 150ms | none given | opacity | INCIDENTAL (`GameControlPanel.vue:2132`) | inside a `no-preference` block |
| D10 | player rows (multiplayer) | peer join/leave | 320/280ms | `--ease-glassGlide` | opacity + transform | TOKEN (`GameControlPanel.vue:1724–1749`) | armed (`:1758`) |
| D11 | zone disclosure | section toggle | 200ms | `--ease-drawOn` | **`grid-template-rows`** | TOKEN (`GameControlPanel.vue:2284`) — a LAYOUT property, the estate's only one | armed (`:2297`) |

D5 is the surface M02 names on a phone. Measured roster at 390×844: exactly **two**
animations — the `.scene-controls` transform mover, and a stray `visibility 200ms ease` on
`.sparkle-icon` that D8's `transition: all` picked up because the gesture flips
`.drawer-case`'s visibility. The `hostMoved` guard (`useControlsDrawer.ts:277`) correctly
suppresses D1/D3/D4 on the dock, so no filtered layer is promoted to animate to itself.

`GLIDE_MS = 520` sitting as a module literal contradicts the covenant the same file quotes
("no new timing constants outside pencilConfig", `pencilConfig.ts:149`). It happens to equal
`boardFoldMs`; nothing holds it there.

### 2.3 The dark-mode toggle

The whole gesture, in beats, from `DarkModeToggle.vue` + `index.css`:

| beat | what | dur | curve | properties | HOME | PRM |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | `theme-turning` armed, then the class write | class up ~400ms (`:671`) | — | — | literal `400` / `1100` in `handleToggle` | armed (`:658` returns early) |
| T2 | **the dusk** — page + sheets ease colour | 350ms | **`ease`** | background-color + color, `!important` | **INCIDENTAL** (`index.css:667`) | armed (`no-preference` gate) |
| T3 | button squash | 120ms | per-step (`ease-out`, `--ease-springPop`) in `@keyframes` | scale | TOKEN-in-keyframes (`:822`) | armed (`:983`) |
| T4 | outgoing icon fade | 100ms, delay 240 | `--ease-standard` | opacity | TOKEN (`:774`) | armed |
| T5 | wring-down | 340ms | `--ease-accelIn` | transform (in-viewBox) | TOKEN (`:795`) | armed |
| T6 | incoming icon rise | 300ms, delay 60 | `--ease-standard` | opacity | TOKEN (`:780`) | armed |
| T7 | the bloom | 800ms, delay 60 | `--ease-springPop` | transform (in-viewBox) | TOKEN (`:810`) | armed |
| T8 | star tuck-in | 150/100ms | **`ease-in`** | scale + opacity | **INCIDENTAL** (`:873`) | armed |
| T9 | star pop | 150/120ms, delays 560/640/720 | `--ease-anticipatePop` / **`ease-out`** | scale + opacity | mixed (`:882`) | armed |
| T10 | plush flex | 1010ms | per-step in `@keyframes` | scale | TOKEN-in-keyframes (`:843`) | armed |
| T11 | toggle hover | 200ms | **`ease`** | transform | **INCIDENTAL** (`:717`) | not gated |
| T12 | rest-stack swap | 200ms | **`ease`** | opacity | **INCIDENTAL** (`:976`) | not gated |

Eleven timing values in one gesture (100, 120, 150, 200, 240, 300, 340, 350, 400, 800, 1010,
1100), **not one of them in a MOTION band**, and the one the owner's mark actually names —
the page dusk, T2 — is the bare-`ease` row.

### 2.4 The margin furniture

| # | transition | trigger | dur | curve | properties | HOME | PRM |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M1 | hint note arrival | note mounts | 250ms | `--ease-noteWrite` | opacity (clip write-in) | TOKEN (`MarginNote.vue:149,180`) | file-gated |
| M2 | **hint note retraction** | — | — | — | — | **DOES NOT EXIST** (W7 §7's question, restated as a measurement) | — |
| M3 | solver-error note in | note mounts | 250ms | `--ease-noteWrite` | opacity | TOKEN (`SolverErrorNote.vue:63`) | armed |
| M4 | solver-error note hover | hover | 150ms | none given | background | INCIDENTAL (`SolverErrorNote.vue:97`) | not gated |
| M5 | **washi tape** | hover / focus on its group | 150ms | **none given** | opacity | **INCIDENTAL** (`SheetWashiLabel.vue:109`) | **none** — file has no PRM block |
| M6 | completion vignette | win | 250ms | `--ease-noteWrite` | opacity | TOKEN (`CompletionVignette.vue:133`) | file-gated |
| M7 | crayon heart | hover | 240ms | **`ease`** | opacity | **INCIDENTAL** (`CrayonHeart.vue:329`) | **none** |
| M8 | solve-success grid | win | 500ms | none given | stroke | INCIDENTAL (`index.css:590`) | armed (`:613`) |
| M9 | solve-success frame | win | 500ms | none given | box-shadow | INCIDENTAL (`index.css:607`) | armed (`:617`) |
| M10 | grid draw-on | board deal | 240/500ms | **`ease`** | stroke-dashoffset + opacity | INCIDENTAL (`HandDrawnGrid.vue:588`) | file-gated |
| M11 | answer-key laminate | reveal | 200/280ms | `--ease-accelIn` / `--ease-glassGlide` | opacity + transform | TOKEN (`AnswerKeyLaminate.vue:224,236`) | file-gated |
| M12 | laminate copy | reveal | 150ms | **`linear`** | opacity | INCIDENTAL (`AnswerKeyLaminate.vue:271`) | file-gated |

---

## 3. THE EXIT'S BOARD FOLD IS DEAD ON ARRIVAL

`App.vue:639` `unfoldToBoard` reads the centered card's rect, parks the live board home,
applies the state, then hands `runFold` two movers — `.board-peek-host` and the wordmark.
The mover **is created**: hooking `Element.prototype.animate` catches it with the right
keyframes at every width and both exit verbs (Escape and select), e.g. at 390×844

```
t9503.1 <DIV> .board-peek-host  {duration:520, easing:"cubic-bezier(0.32, 0.72, 0, 1)", composite:"replace", fill:"none"}
        [{transform:"translate(0.1875px, 43.9375px) scale(0.7786885245901639)"}, {transform:"translate(0px, 0px) scale(1)"}]
```

Then, polled every frame from the handle the hook keeps:

| surface | ENTER `.board-peek-host` | EXIT `.board-peek-host` |
| --- | --- | --- |
| 390×844 chromium | `running` 55 frames, 0→520 | **`finished`/520 at t+11.6ms**, computed transform `none` for the whole window |
| 1440×900 chromium | `running` 56 frames | **`finished`/520 at t+14.1ms** |
| 390×844 webkit | `running` 17 frames (webkit headless rAF ~50ms) | **`finished`/520 at t+22ms** |

The wordmark mover, created in the same `foldCtl.run` call on the same clock, plays
0→520 normally in all three. So it is not the primitive, not the curve and not the clock.

The shaped suspect is `restoreBoardAnims` (`App.vue:447`): it walks
`host.getAnimations({ subtree: true })` — which **includes an animation on the host element
itself** — and calls `a.finish()` on anything absent from the pre-move snapshot. The exit
runs `moveLiveBoard(null)` (which queues that restore) and the deck's own teardown emits a
second live-face null, so a restore can land after `runFold` has armed the mover it then
finishes. Naming the exact ordering is the cure lane's job; the reading above is the fact.

**This is M09's "out of game selection view" half, and it is not a smoothness question.**
No curve can improve a transition that never runs.

---

## 4. Frame traces — is it the curve or the frames?

390×844 dsf3, built dist, chromium headless. rAF deltas over the gesture window plus a CDP
`Performance` delta across the same window. Headless chromium runs rAF uncapped (~130fps
idle), so read the **long-frame list**, never the fps.

| gesture | 1× max frame | 1× frames >33ms | 1× layouts | 4× max frame | 4× frames >33ms |
| --- | --- | --- | --- | --- | --- |
| idle control | 10.0ms | 0 | 0 | 10.0ms | 0 |
| dock open (1st) | 29.9ms | 0 | 3 | 53.0ms | 1 |
| dock close (1st) | 10.1ms | 0 | 4 | 29.2ms | 0 |
| dock open (2nd) | 10.0ms | 0 | 3 | 16.3ms | 0 |
| dock close (2nd) | 10.3ms | 0 | 4 | 11.5ms | 0 |
| **theme → dark (1st)** | **145.7ms** | 2 | 141 | **247.8ms** | **6** (4 over 100ms) |
| theme → light (2nd) | 10.2ms | 0 | 164 | 46.2ms | 1 |
| theme → dark (3rd) | 10.1ms | 0 | 164 | 52.4ms | 2 |
| theme → light (4th) | 10.0ms | 0 | 165 | 71.0ms | 2 |
| gallery enter (1st) | 15.7ms | 0 | 72 | 83.9ms | 2 |
| **card step (1st)** | **133.9ms** | 4 (3 over 100) | 29 | **473.1ms** | **6**, span 2093ms for a 900ms window |
| card step (2nd) | 10.2ms | 0 | 62 | — | — |
| gallery exit (select) | 24.0ms | 0 | 84 | 89.2ms | 2 |
| gallery enter (warm) | 15.4ms | 0 | 81 | 65.8ms | 1 |
| gallery exit (cancel) | 14.9ms | 0 | 83 | 95.7ms | 1 |

Readings:

- **The drawer is not the frames, locally.** Compositor-only transform, 3–4 layouts per
  gesture, no long frames after the first open. Whatever M02 saw on the real iPhone is either
  device-only (W8's to find) or it is the CURVE and the choreography — a 520ms full-sheet
  throw on a phone, where the sheet travels 628px, is a long time to watch a monotone curve
  with no overshoot, and the dock's sheet is the ONLY thing moving (the desk's reciprocal
  board/masthead movers are suppressed by `hostMoved`). §13 should decide whether the dock
  deserves its own band rather than inheriting the desk's 520.
- **The first dark-toggle is a cold bake.** `rasterPose` cache keys carry the theme
  (`HandwrittenLogo.vue:343` `logo-…-${isDark?'d':'l'}-…`, `HandDrawnGrid.vue:216`
  `grid-…-${isDark?'d':'l'}`), so the first flip mints two new bakes inside the gesture.
  Six alternating flips at 4× (probe 2): 247.8 / 46.2 / 52.4 / 71.0 / 68.3 / 39.2ms max.
  Only the first is catastrophic. This is W8 §8.1's shaped suspect, measured.
  *Caveat, stated rather than buried:* one 4× run also showed a second dark-ward spike
  (204.4ms) after a gallery round-trip; the clean six-flip run did not reproduce it. W8
  should read a cold device rather than trust either.
- **The first card step is a cold bake too** — 4 frames over 96ms at 1×, four ~465ms frames
  at 4×; the second step is clean (max 10.2ms). The poster warm (`scheduleWarmPosters`,
  `App.vue:785`) does not cover the first step's cost.
- **Every named gesture animates transform/opacity only.** The one exception is D11, the
  zone disclosure's `grid-template-rows` (`GameControlPanel.vue:2284`) — a genuine layout
  animation, 200ms, on a surface the controls re-cut (§10) is about to touch anyway.

---

## 5. The grammar gap — defined vs incidental

| class | count | what it means |
| --- | --- | --- |
| shipped `transition:` declarations | 39 | dev rig excluded |
| …carrying a `var(--ease-*)` | 23 | DEFINED curve |
| …**carrying no named curve** | **16** | the UA default IS the design |
| shipped `animation:` declarations | 35 | |
| …carrying a `var(--ease-*)` | 20 | |
| …`linear`/keyword at the shorthand | 15 | legitimate where `@keyframes` carries per-step easing (celebration, toggle-squash, plush-land); not audited further |
| `transition: all` | 3 shipped (+2 dev) | `GameControlPanel.vue:2082` is the one in a user path |
| distinct literal durations | 28 | against 4 MOTION bands |
| durations reaching CSS from config | 1 | `--card-step-ms` (`GameGallery.vue:930`) |
| glass-curve durations | 6 | 2 with a MOTION home, 4 typed by hand at 8 sites |
| declarations whose file has no PRM block | 19 of 74 | three of them are user-visible transitions with no arm at all: `DrawerTab.vue:144`, `CrayonHeart.vue:329`, `SheetWashiLabel.vue:109` |

The 16 incidental transitions, in full:

```
src/assets/index.css:590                    stroke 500ms
src/assets/index.css:607                    box-shadow 500ms
src/assets/index.css:667                    background-color 350ms ease, color 350ms ease !important   ← THE DUSK
src/games/shared/DrawerTab.vue:144          transform 150ms ease-out
src/games/shared/GameControlPanel.vue:1956  background-color 150ms, color 150ms
src/games/shared/GameControlPanel.vue:2082  all 200ms
src/games/shared/GameControlPanel.vue:2132  opacity 150ms
src/games/shared/SolverErrorNote.vue:97     background 150ms
src/games/shared/scene.css:378              opacity 150ms
src/pencil/celestial/DarkModeToggle.vue:717 transform 200ms ease
src/pencil/celestial/DarkModeToggle.vue:873 scale 150ms ease-in, opacity 100ms ease-in !important
src/pencil/celestial/DarkModeToggle.vue:976 opacity 200ms ease
src/pencil/chrome/AttributionCard/CrayonHeart.vue:329   opacity 240ms ease
src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:588     stroke-dashoffset 240ms ease, opacity 500ms ease
src/pencil/sheet/AnswerKeyLaminate.vue:271  opacity 150ms linear
src/pencil/sheet/SheetWashiLabel.vue:109    opacity 150ms
```

---

## 6. The instruments

| instrument | asserts | reading at HEAD |
| --- | --- | --- |
| `instruments/i1-exit-fold-plays.mjs` | the gallery exit's `.board-peek-host` mover is observed `running` ≥3 frames with a non-`none` transform; the ENTER's twin is the live control | **RED** ×3 — 390×844 chromium, 1440×900 chromium, 390×844 webkit: 0 running frames, first state `finished`; control ran 55/56/17 frames |
| `instruments/i2-incidental-transition-census.mjs` | every shipped `transition:` carries a `var(--ease-*)` (budget 0) | **RED** — 16 of 39 |
| `instruments/i3-glass-curve-home.mjs` | A: `MOTION.curves.drawerGlide` ≡ `--ease-glassGlide`. B: every duration spent on the glass curve resolves to a MOTION constant | A **GREEN**; B **RED** — 6 distinct durations, 8 homeless call sites |

I1 needs a built dist on `BASE` (default `http://127.0.0.1:4231/`). I2/I3 are static and
run anywhere.

---

## 7. What §13 has to decide (questions, not proposals)

1. Does the dock's 520ms sheet throw inherit the desk's band, or does a 628px travel on a
   phone want its own? The desk's 520 was auditioned against a reciprocal board+case pair;
   the dock moves one thing.
2. Where does `GLIDE_MS = 520` live — `useControlsDrawer.ts:86` or a MOTION band named for
   the drawer?
3. The glass curve is spent at 200/240/280/320/440/520ms. Is that a band ladder worth naming
   (throw / step / note / whisper), or four accidents to fold into two?
4. G1 and G7 are declared twins on one clock and ride two curves. Which one is the leave?
5. The dark toggle spends eleven timing values and zero MOTION bands. Which of them are the
   gesture's real beats, and does the dusk (350ms, bare `ease`) join the house or keep its
   own?
6. What retracts a margin note? M2 above is a hole, not a curve.
7. Do the three unarmed transitions (tab tongue, crayon heart, washi tape) want a PRM arm, or
   are sub-200ms opacity fades the declared floor?
8. The exit's board fold: once it plays, is 520ms still right, or was the grammar written for
   a fold nobody had ever seen?

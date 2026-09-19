# MOT-DERIVE · pass-1 research · Distance and material

Section §13 (the transition grammar) · §12's drawer curve · marks M02, M09 (design half).
Lane port 4248. Evidence home: this directory (pass 1 = `loop/pass1/`; nothing written under
`loop/r1/`).

**VERDICT: KILL.** The family dies on its own first prototype, on the estate's own numbers,
before a line of product code. The kill is not close and it does not depend on which
definition of "travel" is used.

---

## 0. The kill in four lines

The drawer has **two poses**. At 1440×900 its case travels **209.0 px**; at 390×844 the same
element, the same gesture, the same `GLIDE_MS`, travels **628.0 px**. Both are ruled **520 ms**
by one constant.

    ms = baseMs + travelPx / speed
    520 = baseMs + 209.0 / speed
    520 = baseMs + 628.0 / speed
    ⟹  419.0 px of travel difference must buy 0 ms  ⟹  speed = ∞, travel term = 0.

The only (baseMs, speed) consistent with the drawer's own two poses is the one where travel
contributes nothing and the "derived" duration is the constant it was invented to replace.
Every other anchoring of `paperSpeed` breaks one of the owner's two ruled numbers by 20–200%.

---

## 1. What I verified on this tree (file:line)

| fact | cite |
| --- | --- |
| `GLIDE_MS = 520` is a module literal, not a MOTION band | `web/frontend/src/games/shared/useControlsDrawer.ts:86` |
| the case mover's travel IS computed at onset and thrown away — `translate(${firstR.left - lastR.left}px, ${firstR.top - lastR.top}px)` | `useControlsDrawer.ts:298-302` |
| `useFlipGlide` takes **one** `durationMs` at CONSTRUCT time, for every mover in every run | `useFlipGlide.ts:114-116`, `:164-169` |
| "ONE glass curve, ONE clock (every mover pinned to the same `startTime` — zero stagger)" | `useFlipGlide.ts:21-23`, `:174-176` |
| the card step's travel `dx` is computed and available at the `animate` call | `useCarouselGlide.ts:324-337` |
| the card step publishes **one static** duration to CSS, consumed by three cards | `GameGallery.vue:930` → `GameCard.vue:410` (`transition: transform var(--card-step-ms, 440ms)`) |
| MOTION's four durations; the covenant ("no new timing constants outside pencilConfig") | `pencilConfig.ts:121-199`, the covenant at `:141-143` / `:156` |
| `cardStepMs`'s own docstring already argues the family's thesis qualitatively: "a card step travels one slot, not a full sheet" | `pencilConfig.ts:146-152` |
| `boardFoldMs`'s too: "A FULL-sheet throw … so it takes the drawer's glass ceiling 520 ms — longer than the 440 ms card-step" | `pencilConfig.ts:157-162` |
| the dusk — the surface M09 names — is a **colour** tween with no geometry at all | `src/assets/index.css:667` (`background-color 350ms ease, color 350ms ease !important`) |
| the exit fold is created and finished before it paints (assumed cured; not touched) | `App.vue:447 restoreBoardAnims`, r0 census §3 |
| **the estate's drawn idiom normalises geometry AWAY and states the duration**: `pathLength=1000` "normalises arc length across all 4 poses AND every board size" | `HandDrawnGrid.vue:91-93`; `HandwrittenGlyph.vue:199-203` passes `pathLength: glyph.length` with a fixed `durationMs: DRAW_IN_PRESETS.glyph.duration` (350, `pencilConfig.ts:499-506`) |
| `createStrokeDrawIn` takes `pathLength` and `durationMs` as **separate** parameters — the sibling primitive refuses to derive one from the other | `@mkbabb/pencil-boil/dist/vue.d.ts:112-118` |
| nowhere in `src/` is any duration computed from any distance | grep for `duration…/…px|travel|len|width`: zero hits |

---

## 2. The prototype — arithmetic, no code

`probe/p1-derive-arithmetic.mjs` (output banked at `data-p1-derive.txt`), reading
`r0/r4-transition-grammar/data/r4-probe3.json` — every `Element.prototype.animate` call the
product makes at 390×844 and 1440×900 against a built dist.

### 2.1 The travel census — one duration, a 63× range of travel

Centre-translate magnitude of each mover's FROM keyframe, beside the duration declared on it:

| viewport | gesture | target | travel px | ms | px/ms |
| --- | --- | --- | --- | --- | --- |
| 390×844 | drawer open / close | `.scene-controls` | **628.0** | 520 | 1.208 |
| 390×844 | gallery enter | `.board-peek-host` | 57.6 | 520 | 0.111 |
| 390×844 | gallery enter | `.logo-menu` | 145.5 | 520 | 0.280 |
| 390×844 | gallery exit | `.board-peek-host` | 43.9 | 520 | 0.084 |
| 390×844 | gallery exit | `.logo-menu` | **10.0** | 520 | 0.019 |
| 390×844 | card step | `.gallery-track` | 304.0 | 440 | 0.691 |
| 1440×900 | drawer open | `.board-peek-host` | 193.0 | 520 | 0.371 |
| 1440×900 | drawer open | `.scene-controls` | **209.0** | 520 | 0.402 |
| 1440×900 | drawer open | `.drawer-tab` | **0.0** | 520 | — |
| 1440×900 | drawer open | `.masthead` | 317.6 | 520 | 0.611 |
| 1440×900 | gallery enter | `.board-peek-host` | 168.4 | 520 | 0.324 |
| 1440×900 | gallery enter | `.logo-menu` | 319.1 | 520 | 0.614 |
| 1440×900 | gallery exit | `.board-peek-host` | 203.2 | 520 | 0.391 |
| 1440×900 | gallery exit | `.logo-menu` | 306.3 | 520 | 0.589 |

**520 ms is declared on 24 moving targets whose travel spans 10.0 … 628.0 px — 63×.** A single
speed constant must map that whole range onto one number; no finite speed does.

The generous re-reading does not save it. A FLIP that scales moves its edges further than its
centre, so `probe/p3-corner-travel.mjs` recomputes travel as `|d| + |s−1|·r_max` against the
**measured** last boxes (`probe/p2-deck-and-boxes.json`, this tree, both viewports). Corner
travel at 520 ms spans **44.6 … 628.0 px (14.1×)** ignoring the pure counter-scale tab, or
4.5 … 628.0 px (139×) counting it. Same verdict, worse ratio.

### 2.2 The solve, exactly as the charter asks

`baseMs` is a free parameter; I report 0, 120 and 200 ms rather than picking a flattering one.
0 is the honest default (nothing in this estate charges a fixed startup cost — the movers are
pinned to one clock and the first painted frame already carries motion, `useFlipGlide.ts:174`).
120 ≈ one beat window (`MOTION.beatMs` 125). 200 = `chromeLeaveMs`, the estate's shortest named
band.

Anchor = the desk drawer's case (209.0 px, ruled 520 ms):

| baseMs | paperSpeed | dock (628 px) | card step 390 (304 px) | card step 1440 (352 px) |
| --- | --- | --- | --- | --- |
| 0 | 0.402 px/ms | **1562.3 ms** (+1042.3, **+200.5%**) | **756.3 ms** vs 440 (+316.3, **+71.9%**) | 875.7 ms vs 440 (+435.7, +99.0%) |
| 120 | 0.523 px/ms | 1321.8 ms (+154.2%) | 701.8 ms (+59.5%) | 793.6 ms (+80.4%) |
| 200 | 0.653 px/ms | 1161.4 ms (+123.4%) | 665.4 ms (+51.2%) | 738.9 ms (+67.9%) |

**The charter's own instruction produces a 1.56-second drawer on a phone and a 756 ms card
step.** The miss against the owner-ruled 440 is +316.3 ms / +71.9%.

Anchor = the dock instead (628 px, ruled 520 ms), for symmetry:

| baseMs | paperSpeed | desk drawer | card step 390 |
| --- | --- | --- | --- |
| 0 | 1.208 px/ms | 173.1 ms vs 520 (−66.7%) | 251.7 ms vs 440 (−42.8%) |
| 200 | 1.962 px/ms | 306.5 ms vs 520 (−41.1%) | 354.9 ms vs 440 (−19.3%) |

### 2.3 The pairings — two unknowns, three ruled facts

| fit on | result |
| --- | --- |
| desk drawer + dock | **no finite solution** — equal durations across 419 px of travel difference; only speed = ∞ works |
| dock + card step | baseMs **364.9**, speed 4.05 px/ms → **the constant is 70.2% of the 520 it explains**; predicts the desk drawer at **416.5 ms vs 520 (−19.9%)** |
| desk drawer + card step | baseMs 696.1, speed **−1.187 px/ms** — **negative**: a longer throw takes less time |

Fitting two materials to two numbers is the charter's named kill ("a formula that has learned
the answer"). Here even the fitted formula fails on the third point, and one of the three fits
requires paper that moves backwards.

### 2.4 Least squares — the best the estate's numbers allow

baseMs **469.3**, paperSpeed 15.803 px/ms. Residuals: desk −37.5 ms (−7.2%), dock −11.0 ms
(−2.1%), card step +48.5 ms (+11.0%); RMS 36.0 ms. The travel term contributes 13.2 / 39.7 /
19.2 ms — **26.5 ms of spread across a 3× travel range, 1.6 frames at 60 Hz**. The constant is
**95.1% of the mean duration**.

The best-fitting "derived" system is a constant with a rounding error attached, and the rounding
error is smaller than two frames. That is the family's second death: even where it does not
contradict the rulings, it is not observable.

---

## 3. The questions the charter set, answered

### Q1 · THE SOLVE
Above. `paperSpeed` from the desk drawer at baseMs 0 is **0.402 px/ms**; the dock predicts
**1562.3 ms** (ruled 520) and the card step **756.3 ms** (ruled 440) — a miss of **+316.3 ms,
+71.9%**. At 1440 the card step's travel is **352 px** (measured, §4) and predicts 875.7 ms,
+99.0%.

### Q2 · ONE MATERIAL OR TWO
**One, and it does not work.** Two would not be a material distinction; it would be a fit. The
desk pose and the dock pose are the *same element*, on the *same constant*, in the *same
composable* — calling them two materials to rescue the model is the charter's own kill
condition, stated out loud. Nor do three help: the drawer alone needs a material per pose, the
fold needs one per direction (enter 428.6 px corner travel at 1440, exit 443.0 px, both 520),
and at that point the "system" has one constant per gesture, which is what the estate already
has, with two extra numbers in front of it.

### Q3 · THE ENGINE DELTA
The 576.4 / 604.6 px pair (`probe-r7b.json`) is **not** a like-for-like engine comparison of the
number a derived duration would consume. It samples `.drawer-case`'s rect every frame; probe3's
628 px is `.scene-controls`'s keyframe, a different element, and webkit headless runs rAF at
~50 ms against chromium's ~8 ms (r0 census §4), so webkit's first sample lands later into a
fast-attack curve and undercounts. The delta is at least partly the instrument.

The deeper answer makes the question moot, and it is worse for the family than either verdict:
**the travel a FLIP computes is a `getBoundingClientRect()` difference**, so it carries layout
rounding — the desk masthead's own keyframe reads `translate(-316.2109375px, 29.1875px)`.
Deriving a product duration from it makes the timing a function of sub-pixel layout, font
metrics and scrollbar width. Feature or defect is the wrong axis: it is a **design decision
sourced from a rounding error**. For the record, at the least-squares fit the two engines would
differ by 1.8 ms (0.4%); at the desk-anchored fit, by 70.2 ms (4.9%).

### Q4 · THE NON-DERIVED — how much of the estate is off the system
`probe/p4-travel-coverage.mjs` (banked at `data-p4-coverage.txt`), i2's scope
(`.vue`/`.css` under `src/`, dev rig excluded):

- **73 shipped declarations** (39 `transition:`, 34 `animation:`).
- **61 (83.6%) cannot carry a distance at all** — opacity, colour, stroke, box-shadow, filter,
  visibility, `grid-template-rows`, `stroke-dashoffset`.
- 12 could in principle (11 name `transform`, 1 is `transition: all`). Hand-verified at the
  source, **only two carry an actual pixel translation**: `AttributionCard.vue:183/205`
  (`scale(0.9) translateY(8px)` — 8 px) and `GameGallery.vue:1473` (the guard ribbon,
  `translate(-50%, -0.75rem)` — 12 px). The rest are rotation-only (`DrawerTab.vue:144`,
  1.4°→0°), scale-only (`GameCard.vue:410`, `AnswerKeyLaminate.vue:224/236`,
  `DarkModeToggle.vue:717`) or viewBox-unit warps (`DarkModeToggle.vue:795/810`).
- On I6's wider scope (77 declarations, `.ts` included), the family governs **the 3 WAAPI
  gesture classes plus those 2 CSS rows = 5 of 77, 6.5%**. Everything else takes a stated
  constant, which is what it takes today.

And the two travelling CSS rows are 8 px and 12 px — at any speed that leaves the drawer usable,
their travel term is under 1 ms. The system would govern **three gestures** and declare 74.

**The dusk is not merely off the system; it is unreachable by it.** `index.css:667` tweens
`background-color` and `color` across the whole page — zero geometry, 350 ms, bare `ease`. It is
the surface T9-M09 names first, and no travel model can say anything about it. Whatever governs
the dusk (a stated constant, and per R6 it must stay narrowed to its five selectors at
`index.css:628-670` — `useTheme.ts:35`'s `disableTransition` is worth +23.5 fps and may not be
re-blanketed), it is a different family's answer.

### Q5 · THE DOCK, AND THE OWNER'S RULING
The owner's audit-4 ruling is **the curve AND 520 ms** (`pencilConfig.ts` `drawerGlide`
docstring; R6 law 1). It was auditioned by eye at :3001 against the shipped spring and two glass
variants — **on the desk**, where the case, the board and the masthead move reciprocally. The
dock (one thing moving, 628 px) inherited it without its own audition.

This family honours **the curve and half the 520**: whichever pose it anchors keeps 520 exactly
(that is the trick), and the other pose is re-timed by −67% or +200%. There is no anchoring that
keeps both, because both are the same ruled number on a 3× travel difference. So the answer to
Q5 is: **only the curve survives whole.**

Two further collisions specific to the dock:

1. **628 px is the sheet's own height.** Measured at 390×844 on this tree, `.scene-controls` is
   390 × **628** (`probe/p2-deck-and-boxes.json`). The dock slides exactly its own height. Under
   a derived duration the drawer's timing becomes a function of how tall the controls card
   happens to be — and §10 of this very wave re-cuts that card. Add one option row and M02's
   "not smooth" gesture gets slower.
2. **Per-gesture is the only legal granularity, and it reintroduces the judgment call.** Per-
   *mover* derivation is forbidden by the ruling it claims to honour: `useFlipGlide` pins every
   mover to one `startTime` with "zero stagger — sheet and case read as one solid", and the tab's
   counter-scale mover has travel **0.0 px** (it only counter-scales, `useControlsDrawer.ts:305-312`),
   so a derived duration would finish it before the host it is counter-scaling and the 48 px
   tongue would stop reading constant. So the duration must be per gesture — and at 1440 the
   gesture's movers travel 193.0, 209.0, 0.0 and 317.6 px. **Which one is "the" travel?** The
   family exists to stop somebody choosing a number, and its first act is to choose one.

### Q6 · THE RUNNABLE HALF
**Not run, by the charter's own gate** ("only if the arithmetic lands"). No overlay, no
`.diff`, no built dist, no frame traces, no PRM sweep. `proto/` holds the note saying so rather
than a stylesheet nobody should replay. Nothing was shortened, thinned or dropped; the π-guard
and the W8 QUALITY LAW are untouched because nothing was touched.

### Q7 · THE LINT
The one gate worth minting here **survives the family's death**, and it is i3 check B extended
from CSS to JS: *every `duration:` at a WAAPI call site and every `durationMs:` handed to
`useFlipGlide` resolves to a `MOTION` member*. It is born-RED at HEAD on exactly one row —
`GLIDE_MS = 520` (`useControlsDrawer.ts:86`) — which contradicts the covenant the same file
quotes (`pencilConfig.ts:141-143`, R6 law 4). A gate for "no literal durations in FLIP call sites"
is cheap, true and independent of any derivation.

What such a gate **cannot** check is the family's actual claim. A static reader cannot see a
travel, so "this duration is derived correctly" is only assertable at runtime, per gesture,
against a rect diff — which is a probe, not a gate.

### Q8 · THE FRAME TRACE
Not run (Q6). The r0 baseline stands unmoved: dock open 29.9 ms max at 1×, 53.0 ms at 4×, zero
frames >33 ms at 1×; first card step 133.9 ms at 1× / 473.1 ms at 4× (a cold bake, not a curve).
Nothing in this lane could have moved them, and nothing did.

---

## 4. The measurement this lane added

`r4-probe3.json` logs **no card-step mover at 1440×900** — the charter's question 1 asks for a
travel that is not in the data. `probe/p2-deck-and-boxes.mjs` (dev server :4248, chromium,
both viewports, four `ArrowRight` steps each) resolves it, and the answer is a third kill:

| viewport | `--deck-slots` | frame | track | step 0 | step 1 | step 2 | step 3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390×844 | 1 | 382 | 1598.8 | 304 px / 440 ms | 304 px / 440 ms | 305 px / 440 ms | 304 px / 440 ms |
| 1440×900 | 3 | 1056 | 1760 | **0 px, no mover** | **352 px** / 440 ms | **352 px** / 440 ms | **0 px, no mover** |

At the desk's three-slot rung cards 0 and 1 share one rest position, and so do 3 and 4
(`useCarouselGlide.ts:167-193`), so **half the desk's card steps move the highlight and not the
deck**. One ruled duration (440) already governs travels of 0, 304, 305 and 352 px inside one
gesture class. The 304 px is `min(78vw, 22rem)` at 390 and the 352 is `min(22rem, (100vw−3rem)/3)`
at 1440 (`GameGallery.vue:1092`, `:1291`) — both measured here, both on 440.

There is also a two-layer problem the arithmetic exposes and no amount of it fixes: the card step
is **WAAPI track + CSS cards**. `GameGallery.vue:930` publishes `--card-step-ms` once, statically,
from `MOTION.cardStepMs`; `GameCard.vue:410` reads it for the three cards' own
transform/opacity transition. A per-gesture derived duration can only reach the track. Either the
cards desync from the track on every step, or the gesture writes the custom property at onset —
a style write inside the one-forced-layout-per-gesture discipline the drawer's whole design is
built on (`useControlsDrawer.ts:253-268`).

---

## 5. Instruments — before and after

Nothing in this lane produced a diff, so before ≡ after by construction. Re-run **unchanged**
from `r0`, on this tree, today:

| instrument | before (r0) | this lane | after |
| --- | --- | --- | --- |
| `i2-incidental-transition-census.mjs` | RED, 16 of 39 | **RED, 16 of 39** (identical roster) | unchanged |
| `i3-glass-curve-home.mjs` A | GREEN | **GREEN** (`cubic-bezier(0.32, 0.72, 0, 1)` both sides) | unchanged |
| `i3-glass-curve-home.mjs` B | RED, 6 durations / 8 homeless sites | **RED, 6 / 8** (identical roster) | unchanged |
| `owners-eye.instruments.mjs` I6 | RED, 77 declarations / 35 literals / 4 named | **RED, 77 / 35 / 4** (top literals 150 ms ×21, 200 ms ×16, 250 ms ×9, 500 ms ×6) | unchanged |
| `i1-exit-fold-plays.mjs` | RED ×3 | **not re-run** — needs a built dist and this lane lands no diff | assumed cured |

**The I6 reading is this family's quietest indictment.** The only durations a travel system could
ever derive are 520 and 440 — and both are *already* named in MOTION. The family would retire
**zero** of I6's 35 literals and add two new constants (`paperSpeed`, `baseMs`) plus a helper, so
the instrument M09 actually turns on goes from "35 literals against 4 named" to "35 against 5".
The 35 literals are hover fades, note write-ins and colour tweens — 150 ms ×21, 200 ms ×16 — and
not one of them moves anything anywhere.

i1, as instructed: the family assumes the exit fold cured, and would give it **the enter's own
curve and the enter's own duration** — the glass curve at 520 ms. Enter and exit are one gesture
reversed; an asymmetry there reads as a bug, not as timing. Under this family they would differ,
because their corner travels differ (1440: enter 428.6 px, exit 443.0 px), which is an argument
against the family rather than for it.

---

## 6. The inversion — why the premise is backwards for THIS product

This is the finding a synthesizer should carry forward even though the family dies.

Duration and distance are one equation with two ways to hold it still:

- **Constant duration** (what ships) ⟹ velocity ∝ distance. The 628 px sheet throws at
  1.208 px/ms; the 10 px wordmark nudge drifts at 0.019 px/ms. A 63× range of *speed*, read as
  weight: the big thing is committed, the small thing is a settle.
- **Constant speed** (this family) ⟹ duration ∝ distance. Every gesture moves at the same
  px/ms, and the sheet takes 1.56 s to do it.

Expressive timing has always lived in the second column being *wrong*: spacing carries velocity,
the clock stays put. The estate has already ruled this way twice, in the primitive it uses most.
`HandDrawnGrid` normalises `pathLength` to 1000 so that "arc length across all 4 poses AND every
board size" draws in the same time (`:91-93`), and `HandwrittenGlyph` hands
`createStrokeDrawIn` a real `pathLength` beside a fixed 350 ms (`:199-203`,
`pencilConfig.ts:499-506`) — a "1" and an "8" are written in the same beat, because a hand that
took twice as long on the 8 would read as hesitation. **The house already decided that geometry
is normalised away and the duration is stated.** MOT-DERIVE proposes the opposite law for the
same hand.

*Background only, and it does not carry the verdict:* the one mainstream system that shipped a
distance-scaled duration rule was Material Design 2's motion-duration guidance; Material 3
replaced it with a named duration ladder (short/medium/long tokens). Apple's sheet
presentations and UIKit's spring API take duration as a parameter, never as a function of
travel. And the human-factors law that actually relates distance to time — Fitts's — is
logarithmic in distance and describes *pointing*, not *watching*; a linear travel ÷ speed model
has no law behind it in either literature.

---

## 6.5 Three sketches for the synthesizer

**A · The kill, drawn.** Every mover the product creates, travel on x, declared duration on y.
A derived system is a straight line through these points. There isn't one.

```
  ms
1600 ┤                                             ○ 1562  ← what the desk-anchored
     │                                           ·           solve demands of the dock
     │                                        ·
1200 ┤                                     ·
     │                                  ·
     │                               ·            ms = 0 + travel/0.402
 800 ┤                            ·
     │              ○ 756      ·                  ← and of the card step
     │           ·          ·
 520 ┤●●● ●  ●  ● ●     ●         ●          ●    ← WHAT SHIPS: one flat line,
     │                                             24 targets, 10 → 628 px
 440 ┤              ●      ●                      ← and a second flat line, 304/352 px
     │
   0 └┬────┬────┬────┬────┬────┬────┬────┬────┬──
      0   80  160  240  320  400  480  560  640  travel px
      ↑           ↑         ↑                ↑
   wordmark    card step  masthead        the dock
   10px/520   304px/440   318px/520      628px/520
```

The shipped estate is two horizontal lines. Any `base + travel/speed` is a sloped line. A
sloped line through the 209/520 and 628/520 pair is horizontal — which is the constant again.

**B · The inversion.** One equation, two ways to hold it still. The right column is the
family's; the left is what ships, and what the house's own draw-in primitive already rules.

```
  CONSTANT DURATION (ships)              CONSTANT SPEED (this family)
  ──────────────────────────             ────────────────────────────
  dock   ├══════════════════┤ 628px      dock   ├══════════════════┤ 628px
         0 ──── 520ms ──── ▲                    0 ─────── 1562ms ─────────── ▲
  card   ├────────┤ 304px                card   ├────────┤ 304px
         0 ─ 440ms ─ ▲                          0 ─── 756ms ─── ▲
  mark   ├─┤ 10px                        mark   ├─┤ 10px
         0 ─ 520ms ─ ▲                          0 25ms ▲

  velocity 0.019 … 1.208 px/ms           velocity 0.402 px/ms, everywhere
  = weight. the big thing is             = no weight. a sheet and a nudge
    committed, the small settles           are the same gesture, one longer

  the house already ruled this way twice:
    HandDrawnGrid.vue:91   pathLength=1000 "normalises arc length across all 4 poses
                           AND every board size" → same duration, any board
    HandwrittenGlyph:199   pathLength: glyph.length + durationMs: 350 (fixed)
                           → a "1" and an "8" are written in the same beat
```

**C · Which mover is "the" travel?** The drawer at 1440×900, one gesture, one clock, four
movers. A derived duration must be per gesture (per mover breaks the zero-stagger ruling and
the tab's counter-scale), so the system must pick one of these — the exact act it exists to
abolish.

```
  drawer open @1440×900  ── one startTime, one curve, 520ms ──
  ┌──────────────────────────────────────────────────────────┐
  │ .masthead          ├──────────────────────────┤  317.6px │  ← the longest
  │ .scene-controls    ├────────────────┤          209.0px   │  ← "the drawer's own"?
  │ .board-peek-host   ├──────────────┤            193.0px   │  ← the protagonist?
  │ .drawer-tab        │                             0.0px   │  ← counter-scale only:
  └──────────────────────────────────────────────────────────┘     derived ⇒ it finishes
                                                                   early and the 48px
   pick 317.6 → the case is slower than its own drawer            tongue stops reading
   pick 209.0 → the masthead lands late                            constant (F5's kept
   pick 193.0 → the case overruns the sheet                        behaviour)
   pick max/mean/the-first-one → you have chosen a number
```

---

## 7. Kill conditions — both met

| condition (charter) | met? |
| --- | --- |
| "two ruled durations (520, 440) must both fall out of one speed constant and almost certainly will not" | **MET, and worse than stated.** It is not two ruled durations against one constant; it is **one** ruled duration (520) against **two** travels (209, 628) in **one** gesture. The family fails before 440 is reached. |
| "a system that governs the minority of declarations is a rule for two gestures" | **MET.** 3 gesture classes and 2 eight-to-twelve-pixel CSS rows out of 77 declarations — **6.5%**. Literally a rule for three gestures. |

---

## 8. Recommendation — KILL, with three salvages

**KILL.** `ms = baseMs + travelPx / speed(material)` cannot be fitted to this product's ruled
numbers, and where it can be fitted it is invisible: the best least-squares system puts 95.1% of
every duration in the constant and spends 26.5 ms — 1.6 frames — on the entire 3× travel range.
It cannot reach the dusk, which is the surface M09 names first; it governs 6.5% of the
estate's declarations; it must choose which of a gesture's four movers is "the" travel, which is
the act it exists to abolish; it would desync the card step's CSS layer from its WAAPI layer; it
makes the drawer's duration a function of the controls card's height, which §10 of this wave is
about to change; and it derives a design decision from a `getBoundingClientRect()` rounding
error. The neat property the charter names — re-deriving the owner's 520 by setting
`paperSpeed` — is available for exactly one of the drawer's two poses, and buying it costs the
other pose 1042 ms.

Three things in this lane are worth keeping, and none of them needs the model:

1. **`GLIDE_MS = 520` goes home.** `useControlsDrawer.ts:86` is a module literal that
   contradicts the covenant its own file quotes (`pencilConfig.ts:141-143`, R6 law 4). Name it
   `MOTION.drawerGlideMs` and extend i3-B from CSS to the WAAPI call sites — a born-RED
   one-row gate, true whatever §13 decides.
2. **The dock's 520 is a real open question, and it is an EYE's question.** The r0 census asks
   it (§7 Q1) and this lane sharpens it with a number: the desk case runs at 0.402 px/ms and the
   dock sheet at 1.208 px/ms — a 3× velocity difference on one constant, on the surface M02
   calls "not smooth", on the pose the owner never auditioned. The answer is a *second named
   constant* auditioned by eye at the dock (`MOTION.dockGlideMs`), declared as a per-pose
   decision — which the charter already allows — not a formula. A named 600 or 640 is honest; a
   derived 1562 is not. The estate's own method for this is on the record twice: 440 was
   auditioned against 380/440/520 ("380 read clipped for a one-slot throw, 520 … dragged for the
   shorter travel", `pencilConfig.ts:146-152`) and 520 against 480/520/560 at the drawer
   (`useControlsDrawer.ts:83-86`). Three candidates, one pair of eyes, one sentence of reasoning
   banked beside the constant. That is what §13 should do for the dock.
3. **The travel the FLIPs throw away is worth logging, not consuming.** `useControlsDrawer.ts:300`
   and `useCarouselGlide.ts:324` both compute it. A dev-only census of travel-per-gesture would
   have made this lane's whole census free, and would let the next timing audition state what it
   is looking at. That is a diagnostic, not a product constant.

U-10: nothing here closes M02 or M09. This lane returns one family, dead on arithmetic, and the
three rows above for whoever writes §13's spec.

---

## 9. Files

| file | what |
| --- | --- |
| `probe/p1-derive-arithmetic.mjs` | the solve, the pairings, the least squares, the engine delta — reads `r0/…/r4-probe3.json`, no server |
| `probe/p2-deck-and-boxes.mjs` · `p2-deck-and-boxes.json` | the two numbers probe3 lacks: the card step at 1440 (measured, four steps) and the movers' last boxes (dev server :4248, chromium, 390×844 dsf3 touch + 1440×900 dsf2) |
| `probe/p3-corner-travel.mjs` | travel re-defined as corner displacement, against the measured boxes |
| `probe/p4-travel-coverage.mjs` | how much of the estate a travel system could reach |
| `data-p1-derive.txt` · `data-p3-corner.txt` · `data-p4-coverage.txt` | their outputs, banked verbatim |
| `proto/NOTHING-TO-REPLAY.md` | why there is no overlay |

Zero frames banked (evidence-policy cap respected; every claim above is a number or a
`file:line`). No product file was read-modified; the tree is untouched.

# G-TOGGLE · opus · T9-M21 ("the darkmode toggle story book needs improvement"), M15 restated

Designed against MAIN `1d0dc4fd` (what the owner audited), read beside MOT-VERB's pass-5 bank (the §13
fold's tree). Method: the frontend-design two-pass (plan → review against the tell list → revise → spec).
Everything below is an analysis lane. **No server was bound and nothing was painted** (no ports were
named for this lane). Every number marked *model* is computed from main's own tokens and curves
(`index.css:134–136,308,363–365,401`; `--ease-*` `index.css:350–352`; VERB's `MOTION.rungs`/`verbs`).
Every number marked *census* is `census/toggle/README.md`'s. A model number isn't a painted number.

---

## 0 · The memorable thing (one)

**Night turns on a hinge.** Paper and ink trade places once, at the one instant the old ink and the new
ink read equally well on the darkening paper. That's **120 ms into the dusk going dark and 87 ms going
light**. At that instant the board's ink turns from graphite to chalk in a single frame, and the Bloom
turns with it: the sun has sunk into the page and the moon is standing up out of it. No frame ever shows
a blank board, two bodies at once, or a smudge.

The number isn't a taste. It's where contrast(old ink, paper(t)) = contrast(new ink, paper(t)) under
the dusk's own `ease` over 350 ms, and it falls in the same place for the grid and for the digits:

| direction | hinge (grid) | hinge (digits, `--color-foreground`) | hinge (page ground vs foreground) | contrast at the hinge |
|---|---|---|---|---|
| light → dark | **120.1 ms** (P = 0.593, paper Y 0.166) | 120.0 ms | 117.9 ms | grid **3.11**, digits **4.09** |
| dark → light | **87.3 ms** (P = 0.407) | 87.4 ms | 89.1 ms | grid **3.11**, digits **4.09** |

*model*. The ink swaps as a zero-duration CSS transition, delayed to the hinge, and it starts in the
same style change as the dusk, so both are sampled off the one document timeline. On any frame, even
after a stall, the ink shown is the one that reads better on that frame's paper. **By construction the
minimum over every frame is ≥ 3.11 (grid token) and ≥ 4.09 (digits).**

### Why neither ballot arm on the table can meet M21-c (the finding that makes this the design)

- **T9-B23 (a), the ink SNAPS at frame 2.** The new ink sits under 3:1 from **0 to 117 ms** going dark
  and **0 to 85 ms** going light (*model*). The census measured under 3:1 for 5–17 frames at +3…+191 on
  every warm flip, and it's crop c2's wash-out.
- **T9-B23 (b), the ink JOINS the dusk.** Paper and ink interpolated on the same curve must cross
  luminance: the ink starts darker than the paper and ends lighter, so by the intermediate-value theorem
  some instant has L_ink = L_paper, which is 1:1. The *model* minimum is **1.008** (under 3:1 for
  75–151 ms dark, 67–137 ms light). (b) doesn't soften the blank. It moves the blank and adds 4 masked
  1272² repaints per frame.
- **Any continuous ink path fails the gate "≥ 3:1 on every frame".** Only a discontinuity passes: either
  the atomic PRM-style cut of paper and ink together (a 400 px white-to-black flash on a dusking page,
  refused under M09), or a swap of the ink alone at the hinge. The hinge also maximises the worst frame:
  3.11 is the geometric-mean bound √(C_rest,light-ink × C_rest,dark-ink on the crossover paper). No
  schedule does better.

So the hinge is **T9-B23 arm (c)**. It's the only arm that meets M21-c, and it costs the same paint as
(a): one ink repaint, moved from frame 1 to the hinge.

---

## 1 · Pass 1 plan → review against the tells → what changed

**Plan (pass 1).**
1. Ink at the hinge.
2. The Bloom as a strict point hand-off: the sun sinks to a point at 200 ms and the moon is born from
   that point.
3. The live body boils.
4. The settle waits for the bloom.

**Review.**
- *The generic answer* to "improve a dark-mode toggle animation" is a whole-page circular reveal clipped
  from the button (the view-transition wipe), or a longer, softer crossfade. The wipe is the web's
  default for this brief: a new mechanic, a full-viewport repaint, and the ink still crosses its paper
  inside the circle. The crossfade is refused by name in G-MOTION's apotheosis (a crossfade or a longer
  Bloom is refused under M09). Both are out.
- *Plan item 2 failed its own clock.* Born at 200 on a 520 ms spring, the moon crests at 498, which is
  150 ms after the page has settled. That's the census's "out of step with the night" again, just moved.
  **Revised:** the moon is born on **one house beat (125 ms)**, 5 ms after the dark hinge. The sun is at
  0.77 then, and the moon is 0.06, opaque and drawn over it. The pair never exceeds 0.5 together: the
  sun drops under 0.5 at 163 and the moon passes 0.5 at 187.
- *Chanel's mirror:* I removed one accessory. The star stagger no longer has its own 80 ms number. The
  stars pop on the house beat after the crest (crest + 0·, 1·, 2·125), and a timing literal dies with it.
- *Tell check on copy and visual:* no new strings, no new colour, no new type, no new filter. The only
  visual novelty is the order and the opacity law (§3 P2).

---

## 2 · Tokens (values, homes, the @property law)

No colour, type or radius token is added. Palette: `MASCOT_COLORS.celestial` verbatim.

| token | value | home | registration |
|---|---|---|---|
| `MOTION.hinge.toDark` / `.toLight` | **0.343** / **0.249** of the `dusk` rung (= 120 / 87 ms) | `pencilConfig.ts` MOTION, a DERIVED delay (the `round(0.42·throw)` deal precedent). The unit test recomputes it from `index.css`'s tokens and the dusk curve (G-T2), so it's never typed twice. | published by `publishMotionRungs` as `--motion-hinge-dark` / `--motion-hinge-light` |
| `--motion-hinge-dark`, `--motion-hinge-light` | 120ms, 87ms | the ONE `@property` block in the first static stylesheet | `syntax:'<time>'; inherits:true; initial-value:0ms`. 0ms is the visibly failing value: an unpublished hinge snaps the ink at frame 1, which is today's blank, and G-T1 reds on it. No `var()` fallback at any consumer. |
| `--motion-beat` | 125ms (`MOTION.beatMs`, law 7) | publisher, beside the rungs | same block, `initial-value:0ms` |
| `--bloom-crest` | `calc(var(--motion-beat) + 0.573 * var(--motion-throw))` = 423 ms | the toggle's scoped block, consuming published rungs only | not registered (a local calc). 0.573 is `--ease-springPop`'s own crest abscissa (y 1.0978), derived by G-T2's second clause from the bezier. |
| rungs spent | `leave` 200 · `throw` 520 · `whisper` 150 · `dusk` 350 (VERB's banked map) | `MOTION.rungs` | VERB's block (unchanged) |
| curves spent | `--verb-lift-ease` (0.32,0,0.67,0), the sink · `--ease-springPop`, the bloom, the character's own · `--ease-anticipatePop`, the star pop · `--verb-dusk-ease`, the dusk (unchanged) | `@theme` / verbs | — |

Nothing re-eases under the drawer's glass curve (R6 laws 1–2). The Bloom never touches it.

---

## 3 · Components and states

### P1 · The Bloom's score (Arm R, re-scored; one clock with the dusk)

```
ms     0    87   120 125      200        317    350     423      548   645  673     823
dusk   |=========================================|  (350, ease; the five grounds, unchanged)
ink          ^dl  ^ld      (one-frame swap at the hinge; board grid + digits + marks)
squash |==120==|                                        (kept verbatim)
sun    |==sink 200, lift curve, 1 → 0.06, −15°==|✕ cut (opacity 1 → 0 in one frame)
moon                   ●born 0.06, opaque
                       |======== bloom 520, springPop, +12° → 0 ===========|
                                          ^arrives 1.00 (317)   ^crest 1.092 (423)
stars                                                   ✦423   ✦548   ✦673   (whisper 150 each)
plush                                                               |=150=|
settle                                                                        ● all animations finished
```

| beat | selector · property | duration | delay | curve | was (main) |
|---|---|---|---|---|---|
| squash | `.sun-moon-toggle.is-turning` · `toggle-squash` | 120 | 0 | as shipped | **kept** |
| sink | `.toggle-icon .warp` · transform → `scale(0.06) rotate(-15deg) translateY(6px)` | `--motion-leave` 200 | 0 | `--verb-lift-ease` | 340 `--ease-accelIn` |
| cut | `.toggle-icon` · opacity → 0 | 0 | `--motion-leave` 200 | — (a step) | 100 ms fade at 240 |
| born | `.toggle-icon.is-active` · opacity → 1 | 0 | `--motion-beat` 125 | — (a step) | 300 ms fade at 60 |
| bloom | `.toggle-icon.is-active .warp` · transform → none | `--motion-throw` 520 | `--motion-beat` 125 | `--ease-springPop` | 800 at 60 |
| tuck (outgoing accents) | **DELETED.** The accents ride the warp and leave with their body. | — | — | — | 150/100 ease-in, undelayed |
| star 1/2/3 | incoming `.twinkle-star, .dot-star` · scale 0.2 → 1, opacity a step | `--motion-whisper` 150 | `--bloom-crest` + 0 / 1 / 2 × `--motion-beat` = 423 / 548 / 673 | `--ease-anticipatePop` | 150 at 560 / 640 / 720, 120 ms opacity fade |
| plush | `plush-land` (same keyframe shape, the 0–85 % identity padding struck) | `--motion-whisper` 150 | beat + throw = 645 | as shipped per step | 1010 with 85 % padding |
| hinge ink | board ink: `.grid-ink` background-color, glyph `color`/`stroke`/`fill` | 0 | `--motion-hinge-dark` / `-light` | — (a step) | snaps at frame 1 |
| settle | `turning = false` | — | when `getAnimations({subtree:true})` on the incoming icon have all `finished` (≈ 823) | — | on `plush-land` end only (1010) |

*model* (both directions, the score is symmetric):

| reading | main (census · model) | Arm R (model) |
|---|---|---|
| double exposure (both bodies > 0.5 scale and > 0.5 opacity) | 13 frames ≈ 100 ms (census) · 60 ms (model) | **0** |
| any body at opacity in (0.02, 0.98) | ~300 ms of translucent frames | **0 frames** (P2) |
| outgoing at the page's half-swap (≈ 105–130) | 0.945 (census) | 0.88 at 100 → **0.77 at 125** |
| incoming arrives at 1.00 | ≈ 356 | **317** (the page's last change is at 350) |
| crest | 518–546 (census) | **423** (+73 after the page) |
| gesture length / tail on a still page | ≈ 1040 / ≈ 690 (census) | **≈ 823 / ≈ 473** |
| incoming peak step per frame (120 Hz / 60 Hz) | 0.044 / 0.088 | **0.068 / 0.133** |
| outgoing peak step per frame (120 Hz / 60 Hz) | 0.056 / 0.112 | **0.113 / 0.180** |

The last two rows are the price, and it goes to the owner, not to a lane (§8, R-1).

### P2 · The opacity law: pencil is on the page or it isn't

No body, star or sparkle is ever translucent. Graphite doesn't fade. It's drawn or it's gone. Every
opacity change in the Bloom is a one-frame step at the edge of its beat:

- the sun is cut at 0.06 scale, where it's a 12 px point at desk and 5 px at phone;
- the moon is born opaque at 0.06;
- stars are born opaque at 0.2 scale.

This deletes three census defects at the cause: the ~100 ms translucent double exposure (c1), the brown
blot (orange at low alpha over the new ground, c3 +331/+356), and the stars leaving before their body
(they now leave inside it).

### P3 · The live body boils (M21-f)

The live `<svg filter>` binds `url(#wobble-celestial-p{i})`. Here `i` is the gesture-bound pose index,
`sunFrame` or `starFrame`, the same ref the rest stack reads, stepping at the sky's bands (sun ÷2, moon
÷1.5, R6 law 8, untouched). The results:

- **Both hand-offs are field-identical.** At click, rest pose i gives way to live pose i. At settle, live
  pose j gives way to rest pose j, the same geometry and the same noise field. Today the live field is
  0.02, which none of the four rest fields (0.0185/0.023/0.017/0.0215) matches, so both hand-offs jump
  30–60 % of a boil step (census c4).
- **The moon boils for the first time during a turn.** Its body has no pose geometry, so its only boil is
  the field.
- **Cost:** the live body already re-rasters its filter every frame of the warp, so a field step inside
  the gesture adds no raster. At rest the binding is `gestureBound` and holds its snapshot, so there are
  zero writes, the same as today.
- **Count:** the census gate asked for ≥ 4 field steps per gesture. That was written against the 1040 ms
  gesture. At ≈ 823 ms the honest count is **moon ≥ 4, sun ≥ 3** (floor(823 / (band × 125))). The gate
  reads per body (G-T6).
- **What dies:** `wobble-celestial` as a live consumer. Its base def becomes `baseDef: false`, which is
  `wobble-logo`'s precedent (dead config dies). The `filterBudget` TRANSIENT row keeps `count: 2`, and
  its `filter` matcher widens from `url(#wobble-celestial)` to the four pose ids. **The chair reads this
  against law 9** (the count is exact, the string moves; the population stays 9).

### P4 · The settle waits for the bloom (M21-g)

`onGestureEnd`'s `plush-land`-only clear dies. On click a generation counter increments. After one rAF
the component awaits `Promise.all(incoming.getAnimations({ subtree: true }).map(a => a.finished))`, and
`turning = false` only if the generation is unchanged. The backstop timer derives as score + one beat
(823 + 125 = 948) in place of the literal 1100. The `theme-turning` timer derives as `dusk + beat`
(475) in place of the literal 400. It has to outlive the hinge and the dusk, and it does.

### P5 · The hover is fenced (R6 law 14, a defect found reading main)

`.sun-moon-toggle:hover { transform: scale(1.08) }` (`DarkModeToggle.vue:728`) is **not** inside
`@media (hover: hover)`. On a touch device a tap leaves `:hover` stuck, so the toggle can sit at 1.08
after its Bloom until the next tap elsewhere. The cure is to fence it. Nothing else about hover moves:
the ±8 % contract and the `leave` rung on `--verb-layDown-ease` are VERB's.

### P6 · States

| state | desktop (ornament 13rem = 208 px, 1280×800 fine) | phone (ornament 5rem = 80 px, 390×844 hasTouch) |
|---|---|---|
| rest, light | the sun's 4-pose baked stack on the beat ÷2 (unchanged, byte-identical) | same |
| rest, dark | the moon's stack ÷1.5 (unchanged) | same |
| hover (fine only) | scale 1.08 on `leave` (VERB) | **none** (P5) |
| focus-visible | the ring at `2px − bleed` (unchanged) | same |
| turning → dark | P1's score. The ink hinge at 120. | same score. The board fills the screen, so the hinge is the loudest cure here (c2's cell). |
| turning → light | P1's score. The ink hinge at 87. | same |
| re-press mid-flight | transitions retarget. A body mid-sink that's re-activated holds one beat and then blooms from its current scale; a body mid-bloom that's de-activated sinks from its current scale on `leave`. The generation counter keeps the settle for the last press. | same |
| cold first flip into a theme | the score is unchanged. The stall is VERB's row 36 (the grid) and row 37 plus §7's wordmark arm. The hinge needs the grid's ink to be a CSS colour (A2), so on main alone it covers the digits only. | same |
| PRM | a CUT (VERB's GB7): no gesture; paper and ink change in one frame. The hinge rule is `no-preference`-gated, so under PRM it doesn't exist. The existing 200 ms rest crossfade is VERB's `--ease-prmFade` row, not mine. | same |

---

## 4 · Copy (M16)

**No string changes.** The accessible names stay `Switch to dark mode` / `Switch to light mode` (plain,
active, and they name the outcome). There's no visible copy. `check-copy-register` bare: 0 new findings.

---

## 5 · Motion (curve · duration · home), summarised

- **Durations** are spent from VERB's banked ladder `{whisper 150, leave 200, note 250, dusk 350, step
  440, throw 520, rise 520}` plus `MOTION.beatMs` 125. No new literal.
- **Two derived delays**, the hinge (0.343 / 0.249 × dusk) and the crest (beat + 0.573 × throw), each
  recomputed by a unit test from its source (tokens and curve). Neither is typed as a number anywhere
  but `pencilConfig`.
- **Curves:** lift (sink), springPop (bloom, the character's own), anticipatePop (stars), dusk (page).
  The drawer's glass curve isn't touched (R6 law 1, 520 ms `cubic-bezier(0.32,0.72,0,1)`, the drawer's
  alone).
- **The beat table** (VERB's `@toggle-beats`, lint:verbs rule 8) is rewritten to Arm R's rows. The
  character stays ONE character, auditioned whole. Its lengths now come from the ladder, so a retune of
  a rung re-auditions the Bloom BY NAME. **That is a U-10 re-time of owner-auditioned beats, so it
  ships only as a framed pair (§8).**

---

## 6 · Born-RED gates (each RED at main HEAD, or plant-RED where HEAD can't be)

Every gate is read the same way: both engines, both directions, cold and warm, 1280×800 fine and
390×844 hasTouch, on ONE encoded `?board=` payload (the payload law), with two-photograph minima
(Addendum A.5.7).

| id | gate | HEAD | negative plants |
|---|---|---|---|
| **G-T1 HINGE** | grid token AND digit ink vs `.board-wrapper` painted bg ≥ 3.0 on every frame of every flip. The painted-stroke minimum is printed beside it and judged against its own geometric-mean bound (see R-3). | **RED**: min 1.00–1.21, 5–17 frames under 3 (census) | `--motion-hinge-dark: 0ms` → RED (the snap) · ink joins the dusk (B23 b) → RED (model min 1.008) · FAINT-INK (grid at opacity 0.15) → RED (Addendum A.5.3, existence is not visibility) |
| **G-T2 DERIVE** | vitest: the hinge recomputed from `index.css`'s `--color-card`/`--grid-line-color`/`--color-foreground` (both arms) and the dusk curve equals `MOTION.hinge` within 1 ms. springPop's crest abscissa equals 0.573 ± 0.002. | RED (no `MOTION.hinge`) | retune `--grid-line-color` dark to 70 % → RED |
| **G-T3 ONE BODY** | 0 frames with both bodies > 0.5 scale and > 0.5 opacity; 0 frames with any body, star or sparkle at opacity in (0.02, 0.98) | **RED**: 13 frames; ~100 ms translucent | restore the 100 ms `out` fade → RED |
| **G-T4 ONE CLOCK** | outgoing ≤ 0.5 at the page's half-swap (≤ 0.80 at +125 by the score); incoming first ≥ 1.00 within ± 60 ms of `.page-root`'s last change; crest printed | **RED**: 0.945 at half-swap | sink back on 340 `accelIn` → RED |
| **G-T5 FOLLOW** | outgoing accents visible (opacity > 0.5) on every frame the body is ≥ 0.8 | **RED**: gone by +125 at body 0.95 | restore the undelayed tuck → RED |
| **G-T6 BOIL** | the live body's resolved `filter` equals `url(#wobble-celestial-p{i})` with i equal to the rest stack's active pose on every gesture frame. Field steps: moon ≥ 4, sun ≥ 3. Hand-off painted Δ (live at identity vs rest, same pose): mean ≤ 0.5 and ≤ 1 % px > 16, both engines, both themes. `filterBudget` population 9, sampled at rest, hovered AND mid-gesture. | **RED**: Δ 1.86/2.69 mean, 5.0/3.0 % px > 16; 0 field steps | bind the live body to the base def → RED |
| **G-T7 SETTLE** | live scale at the hand-off 1.000 ± 0.005 on every flip, including under the 300 ms busy-loop injector at +100 (row 40's GB6 instrument) | **RED** (WebKit 0.936 seen once; to be born under the injector) | settle on `plush-land` alone → RED under the injector |
| **G-T8 PRM** | ink and paper change in the same frame, contrast never < 11 | **RED** on main (1.24 × 16 frames); VERB conforms | un-gate the hinge rule from `no-preference` → RED |
| **G-T9 FENCE** | after a tap in a witnessed hasTouch regime, the button's computed `transform` is `none` at settle + one beat. lint: every `:hover` in `DarkModeToggle.vue` is under `@media (hover: hover)`. | **RED** by source (`:728` unfenced); the painted read is owed (R-6) | remove the fence → RED |
| **G-T10 STALL** (GB1 kept) | no painted interval > 34 ms in +0…+900; incoming born ≤ 0.30; per-frame dS against **1.25 × the score's own peak step at the measured clock** (printed beside the census's absolute 0.08 — **a chair's row**, R-1) | RED (main cold 108–520 ms) | — |
| **G-T11 π** | at rest, both themes: the toggle's rest stacks, the board and every surface the mark doesn't name are computed-paint-property and tag identical to the HEAD control; goldens 4/4 unmoved (the rest bakes don't change) | green by design | a rest-pose byte plant → RED |
| lints | `check-copy-register`, `lint:motion`, `lint:verbs` (the rewritten beat table read back off each rule), `lint:bands` bare 0, `check-property-block` C1–C6 on the three new registrations, the undefined-token census (VERB's cured copy) | — | — |

---

## 7 · The wordmark and the chrome (couplings, not this group's default)

- **The page ground's hinge is the board's (117.9 / 89.1 ms vs 120.1 / 87.3).** One hinge serves any
  ink on the dusking grounds.
- **The wordmark (M21-b, row 37 BLOCKED).** Its ink is a theme-keyed bake, so it can't take a CSS step.
  The arm offered to W6/VERB: bake the OTHER theme's 4 wordmark poses at the first idle **after the boot
  draw-in settles** (never inside it, because that's M20's disease, census/drawin §mechanism 1), keep
  both theme stacks resident, and turn the flip into a one-frame opacity step at `--motion-hinge-*` on
  the same timeline. The cold flip then draws 0 (M21-b's gate). The costs are 4 bakes at boot idle and
  4 resident poses. This couples with G-DRAWIN, and the adjudicator routes it.
- **The chrome text** on the five grounds snaps at frame 1 today (light ink on a still-light page for up
  to ~118 ms, *model*). The same rule would cure it. The candidate row: extend the hinge to `color` on
  the five grounds' text, **measured first** (P1-W3's +23.5 fps was paid for continuous tweens; a
  discrete delayed step is one repaint, but the transition bookkeeping over every text node is
  unmeasured). It isn't in the default.

---

## 8 · Arms for the owner (U-10), on one payload

The Bloom's numbers are the owner's auditioned beats (VERB admitted the toggle as ONE character), so
the re-score is a frame pair, never a lane's choice.

- **Arm K (the firing default if the owner is silent): the numbers kept.** It keeps wring 340, bloom
  800 at 60, stars 560/640/720 and plush 1010, and it lands the hinge (P-ink), the boil (P3), the settle
  (P4) and the fence (P5). The outgoing accents tuck on the wring's `out` beat (240), not undelayed.
  Both fades become steps at their beat's end, which is a declared change to the `out` and `rise` rows.
  **What K leaves:** an opaque double exposure of ≈ 114 ms (moon > 0.5 from 156, sun > 0.5 until 270, *model*), the sun at 0.93 at the page's half-swap, and a crest 168 ms after the page. It fails
  G-T3's first clause and G-T4.
- **Arm R (proposed): §3 P1's score.** It passes G-T3 and G-T4 by construction. The price is the
  per-frame speed in §3's last two rows: incoming +55 %, outgoing ×2.
- **Frames:** chromium · light→dark and dark→light · 1280×800 · fine, and 390×844 · coarse (hasTouch),
  as painted-frame strips (row 40's recorder on a quiet box, M21-i), K above R, the same instants, one
  encoded board.
- **T9-B23 gains arm (c), the hinge,** as its proposed default, because (a) and (b) provably can't meet
  M21-c (§0). The chair renumbers.

---

## 9 · What DIES

1. The Bloom's opacity crossfades (`opacity 100ms … 240ms`, `opacity 300ms … 60ms`) → steps.
2. The undelayed outgoing star tuck (`.toggle-icon .twinkle-star, .dot-star` base transition).
3. The 340 ms `--ease-accelIn` wring on the toggle (accelIn loses a timing consumer, as VERB's `lift`
   row intends) → the `leave` rung on `--verb-lift-ease` (Arm R).
4. The 800 ms bloom and the 1010 ms `plush-land` with 85 % identity padding (Arm R).
5. The star stagger's own 80 ms → the house beat.
6. `onGestureEnd`'s plush-only settle, and the literals `1100` and `400` → derived.
7. `wobble-celestial` as a live consumer → `baseDef: false`. The filterBudget row's matcher → the pose
   ids (the chair's law-9 reading).
8. The false comments: "The Bloom itself is pure .is-active transitions and needs no gate"
   (`:624`), "Cleared on the plush-land animationend (the crest)" (`:624–625`), and useTheme's "page
   colour snaps" as the dusk's settled state (`useTheme.ts:35` block).
9. The unfenced `:hover` (`:728`).
10. The board ink's frame-1 snap (B23 a) and the joined-dusk arm (B23 b) as candidates for M21-c.

---

## 10 · Pass-7 charter rows (owning family in brackets)

1. **[MOT-VERB] the hinge**: `MOTION.hinge` derived + G-T2; the three registrations in the ONE block;
   the board-ink step rule under `html.theme-turning` at `!important` over `disableTransition`'s kill
   (the dusk's own pattern), `no-preference`-gated; G-T1 + G-T8, with the painted minimum beside the
   token (R-3). Depends on row 36 (A2 grid ink as CSS colour).
2. **[MOT-VERB] the Bloom score**: Arms K and R behind one const, framed (§8); G-T3/G-T4/G-T5/G-T10;
   the `@toggle-beats` table rewritten and read back by rule 8.
3. **[MOT-VERB] the boil**: P3 + G-T6; the filterBudget matcher (the chair's law-9 row).
4. **[MOT-VERB] the settle**: P4 + G-T7 under the injector (row 40).
5. **[MOT-VERB] the fence**: P5 + G-T9, painted in a witnessed coarse regime.
6. **[W6 / MOT-VERB, row 37] the wordmark at the hinge**: §7's pre-warm-after-boot arm, coupled with
   G-DRAWIN.
7. **[MOT-VERB, M21-a] WebKit**: an ablation, measured before any claim. Under `.is-turning` BOTH live
   filtered svgs stay `visibility: visible` for the whole gesture (the outgoing at opacity 0 after its
   cut). Hide the outgoing at its cut (`visibility` stepped on the same `leave` delay) and read WebKit's
   warm frames against the control, interleaved, on a quiet box. This is a hypothesis, not a cure. The
   `isDark` attribution stays the owner's Safari timeline (M19: no osascript).

---

## 11 · Risks and gaps (a gap is a gap)

- **R-1 (M09).** Arm R moves faster per frame: incoming +55 %, outgoing ×2 (*model*). Arm R reds the
  census's absolute dS ≤ 0.08 on the outgoing at 120 Hz (0.113), and both bodies at 60 Hz. Re-cutting
  dS relative to the score is a chair's row, not mine to pass myself. The owner's frame decides whether
  that's quality or speed.
- **R-2.** The hinge assumes the dusk's and the ink's transitions start in the same style-change event.
  vueuse's `disableTransition` force-flushes style inside the flip. If either engine starts them a frame
  apart, the worst frame drops from 3.11 to about 2.9–3.0 (one 8–17 ms frame off the hinge, *model*). This
  is unmeasured, and G-T1 reads it.
- **R-3 (painted ≠ token).** The grid strokes paint at partial opacity, so the painted hinge minimum will
  sit under the token's 3.11. For a thin sub-grid stroke, painted ≥ 3.0 may be arithmetically impossible
  at ANY schedule (the geometric-mean bound of its two painted rests). G-T1 therefore prints the painted
  minimum against that bound, and the chair rules the painted floor as a number.
- **R-4.** Coloured inks (crayon-blue user marks, the solver rainbow, peer inks) each have their own
  crossover. At the shared hinge their minima are lower and uncomputed here. G-T1 gates the grid and the
  foreground digits and prints the rest.
- **R-5.** On main alone (without VERB's row 36) the grid ink is a theme-keyed `<image>` href and can't
  take the step, so the hinge covers the digits only.
- **R-6.** The sticky hover is read from source. Whether Playwright's `hasTouch` tap reproduces iOS's
  sticky `:hover` is unknown, so the painted read may need the owner's device row (W8 RUNSHEET).
- **R-7.** Re-pressing mid-sink holds one beat before re-blooming (the born delay applies). It's
  unmeasured, and GA9's re-press row reads it.
- **R-8.** The star pops are spaced on the beat but not phase-locked to the global boil beat, so a star
  can pop between two pose flips.
- **Gaps.**
  - No lane server was run and no frame was painted. Every *model* number is arithmetic from tokens and
    curves.
  - No Safari or iOS (M19).
  - The dist is unmeasured.
  - n = 0 for every gate above until a prototype runs them.
- Nothing here retires T9-M21 or M15 (U-10). The owner disposes at the re-look.

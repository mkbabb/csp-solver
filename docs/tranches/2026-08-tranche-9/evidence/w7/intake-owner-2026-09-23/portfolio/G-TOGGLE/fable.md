# G-TOGGLE · fable — THE PAGE TURNS ONCE

Designer: Fable 5.1 (frontend-design skill invoked; two passes: plan → tell review → spec).
Designed against MAIN `1d0dc4fd`, the product the owner audited. Ground: `census/toggle/README.md`
§1–§7 + `handoff-static.json` (every number below is the census's unless marked *computed*),
the marks file (T9-M21 restating M15), W7 §13, R6 Motion laws 1–9 (law 1 is the drawer's and is
not entered), registry-v5 §13 (MOT-VERB 81, MOT-LADDER 76), pass-6 CHAIR-RULINGS Addendum A
(A.1.7 rate rows on driven clocks, A.5.3 existence is not visibility, A.5.7 two-photograph
minima), the 09-22 INTAKE §1 + rows 36–41 + ballots T9-B22/B23, and MOT-VERB's pass-5 bank
(`pass5.diff`: the rung ladder, the seven verbs, the `@toggle-beats` table admitted as a
character). Owning family for every charter row: MOT-VERB (§13), with MOT-LADDER for the rung
home and W6/W8 named where a row crosses the substrate.

## 0 · The thesis, in one sentence

**The page turns once: the sun lies flat, the light goes with it, the moon stands up into the
settled night and its stars come out on the crest—no frame holds two bodies, no frame paints
old ink on new paper, and the line boils the whole way through.**

The owner's word is "storybook", twice (M15: "shrinks the item and then teleports it"; M21:
"needs improvement"). The code's own metaphor is a pop-up piece that "rises out of the page and
sinks back into it" (`DarkModeToggle.vue:751–758`). What paints on main and on VERB's bank is
two bodies zooming through one centre with a translucent double exposure (13 frames, +182…+291),
a page that is 50 % dark while the sun is still at 0.945, a moon that crests as the page lands
and then performs for ~690 ms on a still page, a brown blot where the sun's last low-alpha
frames sit on the new ground, stars that leave 125 ms before their body moves, and a board that
blanks under 3:1 for 5–17 frames because its ink snaps while its paper dusks. VERB's bank cures
the STALL in Chromium (cold 16.6–23.4 ms, born 0.22) and none of the rest.

This design is not a new curve, a crossfade, a morph or a longer bloom. It's a SEQUENCE: the
three acts of a page turn put in order on rungs the ladder already has, three accessories
removed, and the live body given the rest stack's own pose fields so the pencil line boils
during the gesture instead of freezing on one field.

## 1 · Numbers first (the ground the design answers)

| reading (chromium 1280 fine warm unless stated) | main / VERB today | the design's target |
|---|---|---|
| double exposure: frames with both bodies > 0.5 scale and > 0.5 opacity | 13 (~100 ms, +182…+291), both trees; webkit 2–8 | 0 by construction: the incoming is born the frame the outgoing is flat |
| outgoing scale at the page's half-swap | 0.945–0.947 at opacity 1 | ≤ 0.5 (*computed* 0.52 at +200 with the half-swap at +280) |
| the incoming's crest vs the page's last change | crest +524…+546, page lands +333…+371 | crest +548 vs landing +500 (*computed*): +48 |
| the gesture after the page has settled (hand-off − landing) | ~690 ms (hand-off +1024…+1046) | ~450 ms (last star lands +948, hand-off on its `transitionend`) |
| outgoing body's last visible frames | scale 0.21–0.33 at opacity 0.03–0.13 (the brown blot) | opacity 1 on every visible frame; scale → 0, nothing to fade |
| outgoing accents | stars gone by +125 while the body is at 0.95 | accents ride the fold inside `.warp`; no separate tuck |
| board ink vs `.board-wrapper` during the flip | min 1.00–1.21, under 3:1 for 5–17 frames, both trees, both directions; main PRM cold 1.24 × 16 frames | ≥ 3:1 on every frame, PRM included |
| live body's field steps per gesture | 0 (one static field, `wobble-celestial` 0.02) | on its band: sun every 2 beats, moon every 1.5, through `wobble-celestial-p0…p3` |
| hand-off field jump, live at identity vs rest pose 0 (painted, button box) | mean Δ 1.86 light / 2.69 dark; 5.0 % / 3.0 % px > 16 (30–60 % of a boil step) | mean Δ ≤ 0.5, ≤ 1 % px > 16, both engines, both themes |
| live scale at the hand-off | 1.000 except one WebKit snap at 0.936 (cleared by `plush-land`'s `animationend`) | 1.000 ± 0.005 on every flip, stall included (cleared by the bloom's own `transitionend`) |
| cold flip, chromium | main 108.6–109.2 ms, born 0.48–0.51; VERB 16.6–23.4, born 0.22 | VERB's number, kept (M21-b's wordmark half carried) |
| cold flip, webkit | main 334–520 ms single frame, born 1.00–1.09; VERB 69–147, dS 0.44 | M21-a, carried RED, not claimed here |
| PRM | page cut atomic on VERB, main's ink lands at +470; the toggle's 200 ms crossfade on both | everything cuts on one frame, toggle included |

## 2 · Pass one: the plan (tokens · type · layout · principles)

Colour, type and layout are not this group's axes: the turn mints no colour, no string, no glyph,
and moves nothing that isn't the toggle's own gesture and the board's ink during the turn. The
plan's tokens are motion tokens; the layout is a z-order the code already has.

**Tokens (values).**
- Rungs, VERB's ladder, published as `--motion-<rung>` under the @property law (registered in
  `index.css`'s first block, `syntax: '<time>'`, `inherits: true`, `initial-value: 0ms`—absence
  reads as reduce, the visibly-failing initial): `whisper` 150 · `note` 250 · `dusk` 350 ·
  `throw` 520. No new number joins the ladder.
- The beat: `MOTION.beatMs` 125; the bands `MOTION.bands.sun` 2 / `moon` 1.5 (R6 law 8).
- Curves, all existing: `MOTION.verbs.lift.ease` `cubic-bezier(0.32, 0, 0.67, 0)` (the fold);
  `MOTION.verbs.dusk.ease` `cubic-bezier(0.25, 0.1, 0.25, 1)` (the page, VERB's verb untouched);
  `--ease-springPop` `cubic-bezier(0.34, 1.56, 0.64, 1)` (the stand-up, the owner's auditioned
  spring); `--ease-anticipatePop` `cubic-bezier(0.68, −0.55, 0.265, 1.55)` (the stars, kept);
  `--ease-standard` (the incoming's opacity, kept).
- The character's own kept numbers (auditioned, VERB's `characters` class): the press
  `toggle-squash` 120 ms; the launch pose `scale(0.06) rotate(12deg) translateY(6px)`; the fold's
  twist −15°; the crest 1.092 (springPop's own). One geometry change: the fold ENDS at `scale(0)`,
  not 0.06—a folded piece is flat.
- Fields: `wobble-celestial-p0…p3` at baseFrequency 0.0185 / 0.023 / 0.017 / 0.0215
  (`wobblePoseFrequencies`), the rest stack's own; the base `wobble-celestial` def gains
  `baseDef: false` (0 consumers after this).
- Ink that joins the page: `--grid-line-color` (light `hsl(0 0% 15%)`, dark `hsl(48 10% 80%)`),
  `--color-pencil-graphite`'s consumers in `gameCell.css:31/190`, `--color-user-ink` (`#2563eb` /
  `#60a5fa`)—the board's ink set, no wider. The five grounds stay the five (`index.css:661–671`).
- Palette: `MASCOT_COLORS.celestial` verbatim (sun `#E88845`/`#D16A32`/`#F09855`/`#F0B030`/
  `#FDE68A`/`#D99A10`; moon `#FFF4AA`/`#E5C74D`). Nothing is re-tempered.

**Type.** None. The control's only text is its accessible name.

**Layout.** Unchanged: `.sun-moon-toggle` is the keep (`--toggle-hit` 2.75rem, `border-radius:
50%`), the ornament bleeds by `--toggle-bleed`, the live pair sits over the rest stacks, the
focus ring traces the ornament. W2's tap floor, hover 1.08 on fine pointers, the ring—π.

```
  t  0        150        250   280        500   548   673   798   948
     |press   |flip     |flat |half-swap |page |crest|star |star |star
     |========fold (lift, note)==|
                |==========page (dusk ease, dusk)==========|
                            |=========stand-up (springPop, throw)=====|
                                                    |=star|=star|=star|
     sun visible ─────────── ✕ moon visible ────────────────────────────▶
```

**Principles.**
1. One body on stage at a time. The incoming is born the frame the outgoing is flat.
2. The light goes with the fold and lands before the crest. The page's half-swap falls after the
   outgoing is under 0.5 and before the incoming is over 0.5.
3. Ink is on paper. Whatever the board's paper does on the turn, its ink does on the same
   declaration.
4. A folded piece is flat, not translucent. Nothing on the outgoing fades.
5. Accents are drawn on the piece. They fold with it and pop after the night has fallen.
6. Pencil is a live field. The live body steps the rest stack's fields on its band; the two
   hand-offs are field-identical.
7. Every length is a rung or a beat; every curve is a verb's or the character's kept one. No
   literal in the SFC, no number typed twice.
8. PRM is a cut, the toggle included.

## 3 · Pass two: the tell review

The generic answer to "improve a dark-mode toggle animation" is one of: a sun→moon morph, a
180° sweep, a crossfade, a longer or bouncier spring, a colour-tinted glow. Working the prompt
cold, I'd have reached for the crossfade first (it hides the double exposure by making it the
design) and the longer bloom second. Both are refused here: the crossfade contradicts principle
1 and the pop-up metaphor the owner's word names; a longer bloom lengthens the ~690 ms tail the
census calls out. What survived the review:

- **The spring overshoot is a generic tell** in the abstract, but the brief pins it—springPop is
  the owner's auditioned curve and R6's "icon / toggle pop" row. Kept; its LENGTH moves to a
  rung, and that move is the one the owner's frame decides (§6).
- **Staggered stars** are a default too; the owner auditioned them. Kept, re-clocked to the beat
  (one beat apart, not 80 ms) so the toggle speaks the page's grammar.
- **Chanel's mirror:** three accessories removed rather than one—the outgoing's 100 ms fade, the
  stars' undelayed tuck, the ±4 % plush tail (the census: under the threshold of notice at 390).
  Each removal cures a census row (the blot, the leading accents, the tail on a still page).
- **What I changed after the review:** the first draft delayed the DUSK by a rung with
  `transition-delay` and left the flip at click. That lengthens every non-joined ink's crossing
  (the card's text, the wordmark) from ~100 ms to ~300 ms—a page-wide washout to cure a board
  one. Replaced by delaying the FLIP itself one `whisper`, so every snapping surface snaps at the
  page's own start as it does today and only the board's ink is asked to join.
- **What I refused:** a hinge fold (`scale(1, 0)` about the foot) is the pop-up book's literal
  mechanism and would read unmistakably, but it's a FORM change beyond the mark's sentence and
  the owner auditioned the wring's geometry. Named in §6 as a frame the owner may ask for, not
  built.

## 4 · The spec

### 4.1 Components and states

`DarkModeToggle.vue` stays one `<button>` with two live filtered bodies and two baked rest stacks.
States:

| state | what paints | how it's entered / left |
|---|---|---|
| rest, light | the sun's rest stack, pose on `sunFrame` (÷2) | `!turning` |
| rest, dark | the moon's rest stack, pose on `starFrame` (÷1.5) | `!turning` |
| pressed | `toggle-squash` 120 ms (kept) | click; `.is-turning` |
| turning · fold (0…250) | the outgoing live body folds: `scale(1)→scale(0)`, `rotate(12deg→−15deg)`, `translateY(6px)`, on `lift` for `note`; its stars and sparkles ride inside `.warp`; opacity 1 throughout | `.is-turning .toggle-icon:not(.is-active) .warp` |
| turning · flip (+150) | `toggleDark()` fires one `whisper` after the click; `html.dark` lands; every non-joined surface snaps here | `setTimeout(toggleDark, MOTION.rungs.whisper)` |
| turning · page (150…500) | the five grounds AND the board's ink set transition `background-color`/`color` on `dusk` for `dusk` | `html.theme-turning` (armed at click, cleared at whisper + dusk + one beat) |
| turning · stand-up (250…770) | the incoming live body `scale(0.06)…→ none` on springPop for `throw`; opacity 0→1 on `--ease-standard` for `whisper` from +250; crest 1.092 at +548 | `.toggle-icon.is-active .warp`, delay `note` |
| turning · stars (548 / 673 / 798, each `whisper`) | stars and sparkles pop from 0.2/0 to 1/1 on anticipatePop; delays = `note` + crest + k·`beatMs` | `.toggle-icon.is-active .twinkle-star(-2/-3)`, `.dot-star` |
| settle | `turning` clears on the LAST `transitionend` among the incoming's warp `transform` and the last star's `scale`; the rest stacks take back over at a field-identical pose; a timer backstop at the table's length + one beat | `onTransitionEnd` (was `plush-land`'s `animationend`) |
| re-press inside the whisper | the pending flip is cancelled; the fold retargets home; net zero flips | `clearTimeout(flipTimer)` |
| re-press after the flip | as today: pure transitions retarget, a fresh flip queues one whisper out, the backstop extends | — |
| hover (fine) / focus-visible | unchanged (`scale(1.08)` on `--motion-leave`; the ring traces the ornament) | π |
| PRM | the flip at +0, no whisper; `html.dark`, the five grounds, the board's ink and BOTH rest stacks change on one frame; no crossfade, no transforms, no stars | `prefers-reduced-motion: reduce` |
| held (the laminate's boil hold) | the live body stays on its held field; the sequence still plays | `heldFrameCount` ≤ 1 |

### 4.2 Motion, as one table (the character's home)

The eleven values VERB admitted as `@toggle-beats` become this table, homed ONCE in
`pencilConfig`'s `MOTION.characters.storybook` as rung NAMES and beat counts, published to the
SFC as `--storybook-*` by the same publisher that emits `--motion-*` (the `--draw-dur`
precedent: bound at the consumer, the CSS reads the binding, never a literal). VERB rules the
exact member shape; the content is:

| act | selector | property | length | delay | curve | fill |
|---|---|---|---|---|---|---|
| press | `.sun-moon-toggle.is-turning` | `scale` (keyframe) | 120 (character, kept) | 0 | `ease-out` → springPop (kept) | both (allowlisted today) |
| fold | `.is-turning .toggle-icon:not(.is-active) .warp` | `transform` | `note` 250 | 0 | `lift` | none |
| flip | JS | `toggleDark()` | — | `whisper` 150 | — | — |
| page | `html.theme-turning` × the five grounds + the board's ink set | `background-color, color` | `dusk` 350 | 0 (from the flip) | `dusk` | none |
| born | `.toggle-icon.is-active` | `opacity` | `whisper` 150 | `note` 250 | `--ease-standard` | none |
| stand-up | `.toggle-icon.is-active .warp` | `transform` | `throw` 520 | `note` 250 | `--ease-springPop` | none |
| stars k = 0,1,2 | `.toggle-icon.is-active .twinkle-star(-k)`, `.dot-star` | `scale, opacity` | `whisper` 150 | `note` + 298 + k·`beatMs` (298 = springPop's crest fraction 0.573 × `throw`, *computed in TS from the curve, never typed*) | anticipatePop / `--ease-standard` | none |
| settle | JS | `turning = false` | on the last `transitionend` | — | — | backstop = table length + `beatMs` |
| theme-turning off | JS | class removal | `whisper` + `dusk` + `beatMs` | — | — | — |

Curve arithmetic (*computed*, to be measured by the lane): on `lift` the fold's progress is
≈ (t/250)³, so the outgoing is at 0.52 at +200, 0.25 at +232, 0 at +250; its last frames step up
to 0.19/frame at 60 Hz (today's 0.115 on accelIn/340)—a small dot slamming flat. The page's
half-swap on `ease` is +280; it lands at +500. springPop over 520 from +250 crests at t = 0.573
(+548) at 1.092 and settles at +770; its FIRST frame at 60 Hz steps 0.13 (today's 800 steps 0.087
at 60 Hz—the census's 0.04 is the same curve read on a 128 Hz headless clock, chair A.1.7).
The rate at the launch is 8.3 scale-units/s against today's 5.4; that is the price of landing
the crest with the page, stated once in §6.

### 4.3 Pencil character (M21-f)

The live `<svg>`'s `filter` attribute becomes gesture-bound: `url(#wobble-celestial-p${frame})`
with `frame = sunFrame` for the sun and `starFrame` for the moon—the exact pose the rest stack
would show on that beat, so the click hand-off and the settle hand-off are field-identical by
construction (geometry already is: `gestureBound` reads the same tables). The swap re-rasters
the filter, which the in-filter warp already does every gesture frame: zero marginal paint, and
the live population stays two bodies, one filter each—filterBudget 9 exact, both directions
(R6 law 9; the allowlist row for the live pair is re-pointed from `#wobble-celestial` to
`#wobble-celestial-p*`, a gate edit, not a growth). The moon's body, which carries no pose
geometry, boils through the field like its rest stack does. `wobble-celestial`'s base def has
no consumer left and gets `baseDef: false` like `wobble-logo`; the soul-gate A/B's base-def
injection reads the pose defs instead (a gate edit; §6 names the risk).

### 4.4 The board's ink joins the page (M21-c, T9-B23 arm b, scoped)

Under `html.theme-turning`, the SAME declaration the five grounds carry is added to the board's
ink set: on VERB's tree `div.grid-ink` (`background-color`), the cell rules at
`gameCell.css:31/190` and the user/given ink (`color`/`fill`), no wider—`transition:
background-color var(--motion-dusk) var(--verb-dusk-ease), color …, fill … !important`, the
narrowing rule's shape. Paper and ink then cross their midpoints on one curve and the contrast
never leaves its rest band (14.87 light / 11.99 dark). Price: the masked grid layers repaint
per frame for 21 frames; to keep it to ONE layer the beat is HELD for the turn's page window
(the boil-hold contract `heldFrameCount` already freezes the pose in place for the laminate; the
turn is a second holder, `whisper + dusk` long). The digits are 81 small text repaints per frame.
The rate gate at 390 coarse is G13; if it reds on a phone the row stays RED and goes to W6/W8
with the number—there is no cheaper arm that doesn't put old ink on new paper (a second resident
ink stack for an opacity crossfade doubles the raster union, R6 law 12; cutting the board while
the page dusks paints a dark board on a light page for a third of a second).

### 4.5 Copy (M16)

Zero delta. The accessible name stays `Switch to dark mode` / `Switch to light mode`, plain,
and now flips at +150 with the theme (at +0 under PRM). `check-copy-register` bare; the
rendered-string census reads 0 moved.

### 4.6 Desktop and phone

Same component, same table. What differs is measured, not designed: the ornament's box
(`--toggle-size` at each viewport; the keep is 2.75rem everywhere, W2's tap floor untouched), so
the fold's last-frame step is a smaller dot on the phone; the ink-join's repaint area (the grid
is smaller at 390 but the box is slower—G13 is a phone gate first); coarse rows run
`hasTouch: true`, tap not click, and the squash is the tap's feedback. Hover is fine-pointer
only. 1440×900 and landscape are unmeasured by the census and stay so here (§6).

### 4.7 Light and dark

The sentence is the same in both directions, mirrored: dark→light folds the moon (its stars
ride the fold), brightens the page on the same `dusk` verb (a dawn on the dusk's curve—the verb
owns one curve and this design doesn't give it a second), stands the sun up and pops its
sparkles on the crest. Both directions carry the same gates; the census measured both and the
design's frames show both.

### 4.8 What dies

- The outgoing's opacity fade (`out` 100 ms @240) and the brown blot with it.
- The outgoing accents' undelayed 150 ms tuck (and `--ease-starTuck`, VERB's mint for it).
- `plush-land` (860–1010, ±4 %) and `onGestureEnd`'s `animationName` check; `turning` is cleared
  by `transitionend`.
- The 60 ms / 240 ms / 560-640-720 ms / 800 ms / 300 ms / 100 ms literals in the SFC; the
  `@toggle-beats` comment table (its content moves to `MOTION.characters.storybook`).
- The static `wobble-celestial` base def as a live consumer (`baseDef: false`).
- The PRM 200 ms crossfade on `.toggle-rest` (`--ease-prmFade` loses its consumer).
- The wring's park at `scale(0.06)` as the OUTGOING's end pose (the launch pose keeps it).
- The comment "rises out of the page and sinks back into it" is finally true and is rewritten to
  say what paints.

## 5 · Born-RED gates (RED on main by the census's own instrument, measured its way: both engines · both directions · cold and warm · 1280 fine + 390 hasTouch · one encoded `?board=` payload)

| # | gate | on main today |
|---|---|---|
| G1 | 0 frames with both bodies at opacity > 0.02 (rAF sampler AND painted frames) | 13 frames, both trees |
| G2 | outgoing scale ≤ 0.5 at the page's half-swap (the first frame `.page-root`'s ground is past its midpoint) | 0.945 |
| G3 | hand-off − page landing ≤ `throw` 520; crest − landing ∈ [−60, +250] (the second half is GREEN on main at 150–210 and is a HOLD, not a born-RED) | ~690 |
| G4 | outgoing opacity = 1 on every visible frame; scale monotone non-increasing to < 0.02; 0 frames with opacity ∈ (0.02, 0.2) at scale > 0.25 | 0.03–0.13 at 0.21–0.33 |
| G5 | outgoing accents at opacity ≥ 0.9 and scale 1 (inside the warp) on every frame the body is ≥ 0.8 | gone by +125 at body 0.95 |
| G6 | grid token AND digit ink ≥ 3:1 vs `.board-wrapper` on every frame of every flip, PRM included; painted bytes on the phone rows (two photographs, A.5.7) | 1.00–1.21 for 5–17 frames; PRM cold 1.24 × 16 |
| G7 | the live body's `filter` id steps on every beat boundary it's visible for, count within ±1 of ⌊visible ÷ (band × 125)⌋, both bodies; hand-offs live-vs-rest at the same pose mean Δ ≤ 0.5 and ≤ 1 % px > 16, painted, both engines, both themes | 0 steps; Δ 1.86 / 2.69 |
| G8 | live scale at the hand-off 1.000 ± 0.005 on every flip, including under a 300 ms busy-loop stall injected at +100 (GB6's injector) | 0.936 seen; `animationend` is the wrong clock |
| G9 | PRM: 0 movers on the toggle and the page; exactly 2 distinct values per sampled property; ink and paper change on one frame; contrast never < 11 | main's ink lands at +470; both trees' toggle crossfades |
| G10 | `lint:verbs` bare on the SFC and the dusk rule; 0 timing literals outside `MOTION` (the press's 120 declared in `characters`); the star delays derived from the curve in TS, not typed | 11 literals |
| G11 | π: computed paint properties + tags at rest on every surface the mark doesn't name vs the HEAD control, both themes, 1280 + 390, 0 moved; filterBudget exactly 9 at rest, hovered and DURING the turn; raster union ± 2 % during the turn; goldens unmoved | must read 0 |
| G12 | `check-copy-register` bare; rendered-string delta 0 | holds (a planted string is the negative control) |
| G13 | rate: 0 frames > 34 ms in +150…+500 at 390 coarse both engines during the ink-join, on a quiet box (M21-i's recorder self-test beside it); the beat held for the page window (pose id constant across it) | not measurable on main (no join); RED by construction if the hold isn't honoured |
| G14 | `html.dark` lands at `whisper` ± 1 frame after the click; at +0 under PRM; a second press inside the whisper leaves the theme where it was | +0 always |
| G15 | M21-a carried: WebKit cold 0 frames > 34 in +0…+1100, born ≤ 0.30; RED on VERB (69–147 ms, dS 0.44), not claimed by this design | 334–520 |
| G16 | M21-b carried: 0 draws in +0…+1100 on the first flip into each theme (the wordmark half, row 37) | 8 main / 4 VERB |

Rates are per second; per-frame steps are read against the curve's own predicted step at the
frame's Δt (a stall is a step OFF the curve, not a steep curve), with the 60 Hz precondition
arm of chair A.1.7. Every gate is a shell battery run in the background with a log, chunked by
engine.

## 6 · Gaps, risks, ballots (unoptimistic)

- **The re-time is the owner's, not a lane's.** The Bloom's beats are the owner's auditioned
  values (T3-W13, VERB's table); the census says any re-time is a U-10 frame pair. This design
  IS a re-time (fold 340→`note` 250, stand-up 800→`throw` 520 delayed to +250, stars on beats).
  **Ballot T9-B-TOGGLE-1:** (a) DEFAULT for the fold, VERB's beat table verbatim with only the
  removals of §4.8 and the field stepping of §4.3 (no double-exposure cure, no light-with-fold);
  (b) the page turns once, this table. One class, one payload, frames at chromium · light→dark
  and dark→light · 1280×800 fine and 390×844 coarse, eight stills at the same t per arm.
- **The stand-up's length is the one number that costs something.** `throw` 520 lands the crest
  48 ms after the page (*computed*) at a launch rate of 8.3 units/s; the kept 800 lands it 208 ms
  after at 5.4 units/s and pushes the sentence to ~1.1 s with ~600 ms on a still page (the
  census's complaint, softened not cured). The default is 520 because M21-d's own criterion is
  met only there; the pair is in the ballot's frames.
- **The ink-join's price on the phone is unmeasured.** 21 frames of masked-layer repaint at
  390 coarse; one layer if the beat is held, four if not. The hold seam is pencil-boil's
  `heldFrameCount` and whether the app can raise a second holder for 500 ms is unverified. If
  G13 reds, the row is RED and goes to W6/W8 with its number; there's no cheaper lawful arm.
- **Delaying the flip moves WebKit's unattributed `isDark`-path cost** from the fold into the
  stand-up, where the eye is. VERB's WebKit residue (M21-a) is carried RED; a stall in the
  stand-up freezes the moon mid-rise exactly as it freezes the sun today. The wordmark's 4 cold
  draws (M21-b) land at +233…+325 instead of +83…+175—inside the moon's rise until row 37 lands.
- **`scale(0)` inside a filter input** may give WebKit a zero bbox for the filter region on the
  last frame (a flash or a dropped frame). The fallback is `scale(0.001)`; the lane measures the
  last two frames in both engines before choosing.
- **The base def's retirement** touches the soul-gate A/B's single-field injection (the script
  comment at `DarkModeToggle.vue:185` names it) and `filterBudget`'s allowlist row. Both are
  gate edits with negative controls, and either can be left as-is (the base def costs nothing
  unconsumed) if the soul gate can't be re-pointed in the pass.
- **Everything not joined still crosses for ~100 ms** on the page's front-loaded `ease`: the
  card's text, the wordmark, the notes. Same as today, unmeasured by the census beyond the
  board, and not claimed cured. A frame pair with the dusk on `lift` (light leaves as the piece
  does; the half-swap at +250) exists on paper and is refused here because it doubles that
  crossing for every non-joined surface.
- **Not measured, still:** a re-click mid-flight (G14's whisper case is new), hover on a fine
  pointer while the toggle turns, 1440×900 and landscape, the gallery view, forced colours, and
  no real Safari or iOS (M19). Every WebKit number is headless Playwright's proxy.
- **T9-B22 disposition:** this design needs arm (a) (the warp inside the filter); the compositor
  flight sheet (b) rasters the body and a raster cannot step fields, so (b) and M21-f are
  exclusive—the ballot text should say so. **T9-B23:** arm (b), scoped to the board's ink set,
  with the hold; (a) as measured is a ~100 ms board blank, not a snap.
- The hinge fold (`scale(1, 0)` about the foot, the pop-up book's literal mechanism) is a form
  the owner may ask for at the re-look; it is not built and not framed.
- Nothing here retires T9-M21 or M15 (U-10). The owner disposes at the re-look.

## 7 · Charter rows for pass 7 (owning family named)

| row | family | the sentence | gate |
|---|---|---|---|
| P7-M21-1 | MOT-VERB | the sequence: fold on `lift`/`note` to `scale(0)`, the flip one `whisper` late, the stand-up on springPop/`throw` from `note`, born on `whisper`; the fade, the tuck and `plush-land` deleted; both arms of T9-B-TOGGLE-1 built in one class and framed | G1 G2 G3 G4 G5 G14 |
| P7-M21-2 | MOT-VERB | the live bodies step the rest stack's fields on their bands; hand-offs field-identical; `wobble-celestial` base def retired; the allowlist row re-pointed | G7 G11 |
| P7-M21-3 | MOT-VERB × W6/W8 | the board's ink joins the page on the grounds' own declaration; the beat held for the page window; the rate read on the phone first | G6 G9 G13 |
| P7-M21-4 | MOT-VERB | the settle on the bloom's `transitionend` with the derived backstop; the stall injector as the row's control | G8 |
| P7-M21-5 | MOT-LADDER × MOT-VERB | `MOTION.characters.storybook` as the one home (rung names + beat counts + the crest fraction computed from the curve), published as `--storybook-*`; `lint:verbs` bare on the SFC | G10 |
| P7-M21-6 | MOT-VERB | PRM: the toggle's crossfade cut; the whole page one frame | G9 |
| P7-π | MOT-VERB | π + goldens + filterBudget during the turn + raster union + copy delta on the merged §13 tree, both themes, both viewports | G11 G12 |
| carried | W6 / MOT-VERB | M21-a (WebKit's `isDark` path attributed to a function), M21-b (the wordmark half), M21-i (the recorder on a quiet box) | G15 G16 |

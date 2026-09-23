# G-DRAWIN · fable — ONE PENCIL

Designer: Fable 5.1 (frontend-design skill invoked; two passes: plan → tell review → spec).
Designed against MAIN `1d0dc4fd`, the product the owner audited on :3001. Ground: `census/drawin/README.md`
+ `series/summary-*.json` (every number below is the census's; nothing re-measured here, the box was at
load 139–224 and the census says so), the marks file (T9-M20), W7 §13, R6 Motion laws 1–8 and paint laws
9–16, registry-v5 §1 (§13 MOT-VERB 81 · accent ACC-FIVE 83 · MOT-LADDER 76), pass-6 CHAIR-RULINGS
Addendum A (A.1.7 the 60 Hz precondition, A.5.3 existence is not visibility, A.5.7 two-photograph minima,
A.6 the forced end-write), the source at `HandDrawnGrid.vue`, `usePathAnimation.ts`, `HandwrittenLogo.vue`,
`HandwrittenGlyph.vue`, `GameBoard.vue:966–977`, `useGameState.ts:610`, `scene.css:608–618`,
`pencilConfig.ts:110–197, 478–507`, pencil-boil 0.11 `vue.js:684–702` and `easings.js`.
Owning families for the charter rows: MOT-VERB (the boot's verbs, §13), MOT-LADDER (the rungs and the
presets' home), ACC-FIVE (the front primitive — the hand clock is a front law), with the substrate rows
(pencil-boil 0.12.1, W6/W8) and one W1 mechanics row (the boot deal) named as crossings.

Correction carried from the census: `frontGate` is NOT on main (`grep frontGate|FRONT_MIN` empty at
`1d0dc4fd`); it is ACC-FIVE's primitive on ACC-FIVE's tree. This spec designs against main and names the
primitive as the HOME the hand clock lands in when the section folds, never as a thing main has.

## 0 · The thesis, in one sentence

**One pencil: the boot is a single hand ruling the page one line at a time — each line lands as the last
one lifts, at a hand's bell velocity with a faint graphite lead, drawn through the grain from its first
frame, on a clock that counts painted frames so a late frame delays the hand and never teleports it — and
nothing bakes while the pencil is on the paper.**

The owner's sentence has two halves and the census gives each a mechanism. "Not smooth" is a wall-clock
tween whose window every boot bake lands inside (4 of 4 grid poses in 36 of 36 motion runs; chromium's
worst painted frame moves one line 72–76 %, WebKit's 100 % with 3–16 of 17 lines never seen partial).
"Not pencil-like" is everything the census reads from the code: a 3×-mean launch (easeOutCubic, the
wordmark easeOutQuint at 5×), fifteen fronts live at once, a full-width round-cap tip, no grain until a
one-frame step at the handoff, and a rectangle sliding off typeset letters. The design is not a new curve
on the same machine. It is a law about what a hand is allowed to do on the page (one front, a bell, a lead,
a bounded step), a law about what the page is allowed to do under the hand (nothing that rasters), and the
order that follows from both.

## 1 · Numbers first (the ground the design answers)

| surface · cell | today on main (census) | the design's target |
|---|---|---|
| grid draw, chromium d cold light | frozen 200–226 ms; worst one-frame Δ 72–76 %; 38–40 painted frames in 557 ms; 4/4 bakes inside; 15 fronts live | 0 encode tasks inside any stroke; worst one-frame Δ ≤ the cap (23 % frame side, 12 % subgrid, 20 % cell); fronts live ≤ 2 |
| grid draw, chromium d cold dark | frozen 309–386; Δ 87–88 % | same targets (the dark pose-0 bake is 66–82 ms and lands BEFORE the hand) |
| grid draw, WebKit d cold light | frozen 385–446; Δ 100 %; 5–16 lines never partial | Δ ≤ cap; every line seen partial (≥ 4 painted frames per line at 60 Hz for a 150 ms cell: 9) |
| grid draw, WebKit d cold dark | swallowed whole (one sample at 477 ms, the next at 1115 on the steady layer) | the draw is SEEN: ≥ 60 painted frames over the hand's 2.36 s |
| ABLD (grid bake held past the draw) | frozen 33–58, Δ 26–33 %, wordmark Δ 16–24 — the residual is the wordmark's 8 poses | the design moves BOTH bakes out (pose 0 before, the rest after) — ABLD is the design's lower bound, not its ceiling |
| launch profile, every tier | easeOutCubic: 48.8 % of the line at 20 % of the time, peak 3.0× mean | easeHand (minimum-jerk): 5.8 % at 20 %, 50.0 % at 50 %, peak 1.875× mean |
| wordmark | 1.2 s easeOutQuint clip wipe, 50 % at 155 ms then a 757 ms creep; hard vertical edge cuts "sud\|" (crop 2); live filter → bitmap swap mid-wipe (lb=4 at 393–431 ms) | a 520 ms rubbing on the hand clock, slanted feathered front ≥ 0.35 em, over the RESIDENT pose 0 — no live filter ever paints on the boot |
| handoff | unfiltered crisp → grain in one step 27–38 ms after the last line; WebKit lands on the LIVE filter (sl=4) 0.4–0.75 s | no handoff: the thing drawn IS pose 0 through a mask; ink statistic Δ ≤ 1/255 between the last drawing frame and the first settled one |
| PRM | a cut, but the live grain filter paints 759–793 ms chromium, > 5 s WebKit before the bake | a cut to pose 0 the frame it is resident (~150–300 ms); paper until then; 0 live-filter frames |
| boot deal | erases a DRAWN grid and redraws (screencast: drew 51→718, erased 917→1126, drew again 1141); :3001 deals at 843–1212 ms | the boot's first deal never turns the page: 0 erase states before the first user act |
| chrome | fade 250 ms `--ease-drawOn` +150 from MOUNT | verbatim numbers; keyed to the frame's first stroke so the grid leads and the chrome follows (F6's own sentence) |
| the tempo (chromium d, from the hand's first stroke) | grid done at ~0.56 s; last given ~1.5–1.76 s | QUICK HAND (default): grid's last lift 2.36 s, last given ~3.4 s · STRICT HAND (ballot arm): 3.10 s / ~4.1 s |

The last row is the price and it is stated as such (§8). M09 is honoured in both directions: the hand buys
no speed with quality (no shorter line than the hand can draw, no teleport) and no quality with speed
(nothing is slowed for decoration — every millisecond is a line being drawn).

## 2 · Pass one: the plan (tokens · type · layout · principles)

Colour and type are not this group's axes: the boot mints no colour, no string, no glyph. The settled page
is π (the same four poses, the same cacheKeys, the same SVG bytes). The plan's tokens are motion tokens
and one mask token; the layout is an ORDER.

**Tokens (values).**
- `MOTION.hand.lift = 0.6` — the raw time at which the hand lifts from a line and the next line lands.
  On the bell, 68.3 % of the line is drawn at the lift; the decelerating tail of one stroke overlaps the
  accelerating head of the next, which is what a hand does between strokes. Never more than two fronts
  live (the third would start at 1.2 D > D). NEW, in pencilConfig (R6 law 4's home); a ratio, not a time.
- `MOTION.hand.lead = 0.04` — the faint lead: the front's leading 4 % of the line is graphite arriving
  at `MOTION.hand.pressure = 0.45` of full ink (the mask's second stroke, §4.3). Ratios, pencilConfig.
- `MOTION.hand.stepMs` = ACC-FIVE's `FRONT_MIN_MS` (16) — the hand clock's cap: one painted frame
  advances a stroke's clock by at most one front quantum. NOT a new literal: the front law's own
  number, read from the primitive when §3 folds; until then the presets carry no cap (§7 row order).
- `DRAW_IN_PRESETS.gridFrame.duration 350 → 520` (throw), `gridSubgrid 280 → 250` (note),
  `gridCell 200 → 150` (whisper), `glyph 350` (dusk, UNCHANGED), `logo 520` (throw, RESURRECTED — the
  preset died as dead config because the logo wiped instead of drawing; it now has a consumer). Every
  number is a rung of the banked map {whisper 150, leave 200, note 250, dusk 350, step 440, throw 520,
  rise 520}; the presets read `MOTION.rungs.<name>` once LADDER's map lands and carry the literal until
  then (§13 folds first — registry-v5 §2's order).
- `timing: "easeHand"` on gridFrame/gridSubgrid/gridCell/logo — `easeHand = 10t³ − 15t⁴ + 6t⁵`
  (minimum-jerk), added to pencil-boil's roster beside easeOutCubic (`resolveEasing("easeHand")`).
  The glyph preset keeps `easeOutCubic` (the deal's wave is ratified; §4.6).
- `stagger`, `jitter`, `baseDelay` on the three grid presets DIE (30/20/0 · 25/25/150 · 10/15/300 are the
  machine sweep's numbers; the hand's timing is the lift). The `mulberry32(77)` jitter RNG dies with them.
- `--rub-feather: 0.35em` — the wordmark rubbing's front width, declared in the first static stylesheet
  beside the `--ease-*` ledger (a length, not a timing; theme-invariant). No `var()` fallback.
- Filter budget: 9, unchanged. Masks and gradients are not filters (law 9 census rows unmoved).

**Type.** None. Zero rendered-string delta; `check-copy-register` bare unchanged. The boot says nothing
and the M16 register has nothing to say.

**Layout — the order (one pencil, top to bottom, reading order).**

```
t≈0        first paint: paper, case. fonts.ready → wordmark pose 0 (≈55 ms) → grid pose 0 (≈50 ms)
           two encodes, back to back, NOTHING moving on the page. Wordmark clipped to zero; grid empty.
t=h        THE HAND STARTS (h ≈ 150–200 ms chromium d light; ≈ 300–450 WebKit; dark +30…+90)
h+0        wordmark RUBBING: a slanted, feathered front crosses the word L→R, 520 ms, easeHand
h+312      (the rubbing lifts at 0.6) FRAME: one closed path clockwise from top-left, 520 ms,
           four side-bells of 130 (the hand slows into every corner); chrome fades in +150/250 from here
h+624…1324 SUBGRID v3 v6 h3 h6, 250 each, each landing at the previous lift
h+1224…2364 CELLS v1 v2 v4 v5 v7 v8 h1 h2 h4 h5 h7 h8, 150 each, each at the previous lift
h+2364     the last lift. The deal's reveal wave falls (glyph 350 easeOutCubic, board-noise stagger,
           verbatim), then the tally. The grid HOLDS pose 0 — still ink.
after the wave's last stroke   wordmark poses 1–7 and grid poses 1–3 bake ONE PER BEAT (125 ms),
           never two in a frame, a pose only on a beat whose predecessor landed (WebKit dark 143 ms →
           every second beat). Each boil starts when its stack is whole. The ink sets, then breathes.
PRM        a cut: pose 0 the frame it is resident, no rubbing, no ruling, no wave, no live filter.
```

Alignment: the wordmark rubs left→right (the reading direction); the frame runs clockwise from top-left
(today's path direction, kept); verticals top→bottom left→right, then horizontals left→right top→bottom
(today's `gridPaths` order, kept — a hand with a straightedge). No line changes direction or order; only
WHEN it is drawn and HOW FAST.

**Principles.**
1. One front. A hand has one pencil; the eye tracks one tip. Two are live only in the lift-and-land.
2. A hand's velocity is a bell. It leaves slow, peaks mid-stroke at under 2× its mean, and slows into a
   lift. Corners are lifts. Nothing launches at 3×.
3. Graphite arrives. The tip is not a round cap of the full line; it is a faint lead that darkens as the
   pressure catches up, and the grain is on the page from the first frame because what is drawn is the
   grained pose itself, revealed, not a crisp stand-in swapped out at the end.
4. A late frame delays the hand. The clock counts painted frames with a bounded step; a stall lengthens
   the draw by the stalled time and never moves a line more than a hand could in one frame.
5. Nothing bakes while the pencil is on the paper. The pose the hand draws is resident before it starts;
   every other pose waits for the last lift, one per beat.
6. The boot writes the page once. A deal that arrives while the page is being ruled is the page's first
   deal, not a new page.
7. PRM is a cut, and a cut costs no filter.

## 3 · Pass two: the tell review

What the generic cure for "not smooth and pencil-like" is, and why each is refused:
- **Re-time the same tween (longer durations, a softer ease-out) and call it pencil-like.** The census
  shows the stall is the bake, not the curve; a longer easeOutCubic still launches at 3× and still
  teleports under a 140 ms task. Refused; the velocity changes to a bell AND the clock changes AND the
  bakes move — none alone reads as a hand.
- **Fade the grid in (opacity) instead of drawing it, or crossfade the crisp layer into the grained one.**
  Hides the step and the stall behind a wash; M09 forbids buying the cure with the surface's quality, and
  a wash is not a pencil. Refused. The one crossfade in this spec is the FALLBACK arm of §4.4, named as a
  fallback with its gate, never the default.
- **A pencil cursor / a drawn hand icon / a "sketching" sound.** The skeuomorphic default. The hand is
  seen in the ORDER and the VELOCITY, not in a mascot. Refused.
- **Per-letter handwriting of the wordmark.** "sudoku" is Fraunces — typeset, not handwritten. A stroke
  draw-in of set type is a lie about the material; the wordmark's own file says a stroke preset for it
  was dead config. What a pencil does to set type is RUB it in (a frottage reveals what is already on
  the page); the front is slanted like a shading stroke and feathered like graphite. That is the one
  wordmark idiom that is honest about both the pencil and the type.
- **A blur on the leading edge (feGaussianBlur on the mask).** A filter, and the budget is a wall (law
  9, 12). Refused; the lead is a second mask stroke at 0.45 luminance — zero filters.
- **Skip the boot animation on repeat visits ("only first time").** A mechanic the mark does not demand;
  the owner audits cold on :3001. Refused; the tempo goes to the owner as one ballot (§8).
- **Draw the digits one at a time too.** 25–61 givens × 350 ms is 9–21 s. The deal is a different verb
  with a ratified wave (T4's reveal wave; GV's chromium series is already smooth at 1.7–3.7 % worst Δ);
  its only disease is the stall, which principle 5 cures. Kept as is: the hand rules, the deal falls.
What survives the review is one law about the hand, one law about the page under it, an order, and the
ballot on tempo. That is the design.

## 4 · The spec

### 4.1 The hand clock (smooth)

**Component.** pencil-boil `createSequenceSubscription` gains `stepMs?: number` (0.12.1, the W8 seal's
publish vehicle): per tick the subscriber's clock advances by `min(timestamp − lastTick, stepMs)` instead
of reading `(timestamp − startTime) / durationMs` (`vue.js:194` today). With `stepMs` unset the behaviour
is byte-identical (every existing consumer unchanged). `raw` stays monotone in [0, 1]; `onComplete` fires
when the capped clock reaches `durationMs`, so a 300 ms WebKit stall lengthens the draw by ~284 ms and
moves no line more than one quantum's worth.

**The number.** `stepMs` = the front quantum, ACC-FIVE's `FRONT_MIN_MS` (16). The front law already says a
front advances at most once per quantum (a rate ceiling); the hand clock says a front advances at most
one quantum per painted frame (a displacement ceiling). One primitive, two clauses, one number. The
consumers are `usePathAnimation.runBatch` (the three grid tiers), the wordmark rubbing (§4.5) and — a
charter option for ACC-FIVE, not this spec's default — the reveal wave's `createStrokeDrawIn`.

**State.** At 120 Hz (this box's headless chromium) and 60 Hz the cap never engages (dt 8.3 / 16.7 ≤ 16
+ 1 ms tolerance — A.6's 1 ms `performance.now()` quantisation is read the same way here: the comparison
tolerates `stepMs − 1`). It engages only on a dropped frame. Under `frames > 25` the census counts, the
draw is late, not broken.

**Worst-case per-frame Δ under the cap** (the bell's peak 1.875× mean × 16 ms / D): frame side (130)
23.1 %, subgrid (250) 12.0 %, cell (150) 20.0 % — against today's 72–100 %. These are the gate's bounds
(§5 G-D1), computed, not tuned.

### 4.2 The hand's order and velocity (pencil-like, half one)

**Component.** `usePathAnimation.animateDrawIn` builds its specs from the hand, not from the sweep:
`delay(i) = Σ_{j<i} lift · duration(j)` over the ONE ordered list [frame, sub×4, cell×N], every tier on
`easeHand`, no stagger, no jitter, no baseDelay. The frame's `onProgress` maps raw → four side-bells:
`side = floor(4·raw)`, `local = 4·raw − side`, `progress = (side + easeHand(local)) / 4` — the hand slows
into each corner and leaves it slow (the round linejoin's "soft nub" now has the motion it looks like).
`runBatch` resolves when the last subscriber completes, as today.

**States.** `drawing` (the mask is live, §4.4), `drawn` (the mask is gone, pose 0 shown, the boil parked
until the stack is whole), `erasing` (verbatim today: 150 ms easeInCubic, `delay i·4` — the erase is a
page-turn and leaves fast and careless by canon; NOT re-timed, not on the hand clock: the erase is the
page's act, not the hand's).

**Desktop and phone.** Time is size-invariant: a 636 px line and a 340 px line both take their rung (a
hand on a smaller page moves slower in px/s). 16×16 (subgrid 4, 6 subgrid + 24 cell lines): last lift at
3.74 s from the first stroke — printed, not hidden; the owner disposes with the 9×9 tempo (§8) and census
G7 (16×16 unmeasured) is carried, not closed.

### 4.3 The lead (pencil-like, half two: the tip)

**Component.** The reveal mask (§4.4) carries TWO white strokes per grid line, both the line's own `d`
at the line's own width + 2 units (so the bitmap's grain never peeks past the mask's edge): the BODY at
luminance 1.0 with `strokeDashoffset = len · (1 − p)`, and the LEAD at luminance `MOTION.hand.pressure`
(0.45) with `strokeDashoffset = len · max(0, 1 − p − MOTION.hand.lead)`. The lead runs 4 % of the line
ahead of the body; the bitmap shows there at 45 % — graphite arriving, the pressure a hair behind the
point. At p = 1 both offsets are 0; the mask is dropped; nothing of the lead survives into the settled
line (π on the settled board). No taper at the lift: the settled line has a round cap and a ruled line's
lift is quick; a transition taper that fills in afterwards would be a cheat the settled line exposes.

Both themes: the lead is a luminance in a mask over the theme's own pose bitmap, so it reads as faint
graphite on paper and as faint chalk on slate without a second value.

### 4.4 Drawn through the grain: pose 0 first (no handoff)

**Component.** `HandDrawnGrid`'s transition layer becomes: the RESIDENT pose-0 `<image>` (the same
object URL the steady layer will show) under `mask="url(#hand-mask)"`, where `#hand-mask` holds the 2N
white strokes of §4.3 (geometry = `steadyFrames[0]`, the pose the bitmap was baked from — the same
`currentPaths` the layer already freezes at pose 0). The unfiltered `path.grid-line` stand-ins DIE. At
`drawn` the mask is removed and the steady `<image>` stack takes over with pose 0 active — the same
bitmap, the same bytes: there is no handoff frame to see. The grain is on the page from the first frame
of the first stroke because the thing being revealed is the grained pose.

**The wait.** `animState: 'drawing'` is entered as today, but the hand does not start until
`bitmapUrls[0]` is resident (a `watch` on the retained URLs; the round is already in flight from the
font gate). Until then the layer paints nothing (the paper). Measured wait ≈ h in §2's timeline.

**Cost.** A mask over a 1272² bitmap with 34 white strokes, re-composited per frame while a dashoffset
changes: no filter, one decoded bitmap, a vector mask raster. It is UNPROVEN on both engines and gated
(§5 G-D5b: per-frame paint ≤ the unfiltered control's median + 2 ms). If the gate reds on either engine,
the FALLBACK arm is: keep the unfiltered stand-ins as the drawing layer (with §4.1–4.3's clock, order,
bell and lead applied to them — the lead then is a second `path` at 0.45 stroke-opacity) and cross the
grained pose 0 in over ONE `dusk` (350) at the last lift instead of a step. The fallback is named as a
loss (a wash, §3) and its gate is the same G-D5 ink statistic read across the 350 ms.

**Pose cadence.** `useRasterStack` gains `poseCadence: 'beat'` (0.12.1): the round encodes pose 0 on
demand and publishes it alone; poses 1…n−1 are encoded one per `MOTION.beatMs` window from a `resume()`
the consumer calls at the last lift, each on a beat whose predecessor has landed, never two encodes in
one frame. `urls` publishes the PARTIAL stack (`showBaked` becomes `urls.length ≥ 1`; the beat index maps
over `urls.length`, so a 1-pose stack is still ink, a 4-pose stack boils). The retained-across-null
discipline (T4-WM rank 3) is unchanged. The structural escape (a size switch) keeps today's whole-round
path; this spec does not touch it and says so.

### 4.5 The wordmark's rubbing

**Component.** `HandwrittenLogo` keeps `clip-path: inset(0 100% 0 0)` as the PRE-RESIDENT hide (a
zero-area clip paints nothing, so the live filter never rasters on the boot), then, once its pose 0 is
resident, drops the clip and reveals the pose-0 `<image>` through an SVG mask: one `<rect>` filled with a
`<linearGradient>` whose stops are `#fff` at `x − feather` and `#000` at `x`, the gradient's vector
rotated 105° (a pencil held for shading, the front leaning forward), `feather = --rub-feather` (0.35 em,
resolved once to viewBox units at mount), `x` driven from `−feather` to `vbWidth + feather` by one
`createSequenceSubscription({ durationMs: DRAW_IN_PRESETS.logo.duration, easing: easeHand, stepMs })`.
The 1.2 s CSS `transition: clip-path … var(--ease-noteWrite)` and `.is-drawn` DIE; `--ease-noteWrite`
keeps its other consumers. The gradient is not a filter (budget 9 unmoved; the live pose-0 filter is
never in the painted tree during the boot).

**States.** hidden (clip 100 %) → rubbing (mask x moving) → drawn (mask removed; the pose stack; the
parked live stack per CH-66 unchanged) · PRM: hidden → drawn the frame pose 0 is resident.

**Both themes, both widths.** The feather is in em so it scales with `--logo-height` and with the
drawer's `--logo-scale` (1.05 closed regime); the front's angle is fixed; on the 390 phone the word is
narrower and the rubbing takes the same 520 ms (a hand on a smaller title).

**Caret.** The menu caret is inside the host and is rubbed in with the word; its hover wiggle is untouched.

### 4.6 The deal's wave and the tally (kept), the boil (waits)

The reveal wave (glyph 350 easeOutCubic, board-noise stagger) and the tally (350 · 90 stagger) are
ratified verbs and stay verbatim; their disease in the census (WebKit 61–69 % one-frame Δ, 5 frames > 25)
is the stall, which §4.4's cadence removes from their window (poses 1–3 and 1–7 bake only after the
wave's last stroke). The wave begins at the grid's last lift, not at the deal's arrival (the deal may
land mid-ruling; its glyphs mount at dash progress 0 and are inked when the hand lifts — the census's
"givens pop" is the mount, and it stays invisible). ACC-FIVE's charter row may put the wave on the hand
clock too (§7); this spec does not default it, since the wave's chromium series is already a bell-shaped
crowd and the stall is gone.

### 4.7 The boot deal is not a page turn

`GameBoard.vue:966–977`'s `boardGeneration` watch erases-and-redraws on EVERY bump. The boot's first
deal bumps it (`useGameState.ts:610`) at 90–184 ms (dist) or 843–1212 ms (:3001) — inside the ruling
or just after it — and the census caught the page turning on a page that was blank. The rule: the
generation watch turns the page for a USER act (randomize, clear, size change) and for a GEOMETRY change;
the boot's automatic first deal carries `record: false`-class provenance (`deal({ source: 'boot' })`,
W1's seam) and does not. If the boot deal changes the geometry (a 16×16 permalink dealt over the 9×9
default) the hand has not started (it waits for pose 0 of the RIGHT geometry — the reset key already
drops the wrong poses) and simply rules the right grid once.

### 4.8 The chrome

`scene.css:611` `controls-fade-in 250ms var(--ease-drawOn) 150ms backwards` keeps every number and its
curve (not a ratified pose re-timed; a rung is not a licence). Its trigger moves from mount to the
frame's first stroke: `.app-layout.scene-ruling` (set with the frame's onset, cleared at `drawn`) carries
the animation, so "the grid leads, chrome follows" stays true when the grid's onset is 300–800 ms after
mount. PRM: unchanged (the block is already gated). No new mechanic: a class on the layout the scene
already toggles for `scene-leaving`.

### 4.9 PRM

A cut, and now a cut with no filter: the wordmark and grid show pose 0 the frame it is resident (paper
before), no rubbing, no ruling, no wave (glyphs mount inked, as today), the stack fills one per beat and
the boil is parked until whole. The census's PRM finding — the live grain filter paints 759–793 ms
chromium and > 5 s WebKit before the bake — is cured by construction (0 live-filter frames on the boot,
§5 G-D7).

### 4.10 Desktop and phone, light and dark — the matrix the lane frames

Chromium and WebKit × 1280×800 DPR2 fine × 390×844 DPR3 coarse (`hasTouch: true`, witnessed) × light and
dark × motion and PRM, cold. Plus the :3001 profile (deal delayed to ≥ 1.2 s by an instrument on the
served dist, since the owner's server is read-only). Four cited crops ≤ 150 KB: (1) chromium light 1280
fine, the frame mid-side with the lead visible at DPR2; (2) WebKit dark 1280 fine, two fronts at a
lift-and-land; (3) chromium light 390 coarse, the rubbing mid-word with the feathered slant and no cut
letter; (4) the last drawing frame beside the first settled frame, chromium light 1280 fine, differenced.
Raw per-frame JSON summarised (min/median/max, the discontinuity), never banked whole.

## 5 · Gates (born-RED at HEAD unless marked π)

| id | statement | HEAD reads | RED/GREEN at HEAD |
|---|---|---|---|
| G-D1 hand clock | with an instrument-only 150 ms main-thread block injected at first stroke + 200 ms, the worst single painted-frame Δ of any line ≤ 23.1 % (frame side) / 12.0 % (subgrid) / 20.0 % (cell), both engines, n ≥ 5, min over two photographs (A.5.7) | 72–100 % | RED |
| G-D2 no bake in a stroke | 0 encode tasks (LoAF `IMG.onload`/`toBlob` attribution chromium; the timestamped `drawImage`/`toBlob` hooks WebKit) between the first stroke's onset and the wave's last stroke, n ≥ 5 per engine, both themes | 4/4 inside in 36/36 | RED |
| G-D3 one front | max lines with 0 < p < 1 in any painted frame ≤ 2 | 15 | RED |
| G-D4 the bell | per line, fraction drawn at 20 % of its time ≤ 0.10 and at 50 % ∈ [0.45, 0.55]; the wordmark front the same | 0.488 / 0.875 (grid), 0.672 / 0.969 (wordmark) | RED |
| G-D5 no handoff step | ink fraction inside the line cores (the census's band statistic per A.1.1) at the last drawing frame vs the first settled frame: median Δ ≤ 1/255, both engines both themes | a crisp→grain step (the census G4 says unframed; the gate frames it) | RED (expected; the lane proves it) |
| G-D5b mask cost | per-frame paint time during the ruling ≤ the unfiltered control's median + 2 ms, both engines, or the §4.4 fallback arm ships with G-D5 read across its 350 ms | n/a | new; decides the arm |
| G-D6 the lead | the front's leading 4 % of the line paints at 0.40–0.50 of the body's ink in ≥ 90 % of drawing frames (a FAINT-INK plant at 0.15 reds it: existence is not visibility, A.5.3) | no lead | RED |
| G-D7 no live filter on the boot | 0 samples with the live grain filter in the painted tree (sl=4 / lb live) from first paint to the boil's start, motion AND PRM, both engines | PRM 759–793 ms chromium, > 5 s WebKit; WebKit motion handoff 0.4–0.75 s | RED |
| G-D8 the page written once | 0 `erasing` states before the first user act, :3001 profile (deal ≥ 1.2 s), n ≥ 5 | 1 caught (screencast) | RED |
| G-D9 the wordmark uncut | at every painted frame of the rubbing, the ink column-profile across the front spans ≥ 0.35 em (no hard edge); the slant measured 100–110° | a hard vertical edge (crop 2) | RED |
| G-D10 the tempo printed | first stroke h, last lift, last given, boil start — as RATES per engine × theme × viewport, both arms, quiet box (census G2) before any becomes a floor | 0.56 s / 1.5–1.76 s | REPORTED, no floor |
| π-1 settled board | the settled grid's four poses byte-identical to HEAD (same pose SVG, same cacheKey, same DPR cap), both themes; goldens 4/4 | identical | GREEN (must stay) |
| π-2 filter budget | 9, exact-match both directions, both regimes; union raster area within ±2 % | 9 | GREEN (must stay) |
| π-3 chrome | `controls-fade-in` 250 / +150 / `--ease-drawOn` unchanged; the erase 150 easeInCubic unchanged; the wave and tally unchanged | — | GREEN (must stay) |
| π-4 copy | `check-copy-register` bare unchanged; 0 rendered-string delta | — | GREEN |
| π-5 @property | no new registered property (the rubbing's feather is a plain length token, no `var()` fallback, declared in the first static stylesheet); `check-property-block` C1–C6 unmoved | — | GREEN |
| P-1 the 60 Hz row | every rate/Δ row runs under A.1.7: in-page clock ≥ 93.75 Hz measured or the driven-clock shim named as the arm; a row green in one engine and red in the other is a defect (A.6) | — | precondition |

## 6 · What DIES

- `usePathAnimation`'s sweep: `stagger`/`jitter`/`baseDelay` on gridFrame/gridSubgrid/gridCell, the
  `mulberry32(77)` jitter, `easeOutCubic` as the grid's launch, the unfiltered `path.grid-line`
  stand-ins in the transition layer (`HandDrawnGrid.vue:348–388`) and the handoff frame with them.
- `HandwrittenLogo.vue:680–686`'s 1.2 s `clip-path` transition on `--ease-noteWrite` and `.is-drawn`;
  the double-rAF arming (`:253–263`) is replaced by the pose-0 residency watch.
- The wall clock as the boot's only clock (`vue.js:194` stays for every consumer that does not pass
  `stepMs`).
- The all-or-nothing `showBaked` (`urls.length === frameCount`) and the whole-round boot bake — replaced
  by the partial stack and the beat cadence.
- The live grain filter on the boot path in every regime (motion handoff, PRM's first 0.8–5 s).
- The boot deal's page turn (`GameBoard.vue:966–977` on the automatic first deal).
- `pencilConfig.ts:474–476`'s comment "the logo actually reveals via a 1.2 s clip-path wipe" — the
  `logo` preset returns with a consumer, and the comment is rewritten to say so.
- The chrome fade's mount trigger (its numbers live).

## 7 · Charter rows (one numbered row per owning family; paste into the lane's return)

### MOT-VERB (§13 leader, 81) — M20's verbs on the one §13 tree, after LADDER's delta
1. `usePathAnimation.animateDrawIn` re-cut to the hand: one ordered list, `delay(i) = Σ lift·D(j)`,
   `easeHand`, the frame's four side-bells, no stagger/jitter/baseDelay; `animateErase` untouched.
   Gates G-D3, G-D4 born-RED on the control and GREEN on the tree, both engines, the P-1 precondition
   printed per run.
2. `HandDrawnGrid`'s transition layer = pose-0 `<image>` under `#hand-mask` (34 strokes: body + lead
   per line, §4.3–4.4), the hand waiting on `bitmapUrls[0]`; the stand-ins deleted. G-D5 and G-D5b
   decide the default vs the fallback arm — both BUILT, framed on one payload, crop 4 differenced.
3. `HandwrittenLogo`'s rubbing (§4.5): pre-resident clip, the slanted feathered gradient mask on the
   hand clock at `DRAW_IN_PRESETS.logo` (520 throw), `--rub-feather` declared in the first static
   stylesheet, the CSS wipe and `.is-drawn` deleted. G-D9 born-RED (crop 2's cut letter is the control).
4. The boot's ORDER (§2 layout): wordmark → frame → subgrid → cells → wave → tally → bakes; the wave keyed
   to the last lift. G-D10 printed as rates for both tempo arms (§8), quiet box, before any floor.
5. `.app-layout.scene-ruling` carrying `controls-fade-in` with its numbers verbatim (§4.8); π-3.
6. G-D7 (0 live-filter frames on the boot, motion and PRM) with the PRM cut to resident pose 0 (§4.9).
7. Row 37's wordmark half (the theme flip's 4 draws + 4 href swaps) is NOT this spec's; it stays BLOCKED
   as v5 §1 books it. This spec's rubbing works on whichever pose 0 is resident for the current theme.

### MOT-LADDER (76) — the rungs and the presets' home
8. `DRAW_IN_PRESETS` re-pointed: gridFrame 520 (throw), gridSubgrid 250 (note), gridCell 150 (whisper),
   glyph 350 (dusk, unchanged), `logo` resurrected at 520 (throw) — every duration a `MOTION.rungs`
   name once the map lands, literal until then; `timing: "easeHand"` on the four; `MOTION.hand`
   {lift 0.6, lead 0.04, pressure 0.45, stepMs ← FRONT_MIN_MS} minted in pencilConfig with one comment
   block (R6 law 4); the dead-config comment at `:474–476` rewritten. B6's motion-bank reads the
   three shortenings (350→520 is a lengthening; 280→250 and 200→150 are SHORTENINGS the bank must see
   as deliberate — the ratchet's row, with the census cite in the key).
9. `lint:bands`/the undefined-token census extended to `--rub-feather` (a declared length, no fallback).

### ACC-FIVE (§3 leader, 83) — the front primitive
10. `frontGate` gains the displacement clause: a front advances at most `FRONT_MIN_MS` of clock per
    painted frame (the hand clock, §4.1), exported as the one number pencil-boil's `stepMs` consumers
    read; G10 re-run with the clause on (the rate row must not move: gated 49–52/s unchanged; the A.6
    forced end-write deferral lands in the same cut).
11. OPTION, framed not defaulted: the reveal wave's `createStrokeDrawIn` on the hand clock (`stepMs`),
    read against GV's series (chromium worst Δ 1.7–3.7 % today) — ship only if the WebKit wave's
    61–69 % Δ survives G-D2 (if the stall is gone, the wave may not need the cap; say which).

### Crossings (not loop families; the chair routes)
12. **pencil-boil 0.12.1 (W6/W8 substrate, the seal's publish vehicle):** `easeHand` in `easings.js` +
    `resolveEasing`; `createSequenceSubscription({ stepMs })` with the capped clock (unset = byte-identical);
    `useRasterStack({ poseCadence: 'beat' })` with `resume()` and the partial-stack publish. Unit rows:
    the cap under a synthetic 300 ms gap (raw advances 16); the cadence never encoding two in one frame;
    `resolveEasing("easeHand")(0.5) === 0.5`.
13. **W1 mechanics (useGameState / GameBoard):** the boot deal's provenance (`source: 'boot'`) and the
    generation watch turning the page only for user acts and geometry changes (§4.7); G-D8 born-RED
    on the :3001 profile.
14. **W8 (first paint):** the boot's two pose-0 encodes are the first tasks after fonts.ready and the
    only ones before the hand starts; C01's zero-box law and C07b's face acquisition are unchanged and
    the seam's numbers (h in §2) are printed per engine × theme — a rate, not a floor.

## 8 · The ballot (the owner's, at the re-look; both arms built, framed on one payload)

**T9-B-DRAWIN-1 · the tempo.** One variable, `MOTION.hand.lift`.
- Arm Q (DEFAULT): QUICK HAND, lift 0.6 — two fronts live at the lift-and-land; 9×9 grid ruled in 2.36 s
  from the first stroke (last given ≈ 3.4 s chromium d); 16×16 in 3.74 s.
- Arm S: STRICT HAND, lift 0.8 — one front, a visible pause between strokes; 3.10 s / ≈ 4.1 s; 16×16
  ≈ 4.9 s.
- Named for scale, NOT an arm (it fails principle 1 and G-D3): today's sweep re-cut on the hand clock
  (bell + lead + bakes moved, fifteen fronts) at 0.56 s. Framed as the CONTROL in crop 2's position so
  the owner sees what the tempo buys.
- Firing default on silence: Q. The cost stated: the boot to the last given roughly doubles against
  main (1.5–1.76 s → ≈ 3.4 s, chromium d cold; :3001's own deal already lands at 0.84–1.21 s, so the
  hand covers the deal's latency rather than racing it).

## 9 · Gaps and risks (a gap is a gap)

- The mask-over-bitmap cost (§4.4) is unmeasured on either engine; G-D5b is the decider and the fallback
  arm is a wash that §3 refuses as a default. If WebKit reds it the default is the fallback and this
  spec's "no handoff" claim is downgraded to "a 350 ms crossing" — said so at the fold.
- WebKit attribution is partial (census G1): if a residual freeze past the bakes remains on a quiet box,
  the hand clock turns it into a delay (G-D1 holds) but the boot's tempo grows by it (G-D10 prints it).
- Every census number is from a box at load 139–224 (census G2); no floor is set here, only bounds
  computed from the design's own curve and cap.
- The 16×16 and the other games' boots are unmeasured (census G7); the design's law is size-invariant
  in time and the tempo is printed, but the owner has not seen a 3.7 s ruling.
- `stepMs` at 120 Hz never engages, so chromium headless on this box cannot witness the cap without a
  driven clock or an injected block (P-1 / G-D1's instrument); the WebKit 60 Hz arm is the natural
  witness and must be read first.
- Whether chromium composites today's clip-path wipe (census G3) becomes moot (the wipe dies), but the
  rubbing's mask is main-thread by construction — its 31 repaints at 60 Hz are inside G-D5b's read.
- The wave stays a crowd (many glyphs at once). If the owner reads "one pencil" as the digits too, the
  honest cost is 9–21 s and the spec refuses it; that reading is the owner's to make (U-10).
- Nothing here retires T9-M20. The owner disposes at the re-look.

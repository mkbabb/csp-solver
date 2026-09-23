# G-DRAWIN · Opus · the boot draw-in (T9-M20)

The owner's words: "The draw in on page load animation is not smooth and pencil like." Designed against
MAIN `1d0dc4fd` (product `74a2b5d9`), grounded in `census/drawin/README.md`. This is a design, not a
prototype: no source moved, no server bound, no number below is new except where it is arithmetic
over the census or over a named curve (the curve arithmetic is reproducible from the control points).
The frontend-design skill's two passes were run: plan, review against the tells, then specify.

## 0 · The memorable thing

**The pencil's point.** Every ruled line is led by a slightly wider, denser bead of graphite at its
front, and where the hand stops the bead sits for a moment and dries into the line. Everything else
in this spec is the floor under it: a hand never teleports, a raster never lands while a hand is
moving, and the paper's tooth settles in only after the hand has lifted.

## 1 · What the census says the owner saw (the ground, restated)

- **Not smooth = stalls turned into jumps.** The grid's 4 grain bakes land inside its own 557–567 ms
  draw in 36 of 36 motion runs (50–143 ms each), and the draw is wall-clock timed, so a stall moves a
  line 72–76 % of its length in one painted frame (chromium desk), 100 % in WebKit with 3–16 of 17
  lines never seen partial. Moving only the grid bake (ABLD) cut chromium's frozen time 200–226 → 33–58
  ms; the residue is the wordmark's 8 bakes. WebKit isn't cured by the grid bake alone (G1).
- **Not pencil-like = five absences.** easeOutCubic everywhere (3× mean speed at t=0, the hand's
  profile inverted); the wordmark is a rectangle sliding off filled text (easeOutQuint, 50 % at 13 % of
  the time, then a 757 ms creep); no tip, no pressure, no lift; the grain arrives in one step at the
  handoff; the 12 cell lines start inside 110 ms with jitter (±15) larger than the stagger (10), so the
  order is a random flash, not a ruling front.
- **And one un-pencil act:** a first deal that lands after the grid is drawn ERASES the empty grid and
  draws it again (`GameBoard.vue:966-977`, the 0→1 generation bump at `useGameState.ts:610`).

## 2 · Pass 1: the plan, and what the review changed

**Palette (no new colour; the house's own).** Paper `#faf8f5` · graphite `--grid-line-color`
(`#262626` light) · the dark paper and its light graphite · the wordmark's `currentColor`. The point
is the line's own ink at a higher density: a new hue would be a new mark, not a pencil.

**Type.** Fraunces stays the wordmark; the change is how it arrives (written letter by letter), not
what it is. Patrick Hand chrome untouched.

**Layout.** None. Every box, berth and rect is π; the design lives in time only.

**Principles.** (1) A draw never bakes. (2) A stall pauses the hand; it never moves it. (3) The hand
has a velocity: it touches down, runs, and stops. (4) The hand has a point. (5) The tooth settles in
after the lift. (6) The paper is never erased to draw what's already on it.

**Review against the brief and the tells: four first ideas I rejected, and why.**

1. *One literal hand: a single travelling point drawing the 17 lines serially.* Rejected: 17 lines
   inside today's ~575 ms window is 34 ms a line, and stretching the window to a legible serial hand
   (~1.7 s) buys quality with speed (M09). Kept instead: one ordered RULING FRONT (onsets monotone, jitter
   smaller than half the stagger) with a point on every line.
2. *Bake BEFORE the draw* (the §13 law "a verb never bakes, every raster is inked before the gesture",
   read literally at boot). Rejected: it delays the first line by 200–700 ms (4 grid + 8 wordmark
   poses) behind a blank board. Kept: the same law read from the other side, bake AFTER the lift.
3. *Reveal the baked bitmap through the animating dash as a mask*, so the grain is there from the
   first pixel. Rejected: it needs the bake before the draw (idea 2's cost).
4. *A live grain filter on the transition layer while drawing.* Rejected: filterBudget 9 and the
   full-board re-raster per frame the transition layer was built to avoid.

Tells checked: no fade-and-slide entrance added anywhere (the controls' existing fade is left alone, π);
one orchestrated moment, not scattered effects; no new chrome, label or word.

## 3 · Tokens (homes in `pencilConfig` and the ONE `@property` block; values)

Rung names are §13's ladder as banked (`MOTION.rungs` {whisper 150, leave 200, note 250, dusk 350,
step 440, throw 520, rise 520}); **every row below lands after the §13 fold** (main has no ladder and no
`@property` block today). No new duration literal: every length is a rung or a shipped number homed.

| Token | Value | Home | Note |
|---|---|---|---|
| `MOTION.curves.handStroke` | `cubic-bezier(0.35, 0.05, 0.25, 1)` | `pencilConfig` MOTION.curves (TS) + `--ease-handStroke` byte-identical in `@theme` (two-layer rule, R6 law 3) | A lognormal-shaped hand: touch-down speed 0.15× mean, peak 2.39× at 29 % of the time, 50 % drawn at 34 %, 90 % at 64 %, end speed 0 (the stop). easeOutCubic: 3.00× at t=0, 50 % at 21 %. A new NAMED curve is a chair's row (§8). |
| `handStroke(t)` (JS) | the same four numbers, parsed from `MOTION.curves.handStroke` | `src/pencil/config/handStroke.ts` (~20 LOC bezier solver) | one source; a unit asserts the JS samples equal the CSS twin to 1e-4 at 41 points |
| `MOTION.stallStepMs` | 34 | `pencilConfig` MOTION | the estate's own two-frame number (GA4/GB1 "> 34 ms"), homed, not minted: the most clock a stroke may advance per painted frame |
| `MOTION.wordmarkWriteMs` | 1200 | `pencilConfig` MOTION | `HandwrittenLogo.vue:681`'s shipped `1.2s`, homed verbatim, not re-timed |
| `DRAW_IN_PRESETS.gridFrame` | duration 350 (`dusk`, unchanged) · joints 4 · timing `handStroke` | `pencilConfig` | duration unchanged keeps `GameGallery.vue:377`'s deal reveal π |
| `DRAW_IN_PRESETS.gridSubgrid` | duration 250 (`note`, was 280) · baseDelay 110 · sweep `MOTION.beatMs` (125) · jitterFrac 0.2 · `handStroke` | `pencilConfig` | stagger = sweep ÷ (n−1): 41.7 ms at 9×9 (4 lines), 25 at 16×16 |
| `DRAW_IN_PRESETS.gridCell` | duration 200 (`leave`, unchanged) · baseDelay 225 · sweep 150 (`whisper`) · jitterFrac 0.3 · `handStroke` | `pencilConfig` | stagger 13.6 ms at 9×9, 6.5 at 16×16; jitter < stagger/2 so the order is monotone |
| `DRAW_IN_PRESETS.glyph` | duration 350 (unchanged) · timing `handStroke` | `pencilConfig` | givens, tally, and (declared) the hint/solve write-in (§6) |
| `DRAW_IN_PRESETS.tip` | lengthK 2.5 (× the line's stroke width) · widthK 1.35 · opacity {frame 1, subgrid 1, cell 0.9} · dry `whisper` (150) on `--ease-fadeOut` | `pencilConfig` | frame bead at 1280: ~10 css px wide × 19 long; at 390: ~5.5 × 11 |
| `--write-x` | `@property { syntax: '<length-percentage>'; inherits: true; initial-value: 0% }` | the ONE `@property` block, first static stylesheet | initial 0 % fails VISIBLY (a blank wordmark while `.is-writing`); rest carries no mask, so a failure can't strand a blank mark |
| `--write-feather` | `6%` of the wordmark's width (about a third of a letter) | same block's static tokens | no `var()` fallback at any consumer |
| `--write-lean` | `100deg` (the front leans 10° like a writing hand) | same | |

Schedule arithmetic (9×9, onsets and durations from the presets above, a scratch script not banked): last line lands at **575 ms** (today
measured 557–567, the old presets' own arithmetic 619 with jitter); **16×16 also 575** (today ~736, the
sweep is board-normalised); lines in flight at once, max 15 at 9×9 (today 15–16). Per painted frame at
60 Hz the worst line advance is frame 10.5 % (jointed; today 13.6 %), subgrid 15.7 % (16.8 %), cell
19.6 % (23.0 %). At 120 Hz, half.

## 4 · Components and states

### 4.1 `HandDrawnGrid` + `usePathAnimation` (the grid)

States: `drawing` → `drawn·crisp` (NEW: the transition layer holds, frozen at pose 0, tips dried) →
`settling` (NEW: the baked stack fades in over it) → `drawn·steady` (today's steady layer, boiling).
`erasing` is unchanged (no tips; π).

- **The ruling front.** Frame, subgrid, cells as today's three tiers; onsets = baseDelay + i · sweep ÷
  (n−1) ± jitterFrac · stagger, seeded (`mulberry32(77)`, as today). Verticals then horizontals, left to
  right and top to bottom (`gridPaths.ts:478-520`'s order, now actually visible because jitter can't
  reorder it).
- **The frame turns its corners.** The one closed path runs clockwise from the top-left as today, but
  its 350 ms is four equal quarters, each on `handStroke`: the point stops at each corner (speed 0 for
  about one frame) and sets off again. Quarters are equal arc fractions (the sides differ by < 1 %).
- **The point.** Each `path.grid-line` gets a sibling `path.grid-tip` (same `d`, stroke width ×
  widthK, round caps, the same `--grid-line-color`), dashed to show only [front − L, front] where L =
  lengthK × stroke width: `stroke-dasharray: L <len>` and `stroke-dashoffset: −max(0, front − L)`,
  written in the same `onProgress` as the body. On the line's completion the tip takes `.is-dry` →
  opacity 0 over `whisper` on `--ease-fadeOut`: the nub where the hand stopped, drying. Mounted only
  while motion runs (`v-if="!reducedMotion"`); 17 → 34 transient unfiltered paths at 9×9 (30 → 60 at
  16×16), zero at rest.
- **The hand pauses.** Every stroke's clock advances at most `MOTION.stallStepMs` per painted frame. A
  300 ms main-thread block becomes a 266 ms pause of the whole hand, then the stroke resumes where it was.
  Library form: `createSequenceSubscription({ maxStepMs })` in pencil-boil 0.12.1, additive, default
  undefined (π for every other consumer). It rides the held 0.12.1 publish (LEDGER T9-R4, the owner's
  row). Interim consumer form, if the chair wants it before the publish: `usePathAnimation` keeps its
  own virtual clock over one `sequence` subscription and stops itself; +25 LOC that the library row
  deletes.
- **A draw never bakes.** `gridRaster`'s `cssSize` becomes `fontGatedBox(...)` AND `drawQuiet`: 0 (the
  library's "not measured yet, hold") while any stroke draw is in flight, the true side after. The
  steady stack mounts only when `showBaked`; until then the crisp transition layer holds at pose 0
  (the live grain-filter fallback never paints on the boot; it stays for census parity, `display:none`).
- **The tooth settles in.** When the 4 poses land: the steady stack mounts at opacity 0 and fades to 1
  over `dusk` (350) on `--ease-standard`, the boil starts on the next shared beat, and the crisp layer
  unmounts at the transition's end (NOTE-ERASE's exit-gate pattern, never a bare timer). Compositor
  opacity only; zero filters in flight.

### 4.2 `useDrawQuiet` (new, `src/pencil/composables/drawQuiet.ts`, ~35 LOC)

One shared ref, true when no stroke draw is in flight: the grid isn't `drawing`, the wordmark isn't
`.is-writing`, and the scheduler's active `sequence` count is 0 for one rAF (`schedulerDebugInfo()` is
public API today; `whenSequencesIdle()` on 0.12.1 is the clean form). Ceiling: the grid's `drawn` +
`CELEBRATION.revealWindowMs` + `DRAW_IN_PRESETS.glyph.duration` (1,550 ms, both existing numbers), so a
stuck subscriber can't hold the bake forever. **Order:** the grid bakes first, the wordmark's box opens
only when the grid's poses have landed, and pencil-boil 0.12.1's `yieldBetweenPoses` gives a rendering
opportunity between every pose (WebKit today runs 12 poses back to back, ~530 ms, census mechanism 4).
It closes again for any later draw (a size change's re-key waits for its own draw to finish).

### 4.3 `HandwrittenLogo` (the wordmark is written, not wiped)

- **Dies:** `clip-path: inset(0 100% 0 0)` → `0` over 1.2 s easeOutQuint (`:680-686`), and the
  double-rAF arm.
- **Written:** while `.is-writing`, the svg carries `mask-image: linear-gradient(var(--write-lean),
  #000 calc(var(--write-x) - var(--write-feather)), transparent var(--write-x))`. `--write-x` is written
  inline per frame by one `sequence` subscription (the same scheduler and the same stall clamp as the
  grid) over `MOTION.wordmarkWriteMs`, JOINTED by letter: each glyph's share of the time is its advance
  (`getSubStringLength(i, 1)` on pose 0's `<text>`, measured where the viewBox is already measured,
  post-font), and each letter runs on `handStroke`, so the front slows to a stop at every letter join.
  "sudoku": six bells in 1,200 ms; worst per-frame advance 3.3 % of the width at 60 Hz (today's quint
  6.8 %, front-loaded).
- **Rest:** no mask, no clip (`.is-writing` removed at the end; the inline `--write-x` cleared). The
  write runs over the frozen live pose 0 (the boil freezes while writing, as the grid's does); the
  bitmaps land after the grid's, through §4.2, and swap atomically pose-for-pose (identical by
  construction, CH-67's capture box). No swap mid-write, ever.
- **Start:** max(double rAF, `fonts.ready`), since letters can't be measured before the face lands
  (fonts.ready 76–137 ms in the census; a declared delay of at most one font gate).
- A game swap still never re-writes (I2).

### 4.4 Givens and the tally

The reveal wave (`HandwrittenGlyph` `createStrokeDrawIn`) and the tally (`DifficultyTally.vue:148`)
pass `easing: handStroke` and `maxStepMs`. Durations, the board's noise stagger and the tally's 90 ms
step are unchanged. The tally's rate rides ACC-FIVE's `frontGate` on its tree (its row, §8).

### 4.5 The first deal writes into the drawn paper

`GameBoard.vue`'s generation watch erases only when the paper holds a DEALT board (the previous
generation was dealt). An empty drawn grid receiving its first deal keeps its lines and the givens
write in. A second deal still erases and redraws (unchanged).

### 4.6 The controls chrome

Unchanged: a fade is not a draw, and a chrome draw-in would be the generic entrance the skill warns
about. It inherits the continuity floor only (no bake lands in its 250 ms).

## 5 · Phone and desktop · light and dark · PRM

- **Desktop 1280×800 fine** (board ~636 px): frame bead ~10 × 19 css px; the ruling front crosses the
  board in 150 ms; the wordmark written in 1.2 s beside it.
- **Phone 390×844 coarse, DPR 3** (board ~364 px): the same schedule, so the hand's tempo is the same and
  its speed in px is lower (a smaller sheet, the same hand). Bead ~5.5 × 11 css px. The grid bake is
  1092 px chromium, 728 px WebKit (DPR cap 2) and now lands after the lift. Short landscape 844×390 reads
  like the phone. No pointer is involved in the boot; the coarse rows exist for §7 G-DI8's tap.
- **Light:** the point reads as denser graphite (cell body 0.7 → ~0.97 composite under the tip) and
  wider (1.35×).
- **Dark:** the same alpha arithmetic on the light graphite: the point reads brighter and wider. No
  colour token is added or moved; AA is gated on painted bytes both themes (G-DI5).
- **PRM is a CUT:** the grid snaps drawn and crisp, no tips mount, the wordmark renders at rest (no
  `.is-writing` ever), the givens mount inked, and the settle is a same-frame swap when the bitmaps land.
  Declared delta: PRM's first ~0.8 s used to paint the live grain filter (census, PRM arm); it now paints
  the crisp layer, which is cheaper.

## 6 · Copy (M16)

The boot says nothing and this design adds no word: no string, no `aria-*` value, no live-region text
moves. `check-copy-register` runs bare on the diff and reads 0.

## 7 · Born-RED gates it lands with (each RED on main or on its named plant)

Instruments: the census's post-rAF sampler (`census/drawin/series/instruments/init2.js`) for per-line
progress and bake timestamps; §13 row 40's painted-frame recorder (CDP screencast chromium,
`recordVideo` webkit) for every "painted" clause; `page.clock` to stop time for photographs. Quiet box
(load < 4), n ≥ 5 per engine per cell. The census numbers were taken at load 139–224 (G2) and set no
floor.

| Gate | Asserts | Main today | Negative control |
|---|---|---|---|
| G-DI1 a draw never bakes | 0 pose encodes (grid + wordmark `drawImage`/`toBlob`) inside [first partial line, last line complete] ∪ the wordmark write; both engines · d + m · cold + warm · light + dark | 4 of 4 grid poses inside the draw in 36/36 runs + the wordmark's 8 | `drawQuiet` forced true → RED |
| G-DI2 continuity (painted) | in the draw window, painted intervals ≤ 34 ms, and every one of the 17 lines seen partial in ≥ 2 painted frames | frozen 200–226 ms chromium d, 385–1501 WebKit; 0–16 lines never partial | the ABLD reading (33–58 ms) proves the gate separates |
| G-DI3 the hand pauses | with a 300 ms busy loop injected at draw +150 ms: the frame line's advance between consecutive painted frames ≤ 0.24 (2.39 × 34/350 = 0.23), and no line goes from partial to whole across the stall | a 72–76 % single-frame jump without injection; a completed line across it with | `maxStepMs` unset → RED |
| G-DI4 the hand's velocity | per-line speed at t=0 ≤ 0.3× mean, peak inside t ∈ [0.2, 0.4]; the frame shows 3 interior minima ≤ 0.2× mean at the quarters (± 0.03); the wordmark front shows n−1 minima at the letter advances | easeOutCubic peaks at t=0 (3×); the quint wipe has 0 interior minima | `timing: easeOutCubic` → RED |
| G-DI5 the point is visible (existence is not visibility) | `page.clock`-stopped photographs at 175 ms (the frame's second side) and mid cell line, DPR 2, both engines both themes, minimum over TWO bare photographs: the frame tip's painted cross-section ≥ 1.25× the body's; a cell tip's median ink density ≥ 1.15× its body's; tip core contrast vs paper ≥ 3.0. At line end + 150 + 2 frames, the tip ratio ≤ 1.02 (it dried) | no tip: ratio 1.00 → RED | FAINT-INK plant (tip opacity 0.15) and `widthK 1.0` plant → RED |
| G-DI6 no redraw on the first deal | with the first deal delayed to land after `drawn` (+700 ms at the worker seam): 0 `erasing` states on the boot; a second deal erases once (positive control) | the screencast run erased 917 → 1126 and redrew from 1141 | the watch reverted → RED |
| G-DI7 the settle | the live grain filter never paints on the boot (sl = 0 every sample, both engines); across the settle the grid's painted ink fraction never falls below 0.97× its rest value; PRM: 0 intermediate opacities | WebKit sl = 4 in the DEV/GV/ablation arms | crisp layer unmounted at `drawn` → RED |
| G-DI8 the price guard (not born-RED; a no-regression bound) | a tap on a cell at `drawQuiet` + 30 ms paints its selection within the control's response at the same wall time + one pose task + 34 ms; with `yieldBetweenPoses`, no second pose starts before the tap's frame; coarse rows `hasTouch: true` | main bakes at 150–600 ms, so its 2 s tap sees no bake: that is the control | yield off → the budget reads the full 4-pose block |
| G-DI9 π | outside the boot's claimed surfaces (grid draw, givens and tally write-in, wordmark reveal, the first-deal watch): computed paint properties + tags identical to the HEAD control at rest, both themes; `GameGallery.vue:377`'s deal reveal byte-identical (it passes `easeOutCubic` explicitly and reads `gridFrame.duration`, both unchanged); filterBudget 9 both regimes; `lint:motion`, `lint:bands`, the undefined-token census bare | — | — |

Declared deltas (not π, claimed): the wordmark's rest `clip-path: inset(0 0% 0 0)` → none; the hint's
one-cell and the solve's beat-1 write-in take `handStroke` (same 350 ms; the 3.2 s crest cap re-read);
PRM paints crisp instead of the live filter for its first ~0.8 s.

## 8 · Pass-7 charter rows (per owning family)

- **MOT-VERB (§13):** DI-1 `MOTION.curves.handStroke` + `--ease-handStroke` as writeIn's STROKE arm
  (the chair names it inside the closed verb set: an arm of writeIn, never a new verb); DI-2 the settle
  (`dusk` on `--ease-standard`, the exit gate); DI-3 the wordmark written (§4.3) with G-DI4's wordmark
  clause and G-DI1's write window; DI-4 row 40's recorder carries G-DI2/G-DI7. Composes with row 36
  (theme-free alpha bakes): that changes what the grid bakes, this changes when.
- **MOT-LADDER:** DI-5 `stallStepMs 34` and `wordmarkWriteMs 1200` homed; the three `--write-*` tokens
  in the ONE `@property` block with C6 green; DRAW_IN_PRESETS' durations read as rungs.
- **ACC-FIVE:** DI-6 the tally through `frontGate` takes `handStroke`; A.6's forced end-write cure and
  `maxStepMs` read the same rAF timestamp (one clock rule, merge watch).
- **Substrate (W6/W8, the pencil-boil 0.12.1 row, the owner's publish):** DI-7 `maxStepMs`,
  `yieldBetweenPoses`, `whenSequencesIdle()`: additive, default π; G-DI3 and G-DI8 name them.
- **Crossing for the chair (no loop family owns `GameBoard`'s generation watch):** DI-8 §4.5 with G-DI6.
- **New surface, no family:** DI-9 the point (§4.1) with G-DI5. The adjudicator mints or routes it
  (MOT-VERB is the nearest owner: it's a verb's detail).

## 9 · Ballots (U-10; loop-local labels, the chair mints ids after reading LEDGER's roster)

- **B-DI-1 the settle's form.** (a) default: crossfade over `dusk` 350 when the bitmaps land; (b) a cut
  on the first boil beat. Frames owed: a painted pair at settle −1 / +1 frame, DPR 2, both themes.
- **B-DI-2 the curve's reach.** (a) default: the boot's strokes, the givens/hint/solve write-in and the
  tally; (b) every stroke write-in in the estate (answer key, margin note, icons via `pencil-draw-on`).
  The gallery's deal reveal stays π under both.

## 10 · What DIES

1. Every bake inside a draw (grid 4 poses, wordmark 8), and the 12 back-to-back WebKit poses.
2. The wall-clock teleport: an unclamped `sequence` clock on the boot's strokes.
3. easeOutCubic on the grid's three tiers, the givens and the tally; easeOutQuint on the wordmark.
4. The rectangle clip-path wipe through filled letters, its double-rAF arm, and the mid-wipe live-filter
   → bitmap swap.
5. The live grain-filter fallback PAINTING on the boot (the crisp layer holds instead).
6. The erase-and-redraw of an empty grid on its first deal.
7. The random 12-line flash: jitter larger than the stagger.
8. The subgrid's 280 ms (→ `note` 250) and the old baseDelays 150/300 (→ 110/225).

## 11 · Gaps (a gap is a gap)

- WebKit's unattributed freeze (census G1): with the bakes out, what remains is unknown; the clamp turns
  it into a pause, which is not proven smooth. Under A.6 a WebKit-only red is a WebKit defect to find.
- The mask over the live-filtered wordmark pose in WebKit may re-run the wobble filter every frame
  (scale 3); unmeasured. Fallback if it costs frames: write over the crisp unfiltered `<text>` and let
  the wordmark's tooth settle with the grid's (B-DI-1's form).
- The bakes move from 150–700 ms to roughly 1.8–2.6 s (chromium arithmetic: the givens wave ends
  ~1.76 s), into the user's first-touch window. G-DI8 bounds the price; it depends on 0.12.1's yield.
- The settle is a visible texture change on a still board about 2 s after load. The owner may read it
  as a flicker; that's B-DI-1.
- 15 lines are still in flight at the peak. The front is ordered, not serial; "one hand" is not literal.
- Every row depends on the §13 fold (rungs, `@property` block) and three on an unpublished pencil-boil.
- The tip doubles the transient path count; its WebKit paint cost is unmeasured.
- 16×16 and the other games' boots are arithmetic only (census G7); the phone rows are emulation (G6).
- No crop exists of the proposed motion; the design's visual claims are arithmetic until prototyped.

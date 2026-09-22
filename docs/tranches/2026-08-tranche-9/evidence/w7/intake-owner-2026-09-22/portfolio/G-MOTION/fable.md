# G-MOTION · fable — A VERB NEVER BAKES

Designer: Fable 5.1 (frontend-design skill invoked; two passes: plan → tell review → spec).
Designed against MAIN `1e6cfbbf`, the product the owner audited. Ground: `census/motion/README.md`
+ `series.json` (the numbers below are the census's, none re-measured here), the marks file,
W7 §13, R6 Motion laws 1–8, registry-v3 §1 §13 + §2.7, pass-4 CHAIR-RULINGS §1.3/§2. Owning
families for the charter rows: MOT-LADDER (the rung), MOT-VERB (the verb), with W2's gallery
mechanics and W6/W8's substrate named where a row crosses them.

## 0 · The thesis, in one sentence

**A verb never bakes: every raster a move will land on is inked at idle, before the gesture, so
the sun's wring, the board's fold into its page and the page's unfold back to the desk are each
ONE unbroken sheet on the glass curve—no clip, no reparent in view, no frame the main thread
owes to a bitmap.**

The owner's sentence names one mechanism twice. "Shrinks the item and then teleports it" is a
STALL (M15: 108–193 ms chromium, 790–862 ms webkit, the incoming body first seen at 0.54–1.0)
and a CLIP + a SPACE ERROR (M19: visible fraction 0.234, a 92.7 px centre jump from a translate
written in viewport px and applied under `--live-fit`). Both curves are already right when the
frame is free ("the curve is continuous whenever the main thread is free"—census §1). The design
is therefore not a new curve, a crossfade or a re-time. It's a law about what a verb is allowed
to do inside its own frames, plus three geometry corrections so the fold is seen whole.

## 1 · Numbers first (the ground the design answers)

| surface | today on main (census) | the design's target |
|---|---|---|
| M15 cold flip, chromium 1280 light→dark | frames 150.4 + 149.8 ms; moon born 0.686 at +263 | born ≤ 0.30; no frame > 34 ms in +0…+900; Δscale ≤ 0.08/frame |
| M15 cold flip, webkit 1280 | ONE 829–862 ms frame; born 0.253–1.00 | same |
| M15 warm flip, webkit 1280 | 4–7 frames > 50 ms per flip; born 0.39–0.71 | 0 frames > 50 ms (M15-b; W6's, carried RED, not claimed here) |
| M19 enter, chromium 1280 | 92.7 px centre jump on the reparent frame; visible 0.234; 57.9 ms frame | frame-1 centre ≤ 3 px; visible 1.0 every frame; 0 frames > 25 ms in +200…+800 |
| M19 enter, webkit 390 coarse | the whole fold in 3 frames (162/123/78 ms) | ≥ 20 frames |
| M19 exit, chromium 1280 | first-frame pop dy −35.2 / dw +28.8 (FIRST is the card, not the board); centre card 407.9 → 104 px | anchor ≤ 2 px; card height constant ± 1 px while it fades |
| M19 exit, 390 coarse both engines | 135.3 / 135.7 px drop at deck unmount | 0 frames with a > 20 px step after frame 1 |
| PRM both verbs | same-frame cut, 0 movers (conforms) | unchanged; the toggle's PRM cut lands on time once §3.1 holds |

## 2 · Pass one: the plan (tokens · type · layout · principles)

Colour and type are not this group's axes: the fold moves PAINTED bitmaps and mints no colour, no
string, no glyph. The plan's tokens are motion tokens; the layout is a z-order and a flow rule.

**Tokens (values).**
- `MOTION.boardFoldMs` 520 · `MOTION.curves.drawerGlide` `cubic-bezier(0.32, 0.72, 0, 1)`—the
  fold and the unfold, unchanged (T4-W12's decision already rides the glass curve; ruling 1's
  scope fence is not re-entered, nothing is re-eased or re-timed).
- `MOTION.chromeLeaveMs` 200 · `--ease-glassGlide`—beat 0 (chrome leaves) and the deck's
  dissolve, its twin, unchanged.
- `MOTION.beatMs` 125—the idle-warm chunk: one pose per beat window, never two in a frame.
- `--live-fit` (App-set, `<number>`)—REGISTERED under the @property law: first static
  stylesheet, `inherits: true`, `initial-value: 0` (a board scaled to nothing is a visible
  failure), consumed bare. The `var(--live-fit, 1)` at `GameCard.vue:467` DIES.
- `--deck-top` (App-set, `<length>`)—new, registered the same way, `initial-value: -9999px`
  (a leaving deck that jumps off-screen instead of dissolving in place is a visible failure).
- The deal's `stagger = 90` (`GameGallery.vue:372`) is a timing literal outside pencilConfig
  (R6 law 4 breached today). It goes HOME as the rung the ladder already names for a one-step
  dwell; no new number. LADDER's row.
- The Bloom's own numbers (wring 340 `--ease-accelIn`, bloom 800 `--ease-springPop` @60,
  dusk 350 `ease`, plush 1010, backstop 1100) stay VERBATIM. §13's homing of them into the verb
  tuple is VERB's pass-4 work and is not re-opened by this spec.

**Type.** None. Zero rendered-string delta; `check-copy-register` bare stays at its current
count. The moves carry no words (the M16 register has nothing to say and says it).

**Layout (the two verbs as one grammar).**

```
ENTER (fold)                              EXIT (unfold)
t=0     chrome leaves (200, beat 0)       t=0   FIRST = the board's PAINTED face rect
        board HOLDS at full pose                (not the card); deck goes OUT OF FLOW
t=200   deck mounts, LAST read;                 at --deck-top and dissolves (200);
        the fold RUNS ON THE NEXT FRAME         the home layout is final from frame 1
t=200…720  the board shrinks UNCLIPPED    t=0…520  the board rises OVER the dissolving
        over the deck; the flank cards          deck (top hit at its centre every frame)
        deal from under its edges (0.42·520     wordmark rides the same clock
        + stagger); wordmark on the same clock
t=720   settle: slot clips again, z-order  t=520  settle
        rests, the fit is identity
PRM     cut (no beat 0, no fold, no deal)  PRM   cut
```

Alignment: the fold is centre-anchored (`transformOrigin 50% 50%`, existing), the sheet's
centre travels a straight line from the board's rest centre to the face's centre; nothing else
on the page moves during either verb except the wordmark (its own FLIP on the same clock) and
the flank cards' draw-in.

**Principles.**
1. A verb never bakes. Every raster the move lands on—the counter-theme grid and logo stacks,
   the wordmark's gallery-pose stack—is resident before the gesture. A verb that finds its
   raster missing runs on the raster it has and bakes at settle, never inside its frames.
2. The sheet is seen whole. No clip, no reparent between painted frames; a DOM move happens
   pre-paint at identity or under a full-size, unclipped pose.
3. Space is one space. A translate is written in the space it's applied in.
4. The page under a moving sheet doesn't move. The deck dissolves out of flow; the centre card
   keeps its box while it fades.
5. One clock, one curve, no stagger among movers (useFlipGlide S1–S4, kept).
6. PRM is a cut, and a cut lands on time (principle 1 is what makes it so).

## 3 · Pass two: the tell review

What the generic answer to "shrinks then teleports" is, and why each is refused:
- **A crossfade between the two stacks / a longer Bloom to "cover" the stall.** Hides the
  symptom, keeps the 829 ms frame, and M09 forbids buying a cure with the surface's quality
  (the census's "masked by the toggle's Bloom" comment at `HandDrawnGrid.vue:179–180` is exactly
  this default, and measurement refutes it). Refused; the comment DIES.
- **A lower-resolution bake to make the flip cheap.** M09, verbatim. Refused (§4 gate G9).
- **Move the warp to a compositor channel.** The §2 crispness contract and the soul gate
  forbid it; the census says so; refused, and if the owner wants it traded it's the chair's row.
- **A new "lift" decoration (shadow, tilt, scale-up) on the flying board.** The generic
  hover-card tell. The board already wears its drawn frame; the memorable thing is that it's
  SEEN WHOLE, not that it's dressed. Refused; the fold mints no paint.
- **A spring / overshoot on the fold, or a re-time to 600.** Ruling 1's curve is the glass
  family, zero overshoot; chair §1.3 "a rung is not a licence to re-time a ratified pose".
  Refused; 520 stands.
- **Fade the deck in with a slide-up.** The deal already IS the entrance (draw-in from the
  centre out); nothing added.
What's left after the review is a law and three geometry cures, which is the design.

## 4 · The spec

### 4.1 M15 — the theme flip: the page is inked on both sides

**Components.** `HandDrawnGrid` (grid stack, `grid-<n>-<m>-<d|l>`), `HandwrittenLogo` (logo
stack, `logo-<label>-<d|l>-<vbWidth>`), `DarkModeToggle` (the Bloom, untouched), the W8 boot
seam (`after first paint`, C-series) as the idle hook, `@mkbabb/pencil-boil` `useRasterStack`.

**The rule.** After first paint and once the current theme's stacks are resident, each surface
warms its COUNTER-THEME stack at idle: same `cssSize`, same `dpr`, same `poseCount`, one pose per
`MOTION.beatMs` window (never two encodes in one frame; the census attributes 69–113 ms per
pose). The flip is then an opacity swap of resident bitmaps and the Bloom shares its frames with
nothing. The library's cache is already shaped for it ("2 × 2 residents … across a theme flip",
`raster.d.ts` §poseCacheSize); what's missing is a way to fill the second pair before the key
changes.

**Two forks the owning family builds and measures (both arms framed; the chair/owner disposes):**
- **Fork W (the warm seam).** `useRasterStack`'s cache is per instance (`vue.js:471`); the
  handle gains `warm(opts)`—encode + `retain` under the given key, no swap—a pencil-boil minor
  (W6/W8 substrate row; the W8 seal's 0.12.1 publish is the vehicle). App calls it from the
  boot seam's idle hook with `isDark` inverted in the key. DEFAULT.
- **Fork C (the colour).** The counter-theme stroke colour can't be resolved by
  `resolveCssValue` under the live root (light lives on `:root`, dark on `.dark {`,
  `index.css:308/401`; a descendant inherits the live theme). Default: read both values ONCE from
  the CSSOM at idle (the `:root` and `.dark` rules' `--grid-line-color`) and hand `poseSvg` the
  colour explicitly. Alternative: a hidden `.dark` probe child for the dark value only (the light
  value has no scope to probe under a dark root). A pencilConfig pair is REFUSED (it re-mints a
  token index.css owns).

**The fallback when a raster isn't resident** (a flip inside the idle window, a resize between
flips): the surface keeps its live-filter `<g>` fallback (today's path) and the bake lands at
settle. NOT "hold the old-theme raster until settle": a light grid (hsl 0 0% 15%) on a dusked
dark ground vanishes for 1.1 s—worse than the stall. The fallback is bounded by G8's residency
gate, not designed around.

**Logo: both widths, both themes.** The wordmark's key carries `vbWidth`, so the fold changes it
(playing 765 → gallery 554 at 1280; 485 at 390) and the re-bake ran 4× inside the fold
(M19-e). The idle warm covers the wordmark's OTHER pose width in the current theme as well; the
cache's four residents are exactly 2 themes × 2 widths. A viewport resize re-warms at idle.

**M15-b (WebKit warm cost, Vue's `isDark` path)** is W6's attribution row and stays RED and
UNCLAIMED here; the design only removes the bake half. `series.json` ablation F is the pointer.

**Light AND dark, phone AND desk.** The rule is symmetric; the gates run both directions from
both boots at 1280 fine and 390 coarse (`hasTouch: true`).

### 4.2 M19 — the board's two verbs: fold and unfold

**Components and states.** `App.vue` §"THE ONE BOARD'S MOVE" (`enterGallery`, `onLiveFace`,
`unfoldToBoard`, `runFold`), `useFlipGlide` (unchanged engine), `GameCard.vue` (`.live-face-slot`,
`.live-face-fit`), `GameGallery.vue` (deal), the deck's `<Transition name="gallery-fade">`.
State classes, all transient and cleared at settle: `.game-card.is-center.is-folding` (enter,
520 ms), `.board-group.is-unfolding` (exit, 520 ms), `.gallery-fade-leave-active` (exit, 200 ms,
existing). Rest = none of them; PRM = none of them.

**Fold (enter), four cures on the existing choreography.**
1. *One space (M19-a).* The mover stays `.board-peek-host` inside `.live-face-fit`; the FLIP
   translate is divided by the fit: `translate(dx/f, dy/f) scale(s)` where `f = --live-fit`
   (read from the mount's own inline property, one number), `s = first.width/last.width` as
   today. The error (1 − f)·Δ = 89.9 / 20.0 px goes to 0 by construction. `flipTransform`
   gains an optional parent-scale argument; the drawer (f = 1) is byte-identical.
2. *Seen whole (M19-b).* For the fold's 520 ms the centre card is `.is-folding`:
   `.live-face-slot { overflow: visible }` and the card lifts above its flanks
   (`z-index` on the centre card only, inside the deck's own stacking context). The full board
   shrinks over the deck; the flank cards draw in from under its edges on the existing deal
   clock (0.42 · 520 + stagger). At settle the class drops: the slot clips again, the z-order
   rests, π at rest is untouched.
3. *The head frame is a frame (M19-e).* The deck mounts in beat 0's timeout task (41 ms LoAF);
   `onLiveFace` reads LAST in `nextTick` and starts the fold in that same task. The `run` moves
   to the next animation frame (`requestAnimationFrame` after the LAST read), so the mount task
   paints once, then the fold's first frame is a clean one. The wordmark's gallery-pose bake is
   resident before the fold (§4.1's logo rule), so nothing bakes in +200…+800.
4. *Deep link and PRM* land the face with no fold (existing); `.is-folding` never applies.

**Unfold (exit), three cures.**
1. *FIRST is the face (M19-c).* `unfoldToBoard` reads `.board-peek-host`'s rect (the painted
   board inside the fit) before `moveLiveBoard(null)`, not `centerCardEl()`'s. The card's rect
   dies as an anchor; `centerCardEl()` survives only if another caller needs it (none today—it
   DIES with its consumer).
2. *The page under the sheet doesn't move (M19-d).* App reads the deck's `offsetTop` before
   `applyState()` and writes `--deck-top`; `.gallery-fade-leave-active` becomes
   `position: absolute; left: 0; right: 0; top: var(--deck-top)`. The deck dissolves in place
   out of flow, so the playing layout is at its final pose when `runFold` reads LAST, and the
   unmount at +200 moves nothing (the 135 px drop dies at both pointer classes). The centre
   card keeps its box while fading: the face wrapper carries the poster's 1/1 aspect at all
   times (today the box collapses 407.9 → 104 when the live board leaves it).
3. *The board rises over the deck.* `.board-group.is-unfolding` gives the board's wrapper
   `position: relative; z-index: 1` above the dissolving deck (`z-index: 0`), never a negative
   index (the page-root ground is opaque). elementFromPoint at the board's centre returns the
   board on every fold frame.

**Motion table (curve · duration · home). No new literal, no re-time.**

| verb | movers | curve | ms | home |
|---|---|---|---|---|
| chrome leaves (beat 0) | controls, drawer (opacity) | `--ease-glassGlide` | 200 | `MOTION.chromeLeaveMs` |
| fold | board, wordmark (transform) | `MOTION.curves.drawerGlide` | 520 | `MOTION.boardFoldMs` |
| deal | flank cards (draw-in) | `easeOutCubic` (existing) | `gridFrame.duration`, delay 0.42·520 + stagger·(d−1) | the stagger's rung → `MOTION` (LADDER) |
| unfold | board, wordmark (transform) | `drawerGlide` | 520 | `MOTION.boardFoldMs` |
| deck dissolves | deck (opacity, out of flow) | `--ease-glassGlide` | 200 | `MOTION.chromeLeaveMs` |
| theme turns | sun/moon warp, dusk grounds | authored (accelIn/springPop/ease) | 340 / 800@60 / 350 | DarkModeToggle + index.css, verbatim; VERB's homing row |
| PRM | none | cut | 0 | law |

**Phone AND desk.** At 390×844 coarse the fit is 0.7 (366 → 256.22) and the flanks sit mostly
off-screen; the unclipped sheet covers the deck's edge cards for ~300 ms, which is the intent.
At 1280 the sheet (640 px) covers both flanks until ~60 % of the fold. Landscape phones follow
W2 §2.2's regime unchanged (the verbs don't read a media query; they read rects).

**Light AND dark.** The verbs move bitmaps and mint no colour; the evidence set MUST carry the
dark arm (the census's own gap: "not measured: the move scenario in dark theme")—every M19 gate
runs light and dark, and the M15 gate runs both directions.

**Copy (M16).** None minted. No aria string changes: the moves are visual; the live region
already speaks the view change (W3) and isn't touched.

### 4.3 What DIES

- `var(--live-fit, 1)` at `GameCard.vue:467` (a fallback on a measured token; the @property law).
- `centerCardEl()` as the exit's FIRST (and the function, with its last consumer).
- `.live-face-slot`'s clip DURING the fold (state-scoped; the rest clip stays).
- The in-flow deck leave (`.gallery-fade-leave-active` in flow).
- The fold's `run` inside the mount task.
- `stagger = 90` as a literal (`GameGallery.vue:372`) → the ladder's rung.
- `HandDrawnGrid.vue:179–180` "masked by the toggle's Bloom" (a claim the census refutes; the
  comment says what the code no longer does).
- The mid-fold wordmark re-bake and the cold-flip in-Bloom bakes (moved to idle).

Nothing else moves: the toggle's Bloom, the drawer, the carousel step, the deal's draw-in and
every rest pose are π against `1e6cfbbf`.

## 5 · Born-RED gates (each RED on main today by the census's own instrument, measured its way)

| # | gate | RED on main (census) |
|---|---|---|
| G1 | enter frame 1: board centre within 3 px of its rest pose; 1280 fine + 390 coarse, both engines, both themes | 92.7 / 127.4 / 21.5 px |
| G2 | enter: painted visible fraction = 1.0 on EVERY fold frame (rAF sampler + screencast) | 0.234 → 0.91 |
| G3 | enter: 0 frames > 25 ms in +200…+800 both engines; webkit 390 fold ≥ 20 frames; `drawImage` hook 0 bakes inside the fold window | 1 / 4 / 5 frames; wordmark re-bake ×4 |
| G4 | exit frame-1 anchor error ≤ 2 px (dy, dw) vs the board's painted face | dy −35.2 / dw +28.8; dy −34 / dw +46.4 |
| G5 | exit: centre card height constant ± 1 px while it fades; 390 coarse: 0 frames with a > 20 px step after frame 1; wordmark `h1` same | 407.9 → 104 / 132.7; 135.3 / 135.7 px |
| G6 | exit: `elementFromPoint` at the board's centre is inside `.board-peek-host` on every fold frame (the deck isn't `inert` on exit, so the instrument sees) | not measured on main—instrument written first, its negative control = the leaving deck without the z-order |
| G7 | cold first flip, both engines, both directions, both boots: incoming born ≤ 0.30, no frame > 34 ms in +0…+900, per-frame Δscale ≤ 0.08 | born 0.544–1.00; 150–862 ms frames |
| G8 | residency: after the boot seam's idle window, the counter-theme grid + logo stacks and the logo's other-width stack are cache hits (`drawImage` 0 in a flip window; 0 in a fold window) | 8 bakes per cold flip |
| G9 | M09: the warmed stack's `cssSize × dpr` and `poseCount` equal the live stack's; a fresh bake of the same key is BYTE-IDENTICAL to the warmed blob (pencil-boil's blob-identity proof, per engine) | n/a today (no warm exists) |
| G10 | π at rest: computed paint properties + tags on every surface the marks don't name, HEAD control `1e6cfbbf`, playing + gallery × light + dark × 1280 + 390 pinned by an ENCODED `?board=` payload (chair addendum); goldens 4/4; filterBudget exactly 9 both regimes, hovered and at rest, DURING the fold too | must read 0 moved |
| G11 | PRM: 0 movers on both verbs (same-frame cut, kept); the toggle's PRM cut lands with no frame > 34 ms cold (rides G8) | cut lands late: 175–783 ms frames |
| G12 | @property: `--live-fit` and `--deck-top` registered in the first static stylesheet, `inherits: true`, failing initial values, consumed bare; ablation on a declaring host shows the visible failure | `var(--live-fit, 1)` present; `--deck-top` absent |
| G13 | `lint:motion` bare; no timing literal outside pencilConfig in the diff; the stagger homed | `stagger = 90` |
| G14 | `check-copy-register` bare: rendered-string delta 0 | (holds; a negative control plants one string) |
| G15 | M15-b carried: warm flip webkit 1280, 0 frames > 50 ms—W6's row, RED, not claimed by this fold | 4–7 |
| G16 | a fold interrupted by a re-press (mid-glide cancel / select) settles with `.is-folding` / `.is-unfolding` / `--deck-top` cleared and the slot clipping again (three still frames, 0 style writes) | not measured—new instrument |
| G17 | the deck's dissolve out of flow doesn't move `document.scrollingElement.scrollTop` at 390×844 when the page is scrolled to the deck (scroll anchoring) | not measured—new instrument, negative control = in-flow leave |

Budgets are rates (per second), never per-frame counts; `getAnimations()` on the ancestor path.
Every gate is a shell-script battery, run in the background with a log, chunked by engine.

## 6 · Gaps, risks, ballots (unoptimistic)

- **The warm seam is a library change** (pencil-boil `warm()`); until it publishes, G7/G8 can't
  go green on this design. An app-side second `useRasterStack` instance with the inverted key
  is REFUSED as the route: its cache isn't the live instance's (`vue.js:471`), so the flip
  would still miss.
- **The counter-theme colour** has no in-cascade probe for light-under-dark; the CSSOM read is a
  new instrument with its own failure mode (a `@layer`ed or cross-origin sheet). G9's
  byte-identity is what holds it honest.
- **Memory.** A resident counter-theme grid stack at DPR2 1272² × 4 poses is roughly the live
  stack's own residency again (the grid's comment prices 8 MB post-cap). The W8 device RUNSHEET
  gains a row: the flip on the real iPhone with both stacks resident; if the device evicts, the
  fallback is today's path, bounded by G8.
- **Headless WebKit isn't Safari** (census gap): every WebKit number is a proxy; M19's rule
  forbids `osascript` / `open -a Safari`, so the owner's re-look on the device is the only
  Safari reading.
- **Overflow visible during the fold** paints the full-size filtered board over the flanks; the
  raster census (R6 law 12, union area ± 2 %) must be read DURING the fold, not only at rest—
  the board is one counted surface, the flanks aren't filtered, so the count shouldn't move, but
  it's measured, not assumed.
- **Out-of-flow deck leave** shortens `.board-group` at frame 1 (the final height); if the page
  was scrolled to the deck, scroll anchoring may jump (G17). If it does, the alternative is to
  read LAST after the unmount and start the unfold 200 ms late—the board stops being the
  protagonist, which is why it's the alternative and not the default.
- **The fit divided into the translate** assumes the mount's inline `--live-fit` is the only
  scale on the path (true today: `.live-face-fit` is the one transform). A second scale on the
  path (the case's height law scaling the card) would need the product; G1 catches it.
- **Ballot T9-B10 (proposed, the owner's):** on enter, should the flank cards deal from under the
  shrinking sheet (default: yes, the existing 0.42·520 clock, the neighbours revealed as the
  board becomes its page) or wait for the settle (the deck dealt onto a still page)? Both arms
  buildable in one class; frames at 1280 light for the re-look.
- **Nothing here retires M15 or M19** (U-10). The owner disposes at the re-look.

## 7 · Charter rows for pass 5 (owning family named)

| row | family | the sentence | gate |
|---|---|---|---|
| P5-M15-1 | MOT-VERB × W6/W8 | the idle warm: `warm()` on the raster handle, the boot seam's idle hook, counter-theme grid + logo + the logo's other width, one pose per beat | G7 G8 G9 |
| P5-M15-2 | MOT-VERB | the counter-theme colour read (CSSOM default; probe alternative), byte-identity held | G9 |
| P5-M15-3 | W6 (carried) | WebKit's `isDark`-path cost attributed to a function on a Safari timeline | G15 |
| P5-M19-1 | MOT-VERB × W2 | `flipTransform` parent-scale; `.is-folding` slot unclipped + centre card lifted; the fold's `run` on the next frame | G1 G2 G3 |
| P5-M19-2 | MOT-VERB × W2 | exit FIRST = the board's face; `--deck-top` + out-of-flow dissolve; the card's box held; `.is-unfolding` z-order | G4 G5 G6 G17 |
| P5-M19-3 | MOT-LADDER | `--live-fit` / `--deck-top` registrations; the deal's stagger homed as a rung; `lint:motion` | G12 G13 |
| P5-π | both | π + goldens + filterBudget + copy delta on the merged §13 tree, dark arm included | G10 G14 G16 |

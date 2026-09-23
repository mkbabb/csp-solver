# G-DRAWIN · adjudication — the apotheosis (T9-M20)

Adjudicator: Fable 5.1, 2026-09-23. Two designs competed against MAIN `1d0dc4fd` (product `74a2b5d9`):
`portfolio/G-DRAWIN/fable.md` (ONE PENCIL) and `portfolio/G-DRAWIN/opus.md` (THE PENCIL'S POINT).
Ground read whole: `census/drawin/README.md` + `series/summary-*.json` (every number below is the
census's unless marked NEW or COMPUTED), crops 2 and 4 viewed, the marks file, pass-6 `CHAIR-RULINGS.md`
Addendum A whole (A.1.7, A.5.3, A.5.7, A.6), registry-v5 §1 (§13 MOT-VERB 81 · MOT-LADDER 76 · §3
ACC-FIVE 83) and §2.3/§2.5, registry-v0 §13, R6 laws 1–16, W7 §13, the prior intake's `adjudicate/G-MOTION.md`
and `INTAKE.md` §7–8 as the form, and main's own source: `HandDrawnGrid.vue` (:180–300, :320–400),
`usePathAnimation.ts`, `HandwrittenLogo.vue` (:253–263, :680–686, :455–489), `pencilConfig.ts:465–507`,
`GameBoard.vue:966–977`, `useGameState.ts:251,:610`, `GameGallery.vue:370–385`, `scene.css:608–618`,
`node_modules/@mkbabb/pencil-boil` 0.12.0 `vue.js` (:194 the sequence clock, :458–560 `useRasterStack`)
and `raster.js`. Curve and schedule arithmetic re-derived in node (`<scratchpad>/adj-drawin/curves.mjs`,
no product code). No server started, no port bound, nothing outside `docs/` touched, no rm. Nothing
here retires T9-M20 (U-10).

Three facts of main that bind the adjudication and that neither design carries whole:

1. **pencil-boil is npm `^0.12.0`, not file-linked** (`package.json:71`; `node_modules/@mkbabb/pencil-boil`
   is a directory, `csp-solver-wasm` the symlink). Every library seam in both specs — Fable's `stepMs`,
   `easeHand` in the roster, `poseCadence: 'beat'` + `resume()`; Opus's `maxStepMs`, `yieldBetweenPoses`,
   `whenSequencesIdle()` — is 0.12.1, HELD to the seal (LEDGER T9-R4). A fresh worktree off main with no
   `npm install` cannot go green on any of them. The prototype is LIBRARY-FREE by construction; the
   library rows are crossings, framed as the later home.
2. **`useRasterStack`'s `stackKey` includes `poseCount`** (`vue.js` §stackKey) and a `poseCount ≤ 1` stack
   never subscribes to the beat. So "pose 0 first, the rest after" is a REACTIVE `poseCount` (1 → n) on the
   one existing instance: a consumer-side form of Fable's cadence that costs one repeated pose-0 encode
   and no library change. Fable did not see it; Opus rejected the pre-bake as "200–700 ms" because it
   priced all twelve poses, not the one the hand needs.
3. **`GameGallery.vue:377` reads `DRAW_IN_PRESETS.gridFrame.duration`** for the gallery's deal reveal.
   Fable's 350 → 520 moves a surface the mark does not name; Opus caught it and kept 350. The hand's frame
   duration therefore cannot live in `gridFrame.duration` while the gallery borrows it.

## 0 · Verdict

**Fable's LAW is the thesis; Opus's POINT is the pencil the eye actually sees, and Opus's CURVE and CAP are
the numbers the law runs on.** Both designs read the census the same way — the stall is the bake landing
inside a wall-clock tween, and "not pencil-like" is a 3× launch, fifteen fronts, a round-cap tip, a grain
step and a rectangle sliding off set type. They part on four axes, and the artifacts decide each:

- **Order.** Fable's one hand (≤ 2 fronts live, each line landing at the last one's lift) answers the
  owner's word "pencil like" where Opus's ordered ruling front (15 lines in flight, jitter under half the
  stagger) answers M09's speed half. Neither is refuted by a constraint; the price is the owner's (Fable's
  9×9 last stroke 2.36 s from the rubbing's onset vs Opus's 575 ms). This is the ballot, both arms built
  on one floor, default ONE HAND with the cost printed (§6).
- **The drawing layer.** Fable's masked pose-0 bitmap (the grain on the page from the first stroke, no
  handoff frame) is the default; Opus's crisp stand-ins with a `dusk` crossfade are the fallback arm —
  Opus's own B-DI-1 names the settle as "a visible texture change on a still board the owner may read as
  a flicker", which is the census's handoff step moved later and spread over 350 ms, a wash. The one
  unmeasured cost (the mask over a 1272² bitmap per frame) is a gate, G-D6b, not a ballot; both arms build.
- **The tip.** Opus's bead (a wider, denser lead that dries into the line at the lift) over Fable's faint
  lead (a 0.45-luminance mask stroke 4 % ahead). The lead is REFUSED under A.5.3: COMPUTED over the cell
  tier, 0.7 × 0.45 = 0.315 alpha of `#262626` on `#faf8f5` paints ≈ 1.4:1 (the frame ≈ 1.7:1) — under the
  FAINT-INK plant's own class (1.2:1), a drawn thing that exists and is not visible. The bead reads ≥ 1.15×
  its body's density and 1.35× its width (Opus's G-DI5 numbers), and it composes with either layer arm as a
  transient path over it. The bead is the point; the lead dies.
- **The curve and the clock.** Opus's `handStroke = cubic-bezier(0.35, 0.05, 0.25, 1)` over Fable's
  minimum-jerk `easeHand`: COMPUTED touch-down 0.14× mean, peak 2.394× at t = 0.286, 50 % drawn at
  t = 0.34, end speed 0 (easeHand: 0 → 1.875× at 0.5, symmetric). The asymmetric bell is the hand's
  (fast on, slow off, a stop), it has a CSS twin for free when a CSS consumer appears (R6 law 3) and it
  homes in `MOTION.curves` on main without a library roster change. The cap: neither number survives
  whole. Fable's 16 (= `FRONT_MIN_MS`) engages on EVERY healthy 60 Hz frame (16.67 > 16) and slows the
  hand 4 %, which its own "tolerance stepMs − 1" concedes; Opus's 34 lets a dropped frame move a
  150 ms line 54 % (COMPUTED, 2.394 × 34/150). RULED: **stepMs = 17** — one 60 Hz frame at WebKit's 1 ms
  quantisation (A.6), never engaging on a healthy frame in either engine, capping a dropped frame to one
  frame's travel: worst Δ per painted frame frame-side 31.3 % (7.8 % of the perimeter), subgrid 16.3 %,
  cell 27.1 % (COMPUTED; HEAD 72–100 %). Homed as `MOTION.hand.stepMs`, read as `FRONT_MIN_MS + 1` when
  ACC-FIVE's primitive folds (row D11).

Agreed by both and taken as written: nothing bakes under a moving hand; the boot's first deal never
turns the page; PRM is a cut and the live grain filter never paints on the boot; the wave and the tally
keep their numbers; zero copy delta; filter budget 9 with masks and gradients not counted (law 9).

## 1 · The census, reconciled (what the apotheosis answers)

| surface · cell | on main (census) | the apotheosis's target |
|---|---|---|
| grid draw, chromium d cold light | frozen 200–226 ms; worst one-frame Δ 72–76 %; 4/4 poses inside the draw (36/36 runs); 15 fronts | 0 encodes from the first stroke to the wave's last; worst Δ ≤ 7.8 % perimeter / 16.3 % subgrid / 27.1 % cell under a 150 ms injected block; arm Q ≤ 2 fronts |
| grid draw, chromium d cold dark | frozen 309–386; Δ 87–88 % | the same; the dark pose 0 (66–82 ms) lands BEFORE the hand, printed as h |
| grid draw, WebKit d cold light / dark | frozen 385–446 / the draw swallowed whole; 5–17 of 17 lines never partial | every line seen partial in ≥ 2 painted frames; a residual WebKit freeze becomes a PAUSE of the hand (G-D1) and lengthens h/tempo (G-D10), never a jump |
| ABLD (grid bake held past the draw) | frozen 33–58, Δ 26–33 %; the residue is the wordmark's 8 poses | both stacks reduced to pose 0 before the hand, the rest after the wave — ABLD is the lower bound |
| launch profile, every tier | easeOutCubic: 48.8 % of the line at 20 % of its time, 3.0× at t = 0 | handStroke: 18.0 % at 20 %, 0.14× at t = 0, peak 2.39× at 29 %, a stop at the end |
| the tip | a full-width round cap, uniform pressure | a bead 1.35× wide at ≥ 1.15× its body's density, `lengthK 2.5`, drying over `whisper` 150 at the lift |
| wordmark | a 1.2 s easeOutQuint clip wipe, 50 % at 155 ms then a 757 ms creep; a hard vertical cut through "sud\|" (crop 2); live filter → bitmap swap mid-wipe | a 520 ms rubbing on the hand clock over the RESIDENT pose 0: a 105° feathered front ≥ 0.35 em wide, no live filter in the painted tree |
| handoff | crisp → grain in one step 27–38 ms after the last line; WebKit lands on the LIVE filter (sl=4) for 0.4–0.75 s | arm A: no handoff frame (the thing drawn IS pose 0 through a mask; ink Δ ≤ 1/255); arm B (fallback): a declared `dusk` crossing, never under 0.97× rest |
| PRM | a cut; the live grain filter paints 759–793 ms chromium, > 5 s WebKit | a cut from crisp unfiltered stand-ins to the whole stack; 0 live-filter frames |
| boot deal | erases a DRAWN grid and redraws (screencast 917 → 1126 → 1141); :3001 deals at 843–1212 ms | the 0 → 1 generation bump with unchanged geometry never erases; a second deal still does |
| chrome | fade 250 `--ease-drawOn` +150 from MOUNT | numbers verbatim; trigger = the frame's first stroke, so the grid leads when h is 300–500 ms |
| tempo, chromium d cold (from the rubbing's onset) | grid done ≈ 0.56 s; last given ≈ 1.5–1.76 s | arm Q: frame 312–832, last line ends 2364 (2052 from the frame's onset), last given ≈ 3.4 s; arm F: last line ≈ 575 ms after the frame's onset, last given ≈ 1.6–1.9 s; 16×16 arm Q 3.74 s — all PRINTED as rates (G-D10), the ballot's price |

## 2 · The apotheosis

### 2.1 Tokens (homes; nothing minted that a consumer does not read)

| token | value | home | note |
|---|---|---|---|
| `MOTION.curves.handStroke` | `cubic-bezier(0.35, 0.05, 0.25, 1)` | `pencilConfig` MOTION.curves (TS) | JS consumers only on the boot → TS only (law 3's partition by consumer); the `--ease-handStroke` twin is minted with its FIRST CSS consumer, not before. A ~20-LOC solver `handStroke(t)` parses the same string; a unit asserts 41 samples against the CSS twin's arithmetic to 1e-4 |
| `MOTION.hand.stepMs` | 17 | `pencilConfig` MOTION.hand | one 60 Hz frame at 1 ms quantisation; ACC-FIVE's `FRONT_MIN_MS + 1` when the primitive folds (D11); never engages on a healthy frame at 60 or 120 Hz |
| `MOTION.hand.lift` | 0.6 | MOTION.hand | arm Q: the raw time at which the next line lands (68.3 % drawn on easeHand; on handStroke 87.0 % — COMPUTED; the overlap is the lift-and-land, ≤ 2 fronts) |
| `MOTION.hand.order` | `'serial'` \| `'front'` | MOTION.hand | the ballot's const; the losing table dies at the fold |
| `MOTION.hand.serial` | frame 520 (`throw`) · subgrid 250 (`note`) · cell 150 (`whisper`) · rubbing 520 (`throw`) | MOTION.hand | Fable's rungs; `gridFrame.duration` stays 350 for the gallery (fact 3) |
| `DRAW_IN_PRESETS.gridFrame/gridSubgrid/gridCell` | 350 · joints 4 / 250 · baseDelay 110 · sweep `beatMs` 125 · jitterFrac 0.2 / 200 · baseDelay 225 · sweep 150 · jitterFrac 0.3; `timing: "handStroke"` on all three | `pencilConfig` | arm F's table (Opus's); 280 → 250 is a SHORTENING B6's ratchet must see as deliberate (D10) |
| `DRAW_IN_PRESETS.tip` | lengthK 2.5 · widthK 1.35 · opacity {frame 1, subgrid 1, cell 0.9} · dryMs 150 (`whisper`) on `--ease-fadeOut` | `pencilConfig` | Opus's bead |
| `MOTION.hand.rubFeatherEm` · `rubLeanDeg` | 0.35 · 105 | MOTION.hand (TS) | the rubbing is a JS-driven SVG mask; a TS home, no CSS token, no `@property`, no census extension |
| `DRAW_IN_PRESETS.glyph` | 350 · `easeOutCubic` (verbatim) | unchanged | ballot 2's arm (b) is the one field `timing: "handStroke"` |
| the erase | 150 easeInCubic, `delay i·4` | unchanged | the page's act, not the hand's |

Filter budget 9 both regimes, unmoved: masks, gradients and unfiltered transient paths are not filters
(law 9, 12). `--ease-noteWrite` keeps its other consumers.

### 2.2 The hand (smooth): one clock, one curve

`usePathAnimation` keeps ONE master `createSequenceSubscription` whose `durationMs` is the schedule's
length plus a margin and reads its `raw` as the rAF timestamp (`timestamp = start + raw·D`, A.6's clause:
the comparison reads the rAF clock, never `performance.now()`). The hand's clock advances
`min(Δtimestamp, MOTION.hand.stepMs)` per tick and every line's progress is read off that clock — a
300 ms stall lengthens the draw by ≈ 283 ms and moves no line more than one frame's travel. Unset (every
other consumer) is byte-identical because nothing else is touched. ≈ 25 LOC; the library form
(`createSequenceSubscription({ stepMs })`, 0.12.1) deletes it (D13). Every tier and the rubbing run on
`handStroke`. The frame's one closed path is four side-bells: `side = floor(4·raw)`, `local = 4·raw − side`,
`progress = (side + handStroke(local)) / 4` — the hand stops at each corner. Under arm Q the frame side is
130 ms (7.8 painted frames at 60 Hz), a cell 150 (9.0), a subgrid 250 (15.0) — COMPUTED; the per-frame
peak advance on a healthy 60 Hz frame is 30.7 % / 26.6 % / 16.0 % of the line.

Two schedule builders, one const: `serial` (delay(i) = Σ lift·D(j) over [frame, sub×n, cell×m]; no
stagger, no jitter, `mulberry32(77)` unused) and `front` (Opus's onsets = baseDelay + i·sweep/(n−1) ±
jitterFrac·stagger, seeded as today, verticals then horizontals). Both resolve when the last line lands.

### 2.3 The layer (pencil-like, the grain): pose 0 first — arm A default, arm B fallback

**Bake order (both arms).** `gridRaster`'s `poseCount` is REACTIVE: 1 until `animState === 'drawn'` and
the wave's last stroke has landed (or Opus's ceiling `CELEBRATION.revealWindowMs +
DRAW_IN_PRESETS.glyph.duration` = 1,550 ms after `drawn`, so a stuck subscriber can't hold the bake),
then `BOIL_CONFIG.frameCount`. `retainedPoseUrls` holds the 1-stack while the 4-stack encodes and swaps
atomically; the 4-stack's pose 0 is byte-identical (same SVG, same box, same DPR). `showBaked` becomes
`urls.length ≥ 1`; `useLineBoil` never subscribes at 1, so the boil starts when the stack is whole. The
wordmark's `logoRaster` takes the same shape (1 → n) and opens only after the grid's 4 land (Opus's
order; WebKit's twelve back-to-back poses become 4 then 8 on a still page). The cost is ONE repeated
pose-0 encode per stack (50–82 ms chromium, 57–143 WebKit) after the wave, printed. Under motion the
hand does not start until `bitmapUrls[0]` is resident — h ≈ fonts.ready + the two pose-0 encodes:
chromium light ≈ 180–240 ms (dark ≈ 210–330), WebKit light ≈ 250–320 (dark unmeasured; ≥ 400 by the
census's per-pose dark cost) — against main's draw start of 64–141 / 209–531. PRINTED (G-D10), no floor.

**Arm A (default).** The transition layer is the resident pose-0 `<image>` under `mask="url(#hand-mask)"`;
the mask holds the 17 grid-line paths (the same `d` at the line's width + 2 units, white, round caps) —
`usePathAnimation`'s `querySelectorAll('path.grid-line')` finds them where they now live, so the tween
code is unchanged. At `drawn` the mask is removed and the steady `<image>` shows the same bytes: no
handoff frame exists. The bead (§2.4) is a sibling path OVER the masked image. The mask over a 1272²
decoded bitmap re-composited per frame is UNMEASURED on both engines — G-D6b decides.

**Arm B (fallback, built).** Today's unfiltered stand-ins as the drawing layer with §2.2's clock and
curve and §2.4's bead; at the last lift the whole stack crossfades in over `dusk` 350 on
`--ease-standard` (compositor opacity, NOTE-ERASE's exit-gate pattern, never a bare timer) and the stand-ins
unmount at its end. Named as a loss (a wash), with G-D6 read across its 350 ms.

**PRM (both arms).** The stand-ins hold crisp and unfiltered (the live-filter fallback never mounts on
the boot path); `poseCount` is the full count from the start; when the stack lands, a same-frame cut.
Replaces the census's 759–793 ms chromium / > 5 s WebKit of live-filter paint with crisp paint — a
declared delta, cheaper.

### 2.4 The point: Opus's bead

Each grid line gets a sibling `path.grid-tip` (same `d`, stroke width × 1.35, round caps, the line's own
`--grid-line-color`, the tier's tip opacity), dashed to `[front − L, front]` with `L = 2.5 × stroke width`,
written in the same `onProgress` as the body. On the line's completion it takes `.is-dry` → opacity 0 over
`whisper` 150 on `--ease-fadeOut`: the nub where the hand stopped, drying. Mounted only under motion
(`v-if="!reducedMotion"`); 17 → 34 transient paths at 9×9 (30 → 60 at 16×16), zero at rest. Desktop 1280:
a frame bead ≈ 10 × 19 css px; phone 390: ≈ 5.5 × 11. Light: the cell body 0.7 → ≈ 0.97 composite under
the tip; dark: the same alpha arithmetic on the light graphite. Fable's lead dies (§0).

### 2.5 The wordmark: Fable's rubbing (set type is rubbed in, not written)

`HandwrittenLogo` keeps `clip-path: inset(0 100% 0 0)` as the pre-resident hide only (a zero-area clip
paints nothing, so the live filter never rasters on the boot). Once pose 0 is resident the clip drops
and the pose-0 `<image>` shows through an SVG mask: one `<rect>` filled by a `<linearGradient>` (`#fff` at
`x − feather`, `#000` at `x`, its vector at 105°), `feather = 0.35 em` resolved to viewBox units at mount,
`x` driven `−feather → vbWidth + feather` over 520 ms on `handStroke` on the hand clock. The 1.2 s CSS
transition, `.is-drawn` and the double-rAF arming DIE. The caret is inside the host and is rubbed in with
the word. Opus's letter-jointed 1.2 s write is REFUSED on two grounds: it writes over the LIVE pose 0
(Opus's own gap: WebKit may re-run the wobble filter every frame) and a jointed front on Fraunces is a
stroke-order claim about set type. Per-frame worst advance at 60 Hz: 7.7 % of the width (COMPUTED,
2.394 × 16.67/520) against the quint's 6.9 % — the same order, feathered instead of cut.

### 2.6 The order, the chrome, the deal, the wave

The boot's order: t≈0 first paint → fonts.ready → wordmark pose 0 → grid pose 0 (nothing moving) →
h: the rubbing 0–520 → the frame at the rubbing's lift (312) → subgrid → cells (arm Q serial / arm F the
front) → the last lift → the wave (glyph 350 easeOutCubic, board-noise stagger, verbatim) → the tally
(350·90, verbatim) → the grid's 4 then the wordmark's n poses → the boil on the beat.
`.app-layout.scene-ruling` (set at the frame's first stroke, cleared at `drawn`) carries
`controls-fade-in 250ms var(--ease-drawOn) 150ms backwards` with every number verbatim (π-3); the trigger
moves so "the grid leads, chrome follows" stays true when h is 300–500 ms. `GameBoard.vue:966–977`'s
generation watch skips the 0 → 1 bump when `boardSize`/`subgridSize` are unchanged across it
(`boardGeneration` is born 0, `useGameState.ts:251`; the first deal makes it 1): the smallest form of
both designs' rule; a second deal still erases (positive control); a geometry change still redraws.

### 2.7 What dies · what is refused

DIES: the wall clock as the boot's clock; easeOutCubic on the grid's three tiers and easeOutQuint on the
wordmark; the 1.2 s clip wipe, `.is-drawn` and its double rAF; the mid-wipe live-filter → bitmap swap;
the whole-round boot bake and the all-or-nothing `showBaked`; every bake inside a draw; the live grain
filter painting on the boot in any regime; the boot deal's page turn; the chrome fade's mount trigger;
`pencilConfig.ts:474–476`'s comment (the wordmark now draws on the hand clock; rewritten). Under the
winning ballot arm one schedule table dies at the fold.

REFUSED (constraint, not taste): Fable's lead (A.5.3, ≈ 1.4:1); Fable's `gridFrame` 350 → 520 (fact 3,
π on the gallery); Fable's `--rub-feather` CSS token (no CSS consumer; law 3); Fable's `stepMs = 16`
(engages every 60 Hz frame); Opus's `maxStepMs = 34` (a dropped frame moves a cell line 54 %); Opus's
`@property --write-x/--write-feather/--write-lean` (three registrations for a JS-driven front; the SVG
mask needs none — π-5 stays "no new registered property"); Opus's written wordmark over the live pose
(§2.5); Opus's handStroke on hint/solve (π on unnamed surfaces — ballot 2 carries the declared-delta arm
for the DEAL's glyph reveal only, and the prototyper reads whether `HandwrittenGlyph`'s reveal path can
take the curve without the hint/solve path taking it; if it cannot, arm (b) is named as reaching them);
both designs' library seams in the prototype (fact 1); Fable's STRICT HAND 0.8 as a third ballot arm
(the lift is one const the owner can name at the re-look; two arms, not three).

## 3 · Prototype brief — the smallest runnable build that proves it on the real surface

**Tree.** A fresh worktree off main `1d0dc4fd` (node_modules symlinked; no `npm install`; never `git
commit/push/stash`; main's `src/`, `e2e/`, `scripts/`, `.github/` untouched). Dev/preview servers via the
two-line `.mts` config (`cacheDir` lane-named) on the lane's ports within 4250–4260, `127.0.0.1`,
`--strictPort`: the HEAD CONTROL (main's dist, the census's `index-ChSrVSqM0j8q.js` form) on one port, the
three arm dists on three more. Arms are build-time consts (`MOTION.hand.order`, `MOTION.hand.layer`) → one
dist per arm (the trap: an SFC `v-if` on a const never folds — grep the dist). Kill by RECORDED PID before
returning. 3000/3001 and 4230–4249 untouched; the owner's :3001 is READ-ONLY (a cold read for G-D8's
profile, its process untouched).

**Build, in this order (≈ 250 lines of product diff across 7 files; stop and bank at each rung):**

1. `pencilConfig.ts`: `MOTION.curves.handStroke` + the solver; `MOTION.hand` {stepMs 17, lift 0.6, order,
   layer, serial {520/250/150/520}, rubFeatherEm 0.35, rubLeanDeg 105}; `DRAW_IN_PRESETS` arm-F fields and
   `timing: "handStroke"`; `DRAW_IN_PRESETS.tip`; `glyph` verbatim (+ the ballot-2 field). The :474–476
   comment rewritten. `gridFrame.duration` stays 350 (the gallery's read is π — its e2e/golden is the guard).
2. `usePathAnimation.ts`: the master subscription + capped clock (§2.2); the two schedule builders; the
   frame's side-bells; the tip's `onProgress` + `.is-dry` at completion; `animateErase` untouched.
3. `HandDrawnGrid.vue`: reactive `poseCount` (1 → n on `drawn` ∧ wave-done ∨ ceiling; full count under
   PRM); `showBaked = urls.length ≥ 1`; arm A's `<mask id="hand-mask">` holding the grid-line paths under
   the pose-0 `<image>`, the hand waiting on `bitmapUrls[0]`; the `grid-tip` siblings; arm B's stand-ins +
   `dusk` crossfade through the exit gate; PRM's crisp hold + cut; the live-filter fallback never mounted
   on the boot path. Nothing in the settled `<image>` stack, `gridPoseSvg`, the cacheKey or the DPR cap
   moves (π-1).
4. `HandwrittenLogo.vue`: the pre-resident clip; reactive `poseCount` (1 → n after the grid's stack); the
   gradient-mask rubbing on the hand clock; the transition, `.is-drawn`, `playReveal`'s double rAF deleted;
   PRM: `hidden → drawn` the frame pose 0 is resident. CH-66's parked live stack unchanged.
5. `GameBoard.vue:966–977`: the 0 → 1 skip with the geometry guard. `scene.css:611` + `App.vue`:
   `.scene-ruling` carries the fade, numbers verbatim.
6. Only after 1–5 bank: the wave-done seam (the last `HandwrittenGlyph` reveal's completion or
   `animatingCells` emptying — the prototyper reads which is honest) feeding the `poseCount` open.

**Instruments** (in `<worktree>/web/frontend/.<lane>/`, never a product dir; reuse
`census/drawin/series/instruments/init2.js` (the post-rAF sampler: per-line dash progress, wordmark mask
`x`, `.scene-controls` opacity, glyph/tally progress, `drawImage`/`toBlob` hooks, LoAF chromium), `run2.mjs`,
`an.mjs`, `table.mjs`, `cast.mjs`): NEW — a painted-frame recorder (chromium CDP `Page.startScreencast`,
WebKit `recordVideo`) as the PRIMARY read for every "painted" clause (rAF secondary); a 150 ms busy-loop
injector at first stroke + 200 ms (G-D1) with a 300 ms arm (Opus's G-DI3 form) reported; a deal-delay
instrument (≥ 1.2 s at the worker seam, G-D8); `page.clock`-stopped DPR2 photographs for the bead and the
rubbing (min over TWO bare photographs, A.5.7); the A.1.1 band statistic for G-D6; a per-frame paint-time
read for G-D6b (chromium `Page.startScreencast` frame metadata + LoAF `renderStart`; WebKit the recorder's
inter-frame deltas — named as the weaker read); the 60 Hz precondition print (A.1.7) on every rate row,
with the DRIVEN_CLOCK shim as the named arm where chromium's 120 Hz never engages the cap. Every gate is a
shell script run `run_in_background` with a log, polled ~60 s, chunked by engine (chromium then WebKit),
never a foreground timeout above 120 s. All arms and the control load ONE encoded `?board=` payload
(`persistence.ts:190–201`; a bare name decodes invalid — pass-4 addendum); the row states it.

**Regimes.** chromium + WebKit · light + dark · 1280×800 DPR2 fine · 390×844 DPR3 coarse `hasTouch: true`
(witnessed) · motion + PRM · cold (fresh context, CDP cache off) with a warm reload column · the :3001
profile (deal ≥ 1.2 s) · 16×16 (`?size=16` or the codec payload) for G-D10 only.

**Poses to frame (≤ 4 crops, ≤ 150 KB, each naming engine · theme · viewport · pointer):** c1 chromium ·
light · 1280 · fine — the frame mid-side with the bead at DPR2, arm A, beside HEAD's crop 1 instant; c2
WebKit · dark · 1280 · fine — two fronts at a lift-and-land (arm Q) with the drying nub of the lifted line;
c3 chromium · light · 390 · coarse — the rubbing mid-word (no cut letter, the 105° feather) beside HEAD's
crop 2; c4 chromium · light · 1280 · fine — the last drawing frame beside the first settled frame, arm A,
as a difference image with the band statistic's Δ printed (arm B's is the mid-crossfade frame). Raw
per-frame JSON summarised (min/median/max, the discontinuity), never banked whole.

**Numbers that mean success.** Every §4 gate GREEN on arm A×Q (default) and on arm F (the ballot's
other arm) except the REPORTED rows (G-D10, G-D12, P-1); arm B GREEN on every row but G-D6, which it reads
across its 350 ms as a declared loss; G-D6b's reading decides which layer arm is the default at the fold;
the π rows 0 moved; the crops' numbers equal the gates' numbers.

## 4 · Born-RED gates (each RED on main by the census's instrument, or a NEW instrument with its negative control run in the same batch)

| id | asserts | main today | negative control |
|---|---|---|---|
| G-D1 the hand pauses | with a 150 ms busy loop at first stroke + 200 ms: worst single painted-frame Δ of any line ≤ 7.8 % of the frame perimeter / 16.3 % subgrid / 27.1 % cell (arm Q; arm F 11.6 / 16.3 / 20.3 — COMPUTED from 2.394 × 17/D); no line partial → whole across the stall; both engines, n ≥ 5, the 300 ms arm reported | 72–100 % with no injection | `stepMs` unset → RED |
| G-D2 nothing bakes under the hand | 0 encode tasks (LoAF `IMG.onload`/`toBlob` chromium; the timestamped hooks WebKit) between the rubbing's first frame and the wave's last stroke; both engines · d + m · cold + warm · light + dark | 4/4 grid poses inside in 36/36 + the wordmark's 8 | `poseCount` forced to n at mount → RED |
| G-D3 the order | arm Q: max lines with 0 < p < 1 in any painted frame ≤ 2; arm F: onsets monotone, jitter < stagger/2, every line's onset ≤ its successor's | 15 in flight; jitter 15 > stagger 10 | arm F with today's jitter → RED |
| G-D4 the hand's velocity | per line: speed at t = 0 ≤ 0.3× mean, peak at t ∈ [0.2, 0.4], fraction drawn at 20 % of its time ≤ 0.25, end speed → 0 (≥ 0.99 drawn at 90 %); the frame shows 3 interior minima ≤ 0.2× mean at its corners; the rubbing front one such bell | easeOutCubic 3.0× at t = 0, 48.8 % at 20 %; the quint 5.0× | `timing: easeOutCubic` → RED |
| G-D5 the point is visible | `page.clock`-stopped DPR2 photographs mid frame-side and mid cell line, both engines both themes, min over TWO bare photographs (A.5.7): the frame tip's painted cross-section ≥ 1.25× the body's; a cell tip's median ink density ≥ 1.15× its body's; tip core contrast vs paper ≥ 3.0 (A.5.3); at line end + 150 + 2 frames the ratio ≤ 1.02 | ratio 1.00 (no tip) | FAINT-INK (tip opacity 0.15) and `widthK 1.0` → RED |
| G-D6 no handoff step | arm A: the A.1.1 band statistic at the last drawing frame vs the first settled frame, median Δ ≤ 1/255, both engines both themes; arm B: read across the 350 ms, ink never < 0.97× rest, the Δ PRINTED as the loss | a crisp → grain step (census G4, unframed) | arm B with the crossfade cut to 0 ms → RED |
| G-D6b mask cost (decides the layer arm) | per-frame paint time during the ruling ≤ the arm-B control's median + 2 ms, both engines, d + m | n/a (new) | a second mask over the same image → RED |
| G-D7 no live filter on the boot | 0 samples with the live grain filter in the painted tree (grid sl=4 / wordmark lb live) from first paint to the boil's start, motion AND PRM, both engines | PRM 759–793 ms chromium, > 5 s WebKit; WebKit motion handoff 0.4–0.75 s | the fallback re-mounted on the boot → RED |
| G-D8 the page written once | :3001 profile (deal ≥ 1.2 s): 0 `erasing` states before the first user act, n ≥ 5; a second deal erases once (positive control); a size-changing first deal redraws once | 1 caught (screencast 917 → 1126) | the watch reverted → RED |
| G-D9 the wordmark uncut | at every painted rubbing frame the ink column-profile across the front spans ≥ 0.35 em (no hard edge); the front's slant 100–110°; 0 live-filter frames under it | a hard vertical cut through "sud\|" (crop 2) | feather 0 → RED |
| G-D10 the tempo printed | h (first stroke), last lift, last given, boil start, the repeated pose-0 encode and the after-wave block — as RATES per engine × theme × viewport × arm, quiet box (census G2), 9×9 and 16×16 | 0.56 s / 1.5–1.76 s | REPORTED, no floor |
| G-D11 continuity | in the draw window painted intervals ≤ 34 ms and every line seen partial in ≥ 2 painted frames, both engines, quiet box n ≥ 5; a WebKit-only red is a WebKit defect to find (A.6), never noise | 200–226 chromium, 385–1501 WebKit; 0–16 lines never partial | the ABLD reading (33–58) proves the row separates |
| G-D12 price guard | a tap at the after-wave bake + 30 ms paints its selection within the control's response + one pose task + 34 ms; coarse rows `hasTouch: true` | main's bakes are at 150–700 ms so its 3 s tap sees none: the control | not born-RED; a no-regression bound |
| G-D13 PRM is a cut | 0 partial lines, 0 intermediate opacities, 0 tips mounted, the wordmark at rest from its first sample; the crisp → stack cut same-frame | conforms except the live-filter paint (G-D7) | — |
| π-1 settled board | the four poses byte-identical to HEAD (same pose SVG, cacheKey, DPR cap), both themes; goldens 4/4; `plantk.spec.ts` cited beside any suite (A.1.9) | identical | must stay GREEN |
| π-2 filter budget | 9 exact-match both directions, both regimes; union raster area ± 2 % | 9 | must stay GREEN |
| π-3 the unnamed surfaces | `controls-fade-in` 250 / +150 / `--ease-drawOn`; the erase 150 easeInCubic; `GameGallery.vue:377`'s reveal at 350 easeOutCubic byte-identical; the tally 350·90; the wave verbatim under ballot-2 (a); computed paint properties + tags identical to the HEAD control at rest, both themes | — | must stay GREEN |
| π-4 copy | `check-copy-register` bare unchanged; 0 rendered-string delta | — | GREEN |
| π-5 @property | no new registered property; `check-property-block` C1–C6 unmoved | — | GREEN |
| P-1 the 60 Hz precondition | every rate/Δ row prints the in-page clock ≥ 93.75 Hz or names the DRIVEN_CLOCK shim as its arm; green in one engine and red in the other is a defect (A.6) | — | precondition |

## 5 · Owning families and pass-7 charter rows (loop-local numbering D1…; the chair renumbers at the INTAKE fold)

### MOT-VERB (§13 leader, 81) — M20's verbs, on the one §13 tree after LADDER's delta
- **D1 the hand.** `usePathAnimation` on one capped rAF clock (`stepMs` 17) and `handStroke`; the frame's
  side-bells; both schedule builders behind `MOTION.hand.order`. Gates G-D1, G-D3, G-D4, G-D11 born-RED on
  the control, GREEN on the tree, P-1 printed per run.
- **D2 the layer, both arms.** Arm A's `#hand-mask` over the resident pose 0; arm B's stand-ins + `dusk`
  exit-gated crossfade; PRM's crisp hold + cut. G-D6/G-D6b/G-D7/G-D13; c4 differenced. Fold-order note:
  MOT-VERB's pass-5 bank (M15 row 36, theme-free alpha bakes) already renders each pose as a `<mask>`
  luminance under a coloured rect — arm A meets it as a mask over a mask; the composition is UNMEASURED
  and is this row's first read on the §13 tree.
- **D3 the point.** `path.grid-tip` per line (§2.4), `DRAW_IN_PRESETS.tip`; G-D5 with both plants. Opus's
  DI-9 routed here (a verb's detail; no new family).
- **D4 the rubbing.** `HandwrittenLogo`'s pre-resident clip, the gradient mask on the hand clock at 520,
  the CSS wipe and `.is-drawn` deleted; G-D9 born-RED (crop 2 is the control). Row 37's wordmark half
  (the flip's 4 draws + 4 href swaps) stays BLOCKED as v5 §1 books it; the rubbing works on whichever
  pose 0 is resident for the current theme.
- **D5 the order and the bakes.** Reactive `poseCount` 1 → n on both stacks, grid then wordmark, opened at
  the wave's last stroke or the 1,550 ms ceiling; the boil parked until whole; G-D2 and G-D12; G-D10
  printed for both tempo arms, quiet box, 9×9 and 16×16.
- **D6 `.scene-ruling`** carrying `controls-fade-in` verbatim (π-3).
- **D7 row 40's painted-frame recorder** (unbuilt at pass 5) carries G-D1/G-D6/G-D9/G-D11's "painted"
  clauses — the instrument is this lane's before any number counts.

### MOT-LADDER (76) — the homes
- **D8** `MOTION.hand`, `MOTION.curves.handStroke` (+ solver, the twin deferred to its first CSS consumer),
  `DRAW_IN_PRESETS.tip`, arm F's fields; the serial table reads `MOTION.rungs.{throw,note,whisper}` once
  the map lands, literals until then; `pencilConfig.ts:474–476` rewritten.
- **D9** B6's ratchet reads gridSubgrid 280 → 250 and (arm Q) the cell tier at 150 as DELIBERATE
  shortenings with the census cite in the key — and B6's three doors (v5 §2.5) are re-cut BEFORE this
  row counts, or the shortenings are the plant that proves the doors.

### ACC-FIVE (§3 leader, 83) — the front primitive
- **D10** `frontGate` gains the displacement clause: a front advances at most `FRONT_MIN_MS + 1` of clock
  per painted frame (the hand clock), exported as the one number `MOTION.hand.stepMs` reads; G10 re-run
  with the clause on (gated 49–52/s unchanged; A.6's forced end-write deferral in the same cut).
- **D11 OPTION, framed not defaulted:** the reveal wave's `createStrokeDrawIn` on the capped clock, read
  against GV's chromium series (worst Δ 1.7–3.7 % today) — ship only if WebKit's 61–69 % survives G-D2
  (if the stall is gone the wave may not need the cap; say which). Ballot 2's arm (b) is measured here.

### Crossings (not loop families; the chair routes)
- **D12 pencil-boil 0.12.1** (the seal's publish vehicle, T9-R4): `createSequenceSubscription({ stepMs })`
  (unset = byte-identical; unit: a synthetic 300 ms gap advances 17), `useRasterStack` `yieldBetweenPoses`
  + a `poseCount` step that reuses a resident pose instead of re-encoding it, `handStroke` in the easing
  roster. The consumer clock (D1) and the repeated pose-0 encode (D5) are what this row deletes.
- **D13 W1 mechanics** (`GameBoard.vue:966–977`): the 0 → 1 skip with the geometry guard; G-D8 on the
  :3001 profile. Fable's `source: 'boot'` provenance is the fuller form if W1 wants the seam.
- **D14 W8 first paint** (`t9-w8-baseline`): the two pose-0 encodes are the first tasks after fonts.ready
  and the only ones before the hand; C01's zero-box law and C07b unchanged; h printed per engine × theme.

## 6 · Ballots (the owner's, at the re-look; both arms built on one payload; provisional from T9-B25 — the chair mints after LEDGER's roster, A.4)

**T9-B-DRAWIN-1 · the hand's order (the tempo).** One const, `MOTION.hand.order`.
- **(a) DEFAULT · ONE HAND** (`serial`, lift 0.6): ≤ 2 fronts live, each line landing at the last one's
  lift; 9×9 rubbing 0–520, frame 312–832, last line ends 2364 ms (2052 from the frame's onset), last given
  ≈ 3.4 s chromium d cold; 16×16 last line 3744. The cost: the boot to the last given roughly DOUBLES
  against main (1.5–1.76 s → ≈ 3.4 s); the owner has not seen a 3.7 s ruling.
- **(b) THE RULING FRONT** (`front`, Opus's schedule): 15 lines in flight on a monotone front, the last
  landing ≈ 575 ms after the frame's onset, last given ≈ 1.6–1.9 s; the same bell, bead, clock and bake
  law. The cost: the census's own reading of many lines at once as "a machine sweep, not one hand".
- Frames owed: c1/c2 in both arms at matched instants (the frame's second side; the first cell line)
  on ONE encoded `?board=` payload; G-D10's rates beside each. Firing default on silence: (a), with the
  price stated in the ballot text.

**T9-B-DRAWIN-2 · the digits' hand.** One field, `DRAW_IN_PRESETS.glyph.timing`.
- **(a) DEFAULT · VERBATIM:** the deal's reveal wave and the tally keep easeOutCubic 350; π on the hint's
  and the solve's write-in (surfaces the mark does not name).
- **(b) ONE HAND FOR THE DIGITS TOO:** the glyph reveal on `handStroke`; if the reveal path is shared, the
  hint and solve write-in take it as a DECLARED delta (the 3.2 s crest re-read). Frame owed: the wave's
  mid-frame in both arms, chromium light 1280 fine, DPR2.
- Firing default on silence: (a).

## 7 · Gaps (a gap is a gap)

- The mask-over-bitmap cost (arm A) is unmeasured on either engine; G-D6b decides and the fallback is a
  wash. If WebKit reds it the "no handoff" claim is downgraded to "a 350 ms crossing" and said so.
- WebKit attribution is partial (census G1): a residual freeze past the bakes becomes a pause under the
  hand clock (G-D1 holds) but grows h and the tempo (G-D10). G-D11 may red on WebKit for that reason; A.6
  reads it as a defect to find, not noise.
- Every census number is from a shared box at load 139–224 (census G2); every bound here is computed
  from the curve and the cap, none is a quiet-box floor.
- chromium headless at ~120 Hz never engages a 17 ms cap on its own; G-D1's injector or the driven-clock
  shim is the witness there, and WebKit's 60 Hz clock is the natural one — read first.
- The after-wave bakes (grid 4 then wordmark n, one repeated pose-0 encode each) land at ≈ 3.4 s (arm a)
  or ≈ 1.9 s (arm b) — inside the user's first-touch window on a still page; G-D12 bounds the price and
  the true cure (`yieldBetweenPoses`, a pose-reusing `poseCount` step) is the held 0.12.1 (D12).
- The bead doubles the transient path count (34 at 9×9, 60 at 16×16); its WebKit paint cost is
  unmeasured and inside G-D6b's read.
- On MOT-VERB's §13 tree the pose is already a `<mask>` luminance (M15 row 36); arm A there is a mask over
  a mask — unmeasured (D2's first read).
- 16×16, the other games and real iOS are arithmetic or emulation only (census G6/G7); no crop of the
  proposed motion exists until the prototype frames it.
- The wave stays a crowd under ballot 2 (a); if the owner reads "one pencil" as the digits drawn one at a
  time the honest cost is 9–21 s and both designs refuse it — the owner's reading under U-10.
- Nothing here retires T9-M20. The owner disposes at the re-look.

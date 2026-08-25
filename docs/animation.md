# Animation System

The frontend's hand-drawn motion layer. This is the peer reference for
`web/frontend/`; the README points here rather than duplicating it. Shared
primitives come from [`@mkbabb/pencil-boil`](https://github.com/mkbabb/pencil-boil)
`^0.12.0`: the unified rAF scheduler, `usePrefersReducedMotion()`,
`createBoilTicker` (the perpetual kind) and `createSequenceSubscription` (the
finite one), `createStrokeDrawIn`, the `useBoilCache`/`boilLineFrames` prebake
surface, the `acquireHold`/`heldFrameCount` hold gate, its four JS easing curves
(`easeOutCubic`/`easeInCubic`/`easeInOutCubic`/`linear`, resolved by name through
`resolveEasing`), and the celestial mascot proofs. Rough.js is excised from the
shipped tree; grid lines, glyphs, and chrome are all custom SVG path generation.

All animations respect `prefers-reduced-motion`; the celebration and
hold-to-peek laminate additionally respect `prefers-reduced-transparency` /
`prefers-contrast: more`.

## Motion cadence bands

`pencilConfig.ts`'s `MOTION` is the law every animated value is audited against.

| Band | Range | Role | Members |
|---|---|---|---|
| A: stop-motion ambient | 125–170 ms/tick (6–8fps) | always-on hand-drawn jitter | grid boil 150, divider boil 150, celestial wobble 160 (sun every 2nd beat, moon every 1.5), heart wobble 170, selection burst 120 |
| B: lazy ambient | 550–800 ms/tick | large/peripheral only | logo wobble 550 (`beatsFor` → every 4th beat) |
| C: responsive one-shots | 120–600 ms, user-triggered, finite | hover wiggle 600, button anims 400–500, tooltip fade 150, cell reveal 300 |
| D: choreographed sequences | 150 ms–3.2 s, finite + completion-emitting | grid draw-in ~800ms, erase ~150ms+4ms·i, logo clip 1.2s, theme page-turn ~950 ms, controls-drawer glide 520 ms (`useControlsDrawer.ts:GLIDE_MS`), board⇄card fold 520 ms, card step 440 ms, celebration ≤3.2s |

A dead band (175–550 ms) is reserved: no *ambient* loop may tick there (~3fps
reads as jank); Band C one-shots are exempt.

### The house easing ledger

One custom property per distinct curve, split by consumer, not by curve (the
two-layer rule, T4-W10):

- **CSS layer** — 10 `--ease-*` tokens in `assets/index.css`'s `@theme` §EASING,
  what every `<style>`-block `transition:`/`animation:` reads: `noteWrite`
  (write-in/reveal/grow), `standard` (show-hide fade/slide), `springPop`
  (icon/toggle pop), `accelIn` (accelerate-away exit), `fadeOut` (solver-dim),
  `ghostDraw` (pencil-ghost glyph), `drawOn` (stroke draw-on/controls),
  `loaderScrub` (loader scrub), `anticipatePop` (anticipate + overshoot reveal),
  `glassGlide` (laminate lay-down). Theme-invariant, so they mint in the base
  `@theme` and never in the `.dark` override.
- **TS layer** — `MOTION.curves` in `pencilConfig.ts`, for JS and `v-bind`
  consumers. It holds exactly one: `drawerGlide`,
  `cubic-bezier(0.32, 0.72, 0, 1)`, read by the `useControlsDrawer` mover engine.
  It's byte-identical to `--ease-glassGlide`; each layer owns a disjoint consumer
  set, so a retune edits one side and the two can't diverge.

Site counts are census output (`grep -rc "var(--ease-"`), never prose. The
drawer glide is transform-only: an inverted FLIP with the one real layout step at
`transitionend`, so the filtered board's size is never tweened.

## Unified scheduler

One shared `requestAnimationFrame` chain for the whole app
(`@mkbabb/pencil-boil`'s scheduler), and above it one shared *beat*:
`pencil/composables/boilBeat.ts` runs exactly **one** perpetual subscriber—a
`createBoilTicker` driver on `MOTION.beatMs` (125 ms, ~8 Hz)—incrementing a
module-level counter. Every perpetual boil—grid and outline, divider, wordmark,
the sun/moon toggle, the gallery's centre card, the difficulty tally—derives its
frame index from that counter through `useBeatFrame`/`useBoilBeat`, so
however many marks boil, their DOM writes coalesce into the same tick and the
pipeline gets idle frames between beats. The driver is ref-counted: it starts
with the first consumer and stops with the last, so a page with nothing boiling
returns to the zero-subscriber floor. Slower cadences map onto the beat grid with
`beatsFor`/`stepEveryBeats` rather than minting a second clock.

**`SvgFilters` registers no subscriber at all** (0, down from the 3 filter-param
wobbles it once drove). An SVG reference filter is part of its clients' paint, so
a per-beat `baseFrequency` write re-rastered every client on every beat. Since
T3-W13 a wobble preset instead declares one *static* filter per pose
(`${id}-p{i}`, params derived reactively from `FILTER_PRESETS` by
`wobblePoseFrequencies`, so `FilterTuner` stays live), and the pose stacks
(`HandwrittenLogo`, `DarkModeToggle`) flip sibling visibility on the shared beat:
each pose rasters once, and the steady state re-rasters nothing.

Everything finite rides `createSequenceSubscription` one-shots that enrol and
leave—glyph draw-in, the gallery's deal reveal, the join wash, the difficulty
tally, each celebration wiggle. Both gates are the library's, inherited rather than
reimplemented: `prefers-reduced-motion` force-clears every subscriber (the driver
included, re-armed on disengage iff consumers remain), and the one chain parks
while the tab is hidden. `window.__schedulerDebug()` reads chains and subscriber
count live, re-exposed by the dev-only `rafInstrumentation.ts`.

## Solve celebration

A finite 3-beat timeline (`CELEBRATION` in
`pencilConfig.ts`): beat 1 is a board-normalized reveal wave (~1.2s window,
per-cell stagger `clamp(round(1200/blankCount), 4, 24)` ms); beat 2, after a
150ms breath, is one diagonal wavefront crossing the board in ~500ms where each
solved cell plays exactly 2 wiggle cycles (600ms/cycle); beat 3 is a classroom
murmur—one registered solved cell wakes per 2.5s window for a single wiggle,
driven by a `setTimeout` chain (`pencil/composables/celebration.ts`) that adds
nothing to the rAF subscriber floor between wiggles. A gold-star garnish draws in
near the beat-2 crest (~t=2.65s) with a 400ms foil-gleam sweep. Worst-case crest
≈3.05s, inside the 3.2s cap.

## Grain hoist

`grain-static` (feTurbulence + feDisplacementMap) no longer wraps the
boil-cycling grid `<g>` directly, re-rasterizing the full board every ~150ms
tick. It's hoisted onto pre-baked, opacity-toggled sibling `<g>` layers instead.
Measured **−72.9% RasterTask** at the shipped architecture vs. the pre-hoist
single-filtered-`<g>` tree (`design-union.md` prototype 9 / `union-verdict.md`).
SSIM 0.983–0.985 at settled/2×DPR (the
acceptance floor); 6/36 matrix conditions (all DPR1 + live-animating mid-phase)
fall below the 0.98 floor, and the envelope is extended to cover them explicitly
rather than gate-blocking.

## Hold-to-peek answer key

`AnswerKeyLaminate.vue` (async-loaded): press-and-hold or `K` freezes the boil in
place (`acquireHold`/`releaseHold` on the scheduler) and lays a translucent
laminate over the board with missing answers in teacher-red. Under
`prefers-reduced-transparency: reduce` **or** `prefers-contrast: more`, the
laminate goes fully opaque and prints the *complete* solution (givens included):
the blocking fix for the "holes where the givens were" defect an opaque-but-partial
key would otherwise show.

## Animation layer table

| Layer | Mechanism | Timing |
|---|---|---|
| Grid draw-in/erase | stroke-dashoffset, `usePathAnimation.ts` | ~800ms staggered with jitter (draw); ~150ms+4ms·i (erase) |
| Cell reveal (solve/randomize) | CSS `cell-reveal` + noise-stagger | 300ms cubic-bezier |
| Glyph draw-in | stroke-dashoffset, `glyphAnimations.ts` | 350ms easeOutCubic |
| Glyph wiggle (hover) | SVG path `d` morphing | 600ms |
| Grid line boil | Path d-attribute cycling (4 frames) off the shared beat | 150ms/frame (~6.7fps), quantized to the beat grid |
| Sun/moon pose boil | Whole-icon pose stack off the shared beat | sun every 2nd beat (~4Hz), moon every 1.5 (~5.3Hz) |
| Sun ray spin | Quantized into the baked pose geometry (`RAY_ANGLES`), no transform wrapper | 0.1875°/pose → a notional 480s revolution at `bands.sun` |
| Dice roll (randomize) | CSS rotate+scale, staggered pip-pop | 500ms elastic overshoot |
| Solve check draw-in | stroke-dashoffset + sparkle scale | 350ms draw-in + 500ms sparkle-grow |
| Celebration beats 1–3 | Scheduler `sequence` subscriber | ≤3.2s crest total |

## pencilConfig.ts

Centralized reactive config in `pencil/config/pencilConfig.ts`. Mutations
propagate live to all consumers (live-tunable via `FilterTuner`, dev-only).

- **MOTION**: the cadence-band law above, the shared `beatMs: 125` and its named
  band divisors, `MOTION.curves` (the one TS-layer easing, `drawerGlide`—the CSS
  half of the ledger lives in `index.css`'s `@theme`), and the small-area filter
  rule (no `wobble-*` displacement filter targets an element larger than the
  logo).
- **PENCIL**: stroke width/roughness per element tier (gridFrame, gridSubgrid,
  gridCell, logoText, vine, fruitOutline).
- **The color palette**: the canonical hex table, including the `celestial`
  sun/moon set that single-sources `DarkModeToggle.vue`'s fills and strokes.
- **FILTER_PRESETS**: reactive, 7 presets. `grain-static` (margin 5,
  `baseFrequency 0.04, numOctaves 3, scale 2.5, seed 2`); `grain-outline`
  (`baseFrequency 0.13, scale 0.75`—the px-native outline's own tooth, since
  `grain-static`'s userSpaceOnUse values render literal there); `wobble-logo`
  (`scale 3, intervalMs 550`); `wobble-celestial` (`scale 5, intervalMs 160`);
  `wobble-heart` (`scale 5, intervalMs 170`); `stroke-light`/`stroke-dark`
  (3-pass multiPass, `blendMode` multiply/screen). `resetPreset(id)`/
  `resetAllPresets()` restore frozen defaults. Four of the seven carry
  `baseDef: false`—`grain-outline` (baked into the pose geometry), `wobble-logo`
  (consumed only as its pose stack), and the two `stroke-*` (orphaned with the
  filtered control panel)—so `SvgFilters` emits no base def that nothing would
  reference.
- **BOIL_CONFIG**: reactive, `frameCount: 4, intervalMs: 150, frameBoil: 1.2,
  subgridBoil: 0.6, cellBoil: 0.3, outlineBoilPx: 0.45` (viewBox-unit
  perturbation, decreasing tier by tier so glyphs read stable while frame lines
  carry the most jitter; the outline's own constant is CSS px because that
  surface is px-native). `resetBoilConfig()` restores defaults.
- **DRAW_IN_PRESETS**: exactly 4 live entries with real consumers: `gridFrame`,
  `gridSubgrid`, `gridCell` (`usePathAnimation.ts`), and `glyph`
  (`HandwrittenGlyph.vue`). A former `solveCell`/`logo` pair was dead config
  (zero consumers: the logo reveals via a clip-path wipe rather than a stroke
  draw-in) and was deleted.
- **CELEBRATION**: the 3-beat timeline constants + `revealStaggerMs()`/
  `wavefrontStepMs()` helpers, described above.

### Filter IDs

| ID | Type | Usage |
|---|---|---|
| `grain-static` | Static-parameter grain, hoisted off the boil-cycling `<g>` | Grid lines, glyphs, the divider poses, the celebration star |
| `grain-outline` | Same tooth re-derived for px-native space; baked into the outline pose geometry, no base def | `HandDrawnOutline` |
| `wobble-logo` | Pose stack only (`wobble-logo-p{i}`), no base def | Wordmark |
| `wobble-celestial` | Pose stack, plus a base def for the transient bodies | Sun/moon toggle |
| `wobble-heart` | Static wobble, one raster per appearance | Attribution card heart |
| `stroke-light` | Multipass stroke—orphaned, no base def | Control panel (light mode), retired at P1-W3 |
| `stroke-dark` | Multipass stroke—orphaned, no base def | Control panel (dark mode), retired at P1-W3 |

The two `stroke-*` rows keep their params on purpose: the panel filter's
reversal is one CSS block plus a flag, not a re-derivation. Two additional
non-preset filters exist: `sparkle-rainbow` (gradient stroke for given cells) and
the moon/star organic-displacement filter. What may carry a filter at all is
declared in `pencil/config/filterBudget.ts`: an exact-match allowlist of four
rows totalling nine filtered elements (`FILTER_BUDGET_TOTAL`), under a charter
ceiling of 14 (`FILTER_BUDGET_CEILING`) that doesn't follow the total down. The
rows are what red a new surface—the census fails in either direction. Walked by
`e2e/filter-census.spec.ts` (a local instrument—CI is browserless under O-12).

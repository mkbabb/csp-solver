# Animation System

The frontend's hand-drawn motion layer. This is the peer reference for
`web/frontend/` — the README points here rather than duplicating it. Shared
primitives come from [`@mkbabb/pencil-boil`](https://github.com/mkbabb/pencil-boil)
`^0.7.0`: the unified rAF scheduler, `usePrefersReducedMotion()`,
`useBoilFrame`/`useFilterParamBoil`, the `sequence` subscriber kind,
`createStrokeDrawIn`, the `useBoilCache`/`boilLineFrames`/`boilRectFrames` prebake
surface, the four house easing curves (`easeOutCubic`/`resolveEasing`), and the
celestial mascot proofs. Rough.js is excised from the shipped tree — grid lines,
glyphs, and chrome are all custom SVG path generation.

All animations respect `prefers-reduced-motion`; the celebration and
hold-to-peek laminate additionally respect `prefers-reduced-transparency` /
`prefers-contrast: more`.

## Motion cadence bands

`pencilConfig.ts`'s `MOTION` is the law every animated value is audited against.

| Band | Range | Role | Members |
|---|---|---|---|
| A — stop-motion ambient | 125–170 ms/tick (6–8fps) | always-on hand-drawn jitter | grid boil 150, divider boil 150, star/sun-sparkle boil 125, celestial wobble 160, heart wobble 170, selection burst 120 |
| B — lazy ambient | 550–800 ms/tick | large/peripheral only | logo wobble 550, sun-ray boil 800, sun breathe 6s |
| C — responsive one-shots | 120–600 ms, user-triggered, finite | hover wiggle 600, button anims 400–500, tooltip fade 150, cell reveal 300 |
| D — choreographed sequences | 150 ms–3.2 s, finite + completion-emitting | grid draw-in ~800ms, erase ~150ms+4ms·i, logo clip 1.2s, theme page-turn ~950 ms, controls-drawer glide ~480 ms, celebration ≤3.2s |

A dead band (175–550 ms) is reserved: no *ambient* loop may tick there (~3fps
reads as jank); Band C one-shots are exempt. Four house easing curves only:
`easeOutCubic` (draw-on), `easeInCubic` (erase), a back-out `pop` curve (cell
reveal), and a spring-back curve (physical flourishes — theme toggle, dice
tumble, the controls-drawer's board/masthead glide; the drawer case itself
slides on easeOutCubic). The drawer glide (T3-W12 §6) is transform-only —
inverted FLIP with the one real layout step at `transitionend`, so the filtered
board's size is never tweened.

## Unified scheduler

One shared `requestAnimationFrame` chain for the whole app
(`@mkbabb/pencil-boil`'s scheduler) — grid boil, divider boil, the dark-mode
toggle's boil-frame hooks, and `SvgFilters`' 3 filter-wobble subscribers all ride
it instead of independent `setInterval`/native-rAF loops. Smoke-verified floor:
**chains=1, subscribers=10**, returning to exactly 10 across settle-and-clear
cycles (`window.__schedulerDebug()`, re-exposed by the dev-only
`rafInstrumentation.ts`; measured in
`docs/tranches/2026-07-grand-uplift/waves/W8-animation-gestalt.md` and
`evidence/fe-composition.md` §5). A 77s stress harness (73 solve/clear, 19 size
switches, 17 theme flips) never deviates from chains=1.

## Solve celebration

A finite 3-beat timeline, not an infinite wiggle swarm (`CELEBRATION` in
`pencilConfig.ts`): beat 1 is a board-normalized reveal wave (~1.2s window,
per-cell stagger `clamp(round(1200/blankCount), 4, 24)` ms); beat 2, after a
150ms breath, is one diagonal wavefront crossing the board in ~500ms where each
solved cell plays exactly 2 wiggle cycles (600ms/cycle); beat 3 is a classroom
murmur — one registered solved cell wakes per 2.5s window for a single wiggle,
driven by a `setTimeout` chain (`pencil/composables/celebration.ts`) that adds
nothing to the rAF subscriber floor between wiggles. A gold-star garnish draws in
near the beat-2 crest (~t=2.65s) with a 400ms foil-gleam sweep. Worst-case crest
≈3.05s, inside the 3.2s cap.

## Grain hoist

`grain-static` (feTurbulence + feDisplacementMap) no longer wraps the
boil-cycling grid `<g>` directly re-rasterizing the full board every ~150ms tick
— it's hoisted onto pre-baked, opacity-toggled sibling `<g>` layers instead.
Measured **−72.9% RasterTask** at the shipped architecture vs. the pre-hoist
single-filtered-`<g>` tree (`design-union.md` prototype 9 / `union-verdict.md`,
commit-stamped in the tranche evidence). SSIM 0.983–0.985 at settled/2×DPR (the
acceptance floor); 6/36 matrix conditions (all DPR1 + live-animating mid-phase)
fall below the 0.98 floor — the envelope is extended to cover them explicitly
rather than gate-blocking.

## Hold-to-peek answer key

`AnswerKeyLaminate.vue` (async-loaded): press-and-hold or `K` freezes the boil in
place (`acquireHold`/`releaseHold` on the scheduler) and lays a translucent
laminate over the board with missing answers in teacher-red. Under
`prefers-reduced-transparency: reduce` **or** `prefers-contrast: more`, the
laminate goes fully opaque and prints the *complete* solution (givens included) —
the blocking fix for the "holes where the givens were" defect an opaque-but-partial
key would otherwise show.

## Animation layer table

| Layer | Mechanism | Timing |
|---|---|---|
| Grid draw-in/erase | stroke-dashoffset, `usePathAnimation.ts` | ~800ms staggered with jitter (draw); ~150ms+4ms·i (erase) |
| Cell reveal (solve/randomize) | CSS `cell-reveal` + noise-stagger | 300ms cubic-bezier |
| Glyph draw-in | stroke-dashoffset, `glyphAnimations.ts` | 350ms easeOutCubic |
| Glyph wiggle (hover) | SVG path `d` morphing | 600ms |
| Grid line boil | Path d-attribute cycling (4 frames), scheduler subscriber | 150ms/frame (~6.7fps) |
| Sun/star sparkle boil | Diamond/star polygon wobble, scheduler subscriber | 125ms/frame (~8fps) |
| Sun ray spin | CSS `spin-rays` keyframe, continuous | 240s/rotation (4 min) |
| Sun breathe pulse | CSS `gentle-pulse` keyframe | 6s ease-in-out alternate |
| Dice roll (randomize) | CSS rotate+scale, staggered pip-pop | 500ms elastic overshoot |
| Solve check draw-in | stroke-dashoffset + sparkle scale | 350ms draw-in + 500ms sparkle-grow |
| Celebration beats 1–3 | Scheduler `sequence` subscriber | ≤3.2s crest total |

## pencilConfig.ts

Centralized reactive config in `pencil/config/pencilConfig.ts`. Mutations
propagate live to all consumers (live-tunable via `FilterTuner`, dev-only).

- **MOTION**: the cadence-band law above, plus the four house easings and the
  small-area filter rule (no `wobble-*` displacement filter targets an element
  larger than the logo).
- **PENCIL**: stroke width/roughness per element tier (gridFrame, gridSubgrid,
  gridCell, logoText, vine, fruitOutline).
- **YOSHI_COLORS**: canonical palette, including the `celestial` sun/moon hex
  table (single source for `DarkModeToggle.vue`'s fills/strokes).
- **FILTER_PRESETS**: reactive, 6 presets. `grain-static` (margin 5,
  `baseFrequency 0.04, numOctaves 3, scale 2.5, seed 2`); `wobble-logo`
  (`scale 3, intervalMs 550`); `wobble-celestial` (`scale 5, intervalMs 160`);
  `wobble-heart` (`scale 5, intervalMs 170`); `stroke-light`/`stroke-dark`
  (3-pass multiPass, `blendMode` multiply/screen). `resetPreset(id)`/
  `resetAllPresets()` restore frozen defaults.
- **BOIL_CONFIG**: reactive, `frameCount: 4, intervalMs: 150, frameBoil: 1.2,
  subgridBoil: 0.6, cellBoil: 0.3` (viewBox-unit perturbation, decreasing tier by
  tier so glyphs read stable while frame lines carry the most jitter).
  `resetBoilConfig()` restores defaults.
- **DRAW_IN_PRESETS**: exactly 4 live entries with real consumers — `gridFrame`,
  `gridSubgrid`, `gridCell` (`usePathAnimation.ts`), `glyph`
  (`HandwrittenGlyph.vue`). A former `solveCell`/`logo` pair was dead config
  (zero consumers — the logo reveals via a clip-path wipe, not a stroke draw-in)
  and was deleted, not left undocumented.
- **CELEBRATION**: the 3-beat timeline constants + `revealStaggerMs()`/
  `wavefrontStepMs()` helpers, described above.

### Filter IDs

| ID | Type | Usage |
|---|---|---|
| `grain-static` | Static-parameter grain, hoisted off the boil-cycling `<g>` | Grid lines, glyphs, icon buttons |
| `wobble-logo` | Animated wobble | Logo text |
| `wobble-celestial` | Animated wobble | Sun/moon toggle |
| `wobble-heart` | Animated wobble | Attribution card heart |
| `stroke-light` | Multipass stroke | Control panel (light mode) |
| `stroke-dark` | Multipass stroke | Control panel (dark mode) |

Two additional non-preset filters exist: `sparkle-rainbow` (gradient stroke for
given cells) and the moon/star organic-displacement filter.

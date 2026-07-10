# web/frontend/ — Sudoku + Futoshiki UI

Vue 3 + TypeScript + Tailwind v4 single-page application. Hand-drawn pencil-and-paper aesthetic (custom SVG glyphs, path-based grid boil, stroke-dasharray draw-ins). No router, no state library. Two games — Sudoku (default) and Futoshiki (async-loaded second scene, `?game=futoshiki`) — sharing one pencil aesthetic layer.

Shared animation primitives come from [`@mkbabb/pencil-boil`](https://github.com/mkbabb/pencil-boil) `^0.7.0`: the unified rAF scheduler, `usePrefersReducedMotion()`, `useBoilFrame`/`useFilterParamBoil`, the `sequence` subscriber kind, `createStrokeDrawIn`, the `useBoilCache`/`boilLineFrames`/`boilRectFrames` prebake surface, the four house easing curves (`easeOutCubic`/`resolveEasing` — the app-local copy excised), and the celestial mascot proofs. Board-solving runs in-browser via `@mkbabb/csp-solver-wasm` (currently a `file:` link to `../../csp-solver/wasm/pkg`, pending the registry-package swap) inside a per-game Worker — there is no required backend; `web/api` remains an optional Option-A path.

## File Tree

```
frontend/
├── Dockerfile                          # Multi-stage: dev (Vite HMR) / prod (nginx SPA)
├── vite.config.ts                      # Port 3000, @pencil/@games/@ aliases, sudokuTemplates build plugin, Worker ESM format
├── tsconfig.json                       # Strict, @pencil/*, @games/*, @/* aliases, bundler resolution
├── eslint.config.js                    # Boundary rules: pencil↛games, sudoku↮futoshiki (see Architecture)
├── package.json                        # Vue 3, @mkbabb/csp-solver-wasm, @mkbabb/keyframes.js, @mkbabb/pencil-boil, lucide, vueuse
└── src/
    ├── App.vue                         # Root: game selector (sudoku/futoshiki), chrome mounts, async laminate/FilterTuner
    ├── main.ts                         # createApp + mount; dev-only rafInstrumentation import
    ├── assets/index.css                # Tailwind v4 imports, CSS vars (light/dark), paper texture, PRT/contrast arms
    ├── composables/
    │   └── useTheme.ts                 # Dark mode via @vueuse/core useDark — the one composable outside pencil/games
    ├── pencil/                         # Generic aesthetic layer — never imports src/games/** (ESLint-enforced)
    │   ├── grid/
    │   │   ├── HandDrawnGrid/          # HandDrawnGrid.vue + usePathAnimation.ts — path-based boil, draw-in/erase
    │   │   ├── HandDrawnOutline.vue    # Outer board outline
    │   │   └── gridPaths.ts            # generateGridPaths, generateGridBoilFrames (LRU-cached per structural tuple)
    │   ├── glyph/
    │   │   ├── HandwrittenGlyph.vue    # SVG digit/hex rendering, draw-in, wiggle, sparkle-rainbow given cells
    │   │   ├── glyphAnimations.ts      # createGlyphDrawIn, createGlyphWiggle
    │   │   ├── glyphPaths.ts           # Pre-drawn SVG paths: digits 0–9 + hex A–G (2–3 variants each)
    │   │   └── glyphRegistry.ts        # toDisplayChar (0–9 + A–G for 16×16), deterministic variant selection
    │   ├── chrome/
    │   │   ├── AttributionCard/        # AttributionCard.vue + CrayonHeart.vue + useHoverCard.ts
    │   │   ├── OptionSelector/         # OptionSelector.vue + scribbleUnderline.ts — size/difficulty/game selects
    │   │   ├── BoilDivider.vue         # Boil-cycling divider line
    │   │   ├── CelebrationStar.vue     # Gold-star garnish (celebration beat-2 crest)
    │   │   ├── DiceIcon.vue            # Randomize icon: tumble roll + staggered pip-pop
    │   │   ├── SolveIcon.vue           # Solve-check icon: draw-in + sparkle
    │   │   ├── HandwrittenLogo.vue     # Logo text, clip-path reveal, wobble-logo filter
    │   │   ├── MarginNote.vue          # role=status live region — the page's own voice (graphite/teacher-red/gold-star tones)
    │   │   ├── ScribbleLoader.vue      # Thinking-scribble loading indicator
    │   │   └── SvgFilters.vue          # Global SVG defs: grain-static, wobble-*, stroke-* filters
    │   ├── celestial/
    │   │   └── DarkModeToggle.vue      # Sun/moon toggle: wobble-celestial filter, boil-frame sparkles/stars/rays
    │   ├── sheet/
    │   │   ├── AnswerKeyLaminate.vue   # Hold-to-peek translucent answer key (async-loaded)
    │   │   └── SheetWashiLabel.vue     # Washi-tape label decoration
    │   ├── composables/
    │   │   ├── celebration.ts          # Beat-3 classroom murmur (setTimeout chain, not a scheduler subscriber)
    │   │   │                           # (easings.ts excised — the four house curves + resolveEasing now come from @mkbabb/pencil-boil)
    │   │   └── useButtonAnimation.ts   # `playing` ref + timed reset for icon-button click animations
    │   ├── config/
    │   │   └── pencilConfig.ts         # Centralized MOTION bands, stroke, palette, filter/boil/draw-in/celebration config
    │   ├── dev/
    │   │   ├── FilterTuner.vue         # Dev-only live tuner (import.meta.env.DEV-gated, 0 bytes in prod)
    │   │   └── rafInstrumentation.ts   # Dev-only rAF-chain counter; re-exposes pencil-boil's schedulerDebugInfo()
    │   └── types.ts                    # AnimationState etc.
    └── games/
        ├── sudoku/                     # Never imports games/futoshiki/** (ESLint-enforced)
        │   ├── SudokuBoard/            # SudokuBoard.vue (ARIA grid + roving tabindex) + SudokuCell/ + SolverErrorNote.vue
        │   ├── ControlPanel/           # ControlPanel.vue + constants.ts (size/difficulty options)
        │   ├── composables/            # useSudoku, useSolver (Worker/wasm, DEFAULT), useApi (Option-A, legacy), useUrlState
        │   ├── data/templates.ts       # AUTO-GENERATED by vite.config.ts from csp-solver/data/sudoku_puzzles/ — never hand-edit
        │   ├── lib/                    # apiError.ts, conflicts.ts, solverError.ts
        │   ├── protocol.ts             # Worker postMessage request/response shapes
        │   ├── solver.worker.ts        # ES-module Worker: imports @mkbabb/csp-solver-wasm, runs solve/generate off-main-thread
        │   └── types.ts
        └── futoshiki/                  # Never imports games/sudoku/** (ESLint-enforced) — same shape as sudoku/, no Difficulty
            ├── FutoshikiGame.vue        # Scene root, async-loaded from App.vue
            ├── FutoshikiBoard/          # FutoshikiBoard.vue + FutoshikiCell/ + FutoshikiCaret/ (inequality carets) + SolverErrorNote.vue
            ├── ControlPanel/
            ├── composables/            # useFutoshiki, useSolver, useApi, useUrlState
            ├── lib/, protocol.ts, solver.worker.ts, types.ts
            └── README.md
```

## Architecture

```
App.vue
├── SvgFilters                # Mount once: global filter defs (grain, wobble, stroke) — 3 useFilterParamBoil subscribers
├── FilterTuner (DEV only)    # Wrench icon, live preset/boil parameter tuning
├── OptionSelector            # Game picker (sudoku/futoshiki) — ?game= URL param
├── Sudoku scene (default, sync-loaded)
│   ├── Header — @mbabb AttributionCard | HandwrittenLogo | DarkModeToggle
│   ├── SudokuBoard (role=grid, roving tabindex)
│   │   ├── HandDrawnGrid        # Path-based boil, grain-static filter
│   │   ├── SudokuCell[]          → HandwrittenGlyph (sparkle-rainbow given / user-ink user)
│   │   └── AnswerKeyLaminate (async, mounted on first hold/K)
│   └── ControlPanel              # Size/difficulty selects, dice/eraser/solve icon buttons
└── FutoshikiGame (async, mounted only when selected)
    ├── FutoshikiBoard (role=grid) — FutoshikiCell[] + FutoshikiCaret[] (inequality markers)
    └── ControlPanel
```

**ESLint boundary** (`eslint.config.js`, mechanical enforcement of the colocation edict — exactly two real boundaries, no finer-grained per-folder rules):
1. `src/pencil/**` may never import `src/games/**` (either alias or relative form) — the aesthetic layer renders whatever generic, already-erased data it's handed via props; it never reaches into domain state. The reverse (games → pencil) is expected and unrestricted.
2. `src/games/sudoku/**` and `src/games/futoshiki/**` may never import each other — two independently-evolving products sharing only `pencil`.

## State Management

No Pinia/Vuex. Each game owns one composable holding all its state (`useSudoku()`, `useFutoshiki()`): board values, given/original-given/overridden cell sets, `solveState` (idle → solving → solved/failed/error), URL-synced state (`useUrlState.ts`), and a board-generation counter that triggers grid redraw.

## Worker Solve Path

`useSolver()` (per game) is the **default** solve/generate path: a dedicated ES-module `solver.worker.ts` top-level-imports `@mkbabb/csp-solver-wasm` and runs `create_random_board`/`solve_sudoku`-equivalent calls off the main thread, so the wasm search tail never blocks the boil. `useApi.ts` (fetch against `web/api`'s `/api/v1/*`) remains in the tree as the legacy Option-A path but is no longer wired into either game's default composable — it has zero required server dependency for the shipped deploy. Both expose identical `BoardResponse`/`SolveResponse` shapes so swapping the import is the only change needed.

`solveBoard()` caps the client search at a size-scaled node budget (larger boards legitimately explore more); exhausting it surfaces a typed `BUDGET_EXCEEDED` `SolverError` (distinct from provable UNSAT), thrown as an `instanceof Error` with a `.code`, never a silently-wrong `solved: false`. `maxSolutions: 1` is always passed — the first valid completion under `Ac3` propagation need not be the *only* one; a different, still-valid completion is unspecified-but-correct, not a bug.

## Animation System

All animations respect `prefers-reduced-motion`; the celebration and hold-to-peek laminate additionally respect `prefers-reduced-transparency` / `prefers-contrast: more`.

**Motion cadence bands** (`pencilConfig.ts`'s `MOTION` — the law every animated value is audited against):

| Band | Range | Role | Members |
|---|---|---|---|
| A — stop-motion ambient | 125–170 ms/tick (6–8fps) | always-on hand-drawn jitter | grid boil 150, divider boil 150, star/sun-sparkle boil 125, celestial wobble 160, heart wobble 170, selection burst 120 |
| B — lazy ambient | 550–800 ms/tick | large/peripheral only | logo wobble 550, sun-ray boil 800, sun breathe 6s |
| C — responsive one-shots | 120–600 ms, user-triggered, finite | hover wiggle 600, button anims 400–500, tooltip fade 150, cell reveal 300 |
| D — choreographed sequences | 150 ms–3.2 s, finite + completion-emitting | grid draw-in ~800ms, erase ~150ms+4ms·i, logo clip 1.2s, theme page-turn 800ms, celebration ≤3.2s |

A dead band (175–550 ms) is reserved: no *ambient* loop may tick there (~3fps reads as jank); Band C one-shots are exempt. Four house easing curves only: `easeOutCubic` (draw-on), `easeInCubic` (erase), a back-out `pop` curve (cell reveal), and a spring-back curve (physical flourishes — theme toggle, dice tumble).

**Unified scheduler**: one shared `requestAnimationFrame` chain for the whole app (`@mkbabb/pencil-boil`'s scheduler) — grid boil, divider boil, the dark-mode toggle's boil-frame hooks, and `SvgFilters`' 3 filter-wobble subscribers all ride it instead of independent `setInterval`/native-rAF loops. Smoke-verified floor: **chains=1, subscribers=10**, returning to exactly 10 across settle-and-clear cycles (`window.__schedulerDebug()`, re-exposed by the dev-only `rafInstrumentation.ts`; measured in `docs/tranches/2026-07-grand-uplift/waves/W8-animation-gestalt.md` and `evidence/fe-composition.md` §5). A 77s stress harness (73 solve/clear, 19 size switches, 17 theme flips) never deviates from chains=1.

**Solve celebration** — a finite 3-beat timeline, not an infinite wiggle swarm (`CELEBRATION` in `pencilConfig.ts`): beat 1 is a board-normalized reveal wave (~1.2s window, per-cell stagger `clamp(round(1200/blankCount), 4, 24)` ms); beat 2, after a 150ms breath, is one diagonal wavefront crossing the board in ~500ms where each solved cell plays exactly 2 wiggle cycles (600ms/cycle); beat 3 is a classroom murmur — one registered solved cell wakes per 2.5s window for a single wiggle, driven by a `setTimeout` chain (`pencil/composables/celebration.ts`) that adds nothing to the rAF subscriber floor between wiggles. A gold-star garnish draws in near the beat-2 crest (~t=2.65s) with a 400ms foil-gleam sweep. Worst-case crest ≈3.05s, inside the 3.2s cap.

**Grain hoist**: `grain-static` (feTurbulence + feDisplacementMap) no longer wraps the boil-cycling grid `<g>` directly re-rasterizing the full board every ~150ms tick — it's hoisted onto pre-baked, opacity-toggled sibling `<g>` layers instead. Measured **−72.9% RasterTask** at the shipped architecture vs. the pre-hoist single-filtered-`<g>` tree (`design-union.md` prototype 9 / `union-verdict.md`, commit-stamped in the tranche evidence). SSIM 0.983–0.985 at settled/2×DPR (the acceptance floor); 6/36 matrix conditions (all DPR1 + live-animating mid-phase) fall below the 0.98 floor — the envelope is extended to cover them explicitly rather than gate-blocking.

**Hold-to-peek answer key** (`AnswerKeyLaminate.vue`, async-loaded): press-and-hold or `K` freezes the boil in place (`acquireHold`/`releaseHold` on the scheduler) and lays a translucent laminate over the board with missing answers in teacher-red. Under `prefers-reduced-transparency: reduce` **or** `prefers-contrast: more`, the laminate goes fully opaque and prints the *complete* solution (givens included) — the blocking fix for the "holes where the givens were" defect an opaque-but-partial key would otherwise show.

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

Centralized reactive config in `pencil/config/pencilConfig.ts`. Mutations propagate live to all consumers (live-tunable via `FilterTuner`, dev-only).

- **MOTION**: the cadence-band law above, plus the four house easings and the small-area filter rule (no `wobble-*` displacement filter targets an element larger than the logo).
- **PENCIL**: stroke width/roughness per element tier (gridFrame, gridSubgrid, gridCell, logoText, vine, fruitOutline).
- **YOSHI_COLORS**: canonical palette, including the `celestial` sun/moon hex table (single source for `DarkModeToggle.vue`'s fills/strokes).
- **FILTER_PRESETS**: reactive, 6 presets. `grain-static` (margin 5, `baseFrequency 0.04, numOctaves 3, scale 2.5, seed 2`); `wobble-logo` (`scale 3, intervalMs 550`); `wobble-celestial` (`scale 5, intervalMs 160`); `wobble-heart` (`scale 5, intervalMs 170`); `stroke-light`/`stroke-dark` (3-pass multiPass, `blendMode` multiply/screen). `resetPreset(id)`/`resetAllPresets()` restore frozen defaults.
- **BOIL_CONFIG**: reactive, `frameCount: 4, intervalMs: 150, frameBoil: 1.2, subgridBoil: 0.6, cellBoil: 0.3` (viewBox-unit perturbation, decreasing tier by tier so glyphs read stable while frame lines carry the most jitter). `resetBoilConfig()` restores defaults.
- **DRAW_IN_PRESETS**: exactly 4 live entries with real consumers — `gridFrame`, `gridSubgrid`, `gridCell` (`usePathAnimation.ts`), `glyph` (`HandwrittenGlyph.vue`). A former `solveCell`/`logo` pair was dead config (zero consumers — the logo actually reveals via a clip-path wipe, not a stroke draw-in) and has been deleted, not merely left undocumented.
- **CELEBRATION**: the 3-beat timeline constants + `revealStaggerMs()`/`wavefrontStepMs()` helpers, described under Animation System above.

### Filter IDs

| ID | Type | Usage |
|---|---|---|
| `grain-static` | Static-parameter grain, hoisted off the boil-cycling `<g>` | Grid lines, glyphs, icon buttons |
| `wobble-logo` | Animated wobble | Logo text |
| `wobble-celestial` | Animated wobble | Sun/moon toggle |
| `wobble-heart` | Animated wobble | Attribution card heart |
| `stroke-light` | Multipass stroke | Control panel (light mode) |
| `stroke-dark` | Multipass stroke | Control panel (dark mode) |

## Visual Style

- **Aesthetic**: Hand-drawn pencil-and-paper. No Rough.js dependency in the shipped tree (excised) — grid lines, glyphs, and chrome are custom SVG path generation.
- **Grid lines**: Jagged linear segments, angular kinks, path-based boil.
- **Board**: Pane-less; `role="grid"` with `aria-rowcount`/`aria-colcount`, roving tabindex (exactly one cell carries `tabindex="0"`, arrow keys + Ctrl+Home/End navigate).
- **Given cells**: `sparkle-rainbow` gradient stroke + auto-wiggle; reverts to `user-ink` on override.
- **Marginalia**: one `role="status"` live region (`MarginNote.vue`) speaks for the puzzle (graphite/teacher-red/gold-star tones); network/infra errors go to a separate `role="alert"` note card — the page never conflates "you got it wrong" with "the machinery broke."
- **Light**: Cream paper background, dark ink, sun with sparkle diamonds. **Dark**: warm brown background, muted accents, moon with twinkling stars.
- **Fonts**: Fraunces (display), Fira Code (mono), Patrick Hand (handwritten).

## Commands

```bash
npm install              # Install deps
npm run dev              # Vite dev server (:3000, /api proxied to :8000)
npm run build            # vue-tsc -b && vite build
npm run preview          # Preview production build
npm run lint             # Prettier --write src/
npm run lint:eslint      # ESLint (boundary rules + correctness)
npm run test:e2e         # Playwright
```

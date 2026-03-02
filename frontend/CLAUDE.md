# Frontend — Sudoku UI

Vue 3 + TypeScript + Tailwind v4 single-page application. Hand-drawn crayon aesthetic (Rough.js, custom SVG glyphs, stroke-dasharray animations). No router, no state library.

## File Tree

```
frontend/
├── Dockerfile                          # Multi-stage: dev (Vite HMR) / prod (nginx SPA)
├── index.html                          # Entry HTML, Google Fonts (Fraunces, Fira Code, Patrick Hand)
├── package.json                        # Vue 3, roughjs, keyframes.js, lucide, vueuse, reka-ui
├── vite.config.ts                      # Port 3000, /api proxy → :8000, ES2020, vue-vendor chunk
├── tailwind.config.ts                  # Dark mode (selector), custom fonts/colors/animations
├── tsconfig.json                       # Strict, @/* alias, bundler resolution
├── components.json                     # shadcn-vue config (unused in practice)
└── src/
    ├── App.vue                         # Root layout: centered header, board+sidebar, mobile controls
    ├── main.ts                         # createApp + mount
    ├── assets/
    │   └── index.css                   # Tailwind v4 imports, CSS vars (light/dark), paper texture
    ├── components/
    │   ├── custom/                     # Game components
    │   │   ├── SudokuBoard.vue         # Grid container (pane-less), animation state machine
    │   │   ├── SudokuCell.vue          # Cell input + ghost wobbleRect hover, one-click override
    │   │   ├── HandDrawnGrid.vue       # SVG grid lines (jagged), path-based boil (~6.7fps), ~800ms draw-in
    │   │   ├── HandwrittenGlyph.vue    # SVG digit rendering, draw-in, wiggle on hover, sparkle-rainbow given cells
    │   │   ├── ControlPanel.vue        # Size/difficulty selectors, action buttons (dice roll, eraser scrub, solve check)
    │   │   ├── DiceIcon.vue            # Custom SVG dice pair + tumble roll / pip-pop click animation
    │   │   ├── SolveIcon.vue           # Custom SVG checkmark + sparkle star click animation
    │   │   ├── DarkModeToggle.vue      # Sun/moon toggle, wobble-celestial filter, sparkle diamonds
    │   │   ├── FilterTuner.vue         # Live tuner for filter presets and grid boil config
    │   │   └── PencilCursor.vue        # Animated pencil overlay (mounted, not actively used)
    │   └── decorative/                 # Atmospheric components
    │       ├── SvgFilters.vue          # Global SVG defs: grain-static, wobble-*, stroke-* filters
    │       ├── VineBorder.vue          # Animated vine with rough.js fruits (Yoshi's Story style)
    │       ├── HandwrittenLogo.vue     # "sudoku" text with wobble-logo filter
    │       ├── SpiralSun.vue           # Rotating sun (50s spin, 6s pulse)
    │       ├── CrayonHeart.vue         # Heart with scribble fill animation
    │       └── DoodleAccents.vue       # Margin doodles: daisies, notes, stars, spirals
    ├── composables/
    │   ├── useSudoku.ts                # Core game state: size, difficulty, values, givenCells, solveState
    │   ├── useApi.ts                   # GET /board/random, POST /board/solve
    │   ├── useTheme.ts                 # Dark mode via @vueuse/core useDark
    │   └── useLineBoil.ts              # Frame index cycling for path-based boil and wobble effects
    └── lib/
        ├── utils.ts                    # cn() — clsx + tailwind-merge
        ├── prng.ts                     # mulberry32 seeded PRNG (shared across all path generation)
        ├── pathGeneration.ts           # Generic hand-drawn path primitives: wobbleLine, wobbleRect, catmullRomToBezier
        ├── gridPaths.ts                # Sudoku grid-specific: generateGridPaths, generateGridBoilFrames
        ├── handDrawnPaths.ts           # Re-export barrel for prng + pathGeneration + gridPaths
        ├── pencilConfig.ts             # Centralized stroke, filter preset, boil, and draw-in config
        ├── scribbleFill.ts             # Scan-line hachure fill for arbitrary closed SVG paths
        ├── scribbleUnderline.ts        # Scribble/ghost underline SVG data URIs for control panel
        ├── celestialGeometry.ts        # Sun ray, sparkle diamond, star polygon geometry
        ├── vineShapes.ts               # Fruit/leaf/heart drawing functions (rough.js)
        ├── vineGenerator.ts            # Vine orchestration: main strand, helix, thorns, tendrils, fruit placement
        ├── doodleShapes.ts             # Margin doodle shape generators: daisy, star, spiral, etc.
        ├── animation/
        │   └── glyphAnimations.ts      # createGlyphDrawIn, createGlyphWiggle
        └── glyphs/
            ├── glyphPaths.ts           # Pre-drawn SVG paths: digits 0-9 (2-3 variants), letters A-G
            └── glyphRegistry.ts        # Deterministic variant selection via spatial hash
```

## Architecture

```
App.vue
├── SvgFilters              # Mount once: global filter defs (grain, wobble, stroke)
├── FilterTuner (fixed)     # Wrench icon, live preset/boil parameter tuning
├── Main
│   ├── Header (centered)   # @mbabb hover card | HandwrittenLogo | DarkModeToggle
│   ├── Board + Controls row
│   │   ├── SudokuBoard     # Pane-less, grid lines extend freely
│   │   │   ├── HandDrawnGrid   # Path-based boil (~6.7fps), grain-static filter
│   │   │   └── SudokuCell[]    # Ghost wobbleRect on hover, one-click override
│   │   │       └── HandwrittenGlyph  # sparkle-rainbow (given) / user-ink (user)
│   │   ├── Mobile controls      # Unified card below board (md:hidden)
│   │   └── Desktop sidebar      # ControlPanel in card (hidden md:flex)
```

## State Management

No Pinia/Vuex. Single `useSudoku()` composable holds all game state:
- `size` (2/3/4), `difficulty` (EASY/MEDIUM/HARD)
- `values: Record<string, number>` (0 = empty)
- `givenCells: Set<string>` — server-provided clues (mutable on override)
- `originalGivenCells: Set<string>` — pristine clue positions (immutable per board)
- `overriddenCells: Set<string>` — given cells the user has manually replaced
- `animatingCells: Set<string>` — cells with active noise-staggered reveal animation
- `solveState`: idle → solving → solved/failed/error
- `boardGeneration`: counter, triggers grid redraw on change
- `setCell()`: allows overriding given cells (moves from `givenCells` → `overriddenCells`)
- `solve()`: fills only blank cells; consecutive solves are idempotent

## Animation System

All animations respect `prefers-reduced-motion`.

| Layer | Mechanism | Timing |
|---|---|---|
| Grid draw-in/erase | stroke-dashoffset via keyframes.js | ~800ms staggered with jitter |
| Cell reveal (solve/randomize) | CSS `cell-reveal` + noise-stagger | 300ms cubic-bezier, 40ms/cell shuffle via mulberry32 |
| Glyph draw-in | stroke-dashoffset | 350ms easeOutCubic |
| Glyph wiggle (hover) | SVG path `d` attribute morphing | 800ms alternate loop |
| Line boil | Path d-attribute cycling (4 frames) | 150ms/frame (~6.7fps) |
| Sun sparkle boil | Diamond polygon wobble (light mode) | 125ms/frame (~8fps) |
| Star boil | Star polygon wobble (dark mode) | 125ms/frame (~8fps) |
| Vine growth | stroke-dasharray + scale transforms | 2500ms + staggered fruits |
| Dice roll (randomize) | CSS rotate + scale keyframes, staggered pip pop | 500ms elastic overshoot |
| Eraser scrub (clear) | CSS translateX + rotate oscillation | 400ms ease |
| Solve check draw-in | stroke-dashoffset + sparkle scale | 500ms cubic-bezier |

## Visual Style

- **Aesthetic**: Hand-drawn crayon, Yoshi's Story palette
- **Grid lines**: Jagged linear segments (not smooth curves), angular kinks
- **Board**: Pane-less — no shadow, border, or padding; grid extends freely
- **Given cells**: `sparkle-rainbow` gradient stroke + auto-wiggle; reverts to `user-ink` on override
- **Ghost hover**: Hand-drawn wobbleRect on all cells (given included)
- **Light**: Cream paper background, dark ink, sun with sparkle diamonds
- **Dark**: Warm brown background, muted accents, moon with twinkling stars
- **Rendering**: Rough.js (vine, fruits, doodles, logo), custom wobbleLine (grid), pre-drawn SVG paths (glyphs)
- **Fonts**: Fraunces (display), Fira Code (mono), Patrick Hand (handwritten)
- **Action buttons**: Custom icons with click animations—DiceIcon (tumble roll + pip pop), Eraser (horizontal scrub), SolveIcon (check draw-in + star sparkle). Each uses a `playing` ref with timed reset (400–500ms).
- **Grid frame**: Outer frame rect uses a smaller `framePad` (8) than the internal grid-line `pad` (26)—pushes the frame outward so thick stroke doesn't occlude edge-cell glyphs.
- **Solve feedback**: Grid lines recolor (green success, red failure + shake)
- **FilterTuner**: Wrench icon (fixed position)—live parameter tuning for all filter presets and boil config

## pencilConfig.ts

Centralized reactive config in `lib/pencilConfig.ts`. Mutations propagate live to all consumers.

- **PENCIL** — stroke width/roughness per element tier (gridFrame, gridSubgrid, gridCell, logoText, vine, fruitOutline)
- **YOSHI_COLORS** — canonical palette: outlineBlack, heart, apple, banana, grapes, flower, leaf, vine
- **FILTER_PRESETS** — reactive `Record<string, FilterPreset>`, 6 presets (see below). `resetPreset(id)` / `resetAllPresets()` restore frozen defaults.
- **BOIL_CONFIG** — reactive `BoilConfig`: `frameCount` (4), `intervalMs` (150), `frameBoil` (1.2), `subgridBoil` (0.8), `cellBoil` (0.5). `resetBoilConfig()` restores defaults.
- **DRAW_IN_PRESETS** — frozen timing presets per element: duration, stagger, jitter, baseDelay, timing function

### Filter IDs

| ID | Type | Usage |
|---|---|---|
| `grain-static` | Static grain | Grid lines, glyphs, icon buttons |
| `wobble-logo` | Animated wobble | Logo text |
| `wobble-celestial` | Animated wobble | Sun/moon, icon hover |
| `wobble-heart` | Animated wobble | Heart, control hover |
| `stroke-light` | Multipass stroke | Control panel (light mode) |
| `stroke-dark` | Multipass stroke | Control panel (dark mode) |

## Commands

```bash
npm install         # Install deps
npm run dev         # Vite dev server (:3000)
npm run build       # vue-tsc + vite build
npm run preview     # Preview production build
npm run lint        # Prettier format
```

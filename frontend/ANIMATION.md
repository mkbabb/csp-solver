# Animation & Pencil Effect System

Hand-drawn crayon aesthetic built on SVG filters, stroke-dashoffset animations, and Rough.js rendering. Every visual effect flows from a centralized config in `lib/pencilConfig.ts`.

## Pencil Effect Pipeline

All pencil effects are SVG `<filter>` chains applied via CSS `filter: url(#id)`. Three primitive types compose every effect:

| Primitive | SVG Elements | Purpose |
|---|---|---|
| **Grain** | `feTurbulence(fractalNoise)` → `feDisplacementMap` | Static noise displacement — pencil texture |
| **Wobble** | `feTurbulence(turbulence)` + `<animate seed>` → `feDisplacementMap` | Animated jitter — hand-drawn boil |
| **MultiPass** | N × `feTurbulence` → N × `feDisplacementMap` → chained `feBlend` | Overlapping displaced strokes — heavy pencil |

Combinations: grain-only (`pencil-grain`), wobble-only (`boil-wobble`, `sun-wobble`), grain+wobble (`pencil-boil`, `pencil-boil-fast`), multiPass (`pencil-stroke`, `pencil-stroke-light`), texture (`crayon-texture`).

## SVG Filter Catalog

All filters defined in `FILTER_PRESETS` (pencilConfig.ts), rendered programmatically by `SvgFilters.vue`.

| ID | Type | baseFreq | Octaves | Scale | Animated | Used On |
|---|---|---|---|---|---|---|
| `boil-wobble` | wobble | 0.02 | 3 | 2 | 1.5s seed cycle | Moon icon |
| `sun-wobble` | wobble | 0.015 | 3 | 4 | 1.2s seed cycle | Sun icon |
| `pencil-grain` | grain | 0.04 | 3 | 2.5 | no | Glyphs, icon buttons |
| `pencil-boil` | grain+wobble | 0.04/0.02 | 4/3 | 2.5/2.2 | 1.8s | Grid wrapper |
| `pencil-boil-fast` | grain+wobble | 0.05/0.025 | 4/2 | 2.2/2.5 | 0.6s | Icon hover |
| `pencil-stroke` | multiPass×3 | 0.04 | 4 | 3.0–4.0 | no | Controls (light) |
| `pencil-stroke-light` | multiPass×3 | 0.04 | 4 | 3.0–4.0 | no | Controls (dark) |
| `crayon-texture` | texture | 0.65 | 5 | — | no | Rough fill surfaces |

Additional non-preset filters: `storybook-texture` (moon/star organic displacement), `sparkle-rainbow` (gradient).

To tweak: change values in `FILTER_PRESETS` → `SvgFilters.vue` re-renders automatically.

## Draw-In Animations

Stroke-dashoffset animation via `@mkbabb/keyframes.js`. Each SVG path's total length is measured, set as `strokeDasharray`, then `strokeDashoffset` animates from full length → 0.

Timing presets in `DRAW_IN_PRESETS`:

| Preset | Duration | Stagger | Jitter | Base Delay | Used By |
|---|---|---|---|---|---|
| `gridFrame` | 350ms | 30ms | ±20ms | 0 | Frame border lines |
| `gridSubgrid` | 280ms | 25ms | ±25ms | 150ms | Subgrid dividers |
| `gridCell` | 200ms | 10ms | ±15ms | 300ms | Cell dividers |
| `glyph` | 350ms | 0 | 0 | 0 | Individual digit draw-in |
| `solveCell` | 500ms | 120ms | 0 | 0 | Solve sequence cells |
| `logo` | 1800ms | 280ms | 0 | 0 | Logo letter strokes |

Jitter uses seeded PRNG (`mulberry32`) for deterministic irregularity. During draw-in, `pencil-boil` filter is withheld (displacement distorts dash pattern); applied after completion.

## Boil System

Two mechanisms create hand-drawn "alive" quality:

1. **SVG filter seed cycling**: `feTurbulence <animate attributeName="seed">` cycles through seed values (e.g., `0;1;2;3;4;3;2;1;0`) at the preset's duration. Renders different noise per frame.

2. **`useLineBoil` composable**: JS-side frame counter at ~8fps (125ms intervals). Returns reactive `currentFrame` ref. Used for:
   - Star polygon vertex wobble (dark mode)
   - Sun sparkle diamond wobble (light mode)
   - Sun ray polygon regeneration per frame
   - Scribble underline in controls

Frame-dependent `computed()` bindings regenerate SVG polygon points each tick using `mulberry32(frame * 100 + offset)`.

## Glyph Rendering

Pre-drawn SVG paths in `lib/glyphs/glyphPaths.ts`: digits 0–9 (2–3 handwritten variants each), letters A–G. Variant selection via spatial hash (`glyphRegistry.ts`) — deterministic per board position.

| Phase | Mechanism | Timing |
|---|---|---|
| Draw-in | stroke-dashoffset (keyframes.js) | 350ms easeOutCubic |
| Wiggle on hover | SVG path `d` attribute morph between variants | 600ms alternate loop |
| Static filter | `pencil-grain` on `<path>` | Always |

## Scribble Fill

`useScribbleFill` composable + `scribbleFill.ts` library. Generates scan-line hachure fill for closed SVG paths. Animated as traveling-dash snake via `stroke-dasharray` + `stroke-dashoffset` cycling.

## Decorative Layer

- **Rough.js**: Vine border (stroke + fruits), logo letters, doodle accents. Each generates multiple SVG elements with configurable `roughness`, `strokeWidth`, `bowing`.
- **Custom `wobbleLine`**: Grid lines use `handDrawnPaths.ts` — jagged linear segments with angular kinks (not smooth curves). Controlled by `PENCIL.gridFrame/gridSubgrid/gridCell`.
- **Sun rays**: Procedurally generated irregular polygons with seeded PRNG. Per-ray outer radius (85–100), inner radius (45–58), angular jitter (±7°), position wobble (±3px). Regenerated per boil frame.

## Performance

- **Conditional filter application**: Sun icon gets `sun-wobble` only in light mode; moon gets `boil-wobble` only in dark mode. Prevents invisible filter computation.
- **Animation pausing**: `.toggle-icon:not(.is-active) * { animation-play-state: paused }` halts CSS animations on hidden icons.
- **Board-size gating**: `pencil-boil` filter only applied when `boardSize <= 16` — prevents GPU thrash on large grids.
- **Boil lifecycle**: `useLineBoil` start/stop tied to theme — dark mode pauses sun sparkle boil, light mode pauses star boil.
- **Reduced motion**: All animations check `prefers-reduced-motion: reduce`. CSS global rule forces `animation-duration: 0.01ms`. JS animations show final state immediately.

## Color Palette

### Yoshi's Story palette (`YOSHI_COLORS`)
Used for decorative elements (vine, fruits, heart, doodles).

### Crayon palette (CSS custom properties)
| Var | Light | Dark | Used For |
|---|---|---|---|
| `--color-crayon-green` | `#2DC653` | `#3DD968` | Easy difficulty |
| `--color-crayon-orange` | `#F4A236` | `#F5B35C` | Medium difficulty |
| `--color-crayon-rose` | `#E8315B` | `#FF5C7C` | Hard difficulty |
| `--color-crayon-blue` | `#4A90D9` | `#6AABEB` | Accent |

### Ink colors
- Given cells: `--color-foreground` (dark ink / light ink)
- User cells: `--color-user-ink` (`#2563eb` light / `#60a5fa` dark)

### Solve feedback
- Success: grid lines → `--color-easy`, green-tinted cartoon shadow
- Failure: grid lines → `--color-hard`, red-tinted shadow + shake animation

# Animation and Pencil Effect System

This rendering stack uses SVG filters, stroke-dashoffset animations, and Rough.js. All
major animation parameters are centralized in `lib/pencilConfig.ts`.

Generic boil primitives (`mulberry32`, wobble path generation, celestial wobble
helpers, and `useLineBoil`) are imported from
[`@mkbabb/pencil-boil`](https://github.com/mkbabb/pencil-boil). Sudoku-specific grid
generation remains local in `lib/gridPaths.ts`.

Library-level animation docs:
[`pencil-boil/README.md`](https://github.com/mkbabb/pencil-boil#animation-model).

## Pencil Effect Pipeline

All pencil effects are SVG `<filter>` chains applied via CSS `filter: url(#id)`. Three primitive types underlie the preset filters:

| Primitive | SVG Elements | Purpose |
|---|---|---|
| **Grain** | `feTurbulence(fractalNoise)` → `feDisplacementMap` | Static noise displacement; pencil texture |
| **Wobble** | `feTurbulence(turbulence)` + JS `setAttribute` → `feDisplacementMap` | Animated jitter; hand-drawn boil |
| **MultiPass** | N × `feTurbulence` → N × `feDisplacementMap` → chained `feBlend` | Overlapping displaced strokes; heavy pencil |

Combinations: grain-only (`grain-static`), wobble-only (`wobble-logo`, `wobble-celestial`, `wobble-heart`), multiPass (`stroke-light`, `stroke-dark`).

## SVG Filter Catalog

All filters defined in `FILTER_PRESETS` (pencilConfig.ts), rendered programmatically by `SvgFilters.vue`.

| ID | Type | baseFreq | Octaves | Scale | Animated | Used On |
|---|---|---|---|---|---|---|
| `grain-static` | grain | 0.04 | 3 | 3.5 | no | Grid lines, glyphs, icon buttons |
| `wobble-logo` | wobble | 0.02 | 2 | 3 | 450ms JS cycle | Logo text |
| `wobble-celestial` | wobble | 0.02 | 2 | 5 | 160ms JS cycle | Sun/moon, icon hover |
| `wobble-heart` | wobble | 0.02 | 2 | 5 | 170ms JS cycle | Heart, control hover |
| `stroke-light` | multiPass×3 | 0.04 | 4 | 4.0–5.0 | no | Control panel (light) |
| `stroke-dark` | multiPass×3 | 0.04 | 4 | 4.0–5.0 | no | Control panel (dark) |

Additional non-preset filters: `storybook-texture` (moon/star organic displacement), `sparkle-rainbow` (gradient).

To tweak: mutate `FILTER_PRESETS` (reactive)—`SvgFilters.vue` re-renders automatically.

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

Jitter uses seeded PRNG (`mulberry32`) for deterministic irregularity. During draw-in, `grain-static` filter is withheld (displacement distorts dash pattern); applied after completion.

## Boil System

Two mechanisms produce hand-drawn motion:

1. **SVG filter baseFrequency cycling**: JS-driven `setInterval` + `setAttribute('baseFrequency', ...)` oscillates `feTurbulence` baseFrequency through preset offsets. No SMIL `<animate>`—avoids framework re-render issues.

2. **`useLineBoil` composable**: JS-side frame counter at ~8fps (125ms intervals). Returns reactive `currentFrame` ref. Used for:
   - Star polygon vertex wobble (dark mode)
   - Sun sparkle diamond wobble (light mode)
   - Sun ray polygon regeneration per frame
   - Scribble underline in controls

Frame-dependent `computed()` bindings regenerate SVG polygon points each tick using `mulberry32(frame * 100 + offset)`.

## Glyph Rendering

Pre-drawn SVG paths in `lib/glyphs/glyphPaths.ts`: digits 0–9 (2–3 handwritten
variants each), letters A–G. Variant selection via spatial hash (`glyphRegistry.ts`) is
deterministic per board position.

| Phase | Mechanism | Timing |
|---|---|---|
| Draw-in | stroke-dashoffset (keyframes.js) | 350ms easeOutCubic |
| Wiggle on hover | SVG path `d` attribute morph between variants | 600ms alternate loop |
| Static filter | `grain-static` on `<path>` | Always |

## Scribble Fill

`generateScribbleFill` (in `scribbleFill.ts`). Generates scan-line hachure fill for closed SVG paths. Animated via cycling `stroke-dasharray` + `stroke-dashoffset`.

## Decorative Layer

- **Rough.js**: Vine border (stroke + fruits), logo letters, doodle accents. Each generates multiple SVG elements with configurable `roughness`, `strokeWidth`, `bowing`.
- **Custom `wobbleLine`**: Grid lines use local `gridPaths.ts` +
  `@mkbabb/pencil-boil` primitives with jagged linear segments and angular kinks.
  Controlled by `PENCIL.gridFrame/gridSubgrid/gridCell`.
- **Sun rays**: Procedurally generated irregular polygons with seeded PRNG. Per-ray outer radius (85–100), inner radius (45–58), angular jitter (±7°), position wobble (±3px). Regenerated per boil frame.

## Performance

- **Conditional filter application**: Sun and moon both use `wobble-celestial`, conditionally applied via `:filter` per active theme. Prevents invisible filter computation.
- **Animation pausing**: `.toggle-icon:not(.is-active) * { animation-play-state: paused }` halts CSS animations on hidden icons.
- **Board-size gating**: `boardSize >= 16` reduces cell ghost-rect segment count (4→2) to limit path complexity on large grids.
- **Boil lifecycle**: `useLineBoil` start/stop is tied to theme; dark mode pauses sun
  sparkle boil, light mode pauses star boil.
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

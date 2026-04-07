# pencil-boil

TypeScript utility library for hand-drawn SVG animation.
Handles deterministic geometry generation, boil-frame perturbation, and frame scheduling for Vue.

## Quick start

```ts
import {
    mulberry32,
    wobbleLine,
    wobbleRect,
    wobbleLinePoints,
    perturbPoints,
    pointsToLinear,
    wobbleDiamond,
    wobbleStarPolygon,
    generateSunRays,
    useLineBoil,
} from "@mkbabb/pencil-boil";
```

## Module map

| Module         | Exports                                                                                                 | Purpose                           |
| -------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `random.ts`    | `mulberry32`                                                                                            | Deterministic PRNG                |
| `path.ts`      | `wobbleLine`, `wobbleRect`, `wobbleLinePoints`, `perturbPoints`, `catmullRomToBezier`, `pointsToLinear` | Path generation and serialization |
| `celestial.ts` | `wobbleDiamond`, `wobbleStarPolygon`, `generateSunRays`                                                 | Decorative polygon helpers        |
| `vue.ts`       | `useLineBoil`                                                                                           | Reactive frame loop for Vue       |

## Animation model

The boil/wobble pipeline has four steps:

1. Seed deterministic randomness.
2. Build base geometry for lines or polygons.
3. Generate frame variants by perturbing interior points.
4. Advance the active frame index on a fixed cadence.

The line keeps its identity across frames, so motion reads as re-tracing with analog
touch instead of full-shape regeneration.

### Stage 1: base geometry

`wobbleLinePoints(x1, y1, x2, y2, options)` builds a deterministic polyline using:

- `roughness` for displacement magnitude.
- `segments` for interior point count.
- `seed` for reproducible geometry.
- endpoint overshoot for a less mechanical edge.

`wobbleLine` serializes points to SVG path data:

- smooth mode via `Catmull-Rom` fitting.
- jagged mode via direct `M/L` segments.

`wobbleRect` composes four independently seeded sides into one closed path. This gives
edge-level variation while keeping a stable frame.

### Stage 2: boil perturbation

`perturbPoints(points, x1, y1, x2, y2, amount, seed)` creates frame-to-frame motion:

- first and last points stay anchored.
- interior points move perpendicular to segment direction.
- perturbation tapers by position, stronger near center and calmer near anchors.

That taper is the key to believable boil; endpoints remain settled while the interior
breathes.

### Stage 3: frame scheduling

`useLineBoil(frameCount, intervalMs)` is the runtime frame cycler:

- accepts numbers, refs, or getters.
- runs on `requestAnimationFrame`.
- advances by elapsed `intervalMs`, independent of display refresh.
- pauses on hidden `document.visibilityState`.
- resumes on visibility restore.
- honors `prefers-reduced-motion`.

Return shape:

```ts
const { currentFrame, start, stop } = useLineBoil(4, 125);
```

### Stage 4: compositing

In practice, compositing usually happens in three layers:

- **Geometry compositing**: combine primitives (`wobbleLine`, `wobbleRect`, celestial
  helpers) into a scene graph.
- **Frame compositing**: precompute `N` perturbed variants, then select by frame index.
- **Visual compositing**: render one or more SVG strokes/fills per frame in UI code.

This package emits geometry and frame indices. Rendering styles, filter stacks, and
domain constraints stay in the consuming application.

## End-to-end usage

```ts
import { computed } from "vue";
import {
    wobbleLinePoints,
    perturbPoints,
    pointsToLinear,
    useLineBoil,
} from "@mkbabb/pencil-boil";

const x1 = 20;
const y1 = 20;
const x2 = 320;
const y2 = 20;

const base = wobbleLinePoints(x1, y1, x2, y2, {
    roughness: 1.2,
    segments: 8,
    seed: 900,
});

const frameCount = 4;
const frames = Array.from({ length: frameCount }, (_, frame) => {
    const perturbed = perturbPoints(base, x1, y1, x2, y2, 0.8, 1200 + frame);
    return pointsToLinear(perturbed);
});

const { currentFrame } = useLineBoil(frameCount, 125);
const d = computed(() => frames[currentFrame.value]);
```

## Celestial helpers

- `wobbleDiamond`: seeded 4-vertex wobble polygon.
- `wobbleStarPolygon`: seeded 10-vertex star with per-vertex jitter.
- `generateSunRays`: seeded dual-ring irregular ray polygons (`outerPoly`, `innerPoly`).

These helpers are convenient for decorative boil motifs without adding extra generation
code.

## Performance and fidelity

- Keep `segments` moderate (`4`-`10` is common).
- Precompute frame arrays; avoid rebuilding geometry every tick.
- Reuse seeds across rerenders to preserve visual continuity.
- Increase `roughness` and boil `amount` conservatively to maintain line legibility.
- Pause hidden motion to avoid unnecessary work.

## License

Unlicense.

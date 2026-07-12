/**
 * Sudoku grid-specific SVG path generation: static grid paths and boil frame variants.
 */

import {
    type WobbleOptions,
    mulberry32,
    wobbleLine,
    wobbleLinePoints,
    wobbleRect,
    pointsToLinear,
    perturbPoints,
    useBoilCache,
} from "@mkbabb/pencil-boil";
import type { GrainConfig } from "../config/pencilConfig";

export interface GridPaths {
    frame: string;
    subgridLines: string[];
    cellLines: string[];
    /** Per-cell wobbleRect path in viewBox coords, keyed by position (row*boardSize+col) */
    cellRects: Record<number, string>;
}

export interface BoilFrames {
    /** frame[frameIdx] — closed rect path for the outer frame */
    frame: string[];
    /** subgridLines[lineIdx][frameIdx] */
    subgridLines: string[][];
    /** cellLines[lineIdx][frameIdx] */
    cellLines: string[][];
}

/**
 * Generate all SVG paths for a Sudoku grid.
 * @param boardSize - e.g. 9 for 9x9
 * @param subgridSize - e.g. 3 for 3x3 subgrids
 * @param viewBoxSize - SVG coordinate space size (e.g. 1000)
 * @param seed - for deterministic randomness
 */
export function generateGridPaths(
    boardSize: number,
    subgridSize: number,
    viewBoxSize: number,
    seed: number = 42,
): GridPaths {
    const cellSize = viewBoxSize / boardSize;
    const pad = 26;
    // Frame rect: top/bottom flush with card edge, sides pulled in slightly
    const frameXPad = 12;
    const frameYPad = 0;

    const frame = wobbleRect(
        frameXPad,
        frameYPad,
        viewBoxSize - frameXPad * 2,
        viewBoxSize - frameYPad * 2,
        {
            roughness: 0.5,
            segments: 6,
            seed,
            jagged: true,
        },
    );

    const subgridLines: string[] = [];
    const cellLines: string[] = [];

    let seedOffset = 100;

    // Vertical lines
    for (let i = 1; i < boardSize; i++) {
        const x = i * cellSize;
        const isSubgrid = i % subgridSize === 0;
        const path = wobbleLine(x, pad, x, viewBoxSize - pad, {
            roughness: isSubgrid ? 0.7 : 0.4,
            segments: isSubgrid ? 5 : 4,
            seed: seed + seedOffset++,
            jagged: true,
        });
        if (isSubgrid) {
            subgridLines.push(path);
        } else {
            cellLines.push(path);
        }
    }

    // Horizontal lines
    for (let i = 1; i < boardSize; i++) {
        const y = i * cellSize;
        const isSubgrid = i % subgridSize === 0;
        const path = wobbleLine(pad, y, viewBoxSize - pad, y, {
            roughness: isSubgrid ? 0.7 : 0.4,
            segments: isSubgrid ? 5 : 4,
            seed: seed + seedOffset++,
            jagged: true,
        });
        if (isSubgrid) {
            subgridLines.push(path);
        } else {
            cellLines.push(path);
        }
    }

    // Per-cell ghost rects — the ghost path is the only half both boards consume;
    // it's extracted + cached separately (generateCellRects) so the ghost-only
    // consumers never pay the frame/line work above.
    const cellRects = generateCellRects(boardSize, subgridSize, viewBoxSize, seed);

    return { frame, subgridLines, cellLines, cellRects };
}

/**
 * Generate ONLY the per-cell ghost rects for a grid — the half both boards' `cellRects`
 * computed actually consumes. Split out of {@link generateGridPaths} (T3-W8) so the ghost
 * path stops dragging the full frame + every subgrid/cell `wobbleLine` behind it: at a 9→16
 * switch that redundant frame/line pass was regenerated and immediately discarded.
 *
 * Memoized through the shared boil LRU (`useBoilCache`, cap 24), keyed on every param and
 * namespaced `cellRects|…` so it never collides with the boil-frame tuples. A size switch
 * invalidates the Vue `computed` but the LRU survives it — a return to a prior size is a hit.
 *
 * @param boardSize - e.g. 9 for 9x9
 * @param subgridSize - carried in the cache key for parity with the grid callers (the ghost
 *   geometry itself is subgrid-independent — cells are uniform); part of "keyed on every param".
 * @param viewBoxSize - SVG coordinate space size (e.g. 1000)
 * @param seed - for deterministic randomness
 */
export function generateCellRects(
    boardSize: number,
    subgridSize: number,
    viewBoxSize: number,
    seed: number = 42,
): Record<number, string> {
    return useBoilCache<Record<number, string>>(
        ["cellRects", boardSize, subgridSize, viewBoxSize, seed],
        () => {
            const cellSize = viewBoxSize / boardSize;
            const cellSegments = boardSize >= 16 ? 2 : 4;
            const cellRects: Record<number, string> = {};
            for (let r = 0; r < boardSize; r++) {
                for (let c = 0; c < boardSize; c++) {
                    const pos = r * boardSize + c;
                    const x = c * cellSize;
                    const y = r * cellSize;
                    cellRects[pos] = wobbleRect(x, y, cellSize, cellSize, {
                        roughness: 0.4,
                        segments: cellSegments,
                        seed: seed + 500 + pos * 7,
                        jagged: true,
                    });
                }
            }
            return cellRects;
        },
    );
}

// ── Grain bake (T3-W13 §1-P2) ─────────────────────────────────────
//
// The booked geometric bake (pencilConfig.ts, grain-static disposition) EXECUTED for
// the stroke-only boil surfaces: grain is folded INTO the pose geometry so the paths
// drop `filter=` entirely — steady-state raster zero. Mechanics mirror the live grain
// filter faithfully: the grain branch of SvgFilters.vue declares NO channel selectors
// on its feDisplacementMap, so both axes ride the turbulence ALPHA channel — one
// scalar field pushes x and y together, diagonally, by (A−0.5)·scale. The bake
// reproduces that: 1D fractal value noise over arc length at the grain wavelength
// (1/baseFrequency), `numOctaves` octaves (frequency ×2 / amplitude ×0.5 per octave),
// peak amplitude scale/2, added to BOTH coordinates of every vertex after the
// polyline is subdivided to wavelength/3 steps — grain-static: 25/3 ≈ 8, the booked
// "resample @8 units, ±1.25 amplitude, wavelength 25". Per-frame seeds keep the
// grain shimmering pose-to-pose the way the moving geometry sampled the static
// field. All params derive from the surface's own GrainConfig — one source, still
// FilterTuner-live (a preset mutation re-bakes through the consumers' computeds).

/** Deterministic lattice value in [0,1) for (seed, octave, lattice index). */
function grainLattice(seed: number, octave: number, i: number): number {
    return mulberry32(
        ((seed | 0) ^ Math.imul(octave + 1, 0x85ebca6b) ^ Math.imul(i | 0, 0x27d4eb2f)) | 0,
    )();
}

/** Fractal value noise over arc length `t`, in [-1, 1] — the feTurbulence stand-in. */
function grainNoise(t: number, grain: GrainConfig, seed: number): number {
    const octaves = Math.max(1, Math.floor(grain.numOctaves));
    let sum = 0;
    let norm = 0;
    let amp = 1;
    let freq = grain.baseFrequency;
    for (let o = 0; o < octaves; o++) {
        const x = t * freq;
        const i = Math.floor(x);
        const f = x - i;
        const a = grainLattice(seed, o, i);
        const b = grainLattice(seed, o, i + 1);
        const s = f * f * (3 - 2 * f); // smoothstep
        sum += amp * (a + (b - a) * s);
        norm += amp;
        amp *= 0.5;
        freq *= 2;
    }
    return (sum / norm) * 2 - 1;
}

/** Subdivide a polyline to ≤ maxStep spacing, KEEPING every original vertex —
 *  the resample inserts, never drops, so the wobble skeleton survives intact. */
function subdividePolyline(
    points: [number, number][],
    maxStep: number,
): [number, number][] {
    if (points.length < 2) return points.map((p) => [p[0], p[1]]);
    const out: [number, number][] = [[points[0][0], points[0][1]]];
    for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / maxStep));
        for (let k = 1; k <= n; k++) {
            out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n]);
        }
    }
    return out;
}

/** 2-decimal rounding for baked vertices only (0.01 user units ≪ the grain
 *  amplitude) — the dense resampled polylines stay byte-lean in the DOM. */
const round2 = (v: number) => Math.round(v * 100) / 100;

/** Fold grain displacement into a polyline: resample @ wavelength/3, then displace
 *  every vertex diagonally (both axes, one scalar field — the filter's default
 *  alpha-channel selectors) by fractal noise at the grain wavelength. */
function bakeGrainPoints(
    points: [number, number][],
    grain: GrainConfig,
    seed: number,
): [number, number][] {
    const wavelength = 1 / grain.baseFrequency;
    const pts = subdividePolyline(points, wavelength / 3);
    const amp = grain.scale / 2;
    const out: [number, number][] = [];
    let t = 0;
    for (let i = 0; i < pts.length; i++) {
        if (i > 0) {
            t += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        }
        const d = grainNoise(t, grain, seed) * amp;
        out.push([round2(pts[i][0] + d), round2(pts[i][1] + d)]);
    }
    return out;
}

/** Per-frame grain seed: the preset's seed, decorrelated per surface (path seed)
 *  and per pose — "per-frame seeds", the wave's directed approximation of moving
 *  geometry sampling the static turbulence field. */
function grainFrameSeed(grain: GrainConfig, pathSeed: number, f: number): number {
    return (grain.seed | 0) + Math.imul(pathSeed | 0, 101) + f * 7919;
}

// ── Boil frame generation ─────────────────────────────────────────

/**
 * Jittered arc-sampled corner polyline — the radius-aware wobble rect's corner join
 * (T3-W10 F1). Radial jitter amplitude rides `roughness · r · 0.06`, floored at 0.75
 * so corners boil in-family with the sides at any radius (T3-W12 §3 — unfloored, the
 * jitter sat 5–9× below the sides' and the corners read as clean geometric arcs);
 * a fresh seed per boil frame makes the corner shiver like the sides do.
 */
function arcBoilPoints(
    cx: number,
    cy: number,
    r: number,
    a0: number,
    a1: number,
    roughness: number,
    seed: number,
): [number, number][] {
    const steps = Math.max(2, Math.round((Math.abs(a1 - a0) * r) / 6));
    const rng = mulberry32(Math.floor(seed));
    const amp = Math.max(roughness * r * 0.06, 0.75);
    const points: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
        const a = a0 + ((a1 - a0) * i) / steps;
        const j = (rng() - 0.5) * 2 * amp;
        points.push([cx + Math.cos(a) * (r + j), cy + Math.sin(a) * (r + j)]);
    }
    return points;
}

/**
 * Generate boil frame variants for a standalone rectangle.
 * Frame 0 is the base path. Frames 1+ are small perpendicular perturbations.
 *
 * `radius` (T3-W10 F1) rounds the corners the way a hand would: the four sides are
 * shortened by `r` at each end and joined with jittered arc-sampled polylines — still
 * jagged, never a geometric arc. `radius = 0` reproduces the square frame exactly.
 *
 * `grain` (T3-W13 §1-P2) bakes the grain displacement INTO each pose (see the
 * §Grain bake block above) so the consumer renders the frames as static filterless
 * siblings. Omitted, output is byte-identical to the pre-W13 generator.
 */
export function generateRectBoilFrames(
    x: number,
    y: number,
    w: number,
    h: number,
    opts: WobbleOptions,
    boilAmount: number,
    frameCount: number,
    radius: number = 0,
    grain?: GrainConfig,
): string[] {
    const safeFrameCount = Math.max(2, Math.floor(frameCount));
    const s = opts.seed ?? 42;
    const r = Math.max(0, Math.min(radius, w / 2, h / 2));
    const sides =
        r === 0
            ? [
                  { x1: x, y1: y, x2: x + w, y2: y, seed: s },
                  { x1: x + w, y1: y, x2: x + w, y2: y + h, seed: s + 1 },
                  { x1: x + w, y1: y + h, x2: x, y2: y + h, seed: s + 2 },
                  { x1: x, y1: y + h, x2: x, y2: y, seed: s + 3 },
              ]
            : [
                  { x1: x + r, y1: y, x2: x + w - r, y2: y, seed: s },
                  { x1: x + w, y1: y + r, x2: x + w, y2: y + h - r, seed: s + 1 },
                  { x1: x + w - r, y1: y + h, x2: x + r, y2: y + h, seed: s + 2 },
                  { x1: x, y1: y + h - r, x2: x, y2: y + r, seed: s + 3 },
              ];

    // Quarter-arc corner joins, one after each side (SVG y-down): TR, BR, BL, TL.
    const HALF_PI = Math.PI / 2;
    const corners = [
        { cx: x + w - r, cy: y + r, a0: -HALF_PI, a1: 0 },
        { cx: x + w - r, cy: y + h - r, a0: 0, a1: HALF_PI },
        { cx: x + r, cy: y + h - r, a0: HALF_PI, a1: Math.PI },
        { cx: x + r, cy: y + r, a0: Math.PI, a1: Math.PI + HALF_PI },
    ];
    const roughness = opts.roughness ?? 1;

    const sideBasePoints = sides.map((side) =>
        wobbleLinePoints(side.x1, side.y1, side.x2, side.y2, {
            ...opts,
            seed: side.seed,
        }),
    );

    const frames: string[] = [];
    for (let f = 0; f < safeFrameCount; f++) {
        const sidePoints =
            f === 0
                ? sideBasePoints
                : sideBasePoints.map((pts, i) =>
                      perturbPoints(
                          pts,
                          sides[i].x1,
                          sides[i].y1,
                          sides[i].x2,
                          sides[i].y2,
                          boilAmount,
                          sides[i].seed + f * 997,
                      ),
                  );

        if (r === 0) {
            if (grain) {
                // Same ring the un-grained serialization renders: sides 1..3 drop
                // their first point (the `.replace(/^M[^ ]+/, "")` below elides it).
                const ring: [number, number][] = [...sidePoints[0]];
                for (let si = 1; si < 4; si++) ring.push(...sidePoints[si].slice(1));
                frames.push(
                    pointsToLinear(bakeGrainPoints(ring, grain, grainFrameSeed(grain, s, f))) +
                        " Z",
                );
                continue;
            }
            let d = pointsToLinear(sidePoints[0]);
            for (let si = 1; si < 4; si++) {
                d += " " + pointsToLinear(sidePoints[si]).replace(/^M[^ ]+/, "");
            }
            d += " Z";
            frames.push(d);
            continue;
        }

        const ring: [number, number][] = [];
        for (let si = 0; si < 4; si++) {
            ring.push(...sidePoints[si]);
            const c = corners[si];
            const arc = arcBoilPoints(
                c.cx,
                c.cy,
                r,
                c.a0,
                c.a1,
                roughness,
                s + 10 + si + f * 997,
            );
            // Pin the arc's endpoints to the adjacent sides' endpoints PER FRAME
            // (T3-W12 §3, a4's adjacent flag): the fresh per-frame arc seed otherwise
            // drifts off the perturbed sides — a per-frame corner shimmer. Moot at the
            // r=0 default (this branch never runs); a trap for any future opt-in.
            const prevEnd = sidePoints[si][sidePoints[si].length - 1];
            const nextStart = sidePoints[(si + 1) % 4][0];
            if (arc.length >= 2 && prevEnd && nextStart) {
                arc[0] = prevEnd;
                arc[arc.length - 1] = nextStart;
            }
            ring.push(...arc);
        }
        frames.push(
            pointsToLinear(
                grain ? bakeGrainPoints(ring, grain, grainFrameSeed(grain, s, f)) : ring,
            ) + " Z",
        );
    }
    return frames;
}

/**
 * Generate boil frame variants for a standalone line segment.
 * Frame 0 is the base path. Frames 1+ are small perpendicular perturbations.
 *
 * `grain` (T3-W13 §1-P2): bakes the grain displacement INTO each pose (all frames,
 * base included — the live filter grained frame 0 too). Omitted, output is
 * byte-identical to the pre-W13 generator.
 */
export function generateLineBoilFrames(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    opts: WobbleOptions,
    boilAmount: number,
    frameCount: number,
    grain?: GrainConfig,
): string[] {
    const safeFrameCount = Math.max(2, Math.floor(frameCount));
    const pathSeed = opts.seed ?? 42;
    const basePoints = wobbleLinePoints(x1, y1, x2, y2, opts);
    const frames: string[] = [];
    for (let f = 0; f < safeFrameCount; f++) {
        let pts =
            f === 0
                ? basePoints
                : perturbPoints(basePoints, x1, y1, x2, y2, boilAmount, pathSeed + f * 997);
        if (grain) pts = bakeGrainPoints(pts, grain, grainFrameSeed(grain, pathSeed, f));
        frames.push(pointsToLinear(pts));
    }
    return frames;
}

/**
 * Generate all boil frame variants for a Sudoku grid.
 * Frame 0 is the base path. Frames 1+ are small perpendicular perturbations
 * of the base points — simulating an artist retracing the same line.
 */
export function generateGridBoilFrames(
    boardSize: number,
    subgridSize: number,
    viewBoxSize: number,
    baseSeed: number = 42,
    frameCount: number = 4,
    frameBoil: number = 2.0,
    subgridBoil: number = 1.5,
    cellBoil: number = 1.0,
): BoilFrames {
    const safeFrameCount = Math.max(2, Math.floor(frameCount));
    // Memoized through the shared boil LRU (pencil-boil useBoilCache, cap 24):
    // normKey quantizes non-integers to 4 decimals — the exact key discipline the
    // hand-rolled GRID_BOIL_CACHE encoded, now re-pointed onto the library (L25-19).
    return useBoilCache<BoilFrames>(
        [
            boardSize,
            subgridSize,
            viewBoxSize,
            baseSeed,
            safeFrameCount,
            frameBoil,
            subgridBoil,
            cellBoil,
        ],
        () => {
            const cellSize = viewBoxSize / boardSize;
            const pad = 26;
            // Frame rect: top/bottom flush with card edge, sides pulled in slightly
            const frameXPad = 12;
            const frameYPad = 0;

            function lineBoilFrames(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                opts: WobbleOptions,
                boilAmount: number,
            ): string[] {
                const basePoints = wobbleLinePoints(x1, y1, x2, y2, opts);
                const frames: string[] = [pointsToLinear(basePoints)];
                for (let f = 1; f < safeFrameCount; f++) {
                    const perturbed = perturbPoints(
                        basePoints,
                        x1,
                        y1,
                        x2,
                        y2,
                        boilAmount,
                        (opts.seed ?? 42) + f * 997,
                    );
                    frames.push(pointsToLinear(perturbed));
                }
                return frames;
            }

            const frame = generateRectBoilFrames(
                frameXPad,
                frameYPad,
                viewBoxSize - frameXPad * 2,
                viewBoxSize - frameYPad * 2,
                {
                    roughness: 0.5,
                    segments: 6,
                    seed: baseSeed,
                    jagged: true,
                },
                frameBoil,
                safeFrameCount,
            );

            const subgridLines: string[][] = [];
            const cellLines: string[][] = [];
            let seedOffset = 100;

            // Vertical lines
            for (let i = 1; i < boardSize; i++) {
                const x = i * cellSize;
                const isSubgrid = i % subgridSize === 0;
                const opts: WobbleOptions = {
                    roughness: isSubgrid ? 0.7 : 0.4,
                    segments: isSubgrid ? 5 : 4,
                    seed: baseSeed + seedOffset++,
                    jagged: true,
                };
                const frames = lineBoilFrames(
                    x,
                    pad,
                    x,
                    viewBoxSize - pad,
                    opts,
                    isSubgrid ? subgridBoil : cellBoil,
                );
                if (isSubgrid) subgridLines.push(frames);
                else cellLines.push(frames);
            }

            // Horizontal lines
            for (let i = 1; i < boardSize; i++) {
                const y = i * cellSize;
                const isSubgrid = i % subgridSize === 0;
                const opts: WobbleOptions = {
                    roughness: isSubgrid ? 0.7 : 0.4,
                    segments: isSubgrid ? 5 : 4,
                    seed: baseSeed + seedOffset++,
                    jagged: true,
                };
                const frames = lineBoilFrames(
                    pad,
                    y,
                    viewBoxSize - pad,
                    y,
                    opts,
                    isSubgrid ? subgridBoil : cellBoil,
                );
                if (isSubgrid) subgridLines.push(frames);
                else cellLines.push(frames);
            }

            return { frame, subgridLines, cellLines };
        },
    );
}

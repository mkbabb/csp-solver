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
        frames.push(pointsToLinear(ring) + " Z");
    }
    return frames;
}

/**
 * Generate boil frame variants for a standalone line segment.
 * Frame 0 is the base path. Frames 1+ are small perpendicular perturbations.
 */
export function generateLineBoilFrames(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    opts: WobbleOptions,
    boilAmount: number,
    frameCount: number,
): string[] {
    const safeFrameCount = Math.max(2, Math.floor(frameCount));
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

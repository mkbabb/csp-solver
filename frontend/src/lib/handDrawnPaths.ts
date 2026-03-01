/**
 * Lightweight hand-drawn SVG path generation.
 * Generates wobbly lines via Catmull-Rom splines with seeded random displacement.
 */

/** Seeded PRNG (mulberry32) for deterministic wobble */
export function mulberry32(seed: number): () => number {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

interface WobbleOptions {
    roughness?: number;
    segments?: number;
    seed?: number;
    jagged?: boolean;
}

/**
 * Convert a set of points to a cubic bezier SVG path using Catmull-Rom fitting.
 */
export function catmullRomToBezier(points: [number, number][]): string {
    if (points.length < 2) return '';
    if (points.length === 2) {
        return `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]}`;
    }

    let d = `M${points[0][0]},${points[0][1]}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
        const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

        d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }

    return d;
}

/**
 * Convert a set of points to a linear SVG path (M...L...L...).
 * Produces jagged, hand-ruled lines with angular kinks instead of smooth curves.
 */
export function pointsToLinear(points: [number, number][]): string {
    if (points.length < 2) return '';
    let d = `M${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
        d += ` L${points[i][0]},${points[i][1]}`;
    }
    return d;
}

/**
 * Generate wobble points for a line (intermediate representation before path serialization).
 * Useful for boil frames: generate points once, then perturb per frame.
 */
export function wobbleLinePoints(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: WobbleOptions = {},
): [number, number][] {
    const { roughness = 1, segments = 8, seed = 42 } = options;
    const rng = mulberry32(seed);

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const perpX = -dy / len;
    const perpY = dx / len;

    const maxDisplace = roughness * len * 0.015;

    const overshoot = roughness * len * 0.003;
    const sx = x1 - (dx / len) * overshoot * (0.5 + rng() * 0.5);
    const sy = y1 - (dy / len) * overshoot * (0.5 + rng() * 0.5);
    const ex = x2 + (dx / len) * overshoot * (0.5 + rng() * 0.5);
    const ey = y2 + (dy / len) * overshoot * (0.5 + rng() * 0.5);

    const points: [number, number][] = [[sx, sy]];

    for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const mx = x1 + dx * t;
        const my = y1 + dy * t;
        const offset = (rng() - 0.5) * 2 * maxDisplace;
        points.push([mx + perpX * offset, my + perpY * offset]);
    }

    points.push([ex, ey]);
    return points;
}

/**
 * Add small perpendicular perturbations to points for boil frames.
 * Endpoints (first/last) are NOT perturbed to keep line anchors stable.
 */
export function perturbPoints(
    points: [number, number][],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    amount: number,
    seed: number,
): [number, number][] {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return points.map(p => [...p] as [number, number]);

    const perpX = -dy / len;
    const perpY = dx / len;
    const rng = mulberry32(seed);

    return points.map((p, i) => {
        // Don't perturb endpoints
        if (i === 0 || i === points.length - 1) return [p[0], p[1]];
        const offset = (rng() - 0.5) * 2 * amount;
        return [p[0] + perpX * offset, p[1] + perpY * offset];
    });
}

/**
 * Generate a wobbly line path between two points.
 * Produces a main stroke plus an optional faint "double stroke" for pencil realism.
 */
export function wobbleLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: WobbleOptions = {},
): string {
    const { jagged = false } = options;
    const points = wobbleLinePoints(x1, y1, x2, y2, options);
    return jagged ? pointsToLinear(points) : catmullRomToBezier(points);
}

/**
 * Generate a wobbly rectangle frame as a closed path.
 */
export function wobbleRect(
    x: number,
    y: number,
    w: number,
    h: number,
    options: WobbleOptions = {},
): string {
    const s = options.seed ?? 42;
    const top = wobbleLine(x, y, x + w, y, { ...options, seed: s });
    const right = wobbleLine(x + w, y, x + w, y + h, { ...options, seed: s + 1 });
    const bottom = wobbleLine(x + w, y + h, x, y + h, { ...options, seed: s + 2 });
    const left = wobbleLine(x, y + h, x, y, { ...options, seed: s + 3 });

    // Join into a single closed path
    return (
        top +
        ' ' +
        right.replace(/^M[^ ]+/, '') +
        ' ' +
        bottom.replace(/^M[^ ]+/, '') +
        ' ' +
        left.replace(/^M[^ ]+/, '') +
        ' Z'
    );
}

export interface GridPaths {
    frame: string;
    subgridLines: string[];
    cellLines: string[];
    /** Per-cell wobbleRect path in viewBox coords, keyed by position (row*boardSize+col) */
    cellRects: Record<number, string>;
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
    const pad = 26; // inset for frame — clears rounded-xl border-radius + frame stroke width

    const frame = wobbleRect(pad, pad, viewBoxSize - pad * 2, viewBoxSize - pad * 2, {
        roughness: 0.5,
        segments: 6,
        seed,
        jagged: true,
    });

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

    // Per-cell ghost rects in the same 1000×1000 viewBox coordinate space
    // Use fewer segments for large boards to reduce computation (1024+ wobbleLine calls otherwise)
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

    return { frame, subgridLines, cellLines, cellRects };
}

// ── Boil frame generation ─────────────────────────────────────────

export interface BoilFrames {
    /** frame[frameIdx] — closed rect path for the outer frame */
    frame: string[];
    /** subgridLines[lineIdx][frameIdx] */
    subgridLines: string[][];
    /** cellLines[lineIdx][frameIdx] */
    cellLines: string[][];
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
    const cellSize = viewBoxSize / boardSize;
    const pad = 26;

    // Helper: generate boil frames for a single line
    function lineBoilFrames(
        x1: number, y1: number, x2: number, y2: number,
        opts: WobbleOptions, boilAmount: number,
    ): string[] {
        const basePoints = wobbleLinePoints(x1, y1, x2, y2, opts);
        const frames: string[] = [pointsToLinear(basePoints)]; // frame 0 = base
        for (let f = 1; f < frameCount; f++) {
            const perturbed = perturbPoints(
                basePoints, x1, y1, x2, y2,
                boilAmount, (opts.seed ?? 42) + f * 997,
            );
            frames.push(pointsToLinear(perturbed));
        }
        return frames;
    }

    // Helper: generate boil frames for the rect (frame border)
    function rectBoilFrames(
        x: number, y: number, w: number, h: number,
        opts: WobbleOptions, boilAmount: number,
    ): string[] {
        const s = opts.seed ?? 42;
        const sides = [
            { x1: x, y1: y, x2: x + w, y2: y, seed: s },         // top
            { x1: x + w, y1: y, x2: x + w, y2: y + h, seed: s + 1 }, // right
            { x1: x + w, y1: y + h, x2: x, y2: y + h, seed: s + 2 }, // bottom
            { x1: x, y1: y + h, x2: x, y2: y, seed: s + 3 },     // left
        ];

        // Generate base points for each side
        const sideBasePoints = sides.map(side =>
            wobbleLinePoints(side.x1, side.y1, side.x2, side.y2, { ...opts, seed: side.seed })
        );

        const frames: string[] = [];
        for (let f = 0; f < frameCount; f++) {
            const sidePoints = f === 0
                ? sideBasePoints
                : sideBasePoints.map((pts, i) =>
                    perturbPoints(
                        pts, sides[i].x1, sides[i].y1, sides[i].x2, sides[i].y2,
                        boilAmount, sides[i].seed + f * 997,
                    )
                );

            // Join sides into a single closed path
            let d = pointsToLinear(sidePoints[0]);
            for (let si = 1; si < 4; si++) {
                d += ' ' + pointsToLinear(sidePoints[si]).replace(/^M[^ ]+/, '');
            }
            d += ' Z';
            frames.push(d);
        }
        return frames;
    }

    // Frame (outer border)
    const frame = rectBoilFrames(pad, pad, viewBoxSize - pad * 2, viewBoxSize - pad * 2, {
        roughness: 0.5, segments: 6, seed: baseSeed, jagged: true,
    }, frameBoil);

    // Grid lines
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
            x, pad, x, viewBoxSize - pad,
            opts, isSubgrid ? subgridBoil : cellBoil,
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
            pad, y, viewBoxSize - pad, y,
            opts, isSubgrid ? subgridBoil : cellBoil,
        );
        if (isSubgrid) subgridLines.push(frames);
        else cellLines.push(frames);
    }

    return { frame, subgridLines, cellLines };
}

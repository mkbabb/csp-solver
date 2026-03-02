/**
 * Generic hand-drawn SVG path primitives.
 * Generates wobbly lines via Catmull-Rom splines with seeded random displacement.
 */

import { mulberry32 } from '@/lib/prng';

export interface WobbleOptions {
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

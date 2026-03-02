/**
 * Generalized scribble-fill algorithm for arbitrary closed SVG paths.
 *
 * Given any closed SVG path (heart, star, polygon, etc.), generates hand-drawn
 * hachure/scribble fill lines inside it. Uses a scan-line intersection approach:
 *
 *   1. Sample points along the boundary path to approximate it as a polygon
 *   2. Create parallel scan lines at a given angle across the bounding box
 *   3. For each scan line, find entry/exit intersections with the polygon boundary
 *   4. Between each pair of intersections, generate a wobbly line
 *
 * Usage example:
 *   const heartPath = 'M20,35 C20,35 5,25 5,15 ... Z';
 *   const bounds = { x: 5, y: 3, width: 30, height: 32 };
 *   const fills = generateScribbleFill(heartPath, bounds, { angle: 45, gap: 4 });
 *   // fills is an array of SVG path `d` strings, each representing one fill stroke.
 *
 * This works generically with any closed path: hearts, stars, circles, letters, etc.
 */

import { mulberry32 } from '@/lib/prng';
import { wobbleLine } from '@/lib/pathGeneration';

export interface ScribbleFillOptions {
    /** Hachure angle in degrees (default: 45) */
    angle?: number;
    /** Gap between fill lines in SVG units (default: 4) */
    gap?: number;
    /** How wobbly the fill lines are (default: 1) */
    roughness?: number;
    /** Seed for deterministic randomness (default: 42) */
    seed?: number;
}

/**
 * Sample points along an SVG path to approximate it as a polygon.
 * Uses a temporary invisible SVG path element to leverage the browser's
 * built-in path geometry engine.
 */
function samplePathPoints(
    closedPath: string,
    numSamples: number = 200,
): [number, number][] {
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.overflow = 'hidden';
    document.body.appendChild(svg);

    const pathEl = document.createElementNS(svgNs, 'path');
    pathEl.setAttribute('d', closedPath);
    svg.appendChild(pathEl);

    const totalLen = pathEl.getTotalLength();
    const points: [number, number][] = [];

    for (let i = 0; i < numSamples; i++) {
        const t = (i / numSamples) * totalLen;
        const pt = pathEl.getPointAtLength(t);
        points.push([pt.x, pt.y]);
    }

    document.body.removeChild(svg);
    return points;
}

/**
 * Find intersections of a horizontal line (y = scanY) with a polygon defined
 * by an array of vertices. Returns sorted x-coordinates of intersections.
 */
function findScanLineIntersections(
    polygon: [number, number][],
    scanY: number,
): number[] {
    const intersections: number[] = [];
    const n = polygon.length;

    for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const [x1, y1] = polygon[i];
        const [x2, y2] = polygon[j];

        // Check if the scan line crosses this edge
        if ((y1 <= scanY && y2 > scanY) || (y2 <= scanY && y1 > scanY)) {
            // Linear interpolation to find x at scanY
            const t = (scanY - y1) / (y2 - y1);
            intersections.push(x1 + t * (x2 - x1));
        }
    }

    return intersections.sort((a, b) => a - b);
}

/**
 * Rotate a point around a center by a given angle (in radians).
 */
function rotatePoint(
    x: number,
    y: number,
    cx: number,
    cy: number,
    angle: number,
): [number, number] {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const dx = x - cx;
    const dy = y - cy;
    return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
}

/**
 * Given a closed SVG path string, generate an array of fill line path strings
 * that create a hand-drawn scribble fill effect inside the shape.
 *
 * @param closedPath  A valid SVG path `d` attribute string for a closed shape
 * @param bounds      The bounding box of the shape in SVG coordinate space
 * @param options     Configuration for the fill appearance
 * @returns           Array of SVG path `d` strings, one per fill stroke
 */
export function generateScribbleFill(
    closedPath: string,
    bounds: { x: number; y: number; width: number; height: number },
    options?: ScribbleFillOptions,
): string[] {
    const {
        angle = 45,
        gap = 4,
        roughness = 1,
        seed = 42,
    } = options ?? {};

    // 1. Sample boundary to get a polygon approximation
    const polygon = samplePathPoints(closedPath, 300);
    if (polygon.length < 3) return [];

    // 2. Compute rotation so we can do horizontal scan lines on the rotated polygon
    const angleRad = -(angle * Math.PI) / 180;
    const cx = bounds.x + bounds.width / 2;
    const cy = bounds.y + bounds.height / 2;

    // Rotate all polygon points
    const rotatedPolygon: [number, number][] = polygon.map(([px, py]) =>
        rotatePoint(px, py, cx, cy, angleRad),
    );

    // 3. Find bounding box of rotated polygon
    let minY = Infinity;
    let maxY = -Infinity;
    for (const [, ry] of rotatedPolygon) {
        if (ry < minY) minY = ry;
        if (ry > maxY) maxY = ry;
    }

    // Small inset to avoid edge artifacts
    const inset = gap * 0.3;
    minY += inset;
    maxY -= inset;

    // 4. Generate scan lines and find intersections
    const rng = mulberry32(seed);
    const fillPaths: string[] = [];
    let lineIndex = 0;

    for (let scanY = minY; scanY <= maxY; scanY += gap) {
        // Add slight random jitter to the scan line position for a more organic feel
        const jitteredY = scanY + (rng() - 0.5) * gap * 0.2;

        const intersections = findScanLineIntersections(rotatedPolygon, jitteredY);

        // Process intersection pairs (entry/exit)
        for (let k = 0; k + 1 < intersections.length; k += 2) {
            const xStart = intersections[k] + inset * 0.5;
            const xEnd = intersections[k + 1] - inset * 0.5;

            if (xEnd - xStart < 1) continue; // skip tiny segments

            // Rotate endpoints back to original coordinate space
            const [x1, y1] = rotatePoint(xStart, jitteredY, cx, cy, -angleRad);
            const [x2, y2] = rotatePoint(xEnd, jitteredY, cx, cy, -angleRad);

            // Generate a wobbly line between the two points
            const lineSeed = seed + 1000 + lineIndex * 7;
            const path = wobbleLine(x1, y1, x2, y2, {
                roughness,
                segments: Math.max(4, Math.ceil(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) / 3)),
                seed: lineSeed,
            });

            fillPaths.push(path);
            lineIndex++;
        }
    }

    return fillPaths;
}

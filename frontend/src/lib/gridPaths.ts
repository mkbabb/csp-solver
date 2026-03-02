/**
 * Sudoku grid-specific SVG path generation: static grid paths and boil frame variants.
 */

import {
    type WobbleOptions,
    wobbleLine,
    wobbleLinePoints,
    wobbleRect,
    pointsToLinear,
    perturbPoints,
} from '@/lib/pathGeneration';

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
    const pad = 26;
    // Frame rect sits further out than grid lines so thick stroke doesn't occlude edge cells
    const framePad = 8;

    const frame = wobbleRect(framePad, framePad, viewBoxSize - framePad * 2, viewBoxSize - framePad * 2, {
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

    // Per-cell ghost rects
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
    // Frame rect sits further out than grid lines so thick stroke doesn't occlude edge cells
    const framePad = 8;

    function lineBoilFrames(
        x1: number, y1: number, x2: number, y2: number,
        opts: WobbleOptions, boilAmount: number,
    ): string[] {
        const basePoints = wobbleLinePoints(x1, y1, x2, y2, opts);
        const frames: string[] = [pointsToLinear(basePoints)];
        for (let f = 1; f < frameCount; f++) {
            const perturbed = perturbPoints(
                basePoints, x1, y1, x2, y2,
                boilAmount, (opts.seed ?? 42) + f * 997,
            );
            frames.push(pointsToLinear(perturbed));
        }
        return frames;
    }

    function rectBoilFrames(
        x: number, y: number, w: number, h: number,
        opts: WobbleOptions, boilAmount: number,
    ): string[] {
        const s = opts.seed ?? 42;
        const sides = [
            { x1: x, y1: y, x2: x + w, y2: y, seed: s },
            { x1: x + w, y1: y, x2: x + w, y2: y + h, seed: s + 1 },
            { x1: x + w, y1: y + h, x2: x, y2: y + h, seed: s + 2 },
            { x1: x, y1: y + h, x2: x, y2: y, seed: s + 3 },
        ];

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

            let d = pointsToLinear(sidePoints[0]);
            for (let si = 1; si < 4; si++) {
                d += ' ' + pointsToLinear(sidePoints[si]).replace(/^M[^ ]+/, '');
            }
            d += ' Z';
            frames.push(d);
        }
        return frames;
    }

    const frame = rectBoilFrames(framePad, framePad, viewBoxSize - framePad * 2, viewBoxSize - framePad * 2, {
        roughness: 0.5, segments: 6, seed: baseSeed, jagged: true,
    }, frameBoil);

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

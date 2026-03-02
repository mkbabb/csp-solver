/**
 * Re-export barrel: all hand-drawn path utilities.
 *
 * Original monolith decomposed into:
 *   - lib/prng.ts — seeded PRNG
 *   - lib/pathGeneration.ts — generic wobble path primitives
 *   - lib/gridPaths.ts — Sudoku grid-specific generation
 */

export { mulberry32 } from '@/lib/prng';

export {
    type WobbleOptions,
    catmullRomToBezier,
    pointsToLinear,
    wobbleLinePoints,
    perturbPoints,
    wobbleLine,
    wobbleRect,
} from '@/lib/pathGeneration';

export {
    type GridPaths,
    type BoilFrames,
    generateGridPaths,
    generateGridBoilFrames,
} from '@/lib/gridPaths';

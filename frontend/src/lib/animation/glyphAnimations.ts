/**
 * Glyph animation utilities using keyframes.js.
 * - Draw-in (stroke-dashoffset)
 * - Wiggle (subtle path morph between variants on hover)
 */

import { Animation } from '@mkbabb/keyframes.js';

const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Create a draw-in animation for a glyph path (stroke-dashoffset from length to 0).
 */
export function createGlyphDrawIn(
    pathEl: SVGPathElement,
    pathLength: number,
    options: {
        duration?: number;
        delay?: number;
    } = {},
): Animation<any> | null {
    if (reducedMotion) {
        pathEl.style.strokeDashoffset = '0';
        return null;
    }

    pathEl.style.strokeDasharray = String(pathLength);
    pathEl.style.strokeDashoffset = String(pathLength);

    const anim = new Animation<{ offset: number }>({
        duration: options.duration ?? 350,
        delay: options.delay ?? 0,
        fillMode: 'forwards',
        timingFunction: 'easeOutCubic',
        useWAAPI: false,
    });

    anim.addFrame(
        '0%',
        { offset: pathLength },
        (vars) => {
            pathEl.style.strokeDashoffset = String(vars.offset);
        },
    );
    anim.addFrame('100%', { offset: 0 });
    anim.parse();

    return anim;
}

/**
 * Create a subtle wiggle animation that morphs between glyph variant paths.
 * Uses a simple approach: interpolates path d attribute numeric values.
 */
export function createGlyphWiggle(
    pathEl: SVGPathElement,
    variantPaths: string[],
    options: {
        duration?: number;
    } = {},
): Animation<any> | null {
    if (reducedMotion || variantPaths.length < 2) return null;

    const anim = new Animation<{ frame: number }>({
        duration: options.duration ?? 800,
        iterationCount: Infinity,
        direction: 'alternate',
        timingFunction: 'easeInOutCubic',
        useWAAPI: false,
    });

    // We cycle through variants by swapping the d attribute at discrete steps
    const frameCount = variantPaths.length;

    anim.addFrame(
        '0%',
        { frame: 0 },
        (vars) => {
            const idx = Math.round(vars.frame) % frameCount;
            pathEl.setAttribute('d', variantPaths[idx]);
        },
    );
    anim.addFrame('100%', { frame: frameCount - 1 });
    anim.parse();

    return anim;
}

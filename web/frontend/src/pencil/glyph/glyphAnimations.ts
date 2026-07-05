/**
 * Glyph animation utilities.
 * - Draw-in (stroke-dashoffset) — one-shot, keyframes.js `KeyframesAnimation`.
 * - Wiggle (subtle path morph between variants, perpetual while active) — the unified
 *   boil scheduler (W8), not keyframes.js. A solved board calls createGlyphWiggle()
 *   once per solver-introduced cell (up to boardSize²); each used to allocate its own
 *   keyframes.js `KeyframesAnimation` → its own independent `RAFPlayback` → its own rAF
 *   chain. Wiggle is fundamentally the same "advance a discrete frame index every N ms"
 *   shape as SvgFilters' preset ticking and the path-boil frame cycling, so it now rides
 *   the SAME single shared rAF chain via `createBoilTicker`, instead of keyframes.js's
 *   continuous-progress engine repurposed to snap a discrete index.
 */

import { KeyframesAnimation } from '@mkbabb/keyframes.js/engine';
import { createBoilTicker, usePrefersReducedMotion } from '@pencil/composables/boilScheduler';

// One PRM source for both draw-in (keyframes.js, one-shot) and wiggle (the unified
// scheduler, perpetual) — usePrefersReducedMotion() is the same live matchMedia ref the
// scheduler's central PRM gate reads, so wiggle's reduced-motion behavior is never a step
// behind draw-in's, and a mid-session PRM flip also centrally hard-stops active wiggle
// tickers (see boilScheduler.ts). Retires this file's prior useReducedMotion() import.
const reducedMotion = usePrefersReducedMotion();

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
): KeyframesAnimation<any> | null {
    if (reducedMotion.value) {
        pathEl.style.strokeDashoffset = '0';
        return null;
    }

    pathEl.style.strokeDasharray = String(pathLength);
    pathEl.style.strokeDashoffset = String(pathLength);

    const anim = new KeyframesAnimation<{ offset: number }>({
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
 * A `wiggleAnim`-shaped handle — the exact `.play()`/`.stop()` subset of keyframes.js's
 * `KeyframesAnimation` that `HandwrittenGlyph.vue` actually calls. Intentionally not a
 * keyframes.js animation at all (see module doc): it's a `createBoilTicker` subscriber on
 * the one shared rAF chain.
 */
export interface GlyphWiggleHandle {
    play(): void;
    stop(): void;
}

/**
 * Create a subtle wiggle animation that morphs between glyph variant paths.
 *
 * Was a keyframes.js `KeyframesAnimation` with a continuous `frame` progress value,
 * `Math.round()`-snapped to a discrete variant index on every rAF tick of ITS OWN
 * independent `RAFPlayback`. Now a `createBoilTicker` subscriber on the one shared rAF
 * chain: `duration`/`frameCount` become an equivalent per-step interval, and the ping-pong
 * (0..frameCount-1..0) semantics of the replaced `direction: 'alternate',
 * iterationCount: Infinity` config are preserved exactly by `createBoilTicker`.
 */
export function createGlyphWiggle(
    pathEl: SVGPathElement,
    variantPaths: string[],
    options: {
        duration?: number;
        delay?: number;
    } = {},
): GlyphWiggleHandle | null {
    if (reducedMotion.value || variantPaths.length < 2) return null;

    const frameCount = variantPaths.length;
    const duration = options.duration ?? 800;
    const delay = options.delay ?? 0;
    // One forward pass (0 → frameCount-1) takes `duration` ms, matching the replaced
    // config's per-cycle timing.
    const intervalMs = Math.max(1, Math.round(duration / Math.max(1, frameCount - 1)));

    let ticker: ReturnType<typeof createBoilTicker> | null = null;
    let delayTimer: ReturnType<typeof setTimeout> | null = null;

    function play() {
        delayTimer = setTimeout(() => {
            delayTimer = null;
            // Re-check: PRM may have engaged during the delay window.
            if (reducedMotion.value) return;
            ticker = createBoilTicker(frameCount, intervalMs, (frame) => {
                pathEl.setAttribute('d', variantPaths[frame]);
            });
            ticker.start();
        }, delay);
    }

    function stop() {
        if (delayTimer) {
            clearTimeout(delayTimer);
            delayTimer = null;
        }
        if (ticker) {
            ticker.stop();
            ticker = null;
        }
    }

    return { play, stop };
}

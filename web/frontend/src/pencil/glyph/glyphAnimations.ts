/**
 * Glyph animation utilities — every one rides the unified boil scheduler (W8), zero
 * keyframes.js `RAFPlayback` loops.
 *
 * - Draw-in (stroke-dashoffset, one-shot) — a `sequence` subscriber. Was a keyframes.js
 *   `KeyframesAnimation`, i.e. one independent native rAF loop per drawing cell (up to
 *   boardSize² during a reveal). Now one shared chain (W8 4th workstream).
 * - Flourish (finite variant-morph, the celebration's beat-2 wave + beat-3 murmur cycle) —
 *   a `sequence` subscriber that traverses variants for a fixed cycle count, then settles on
 *   the base variant. Finite by construction, so the subscriber floor returns to ambient.
 * - Hover wiggle (perpetual while hovered) — the `createBoilTicker` frame primitive, as
 *   before. Non-solved cells only; solved cells celebrate/murmur instead.
 */

import {
  createBoilTicker,
  createSequenceSubscription,
  usePrefersReducedMotion,
} from '@mkbabb/pencil-boil';
import { easeOutCubic, linear } from '@pencil/composables/easings';

// One PRM source for draw-in, flourish and wiggle — usePrefersReducedMotion() is the same
// live matchMedia ref the scheduler's central PRM gate reads, so reduced-motion behavior is
// never a step behind, and a mid-session PRM flip centrally hard-stops any in-flight tween.
const reducedMotion = usePrefersReducedMotion();

/** The `.play()`/`.stop()` subset every glyph animation exposes to HandwrittenGlyph.vue. */
export interface GlyphAnimHandle {
  play(): void;
  stop(): void;
}

/**
 * Draw-in for a glyph path (stroke-dashoffset from length → 0), one-shot on the shared chain.
 *
 * On completion it clears the dash pattern outright (`strokeDasharray: 'none'`). This is the
 * W8 fix for the still-live dasharray-reset defect: glyphPaths.ts lengths are *approximate*,
 * so leaving `strokeDasharray = length` at rest (keyframes.js's `fillMode: 'forwards'` end
 * state) left a permanent dash-gap on drawn glyphs — visible the instant a glyph freezes at
 * the end of the celebration (beat 3). Clearing the array makes the settled stroke solid
 * regardless of length accuracy.
 */
export function createGlyphDrawIn(
  pathEl: SVGPathElement,
  pathLength: number,
  options: {
    duration?: number;
    delay?: number;
    onComplete?: () => void;
  } = {},
): GlyphAnimHandle | null {
  if (reducedMotion.value) {
    pathEl.style.strokeDasharray = 'none';
    pathEl.style.strokeDashoffset = '0';
    options.onComplete?.();
    return null;
  }

  pathEl.style.strokeDasharray = String(pathLength);
  pathEl.style.strokeDashoffset = String(pathLength);

  const seq = createSequenceSubscription({
    durationMs: options.duration ?? 350,
    delayMs: options.delay ?? 0,
    easing: easeOutCubic,
    onProgress: (eased) => {
      pathEl.style.strokeDashoffset = String(pathLength * (1 - eased));
    },
    onComplete: () => {
      pathEl.style.strokeDasharray = 'none';
      pathEl.style.strokeDashoffset = '0';
      options.onComplete?.();
    },
  });

  return { play: () => seq.start(), stop: () => seq.stop() };
}

/**
 * Finite variant-morph flourish — the celebration's beat-2 wave and beat-3 murmur cycle.
 *
 * Traverses `variantPaths` as a ping-pong (0 → n−1 → 0) `cycles` times over
 * `cycles × cycleDurationMs`, then settles the element back on `baseD` (a clean freeze — no
 * frozen mid-morph, no dash-gap). One-shot: it self-removes from the scheduler on completion,
 * so N cells doing the wave crest on one chain and the floor recovers after.
 */
export function createGlyphFlourish(
  pathEl: SVGPathElement,
  variantPaths: string[],
  baseD: string,
  options: {
    cycles?: number;
    cycleDurationMs?: number;
    delayMs?: number;
    onDone?: () => void;
  } = {},
): GlyphAnimHandle | null {
  if (reducedMotion.value || variantPaths.length < 2) return null;

  const cycles = options.cycles ?? 2;
  const cycleDurationMs = options.cycleDurationMs ?? 600;
  const n = variantPaths.length;

  const seq = createSequenceSubscription({
    durationMs: cycles * cycleDurationMs,
    delayMs: options.delayMs ?? 0,
    easing: linear,
    onProgress: (_eased, raw) => {
      const phase = (raw * cycles) % 1; // 0→1 within the current cycle
      const tri = phase < 0.5 ? phase * 2 : (1 - phase) * 2; // ping-pong 0→1→0
      const idx = Math.min(n - 1, Math.round(tri * (n - 1)));
      pathEl.setAttribute('d', variantPaths[idx]);
    },
    onComplete: () => {
      pathEl.setAttribute('d', baseD);
      options.onDone?.();
    },
  });

  return { play: () => seq.start(), stop: () => seq.stop() };
}

/**
 * Hover wiggle — perpetual variant morph while active, on the shared chain via
 * `createBoilTicker` (frame kind). Ping-pongs 0..n−1..0, matching the original
 * `direction: 'alternate', iterationCount: Infinity` config.
 */
export function createGlyphWiggle(
  pathEl: SVGPathElement,
  variantPaths: string[],
  options: {
    duration?: number;
    delay?: number;
  } = {},
): GlyphAnimHandle | null {
  if (reducedMotion.value || variantPaths.length < 2) return null;

  const frameCount = variantPaths.length;
  const duration = options.duration ?? 800;
  const delay = options.delay ?? 0;
  const intervalMs = Math.max(1, Math.round(duration / Math.max(1, frameCount - 1)));

  let ticker: ReturnType<typeof createBoilTicker> | null = null;
  let delayTimer: ReturnType<typeof setTimeout> | null = null;

  function play() {
    delayTimer = setTimeout(() => {
      delayTimer = null;
      if (reducedMotion.value) return; // PRM may have engaged during the delay window
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

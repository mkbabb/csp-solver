/**
 * Glyph animation utilities — every one rides the unified boil scheduler (W8), zero
 * keyframes.js `RAFPlayback` loops.
 *
 * The draw-in left this file at T5-W2 2.8: it was a verbatim shadow of pencil-boil's own
 * `createStrokeDrawIn` — same dash setup, same `createSequenceSubscription`, same
 * `easeOutCubic`, same 350 ms default, same settle-to-`none` on completion (the approximate
 * `pathLength` defect both were written against). `HandwrittenGlyph.vue` calls the library's
 * directly, passing the measured glyph length the lib's doc says to pass.
 *
 * - Flourish (finite variant-morph, the celebration's beat-2 wave + beat-3 murmur cycle) —
 *   a `sequence` subscriber that traverses variants for a fixed cycle count, then settles on
 *   the base variant. Finite by construction, so the subscriber floor returns to ambient.
 * - Hover wiggle (perpetual while hovered) — the `createBoilTicker` frame primitive, as
 *   before. Non-solved cells only; solved cells celebrate/murmur instead.
 */

import {
  createBoilTicker,
  createSequenceSubscription,
  linear,
  usePrefersReducedMotion,
} from "@mkbabb/pencil-boil";

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

  // Write-dedup (T3-W12 §2, the P1 discipline applied to sequences): the tween's
  // progress ticks every frame, but the variant INDEX only changes a handful of times
  // per cycle — re-writing an identical `d` still counts as an attribute mutation and
  // re-rasters the glyph's grain filter every frame for the whole window (the settled
  // solved page's murmur was a ~30 paints/s tax at the gate). Write only on a real
  // swap; the motion is byte-identical.
  let lastIdx = -1;
  const seq = createSequenceSubscription({
    durationMs: cycles * cycleDurationMs,
    delayMs: options.delayMs ?? 0,
    easing: linear,
    onProgress: (_eased, raw) => {
      const phase = (raw * cycles) % 1; // 0→1 within the current cycle
      const tri = phase < 0.5 ? phase * 2 : (1 - phase) * 2; // ping-pong 0→1→0
      const idx = Math.min(n - 1, Math.round(tri * (n - 1)));
      if (idx === lastIdx) return;
      lastIdx = idx;
      pathEl.setAttribute("d", variantPaths[idx]);
    },
    onComplete: () => {
      pathEl.setAttribute("d", baseD);
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
        pathEl.setAttribute("d", variantPaths[frame]);
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

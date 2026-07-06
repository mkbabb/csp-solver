/**
 * DEV-ONLY rAF-chain instrumentation.
 *
 * Measures "how many independent rAF chains are alive right now" without knowing
 * anything about who scheduled them (keyframes.js's per-`KeyframesAnimation`
 * `RAFPlayback`, pencil-boil's `useLineBoil` singleton, the unified boil
 * scheduler). It is the library-agnostic cross-check behind W8's chains=1 gate:
 * `@mkbabb/pencil-boil`'s `schedulerDebugInfo()` — re-exposed here as
 * `window.__schedulerDebug` (the library ships the function but registers no
 * window global) — self-reports the scheduler's own chain + subscriber floor,
 * while this counts every native chain regardless of origin.
 *
 * Method: wrap the native `requestAnimationFrame`/`cancelAnimationFrame` and track
 * the set of currently-outstanding (requested-but-not-yet-fired) handles. A
 * perpetual self-rescheduling loop always has exactly one outstanding request in
 * flight at any instant, so sampling the set's size at a quiet moment (no one-shot
 * rAFs mid-flight — i.e. after grid/glyph draw-in has settled) equals the number
 * of independent perpetual rAF loops alive.
 *
 * Gated behind `import.meta.env.DEV` at its main.ts import site (same discipline
 * as FilterTuner) — this module is dead-code-eliminated from production builds,
 * 0 bytes in prod chunks. Its own sampling loop uses the saved *native* rAF, so it
 * never counts itself.
 */

import { schedulerDebugInfo } from '@mkbabb/pencil-boil';

declare global {
  interface Window {
    __rafChainCount?: () => number;
    __rafChainSample?: () => number[];
    __schedulerDebug?: typeof schedulerDebugInfo;
  }
}

if (typeof window !== 'undefined' && !window.__rafChainCount) {
  const pending = new Set<number>();
  const nativeRAF = window.requestAnimationFrame.bind(window);
  const nativeCAF = window.cancelAnimationFrame.bind(window);

  window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    // Reserve the slot synchronously, then swap in the real id once known — avoids
    // a race where the callback fires before `id` is assigned.
    const placeholder = -Math.random();
    pending.add(placeholder);
    const id = nativeRAF((t) => {
      pending.delete(id);
      pending.delete(placeholder);
      cb(t);
    });
    pending.delete(placeholder);
    pending.add(id);
    return id;
  }) as typeof window.requestAnimationFrame;

  window.cancelAnimationFrame = ((id: number) => {
    pending.delete(id);
    nativeCAF(id);
  }) as typeof window.cancelAnimationFrame;

  window.__rafChainCount = () => pending.size;

  // Re-expose the library scheduler's self-report (chain + subscriber floor + kinds).
  // The old app-local scheduler registered this window global itself; the library ships
  // `schedulerDebugInfo` as a plain export but no global, so the dev probe wires it here.
  window.__schedulerDebug = schedulerDebugInfo;

  // Rolling sample buffer — lets a probe capture the max over a window (e.g. across
  // a solve's staggered draw-in) instead of a single instant that might race a
  // one-shot rAF. Uses nativeRAF so it never adds itself to `pending`.
  const samples: number[] = [];
  window.__rafChainSample = () => samples.slice();
  function recordLoop() {
    samples.push(pending.size);
    if (samples.length > 600) samples.shift(); // ~10s at 60fps
    nativeRAF(recordLoop);
  }
  nativeRAF(recordLoop);
}

export {};

/**
 * Unified frame-index scheduler — one rAF chain, app-wide.
 *
 * ┌─ T11 TRIPWIRE ────────────────────────────────────────────────────────────┐
 * │ DELETE THIS FILE at the `@mkbabb/pencil-boil ^0.6.0` swap (W12 greps for   │
 * │ this marker). Upstream pencil-boil 0.6.0 ships the M2 reactive-PRM fix     │
 * │ plus `useBoilFrame` / `useFilterParamBoil` / `usePrefersReducedMotion` on  │
 * │ its own singleton scheduler; when it lands, every consumer re-points its   │
 * │ import at `@mkbabb/pencil-boil` and this local module is removed wholesale. │
 * │ It exists only because the vendored 0.4.1 pin has no reactive PRM and no    │
 * │ subscribe-able chain outside `useLineBoil`'s frame-index shape.             │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * Every boil consumer in the app funnels into the SAME module-level
 * `subscribers` Set and the SAME single `requestAnimationFrame` chain:
 *
 * - path-boil frame cycling — `useBoilFrame` (drop-in for `@mkbabb/pencil-boil`'s
 *   `useLineBoil`): HandDrawnGrid, HandDrawnOutline (×2), BoilDivider (×2),
 *   DarkModeToggle (×3).
 * - SVG filter `baseFrequency` ticking — `useFilterParamBoil` (replaces
 *   SvgFilters.vue's 3 raw `setInterval`s).
 * - post-solve glyph wiggle — `createBoilTicker` (replaces one keyframes.js
 *   `KeyframesAnimation`/`RAFPlayback` per solved cell — up to boardSize²).
 *
 * However many things want to "advance a discrete frame index every N ms," there
 * is exactly one rAF callback doing the advancing.
 *
 * Two gates apply uniformly to every subscriber, whichever call shape enrolled it:
 *
 * 1. `prefers-reduced-motion` — reactive (`prmRef`) AND centrally enforced. The
 *    `matchMedia` 'change' listener doesn't merely flip a ref for each consumer's
 *    own watchEffect to notice (that shape has a residual bug: a watchEffect that
 *    re-runs `start()` post-flip can miss the teardown branch). The instant PRM
 *    engages, the listener force-clears every subscriber and cancels the rAF
 *    directly — so correctness doesn't depend on N independently-written
 *    watchEffects, and it reaches the `createBoilTicker` glyph-wiggle handles,
 *    which aren't Vue-reactive at all (created imperatively, well after any
 *    component's synchronous setup, so they have no watchEffect to hook into).
 * 2. Tab visibility — cancels the rAF on `hidden` (0 ticks), resets every active
 *    subscriber's `lastTick` on `visible` (avoids an elapsed-time jump
 *    fast-forwarding every frame index at once), then resumes the one chain.
 */

import { onUnmounted, ref, toValue, watchEffect, type MaybeRefOrGetter, type Ref } from 'vue';

// ── generic subscriber shape — advance(steps), not a specific frame ref ──

interface Subscriber {
  advance: (steps: number) => void;
  getInterval: () => number;
  lastTick: number;
  active: boolean;
}

const subscribers = new Set<Subscriber>();
let rafId: number | null = null;
let schedulerRunning = false;

// ── single-chain invariant ──
// `startChain`/`stopChain` are the ONLY places a rAF handle is created or cancelled
// outside `schedulerTick`'s own tail, and `startChain` is idempotent on `rafId`. Every
// path (enrol, visibility resume, PRM) funnels through them, so there is provably at most
// one outstanding `schedulerTick` at any instant — a resume that races the browser's frame
// commit can never spawn a second, untracked loop.

function startChain() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(schedulerTick);
}

function stopChain() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function schedulerTick(timestamp: number) {
  for (const sub of subscribers) {
    if (!sub.active) continue;
    const interval = sub.getInterval();
    if (sub.lastTick === 0) sub.lastTick = timestamp;
    const elapsed = timestamp - sub.lastTick;
    if (elapsed >= interval) {
      const steps = Math.floor(elapsed / interval);
      sub.lastTick += steps * interval;
      sub.advance(steps);
    }
  }
  // Continue the one chain only while running — a tick that fires after a cancel (PRM
  // engage / tab hidden raced the browser's frame commit) must not resurrect it.
  rafId = schedulerRunning ? requestAnimationFrame(schedulerTick) : null;
}

function ensureScheduler() {
  schedulerRunning = true;
  startChain();
}

function maybeStopScheduler() {
  if (!schedulerRunning) return;
  for (const sub of subscribers) {
    if (sub.active) return;
  }
  schedulerRunning = false;
  stopChain();
}

// ── tab visibility — module-level, shared by every subscriber (0 ticks when hidden) ──

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopChain(); // 0 ticks; schedulerRunning is left intact for resume
    } else if (schedulerRunning) {
      for (const sub of subscribers) sub.lastTick = 0;
      startChain(); // idempotent — resume can never double the chain
    }
  });
}

// ── prefers-reduced-motion — reactive AND centrally enforced ──

const prmQuery =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

const prmRef = ref(prmQuery?.matches ?? false);

prmQuery?.addEventListener('change', (e) => {
  prmRef.value = e.matches;
  if (e.matches) {
    // Hard-stop every subscriber the instant PRM engages — independent of whether
    // it's a reactive (watchEffect-backed) or imperative handle.
    for (const sub of subscribers) sub.active = false;
    subscribers.clear();
    schedulerRunning = false;
    stopChain();
  }
  // Flipping back to false does NOT auto-resume the imperative (glyph-wiggle)
  // handles; the reactive `useBoilFrame`/`useFilterParamBoil` consumers re-enroll
  // via their own watchEffect gate. Mirrors the visibility discipline (resume is
  // per-consumer, never implicit for imperatively-created tickers).
});

export function usePrefersReducedMotion(): Readonly<Ref<boolean>> {
  return prmRef;
}

// ── low-level subscription handle ──

export interface BoilHandle {
  start: () => void;
  stop: () => void;
}

function createSubscription(
  advance: (steps: number) => void,
  getInterval: () => number,
): { sub: Subscriber; handle: BoilHandle } {
  const sub: Subscriber = { advance, getInterval, lastTick: 0, active: false };
  function start() {
    if (prmRef.value || sub.active) return;
    sub.active = true;
    sub.lastTick = 0;
    subscribers.add(sub);
    ensureScheduler();
  }
  function stop() {
    sub.active = false;
    subscribers.delete(sub);
    maybeStopScheduler();
  }
  return { sub, handle: { start, stop } };
}

// ── useFilterParamBoil — generic per-tick side effect (SvgFilters' 3 setIntervals) ──

export function useFilterParamBoil(
  onTick: (steps: number) => void,
  intervalMs: MaybeRefOrGetter<number>,
): BoilHandle {
  const { handle } = createSubscription(onTick, () => Math.max(1, toValue(intervalMs)));
  const stopWatch = watchEffect(() => {
    if (prmRef.value) handle.stop();
    else handle.start();
  });
  onUnmounted(() => {
    stopWatch();
    handle.stop();
  });
  return handle;
}

// ── useBoilFrame — drop-in replacement for pencil-boil's useLineBoil ──

export function useBoilFrame(
  frameCount: MaybeRefOrGetter<number>,
  intervalMs: MaybeRefOrGetter<number> = 125,
) {
  const currentFrame = ref(0);
  const { handle } = createSubscription(
    (steps) => {
      const total = Math.max(1, Math.floor(toValue(frameCount)));
      if (currentFrame.value >= total) currentFrame.value = 0;
      currentFrame.value = (currentFrame.value + steps) % total;
    },
    () => Math.max(1, toValue(intervalMs)),
  );
  const stopWatch = watchEffect(() => {
    if (prmRef.value || Math.floor(toValue(frameCount)) <= 1) handle.stop();
    else handle.start();
  });
  onUnmounted(() => {
    stopWatch();
    handle.stop();
  });
  return { currentFrame, start: handle.start, stop: handle.stop };
}

// ── createBoilTicker — imperative ping-pong frame ticker for glyph wiggle ──
//
// Created outside any component's synchronous setup() (glyph wiggle starts on a
// timer, well after mount), so it can't use onUnmounted()/watchEffect for its own
// lifecycle — callers own start()/stop() explicitly, exactly as they already do
// for the keyframes.js handle it replaces. Ping-pongs 0..frameCount-1..0 (matches
// the replaced `direction: 'alternate'` config) rather than wrapping, preserving
// the original's back-and-forth wiggle character.

export function createBoilTicker(
  frameCount: number,
  intervalMs: number,
  onFrame: (frame: number) => void,
): BoilHandle {
  let idx = 0;
  let dir = 1;
  const { handle } = createSubscription(
    (steps) => {
      if (frameCount <= 1) return;
      for (let i = 0; i < steps; i++) {
        idx += dir;
        if (idx >= frameCount - 1) {
          idx = frameCount - 1;
          dir = -1;
        } else if (idx <= 0) {
          idx = 0;
          dir = 1;
        }
      }
      onFrame(idx);
    },
    () => intervalMs,
  );
  return handle;
}

// ── dev-only instrumentation hook (0 bytes in prod — see rafInstrumentation.ts) ──
//
// Reports the live chain/subscriber floor to the W8 verification probe.
// `chains` reads `rafId`, not `schedulerRunning`, so a hidden tab / PRM-engaged
// state truthfully reads 0 (no rAF outstanding) even while subscribers are retained.

export function schedulerDebugInfo() {
  return { chains: rafId !== null ? 1 : 0, subscribers: subscribers.size };
}

declare global {
  interface Window {
    __boilSchedulerDebug?: () => { chains: number; subscribers: number };
  }
}
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__boilSchedulerDebug = schedulerDebugInfo;
}

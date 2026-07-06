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
import type { Easing } from './easings';
import { linear } from './easings';

// ── subscriber kinds (one chain, two dispatch shapes) ──
//
// `frame` — advance a discrete frame index every N ms (path-boil, filter-param ticking,
//   glyph wiggle). Perpetual until stopped; anchored to a `lastTick` wall-clock.
// `sequence` — ease a continuous 0→1 progress over a fixed wall-clock duration, then
//   self-unsubscribe (glyph/grid draw-in, the celebration flourish, the gold-star garnish
//   draw-on). This is the celebration timeline's kind (design-refinement.md §1.3 handoff).
//
// Both ride the SAME module-level `subscribers` Set and the SAME single rAF chain — however
// many draw-ins and flourishes crest at once, there is exactly one outstanding rAF.

interface FrameSubscriber {
  kind: 'frame';
  advance: (steps: number) => void;
  getInterval: () => number;
  lastTick: number;
  active: boolean;
}

interface SequenceSubscriber {
  kind: 'sequence';
  /** performance-clock ms of the tween's t=0 (may sit in the future to express a delay). */
  startTime: number;
  durationMs: number;
  easing: Easing;
  onProgress: (eased: number, raw: number) => void;
  onComplete: () => void;
  active: boolean;
}

type Subscriber = FrameSubscriber | SequenceSubscriber;

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
  // Sequence subscribers self-remove on completion; collect them and fire onComplete AFTER
  // the iteration so a chained flourish/murmur enrolled in a callback can't re-enter this
  // same loop (it ticks on the next frame instead).
  let completed: SequenceSubscriber[] | null = null;
  for (const sub of subscribers) {
    if (!sub.active) continue;
    if (sub.kind === 'frame') {
      const interval = sub.getInterval();
      if (sub.lastTick === 0) sub.lastTick = timestamp;
      const elapsed = timestamp - sub.lastTick;
      if (elapsed >= interval) {
        const steps = Math.floor(elapsed / interval);
        sub.lastTick += steps * interval;
        sub.advance(steps);
      }
    } else {
      const raw = (timestamp - sub.startTime) / sub.durationMs;
      if (raw < 0) continue; // still inside the delay window — nothing drawn yet
      if (raw >= 1) {
        sub.onProgress(1, 1);
        sub.active = false;
        (completed ??= []).push(sub);
      } else {
        sub.onProgress(sub.easing(raw), raw);
      }
    }
  }
  if (completed) {
    for (const sub of completed) {
      subscribers.delete(sub);
      sub.onComplete();
    }
  }
  // A finished sequence may have been the last active subscriber — shut the chain down so a
  // solved-and-settled board returns to the ambient floor rather than spinning empty.
  maybeStopScheduler();
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
      // Frame subscribers reset their wall-clock anchor so an elapsed-time jump can't
      // fast-forward every frame index at once. Sequence subscribers are one-shots with no
      // `lastTick`: on resume their `startTime` is stale by the hidden interval, so a tween
      // that would have finished while hidden simply completes on the first resumed tick —
      // the correct end state for a draw-in/flourish, no snap-back.
      for (const sub of subscribers) if (sub.kind === 'frame') sub.lastTick = 0;
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
): { sub: FrameSubscriber; handle: BoilHandle } {
  const sub: FrameSubscriber = { kind: 'frame', advance, getInterval, lastTick: 0, active: false };
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

// ── createSequenceSubscription — one-shot eased 0→1 tween on the shared chain ──
//
// The celebration's subscriber kind (design-refinement.md §1.3): a wall-clock tween that
// drives a continuous progress (stroke-dashoffset draw-in, a finite wiggle traversal, a
// specular sweep), then removes itself. Unlike the frame primitives it is NOT reactive and
// owns no watchEffect — callers create it imperatively (after mount, on a solve event) and
// hold start()/stop(), exactly as the keyframes.js one-shot it replaces did. A completed
// tween self-unsubscribes inside the tick, so N concurrent draw-ins/flourishes still crest
// on exactly one rAF chain and the subscriber count falls back to the ambient floor after.

export interface SequenceHandle {
  start: () => void;
  stop: () => void;
}

export function createSequenceSubscription(opts: {
  durationMs: number;
  /** onset delay in ms — the tween stays idle (nothing drawn) until it elapses. */
  delayMs?: number;
  easing?: Easing;
  onProgress: (eased: number, raw: number) => void;
  onComplete?: () => void;
}): SequenceHandle {
  const sub: SequenceSubscriber = {
    kind: 'sequence',
    startTime: 0,
    durationMs: Math.max(1, opts.durationMs),
    easing: opts.easing ?? linear,
    onProgress: opts.onProgress,
    onComplete: opts.onComplete ?? (() => {}),
    active: false,
  };
  function start() {
    if (prmRef.value || sub.active) return;
    sub.active = true;
    // rAF timestamps share performance.now()'s time origin, so the tick can compare against
    // a start captured here (±one frame of skew, immaterial to a 350ms draw-in).
    sub.startTime = performance.now() + (opts.delayMs ?? 0);
    subscribers.add(sub);
    ensureScheduler();
  }
  function stop() {
    sub.active = false;
    subscribers.delete(sub);
    maybeStopScheduler();
  }
  return { start, stop };
}

// ── dev-only instrumentation hook (0 bytes in prod — see rafInstrumentation.ts) ──
//
// Reports the live chain/subscriber floor to the W8 verification probe.
// `chains` reads `rafId`, not `schedulerRunning`, so a hidden tab / PRM-engaged
// state truthfully reads 0 (no rAF outstanding) even while subscribers are retained.

export function schedulerDebugInfo() {
  let frame = 0;
  let sequence = 0;
  for (const sub of subscribers) {
    if (sub.kind === 'frame') frame++;
    else sequence++;
  }
  return {
    chains: rafId !== null ? 1 : 0,
    subscribers: subscribers.size,
    kinds: { frame, sequence },
  };
}

declare global {
  interface Window {
    __boilSchedulerDebug?: () => {
      chains: number;
      subscribers: number;
      kinds: { frame: number; sequence: number };
    };
  }
}
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__boilSchedulerDebug = schedulerDebugInfo;
}

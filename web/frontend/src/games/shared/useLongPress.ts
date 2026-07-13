import { getCurrentScope, onScopeDispose } from "vue";
import { vibrateOnce } from "./honestHaptics";

/**
 * useLongPress — the peek gesture state machine (T4-WM §3, lane E).
 *
 * A press-and-hold recognizer built on Pointer Events alone: `pointerdown` starts a timer, and a
 * hold that survives `delayMs` without moving past the slop or releasing IS the long-press. This
 * is the one cross-engine shape — `contextmenu` never fires on iOS (13+), so the desktop
 * long-press path is dead (r3 §4a), and Pointer Events unify iOS and Android on a single path.
 *
 * The recut wires it under a board cell so a long-press opens that cell's candidate glimpse (the
 * engine-domains pencil marks), mirroring the shipped hold-to-peek grammar; release/cancel/leave
 * dismisses it. The honest haptic (`vibrateOnce`) rides the recognition — a buzz on Android, a
 * silent no-op on iOS (r3 §3). Capture-free by design: the consumer binds `onPointerCancel` to
 * `pointerleave` too, so a finger that drifts off the cell ends the hold with no `setPointerCapture`
 * fighting the native tap-to-focus the pad abrogation restored.
 *
 * The machine is framework-light — pure timer/geometry over the four handlers, unit-tested with
 * fake timers — and self-disposes through `onScopeDispose` when used inside a component so a live
 * peek can never outlive its cell.
 */
interface LongPressOptions {
  /** ms the pointer must be held, still, before the press is recognized. Default 450 (r3 §4). */
  delayMs?: number;
  /** px of movement (from the pointerdown origin) that cancels a PENDING press — a scroll/drag,
   *  not a hold. Once recognized, movement never dismisses the live hold; only release does. */
  slopPx?: number;
  /** Fired once when a hold survives to `delayMs`. */
  onLongPress: () => void;
  /** Fired once on release/cancel, but ONLY when a long-press had been recognized — so a short
   *  tap (no peek) never emits a spurious dismiss. */
  onRelease?: () => void;
  /** The recognition haptic; defaults to the honest feature-detected tick. Injectable so the unit
   *  layer can prove the wiring without a real Vibration API. */
  haptic?: () => void;
}

export function useLongPress(options: LongPressOptions) {
  const delayMs = options.delayMs ?? 450;
  const slopPx = options.slopPx ?? 10;
  const haptic = options.haptic ?? vibrateOnce;

  let timer: ReturnType<typeof setTimeout> | null = null;
  let held = false; // a long-press has been recognized and not yet released
  let startX = 0;
  let startY = 0;

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function onPointerDown(e: PointerEvent) {
    // A fresh gesture supersedes any stale one (a missed up/cancel) — end it cleanly first.
    clearTimer();
    if (held) {
      held = false;
      options.onRelease?.();
    }
    startX = e.clientX;
    startY = e.clientY;
    timer = setTimeout(() => {
      timer = null;
      held = true;
      haptic(); // honest: buzzes where the Vibration API exists, silent no-op on iOS
      options.onLongPress();
    }, delayMs);
  }

  function onPointerMove(e: PointerEvent) {
    // Only a PENDING press is slop-sensitive (timer live, not yet fired). A recognized hold
    // ignores the fingertip settling/drifting — release is its only exit.
    if (timer === null) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (dx * dx + dy * dy > slopPx * slopPx) clearTimer();
  }

  function end() {
    clearTimer();
    if (held) {
      held = false;
      options.onRelease?.();
    }
  }

  // pointerup = the natural release; pointercancel = the browser stealing the gesture (a scroll
  // takeover) or, when the consumer routes pointerleave here, the finger drifting off the cell.
  // Both ignore the event (the exit is the same however the pointer leaves) but accept it so the
  // signature matches the DOM binding.
  function onPointerUp(_e?: PointerEvent) {
    end();
  }
  function onPointerCancel(_e?: PointerEvent) {
    end();
  }

  // Tear down on unmount so a peek held across a component teardown (game switch, HMR) releases.
  if (getCurrentScope()) onScopeDispose(end);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, dispose: end };
}

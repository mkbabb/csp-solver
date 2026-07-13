import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useLongPress } from "./useLongPress";

// FE-unit layer (T4-WM §3, lane E — the peek gesture state machine). The gate is explicit: the
// timer, the slop, and the cancel paths are proven here under fake timers, deterministically,
// with the recognition haptic injected as a spy so the buzz-on-fire wiring is asserted without a
// real Vibration API (honestHaptics.test.ts owns the feature-detection proof). `contextmenu` is
// never involved — it doesn't fire on iOS; this is Pointer Events only. Born-RED at HEAD: the
// composable is new.

/** A minimal PointerEvent stand-in — the machine reads only clientX/clientY. */
function ev(x = 0, y = 0): PointerEvent {
  return { clientX: x, clientY: y, pointerId: 1 } as unknown as PointerEvent;
}

describe("useLongPress — the peek gesture state machine (T4-WM §3)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("recognizes the hold at delayMs and buzzes on that edge (feature-detected haptic)", () => {
    const onLongPress = vi.fn();
    const haptic = vi.fn();
    const lp = useLongPress({ onLongPress, haptic, delayMs: 450 });
    lp.onPointerDown(ev(10, 10));
    vi.advanceTimersByTime(449);
    expect(onLongPress).not.toHaveBeenCalled(); // the hold must survive the FULL timer
    expect(haptic).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onLongPress).toHaveBeenCalledTimes(1);
    expect(haptic).toHaveBeenCalledTimes(1); // the honest tick rides the recognition
  });

  it("a release before delayMs is a tap — no peek, no buzz, no dismiss", () => {
    const onLongPress = vi.fn();
    const onRelease = vi.fn();
    const haptic = vi.fn();
    const lp = useLongPress({ onLongPress, onRelease, haptic, delayMs: 450 });
    lp.onPointerDown(ev());
    vi.advanceTimersByTime(200);
    lp.onPointerUp(ev());
    vi.advanceTimersByTime(1000); // the timer must be dead — no late fire
    expect(onLongPress).not.toHaveBeenCalled();
    expect(onRelease).not.toHaveBeenCalled();
    expect(haptic).not.toHaveBeenCalled();
  });

  it("movement past the slop cancels a pending press (a scroll, not a hold)", () => {
    const onLongPress = vi.fn();
    const lp = useLongPress({ onLongPress, slopPx: 10, delayMs: 450 });
    lp.onPointerDown(ev(0, 0));
    lp.onPointerMove(ev(0, 20)); // 20px > 10px slop
    vi.advanceTimersByTime(500);
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it("movement within the slop does NOT cancel — a fingertip settling still peeks", () => {
    const onLongPress = vi.fn();
    const lp = useLongPress({ onLongPress, slopPx: 10, delayMs: 450 });
    lp.onPointerDown(ev(0, 0));
    lp.onPointerMove(ev(5, 5)); // dist ~7.07 < 10
    vi.advanceTimersByTime(450);
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it("movement after recognition never dismisses the live hold — only release does", () => {
    const onLongPress = vi.fn();
    const onRelease = vi.fn();
    const lp = useLongPress({ onLongPress, onRelease, slopPx: 10, delayMs: 450 });
    lp.onPointerDown(ev(0, 0));
    vi.advanceTimersByTime(450);
    expect(onLongPress).toHaveBeenCalledTimes(1);
    lp.onPointerMove(ev(0, 60)); // finger drifts far while held — the peek stays up
    expect(onRelease).not.toHaveBeenCalled();
    lp.onPointerUp(ev(0, 60));
    expect(onRelease).toHaveBeenCalledTimes(1);
  });

  it("onRelease fires exactly once when a recognized hold is released", () => {
    const onRelease = vi.fn();
    const lp = useLongPress({ onLongPress: () => {}, onRelease, delayMs: 450 });
    lp.onPointerDown(ev());
    vi.advanceTimersByTime(450);
    lp.onPointerUp(ev());
    lp.onPointerUp(ev()); // a duplicate up must not re-emit
    expect(onRelease).toHaveBeenCalledTimes(1);
  });

  it("pointercancel ends a live hold (the browser stealing the gesture, or a drift-off leave)", () => {
    const onRelease = vi.fn();
    const lp = useLongPress({ onLongPress: () => {}, onRelease, delayMs: 450 });
    lp.onPointerDown(ev());
    vi.advanceTimersByTime(450);
    lp.onPointerCancel(ev());
    expect(onRelease).toHaveBeenCalledTimes(1);
  });

  it("a pointercancel before recognition just drops the pending press (no dismiss)", () => {
    const onRelease = vi.fn();
    const lp = useLongPress({ onLongPress: () => {}, onRelease, delayMs: 450 });
    lp.onPointerDown(ev());
    vi.advanceTimersByTime(200);
    lp.onPointerCancel(ev());
    vi.advanceTimersByTime(1000);
    expect(onRelease).not.toHaveBeenCalled();
  });

  it("dispose ends a live hold so a peek can't outlive its component", () => {
    const onRelease = vi.fn();
    const lp = useLongPress({ onLongPress: () => {}, onRelease, delayMs: 450 });
    lp.onPointerDown(ev());
    vi.advanceTimersByTime(450);
    lp.dispose();
    expect(onRelease).toHaveBeenCalledTimes(1);
  });

  it("a new pointerdown supersedes a stale live hold (a missed up), releasing it once", () => {
    const onLongPress = vi.fn();
    const onRelease = vi.fn();
    const lp = useLongPress({ onLongPress, onRelease, delayMs: 450 });
    lp.onPointerDown(ev());
    vi.advanceTimersByTime(450); // recognized
    lp.onPointerDown(ev()); // a fresh press arrives with the old one never released
    expect(onRelease).toHaveBeenCalledTimes(1); // the stale hold is ended cleanly
    vi.advanceTimersByTime(450);
    expect(onLongPress).toHaveBeenCalledTimes(2); // the new press recognizes on its own timer
  });
});

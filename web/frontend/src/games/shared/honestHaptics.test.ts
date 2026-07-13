import { describe, it, expect, vi, afterEach } from "vitest";
import { vibrateOnce } from "./honestHaptics";

// FE-unit layer (T4-WM §3, lane E — honest haptics). The gate wants the feature-detection PROVEN
// here: the vibrate fires with the given ms where the API exists (Android/Chromium) and is a
// silent, throw-free no-op where it doesn't (every iOS browser, 2026 — WebKit never shipped
// Vibration). jsdom carries no `navigator.vibrate`, so the absent case is the environment's own
// default (the iOS shape); the present case installs a spy. Born-RED at HEAD: the module is new.

const nav = navigator as unknown as { vibrate?: unknown };

describe("vibrateOnce — the honest haptic (T4-WM §3)", () => {
  afterEach(() => {
    delete nav.vibrate; // restore the iOS shape (jsdom's default: no vibrate)
  });

  it("fires navigator.vibrate with the given ms where the API exists (Android/Chromium)", () => {
    const spy = vi.fn();
    nav.vibrate = spy;
    vibrateOnce(10);
    expect(spy).toHaveBeenCalledWith(10);
  });

  it("defaults to a 10ms tick", () => {
    const spy = vi.fn();
    nav.vibrate = spy;
    vibrateOnce();
    expect(spy).toHaveBeenCalledWith(10);
  });

  it("is a silent, throw-free no-op where the Vibration API is absent (every iOS browser)", () => {
    // jsdom, like WebKit, exposes no navigator.vibrate — the honest iOS ship is that nothing runs.
    expect(nav.vibrate).toBeUndefined();
    expect(() => vibrateOnce(10)).not.toThrow();
  });
});

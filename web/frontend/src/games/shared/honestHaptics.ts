/**
 * Honest haptics — T4-WM §3 (lane E). The owner's edict asked for tap/touch-to-hold with
 * vibration "if a modern web API allows". The honest answer (r3 §3, crit-verified): on iOS
 * there is none. `navigator.vibrate` was never in WebKit and still isn't (2026), and because
 * every iOS browser IS WebKit, no iOS browser can buzz. The iOS `<input switch>` tick hack was
 * refused — Apple closed the scripted path at iOS 26.5, and a switch-semantic overlay is neither
 * KISS nor congruent. So this is the whole of it: fire `navigator.vibrate` where it exists
 * (Android/Chromium buzz), feature-detected so it's a silent no-op on iOS. No fallback, no trick.
 *
 * Re-trigger (the one thing that reopens this): a real WebKit haptics API shipping.
 */

/**
 * A single short tick on the long-press recognition. The optional call IS the feature detect:
 * where the Vibration API is absent (every iOS browser) `vibrate` is undefined and nothing runs;
 * where it exists the device buzzes `ms` milliseconds. Never throws. `navigator` is optional-
 * guarded for SSR/non-DOM callers; the local cast gives `vibrate` its true optional shape (the
 * DOM lib types it non-optional, which the iOS reality contradicts).
 */
export function vibrateOnce(ms = 10): void {
  if (typeof navigator === "undefined") return;
  const nav = navigator as { vibrate?: (pattern: number | number[]) => boolean };
  nav.vibrate?.(ms);
}

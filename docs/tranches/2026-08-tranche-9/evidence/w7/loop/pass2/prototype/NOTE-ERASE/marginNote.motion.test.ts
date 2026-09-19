import { describe, it, expect } from "vitest";
import { MOTION } from "@pencil/config/pencilConfig";
// The component's own BYTES (vite's `?raw`), not the compiled component: the assertion below is
// about what the stylesheet says. `node:fs` is not available here — `src/**` is typechecked by
// the browser tsconfig, which carries no node types (the trap check-ink-pressure's head names).
import MARGIN_NOTE_SRC from "./MarginNote.vue?raw";

/**
 * T9-W7 §7 — THE NOTE'S CLOCKS AND ITS RUNGS, asserted where they are decided.
 *
 * Two claims the live surface cannot make for itself:
 *   G-hold  the refusal's hold is long enough to READ the refusal — derived from the house's
 *           own constants, not picked. It reds if either end re-times.
 *   R6 law 4  no duration literal inside the component. The ladder's admitted form is
 *           `var(--motion-<rung>, <rung>ms)` with the fallback byte-equal to the rung (a
 *           missed publish must be a no-op), so the assertion is "no UNADMITTED literal" and
 *           "every fallback agrees with its rung" — a bare `250ms` reds the first, a drifted
 *           fallback reds the second.
 */

const STYLE = MARGIN_NOTE_SRC.slice(MARGIN_NOTE_SRC.indexOf("<style"));

describe("the margin note's motion (T9-W7 §7)", () => {
  it("G-hold: the refusal stands long enough to be read", () => {
    const words = "that's a given clue".split(/\s+/).length;
    // write-in, then a settle's worth of notice, then the words at 180 wpm (333 ms/word).
    const need =
      MOTION.rungs.note + MOTION.note.settleAfterBeats * MOTION.beatMs + words * 333;
    const hold = MOTION.note.refusalHoldBeats * MOTION.beatMs;
    expect(need).toBe(2582);
    expect(hold).toBeGreaterThanOrEqual(need);
  });

  it("the ballot's slow end is the same derivation at 90 wpm", () => {
    const words = "that's a given clue".split(/\s+/).length;
    const slow =
      MOTION.rungs.note +
      2 * MOTION.note.settleAfterBeats * MOTION.beatMs +
      words * 667;
    // 4,918 ms → 40 beats on the 8-beat settle grid: the band's far end, derived not picked.
    expect(Math.ceil(slow / MOTION.beatMs / 8) * 8).toBe(40);
  });

  it("the note's verbs read rungs, and every fallback is byte-equal", () => {
    const fallbacks = [...STYLE.matchAll(/var\(--motion-([a-z]+),\s*(\d+)ms\)/g)].map(
      (m) => [m[1], Number(m[2])] as const,
    );
    expect(fallbacks.length).toBeGreaterThanOrEqual(3);
    for (const [rung, ms] of fallbacks) {
      expect(MOTION.rungs[rung as keyof typeof MOTION.rungs]).toBe(ms);
    }
    // the three verbs the family spends, each present by name
    for (const rung of ["note", "whisper", "dusk"]) {
      expect(fallbacks.some(([r]) => r === rung)).toBe(true);
    }
  });

  it("R6 law 4: no unadmitted duration literal in the component", () => {
    const bare = STYLE.replace(/var\(--motion-[a-z]+,\s*\d+ms\)/g, "").match(
      /\b\d+(\.\d+)?m?s\b/g,
    );
    expect(bare ?? []).toEqual([]);
  });

  it("the note's clocks are beats, and only clocks live there", () => {
    expect(Object.keys(MOTION.note).sort()).toEqual([
      "refusalHoldBeats",
      "settleAfterBeats",
    ]);
  });
});

import { describe, it, expect } from "vitest";
import { computeKeyboardInset, computeScrollDelta } from "./useKeyboardViewport";

// T4-WM §1 keyboard-avoidance (lane C) — the geometry the composable rides is pure and lives
// here, deterministically, so the "focused cell is never eclipsed" contract is proven without a
// real software keyboard (which no headless engine raises). The composable wires DOM
// focusin/visualViewport events to these two functions; the e2e (mobile-platform.spec.ts) proves
// that wiring end-to-end against a real engine with an emulated visualViewport. Born-RED at HEAD:
// neither function existed (zero visualViewport references — the pad's inputmode=none masked the
// whole problem).

describe("computeKeyboardInset — the occlusion the keyboard steals from the layout viewport", () => {
  it("is 0 when the visual viewport fills the layout viewport (no keyboard)", () => {
    expect(computeKeyboardInset(844, 844, 0)).toBe(0);
  });

  it("equals the height the keyboard covers when the visual viewport shrinks", () => {
    // 844 layout, keyboard eats 300 → visual viewport 544.
    expect(computeKeyboardInset(844, 544, 0)).toBe(300);
  });

  it("folds a pinch-zoom offsetTop into the occluded band", () => {
    expect(computeKeyboardInset(844, 544, 50)).toBe(250);
  });

  it("never goes negative (a taller visual viewport than layout clamps to 0)", () => {
    expect(computeKeyboardInset(500, 800, 0)).toBe(0);
  });
});

describe("computeScrollDelta — the minimal scroll that keeps the focused cell above the keyboard", () => {
  // A phone-ish band: 360px visible above the keyboard, anchored at the top.
  const band = { top: 0, height: 360 };

  it("does not fight the layout for a cell already comfortably in the band", () => {
    expect(computeScrollDelta({ top: 120, height: 40 }, band)).toBe(0);
  });

  it("lifts a cell that sits below the keyboard fold clear of the band edge", () => {
    const cell = { top: 400, height: 40 }; // bottom 440, well under a 360 band
    const delta = computeScrollDelta(cell, band);
    expect(delta).toBeGreaterThan(0); // scroll the page DOWN → the cell rides up
    // After scrolling by delta, the cell's bottom clears the band bottom (never eclipsed).
    expect(cell.top + cell.height - delta).toBeLessThanOrEqual(band.height);
  });

  it("drops a cell overhead (above the band) back into view", () => {
    const offsetBand = { top: 100, height: 360 };
    const cell = { top: -30, height: 40 };
    const delta = computeScrollDelta(cell, offsetBand);
    expect(delta).toBeLessThan(0); // scroll the page UP → the cell drops down into view
    expect(cell.top - delta).toBeGreaterThanOrEqual(offsetBand.top);
  });

  it("honours the visual-viewport offsetTop as the band's top edge", () => {
    // Band pushed down (offsetTop 100); a cell inside it needs no scroll.
    expect(
      computeScrollDelta({ top: 160, height: 40 }, { top: 100, height: 200 }),
    ).toBe(0);
  });

  it("seats the top of a cell taller than the comfortable band (can't fit whole)", () => {
    const tinyBand = { top: 0, height: 80 }; // gap*2 = 48 leaves only 32 comfortable px
    const cell = { top: 200, height: 120 }; // taller than the comfortable band
    const delta = computeScrollDelta(cell, tinyBand);
    // Its top lands one gap (24) below the band top.
    expect(cell.top - delta).toBe(24);
  });
});

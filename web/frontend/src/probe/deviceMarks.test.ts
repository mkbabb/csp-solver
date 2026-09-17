/**
 * T9-W8 §8.3 — the device instrument's DECISIONS, asserted without a browser.
 *
 * The probe's DOM half cannot be unit-tested (it needs a real engine, a real bake and a real
 * thumb), and that is exactly why every rule it decides a number by was lifted out into
 * `deviceMarks.ts`. These rows are the settle rule, the blocking PROXY, the frame census, the
 * occlusion tell and the row shape the fold reads.
 */
import { describe, expect, it } from "vitest";
import {
  BLOCKING_FLOOR_MS,
  LONG_FRAME_MS,
  SETTLE_MIN_ELAPSED_MS,
  SETTLE_QUIET_MS,
  deviceCell,
  distinctWidths,
  gapProxyMs,
  isOcclusionGap,
  rafCensus,
  round1,
  settleAtMs,
  toReadingRow,
} from "./deviceMarks";

describe("the settle rule (A5's)", () => {
  it("falls to the 1,100 ms floor when the tap caused no work at all", () => {
    // N2..N4 bake nothing. They still have to settle by the same rule as N1.
    expect(settleAtMs(1000, [])).toBe(1000 + SETTLE_MIN_ELAPSED_MS);
  });

  it("ignores work that happened before the tap", () => {
    expect(settleAtMs(1000, [10, 200, 999])).toBe(1000 + SETTLE_MIN_ELAPSED_MS);
  });

  it("waits for 400 ms of quiet after the last piece of work", () => {
    // Work at 2,500 is 1,500 ms past the tap, so the floor is already spent.
    expect(settleAtMs(1000, [1200, 2500])).toBe(2500 + SETTLE_QUIET_MS);
  });

  it("takes the LAST of the two clauses, never the first one to fire", () => {
    // Work lands early: the floor is later than work + quiet, so the floor wins.
    expect(settleAtMs(1000, [1050])).toBe(1000 + SETTLE_MIN_ELAPSED_MS);
  });
});

describe("the blocking proxy", () => {
  const gaps = [
    { at: 100, ms: 40 },
    { at: 500, ms: 120 },
    { at: 900, ms: 200 },
    { at: 3200, ms: 500 },
  ];

  it("subtracts 50 ms from each gap, exactly as TBT does from each task", () => {
    // (120-50) + (200-50) = 220. The 40 ms gap is under the floor and the 3,200 ms gap is
    // outside the window.
    expect(gapProxyMs(gaps, 0, 3000)).toBe(220);
    expect(BLOCKING_FLOOR_MS).toBe(50);
  });

  it("is zero, not negative, when nothing in the window is long enough", () => {
    expect(gapProxyMs(gaps, 0, 200)).toBe(0);
  });

  it("windows on a half-open interval so two adjacent windows cannot double count", () => {
    expect(gapProxyMs(gaps, 500, 900) + gapProxyMs(gaps, 900, 1000)).toBe(220);
  });
});

describe("the frame census", () => {
  it("counts a dropped frame at 33.4 ms and a blocking frame at 50", () => {
    const gaps = [
      { at: 10, ms: 33.4 },
      { at: 20, ms: 33.5 },
      { at: 30, ms: 51 },
      { at: 40, ms: 700.25 },
    ];
    const c = rafCensus(gaps, 0, 1000);
    expect(LONG_FRAME_MS).toBe(33.4);
    expect(c.long33).toBe(3); // 33.4 is not OVER 33.4
    expect(c.long50).toBe(2);
    expect(c.worstMs).toBe(700.3);
  });

  it("reads zeros over an empty window rather than refusing", () => {
    expect(rafCensus([], 0, 1000)).toEqual({ long33: 0, long50: 0, worstMs: 0 });
  });
});

describe("the occlusion tell", () => {
  it("taints on a lone 1,000 to 1,300 ms delta, which is a suspended rAF", () => {
    expect(isOcclusionGap(999)).toBe(false);
    expect(isOcclusionGap(1000)).toBe(true);
    expect(isOcclusionGap(1300)).toBe(true);
    expect(isOcclusionGap(1301)).toBe(false);
  });
});

describe("board travel", () => {
  it("reads one width as no travel and many widths as a glide", () => {
    expect(distinctWidths([304, 304, 304.4, 304])).toBe(1);
    expect(distinctWidths([640, 520, 410, 304])).toBe(4);
    expect(distinctWidths([])).toBe(0);
  });
});

describe("the row shape the fold reads", () => {
  it("prints NOT MEASURED for a mark the engine cannot see, never 0", () => {
    const row = toReadingRow({ firstPaintMs: null, fcpMs: 836.25 });
    expect(row.firstPaintMs).toBe("NOT MEASURED");
    expect(row.fcpMs).toBe(836.3);
  });

  it("drops an absent key rather than inventing one", () => {
    const row = toReadingRow({ lcpMs: undefined, fcpMs: 1 });
    expect("lcpMs" in row).toBe(false);
    expect(row.fcpMs).toBe(1);
  });

  it("carries booleans and taint arrays through untouched", () => {
    const row = toReadingRow({ tainted: true, taint: ["blur at 10 ms"] });
    expect(row.tainted).toBe(true);
    expect(row.taint).toEqual(["blur at 10 ms"]);
  });

  it("survives JSON.parse as one line, which is what the fold reads", () => {
    const row = toReadingRow({ cell: deviceCell("cold"), boardReadyMs: 1212.9 });
    const line = JSON.stringify(row);
    expect(line.includes("\n")).toBe(false);
    expect(JSON.parse(line)).toEqual({ cell: "device-cold", boardReadyMs: 1212.9 });
  });

  it("names the cell by the load the owner declared, and never by a throttle rate", () => {
    expect(deviceCell("undeclared")).toBe("device-undeclared");
    expect(deviceCell("warm")).toBe("device-warm");
  });
});

describe("rounding", () => {
  it("keeps one decimal, which is the grain every banked row is written at", () => {
    expect(round1(1212.9000000953674)).toBe(1212.9);
    expect(round1(0.04)).toBe(0);
  });
});

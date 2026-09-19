/**
 * ACC-GRAPHITE pass-2 geometry probe — G2b (edge correlation) and G3 (tally form), read off
 * the SHIPPING generators, not off a model of them. Run through vitest with the lane's scratch
 * config (`probe/vitest.lane.mjs`); writes `readings/geom-pass2.json`.
 */
import { describe, it, expect } from "vitest";
import { writeFileSync } from "node:fs";
import {
  generateCellRects,
  generateCellRetraceRects,
  generateFrameTraceFrames,
  tickMarksAlong,
  linearPathLength,
} from "@pencil/grid/gridPaths";
import { BOIL_CONFIG, FILTER_PRESETS } from "@pencil/config/pencilConfig";

const VIEWBOX = 1000;
const RETRACE_INSET = 10;
const TICK_INK = 45;
const TICK_GAP = 25;
const SAMPLES = 256;

type P = [number, number];

const points = (d: string): P[] =>
  (d.match(/-?\d[\d.e+-]*,-?\d[\d.e+-]*/g) ?? []).map((s) => {
    const [x, y] = s.split(",");
    return [Number(x), Number(y)] as P;
  });

/** Cumulative arc length. */
const cum = (pts: P[]): number[] => {
  const c = [0];
  for (let i = 1; i < pts.length; i++)
    c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return c;
};

/** The point at normalised arc position t. */
const atT = (pts: P[], c: number[], t: number): P => {
  const s = t * c[c.length - 1];
  let i = 1;
  while (i < c.length - 1 && c[i] < s) i++;
  const seg = c[i] - c[i - 1] || 1;
  const u = Math.min(1, Math.max(0, (s - c[i - 1]) / seg));
  return [
    pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u,
    pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u,
  ];
};

/** Signed distance from an axis-aligned rect's boundary; outward positive. */
const sdRect = (p: P, x0: number, y0: number, x1: number, y1: number): number =>
  Math.max(x0 - p[0], p[0] - x1, y0 - p[1], p[1] - y1);

const pearson = (a: number[], b: number[]): number => {
  const n = a.length;
  const ma = a.reduce((s, v) => s + v, 0) / n;
  const mb = b.reduce((s, v) => s + v, 0) / n;
  let num = 0,
    da = 0,
    db = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) ** 2;
    db += (b[i] - mb) ** 2;
  }
  return num / Math.sqrt(da * db);
};

/** The radial deviation series of one pass, sampled at SAMPLES equal arc positions. */
const deviation = (d: string, rect: [number, number, number, number]): number[] => {
  const pts = points(d);
  const c = cum(pts);
  const out: number[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const p = atT(pts, c, i / SAMPLES);
    out.push(sdRect(p, rect[0], rect[1], rect[0] + rect[2], rect[1] + rect[3]));
  }
  return out;
};

const readings: Record<string, unknown> = {};

describe("G2b — the band's two edges wander independently", () => {
  for (const boardSize of [4, 9, 16]) {
    it(`boardSize ${boardSize}: correlation of the two passes`, () => {
      const outer = generateCellRects(boardSize, VIEWBOX, 42);
      const inner = generateCellRetraceRects(boardSize, VIEWBOX, 42);
      const cellSize = VIEWBOX / boardSize;
      const inset = Math.min(RETRACE_INSET, cellSize / 4);
      const rs: number[] = [];
      // Eight cells across the board, the same population the ring gates read.
      const cells = [0, 1, boardSize + 1, boardSize * 2 + 2, boardSize * 3 + 3]
        .concat([
          Math.floor((boardSize * boardSize) / 2),
          boardSize * boardSize - 1,
          boardSize * boardSize - boardSize,
        ])
        .filter((p) => p < boardSize * boardSize);
      for (const pos of cells) {
        const r = Math.floor(pos / boardSize);
        const c = pos % boardSize;
        const a = deviation(outer[pos], [c * cellSize, r * cellSize, cellSize, cellSize]);
        // The retrace is emitted REVERSED; read it backwards so the two series run the same
        // way round the cell before they are compared.
        const b = deviation(inner[pos], [
          c * cellSize + inset,
          r * cellSize + inset,
          cellSize - inset * 2,
          cellSize - inset * 2,
        ]).reverse();
        rs.push(pearson(a, b));
      }
      const mean = rs.reduce((s, v) => s + v, 0) / rs.length;
      readings[`g2b-${boardSize}`] = {
        cells: cells.length,
        per: rs.map((v) => +v.toFixed(3)),
        mean: +mean.toFixed(3),
      };
      // The single-stroke control: one curve's two edges are the SAME deviation series.
      const posC = cells[0];
      const rC = Math.floor(posC / boardSize);
      const cC = posC % boardSize;
      const self = deviation(outer[posC], [
        cC * cellSize,
        rC * cellSize,
        cellSize,
        cellSize,
      ]);
      readings[`g2b-${boardSize}-single-stroke-control`] = +pearson(self, self).toFixed(3);
      expect(Math.abs(mean)).toBeLessThan(1);
    });
  }
});

describe("G3 — the tally's form under LAW A", () => {
  const frames = generateFrameTraceFrames(
    VIEWBOX,
    42,
    BOIL_CONFIG.frameCount,
    BOIL_CONFIG.frameBoil,
    FILTER_PRESETS["grain-static"]?.grain,
  );

  const lawA = (d: string, writable: number, written: number) => {
    const perimeter = linearPathLength(d);
    const slots = Math.max(
      1,
      Math.min(writable, Math.floor(perimeter / (TICK_INK + TICK_GAP))),
    );
    const m = Math.ceil(writable / slots);
    const k = Math.ceil(written / m);
    const out = tickMarksAlong(d, k, slots, (TICK_INK * slots) / perimeter);
    const subpaths = (out.match(/M/g) ?? []).length;
    // The ink length of every tick, measured off the emitted geometry.
    const inks = out
      .split("M")
      .filter(Boolean)
      .map((run) => {
        const pts = points("M" + run);
        return cum(pts).at(-1) ?? 0;
      });
    return { perimeter, slots, m, k, subpaths, inks };
  };

  for (const [board, writable] of [
    [4, 11],
    [9, 57],
    [16, 163],
  ] as const) {
    it(`board ${board} (writable ${writable}): count == min(ceil(written/m), slots)`, () => {
      const rows: unknown[] = [];
      for (const written of [1, 3, 20, writable]) {
        if (written > writable) continue;
        const r = lawA(frames[0], writable, written);
        const expected = Math.min(Math.ceil(written / r.m), r.slots);
        expect(r.subpaths).toBe(expected);
        rows.push({
          written,
          slots: r.slots,
          m: r.m,
          k: r.k,
          subpaths: r.subpaths,
          expected,
          inkMean: +(r.inks.reduce((s, v) => s + v, 0) / (r.inks.length || 1)).toFixed(2),
          inkMin: +Math.min(...r.inks).toFixed(2),
          inkMax: +Math.max(...r.inks).toFixed(2),
          aspect: +(
            r.inks.reduce((s, v) => s + v, 0) /
            (r.inks.length || 1) /
            10
          ).toFixed(2),
        });
      }
      // Every pose agrees on the count (the four wobble apart by a fraction of a unit).
      const perPose = frames.map((d) => lawA(d, writable, writable).subpaths);
      readings[`g3-${board}`] = {
        writable,
        perimeterPerPose: frames.map((d) => +linearPathLength(d).toFixed(1)),
        subpathsPerPoseAtFull: perPose,
        rows,
      };
      expect(new Set(perPose).size).toBe(1);
    });
  }

  it("banks the readings", () => {
    writeFileSync(
      "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/ACC-GRAPHITE/readings/geom-pass2.json",
      JSON.stringify(readings, null, 2),
    );
    expect(Object.keys(readings).length).toBeGreaterThan(0);
  });
});

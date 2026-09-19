/**
 * ACC-GRAPHITE pass-3 RESEARCH — the SECTION's segment census and LAW A's real boundary,
 * read off the MAIN tree's shipped generators at HEAD `74a2b5d9`. Read-only on the product.
 *
 * Why segments and not subpaths: pass 2's G0 varied SUBPATH count and found the painted share
 * multiplies identically in both engines; ACC-FIVE's ~128-SEGMENT discriminator and ACC-SIX's
 * ~490-segment WebKit repeat are a different axis. The chair seats the section's G0 on segment
 * count, so the section first needs to know what the estate's own dashed paths actually carry.
 *
 * Writes `../readings/segments-head.json`.
 */
import { describe, it, expect } from "vitest";
import { writeFileSync, mkdirSync } from "node:fs";
import {
  generateCellRects,
  generateFrameTraceFrames,
  generateLineBoilFrames,
} from "@pencil/grid/gridPaths";
import { BOIL_CONFIG, FILTER_PRESETS } from "@pencil/config/pencilConfig";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/ACC-GRAPHITE/readings";
const VIEWBOX = 1000;

type P = [number, number];

/** Every drawing command in a `d`, with its subpath index. */
const parse = (d: string) => {
  const toks = d.match(/[MLQCZmlqcz][^MLQCZmlqcz]*/g) ?? [];
  let subpaths = 0;
  let segments = 0;
  const pts: P[] = [];
  for (const t of toks) {
    const cmd = t[0];
    const nums = (t.slice(1).match(/-?\d[\d.eE+-]*/g) ?? []).map(Number);
    if (cmd === "M" || cmd === "m") {
      subpaths++;
      for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
      // an M with extra coordinate pairs is an implicit lineto run
      segments += Math.max(0, nums.length / 2 - 1);
    } else if (cmd === "L" || cmd === "l") {
      for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
      segments += nums.length / 2;
    } else if (cmd === "Q" || cmd === "q") {
      for (let i = 2; i + 1 < nums.length; i += 4) pts.push([nums[i], nums[i + 1]]);
      segments += nums.length / 4;
    } else if (cmd === "C" || cmd === "c") {
      for (let i = 4; i + 1 < nums.length; i += 6) pts.push([nums[i], nums[i + 1]]);
      segments += nums.length / 6;
    } else if (cmd === "Z" || cmd === "z") {
      segments += 1; // the closing segment is painted and dashed like any other
    }
  }
  return { subpaths, segments, pts, commands: toks.length };
};

/** Polyline arc length (exact for the estate's linear paths; a floor for any curve). */
const arcLength = (pts: P[]): number => {
  let s = 0;
  for (let i = 1; i < pts.length; i++)
    s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return s;
};

const grain = FILTER_PRESETS["grain-static"]?.grain;
const reading: Record<string, unknown> = {
  base: "74a2b5d9",
  tree: "MAIN (read-only)",
  boilConfig: { frameCount: BOIL_CONFIG.frameCount, frameBoil: BOIL_CONFIG.frameBoil },
};

describe("§2.6 — the estate's dashed paths, by SEGMENT count", () => {
  it("the frame-trace ring (fill gauge HandDrawnGrid.vue:476-478 AND join ring :509-511)", () => {
    const poses = generateFrameTraceFrames(VIEWBOX, 42, BOIL_CONFIG.frameCount, BOIL_CONFIG.frameBoil, grain);
    const rows = poses.map((d) => {
      const p = parse(d);
      return { segments: p.segments, subpaths: p.subpaths, commands: p.commands, length: +arcLength(p.pts).toFixed(2) };
    });
    reading.frameTraceRing = { seed: 42, poses: rows };
    // both dashed sites on the board ride this geometry
    expect(rows.length).toBe(BOIL_CONFIG.frameCount);
  });

  it("the join ring's own seed (91) — same generator, different hand", () => {
    const poses = generateFrameTraceFrames(VIEWBOX, 91, BOIL_CONFIG.frameCount, BOIL_CONFIG.frameBoil, grain);
    reading.joinRing = {
      seed: 91,
      poses: poses.map((d) => {
        const p = parse(d);
        return { segments: p.segments, subpaths: p.subpaths, length: +arcLength(p.pts).toFixed(2) };
      }),
    };
    expect(poses.length).toBeGreaterThan(0);
  });

  it("DifficultyTally's five strokes (DifficultyTally.vue:230-232, pathLength=100 + attr dash)", () => {
    // the component's own params: roughness 0.95, segments 4, jagged, TALLY_BOIL
    const strokes = [0, 1, 2, 3, 4].map((i) =>
      generateLineBoilFrames(10, 10 + i * 5, 90, 10 + i * 5, { roughness: 0.95, segments: 4, seed: 7 + i, jagged: true }, 0.8, BOIL_CONFIG.frameCount, grain),
    );
    reading.difficultyTally = strokes.map((fr, i) => {
      const p = parse(fr[0]);
      return { stroke: i, segments: p.segments, subpaths: p.subpaths, length: +arcLength(p.pts).toFixed(2) };
    });
    expect(strokes.length).toBe(5);
  });

  it("the cell ghost rect (gameCell.css tier 1-3 ring; NO dash at HEAD, CSS dash under the family's draw-on)", () => {
    const out: Record<string, unknown> = {};
    for (const n of [4, 9, 16]) {
      const rects = generateCellRects(n, Math.round(Math.sqrt(n)), VIEWBOX, 42, BOIL_CONFIG.cellBoil ?? 0.3);
      const first = Array.isArray(rects) ? rects[0] : (rects as Record<number, string>)[0];
      const d = typeof first === "string" ? first : (first as unknown as string[])?.[0];
      if (typeof d === "string") {
        const p = parse(d);
        out[`${n}x${n}`] = { segments: p.segments, subpaths: p.subpaths, length: +arcLength(p.pts).toFixed(2) };
      } else {
        out[`${n}x${n}`] = { shape: typeof first, note: "see generateCellRects signature" };
      }
    }
    reading.cellGhostRect = out;
    expect(Object.keys(out).length).toBe(3);
  });
});

describe("LAW A — the m boundary priced against the REAL dig bands", () => {
  it("perimeter, slots, m and ticks across every shipped difficulty", () => {
    const poses = generateFrameTraceFrames(VIEWBOX, 42, BOIL_CONFIG.frameCount, BOIL_CONFIG.frameBoil, grain);
    const perims = poses.map((d) => arcLength(parse(d).pts));
    const INK = 45,
      GAP = 25;
    const slotsCap = Math.floor(Math.min(...perims) / (INK + GAP));
    // csp-solver/src/puzzles/sudoku/generate.rs:67-72 — target_holes IS the writable aim
    const bands = { Easy: (L: number) => Math.floor(L / 4), Medium: (L: number) => Math.floor(L / 1.75), Hard: (L: number) => Math.floor(L / 1.25) };
    const table: Record<string, unknown>[] = [];
    for (const n of [4, 9, 16]) {
      const L = n * n;
      for (const [tier, f] of Object.entries(bands)) {
        const aim = f(L);
        const slots = Math.min(aim, slotsCap);
        const m = Math.ceil(aim / slots);
        table.push({ board: `${n}x${n}`, tier, writableAim: aim, slots, m, ticksAtFull: Math.ceil(aim / m) });
      }
    }
    // the boundary itself, walked one writable at a time on a 9x9
    const walk: Record<string, unknown>[] = [];
    for (let w = 50; w <= 64; w++) {
      const slots = Math.min(w, slotsCap);
      const m = Math.ceil(w / slots);
      walk.push({ writable: w, slots, m, ticksAtFull: Math.ceil(w / m) });
    }
    reading.lawA = {
      perimeterPerPose: perims.map((p) => +p.toFixed(2)),
      slotsCap,
      INK,
      GAP,
      digBandsSource: "csp-solver/src/puzzles/sudoku/generate.rs:67-72 (target_holes = the writable AIM; the leash makes actual <= aim)",
      table,
      boundaryWalk: walk,
    };
    expect(slotsCap).toBeGreaterThan(0);
  });
});

describe("bank", () => {
  it("writes the reading", () => {
    mkdirSync(OUT, { recursive: true });
    writeFileSync(OUT + "/segments-head.json", JSON.stringify(reading, null, 2));
    expect(true).toBe(true);
  });
});

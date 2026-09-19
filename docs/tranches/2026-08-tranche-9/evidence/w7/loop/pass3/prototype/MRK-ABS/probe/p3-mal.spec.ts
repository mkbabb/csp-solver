/**
 * T9-W7 pass 3 · MRK-ABS PROTOTYPE — G-ABS-6, MA-L FROM PAINTED BYTES.
 *
 * `r5-band.spec.ts` (research) reads the two paths' GEOMETRY and reports a gap. That answers
 * MA-R, which is struck as a gate. MA-L asks a different question and only painted bytes can
 * answer it: WHERE THE RING IS DRAWN, what is under it, and do the two read apart?
 *
 * Method. Screenshot the board UNFOCUSED at dpr 1, focus one cell (programmatic .focus() plus
 * one key press — the recipe that sets keyboard modality in BOTH engines; WebKit's Tab reaches
 * form controls only), screenshot again, and sample the SAME device pixels in both frames along
 * the ring's own path:
 *   - the FOCUSED byte at a sample is the ring's ink (composited at stroke-opacity 0.95);
 *   - the UNFOCUSED byte at the same sample is the GROUND the ring was drawn onto — paper, a
 *     cell line, a subgrid line, or the frame, whichever the geometry put there;
 *   - the WCAG ratio between them is what a reader has to see the mark by.
 * Samples are classified by their unfocused byte against the cell's own paper median, so the
 * "rule" subset is discovered from the surface rather than assumed from the model.
 *
 * Cells: 0 (its left side is the board FRAME, 12 units inside the edge by the grid's design)
 * and the first cell whose left rule is a SUBGRID line. Boards 9x9 and 16x16, light and dark,
 * both engines.
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MRK-ABS/logs";

const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const L = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a: number[], b: number[]) => {
  const la = L(a[0], a[1], a[2]),
    lb = L(b[0], b[1], b[2]);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
const dist = (a: number[], b: number[]) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const med = (v: number[]) => (v.length ? [...v].sort((x, y) => x - y)[v.length >> 1] : NaN);

async function setTheme(page: Page, want: "light" | "dark") {
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  if ((await isDark()) === (want === "dark")) return;
  await page.locator("button.sun-moon-toggle").click();
  await expect.poll(isDark, { timeout: 10000 }).toBe(want === "dark");
  await page.waitForTimeout(500);
}

/** the ring's path in VIEWPORT css px, plus its stroke width, for one cell */
const ringGeom = (page: Page, idx: number) =>
  page.evaluate((i) => {
    const cell = document.querySelectorAll(".board-shell .game-cell")[i] as HTMLElement;
    const p = cell.querySelector(".cell-ghost-path") as SVGPathElement;
    const m = p.getScreenCTM()!;
    const pts: number[][] = [];
    for (const g of p.getAttribute("d")!.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g))
      pts.push([m.e + m.a * parseFloat(g[2]), m.f + m.d * parseFloat(g[3])]);
    const r = cell.getBoundingClientRect();
    return {
      pts,
      strokePx: parseFloat(getComputedStyle(p).strokeWidth) * m.a,
      cell: { x: r.x, y: r.y, w: r.width, h: r.height },
    };
  }, idx);

async function grab(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const buf = await page.screenshot({ clip, scale: "css" });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return (x: number, y: number) => {
    const px = Math.round(x - clip.x),
      py = Math.round(y - clip.y);
    if (px < 0 || py < 0 || px >= info.width || py >= info.height) return null;
    const o = (py * info.width + px) * 4;
    return [data[o], data[o + 1], data[o + 2]];
  };
}

/** walk the LEFT side of the ring: the side that faces the frame at cell 0 */
function leftSideSamples(pts: number[][], cellX: number, n = 60) {
  // the four corners are at indices 0,4,8,12,16(=0): the left side is 12..16
  const side = pts.slice(12).concat([pts[0]]);
  const out: number[][] = [];
  for (let i = 0; i < n; i++) {
    const t = ((i + 0.5) / n) * (side.length - 1);
    const k = Math.min(side.length - 2, Math.floor(t)),
      f = t - k;
    out.push([
      side[k][0] + f * (side[k + 1][0] - side[k][0]),
      side[k][1] + f * (side[k + 1][1] - side[k][1]),
    ]);
  }
  void cellX;
  return out;
}

const rows: Record<string, unknown>[] = [];

for (const N of [9, 16]) {
  for (const theme of ["light", "dark"] as const) {
    test(`MA-L painted · ${N}x${N} · ${theme}`, async ({ page }, info) => {
      const engine = info.project.name;
      // `size` is the SUBGRID dimension, not the board: 2 = 4x4, 3 = 9x9, 4 = 16x16.
      await page.goto(`/?size=${Math.round(Math.sqrt(N))}`);
      await page.waitForSelector(".board-shell .game-cell", { timeout: 120000 });
      await expect
        .poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 })
        .toBe(N * N);
      await setTheme(page, theme);
      await page.waitForTimeout(900);

      const sub = N === 9 ? 3 : 4;
      const targets = [
        { idx: 0, kind: "frame" },
        { idx: sub, kind: "subgrid" }, // column `sub`: its left rule is a subgrid line
        { idx: 1, kind: "cell" },
      ];

      for (const t of targets) {
        const g0 = await ringGeom(page, t.idx);
        const clip = {
          x: Math.floor(g0.cell.x - 20),
          y: Math.floor(g0.cell.y - 20),
          width: Math.ceil(g0.cell.w + 40),
          height: Math.ceil(g0.cell.h + 40),
        };
        const before = await grab(page, clip);

        await page.evaluate((i) => {
          const inp = document.querySelectorAll<HTMLInputElement>(
            ".board-shell .game-cell .cell-native-input",
          )[i];
          inp?.focus();
        }, t.idx);
        await page.keyboard.press("Shift");
        await page.waitForTimeout(400);

        const g1 = await ringGeom(page, t.idx);
        const after = await grab(page, clip);

        const samples = leftSideSamples(g1.pts, g1.cell.x);

        // Per sample take the pixel that CHANGED MOST inside a 3x3 window on the path point:
        // the path point is a subpixel coordinate, and rounding it lands on a half-covered
        // antialiased pixel about as often as on the stroke's core. The band's reading is the
        // core; the AA skirt is a fact about rasterisation, not about the design.
        type S = { ink: number[]; ground: number[]; r: number };
        const took: S[] = [];
        for (const [x, y] of samples) {
          let best: S | null = null,
            bestD = 0;
          for (let dx = -1; dx <= 1; dx++)
            for (let dy = -1; dy <= 1; dy++) {
              const b = before(x + dx, y + dy),
                a = after(x + dx, y + dy);
              if (!b || !a) continue;
              const d = dist(a, b);
              if (d > bestD) {
                bestD = d;
                best = { ink: a, ground: b, r: ratio(a, b) };
              }
            }
          if (best && bestD >= 8) took.push(best);
        }

        // The ground is NAMED against the CELL'S OWN PAPER, read in the unfocused frame well
        // inside the ring, and compared in LUMINANCE (an L1 byte distance mis-sorts a cell
        // whose whole left stroke sits on one rule — the 16x16 frame crossing, which is the
        // row this gate exists for). A sample whose ground is the paper is "vsPaper"; anything
        // else is a RULE the ring is painted on.
        const paperPix: number[][] = [];
        for (let k = 0; k < 24; k++) {
          const p = before(g1.cell.x + g1.cell.w * 0.5, g1.cell.y + g1.cell.h * (0.25 + k * 0.02));
          if (p) paperPix.push(p);
        }
        const paperRGB = [0, 1, 2].map((c) => med(paperPix.map((p) => p[c])));
        const paperL = L(paperRGB[0], paperRGB[1], paperRGB[2]);
        const gl = took.map((s) => L(s.ground[0], s.ground[1], s.ground[2]));
        const onRule: S[] = [],
          onPaper: S[] = [];
        took.forEach((s, i) => (Math.abs(gl[i] - paperL) > 0.03 ? onRule : onPaper).push(s));
        const summarise = (v: S[]) => ({
          n: v.length,
          worst: v.length ? +Math.min(...v.map((s) => s.r)).toFixed(3) : null,
          median: v.length ? +med(v.map((s) => s.r)).toFixed(3) : null,
          groundMedian: v.length ? [0, 1, 2].map((c) => Math.round(med(v.map((s) => s.ground[c])))) : null,
        });

        const row = {
          engine,
          board: `${N}x${N}`,
          theme,
          cell: t.idx,
          facing: t.kind,
          strokePx: +g1.strokePx.toFixed(3),
          samples: samples.length,
          painted: took.length,
          ringInkMedian: [0, 1, 2].map((c) => Math.round(med(took.map((s) => s.ink[c])))),
          cellPaper: paperRGB,
          worstAnyGround: took.length ? +Math.min(...took.map((s) => s.r)).toFixed(3) : null,
          vsRule: summarise(onRule),
          vsPaper: summarise(onPaper),
        };
        rows.push(row);
        console.log(JSON.stringify(row));

        await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
        await page.waitForTimeout(250);
      }

      fs.mkdirSync(OUT, { recursive: true });
      fs.writeFileSync(`${OUT}/mal-${engine}.json`, JSON.stringify(rows, null, 2));
      expect(rows.length).toBeGreaterThan(0);
    });
  }
}

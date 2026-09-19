/**
 * PLR-PLACE · PROBE 2 — THE FRAME AT SMALL SCALE.
 *
 * The family's claim is that the mark is "a 24×24 miniature of the board's own frame (the same
 * `wobbleRect` seed at small scale)". That is a geometric claim and it is checkable without
 * mounting anything: pull the board's OWN frame path out of `gridPaths.generateGridBoilFrames`
 * (the module the app itself imports, through the dev server, so it is the same instance), and
 * ask what it measures when a 1000-unit viewBox is drawn into a 24×24 box.
 *
 * Three numbers decide it:
 *   · the painted stroke width       — the board draws its frame at `stroke-width="12"`
 *                                      (HandDrawnGrid.vue:339) in a 1000-unit viewBox
 *   · the wobble amplitude           — deviation of the wobbled path from the ideal rect
 *   · the cell pitch                 — 1000/boardSize, and what that is in CSS px at 24
 *
 * Read-only. No product file is touched; the module is imported, not modified.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
// The lane runs its specs from a scratchpad copy (node_modules resolution), so the
// evidence home is named rather than inferred. PLC_HOME = this file's parent dir.
const HOME = process.env.PLC_HOME || join(__dirname, "..");
const OUT = join(HOME, "logs");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

test("THE FRAME AT SMALL SCALE — the board's own path, measured at 24 and 96", async ({
  page,
}, info) => {
  await page.goto(SOLO);
  await settled(page);

  const rows = await page.evaluate(async () => {
    // The app's own module, through the dev server — the same instance the board renders from.
    const gp = (await import(
      /* @vite-ignore */ "/src/pencil/grid/gridPaths.ts"
    )) as {
      generateGridBoilFrames: (
        boardSize: number,
        subgridSize: number,
        viewBoxSize: number,
        baseSeed?: number,
        frameCount?: number,
        frameBoil?: number,
        subgridBoil?: number,
        cellBoil?: number,
      ) => { frame: string[]; subgridLines: string[][]; cellLines: string[][] };
      generateCellRects: (
        b: number,
        s: number,
        v: number,
        seed?: number,
      ) => Record<number, string>;
    };

    /** Every coordinate pair in an SVG path built of M/L commands (what wobble emits). */
    const pts = (d: string): Array<[number, number]> => {
      const out: Array<[number, number]> = [];
      const re = /[-+0-9.eE]+/g;
      const nums = (d.match(re) ?? []).map(Number);
      for (let i = 0; i + 1 < nums.length; i += 2) out.push([nums[i], nums[i + 1]]);
      return out;
    };

    const out: Record<string, unknown> = {};
    for (const [label, size, sub] of [
      ["9x9", 9, 3],
      ["16x16", 16, 4],
    ] as Array<[string, number, number]>) {
      // The board's own call shape — HandDrawnGrid.vue passes VIEWBOX_SIZE 1000 and the
      // pencilConfig boil amounts (frame 1.2 / subgrid 0.6 / cell 0.3).
      const bf = gp.generateGridBoilFrames(size, sub, 1000, 42, 4, 1.2, 0.6, 0.3);
      const p = pts(bf.frame[0]);
      // FRAME_X_PAD 12 / FRAME_Y_PAD 0 (gridPaths.ts:338-339) — the ideal rect the wobble
      // departs from.
      const x0 = 12,
        y0 = 0,
        x1 = 988,
        y1 = 1000;
      let maxDev = 0;
      let sum2 = 0;
      for (const [x, y] of p) {
        const dx = Math.min(Math.abs(x - x0), Math.abs(x - x1));
        const dy = Math.min(Math.abs(y - y0), Math.abs(y - y1));
        // a frame vertex is on one of the four sides; its deviation is the SMALLER of the
        // two distances-to-a-side (the other axis is a position along the side)
        const dev = Math.min(dx, dy);
        maxDev = Math.max(maxDev, dev);
        sum2 += dev * dev;
      }
      const rms = Math.sqrt(sum2 / p.length);
      out[label] = {
        vertices: p.length,
        pathChars: bf.frame[0].length,
        poses: bf.frame.length,
        subgridLines: bf.subgridLines.length,
        cellLines: bf.cellLines.length,
        cellPitch_units: +(1000 / size).toFixed(2),
        wobble_units: { max: +maxDev.toFixed(2), rms: +rms.toFixed(2) },
        at24: {
          scale: 24 / 1000,
          strokePx: +((12 * 24) / 1000).toFixed(3),
          subgridStrokePx: +((8 * 24) / 1000).toFixed(3),
          cellStrokePx: +((5 * 24) / 1000).toFixed(3),
          cellPitchPx: +((24 / size)).toFixed(3),
          wobbleMaxPx: +((maxDev * 24) / 1000).toFixed(3),
          wobbleRmsPx: +((rms * 24) / 1000).toFixed(3),
          unitsForOneCssPx: +(1000 / 24).toFixed(1),
        },
        at96: {
          strokePx: +((12 * 96) / 1000).toFixed(3),
          cellPitchPx: +((96 / size)).toFixed(3),
          wobbleMaxPx: +((maxDev * 96) / 1000).toFixed(3),
          wobbleRmsPx: +((rms * 96) / 1000).toFixed(3),
        },
      };
    }

    // The ghost rect — the other candidate for a "dot" (the peer cursor's own shape).
    const rects = gp.generateCellRects(9, 3, 1000, 42);
    out.cellRect = {
      count: Object.keys(rects).length,
      chars0: rects[0].length,
      totalChars: Object.values(rects).reduce((n, s) => n + s.length, 0),
    };

    // What the board actually paints its frame with, live on this page.
    const el = document.querySelector("path.frame-line") as SVGPathElement | null;
    const svg = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement | null;
    out.live = el
      ? {
          strokeWidth: el.getAttribute("stroke-width"),
          computedStroke: getComputedStyle(el).stroke,
          svgBox: svg ? svg.getAttribute("viewBox") : null,
          svgPx: svg ? +svg.getBoundingClientRect().width.toFixed(1) : null,
        }
      : { note: "no live frame-line (bitmap pose stack active)" };
    const bmp = document.querySelector("image.boil-frame-bitmap") as SVGImageElement | null;
    out.liveBaked = !!bmp;
    return out;
  });

  say("geometry", rows);
  mkdirSync(OUT, { recursive: true });
  writeFileSync(
    join(OUT, `geometry-${info.project.name}.json`),
    JSON.stringify({ engine: info.project.name, ...rows }, null, 1),
  );
});

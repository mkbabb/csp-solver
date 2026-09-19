/**
 * PLR-PLACE · PROBE 3 — THE PAINTED MARK.
 *
 * The miniature is mounted with `proto/mount-miniature.js` (the app's own `gridPaths` frame
 * path at pose 0 and the app's own `playerIdentity.inkFor` walk), screenshotted, and read back
 * byte by byte with `sharp`. The engine's painted pixels are the subject — not hex arithmetic,
 * and not the SVG source. Four grounds (`--color-background` and `--color-card`, light and
 * dark), both engines, at dpr 1 and dpr 2.
 *
 * What it answers:
 *   · is the board's own frame VISIBLE at 24px, and what is it visible AS
 *   · does a dot clear 3:1 (WCAG 1.4.11 non-text) at 24px at its drawn size
 *   · how many distinct cells a reader can actually resolve at each size
 *
 * A negative control rides every contrast row: the same dot drawn at the LOBBY size (96px),
 * where the same colour has pixels to be itself in. A colour that passes at 96 and fails at 24
 * has failed on SIZE, which is the family's stated risk and the thing a hex ratio cannot see.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
// The lane runs its specs from a scratchpad copy (node_modules resolution), so the
// evidence home is named rather than inferred. PLC_HOME = this file's parent dir.
const HOME = process.env.PLC_HOME || join(__dirname, "..");
const PROTO = join(HOME, "proto", "mount-miniature.js");
const OUT = join(HOME, "logs");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);

const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const L = (r: number, g: number, b: number) =>
  0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a: [number, number, number], b: [number, number, number]) => {
  const la = L(...a),
    lb = L(...b);
  return +((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(2);
};

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

/** Read a PNG buffer into a {w,h,px(x,y)} reader over raw RGB. */
async function raster(buf: Buffer) {
  const { data, info } = await sharp(buf)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = (x: number, y: number): [number, number, number] => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  return { w: info.width, h: info.height, px };
}

test.describe("THE PAINTED MARK", () => {
  for (const dpr of [1, 2]) {
    test(`dpr ${dpr} — the frame and the dots, read off the engine`, async ({
      browser,
    }, info) => {
      const ctx = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: dpr,
      });
      const page = await ctx.newPage();
      await page.goto(SOLO);
      await settled(page);
      await page.addScriptTag({ path: PROTO });

      const rows: Record<string, unknown>[] = [];

      for (const theme of ["light", "dark"] as const) {
        // The estate's theme is a CLASS on <html> (`index.css:4` — `@custom-variant dark
        // (&:is(.dark *))`, `.dark` at :362), not a data attribute. A first pass of this probe
        // wrote `data-theme` and measured the light ground twice.
        await page.evaluate((t) => {
          document.documentElement.classList.toggle("dark", t === "dark");
        }, theme);
        await page.waitForTimeout(400);

        for (const ground of ["--color-background", "--color-card"] as const) {
          // A clean rig: one ground, one mark, nothing else in the crop.
          await page.evaluate(
            ([g]) => {
              document.querySelector("#plc-rig")?.remove();
              const rig = document.createElement("div");
              rig.id = "plc-rig";
              rig.style.cssText = `position:fixed;right:0;bottom:0;z-index:9999;background:var(${g});padding:24px;display:flex;gap:24px;align-items:center;`;
              document.body.appendChild(rig);
            },
            [ground],
          );

          for (const size of [24, 96] as const) {
            for (const boardSize of [9, 16] as const) {
              const id = `${theme}/${ground}/${size}px/${boardSize}x${boardSize}`;
              await page.evaluate(
                async ([s, b]) => {
                  const rig = document.querySelector("#plc-rig") as HTMLElement;
                  rig.innerHTML = "";
                  // 3 peers at known cells: top-left area, middle, bottom-right area.
                  const n = b as number;
                  const peers = [
                    { index: 1, pos: 1 * n + 1 },
                    { index: 2, pos: Math.floor(n / 2) * n + Math.floor(n / 2) },
                    { index: 3, pos: (n - 2) * n + (n - 2) },
                  ];
                  await (
                    window as unknown as {
                      __PLC: { mount: (o: unknown) => Promise<HTMLElement> };
                    }
                  ).__PLC.mount({
                    size: s,
                    boardSize: b,
                    strokeUnits: 12,
                    dotUnits: (1000 / (b as number)) * 0.32,
                    peers,
                    host: rig,
                  });
                },
                [size, boardSize],
              );
              await page.waitForTimeout(120);

              const box = await page.locator("#plc-rig .plc-mark").boundingBox();
              const shot = await page.locator("#plc-rig .plc-mark").screenshot();
              const r = await raster(shot);

              // The ground, read from the rig's own padding (never assumed).
              const rigShot = await page.locator("#plc-rig").screenshot();
              const rr = await raster(rigShot);
              const groundPx = rr.px(4, 4);

              // The dots' cells, in the crop's own coordinates.
              const pitchPx = (size / boardSize) * dpr;
              const dots = await page.evaluate(() =>
                [...document.querySelectorAll("#plc-rig .plc-dot")].map((d) => ({
                  index: +(d.getAttribute("data-index") ?? 0),
                  pos: +(d.getAttribute("data-pos") ?? 0),
                  fill: getComputedStyle(d as Element).fill,
                })),
              );

              const dotRows = dots.map((d) => {
                const rr2 = Math.floor(d.pos / boardSize);
                const cc = d.pos % boardSize;
                const cx = (cc + 0.5) * pitchPx;
                const cy = (rr2 + 0.5) * pitchPx;
                // best and worst pixel inside the dot's nominal box
                let best = 0;
                let worst = 99;
                let bestPx: [number, number, number] = [0, 0, 0];
                const rad = Math.max(1, pitchPx * 0.32);
                for (let y = Math.floor(cy - rad); y <= Math.ceil(cy + rad); y++) {
                  for (let x = Math.floor(cx - rad); x <= Math.ceil(cx + rad); x++) {
                    if (x < 0 || y < 0 || x >= r.w || y >= r.h) continue;
                    if ((x - cx) ** 2 + (y - cy) ** 2 > rad * rad) continue;
                    const c = ratio(r.px(x, y), groundPx);
                    if (c > best) {
                      best = c;
                      bestPx = r.px(x, y);
                    }
                    if (c < worst) worst = c;
                  }
                }
                return {
                  index: d.index,
                  pos: d.pos,
                  declared: d.fill,
                  centrePx: r.px(
                    Math.min(r.w - 1, Math.round(cx)),
                    Math.min(r.h - 1, Math.round(cy)),
                  ),
                  centreRatio: ratio(
                    r.px(
                      Math.min(r.w - 1, Math.round(cx)),
                      Math.min(r.h - 1, Math.round(cy)),
                    ),
                    groundPx,
                  ),
                  bestPx,
                  bestRatio: +best.toFixed(2),
                  worstRatio: +worst.toFixed(2),
                };
              });

              // The FRAME: the strongest pixel anywhere on the frame's own left edge band.
              let frameBest = 0;
              let framePx: [number, number, number] = groundPx;
              const midY = Math.round(r.h / 2);
              for (let x = 0; x < Math.min(r.w, Math.ceil(4 * dpr)); x++) {
                const c = ratio(r.px(x, midY), groundPx);
                if (c > frameBest) {
                  frameBest = c;
                  framePx = r.px(x, midY);
                }
              }

              rows.push({
                id,
                dpr,
                theme,
                ground,
                size,
                boardSize,
                box: box ? { w: +box.width.toFixed(1), h: +box.height.toFixed(1) } : null,
                cropPx: { w: r.w, h: r.h },
                cellPitchDevicePx: +pitchPx.toFixed(2),
                groundPx,
                frame: { bestPx: framePx, bestRatio: +frameBest.toFixed(2) },
                dots: dotRows,
              });
            }
          }
        }
      }

      // ── THE SWEEP: what SIZE does a dot need, and what STROKE does the frame need ──────
      // The contrast rows above say the mark fails at 24px. This says by how much, in the
      // one unit a design can change: the dot's radius and the frame's stroke, both in
      // viewBox units, both read off the engine on the worst of the four grounds.
      await page.evaluate(() => {
        document.documentElement.classList.remove("dark");
        document.querySelector("#plc-rig")?.remove();
        const rig = document.createElement("div");
        rig.id = "plc-rig";
        rig.style.cssText =
          "position:fixed;right:0;bottom:0;z-index:9999;background:var(--color-background);padding:24px;";
        document.body.appendChild(rig);
      });
      const sweep: Record<string, unknown>[] = [];
      for (const size of [24, 96] as const) {
        for (const dotFrac of [0.2, 0.28, 0.32, 0.4, 0.5, 0.6, 0.75, 0.9]) {
          await page.evaluate(
            async ([s, f]) => {
              const rig = document.querySelector("#plc-rig") as HTMLElement;
              rig.innerHTML = "";
              await (
                window as unknown as {
                  __PLC: { mount: (o: unknown) => Promise<HTMLElement> };
                }
              ).__PLC.mount({
                size: s,
                boardSize: 9,
                strokeUnits: 12,
                dotUnits: (1000 / 9) * (f as number),
                peers: [{ index: 2, pos: 40 }],
                host: rig,
              });
            },
            [size, dotFrac],
          );
          await page.waitForTimeout(80);
          const shot = await page.locator("#plc-rig .plc-mark").screenshot();
          const r = await raster(shot);
          const rigShot = await page.locator("#plc-rig").screenshot();
          const rr = await raster(rigShot);
          const g = rr.px(4, 4);
          let best = 0;
          for (let y = 0; y < r.h; y++)
            for (let x = 0; x < r.w; x++) {
              // the centre cell only: row 4, col 4 of 9 — never the frame
              const pitch = (size / 9) * dpr;
              if (x < 4 * pitch || x > 5 * pitch || y < 4 * pitch || y > 5 * pitch) continue;
              const c = ratio(r.px(x, y), g);
              if (c > best) best = c;
            }
          sweep.push({
            size,
            dpr,
            dotFrac,
            dotRadiusCssPx: +(((1000 / 9) * dotFrac * size) / 1000).toFixed(3),
            dotDiaDevicePx: +((((1000 / 9) * dotFrac * 2 * size) / 1000) * dpr).toFixed(2),
            bestRatio: +best.toFixed(2),
            clears3: best >= 3,
            clears45: best >= 4.5,
          });
        }
      }
      for (const s of sweep) say("sweep.dot", s);

      const strokeSweep: Record<string, unknown>[] = [];
      for (const size of [24, 96] as const) {
        for (const strokeUnits of [12, 20, 28, 42, 60, 84]) {
          await page.evaluate(
            async ([s, w]) => {
              const rig = document.querySelector("#plc-rig") as HTMLElement;
              rig.innerHTML = "";
              await (
                window as unknown as {
                  __PLC: { mount: (o: unknown) => Promise<HTMLElement> };
                }
              ).__PLC.mount({
                size: s,
                boardSize: 9,
                strokeUnits: w,
                dotUnits: 0,
                peers: [],
                host: rig,
              });
            },
            [size, strokeUnits],
          );
          await page.waitForTimeout(80);
          const shot = await page.locator("#plc-rig .plc-mark").screenshot();
          const r = await raster(shot);
          const rigShot = await page.locator("#plc-rig").screenshot();
          const rr = await raster(rigShot);
          const g = rr.px(4, 4);
          let best = 0;
          const midY = Math.round(r.h / 2);
          for (let x = 0; x < Math.min(r.w, Math.ceil(6 * dpr)); x++) {
            const c = ratio(r.px(x, midY), g);
            if (c > best) best = c;
          }
          strokeSweep.push({
            size,
            dpr,
            strokeUnits,
            strokeCssPx: +((strokeUnits * size) / 1000).toFixed(3),
            strokeDevicePx: +(((strokeUnits * size) / 1000) * dpr).toFixed(2),
            wobbleMaxPx: +((7.07 * size) / 1000).toFixed(3),
            wobbleOverStroke: +(7.07 / strokeUnits).toFixed(3),
            bestRatio: +best.toFixed(2),
            clears3: best >= 3,
          });
        }
      }
      for (const s of strokeSweep) say("sweep.stroke", s);
      rows.push({ id: "SWEEPS", dotSweep: sweep, strokeSweep });

      await page.evaluate(() => document.querySelector("#plc-rig")?.remove());
      for (const row of rows) if (row.id !== "SWEEPS") say("paint", row);
      mkdirSync(OUT, { recursive: true });
      writeFileSync(
        join(OUT, `paint-${info.project.name}-dpr${dpr}.json`),
        JSON.stringify(rows, null, 1),
      );
      await ctx.close();
    });
  }
});

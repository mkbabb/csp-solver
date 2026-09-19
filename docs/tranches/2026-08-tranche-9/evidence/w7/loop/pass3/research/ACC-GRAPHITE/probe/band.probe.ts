/**
 * ACC-GRAPHITE pass-3 RESEARCH — PAINTED vs DECLARED, and the two coordinate spaces.
 *
 * The family has declared its ring band at 10.76 px and had it measured at 15.0 and 16.0 px by
 * two other instruments. `denominators.probe.ts` found why the numbers can all be honest: the
 * ring is drawn in the CELL's own viewBox (144.444 units wide, 0.48916 px/unit at desk) and the
 * frame line in the BOARD's (1000 units, 0.636 px/unit). A "unit" is not one thing on this board.
 *
 * This probe calibrates the remaining gap — antialias skirt plus the wobble's own wander — by
 * measuring, at HEAD `74a2b5d9` where every stroke width is KNOWN from the DOM, the painted
 * width of three rules over MANY scan rows, and reporting the distribution rather than a peak:
 *
 *   tier-2 focus ring  declared  7 ghost units  -> expected 3.42 px desk
 *   the cell rule      declared  5 board units  -> expected 3.18 px desk
 *   the board frame    declared 12 board units  -> expected 7.63 px desk
 *
 * painted/expected is the inflation law the spec's ratios have to be priced through.
 * Read-only. Banks `../readings/band-<engine>-<rig>-<theme>.json`.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/ACC-GRAPHITE/readings";

const RIGS = [
  { name: "desk", width: 1280, height: 800, dpr: 1, touch: false },
  { name: "phone", width: 393, height: 699, dpr: 3, touch: true },
];
const THEMES = ["light", "dark"] as const;

async function settle(page: Page) {
  await page.waitForSelector(".hand-drawn-grid", { timeout: 30_000 });
  await page.waitForTimeout(1500);
}

test.describe("painted band", () => {
  for (const rig of RIGS)
    for (const theme of THEMES) {
      test(`${rig.name} ${theme}`, async ({ browser }, info) => {
        const ctx = await browser.newContext({
          viewport: { width: rig.width, height: rig.height },
          deviceScaleFactor: rig.dpr,
          hasTouch: rig.touch,
          colorScheme: theme,
        });
        const page = await ctx.newPage();
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await settle(page);

        // Keyboard focus, so `:focus-visible` really matches and tier 2 paints (a click gives
        // tier 1 only — gameCell.css:242-245 says so).
        const firstInput = page.locator(".game-cell input").first();
        await firstInput.focus();
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(600); // the 180ms draw-on, with room

        const dom = await page.evaluate(() => {
          const focused = document.querySelector(".game-cell:has(input:focus-visible)");
          const ghost = focused?.querySelector(".cell-ghost-path") as SVGPathElement | null;
          const gcs = ghost ? getComputedStyle(ghost) : null;
          const gsvg = ghost?.ownerSVGElement;
          const gbox = gsvg?.getBoundingClientRect();
          const gvb = gsvg?.getAttribute("viewBox");
          const peers = document.querySelectorAll(".cell-peer");
          const peerCs = peers[0] ? getComputedStyle(peers[0]) : null;
          // every element on the board carrying a sub-unit opacity (the stacking-context census)
          let subUnit = 0;
          document.querySelectorAll(".hand-drawn-board *, .game-board *").forEach((el) => {
            const o = Number(getComputedStyle(el).opacity);
            if (o > 0 && o < 1) subUnit++;
          });
          const fb = focused?.getBoundingClientRect();
          return {
            focusedCellBox: fb ? { x: +fb.x.toFixed(2), y: +fb.y.toFixed(2), w: +fb.width.toFixed(2), h: +fb.height.toFixed(2) } : null,
            ghost: gcs
              ? {
                  strokeWidthUserUnits: gcs.strokeWidth,
                  strokeOpacity: gcs.strokeOpacity,
                  stroke: gcs.stroke,
                  fill: gcs.fill,
                  fillOpacity: gcs.fillOpacity,
                  strokeLinejoin: gcs.strokeLinejoin,
                  strokeDasharray: gcs.strokeDasharray,
                  viewBox: gvb,
                  boxWidthPx: gbox ? +gbox.width.toFixed(3) : null,
                  pxPerGhostUnit: gbox && gvb ? +(gbox.width / Number(gvb.split(/\s+/)[2])).toFixed(5) : null,
                }
              : null,
            peerNodes: peers.length,
            peerWashPainted: peerCs?.backgroundColor ?? null,
            peerOpacity: peerCs?.opacity ?? null,
            subUnitOpacityNodes: subUnit,
          };
        });

        // Raster the board and read DARKNESS runs (the paper is opaque, so alpha says nothing).
        const shot = await page.locator("svg.hand-drawn-grid").screenshot();
        const scan = await page.evaluate(
          async ([b64, dprS]) => {
            const dpr = Number(dprS);
            const img = new Image();
            img.src = "data:image/png;base64," + b64;
            await img.decode();
            const c = document.createElement("canvas");
            c.width = img.naturalWidth;
            c.height = img.naturalHeight;
            const g = c.getContext("2d", { willReadFrequently: true })!;
            g.drawImage(img, 0, 0);
            const data = g.getImageData(0, 0, c.width, c.height).data;
            const lum = (i: number) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

            // paper = the modal luminance of the raster; ink = anything far from it
            const hist = new Map<number, number>();
            for (let i = 0; i < data.length; i += 4) {
              const q = Math.round(lum(i) / 4) * 4;
              hist.set(q, (hist.get(q) ?? 0) + 1);
            }
            let paper = 0,
              best = -1;
            hist.forEach((n, q) => {
              if (n > best) {
                best = n;
                paper = q;
              }
            });
            const THRESH = 28; // luminance distance that counts as ink

            // Scan every row; record each ink run's width. Device px -> CSS px by /dpr.
            const runs: number[] = [];
            const perRow: { y: number; widths: number[] }[] = [];
            for (let y = 0; y < c.height; y++) {
              const ws: number[] = [];
              let s = -1;
              for (let x = 0; x < c.width; x++) {
                const i = (y * c.width + x) * 4;
                const ink = Math.abs(lum(i) - paper) > THRESH;
                if (ink && s < 0) s = x;
                else if (!ink && s >= 0) {
                  ws.push((x - s) / dpr);
                  s = -1;
                }
              }
              if (s >= 0) ws.push((c.width - s) / dpr);
              runs.push(...ws);
              if (y % 40 === 0) perRow.push({ y, widths: ws.map((w) => +w.toFixed(2)) });
            }
            const sorted = [...runs].sort((a, b) => a - b);
            const q = (p: number) => +(sorted[Math.floor(p * (sorted.length - 1))] ?? 0).toFixed(3);
            // cluster the run widths so each RULE shows up as its own mode
            const buckets = new Map<number, number>();
            for (const w of runs) {
              const k = Math.round(w * 2) / 2;
              buckets.set(k, (buckets.get(k) ?? 0) + 1);
            }
            const modes = [...buckets.entries()]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([w, n]) => ({ widthPx: w, count: n }));
            return {
              raster: { w: c.width, h: c.height, dpr },
              paperLuminance: paper,
              threshold: THRESH,
              runCount: runs.length,
              p05: q(0.05),
              p25: q(0.25),
              median: q(0.5),
              p75: q(0.75),
              p95: q(0.95),
              max: q(1),
              widthModes: modes,
              sampleRows: perRow.slice(0, 6),
            };
          },
          [shot.toString("base64"), String(rig.dpr)],
        );

        mkdirSync(OUT, { recursive: true });
        writeFileSync(
          `${OUT}/band-${info.project.name}-${rig.name}-${theme}.json`,
          JSON.stringify({ base: "74a2b5d9", engine: info.project.name, rig, theme, dom, scan }, null, 2),
        );
        expect(scan.runCount).toBeGreaterThan(0);
        await ctx.close();
      });
    }
});

/**
 * dash-law.mjs — ACC-FIVE pass 2, row 12 (the graft from ACC-GRAPHITE).
 *
 * ACC-GRAPHITE's pass-1 sweep found that a `stroke-dasharray` period LONGER than its path
 * paints once in Chromium and four times in WebKit (WebKit restarts the dash phase once per
 * side of the frame ring). The shipped fill gauge is exactly that shape:
 *   HandDrawnGrid.vue:489-491 — pathLength="1000", stroke-dasharray="1000 1000"
 *   (period 2000 > path 1000), strokeDashoffset = 1000 * (1 - progress).
 * The claim was handed on untested against THIS gauge. This probe tests it.
 *
 * Method: mount the gauge (one digit), then drive `stroke-dashoffset` directly for
 * p in {0.05, 0.25, 0.50, 0.75, 1.00} — the same quantity the component computes — and read
 * the PAINTED ink around the ring: 1440 samples by arc length via getPointAtLength, mapped to
 * viewport coords with getScreenCTM, tested against one screenshot of the board's box. Counts
 * the circular RUNS of inked samples and the inked share. Chromium should read 1 run of share
 * ~= p; WebKit reads 4 if the law holds here.
 *
 *   BASE=http://127.0.0.1:4236 OUT=<dir> node dash-law.mjs
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.env.OUT || ".";
const N = 1440;
const FRACS = [0.05, 0.25, 0.5, 0.75, 1.0];
const GOLD = { light: 83.7, dark: 95.2 };

const out = {};
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
    await page.waitForTimeout(700);

    // one digit mounts the gauge (v-for is gated on progress > 0)
    await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !i.readOnly,
      );
      const e = ins.find((i) => !i.value);
      if (e) e.focus();
    });
    await page.keyboard.type("1");
    await page.waitForTimeout(600);

    const geom = await page.evaluate(() => {
      const p = document.querySelector(".progress-pose.is-active .progress-trace");
      if (!p) return null;
      const cs = getComputedStyle(p);
      return {
        totalLength: +p.getTotalLength().toFixed(1),
        subpaths: (p.getAttribute("d").match(/M/gi) || []).length,
        closes: (p.getAttribute("d").match(/Z/gi) || []).length,
        pathLengthAttr: p.getAttribute("pathLength"),
        dasharray: cs.strokeDasharray,
        strokeWidth: cs.strokeWidth,
        stroke: cs.stroke,
      };
    });

    const arms = {};
    for (const p of FRACS) {
      await page.evaluate((frac) => {
        for (const el of document.querySelectorAll(".progress-trace"))
          el.style.strokeDashoffset = String(1000 * (1 - frac));
      }, p);
      await page.waitForTimeout(250);

      const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
      const clip = {
        x: Math.max(0, Math.floor(box.x - 12)),
        y: Math.max(0, Math.floor(box.y - 12)),
        width: Math.ceil(box.width + 24),
        height: Math.ceil(box.height + 24),
      };
      const buf = await page.screenshot({ clip, type: "png" });
      const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
      const ch = info.channels;

      const pts = await page.evaluate((n) => {
        const el = document.querySelector(".progress-pose.is-active .progress-trace");
        const total = el.getTotalLength();
        const m = el.getScreenCTM();
        const svg = el.ownerSVGElement;
        const o = [];
        for (let i = 0; i < n; i++) {
          const q = el.getPointAtLength((i / n) * total);
          const sp = svg.createSVGPoint();
          sp.x = q.x;
          sp.y = q.y;
          const r = sp.matrixTransform(m);
          o.push([r.x, r.y]);
        }
        return o;
      }, N);

      const chromaAt = (px, py) => {
        let best = { C: 0, h: null };
        for (let dx = -1; dx <= 1; dx++)
          for (let dy = -1; dy <= 1; dy++) {
            const x = Math.round(px - clip.x) + dx;
            const y = Math.round(py - clip.y) + dy;
            if (x < 0 || y < 0 || x >= info.width || y >= info.height) continue;
            const o = (y * info.width + x) * ch;
            const c = rgbToOklch(data[o], data[o + 1], data[o + 2]);
            if (c.C > best.C) best = c;
          }
        return best;
      };

      const inked = pts.map(([x, y]) => {
        const c = chromaAt(x, y);
        const dh = c.h == null ? 999 : Math.abs(c.h - GOLD[scheme]);
        return c.C >= 0.05 && Math.min(dh, 360 - dh) <= 25;
      });

      // circular run count
      let runs = 0;
      for (let i = 0; i < N; i++) if (inked[i] && !inked[(i - 1 + N) % N]) runs++;
      if (inked.every(Boolean)) runs = 1;
      const share = +(inked.filter(Boolean).length / N).toFixed(3);
      // run lengths, circular
      const lens = [];
      if (runs > 0 && !inked.every(Boolean)) {
        let start = -1;
        for (let i = 0; i < N; i++)
          if (inked[i] && !inked[(i - 1 + N) % N]) {
            start = i;
            break;
          }
        let i = start,
          cur = 0,
          seen = 0;
        while (seen < N) {
          if (inked[i % N]) cur++;
          else if (cur) {
            lens.push(cur);
            cur = 0;
          }
          i++;
          seen++;
        }
        if (cur) lens.push(cur);
      } else if (runs === 1) lens.push(N);

      arms[p] = {
        dashoffset: 1000 * (1 - p),
        runs,
        inkedShare: share,
        runLengthsSamples: lens,
        runSharePerRun: lens.map((l) => +(l / N).toFixed(3)),
      };
      console.log(
        `  ${engine} ${scheme} p=${p} offset=${1000 * (1 - p)} runs=${runs} share=${share} lens=[${lens.join(",")}]`,
      );
    }
    out[`${engine}/${scheme}`] = { geom, arms };
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(`${OUT}/dash-law.json`, JSON.stringify(out, null, 2));
console.log("banked", `${OUT}/dash-law.json`);

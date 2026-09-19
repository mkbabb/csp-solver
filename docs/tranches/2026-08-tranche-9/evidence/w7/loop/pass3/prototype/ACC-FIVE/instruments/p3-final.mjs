#!/usr/bin/env node
/** ACC-FIVE pass-3 · THE CORRIDOR AND THE WIN, on a board driven the way a player drives it.
 *
 *  Two more defects in my own instrument, named and cured:
 *
 *  4. THE MODAL-OF-RUN SAMPLED COLUMNS THE FRONT HAD NOT REACHED. At `valuenow 5` the gauge
 *     covers the first fifth of the top edge, so 19 of my 24 columns held no gauge at all and
 *     their "most chromatic pixel" was the frame line. The mode was therefore the LINE's colour
 *     (light 230,230,228) and the corridor read 1.228. Cured twice over: a CHROMA FLOOR of 0.05
 *     (the gauge paints C 0.122 light / 0.100 dark; the line paints C 0.011) and a board filled
 *     far enough that 24 columns of top edge are traced.
 *  5. THE WIN SOLVED ONLY ONCE IN FOUR, because the probe typed a digit that was often WRONG —
 *     an unsolvable board returns the failure verdict, not a win. The fill is now driven by the
 *     product's own HINT button, which writes a CORRECT digit, so the board stays solvable and
 *     `Solve` reaches 100% every time.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4236";
const LABEL = process.env.LABEL || "prototype";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: BASE=… node p3-final.mjs <out.json>");

const C_FLOOR = 0.05;
const lum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};
const GOLD = { light: 83.7, dark: 95.2 };

async function grid(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  return {
    at: (x, y) => {
      const o = (y * info.width + x) * ch;
      return [data[o], data[o + 1], data[o + 2]];
    },
    w: info.width,
    h: info.height,
  };
}

function groundOf(img) {
  const freq = new Map();
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++) {
      const k = img.at(x, y).join(",");
      freq.set(k, (freq.get(k) || 0) + 1);
    }
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  const paper = ranked[0][0].split(",").map(Number);
  let line = null;
  for (const [k] of ranked) {
    const rgb = k.split(",").map(Number);
    if (k === ranked[0][0]) continue;
    if (rgbToOklch(...rgb).C > 0.03) continue;
    if (Math.abs(lum(rgb) - lum(paper)) < 0.05) continue;
    line = { rgb };
    break;
  }
  return { paper, line };
}

/** per-column core ABOVE the chroma floor; the mode of those, and the max beside it */
function modalCore(img, cols = 24) {
  const per = [];
  let max = null;
  const step = Math.max(1, Math.floor(img.w / cols));
  for (let c = 0; c < cols; c++) {
    const x = Math.min(img.w - 1, c * step);
    let best = null;
    for (let y = 0; y < img.h; y++) {
      const rgb = img.at(x, y);
      const o = rgbToOklch(...rgb);
      if (o.C < C_FLOOR) continue;
      if (!best || o.C > best.C) best = { rgb, ...o };
      if (!max || o.C > max.C) max = { rgb, ...o };
    }
    if (best) per.push(best);
  }
  if (!per.length) return null;
  const freq = new Map();
  for (const p of per) freq.set(p.rgb.join(","), (freq.get(p.rgb.join(",")) || 0) + 1);
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  const rgb = ranked[0][0].split(",").map(Number);
  const o = rgbToOklch(...rgb);
  return {
    columnsWithGauge: per.length,
    columnsAsked: cols,
    modal: { rgb, C: +o.C.toFixed(3), L: +o.L.toFixed(4), h: +o.h.toFixed(1) },
    modalCount: ranked[0][1],
    maxChroma: { rgb: max.rgb, C: +max.C.toFixed(3), L: +max.L.toFixed(4), h: +max.h.toFixed(1) },
    bandMedianL: +per.map((p) => p.L).sort((a, b) => a - b)[per.length >> 1].toFixed(4),
  };
}

const rows = { meta: { base: BASE, label: LABEL, control: "74a2b5d9", chromaFloor: C_FLOOR }, cells: {} };

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const scheme of ["light", "dark"]) {
    const cell = `${eng}/${scheme}`;
    const R = (rows.cells[cell] = {});
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      colorScheme: scheme,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1200);

    const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const strip = (x0, x1) => ({
      x: Math.round(box.x + box.width * x0),
      y: Math.round(box.y - 10),
      width: Math.max(2, Math.round(box.width * (x1 - x0))),
      height: 26,
    });
    const shot = (clip) => page.screenshot({ clip, type: "png" });

    R.ground = groundOf(await grid(await shot(strip(0.1, 0.9))));

    /* fill with the product's own HINT — every digit it writes is CORRECT, so the board stays
       solvable and the front walks the top edge for real. */
    const hint = await page.evaluate(() => !!document.querySelector('[aria-label*="Hint" i]'));
    R.hintFound = hint;
    let n = 0;
    for (; n < 26; n++) {
      const ok = await page.evaluate(() => {
        const b = document.querySelector('[aria-label*="Hint" i]');
        if (!b || b.disabled) return false;
        b.click();
        return true;
      });
      if (!ok) break;
      await page.waitForTimeout(130);
    }
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.waitForTimeout(1000);
    R.hintsClicked = n;
    R.valuenow = await page.evaluate(
      () => document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow"),
    );
    R.valuetext = await page.evaluate(
      () => document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuetext"),
    );
    R.computed = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const f = document.querySelector(".frame-line");
      const cs = t && getComputedStyle(t);
      return {
        strokeOpacity: cs?.strokeOpacity,
        frameStrokeOpacity: f ? getComputedStyle(f).strokeOpacity : null,
        stroke: cs?.stroke,
        strokeWidth: cs?.strokeWidth,
        segments: (t?.getAttribute("d")?.match(/[ML]/gi) || []).length,
        nodes: document.querySelectorAll(".progress-trace").length,
        pathLength: t?.getAttribute("pathLength") ?? null,
        dash: t?.getAttribute("stroke-dasharray") ?? null,
      };
    });

    /* THE CORRIDOR, PAINTED — 24 columns over the traced top edge */
    const c = modalCore(await grid(await shot(strip(0.1, 0.9))), 24);
    R.corridorPainted = c && {
      ...c,
      vsLine: ratio(c.modal.rgb, R.ground.line.rgb),
      vsPaper: ratio(c.modal.rgb, R.ground.paper),
      worst: Math.min(ratio(c.modal.rgb, R.ground.line.rgb), ratio(c.modal.rgb, R.ground.paper)),
      dHueFromCrayonGold: +hueDist(c.modal.h, GOLD[scheme]).toFixed(2),
      maxChromaVsLine: ratio(c.maxChroma.rgb, R.ground.line.rgb),
      maxChromaVsPaper: ratio(c.maxChroma.rgb, R.ground.paper),
    };

    /* THE ALPHA CONTROL: the same ink forced back to 0.95 */
    await page.evaluate(() => {
      const s = document.createElement("style");
      s.id = "a95";
      s.textContent = ".progress-trace{stroke-opacity:.95!important}";
      document.head.appendChild(s);
    });
    await page.waitForTimeout(320);
    const c95 = modalCore(await grid(await shot(strip(0.1, 0.9))), 24);
    R.alpha095Control = c95 && {
      modal: c95.modal,
      vsLine: ratio(c95.modal.rgb, R.ground.line.rgb),
      vsPaper: ratio(c95.modal.rgb, R.ground.paper),
      worst: Math.min(ratio(c95.modal.rgb, R.ground.line.rgb), ratio(c95.modal.rgb, R.ground.paper)),
    };
    await page.evaluate(() => document.getElementById("a95")?.remove());
    await page.waitForTimeout(220);

    /* THE WIN */
    await page.evaluate(() => document.querySelector('[aria-label="Solve puzzle"]')?.click());
    R.win = { samples: [] };
    let prev = 0;
    for (const ms of [900, 1800, 2700, 3600, 5000]) {
      await page.waitForTimeout(ms - prev);
      prev = ms;
      const st = await page.evaluate(() => {
        const t = document.querySelector(".progress-trace");
        return {
          hasSolveSuccess: !!document.querySelector(".solve-success"),
          stroke: t ? getComputedStyle(t).stroke : null,
          valuenow: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow"),
          goldStar: getComputedStyle(document.documentElement).getPropertyValue("--color-gold-star").trim(),
          nodes: document.querySelectorAll(".progress-trace").length,
        };
      });
      const cw = modalCore(await grid(await shot(strip(0.1, 0.9))), 24);
      R.win.samples.push({
        ms,
        ...st,
        modal: cw?.modal ?? null,
        bandMedianL: cw?.bandMedianL ?? null,
        vsLine: cw && ratio(cw.modal.rgb, R.ground.line.rgb),
        vsPaper: cw && ratio(cw.modal.rgb, R.ground.paper),
        dHueFromCrayonGold: cw && +hueDist(cw.modal.h, GOLD[scheme]).toFixed(2),
      });
    }
    R.win.deltaLFromFill =
      c && R.win.samples.at(-1).bandMedianL != null
        ? +(R.win.samples.at(-1).bandMedianL - c.bandMedianL).toFixed(4)
        : null;

    /* THE LAYERED ABLATION */
    await page.evaluate(() => {
      const s = document.createElement("style");
      s.id = "abl";
      s.textContent = "@layer base{.solve-success .progress-trace{opacity:0!important}}";
      document.head.appendChild(s);
    });
    await page.waitForTimeout(900);
    const ca = modalCore(await grid(await shot(strip(0.1, 0.9))), 24);
    R.win.ablationLayered = {
      modal: ca?.modal ?? null,
      bandMedianL: ca?.bandMedianL ?? null,
      columnsWithGauge: ca?.columnsWithGauge ?? 0,
      dL:
        ca && R.win.samples.at(-1).bandMedianL != null
          ? +(ca.bandMedianL - R.win.samples.at(-1).bandMedianL).toFixed(4)
          : null,
    };
    await page.evaluate(() => document.getElementById("abl")?.remove());

    await ctx.close();
    console.error(`  done ${cell}`);
  }
  await browser.close();
}

writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);

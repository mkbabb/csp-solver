#!/usr/bin/env node
/** ACC-FIVE pass-3 · G3 THE WIN + the re-cut GROUND + G6 THE DIGIT.
 *
 *  Three defects in my own first probe, named and cured here:
 *
 *  1. THE WIN NEVER FIRED. It typed two `5`s into the first two empty cells of row 1 — a
 *     duplicate — so `Solve` returned UNSOLVABLE and the red it painted was the FAILURE
 *     verdict (teacher-red #E8315B), not a win. The board is solved from UNTOUCHED here.
 *  2. THE LINE GROUND WAS THE ACHROMATIC EXTREME, so it read (10,10,10) light where the
 *     spec's painted frame line is (49,49,49): the darkest pixel in the band is a glyph's
 *     antialiasing, not the line's core. The line is now the MODAL achromatic colour that is
 *     not paper — the line's own body, which is what 1.4.11 binds against.
 *  3. THE DIGIT PROBE PICKED A GIVEN in light (resolved stroke rgb(10,10,10) =
 *     --color-foreground). The cell typed into is now remembered by INDEX and read back.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4236";
const LABEL = process.env.LABEL || "prototype";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: BASE=… node p3-win.mjs <out.json>");

const lum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};
const GOLD = { light: 83.7, dark: 95.2 };
const BLUE = { light: 251.4, dark: 249.3 };

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

/** paper = the modal colour; line = the modal ACHROMATIC colour that is not paper. */
function groundOf(img) {
  const freq = new Map();
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++) {
      const rgb = img.at(x, y);
      const k = rgb.join(",");
      freq.set(k, (freq.get(k) || 0) + 1);
    }
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  const paper = ranked[0][0].split(",").map(Number);
  let line = null;
  for (const [k, n] of ranked) {
    const rgb = k.split(",").map(Number);
    if (rgb.join(",") === paper.join(",")) continue;
    if (rgbToOklch(...rgb).C > 0.03) continue;
    if (Math.abs(lum(rgb) - lum(paper)) < 0.05) continue; // still paper's antialiasing
    line = { rgb, n };
    break;
  }
  return { paper, paperN: ranked[0][1], line };
}

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
      if (!best || o.C > best.C) best = { rgb, ...o };
      if (!max || o.C > max.C) max = { rgb, ...o };
    }
    if (best) per.push(best);
  }
  const freq = new Map();
  for (const p of per) freq.set(p.rgb.join(","), (freq.get(p.rgb.join(",")) || 0) + 1);
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  const rgb = ranked[0][0].split(",").map(Number);
  const o = rgbToOklch(...rgb);
  return {
    columns: per.length,
    modal: { rgb, C: +o.C.toFixed(3), L: +o.L.toFixed(4), h: +o.h.toFixed(1) },
    modalCount: ranked[0][1],
    maxChroma: max && { rgb: max.rgb, C: +max.C.toFixed(3), L: +max.L.toFixed(4), h: +max.h.toFixed(1) },
    bandMedianL: +per.map((p) => p.L).sort((a, b) => a - b)[per.length >> 1].toFixed(4),
  };
}

const rows = { meta: { base: BASE, label: LABEL, control: "74a2b5d9" }, cells: {} };

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

    /* ── the re-cut GROUND, at progress 0 (no trace node exists) ── */
    R.traceNodesAt0 = await page.evaluate(
      () => document.querySelectorAll(".progress-trace").length,
    );
    R.ground = groundOf(await grid(await shot(strip(0.15, 0.55))));

    /* ── G6 · ONE digit, into a remembered cell ── */
    const idx = await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input"));
      const i = ins.findIndex((el) => !el.readOnly && !el.value);
      if (i < 0) return -1;
      ins[i].focus();
      return i;
    });
    if (idx >= 0) {
      await page.keyboard.type("1");
      await page.waitForTimeout(200);
      await page.evaluate(() => document.activeElement?.blur?.());
      await page.waitForTimeout(800);
      const dg = await page.evaluate((i) => {
        const el = Array.from(document.querySelectorAll(".sudoku-cell input"))[i];
        const c = el.closest(".sudoku-cell");
        const p = c.querySelector(".glyph-svg path");
        const r = c.getBoundingClientRect();
        return {
          value: el.value,
          readOnly: el.readOnly,
          resolvedStroke: p ? getComputedStyle(p).stroke : null,
          cellClass: c.className,
          box: { x: r.x, y: r.y, width: r.width, height: r.height },
        };
      }, idx);
      const gd = await grid(
        await shot({
          x: Math.round(dg.box.x + 2),
          y: Math.round(dg.box.y + 2),
          width: Math.round(dg.box.width - 4),
          height: Math.round(dg.box.height - 4),
        }),
      );
      let best = null;
      const bgFreq = new Map();
      for (let y = 0; y < gd.h; y++)
        for (let x = 0; x < gd.w; x++) {
          const rgb = gd.at(x, y);
          const o = rgbToOklch(...rgb);
          bgFreq.set(rgb.join(","), (bgFreq.get(rgb.join(",")) || 0) + 1);
          if (!best || o.C > best.C) best = { rgb, ...o };
        }
      const cellGround = [...bgFreq.entries()].sort((a, b) => b[1] - a[1])[0][0]
        .split(",")
        .map(Number);
      R.digit = {
        typedIndex: idx,
        ...dg,
        painted: best && { rgb: best.rgb, C: +best.C.toFixed(3), L: +best.L.toFixed(3), h: +best.h.toFixed(1) },
        dHueFromCrayonBlue: best && +hueDist(best.h, BLUE[scheme]).toFixed(2),
        cellGround,
        vsCellGround: best && ratio(best.rgb, cellGround),
        vsBoardPaper: best && ratio(best.rgb, R.ground.paper),
      };
    }

    /* ── the CORRIDOR at this fill (one digit, valid) ── */
    R.valuenow = await page.evaluate(() => {
      const el = document.querySelector('[role="progressbar"]');
      return el ? el.getAttribute("aria-valuenow") : null;
    });
    R.computed = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const cs = t && getComputedStyle(t);
      return {
        strokeOpacity: cs?.strokeOpacity,
        stroke: cs?.stroke,
        strokeWidth: cs?.strokeWidth,
        segments: (t?.getAttribute("d")?.match(/[ML]/gi) || []).length,
        nodes: document.querySelectorAll(".progress-trace").length,
      };
    });
    if (R.ground.line) {
      const c = modalCore(await grid(await shot(strip(0.15, 0.55))), 24);
      R.corridorPainted = {
        ...c,
        vsLine: ratio(c.modal.rgb, R.ground.line.rgb),
        vsPaper: ratio(c.modal.rgb, R.ground.paper),
        worst: Math.min(ratio(c.modal.rgb, R.ground.line.rgb), ratio(c.modal.rgb, R.ground.paper)),
        dHueFromCrayonGold: +hueDist(c.modal.h, GOLD[scheme]).toFixed(2),
        maxChromaVsLine: ratio(c.maxChroma.rgb, R.ground.line.rgb),
        maxChromaVsPaper: ratio(c.maxChroma.rgb, R.ground.paper),
      };
      // the alpha control, same ink at 0.95
      await page.evaluate(() => {
        const s = document.createElement("style");
        s.id = "a95";
        s.textContent = ".progress-trace{stroke-opacity:.95!important}";
        document.head.appendChild(s);
      });
      await page.waitForTimeout(300);
      const c95 = modalCore(await grid(await shot(strip(0.15, 0.55))), 24);
      R.alpha095Control = {
        modal: c95.modal,
        vsLine: ratio(c95.modal.rgb, R.ground.line.rgb),
        vsPaper: ratio(c95.modal.rgb, R.ground.paper),
        worst: Math.min(ratio(c95.modal.rgb, R.ground.line.rgb), ratio(c95.modal.rgb, R.ground.paper)),
      };
      await page.evaluate(() => document.getElementById("a95")?.remove());
      await page.waitForTimeout(200);
    }

    /* ── G3 · THE WIN, solved from a board whose only edit is one VALID digit ── */
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
          crayonGold: getComputedStyle(document.documentElement).getPropertyValue("--color-crayon-gold").trim(),
          nodes: document.querySelectorAll(".progress-trace").length,
        };
      });
      const c = modalCore(await grid(await shot(strip(0.15, 0.55))), 24);
      R.win.samples.push({
        ms,
        ...st,
        modal: c.modal,
        bandMedianL: c.bandMedianL,
        vsLine: R.ground.line ? ratio(c.modal.rgb, R.ground.line.rgb) : null,
        vsPaper: ratio(c.modal.rgb, R.ground.paper),
        dHueFromCrayonGold: +hueDist(c.modal.h, GOLD[scheme]).toFixed(2),
      });
    }
    /* THE LAYERED ABLATION — the dead rule re-stated in an EARLIER layer, the only way to
       beat an !important in `utilities`. */
    await page.evaluate(() => {
      const s = document.createElement("style");
      s.id = "abl";
      s.textContent = "@layer base{.solve-success .progress-trace{opacity:0!important}}";
      document.head.appendChild(s);
    });
    await page.waitForTimeout(900);
    const ca = modalCore(await grid(await shot(strip(0.15, 0.55))), 24);
    const lastL = R.win.samples[R.win.samples.length - 1].bandMedianL;
    R.win.ablationLayered = {
      modal: ca.modal,
      bandMedianL: ca.bandMedianL,
      dL: +(ca.bandMedianL - lastL).toFixed(4),
    };
    await page.evaluate(() => document.getElementById("abl")?.remove());

    await ctx.close();
    console.error(`  done ${cell}`);
  }
  await browser.close();
}

writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);

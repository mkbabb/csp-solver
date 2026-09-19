/**
 * band-clean.mjs — the CRITIC's independent re-read of ACC-FIVE's two open holes.
 *
 * A) THE 1.4.11 BAND, CLEANLY. The prototype's own read is contaminated: it samples the
 *    frame line inside the same 22 px band the 5 px trace is painted on, so the "line"
 *    pixel is part trace. This probe samples the frame line on an edge the front has NOT
 *    reached (the BOTTOM band, with progress held near a quarter, front clockwise from the
 *    top-left), and the trace core on the top edge. Same paint, uncontaminated ground.
 *
 * B) G5's LIGHT DIGIT, which the prototype never read: its selector picked a GIVEN glyph.
 *    Here the digit is the cell the probe itself typed into, located by its own input.
 *
 * Read-only on product files. Its own dir, its own port (4241), its own cacheDir.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
const { chromium, webkit } = pw;
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear } from "./oklch.COPY.mjs";

const BASE = "http://127.0.0.1:4241";
const OUT = new URL("../readings/band-clean.json", import.meta.url).pathname;

const lum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};
const hueDelta = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return +Math.min(d, 360 - d).toFixed(2);
};

async function pixels(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const at = (x, y) => {
    const o = (y * info.width + x) * ch;
    return [data[o], data[o + 1], data[o + 2]];
  };
  return { at, w: info.width, h: info.height };
}

const GOLD = { light: 83.7, dark: 95.2 };
const BLUE = { light: 251.4, dark: 249.3 };

const rows = [];

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      colorScheme: scheme,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1200);

    // ── B) one digit, in a cell this probe chose, so it is a USER digit and not a given ──
    const cellBox = await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !i.readOnly && !i.value,
      );
      if (!ins[0]) return null;
      ins[0].focus();
      const c = ins[0].closest(".sudoku-cell");
      const r = c.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    await page.keyboard.type("5");
    await page.waitForTimeout(700);
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.waitForTimeout(400);

    const digitShot = await page.screenshot({
      clip: {
        x: Math.floor(cellBox.x + 2),
        y: Math.floor(cellBox.y + 2),
        width: Math.ceil(cellBox.w - 4),
        height: Math.ceil(cellBox.h - 4),
      },
    });
    const dp = await pixels(digitShot);
    let digit = null;
    for (let y = 0; y < dp.h; y++)
      for (let x = 0; x < dp.w; x++) {
        const rgb = dp.at(x, y);
        const o = rgbToOklch(...rgb);
        if (!digit || o.C > digit.C) digit = { rgb, ...o };
      }
    const digitStroke = await page.evaluate(() => {
      const el = document.querySelector(".sudoku-cell input:not([readonly])");
      const cell = el?.closest(".sudoku-cell");
      const p = cell?.querySelector(".glyph-svg path");
      return p ? getComputedStyle(p).stroke : null;
    });

    // ── A) drive the gauge to roughly a quarter, then read the band ──
    for (let k = 0; k < 14; k++) {
      const ok = await page.evaluate(() => {
        const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
          (i) => !i.readOnly && !i.value,
        );
        if (!ins[0]) return false;
        ins[0].focus();
        return true;
      });
      if (!ok) break;
      await page.keyboard.type("5");
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.waitForTimeout(800);

    const valuenow = await page.evaluate(() => {
      const el = document.querySelector('[role="progressbar"]');
      return el ? el.getAttribute("aria-valuenow") : null;
    });

    const grid = page.locator("svg.hand-drawn-grid").first();
    const shot = await grid.screenshot();
    const gp = await pixels(shot);

    // paper = the modal colour of the whole board
    const freq = new Map();
    for (let y = 0; y < gp.h; y += 2)
      for (let x = 0; x < gp.w; x += 2) {
        const k = gp.at(x, y).join(",");
        freq.set(k, (freq.get(k) || 0) + 1);
      }
    const paper = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);

    // trace core: the most chromatic pixel in the gold arc, top band
    let core = null;
    for (let y = 0; y < Math.min(14, gp.h); y++)
      for (let x = 0; x < gp.w; x++) {
        const rgb = gp.at(x, y);
        const o = rgbToOklch(...rgb);
        if (o.C < 0.02) continue;
        if (hueDelta(o.h, GOLD[scheme]) > 30) continue;
        if (!core || o.C > core.C) core = { rgb, ...o, x, y };
      }

    // frame line: the BOTTOM band, which the front has not reached — achromatic extreme
    let line = null;
    for (let y = gp.h - 14; y < gp.h; y++)
      for (let x = 40; x < gp.w - 40; x++) {
        const rgb = gp.at(x, y);
        const o = rgbToOklch(...rgb);
        if (o.C > 0.03) continue;
        const better =
          scheme === "light" ? !line || o.L < line.L : !line || o.L > line.L;
        if (better) line = { rgb, ...o, x, y };
      }

    // and the same read on the TOP band's achromatic pixels, for the contamination delta
    let lineTop = null;
    for (let y = 0; y < Math.min(14, gp.h); y++)
      for (let x = 40; x < gp.w - 40; x++) {
        const rgb = gp.at(x, y);
        const o = rgbToOklch(...rgb);
        if (o.C > 0.03) continue;
        const better =
          scheme === "light" ? !lineTop || o.L < lineTop.L : !lineTop || o.L > lineTop.L;
        if (better) lineTop = { rgb, ...o, x, y };
      }

    const computed = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const g = document.querySelector("svg.hand-drawn-grid .grid-path, .grid-line");
      return {
        trace: t ? getComputedStyle(t).stroke : null,
        traceOpacity: t ? getComputedStyle(t).strokeOpacity : null,
        line: g ? getComputedStyle(g).stroke : null,
      };
    });

    rows.push({
      engine: eng,
      scheme,
      valuenow,
      boardPx: { w: gp.w, h: gp.h },
      digit: digit && {
        rgb: digit.rgb,
        h: +digit.h.toFixed(1),
        C: +digit.C.toFixed(3),
        L: +digit.L.toFixed(3),
        dHueFromCrayonBlue: hueDelta(digit.h, BLUE[scheme]),
        vsPaper: ratio(digit.rgb, paper),
        computedStroke: digitStroke,
      },
      trace: core && {
        rgb: core.rgb,
        h: +core.h.toFixed(1),
        C: +core.C.toFixed(3),
        dHueFromCrayonGold: hueDelta(core.h, GOLD[scheme]),
      },
      frameLine_untraced_bottom: line && { rgb: line.rgb, L: +line.L.toFixed(3) },
      frameLine_contaminated_top: lineTop && { rgb: lineTop.rgb, L: +lineTop.L.toFixed(3) },
      paper,
      ratios: core &&
        line && {
          trace_vs_untracedLine: ratio(core.rgb, line.rgb),
          trace_vs_contaminatedTopLine: ratio(core.rgb, lineTop.rgb),
          trace_vs_paper: ratio(core.rgb, paper),
        },
      computed,
    });
    await ctx.close();
  }
  await browser.close();
}

writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.log(JSON.stringify(rows, null, 2));
console.log("EXIT_OK");

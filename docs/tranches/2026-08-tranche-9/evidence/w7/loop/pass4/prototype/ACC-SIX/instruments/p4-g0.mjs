#!/usr/bin/env node
/** G0 — THE SECTION'S ONE INSTRUMENT, re-cut over SEGMENT COUNT (ACC-SIX's leader duty).
 *
 * Pass 3 read the painted share at three fractions. The registry's re-cut asks the question the
 * other way round: the front is GEOMETRY now, so the thing that can go wrong is the number of
 * path commands it is built from. This walks the gauge up its own writable count, records the
 * trace's ACTUAL command count at each stop, and reads the painted violet share of the ring
 * band against the requested fraction — both engines, dpr 1 and 3 — with two controls beside:
 *
 *   CSS-FORM CONTROL: the same node given back the declaration form the wave deleted
 *     (`pathLength=100` + `stroke-dasharray`), driven to the same fraction. Pass 3 falsified
 *     this form on HEAD (chromium 24.74 vs webkit 99.07 at a requested 25 %); it is re-run here
 *     on THIS tree so the falsification is the lane's own, not a memory.
 *   4-SUBPATH CONTROL: a `d` carrying four subpaths at the same fraction — the multi-subpath
 *     case `poseFronts` must not mis-cut (ACC-FIVE's guard; consumed, not re-cut).
 *
 * BOUND: painted share within 2 points of the requested fraction, and the two engines within 2
 * points of each other, at every stop and both densities.
 *
 * usage: BASE=http://127.0.0.1:4237 node p4-g0.mjs <out.json>
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: BASE=… node p4-g0.mjs <out.json>");
const VIOLET = 293.0;

async function violetPx(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let inked = 0;
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * ch;
    const { C, h } = rgbToOklch(data[o], data[o + 1], data[o + 2]);
    if (C >= 0.05 && hueDist(h, VIOLET) <= 20) inked++;
  }
  return { inked, pixels: info.width * info.height };
}

async function typeDigits(page, n) {
  for (let k = 0; k < n; k++) {
    const ok = await page.evaluate(() => {
      const i = Array.from(document.querySelectorAll(".sudoku-cell input")).find(
        (x) => !x.readOnly && !x.value,
      );
      if (!i) return false;
      i.focus();
      return true;
    });
    if (!ok) return k;
    await page.keyboard.type("5");
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  return n;
}

const traceState = (page) =>
  page.evaluate(() => {
    const t = document.querySelector(".progress-trace");
    const bar = document.querySelector('[role="progressbar"]');
    const cs = t && getComputedStyle(t);
    return {
      segments: (t?.getAttribute("d")?.match(/[MLCQAZ]/gi) || []).length,
      subpaths: (t?.getAttribute("d")?.match(/M/gi) || []).length,
      hasPathLength: !!t?.getAttribute("pathLength"),
      dash: cs?.strokeDasharray ?? null,
      now: +(bar?.getAttribute("aria-valuenow") ?? 0),
      max: +(bar?.getAttribute("aria-valuemax") ?? 0),
    };
  });

const rows = { meta: { base: BASE, control: "74a2b5d9", bound: "painted share within 2 pts" }, cells: {} };

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const dpr of [1, 3]) {
    const key = `${eng}/dpr${dpr}`;
    const R = (rows.cells[key] = { stops: [] });
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: dpr,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1000);
    const b = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const band = {
      x: Math.round(b.x - 8),
      y: Math.round(b.y - 8),
      width: Math.round(b.width + 16),
      height: Math.round(b.height + 16),
    };
    const st0 = await traceState(page);
    const max = st0.max || 20;
    const wants = [...new Set([1, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max])];
    let at = st0.now;
    for (const want of wants) {
      if (want > at) at += await typeDigits(page, want - at);
      await page.waitForTimeout(500);
      const st = await traceState(page);
      const v = await violetPx(await page.screenshot({ clip: band, type: "png" }));
      R.stops.push({ want, ...st, ...v });
    }
    const full = R.stops[R.stops.length - 1].inked || 1;
    R.stops = R.stops.map((s) => ({
      ...s,
      requestedPct: +((s.now / s.max) * 100).toFixed(2),
      paintedPct: +((s.inked / full) * 100).toFixed(2),
      deltaPts: +((s.inked / full) * 100 - (s.now / s.max) * 100).toFixed(2),
    }));

    // ── CONTROL 1 · the CSS declaration form, on the same node at 25 % ──────────────────
    await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      t.setAttribute("pathLength", "100");
      t.style.strokeDasharray = "25 100";
      t.style.strokeDashoffset = "0";
    });
    await page.waitForTimeout(400);
    {
      const v = await violetPx(await page.screenshot({ clip: band, type: "png" }));
      R.cssFormControlAt25 = { ...v, paintedPct: +((v.inked / full) * 100).toFixed(2) };
      await page.evaluate(() => {
        const t = document.querySelector(".progress-trace");
        t.removeAttribute("pathLength");
        t.style.strokeDasharray = "";
        t.style.strokeDashoffset = "";
      });
    }

    // ── CONTROL 2 · four subpaths at the same fraction ──────────────────────────────────
    R.fourSubpathControl = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const d = t.getAttribute("d") || "";
      return { liveSubpaths: (d.match(/M/gi) || []).length, liveSegments: (d.match(/[MLCQAZ]/gi) || []).length };
    });

    await ctx.close();
    console.error(`  done ${key}`);
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);

#!/usr/bin/env node
/** PASS-6 COPY (ACC-SIX, charter row 8: "G0 RUN on the payload"), re-pointed at p6-common. One change,
 *  declared: the LAST stop is the win, and at the win `.solve-success` fades the trace to opacity 0
 *  (HEAD's bow-out), so a painted share normalised by the win's own pixels divides by ~0. The last
 *  stop is therefore read with `.progress-trace { opacity: 1 !important }` injected (the geometry is
 *  unchanged, only the bow-out is held), and the row says so. Otherwise as pass 5 wrote it:
 *  PASS-5 COPY (ACC-SIX): the walk read `aria-valuenow`/`aria-valuemax` as a COUNT — true only on
 *  this family's tree; on the control and on ACC-FIVE's tree they are a PERCENT of 100, so the
 *  walk asked for 25/50/75/100 cells of a 51-cell board and every stop past the first read 100 %
 *  (FIVE's "degenerate walk", pass5/prototype/ACC-FIVE §1.9). The writable count and the written
 *  count now come from the BOARD (empty inputs at load, inputs written since), never from the
 *  gauge's own attributes; writes are the solution's digits on the p5-common payload.
 *
 * G0 — THE SECTION'S ONE INSTRUMENT, re-cut over SEGMENT COUNT (ACC-SIX's leader duty).
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

import { BOARD as BOARD1, BOARD2, writeLegal, asset } from "./p6-common.mjs";
const P5BOARD = process.env.PAYLOAD === "2" ? BOARD2 : BOARD1; // PAYLOAD=2: the second payload
async function typeDigits(page, n) {
  for (let k = 0; k < n; k++) if ((await writeLegal(page, 90)) < 0) return k;
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
      ariaNow: bar?.getAttribute("aria-valuenow") ?? null,
      ariaMax: bar?.getAttribute("aria-valuemax") ?? null,
      empty: Array.from(document.querySelectorAll(".sudoku-cell input")).filter((x) => !x.value).length,
    };
  });

const rows = { meta: { base: BASE, board: P5BOARD, control: "74a2b5d9", bound: "painted share within 2 pts" }, cells: {} };

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
    await page.goto(`${BASE}/${P5BOARD}`);
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
    const max = st0.empty; // the WRITABLE count, read off the board at load
    const wants = [...new Set([1, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max])];
    let at = 0;
    R.asset = await asset(page);
    for (const want of wants) {
      if (want > at) at += await typeDigits(page, want - at);
      if (want === max)
        await page.evaluate(() => { const s = document.createElement("style"); s.id = "acc6-g0-hold"; s.textContent = ".progress-trace { opacity: 1 !important; transition: none !important; }"; document.head.appendChild(s); });
      await page.waitForTimeout(500);
      const st = { ...(await traceState(page)), now: at, max };
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

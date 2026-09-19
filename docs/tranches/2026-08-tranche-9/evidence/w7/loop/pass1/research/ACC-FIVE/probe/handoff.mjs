/**
 * handoff.mjs — "the trace BECOMES the solved frame at 100%", measured rather than looked at.
 *
 * At 196 px per panel the meter strip cannot settle whether the win's gold is the same gold.
 * This drives one board to 100%, solves it, and reads THREE things off the live page:
 *   · `.solve-success` is really on (the celebration is running, not just a filled board);
 *   · what `.grid-line` and `.frame-line` are stroked with before and after;
 *   · what `.progress-trace` is stroked with and at what opacity, before and after.
 * Then it banks ONE two-panel corner crop at 3x the strip's scale so the handoff is legible.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { rgbToOklch, parseCss, hueDist, ratio } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";
const OVERLAY = `${HERE}/proto/five-crayons.css`;

const browser = await chromium.launch();
const out = {};
for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    colorScheme: scheme,
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.addStyleTag({ path: OVERLAY });
  await page.waitForTimeout(700);

  const read = () =>
    page.evaluate(() => {
      const gl = document.querySelector(".grid-line");
      const fl = document.querySelector(".frame-line") ?? gl;
      const tr = document.querySelector(".progress-trace");
      const pb = document.querySelector('[role="progressbar"]');
      const root = document.querySelector(".solve-success");
      return {
        solveSuccess: !!root,
        fill: pb ? Number(pb.getAttribute("aria-valuenow")) : null,
        gridLineStroke: gl ? getComputedStyle(gl).stroke : null,
        frameLineStroke: fl ? getComputedStyle(fl).stroke : null,
        traceStroke: tr ? getComputedStyle(tr).stroke : null,
        traceOpacity: tr ? getComputedStyle(tr).strokeOpacity : null,
        traceNodes: document.querySelectorAll(".progress-trace").length,
      };
    });

  const emptyCount = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !i.readOnly && !i.value,
      ).length,
  );
  for (let k = 0; k < emptyCount + 4; k++) {
    const done = await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !i.readOnly,
      );
      const e = ins.findIndex((i) => !i.value);
      if (e < 0) return true;
      ins[e].focus();
      return false;
    });
    if (done) break;
    await page.keyboard.type("1");
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(900);
  const atFull = await read();

  const grid = page.locator("svg.hand-drawn-grid").first();
  const shot = async () => {
    const b = await grid.boundingBox();
    return page.screenshot({
      clip: {
        x: Math.max(0, Math.round(b.x - 14)),
        y: Math.max(0, Math.round(b.y - 14)),
        width: 300,
        height: 190,
      },
      type: "png",
    });
  };
  const shotFull = await shot();

  await page.locator('[aria-label="Solve puzzle"]').first().click({ timeout: 8000 }).catch(() => {});
  // the celebration's own budget: star crest 2650 ms, cap 3.19 s (pencilConfig CELEBRATION);
  // the frame's stroke transition is 500 ms. 3.6 s lands inside the held gold, not after it.
  await page.waitForTimeout(3600);
  const atSolved = await read();
  const shotSolved = await shot();

  const oklchOf = (css) => {
    const p = parseCss(css);
    if (!p) return null;
    const o = rgbToOklch(p.r, p.g, p.b);
    return { css, L: +o.L.toFixed(4), C: +o.C.toFixed(4), h: +o.h.toFixed(1) };
  };
  out[scheme] = {
    atFull: { ...atFull, gridLine: oklchOf(atFull.gridLineStroke), trace: oklchOf(atFull.traceStroke) },
    atSolved: {
      ...atSolved,
      gridLine: oklchOf(atSolved.gridLineStroke),
      trace: oklchOf(atSolved.traceStroke),
    },
  };
  const a = out[scheme].atFull.trace;
  const b = out[scheme].atSolved.gridLine;
  out[scheme].handoff =
    a && b
      ? {
          traceHue: a.h,
          solvedFrameHue: b.h,
          dHue: +hueDist(a.h, b.h).toFixed(2),
          dL: +(b.L - a.L).toFixed(3),
          note: "same hue, one lightness tier apart = the ink is retraced by the wax",
        }
      : null;

  const W = 300;
  const tiles = [shotFull, shotSolved];
  const meta = await sharp(tiles[0]).metadata();
  const strip = await sharp({
    create: { width: W * 2 + 8, height: meta.height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .composite(tiles.map((t, i) => ({ input: t, left: i * (W + 8), top: 0 })))
    .png({ palette: true, quality: 80, effort: 9 })
    .toBuffer();
  writeFileSync(`${HERE}/frames/handoff-${scheme}.png`, strip);
  out[scheme].frameBytes = strip.length;
  await ctx.close();
}
await browser.close();
writeFileSync(`${HERE}/readings/handoff.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));

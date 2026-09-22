#!/usr/bin/env node
/** ACC-SIX pass-4 — the two REPLACEMENT crops (each retires a pass-3 crop; the wave's cap).
 *
 * A · `1-answer-and-arc-desk-light-chromium-fine.png` — RETIRES pass-3 frame 2
 *     (`2-solved-corner-desk-light-chromium.png`, whose caption claimed a violet the image did
 *     not contain). The solved board's stop-2 band AND the filled ring in ONE frame: the claim
 *     is "violet means the answer", and this is the frame that either shows it or does not.
 * B · `2-count-under-the-board-phone-light-webkit-coarse.png` — RETIRES pass-3 frame 1. Same
 *     pose, honestly labelled: 393×699 dpr 3 in a `hasTouch` context (the pass-3 frame was a
 *     fine-pointer viewport at phone size), and the arc is in frame above the line.
 *
 * usage: BASE=http://127.0.0.1:4237 node p4-crops.mjs <outdir>
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const DIR = process.argv[2];
if (!DIR) throw new Error("usage: BASE=… node p4-crops.mjs <outdir>");

// ── A ────────────────────────────────────────────────────────────────────────────────────────
{
  const b = await chromium.launch();
  const ctx = await b.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.getByLabel("Solve puzzle").click();
  await page.waitForTimeout(3500);
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(800);
  const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
  // The stop-2 band sits ~25 % along the gradient's diagonal: the upper-left third, with the
  // board's top frame edge (and the filled ring on it) inside the same crop.
  await page.screenshot({
    path: `${DIR}/1-answer-and-arc-desk-light-chromium-fine.png`,
    clip: {
      x: Math.round(box.x - 6),
      y: Math.round(box.y - 10),
      width: Math.round(box.width * 0.42),
      height: Math.round(box.height * 0.3),
    },
  });
  await ctx.close();
  await b.close();
  console.error("A done");
}

// ── B ────────────────────────────────────────────────────────────────────────────────────────
{
  const b = await webkit.launch();
  const ctx = await b.newContext({
    viewport: { width: 393, height: 699 },
    deviceScaleFactor: 3,
    hasTouch: true,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1200);
  const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
  if (!coarse) throw new Error("B: the coarse regime is not witnessed — not a phone frame");
  for (let k = 0; k < 2; k++) {
    const ok = await page.evaluate(() => {
      const i = Array.from(document.querySelectorAll(".sudoku-cell input")).find(
        (x) => !x.readOnly && !x.value,
      );
      if (!i) return false;
      i.focus();
      return true;
    });
    if (!ok) break;
    await page.keyboard.type("5");
    await page.waitForTimeout(200);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(400);
  const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
  const line = await page.locator(".margin-note-meta").boundingBox();
  await page.screenshot({
    path: `${DIR}/2-count-under-the-board-phone-light-webkit-coarse.png`,
    clip: {
      x: Math.round(box.x),
      y: Math.round(box.y + box.height - 70),
      width: Math.round(box.width),
      height: Math.round(line.y + line.height + 8 - (box.y + box.height - 70)),
    },
  });
  await ctx.close();
  await b.close();
  console.error("B done");
}

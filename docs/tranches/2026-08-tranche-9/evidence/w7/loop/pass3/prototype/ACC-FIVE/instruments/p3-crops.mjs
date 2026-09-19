#!/usr/bin/env node
/** ACC-FIVE pass-3 · the FOUR cited crops, and no more (chair §7).
 *  1 · the board's top-left at fills 5/50/99/won as ONE strip, light chromium — the lift.
 *  2 · the same strip DARK — the 1.037 decision, for the owner's eye.
 *  Each ≤150 KB. Fills are driven by HINT (correct digits) and the win by Solve.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";

const { chromium } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4236";
const DIR = process.argv[2];
if (!DIR) throw new Error("usage: node p3-crops.mjs <dir>");

const browser = await chromium.launch();
for (const scheme of ["light", "dark"]) {
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
  const clip = {
    x: Math.round(box.x - 12),
    y: Math.round(box.y - 14),
    width: 330,
    height: 210,
  };
  const panes = [];
  const grab = async (tag) => {
    panes.push({ tag, buf: await page.screenshot({ clip, type: "png" }) });
  };

  const hint = async (n) => {
    for (let i = 0; i < n; i++) {
      const ok = await page.evaluate(() => {
        const b = document.querySelector('[aria-label*="Hint" i]');
        if (!b || b.disabled) return false;
        b.click();
        return true;
      });
      if (!ok) break;
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.waitForTimeout(700);
  };
  const vn = () =>
    page.evaluate(() =>
      Number(document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow")),
    );

  await hint(1);
  await grab(`fill-${await vn()}`);
  await hint(12);
  await grab(`fill-${await vn()}`);
  await hint(26);
  await grab(`fill-${await vn()}`);
  await page.evaluate(() => document.querySelector('[aria-label="Solve puzzle"]')?.click());
  await page.waitForTimeout(2600);
  await grab(`won-${await vn()}`);

  const strip = await sharp({
    create: {
      width: clip.width * panes.length,
      height: clip.height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite(panes.map((p, i) => ({ input: p.buf, left: i * clip.width, top: 0 })))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  const out = `${DIR}/lift-${scheme}-chromium.png`;
  await sharp(strip).png({ compressionLevel: 9, palette: true }).toFile(out);
  console.error(`${out}  ${(strip.length / 1024).toFixed(1)} KB  panes=${panes.map((p) => p.tag).join(" ")}`);
  await ctx.close();
}
await browser.close();

/**
 * T9-W7 exec B1 — the DELTA crop: the Solve control wearing its tape.
 *
 * The tape is `opacity: 0` until the button is hovered or focused, so "at rest" would frame
 * an empty strip of paper. The frame is taken on HOVER, which is the only pose in which the
 * string this cure recut is legible at all. Crop only — no full viewport.
 *
 * usage: node tape-frame.mjs <baseURL> <outDir> <before|after>
 */
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [, , BASE, OUT, TAG] = process.argv;
mkdirSync(OUT, { recursive: true });
const CLIP = { x: 876, y: 620, width: 228, height: 112 };

for (const [name, engine] of [
  ['chromium', chromium],
  ['webkit', webkit],
]) {
  const browser = await engine.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForSelector('.sudoku-cell', { timeout: 20000 });
  await page.waitForTimeout(2500);
  await page.locator('button[aria-label="Solve puzzle"]').hover();
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, `${TAG}-1280-${name}-solve-tape.png`), clip: CLIP });
  console.log(`${TAG} ${name} ok`);
  await browser.close();
}

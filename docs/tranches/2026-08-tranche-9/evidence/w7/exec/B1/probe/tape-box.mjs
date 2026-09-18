/**
 * T9-W7 exec B1 — the Solve tape's own box.
 *
 * The rect census reads the whole tree; this reads the ONE box the cure claims: the washi
 * tape on the Solve button, at 1280x800 where `!mobile` renders it. Reports its rect, its
 * text, and the rect of the button that holds it (which must not move).
 *
 * usage: node tape-box.mjs <baseURL> <outFile>
 */
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const [, , BASE, OUT] = process.argv;
const rows = [];
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
  const btn = page.locator('button[aria-label="Solve puzzle"]');
  await btn.hover();
  await page.waitForTimeout(400);
  const data = await btn.evaluate((b) => {
    const tape = b.querySelector('.washi-label');
    const r = (el) => {
      const x = el.getBoundingClientRect();
      return [
        Math.round(x.x * 100) / 100,
        Math.round(x.y * 100) / 100,
        Math.round(x.width * 100) / 100,
        Math.round(x.height * 100) / 100,
      ];
    };
    const cs = tape ? getComputedStyle(tape) : null;
    return {
      button: r(b),
      tape: tape ? r(tape) : null,
      text: tape ? tape.textContent : null,
      opacity: cs ? cs.opacity : null,
      transform: cs ? cs.transform : null,
      clipPath: cs ? cs.clipPath : null,
    };
  });
  rows.push({ engine: name, ...data });
  console.log(name, JSON.stringify(data));
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(rows, null, 2) + '\n');

#!/usr/bin/env node
/** Crop A, RE-TAKEN. The first cut solved the board to get revealed digits and the trace in one
 *  frame; a SOLVED board retires the trace (`solve-success`), so the frame carried rainbow
 *  digits and no arc — the same failure the pass-3 critique booked against frame 2, from the
 *  other end. This cut photographs the claim that IS true on the surface: the answer's violet
 *  as the board's own gauge, mid-solve, with the count that teaches it in the same frame.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const DIR = process.argv[2];
const b = await pw.chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: "light", reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(`${BASE}/?size=3&difficulty=EASY`);
await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
await page.waitForTimeout(1200);
for (let k = 0; k < 10; k++) {
  const ok = await page.evaluate(() => {
    const i = Array.from(document.querySelectorAll(".sudoku-cell input")).find((x) => !x.readOnly && !x.value);
    if (!i) return false;
    i.focus();
    return true;
  });
  if (!ok) break;
  await page.keyboard.type("5");
  await page.waitForTimeout(150);
}
await page.evaluate(() => document.activeElement?.blur?.());
await page.waitForTimeout(700);
const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
await page.screenshot({
  path: `${DIR}/1-the-arc-desk-light-chromium-fine.png`,
  clip: { x: Math.round(box.x - 8), y: Math.round(box.y - 14), width: Math.round(box.width * 0.55), height: Math.round(box.height * 0.22) },
});
console.error("A2 done");
await ctx.close();
await b.close();

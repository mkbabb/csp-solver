/**
 * T9-W7 pass 3 · MRK-ABS RESEARCH · R6 — the ONE cited crop.
 *
 * 16x16, LIGHT (the theme the prototype's painted bytes make the near-merge, and the theme in
 * which pass 2 banked no board crop at all), chromium, dpr 3: the board's top-left corner with
 * cell 0 keyboard-focused. What it shows is R5's -7.80 px: the crayon ring's left stroke drawn
 * inside the graphite frame's own band, on the board's outer column, at HEAD 74a2b5d9.
 */
import { test } from "@playwright/test";

test("R6 · corner cell on the frame, light, 16x16", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 3,
  });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:4239/?size=4");
  await page.waitForSelector(".game-cell", { timeout: 30000 });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    (
      document.querySelectorAll<HTMLInputElement>(".game-cell .cell-native-input")[0] as HTMLInputElement
    )?.focus();
  });
  await page.keyboard.press("Shift");
  await page.waitForTimeout(500);
  const box = await page.evaluate(() => {
    const r = (document.querySelectorAll(".game-cell")[0] as HTMLElement).getBoundingClientRect();
    return { x: r.x - 14, y: r.y - 14, width: r.width + 40, height: r.height + 40 };
  });
  await page.screenshot({
    path: "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/MRK-ABS/readings/crop1-corner-frame-light-16x16-head.png",
    clip: box,
  });
  await ctx.close();
});

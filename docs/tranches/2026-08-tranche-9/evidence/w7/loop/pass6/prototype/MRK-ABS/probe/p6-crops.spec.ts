/** T9-W7 pass 6 · MRK-ABS — raw panels for the two lawful ballot pairs (one payload, one variable
 *  per adjacent pair). (1) the board ring, cell 0 of one 16×16 payload, keyboard focus, arms A | B |
 *  C, light and dark, DPR 2, PRM (the boil parked, so the grid's pose is not a variable). (2) the deck's centre card, PRM, light,
 *  the tree (offset 3) vs arm D (one declaration). Panels are composited and labelled offline. */
import { test, expect } from "@playwright/test";
import { mint, setTheme, settled } from "./p6-lib";
const RAW = process.env.RAW!;
test("panels", async ({ browser }, info) => {
  test.setTimeout(600000);
  const e = info.project.name;
  for (const [arm, url] of [["A", "http://127.0.0.1:4239"], ["B", "http://127.0.0.1:4241"], ["C", "http://127.0.0.1:4242"]] as const)
    for (const theme of ["light", "dark"] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce" }); const page = await ctx.newPage();
      await page.goto(`${url}/?size=4&board=${mint(4)}`);
      await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
      await setTheme(page, theme); await page.mouse.move(2, 790);
      await page.locator(".board-shell .game-cell .cell-native-input").nth(0).focus(); await page.keyboard.press("Shift");
      await expect.poll(() => page.evaluate(() => document.querySelectorAll(".game-cell:has(input:focus-visible)").length)).toBe(1);
      await settled(page);
      const b = (await page.locator(".board-shell .game-cell").nth(0).boundingBox())!;
      await page.screenshot({ path: `${RAW}/ring-${arm}-${theme}-${e}.png`, clip: { x: Math.floor(b.x - 8), y: Math.floor(b.y - 8), width: Math.ceil(b.width * 1.6 + 8), height: Math.ceil(b.height * 1.6 + 8) }, scale: "device" });
      await ctx.close();
    }
  for (const [arm, url] of [["tree", "http://127.0.0.1:4239"], ["D", "http://127.0.0.1:4244"]] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" }); const page = await ctx.newPage();
    await page.goto(`${url}/?view=gallery&size=3&board=${mint(3)}`);
    await expect(page.locator(".staging-band")).toBeVisible({ timeout: 30000 }); await settled(page);
    await setTheme(page, "light"); await page.mouse.move(2, 790);
    await page.locator(".gallery-viewport").focus(); await page.keyboard.press("Shift"); await settled(page);
    const c = (await page.locator(".game-card.is-center").boundingBox())!;
    await page.screenshot({ path: `${RAW}/deck-${arm}-light-${e}.png`, clip: { x: Math.floor(c.x - 14), y: Math.floor(c.y - 14), width: Math.ceil(c.width + 28), height: Math.ceil(c.height + 28) } });
    await ctx.close();
  }
});

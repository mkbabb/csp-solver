/** T9-W7 pass 6 · MRK-ABS — raw panels for two more lawful pairs (one payload, one variable, PRM):
 *  (3) the inset: cell 0 of one 16×16 payload, keyboard focus, the tree (0.86) vs arm I90 (0.90),
 *  light and dark, DPR 2; (4) law 39: the drawer tab focused, the tree (dashed currentColor) vs arm
 *  L39 (the rule deleted, the base token), light and dark, DPR 2. */
import { test, expect } from "@playwright/test";
import { mint, setTheme, settled } from "./p6-lib";
const RAW = process.env.RAW!;
test("panels 2", async ({ browser }, info) => {
  test.setTimeout(600000);
  const e = info.project.name;
  for (const [arm, url] of [["tree", "http://127.0.0.1:4239"], ["I90", "http://127.0.0.1:4246"]] as const)
    for (const theme of ["light", "dark"] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce" }); const page = await ctx.newPage();
      await page.goto(`${url}/?size=4&board=${mint(4)}`);
      await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
      await setTheme(page, theme); await page.mouse.move(2, 790);
      await page.locator(".board-shell .game-cell .cell-native-input").nth(17).focus(); await page.keyboard.press("Shift");
      await expect.poll(() => page.evaluate(() => document.querySelectorAll(".game-cell:has(input:focus-visible)").length)).toBe(1);
      await settled(page);
      const b = (await page.locator(".board-shell .game-cell").nth(17).boundingBox())!;
      await page.screenshot({ path: `${RAW}/inset-${arm}-${theme}-${e}.png`, clip: { x: Math.floor(b.x - b.width * 0.5), y: Math.floor(b.y - b.height * 0.5), width: Math.ceil(b.width * 2), height: Math.ceil(b.height * 2) }, scale: "device" });
      await ctx.close();
    }
  for (const [arm, url] of [["tree", "http://127.0.0.1:4239"], ["L39", "http://127.0.0.1:4247"]] as const)
    for (const theme of ["light", "dark"] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce" }); const page = await ctx.newPage();
      await page.goto(`${url}/?size=3&board=${mint(3)}`);
      await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBe(81);
      await setTheme(page, theme); await page.mouse.move(2, 790);
      await page.keyboard.press("Shift"); await page.locator("button.drawer-tab").first().focus(); await settled(page);
      const fv = await page.evaluate(() => document.activeElement?.matches(":focus-visible"));
      const b = (await page.locator("button.drawer-tab").first().boundingBox())!;
      await page.screenshot({ path: `${RAW}/tab-${arm}-${theme}-${e}.png`, clip: { x: Math.floor(b.x - 14), y: Math.floor(b.y - 14), width: Math.ceil(b.width + 28), height: Math.ceil(b.height + 28) }, scale: "device" });
      console.log(JSON.stringify({ arm, theme, fv, box: b }));
      await ctx.close();
    }
});

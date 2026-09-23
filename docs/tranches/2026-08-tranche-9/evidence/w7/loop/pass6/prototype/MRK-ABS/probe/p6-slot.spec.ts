/** T9-W7 pass 6 · MRK-ABS — the GameCard.vue comment's claim: HEAD's deck-card radius rounded the
 *  projected live board's clip (`.live-face-slot`, `border-radius: inherit`) on focus. Read the
 *  slot's computed radius and its parent chain, blurred and focused, entering the deck FROM a game
 *  (the live board projects, so NOT under PRM: `isLive` needs motion), lane vs 74a2b5d9. */
import { test, expect } from "@playwright/test";
import { mint, settled } from "./p6-lib";
test("live-face-slot radius", async ({ browser }, info) => {
  test.setTimeout(240000);
  for (const [arm, url] of [["lane", "http://127.0.0.1:4239"], ["HEAD", "http://127.0.0.1:4240"]] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage();
    await page.goto(`${url}/?size=3&board=${mint(3)}`);
    await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBe(81);
    await page.locator("button.logo-trigger").focus(); await page.keyboard.press("Enter");
    await expect(page.locator(".staging-band")).toBeVisible({ timeout: 20000 }); await settled(page);
    const read = () => page.evaluate(() => [...document.querySelectorAll(".live-face-slot")].map((s) => ({ r: getComputedStyle(s).borderRadius, inCentre: !!s.closest(".game-card.is-center"), parent: (s.parentElement?.getAttribute("class") || "").split(" ")[0], parentR: s.parentElement ? getComputedStyle(s.parentElement).borderRadius : null })));
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.()); await settled(page);
    const blurred = await read();
    await page.locator(".gallery-viewport").focus(); await page.keyboard.press("Shift"); await settled(page);
    const focused = await read();
    console.log(JSON.stringify({ engine: info.project.name, arm, blurred, focused }));
    await ctx.close();
  }
});

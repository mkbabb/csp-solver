import { test, expect, type Page } from "@playwright/test";
// PLR-PLACE pass 4 · the thin lap: where does a dismissing tap land when the sheet laps the board
// by 4.6 px (390×844, two at the table)? Taps at three depths inside the sheet, re-opened each time.
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await p.waitForTimeout(600); }
test("thin lap", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local"); await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await a.locator(".drawer-tab").first().click(); await a.waitForTimeout(700); await verb.click();
  await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); await a.waitForTimeout(700);
  const b = await ctx.newPage(); await b.goto(a.url()); await settled(b);
  await a.bringToFront(); await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(2);
  const out: unknown[] = [];
  for (const depth of [2, 6, 12, 24]) {
    for (const how of ["tap", "click"]) {
      await a.locator("[data-player-mark]:visible").tap(); await a.waitForTimeout(400);
      const g = await a.evaluate(() => { const s = document.querySelector("[data-lobby].is-open")!.getBoundingClientRect(); const top = Math.min(...[...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect().top)); return { bottom: s.bottom, gridTop: top, markFocused: !!document.activeElement?.hasAttribute("data-player-mark") }; });
      const y = g.bottom - depth, x = 60;
      const owner = await a.evaluate(([px, py]) => { const h = document.elementFromPoint(px, py); return h?.closest("[data-lobby]") ? "sheet" : h?.closest(".sudoku-cell") ? "cell" : h?.tagName; }, [x, y]);
      if (how === "tap") await a.touchscreen.tap(x, y); else await a.mouse.click(x, y);
      await a.waitForTimeout(300);
      const after = await a.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName);
      out.push({ depth, how, overBoard: y > g.gridTop, owner, markFocusedBefore: g.markFocused, after, shut: (await a.locator("[data-player-mark]:visible").getAttribute("aria-expanded")) === "false" });
      await a.evaluate(() => (document.activeElement as HTMLElement)?.blur());
    }
  }
  console.log(`PLC|${info.project.name}|thinlap|${JSON.stringify(out)}`);
  await ctx.close();
});

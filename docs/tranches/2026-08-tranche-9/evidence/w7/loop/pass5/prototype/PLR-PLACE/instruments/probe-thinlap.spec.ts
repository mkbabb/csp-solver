import { test, expect, type Page } from "@playwright/test";
// PLR-PLACE pass 5 · the thin lap (pass-4 gap 3, re-measured): where does a dismissing tap land when
// the sheet laps the board by ~4.6 px (390×844 coarse hasTouch, two at the table)? Taps and clicks
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await p.waitForTimeout(600); }
test("thin lap", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local"); await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await a.locator(".drawer-tab").first().click(); await a.waitForTimeout(800); await verb.click();
  await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); await a.waitForTimeout(800);
  const b = await ctx.newPage(); await b.goto(a.url()); await settled(b);
  await a.bringToFront(); await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(2);
  const coarse = await a.evaluate(() => matchMedia("(pointer: coarse)").matches);
  const out: unknown[] = [];
  for (const depth of [1, 2, 3, 4, 6, 12]) {
    for (const how of ["tap", "click"]) {
      await a.locator("[data-player-mark]:visible").tap(); await a.waitForTimeout(400);
      const g = await a.evaluate(() => { const s = document.querySelector("[data-lobby].is-open")!.getBoundingClientRect(); const top = Math.min(...[...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect().top)); return { bottom: +s.bottom.toFixed(2), gridTop: +top.toFixed(2), lap: +(s.bottom - top).toFixed(2) }; });
      const y = g.bottom - depth, x = 60;
      const owner = await a.evaluate(([px, py]) => { const h = document.elementFromPoint(px, py); return h?.closest("[data-lobby]") ? "sheet" : h?.closest(".sudoku-cell") ? "cell" : h?.tagName; }, [x, y]);
      if (how === "tap") await a.touchscreen.tap(x, y); else await a.mouse.click(x, y);
      await a.waitForTimeout(300);
      const after = await a.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName);
      out.push({ depth, how, lap: g.lap, overBoard: y > g.gridTop, owner, reachedCell: /^Row \d/.test(after ?? ""), shut: (await a.locator("[data-player-mark]:visible").getAttribute("aria-expanded")) === "false" });
      await a.evaluate(() => (document.activeElement as HTMLElement)?.blur());
    }
  }
  console.log(`PLC|${info.project.name}|thinlap|coarse=${coarse}|${JSON.stringify(out)}`);
  await ctx.close();
});

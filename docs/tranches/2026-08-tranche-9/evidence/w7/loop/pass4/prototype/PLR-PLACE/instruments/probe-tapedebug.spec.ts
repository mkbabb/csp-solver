import { test, expect, type Page } from "@playwright/test";
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await p.waitForTimeout(600); }
test("tape debug", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local"); await settled(a);
  await a.locator(".drawer-tab").first().click(); await a.waitForTimeout(700);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); await a.waitForTimeout(700);
  const b = await ctx.newPage(); await b.goto(a.url()); await settled(b);
  const empties = await b.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i, k) => ((i as HTMLInputElement).value ? -1 : k)).filter((k) => k >= 9 && k < 23));
  const out: unknown[] = [];
  for (const t of empties.slice(0, 4)) {
    await b.bringToFront();
    await b.locator(".sudoku-cell input").nth(t).tap(); await b.keyboard.type("5"); await b.waitForTimeout(300);
    await a.bringToFront(); await a.waitForTimeout(400);
    await a.evaluate(() => { const w = window as any; w.__tape = []; const t0 = performance.now(); const s = () => { w.__tape.push(document.querySelectorAll(".attribution-tape").length); if (performance.now() - t0 < 1200) setTimeout(s, 50); }; s(); });
    await a.locator(".sudoku-cell input").nth(t).tap(); await a.waitForTimeout(1300);
    out.push(await a.evaluate(() => (window as any).__tape.join("")));
    out.push(await a.evaluate((k) => ({ k, val: (document.querySelectorAll(".sudoku-cell input")[k] as HTMLInputElement).value, label: document.activeElement?.getAttribute("aria-label"), tape: document.querySelectorAll(".attribution-tape").length }), t));
  }
  console.log(`PLC|${info.project.name}|${JSON.stringify(out)}`);
});

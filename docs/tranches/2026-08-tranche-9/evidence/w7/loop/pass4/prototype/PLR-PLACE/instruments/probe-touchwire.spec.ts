import { test, expect, type Page } from "@playwright/test";
// PLR-PLACE pass 4 · what a TAPPED open says on the wire (the price of the touch-seam cure).
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await p.waitForTimeout(600); }
test("touch open on the wire", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local"); await settled(a);
  await a.locator(".drawer-tab").first().click(); await a.waitForTimeout(700);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); await a.waitForTimeout(700);
  const b = await ctx.newPage(); await b.goto(a.url()); await settled(b); await a.bringToFront();
  await a.evaluate(() => { const w = window as any; w.__f = []; const ch = new BroadcastChannel(`board:${new URL(location.href).searchParams.get("s")}`); ch.onmessage = (e) => w.__f.push(e.data); });
  await a.locator(".sudoku-cell input").nth(40).tap(); await a.waitForTimeout(500);
  await a.evaluate(() => ((window as any).__f as unknown[]).splice(0));
  await a.locator("[data-player-mark]:visible").tap(); await a.waitForTimeout(600);
  const r = await a.evaluate(() => ({ cur: ((window as any).__f as any[]).filter((f) => f?.kind === "cur").map((f) => f.data.p), open: document.querySelector("[data-player-mark]:not([aria-expanded='false'])") !== null }));
  // and B's chart: does A still have a dot?
  await b.bringToFront(); await b.locator("[data-player-mark]:visible").tap(); await b.waitForTimeout(500);
  const bDots = await b.locator("[data-lobby].is-open .chart-dot").count();
  console.log(`PLC|${info.project.name}|touchwire|${JSON.stringify({ ...r, bDotsForA: bDots })}`);
});

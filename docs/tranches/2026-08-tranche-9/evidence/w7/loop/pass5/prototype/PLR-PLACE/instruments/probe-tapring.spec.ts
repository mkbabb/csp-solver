import { test, expect, type Page } from "@playwright/test";
// PLR-PLACE pass 5 · why does a tapped open still ring you? Focus, the wire and the ring, step by step.
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await p.waitForTimeout(600); }
test("tap ring", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local"); await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await a.locator(".drawer-tab").first().click(); await a.waitForTimeout(800); await verb.click();
  await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); await a.waitForTimeout(800);
  const b = await ctx.newPage(); await b.goto(a.url()); await settled(b);
  await a.bringToFront(); await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(2);
  await b.evaluate(() => { const w = window as any; w.__cur = []; const ch = new BroadcastChannel(`board:${new URL(location.href).searchParams.get("s")}`); ch.onmessage = (e) => { if (e.data?.kind === "cur") w.__cur.push(e.data.data.p); }; });
  const act = () => a.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName);
  await a.locator(".sudoku-cell input").nth(30).tap(); await a.waitForTimeout(500);
  const s1 = { active: await act(), curs: await b.evaluate(() => (window as any).__cur.slice()) };
  await a.evaluate(() => { const w = window as any; w.__ev = []; for (const t of ["pointerdown", "mousedown", "focusout", "focusin", "click"]) document.addEventListener(t, (e) => w.__ev.push(`${t}:${(e.target as HTMLElement).tagName}${(e as any).pointerType ? "/" + (e as any).pointerType : ""}`), true); });
  await a.locator("[data-player-mark]:visible").tap(); await a.waitForTimeout(500);
  const s2 = { active: await act(), curs: await b.evaluate(() => (window as any).__cur.slice()), ev: await a.evaluate(() => (window as any).__ev), expanded: await a.locator("[data-player-mark]:visible").getAttribute("aria-expanded"), ring: await a.evaluate(() => document.querySelectorAll("[data-lobby].is-open .chart-self").length) };
  console.log(`TAPRING|${info.project.name}|${JSON.stringify({ s1, s2 })}`);
  await ctx.close();
});

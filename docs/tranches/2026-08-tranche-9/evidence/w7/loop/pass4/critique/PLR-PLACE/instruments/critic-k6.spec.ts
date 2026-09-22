import { test, expect, type Page } from "@playwright/test";
const BASE = process.env.CRIT_BASE ?? "http://127.0.0.1:4243";
const Q = "difficulty=EASY&wire=local";
async function settled(p: Page) { await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0); }
const mark = (p: Page) => p.locator("[data-player-mark]:visible");
// K6 · the CLOSE: does the chart leave before the sheet's fade does?
test("K6 close frames", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(`${BASE}/?size=3&${Q}`); await settled(a);
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(1);
  const b = await ctx.newPage(); await b.goto(a.url()); await settled(b);
  await b.locator(".sudoku-cell input").nth(30).click();
  await a.bringToFront(); await a.waitForTimeout(1200);
  await mark(a).click(); await a.waitForTimeout(500);
  await a.evaluate(() => {
    const w = window as any; w.__fr = [];
    const s = [...document.querySelectorAll("[data-lobby]")].find((e) => (e as HTMLElement).closest("[data-player-mark]")?.getBoundingClientRect().width !== 0 && e.getBoundingClientRect().width > 0) as HTMLElement
      ?? [...document.querySelectorAll("[data-lobby].is-open")][0] as HTMLElement;
    const t0 = performance.now();
    const tick = () => {
      const cs = getComputedStyle(s);
      w.__fr.push({ t: +(performance.now() - t0).toFixed(1), open: s.classList.contains("is-open"), h: +s.getBoundingClientRect().height.toFixed(2), op: +(+cs.opacity).toFixed(3), vis: cs.visibility, chart: !!s.querySelector(".place-chart") });
      if (performance.now() - t0 < 320) requestAnimationFrame(tick);
    };
    w.__go = () => requestAnimationFrame(tick);
  });
  await a.evaluate(() => (window as any).__go());
  await a.keyboard.press("Escape");
  await mark(a).evaluate((m) => (m as HTMLElement).getAttribute("aria-expanded"));
  await a.waitForTimeout(500);
  const fr = await a.evaluate(() => (window as any).__fr);
  // if Escape did not close (focus elsewhere), fall back to clicking the mark
  const closedByEsc = fr.some((f: any) => !f.open);
  console.log(`CRIT|${info.project.name}|K6|${JSON.stringify({ closedByEsc, frames: fr.filter((_: any, i: number) => i % 2 === 0).slice(0, 14) })}`);
  await ctx.close();
});

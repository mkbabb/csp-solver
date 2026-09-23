import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { appendFileSync } from "node:fs";
// PLR-PLACE pass-6 CRITIC probes. OUT = CRIT_OUT.
const OUT = process.env.CRIT_OUT ?? "/dev/null";
const log = (s: string) => { appendFileSync(OUT, s + "\n"); console.log(s); };
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const same = v === last; last = v; return same; }, { intervals: [150], timeout: 8000 }).toBe(true); }
async function settled(p: Page) { await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0); }
async function invite(p: Page) {
  const verb = p.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) { await p.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await verb.click();
  await expect.poll(() => p.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await p.locator(".drawer-tab").first().click(); await expect(p.locator("#controls-drawer .drawer-case")).toBeHidden(); }
  return p.url();
}
async function table(ctx: BrowserContext, n: number, fake = 0) {
  const a = await ctx.newPage(); await a.goto(`./?size=3&difficulty=EASY&wire=local`); await settled(a);
  const link = await invite(a); const pages = [a];
  for (let i = 1; i < n; i++) { const p = await ctx.newPage(); await p.goto(link); await settled(p); pages.push(p); }
  if (fake) await a.evaluate((ids) => { const room = new URL(location.href).searchParams.get("s")!; const ch = new BroadcastChannel(`board:${room}`); for (const id of ids) ch.postMessage({ kind: "hi", data: {}, from: id }); setTimeout(() => ch.close(), 0); }, Array.from({ length: fake }, (_, i) => `crit-${i}`));
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(n + fake);
  return pages;
}
const mark = (p: Page) => p.locator("[data-player-mark]:visible");
const read = (p: Page) => p.evaluate(() => { const shEl = document.querySelector("[data-lobby].is-open"); if (!shEl) return null; const sh = shEl.getBoundingClientRect(); const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0); const top = Math.min(...cells.map((c) => c.top)); const lapped = cells.filter((c) => c.left < sh.right && c.right > sh.left && c.top < sh.bottom && c.bottom > sh.top).length; return { H: +sh.height.toFixed(2), lap: +Math.max(0, sh.bottom - top).toFixed(2), lapped, chart: !!shEl.querySelector(".place-chart"), rows: shEl.querySelectorAll(".pl-row").length, more: shEl.querySelector(".pl-more")?.textContent?.trim() ?? "" }; });

test("EV · what a tap on the mark fires, 390x844 coarse", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const [a] = await table(ctx, 2);
  await a.evaluate(() => { const m = [...document.querySelectorAll("[data-player-mark]")].find((e) => (e as HTMLElement).getBoundingClientRect().width > 0)!; (window as any).__ev = []; for (const t of ["pointerdown", "pointerup", "touchend", "click"]) m.addEventListener(t, (e) => (window as any).__ev.push(`${t}:${e.constructor.name}:${(e as any).pointerType ?? "-"}`), { capture: true }); });
  await mark(a).tap();
  await expect(mark(a)).toHaveAttribute("aria-expanded", "true");
  // sleep-ok: the whole synthetic tap sequence (incl. a delayed click) must have drained
  await a.waitForTimeout(600);
  const ev = await a.evaluate(() => (window as any).__ev);
  log(`EV|${info.project.name}|open=${await mark(a).getAttribute("aria-expanded")}|${ev.join(" ")}`);
  await ctx.close();
});

for (const arm of ["rotate", "fresh"]) test(`ROT · landscape 844x390 open, then portrait 390x844 (${arm}), five at the table`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const [a] = await table(ctx, 2, 3);
  if (arm === "fresh") await a.setViewportSize({ width: 390, height: 844 });
  await mark(a).tap();
  await expect(a.locator("[data-lobby].is-open")).toBeVisible();
  await stable(() => read(a));
  const before = await read(a);
  if (arm === "rotate") { await a.setViewportSize({ width: 390, height: 844 }); await stable(() => read(a)); }
  const after = await read(a);
  log(`ROT|${info.project.name}|${arm}|open=${await mark(a).getAttribute("aria-expanded")}|before=${JSON.stringify(before)}|after=${JSON.stringify(after)}`);
  await ctx.close();
});

for (const arm of ["resize", "fresh"]) test(`RSZ · open at 390x860 two at the table, then 390x664 (${arm})`, async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 860 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const [a] = await table(ctx, 2);
  if (arm === "fresh") await a.setViewportSize({ width: 390, height: 664 });
  await mark(a).tap();
  await expect(a.locator("[data-lobby].is-open")).toBeVisible();
  await stable(() => read(a));
  const before = await read(a);
  if (arm === "resize") { await a.setViewportSize({ width: 390, height: 664 }); await stable(() => read(a)); }
  const after = await read(a);
  log(`RSZ|${process.env.ARM ?? "chart"}|${info.project.name}|${arm}|open=${await mark(a).getAttribute("aria-expanded")}|before=${JSON.stringify(before)}|after=${JSON.stringify(after)}`);
  await ctx.close();
});

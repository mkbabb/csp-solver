import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { appendFileSync } from "node:fs";
import { loadavg } from "node:os";
// PLR-PLACE pass-8 CRITIC: the band on the sheet's SIDE edges (row 14 reads the bottom edge only).
// A touch 1–6px beside the sheet's left/right edge, over the lapped board, and 1–3px inside it.
const OUT = process.env.C8_OUT!;
const ARM = process.env.C8_ARM ?? "?";
const line = (s: string) => { appendFileSync(OUT, s + "\n"); console.log(s); };
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol();
  await expect.poll(async () => { const v = JSON.stringify(await read()); const same = v === last; last = v; return same; }, { intervals: [200], timeout: 15000 }).toBe(true);
}
async function table(ctx: BrowserContext, size: number) {
  const a = await ctx.newPage();
  await a.goto(`/?size=${size}&difficulty=EASY&wire=local`);
  await a.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 90000 });
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled({ timeout: 30000 });
  const docked = !(await verb.isVisible());
  if (docked) { await a.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await verb.click();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); }
  const b = await ctx.newPage(); await b.goto(a.url()); await b.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 90000 });
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 30000 }).toBe(2);
  return a;
}
const mark = (p: Page) => p.locator("[data-player-mark]:visible");
const sheet = (p: Page) => p.locator("[data-lobby]:visible");

for (const [size, w, h] of [[3, 390, 664], [4, 390, 664]] as const) test(`side band ${size} ${w}x${h}`, async ({ browser }, info) => {
  test.setTimeout(400000);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const a = await table(ctx, size);
  const read: Record<string, string> = {};
  let geo: any = null;
  for (const [side, d] of [["R", -3], ["R", -1], ["R", 1], ["R", 2], ["R", 3], ["R", 6], ["L", -3], ["L", -1], ["L", 1], ["L", 2], ["L", 3], ["L", 6]] as const) {
    await a.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await mark(a).tap();
    await expect(sheet(a)).toBeVisible();
    await expect.poll(() => sheet(a).evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
    await stable(() => sheet(a).evaluate((e) => Math.round(e.getBoundingClientRect().right * 10)));
    geo = await sheet(a).evaluate((e) => {
      const s = e.getBoundingClientRect();
      const cs = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect());
      return { L: s.left, R: s.right, T: s.top, B: s.bottom, gL: Math.min(...cs.map((c) => c.left)), gR: Math.max(...cs.map((c) => c.right)), gT: Math.min(...cs.map((c) => c.top)) };
    });
    const y = Math.max(geo.gT + 4, geo.B - 12);
    const x = side === "R" ? geo.R + d : geo.L - d;
    const overBoard = x > geo.gL && x < geo.gR && y > geo.gT && y < geo.B;
    await a.touchscreen.tap(x, y);
    await expect(mark(a)).toHaveAttribute("aria-expanded", "false");
    const active = await a.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");
    read[`${side} ${d < 0 ? `in ${-d}` : `out ${d}`}px`] = `${/^Row \d/.test(active) ? "cell" : "none"}${overBoard ? "" : " (not over board)"}`;
  }
  line(`SIDE|${info.project.name}|${ARM}|${size === 4 ? "16x16" : "9x9"} ${w}x${h} coarse|load=${loadavg()[0].toFixed(1)}|geo=${JSON.stringify(Object.fromEntries(Object.entries(geo).map(([k, v]) => [k, +(v as number).toFixed(2)])))}|${JSON.stringify(read)}`);
  await ctx.close();
});

import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { appendFileSync } from "node:fs";
// PLR-PLACE pass 6 · 3C-4 under this rig: does the coarse attribution tape rise on a tapped peer
// digit (390×664 hasTouch, two at the table, dev `?wire=local`)? Four repeats of tap → read → tap
// away. On the tree (PLC_MARK=1) the mark is then tapped and the tape's stacking against the open
// sheet is read (the owner of the overlap's centre pixel). Runs on the tree's dev AND the control's.
const OUT = process.env.PLC_OUT!;
const MARK = process.env.PLC_MARK === "1";
const Q = "difficulty=EASY&wire=local";
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true); }
async function settled(p: Page) { await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0); }
async function invite(page: Page) {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) { await page.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await verb.click();
  await expect.poll(() => page.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await page.locator(".drawer-tab").first().click(); await expect(page.locator("#controls-drawer .drawer-case")).toBeHidden(); }
  return page.url();
}
const cell = (p: Page, i: number) => p.locator(".sudoku-cell input").nth(i);
test("3C-4 tape under the rig", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const a = await ctx.newPage(); await a.goto(`./?size=3&${Q}`); await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage(); await b.goto(link); await settled(b);
  await a.bringToFront(); await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(2);
  await b.bringToFront();
  const target = await b.evaluate(() => { const ins = [...document.querySelectorAll(".sudoku-cell input")] as HTMLInputElement[]; for (const r of [1, 2]) for (let c = 0; c < 5; c++) { const i = r * 9 + c; if (!ins[i].value && !ins[i].readOnly) return i; } return -1; });
  const away = await b.evaluate(() => { const ins = [...document.querySelectorAll(".sudoku-cell input")] as HTMLInputElement[]; for (let i = 80; i > 60; i--) if (!ins[i].value && !ins[i].readOnly) return i; return -1; });
  await cell(b, target).tap(); await b.keyboard.type("5");
  await a.bringToFront(); await expect.poll(() => cell(a, target).inputValue(), { timeout: 10000 }).toBe("5");
  const rises: boolean[] = [];
  for (let k = 0; k < 4; k++) {
    await cell(a, target).tap();
    rises.push(await expect.poll(() => a.locator(".attribution-tape").count(), { timeout: 2000 }).toBe(1).then(() => true, () => false));
    await cell(a, away).tap();
    await expect.poll(() => a.locator(".attribution-tape").count(), { timeout: 3000 }).toBe(0).catch(() => {});
  }
  let stack: unknown = null;
  if (MARK) {
    await cell(a, target).tap();
    const up = await expect.poll(() => a.locator(".attribution-tape").count(), { timeout: 2000 }).toBe(1).then(() => true, () => false);
    await a.locator("[data-player-mark]:visible").tap();
    await expect(a.locator("[data-player-mark]:visible")).toHaveAttribute("aria-expanded", "true");
    const sh = a.locator("[data-lobby].is-open");
    await stable(() => sh.evaluate((e) => [e.getBoundingClientRect().bottom, getComputedStyle(e).opacity]));
    stack = await a.evaluate((up) => {
      const s = document.querySelector("[data-lobby].is-open")!.getBoundingClientRect();
      const t = document.querySelector(".attribution-tape")?.getBoundingClientRect() ?? null;
      const active = document.activeElement?.getAttribute("aria-label")?.slice(0, 20) ?? document.activeElement?.tagName;
      if (!t) return { tapeBeforeMark: up, tapeAfterMark: false, active };
      const x0 = Math.max(s.left, t.left), x1 = Math.min(s.right, t.right), y0 = Math.max(s.top, t.top), y1 = Math.min(s.bottom, t.bottom);
      const overlap = x1 > x0 && y1 > y0;
      const hit = overlap ? document.elementFromPoint((x0 + x1) / 2, (y0 + y1) / 2) : null;
      return { tapeBeforeMark: up, tapeAfterMark: true, active, tape: [t.left, t.top, t.right, t.bottom].map((v) => +v.toFixed(1)), sheet: [s.left, s.top, s.right, s.bottom].map((v) => +v.toFixed(1)), overlap, owner: hit ? (hit.closest("[data-lobby]") ? "sheet" : hit.closest(".attribution-tape") ? "tape" : hit.tagName) : null };
    }, up);
  }
  const line = `TAPE|${info.project.name}|${process.env.PLC_PORT}|rises=${JSON.stringify(rises)}|${JSON.stringify(stack)}`;
  appendFileSync(OUT, line + "\n"); console.log(line);
  await ctx.close();
});

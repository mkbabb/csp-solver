import { test, expect, type Page, type Browser } from "@playwright/test";
import { writeFileSync } from "node:fs";
const PAYLOAD = process.env.PLR_PAYLOAD!, OUT = process.env.PLR_CROPS!, ARM = process.env.PLR_ARM ?? "x";
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true); }
async function room(page: Page, n: number) {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) { await page.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await verb.click();
  await expect.poll(() => page.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await page.locator(".drawer-tab").first().click(); await expect(page.locator("#controls-drawer .drawer-case")).toBeHidden(); }
  await page.evaluate((n) => { const r = new URL(location.href).searchParams.get("s")!; const ch = new BroadcastChannel(`board:${r}`); for (let i = 0; i < n; i++) ch.postMessage({ kind: "hi", data: {}, from: `frame-${i}` }); setTimeout(() => ch.close(), 0); }, n);
  await expect.poll(() => page.locator(".players-roster .player-row").count(), { timeout: 15000 }).toBe(n + 1);
}
const givens = (page: Page) => page.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")].map((i) => (/given clue/.test(i.getAttribute("aria-label") ?? "") && i.value ? i.value : "0")).join(""));
async function shoot(browser: Browser, o: { w: number; h: number; coarse: boolean; theme: "light" | "dark"; n: number; clip: { x: number; y: number; width: number; height: number }; file: string }) {
  const ctx = await browser.newContext({ viewport: { width: o.w, height: o.h }, hasTouch: o.coarse, colorScheme: o.theme });
  const p = await ctx.newPage();
  await p.goto(`/?size=3&difficulty=EASY&wire=local&board=${PAYLOAD}`);
  await settled(p);
  const g = await givens(p);
  await room(p, o.n);
  const mark = p.locator("[data-player-mark]:visible");
  await stable(() => mark.evaluate((e) => getComputedStyle(e).color));
  if (o.coarse) await mark.tap(); else await mark.click();
  const l = p.locator("[data-lobby].is-open");
  await expect(l).toBeVisible();
  await stable(() => l.evaluate((e) => getComputedStyle(e).opacity + getComputedStyle(e).transform + e.getBoundingClientRect().height));
  if (!o.coarse) await p.mouse.move(o.w - 5, o.h - 5);
  const read = await p.evaluate(() => ({ mark: getComputedStyle(document.querySelector("[data-player-mark]:not([style*='display: none'])")!).color, rows: [...document.querySelectorAll("[data-lobby].is-open .pl-row")].map((r) => getComputedStyle(r).color), state: document.querySelector("[data-lobby].is-open .pl-state")?.textContent, more: document.querySelector("[data-lobby].is-open .pl-more")?.textContent ?? "", coarse: matchMedia("(pointer: coarse)").matches }));
  writeFileSync(`${OUT}/${o.file}.png`, await p.screenshot({ clip: o.clip, scale: "css" }));
  console.log(`FRAME ${o.file} givens=${g.replace(/0/g, "").length} ${JSON.stringify(read)}`);
  await ctx.close();
}
test("f1 arm", async ({ browser }, info) => {
  test.skip(info.project.name !== "chromium");
  await shoot(browser, { w: 1280, h: 800, coarse: false, theme: "light", n: 2, clip: { x: 0, y: 0, width: 300, height: 190 }, file: `f1-${ARM}` });
});
test("phone dark", async ({ browser }, info) => {
  test.skip(info.project.name !== "chromium" || ARM !== "true");
  await shoot(browser, { w: 390, h: 664, coarse: true, theme: "dark", n: 6, clip: { x: 0, y: 0, width: 300, height: 200 }, file: "phone-dark" });
});

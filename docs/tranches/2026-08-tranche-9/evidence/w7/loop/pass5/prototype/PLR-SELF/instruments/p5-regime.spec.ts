/** PLR-SELF pass 5 — the space the sheet has, at six cells, seven at the table. */
import { test, expect, type Page } from "@playwright/test";
const SOLO = "/?size=3&difficulty=EASY&wire=local";
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function stable(read: () => Promise<number | string>) {
  let last: unknown = Symbol();
  await expect.poll(async () => { const v = await read(); const same = v === last; last = v; return same; }, { intervals: [150], timeout: 6000 }).toBe(true);
}
async function room(page: Page, peers: number) {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  let docked = false;
  if (!(await verb.isVisible())) {
    docked = true;
    await page.locator(".drawer-tab").first().click();
    await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top));
  }
  await verb.click();
  await expect.poll(() => page.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await page.keyboard.press("Escape"); }
  await page.evaluate((n) => {
    const r = new URL(location.href).searchParams.get("s")!;
    const ch = new BroadcastChannel(`board:${r}`);
    for (let i = 0; i < n; i++) ch.postMessage({ kind: "hi", data: {}, from: `p5-${i}` });
    setTimeout(() => ch.close(), 0);
  }, peers);
  await expect.poll(() => page.locator(".players-roster .player-row").count(), { timeout: 15000 }).toBe(peers + 1);
}
const CELLS: [number, number, boolean][] = [[1280, 800, false], [1280, 720, false], [390, 844, true], [390, 664, true], [844, 390, true], [812, 375, true]];
for (const [w, h, coarse] of CELLS)
  test(`space ${w}x${h} ${coarse ? "coarse" : "fine"}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse, isMobile: coarse && info.project.name === "chromium" ? true : undefined });
    const page = await ctx.newPage();
    await page.goto(SOLO);
    await settled(page);
    await room(page, 6);
    const m = page.locator("[data-player-mark]:visible");
    await m.click();
    const sheet = page.locator("[data-lobby].is-open:visible");
    await expect(sheet).toBeVisible();
    await stable(() => sheet.evaluate((e) => e.getBoundingClientRect().height));
    const r = await sheet.evaluate((el) => {
      const s = el.getBoundingClientRect();
      const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
      const g = { top: Math.min(...cells.map((c) => c.top)), left: Math.min(...cells.map((c) => c.left)), right: Math.max(...cells.map((c) => c.right)), bottom: Math.max(...cells.map((c) => c.bottom)) };
      const lapped = cells.filter((c) => c.left < s.right && c.right > s.left && c.top < s.bottom && c.bottom > s.top).length;
      return { coarse: matchMedia("(pointer: coarse)").matches, rows: el.querySelectorAll(".pl-row").length, more: el.querySelector(".pl-more")?.textContent?.trim() ?? "", sTop: +s.top.toFixed(1), sBot: +s.bottom.toFixed(1), sRight: +s.right.toFixed(1), sH: +s.height.toFixed(2), gTop: +g.top.toFixed(1), gLeft: +g.left.toFixed(1), gRight: +g.right.toFixed(1), gBot: +g.bottom.toFixed(1), vh: innerHeight, lapped, cells: cells.length, belowSheet: +(innerHeight - s.top).toFixed(1), bw: getComputedStyle(el).borderTopWidth, frame: el.querySelectorAll(".head-sheet-edge .outline-svg path").length };
    });
    console.log(`REGIME ${info.project.name} ${w}x${h} ${JSON.stringify(r)}`);
    await ctx.close();
  });

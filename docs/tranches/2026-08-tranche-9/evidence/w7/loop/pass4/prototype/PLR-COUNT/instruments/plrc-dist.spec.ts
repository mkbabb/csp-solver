/** PLR-COUNT pass-4 — the filter census on BUILT dists: this tree (4231) vs the HEAD control
 *  (4230), a room of five with the sheet open, both regimes. Counts elements whose OWN computed
 *  filter is not `none` and display is not `none` (filter-census.spec's counting rule), and the
 *  distinct `url(#…)` ids among them (pass 3's 11-vs-9 reading, reconciled here). */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
const BOARD =
  "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const census = (page: Page) =>
  page.evaluate(() => {
    let elements = 0;
    const ids = new Set<string>();
    let inMark = 0;
    for (const el of document.querySelectorAll<Element>("*")) {
      const cs = getComputedStyle(el);
      if (cs.filter === "none" || cs.display === "none") continue;
      elements++;
      for (const m of cs.filter.matchAll(/url\(["']?#([^)"']+)/g)) ids.add(m[1]);
      if (el.closest("[data-player-mark], [data-lobby]")) inMark++;
    }
    return { elements, urlIds: [...ids].sort(), inMark };
  });
for (const reduced of [false, true]) {
  test(`dist census${reduced ? " PRM" : ""}`, async ({ browser, browserName }) => {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    const out: Record<string, unknown> = {};
    for (const [arm, base] of [["control", "http://127.0.0.1:4230"], ["proto", "http://127.0.0.1:4231"]]) {
      const page = await ctx.newPage();
      const room = `dist-${arm}-${Date.now()}`;
      await page.goto(`${base}/?size=3&board=${BOARD}&wire=local&s=${room}`);
      await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
      await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
      await page.waitForTimeout(1500);
      const idle = await census(page);
      await page.evaluate((room) => {
        const ch = new BroadcastChannel(`board:${room}`);
        for (let i = 0; i < 4; i++) ch.postMessage({ kind: "hi", data: {}, from: `d-${i}` });
      }, room);
      await page.waitForTimeout(1500);
      const mark = page.locator("[data-player-mark]:visible").first();
      if (await mark.count()) await mark.click();
      await page.waitForTimeout(500);
      const open = await census(page);
      const script = await page.evaluate(() =>
        [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s)) ?? null,
      );
      out[arm] = { script, idle, roomOfFiveSheetOpen: open };
    }
    await ctx.close();
    writeFileSync(`${process.env.PLRC_OUT}/dist-census-${browserName}${reduced ? "-prm" : ""}.json`, JSON.stringify(out, null, 1));
  });
}

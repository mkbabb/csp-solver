/**
 * MRK-ABS pass-2 (PROTOTYPE) · THE PRICE OF THE PINNED SEGMENT COUNT.
 *
 * `gridPaths.ts` no longer derives the ring's segment count from `boardSize` (it was
 * `boardSize >= 16 ? 2 : 4`), which is what makes ONE target serve three boards. 16×16 is where
 * that is paid: 256 cells whose `d` strings double. Two readings the synthesis priced on paper
 * and this takes off the running product:
 *
 *   MA-D  resident `d` bytes across every ghost path, per size.
 *   MA-E  the phone's frames at 16×16 (MA-6 only walks 9×9, where the point count did not move).
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1400);
}

test("MA-D resident ghost `d` bytes per size", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  const rows: unknown[] = [];
  for (const [label, q] of [
    ["4x4", "?size=2&difficulty=EASY"],
    ["9x9", "?size=3&difficulty=EASY"],
    ["16x16", "?size=4&difficulty=EASY"],
  ] as const) {
    await boardReady(page, q);
    const r = await page.evaluate(() => {
      const ps = Array.from(document.querySelectorAll(".cell-ghost-path"));
      let bytes = 0;
      let nodes = 0;
      for (const p of ps) {
        const d = p.getAttribute("d") || "";
        bytes += d.length;
        nodes += (d.match(/[ML]/g) || []).length;
      }
      return {
        paths: ps.length,
        totalDBytes: bytes,
        meanDBytes: Math.round(bytes / (ps.length || 1)),
        meanNodesPerPath: Math.round((nodes / (ps.length || 1)) * 10) / 10,
      };
    });
    rows.push({ label, ...r });
  }
  bank(`dbytes-${browserName}.json`, { engine: browserName, rows });
  console.log("DBYTES " + JSON.stringify(rows));
  expect(rows.length).toBe(3);
});

test("MA-E THE PHONE'S FRAMES AT 16×16 — arrow traversal, 393×699 dpr3", async ({
  browser,
  browserName,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 393, height: 699 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page, "?size=4&difficulty=EASY");
  await page.evaluate(() => {
    const i = document.querySelectorAll<HTMLInputElement>(".game-cell input")[40];
    i?.focus();
  });
  await page.evaluate(() => {
    (window as any).__f = [];
    let last = performance.now();
    const tick = (t: number) => {
      (window as any).__f.push(t - last);
      last = t;
      (window as any).__raf = requestAnimationFrame(tick);
    };
    (window as any).__raf = requestAnimationFrame(tick);
  });
  for (let i = 0; i < 24; i++) {
    await page.keyboard.press(i % 2 ? "ArrowLeft" : "ArrowRight");
    await page.waitForTimeout(60);
  }
  const frames = await page.evaluate(() => {
    cancelAnimationFrame((window as any).__raf);
    const f = ((window as any).__f as number[]).slice(1);
    const sorted = [...f].sort((a, b) => a - b);
    return {
      n: f.length,
      medianMs: Math.round(sorted[Math.floor(sorted.length / 2)] * 100) / 100,
      p95Ms: Math.round(sorted[Math.floor(sorted.length * 0.95)] * 100) / 100,
      maxMs: Math.round(sorted[sorted.length - 1] * 100) / 100,
      over33: f.filter((d) => d > 33).length,
    };
  });
  bank(`frames-phone-16x16-${browserName}.json`, { engine: browserName, frames });
  console.log("FRAMES16 " + JSON.stringify(frames));
  expect(frames.n).toBeGreaterThan(20);
  await ctx.close();
});

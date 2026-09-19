#!/usr/bin/env node
// The tongue's swap frame, rects and all: what moved, when, and what was over it.
import { chromium, webkit } from "playwright";
import process from "node:process";
const BASE = process.argv[2] ?? "http://127.0.0.1:4246/";
const ENGINE = process.argv[3] ?? "chromium";
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  hasTouch: true,
  isMobile: ENGINE === "chromium" ? true : undefined,
});
const page = await ctx.newPage();
await page.addInitScript(`
window.__s = (ms) => new Promise((res) => {
  const out = []; const t0 = performance.now();
  const tick = (ts) => {
    const t = document.querySelector('.drawer-tab');
    const s = document.querySelector('.scene-controls');
    const rt = t && t.getBoundingClientRect(); const rs = s && s.getBoundingClientRect();
    out.push({ t: +(ts - t0).toFixed(1),
      tab: rt ? [+rt.left.toFixed(1), +rt.top.toFixed(1), +rt.width.toFixed(1), +rt.height.toFixed(1)] : null,
      parent: t && t.parentElement ? (t.parentElement.id || t.parentElement.className || '').slice(0, 24) : null,
      sheet: rs ? [+rs.left.toFixed(1), +rs.top.toFixed(1), +rs.width.toFixed(1), +rs.height.toFixed(1)] : null });
    if (ts - t0 < ms) requestAnimationFrame(tick); else res(out);
  };
  requestAnimationFrame(tick);
});`);
await page.goto(BASE + "?size=3&difficulty=EASY");
await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
await page.waitForTimeout(1500);
const tab = page.locator(".drawer-tab").first();
for (const leg of ["open", "close"]) {
  const s = page.evaluate((ms) => window.__s(ms), 1200);
  await tab.click({ force: true });
  const frames = await s;
  await page.waitForTimeout(400);
  console.log(`--- ${ENGINE} ${leg} ---`);
  let prev = null;
  for (const f of frames) {
    if (!f.tab) continue;
    if (prev) {
      const d = Math.hypot(f.tab[0] - prev[0], f.tab[1] - prev[1]);
      if (d > 4) {
        const [tx, ty, tw, th] = f.tab, [sx, sy, sw, sh] = f.sheet ?? [0, 0, 0, 0];
        const inside = tx >= sx - 1 && ty >= sy - 1 && tx + tw <= sx + sw + 1 && ty + th <= sy + sh + 1;
        console.log(`  t=${f.t}ms move=${d.toFixed(1)}px tab=[${f.tab}] parent=${f.parent} sheet=[${f.sheet}] tabInsideSheet=${inside}`);
      }
    }
    prev = f.tab;
  }
}
await browser.close();

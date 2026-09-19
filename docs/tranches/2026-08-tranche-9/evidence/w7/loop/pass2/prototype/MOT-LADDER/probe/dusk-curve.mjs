#!/usr/bin/env node
// The dusk's RESOLVED timing function, before and after. `--ease-dusk` carries CSS `ease`'s
// own control points, so the paint must be the same function under a house name.
import { chromium, webkit } from "playwright";
const BASE = process.argv[2] ?? "http://127.0.0.1:4246/";
const ENGINE = process.argv[3] ?? "chromium";
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(BASE + "?size=3&difficulty=EASY");
await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
await page.waitForTimeout(1200);
const out = await page.evaluate(() => {
  document.documentElement.classList.add("theme-turning");
  const read = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return { sel, found: false };
    const cs = getComputedStyle(el);
    return {
      sel,
      found: true,
      dur: cs.transitionDuration,
      tf: cs.transitionTimingFunction,
      prop: cs.transitionProperty,
    };
  };
  const r = ["body", ".controls-card", ".action-bar"].map(read);
  document.documentElement.classList.remove("theme-turning");
  return r;
});
for (const r of out) console.log(`${ENGINE} ${r.sel.padEnd(16)} ${r.found ? `${r.prop} | ${r.dur} | ${r.tf}` : "not found"}`);
await browser.close();

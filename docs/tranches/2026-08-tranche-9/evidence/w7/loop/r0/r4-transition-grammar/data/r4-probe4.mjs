#!/usr/bin/env node
// T9-W7 R4 scratch probe 4 — the gallery EXIT's board mover: created, but does it PLAY?
// Keeps a handle on every Animation the product creates and polls its playState/currentTime
// each frame. Read-only on the product.

import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const BASE = "http://127.0.0.1:4231/";
const OUT = process.argv[2] ?? "/tmp/r4-probe4.json";

const HOOK = `
window.__A = [];
const orig = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  const a = orig.call(this, kf, opts);
  let cls = null; try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute && this.getAttribute('class')); } catch {}
  window.__A.push({ a, cls: String(cls||'').slice(0,50), born: +performance.now().toFixed(1), samples: [] });
  return a;
};
window.__Aclear = () => { window.__A = []; };
window.__Awatch = (ms) => new Promise((res) => {
  const t0 = performance.now();
  const step = () => {
    const now = +(performance.now() - t0).toFixed(1);
    for (const rec of window.__A) {
      let ct = null; try { ct = rec.a.currentTime; } catch {}
      let tr = null; try { const e = rec.a.effect; const el = e && e.target; if (el) tr = getComputedStyle(el).transform.slice(0, 48); } catch {}
      rec.samples.push({ t: now, st: rec.a.playState, ct: ct == null ? null : +Number(ct).toFixed(1), tr });
    }
    if (performance.now() - t0 < ms) requestAnimationFrame(step);
    else res(window.__A.map((r) => ({ cls: r.cls, born: r.born, samples: r.samples.filter((_, i) => i % 3 === 0 || i === r.samples.length - 1) })));
  };
  requestAnimationFrame(step);
});
`;

const browser = await (process.env.ENGINE === "webkit" ? webkit : chromium).launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: Number(process.env.VW ?? 390), height: Number(process.env.VH ?? 844) },
  deviceScaleFactor: Number(process.env.VW ?? 390) < 1024 ? 3 : 2,
  hasTouch: Number(process.env.VW ?? 390) < 1024,
  isMobile: Number(process.env.VW ?? 390) < 1024,
});
const page = await ctx.newPage();
await page.addInitScript(HOOK);
await page.goto(BASE + "?size=3&difficulty=EASY");
await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2000));
await page.evaluate(() => document.activeElement?.blur?.());

const out = {};
await page.evaluate("window.__Aclear()");
let w = page.evaluate("window.__Awatch(800)");
await page.keyboard.press("g");
out.enter = await w;
await new Promise((r) => setTimeout(r, 2200));

await page.evaluate("window.__Aclear()");
w = page.evaluate("window.__Awatch(800)");
await page.keyboard.press("Escape");
out.exit = await w;

writeFileSync(OUT, JSON.stringify(out, null, 2));
for (const [k, recs] of Object.entries(out)) {
  console.log("=== " + k);
  for (const r of recs) {
    console.log(`  .${r.cls} born@${r.born}`);
    console.log("    " + r.samples.map((s) => `${s.t}:${s.st}/${s.ct}`).join(" "));
    console.log("    tr " + r.samples.slice(0, 8).map((s) => `${s.t}:${s.tr}`).join(" | "));
  }
}
await browser.close();

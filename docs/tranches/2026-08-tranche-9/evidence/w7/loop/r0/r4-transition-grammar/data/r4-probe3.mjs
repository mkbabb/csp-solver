#!/usr/bin/env node
// T9-W7 R4 scratch probe 3 — WHO gets a mover, and when.
// Hooks Element.prototype.animate (page-side, read-only) so every WAAPI mover the product
// creates is logged with its target, keyframes and timing. Answers: does the gallery EXIT
// ever hand `.board-peek-host` a mover at 390x844?

import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const BASE = "http://127.0.0.1:4231/";
const OUT = process.argv[2] ?? "/tmp/r4-probe3.json";

const HOOK = `
window.__mv = [];
window.__mvMark = (m) => window.__mv.push({ mark: m, t: +performance.now().toFixed(1) });
const orig = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  let cls = null; try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute && this.getAttribute('class')); } catch {}
  window.__mv.push({
    t: +performance.now().toFixed(1),
    tag: this.tagName, cls: String(cls || '').slice(0, 60),
    kf: JSON.stringify(kf).slice(0, 220),
    opts: JSON.stringify(opts).slice(0, 160),
  });
  return orig.call(this, kf, opts);
};
window.__peek = () => ({
  peek: document.querySelectorAll('.board-peek-host').length,
  center: document.querySelectorAll('.game-card.is-center').length,
  view: document.documentElement.className,
});
`;

const browser = await chromium.launch({ headless: true });
const out = {};
for (const vp of [
  { w: 390, h: 844, name: "390x844-phone", mobile: true },
  { w: 1440, h: 900, name: "1440x900-desk", mobile: false },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.mobile ? 3 : 2,
    hasTouch: vp.mobile,
    isMobile: vp.mobile,
  });
  const page = await ctx.newPage();
  await page.addInitScript(HOOK);
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.evaluate(() => { window.__mv = []; });

  const log = [];
  const step = async (mark, fn, wait = 1600) => {
    await page.evaluate((m) => window.__mvMark(m), mark);
    await fn();
    await new Promise((r) => setTimeout(r, wait));
    log.push({ mark, dom: await page.evaluate("window.__peek()") });
  };

  await page.evaluate(() => document.activeElement?.blur?.());
  await step("drawer-toggle-open", () => page.locator(".drawer-tab").first().click({ force: true }));
  await step("drawer-toggle-close", () => page.locator(".drawer-tab").first().click({ force: true }));
  await step("gallery-enter", () => page.keyboard.press("g"), 2000);
  await step("card-step-right", () => page.keyboard.press("ArrowRight"), 1400);
  await step("gallery-exit-escape", () => page.keyboard.press("Escape"), 2000);
  await page.evaluate(() => document.activeElement?.blur?.());
  await step("gallery-enter-2", () => page.keyboard.press("g"), 2000);
  await step("gallery-exit-select", () => page.locator("#gallery-card-0").click({ force: true }), 2000);

  out[vp.name] = { movers: await page.evaluate(() => window.__mv), dom: log };
  await ctx.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 2));
for (const [k, v] of Object.entries(out)) {
  console.log("=== " + k);
  for (const m of v.movers) {
    if (m.mark) console.log(`  --- ${m.mark} @${m.t}`);
    else console.log(`      t${m.t} <${m.tag}> .${m.cls} ${m.opts}\n           ${m.kf}`);
  }
  console.log("  DOM:", JSON.stringify(v.dom));
}
await browser.close();

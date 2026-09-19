#!/usr/bin/env node
/**
 * THE DECLARED EXIT vs THE ONE THAT RUNS (T9-W7 pass 2 · MOT-LADDER research)
 *
 * MOT-LADDER's pass-1 choreography table banks `gallery OUT — board + wordmark unfold,
 * throw · glass`. W8 §8.1 measured the gallery exit as "UNDEFINED, and BROKEN: the board
 * never travels; no beat 0; no un-deal ... NO TRAVEL 3/3, every engine". Both cannot be
 * true. This reads every WAAPI mover the exit starts, with its keyframes and clock, on
 * the served dist — enter the gallery, then leave it both ways (select and cancel).
 *
 * Read-only against a served dist; writes only its own JSON.
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4246/";
const OUT = process.argv[2] ?? "/tmp/exit-travel.json";
const ENGINE = process.argv.find((a) => a.startsWith("--engine="))?.split("=")[1] ?? "chromium";

const HOOK = `
window.__mv = [];
const orig = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  let cls = ''; try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute && this.getAttribute('class')) || ''; } catch {}
  window.__mv.push({ t: +performance.now().toFixed(1), cls: String(cls).slice(0, 48),
    kf: JSON.stringify(kf), dur: opts && opts.duration, easing: opts && opts.easing, fill: opts && opts.fill });
  return orig.call(this, kf, opts);
};
`;

const RUNNING = `() => document.getAnimations().map(a => ({
  name: (a.animationName || (a.effect && a.effect.target && ((a.effect.target.className && String(a.effect.target.className).slice(0,40)) || a.effect.target.tagName)) || '?'),
  dur: a.effect && a.effect.getTiming && a.effect.getTiming().duration,
  easing: a.effect && a.effect.getTiming && a.effect.getTiming().easing,
  type: a.constructor.name,
}))`;

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch({ headless: true });
const out = { meta: { engine: ENGINE, base: BASE, when: new Date().toISOString() }, runs: [] };

for (const vp of [
  { name: "1440x900", w: 1440, h: 900, dsf: 2, mobile: false },
  { name: "390x844", w: 390, h: 844, dsf: 3, mobile: true },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.dsf,
    hasTouch: vp.mobile,
    isMobile: ENGINE === "chromium" ? vp.mobile : undefined,
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  await page.addInitScript(HOOK);
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(1500);

  const run = { viewport: vp.name, phases: [] };
  const snap = async (label, waitMs) => {
    const before = await page.evaluate(() => window.__mv.length);
    return async () => {
      await page.waitForTimeout(80);
      const running = await page.evaluate(`(${RUNNING})()`);
      await page.waitForTimeout(waitMs);
      const movers = (await page.evaluate(() => window.__mv)).slice(before);
      run.phases.push({ label, runningAt80ms: running, movers });
    };
  };

  await page.evaluate(() => document.activeElement?.blur?.());
  let done = await snap("gallery-ENTER", 1600);
  await page.keyboard.press("g");
  await done();

  done = await snap("gallery-EXIT-cancel", 1600);
  await page.keyboard.press("Escape");
  await done();

  // re-enter and leave by selecting the centre card
  await page.waitForTimeout(600);
  await page.keyboard.press("g");
  await page.waitForTimeout(1600);
  done = await snap("gallery-EXIT-select", 1600);
  await page.keyboard.press("Enter");
  await done();

  out.runs.push(run);
  await ctx.close();
}
await browser.close();
writeFileSync(OUT, JSON.stringify(out, null, 2));

const travel = (kf) => {
  const m = /translate(?:X|Y)?\(([^)]+)\)/.exec(kf || "");
  if (!m) return null;
  const parts = m[1].split(",").map((t) => (t.includes("%") ? 0 : parseFloat(t) || 0));
  const isY = /translateY/.test(kf);
  const [a, b] = parts.length === 2 ? parts : isY ? [0, parts[0]] : [parts[0], 0];
  return +Math.hypot(a, b).toFixed(1);
};
for (const r of out.runs)
  for (const p of r.phases) {
    console.log(`\n${ENGINE} ${r.viewport} ${p.label} — ${p.movers.length} WAAPI mover(s)`);
    for (const m of p.movers)
      console.log(`    ${String(m.cls).split(" ")[0].padEnd(24)} travel=${travel(m.kf)}px dur=${m.dur} fill=${m.fill} ease=${String(m.easing).slice(0, 34)}`);
    console.log(`    running at +80ms: ${p.runningAt80ms.map((a) => `${a.name}/${a.dur}/${String(a.easing).slice(0, 22)}`).join(" · ") || "(none)"}`);
  }

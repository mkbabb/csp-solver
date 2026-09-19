#!/usr/bin/env node
/**
 * T9-W7 pass 2 · MOT-LADDER — THE CRITIC'S OWN RUNTIME READ (independent of the lane's
 * instruments). One engine per run, chunked so no run outlives the harness's silence window.
 *
 *  publisher   — the <style data-motion-rungs> node count, the seven rungs at :root under
 *                no-preference and under reduce, --default-transition-duration, and the
 *                resolved transition-duration on a real .transition-colors element.
 *  dock        — the sheet's travel + worst 60Hz frame at 390x844 / 768x1024, the desk's
 *                clock at 1440x900, and the WAAPI clock each run actually asked for.
 *  tongue      — the drawer tab's per-frame rect over an open at 390x844.
 *
 * Usage: node critic-probe.mjs --engine=chromium --base=http://127.0.0.1:4244/ --out=f.json
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const arg = (k, d) =>
  process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=").slice(1).join("=") ?? d;
const ENGINE = arg("engine", "chromium");
const BASE = arg("base", "http://127.0.0.1:4244/");
const OUT = arg("out", `/tmp/critic-${ENGINE}.json`);
const launcher = ENGINE === "webkit" ? webkit : chromium;

const HOOK = `
window.__anims = [];
const __oa = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  let cls = ''; try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute && this.getAttribute('class')) || ''; } catch {}
  window.__anims.push({ t: +performance.now().toFixed(1), cls: String(cls).slice(0,60), dur: opts && opts.duration, easing: opts && opts.easing });
  return __oa.call(this, kf, opts);
};
window.__trace = (sel, ms) => new Promise((res) => {
  const out = []; const t0 = performance.now();
  const tick = (ts) => {
    const el = document.querySelector(sel);
    const r = el && el.getBoundingClientRect();
    out.push({ t: +(ts - t0).toFixed(2), x: r ? +r.left.toFixed(2) : null, y: r ? +r.top.toFixed(2) : null, h: r ? +r.height.toFixed(2) : null });
    if (ts - t0 < ms) requestAnimationFrame(tick); else res(out);
  };
  requestAnimationFrame(tick);
});
`;

function hz60(s) {
  const pts = s.filter((p) => p.y != null);
  if (pts.length < 2) return { n: pts.length, travel: 0, worst: 0 };
  const at = (t) => {
    if (t <= pts[0].t) return pts[0];
    for (let i = 1; i < pts.length; i++)
      if (pts[i].t >= t) {
        const a = pts[i - 1], b = pts[i], k = (t - a.t) / (b.t - a.t || 1);
        return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
      }
    return pts[pts.length - 1];
  };
  const end = pts[pts.length - 1].t;
  const f = [];
  for (let t = 16.67; t <= end; t += 16.67) {
    const p = at(t), q = at(t - 16.67);
    f.push(+Math.hypot(p.x - q.x, p.y - q.y).toFixed(1));
  }
  return {
    n: pts.length,
    travel: +Math.hypot(pts.at(-1).x - pts[0].x, pts.at(-1).y - pts[0].y).toFixed(1),
    worst: f.length ? Math.max(...f) : 0,
    over40: f.filter((x) => x > 40).length,
  };
}

async function open(browser, w, h, { reduce = false, theme = "light", mobile = true } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: mobile ? 3 : 2,
    hasTouch: mobile,
    isMobile: ENGINE === "chromium" ? mobile : undefined,
    colorScheme: theme,
    reducedMotion: reduce ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.addInitScript(HOOK);
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(1400);
  return { ctx, page };
}

const out = { meta: { engine: ENGINE, base: BASE, when: new Date().toISOString() }, publisher: [], dock: [], tongue: null };
const browser = await launcher.launch({ headless: true });

/* ── publisher ─────────────────────────────────────────────────────────────── */
for (const reduce of [false, true]) {
  const { ctx, page } = await open(browser, 390, 844, { reduce });
  out.publisher.push(
    await page.evaluate((reduce) => {
      const cs = getComputedStyle(document.documentElement);
      const names = ["whisper", "leave", "note", "dusk", "step", "throw", "rise"];
      const el = document.querySelector(".transition-colors");
      const inline = document.documentElement.getAttribute("style") || "";
      return {
        reduce,
        nodes: document.querySelectorAll("style[data-motion-rungs]").length,
        rungs: Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(`--motion-${n}`).trim()])),
        defaultTier: cs.getPropertyValue("--default-transition-duration").trim(),
        inlineHasMotion: /--motion-/.test(inline),
        transitionColors: el ? { cls: el.className.slice(0, 50), dur: getComputedStyle(el).transitionDuration } : null,
        iconBtn: document.querySelector(".icon-btn")
          ? getComputedStyle(document.querySelector(".icon-btn")).transitionDuration
          : null,
      };
    }, reduce),
  );
  await ctx.close();
}

/* ── dock / desk ───────────────────────────────────────────────────────────── */
for (const [w, h, mobile] of [[390, 844, true], [768, 1024, true], [1440, 900, false]]) {
  const { ctx, page } = await open(browser, w, h, { mobile });
  await page.evaluate(() => (window.__anims = []));
  const tracePromise = page.evaluate(() => window.__trace(".controls-card", 1400));
  const tab = page.locator(".drawer-tab").first();
  if (await tab.count()) await tab.click({ force: true });
  const trace = await tracePromise;
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => ({
    anims: window.__anims.filter((a) => a.dur >= 100),
    running: document.getAnimations().filter((a) => a.playState === "running").length,
    rest: (() => {
      const el = document.querySelector(".controls-card");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
    })(),
  }));
  out.dock.push({ pose: `${w}x${h}`, ...hz60(trace), clocks: after.anims.map((a) => a.dur), runningAfter700: after.running, rest: after.rest });
  await ctx.close();
}

/* ── tongue ────────────────────────────────────────────────────────────────── */
{
  const { ctx, page } = await open(browser, 390, 844, {});
  const tracePromise = page.evaluate(() => window.__trace(".drawer-tab", 1400));
  const tab = page.locator(".drawer-tab").first();
  if (await tab.count()) await tab.click({ force: true });
  const trace = await tracePromise;
  const pts = trace.filter((p) => p.y != null);
  let worst = 0, worstT = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (d > worst) { worst = d; worstT = pts[i].t; }
  }
  out.tongue = { frames: pts.length, worstFrameToFramePx: +worst.toFixed(1), atMs: worstT, first6: pts.slice(0, 6) };
  await ctx.close();
}

await browser.close();
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("WROTE", OUT);

#!/usr/bin/env node
/**
 * TRAVEL PER GESTURE — the diagnostic MOT-DERIVE's research lane asked for and the family's
 * death left standing (r0 p2 promoted): for every FLIP gesture, on every viewport, in both
 * engines — how far does the thing actually move, on what clock, at what speed, and how big
 * is the FIRST FRAME the eye lands on.
 *
 * Two readings per gesture, and they answer different questions:
 *   · the KEYFRAME travel (hook on Element.prototype.animate) — what the product declared.
 *   · the SAMPLED travel (rAF rect walk on `.scene-controls`) — what the screen did, which is
 *     where `first frame px` and `peak px/frame` come from. A duration is auditioned against
 *     the second, never the first.
 *
 * THE AUDITION (--audition): one built dist, three dock clocks. An init hook rewrites
 * `duration` for `.scene-controls` movers ONLY, so the desk pose is provably untouched while
 * 520 (the desk's number, the control) / 600 / 680 are auditioned at the dock.
 *
 * Usage: node travel-per-gesture.mjs <out.json> [--engine chromium|webkit] [--audition]
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4246/";
const OUT = process.argv[2] ?? "/tmp/travel-per-gesture.json";
const ENGINE = (process.argv.find((a) => a.startsWith("--engine="))?.split("=")[1] ?? "chromium");
const AUDITION = process.argv.includes("--audition");

/** The animate() hook + the rAF rect sampler, armed before any app code runs. */
const HOOK = `
window.__mv = [];
const orig = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  let cls = ''; try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute && this.getAttribute('class')) || ''; } catch {}
  if (window.__dockMs && String(cls).includes('scene-controls') && opts && typeof opts === 'object') {
    opts = Object.assign({}, opts, { duration: window.__dockMs });
  }
  window.__mv.push({ t: +performance.now().toFixed(1), cls: String(cls).slice(0, 60),
    kf: JSON.stringify(kf), dur: opts && opts.duration, easing: opts && opts.easing });
  return orig.call(this, kf, opts);
};
window.__sample = (sel, ms) => new Promise((res) => {
  const el = document.querySelector(sel);
  if (!el) return res([]);
  const out = []; const t0 = performance.now();
  const tick = (ts) => {
    const r = el.getBoundingClientRect();
    out.push({ t: +(ts - t0).toFixed(2), x: +r.left.toFixed(2), y: +r.top.toFixed(2) });
    if (ts - t0 < ms) requestAnimationFrame(tick); else res(out);
  };
  requestAnimationFrame(tick);
});
`;

function walkStats(samples) {
  if (samples.length < 2) return { frames: samples.length };
  const d = [];
  for (let i = 1; i < samples.length; i++) {
    const dx = samples[i].x - samples[i - 1].x;
    const dy = samples[i].y - samples[i - 1].y;
    d.push({
      px: Math.hypot(dx, dy),
      dt: samples[i].t - samples[i - 1].t,
    });
  }
  const moving = d.filter((s) => s.px > 0.01);
  const total = Math.hypot(
    samples[samples.length - 1].x - samples[0].x,
    samples[samples.length - 1].y - samples[0].y,
  );
  const first = moving[0];
  const peak = moving.reduce((a, b) => (b.px / b.dt > a.px / a.dt ? b : a), { px: 0, dt: 1 });
  // WHAT A 60Hz SCREEN PAINTS. Headless rAF runs ~120Hz here (median frame 8.3ms), so a raw
  // per-frame figure is the instrument's cadence, not the phone's. Resample the position trace
  // at 16.67ms and read the per-frame displacement off THAT.
  const at = (t) => {
    if (t <= samples[0].t) return samples[0];
    for (let i = 1; i < samples.length; i++) {
      if (samples[i].t >= t) {
        const a = samples[i - 1], b = samples[i];
        const k = (t - a.t) / (b.t - a.t || 1);
        return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
      }
    }
    return samples[samples.length - 1];
  };
  const startT = samples[d.findIndex((s) => s.px > 0.01) + 1]?.t ?? samples[0].t;
  const endT = samples[samples.length - 1].t;
  const f60 = [];
  for (let t = startT; t + 16.67 <= endT; t += 16.67) {
    const a = at(t), b = at(t + 16.67);
    const px = Math.hypot(b.x - a.x, b.y - a.y);
    if (px > 0.01) f60.push(+px.toFixed(1));
  }
  return {
    frames: samples.length,
    sampledTravelPx: +total.toFixed(1),
    hz60: {
      firstFramePx: f60[0] ?? 0,
      maxPxPerFrame: f60.length ? Math.max(...f60) : 0,
      framesOver40px: f60.filter((x) => x > 40).length,
      frameCount: f60.length,
      strip: f60.slice(0, 8),
    },
    firstFramePx: first ? +first.px.toFixed(1) : 0,
    firstFrameDtMs: first ? +first.dt.toFixed(1) : 0,
    maxPxPerFrame: +Math.max(...moving.map((s) => s.px), 0).toFixed(1),
    framesOver40px: moving.filter((s) => s.px > 40).length,
    peakPxPerMs: +(peak.px / peak.dt).toFixed(3),
    movingFrames: moving.length,
    medianFrameMs: +moving.map((s) => s.dt).sort((a, b) => a - b)[Math.floor(moving.length / 2)]?.toFixed(1),
  };
}

/** Keyframe travel: the FROM transform's translate magnitude. */
function kfTravel(kf) {
  const m = /translate(?:X|Y)?\(([^)]+)\)/.exec(kf);
  if (!m) return null;
  // A PERCENTAGE IS NOT A TRAVEL: the tab's `translateY(-50%)` is a static centring offset that
  // both keyframes share (it only counter-SCALES). Reading it as 50px is the exact error the
  // family's own census warns about, so a % component contributes zero.
  const parts = m[1].split(",").map((t) => (t.includes("%") ? 0 : parseFloat(t) || 0));
  const isY = /translateY/.test(kf);
  const [a, b] = parts.length === 2 ? parts : isY ? [0, parts[0]] : [parts[0], 0];
  return +Math.hypot(a, b).toFixed(1);
}

const launcher = ENGINE === "webkit" ? webkit : chromium;
const browser = await launcher.launch({ headless: true });
const out = { meta: { engine: ENGINE, base: BASE, audition: AUDITION, when: new Date().toISOString() }, runs: [] };

const VIEWPORTS = [
  // THE BAND ENDS. `dockGlideMs` governs every viewport <1024 in both orientations
  // (`rowRegime` = `(min-width: 1024px)`). Pass 1 auditioned ONE pose (390x844).
  { name: "768x1024", w: 768, h: 1024, dsf: 2, mobile: true },  // the FAST end — 681px
  { name: "390x844", w: 390, h: 844, dsf: 3, mobile: true },    // the audited pose — 628px
  { name: "844x390", w: 844, h: 390, dsf: 3, mobile: true },    // the SLOW end — 302px
  { name: "1440x900", w: 1440, h: 900, dsf: 2, mobile: false }, // the desk control
];
const DOCK_MS = AUDITION ? [520, 600, 680] : [null];

for (const vp of VIEWPORTS) {
  for (const dockMs of DOCK_MS) {
    if (dockMs !== null && !vp.mobile) continue; // the audition is the DOCK's; the desk is untouched
    for (const theme of ["light"]) {
      const ctx = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: vp.dsf,
        hasTouch: vp.mobile,
        isMobile: ENGINE === "chromium" ? vp.mobile : undefined,
        colorScheme: theme,
      });
      const page = await ctx.newPage();
      await page.addInitScript(HOOK);
      if (dockMs !== null) await page.addInitScript(`window.__dockMs = ${dockMs};`);
      await page.goto(BASE + "?size=3&difficulty=EASY");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
      await page.waitForTimeout(1500);
      await page.evaluate(() => {
        window.__mv = [];
      });

      const run = { viewport: vp.name, theme, dockMs, gestures: [] };
      const tab = page.locator(".drawer-tab").first();
      const tabs = await page.locator(".drawer-tab").count();

      for (const [label, wait] of [
        ["drawer-open", 1400],
        ["drawer-close", 1400],
      ]) {
        const before = await page.evaluate(() => window.__mv.length);
        const sampling = page.evaluate(
          ([sel, ms]) => window.__sample(sel, ms),
          [".scene-controls", 1000],
        );
        await tab.click({ force: true });
        const samples = await sampling;
        await page.waitForTimeout(wait - 1000 + 300);
        const movers = (await page.evaluate(() => window.__mv)).slice(before).map((m) => ({
          cls: m.cls,
          dur: m.dur,
          travelPx: kfTravel(m.kf),
          pxPerMs: m.dur ? +(kfTravel(m.kf) / m.dur).toFixed(3) : null,
        }));
        run.gestures.push({ label, tabsFound: tabs, movers, sampled: walkStats(samples), samples });
      }

      // The card step — the third FLIP class, unclaimed by this family and measured to prove it.
      await page.evaluate(() => document.activeElement?.blur?.());
      const beforeG = await page.evaluate(() => window.__mv.length);
      await page.keyboard.press("g");
      await page.waitForTimeout(1600);
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(1200);
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(1200);
      const gal = (await page.evaluate(() => window.__mv)).slice(beforeG).map((m) => ({
        cls: m.cls,
        dur: m.dur,
        travelPx: kfTravel(m.kf),
        pxPerMs: m.dur ? +(kfTravel(m.kf) / m.dur).toFixed(3) : null,
      }));
      run.gestures.push({ label: "gallery-enter+card-step", movers: gal });

      out.runs.push(run);
      await ctx.close();
    }
  }
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
for (const r of out.runs) {
  for (const g of r.gestures) {
    const movers = g.movers
      .filter((m) => m.travelPx !== null)
      .map((m) => `${m.cls.split(" ")[0]} ${m.travelPx}px/${m.dur}ms=${m.pxPerMs}px/ms`)
      .join(" | ");
    console.log(
      `${ENGINE} ${r.viewport} ${r.theme}${r.dockMs ? ` dock=${r.dockMs}` : ""} ${g.label.padEnd(24)} ${movers}` +
        (g.sampled
          ? `  || sampled ${g.sampled.sampledTravelPx}px @60Hz first=${g.sampled.hz60.firstFramePx}px max=${g.sampled.hz60.maxPxPerFrame}px >40px:${g.sampled.hz60.framesOver40px}/${g.sampled.hz60.frameCount} strip=[${g.sampled.hz60.strip.join(" ")}] (rAF med ${g.sampled.medianFrameMs}ms)`
          : ""),
    );
  }
}
await browser.close();

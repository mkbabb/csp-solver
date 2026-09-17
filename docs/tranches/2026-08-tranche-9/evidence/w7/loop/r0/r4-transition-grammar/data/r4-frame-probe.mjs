#!/usr/bin/env node
// T9-W7 round zero, lane R4 — SCRATCH PROBE (read-only on the product).
// Frame-time distribution + layout/recalc attribution + the animation roster for every
// named transition, at 390x844, against the BUILT dist served on 127.0.0.1:4231.
//
// Answers M02's question — CURVE or FRAMES — by pairing a rAF delta histogram with a
// CDP Performance delta (LayoutCount / RecalcStyleCount) over the same window, and by
// sampling `document.getAnimations()` at six points so a mover that never arms is seen.

import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const BASE = "http://127.0.0.1:4231/";
const OUT = process.argv[2] ?? "/tmp/r4-frames.json";
const CPU = Number(process.env.CPU_THROTTLE ?? "1");

const ARM = `
window.__r4 = { t: [], gen: 0 };
window.__r4start = () => {
  const g = ++window.__r4.gen;
  window.__r4.t = [];
  const tick = (ts) => { if (window.__r4.gen !== g) return; window.__r4.t.push(ts); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};
window.__r4stop = () => { window.__r4.gen++; return window.__r4.t.slice(); };
window.__r4anims = () => document.getAnimations().map((a) => {
  const e = a.effect; const tm = e && e.getTiming ? e.getTiming() : {};
  let props = [];
  try { if (e && e.getKeyframes) { const ks = e.getKeyframes(); const s = new Set();
    for (const k of ks) for (const p of Object.keys(k)) if (!['offset','computedOffset','easing','composite'].includes(p)) s.add(p);
    props = [...s]; } } catch {}
  let cls = null;
  try { const t = e && e.target; cls = t ? (typeof t.className === 'string' ? t.className : (t.getAttribute && t.getAttribute('class'))) : null; } catch {}
  return { kind: a.constructor.name, name: a.animationName ?? a.transitionProperty ?? null,
           dur: tm.duration, easing: tm.easing, delay: tm.delay, props, cls: cls ? String(cls).slice(0,70) : null };
});
`;

function stats(ts) {
  const d = [];
  for (let i = 1; i < ts.length; i++) d.push(ts[i] - ts[i - 1]);
  if (!d.length) return { frames: ts.length };
  const s = [...d].sort((a, b) => a - b);
  const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  const span = ts[ts.length - 1] - ts[0];
  return {
    frames: ts.length,
    spanMs: +span.toFixed(1),
    fps: +((ts.length - 1) / (span / 1000)).toFixed(1),
    medianMs: +q(0.5).toFixed(2),
    p95Ms: +q(0.95).toFixed(2),
    maxMs: +s[s.length - 1].toFixed(2),
    over33: d.filter((x) => x > 33.4).length,
    over50: d.filter((x) => x > 50).length,
    over100: d.filter((x) => x > 100).length,
    longFrames: d.filter((x) => x > 33.4).map((x) => +x.toFixed(1)),
  };
}

const PERF_KEYS = [
  "LayoutCount",
  "RecalcStyleCount",
  "LayoutDuration",
  "RecalcStyleDuration",
  "ScriptDuration",
  "TaskDuration",
];

async function perf(cdp) {
  const { metrics } = await cdp.send("Performance.getMetrics");
  const o = {};
  for (const m of metrics) if (PERF_KEYS.includes(m.name)) o[m.name] = m.value;
  return o;
}

const perfDelta = (a, b) =>
  Object.fromEntries(PERF_KEYS.map((k) => [k, +(b[k] - a[k]).toFixed(4)]));

const SAMPLES = [30, 80, 160, 260, 400, 620, 900];

async function gesture(page, cdp, label, trigger, windowMs) {
  await page.evaluate("window.__r4start()");
  const p0 = await perf(cdp);
  const t0 = Date.now();
  await trigger();
  const roster = new Map();
  for (const at of SAMPLES) {
    if (at > windowMs) break;
    const wait = at - (Date.now() - t0);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    for (const a of await page.evaluate("window.__r4anims()")) {
      const key = `${a.kind}|${a.name}|${a.dur}|${a.easing}|${a.delay}|${a.props.join("+")}|${a.cls}`;
      if (!roster.has(key)) roster.set(key, { ...a, firstSeenMs: at });
    }
  }
  const wait = windowMs - (Date.now() - t0);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  const p1 = await perf(cdp);
  const ts = await page.evaluate("window.__r4stop()");
  return { label, windowMs, ...stats(ts), perf: perfDelta(p0, p1), roster: [...roster.values()] };
}

const results = [];
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  hasTouch: true,
  isMobile: true,
  reducedMotion: "no-preference",
});
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Performance.enable");
if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
await page.addInitScript(ARM);

await page.goto(BASE + "?size=3&difficulty=EASY");
await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2000));

const rest = (ms = 1200) => new Promise((r) => setTimeout(r, ms));
const blur = () => page.evaluate(() => document.activeElement?.blur?.());

results.push(await gesture(page, cdp, "idle-control", async () => {}, 900));
await rest(600);

const tab = page.locator(".drawer-tab");
results.push(await gesture(page, cdp, "dock-open-1", () => tab.first().click({ force: true }), 900));
await rest();
results.push(await gesture(page, cdp, "dock-close-1", () => tab.first().click({ force: true }), 900));
await rest();
results.push(await gesture(page, cdp, "dock-open-2", () => tab.first().click({ force: true }), 900));
await rest();
results.push(await gesture(page, cdp, "dock-close-2", () => tab.first().click({ force: true }), 900));
await rest();

const toggle = page.locator(".sun-moon-toggle");
results.push(await gesture(page, cdp, "theme-1-to-dark", () => toggle.first().click({ force: true }), 1400));
await rest(1500);
results.push(await gesture(page, cdp, "theme-2-to-light", () => toggle.first().click({ force: true }), 1400));
await rest(1500);
results.push(await gesture(page, cdp, "theme-3-to-dark-warm", () => toggle.first().click({ force: true }), 1400));
await rest(1500);
results.push(await gesture(page, cdp, "theme-4-to-light-warm", () => toggle.first().click({ force: true }), 1400));
await rest(1500);

await blur();
results.push(await gesture(page, cdp, "gallery-enter-1", () => page.keyboard.press("g"), 1400));
await rest(1800);
results.push(await gesture(page, cdp, "card-step-1", () => page.keyboard.press("ArrowRight"), 900));
await rest();
results.push(await gesture(page, cdp, "card-step-2", () => page.keyboard.press("ArrowLeft"), 900));
await rest();
results.push(
  await gesture(page, cdp, "gallery-exit-select", () => page.locator("#gallery-card-0").click({ force: true }), 1400),
);
await rest(2000);

await blur();
results.push(await gesture(page, cdp, "gallery-enter-2-warm", () => page.keyboard.press("g"), 1400));
await rest(1800);
results.push(await gesture(page, cdp, "gallery-exit-cancel", () => page.keyboard.press("Escape"), 1400));

const meta = {
  base: BASE,
  viewport: "390x844 dsf3 touch isMobile",
  cpuThrottle: CPU,
  ua: await page.evaluate(() => navigator.userAgent),
  when: new Date().toISOString(),
};
writeFileSync(OUT, JSON.stringify({ meta, results }, null, 2));
for (const r of results) {
  const { roster, longFrames, ...rest2 } = r;
  console.log(JSON.stringify({ ...rest2, long: longFrames, anims: roster.length }));
}
await browser.close();

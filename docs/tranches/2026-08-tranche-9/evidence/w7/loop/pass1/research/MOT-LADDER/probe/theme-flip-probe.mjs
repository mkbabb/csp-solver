#!/usr/bin/env node
// T9-W7 R4 scratch probe 2 — two questions the first probe opened:
//   A. the theme toggle's DIRECTION asymmetry (six alternating flips, 4x CPU)
//   B. the gallery EXIT's missing board mover (does `.board-peek-host` ever animate?)
// Read-only on the product.

import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4246/";
const OUT = process.argv[2] ?? "/tmp/r4-probe2.json";
const CPU = Number(process.env.CPU_THROTTLE ?? "4");

const ARM = `
window.__r4 = { t: [], gen: 0 };
window.__r4start = () => { const g = ++window.__r4.gen; window.__r4.t = [];
  const tick = (ts) => { if (window.__r4.gen !== g) return; window.__r4.t.push(ts); requestAnimationFrame(tick); };
  requestAnimationFrame(tick); };
window.__r4stop = () => { window.__r4.gen++; return window.__r4.t.slice(); };
// Every animation that EVER runs in a watch window, sampled once per rAF.
window.__r4watch = (ms) => new Promise((res) => {
  const seen = new Map(); const t0 = performance.now();
  const step = () => {
    for (const a of document.getAnimations()) {
      const e = a.effect; const tm = e && e.getTiming ? e.getTiming() : {};
      let cls = null; try { const t = e && e.target; cls = t ? (typeof t.className === 'string' ? t.className : (t.getAttribute && t.getAttribute('class'))) : null; } catch {}
      let props = []; try { if (e && e.getKeyframes) { const s = new Set(); for (const k of e.getKeyframes()) for (const p of Object.keys(k)) if (!['offset','computedOffset','easing','composite'].includes(p)) s.add(p); props = [...s]; } } catch {}
      const key = a.constructor.name + '|' + (a.animationName ?? a.transitionProperty ?? '') + '|' + tm.duration + '|' + tm.easing + '|' + tm.delay + '|' + props.join('+') + '|' + String(cls||'').slice(0,60);
      if (!seen.has(key)) seen.set(key, { at: +(performance.now()-t0).toFixed(1), kind: a.constructor.name,
        name: a.animationName ?? a.transitionProperty ?? null, dur: tm.duration, easing: tm.easing, delay: tm.delay, props, cls: String(cls||'').slice(0,60) });
    }
    if (performance.now() - t0 < ms) requestAnimationFrame(step); else res([...seen.values()]);
  };
  requestAnimationFrame(step);
});
`;

function stats(ts) {
  const d = [];
  for (let i = 1; i < ts.length; i++) d.push(ts[i] - ts[i - 1]);
  if (!d.length) return { frames: ts.length, starved: true };
  const s = [...d].sort((a, b) => a - b);
  const span = ts[ts.length - 1] - ts[0];
  return {
    frames: ts.length,
    spanMs: +span.toFixed(1),
    fps: +((ts.length - 1) / (span / 1000)).toFixed(1),
    medianMs: +s[Math.floor(s.length / 2)].toFixed(2),
    maxMs: +s[s.length - 1].toFixed(2),
    over33: d.filter((x) => x > 33.4).length,
    over100: d.filter((x) => x > 100).length,
    long: d.filter((x) => x > 33.4).map((x) => +x.toFixed(1)),
  };
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  hasTouch: true,
  isMobile: true,
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
await new Promise((r) => setTimeout(r, 2500));

const out = { meta: { cpu: CPU, viewport: "390x844 dsf3", when: new Date().toISOString() }, toggles: [], exit: {} };

// ── A. six alternating theme flips ────────────────────────────────────────
const toggle = page.locator(".sun-moon-toggle");
for (let i = 0; i < 6; i++) {
  const dir = (await page.evaluate(() => document.documentElement.classList.contains("dark")))
    ? "to-light"
    : "to-dark";
  await page.evaluate("window.__r4start()");
  await toggle.first().click({ force: true });
  await new Promise((r) => setTimeout(r, 1400));
  const ts = await page.evaluate("window.__r4stop()");
  out.toggles.push({ i, dir, ...stats(ts) });
  await new Promise((r) => setTimeout(r, 1600));
}

// ── B. the gallery exit's movers ──────────────────────────────────────────
await page.evaluate(() => document.activeElement?.blur?.());
const preEnter = await page.evaluate(() => ({
  peekHosts: document.querySelectorAll(".board-peek-host").length,
}));
const enterWatch = page.evaluate("window.__r4watch(900)");
await page.keyboard.press("g");
out.exit.enterRoster = await enterWatch;
await new Promise((r) => setTimeout(r, 2000));

const inDeck = await page.evaluate(() => ({
  peekHosts: document.querySelectorAll(".board-peek-host").length,
  centerCards: document.querySelectorAll(".game-card.is-center").length,
  centerRect: (() => {
    const c = document.querySelector(".game-card.is-center");
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
  })(),
}));
const exitWatch = page.evaluate("window.__r4watch(900)");
await page.keyboard.press("Escape");
out.exit.cancelRoster = await exitWatch;
await new Promise((r) => setTimeout(r, 1500));
const afterExit = await page.evaluate(() => ({
  peekHosts: document.querySelectorAll(".board-peek-host").length,
}));
out.exit.dom = { preEnter, inDeck, afterExit };

writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("TOGGLES");
for (const t of out.toggles) console.log(" ", JSON.stringify(t));
console.log("EXIT DOM", JSON.stringify(out.exit.dom));
console.log("ENTER ROSTER");
for (const a of out.exit.enterRoster)
  console.log(`  t+${a.at} ${a.kind} ${a.name} ${a.dur}ms ${a.easing} d${a.delay} [${a.props}] ${a.cls}`);
console.log("EXIT(cancel) ROSTER");
for (const a of out.exit.cancelRoster)
  console.log(`  t+${a.at} ${a.kind} ${a.name} ${a.dur}ms ${a.easing} d${a.delay} [${a.props}] ${a.cls}`);
await browser.close();

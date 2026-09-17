#!/usr/bin/env node
// RUN: cd web/frontend && node <thisfile> --port 4260 --throttle 4 --mode live|ablate --windows 3 --out <file.jsonl>
// T9-W8 §8.1 lane A5 REFUTER — the critical-path lens for finding 1.
// TWO questions the lane's probe does not separate:
//  (1) does the theme FLIP itself wait on the bake, or is only the ink late?
//      -> t_classFlip / t_bgPaint (background-color actually changed) / t_surfaceSwap
//         (the wordmark <img> src actually points at a NEW blob) are timed separately.
//  (2) is the bake the CAUSE of the starved whirl, or merely concurrent with it?
//      -> --mode ablate makes the encode free (toBlob calls back on a microtask with a
//         1x1 blob) WITHOUT touching source. If the whirl recovers and click->settle
//         collapses to the N2 number, the bake is causal. This is an ATTRIBUTION
//         ablation, not a cure candidate: it draws less, which the M09 law forbids.
import { appendFileSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/package.json")("playwright");

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const PORT = arg("port", "4260");
const THROTTLE = Number(arg("throttle", "4"));
const MODE = arg("mode", "live");
const WINDOWS = Number(arg("windows", "3"));
const OUT = arg("out", "/dev/stdout");
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;

const INIT = `
(() => {
  const P = (window.__P = { bakes: [], frames: [], flip: null, bgPaint: null, swaps: [], boardReady: null, marks: [] });
  const now = () => performance.now();
  const ABLATE = ${MODE === "ablate"};

  // ---- bake wrapper (same census as the lane's probe) + optional ABLATION ----
  const toBlob = HTMLCanvasElement.prototype.toBlob;
  let tiny = null;
  HTMLCanvasElement.prototype.toBlob = function (cb, ...rest) {
    const t0 = now(), w = this.width, h = this.height;
    if (ABLATE) {
      // free encode: hand back a 1x1 PNG blob on a microtask. Draws LESS on purpose.
      if (!tiny) { const c = document.createElement('canvas'); c.width = c.height = 1; tiny = null; }
      const b = new Blob([new Uint8Array([137,80,78,71,13,10,26,10])], { type: 'image/png' });
      Promise.resolve().then(() => { P.bakes.push({ t0, t1: now(), w, h, ablated: true }); cb(b); });
      return;
    }
    return toBlob.call(this, function (b) { P.bakes.push({ t0, t1: now(), w, h, bytes: b ? b.size : 0 }); return cb.apply(this, arguments); }, ...rest);
  };

  let last = null;
  const tick = (t) => { if (last !== null) P.frames.push({ t: +t.toFixed(2), d: +(t - last).toFixed(2) }); last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', () => P.marks.push({ m: 'visibilitychange', t: now() }));
  window.addEventListener('blur', () => P.marks.push({ m: 'blur', t: now() }));

  // ---- board-ready: the charter's ONE definition (same code as the lane's probe) ----
  const vis = (el) => !!(el && el.getClientRects().length && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden');
  const poll = () => {
    if (P.boardReady !== null) return;
    const bg = [...document.querySelectorAll('.board-group')].find(vis);
    if (bg) {
      const cell = [...bg.querySelectorAll('[class*="cell"]')].find((el) => {
        const toks = (el.getAttribute('class') || '').split(/\\s+/);
        if (!toks.some((t) => t === 'cell' || t.endsWith('-cell'))) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      if (cell) { requestAnimationFrame(() => { P.boardReady = now(); }); return; }
    }
    requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);

  // ---- the three visible marks, armed per click ----
  P.arm = (clickT) => {
    P.flip = null; P.bgPaint = null; P.swaps = [];
    const html = document.documentElement;
    const wasDark = html.classList.contains('dark');
    const bg0 = getComputedStyle(document.body).backgroundColor;
    // the wordmark's rendered <img> srcs at click time (the OLD baked poses)
    const imgs = () => [...document.querySelectorAll('img')].map((i) => i.currentSrc || i.src).filter((s) => s && s.startsWith('blob:'));
    const src0 = new Set(imgs());
    const step = () => {
      const t = now();
      if (P.flip === null && html.classList.contains('dark') !== wasDark) P.flip = t;
      if (P.bgPaint === null && getComputedStyle(document.body).backgroundColor !== bg0) P.bgPaint = t;
      if (P.swaps.length < 1) { const nu = imgs().filter((s) => !src0.has(s)); if (nu.length) P.swaps.push({ t, n: nu.length }); }
      if (t - clickT < 4000) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
})();
`;

const SETTLE_JS = `window.__P.settle = (clickT) => new Promise((resolve) => {
  const P = window.__P;
  const b0 = P.bakes.length, f0 = P.frames.length;
  const lastActivity = () => { let a = clickT;
    for (let i = b0; i < P.bakes.length; i++) a = Math.max(a, P.bakes[i].t1);
    for (let i = f0; i < P.frames.length; i++) if (P.frames[i].d > 33.4) a = Math.max(a, P.frames[i].t);
    return a; };
  let q = 0;
  const step = () => { const a = lastActivity(), n = performance.now();
    if (n - a >= 400) q++; else q = 0;
    if (q >= 2 && n - a >= 400 && n >= clickT + 1150) {
      resolve({ settleT: a, bakes: P.bakes.slice(b0), frames: P.frames.slice(f0), flip: P.flip, bgPaint: P.bgPaint, swaps: P.swaps.slice(), marks: P.marks.slice() }); return; }
    if (n - clickT > 12000) { resolve({ settleT: a, timeout: true, bakes: P.bakes.slice(b0), frames: P.frames.slice(f0), flip: P.flip, bgPaint: P.bgPaint, swaps: P.swaps.slice(), marks: P.marks.slice() }); return; }
    requestAnimationFrame(step); };
  requestAnimationFrame(step);
})`;

const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null; };
const browser = await chromium.launch();
const rows = [];
for (let w = 1; w <= WINDOWS; w++) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: "light" });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  if (THROTTLE > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
  await page.goto(URL_, { waitUntil: "load", timeout: 90000 });
  await page.waitForFunction("window.__P && window.__P.boardReady !== null", null, { timeout: 90000 });
  const boardReady = await page.evaluate(() => window.__P.boardReady);
  await page.waitForTimeout(2500);

  const inv = [];
  for (let n = 1; n <= 3; n++) {
    const clickT = await page.evaluate(() => {
      const t = performance.now();
      window.__P.arm(t);
      document.querySelector(".sun-moon-toggle").click();
      return t;
    });
    await page.evaluate(SETTLE_JS);
    const r = await page.evaluate((t) => window.__P.settle(t), clickT);
    const whirl = r.frames.filter((f) => f.t >= clickT && f.t <= clickT + 1100);
    inv.push({
      n,
      clickToSettleMs: +(r.settleT - clickT).toFixed(1),
      bakeCount: r.bakes.length,
      classFlipMs: r.flip === null ? null : +(r.flip - clickT).toFixed(1),
      bgPaintMs: r.bgPaint === null ? null : +(r.bgPaint - clickT).toFixed(1),
      inkSwapMs: r.swaps.length ? +(r.swaps[0].t - clickT).toFixed(1) : null,
      whirlFrames: whirl.length,
      whirlFps: whirl.length ? +(whirl.length / ((Math.max(...whirl.map((f) => f.t)) - clickT) / 1000)).toFixed(1) : null,
      whirlWorstMs: whirl.length ? +Math.max(...whirl.map((f) => f.d)).toFixed(1) : null,
      tainted: r.marks.length > 0 || r.frames.some((f) => f.d >= 1000 && f.d <= 1300),
    });
    await page.waitForTimeout(900);
  }
  await ctx.close();
  const row = { mode: MODE, throttle: THROTTLE + "x", win: w, boardReadyMs: +boardReady.toFixed(1), inv };
  rows.push(row);
  appendFileSync(OUT, JSON.stringify(row) + "\n");
  process.stderr.write(`win ${w} [${MODE}]: boardReady ${row.boardReadyMs} · ${inv.map((i) => `N${i.n}:${i.clickToSettleMs}ms/${i.bakeCount}b flip${i.classFlipMs} bg${i.bgPaintMs} ink${i.inkSwapMs} whirl${i.whirlFrames}f`).join("  ")}\n`);
}
await browser.close();
const S = { SUMMARY: true, mode: MODE, throttle: THROTTLE + "x", windows: rows.length,
  medBoardReadyMs: med(rows.map((r) => r.boardReadyMs)),
  inv: [1, 2, 3].map((n) => ({ n,
    medClickToSettleMs: med(rows.map((r) => r.inv[n - 1].clickToSettleMs)),
    medBakeCount: med(rows.map((r) => r.inv[n - 1].bakeCount)),
    medClassFlipMs: med(rows.map((r) => r.inv[n - 1].classFlipMs).filter((x) => x !== null)),
    medBgPaintMs: med(rows.map((r) => r.inv[n - 1].bgPaintMs).filter((x) => x !== null)),
    medInkSwapMs: med(rows.map((r) => r.inv[n - 1].inkSwapMs).filter((x) => x !== null)),
    inkSwapSeen: rows.filter((r) => r.inv[n - 1].inkSwapMs !== null).length + "/" + rows.length,
    medWhirlFrames: med(rows.map((r) => r.inv[n - 1].whirlFrames)),
    medWhirlFps: med(rows.map((r) => r.inv[n - 1].whirlFps).filter((x) => x !== null)),
    medWhirlWorstMs: med(rows.map((r) => r.inv[n - 1].whirlWorstMs)),
    anyTainted: rows.some((r) => r.inv[n - 1].tainted) })) };
appendFileSync(OUT, JSON.stringify(S) + "\n");
process.stderr.write(JSON.stringify(S) + "\n");

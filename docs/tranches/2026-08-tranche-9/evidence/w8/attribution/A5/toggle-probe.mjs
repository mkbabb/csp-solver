#!/usr/bin/env node
// RUN: cd web/frontend && node <thisfile> --engine chromium --throttle 4 --viewport desk --net fast3g --port 4254 --windows 3 --out <file.jsonl>
// T9-W8 §8.1 lane A5 — the dark toggle's first invocation. Cold load → board-ready → toggle ×N.
// Reads the FIXED dist through an already-running `vite preview`; NEVER builds.
import { appendFileSync } from "node:fs";
import { createRequire } from "node:module";
// resolved against the CWD (web/frontend), not this file's dir — the script banks under docs/
const { chromium, webkit } = createRequire(process.cwd() + "/package.json")("playwright");

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`);
  return i >= 0 ? argv[i + 1] : d;
};
const ENGINE = arg("engine", "chromium");
const THROTTLE = Number(arg("throttle", "1"));
const VIEWPORT = arg("viewport", "desk");
const NET = arg("net", "none"); // fast3g | none
const PORT = arg("port", "4254");
const WINDOWS = Number(arg("windows", "3"));
const TOGGLES = Number(arg("toggles", "4"));
const OUT = arg("out", "/dev/stdout");
const WARM = argv.includes("--warm"); // second navigation, cache enabled
const START_DARK = argv.includes("--startDark"); // boot IN dark, so the first toggle goes dark->light
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;

const VP =
  VIEWPORT === "mobile"
    ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 }
    : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 };

// ── The in-page instrument ───────────────────────────────────────────────────────────
// bakes  : every HTMLCanvasElement.toBlob / toDataURL, with the canvas box (the surface tell)
// frames : every rAF delta since navigationStart
// tasks  : PerformanceObserver('longtask') where the engine HAS it (chromium); webkit → null
// res    : PerformanceObserver('resource') — font/image re-fetch on the flip
const INIT = `
(() => {
  const A5 = (window.__A5 = {
    bakes: [], frames: [], tasks: [], res: [], marks: [],
    longtaskSupported: (() => { try { return (PerformanceObserver.supportedEntryTypes||[]).includes('longtask'); } catch { return false; } })(),
    fontsReady: null, boardReady: null, boardReadySel: null,
  });
  const now = () => performance.now();

  const toBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, ...rest) {
    const t0 = now(), w = this.width, h = this.height;
    return toBlob.call(this, function (b) {
      A5.bakes.push({ kind: 'toBlob', t0, t1: now(), w, h, bytes: b ? b.size : 0 });
      return cb.apply(this, arguments);
    }, ...rest);
  };
  const toDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function (...a) {
    const t0 = now(), w = this.width, h = this.height;
    const r = toDataURL.apply(this, a);
    A5.bakes.push({ kind: 'toDataURL', t0, t1: now(), w, h, bytes: r.length });
    return r;
  };

  let last = null;
  const tick = (t) => { if (last !== null) A5.frames.push({ t: +t.toFixed(2), d: +(t - last).toFixed(2) }); last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);

  if (A5.longtaskSupported) {
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) A5.tasks.push({ t: +e.startTime.toFixed(2), d: +e.duration.toFixed(2) }); }).observe({ entryTypes: ['longtask'] }); } catch {}
  }
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) A5.res.push({ t: +e.startTime.toFixed(2), d: +e.duration.toFixed(2), n: e.name.split('/').pop(), type: e.initiatorType, size: e.transferSize|0 }); }).observe({ entryTypes: ['resource'] }); } catch {}

  document.addEventListener('visibilitychange', () => A5.marks.push({ m: 'visibilitychange', t: now() }));
  window.addEventListener('blur', () => A5.marks.push({ m: 'blur', t: now() }));

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { A5.fontsReady = now(); });

  // BOARD-READY (the one definition for every lane): .board-group VISIBLE (v-show'n, both
  // control-panel twins are always mounted) AND the first .cell-class element's rect is
  // non-zero AND one rAF has fired after that.
  const vis = (el) => !!(el && el.getClientRects().length && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden');
  const poll = () => {
    if (A5.boardReady !== null) return;
    const bg = [...document.querySelectorAll('.board-group')].find(vis);
    if (bg) {
      // The FIRST .cell-class element with a non-zero rect. The literal first match inside
      // .board-group is an SVG 'grid-line cell-line' path whose rect is 0x0 forever, so the
      // non-zero clause selects the DigitCell family element (.game-cell/.sudoku-cell) —
      // the frozen DOM contract. The matched class travels with the reading.
      // token === 'cell' or ending '-cell' => the DigitCell family contract (.game-cell,
      // .sudoku-cell). '[class*="cell"]' alone matches the SVG 'cell-line' grid paths, which
      // are ink, not cells; the first of those is 0x0 and a later one is not, so a bare
      // substring match picks a different element run to run.
      const cell = [...bg.querySelectorAll('[class*="cell"]')].find((el) => {
        const toks = (el.getAttribute('class') || '').split(/\\s+/);
        if (!toks.some((t) => t === 'cell' || t.endsWith('-cell'))) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      if (cell) {
        A5.boardReadySel = (cell.getAttribute('class') || '').split(/\\s+/).find((t) => t === 'cell' || t.endsWith('-cell')) || '(unnamed)';
        requestAnimationFrame(() => { A5.boardReady = now(); });
        return;
      }
    }
    requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);
})();
`;

// ── settle, defined once ─────────────────────────────────────────────────────────────
// activity = a bake completion (t1), a long task end (t+d), or a frame delta > 33.4 ms.
// settle   = the LAST activity after the click, once QUIET ms have passed with no activity
//            AND >= 2 rAFs have fired since it. click->settle = settleT - clickT.
const QUIET = 400;
const SETTLE_JS = `window.__A5.settle = (clickT) => new Promise((resolve) => {
  const A5 = window.__A5;
  const b0 = A5.bakes.length, k0 = A5.tasks.length, f0 = A5.frames.length, r0 = A5.res.length;
  const lastActivity = () => {
    let a = clickT;
    for (let i = b0; i < A5.bakes.length; i++) a = Math.max(a, A5.bakes[i].t1);
    for (let i = k0; i < A5.tasks.length; i++) a = Math.max(a, A5.tasks[i].t + A5.tasks[i].d);
    for (let i = f0; i < A5.frames.length; i++) if (A5.frames[i].d > 33.4) a = Math.max(a, A5.frames[i].t);
    return a;
  };
  let quietFrames = 0;
  const step = () => {
    const a = lastActivity();
    const nowT = performance.now();
    if (nowT - a >= ${QUIET}) { quietFrames++; } else { quietFrames = 0; }
    if (quietFrames >= 2 && nowT - a >= ${QUIET} && nowT >= clickT + 1150) {
      resolve({
        settleT: a,
        bakes: A5.bakes.slice(b0),
        tasks: A5.tasks.slice(k0),
        frames: A5.frames.slice(f0),
        res: A5.res.slice(r0),
        longtaskSupported: A5.longtaskSupported,
        marks: A5.marks.slice(),
      });
      return;
    }
    if (nowT - clickT > 12000) { resolve({ settleT: a, timeout: true, bakes: A5.bakes.slice(b0), tasks: A5.tasks.slice(k0), frames: A5.frames.slice(f0), res: A5.res.slice(r0), longtaskSupported: A5.longtaskSupported, marks: A5.marks.slice() }); return; }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
})`;

const IDLE_CTRL = `window.__A5.idleCtrl = (ms) => new Promise((resolve) => {
  const A5 = window.__A5; const f0 = A5.frames.length; const t0 = performance.now();
  const step = () => {
    if (performance.now() - t0 >= ms) {
      const f = A5.frames.slice(f0);
      resolve({ frames: f.length, fps: +(f.length / ((performance.now() - t0) / 1000)).toFixed(1), long33: f.filter((x) => x.d > 33.4).length, worst: f.length ? +Math.max(...f.map((x) => x.d)).toFixed(1) : null });
      return;
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
})`;

const surfaceOf = (w, h) => {
  const ar = w / h;
  if (ar > 2) return "wordmark(logo)";
  if (Math.abs(ar - 1) < 0.02 && w >= 500) return "grid-hoist";
  if (Math.abs(ar - 1) < 0.02) return "celestial(toggle)";
  return `other ${w}x${h}`;
};

const sum = (a) => a.reduce((x, y) => x + y, 0);
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null; };

async function runWindow(browser, win) {
  const ctx = await browser.newContext({ ...VP, colorScheme: "light" });
  await ctx.addInitScript(INIT);
  if (START_DARK) await ctx.addInitScript("try{localStorage.setItem('sudoku-color-scheme','dark')}catch{}");
  const page = await ctx.newPage();

  let cdp = null;
  if (ENGINE === "chromium") {
    cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Performance.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: !WARM });
    if (NET === "fast3g") {
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    }
    if (THROTTLE > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
  }

  const nav0 = Date.now();
  await page.goto(URL_, { waitUntil: "load", timeout: 90000 });
  await page.waitForFunction("window.__A5 && window.__A5.boardReady !== null", null, { timeout: 90000 });
  await page.waitForTimeout(2500); // let the BOOT bakes finish before the census is taken
  const boot = await page.evaluate(() => ({
    boardReady: window.__A5.boardReady,
    boardReadySel: window.__A5.boardReadySel,
    fontsReady: window.__A5.fontsReady,
    bakes: window.__A5.bakes.map((b) => ({ ...b })),
    tasks: window.__A5.tasks.slice(),
    longtaskSupported: window.__A5.longtaskSupported,
    dpr: window.devicePixelRatio,
    darkRules: (() => { let n = 0; try { for (const ss of document.styleSheets) { let rs; try { rs = ss.cssRules; } catch { continue; } for (const r of rs) { const t = r.selectorText || ""; if (t.includes(".dark")) n++; } } } catch {} return n; })(),
  }));

  await page.evaluate(IDLE_CTRL);
  const idleCtrl = await page.evaluate(() => window.__A5.idleCtrl(1000));

  const invocations = [];
  for (let n = 1; n <= TOGGLES; n++) {
    let m0 = null;
    if (cdp) m0 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
    const clickT = await page.evaluate(() => {
      const btn = document.querySelector(".sun-moon-toggle");
      const t = performance.now();
      btn.click();
      return t;
    });
    await page.evaluate(SETTLE_JS);
    const r = await page.evaluate((t) => window.__A5.settle(t), clickT);
    let m1 = null;
    if (cdp) m1 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
    const dm = (k) => (m0 && m1 ? +(m1[k] - m0[k]).toFixed(4) : null);
    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    const whirl = r.frames.filter((f) => f.t >= clickT && f.t <= clickT + 1100);
    invocations.push({
      n,
      toTheme: isDark ? "dark" : "light",
      clickToSettleMs: +(r.settleT - clickT).toFixed(1),
      timeout: !!r.timeout,
      bakes: r.bakes.map((b) => ({ ...b, dur: +(b.t1 - b.t0).toFixed(1), rel: +(b.t0 - clickT).toFixed(1), surface: surfaceOf(b.w, b.h) })),
      bakeCount: r.bakes.length,
      bakeMs: +sum(r.bakes.map((b) => b.t1 - b.t0)).toFixed(1),
      longTasks: r.longtaskSupported ? r.tasks.map((t) => ({ rel: +(t.t - clickT).toFixed(1), d: t.d })) : null,
      longTaskMs: r.longtaskSupported ? +sum(r.tasks.map((t) => t.d)).toFixed(1) : null,
      whirlLong33: whirl.filter((f) => f.d > 33.4).length,
      whirlWorstMs: whirl.length ? +Math.max(...whirl.map((f) => f.d)).toFixed(1) : null,
      whirlFrames: whirl.length,
      whirlFps: whirl.length ? +(whirl.length / ((Math.max(...whirl.map((f) => f.t)) - clickT) / 1000)).toFixed(1) : null,
      resourcesFetched: r.res.map((x) => ({ n: x.n, type: x.type, size: x.size, d: +x.d.toFixed(1) })),
      cdp: m0 ? { recalcStyleCount: dm("RecalcStyleCount"), recalcStyleMs: +(dm("RecalcStyleDuration") * 1000).toFixed(1), layoutCount: dm("LayoutCount"), layoutMs: +(dm("LayoutDuration") * 1000).toFixed(1), scriptMs: +(dm("ScriptDuration") * 1000).toFixed(1), taskMs: +(dm("TaskDuration") * 1000).toFixed(1) } : null,
      tainted: r.marks.length > 0 || r.frames.some((f) => f.d >= 1000 && f.d <= 1300),
    });
    await page.waitForTimeout(900);
  }

  await ctx.close();
  return {
    idleCtrl,
    win, startTheme: START_DARK ? "dark" : "light", engine: ENGINE, throttle: ENGINE === "webkit" ? "1x (webkit: no CDP CPU throttling)" : THROTTLE + "x", viewport: VIEWPORT, net: ENGINE === "webkit" ? "unthrottled (webkit: no CDP net emulation)" : NET, cache: WARM ? "warm(2nd-nav,cache-on)" : (ENGINE === "webkit" ? "cold(fresh-context)" : "cold(CDP cache disabled)"),
    dpr: boot.dpr, navWallMs: Date.now() - nav0,
    boardReadyMs: +boot.boardReady.toFixed(1), boardReadySel: boot.boardReadySel,
    fontsReadyMs: boot.fontsReady === null ? null : +boot.fontsReady.toFixed(1),
    bootBakes: boot.bakes.map((b) => ({ ...b, dur: +(b.t1 - b.t0).toFixed(1), surface: surfaceOf(b.w, b.h) })),
    bootBakeCount: boot.bakes.length,
    bootLongTaskMs: boot.longtaskSupported ? +sum(boot.tasks.map((t) => t.d)).toFixed(1) : null,
    longtaskSupported: boot.longtaskSupported,
    darkRuleCount: boot.darkRules,
    invocations,
  };
}

const launcher = ENGINE === "webkit" ? webkit : chromium;
const browser = await launcher.launch();
const rows = [];
for (let w = 1; w <= WINDOWS; w++) {
  const r = await runWindow(browser, w);
  rows.push(r);
  appendFileSync(OUT, JSON.stringify(r) + "\n");
  process.stderr.write(`win ${w}: boardReady ${r.boardReadyMs}ms · toggles ${r.invocations.map((i) => `${i.n}:${i.clickToSettleMs}ms/${i.bakeCount}bakes`).join(" ")}\n`);
}
await browser.close();

const cell = (f) => med(rows.map(f));
const summary = {
  SUMMARY: true, startTheme: START_DARK ? "dark" : "light", engine: ENGINE, throttle: ENGINE === "webkit" ? "1x (webkit: no CDP CPU throttling)" : THROTTLE + "x", viewport: VIEWPORT, net: ENGINE === "webkit" ? "unthrottled (webkit: no CDP net emulation)" : NET, cache: WARM ? "warm(2nd-nav,cache-on)" : (ENGINE === "webkit" ? "cold(fresh-context)" : "cold(CDP cache disabled)"),
  windows: rows.length, longtaskSupported: rows[0].longtaskSupported,
  medBoardReadyMs: cell((r) => r.boardReadyMs),
  medBootBakeCount: cell((r) => r.bootBakeCount),
  medIdleCtrlFps: cell((r) => r.idleCtrl.fps),
  medIdleCtrlLong33: cell((r) => r.idleCtrl.long33),
  toggles: Array.from({ length: TOGGLES }, (_, i) => ({
    n: i + 1,
    toTheme: rows[0].invocations[i].toTheme,
    medClickToSettleMs: cell((r) => r.invocations[i].clickToSettleMs),
    medBakeCount: cell((r) => r.invocations[i].bakeCount),
    medBakeMs: cell((r) => r.invocations[i].bakeMs),
    medLongTaskMs: rows[0].longtaskSupported ? cell((r) => r.invocations[i].longTaskMs) : null,
    medWhirlLong33: cell((r) => r.invocations[i].whirlLong33),
    medWhirlWorstMs: cell((r) => r.invocations[i].whirlWorstMs),
    medWhirlFrames: cell((r) => r.invocations[i].whirlFrames),
    medWhirlFps: cell((r) => r.invocations[i].whirlFps),
    medRecalcStyleMs: rows[0].invocations[i].cdp ? cell((r) => r.invocations[i].cdp.recalcStyleMs) : null,
    medRecalcStyleCount: rows[0].invocations[i].cdp ? cell((r) => r.invocations[i].cdp.recalcStyleCount) : null,
    medLayoutMs: rows[0].invocations[i].cdp ? cell((r) => r.invocations[i].cdp.layoutMs) : null,
    medScriptMs: rows[0].invocations[i].cdp ? cell((r) => r.invocations[i].cdp.scriptMs) : null,
    anyTainted: rows.some((r) => r.invocations[i].tainted),
  })),
};
appendFileSync(OUT, JSON.stringify(summary) + "\n");
process.stderr.write(JSON.stringify(summary, null, 1) + "\n");

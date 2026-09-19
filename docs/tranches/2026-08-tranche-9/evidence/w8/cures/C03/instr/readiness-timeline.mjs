#!/usr/bin/env node
// RUN: cd web/frontend && npx vite preview --outDir dist --port 4390 --strictPort --host 127.0.0.1 &
//      node <this file> --base http://127.0.0.1:4390 --out readings.jsonl [--cells desk-cr-4x-f3g-cold,...]
//
// T9-W8 §8.1 lane A6 — THE READINESS TIMELINE.
// Reads, per cold page load: navigationStart -> first-paint -> FCP -> LCP -> board-ready
// -> controls-interactive (a REAL click on .drawer-tab / the mobile sheet handle, timed to
// the panel's own transition-visible state) -> first bake mounted -> first boil tick
// -> TBT within the first 3000 ms (chromium longtask only) -> main-thread busy to board-ready.
//
// BOARD-READY, the one W8 definition: `.board-group` VISIBLE (it is v-show'n; both
// control-panel twins are always mounted, so presence is not enough) AND the first
// `.cell`-class element's getBoundingClientRect() has non-zero size AND one rAF has fired
// after that. Timestamped performance.now() relative to navigationStart.
//
// FIRST BOIL TICK, production-visible tell (window.__schedulerDebug is DEV-only and absent
// from the built dist): HandDrawnGrid mounts `frameCount` sibling boil layers and moves the
// `is-active` class between them on every beat (HandDrawnGrid.vue:386 `.boil-frame-bitmap`,
// :465/:497 `.boil-frame`). A MutationObserver on class attributes under the board records
// (a) firstBakeMs — the first `.boil-frame-bitmap` in the DOM, i.e. the raster bake landed —
// and (b) firstBoilTickMs — the first `is-active` MOVE between siblings after board-ready.
//
// TAINT: any window seeing blur/visibilitychange, or a rAF delta in 1000-1300 ms, is marked
// tainted:true and excluded from medians by the summarizer.

// playwright resolves from the CWD (run this from web/frontend), not from this file's dir —
// the script is banked under docs/evidence/ and there is no node_modules up-tree from there.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const _req = createRequire(pathToFileURL(process.cwd() + "/"));
const _pw = _req("playwright");
const { chromium, webkit } = _pw.default || _pw;

const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : d;
};
const BASE = arg("--base", "http://127.0.0.1:4390");
const OUT = arg("--out", "readings.jsonl");
const WINDOWS = Number(arg("--windows", 3));
const ONLY = (arg("--cells", "") || "").split(",").filter(Boolean);
// T9-W8 C03, three edits to A6's banked instrument, named here and nowhere else:
//  1. the boil-tick selector is `.boil-frame-layer`, not `.boil-frame` (ATTRIBUTION §B1: the
//     lane's spelling matches nothing on this tree, corrected per its refuter);
//  2. --settle widens the boot window past 3,600 ms (the charter: 6x Fast-3G mobile never
//     fires inside 3.6 s);
//  3. --noclick drops the controls-response click, which is not this cure's mark and costs
//     ~5 s a window. Nothing else changed; --base points it at one of the two arms.
const SETTLE = Number(arg("--settle", 3600));
const NOCLICK = process.argv.includes("--noclick");

const FAST3G = { offline: false, downloadThroughput: (1.6e6) / 8, uploadThroughput: (750e3) / 8, latency: 150 };

const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, hasTouch: false, isMobile: false },
  mob: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 },
};

const INIT = `(() => {
  window.__A6 = { paint:null, fcp:null, lcp:null, boardReady:null, firstBake:null, firstBoilTick:null,
                  longtasks:[], ltSupported:false, taint:[], rafGaps:[], bakeCount:0 };
  const A = window.__A6;
  try {
    A.ltSupported = (PerformanceObserver.supportedEntryTypes||[]).indexOf('longtask') >= 0;
    if (A.ltSupported) new PerformanceObserver(l => { for (const e of l.getEntries())
      A.longtasks.push({ s: e.startTime, d: e.duration }); }).observe({ type:'longtask', buffered:true });
  } catch(e) {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) {
      if (e.name === 'first-paint' && A.paint === null) A.paint = e.startTime;
      if (e.name === 'first-contentful-paint' && A.fcp === null) A.fcp = e.startTime;
  }}).observe({ type:'paint', buffered:true }); } catch(e) {}
  try { new PerformanceObserver(l => { const es = l.getEntries();
      A.lcp = es[es.length-1].startTime; }).observe({ type:'largest-contentful-paint', buffered:true });
  } catch(e) {}
  for (const ev of ['blur','visibilitychange','pagehide'])
    addEventListener(ev, () => A.taint.push(ev + '@' + Math.round(performance.now())), true);
  // rAF-gap census — the only TBT proxy an engine without longtask can offer.
  let last = performance.now();
  (function tick(){ const n = performance.now(); const g = n - last; last = n;
    if (g > 33.4) A.rafGaps.push({ at: Math.round(n), ms: Math.round(g*10)/10 });
    if (g >= 1000 && g <= 1300) A.taint.push('rafgap' + Math.round(g) + '@' + Math.round(n));
    requestAnimationFrame(tick); })();

  const visible = el => { if (!el) return false; const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const boardReady = () => {
    const bg = [...document.querySelectorAll('.board-group')].find(visible);
    if (!bg) return false;
    const cell = bg.querySelector('[class*="cell"]');
    if (!cell) return false;
    const r = cell.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const poll = () => {
    if (A.boardReady === null && boardReady()) {
      requestAnimationFrame(() => { A.boardReady = performance.now(); armBoil(); });
      return;
    }
    requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);

  // BAKE: the first .boil-frame-bitmap ever in the DOM.
  const bakeWatch = new MutationObserver(() => {
    if (A.firstBake === null && document.querySelector('.boil-frame-bitmap')) {
      A.firstBake = performance.now();
      A.bakeCount = document.querySelectorAll('.boil-frame-bitmap').length;
    }
  });
  const armBake = () => bakeWatch.observe(document.documentElement, { childList:true, subtree:true });
  if (document.documentElement) armBake(); else addEventListener('DOMContentLoaded', armBake);

  // BOIL TICK: the first is-active MOVE between boil siblings after board-ready.
  function armBoil() {
    const sel = '.boil-frame-bitmap, .boil-frame-layer';
    const seed = new Map();
    for (const el of document.querySelectorAll(sel)) seed.set(el, el.classList.contains('is-active'));
    new MutationObserver(recs => {
      if (A.firstBoilTick !== null) return;
      for (const r of recs) {
        const el = r.target;
        if (!el.matches || !el.matches(sel)) continue;
        const now = el.classList.contains('is-active');
        if (seed.has(el) && seed.get(el) !== now) { A.firstBoilTick = performance.now(); return; }
        seed.set(el, now);
      }
    }).observe(document.documentElement, { attributes:true, attributeFilter:['class'], subtree:true });
  }
})();`;

const READ = `(() => { const A = window.__A6 || {};
  const nav = performance.getEntriesByType('navigation')[0] || {};
  const win = 3000, lt = (A.longtasks||[]).filter(t => t.s < win);
  return {
    firstPaintMs: A.paint, fcpMs: A.fcp, lcpMs: A.lcp, boardReadyMs: A.boardReady,
    firstBakeMs: A.firstBake, bakeLayers: A.bakeCount, firstBoilTickMs: A.firstBoilTick,
    ltSupported: A.ltSupported,
    tbt3000Ms: A.ltSupported ? Math.round(lt.reduce((s,t)=>s+Math.max(0,t.d-50),0)) : null,
    longtasks3000: A.ltSupported ? lt.length : null,
    longestTaskMs: A.ltSupported ? Math.round(Math.max(0, ...lt.map(t=>t.d))) : null,
    busyToBoardReadyMs: A.ltSupported && A.boardReady !== null
      ? Math.round((A.longtasks||[]).filter(t => t.s < A.boardReady).reduce((s,t)=>s+Math.min(t.d, A.boardReady-t.s),0))
      : null,
    rafGapsOver33: (A.rafGaps||[]).length,
    rafGapProxyTbtMs: Math.round((A.rafGaps||[]).filter(g=>g.at<3000).reduce((s,g)=>s+Math.max(0,g.ms-50),0)),
    worstRafGapMs: (A.rafGaps||[]).length ? Math.max(...A.rafGaps.map(g=>g.ms)) : 0,
    domContentLoadedMs: nav.domContentLoadedEventEnd ?? null,
    loadEventMs: nav.loadEventEnd ?? null,
    transferBytes: performance.getEntriesByType('resource').reduce((s,r)=>s+(r.transferSize||0),0),
    resourceCount: performance.getEntriesByType('resource').length,
    taint: A.taint,
  }; })()`;

async function measure(engine, cell, cfg) {
  const browser = engine === "webkit" ? await webkit.launch() : await chromium.launch();
  const rows = [];
  try {
    for (let w = 0; w < WINDOWS; w++) {
      const ctx = await browser.newContext(VIEWPORTS[cfg.vp]);
      const page = await ctx.newPage();
      await page.addInitScript(INIT);
      let cdp = null;
      if (engine === "chromium") {
        cdp = await ctx.newCDPSession(page);
        await cdp.send("Network.enable");
        await cdp.send("Network.setCacheDisabled", { cacheDisabled: cfg.cold });
        await cdp.send("Network.emulateNetworkConditions", cfg.net === "fast3g" ? FAST3G
          : { offline: false, downloadThroughput: -1, uploadThroughput: -1, latency: 0 });
        if (cfg.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cfg.cpu });
      }
      if (cfg.warm) { await page.goto(BASE, { waitUntil: "load" }); await page.waitForTimeout(2500);
        if (cdp) await cdp.send("Network.setCacheDisabled", { cacheDisabled: false }); }
      const t0 = Date.now();
      await page.goto(BASE, { waitUntil: "commit" });
      // let the boot window close, then the boil beat land
      await page.waitForTimeout(SETTLE);
      const r = await page.evaluate(READ);
      // CONTROLS RESPONSE — a REAL Playwright (trusted) click, taken AFTER the 3000 ms boot
      // window has closed so it cannot perturb the TBT the same load reports. This is an
      // INTERACTION-LATENCY number, not a time-to-interactive: board-ready is the readiness
      // mark. Desk / short-landscape = the `.drawer-tab` (DrawerTab.vue: display:none below
      // 1024 in portrait, so mobile portrait reports NOT MEASURED for the tab and falls back
      // to the stacked panel's own first visible control, named in controlsHow).
      let ctrlMs = null, ctrlHow = NOCLICK ? "NOT TAKEN — --noclick (C03 reads the bake, not the controls)" : null;
      try {
        if (NOCLICK) throw new Error("skipped");
        const tab = page.locator(".drawer-tab").first();
        const tabVisible = (await tab.count()) > 0 && (await tab.isVisible());
        if (tabVisible) {
          // MEASURED IN THE OPEN DIRECTION, always. At HEAD the desk regime boots with the
          // drawer ALREADY expanded (aria-expanded="true" at 1280x800) and mobile boots
          // collapsed — a bare click would time a close on one and an open on the other.
          if ((await tab.getAttribute("aria-expanded")) === "true") {
            await tab.click({ timeout: 5000 });
            await page.waitForSelector('.drawer-tab[aria-expanded="false"]', { timeout: 5000 });
            await page.waitForTimeout(700); // let the 520 ms sweep settle
          }
          const before = await page.evaluate(() => performance.now());
          await tab.click({ timeout: 5000 });
          await page.waitForSelector('.drawer-tab[aria-expanded="true"]', { timeout: 5000 });
          ctrlMs = await page.evaluate(async (b) => {
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
            return Math.round((performance.now() - b) * 10) / 10;
          }, before);
          ctrlHow = ".drawer-tab click -> aria-expanded=true -> 2 rAF";
        } else {
          // mobile portrait: the stacked panel IS the controls' home; price its first control.
          const btn = page.locator(".control-panel button:visible, .play-controls button:visible").first();
          if ((await btn.count()) > 0) {
            const before = await page.evaluate(() => performance.now());
            await btn.click({ timeout: 5000 });
            ctrlMs = await page.evaluate(async (b) => {
              await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
              return Math.round((performance.now() - b) * 10) / 10;
            }, before);
            ctrlHow = "NO .drawer-tab in this regime (portrait <1024) — stacked-panel first button click -> 2 rAF";
          } else {
            ctrlHow = "NOT MEASURED — no .drawer-tab and no visible panel button";
          }
        }
      } catch (e) {
        if (!NOCLICK)
          ctrlHow = "click failed: " + String(e.message).slice(0, 90).replace(/\n/g, " ");
      }
      const row = { cell, engine, vp: cfg.vp, cpu: cfg.cpu, net: cfg.net,
        cache: cfg.warm ? "warm" : "cold-disabled", window: w + 1, wallMs: Date.now() - t0,
        ...r, controlsInteractiveMs: ctrlMs, controlsHow: ctrlHow,
        tainted: (r.taint || []).length > 0,
        load: (await import("node:child_process")).execSync("sysctl -n vm.loadavg").toString().trim(),
        at: new Date().toISOString() };
      rows.push(row);
      await ctx.close();
    }
  } finally { await browser.close(); }
  return rows;
}

const CELLS = [
  // desk cold, Fast-3G-class link, the CPU sweep
  { cell: "desk-cr-1x-f3g-cold", engine: "chromium", vp: "desk", cpu: 1, net: "fast3g", cold: true },
  { cell: "desk-cr-4x-f3g-cold", engine: "chromium", vp: "desk", cpu: 4, net: "fast3g", cold: true },
  { cell: "desk-cr-6x-f3g-cold", engine: "chromium", vp: "desk", cpu: 6, net: "fast3g", cold: true },
  // desk cold, unthrottled link — isolates CPU from transport
  { cell: "desk-cr-1x-unthr-cold", engine: "chromium", vp: "desk", cpu: 1, net: "unthrottled", cold: true },
  { cell: "desk-cr-4x-unthr-cold", engine: "chromium", vp: "desk", cpu: 4, net: "unthrottled", cold: true },
  { cell: "desk-cr-6x-unthr-cold", engine: "chromium", vp: "desk", cpu: 6, net: "unthrottled", cold: true },
  // desk WARM — the owner's "subsequent invocations are better" delta
  { cell: "desk-cr-4x-unthr-warm", engine: "chromium", vp: "desk", cpu: 4, net: "unthrottled", cold: false, warm: true },
  { cell: "desk-cr-1x-unthr-warm", engine: "chromium", vp: "desk", cpu: 1, net: "unthrottled", cold: false, warm: true },
  // mobile cold
  { cell: "mob-cr-1x-f3g-cold", engine: "chromium", vp: "mob", cpu: 1, net: "fast3g", cold: true },
  { cell: "mob-cr-4x-f3g-cold", engine: "chromium", vp: "mob", cpu: 4, net: "fast3g", cold: true },
  { cell: "mob-cr-6x-f3g-cold", engine: "chromium", vp: "mob", cpu: 6, net: "fast3g", cold: true },
  { cell: "mob-cr-4x-unthr-cold", engine: "chromium", vp: "mob", cpu: 4, net: "unthrottled", cold: true },
  { cell: "mob-cr-6x-unthr-cold", engine: "chromium", vp: "mob", cpu: 6, net: "unthrottled", cold: true },
  { cell: "mob-cr-4x-unthr-warm", engine: "chromium", vp: "mob", cpu: 4, net: "unthrottled", cold: false, warm: true },
  // webkit — NO throttling knobs, NO longtask. Cold/warm only, unthrottled, and it SAYS so.
  { cell: "desk-wk-1x-unthr-cold", engine: "webkit", vp: "desk", cpu: 1, net: "unthrottled(NO CDP)", cold: true },
  { cell: "mob-wk-1x-unthr-cold", engine: "webkit", vp: "mob", cpu: 1, net: "unthrottled(NO CDP)", cold: true },
  { cell: "desk-wk-1x-unthr-warm", engine: "webkit", vp: "desk", cpu: 1, net: "unthrottled(NO CDP)", cold: false, warm: true },
];

import { appendFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
writeFileSync(OUT, "");
for (const c of CELLS) {
  if (ONLY.length && !ONLY.includes(c.cell)) continue;
  process.stderr.write(`[A6] ${c.cell} load ${execSync("sysctl -n vm.loadavg").toString().trim()}\n`);
  try {
    for (const row of await measure(c.engine, c.cell, c)) appendFileSync(OUT, JSON.stringify(row) + "\n");
  } catch (e) {
    appendFileSync(OUT, JSON.stringify({ cell: c.cell, error: String(e.message).slice(0, 200) }) + "\n");
    process.stderr.write(`[A6] ${c.cell} FAILED ${e.message}\n`);
  }
}
process.stderr.write(`[A6] done. load ${execSync("sysctl -n vm.loadavg").toString().trim()}\n`);

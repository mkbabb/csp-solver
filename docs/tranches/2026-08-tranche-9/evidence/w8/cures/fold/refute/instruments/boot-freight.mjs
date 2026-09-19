// run: node boot-freight.mjs --port 4251 --engine chromium|webkit --cpu 4 --net fast3g|none --cache cold|warm --vp desk|mobile --windows 3 [--coverage]
// A2 lane (T9-W8 §8.1). Measures board-ready, per-resource fetch timing, longtasks (chromium only),
// and — with --coverage — CDP Profiler.startPreciseCoverage + CSS.startRuleUsageTracking taken AT board-ready.
// Emits one JSON line per window to stdout. NEVER builds; the dist is fixed by the chair.
// playwright lives in web/frontend/node_modules; this script lives under docs/. Resolve it there.
import { createRequire } from 'node:module'
const require_ = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-fold/web/frontend/package.json')
const { chromium, webkit } = require_('playwright')

const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k)
  return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d
}
const flag = (k) => process.argv.includes('--' + k)
const PORT = arg('port', '4251')
const ENGINE = arg('engine', 'chromium')
const CPU = Number(arg('cpu', '1'))
const NET = arg('net', 'none')
const CACHE = arg('cache', 'cold')
const VP = arg('vp', 'desk')
const WINDOWS = Number(arg('windows', '3'))
const URL_ = `http://127.0.0.1:${PORT}/?game=sudoku`

const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
}
const FAST3G = { offline: false, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 }

const INIT = `
window.__A2 = { ready: null, cellSel: null, longtasks: [], tainted: false, marks: [] };
try {
  new PerformanceObserver(function (l) {
    for (const e of l.getEntries()) window.__A2.longtasks.push({ s: Math.round(e.startTime * 10) / 10, d: Math.round(e.duration * 10) / 10 });
  }).observe({ type: 'longtask', buffered: true });
} catch (e) { window.__A2.longtaskUnsupported = true; }
addEventListener('blur', function () { window.__A2.tainted = true; });
addEventListener('visibilitychange', function () { if (document.hidden) window.__A2.tainted = true; });
(function () {
  function vis(el) {
    if (!el) return false;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  function tick() {
    if (window.__A2.ready === null) {
      const bg = Array.prototype.find.call(document.querySelectorAll('.board-group'), vis);
      if (bg) {
        const sel = '.board-cells .game-cell';
        let cell = bg.querySelector(sel);
        let used = sel;
        if (!cell) { cell = bg.querySelector('[class*="cell"]'); used = '[class*="cell"]'; }
        if (cell) {
          const r = cell.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            window.__A2.cellSel = used;
            requestAnimationFrame(function () { window.__A2.ready = performance.now(); });
            return;
          }
        }
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
`

const COLLECT = `(() => {
  const res = performance.getEntriesByType('resource').map(e => ({
    name: e.name.split('/').pop(), init: e.initiatorType,
    start: Math.round(e.startTime * 10) / 10, end: Math.round(e.responseEnd * 10) / 10,
    enc: e.encodedBodySize, dec: e.decodedBodySize, xfer: e.transferSize,
  }));
  const nav = performance.getEntriesByType('navigation')[0] || {};
  return {
    ready: window.__A2.ready, cellSel: window.__A2.cellSel, tainted: window.__A2.tainted,
    longtasks: window.__A2.longtasks, longtaskUnsupported: !!window.__A2.longtaskUnsupported,
    paints: performance.getEntriesByType('paint').map(p => ({ n: p.name, t: Math.round(p.startTime * 10) / 10 })),
    domContentLoaded: Math.round((nav.domContentLoadedEventEnd || 0) * 10) / 10,
    loadEnd: Math.round((nav.loadEventEnd || 0) * 10) / 10,
    resources: res,
  };
})()`

const run = async () => {
  const browser = await (ENGINE === 'webkit' ? webkit : chromium).launch()
  for (let w = 0; w < WINDOWS; w++) {
    const ctx = await browser.newContext(VIEWPORTS[VP])
    const page = await ctx.newPage()
    await page.addInitScript(INIT)
    let cdp = null
    if (ENGINE === 'chromium') {
      cdp = await ctx.newCDPSession(page)
      await cdp.send('Network.enable')
      // 'cold'      = CDP cache DISABLED outright (the charter's cold regime)
      // 'firstvisit'= a brand-new context (empty disk+memory cache) with the cache ENABLED —
      //               the true first visit, which is the only regime in which the browser's
      //               preload/memory cache can serve a second fetch of the same font.
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: CACHE === 'cold' })
      if (CPU > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU })
      if (NET === 'fast3g') await cdp.send('Network.emulateNetworkConditions', FAST3G)
    }
    if (CACHE === 'warm' && ENGINE === 'chromium') {
      // prime: one full load with cache ENABLED, then the measured second navigation
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: false })
      await page.goto(URL_, { waitUntil: 'load' })
      await page.waitForFunction('window.__A2.ready !== null', null, { timeout: 60000 }).catch(() => {})
      await page.evaluate('window.__A2 = { ready: null, longtasks: [], tainted: false }')
    }
    if (flag('coverage') && ENGINE === 'chromium') {
      await page.coverage.startJSCoverage({ resetOnNavigation: false, reportAnonymousScripts: false })
      await page.coverage.startCSSCoverage({ resetOnNavigation: false })
    }
    const t0 = Date.now()
    await page.goto(URL_, { waitUntil: 'commit' })
    let readyOk = true
    if (arg('stop-at', 'ready') === 'fcp')
      await page.waitForFunction(
        "performance.getEntriesByType('paint').some(p=>p.name==='first-contentful-paint')",
        null, { timeout: 60000 },
      ).catch(() => { readyOk = false })
    else
      await page
        .waitForFunction('window.__A2.ready !== null', null, { timeout: 60000 })
        .catch(() => { readyOk = false })
    const data = await page.evaluate(COLLECT)
    let cov = null
    if (flag('coverage') && ENGINE === 'chromium') {
      const js = await page.coverage.stopJSCoverage()
      const css = await page.coverage.stopCSSCoverage()
      const covOut = arg('coverage-out', null)
      if (covOut)
        (await import('node:fs')).writeFileSync(
          covOut,
          JSON.stringify(js.map((e) => ({ url: e.url.split('/').pop(), total: e.text ? e.text.length : 0, ranges: e.ranges }))),
        )
      cov = {
        js: js.map((e) => ({
          url: e.url.split('/').pop(),
          total: e.text ? e.text.length : 0,
          used: (e.ranges || []).reduce((a, r) => a + (r.end - r.start), 0),
        })),
        css: css.map((e) => ({
          url: e.url.split('/').pop(),
          total: e.text ? e.text.length : 0,
          used: (e.ranges || []).reduce((a, r) => a + (r.end - r.start), 0),
        })),
      }
    }
    console.log(
      JSON.stringify({
        engine: ENGINE, cpu: CPU, net: NET, cache: CACHE, vp: VP, window: w,
        wallMs: Date.now() - t0, readyOk, ...data, coverage: cov,
      }),
    )
    await ctx.close()
  }
  await browser.close()
}
run().catch((e) => { console.error('INSTRUMENT FAILURE', e); process.exit(3) })

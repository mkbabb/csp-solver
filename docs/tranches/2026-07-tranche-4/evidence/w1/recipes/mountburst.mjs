// D7/w8-chunk: is the raster-stack mount async off the synchronous mount burst?
// Measure the longest main-thread task during the first ~4s of cold load (chromium longtask
// observer) at DPR2. FOLD if the worst mount task < 100ms (the 99-103ms @4x concern retired).
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;
import { execSync } from 'node:child_process';
const loadavg = execSync('uptime').toString().match(/load averages?: ([\d.]+)/)?.[1] ?? '?';
const url = 'http://127.0.0.1:4191/';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
// Install the longtask observer BEFORE navigation so it captures the mount burst.
await page.addInitScript(() => {
  window.__longtasks = [];
  try {
    new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__longtasks.push(Math.round(e.duration)); })
      .observe({ entryTypes: ['longtask'] });
  } catch {}
});
const throttle = Number(process.argv[2]) || 1;
if (throttle > 1) {
  const client = await ctx.newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: throttle });
}
const t0 = Date.now();
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
// time to first baked bitmap (bake completion)
await page.waitForFunction(() => document.querySelectorAll('.boil-frame-bitmap').length === 4, null, { timeout: 30000 }).catch(() => {});
const tBaked = Date.now() - t0;
await page.waitForTimeout(3000);
const lt = await page.evaluate(() => window.__longtasks || []);
const nav = await page.evaluate(() => {
  const n = performance.getEntriesByType('navigation')[0];
  return n ? { domContentLoaded: Math.round(n.domContentLoadedEventEnd), loadEvent: Math.round(n.loadEventEnd) } : null;
});
console.log(JSON.stringify({
  loadavg,
  timeToBakedMs: tBaked,
  longTasks: lt.sort((a, b) => b - a),
  worstTaskMs: lt.length ? Math.max(...lt) : 0,
  tasksOver100ms: lt.filter((d) => d > 100).length,
  tasksOver50ms: lt.filter((d) => d > 50).length,
  nav,
}, null, 1));
await browser.close();

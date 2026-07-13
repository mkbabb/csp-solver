// PRM parity: prefers-reduced-motion → frozen beat, 60fps, nothing hidden.
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { webkit, chromium } = pw;
import { execSync } from 'node:child_process';
const engineName = process.argv[2] || 'webkit';
const engine = engineName === 'chromium' ? chromium : webkit;
const loadavg = execSync('uptime').toString().match(/load averages?: ([\d.]+)/)?.[1] ?? '?';
const url = 'http://127.0.0.1:4191/';
const browser = await engine.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(4000);
const vis = await page.evaluate(() => {
  const grid = document.querySelector('.hand-drawn-grid');
  const gridBox = grid?.getBoundingClientRect();
  const bmp = document.querySelectorAll('.boil-frame-bitmap');
  const live = document.querySelectorAll('.boil-frame-layer');
  const anyBmpVisible = [...bmp].some((e) => getComputedStyle(e).display !== 'none' && Number(getComputedStyle(e).opacity) > 0);
  const anyLiveVisible = [...live].some((e) => getComputedStyle(e).display !== 'none' && Number(getComputedStyle(e).opacity) > 0);
  const logo = document.querySelector('svg.handwritten-logo');
  return {
    gridPresent: !!grid, gridW: Math.round(gridBox?.width || 0), gridH: Math.round(gridBox?.height || 0),
    bmpCount: bmp.length, liveCount: live.length, anyGridSurfaceVisible: anyBmpVisible || anyLiveVisible,
    logoPresent: !!logo,
  };
});
const frozen = await page.evaluate(() => new Promise((resolve) => {
  const idx = () => [...document.querySelectorAll('.boil-frame-bitmap')].findIndex((e) => e.classList.contains('is-active'));
  const seen = new Set();
  const t0 = performance.now();
  const iv = setInterval(() => { seen.add(idx()); if (performance.now() - t0 > 2500) { clearInterval(iv); resolve({ distinctActivePosesOver2p5s: seen.size, poses: [...seen] }); } }, 60);
}));
const fps = await page.evaluate((ms) => new Promise((resolve) => {
  let frames = 0; const t0 = performance.now(); let last = t0; const deltas = [];
  function tick(now) { deltas.push(now - last); last = now; frames++; if (now - t0 < ms) requestAnimationFrame(tick); else resolve(+(frames / ((performance.now() - t0) / 1000)).toFixed(1)); }
  requestAnimationFrame(tick);
}), 5000);
console.log(JSON.stringify({ engine: engineName, loadavg, vis, frozen, fps }, null, 1));
await browser.close();

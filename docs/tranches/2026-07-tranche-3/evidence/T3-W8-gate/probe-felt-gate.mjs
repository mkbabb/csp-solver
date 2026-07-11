// T3-W8 GATE probe — G7's probe-felt.mjs, parametrized for the BUILT preview server.
// Method verbatim from evidence/pass3/g7-harness/probe-felt.mjs (rAF-gap sampling; unthrottled
// AND 4× CPU via CDP; DPR2; N control via outer loop). Only APP/SHOTS/OUT are env-driven so it
// runs against a `vite preview` build on a free port instead of the dev server (the wave's trap).
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const APP = process.env.PROBE_APP || 'http://localhost:4319';
const SHOTS = process.env.PROBE_SHOTS || '/tmp/w8-shots';
const OUT = process.env.PROBE_OUT || '/tmp/w8-felt.json';
fs.mkdirSync(SHOTS, { recursive: true });

const out = { meta: { app: APP, dpr: 2, ts: new Date().toISOString() }, gestures: {} };

const SAMPLER = () => {
  window.__g7 = { gaps: [], last: performance.now(), start: performance.now(), stop: false, mounts: 0, revealPeak: 0, marksCells: 0 };
  const s = window.__g7;
  const mo = new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) {
      if (n.nodeType !== 1) continue;
      const c = (n.className || '').toString();
      if (c.includes('sudoku-cell') || n.querySelector?.('.sudoku-cell')) s.mounts++;
    }
    const rv = document.querySelectorAll('.cell-reveal-animated').length;
    if (rv > s.revealPeak) s.revealPeak = rv;
    const mk = document.querySelectorAll('.marks-grid, [class*="mark"]').length;
    if (mk > s.marksCells) s.marksCells = mk;
  });
  mo.observe(document.body, { childList: true, subtree: true });
  s._mo = mo;
  function tick() {
    const now = performance.now();
    s.gaps.push(now - s.last);
    s.last = now;
    if (!s.stop) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
};

const startSampler = (page) => page.evaluate(`(${SAMPLER.toString()})()`);
const stopSampler = (page) => page.evaluate(() => {
  const s = window.__g7; s.stop = true; s._mo?.disconnect();
  const gaps = s.gaps.slice(1);
  gaps.sort((a, b) => b - a);
  const worst = gaps[0] || 0;
  const over50 = gaps.filter((g) => g > 50).length;
  const over100 = gaps.filter((g) => g > 100).length;
  const over16 = gaps.filter((g) => g > 16.7 + 4).length;
  const total = gaps.reduce((a, b) => a + b, 0);
  return {
    worstFrameMs: Math.round(worst),
    frames: gaps.length,
    over16, over50, over100,
    mounts: s.mounts, revealPeak: s.revealPeak, marksCells: s.marksCells,
    windowMs: Math.round(total),
  };
});

async function newPage(browser, { cpu = 1 } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'light',
  });
  await ctx.addInitScript(() => localStorage.setItem('vueuse-color-scheme', 'light'));
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  return { ctx, page, cdp };
}

async function waitBoardReady(page) {
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  await page.waitForTimeout(1200);
}

async function coldStart(browser, cpu) {
  const { ctx, page, cdp } = await newPage(browser, { cpu });
  await cdp.send('Network.enable');
  await cdp.send('Network.clearBrowserCache');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  const reqs = [];
  page.on('request', (r) => reqs.push({ url: r.url().split('/').pop(), t: Date.now() }));
  const t0 = Date.now();
  await page.goto(`${APP}/?game=sudoku`, { waitUntil: 'commit' });
  await page.waitForSelector('.sudoku-cell', { timeout: 20000 });
  const tCell = Date.now() - t0;
  const head = await page.evaluate(() => ({
    modulepreload: [...document.querySelectorAll('link[rel="modulepreload"]')].map((l) => l.href.split('/').pop()),
    preloadWasm: !!document.querySelector('link[rel="preload"][href*=".wasm"]'),
    preloadWorker: [...document.querySelectorAll('link[rel="modulepreload"][href*="worker"]')].length,
    preloadFont: [...document.querySelectorAll('link[rel="preload"][as="font"]')].length,
  }));
  const wasmReq = reqs.find((r) => (r.url || '').includes('.wasm'));
  const workerReq = reqs.find((r) => (r.url || '').includes('worker'));
  await ctx.close();
  return {
    ttiFirstCellMs: tCell,
    wasmFetchStartedAtMs: wasmReq ? wasmReq.t - t0 : null,
    workerFetchStartedAtMs: workerReq ? workerReq.t - t0 : null,
    head,
  };
}

const clickVisible = (page, selector) => page.locator(`${selector}:visible`).first().click();
const clickBtnText = (page, text) => page.locator('button:visible', { hasText: text }).first().click();

async function runGesture(page, action, { settleMs = 2600 } = {}) {
  await startSampler(page);
  await action();
  await page.waitForTimeout(settleMs);
  return stopSampler(page);
}

async function battery(browser, cpu, key) {
  const { ctx, page } = await newPage(browser, { cpu });
  await page.goto(`${APP}/?game=sudoku`, { waitUntil: 'networkidle' });
  await waitBoardReady(page);

  const gen = await runGesture(page, async () => {
    await clickVisible(page, '[aria-label="Randomize board"]');
  });
  const solve = await runGesture(page, async () => {
    await clickVisible(page, '[aria-label="Solve puzzle"]');
  }, { settleMs: 3200 });
  await clickVisible(page, '[aria-label="Randomize board"]');
  await page.waitForTimeout(1600);

  const switch916 = await runGesture(page, async () => {
    await clickBtnText(page, '16×16');
  }, { settleMs: 3200 });
  await page.screenshot({ path: `${SHOTS}/size16-${key}.png` });
  const cells16 = await page.evaluate(() => document.querySelectorAll('.sudoku-cell').length);

  const marks16 = await runGesture(page, async () => {
    await page.keyboard.press('k');
  }, { settleMs: 2800 });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  const marksState16 = await page.evaluate(() => ({
    markGlyphs: document.querySelectorAll('[class*="mark"] path, .marks-grid path').length,
  }));

  await clickBtnText(page, '9×9');
  await page.waitForTimeout(1800);
  const marks9 = await runGesture(page, async () => {
    await page.keyboard.press('k');
  }, { settleMs: 2400 });
  await page.keyboard.press('Escape');
  await ctx.close();
  return {
    generate: gen,
    solve,
    sizeSwitch_9to16: { ...switch916, cellsAfter: cells16 },
    marksPeek_16x16: { ...marks16, ...marksState16 },
    marksPeek_9x9: marks9,
  };
}

async function main() {
  const browser = await chromium.launch();
  out.gestures.coldStart = {
    unthrottled: await coldStart(browser, 1),
    cpu4x: await coldStart(browser, 4),
  };
  // N=2 samples per throttle level (stash-interleaved before/after is the outer control).
  for (const cpu of [1, 4]) {
    const key = cpu === 1 ? 'unthrottled' : 'cpu4x';
    out.gestures[key] = await battery(browser, cpu, key + '_s1');
    out.gestures[key + '_s2'] = await battery(browser, cpu, key + '_s2');
  }
  const g = out.gestures;
  const ratio = (a, b) => (a && b ? +(a / b).toFixed(2) : null);
  out.ratios = {
    note: 'cpu4x worstFrameMs ÷ unthrottled worstFrameMs, sample1',
    sizeSwitch_9to16: ratio(g.cpu4x.sizeSwitch_9to16.worstFrameMs, g.unthrottled.sizeSwitch_9to16.worstFrameMs),
    marksPeek_16x16: ratio(g.cpu4x.marksPeek_16x16.worstFrameMs, g.unthrottled.marksPeek_16x16.worstFrameMs),
    marksPeek_9x9: ratio(g.cpu4x.marksPeek_9x9.worstFrameMs, g.unthrottled.marksPeek_9x9.worstFrameMs),
  };
  await browser.close();
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });

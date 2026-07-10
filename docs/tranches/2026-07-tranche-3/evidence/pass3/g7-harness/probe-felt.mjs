// G7 — felt-perf trace: solve / generate / size-switch / marks(peek) gesture @ DPR2.
// rAF-gap frame sampling (a long main-thread task blocks the next rAF; the gap == the block).
// Each gesture run unthrottled AND at 4× CPU (CDP Emulation.setCPUThrottlingRate) → the ratio.
// Reuses the G10 Playwright-against-live-Vite path. App on http://localhost:3210 (HMR socket is :3000).
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const APP = 'http://localhost:3210';
const SHOTS = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/pass3/g7-shots';
fs.mkdirSync(SHOTS, { recursive: true });

const out = { meta: { app: APP, dpr: 2, ts: new Date().toISOString() }, gestures: {} };

// A rAF sampler installed in-page: returns per-frame gaps + a running mount/anim counter.
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
  const gaps = s.gaps.slice(1); // drop first (baseline)
  gaps.sort((a, b) => b - a);
  const worst = gaps[0] || 0;
  const over50 = gaps.filter((g) => g > 50).length;
  const over100 = gaps.filter((g) => g > 100).length;
  const over16 = gaps.filter((g) => g > 16.7 + 4).length; // dropped frames beyond one vsync
  const total = gaps.reduce((a, b) => a + b, 0);
  return {
    worstFrameMs: Math.round(worst),
    frames: gaps.length,
    over16, over50, over100,
    mounts: s.mounts, revealPeak: s.revealPeak, marksCells: s.marksCells,
    windowMs: Math.round(total),
  };
});

async function newPage(browser, { cpu = 1, cold = false } = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,           // DPR2
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
  await page.waitForTimeout(1200); // let the initial reveal/generate settle
}

// ---------- P1 cold-start: fresh context, cold cache, TTI to first board ----------
async function coldStart(browser, cpu) {
  const { ctx, page, cdp } = await newPage(browser, { cpu });
  await cdp.send('Network.enable');
  await cdp.send('Network.clearBrowserCache');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  const reqs = [];
  page.on('request', (r) => reqs.push({ url: r.url().split('/').pop(), t: Date.now() }));
  const t0 = Date.now();
  await page.goto(`${APP}/?game=sudoku`, { waitUntil: 'commit' });
  // time to first paint of a real cell (interactive board)
  await page.waitForSelector('.sudoku-cell', { timeout: 20000 });
  const tCell = Date.now() - t0;
  // was the wasm/worker discoverable early? check for preload hints in head
  const head = await page.evaluate(() => ({
    modulepreload: [...document.querySelectorAll('link[rel="modulepreload"]')].map((l) => l.href.split('/').pop()),
    preloadWasm: !!document.querySelector('link[rel="preload"][href*=".wasm"]'),
    preloadWorker: !!document.querySelector('link[rel="modulepreload"][href*="worker"]'),
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

// click the visible copy (ControlPanel renders desktop + mobile duplicates)
const clickVisible = (page, selector) => page.locator(`${selector}:visible`).first().click();
const clickBtnText = (page, text) => page.locator('button:visible', { hasText: text }).first().click();

// ---------- a gesture runner: install sampler, do the action, collect ----------
async function runGesture(page, action, { settleMs = 2600 } = {}) {
  await startSampler(page);
  await action();
  await page.waitForTimeout(settleMs);
  return stopSampler(page);
}

async function main() {
  const browser = await chromium.launch();

  // ---- P1 cold start (unthrottled + 4×) ----
  out.gestures.coldStart = {
    unthrottled: await coldStart(browser, 1),
    cpu4x: await coldStart(browser, 4),
  };

  // ---- warm gesture battery, at a shared warm page, per throttle level ----
  for (const cpu of [1, 4]) {
    const key = cpu === 1 ? 'unthrottled' : 'cpu4x';
    const { ctx, page } = await newPage(browser, { cpu });
    await page.goto(`${APP}/?game=sudoku`, { waitUntil: 'networkidle' });
    await waitBoardReady(page);

    // GENERATE (Randomize) — worker generate round-trip + full board reveal
    const gen = await runGesture(page, async () => {
      await clickVisible(page, '[aria-label="Randomize board"]');
    });

    // SOLVE — worker solve round-trip + reveal wave (+ celebration)
    const solve = await runGesture(page, async () => {
      await clickVisible(page, '[aria-label="Solve puzzle"]');
    }, { settleMs: 3200 });
    await page.screenshot({ path: `${SHOTS}/solved-${key}.png` });

    // reset to a fresh 9×9 for the size-switch and marks runs
    await clickVisible(page, '[aria-label="Randomize board"]');
    await page.waitForTimeout(1600);

    // SIZE-SWITCH 9→16 — the A17 P2 hitch (256 uncached wobbleRect ghosts + 256 mounts)
    const switch916 = await runGesture(page, async () => {
      // OptionSelector .ctrl-btn with label "16×16"
      await clickBtnText(page, '16×16');
    }, { settleMs: 3200 });
    await page.screenshot({ path: `${SHOTS}/size16-${key}.png` });
    const cells16 = await page.evaluate(() => document.querySelectorAll('.sudoku-cell').length);

    // MARKS/PEEK at 16×16 (worst case: propagateBoard round-trip + laminate + mark grids over empties)
    const marks16 = await runGesture(page, async () => {
      await page.keyboard.press('k'); // K toggles the peek → setMarksActive(true) → refreshMarks(0)
    }, { settleMs: 2800 });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
    const marksState16 = await page.evaluate(() => ({
      markGlyphs: document.querySelectorAll('[class*="mark"] path, .marks-grid path').length,
    }));

    // back to 9×9, MARKS/PEEK at 9×9 (the served default)
    await clickBtnText(page, '9×9');
    await page.waitForTimeout(1800);
    const marks9 = await runGesture(page, async () => {
      await page.keyboard.press('k');
    }, { settleMs: 2400 });
    await page.keyboard.press('Escape');

    out.gestures[key] = {
      generate: gen,
      solve,
      sizeSwitch_9to16: { ...switch916, cellsAfter: cells16 },
      marksPeek_16x16: { ...marks16, ...marksState16 },
      marksPeek_9x9: marks9,
    };
    await ctx.close();
  }

  // ---- ratios: 4× / unthrottled worst-frame per gesture (the CPU-sensitivity of the felt hitch) ----
  const g = out.gestures;
  const ratio = (a, b) => (a && b ? +(a / b).toFixed(2) : null);
  out.ratios = {
    note: 'cpu4x worstFrameMs ÷ unthrottled worstFrameMs — the felt-hitch amplification on a mid-range CPU',
    generate: ratio(g.cpu4x.generate.worstFrameMs, g.unthrottled.generate.worstFrameMs),
    solve: ratio(g.cpu4x.solve.worstFrameMs, g.unthrottled.solve.worstFrameMs),
    sizeSwitch_9to16: ratio(g.cpu4x.sizeSwitch_9to16.worstFrameMs, g.unthrottled.sizeSwitch_9to16.worstFrameMs),
    marksPeek_16x16: ratio(g.cpu4x.marksPeek_16x16.worstFrameMs, g.unthrottled.marksPeek_16x16.worstFrameMs),
    marksPeek_9x9: ratio(g.cpu4x.marksPeek_9x9.worstFrameMs, g.unthrottled.marksPeek_9x9.worstFrameMs),
    coldStart_tti: ratio(g.coldStart.cpu4x.ttiFirstCellMs, g.coldStart.unthrottled.ttiFirstCellMs),
  };

  await browser.close();
  const dst = SHOTS.replace('g7-shots', 'g7-harness') + '/felt-results.json';
  fs.writeFileSync(dst, JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });

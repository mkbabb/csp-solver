// T3-W8 GATE — focused stability probe: size-switch 9→16 + marks/peek 16×16, @4× CPU, DPR2.
// Same rAF-gap sampler as G7's probe-felt.mjs; N reps to separate the fix delta from
// 4×-throttle run-to-run variance (N=2 was noise-dominated). Reports every worst-frame plus
// median/min/max. Runs against a BUILT preview snapshot (PROBE_APP), never the dev server.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const APP = process.env.PROBE_APP || 'http://localhost:4319';
const OUT = process.env.PROBE_OUT || '/tmp/w8-stab.json';
const N = +(process.env.PROBE_N || 6);

const SAMPLER = () => {
  window.__g = { gaps: [], last: performance.now(), stop: false, mounts: 0, marksCells: 0 };
  const s = window.__g;
  const mo = new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) {
      if (n.nodeType !== 1) continue;
      const c = (n.className || '').toString();
      if (c.includes('sudoku-cell') || n.querySelector?.('.sudoku-cell')) s.mounts++;
    }
    const mk = document.querySelectorAll('.marks-grid, [class*="mark"]').length;
    if (mk > s.marksCells) s.marksCells = mk;
  });
  mo.observe(document.body, { childList: true, subtree: true });
  s._mo = mo;
  (function tick() {
    const now = performance.now();
    s.gaps.push(now - s.last); s.last = now;
    if (!s.stop) requestAnimationFrame(tick);
  })();
};
const start = (p) => p.evaluate(`(${SAMPLER.toString()})()`);
const stop = (p) => p.evaluate(() => {
  const s = window.__g; s.stop = true; s._mo?.disconnect();
  const g = s.gaps.slice(1).sort((a, b) => b - a);
  return { worst: Math.round(g[0] || 0), over50: g.filter((x) => x > 50).length, over100: g.filter((x) => x > 100).length, mounts: s.mounts, marksCells: s.marksCells };
});
const clickBtn = (p, t) => p.locator('button:visible', { hasText: t }).first().click();
const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' });
  await ctx.addInitScript(() => localStorage.setItem('vueuse-color-scheme', 'light'));
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.goto(`${APP}/?game=sudoku`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  await page.waitForTimeout(1200);

  const sizeSwitch = [], marks16 = [];
  for (let i = 0; i < N; i++) {
    // ensure at 9×9
    await clickBtn(page, '9×9').catch(() => {});
    await page.waitForTimeout(1400);
    // SIZE-SWITCH 9→16 (the remount burst)
    await start(page);
    await clickBtn(page, '16×16');
    await page.waitForTimeout(3000);
    sizeSwitch.push(await stop(page));
    // MARKS/PEEK at 16×16 (no cell-click first — matches G7's gesture exactly)
    await start(page);
    await page.keyboard.press('k');
    await page.waitForTimeout(2600);
    marks16.push(await stop(page));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }
  await ctx.close();
  await browser.close();

  const worsts = (a) => a.map((x) => x.worst);
  const summ = (a) => ({ all: worsts(a), min: Math.min(...worsts(a)), median: median(worsts(a)), max: Math.max(...worsts(a)), over100: a.reduce((s, x) => s + x.over100, 0), marksCellsMax: Math.max(...a.map((x) => x.marksCells)) });
  const res = { meta: { app: APP, N, cpu: 4, dpr: 2, ts: new Date().toISOString() }, sizeSwitch: summ(sizeSwitch), marks16: summ(marks16), raw: { sizeSwitch, marks16 } };
  fs.writeFileSync(OUT, JSON.stringify(res, null, 2));
  console.log(JSON.stringify({ sizeSwitch: res.sizeSwitch, marks16: res.marks16 }, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });

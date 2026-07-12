// T3-W13 c3 — residual checks after the stagger-widen, both untraced:
//   (a) 9x9 feel: delay buckets + first-glyph start + last-glyph completion must
//       match the shipped 40ms window (80ms first start, ~500ms last completion);
//       run on BOTH arms (translucent default + opaque prefers-contrast: more).
//   (b) 16x16 opaque concurrency snapshots: paths mid-stroke (0 < offset < 1) at
//       t≈300/600/900 — the widened stagger should cap near 2N/7 ≈ 73.
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/rg1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = {};
const browser = await chromium.launch({ headless: true, args: ['--enable-gpu'] });

async function run(name, url, contrast, holdMs, snapsAt) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  if (contrast) await page.emulateMedia({ contrast: 'more' });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('.sudoku-cell', { timeout: 25000 });
  await sleep(4000);
  const idx = await page.evaluate(() => [...document.querySelectorAll('.sudoku-cell')].findIndex((c) => !c.querySelector('.glyph-svg')));
  await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);
  await page.evaluate((snaps) => {
    window.__feel = { firstStartMs: null, lastDoneMs: null, snaps: [], delays: null, n: 0 };
    const t0 = performance.now();
    let paths = null;
    const tick = () => {
      const t = performance.now() - t0;
      if (!paths || paths.length === 0) paths = [...document.querySelectorAll('.answer-key-laminate .key-glyph path')];
      if (paths.length) {
        if (!window.__feel.delays) {
          window.__feel.n = paths.length;
          window.__feel.delays = [...new Set(paths.map((p) => Math.round(parseFloat(getComputedStyle(p).animationDelay) * 1000)))].sort((a, b) => a - b);
        }
        let started = 0;
        let done = 0;
        let mid = 0;
        for (const p of paths) {
          const off = parseFloat(getComputedStyle(p).strokeDashoffset);
          const o = Number.isNaN(off) ? 0 : off;
          if (o < 0.999) started++;
          if (o <= 0.001) done++;
          if (o < 0.999 && o > 0.001) mid++;
        }
        if (started > 0 && window.__feel.firstStartMs === null) window.__feel.firstStartMs = +t.toFixed(1);
        if (done === paths.length && window.__feel.lastDoneMs === null && started === paths.length)
          window.__feel.lastDoneMs = +t.toFixed(1);
        for (const s of snaps)
          if (t >= s && !window.__feel.snaps.some((x) => x.at === s))
            window.__feel.snaps.push({ at: s, t: +t.toFixed(1), midStroke: mid, started, done, total: paths.length });
      }
      if (t < 2500) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, snapsAt);
  await page.keyboard.down('k');
  await sleep(holdMs);
  const feel = await page.evaluate(() => window.__feel);
  await page.keyboard.up('k');
  await ctx.close();
  results[name] = feel;
}

await run('9x9-translucent', 'http://localhost:3001/', false, 1000, []);
await run('9x9-opaque', 'http://localhost:3001/', true, 1000, []);
await run('16x16-opaque-snaps', 'http://localhost:3001/?size=4', true, 1400, [200, 300, 450, 600, 750, 900]);

await browser.close();
fs.writeFileSync(`${OUT}/c3-feel-results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

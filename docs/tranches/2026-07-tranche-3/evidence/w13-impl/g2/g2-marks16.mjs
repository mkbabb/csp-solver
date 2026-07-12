// T3-W13 l3 supplemental — 16×16 mark stagger distribution + row-sweep composition.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';

const OUT = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/g2';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:3001/?size=4');
await page.waitForSelector('.sudoku-cell', { timeout: 20000 });
await page.waitForTimeout(3500);
const idx = await page.evaluate(() => {
  const cells = [...document.querySelectorAll('.sudoku-cell')];
  return cells.findIndex((c) => !c.querySelector('.glyph-svg'));
});
await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);
// arm a row-sweep watcher: record when each row's marks first appear
await page.evaluate(() => {
  window.__sweep = [];
  const t0 = performance.now();
  const seen = new Set();
  const tick = () => {
    const t = performance.now() - t0;
    document.querySelectorAll('.sudoku-cell').forEach((c, i) => {
      const row = Math.floor(i / 16);
      if (!seen.has(row) && c.querySelector('.pencil-marks path')) {
        seen.add(row);
        window.__sweep.push({ row, t: Math.round(t) });
      }
    });
    if (t < 3000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
await page.keyboard.press('k');
await page.waitForTimeout(220);
await page.screenshot({ path: `${OUT}/peek16-wavefront-dpr2.png`, clip: { x: 250, y: 40, width: 940, height: 820 } });
await page.waitForTimeout(1800);
const out = await page.evaluate(() => {
  const paths = [...document.querySelectorAll('.pencil-marks path')];
  const delays = paths.map((p) => Math.round(parseFloat(getComputedStyle(p).animationDelay) * 1000));
  const hist = {};
  for (const d of delays) hist[d] = (hist[d] || 0) + 1;
  // one dense cell's delays in order
  const byCell = new Map();
  for (const p of paths) {
    const host = p.closest('.pencil-marks');
    if (!byCell.has(host)) byCell.set(host, []);
    byCell.get(host).push(Math.round(parseFloat(getComputedStyle(p).animationDelay) * 1000));
  }
  const dense = [...byCell.values()].sort((a, b) => b.length - a.length)[0];
  return {
    markPathCount: paths.length,
    cellCount: byCell.size,
    delayHistogram: hist,
    densestCellDelays: dense,
    sweep: window.__sweep.sort((a, b) => a.row - b.row),
  };
});
console.log(JSON.stringify(out, null, 2));
await browser.close();

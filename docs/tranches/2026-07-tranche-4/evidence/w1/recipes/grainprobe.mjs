// Verify grainOn drops (grain-static filter removed) on the animated cell during the murmur
// wiggle window. Poll glyph filter attributes on a solved board; the resting count is all
// filled cells filtered, and it must DIP when a cell wiggles (grainOn=false for 600ms).
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;
const url = process.argv[2] || 'http://127.0.0.1:4191/';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => document.querySelectorAll('.boil-frame-bitmap').length === 4, null, { timeout: 30000 }).catch(() => {});
await page.locator('.controls-card button[aria-label="Solve puzzle"]').click().catch(() => {});
await page.waitForTimeout(3000);
const solveOk = await page.evaluate(() => document.querySelector('.board-wrapper')?.className?.includes('solve-success') ?? false);
await page.waitForTimeout(5000);
// Poll for ~12s at ~50ms: count glyph paths carrying url(#grain-static)
const series = await page.evaluate(() => new Promise((resolve) => {
  const samples = [];
  const t0 = performance.now();
  const iv = setInterval(() => {
    const paths = document.querySelectorAll('.glyph-svg path');
    let filtered = 0, unfiltered = 0;
    paths.forEach((p) => {
      const f = p.getAttribute('filter');
      if (f && f.includes('grain-static')) filtered++; else unfiltered++;
    });
    samples.push({ t: Math.round(performance.now() - t0), filtered, unfiltered });
    if (performance.now() - t0 > 12000) { clearInterval(iv); resolve(samples); }
  }, 50);
}));
const filteredCounts = series.map((s) => s.filtered);
const restCount = Math.max(...filteredCounts);
const minCount = Math.min(...filteredCounts);
const dips = series.filter((s) => s.filtered < restCount).length;
console.log(JSON.stringify({
  solveOk,
  samples: series.length,
  restingFilteredGlyphPaths: restCount,
  minFilteredDuringWindow: minCount,
  dipDelta: restCount - minCount,
  sampleFramesWithDip: dips,
  interpretation: minCount < restCount
    ? 'grainOn DROPS during wiggle (filter removed on the animated cell) — CONFIRMED'
    : 'no dip observed — grain filter never drops (fix NOT active) or window missed a wiggle',
}, null, 1));
await browser.close();

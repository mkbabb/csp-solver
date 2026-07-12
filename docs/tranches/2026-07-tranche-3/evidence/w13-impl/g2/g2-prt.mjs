// T3-W13 GATE g2 — THE PRT FULL-KEY TRACE (draw-ins row certification item).
// 16x16 board, prefers-contrast: more => opaque laminate => COMPLETE key (256 cells).
// Holds K, samples rAF cadence across the ~500ms write-in window, counts concurrent
// pencil-draw-on animations, verifies the 80-320ms noise window, and corroborates
// with a CDP trace. DPR2, 1440x900, headless.
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/g2';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = {};

const browser = await chromium.launch({ headless: true, args: ['--enable-gpu'] });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.emulateMedia({ contrast: 'more' }); // PRT arm (opaqueQueries includes prefers-contrast: more)
await page.goto('http://localhost:3001/?size=4', { waitUntil: 'networkidle' });
await page.waitForSelector('.sudoku-cell', { timeout: 25000 });
await sleep(4000); // 16x16 reveal + idle-chunk settle

results.opaqueArmActive = await page.evaluate(() => window.matchMedia('(prefers-contrast: more)').matches);

const idx = await page.evaluate(() => {
  const cells = [...document.querySelectorAll('.sudoku-cell')];
  return cells.findIndex((c) => !c.querySelector('.glyph-svg'));
});
await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);

// Arm the rAF sampler + concurrency snapshots, then hold K.
await page.evaluate(() => {
  window.__prt = { ts: [], snaps: [] };
  const t0 = performance.now();
  window.__prtT0 = t0;
  const tick = () => {
    const t = performance.now() - t0;
    window.__prt.ts.push(+t.toFixed(1));
    if (window.__prtSnapsOn && ((window.__prt.snaps.length === 0 && t > 150) || (window.__prt.snaps.length === 1 && t > 350))) {
      const paths = [...document.querySelectorAll('.answer-key-laminate .key-glyph path')];
      let running = 0;
      for (const p of paths) {
        const anims = p.getAnimations();
        if (anims.some((a) => a.playState === 'running' && String(a.animationName).startsWith('pencil-draw-on'))) running++;
      }
      window.__prt.snaps.push({ t: Math.round(t), keyPaths: paths.length, runningDrawOns: running });
    }
    if (t < 1200) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

await browser.startTracing(page, {
  path: `${OUT}/g2-prt-trace.json`,
  categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame'],
});
await page.keyboard.down('k');
await sleep(900); // NO mid-window screenshot — CDP captureScreenshot stalls the renderer ~200ms
await browser.stopTracing();
await page.screenshot({ path: `${OUT}/g2-prt16-settled-dpr2.png`, clip: { x: 250, y: 40, width: 940, height: 820 } });

const inPage = await page.evaluate(() => {
  const paths = [...document.querySelectorAll('.answer-key-laminate .key-glyph path')];
  const cells = new Set(paths.map((p) => p.closest('.key-glyph'))).size;
  const delays = paths.map((p) => Math.round(parseFloat(getComputedStyle(p).animationDelay) * 1000));
  const names = new Set(paths.map((p) => getComputedStyle(p).animationName));
  const lam = document.querySelector('.answer-key-laminate');
  return {
    keyGlyphCells: cells,
    keyPathCount: paths.length,
    animationNames: [...names],
    delayMin: Math.min(...delays),
    delayMax: Math.max(...delays),
    delayDistinct: [...new Set(delays)].sort((a, b) => a - b),
    laminateClass: lam ? lam.className : null,
    raf: window.__prt,
  };
});
await page.keyboard.up('k');

// rAF gap analysis over the write-in window (0-700ms: milk 0-280, writes 80-500)
const ts = inPage.raf.ts.filter((t) => t <= 700);
const deltas = [];
const gapAt = [];
for (let i = 1; i < ts.length; i++) deltas.push(ts[i] - ts[i - 1]);
const sorted = [...deltas].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
const gaps = deltas.filter((d) => d > median * 1.75);
for (let i = 1; i < ts.length; i++)
  if (ts[i] - ts[i - 1] > median * 1.75) gapAt.push({ at: ts[i - 1], gap: +(ts[i] - ts[i - 1]).toFixed(1) });
results.prt = {
  keyGlyphCells: inPage.keyGlyphCells,
  keyPathCount: inPage.keyPathCount,
  animationNames: inPage.animationNames,
  delayWindowMs: [inPage.delayMin, inPage.delayMax],
  delayBuckets: inPage.delayDistinct,
  concurrencySnaps: inPage.raf.snaps,
  raf: {
    framesTo700ms: deltas.length,
    medianMs: +median.toFixed(2),
    maxGapMs: +Math.max(...deltas).toFixed(2),
    gapsOver1_75xMedian: gaps.length,
    gapList: gaps.map((d) => +d.toFixed(1)),
    gapTimestamps: gapAt,
  },
};

// trace corroboration
const trace = JSON.parse(fs.readFileSync(`${OUT}/g2-prt-trace.json`, 'utf8'));
const ev = trace.traceEvents;
const paints = ev.filter((e) => e.name === 'Paint' && e.dur);
const rasters = ev.filter((e) => e.name === 'RasterTask' && e.dur);
const longTasks = ev.filter((e) => e.name === 'RunTask' && e.dur > 50000);
const pipeline = ev.filter((e) => e.name === 'PipelineReporter');
const droppedPipeline = pipeline.filter((e) => /DROPPED/i.test(JSON.stringify(e.args?.chrome_frame_reporter?.state ?? '')));
results.trace = {
  paintCount: paints.length,
  paintMaxMs: +(Math.max(0, ...paints.map((e) => e.dur)) / 1000).toFixed(2),
  rasterCount: rasters.length,
  rasterMaxMs: +(Math.max(0, ...rasters.map((e) => e.dur)) / 1000).toFixed(2),
  runTasksOver50ms: longTasks.length,
  pipelineReports: pipeline.length,
  pipelineDropped: droppedPipeline.length,
};

await browser.close();
fs.writeFileSync(`${OUT}/g2-prt-results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

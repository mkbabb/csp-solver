// T3-W13 c3 — PRT full-key re-trace after the stagger-widen. g2-prt.mjs recipe
// verbatim, with the trace/hold window extended to cover the widened write window
// (delays 80-860ms + 180ms strokes => last completion ~1040ms; trace to 1300ms),
// and the control-style DroppedFrame/PipelineReporter parsing folded in.
// 16x16, prefers-contrast: more (opaque arm, 256 paths), K held, 1440x900 @DPR2.
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;
const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/rg1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = {};

const browser = await chromium.launch({ headless: true, args: ['--enable-gpu'] });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.emulateMedia({ contrast: 'more' });
await page.goto('http://localhost:3001/?size=4', { waitUntil: 'networkidle' });
await page.waitForSelector('.sudoku-cell', { timeout: 25000 });
await sleep(4000); // 16x16 reveal + idle-chunk settle

results.opaqueArmActive = await page.evaluate(() => window.matchMedia('(prefers-contrast: more)').matches);

const idx = await page.evaluate(() => {
  const cells = [...document.querySelectorAll('.sudoku-cell')];
  return cells.findIndex((c) => !c.querySelector('.glyph-svg'));
});
await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);

// rAF sampler only — NO getAnimations, NO screenshots inside the window (g2's
// disclosed probe-effect discipline).
await page.evaluate(() => {
  window.__prt = { ts: [] };
  const t0 = performance.now();
  const tick = () => {
    const t = performance.now() - t0;
    window.__prt.ts.push(+t.toFixed(1));
    if (t < 1500) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

await browser.startTracing(page, {
  path: `${OUT}/c3-prt-trace.json`,
  categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame'],
});
await page.keyboard.down('k');
await sleep(1300); // covers milk 0-280 + writes 80-1040 + slack
await browser.stopTracing();
await page.screenshot({ path: `${OUT}/c3-prt16-settled-dpr2.png`, clip: { x: 250, y: 40, width: 940, height: 820 } });

const inPage = await page.evaluate(() => {
  const paths = [...document.querySelectorAll('.answer-key-laminate .key-glyph path')];
  const cells = new Set(paths.map((p) => p.closest('.key-glyph'))).size;
  const delays = paths.map((p) => Math.round(parseFloat(getComputedStyle(p).animationDelay) * 1000));
  const durs = new Set(paths.map((p) => getComputedStyle(p).animationDuration));
  const names = new Set(paths.map((p) => getComputedStyle(p).animationName));
  const lam = document.querySelector('.answer-key-laminate');
  return {
    keyGlyphCells: cells,
    keyPathCount: paths.length,
    animationNames: [...names],
    animationDurations: [...durs],
    delayMin: Math.min(...delays),
    delayMax: Math.max(...delays),
    delayDistinct: [...new Set(delays)].sort((a, b) => a - b),
    laminateClass: lam ? lam.className : null,
    raf: window.__prt,
  };
});
await page.keyboard.up('k');

// rAF gap analysis over the WIDENED write window (0-1100ms)
const ts = inPage.raf.ts.filter((t) => t <= 1100);
const deltas = [];
const gapAt = [];
for (let i = 1; i < ts.length; i++) deltas.push(ts[i] - ts[i - 1]);
const sorted = [...deltas].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
for (let i = 1; i < ts.length; i++)
  if (ts[i] - ts[i - 1] > median * 1.75) gapAt.push({ at: ts[i - 1], gap: +(ts[i] - ts[i - 1]).toFixed(1) });
results.prt = {
  keyGlyphCells: inPage.keyGlyphCells,
  keyPathCount: inPage.keyPathCount,
  animationNames: inPage.animationNames,
  animationDurations: inPage.animationDurations,
  delayWindowMs: [inPage.delayMin, inPage.delayMax],
  delayBuckets: inPage.delayDistinct,
  raf: {
    framesTo1100ms: deltas.length,
    medianMs: +median.toFixed(2),
    maxGapMs: +Math.max(...deltas).toFixed(2),
    gapsOver1_75xMedian: gapAt.length,
    gapTimestamps: gapAt,
  },
};

// trace parsing — g2-prt.mjs summary + the control-style dropped-frame counts
const trace = JSON.parse(fs.readFileSync(`${OUT}/c3-prt-trace.json`, 'utf8'));
const ev = trace.traceEvents;
const t0ts = Math.min(...ev.filter((e) => e.ts).map((e) => e.ts));
const paints = ev.filter((e) => e.name === 'Paint' && e.dur);
const rasters = ev.filter((e) => e.name === 'RasterTask' && e.dur);
const longTasks = ev.filter((e) => e.name === 'RunTask' && e.dur > 50000);
const dropped = ev.filter((e) => e.name === 'DroppedFrame');
const pipeline = ev.filter((e) => e.name === 'PipelineReporter');
let stateDropped = 0;
let affectsSmoothness = 0;
const pipelineStates = {};
for (const e of pipeline) {
  const rep = e.args?.chrome_frame_reporter ?? e.args?.frame_reporter ?? {};
  const s = rep.state || '?';
  pipelineStates[s] = (pipelineStates[s] || 0) + 1;
  if (/DROPPED/i.test(String(s))) stateDropped++;
  if (rep.affects_smoothness) affectsSmoothness++;
}
results.trace = {
  droppedFrameEvents: dropped.length,
  droppedFrameTimesMs: dropped.map((e) => Math.round((e.ts - t0ts) / 1000)),
  pipelineReports: pipeline.length,
  pipelineStateDropped: stateDropped,
  pipelineAffectsSmoothness: affectsSmoothness,
  pipelineStates,
  paintCount: paints.length,
  paintMaxMs: +(Math.max(0, ...paints.map((e) => e.dur)) / 1000).toFixed(2),
  rasterCount: rasters.length,
  rasterMaxMs: +(Math.max(0, ...rasters.map((e) => e.dur)) / 1000).toFixed(2),
  runTasksOver50ms: longTasks.length,
};

await browser.close();
fs.writeFileSync(`${OUT}/c3-prt-results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

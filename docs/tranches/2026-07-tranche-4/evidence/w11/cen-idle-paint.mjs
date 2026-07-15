// T4-W11 CEN — idle-paint baseline (owner P0 idle 0-paint invariant) + boil-fps spot.
// CDP Performance domain (LayoutCount/RecalcStyleCount deltas) + CDP Tracing (main-thread
// Paint-event count) over an idle window on a DEALT board, plus in-page rAF fps and the
// boil-beat class-mutation rate. Chromium headless, DPR2/1440x900 — matches the W1 probe rig.
//
// Usage: node cen-idle-paint.mjs <url> <sudoku|futoshiki> [idleMs]
// R3/R4/V: re-run verbatim against the same :PORT preview to compare post-extraction.
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;

const [url = 'http://localhost:4585/', game = 'sudoku', idleMsRaw] = process.argv.slice(2);
const idleMs = Number(idleMsRaw) || 5000;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await context.newPage();
const client = await context.newCDPSession(page);
await client.send('Performance.enable');

await page.goto(url, { waitUntil: 'load', timeout: 60000 });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });

if (game === 'futoshiki') {
  await page.locator('button.logo-trigger').click();
  await page.getByRole('option', { name: 'futoshiki' }).click();
  await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });
  await page.locator('.futoshiki-caret').first().waitFor({ state: 'visible', timeout: 15000 });
} else {
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
}
// Board dealt + boil at steady state (an active baked/live boil frame present).
await page.waitForSelector('image.boil-frame-bitmap.is-active, g.boil-frame-layer.is-active', { timeout: 30000 }).catch(() => {});
const cellCount = await page.evaluate((g) => document.querySelectorAll(g === 'futoshiki' ? '.futoshiki-cell' : '.sudoku-cell').length, game);
const bakedCount = await page.evaluate(() => document.querySelectorAll('image.boil-frame-bitmap').length);
const liveCount = await page.evaluate(() => document.querySelectorAll('g.boil-frame-layer').length);

await page.waitForTimeout(1500); // settle to true idle before the window opens

const metricsMap = (arr) => Object.fromEntries(arr.map((m) => [m.name, m.value]));
const m0 = metricsMap((await client.send('Performance.getMetrics')).metrics);

// Start a devtools-timeline trace to count main-thread Paint events over the idle window.
await client.send('Tracing.start', {
  traceConfig: { includedCategories: ['disabled-by-default-devtools.timeline', 'devtools.timeline'] },
  transferMode: 'ReturnAsStream',
});

// In-page rAF fps + boil-beat class-mutation rate over the SAME idle window.
const feel = await page.evaluate((ms) => new Promise((resolve) => {
  const frames = document.querySelectorAll('image.boil-frame-bitmap, g.boil-frame-layer');
  let classMut = 0;
  const obs = new MutationObserver((muts) => { for (const mm of muts) if (mm.attributeName === 'class') classMut++; });
  frames.forEach((f) => obs.observe(f, { attributes: true, attributeFilter: ['class'] }));
  const deltas = []; let last = performance.now(); let n = 0; const t0 = performance.now();
  function tick(now) {
    deltas.push(now - last); last = now; n++;
    if (now - t0 < ms) requestAnimationFrame(tick);
    else {
      obs.disconnect();
      const secs = (performance.now() - t0) / 1000;
      resolve({
        rafFps: +(n / secs).toFixed(2),
        boilClassMut: classMut,
        boilBeatsPerSec: +((classMut / 2) / secs).toFixed(2), // 2 class flips per beat (off old, on new)
        secs: +secs.toFixed(2),
      });
    }
  }
  requestAnimationFrame(tick);
}), idleMs);

const m1 = metricsMap((await client.send('Performance.getMetrics')).metrics);

// Collect the trace stream and count Paint events. Register the completion listener
// BEFORE ending, so the stream handle is not missed.
const completePromise = new Promise((resolve) => client.once('Tracing.tracingComplete', resolve));
await client.send('Tracing.end');
const tracingComplete = await completePromise;
let paintCount = 0; let layoutEvents = 0; let updateLayerTree = 0;
if (tracingComplete && tracingComplete.stream) {
  let buf = '';
  for (;;) {
    const chunk = await client.send('IO.read', { handle: tracingComplete.stream, size: 1 << 20 });
    buf += chunk.data;
    if (chunk.eof) break;
  }
  await client.send('IO.close', { handle: tracingComplete.stream });
  try {
    const trace = JSON.parse(buf);
    const evs = Array.isArray(trace) ? trace : trace.traceEvents || [];
    for (const ev of evs) {
      if (ev.name === 'Paint') paintCount++;
      else if (ev.name === 'Layout') layoutEvents++;
      else if (ev.name === 'UpdateLayerTree') updateLayerTree++;
    }
  } catch { /* leave counts at 0 on parse issue; getMetrics deltas still authoritative */ }
}

console.log(JSON.stringify({
  game, url, idleMs, secs: feel.secs, cellCount, bakedCount, liveCount,
  paints_trace: paintCount,
  layout_events_trace: layoutEvents,
  updateLayerTree_trace: updateLayerTree,
  layoutCount_delta: +(m1.LayoutCount - m0.LayoutCount).toFixed(0),
  recalcStyleCount_delta: +(m1.RecalcStyleCount - m0.RecalcStyleCount).toFixed(0),
  rafFps: feel.rafFps,
  boilBeatsPerSec: feel.boilBeatsPerSec,
  boilClassMutations: feel.boilClassMut,
}, null, 0));

await browser.close();

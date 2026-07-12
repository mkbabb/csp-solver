// T3-W13 GATE g1 — settled-idle trace, b1's recipe verbatim (1440x806 @DPR2, dark,
// settled 12s, traced 10s). Arms: unsolved | solved | hover (node-1006 rerun).
// Usage: node g1-trace.mjs <arm> <label> [url]
import { createRequire } from 'node:module';
import { writeFileSync, readFileSync } from 'node:fs';
const require = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
);
const { chromium } = require('playwright');

const arm = process.argv[2] ?? 'unsolved';
const label = process.argv[3] ?? arm;
const url = process.argv[4] ?? 'http://localhost:3001/';
const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/rg1';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
await page.evaluate(() => document.fonts?.ready);

if (arm === 'solved') {
  let solveBtn = page.locator('button[aria-label="Solve puzzle"]:visible');
  if ((await solveBtn.count()) === 0) {
    await page.locator('.drawer-tab').first().click();
    await page.waitForTimeout(900);
    solveBtn = page.locator('button[aria-label="Solve puzzle"]:visible');
  }
  await solveBtn.first().click();
  await page.waitForTimeout(9000); // celebration crest ~3s + reveal wavefront done
  await page.mouse.move(400, 30); // neutral park — masthead, no hover chrome
}
if (arm === 'hover') {
  const tab = page.locator('.drawer-tab');
  if ((await tab.getAttribute('aria-expanded')) === 'false') {
    await tab.click();
    await page.waitForTimeout(900);
  }
  await page.locator('.icon-btn:visible').first().hover(); // pointer PARKS here
}

await page.waitForTimeout(12000); // settle — draw-ins, murmur windows, first beats done

const tracePath = `${OUT}/${label}.trace.json`;
await browser.startTracing(page, {
  path: tracePath,
  screenshots: false,
  categories: [
    'devtools.timeline',
    'disabled-by-default-devtools.timeline',
    'disabled-by-default-devtools.timeline.frame',
  ],
});
await page.waitForTimeout(10000);
await browser.stopTracing();
await browser.close();

// ── parse ──
const trace = JSON.parse(readFileSync(tracePath, 'utf8'));
const events = trace.traceEvents ?? trace;
const byName = {};
let tMin = Infinity,
  tMax = -Infinity;
for (const e of events) {
  if (e.ts) {
    if (e.ts < tMin) tMin = e.ts;
    if (e.ts > tMax) tMax = e.ts;
  }
  if (e.ph === 'X' || e.ph === 'I' || e.ph === 'B')
    byName[e.name] = (byName[e.name] ?? 0) + 1;
}
const spanS = (tMax - tMin) / 1e6;

const paints = events.filter((e) => e.name === 'Paint' && e.args?.data?.clip);
const dims = (c) => {
  const xs = [c[0], c[2], c[4], c[6]];
  const ys = [c[1], c[3], c[5], c[7]];
  return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
};
const VIEW_W = 2880,
  VIEW_H = 1612;
const clipHist = {};
let fullViewport = 0;
const paintLog = [];
for (const e of paints) {
  const [w, h] = dims(e.args.data.clip);
  const k = `${w}x${h}`;
  clipHist[k] = (clipHist[k] ?? 0) + 1;
  if (w >= VIEW_W && h >= VIEW_H) fullViewport++;
  paintLog.push({ tMs: Math.round((e.ts - tMin) / 1000), clip: k });
}
// unbounded-clip Paints (no clip data) — count separately
const paintsNoClip = (byName['Paint'] ?? 0) - paints.length;

const r = (n) => +((n ?? 0) / spanS).toFixed(2);
const summary = {
  arm,
  label,
  url,
  spanS: +spanS.toFixed(2),
  perSecond: {
    BeginMainThreadFrame: r(byName['BeginMainThreadFrame']),
    FireAnimationFrame: r(byName['FireAnimationFrame']),
    Paint: r(byName['Paint']),
    Commit: r(byName['Commit']),
    RasterTask: r(byName['RasterTask']),
    UpdateLayoutTree: r(byName['UpdateLayoutTree']),
  },
  paintTotal: byName['Paint'] ?? 0,
  paintWithClip: paints.length,
  paintNoClip: paintsNoClip,
  fullViewportPaints: fullViewport,
  clipHist,
  paintLog: paintLog.slice(0, 300),
};
writeFileSync(`${OUT}/${label}.summary.json`, JSON.stringify(summary, null, 2));
const { paintLog: _pl, ...brief } = summary;
console.log(JSON.stringify(brief, null, 2));

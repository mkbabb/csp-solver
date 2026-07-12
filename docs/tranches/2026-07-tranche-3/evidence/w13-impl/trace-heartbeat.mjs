// T3-W13 l1 — settled-idle heartbeat trace (b1's recipe, prod preview).
// Usage: node trace-heartbeat.mjs <url> <label> [outDir]
// Settles 12s, traces 10s, histograms BeginMainThreadFrame / FireAnimationFrame /
// Paint / Commit / RasterTask per second.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
);
const { chromium } = require('@playwright/test');

const url = process.argv[2] ?? 'http://localhost:4173/';
const label = process.argv[3] ?? 'trace';
const outDir =
  process.argv[4] ??
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
// settle: draw-ins, murmur, first beats all long done
await page.waitForTimeout(12_000);

const tracePath = `${outDir}/${label}.trace.json`;
await browser.startTracing(page, {
  path: tracePath,
  screenshots: false,
  categories: [
    'devtools.timeline',
    'disabled-by-default-devtools.timeline',
    'disabled-by-default-devtools.timeline.frame',
  ],
});
await page.waitForTimeout(10_000);
const buf = await browser.stopTracing();

const events = JSON.parse(buf.toString()).traceEvents ?? JSON.parse(buf.toString());
const names = [
  'BeginMainThreadFrame',
  'FireAnimationFrame',
  'Paint',
  'Commit',
  'RasterTask',
  'UpdateLayoutTree',
];
const counts = Object.fromEntries(names.map((n) => [n, 0]));
let tMin = Infinity;
let tMax = -Infinity;
for (const e of events) {
  if (e.ts) {
    if (e.ts < tMin) tMin = e.ts;
    if (e.ts > tMax) tMax = e.ts;
  }
  if (counts[e.name] !== undefined && (e.ph === 'X' || e.ph === 'I' || e.ph === 'B'))
    counts[e.name]++;
}
const windowS = (tMax - tMin) / 1e6;
const summary = { label, url, windowS: +windowS.toFixed(2), counts, perSecond: {} };
for (const n of names) summary.perSecond[n] = +(counts[n] / windowS).toFixed(2);
writeFileSync(`${outDir}/${label}.summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
await browser.close();

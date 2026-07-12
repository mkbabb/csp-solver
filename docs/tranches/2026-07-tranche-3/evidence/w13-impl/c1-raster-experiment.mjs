// c1 — does a tile-residency floor (opacity 0.001 on inactive poses) retire the
// per-beat single-tile RasterTask? 10s settled trace, injected style, prod preview.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('playwright');
const inject = process.argv[2] === 'floor';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 806 }, deviceScaleFactor: 2, colorScheme: 'dark' });
const page = await ctx.newPage();
await page.goto('http://localhost:4519/', { waitUntil: 'networkidle' });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
if (inject) await page.addStyleTag({ content: `.rest-pose { filter: none !important; }` });
await page.waitForTimeout(12000);
const path = `/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/c1-raster-${inject ? 'nofilter' : 'ctrl'}.trace.json`;
await browser.startTracing(page, { path, screenshots: false, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'] });
await page.waitForTimeout(10000);
await browser.stopTracing();
await browser.close();
const t = JSON.parse(readFileSync(path, 'utf8'));
const ev = t.traceEvents ?? t;
const count = (n) => ev.filter((e) => e.name === n).length;
console.log(JSON.stringify({ inject, RasterTask: count('RasterTask'), Paint: count('Paint'), Commit: count('Commit') }));

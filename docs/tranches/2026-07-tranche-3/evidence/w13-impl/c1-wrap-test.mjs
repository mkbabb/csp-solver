// c1 — hypothesis test: hoist the pose flip onto an unfiltered wrapper div;
// the filtered svg's opacity stays constant. RasterTask should go to 0.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 806 }, deviceScaleFactor: 2, colorScheme: 'dark' });
const page = await ctx.newPage();
await page.goto('http://localhost:4519/', { waitUntil: 'networkidle' });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
await page.addStyleTag({ content: `
  .c1-pose-wrap { position: absolute; inset: 0; opacity: 0; will-change: opacity; pointer-events: none; }
  .c1-pose-wrap.on { opacity: 1; }
  .c1-pose-wrap .rest-pose { opacity: 1 !important; }
` });
await page.evaluate(() => {
  document.querySelectorAll('.rest-pose').forEach((svg) => {
    const w = document.createElement('div');
    w.className = 'c1-pose-wrap' + (svg.classList.contains('is-pose-active') ? ' on' : '');
    svg.parentNode.insertBefore(w, svg);
    w.appendChild(svg);
    new MutationObserver(() =>
      w.classList.toggle('on', svg.classList.contains('is-pose-active')),
    ).observe(svg, { attributes: true, attributeFilter: ['class'] });
  });
});
await page.waitForTimeout(12000);
const path = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/c1-wrap.trace.json';
await browser.startTracing(page, { path, screenshots: false, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'] });
await page.waitForTimeout(10000);
await browser.stopTracing();
await browser.close();
const t = JSON.parse(readFileSync(path, 'utf8'));
const ev = t.traceEvents ?? t;
const count = (n) => ev.filter((e) => e.name === n).length;
console.log(JSON.stringify({ RasterTask: count('RasterTask'), Paint: count('Paint'), Commit: count('Commit') }));

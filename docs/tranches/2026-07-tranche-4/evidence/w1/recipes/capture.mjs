// π/DELTA crops — small per-engine crops of the baked grid surface + a before/after
// (forcelive live-filter vs baked bitmap) DELTA pair. Pixel-truth for the identity floor.
// Usage: node capture.mjs <webkit|chromium> <outdir>
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { webkit, chromium } = pw;
import { mkdirSync } from 'node:fs';
const [engineName = 'chromium', outdir = '.'] = process.argv.slice(2);
const engine = engineName === 'webkit' ? webkit : chromium;
mkdirSync(outdir, { recursive: true });
const url = 'http://127.0.0.1:4191/';

const browser = await engine.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => document.querySelectorAll('.boil-frame-bitmap').length === 4, null, { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(1200);

// Clip a small corner of the grid where the hand-drawn grain tooth is visible.
const box = await page.evaluate(() => {
  const g = document.querySelector('.hand-drawn-grid');
  const r = g.getBoundingClientRect();
  return { x: Math.round(r.x + 8), y: Math.round(r.y + 8), width: 200, height: 200 };
});
// baked
await page.screenshot({ path: `${outdir}/grid-${engineName}-baked.png`, clip: box });
// forcelive (restore the live grain-static filter flip)
await page.addStyleTag({ content: `
  .boil-frame-bitmap { display: none !important; }
  @media screen { .boil-frame-layer.baked-hidden { display: inline !important; } }
` });
await page.waitForTimeout(500);
await page.screenshot({ path: `${outdir}/grid-${engineName}-forcelive.png`, clip: box });

console.log(JSON.stringify({ engine: engineName, clip: box, files: [`grid-${engineName}-baked.png`, `grid-${engineName}-forcelive.png`] }));
await browser.close();

import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;
import fs from 'fs';
const OUT = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: false, args: ['--enable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await sleep(800);

const box = await page.$eval('.sun-moon-toggle', (el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
// tight crop on the disc's upper-left outline edge — the most diagnostic region for raster sharpness
const clip = { x: box.x + 30, y: box.y + 30, width: 150, height: 150 };

async function shot(name, wc, scale) {
  await page.evaluate(({ wc, sc }) => {
    let s = document.getElementById('probe-style');
    if (!s) { s = document.createElement('style'); s.id = 'probe-style'; document.head.appendChild(s); }
    s.textContent = `.corner-right{will-change:${wc}!important;} .toggle-icon.is-active{transition:none!important;transform:scale(${sc})!important;transform-origin:center!important;}`;
  }, { wc, sc: scale });
  await sleep(600);
  await page.screenshot({ path: `${OUT}/edge-${name}.png`, clip });
  console.log('SHOT', name);
}

// scale 1.0 — tests raster-DPR degradation independent of any up-scaling
await shot('promoted-1_0', 'transform', 1.0);
await shot('unpromoted-1_0', 'auto', 1.0);
// scale 1.1 — the whirl overshoot peak
await shot('promoted-1_1', 'transform', 1.1);
await shot('unpromoted-1_1', 'auto', 1.1);

await browser.close();
console.log('DONE');

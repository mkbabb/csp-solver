// Sample rAF fire timestamps on the settled page — are beats landing 1 or 2 rAFs?
import { createRequire } from 'node:module';
const require = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
);
const { chromium } = require('@playwright/test');

const url = process.argv[2] ?? 'http://localhost:4173/';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.addInitScript(() => {
  window.__rafFires = [];
  const native = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) =>
    native((t) => {
      window.__rafFires.push({ t: +t.toFixed(2), now: +performance.now().toFixed(2) });
      cb(t);
    });
});
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(13_000);
await page.evaluate(() => (window.__rafFires.length = 0));
await page.waitForTimeout(4_000);
const fires = await page.evaluate(() => window.__rafFires.slice());
console.log('fires in 4s:', fires.length);
const deltas = fires.slice(1).map((f, i) => +(f.t - fires[i].t).toFixed(2));
console.log('inter-fire deltas (ms):', JSON.stringify(deltas));
console.log(
  'timestamp-vs-now skew per fire:',
  JSON.stringify(fires.map((f) => +(f.now - f.t).toFixed(2))),
);
await browser.close();

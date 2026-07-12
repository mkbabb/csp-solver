// c1 — F-1 arming check: after a long idle (frame refs far past the held snapshot),
// the live pair's gesture-scoped bindings must carry the CURRENT pose on the first
// warp frame (first rAF after click) — no naked first frame.
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' });
const page = await ctx.newPage();
await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
await page.waitForSelector('.sun-moon-toggle', { timeout: 15000 });
await page.waitForTimeout(6000); // idle — sunFrame advances well past the mount snapshot
const res = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const btn = document.querySelector('.sun-moon-toggle');
      const activePose = document.querySelector('.rest-sun .rest-pose.is-pose-active');
      const restRayPts = activePose.querySelector('g polygon').getAttribute('points');
      const restTwinklePts = activePose.querySelector('.rest-twinkle polygon').getAttribute('points');
      const liveSun = document.querySelector('svg.toggle-sun');
      const preClickLivePts = liveSun.querySelector('.sun-rays polygon').getAttribute('points');
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      requestAnimationFrame(() => {
        // first frame the warp can paint
        resolve({
          turning: btn.classList.contains('is-turning'),
          liveVisible: getComputedStyle(liveSun).visibility,
          rayMatch: liveSun.querySelector('.sun-rays polygon').getAttribute('points') === restRayPts,
          twinkleMatch:
            liveSun.querySelector('.sun-sparkle polygon').getAttribute('points') === restTwinklePts,
          wasStaleBeforeClick: preClickLivePts !== restRayPts,
        });
      });
    }),
);
console.log(JSON.stringify(res, null, 1));
await browser.close();

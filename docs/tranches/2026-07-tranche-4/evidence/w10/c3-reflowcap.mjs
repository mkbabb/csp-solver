// Clean reflow captures at desktop-context 320 (innerWidth locked → the +6px clip is truthful).
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const BASE = 'http://localhost:4486';
const EV = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-07-tranche-4/evidence/w10';
const URLS = { sudoku: `${BASE}/`, futoshiki: `${BASE}/?game=futoshiki` };
const browser = await chromium.launch();
for (const [game, url] of Object.entries(URLS)) {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 720 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // draw a 320px reference guide + scroll to reveal any horizontal overflow
  await page.evaluate(() => {
    const g = document.createElement('div');
    g.style.cssText = 'position:fixed;top:0;left:319px;width:2px;height:100vh;background:red;z-index:99999;pointer-events:none';
    document.body.appendChild(g);
    window.scrollTo(9999, 0); // reveal right overflow if scrollable
  });
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${EV}/reflow-320-${game}.png`, fullPage: false });
  await ctx.close();
}
await browser.close();
console.log('reflow captures regenerated (desktop-context 320, red guide at x=320)');

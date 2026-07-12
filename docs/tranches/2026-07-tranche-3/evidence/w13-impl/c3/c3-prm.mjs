// c3 — PRM parity on the laminate after the stagger-widen: key glyphs instant at 0.9.
import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ headless: true, args: ['--enable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForSelector('.sudoku-cell', { timeout: 25000 });
await sleep(3000);
const idx = await page.evaluate(() => [...document.querySelectorAll('.sudoku-cell')].findIndex((c) => !c.querySelector('.glyph-svg')));
await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);
await page.keyboard.down('k');
await sleep(120);
const r = await page.evaluate(() => {
  const paths = [...document.querySelectorAll('.answer-key-laminate .key-glyph path')];
  return paths.map((p) => {
    const cs = getComputedStyle(p);
    return { name: cs.animationName, op: cs.opacity, off: cs.strokeDashoffset };
  }).reduce((acc, x) => { const k = `${x.name}|${x.op}|${x.off}`; acc[k] = (acc[k] || 0) + 1; return acc; }, {});
});
await page.keyboard.up('k');
await browser.close();
console.log(JSON.stringify(r));

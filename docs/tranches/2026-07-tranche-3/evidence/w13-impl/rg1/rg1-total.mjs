import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;
const browser = await chromium.launch({ headless: true, args: ['--enable-gpu'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' });
const page = await ctx.newPage();
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForSelector('.sun-moon-toggle', { timeout: 20000 });
await page.waitForTimeout(3000);
const r = await page.evaluate(() => new Promise((res) => {
  const btn = document.querySelector('.sun-moon-toggle');
  const host = btn.closest('.corner-right') ?? document.documentElement;
  const t0 = performance.now();
  btn.click();
  let sawTurning = false, themeAt = null;
  const de = document.documentElement;
  const dark0 = de.classList.contains('dark');
  const tick = () => {
    const t = performance.now() - t0;
    const turning = de.classList.contains('theme-turning') || !!document.querySelector('.is-turning');
    if (document.documentElement.classList.contains('dark') !== dark0 && themeAt === null) themeAt = t;
    if (turning) sawTurning = true;
    if (sawTurning && !turning) return res({ totalMs: t, themeFlipMs: themeAt });
    if (t > 3000) return res({ totalMs: null, themeFlipMs: themeAt, timeout: true });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}));
console.log(JSON.stringify(r));
await browser.close();

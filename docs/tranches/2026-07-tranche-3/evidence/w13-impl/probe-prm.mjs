// PRM parity: reduced-motion context — scheduler must never arm, surfaces must not mutate.
import { createRequire } from 'node:module';
const require = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
);
const { chromium } = require('@playwright/test');
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();
await page.goto(process.argv[2] ?? 'http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForTimeout(6000);
const result = await page.evaluate(async () => {
  let mutations = 0;
  const obs = new MutationObserver((m) => (mutations += m.length));
  obs.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ['d', 'points', 'baseFrequency', 'transform'],
  });
  await new Promise((r) => setTimeout(r, 2000));
  obs.disconnect();
  return { mutations, debug: window.__schedulerDebug?.() ?? null };
});
console.log(JSON.stringify(result));
await browser.close();

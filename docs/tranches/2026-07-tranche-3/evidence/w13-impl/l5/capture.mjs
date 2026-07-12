// L5 soul-gate capture — logo + hover chrome + fx button crops @DPR2, dark mode.
// Usage: node capture.mjs <outDir> [frames] [spacingMs]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('playwright');

const outDir = process.argv[2];
const FRAMES = Number(process.argv[3] ?? 10);
const SPACING = Number(process.argv[4] ?? 260);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
// settle: fonts + reveal + first beats
await page.evaluate(() => document.fonts?.ready);
await page.waitForTimeout(3500);

const logo = page.locator('svg.handwritten-logo');
for (let i = 0; i < FRAMES; i++) {
  await logo.screenshot({ path: join(outDir, `logo-${String(i).padStart(2, '0')}.png`) });
  await page.waitForTimeout(SPACING);
}

// hovered icon-btn (wobble-celestial hover flourish) — lives in THE DRAWER; open it
const tab = page.locator('.drawer-tab');
if ((await tab.getAttribute('aria-expanded')) === 'false') {
  await tab.click();
  await page.waitForTimeout(900);
}
const btn = page.locator('.icon-btn:visible').first();
await btn.hover();
await page.waitForTimeout(600);
for (let i = 0; i < 6; i++) {
  await btn.screenshot({ path: join(outDir, `iconbtn-hover-${i}.png`) });
  await page.waitForTimeout(130);
}
// un-hover reference
await page.mouse.move(720, 780);
await page.waitForTimeout(600);
await btn.screenshot({ path: join(outDir, `iconbtn-rest.png`) });

// dev fx button
const fx = page.locator('.tuner-toggle');
if (await fx.count()) {
  await fx.screenshot({ path: join(outDir, `fx-button.png`) });
}

// section-heading hover (wobble-heart hover flourish)
const heading = page.locator('.section-heading:visible').first();
if (await heading.count()) {
  await heading.hover();
  await page.waitForTimeout(600);
  for (let i = 0; i < 4; i++) {
    await heading.screenshot({ path: join(outDir, `heading-hover-${i}.png`) });
    await page.waitForTimeout(130);
  }
}

await browser.close();
console.log('captured →', outDir);

// L5 settled-idle trace — b1's recipe: 1440x806 @DPR2, dark, settled, 10s.
// Arms: full  = page as-is;
//       mine  = other lanes' painters hidden (outline x2, divider, mascot) so the
//               remaining recurring painters are exactly l5's surfaces (logo, fx, hover chrome);
//       hover = 'mine' + pointer parked on a visible .icon-btn (node-1006 repro).
// Usage: node trace.mjs <outJsonPath> <arm>
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('playwright');

const out = process.argv[2];
const arm = process.argv[3] ?? 'full';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
await page.evaluate(() => document.fonts?.ready);

if (arm === 'mine' || arm === 'hover') {
  await page.addStyleTag({
    content: `
      .outline-svg, .boil-divider-wrap, .sun-moon-toggle { visibility: hidden !important; }
    `,
  });
}
if (arm === 'no-toggle' || arm === 'hover-clean') {
  // display:none (not visibility) — removes the toggle's layout/paint entirely,
  // isolating every OTHER surface (l5's included) for recurring-paint counting.
  await page.addStyleTag({
    content: `.sun-moon-toggle { display: none !important; }`,
  });
}
if (arm === 'hover' || arm === 'hover-clean') {
  // open the drawer, park the pointer on an icon button, and LEAVE it there
  const tab = page.locator('.drawer-tab');
  if ((await tab.getAttribute('aria-expanded')) === 'false') {
    await tab.click();
    await page.waitForTimeout(900);
  }
  await page.locator('.icon-btn:visible').first().hover();
}

await page.waitForTimeout(4000); // settle

await browser.startTracing(page, {
  path: out,
  categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'],
});
await page.waitForTimeout(10000);
await browser.stopTracing();
await browser.close();

// ── parse ──
const trace = JSON.parse(readFileSync(out, 'utf8'));
const events = trace.traceEvents ?? trace;
const byName = {};
for (const e of events) byName[e.name] = (byName[e.name] ?? 0) + 1;
const ts = events.filter((e) => e.ts > 0).map((e) => e.ts);
const spanS = (Math.max(...ts) - Math.min(...ts)) / 1e6;

const paints = events.filter((e) => e.name === 'Paint' && e.args?.data?.clip);
const clipArea = (c) => {
  const xs = [c[0], c[2], c[4], c[6]];
  const ys = [c[1], c[3], c[5], c[7]];
  return (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
};
const clipDims = (c) => {
  const xs = [c[0], c[2], c[4], c[6]];
  const ys = [c[1], c[3], c[5], c[7]];
  return `${Math.max(...xs) - Math.min(...xs)}x${Math.max(...ys) - Math.min(...ys)}`;
};
const viewportArea = 2880 * 1612;
const bigPaints = paints.filter((e) => clipArea(e.args.data.clip) >= viewportArea);

// histogram paint clips
const clipHist = {};
for (const e of paints) {
  const d = clipDims(e.args.data.clip);
  clipHist[d] = (clipHist[d] ?? 0) + 1;
}

const r = (n) => Math.round((n / spanS) * 10) / 10;
console.log(JSON.stringify({
  arm,
  spanS: Math.round(spanS * 100) / 100,
  paintsTotal: paints.length,
  paintsPerS: r(paints.length),
  fullViewportPaints: bigPaints.length,
  beginMainThreadFramePerS: r(byName['BeginMainThreadFrame'] ?? 0),
  fireAnimationFramePerS: r(byName['FireAnimationFrame'] ?? 0),
  commitPerS: r(byName['Commit'] ?? 0),
  rasterTasks: byName['RasterTask'] ?? 0,
  clipHist,
}, null, 2));

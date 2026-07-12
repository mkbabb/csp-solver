// T3-W13 l1 — does the beat still drive every wobble surface? (:3001 dev, headless)
// Samples each perpetual painter's mutating attribute across ~1.3s (>= 10 beats; the
// logo steps every 4th beat) and polls __schedulerDebug for the parked steady state.
import { createRequire } from 'node:module';
const require = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
);
const { chromium } = require('@playwright/test');

const url = process.argv[2] ?? 'http://localhost:3001/';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(8_000); // settle draw-ins

const sample = () =>
  page.evaluate(() => {
    const q = (sel) => document.querySelector(sel);
    const outlines = [...document.querySelectorAll('.outline-svg path')].map(
      (p) => p.getAttribute('d') ?? '',
    );
    return {
      outlineHashes: outlines.map((d) => `${d.length}:${d.slice(0, 24)}:${d.slice(-24)}`),
      dividerD: q('.boil-divider path')?.getAttribute('d')?.slice(0, 48) ?? null,
      mascotStar:
        q('.toggle-icon polygon')?.getAttribute('points')?.slice(0, 48) ??
        q('.dark-mode-toggle polygon')?.getAttribute('points')?.slice(0, 48) ??
        null,
      logoD:
        q('.handwritten-logo path')?.getAttribute('d')?.slice(0, 48) ??
        q('.logo-svg path')?.getAttribute('d')?.slice(0, 48) ??
        null,
      wobbleFreq:
        q('#wobble-celestial feTurbulence')?.getAttribute('baseFrequency') ?? null,
      debug: window.__schedulerDebug ? window.__schedulerDebug() : null,
    };
  });

const a = await sample();
// poll parked/chains 40x over ~1.3s (>= 10 beats)
const polls = [];
for (let i = 0; i < 40; i++) {
  polls.push(
    await page.evaluate(() =>
      window.__schedulerDebug
        ? (({ chains, parked, subscribers }) => ({ chains, parked, subscribers }))(
            window.__schedulerDebug(),
          )
        : null,
    ),
  );
  await page.waitForTimeout(33);
}
const b = await sample();

const changed = (x, y) => x !== null && y !== null && x !== y;
const report = {
  outlinesChanged: a.outlineHashes.map((h, i) => h !== b.outlineHashes[i]),
  dividerChanged: changed(a.dividerD, b.dividerD),
  mascotChanged: changed(a.mascotStar, b.mascotStar),
  logoChanged: changed(a.logoD, b.logoD),
  wobbleFreqChanged: changed(a.wobbleFreq, b.wobbleFreq),
  debugStart: a.debug,
  debugEnd: b.debug,
  pollParkedCount: polls.filter((p) => p?.parked).length,
  pollChain1Count: polls.filter((p) => p?.chains === 1).length,
  pollSubscribers: [...new Set(polls.map((p) => p?.subscribers))],
  pollCount: polls.length,
};
console.log(JSON.stringify(report, null, 2));
await browser.close();

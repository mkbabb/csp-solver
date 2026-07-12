// T3-W13 l1 probe v2 — MutationObserver counts per wobble surface over 2s (:3001 dev).
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
await page.waitForTimeout(8_000); // settle

const result = await page.evaluate(async () => {
  const counts = {};
  const bump = (k) => (counts[k] = (counts[k] ?? 0) + 1);
  const classify = (el) => {
    const svg = el.closest?.('svg');
    const cls = (n) => n?.getAttribute?.('class') ?? '';
    if (el.tagName === 'feTurbulence') return `feTurbulence#${el.parentElement?.id}`;
    if (svg && /outline-svg/.test(cls(svg))) return 'outline';
    if (svg && /divider/.test(cls(svg) + cls(svg.parentElement))) return 'divider';
    if (el.closest?.('.dark-mode-toggle')) return 'toggle-mascot';
    if (el.closest?.('.handwritten-logo, .logo-svg, header')) return 'logo';
    return `other:${el.tagName}.${cls(el).slice(0, 20)}`;
  };
  const obs = new MutationObserver((muts) => {
    for (const m of muts) if (m.type === 'attributes') bump(classify(m.target));
  });
  obs.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ['d', 'points', 'baseFrequency', 'transform', 'class', 'style'],
  });
  // sample scheduler state at 25ms grain across the same window
  const polls = { parkedTrue: 0, chains1: 0, total: 0 };
  const t0 = performance.now();
  while (performance.now() - t0 < 2000) {
    const dbg = window.__schedulerDebug?.();
    if (dbg) {
      polls.total++;
      if (dbg.parked === true) polls.parkedTrue++;
      if (dbg.chains === 1) polls.chains1++;
    }
    await new Promise((r) => setTimeout(r, 25));
  }
  obs.disconnect();
  return { counts, polls, debug: window.__schedulerDebug?.() ?? null };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();

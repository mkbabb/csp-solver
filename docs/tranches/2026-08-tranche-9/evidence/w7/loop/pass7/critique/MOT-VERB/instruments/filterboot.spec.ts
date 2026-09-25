import { test } from '@playwright/test';
// Critic (pass 7): live SVG-filter census (computed `filter` naming a url(), every element, hidden
// included) sampled every 100 ms through the BOOT (0-4.5 s) and read again AT REST (+7 s); tree
// (:4236, clean rebuild of e7cc2ae8) vs control 74a2b5d9 (:4237); both themes; 1280 fine; same payload.
const PAYLOAD = process.env.CRIT_BOARD ?? '';
for (const scheme of ['light', 'dark'] as const)
  test(`filterboot ${scheme}`, async ({ browser }) => {
    const out: string[] = [];
    for (const [arm, base] of [['tree', 'http://127.0.0.1:4236'], ['ctl', 'http://127.0.0.1:4237']]) {
      const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 800 } });
      await ctx.addInitScript(() => {
        const w = window as unknown as { __fb: [number, number][] };
        w.__fb = [];
        const t0 = performance.now();
        const iv = setInterval(() => {
          let n = 0;
          for (const el of document.querySelectorAll('*')) { const f = getComputedStyle(el).filter; if (f && f.includes('url(')) n++; }
          w.__fb.push([Math.round(performance.now() - t0), n]);
          if (performance.now() - t0 > 4500) clearInterval(iv);
        }, 100);
      });
      const page = await ctx.newPage();
      await page.goto(base + '/?game=sudoku' + (PAYLOAD ? '&board=' + PAYLOAD : ''));
      await page.waitForTimeout(7000);
      const boot = await page.evaluate(() => (window as unknown as { __fb: [number, number][] }).__fb);
      const rest = await page.evaluate(() => { let n = 0; for (const el of document.querySelectorAll('*')) { const f = getComputedStyle(el).filter; if (f && f.includes('url(')) n++; } return n; });
      const max = boot.reduce((m, [, n]) => Math.max(m, n), 0);
      const at = boot.find(([, n]) => n === max)?.[0];
      out.push(`${arm} boot-max ${max} @${at}ms rest ${rest}`);
      await ctx.close();
    }
    console.log(`FILTERBOOT ${test.info().project.name} ${scheme}: ${out.join(' | ')}`);
  });

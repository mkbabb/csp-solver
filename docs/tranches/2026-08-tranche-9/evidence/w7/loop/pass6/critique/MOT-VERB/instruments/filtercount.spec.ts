import { test } from '@playwright/test';
// Critic: live SVG-filter count (computed `filter` naming a url()) on every rendered element,
// tree (:4230) vs control (:4231), both themes, playing pose at 1280 fine. The estate's
// filter-census reads the light regime only.
for (const scheme of ['light', 'dark'] as const)
  test(`filtercount ${scheme}`, async ({ browser }) => {
    const out: string[] = [];
    for (const [arm, base] of [['tree', 'http://127.0.0.1:4230'], ['ctl', 'http://127.0.0.1:4231']]) {
      const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      await page.goto(base + '/?game=sudoku&size=3&difficulty=EASY');
      await page.waitForSelector('.board-cells');
      await page.waitForTimeout(2500);
      const n = await page.evaluate(() => { const hits: string[] = []; for (const el of document.querySelectorAll('*')) { const f = getComputedStyle(el).filter; if (f && f.includes('url(')) hits.push((el as Element).tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.')); } return hits; });
      out.push(`${arm} ${n.length} [${[...new Set(n)].join(' ')}]`);
      await ctx.close();
    }
    console.log(`FILTERCOUNT ${test.info().project.name} ${scheme}: ${out.join(' | ')}`);
  });

// RG2 — functional readout truing: (a) toggle rest-stack state under PRM with the
// correct root selector (.sun-moon-toggle); (b) attribution of doc-wide
// getAnimations() entries after a PRM drawer click.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';

const browser = await chromium.launch({ headless: true });
const results = {};

async function ctx(colorScheme) {
  const c = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme,
    reducedMotion: 'reduce',
  });
  const page = await c.newPage();
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
  await page.waitForSelector('.sudoku-cell', { timeout: 25000 });
  await page.waitForTimeout(3000);
  return { c, page };
}

for (const scheme of ['light', 'dark']) {
  const { c, page } = await ctx(scheme);
  results[`toggle-${scheme}`] = await page.evaluate(() => {
    const svgs = [...document.querySelectorAll('.sun-moon-toggle svg')];
    const visible = svgs.filter((s) => {
      const cs = getComputedStyle(s);
      return cs.visibility !== 'hidden' && cs.opacity !== '0' && cs.display !== 'none';
    });
    const warp = document.querySelector('.sun-moon-toggle .toggle-icon .warp');
    return {
      svgCount: svgs.length,
      visibleSvgs: visible.map((s) => s.getAttribute('class')),
      warpTransform: warp ? getComputedStyle(warp).transform : 'no-warp-el',
      liveIconsHidden: [...document.querySelectorAll('.sun-moon-toggle .toggle-icon')].map(
        (el) => getComputedStyle(el).visibility,
      ),
      animationsInToggle: document.getAnimations().filter((a) => {
        const t = a.effect?.target;
        return t && t.closest && t.closest('.sun-moon-toggle');
      }).length,
    };
  });
  await c.close();
}

{
  const { c, page } = await ctx('dark');
  const before = await page.evaluate(() => document.getAnimations().length);
  await page.locator('.drawer-tab').click();
  const after = await page.evaluate(() => {
    const anims = document.getAnimations();
    const byTarget = {};
    for (const a of anims) {
      const t = a.effect?.target;
      const key = t ? `${t.tagName}.${(t.getAttribute('class') || '').split(' ')[0]}|${a.constructor.name}|${a.animationName || a.transitionProperty || ''}` : 'no-target';
      byTarget[key] = (byTarget[key] || 0) + 1;
    }
    const drawerScoped = anims.filter((a) => {
      const t = a.effect?.target;
      return t && t.closest && (t.closest('.controls-drawer') || t.closest('.drawer-tab') || t.closest('.app-layout') || t.closest('.board-wrapper'));
    });
    return { total: anims.length, byTarget, drawerScopedCount: drawerScoped.length };
  });
  results['drawer-animations'] = { beforeClick: before, afterClick: after };
  await c.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));

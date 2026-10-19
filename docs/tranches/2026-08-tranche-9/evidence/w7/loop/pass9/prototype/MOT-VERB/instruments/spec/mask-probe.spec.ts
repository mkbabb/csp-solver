// mask-probe.spec.ts (MOT-VERB pass 9 scratch instrument, never banked): is the π cell's masked element painted?
// Prints each .boil-frame-bitmap's computed mask longhands and opacity, PRM and live, so π's IDENTICAL on the mask
// shorthand is read against an element that paints (opacity > 0 on at least one pose) or declared vacuous.
import { test } from '@playwright/test';
for (const prm of [true, false])
  test(`mask probe ${prm ? 'PRM' : 'live'}`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: prm ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    await page.goto('/?game=sudoku');
    await page.locator('.boil-frame-bitmap').nth(3).waitFor({ state: 'attached', timeout: 30000 });
    await page.waitForTimeout(4000);
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll('.boil-frame-bitmap')].map((el) => {
        const c = getComputedStyle(el) as CSSStyleDeclaration & Record<string, string>;
        let o = 1; for (let n: Element | null = el; n; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
        const r = el.getBoundingClientRect();
        return `img ${c.maskImage?.slice(0, 18) ?? c.webkitMaskImage?.slice(0, 18)} · repeat ${c.maskRepeat || c.webkitMaskRepeat} · size ${c.maskSize || c.webkitMaskSize} · pos ${c.maskPosition || c.webkitMaskPosition} · eff-opacity ${o.toFixed(3)} · ${r.width.toFixed(0)}×${r.height.toFixed(0)}`;
      }),
    );
    for (const r of rows) console.log(`MASK ${test.info().project.name} ${prm ? 'PRM' : 'live'}: ${r}`);
    await ctx.close();
  });

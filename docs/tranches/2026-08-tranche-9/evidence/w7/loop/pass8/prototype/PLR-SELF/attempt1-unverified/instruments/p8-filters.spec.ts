import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
/**
 * THE ESTATE-RULE FILTER CENSUS (PLR-SELF pass 8 row 7; pass-7 critic gap 5). The rule the pass-6 critic
 * cut and pass 7 cited as 9/11: every element whose COMPUTED `filter` is not `none` and whose `display` is
 * not `none`, counted whether or not it is visible (a hidden grain layer still holds its filter). The
 * visible-only cut (pass 7's banked `filters.mjs`: 5/6/5) is printed beside it, so the two are never
 * confused again. Poses: shut, the @mbabb card open (hover), the lobby open (click). Both themes; the arms
 * are served dists (tree vs control), 1280×800 fine, PRM live, each count polled until two reads agree.
 */
const OUT = process.env.OUT!;
const ARMS = JSON.parse(process.env.ARMS!) as Record<string, string>;
const count = (p: Page) =>
  p.evaluate(() => {
    let estate = 0, visible = 0;
    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (!cs.filter || cs.filter === 'none' || cs.display === 'none') continue;
      estate++;
      const r = el.getBoundingClientRect();
      if (cs.visibility !== 'hidden' && r.width > 0) visible++;
    }
    return `${estate}/${visible}`;
  });
async function stableCount(p: Page) {
  let last = '';
  await expect.poll(async () => { const v = await count(p); const s = v === last; last = v; return s; }, { intervals: [400], timeout: 20000 }).toBe(true);
  return last;
}
for (const theme of ['light', 'dark'] as const)
  for (const [arm, base] of Object.entries(ARMS))
    test(`filters ${theme} ${arm}`, async ({ browser }, info) => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme });
      const p = await ctx.newPage();
      await p.goto(base + '/?size=3&difficulty=EASY');
      await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
      await expect.poll(() => p.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0);
      const idx = (await p.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s)) ?? '')).split('/').pop();
      const shut = await stableCount(p);
      await p.locator('.corner-left .attribution-trigger').hover();
      await expect(p.locator('.corner-left .hover-card')).toHaveClass(/is-open/);
      const card = await stableCount(p);
      let lobby = '-';
      const m = p.locator('[data-player-mark]:visible');
      if (await m.count()) {
        await p.mouse.move(700, 700);
        await m.click();
        await expect(p.locator('[data-lobby]:visible')).toHaveClass(/is-open/);
        lobby = await stableCount(p);
      }
      const l = JSON.stringify({ engine: info.project.name, theme, arm, idx, 'shut/card/lobby (estate/visible)': `${shut} · ${card} · ${lobby}` });
      fs.appendFileSync(OUT, l + '\n'); console.log(l);
      await ctx.close();
    });

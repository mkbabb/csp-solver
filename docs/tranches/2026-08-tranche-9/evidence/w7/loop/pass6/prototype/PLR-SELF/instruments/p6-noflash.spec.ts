/** PLR-SELF pass 6 — does the measured budget ever PAINT a tall frame? 390×800 coarse, seven at the table: a rAF
 *  sampler (plus a MutationObserver) armed before the tap records the lobby's row count in every animation frame
 *  and at every DOM mutation from the tap until the sheet settles. A tall frame would read 4 rows. */
import { test, expect, type Page } from '@playwright/test';
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol('u'); await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true); }
test('no tall frame', async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true });
  const page: Page = await ctx.newPage(); await page.goto('./?size=3&difficulty=EASY&wire=local');
  await expect.poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0);
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await page.locator('.drawer-tab').first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top));
  await verb.click(); await expect.poll(() => page.locator('.players-roster .player-row').count()).toBe(1);
  await page.locator('.drawer-tab').first().click(); await expect(page.locator('#controls-drawer .drawer-case')).toBeHidden();
  await page.evaluate(() => { const room = new URL(location.href).searchParams.get('s')!; const ch = new BroadcastChannel(`board:${room}`); for (let i = 0; i < 6; i++) ch.postMessage({ kind: 'hi', data: {}, from: `nf-${i}` }); setTimeout(() => ch.close(), 0); });
  await expect.poll(() => page.locator('.players-roster .player-row').count()).toBe(7);
  for (let round = 0; round < 3; round++) {
    await page.evaluate(() => {
      const w = window as any; w.__frames = []; w.__muts = [];
      const lob = [...document.querySelectorAll<HTMLElement>('[data-lobby]')].find((e) => getComputedStyle(e.closest('.corner-left, .mobile-attribution')!).display !== 'none')!;
      const rows = () => String(lob.querySelectorAll('.pl-row').length);
      const mo = new MutationObserver(() => w.__muts.push(rows() + '@' + Math.round(performance.now() - t0)));
      mo.observe(lob, { childList: true, subtree: true });
      const t0 = performance.now();
      const tick = () => { { const cs = getComputedStyle(lob); w.__frames.push(rows() + '@' + Math.round(performance.now() - t0) + ':' + cs.visibility[0] + cs.opacity); } if (performance.now() - t0 < 600) requestAnimationFrame(tick); else mo.disconnect(); };
      requestAnimationFrame(tick);
    });
    await page.locator('[data-player-mark]:visible').tap();
    await expect(page.locator('[data-player-mark]:visible')).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(() => page.evaluate(() => { const f = (window as any).__frames as string[]; return f.length && +f[f.length - 1].split('@')[1].split(':')[0] >= 600; })).toBe(true);
    const r = await page.evaluate(() => ({ frames: (window as any).__frames as string[], muts: (window as any).__muts as string[] }));
    // a TALL FRAME = a frame painted with the sheet visible (visibility v, opacity > 0) and more than one row
    const tall = r.frames.filter((f) => { const [n, rest] = f.split('@'); const vis = rest.split(':')[1]; return +n > 1 && vis[0] === 'v' && +vis.slice(1) > 0; });
    console.log('NOFLASH', info.project.name, 'round', round, 'frames', r.frames.length, 'tallFrames', tall.length, 'mutations', JSON.stringify(r.muts), 'first', r.frames.slice(0, 4).join(' | '), 'tall', tall.slice(0, 3).join(' | '));
    await page.locator('[data-player-mark]:visible').tap();
    await expect(page.locator('[data-player-mark]:visible')).toHaveAttribute('aria-expanded', 'false');
  }
  await ctx.close();
});

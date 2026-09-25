import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
const OUT = process.env.OUT!;
const count = (p: Page) => p.evaluate(() => { const o: string[] = []; for (const el of document.querySelectorAll('*')) { const cs = getComputedStyle(el); if (cs.filter && cs.filter !== 'none' && cs.display !== 'none') o.push(el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.')); } return o; });
async function stableCount(p: Page) { let last = ''; await expect.poll(async () => { const v = JSON.stringify(await count(p)); const s = v === last; last = v; return s; }, { intervals: [400], timeout: 20000 }).toBe(true); return JSON.parse(last) as string[]; }
for (const theme of ['light', 'dark'] as const) for (const [name, base] of [['control', 'http://127.0.0.1:4247'], ['tree', 'http://127.0.0.1:4246']] as const)
  test(`filters ${theme} ${name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme });
    const p = await ctx.newPage(); await p.goto(base + '/?size=3&difficulty=EASY');
    await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 }); const boot = (await count(p)).length;
    await expect.poll(() => p.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0);
    const idx = await p.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s)) ?? '');
    const shut = (await stableCount(p)).length;
    await p.locator('.corner-left .attribution-trigger').hover();
    await expect(p.locator('.corner-left .hover-card')).toHaveClass(/is-open/);
    const card = (await stableCount(p)).length;
    let lobby = -1;
    const m = p.locator('[data-player-mark]:visible');
    if (await m.count()) { await p.mouse.move(700, 700); await m.click(); await expect(p.locator('[data-lobby]:visible')).toHaveClass(/is-open/); lobby = (await stableCount(p)).length; }
    const l = JSON.stringify({ engine: info.project.name, theme, name, idx: idx.split('/').pop(), filters: `${shut}/${card}/${lobby}`, boot });
    fs.appendFileSync(OUT, l + '\n'); console.log(l);
    await ctx.close();
  });

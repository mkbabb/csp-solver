// pi-rest.spec.ts (MOT-VERB pass 9 scratch instrument, never banked): the board at rest, photographed on two
// served builds (PI_A, PI_B ports), same payload, same cell; prints the differing-pixel count per cell. Under PRM
// by default: the grid's boil swaps four poses on a beat at rest, so a live-motion photograph is a phase sample
// (the first live read, tree vs the pass-8 bytes, was byte-identical on one cell and 19-38k px apart on three);
// PI_PRM=0 restores the live regime.
import { test, expect } from '@playwright/test';
import { encodeSudoku } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend/e2e/wire';
// prettier-ignore
const S9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const BL = new Set([0, 4, 10, 22, 36, 40, 55, 61, 73, 80]);
const BOARD = encodeSudoku(3, Object.fromEntries(S9.map((v, i) => [i, BL.has(i) ? 0 : v])), 81);
const CELLS = [
  { name: 'desk light', w: 1280, h: 800, dpr: 1, scheme: 'light' },
  { name: 'desk dark', w: 1280, h: 800, dpr: 1, scheme: 'dark' },
  { name: 'phone light', w: 390, h: 844, dpr: 2, scheme: 'light' },
  { name: 'phone dark', w: 390, h: 844, dpr: 2, scheme: 'dark' },
] as const;
async function shot(browser: import('@playwright/test').Browser, port: string, c: (typeof CELLS)[number]) {
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, deviceScaleFactor: c.dpr, colorScheme: c.scheme, reducedMotion: process.env.PI_PRM === '0' ? 'no-preference' : 'reduce' });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/?game=sudoku&board=${BOARD}`);
  await expect(page.locator('.boil-frame-bitmap')).toHaveCount(4, { timeout: 30000 });
  await expect(page.locator('.board-cells [aria-label*="given clue"]')).toHaveCount(71);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(4000); // the wave and the settle done
  const box = (await page.locator('svg.hand-drawn-grid').first().boundingBox())!;
  const buf = await page.screenshot({ clip: { x: box.x - 12, y: box.y - 12, width: box.width + 24, height: box.height + 24 }, animations: 'disabled' });
  await ctx.close();
  return buf;
}
for (const c of CELLS)
  test(`pi rest ${c.name}`, async ({ browser }) => {
    const a = await shot(browser, process.env.PI_A!, c);
    const b = await shot(browser, process.env.PI_B!, c);
    const same = a.equals(b);
    const page = await browser.newPage();
    const r = await page.evaluate(async ([x, y]) => {
      const load = (s: string) => new Promise<HTMLImageElement>((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + s; });
      const [ia, ib] = await Promise.all([load(x), load(y)]);
      const px = (i: HTMLImageElement) => { const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d')!; g.drawImage(i, 0, 0); return g.getImageData(0, 0, i.width, i.height).data; };
      const da = px(ia), db = px(ib);
      let n = 0, max = 0;
      for (let k = 0; k < Math.min(da.length, db.length); k += 4) {
        const d = Math.max(Math.abs(da[k] - db[k]), Math.abs(da[k + 1] - db[k + 1]), Math.abs(da[k + 2] - db[k + 2]));
        if (d > 0) n++;
        if (d > max) max = d;
      }
      return { n, max, wa: ia.width, ha: ia.height, wb: ib.width, hb: ib.height };
    }, [a.toString('base64'), b.toString('base64')]);
    await page.close();
    console.log(`PI ${test.info().project.name} ${c.name}: ${r.wa}x${r.ha} vs ${r.wb}x${r.hb} · bytes ${same ? 'IDENTICAL' : 'differ'} · differing px ${r.n} · max channel delta ${r.max}`);
  });

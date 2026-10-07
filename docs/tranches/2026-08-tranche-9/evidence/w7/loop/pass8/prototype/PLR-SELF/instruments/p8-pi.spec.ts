import { test, expect, type Browser } from '@playwright/test';
import fs from 'node:fs';
/** π, whole page, at rest: the tree's dist against the 74a2b5d9 control, each arm loaded twice. The floor is
 *  the control against itself (two loads); a pixel counts when it moved ≥ 6/255 on any channel. Every delta's
 *  bounding box is printed so a claimed surface (the head's mark) can be told from an unclaimed one. */
const OUT = process.env.OUT!;
const ARMS = JSON.parse(process.env.ARMS!) as Record<string, string>;
const VIEWS = [[1280, 800, false], [390, 844, true]] as const;
async function shot(browser: Browser, base: string, w: number, h: number, coarse: boolean, scheme: 'light' | 'dark') {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse, colorScheme: scheme, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(base + '/?size=3&difficulty=EASY&board=' + encodeURIComponent(process.env.PAYLOAD ?? ''));
  await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  await expect.poll(() => p.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0);
  await expect.poll(() => p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length), { timeout: 30000 }).toBe(0);
  await p.mouse.move(w - 2, h - 2);
  const b64 = (await p.screenshot({ animations: 'disabled' })).toString('base64');
  const idx = (await p.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s)) ?? '')).split('/').pop();
  return { ctx, p, b64, idx };
}
for (const scheme of ['light', 'dark'] as const)
  for (const [w, h, coarse] of VIEWS)
    test(`pi ${scheme} ${w}x${h}`, async ({ browser }, info) => {
      const c1 = await shot(browser, ARMS.control, w, h, coarse, scheme);
      const c2 = await shot(browser, ARMS.control, w, h, coarse, scheme);
      const t1 = await shot(browser, ARMS.tree, w, h, coarse, scheme);
      const diff = await c1.p.evaluate(async ({ a, b, c }) => {
        const px = async (s: string) => { const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${s}`)).blob()); const cv = new OffscreenCanvas(bmp.width, bmp.height); const x = cv.getContext('2d')!; x.drawImage(bmp, 0, 0); return x.getImageData(0, 0, bmp.width, bmp.height); };
        const [A, B, C] = [await px(a), await px(b), await px(c)];
        const cmp = (P: ImageData, Q: ImageData) => { let n = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1; for (let i = 0; i < P.data.length; i += 4) { if (Math.max(Math.abs(P.data[i] - Q.data[i]), Math.abs(P.data[i + 1] - Q.data[i + 1]), Math.abs(P.data[i + 2] - Q.data[i + 2])) < 6) continue; n++; const k = i / 4, x = k % P.width, y = (k / P.width) | 0; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return { n, box: n ? [x0, y0, x1, y1] : null }; };
        return { floor: cmp(A, B), tree: cmp(A, C) };
      }, { a: c1.b64, b: c2.b64, c: t1.b64 });
      const l = JSON.stringify({ eng: info.project.name, scheme, view: `${w}x${h}${coarse ? ' coarse' : ''}`, control: c1.idx, tree: t1.idx, ...diff });
      fs.appendFileSync(OUT, l + '\n'); console.log(l);
      for (const c of [c1, c2, t1]) await c.ctx.close();
    });

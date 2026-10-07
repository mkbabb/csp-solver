import { test, expect, type Browser } from '@playwright/test';
import fs from 'node:fs';
/** π's bimodal board: each arm loaded N times (chromium or webkit, a scheme, 1280×800 fine, PRM, one payload);
 *  every shot is compared with the CONTROL's first shot, pixels moved ≥ 6/255, split at x = 120 (left of 120 is
 *  the head's mark, the claimed surface; the rest is unclaimed). Interleaved control/tree loads. */
const OUT = process.env.OUT!;
const ARMS = JSON.parse(process.env.ARMS!) as Record<string, string>;
const N = Number(process.env.N ?? 6);
async function shot(browser: Browser, base: string, scheme: 'light' | 'dark') {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(base + '/?size=3&difficulty=EASY&board=' + encodeURIComponent(process.env.PAYLOAD ?? ''));
  await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 });
  await expect.poll(() => p.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0);
  await expect.poll(() => p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length), { timeout: 30000 }).toBe(0);
  await p.mouse.move(1278, 798);
  const b64 = (await p.screenshot({ animations: 'disabled' })).toString('base64');
  return { ctx, p, b64 };
}
for (const scheme of ['light', 'dark'] as const)
  test(`pimode ${scheme}`, async ({ browser }, info) => {
    test.setTimeout(900000);
    const ref = await shot(browser, ARMS.control, scheme);
    const rows: string[] = [];
    for (let i = 0; i < N; i++) for (const arm of ['control', 'tree']) {
      const s = await shot(browser, ARMS[arm], scheme);
      const d = await ref.p.evaluate(async ({ a, b }) => {
        const px = async (s: string) => { const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${s}`)).blob()); const cv = new OffscreenCanvas(bmp.width, bmp.height); const x = cv.getContext('2d')!; x.drawImage(bmp, 0, 0); return x.getImageData(0, 0, bmp.width, bmp.height); };
        const [A, B] = [await px(a), await px(b)];
        let mark = 0, rest = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
        for (let i = 0; i < A.data.length; i += 4) { if (Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2])) < 6) continue; const k = i / 4, x = k % A.width, y = (k / A.width) | 0; if (x < 120) mark++; else { rest++; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } }
        return { mark, rest, box: rest ? [x0, y0, x1, y1] : null };
      }, { a: ref.b64, b: s.b64 });
      const l = JSON.stringify({ eng: info.project.name, scheme, i, arm, ...d });
      fs.appendFileSync(OUT, l + '\n'); rows.push(l);
      await s.ctx.close();
    }
    await ref.ctx.close();
    console.log(rows.join('\n'));
  });

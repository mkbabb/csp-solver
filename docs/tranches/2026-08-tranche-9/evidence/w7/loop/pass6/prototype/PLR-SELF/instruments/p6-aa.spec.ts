/** PLR-SELF pass 6 — AA on TEXT, the GLYPH-TEXT statistic (LAWS P5 / registry-v5 §2.11). Photograph the element with
 *  its text, again (the SECOND bare photograph), then with its text `color: transparent` (the painted ground). The
 *  population = every pixel that changed (max channel |Δ| ≥ 4); each pixel's COVERAGE = |L(text) − L(ground)| /
 *  |L(ink over that ground) − L(ground)|, the ink being the element's computed colour composited by its own alpha —
 *  keyed on the glyph, never on the crop's maximum. Core = coverage ≥ 0.5; the row = the core median contrast
 *  (text px vs its own ground px) and the fraction of core pixels under 4.5. DPR 1 and 2, both themes. */
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import sharp from 'sharp';
const OUT = process.env.OUT!;
const CTRL = process.env.CTRL ?? 'http://127.0.0.1:4230', MINE = process.env.MINE ?? 'http://127.0.0.1:4231';
async function settled(p: Page) { await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 }); await expect.poll(() => p.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0); }
const L = (r: number, g: number, b: number) => { const f = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
async function raw(p: Page, clip: any) { const { data, info } = await sharp(await p.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); return { data, ch: info.channels, n: info.width * info.height }; }
async function glyphText(p: Page, sel: string, tag: string) {
  const el = p.locator(sel).first();
  await el.evaluate((e, t) => e.setAttribute('data-aa-probe', t), tag);
  const b = (await el.boundingBox())!;
  const clip = { x: Math.floor(b.x) - 2, y: Math.floor(b.y) - 2, width: Math.ceil(b.width) + 4, height: Math.ceil(b.height) + 4 };
  const ink = await el.evaluate((e) => { const c = document.createElement('canvas'); c.width = c.height = 1; const x = c.getContext('2d')!; x.fillStyle = getComputedStyle(e).color; x.fillRect(0, 0, 1, 1); return [...x.getImageData(0, 0, 1, 1).data]; });
  const A = await raw(p, clip), A2 = await raw(p, clip);
  const t = await p.addStyleTag({ content: `[data-aa-probe="${tag}"], [data-aa-probe="${tag}"] * { color: transparent !important; }` });
  const B = await raw(p, clip); await t.evaluate((e) => e.remove());
  const stat = (T: typeof A) => {
    const core: number[] = []; let changed = 0;
    for (let i = 0; i < T.n; i++) {
      const o = i * T.ch; const d = Math.max(Math.abs(T.data[o] - B.data[o]), Math.abs(T.data[o + 1] - B.data[o + 1]), Math.abs(T.data[o + 2] - B.data[o + 2]));
      if (d < 4) continue; changed++;
      const a = ink[3] / 255; const ic = [0, 1, 2].map((k) => a * ink[k] + (1 - a) * B.data[o + k]);
      const lg = L(B.data[o], B.data[o + 1], B.data[o + 2]), lt = L(T.data[o], T.data[o + 1], T.data[o + 2]), li = L(ic[0], ic[1], ic[2]);
      const cov = Math.abs(li - lg) < 1e-6 ? 0 : Math.abs(lt - lg) / Math.abs(li - lg);
      if (cov >= 0.5) core.push(ratio(lt, lg));
    }
    core.sort((x, y) => x - y);
    return { changed, core: core.length, median: core.length ? +core[Math.floor(core.length / 2)].toFixed(3) : null, under45: core.length ? +(core.filter((c) => c < 4.5).length / core.length).toFixed(3) : null, best: core.length ? +core[core.length - 1].toFixed(3) : null };
  };
  const inkRatio = +ratio(L(ink[0], ink[1], ink[2]), L(B.data[0], B.data[1], B.data[2])).toFixed(3);
  return { text: (await el.textContent())?.trim(), ink: ink.join(','), inkOverCorner: inkRatio, first: stat(A), second: stat(A2) };
}
for (const dpr of [1, 2]) for (const theme of ['light', 'dark'] as const)
  test(`aa dpr${dpr} ${theme}`, async ({ browser }, info) => {
    const res: any = { engine: info.project.name, dpr, theme };
    for (const [name, base] of [['ctrl', CTRL], ['mine', MINE]] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, colorScheme: theme, reducedMotion: 'reduce' });
      const p = await ctx.newPage(); await p.goto(`${base}/?size=3&difficulty=EASY`); await settled(p);
      await p.locator('.corner-left .attribution-trigger').hover();
      await expect.poll(() => p.locator('.corner-left .hover-card').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
      res[name] = { caption: await glyphText(p, '.corner-left .hover-card p.italic', 'cap') };
      if (name === 'mine') {
        await p.mouse.move(700, 700);
        await p.locator('[data-player-mark]:visible').click();
        await expect.poll(() => p.locator('[data-lobby]:visible').evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
        res[name].state = await glyphText(p, '[data-lobby]:visible .pl-state', 'state');
        res[name].you = await glyphText(p, '[data-lobby]:visible .pl-qual', 'you');
      }
      await ctx.close();
    }
    fs.appendFileSync(OUT, JSON.stringify(res) + '\n'); console.log('P6AA ' + JSON.stringify(res));
  });

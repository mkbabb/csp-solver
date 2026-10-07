import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { settled, stable, mark, lobby } from './lib';
const OUT = process.env.OUT!;
/** Row 9: pass 7's chromium-light G4 slice 13 (2.69 on the clean state line). The pass-7 port cut the
 *  40.5 px run into 16 slices of 2.53 px at DPR 1; this reads, per device column of the run, the glyph
 *  pixels (moved ≥ 6/255 ON vs OFF) and their contrast, and names the character each column lies in. */
for (const dpr of [1, 2]) for (const scheme of ['light', 'dark'] as const) test(`slice ${scheme} dpr${dpr}`, async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, colorScheme: scheme, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('./?size=3&difficulty=EASY&wire=local');
  await settled(page);
  await mark(page).click();
  await expect(lobby(page)).toHaveClass(/is-open/);
  await stable(() => lobby(page).evaluate((e) => getComputedStyle(e).opacity));
  const sub = page.locator('.corner-left [data-lobby] .pl-state');
  const geo = await sub.evaluate((el) => {
    const r = document.createRange(); r.selectNodeContents(el);
    const run = r.getBoundingClientRect();
    const t = el.firstChild as Text; const chars: { c: string; l: number; r: number }[] = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n: Node | null; 
    while ((n = walker.nextNode())) for (let i = 0; i < (n as Text).length; i++) { const q = document.createRange(); q.setStart(n, i); q.setEnd(n, i + 1); const b = q.getBoundingClientRect(); chars.push({ c: (n as Text).data[i], l: +(b.left - run.left).toFixed(2), r: +(b.right - run.left).toFixed(2) }); }
    return { run: { x: run.left, y: run.top, w: run.width, h: run.height }, text: el.textContent, chars, font: getComputedStyle(el).font, color: getComputedStyle(el).color };
  });
  const clip = { x: Math.floor(geo.run.x), y: Math.floor(geo.run.y), width: Math.ceil(geo.run.w) + 1, height: Math.ceil(geo.run.h) };
  const on = (await page.screenshot({ clip, animations: 'disabled' })).toString('base64');
  const tag = await page.addStyleTag({ content: '.corner-left [data-lobby] .pl-state { color: transparent !important; -webkit-text-fill-color: transparent !important; }' });
  const off = (await page.screenshot({ clip, animations: 'disabled' })).toString('base64');
  await tag.evaluate((e) => (e as Element).remove());
  const cols = await page.evaluate(async ({ on, off }) => {
    const px = async (b64: string) => { const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob()); const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height; const x = c.getContext('2d')!; x.drawImage(bmp, 0, 0); return x.getImageData(0, 0, c.width, c.height); };
    const lum = (d: Uint8ClampedArray, i: number) => { const f = (v: number) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2]); };
    const [A, B] = [await px(on), await px(off)];
    const out: { x: number; n: number; max: number; p95: number }[] = [];
    for (let x = 0; x < A.width; x++) { const v: number[] = []; for (let y = 0; y < A.height; y++) { const i = (y * A.width + x) * 4; if (Math.max(Math.abs(A.data[i] - B.data[i]), Math.abs(A.data[i + 1] - B.data[i + 1]), Math.abs(A.data[i + 2] - B.data[i + 2])) < 6) continue; const [p, q] = [lum(A.data, i), lum(B.data, i)]; v.push((Math.max(p, q) + 0.05) / (Math.min(p, q) + 0.05)); } v.sort((a, b) => a - b); out.push({ x, n: v.length, max: v.length ? +v[v.length - 1].toFixed(2) : 0, p95: v.length ? +v[Math.min(v.length - 1, Math.floor(v.length * 0.95))].toFixed(2) : 0 }); }
    return out;
  }, { on, off });
  const l = JSON.stringify({ eng: info.project.name, scheme, dpr, geo, clipX: clip.x - geo.run.x, cols });
  fs.appendFileSync(OUT, l + '\n'); console.log(l.slice(0, 300));
  await ctx.close();
});

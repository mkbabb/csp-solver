/** CRITIC c5 — dist vs control dist: filters (estate rule) shut/card/lobby, and the card's painted edge + corners, one minted payload, noise arm. */
import { test, expect, type Browser, type Page } from '@playwright/test';
import fs from 'node:fs';
import sharp from 'sharp';
const OUT = process.env.OUT!;
const CTRL = 'http://127.0.0.1:4243', MINE = 'http://127.0.0.1:4242';
const count = (p: Page) => p.evaluate(() => { const o: string[] = []; for (const el of document.querySelectorAll('*')) { const cs = getComputedStyle(el); if (cs.filter && cs.filter !== 'none' && cs.display !== 'none') o.push(el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.')); } return o; });
async function stableCount(p: Page) { let last = ''; await expect.poll(async () => { const v = JSON.stringify(await count(p)); const s = v === last; last = v; return s; }, { intervals: [400], timeout: 20000 }).toBe(true); return JSON.parse(last) as string[]; }
async function settled(p: Page) { await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 }); await expect.poll(() => p.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0); }
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>('.sudoku-cell input')].map((i) => (/given clue/.test(i.getAttribute('aria-label') ?? '') && i.value ? i.value : '0')).join(''));
const b64 = (s: string) => Buffer.from(s, 'latin1').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const lum = (r: number, g: number, b: number) => { const f = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
async function openCard(p: Page) {
  await p.locator('.corner-left .attribution-trigger').hover();
  const card = p.locator('.corner-left .hover-card');
  await expect(card).toHaveClass(/is-open/);
  let last = ''; await expect.poll(async () => { const v = await card.evaluate((e) => getComputedStyle(e).opacity + '|' + JSON.stringify(e.getBoundingClientRect())); const s = v === last; last = v; return s && v.startsWith('1|'); }, { intervals: [150], timeout: 8000 }).toBe(true);
  const r = await card.evaluate((e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; });
  const png = await p.screenshot({ clip: { x: r.x, y: r.y, width: r.w, height: r.h } });
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  return { r, data, W: info.width, H: info.height, ch: info.channels };
}
function edgeStat(s: { data: Buffer; W: number; H: number; ch: number }) {
  const px = (x: number, y: number) => { const i = (y * s.W + x) * s.ch; return [s.data[i], s.data[i + 1], s.data[i + 2]]; };
  const cols: number[] = [];
  for (let x = Math.floor(s.W * 0.2); x < Math.floor(s.W * 0.8); x++) {
    const g = px(x, 10); const gl = lum(g[0], g[1], g[2]);
    let best = 1; for (let y = 0; y < 5; y++) { const q = px(x, y); best = Math.max(best, ratio(lum(q[0], q[1], q[2]), gl)); }
    cols.push(best);
  }
  cols.sort((a, b) => a - b);
  return { median: +cols[Math.floor(cols.length / 2)].toFixed(3), under3: +(cols.filter((c) => c < 3).length / cols.length).toFixed(3), n: cols.length };
}
function cornerMoved(a: { data: Buffer; W: number; ch: number }, b: { data: Buffer; W: number; ch: number }, R = 16) {
  let outside = 0, moved = 0;
  for (const [cx, sx] of [[R, 1], [a.W - R, -1]] as const) for (let dy = 0; dy < R; dy++) for (let dx = 0; dx < R; dx++) {
    const x = sx === 1 ? dx : a.W - 1 - dx, y = dy; const ex = x + 0.5 - cx, ey = y + 0.5 - R;
    if ((sx === 1 ? x + 0.5 < cx : x + 0.5 > cx) && y + 0.5 < R && ex * ex + ey * ey > R * R) { outside++; const i = (y * a.W + x) * a.ch; const j = (y * b.W + x) * b.ch; const d = Math.max(Math.abs(a.data[i] - b.data[j]), Math.abs(a.data[i + 1] - b.data[j + 1]), Math.abs(a.data[i + 2] - b.data[j + 2])); if (d >= 40) moved++; }
  }
  return { outside, moved };
}
for (const theme of ['light', 'dark'] as const)
  test(`dist ${theme}`, async ({ browser }, info) => {
    const mk = async (base: string, q = '') => { const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme }); const p = await ctx.newPage(); await p.goto(base + '/?size=3&difficulty=EASY' + q); await settled(p); return { ctx, p }; };
    const seed = await mk(CTRL); const g0 = await givens(seed.p); await seed.ctx.close();
    const payload = b64(String.fromCharCode(1) + '3.' + [...g0].map((c) => (+c).toString(36)).join(''));
    const q = `&board=${payload}`;
    const res: any = { engine: info.project.name, theme, payload: payload.slice(0, 18) + '…', givens: g0.replace(/0/g, '').length };
    const shots: any = {};
    for (const [name, base] of [['ctrl', CTRL], ['ctrl2', CTRL], ['mine', MINE]] as const) {
      const { ctx, p } = await mk(base, q);
      const g = await givens(p); res[name + 'SameGivens'] = g === g0;
      await expect.poll(() => p.locator('svg.hand-drawn-grid g.boil-frame-layer.baked-hidden').count(), { timeout: 30000 }).toBe(0).catch(() => {});
      const shut = (await stableCount(p)).length;
      const s = await openCard(p); shots[name] = s;
      const card = (await stableCount(p)).length;
      let lobby: number | string = '-';
      const m = p.locator('[data-player-mark]:visible');
      if (await m.count()) { await p.mouse.move(700, 700); await m.click(); await p.waitForTimeout(400); lobby = (await stableCount(p)).length; }
      res[name] = { filters: `${shut}/${card}/${lobby}`, rect: s.r, edge: edgeStat(s) };
      await ctx.close();
    }
    res.cornersNoise = cornerMoved(shots.ctrl, shots.ctrl2);
    res.cornersMine = cornerMoved(shots.ctrl, shots.mine);
    fs.appendFileSync(OUT, JSON.stringify(res) + '\n'); console.log('C5DIST ' + JSON.stringify(res));
  });

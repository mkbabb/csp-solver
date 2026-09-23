/** PLR-SELF pass 6 — dist vs control dist (copy of the pass-5 critic's c5-dist, OUT re-pointed): filters (estate rule)
 *  shut/card/lobby, the card's AND the lobby's painted edge with the edge-OFF subtraction, the card's corners outside the
 *  ground's 16px radius, one minted payload per theme, a control-vs-control noise arm, and BOTH edge arms (full/quiet). */
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import sharp from 'sharp';
const OUT = process.env.OUT!;
const CTRL = process.env.CTRL ?? 'http://127.0.0.1:4230', FULL = process.env.FULL ?? 'http://127.0.0.1:4231', QUIET = process.env.QUIET ?? 'http://127.0.0.1:4233';
const count = (p: Page) => p.evaluate(() => { const o: string[] = []; for (const el of document.querySelectorAll('*')) { const cs = getComputedStyle(el); if (cs.filter && cs.filter !== 'none' && cs.display !== 'none') o.push(el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.')); } return o; });
async function stableCount(p: Page) { let last = ''; await expect.poll(async () => { const v = JSON.stringify(await count(p)); const s = v === last; last = v; return s; }, { intervals: [400], timeout: 20000 }).toBe(true); return JSON.parse(last) as string[]; }
async function settled(p: Page) { await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 }); await expect.poll(() => p.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0); }
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll('.sudoku-cell input')].map((i) => /given clue (\d)/.exec(i.getAttribute('aria-label') ?? '')?.[1] ?? '0').join(''));
const b64 = (s: string) => Buffer.from(s, 'latin1').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const lum = (r: number, g: number, b: number) => { const f = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
type Shot = { r: any; data: Buffer; W: number; H: number; ch: number };
async function shot(p: Page, sel: string): Promise<Shot> {
  const el = p.locator(sel).first();
  const r = await el.evaluate((e) => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; });
  const png = await p.screenshot({ clip: { x: r.x, y: r.y, width: r.w, height: r.h } });
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  return { r, data, W: info.width, H: info.height, ch: info.channels };
}
async function settle(p: Page, sel: string) { const el = p.locator(sel).first(); let last = ''; await expect.poll(async () => { const v = await el.evaluate((e) => getComputedStyle(e).opacity + '|' + JSON.stringify(e.getBoundingClientRect())); const s = v === last; last = v; return s && v.startsWith('1|'); }, { intervals: [150], timeout: 8000 }).toBe(true); }
async function edgePair(p: Page, sel: string) {
  const on = await shot(p, sel);
  const t = await p.addStyleTag({ content: '.head-sheet-edge { visibility: hidden !important; }' });
  const off = await shot(p, sel); await t.evaluate((e) => e.remove());
  return { on, off };
}
function edgeStat(s: Shot, off?: Shot) {
  const px = (q: Shot, x: number, y: number) => { const i = (y * q.W + x) * q.ch; return lum(q.data[i], q.data[i + 1], q.data[i + 2]); };
  const col = (q: Shot, x: number) => { const g = px(q, x, 10); let best = 1; for (let y = 0; y < 5; y++) best = Math.max(best, ratio(px(q, x, y), g)); return best; };
  const on: number[] = [], offs: number[] = [];
  for (let x = Math.floor(s.W * 0.2); x < Math.floor(s.W * 0.8); x++) { on.push(col(s, x)); if (off) offs.push(col(off, x)); }
  const med = (a: number[]) => { const b = [...a].sort((x, y) => x - y); return +b[Math.floor(b.length / 2)].toFixed(3); };
  return { median: med(on), under3: +(on.filter((c) => c < 3).length / on.length).toFixed(3), offMedian: offs.length ? med(offs) : null, n: on.length };
}
function cornerMoved(a: Shot, b: Shot, R = 16) {
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
    const payload = b64(String.fromCharCode(1) + '3.' + g0);
    const q = `&board=${payload}`;
    const res: any = { engine: info.project.name, theme, payload: payload.slice(0, 18) + '…', givens: g0.replace(/0/g, '').length };
    const shots: any = {};
    for (const [name, base] of [['ctrl', CTRL], ['ctrl2', CTRL], ['full', FULL], ['quiet', QUIET]] as const) {
      const { ctx, p } = await mk(base, q);
      res[name + 'SameGivens'] = (await givens(p)) === g0;
      const shut = (await stableCount(p)).length;
      await p.locator('.corner-left .attribution-trigger').hover();
      await settle(p, '.corner-left .hover-card');
      const card = name.startsWith('ctrl') ? { on: await shot(p, '.corner-left .hover-card'), off: undefined } : await edgePair(p, '.corner-left .hover-card');
      shots[name] = card.on;
      const nCard = (await stableCount(p)).length;
      let nLobby: number | string = '-', lobbyEdge: any = '-';
      const m = p.locator('[data-player-mark]:visible');
      if (await m.count()) { await p.mouse.move(700, 700); await m.click(); await settle(p, '[data-lobby]:visible'); nLobby = (await stableCount(p)).length; const lp = await edgePair(p, '[data-lobby]:visible'); lobbyEdge = edgeStat(lp.on, lp.off); }
      res[name] = { filters: `${shut}/${nCard}/${nLobby}`, rect: card.on.r, cardEdge: edgeStat(card.on, card.off), lobbyEdge };
      await ctx.close();
    }
    res.cornersNoise = cornerMoved(shots.ctrl, shots.ctrl2);
    res.cornersFull = cornerMoved(shots.ctrl, shots.full);
    res.cornersQuiet = cornerMoved(shots.ctrl, shots.quiet);
    fs.appendFileSync(OUT, JSON.stringify(res) + '\n'); console.log('P6DIST ' + JSON.stringify(res));
  });

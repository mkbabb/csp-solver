// G-BAR crops — the four the brief names. usage: node crops.mjs <outDir>
// proto 127.0.0.1:4259 (?lip=tab for the ballot arm); pinned ?board= payload; DPR 2, palette PNG.
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-21/web/frontend/package.json');
const pw = require('playwright'); const sharp = require('sharp');
const OUT = process.argv[2];
const BOARD = 'ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw';
const url = (tab) => `http://127.0.0.1:4259/?board=${BOARD}${tab ? '&lip=tab' : ''}`;

async function page(b, { vp, touch, theme, tab }) {
  const ctx = await b.newContext({ viewport: vp, hasTouch: touch, isMobile: touch && vp.width < 1024, colorScheme: theme, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(url(tab), { waitUntil: 'load' });
  await p.waitForSelector('svg.handwritten-logo');
  await p.waitForFunction(() => document.querySelectorAll('.sudoku-cell .glyph-svg').length > 0);
  const t = p.locator('.drawer-tab').first();
  if ((await t.getAttribute('aria-expanded')) === 'false') { if (touch) await t.tap(); else await t.click(); }
  let last = '', same = 0; const t0 = Date.now();
  while (Date.now() - t0 < 5000) { const s = await p.evaluate(() => JSON.stringify(document.querySelector('.controls-card').getBoundingClientRect())); if (s === last) { if (++same >= 3) break; } else same = 0; last = s; await p.waitForTimeout(120); }
  return { p, ctx };
}
const leak = (p) => p.evaluate(() => { const sc = document.querySelector('.card-body'); const w = [...document.querySelectorAll('.control-panel-wrap .tray-well')][1]; const sr = w.querySelector(':scope > .outline-svg').getBoundingClientRect(); sc.scrollTop += (sr.top + 4) - (sc.getBoundingClientRect().bottom - 12); });
const end = (p) => p.evaluate(() => { const sc = document.querySelector('.card-body'); sc.scrollTop = sc.scrollHeight; });
async function shot(p, below, above = 120) {
  await p.waitForTimeout(450);
  const r = await p.evaluate(() => { const c = document.querySelector('.controls-card').getBoundingClientRect(); const b = document.querySelector('.action-bar').getBoundingClientRect(); return { cx: c.x, cw: c.width, by: b.y, bb: b.bottom, vh: innerHeight, vw: innerWidth }; });
  const x = Math.max(0, r.cx - 8), w = Math.min(r.vw - x, r.cw + 16);
  const y = Math.max(0, r.by - above), h = Math.min(r.vh - y, (below === 'vp' ? r.vh : r.bb + below) - y);
  return p.screenshot({ clip: { x, y, width: w, height: h }, scale: 'device' });
}
const save = async (buf, name) => { const o = `${OUT}/${name}`; await sharp(buf).png({ palette: true, quality: 70, compressionLevel: 9 }).toFile(o); return o; };
async function twoUp(a, b2) { const A = await sharp(a).metadata(), B = await sharp(b2).metadata(); const gap = 16; return sharp({ create: { width: A.width + B.width + gap, height: Math.max(A.height, B.height), channels: 3, background: { r: 128, g: 128, b: 128 } } }).composite([{ input: a, left: 0, top: 0 }, { input: b2, left: A.width + gap, top: 0 }]).png().toBuffer(); }

const cr = await pw.chromium.launch(); const wk = await pw.webkit.launch();
{ const { p, ctx } = await page(cr, { vp: { width: 1280, height: 800 }, touch: false, theme: 'dark' }); await leak(p); console.log(await save(await shot(p, 70, 150), 'c1-chromium-dark-1280x800-fine-leakpose-lip1.5.png')); await ctx.close(); }
{ const { p, ctx } = await page(wk, { vp: { width: 390, height: 844 }, touch: true, theme: 'light' }); await leak(p); console.log(await save(await shot(p, 'vp', 150), 'c2-webkit-light-390x844-coarse-dock-leakpose-foot-on-pad.png')); await ctx.close(); }
{ const a = await page(cr, { vp: { width: 1280, height: 800 }, touch: false, theme: 'light' }); await end(a.p); const A = await shot(a.p, 70, 150); await a.ctx.close();
  const b2 = await page(cr, { vp: { width: 1280, height: 800 }, touch: false, theme: 'light', tab: true }); await end(b2.p); const B = await shot(b2.p, 70, 150); await b2.ctx.close();
  console.log(await save(await twoUp(A, B), 'c3-chromium-light-1280x800-fine-scrollend-twoup-lip1.5-vs-2.5.png')); }
{ const a = await page(wk, { vp: { width: 390, height: 844 }, touch: true, theme: 'light' }); await end(a.p); const A = await shot(a.p, 'vp', 150); await a.ctx.close();
  const b2 = await page(wk, { vp: { width: 390, height: 844 }, touch: true, theme: 'light', tab: true }); await end(b2.p); const B = await shot(b2.p, 'vp', 150); await b2.ctx.close();
  console.log(await save(await twoUp(A, B), 'c4-webkit-light-390x844-coarse-scrollend-twoup-lip1.5-vs-2.5.png')); }
await cr.close(); await wk.close();

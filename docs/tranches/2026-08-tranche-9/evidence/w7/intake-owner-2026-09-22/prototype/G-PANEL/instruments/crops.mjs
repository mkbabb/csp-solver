// The four crops (≤150 KB each), each a side-by-side of panels differing by ONE variable, one payload.
// usage: OUT=<dir> node crops.mjs   (control 4258, proto 4257, served dists)
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright'); const sharp = require('sharp');
const OUT = process.env.OUT;
const Q = '/?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const C = 'http://127.0.0.1:4258', P = 'http://127.0.0.1:4257';

async function panel(browser, { base, w, h, touch, theme, css, armed, region }) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch && w < 1024, colorScheme: theme, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(base + Q, { waitUntil: 'load' });
  await p.waitForSelector('svg.handwritten-logo', { timeout: 20000 }); await p.waitForSelector('.controls-card .ctrl-btn', { state: 'attached', timeout: 20000 });
  const tab = p.locator('.drawer-tab'); if ((await tab.count()) && (await tab.getAttribute('aria-expanded')) === 'false') { if (touch) await tab.tap(); else await tab.click(); }
  let last = '', same = 0; const t0 = Date.now();
  while (Date.now() - t0 < 5000) { const s = await p.evaluate(() => JSON.stringify(document.querySelector('.controls-card')?.getBoundingClientRect())); if (s === last) { if (++same >= 3) break; } else same = 0; last = s; await p.waitForTimeout(120); }
  if (css) await p.addStyleTag({ content: css });
  if (armed) await p.evaluate(() => { const l = document.querySelector('.new-game-zone .deal-btn .icon-sublabel'); l.textContent = 'sure?'; l.classList.add('is-armed'); });
  await p.waitForTimeout(300);
  const clip = await p.evaluate((region) => {
    const c = document.querySelector('.controls-card');
    const els = region === 'live' ? [...document.querySelectorAll('.control-panel-wrap .tray-well')].slice(1, 3) : [document.querySelector('.new-game-zone')];
    c.scrollTop += els[0].getBoundingClientRect().top - c.getBoundingClientRect().top - 24;
    const rs = els.map((e) => e.getBoundingClientRect());
    const x = Math.min(...rs.map((r) => r.left)) - 10, y = Math.min(...rs.map((r) => r.top)) - 18;
    return { x, y, width: Math.max(...rs.map((r) => r.right)) + 10 - x, height: Math.min(innerHeight - y, Math.max(...rs.map((r) => r.bottom)) + 10 - y) };
  }, region);
  await p.waitForTimeout(150);
  const buf = await p.screenshot({ clip, scale: 'device' }); await ctx.close(); return buf;
}
async function strip(bufs, out) {
  const metas = await Promise.all(bufs.map((b) => sharp(b).metadata()));
  const H = Math.max(...metas.map((m) => m.height)), gap = 16; const W = metas.reduce((a, m) => a + m.width, 0) + gap * (bufs.length - 1);
  let x = 0; const comp = bufs.map((b, i) => { const o = { input: b, left: x, top: 0 }; x += metas[i].width + gap; return o; });
  const img = await sharp({ create: { width: W, height: H, channels: 3, background: '#808080' } }).composite(comp).png().toBuffer();
  let scale = 1, res;
  do { res = await sharp(img).resize(Math.round(W * scale)).png({ palette: true, quality: 70, compressionLevel: 9 }).toBuffer(); scale *= 0.85; } while (res.length > 150 * 1024 && scale > 0.2);
  await sharp(res).toFile(out); console.log(out, res.length, 'bytes');
}
const cr = await pw.chromium.launch(), wk = await pw.webkit.launch();
const fine = { w: 1280, h: 800, touch: false, theme: 'light' };
// 1 · m17 before/after + ballot 2 (receipt UNDER) + ballot 4 (GROWN fine chips): chromium · light · 1280×800 · fine
await strip([
  await panel(cr, { ...fine, base: C }),
  await panel(cr, { ...fine, base: P }),
  await panel(cr, { ...fine, base: P, css: '.deal-row{flex-direction:column !important;align-items:center !important}' }),
  await panel(cr, { ...fine, base: P, css: '.options-line > .ctrl-btn{flex:1 1 auto !important}' }),
], `${OUT}/c1-m17-head-proto-b2under-b4grown-chromium-light-1280x800-fine.png`);
// 2 · ARM A's live-well delta (ARM B = HEAD's column): webkit · dark · 1280×800 · fine
await strip([
  await panel(wk, { ...fine, theme: 'dark', base: C, region: 'live' }),
  await panel(wk, { ...fine, theme: 'dark', base: P, region: 'live' }),
], `${OUT}/c2-armA-live-wells-head-proto-webkit-dark-1280x800-fine.png`);
// 3 · the coarse rail, rest vs armed (`sure?` beside the receipt): chromium · light · 1280×800 · coarse (hasTouch)
const coarse = { w: 1280, h: 800, touch: true, theme: 'light' };
await strip([
  await panel(cr, { ...coarse, base: C }),
  await panel(cr, { ...coarse, base: P }),
  await panel(cr, { ...coarse, base: P, armed: true }),
], `${OUT}/c3-coarse-rail-head-proto-armed-chromium-light-1280x800-coarse.png`);
// 4 · the dock's deal row, sheet settled: webkit · light · 390×844 · coarse
const dock = { w: 390, h: 844, touch: true, theme: 'light' };
await strip([
  await panel(wk, { ...dock, base: C }),
  await panel(wk, { ...dock, base: P }),
], `${OUT}/c4-dock-deal-row-head-proto-webkit-light-390x844-coarse.png`);
await cr.close(); await wk.close();

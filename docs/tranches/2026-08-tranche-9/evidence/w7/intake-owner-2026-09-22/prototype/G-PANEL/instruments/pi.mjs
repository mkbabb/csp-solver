// G11 π — the unnamed surfaces vs the HEAD control, tags + computed paint + rects, one payload, one rendering mode (both served dists).
// usage: A=http://127.0.0.1:4258 B=http://127.0.0.1:4257 node pi.mjs <engine>   (A = control; A=B for the head-vs-head control)
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
const engine = process.argv[2] || 'chromium';
const A = process.env.A, B = process.env.B;
const Q = '/?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const CELLS = process.env.CELLS ? JSON.parse(process.env.CELLS) : [
  { name: '1280x800-fine', w: 1280, h: 800, touch: false }, { name: '1440x900-fine', w: 1440, h: 900, touch: false },
  { name: '390x844-coarse', w: 390, h: 844, touch: true }, { name: '430x932-coarse', w: 430, h: 932, touch: true }];
const SURF = {
  masthead: 'svg.handwritten-logo, button.sun-moon-toggle', deck: '.game-gallery, .game-gallery *, .sketchbook, .sketchbook *', board: '.board-row, .board-row *',
  tapes: '.washi-tag', captions: '.zone-row-label', bar: '.action-bar, .action-bar *', tabs: '.mobile-heading-row, .mobile-heading-row *',
  chipRow: '.options-row, .options-row > *',
};
const snap = (SURF) => {
  const r2 = (n) => Math.round(n * 100) / 100; const out = {};
  for (const [k, sel] of Object.entries(SURF)) out[k] = [...document.querySelectorAll(sel)].map((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
    return { t: e.tagName + '.' + String(e.className?.baseVal ?? e.className).split(' ').slice(0, 2).join('.'), inCard: !!e.closest('.controls-card'), x: r2(r.x), y: r2(r.y), w: r2(r.width), h: r2(r.height),
      p: [s.color, s.backgroundColor, s.fontSize, s.fontWeight, s.fontFamily.split(',')[0], s.opacity, s.transform, s.filter, s.borderTopWidth, s.visibility, s.display].join('|') }; });
  return out;
};
async function load(browser, base, cell) {
  const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.touch, isMobile: cell.touch && cell.w < 1024, colorScheme: 'light', deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(base + Q, { waitUntil: 'load' });
  await p.waitForSelector('svg.handwritten-logo', { timeout: 20000 }); await p.waitForSelector('.controls-card .ctrl-btn', { state: 'attached', timeout: 20000 });
  const tab = p.locator('.drawer-tab'); if ((await tab.count()) && (await tab.getAttribute('aria-expanded')) === 'false') { if (cell.touch) await tab.tap(); else await tab.click(); }
  let last = '', same = 0; const t0 = Date.now();
  while (Date.now() - t0 < 5000) { const s = await p.evaluate(() => JSON.stringify(document.querySelector('.controls-card')?.getBoundingClientRect())); if (s === last) { if (++same >= 3) break; } else same = 0; last = s; await p.waitForTimeout(120); }
  await p.waitForTimeout(400);
  const s = await p.evaluate(snap, SURF); await ctx.close(); return s;
}
const browser = await pw[engine].launch();
for (const cell of CELLS) {
  const a = await load(browser, A, cell), b = await load(browser, B, cell);
  const row = {};
  for (const k of Object.keys(SURF)) {
    const xa = a[k], xb = b[k]; let same = 0, paintDiff = 0, rectDiff = 0, onlyY = 0; const dys = new Set(); const ex = [];
    if (xa.length !== xb.length) { row[k] = `COUNT ${xa.length} vs ${xb.length}`; continue; }
    for (let i = 0; i < xa.length; i++) { const u = xa[i], v = xb[i];
      if (u.t !== v.t || u.p !== v.p) { paintDiff++; if (ex.length < 2) ex.push(`${u.t}: ${u.p} ≠ ${v.p}`); continue; }
      if (u.x === v.x && u.y === v.y && u.w === v.w && u.h === v.h) { same++; continue; }
      if (u.x === v.x && u.w === v.w && u.h === v.h && u.inCard) { onlyY++; dys.add(+(v.y - u.y).toFixed(2)); continue; }
      rectDiff++; if (ex.length < 2) ex.push(`${u.t} ${u.x},${u.y} ${u.w}x${u.h} → ${v.x},${v.y} ${v.w}x${v.h}`); }
    row[k] = `n${xa.length} same ${same} · in-card y-shift only ${onlyY}${dys.size ? ' dy{' + [...dys].slice(0, 4).join(',') + '}' : ''} · rect ${rectDiff} · paint ${paintDiff}${ex.length ? ' e.g. ' + ex.join(' ; ') : ''}`;
  }
  console.log(`\n## ${engine} ${cell.name}`); for (const [k, v] of Object.entries(row)) console.log(`  ${k}: ${v}`);
}
await browser.close();

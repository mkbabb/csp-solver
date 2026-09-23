// T9-W7 pass 6 · CTRL-FACE · T9-B14 (INTAKE row 4) — the `i`'s two arms measured on ONE payload:
// π of the strip/card/board (G8), the filter census in the card, and the ring's painted contrast
// (ring-ON minus ring-OFF, the core median over changed pixels and the fraction under 3.0, both
// themes, DPR 2). Crops of the strip at rest and open go to <crops dir>.
//   node ring-arm.mjs <engine> <base> <label> <crops dir>
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright'); const sharp = require('sharp');
const [engine, base, label, crops] = process.argv.slice(2);
const P = '?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const L = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const cr = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const br = await pw[engine].launch();
const out = { engine, label };
for (const theme of ['light', 'dark']) {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: theme, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(base + '/' + P); await p.waitForSelector('.sudoku-cell .glyph-svg', { timeout: 30000 }); await p.waitForTimeout(1200);
  const geo = await p.evaluate(() => {
    const card = [...document.querySelectorAll('.controls-card')].find((c) => c.getClientRects().length);
    const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)]; };
    const givens = [...document.querySelectorAll('[role="gridcell"] input')].map((i) => i.value || '0').join('');
    const filters = [...card.querySelectorAll('*')].filter((e) => { const f = getComputedStyle(e).filter; return (f && f !== 'none') || e.hasAttribute('filter'); }).length;
    const pageFilters = [...document.querySelectorAll('*')].filter((e) => { const f = getComputedStyle(e).filter; return (f && f !== 'none' && f.includes('url')) || (e.getAttribute('filter') || '').includes('url'); }).length;
    const info = card.querySelector('.info-btn');
    return { givens, card: r(card), board: r(document.querySelector('.board-group')), bar: r(card.querySelector('.action-bar')), verbs: [...card.querySelectorAll('.action-verbs > button')].map((b) => r(b)), info: r(info), infoTag: info?.tagName, ringSvg: !!info?.querySelector('svg'), filtersInCard: filters, urlFiltersInPage: pageFilters };
  });
  out[theme] = geo;
  // scroll so the strip sits clear, then photograph ring-ON and ring-OFF
  const box = await p.evaluate(() => { const card = [...document.querySelectorAll('.controls-card')].find((c) => c.getClientRects().length); const b = card.querySelector('.action-bar').getBoundingClientRect(); return { x: b.x - 4, y: b.y - 6, width: b.width + 8, height: b.height + 12 }; });
  const shot = async () => sharp(await p.screenshot({ clip: box })).raw().toBuffer({ resolveWithObject: true });
  const on = await shot();
  const h = await p.addStyleTag({ content: '.info-btn svg { visibility: hidden !important }' });
  await p.waitForTimeout(100);
  const off = await shot();
  await h.evaluate((n) => n.remove());
  const cols = []; const { data: A, info: I } = on; const B = off.data;
  for (let i = 0; i < A.length; i += I.channels) { const d = Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]); if (d > 24) cols.push(cr([A[i], A[i + 1], A[i + 2]], [B[i], B[i + 1], B[i + 2]])); }
  cols.sort((a, b) => a - b);
  out[theme].ringPaint = cols.length ? { n: cols.length, median: +cols[Math.floor(cols.length / 2)].toFixed(3), p90: +cols[Math.floor(cols.length * 0.9)].toFixed(3), under3: +(cols.filter((c) => c < 3).length / cols.length).toFixed(3) } : { n: 0 };
  await sharp(await p.screenshot({ clip: box })).toFile(`${crops}/${label}-${engine}-${theme}-rest.png`);
  const c = await p.evaluate(() => { const card = [...document.querySelectorAll('.controls-card')].find((x) => x.getClientRects().length); const b = card.querySelector('.info-btn').getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; });
  await p.mouse.click(c[0], c[1]); await p.waitForTimeout(500);
  const box2 = await p.evaluate(() => { const card = [...document.querySelectorAll('.controls-card')].find((c) => c.getClientRects().length); const b = card.querySelector('.action-bar').getBoundingClientRect(); return { x: b.x - 4, y: b.y - 6, width: b.width + 8, height: b.height + 12 }; });
  await sharp(await p.screenshot({ clip: box2 })).toFile(`${crops}/${label}-${engine}-${theme}-open.png`);
  await ctx.close();
}
console.log(JSON.stringify(out));
await br.close();

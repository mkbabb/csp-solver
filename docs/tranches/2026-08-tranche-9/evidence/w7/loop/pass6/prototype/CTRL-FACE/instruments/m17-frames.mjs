// T9-W7 pass 6 · CTRL-FACE · the M17 ballot pairs (T9-B16–B20) on ONE dist and ONE payload; each
// pair's ONE variable is an injected rule (the arm's CSS, banked in ../arms/), each arm framed at
// the ballot's cell and measured (zone height, the group's line count, the card's scrollHeight).
//   node m17-frames.mjs <engine> <base> <crops dir|->
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright'); const sharp = require('sharp');
const [engine, base, crops] = process.argv.slice(2);
const P = '?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const FINE = { viewport: { width: 1280, height: 800 } };
const COARSE = { viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: false };
const LIVE = '.tray-well:not(.new-game-zone)';
const PAIRS = [
  { id: 'B16', cell: FINE, focus: 'marks', arms: { 'A-component': '', 'B-staged-only': `${LIVE} .options-line { flex-direction: column !important; flex-wrap: nowrap !important; align-items: stretch !important } ${LIVE} .options-line > .ctrl-btn { flex: none !important }` } },
  { id: 'B17', cell: FINE, focus: 'zone', arms: { 'a-beside': '', 'b-under': '.new-game-zone .deal-row { flex-direction: column !important; align-items: center !important }' } },
  { id: 'B18', cell: FINE, focus: 'marks', arms: { 'a-line': '', 'b-kept-column': '.zone-row .options-line { flex-direction: column !important; flex-wrap: nowrap !important; align-items: stretch !important }' } },
  { id: 'B19', cell: FINE, focus: 'zone', arms: { 'a-intrinsic': '', 'b-grown': '.options-line > .ctrl-btn { flex: 1 1 auto !important }' } },
  { id: 'B20', cell: COARSE, focus: 'zone', arms: { 'a-grown-2+1': '', 'b-kept-column': '.options-line:has(> .ctrl-btn:nth-child(3):last-child) { flex-direction: column !important; flex-wrap: nowrap !important }' } },
];
const READ = () => {
  const card = [...document.querySelectorAll('.controls-card')].find((c) => c.getClientRects().length);
  const z = card.querySelector('.new-game-zone');
  const lines = [...card.querySelectorAll('.ctrl-options')].filter((o) => o.getClientRects().length).map((o) => new Set([...o.querySelectorAll(':scope > .ctrl-btn')].map((b) => Math.round(b.getBoundingClientRect().top))).size);
  const deal = z.querySelector('.deal-btn').getBoundingClientRect(); const bar = card.querySelector('.action-bar').getBoundingClientRect();
  const chips = [...card.querySelectorAll('.ctrl-btn')].filter((b) => b.getClientRects().length).map((b) => b.getBoundingClientRect());
  return { zoneH: +z.getBoundingClientRect().height.toFixed(2), scrollH: card.scrollHeight, lines, dealBottom: +deal.bottom.toFixed(2), fadeTop: +(bar.top - 32).toFixed(2), minChip: [+Math.min(...chips.map((c) => c.width)).toFixed(2), +Math.min(...chips.map((c) => c.height)).toFixed(2)], scrollW: card.scrollWidth, clientW: card.clientWidth };
};
const br = await pw[engine].launch();
for (const pair of PAIRS) for (const [arm, css] of Object.entries(pair.arms)) {
  const ctx = await br.newContext({ ...pair.cell, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light' });
  const p = await ctx.newPage();
  await p.goto(base + '/' + P); await p.waitForSelector('.sudoku-cell .glyph-svg', { timeout: 30000 });
  if (css) await p.addStyleTag({ content: css });
  await p.waitForTimeout(700);
  const m = await p.evaluate(READ);
  console.log(JSON.stringify({ engine, pair: pair.id, arm, ...m }));
  if (crops !== '-' && engine === 'chromium') {
    const box = await p.evaluate((focus) => {
      const card = [...document.querySelectorAll('.controls-card')].find((c) => c.getClientRects().length);
      if (focus === 'marks') { const lab = [...card.querySelectorAll('.zone-row-label')].find((l) => l.textContent.trim() === 'marks'); card.scrollTop = 0; const t = lab.getBoundingClientRect().top - card.getBoundingClientRect().top - 60; card.scrollTop = t; }
      else card.scrollTop = 0;
      const r = card.getBoundingClientRect();
      return { x: r.x - 4, y: r.y - 4, width: r.width + 8, height: Math.min(r.height, 420) };
    }, pair.focus);
    await p.waitForTimeout(250);
    await sharp(await p.screenshot({ clip: box })).toFile(`${crops}/m17-${pair.id}-${arm}.png`);
  }
  await ctx.close();
}
await br.close();

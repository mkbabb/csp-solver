// T9-W7 pass 6 · CTRL-FACE · ballot B-1 (W2 §2.5's pinned tape) — the arms on ONE dist, ONE
// payload, ONE variable each (an injected rule), walked over every 5 px of the card's scroll:
//   A     the tree as built (the band = the pinned tape's depth, `--pin-tape-h`)
//   none  the band put back to the utility's padding (the pass-5 state; the variable is padding-top)
//   B     arm B's BEST case: the band as `none` AND every tape at the hand's tag rung (the smallest
//         tape the estate ships), so if B's upper bound reds, B reds.
//   node b1-arms.mjs <engine> <base> <crops dir|-> > out
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright'); const sharp = require('sharp');
const [engine, base, crops, only] = process.argv.slice(2);
const P = '?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const CELLS = [
  { n: '1440x900-fine', ctx: { viewport: { width: 1440, height: 900 } }, pad: '1.25rem' },
  { n: '1280x800-coarse-rail', ctx: { viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: false }, pad: '1.25rem' },
  { n: '390x844-coarse', ctx: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, pad: '0.375rem', dock: true },
];
const ARMS = (pad) => ({ A: '', none: `.controls-card { padding-top: ${pad} !important }`, B: `.controls-card { padding-top: ${pad} !important } .tray-well .washi-tag { font-size: var(--type-tag) !important }` });
const POSE = () => {
  const root = [...document.querySelectorAll('.controls-card')].find((c) => c.getClientRects().length);
  const cr = root.getBoundingClientRect();
  const band = root.hasAttribute('data-fold-above') ? cr.top + root.clientTop + parseFloat(getComputedStyle(root).paddingTop) : -Infinity;
  const controls = [...root.querySelectorAll('button, [role="button"], input, select, a[href]')].filter((e) => e.getClientRects().length);
  const hits = [];
  for (const t of root.querySelectorAll('.washi-tag')) {
    const cs = getComputedStyle(t); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
    const r = t.getBoundingClientRect();
    for (const c of controls) { if (c.contains(t)) continue; const b = c.getBoundingClientRect(); const w = Math.min(b.right, r.right) - Math.max(b.left, r.left); const h = Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top, band, cr.top); if (w > 0 && h > 0 && w * h > 0.5) hits.push({ tape: t.textContent.trim(), control: (c.getAttribute('aria-label') || c.textContent).trim().slice(0, 16), px: +(w * h).toFixed(1) }); }
  }
  return { st: root.scrollTop, max: root.scrollHeight - root.clientHeight, padT: getComputedStyle(root).paddingTop, tapeH: Math.max(...[...root.querySelectorAll('.washi-tag')].map((t) => t.getBoundingClientRect().height)), hits, card: [cr.x, cr.y, cr.width, cr.height] };
};
const br = await pw[engine].launch();
const res = [];
for (const cell of CELLS.filter((c) => !only || c.n === only)) {
  for (const [arm, css] of Object.entries(ARMS(cell.pad))) {
    const ctx = await br.newContext({ ...cell.ctx, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(base + '/' + P); await p.waitForSelector('.sudoku-cell .glyph-svg', { timeout: 30000 });
    if (cell.dock) { await p.locator('.drawer-tab').tap(); await p.waitForTimeout(1200); }
    if (css) await p.addStyleTag({ content: css });
    await p.waitForTimeout(600);
    const givens = await p.evaluate(() => [...document.querySelectorAll('[role="gridcell"] input')].map((i) => i.value || '0').join(''));
    const max = await p.evaluate(() => { const r = [...document.querySelectorAll('.controls-card')].find((c) => c.getClientRects().length); return r.scrollHeight - r.clientHeight; });
    const poses = [...new Set([...Array(Math.floor(max / 5) + 1).keys()].map((k) => k * 5).concat(max))];
    let covered = 0, worst = null; const rest = await p.evaluate(POSE);
    for (const st of poses) {
      await p.evaluate((st) => { const r = [...document.querySelectorAll('.controls-card')].find((c) => c.getClientRects().length); r.scrollTop = st; return new Promise((z) => requestAnimationFrame(() => requestAnimationFrame(z))); }, st);
      const q = await p.evaluate(POSE);
      if (q.hits.length) { covered++; for (const h of q.hits) if (!worst || h.px > worst.px) worst = { st: q.st, ...h }; }
    }
    res.push({ engine, cell: cell.n, arm, givensOk: givens.length === 81, poses: poses.length, max, covered, worst, restPadT: rest.padT, tapeH: +rest.tapeH.toFixed(2), card: rest.card });
    if (crops !== '-' && engine === 'chromium' && arm !== 'B') {
      // the frame pose: the scroll END (W2 §2.5's own pose at 1440) / st 35 at the dock (the walk's worst)
      const st = cell.dock ? 35 : max;
      await p.evaluate((st) => { const r = [...document.querySelectorAll('.controls-card')].find((c) => c.getClientRects().length); r.scrollTop = st; return new Promise((z) => requestAnimationFrame(() => requestAnimationFrame(z))); }, st);
      await p.waitForTimeout(300);
      const box = await p.evaluate(() => { const r = [...document.querySelectorAll('.controls-card')].find((c) => c.getClientRects().length).getBoundingClientRect(); return { x: r.x - 6, y: r.y - 6, width: r.width + 12, height: Math.min(r.height, 260) + 6 }; });
      await sharp(await p.screenshot({ clip: box })).toFile(`${crops}/b1-${cell.n}-${arm}.png`);
    }
    await ctx.close();
  }
}
for (const r of res) console.log(JSON.stringify(r));
await br.close();

/**
 * T9-W7 exec 3B-1 — rect census.
 *
 * Every element's getBoundingClientRect on the two viewports, keyed by a structural
 * path (tag + nth-child chain), written to one JSON per (route, viewport). The board is
 * PINNED by a permalink so two runs see the same digits, and PRM is emulated so the boil
 * is frozen rather than sampled mid-beat.
 *
 * usage: node rect-census.mjs <baseURL> <outDir>
 */
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
// FOLD VARIANT (chair, 2026-09-18): the lanes' rect-census.mjs with ENGINE=chromium|webkit and the intake's third viewport, 820x1180.
const ENGINE = process.env.ENGINE === 'webkit' ? webkit : chromium;
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [, , BASE, OUT] = process.argv;
if (!BASE || !OUT) {
  console.error('usage: node rect-census.mjs <baseURL> <outDir>');
  process.exit(2);
}
mkdirSync(OUT, { recursive: true });

// The app's own wire grammar (e2e/wire.ts encodeSudoku), spelled in plain node.
function encodeSudoku(size, cells, total) {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  const body = String.fromCharCode(1) + `${size}.${c}`;
  return Buffer.from(body, 'latin1')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// A pinned 9x9: eight givens, no generation involved, identical on every run.
const PINNED = encodeSudoku(3, { 0: 5, 4: 3, 8: 7, 20: 9, 40: 1, 60: 4, 76: 2, 80: 6 }, 81);

const ROUTES = [
  { name: 'board', url: `./?board=${PINNED}`, ready: '.sudoku-cell' },
  { name: 'gallery', url: `./?view=gallery&board=${PINNED}`, ready: 'main' },
];
const VIEWPORTS = [
  { name: '1280x800', width: 1280, height: 800 },
  { name: '390x844', width: 390, height: 844 },
  { name: '820x1180', width: 820, height: 1180 },
];

const CENSUS = () => {
  const path = (el) => {
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && n !== document.documentElement) {
      const p = n.parentElement;
      const i = p ? Array.prototype.indexOf.call(p.children, n) + 1 : 1;
      parts.unshift(`${n.tagName.toLowerCase()}:${i}`);
      n = p;
    }
    return 'html/' + parts.join('/');
  };
  const out = {};
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    out[path(el)] = [
      Math.round(r.x * 100) / 100,
      Math.round(r.y * 100) / 100,
      Math.round(r.width * 100) / 100,
      Math.round(r.height * 100) / 100,
    ];
  }
  return out;
};

const browser = await ENGINE.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    await page.goto(new URL(route.url, BASE).href, { waitUntil: 'load' });
    await page.waitForSelector(route.ready, { timeout: 20000 });
    // settle: the reveal wave and the deck's glide both finish well inside this
    await page.waitForTimeout(2500);
    const rects = await page.evaluate(CENSUS);
    writeFileSync(
      join(OUT, `${route.name}-${vp.name}.json`),
      JSON.stringify(rects, null, 0) + '\n',
    );
    console.log(`${route.name} ${vp.name}: ${Object.keys(rects).length} rects`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();

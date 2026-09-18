/**
 * r2 non-author rect census — one viewport (1280x800), two engines, two dists.
 * usage: node r2-census.mjs <engine> <baseA> <baseB> <outJson>
 */
import * as pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const [, , ENGINE, BASE_A, BASE_B, OUT] = process.argv;

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
const PINNED = encodeSudoku(3, { 0: 5, 4: 3, 8: 7, 20: 9, 40: 1, 60: 4, 76: 2, 80: 6 }, 81);

const ROUTES = [
  { name: 'board', url: `./?board=${PINNED}`, ready: '.sudoku-cell' },
  { name: 'gallery', url: `./?view=gallery&board=${PINNED}`, ready: 'main' },
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
    out[path(el)] = [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100);
  }
  return out;
};

async function censusOf(browser, base) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  const res = {};
  for (const r of ROUTES) {
    const page = await ctx.newPage();
    await page.goto(new URL(r.url, base).href, { waitUntil: 'load' });
    await page.waitForSelector(r.ready, { timeout: 20000 });
    await page.waitForTimeout(2500);
    res[r.name] = await page.evaluate(CENSUS);
    await page.close();
  }
  await ctx.close();
  return res;
}

const browser = await pw[ENGINE].launch();
const a = await censusOf(browser, BASE_A);
const b = await censusOf(browser, BASE_B);
await browser.close();

const report = { engine: ENGINE, surfaces: {} };
for (const route of Object.keys(a)) {
  const ka = Object.keys(a[route]);
  const kb = Object.keys(b[route]);
  const shared = ka.filter((k) => k in b[route]);
  let worst = 0;
  let worstKey = null;
  for (const k of shared) {
    for (let i = 0; i < 4; i++) {
      const d = Math.abs(a[route][k][i] - b[route][k][i]);
      if (d > worst) {
        worst = d;
        worstKey = k + '[' + i + ']';
      }
    }
  }
  report.surfaces[route] = {
    keysA: ka.length,
    keysB: kb.length,
    shared: shared.length,
    onlyA: ka.filter((k) => !(k in b[route])).length,
    onlyB: kb.filter((k) => !(k in a[route])).length,
    maxAbsDelta: worst,
    worstKey,
  };
}
writeFileSync(OUT, JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));

/** verifier r1 census — rect-census.mjs with an engine argument.
 * usage: node census2.mjs <baseURL> <outDir> <engine>
 */
import {
  chromium,
  webkit,
} from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [, , BASE, OUT, ENGINE = 'chromium'] = process.argv;
const ENGINES = { chromium, webkit };
mkdirSync(OUT, { recursive: true });

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
const VIEWPORTS = [{ name: '390x844', width: 390, height: 844 }];

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

const browser = await ENGINES[ENGINE].launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
    hasTouch: true,
  });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    await page.goto(new URL(route.url, BASE).href, { waitUntil: 'load' });
    await page.waitForSelector(route.ready, { timeout: 20000 });
    await page.waitForTimeout(2500);
    const rects = await page.evaluate(CENSUS);
    const tapes = await page.locator('.attribution-tape').count();
    const coarse = await page.evaluate(() => matchMedia('(pointer: coarse)').matches);
    writeFileSync(join(OUT, `${route.name}-${vp.name}.json`), JSON.stringify(rects, null, 0) + '\n');
    console.log(
      `${ENGINE} ${route.name} ${vp.name}: ${Object.keys(rects).length} rects, coarse=${coarse}, .attribution-tape=${tapes}`,
    );
    await page.close();
  }
  await ctx.close();
}
await browser.close();

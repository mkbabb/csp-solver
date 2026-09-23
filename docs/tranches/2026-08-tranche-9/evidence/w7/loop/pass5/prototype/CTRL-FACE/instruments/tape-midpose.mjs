import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const base = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base + `/?size=3&difficulty=EASY&st=${process.argv[3]}`);
await p.waitForSelector('g.boil-frame-layer.is-active', { state: 'attached', timeout: 20000 });
await p.waitForTimeout(800);
await p.evaluate(() => { const c = document.querySelector('.controls-card'); c.scrollTop = +(new URLSearchParams(location.search).get("st") ?? 99999); });
await p.waitForTimeout(600);
console.log(JSON.stringify(await p.evaluate(() => {
  const c = document.querySelector('.controls-card');
  const r = (e) => { const b = e.getBoundingClientRect(); return [+b.top.toFixed(2), +b.bottom.toFixed(2)]; };
  const tag = c.querySelector('.new-game-zone .washi-tag');
  const chips = [...c.querySelectorAll('.new-game-zone button')].filter(e => e.getClientRects().length).map(e => ({ t: (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 12), b: r(e) }));
  const well = c.querySelector('.new-game-zone');
  const last = [...c.querySelectorAll('.tray-well')].pop();
  return { st: c.scrollTop, card: r(c), pad: getComputedStyle(c).paddingTop, fold: c.hasAttribute('data-fold-above'), tag: r(tag), well: r(well), lastWellMb: getComputedStyle(last).marginBottom, lastWell: r(last), bar: r(c.querySelector('.action-bar')), chips };
})));
await b.close();

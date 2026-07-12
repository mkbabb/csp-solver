// c2 — S5 geometry forensics: where does the rail rest closed, and what vector
// does it travel, relative to the BOARD (the sheet), pre-amendment?
import { chromium } from 'file:///Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.dirname(new URL(import.meta.url).pathname);
const URL_ = 'http://localhost:3001/?size=3&difficulty=EASY';

async function load(page) {
  await page.goto(URL_);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
  await page.waitForFunction(
    () => document.querySelectorAll('.sudoku-cell .glyph-svg').length > 0,
    null, { timeout: 20000 },
  );
  await page.waitForTimeout(1000);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => localStorage.setItem('csp-drawer-open', '1'));
const page = await ctx.newPage();
await load(page);

const rects = () => page.evaluate(() => {
  const g = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { l: +r.left.toFixed(1), t: +r.top.toFixed(1), r: +r.right.toFixed(1), b: +r.bottom.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
  };
  return {
    board: g('.board-wrapper'),
    host: g('.board-peek-host'),
    rail: g('#controls-drawer'),
    card: g('.controls-card'),
    tab: g('.drawer-tab'),
    layout: g('.app-layout'),
    masthead: g('.masthead'),
    zRail: getComputedStyle(document.querySelector('#controls-drawer')).zIndex,
    zHost: getComputedStyle(document.querySelector('.board-peek-host')).zIndex,
    closed: document.documentElement.classList.contains('drawer-closed'),
  };
});

const out = { openIdle: await rects() };

// Sample the close glide: rail vs board rects per frame.
out.closeGlide = await page.evaluate(async () => {
  const rail = document.querySelector('#controls-drawer');
  const board = document.querySelector('.board-wrapper');
  const tab = document.querySelector('.drawer-tab');
  const frames = [];
  const t0 = performance.now();
  tab.click();
  await new Promise((res) => {
    (function tick() {
      const t = performance.now() - t0;
      const rr = rail.getBoundingClientRect();
      const br = board.getBoundingClientRect();
      frames.push({
        t: +t.toFixed(1),
        rail: { l: +rr.left.toFixed(1), t: +rr.top.toFixed(1), r: +rr.right.toFixed(1), b: +rr.bottom.toFixed(1) },
        board: { l: +br.left.toFixed(1), t: +br.top.toFixed(1), r: +br.right.toFixed(1), b: +br.bottom.toFixed(1) },
        railVis: getComputedStyle(rail).visibility,
      });
      if (t < 700) requestAnimationFrame(tick); else res();
    })();
  });
  return frames;
});

out.closedIdle = await rects();
fs.writeFileSync(path.join(OUT, 'geometry-before.json'), JSON.stringify(out, null, 1));

// Digest: rail-above-board frames, rail-right-of-board-right coverage at rest.
const g = out.closeGlide;
const aboveFrames = g.filter((f) => f.rail.t < f.board.t - 1);
const beyondRight = g.filter((f) => f.rail.r > f.board.r + 1);
console.log(JSON.stringify({
  openIdle: out.openIdle,
  closedIdle: out.closedIdle,
  glide: {
    frames: g.length,
    railTopRange: [Math.min(...g.map((f) => f.rail.t)), Math.max(...g.map((f) => f.rail.t))],
    boardTopAtClose: g[g.length - 1].board.t,
    framesRailAboveBoardTop: aboveFrames.length,
    framesRailBeyondBoardRight: beyondRight.length,
    maxRailRightMinusBoardRight: Math.max(...g.map((f) => +(f.rail.r - f.board.r).toFixed(1))),
    lastFrame: g[g.length - 1],
  },
}, null, 2));

await browser.close();

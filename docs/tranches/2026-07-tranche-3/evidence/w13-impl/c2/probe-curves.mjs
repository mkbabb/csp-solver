// c2 — S3' curve audition: override the drawer movers' easing/duration live via an
// Element.prototype.animate patch, sample painted positions per rAF, and shoot
// mid-glide frames per candidate (fresh gesture per shot so screenshots don't skew
// the sampled profiles).
import { chromium } from 'file:///Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.dirname(new URL(import.meta.url).pathname);
const URL_ = 'http://localhost:3001/?size=3&difficulty=EASY';

const CANDIDATES = [
  { key: 'spring480', easing: null, dur: null }, // shipped baseline (no override)
  { key: 'glass-ref-480', easing: 'cubic-bezier(0.32, 0.72, 0, 1)', dur: 480 },
  { key: 'glass-ref-560', easing: 'cubic-bezier(0.32, 0.72, 0, 1)', dur: 560 },
  { key: 'glass-swift-520', easing: 'cubic-bezier(0.26, 0.75, 0.04, 1)', dur: 520 },
  { key: 'glass-soft-520', easing: 'cubic-bezier(0.4, 0.72, 0.12, 1)', dur: 520 },
];

async function load(page) {
  await page.goto(URL_);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
  await page.waitForFunction(
    () => document.querySelectorAll('.sudoku-cell .glyph-svg').length > 0,
    null, { timeout: 20000 },
  );
  await page.waitForTimeout(1000);
}

const PATCH = (easing, dur) => `
  (() => {
    const orig = Element.prototype.animate;
    Element.prototype.animate = function (kf, opts) {
      if (opts && typeof opts.easing === 'string' && opts.easing.startsWith('cubic-bezier(0.34, 1.56')) {
        opts = { ...opts, easing: ${JSON.stringify(easing)}, duration: ${dur} };
      }
      return orig.call(this, kf, opts);
    };
  })();
`;

const SAMPLER = `
(async (durMs) => {
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
      frames.push({ t: +t.toFixed(1), railL: +rr.left.toFixed(2), railT: +rr.top.toFixed(2),
        boardL: +br.left.toFixed(2), boardT: +br.top.toFixed(2), boardR: +br.right.toFixed(2) });
      if (t < durMs) requestAnimationFrame(tick); else res();
    })();
  });
  return frames;
})`;

function profile(frames, dir) {
  const from = frames[0], to = frames[frames.length - 1];
  const total = to.railL - from.railL;
  const prog = (f) => (f.railL - from.railL) / total;
  // attack: progress at 100ms; body: time to 50% and 90%; tail: last frame > 0.5px step
  const at = (ms) => {
    const f = frames.find((x) => x.t >= ms);
    return f ? +prog(f).toFixed(3) : null;
  };
  const timeTo = (p) => {
    const f = frames.find((x) => prog(x) >= p);
    return f ? +f.t.toFixed(0) : null;
  };
  let maxOvershoot = 0, monotone = true, lastMotion = 0;
  for (let i = 1; i < frames.length; i++) {
    const p = prog(frames[i]), pPrev = prog(frames[i - 1]);
    if (p > 1.0005) maxOvershoot = Math.max(maxOvershoot, (p - 1) * Math.abs(total));
    if (p < pPrev - 0.002) monotone = false;
    if (Math.abs(frames[i].railL - frames[i - 1].railL) > 0.5) lastMotion = frames[i].t;
  }
  return {
    dir, totalPx: +total.toFixed(1),
    progAt100: at(100), progAt200: at(200), progAt300: at(300),
    tTo50: timeTo(0.5), tTo90: timeTo(0.9), tTo99: timeTo(0.99),
    maxOvershootPx: +maxOvershoot.toFixed(1), monotone,
    lastMotionMs: +lastMotion.toFixed(0),
  };
}

const browser = await chromium.launch();
const results = {};

for (const cand of CANDIDATES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem('csp-drawer-open', '1'));
  if (cand.easing) await ctx.addInitScript(PATCH(cand.easing, cand.dur));
  const page = await ctx.newPage();
  await load(page);

  const closeFrames = await page.evaluate(`${SAMPLER}(900)`);
  await page.waitForTimeout(300);
  const openFrames = await page.evaluate(`${SAMPLER}(900)`);
  await page.waitForTimeout(300);
  results[cand.key] = {
    easing: cand.easing ?? 'cubic-bezier(0.34, 1.56, 0.64, 1) [shipped]',
    dur: cand.dur ?? 480,
    close: profile(closeFrames, 'close'),
    open: profile(openFrames, 'open'),
  };
  fs.writeFileSync(path.join(OUT, `curve-${cand.key}-frames.json`),
    JSON.stringify({ closeFrames, openFrames }, null, 1));

  // Frame strip: fresh gesture per shot, screenshot at a fixed offset.
  for (const ms of [80, 200, 360]) {
    await page.evaluate(() => document.querySelector('.drawer-tab').click()); // close
    await page.waitForTimeout(ms);
    await page.screenshot({
      path: path.join(OUT, `strip-${cand.key}-close-${ms}.png`),
      clip: { x: 600, y: 120, width: 840, height: 680 },
    });
    await page.waitForFunction(() => !document.documentElement.classList.contains('drawer-gesturing'), null, { timeout: 3000 });
    await page.evaluate(() => document.querySelector('.drawer-tab').click()); // reopen
    await page.waitForFunction(() => !document.documentElement.classList.contains('drawer-gesturing'), null, { timeout: 3000 });
    await page.waitForTimeout(150);
  }
  await ctx.close();
}

await browser.close();
fs.writeFileSync(path.join(OUT, 'curve-audition-results.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

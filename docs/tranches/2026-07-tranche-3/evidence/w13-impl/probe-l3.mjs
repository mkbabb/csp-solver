// T3-W13 l3 — draw-in verification probe against the :3001 dev server (headless, DPR2).
// Surfaces: hint (H), peek marks (K), laminate key glyphs, PRM parity, solve-flourish keep.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';

const OUT = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl';
const URL9 = 'http://localhost:3001/';

const results = {};

async function settleBoard(page) {
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  await page.waitForTimeout(2500); // grid draw-in + given glyph reveal settle
}

async function firstEmptyCellIndex(page) {
  return page.evaluate(() => {
    const cells = [...document.querySelectorAll('.sudoku-cell')];
    return cells.findIndex((c) => !c.querySelector('.glyph-svg'));
  });
}

const browser = await chromium.launch();

// ── 1. HINT: draw-in trace + flourish watch ─────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL9);
  await settleBoard(page);
  const idx = await firstEmptyCellIndex(page);
  await page.evaluate((i) => {
    const cell = document.querySelectorAll('.sudoku-cell')[i];
    cell.querySelector('input').focus();
    window.__hint = { samples: [], dChanges: [], baseD: null };
    const t0 = performance.now();
    const tick = () => {
      const p = cell.querySelector('.glyph-svg path');
      if (p) {
        const t = performance.now() - t0;
        const d = p.getAttribute('d') || '';
        if (window.__hint.baseD === null) window.__hint.baseD = d;
        else if (d !== window.__hint.baseD) {
          window.__hint.dChanges.push(Math.round(t));
          window.__hint.baseD = d;
        }
        if (window.__hint.samples.length < 80) {
          window.__hint.samples.push({
            t: Math.round(t),
            dash: p.style.strokeDasharray || 'unset',
            off: p.style.strokeDashoffset || 'unset',
            stroke: p.getAttribute('stroke'),
          });
        }
      }
      if (performance.now() - t0 < 4000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, idx);
  await page.keyboard.press('h');
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/hint-middraw-dpr2.png`, clip: { x: 300, y: 60, width: 840, height: 780 } });
  await page.waitForTimeout(4100);
  results.hint = await page.evaluate(() => ({
    samples: window.__hint.samples.filter((_, i) => i % 4 === 0 || i < 12),
    dChangeTimes: window.__hint.dChanges,
  }));
  await ctx.close();
}

// ── 2. SOLVE: flourish must still fire (beat-identical keep) ────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL9);
  await settleBoard(page);
  const idx = await firstEmptyCellIndex(page);
  // Arm a watcher on the first empty cell, then click Solve.
  await page.evaluate((i) => {
    const cell = document.querySelectorAll('.sudoku-cell')[i];
    window.__solve = { dChanges: [], baseD: null, armed: false, t0: 0 };
    const tick = () => {
      const p = cell.querySelector('.glyph-svg path');
      if (p) {
        if (!window.__solve.armed) { window.__solve.armed = true; window.__solve.t0 = performance.now(); }
        const t = performance.now() - window.__solve.t0;
        const d = p.getAttribute('d') || '';
        if (window.__solve.baseD === null) window.__solve.baseD = d;
        else if (d !== window.__solve.baseD) {
          window.__solve.dChanges.push(Math.round(t));
          window.__solve.baseD = d;
        }
      }
      if (!window.__solve.armed || (performance.now() - window.__solve.t0) < 6000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, idx);
  let solveBtn = page.locator('button[aria-label="Solve puzzle"]:visible');
  if ((await solveBtn.count()) === 0) {
    // controls tucked in the drawer — open it first
    await page.locator('.drawer-tab button, button[aria-expanded]').first().click();
    await page.waitForTimeout(700);
    solveBtn = page.locator('button[aria-label="Solve puzzle"]:visible');
  }
  await solveBtn.first().click();
  await page.waitForTimeout(7000);
  results.solveFlourish = await page.evaluate(() => ({ dChangeTimes: window.__solve.dChanges.slice(0, 40) }));
  await ctx.close();
}

// ── 3. PEEK: marks stagger + laminate write-in ──────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL9);
  await settleBoard(page);
  const idx = await firstEmptyCellIndex(page);
  await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);
  await page.keyboard.press('k');
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${OUT}/peek-midwrite-dpr2.png`, clip: { x: 300, y: 60, width: 840, height: 780 } });
  await page.waitForTimeout(500); // settled
  results.peek = await page.evaluate(() => {
    const markPaths = [...document.querySelectorAll('.pencil-marks path')];
    const keyPaths = [...document.querySelectorAll('.answer-key-laminate .key-glyph path')];
    const sample = (p) => {
      const cs = getComputedStyle(p);
      return {
        name: cs.animationName,
        dur: cs.animationDuration,
        delay: cs.animationDelay,
        pathLength: p.getAttribute('pathLength'),
        cls: p.getAttribute('class'),
      };
    };
    // a multi-candidate cell: group marks by parent .pencil-marks, find one with >2
    const byCell = new Map();
    for (const p of markPaths) {
      const host = p.closest('.pencil-marks');
      if (!byCell.has(host)) byCell.set(host, []);
      byCell.get(host).push(p);
    }
    const multi = [...byCell.values()].find((v) => v.length >= 3) || [...byCell.values()][0] || [];
    const keyDelays = keyPaths.map((p) => parseFloat(getComputedStyle(p).animationDelay) * 1000);
    return {
      markCount: markPaths.length,
      keyCount: keyPaths.length,
      multiCellMarkDelays: multi.map((p) => sample(p)),
      keySample: keyPaths.slice(0, 6).map((p) => sample(p)),
      keyDelayMin: Math.min(...keyDelays),
      keyDelayMax: Math.max(...keyDelays),
      keyDelayDistinct: [...new Set(keyDelays)].sort((a, b) => a - b),
    };
  });
  // laminate settled shot
  await page.screenshot({ path: `${OUT}/peek-settled-dpr2.png`, clip: { x: 300, y: 60, width: 840, height: 780 } });
  await ctx.close();
}

// ── 4. PEEK mid-write dash sampling (fresh peek, sampled at ~120ms) ────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL9);
  await settleBoard(page);
  const idx = await firstEmptyCellIndex(page);
  await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);
  await page.evaluate(() => {
    window.__mid = null;
    const t0 = performance.now();
    const tick = () => {
      const marks = [...document.querySelectorAll('.pencil-marks path')].slice(0, 8);
      const keys = [...document.querySelectorAll('.answer-key-laminate .key-glyph path')].slice(0, 8);
      const t = performance.now() - t0;
      if ((marks.length || keys.length) && t > 100 && !window.__mid) {
        const off = (p) => getComputedStyle(p).strokeDashoffset;
        window.__mid = {
          t: Math.round(t),
          markOffsets: marks.map(off),
          keyOffsets: keys.map(off),
        };
      }
      if (t < 3000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.keyboard.press('k');
  await page.waitForTimeout(1500);
  results.midWrite = await page.evaluate(() => window.__mid);
  await ctx.close();
}

// ── 5. PRM parity: hint + peek instant ──────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(URL9);
  await settleBoard(page);
  const idx = await firstEmptyCellIndex(page);
  await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);
  await page.keyboard.press('h');
  await page.waitForTimeout(120);
  const hintPRM = await page.evaluate((i) => {
    const p = document.querySelectorAll('.sudoku-cell')[i].querySelector('.glyph-svg path');
    return p ? { dash: p.style.strokeDasharray || 'unset', off: p.style.strokeDashoffset || 'unset' } : null;
  }, idx);
  await page.keyboard.press('k');
  await page.waitForTimeout(300);
  const peekPRM = await page.evaluate(() => {
    const mark = document.querySelector('.pencil-marks path');
    const key = document.querySelector('.answer-key-laminate .key-glyph path');
    const s = (p) => p ? {
      name: getComputedStyle(p).animationName,
      opacity: getComputedStyle(p).opacity,
      off: getComputedStyle(p).strokeDashoffset,
    } : null;
    return { mark: s(mark), key: s(key) };
  });
  results.prm = { hint: hintPRM, peek: peekPRM };
  await page.screenshot({ path: `${OUT}/prm-peek-dpr2.png`, clip: { x: 300, y: 60, width: 840, height: 780 } });
  await ctx.close();
}

// ── 6. Futoshiki twin: hint draw-in + marks classes ─────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3001/?game=futoshiki');
  await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });
  await page.waitForTimeout(2500);
  const idx = await page.evaluate(() => {
    const cells = [...document.querySelectorAll('.futoshiki-cell')];
    return cells.findIndex((c) => !c.querySelector('.glyph-svg'));
  });
  await page.evaluate((i) => {
    const cell = document.querySelectorAll('.futoshiki-cell')[i];
    cell.querySelector('input').focus();
    window.__fh = { samples: [] };
    const t0 = performance.now();
    const tick = () => {
      const p = cell.querySelector('.glyph-svg path');
      if (p && window.__fh.samples.length < 40) {
        window.__fh.samples.push({
          t: Math.round(performance.now() - t0),
          dash: p.style.strokeDasharray || 'unset',
          off: p.style.strokeDashoffset || 'unset',
          stroke: p.getAttribute('stroke'),
        });
      }
      if (performance.now() - t0 < 2000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, idx);
  await page.keyboard.press('h');
  await page.waitForTimeout(2100);
  const fhHint = await page.evaluate(() => window.__fh.samples.filter((_, i) => i % 3 === 0));
  await page.keyboard.press('k');
  await page.waitForTimeout(400);
  const fhPeek = await page.evaluate(() => {
    const mark = document.querySelector('.pencil-marks path');
    return mark ? {
      cls: mark.getAttribute('class'),
      pathLength: mark.getAttribute('pathLength'),
      name: getComputedStyle(mark).animationName,
    } : null;
  });
  results.futoshiki = { hintSamples: fhHint, mark: fhPeek };
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));

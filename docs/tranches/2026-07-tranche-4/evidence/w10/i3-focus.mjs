// I3 post-fix focus / forced-colors — the cell's HC keyboard-focus ring (both games).
// Confirms: normal mode unchanged (SVG ghost, no cell outline); forced-colors → the cell
// paints a real system-color outline (2px solid), captured as a full ring PNG.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const BASE = process.env.BASE || 'http://localhost:4490';
const EV = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-07-tranche-4/evidence/w10';
const GAMES = [
  { game: 'sudoku', url: `${BASE}/`, cell: '.sudoku-cell' },
  { game: 'futoshiki', url: `${BASE}/?game=futoshiki`, cell: '.futoshiki-cell' },
];

function probe(cellSel) {
  const input = document.querySelector(`${cellSel} input`);
  if (!input) return null;
  input.focus();
  const cell = input.closest(cellSel);
  const cs = getComputedStyle(cell);
  const is = getComputedStyle(input);
  return {
    inputFV: input.matches(':focus-visible'),
    cellMatchesHas: cell.matches(`${cellSel}:has(input:focus-visible)`),
    cellOutline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
    cellOutlineOffset: cs.outlineOffset,
    inputOutlineStyle: is.outlineStyle,
  };
}

async function main() {
  const browser = await chromium.launch();
  const out = { generatedAt: new Date().toISOString(), findings: {} };
  for (const { game, url, cell } of GAMES) {
    // NORMAL (no forced-colors) — confirm cell has NO CSS outline (SVG ghost is the ring)
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      out.findings[`${game}:normal:light`] = await page.evaluate(probe, cell);
      await ctx.close();
    }
    // FORCED-COLORS active, both schemes — the cell should paint a real system outline
    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme, forcedColors: 'active' });
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      out.findings[`${game}:forcedColors:${scheme}`] = await page.evaluate(probe, cell);
      const box = await page.evaluate((c) => { const el = document.querySelector(c); const r = el.getBoundingClientRect(); return { x: Math.max(0, r.x - 30), y: Math.max(0, r.y - 30), width: 220, height: 220 }; }, cell);
      await page.screenshot({ path: `${EV}/i3-focus-${game}-forcedcolors-${scheme}.png`, clip: box });
      await ctx.close();
    }
  }
  fs.writeFileSync(`${EV}/i3-focus-raw.json`, JSON.stringify(out, null, 2));
  for (const [k, v] of Object.entries(out.findings)) console.log(`${k.padEnd(34)} ${JSON.stringify(v)}`);
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });

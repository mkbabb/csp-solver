// I3 parity — re-run C1's recipe WITHOUT touching the baselines. Captures board + full for
// each game×theme (reducedMotion reduce, pinned board, dark boots the renamed key), writes to
// a SCRATCH dir, then sharp-diffs against C1's committed baselines. board must be AE=0; full
// nonzero is localized (bbox) and expected only where the deliberate a11y ink lift lands.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4490';
const EV = dirname(fileURLToPath(import.meta.url));
const SCRATCH = process.env.SCRATCH || '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/parity';
mkdirSync(SCRATCH, { recursive: true });
const require = createRequire(join(EV, '../../../../../web/frontend/package.json'));
const { chromium } = require('@playwright/test');
const sharp = require('sharp');
const DARK_KEY = 'sudoku-color-scheme'; // renamed by I2

function b64url(s) { return Buffer.from(s, 'binary').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function encodeSudoku(size, cells, total) { let c = ''; for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36); return b64url(`${size}.${c}`); }
function encodeFutoshiki(size, cells, total, ineqs) { let c = ''; for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36); const iq = ineqs.map(([a, b]) => `${a}-${b}`).join(','); return b64url(`${size}.${c}.${iq}`); }
const SUDOKU_BOARD = encodeSudoku(3, { 0: 5, 2: 8, 11: 3, 18: 6, 20: 9 }, 81);
const FUTOSHIKI_BOARD = encodeFutoshiki(5, { 0: 3 }, 25, [[1, 2]]);

async function settle(page, { dark, futoshiki }) {
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  await page.waitForSelector('image.boil-frame-bitmap.is-active', { timeout: 15000 });
  if (dark) {
    await page.waitForSelector('html.dark', { timeout: 5000 });
    await page.waitForSelector('.toggle-rest.rest-moon.is-active', { timeout: 15000 });
    await page.waitForSelector('button.sun-moon-toggle.is-turning', { state: 'detached', timeout: 5000 }).catch(() => {});
    await page.waitForSelector('.toggle-rest.rest-moon img.rest-pose.is-pose-active', { timeout: 15000 });
  }
  if (futoshiki) { await page.waitForSelector('.futoshiki-cell', { timeout: 15000 }); await page.locator('.futoshiki-caret').first().waitFor({ state: 'visible', timeout: 15000 }); }
  else { await page.locator('.sudoku-cell').first().locator('.glyph-svg').first().waitFor({ timeout: 15000 }); }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}

async function diff(aPath, bPath) {
  if (!existsSync(bPath)) return { err: `baseline missing: ${bPath}` };
  const A = sharp(aPath), B = sharp(bPath);
  const [ma, mb] = [await A.metadata(), await B.metadata()];
  if (ma.width !== mb.width || ma.height !== mb.height) return { err: `dim mismatch ${ma.width}x${ma.height} vs ${mb.width}x${mb.height}` };
  const ra = await A.raw().toBuffer(), rb = await B.raw().toBuffer();
  const ch = ma.channels, W = ma.width, H = ma.height;
  let diffPx = 0, maxDelta = 0, sumDelta = 0;
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let i = 0, p = 0; i < ra.length; i += ch, p++) {
    let d = 0;
    for (let k = 0; k < Math.min(ch, 3); k++) d = Math.max(d, Math.abs(ra[i + k] - rb[i + k]));
    if (d > 0) {
      diffPx++; sumDelta += d; if (d > maxDelta) maxDelta = d;
      const x = p % W, y = (p / W) | 0;
      if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  const total = W * H;
  return { W, H, diffPx, diffFrac: +(100 * diffPx / total).toFixed(4), maxDelta, meanDeltaOverChanged: diffPx ? +(sumDelta / diffPx).toFixed(1) : 0, bbox: maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 } };
}

async function capture(browser, { name, url, dark, futoshiki }) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  if (dark) await context.addInitScript((k) => localStorage.setItem(k, 'dark'), DARK_KEY);
  const page = await context.newPage();
  await page.goto(url);
  await settle(page, { dark, futoshiki });
  const boardBox = await page.locator('.board-wrapper').first().boundingBox();
  const boardFile = join(SCRATCH, `i3-parity-${name}-board.png`);
  const fullFile = join(SCRATCH, `i3-parity-${name}-full.png`);
  await page.screenshot({ path: boardFile, clip: boardBox, scale: 'device', animations: 'disabled', caret: 'hide' });
  await page.screenshot({ path: fullFile, scale: 'device', animations: 'disabled', caret: 'hide' });
  await context.close();
  const boardD = await diff(boardFile, join(EV, `parity-${name}-board.png`));
  const fullD = await diff(fullFile, join(EV, `parity-${name}-full.png`));
  console.log(`\n== ${name} ==`);
  console.log(`  board  vs C1 baseline: ${JSON.stringify(boardD)}`);
  console.log(`  full   vs C1 baseline: ${JSON.stringify(fullD)}`);
  return { name, boardD, fullD };
}

const PAIRS = [
  { name: 'sudoku-light', url: `${BASE}/?board=${SUDOKU_BOARD}`, dark: false, futoshiki: false },
  { name: 'sudoku-dark', url: `${BASE}/?board=${SUDOKU_BOARD}`, dark: true, futoshiki: false },
  { name: 'futoshiki-light', url: `${BASE}/?game=futoshiki&board=${FUTOSHIKI_BOARD}`, dark: false, futoshiki: true },
  { name: 'futoshiki-dark', url: `${BASE}/?game=futoshiki&board=${FUTOSHIKI_BOARD}`, dark: true, futoshiki: true },
];
const browser = await chromium.launch({ args: ['--force-color-profile=srgb'] });
console.log(`BASE=${BASE} DARK_KEY=${DARK_KEY}`);
const summary = [];
for (const p of PAIRS) summary.push(await capture(browser, p));
await browser.close();
console.log('\n=== PARITY SUMMARY (board AE must be 0; full nonzero = deliberate ink, localized above) ===');
for (const s of summary) console.log(`  ${s.name.padEnd(16)} board.diffPx=${s.boardD.diffPx ?? s.boardD.err}  full.diffPx=${s.fullD.diffPx ?? s.fullD.err} (${s.fullD.diffFrac ?? '?'}%)`);

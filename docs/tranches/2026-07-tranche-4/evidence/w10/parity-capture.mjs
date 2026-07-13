// T4-W10 lane C1 — the reduced-motion PARITY baseline capture.
//
// The wave's definitive bound: the idiom sweep (easing → CSS-var swap, defineModel,
// :ref hoist, flourish inject, theme-key rename) is MOTION-NEUTRAL, so a settled
// reduced-motion render is pixel-identical before vs after. This script mints the
// BEFORE baseline at HEAD 766aa068; V re-runs it byte-identically AFTER the sweep and
// asserts AE=0 against these PNGs.
//
// RUN (against the BUILT DIST only — never :3000 dev):
//   cd web/frontend && npm run build && npx vite preview --port 4485 --strictPort &
//   node docs/tranches/2026-07-tranche-4/evidence/w10/parity-capture.mjs
//
// Capture contract (mirrors playwright-golden.config.ts / visual-golden.spec.ts):
//   - viewport 1280×800, deviceScaleFactor 2 (true device pixels), reducedMotion 'reduce'
//     (K38: freezes the ~8 Hz boil beat at pose 0 → deterministic baked pose stack),
//     --force-color-profile=srgb (reproducible raster bytes cross-machine).
//   - Board PINNED via ?board= (URL wins over the auto-deal) so board pixels are fixed.
//   - Settle = the `.is-active` baked-pose handoff + fonts.ready — NEVER a fixed sleep.
//   - Two surfaces per pair: `-board.png` (clip to .board-wrapper bbox — the raster-stable
//     primary game surface, the load-bearing AE=0 target) and `-full.png` (whole viewport,
//     banked for completeness; the toggle crest's feTurbulence twinkle may carry raster
//     jitter — self-AE is measured + reported, not assumed).
//   - Each surface captured TWICE and sha256-compared in-run to PROVE machine determinism.
//
// DARK-BOOT KEY WRINKLE (read before re-running post-sweep): the dark pairs boot via
// localStorage. At HEAD the key is the vueuse default 'vueuse-color-scheme'. The W10 sweep
// RENAMES it to 'sudoku-color-scheme' (theme-key gate). So V's post-sweep re-run MUST set
// KEY='sudoku-color-scheme' (env override below) — the resulting moon-rest PIXELS are
// AE=0, only the boot-key STRING differs. Baseline here uses the HEAD key.

import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4485';
const OUT = dirname(fileURLToPath(import.meta.url));
// Resolve @playwright/test from web/frontend/node_modules (this script lives outside it).
// evidence/w10/ is 5 dirs under the repo root: docs/tranches/2026-07-tranche-4/evidence/w10/.
const require = createRequire(join(OUT, '../../../../../web/frontend/package.json'));
const { chromium } = require('@playwright/test');
const DARK_KEY = process.env.KEY || 'vueuse-color-scheme'; // HEAD default; post-rename: 'sudoku-color-scheme'

mkdirSync(OUT, { recursive: true });

// ── Encoders (byte-identical to composables' encodeBoard / permalink.spec.ts) ──
function b64url(s) {
  return Buffer.from(s, 'binary').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function encodeSudoku(size, cells, total) {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  return b64url(`${size}.${c}`);
}
function encodeFutoshiki(size, cells, total, ineqs) {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  const iq = ineqs.map(([a, b]) => `${a}-${b}`).join(',');
  return b64url(`${size}.${c}.${iq}`);
}

// Pinned boards — deterministic PIXELS (not necessarily solvable; a golden needs fixed bytes).
const SUDOKU_BOARD = encodeSudoku(3, { 0: 5, 2: 8, 11: 3, 18: 6, 20: 9 }, 81); // reuses the golden PINNED_GIVENS
const FUTOSHIKI_BOARD = encodeFutoshiki(5, { 0: 3 }, 25, [[1, 2]]); // the permalink-spec proven pin

const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 16);

async function settle(page, { dark, futoshiki }) {
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  await page.waitForSelector('image.boil-frame-bitmap.is-active', { timeout: 15000 });
  if (dark) {
    await page.waitForSelector('html.dark', { timeout: 5000 });
    await page.waitForSelector('.toggle-rest.rest-moon.is-active', { timeout: 15000 });
    await page.waitForSelector('button.sun-moon-toggle.is-turning', { state: 'detached', timeout: 5000 }).catch(() => {});
    await page.waitForSelector('.toggle-rest.rest-moon img.rest-pose.is-pose-active', { timeout: 15000 });
  }
  if (futoshiki) {
    await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });
    await page.locator('.futoshiki-caret').first().waitFor({ state: 'visible', timeout: 15000 });
  } else {
    await page.locator('.sudoku-cell').first().locator('.glyph-svg').first().waitFor({ timeout: 15000 });
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300); // one settle margin AFTER the .is-active handoff (bounded, deterministic)
}

async function capturePair(browser, { name, url, dark, futoshiki }) {
  const results = [];
  for (const pass of [1, 2]) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      reducedMotion: 'reduce',
    });
    if (dark) {
      await context.addInitScript((k) => localStorage.setItem(k, 'dark'), DARK_KEY);
    }
    const page = await context.newPage();
    await page.goto(url);
    await settle(page, { dark, futoshiki });

    const boardBox = await page.locator('.board-wrapper').first().boundingBox();
    const boardFile = join(OUT, `parity-${name}-board${pass === 1 ? '' : '-2'}.png`);
    const fullFile = join(OUT, `parity-${name}-full${pass === 1 ? '' : '-2'}.png`);
    await page.screenshot({ path: boardFile, clip: boardBox, scale: 'device', animations: 'disabled', caret: 'hide' });
    await page.screenshot({ path: fullFile, scale: 'device', animations: 'disabled', caret: 'hide' });
    results.push({ boardFile, fullFile });
    await context.close();
  }
  const boardAE = sha(results[0].boardFile) === sha(results[1].boardFile);
  const fullAE = sha(results[0].fullFile) === sha(results[1].fullFile);
  console.log(`${name.padEnd(20)} board self-AE0=${boardAE}  full self-AE0=${fullAE}  board.sha=${sha(results[0].boardFile)}  full.sha=${sha(results[0].fullFile)}`);
  return { name, boardAE, fullAE, boardSha: sha(results[0].boardFile), fullSha: sha(results[0].fullFile) };
}

const PAIRS = [
  { name: 'sudoku-light', url: `${BASE}/?board=${SUDOKU_BOARD}`, dark: false, futoshiki: false },
  { name: 'sudoku-dark', url: `${BASE}/?board=${SUDOKU_BOARD}`, dark: true, futoshiki: false },
  { name: 'futoshiki-light', url: `${BASE}/?game=futoshiki&board=${FUTOSHIKI_BOARD}`, dark: false, futoshiki: true },
  { name: 'futoshiki-dark', url: `${BASE}/?game=futoshiki&board=${FUTOSHIKI_BOARD}`, dark: true, futoshiki: true },
];

const browser = await chromium.launch({ args: ['--force-color-profile=srgb'] });
console.log(`BASE=${BASE}  DARK_KEY=${DARK_KEY}`);
console.log(`SUDOKU_BOARD=${SUDOKU_BOARD}`);
console.log(`FUTOSHIKI_BOARD=${FUTOSHIKI_BOARD}`);
const summary = [];
for (const p of PAIRS) summary.push(await capturePair(browser, p));
await browser.close();
console.log('\n=== SELF-AE SUMMARY (true = byte-identical across two consecutive captures) ===');
console.table(summary);
// Clean the -2 duplicates: keep only the pass-1 baseline PNGs. (left in place if this errors)

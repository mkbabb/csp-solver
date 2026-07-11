// T3-WGATE Lane D — LIVE production drive of https://sudoku.babb.dev
// Headless chromium; drives solve / theme-whirl / drawer / game-switch, banks
// two solved screenshots (light+dark), emits a JSON probe record on stdout.
import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = 'https://sudoku.babb.dev/';
const SHOT_DIR = process.argv[2];
fs.mkdirSync(SHOT_DIR, { recursive: true });

const out = { url: URL, probes: {}, console_errors: [], ok: true };
const rec = (k, v) => { out.probes[k] = v; };

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pg = await ctx.newPage();

pg.on('console', (m) => { if (m.type() === 'error') out.console_errors.push(m.text()); });
pg.on('pageerror', (e) => out.console_errors.push('pageerror: ' + e.message));

try {
  const resp = await pg.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
  rec('http_status', resp.status());
  await pg.waitForSelector('svg.handwritten-logo', { timeout: 20000 });

  // --- theme baseline ---
  const startedDark = await pg.locator('html').evaluate((el) => el.classList.contains('dark'));
  rec('initial_theme', startedDark ? 'dark' : 'light');
  // Normalize to LIGHT for shot 1.
  if (startedDark) {
    await pg.locator('button.sun-moon-toggle').click();
    await pg.waitForTimeout(1200);
  }

  // --- SOLVE a board --- (randomize → solve → solve-success, per the e2e flow)
  await pg.locator('.controls-card button[aria-label="Randomize board"]').first().click();
  await pg.waitForTimeout(2500);
  const solveBtn = pg.locator('.controls-card button[aria-label="Solve puzzle"]');
  await solveBtn.first().waitFor({ timeout: 15000 });
  await solveBtn.first().click();
  await pg.locator('.board-wrapper.solve-success').first().waitFor({ timeout: 25000 });
  const totalCells = await pg.locator('.sudoku-cell').count();
  const filledCells = await pg.locator('.sudoku-cell:has(.glyph-svg)').count();
  rec('solve_success_class', true);
  rec('cells_total', totalCells);
  rec('cells_filled', filledCells);
  rec('board_fully_filled', totalCells > 0 && filledCells === totalCells);

  // margin vignette + nothing below the board (W12: grade in the margin, quiet page)
  const marginNote = pg.locator('.margin-note');
  rec('margin_note_count', await marginNote.count());
  const boardBox = await pg.locator('.board-wrapper').first().boundingBox();
  const noteBox = (await marginNote.count()) ? await marginNote.first().boundingBox() : null;
  rec('board_box', boardBox);
  rec('margin_note_box', noteBox);
  // margin-note sits to the RIGHT of the board (in the margin), not below it
  if (boardBox && noteBox) {
    rec('margin_note_is_lateral', noteBox.x >= boardBox.x + boardBox.width - 4);
    rec('margin_note_not_below_board', noteBox.y < boardBox.y + boardBox.height);
  }
  // Assert no large content block renders BELOW the board (the page goes quiet)
  const belowBoard = await pg.evaluate(() => {
    const bw = document.querySelector('.board-wrapper');
    if (!bw) return null;
    const bb = bw.getBoundingClientRect();
    const threshold = bb.bottom + 24;
    let tallestBelow = 0;
    for (const el of document.querySelectorAll('main *, .app *')) {
      const r = el.getBoundingClientRect();
      if (r.top >= threshold && r.height > 40 && r.width > 120 && el.offsetParent) {
        tallestBelow = Math.max(tallestBelow, r.height);
      }
    }
    return { threshold, tallestBelow };
  });
  rec('below_board_scan', belowBoard);

  await pg.waitForTimeout(3200); // let the celebration crest settle for the shot
  const lightShot = `${SHOT_DIR}/live-solved-light.png`;
  await pg.screenshot({ path: lightShot, fullPage: false });
  rec('shot_light', lightShot);

  // --- TOGGLE THEME (the whirl) ---
  await pg.locator('button.sun-moon-toggle').click();
  await pg.waitForTimeout(1400);
  const nowDark = await pg.locator('html').evaluate((el) => el.classList.contains('dark'));
  rec('theme_toggled_to_dark', nowDark === true);
  rec('moon_active', await pg.locator('svg.toggle-moon.is-active').count() > 0);
  const darkShot = `${SHOT_DIR}/live-solved-dark.png`;
  await pg.screenshot({ path: darkShot, fullPage: false });
  rec('shot_dark', darkShot);

  // --- DRAWER open/close at 1440 ---
  const drawer = pg.locator('#controls-drawer');
  const tab = pg.locator('.drawer-tab');
  await tab.first().waitFor({ timeout: 8000 });
  const drawerVisibleStart = await drawer.first().isVisible();
  await tab.first().click();
  await pg.waitForTimeout(900);
  const afterFirst = await drawer.first().isVisible();
  await tab.first().click();
  await pg.waitForTimeout(900);
  const afterSecond = await drawer.first().isVisible();
  rec('drawer_start_visible', drawerVisibleStart);
  rec('drawer_after_toggle1', afterFirst);
  rec('drawer_after_toggle2', afterSecond);
  rec('drawer_toggles', afterFirst !== drawerVisibleStart && afterSecond === drawerVisibleStart);

  // --- SWITCH GAMES (the page-turn) ---
  await pg.locator('button.logo-trigger').click();
  await pg.waitForTimeout(400);
  await pg.getByRole('option', { name: 'futoshiki' }).click();
  await pg.waitForSelector('.futoshiki-cell', { timeout: 20000 });
  await pg.locator('.futoshiki-caret').first().waitFor({ timeout: 20000 });
  rec('game_switch_futoshiki_mounted', true);
  rec('futoshiki_cell_count', await pg.locator('.futoshiki-cell').count());

  rec('console_error_count', out.console_errors.length);
} catch (e) {
  out.ok = false;
  out.error = String(e && e.stack ? e.stack : e);
} finally {
  await browser.close();
}
console.log('WGATE_JSON_START');
console.log(JSON.stringify(out, null, 2));
console.log('WGATE_JSON_END');

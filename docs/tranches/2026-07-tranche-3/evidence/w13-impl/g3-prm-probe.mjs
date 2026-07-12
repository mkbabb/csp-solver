// G3 gate — PRM parity AE=0 bound (K38 discipline) on every W13-touched surface.
// Headless chromium vs :3001 (owner dev server; probes only, never killed).
// Method: reducedMotion:'reduce' context; per surface, drive the gesture, settle,
// then screenshot PAIR 2.5s apart -> exact AE via `magick compare -metric AE`.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/g3-prm';
mkdirSync(OUT, { recursive: true });
const URL = 'http://localhost:3001/';
const results = {};

function ae(a, b) {
  try {
    execFileSync('magick', ['compare', '-metric', 'AE', a, b, 'null:'], { stdio: ['ignore', 'pipe', 'pipe'] });
    return 0;
  } catch (e) {
    return Number(String(e.stderr).trim().split(' ')[0]);
  }
}

async function pair(page, name, gapMs = 2500) {
  await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  const a = `${OUT}/${name}-a.png`;
  const b = `${OUT}/${name}-b.png`;
  await page.screenshot({ path: a });
  await page.waitForTimeout(gapMs);
  await page.screenshot({ path: b });
  return ae(a, b);
}

const browser = await chromium.launch({ headless: true });

async function ctx(colorScheme) {
  const c = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme,
    reducedMotion: 'reduce',
  });
  const page = await c.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  await page.waitForTimeout(3000); // draw-ins + settle
  return { c, page };
}

// 1+2 — settled idle, dark and light (outlines, divider, logo, mascot, toggle rest stacks, grid).
for (const scheme of ['dark', 'light']) {
  const { c, page } = await ctx(scheme);
  results[`idle-${scheme}`] = { AE: await pair(page, `idle-${scheme}`) };
  await c.close();
}

// 3 — toggle gesture under PRM: immediate flip, crossfade done by +600ms, then static.
{
  const { c, page } = await ctx('dark');
  const btn = page.locator('button[aria-label^="Switch to"]');
  await btn.click();
  const flipped = await page.evaluate(() => document.documentElement.className || document.documentElement.dataset.theme || '');
  const warp = await page.evaluate(() => {
    const w = document.querySelector('.toggle-icon .warp');
    return w ? getComputedStyle(w).transform : 'no-warp-el';
  });
  await page.mouse.move(720, 880); // park pointer off the button so hover state is stable
  await page.waitForTimeout(700); // 200ms crossfade + margin
  results['toggle-gesture'] = { AE: await pair(page, 'toggle-prm'), themeAfterClick: flipped, warpTransform: warp };
  await c.close();
}

// 4 — drawer gesture under PRM: same-frame swap, then static.
{
  const { c, page } = await ctx('dark');
  const tab = page.locator('.drawer-tab');
  const visible = await tab.isVisible().catch(() => false);
  if (visible) {
    await tab.click();
    const aria = await tab.getAttribute('aria-expanded');
    await page.mouse.move(720, 880);
    await page.waitForTimeout(400);
    results['drawer'] = { AE: await pair(page, 'drawer-prm'), ariaExpanded: aria };
  } else {
    results['drawer'] = { skipped: 'tab not visible at 1440x900' };
  }
  await c.close();
}

// 5 — hint under PRM: instant glyph, no draw-on, no murmur; then static.
{
  const { c, page } = await ctx('dark');
  const idx = await page.evaluate(() => {
    const cells = [...document.querySelectorAll('.sudoku-cell')];
    return cells.findIndex((cell) => !cell.querySelector('.glyph-svg'));
  });
  await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);
  await page.keyboard.press('h');
  await page.waitForTimeout(150);
  const glyph = await page.evaluate((i) => {
    const p = document.querySelectorAll('.sudoku-cell')[i].querySelector('.glyph-svg path');
    return p
      ? { present: true, dash: p.style.strokeDasharray || 'none', off: p.style.strokeDashoffset || '0' }
      : { present: false };
  }, idx);
  results['hint'] = { AE: await pair(page, 'hint-prm'), glyphAt150ms: glyph };
  await c.close();
}

// 6 — peek (K hold) under PRM: marks + laminate instant at rest opacity; static while held.
{
  const { c, page } = await ctx('dark');
  await page.keyboard.down('k');
  await page.waitForTimeout(600);
  const marks = await page.evaluate(() => {
    const ms = [...document.querySelectorAll('.pencil-draw-on')];
    const names = new Set(ms.map((m) => getComputedStyle(m).animationName));
    return { count: ms.length, animationNames: [...names] };
  });
  results['peek-hold'] = { AE: await pair(page, 'peek-prm'), drawOnPaths: marks };
  await page.keyboard.up('k');
  await c.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));

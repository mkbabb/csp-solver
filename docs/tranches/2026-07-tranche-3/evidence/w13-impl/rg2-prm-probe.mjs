// RG2 re-gate — PRM parity AE=0 (K38) on the THREE correction-lane re-touched surfaces:
//   (1) toggle idle (c1 — whole-icon rest stacks, light sun + dark moon),
//   (2) drawer gesture (c2 — S5/S3′ recut, DrawerTab PRM override deleted),
//   (3) laminate PRT arm (c3 — stagger-widen; 16x16 opaque, 256 paths).
// Method = g3-prm-probe.mjs verbatim shape: headless chromium vs :3001, 1440x900 @DPR2,
// reducedMotion:'reduce'; drive, settle, blur, screenshot PAIR 2.5s apart,
// exact AE via `magick compare -metric AE`.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/rg2-prm';
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

async function ctx(colorScheme, opts = {}) {
  const c = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme,
    reducedMotion: 'reduce',
  });
  const page = await c.newPage();
  if (opts.contrast) await page.emulateMedia({ contrast: opts.contrast });
  await page.goto(opts.url ?? URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('.sudoku-cell', { timeout: 25000 });
  await page.waitForTimeout(opts.settleMs ?? 3000);
  return { c, page };
}

// 1 — toggle idle (c1): light = sun whole-icon 4-pose stack; dark = moon stack.
for (const scheme of ['light', 'dark']) {
  const { c, page } = await ctx(scheme);
  const stack = await page.evaluate(() => {
    const poses = [...document.querySelectorAll('.dark-mode-toggle svg')].map((s) => ({
      cls: s.getAttribute('class'),
      vis: getComputedStyle(s).visibility,
      op: getComputedStyle(s).opacity,
    }));
    const warp = document.querySelector('.toggle-icon .warp');
    return { svgCount: poses.length, visiblePoses: poses.filter((p) => p.vis !== 'hidden' && p.op !== '0').length, warpTransform: warp ? getComputedStyle(warp).transform : 'no-warp-el' };
  });
  results[`toggle-idle-${scheme}`] = { AE: await pair(page, `toggle-idle-${scheme}`), ...stack };
  await c.close();
}

// 2 — drawer gesture (c2): PRM same-frame swap, then static; aria truthful.
{
  const { c, page } = await ctx('dark');
  const tab = page.locator('.drawer-tab');
  await tab.click();
  const aria = await tab.getAttribute('aria-expanded');
  const anims = await page.evaluate(() => document.getAnimations().length);
  await page.mouse.move(720, 880);
  await page.waitForTimeout(400);
  results['drawer-gesture'] = { AE: await pair(page, 'drawer-gesture'), ariaAfterClick: aria, animationsAfterClick: anims };
  await c.close();
}

// 3 — laminate PRT arm (c3): 16x16 (?size=4) + prefers-contrast:more = 256 opaque
// key paths; K held across the pair — instant, primitive-inherited.
{
  const { c, page } = await ctx('dark', { url: `${URL}?size=4`, contrast: 'more', settleMs: 4000 });
  const idx = await page.evaluate(() => [...document.querySelectorAll('.sudoku-cell')].findIndex((cell) => !cell.querySelector('.glyph-svg')));
  await page.evaluate((i) => document.querySelectorAll('.sudoku-cell')[i].querySelector('input').focus(), idx);
  await page.keyboard.down('k');
  await page.waitForTimeout(600);
  const key = await page.evaluate(() => {
    const paths = [...document.querySelectorAll('.answer-key-laminate .key-glyph path')];
    const agg = {};
    for (const p of paths) {
      const cs = getComputedStyle(p);
      const k = `${cs.animationName}|${cs.opacity}|${cs.strokeDashoffset}`;
      agg[k] = (agg[k] || 0) + 1;
    }
    return { keyPathCount: paths.length, styleHistogram: agg, contrastArm: window.matchMedia('(prefers-contrast: more)').matches };
  });
  results['laminate-prt'] = { AE: await pair(page, 'laminate-prt'), ...key };
  await page.keyboard.up('k');
  await c.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));

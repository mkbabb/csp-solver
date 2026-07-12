// T3-W13 GATE g1 — the painter inventory (boil first-principles row).
// Every perpetual surface must read pose-swap at idle: outlines x2, divider,
// mascot (toggle rest stacks), toggle icons (live pair parked), logo, hover chrome.
// Plus: SvgFilters pose variants present, fx button unfiltered, watcher gone (DOM-level:
// base defs never mutate across beats).
import { createRequire } from 'node:module';
const require = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
);
const { chromium } = require('playwright');

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
await page.waitForTimeout(5000); // settle past draw-ins

const snap = await page.evaluate(() => {
  const q = (s) => [...document.querySelectorAll(s)];
  const surf = {};

  // outlines (HandDrawnOutline mounts)
  surf.outlines = q('.outline-svg').map((svg) => ({
    poses: svg.querySelectorAll('.boil-pose').length,
    active: svg.querySelectorAll('.boil-pose.is-active').length,
    filteredNodes: svg.querySelectorAll('[filter]').length,
    visible: !!svg.closest('body') && getComputedStyle(svg).visibility !== 'hidden',
  }));

  // divider
  surf.divider = q('.boil-divider-wrap svg, svg.boil-divider').map((svg) => {
    const groups = [...svg.querySelectorAll('g')].filter((g) => g.hasAttribute('filter') || g.classList.contains('boil-pose'));
    return {
      poseGroups: groups.length,
      filters: [...new Set(groups.map((g) => g.getAttribute('filter')))],
      activeVisible: groups.filter((g) => getComputedStyle(g).opacity !== '0').length,
    };
  });

  // logo
  surf.logo = q('svg.handwritten-logo').map((svg) => ({
    poses: svg.querySelectorAll('.logo-pose').length,
    active: svg.querySelectorAll('.logo-pose.is-active').length,
    filters: [...svg.querySelectorAll('.logo-pose')].map((g) => g.getAttribute('filter')),
  }));

  // toggle: live pair parked, rest stacks pose-swapping
  const liveIcons = q('.toggle-icon');
  surf.toggleLive = liveIcons.map((el) => ({
    cls: el.getAttribute('class'),
    visibility: getComputedStyle(el).visibility,
    filter: el.getAttribute('filter'),
  }));
  surf.toggleRest = q('.toggle-rest').map((el) => ({
    cls: el.getAttribute('class'),
    visibility: getComputedStyle(el).visibility,
    poseSvgs: el.querySelectorAll('.rest-pose').length,
    poseActive: el.querySelectorAll('.rest-pose.is-pose-active').length,
    poseFilters: [...new Set([...el.querySelectorAll('.rest-pose')].map((p) => p.getAttribute('filter')))],
  }));

  // fx button
  const fx = document.querySelector('.tuner-toggle');
  surf.fxButton = fx
    ? { computedFilter: getComputedStyle(fx).filter, inlineStyle: fx.getAttribute('style') }
    : null;

  // SvgFilters: pose-variant defs present; base wobble defs' turbulence attrs (sampled now, resampled later)
  const turb = (id) => {
    const f = document.getElementById(id);
    const t = f?.querySelector('feTurbulence');
    return t ? { bf: t.getAttribute('baseFrequency'), seed: t.getAttribute('seed') } : null;
  };
  surf.filterDefs = {
    poseVariants: q('filter[id*="-p"]').map((f) => f.id).filter((id) => /-(p)\d$/.test(id)),
    baseWobble: {
      celestial: turb('wobble-celestial'),
      heart: turb('wobble-heart'),
      logo: turb('wobble-logo'),
    },
  };
  return surf;
});

// pose-swap liveness + base-def stasis: sample active pose indices + base def attrs over ~2s (16 beats)
const cycling = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const samples = [];
      const t0 = performance.now();
      const iv = setInterval(() => {
        const idx = (sel, act) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const poses = [...el.querySelectorAll(act)];
          return poses.findIndex(
            (p) => p.classList.contains('is-active') || p.classList.contains('is-pose-active'),
          );
        };
        const t = document.querySelector('#wobble-celestial feTurbulence');
        samples.push({
          t: Math.round(performance.now() - t0),
          outline: idx('.outline-svg', '.boil-pose'),
          logo: idx('svg.handwritten-logo', '.logo-pose'),
          restMoon: idx('.toggle-rest.rest-moon', '.rest-pose'),
          celestialBF: t?.getAttribute('baseFrequency'),
        });
        if (performance.now() - t0 > 2200) {
          clearInterval(iv);
          resolve(samples);
        }
      }, 60);
    }),
);

// hover chrome: what filter does a hovered .icon-btn get, and does the base def mutate after?
const tab = page.locator('.drawer-tab');
if ((await tab.getAttribute('aria-expanded')) === 'false') {
  await tab.click();
  await page.waitForTimeout(900);
}
await page.locator('.icon-btn:visible').first().hover();
await page.waitForTimeout(600);
const hover = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('.icon-btn')];
  const hovered = btns.find((b) => b.matches(':hover'));
  const t = document.querySelector('#wobble-celestial feTurbulence');
  return {
    hoveredFilter: hovered ? getComputedStyle(hovered).filter : null,
    celestialBF: t?.getAttribute('baseFrequency'),
    celestialSeed: t?.getAttribute('seed'),
  };
});

await browser.close();
console.log(JSON.stringify({ snap, cycling, hover }, null, 2));

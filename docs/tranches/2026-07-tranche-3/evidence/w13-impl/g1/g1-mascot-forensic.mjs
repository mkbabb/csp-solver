// T3-W13 GATE g1 — mascot A/B forensics: confirm the injection actually swaps the
// stage (dark), and align ray-pose frames + seed provenance (light).
import { createRequire } from 'node:module';
const require = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
);
const { chromium } = require('playwright');

const scheme = process.argv[2] ?? 'dark';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: scheme,
});
const page = await ctx.newPage();
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
await page.waitForTimeout(5000);
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.waitForTimeout(1200);

const before = await page.evaluate((scheme) => {
  const cs = (s) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).visibility : null;
  };
  const stackSel = scheme === 'dark' ? '.toggle-rest.rest-moon' : '.toggle-rest.rest-sun';
  const stack = document.querySelector(stackSel);
  const rayInfo = [];
  if (scheme === 'light') {
    // active ray pose in the sub-stack + its filter/seed
    const rayPoses = [...document.querySelectorAll('.rest-sun .rest-ray-spin .rest-pose')];
    rayPoses.forEach((p, i) => {
      if (p.classList.contains('is-pose-active')) {
        const m = /url\(#(.+?)\)/.exec(p.getAttribute('filter'));
        const t = document.querySelector(`#${m[1]} feTurbulence`);
        const poly = p.querySelector('polygon');
        rayInfo.push({
          idx: i,
          filter: m[1],
          bf: t?.getAttribute('baseFrequency'),
          seed: t?.getAttribute('seed'),
          firstPolyPoints: poly?.getAttribute('points')?.slice(0, 60),
        });
      }
    });
  }
  // live icon's ray polygon (frozen frame geometry)
  const livePoly = document.querySelector('.toggle-icon.toggle-sun .sun-rays polygon');
  const baseT = document.querySelector('#wobble-celestial feTurbulence');
  return {
    stackVis: cs(stackSel),
    liveVis: cs('.toggle-icon.is-active'),
    rayInfo,
    liveRayPoints: livePoly?.getAttribute('points')?.slice(0, 60) ?? null,
    baseBF: baseT?.getAttribute('baseFrequency'),
    baseSeed: baseT?.getAttribute('seed'),
    baseTurbAttrs: baseT ? [...baseT.attributes].map((a) => `${a.name}=${a.value}`) : null,
    poseTurbAttrs: (() => {
      const t = document.querySelector('#wobble-celestial-p1 feTurbulence');
      return t ? [...t.attributes].map((a) => `${a.name}=${a.value}`) : null;
    })(),
  };
}, scheme);

await page.addStyleTag({
  content: `
    .toggle-rest { visibility: hidden !important; }
    .toggle-icon.is-active { visibility: visible !important; }
    .toggle-icon .warp { transform: none !important; }
  `,
});
await page.waitForTimeout(400);
const after = await page.evaluate((scheme) => {
  const cs = (s) => {
    const el = document.querySelector(s);
    return el ? getComputedStyle(el).visibility : null;
  };
  const stackSel = scheme === 'dark' ? '.toggle-rest.rest-moon' : '.toggle-rest.rest-sun';
  const live = document.querySelector('.toggle-icon.is-active');
  const warp = live?.querySelector('.warp');
  return {
    stackVis: cs(stackSel),
    liveVis: cs('.toggle-icon.is-active'),
    warpTransform: warp ? getComputedStyle(warp).transform : null,
  };
}, scheme);
await browser.close();
console.log(JSON.stringify({ scheme, before, after }, null, 2));

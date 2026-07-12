// T3-W13 GATE g1 — mascot (toggle rest stack) SSIM A/B vs a live-filter reference,
// b2's injection method: freeze the beat (PRM engage), capture the stack pose, then
// hide the stack, un-park the live filtered instance with the base def pinned to the
// active pose's frequency, capture, compare. Runs dark (moon) and light (sun).
// Usage: node g1-mascot-ab.mjs <scheme: dark|light>
import { createRequire } from 'node:module';
const require = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
);
const { chromium } = require('playwright');

const scheme = process.argv[2] ?? 'dark';
const prmFromLoad = process.argv[3] === 'prmload';
const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/g1';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: scheme,
  ...(prmFromLoad ? { reducedMotion: 'reduce' } : {}),
});
const page = await ctx.newPage();
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
await page.waitForTimeout(5000);

// freeze the beat — PRM engage; boilBeat parks, pose index holds
if (!prmFromLoad) await page.emulateMedia({ reducedMotion: 'reduce' });
await page.waitForTimeout(1200); // PRM crossfade (200ms) + settle

// under PRM both rest stacks are visible (crossfade contract) — isolate the active one
const inactive = scheme === 'dark' ? '.rest-sun' : '.rest-moon';
await page.addStyleTag({
  content: `.toggle-rest${inactive} { visibility: hidden !important; }`,
});
await page.waitForTimeout(300);

const state = await page.evaluate((scheme) => {
  const stack = document.querySelector(
    scheme === 'dark' ? '.toggle-rest.rest-moon' : '.toggle-rest.rest-sun',
  );
  const poses = [...stack.querySelectorAll('.rest-pose')];
  const activeIdx = poses.findIndex((p) => p.classList.contains('is-pose-active'));
  const box = document.querySelector('.sun-moon-toggle').getBoundingClientRect();
  const poseFilter = poses[activeIdx]?.getAttribute('filter') ?? poses[0]?.getAttribute('filter');
  const m = /url\(#(.+?)\)/.exec(poseFilter);
  const t = document.querySelector(`#${m[1]} feTurbulence`);
  return {
    activeIdx,
    poseFilterId: m[1],
    poseBF: t?.getAttribute('baseFrequency'),
    poseSeed: t?.getAttribute('seed'),
    box: { x: box.x, y: box.y, width: box.width, height: box.height },
  };
}, scheme);
const clip = {
  x: Math.floor(state.box.x) - 8,
  y: Math.floor(state.box.y) - 8,
  width: Math.ceil(state.box.width) + 16,
  height: Math.ceil(state.box.height) + 16,
};

// A — the baked stack, active pose
await page.screenshot({ path: `${OUT}/mascot-${scheme}${prmFromLoad ? '-prmload' : ''}-stack.png`, clip });

// B — the live-filter reference: stack hidden, live instance un-parked at identity,
// base def pinned to the active pose's frequency
await page.addStyleTag({
  content: `
    .toggle-rest { visibility: hidden !important; }
    .toggle-icon.is-active { visibility: visible !important; }
    .toggle-icon .warp { transform: none !important; }
  `,
});
await page.evaluate(({ poseBF }) => {
  const t = document.querySelector('#wobble-celestial feTurbulence');
  t.setAttribute('baseFrequency', poseBF);
}, state);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/mascot-${scheme}${prmFromLoad ? '-prmload' : ''}-live.png`, clip });

await browser.close();
console.log(JSON.stringify({ scheme, state, clip }, null, 2));

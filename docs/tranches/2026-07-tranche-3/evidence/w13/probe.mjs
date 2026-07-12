import pw from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js';
const { chromium } = pw;
import fs from 'fs';

const OUT = '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13';
const URL = 'http://localhost:3001';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// launch headed with GPU so compositing/raster-scale behavior is faithful
const browser = await chromium.launch({
  headless: false,
  args: ['--force-device-scale-factor=2', '--enable-gpu'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);

await page.goto(URL, { waitUntil: 'networkidle' });
await sleep(800);

// Ensure we're in a known theme (light) and lg breakpoint (13rem toggle)
const box = await page.$eval('.sun-moon-toggle', (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
console.log('TOGGLE_BOX', JSON.stringify(box));

// clip in CSS px (playwright clip is CSS px; deviceScaleFactor handles the 2x)
const pad = 20;
const clip = { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.w + 2 * pad, height: box.h + 2 * pad };

// computed style of corner-right + the active icon
const info = await page.evaluate(() => {
  const cr = document.querySelector('.corner-right');
  const crs = getComputedStyle(cr);
  const sun = document.querySelector('.toggle-sun');
  const moon = document.querySelector('.toggle-moon');
  const activeSun = sun.classList.contains('is-active');
  const activeMoon = moon.classList.contains('is-active');
  const gc = (el) => { const s = getComputedStyle(el); return { transform: s.transform, opacity: s.opacity, filter: s.filter, willChange: s.willChange, visibility: s.visibility }; };
  return { cornerWillChange: crs.willChange, cornerTransform: crs.transform, activeSun, activeMoon, sun: gc(sun), moon: gc(moon), htmlClass: document.documentElement.className };
});
console.log('INFO', JSON.stringify(info, null, 2));

// ---- CDP LayerTree forensics ----
async function dumpLayers(label) {
  const layers = [];
  const onSnap = (params) => { layers.length = 0; layers.push(...params.layers); };
  cdp.on('LayerTree.layerTreeDidChange', onSnap);
  await cdp.send('LayerTree.enable');
  await sleep(300);
  cdp.off('LayerTree.layerTreeDidChange', onSnap);
  // find layers near the toggle corner (top-right)
  const near = layers.filter((l) => l.width && l.height).map((l) => ({ id: l.layerId, w: l.width, h: l.height, ox: l.offsetX, oy: l.offsetY, tf: l.transform, paint: l.paintCount }));
  fs.writeFileSync(`${OUT}/layers-${label}.json`, JSON.stringify(near, null, 2));
  await cdp.send('LayerTree.disable');
  console.log(`LAYERS_${label}`, near.length, 'layers dumped');
}
await dumpLayers('rest');

// ---- Static mid-whirl comparison (isolates raster-scale blur from motion) ----
// Force the active icon to a fixed magnified transform, no transition, keep the
// wobble filter. Compare crispness with .corner-right promoted (shipped) vs not.
async function staticShot(name, willChange, scale) {
  await page.evaluate(({ wc, sc }) => {
    let s = document.getElementById('probe-style');
    if (!s) { s = document.createElement('style'); s.id = 'probe-style'; document.head.appendChild(s); }
    s.textContent = `
      .corner-right { will-change: ${wc} !important; }
      .toggle-icon.is-active { transition: none !important; transform: scale(${sc}) !important; }
    `;
  }, { wc: willChange, sc: scale });
  await sleep(500); // let raster settle
  await page.screenshot({ path: `${OUT}/static-${name}.png`, clip });
  console.log('SHOT', name, 'wc=', willChange, 'scale=', scale);
}

await staticShot('rest-crisp', 'transform', 1.0);      // shipped, scale 1 (rest)
await staticShot('promoted-1_6', 'transform', 1.6);    // shipped promotion, scaled up
await staticShot('unpromoted-1_6', 'auto', 1.6);       // promotion removed, scaled up
await staticShot('promoted-0_5', 'transform', 0.5);    // shipped promotion, scaled down (whirl-in size)

// ---- LIVE whirl burst capture (the real gesture) ----
// remove probe style, restore shipped, then click and burst-screenshot
async function liveBurst(name, willChange) {
  await page.evaluate((wc) => {
    let s = document.getElementById('probe-style');
    if (!s) { s = document.createElement('style'); s.id = 'probe-style'; document.head.appendChild(s); }
    s.textContent = `.corner-right { will-change: ${wc} !important; }`;
  }, willChange);
  await sleep(300);
  await page.click('.sun-moon-toggle');
  // burst: capture through the 800ms whirl (each shot ~40-60ms + 90ms sleep ≈ 150ms cadence)
  for (let i = 0; i < 6; i++) {
    await page.screenshot({ path: `${OUT}/live-${name}-f${i}.png`, clip });
    await sleep(90);
  }
  await sleep(700); // let it land
  await page.screenshot({ path: `${OUT}/live-${name}-rest.png`, clip });
  console.log('LIVE_BURST', name, 'done');
}
// reset probe style to just will-change control before live runs
await page.evaluate(() => { const s = document.getElementById('probe-style'); if (s) s.textContent = ''; });

await liveBurst('promoted', 'transform');
await sleep(400);
await liveBurst('unpromoted', 'auto');

await browser.close();
console.log('DONE');

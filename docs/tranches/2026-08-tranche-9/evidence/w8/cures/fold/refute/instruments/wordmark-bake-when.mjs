// FOLD REFUTER — when the wordmark's BAKED stack (the four <image> nodes) mounts, per route.
// Written for this refutation because the rect census (settle 2,500 ms) found the cured gallery
// route carrying the LIVE filter where the base carries the four bitmaps, and no banked
// instrument reads that moment on `?view=gallery`. Polls one selector every rAF; prints the
// first stamp at which the four <image> nodes exist, or NOT MOUNTED inside the window.
//
// run: node wordmark-bake-when.mjs <port> <engine> <route> [waitMs]
import { createRequire } from 'node:module';
const req = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-fold/web/frontend/package.json',
);
const pw = req('playwright');
const [, , PORT, ENGINE = 'chromium', ROUTE = '/', WAIT = '12000'] = process.argv;
const b = await pw[ENGINE].launch();
const ctx = await b.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();
await page.addInitScript(() => {
  window.__W = { t: null, n: 0 };
  const tick = () => {
    const svg = document.querySelector('.logo-menu svg, .handwritten-logo svg');
    const n = svg ? svg.querySelectorAll('image').length : 0;
    if (n > window.__W.n) {
      window.__W.n = n;
      if (n >= 4 && window.__W.t === null) window.__W.t = performance.now();
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
await page.goto(`http://127.0.0.1:${PORT}${ROUTE}`, { waitUntil: 'load' });
await page.waitForTimeout(Number(WAIT));
const r = await page.evaluate(() => ({ t: window.__W.t, n: window.__W.n }));
console.log(
  JSON.stringify({
    port: PORT,
    engine: ENGINE,
    route: ROUTE,
    waitMs: Number(WAIT),
    images: r.n,
    bakedAtMs: r.t === null ? 'NOT MOUNTED' : Math.round(r.t),
  }),
);
await b.close();

#!/usr/bin/env node
// T9-W8 C10 VERIFY r1 — the deferral's own risk, which no banked instrument reads: the deck is
// no longer in the entry chunk, so a user who opens it BEFORE the warm has landed waits on a
// network fetch. This measures exactly that, on the regime the cure is sold for: cold Fast-3G,
// 4x CPU. It loads the board, waits for board-ready, opens the deck at the FIRST opportunity
// (the `g` shortcut, the earliest intent the app accepts), and times the press to the first
// painted card. Interleave is the caller's: one window per invocation, port given.
//
// run: node first-open.mjs --port 4256 --net fast3g --cpu 4 --vp desk
import { createRequire } from "node:module";
const require_ = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
);
const { chromium } = require_("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")
    ? process.argv[i + 1]
    : d;
};
const PORT = arg("port", "4256");
const NET = arg("net", "fast3g");
const CPU = Number(arg("cpu", "4"));
const VP = arg("vp", "desk");
const DELAY = Number(arg("delay", "0")); // ms to wait AFTER board-ready before the intent
const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  },
};
const FAST3G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

const READY = `
window.__V = { ready: null };
(function () {
  function tick() {
    if (window.__V.ready === null) {
      var bg = document.querySelector('.board-group');
      var cell = bg && bg.querySelector('.board-cells .game-cell');
      if (cell && cell.getBoundingClientRect().width > 0) {
        window.__V.ready = performance.now();
        return;
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
`;

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(VIEWPORTS[VP]);
  const page = await ctx.newPage();
  await page.addInitScript(READY);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  if (NET === "fast3g") await cdp.send("Network.emulateNetworkConditions", FAST3G);
  await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku`, { waitUntil: "commit" });
  await page.waitForFunction("window.__V.ready !== null", null, { timeout: 60000 });
  const ready = await page.evaluate("window.__V.ready");
  if (DELAY > 0) await page.waitForTimeout(DELAY);
  const t0 = await page.evaluate("performance.now()");
  await page.keyboard.press("g");
  await page.waitForFunction(
    `(() => { const c = document.querySelector('.game-card, [class*="game-card"]');
       return !!c && c.getBoundingClientRect().width > 0; })()`,
    null,
    { timeout: 60000 },
  );
  const t1 = await page.evaluate("performance.now()");
  const res = await page.evaluate(`performance.getEntriesByType('resource')
     .map(e => ({ n: e.name.split('/').pop(), s: Math.round(e.startTime), e: Math.round(e.responseEnd) }))
     .filter(r => /GameGallery/.test(r.n))`);
  console.log(
    JSON.stringify({
      port: PORT,
      net: NET,
      cpu: CPU,
      vp: VP,
      delayMs: DELAY,
      readyMs: Math.round(ready * 10) / 10,
      pressAtMs: Math.round(t0 * 10) / 10,
      openMs: Math.round((t1 - t0) * 10) / 10,
      galleryChunk: res,
    }),
  );
  await ctx.close();
  await browser.close();
};
run().catch((e) => {
  console.error("INSTRUMENT FAILURE", e);
  process.exit(3);
});

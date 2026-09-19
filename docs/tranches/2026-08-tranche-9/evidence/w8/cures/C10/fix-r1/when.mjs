// T9-W8 C10 FIX r1 — WHICH SIGNAL IS THE RIGHT WARM GATE. Prints, on one cold Fast-3G 4x load,
// the times of: DOMContentLoaded, the window load event, App's first rAF pair after mount, and
// board-ready (the A2 definition). Read so the warm's gate can be chosen against the number the
// cure owes: the gallery chunk must start AFTER board-ready, and as little after it as possible.
// run: node when.mjs --port 4257
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
const PORT = arg("port", "4257");
const VP = arg("vp", "desk");
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
const INIT = `
window.__W = { ready: null, dcl: null, load: null };
addEventListener('DOMContentLoaded', function () { window.__W.dcl = performance.now(); });
addEventListener('load', function () { window.__W.load = performance.now(); });
(function () {
  function tick() {
    if (window.__W.ready === null) {
      var b = document.querySelector('.board-group');
      var c = b && b.querySelector('.board-cells .game-cell');
      if (c && c.getBoundingClientRect().width > 0) { window.__W.ready = performance.now(); return; }
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
  await page.addInitScript(INIT);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  const CPU = Number(arg("cpu", "4"));
  if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  if (arg("net", "fast3g") === "fast3g")
    await cdp.send("Network.emulateNetworkConditions", FAST3G);
  await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku`, { waitUntil: "commit" });
  await page.waitForFunction("window.__W.ready !== null", null, { timeout: 60000 });
  await page.waitForTimeout(Number(arg("wait", "5000")));
  const w = await page.evaluate("window.__W");
  const res = await page.evaluate(`performance.getEntriesByType('resource')
    .map(e => ({ n: e.name.split('/').pop(), s: Math.round(e.startTime), e: Math.round(e.responseEnd) }))
    .filter(r => /GameGallery|app-shared|\\.woff2|wasm/.test(r.n))`);
  console.log(
    JSON.stringify({
      port: PORT,
      vp: VP,
      readyMs: w.ready === null ? null : Math.round(w.ready),
      dclMs: w.dcl === null ? null : Math.round(w.dcl),
      loadMs: w.load === null ? null : Math.round(w.load),
      res,
    }),
  );
  await ctx.close();
  await browser.close();
};
run().catch((e) => {
  console.error("INSTRUMENT FAILURE", e);
  process.exit(3);
});

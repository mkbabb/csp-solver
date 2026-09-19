// T9-W8 C10 VERIFY r1 — when does the gallery chunk's WARM actually land, with no intent at all?
// Cold Fast-3G, 4x CPU. Loads the board, sits for --wait ms, and prints the chunk's fetch window
// against board-ready. No press, so anything it sees is the idle/timeout warm alone.
import { createRequire } from "node:module";
const require_ = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const { chromium } = require_("playwright");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 && process.argv[i+1] && !process.argv[i+1].startsWith("--") ? process.argv[i+1] : d; };
const PORT = arg("port", "4257"); const WAIT = Number(arg("wait", "6000"));
const FAST3G = { offline: false, downloadThroughput: (1.6*1024*1024)/8, uploadThroughput: (750*1024)/8, latency: 150 };
const READY = `window.__V={ready:null};(function(){function t(){if(window.__V.ready===null){var b=document.querySelector('.board-group');var c=b&&b.querySelector('.board-cells .game-cell');if(c&&c.getBoundingClientRect().width>0){window.__V.ready=performance.now();return;}}requestAnimationFrame(t);}requestAnimationFrame(t);})();`;
const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.addInitScript(READY);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.emulateNetworkConditions", FAST3G);
  await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku`, { waitUntil: "commit" });
  await page.waitForFunction("window.__V.ready !== null", null, { timeout: 60000 });
  const ready = await page.evaluate("window.__V.ready");
  await page.waitForTimeout(WAIT);
  const res = await page.evaluate(`performance.getEntriesByType('resource').map(e=>({n:e.name.split('/').pop(),s:Math.round(e.startTime),e:Math.round(e.responseEnd)})).filter(r=>/GameGallery/.test(r.n))`);
  console.log(JSON.stringify({ port: PORT, readyMs: Math.round(ready), chunk: res }));
  await ctx.close(); await browser.close();
};
run().catch((e) => { console.error("INSTRUMENT FAILURE", e); process.exit(3); });

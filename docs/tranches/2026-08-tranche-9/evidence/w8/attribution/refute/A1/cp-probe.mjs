// RUN: cd web/frontend && node <refute/A1>/cp-probe.mjs --engine webkit --port 4255 --windows 3 --out p.jsonl
// T9-W8 §8.1 REFUTER, lane A1 · lens 3 (THE CRITICAL PATH).
// The banked A1 instrument stamps board-ready inside a rAF. When the main thread is inside a
// toBlob the rAF cannot run, so "board-ready 441" is ambiguous between (a) the board was not
// ready until 441 and (b) the board WAS ready at ~130 and the encode delayed only the STAMP.
// This probe disambiguates: it records the FULL board-ready CONDITION STATE at every rAF tick
// (board-group visible? its box; first .cell rect) so the last tick BEFORE the blocking gap
// says whether the condition already held. Same visibility + rect predicates as bake-census.mjs.
// Reads the fixed dist through a preview server; writes nothing to src.
import { writeFileSync, appendFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const req = createRequire(pathToFileURL(process.cwd() + "/"));
const { chromium, webkit } = req("playwright");
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const ENGINE = arg("engine", "webkit"), PORT = arg("port", "4255");
const WINDOWS = Number(arg("windows", "3")), OUT = arg("out", "cp-probe.jsonl");
const VP = arg("vp", "desk"), CPU = Number(arg("cpu", "1")), NET = arg("net", "none");
const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
};
const INIT = () => {
  window.__cp = { ticks: [], boardReady: null, firstTrue: null, blobs: [] };
  const realToBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, t, q) {
    const t0 = performance.now(), w = this.width;
    return realToBlob.call(this, (b) => {
      window.__cp.blobs.push({ w, t0: +t0.toFixed(1), t1: +performance.now().toFixed(1), bytes: b ? b.size : null });
      cb(b);
    }, t, q);
  };
  const visible = (el) => {
    if (!el) return false;
    if (el.getClientRects().length === 0) return false;
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden";
  };
  const tick = () => {
    const t = +performance.now().toFixed(1);
    const bg = document.querySelector(".board-group");
    const vis = visible(bg);
    const bgr = bg ? bg.getBoundingClientRect() : null;
    const cell = bg ? bg.querySelector('[class*="cell"]') : null;
    const cr = cell ? cell.getBoundingClientRect() : null;
    const cond = vis && !!cr && cr.width > 0 && cr.height > 0;
    window.__cp.ticks.push({ t, vis, bgW: bgr ? +bgr.width.toFixed(1) : null,
      cellW: cr ? +cr.width.toFixed(1) : null, cond, nCells: bg ? bg.querySelectorAll('[class*="cell"]').length : 0 });
    if (cond && window.__cp.firstTrue === null) window.__cp.firstTrue = t;
    if (cond && window.__cp.boardReady === null) {
      requestAnimationFrame(() => { window.__cp.boardReady = +performance.now().toFixed(1); });
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const line = (o) => appendFileSync(OUT, JSON.stringify(o) + "\n");
const loadavg = () => execSync("sysctl -n vm.loadavg").toString().trim();
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
writeFileSync(OUT, JSON.stringify({ k: "meta", engine: ENGINE, cpu: ENGINE === "chromium" ? CPU : "1 (webkit: CDP unavailable)",
  net: ENGINE === "chromium" ? NET : "unthrottled (webkit: CDP unavailable)", cache: "cold", vp: VP,
  base: `http://127.0.0.1:${PORT}/`, loadavgStart: loadavg(), ts: new Date().toISOString() }) + "\n");
for (let w = 1; w <= WINDOWS; w++) {
  const ctx = await browser.newContext(VIEWPORTS[VP]);
  const page = await ctx.newPage();
  await page.addInitScript(INIT);
  if (ENGINE === "chromium") {
    const cdp = await ctx.newCDPSession(page);
    if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    if (NET === "fast3g") await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  }
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(6000);
  const r = await page.evaluate(() => ({ ...window.__cp, ticks: window.__cp.ticks.slice(0, 200) }));
  line({ k: "window", window: w, ...r });
  process.stderr.write(`w${w}: firstTrue=${r.firstTrue} boardReady=${r.boardReady} ticks=${r.ticks.length}\n`);
  await ctx.close();
}
line({ k: "end", loadavgEnd: loadavg() });
await browser.close();

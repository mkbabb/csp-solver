// RUN: cd <worktree>/web/frontend && node <C01>/instr/box-probe.mjs --engine webkit --port 4252 --windows 2 --out b.jsonl
// T9-W8 §8.2 cure C01 — DIAGNOSTIC ONLY (not an acceptance instrument).
// Answers one question the 8.1 lanes left open: WHEN does svg.hand-drawn-grid's CONTENT BOX
// move 1240 -> 1272 on WebKit, and what else is on the clock at that moment? It mounts a
// ResizeObserver on the grid svg (the very channel useLayoutBoxSize reads) and stamps every
// contentRect it delivers, beside fonts.ready and every toBlob's canvas width.
// Reads the built dist through a preview server; writes nothing to src.
import { writeFileSync, appendFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const req = createRequire(pathToFileURL(process.cwd() + "/"));
const { chromium, webkit } = req("playwright");
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const ENGINE = arg("engine", "webkit"), PORT = arg("port", "4252");
const WINDOWS = Number(arg("windows", "2")), OUT = arg("out", "box-probe.jsonl");
const VP = arg("vp", "desk"), CPU = Number(arg("cpu", "1")), NET = arg("net", "none");
const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
};
const INIT = () => {
  window.__bp = { boxes: [], blobs: [], fontsReady: null, mounted: null };
  const realToBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, t, q) {
    const t0 = performance.now(), w = this.width;
    return realToBlob.call(this, (b) => {
      window.__bp.blobs.push({ w, t0: +t0.toFixed(1), t1: +performance.now().toFixed(1), bytes: b ? b.size : null });
      cb(b);
    }, t, q);
  };
  try { document.fonts.ready.then(() => { window.__bp.fontsReady = +performance.now().toFixed(1); }); } catch {}
  const arm = () => {
    const el = document.querySelector("svg.hand-drawn-grid");
    if (!el) { requestAnimationFrame(arm); return; }
    window.__bp.mounted = +performance.now().toFixed(1);
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        window.__bp.boxes.push({ t: +performance.now().toFixed(1),
          w: +e.contentRect.width.toFixed(2), h: +e.contentRect.height.toFixed(2),
          rectW: +el.getBoundingClientRect().width.toFixed(2) });
      }
    });
    ro.observe(el);
  };
  requestAnimationFrame(arm);
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
  await page.waitForTimeout(8000);
  const r = await page.evaluate(() => window.__bp);
  line({ k: "window", window: w, ...r });
  process.stderr.write(`w${w}: mounted=${r.mounted} fontsReady=${r.fontsReady} boxes=${JSON.stringify(r.boxes)} blobW=${r.blobs.map((b) => b.w + "@" + b.t0).join(",")}\n`);
  await ctx.close();
}
line({ k: "end", loadavgEnd: loadavg() });
await browser.close();

// RUN: cd <worktree>/web/frontend && node <C02>/instr/pose-hash-toggle.mjs --engine chromium --cpu 1 --port 4252 --vp desk --windows 3 --out h.jsonl
//
// T9-W8 §8.2 cure C02 — THE π INSTRUMENT, C01's `pose-hash.mjs` with ONE thing added: after
// the settle it CLICKS THE THEME TOGGLE and waits again. That is the whole difference, and it
// is what makes the two arms comparable at all. In the BASE arm the other theme's four grid
// and four wordmark poses are encoded by that click; in the CURED arm they were encoded at
// idle, before it, and the click encodes nothing. Each surface's LAST round is therefore the
// other theme's stack in both arms — the round `pi-compare.mjs` already asserts equality of.
//
// C01's header follows, unchanged, because nothing else here is:
//
// T9-W8 §8.2 cure C01 — THE π INSTRUMENT. Derived from A1's `bake-census.mjs`: the same
// Blob/createObjectURL/drawImage/toBlob chain and the same surface classification off the pose
// SVG's own bytes, with one thing added and everything else dropped — a SHA-256 of every PNG
// the page encodes, taken in-page off the blob itself (`crypto.subtle`, a secure context on
// 127.0.0.1). Byte COUNT equality is not identity; a digest is.
//
// WHAT IT REPORTS. Per surface, the KEPT stack: the last N digests that surface encoded, where
// N is its pose count. That is the set the estate renders after settle, in pose order, so
// base-vs-cured equality of those lists IS "the stack the estate shows is byte-identical, pose
// for pose". The discarded round's digests are kept too (`all`), so a reader can see which
// round survived.
// Reads the built dist through a preview server; writes nothing to src.
import { writeFileSync, appendFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const req = createRequire(pathToFileURL(process.cwd() + "/"));
const { chromium, webkit } = req("playwright");
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const ENGINE = arg("engine", "chromium"), CPU = Number(arg("cpu", "1")), NET = arg("net", "none");
const CACHE = arg("cache", "cold"), VP = arg("vp", "desk"), PORT = arg("port", "4252");
const WINDOWS = Number(arg("windows", "3")), OUT = arg("out", "pose-hash.jsonl");
const SETTLE = Number(arg("settle", "8000"));
const TOGGLE_SETTLE = Number(arg("toggleSettle", "6000"));
const BASE = `http://127.0.0.1:${PORT}/`;
const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
};

const INIT = () => {
  window.__ph = { rows: [], taint: 0, boardReady: null };
  for (const t of ["blur", "visibilitychange"])
    window.addEventListener(t, () => (window.__ph.taint += 1));
  const classify = (s) => {
    if (typeof s !== "string" || s.indexOf("<svg") < 0) return null;
    if (s.indexOf("grain-static") >= 0) return "grid";
    if (s.indexOf("<text") >= 0) return "logo";
    if (s.indexOf("wobble-celestial") >= 0) return s.indexOf('r="48"') >= 0 ? "toggle-sun" : "toggle-moon";
    return "pose-unknown";
  };
  const urlSurface = new Map();
  const canvasSurface = new WeakMap();
  const RealBlob = window.Blob;
  window.Blob = function (parts, opts) {
    const b = new RealBlob(parts, opts);
    try {
      if (opts && String(opts.type).indexOf("svg") >= 0 && parts && parts.length) {
        const s = classify(parts[0]);
        if (s) b.__phSurface = s;
      }
    } catch {}
    return b;
  };
  window.Blob.prototype = RealBlob.prototype;
  const realCOU = URL.createObjectURL.bind(URL);
  URL.createObjectURL = (o) => {
    const u = realCOU(o);
    try { if (o && o.__phSurface) urlSurface.set(u, o.__phSurface); } catch {}
    return u;
  };
  const realDraw = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (img, ...rest) {
    try {
      const src = img && img.src;
      if (src && urlSurface.has(src)) canvasSurface.set(this.canvas, urlSurface.get(src));
    } catch {}
    return realDraw.call(this, img, ...rest);
  };
  const hex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  const realToBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, type, q) {
    const surf = canvasSurface.get(this) || "unknown";
    const w = this.width, h = this.height, t0 = performance.now();
    const wrapped = (blob) => {
      const t1 = performance.now();
      const row = { surface: surf, w, h, t0: +t0.toFixed(1), t1: +t1.toFixed(1),
        bytes: blob ? blob.size : null, sha256: null };
      window.__ph.rows.push(row);
      if (blob && window.crypto && window.crypto.subtle)
        blob.arrayBuffer()
          .then((ab) => window.crypto.subtle.digest("SHA-256", ab))
          .then((d) => { row.sha256 = hex(d); })
          .catch(() => {});
      cb(blob);
    };
    return realToBlob.call(this, wrapped, type, q);
  };
  const visible = (el) => {
    if (!el) return false;
    if (el.getClientRects().length === 0) return false;
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden";
  };
  const poll = () => {
    if (window.__ph.boardReady !== null) return;
    const bg = document.querySelector(".board-group");
    if (visible(bg)) {
      const cell = bg.querySelector('[class*="cell"]');
      if (cell) {
        const r = cell.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          requestAnimationFrame(() => { window.__ph.boardReady = +performance.now().toFixed(2); });
          return;
        }
      }
    }
    requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);
};

const line = (o) => appendFileSync(OUT, JSON.stringify(o) + "\n");
const loadavg = () => execSync("sysctl -n vm.loadavg").toString().trim();
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
writeFileSync(OUT, JSON.stringify({ k: "meta", engine: ENGINE,
  cpuThrottle: ENGINE === "chromium" ? CPU : "1 (webkit: CDP unavailable)",
  net: ENGINE === "chromium" ? NET : "unthrottled (webkit: CDP unavailable)",
  cache: CACHE, vp: VP, dpr: VIEWPORTS[VP].deviceScaleFactor, base: BASE,
  loadavgStart: loadavg(), ts: new Date().toISOString() }) + "\n");
for (let w = 1; w <= WINDOWS; w++) {
  const ctx = await browser.newContext(VIEWPORTS[VP]);
  const page = await ctx.newPage();
  await page.addInitScript(INIT);
  if (ENGINE === "chromium") {
    const cdp = await ctx.newCDPSession(page);
    if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: CACHE === "cold" });
    if (NET === "fast3g") await cdp.send("Network.emulateNetworkConditions", { offline: false,
      latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  }
  if (CACHE === "warm") {
    // WARM = THE SECOND NAVIGATION, cache enabled, same context (A1's rule). The first
    // navigation is the primer and its numbers are discarded; only the second is read.
    await page.goto(BASE, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(8000);
    await page.evaluate(() => { window.__ph.rows.length = 0; window.__ph.boardReady = null; });
  }
  await page.goto(BASE, { waitUntil: "load", timeout: 120000 });
  await page.waitForFunction(() => window.__ph && window.__ph.boardReady !== null, null, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(SETTLE);
  // THE FLIP. The base arm pays for the other theme here; the cured arm already has it.
  await page.evaluate(() => document.querySelector(".sun-moon-toggle").click());
  await page.waitForTimeout(TOGGLE_SETTLE);
  const r = await page.evaluate(() => window.__ph);
  // Rows are pushed at COMPLETION, and a round's four encodes complete interleaved with the
  // next round's — so rounds are separated by toBlob START time (t0), never by arrival order.
  // (Reading the halves off arrival order is what makes two identical rounds look unequal.)
  const bySurface = {};
  for (const row of r.rows) (bySurface[row.surface] ??= []).push(row);
  const surf = {};
  for (const [s, rows] of Object.entries(bySurface)) {
    rows.sort((a, b) => a.t0 - b.t0);
    surf[s] = { encodes: rows.length, boxes: [...new Set(rows.map((x) => x.w))],
      rows: rows.map((x) => ({ w: x.w, t0: x.t0, t1: x.t1, bytes: x.bytes, sha256: x.sha256 })) };
  }
  line({ k: "window", window: w, boardReady: r.boardReady, taint: r.taint,
    totalEncodes: r.rows.length, surf });
  process.stderr.write(`w${w}: boardReady=${r.boardReady} encodes=${r.rows.length} taint=${r.taint} ` +
    Object.entries(surf).map(([s, v]) => `${s}:${v.encodes}@${v.boxes.join("/")}`).join(" ") + "\n");
  await ctx.close();
}
line({ k: "end", loadavgEnd: loadavg() });
await browser.close();

// RUN: node c11-spike.mjs --engine chromium --cpu 4 --vp mobile --port 4252 --windows 5 --out raw/c11-c4x-mob.jsonl   (cwd: web/frontend of the w8-bake worktree; a preview server on --port must already be up)
//
// T9-W8 §8.2 cure C11 — THE SPIKE. Persist the baked stacks across loads, or refuse it.
//
// WHAT IT IS. The bake-pricing half is `attribution/A1/bake-census.mjs`'s in-page instrument,
// copied: the same Blob/createObjectURL/drawImage/toBlob/longtask/rAF/board-ready hooks, the
// same surface classification off the pose SVG's own bytes, the same board-ready definition.
// CHANGED from A1: (a) the fetch/decode/getContext/createImageBitmap/toDataURL hooks are
// dropped — this spike prices encodes, not freight; (b) a RESTORE harness is added, and it is
// the new thing.
//
// THE RESTORE HARNESS. Nav 1 (seed) lets the page bake normally, then reads every mounted
// `.boil-frame-bitmap` handle back into a Blob and writes the set to IndexedDB under its full
// capture identity. Nav 2 (restore) is the warm load: at document start — before the app's
// first module runs — the harness opens the store, `getAll`s the blobs, mints an object URL
// for each and decodes each into an `<img>`. Both paths are therefore priced INSIDE THE SAME
// PAGE LOAD, on the same clock, under the same throttle, competing for the same main thread:
// the app re-bakes (as it does today) while the harness restores the same sixteen poses.
// That contention inflates BOTH arms and, if anything, flatters the bake.
//
// It writes nothing to `src/`. The app is untouched; the harness rides beside it.
import { writeFileSync, appendFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const req = createRequire(pathToFileURL(process.cwd() + "/"));
const { chromium, webkit } = req("playwright");

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`);
  return i >= 0 ? argv[i + 1] : d;
};
const ENGINE = arg("engine", "chromium");
const CPU = Number(arg("cpu", "1"));
const VP = arg("vp", "mobile");
const PORT = arg("port", "4252");
const WINDOWS = Number(arg("windows", "5"));
const OUT = arg("out", "c11-spike.jsonl");
const STORE_MODE = arg("store", "idb-blob"); // idb-blob | idb-bytes | cache
const PERSISTENT = arg("persistent", "0") === "1"; // an on-disk profile: WebKit refuses Blob values without one
const SETTLE = Number(arg("settle", "6000"));
const TWAIT = Number(arg("twait", "5000"));
const BASE = `http://127.0.0.1:${PORT}/`;

const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  },
};

const INIT = (STORE_MODE) => {
  const ev = [];
  const push = (o) => {
    o.t = +performance.now().toFixed(2);
    ev.push(o);
  };
  window.__c11 = { ev, boardReady: null, supportsLongtask: false, longtasks: [], raf: [] };

  // ── A1's surface classification, verbatim ──
  const classify = (s) => {
    if (typeof s !== "string" || s.indexOf("<svg") < 0) return null;
    if (s.indexOf("grain-static") >= 0) return "grid";
    if (s.indexOf("<text") >= 0) return "logo";
    if (s.indexOf("wobble-celestial") >= 0)
      return s.indexOf('r="48"') >= 0 ? "toggle-sun" : "toggle-moon";
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
        if (s) {
          b.__surface = s;
          push({ k: "poseSvg", surface: s, svgBytes: String(parts[0]).length });
        }
      }
    } catch {}
    return b;
  };
  window.Blob.prototype = RealBlob.prototype;

  const realCOU = URL.createObjectURL.bind(URL);
  URL.createObjectURL = (o) => {
    const u = realCOU(o);
    try {
      if (o && o.__surface) urlSurface.set(u, o.__surface);
    } catch {}
    return u;
  };

  const realDraw = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (img, ...rest) {
    let surf = null;
    try {
      const src = img && img.src;
      if (src && urlSurface.has(src)) surf = urlSurface.get(src);
      if (surf) canvasSurface.set(this.canvas, surf);
    } catch {}
    const a = performance.now();
    const r = realDraw.call(this, img, ...rest);
    const d = performance.now() - a;
    if (surf)
      push({ k: "drawImage", surface: surf, syncMs: +d.toFixed(2), w: this.canvas.width, h: this.canvas.height });
    return r;
  };

  const realToBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, type, q) {
    const surf = canvasSurface.get(this) || "unknown";
    const w = this.width,
      h = this.height;
    const t0 = performance.now();
    push({ k: "toBlob:start", surface: surf, w, h });
    const wrapped = (blob) => {
      push({
        k: "toBlob:end",
        surface: surf,
        w,
        h,
        ms: +(performance.now() - t0).toFixed(2),
        bytes: blob ? blob.size : null,
      });
      cb(blob);
    };
    const r = realToBlob.call(this, wrapped, type, q);
    push({ k: "toBlob:sync", surface: surf, syncMs: +(performance.now() - t0).toFixed(2) });
    return r;
  };

  try {
    const sup = PerformanceObserver.supportedEntryTypes || [];
    window.__c11.supportsLongtask = sup.indexOf("longtask") >= 0;
    if (window.__c11.supportsLongtask)
      new PerformanceObserver((l) => {
        for (const e of l.getEntries())
          window.__c11.longtasks.push([+e.startTime.toFixed(1), +e.duration.toFixed(1)]);
      }).observe({ entryTypes: ["longtask"] });
  } catch {}

  // rAF-gap sampler — the only task proxy an engine without `longtask` offers.
  let last = performance.now();
  const tick = (now) => {
    const d = now - last;
    last = now;
    if (d > 33.4) window.__c11.raf.push([+now.toFixed(1), +d.toFixed(1)]);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  window.__c11.taint = 0;
  for (const t of ["blur", "visibilitychange"])
    window.addEventListener(t, () => (window.__c11.taint += 1));

  // ── A1's board-ready, verbatim ──
  const visible = (el) => {
    if (!el) return false;
    if (el.getClientRects().length === 0) return false;
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden";
  };
  const poll = () => {
    if (window.__c11.boardReady !== null) return;
    const bg = document.querySelector(".board-group");
    if (visible(bg)) {
      const cell = bg.querySelector('[class*="cell"]');
      if (cell) {
        const r = cell.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          requestAnimationFrame(() => {
            window.__c11.boardReady = +performance.now().toFixed(2);
            push({ k: "board-ready", html: document.documentElement.className });
          });
          return;
        }
      }
    }
    requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);

  // ── THE STORE ──
  const MODE = STORE_MODE;
  const DB = "c11-spike";
  const STORE = "poses";
  const CACHE_NAME = "c11-spike";
  window.__c11.idbOpen = () =>
    new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => {
        const db = r.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });

  // ── THE RESTORE, at document start on the warm load ──
  if (location.search.indexOf("c11=restore") >= 0) {
    const R = { t0: +performance.now().toFixed(2) };
    window.__c11.restore = R;
    (async () => {
      try {
        let rows;
        if (MODE === "cache") {
          R.cacheNames = await caches.keys();
          const c = await caches.open(CACHE_NAME);
          R.tOpen = +performance.now().toFixed(2);
          const keys = await c.keys();
          const resps = await Promise.all(keys.map((rq) => c.match(rq)));
          const blobs = await Promise.all(resps.map((rp) => (rp ? rp.blob() : null)));
          rows = keys.map((rq, i) => ({
            k: rq.url.slice(rq.url.indexOf("/c11/") + 5),
            blob: blobs[i],
          }));
        } else {
          const db = await window.__c11.idbOpen();
          R.tOpen = +performance.now().toFixed(2);
          rows = await new Promise((res, rej) => {
            const tx = db.transaction(STORE, "readonly");
            const q = tx.objectStore(STORE).getAll();
            q.onsuccess = () => res(q.result || []);
            q.onerror = () => rej(q.error);
          });
        }
        R.tRead = +performance.now().toFixed(2);
        R.count = rows.length;
        R.bytes = rows.reduce(
          (a, r) => a + (r.blob ? r.blob.size : r.buf ? r.buf.byteLength : 0),
          0,
        );
        R.keys = rows.map((r) => r.k);
        const mint0 = performance.now();
        const urls = rows.map((r) =>
          URL.createObjectURL(r.blob || new Blob([r.buf], { type: r.type || "image/png" })),
        );
        R.tMint = +performance.now().toFixed(2);
        R.mintSyncMs = +(performance.now() - mint0).toFixed(2);
        const imgs = urls.map((u) => {
          const im = new Image();
          im.src = u;
          return im;
        });
        await Promise.all(
          imgs.map((im) =>
            im.decode
              ? im.decode().catch(() => null)
              : new Promise((res) => {
                  im.onload = res;
                  im.onerror = res;
                }),
          ),
        );
        R.tDecode = +performance.now().toFixed(2);
        R.natural = imgs.map((im) => `${im.naturalWidth}x${im.naturalHeight}`);
        for (const u of urls) URL.revokeObjectURL(u);
        R.done = true;
      } catch (e) {
        R.error = String(e && e.message ? e.message : e);
      }
    })();
  }

  // ── THE SEED: harvest the mounted handles and write them ──
  window.__c11.seed = async (label) => {
    window.__c11.stage = "enter";
    try {
      return await window.__c11.seedInner(label);
    } catch (e) {
      return {
        label,
        error: String((e && (e.message || e.name)) || e),
        stage: window.__c11.stage,
        detail: window.__c11.detail || null,
      };
    }
  };
  window.__c11.seedInner = async (label) => {
    // THE FOUR BAKED SURFACES, each with its own markup: the grid's <image>, the wordmark's
    // <image>, and the two celestials' <img>.
    const els = Array.from(
      document.querySelectorAll(".boil-frame-bitmap, .logo-pose-bmp, img.rest-pose"),
    );
    const handles = els.map((el) => {
      const h = el.getAttribute("href") || el.getAttribute("xlink:href") || el.src || "";
      const cls = el.getAttribute("class") || "";
      const owner = cls.indexOf("boil-frame-bitmap") >= 0
        ? "grid"
        : cls.indexOf("logo-pose-bmp") >= 0
          ? "logo"
          : el.closest(".rest-sun")
            ? "toggle-sun"
            : el.closest(".rest-moon")
              ? "toggle-moon"
              : "unknown";
      return { h, owner };
    });
    const t0 = performance.now();
    const rows = [];
    const seen = Object.create(null);
    window.__c11.stage = "fetch";
    for (let i = 0; i < handles.length; i++) {
      const { h, owner } = handles[i];
      if (!h || h.indexOf("blob:") !== 0) continue;
      const resp = await fetch(h);
      const type = resp.headers.get("content-type") || "image/png";
      const n = (seen[owner] = (seen[owner] || 0) + 1) - 1;
      const k = `${label}-${owner}-${n}-dpr${window.devicePixelRatio}`;
      if (MODE === "idb-bytes") {
        const buf = await resp.arrayBuffer();
        rows.push({ k, buf, bytes: buf.byteLength, type, owner });
      } else {
        const blob = await resp.blob();
        rows.push({ k, blob, bytes: blob.size, type, owner });
      }
    }
    const tFetched = performance.now();
    window.__c11.stage = "open";
    const tw0 = performance.now();
    if (MODE === "cache") {
      const c = await caches.open(CACHE_NAME);
      window.__c11.stage = "write";
      await Promise.all(
        rows.map((r) =>
          c.put(
            new Request(location.origin + "/c11/" + r.k),
            new Response(r.blob, { headers: { "content-type": r.type || "image/png" } }),
          ),
        ),
      );
    } else {
      const db = await window.__c11.idbOpen();
      window.__c11.stage = "write";
      await new Promise((res, rej) => {
        const tx = db.transaction("poses", "readwrite");
        const st = tx.objectStore("poses");
        for (const r of rows) {
          const rq = st.put(
            MODE === "idb-bytes"
              ? { k: r.k, buf: r.buf, type: r.type, bytes: r.bytes }
              : { k: r.k, blob: r.blob, type: r.type, bytes: r.bytes },
            r.k,
          );
          rq.onerror = () => {
            window.__c11.detail =
              "put " + r.k + ": " + String(rq.error && rq.error.name + " " + rq.error.message);
          };
        }
        tx.oncomplete = () => res();
        tx.onabort = () => rej(new Error("tx abort: " + String(tx.error && tx.error.name)));
        tx.onerror = () => rej(new Error("tx error: " + String(tx.error && tx.error.name)));
      });
    }
    const tw1 = performance.now();
    window.__c11.stage = "estimate";
    let est = null;
    try {
      if (MODE === "cache") {
        const c2 = await caches.open(CACHE_NAME);
        window.__c11.seedVerify = {
          names: await caches.keys(),
          entries: (await c2.keys()).length,
        };
      }
    } catch (e) {
      window.__c11.seedVerify = { error: String(e && e.name) };
    }
    try {
      if (navigator.storage && navigator.storage.estimate) est = await navigator.storage.estimate();
    } catch {}
    let persisted = null;
    try {
      if (navigator.storage && navigator.storage.persisted) persisted = await navigator.storage.persisted();
    } catch {}
    return {
      label,
      mounted: els.length,
      stored: rows.length,
      bytes: rows.reduce((a, r) => a + r.bytes, 0),
      perRow: rows.map((r) => ({ k: r.k, bytes: r.bytes, type: r.type })),
      fetchMs: +(tFetched - t0).toFixed(2),
      writeMs: +(tw1 - tw0).toFixed(2),
      estimate: est ? { usage: est.usage, quota: est.quota } : null,
      verify: window.__c11.seedVerify || null,
      persisted,
      theme: document.documentElement.className,
    };
  };
};

const line = (o) => appendFileSync(OUT, JSON.stringify(o) + "\n");
const loadavg = () => execSync("sysctl -n vm.loadavg").toString().trim();

const clickToggle = async (page) => {
  const btn = page.locator(
    'button[aria-label*="ode" i], button[class*="toggle"], .dark-mode-toggle button, button:has(.toggle-rest)',
  );
  if (!(await btn.count())) return false;
  await btn.first().click({ force: true });
  return true;
};

async function once(browser, w) {
  const ctx = PERSISTENT
    ? await (ENGINE === "webkit" ? webkit : chromium).launchPersistentContext(
        mkdtempSync(join(tmpdir(), "c11-")),
        VIEWPORTS[VP],
      )
    : await browser.newContext(VIEWPORTS[VP]);
  const page = await ctx.newPage();
  await page.addInitScript(INIT, STORE_MODE);
  if (ENGINE === "chromium") {
    const cdp = await ctx.newCDPSession(page);
    if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: false });
  }

  // ── NAV 1: seed ──
  await page.goto(BASE, { waitUntil: "load", timeout: 120000 });
  await page
    .waitForFunction(() => window.__c11 && window.__c11.boardReady !== null, null, { timeout: 60000 })
    .catch(() => {});
  await page.waitForTimeout(SETTLE);
  const seedLight = await page.evaluate(() => window.__c11.seed("themeA"));
  await clickToggle(page);
  await page.waitForTimeout(TWAIT);
  const seedDark = await page.evaluate(() => window.__c11.seed("themeB"));

  // ── NAV 2: the warm load; restore races the re-bake ──
  await page.goto(BASE + "?c11=restore", { waitUntil: "load", timeout: 120000 });
  await page
    .waitForFunction(() => window.__c11 && window.__c11.boardReady !== null, null, { timeout: 60000 })
    .catch(() => {});
  await page.waitForTimeout(SETTLE);
  const warm = await page.evaluate(() => ({
    boardReady: window.__c11.boardReady,
    supportsLongtask: window.__c11.supportsLongtask,
    longtasks: window.__c11.longtasks,
    raf: window.__c11.raf,
    taint: window.__c11.taint,
    restore: window.__c11.restore || null,
    ev: window.__c11.ev,
  }));
  await ctx.close();
  return { window: w, seedLight, seedDark, warm };
}

const browser = PERSISTENT ? null : await (ENGINE === "webkit" ? webkit : chromium).launch();
writeFileSync(
  OUT,
  JSON.stringify({
    k: "meta",
    engine: ENGINE,
    store: STORE_MODE,
    profile: PERSISTENT ? "on-disk (launchPersistentContext)" : "ephemeral",
    cpuThrottle: ENGINE === "chromium" ? CPU : "1 (webkit: CDP unavailable)",
    net: "unthrottled",
    cache: "warm (nav 2 in the same context)",
    vp: VP,
    dpr: VIEWPORTS[VP].deviceScaleFactor,
    base: BASE,
    loadavgStart: loadavg(),
    ts: new Date().toISOString(),
  }) + "\n",
);
for (let w = 1; w <= WINDOWS; w++) {
  const r = await once(browser, w);
  line({ k: "window", ...r });
  const R = r.warm.restore || {};
  process.stderr.write(
    `window ${w}: restore ${R.count} rows ${R.bytes} B open=${R.tOpen} read=${R.tRead} decode=${R.tDecode} err=${R.error || "-"}\n`,
  );
}
line({ k: "end", loadavgEnd: loadavg() });
if (browser) await browser.close();

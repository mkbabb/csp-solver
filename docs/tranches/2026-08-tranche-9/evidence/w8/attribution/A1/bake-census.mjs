// RUN: node bake-census.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp desk --port 4250 --windows 3 --out r.jsonl   (cwd: web/frontend; needs `npx vite preview --outDir dist --port 4250 --strictPort --host 127.0.0.1` already up)
//
// T9-W8 §8.1 lane A1 — THE BAKE PIPELINE AT FIRST PAINT.
// Attribution only: reads the built dist through a preview server, writes nothing to src.
//
// WHAT IT SEES. rasterizePoseToBlob (pencil-boil 0.12) builds a self-contained pose SVG,
// wraps it in a Blob(type image/svg+xml), mints an object URL, decodes it into an <img>,
// drawImage()s it onto a canvas and toBlob()s the canvas to PNG. So the chain is walked
// at four seams, and the SURFACE NAME is read off the pose SVG's own bytes (prod minifies
// component names away; the SVG does not):
//   Blob ctor        -> classify the pose SVG  (grain-static => grid · <text => logo ·
//                       wobble-celestial + sun/moon palette => toggle-sun / toggle-moon)
//   createObjectURL  -> url -> surface map
//   drawImage        -> canvas -> surface map (the img's src is that url)
//   toBlob           -> t_start / t_end / PNG byte size, per pose, per surface
// Plus: document.fonts.ready resolution, every fetch, createImageBitmap, toDataURL,
// getContext, and a PerformanceObserver over longtask + paint + measure.
//
// BOARD-READY, the wave's one definition: `.board-group` VISIBLE (it is v-show'n; both
// control-panel twins are always mounted) AND the first `.cell`-class element's
// getBoundingClientRect is non-zero AND one rAF has fired after that. performance.now(),
// i.e. relative to navigationStart.

// ESM resolves imports against THIS FILE, which lives under docs/ where no node_modules sits;
// playwright is resolved against the cwd (web/frontend) instead, so the script stays banked
// beside its readings rather than in the app tree.
import { writeFileSync, appendFileSync } from "node:fs";
import { execSync, } from "node:child_process";
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
const NET = arg("net", "none"); // fast3g | none
const CACHE = arg("cache", "cold"); // cold | warm
const VP = arg("vp", "desk"); // desk | mobile
const PORT = arg("port", "4250");
const WINDOWS = Number(arg("windows", "3"));
const OUT = arg("out", "bake-census.jsonl");
const TOGGLE = arg("toggle", "1") === "1";
const SETTLE = Number(arg("settle", "6000")); // quiet window after board-ready for bakes to land
const TWAIT = Number(arg("twait", "5000")); // settle window after each theme click
const TRACE = arg("trace", ""); // chromium only: write a devtools trace to this path
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

// ── the in-page instrument ────────────────────────────────────────────────────────────
const INIT = () => {
  const T0 = performance.now();
  const ev = [];
  const push = (o) => {
    o.t = +performance.now().toFixed(2);
    ev.push(o);
    try {
      performance.mark(`A1:${o.k}:${o.surface || ""}`);
    } catch {}
  };
  window.__a1 = { ev, T0, boardReady: null, supportsLongtask: false };

  // surface classification, off the pose SVG's own bytes
  const classify = (s) => {
    if (typeof s !== "string" || s.indexOf("<svg") < 0) return null;
    if (s.indexOf("grain-static") >= 0) return "grid";
    if (s.indexOf("<text") >= 0) return "logo";
    if (s.indexOf("wobble-celestial") >= 0) {
      // The sun alone carries its core disc `<circle cx="100" cy="100" r="48">`; the moon
      // carries MOON_BODY_D. (`rotate(` is NOT a discriminator — both poses' twinkles use it.)
      return s.indexOf('r="48"') >= 0 ? "toggle-sun" : "toggle-moon";
    }
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
          b.__a1surface = s;
          b.__a1svgBytes = String(parts[0]).length;
          push({ k: "poseSvg", surface: s, svgBytes: b.__a1svgBytes });
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
      if (o && o.__a1surface) urlSurface.set(u, o.__a1surface);
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
      push({
        k: "drawImage",
        surface: surf,
        syncMs: +d.toFixed(2),
        w: this.canvas.width,
        h: this.canvas.height,
      });
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
      const t1 = performance.now();
      push({
        k: "toBlob:end",
        surface: surf,
        w,
        h,
        ms: +(t1 - t0).toFixed(2),
        bytes: blob ? blob.size : null,
      });
      cb(blob);
    };
    const r = realToBlob.call(this, wrapped, type, q);
    push({ k: "toBlob:sync", surface: surf, syncMs: +(performance.now() - t0).toFixed(2) });
    return r;
  };

  const realToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function (...a) {
    const t0 = performance.now();
    const r = realToDataURL.apply(this, a);
    push({
      k: "toDataURL",
      surface: canvasSurface.get(this) || "unknown",
      w: this.width,
      h: this.height,
      syncMs: +(performance.now() - t0).toFixed(2),
      bytes: r.length,
    });
    return r;
  };

  const realGetCtx = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (...a) {
    push({ k: "getContext", kind: String(a[0]), w: this.width, h: this.height });
    return realGetCtx.apply(this, a);
  };

  if (typeof createImageBitmap === "function") {
    const realCIB = window.createImageBitmap;
    window.createImageBitmap = function (...a) {
      const t0 = performance.now();
      push({ k: "createImageBitmap:start" });
      return realCIB.apply(window, a).then((b) => {
        push({ k: "createImageBitmap:end", ms: +(performance.now() - t0).toFixed(2) });
        return b;
      });
    };
  }

  const realDecode = HTMLImageElement.prototype.decode;
  if (realDecode)
    HTMLImageElement.prototype.decode = function () {
      const t0 = performance.now();
      const surf = urlSurface.get(this.src) || null;
      return realDecode.call(this).then(
        (v) => {
          push({ k: "imgDecode", surface: surf, ms: +(performance.now() - t0).toFixed(2) });
          return v;
        },
        (e) => {
          push({ k: "imgDecode:reject", surface: surf });
          throw e;
        },
      );
    };

  const realFetch = window.fetch;
  window.fetch = function (input, init) {
    const u = typeof input === "string" ? input : input && input.url;
    const t0 = performance.now();
    push({ k: "fetch:start", url: String(u).slice(-60) });
    return realFetch.call(window, input, init).then((r) => {
      push({
        k: "fetch:end",
        url: String(u).slice(-60),
        ms: +(performance.now() - t0).toFixed(2),
        status: r.status,
      });
      return r;
    });
  };

  try {
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(() => push({ k: "fonts.ready" }));
  } catch {}

  try {
    const sup = PerformanceObserver.supportedEntryTypes || [];
    window.__a1.supportsLongtask = sup.indexOf("longtask") >= 0;
    const types = ["paint", "measure"].concat(
      window.__a1.supportsLongtask ? ["longtask"] : [],
    );
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        ev.push({
          k: "perf:" + e.entryType,
          name: e.name,
          t: +e.startTime.toFixed(2),
          dur: +e.duration.toFixed(2),
        });
    }).observe({ entryTypes: types });
  } catch {}

  // rAF-gap sampler — the only task proxy an engine without `longtask` can offer.
  window.__a1.raf = [];
  let last = performance.now();
  const tick = (now) => {
    const d = now - last;
    last = now;
    if (d > 33.4) window.__a1.raf.push([+now.toFixed(1), +d.toFixed(1)]);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // taint watch
  window.__a1.taint = 0;
  for (const t of ["blur", "visibilitychange"])
    window.addEventListener(t, () => (window.__a1.taint += 1));

  // BOARD-READY — the wave's one definition.
  const visible = (el) => {
    if (!el) return false;
    if (el.getClientRects().length === 0) return false;
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden";
  };
  const poll = () => {
    if (window.__a1.boardReady !== null) return;
    const bg = document.querySelector(".board-group");
    if (visible(bg)) {
      const cell = bg.querySelector('[class*="cell"]');
      if (cell) {
        const r = cell.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          requestAnimationFrame(() => {
            window.__a1.boardReady = +performance.now().toFixed(2);
            push({
              k: "board-ready",
              cellClass: cell.getAttribute("class"),
              cellW: +r.width.toFixed(1),
              html: document.documentElement.className,
            });
          });
          return;
        }
      }
    }
    requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);
};

// ── driver ────────────────────────────────────────────────────────────────────────────
const line = (o) => appendFileSync(OUT, JSON.stringify(o) + "\n");

const loadavg = () => execSync("sysctl -n vm.loadavg").toString().trim();

async function once(browser, w) {
  const ctx = await browser.newContext(VIEWPORTS[VP]);
  const page = await ctx.newPage();
  await page.addInitScript(INIT);
  let cdp = null;
  if (ENGINE === "chromium") {
    cdp = await ctx.newCDPSession(page);
    if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: CACHE === "cold" });
    if (NET === "fast3g")
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
      });
  }
  const t0 = Date.now();
  if (CACHE === "warm") {
    // WARM = THE SECOND NAVIGATION, cache enabled, same context. The first navigation is the
    // primer and its numbers are discarded; only the second is read.
    await page.goto(BASE, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(8000);
  }
  if (TRACE && cdp)
    await cdp.send("Tracing.start", {
      traceConfig: {
        includedCategories: [
          "devtools.timeline",
          "disabled-by-default-devtools.timeline",
          "blink.user_timing",
          "v8.execute",
        ],
      },
      transferMode: "ReturnAsStream",
      streamFormat: "json",
    });
  await page.goto(BASE, { waitUntil: "load", timeout: 120000 });
  await page
    .waitForFunction(() => window.__a1 && window.__a1.boardReady !== null, null, {
      timeout: 60000,
    })
    .catch(() => {});
  await page.waitForTimeout(SETTLE);
  if (TRACE && cdp) {
    const done = new Promise((res) => cdp.once("Tracing.tracingComplete", res));
    await cdp.send("Tracing.end");
    const { stream } = await done;
    let buf = "";
    for (;;) {
      const c = await cdp.send("IO.read", { handle: stream, size: 1 << 20 });
      buf += c.data;
      if (c.eof) break;
    }
    await cdp.send("IO.close", { handle: stream });
    writeFileSync(TRACE, buf);
  }
  const cold = await page.evaluate(() => ({
    boardReady: window.__a1.boardReady,
    supportsLongtask: window.__a1.supportsLongtask,
    taint: window.__a1.taint,
    raf: window.__a1.raf.slice(0, 40),
    ev: window.__a1.ev,
    nav: performance.getEntriesByType("navigation").map((n) => ({
      domContentLoaded: +n.domContentLoadedEventEnd.toFixed(2),
      loadEnd: +n.loadEventEnd.toFixed(2),
      responseEnd: +n.responseEnd.toFixed(2),
    }))[0],
  }));

  const toggles = [];
  if (TOGGLE) {
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => {
        window.__a1.mark = window.__a1.ev.length;
        window.__a1.tClick = performance.now();
      });
      const btn = page.locator(
        'button[aria-label*="ode" i], button[class*="toggle"], .dark-mode-toggle button, button:has(.toggle-rest)',
      );
      const target = (await btn.count()) ? btn.first() : null;
      if (!target) break;
      await target.click({ force: true });
      await page.waitForTimeout(TWAIT);
      toggles.push(
        await page.evaluate(() => ({
          theme: document.documentElement.className,
          tClick: +window.__a1.tClick.toFixed(2),
          ev: window.__a1.ev.slice(window.__a1.mark),
        })),
      );
    }
  }
  await ctx.close();
  return { cold, toggles, wallMs: Date.now() - t0, window: w };
}

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const meta = {
  k: "meta",
  engine: ENGINE,
  cpuThrottle: ENGINE === "chromium" ? CPU : "1 (webkit: CDP unavailable)",
  net: ENGINE === "chromium" ? NET : "unthrottled (webkit: CDP unavailable)",
  cache: CACHE,
  vp: VP,
  base: BASE,
  loadavgStart: loadavg(),
  ts: new Date().toISOString(),
};
writeFileSync(OUT, JSON.stringify(meta) + "\n");
for (let w = 1; w <= WINDOWS; w++) {
  const r = await once(browser, w);
  line({ k: "window", ...r });
  process.stderr.write(
    `window ${w}: boardReady=${r.cold.boardReady} taint=${r.cold.taint}\n`,
  );
}
line({ k: "end", loadavgEnd: loadavg() });
await browser.close();

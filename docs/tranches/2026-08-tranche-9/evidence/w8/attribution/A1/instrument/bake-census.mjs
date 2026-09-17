#!/usr/bin/env node
// RUN: cd web/frontend && node <this> --engine chromium --cpu 4 --net fast3g --cache cold --viewport desk --windows 3 --out <file.jsonl>
// T9-W8 §8.1 lane A1 — the bake pipeline at first paint. Instruments every bake on the cold
// path (Blob(svg) → Image decode → drawImage → toBlob), board-ready, longtask/paint, and the
// first/second dark-toggle re-bake census. Serves an ALREADY-BUILT dist; never builds.
import { chromium, webkit } from "playwright";
import { writeFileSync, appendFileSync } from "node:fs";

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`);
  return i >= 0 ? argv[i + 1] : d;
};
const ENGINE = arg("engine", "chromium");
const CPU = Number(arg("cpu", "1"));
const NET = arg("net", "none"); // none | fast3g
const CACHE = arg("cache", "cold"); // cold | warm
const VIEWPORT = arg("viewport", "desk"); // desk | mobile
const WINDOWS = Number(arg("windows", "3"));
const PORT = arg("port", "4250");
const OUT = arg("out", "/dev/stdout");
const TRACE = argv.includes("--trace");
const URLBASE = `http://127.0.0.1:${PORT}/`;

const VP =
  VIEWPORT === "mobile"
    ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 3 }
    : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 };

// ── the in-page probe ────────────────────────────────────────────────────────────────
const PROBE = () => {
  const W = window;
  W.__bake = { events: [], longtasks: [], paints: [], fetches: [], marks: [], boardReady: null };
  const now = () => performance.now();
  const push = (e) => W.__bake.events.push(e);

  // Surface classification off the pose SVG string itself (the one place every bake passes).
  const classify = (s) => {
    if (s.includes("FrauncesBake")) return "logo";
    if (s.includes("grain-static")) return "grid";
    if (s.includes("wobble-celestial")) {
      // the sun pose carries its 48r core circle + the spiral; the moon does not.
      return /r="48"/.test(s) ? "toggleSun" : "toggleMoon";
    }
    return "unknown";
  };
  const boxOf = (s) => {
    const m = /^<svg[^>]*\swidth="(\d+)"[^>]*\sheight="(\d+)"/.exec(s);
    return m ? `${m[1]}x${m[2]}` : "?";
  };

  // key: device box "WxH" → surface, so toBlob/drawImage can name themselves.
  const boxSurface = new Map();

  const NativeBlob = W.Blob;
  W.Blob = function (parts, opts) {
    try {
      if (parts && typeof parts[0] === "string" && parts[0].slice(0, 4) === "<svg") {
        const s = parts[0];
        const surface = classify(s);
        const box = boxOf(s);
        boxSurface.set(box, surface);
        push({ k: "poseSvg", surface, box, t: now(), svgBytes: s.length });
        performance.mark(`bake:svg:${surface}`);
      }
    } catch {}
    return new NativeBlob(parts, opts);
  };
  W.Blob.prototype = NativeBlob.prototype;

  const surfaceForCanvas = (c) => boxSurface.get(`${c.width}x${c.height}`) ?? `?${c.width}x${c.height}`;

  const rawDraw = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (...a) {
    const t0 = now();
    const r = rawDraw.apply(this, a);
    const t1 = now();
    // only the bake-sized draws matter; the CH-62 probe draws into a 24×24
    if (this.canvas && this.canvas.width > 32)
      push({ k: "drawImage", surface: surfaceForCanvas(this.canvas), t: t0, ms: t1 - t0 });
    return r;
  };

  const rawToBlob = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, type, q) {
    const surface = surfaceForCanvas(this);
    const t0 = now();
    performance.mark(`bake:encode:start:${surface}`);
    return rawToBlob.call(
      this,
      (blob) => {
        const t1 = now();
        push({
          k: "toBlob",
          surface,
          t: t0,
          tEnd: t1,
          ms: t1 - t0,
          blobBytes: blob ? blob.size : null,
          box: `${this.width}x${this.height}`,
        });
        performance.mark(`bake:encode:end:${surface}`);
        cb(blob);
      },
      type,
      q,
    );
  };

  const rawToDataURL = HTMLCanvasElement.prototype.toDataURL;
  HTMLCanvasElement.prototype.toDataURL = function (...a) {
    const t0 = now();
    const r = rawToDataURL.apply(this, a);
    push({ k: "toDataURL", surface: surfaceForCanvas(this), t: t0, ms: now() - t0, bytes: r.length });
    return r;
  };

  const rawGetCtx = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (...a) {
    const t0 = now();
    const r = rawGetCtx.apply(this, a);
    push({ k: "getContext", kind: a[0], w: this.width, h: this.height, t: t0, ms: now() - t0 });
    return r;
  };

  if (typeof createImageBitmap === "function") {
    const raw = W.createImageBitmap;
    W.createImageBitmap = function (...a) {
      const t0 = now();
      return raw.apply(W, a).then((b) => {
        push({ k: "createImageBitmap", t: t0, ms: now() - t0, w: b.width, h: b.height });
        return b;
      });
    };
  }

  // Image decode + blob-svg load: the SVG→raster step inside capturePoseCanvas.
  const rawDecode = Image.prototype.decode;
  if (rawDecode)
    Image.prototype.decode = function (...a) {
      const t0 = now();
      return rawDecode.apply(this, a).then(
        (v) => {
          push({ k: "imgDecode", t: t0, ms: now() - t0, src: String(this.src).slice(0, 12) });
          return v;
        },
        (e) => {
          push({ k: "imgDecodeReject", t: t0, ms: now() - t0 });
          throw e;
        },
      );
    };

  const rawFetch = W.fetch;
  W.fetch = function (...a) {
    const url = typeof a[0] === "string" ? a[0] : a[0] && a[0].url;
    const t0 = now();
    return rawFetch.apply(W, a).then((res) => {
      W.__bake.fetches.push({ url: String(url).slice(-64), t: t0, ms: now() - t0, status: res.status });
      return res;
    });
  };

  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => {
      W.__bake.fontsReady = now();
      performance.mark("fonts.ready");
    });

  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) W.__bake.longtasks.push({ t: e.startTime, ms: e.duration });
    }).observe({ type: "longtask", buffered: true });
    W.__bake.longtaskSupported = true;
  } catch {
    W.__bake.longtaskSupported = false;
  }
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) W.__bake.paints.push({ name: e.name, t: e.startTime });
    }).observe({ type: "paint", buffered: true });
  } catch {}
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) W.__bake.marks.push({ name: e.name, t: e.startTime });
    }).observe({ type: "mark", buffered: true });
  } catch {}

  // rAF-gap census — the engine-portable half (WebKit has no longtask).
  W.__bake.rafGaps = [];
  let last = now();
  const tick = () => {
    const t = now();
    const d = t - last;
    last = t;
    if (d > 33.4) W.__bake.rafGaps.push({ t, ms: d });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // BOARD-READY, the one definition: .board-group VISIBLE + first .cell rect non-zero +
  // one rAF after that.
  const visible = (el) => {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const poll = () => {
    if (W.__bake.boardReady !== null) return;
    const bg = document.querySelector(".board-group");
    const cell = document.querySelector(".cell, [class*='cell']");
    if (visible(bg) && cell) {
      const r = cell.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        requestAnimationFrame(() => {
          W.__bake.boardReady = now();
          performance.mark("board-ready");
        });
        return;
      }
    }
    requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);
};

// ── driver ───────────────────────────────────────────────────────────────────────────
const line = (o) => appendFileSync(OUT, JSON.stringify(o) + "\n");

async function one(browser, win) {
  const ctx = await browser.newContext({ ...VP });
  const page = await ctx.newPage();
  await page.addInitScript(PROBE);
  let cdp = null;
  if (ENGINE === "chromium") {
    cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: CACHE === "cold" });
    if (CACHE === "cold") await cdp.send("Network.clearBrowserCache");
    if (NET === "fast3g")
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
      });
    if (TRACE)
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
      });
  }

  const t0 = Date.now();
  await page.goto(URLBASE, { waitUntil: "load" });
  // WARM arm: a second navigation with the cache on, measured.
  if (CACHE === "warm") {
    if (cdp) await cdp.send("Network.setCacheDisabled", { cacheDisabled: false });
    await page.waitForTimeout(3000);
    await page.evaluate(() => {
      window.__bake = null;
    });
    await page.addInitScript(PROBE);
    await page.goto(URLBASE, { waitUntil: "load" });
  }
  await page.waitForFunction(() => window.__bake && window.__bake.boardReady !== null, null, {
    timeout: 30000,
  }).catch(() => {});
  await page.waitForTimeout(4000); // let every bake settle

  const cold = await page.evaluate(() => ({
    ...window.__bake,
    nav: performance.getEntriesByType("navigation")[0]
      ? {
          domContentLoaded: performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd,
          load: performance.getEntriesByType("navigation")[0].loadEventEnd,
          responseEnd: performance.getEntriesByType("navigation")[0].responseEnd,
        }
      : null,
    dpr: window.devicePixelRatio,
  }));

  // ── the toggle census: bakes between click and settle, first then second ──
  const toggles = [];
  for (const nth of [1, 2]) {
    await page.evaluate(() => {
      window.__tg = { from: window.__bake.events.length, lt: window.__bake.longtasks.length, t: performance.now() };
    });
    const btn = page.locator("button.theme-toggle, .corner-right button").first();
    await btn.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const r = await page.evaluate(() => {
      const b = window.__bake;
      const ev = b.events.slice(window.__tg.from);
      const lt = b.longtasks.slice(window.__tg.lt);
      return {
        t: window.__tg.t,
        theme: document.documentElement.className,
        events: ev,
        longtasks: lt,
        rafGaps: b.rafGaps.filter((g) => g.t >= window.__tg.t),
      };
    });
    toggles.push({ nth, ...r });
  }

  let trace = null;
  if (TRACE && cdp) {
    const done = new Promise((res) => cdp.on("Tracing.tracingComplete", res));
    await cdp.send("Tracing.end");
    const { stream } = await done;
    let chunks = "";
    for (;;) {
      const r = await cdp.send("IO.read", { handle: stream, size: 2 << 20 });
      chunks += r.data;
      if (r.eof) break;
    }
    await cdp.send("IO.close", { handle: stream });
    trace = chunks;
  }

  await ctx.close();
  return { win, wallMs: Date.now() - t0, cold, toggles, trace };
}

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
writeFileSync(OUT, "");
const loadStart = (await import("node:child_process")).execSync("sysctl -n vm.loadavg").toString().trim();
line({ meta: { engine: ENGINE, cpu: CPU, net: NET, cache: CACHE, viewport: VIEWPORT, url: URLBASE, loadStart, when: new Date().toISOString() } });
for (let w = 1; w <= WINDOWS; w++) {
  const r = await one(browser, w);
  if (r.trace) {
    writeFileSync(OUT.replace(/\.jsonl$/, "") + `.trace.w${w}.json`, r.trace);
    delete r.trace;
  }
  line(r);
  process.stderr.write(`window ${w}: boardReady=${r.cold.boardReady?.toFixed(1)} bakes=${r.cold.events.filter((e) => e.k === "toBlob").length}\n`);
}
const loadEnd = (await import("node:child_process")).execSync("sysctl -n vm.loadavg").toString().trim();
line({ meta: { loadEnd } });
await browser.close();

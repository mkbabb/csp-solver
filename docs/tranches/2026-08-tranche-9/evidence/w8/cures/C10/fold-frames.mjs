#!/usr/bin/env node
// RUN: cd web/frontend && node <thisfile> --engine chromium --throttle 4 --viewport desk --cycles 3 --port 4256 --out <out.jsonl>
// T9-W8 §8.1 lane A7 — the gallery fold (playing->gallery) and unfold (gallery->playing),
// per-frame rAF census + longtask (chromium only) + bake count + animation census.
// Attribution only: it reads a FIXED dist over an already-running preview server. It never builds.
import { writeFileSync, appendFileSync } from "node:fs";
import { createRequire } from "node:module";
// The script banks under docs/, so playwright resolves from web/frontend (run from there).
const { chromium, webkit } = createRequire(process.cwd() + "/package.json")("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const ENGINE = arg("engine", "chromium");
const THROTTLE = Number(arg("throttle", "1"));
const VIEW = arg("viewport", "desk");
const CYCLES = Number(arg("cycles", "3"));
const PORT = arg("port", "4256");
const OUT = arg("out", "/dev/stdout");
const EXIT = arg("exit", "enter"); // enter = select (unfold+seam-less), escape = cancel
const NET = arg("net", "none"); // none | fast3g
const CACHE = arg("cache", "warm"); // cold | warm
// Census sample offsets (ms from trigger): beat 0, the fold's head/middle/settle, the deal tail.
const CENSUS_AT = [16, 120, 210, 300, 450, 600, 740, 900, 1150];

const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  },
};

// The in-page instrument. Installed before any app script runs.
const PROBE = () => {
  const W = (window.__A7 = {
    frames: [], // {t, dt}
    longtasks: [], // {t, dur}
    bakes: [], // {t} — a pencil-boil raster bake: SVG blob -> Image -> ctx.drawImage
    taint: [], // blur/visibilitychange
    marks: [],
    longtaskSupported: false,
  });
  let last = performance.now();
  const tick = (now) => {
    W.frames.push({ t: +now.toFixed(2), dt: +(now - last).toFixed(2) });
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame((n) => {
    last = n;
    requestAnimationFrame(tick);
  });
  try {
    const types = PerformanceObserver.supportedEntryTypes || [];
    if (types.includes("longtask")) {
      W.longtaskSupported = true;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries())
          W.longtasks.push({ t: +e.startTime.toFixed(2), dur: +e.duration.toFixed(2) });
      }).observe({ entryTypes: ["longtask"] });
    }
  } catch {
    /* engine without longtask — reported NOT MEASURED */
  }
  for (const ev of ["blur", "visibilitychange"])
    window.addEventListener(ev, () => W.taint.push({ ev, t: performance.now() }));
  // THE GRAMMAR CENSUS (W7 §13's input). Sampling `document.getAnimations()` on a timeline
  // across the whole choreography is what says WHICH element animates WHICH property WHEN —
  // a single trigger-frame sample sees only beat 0 (the entry sequences its beats).
  W.census = [];
  W.startCensus = (offsets) => {
    W.census = [];
    const t0 = performance.now();
    for (const off of offsets)
      setTimeout(() => {
        const by = {};
        for (const a of document.getAnimations()) {
          const e = a.effect && a.effect.target;
          const cls = e
            ? ((e.getAttribute && e.getAttribute("class")) || e.tagName || "?")
                .toString()
                .split(" ")[0]
            : "?";
          const name = a.animationName || a.transitionProperty || "WAAPI";
          const tim = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : {};
          const k = `${name}@${cls}`;
          by[k] = by[k] || { n: 0, durMs: Math.round(tim.duration || 0), ease: "" };
          by[k].n++;
          try {
            by[k].ease = (a.effect.getTiming && a.effect.getTiming().easing) || "";
          } catch {
            /* engines differ on getTiming */
          }
        }
        W.census.push({ at: Math.round(performance.now() - t0), by });
      }, off);
    return t0;
  };
  // BAKE COUNTER. pencil-boil raster.js bakes SVG->Blob->Image->canvas.drawImage
  // (node_modules/@mkbabb/pencil-boil/dist/raster.js:119-125). Counting drawImage on a
  // 2d context is the narrowest true signal for "a bitmap was minted".
  const proto = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (proto && proto.drawImage) {
    const orig = proto.drawImage;
    proto.drawImage = function (...a) {
      W.bakes.push({ t: +performance.now().toFixed(2) });
      return orig.apply(this, a);
    };
  }
};

// THE BOARD-READY DEFINITION (one definition for every T9-W8 lane):
// `.board-group` VISIBLE (it is v-show'n; both control-panel twins are always mounted)
// AND the first `.cell`-class element's rect is non-zero AND one rAF has fired after that.
const BOARD_READY = () =>
  new Promise((res) => {
    const check = () => {
      const g = document.querySelector(".board-group");
      const vis = g && g.getClientRects().length > 0 && getComputedStyle(g).display !== "none";
      const cell = document.querySelector('[class*="cell"]');
      const r = cell && cell.getBoundingClientRect();
      if (vis && r && r.width > 0 && r.height > 0) {
        requestAnimationFrame(() =>
          res({ readyMs: +performance.now().toFixed(2) }),
        );
        return;
      }
      requestAnimationFrame(check);
    };
    check();
  });

const stats = (frames, t0, t1) => {
  const w = frames.filter((f) => f.t >= t0 && f.t <= t1).map((f) => f.dt);
  if (!w.length) return { frames: 0 };
  const s = [...w].sort((a, b) => a - b);
  const q = (p) => +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(2);
  return {
    frames: w.length,
    wallMs: +(t1 - t0).toFixed(1),
    fps: +((w.length / (t1 - t0)) * 1000).toFixed(1),
    p50: q(0.5),
    p95: q(0.95),
    worstMs: +Math.max(...w).toFixed(2),
    long33: w.filter((d) => d > 33.4).length,
    long50: w.filter((d) => d > 50).length,
    jankMs: +w.filter((d) => d > 50).reduce((a, b) => a + b, 0).toFixed(1),
    worst3: s.slice(-3).map((d) => +d.toFixed(2)),
  };
};

const run = async () => {
  const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext(VIEWPORTS[VIEW]);
  const page = await ctx.newPage();
  await page.addInitScript(PROBE);
  let cdp = null;
  if (ENGINE === "chromium") {
    cdp = await ctx.newCDPSession(page);
    if (THROTTLE > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
    await cdp.send("Network.enable");
    if (CACHE === "cold") await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    if (NET === "fast3g")
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
      });
  }
  const url = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;
  const rows = [];
  await page.goto(url, { waitUntil: "load" });
  const ready = await page.evaluate(BOARD_READY);
  // Let the idle poster warm (scheduleWarmPosters: ric + 1200ms floor) land BEFORE cycle 1,
  // so the fold is measured on the estate's intended steady state, not against its own warm.
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.body.focus());

  for (let c = 0; c < CYCLES; c++) {
    // ── ENTRY: playing -> gallery (BEAT 0 chrome-leave 200ms, BEAT 1 fold 520ms, BEAT 2 deal)
    const t0 = await page.evaluate((offs) => {
      window.__A7.bakes.length = 0;
      window.__A7.longtasks.length = 0;
      window.__A7.startCensus(offs);
      return performance.now();
    }, CENSUS_AT);
    await page.keyboard.press("g");
    await page.waitForTimeout(1500);
    const animIn = await page.evaluate(() => window.__A7.census);
    const entry = await page.evaluate((t) => {
      const W = window.__A7;
      return {
        now: performance.now(),
        frames: W.frames.filter((f) => f.t >= t),
        bakes: W.bakes.filter((b) => b.t >= t).length,
        bakeAt: W.bakes.filter((b) => b.t >= t).map((b) => +(b.t - t).toFixed(1)),
        longtasks: W.longtasks.filter((l) => l.t >= t),
        ltSupported: W.longtaskSupported,
        taint: W.taint.length,
        deckCards: document.querySelectorAll(".game-card").length,
        nodes: document.querySelectorAll("*").length,
      };
    }, t0);

    // ── EXIT: gallery -> playing (no beat 0; deck dissolves 200ms under a 520ms unfold)
    const t1 = await page.evaluate((offs) => {
      window.__A7.bakes.length = 0;
      window.__A7.longtasks.length = 0;
      window.__A7.startCensus(offs);
      return performance.now();
    }, CENSUS_AT);
    await page.keyboard.press(EXIT === "escape" ? "Escape" : "Enter");
    await page.waitForTimeout(1500);
    const animOut = await page.evaluate(() => window.__A7.census);
    const exit = await page.evaluate((t) => {
      const W = window.__A7;
      return {
        now: performance.now(),
        frames: W.frames.filter((f) => f.t >= t),
        bakes: W.bakes.filter((b) => b.t >= t).length,
        bakeAt: W.bakes.filter((b) => b.t >= t).map((b) => +(b.t - t).toFixed(1)),
        longtasks: W.longtasks.filter((l) => l.t >= t),
        ltSupported: W.longtaskSupported,
        taint: W.taint.length,
        nodes: document.querySelectorAll("*").length,
      };
    }, t1);

    const mk = (dir, t, d, anim) => ({
      cycle: c,
      dir,
      engine: ENGINE,
      throttle: THROTTLE,
      viewport: VIEW,
      net: NET,
      cache: CACHE,
      exitKey: EXIT,
      // the full window (trigger -> +1500ms) and the CHOREOGRAPHED window
      // (entry: 200 chrome-leave + 520 fold + deal tail; exit: 520 unfold)
      full: stats(d.frames, t, d.now),
      choreo: stats(d.frames, t, t + (dir === "entry" ? 1100 : 760)),
      bakes: d.bakes,
      bakeAtMs: d.bakeAt,
      longtaskSupported: d.ltSupported,
      longtasks: d.ltSupported
        ? d.longtasks.map((l) => ({ at: +(l.t - t).toFixed(1), dur: l.dur }))
        : "NOT MEASURED",
      animCensus: anim,
      censusAtMs: [16, 120, 210, 300, 450, 600, 740, 900, 1150],
      nodes: d.nodes,
      tainted: d.taint > 0,
    });
    rows.push(mk("entry", t0, entry, animIn));
    rows.push(mk("exit", t1, exit, animOut));
    await page.waitForTimeout(400);
  }

  const head = {
    kind: "A7-fold-frames",
    engine: ENGINE,
    throttle: THROTTLE,
    viewport: VIEW,
    net: NET,
    cache: CACHE,
    boardReadyMs: ready.readyMs,
    url,
    at: new Date().toISOString(),
  };
  writeFileSync(OUT, JSON.stringify(head) + "\n");
  for (const r of rows) appendFileSync(OUT, JSON.stringify(r) + "\n");
  await browser.close();
  // Median of the choreographed window, per direction — what the table quotes.
  for (const dir of ["entry", "exit"]) {
    const rs = rows.filter((r) => r.dir === dir && !r.tainted);
    const med = (f) => {
      const v = rs.map(f).sort((a, b) => a - b);
      return v.length ? v[Math.floor(v.length / 2)] : null;
    };
    console.log(
      `${ENGINE} ${THROTTLE}x ${VIEW} ${dir}: n=${rs.length} choreo long33=${med((r) => r.choreo.long33)} long50=${med((r) => r.choreo.long50)} worst=${med((r) => r.choreo.worstMs)}ms p95=${med((r) => r.choreo.p95)}ms fps=${med((r) => r.choreo.fps)} bakes=${med((r) => r.bakes)} census=${rs.length?JSON.stringify(rs[0].animCensus.map(c=>c.at+":"+Object.keys(c.by).length)):""}`,
    );
  }
};
run().catch((e) => {
  console.error("INSTRUMENT FAILURE:", e.message);
  process.exit(3);
});

// run: cd web/frontend && node ../../docs/tranches/2026-08-tranche-9/evidence/w8/attribution/A4/drawer-trace.mjs --engine chromium --regime mobile --cpu 4 --cycles 3 --port 4253 --out <file.jsonl>
//
// T9-W8 §8.1 lane A4 — THE DRAWER'S JANK (M02). Frame-traces the controls drawer's open and
// close as two SEPARATE windows, per regime × engine × CPU throttle. Attribution only: it
// reads the served dist, edits nothing.
//
// chromium: CDP Tracing (devtools.timeline) → per-phase RecalcStyle (UpdateLayoutTree, with
//   its restyled-element count) / Layout / Paint / Composite(Commit+UpdateLayerTree) ms, plus
//   an in-page rAF census (long33/long50) and a PerformanceObserver longtask census.
// webkit: rAF gap census only — NO longtask entry type, NO trace. Printed NOT MEASURED.
//
// The gesture windows are bracketed in the page with performance.mark(), and the marks are
// found back in the trace (blink.user_timing) so trace events bucket into the right phase on
// the trace's own clock. Board-ready is the wave's one definition (see README in this dir).

import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createRequire } from "node:module";
// playwright is resolved out of web/frontend/node_modules (this script lives under docs/).
const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/";
const { chromium, webkit } = createRequire(FE + "package.json")("playwright");

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf("--" + k);
  return i === -1 ? d : argv[i + 1];
};
const ENGINE = arg("engine", "chromium");
const REGIME = arg("regime", "mobile");
const CPU = Number(arg("cpu", "1"));
const CYCLES = Number(arg("cycles", "3"));
const PORT = arg("port", "4253");
const OUT = arg("out", null);
const NET = arg("net", "unthrottled");
const SETTLE = Number(arg("settle", "1100")); // 520ms glide + 220ms guard + slack

// C08 DECLARED CHANGE 1 — deviceScaleFactor. A4's "mobile" set none, so its drawer readings are
// dpr 1 (ATTRIBUTION gap 15). `--dpr` is explicit here and every row carries it.
const DPR = Number(arg("dpr", "3"));
const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, hasTouch: false, isMobile: false, deviceScaleFactor: DPR },
  mobile: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: DPR },
};
const URLBASE = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;

// ── in-page instrument (addInitScript) ───────────────────────────────────────────────────
const INIT = () => {
  const A4 = (window.__A4 = {
    frames: [], // {t, d, phase}
    phase: "boot",
    longtasks: [],
    marks: {},
    boardReadyMs: null,
    hasLongtask: false,
  });
  try {
    const types = PerformanceObserver.supportedEntryTypes || [];
    A4.hasLongtask = types.indexOf("longtask") !== -1;
    if (A4.hasLongtask) {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries())
          A4.longtasks.push({ t: e.startTime, d: e.duration, phase: A4.phase });
      }).observe({ entryTypes: ["longtask"] });
    }
  } catch (_) {}
  let prev = null;
  (function loop(t) {
    if (prev !== null) A4.frames.push({ t: +t.toFixed(2), d: +(t - prev).toFixed(2), phase: A4.phase });
    prev = t;
    requestAnimationFrame(loop);
  })(performance.now());
  // taint watch
  A4.tainted = false;
  for (const ev of ["blur", "visibilitychange"])
    window.addEventListener(ev, () => {
      A4.tainted = true;
    });
  window.__A4mark = (name) => {
    try {
      performance.mark(name);
    } catch (_) {}
    A4.marks[name] = performance.now();
    A4.phase = name;
  };
};

const isVisible = /* in page */ `(el) => {
  if (!el) return false;
  const r = el.getClientRects();
  if (!r.length) return false;
  const cs = getComputedStyle(el);
  return cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.01;
}`;

// THE ONE BOARD-READY DEFINITION (T9-W8 §8.1, every lane): `.board-group` visible (it is
// v-show'n; both control-panel twins are always mounted) AND the first cell-class element's
// rect is non-zero AND one rAF has fired after that. Timestamp = performance.now() (page
// clock, origin = navigationStart). This estate's cell class is `.game-cell` inside
// `.board-cells`; `.cell` alone matches nothing here.
const BOARD_READY = `async () => {
  const vis = ${isVisible};
  const ok = () => {
    const bg = document.querySelector(".board-group");
    if (!vis(bg)) return false;
    const c = document.querySelector(".board-cells .game-cell");
    if (!c) return false;
    const r = c.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && vis(c);
  };
  const t0 = performance.now();
  while (performance.now() - t0 < 30000) {
    if (ok()) {
      await new Promise((r) => requestAnimationFrame(r));
      window.__A4.boardReadyMs = performance.now();
      return window.__A4.boardReadyMs;
    }
    await new Promise((r) => setTimeout(r, 40));
  }
  throw new Error("board-ready timeout");
}`;

const TAB = `() => {
  const vis = ${isVisible};
  const els = Array.from(document.querySelectorAll(".drawer-tab")).filter(vis);
  const el = els[0];
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { expanded: el.getAttribute("aria-expanded"), x: r.x, y: r.y, w: r.width, h: r.height };
}`;

function pct(sorted, p) {
  if (!sorted.length) return null;
  return +sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))].toFixed(2);
}
function frameStats(frames) {
  const d = frames.map((f) => f.d);
  const s = d.slice().sort((a, b) => a - b);
  return {
    n: d.length,
    wallMs: d.length ? +d.reduce((a, b) => a + b, 0).toFixed(2) : 0,
    p50: pct(s, 0.5),
    p95: pct(s, 0.95),
    worst: d.length ? +Math.max(...d).toFixed(2) : null,
    long33: d.filter((x) => x > 33.4).length,
    long50: d.filter((x) => x > 50).length,
    // the burst predicate the born-RED candidate is written against
    maxConsecLong33: (() => {
      let m = 0,
        c = 0;
      for (const x of d) {
        c = x > 33.4 ? c + 1 : 0;
        if (c > m) m = c;
      }
      return m;
    })(),
    jankMs: +d.filter((x) => x > 50).reduce((a, b) => a + b, 0).toFixed(2),
    worst3: s.slice(-3).map((x) => +x.toFixed(2)),
    // the ONSET question: the classic-FLIP gesture lands its one forced layout, its class
    // flip, the tongue's Teleport and the board's `inert` in the FIRST frame after the click.
    // head = the first ten deltas of the window; worstIdx = where the worst frame sits.
    head: d.slice(0, 10).map((x) => +x.toFixed(2)),
    worstIdx: d.length ? d.indexOf(Math.max(...d)) : null,
  };
}

// ── trace bucketing ──────────────────────────────────────────────────────────────────────
const CATS = {
  "UpdateLayoutTree": "recalcStyle",
  "ParseAuthorStyleSheet": "recalcStyle",
  "Layout": "layout",
  "Paint": "paint",
  "PaintImage": "paint",
  "RasterTask": "raster",
  "Commit": "composite",
  "UpdateLayerTree": "composite",
  "CompositeLayers": "composite",
  "Layerize": "composite",
};

function bucketTrace(events, windows) {
  const out = {};
  for (const w of windows) out[w.name] = { recalcStyle: 0, layout: 0, paint: 0, raster: 0, composite: 0, restyledElements: 0, layoutDirty: 0, events: {} };
  for (const e of events) {
    const bucket = CATS[e.name];
    if (!bucket && e.name !== "UpdateLayoutTree") continue;
    const t = e.ts / 1000; // ms, trace clock
    // Windows OVERLAP on purpose (openOnset ⊂ open), so every matching window accumulates.
    for (const w of windows.filter((x) => t >= x.from && t <= x.to)) {
      const o = out[w.name];
      const dur = (e.dur || 0) / 1000;
      o[bucket] = +(o[bucket] + dur).toFixed(3);
      o.events[e.name] = (o.events[e.name] || 0) + 1;
      if (e.name === "UpdateLayoutTree" && e.args?.elementCount) o.restyledElements += e.args.elementCount;
      if (e.name === "Layout" && e.args?.beginData?.dirtyObjects) o.layoutDirty += e.args.beginData.dirtyObjects;
    }
  }
  return out;
}

const rows = [];
function bank(row) {
  rows.push(row);
  if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    appendFileSync(OUT, JSON.stringify(row) + "\n");
  }
  console.log(JSON.stringify(row));
}

const run = async () => {
  const type = ENGINE === "webkit" ? webkit : chromium;
  const browser = await type.launch();
  const ctx = await browser.newContext({ ...VIEWPORTS[REGIME] });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();

  let cdp = null;
  if (ENGINE === "chromium") {
    cdp = await ctx.newCDPSession(page);
    if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
  } else if (CPU > 1) {
    console.error("SETUP: webkit cannot throttle CPU — requested " + CPU + "x, refusing");
    await browser.close();
    process.exit(2);
  }

  // --net fast3g: the wave's cold-link condition (1.6 Mbps down / 150 ms RTT), cache disabled.
  if (NET === "fast3g") {
    if (!cdp) {
      console.error("SETUP: webkit cannot emulate the link here — refusing a fake cold number");
      await browser.close();
      process.exit(2);
    }
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (0.75 * 1024 * 1024) / 8,
    });
  }
  await page.goto(URLBASE, { waitUntil: "load" });
  const boardReadyMs = await page.evaluate(`(${BOARD_READY})()`);

  // The drawer lives on a visible .drawer-tab. Prove the regime has one before measuring.
  // The tongue arrives by a `defer`red Teleport, so it can land a tick after board-ready.
  let tab0 = null;
  for (let i = 0; i < 40 && !tab0; i++) {
    tab0 = await page.evaluate(`(${TAB})()`);
    if (!tab0) await page.waitForTimeout(150);
  }
  if (!tab0) {
    console.error("DIAG: " + JSON.stringify(await page.evaluate(`(() => Array.from(document.querySelectorAll('.drawer-tab')).map((e)=>{const c=getComputedStyle(e);const r=e.getBoundingClientRect();return {d:c.display,v:c.visibility,o:c.opacity,rects:e.getClientRects().length,box:[r.width,r.height]};}))()`)));
    console.error("SETUP: no visible .drawer-tab in regime " + REGIME);
    await browser.close();
    process.exit(2);
  }

  for (let cycle = 0; cycle < CYCLES; cycle++) {
    // trace one whole cycle; the in-page marks split it into open / settle / close
    if (cdp) {
      await cdp.send("Tracing.start", {
        traceConfig: {
          includedCategories: ["disabled-by-default-devtools.timeline", "blink.user_timing", "devtools.timeline"],
        },
        transferMode: "ReturnAsStream",
      });
    }
    await page.evaluate(`window.__A4mark('c${cycle}-pre')`);
    await page.waitForTimeout(250);

    // PROOF OF WORK (the rig's galleryDrag/drawerToggle discipline): a gesture the app ignored
    // would still hand back a frame curve, so the aria-expanded trail travels with the reading.
    const trail = [(await page.evaluate(`(${TAB})()`)).expanded];
    await page.evaluate(`window.__A4mark('c${cycle}-open')`);
    await page.evaluate(`(() => { const vis = ${isVisible}; Array.from(document.querySelectorAll('.drawer-tab')).filter(vis)[0].click(); })()`);
    await page.waitForTimeout(SETTLE);

    await page.evaluate(`window.__A4mark('c${cycle}-mid')`);
    trail.push((await page.evaluate(`(${TAB})()`))?.expanded ?? null);
    await page.waitForTimeout(250);

    await page.evaluate(`window.__A4mark('c${cycle}-close')`);
    await page.evaluate(`(() => { const vis = ${isVisible}; Array.from(document.querySelectorAll('.drawer-tab')).filter(vis)[0].click(); })()`);
    await page.waitForTimeout(SETTLE);
    trail.push((await page.evaluate(`(${TAB})()`))?.expanded ?? null);
    await page.evaluate(`window.__A4mark('c${cycle}-post')`);
    await page.waitForTimeout(150);

    const state = await page.evaluate(`({
      frames: window.__A4.frames, marks: window.__A4.marks, tainted: window.__A4.tainted,
      longtasks: window.__A4.longtasks, hasLongtask: window.__A4.hasLongtask,
    })`);
    await page.evaluate(`window.__A4.frames = []; window.__A4.longtasks = [];`);

    let trace = null;
    if (cdp) {
      const done = new Promise((res) => cdp.once("Tracing.tracingComplete", res));
      await cdp.send("Tracing.end");
      const { stream } = await done;
      let data = "";
      for (;;) {
        const r = await cdp.send("IO.read", { handle: stream, size: 5 * 1024 * 1024 });
        data += r.data;
        if (r.eof) break;
      }
      await cdp.send("IO.close", { handle: stream });
      const events = JSON.parse(data).traceEvents || JSON.parse(data);
      trace = Array.isArray(events) ? events : events.traceEvents;
    }

    const openFrames = state.frames.filter((f) => f.phase === `c${cycle}-open`);
    const closeFrames = state.frames.filter((f) => f.phase === `c${cycle}-close`);
    const preFrames = state.frames.filter((f) => f.phase === `c${cycle}-pre`);

    let traceBuckets = null;
    if (trace) {
      // anchor: find the user_timing marks in the trace clock
      const markTs = {};
      for (const e of trace) {
        if ((e.cat || "").includes("blink.user_timing") && e.name.startsWith(`c${cycle}-`) && markTs[e.name] == null)
          markTs[e.name] = e.ts / 1000;
      }
      const wins = [];
      const mk = (name, a, b) => {
        if (markTs[a] != null && markTs[b] != null) wins.push({ name, from: markTs[a], to: markTs[b] });
      };
      mk("pre", `c${cycle}-pre`, `c${cycle}-open`);
      mk("open", `c${cycle}-open`, `c${cycle}-mid`);
      mk("close", `c${cycle}-close`, `c${cycle}-post`);
      // THE ONSET SUB-WINDOW: the first 50 ms after each click — where classic FLIP puts its
      // one forced layout, the class flip, the tongue's Teleport and the board's `inert`.
      // And the SETTLE sub-window: the last 120 ms of the close, where `onSettle` re-flips the
      // layout and `boardCovered` drops `inert` off 81 cells.
      if (markTs[`c${cycle}-open`] != null)
        wins.push({ name: "openOnset", from: markTs[`c${cycle}-open`], to: markTs[`c${cycle}-open`] + 50 });
      if (markTs[`c${cycle}-close`] != null)
        wins.push({ name: "closeOnset", from: markTs[`c${cycle}-close`], to: markTs[`c${cycle}-close`] + 50 });
      if (markTs[`c${cycle}-close`] != null)
        wins.push({ name: "closeSettle", from: markTs[`c${cycle}-close`] + 480, to: markTs[`c${cycle}-close`] + 800 });
      // C08 DECLARED CHANGE 2 — the settle window is split in two, and the split is the whole
      // question this cure asks: `closeSettleFrame` is the frame the glide finishes in (the
      // frame whose contract is to do nothing); `closeSettleAfter` is everything after it. The
      // banked `closeSettle` is untouched and still reported, so the two files compare directly.
      if (markTs[`c${cycle}-close`] != null) {
        wins.push({ name: "closeSettleFrame", from: markTs[`c${cycle}-close`] + 480, to: markTs[`c${cycle}-close`] + 560 });
        wins.push({ name: "closeSettleAfter", from: markTs[`c${cycle}-close`] + 560, to: markTs[`c${cycle}-close`] + 800 });
      }
      traceBuckets = { windows: wins.map((w) => w.name), ...bucketTrace(trace, wins) };
      traceBuckets.markNames = Object.keys(markTs);
      // C08 DECLARED CHANGE 3 — PER-FRAME attribution, because the charter's number is the
      // SETTLE FRAME's restyle, not a 320 ms window's. The `close` mark carries both clocks
      // (trace ts from blink.user_timing, page ms from window.__A4.marks), so one offset maps
      // the in-page rAF census into trace time; each rAF frame then owns the UpdateLayoutTree
      // events that landed inside it. Reported: the frame the glide ends in (close + GLIDE 520)
      // and the worst recalc frame of the whole close window.
      const pageClose = state.marks[`c${cycle}-close`];
      if (pageClose != null && markTs[`c${cycle}-close`] != null) {
        const off = markTs[`c${cycle}-close`] - pageClose;
        const fr = closeFrames.map((f) => ({ t: f.t + off, d: f.d }));
        const perFrame = fr.map((f) => ({ end: +f.t.toFixed(2), d: f.d, recalcMs: 0, els: 0 }));
        for (const e of trace) {
          if (e.name !== "UpdateLayoutTree") continue;
          const t = e.ts / 1000;
          for (let i = 0; i < fr.length; i++) {
            if (t > fr[i].t - fr[i].d && t <= fr[i].t) {
              perFrame[i].recalcMs = +(perFrame[i].recalcMs + (e.dur || 0) / 1000).toFixed(3);
              perFrame[i].els += e.args?.elementCount || 0;
              break;
            }
          }
        }
        const settleT = markTs[`c${cycle}-close`] + 520;
        traceBuckets.settleFrame =
          perFrame.find((f, i) => settleT > fr[i].t - fr[i].d && settleT <= fr[i].t) ?? null;
        traceBuckets.worstRecalcFrame = perFrame.slice().sort((a, b) => b.recalcMs - a.recalcMs)[0] ?? null;
        traceBuckets.closeFramesOverTen = perFrame.filter((f) => f.recalcMs > 10).length;
      }
      // the same read on the OPEN window: the onset frame, and the worst recalc frame anywhere
      // in the open gesture (this is where a deferred write would show up if it landed badly).
      const pageOpen = state.marks[`c${cycle}-open`];
      if (pageOpen != null && markTs[`c${cycle}-open`] != null) {
        const off = markTs[`c${cycle}-open`] - pageOpen;
        const fr = openFrames.map((f) => ({ t: f.t + off, d: f.d }));
        const perFrame = fr.map((f) => ({ end: +f.t.toFixed(2), d: f.d, recalcMs: 0, els: 0 }));
        for (const e of trace) {
          if (e.name !== "UpdateLayoutTree") continue;
          const t = e.ts / 1000;
          for (let i = 0; i < fr.length; i++) {
            if (t > fr[i].t - fr[i].d && t <= fr[i].t) {
              perFrame[i].recalcMs = +(perFrame[i].recalcMs + (e.dur || 0) / 1000).toFixed(3);
              perFrame[i].els += e.args?.elementCount || 0;
              break;
            }
          }
        }
        traceBuckets.openFirstFrame = perFrame[0] ?? null;
        traceBuckets.openWorstRecalcFrame = perFrame.slice().sort((a, b) => b.recalcMs - a.recalcMs)[0] ?? null;
      }
    }

    bank({
      lane: "A4",
      engine: ENGINE,
      regime: REGIME,
      dpr: DPR,
      build: arg("build", "base"),
      cpu: CPU + "x",
      network: NET === "fast3g" ? "Fast-3G-class 1.6Mbps/150ms RTT, cache disabled" : "unthrottled, cache as-loaded",
      cache: "cold(first nav of this context)",
      cycle,
      boardReadyMs: +boardReadyMs.toFixed(2),
      expandedTrail: trail,
      drawerMoved: trail[0] !== trail[1] && trail[1] !== trail[2],
      tainted: state.tainted,
      hasLongtask: state.hasLongtask,
      pre: frameStats(preFrames),
      open: frameStats(openFrames),
      close: frameStats(closeFrames),
      longtasksOpen: state.longtasks.filter((l) => l.phase === `c${cycle}-open`).map((l) => +l.d.toFixed(1)),
      longtasksClose: state.longtasks.filter((l) => l.phase === `c${cycle}-close`).map((l) => +l.d.toFixed(1)),
      trace: traceBuckets,
    });
  }

  await browser.close();
};

run().catch((e) => {
  console.error("INSTRUMENT FAILURE: " + e.message);
  process.exit(3);
});

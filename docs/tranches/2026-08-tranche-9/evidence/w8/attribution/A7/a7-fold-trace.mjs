// HOW TO RUN: cd web/frontend && npx vite preview --outDir dist --port 4255 --strictPort --host 127.0.0.1 &  then
//   node ../../docs/tranches/2026-08-tranche-9/evidence/w8/attribution/A7/a7-fold-trace.mjs --port 4255 --engine chromium --viewport desk --throttle 4 --cycles 3 --tag c-desk-4x
// T9-W8 §8.1 lane A7 — frame-traces the gallery FOLD (playing→gallery) and UNFOLD (gallery→playing).
// Writes one JSON line per direction per cycle to runs/<tag>.jsonl next to this file.
import { mkdirSync, appendFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
// playwright resolves from the CWD (web/frontend), not from this evidence dir.
const { chromium, webkit } = createRequire(
  join(process.cwd(), "package.json"),
)("playwright");

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const PORT = arg("port", "4255");
const ENGINE = arg("engine", "chromium");
const VIEW = arg("viewport", "desk");
const THROTTLE = Number(arg("throttle", "1"));
const CYCLES = Number(arg("cycles", "3"));
const NET = arg("net", "none"); // none | fast3g
const COLD = arg("cold", "0") === "1";
const IMPATIENT = arg("impatient", "0") === "1"; // fold before the idle poster warm
const TAG = arg("tag", `${ENGINE}-${VIEW}-${THROTTLE}x`);

const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 } },
  mobile: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
};

const INIT = () => {
  const A = (window.__A7 = {
    bakes: 0,
    bakeLog: [],
    decodes: 0,
    longtasks: [],
    taint: 0,
    frames: null,
    longtaskSupported: false,
  });
  const cou = URL.createObjectURL.bind(URL);
  URL.createObjectURL = function (b) {
    A.bakes++;
    A.bakeLog.push({ t: +performance.now().toFixed(1), type: (b && b.type) || "" });
    return cou(b);
  };
  const dec = HTMLImageElement.prototype.decode;
  HTMLImageElement.prototype.decode = function (...a) {
    A.decodes++;
    return dec.apply(this, a);
  };
  try {
    A.longtaskSupported = (PerformanceObserver.supportedEntryTypes || []).includes(
      "longtask",
    );
    if (A.longtaskSupported)
      new PerformanceObserver((l) => {
        for (const e of l.getEntries())
          A.longtasks.push({ s: +e.startTime.toFixed(1), d: +e.duration.toFixed(1) });
      }).observe({ entryTypes: ["longtask"] });
  } catch {
    A.longtaskSupported = false;
  }
  for (const ev of ["blur", "visibilitychange"])
    window.addEventListener(ev, () => A.taint++);

  A.startFrames = () => {
    const f = [];
    A.frames = f;
    A.framesOn = true;
    let last = -1;
    const tick = (t) => {
      if (last >= 0) f.push(+(t - last).toFixed(2));
      last = t;
      if (A.framesOn) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  A.stopFrames = () => {
    A.framesOn = false;
    return A.frames || [];
  };
  const desc = (t) => {
    if (!t || !t.tagName) return null;
    const cls =
      typeof t.className === "string" && t.className.trim()
        ? "." + t.className.trim().split(/\s+/).slice(0, 3).join(".")
        : "";
    return t.tagName.toLowerCase() + cls;
  };
  A.census = () =>
    [...document.getAnimations()].map((a) => {
      const e = a.effect;
      const ct = e && e.getComputedTiming ? e.getComputedTiming() : {};
      const tm = e && e.getTiming ? e.getTiming() : {};
      let props = [];
      try {
        props = [
          ...new Set(
            (e.getKeyframes() || []).flatMap((k) =>
              Object.keys(k).filter(
                (x) => !["offset", "computedOffset", "easing", "composite"].includes(x),
              ),
            ),
          ),
        ];
      } catch {
        props = [];
      }
      return {
        n: a.animationName || a.transitionProperty || "waapi",
        el: desc(e && e.target),
        dur: ct.duration,
        delay: ct.delay,
        ease: tm.easing,
        props,
        st: a.playState,
      };
    });
  A.rollup = () => {
    const m = new Map();
    for (const c of A.census()) {
      const k = `${c.n}|${c.el}|${c.dur}|${c.delay}|${c.ease}|${c.props.join("+")}`;
      m.set(k, (m.get(k) || 0) + 1);
    }
    return [...m.entries()].map(([k, n]) => ({ k, n }));
  };
  A.nodes = () => document.getElementsByTagName("*").length;
  A.boardReady = () =>
    new Promise((res) => {
      const t0 = performance.now();
      const step = () => {
        const bg = document.querySelector(".board-group");
        const vis =
          bg &&
          bg.getClientRects().length > 0 &&
          getComputedStyle(bg).visibility !== "hidden";
        const cell = document.querySelector('[class*="cell"]');
        const r = cell && cell.getBoundingClientRect();
        if (vis && r && r.width > 0 && r.height > 0)
          requestAnimationFrame(() =>
            res({ ms: +performance.now().toFixed(1), waited: +(performance.now() - t0) }),
          );
        else requestAnimationFrame(step);
      };
      step();
    });
};

const med = (a) => {
  if (!a.length) return null;
  const s = [...a].sort((x, y) => x - y);
  const h = s.length >> 1;
  return s.length % 2 ? s[h] : +((s[h - 1] + s[h]) / 2).toFixed(2);
};

async function main() {
  const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext(VIEWPORTS[VIEW]);
  const page = await ctx.newPage();
  await page.addInitScript(INIT);
  let cdp = null;
  if (ENGINE === "chromium") {
    cdp = await ctx.newCDPSession(page);
    await cdp.send("Performance.enable");
    if (COLD) await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    if (NET === "fast3g")
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
      });
    if (THROTTLE > 1)
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
  }
  const url = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;
  await page.goto(url, { waitUntil: "load" });
  const ready = await page.evaluate(() => window.__A7.boardReady());
  // Let the idle poster warm (1200 ms timeout floor in App.vue) land, unless probing impatience.
  await page.waitForTimeout(IMPATIENT ? 250 : 2200);

  const metrics = async () => {
    if (!cdp) return null;
    const { metrics: m } = await cdp.send("Performance.getMetrics");
    const o = {};
    for (const x of m) o[x.name] = x.value;
    return o;
  };
  const dm = (a, b, k) => (a && b ? +((b[k] - a[k]) * 1000).toFixed(2) : null);

  const out = join(HERE, "runs", `${TAG}.jsonl`);
  mkdirSync(join(HERE, "runs"), { recursive: true });

  for (let c = 0; c < CYCLES; c++) {
    for (const dir of ["fold", "unfold"]) {
      const winMs = dir === "fold" ? 1500 : 1100;
      const before = await page.evaluate(() => ({
        bakes: window.__A7.bakes,
        decodes: window.__A7.decodes,
        lt: window.__A7.longtasks.length,
        taint: window.__A7.taint,
        nodes: window.__A7.nodes(),
        t: performance.now(),
      }));
      const m0 = await metrics();
      await page.evaluate(() => window.__A7.startFrames());
      await page.keyboard.press(dir === "fold" ? "g" : "Enter");
      // census one frame after the trigger, and again mid-flight
      const cen1 = await page.evaluate(
        () =>
          new Promise((r) =>
            requestAnimationFrame(() =>
              r({ t: +performance.now().toFixed(1), a: window.__A7.rollup() }),
            ),
          ),
      );
      await page.waitForTimeout(dir === "fold" ? 260 : 60);
      const cen2 = await page.evaluate(() => ({
        t: +performance.now().toFixed(1),
        a: window.__A7.rollup(),
      }));
      await page.waitForTimeout(winMs - (dir === "fold" ? 260 : 60));
      const after = await page.evaluate(() => ({
        frames: window.__A7.stopFrames(),
        bakes: window.__A7.bakes,
        bakeLog: window.__A7.bakeLog.slice(-40),
        decodes: window.__A7.decodes,
        lts: window.__A7.longtasks.slice(window.__A7.__mark || 0),
        ltSupported: window.__A7.longtaskSupported,
        taint: window.__A7.taint,
        nodes: window.__A7.nodes(),
        t: performance.now(),
      }));
      await page.evaluate(
        () => (window.__A7.__mark = window.__A7.longtasks.length),
      );
      const m1 = await metrics();
      const f = after.frames;
      const row = {
        tag: TAG,
        engine: ENGINE,
        viewport: VIEW,
        cpuThrottle: THROTTLE,
        net: NET === "fast3g" ? "fast3g-1.6Mbps/150ms" : "unthrottled",
        cache: COLD ? "disabled" : "enabled",
        cycle: c,
        dir,
        boardReadyMs: ready.ms,
        windowMs: winMs,
        frames: f.length,
        p50: med(f),
        p95: f.length ? [...f].sort((a, b) => a - b)[Math.floor(f.length * 0.95)] : null,
        worst: f.length ? Math.max(...f) : null,
        worst3: [...f].sort((a, b) => b - a).slice(0, 3),
        long33: f.filter((x) => x > 33.4).length,
        long50: f.filter((x) => x > 50).length,
        jankMs: +f.filter((x) => x > 50).reduce((a, b) => a + b, 0).toFixed(1),
        bakes: after.bakes - before.bakes,
        decodes: after.decodes - before.decodes,
        nodesFrom: before.nodes,
        nodesTo: after.nodes,
        longtaskSupported: after.ltSupported,
        longtasks: after.ltSupported ? after.lts : "NOT MEASURED",
        tainted: after.taint > before.taint,
        layoutMs: dm(m0, m1, "LayoutDuration"),
        recalcStyleMs: dm(m0, m1, "RecalcStyleDuration"),
        scriptMs: dm(m0, m1, "ScriptDuration"),
        taskMs: dm(m0, m1, "TaskDuration"),
        layoutCount: m0 && m1 ? m1.LayoutCount - m0.LayoutCount : null,
        recalcCount: m0 && m1 ? m1.RecalcStyleCount - m0.RecalcStyleCount : null,
        censusAtTrigger: cen1.a,
        censusMid: cen2.a,
      };
      appendFileSync(out, JSON.stringify(row) + "\n");
      console.log(
        `${TAG} c${c} ${dir}: frames=${row.frames} p50=${row.p50} worst=${row.worst} long33=${row.long33} long50=${row.long50} bakes=${row.bakes} layout=${row.layoutMs} recalc=${row.recalcStyleMs} script=${row.scriptMs} nodes=${row.nodesFrom}->${row.nodesTo}`,
      );
      await page.waitForTimeout(500);
    }
  }
  await browser.close();
}
main().catch((e) => {
  console.error("INSTRUMENT FAILURE", e);
  process.exit(3);
});

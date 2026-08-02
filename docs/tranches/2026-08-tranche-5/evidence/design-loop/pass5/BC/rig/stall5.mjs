/**
 * stall5.mjs — the pass-5 drawer-open stall rig (playwright-webkit, BUILT DIST).
 *
 * Succeeds pass 3's real-Safari `ev/s2-bake.js` instrument (those ev/ scripts were never
 * banked to disk — only their runs were — so the instrument is rebuilt here from the run
 * schema in `pass3/stall/runs/s2-base-r1.jsonl` and the method in
 * `pass3/stall-attribution-report.md` §1/§4). What is preserved: the drawer lands CLOSED
 * first, settles, then the gesture under study is drawer-OPEN; every bake-path API is timed
 * per call; a continuous rAF sampler carries the frame curve across the gesture.
 *
 * HARNESS DIFFERENCE, STATED: pass 3 drove real Safari 26.4 through osascript at 1280x810.
 * This rig drives Playwright's WebKit at the same viewport. Absolute milliseconds across the
 * two harnesses are NOT comparable; the arms below are all taken in THIS harness so the
 * deltas are.
 *
 * ARMS
 *   shipped  — the tree's own dist, instrument only.
 *   ablate   — the CURE REMOVED at run time: `canvas.toBlob` is wrapped to first pay the
 *              round trip pencil-boil 0.11 deleted (createImageBitmap(canvas) -> new
 *              OffscreenCanvas -> drawImage -> convertToBlob) and hand that blob back. This
 *              is the ablation-RED arm: the defect is an ABSENCE, so the control restores it.
 *   pin      — board + wordmark sizes pinned across the gesture (pass 3's p3 ablation).
 *              Zero re-bakes must follow; if the stall survives, it was never the bake.
 *
 * STATISTICS, defined here rather than inherited:
 *   worstGapMs   — the largest rAF delta in the 900ms window after the click.
 *   blocked600   — SUM of (gap) for gaps >= 50ms inside the first 600ms after the click.
 *   blocked900   — the same over the full 900ms window.
 *   longGaps     — count of gaps >= 100ms in the window.
 * Pass 3's own "blocked<600" estimator is not published anywhere on disk; these are named so
 * nothing here is mistaken for a re-print of it.
 *
 * usage: node stall5.mjs <arm> <runId> [--port N] [--repeats N]
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNS = resolve(HERE, "..", "runs");
// The rig lives in the evidence tree, not in the package — resolve the app's OWN playwright
// so the engine under test is the one CI installs, not a stray global.
const FE = resolve(HERE, "../../../../../../../../web/frontend/package.json");
const PW = await import(pathToFileURL(createRequire(FE).resolve("@playwright/test")).href);
const webkit = PW.webkit ?? PW.default?.webkit;
if (!webkit) throw new Error("could not resolve the app's @playwright/test webkit export");

const arm = process.argv[2] ?? "shipped";
const runId = process.argv[3] ?? `${arm}-r1`;
const port = +(process.argv.find((a) => a.startsWith("--port="))?.slice(7) ?? 4241);
const repeats = +(process.argv.find((a) => a.startsWith("--repeats="))?.slice(10) ?? 1);

/** Injected before any page script: the bake-path instrument. */
const INSTRUMENT = () => {
  const R = {
    events: [],
    frames: [],
    clickAt: null,
    armApplied: null,
  };
  window.__rig = R;
  const rec = (n, ms, extra) =>
    R.events.push({ n, ms: +ms.toFixed(2), at: +performance.now().toFixed(1), ...extra });

  const sz = (o) => {
    try {
      if (!o) return null;
      const w = o.width ?? o.videoWidth ?? o.naturalWidth;
      const h = o.height ?? o.videoHeight ?? o.naturalHeight;
      return w && h ? `${Math.round(w)}x${Math.round(h)}` : null;
    } catch {
      return null;
    }
  };

  // createImageBitmap — the 79-195ms half pass 3 attributed. Present on 0.10.1, absent on
  // 0.11.0's path; the counter stays so its ZERO is a measurement, not an assumption.
  if (typeof window.createImageBitmap === "function") {
    const o = window.createImageBitmap.bind(window);
    window.createImageBitmap = async function (...a) {
      const t = performance.now();
      const r = await o(...a);
      rec("createImageBitmap", performance.now() - t, { size: sz(a[0]) });
      return r;
    };
  }
  // convertToBlob — the 87-112ms PNG encode on the OffscreenCanvas leg (0.10.1's path).
  if (typeof OffscreenCanvas !== "undefined" && OffscreenCanvas.prototype.convertToBlob) {
    const o = OffscreenCanvas.prototype.convertToBlob;
    OffscreenCanvas.prototype.convertToBlob = async function (...a) {
      const t = performance.now();
      const b = await o.apply(this, a);
      rec("convertToBlob", performance.now() - t, { size: sz(this), bytes: b?.size ?? null });
      return b;
    };
  }
  // toBlob — 0.11.0's single encode, straight off the capture canvas.
  {
    const o = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (cb, ...rest) {
      const t = performance.now();
      const self = this;
      return o.call(
        this,
        (b) => {
          rec("toBlob", performance.now() - t, { size: sz(self), bytes: b?.size ?? null });
          cb(b);
        },
        ...rest,
      );
    };
  }
  // drawImage — the filter raster itself. Pass 3 measured this at 0-4ms TOTAL and that is
  // the load-bearing half of the attribution: the filter was never the expense.
  {
    const o = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (...a) {
      const t = performance.now();
      const r = o.apply(this, a);
      const ms = performance.now() - t;
      if (ms >= 0.1)
        rec("drawImage", ms, { dst: sz(this.canvas), srcKind: a[0]?.constructor?.name });
      else R.__cheapDraws = (R.__cheapDraws ?? 0) + 1;
      return r;
    };
  }
  // Every pose capture mints one image/svg+xml blob URL — the bake COUNTER, independent of
  // which encode path the library takes.
  {
    const o = URL.createObjectURL.bind(URL);
    URL.createObjectURL = function (b) {
      if (b && b.type.startsWith("image/svg+xml")) rec("svgBlob", 0, { bytes: b.size });
      if (b && b.type === "image/png") rec("pngBlob", 0, { bytes: b.size });
      return o(b);
    };
  }

  // Continuous rAF sampler — runs for the life of the page; the window is cut at analysis.
  let last = performance.now();
  const tick = (now) => {
    R.frames.push(+(now - last).toFixed(2));
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

/** ARM: ablate the 0.11 cure — put the deleted round trip back, in front of the encode. */
const ABLATE_ROUNDTRIP = () => {
  const o = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, type, q) {
    const canvas = this;
    o.call(
      canvas,
      async () => {
        // exactly the deleted path: bitmap copy -> offscreen redraw -> offscreen PNG encode
        const bm = await createImageBitmap(canvas);
        const oc = new OffscreenCanvas(bm.width, bm.height);
        oc.getContext("2d").drawImage(bm, 0, 0);
        const blob = await oc.convertToBlob({ type: type ?? "image/png" });
        bm.close?.();
        cb(blob);
      },
      type,
      q,
    );
  };
  window.__rig && (window.__rig.armApplied = "ablate-roundtrip");
};

/** ARM: pin the two surfaces whose size change triggers the re-bake (pass 3's p1/p2/p3). */
const PIN_BOARD = `
html.drawer-closed .board-shell, html:not(.drawer-closed) .board-shell,
html.drawer-closed .board-shell.shell-sm, html.drawer-closed .board-shell.shell-md,
html.drawer-closed .board-shell.shell-lg {
  width: 650px !important; height: 650px !important;
  max-width: 650px !important; max-height: 650px !important;
}
`;
const PIN_LOGO = `
html.drawer-closed .masthead, html:not(.drawer-closed) .masthead { --logo-scale: 1 !important; }
`;
const PIN_CSS = `
html.drawer-closed .board-shell, html:not(.drawer-closed) .board-shell,
html.drawer-closed .board-shell.shell-sm, html.drawer-closed .board-shell.shell-md,
html.drawer-closed .board-shell.shell-lg {
  width: 650px !important; height: 650px !important;
  max-width: 650px !important; max-height: 650px !important;
}
html.drawer-closed .masthead, html:not(.drawer-closed) .masthead { --logo-scale: 1 !important; }
`;

const analyse = (raw) => {
  const { events, frames, clickAt, sampleT0, shellBefore, shellAfter, logoBefore, logoAfter } =
    raw;
  // frames[] are deltas; rebuild absolute times from the sampler's own origin.
  let t = sampleT0;
  const gaps = [];
  for (const d of frames) {
    t += d;
    gaps.push({ end: t, ms: d });
  }
  const inWin = (g, w) => g.end - clickAt >= 0 && g.end - clickAt <= w;
  const win900 = gaps.filter((g) => inWin(g, 900));
  const win600 = gaps.filter((g) => inWin(g, 600));
  const sum = (a) => +a.reduce((s, g) => s + g.ms, 0).toFixed(1);
  const evAfter = events.filter((e) => e.at >= clickAt - 5 && e.at <= clickAt + 900);
  const tot = (n) => +evAfter.filter((e) => e.n === n).reduce((s, e) => s + e.ms, 0).toFixed(1);
  const cnt = (n) => evAfter.filter((e) => e.n === n).length;
  return {
    worstGapMs: win900.length ? +Math.max(...win900.map((g) => g.ms)).toFixed(1) : null,
    blocked600: sum(win600.filter((g) => g.ms >= 50)),
    blocked900: sum(win900.filter((g) => g.ms >= 50)),
    longGaps100: win900.filter((g) => g.ms >= 100).length,
    framesInWindow: win900.length,
    medianGapMs: win900.length
      ? +[...win900.map((g) => g.ms)].sort((a, b) => a - b)[Math.floor(win900.length / 2)].toFixed(
          1,
        )
      : null,
    bakes: cnt("svgBlob"),
    pngBlobs: cnt("pngBlob"),
    createImageBitmapMs: tot("createImageBitmap"),
    createImageBitmapN: cnt("createImageBitmap"),
    convertToBlobMs: tot("convertToBlob"),
    convertToBlobN: cnt("convertToBlob"),
    toBlobMs: tot("toBlob"),
    toBlobN: cnt("toBlob"),
    drawImageMs: tot("drawImage"),
    drawImageN: cnt("drawImage"),
    shell: `${shellBefore}->${shellAfter}`,
    logo: `${logoBefore}->${logoAfter}`,
    captureSizes: [...new Set(evAfter.filter((e) => e.n === "toBlob" || e.n === "convertToBlob").map((e) => e.size))],
    bigGaps: win900
      .filter((g) => g.ms >= 50)
      .map((g) => ({ ms: +g.ms.toFixed(1), afterClickMs: +(g.end - clickAt).toFixed(0) })),
  };
};

const one = async (page, i) => {
  // Land CLOSED, settle, then the gesture under study is drawer-OPEN (pass 3's shape).
  await page.evaluate(() => {
    const tab = document.querySelector(".drawer-tab");
    if (!tab) throw new Error("no drawer-tab — wrong regime");
    if (!document.documentElement.classList.contains("drawer-closed")) tab.click();
  });
  await page.waitForTimeout(2200);

  const raw = await page.evaluate(async () => {
    const R = window.__rig;
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return "none";
      const r = el.getBoundingClientRect();
      return `${Math.round(r.width)}x${Math.round(r.height)}`;
    };
    // Reset the window: drop everything before the gesture.
    R.events.length = 0;
    R.frames.length = 0;
    const sampleT0 = performance.now();
    const shellBefore = box(".board-shell");
    const logoBefore = box("svg.handwritten-logo");
    const closedBefore = document.documentElement.classList.contains("drawer-closed");
    document.querySelector(".drawer-tab").click();
    const clickAt = performance.now();
    await new Promise((r) => setTimeout(r, 950));
    return {
      events: R.events.slice(),
      frames: R.frames.slice(),
      clickAt,
      sampleT0,
      closedBefore,
      closedAfter: document.documentElement.classList.contains("drawer-closed"),
      shellBefore,
      shellAfter: box(".board-shell"),
      logoBefore,
      logoAfter: box("svg.handwritten-logo"),
      armApplied: R.armApplied,
    };
  });
  if (raw.closedBefore !== true)
    throw new Error("gesture guard: drawer was not CLOSED before the tap");
  if (raw.closedAfter !== false)
    throw new Error("gesture guard: drawer did not OPEN on the tap");
  return { rep: i, ...analyse(raw), raw };
};

const main = async () => {
  mkdirSync(RUNS, { recursive: true });
  const browser = await webkit.launch();
  // DPR 2 — pass 3's desktop cell was DPR2 (1320^2 grid + 792x234 logo capture). At DPR1
  // the encode is a quarter of the pixels and the comparison would flatter this tree.
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 810 },
    deviceScaleFactor: 2,
  });
  await ctx.addInitScript(INSTRUMENT);
  if (arm === "ablate") await ctx.addInitScript(ABLATE_ROUNDTRIP);
  const page = await ctx.newPage();
  // Pin app state on the URL (the run-safari.sh EXTRA lesson: localStorage is per-origin and
  // board size drives cell count, hence bake size).
  await page.goto(`http://localhost:${port}/?game=sudoku&size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.waitForSelector(".drawer-tab", { timeout: 20000 });
  if (arm === "pin") await page.addStyleTag({ content: PIN_CSS });
  if (arm === "pinboard") await page.addStyleTag({ content: PIN_BOARD });
  if (arm === "pinlogo") await page.addStyleTag({ content: PIN_LOGO });
  await page.waitForTimeout(3000); // let the cold-load bake finish before the gesture

  const env = await page.evaluate(() => ({
    ua: navigator.userAgent,
    dpr: devicePixelRatio,
    iw: innerWidth,
    ih: innerHeight,
    coarse: matchMedia("(pointer: coarse)").matches,
    row: matchMedia("(min-width: 1024px)").matches,
    drawerMounted: !!document.querySelector(".drawer-tab"),
    vendor: navigator.vendor,
  }));
  if (!env.row || !env.drawerMounted)
    throw new Error(`regime guard: row=${env.row} drawer=${env.drawerMounted}`);

  const reps = [];
  for (let i = 1; i <= repeats; i++) reps.push(await one(page, i));

  const out = { kind: "run", runId, arm, env, port, reps, ts: new Date().toISOString() };
  const lines = [JSON.stringify({ kind: "env", runId, arm, ...env })];
  for (const r of reps) lines.push(JSON.stringify({ kind: "rep", runId, arm, ...r }));
  writeFileSync(resolve(RUNS, `${runId}.jsonl`), lines.join("\n") + "\n");
  for (const r of reps)
    console.log(
      `${runId}#${r.rep}  worst ${String(r.worstGapMs).padStart(6)}  blocked600 ${String(
        r.blocked600,
      ).padStart(6)}  blocked900 ${String(r.blocked900).padStart(6)}  long100 ${r.longGaps100}` +
        `  bakes ${String(r.bakes).padStart(2)}  cib ${String(r.createImageBitmapMs).padStart(
          6,
        )}(${r.createImageBitmapN})  ctb ${String(r.convertToBlobMs).padStart(6)}(${
          r.convertToBlobN
        })  toBlob ${String(r.toBlobMs).padStart(6)}(${r.toBlobN})  drawImg ${String(
          r.drawImageMs,
        ).padStart(5)}  shell ${r.shell}  logo ${r.logo}`,
    );
  await browser.close();
  return out;
};

main().catch((e) => {
  console.error("RIG FAILED:", e.message);
  process.exit(1);
});

#!/usr/bin/env node
// RUN: cd web/frontend && node <thisfile> --throttle 4 --viewport desk --cycles 3 --port 4256 --out <out.jsonl>
// T9-W8 §8.1 lane A7 — WHERE THE FOLD'S MILLISECONDS GO. CDP devtools.timeline trace over the
// fold (playing->gallery) and the unfold (gallery->playing): main-thread ms by event name
// (RecalcStyles / Layout / Paint / Composite / Function calls), plus the longest events.
// Banks a SUMMARY, never the raw trace (the W8 evidence cap is 2 MiB across seven lanes).
// Chromium only — CDP. Reads a FIXED dist. Never builds.
import { writeFileSync, appendFileSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/package.json")("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const THROTTLE = Number(arg("throttle", "4"));
const VIEW = arg("viewport", "desk");
const PORT = arg("port", "4256");
const OUT = arg("out", "/dev/stdout");
const CYCLES = Number(arg("cycles", "3"));

const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
  },
};

// The devtools.timeline names that carry the pipeline. Everything else folds into "other".
const KEEP = new Set([
  "ParseHTML",
  "UpdateLayoutTree", // RecalcStyle
  "Layout",
  "Paint",
  "PrePaint",
  "Layerize",
  "CompositeLayers",
  "UpdateLayer",
  "FunctionCall",
  "TimerFire",
  "EventDispatch",
  "FireAnimationFrame",
  "HitTest",
  "DecodeImage",
  "ImageDecodeTask",
  "RunTask",
  "Commit",
]);

const summarize = (events, t0us, t1us) => {
  const by = {};
  const longest = [];
  for (const e of events) {
    if (e.ph !== "X" || typeof e.dur !== "number") continue;
    if (e.ts < t0us || e.ts > t1us) continue;
    const n = KEEP.has(e.name) ? e.name : "other";
    by[n] = +((by[n] || 0) + e.dur / 1000).toFixed(2);
    longest.push([e.name, +(e.dur / 1000).toFixed(2), +((e.ts - t0us) / 1000).toFixed(1)]);
  }
  longest.sort((a, b) => b[1] - a[1]);
  return { msByEvent: by, longest: longest.slice(0, 8) };
};

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(VIEWPORTS[VIEW]);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (THROTTLE > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
  await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`, {
    waitUntil: "load",
  });
  await page.waitForTimeout(2600);
  await page.evaluate(() => document.body.focus());

  const rows = [];
  for (let c = 0; c < CYCLES; c++) {
    for (const dir of ["entry", "exit"]) {
      const events = [];
      cdp.on("Tracing.dataCollected", (d) => events.push(...d.value));
      await cdp.send("Tracing.start", {
        transferMode: "ReportEvents",
        traceConfig: {
          recordMode: "recordAsMuchAsPossible",
          includedCategories: [
            "devtools.timeline",
            "disabled-by-default-devtools.timeline",
            "blink.user_timing",
          ],
        },
      });
      // The trace's own clock: a marker event whose ts anchors the window.
      const t0 = await page.evaluate(() => performance.now());
      await page.keyboard.press(dir === "entry" ? "g" : "Enter");
      await page.waitForTimeout(dir === "entry" ? 1000 : 800);
      const done = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
      await cdp.send("Tracing.end");
      await done;
      cdp.removeAllListeners("Tracing.dataCollected");
      // Anchor: the earliest traced event is the window's head (tracing started at the press).
      const ts = events.filter((e) => typeof e.ts === "number").map((e) => e.ts);
      const head = Math.min(...ts);
      const win = dir === "entry" ? 1000 : 800;
      rows.push({
        cycle: c,
        dir,
        throttle: THROTTLE,
        viewport: VIEW,
        windowMs: win,
        startedAtPerfNow: +t0.toFixed(1),
        ...summarize(events, head, head + win * 1000),
      });
      await page.waitForTimeout(400);
    }
  }
  writeFileSync(
    OUT,
    JSON.stringify({
      kind: "A7-fold-cdp-trace",
      engine: "chromium",
      throttle: THROTTLE,
      viewport: VIEW,
      at: new Date().toISOString(),
    }) + "\n",
  );
  for (const r of rows) appendFileSync(OUT, JSON.stringify(r) + "\n");
  await browser.close();
  for (const dir of ["entry", "exit"]) {
    const rs = rows.filter((r) => r.dir === dir);
    const keys = [...new Set(rs.flatMap((r) => Object.keys(r.msByEvent)))];
    const med = (k) => {
      const v = rs.map((r) => r.msByEvent[k] || 0).sort((a, b) => a - b);
      return v[Math.floor(v.length / 2)];
    };
    console.log(
      `${dir} ${THROTTLE}x ${VIEW}: ` +
        keys
          .map((k) => `${k}=${med(k)}ms`)
          .sort()
          .join(" "),
    );
    console.log(`   longest: ${JSON.stringify(rs[0].longest.slice(0, 4))}`);
  }
};
run().catch((e) => {
  console.error("INSTRUMENT FAILURE:", e.message);
  process.exit(3);
});

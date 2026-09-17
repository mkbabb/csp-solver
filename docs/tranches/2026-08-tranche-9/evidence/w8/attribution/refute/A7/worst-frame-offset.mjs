#!/usr/bin/env node
// RUN: cd web/frontend && node <thisfile> --throttle 4 --viewport desk --cycles 4 --port 4260 --out <out.jsonl>
// T9-W8 §8.1 A7 REFUTER. A7's fold-frames.mjs banks choreo STATS (worst3) but never the
// OFFSET of the worst frame, so its claims "entry's long frame at 205-212ms" and "exit's long
// frame at 0-43ms" rest on cycle-0 longtasks alone. This banks, per direction per cycle:
// the worst frame's offset from the trigger, every frame >33.4ms with its offset, the longtask
// list, and the board-ready mark — so the attribution can be checked instead of inferred.
// Reads a FIXED dist over a running preview. Never builds.
import { writeFileSync, appendFileSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/package.json")("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const THROTTLE = Number(arg("throttle", "4"));
const VIEW = arg("viewport", "desk");
const CYCLES = Number(arg("cycles", "4"));
const PORT = arg("port", "4260");
const OUT = arg("out", "/dev/stdout");

const VIEWPORTS = {
  desk: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
};

const PROBE = () => {
  const W = (window.__R7 = { frames: [], longtasks: [], bakes: [], taint: [] });
  let last = performance.now();
  const tick = (now) => {
    W.frames.push({ t: +now.toFixed(2), dt: +(now - last).toFixed(2) });
    last = now;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame((n) => { last = n; requestAnimationFrame(tick); });
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        W.longtasks.push({ t: +e.startTime.toFixed(2), dur: +e.duration.toFixed(2) });
    }).observe({ entryTypes: ["longtask"] });
  } catch { /* chromium only */ }
  for (const ev of ["blur", "visibilitychange"])
    window.addEventListener(ev, () => W.taint.push({ ev, t: performance.now() }));
  const proto = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (proto && proto.drawImage) {
    const orig = proto.drawImage;
    proto.drawImage = function (...a) {
      W.bakes.push({ t: +performance.now().toFixed(2) });
      return orig.apply(this, a);
    };
  }
};

// A7's board-ready, verbatim.
const BOARD_READY = () =>
  new Promise((res) => {
    const check = () => {
      const g = document.querySelector(".board-group");
      const vis = g && g.getClientRects().length > 0 && getComputedStyle(g).display !== "none";
      const cell = document.querySelector('[class*="cell"]');
      const r = cell && cell.getBoundingClientRect();
      if (vis && r && r.width > 0 && r.height > 0) {
        requestAnimationFrame(() => res({ readyMs: +performance.now().toFixed(2) }));
        return;
      }
      requestAnimationFrame(check);
    };
    check();
  });

const run = async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(VIEWPORTS[VIEW]);
  const page = await ctx.newPage();
  await page.addInitScript(PROBE);
  const cdp = await ctx.newCDPSession(page);
  if (THROTTLE > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
  const url = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;
  await page.goto(url, { waitUntil: "load" });
  const ready = await page.evaluate(BOARD_READY);
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.body.focus());

  const rows = [];
  const win = (dir) => (dir === "entry" ? 1100 : 760);
  for (let c = 0; c < CYCLES; c++) {
    for (const dir of ["entry", "exit"]) {
      const t = await page.evaluate(() => {
        window.__R7.bakes.length = 0;
        window.__R7.longtasks.length = 0;
        return performance.now();
      });
      await page.keyboard.press(dir === "entry" ? "g" : "Enter");
      await page.waitForTimeout(1400);
      const d = await page.evaluate(
        ([t0, w]) => {
          const W = window.__R7;
          const fr = W.frames.filter((f) => f.t >= t0 && f.t <= t0 + w);
          let worst = { dt: 0, at: null };
          for (const f of fr) if (f.dt > worst.dt) worst = { dt: f.dt, at: +(f.t - t0).toFixed(1) };
          return {
            worstMs: worst.dt,
            worstAtMs: worst.at,
            longFrames: fr
              .filter((f) => f.dt > 33.4)
              .map((f) => ({ atMs: +(f.t - t0).toFixed(1), dtMs: f.dt })),
            longtasks: W.longtasks
              .filter((l) => l.t >= t0 && l.t <= t0 + w)
              .map((l) => ({ atMs: +(l.t - t0).toFixed(1), durMs: l.dur })),
            bakes: W.bakes.filter((b) => b.t >= t0).length,
            bakeAtMs: W.bakes.filter((b) => b.t >= t0).map((b) => +(b.t - t0).toFixed(1)),
            taint: W.taint.length,
          };
        },
        [t, win(dir)],
      );
      rows.push({ cycle: c, dir, throttle: THROTTLE, viewport: VIEW, ...d, tainted: d.taint > 0 });
    }
    await page.waitForTimeout(400);
  }
  await browser.close();

  const head = {
    kind: "A7-REFUTE-worst-frame-offset",
    throttle: THROTTLE,
    viewport: VIEW,
    boardReadyMs: ready.readyMs,
    loadavg: process.env.LOADAVG || null,
    url,
    at: new Date().toISOString(),
  };
  writeFileSync(OUT, JSON.stringify(head) + "\n");
  for (const r of rows) appendFileSync(OUT, JSON.stringify(r) + "\n");
  console.log(`board-ready ${ready.readyMs}ms  load=${head.loadavg}`);
  for (const r of rows)
    console.log(
      `c${r.cycle} ${r.dir}: worst=${r.worstMs}ms @${r.worstAtMs}ms | long33=${JSON.stringify(r.longFrames)} | lt=${JSON.stringify(r.longtasks)} | bakes=${r.bakes}`,
    );
};
run().catch((e) => {
  console.error("INSTRUMENT FAILURE:", e.message);
  process.exit(3);
});

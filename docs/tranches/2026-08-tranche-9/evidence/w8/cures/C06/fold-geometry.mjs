#!/usr/bin/env node
// RUN: cd web/frontend && node <thisfile> --engine chromium --throttle 1 --viewport desk --port 4256 --out <out.jsonl>
// T9-W8 §8.1 lane A7 — THE CUT DETECTOR. Samples the board's and the wordmark's on-screen
// box every rAF across the fold (playing->gallery) and the unfold (gallery->playing).
// A mover that TRAVELS draws a monotone ramp of boxes; a mover that CUTS shows one step.
// This is the instrument behind the "not properly defined" half of M09: it says which
// element is on a curve and which is an instant swap. Reads a FIXED dist. Never builds.
import { writeFileSync, appendFileSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium, webkit } = createRequire(process.cwd() + "/package.json")("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const ENGINE = arg("engine", "chromium");
const THROTTLE = Number(arg("throttle", "1"));
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

const PROBE = () => {
  const W = (window.__A7G = { samples: [], on: false, t0: 0 });
  // The two movers App hands `foldCtl.run` / `runFold`: the ONE board (`.board-peek-host`)
  // and the wordmark (`logoMenu.$el`, which carries the `.logo-menu` class).
  const box = (sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return [+r.left.toFixed(1), +r.top.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)];
  };
  const tick = (now) => {
    if (W.on) {
      W.samples.push({
        at: +(now - W.t0).toFixed(1),
        board: box(".board-peek-host"),
        logo: box(".logo-menu"),
        card: box(".game-card.is-center"),
        deck: box(".game-gallery"),
      });
      if (now - W.t0 > 1400) W.on = false;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  W.start = () => {
    W.samples = [];
    W.t0 = performance.now();
    W.on = true;
    return W.t0;
  };
};

// Width is the fold's own channel (flipTransform's scale = first.width / last.width), so the
// board's rendered WIDTH across the window is the cleanest one-number read of travel-vs-cut.
const travel = (samples, key) => {
  const w = samples.map((s) => (s[key] ? s[key][2] : null)).filter((v) => v != null);
  if (w.length < 3) return { verdict: "NO ELEMENT", n: w.length };
  const first = w[0];
  const last = w[w.length - 1];
  const span = Math.abs(last - first);
  // Distinct intermediate widths — a curve produces many, a cut produces ~none.
  const uniq = new Set(w.map((v) => Math.round(v))).size;
  // The single largest one-frame jump, as a share of the whole travel.
  let biggest = 0;
  for (let i = 1; i < w.length; i++) biggest = Math.max(biggest, Math.abs(w[i] - w[i - 1]));
  const share = span > 1 ? +(biggest / span).toFixed(3) : null;
  return {
    firstW: +first.toFixed(1),
    lastW: +last.toFixed(1),
    spanPx: +span.toFixed(1),
    distinctWidths: uniq,
    biggestStepPx: +biggest.toFixed(1),
    biggestStepShareOfTravel: share,
    // A CUT is one frame carrying (nearly) the whole travel; a GLIDE spreads it.
    verdict: span < 2 ? "NO TRAVEL" : share != null && share > 0.8 ? "CUT" : "GLIDE",
  };
};

const run = async () => {
  const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext(VIEWPORTS[VIEW]);
  const page = await ctx.newPage();
  await page.addInitScript(PROBE);
  if (ENGINE === "chromium" && THROTTLE > 1) {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: THROTTLE });
  }
  const url = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(2600); // board-ready + the idle poster warm
  await page.evaluate(() => document.body.focus());
  const rows = [];
  for (let c = 0; c < CYCLES; c++) {
    for (const dir of ["entry", "exit"]) {
      await page.evaluate(() => window.__A7G.start());
      await page.keyboard.press(dir === "entry" ? "g" : "Enter");
      await page.waitForTimeout(1500);
      const s = await page.evaluate(() => window.__A7G.samples);
      rows.push({
        cycle: c,
        dir,
        engine: ENGINE,
        throttle: THROTTLE,
        viewport: VIEW,
        frames: s.length,
        board: travel(s, "board"),
        logo: travel(s, "logo"),
        // the board's width track, thinned to every 3rd frame for the bank
        boardTrack: s
          .filter((_, i) => i % 3 === 0)
          .map((x) => [x.at, x.board ? x.board[2] : null]),
        logoTrack: s
          .filter((_, i) => i % 3 === 0)
          .map((x) => [x.at, x.logo ? x.logo[2] : null]),
      });
      await page.waitForTimeout(400);
    }
  }
  writeFileSync(
    OUT,
    JSON.stringify({
      kind: "A7-fold-geometry",
      engine: ENGINE,
      throttle: THROTTLE,
      viewport: VIEW,
      at: new Date().toISOString(),
    }) + "\n",
  );
  for (const r of rows) appendFileSync(OUT, JSON.stringify(r) + "\n");
  await browser.close();
  for (const r of rows)
    console.log(
      `${ENGINE} ${THROTTLE}x ${VIEW} c${r.cycle} ${r.dir}: board ${r.board.verdict} ${r.board.firstW}->${r.board.lastW}px span=${r.board.spanPx} biggestStep=${r.board.biggestStepPx}px (${r.board.biggestStepShareOfTravel}) distinct=${r.board.distinctWidths} | logo ${r.logo.verdict} span=${r.logo.spanPx} distinct=${r.logo.distinctWidths}`,
    );
};
run().catch((e) => {
  console.error("INSTRUMENT FAILURE:", e.message);
  process.exit(3);
});

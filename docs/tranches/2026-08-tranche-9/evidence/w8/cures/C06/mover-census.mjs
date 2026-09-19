#!/usr/bin/env node
// RUN: cd web/frontend && node <thisfile> --viewport desk --port 4256 --out <out.jsonl>
// T9-W8 §8.1 lane A7 — WHICH MOVERS DID THE FOLD ACTUALLY CREATE?
// Wraps Element.prototype.animate, so every WAAPI mover `useFlipGlide.run()` builds is logged
// with its element, its [from -> to] transforms and its timing. `runFold`/`onLiveFace` drop a
// mover silently when its element or its FIRST rect is missing ("A null mover drops out"), and
// a dropped mover is invisible in every other instrument. Reads a FIXED dist. Never builds.
import { writeFileSync, appendFileSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium, webkit } = createRequire(process.cwd() + "/package.json")("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const ENGINE = arg("engine", "chromium");
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
  const W = (window.__A7M = { calls: [], t0: 0, probe: [] });
  const orig = Element.prototype.animate;
  Element.prototype.animate = function (kf, opts) {
    try {
      const cls = (this.getAttribute && this.getAttribute("class")) || this.tagName;
      const frames = Array.isArray(kf) ? kf : [kf];
      W.calls.push({
        at: +(performance.now() - W.t0).toFixed(1),
        el: String(cls).split(" ")[0],
        transforms: frames.map((f) => (f && f.transform) || null),
        durationMs: opts && typeof opts === "object" ? opts.duration : opts,
        easing: opts && typeof opts === "object" ? opts.easing : null,
      });
    } catch {
      /* logging must never break the surface under test */
    }
    return orig.call(this, kf, opts);
  };
  // WHO KILLS THE MOVER. `App.restoreBoardAnims` calls `finish()` on every animation in the
  // board subtree that its pre-move snapshot did not contain — the T8-M7b cure for the
  // Teleport's re-invented `cell-reveal`s. The fold's own board mover lives in that subtree.
  const oFin = Animation.prototype.finish;
  Animation.prototype.finish = function () {
    try {
      const e = this.effect && this.effect.target;
      W.calls.push({
        at: +(performance.now() - W.t0).toFixed(1),
        el: "FINISH:" + String((e && ((e.getAttribute && e.getAttribute("class")) || e.tagName)) || "?").split(" ")[0],
        transforms: [this.playState],
        durationMs: null,
        easing: null,
      });
    } catch {
      /* logging must never break the surface under test */
    }
    return oFin.call(this);
  };
  const oCancel = Animation.prototype.cancel;
  Animation.prototype.cancel = function () {
    try {
      const e = this.effect && this.effect.target;
      W.calls.push({
        at: +(performance.now() - W.t0).toFixed(1),
        el: "CANCEL:" + String((e && ((e.getAttribute && e.getAttribute("class")) || e.tagName)) || "?").split(" ")[0],
        transforms: [this.playState],
        durationMs: null,
        easing: null,
      });
    } catch {
      /* logging must never break the surface under test */
    }
    return oCancel.call(this);
  };
  // HOW MANY SWEEPS. `moveLiveBoard` runs `boardAnimations()` twice per call (snapshot now,
  // restore in nextTick), so counting `getAnimations({subtree:true})` on `.board-peek-host`
  // counts the call sites that reached the board across one direction.
  const oGA = Element.prototype.getAnimations;
  Element.prototype.getAnimations = function (opts) {
    try {
      if (opts && opts.subtree && this.classList && this.classList.contains("board-peek-host"))
        W.calls.push({
          at: +(performance.now() - W.t0).toFixed(1),
          el: "SWEEP:board-peek-host",
          transforms: [],
          durationMs: null,
          easing: null,
        });
    } catch {
      /* logging must never break the surface under test */
    }
    return oGA.call(this, opts);
  };
  W.mark = () => {
    W.calls = [];
    W.t0 = performance.now();
    // What `runFold`'s movers look for, sampled across the ticks it runs on.
    W.probe = [];
    const look = (tag) =>
      W.probe.push({
        tag,
        at: +(performance.now() - W.t0).toFixed(1),
        boardHost: !!document.querySelector(".board-peek-host"),
        centerCard: !!document.querySelector(".game-card.is-center"),
        logo: !!document.querySelector(".logo-menu"),
        deck: !!document.querySelector(".game-gallery"),
      });
    look("t0");
    Promise.resolve().then(() => look("microtask"));
    requestAnimationFrame(() => {
      look("raf1");
      requestAnimationFrame(() => look("raf2"));
    });
    return W.t0;
  };
};

const run = async () => {
  const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext(VIEWPORTS[VIEW]);
  const page = await ctx.newPage();
  await page.addInitScript(PROBE);
  const url = `http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`;
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(2600);
  await page.evaluate(() => document.body.focus());
  const rows = [];
  for (let c = 0; c < CYCLES; c++) {
    for (const dir of ["entry", "exit"]) {
      await page.evaluate(() => window.__A7M.mark());
      await page.keyboard.press(dir === "entry" ? "g" : "Enter");
      await page.waitForTimeout(1200);
      const d = await page.evaluate(() => ({
        calls: window.__A7M.calls,
        probe: window.__A7M.probe,
      }));
      rows.push({ cycle: c, dir, engine: ENGINE, viewport: VIEW, ...d });
      await page.waitForTimeout(400);
    }
  }
  writeFileSync(
    OUT,
    JSON.stringify({ kind: "A7-mover-census", engine: ENGINE, viewport: VIEW, at: new Date().toISOString() }) +
      "\n",
  );
  for (const r of rows) appendFileSync(OUT, JSON.stringify(r) + "\n");
  await browser.close();
  for (const r of rows) {
    console.log(
      `${r.dir} c${r.cycle}: movers=${r.calls.length} [${r.calls.map((c) => `${c.el}@${c.at}ms/${c.durationMs}ms`).join(", ")}]`,
    );
    console.log(
      `   presence: ${r.probe.map((p) => `${p.tag}(board=${p.boardHost ? 1 : 0},card=${p.centerCard ? 1 : 0},deck=${p.deck ? 1 : 0})`).join(" ")}`,
    );
  }
};
run().catch((e) => {
  console.error("INSTRUMENT FAILURE:", e.message);
  process.exit(3);
});

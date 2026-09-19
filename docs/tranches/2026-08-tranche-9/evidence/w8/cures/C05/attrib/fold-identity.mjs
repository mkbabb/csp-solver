#!/usr/bin/env node
// RUN: cd web/frontend && node <thisfile> --engine chromium --throttle 4 --viewport desk --cycles 3 --port 4252 --out <out.jsonl>
// T9-W8 §8.2 cure C05 — THE ATTRIBUTION STEP THE CHARTER OWES FIRST.
//
// It is A7/fold-frames.mjs's probe with one thing added and the frame census dropped: every
// bake that lands during a fold is logged with the CAPTURE IDENTITY the library keys its stack
// cache on (`cacheKey|dpr|WxH|poseCount`, pencil-boil/dist/vue.js:471), reconstructed from the
// page without touching src/:
//   • the capture canvas's own `width`/`height` at `drawImage` time IS `round(cssW*dpr)` ×
//     `round(cssH*dpr)` (raster.js:110-111), so the css box divides straight back out;
//   • `cacheKey` is `logo-${label}-${d|l}-${vbWidth}` (HandwrittenLogo.vue:387) and every part
//     of it is in the DOM: the label is the wordmark's measuring <text>, the theme is
//     <html class>, and `vbWidth` is the rendered `viewBox`;
//   • `poseCount` is the count of pose <image>/<g> siblings.
// A ResizeObserver on the same `<svg>` logs the LAYOUT box the app latches its `captureH` from
// (rasterPose.ts §useLayoutBoxSize reads `contentRect`), so a re-key can be told from an
// eviction: a re-key moves the box first, an eviction bakes an identity the box never left.
// Attribution only: it reads a FIXED dist over an already-running preview server; it never builds.
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
const CYCLES = Number(arg("cycles", "3"));
const PORT = arg("port", "4252");
const OUT = arg("out", "/dev/stdout");
const EXIT = arg("exit", "enter");

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
  const W = (window.__C05 = { bakes: [], boxes: [], taint: [] });
  const dpr = () => (Number.isFinite(window.devicePixelRatio) ? window.devicePixelRatio : 1);
  const readLogo = () => {
    const svg = document.querySelector(".handwritten-logo");
    if (!svg) return { vb: null, label: null, poses: 0, cssH: null, scale: null };
    const t = svg.querySelector(".logo-measure");
    const cs = getComputedStyle(svg);
    return {
      vb: svg.getAttribute("viewBox"),
      label: t ? (t.textContent || "").trim() : null,
      poses:
        svg.querySelectorAll(".logo-pose-bmp").length ||
        svg.querySelectorAll(".logo-pose, .logo-pose-parked").length,
      cssH: +parseFloat(cs.height).toFixed(4),
      scale: (cs.getPropertyValue("--logo-scale") || "").trim(),
      baked: svg.querySelectorAll(".logo-pose-bmp").length > 0,
    };
  };
  W.readLogo = readLogo;
  // THE BOX THE APP LATCHES FROM. `useLayoutBoxSize` reads `contentRect`, so this is the same
  // number `captureH` sees — and it is re-armed because the `component :is` swap destroys and
  // re-creates the `<svg>` on every fold.
  let ro = null;
  let watched = null;
  let armed = false;
  const arm = () => {
    const svg = document.querySelector(".handwritten-logo");
    if (svg === watched && armed) return;
    armed = true;
    watched = svg;
    if (ro) ro.disconnect();
    if (!svg) {
      W.boxes.push({ t: +performance.now().toFixed(2), ev: "svg-gone" });
      return;
    }
    W.boxes.push({ t: +performance.now().toFixed(2), ev: "svg-new" });
    ro = new ResizeObserver(([e]) => {
      W.boxes.push({
        t: +performance.now().toFixed(2),
        ev: "rect",
        w: +e.contentRect.width.toFixed(4),
        h: +e.contentRect.height.toFixed(4),
      });
    });
    ro.observe(svg);
  };
  // A poll, not a MutationObserver on `document.documentElement`: an init script runs before
  // the document has one, and observing null throws before the bake hook below is installed.
  W.armTimer = setInterval(arm, 8);

  const proto = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (proto && proto.drawImage) {
    const orig = proto.drawImage;
    proto.drawImage = function (...a) {
      try {
        const c = this.canvas;
        const d = dpr();
        const L = readLogo();
        const dark = document.documentElement.classList.contains("dark");
        // The capture canvas is `round(cssW*dpr) x round(cssH*dpr)`; divide the ratio back out.
        const cssW = c ? +(c.width / d).toFixed(4) : null;
        const cssH = c ? +(c.height / d).toFixed(4) : null;
        const vbW = L.vb ? Number(L.vb.split(/\s+/)[2]) : null;
        // The wordmark is the only baked surface whose capture height tracks `--logo-scale`;
        // the grid is square and the celestials are small squares. Name the surface by shape.
        const surface =
          c && c.width === c.height
            ? c.width > 400
              ? "grid"
              : "celestial"
            : cssH !== null && cssW !== null && cssW > cssH
              ? "logo"
              : "other";
        W.bakes.push({
          t: +performance.now().toFixed(2),
          surface,
          canvas: c ? `${c.width}x${c.height}` : null,
          dpr: d,
          cssBox: cssW !== null ? `${cssW}x${cssH}` : null,
          // The reconstructed library key (vue.js:471 `stackKey`). `poseCount` is 4 for every
          // baked surface in this estate; the DOM count is reported beside it as the check.
          key:
            surface === "logo" && vbW !== null
              ? `logo-${L.label}-${dark ? "d" : "l"}-${vbW}|${d}|${cssW}x${cssH}|4`
              : null,
          theme: dark ? "dark" : "light",
          renderedH: L.cssH,
          logoScale: L.scale,
          domPoses: L.poses,
          baked: L.baked,
          // The other two baked surfaces' boxes, read at the same instant, so a bake that is
          // not the wordmark's can still be named: `.toggle-rest` is the celestials' capture
          // box (DarkModeToggle.vue:501) and `.board-svg`/`.hand-drawn-grid` is the grid's.
          restBox: (() => {
            const r = document.querySelector(".toggle-rest");
            if (!r) return null;
            const b = r.getBoundingClientRect();
            return `${+b.width.toFixed(2)}x${+b.height.toFixed(2)}`;
          })(),
          restCount: document.querySelectorAll(".toggle-rest").length,
        });
      } catch {
        /* the census must never break the page it reads */
      }
      return orig.apply(this, a);
    };
  }
  for (const ev of ["blur", "visibilitychange"])
    window.addEventListener(ev, () => W.taint.push({ ev, t: performance.now() }));
};

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
  const ready = await page.evaluate(BOARD_READY);
  await page.waitForTimeout(2500);
  const rows = [];
  const boot = await page.evaluate(() => ({
    bakes: window.__C05.bakes,
    boxes: window.__C05.boxes,
    logo: window.__C05.readLogo(),
  }));
  rows.push({ phase: "boot", ...boot });

  for (let c = 0; c < CYCLES; c++) {
    for (const dir of ["entry", "exit"]) {
      const t0 = await page.evaluate(() => {
        window.__C05.bakes.length = 0;
        window.__C05.boxes.length = 0;
        return performance.now();
      });
      await page.keyboard.press(dir === "entry" ? "g" : EXIT === "escape" ? "Escape" : "Enter");
      await page.waitForTimeout(1600);
      const d = await page.evaluate((t) => {
        const W = window.__C05;
        const rel = (a) => a.map((x) => ({ ...x, at: +(x.t - t).toFixed(1) }));
        return {
          bakes: rel(W.bakes),
          boxes: rel(W.boxes),
          logo: W.readLogo(),
          tainted: W.taint.length > 0,
        };
      }, t0);
      rows.push({ phase: "fold", cycle: c, dir, ...d });
      await page.waitForTimeout(500);
    }
  }
  await browser.close();

  const head = {
    kind: "C05-fold-identity",
    engine: ENGINE,
    throttle: THROTTLE,
    viewport: VIEW,
    dpr: VIEWPORTS[VIEW].deviceScaleFactor,
    port: PORT,
    boardReadyMs: ready.readyMs,
    url,
    at: new Date().toISOString(),
  };
  writeFileSync(OUT, JSON.stringify(head) + "\n");
  for (const r of rows) appendFileSync(OUT, JSON.stringify(r) + "\n");

  for (const r of rows) {
    if (r.phase === "boot") {
      const byKey = {};
      for (const b of r.bakes) byKey[b.key ?? b.surface] = (byKey[b.key ?? b.surface] ?? 0) + 1;
      console.log(`boot: ${r.bakes.length} bakes ${JSON.stringify(byKey)}`);
      console.log(`  boxes: ${r.boxes.map((b) => (b.ev === "rect" ? `${b.w}x${b.h}` : b.ev)).join(" -> ")}`);
      continue;
    }
    const logo = r.bakes.filter((b) => b.surface === "logo");
    const byKey = {};
    for (const b of logo) byKey[b.key] = (byKey[b.key] ?? 0) + 1;
    console.log(
      `c${r.cycle} ${r.dir}: bakes=${r.bakes.length} (logo ${logo.length}) at=${logo.map((b) => b.at).join(",")} keys=${JSON.stringify(byKey)}`,
    );
    console.log(
      `  boxes: ${r.boxes.map((b) => (b.ev === "rect" ? `${b.at}ms ${b.w}x${b.h}` : `${b.at}ms ${b.ev}`)).join(" | ")}`,
    );
  }
};
run().catch((e) => {
  console.error("INSTRUMENT FAILURE:", e.message);
  process.exit(3);
});

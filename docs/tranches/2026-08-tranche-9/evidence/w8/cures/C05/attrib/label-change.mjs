#!/usr/bin/env node
// RUN: cd web/frontend && node <thisfile> --port 4252 --out <out.jsonl>
// T9-W8 §8.2 cure C05, REPAIR ROUND 2 — the charter's THIRD Accept clause, measured by name:
// "a label change still bakes 4".
//
// Round 0 and round 1 asserted it by construction and never read it. This does: in the gallery
// the masthead names the SNAPPED card (App.vue `headerName`), so an ArrowRight on the deck is a
// real label change on a live wordmark — `cacheKey` is `logo-${label}-${d|l}-${vbWidth}`
// (HandwrittenLogo.vue:388), and a new label is a new key with a new measured `vbWidth`. The
// census counts the encodes that follow it, per key, on whichever arm it is pointed at.
//
// The probe and the board-ready wait below are `fold-identity.mjs`'s, copied VERBATIM (byte
// slices of that file — the header comment there describes them) so the two censuses read the
// same identity through the same hook. Attribution only: it reads a FIXED dist over an
// already-running preview server; it never builds and it never touches src/.
import { writeFileSync, appendFileSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium, webkit } = createRequire(process.cwd() + "/package.json")("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > -1 ? process.argv[i + 1] : d;
};
const ENGINE = arg("engine", "chromium");
const THROTTLE = Number(arg("throttle", "4"));
const VIEW = arg("viewport", "desk");
const PORT = arg("port", "4252");
const OUT = arg("out", "/dev/stdout");
const SNAPS = Number(arg("snaps", "3"));

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

  // Into the gallery first: the label only follows the SNAPPED card while the deck is open.
  await page.keyboard.press("g");
  await page.waitForTimeout(1600);
  const entered = await page.evaluate(() => window.__C05.readLogo());
  rows.push({ phase: "gallery-entered", logo: entered });

  await page.locator(".gallery-viewport").focus();
  for (let s = 0; s < SNAPS; s++) {
    const before = await page.evaluate(() => {
      window.__C05.bakes.length = 0;
      window.__C05.boxes.length = 0;
      return { t: performance.now(), logo: window.__C05.readLogo() };
    });
    await page.keyboard.press("ArrowRight");
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
    }, before.t);
    rows.push({ phase: "snap", snap: s, labelFrom: before.logo.label, ...d });
  }
  await browser.close();

  const head = {
    kind: "C05-label-change",
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
    if (r.phase === "gallery-entered") {
      console.log(`gallery entered: label=${r.logo.label} vb=${r.logo.vb} poses=${r.logo.poses}`);
      continue;
    }
    const logo = r.bakes.filter((b) => b.surface === "logo");
    const byKey = {};
    for (const b of logo) byKey[b.key] = (byKey[b.key] ?? 0) + 1;
    console.log(
      `snap ${r.snap}: ${r.labelFrom} -> ${r.logo.label} | logo encodes ${logo.length} at=${logo.map((b) => b.at).join(",")} keys=${JSON.stringify(byKey)} tainted=${r.tainted}`,
    );
  }
};
run().catch((e) => {
  console.error("INSTRUMENT FAILURE:", e.message);
  process.exit(3);
});

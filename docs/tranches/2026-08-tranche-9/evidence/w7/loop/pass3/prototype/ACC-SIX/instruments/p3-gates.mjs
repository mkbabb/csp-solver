#!/usr/bin/env node
/** ACC-SIX pass-3 PROTOTYPE probe 2 — the remaining gates on the real surface.
 *
 *  G0  the segment law, PAINTED on the live gauge at p = 0.05 / 0.25 / 0.50, both engines,
 *      dpr 1 and 3. The share is INKED PIXELS of the ring band, not a bounding box: the
 *      board's whole frame band is screenshotted, violet pixels are counted, and the count
 *      at p is divided by the count at p = 1. Engine agreement within 2 points is the claim.
 *  G3  print + forced-colors, through the engine's own media emulation.
 *  G5' the count on the PHONE (393x699 dpr3): toolbar top at fill 0/1/3 and after the lift,
 *      the lift's own timing, and the occlusion of trace and cells.
 *  G6  the washi seed: every instance's clip-path, --washi-tilt and bounding box, prototype
 *      vs HEAD — the declared pi on two properties, and the box delta that bounds it.
 *  G8  the off-ANCHOR share: every painted pixel of the page at C >= 0.05, binned by its
 *      distance to the six anchors, with the exception ledger named and summed.
 *  PI  the rect census over surfaces this wave does not claim.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4239";
const LABEL = process.env.LABEL || "prototype";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: BASE=… node p3-gates.mjs <out.json>");

// THE SIX ANCHORS (ACC-SIX §12) — rose, orange, gold, green, blue, the answer's violet.
const ANCHORS = [14.2, 68.7, 83.7, 147.0, 251.4, 293.0];
const KIN_DEG = 5;
const offAnchor = (h) => Math.min(...ANCHORS.map((a) => hueDist(h, a))) > KIN_DEG;

async function px(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, info, ch: info.channels };
}

/** every pixel at C >= floor, binned on/off anchor */
async function hueCensus(buf, floor = 0.05) {
  const { data, info, ch } = await px(buf);
  let on = 0,
    off = 0;
  const offHues = new Map();
  for (let i = 0; i < data.length; i += ch) {
    const o = rgbToOklch(data[i], data[i + 1], data[i + 2]);
    if (o.C < floor) continue;
    if (offAnchor(o.h)) {
      off++;
      const k = Math.round(o.h / 5) * 5;
      offHues.set(k, (offHues.get(k) || 0) + 1);
    } else on++;
  }
  const total = on + off;
  return {
    chromaticPx: total,
    onAnchorPct: total ? +((100 * on) / total).toFixed(2) : null,
    offAnchorPct: total ? +((100 * off) / total).toFixed(2) : null,
    topOffHues: [...offHues.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
    dims: [info.width, info.height],
  };
}

/** inked violet pixels in a band, for G0's painted share */
async function violetPx(buf) {
  const { data, info, ch } = await px(buf);
  let n = 0;
  for (let i = 0; i < data.length; i += ch) {
    const o = rgbToOklch(data[i], data[i + 1], data[i + 2]);
    if (o.C >= 0.08 && hueDist(o.h, 293.0) <= 25) n++;
  }
  return { inked: n, dims: [info.width, info.height] };
}

async function typeDigits(page, n) {
  for (let k = 0; k < n; k++) {
    const ok = await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !i.readOnly && !i.value,
      );
      if (!ins[0]) return false;
      ins[0].focus();
      return true;
    });
    if (!ok) return k;
    await page.keyboard.type("5");
    await page.waitForTimeout(170);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  return n;
}

const rows = { meta: { base: BASE, label: LABEL, control: "74a2b5d9" }, cells: {} };

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();

  /* ══ desk, both themes ══ */
  for (const scheme of ["light", "dark"]) {
    const cell = `${eng}/${scheme}/desk`;
    const R = (rows.cells[cell] = {});
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      colorScheme: scheme,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1200);

    /* ── G8 · the off-anchor share, whole page, no gauge yet ── */
    R.offAnchorAt0 = await hueCensus(await page.screenshot({ type: "png" }));

    /* ── G6 · the washi census ── */
    R.washi = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll(".washi-label"));
      return els.map((e) => {
        const cs = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        return {
          text: (e.textContent || "").trim().slice(0, 24),
          clip: cs.clipPath,
          tilt: cs.getPropertyValue("--washi-tilt").trim(),
          box: [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)],
        };
      });
    });

    /* ── PI · the rect census on surfaces this wave does not claim ── */
    R.rects = await page.evaluate(() => {
      const sel = [
        ".board-wrapper",
        ".sudoku-cell",
        ".icon-btn",
        ".controls-card",
        ".masthead",
        ".logo-text",
        ".staging-band",
        ".board-voice",
        ".dt-svg",
      ];
      const out = {};
      for (const s of sel)
        out[s] = Array.from(document.querySelectorAll(s)).map((e) => {
          const r = e.getBoundingClientRect();
          return [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)];
        });
      return out;
    });

    /* ── G0 · the painted share on the LIVE gauge ── */
    const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const band = {
      x: Math.round(box.x - 8),
      y: Math.round(box.y - 8),
      width: Math.round(box.width + 16),
      height: Math.round(box.height + 16),
    };
    R.g0 = {};
    for (const dpr of [1, 3]) {
      const c2 = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: dpr,
        colorScheme: scheme,
        reducedMotion: "reduce",
      });
      const p2 = await c2.newPage();
      await p2.goto(`${BASE}/?size=3&difficulty=EASY`);
      await p2.waitForSelector(".sudoku-cell", { timeout: 60000 });
      await p2.waitForTimeout(1000);
      const b2 = await p2.locator("svg.hand-drawn-grid").first().boundingBox();
      const band2 = {
        x: Math.round(b2.x - 8),
        y: Math.round(b2.y - 8),
        width: Math.round(b2.width + 16),
        height: Math.round(b2.height + 16),
      };
      // Force the gauge to an exact fraction through the SAME prop path the game uses,
      // by writing digits — but the fractions we want are finer than 1/20, so the gauge is
      // driven directly on the rendered nodes instead, one declaration form for both trees:
      // prototype = the `d` is already a front; HEAD = the dash offset is the front.
      const arms = {};
      for (const f of [0.05, 0.25, 0.5, 1.0]) {
        await p2.evaluate((frac) => {
          const g = document.querySelector("#acc6-g0") || document.createElement("div");
          g.id = "acc6-g0";
          document.body.appendChild(g);
          window.__acc6 = frac;
        }, f);
        // drive the product's own number: write digits until valuenow/valuemax >= f
        const got = await p2.evaluate(async (frac) => {
          const bar = document.querySelector('[role="progressbar"]');
          const max = +bar.getAttribute("aria-valuemax");
          const isCount = max !== 100;
          const want = Math.round(frac * (isCount ? max : 100));
          return { want, max, isCount, now: +bar.getAttribute("aria-valuenow") };
        }, f);
        const need = Math.max(0, got.want - got.now);
        if (need > 0) await typeDigits(p2, Math.min(need, 81));
        await p2.waitForTimeout(700);
        const shot = await p2.screenshot({ clip: band2, type: "png" });
        const v = await violetPx(shot);
        const now = await p2.evaluate(() => {
          const b = document.querySelector('[role="progressbar"]');
          return { now: b.getAttribute("aria-valuenow"), max: b.getAttribute("aria-valuemax") };
        });
        arms[f] = { ...v, ...now };
      }
      const full = arms[1.0].inked || 1;
      R.g0[`dpr${dpr}`] = Object.fromEntries(
        Object.entries(arms).map(([f, a]) => [
          f,
          { ...a, sharePct: +((100 * a.inked) / full).toFixed(2) },
        ]),
      );
      await c2.close();
    }

    /* ── G8' · the off-anchor share WITH the gauge and a written digit ── */
    await typeDigits(page, 2);
    await page.waitForTimeout(800);
    R.offAnchorAt2 = await hueCensus(await page.screenshot({ type: "png" }));

    /* ── G8'' · the moved-anchor negative control ── */
    R.movedAnchorControl = await (async () => {
      const shot = await page.screenshot({ type: "png" });
      const { data, info, ch } = await px(shot);
      const moved = [14.2, 68.7, 83.7, 147.0, 251.4, 299.0]; // the violet moved 6 degrees
      let on = 0,
        off = 0;
      for (let i = 0; i < data.length; i += ch) {
        const o = rgbToOklch(data[i], data[i + 1], data[i + 2]);
        if (o.C < 0.05) continue;
        if (Math.min(...moved.map((a) => hueDist(o.h, a))) > KIN_DEG) off++;
        else on++;
      }
      return { offAnchorPct: +((100 * off) / (on + off)).toFixed(2) };
    })();

    /* ── G3 · print and forced-colors ── */
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(250);
    R.print = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const m = document.querySelector(".board-margin");
      return {
        traceStroke: t ? getComputedStyle(t).stroke : null,
        marginDisplay: m ? getComputedStyle(m).display : null,
        attributionRule: [...document.styleSheets]
          .flatMap((s) => {
            try {
              return [...s.cssRules];
            } catch {
              return [];
            }
          })
          .some((r) => (r.cssText || "").includes(".attribution-tape")),
      };
    });
    await page.emulateMedia({ media: "screen", forcedColors: "active" });
    await page.waitForTimeout(250);
    R.forced = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      return { traceStroke: t ? getComputedStyle(t).stroke : null };
    });
    await page.emulateMedia({ media: "screen", forcedColors: "none" });

    await ctx.close();
    console.error(`  done ${cell}`);
  }

  /* ══ phone, light — G5's layout half ══ */
  {
    const cell = `${eng}/light/phone`;
    const R = (rows.cells[cell] = {});
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 699 },
      deviceScaleFactor: 3,
      hasTouch: true,
      isMobile: true,
      colorScheme: "light",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1400);

    const geom = () =>
      page.evaluate(() => {
        const meta = document.querySelector(".margin-note-meta");
        const strip = document.querySelector(".board-margin");
        const after = strip?.nextElementSibling;
        const bar = document.querySelector('[role="progressbar"]');
        const L = meta?.getBoundingClientRect();
        const over = (r) =>
          !L
            ? 0
            : Math.max(0, Math.min(L.right, r.right) - Math.max(L.left, r.left)) *
              Math.max(0, Math.min(L.bottom, r.bottom) - Math.max(L.top, r.top));
        const trace = document.querySelector(".progress-trace");
        const cells = Array.from(document.querySelectorAll(".sudoku-cell"));
        return {
          drawn: meta ? meta.textContent.trim() : null,
          valuetext: bar?.getAttribute("aria-valuetext") ?? null,
          stripBottom: strip ? +strip.getBoundingClientRect().bottom.toFixed(2) : null,
          stripHeight: strip ? +strip.getBoundingClientRect().height.toFixed(2) : null,
          nextTop: after ? +after.getBoundingClientRect().top.toFixed(2) : null,
          nextClass: after ? after.className : null,
          traceOverlapPx2: trace ? +over(trace.getBoundingClientRect()).toFixed(2) : null,
          cellOverlapPx2: +cells.reduce((s, c) => s + over(c.getBoundingClientRect()), 0).toFixed(2),
          boardBottom: +(
            document.querySelector("svg.hand-drawn-grid")?.getBoundingClientRect().bottom ?? 0
          ).toFixed(2),
        };
      });

    R.at0 = await geom();
    await typeDigits(page, 1);
    await page.waitForTimeout(500);
    R.at1 = await geom();
    await typeDigits(page, 2);
    await page.waitForTimeout(200);
    R.at3 = await geom();
    await page.waitForTimeout(700); // one write-in band (250) + chromeLeave (200) + slack
    R.afterLift = await geom();
    await ctx.close();
    console.error(`  done ${cell}`);
  }

  await browser.close();
}

writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);

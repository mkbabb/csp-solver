#!/usr/bin/env node
/** ACC-SIX pass-3 PROTOTYPE probe — the painted gates, on the real surface.
 *
 *  Runs against EITHER dist server (BASE env): the prototype (:4239, this worktree's own
 *  build) or the HEAD control (:4240, `git archive 74a2b5d9` built with its own cacheDir).
 *  Every board colour is pixels through a `sharp` byte read-back off a real screenshot —
 *  never a computed style — and every computed-style read waits out the tweens.
 *
 *  The modal-of-run core, the ground extraction and the ratio maths are ACC-FIVE's pass-3
 *  instrument, consumed verbatim (the section's one scanner). What differs is the SUBJECT:
 *  the violet at alpha 1 rather than the gold, the six-anchor hue window, the count line and
 *  its spoken twin, and the washi seed.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4239";
const LABEL = process.env.LABEL || "prototype";
const ONLY = process.env.ONLY || "";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: BASE=… node p3-paint.mjs <out.json>");

const lum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};
const VIOLET = 293.0;
const BLUE = { light: 251.4, dark: 249.3 };

async function grid(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const at = (x, y) => {
    const o = (y * info.width + x) * ch;
    return [data[o], data[o + 1], data[o + 2]];
  };
  return { at, w: info.width, h: info.height };
}

function groundOf(img, scheme) {
  const freq = new Map();
  let line = null;
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++) {
      const rgb = img.at(x, y);
      const o = rgbToOklch(...rgb);
      const k = rgb.join(",");
      freq.set(k, (freq.get(k) || 0) + 1);
      if (o.C > 0.03) continue;
      const better = scheme === "light" ? !line || o.L < line.L : !line || o.L > line.L;
      if (better) line = { rgb, ...o };
    }
  const paper = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  return { paper, line: line && { rgb: line.rgb, L: +line.L.toFixed(4) } };
}

function modalCore(img, cols = 24) {
  const per = [];
  let max = null;
  const step = Math.max(1, Math.floor(img.w / cols));
  for (let c = 0; c < cols; c++) {
    const x = Math.min(img.w - 1, c * step);
    let best = null;
    for (let y = 0; y < img.h; y++) {
      const rgb = img.at(x, y);
      const o = rgbToOklch(...rgb);
      if (!best || o.C > best.C) best = { rgb, ...o };
      if (!max || o.C > max.C) max = { rgb, ...o };
    }
    if (best) per.push(best);
  }
  const freq = new Map();
  for (const p of per) freq.set(p.rgb.join(","), (freq.get(p.rgb.join(",")) || 0) + 1);
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  const rgb = ranked[0][0].split(",").map(Number);
  const o = rgbToOklch(...rgb);
  return {
    columns: per.length,
    modal: { rgb, C: +o.C.toFixed(3), L: +o.L.toFixed(4), h: +o.h.toFixed(1) },
    modalCount: ranked[0][1],
    distinct: ranked.length,
    maxChroma: max && { rgb: max.rgb, C: +max.C.toFixed(3), h: +max.h.toFixed(1) },
  };
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
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  return n;
}

const readCount = (page) =>
  page.evaluate(() => {
    const meta = document.querySelector(".margin-note-meta");
    const bar = document.querySelector('[role="progressbar"]');
    return {
      drawn: meta ? meta.textContent.trim() : null,
      drawnAriaHidden: meta ? meta.getAttribute("aria-hidden") : null,
      valuetext: bar?.getAttribute("aria-valuetext") ?? null,
      valuenow: bar?.getAttribute("aria-valuenow") ?? null,
      valuemax: bar?.getAttribute("aria-valuemax") ?? null,
      label: bar?.getAttribute("aria-label") ?? null,
    };
  });

const toolbarTop = (page) =>
  page.evaluate(() => {
    const t =
      document.querySelector(".fold-tools") ||
      document.querySelector(".controls-card") ||
      document.querySelector(".play-controls");
    return t ? +t.getBoundingClientRect().top.toFixed(2) : null;
  });

const rows = { meta: { base: BASE, label: LABEL, control: "74a2b5d9" }, cells: {} };

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  if (ONLY && ONLY !== eng) continue;
  const browser = await launcher.launch();
  for (const scheme of ["light", "dark"]) {
    const cell = `${eng}/${scheme}`;
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

    const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const strip = (x0, x1) => ({
      x: Math.round(box.x + box.width * x0),
      y: Math.round(box.y - 10),
      width: Math.max(2, Math.round(box.width * (x1 - x0))),
      height: 26,
    });
    const shot = (clip) => page.screenshot({ clip, type: "png" });

    R.traceNodesAt0 = await page.evaluate(
      () => document.querySelectorAll(".progress-trace").length,
    );
    R.countAt0 = await readCount(page);
    R.toolbarTopAt0 = await toolbarTop(page);
    const g0 = await grid(await shot(strip(0.15, 0.55)));
    R.ground = groundOf(g0, scheme);

    await typeDigits(page, 1);
    await page.waitForTimeout(500);
    R.countAt1 = await readCount(page);
    R.toolbarTopAt1 = await toolbarTop(page);
    R.occlusion = await page.evaluate(() => {
      const meta = document.querySelector(".margin-note-meta");
      if (!meta) return { line: null };
      const L = meta.getBoundingClientRect();
      const over = (r) =>
        Math.max(0, Math.min(L.right, r.right) - Math.max(L.left, r.left)) *
        Math.max(0, Math.min(L.bottom, r.bottom) - Math.max(L.top, r.top));
      const trace = document.querySelector(".progress-trace");
      const cells = Array.from(document.querySelectorAll(".sudoku-cell"));
      return {
        line: {
          x: +L.x.toFixed(2),
          y: +L.y.toFixed(2),
          w: +L.width.toFixed(2),
          h: +L.height.toFixed(2),
        },
        traceOverlapPx2: trace ? +over(trace.getBoundingClientRect()).toFixed(2) : null,
        cellOverlapPx2: +cells.reduce((s, c) => s + over(c.getBoundingClientRect()), 0).toFixed(2),
        cellsCounted: cells.length,
      };
    });

    await typeDigits(page, 1);
    await page.waitForTimeout(900);
    R.countAt2 = await readCount(page);

    R.geom = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const f = document.querySelector(".frame-line");
      const svg = document.querySelector("svg.hand-drawn-grid");
      const r = svg?.getBoundingClientRect();
      const seg = (el) => (el?.getAttribute("d")?.match(/[ML]/gi) || []).length;
      const cs = t && getComputedStyle(t);
      return {
        boardCssPx: r ? +r.width.toFixed(2) : null,
        traceSegments: seg(t),
        frameSegments: seg(f),
        traceStrokeOpacity: cs ? cs.strokeOpacity : null,
        traceStroke: cs ? cs.stroke : null,
        traceStrokeWidth: cs ? cs.strokeWidth : null,
        traceNodes: document.querySelectorAll(".progress-trace").length,
        hasPathLength: !!t?.getAttribute("pathLength"),
        hasDashAttr: !!t?.getAttribute("stroke-dasharray"),
        computedDash: cs ? cs.strokeDasharray : null,
      };
    });

    const gB = await grid(await shot(strip(0.15, 0.55)));
    const core = modalCore(gB, 24);
    R.corridorPainted = {
      ...core,
      vsLine: ratio(core.modal.rgb, R.ground.line.rgb),
      vsPaper: ratio(core.modal.rgb, R.ground.paper),
      worst: Math.min(
        ratio(core.modal.rgb, R.ground.line.rgb),
        ratio(core.modal.rgb, R.ground.paper),
      ),
      dHueFromViolet: +hueDist(core.modal.h, VIOLET).toFixed(2),
      maxChromaVsLine: ratio(core.maxChroma.rgb, R.ground.line.rgb),
      maxChromaVsPaper: ratio(core.maxChroma.rgb, R.ground.paper),
    };

    await page.evaluate(() => {
      const s = document.createElement("style");
      s.id = "acc6-alpha-ctl";
      s.textContent = `.progress-trace { stroke-opacity: 0.95 !important; }`;
      document.head.appendChild(s);
    });
    await page.waitForTimeout(280);
    const g95 = await grid(await shot(strip(0.15, 0.55)));
    const c95 = modalCore(g95, 24);
    R.alpha095Control = {
      modal: c95.modal,
      vsLine: ratio(c95.modal.rgb, R.ground.line.rgb),
      vsPaper: ratio(c95.modal.rgb, R.ground.paper),
    };
    await page.evaluate(() => document.getElementById("acc6-alpha-ctl")?.remove());
    await page.waitForTimeout(200);

    if (scheme === "light") {
      await page.evaluate(() => {
        const s = document.createElement("style");
        s.id = "acc6-escape";
        s.textContent = `:root { --color-progress-ink: #9b74f7 !important; }`;
        document.head.appendChild(s);
      });
      await page.waitForTimeout(320);
      const gE = await grid(await shot(strip(0.15, 0.55)));
      const cE = modalCore(gE, 24);
      R.escapeRungPainted = {
        modal: cE.modal,
        vsLine: ratio(cE.modal.rgb, R.ground.line.rgb),
        vsPaper: ratio(cE.modal.rgb, R.ground.paper),
        worst: Math.min(
          ratio(cE.modal.rgb, R.ground.line.rgb),
          ratio(cE.modal.rgb, R.ground.paper),
        ),
        dHueFromViolet: +hueDist(cE.modal.h, VIOLET).toFixed(2),
      };
      await page.evaluate(() => document.getElementById("acc6-escape")?.remove());
      await page.waitForTimeout(200);
    }

    const digitBox = await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input"));
      const mine = ins.find((i) => !i.readOnly && i.value);
      if (!mine) return null;
      const r = mine.closest(".sudoku-cell").getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    if (digitBox) {
      const gd = await grid(
        await shot({
          x: Math.round(digitBox.x + 2),
          y: Math.round(digitBox.y + 2),
          width: Math.round(digitBox.width - 4),
          height: Math.round(digitBox.height - 4),
        }),
      );
      let best = null;
      for (let y = 0; y < gd.h; y++)
        for (let x = 0; x < gd.w; x++) {
          const rgb = gd.at(x, y);
          const o = rgbToOklch(...rgb);
          if (!best || o.C > best.C) best = { rgb, ...o };
        }
      R.digit = {
        painted: best && {
          rgb: best.rgb,
          C: +best.C.toFixed(3),
          L: +best.L.toFixed(3),
          h: +best.h.toFixed(1),
        },
        dHueFromCrayonBlue: best && +hueDist(best.h, BLUE[scheme]).toFixed(2),
        vsCellGround: best && ratio(best.rgb, gd.at(1, 1)),
        resolvedStroke: await page.evaluate(() => {
          const ins = Array.from(document.querySelectorAll(".sudoku-cell input"));
          const mine = ins.find((i) => !i.readOnly && i.value);
          const p = mine?.closest(".sudoku-cell")?.querySelector(".glyph-svg path");
          return p ? getComputedStyle(p).stroke : null;
        }),
        userInkToken: await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim(),
        ),
      };
    }

    R.glow = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const icon = document.querySelector(".sparkle-icon");
      return {
        soft: cs.getPropertyValue("--sparkle-glow-soft").trim(),
        strong: cs.getPropertyValue("--sparkle-glow-strong").trim(),
        pale: cs.getPropertyValue("--color-answer-pale").trim(),
        filter: icon ? getComputedStyle(icon).filter : null,
        transition: icon ? getComputedStyle(icon).transition : null,
      };
    });

    await ctx.close();
    console.error(`  done ${cell}`);
  }
  await browser.close();
}

writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);

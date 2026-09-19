#!/usr/bin/env node
/** ACC-FIVE pass-3 PROTOTYPE probe — the painted gates, on the real surface.
 *
 *  Runs against EITHER server (BASE env): the prototype (:4236, this worktree) or the HEAD
 *  control (:4237, `git archive 74a2b5d9`). Every board colour is pixels through a canvas
 *  byte read-back off a real screenshot — never a computed style — and every computed-style
 *  read waits out the tweens.
 *
 *  ARMS
 *  A  GROUND, uncontaminated by construction: at progress 0 the trace's v-for yields nothing,
 *     so the frame line and the paper are read off a board that has no gauge on it at all.
 *  B  THE CORRIDOR, PAINTED (G2): the MODAL-OF-RUN core over 24 columns spread along the top
 *     edge — each column contributes its own most-chromatic pixel, and the mode of those 24 is
 *     the reading. The single max-chroma pixel is reported beside it (it runs 0.07-0.09 higher,
 *     and the margin is what survives EITHER instrument).
 *  C  THE ALPHA (G2): the computed stroke-opacity, plus the same painted hexes forced back to
 *     0.95 as the control.
 *  D  THE WIN (G3): the board is SOLVED through the product's own Solve button, then the band's
 *     median OKLCH L and the post-win computed stroke are read at 900/1800/2700/3600/5000 ms.
 *     The ablation arm re-states the dead rule INSIDE an earlier layer (@layer base), which is
 *     the only way to beat an `!important` in `utilities`.
 *  E  THE DIGIT (G6): a cell is TYPED INTO and the painted glyph stroke of that cell is read —
 *     never a given's (the pass-2 probe's own miss, which the critique closed).
 *  F  GEOMETRY: segments, painted stroke widths, the graphite flank, the trace node count.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4236";
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
const GOLD = { light: 83.7, dark: 95.2 };
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

/** the modal colour (paper) and the achromatic extreme (frame line) of a strip */
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

/** THE MODAL-OF-RUN CORE over N columns: per column the most chromatic pixel, then the mode. */
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
  for (const p of per) {
    const k = p.rgb.join(",");
    freq.set(k, (freq.get(k) || 0) + 1);
  }
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  const rgb = ranked[0][0].split(",").map(Number);
  const o = rgbToOklch(...rgb);
  return {
    columns: per.length,
    modal: { rgb, C: +o.C.toFixed(3), L: +o.L.toFixed(4), h: +o.h.toFixed(1) },
    modalCount: ranked[0][1],
    distinct: ranked.length,
    maxChroma: max && {
      rgb: max.rgb,
      C: +max.C.toFixed(3),
      L: +max.L.toFixed(4),
      h: +max.h.toFixed(1),
    },
    bandMedianL: +per
      .map((p) => p.L)
      .sort((a, b) => a - b)[per.length >> 1].toFixed(4),
  };
}

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
    // a band across the TOP frame edge, where the front is at a low fill
    const strip = (x0, x1) => ({
      x: Math.round(box.x + box.width * x0),
      y: Math.round(box.y - 10),
      width: Math.max(2, Math.round(box.width * (x1 - x0))),
      height: 26,
    });
    const shot = (clip) => page.screenshot({ clip, type: "png" });

    /* ── A · the ground, on a board with NO gauge ── */
    R.traceNodesAt0 = await page.evaluate(
      () => document.querySelectorAll(".progress-trace").length,
    );
    const g0 = await grid(await shot(strip(0.15, 0.55)));
    R.ground = groundOf(g0, scheme);

    /* ── two digits, so the front lands mid-top-edge ── */
    for (let k = 0; k < 2; k++) {
      const ok = await page.evaluate(() => {
        const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
          (i) => !i.readOnly && !i.value,
        );
        if (!ins[0]) return false;
        ins[0].focus();
        return true;
      });
      if (!ok) break;
      await page.keyboard.type("5");
      await page.waitForTimeout(160);
    }
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.waitForTimeout(900);

    R.valuenow = await page.evaluate(() => {
      const el = document.querySelector('[role="progressbar"]');
      return el ? el.getAttribute("aria-valuenow") : null;
    });

    /* ── F · geometry, and C's computed alpha ── */
    R.geom = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const f = document.querySelector(".frame-line");
      const svg = document.querySelector("svg.hand-drawn-grid");
      const r = svg?.getBoundingClientRect();
      const seg = (el) => (el?.getAttribute("d")?.match(/[ML]/gi) || []).length;
      const cs = t && getComputedStyle(t);
      return {
        boardCssPx: r ? +r.width.toFixed(2) : null,
        viewBox: svg?.getAttribute("viewBox"),
        traceSegments: seg(t),
        frameSegments: seg(f),
        traceStrokeUnits: cs ? +cs.strokeWidth.replace("px", "") : null,
        frameStrokeUnits: f ? +getComputedStyle(f).strokeWidth.replace("px", "") : null,
        traceStrokeOpacity: cs ? cs.strokeOpacity : null,
        frameStrokeOpacity: f ? getComputedStyle(f).strokeOpacity : null,
        traceStroke: cs ? cs.stroke : null,
        traceNodes: document.querySelectorAll(".progress-trace").length,
        hasPathLength: !!t?.getAttribute("pathLength"),
        hasDash: !!t?.getAttribute("stroke-dasharray"),
      };
    });

    /* ── B · THE CORRIDOR, PAINTED: modal-of-run core over 24 columns ── */
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
      dHueFromCrayonGold: +hueDist(core.modal.h, GOLD[scheme]).toFixed(2),
      maxChromaVsLine: ratio(core.maxChroma.rgb, R.ground.line.rgb),
      maxChromaVsPaper: ratio(core.maxChroma.rgb, R.ground.paper),
    };

    /* ── C · THE ALPHA CONTROL: the same ink forced back to 0.95 ── */
    await page.evaluate(() => {
      const s = document.createElement("style");
      s.id = "acc5-alpha-ctl";
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
    await page.evaluate(() => document.getElementById("acc5-alpha-ctl")?.remove());
    await page.waitForTimeout(200);

    /* ── E · THE DIGIT: the cell we TYPED into, painted ── */
    const digitBox = await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input"));
      const mine = ins.find((i) => !i.readOnly && i.value);
      if (!mine) return null;
      const c = mine.closest(".sudoku-cell");
      const r = c.getBoundingClientRect();
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
      const cardRgb = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        return [cs.getPropertyValue("--color-card"), cs.getPropertyValue("--color-background")];
      });
      R.digit = {
        painted: best && {
          rgb: best.rgb,
          C: +best.C.toFixed(3),
          L: +best.L.toFixed(3),
          h: +best.h.toFixed(1),
        },
        dHueFromCrayonBlue: best && +hueDist(best.h, BLUE[scheme]).toFixed(2),
        vsCellGround: best && ratio(best.rgb, gd.at(1, 1)),
        tokens: cardRgb,
        resolvedStroke: await page.evaluate(() => {
          const ins = Array.from(document.querySelectorAll(".sudoku-cell input"));
          const mine = ins.find((i) => !i.readOnly && i.value);
          const p = mine?.closest(".sudoku-cell")?.querySelector(".glyph-svg path");
          return p ? getComputedStyle(p).stroke : null;
        }),
      };
    }

    /* ── D · THE WIN: solved through the product's own button ── */
    const solved = await page.evaluate(async () => {
      const b = document.querySelector('[aria-label="Solve puzzle"]');
      if (!b) return false;
      b.click();
      return true;
    });
    if (solved) {
      R.win = { clicked: true, samples: [] };
      let prev = 0;
      for (const ms of [900, 1800, 2700, 3600, 5000]) {
        await page.waitForTimeout(ms - prev);
        prev = ms;
        const st = await page.evaluate(() => {
          const t = document.querySelector(".progress-trace");
          const host = document.querySelector(".solve-success");
          return {
            hasSolveSuccess: !!host,
            stroke: t ? getComputedStyle(t).stroke : null,
            goldStar: getComputedStyle(document.documentElement)
              .getPropertyValue("--color-gold-star")
              .trim(),
            crayonGold: getComputedStyle(document.documentElement)
              .getPropertyValue("--color-crayon-gold")
              .trim(),
            traceNodes: document.querySelectorAll(".progress-trace").length,
          };
        });
        const gw = await grid(await shot(strip(0.15, 0.55)));
        const cw = modalCore(gw, 24);
        R.win.samples.push({
          ms,
          ...st,
          modal: cw.modal,
          bandMedianL: cw.bandMedianL,
          vsLine: ratio(cw.modal.rgb, R.ground.line.rgb),
          vsPaper: ratio(cw.modal.rgb, R.ground.paper),
          dHueFromCrayonGold: +hueDist(cw.modal.h, GOLD[scheme]).toFixed(2),
        });
      }
      // THE LAYERED ABLATION: re-state the DEAD rule inside an EARLIER layer, which is the
      // only way an !important in `utilities` can be beaten. If the win's gold is really
      // carried by this trace, the band collapses; if it is carried by something else, dL 0.
      await page.evaluate(() => {
        const s = document.createElement("style");
        s.id = "acc5-ablate";
        s.textContent = `@layer base { .solve-success .progress-trace { opacity: 0 !important; } }`;
        document.head.appendChild(s);
      });
      await page.waitForTimeout(900);
      const ga = await grid(await shot(strip(0.15, 0.55)));
      const ca = modalCore(ga, 24);
      R.win.ablationLayered = {
        modal: ca.modal,
        bandMedianL: ca.bandMedianL,
        dL: +(
          ca.bandMedianL - R.win.samples[R.win.samples.length - 1].bandMedianL
        ).toFixed(4),
      };
      await page.evaluate(() => document.getElementById("acc5-ablate")?.remove());
    } else {
      R.win = { clicked: false, note: "no [aria-label='Solve puzzle'] on this surface" };
    }

    await ctx.close();
    console.error(`  done ${cell}`);
  }
  await browser.close();
}

writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);

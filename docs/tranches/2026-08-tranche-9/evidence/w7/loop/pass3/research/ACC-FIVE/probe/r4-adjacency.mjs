#!/usr/bin/env node
/** ACC-FIVE pass-3 RESEARCH r4 — WHAT THE GOLD IS ACTUALLY NEXT TO, AND WHAT IT IS.
 *
 *  r2 proved two instrument faults worth curing before any ink is chosen:
 *   (1) "the frame line" read as the achromatic EXTREME of a 26 px strip catches whatever
 *       else is dark (chromium light returned 10,10,10 — the card's own edge, not the line),
 *       and (2) "the trace core" read as the MOST CHROMATIC pixel is not a fixed pixel, so
 *       two inks are not compared at the same place.
 *
 *  This probe fixes both by taking the SAME COLUMN twice: once at `progress === 0`, where
 *  HandDrawnGrid mounts no trace at all, and once with the front past it. Per column:
 *    · the frame line's own painted run, from the BEFORE image — the ground, at that x.
 *    · the gold's run in the AFTER image, and its MODAL value — the core, at that x.
 *    · what survives of the graphite beside the gold — the flank, in pixels. This is the
 *      1.4.11 question stated as geometry: if the flank is 0, the line is not an adjacent
 *      colour there and the operative ground is the card; if it is not, it is.
 *  Both engines, both themes, three inks x two alphas.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node r4-adjacency.mjs <out.json>");

const lum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};
const GOLD = { light: 83.7, dark: 95.2 };
const INKS = {
  light: [
    ["pass2", "#a47903"],
    ["corridor", "#a87e13"],
    ["deeper", "#9e7a26"],
  ],
  dark: [
    ["pass2", "#7d6902"],
    ["corridor", "#79650f"],
    ["balanced", "#75662c"],
  ],
};
const ALPHAS = [0.95, 1];

async function img(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  return {
    w: info.width,
    h: info.height,
    at: (x, y) => {
      const o = (y * info.width + x) * ch;
      return [data[o], data[o + 1], data[o + 2]];
    },
  };
}
const modal = (arr) => {
  const f = new Map();
  for (const v of arr) f.set(v.join(","), (f.get(v.join(",")) || 0) + 1);
  return [...f.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
};

const rows = { cells: {}, meta: { base: BASE, control: "74a2b5d9" } };

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const scheme of (process.env.SCHEMES || "light,dark").split(",")) {
    const cell = `${eng}/${scheme}`;
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      colorScheme: scheme,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1300);
    const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    // a strip well inside the front's reach at ~10% and well inside the board's own box
    const clip = {
      x: Math.round(box.x + box.width * 0.18),
      y: Math.round(box.y),
      width: Math.round(box.width * 0.14),
      height: 20,
    };
    const shot = () => page.screenshot({ clip, type: "png" });

    const before = await img(await shot());
    const paper = modal(
      Array.from({ length: before.w }, (_, x) => before.at(x, before.h - 2)),
    );
    // the line's run per column, from the BEFORE image: contiguous pixels that are neither
    // paper nor within 6 of it
    const lineRun = (im, x) => {
      const ys = [];
      for (let y = 0; y < im.h; y++) {
        const p = im.at(x, y);
        if (Math.abs(lum(p) - lum(paper)) > 0.03 && rgbToOklch(...p).C < 0.04) ys.push(y);
      }
      return ys;
    };
    // THE INK'S OWN HUE, not merely "chromatic": the first typed digit's blue glyph lands
    // inside this strip on some deals, and a bare C>=0.05 test read the PEN as the gauge
    // (chromium/light, run 1: core 37,99,235 = #2563EB). Named, cured, and the cure is a
    // hue window around the ink under test.
    let inkHue = 0;
    const goldRun = (im, x) => {
      const ys = [];
      for (let y = 0; y < im.h; y++) {
        const o = rgbToOklch(...im.at(x, y));
        if (o.C >= 0.05 && hueDist(o.h, inkHue) <= 45) ys.push(y);
      }
      return ys;
    };

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
      await page.waitForTimeout(140);
    }
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.waitForTimeout(700);

    const inks = [];
    for (const [name, hexv] of INKS[scheme]) {
      inkHue = rgbToOklch(
        ...[1, 3, 5].map((i) => parseInt(hexv.slice(i, i + 2), 16)),
      ).h;
      for (const alpha of ALPHAS) {
        await page.evaluate(
          ({ hexv, alpha }) => {
            document.documentElement.style.setProperty("--color-progress-ink", hexv);
            let s = document.getElementById("acc5-alpha");
            if (!s) {
              s = document.createElement("style");
              s.id = "acc5-alpha";
              document.head.appendChild(s);
            }
            s.textContent = `.progress-trace { stroke-opacity: ${alpha} !important; }`;
          },
          { hexv, alpha },
        );
        await page.waitForTimeout(280);
        const after = await img(await shot());
        const cols = [];
        for (let x = 2; x < after.w - 2; x += 3) {
          const L = lineRun(before, x);
          const G = goldRun(after, x);
          if (!G.length) continue;
          const lineVal = L.length ? modal(L.map((y) => before.at(x, y))) : null;
          const core = modal(G.map((y) => after.at(x, y)));
          // graphite that survives in the AFTER image at this column
          const flank = lineRun(after, x).filter((y) => !G.includes(y));
          cols.push({
            x,
            lineYs: L.length ? [L[0], L.at(-1)] : null,
            goldYs: [G[0], G.at(-1)],
            lineVal,
            core,
            goldPx: G.length,
            flankPx: flank.length,
            flankVal: flank.length ? modal(flank.map((y) => after.at(x, y))) : null,
          });
        }
        const med = (a) => a.slice().sort((p, q) => p - q)[a.length >> 1];
        const cores = cols.map((c) => c.core);
        const coreModal = modal(cores);
        const lineVals = cols.map((c) => c.lineVal).filter(Boolean);
        const lineModal = lineVals.length ? modal(lineVals) : null;
        const flankVals = cols.map((c) => c.flankVal).filter(Boolean);
        inks.push({
          name,
          hex: hexv,
          alpha,
          columns: cols.length,
          coreModal,
          coreHue: +rgbToOklch(...coreModal).h.toFixed(1),
          dHueFromCrayonGold: +hueDist(rgbToOklch(...coreModal).h, GOLD[scheme]).toFixed(2),
          lineModal,
          paper,
          medianGoldPx: med(cols.map((c) => c.goldPx)),
          medianFlankPx: med(cols.map((c) => c.flankPx)),
          flankModal: flankVals.length ? modal(flankVals) : null,
          columnsWithNoFlank: cols.filter((c) => c.flankPx === 0).length,
          vsLine: lineModal ? ratio(coreModal, lineModal) : null,
          vsFlank: flankVals.length ? ratio(coreModal, modal(flankVals)) : null,
          vsPaper: ratio(coreModal, paper),
          sampleColumns: cols.slice(0, 4),
        });
        const r = inks.at(-1);
        console.log(
          `  ${cell} ${name} ${hexv} a=${alpha}: core ${coreModal} line ${lineModal} flank ${r.medianFlankPx}px/${r.flankModal} | vsLine ${r.vsLine} vsFlank ${r.vsFlank} vsPaper ${r.vsPaper}`,
        );
      }
    }
    rows.cells[cell] = { clip, paper, inks };
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.log("banked", OUT);
console.log("EXIT_OK");

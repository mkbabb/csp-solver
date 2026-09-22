#!/usr/bin/env node
/** ACC-SIX pass-4 — THE ESCAPE BYTE, RE-READ ON ONE GROUND, IN ONE RUN.
 *
 * The pass-3 critique's §2.3: the trigger reading (3.072) was taken against a line ground of
 * gray 49 and the escape's (5.878) against gray 10 — two grounds, one of them a given's glyph
 * that had wandered into the strip. This instrument reads BOTH rungs, plus whatever the tree
 * ships, in ONE run, from ONE screenshot geometry, against ONE ground, with the glyph pixels
 * MASKED OUT of the ground extraction.
 *
 * THE GROUND, PINNED (this is the whole cure):
 *   paper = the crop's modal RGB.
 *   line  = the MODAL of the per-column achromatic extreme (darkest in light, lightest in
 *           dark), with each cell's central 50 % — the glyph box — masked out. The frame
 *           stroke crosses every column and carries the vote; a glyph crosses a handful and
 *           cannot. `columnsAgreeing / columnsRead` is the vote, reported with every run, and
 *           `extremeOfAll` reports the single extremum pass 3 used, so the contamination is
 *           visible rather than inferred. A first cut of this probe masked whole CELL rects
 *           and lost the stroke with the glyph (the line read 251,250,249 — paper); that run
 *           is the instrument's own negative control and is named in the README.
 *
 * THE RULE, WRITTEN BEFORE THE RUN (2026-09-19, before any pass-4 paint was taken):
 *   Ship `--color-answer-mid` (#8b5cf6) at stroke-opacity 1 — a byte the tree already holds —
 *   and keep the minted escape rung `#9b74f7` ONLY IF #8b5cf6's painted modal core reads UNDER
 *   3.10 against the PINNED ground (worst of line, paper) on EITHER engine. If it clears 3.10
 *   on both, the escape did not fire, `#9b74f7` is deleted, and `--color-answer-mid` returns.
 *
 * usage: BASE=http://127.0.0.1:4237 LABEL=prototype node p4-paint.mjs <out.json>
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const LABEL = process.env.LABEL || "prototype";
const ONLY = process.env.ONLY || "";
const BOARD = process.env.BOARD || "?size=3&difficulty=EASY";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: BASE=… node p4-paint.mjs <out.json>");

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

/**
 * THE PINNED GROUND — the frame line's own modal core, symmetric with the ink's.
 *
 * Pass 3 took "the single darkest achromatic pixel in the strip", which is why one given's
 * glyph (`#0a0a0a`) moved the ground from gray 38 to gray 10 between runs. A single extremum
 * is not a ground. This reads, PER COLUMN, the most extreme achromatic pixel (darkest in the
 * light theme, lightest in the dark), then takes the MODAL of those columns — the frame stroke
 * crosses every column, a glyph crosses a handful, so a glyph can never carry the vote — with
 * the GLYPH BOXES (each cell's central 50 %) masked out on top of that. The mask keeps the
 * stroke, which lives at the cell EDGES, and drops the digit, which lives at its centre.
 * `columnsAgreeing` is the vote's own witness: a ground carried by a minority of columns is
 * not pinned and the run says so.
 */
function pinnedGround(img, masks, scheme, cols = 24) {
  const masked = (x, y) => masks.some((m) => x >= m.x0 && x < m.x1 && y >= m.y0 && y < m.y1);
  const freqAll = new Map();
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++) {
      const k = img.at(x, y).join(",");
      freqAll.set(k, (freqAll.get(k) || 0) + 1);
    }
  const paperK = [...freqAll.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const paper = paperK.split(",").map(Number);

  const step = Math.max(1, Math.floor(img.w / cols));
  const per = [];
  for (let c = 0; c < cols; c++) {
    const x = Math.min(img.w - 1, c * step);
    let best = null;
    for (let y = 0; y < img.h; y++) {
      if (masked(x, y)) continue;
      const rgb = img.at(x, y);
      const o = rgbToOklch(...rgb);
      if (o.C >= 0.03) continue;
      if (!best || (scheme === "light" ? o.L < best.L : o.L > best.L)) best = { rgb, ...o };
    }
    if (best) per.push(best);
  }
  const freq = new Map();
  for (const p of per) freq.set(p.rgb.join(","), (freq.get(p.rgb.join(",")) || 0) + 1);
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]);
  return {
    paper,
    paperCount: freqAll.get(paperK),
    line: ranked[0][0].split(",").map(Number),
    columnsAgreeing: ranked[0][1],
    columnsRead: per.length,
    distinctColumnExtremes: ranked.length,
    extremeOfAll: per.reduce(
      (a, b) => (a === null ? b : scheme === "light" ? (b.L < a.L ? b : a) : b.L > a.L ? b : a),
      null,
    )?.rgb,
    maskedRects: masks.length,
  };
}

function modalCore(img, cols = 24) {
  const per = [];
  const step = Math.max(1, Math.floor(img.w / cols));
  for (let c = 0; c < cols; c++) {
    const x = Math.min(img.w - 1, c * step);
    let best = null;
    for (let y = 0; y < img.h; y++) {
      const rgb = img.at(x, y);
      const o = rgbToOklch(...rgb);
      if (!best || o.C > best.C) best = { rgb, ...o };
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

const rows = {
  meta: { base: BASE, label: LABEL, control: "74a2b5d9", board: BOARD, rule: "keep #9b74f7 only if #8b5cf6 painted worst < 3.10 on either engine, against the pinned ground" },
  cells: {},
};

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
    await page.goto(`${BASE}/${BOARD}`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1200);

    const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const clip = {
      x: Math.round(box.x + box.width * 0.15),
      y: Math.round(box.y - 10),
      width: Math.max(2, Math.round(box.width * 0.4)),
      height: 26,
    };
    const shot = () => page.screenshot({ clip, type: "png" });

    // Cell rects, in CROP-LOCAL coordinates: the glyph mask.
    const masks = (
      await page.evaluate(() =>
        Array.from(document.querySelectorAll(".sudoku-cell")).map((c) => {
          const r = c.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        }),
      )
    )
      // The GLYPH box: each cell's central 50 %. The stroke lives at the edges and survives.
      .map((r) => ({
        x0: Math.floor(r.x + r.w * 0.25 - clip.x),
        x1: Math.ceil(r.x + r.w * 0.75 - clip.x),
        y0: Math.floor(r.y + r.h * 0.25 - clip.y),
        y1: Math.ceil(r.y + r.h * 0.75 - clip.y),
      }))
      .filter((m) => m.x1 > 0 && m.x0 < clip.width && m.y1 > 0 && m.y0 < clip.height);

    // ── THE GROUND, read at fill 0 with no gauge on the board ────────────────────────────
    const g0 = await grid(await shot());
    R.ground = pinnedGround(g0, masks, scheme);
    R.groundAgrees = R.ground.columnsAgreeing / R.ground.columnsRead;
    R.gridLineToken = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--grid-line-color").trim(),
    );

    // Two writes, so there is a gauge to read.
    await typeDigits(page, 2);
    await page.waitForTimeout(700);

    const arm = async (name, hex) => {
      if (hex)
        await page.evaluate((h) => {
          const s = document.createElement("style");
          s.id = "acc6-arm";
          s.textContent = `:root { --color-progress-ink: ${h} !important; }`;
          document.head.appendChild(s);
        }, hex);
      await page.waitForTimeout(320);
      const core = modalCore(await grid(await shot()), 24);
      const vsLine = ratio(core.modal.rgb, R.ground.line);
      const vsPaper = ratio(core.modal.rgb, R.ground.paper);
      if (hex) await page.evaluate(() => document.getElementById("acc6-arm")?.remove());
      return {
        ...core,
        hex: hex ?? "(as built)",
        vsLine,
        vsPaper,
        worst: Math.min(vsLine, vsPaper),
        dHueFromViolet: +hueDist(core.modal.h, VIOLET).toFixed(2),
      };
    };

    R.arms = {};
    R.arms.asBuilt = await arm("asBuilt", null);
    R.arms.incumbent_8b5cf6 = await arm("incumbent", "#8b5cf6");
    R.arms.escape_9b74f7 = await arm("escape", "#9b74f7");
    R.arms.deep_7c3aed = await arm("deep", "#7c3aed");
    R.progressInkToken = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--color-progress-ink").trim(),
    );

    // ── THE LEDGER'S user-ink ROW, PAINTED (the 7.70 the critic called arithmetic) ────────
    const digitBox = await page.evaluate(() => {
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input"));
      const mine = ins.find((i) => !i.readOnly && i.value);
      if (!mine) return null;
      const r = mine.closest(".sudoku-cell").getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    if (digitBox) {
      const gd = await grid(
        await page.screenshot({
          clip: {
            x: Math.round(digitBox.x + 2),
            y: Math.round(digitBox.y + 2),
            width: Math.round(digitBox.width - 4),
            height: Math.round(digitBox.height - 4),
          },
          type: "png",
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
        painted: best && { rgb: best.rgb, C: +best.C.toFixed(3), h: +best.h.toFixed(1) },
        dHueFromCrayonBlue: best && +hueDist(best.h, BLUE[scheme]).toFixed(2),
        vsCellGround: best && ratio(best.rgb, gd.at(1, 1)),
        cellGround: gd.at(1, 1),
        userInkToken: await page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim(),
        ),
      };
    }

    await ctx.close();
    console.error(`  done ${cell}`);
  }
  await browser.close();
}

writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);

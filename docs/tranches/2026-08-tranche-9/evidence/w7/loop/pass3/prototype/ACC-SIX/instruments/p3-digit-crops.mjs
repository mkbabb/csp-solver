#!/usr/bin/env node
/** ACC-SIX pass-3 probe 3 — the DIGIT, read clean, the VERB, and the cited crops.
 *
 *  The pass-2 critique's own miss and this lane's: the digit arm read the most chromatic pixel
 *  of "a writable cell with a value", which on a freshly dealt board is a GIVEN near the top
 *  edge with the violet trace crossing its box. Here the cell is chosen away from the first and
 *  last rows and columns, the digit is typed into it, and the read is the cell's INNER box with
 *  the glyph's own computed stroke beside it as the control.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, srgbToLinear, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4239";
const LABEL = process.env.LABEL || "prototype";
const CROPS = process.env.CROPS || "";
const OUT = process.argv[2];

const lum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};
const BLUE = { light: 251.4, dark: 249.3 };

async function grid(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  return {
    at: (x, y) => {
      const o = (y * info.width + x) * ch;
      return [data[o], data[o + 1], data[o + 2]];
    },
    w: info.width,
    h: info.height,
  };
}

const rows = { meta: { base: BASE, label: LABEL }, cells: {} };

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const scheme of ["light", "dark"]) {
    const R = (rows.cells[`${eng}/${scheme}`] = {});
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

    /* THE CELL: an EMPTY writable one in the board's interior (rows/cols 3..6 of 9). */
    const picked = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll(".sudoku-cell"));
      for (let i = 0; i < cells.length; i++) {
        const r = Math.floor(i / 9),
          c = i % 9;
        if (r < 2 || r > 6 || c < 2 || c > 6) continue;
        const inp = cells[i].querySelector("input");
        if (!inp || inp.readOnly || inp.value) continue;
        inp.focus();
        return i;
      }
      return -1;
    });
    if (picked >= 0) {
      await page.keyboard.type("7");
      await page.waitForTimeout(700);
      await page.evaluate(() => document.activeElement?.blur?.());
      await page.waitForTimeout(500);
      const info = await page.evaluate((i) => {
        const cell = document.querySelectorAll(".sudoku-cell")[i];
        const r = cell.getBoundingClientRect();
        const p = cell.querySelector(".glyph-svg path");
        const cs = getComputedStyle(document.documentElement);
        return {
          box: { x: r.x, y: r.y, width: r.width, height: r.height },
          computedStroke: p ? getComputedStyle(p).stroke : null,
          cellBg: getComputedStyle(cell).backgroundColor,
          card: cs.getPropertyValue("--color-card").trim(),
          background: cs.getPropertyValue("--color-background").trim(),
          userInk: cs.getPropertyValue("--color-user-ink").trim(),
        };
      }, picked);
      const g = await grid(
        await page.screenshot({
          clip: {
            x: Math.round(info.box.x + 3),
            y: Math.round(info.box.y + 3),
            width: Math.round(info.box.width - 6),
            height: Math.round(info.box.height - 6),
          },
          type: "png",
        }),
      );
      let best = null;
      for (let y = 0; y < g.h; y++)
        for (let x = 0; x < g.w; x++) {
          const rgb = g.at(x, y);
          const o = rgbToOklch(...rgb);
          if (!best || o.C > best.C) best = { rgb, ...o };
        }
      R.digit = {
        cellIndex: picked,
        ...info,
        painted: { rgb: best.rgb, C: +best.C.toFixed(3), L: +best.L.toFixed(3), h: +best.h.toFixed(1) },
        dHueFromCrayonBlue: +hueDist(best.h, BLUE[scheme]).toFixed(2),
        vsCellGround: ratio(best.rgb, g.at(1, 1)),
      };
    } else {
      R.digit = { note: "no interior empty writable cell" };
    }

    /* THE VERB (G4): the gallery's confirm face, at rest and hovered. */
    R.verb = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return {
        redInk: cs.getPropertyValue("--color-teacher-red").trim(),
        crayonRose: cs.getPropertyValue("--color-crayon-rose").trim(),
        redInkResolved: cs.getPropertyValue("--color-red-ink").trim(),
      };
    });

    await ctx.close();
    console.error(`  done ${eng}/${scheme}`);
  }

  /* CROPS — only on the engine asked for, only the frames the brief names. */
  if (CROPS && CROPS === eng) {
    // crop 1 · the board's bottom edge + margin strip at fill 1, PHONE light
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
    await page.evaluate(() => {
      const i = Array.from(document.querySelectorAll(".sudoku-cell input")).find(
        (x) => !x.readOnly && !x.value,
      );
      i?.focus();
    });
    await page.keyboard.type("5");
    await page.waitForTimeout(400);
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.waitForTimeout(300);
    const b = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    await page.screenshot({
      path: process.env.CROP1,
      clip: {
        x: Math.max(0, Math.round(b.x - 4)),
        y: Math.round(b.y + b.height - 40),
        width: Math.min(330, Math.round(b.width + 8)),
        height: 120,
      },
      type: "png",
    });
    await ctx.close();

    // crop 2 · the SOLVED board's corner, desk light — the violet twice at once
    const ctx2 = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const p2 = await ctx2.newPage();
    await p2.goto(`${BASE}/?size=3&difficulty=EASY`);
    await p2.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await p2.waitForTimeout(1200);
    await p2.evaluate(() => document.querySelector('[aria-label="Solve puzzle"]')?.click());
    await p2.waitForTimeout(4200);
    const b2 = await p2.locator("svg.hand-drawn-grid").first().boundingBox();
    await p2.screenshot({
      path: process.env.CROP2,
      clip: {
        x: Math.round(b2.x - 6),
        y: Math.round(b2.y - 6),
        width: 240,
        height: 150,
      },
      type: "png",
    });
    await ctx2.close();
  }

  await browser.close();
}

if (OUT) writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error("done");

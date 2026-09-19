/**
 * print-forced.mjs — G3 and the digit's own print/forced arms.
 *
 * The trace must resolve to #000 under print and to CanvasText under forced colours, BEFORE
 * and AFTER the win (the win's recolour is `!important` in @layer utilities, so the print arm
 * has to be `!important` in an EARLIER layer to beat it — for important declarations layer
 * precedence inverts). Read through the cascade, both engines.
 *
 *   ACC_FIVE_OUT=<dir> node print-forced.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { OUT, board, writeOne } from "./lib.mjs";

const out = {};
const read = (page) =>
  page.evaluate(() => {
    const t = document.querySelector(".progress-pose.is-active .progress-trace");
    const g = document.querySelector(".sudoku-cell .glyph-svg path");
    return {
      traceStroke: t ? getComputedStyle(t).stroke : null,
      glyphStroke: g ? getComputedStyle(g).stroke : null,
      solveSuccess: !!document.querySelector(".solve-success"),
    };
  });

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  const rec = {};
  for (const forced of [false, true]) {
    const ctx = await browser.newContext({
      colorScheme: "light",
      reducedMotion: "reduce",
      forcedColors: forced ? "active" : "none",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await board(page);
    await writeOne(page);
    rec[forced ? "forcedColors/screen" : "screen"] = await read(page);
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(250);
    rec[forced ? "forcedColors/print" : "print"] = await read(page);
    await page.emulateMedia({ media: "screen" });

    // and again after the win
    const n = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
          (i) => !i.readOnly && !i.value,
        ).length,
    );
    for (let k = 0; k < n + 6; k++) {
      const done = await page.evaluate(() => {
        const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
          (i) => !i.readOnly,
        );
        const e = ins.findIndex((i) => !i.value);
        if (e < 0) return true;
        ins[e].focus();
        return false;
      });
      if (done) break;
      await page.keyboard.type("1");
      await page.waitForTimeout(25);
    }
    await page
      .locator('[aria-label="Solve puzzle"]')
      .first()
      .click({ timeout: 8000 })
      .catch(() => {});
    await page.waitForTimeout(2200);
    rec[forced ? "forcedColors/screen@win" : "screen@win"] = await read(page);
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(250);
    rec[forced ? "forcedColors/print@win" : "print@win"] = await read(page);
    await ctx.close();
  }
  out[engine] = rec;
  for (const [k, v] of Object.entries(rec)) console.log(` ${engine} ${k}`, JSON.stringify(v));
  await browser.close();
}
writeFileSync(`${OUT}/print-forced.json`, JSON.stringify(out, null, 2));

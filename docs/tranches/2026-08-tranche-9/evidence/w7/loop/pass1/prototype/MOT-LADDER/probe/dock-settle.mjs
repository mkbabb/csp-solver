#!/usr/bin/env node
/**
 * MOT-LADDER · THE DOCK SETTLE, and the rest-state identity crop.
 *
 * The sheet SLIDES: open it, wait 700 ms, and the claim is that NOTHING is still running
 * and the rest pose sits exactly where HEAD's does. So: `getAnimations().length` must be 0
 * at +700 ms, and the sheet's own rect is read to 2 decimals so a sub-pixel drift cannot
 * hide. Then one crop of the settled sheet per (engine × theme), for the HEAD/branch
 * identity compare — this family claims zero rest pixels, so a moved crop is a defect.
 *
 * Run: BASE=http://127.0.0.1:4244/ TAG=after OUT=<dir> node dock-settle.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4244/";
const TAG = process.env.TAG ?? "after";
const OUT = process.env.OUT ?? "/tmp/dock";
mkdirSync(OUT, { recursive: true });

const readings = {};
for (const [engineName, engine] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  for (const dark of [false, true]) {
    const theme = dark ? "dark" : "light";
    const browser = await engine.launch({ headless: true });
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      hasTouch: true,
      isMobile: true,
      colorScheme: dark ? "dark" : "light",
      // FROZEN for the identity crop: PRM parks the ~8Hz boil at pose 0 (boilBeat.ts
      // self-guards), which is the only way two captures of a hand-drawn surface are
      // comparable at all. The estate's own golden config mints every baseline this way.
      ...(process.env.FREEZE ? { reducedMotion: "reduce" } : {}),
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY");
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
    await page.waitForTimeout(1500);

    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(700); // the sheet's own settle window

    const r = await page.evaluate(() => {
      const sheet =
        document.querySelector(".drawer-case") ??
        document.querySelector(".scene-controls") ??
        document.querySelector(".controls-sheet");
      const b = sheet?.getBoundingClientRect();
      const cs = sheet ? getComputedStyle(sheet) : null;
      return {
        running: document.getAnimations().length,
        rect: b
          ? { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) }
          : null,
        transform: cs?.transform ?? null,
        cls: sheet?.className ? String(sheet.className).slice(0, 60) : null,
      };
    });
    readings[`${engineName}-${theme}`] = r;
    console.log(`${TAG} ${engineName.padEnd(9)} ${theme.padEnd(6)} running=${r.running} rect=${JSON.stringify(r.rect)} transform=${r.transform}`);

    const target = page.locator(".drawer-case, .scene-controls, .controls-sheet").first();
    await target.screenshot({ path: join(OUT, `dock-open-${theme}-${engineName}-${TAG}.png`), scale: "css" });
    await browser.close();
  }
}
writeFileSync(join(OUT, `dock-settle-${TAG}.json`), JSON.stringify(readings, null, 1));

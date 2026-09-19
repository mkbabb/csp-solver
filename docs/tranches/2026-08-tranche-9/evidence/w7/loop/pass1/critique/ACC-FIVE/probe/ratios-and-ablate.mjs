/**
 * ratios-and-ablate.mjs — the CRITIC's own arithmetic, and a LAYERED ablation.
 *
 * Part A (both engines, both themes): resolve the family's tokens off the LIVE page and
 * compute the WCAG ratios myself — the four 1.4.11 arms, the digit on card/background, the
 * ring at stroke-opacity 0.9, the destructive verb on its own 5% ground. Nothing is taken
 * from the prototype's readings; the composites are done here from the resolved hexes.
 *
 * Part B (chromium, both themes): ablate the win's hand-off with a rule injected INTO
 * `@layer base` — an unlayered `!important` loses to a layered one, which is why a naive
 * ablation silently does nothing. With the hand-off defeated the trace stays gold INK; the
 * prototype's centre gate (">0 chromatic px, median hue within 5 deg of gold, after the win")
 * is then re-evaluated on the same band.
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4241";
const OUT = process.env.OUT || ".";
const GOLD = { light: 83.7, dark: 95.2 };

const srgb = (v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
};
const over = (fg, bg, alpha) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));

const out = { partA: {}, partB: {} };

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();

  // ── Part A ──────────────────────────────────────────────────────────────────
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
    await page.waitForTimeout(800);
    const tok = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const names = [
        "--color-card",
        "--color-background",
        "--grid-line-color",
        "--color-user-ink",
        "--color-blue-ink",
        "--color-progress-ink",
        "--color-focus-sketch",
        "--color-red-ink",
        "--color-crayon-blue",
        "--color-crayon-gold",
        "--color-gold-star",
        "--color-foreground",
      ];
      const o = {};
      // Resolve each through a probe element so color-mix()/var() collapse to rgb().
      const el = document.createElement("span");
      document.body.appendChild(el);
      for (const n of names) {
        el.style.color = `var(${n})`;
        o[n] = getComputedStyle(el).color;
      }
      el.remove();
      o["_raw"] = Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim()]));
      return o;
    });
    const rgb = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number);
    const card = rgb(tok["--color-card"]);
    const bg = rgb(tok["--color-background"]);
    const grid = rgb(tok["--grid-line-color"]);
    const pen = rgb(tok["--color-user-ink"]);
    const trace = rgb(tok["--color-progress-ink"]);
    const ring = rgb(tok["--color-focus-sketch"]);
    const red = rgb(tok["--color-red-ink"]);
    const wax = rgb(tok["--color-gold-star"]);

    const redGround5 = over(red, card, 0.05);
    const redGround8 = over(red, card, 0.08);
    out.partA[`${engine}/${scheme}`] = {
      tokens: tok["_raw"],
      resolved: { card, bg, grid, pen, trace, ring, red, wax },
      "digit/card": ratio(pen, card),
      "digit/background": ratio(pen, bg),
      "trace@0.95/grid-line": ratio(over(trace, grid, 0.95), grid),
      "trace@0.95/card": ratio(over(trace, card, 0.95), card),
      "ring@0.9/card": ratio(over(ring, card, 0.9), card),
      "verb/own-5%-ground": ratio(red, redGround5),
      "verb/own-8%-ground(HEAD ground)": ratio(red, redGround8),
      "wax/card (win, decorative)": ratio(wax, card),
      penOklch: rgbToOklch(...pen),
      traceOklch: rgbToOklch(...trace),
      ringOklch: rgbToOklch(...ring),
      waxOklch: rgbToOklch(...wax),
    };
    await ctx.close();
  }
  await browser.close();
}

// ── Part B: layered ablation, chromium ─────────────────────────────────────────
{
  const browser = await chromium.launch();
  for (const scheme of ["light", "dark"]) {
    for (const arm of ["live", "ablated-layered"]) {
      const ctx = await browser.newContext({
        colorScheme: scheme,
        reducedMotion: "reduce",
        viewport: { width: 1280, height: 800 },
      });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/?size=3&difficulty=EASY`);
      await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
      if (arm === "ablated-layered")
        await page.addStyleTag({
          content: `@layer base { .solve-success .progress-trace { stroke: var(--color-progress-ink) !important } }`,
        });
      await page.waitForTimeout(700);
      const gridEl = page.locator("svg.hand-drawn-grid").first();
      const band = async () => {
        const b = await gridEl.boundingBox();
        return page.screenshot({
          clip: {
            x: Math.max(0, Math.round(b.x - 8)),
            y: Math.round(b.y + b.height * 0.3),
            width: 22,
            height: Math.round(b.height * 0.4),
          },
          type: "png",
        });
      };
      const census = async (buf) => {
        const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
        let n = 0;
        const hs = [];
        const Ls = [];
        for (let i = 0; i < info.width * info.height; i++) {
          const o = i * info.channels;
          const c = rgbToOklch(data[o], data[o + 1], data[o + 2]);
          if (c.C >= 0.05) {
            n++;
            hs.push(c.h);
            Ls.push(c.L);
          }
        }
        hs.sort((a, b) => a - b);
        Ls.sort((a, b) => a - b);
        return {
          chromaticPx: n,
          medianHue: hs.length ? +hs[hs.length >> 1].toFixed(1) : null,
          medianL: Ls.length ? +Ls[Ls.length >> 1].toFixed(3) : null,
        };
      };
      const n = await page.evaluate(
        () =>
          Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
            (i) => !i.readOnly && !i.value,
          ).length,
      );
      for (let k = 0; k < n + 4; k++) {
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
        await page.waitForTimeout(35);
      }
      await page.waitForTimeout(900);
      const before = await census(await band());
      await page
        .locator('[aria-label="Solve puzzle"]')
        .first()
        .click({ timeout: 8000 })
        .catch(() => {});
      await page.waitForTimeout(2700);
      const after = await census(await band());
      const stroke = await page.evaluate(() => {
        const t = document.querySelector(".progress-pose.is-active .progress-trace");
        return t ? getComputedStyle(t).stroke : null;
      });
      const dh = after.medianHue == null ? null : Math.abs(after.medianHue - GOLD[scheme]);
      out.partB[`chromium/${scheme}/${arm}`] = {
        beforeWin: before,
        afterWin: after,
        strokeAfterWin: stroke,
        dHueToGold: dh == null ? null : +Math.min(dh, 360 - dh).toFixed(1),
        centreGateGreen: after.chromaticPx > 0 && dh != null && Math.min(dh, 360 - dh) <= 5,
        beforeWinWouldAlsoPass:
          before.chromaticPx > 0 &&
          before.medianHue != null &&
          Math.min(
            Math.abs(before.medianHue - GOLD[scheme]),
            360 - Math.abs(before.medianHue - GOLD[scheme]),
          ) <= 5,
      };
      await ctx.close();
    }
  }
  await browser.close();
}

writeFileSync(`${OUT}/critic-ratios-ablate.json`, JSON.stringify(out, null, 2));
for (const [k, v] of Object.entries(out.partA))
  console.log(
    "A",
    k,
    "digit/card",
    v["digit/card"],
    "digit/bg",
    v["digit/background"],
    "trace/grid",
    v["trace@0.95/grid-line"],
    "trace/card",
    v["trace@0.95/card"],
    "ring@0.9",
    v["ring@0.9/card"],
    "verb/5%",
    v["verb/own-5%-ground"],
    "verb/8%",
    v["verb/own-8%-ground(HEAD ground)"],
    "wax/card",
    v["wax/card (win, decorative)"],
  );
for (const [k, v] of Object.entries(out.partB))
  console.log(
    "B",
    k,
    "| before px",
    v.beforeWin.chromaticPx,
    "L",
    v.beforeWin.medianL,
    "| after px",
    v.afterWin.chromaticPx,
    "h",
    v.afterWin.medianHue,
    "L",
    v.afterWin.medianL,
    "stroke",
    v.strokeAfterWin,
    "| centre gate",
    v.centreGateGreen ? "GREEN" : "RED",
    "| same gate on the PRE-WIN frame",
    v.beforeWinWouldAlsoPass ? "ALSO GREEN" : "red",
  );

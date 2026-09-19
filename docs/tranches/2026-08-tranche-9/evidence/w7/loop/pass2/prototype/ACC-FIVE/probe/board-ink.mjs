/**
 * board-ink.mjs — the board's four readings, on painted bytes, both engines, both themes.
 *
 *  A) the four 1.4.11 ratios: the fill trace against the frame line it retraces and against
 *     the card behind it, opaque and at its own stroke-opacity 0.95. Read at FRAME_PAD's HEAD
 *     value (12 / 0), so the band is re-read where the pads actually put the ring.
 *  B) the digit: painted hue against crayon-blue, and its ratio on card and on background.
 *  C) the win: the band's median chromatic L before and after, at 900/1800/2700/3600/5000 ms,
 *     with the post-win computed stroke resolved through the cascade. Three arms — live, an
 *     UNLAYERED ablation (the pass-1 form, kept so the trap stays visible) and a LAYERED one
 *     in @layer base, which is the only one that can beat an `!important` in @layer utilities.
 *  D) the paired census under the DECLARED TERM: off-family = chromatic px outside 40-115 deg
 *     EXCLUDING the 240-270 bin (the pen and the ring, owned by the kinship rows); the blue
 *     bin is reported beside as its own number.
 *
 *   ACC_FIVE_OUT=<dir> node board-ink.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";
import { BASE, OUT, GOLD, CRAYON_BLUE, ratio, pixels, hueDelta, board, writeOne } from "./lib.mjs";

const UNLAYERED = `.solve-success .progress-trace { stroke: var(--color-progress-ink) !important; }`;
const LAYERED = `@layer base { .solve-success .progress-trace { stroke: var(--color-progress-ink) !important; } }`;
const TIMES = [900, 1800, 2700, 3600, 5000];
const out = {};

const bandStats = (px, scheme) => {
  const chr = px.filter((p) => p.C >= 0.05);
  const Ls = chr.map((p) => p.L).sort((a, b) => a - b);
  const hs = chr.map((p) => p.h).sort((a, b) => a - b);
  return {
    chromaticPx: chr.length,
    medianL: Ls.length ? +Ls[Ls.length >> 1].toFixed(3) : null,
    medianHue: hs.length ? +hs[hs.length >> 1].toFixed(1) : null,
    dGold: hs.length ? hueDelta(hs[hs.length >> 1], GOLD[scheme]) : null,
  };
};

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const rec = {};
    for (const arm of ["live", "unlayered", "layered"]) {
      const ctx = await browser.newContext({
        colorScheme: scheme,
        reducedMotion: "reduce",
        viewport: { width: 1280, height: 800 },
      });
      const page = await ctx.newPage();
      const grid = await board(page);
      if (arm === "unlayered") await page.addStyleTag({ content: UNLAYERED });
      if (arm === "layered") await page.addStyleTag({ content: LAYERED });

      const b0 = await grid.boundingBox();
      const bandClip = {
        x: Math.max(0, Math.round(b0.x - 8)),
        y: Math.round(b0.y + b0.height * 0.3),
        width: 22,
        height: Math.round(b0.height * 0.4),
      };
      const band = () => page.screenshot({ clip: bandClip, type: "png" });

      // ── fill every cell so the trace draws whole, then read A / B / D on the `live` arm ──
      const n = await page.evaluate(
        () =>
          Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
            (i) => !i.readOnly && !i.value,
          ).length,
      );
      if (arm === "live") {
        await writeOne(page);
        // (A) the band at one digit: the trace is mounted but the front is at the top-left.
        // Push the front to 100% through the element's own dasharray to read the stroke whole.
        await page.evaluate(() => {
          for (const el of document.querySelectorAll(".progress-trace"))
            el.style.strokeDashoffset = "0";
        });
        await page.waitForTimeout(500);

        const { px } = await pixels(await band());
        const chr = px.filter((p) => p.C >= 0.05);
        const ach = px.filter((p) => p.C < 0.05);
        // the painted trace core = the most chromatic pixel in the band (the stroke at 0.95
        // over whatever it sits on); the frame line = the darkest/lightest achromatic run;
        // the card = the achromatic mode.
        const traceCore = chr.sort((a, b) => b.C - a.C)[0] ?? null;
        const counts = new Map();
        for (const p of ach) {
          const k = p.rgb.join(",");
          counts.set(k, (counts.get(k) ?? 0) + 1);
        }
        const cardRgb = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
          .split(",")
          .map(Number);
        const cardL = 0.2126 * cardRgb[0] + 0.7152 * cardRgb[1] + 0.0722 * cardRgb[2];
        // the frame line is the achromatic pixel furthest in luminance from the card
        const lineRgb = ach
          .map((p) => p.rgb)
          .sort(
            (a, b) =>
              Math.abs(0.2126 * b[0] + 0.7152 * b[1] + 0.0722 * b[2] - cardL) -
              Math.abs(0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2] - cardL),
          )[0];

        const tokens = await page.evaluate(() => {
          const cs = getComputedStyle(document.documentElement);
          const g = (n) => cs.getPropertyValue(n).trim();
          const t = document.querySelector(".progress-pose.is-active .progress-trace");
          return {
            progressInk: g("--color-progress-ink"),
            userInk: g("--color-user-ink"),
            goldStar: g("--color-gold-star"),
            crayonGold: g("--color-crayon-gold"),
            crayonBlue: g("--color-crayon-blue"),
            gridLine: g("--grid-line-color"),
            card: g("--color-card"),
            background: g("--color-background"),
            traceStroke: t ? getComputedStyle(t).stroke : null,
            traceOpacity: t ? getComputedStyle(t).strokeOpacity : null,
            dasharray: t ? getComputedStyle(t).strokeDasharray : null,
            pathLengthAttr: t ? t.getAttribute("pathLength") : null,
          };
        });

        // the trace's LEFT INSET inside the band (FRAME_PAD at HEAD: expect ~2.78 px)
        const { px: bpx, w } = await pixels(await band());
        let inset = null;
        for (let x = 0; x < w && inset === null; x++)
          for (let y = 0; y < bpx.length / w; y++)
            if (bpx[y * w + x].C >= 0.05) {
              inset = x;
              break;
            }

        rec.ratios = {
          traceCorePainted: traceCore
            ? { rgb: traceCore.rgb, L: +traceCore.L.toFixed(3), C: +traceCore.C.toFixed(3), h: +traceCore.h.toFixed(1) }
            : null,
          gridLinePainted: lineRgb,
          cardPainted: cardRgb,
          traceVsGridLine: traceCore ? ratio(traceCore.rgb, lineRgb) : null,
          traceVsCard: traceCore ? ratio(traceCore.rgb, cardRgb) : null,
          dHueToGold: traceCore ? hueDelta(traceCore.h, GOLD[scheme]) : null,
          leftInsetPx: inset,
          bandClip,
          tokens,
        };

        // (B) the digit
        const digit = await page.evaluate(() => {
          const g = document.querySelector(".sudoku-cell .glyph-svg path");
          if (!g) return null;
          const r = g.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height, stroke: getComputedStyle(g).stroke };
        });
        if (digit) {
          const dClip = {
            x: Math.max(0, Math.floor(digit.x - 2)),
            y: Math.max(0, Math.floor(digit.y - 2)),
            width: Math.ceil(digit.w + 4),
            height: Math.ceil(digit.h + 4),
          };
          const { px: dpx } = await pixels(await page.screenshot({ clip: dClip, type: "png" }));
          const core = dpx.filter((p) => p.C >= 0.05).sort((a, b) => b.C - a.C)[0];
          rec.digit = core
            ? {
                rgb: core.rgb,
                h: +core.h.toFixed(1),
                dHueToCrayonBlue: hueDelta(core.h, CRAYON_BLUE[scheme]),
                onCard: ratio(core.rgb, hexToRgb(tokens.card)),
                onBackground: ratio(core.rgb, hexToRgb(tokens.background)),
                computedStroke: digit.stroke,
              }
            : null;
        }

        // (D) the paired census over the whole viewport
        const shot = await page.screenshot({ type: "png" });
        const { px: vpx } = await pixels(shot);
        const chrAll = vpx.filter((p) => p.C >= 0.05);
        const inFamily = (h) => h >= 40 && h <= 115;
        const inBlueBin = (h) => h >= 240 && h <= 270;
        const offFamily = chrAll.filter((p) => !inFamily(p.h) && !inBlueBin(p.h));
        const blueBin = chrAll.filter((p) => inBlueBin(p.h));
        const bins = {};
        for (const p of chrAll) {
          const k = Math.floor(p.h / 10) * 10;
          bins[k] = (bins[k] ?? 0) + 1;
        }
        rec.census = {
          chromaticPx: chrAll.length,
          offFamilyPx: offFamily.length,
          offFamilyPct: chrAll.length ? +((offFamily.length / chrAll.length) * 100).toFixed(2) : 0,
          blueBinPx: blueBin.length,
          blueBinPct: chrAll.length ? +((blueBin.length / chrAll.length) * 100).toFixed(2) : 0,
          bins: Object.fromEntries(
            Object.entries(bins)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 12),
          ),
        };
      }

      // ── (C) the win, every arm ──
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
        await page.waitForTimeout(30);
      }
      await page.waitForTimeout(900);
      const before = bandStats((await pixels(await band())).px, scheme);
      before.stroke = await page.evaluate(() => {
        const t = document.querySelector(".progress-pose.is-active .progress-trace");
        return t ? getComputedStyle(t).stroke : null;
      });

      await page
        .locator('[aria-label="Solve puzzle"]')
        .first()
        .click({ timeout: 8000 })
        .catch(() => {});
      const samples = [];
      let prev = 0;
      for (const t of TIMES) {
        await page.waitForTimeout(t - prev);
        prev = t;
        const s = bandStats((await pixels(await band())).px, scheme);
        Object.assign(
          s,
          await page.evaluate(() => {
            const el = document.querySelector(".progress-pose.is-active .progress-trace");
            const cs = getComputedStyle(document.documentElement);
            return {
              solveSuccess: !!document.querySelector(".solve-success"),
              stroke: el ? getComputedStyle(el).stroke : null,
              goldStar: cs.getPropertyValue("--color-gold-star").trim(),
              opacity: el ? getComputedStyle(el.parentElement).opacity : null,
            };
          }),
        );
        s.atMs = t;
        samples.push(s);
      }
      rec[arm] = { before, samples, dL: samples.at(-1).medianL == null || before.medianL == null ? null : +(samples.at(-1).medianL - before.medianL).toFixed(3) };
      console.log(
        `  ${engine} ${scheme} ${arm}: before L=${before.medianL} h=${before.medianHue} -> after L=${samples.at(-1).medianL} dL=${rec[arm].dL} stroke=${samples.at(-1).stroke}`,
      );
      await ctx.close();
    }
    out[`${engine}/${scheme}`] = rec;
  }
  await browser.close();
}
writeFileSync(`${OUT}/board-ink.json`, JSON.stringify(out, null, 2));
console.log("banked", `${OUT}/board-ink.json`);

function hexToRgb(v) {
  const m = /^#?([0-9a-f]{6})$/i.exec(v.trim());
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const r = /rgba?\(([^)]+)\)/.exec(v);
  if (r) return r[1].split(/[, ]+/).slice(0, 3).map(Number);
  const h = /hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/.exec(v);
  if (h) {
    const [hh, s, l] = [+h[1], +h[2] / 100, +h[3] / 100];
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
    const m0 = l - c / 2;
    const seg = [
      [c, x, 0],
      [x, c, 0],
      [0, c, x],
      [0, x, c],
      [x, 0, c],
      [c, 0, x],
    ][Math.floor(hh / 60) % 6];
    return seg.map((v0) => Math.round((v0 + m0) * 255));
  }
  return [255, 255, 255];
}

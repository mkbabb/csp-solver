/**
 * cascade-ablate.mjs — ACC-FIVE pass 2, row 1.
 *
 * The pass-1 critique's headline ("the centre gate cannot fail") was banked with an ablation
 * that NO-OPPED: `critique/ACC-FIVE/probe/handoff-ablate.mjs:30` injects the killing rule
 * UNLAYERED, and for !important declarations layer order inverts, so an unlayered !important
 * LOSES to the win rule's `@layer utilities` one (index.css:662). The banked readings prove
 * the no-op: every "ablated" arm in `handoff-ablate.json` reports the SAME post-win stroke
 * and the SAME median L as its `live` twin.
 *
 * This probe runs THREE arms on the real win, so the ablation mechanism is a measurement:
 *   live      — no injection
 *   unlayered — `.solve-success .progress-trace { stroke: var(--color-progress-ink) !important }`
 *   layered   — the same declaration inside `@layer base { … }`
 *
 * and records, at each of five samples after the win, the computed stroke AND the band's
 * median chromatic-pixel OKLCH L — the quantity the restated gate reads (the one that MOVES).
 * Band, chroma floor and sample times are the pass-1 probe's, verbatim.
 *
 *   BASE=http://127.0.0.1:4236 OUT=<dir> node cascade-ablate.mjs
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.env.OUT || ".";
const GOLD = { light: 83.7, dark: 95.2 };
const UNLAYERED = `.solve-success .progress-trace { stroke: var(--color-progress-ink) !important; }`;
const LAYERED = `@layer base { .solve-success .progress-trace { stroke: var(--color-progress-ink) !important; } }`;

async function bandCensus(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let chromatic = 0;
  const hues = [];
  const Ls = [];
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * ch;
    const c = rgbToOklch(data[o], data[o + 1], data[o + 2]);
    if (c.C >= 0.05) {
      chromatic++;
      hues.push(c.h);
      Ls.push(c.L);
    }
  }
  hues.sort((a, b) => a - b);
  Ls.sort((a, b) => a - b);
  const med = (a) => (a.length ? +a[Math.floor(a.length / 2)].toFixed(3) : null);
  return {
    px: info.width * info.height,
    chromaticPx: chromatic,
    medianHue: hues.length ? +hues[Math.floor(hues.length / 2)].toFixed(1) : null,
    medianL: med(Ls),
  };
}

const out = {};
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    for (const arm of ["live", "unlayered", "layered"]) {
      const ctx = await browser.newContext({
        colorScheme: scheme,
        reducedMotion: "reduce",
        viewport: { width: 1280, height: 800 },
      });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/?size=3&difficulty=EASY`);
      await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
      if (arm === "unlayered") await page.addStyleTag({ content: UNLAYERED });
      if (arm === "layered") await page.addStyleTag({ content: LAYERED });
      await page.waitForTimeout(700);

      const grid = page.locator("svg.hand-drawn-grid").first();
      const band = async () => {
        const b = await grid.boundingBox();
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
      const bake = () =>
        page.evaluate(() => {
          const t = document.querySelector(".progress-pose.is-active .progress-trace");
          // resolve the two tokens to painted rgb through the cascade, not by parsing hex
          const probe = document.createElement("span");
          probe.style.position = "absolute";
          probe.style.opacity = "0";
          document.body.appendChild(probe);
          const resolve = (tok) => {
            probe.style.color = `var(${tok})`;
            return getComputedStyle(probe).color;
          };
          const goldStarRgb = resolve("--color-gold-star");
          const progressRgb = resolve("--color-progress-ink");
          probe.remove();
          return {
            solveSuccess: !!document.querySelector(".solve-success"),
            traceStroke: t ? getComputedStyle(t).stroke : null,
            goldStarRgb,
            progressRgb,
          };
        });

      // fill by hand so the gauge mounts and the pre-win band is the family's own ink
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
      const before = { bake: await bake(), band: await bandCensus(await band()) };

      await page
        .locator('[aria-label="Solve puzzle"]')
        .first()
        .click({ timeout: 8000 })
        .catch(() => {});
      const times = [900, 1800, 2700, 3600, 5000];
      const samples = [];
      for (let i = 0; i < times.length; i++) {
        await page.waitForTimeout(times[i] - (i ? times[i - 1] : 0));
        const bk = await bake();
        const b = await bandCensus(await band());
        const dh = b.medianHue == null ? null : Math.abs(b.medianHue - GOLD[scheme]);
        samples.push({
          atMs: times[i],
          solveSuccess: bk.solveSuccess,
          traceStroke: bk.traceStroke,
          band: b,
          dHueToGold: dh == null ? null : +Math.min(dh, 360 - dh).toFixed(1),
          // the pass-1 gate, as written
          gateOld: b.chromaticPx > 0 && dh != null && Math.min(dh, 360 - dh) <= 5,
          // the restated gate: the band's median L rises >= 0.09 across the win AND the
          // post-win stroke resolves to --color-gold-star
          dL: +(b.medianL - before.band.medianL).toFixed(3),
          strokeIsGoldStar: bk.traceStroke === bk.goldStarRgb,
          strokeIsProgressInk: bk.traceStroke === bk.progressRgb,
          gateNew:
            b.medianL - before.band.medianL >= 0.09 && bk.traceStroke === bk.goldStarRgb,
        });
      }
      out[`${engine}/${scheme}/${arm}`] = { before, samples };
      await ctx.close();
      console.log(
        `== ${engine} ${scheme} ${arm} | before L ${before.band.medianL} stroke ${before.bake.traceStroke}`,
      );
      for (const s of samples)
        console.log(
          `    ${String(s.atMs).padStart(5)} px ${String(s.band.chromaticPx).padStart(5)} h ${String(s.band.medianHue).padStart(6)} L ${String(s.band.medianL).padStart(6)} dL ${String(s.dL).padStart(6)} dGold ${String(s.dHueToGold).padStart(5)} oldGate ${s.gateOld ? "GREEN" : "RED  "} | solve ${s.solveSuccess} stroke ${s.traceStroke}`,
        );
    }
  }
  await browser.close();
}
writeFileSync(`${OUT}/cascade-ablate.json`, JSON.stringify(out, null, 2));
console.log("banked", `${OUT}/cascade-ablate.json`);

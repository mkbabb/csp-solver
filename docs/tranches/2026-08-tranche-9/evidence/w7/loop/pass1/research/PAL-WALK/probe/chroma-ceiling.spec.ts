/**
 * PAL-WALK · P5 — THE CHROMA CEILING, read from the engine.
 *
 * P1 proved the requested chroma is not the painted one: at C 0.166 the engine gamut-maps
 * 95/144 hues in light and rotates the hue by up to 15.33deg, which walks indices the arc
 * construction had placed legally straight back into a reserved arc.
 *
 * This asks the engine two questions it can answer exactly:
 *   1. per chroma, over the arc walk: how far does the painted hue move, and what does the
 *      painted separation over the first 16 become?
 *   2. per HUE, at each band: what is the highest chroma that is still in gamut (bisection on
 *      the engine's own bytes)? That is the ceiling a per-hue chroma would ride.
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "fs";
import path from "path";

const WALK = JSON.parse(fs.readFileSync(path.join(__dirname, "walk.json"), "utf8"));
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/PAL-WALK";
const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
}

test("P5 — the chroma the engine will actually paint", async ({ page }, info) => {
  await page.goto(SOLO);
  await settled(page);
  const lines: string[] = [];
  const say = (s: string) => {
    lines.push(s);
    console.log(s);
  };

  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((t) => document.documentElement.classList.toggle("dark", t === "dark"), theme);
    const res = await page.evaluate(
      ({ hues }) => {
        const band = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--peer-ink-l"),
        );
        const cs = getComputedStyle(document.documentElement);
        const grounds = {
          background: cs.getPropertyValue("--color-background").trim(),
          card: cs.getPropertyValue("--color-card").trim(),
        };
        const c = document.createElement("canvas");
        c.width = c.height = 1;
        const g = c.getContext("2d", { willReadFrequently: true })!;
        const paint = (ground: string, css: string, alpha = 1) => {
          g.globalAlpha = 1;
          g.globalCompositeOperation = "copy";
          g.fillStyle = ground;
          g.fillRect(0, 0, 1, 1);
          g.globalCompositeOperation = "source-over";
          g.globalAlpha = alpha;
          g.fillStyle = css;
          g.fillRect(0, 0, 1, 1);
          const d = g.getImageData(0, 0, 1, 1).data;
          return [d[0], d[1], d[2]];
        };
        const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        const lum = (p: number[]) =>
          0.2126 * lin(p[0] / 255) + 0.7152 * lin(p[1] / 255) + 0.0722 * lin(p[2] / 255);
        const ratio = (a: number[], b: number[]) => {
          const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
          return (x + 0.05) / (y + 0.05);
        };
        const toOklch = (p: number[]) => {
          const [r, gg, b] = p.map((v) => lin(v / 255));
          const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * gg + 0.0514459929 * b);
          const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * gg + 0.1073969566 * b);
          const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * gg + 0.6299787005 * b);
          const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
          const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
          const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
          let h = (Math.atan2(B, A) * 180) / Math.PI;
          if (h < 0) h += 360;
          return { L, C: Math.hypot(A, B), h };
        };
        const gapd = (a: number, b: number) => {
          const d = Math.abs(a - b) % 360;
          return d > 180 ? 360 - d : d;
        };

        const sweep: any[] = [];
        for (const C of [0.11, 0.12, 0.13, 0.14, 0.15, 0.166]) {
          const painted = hues.map((h: number) => toOklch(paint("#808080", `oklch(${band} ${C} ${h}deg)`)));
          const shift16 = hues.slice(0, 16).map((h: number, i: number) => gapd(painted[i].h, h));
          let sep = 360;
          for (let i = 0; i < 16; i++)
            for (let j = i + 1; j < 16; j++) sep = Math.min(sep, gapd(painted[i].h, painted[j].h));
          let worstBg = 99,
            worstCard = 99,
            worstRing = 99;
          for (let i = 0; i < 144; i++) {
            const css = `oklch(${band} ${C} ${hues[i]}deg)`;
            worstBg = Math.min(
              worstBg,
              ratio(paint(grounds.background, css), paint(grounds.background, "rgba(0,0,0,0)", 0)),
            );
            worstCard = Math.min(
              worstCard,
              ratio(paint(grounds.card, css), paint(grounds.card, "rgba(0,0,0,0)", 0)),
            );
            worstRing = Math.min(
              worstRing,
              ratio(paint(grounds.card, css, 0.55), paint(grounds.card, "rgba(0,0,0,0)", 0)),
            );
          }
          sweep.push({
            C,
            maxShift16: +Math.max(...shift16).toFixed(2),
            meanShift16: +(shift16.reduce((a: number, b: number) => a + b, 0) / 16).toFixed(2),
            paintedSep16: +sep.toFixed(2),
            meanPaintedC: +(painted.reduce((s: number, p: any) => s + p.C, 0) / 144).toFixed(4),
            worstBg: +worstBg.toFixed(2),
            worstCard: +worstCard.toFixed(2),
            worstRing055: +worstRing.toFixed(2),
          });
        }

        // per-hue in-gamut chroma ceiling, by bisection on the engine's bytes
        const ceiling = hues.map((h: number) => {
          let lo = 0,
            hi = 0.4;
          for (let k = 0; k < 18; k++) {
            const mid = (lo + hi) / 2;
            const p = toOklch(paint("#808080", `oklch(${band} ${mid} ${h}deg)`));
            if (Math.abs(p.C - mid) < 0.002 && gapd(p.h, h) < 0.5) lo = mid;
            else hi = mid;
          }
          return +lo.toFixed(4);
        });
        return { band, sweep, ceiling };
      },
      { hues: WALK.hues },
    );

    say(`\n── ${info.project.name} · ${theme} · band ${res.band} ──`);
    say("    C    | maxShift16 | meanShift16 | paintedSep16 | mean painted C | worst bg | worst card | ring@0.55");
    for (const r of res.sweep)
      say(
        `  ${r.C.toFixed(3)} | ${String(r.maxShift16).padStart(10)} | ${String(r.meanShift16).padStart(11)} | ` +
          `${String(r.paintedSep16).padStart(12)} | ${String(r.meanPaintedC).padStart(14)} | ` +
          `${String(r.worstBg).padStart(8)} | ${String(r.worstCard).padStart(10)} | ${r.worstRing055}`,
      );
    const c = res.ceiling as number[];
    const c16 = c.slice(0, 16);
    say(
      `  per-hue in-gamut CEILING over the walk: min ${Math.min(...c).toFixed(4)} · mean ${(c.reduce((a, b) => a + b, 0) / c.length).toFixed(4)} · max ${Math.max(...c).toFixed(4)}`,
    );
    say(
      `    over the first 16: min ${Math.min(...c16).toFixed(4)} · mean ${(c16.reduce((a, b) => a + b, 0) / 16).toFixed(4)} · hues at or over 0.166: ${c.filter((x) => x >= 0.166).length}/144`,
    );
    fs.writeFileSync(
      `${OUT}/probe/ceiling-${info.project.name}-${theme}.json`,
      JSON.stringify(res, null, 1),
    );
  }
  fs.writeFileSync(`${OUT}/probe/p5-${info.project.name}.txt`, lines.join("\n"));
});

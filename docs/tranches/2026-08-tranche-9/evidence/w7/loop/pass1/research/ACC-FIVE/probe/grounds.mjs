/**
 * grounds.mjs — resolve every ground and anchor this family prices against, off the
 * LIVE page in both themes and both engines, so the search that follows is run on the
 * bytes the engine paints and never on a hex read out of a stylesheet.
 *
 *   node probe/grounds.mjs            (writes readings/grounds.json)
 */
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import { rgbToOklch, parseCss } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";
mkdirSync(`${HERE}/readings`, { recursive: true });

const TOKENS = [
  "--color-background",
  "--color-card",
  "--color-foreground",
  "--color-border",
  "--color-muted-foreground",
  "--color-accent",
  "--color-ring",
  "--grid-line-color",
  "--color-pencil-graphite",
  "--color-crayon-green",
  "--color-crayon-orange",
  "--color-crayon-rose",
  "--color-crayon-blue",
  "--color-crayon-gold",
  "--color-user-ink",
  "--color-focus-sketch",
  "--color-progress-ink",
  "--color-gold-ink",
  "--color-red-ink",
  "--color-green-ink",
  "--color-orange-ink",
  "--color-gold-star",
  "--color-teacher-red",
  "--ink-press-rule",
  "--ink-press-quiet",
];

const out = {};
for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  out[name] = {};
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
    const vals = await page.evaluate((ns) => {
      const p = document.createElement("div");
      p.style.position = "fixed";
      p.style.left = "-9999px";
      document.body.appendChild(p);
      const o = {};
      for (const n of ns) {
        p.style.color = "";
        p.style.setProperty("color", `var(${n})`);
        o[n] = getComputedStyle(p).color;
      }
      p.remove();
      return o;
    }, TOKENS);
    out[name][scheme] = Object.fromEntries(
      Object.entries(vals).map(([k, v]) => {
        const c = parseCss(v);
        if (!c) return [k, { css: v }];
        const o = rgbToOklch(c.r, c.g, c.b);
        return [
          k,
          {
            css: v,
            rgb: [c.r, c.g, c.b],
            a: c.a,
            L: +o.L.toFixed(4),
            C: +o.C.toFixed(4),
            h: +o.h.toFixed(1),
          },
        ];
      }),
    );
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(`${HERE}/readings/grounds.json`, JSON.stringify(out, null, 2));
console.log("chromium light card", out.chromium.light["--color-card"].css);
console.log("chromium dark  card", out.chromium.dark["--color-card"].css);
console.log("chromium dark  grid", out.chromium.dark["--grid-line-color"].css);
console.log(
  "engines agree:",
  JSON.stringify(out.chromium) === JSON.stringify(out.webkit),
);

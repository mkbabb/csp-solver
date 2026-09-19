#!/usr/bin/env node
/** ACC-SIX pass-3 — r0's accent-kinship rows 1/2, re-run against the SIX-anchor ruling.
 *  r0's instrument (loop/r0/r2-accent-family/probe/accent-kinship.probe.ts) is the chair's and
 *  is NOT edited: this is the MOVED row, proposed as a diff — the five anchors become six, and
 *  the exception list SHRINKS by one (the solver rainbow's stop 2 is now kin, at 0.0 degrees,
 *  because it reads the answer's own rung). Tokens are read off the SERVED dist, not the source.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";
import { rgbToOklch, hueDist } from "./oklch.COPY.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4239";
const OUT = process.argv[2];
const KIN_DEG = 5;

const TOKENS = [
  "--color-user-ink",
  "--color-focus-sketch",
  "--color-progress-ink",
  "--color-answer-pale",
  "--color-answer-deep",
  "--color-answer-ink",
  "--color-solver-ink-1",
  "--color-solver-ink-2",
  "--color-solver-ink-3",
  "--color-solver-ink-4",
  "--color-solver-ink-5",
  "--color-crayon-rose",
  "--color-crayon-orange",
  "--color-crayon-gold",
  "--color-crayon-green",
  "--color-crayon-blue",
  "--color-red-ink",
  "--color-green-ink",
  "--color-orange-ink",
  "--color-gold-ink",
];

const out = {};
for (const [eng, L] of [
  ["chromium", pw.chromium],
  ["webkit", pw.webkit],
]) {
  const b = await L.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await b.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(900);
    const resolved = await page.evaluate((toks) => {
      const probe = document.createElement("div");
      document.body.appendChild(probe);
      const r = {};
      for (const t of toks) {
        probe.style.color = `var(${t})`;
        r[t] = getComputedStyle(probe).color;
      }
      probe.remove();
      return r;
    }, TOKENS);
    const anchors = {};
    for (const [name, css] of Object.entries(resolved)) {
      const m = /rgb[a]?\(([^)]+)\)/.exec(css);
      if (!m) continue;
      const [r, g, bl] = m[1].split(/[,\s/]+/).map(Number);
      const o = rgbToOklch(r, g, bl);
      anchors[name] = { css, L: +o.L.toFixed(3), C: +o.C.toFixed(3), h: +o.h.toFixed(1) };
    }
    // THE SIX ANCHORS, taken off the tree itself in this theme.
    const SIX = [
      anchors["--color-crayon-rose"].h,
      anchors["--color-crayon-orange"].h,
      anchors["--color-crayon-gold"].h,
      anchors["--color-crayon-green"].h,
      anchors["--color-crayon-blue"].h,
      293.0,
    ];
    for (const k of Object.keys(anchors)) {
      const d = Math.min(...SIX.map((a) => hueDist(anchors[k].h, a)));
      anchors[k].dNearestAnchor = +d.toFixed(2);
      anchors[k].kin = d <= KIN_DEG;
    }
    out[`${eng}/${scheme}`] = { anchorsUsed: SIX.map((x) => +x.toFixed(1)), tokens: anchors };
    await ctx.close();
  }
  await b.close();
}
if (OUT) writeFileSync(OUT, JSON.stringify(out, null, 2));
for (const [cell, v] of Object.entries(out)) {
  const bad = Object.entries(v.tokens).filter(([, t]) => !t.kin && t.C >= 0.05);
  console.log(cell, "anchors", v.anchorsUsed.join(" "));
  console.log(
    "   NOT KIN:",
    bad.map(([k, t]) => `${k} h${t.h} d${t.dNearestAnchor}`).join(" · ") || "(none)",
  );
}

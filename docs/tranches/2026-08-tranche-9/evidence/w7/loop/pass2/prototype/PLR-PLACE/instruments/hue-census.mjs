#!/usr/bin/env node
/**
 * R6 hue census — the accent family, re-derived on THIS tree (T9-W7 round zero).
 *
 * Reads the chromatic tokens out of `src/assets/index.css` by name, converts each to OKLCH,
 * and prints L / C / h so W7 §3's claim ("two blues 15 degrees apart doing different jobs;
 * violet nowhere else") is a measurement rather than a memory. Read-only; writes nothing.
 *
 * sRGB -> linear -> OKLab -> OKLCh, the Bjorn Ottosson matrices.
 */
import fs from "node:fs";
import path from "node:path";

const CSS =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-54/web/frontend/src/assets/index.css";

const srgbToLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

function hexToOklch(hex) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const [r, g, b] = [0, 2, 4].map((i) =>
    srgbToLinear(parseInt(full.slice(i, i + 2), 16) / 255),
  );
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  let hue = (Math.atan2(B, A) * 180) / Math.PI;
  if (hue < 0) hue += 360;
  return { L, C, h: hue };
}

const src = fs.readFileSync(CSS, "utf8");
// The dark block starts at `.dark {`; everything before it is the light :root.
const darkAt = src.indexOf("\n.dark");
const light = src.slice(0, darkAt);
const dark = src.slice(darkAt);

const TOKENS = [
  "--color-user-ink",
  "--color-focus-sketch",
  "--color-progress-ink",
  "--color-crayon-blue",
  "--color-crayon-green",
  "--color-crayon-orange",
  "--color-crayon-rose",
  "--color-crayon-gold",
  "--color-green-ink",
  "--color-orange-ink",
  "--color-red-ink",
  "--color-gold-ink",
  "--color-solver-ink-1",
  "--color-solver-ink-2",
  "--color-solver-ink-3",
  "--color-solver-ink-4",
  "--color-solver-ink-5",
];

function read(block, token) {
  const m = new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,8})`).exec(block);
  return m ? m[1] : null;
}

const rows = [];
for (const t of TOKENS) {
  for (const [regime, block] of [
    ["light", light],
    ["dark", dark],
  ]) {
    const hex = read(block, t);
    if (!hex) continue;
    const { L, C, h } = hexToOklch(hex);
    rows.push({ token: t, regime, hex, L: +L.toFixed(3), C: +C.toFixed(3), h: +h.toFixed(1) });
  }
}

console.log("token,regime,hex,L,C,h");
for (const r of rows)
  console.log(`${r.token},${r.regime},${r.hex},${r.L},${r.C},${r.h}`);

// The two blues the census names, and the gap between them.
const pick = (t, regime) => rows.find((r) => r.token === t && r.regime === regime);
for (const regime of ["light", "dark"]) {
  const u = pick("--color-user-ink", regime);
  const f = pick("--color-focus-sketch", regime);
  if (u && f)
    console.log(
      `\n${regime}: user-ink h=${u.h} vs focus-sketch h=${f.h}  ->  gap ${Math.abs(u.h - f.h).toFixed(1)} deg`,
    );
}

// The golden-angle player walk, against the same circle.
console.log("\nplayer walk (playerIdentity.inkFor, hue = i * 137.5 mod 360), first 8:");
for (let i = 0; i < 8; i++)
  console.log(`  player ${i}: h=${((i * 137.5) % 360).toFixed(1)} deg @ C 0.110`);

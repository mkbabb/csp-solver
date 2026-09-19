// THE RENAME CONTROL, reproduced honestly. ACC-SIX renames chromatic tokens; a family following
// the PASS-1 gate re-derives its arcs from that gate's own NAME LIST, which no longer sees the
// renamed token — so the arcs open over a hue that is still painted, and the walk lands in it.
// This writes exactly that state into scratch copies and runs both gates over it.
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import process from "node:process";

const FE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/web/frontend";
const CSS = `${FE}/src/assets/index.css`;
const IDENT = `${FE}/src/games/shared/playerIdentity.ts`;
const SC =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-59/scratch";

const PASS1_TOKENS =
  /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function hueOf(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return h < 0 ? h + 360 : h;
}
const GUARD = 13;
function arcsFrom(hues) {
  const raw = [];
  for (const h of hues) {
    const a = h - GUARD;
    const b = h + GUARD;
    if (a < 0) raw.push([a + 360, 360], [0, b]);
    else if (b > 360) raw.push([a, 360], [0, b - 360]);
    else raw.push([a, b]);
  }
  raw.sort((p, q) => p[0] - q[0]);
  const merged = [];
  for (const iv of raw) {
    const last = merged[merged.length - 1];
    if (last && iv[0] <= last[1] + 1e-9) last[1] = Math.max(last[1], iv[1]);
    else merged.push([...iv]);
  }
  return merged;
}

// 1 — the rename, both arms. Hue untouched; only the name moves.
const css = readFileSync(CSS, "utf8")
  .replace("--color-solver-ink-4: #047857", "--color-answer-pale: #047857")
  .replace("--color-solver-ink-4: #6ee7b7", "--color-answer-pale: #6ee7b7");
writeFileSync(`${SC}/renamed-index.css`, css);

// 2 — the arcs a family following the PASS-1 gate would now declare.
const seen = [...css.matchAll(PASS1_TOKENS)].map((m) => hueOf(m[2]));
const arcs = arcsFrom(seen);
const body = arcs.map(([a, b]) => `  [${a.toFixed(4)}, ${b.toFixed(4)}],`).join("\n");
const ident = readFileSync(IDENT, "utf8").replace(
  /(RESERVED_ARCS[^=]*=\s*\[)[\s\S]*?(\n\];)/,
  `$1\n${body}$2`,
);
writeFileSync(`${SC}/renamed-playerIdentity.ts`, ident);
console.log(`pass-1 name list now sees ${seen.length} tokens (was 29) → ${arcs.length} arcs`);
console.log(`arcs: ${arcs.map(([a, b]) => `[${a.toFixed(2)},${b.toFixed(2)}]`).join(" ")}`);

// 3 — the walk those arcs produce, and how close it lands to the renamed token's hue.
const open = [];
{
  let cut = 0;
  for (const [a, b] of arcs) {
    if (a > cut) open.push([cut, a]);
    cut = Math.max(cut, b);
  }
  if (cut < 360) open.push([cut, 360]);
}
const span = open.reduce((s, [a, b]) => s + (b - a), 0);
const step = span * ((3 - Math.sqrt(5)) / 2);
const walk = Array.from({ length: 40 }, (_, i) => {
  let p = (((i * step) % span) + span) % span;
  for (const [a, b] of open) {
    if (p < b - a) return a + p;
    p -= b - a;
  }
  return open[open.length - 1][1];
});
const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
for (const [name, hex] of [
  ["answer-pale (light)", "#047857"],
  ["answer-pale (dark)", "#6ee7b7"],
]) {
  const h = hueOf(hex);
  let best = { d: 360, i: -1 };
  walk.forEach((w, i) => {
    const d = gap(w, h);
    if (d < best.d) best = { d, i };
  });
  console.log(
    `nearest hand to ${name} (h ${h.toFixed(2)}): index ${best.i} at ${best.d.toFixed(2)}°`,
  );
}
process.exit(0);

// Were the two NEW tier-1 controls green-lit by the PASS-2 gate? Re-states pass 2's hex-only
// census exactly (`HEX_DECLS`, chroma > 0.06, ±13 merge) and runs the same two doctored sheets
// through check 1. Run from web/frontend.
import { readFileSync } from "node:fs";
import process from "node:process";

const css = readFileSync("src/assets/index.css", "utf8");
const ts = readFileSync("src/games/shared/playerIdentity.ts", "utf8");
const GUARD = 13;
const TOL = 5e-4;
const HEX_DECLS = /(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\b/g;
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function oklchOf(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return { C: Math.hypot(A, B), h: h < 0 ? h + 360 : h };
}
const reservedInksPass2 = (t) =>
  [...t.matchAll(HEX_DECLS)]
    .map((m) => ({ name: m[1], hex: m[2], ...oklchOf(m[2]) }))
    .filter((d) => d.C > 0.06);
function deriveArcs(hues) {
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
function declaredArcs(t) {
  const block = t.match(/RESERVED_ARCS[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!block) return [];
  return [...block[1].matchAll(/\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/g)].map((m) => [
    Number(m[1]),
    Number(m[2]),
  ]);
}
function pass2Check1(t) {
  const inks = reservedInksPass2(t);
  const derived = deriveArcs(inks.map((i) => i.h));
  const declared = declaredArcs(ts);
  const out = [];
  if (derived.length !== declared.length) out.push("arc count");
  for (let i = 0; i < Math.min(derived.length, declared.length); i++)
    for (const e of [0, 1])
      if (Math.abs(derived[i][e] - declared[i][e]) > TOL) out.push(`arc ${i} edge ${e}`);
  return { failures: out, inks: inks.length };
}

const base = pass2Check1(css);
console.log(`pass-2 census on this tree: ${base.inks} chromatic declarations, ${base.failures.length} failure(s)`);

const aliasCss = css.replace(
  "--color-teacher-red: var(\n    --color-crayon-rose\n  )",
  "--color-teacher-red: #009fd4",
);
const a = pass2Check1(aliasCss);
console.log(
  `  re-pointed alias (192 deg): pass-2 gate ${a.failures.length ? "REDS" : "GREEN-LIT (blind)"} — ${a.inks} declarations seen`,
);

const hslCss = css.replace("--color-border: hsl(24 4% 16%)", "--color-border: hsl(192 80% 45%)");
const h = pass2Check1(hslCss);
console.log(
  `  hsl-authored chromatic:     pass-2 gate ${h.failures.length ? "REDS" : "GREEN-LIT (blind)"} — ${h.inks} declarations seen`,
);

const printCss = css.replace(
  "@media print {",
  "@media print {\n  :root { --color-print-test: #009fd4; }",
);
const p = pass2Check1(printCss);
console.log(
  `  chromatic inside @media print: pass-2 gate ${p.failures.length ? "REDS (a print-only hue reserved a screen arc)" : "quiet"}`,
);
process.exit(0);

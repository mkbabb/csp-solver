#!/usr/bin/env node
/**
 * PAL-TIN's SIBLING to `r0/r5-player-mark/instruments-family-law.mjs` — GREEN BY CONSTRUCTION,
 * and it says so. The r0 instrument reads a FORMULA out of `playerIdentity.ts`; a tin has no
 * formula, so this one reads the TABLE (`proto/tin-tokens.css`, the file a cure would land) and
 * puts it against the same 29 reserved inks, out of the same `index.css`, at the same 12deg.
 *
 * TWO gates, not one — because the r0 instrument only ever asked the first, and the first is
 * the one this family passes trivially:
 *
 *   GATE 1  THE FAMILY LAW.  No stick within MIN_SEP degrees of a reserved ink. Green by
 *           construction: the sticks were CUT out of the arcs the reserved inks leave.
 *   GATE 2  THE SEPARATION LAW.  No two sticks closer than MIN_DE in OKLab. This is the gate
 *           the family actually turns on, and it is the one that kills a tin of twelve: hue
 *           degrees measure the distance to an ANCHOR, ΔE measures whether two PLAYERS look
 *           like two people. Born RED against a twelve-stick tin, GREEN against five.
 *
 *   node instruments-family-law-tin.mjs [path/to/tokens.css]
 */
import fs from "node:fs";
import process from "node:process";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const TOKENS = process.argv[2] ?? new URL("../proto/tin-tokens.css", import.meta.url).pathname;
const MIN_SEP = 12; // degrees, the r0 instrument's own floor
const MIN_DE = 0.10; // OKLab, the separation floor this lane proposes and measures

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function oklab(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const hueOf = (hex) => { const [, A, B] = oklab(hex); let h = (Math.atan2(B, A) * 180) / Math.PI; return h < 0 ? h + 360 : h; };
const gap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const dE = (a, b) => { const A = oklab(a), B = oklab(b); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); };

const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const WANT = /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved = [];
for (const hit of css.matchAll(WANT)) reserved.push({ name: hit[1], hex: hit[2] });

const tok = fs.readFileSync(TOKENS, "utf8");
const arm = (block) => { const o = []; for (const m of block.matchAll(/--color-peer-(\d+):\s*(#[0-9a-fA-F]{6})/g)) o.push({ i: +m[1], hex: m[2] }); return o; };
const LIGHT = arm(tok.slice(tok.indexOf(":root"), tok.indexOf(".dark")));
const DARK = arm(tok.slice(tok.indexOf(".dark")));
if (!LIGHT.length || LIGHT.length !== DARK.length) {
  console.error(`INSTRUMENT BROKEN: ${TOKENS} declares ${LIGHT.length} light and ${DARK.length} dark sticks`);
  process.exit(2);
}
console.log(`tin: ${LIGHT.length} sticks, two arms · reserved inks read from index.css: ${reserved.length} · MIN_SEP ${MIN_SEP}deg · MIN_DE ${MIN_DE}`);

/* GATE 1 — the family law, both arms against the whole reserved set */
const g1 = [];
for (const [armName, sticks] of [["light", LIGHT], ["dark", DARK]])
  for (const s of sticks)
    for (const r of reserved) {
      const d = gap(hueOf(s.hex), hueOf(r.hex));
      if (d < MIN_SEP) g1.push(`  COLLISION peer-${s.i} (${armName} ${s.hex}, h=${hueOf(s.hex).toFixed(1)}) vs --color-${r.name} ${r.hex} (h=${hueOf(r.hex).toFixed(1)}): ${d.toFixed(1)}deg < ${MIN_SEP}deg`);
    }
console.log(g1.length ? g1.join("\n") : "  (no collisions)");
console.log(`GATE 1 THE FAMILY LAW: ${g1.length ? `RED — ${g1.length} collisions` : "GREEN — every stick is a pen beside the anchors"}`);

/* GATE 2 — the separation law, within each arm */
const g2 = [];
for (const [armName, sticks] of [["light", LIGHT], ["dark", DARK]])
  for (let i = 0; i < sticks.length; i++)
    for (let j = i + 1; j < sticks.length; j++) {
      const e = dE(sticks[i].hex, sticks[j].hex);
      if (e < MIN_DE) g2.push(`  TOO CLOSE peer-${sticks[i].i} ${sticks[i].hex} vs peer-${sticks[j].i} ${sticks[j].hex} (${armName}): ΔE ${e.toFixed(3)} < ${MIN_DE}`);
    }
console.log(g2.length ? g2.join("\n") : "  (no pair under the floor)");
const worst = Math.min(...["light", "dark"].flatMap((a) => { const s = a === "light" ? LIGHT : DARK; return s.flatMap((x, i) => s.slice(i + 1).map((y) => dE(x.hex, y.hex))); }));
console.log(`GATE 2 THE SEPARATION LAW: ${g2.length ? `RED — ${g2.length} pairs under ΔE ${MIN_DE}` : "GREEN"} · worst pair ΔE ${worst.toFixed(3)}`);

/* the anchor test the family's own law states in words */
const anchors = new Set(reserved.map((r) => r.hex.toLowerCase()));
const isAnchor = [...LIGHT, ...DARK].filter((s) => anchors.has(s.hex.toLowerCase()));
console.log(`ANCHOR TEST: ${isAnchor.length ? `RED — ${isAnchor.map((s) => s.hex).join(", ")} IS a reserved ink` : "GREEN — no player is ever assigned wax or a rainbow stop"}`);

process.exit(g1.length || g2.length || isAnchor.length ? 1 : 0);

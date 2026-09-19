/**
 * PAL-WALK · THE SENSITIVITY SWEEP — what the open arc, the separation and the contrast do as
 * the guard, the chroma and the reserved set move. Plus the CONTROL: the shipped walk
 * (C 0.110, full circle) through the exact same contrast code, so a failure that is INHERITED
 * is never reported as one this family caused.
 */
import fs from "fs";
import {
  ROOT,
  CHROMA,
  buildWalk,
  reservedArcs,
  openArcs,
  measure,
  readReserved,
  gap,
  inGamut,
  oklchToSrgb255,
  contrast,
} from "./arcWalk.mjs";

const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const say = (s = "") => console.log(s);
function hsl(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255));
}
const GROUNDS = {
  "light/bg": [hsl(48, 15, 98), 0.5],
  "light/card": [hsl(60, 9.1, 99.2), 0.5],
  "dark/bg": [hsl(24, 8, 6), 0.8],
  "dark/card": [hsl(24, 6, 7), 0.8],
};

const PHI2 = (3 - Math.sqrt(5)) / 2;
const minSep = (hues, n) => {
  let m = 360;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) m = Math.min(m, gap(hues[i], hues[j]));
  return m;
};

say("═══ A · GUARD SWEEP — the price of each degree of protection ═══");
say("guard | reserved | OPEN  | even-split@16 | golden@16 | golden@8 | golden@24 | narrowest open arc");
const reserved = readReserved(css);
for (const g of [6, 8, 10, 11, 12, 13, 14, 16, 20]) {
  const arcs = reservedArcs(reserved.map((r) => r.h), g);
  const open = openArcs(arcs);
  const L = measure(open);
  const step = L * PHI2;
  const hueAtP = (p) => {
    let rest = p;
    for (const [a, b] of open) {
      const w = b - a;
      if (rest < w) return a + rest;
      rest -= w;
    }
    return open[open.length - 1][1];
  };
  const hues = Array.from({ length: 40 }, (_, i) => hueAtP(((i * step) % L + L) % L));
  const narrow = Math.min(...open.map(([a, b]) => b - a));
  say(
    `${String(g).padStart(5)} | ${measure(arcs).toFixed(1).padStart(8)} | ${L.toFixed(1).padStart(5)} | ` +
      `${(L / 16).toFixed(2).padStart(13)} | ${minSep(hues, 16).toFixed(2).padStart(9)} | ` +
      `${minSep(hues, 8).toFixed(2).padStart(8)} | ${minSep(hues, 24).toFixed(2).padStart(9)} | ` +
      `${narrow.toFixed(1)} (${open.length} arcs)`,
  );
}
say();

say("═══ B · PER-THEME RESERVED SETS — what a two-hue walk would buy ═══");
// light-theme reserved: the :root block only; dark: the .dark block only
const rootBlock = css.slice(0, css.indexOf("/* Dark theme */"));
const darkBlock = css.slice(css.indexOf("/* Dark theme */"));
for (const [label, block] of [["light (:root)", rootBlock], ["dark (.dark)", darkBlock]]) {
  const rs = readReserved(block);
  const arcs = reservedArcs(rs.map((r) => r.h), 12);
  const open = openArcs(arcs);
  const L = measure(open);
  const step = L * PHI2;
  const hueAtP = (p) => {
    let rest = p;
    for (const [a, b] of open) {
      const w = b - a;
      if (rest < w) return a + rest;
      rest -= w;
    }
    return open[open.length - 1][1];
  };
  const hues = Array.from({ length: 40 }, (_, i) => hueAtP(((i * step) % L + L) % L));
  say(
    `  ${label.padEnd(14)} hexes ${String(rs.length).padStart(2)} · reserved ${measure(arcs).toFixed(1)} · OPEN ${L.toFixed(1)} · ` +
      `golden@16 ${minSep(hues, 16).toFixed(2)} · golden@8 ${minSep(hues, 8).toFixed(2)} · arcs ${open.length}`,
  );
}
say();

say("═══ C · CHROMA SWEEP at the arc walk (guard 12, golden-scaled) ═══");
const w = buildWalk(css, "scaled");
say("chroma | out-of-gamut L0.5 | out L0.8 | worst AA light/bg | light/card | dark/bg | dark/card | ring0.55 worst light");
for (const C of [0.11, 0.13, 0.14, 0.15, 0.166]) {
  const og = (L) => Array.from({ length: 144 }, (_, i) => inGamut(L, C, w.hueAt(i))).filter((x) => !x).length;
  const worstOn = ([rgb, L], alpha = 1) => {
    let m = 99;
    for (let i = 0; i < 144; i++) {
      const fg = oklchToSrgb255(L, C, w.hueAt(i));
      const b = alpha === 1 ? fg : fg.map((v, k) => Math.round(alpha * v + (1 - alpha) * rgb[k]));
      m = Math.min(m, contrast(b, rgb));
    }
    return m;
  };
  say(
    `${C.toFixed(3).padStart(6)} | ${String(og(0.5)).padStart(17)} | ${String(og(0.8)).padStart(8)} | ` +
      `${worstOn(GROUNDS["light/bg"]).toFixed(2).padStart(17)} | ${worstOn(GROUNDS["light/card"]).toFixed(2).padStart(10)} | ` +
      `${worstOn(GROUNDS["dark/bg"]).toFixed(2).padStart(7)} | ${worstOn(GROUNDS["dark/card"]).toFixed(2).padStart(9)} | ` +
      `${worstOn(GROUNDS["light/bg"], 0.55).toFixed(2)}`,
  );
}
say();

say("═══ D · THE CONTROL — the SHIPPED walk (C 0.110, full circle) through this same code ═══");
const shipped = (i) => (i * 137.5) % 360;
for (const [name, [rgb, L]] of Object.entries(GROUNDS)) {
  const worst = (alpha) => {
    let m = { r: 99 };
    for (let i = 0; i < 144; i++) {
      const fg = oklchToSrgb255(L, 0.11, shipped(i));
      const b = alpha === 1 ? fg : fg.map((v, k) => Math.round(alpha * v + (1 - alpha) * rgb[k]));
      const r = contrast(b, rgb);
      if (r < m.r) m = { r, i };
    }
    return m;
  };
  const opaque = worst(1),
    ring = worst(0.55),
    trace = worst(0.95);
  say(
    `  ${name.padEnd(11)} opaque ${opaque.r.toFixed(2)}:1 · ring@0.55 ${ring.r.toFixed(2)}:1 ${ring.r >= 3 ? "PASS" : "FAIL"} (i=${ring.i}) · trace@0.95 ${trace.r.toFixed(2)}:1 ${trace.r >= 3 ? "PASS" : "FAIL"}`,
  );
}
say();
say("═══ E · WHERE THE SIXTEEN FALL, arc by arc (guard 12, golden-scaled) ═══");
const w2 = buildWalk(css, "scaled");
const bucket = new Map(w2.open.map(([a, b]) => [`${a.toFixed(1)}-${b.toFixed(1)}`, 0]));
for (let i = 0; i < 16; i++) {
  const h = w2.hueAt(i);
  for (const [a, b] of w2.open)
    if (h >= a - 1e-6 && h <= b + 1e-6) bucket.set(`${a.toFixed(1)}-${b.toFixed(1)}`, bucket.get(`${a.toFixed(1)}-${b.toFixed(1)}`) + 1);
}
for (const [k, v] of bucket) say(`  open arc ${k}: ${v} of the first 16`);

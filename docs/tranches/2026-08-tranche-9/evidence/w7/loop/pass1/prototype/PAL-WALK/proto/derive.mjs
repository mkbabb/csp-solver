import fs from "fs";
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-49/web/frontend";
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function srgbToOklch(h) {
  const n = parseInt(h.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b),
    m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b),
    s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let hh = (Math.atan2(B, A) * 180) / Math.PI;
  if (hh < 0) hh += 360;
  return { L, C: Math.hypot(A, B), h: hh };
}
function oklchToLinear(L, C, hDeg) {
  const a = C * Math.cos((hDeg * Math.PI) / 180),
    b = C * Math.sin((hDeg * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (L, C, h) => oklchToLinear(L, C, h).every((v) => v >= -1e-4 && v <= 1 + 1e-4);
const toSrgb = (L, C, h) =>
  oklchToLinear(L, C, h).map((v) => Math.round(255 * unlin(Math.min(1, Math.max(0, v)))));
const relLum = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const contrast = (a, b) => {
  const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const WANT =
  /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved = [...css.matchAll(WANT)].map((m) => ({ name: m[1], hex: m[2], ...srgbToOklch(m[2]) }));
console.log("reserved hex count:", reserved.length);
const GUARD = 12.25;
function reservedArcs(hues, guard) {
  const raw = [];
  for (const h of hues) {
    let a = h - guard,
      b = h + guard;
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
function openArcs(arcs) {
  const open = [];
  let c = 0;
  for (const [a, b] of arcs) {
    if (a > c + 1e-9) open.push([c, a]);
    c = Math.max(c, b);
  }
  if (c < 360 - 1e-9) open.push([c, 360]);
  return open;
}
const arcs = reservedArcs(reserved.map((r) => r.h), GUARD);
const open = openArcs(arcs);
const L = open.reduce((s, [a, b]) => s + (b - a), 0);
console.log("RESERVED ARCS:", JSON.stringify(arcs.map((a) => a.map((x) => +x.toFixed(4)))));
console.log("OPEN ARCS:", JSON.stringify(open.map((a) => a.map((x) => +x.toFixed(4)))), "total", L.toFixed(4));
const PHI2 = (3 - Math.sqrt(5)) / 2;
const STEP = L * PHI2;
console.log("STEP", STEP.toFixed(4));
function hueAt(i) {
  let p = (((i * STEP) % L) + L) % L;
  for (const [a, b] of open) {
    const w = b - a;
    if (p < w) return a + p;
    p -= w;
  }
  return open[open.length - 1][1] - 1e-9;
}
function ceilC(h, Lb) {
  let lo = 0,
    hi = 0.4;
  for (let k = 0; k < 40; k++) {
    const mid = (lo + hi) / 2;
    if (inGamut(Lb, mid, h)) lo = mid;
    else hi = mid;
  }
  return lo;
}
const WAX = 0.166;
const hues = [],
  Cs = [];
for (let i = 0; i < 144; i++) {
  const h = hueAt(i);
  hues.push(h);
  Cs.push(Math.min(WAX, ceilC(h, 0.5), ceilC(h, 0.8)));
}
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
console.log("C: mean", mean(Cs).toFixed(4), "min", Math.min(...Cs).toFixed(4), "max", Math.max(...Cs).toFixed(4));
console.log("C first16: mean", mean(Cs.slice(0, 16)).toFixed(4), "min", Math.min(...Cs.slice(0, 16)).toFixed(4));
console.log("at wax (C==0.166):", Cs.filter((c) => c >= WAX - 1e-9).length, "/144");
const sep = (n) => {
  let m = 360,
    pair = null;
  for (let i = 0; i < n; i++)
    for (let k = i + 1; k < n; k++) {
      const d = gap(hues[i], hues[k]);
      if (d < m) {
        m = d;
        pair = [i, k];
      }
    }
  return { m, pair };
};
for (const n of [4, 8, 16, 24, 40]) {
  const s = sep(n);
  console.log(`sep@${n}: ${s.m.toFixed(2)}deg pair ${s.pair}`);
}
let room = 1;
for (let n = 2; n <= 144; n++) {
  if (sep(n).m >= 12) room = n;
  else break;
}
console.log("room size at 12deg floor (requested):", room);
let hits = 0;
for (let i = 0; i < 40; i++) for (const r of reserved) if (gap(hues[i], r.h) < 12) hits++;
console.log("family law collisions over 40 (requested):", hits);
for (const Lb of [0.5, 0.8]) {
  const px = hues.map((h, i) => toSrgb(Lb, Cs[i], h));
  const lum = px.map(relLum);
  console.log(`L=${Lb}: ink relLum min ${Math.min(...lum).toFixed(4)} max ${Math.max(...lum).toFixed(4)}`);
}
console.log("first 16 hues:", hues.slice(0, 16).map((h) => +h.toFixed(2)).join(" "));
console.log("first 16 C:", Cs.slice(0, 16).map((c) => +c.toFixed(4)).join(" "));
fs.writeFileSync(
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk/walk.json",
  JSON.stringify({ guard: GUARD, arcs, open, L, step: STEP, hues, C: Cs }, null, 1),
);

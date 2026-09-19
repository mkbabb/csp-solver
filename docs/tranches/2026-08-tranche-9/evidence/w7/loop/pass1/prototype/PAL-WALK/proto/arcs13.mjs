import fs from "fs";
const ROOT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-49/web/frontend";
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function srgbToOklch(h) {
  const n = parseInt(h.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b),
    m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b),
    s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let hh = (Math.atan2(B, A) * 180) / Math.PI;
  if (hh < 0) hh += 360;
  return { C: Math.hypot(A, B), h: hh };
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
const inGamut = (L, C, h) => oklchToLinear(L, C, h).every((v) => v >= -1e-4 && v <= 1.0001);
const ceilC = (h, Lb) => {
  if (inGamut(Lb, 0.166, h)) return 0.166;
  let lo = 0,
    hi = 0.166;
  for (let k = 0; k < 20; k++) {
    const mid = (lo + hi) / 2;
    if (inGamut(Lb, mid, h)) lo = mid;
    else hi = mid;
  }
  return lo;
};
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const WANT =
  /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved = [...css.matchAll(WANT)].map((m) => ({ name: m[1], hex: m[2], ...srgbToOklch(m[2]) }));
const GUARD = 13;
const raw = [];
for (const h of reserved.map((r) => r.h)) {
  const a = h - GUARD,
    b = h + GUARD;
  if (a < 0) raw.push([a + 360, 360], [0, b]);
  else if (b > 360) raw.push([a, 360], [0, b - 360]);
  else raw.push([a, b]);
}
raw.sort((p, q) => p[0] - q[0]);
const arcs = [];
for (const iv of raw) {
  const last = arcs[arcs.length - 1];
  if (last && iv[0] <= last[1] + 1e-9) last[1] = Math.max(last[1], iv[1]);
  else arcs.push([...iv]);
}
console.log("ARCS:");
for (const [a, b] of arcs) console.log(`  [${a.toFixed(4)}, ${b.toFixed(4)}]  width ${(b - a).toFixed(2)}`);
const open = [];
let cut = 0;
for (const [a, b] of arcs) {
  if (a > cut) open.push([cut, a]);
  cut = Math.max(cut, b);
}
if (cut < 360) open.push([cut, 360]);
const span = open.reduce((s, [a, b]) => s + (b - a), 0);
const step = span * ((3 - Math.sqrt(5)) / 2);
console.log("OPEN:", JSON.stringify(open.map((x) => x.map((v) => +v.toFixed(3)))), "span", span.toFixed(4), "step", step.toFixed(4));
const hueAt = (i) => {
  let p = (((i * step) % span) + span) % span;
  for (const [a, b] of open) {
    if (p < b - a) return a + p;
    p -= b - a;
  }
  return open[open.length - 1][1];
};
const hues = Array.from({ length: 16 }, (_, i) => hueAt(i));
for (let i = 0; i < 4; i++) {
  const C = Math.min(0.166, ceilC(hues[i], 0.5), ceilC(hues[i], 0.8));
  console.log(i, `oklch(var(--peer-ink-l) ${C.toFixed(4)} ${hues[i].toFixed(2)}deg)`);
}
const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
const sep = (n) => {
  let m = 360;
  for (let i = 0; i < n; i++) for (let k = i + 1; k < n; k++) m = Math.min(m, gap(hues[i], hues[k]));
  return m;
};
console.log("sep@8", sep(8).toFixed(3), "sep@9", sep(9).toFixed(3));

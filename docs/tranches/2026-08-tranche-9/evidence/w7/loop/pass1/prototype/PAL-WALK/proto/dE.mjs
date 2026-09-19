/**
 * PERCEPTUAL separation, not hue separation. A 12° hue gap at chroma 0.09 is not the same
 * distance as a 12° gap at chroma 0.17: OKLab ΔE says how far apart two inks actually are.
 * Read off the PAINTED bytes of the prototype, and compared with the shipped walk's own.
 */
import fs from "fs";
const DIR =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk/readings";
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const toLab = ([R, G, B]) => {
  const [r, g, b] = [R, G, B].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const dE = (a, b) => Math.hypot(...toLab(a).map((v, i) => v - toLab(b)[i]));
function oklchToSrgb(L, C, hDeg) {
  const a = C * Math.cos((hDeg * Math.PI) / 180),
    b = C * Math.sin((hDeg * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.round(255 * unlin(Math.min(1, Math.max(0, v)))));
}
const j = JSON.parse(fs.readFileSync(`${DIR}/bytes-chromium-light.json`, "utf8"));
const px = j.painted.map((p) => p.rgb.split(",").map(Number));
const worstPair = (n, rgbs) => {
  let m = 9,
    pair = null;
  for (let i = 0; i < n; i++)
    for (let k = i + 1; k < n; k++) {
      const d = dE(rgbs[i], rgbs[k]);
      if (d < m) {
        m = d;
        pair = [i, k];
      }
    }
  return { m, pair };
};
console.log("── PAL-WALK prototype, painted, light (L 0.5) ──");
for (const n of [2, 3, 4, 5, 6, 7, 8, 16]) {
  const w = worstPair(n, px);
  console.log(`  worst ΔE(OKLab) among the first ${String(n).padStart(2)}: ${w.m.toFixed(4)} (i=${w.pair[0]}, j=${w.pair[1]})`);
}
// the SHIPPED walk, same band, its own flat chroma
const head = Array.from({ length: 16 }, (_, i) => oklchToSrgb(0.5, 0.11, (i * 137.5) % 360));
console.log("── the shipped full-circle walk at 0.11, same band ──");
for (const n of [2, 3, 4, 5, 6, 7, 8, 16]) {
  const w = worstPair(n, head);
  console.log(`  worst ΔE(OKLab) among the first ${String(n).padStart(2)}: ${w.m.toFixed(4)} (i=${w.pair[0]}, j=${w.pair[1]})`);
}
// references: the five light crayons against each other, and graphite vs paper
const wax = ["#2dc653", "#f4a236", "#e8315b", "#4a90d9", "#c99a2e"].map((h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
});
console.log("── references ──");
console.log(`  worst ΔE between two of the five light crayons: ${worstPair(5, wax).m.toFixed(4)}`);
console.log(`  ΔE between the prototype's own indices 0 and 1: ${dE(px[0], px[1]).toFixed(4)}`);

import fs from "fs";
const w = JSON.parse(
  fs.readFileSync(
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk/walk.json",
    "utf8",
  ),
);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
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
const ceilC = (h, Lb) => {
  let lo = 0,
    hi = 0.4;
  for (let k = 0; k < 40; k++) {
    const mid = (lo + hi) / 2;
    if (inGamut(Lb, mid, h)) lo = mid;
    else hi = mid;
  }
  return lo;
};
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const WAX = 0.166;
const light = w.hues.map((h) => Math.min(WAX, ceilC(h, 0.5)));
const dark = w.hues.map((h) => Math.min(WAX, ceilC(h, 0.8)));
const both = w.hues.map((h, i) => Math.min(light[i], dark[i]));
const r = (a) => `mean ${mean(a).toFixed(4)} min ${Math.min(...a).toFixed(4)} atWax ${a.filter((c) => c >= WAX - 1e-9).length}`;
console.log("light-only ceiling:", r(light));
console.log("dark-only  ceiling:", r(dark));
console.log("min of both       :", r(both));
console.log("first16 light:", light.slice(0, 16).map((c) => +c.toFixed(4)).join(" "));
console.log("first16 dark :", dark.slice(0, 16).map((c) => +c.toFixed(4)).join(" "));
// how often does dark bind in light mode
let darkBinds = 0;
for (let i = 0; i < 144; i++) if (dark[i] < light[i] - 1e-6) darkBinds++;
console.log("dark binds (dark ceiling lower):", darkBinds, "/144");
console.log(
  "loss in light from taking the min: mean",
  (mean(light) - mean(both)).toFixed(4),
  "| loss in dark: mean",
  (mean(dark) - mean(both)).toFixed(4),
);

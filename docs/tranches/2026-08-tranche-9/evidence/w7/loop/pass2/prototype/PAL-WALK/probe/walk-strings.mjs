// The ink strings playerIdentity.ts will emit at the moved bands and the raised cap — computed
// with the module's own arithmetic so the unit pins are the module's, not a wish.
const RESERVED_ARCS = [
  [0, 27.1616],
  [51.1659, 108.7459],
  [133.985, 178.6121],
  [236.3332, 275.8809],
  [279.7172, 306.5712],
  [333.0184, 360],
];
const OPEN = [];
{
  let cut = 0;
  for (const [a, b] of RESERVED_ARCS) {
    if (a > cut) OPEN.push([cut, a]);
    cut = Math.max(cut, b);
  }
  if (cut < 360) OPEN.push([cut, 360]);
}
const SPAN = OPEN.reduce((s, [a, b]) => s + (b - a), 0);
const STEP = SPAN * ((3 - Math.sqrt(5)) / 2);
const hueAt = (index) => {
  let p = (((index * STEP) % SPAN) + SPAN) % SPAN;
  for (const [a, b] of OPEN) {
    if (p < b - a) return a + p;
    p -= b - a;
  }
  return OPEN[OPEN.length - 1][1];
};
const inGamut = (l, c, h) => {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const x = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const y = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const z = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z,
    -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z,
    -0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z,
  ].every((v) => v >= -1e-4 && v <= 1.0001);
};
const CAP = 0.215;
const LIGHT = Number(process.argv[2] ?? 0.44);
const DARK = Number(process.argv[3] ?? 0.65);
const chromaAt = (h) => {
  const holds = (c) => inGamut(LIGHT, c, h) && inGamut(DARK, c, h);
  if (holds(CAP)) return CAP;
  let lo = 0;
  let hi = CAP;
  for (let k = 0; k < 20; k++) {
    const mid = (lo + hi) / 2;
    if (holds(mid)) lo = mid;
    else hi = mid;
  }
  return lo;
};
console.log(`SPAN ${SPAN.toFixed(4)}  STEP ${STEP.toFixed(4)}  bands ${LIGHT}/${DARK}  cap ${CAP}`);
const all = Array.from({ length: 144 }, (_, i) => {
  const h = hueAt(i);
  return { i, h, C: chromaAt(h) };
});
for (const x of all.slice(0, 8))
  console.log(`  ${x.i}: oklch(var(--peer-ink-l) ${x.C.toFixed(4)} ${x.h.toFixed(2)}deg)`);
console.log(
  `mean C over 144 ${(all.reduce((s, x) => s + x.C, 0) / 144).toFixed(4)} · at the cap ${all.filter((x) => x.C >= CAP - 1e-9).length}/144 · min ${Math.min(...all.map((x) => x.C)).toFixed(4)}`,
);

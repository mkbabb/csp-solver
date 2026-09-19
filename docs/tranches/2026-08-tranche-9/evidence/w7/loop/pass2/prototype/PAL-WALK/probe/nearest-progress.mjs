// Which hand now lands nearest --color-progress-ink, and how far — the number
// HandDrawnGrid.vue:601's comment cites, re-derived for the arc walk.
const ARCS = [
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
  for (const [a, b] of ARCS) {
    if (a > cut) OPEN.push([cut, a]);
    cut = Math.max(cut, b);
  }
  if (cut < 360) OPEN.push([cut, 360]);
}
const SPAN = OPEN.reduce((s, [a, b]) => s + (b - a), 0);
const STEP = SPAN * ((3 - Math.sqrt(5)) / 2);
const into = (h, a, b) =>
  Math.min(
    Math.max(Math.round(h * 100) / 100, Math.ceil(a * 100) / 100),
    Math.floor(b * 100) / 100,
  );
const hueAt = (i) => {
  let p = (((i * STEP) % SPAN) + SPAN) % SPAN;
  for (const [a, b] of OPEN) {
    if (p < b - a) return into(a + p, a, b);
    p -= b - a;
  }
  const [a, b] = OPEN[OPEN.length - 1];
  return into(b, a, b);
};
const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
for (const [name, h] of [
  ["--color-progress-ink light (292.72°)", 292.72],
  ["--color-progress-ink dark (293.01°)", 293.01],
]) {
  const rows = Array.from({ length: 40 }, (_, i) => ({ i, d: gap(hueAt(i), h), h: hueAt(i) }));
  rows.sort((p, q) => p.d - q.d);
  console.log(
    `${name}: nearest hands ${rows
      .slice(0, 3)
      .map((r) => `i=${r.i} at ${r.h.toFixed(2)}° (${r.d.toFixed(2)}° away)`)
      .join(", ")}`,
  );
}
console.log(`index 2 is now ${hueAt(2).toFixed(2)}° (was 275.0° under the 137.5° walk)`);

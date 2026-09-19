/**
 * T9-W7 pass 3 · MRK-ABS RESEARCH · R3 — the ink ledger, recomputed from the DECLARED tokens.
 *
 * Every hex/hsl below is quoted from `src/assets/index.css` at 74a2b5d9 with its line. Nothing
 * here is a browser reading; it is the arithmetic the estate's own comments state, redone, so
 * pass 3 knows which of those comments is true. WCAG 2.x relative luminance / 1.4.11 ratios.
 *
 *   :134 --color-background  hsl(48 15% 98%)   :363 (dark) hsl(24 8% 6%)
 *   :136 --color-card        hsl(48 12% 99%)   :365 (dark) hsl(24 6% 7%)
 *   :308 --grid-line-color   hsl(0 0% 15%)     :401 (dark) hsl(48 10% 80%)
 *   :173 --color-crayon-blue #4a90d9           :381 (dark) #6aabeb
 *   :219 --color-focus-sketch #3a7bc4          ---- NO DARK ARM AT HEAD ----
 *
 * Run: node <this>   (no deps)
 */
const hsl = (h, s, l) => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const t = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return t.map((v) => Math.round((v + m) * 255));
};
const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const lin = (v) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : Math.pow((v / 255 + 0.055) / 1.055, 2.4));
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [x, y] = [L(a), L(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const over = (fg, bg, a) => fg.map((v, i) => a * v + (1 - a) * bg[i]);

const T = {
  bgL: hsl(48, 15, 98),
  cardL: hsl(48, 12, 99),
  ruleL: hsl(0, 0, 15),
  bgD: hsl(24, 8, 6),
  cardD: hsl(24, 6, 7),
  ruleD: hsl(48, 10, 80),
  sketch: hex("#3a7bc4"),
  blueL: hex("#4a90d9"),
  blueD: hex("#6aabeb"),
};

console.log("T9-W7 pass 3 · MRK-ABS R3 — the ring's ink, from the declared tokens\n");
console.log("A · THE BOARD RING (`.cell-ghost-path`, tier 2) vs paper — WCAG 1.4.11 floor 3.0");
const rows = [
  ["LIGHT  HEAD  #3a7bc4 @0.90 over --color-card", over(T.sketch, T.cardL, 0.9), T.cardL],
  ["LIGHT  HEAD  #3a7bc4 @0.90 over --color-background", over(T.sketch, T.bgL, 0.9), T.bgL],
  ["LIGHT  proto #3a7bc4 @0.95 over --color-card", over(T.sketch, T.cardL, 0.95), T.cardL],
  ["DARK   HEAD  #3a7bc4 @0.90 over --color-card  (NO dark arm — :219 inherits)", over(T.sketch, T.cardD, 0.9), T.cardD],
  ["DARK   HEAD  #3a7bc4 @0.90 over --color-background", over(T.sketch, T.bgD, 0.9), T.bgD],
  ["DARK   proto #6aabeb @0.95 over --color-card  (the alias)", over(T.blueD, T.cardD, 0.95), T.cardD],
  ["DARK   proto #6aabeb @0.95 over --color-background", over(T.blueD, T.bgD, 0.95), T.bgD],
];
for (const [label, ink, ground] of rows)
  console.log(`  ${label.padEnd(66)} ${ratio(ink, ground).toFixed(3)}`);

console.log("\nB · RING vs RULE — the near-merge the family exists to cure (they must read APART)");
const pairs = [
  ["LIGHT HEAD  ring #3a7bc4@0.90 vs rule hsl(0 0% 15%)", over(T.sketch, T.cardL, 0.9), T.ruleL],
  ["LIGHT proto ring #3a7bc4@0.95 vs rule", over(T.sketch, T.cardL, 0.95), T.ruleL],
  ["DARK  HEAD  ring #3a7bc4@0.90 vs rule hsl(48 10% 80%)", over(T.sketch, T.cardD, 0.9), T.ruleD],
  ["DARK  proto ring #6aabeb@0.95 vs rule", over(T.blueD, T.cardD, 0.95), T.ruleD],
];
for (const [label, a, b] of pairs) console.log(`  ${label.padEnd(66)} ${ratio(a, b).toFixed(3)}`);

console.log("\nC · THE TOKEN RING (`2px solid color-mix(--color-foreground 40%/45%)`) vs its grounds");
const fgL = hsl(0, 0, 3.9),
  fgD = hsl(48, 10, 92);
for (const [label, ink, ground] of [
  ["LIGHT 40% foreground over --color-card", over(fgL, T.cardL, 0.4), T.cardL],
  ["LIGHT 45% foreground over --color-card", over(fgL, T.cardL, 0.45), T.cardL],
  ["LIGHT 40% foreground over --color-background", over(fgL, T.bgL, 0.4), T.bgL],
  ["DARK  40% foreground over --color-card", over(fgD, T.cardD, 0.4), T.cardD],
  ["DARK  45% foreground over --color-card", over(fgD, T.cardD, 0.45), T.cardD],
  ["DARK  40% foreground over --color-background", over(fgD, T.bgD, 0.4), T.bgD],
])
  console.log(`  ${label.padEnd(66)} ${ratio(ink, ground).toFixed(3)}`);

console.log("\nD · THE FAMILY'S PROPOSED ONE TOKEN (#3a7bc4 light / #6aabeb dark, solid 2px)");
for (const [label, ink, ground] of [
  ["LIGHT #3a7bc4 over --color-card", T.sketch, T.cardL],
  ["LIGHT #3a7bc4 over --color-background", T.sketch, T.bgL],
  ["DARK  #6aabeb over --color-card", T.blueD, T.cardD],
  ["DARK  #6aabeb over --color-background", T.blueD, T.bgD],
])
  console.log(`  ${label.padEnd(66)} ${ratio(ink, ground).toFixed(3)}`);

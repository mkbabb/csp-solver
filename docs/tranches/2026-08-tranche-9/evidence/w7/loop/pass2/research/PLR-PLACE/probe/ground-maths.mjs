/**
 * PLR-PLACE pass-2 research — THE GROUND THE PHONE GIVES A HEAD DISCLOSURE.
 *
 * The card's rule is `background: color-mix(in srgb, var(--color-popover) 80%, transparent)`
 * (AttributionCard.vue:169), so what a reader's eye meets inside the sheet is
 *     composite = 0.8 * popover + 0.2 * whatever is behind it.
 * Pass 1 measured AA on four CLEAN grounds (background / card, light / dark). On a phone the
 * sheet laps the wordmark and the board's digits, and the ground there is none of those four.
 *
 * Every rgb below is a USED value read off HEAD by `place-r2b.spec.ts` arm G, both engines
 * identical (logs/r2b-{chromium,webkit}.json). Nothing here is declared-value arithmetic.
 *
 * Run: node ground-maths.mjs
 */

// ── used values, read off HEAD (arm G, both engines byte-identical) ─────────────────────────
const USED = {
  light: {
    popover: [252, 251, 251],
    background: [251, 250, 249],
    card: [253, 253, 252],
    graphite: [38, 38, 38], // --color-pencil-graphite, and the board digit's own fill
    foreground: [10, 10, 10], // the wordmark's ink
    userInk: [0x25, 0x63, 0xeb],
    peerInkL: 0.5,
  },
  dark: {
    popover: [18, 16, 15],
    background: [17, 15, 14],
    card: [19, 18, 17],
    graphite: [209, 207, 199],
    foreground: [237, 236, 233],
    userInk: [0x60, 0xa5, 0xfa],
    peerInkL: 0.8,
  },
};
const POPOVER_ALPHA = 0.8;

// ── sRGB / WCAG ────────────────────────────────────────────────────────────────────────────
const lin = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const over = (fg, alpha, bg) => fg.map((c, i) => alpha * c + (1 - alpha) * bg[i]);

// ── oklch -> sRGB (the peer-walk formula, playerIdentity.ts / R6 law 22) ────────────────────
function oklchToSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3,
    m = m_ ** 3,
    s = s_ ** 3;
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const enc = (v) => {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(c * 255)));
  };
  return [enc(r), enc(g), enc(bb)];
}
const peerInk = (i, L) => oklchToSrgb(L, 0.11, (i * 137.5) % 360);

// ── the grounds ────────────────────────────────────────────────────────────────────────────
for (const theme of ["light", "dark"]) {
  const U = USED[theme];
  const grounds = {
    "clean · background": U.background,
    "clean · card": U.card,
    "sheet 80% over background": over(U.popover, POPOVER_ALPHA, U.background),
    "sheet 80% over a board digit": over(U.popover, POPOVER_ALPHA, U.graphite),
    "sheet 80% over the wordmark": over(U.popover, POPOVER_ALPHA, U.foreground),
  };
  console.log(`\n================ ${theme.toUpperCase()} ================`);
  for (const [name, g] of Object.entries(grounds)) {
    const quiet = over(U.graphite, 0.68, g); // --ink-press-quiet resolved ON this ground
    const rule = over(U.graphite, 0.55, g); // --ink-press-rule
    const worstDot = Array.from({ length: 40 }, (_, i) => peerInk(i + 1, U.peerInkL)).reduce(
      (w, c) => (ratio(c, g) < ratio(w, g) ? c : w),
    );
    console.log(
      `${name.padEnd(30)} rgb(${g.map((v) => v.toFixed(1)).join(",")})  L=${lum(g).toFixed(4)}`,
    );
    const row = (label, ink) =>
      console.log(`    ${label.padEnd(22)} ${ratio(ink, g).toFixed(2)}:1`);
    row("names · graphite", U.graphite);
    row("quiet · 68% graphite", quiet);
    row("rule · 55% graphite", rule);
    row("your ring · user ink", U.userInk);
    row("worst peer dot (40)", worstDot);
  }
}

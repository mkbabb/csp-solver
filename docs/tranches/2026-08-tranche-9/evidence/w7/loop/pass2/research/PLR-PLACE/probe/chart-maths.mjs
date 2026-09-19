/**
 * PLR-PLACE pass-2 research — the chart's two arithmetic questions.
 *
 *  1 · THE 16x16 ARM. Pass 1 drew it (pitch 6px, r 2.5) and never screenshotted it. The
 *      question a picture would answer is whether two peers on ADJACENT cells read as two
 *      dots; that is a gap in px, and a gap in px is arithmetic.
 *  2 · ATTRIBUTION PAST FOUR. "Claimed only to N = 4" is a claim about how far apart two
 *      peer inks are. The walk is `oklch(--peer-ink-l 0.11 (i * 137.5 deg))` (R6 law 22), so
 *      the separation is computable exactly, in oklab, for any N.
 *
 * Run: node chart-maths.mjs
 */

const CHART = 96; // px, the pass-1 chart's box
const DOT_R = { 9: 4, 16: 2.5 }; // pass-1's declared radii

console.log("=== 1 · the chart's pitch, and whether adjacent dots separate ===");
console.log(
  `${"board".padEnd(7)}${"pitch".padEnd(9)}${"r".padEnd(7)}${"dot w".padEnd(8)}${"gap between adjacent dots".padEnd(28)}r/pitch`,
);
for (const [n, label] of [
  [4, "4x4"],
  [9, "9x9"],
  [16, "16x16"],
]) {
  const pitch = CHART / n;
  const r = DOT_R[n] ?? +(0.375 * pitch).toFixed(2);
  const gap = pitch - 2 * r;
  console.log(
    `${label.padEnd(7)}${pitch.toFixed(3).padEnd(9)}${String(r).padEnd(7)}${(2 * r).toFixed(2).padEnd(8)}${gap.toFixed(3).padEnd(28)}${(r / pitch).toFixed(3)}`,
  );
}
console.log(
  `\nHOLD THE PITCH INSTEAD OF THE BOX: chart = 10.667 * N keeps the 9x9 dot and the 9x9 gap`,
);
for (const n of [4, 9, 16]) {
  const box = (CHART / 9) * n;
  console.log(
    `  ${String(n).padStart(2)}x${n}: chart ${box.toFixed(1)}px, dot 8.00px, gap 2.667px` +
      (box > 224 ? "  <-- OVER the 224px the 256 sheet can hold" : ""),
  );
}
console.log(
  `  the phone sheet's inner width is 256 - 2*16 = 224px; the 16x16 chart at held pitch is 170.7px`,
);
console.log(`  and it adds ${(170.67 - 96).toFixed(1)}px of sheet height over the 96px arm.`);

// ── 2 · the peer walk's separation ──────────────────────────────────────────────────────────
const oklab = (L, C, hDeg) => {
  const h = (hDeg * Math.PI) / 180;
  return [L, C * Math.cos(h), C * Math.sin(h)];
};
const dE = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

console.log("\n=== 2 · how far apart two peer inks are, oklab dE, C = 0.11 ===");
for (const L of [0.5, 0.8]) {
  console.log(`  --peer-ink-l ${L}`);
  for (const N of [2, 3, 4, 5, 6, 8, 10, 15, 20]) {
    const inks = Array.from({ length: N }, (_, i) => oklab(L, 0.11, ((i + 1) * 137.5) % 360));
    let min = Infinity;
    let minHue = 0;
    for (let i = 0; i < N; i++)
      for (let j = i + 1; j < N; j++) {
        const d = dE(inks[i], inks[j]);
        if (d < min) {
          min = d;
          const hi = ((i + 1) * 137.5) % 360;
          const hj = ((j + 1) * 137.5) % 360;
          minHue = Math.min(Math.abs(hi - hj), 360 - Math.abs(hi - hj));
        }
      }
    console.log(
      `    N=${String(N).padStart(2)}  closest pair: dE ${min.toFixed(4)}  (hue ${minHue.toFixed(1)} deg apart)`,
    );
  }
}
console.log(
  `\n  A "just noticeable" oklab dE is ~0.02 for large flat fields and rises steeply as the\n` +
    `  patch shrinks; an 8px dot is not a large flat field. The number the spec needs is not\n` +
    `  a threshold it can cite but the RANK: the closest pair at N=4 is 3.0x further apart\n` +
    `  than the closest pair at N=15.`,
);

// ── 3 · what a 96px chart costs the sheet, and the lap law ─────────────────────────────────
console.log("\n=== 3 · the lap, as a law of two variables (HEAD's board-top measured) ===");
console.log("  grid top at 390 wide, coarse, BOTH engines (probe arm B, r2-*.json):");
console.log("    vh >= 592:  gridY = 0.5 * vh - 200.27   (webkit -200.58, a 0.31px engine gap)");
console.log("    vh <  592:  the board group hits its y = 8 floor and gridY pins at 86.22");
console.log("  pass-1's sheet, measured: bottom 216.8 at zero rows, +24.0 per row");
console.log("    lap(vh, L) = 216.8 + 24.0*L - (0.5*vh - 200.27) = 417.07 + 24.0*L - 0.5*vh");
for (const vh of [568, 664, 740, 844, 932, 1024]) {
  const row = [0, 2, 5]
    .map((L) => {
      const gridY = vh >= 592 ? 0.5 * vh - 200.27 : 86.22;
      const lap = 216.8 + 24.0 * L - gridY;
      return `L=${L}: ${lap > 0 ? lap.toFixed(1) : "none"}`;
    })
    .join("   ");
  console.log(`    vh ${String(vh).padStart(4)}   ${row}`);
}
console.log("  zero-lap needs vh >= 834.2 + 48*L:");
for (const L of [0, 1, 2, 3, 5]) console.log(`    L=${L}: vh >= ${(834.2 + 48 * L).toFixed(1)}`);

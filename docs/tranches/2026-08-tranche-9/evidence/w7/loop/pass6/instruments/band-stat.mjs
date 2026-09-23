/**
 * G2's STAMPED STATISTIC — the pure half (T9-W7 pass 6, the chair's instruments lane; registry-v5
 * §8 act 3; ACC-GRAPHITE's pass-5 critic §2.1). ONE definition for numerator and denominator:
 *   · ink reference = the board's darkest 0.5 % of luminance (every pixel, one capture, DPR 1);
 *     paper = the board's 95th percentile; threshold α50 = paper − 0.5 × (paper − ink);
 *   · a run's width = its below-threshold span with BOTH crossings linearly interpolated
 *     (sub-pixel, SUB=1 — never the integer count);
 *   · the same threshold, the same capture resolution and the same crossing method for the frame
 *     (denominator: the perimeter median, every side) and the band (numerator).
 *   node band-stat.mjs --self-test   → synthetic blurred bars of known width; exit 0 when the
 *                                      stamped reading lands within 0.2 px of truth.
 */
export const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
export const quantile = (a, p) => {
  const b = Float64Array.from(a).sort();
  return b.length ? b[Math.floor(p * (b.length - 1))] : NaN;
};
export const median = (a) => {
  const b = Float64Array.from(a).sort();
  return b.length ? b[b.length >> 1] : NaN;
};
export function thresholdOf(lums) {
  const paper = quantile(lums, 0.95);
  const ink = quantile(lums, 0.005);
  return { paper, ink, thr: paper - 0.5 * (paper - ink) };
}
/** Sub-pixel width of the below-threshold run [a, e] along `get`: each crossing is interpolated
 *  linearly between the two pixel CENTRES that straddle it —
 *    start x_s = (a − ½) + (v[a−1] − thr)/(v[a−1] − v[a]),  end x_t = (e + ½) + (thr − v[e])/(v[e+1] − v[e]).
 *  (The critic's pass-5 form, e − a + fa + fe with fa, fe the ABOVE-threshold fractions of the two
 *  outside pixels, is algebraically x_t − x_s only when fa + fe = 1; on box-integrated bars of known
 *  width it errs by up to 1.58 px. This form errs ≤ 0.17 px — see --self-test.) A run touching the
 *  window's edge takes the edge as its crossing. */
export function runWidth(get, a, e, lo, hi, thr) {
  const xs = a > lo ? a - 0.5 + (get(a - 1) - thr) / (get(a - 1) - get(a)) : lo;
  const xt = e + 1 < hi ? e + 0.5 + (thr - get(e)) / (get(e + 1) - get(e)) : hi;
  return xt - xs;
}
/** The pass-5 critic's form, kept ONLY so the self-test can show what it read. */
export function runWidthPass5(get, a, e, lo, hi, thr) {
  const fa = a > lo ? (get(a - 1) - thr) / (get(a - 1) - get(a)) : 0;
  const fe = e + 1 < hi ? (get(e + 1) - thr) / (get(e + 1) - get(e)) : 0;
  return e - a + fa + fe;
}
/** The FIRST below-threshold run along `get(0..span-1)`. */
export function firstRun(get, span, thr, width = runWidth) {
  let a = -1, e = -1;
  for (let t = 0; t < span; t++) {
    if (get(t) < thr) { if (a < 0) a = t; e = t; } else if (a >= 0) break;
  }
  return a < 0 ? 0 : width(get, a, e, 0, span, thr);
}
/** The LONGEST below-threshold run in [ya, yb) (h = the crop's height). */
export function longestRun(get, ya, yb, thr, h, width = runWidth) {
  let best = 0, cur = 0, bs = 0, be = 0, st = 0;
  for (let y = ya; y < yb; y++) {
    if (get(y) < thr) { if (!cur) st = y; cur++; if (cur > best) { best = cur; bs = st; be = y; } } else cur = 0;
  }
  return best ? width(get, bs, be, 0, h, thr) : 0;
}
export const G2_WINDOW = [1.35, 1.45];

if (process.argv.includes("--self-test")) {
  // Bars of TRUE width w at sub-pixel offset o, pixel-integrated (box coverage), paper 240 / ink 40:
  // the stamped form must land within 0.2 px; the pass-5 form is printed beside it.
  const paper = 240, ink = 40, thr = paper - 0.5 * (paper - ink);
  const profile = (w, o, n = 40) => Array.from({ length: n }, (_, i) => paper - Math.max(0, Math.min(i + 1, o + w) - Math.max(i, o)) * (paper - ink));
  let worst = 0, worst5 = 0, worstInt = 0;
  for (const w of [2.3, 3.457, 4, 6.45, 7, 9.503, 10.831])
    for (const o of [5, 5.1, 5.25, 5.5, 5.75, 5.9]) {
      const p = profile(w, o), g = (t) => p[t];
      const sub = firstRun(g, p.length, thr), p5 = firstRun(g, p.length, thr, runWidthPass5);
      const integer = p.filter((v) => v < thr).length;
      worst = Math.max(worst, Math.abs(sub - w)); worst5 = Math.max(worst5, Math.abs(p5 - w)); worstInt = Math.max(worstInt, Math.abs(integer - w));
      if (o === 5.25) console.log(`w ${w} @ +0.25: stamped ${sub.toFixed(3)} · pass-5 form ${p5.toFixed(3)} · integer ${integer}`);
    }
  console.log(`worst |error| over 42 bars: stamped ${worst.toFixed(3)} px · pass-5 form ${worst5.toFixed(3)} px · integer ${worstInt.toFixed(3)} px (bound 0.2)`);
  process.exit(worst <= 0.2 && worst5 > 0.2 ? 0 : 2);
}

/** OKLab / OKLCH / sRGB, one file, used by every PAL-TIN pass-2 probe.
 *  Matrices are Björn Ottosson's; the ΔE is Euclidean in OKLab (the currency PAL-WALK set). */
export const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function oklabOfRgb([r, g, b]) {
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
export const rgbOfHex = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
export const oklab = (hex) => oklabOfRgb(rgbOfHex(hex));

export function rgbOfOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
export const rgbOfOklch = (L, C, hDeg) => {
  const h = (hDeg * Math.PI) / 180;
  return rgbOfOklab([L, C * Math.cos(h), C * Math.sin(h)]);
};
export const inGamut = (rgb) => rgb.every((v) => v >= -1e-6 && v <= 1 + 1e-6);

/** PAL-WALK's graft: the maximum chroma sRGB can hold at (L, h). Bisection, 1e-5. */
export function chromaAt(L, hDeg) {
  let lo = 0, hi = 0.5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(rgbOfOklch(L, mid, hDeg))) lo = mid; else hi = mid;
  }
  return lo;
}

/** The 8-bit round trip: request (L,C,h), clip into gamut, quantise to a byte, read back. */
export function paint(L, C, hDeg) {
  let c = C;
  const ceil = chromaAt(L, hDeg);
  if (c > ceil) c = ceil; // what the engine does silently
  const rgb = rgbOfOklch(L, c, hDeg).map((v) => Math.min(1, Math.max(0, v)));
  const bytes = rgb.map((v) => Math.round(gam(v) * 255));
  const hex = "#" + bytes.map((v) => v.toString(16).padStart(2, "0")).join("");
  return { hex, bytes, clipped: C > ceil, ceiling: ceil };
}

export const hueOf = (hex) => {
  const [, A, B] = oklab(hex);
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return h < 0 ? h + 360 : h;
};
export const chromaOf = (hex) => { const [, A, B] = oklab(hex); return Math.hypot(A, B); };
export const lOf = (hex) => oklab(hex)[0];
export const gap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
export const dE = (a, b) => {
  const A = typeof a === "string" ? oklab(a) : a;
  const B = typeof b === "string" ? oklab(b) : b;
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
};
/** WCAG 2.x relative luminance + ratio, on hex. */
export const lum = (hex) => { const [r, g, b] = rgbOfHex(hex).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

/**
 * oklch.mjs — the R2 census's own sRGB <-> OKLCH, carried verbatim from
 * `r0/r2-accent-family/probe/oklch.ts` (Ottosson's matrices, the same space the
 * product's `oklch()` peer ink already speaks) and given the INVERSE direction
 * this lane needs: OKLCH -> sRGB, so a hue-locked ink can be SEARCHED for rather
 * than guessed at. Nothing in the forward direction is altered.
 */

export const srgbToLinear = (c) => {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};

const linearToSrgb = (x) => {
  const v = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  return v * 255;
};

export function rgbToOklch(r, g, b) {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.hypot(a, bb);
  let h = (Math.atan2(bb, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
}

/** OKLCH -> sRGB 0..255. `inGamut` is false when any channel left [0,255] before clamping. */
export function oklchToRgb(L, C, hDeg) {
  const hr = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const raw = [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
  const inGamut = raw.every((v) => v >= -0.5 && v <= 255.5);
  const [r, g, bl] = raw.map((v) => Math.round(Math.min(255, Math.max(0, v))));
  return { r, g, b: bl, inGamut };
}

export function hueDist(a, b) {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return d > 180 ? 360 - d : d;
}

export function parseCss(s) {
  if (!s) return null;
  const t = String(s).trim();
  if (t === "transparent" || t === "none") return null;
  let m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.%]+))?\s*\)$/i.exec(t);
  if (m) {
    let a = 1;
    if (m[4] != null) a = m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return { r: +m[1], g: +m[2], b: +m[3], a };
  }
  m = /^#([0-9a-f]{6})$/i.exec(t);
  if (m) {
    const n = parseInt(m[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  return null;
}

export const over = (ink, ground) => ({
  r: ink.r * ink.a + ground.r * (1 - ink.a),
  g: ink.g * ink.a + ground.g * (1 - ink.a),
  b: ink.b * ink.a + ground.b * (1 - ink.a),
});

export const lum = (r, g, b) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);

export const ratio = (a, b) => {
  const la = lum(a.r, a.g, a.b);
  const lb = lum(b.r, b.g, b.b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

export const hex = ({ r, g, b }) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

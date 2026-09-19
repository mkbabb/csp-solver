/**
 * oklch.ts — sRGB → OKLCH, one copy for the R2 accent census.
 *
 * Björn Ottosson's matrices, byte-for-byte the ones the CSS Color 4 `oklch()` the
 * product ALREADY SHIPS resolves through (`playerIdentity.ts:69` writes a peer's ink
 * as `oklch(var(--peer-ink-l) 0.11 <hue>deg)`), so the census measures in the same
 * space the product's own one generated ink already speaks.
 *
 * Hue distance is CIRCULAR: the wrap at 360 is where a naive subtraction lies, and
 * rose (hue ~15° in OKLCH) vs gold (~85°) is exactly the pair that lies loudest.
 */

export interface Oklch {
  L: number;
  C: number;
  h: number;
}

const srgbToLinear = (c: number): number => {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};

export function rgbToOklch(r: number, g: number, b: number): Oklch {
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

/** Circular hue distance in degrees, always 0…180. */
export function hueDist(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return d > 180 ? 360 - d : d;
}

/** `rgb(r, g, b)` / `rgba(r, g, b, a)` / `#rrggbb` → channels. Null for `transparent`
 *  and for anything a browser returned in a form this census does not price. */
export function parseCss(s: string): { r: number; g: number; b: number; a: number } | null {
  if (!s) return null;
  const t = s.trim();
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
  m = /^#([0-9a-f]{3})$/i.exec(t);
  if (m) {
    const h = m[1];
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
      a: 1,
    };
  }
  return null;
}

/** Composite a possibly-translucent ink over an opaque ground — the only honest way to
 *  price a 7% wash or a 0.55 stroke-opacity ring, whose DECLARED hex is never what a
 *  reader's eye receives. */
export function over(
  ink: { r: number; g: number; b: number; a: number },
  ground: { r: number; g: number; b: number },
): { r: number; g: number; b: number } {
  return {
    r: ink.r * ink.a + ground.r * (1 - ink.a),
    g: ink.g * ink.a + ground.g * (1 - ink.a),
    b: ink.b * ink.a + ground.b * (1 - ink.a),
  };
}

/** WCAG 2.x relative luminance + ratio, for the contrast-bearing exception rows. */
export function lum(r: number, g: number, b: number): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

export function ratio(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
): number {
  const la = lum(a.r, a.g, a.b);
  const lb = lum(b.r, b.g, b.b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

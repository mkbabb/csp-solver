/**
 * Raster-stack adoption helpers (T4-W1) — the bits the three baked surfaces share when
 * they lift a live filtered pose into a self-contained bitmap via `useRasterStack`.
 *
 * A captured pose is drawn in a DETACHED SVG blob that cannot reach the page `<defs>` and
 * has no cascade to resolve `currentColor` / `var()` against (see `raster.ts`'s
 * self-contained contract). So the pose SVG must inline the filter it references and carry
 * literal colors. These helpers read both off the LIVE DOM — the filter straight from
 * `SvgFilters.vue`'s rendered defs (the bake SOURCE, so FilterTuner edits flow through) and
 * a cascade value resolved to its literal — so the blob is faithful to what shipped.
 */

/**
 * Serialize a live filter/gradient def element (by id) to a self-contained XML string for
 * inlining into a pose SVG's `<defs>`. `XMLSerializer` preserves the camelCase SVG filter
 * attribute names (`baseFrequency`, `numOctaves`, …) and stamps the SVG namespace, so the
 * result parses correctly inside an `image/svg+xml` blob. Returns `''` when the def is
 * absent — the consumer keeps the live-filter fallback until it exists (no flash).
 */
export function readFilterDefs(id: string): string {
  if (typeof document === "undefined") return "";
  const el = document.getElementById(id);
  if (!el) return "";
  try {
    return new XMLSerializer().serializeToString(el);
  } catch {
    return "";
  }
}

/**
 * Resolve a CSS property (custom property or longhand) off an element's cascade to its
 * literal computed value, for substitution into a pose body. Falls back to `fallback` when
 * the property is empty or off-DOM. The returned value must itself be a literal (no
 * `var()` / `currentColor`) for the pose SVG to pass the self-contained guard.
 */
export function resolveCssValue(
  el: Element | null,
  prop: string,
  fallback: string,
): string {
  if (typeof window === "undefined" || !el) return fallback;
  const v = getComputedStyle(el).getPropertyValue(prop).trim();
  return v || fallback;
}

/**
 * Convert a resolved `ImageBitmap` stack into `data:` URLs, one per pose, drawn ONCE. The
 * urls feed static SVG `<image>` siblings whose only per-beat change is an opacity flip —
 * the N-layer variant (no per-beat `drawImage`, so no residual tile raster). Returns `[]`
 * for a null stack (the bake is still in flight; the consumer shows the fallback).
 */
export function bitmapsToUrls(bitmaps: ImageBitmap[] | null): string[] {
  if (!bitmaps || typeof document === "undefined") return [];
  const urls: string[] = [];
  for (const bm of bitmaps) {
    const canvas = document.createElement("canvas");
    canvas.width = bm.width;
    canvas.height = bm.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return urls;
    ctx.drawImage(bm, 0, 0);
    urls.push(canvas.toDataURL("image/png"));
  }
  return urls;
}

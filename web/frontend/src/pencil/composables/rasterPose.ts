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
 * Convert a resolved `ImageBitmap` stack into object URLs, one per pose, encoded ONCE. The
 * urls feed static SVG `<image>` / `<img>` siblings whose only per-beat change is an opacity
 * flip — the N-layer variant (no per-beat `drawImage`, so no residual tile raster).
 *
 * Two residency wins over the retired synchronous `toDataURL` path (T4-WM ranks 2/4):
 *   • the encode runs through `OffscreenCanvas.convertToBlob` — async, off the main thread's
 *     synchronous PNG-encode burst (12 poses × up to 251 ms @4× at DPR3 is what it cost), and
 *   • the URL is a `createObjectURL` handle (a pointer), not a retained ~1.3 MB base64 string.
 *
 * The source `ImageBitmap` is the REDUNDANT copy once its decode-backing URL exists (the
 * `<image>` decode is the single resident raster the compositor draws), so each is `close()`d
 * here — its off-heap decoded pixels are freed and the decode+bitmap double residency dies.
 * `useRasterStack` (0.9.2) captures fresh per bake and never memoizes the bitmap, so a closed
 * bitmap can never be re-handed to a warm re-bake. Returns `[]` for a null/empty stack (the
 * bake is still in flight; the consumer holds the fallback).
 */
export async function bitmapsToUrls(bitmaps: ImageBitmap[] | null): Promise<string[]> {
  if (!bitmaps || bitmaps.length === 0 || typeof document === "undefined") return [];
  const urls: string[] = [];
  for (const bm of bitmaps) {
    urls.push(URL.createObjectURL(await encodeBitmap(bm)));
    bm.close(); // the URL/decode is the durable artifact; the bitmap is redundant
  }
  return urls;
}

/**
 * Revoke object URLs minted by {@link bitmapsToUrls} — the backing decode is released when a
 * re-bake replaces the stack or the surface unmounts. Revoking after an `<image>` has loaded
 * is safe (the element retains the decoded resource); it only stops the handle from leaking.
 */
export function revokeUrls(urls: string[] | null | undefined): void {
  if (!urls) return;
  for (const u of urls) URL.revokeObjectURL(u);
}

/**
 * Encode one `ImageBitmap` to a PNG `Blob` asynchronously. `OffscreenCanvas.convertToBlob` is
 * the off-main-thread path; a plain `<canvas>.toBlob` is the fallback where OffscreenCanvas is
 * absent (both async — neither is the retired synchronous `toDataURL`).
 */
async function encodeBitmap(bm: ImageBitmap): Promise<Blob> {
  if (typeof OffscreenCanvas !== "undefined") {
    const oc = new OffscreenCanvas(bm.width, bm.height);
    const ctx = oc.getContext("2d");
    if (ctx) {
      ctx.drawImage(bm, 0, 0);
      return oc.convertToBlob({ type: "image/png" });
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = bm.width;
  canvas.height = bm.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("bitmapsToUrls: 2D canvas context unavailable");
  ctx.drawImage(bm, 0, 0);
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("bitmapsToUrls: toBlob null")),
      "image/png",
    );
  });
}

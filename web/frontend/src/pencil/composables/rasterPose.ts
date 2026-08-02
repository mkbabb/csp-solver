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
 *
 * T5-W2 2.4: the ENCODE half of this file is gone. `bitmapsToUrls`/`encodeBitmap`/`revokeUrls`
 * were the round trip pencil-boil 0.11 deletes — `useRasterStack` reads its own capture canvas
 * through `rasterizePoseToBlob()` and hands back object URLs it owns. What survives is what the
 * app alone knows: how to read the live DOM, and when to hold a set across the null window.
 */
import { ref, watch, type Ref } from "vue";
import type { RasterStackHandle } from "@mkbabb/pencil-boil";

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
 * Hold the last resolved pose URLs across a re-bake's null window — the atomic-swap
 * discipline (T4-WM rank 3), stated once for all three baked surfaces.
 *
 * `useRasterStack` nulls `urls` while a (re-)bake is in flight and keeps the outgoing set
 * valid until its successor lands, so a surface that reads `urls` directly drops to the
 * live-filter fallback for the whole bake — a visible flash on a re-tint it could have
 * ridden through. Retaining is therefore a READ, never a copy: pencil-boil 0.11 mints the
 * handles and owns their lifetime (`RasterStackHandle.urls` — "never revoke these"), and
 * this composable holds nothing it must free.
 *
 * `resetKey` is the STRUCTURAL escape. A re-tint's outgoing poses still describe the right
 * geometry; a board-size change's do not. When the key changes the retained set is dropped
 * and the fallback holds the new geometry until the re-bake lands.
 */
export function retainedPoseUrls(
  handle: RasterStackHandle,
  resetKey?: () => unknown,
): Ref<string[]> {
  const held = ref<string[]>([]);
  watch(
    handle.urls,
    (next) => {
      if (next) held.value = next;
    },
    { immediate: true },
  );
  if (resetKey)
    watch(resetKey, () => {
      held.value = [];
    });
  return held;
}

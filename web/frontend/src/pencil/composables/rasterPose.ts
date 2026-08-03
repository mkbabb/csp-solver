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
 * A pose set is ADMITTED, not merely received (T6.2).
 *
 * The swap was atomic in the DOM and non-atomic in the pixels. `urls` landing flips the
 * template from the live-filter fallback to `<image>` siblings whose object URLs were minted
 * microseconds earlier and have never been decoded, so the frame that unmounts the fallback
 * paints NOTHING — measured at one composited frame in both engines (44 ms on a joiner mid-boot
 * against 20 ms on an idle host: the starvation widens it, which is why the owner saw it on the
 * second player's screen and only occasionally).
 *
 * The same seam catches a worse one. On WebKit a bake taken during page boot returns BLANK
 * BITMAPS for poses 1..n while pose 0 comes back inked — 4 runs in 10 on darwin, 0 in 10 on
 * Chromium, the pose SVG strings byte-identical in the good runs and the bad (measured: the
 * same strings re-rastered after boot yield ink 120 times out of 120, in parallel and in
 * series alike). A stack admitted in that state opacity-swaps ink → nothing → nothing →
 * nothing on the beat, which is the wordmark flashing. The estate could not see it: the
 * wordmark-integrity and theme-bake rows decode POSE 0, the one pose that survives.
 *
 * So admission has two terms, and both are about what the surface is about to SHOW:
 *   · every handle decodes — the poses enter the rotation already paintable, so the frame
 *     that retires the fallback has ink in it;
 *   · every decoded pose actually paints something — a bake that produced an empty bitmap is
 *     refused and `rebake()` asks for another, which lands after the boot window where the
 *     capture is reliable.
 *
 * It FAILS OPEN, deliberately and in both directions: a probe that cannot run (no 2D context,
 * a decode the engine refuses) admits, and a set that stays blank past `MAX_REBAKES` admits
 * too. The gate may delay a bake; it may never wedge a surface into permanent fallback.
 *
 * Everything the retention did, it still does. `useRasterStack` nulls `urls` while a (re-)bake
 * is in flight and keeps the outgoing set valid until its successor lands, so a surface that
 * read `urls` directly would drop to the live-filter fallback for the whole bake — a visible
 * flash on a re-tint it could ride through. Retaining is a READ, never a copy: pencil-boil
 * mints the handles and owns their lifetime (`RasterStackHandle.urls` — "never revoke these"),
 * and this composable holds nothing it must free.
 *
 * `resetKey` is the STRUCTURAL escape. A re-tint's outgoing poses still describe the right
 * geometry; a board-size change's do not. When the key changes the retained set is dropped
 * and the fallback holds the new geometry until the re-bake lands.
 */

/** Probe raster, in px. The question is "did this pose paint at all", so it is asked of a
 *  thumbnail: one small `drawImage` and ~2 KB of alpha per pose, not a full-size read-back. */
const PROBE_PX = 24;

/** Two, because the blank is a BOOT-WINDOW state and the first re-bake already leaves it. */
const MAX_REBAKES = 2;

/**
 * Decode one pose handle and report whether it paints. `false` is only ever returned for a
 * bitmap that decoded and is empty — every other outcome (no DOM, no 2D context, a decode the
 * engine refuses) is an unanswerable probe and admits.
 */
async function posePaints(url: string): Promise<boolean> {
  if (typeof document === "undefined" || typeof Image === "undefined") return true;
  const img = new Image();
  img.src = url;
  try {
    await img.decode();
  } catch {
    return true;
  }
  const canvas = document.createElement("canvas");
  canvas.width = PROBE_PX;
  canvas.height = PROBE_PX;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return true;
  try {
    ctx.drawImage(img, 0, 0, PROBE_PX, PROBE_PX);
    const { data } = ctx.getImageData(0, 0, PROBE_PX, PROBE_PX);
    for (let i = 3; i < data.length; i += 4) if (data[i] > 8) return true;
    return false;
  } catch {
    return true;
  }
}

export function retainedPoseUrls(
  handle: RasterStackHandle,
  resetKey?: () => unknown,
): Ref<string[]> {
  const held = ref<string[]>([]);
  // A monotonic token, the same discipline the library's own bake token keeps: a set that is
  // still being admitted when its successor arrives must not land on top of it.
  let admitting = 0;
  let rebakes = 0;
  watch(
    handle.urls,
    (next) => {
      if (!next) return;
      const token = ++admitting;
      void Promise.all(next.map(posePaints)).then((paints) => {
        if (token !== admitting) return; // superseded by a newer bake
        if (paints.every(Boolean) || rebakes >= MAX_REBAKES) {
          rebakes = 0;
          held.value = next;
          return;
        }
        rebakes++;
        handle.rebake();
      });
    },
    { immediate: true },
  );
  if (resetKey)
    watch(resetKey, () => {
      held.value = [];
    });
  return held;
}

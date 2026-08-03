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
import { getCurrentInstance, ref, watch, type Ref } from "vue";
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

/**
 * CH-62 · THE ADMISSION INSTRUMENT (T7-W3) — counts, never decides.
 *
 * The gate above fails open in five places and every one of them is SILENT: a `return true`
 * from an unanswerable probe is indistinguishable, from outside, from a pose that painted.
 * So a green ARM A proves nothing on its own — it is equally the shape of a gate that never
 * ran. W3's rig probe retires CH-62 only on `refused > 0` with every fail-open counter at 0,
 * and that arithmetic needs a number per exit. Hence one field per `posePaints` exit:
 *
 *   noEnv               no `document`/`Image`      (the no-DOM admit)
 *   decodeRejected      `img.decode()` threw       (the engine refused the decode)
 *   noCtx               no 2D context
 *   taintRejected       `drawImage`/`getImageData` threw (a tainted canvas)
 *   painted             decoded AND inked          — the REAL NEGATIVE, the gate standing down
 *   refused             decoded AND empty          — the REAL positive, the gate firing
 *   rebakes             a refusal that asked for another bake
 *   maxRebakesExhausted admitted a still-blank set past `MAX_REBAKES` (the fifth fail-open)
 *   probed / admitted   the denominators that make `refused > 0` readable
 *   ablatedAdmits       ARM B only — proof the ablation flag actually took
 *
 * `painted` closes the census (T7-W3 residue, non-author FINDING 5). It was the one `return
 * true` in `posePaints` carrying no counter, and while it is derivable — `probed − noEnv −
 * decodeRejected − noCtx − taintRejected − refused` — the fail-open census IS the instrument,
 * so "every exit is counted" has to be true on inspection rather than by subtraction. With it
 * the per-surface row is self-checking: `probed` must equal
 * `noEnv + decodeRejected + noCtx + taintRejected + painted + refused`, and a row that does not
 * add up says the instrument lost an exit rather than the gate having behaved.
 *
 * ZERO BEHAVIOUR CHANGE. Every counter is count-and-continue on a path that already existed;
 * no exit moved, no return value changed, no ordering changed.
 *
 * GATED, and gated on a form the bundler can fold. `import.meta.env.MODE` is substituted with
 * a string literal at build, so `MODE === "ch62-probe"` collapses to `false` in an ordinary
 * build and the ternary's live arm — the only place the `__bakeAdmission` string exists — is
 * dropped whole. Proof: `npm run test:prod-shake` discipline, re-run per build in
 * `evidence/w3/ch62-instrument-smoke.txt` (`__bakeAdmission` absent from `dist/`, present in
 * `dist-ch62/`). The probe builds run `vite build --mode ch62-probe|ch62-ablate` with
 * `NODE_ENV=production`, so they are production bundles in every respect but this fence.
 */
type BakeAdmissionCounters = {
  probed: number;
  admitted: number;
  painted: number;
  refused: number;
  rebakes: number;
  decodeRejected: number;
  noCtx: number;
  taintRejected: number;
  noEnv: number;
  maxRebakesExhausted: number;
  ablatedAdmits: number;
};

declare global {
  interface Window {
    /** DEV / `--mode ch62-*` only. Per-surface admission census; see the block above. */
    __bakeAdmission?: {
      ablated: boolean;
      surfaces: Record<string, BakeAdmissionCounters>;
    };
  }
}

/** The instrument fence, written so the substitution folds to a literal `false` in prod. */
const CH62_INSTRUMENT =
  import.meta.env.DEV ||
  import.meta.env.MODE === "ch62-probe" ||
  import.meta.env.MODE === "ch62-ablate";

/**
 * ARM B — the vacuity control. `posePaints` admits unconditionally, so the gate is present
 * and inert; if ARM B does not red at the class rate the probe is VOID and ARM A's green is
 * worth nothing. Never shippable: the build mode is the only production route to it, and the
 * DEV query arm (`?ch62ablate=1`) exists so the ablation can be exercised on a dev server
 * without a bespoke build.
 */
const CH62_ABLATE =
  import.meta.env.MODE === "ch62-ablate" ||
  (import.meta.env.DEV &&
    typeof location !== "undefined" &&
    new URLSearchParams(location.search).has("ch62ablate"));

const ZERO_COUNTERS = (): BakeAdmissionCounters => ({
  probed: 0,
  admitted: 0,
  painted: 0,
  refused: 0,
  rebakes: 0,
  decodeRejected: 0,
  noCtx: 0,
  taintRejected: 0,
  noEnv: 0,
  maxRebakesExhausted: 0,
  ablatedAdmits: 0,
});

/** Bump one field of one surface's census. The dead arm is what ships. */
const ch62: (surface: string, field: keyof BakeAdmissionCounters) => void =
  CH62_INSTRUMENT
    ? (surface, field) => {
        if (typeof window === "undefined") return;
        const g = (window.__bakeAdmission ??= {
          ablated: CH62_ABLATE,
          surfaces: {},
        });
        (g.surfaces[surface] ??= ZERO_COUNTERS())[field]++;
      }
    : () => {};

/**
 * The surface a stack belongs to, read off the CALLING COMPONENT rather than a new parameter:
 * the three call sites live in files this wave does not own, and an instrument that needs its
 * subjects edited is an instrument that changes behaviour to measure it. `__name` is emitted
 * by the SFC compiler in production builds too, so the key survives minification. The
 * per-instance ordinal separates `DarkModeToggle`'s two stacks (sun, moon) without inventing
 * a label for either.
 */
const stackOrdinal = new WeakMap<object, number>();
const ch62Surface: () => string = CH62_INSTRUMENT
  ? () => {
      const inst = getCurrentInstance();
      if (!inst) return "detached";
      const name = (inst.type as { __name?: string }).__name ?? "anonymous";
      const n = (stackOrdinal.get(inst) ?? 0) + 1;
      stackOrdinal.set(inst, n);
      return n === 1 ? name : `${name}#${n}`;
    }
  : () => "";

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
async function posePaints(url: string, surface: string): Promise<boolean> {
  // ARM B. Present, inert, counted — the control the wave voids itself without.
  if (CH62_ABLATE) {
    ch62(surface, "ablatedAdmits");
    return true;
  }
  ch62(surface, "probed");
  if (typeof document === "undefined" || typeof Image === "undefined") {
    ch62(surface, "noEnv");
    return true;
  }
  const img = new Image();
  img.src = url;
  try {
    await img.decode();
  } catch {
    ch62(surface, "decodeRejected");
    return true;
  }
  const canvas = document.createElement("canvas");
  canvas.width = PROBE_PX;
  canvas.height = PROBE_PX;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    ch62(surface, "noCtx");
    return true;
  }
  try {
    ctx.drawImage(img, 0, 0, PROBE_PX, PROBE_PX);
    const { data } = ctx.getImageData(0, 0, PROBE_PX, PROBE_PX);
    // The painted exit, counted like its siblings — count-and-continue, same DEV/probe-mode
    // fence, same position in the flow. Zero behaviour change: the `return true` is where it was.
    for (let i = 3; i < data.length; i += 4)
      if (data[i] > 8) {
        ch62(surface, "painted");
        return true;
      }
    ch62(surface, "refused");
    return false;
  } catch {
    ch62(surface, "taintRejected");
    return true;
  }
}

export function retainedPoseUrls(
  handle: RasterStackHandle,
  resetKey?: () => unknown,
): Ref<string[]> {
  const held = ref<string[]>([]);
  const surface = ch62Surface();
  // A monotonic token, the same discipline the library's own bake token keeps: a set that is
  // still being admitted when its successor arrives must not land on top of it.
  let admitting = 0;
  let rebakes = 0;
  watch(
    handle.urls,
    (next) => {
      if (!next) return;
      const token = ++admitting;
      // `next.map(posePaints)` fed the index through as a second argument; the arrow keeps
      // the call one-arity-honest now that the probe carries a surface.
      void Promise.all(next.map((u) => posePaints(u, surface))).then((paints) => {
        if (token !== admitting) return; // superseded by a newer bake
        const allPaint = paints.every(Boolean);
        if (allPaint || rebakes >= MAX_REBAKES) {
          // The fifth fail-open: a set that stayed blank past MAX_REBAKES is admitted anyway.
          if (!allPaint) ch62(surface, "maxRebakesExhausted");
          rebakes = 0;
          held.value = next;
          ch62(surface, "admitted");
          return;
        }
        rebakes++;
        ch62(surface, "rebakes");
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

<script lang="ts">
import frauncesUrl from "@/assets/fonts/fraunces-subset.woff2?url";

/**
 * ── T7-W6 §FRAUNCES SHIPS ONCE ────────────────────────────────────────────────
 *
 * The bake needs the face as BYTES inside its detached blob (a blob SVG cannot reach the
 * page's loaded `@font-face` — see the pose-bake note below). It used to get them from a
 * static `?inline` import, which base64s the woff2 into the module graph: 18,407 chars of
 * data URI in the entry chunk, **16,038 B gzipped**, ON THE CRITICAL PATH, for a file the
 * page already downloads standalone under `/assets/fraunces-subset-*.woff2` (13,788 B,
 * `<link rel=preload as=font>`, immutable-cached). Two copies of one font, one of them
 * parsed by every visitor before first paint.
 *
 * So the bake FETCHES the copy that already ships. `credentials: "omit"` matches the
 * anonymous mode of head-hints' preload (vite.config.ts); `connect-src 'self'` already
 * admits the request (public/_headers). The data URI it builds is byte-identical to the one
 * `?inline` emitted — same bytes, same `font/woff2` mime, same base64 — so every serialized
 * pose SVG, every baked bitmap and every golden is unmoved by construction.
 *
 * WHAT IT COSTS, MEASURED rather than rounded to zero (evidence/w6/fraunces-single-ship.txt).
 * Preload matching keys on DESTINATION, and a `fetch()` has none, so this can't consume an
 * `as=font` preload however its credentials mode is set. Against a server applying the
 * production `/assets/*` immutable rule: chromium takes 1 server hit for the face (this
 * fetch is served from cache), webkit takes 2. Worst case is one extra off-critical-path
 * request for 13,788 immutable-cached bytes, on one engine, against 15.07 kB gz removed
 * from the render-blocking chunk on every visit in both.
 *
 * Memoized at module scope: one fetch per document, however many wordmarks mount.
 */
let bakeFacePromise: Promise<string | null> | null = null;

async function loadBakeFace(): Promise<string | null> {
  try {
    const res = await fetch(frauncesUrl, { credentials: "omit" });
    if (!res.ok) throw new Error(`fraunces subset: HTTP ${res.status}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    // Chunked so a 13.8 KB face never spreads as one argument list (`String.fromCharCode`
    // takes the bytes as arguments; the whole file at once is an engine stack limit away).
    // `Uint8Array.toBase64` would be one call, but browserslist floors at safari 16.4.
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000)
      bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return `data:font/woff2;base64,${btoa(bin)}`;
  } catch {
    // The face never arrived, so there is nothing to bake WITH: a pose captured without it
    // freezes a Georgia wordmark into a bitmap that no re-bake trigger would ever invalidate.
    // Declining leaves the live-filter pose-0 fallback up, which paints the page's own loaded
    // Fraunces — the same ink, held still.
    return null;
  }
}

function bakeFace(): Promise<string | null> {
  return (bakeFacePromise ??= loadBakeFace());
}
</script>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted, nextTick, type Ref } from "vue";
import {
  heldFrameCount,
  usePrefersReducedMotion,
  serializePoseSvg,
  useRasterStack,
} from "@mkbabb/pencil-boil";
import { useTheme } from "@/composables/useTheme";
import {
  FILTER_PRESETS,
  MOTION,
  beatsFor,
  wobblePoseFrequencies,
  wobblePoseId,
} from "@pencil/config/pencilConfig";
import { useBeatFrame } from "@pencil/composables/boilBeat";
import {
  readFilterDefs,
  resolveCssValue,
  retainedPoseUrls,
  useLayoutBoxSize,
} from "@pencil/composables/rasterPose";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";

// The wordmark IS the game picker. It renders the CURRENT game's name in the display face
// (live SVG <text>, so any label renders — no per-glyph art), and the whole thing is a real
// <button> that OPENS THE GALLERY (T4-W12 Wave D — the in-place dropdown listbox is retired;
// one game-select surface, the carousel). Pencil never imports games: the game id arrives as
// a prop; the open is emitted back to App.vue, which owns `enterGallery` + the board⇄card fold.
const props = defineProps<{
  game: string;
  /** The wordmark is a NAME, not a control (T6 mark 7). In the gallery the deck is the one
   *  game-select surface, so the heading renders as a `<span>` there: no button, no caret, no
   *  activation. The `<h1>` keeps an accessible name off the visually-hidden label, since the
   *  svg that carries all the ink is `aria-hidden`. */
  inertHeading?: boolean;
}>();

const emit = defineEmits<{
  /** Fires on activation (click / Enter / Space) — App folds the board into the gallery
   *  AND warms the other scene's lazy chunk on this signal (F6-D3), so a select is cached. */
  (e: "open"): void;
}>();

const { isDark } = useTheme();
const reducedMotion = usePrefersReducedMotion();

// ── The wordmark boil, pose-stacked (T3-W13 §1-P3) ──
// The label used to ride ONE live #wobble-logo whose baseFrequency was re-written
// every 4th beat — a full DPR2 filter re-raster on a ~734×238 region, riding the
// root scrolling layer's damage (b1's painter inventory). The boil is stop-motion
// over a finite pose set, so the poses render as N static siblings, each filtered
// by a FROZEN variant (#wobble-logo-p{i}, SvgFilters), and the beat flips opacity —
// compositor-only, zero steady-state raster (the grid hoist's discipline). Cadence
// is unchanged: `beatsFor(intervalMs)` = every 4th beat, exactly the band the
// retired SvgFilters watcher stepped on. PRM freezes the shared beat centrally, so
// the stack rests on pose 0.
const logoPreset = FILTER_PRESETS["wobble-logo"];
const logoPoseIds = computed(() =>
  wobblePoseFrequencies(logoPreset).map((_, i) => wobblePoseId(logoPreset.id, i)),
);
// heldFrameCount (P1-W3): the answer-key laminate's boil hold was NEVER TOTAL — only
// HandDrawnGrid and BoilDivider wrapped their counts, so every other beat surface kept
// breathing under a hold that was supposed to still the page. `heldFrameCount` collapses the
// count to 1 during a hold and `useBeatFrame`'s `total <= 1` path freezes IN PLACE (no snap to
// pose 0); release returns the real count and the boil resumes mid-cadence. Contract repair,
// not perf.
const logoPose = useBeatFrame(
  heldFrameCount(() => logoPoseIds.value.length),
  () => beatsFor(logoPreset.wobble?.intervalMs ?? MOTION.beatMs * 4),
);

// The wordmark renders the CURRENT game's name directly (id === display name for both games).
const label = computed(() => props.game);

// The caret's hover wiggle rides HandwrittenGlyph's own glyph-wiggle (PRM-gated in the glyph).
const hovered = ref(false);

// ── Clip-path wipe reveal — a mount-time beat, played ONCE (see the game watch) ──
const isDrawn = ref(reducedMotion.value);
function playReveal() {
  if (reducedMotion.value) {
    isDrawn.value = true;
    return;
  }
  isDrawn.value = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isDrawn.value = true;
    });
  });
}

// ── Variable-width viewBox ──
// EVERY label is measured — no per-label special case (H3: the old vbWidth=220 carve-out
// for 'sudoku' left a 41.9 px trailing gap to the caret where measured labels get ~14.4).
// A generous estimate seeds the first paint (never clips), then getBBox tightens the box
// to the real glyph run + a uniform 4-unit trail, so the caret sits at one gap for all.
const textRef = ref<SVGTextElement | null>(null);
// Function ref for pose 0's <text> — every pose renders identical glyph geometry,
// so measuring one suffices (getBBox works at opacity 0; only display:none throws).
function setTextRef(el: unknown) {
  textRef.value = (el as SVGTextElement | null) ?? null;
}
function estimateWidth(text: string): number {
  return Math.max(120, Math.ceil(text.length * 34) + 12);
}
const vbWidth = ref(estimateWidth(label.value));
async function measure() {
  await nextTick();
  const el = textRef.value;
  if (!el) return;
  try {
    const box = el.getBBox();
    const fit = Math.ceil(box.x + box.width + 4);
    vbWidth.value = Math.max(120, fit);
  } catch {
    // getBBox can throw if the element isn't laid out yet — keep the estimate.
  }
}

onMounted(() => {
  playReveal();
  measure();
  // Fonts load async (Fraunces): re-measure once the real face is in so the box fits.
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (fonts?.ready) fonts.ready.then(() => measure());
});

// I2: a game swap RE-MEASURES the box for the new label — it never re-reveals. The 1.2 s
// clip-path wipe is a mount-time beat; replaying it on every swap reads as a page reload,
// not a label change (the menu-close motion already carries the swap).
watch(
  () => props.game,
  () => {
    vbWidth.value = estimateWidth(label.value);
    measure();
  },
);

// ── T4-W1: the wordmark poses baked to bitmaps (the WebKit cure) ──
//
// The wordmark rides a resident #wobble-logo-p{i} pose stack opacity-swapped on the beat.
// Capture each frozen pose to an ImageBitmap once (useRasterStack) and opacity-swap static
// <image> siblings with the filter removed. A DETACHED SVG blob cannot reach the page's
// loaded @font-face, so the Fraunces subset is embedded into each pose's <style> — fetched
// from the standalone woff2 the page already preloads (§FRAUNCES SHIPS ONCE, above), never
// bundled a second time; the ink color resolves to a literal at capture. Re-bake fires on the label (game swap),
// the measured viewBox width, theme (ink), and DPR. The measuring <text> (template,
// invisible) keeps getBBox alive once the poses are baked, so the variable-width box still
// sizes on a swap. The live-filter stack is the during-bake fallback; useRasterStack awaits
// document.fonts.ready before the first bake, so the page face is in before the wordmark
// bakes.
const logoSvgRef = ref<SVGSVGElement | null>(null);
// CH-67 — the LAYOUT box, not `useElementSize`'s bounding client rect. The masthead is FLIP-ed
// on every gallery fold and the `component :is` swap below re-creates this `<svg>` inside that
// transform window, so the incumbent measured the wordmark at ×3.61 entering and ×0.30 leaving
// — and a transform fires no second ResizeObserver tick, so the wrong intrinsic STAYS. Full
// measurement + the invariant this restores: `rasterPose.ts` §CH-67.
const { height: logoH } = useLayoutBoxSize(logoSvgRef);

/**
 * BC6-G1 — THE CAPTURE KEY LATCHES; IT DOES NOT ROUND EVERY OBSERVATION.
 *
 * `Math.round(logoW)` put the bake's cache key on a 1 px grid, and the wordmark's measured
 * width lands within measurement noise of that grid's flip boundary: on this rig, DPR2,
 * 1280×800, `sudoku` and `kenken` measure **380.5313 css px in WebKit — 0.0313 px from the
 * `.5` boundary**, so a wobble smaller than a sixteenth of a device pixel re-keys the whole
 * stack and pays a full round of encodes for a box that never moved. Pass 6 read the same
 * class as a 792↔794 device-px flip on its own rig; the label set and viewport differ, the
 * class is the same one.
 *
 * QUANTIZING WAS AUDITIONED AND REJECTED, measured rather than assumed. HandDrawnGrid's 4 px
 * idiom (`Math.round(s / 4) * 4`, there to survive a drag-resize) at a 2 px grid moves
 * `sudoku`/`kenken` a comfortable 0.2344 px off the nearest boundary — and moves `killer` in
 * Chromium ONTO one, 289.125 css px sitting 0.0625 px from a 288↔290 flip where the 1 px
 * grid had it 0.375 px clear. A fixed grid relocates the hazard, it does not remove it, and
 * this surface has five labels × two engines to relocate it onto.
 *
 * So the key latches instead: a measurement re-keys only when it moves a WHOLE pixel from
 * the value the bake was captured at. There is no boundary for noise to straddle — the held
 * value is stable under any sub-pixel wobble, from any starting point, on every label — while
 * a real change (a game swap moves the width by tens of px, a breakpoint moves the height by
 * a rung) re-keys immediately. Residual capture-vs-render mismatch is <1 px, the same order
 * the incumbent round already carried. The seed stays 0 so the library still declines to bake
 * at a non-positive `cssSize` rather than baking wrong.
 *
 * Height latches too, on the same argument: the `--logo-height` ladder's ≥640px rung is
 * 5.724rem = 91.584 px at a 16 px root, 0.084 px from ITS flip boundary.
 */
function latchWholePx(src: Readonly<Ref<number>>): Ref<number> {
  const held = ref(0);
  watchEffect(() => {
    const v = src.value;
    if (v > 0 && Math.abs(v - held.value) >= 1) held.value = Math.round(v);
  });
  return held;
}
const captureH = latchWholePx(logoH);
// T6.2 — the capture WIDTH is DERIVED, not observed. `width: auto` off the height ladder
// means the box's width IS `height × vbWidth/60`; reading it back off the element
// was a second async observation of the same fact, and it arrives a ResizeObserver tick
// AFTER a re-measured `vbWidth` re-keys the bake — so every post-font correction and every
// game swap baked TWICE, and the first bake (new viewBox, stale width) was rastered at the
// wrong scale and always discarded. Under contention the golden captured that intermediate
// bake 17 runs in 20. Deriving makes the re-key atomic with the viewBox: one observation
// (the latched height), one bake per geometry change, no window to race. The width half of
// BC6-G1's latch is obsolete by construction — an integer `vbWidth` times a latched height
// cannot wobble; the height half keeps its measured rationale above.
//
// T7-W6 — THE FACE IS THE OTHER HALF OF "MEASURED". `bakeFace()` resolves a document late
// (one fetch off the HTTP cache), and a pose captured before it lands would freeze GEORGIA
// into a bitmap under a cache key nothing re-keys. So the width reads 0 until the bytes are
// in: pencil-boil returns before the token bump at a non-positive box — the same contract
// the seed note below cites — and the opts watch re-bakes the instant it goes positive. The
// gate is the box, not a branch inside `logoPoseSvg`, so there is exactly one place that
// decides whether this surface is bakeable.
const faceCss = ref<string | null>(null);
void bakeFace().then((face) => {
  faceCss.value = face;
});
const captureW = computed(() =>
  faceCss.value === null ? 0 : (captureH.value * vbWidth.value) / 60,
);

const FONT_FACE = computed(
  () =>
    `@font-face{font-family:'FrauncesBake';font-style:normal;font-weight:100 900;src:url('${faceCss.value}') format('woff2');}`,
);

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function logoPoseSvg(f: number): string {
  const pid = logoPoseIds.value[f];
  const ink = resolveCssValue(logoSvgRef.value, "color", "#1a1a1a");
  const w = vbWidth.value;
  const defs =
    readFilterDefs(pid) +
    `<style>${FONT_FACE.value}text{font-family:'FrauncesBake',Georgia,serif;` +
    // `font-variation-settings:'opsz' 52` PINNED, matching `.logo-text` below (mark 4 M2).
    // `font-optical-sizing: auto` resolves opsz to the axis MINIMUM (9) in WebKit here, not to
    // the 52 px font-size — measured: the same label is 211.39 user units at auto/opsz 9 and
    // 244.83 at opsz 52. The measuring <text> and this detached blob resolved it differently,
    // so `vbWidth` was cut from one metric and the bake painted with the other; ink ran past
    // the box and all five wordmarks were clipped at the right edge (measured on real WebKit
    // against the base dist: ink reached the final column of every one of the five bitmaps).
    // Pinning both sides makes the measure and the paint the same font.
    `font-weight:900;font-size:52px;letter-spacing:0.02em;font-variation-settings:'opsz' 52;` +
    `fill:${ink};}</style>`;
  const body = `<g filter="url(#${pid})"><text x="4" y="48" text-anchor="start">${escapeXml(label.value)}</text></g>`;
  return serializePoseSvg({ width: w, height: 60, viewBox: `0 0 ${w} 60`, defs, body });
}

/**
 * ── THE CAPTURE INVARIANT (CH-67, T8-W4) ─────────────────────────────────────────────
 *
 * A bitmap shown at any size other than the one it was baked at is soft, and the wordmark is
 * the surface with the most ways to be shown at another size — a height ladder with four rungs,
 * two `--logo-scale` regimes, a game swap, a DPR change, and a masthead that is FLIP-ed on
 * every gallery fold. So the bake site carries a number rather than an intention:
 *
 *   In every SETTLED state, for every pose:
 *       intrinsic device px  ÷  (rendered CSS box × devicePixelRatio)  ∈ [0.99, 1.5]
 *   and the count of settled states outside that band is 0.
 *
 * The floor is 0.99 and not 1.0 because `latchWholePx` deliberately holds a reading within a
 * whole pixel of the box (its own note argues why), so the capture may sit up to 1 css px under
 * a box measured in the hundreds — 0.997 at 320 px wide, the tightest cell in the estate. The
 * CEILING is half the invariant: an over-bake is the same defect with the other sign, and it is
 * the sign CH-67 actually shipped for a tranche (×3.61 in the gallery, eight PNGs at 1989×582
 * for a 551-device-px box). One band catches both.
 *
 * COUNTED by `e2e/gallery.spec.ts` §CH-67, which walks playing → gallery → playing and asserts
 * the band at each rest. It is born RED against the incumbent: 0.2955 on the third reading.
 *
 * The three inputs the band rests on, so a future edit knows what it may not break: `captureH`
 * is the LAYOUT box (never a bounding client rect — §CH-67 in `rasterPose.ts`), `captureW` is
 * derived from it rather than observed a second time (T6.2, above), and `dpr` is the library's
 * (`matchMedia` re-arm, so a monitor change re-bakes).
 */
const logoRaster = useRasterStack(() => ({
  cacheKey: `logo-${label.value}-${isDark.value ? "d" : "l"}-${vbWidth.value}`,
  poseCount: logoPoseIds.value.length,
  poseSvg: logoPoseSvg,
  // No fallback arithmetic: pencil-boil 0.10.0's F2 returns before the token bump at a
  // non-positive cssSize and re-bakes when the box lands, so the invented 72 px seed — which
  // an <svg> needs because it has no offsetWidth, so any element-size seed reads 0 — is the
  // library's problem now, and it solves it by NOT baking rather than by baking wrong.
  // BC6-G1: the latched whole-pixel box, not a fresh round of every observation — see
  // `latchWholePx` above for the measurement that rejected quantization in its favour.
  cssSize: { width: captureW.value, height: captureH.value },
}));

// The baked poses ARE object URLs now (pencil-boil 0.11) — `useRasterStack` reads its own
// capture canvas and mints the handles, so there is no bitmap to re-draw, re-encode or close
// here. The urls are RETAINED while the handle's `urls` is null (a re-bake in flight) so the
// wordmark swaps atomically: the old label/ink holds until the new poses land, then one
// assignment. The library owns every handle's lifetime; this surface revokes nothing.
// T6.2 — the reset key is the logo's geometry, the grid's own discipline. A label swap or
// the post-font re-measure changes `vbWidth`, and retained poses baked at the OLD width
// stretch into the new viewBox (`preserveAspectRatio="none"`) until the re-bake lands —
// a fringed wordmark, wider the slower the fonts. Dropping them takes the live-filter
// fallback (pinned pose 0, correct geometry) across the window instead. A re-tint keeps
// retaining: `isDark` stays out of the key.
const logoUrls = retainedPoseUrls(logoRaster, () => `${label.value}-${vbWidth.value}`);
const logoBaked = computed(
  () => logoUrls.value.length > 0 && logoUrls.value.length === logoPoseIds.value.length,
);

/**
 * ── CH-66 · THE STACK IS HIDDEN, NEVER TORN OUT (T7-WGATE) ───────────────────────────
 *
 * WebKit synthesizes a `click` only from a mousedown/mouseup PAIR whose targets still share
 * an ancestor IN THE DOCUMENT. `logoBaked` flipping used to remove the whole live `<g>` stack
 * (`v-for="… logoBaked ? [] : logoPoseIds"`) and put `<image>` siblings in its place, so a
 * press straddling the bake lost the half whose target had been destroyed and the wordmark —
 * a real `<button>` on a real user's screen — did nothing at all, silently.
 *
 * MEASURED, on the disease's own instrument (evidence/wgate/ch66-product-cure.md; the rig is
 * `futoshiki.spec.ts`'s exact path, one fresh context per iteration, document-level capture
 * listeners): 5 of 90 unaided presses dropped on darwin WebKit, 0 of 30 on Chromium — and two
 * of those five caught the mechanism whole, `mousedown → text.logo-text`, `mouseup →
 * image.logo-pose-bmp`, NO click, both halves in the document and no common ancestor left
 * between them. Post-cure: 0 of 90.
 *
 * THE CURE IS THE ESTATE'S OWN IMMUNE GRAMMAR, copied rather than invented: `HandDrawnGrid`
 * and `HandDrawnOutline` bake identically and keep the live stack MOUNTED and `display: none`
 * (`baked-hidden`). A `display: none` subtree generates no boxes, no layers and no filter
 * raster — the live-filter census excludes it by its own counting rule (own computed `display`
 * ≠ none, `filterBudget.ts`) — while its NODES stay connected, which is the entire property the
 * pointer needs. The parked stack is also pinned OFF rather than following the beat, so unlike
 * the grid's reference it takes not one write per beat while hidden.
 *
 * THE SECOND HALF, and it is the direction the harness cure could not reach: the reset key
 * (`label`-`vbWidth`) sends a baked wordmark BACK to the live arm on a game swap or a post-font
 * re-measure, and THAT tear-out is the `<image>` stack's — which cannot be mounted through a
 * bake, since poses baked at the old width would stretch into the new viewBox (the fringed
 * wordmark this file's retention note rejects). So neither arm is a pointer target at all:
 * `pointer-events: none` puts the hit on the `<svg>`/`<button>`, which no bake in either
 * direction unmounts. This is not a new idea either — `DarkModeToggle`'s rest stacks have been
 * pointer-transparent since T3-W13, which is why its two tear-out sites never dropped a press.
 */
</script>

<template>
  <div class="logo-menu">
    <component
      :is="inertHeading ? 'span' : 'button'"
      :type="inertHeading ? undefined : 'button'"
      class="logo-trigger"
      :aria-label="inertHeading ? undefined : `Puzzle: ${label}. Choose a puzzle`"
      @click.stop="inertHeading || emit('open')"
      @pointerenter="hovered = true"
      @pointerleave="hovered = false"
    >
      <span v-if="inertHeading" class="sr-only">{{ label }}</span>
      <svg
        ref="logoSvgRef"
        class="handwritten-logo"
        :class="{ 'is-drawn': isDrawn }"
        :viewBox="`0 0 ${vbWidth} 60`"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <!-- Measuring text: always present (unfiltered, invisible) so getBBox can
                     size the variable-width viewBox even once the poses are baked. -->
        <text
          :ref="setTextRef"
          class="logo-text logo-measure"
          x="4"
          y="48"
          text-anchor="start"
        >
          {{ label }}
        </text>
        <!-- T4-W1 baked poses: static <image> siblings of the captured bitmaps,
                     opacity-swapped on the beat (no filter, no per-beat raster). -->
        <template v-if="logoBaked">
          <image
            v-for="(url, f) in logoUrls"
            :key="`lg-${f}`"
            class="logo-pose-bmp"
            :class="{ 'is-active': logoPose === f }"
            :href="url"
            x="0"
            y="0"
            :width="vbWidth"
            height="60"
            preserveAspectRatio="none"
          />
        </template>
        <!-- Fallback while baking: the live #wobble-logo-p{i} pose stack
                     (T3-W13 §1-P3). T4-WM rank 1: PINNED to pose 0 — `is-active` never
                     follows the beat while unbaked, so the live filter rasters ONCE, not
                     per beat. One raster per appearance — no startup flash.
                     CH-66: MOUNTED THROUGH THE BAKE, never torn out — see the script's
                     §CH-66 block. Parked, it is `display: none` and carries neither
                     `logo-pose` nor `is-active`: it has left the STACK (which is what
                     both classes name, and what the estate censuses) and become a node
                     that only the pointer still has business with. -->
        <g
          v-for="(pid, f) in logoPoseIds"
          :key="pid"
          :class="
            logoBaked ? 'logo-pose-parked' : ['logo-pose', { 'is-active': f === 0 }]
          "
          :filter="`url(#${pid})`"
        >
          <text class="logo-text" x="4" y="48" text-anchor="start">{{ label }}</text>
        </g>
      </svg>
      <span v-if="!inertHeading" class="logo-caret" aria-hidden="true">
        <HandwrittenGlyph
          value=">"
          :is-given="true"
          :is-overridden="false"
          :is-solved="false"
          :is-revealed="false"
          :noise-delay="0"
          :position="0"
          :board-size="5"
          :is-hovered="hovered"
        />
      </span>
    </component>
  </div>
</template>

<style scoped>
.logo-menu {
  position: relative;
  align-self: flex-start;
  display: inline-block;
  --caret-size: 1.5rem;
  /* One golden rung up (×√φ, 1.272) from the shipped 3.5/4.5/5.5rem ladder — the
       single source for the wordmark's rendered size (L25-49: no scattered height
       literals; each breakpoint re-pins this var). */
  --logo-height: 4.452rem;
  /* Caret optical center (H3): the wordmark is lowercase on a 60-unit box with its
       baseline at y=48, so the x-height band — the ink mass the eye centers on —
       sits ~4.5 units BELOW the box's geometric middle. Flex centers the box; this
       nudge (4.5/60 of the rendered height) re-centers the caret on the ink. */
  --caret-nudge: calc(var(--logo-height) * 0.075);
}

/* Narrow-phone floor (T4-W10 gate 3, WCAG 1.4.10). The base rung renders the longest
   wordmark ("futoshiki") at ~301px; + the 0.4rem gap + the 1.5rem caret it totals ~332px,
   which overruns a 320px viewport's ~312px content box — the sole horizontal-reflow overflow
   at 320 (the board itself is 296px and fits). Step the height ladder one rung DOWN below
   360px so the wordmark + caret clears the narrowest supported width without a horizontal
   scrollbar. Proportional (the caret + its optical nudge ride --logo-height), so the wordmark
   only softens a step — never letterboxed, never clipped. ≥360px (375, iPhone-13 390, desktop
   1280) is untouched, so no capture/golden at those widths moves. */
@media (max-width: 360px) {
  .logo-menu {
    --caret-size: 1.3rem;
    --logo-height: 3.9rem;
  }
}

/* Reset the trigger back to bare inline content — the wordmark IS the affordance (mirrors
   AttributionCard.attribution-trigger). font-family is set explicitly, NOT `inherit`, so the
   Fraunces display face is unambiguous (avoids the inherit-specificity defeat, type-audit D2). */
.logo-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: var(--color-foreground);
  -webkit-tap-highlight-color: transparent;
}

/* The inert heading is a name, not a target — no hand cursor over something that cannot be
   pressed (the reset above is written for the button arm). */
span.logo-trigger {
  cursor: default;
}

.logo-trigger:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-foreground) 40%, transparent);
  outline-offset: 4px;
  border-radius: 0.35rem;
}

.handwritten-logo {
  /* --logo-scale (default 1) is the drawer's grow hook (T3-W12 §6): the closed
       regime pins 1.05 from App.vue and the wordmark takes it as a LAYOUT size at
       the settle's one layout step — never a filtered-element size tween (the glide
       itself covers the move with a transform on the masthead h1). */
  height: calc(var(--logo-height) * var(--logo-scale, 1));
  width: auto;
  color: var(--color-foreground);
  display: block;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 1.2s var(--ease-noteWrite);
}

.handwritten-logo.is-drawn {
  clip-path: inset(0 0% 0 0);
}

/* T3-W13 §1-P3 — pose-stack siblings: each is its own composited layer so the
   beat's opacity flip is compositor-only, never a repaint (the grid's
   boil-frame-layer discipline, HandDrawnGrid.vue). */
.logo-pose {
  opacity: 0;
  will-change: opacity;
}

.logo-pose.is-active {
  opacity: 1;
}

/* CH-66 — the parked live stack, once the bitmaps hold the surface: mounted, connected, and
   generating nothing. `display: none` is HandDrawnGrid's `baked-hidden` verbatim: no box, no
   layer, no filter raster, and the live-filter census excludes it by its own counting rule.
   No `will-change` — a promoted layer with nothing to promote is residency for free
   (HandDrawnOutline's pose-prune says the same in its own words). */
.logo-pose-parked {
  display: none;
}

/* T4-W1 baked poses: the same opacity-swap discipline on static <image> siblings (filter
   removed) — the flip is compositor-only, no raster recurs. */
.logo-pose-bmp {
  opacity: 0;
  will-change: opacity;
}

.logo-pose-bmp.is-active {
  opacity: 1;
}

/* CH-66 — NEITHER ARM IS A TARGET. The wordmark's affordance is the `<button>`; the poses are
   ink inside an `aria-hidden` svg. Both stacks are swapped out from under a live pointer at
   some point in a bake cycle (the live groups when the bitmaps land, the bitmaps when the reset
   key sends the surface back), so the hit belongs on a node no bake unmounts. `.logo-measure`
   has always declared this for itself; the poses now say it too. */
.logo-pose,
.logo-pose-bmp {
  pointer-events: none;
}

/* The measuring text is invisible — it exists only to keep getBBox alive for the
   variable-width viewBox once the poses are baked (it never carries the filter). */
.logo-measure {
  opacity: 0;
  pointer-events: none;
}

.logo-text {
  /* The display register token (--font-display ← Fraunces + the serif fallbacks) —
       H4 ladder-bind; resolves byte-identically to the old inline stack. */
  font-family: var(--font-display);
  font-weight: 900;
  /* 52px here is viewBox GEOMETRY, not a type rung: user units inside the 60-unit
       box (baseline y=48). The rendered size rides --logo-height's golden ladder; a
       rem/clamp rung would couple glyph metrics to root font-size / viewport width
       and clip the fixed box. Deliberately off-token. */
  font-size: 52px;
  /* PINNED, not `font-optical-sizing: auto` (mark 4 M2). Auto resolves this face's `opsz` to
     the axis minimum (9) in WebKit rather than to the 52 px size — a TEXT optical size on the
     display wordmark, thin and narrow, and 33 user units narrower per label than opsz 52. The
     measuring <text> here and the bake's detached blob disagreed on it, which is what clipped
     all five labels. 52 matches the font-size above by construction: the geometry and the
     optical size are the same number, so neither can drift from the other. */
  font-variation-settings: "opsz" 52;
  fill: currentColor;
  letter-spacing: 0.02em;
}

/* The interactive tell: the futoshiki '>' glyph rotated to a downward chevron — the "there's
   more, open it" cue (the wordmark now opens the gallery, T4-W12 Wave D). Hover wiggle rides
   HandwrittenGlyph's own glyph-wiggle (PRM-gated inside the glyph). */
.logo-caret {
  position: relative;
  flex: none;
  width: var(--caret-size);
  height: var(--caret-size);
  color: var(--color-foreground);
  transform: translateY(var(--caret-nudge)) rotate(90deg);
  transition: transform 200ms var(--ease-noteWrite);
}

@media (min-width: 640px) {
  .logo-menu {
    --caret-size: 1.9rem;
    --logo-height: 5.724rem;
  }
}

@media (min-width: 1024px) {
  .logo-menu {
    --caret-size: 2.3rem;
    --logo-height: 6.996rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .handwritten-logo {
    clip-path: none;
    transition: none;
  }
  .logo-caret {
    transition: none;
  }
}
</style>

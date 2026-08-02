<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, nextTick, ref } from "vue";
import { heldFrameCount, serializePoseSvg, useRasterStack } from "@mkbabb/pencil-boil";
import { useElementSize } from "@vueuse/core";
import { generateGridBoilFrames, generateFrameTraceFrames } from "../gridPaths";
import { BOIL_CONFIG, FILTER_PRESETS, beatsFor } from "@pencil/config/pencilConfig";
import { useBeatFrame } from "@pencil/composables/boilBeat";
import {
  readFilterDefs,
  resolveCssValue,
  retainedPoseUrls,
} from "@pencil/composables/rasterPose";
import { useTheme } from "@/composables/useTheme";
import { usePathAnimation } from "./usePathAnimation";
import type { AnimationState } from "@pencil/types";

const props = defineProps<{
  boardSize: number;
  subgridSize: number;
  animState: AnimationState;
  /** T4-W9 board FILL fraction in [0,1] (default 0). The GAME owns the number — a
   *  `computed` over its own values/givens, re-evaluated on a fill/clear, NEVER on the
   *  beat — and this frame owns the render. Both boards pass the identical prop, so the
   *  twin is automatic: there is no second implementation to keep in sync. */
  progress?: number;
  /** True at the win (`solveState === 'solved'`). P1-W3 / r3 §4.4: the trace is invisible then
   *  (`.solve-success .progress-trace { opacity: 0 }`), so its pose stack must stop trading
   *  opacity 8/s over the whole board box — but it must NOT be unmounted, or the 500 ms
   *  bow-out that hands the frame to the gold has nothing left to fade. Pinned, not deleted. */
  solveSuccess?: boolean;
}>();

const emit = defineEmits<{
  (e: "animationComplete", state: "drawn" | "hidden"): void;
}>();

const svgRef = ref<SVGSVGElement | null>(null);
const { pathsVisible, animateDrawIn, animateErase, showInstant, cleanup } =
  usePathAnimation(svgRef);

const VIEWBOX_SIZE = 1000;

// Generate boil frame variants whenever board size changes
const boilFrames = computed(() =>
  generateGridBoilFrames(
    props.boardSize,
    props.subgridSize,
    VIEWBOX_SIZE,
    42,
    BOIL_CONFIG.frameCount,
    BOIL_CONFIG.frameBoil,
    BOIL_CONFIG.subgridBoil,
    BOIL_CONFIG.cellBoil,
  ),
);

// Path-based boil on the SHARED beat (T3-W12 §2 P1): the frame index advances on the
// one app-wide beat window instead of a privately-anchored subscriber, so the grid's
// swap lands in the same dirty frame as every other boil.
// heldFrameCount: collapses to 1 while the answer-key laminate holds the page —
// useBeatFrame's total<=1 path freezes the boil in place (W9 §2, contract kept).
const boilFrame = useBeatFrame(
  heldFrameCount(() => BOIL_CONFIG.frameCount),
  () => beatsFor(BOIL_CONFIG.intervalMs),
);

// Freeze on frame 0 during draw-in (strokeDashoffset needs stable paths)
const activeFrame = computed(() => (pathsVisible.value ? boilFrame.value : 0));

// ── T4-W9 progress trace: the violet second-pencil FILL gauge ──
//
// A grain-BAKED filterless sibling of the frame — generateFrameTraceFrames emits the SAME
// ring geometry as generateGridBoilFrames' frame with the grain folded IN (the
// HandDrawnOutline grammar, NOT the grid's live-filter grammar), so the violet retraces the
// graphite frame in registration. frameCount static poses, opacity-swapped on the SAME
// boilFrame beat as the grid: steady-state raster zero (no live `filter=` to invalidate).
const progress = computed(() => Math.max(0, Math.min(1, props.progress ?? 0)));
const progressPercent = computed(() => Math.round(progress.value * 100));

// pathLength=1000 (on each path, template) normalises arc length across all 4 poses AND
// every board size; the dash draws arc-length 0 → progress·perimeter clockwise from the
// top-left. A fill event mutates exactly this one custom value — a cheap paint, never the
// beat, never a filter re-raster.
const traceDashOffset = computed(() => 1000 * (1 - progress.value));

// Grain-static baked in (the grid's own tooth, in the 1000-unit viewBox regime the trace
// lives in — the T3-W13 grain-in-geometry discipline reused verbatim). Reactive on
// BOIL_CONFIG + the preset, so FilterTuner mutations re-bake live.
const traceFrames = computed(() =>
  generateFrameTraceFrames(
    VIEWBOX_SIZE,
    42,
    BOIL_CONFIG.frameCount,
    BOIL_CONFIG.frameBoil,
    FILTER_PRESETS["grain-static"]?.grain,
  ),
);

// Current frame's path data (transition layer — draw-in/erase only, see template)
const currentPaths = computed(() => {
  const f = activeFrame.value;
  const bf = boilFrames.value;
  return {
    frame: bf.frame[f],
    subgridLines: bf.subgridLines.map((line) => line[f]),
    cellLines: bf.cellLines.map((line) => line[f]),
  };
});

// ── Steady-state boil layer (grain-static decoupled from ticking geometry) ──
//
// Prototype 9 (grain-static-overlay): the transition layer above re-binds `d` on
// every boil tick, and while `pathsVisible` it shares a paint group with
// `grain-static`. Because grain-static's own turbulence params never change
// (pencilConfig.ts), the *only* reason it ever re-rasterizes is co-location with
// geometry that does — see pass-1 fe-boil-pipeline.md §2. Once the board reaches
// steady state ('drawn'), the transition `<g>` unmounts entirely (template below)
// and is replaced by `BOIL_CONFIG.frameCount` sibling groups, each rendering ONE
// frame variant's *static* geometry (bound directly to `boilFrames.value`, never
// to the ticking `boilFrame` ref) with grain-static applied once. The ticking
// signal only toggles which sibling is opacity:1 — a compositor-stage change that
// does not invalidate any group's own SourceGraphic, so grain-static's raster is
// computed at most `frameCount` times total instead of once per ~150ms tick.
function pathsForFrame(f: number) {
  const bf = boilFrames.value;
  return {
    frame: bf.frame[f],
    subgridLines: bf.subgridLines.map((line) => line[f]),
    cellLines: bf.cellLines.map((line) => line[f]),
  };
}

const steadyFrames = computed(() =>
  Array.from({ length: BOIL_CONFIG.frameCount }, (_, f) => pathsForFrame(f)),
);

// ── T4-W1: the steady poses baked to bitmaps (the WebKit cure) ──
//
// The `grain-static` siblings above re-rasterize the whole filter chain on every opacity
// flip in WebKit (~150–224 ms board-area raster per beat, ~2 cores at idle). Capture each
// frozen pose to an ImageBitmap ONCE (useRasterStack) and opacity-swap static <image>
// siblings — no filter re-executes at steady state in either engine, and Chromium's
// residual ~8/s tile churn zeroes with it. The live-filter <g> stack (template §fallback)
// renders until the bitmaps resolve, so the swap never flashes and the mount's synchronous
// burst is never blocked (the bake is async — the old W8 mount-chunking concern folds into
// this path). Re-bake fires on DPR (useRasterStack's matchMedia), theme flip (the cacheKey
// token, masked by the toggle's Bloom), and container resize (useElementSize).
const { isDark } = useTheme();
const { width: hostW, height: hostH } = useElementSize(svgRef);

// The grid renders as a centered square (preserveAspectRatio meet), so capture a SQUARE
// bitmap at the rendered side — displaying it back at width=height=1000 can't squash it.
// Quantized to 4px so a drag-resize doesn't thrash the bake.
const captureSide = computed(() => {
  const s = Math.min(hostW.value, hostH.value);
  return s > 0 ? Math.round(s / 4) * 4 : 620;
});

function gridPoseSvg(pose: number): string {
  const color = resolveCssValue(svgRef.value, "--grid-line-color", "#262626");
  const defs = readFilterDefs("grain-static");
  const paths = steadyFrames.value[pose];
  const stroke = (d: string, w: number, op: number, join = false): string =>
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" ` +
    `stroke-opacity="${op}" stroke-linecap="round"` +
    (join ? ' stroke-linejoin="round"' : "") +
    "/>";
  let body = '<g filter="url(#grain-static)">';
  body += stroke(paths.frame, 12, 0.95, true);
  for (const d of paths.subgridLines) body += stroke(d, 8, 0.9);
  for (const d of paths.cellLines) body += stroke(d, 5, 0.7);
  body += "</g>";
  return serializePoseSvg({ width: VIEWBOX_SIZE, height: VIEWBOX_SIZE, defs, body });
}

const gridRaster = useRasterStack(() => ({
  // The theme token separates light/dark bitmaps in the shared cache and re-bakes on a
  // flip; the literal stroke color is read fresh in gridPoseSvg at capture time (the grid
  // line color snaps with the theme class — no transition to catch mid-tween).
  cacheKey: `grid-${props.boardSize}-${props.subgridSize}-${isDark.value ? "d" : "l"}`,
  poseCount: BOIL_CONFIG.frameCount,
  poseSvg: gridPoseSvg,
  cssSize: { width: captureSide.value, height: captureSide.value },
  // T4-WM rank 1/2/4: cap the GRID bake at DPR2 — WebKit-gated (seal adjudication). The cap
  // halves grid bitmap + decode residency (19→8 MB) and cuts the cold-load window ~23% with
  // ⅔ fewer long tasks. Licensed per-engine by the ≥0.98 SSIM floor: WebKit measured 0.9888
  // (every iOS browser is WebKit — the E8 target); chromium measured 0.9652 (thin-line
  // resample softness, below floor), so chromium — incl. desktop at >200% display scaling —
  // keeps native DPR. GRID-ONLY by license: the logo is Fraunces text (sharpness-sensitive,
  // UNtested) and the toggle is small — neither is capped without its own SSIM pass.
  dpr: Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    typeof navigator !== "undefined" && navigator.vendor === "Apple Computer, Inc."
      ? 2
      : Infinity,
  ),
}));

// The baked poses ARE object URLs (pencil-boil 0.11) backing static <image> siblings —
// opacity flips only, no per-beat drawImage, and no bitmap re-draw/encode/close between the
// capture and the render. `urls` goes null while a (re-)bake is in flight and the set is
// RETAINED across that null (the atomic-swap discipline, T4-WM rank 3): the old theme's
// <image> stack keeps rendering until the new poses land, then one assignment swaps — no
// mid-gesture drop to the live-filter fallback (the toggle Bloom masks the moment).
//
// The reset key is the STRUCTURAL escape: a board/subgrid change is not a re-tint, so the
// retained poses carry the wrong geometry. Dropping them takes the FROZEN-pose path —
// showBaked → false, and the live-filter fallback pinned to pose 0 holds the new geometry
// until the re-bake lands.
const bitmapUrls = retainedPoseUrls(
  gridRaster,
  () => `${props.boardSize}-${props.subgridSize}`,
);
const showBaked = computed(() => bitmapUrls.value.length === BOIL_CONFIG.frameCount);

const showTransitionLayer = computed(() => props.animState !== "drawn");
const showSteadyLayers = computed(() => props.animState === "drawn");

async function doDrawIn() {
  await nextTick();
  requestAnimationFrame(async () => {
    await animateDrawIn();
    emit("animationComplete", "drawn");
  });
}

async function doErase() {
  // Steady state ('drawn') unmounts the transition layer (§ steady-state boil
  // layer above) — wait for Vue's DOM patch to remount it before
  // usePathAnimation's querySelectorAll('path.grid-line') looks for it, or it
  // would find the wrong (or no) elements mid-swap.
  await nextTick();
  await animateErase();
  emit("animationComplete", "hidden");
}

watch(
  () => props.animState,
  (state) => {
    if (state === "drawing") doDrawIn();
    else if (state === "erasing") doErase();
  },
);

onMounted(() => {
  if (props.animState === "drawing") {
    doDrawIn();
  } else if (props.animState === "drawn") {
    showInstant();
  }
});

onUnmounted(() => {
  cleanup();
});
</script>

<template>
  <!-- FILL-gauge a11y mirror (T4-W9 ROW 3): the trace counts cells WRITTEN — wrong ones
       included — because the app grades correctness only on Solve. So this reads how FULL,
       never how RIGHT: role=progressbar, aria-valuetext "board N% filled" (never "correct").
       A visually-hidden multi-root sibling of the decorative svg. -->
  <div
    class="progress-trace-a11y"
    role="progressbar"
    aria-label="board fill"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="progressPercent"
    :aria-valuetext="`board ${progressPercent}% filled`"
  ></div>
  <!-- Decorative: the board's drawn rules. Its shape is already published by the grid's own
       role/rowcount/colcount and by every cell's name (a11y r1 M6). -->
  <svg
    ref="svgRef"
    aria-hidden="true"
    class="hand-drawn-grid"
    :viewBox="`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Transition layer: draw-in/erase only. Ticks `d` via strokeDashoffset
             (usePathAnimation) and the boil scheduler; unmounted entirely once
             steady state is reached (see §"Steady-state boil layer" in the script).
             Grain-hoist, transition extension (L28 F1): this layer NEVER carries
             grain-static — it exists only while geometry is animating, where the
             filter re-rasterizes the full board every frame for texture that isn't
             legible mid-motion (the draw-in already ran unfiltered: pathsVisible is
             false until it completes; the erase was the last filtered animator).
             The settled look is owned entirely by the pre-baked steady siblings. -->
    <g v-if="showTransitionLayer">
      <!-- Frame. The frame-line is the grid's only CLOSED path, and its four
                 independently-seeded sides never share a corner point — at the M/Z
                 vertex the endpoint mismatch (≈1.2px) extrudes a mitered barb under
                 the SVG default linejoin (the owner's board-artifact.png, T3-W12 §5).
                 Round join collapses it to a soft hand-drawn nub. Open subgrid/cell
                 lines need nothing. -->
      <path
        :d="currentPaths.frame"
        class="grid-line frame-line"
        fill="none"
        stroke="var(--grid-line-color, currentColor)"
        stroke-width="12"
        stroke-opacity="0.95"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Subgrid lines -->
      <path
        v-for="(d, i) in currentPaths.subgridLines"
        :key="'sg-' + i"
        :d="d"
        class="grid-line subgrid-line"
        fill="none"
        stroke="var(--grid-line-color, currentColor)"
        stroke-width="8"
        stroke-opacity="0.9"
        stroke-linecap="round"
      />

      <!-- Cell lines -->
      <path
        v-for="(d, i) in currentPaths.cellLines"
        :key="'cl-' + i"
        :d="d"
        class="grid-line cell-line"
        fill="none"
        stroke="var(--grid-line-color, currentColor)"
        stroke-width="5"
        stroke-opacity="0.7"
        stroke-linecap="round"
      />
    </g>

    <!-- Steady-state boil layer: `frameCount` pre-baked, grain-filtered
             siblings. Geometry is bound to the static `steadyFrames` array (never
             to the ticking `boilFrame` ref) — only `is-active`/opacity toggles per
             tick, a compositor-stage change that never invalidates a sibling's own
             SourceGraphic. Rendered only while 'drawn' (see showSteadyLayers). -->
    <template v-if="showSteadyLayers">
      <!-- T4-W1 baked poses: static <image> siblings of the captured bitmaps,
                 opacity-swapped on the beat. No filter, no per-beat raster — the WebKit
                 re-raster and Chromium's tile churn both go to zero. -->
      <template v-if="showBaked">
        <image
          v-for="(url, f) in bitmapUrls"
          :key="'bmp-' + f"
          class="boil-frame-bitmap"
          :class="{ 'is-active': boilFrame === f }"
          :href="url"
          x="0"
          y="0"
          :width="VIEWBOX_SIZE"
          :height="VIEWBOX_SIZE"
          preserveAspectRatio="xMidYMid meet"
        />
      </template>
      <!-- The live grain-static stack stays mounted: it is the during-bake fallback
                 AND the print surface (@media print blackens its .grid-line strokes, which
                 a baked bitmap can't take). Once baked it is display:none on screen
                 (baked-hidden) so no filter ever rasters at steady state.
                 T4-WM rank 1/3: while NOT baked (cold load / structural re-bake) the fallback
                 is PINNED to pose 0 — `is-active` never follows the beat, so WebKit rasters
                 the feTurbulence filter ONCE (the sanctioned transient) instead of re-executing
                 per beat at ~6 fps. Once baked, `is-active` tracks the beat but the layer is
                 display:none anyway, so the pin is a no-op there. -->
      <g
        v-for="(paths, f) in steadyFrames"
        :key="'boil-' + f"
        class="boil-frame-layer"
        :class="{
          'is-active': (showBaked ? boilFrame : 0) === f,
          'baked-hidden': showBaked,
        }"
        filter="url(#grain-static)"
      >
        <path
          :d="paths.frame"
          class="grid-line frame-line"
          fill="none"
          stroke="var(--grid-line-color, currentColor)"
          stroke-width="12"
          stroke-opacity="0.95"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          v-for="(d, i) in paths.subgridLines"
          :key="'sg-' + i"
          :d="d"
          class="grid-line subgrid-line"
          fill="none"
          stroke="var(--grid-line-color, currentColor)"
          stroke-width="8"
          stroke-opacity="0.9"
          stroke-linecap="round"
        />
        <path
          v-for="(d, i) in paths.cellLines"
          :key="'cl-' + i"
          :d="d"
          class="grid-line cell-line"
          fill="none"
          stroke="var(--grid-line-color, currentColor)"
          stroke-width="5"
          stroke-opacity="0.7"
          stroke-linecap="round"
        />
      </g>
    </template>

    <!-- Progress trace (T4-W9): the violet second-pencil FILL gauge. Its own filterless
             grain-baked sibling layer (never gated on animState — the fill is orthogonal to
             draw-in/erase), opacity-swapped on the SAME boilFrame beat as the frame it hugs
             and painted LAST so it sits over the graphite. The dash draws it to the current
             fill-front; .solve-success hides `.progress-trace` (index.css) so gold owns the
             win. Zero steady-state raster: filterless static geometry, compositor-only swap.
             P1-W3 / r3 §4.4 — the stack used to render and flip 8/s UNCONDITIONALLY. At
             `progress === 0` the dash offset is 1000, so the path draws nothing and four
             invisible <g>s traded opacity over the whole board box forever; now they are not
             rendered at all. At the win the trace is opacity 0 but must still FADE, so the
             stack is PINNED to pose 0 rather than unmounted (the logo's during-bake idiom) —
             the trade stops and the 500 ms bow-out survives. -->
    <g
      v-for="(d, f) in progress > 0 ? traceFrames : []"
      :key="'trace-' + f"
      class="progress-pose"
      :class="{ 'is-active': (solveSuccess ? 0 : boilFrame) === f }"
    >
      <path
        :d="d"
        class="progress-trace"
        fill="none"
        stroke="var(--color-progress-ink)"
        stroke-width="8"
        stroke-opacity="0.95"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1000"
        stroke-dasharray="1000 1000"
        :style="{ strokeDashoffset: traceDashOffset }"
      />
    </g>
  </svg>
</template>

<style scoped>
.hand-drawn-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
}

.boil-frame-layer {
  opacity: 0;
  /* Promotes each sibling to its own compositing layer so the opacity toggle
       below is a compositor-only blend, not a repaint — this is the will-change
       GPU-path hypothesis (sota-svg-anim-perf.md §3.6 / open question 11), tested
       incidentally by this prototype's before/after trace comparison. */
  will-change: opacity;
}

.boil-frame-layer.is-active {
  opacity: 1;
}

/* T4-W1 baked poses: the same opacity-swap discipline, but each sibling is a static
   <image> of the captured bitmap (filter removed) — the flip is a compositor-only blend
   and no raster ever recurs. */
.boil-frame-bitmap {
  opacity: 0;
  will-change: opacity;
}

.boil-frame-bitmap.is-active {
  opacity: 1;
}

/* Once baked, the live-filter stack stops rendering on screen (display:none → the filter
   never rasters at steady state); the bitmaps hold the surface. */
@media screen {
  .boil-frame-layer.baked-hidden {
    display: none;
  }
}

/* Print takes the vector filter stack (its .grid-line strokes blacken under @media print)
   and drops the baked bitmaps — a static one-shot render, no perf concern. */
@media print {
  .boil-frame-bitmap {
    display: none;
  }
}

/* T4-W9 progress trace — the same compositor-only opacity-swap discipline as the boil
   layers (filterless baked geometry; no raster ever recurs on the beat). */
.progress-pose {
  opacity: 0;
  will-change: opacity;
}

.progress-pose.is-active {
  opacity: 1;
}

/* The fill-front advances on FILL events only (progress is a computed over the game's
   values, never the beat). No-preference-gated: under PRM there is NO transition — the
   offset snaps to its correct static value and the beat is already frozen (boilBeat.ts),
   so the layer freezes on pose 0 with the right offset (PRM-safe by construction). The
   opacity term is the .solve-success bow-out (index.css asserts the end state); it lives
   here, unlayered, so a CSS-layer `transition` can't win over it. */
@media (prefers-reduced-motion: no-preference) {
  .progress-trace {
    transition:
      stroke-dashoffset 240ms ease,
      opacity 500ms ease;
  }
}

/* FILL-gauge a11y mirror — visually hidden, still announced (the sr-only clip). */
.progress-trace-a11y {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

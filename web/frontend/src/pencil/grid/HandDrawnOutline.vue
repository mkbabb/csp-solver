<script setup lang="ts">
import { computed, ref } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { generateRectBoilFrames } from "./gridPaths";
import { BOIL_CONFIG, FILTER_PRESETS, beatsFor } from "@pencil/config/pencilConfig";
import { heldFrameCount } from "@mkbabb/pencil-boil";
import { useBeatFrame } from "@pencil/composables/boilBeat";

// Px-native geometry — registration by construction (T3-W10 F1). The path is generated
// in a viewBox equal to the measured px border box padded by `outset` on every side:
// one number, one coordinate system, so the frame hugs its card at EVERY host size.
// (The old mixed system — a fixed -6px CSS outset against a proportional 8/1000-unit
// path inset — only registered at one size; the popover, the smallest host by 3–4×,
// floated ~5–6px.) Scale is 1:1, so preserveAspectRatio="none", vector-effect, and the
// anisotropic-wobble side effect all vanish.
//
// Stroke presence (T3-W12 §3, owner finding 2): everything expressed in absolute user
// units re-derived for the px regime — its own grain preset (`grain-outline`), its own
// boil constant (`outlineBoilPx`), outset 4 (the BEFORE ~4px air), corners square by
// default (the BEFORE character: hand-ruled sides crossing with jagged overshoot; the
// auto border-radius read is gone — the quarter-arc corners it produced read geometric,
// out of family with the sides).
//
// T3-W13 §1-P2: grain-outline is no longer a live filter here — its GrainConfig feeds
// the geometric bake (gridPaths.ts §Grain bake) and the poses render as static
// filterless siblings, opacity-swapped on the beat. Steady-state raster: zero.
const props = withDefaults(
  defineProps<{
    strokeWidth?: number;
    /** Air between the card's border box and the drawn frame, in px (per-host tunable). */
    outset?: number;
    /** Corner radius in px. Default 0 — square, jagged overshoot crossings (opt-in only). */
    radius?: number;
    /** Externally-driven boil pose (T4-W12). When PRESENT the outline renders this frame
     *  index and enrols NO shared beat — the PosterBoard discipline, generalized: a gallery
     *  flank card's frame must enrol nothing (the frozen-pose-0 soul gate), and the ONE
     *  live card's frame is driven from the gallery's single beat. ABSENT (every existing
     *  consumer — grid, drawer tab, logo, error note) → the outline enrols the shared beat
     *  itself, byte-identically to before. The branch is fixed at setup: a consumer either
     *  binds `:pose` for its whole life (gallery cards) or never does (everyone else). */
    pose?: number;
  }>(),
  {
    strokeWidth: 6,
    outset: 4,
    radius: 0,
  },
);

const containerRef = ref<HTMLElement | null>(null);
const width = ref(0);
const height = ref(0);

useResizeObserver(containerRef, (entries) => {
  const entry = entries[0];
  if (entry) {
    width.value = entry.contentRect.width;
    height.value = entry.contentRect.height;
  }
});

// On the shared beat (T3-W12 §2 P1): the outline's swap coalesces with the grid's —
// UNLESS a `:pose` is supplied (T4-W12), in which case the frame is driven externally and
// this instance enrols nothing (the gallery owns the one beat; flanks stay frozen). The
// enrolment decision is made ONCE here at setup: `props.pose === undefined` for every
// pre-W12 consumer, so their code path (and their pixels) are unchanged.
// heldFrameCount (P1-W3): the answer-key laminate's boil hold was NEVER TOTAL — only
// HandDrawnGrid and BoilDivider wrapped their counts, so every other beat surface kept
// breathing under a hold that was supposed to still the page. `heldFrameCount` collapses the
// count to 1 during a hold and `useBeatFrame`'s `total <= 1` path freezes IN PLACE (no snap to
// pose 0); release returns the real count and the boil resumes mid-cadence. Contract repair,
// not perf.
const beatFrame =
  props.pose === undefined
    ? useBeatFrame(
        heldFrameCount(() => BOIL_CONFIG.frameCount),
        () => beatsFor(BOIL_CONFIG.intervalMs),
      )
    : null;
const currentFrame = computed(() => {
  if (beatFrame) return beatFrame.value;
  const total = Math.max(1, BOIL_CONFIG.frameCount);
  return Math.max(0, Math.min(total - 1, Math.floor(props.pose ?? 0)));
});

// T3-W13 §1-P2: the grain is baked INTO the pose geometry (gridPaths.ts §Grain bake,
// params derived from grain-outline's own GrainConfig — reactive, so FilterTuner
// mutations re-bake live) and the poses render as static filterless siblings below.
// The live `url(#grain-outline)` re-rastered the whole filter graph every beat.
const frames = computed(() => {
  if (width.value === 0 || height.value === 0) return [];
  const vbW = width.value + props.outset * 2;
  const vbH = height.value + props.outset * 2;
  return generateRectBoilFrames(
    0,
    0,
    vbW,
    vbH,
    { roughness: 0.5, segments: 6, seed: 77, jagged: true },
    BOIL_CONFIG.outlineBoilPx,
    BOIL_CONFIG.frameCount,
    props.radius,
    FILTER_PRESETS["grain-outline"]?.grain,
  );
});

const viewBox = computed(
  () => `0 0 ${width.value + props.outset * 2} ${height.value + props.outset * 2}`,
);
</script>

<template>
  <div
    ref="containerRef"
    class="outline-container"
    :style="{ '--outline-outset': `${props.outset}px` }"
  >
    <slot />
    <!-- T3-W13 §1-P2 — the grid's steady-state template minus the filter:
             frameCount pre-baked grain-in-geometry siblings; the beat only flips
             which one is opacity:1 (compositor-only — no SourceGraphic invalidation,
             zero steady-state raster). -->
    <svg
      v-if="frames.length"
      class="outline-svg"
      :viewBox="viewBox"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        v-for="(d, f) in frames"
        :key="f"
        class="boil-pose"
        :class="{ 'is-active': currentFrame === f }"
      >
        <path
          :d="d"
          fill="none"
          stroke="currentColor"
          :stroke-width="props.strokeWidth"
          stroke-opacity="0.95"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.outline-container {
  position: relative;
  overflow: visible;
}

.outline-svg {
  position: absolute;
  inset: calc(var(--outline-outset, 0px) * -1);
  width: calc(100% + var(--outline-outset, 0px) * 2);
  height: calc(100% + var(--outline-outset, 0px) * 2);
  pointer-events: none;
  z-index: 1;
  overflow: visible;
}

/* The grid hoist's sibling discipline (HandDrawnGrid.vue): each pose promoted so
   the beat's opacity toggle is a compositor-only blend, never a repaint. */
.boil-pose {
  opacity: 0;
  will-change: opacity;
}

.boil-pose.is-active {
  opacity: 1;
}
</style>

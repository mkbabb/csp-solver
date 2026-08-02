<script setup lang="ts">
/**
 * The gold star — ONE component, TWO instances (T6 mark 14).
 *
 *  · the STICKER (default): the foil star pressed into the completion vignette's slot,
 *    landing at the crest with `sticker-pop`.
 *  · the BLOOM (`bloom`): an overlay inside `.board-wrapper` that grows a small star to
 *    the whole board — the storybook read the mark asks for — flashes its OUTLINE ALONE,
 *    then dissolves and hands the moment to the sticker and the heart.
 *
 * The bloom's layout box rests at the FINAL board size and only ever scales DOWN to it
 * (0.06 → 1.06), the estate's raster rule: no cached raster upsamples. It carries NO
 * filter, so the census is untouched.
 *
 * The union's foil-gleam is DELETED. It was a full-slot gold plate sweeping a mask —
 * the rectangle flash the owner marked. What replaces it is a twin of the star's own
 * path, `fill: none`, animating opacity: the flash is literally just the outline.
 *
 * Motion is the CSS vocabulary (assets/index.css) with CELEBRATION's numbers bound in —
 * zero subscribers, zero timers, no dashoffset dance.
 * PRM / a remount while solved: `is-settled` — the sticker is simply there, the bloom
 * never mounts a second time.
 */
import { ref, watch } from "vue";
import { usePrefersReducedMotion } from "@mkbabb/pencil-boil";
import { CELEBRATION, MASCOT_COLORS } from "@pencil/config/pencilConfig";

// T3-W10 celestial rewire (F8 §2.2): the star's gold is the celestial family's —
// sparkle fill + rays stroke from MASCOT_COLORS, not duplicated hexes. Values unchanged.
const GOLD = MASCOT_COLORS.celestial.sun;

const props = defineProps<{ active: boolean; bloom?: boolean }>();

const visible = ref(false);
const settled = ref(false);
const reducedMotion = usePrefersReducedMotion();

const bloomDelay = `${CELEBRATION.starBloomStartMs}ms`;
const bloomDur = `${CELEBRATION.starBloomMs}ms`;
const crestDelay = `${CELEBRATION.starCrestMs}ms`;
const flashDur = `${CELEBRATION.starFlashMs}ms`;
const fadeDur = `${CELEBRATION.starFadeMs}ms`;
const landDur = `${CELEBRATION.starLandMs}ms`;

// A slightly wonky hand-drawn 5-point star (viewBox 0 0 48 48), open at Z for a crayon feel.
const STAR_D =
  "M23.5,4.2 L28.9,17.3 L43.2,18.1 L31.4,26.6 L36,40.4 L24.2,31.7 L12,40 L16.6,26.3 L4.8,17.6 L19.1,17.7 Z";

// `immediate` + the `prev === undefined` probe: a component that MOUNTS with
// active=true (remount while solved) settles instantly; a live false→true flip
// keeps the full crest choreography. The composition survives remounts (§1 P5).
watch(
  () => props.active,
  (a, prev) => {
    settled.value = prev === undefined || reducedMotion.value;
    // The bloom is a MOMENT, and a settled activation has no moment left to play — it
    // never mounts at all. The sticker mounts either way; `is-settled` stills it.
    visible.value = a && !(props.bloom && settled.value);
  },
  { immediate: true },
);

// The bloom is a MOMENT: it leaves the DOM when its dissolve ends. Global keyframe
// names are unhashed, so the name is the whole test.
function onEnd(e: AnimationEvent) {
  if (props.bloom && e.animationName.startsWith("bloom-out")) visible.value = false;
}
</script>

<template>
  <div
    v-if="visible"
    class="celebration-star"
    :class="{ 'is-bloom': bloom, 'is-settled': settled }"
    aria-hidden="true"
    @animationend="onEnd"
  >
    <svg class="star-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        :d="STAR_D"
        :fill="GOLD.sparkle"
        :fill-opacity="bloom ? 0.22 : 0.9"
        :stroke="GOLD.rays"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        :filter="bloom ? undefined : 'url(#grain-static)'"
      />
      <!-- The flash: the star's own outline, nothing else. Opacity only — no fill, no
           plate, no mask sweep; the compositor never touches a pixel it did not own. -->
      <path
        v-if="bloom"
        class="star-flash"
        :d="STAR_D"
        fill="none"
        :stroke="GOLD.rays"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<style scoped>
/* T3-W9 §2: the sticker is a foil star pressed into the completion block's slot —
   in flow beside the verdict (the slot owns the square), no overlay anchor, no
   z-index. Collision with the margin text impossible by construction. */
.celebration-star {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  animation: sticker-pop v-bind(landDur) linear v-bind(crestDelay) backwards;
}

.star-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* The bloom fills the board square it is mounted in and never travels: absolute,
   inset 0, above the cells and the heart, inert. `bloom-out` opens exactly where
   `bloom-in` closes (2050+600 = the crest), so the two read as one gesture. */
.celebration-star.is-bloom {
  position: absolute;
  inset: 0;
  z-index: 4;
  animation:
    bloom-in v-bind(bloomDur) linear v-bind(bloomDelay) backwards,
    bloom-out v-bind(fadeDur) linear v-bind(crestDelay);
}

.star-flash {
  opacity: 0;
  animation: outline-flash v-bind(flashDur) linear v-bind(crestDelay) backwards;
}

/* Settled (a remount while solved) or PRM: the reward is simply THERE, unmoving. */
.celebration-star.is-settled {
  animation: none;
}
</style>

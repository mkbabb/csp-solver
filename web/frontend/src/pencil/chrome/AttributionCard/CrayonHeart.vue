<script setup lang="ts">
/**
 * CrayonHeart — the felt heart, one mascot with a variant family (T3-W9, F7 §3).
 *
 * Plush-felt craft in OUR pencil grammar: material through stroke behavior, never
 * texture bitmaps — felt = plush silhouette + stitch-dash inner stroke +
 * turbulence tooth; craft heft = the fruit-weight outline; life = blink/squash
 * on transforms only (owned by CelebrationHeart, never here, never the filtered <g>).
 *
 *  - `idle`        — the attribution keeper (F7 §3.1): plush + stitch, ambient
 *                    dark-mode dimming kept (muted is CORRECT in that corner).
 *  - `celebration` — the Heart Fruit (F7 §3.2): stem + leaf, blush rx 7, and the
 *                    dark-mode EXCEPTION — the reward stays #FF4D6D rosy at crest,
 *                    only the blush deepens (the owner's maroon shot was the idle
 *                    register, wrong for the reward).
 *  - `blush`       — the wink (F7 §3.3): two stacked faces, opacity crossfade on
 *                    the hosting `.group`'s hover/focus — a state swap, PRM-safe.
 *  - `tiny`        — margin punctuation (F7 §3.4): legibility by subtraction; no
 *                    wobble below ~20px (scale-5 displacement shreds a 16px raster),
 *                    grain-static at 20–32px.
 *
 * Geometry lives in heartPaths.ts beside this file; hexes import from
 * MASCOT_COLORS (the F7 truthing — no more literal twins of pencilConfig).
 * The #wobble-heart preset is consumed as-is and NEVER retuned here — three
 * hover easter eggs share it (F7 §1.4).
 */
import { computed } from "vue";
import { PENCIL, MASCOT_COLORS } from "@pencil/config/pencilConfig";
import {
  HEART_BLUSH,
  HEART_EYES,
  HEART_HIGHLIGHT_ARC,
  HEART_HIGHLIGHT_DOT,
  HEART_LEAF,
  HEART_LEAF_STROKE_WIDTH,
  HEART_PLUSH_PATH,
  HEART_SHADOW_TRANSFORM,
  HEART_SMILE,
  HEART_SMILE_DEEP,
  HEART_SMILE_TINY,
  HEART_STEM,
  HEART_STEM_WIDTH,
  HEART_STITCH,
  HEART_TINY,
  HEART_VIEWBOX,
  HEART_VIEWBOX_CELEBRATION,
  HEART_WINK_ARC,
} from "./heartPaths";

type HeartVariant = "idle" | "celebration" | "blush" | "tiny";

const props = withDefaults(
  defineProps<{
    size?: number;
    variant?: HeartVariant;
  }>(),
  {
    size: 40,
    variant: "idle",
  },
);

const C = MASCOT_COLORS;

const isTiny = computed(() => props.variant === "tiny");
const isCelebration = computed(() => props.variant === "celebration");

/** Stem extends above y=0 — the celebration variant alone pays for the headroom. */
const viewBox = computed(() =>
  isCelebration.value ? HEART_VIEWBOX_CELEBRATION : HEART_VIEWBOX,
);

/** Outline 3.5 → 4 = PENCIL.fruitOutline.strokeWidth (the heart IS a fruit and the
 *  config already agreed, F7 §3.0); tiny re-weights to 5.5 for the small raster. */
const outlineWidth = computed(() =>
  isTiny.value ? HEART_TINY.outline : PENCIL.fruitOutline.strokeWidth,
);

const smilePath = computed(() => (isTiny.value ? HEART_SMILE_TINY : HEART_SMILE));
const smileWidth = computed(() => (isTiny.value ? HEART_TINY.smileStroke : 4));
const eyeR = computed(() => (isTiny.value ? HEART_EYES.rTiny : HEART_EYES.r));
const blushRx = computed(() =>
  isCelebration.value ? HEART_BLUSH.rxHappy : HEART_BLUSH.rx,
);

/** Filter ladder (F7 §3.4): wobble-heart everywhere except tiny — none below
 *  ~20px, grain-static at 20–32px (objectBoundingBox displacement is
 *  proportionally violent on small elements).
 *  T3-W13 §1-P4-i: #wobble-heart is FROZEN at its rest pose (the per-beat write
 *  is retired) — the crinkle is material, rastered once per appearance; the
 *  heart's life stays on CelebrationHeart's transforms, correctly ephemeral. */
const filterUrl = computed(() => {
  if (isTiny.value) return props.size < 20 ? undefined : "url(#grain-static)";
  return "url(#wobble-heart)";
});
</script>

<template>
  <svg
    class="crayon-heart"
    :class="variant"
    :viewBox="viewBox"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    :width="size"
    :height="size"
  >
    <g :filter="filterUrl">
      <!-- The Heart Fruit tell — stem + leaf, earned at the crest only (F7 §3.2) -->
      <template v-if="isCelebration">
        <path
          :d="HEART_STEM"
          fill="none"
          :stroke="C.heart.stem"
          :stroke-width="HEART_STEM_WIDTH"
          stroke-linecap="round"
        />
        <path
          :d="HEART_LEAF"
          :fill="C.leaf.fill"
          :stroke="C.outlineBlack"
          :stroke-width="HEART_LEAF_STROKE_WIDTH"
          stroke-linejoin="round"
        />
      </template>

      <!-- Shadow lobe: the plush path, one transform — dropped at tiny sizes -->
      <path
        v-if="!isTiny"
        :d="HEART_PLUSH_PATH"
        :transform="HEART_SHADOW_TRANSFORM"
        :fill="C.heart.shadow"
      />

      <!-- Plush body with the fruit-weight outline -->
      <path
        :d="HEART_PLUSH_PATH"
        :fill="C.heart.fill"
        :stroke="C.outlineBlack"
        :stroke-width="outlineWidth"
        stroke-linejoin="round"
      />

      <!-- Stitch line — the sewn-felt signature (plush path inset, dashed) -->
      <path
        v-if="!isTiny"
        :d="HEART_PLUSH_PATH"
        :transform="HEART_STITCH.transform"
        fill="none"
        :stroke="C.heart.stitch"
        :stroke-width="HEART_STITCH.strokeWidth"
        :stroke-dasharray="HEART_STITCH.dasharray"
        stroke-linecap="round"
      />

      <!-- Highlight arc + dot — sub-pixel noise at tiny, dropped there -->
      <template v-if="!isTiny">
        <path
          :d="HEART_HIGHLIGHT_ARC"
          fill="none"
          :stroke="C.heart.highlight"
          stroke-width="4"
          stroke-linecap="round"
        />
        <circle
          :cx="HEART_HIGHLIGHT_DOT.cx"
          :cy="HEART_HIGHLIGHT_DOT.cy"
          :r="HEART_HIGHLIGHT_DOT.r"
          :fill="C.heart.highlight"
        />
      </template>

      <!-- The wink (F7 §3.3): two stacked faces crossfaded by the hosting .group -->
      <template v-if="variant === 'blush'">
        <g class="face face-a">
          <g class="eyes">
            <circle
              :cx="HEART_EYES.left.cx"
              :cy="HEART_EYES.left.cy"
              :r="eyeR"
              :fill="C.outlineBlack"
            />
            <circle
              :cx="HEART_EYES.right.cx"
              :cy="HEART_EYES.right.cy"
              :r="eyeR"
              :fill="C.outlineBlack"
            />
          </g>
          <path
            :d="HEART_SMILE"
            fill="none"
            :stroke="C.outlineBlack"
            stroke-width="4"
            stroke-linecap="round"
          />
          <ellipse
            class="blush-mark"
            :cx="HEART_BLUSH.left.cx"
            :cy="HEART_BLUSH.left.cy"
            :rx="HEART_BLUSH.rx"
            :ry="HEART_BLUSH.ry"
            :fill="C.heart.blush"
            opacity="0.8"
          />
          <ellipse
            class="blush-mark"
            :cx="HEART_BLUSH.right.cx"
            :cy="HEART_BLUSH.right.cy"
            :rx="HEART_BLUSH.rx"
            :ry="HEART_BLUSH.ry"
            :fill="C.heart.blush"
            opacity="0.8"
          />
        </g>
        <g class="face face-b">
          <path
            :d="HEART_WINK_ARC"
            fill="none"
            :stroke="C.outlineBlack"
            stroke-width="4"
            stroke-linecap="round"
          />
          <circle
            :cx="HEART_EYES.right.cx"
            :cy="HEART_EYES.right.cy"
            :r="eyeR"
            :fill="C.outlineBlack"
          />
          <path
            :d="HEART_SMILE_DEEP"
            fill="none"
            :stroke="C.outlineBlack"
            stroke-width="4"
            stroke-linecap="round"
          />
          <ellipse
            class="blush-mark"
            :cx="HEART_BLUSH.left.cx"
            :cy="HEART_BLUSH.left.cy"
            :rx="HEART_BLUSH.rxHappy"
            :ry="HEART_BLUSH.ry"
            :fill="C.heart.blush"
            opacity="1"
          />
          <ellipse
            class="blush-mark"
            :cx="HEART_BLUSH.right.cx"
            :cy="HEART_BLUSH.right.cy"
            :rx="HEART_BLUSH.rxHappy"
            :ry="HEART_BLUSH.ry"
            :fill="C.heart.blush"
            opacity="1"
          />
        </g>
      </template>

      <!-- The one face (idle / celebration / tiny) -->
      <template v-else>
        <g class="eyes">
          <circle
            :cx="HEART_EYES.left.cx"
            :cy="HEART_EYES.left.cy"
            :r="eyeR"
            :fill="C.outlineBlack"
          />
          <circle
            :cx="HEART_EYES.right.cx"
            :cy="HEART_EYES.right.cy"
            :r="eyeR"
            :fill="C.outlineBlack"
          />
        </g>
        <path
          :d="smilePath"
          fill="none"
          :stroke="C.outlineBlack"
          :stroke-width="smileWidth"
          stroke-linecap="round"
        />
        <ellipse
          class="blush-mark"
          :cx="HEART_BLUSH.left.cx"
          :cy="HEART_BLUSH.left.cy"
          :rx="blushRx"
          :ry="HEART_BLUSH.ry"
          :fill="C.heart.blush"
          opacity="0.8"
        />
        <ellipse
          class="blush-mark"
          :cx="HEART_BLUSH.right.cx"
          :cy="HEART_BLUSH.right.cy"
          :rx="blushRx"
          :ry="HEART_BLUSH.ry"
          :fill="C.heart.blush"
          opacity="0.8"
        />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.crayon-heart {
  pointer-events: none;
  display: inline-block;
}

/* Ambient dark-mode dimming — idle / blush / tiny registers only. The celebration
   reward is EXEMPT (T3-W9 dark-mode exception, F7 §3.2): earned light stays rosy
   #FF4D6D at crest; the owner's maroon heart.png was this rule applied where it
   belongs (the attribution corner), not where it doesn't (the reward). */
.crayon-heart:not(.celebration):is(.dark *) {
  opacity: 0.75;
  filter: saturate(0.85);
}

/* Celebration in dark: only the blush deepens — mixed toward the shadow felt. */
.crayon-heart.celebration:is(.dark *) .blush-mark {
  fill: color-mix(in srgb, #ffb3c6 65%, #c9184a);
}

/* The wink crossfade (F7 §3.3): a 240ms opacity state swap — no filter re-raster,
   no motion, PRM-safe by construction. Triggered by the hosting `.group`'s
   hover/focus-within (the attribution trigger), with a self-hover fallback. */
.face {
  transition: opacity 240ms ease;
}
.face-b {
  opacity: 0;
}
:is(.group:hover, .group:focus-within) .crayon-heart.blush .face-b,
.crayon-heart.blush:hover .face-b {
  opacity: 1;
}
:is(.group:hover, .group:focus-within) .crayon-heart.blush .face-a,
.crayon-heart.blush:hover .face-a {
  opacity: 0;
}
</style>

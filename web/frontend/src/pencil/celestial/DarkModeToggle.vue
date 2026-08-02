<template>
  <button
    ref="toggleRef"
    class="sun-moon-toggle"
    :class="{ 'is-dark': isDark, 'is-turning': turning }"
    @click="handleToggle"
    @animationend="onGestureEnd"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <!-- ── LIVE gesture instances (T3-W13 §2 THE BLOOM) ──
         One filtered svg per body; a g.warp wraps the full content INSIDE the filter,
         so the big scale ride changes the filter's INPUT — a fresh vector render every
         frame, crisp at scale 0.06 and at the ~1.09 crest alike. wobble-celestial stays
         bound UNCONDITIONALLY on both (T3-W10 keep); the live pair is visible ONLY
         during the gesture (`.is-turning`) — at rest the icons ride the frozen P3
         stacks below, and the live filter regions cost nothing (§1-P3 interlock, the
         HandwrittenGlyph L28-F1 discipline generalized). Every reactive binding here
         is GESTURE-SCOPED (`live*` computeds, g1 F-1): at rest the parked pair takes
         zero writes — a hidden filter-bound subtree still invalidates on mutation. -->
    <svg
      class="toggle-icon toggle-sun"
      :class="{ 'is-active': !isDark }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      filter="url(#wobble-celestial)"
    >
      <g class="warp">
        <!-- Rays: irregular per pose; the spin is QUANTIZED to the pose flips
                 (g1 F-2) — one shared angle table with the rest stack. -->
        <g class="sun-rays" :style="liveRaysStyle">
          <polygon
            :points="liveRayPoints.outerPoly"
            :fill="SUN.body"
            :stroke="SUN.body"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <polygon
            :points="liveRayPoints.innerPoly"
            fill="none"
            :stroke="SUN.outline"
            stroke-width="5"
            stroke-linejoin="round"
          />
        </g>
        <!-- Disc: stationary. W1: disc outline 5→6. -->
        <g class="sun-disc">
          <circle
            cx="100"
            cy="100"
            r="48"
            :fill="SUN.core"
            :stroke="SUN.outline"
            stroke-width="6"
          />
          <!-- Golden spiral — felt-craft mascot style. S1: terminal curls (not bars) and the
                   outer coil ends short of the disc edge, sw 10→9. Color is the rays gold
                   (S2 reverted by the 2026-07-11 owner audit — the hue pop carries it). -->
          <path
            :d="SUN_SPIRAL_D"
            fill="none"
            :stroke="SUN.spiral"
            stroke-width="9"
            stroke-linecap="round"
          />
        </g>
        <!-- Sparkle diamonds around sun. S3: stroke 1.5→3, deepened — legible at 5rem.
                 Twinkle poses ride the boil beat (P3) — inline transform, no CSS animation. -->
        <g class="sun-sparkle twinkle-star" :style="liveSunTwinkles[0]">
          <polygon
            :points="liveSparklePoints[0]"
            :fill="SUN.sparkle"
            :stroke="SUN.sparkleStroke"
            stroke-width="3"
            stroke-linejoin="round"
          />
        </g>
        <g class="sun-sparkle twinkle-star twinkle-star-2" :style="liveSunTwinkles[1]">
          <polygon
            :points="liveSparklePoints[1]"
            :fill="SUN.sparkle"
            :stroke="SUN.sparkleStroke"
            stroke-width="3"
            stroke-linejoin="round"
          />
        </g>
        <g class="sun-sparkle twinkle-star twinkle-star-3" :style="liveSunTwinkles[2]">
          <polygon
            :points="liveSparklePoints[2]"
            :fill="SUN.sparkle"
            :stroke="SUN.sparkleStroke"
            stroke-width="3"
            stroke-linejoin="round"
          />
        </g>
        <!-- Tiny dot sparkles -->
        <circle
          class="sun-sparkle dot-star"
          cx="30"
          cy="45"
          r="2"
          :fill="SUN.sparkle"
        />
        <circle
          class="sun-sparkle dot-star"
          cx="55"
          cy="170"
          r="2.5"
          :fill="SUN.sparkle"
        />
      </g>
    </svg>

    <!-- Moon icon (dark mode) — live instance, warp-wrapped -->
    <svg
      class="toggle-icon toggle-moon"
      :class="{ 'is-active': isDark }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      filter="url(#wobble-celestial)"
    >
      <g class="warp">
        <!-- Crescent moon path. W1: outline 6→7. M1: the lower horn tapers to a point
             (extend the outer terminus, pull the return's first control inward).
             M2: the closing control eases 65,40→66,42 to soften the upper cusp. -->
        <path
          :d="MOON_BODY_D"
          :fill="MOON.body"
          :stroke="MOON.outline"
          stroke-width="7"
          stroke-linejoin="round"
        />
        <!-- Inner stroke detail. M2: moved down + thinned so it no longer crowds the tip. -->
        <path
          :d="MOON_DETAIL_D"
          fill="none"
          :stroke="MOON.outline"
          stroke-width="3.5"
          stroke-linecap="round"
        />

        <!-- 5-point polygon stars with wobble. Twinkle poses ride the boil beat (P3). -->
        <g class="twinkle-star" :style="liveStarTwinkles[0]">
          <polygon
            :points="liveStarPoints[0]"
            :fill="MOON.body"
            :stroke="MOON.body"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </g>
        <g class="twinkle-star twinkle-star-2" :style="liveStarTwinkles[1]">
          <polygon
            :points="liveStarPoints[1]"
            :fill="MOON.body"
            :stroke="MOON.body"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </g>
        <g class="twinkle-star twinkle-star-3" :style="liveStarTwinkles[2]">
          <polygon
            :points="liveStarPoints[2]"
            :fill="MOON.body"
            :stroke="MOON.body"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </g>

        <!-- Tiny dot stars. M3: one temperature with the star field (white → butter). -->
        <circle class="dot-star" cx="120" cy="30" r="2" :fill="MOON.star" />
        <circle class="dot-star" cx="185" cy="35" r="2.5" :fill="MOON.star" />
        <circle class="dot-star" cx="155" cy="75" r="1.5" :fill="MOON.star" />
      </g>
    </svg>

    <!-- ── REST stacks (T3-W13 §1-P3, re-cut at the W13 gate) ──
         The grain-hoist generalized: sibling copies per pose, wobble filter FROZEN at
         pose-i params (rasters once), the beat flips opacity on composited layers —
         zero live filter at idle. The sun is CUT TO THE MOON'S PROVEN SHAPE (g1 F-2,
         moon SSIM 1.0000): a WHOLE-ICON 4-pose stack — rays, disc, spiral, sparkles,
         twinkles all in one svg per pose, ONE noise field per instant, exactly the
         retired live regime's single realization (the earlier ray/disc sub-stack
         split held two fields at 3 of 4 beats, and no single-field live reference
         exists for that state — the c1 soul-gate forensics). No post-filter
         transform wrappers — a compositor rotate or scale of a cached pose raster
         resamples it, and the soul gate fails on the blur (sun 0.9145 vs the 0.983
         line). The ray spin is QUANTIZED to the pose flips and baked pre-filter into
         each pose (RAY_ANGLES — vector-crisp, one raster per pose); the 6s breathe
         is retired (script note). The ray comb re-jitters with the pose, on the one
         beat grid everything else swaps on — the page speaks one pose-stack grammar
         (grid, logo, outlines: 4 poses on the beat), and the SKY alone steps a slower
         band of it (T6 mark 11 — `MOTION.bands.sun/moon`). -->
    <div
      class="toggle-rest rest-sun"
      :class="{ 'is-active': !isDark }"
      aria-hidden="true"
    >
      <!-- T4-W1 baked poses: static <img> siblings, opacity-swapped on the beat -->
      <img
        v-for="(url, i) in sunBaked ? sunUrls : []"
        :key="`sun-bmp-${i}`"
        class="rest-pose"
        :class="{ 'is-pose-active': i === sunFrame }"
        :src="url"
        alt=""
      />
      <!-- Fallback while baking: the live wobble-celestial stack. T4-WM rank 1: PINNED to
             pose 0 while unbaked — the live filter rasters ONCE, not per beat. -->
      <svg
        v-for="(sparkles, i) in sunBaked ? [] : SPARKLE_POSES"
        :key="`sun-${i}`"
        class="rest-pose"
        :class="{ 'is-pose-active': i === 0 }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        :filter="`url(#${poseFilterId(i)})`"
      >
        <g :transform="`rotate(${RAY_ANGLES[i]} 100 100)`">
          <polygon
            :points="RAY_POSES[i].outerPoly"
            :fill="SUN.body"
            :stroke="SUN.body"
            stroke-width="4"
            stroke-linejoin="round"
          />
          <polygon
            :points="RAY_POSES[i].innerPoly"
            fill="none"
            :stroke="SUN.outline"
            stroke-width="5"
            stroke-linejoin="round"
          />
        </g>
        <circle
          cx="100"
          cy="100"
          r="48"
          :fill="SUN.core"
          :stroke="SUN.outline"
          stroke-width="6"
        />
        <path
          :d="SUN_SPIRAL_D"
          fill="none"
          :stroke="SUN.spiral"
          stroke-width="9"
          stroke-linecap="round"
        />
        <g
          v-for="(pts, s) in sparkles"
          :key="s"
          class="rest-twinkle"
          :style="TWINKLE_BY_FRAME[i][s]"
        >
          <polygon
            :points="pts"
            :fill="SUN.sparkle"
            :stroke="SUN.sparkleStroke"
            stroke-width="3"
            stroke-linejoin="round"
          />
        </g>
        <circle cx="30" cy="45" r="2" :fill="SUN.sparkle" />
        <circle cx="55" cy="170" r="2.5" :fill="SUN.sparkle" />
      </svg>
    </div>

    <div
      class="toggle-rest rest-moon"
      :class="{ 'is-active': isDark }"
      aria-hidden="true"
    >
      <!-- T4-W1 baked poses: static <img> siblings, opacity-swapped on the beat -->
      <img
        v-for="(url, i) in moonBaked ? moonUrls : []"
        :key="`moon-bmp-${i}`"
        class="rest-pose"
        :class="{ 'is-pose-active': i === starFrame }"
        :src="url"
        alt=""
      />
      <!-- Fallback while baking: the live wobble-celestial stack. T4-WM rank 1: PINNED to
             pose 0 while unbaked — the live filter rasters ONCE, not per beat. -->
      <svg
        v-for="(stars, i) in moonBaked ? [] : STAR_POSES_D"
        :key="`moon-${i}`"
        class="rest-pose"
        :class="{ 'is-pose-active': i === 0 }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        :filter="`url(#${poseFilterId(i)})`"
      >
        <path
          :d="MOON_BODY_D"
          :fill="MOON.body"
          :stroke="MOON.outline"
          stroke-width="7"
          stroke-linejoin="round"
        />
        <path
          :d="MOON_DETAIL_D"
          fill="none"
          :stroke="MOON.outline"
          stroke-width="3.5"
          stroke-linecap="round"
        />
        <g
          v-for="(pts, s) in stars"
          :key="s"
          class="rest-twinkle"
          :style="TWINKLE_BY_FRAME[i][s]"
        >
          <polygon
            :points="pts"
            :fill="MOON.body"
            :stroke="MOON.body"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </g>
        <circle class="dot-star" cx="120" cy="30" r="2" :fill="MOON.star" />
        <circle class="dot-star" cx="185" cy="35" r="2.5" :fill="MOON.star" />
        <circle class="dot-star" cx="155" cy="75" r="1.5" :fill="MOON.star" />
      </svg>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from "vue";
import {
  generateSunRays,
  heldFrameCount,
  wobbleDiamond,
  wobbleStarPolygon,
  usePrefersReducedMotion,
  serializePoseSvg,
  useRasterStack,
} from "@mkbabb/pencil-boil";
import { useElementSize } from "@vueuse/core";
import { useTheme } from "@/composables/useTheme";
import {
  MASCOT_COLORS,
  MOTION,
  wobblePoseId,
  wobblePoseFrequencies,
  FILTER_PRESETS,
} from "@pencil/config/pencilConfig";
import { useBoilBeat } from "@pencil/composables/boilBeat";
import { readFilterDefs, retainedPoseUrls } from "@pencil/composables/rasterPose";

const SUN = MASCOT_COLORS.celestial.sun;
const MOON = MASCOT_COLORS.celestial.moon;

// Shared geometry (live instance + rest stacks render the same ink)
const SUN_SPIRAL_D =
  "M100,102 C105,93 116,96 117,107 C121,122 105,130 90,124 C72,115 68,92 80,76 C96,56 126,56 132,78";
const MOON_BODY_D =
  "M85,30 C40,40 15,90 35,140 C55,185 118,192 160,143 C122,162 70,145 60,95 C55,65 66,42 85,30 Z";
const MOON_DETAIL_D = "M72,52 C52,68 47,105 55,133";

const { isDark, toggleDark } = useTheme();
const reducedMotion = usePrefersReducedMotion();

// ── Celestial boils on the SHARED beat (T3-W12 §2 P1) ──
// All frame indexes derive from the one app-wide beat. At rest the indexes flip
// OPACITY on the frozen rest-stack poses (T3-W13 §1-P3) — compositor-only; the live
// instances read the same indexes through GESTURE-SCOPED bindings (g1 F-1, below)
// so a gesture picks up mid-cycle without the parked pair ever taking a write.
// Mode gating is the advance-guard below (only the LIVE body's frames tick — the
// parked icon stays frozen); PRM freezes the beat itself centrally.
const beat = useBoilBeat();
const starFrame = ref(0); // dark: whole-moon pose stack, every 1.5 beats (~5.33fps)
const sunFrame = ref(0); // light: whole-sun pose stack, every 2 beats (4fps)
// The celestial pose set is exactly wobble-celestial's frozen poses (single source):
// geometry pose i pairs with filter pose `wobble-celestial-p{i}`, so the count derives
// from wobblePoseFrequencies rather than a hardcoded 4 (T4-W4 P4 reconcile).
const CELESTIAL_POSE_COUNT = wobblePoseFrequencies(
  FILTER_PRESETS["wobble-celestial"],
).length;
// heldFrameCount (P1-W3): the fifth of the five unwrapped counts. The toggle drives the shared
// beat imperatively rather than through `useBeatFrame`, so it honours the boil hold the same way
// `useBeatFrame` does — by reading the WRAPPED count and taking the `total <= 1` freeze-in-place
// branch. Without this the answer-key laminate stilled the board and the sun kept turning.
const heldPoseCount = heldFrameCount(() => CELESTIAL_POSE_COUNT);
// T6 mark 11: the sky DERIVES its pose from the beat rather than incrementing on it,
// so a band can be fractional without a second clock or an accumulator — floor(b/1.5)
// spends 2 beats on one pose and 1 on the next, the 250/125ms dwell the 1.5 band means.
// A beat that does not advance the band assigns the ref its own value; Vue's setter
// no-ops, so the slower sky costs no extra write.
watch(beat, (b) => {
  const total = heldPoseCount();
  if (total <= 1) return; // held — freeze in place, no snap to pose 0
  const step = (band: number) => Math.floor(b / band) % total;
  if (isDark.value) {
    starFrame.value = step(MOTION.bands.moon);
  } else {
    sunFrame.value = step(MOTION.bands.sun);
  }
});

// ── The ray spin, QUANTIZED TO THE POSE FLIPS (W13 gate g1 F-2) ──
// The angle is a pure function of the POSE INDEX, so it bakes pre-filter into each
// rest pose as static vector geometry: crisp at every angle, one raster per pose,
// zero recurring paint. The 4-pose wrap (−0.5625°) lands on the same flip that
// re-jitters the whole ray comb — at this rate the spin is a micro-dither by
// design (it was a 240s ambient to begin with). One angle table serves the live
// sun and the rest stack alike.
//
// The table is BYTE-IDENTICAL under the mark-11 band; what re-derives is the wall
// time it spans. 0.1875°/pose used to be 0.1875°/125ms — a 240s revolution. A pose
// now dwells `bands.sun` beats (250ms), so the notional revolution is 240s × 2 =
// 480s. The micro-dither reading is unchanged, and so are the baked pose bitmaps.
//
// The 6s ±3% breathe is RETIRED with the wrappers: post-filter scale resamples the
// cached pose rasters (the soul gate fails on the blur), pre-filter scale would
// re-raster the filter per step (§1's zero-recurring-paint line), and quantized
// into the 4-pose cycle it becomes 8fps scale flicker, not a breath. Its only
// other home was the ~1s gesture window, where its excursion was ≤0.6% —
// imperceptible. Dead config dies.
const RAY_DEG_PER_POSE = 360 / ((240 * 1000) / MOTION.beatMs); // 0.1875°
const RAY_ANGLES = Array.from({ length: CELESTIAL_POSE_COUNT }, (_, i) =>
  (i * RAY_DEG_PER_POSE).toFixed(4),
);

// ── The pose sets, baked ONCE (T3-W13 §1-P3) ──
// A finite pose set has a finite render set: the exact frames the live computeds used
// to regenerate per beat, materialized as static geometry. The live instance reads the
// same arrays (one source of truth); the stacks render every pose as a sibling.
const RAY_POSES = Array.from({ length: CELESTIAL_POSE_COUNT }, (_, f) =>
  generateSunRays(f * 100 + 42),
);
const SPARKLE_POSES = Array.from({ length: CELESTIAL_POSE_COUNT }, (_, f) => [
  wobbleDiamond(35, 40, 6, 10, f * 100 + 10),
  wobbleDiamond(170, 45, 5, 8, f * 100 + 20),
  wobbleDiamond(55, 170, 5, 9, f * 100 + 30),
]);
const STAR_POSES_D = Array.from({ length: CELESTIAL_POSE_COUNT }, (_, f) => [
  wobbleStarPolygon(160, 20, 12, 5, f * 100 + 1),
  wobbleStarPolygon(135, 50, 10, 4, f * 100 + 2),
  wobbleStarPolygon(175, 65, 9, 3.5, f * 100 + 3),
]);

// ── Frozen pose filters (§1-P3, folded at the W13 gate) ──
// Every rest pose consumes the SHARED static defs SvgFilters renders per wobble
// preset (`wobble-celestial-p0..3`, exactly the retired watcher's beat params —
// the same set the logo stack consumes). Pose i pairs geometry i with field p_i,
// whole-icon, for both bodies: geometry and noise realization advance TOGETHER on
// the beat, exactly as the retired live regime's per-beat baseFrequency writes did
// — so the soul-gate A/B's single-field base-def injection is exact at every
// instant (the local seed-11/18 ray extras and the ray/disc field split were both
// divergences from the live single realization, deleted).
const poseFilterId = (i: number) => wobblePoseId("wobble-celestial", i);

// ── Twinkle poses, stepped on the beat (T3-W12 §2 P3) ──
// Period-4 with the frame index, per-star offset keeps the field desynced. The stacks
// bake TWINKLE_BY_FRAME[pose][star]; the live instance reads the same table through
// the current frame index — identical sequences.
const TWINKLE_POSES = [
  "scale(0.85) rotate(0deg)",
  "scale(1.1) rotate(8deg)",
  "scale(0.9) rotate(-5deg)",
  "scale(1.15) rotate(12deg)",
  "scale(0.95) rotate(-3deg)",
] as const;
function twinklePose(frame: number, i: number): { transform: string } {
  return { transform: TWINKLE_POSES[(frame + i * 2) % TWINKLE_POSES.length] };
}
const TWINKLE_BY_FRAME = Array.from({ length: CELESTIAL_POSE_COUNT }, (_, f) =>
  [0, 1, 2].map((i) => twinklePose(f, i)),
);

// ── T4-W1: the rest-pose stacks baked to bitmaps (the WebKit cure) ──
//
// The rest poses (§below) are resident filtered <svg> siblings opacity-swapped on the beat
// — the grid's anti-pattern in miniature. Capture each frozen pose to an ImageBitmap once
// (useRasterStack) and opacity-swap static <img> siblings with the filter removed. The
// wobble-celestial turbulence is userSpaceOnUse (coordinate-anchored) and every color is a
// literal constant (sun gold, moon blue — theme-independent, so no theme re-bake), so the
// bake is faithful; the twinkle CSS transform-origin is replicated in an inline <style>.
// The Bloom's live warped instances stay UNTOUCHED. The live-filter <svg> stack is the
// during-bake fallback (renders until the bitmaps resolve — no flash).
const CELESTIAL_VB = 200;
const toggleRef = ref<HTMLButtonElement | null>(null);
const { width: toggleW } = useElementSize(toggleRef);
// No invented fallback (P1-W3, the logo's twin): pencil-boil 0.10.0's F2 declines a bake at a
// non-positive cssSize and re-bakes when the box lands, so a 96 px guess is no longer needed to
// keep `useRasterStack` from capturing at zero — and a guess is exactly what poisoned the first
// bake with bitmaps of the wrong intrinsic.
const captureSize = computed(() => Math.round(toggleW.value));

function celestialDefs(i: number): string {
  return (
    readFilterDefs(wobblePoseId("wobble-celestial", i)) +
    "<style>.rest-twinkle{transform-origin:center}</style>"
  );
}

function sunPoseSvg(i: number): string {
  const rays = RAY_POSES[i];
  const sparkles = SPARKLE_POSES[i];
  const tw = TWINKLE_BY_FRAME[i];
  const pid = wobblePoseId("wobble-celestial", i);
  let body = `<g filter="url(#${pid})">`;
  // Pin the filtered group's bbox to the 200×200 viewport so the objectBoundingBox
  // filter region matches the live <svg filter> (turbulence is coordinate-anchored; this
  // only keeps a tighter content bbox from clipping the displaced edge).
  body += `<rect x="0" y="0" width="200" height="200" fill="none"/>`;
  body += `<g transform="rotate(${RAY_ANGLES[i]} 100 100)">`;
  body += `<polygon points="${rays.outerPoly}" fill="${SUN.body}" stroke="${SUN.body}" stroke-width="4" stroke-linejoin="round"/>`;
  body += `<polygon points="${rays.innerPoly}" fill="none" stroke="${SUN.outline}" stroke-width="5" stroke-linejoin="round"/>`;
  body += `</g>`;
  body += `<circle cx="100" cy="100" r="48" fill="${SUN.core}" stroke="${SUN.outline}" stroke-width="6"/>`;
  body += `<path d="${SUN_SPIRAL_D}" fill="none" stroke="${SUN.spiral}" stroke-width="9" stroke-linecap="round"/>`;
  sparkles.forEach((pts, s) => {
    body += `<g class="rest-twinkle" style="transform:${tw[s].transform}"><polygon points="${pts}" fill="${SUN.sparkle}" stroke="${SUN.sparkleStroke}" stroke-width="3" stroke-linejoin="round"/></g>`;
  });
  body += `<circle cx="30" cy="45" r="2" fill="${SUN.sparkle}"/>`;
  body += `<circle cx="55" cy="170" r="2.5" fill="${SUN.sparkle}"/>`;
  body += "</g>";
  return serializePoseSvg({
    width: CELESTIAL_VB,
    height: CELESTIAL_VB,
    defs: celestialDefs(i),
    body,
  });
}

function moonPoseSvg(i: number): string {
  const stars = STAR_POSES_D[i];
  const tw = TWINKLE_BY_FRAME[i];
  const pid = wobblePoseId("wobble-celestial", i);
  let body = `<g filter="url(#${pid})">`;
  body += `<rect x="0" y="0" width="200" height="200" fill="none"/>`;
  body += `<path d="${MOON_BODY_D}" fill="${MOON.body}" stroke="${MOON.outline}" stroke-width="7" stroke-linejoin="round"/>`;
  body += `<path d="${MOON_DETAIL_D}" fill="none" stroke="${MOON.outline}" stroke-width="3.5" stroke-linecap="round"/>`;
  stars.forEach((pts, s) => {
    body += `<g class="rest-twinkle" style="transform:${tw[s].transform}"><polygon points="${pts}" fill="${MOON.body}" stroke="${MOON.body}" stroke-width="2" stroke-linejoin="round"/></g>`;
  });
  body += `<circle cx="120" cy="30" r="2" fill="${MOON.star}"/>`;
  body += `<circle cx="185" cy="35" r="2.5" fill="${MOON.star}"/>`;
  body += `<circle cx="155" cy="75" r="1.5" fill="${MOON.star}"/>`;
  body += "</g>";
  return serializePoseSvg({
    width: CELESTIAL_VB,
    height: CELESTIAL_VB,
    defs: celestialDefs(i),
    body,
  });
}

const sunRaster = useRasterStack(() => ({
  cacheKey: "celestial-sun",
  poseCount: CELESTIAL_POSE_COUNT,
  poseSvg: sunPoseSvg,
  cssSize: { width: captureSize.value, height: captureSize.value },
}));
const moonRaster = useRasterStack(() => ({
  cacheKey: "celestial-moon",
  poseCount: CELESTIAL_POSE_COUNT,
  poseSvg: moonPoseSvg,
  cssSize: { width: captureSize.value, height: captureSize.value },
}));

// The baked poses ARE object URLs (pencil-boil 0.11) — no bitmap re-draw, re-encode or close
// between the capture and the <img>. Each set is RETAINED while its handle's `urls` is null
// (a resize re-bake in flight) so the icon swaps atomically. Sun and moon are separate
// rasters; the library owns both sets' lifetime, so this surface revokes nothing.
const sunUrls = retainedPoseUrls(sunRaster);
const moonUrls = retainedPoseUrls(moonRaster);
const sunBaked = computed(() => sunUrls.value.length === 4);
const moonBaked = computed(() => moonUrls.value.length === 4);

// Dusk ease (T3-W10 keep, re-anchored): html.theme-turning goes on AT click, the theme
// flip included — body + the paper sheets ease colors ~350ms instead of snapping
// (index.css). One timeout, no clock machinery. Under PRM the flip stands alone and
// page colors snap (the index.css rule is no-preference-gated besides).
//
// `turning`: the ~1010ms Bloom window. It gates the two plush accents
// (the button squash, the plush-flex tail) AND the §1-P3 interlock — while it
// is up the live warped instances hold the stage and the frozen rest stacks yield;
// at settle the stacks take back over (one filtered raster, the L28-F1 discipline).
// The Bloom itself is pure .is-active transitions and needs no gate. Cleared on the
// plush-land animationend (the crest), with a timeout backstop. A re-click mid-flight
// leaves `turning` up and just extends the backstop — the warp transitions retarget
// for free, and a FRESH plush-land instance starts when the other icon gains
// .is-active, so the tail always lands ~950ms after the LAST click. No phase machine.
const turning = ref(false);
let turnTimer: ReturnType<typeof setTimeout> | undefined;
let gestureTimer: ReturnType<typeof setTimeout> | undefined;

// ── Live bindings, GESTURE-SCOPED (W13 gate g1 F-1) ──
// The parked live pair must be INERT: a per-beat write into a filter-bound svg
// invalidates the filter even at visibility:hidden — g1 traced 8/s unbounded
// filtered-svg paints plus 8/s full-viewport root damage to exactly these
// bindings, dev AND prod. Each binding rides a computed that reads the shared
// pose state only while the gesture window is up (`turning`) or under PRM —
// where the beat itself is parked, so tracking costs nothing and the soul-gate
// A/B's injection method still reads a pose-aligned live instance. At rest the
// computed returns its held snapshot: the frame refs go untracked, the value is
// reference-stable, and the patch writes nothing — the P3 stacks carry the idle
// boil. `turning` arms in the same flush as `.is-turning`, so the bindings are
// current before the first visible warp frame.
function gestureBound<T>(source: () => T) {
  let held: T | undefined;
  return computed<T>(() => {
    if (held === undefined || turning.value || reducedMotion.value) {
      held = source();
    }
    return held;
  });
}
const liveRayPoints = gestureBound(() => RAY_POSES[sunFrame.value]);
const liveRaysStyle = gestureBound(() => ({
  transform: `rotate(${RAY_ANGLES[sunFrame.value]}deg)`,
}));
const liveSparklePoints = gestureBound(() => SPARKLE_POSES[sunFrame.value]);
const liveSunTwinkles = gestureBound(() => TWINKLE_BY_FRAME[sunFrame.value]);
const liveStarPoints = gestureBound(() => STAR_POSES_D[starFrame.value]);
const liveStarTwinkles = gestureBound(() => TWINKLE_BY_FRAME[starFrame.value]);

function handleToggle() {
  toggleDark();
  if (reducedMotion.value) return;
  document.documentElement.classList.add("theme-turning");
  clearTimeout(turnTimer);
  turnTimer = setTimeout(() => {
    document.documentElement.classList.remove("theme-turning");
  }, 400);
  turning.value = true;
  clearTimeout(gestureTimer);
  gestureTimer = setTimeout(() => {
    turning.value = false;
  }, 1100);
}

// Bubbled from the incoming icon. Canceled animations (a mid-flight re-click swaps
// roles) fire animationcancel, not animationend — only a truly landed crest clears here.
// startsWith, not equality: scoped styles suffix keyframe names with the scope id
// (plush-land-<hash>).
function onGestureEnd(e: AnimationEvent) {
  if (!e.animationName.startsWith("plush-land")) return;
  turning.value = false;
  clearTimeout(gestureTimer);
}

onUnmounted(() => {
  clearTimeout(turnTimer);
  clearTimeout(gestureTimer);
  document.documentElement.classList.remove("theme-turning");
});
</script>

<style scoped>
.sun-moon-toggle {
  position: relative;
  width: var(--toggle-size, 5rem);
  height: var(--toggle-size, 5rem);
  cursor: pointer;
  border: 0;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  transition: transform 200ms ease;
  flex-shrink: 0;
}

/* Hover rides the CSS layer at exactly the ±8% contract bound (§2 rule 2) — at rest
   it stretches the frozen stack's cached textures 8%, sub-perceptual at 208px. */
.sun-moon-toggle:hover {
  outline: none;
  transform: scale(1.08);
}

.sun-moon-toggle:focus {
  outline: none;
}

.sun-moon-toggle:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

/* ── THE BLOOM (T3-W13 §2) — live instances, gesture only ─────────────────
   The -270° whirl and the translateX(-50%) slide are DEAD: a pop-up piece doesn't
   travel, it rises out of the page and sinks back into it. Both live icons are
   parked visibility:hidden at rest (the P3 stacks hold the stage) and take it only
   under `.is-turning` — which covers the whole ~1010ms window, superseding the old
   900ms park delay (≥340ms wring-down coverage re-derived, T3-W10 economics kept:
   a hidden live filter region costs nothing). overflow: visible gives the ~1.09
   crest headroom — warped content near the viewBox edge must not clip. */
.toggle-icon {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  overflow: visible;
  opacity: 0;
  visibility: hidden;
  /* outgoing icon: fade only in the last wring beat (240-340ms) — the body is
       nearly a point before it fades; no mid-air ghost */
  transition: opacity 100ms var(--ease-standard) 240ms;
}

.toggle-icon.is-active {
  opacity: 1;
  /* incoming icon: 60-360ms rise with the bloom's first beats */
  transition: opacity 300ms var(--ease-standard) 60ms;
}

.sun-moon-toggle.is-turning .toggle-icon {
  visibility: visible;
}

/* The warp (§2 crispness contract rule 1): every excursion beyond ±8% of identity
   rides this in-viewBox group — transform INSIDE the filter input, so each frame is
   a fresh vector render at device resolution. Rest pose: a wrung scrap pressed into
   the page. Wring-down 0-340ms; the twist target is gesture-scoped below. */
.toggle-icon .warp {
  transform-box: view-box;
  transform-origin: 100px 100px;
  transform: scale(0.06) rotate(12deg) translateY(6px);
  transition: transform 340ms var(--ease-accelIn);
}

/* Wring-down twist: shrinks AND sinks, twisting as paper does (-15deg — owner-taste
   checkpoint 1: drop to -8deg, then 0, if it reads as whirl residue). Split from the
   settled park pose so the bloom always LAUNCHES from +12deg (the beat table) while
   the wring lands at -15deg — the pose re-arms while the icon is hidden at settle. */
.sun-moon-toggle.is-turning .toggle-icon:not(.is-active) .warp {
  transform: scale(0.06) rotate(-15deg) translateY(6px);
}

/* The bloom: 60-860ms on the signature back-out spring — crests ~1.09 around t≈560,
   vector-crisp by construction (the warp is the filter's input). */
.toggle-icon.is-active .warp {
  transform: none;
  transition: transform 800ms var(--ease-springPop) 60ms;
}

/* ─── The plush accent beats ─────────────────────────────────────────────
   Accents folded ONTO the Bloom. The gesture stays pure transitions, so a re-click
   mid-flight retargets for free; the accents ride the CSS-layer `scale` property
   (±8% contract rule 2), which multiplies with the in-SVG warp instead of
   fighting it. */

/* SQUASH (0-120ms) — button-level anticipation, kept verbatim from the shipped
   gesture: the press before the pop-up rises. */
.sun-moon-toggle.is-turning {
  animation: toggle-squash 120ms both;
}

@keyframes toggle-squash {
  0% {
    scale: 1;
    animation-timing-function: ease-out;
  }
  40% {
    scale: 0.94;
    animation-timing-function: var(--ease-springPop);
  }
  100% {
    scale: 1;
  }
}

/* PLUSH FLEX (860-1010ms) — the shipped plush-land grown a second half-bounce:
   1.04,0.96 → 0.98,1.02 → 1,1 as the spring resolves. Identity for the first 85%
   (= 860ms of 1010ms) so the bloom transition runs beneath it untouched. */
.is-turning .toggle-icon.is-active {
  animation: plush-land 1010ms both;
}

@keyframes plush-land {
  0%,
  85% {
    scale: 1 1;
    animation-timing-function: ease-in;
  }
  90% {
    scale: 1.04 0.96;
    animation-timing-function: ease-out;
  }
  95% {
    scale: 0.98 1.02;
    animation-timing-function: ease-out;
  }
  100% {
    scale: 1 1;
  }
}

/* STAR POP (~560/640/720ms) — stars and sparkles hold their breath through the
   bloom's rise, then pop staggered ONTO the overshoot crest (t≈560): a 150ms
   back-out fling from the body's heart out to the perch. Pure transition-delay
   off .is-active — no clock. On wring-out they tuck in fast, undelayed. */
.toggle-icon .twinkle-star,
.toggle-icon .dot-star {
  scale: 0.2;
  opacity: 0;
  transition:
    scale 150ms ease-in,
    opacity 100ms ease-in;
}

.toggle-icon.is-active .twinkle-star,
.toggle-icon.is-active .dot-star {
  scale: 1;
  opacity: 1;
  transition:
    scale 150ms var(--ease-anticipatePop) 560ms,
    opacity 120ms ease-out 560ms;
}

.toggle-icon.is-active .twinkle-star-2 {
  transition-delay: 640ms;
}
.toggle-icon.is-active .twinkle-star-3 {
  transition-delay: 720ms;
}

/* Pause all animations on inactive icon to save GPU */
.toggle-sun:not(.is-active) *,
.toggle-moon:not(.is-active) * {
  animation-play-state: paused !important;
}

/* Ray spin origin for the LIVE sun — the quantized rotate arrives inline from the
   script (RAY_ANGLES, gesture-scoped). */
.sun-rays {
  transform-origin: 100px 100px;
}

/* ── REST stacks (T3-W13 §1-P3) ──────────────────────────────────────────
   The active icon's stack holds the stage at rest; the parked icon's stack is
   visibility:hidden (zero raster, the T3-W10 economics). During the gesture BOTH
   stacks yield to the live instances. Pose flips are opacity swaps on composited
   layers (will-change: opacity) — no filter executes at idle, and NOTHING
   transforms a cached pose raster (the g1 F-2 discipline: every pose composites
   at identity, all motion is baked vector geometry behind the frozen filters). */
.toggle-rest {
  position: absolute;
  inset: 0;
  pointer-events: none;
  visibility: hidden;
}

.toggle-rest.is-active {
  visibility: visible;
}

.sun-moon-toggle.is-turning .toggle-rest {
  visibility: hidden;
}

.rest-pose {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0;
  will-change: opacity;
}

.rest-pose.is-pose-active {
  opacity: 1;
}

/* Stack twinkles: baked pose transforms, same origin semantics as the live field. */
.rest-twinkle {
  transform-origin: center;
}

/* Reduced motion — the T3-W10 PRM contract carried onto the P3 stacks: theme flips
   immediately at click, a single 200ms opacity crossfade, no transforms, stars baked
   in WITH the moon. Both stacks stay visibility:visible so the crossfade has two
   participants; the live gesture instances never take the stage (handleToggle
   early-returns before `turning`) — parked and warp-nulled as a belt below. */
@media (prefers-reduced-motion: reduce) {
  .toggle-icon {
    visibility: hidden;
    transition: none;
    animation: none;
  }

  .toggle-icon .warp {
    transform: none !important;
  }

  .toggle-rest {
    visibility: visible;
    opacity: 0;
    transition: opacity 200ms ease;
  }

  .toggle-rest.is-active {
    opacity: 1;
  }

  .sun-moon-toggle.is-turning {
    animation: none;
  }
}

/* Star twinkling (live field) — jagged scale/rotate poses, stepped on the boil beat
   (T3-W12 §2 P3); the poses arrive as inline transforms from the shared table.
   Origin semantics are the BEFORE geometry: view-box transform-box, center = the
   viewBox center. */
.twinkle-star {
  transform-origin: center;
}
</style>

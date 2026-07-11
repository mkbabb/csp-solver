<template>
    <button
        class="sun-moon-toggle"
        :class="{ 'is-dark': isDark, 'is-turning': turning }"
        @click="handleToggle"
        @animationend="onGestureEnd"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
        <!-- Sun icon (light mode) — always rendered, hidden at rest via CSS.
         wobble-celestial is bound UNCONDITIONALLY on both icons (T3-W10 keep): the
         outgoing body keeps its wobble all the way through the whirl-out. At rest the
         inactive icon is visibility:hidden, so the second live filter region costs
         nothing. -->
        <svg
            class="toggle-icon toggle-sun"
            :class="{ 'is-active': !isDark }"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            filter="url(#wobble-celestial)"
        >
            <g class="sun-breathe" :style="sunBreatheStyle">
                <!-- Rays: spin independently, irregular per ray.
             S5 (upstream note, NOT a repo change): generateSunRays' second-pass inset
             widens outerR-5 → outerR-8 in pencil-boil's next patch version. -->
                <g class="sun-rays" :style="sunRaysStyle">
                    <polygon
                        :points="sunRayPoints.outerPoly"
                        :fill="SUN.body"
                        :stroke="SUN.body"
                        stroke-width="4"
                        stroke-linejoin="round"
                    />
                    <polygon
                        :points="sunRayPoints.innerPoly"
                        fill="none"
                        :stroke="SUN.outline"
                        stroke-width="5"
                        stroke-linejoin="round"
                    />
                </g>
                <!-- Disc: stationary relative to breathe group. W1: disc outline 5→6. -->
                <g class="sun-disc">
                    <circle
                        cx="100"
                        cy="100"
                        r="48"
                        :fill="SUN.core"
                        :stroke="SUN.outline"
                        stroke-width="6"
                    />
                    <!-- Golden spiral — Yoshi's Story style. S1: terminal curls (not bars) and the
               outer coil ends short of the disc edge, sw 10→9. Color is the rays gold
               (S2 reverted by the 2026-07-11 owner audit — the hue pop carries it). -->
                    <path
                        d="M100,102 C105,93 116,96 117,107 C121,122 105,130 90,124 C72,115 68,92 80,76 C96,56 126,56 132,78"
                        fill="none"
                        :stroke="SUN.spiral"
                        stroke-width="9"
                        stroke-linecap="round"
                    />
                </g>
                <!-- Sparkle diamonds around sun. S3: stroke 1.5→3, deepened — legible at 5rem.
             Twinkle poses ride the boil beat (P3) — inline transform, no CSS animation. -->
                <g class="sun-sparkle twinkle-star" :style="sunTwinklePoses[0]">
                    <polygon
                        :points="sunSparklePoints[0]"
                        :fill="SUN.sparkle"
                        :stroke="SUN.sparkleStroke"
                        stroke-width="3"
                        stroke-linejoin="round"
                    />
                </g>
                <g
                    class="sun-sparkle twinkle-star twinkle-star-2"
                    :style="sunTwinklePoses[1]"
                >
                    <polygon
                        :points="sunSparklePoints[1]"
                        :fill="SUN.sparkle"
                        :stroke="SUN.sparkleStroke"
                        stroke-width="3"
                        stroke-linejoin="round"
                    />
                </g>
                <g
                    class="sun-sparkle twinkle-star twinkle-star-3"
                    :style="sunTwinklePoses[2]"
                >
                    <polygon
                        :points="sunSparklePoints[2]"
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

        <!-- Moon icon (dark mode) — always rendered, hidden at rest via CSS -->
        <svg
            class="toggle-icon toggle-moon"
            :class="{ 'is-active': isDark }"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            filter="url(#wobble-celestial)"
        >
            <g>
                <!-- Crescent moon path. W1: outline 6→7. M1: the lower horn tapers to a point
             (extend the outer terminus, pull the return's first control inward).
             M2: the closing control eases 65,40→66,42 to soften the upper cusp. -->
                <path
                    d="M85,30 C40,40 15,90 35,140 C55,185 118,192 160,143 C122,162 70,145 60,95 C55,65 66,42 85,30 Z"
                    :fill="MOON.body"
                    :stroke="MOON.outline"
                    stroke-width="7"
                    stroke-linejoin="round"
                />
                <!-- Inner stroke detail. M2: moved down + thinned so it no longer crowds the tip. -->
                <path
                    d="M72,52 C52,68 47,105 55,133"
                    fill="none"
                    :stroke="MOON.outline"
                    stroke-width="3.5"
                    stroke-linecap="round"
                />

                <!-- 5-point polygon stars with wobble. Twinkle poses ride the boil beat (P3). -->
                <g class="twinkle-star" :style="starPoses[0]">
                    <polygon
                        :points="starPolygonPoints[0]"
                        :fill="MOON.body"
                        :stroke="MOON.body"
                        stroke-width="2"
                        stroke-linejoin="round"
                    />
                </g>
                <g class="twinkle-star twinkle-star-2" :style="starPoses[1]">
                    <polygon
                        :points="starPolygonPoints[1]"
                        :fill="MOON.body"
                        :stroke="MOON.body"
                        stroke-width="2"
                        stroke-linejoin="round"
                    />
                </g>
                <g class="twinkle-star twinkle-star-3" :style="starPoses[2]">
                    <polygon
                        :points="starPolygonPoints[2]"
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
    </button>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from "vue";
import {
    generateSunRays,
    wobbleDiamond,
    wobbleStarPolygon,
    usePrefersReducedMotion,
} from "@mkbabb/pencil-boil";
import { useTheme } from "@/composables/useTheme";
import { YOSHI_COLORS, MOTION } from "@pencil/config/pencilConfig";
import { useBoilBeat } from "@pencil/composables/boilBeat";

const SUN = YOSHI_COLORS.celestial.sun;
const MOON = YOSHI_COLORS.celestial.moon;

const { isDark, toggleDark } = useTheme();
const reducedMotion = usePrefersReducedMotion();

// ── Celestial boils on the SHARED beat (T3-W12 §2 P1) ──
// Was three private useBoilFrame subscribers (each phase-anchored to its own first
// tick) start/stop-gated by mode; now all three frame indexes derive from the one
// app-wide beat, so the toggle's polygon swaps land in the same dirty frame as the
// grid/outline/divider boils. Mode gating is the advance-guard below (only the LIVE
// body's frames tick — the parked icon stays frozen, same perf posture as before);
// PRM freezes the beat itself centrally, so no per-consumer re-assert dance remains.
const beat = useBoilBeat();
const starFrame = ref(0); // dark: star path boil, every beat (~8fps)
const sunSparkleFrame = ref(0); // light: sparkle boil, every beat (~8fps)
const sunRayFrame = ref(0); // light: slow ray-shape cycling (MOTION.bands.sunRays)
const rayAngle = ref(0); // light: the 240s ray spin, stepped per beat
const breatheBeat = ref(0); // light: the 6s breathe, stepped per beat
watch(beat, (b) => {
    if (isDark.value) {
        starFrame.value = (starFrame.value + 1) % 4;
    } else {
        sunSparkleFrame.value = (sunSparkleFrame.value + 1) % 4;
        if (b % MOTION.bands.sunRays === 0)
            sunRayFrame.value = (sunRayFrame.value + 1) % 6;
        rayAngle.value = (rayAngle.value + RAY_DEG_PER_BEAT) % 360;
        breatheBeat.value++;
    }
});

// ── Breathe + ray spin, STEPPED ON THE BEAT (T3-W12 §2 — the settled page idles) ──
// The BEFORE `gentle-pulse`/`spin-rays` CSS animations interpolated transform
// CONTINUOUSLY on children of the wobble-filtered sun — a filter re-raster in every
// frame, measured at this wave's gate as the settled page's single largest painter
// (~230 of ~270 paints/s, nearly all full-viewport). Same 6s breathe period, same
// amplitude (0.97→1.03, smoothstep ≈ the ease-in-out it replaces), same 240s ray
// revolution — advanced once per beat: steps well under a pixel at 13rem, and
// stop-motion is in-family besides (the page shoots on fours). PRM freezes the beat
// centrally → both hold still, as their old PRM animation:none rules insisted.
const RAY_DEG_PER_BEAT = 360 / ((240 * 1000) / MOTION.beatMs); // 240s full turn
const BREATHE_HALF_BEATS = (6 * 1000) / MOTION.beatMs; // 6s each way (alternate)
const sunBreatheStyle = computed(() => {
    const t = breatheBeat.value % (BREATHE_HALF_BEATS * 2);
    const tri =
        t < BREATHE_HALF_BEATS ? t / BREATHE_HALF_BEATS : 2 - t / BREATHE_HALF_BEATS;
    const eased = tri * tri * (3 - 2 * tri); // smoothstep ≈ ease-in-out
    return { transform: `scale(${(0.97 + 0.06 * eased).toFixed(4)})` };
});
const sunRaysStyle = computed(() => ({
    transform: `rotate(${rayAngle.value.toFixed(3)}deg)`,
}));

const sunRayPoints = computed(() => {
    return generateSunRays(sunRayFrame.value * 100 + 42);
});

const starPolygonPoints = computed(() => {
    const frame = starFrame.value;
    return [
        wobbleStarPolygon(160, 20, 12, 5, frame * 100 + 1),
        wobbleStarPolygon(135, 50, 10, 4, frame * 100 + 2),
        wobbleStarPolygon(175, 65, 9, 3.5, frame * 100 + 3),
    ];
});

const sunSparklePoints = computed(() => {
    const frame = sunSparkleFrame.value;
    return [
        wobbleDiamond(35, 40, 6, 10, frame * 100 + 10),
        wobbleDiamond(170, 45, 5, 8, frame * 100 + 20),
        wobbleDiamond(55, 170, 5, 9, frame * 100 + 30),
    ];
});

// ── P3 (T3-W12 §2): the twinkles STEP ON THE BOIL BEAT, not on a CSS animation ──
// The `star-twinkle` keyframes ran perpetually on SVG children — main-thread by
// construction (SVG transform never composites), so the browser recalculated style
// every frame for a pose that only changes a few times a second; the a1 trace measured
// the recalc floor 120/s → 38/s with them paused, `steps()` timing notwithstanding.
// Same jagged poses, now written only when the mode's boil frame advances (~8Hz) —
// zero running animations at rest, recalc only on the beat. The per-star index offset
// keeps the field desynced (no two stars share a pose); `transform-origin: center` +
// the default view-box transform-box are unchanged, so the geometry (the swing around
// the viewBox center) is the BEFORE geometry. Composes with the star-pop `scale`
// transition (a separate property). Under PRM the beat is frozen — a static wonky
// pose, in family with hand-drawn stars.
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
const starPoses = computed(() => [0, 1, 2].map((i) => twinklePose(starFrame.value, i)));
const sunTwinklePoses = computed(() =>
    [0, 1, 2].map((i) => twinklePose(sunSparkleFrame.value, i)),
);

// Dusk ease (T3-W10 keep, re-anchored): html.theme-turning goes on AT click, the theme
// flip included — body + the paper sheets ease colors ~350ms instead of snapping
// (index.css). One timeout, no clock machinery. Under PRM the flip stands alone and
// page colors snap (the index.css rule is no-preference-gated besides).
//
// `turning` (T3-W12 re-cut): the ~950ms gesture window. It gates the two Yoshi accents
// (the button squash, the plush-land tail) so neither plays at mount; the whirl itself
// is pure .is-active transitions and needs no gate. Cleared on the plush-land
// animationend (the crest), with a timeout backstop. A re-click mid-flight leaves
// `turning` up and just extends the backstop — the whirl transitions retarget for
// free, and a FRESH plush-land instance starts when the other icon gains .is-active,
// so the tail always lands ~800ms after the LAST click. No phase machine.
const turning = ref(false);
let turnTimer: ReturnType<typeof setTimeout> | undefined;
let gestureTimer: ReturnType<typeof setTimeout> | undefined;

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
    }, 1000);
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

/* Both icons layered on top of each other. The parked icon is visibility:hidden at
   rest (T3-W10 keep) so its live wobble filter region costs nothing; the flip to
   hidden is delayed 900ms on the way out — the outgoing body stays on stage for its
   full whirl (opacity lands at 800ms + 100ms delay). */
.toggle-icon {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
}

/* Sun: shrinks + counterclockwise rotates + slides left (dramatic page-turn) */
.toggle-sun {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) rotate(-270deg) scale(0.1);
    transition:
        opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) 100ms,
        transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1),
        visibility 0s linear 900ms;
}

.toggle-sun.is-active {
    opacity: 1;
    visibility: visible;
    transform: translateX(0) rotate(0deg) scale(1);
    transition:
        opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
        transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1),
        visibility 0s;
}

/* Moon: grows + counterclockwise rotates + slides in from left (dramatic page-turn) */
.toggle-moon {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) rotate(-270deg) scale(0.1);
    transition:
        opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) 100ms,
        transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1),
        visibility 0s linear 900ms;
}

.toggle-moon.is-active {
    opacity: 1;
    visibility: visible;
    transform: translateX(0) rotate(0deg) scale(1);
    transition:
        opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
        transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1),
        visibility 0s;
}

/* ─── The Yoshi beats (T3-W12 re-cut) ─────────────────────────────────────
   Three accents folded ONTO the before-shaped 800ms whirl-crossfade above. The
   whirl itself stays pure transitions (BEFORE verbatim), so a re-click
   mid-flight retargets for free; the accents ride the composited `scale`
   property, which multiplies with `transform` instead of fighting it. */

/* SQUASH (0–120ms) — button-level anticipation, OVERLAPPING the whirl's first
   beat (both fire at click). The spring release overshoots ~1 by a hair. */
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
        animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    100% {
        scale: 1;
    }
}

/* PLUSH LAND (~800–950ms) — one squash-bounce tail as the 800ms spring
   resolves: the moon lands like a plush toy. Identity for the first 84%
   (= 800ms of 950ms) so the whirl transition runs beneath it untouched. */
.is-turning .toggle-icon.is-active {
    animation: plush-land 950ms both;
}

@keyframes plush-land {
    0%,
    84% {
        scale: 1 1;
        animation-timing-function: ease-in;
    }
    90% {
        scale: 1.05 0.95;
        animation-timing-function: ease-out;
    }
    100% {
        scale: 1 1;
    }
}

/* STAR POP (~500/580/660ms) — stars and sparkles hold their breath for the
   whirl's first ~500ms, then pop staggered onto the body's overshoot: a 150ms
   back-out fling from the body's heart out to the perch (transform-origin is
   the viewBox center, so scale 0.2→1 carries them outward). Pure
   transition-delay off .is-active — no clock. On whirl-out they tuck in fast,
   undelayed. */
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
        scale 150ms cubic-bezier(0.68, -0.55, 0.265, 1.55) 500ms,
        opacity 120ms ease-out 500ms;
}

.toggle-icon.is-active .twinkle-star-2 {
    transition-delay: 580ms;
}
.toggle-icon.is-active .twinkle-star-3 {
    transition-delay: 660ms;
}

/* Pause all animations on inactive icon to save GPU */
.toggle-sun:not(.is-active) *,
.toggle-moon:not(.is-active) * {
    animation-play-state: paused !important;
}

/* Ray spin (240s full rotation) + gentle pulse (6s) — both STEPPED ON THE BEAT
   (T3-W12 §2): the transforms arrive inline from the script; the old continuous
   CSS animations re-rastered the wobble-filtered sun every frame. Only the origins
   live here. */
.sun-rays {
    transform-origin: 100px 100px;
}

.sun-breathe {
    transform-origin: 100px 100px;
}

/* Reduced motion — the PRM variant exactly as T3-W10 built it: theme flips
   immediately at click, a single 200ms opacity crossfade, no transforms, stars
   appear WITH the moon. Both icons stay visibility:visible so the crossfade has two
   participants; every boil and filter-param loop is already parked by the library's
   PRM gate. */
@media (prefers-reduced-motion: reduce) {
    .toggle-icon {
        visibility: visible;
        opacity: 0;
        transition: opacity 200ms ease;
        transform: none !important;
        animation: none;
    }

    .toggle-icon.is-active {
        opacity: 1;
        transform: none !important;
    }

    .sun-moon-toggle.is-turning {
        animation: none;
    }

    /* (.sun-rays/.sun-breathe need no PRM rule anymore: their spin/pulse step on
     the boil beat, which PRM freezes centrally — same stillness, one gate.) */

    /* Stars appear WITH the moon — no suppression, no delayed pop; they ride the
     icon's 200ms crossfade. Matches the pop rules' specificity, wins on order.
     (The twinkle itself needs no PRM rule anymore: its poses ride the boil beat,
     which PRM freezes centrally — P3.) */
    .toggle-icon .twinkle-star,
    .toggle-icon .dot-star,
    .toggle-icon.is-active .twinkle-star,
    .toggle-icon.is-active .dot-star {
        scale: none;
        opacity: 1;
        transition: none;
    }
}

/* Star twinkling — jagged scale/rotate poses, stepped on the boil beat (T3-W12 §2 P3).
   The former `star-twinkle` CSS animation (even at steps(5, end)) kept a per-frame
   style-recalc alive on every star; the poses now arrive as inline transforms from the
   script, written only when the mode's boil frame advances. Origin semantics are the
   BEFORE geometry: view-box transform-box, center = the viewBox center. */
.twinkle-star {
    transform-origin: center;
}
</style>

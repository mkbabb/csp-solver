<template>
  <button
    class="sun-moon-toggle"
    :class="{ 'is-dark': isDark }"
    @click="handleToggle"
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
      <g class="sun-breathe">
        <!-- Rays: spin independently, irregular per ray.
             S5 (upstream note, NOT a repo change): generateSunRays' second-pass inset
             widens outerR-5 → outerR-8 in pencil-boil's next patch version. -->
        <g class="sun-rays">
          <polygon
            :points="sunRayPoints.outerPoly"
            :fill="SUN.body" :stroke="SUN.body" stroke-width="4" stroke-linejoin="round"
          />
          <polygon
            :points="sunRayPoints.innerPoly"
            fill="none" :stroke="SUN.outline" stroke-width="5" stroke-linejoin="round"
          />
        </g>
        <!-- Disc: stationary relative to breathe group. W1: disc outline 5→6. -->
        <g class="sun-disc">
          <circle cx="100" cy="100" r="48" :fill="SUN.core" :stroke="SUN.outline" stroke-width="6" />
          <!-- Golden spiral — Yoshi's Story style. S1: terminal curls (not bars) and the
               outer coil ends short of the disc edge, sw 10→9. Color is the rays gold
               (S2 reverted by the 2026-07-11 owner audit — the hue pop carries it). -->
          <path
            d="M100,102 C105,93 116,96 117,107 C121,122 105,130 90,124 C72,115 68,92 80,76 C96,56 126,56 132,78"
            fill="none" :stroke="SUN.spiral" stroke-width="9" stroke-linecap="round"
          />
        </g>
        <!-- Sparkle diamonds around sun. S3: stroke 1.5→3, deepened — legible at 5rem. -->
        <g class="sun-sparkle twinkle-star">
          <polygon :points="sunSparklePoints[0]" :fill="SUN.sparkle" :stroke="SUN.sparkleStroke" stroke-width="3" stroke-linejoin="round" />
        </g>
        <g class="sun-sparkle twinkle-star twinkle-star-2">
          <polygon :points="sunSparklePoints[1]" :fill="SUN.sparkle" :stroke="SUN.sparkleStroke" stroke-width="3" stroke-linejoin="round" />
        </g>
        <g class="sun-sparkle twinkle-star twinkle-star-3">
          <polygon :points="sunSparklePoints[2]" :fill="SUN.sparkle" :stroke="SUN.sparkleStroke" stroke-width="3" stroke-linejoin="round" />
        </g>
        <!-- Tiny dot sparkles -->
        <circle class="sun-sparkle" cx="30" cy="45" r="2" :fill="SUN.sparkle" />
        <circle class="sun-sparkle" cx="55" cy="170" r="2.5" :fill="SUN.sparkle" />
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
          :fill="MOON.body" :stroke="MOON.outline" stroke-width="7" stroke-linejoin="round"
        />
        <!-- Inner stroke detail. M2: moved down + thinned so it no longer crowds the tip. -->
        <path
          d="M72,52 C52,68 47,105 55,133"
          fill="none" :stroke="MOON.outline" stroke-width="3.5" stroke-linecap="round"
        />

        <!-- 5-point polygon stars with wobble -->
        <g class="twinkle-star">
          <polygon :points="starPolygonPoints[0]" :fill="MOON.body" :stroke="MOON.body" stroke-width="2" stroke-linejoin="round" />
        </g>
        <g class="twinkle-star twinkle-star-2">
          <polygon :points="starPolygonPoints[1]" :fill="MOON.body" :stroke="MOON.body" stroke-width="2" stroke-linejoin="round" />
        </g>
        <g class="twinkle-star twinkle-star-3">
          <polygon :points="starPolygonPoints[2]" :fill="MOON.body" :stroke="MOON.body" stroke-width="2" stroke-linejoin="round" />
        </g>

        <!-- Tiny dot stars. M3: one temperature with the star field (white → butter). -->
        <circle cx="120" cy="30" r="2" :fill="MOON.star" />
        <circle cx="185" cy="35" r="2.5" :fill="MOON.star" />
        <circle cx="155" cy="75" r="1.5" :fill="MOON.star" />
      </g>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { watch, computed, onUnmounted } from 'vue'
import {
  generateSunRays,
  wobbleDiamond,
  wobbleStarPolygon,
  useBoilFrame,
  usePrefersReducedMotion,
} from '@mkbabb/pencil-boil'
import { useTheme } from '@/composables/useTheme'
import { YOSHI_COLORS } from '@pencil/config/pencilConfig'

const SUN = YOSHI_COLORS.celestial.sun
const MOON = YOSHI_COLORS.celestial.moon

const { isDark, toggleDark } = useTheme()
const reducedMotion = usePrefersReducedMotion()

// All three ride the unified rAF scheduler; the watch below start/stop-gates them by mode.

// Star path boil at ~8fps — only active in dark mode
const { currentFrame: starFrame, start: startStarBoil, stop: stopStarBoil } = useBoilFrame(4)

// Sun sparkle boil at ~8fps — only active in light mode
const { currentFrame: sunSparkleFrame, start: startSunBoil, stop: stopSunBoil } = useBoilFrame(4)

// Sun ray boil at ~2.5fps — slow stop-motion for ray shape cycling
const { currentFrame: sunRayFrame, start: startRayBoil, stop: stopRayBoil } = useBoilFrame(6, 800)

// Pause star boil when not in dark mode, sun sparkle boil when dark (saves perf).
// `reducedMotion` is a dep so this re-asserts the correct mode state after a PRM
// round-trip — otherwise useBoilFrame's own watchEffect (which restarts every boil when
// PRM disengages) would resurrect the mode-inactive one. start() self-guards on PRM, so
// the start* calls are no-ops while reduced motion is engaged.
watch([isDark, reducedMotion], ([dark]) => {
    if (dark) { startStarBoil(); stopSunBoil(); stopRayBoil(); }
    else { stopStarBoil(); startSunBoil(); startRayBoil(); }
}, { immediate: true })

const sunRayPoints = computed(() => {
    return generateSunRays(sunRayFrame.value * 100 + 42);
})

const starPolygonPoints = computed(() => {
    const frame = starFrame.value;
    return [
        wobbleStarPolygon(160, 20, 12, 5, frame * 100 + 1),
        wobbleStarPolygon(135, 50, 10, 4, frame * 100 + 2),
        wobbleStarPolygon(175, 65, 9, 3.5, frame * 100 + 3),
    ];
})

const sunSparklePoints = computed(() => {
    const frame = sunSparkleFrame.value;
    return [
        wobbleDiamond(35, 40, 6, 10, frame * 100 + 10),
        wobbleDiamond(170, 45, 5, 8, frame * 100 + 20),
        wobbleDiamond(55, 170, 5, 9, frame * 100 + 30),
    ];
})

// Dusk ease (T3-W10 keep, re-anchored): html.theme-turning goes on AT click, the theme
// flip included — body + the paper sheets ease colors ~350ms instead of snapping
// (index.css). One timeout, no clock machinery. Under PRM the flip stands alone and
// page colors snap (the index.css rule is no-preference-gated besides).
let turnTimer: ReturnType<typeof setTimeout> | undefined

function handleToggle() {
  toggleDark()
  if (reducedMotion.value) return
  document.documentElement.classList.add('theme-turning')
  clearTimeout(turnTimer)
  turnTimer = setTimeout(() => {
    document.documentElement.classList.remove('theme-turning')
  }, 400)
}

onUnmounted(() => {
  clearTimeout(turnTimer)
  document.documentElement.classList.remove('theme-turning')
})
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
  transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) 100ms,
              transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1),
              visibility 0s linear 900ms;
}

.toggle-sun.is-active {
  opacity: 1;
  visibility: visible;
  transform: translateX(0) rotate(0deg) scale(1);
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1),
              visibility 0s;
}

/* Moon: grows + counterclockwise rotates + slides in from left (dramatic page-turn) */
.toggle-moon {
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) rotate(-270deg) scale(0.1);
  transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) 100ms,
              transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1),
              visibility 0s linear 900ms;
}

.toggle-moon.is-active {
  opacity: 1;
  visibility: visible;
  transform: translateX(0) rotate(0deg) scale(1);
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1),
              visibility 0s;
}

/* Pause all animations on inactive icon to save GPU */
.toggle-sun:not(.is-active) *,
.toggle-moon:not(.is-active) * {
  animation-play-state: paused !important;
}

/* Continuous ray spin (240s full rotation) */
.sun-rays {
  transform-origin: 100px 100px;
  animation: spin-rays 240s linear infinite;
}

@keyframes spin-rays {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Gentle pulse on the outer sun group (6s) */
.sun-breathe {
  transform-origin: 100px 100px;
  animation: gentle-pulse 6s ease-in-out alternate infinite;
}

@keyframes gentle-pulse {
  from { transform: scale(0.97); }
  to { transform: scale(1.03); }
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
  }

  .toggle-icon.is-active {
    opacity: 1;
    transform: none !important;
  }

  .sun-rays {
    animation: none;
  }

  .sun-breathe {
    animation: none;
  }

  .twinkle-star {
    animation: none;
  }
}

/* Star twinkling — jagged scale/rotate via CSS steps */
.twinkle-star {
  transform-origin: center;
  animation: star-twinkle 2s steps(5, end) infinite alternate;
}

.twinkle-star-2 {
  animation-delay: -0.7s;
  animation-duration: 2.5s;
}

.twinkle-star-3 {
  animation-delay: -1.3s;
  animation-duration: 1.8s;
}

@keyframes star-twinkle {
  0% { transform: scale(0.85) rotate(0deg); }
  25% { transform: scale(1.1) rotate(8deg); }
  50% { transform: scale(0.9) rotate(-5deg); }
  75% { transform: scale(1.15) rotate(12deg); }
  100% { transform: scale(0.95) rotate(-3deg); }
}
</style>

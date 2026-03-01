<template>
  <button
    class="sun-moon-toggle"
    :class="{ 'is-dark': isDark }"
    @click="handleToggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <!-- Sun icon (light mode) — always rendered, hidden via CSS -->
    <svg
      class="toggle-icon toggle-sun"
      :class="{ 'is-active': !isDark }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      :filter="!isDark ? 'url(#wobble-celestial)' : undefined"
    >
      <g class="sun-breathe">
        <!-- Rays: spin independently, irregular per ray -->
        <g class="sun-rays">
          <polygon
            :points="sunRayPoints.outerPoly"
            fill="#E88845" stroke="#E88845" stroke-width="4" stroke-linejoin="round"
          />
          <polygon
            :points="sunRayPoints.innerPoly"
            fill="none" stroke="#D16A32" stroke-width="5" stroke-linejoin="round"
          />
        </g>
        <!-- Disc: stationary relative to breathe group -->
        <g class="sun-disc">
          <circle cx="100" cy="100" r="48" fill="#F09855" stroke="#D16A32" stroke-width="5" />
          <!-- Golden spiral — Yoshi's Story style -->
          <path
            d="M100,100 C106,90 118,94 119,106 C121,122 105,130 90,124 C72,115 68,92 80,76 C96,56 126,56 138,76"
            fill="none" stroke="#F0B030" stroke-width="10" stroke-linecap="round"
          />
        </g>
        <!-- Sparkle diamonds around sun -->
        <g class="sun-sparkle twinkle-star">
          <polygon :points="sunSparklePoints[0]" fill="#FDE68A" stroke="#F0B030" stroke-width="1.5" stroke-linejoin="round" />
        </g>
        <g class="sun-sparkle twinkle-star twinkle-star-2">
          <polygon :points="sunSparklePoints[1]" fill="#FDE68A" stroke="#F0B030" stroke-width="1.5" stroke-linejoin="round" />
        </g>
        <g class="sun-sparkle twinkle-star twinkle-star-3">
          <polygon :points="sunSparklePoints[2]" fill="#FDE68A" stroke="#F0B030" stroke-width="1.5" stroke-linejoin="round" />
        </g>
        <!-- Tiny dot sparkles -->
        <circle cx="30" cy="45" r="2" fill="#FDE68A" class="sun-sparkle" />
        <circle cx="55" cy="170" r="2.5" fill="#FDE68A" class="sun-sparkle" />
      </g>
    </svg>

    <!-- Moon icon (dark mode) — always rendered, hidden via CSS -->
    <svg
      class="toggle-icon toggle-moon"
      :class="{ 'is-active': isDark }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      :filter="isDark ? 'url(#wobble-celestial)' : undefined"
    >
      <g>
        <!-- Crescent moon path -->
        <path
          d="M85,30 C40,40 15,90 35,140 C55,185 115,190 155,150 C120,165 70,145 60,95 C55,65 65,40 85,30 Z"
          fill="#FFF4AA" stroke="#E5C74D" stroke-width="6" stroke-linejoin="round"
        />
        <!-- Inner stroke detail -->
        <path
          d="M75,45 C50,65 45,105 55,135"
          fill="none" stroke="#E5C74D" stroke-width="4" stroke-linecap="round"
        />

        <!-- 5-point polygon stars with wobble -->
        <g class="twinkle-star">
          <polygon :points="starPolygonPoints[0]" fill="#FFF4AA" stroke="#FFF4AA" stroke-width="2" stroke-linejoin="round" />
        </g>
        <g class="twinkle-star twinkle-star-2">
          <polygon :points="starPolygonPoints[1]" fill="#FFF4AA" stroke="#FFF4AA" stroke-width="2" stroke-linejoin="round" />
        </g>
        <g class="twinkle-star twinkle-star-3">
          <polygon :points="starPolygonPoints[2]" fill="#FFF4AA" stroke="#FFF4AA" stroke-width="2" stroke-linejoin="round" />
        </g>

        <!-- Tiny dot stars -->
        <circle cx="120" cy="30" r="2" fill="#FFFFFF" />
        <circle cx="185" cy="35" r="2.5" fill="#FFFFFF" />
        <circle cx="155" cy="75" r="1.5" fill="#FFFFFF" />
      </g>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useLineBoil } from '@/composables/useLineBoil'
import { mulberry32 } from '@/lib/handDrawnPaths'

const { isDark, toggleDark } = useTheme()

// Star path boil at ~8fps — only active in dark mode
const { currentFrame: starFrame, start: startStarBoil, stop: stopStarBoil } = useLineBoil(4)

// Sun sparkle boil at ~8fps — only active in light mode
const { currentFrame: sunSparkleFrame, start: startSunBoil, stop: stopSunBoil } = useLineBoil(4)

// Sun ray boil at ~2.5fps — slow stop-motion for ray shape cycling
const { currentFrame: sunRayFrame, start: startRayBoil, stop: stopRayBoil } = useLineBoil(6, 800)

// Pause star boil when not in dark mode, sun sparkle boil when dark (saves perf)
watch(isDark, (dark) => {
    if (dark) { startStarBoil(); stopSunBoil(); stopRayBoil(); }
    else { stopStarBoil(); startSunBoil(); startRayBoil(); }
}, { immediate: true })

function wobbleDiamond(cx: number, cy: number, rx: number, ry: number, seed: number): string {
    const rng = mulberry32(seed);
    const w = (rng() - 0.5) * 1.5;
    return [
        `${(cx + w).toFixed(1)},${(cy - ry + (rng() - 0.5) * 2).toFixed(1)}`,
        `${(cx + rx + (rng() - 0.5) * 2).toFixed(1)},${(cy + w).toFixed(1)}`,
        `${(cx + w).toFixed(1)},${(cy + ry + (rng() - 0.5) * 2).toFixed(1)}`,
        `${(cx - rx + (rng() - 0.5) * 2).toFixed(1)},${(cy + w).toFixed(1)}`,
    ].join(' ');
}

function wobbleStarPolygon(cx: number, cy: number, outerR: number, innerR: number, seed: number): string {
    const rng = mulberry32(seed);
    const points: string[] = [];
    for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const r = i % 2 === 0 ? outerR : innerR;
        const x = cx + Math.cos(angle) * r + (rng() - 0.5) * 2;
        const y = cy + Math.sin(angle) * r + (rng() - 0.5) * 2;
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
}

/** Generate irregular sun rays with per-ray seeded variation.
 *  Some rays tall & skinny, others short & wide — storybook hand-cut feel. */
function generateSunRays(seed: number) {
    const rng = mulberry32(seed);
    const cx = 100, cy = 100;
    const numRays = 10;
    const outerPoints: string[] = [];
    const innerPoints: string[] = [];

    for (let i = 0; i < numRays; i++) {
        const baseAngle = (Math.PI * 2 * i) / numRays - Math.PI / 2;
        const midAngle = baseAngle + Math.PI / numRays;

        // Outer tip: radius 75–100 (moderate variance — some shorter, some longer)
        const outerR = 75 + rng() * 25;
        // Angular jitter ±8° — subtle irregularity
        const outerAngle = baseAngle + (rng() - 0.5) * (8 * Math.PI / 180);
        const outerWobble = (rng() - 0.5) * 2.5;
        outerPoints.push(
            `${(cx + Math.cos(outerAngle) * outerR + outerWobble).toFixed(1)},${(cy + Math.sin(outerAngle) * outerR + outerWobble).toFixed(1)}`
        );

        // Inner valley: radius 48–60 (varied depth)
        const innerR = 48 + rng() * 12;
        const innerAngle = midAngle + (rng() - 0.5) * (8 * Math.PI / 180);
        const innerWobble = (rng() - 0.5) * 2.5;
        outerPoints.push(
            `${(cx + Math.cos(innerAngle) * innerR + innerWobble).toFixed(1)},${(cy + Math.sin(innerAngle) * innerR + innerWobble).toFixed(1)}`
        );

        // Inner polygon (stroke outline) — slightly inset
        const outerR2 = outerR - 5 + (rng() - 0.5) * 3;
        const innerR2 = innerR + 2 + (rng() - 0.5) * 2;
        innerPoints.push(
            `${(cx + Math.cos(outerAngle) * outerR2 + (rng() - 0.5) * 2).toFixed(1)},${(cy + Math.sin(outerAngle) * outerR2 + (rng() - 0.5) * 2).toFixed(1)}`
        );
        innerPoints.push(
            `${(cx + Math.cos(innerAngle) * innerR2 + (rng() - 0.5) * 2).toFixed(1)},${(cy + Math.sin(innerAngle) * innerR2 + (rng() - 0.5) * 2).toFixed(1)}`
        );
    }

    return {
        outerPoly: outerPoints.join(' '),
        innerPoly: innerPoints.join(' '),
    };
}

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

function handleToggle() {
  toggleDark()
}
</script>

<style scoped>
.sun-moon-toggle {
  position: relative;
  width: 5rem;
  height: 5rem;
  cursor: pointer;
  border: 0;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  transition: transform 200ms ease;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .sun-moon-toggle {
    width: 10rem;
    height: 10rem;
  }
}

@media (min-width: 1024px) {
  .sun-moon-toggle {
    width: 13rem;
    height: 13rem;
  }
}

.sun-moon-toggle:hover {
  outline: none;
  transform: scale(1.08);
}

.sun-moon-toggle:focus {
  outline: none;
}

/* Both icons layered on top of each other */
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
  transform: translateX(-50%) rotate(-270deg) scale(0.1);
  transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) 100ms,
              transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toggle-sun.is-active {
  opacity: 1;
  transform: translateX(0) rotate(0deg) scale(1);
  pointer-events: auto;
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Moon: grows + counterclockwise rotates + slides in from left (dramatic page-turn) */
.toggle-moon {
  opacity: 0;
  transform: translateX(-50%) rotate(-270deg) scale(0.1);
  transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1) 100ms,
              transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toggle-moon.is-active {
  opacity: 1;
  transform: translateX(0) rotate(0deg) scale(1);
  pointer-events: auto;
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Pause all animations on inactive icon to save GPU */
.toggle-sun:not(.is-active) *,
.toggle-moon:not(.is-active) * {
  animation-play-state: paused !important;
}

/* Continuous ray spin (50s full rotation) */
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

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .toggle-sun,
  .toggle-moon {
    transition: opacity 200ms ease;
    transform: none !important;
  }

  .toggle-sun.is-active,
  .toggle-moon.is-active {
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

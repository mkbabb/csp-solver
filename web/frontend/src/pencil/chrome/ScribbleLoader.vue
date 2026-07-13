<script setup lang="ts">
/**
 * The thinking-scribble — the app-wide loading primitive (design-refinement.md §5.1,
 * D3). Replaces the stock Tailwind `animate-spin` arc, the one visibly off-world
 * element in the whole app: a spinner is not something you could draw on a page in a
 * child's puzzle book. This is what you doodle while thinking.
 *
 * A seeded 3-loop scribble (24×24 viewBox) drawn on and erased by `stroke-dashoffset`
 * over a 1000ms cycle — draw 450ms → hold 100ms → erase 350ms → 100ms gap — via CSS
 * on a `pathLength="1"`-normalized path (no getTotalLength, no JS tick; the cheapest
 * possible loop). Timing tiers (the >150ms flash guard, the >2.5s marginalia) are the
 * caller's concern — this primitive just loops while mounted.
 *
 * PRM: a static scribble at 0.6 opacity — the doodle is there, it just isn't moving.
 * `currentColor` throughout, so it inherits its host's ink.
 */
import { mulberry32 } from "@mkbabb/pencil-boil";

withDefaults(defineProps<{ size?: number }>(), { size: 22 });

// A growing 3-loop coil with per-vertex jitter — a thinking doodle, generated once.
function scribblePath(seed: number): string {
  const rng = mulberry32(seed);
  const cx = 12;
  const cy = 12;
  const loops = 3;
  const steps = 44;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * loops * Math.PI * 2;
    const r = 2.5 + t * 6.5;
    const x = cx + Math.cos(angle) * r + (rng() - 0.5) * 1.8;
    const y = cy + Math.sin(angle) * r + (rng() - 0.5) * 1.8;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

const SCRIBBLE_D = scribblePath(7);
</script>

<template>
  <svg
    class="scribble-loader"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    role="img"
    aria-label="solving"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      class="scribble-path"
      :d="SCRIBBLE_D"
      pathLength="1"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      filter="url(#grain-static)"
    />
  </svg>
</template>

<style scoped>
.scribble-loader {
  overflow: visible;
  color: inherit;
}

.scribble-path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: scribble-cycle 1000ms linear infinite;
}

/* draw (0→45% = 450ms, easeInOutCubic) → hold (→55% = 100ms) → erase (→90% = 350ms,
   easeInCubic) → gap (→100% = 100ms). Both hidden endpoints (offset ±1) so the loop
   restart is invisible. */
@keyframes scribble-cycle {
  0% {
    stroke-dashoffset: 1;
    animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  45% {
    stroke-dashoffset: 0;
    animation-timing-function: linear;
  }
  55% {
    stroke-dashoffset: 0;
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  90% {
    stroke-dashoffset: -1;
    animation-timing-function: linear;
  }
  100% {
    stroke-dashoffset: -1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scribble-path {
    animation: none;
    stroke-dashoffset: 0;
    opacity: 0.6;
  }
}
</style>

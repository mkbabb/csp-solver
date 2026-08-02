<script setup lang="ts">
defineProps<{ size?: number; playing?: boolean }>();
</script>

<template>
  <!-- Decorative: every icon sits inside a control that carries its own accessible name
       (a11y r1 M6 — the census leak this file was one of four sources of). -->
  <svg
    aria-hidden="true"
    :width="size ?? 28"
    :height="size ?? 28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Check: two separate lines — no miter join to blob at the crook -->
    <line
      x1="2"
      y1="13"
      x2="8.5"
      y2="20"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linecap="round"
      :class="{ 'check-draw': playing }"
      :style="playing ? { strokeDasharray: 10, strokeDashoffset: 10 } : undefined"
    />
    <line
      x1="8.5"
      y1="20"
      x2="22"
      y2="4"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linecap="round"
      :class="{ 'check-draw': playing }"
      :style="
        playing
          ? { strokeDasharray: 20, strokeDashoffset: 20, animationDelay: '120ms' }
          : undefined
      "
    />
    <!-- 4-point sparkle with soft curved tips -->
    <path
      d="M5,1.5 Q5.5,5 8.5,5.5 Q5.5,6 5,9.5 Q4.5,6 1.5,5.5 Q4.5,5 5,1.5 Z"
      fill="currentColor"
      :class="{ 'star-sparkle': playing }"
    />
  </svg>
</template>

<style scoped>
/* Check draw-in: stroke-dashoffset → 0 */
.check-draw {
  animation: drawIn 350ms var(--ease-standard) forwards;
}

@keyframes drawIn {
  from {
    stroke-dashoffset: var(--dashoffset, 20);
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* Star sparkle: scale up + glow pulse */
.star-sparkle {
  transform-origin: 5px 5.5px;
  animation: sparkleGrow 500ms var(--ease-springPop) forwards;
}

@keyframes sparkleGrow {
  0% {
    transform: scale(0.3);
    opacity: 0.2;
  }
  40% {
    transform: scale(1.6);
    opacity: 1;
  }
  70% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>

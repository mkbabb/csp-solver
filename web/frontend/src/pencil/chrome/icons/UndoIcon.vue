<script setup lang="ts">
defineProps<{ size?: number }>();
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
    <!-- The return curl: from the arrowhead at the upper-left the shaft sweeps right
         across the top, then bows down and back — a hand-drawn ↺, the crook a touch
         off-round (two Q-arcs, not one clean radius; same wobble register as DiceIcon's
         connectors). -->
    <path
      d="M5,8.2 Q11,6.3 16.4,8.1 Q19.4,9.2 19.1,13 Q18.8,17 14,18.4"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <!-- Arrowhead at the tip (5,8.2): barbs splay back toward the shaft (rightward), so
         the point reads leftward — "go back". Barbs a hair uneven, drawn as one open V. -->
    <path
      d="M8.7,5.9 L5,8.2 L7.7,11.4"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </svg>
</template>

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
    <!-- Block: rotated -40°, working end down-left onto the scrub marks -->
    <g transform="rotate(-40, 11.6, 11.25)">
      <!-- Body: the left (working) edge is two shallow Q-curves — the worn edge -->
      <path
        d="M6.1,7 L16.8,7 Q18.6,7 18.6,8.8 L18.6,13.7 Q18.6,15.5 16.8,15.5 L6.5,15.5 Q4.9,15.5 5,13.9 Q4.5,11.4 5.1,8.6 Q5.2,7.1 6.1,7 Z"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
        fill="none"
      />
      <!-- Sleeve band, a hair off-plumb -->
      <line
        x1="14.1"
        y1="7.1"
        x2="13.8"
        y2="15.4"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <!-- Worn-edge retrace: a faint second pass just inside the working end -->
      <path
        d="M6.3,8.3 Q5.85,11.3 6.4,14.2"
        stroke="currentColor"
        stroke-width="1.1"
        stroke-linecap="round"
        opacity="0.5"
      />
    </g>

    <!-- Scrub swipe + crumbs under the working corner -->
    <path
      d="M2.6,21 Q5,20 7.6,20.8"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
    />
    <path
      d="M9.8,20.9 Q11.3,20.4 12.7,20.8"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
    />
    <circle cx="14.8" cy="21.2" r="0.85" fill="currentColor" />
  </svg>
</template>

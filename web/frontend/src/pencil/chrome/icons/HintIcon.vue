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
    <!-- The idea, drawn: a bulb whose glass rides a hair lopsided (the left shoulder
         higher), narrowing to a flat collar. Outline register matches EraserIcon's body
         — round joins, ~1.7 stroke, no fill. -->
    <path
      d="M12,3.4 Q17.6,3.6 17.9,9.1 Q17.9,12 15.2,14 Q14.4,14.6 14.3,15.7 L9.7,15.7 Q9.6,14.6 8.8,14 Q6.1,12 6.1,9 Q6.4,3.5 12,3.4 Z"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <!-- Screw base: two shortening strokes, the bulb's collar. -->
    <path
      d="M9.9,17.7 H14.1"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
    />
    <path
      d="M10.7,19.7 H13.3"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
    />
    <!-- Filament: a small hand-drawn loop, the idea catching. -->
    <path
      d="M10.2,9.4 Q12,11.6 13.8,9.4"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <!-- Two idea-sparks off the glass shoulders, unequal reach. -->
    <path
      d="M3.6,6.2 L2.1,5.1"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
    />
    <path
      d="M20.4,6.2 L21.9,5.1"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
    />
  </svg>
</template>

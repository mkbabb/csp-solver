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
    <!-- The forward curl — UndoIcon mirrored across x=12: the shaft sweeps left across
         the top then bows down and back, the arrowhead reading rightward ("go on"). -->
    <path
      d="M19,8.2 Q13,6.3 7.6,8.1 Q4.6,9.2 4.9,13 Q5.2,17 10,18.4"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <!-- Arrowhead at the tip (19,8.2): barbs splay back toward the shaft (leftward), so
         the point reads rightward. -->
    <path
      d="M15.3,5.9 L19,8.2 L16.3,11.4"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </svg>
</template>

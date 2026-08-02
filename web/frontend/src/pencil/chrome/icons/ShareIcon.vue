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
    <!-- Three pips (the dice-pip vocabulary, scaled up), sizes a hair uneven -->
    <circle cx="5" cy="12.3" r="2.1" fill="currentColor" />
    <circle cx="18.4" cy="5.6" r="2.2" fill="currentColor" />
    <circle cx="17.9" cy="18.6" r="2" fill="currentColor" />

    <!-- Connectors: gently bowed, sag mismatched — one dips, one lifts -->
    <path
      d="M7.9,10.9 Q12.1,9.8 15.5,7"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      fill="none"
    />
    <path
      d="M7.9,13.7 Q11.8,14.7 15,17.3"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      fill="none"
    />
  </svg>
</template>

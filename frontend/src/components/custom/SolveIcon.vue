<script setup lang="ts">
defineProps<{ size?: number }>();
</script>

<template>
  <svg
    :width="size ?? 28"
    :height="size ?? 28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Checkmark with deep crook — long short-leg for readability -->
    <polyline
      points="2,14 9,21 22,4"
      stroke="currentColor"
      stroke-width="2.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <!-- Filled 5-point star above the crook -->
    <polygon
      points="4.5,9 5.4,6.5 7.5,6.5 5.9,5 6.5,2.8 4.5,4.1 2.5,2.8 3.1,5 1.5,6.5 3.6,6.5"
      fill="currentColor"
    />
  </svg>
</template>

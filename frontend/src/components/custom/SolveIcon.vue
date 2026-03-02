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
    <!-- Check: two separate lines — no miter join to blob at the crook -->
    <line x1="2" y1="13" x2="8.5" y2="20" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
    <line x1="8.5" y1="20" x2="22" y2="4" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
    <!-- 4-point sparkle with soft curved tips -->
    <path
      d="M5,1.5 Q5.5,5 8.5,5.5 Q5.5,6 5,9.5 Q4.5,6 1.5,5.5 Q4.5,5 5,1.5 Z"
      fill="currentColor"
    />
  </svg>
</template>

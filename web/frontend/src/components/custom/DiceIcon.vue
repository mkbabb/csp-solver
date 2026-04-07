<script setup lang="ts">
defineProps<{ size?: number; playing?: boolean }>();
</script>

<template>
  <svg
    :width="size ?? 28"
    :height="size ?? 28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="{ 'dice-roll': playing }"
  >
    <!-- Back die: rotated -10°, showing 3 (diagonal) -->
    <g transform="rotate(-10, 12, 12)">
      <rect
        x="8" y="3" width="13" height="13" rx="2"
        stroke="currentColor" stroke-width="1.8" fill="none"
      />
      <!-- Pip top-right -->
      <circle cx="17" cy="7" r="1.2" fill="currentColor"
        :class="{ 'pip-pop': playing }" :style="playing ? { animationDelay: '200ms' } : undefined" />
      <!-- Pip center -->
      <circle cx="14.5" cy="9.5" r="1.2" fill="currentColor"
        :class="{ 'pip-pop': playing }" :style="playing ? { animationDelay: '240ms' } : undefined" />
      <!-- Pip bottom-left -->
      <circle cx="12" cy="12" r="1.2" fill="currentColor"
        :class="{ 'pip-pop': playing }" :style="playing ? { animationDelay: '280ms' } : undefined" />
    </g>

    <!-- Front die: rotated 8°, showing 4 (corners) -->
    <g transform="rotate(8, 12, 12)">
      <rect
        x="3" y="8" width="13" height="13" rx="2"
        stroke="currentColor" stroke-width="1.8" fill="none"
      />
      <!-- Pip top-left -->
      <circle cx="7" cy="12" r="1.2" fill="currentColor"
        :class="{ 'pip-pop': playing }" :style="playing ? { animationDelay: '320ms' } : undefined" />
      <!-- Pip top-right -->
      <circle cx="12" cy="12" r="1.2" fill="currentColor"
        :class="{ 'pip-pop': playing }" :style="playing ? { animationDelay: '360ms' } : undefined" />
      <!-- Pip bottom-left -->
      <circle cx="7" cy="17" r="1.2" fill="currentColor"
        :class="{ 'pip-pop': playing }" :style="playing ? { animationDelay: '400ms' } : undefined" />
      <!-- Pip bottom-right -->
      <circle cx="12" cy="17" r="1.2" fill="currentColor"
        :class="{ 'pip-pop': playing }" :style="playing ? { animationDelay: '440ms' } : undefined" />
    </g>
  </svg>
</template>

<style scoped>
.dice-roll {
  transform-origin: center;
  animation: diceRoll 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes diceRoll {
  0%   { transform: rotate(0deg) scale(1); }
  30%  { transform: rotate(200deg) scale(0.85); }
  60%  { transform: rotate(380deg) scale(1.05); }
  100% { transform: rotate(360deg) scale(1); }
}

.pip-pop {
  transform-origin: center;
  transform-box: fill-box;
  animation: pipPop 250ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes pipPop {
  0%   { transform: scale(0); opacity: 0; }
  50%  { transform: scale(1.4); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
</style>

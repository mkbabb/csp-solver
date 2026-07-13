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
  >
    <!-- The board frame: a hand-drawn rounded square, the pencil register of the grid (round
         joins, ~1.7 stroke, no fill — matching Hint/Eraser). The fill-forced act is the partial
         solve: fill only the cells logic forces, not the whole board. -->
    <path
      d="M4.4,3.7 Q3.7,3.8 3.6,4.6 L3.5,19.3 Q3.6,20.2 4.5,20.3 L19.4,20.4 Q20.3,20.3 20.4,19.4 L20.4,4.6 Q20.3,3.7 19.4,3.6 Z"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <!-- The 2×2 rules — one vertical, one horizontal, each a hair wavering. -->
    <path
      d="M12,4 Q11.8,12 12,20"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      fill="none"
    />
    <path
      d="M4,12 Q12,11.8 20,12"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      fill="none"
    />
    <!-- Two forced cells penciled in (top-left + bottom-right); the other two stay open — "fill
         only what's forced." When :playing, each mark draws itself in (the icon echo of the
         board's reveal-wave draw-in), the second a beat behind the first. -->
    <path
      d="M8.4,6.6 L7.1,9.4"
      stroke="currentColor"
      stroke-width="1.9"
      stroke-linecap="round"
      :class="{ 'mark-draw': playing }"
      :style="playing ? { strokeDasharray: 4, strokeDashoffset: 4 } : undefined"
    />
    <path
      d="M16.9,14.6 L15.6,17.4"
      stroke="currentColor"
      stroke-width="1.9"
      stroke-linecap="round"
      :class="{ 'mark-draw': playing }"
      :style="
        playing
          ? { strokeDasharray: 4, strokeDashoffset: 4, animationDelay: '110ms' }
          : undefined
      "
    />
  </svg>
</template>

<style scoped>
/* The forced-fill mark draws itself in — the icon echo of the board's reveal-wave draw-in
   (stroke-dashoffset → 0 on the same 350ms curve SolveIcon's check uses; one grammar). */
.mark-draw {
  animation: markDraw 350ms var(--ease-standard) forwards;
}

@keyframes markDraw {
  from {
    stroke-dashoffset: 4;
  }
  to {
    stroke-dashoffset: 0;
  }
}
</style>

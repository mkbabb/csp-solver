<script setup lang="ts">
import { generateRectBoilFrames } from "@pencil/grid/gridPaths";

defineProps<{ size?: number }>();

/**
 * THE CRAYON STUB (T9-W7 §11) — one filled hand-drawn rectangle, and that is the whole mark.
 *
 * Drawn rather than lettered: a player's name runs 3 to 13 characters over the real dictionary,
 * so a written mark breathes 4× in the head's quietest corner beside a fixed 75.5px `@mbabb`.
 * A rectangle does not. Its seed is 67 — the players well's own washi seed
 * (`GameControlPanel.vue:1042`) — so the head's stub and the well's tag are one hand.
 *
 * POSE 0, ONCE, AT MODULE SCOPE. The icon family's idiom verbatim (`InviteIcon` and its
 * siblings): a static `aria-hidden` SVG in `currentColor` with no stroke, no filter and no beat
 * — so it enters no subscriber and costs the filter census nothing. `frameCount` is 2 because
 * the generator floors there; frame 1 is never asked for.
 */
const D = generateRectBoilFrames(
  2,
  5.5,
  20,
  13,
  { roughness: 0.4, segments: 4, seed: 67, jagged: true },
  0,
  2,
)[0];
</script>

<template>
  <!-- Decorative: the control around it carries the accessible name (a11y r1 M6). -->
  <svg
    aria-hidden="true"
    :width="size ?? 24"
    :height="size ?? 24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path :d="D" fill="currentColor" />
  </svg>
</template>

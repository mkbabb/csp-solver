<script setup lang="ts">
/**
 * SudokuPoster — Sudoku's static carousel face (T4-W12 Wave A).
 *
 * A canned 9×9 givens snapshot on the game-agnostic `PosterBoard` (frozen pose, grain-
 * static once, settled glyphs — zero Worker, zero solver, zero beat enrolment). The card's
 * `poster` loader resolves to this; it is a flank-card still, never the live board.
 */
import PosterBoard from "@games/shared/PosterBoard.vue";

// The canonical worksheet (read row-major, 0 = blank). A recognizable, well-formed 9×9 —
// a photograph of a puzzle, never solved here and never graded.
const GIVENS = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const values: Record<string, number> = {};
GIVENS.forEach((row, r) =>
  row.forEach((v, c) => {
    if (v !== 0) values[String(r * 9 + c)] = v;
  }),
);
</script>

<template>
  <!-- 9×9 with 3×3 bands (subgrid-size 3 → the frame draws the box lines). -->
  <PosterBoard :board-size="9" :subgrid-size="3" :values="values" />
</template>

<script setup lang="ts">
/**
 * SudokuPoster — Sudoku's static carousel face (T4-W12 Wave A).
 *
 * A 9×9 givens snapshot on the game-agnostic `PosterBoard` (frozen pose, grain-static once,
 * settled glyphs — zero Worker, zero solver, zero beat enrolment). The card's `poster` loader
 * resolves to this; it is a flank-card still, never the live board.
 *
 * T8-W3 M12 — THE FACE IS THE BOARD. Handed a `preview`, the still is the board actually saved
 * in this game: its size, its givens, and the user's own marks in the user's own ink. The canned
 * worksheet below is what remains when there is nothing saved, which is the honest picture for a
 * game never played — an example of the game.
 *
 * Sudoku is the boxed family's plain case: no clue furniture at all (`spec.clues` is a stated
 * `null`), so the preview is size and digits and nothing else.
 */
import { computed } from "vue";
import PosterBoard from "@games/shared/PosterBoard.vue";
import type { PreviewBoard } from "@games/shared/useStagingBridge";

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

const canned: Record<string, number> = {};
GIVENS.forEach((row, r) =>
  row.forEach((v, c) => {
    if (v !== 0) canned[String(r * 9 + c)] = v;
  }),
);

const props = defineProps<{ preview?: PreviewBoard | null }>();

/** The BOXED family's arithmetic: the raw selector value is the sub-grid root, so 3 is a 9×9
 *  board with 3×3 bands. The valid rungs are 2/3/4 (4×4 · 9×9 · 16×16). */
const RUNGS = [2, 3, 4];
const live = computed(() => {
  const p = props.preview;
  return p && RUNGS.includes(p.size) ? p : null;
});

const size = computed(() => live.value?.size ?? 3);
const values = computed(() => live.value?.values ?? canned);
const givens = computed(() => live.value?.givenCells);
</script>

<template>
  <!-- Boxed: board side is the sub-grid root squared, and the root IS the band edge (3 → 9×9
       with 3×3 boxes), so the frame draws its box lines at the size the board was left at. -->
  <PosterBoard
    :board-size="size * size"
    :subgrid-size="size"
    :values="values"
    :givens="givens"
  />
</template>

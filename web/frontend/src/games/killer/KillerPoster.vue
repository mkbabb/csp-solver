<script setup lang="ts">
/**
 * KillerPoster — Killer-Sudoku's static carousel face (T4-W13, the a-cards.md pattern).
 *
 * A canned 9×9 snapshot on `PosterBoard` (3×3 bands) + dotted cage boundaries with corner sums,
 * inked via the shared `CageOverlay` over the game's own clue seam (static, PRM-safe, aria-hidden) in the overlay
 * slot. A flank-card still — never the live board.
 */
import PosterBoard from "@games/shared/PosterBoard.vue";
import CageOverlay from "@games/shared/CageOverlay.vue";
import { cageFigures } from "./clue";
import type { KillerCage as KillerCageClue } from "./types";

const N = 9;

// A few givens — Killer reads as mostly-open; the cages carry the puzzle.
const values: Record<string, number> = { "40": 5, "20": 8, "60": 2 };

// Contiguous cages (smallest cell is the corner the sum prints in). A partial partition — a
// still, not a dealt board — spread so horizontal, vertical, and L-shaped cages all read.
const CAGES: KillerCageClue[] = [
  { sum: 15, cells: [0, 1, 9] },
  { sum: 8, cells: [2, 3] },
  { sum: 17, cells: [4, 5, 6] },
  { sum: 9, cells: [7, 8] },
  { sum: 12, cells: [10, 11] },
  { sum: 20, cells: [18, 19, 27] },
  { sum: 14, cells: [72, 73, 74] },
  { sum: 7, cells: [79, 80] },
];
</script>

<template>
  <PosterBoard :board-size="N" :subgrid-size="3" :values="values">
    <template #overlay>
      <CageOverlay
        :cages="cageFigures(CAGES)"
        :board-size="N"
        family="killer"
        :font-size="0.26"
      />
    </template>
  </PosterBoard>
</template>

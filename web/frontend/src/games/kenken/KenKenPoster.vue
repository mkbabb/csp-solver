<script setup lang="ts">
/**
 * KenKenPoster — KenKen / Calcudoku's static carousel face (T4-W13, the a-cards.md pattern).
 *
 * A canned 6×6 snapshot on `PosterBoard` with the BOXLESS Latin geometry (subgrid-size =
 * boardSize → no interior box lines), cages-only (KenKen prints no givens), the operator-cage
 * outlines + `"12×"`-style corner targets inked via the shared `CageOverlay` over the game's own clue seam
 * (static, PRM-safe, aria-hidden) in the overlay slot. A flank-card still — never the live board.
 */
import PosterBoard from "@games/shared/PosterBoard.vue";
import CageOverlay from "@games/shared/CageOverlay.vue";
import { cageFigures } from "./clue";
import type { KenKenCage as KenKenCageClue } from "./types";

const N = 6;

// Cages-only (classic KenKen), a full contiguous partition of the 6×6 — every operator kind
// (+, −, ×, ÷) and a singleton "given" cage all read on the still.
const CAGES: KenKenCageClue[] = [
  { op: "×", target: 12, cells: [0, 1] },
  { op: "+", target: 9, cells: [2, 3, 4] },
  { op: "-", target: 3, cells: [5, 11] },
  { op: "÷", target: 2, cells: [6, 12] },
  { op: "+", target: 8, cells: [7, 8] },
  { op: "×", target: 20, cells: [9, 10] },
  { op: "-", target: 1, cells: [13, 14] },
  { op: "+", target: 11, cells: [15, 16, 17] },
  { op: "+", target: 3, cells: [18] },
  { op: "×", target: 30, cells: [19, 20] },
  { op: "÷", target: 3, cells: [21, 27] },
  { op: "-", target: 2, cells: [22, 23] },
  { op: "×", target: 8, cells: [24, 25] },
  { op: "+", target: 7, cells: [26, 32] },
  { op: "-", target: 4, cells: [28, 29] },
  { op: "+", target: 15, cells: [30, 31] },
  { op: "+", target: 12, cells: [33, 34, 35] },
];
</script>

<template>
  <PosterBoard :board-size="N" :subgrid-size="N" :values="{}">
    <template #overlay>
      <CageOverlay
        :cages="cageFigures(CAGES)"
        :board-size="N"
        family="kenken"
        :font-size="0.24"
      />
    </template>
  </PosterBoard>
</template>

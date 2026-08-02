<script setup lang="ts">
/**
 * ThermoPoster — Thermo-Sudoku's static carousel face (T4-W13, the a-cards.md pattern).
 *
 * A canned 9×9 snapshot on the game-agnostic `PosterBoard` (3×3 bands) + a few thermometers
 * inked over it via the game's own `ThermoTube` furniture (static, PRM-safe, aria-hidden) in
 * the overlay slot. A flank-card still — never the live board (no Worker, no solver, no beat).
 */
import PosterBoard from "@games/shared/PosterBoard.vue";
import ThermoTube from "./ThermoTube.vue";
import type { ThermoLine } from "./types";

const N = 9;

// A sparse recognizable worksheet (thermos do the work, so few givens); row-major pos → value.
const values: Record<string, number> = {
  "4": 7,
  "13": 9,
  "22": 6,
  "40": 5,
  "58": 2,
  "76": 7,
};

// Thermometers on orthogonally-adjacent ascending runs (bulb → tip cell indices) — spread so
// horizontal and vertical tubes both read on the still.
const THERMOMETERS: ThermoLine[] = [
  [0, 1, 2, 3],
  [9, 18, 27],
  [80, 79, 78, 77],
  [42, 43, 44],
  [36, 45, 54],
];
</script>

<template>
  <PosterBoard :board-size="N" :subgrid-size="3" :values="values">
    <template #overlay>
      <ThermoTube :thermometers="THERMOMETERS" :board-size="N" />
    </template>
  </PosterBoard>
</template>

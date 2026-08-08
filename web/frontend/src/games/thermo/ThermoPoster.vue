<script setup lang="ts">
/**
 * ThermoPoster — Thermo-Sudoku's static carousel face (T4-W13, the a-cards.md pattern).
 *
 * A 9×9 snapshot on the game-agnostic `PosterBoard` (3×3 bands) + thermometers inked over it
 * via the game's own `ThermoTube` furniture (static, PRM-safe, aria-hidden) in the overlay slot.
 * A flank-card still — never the live board (no Worker, no solver, no beat).
 *
 * T8-W3 M12 — handed a `preview`, the still is the board actually saved here: its size, its
 * digits, and ITS OWN THERMOMETERS. The furniture travels with the preview because a thermo
 * board under someone else's tubes is a worse lie than the canned face — it is a picture of a
 * puzzle that does not exist. So the clue is type-guarded, and a shape that does not hold sends
 * the whole still back to the canned worksheet rather than half of one.
 */
import { computed } from "vue";
import PosterBoard from "@games/shared/PosterBoard.vue";
import ThermoTube from "./ThermoTube.vue";
import type { PreviewBoard } from "@games/shared/useStagingBridge";
import type { ThermoLine } from "./types";

const N = 9;

// A sparse recognizable worksheet (thermos do the work, so few givens); row-major pos → value.
const canned: Record<string, number> = {
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

const props = defineProps<{ preview?: PreviewBoard | null }>();

/** BOXED: the raw selector value is the sub-grid root (3 → 9×9 with 3×3 bands); rungs 2/3/4. */
const RUNGS = [2, 3, 4];

/** A tube is a run of in-range cell indices. Untrusted shape, guarded at the edge — the same
 *  fail-closed discipline the permalink codec runs on a decoded clue. */
function tubesFor(clue: unknown, cells: number): ThermoLine[] | null {
  if (!Array.isArray(clue)) return null;
  const ok = clue.every(
    (t) =>
      Array.isArray(t) &&
      t.length > 1 &&
      t.every((n) => Number.isInteger(n) && n >= 0 && n < cells),
  );
  return ok ? (clue as ThermoLine[]) : null;
}

const live = computed(() => {
  const p = props.preview;
  if (!p || !RUNGS.includes(p.size)) return null;
  const side = p.size * p.size;
  const tubes = tubesFor(p.saved.thermometers, side * side);
  return tubes ? { preview: p, side, tubes } : null;
});

const size = computed(() => live.value?.side ?? N);
const subgrid = computed(() => live.value?.preview.size ?? 3);
const values = computed(() => live.value?.preview.values ?? canned);
const givens = computed(() => live.value?.preview.givenCells);
/** T8-R13 — whose hand wrote each cell, carried straight through to the shared floor. */
const authorInk = computed(() => live.value?.preview.authorInk);
const thermometers = computed(() => live.value?.tubes ?? THERMOMETERS);
</script>

<template>
  <PosterBoard
    :board-size="size"
    :subgrid-size="subgrid"
    :values="values"
    :givens="givens"
    :author-ink="authorInk"
  >
    <template #overlay>
      <ThermoTube :thermometers="thermometers" :board-size="size" />
    </template>
  </PosterBoard>
</template>

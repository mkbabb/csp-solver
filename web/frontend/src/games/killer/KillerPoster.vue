<script setup lang="ts">
/**
 * KillerPoster — Killer-Sudoku's static carousel face (T4-W13, the a-cards.md pattern).
 *
 * A 9×9 snapshot on `PosterBoard` (3×3 bands) + dotted cage boundaries with corner sums, inked
 * via the shared `CageOverlay` over the game's own clue seam (static, PRM-safe, aria-hidden) in
 * the overlay slot. A flank-card still — never the live board.
 *
 * T8-W3 M12 — handed a `preview`, the still is the board actually saved here, cages and all.
 * The cages travel with it: half-solved cages ARE what the owner is asking to see in the deck
 * before committing, and real digits inside canned cages would be a picture of no puzzle at
 * all. Type-guarded, and a shape that does not hold falls back to the canned worksheet whole.
 */
import { computed } from "vue";
import PosterBoard from "@games/shared/PosterBoard.vue";
import CageOverlay from "@games/shared/CageOverlay.vue";
import type { PreviewBoard } from "@games/shared/useStagingBridge";
import { cageFigures } from "./clue";
import type { KillerCage as KillerCageClue } from "./types";

const N = 9;

// A few givens — Killer reads as mostly-open; the cages carry the puzzle.
const canned: Record<string, number> = { "40": 5, "20": 8, "60": 2 };

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

const props = defineProps<{ preview?: PreviewBoard | null }>();

/** BOXED: the raw selector value is the sub-grid root (3 → 9×9 with 3×3 bands); rungs 2/3/4. */
const RUNGS = [2, 3, 4];

/** A cage is a sum over in-range cells. Untrusted shape, guarded at the edge. */
function cagesFor(clue: unknown, cells: number): KillerCageClue[] | null {
  if (!Array.isArray(clue)) return null;
  const ok = clue.every(
    (c: unknown) =>
      !!c &&
      typeof (c as KillerCageClue).sum === "number" &&
      Array.isArray((c as KillerCageClue).cells) &&
      (c as KillerCageClue).cells.length > 0 &&
      (c as KillerCageClue).cells.every(
        (n) => Number.isInteger(n) && n >= 0 && n < cells,
      ),
  );
  return ok ? (clue as KillerCageClue[]) : null;
}

const live = computed(() => {
  const p = props.preview;
  if (!p || !RUNGS.includes(p.size)) return null;
  const side = p.size * p.size;
  const cages = cagesFor(p.saved.cages, side * side);
  return cages ? { preview: p, side, cages } : null;
});

const size = computed(() => live.value?.side ?? N);
const subgrid = computed(() => live.value?.preview.size ?? 3);
const values = computed(() => live.value?.preview.values ?? canned);
const givens = computed(() => live.value?.preview.givenCells);
/** T8-R13 — whose hand wrote each cell, carried straight through to the shared floor. */
const authorInk = computed(() => live.value?.preview.authorInk);
const cages = computed(() => cageFigures(live.value?.cages ?? CAGES));
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
      <CageOverlay
        :cages="cages"
        :board-size="size"
        family="killer"
        :font-size="0.26"
      />
    </template>
  </PosterBoard>
</template>

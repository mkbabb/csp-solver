<script setup lang="ts">
/**
 * KenKenPoster — KenKen / Calcudoku's static carousel face (T4-W13, the a-cards.md pattern).
 *
 * A 6×6 snapshot on `PosterBoard` with the BOXLESS Latin geometry (subgrid-size = boardSize →
 * no interior box lines), the operator-cage outlines + `"12×"`-style corner targets inked via
 * the shared `CageOverlay` over the game's own clue seam (static, PRM-safe, aria-hidden) in the
 * overlay slot. A flank-card still — never the live board.
 *
 * T8-W3 M12 — handed a `preview`, the still is the board actually saved here. KenKen prints no
 * givens at all, so on this game the preview's digits are ENTIRELY the user's own marks: the
 * one card in the deck whose true still is nothing but your own handwriting.
 */
import { computed } from "vue";
import PosterBoard from "@games/shared/PosterBoard.vue";
import CageOverlay from "@games/shared/CageOverlay.vue";
import type { PreviewBoard } from "@games/shared/useStagingBridge";
import { cageFigures } from "./clue";
import type { KenKenCage as KenKenCageClue, KenKenOp } from "./types";

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

const props = defineProps<{ preview?: PreviewBoard | null }>();

/** CAGED LATIN: the raw selector value IS the board side; the band is 4/5/6. */
const RUNGS = [4, 5, 6];
const OPS: readonly string[] = ["+", "-", "×", "÷"];

/** A cage is an operator, a target, and in-range cells. Untrusted shape, guarded at the edge —
 *  the operator especially: an ordinal outside the four is exactly what the permalink's
 *  round-trip guard exists to refuse, and the overlay would print it verbatim. */
function cagesFor(clue: unknown, cells: number): KenKenCageClue[] | null {
  if (!Array.isArray(clue)) return null;
  const ok = clue.every((c: unknown) => {
    const cage = c as KenKenCageClue;
    return (
      !!c &&
      OPS.includes(cage.op as KenKenOp) &&
      typeof cage.target === "number" &&
      Array.isArray(cage.cells) &&
      cage.cells.length > 0 &&
      cage.cells.every((n) => Number.isInteger(n) && n >= 0 && n < cells)
    );
  });
  return ok ? (clue as KenKenCageClue[]) : null;
}

const live = computed(() => {
  const p = props.preview;
  if (!p || !RUNGS.includes(p.size)) return null;
  const cages = cagesFor(p.saved.cages, p.size * p.size);
  return cages ? { preview: p, cages } : null;
});

const size = computed(() => live.value?.preview.size ?? N);
const values = computed(() => live.value?.preview.values ?? {});
const givens = computed(() => live.value?.preview.givenCells);
const cages = computed(() => cageFigures(live.value?.cages ?? CAGES));
</script>

<template>
  <PosterBoard
    :board-size="size"
    :subgrid-size="size"
    :values="values"
    :givens="givens"
  >
    <template #overlay>
      <CageOverlay
        :cages="cages"
        :board-size="size"
        family="kenken"
        :font-size="0.24"
      />
    </template>
  </PosterBoard>
</template>

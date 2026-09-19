<script setup lang="ts">
/**
 * PlaceChart — THE BOARD, DRAWN AT 96px, WITH THE ROOM ON IT (T9-W7 PLR-PLACE §3.2).
 *
 * The board's own frame and box rules at pose 0, a filled dot per peer at the cell they have
 * SETTLED on, and a ring at yours. Geometry and nothing else: `generateGridBoilFrames` hands
 * back the same paths `HandDrawnGrid` draws the real board with, the grain is already baked
 * into them, and pose 0 enrols no beat — so this mints zero live filters (π: `filterBudget`
 * stays 9, measured with the chart open).
 *
 * WHY 96 AND NOT 24. The same inks read 5.45–6.11:1 light and 9.52–10.63:1 dark here, against
 * 2.35–2.69:1 at 24px on both light grounds in both engines; the frame reads 9.65–19.45:1
 * against 1.52:1. The failure at 24 was SIZE, not colour, and the cell lines are the proof —
 * they are 0.48 px of stroke even here, so they are not drawn. What a reader gets is the box
 * grid: nine rooms, and who is working in which.
 *
 * ATTRIBUTION IS CLAIMED TO FOUR. Past the fourth peer the walk's own separation is 12.5° and
 * a reader cannot say "that dot is heron" without counting; so past four this is a picture of
 * where the room is working and the rows beneath it are who is in it. The one join that costs
 * nothing is kept: a row's swatch IS this dot, same radius, same ink.
 */
import { computed } from "vue";
import { generateGridBoilFrames } from "@pencil/grid/gridPaths";

const props = defineProps<{
  /** the board's side — 9 or 16 */
  size: number;
  /** the box root — 3 on a 9×9, 4 on a 16×16, the side itself on a Latin board */
  subgrid: number;
  /** a peer per settled cell, in the ink their digits are written in */
  peers: { id: string; ink: string; pos: number }[];
  /** your own cell, or `null` — looked away, or your cell is hidden */
  self: number | null;
}>();

/** The board's own coordinate system, and the chart's side in CSS px. */
const VIEWBOX = 1000;
const SIDE = 96;
/** viewBox units per painted CSS px — every stroke and radius below is written in px × this. */
const U = VIEWBOX / SIDE;

const grid = computed(() => generateGridBoilFrames(props.size, props.subgrid, VIEWBOX));
const pitch = computed(() => VIEWBOX / props.size);
const at = (pos: number) => ({
  cx: ((pos % props.size) + 0.5) * pitch.value,
  cy: (Math.floor(pos / props.size) + 0.5) * pitch.value,
});
/** 4px on a 9×9 (0.375 of the 10.67px pitch); 2.5px on a 16×16, whose pitch is 6px. */
const dotR = computed(() => (props.size > 9 ? 2.5 : 4) * U);
</script>

<template>
  <!-- aria-hidden: the log already speaks every arrival, W3 speaks "looked away" and the cell
       names, and the rows below are the readable list. A picture of positions read aloud cell
       by cell would be a fourth live region saying what three already say. -->
  <svg
    class="place-chart"
    :viewBox="`0 0 ${VIEWBOX} ${VIEWBOX}`"
    :width="SIDE"
    :height="SIDE"
    aria-hidden="true"
    focusable="false"
  >
    <path
      class="chart-frame"
      :d="grid.frame[0]"
      fill="none"
      :stroke-width="2 * U"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
    <path
      v-for="(line, i) in grid.subgridLines"
      :key="i"
      class="chart-rule"
      :d="line[0]"
      fill="none"
      :stroke-width="1.25 * U"
      stroke-linecap="round"
    />
    <circle
      v-for="p in peers"
      :key="p.id"
      class="chart-dot"
      :cx="at(p.pos).cx"
      :cy="at(p.pos).cy"
      :r="dotR"
      :fill="p.ink"
    />
    <!-- YOU ARE A RING, which is the estate's own peer-cursor idiom (gameCell.css:229-241)
         re-used rather than a second convention: "which one is me" costs no hue, so it costs
         nothing when the walk puts a peer 12.5° from your blue. -->
    <circle
      v-if="self !== null"
      class="chart-self"
      :cx="at(self).cx"
      :cy="at(self).cy"
      :r="dotR"
      fill="none"
      :stroke-width="1.5 * U"
    />
  </svg>
</template>

<style scoped>
.place-chart {
  display: block;
  overflow: visible;
}

.chart-frame {
  stroke: var(--color-pencil-graphite);
  stroke-opacity: 0.95;
}

.chart-rule {
  stroke: var(--ink-press-rule);
}

/* NO TRANSITION ON A DOT, anywhere. The dot STEPS: `cx`/`cy` are swapped when the peer's
   `cur` has held one cell for `WASH.placeSettleMs`, and a step has nothing to reduce — the
   PRM form and the shipped form are the same form. */
.chart-self {
  stroke: var(--color-user-ink);
}
</style>

<script setup lang="ts">
/**
 * PlaceChart — THE BOARD, WITH THE ROOM ON IT (T9-W7 PLR-PLACE §3.3).
 *
 * The board's own frame and box rules at pose 0, a filled dot per peer at the cell they have
 * SETTLED on, and a ring at yours. Geometry and nothing else: `generateGridBoilFrames` hands
 * back the same paths `HandDrawnGrid` draws the real board with, the grain is already baked
 * into them, and pose 0 enrols no beat — so this mints zero live filters (π: `filterBudget`
 * stays 9, measured with the chart open).
 *
 * THE PITCH IS HELD, NOT THE BOX (pass 2). Pass 1 fixed the chart at 96px and let the pitch
 * fall out of it, which put a 16×16 board's dots 1.0px apart — a density picture, not a seating
 * chart, and this family is a seating chart or nothing. So the CELL is the constant: 10.667 CSS
 * px of pitch at every size, a dot of r 4 (8.00px across) and 2.667px of gap between two
 * neighbours' dots, whatever the board. The chart is then 42.7 at 4×4, 96 at 9×9 and 170.7 at
 * 16×16 — and the 16×16's extra 74.7px of height is paid and declared, not hidden.
 *
 * WHY NOT 24px AT ALL. The same inks read 5.23–6.11:1 light and 9.52–10.63:1 dark here, against
 * 2.35–2.69:1 at 24px on both light grounds in both engines; the frame reads 12.48 against
 * 1.52. The failure at 24 was SIZE, not colour, and the cell lines are the proof — they are
 * 0.48px of stroke even here, so they are not drawn. What a reader gets is the box grid.
 */
import { computed } from "vue";
import { generateGridBoilFrames } from "@pencil/grid/gridPaths";

const props = defineProps<{
  /** the board's side — 4, 9 or 16 */
  size: number;
  /** the box root — 3 on a 9×9, 4 on a 16×16, the side itself on a Latin board */
  subgrid: number;
  /** a peer per settled cell, in the ink their digits are written in; a peer with no ink is
   *  not in this list at all (BoardHost's law: an unknown author gets no colour) */
  peers: { id: string; ink: string; pos: number }[];
  /** your own cell, or `null` — no cell touched yet, or your cell is hidden */
  self: number | null;
  /** the peer id whose row the reader is pointing at, or `null` — the query */
  queried: string | null;
}>();

/** The board's own coordinate system. */
const VIEWBOX = 1000;
/** THE ONE CONSTANT: CSS px per cell. 8.00 of dot + 2.667 of gap. */
const PITCH = 32 / 3;
const side = computed(() => PITCH * props.size);
/** viewBox units per painted CSS px — every stroke and radius below is written in px × this. */
const U = computed(() => VIEWBOX / side.value);

const grid = computed(() => generateGridBoilFrames(props.size, props.subgrid, VIEWBOX));
const cell = computed(() => VIEWBOX / props.size);
const at = (pos: number) => ({
  cx: ((pos % props.size) + 0.5) * cell.value,
  cy: (Math.floor(pos / props.size) + 0.5) * cell.value,
});
/** r 4 CSS px at EVERY size — the pitch is what changed, so this never has to. */
const dotR = computed(() => 4 * U.value);
</script>

<template>
  <!-- aria-hidden: the log already speaks every arrival, W3 speaks "looked away" and the cell
       names, and the rows below are the readable list. A picture of positions read aloud cell
       by cell would be a fourth live region saying what three already say. -->
  <svg
    class="place-chart"
    :viewBox="`0 0 ${VIEWBOX} ${VIEWBOX}`"
    :width="side"
    :height="side"
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
      :class="{ 'is-dimmed': queried !== null && queried !== p.id }"
      :data-peer="p.id"
      :cx="at(p.pos).cx"
      :cy="at(p.pos).cy"
      :r="dotR"
      :fill="p.ink"
    />
    <!-- YOU ARE A RING, which is the estate's own peer-cursor idiom (gameCell.css:229-241)
         re-used rather than a second convention: "which one is me" costs no hue, so it costs
         nothing when the walk puts a peer 12.5° from your blue. Stroke 2, not 1.5: 1.5px read
         3.18:1 on the phone ground, inside the noise, and 2 is `HandDrawnOutline`'s keep. -->
    <circle
      v-if="self !== null"
      class="chart-self"
      :cx="at(self).cx"
      :cy="at(self).cy"
      :r="dotR"
      fill="none"
      :stroke-width="2 * U"
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

/* THE QUERY, and it is one CSS state (R6 law 14, one affordance). Pointing at a row does not
   move a dot, recolour a dot or add a label to a dot: it takes the PRESSURE off the others, the
   way the rule ink already means "quieter" everywhere else in this estate. Same-frame — there
   is no transition here, because a dim is an answer to a pointer and an answer must not lag. */
.chart-dot.is-dimmed {
  opacity: 0.55;
}

/* NO TRANSITION ON A DOT, anywhere. The dot STEPS: `cx`/`cy` are swapped when the peer's
   `cur` has held one cell for `WASH.placeSettleMs`, and a step has nothing to reduce — the
   PRM form and the shipped form are the same form. */
.chart-self {
  stroke: var(--color-user-ink);
}
</style>

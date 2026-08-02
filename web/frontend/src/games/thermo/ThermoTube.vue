<script setup lang="ts">
/**
 * The Thermo-Sudoku clue furniture — bulb + tube, drawn in the pencil idiom.
 *
 * A thermometer is a bulb (a filled disc at the smallest-value cell) with a tube running
 * bulb → tip through orthogonally-adjacent cell centres; the puzzle's rule is that values
 * strictly increase along the tube. This overlay renders the WHOLE thermometer set as ONE
 * SVG laid over the board's cell grid (a sibling of the cells, in the `#overlay` slot, the
 * same layer the shared `CageOverlay` rides) — the clue seam hands it the live
 * `thermometers` + `boardSize`, nothing else.
 *
 * T5-W2 F2: this IS `thermoSpec.clues.overlay` — `BoardHost` mounts it straight into
 * `#overlay`, so the `.thermo-clue-layer` wrapper `ThermoBoard` used to draw around it is
 * gone with that adapter. The wrapper carried nothing this SVG's own root does not already
 * carry (`position:absolute; inset:0; z-index:1; pointer-events:none`, `aria-hidden`), so
 * its two rules re-home here and the layer loses a node without moving a pixel.
 *
 * House register:
 *  - **Hand-drawn**, not ruler-straight — each vertex carries a tiny DETERMINISTIC jitter
 *    (seeded by the cell index), so the tube reads as pencil, and the jitter is STATIC
 *    (never animated), so it is PRM-safe by construction (no reduced-motion branch needed).
 *  - **Both themes** — the ink is a graphite `currentColor` set light/dark in scoped CSS.
 *  - **Decorative to AT** (`aria-hidden`): the thermometer constraint is the puzzle's, read
 *    by the board's own labelling, never announced as a bare glyph.
 */
import { computed } from "vue";
import type { ThermoLine } from "./types";

const props = defineProps<{
  /** The board's thermometer furniture — bulb → tip cell-index paths. */
  thermometers: ThermoLine[];
  /** Board side length (cells per row). The SVG viewBox is `boardSize × boardSize`. */
  boardSize: number;
}>();

/** A small, stable per-cell jitter so vertices sit off the exact grid centre (pencil feel). */
function jitter(cell: number, axis: number): number {
  const h = Math.sin(cell * 12.9898 + axis * 78.233) * 43758.5453;
  return (h - Math.floor(h) - 0.5) * 0.11; // ±0.055 of a cell
}

interface Tube {
  bulbCx: number;
  bulbCy: number;
  path: string;
}

const tubes = computed<Tube[]>(() => {
  const n = props.boardSize;
  return props.thermometers
    .filter((t) => t.length >= 2)
    .map((line) => {
      const pts = line.map((cell) => {
        const col = cell % n;
        const row = Math.floor(cell / n);
        return {
          x: col + 0.5 + jitter(cell, 0),
          y: row + 0.5 + jitter(cell, 1),
        };
      });
      const path = pts
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(3)},${p.y.toFixed(3)}`)
        .join(" ");
      return { bulbCx: pts[0].x, bulbCy: pts[0].y, path };
    });
});
</script>

<template>
  <svg
    class="thermo-tube-overlay"
    :viewBox="`0 0 ${boardSize} ${boardSize}`"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <g v-for="(tube, i) in tubes" :key="i" class="thermo-tube">
      <!-- The tube: a fat rounded stroke bulb → tip. -->
      <path
        :d="tube.path"
        class="thermo-tube-stroke"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke-width="0.28"
      />
      <!-- The bulb: a filled disc at the smallest-value cell (the reservoir). -->
      <circle :cx="tube.bulbCx" :cy="tube.bulbCy" :r="0.26" class="thermo-bulb" />
    </g>
  </svg>
</template>

<style scoped>
/* Overlay the board's cell grid exactly (the square wrapper is position:relative). Below
   the interactive cells' hit area — the tube is decorative, the digits are the game. */
.thermo-tube-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
}

/* F6 beat 1 (T3-W10) — the tube furniture leaves with the grid: opacity-only, 200ms,
   easeInCubic (the erase family). `.board-leaving` is `GameBoard`'s board-shell, an ancestor
   carrying this component's scope through the child-root; the selector moved off the retired
   `.thermo-clue-layer` wrapper onto this SVG, same property, same beat. Inert on the poster,
   which has no leaving state. */
@media (prefers-reduced-motion: no-preference) {
  .board-leaving .thermo-tube-overlay {
    opacity: 0;
    transition: opacity 200ms var(--ease-fadeOut);
  }
}

/* Graphite ink — the pencil register, dialled per theme. Light: a soft graphite; dark: a
   lifted graphite so the tube reads over the dark card without shouting. */
.thermo-tube-stroke {
  stroke: var(--thermo-ink, rgba(60, 64, 72, 0.32));
}
.thermo-bulb {
  fill: var(--thermo-ink, rgba(60, 64, 72, 0.32));
}

@media (prefers-color-scheme: dark) {
  .thermo-tube-stroke {
    stroke: var(--thermo-ink, rgba(198, 204, 214, 0.28));
  }
  .thermo-bulb {
    fill: var(--thermo-ink, rgba(198, 204, 214, 0.28));
  }
}

:root[data-theme="light"] .thermo-tube-stroke {
  stroke: var(--thermo-ink, rgba(60, 64, 72, 0.32));
}
:root[data-theme="light"] .thermo-bulb {
  fill: var(--thermo-ink, rgba(60, 64, 72, 0.32));
}
:root[data-theme="dark"] .thermo-tube-stroke {
  stroke: var(--thermo-ink, rgba(198, 204, 214, 0.28));
}
:root[data-theme="dark"] .thermo-bulb {
  fill: var(--thermo-ink, rgba(198, 204, 214, 0.28));
}
</style>

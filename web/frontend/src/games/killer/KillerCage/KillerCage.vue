<script setup lang="ts">
/**
 * The Killer-Sudoku clue furniture — dotted cage boundaries + a tiny corner sum, drawn in
 * the pencil idiom.
 *
 * A cage is a contiguous group of cells that are all-different and sum to a printed target.
 * This overlay renders the WHOLE cage set as ONE SVG laid over the board's cell grid (a
 * sibling of the cells, in the `#overlay` slot — the same layer Futoshiki's caret and
 * Thermo's tube ride): each cage gets a DOTTED boundary hugging the inside of its cells,
 * and its sum printed small in the cage's top-left corner cell. The board hands it the live
 * `cages` + `boardSize`, nothing else.
 *
 * House register:
 *  - **Hand-drawn**, not CAD — the boundary reads as pencil: an inset DOTTED stroke whose
 *    every vertex carries a tiny DETERMINISTIC jitter (seeded by the boundary-corner grid
 *    coordinate, so a cell's own segments meet at their shared corner). The jitter is STATIC
 *    (never animated), so it is PRM-safe by construction (no reduced-motion branch needed).
 *  - **Both themes** — the ink is a graphite `currentColor` set light/dark in scoped CSS.
 *  - **Decorative to AT** (`aria-hidden`): the cage constraint is the puzzle's, read by the
 *    board's own labelling, never announced as a bare glyph.
 */
import { computed } from "vue";
import type { KillerCage } from "../types";

const props = defineProps<{
  /** The board's cage furniture — contiguous all-different sum-cages. */
  cages: KillerCage[];
  /** Board side length (cells per row). The SVG viewBox is `boardSize × boardSize`. */
  boardSize: number;
}>();

/** The inset of the dotted boundary from the true cell edge (grid units). */
const INSET = 0.09;

/** A small, stable jitter at a boundary corner so the dotted outline sits off the exact
 *  grid line (pencil feel). Seeded by the corner's grid coordinate, so the two segments
 *  meeting at a corner jitter it identically and still touch. */
function jitter(gx: number, gy: number, axis: number): number {
  const h = Math.sin(gx * 34.221 + gy * 71.917 + axis * 12.37) * 24634.113;
  return (h - Math.floor(h) - 0.5) * 0.05; // ±0.025 of a cell
}

interface CageRender {
  /** The dotted boundary as one path string (inset per-cell edges on cage borders). */
  boundary: string;
  /** The corner sum label. */
  labelX: number;
  labelY: number;
  sum: number;
}

const rendered = computed<CageRender[]>(() => {
  const n = props.boardSize;
  return props.cages
    .filter((cage) => cage.cells.length > 0)
    .map((cage) => {
      const inCage = new Set(cage.cells);
      const segs: string[] = [];

      const seg = (ax: number, ay: number, bx: number, by: number) => {
        const a = { x: ax + jitter(ax, ay, 0), y: ay + jitter(ax, ay, 1) };
        const b = { x: bx + jitter(bx, by, 0), y: by + jitter(bx, by, 1) };
        segs.push(
          `M${a.x.toFixed(3)},${a.y.toFixed(3)} L${b.x.toFixed(3)},${b.y.toFixed(3)}`,
        );
      };

      for (const cell of cage.cells) {
        const col = cell % n;
        const row = Math.floor(cell / n);
        const l = col + INSET;
        const r = col + 1 - INSET;
        const t = row + INSET;
        const bt = row + 1 - INSET;

        // A side is a cage border when the neighbour across it is off-grid or in a
        // different cage. Draw the inset dotted edge along it.
        if (row === 0 || !inCage.has(cell - n)) seg(l, t, r, t); // top
        if (row === n - 1 || !inCage.has(cell + n)) seg(l, bt, r, bt); // bottom
        if (col === 0 || !inCage.has(cell - 1)) seg(l, t, l, bt); // left
        if (col === n - 1 || !inCage.has(cell + 1)) seg(r, t, r, bt); // right
      }

      // The sum prints in the cage's corner cell — the smallest flat index (top-left-most).
      const corner = Math.min(...cage.cells);
      const cCol = corner % n;
      const cRow = Math.floor(corner / n);

      return {
        boundary: segs.join(" "),
        labelX: cCol + INSET + 0.06,
        labelY: cRow + INSET + 0.24,
        sum: cage.sum,
      };
    });
});
</script>

<template>
  <svg
    class="killer-cage-overlay"
    :viewBox="`0 0 ${boardSize} ${boardSize}`"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <g v-for="(cage, i) in rendered" :key="i" class="killer-cage">
      <!-- The dotted, inset, hand-drawn cage boundary. -->
      <path
        :d="cage.boundary"
        class="killer-cage-boundary"
        fill="none"
        stroke-linecap="round"
        :stroke-width="0.03"
        :stroke-dasharray="'0.015 0.075'"
      />
      <!-- The tiny corner sum. -->
      <text
        :x="cage.labelX"
        :y="cage.labelY"
        class="killer-cage-sum"
        :font-size="0.26"
        text-anchor="start"
      >
        {{ cage.sum }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
/* Overlay the board's cell grid exactly (the square wrapper is position:relative). Below
   the interactive cells' hit area — the cage furniture is decorative, the digits are the
   game. */
.killer-cage-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
}

/* Graphite ink — the pencil register, dialled per theme. Light: a soft graphite; dark: a
   lifted graphite so the boundary reads over the dark card without shouting. */
.killer-cage-boundary {
  stroke: var(--killer-ink, rgba(60, 64, 72, 0.5));
}
.killer-cage-sum {
  fill: var(--killer-ink-strong, rgba(52, 56, 64, 0.72));
  font-family: var(--font-hand, "Caveat", ui-rounded, system-ui, sans-serif);
  font-weight: 600;
  /* preserveAspectRatio="none" over a square viewBox + square container keeps 1:1, so the
     glyph is not distorted; a non-scaling paint keeps the hairline crisp at any board px. */
  paint-order: stroke;
}

@media (prefers-color-scheme: dark) {
  .killer-cage-boundary {
    stroke: var(--killer-ink, rgba(198, 204, 214, 0.42));
  }
  .killer-cage-sum {
    fill: var(--killer-ink-strong, rgba(214, 220, 230, 0.78));
  }
}

:root[data-theme="light"] .killer-cage-boundary {
  stroke: var(--killer-ink, rgba(60, 64, 72, 0.5));
}
:root[data-theme="light"] .killer-cage-sum {
  fill: var(--killer-ink-strong, rgba(52, 56, 64, 0.72));
}
:root[data-theme="dark"] .killer-cage-boundary {
  stroke: var(--killer-ink, rgba(198, 204, 214, 0.42));
}
:root[data-theme="dark"] .killer-cage-sum {
  fill: var(--killer-ink-strong, rgba(214, 220, 230, 0.78));
}
</style>

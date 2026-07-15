<script setup lang="ts">
/**
 * The KenKen / Calcudoku clue furniture — hand-drawn cage outlines + a tiny corner target
 * label (`"12×"`, `"3−"`, `"2÷"`, `"5+"`), drawn in the pencil idiom over the BOXLESS Latin
 * grid.
 *
 * A cage is a contiguous group of cells carrying an operator and a target the cells produce.
 * This overlay renders the WHOLE cage set as ONE SVG laid over the board's cell grid (a
 * sibling of the cells, in the `#overlay` slot — the same layer Futoshiki's caret, Thermo's
 * tube, and Killer's cage ride): each cage gets a DOTTED boundary hugging the inside of its
 * cells, and its target (with the operator glyph) printed small in the cage's top-left corner
 * cell. A singleton "given" cage prints just its number (no operator). The board hands it the
 * live `cages` + `boardSize`, nothing else — no sub-grid box lines (the new KenKen geometry).
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
import type { KenKenCage } from "../types";

const props = defineProps<{
  /** The board's operator-cage furniture. */
  cages: KenKenCage[];
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
  /** The corner label (target + operator glyph; bare target for a singleton). */
  labelX: number;
  labelY: number;
  label: string;
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

      // The label prints in the cage's corner cell — the smallest flat index (top-left-most).
      // A singleton is a bare given number; every other cage carries its operator glyph.
      const corner = Math.min(...cage.cells);
      const cCol = corner % n;
      const cRow = Math.floor(corner / n);
      const label =
        cage.cells.length === 1 ? String(cage.target) : `${cage.target}${cage.op}`;

      return {
        boundary: segs.join(" "),
        labelX: cCol + INSET + 0.06,
        labelY: cRow + INSET + 0.24,
        label,
      };
    });
});
</script>

<template>
  <svg
    class="kenken-cage-overlay"
    :viewBox="`0 0 ${boardSize} ${boardSize}`"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <g v-for="(cage, i) in rendered" :key="i" class="kenken-cage">
      <!-- The dotted, inset, hand-drawn cage boundary. -->
      <path
        :d="cage.boundary"
        class="kenken-cage-boundary"
        fill="none"
        stroke-linecap="round"
        :stroke-width="0.03"
        :stroke-dasharray="'0.015 0.075'"
      />
      <!-- The tiny corner target (with its operator glyph). -->
      <text
        :x="cage.labelX"
        :y="cage.labelY"
        class="kenken-cage-target"
        :font-size="0.24"
        text-anchor="start"
      >
        {{ cage.label }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
/* Overlay the board's cell grid exactly (the square wrapper is position:relative). Below
   the interactive cells' hit area — the cage furniture is decorative, the digits are the
   game. */
.kenken-cage-overlay {
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
.kenken-cage-boundary {
  stroke: var(--kenken-ink, rgba(60, 64, 72, 0.5));
}
.kenken-cage-target {
  fill: var(--kenken-ink-strong, rgba(52, 56, 64, 0.72));
  font-family: var(--font-hand, "Caveat", ui-rounded, system-ui, sans-serif);
  font-weight: 600;
  /* preserveAspectRatio="none" over a square viewBox + square container keeps 1:1, so the
     glyph is not distorted; a non-scaling paint keeps the hairline crisp at any board px. */
  paint-order: stroke;
}

@media (prefers-color-scheme: dark) {
  .kenken-cage-boundary {
    stroke: var(--kenken-ink, rgba(198, 204, 214, 0.42));
  }
  .kenken-cage-target {
    fill: var(--kenken-ink-strong, rgba(214, 220, 230, 0.78));
  }
}

:root[data-theme="light"] .kenken-cage-boundary {
  stroke: var(--kenken-ink, rgba(60, 64, 72, 0.5));
}
:root[data-theme="light"] .kenken-cage-target {
  fill: var(--kenken-ink-strong, rgba(52, 56, 64, 0.72));
}
:root[data-theme="dark"] .kenken-cage-boundary {
  stroke: var(--kenken-ink, rgba(198, 204, 214, 0.42));
}
:root[data-theme="dark"] .kenken-cage-target {
  fill: var(--kenken-ink-strong, rgba(214, 220, 230, 0.78));
}
</style>

<script setup lang="ts">
/**
 * CageOverlay — THE cage furniture. One module, both cage games (T5-W2 2.1).
 *
 * `KillerCage` and `KenKenCage` drew the identical figure: a DOTTED, inset, hand-drawn
 * boundary hugging the inside of a contiguous cell group, plus one tiny label in the group's
 * top-left corner cell. Their whole divergence was the label's TEXT (a sum vs a target with
 * an operator glyph), its font size, and the class prefix. The first is now a string the
 * caller computes — the label is the clue's own vocabulary, so the clue seam owns it — and
 * the other two are props.
 *
 * The overlay renders the WHOLE cage set as ONE SVG laid over the board's cell grid (a
 * sibling of the cells, in the `#overlay` slot — the same layer Futoshiki's caret and
 * Thermo's tube ride). The board hands it the live cages + `boardSize`, nothing else.
 *
 * House register (unchanged, both games):
 *  - **Hand-drawn**, not CAD — an inset DOTTED stroke whose every vertex carries a tiny
 *    DETERMINISTIC jitter (seeded by the boundary-corner grid coordinate, so a cell's own
 *    segments meet at their shared corner). The jitter is STATIC (never animated), so it is
 *    PRM-safe by construction (no reduced-motion branch needed).
 *  - **Both themes** — the ink is a graphite tone dialled per theme in scoped CSS.
 *  - **Decorative to AT** (`aria-hidden`): the cage constraint is the puzzle's, read by the
 *    board's own labelling, never announced as a bare glyph.
 */
import { computed } from "vue";

/** One cage as the overlay draws it: the cells it spans, and the text it prints. */
export interface CageFigure {
  cells: number[];
  /** the corner text — Killer's bare sum, KenKen's `"12×"` target (bare for a singleton). */
  label: string;
}

const props = withDefaults(
  defineProps<{
    /** The board's cage furniture, already reduced to figures by the clue seam. */
    cages: CageFigure[];
    /** Board side length (cells per row). The SVG viewBox is `boardSize × boardSize`. */
    boardSize: number;
    /** The game's own class prefix — a frozen DOM contract (`g.killer-cage`, `g.kenken-cage`
     *  and their descendants are what the unit estate counts cages through). */
    family: string;
    /** Corner-label size in grid units — Killer prints a sum, KenKen a longer target. */
    fontSize?: number;
  }>(),
  { fontSize: 0.26 },
);

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
      const corner = Math.min(...cage.cells);
      const cCol = corner % n;
      const cRow = Math.floor(corner / n);

      return {
        boundary: segs.join(" "),
        labelX: cCol + INSET + 0.06,
        labelY: cRow + INSET + 0.24,
        label: cage.label,
      };
    });
});
</script>

<template>
  <svg
    class="cage-overlay"
    :class="`${family}-cage-overlay`"
    :viewBox="`0 0 ${boardSize} ${boardSize}`"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <g v-for="(cage, i) in rendered" :key="i" class="cage" :class="`${family}-cage`">
      <!-- The dotted, inset, hand-drawn cage boundary. -->
      <path
        :d="cage.boundary"
        class="cage-boundary"
        :class="`${family}-cage-boundary`"
        fill="none"
        stroke-linecap="round"
        :stroke-width="0.03"
        :stroke-dasharray="'0.015 0.075'"
      />
      <!-- The tiny corner label — Killer's sum, KenKen's operator target. -->
      <text
        :x="cage.labelX"
        :y="cage.labelY"
        class="cage-label"
        :class="`${family}-cage-label`"
        :font-size="props.fontSize"
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
.cage-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  overflow: visible;
}

/* Graphite ink — the pencil register, dialled per theme. Light: a soft graphite; dark: a
   lifted graphite so the boundary reads over the dark card without shouting. The two games
   declared `--killer-ink` / `--kenken-ink` overrides that were never set anywhere in the
   estate; one `--cage-ink` hook replaces both, same defaults, same pixels. */
.cage-boundary {
  stroke: var(--cage-ink, rgba(60, 64, 72, 0.5));
}
.cage-label {
  fill: var(--cage-ink-strong, rgba(52, 56, 64, 0.72));
  font-family: var(--font-hand, "Caveat", ui-rounded, system-ui, sans-serif);
  font-weight: 600;
  /* preserveAspectRatio="none" over a square viewBox + square container keeps 1:1, so the
     glyph is not distorted; a non-scaling paint keeps the hairline crisp at any board px. */
  paint-order: stroke;
}

/* Dark keys off the class `useTheme` actually writes (`useDark({selector:"html",
   attribute:"class", valueDark:"dark"})`) — the same `.dark` ancestor every other surface in
   the estate tracks. The blocks that stood here keyed off `@media (prefers-color-scheme)` and
   `:root[data-theme=…]`: the first disagrees with the toggle in two of the four OS×app
   quadrants, the second never matched at all — nothing writes `data-theme` (T7-W1). */
:root.dark .cage-boundary {
  stroke: var(--cage-ink, rgba(198, 204, 214, 0.42));
}
:root.dark .cage-label {
  fill: var(--cage-ink-strong, rgba(214, 220, 230, 0.78));
}
</style>

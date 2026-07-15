<script setup lang="ts">
/**
 * PosterBoard — the game-agnostic STATIC poster face (T4-W12 Wave A).
 *
 * A read-only mini-board: the hand-drawn grid frozen on ONE pose + the canned givens
 * inked as settled glyphs. It is the FLANK-card face the carousel deals onto the desk
 * (§Poster vs live face) — a still worksheet, never the live board (only one live
 * board mounts at any instant, the perf floor). Deliberately NOT the `GameBoard` shell:
 * that shell mounts `HandDrawnGrid` (which enrols the shared boil beat), the drawer
 * registration, the ARIA roving-tabindex grid, the solver seam, the celebration/
 * marginalia machine. A poster wants none of it — so the grid is rendered here as static
 * pose geometry (`generateGridBoilFrames`, one pose, grain-static once) and the digits as
 * `HandwrittenGlyph`s that settle on mount (given, not revealed → no draw-in, no murmur).
 *
 * THE SOUL GATE (T4-W12): a poster ENROLS NOTHING by default — `pose` defaults to 0 and
 * never ticks, so `useBeatFrame`/`useBoilBeat` are never called and the N-sparse-writers
 * disease T3 killed cannot return through a gallery of flank cards. "Boil-alive-capable"
 * is the latent `pose` seam: the gallery — which owns beat enrolment — may drive `:pose`
 * from its own single beat for the ONE card it wants alive; every other poster stays on
 * pose 0 (frozen). PRM-safe by construction (no animation to freeze).
 *
 * Non-interactive: `pointer-events: none`, no inputs, no focus targets. The gallery's
 * `GameCard` (Wave B) owns the accessible name; the face is decorative here unless a
 * `label` is supplied, in which case it announces as one image.
 */
import { computed } from "vue";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";
import { toDisplayChar } from "@pencil/glyph/glyphRegistry";
import { generateGridBoilFrames } from "@pencil/grid/gridPaths";
import { BOIL_CONFIG } from "@pencil/config/pencilConfig";

const props = defineProps<{
  /** The board side length (9 for a 9×9 sudoku, 5 for a 5×5 futoshiki). */
  boardSize: number;
  /** The sub-grid band edge for the frame's box lines: Sudoku 3 (bands), Futoshiki =
   *  `boardSize` (a plain Latin grid — no interior box lines). Mirrors the shell's
   *  `subgridSize` furniture divergence. */
  subgridSize: number;
  /** The canned givens snapshot — `{ position: value }`, 0/absent = empty. A still
   *  photograph of a board, never a live model (no Worker, no solver, no reactivity). */
  values: Record<string, number>;
  /** The frozen boil pose to render (default 0). The poster NEVER ticks this itself —
   *  it is the gallery's optional "make this one card alive" seam (the gallery owns the
   *  single shared beat). Left at 0, the poster enrols nothing and never repaints. */
  pose?: number;
  /** Optional accessible name. Absent → the face is decorative (`aria-hidden`); the
   *  gallery card owns the name. Present → one `role="img"` announcement. */
  label?: string;
}>();

const VIEWBOX_SIZE = 1000;

// The four boil-pose variants, memoized through the shared boil LRU exactly as the live
// grid computes them (same seed + config), so a poster's frame is registration-identical
// to the board's — the still is a genuine frame of the same film, not a lookalike.
const frames = computed(() =>
  generateGridBoilFrames(
    props.boardSize,
    props.subgridSize,
    VIEWBOX_SIZE,
    42,
    BOIL_CONFIG.frameCount,
    BOIL_CONFIG.frameBoil,
    BOIL_CONFIG.subgridBoil,
    BOIL_CONFIG.cellBoil,
  ),
);

// One frozen pose — clamped into range. Static geometry bound directly, never to a beat.
const pose = computed(() =>
  Math.max(0, Math.min(BOIL_CONFIG.frameCount - 1, Math.floor(props.pose ?? 0))),
);
const paths = computed(() => {
  const f = pose.value;
  const bf = frames.value;
  return {
    frame: bf.frame[f],
    subgridLines: bf.subgridLines.map((line) => line[f]),
    cellLines: bf.cellLines.map((line) => line[f]),
  };
});

const totalCells = computed(() => props.boardSize * props.boardSize);
const gridTemplate = computed(() => `repeat(${props.boardSize}, minmax(0, 1fr))`);

function glyphAt(pos: number): string {
  return toDisplayChar(props.values[String(pos)] ?? 0, props.boardSize);
}
</script>

<template>
  <div
    class="poster-board"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <!-- The hand-drawn grid, FROZEN on one pose — the live grid's geometry, grain-static
         applied once, bound to static `paths` (never a ticking beat). No <HandDrawnGrid>:
         that component enrols the shared beat; a flank poster must not. -->
    <svg
      class="poster-grid"
      :viewBox="`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g filter="url(#grain-static)">
        <path
          :d="paths.frame"
          fill="none"
          stroke="var(--grid-line-color, currentColor)"
          stroke-width="12"
          stroke-opacity="0.95"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          v-for="(d, i) in paths.subgridLines"
          :key="'sg-' + i"
          :d="d"
          fill="none"
          stroke="var(--grid-line-color, currentColor)"
          stroke-width="8"
          stroke-opacity="0.9"
          stroke-linecap="round"
        />
        <path
          v-for="(d, i) in paths.cellLines"
          :key="'cl-' + i"
          :d="d"
          fill="none"
          stroke="var(--grid-line-color, currentColor)"
          stroke-width="5"
          stroke-opacity="0.7"
          stroke-linecap="round"
        />
      </g>
    </svg>

    <!-- The canned givens, inked as settled glyphs. `is-given` + not revealed/solved →
         HandwrittenGlyph settles on mount (dasharray none, no draw-in, no murmur pool):
         a still digit, no animation, no beat. -->
    <div
      class="poster-cells"
      :style="{ gridTemplateColumns: gridTemplate, gridTemplateRows: gridTemplate }"
      aria-hidden="true"
    >
      <div v-for="pos in totalCells" :key="pos - 1" class="poster-cell">
        <HandwrittenGlyph
          v-if="glyphAt(pos - 1)"
          :value="glyphAt(pos - 1)"
          is-given
          :is-overridden="false"
          :is-solved="false"
          :is-revealed="false"
          :noise-delay="0"
          :position="pos - 1"
          :board-size="boardSize"
          :is-hovered="false"
        />
      </div>
    </div>

    <!-- Furniture overlay (Futoshiki's inequality carets); empty for Sudoku. Given the
         board box so the game can position furniture in board fractions. -->
    <slot name="overlay" :board-size="boardSize" />
  </div>
</template>

<style scoped>
.poster-board {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  /* A poster is a photograph — nothing here is a hit target; the card frame owns
     the pointer. This also makes descendant hover impossible, so a flank poster's
     glyphs/carets never wiggle. */
  pointer-events: none;
  /* Fence any incidental repaint to the poster box (there is none at rest, but the
     latent `pose` seam swaps geometry when a gallery drives it). */
  contain: layout paint;
}

.poster-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: visible;
}

.poster-cells {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
}

.poster-cell {
  position: relative;
}
</style>

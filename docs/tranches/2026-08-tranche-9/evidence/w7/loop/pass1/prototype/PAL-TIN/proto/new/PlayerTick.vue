<script setup lang="ts">
/**
 * THE TICK (T9-W7 PAL-TIN §1.3/§1.4) — the sharing axis, drawn.
 *
 * The tin holds five pencils and the sixth player takes amber again, so something other than
 * colour has to say which amber. It is the deal counter's own mark: a gate-five tally, four
 * uprights and a binding slash, in `DifficultyTally`'s geometry and the same wobbled hand.
 * ONE component, TWO homes, and that identity is the whole design — the mark beside the slug
 * in the roster and the mark under the digit on the board are the same mark, so the roster row
 * IS the legend and nothing has to be said in a sentence.
 *
 * Frozen: one pose, no beat, no live filter, so the census stays at 9. `aria-hidden` on both
 * usages — the cell's accessible name already names its author by slug and the roster row
 * already carries it, so a tick that spoke would be a second region saying the same thing.
 *
 * ONE GEOMETRY, in hundredths of a cell. The glyph occupies the middle 65% of the cell, so the
 * lower 17.5% band (y 82.5…100) is free: the uprights run y 85 → 97 (height 12% of the cell,
 * foot 3% above its edge) at 7% spacing about the centre. The row crops the same coordinates
 * to a 14px-tall box, which is why the two marks are drawn by one set of numbers.
 */
import { computed } from "vue";
import { generateLineBoilFrames } from "@pencil/grid/gridPaths";
import { DRAW_IN_PRESETS } from "@pencil/config/pencilConfig";

const props = withDefaults(
  defineProps<{
    /** laps round the tin; 1–4 draw uprights, 5 and beyond draw the gate of five. */
    ticks: number;
    /** decorrelates the wobble — the cell's own position on the board, the id's hash in a row. */
    seed: number;
    /** `cell` sits in the digit's lower band; `row` crops to the roster row's line box. */
    mode?: "cell" | "row";
  }>(),
  { mode: "cell" },
);

const TOP = 85;
const FOOT = 97;
const GAP = 7;
const MID = 50;
const BOIL = 0.6; // the tally's own perturbation, in the same units

const paths = computed<string[]>(() => {
  const n = Math.min(5, Math.max(0, Math.trunc(props.ticks)));
  if (n === 0) return [];
  const uprights = n >= 5 ? 4 : n;
  const strokes: [number, number, number, number][] = [];
  for (let i = 0; i < uprights; i++) {
    const x = MID + (i - (uprights - 1) / 2) * GAP;
    strokes.push([x, TOP, x, FOOT]);
  }
  if (n >= 5) strokes.push([MID - 13, FOOT + 1, MID + 13, TOP - 1]);
  // One pose off the boil generator — the frames are the hand's variants and we keep the
  // first, which is what "frozen" means here: a drawn line, never an animated one.
  return strokes.map(
    ([x1, y1, x2, y2], i) =>
      generateLineBoilFrames(
        x1,
        y1,
        x2,
        y2,
        {
          roughness: 0.95,
          segments: 4,
          seed: props.seed * 31 + i * 17 + 11,
          jagged: true,
        },
        BOIL,
        2,
      )[0],
  );
});

const box = computed(() => (props.mode === "row" ? "35 83 30 16" : "0 0 100 100"));

/**
 * THE DRAW-IN (§1.7). The tick is written with the digit, one stroke at a time, on the estate's
 * own `.pencil-draw-on` primitive (`index.css:780`) — `pathLength="1"`, `--ease-drawOn`, PRM
 * instant in the primitive itself, and no scheduler subscriber of its own. The numbers are the
 * tally's, read from the one place they now live: 350ms a stroke, 90ms between them, and the
 * first stroke 90ms behind the digit so the hand finishes the numeral before it counts.
 * The ROW mark draws with the name's own write-in and asks for no timing (§1.7).
 */
const drawStyle = (i: number) =>
  props.mode === "row"
    ? undefined
    : {
        "--draw-dur": `${DRAW_IN_PRESETS.tally.duration}ms`,
        "--draw-delay": `${(i + 1) * DRAW_IN_PRESETS.tally.stagger}ms`,
      };
</script>

<template>
  <svg
    v-if="paths.length"
    :class="mode === 'row' ? 'roster-tick' : 'glyph-tick'"
    :viewBox="box"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      v-for="(d, i) in paths"
      :key="i"
      :d="d"
      stroke="var(--color-user-ink)"
      pathLength="1"
      :class="mode === 'row' ? undefined : 'pencil-draw-on'"
      :style="drawStyle(i)"
    />
  </svg>
</template>

<style scoped>
/* THE BOARD MARK. It cannot live inside `.glyph-svg` — that one is `viewBox 0 0 40 56` at 65%
   of the cell under `contain: paint`, so anything below the baseline is clipped — so it is a
   SIBLING of the cell ghost, over the same box, stroking the same one binding the digit does.
   Print and forced colours reach it through the widened pair in `index.css` (`:926` / `:948`);
   without that pair it would print in the player's colour, which is why the rule is named. */
.glyph-tick {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

/* THE INK IS A PRESENTATION ATTRIBUTE, exactly as the digit's is (`HandwrittenGlyph.vue:310`),
   and that is load-bearing rather than stylistic: the print and forced-colours rules live in
   `@layer base`, an unlayered scoped rule OUTRANKS a layered one, and a presentation attribute
   loses to both. Written as CSS here the tick printed black (the print rule carries
   `!important`) but kept the player's colour under forced colours — measured, then cured. */
.glyph-tick path {
  fill: none;
  stroke-width: 3; /* 3% of the cell */
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* THE ROW MARK — the same strokes, cropped to the line box, in the ink the row already
   carries (`:style="p.ink"` on the `<li>`). 14px tall inside `line-height: 1.35`. */
.roster-tick {
  height: 14px;
  width: auto;
  flex: none;
  overflow: visible;
}

.roster-tick path {
  fill: none;
  stroke-width: 2.3; /* ≈ 2px painted at this crop */
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>

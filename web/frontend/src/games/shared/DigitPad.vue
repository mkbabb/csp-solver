<script setup lang="ts">
/**
 * DigitPad — the touch entry tray (T3-W11 U-A, ratified BUILD). Digits 1..M + erase in
 * the ControlPanel grammar: hand-drawn key caps (wobble-edged rounded rects from the
 * gridPaths generator, STATIC — the tray doesn't boil, seventeen boiling rects would
 * crowd the scheduler for zero read), digit glyphs in the board hand (glyphRegistry,
 * hex A–G past 9 exactly as the cells render them).
 *
 * Composition (recorded design call): ALWAYS PRESENT in the panel card on coarse
 * pointers — a focus-summoned pad pops in and reflows at the exact moment of intent;
 * the workbook grammar wants the pencil tray already on the desk. Keys dim until a
 * cell is chosen ("tap a cell to write" in the hand); `mousedown.prevent` keeps a
 * key tap from stealing the cell's focus while the click still fires (canceling
 * POINTERdown would swallow the click entirely for touch pointers in Chromium — the
 * probe caught exactly that). Entry rides the board's own update path
 * (`enterValue` → onCellUpdate) so keyboard semantics — override rules, murmur hold,
 * undo recording — are inherited wholesale, never reimplemented.
 *
 * No entrance animation (PRM-clean by construction): the tray is simply there.
 */
import { computed } from "vue";
import EraserIcon from "@pencil/chrome/icons/EraserIcon.vue";
import { getVariant, toDisplayChar } from "@pencil/glyph/glyphRegistry";
import { generateRectBoilFrames } from "@pencil/grid/gridPaths";

const props = defineProps<{
  /** M — the key count follows the board (4/5/6/7/9/16). */
  boardSize: number;
  /** A cell holds focus — keys are live; dimmed + disabled otherwise. */
  enabled: boolean;
}>();

const emit = defineEmits<{
  (e: "digit", value: number): void;
  (e: "erase"): void;
}>();

// One static wobble cap per key, seeded per value so neighbors never stamp identically
// (same discipline as the glyph variants). frameCount floors at 2 in the generator;
// boilAmount 0 makes the frames identical — take the first.
const CAP_W = 72;
const CAP_H = 60;
const capViewBox = `0 0 ${CAP_W} ${CAP_H}`;
function capPath(seed: number): string {
  return (
    generateRectBoilFrames(
      3,
      3,
      CAP_W - 6,
      CAP_H - 6,
      { roughness: 1.1, segments: 4, seed: 400 + seed, jagged: false },
      0,
      2,
      10,
    )[0] ?? ""
  );
}

const keys = computed(() =>
  Array.from({ length: props.boardSize }, (_, i) => {
    const v = i + 1;
    const char = toDisplayChar(v, props.boardSize);
    return {
      v,
      char,
      glyph: getVariant(char, v * 13 + props.boardSize)?.d ?? "",
      cap: capPath(v),
    };
  }),
);
const eraseCap = computed(() => capPath(99));

// Deterministic column count (recorded): one calm row through 5 keys (the 4×4 board +
// erase), two rows through ten (5..9), six columns past that (16 → 6/6/5) — every key
// clears the 44px floor at 375 in all three regimes.
const cols = computed(() => {
  const count = props.boardSize + 1;
  if (count <= 5) return count;
  if (count <= 10) return Math.ceil(count / 2);
  return 6;
});
</script>

<template>
  <div class="digit-pad" role="group" aria-label="Digit pad">
    <p class="pad-hint" :class="{ 'is-waiting': !enabled }" aria-hidden="true">
      tap a cell to write
    </p>
    <div
      class="pad-keys"
      :style="{ gridTemplateColumns: `repeat(${cols}, minmax(2.75rem, 1fr))` }"
    >
      <button
        v-for="k in keys"
        :key="k.v"
        class="pad-key"
        type="button"
        :disabled="!enabled"
        :aria-label="`Enter ${k.char}`"
        @mousedown.prevent
        @click="emit('digit', k.v)"
      >
        <svg
          class="pad-cap"
          :viewBox="capViewBox"
          preserveAspectRatio="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :d="k.cap"
            fill="none"
            stroke="var(--color-muted-foreground)"
            stroke-width="2.5"
            stroke-opacity="0.7"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        </svg>
        <svg
          class="pad-glyph"
          viewBox="0 0 40 56"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :d="k.glyph"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        class="pad-key pad-key-erase"
        type="button"
        :disabled="!enabled"
        aria-label="Erase cell"
        @mousedown.prevent
        @click="emit('erase')"
      >
        <svg
          class="pad-cap"
          :viewBox="capViewBox"
          preserveAspectRatio="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :d="eraseCap"
            fill="none"
            stroke="var(--color-muted-foreground)"
            stroke-width="2.5"
            stroke-opacity="0.7"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        </svg>
        <EraserIcon :size="22" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.digit-pad {
  margin-top: 0.4rem;
}

/* The hand's hint while no cell is chosen. visibility (not display) so enabling the
   tray never shifts layout — the line's box is always reserved. */
.pad-hint {
  font-family: var(--font-hand);
  font-size: calc(var(--type-small) * 0.85);
  line-height: 1.2;
  text-align: center;
  color: var(--color-muted-foreground);
  margin-bottom: 0.15rem;
  visibility: hidden;
}

.pad-hint.is-waiting {
  visibility: visible;
}

/* One grain raster for the whole tray (never per-key — 17 filtered buttons is 17
   raster layers for one texture). */
.pad-keys {
  display: grid;
  gap: 0.3rem;
  /* Capped + centered: on wide stacked viewports (iPad portrait) uncapped 1fr tracks
       stretch the caps into 2:1 slabs — ~30rem keeps them keycap-proportioned. */
  max-width: 30rem;
  margin-inline: auto;
  filter: url(#grain-static);
}

.pad-key {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  height: 3rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0.6rem;
  color: var(--color-crayon-blue);
  cursor: pointer;
  transition:
    opacity 150ms,
    background-color 150ms;
}

.pad-cap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.pad-glyph {
  width: 42%;
  height: 62%;
  overflow: visible;
}

.pad-key:active:not(:disabled) {
  transform: scale(0.93);
  background: var(--color-accent);
}

.pad-key:disabled {
  opacity: 0.4;
  cursor: default;
}

.pad-key-erase {
  color: var(--color-muted-foreground);
}
</style>

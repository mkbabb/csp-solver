<script setup lang="ts">
/**
 * FutoshikiPoster — Futoshiki's static carousel face (T4-W12 Wave A).
 *
 * A canned 5×5 snapshot on the game-agnostic `PosterBoard`: a plain Latin grid (subgrid-
 * size = boardSize, no interior box lines) + a few givens + the printed inequality carets
 * in the overlay slot. Static and non-interactive — the carets are inked as settled
 * `HandwrittenGlyph`s (no hover boil, no beat), mirroring `FutoshikiCaret`'s glyph but
 * frozen: a flank-card still, never the live board.
 */
import PosterBoard from "@games/shared/PosterBoard.vue";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";
import { caretFigures } from "./clue";
import type { Inequality } from "./types";

const N = 5;

// Canned givens (row-major position → value). Futoshiki carries few clues — the
// constraints do the work — so the poster reads as mostly-open worksheet.
const values: Record<string, number> = { "2": 5, "6": 2, "12": 4, "18": 1, "22": 3 };

// Printed [greater, lesser] inequalities across orthogonally-adjacent pairs — spread so
// both horizontal (>/<) and vertical (∨/∧) carets show on the still.
const INEQUALITIES: Inequality[] = [
  [0, 1],
  [7, 6],
  [5, 10],
  [16, 17],
  [13, 8],
  [21, 22],
];

// The caret figures — the clue seam's own edge-midpoint math (T5-W2 F2), the very
// derivation the live overlay draws from. The still and the board cannot print different
// carets because there is one function; the canned set is the only thing that differs.
const carets = caretFigures(INEQUALITIES, N);
</script>

<template>
  <PosterBoard :board-size="N" :subgrid-size="N" :values="values">
    <template #overlay>
      <div class="poster-caret-layer" aria-hidden="true">
        <div
          v-for="c in carets"
          :key="c.key"
          class="poster-caret"
          :style="{
            left: c.leftPct + '%',
            top: c.topPct + '%',
            width: c.sizePct + '%',
            height: c.sizePct + '%',
          }"
        >
          <div
            class="poster-caret-rotate"
            :style="{ transform: `rotate(${c.rotation}deg)` }"
          >
            <HandwrittenGlyph
              :value="c.glyph"
              is-given
              :is-overridden="false"
              :is-solved="false"
              :is-revealed="false"
              :noise-delay="0"
              :position="c.hash"
              :board-size="N"
              :is-hovered="false"
            />
          </div>
        </div>
      </div>
    </template>
  </PosterBoard>
</template>

<style scoped>
/* The caret furniture layer — a still sibling over the cells. Non-interactive (the
   PosterBoard face is already pointer-events:none); the glyphs settle and never boil. */
.poster-caret-layer {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.poster-caret {
  position: absolute;
  transform: translate(-50%, -50%);
}

.poster-caret-rotate {
  position: absolute;
  inset: 0;
}
</style>

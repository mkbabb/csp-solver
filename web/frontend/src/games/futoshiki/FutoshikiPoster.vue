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
import { computed } from "vue";
import PosterBoard from "@games/shared/PosterBoard.vue";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";
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

// The caret descriptors — the exact edge-midpoint fraction math the live board uses
// (FutoshikiBoard §caret layer), reproduced for the canned set. A caret sits on the
// shared edge; its open mouth faces the greater value.
interface CaretDescriptor {
  key: string;
  glyph: ">" | "<";
  rotation: number;
  leftPct: number;
  topPct: number;
  sizePct: number;
  hash: number;
}
const carets = computed<CaretDescriptor[]>(() => {
  const cellPct = 100 / N;
  const out: CaretDescriptor[] = [];
  for (const [gt, lt] of INEQUALITIES) {
    const rg = Math.floor(gt / N);
    const cg = gt % N;
    const rl = Math.floor(lt / N);
    const cl = lt % N;
    let glyph: ">" | "<" = ">";
    let rotation = 0;
    let leftPct: number;
    let topPct: number;
    if (rg === rl) {
      leftPct = (Math.min(cg, cl) + 1) * cellPct;
      topPct = (rg + 0.5) * cellPct;
      glyph = cg < cl ? ">" : "<";
    } else {
      topPct = (Math.min(rg, rl) + 1) * cellPct;
      leftPct = (cg + 0.5) * cellPct;
      rotation = rg < rl ? 90 : -90;
    }
    out.push({
      key: `${gt}-${lt}`,
      glyph,
      rotation,
      leftPct,
      topPct,
      sizePct: cellPct * 0.5,
      hash: gt * 131 + lt * 7 + 1,
    });
  }
  return out;
});
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

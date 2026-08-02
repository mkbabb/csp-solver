<script setup lang="ts">
/**
 * CaretOverlay — Futoshiki's clue layer, whole (T5-W2 F2).
 *
 * The printed inequality carets as ONE sibling laid over the board's cell grid — the same
 * `#overlay` layer Thermo's tube and the shared `CageOverlay` ride. It came out of
 * `FutoshikiBoard`'s own overlay slot verbatim when the board adapter died; what changed is
 * where the figures come from. The geometry is `clue.ts`'s now, so this layer and
 * `FutoshikiPoster` print the same carets from one derivation instead of two copies.
 *
 * a11y: the layer is `aria-hidden`. A caret depicts a constraint that belongs to the two
 * cells it sits between, and `clue.ts`'s `constraintLabels` folds it into both of their
 * accessible names — AT reads "…greater than the cell to the right" on the cell, never a
 * bare glyph.
 */
import FutoshikiCaret from "./FutoshikiCaret.vue";
import type { CaretFigure } from "./clue";

defineProps<{
  /** The board's printed furniture, already reduced to figures by the clue seam. */
  carets: CaretFigure[];
  /** Board side length — the glyph's own variant/scale math reads it. */
  boardSize: number;
}>();
</script>

<template>
  <div class="caret-layer" aria-hidden="true">
    <FutoshikiCaret
      v-for="c in carets"
      :key="c.key"
      :glyph="c.glyph"
      :rotation="c.rotation"
      :board-size="boardSize"
      :hash="c.hash"
      :style="{
        left: c.leftPct + '%',
        top: c.topPct + '%',
        width: c.sizePct + '%',
        height: c.sizePct + '%',
      }"
    />
  </div>
</template>

<style scoped>
/* Caret furniture layer — passes pointer events through except on the carets themselves
   (which enable their own hover boil). Sits in the cell layer so the peek laminate (z-3)
   lays down over it. Scoped HERE: the `.caret-layer` element is rendered by this component,
   so its data-v hash is this component's. */
.caret-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

/* F6 beat 1 (T3-W10) — the caret furniture leaves with the grid: opacity-only, 200ms,
   easeInCubic (the erase family). `.board-leaving` is the shared board-shell's class (an
   ancestor, unscoped by Vue's rule); `.caret-layer` carries this scope's data-v. */
@media (prefers-reduced-motion: no-preference) {
  .board-leaving .caret-layer {
    opacity: 0;
    transition: opacity 200ms var(--ease-fadeOut);
  }
}
</style>

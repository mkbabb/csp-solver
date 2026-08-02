<script setup lang="ts">
/**
 * A single Futoshiki inequality caret — the mark that sits on the shared edge between
 * two orthogonally-adjacent cells (design-union.md §2.4 row 4, F6/F7).
 *
 * SIBLING to the cell, never nested inside one: a caret belongs to a cell-boundary
 * PAIR, not to any single cell. FutoshikiBoard positions it via the same `cellSize`
 * fraction math the grid uses (left/top/width/height % handed in as inline style).
 *
 * It WRAPS `pencil/glyph/HandwrittenGlyph.vue` — the same hand-drawn glyph renderer the
 * digits use — passing the `>`/`<` caret glyph and reusing its variant selection
 * (pickVariantIndex/cellHash) and its hover boil, which rides `createGlyphWiggle`
 * (glyph-wiggle, NOT line-boil) exactly as the spec requires. Only the two HORIZONTAL
 * marks (`>`/`<`) are authored in glyphPaths; a VERTICAL caret (∨/∧) is the `>` glyph
 * rotated ±90° via `rotation`, so the whole four-way vocabulary reuses two drawn marks.
 *
 * a11y (F6): the caret is decorative here — `aria-hidden` — because the constraint it
 * depicts is folded into BOTH adjacent cells' `aria-label`s by FutoshikiBoard. AT reads
 * "…greater than the cell to the right" on the cell, never a bare "greater-than" glyph.
 */
import { ref } from "vue";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";

defineProps<{
  /** The horizontal caret glyph — `>` (greater on the left) or `<` (greater on the right). */
  glyph: ">" | "<";
  /** 0 for horizontal; +90 (→ ∨, greater on top) or −90 (→ ∧, greater on bottom) for vertical. */
  rotation: number;
  boardSize: number;
  /** Stable per-caret hash → deterministic variant selection (adjacent carets differ). */
  hash: number;
}>();

const hovered = ref(false);
</script>

<template>
  <div
    class="futoshiki-caret"
    aria-hidden="true"
    @pointerenter="hovered = true"
    @pointerleave="hovered = false"
  >
    <div class="caret-rotate" :style="{ transform: `rotate(${rotation}deg)` }">
      <HandwrittenGlyph
        :value="glyph"
        is-given
        :is-overridden="false"
        :is-solved="false"
        :is-revealed="false"
        :noise-delay="0"
        :position="hash"
        :board-size="boardSize"
        :is-hovered="hovered"
      />
    </div>
  </div>
</template>

<style scoped>
/* Positioned by FutoshikiBoard via inline left/top/width/height (% of the board box);
   the translate centres the caret on the shared edge midpoint. z-index 2 keeps it in the
   cell layer — the answer-key laminate (z-3) lays down cleanly OVER it during a peek. */
.futoshiki-caret {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: auto;
}

.caret-rotate {
  position: absolute;
  inset: 0;
}
</style>

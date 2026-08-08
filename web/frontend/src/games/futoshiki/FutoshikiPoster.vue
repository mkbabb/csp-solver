<script setup lang="ts">
/**
 * FutoshikiPoster — Futoshiki's static carousel face (T4-W12 Wave A).
 *
 * A 5×5 snapshot on the game-agnostic `PosterBoard`: a plain Latin grid (subgrid-size =
 * boardSize, no interior box lines) + givens + the printed inequality carets in the overlay
 * slot. Static and non-interactive — the carets are inked as settled `HandwrittenGlyph`s (no
 * hover boil, no beat), mirroring `FutoshikiCaret`'s glyph but frozen: a flank-card still,
 * never the live board.
 *
 * T8-W3 M12 — handed a `preview`, the still is the board actually saved here, carets and all.
 * The guard is the strictest of the five and that is `validateClue`'s own reason: a crafted
 * inequality set renders one floating caret per pair and freezes the main thread, so adjacency
 * and the pair bound are checked before a caret is drawn.
 */
import { computed } from "vue";
import PosterBoard from "@games/shared/PosterBoard.vue";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";
import type { PreviewBoard } from "@games/shared/useStagingBridge";
import { caretFigures } from "./clue";
import type { Inequality } from "./types";

const N = 5;

// Canned givens (row-major position → value). Futoshiki carries few clues — the
// constraints do the work — so the poster reads as mostly-open worksheet.
const canned: Record<string, number> = { "2": 5, "6": 2, "12": 4, "18": 1, "22": 3 };

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

const props = defineProps<{ preview?: PreviewBoard | null }>();

/** LATIN: the raw selector value IS the board side; the band is 4/5/6/7. */
const RUNGS = [4, 5, 6, 7];

/** A pair of ORTHOGONALLY ADJACENT in-range cells, deduped, inside the `2·n·(n−1)` bound —
 *  `spec`'s own `validateClue`, run here for the same reason it runs there. */
function pairsFor(clue: unknown, side: number): Inequality[] | null {
  if (!Array.isArray(clue) || clue.length > 2 * side * (side - 1)) return null;
  const seen = new Set<string>();
  const ok = clue.every((p: unknown) => {
    if (!Array.isArray(p) || p.length !== 2) return false;
    const [a, b] = p as [number, number];
    if (![a, b].every((n) => Number.isInteger(n) && n >= 0 && n < side * side))
      return false;
    const adjacent =
      (Math.floor(a / side) === Math.floor(b / side) && Math.abs(a - b) === 1) ||
      Math.abs(a - b) === side;
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    if (!adjacent || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return ok ? (clue as Inequality[]) : null;
}

const live = computed(() => {
  const p = props.preview;
  if (!p || !RUNGS.includes(p.size)) return null;
  const pairs = pairsFor(p.saved.inequalities, p.size);
  return pairs ? { preview: p, pairs } : null;
});

const size = computed(() => live.value?.preview.size ?? N);
const values = computed(() => live.value?.preview.values ?? canned);
const givens = computed(() => live.value?.preview.givenCells);
/** T8-R13 — whose hand wrote each cell, carried straight through to the shared floor. */
const authorInk = computed(() => live.value?.preview.authorInk);

// The caret figures — the clue seam's own edge-midpoint math (T5-W2 F2), the very
// derivation the live overlay draws from. The still and the board cannot print different
// carets because there is one function; only the pair set differs.
const carets = computed(() =>
  caretFigures(live.value?.pairs ?? INEQUALITIES, size.value),
);
</script>

<template>
  <PosterBoard
    :board-size="size"
    :subgrid-size="size"
    :values="values"
    :givens="givens"
    :author-ink="authorInk"
  >
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
              :board-size="size"
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

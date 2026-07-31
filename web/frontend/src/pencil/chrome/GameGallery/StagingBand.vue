<script setup lang="ts">
/**
 * StagingBand — the order slip under the deck (T4-P1 F4).
 *
 * Under the STANDING RULING the picker owns the CROSS-GAME SWITCH: the card you are pointing at
 * names the game, this slip names the board, and one act carries both. The everyday same-game
 * re-deal is NOT this control's job — it lives in the drawer, two taps away, and the slip does
 * not try to win it back.
 *
 * WHY IT IS NOT ON THE CARD. The deck is an `aria-activedescendant` listbox: DOM focus lives on
 * the viewport and options carry no tab stops, so chips and buttons inside a `role="option"` are
 * a broken listbox (APG forbids interactive descendants of `option`) AND unreachable for screen
 * readers. Hoisting the staging OUT of the deck — a band bound to the ACTIVE card, sibling to the
 * viewport exactly as the guard ribbon is — fixes the contract, and takes three other defects
 * with it: no five-instance flank reservation (so no `HandDrawnOutline` stamp frames baking four
 * pose paths each for boxes `visibility:hidden` guarantees never paint), no blank lower third on
 * the flank cards, and one control per axis instead of five.
 *
 * THE SOUL GATE. One `HandDrawnOutline` at `:pose="0"` — frozen, enrolling NO beat (the flank
 * idiom). The chips ride `boilFrame: 0`, so their scribble underlines are a static raster, not a
 * per-beat filter write. Nothing here paints at rest, and nothing here carries a filter: the
 * shared `OptionSelector`'s hover wobble was deleted at source in P1-W3, so the band inherits a
 * chip with no `url(#…)` on any state. Gated by the RENDERED census, not by a grep.
 *
 * THE TWO VERBS, distinguished STRUCTURALLY — no new ink vocabulary:
 *   · the safe verb is a WORD. `resume` when a board waits, `start` when the game is new. It
 *     never carries a mark.
 *   · `deal` is a word AND the estate's own die — the same `DiceIcon` the drawer's Deal button
 *     has always worn — in the guard ribbon's heavier `leave` ink.
 * A glyph against no glyph survives greyscale, a small crop, a low-res render, and a reader who
 * cannot see either border. That is the distinction pass 2 asserted with border weight alone and
 * could not defend; the destructive act is now the only marked one, and it is ribbon-guarded on
 * every path (tap, `d`, and the ribbon's own confirm).
 *
 * THE STAGED PAIR IS NEVER DROPPED. `start` DEALS the pair (nothing to restore, so the chips are
 * the whole instruction). `resume` restores the saved board — and when the chips have wandered
 * off it, the saved pair is PRINTED under the verb before the click and the chips snap onto it
 * at the click. Pass 2 emitted a bare `select` and the pair vanished with no mark at all.
 *
 * Pencil purity: props in, intents out. `staging`, `safeVerb` and `savedPair` are plain
 * presentation data the gallery assembles; nothing here imports `games/**`.
 */
import { computed, useId } from "vue";
import HandDrawnOutline from "@pencil/grid/HandDrawnOutline.vue";
import OptionSelector from "@pencil/chrome/OptionSelector/OptionSelector.vue";
import DiceIcon from "@pencil/chrome/icons/DiceIcon.vue";
import type { GalleryStaging } from "./types";

const props = defineProps<{
  /** The ACTIVE card's name — the band is bound to it, so it says whose slip this is. */
  name: string;
  staging: GalleryStaging;
  /** The active card's picked pair (the gallery owns the state; the band renders it). */
  size: number | string;
  difficulty: number | string;
  /** `resume` (a board waits) or `start` (never played) — the gallery reads the ledger. */
  safeVerb: "resume" | "start";
  /** The SAVED pair's labels, present ONLY when the chips diverge from it — the sublabel that
   *  keeps `resume` from silently discarding what the chips say. */
  savedPair: string | null;
  /** A deal is in flight, or the guard ribbon is armed on this card — both verbs go inert. */
  busy?: boolean;
}>();

const emit = defineEmits<{
  (e: "pick", axis: "size" | "difficulty", value: number | string): void;
  (e: "safe"): void;
  (e: "deal"): void;
}>();

// Each axis is a NAMED GROUP: the hand-written label is the group's accessible name, so the
// eight tab stops read as "size, 9×9, pressed" instead of eight bare numbers in a row. `useId`
// keeps the pair unique when the band re-renders across cards.
const uid = useId();
const sizeLabelId = computed(() => `staging-size-${uid}`);
const diffLabelId = computed(() => `staging-diff-${uid}`);

const safeLabel = computed(() =>
  props.savedPair
    ? `${props.safeVerb} ${props.name} at ${props.savedPair}`
    : `${props.safeVerb} ${props.name}`,
);
</script>

<template>
  <div class="staging-band">
    <HandDrawnOutline :pose="0" :stroke-width="3" :outset="4">
      <div class="staging-slip bg-card edge-outlined">
        <div class="staging-axes">
          <div class="staging-axis" role="group" :aria-labelledby="sizeLabelId">
            <span :id="sizeLabelId" class="staging-axis-label">{{
              staging.size.label
            }}</span>
            <OptionSelector
              :options="staging.size.options"
              :selected="size"
              :boil-frame="0"
              mobile
              @change="(v) => emit('pick', 'size', v)"
            />
          </div>
          <div class="staging-axis" role="group" :aria-labelledby="diffLabelId">
            <span :id="diffLabelId" class="staging-axis-label">{{
              staging.difficulty.label
            }}</span>
            <OptionSelector
              :options="staging.difficulty.options"
              :selected="difficulty"
              :boil-frame="0"
              mobile
              @change="(v) => emit('pick', 'difficulty', v)"
            />
          </div>
        </div>

        <div class="staging-verbs">
          <button
            type="button"
            class="staging-btn staging-safe"
            :disabled="busy"
            :aria-label="safeLabel"
            @click.stop="emit('safe')"
          >
            {{ safeVerb }}
            <span v-if="savedPair" class="staging-sub">{{ savedPair }}</span>
          </button>
          <button
            type="button"
            class="staging-btn staging-deal"
            :disabled="busy"
            aria-keyshortcuts="d"
            :aria-label="`deal a new ${name} board`"
            @click.stop="emit('deal')"
          >
            <DiceIcon :size="20" aria-hidden="true" />
            deal
          </button>
        </div>
      </div>
    </HandDrawnOutline>
  </div>
</template>

<style scoped>
/* THE RESERVATION. The band's box is held by CSS, not by five mounted instances: the slip keeps
   its height as the content swaps card to card (3 size chips vs 4, `resume` vs `start`, with a
   saved-pair sublabel or without), so the deck above and the pips between never shift on a
   snap — and `HandDrawnOutline`'s ResizeObserver never re-bakes its four pose paths mid-gesture. */
.staging-band {
  width: min(100%, 26rem);
  align-self: center;
}

.staging-slip {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.7rem 0.85rem 0.75rem;
  border-radius: 0.75rem;
  min-height: var(--staging-reserve, 10.5rem);
}

.staging-axes {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1 1 auto;
  min-width: 0;
}

.staging-axis {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* The chips are INPUTS, not the headline. The shared selector steps up to 1.375rem at md —
   which on the deck made the options louder than the acts they feed, the exact rank inversion
   the picker is being fixed for. Pinned to the body rung here, so the verbs lead. */
.staging-axis :deep(.ctrl-btn) {
  font-size: 1rem;
}

/* The axis name in the hand register, muted and small — a caption on the chips, never a
   sixth display-caps heading (the estate's own indicted grammar). It is also the group's
   accessible name, so it is a real label and not decoration. */
.staging-axis-label {
  font-family: var(--font-hand);
  font-size: 0.9rem;
  line-height: 1;
  color: var(--color-muted-foreground);
  min-width: 2.6rem;
  text-align: left;
}

/* The chips fill the rest of the row and stay left-aligned under their label. */
.staging-axis :deep(.options-row) {
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0.15rem 0;
}

/* Coarse-pointer target floor — the estate's ≥44px convention (`.icon-btn`, the peek surface).
   The shared `.ctrl-btn` is a 36px fine-pointer control; the band promotes chips to the primary
   staging act on touch, so it pays the target cost HERE rather than widening every drawer. */
@media (pointer: coarse) {
  .staging-axis :deep(.ctrl-btn) {
    min-height: 44px;
  }
}

.staging-verbs {
  display: flex;
  gap: 0.5rem;
  flex: 0 0 auto;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
}

/* The verb grammar is the guard ribbon's, one surface up: a plain hand-written word in a soft
   rounded border. Same size, same family, both named — the reader compares two words, not a
   button against an absence. */
.staging-btn {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  font-family: var(--font-hand);
  font-size: 1.15rem;
  line-height: 1;
  padding: 0.42rem 1.1rem;
  min-height: 2.5rem;
  border-radius: 0.45rem;
  border: 2px solid color-mix(in srgb, var(--color-foreground) 30%, transparent);
  background: transparent;
  color: var(--color-foreground);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* The saved pair, printed under `resume` when the chips have wandered off it. The guard note's
   own sub rung — the estate already owns a "quieter second line inside a verb" and this is it. */
.staging-sub {
  font-size: 0.8rem;
  line-height: 1;
  color: var(--color-muted-foreground);
}

/* `deal` is the picker's headline act AND its only destructive one, so it takes the ribbon's
   heavier ink and the estate's own die — the SAME mark the drawer's Deal button wears. The
   glyph is the structural tell: a reader who can see neither border weight nor colour still
   sees one verb marked and one bare. */
.staging-deal {
  flex-direction: row;
  gap: 0.4rem;
  border-color: color-mix(in srgb, var(--color-foreground) 60%, transparent);
  background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
}

.staging-btn:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-foreground) 45%, transparent);
  outline-offset: 2px;
}

.staging-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

@media (pointer: coarse) {
  .staging-btn {
    min-height: 44px;
    padding-inline: 1.1rem;
  }
}

/* Wide enough to set the slip as a row: the two axis lines stack on the left, the two verbs
   stand together on the right at the slip's optical center. The chip rows keep their own width
   (a side-by-side pair of axes wrapped at 3 chips and broke the reading order). */
@media (min-width: 40rem) {
  .staging-band {
    width: min(100%, 32rem);
  }

  .staging-slip {
    flex-direction: row;
    align-items: center;
    gap: 1.25rem;
    padding: 0.8rem 1rem;
    min-height: var(--staging-reserve, 7rem);
  }

  .staging-verbs {
    margin-top: 0;
  }
}
</style>

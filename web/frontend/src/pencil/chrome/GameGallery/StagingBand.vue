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
 * chip with no `url(#…)` on ANY state — which is the claim, so it is the gate: `filter-census`
 * G3.5 walks the pointer over every candidate surface in this regime and in the board's, and
 * reds if a hover mints one. A census taken at rest cannot see the rule that was deleted.
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
import SheetWashiLabel from "@pencil/sheet/SheetWashiLabel.vue";
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
const zoneId = computed(() => `staging-zone-${uid}`);

/** The difficulty axis writes in the SELECTED tier's crayon — the drawer's own `headingClass`
 *  rule, which reads the tone off the selected option and never off a flag. The size axis has
 *  no tones, so it falls to the muted register and nothing is toggled. */
const diffTone = computed(
  () =>
    props.staging.difficulty.options.find((o) => o.value === props.difficulty)
      ?.colorClass ?? "text-muted-foreground",
);

const safeLabel = computed(() =>
  props.savedPair
    ? `${props.safeVerb} ${props.name} at ${props.savedPair}`
    : `${props.safeVerb} ${props.name}`,
);

/** `aria-keyshortcuts="d"` on the deal button advertised a shortcut the band could not deliver:
 *  the estate's only `d` handler is the listbox VIEWPORT's, and the band is its sibling, so a
 *  `d` typed with a chip or a verb focused reached nothing. The band resolves its own now —
 *  through the same `deal` emit, so the gallery's one `attemptDeal` still owns the guard, the
 *  busy gate and the ribbon. Focus-scoped by construction (a keydown on the band's subtree),
 *  which is exactly what the attribute claims.
 *
 *  THE RADIUS (pass-5 A3 / A-m7). This handler's radius is the BAND; the attribute sat on the
 *  deal button alone, so the declared radius was one control of nine and the gate that read it
 *  could not tell the two apart. The attribute now sits on BOTH, and the two placements say
 *  different true things rather than the same thing twice:
 *    · on `.staging-band` — the SCOPE. `d` is live anywhere in this region, which is precisely
 *      what `onKeydown` delivers. It is not announced (the band takes no focus), so it is a
 *      machine-readable declaration the gate holds equal to the handler, and nothing more.
 *    · on `.staging-deal` — the TARGET, and the announced one. ARIA's own reading of
 *      `aria-keyshortcuts` is "the keys that activate THIS element"; the button is the element
 *      `d` activates and the only focusable in the band that can speak the claim to a reader.
 *  Deleting either would leave a true statement unsaid. */
function onKeydown(e: KeyboardEvent) {
  if (e.key !== "d" && e.key !== "D") return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  e.preventDefault();
  emit("deal");
}
</script>

<template>
  <div class="staging-band" aria-keyshortcuts="d" @keydown="onKeydown">
    <HandDrawnOutline :pose="0" :stroke-width="3" :outset="4">
      <!-- The slip is a labelled compartment, in the drawer's own zone grammar: the SAME
           component, text and seed the staged well wears one surface up, so the two read as
           one system. The visible tape IS the accessible name (`anchor="tag"` drops
           `role="tooltip"` for exactly that reason). -->
      <SheetWashiLabel :id="zoneId" text="new game" :seed="13" anchor="tag" />
      <div
        class="staging-slip bg-card edge-outlined"
        role="group"
        :aria-labelledby="zoneId"
      >
        <div class="staging-axes">
          <div class="staging-axis" role="group" :aria-labelledby="sizeLabelId">
            <span
              :id="sizeLabelId"
              class="section-heading staging-axis-label text-muted-foreground"
              >{{ staging.size.label }}</span
            >
            <OptionSelector
              :options="staging.size.options"
              :selected="size"
              :boil-frame="0"
              mobile
              @change="(v) => emit('pick', 'size', v)"
            />
          </div>
          <div class="staging-axis" role="group" :aria-labelledby="diffLabelId">
            <span
              :id="diffLabelId"
              class="section-heading staging-axis-label transition-colors duration-250"
              :class="diffTone"
              >{{ staging.difficulty.label }}</span
            >
            <OptionSelector
              :options="staging.difficulty.options"
              :selected="difficulty"
              :boil-frame="0"
              mobile
              @change="(v) => emit('pick', 'difficulty', v)"
            />
          </div>
        </div>

        <!-- T8-W1 M4 — THE VERBS WEAR THE ESTATE'S HAND, not a rounded rect. They shipped as
             `border: 2px solid` + `border-radius: 0.45rem` — a geometric chrome standing inside
             a slip, a deck and four wells that are all drawn by `HandDrawnOutline`, which is
             the one box grammar this estate has. The cure is the component, not a new radius:
             `DrawerTab`'s own idiom verbatim (a bare `<button>` wrapping an outline wrapping the
             tongue), at `:pose="0"` so each frame is pruned to a single static path — no beat
             enrolled, no layer promoted, no filter minted (the poses carry the geometric grain
             bake, so `filter-census` G3.5 is untouched). The outline is `pointer-events: none`,
             so the button remains the whole target. -->
        <div class="staging-verbs">
          <button
            type="button"
            class="staging-btn staging-safe"
            :disabled="busy"
            :aria-label="safeLabel"
            @click.stop="emit('safe')"
          >
            <HandDrawnOutline
              :pose="0"
              :stroke-width="2"
              :outset="2"
              class="staging-face"
            >
              {{ safeVerb }}
              <span v-if="savedPair" class="staging-sub">{{ savedPair }}</span>
            </HandDrawnOutline>
          </button>
          <button
            type="button"
            class="staging-btn staging-deal"
            :disabled="busy"
            aria-keyshortcuts="d"
            :aria-label="`deal a new ${name} board`"
            @click.stop="emit('deal')"
          >
            <HandDrawnOutline
              :pose="0"
              :stroke-width="2.5"
              :outset="2"
              class="staging-face"
            >
              <DiceIcon :size="20" aria-hidden="true" />
              deal
            </HandDrawnOutline>
          </button>
        </div>
      </div>
    </HandDrawnOutline>
  </div>
</template>

<style scoped>
/* THE RESERVATION (T8-W1 M8, re-derived). The band's box is held by CSS, not by five mounted
   instances — but until this pass it was held on ONE axis and only by luck on the other. The
   three numbers below are what actually pin it, and each is the MEASURED maximum over all five
   cards, in both engines, not a guess:

     · `--staging-label-col: 3rem` (48px) ≥ the widest axis caption. `level` measures 41.66px on
       Chromium and 43.88px on WebKit at 1280 — the shipped `min-width: 2.6rem` (41.6px) was
       UNDER the WebKit figure, so the caption pushed its own chips 2.28px right there and
       nowhere else. 48 clears both with 4.1px to spare.
     · `--staging-opts-col` — the row regime's chip column, ≥ the widest option set. That is
       futoshiki's four size chips; the difficulty band (`Easy Medium Hard`, on all five cards)
       is second. Both are measured below.
     · `--staging-verbs-col: 12.5rem` (200px) ≥ the widest verb pair. `resume`+`deal` measured
       188.06px against `start`+`deal`'s 173.42 — a 14.64px swing that moved every chip on the
       card sideways, because the axes took whatever the verbs left. Reserved, so they do not.

   THE DEFECT THIS CURES, stated as it was measured. At the shipped 32rem the difficulty row
   had 0.67px of slack on sudoku in WebKit and wrapped: `Easy Medium` on one line, `Hard`
   orphaned below, the `level` caption floating between them because a flex row centres its
   items — the owner's m3/m4 exactly. The band then stood 152.73px tall on sudoku against
   112px on the other four, so the page reflowed on every snap through the deck. Reproduced
   before the cure at `webkit 1280`, and the arithmetic above is why it cannot recur: nothing
   in the row is elastic any more, so a card either fits the reserve or the reserve is wrong,
   and the reserve is the max. */
.staging-band {
  --staging-label-col: 3rem;
  --staging-verbs-col: 12.5rem;
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

/* T8-W1 M4 — THE TWO AXES ARE ONE SHAPE. They shipped as flex rows whose caption was a
   `min-width`'d inline: identical in source, and identical on screen only while neither row
   wrapped. The moment one did, the two rows stopped being the same object — one caption sat on
   its chips' baseline, the other floated at the centre of a two-line block. A GRID with a fixed
   caption column cannot express that difference: label in column 1, options in column 2, one
   row each, whatever the content. `minmax(0, 1fr)` so a long option set is a measurement
   problem (below) rather than a silent overflow of the grid track. */
.staging-axis {
  display: grid;
  grid-template-columns: var(--staging-label-col) minmax(0, 1fr);
  align-items: center;
  column-gap: 0.5rem;
}

/* The chips are INPUTS, not the headline. The shared selector steps up to 1.375rem at md —
   which on the deck made the options louder than the acts they feed, the exact rank inversion
   the picker is being fixed for. Pinned to the body rung here, so the verbs lead.
   T8-W1 M4: the horizontal padding comes down from the shared `px-3` (12px) to 0.65rem
   (10.4px), band-scoped. It buys 38.4px on the widest row in the estate — futoshiki's four
   size chips — which is the difference between a row-regime reserve that fits at the shipped
   band width and one that needs the band to grow past the deck it hangs under. The drawer's
   own chips are untouched; they stand in a 290px rail where three per row is the whole
   population. */
.staging-axis :deep(.ctrl-btn) {
  font-size: 1rem;
  padding-inline: 0.65rem;
}

/* The axis name takes the drawer's own eyebrow register (`.section-heading`, typography.css
   @layer components) — the weight, the lowercase, the wide tracking — so the slip and the
   drawer's staged well rank their parts the same way. Colour is never baked into that class:
   it comes from the template, muted on size and the selected tier's crayon on difficulty,
   which is the drawer's `headingClass` rule read on a second surface.

   TWO PROPERTIES ARE PINNED BACK, both measured. The FACE stays `--font-hand`: the Fraunces
   cut is 28 codepoints taken from the strings that face actually paints, and `v` is in none
   of them — `level` in the display face would render its middle letter in Georgia
   (`scripts/check-font-coverage.mjs` reds on exactly that string), and the rename that would
   have made this axis `difficulty` is struck estate-wide. The SIZE is one rung under the
   register's, because the chips this captions are pinned to the body rung; the drawer's
   heading-to-chip ratio is what carries across, not its absolute rung.

   T8-W1 M4: the caption's WIDTH is the grid's now, not the caption's. `min-width: 2.6rem`
   (41.6px) sat under `level`'s own WebKit measurement of 43.88px, so on that engine the label
   set the column and the two axes started their chips 2.28px apart — the shipped rule was
   measured on one engine and held on one engine. `--staging-label-col` is the track for both
   rows at once, so they cannot disagree by construction, and it is 48px because 48 > 43.88. */
.staging-axis-label {
  font-family: var(--font-hand);
  font-size: var(--type-small);
  text-align: left;
}

/* THE ROW NEVER WRAPS (T8-W1 M4). This was `flex-wrap: wrap`, which is the mechanism the
   owner's m3/m4 caught in the act: it converts a 0.67px shortfall into a second line, an
   orphaned `Hard`, a caption floating mid-column, and a 40.73px jump in the band's height —
   all silently, and only on the one engine whose caption is 2.28px wider. `nowrap` makes the
   same shortfall a MEASURABLE overflow instead of a layout, which is what the reserve numbers
   above are derived against. */
.staging-axis :deep(.options-row) {
  justify-content: flex-start;
  flex-wrap: nowrap;
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

/* THE ACCENT HOVER — the one colour the band was still missing against the drawer, where
   `--color-accent` has always been the hover ground under every `.icon-btn`. Same token, same
   two properties, same hover fence; no grammar transplant, and nothing that mints a filter
   (`filter-census` G3.5 walks this regime's hover states).

   THE VERBS ONLY, and the chips deliberately not: the chips already share the drawer's hover
   grammar because they are the same `OptionSelector` (muted ink lifting to foreground, the
   ghost underline), and a ground under them here would be a divergence on the very surface
   being brought into line — plus it would paint over the crayon the selected chip now carries.

   T8-W1 M4: the ground moves onto `.staging-face`, which is the box the drawn frame encloses —
   painting it on the button would put the ink outside its own outline. */
@media (hover: hover) {
  .staging-btn:not(:disabled):hover .staging-face {
    background: var(--color-accent);
    color: var(--color-foreground);
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

/* THE VERB IS A DRAWN BOX NOW (T8-W1 M4). The button itself is stripped to a bare target — no
   border, no radius, no padding — and the `HandDrawnOutline` inside it carries every one of
   those jobs in the estate's own hand. `DrawerTab` established the shape (button → outline →
   tongue) and this is that shape, so nothing new was invented to say "box". The `border-radius`
   the ribbon and this band shared is what the owner marked as out of family; the ribbon's own
   copy is agent B's fence and rides a wiring request. */
.staging-btn {
  display: inline-flex;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-foreground);
  font-family: var(--font-hand);
  font-size: 1.15rem;
  line-height: 1;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* The FACE is the box the outline draws around: its padding is the frame's air, and it is the
   node the hover ground paints, so the drawn stroke sits ON the ground rather than beside it.
   `min-width` is what makes the pair a stable column — `resume` and `start` differ by 14.64px
   of text, and a verb column that breathes with its own word is the horizontal half of the
   reflow M8 names. */
.staging-face {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  min-width: 5.4rem;
  min-height: 2.5rem;
  padding: 0.42rem 0.9rem;
  border-radius: 0.3rem;
}

/* The saved pair, printed under `resume` when the chips have wandered off it. The guard note's
   own sub rung — the estate already owns a "quieter second line inside a verb" and this is it. */
.staging-sub {
  font-size: 0.8rem;
  line-height: 1;
  color: var(--color-muted-foreground);
}

/* `deal` is the picker's headline act AND its only destructive one, so it takes the heavier
   ink — the outline's own `stroke-width` now, which is the hand's way of saying weight — and
   the estate's own die, the SAME mark the drawer's Deal button wears. The glyph is the
   structural tell: a reader who can see neither stroke weight nor colour still sees one verb
   marked and one bare. */
.staging-deal .staging-face {
  flex-direction: row;
  gap: 0.4rem;
  background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
}

/* The focus ring rides the FACE, so it traces the drawn box rather than a zero-padding
   button that is now smaller than the frame around it. */
.staging-btn:focus-visible {
  outline: none;
}

.staging-btn:focus-visible .staging-face {
  outline: 2px solid color-mix(in srgb, var(--color-foreground) 45%, transparent);
  outline-offset: 4px;
}

.staging-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

@media (pointer: coarse) {
  .staging-face {
    min-height: 44px;
  }
}

/* Wide enough to set the slip as a row: the two axis lines stack on the left, the two verbs
   stand together on the right at the slip's optical center. The chip rows keep their own width
   (a side-by-side pair of axes wrapped at 3 chips and broke the reading order).

   T8-W1 M8 — THE ROW REGIME IS A GRID, AND ITS COLUMNS ARE THE RESERVE. As a flex row the axes
   took `1fr` of whatever the verbs left, so `resume` (sudoku, a saved board) and `start` (the
   other four) handed the chips two different widths: 271.94px against 286.58px, measured, and
   the narrower one is the card that wrapped. Two explicit tracks — chips, then a reserved verb
   column — and every card gets the same two boxes whatever word is in the second one. The
   band's own width goes 32rem → 34rem, which is what the arithmetic needs and no more:
   544 − 32 (padding) − 20 (gap) − 200 (verbs) = 292px of chip column against a widest option
   set of 220.04px (futoshiki's four size chips at the trimmed padding) plus 48 + 8 for the
   caption — 276px, so 16px stands spare on the worst card in the estate.

   The breakpoint moves 40rem → 42rem with it: at 40rem the band would be 100%-limited to under
   34rem and the arithmetic above would be a claim about a width the band does not have. 42rem
   (672px) is the narrowest viewport at which `min(100%, 34rem)` actually resolves to 34rem
   here, measured, so the regime and its reserve begin at the same number. */
@media (min-width: 42rem) {
  .staging-band {
    width: min(100%, 34rem);
  }

  .staging-slip {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--staging-verbs-col);
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

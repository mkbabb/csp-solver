<script setup lang="ts">
/**
 * Marginalia — the status voice of the page (design-refinement.md §4.3, D2/D3).
 *
 * One live region, hand-lettered: sighted users and assistive tech read the same
 * handwriting. `role="status"` (polite) — it comments on the *puzzle* ("solved it!",
 * "not quite — check row 4", "a fresh 9×9"), never on infrastructure (network faults
 * go to the assertive note card instead, §5.2).
 *
 * Generic by construction (pencil layer): it renders whatever text + tone it's handed
 * and owns none of the derivation — the domain (SudokuBoard) decides *what* to say.
 * The region element is always mounted so a text change is an announced mutation, not
 * a region that appears mid-solve (which some AT miss). Text writes in with a 250ms
 * clip-path wipe — the logo's own reveal mechanic, shortened; instant under PRM.
 *
 * T3-W9 §2 — the completion block, hoisted:
 * - `meta` — the pencil's own tally under the voice ("0 backtracks — 1ms"), rendered
 *   OUTSIDE the live region (W6 stance kept verbatim: the voice announces the grade;
 *   the tally is there for whoever leans in). Preformatted upstream — same
 *   derivation-free contract as `text`. Always graphite (system law: metadata never
 *   inherits tone — gold and red belong to the verdict alone).
 * - The inline star (F2-C, ratified): on the gold-star tone the verdict line opens
 *   with a 1.1em hand-wonky star — ★ solved it! — the sticker's own geometry demoted
 *   to punctuation. In flow inside the ink span, so it wipes in with the note's own
 *   250ms clip-path write-in: zero subscribers, collision impossible by construction.
 */
withDefaults(
  defineProps<{
    text: string
    tone?: 'graphite' | 'teacher-red' | 'gold-star'
    /** Preformatted tally line below the voice, outside the live region. */
    meta?: string
    /** T3-W12 §1 R1 — visually quiet: the margin vignette carries the verdict's
     *  paint, so the strip renders NOTHING below the board (no fold overflow) while
     *  the live region keeps its DOM home and still announces (sr-only clip, never
     *  visibility/display — those would drop it from the a11y tree mid-announce). */
    quiet?: boolean
  }>(),
  { tone: 'graphite', quiet: false },
)

// The celebration sticker's wonky 5-pointer (CelebrationStar.vue STAR_D) at half
// scale — the same star, demoted to punctuation. viewBox 0 0 24 24.
const NOTE_STAR_D =
  'M11.8,2.1 L14.5,8.7 L21.6,9.1 L15.7,13.3 L18,20.2 L12.1,15.9 L6,20 L8.3,13.2 L2.4,8.8 L9.6,8.9 Z'
</script>

<template>
  <div class="margin-note-block" :class="{ 'is-quiet': quiet }">
    <p class="margin-note" :class="tone" role="status" aria-live="polite" aria-atomic="true">
      <span v-if="text" :key="text" class="margin-note-ink">
        <!-- The inline star: gold verdicts only, decorative (the text carries the grade). -->
        <svg
          v-if="tone === 'gold-star'"
          class="note-star"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :d="NOTE_STAR_D"
            fill="#FDE68A"
            fill-opacity="0.9"
            stroke="#F0B030"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>{{ text }}
      </span>
    </p>
    <!-- The tally: plain text, deliberately OUTSIDE the live region. -->
    <p v-if="meta" :key="meta" class="margin-note-meta">{{ meta }}</p>
  </div>
</template>

<style scoped>
.margin-note-block {
  pointer-events: none;
}

/* Quiet (T3-W12 §1 R1): the classic clip pattern — zero visual footprint, zero
   contributed height (the gold path renders nothing below the board and the fitted
   h-screen page stays unscrolled), while the role=status region stays in the a11y
   tree and keeps announcing the grade. */
.margin-note-block.is-quiet {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.margin-note {
  font-family: var(--font-hand);
  letter-spacing: 0.02em;
  font-size: var(--type-body);
  line-height: var(--type-leading-caption);
  min-height: 1.3em; /* reserve the line so the layout doesn't jump when text arrives */
  margin: 0;
  pointer-events: none;
  user-select: none;
}

.graphite {
  color: var(--color-pencil-graphite, var(--grid-line-color));
}
/* Verdict tones write with the INK tier (T3-W9): the wax crayons fail AA as light-mode
   body text, so the verdict line takes the darkened same-hue ink; dark mode collapses
   ink back into wax at the token layer. Washes/strokes/fills elsewhere keep the wax. */
.teacher-red {
  color: var(--color-red-ink, var(--color-crayon-rose));
}
.gold-star {
  color: var(--color-gold-ink, var(--color-crayon-gold));
}

.margin-note-ink {
  display: inline-block;
  animation: note-write-in 250ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* The inline star: sized to the hand's own em, seated on the baseline like a glyph.
   Foil pair kept from the sticker (#FDE68A wax / #F0B030 stroke) — non-text, wax-tier. */
.note-star {
  display: inline-block;
  width: 1.1em;
  height: 1.1em;
  margin-inline-end: 0.18em;
  vertical-align: -0.15em;
  overflow: visible;
}

/* The tally (T3-W9 §2) — caption rung, two nominal rungs under the voice; graphite at
   reduced pressure via ink-level color-mix (a property of the ink, not the layer, so
   the clip wipe never dims with it). Tone-invariant by construction: gold and red
   belong to the verdict alone. Selectable — a tally someone leans in to read is one
   they may copy — so it re-enables pointer events the margin strip passes through,
   sized to its own text so the dead margin stays click-transparent. */
.margin-note-meta {
  margin: -0.2rem 0 0;
  width: fit-content;
  font-family: var(--font-hand);
  letter-spacing: var(--type-tracking-wide);
  font-size: var(--type-caption);
  line-height: var(--type-leading-caption);
  color: color-mix(in srgb, var(--color-pencil-graphite, var(--grid-line-color)) 62%, transparent);
  pointer-events: auto;
  animation: note-write-in 250ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes note-write-in {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .margin-note-ink,
  .margin-note-meta {
    animation: none;
    clip-path: none;
  }
}
</style>

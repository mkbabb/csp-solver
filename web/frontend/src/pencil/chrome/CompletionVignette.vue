<script setup lang="ts">
/**
 * The grade in the margin — T3-W12 §1 R1 (owner finding 1a: "too small, occludes the
 * bottom of the page, messes up the flow of the page").
 *
 * The completion moment moves OUT of the below-board caption strip and into the
 * teacher's margin — the left column beside the work, ~255px wide at 1440 and empty
 * until now — at real grading scale, tilted like a hand-graded slant:
 *
 *   - the foil star at 6.5–7rem (the draw-on + gleam finally read),
 *   - "solved it!" beneath it in the hand,
 *   - the tally folded into ONE caption line — two text rungs total.
 *
 * Nothing renders below the board on the gold path (the strip goes sr-only-quiet via
 * MarginNote's `quiet`): no fold overflow, no scroll, no occlusion.
 *
 * Composition only — the W9 pieces re-composed, never re-invented: CelebrationStar
 * keeps its dashoffset draw-on + mask-sweep gleam (zero new subscribers); the live
 * region keeps its DOM home in the strip (this whole vignette is aria-hidden
 * decoration; the voice still announces the grade). Stays MOUNTED (v-show) so the
 * star's `active` watch sees the false→true flip — the T3-W9 v-show discipline.
 *
 * Rungs (crit-corrected): ≥1280 the full left-margin vignette; 1024–1279 it docks as
 * a corner-press sticker over the board's top-RIGHT frame (the top-left dock collided
 * with the corner-barb fix AND live top-left digits — crit-design kill #2); <1024
 * (stacked) it renders in flow, centered between board and controls, star at 4.5rem.
 * The drawer (§6) forces the corner-press rung early via `docked` when its open state
 * compresses the left margin (<~1360).
 */
import CelebrationStar from './CelebrationStar.vue'

withDefaults(
  defineProps<{
    active: boolean
    /** The verdict line, verbatim from the margin voice ("solved it!"). */
    text: string
    /** The one-line tally ("0 backtracks — 1ms"), preformatted upstream. */
    meta?: string
    /** Force the corner-press rung regardless of viewport — the drawer's hook (§6). */
    docked?: boolean
  }>(),
  { docked: false },
)
</script>

<template>
  <div
    v-show="active"
    class="completion-vignette"
    :class="{ 'is-docked': docked }"
    aria-hidden="true"
  >
    <div class="vignette-star">
      <CelebrationStar :active="active" />
    </div>
    <p class="vignette-voice">{{ text }}</p>
    <p v-if="meta" class="vignette-meta">{{ meta }}</p>
  </div>
</template>

<style scoped>
.completion-vignette {
  pointer-events: none;
  user-select: none;
  font-family: var(--font-hand);
  text-align: center;
  z-index: 40;
  /* <1024 (stacked): in flow, centered between board and controls. */
  position: static;
  width: fit-content;
  margin: 0.5rem auto 0;
  transform: rotate(-2deg);
}

.vignette-star {
  width: 4.5rem;
  height: 4.5rem;
  margin-inline: auto;
}

.vignette-voice {
  margin: 0.1rem 0 0;
  font-size: 1.5rem;
  line-height: 1.15;
  letter-spacing: 0.02em;
  color: var(--color-gold-ink, var(--color-crayon-gold));
}

/* The tally: the strip's caption rung verbatim — graphite at reduced pressure,
   tone-invariant (metadata never inherits gold). */
.vignette-meta {
  margin: 0.1rem 0 0;
  font-size: var(--type-caption);
  line-height: var(--type-leading-caption);
  letter-spacing: var(--type-tracking-wide);
  color: color-mix(
    in srgb,
    var(--color-pencil-graphite, var(--grid-line-color)) 62%,
    transparent
  );
}

/* The voice + tally write in with the note's own 250ms clip wipe (the logo's reveal
   mechanic, shortened — the strip's grammar, inherited). The star needs nothing: its
   draw-on is dashoffset on the shared chain. */
.vignette-voice,
.vignette-meta {
  animation: vignette-write-in 250ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes vignette-write-in {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

/* ── Row regime base (≥1024): the corner-press sticker over the board's top-RIGHT
   frame — the sticker register the heart established, diagonal-opposite the barb'd
   corner and the top-left digits (crit-design kill #2). Compact: the star straddles
   the corner point; the two rungs tuck tight beneath it. This is ALSO the ≥1280
   drawer-docked pose (`is-docked`). */
@media (min-width: 1024px) {
  .completion-vignette {
    position: absolute;
    top: -2.1rem;
    right: -2.1rem;
    margin: 0;
    width: 8rem;
    transform: rotate(5deg);
  }

  .vignette-star {
    width: 5rem;
    height: 5rem;
  }

  .vignette-voice {
    font-size: 1.05rem;
  }

  /* The corner-press is a STICKER: star + verdict only. The tally would lie
       across live digits at this rung — it stays the strip's secret (and returns
       in the full-margin vignette below). */
  .vignette-meta {
    display: none;
  }
}

/* ── The teacher's margin (≥1280, not drawer-docked): the full left-column vignette
   at the board's optical upper third, −4° hand-graded slant. Width is rung-fitted so
   the star never runs offscreen at 1280 (the margin there is ~180px). */
@media (min-width: 1280px) {
  .completion-vignette:not(.is-docked) {
    top: 17%;
    right: calc(100% + 0.25rem);
    left: auto;
    width: 9.75rem;
    transform: rotate(-4deg);
  }

  .completion-vignette:not(.is-docked) .vignette-star {
    width: 6.5rem;
    height: 6.5rem;
  }

  .completion-vignette:not(.is-docked) .vignette-voice {
    font-size: 1.75rem;
  }

  .completion-vignette:not(.is-docked) .vignette-meta {
    display: block;
  }
}

/* ≥1408: the margin is generous — full grading-sticker scale. */
@media (min-width: 1408px) {
  .completion-vignette:not(.is-docked) {
    right: calc(100% + 1.25rem);
    width: 13rem;
  }

  .completion-vignette:not(.is-docked) .vignette-star {
    width: 7rem;
    height: 7rem;
  }

  .completion-vignette:not(.is-docked) .vignette-voice {
    font-size: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vignette-voice,
  .vignette-meta {
    animation: none;
    clip-path: none;
  }
}
</style>

<script setup lang="ts">
/**
 * Washi label — a scrap of tinted paper tape holding a name over the button.
 * Physical object: translucent paper tape (design-union §1.1 / §3 row 4).
 * Replaces the solid dark tooltip pill (the most generic-app pixel in the
 * panel). Neutral washi, Patrick Hand, seeded torn-tape ends (clip-path),
 * seeded ±1.5° rotation. Blur-0, static, one paint per show. Shows on hover
 * AND :focus-visible — closing the pure-pencil keyboard-tooltip gap
 * (design-refinement §4.4).
 */
import { computed } from "vue";
import { mulberry32 } from "@mkbabb/pencil-boil";

const props = defineProps<{
  text: string;
  /** stable per-button seed so a given label's tear + tilt never re-roll */
  seed: number;
  /** 'above' (default) floats the chip over the parent's top edge; 'center' pins it
   *  to the parent's OWN box — the peek chip sits ON the divider's line (UI-9), never
   *  drifting up into the option text above it. 'tag' straddles the parent's TOP-LEFT
   *  edge — a compartment's own name, taped across its drawn frame (T4-P1 zone grammar).
   *  A tag is a LABEL, not a tooltip: it is always laid down (there is no hover seam to
   *  reveal it) and it drops `role="tooltip"`, which is what makes an `id` on it legal as
   *  the zone's `aria-labelledby` target — the visible tape IS the accessible name. */
  anchor?: "above" | "center" | "tag";
  /** Persistent on coarse pointers (UI-4/UI-5): hover doesn't exist for touch, so the
   *  tape stays laid down there; fine pointers keep the hover/focus reveal untouched.
   *  Like `anchor="tag"`, a persistent tape DROPS `role="tooltip"` (T4-P1, F1 order 4): a
   *  tooltip is a transient description summoned by hover or focus and dismissable by Esc,
   *  and the `.washi-persistent` coarse arm below pins this one at `opacity: 1` forever.
   *  A name that never hides is a LABEL — and the peek surface it names is a bare `<div>`
   *  with no accessible name at all, so the honest reading is the visible one: the tape is
   *  the text of the thing it sits on, not a popup about it. */
  persistent?: boolean;
  /** A longer note (T4-W3 share-fail): let the tape wrap to a couple of lines within a
   *  capped width instead of a single nowrap strip that would overrun the viewport edge
   *  from a sidebar button. Off by default — every existing one-word label is untouched. */
  wide?: boolean;
}>();

/**
 * T5-W3 (a11y r1 L11) — the default (hover/focus) tape is DECORATIVE, not a tooltip.
 *
 * It carried `role="tooltip"` and nothing pointed at it: `aria-describedby` has zero hits
 * estate-wide, so the five default-anchor tapes (Deal / Clear / fill forced / Solve / Share)
 * floated in the tree as unattached furniture whose text merely re-said the button's own
 * `aria-label`. A tooltip no control references is not a tooltip — and the cure is NOT to wire
 * five `aria-describedby`s, which would buy the reader a second recitation of a name they
 * already have. Tag and persistent tapes are untouched: those ARE the name (the
 * `aria-labelledby` targets described above), and hiding them would strip a real accessible
 * name off four compartments and the peek surface.
 */

// Seeded geometry: torn ends on the left/right edges + a small tilt.
const geom = computed(() => {
  const rng = mulberry32(props.seed * 2654435761 + props.text.charCodeAt(0));
  // Six-point clip-path: jagged left edge (2 pts) + jagged right edge (2 pts),
  // top/bottom kept flat-ish. Percentages within the label box.
  const j = () => (rng() - 0.5) * 6; // ±3% jitter
  const lx = 3;
  const rx = 97;
  const clip = [
    `${lx + j()}% 0%`,
    `${rx + j()}% ${8 + j()}%`,
    `100% 50%`,
    `${rx + j()}% ${92 + j()}%`,
    `${lx + j()}% 100%`,
    `0% 50%`,
  ].join(", ");
  const tilt = (rng() - 0.5) * 3; // ±1.5°
  return { clip: `polygon(${clip})`, tilt: `${tilt.toFixed(2)}deg` };
});
</script>

<template>
  <span
    class="washi-label"
    :class="{
      'washi-center': anchor === 'center',
      'washi-tag': anchor === 'tag',
      'washi-persistent': persistent,
      'washi-wide': wide,
    }"
    :style="{ clipPath: geom.clip, '--washi-tilt': geom.tilt }"
    :aria-hidden="anchor === 'tag' || persistent ? undefined : 'true'"
    >{{ text }}</span
  >
</template>

<style scoped>
.washi-label {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) rotate(var(--washi-tilt));
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.7rem;
  font-family: var(--font-hand);
  font-size: var(--type-small);
  font-weight: 600;
  letter-spacing: var(--type-tracking-normal);
  white-space: nowrap;
  color: var(--color-foreground);
  /* neutral washi — tinted translucent paper tape (design-union §7.3) */
  background: var(--sheet-washi-neutral);
  border: none;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms;
  z-index: 50;
}

/* Shown on button hover (parent .group) or keyboard focus. */
.group:hover .washi-label,
.group:focus-visible .washi-label {
  opacity: 1;
}

/* anchor="center": the chip pins to the parent's own box — tape ON the ruled line
   (the peek divider), not a floater over whatever sits above it (UI-9). */
.washi-center {
  bottom: auto;
  top: 50%;
  left: 50%;
  margin-bottom: 0;
  transform: translate(-50%, -50%) rotate(var(--washi-tilt));
}

/* anchor="tag" (T4-P1 zone grammar): the compartment's own name, taped ASTRIDE its drawn
   top-left edge — the one asymmetry in a card of centred stanzas, and the thing that makes a
   well read as a labelled compartment rather than a second card. Always laid down: a zone name
   has no hover seam. Lower case in the hand, one rank under the eyebrows it replaces, and
   lower case is also the only chimera-free path through Patrick Hand (its uppercase subset is
   {C,R,S} — F5's shared finding, taken). */
.washi-tag {
  bottom: auto;
  top: 0;
  left: 0.85rem;
  margin-bottom: 0;
  padding: 0.02rem 0.4rem;
  font-size: var(--type-caption);
  font-weight: 500;
  letter-spacing: var(--type-tracking-wide);
  text-transform: lowercase;
  opacity: 1;
  /* Straddles the frame: half the tape's height hangs inside the box, which is what the
     well's padding-top has to clear (GameControlPanel `.tray-well`). */
  transform: translateY(-52%) rotate(var(--washi-tilt));
}

/* A longer note (T4-W3 share-fail): the tape wraps within a capped width and centers its
   lines, so "couldn't copy — link is in the address bar" sits as a small paper note over the
   button instead of a nowrap strip running off a sidebar edge. */
.washi-wide {
  white-space: normal;
  /* max-content lets the tape grow to its text, capped at max-width so it wraps to ~2 lines
       — without it, an absolutely-positioned label shrink-wraps against its 44px button box
       and breaks after ~1 word. */
  width: max-content;
  max-width: 15rem;
  text-align: center;
  line-height: 1.3;
}

/* UI-4: on coarse pointers a persistent chip is the affordance — there is no hover
   to reveal it. Fine pointers never match, so the hover grammar above is untouched. */
@media (pointer: coarse) {
  .washi-persistent {
    opacity: 1;
  }
}

/* prefers-reduced-transparency: the tape becomes an opaque card (blur-0 already). */
@media (prefers-reduced-transparency: reduce) {
  .washi-label {
    background: var(--color-card);
  }
}
</style>

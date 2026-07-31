<script setup lang="ts">
/**
 * The teacher's-well status line (T4-P1 · F2 zone grammar) — the one thing the Check row
 * cannot say for itself.
 *
 * `useAssists` carries a FOURTH state the UI has never shown: `checkArmed` (`useAssists.ts:40`).
 * Entering — or re-tapping — "Ask" arms a point-in-time snapshot (`:44`); the next board edit
 * clears it (`:63`). So today a player taps Ask, types a digit, and the check silently goes
 * stale; the cure for going stale is re-tapping the option that already looks selected. That
 * same-value re-emit is load-bearing (it is why `errorCheckMode` stays a manual prop+emit rather
 * than `defineModel`, whose hasChanged guard would swallow it) and it is invisible. This
 * component is the whole of the fix: it renders `proactiveCheck` — is the teacher marking your
 * board RIGHT NOW — and names the reason.
 *
 * PRESSURE = STATE, WORDS = REASON. The graphite pressure carries `marking` (one bit, two
 * rungs — quiet 68% / firm foreground); the sentence carries why, which is where the three
 * modes and the stale snapshot live. Two rungs only, monotone by construction, so G6's
 * inversion has no third value to hide in. Zero new vocabulary: it is the shipped
 * `.icon-sublabel.is-armed` idiom (a label that changes voice with state) applied to a standing
 * state instead of a 2.5s one, and it spends no rose at all — the hue keeps its existing three
 * meanings undiluted (D9 discipline).
 *
 * A drawn-pencil rendering was built and measured against this one in pass 2 (`CHECK_RENDERING`,
 * a one-word switch over both branches). It lost on its own charter's centre: in the same slot
 * the sentence puts 47% more ink on the paper at 2.5× the density, and in the state that matters
 * — armed-then-stale — the pen could say only "put away" while the row still read "Ask": it
 * carried the state but never the reason. Deleted at pass-3 close, not left beside the winner.
 */
import { computed } from "vue";
import type { ErrorCheckMode } from "./useAssists";

const props = defineProps<{
  /** `proactiveCheck` — live, or on-demand with the snapshot still armed. */
  marking: boolean;
  mode: ErrorCheckMode;
}>();

const text = computed(() => {
  if (props.mode === "off") return "not marking";
  if (props.mode === "live") return "marking as you go";
  return props.marking ? "marked · showing mistakes" : "board changed · Ask again";
});

// What a screen reader is told. The visible line is a fragment in the hand; this is the
// sentence, and it names the recovery in the one state that has one.
const spoken = computed(() =>
  props.marking
    ? "Checking this board for mistakes"
    : props.mode === "on-demand"
      ? "Not checking — the board changed since the last check. Choose Ask again."
      : "Not checking this board",
);
</script>

<template>
  <p class="check-status" :class="{ 'is-marking': marking }" role="status">
    <span aria-hidden="true">{{ text }}</span>
    <span class="sr-only">{{ spoken }}</span>
  </p>
</template>

<style scoped>
.check-status {
  margin-top: 0.15rem;
  font-family: var(--font-hand);
  font-size: var(--type-caption);
  line-height: 1.15;
  letter-spacing: var(--type-tracking-wide);
  text-align: center;
  /* The quiet rung — T4-W10 gate 1's ledgered graphite floor (5.23:1 light / 6.06:1 dark on
     --color-card, where 60% sat at 4.10). The literal is the estate token (Lane D ship 4). */
  color: var(--ink-press-quiet);
  font-weight: 400;
}

/* The firm rung. */
.check-status.is-marking {
  color: var(--color-foreground);
  font-weight: 600;
}
</style>

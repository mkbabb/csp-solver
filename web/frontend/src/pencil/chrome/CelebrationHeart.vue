<script setup lang="ts">
/**
 * The felt heart at the crest — F2-C's reward, rendered as F7 §3.2's Heart Fruit
 * (T3-W9). Board BOTTOM-RIGHT, ~3.5rem — the diagonal opposite of the margin text,
 * so the star-note collision class dies by geometry.
 *
 * T6 mark 15: the heart joins the motion vocabulary. `plush-bounce` (the retired JS
 * tween's exact poses), `plush-blink` on the eyes at a bound delay, `plush-murmur`
 * when the classroom's window falls here — three named verbs from assets/index.css,
 * with CELEBRATION's numbers bound in. The sequence subscriber, the three timers, and
 * the hand-rolled lerp/easeOut go with them: this component now owns state, not motion.
 *
 * Every scale/squash/blink transform lands on this HOST WRAPPER or the eyes group —
 * never the filtered <g> (#wobble-heart's ±10% region stays honest, and the preset
 * itself is NEVER retuned: three hover easter eggs share it, F7 §1.4).
 *
 * PRM: mounts static at rest scale — no bounce, no blink; the murmur no-ops.
 */
import { ref, watch, onUnmounted } from "vue";
import { usePrefersReducedMotion } from "@mkbabb/pencil-boil";
import { CELEBRATION } from "@pencil/config/pencilConfig";
import {
  registerMurmurHeart,
  unregisterMurmurHeart,
} from "@pencil/composables/celebration";
import CrayonHeart from "./AttributionCard/CrayonHeart.vue";

const props = defineProps<{ active: boolean }>();

const visible = ref(false);
const settled = ref(false);
const landed = ref(false);
const murmuring = ref(false);
const reducedMotion = usePrefersReducedMotion();

const bounceDur = `${CELEBRATION.heartBounceMs}ms`;
const crestDelay = `${CELEBRATION.heartCrestMs}ms`;
const murmurDur = `${CELEBRATION.wiggleCycleMs}ms`;
const blinkDur = `${CELEBRATION.heartBlinkMs}ms`;
// The blink is post-crest ambient: one shut-and-open, that long after the bounce settles.
const blinkDelay = `${CELEBRATION.heartCrestMs + CELEBRATION.heartBounceMs + CELEBRATION.heartBlinkDelayMs}ms`;

/** Murmur participation (F2 §C): 1-in-8 seeded windows the classroom's wiggle is
 *  the heart's. Two-frame retrigger so the verb restarts on repeat windows. */
function wiggleOnce() {
  if (reducedMotion.value) return;
  murmuring.value = false;
  requestAnimationFrame(() => {
    murmuring.value = true;
  });
}

// The bounce is a MOMENT: when it lands it leaves the animation list for good (`landed`),
// so the murmur can own the host outright — no two-name list whose re-write might restart
// the bounce. Landing is also the hand-off to the classroom. Blink and murmur compose
// rather than conflict — one transforms `.eyes`, the other the host — so the old mutual
// guard is gone with the timers that needed it.
function onEnd(e: AnimationEvent) {
  if (e.animationName.startsWith("plush-murmur")) murmuring.value = false;
  else if (e.animationName.startsWith("plush-bounce")) {
    landed.value = true;
    registerMurmurHeart({ wiggleOnce });
  }
}

// `immediate` + the `prev === undefined` probe: mounted-with-active (a remount while
// solved) settles instantly; a live false→true flip keeps the crest bounce (§1 P5).
watch(
  () => props.active,
  (a, prev) => {
    settled.value = prev === undefined || reducedMotion.value;
    visible.value = a;
    murmuring.value = false;
    landed.value = settled.value;
    if (!a) unregisterMurmurHeart();
    // A heart that never plays its bounce still murmurs with the classroom.
    else if (settled.value) registerMurmurHeart({ wiggleOnce });
  },
  { immediate: true },
);

onUnmounted(unregisterMurmurHeart);
</script>

<template>
  <div
    v-if="visible"
    class="celebration-heart"
    :class="{ 'is-murmuring': murmuring, 'is-landed': landed, 'is-settled': settled }"
    aria-hidden="true"
    @animationend="onEnd"
  >
    <CrayonHeart variant="celebration" :size="44" />
  </div>
</template>

<style scoped>
/* Hangs off the board's bottom-right corner — the sticker register, diagonal opposite
   of the margin voice. T3-W12 §1 R1 raised it to 3.5rem to CROWN the corner instead of
   grazing the fold (the a1 forensics had its old -1.1rem overhang ending 7px shy of the
   viewport edge at 1440×806).

   T7-W7 — it crowned the corner by SITTING ON IT: at bottom -0.4rem the 56px sticker
   reached 42×50px back into the last cell, which is where that cell writes its digit, so
   every completed board finished by inking a heart over its own bottom-right answer
   (measured 1280×800: heart 614–670 × 614–670, last cell 553–656 × 545–648). The cure is
   the DROP, not the reach: `bottom` now clears the cell's bottom edge, so the sticker
   hangs BELOW the fold at the corner and the last digit reads whole. The right overhang
   shrinks with it — at 390 the gutter outside the board is 12px, so the horizontal axis
   had no room to give and never needed to. What is below the board at the crest is empty
   by construction: MarginNote goes `quiet` while the vignette carries the verdict. */
.celebration-heart {
  position: absolute;
  right: -0.6rem;
  /* 3.5rem (the sticker) less the 2px the cell grid insets from the wrapper, rounded out
     to a hair of daylight: the heart's top edge lands ~4px under the last cell. */
  bottom: -3.6rem;
  width: 3.5rem;
  height: 3.5rem;
  pointer-events: none;
  z-index: 3;
  will-change: transform;
  animation: plush-bounce v-bind(bounceDur) linear v-bind(crestDelay) backwards;
}

.celebration-heart :deep(svg) {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* The blink: eyes grouped inside the (unscaled) filtered content — squashing an
   interior child never grows the filter region. */
.celebration-heart :deep(.eyes) {
  transform-box: view-box;
  transform-origin: 50px 40px;
  animation: plush-blink v-bind(blinkDur) linear v-bind(blinkDelay) backwards;
}

/* Landed: the bounce is spent, and the host is the murmur's to take. */
.celebration-heart.is-landed {
  animation: none;
}

.celebration-heart.is-landed.is-murmuring {
  animation: plush-murmur v-bind(murmurDur) ease-in-out;
}

/* Settled (a remount while solved) or PRM: the reward is simply there, at rest. */
.celebration-heart.is-settled :deep(.eyes) {
  animation: none;
}
</style>

/**
 * The shared boil beat — T3-W12 §2 P1 (the settled page learns to idle).
 *
 * One module-level counter, driven by exactly ONE imperative subscriber on
 * pencil-boil's unified rAF chain. Every perpetual boil consumer derives its frame
 * index from this counter (`useBeatFrame`), so however many marks boil, their DOM
 * writes coalesce into the SAME tick — ~8 dirty frames/s with idle frames between,
 * instead of N subscribers each anchored to its own `lastTick` spraying an
 * invalidation into nearly every 8ms frame (the a1 elimination ladder's finding:
 * 45 sparse writers ≈ one continuous one).
 *
 * Gates, inherited not reimplemented:
 * - PRM: the library's central gate force-clears every subscriber — the driver
 *   included — so the beat freezes and every derived boil freezes in place. A PRM
 *   disengage re-arms the driver here (imperative handles never auto-resume; that's
 *   the library's own resume discipline).
 * - Tab visibility: the one chain parks on hidden; the beat simply stops arriving.
 * - Subscriber floor: the driver runs only while a consumer is enrolled
 *   (ref-counted), so an empty page returns to the zero-subscriber ambient floor.
 */
import { onUnmounted, ref, watch, type Ref } from "vue";
import { createBoilTicker, usePrefersReducedMotion } from "@mkbabb/pencil-boil";
import { MOTION } from "@pencil/config/pencilConfig";

const beat = ref(0);
let consumers = 0;

// createBoilTicker ping-pongs its own internal frame index; we ignore it — the
// callback fires once per elapsed interval window, which is all a monotone counter
// needs (missed windows while throttled collapse to one edge, matching the
// scheduler's own catch-up semantics for a beat that is a clock, not a wall time).
const driver = createBoilTicker(2, MOTION.beatMs, () => {
  beat.value++;
});

const prm = usePrefersReducedMotion();
// Module-level watch, never disposed — the beat is app-lifetime chrome. On a PRM
// disengage the library does NOT auto-resume imperative handles; re-arm iff consumers
// are still enrolled. (start() self-guards on PRM, so the engage direction is free.)
watch(prm, (reduced) => {
  if (!reduced && consumers > 0) driver.start();
});

/** The shared beat counter. Component-setup only (enrolls an onUnmounted). */
export function useBoilBeat(): Readonly<Ref<number>> {
  consumers++;
  if (consumers === 1) driver.start();
  onUnmounted(() => {
    consumers--;
    if (consumers === 0) driver.stop();
  });
  return beat;
}

/**
 * Derive a boil frame from the shared beat.
 *
 * - `frameCount` ≤ 1 freezes IN PLACE (the `heldFrameCount` hold-gate contract and
 *   the static-mark no-op, unchanged from the useBoilFrame shape it replaces).
 * - `stepEveryBeats` maps slower cadences onto the beat grid (`beatsFor`), so a
 *   750ms band still lands its swap inside the same dirty frame as everyone else.
 */
export function useBeatFrame(
  frameCount: () => number,
  stepEveryBeats: () => number = () => 1,
): Readonly<Ref<number>> {
  const sharedBeat = useBoilBeat();
  const frame = ref(0);
  watch(sharedBeat, (b) => {
    const total = Math.max(1, Math.floor(frameCount()));
    if (total <= 1) return; // held or static — freeze in place, no snap to 0
    const every = Math.max(1, Math.floor(stepEveryBeats()));
    if (b % every !== 0) return;
    frame.value = (frame.value + 1) % total;
  });
  return frame;
}

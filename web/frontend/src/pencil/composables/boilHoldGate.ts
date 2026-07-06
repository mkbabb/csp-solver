/**
 * Boil-hold gate — the answer-key peek's freeze contract (design-union §4.1 / §4.2).
 *
 * A hold pauses Band-A/B boil subscribers (grid, control-panel divider) IN PLACE
 * — the frame ref simply stops advancing, with no snap to frame 0.
 *
 * Mechanism: `heldFrameCount()` wraps a frame-count getter so it collapses to 1
 * while any hold is active. W8's landed unified scheduler (`boilScheduler.ts`)
 * withdraws a subscriber whose count drops to ≤1 — `useBoilFrame`'s `watchEffect`
 * calls `stop()`, and `stop()` leaves `currentFrame` untouched — so the mark
 * freezes on its current frame. On release the count returns to its real value,
 * the subscriber re-enrols with `lastTick = 0`, and the boil resumes mid-cadence.
 * This is the "freeze the page while the teacher lays the key over it" contract.
 *
 * Renamed from the union prototype's colliding `boilScheduler.ts` (an exact
 * filename clash with W8's OWN unified rAF scheduler). The two have disjoint
 * responsibilities — that one schedules frames, this one gates a frame-count
 * getter — and this module introduces NO second rAF chain: it rides W8's
 * scheduler by construction, verified against its `useBoilFrame` (stops at
 * frameCount ≤ 1, `stop()` preserves `currentFrame`). Folds into pencil-boil
 * 0.5.0's centralized scheduler gate alongside PRM + visibility (§4.1).
 */
import { computed, ref } from 'vue';

const holds = ref<Set<string>>(new Set());

/** True while any hold is active — a boil consumer gates its cadence on this. */
export const isBoilHeld = computed(() => holds.value.size > 0);

export function acquireHold(reason: string): void {
  if (holds.value.has(reason)) return;
  const next = new Set(holds.value);
  next.add(reason);
  holds.value = next;
}

export function releaseHold(reason: string): void {
  if (!holds.value.has(reason)) return;
  const next = new Set(holds.value);
  next.delete(reason);
  holds.value = next;
}

/**
 * Wrap a frame-count getter so it collapses to 1 (a static frame) while held.
 * A boil consumer passes `heldFrameCount(() => BOIL_CONFIG.frameCount)` to
 * `useBoilFrame`; the getter reactively returns 1 during a hold, tripping the
 * scheduler's `frameCount ≤ 1` stop path, then returns to its real value on
 * release. No second chain — the same W8 scheduler, one gate more.
 */
export function heldFrameCount(base: () => number): () => number {
  return () => (isBoilHeld.value ? 1 : base());
}

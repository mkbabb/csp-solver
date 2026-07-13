import { ref, type Ref } from "vue";

/**
 * Stacked-regime detection (T3-W11 U-A) — true below the lg rung (1024px), where the
 * scene stacks and the mobile panel card (the DigitPad's home) is the one on screen.
 * Twin of useCoarsePointer's module-level MediaQueryList pattern: one shared listener,
 * reactive across resize/rotation (an iPad crossing 1023↔1024 swaps panel cards, and
 * the pad + virtual-keyboard suppression must swap with it).
 */
const stacked = ref(true);

if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  const mq = window.matchMedia("(max-width: 1023px)");
  stacked.value = mq.matches;
  mq.addEventListener?.("change", (e) => {
    stacked.value = e.matches;
  });
}

export function useStackedLayout(): Ref<boolean> {
  return stacked;
}

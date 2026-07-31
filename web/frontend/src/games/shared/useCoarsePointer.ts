import { ref, type Ref } from "vue";

/**
 * Media-query refs (T3-W11 U-A) — ONE module-level MediaQueryList per query, shared by
 * every consumer (boards, panels, cells; a per-instance listener would be N× for no gain).
 * `initial` is the no-DOM value only.
 */
export function mediaRef(query: string, initial = false): Ref<boolean> {
  const r = ref(initial);
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    const mq = window.matchMedia(query);
    r.value = mq.matches;
    // Safari <14 lacks addEventListener on MQL; the value is then load-time static,
    // which is correct for every real device (a pointer class doesn't hot-swap).
    mq.addEventListener?.("change", (e) => {
      r.value = e.matches;
    });
  }
  return r;
}

const coarse = mediaRef("(pointer: coarse)");
const rowRegime = mediaRef("(min-width: 1024px)");

/**
 * Coarse-pointer detection. The PRIMARY pointer governs: phones and tablets are coarse,
 * touch laptops stay fine (their primary pointer is the trackpad) — so the desktop hover
 * grammar is structurally untouched by any coarse-only affordance keyed off this ref.
 */
export function useCoarsePointer(): Ref<boolean> {
  return coarse;
}

/**
 * The row regime (≥1024) — the ONE ref that decides which control-panel twin exists.
 * GameScene mounts the stacked card OR the drawer rail, never both (P1-W4), and
 * `useControlsDrawer` gates its §6 regime rule on this same ref, so the regime the
 * drawer obeys and the regime the DOM carries cannot disagree. It matches Tailwind's
 * `lg` (64rem) by construction, which is what the classes on those two elements say.
 */
export function useRowRegime(): Ref<boolean> {
  return rowRegime;
}

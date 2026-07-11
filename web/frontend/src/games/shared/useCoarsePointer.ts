import { ref, type Ref } from "vue";

/**
 * Coarse-pointer detection (T3-W11 U-A) — one module-level MediaQueryList shared by
 * every consumer (boards, panels, cells; a per-instance listener would be N× for no
 * gain). The PRIMARY pointer governs: phones and tablets are coarse, touch laptops
 * stay fine (their primary pointer is the trackpad) — so the desktop hover grammar
 * is structurally untouched by any coarse-only affordance keyed off this ref.
 */
const coarse = ref(false);

if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    const mq = window.matchMedia("(pointer: coarse)");
    coarse.value = mq.matches;
    // Safari <14 lacks addEventListener on MQL; the value is then load-time static,
    // which is correct for every real device (a pointer class doesn't hot-swap).
    mq.addEventListener?.("change", (e) => {
        coarse.value = e.matches;
    });
}

export function useCoarsePointer(): Ref<boolean> {
    return coarse;
}

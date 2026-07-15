import { onBeforeUnmount, onMounted, type Ref } from "vue";
import { MOTION } from "@pencil/config/pencilConfig";

/**
 * The carousel track glide (T4-W12 §6) — the same FLIP-on-WAAPI discipline the drawer
 * rides (useControlsDrawer's mover engine), applied to a scroll-snap track. Wave C
 * extracts that engine into `useFlipGlide` and this composable consumes it; Wave B builds
 * the glide inline against the same rules so the seam is proven first.
 *
 * Two position mechanisms, one truth (`scrollLeft`):
 *  · TOUCH / trackpad — native `scroll-snap-type: x mandatory` inertia. On settle we read
 *    the centered card and report it (`onSnap`), so aria + the live region follow a swipe.
 *  · KEYBOARD / button — a step must ride the ONE glass curve (`MOTION.curves.drawerGlide`),
 *    which CSS `scroll-behavior: smooth` cannot express (the drawer's exact reason for WAAPI
 *    over a CSS transition). So we FLIP: read FIRST scrollLeft, jump scrollLeft to the target
 *    snap point (the one layout write), invert the delta on the track's `translateX`, then
 *    animate translateX → 0 on the glass curve, one clock, monotone, zero overshoot. At
 *    settle the transform clears; scrollLeft already rests on the snap point, so native snap
 *    pins it. The scrollLeft never tweens — exactly one position write per step.
 *
 * PRM: `glideTo` collapses to an instant `jumpTo` (no tween frames).
 */

const GLIDE_MS = MOTION.cardStepMs;
const GLIDE_EASING = MOTION.curves.drawerGlide;
/** Never-never backstop (App.vue's seam-guard grammar): a glide whose `finished` can't
 *  resolve (unmounted mid-flight) settles late, never never. */
const SETTLE_GUARD_MS = GLIDE_MS + 200;

interface GlideOptions {
  reducedMotion: () => boolean;
  /** Fired only on a NATIVE (touch/trackpad) snap settle — programmatic steps already
   *  know their target, so they do not re-report through here (no feedback loop). */
  onSnap: (index: number) => void;
}

export function useCarouselGlide(
  viewport: Ref<HTMLElement | null>,
  track: Ref<HTMLElement | null>,
  options: GlideOptions,
) {
  let anim: Animation | null = null;
  let settleTimer: number | null = null;
  let gen = 0;
  let currentIndex = 0;
  let resizeObs: ResizeObserver | null = null;

  function slots(): HTMLElement[] {
    return track.value ? (Array.from(track.value.children) as HTMLElement[]) : [];
  }

  /** The leading/trailing spacer width that lets the first/last card scroll to true center:
   *  (viewport − slot) / 2, in px, published as `--edge` for the track's `::before/::after`.
   *  A fixed px value, recomputed on mount/resize — a CSS % basis collapses under max-content. */
  function recomputeEdges() {
    const vp = viewport.value;
    const t = track.value;
    const slot = slots()[0];
    if (!vp || !t || !slot) return;
    const edge = Math.max(0, (vp.clientWidth - slot.getBoundingClientRect().width) / 2);
    t.style.setProperty("--edge", `${edge}px`);
  }

  /** The scrollLeft that centers slot `i` in the viewport — the scroll-snap-align:center
   *  point (measured via rects so it is independent of offsetParent), clamped to range. */
  function targetScrollLeft(i: number): number {
    const vp = viewport.value;
    const el = slots()[i];
    if (!vp || !el) return 0;
    const vpRect = vp.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const centerInContent =
      elRect.left - vpRect.left + vp.scrollLeft + elRect.width / 2;
    const raw = centerInContent - vp.clientWidth / 2;
    const max = vp.scrollWidth - vp.clientWidth;
    return Math.max(0, Math.min(max, raw));
  }

  function centeredIndex(): number {
    const vp = viewport.value;
    if (!vp) return 0;
    const center = vp.scrollLeft + vp.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slots().forEach((el, idx) => {
      const c = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) {
        bestDist = d;
        best = idx;
      }
    });
    return best;
  }

  function clearAnim() {
    if (anim) {
      anim.cancel();
      anim = null;
    }
    if (track.value) track.value.style.transform = "";
    if (settleTimer !== null) {
      clearTimeout(settleTimer);
      settleTimer = null;
    }
  }

  /** Native snap is SUSPENDED for the duration of a programmatic move: `scroll-snap-type:
   *  mandatory` animates a programmatic scrollLeft set (a native smooth snap that fights the
   *  WAAPI transform), so we drop to `none`, write scrollLeft instantly, and re-arm snap only
   *  at settle — with the position already resting on the snap point, so no re-snap fires. */
  function suspendSnap() {
    viewport.value?.style.setProperty("scroll-snap-type", "none");
  }
  function rearmSnap() {
    // Re-arm on the next frame (position already on a snap point → no re-snap animation);
    // clearing the inline override falls back to the stylesheet's `x mandatory`.
    const vp = viewport.value;
    if (!vp) return;
    requestAnimationFrame(() => {
      if (viewport.value === vp) vp.style.removeProperty("scroll-snap-type");
    });
  }

  function settle() {
    gen++;
    clearAnim();
    rearmSnap();
  }

  /** Instant — mount, resize, PRM. No tween, no report. */
  function jumpTo(i: number) {
    clearAnim();
    recomputeEdges();
    currentIndex = i;
    const vp = viewport.value;
    if (!vp) return;
    suspendSnap();
    vp.scrollLeft = targetScrollLeft(i);
    rearmSnap();
  }

  /** The glass-curve step (keyboard/button). FLIP on WAAPI — one position write, one clock,
   *  the drawer's discipline: snap is OFF for the whole glide so the transform owns the
   *  motion outright, and the animation's `to` is the REST pose (fill:none reverts to it, no
   *  flash), exactly like the drawer's movers. */
  function glideTo(i: number) {
    const vp = viewport.value;
    const t = track.value;
    if (!vp || !t) return;
    recomputeEdges();
    currentIndex = i;
    if (options.reducedMotion()) {
      jumpTo(i);
      return;
    }
    const first = vp.scrollLeft;
    clearAnim(); // drop any prior transform so the target read is clean
    const last = targetScrollLeft(i);
    if (Math.abs(first - last) < 0.5) return; // already centered — nothing to glide
    suspendSnap(); // snap OFF for the whole glide (re-armed at settle)
    vp.scrollLeft = last; // the ONE position write — instant (snap suspended), never tweened
    // Classic FLIP: scrollLeft now rests at the target, so tx = (last − first) reproduces the
    // pre-move frame (a point renders at x − scrollLeft + tx); the transform then glides to 0,
    // the centered rest pose. scrollLeft itself never moves again this gesture.
    const dx = last - first;
    const myGen = ++gen;
    anim = t.animate(
      [{ transform: `translateX(${dx}px)` }, { transform: "translateX(0px)" }],
      {
        duration: GLIDE_MS,
        easing: GLIDE_EASING,
        composite: "replace",
        fill: "none",
      },
    );
    // One clock (the drawer's §3-S3 discipline): pin the start so the first painted
    // frame already carries motion — no pending-start dead frame.
    const clock = document.timeline.currentTime;
    if (typeof clock === "number") anim.startTime = clock;
    void anim.finished
      .then(() => {
        if (myGen === gen) settle();
      })
      .catch(() => {
        /* cancelled by a newer step — its own settle owns the track */
      });
    settleTimer = window.setTimeout(() => {
      if (myGen === gen) settle();
    }, SETTLE_GUARD_MS);
  }

  // ── Native snap detection → onSnap (touch / trackpad inertia) ──
  let scrollDebounce: number | null = null;
  function reportSnap() {
    if (anim) return; // a programmatic step owns position; do not double-report
    options.onSnap(centeredIndex());
  }
  function onScroll() {
    if (scrollDebounce !== null) clearTimeout(scrollDebounce);
    scrollDebounce = window.setTimeout(reportSnap, 90);
  }

  onMounted(() => {
    const vp = viewport.value;
    vp?.addEventListener("scroll", onScroll, { passive: true });
    vp?.addEventListener("scrollend", reportSnap);
    recomputeEdges();
    // On resize: refresh the spacer widths and re-center the current card (the glide never
    // tweens a resize — an instant re-pin, like the drawer's regime-resize settle).
    if (vp && typeof ResizeObserver !== "undefined") {
      resizeObs = new ResizeObserver(() => jumpTo(currentIndex));
      resizeObs.observe(vp);
    }
  });
  onBeforeUnmount(() => {
    const vp = viewport.value;
    vp?.removeEventListener("scroll", onScroll);
    vp?.removeEventListener("scrollend", reportSnap);
    resizeObs?.disconnect();
    if (scrollDebounce !== null) clearTimeout(scrollDebounce);
    clearAnim();
  });

  return { glideTo, jumpTo };
}

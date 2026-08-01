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

  /** How far the deck can travel — two sources, larger wins: the engine's own `scrollWidth −
   *  clientWidth`, and GEOMETRY, the last slot's box plus the trailing `--edge` less the
   *  viewport.
   *
   *  WebKit omits a ZERO-AREA box from a scroll container's scrollable overflow region, so
   *  before `align-self: stretch` landed on the spacers (2ea11998) it reported a scrollWidth
   *  448 px short of the deck's real width — and this clamp inherited that as its ceiling,
   *  which is how kenken went unreachable by arrows, End, click and deep-link alike. Measured
   *  on BOTH WebKit builds against the same artifact, darwin (Apple) and the runner's linux
   *  playwright-webkit — the engine of CI run 30687323601: zero-area spacers give 2208 / max
   *  960 in each, stretched gives 2656 / 1408 in each. Chromium counts the box either way.
   *
   *  What the floor does NOT do, measured rather than hoped: it cannot RECOVER a build that
   *  excludes the air. `scrollLeft` is clamped by the engine on write — a target of 1408, or
   *  of 99999, both land on 960 there — and the settle then reports the card that really is
   *  centered, so arrows, End and deep-link all still rest one card short with the floor
   *  exactly as without it. The declaration in the stylesheet is the cure; there is no cure
   *  available here, and a clamp that pretended otherwise would only lie about position. What
   *  the floor is for is narrower and worth the four lines: how far the deck reaches is a
   *  fact about the deck, so the composable computes it instead of inheriting whatever one
   *  engine says its scrollWidth is, and never asks for LESS travel than the geometry allows.
   *  `glideTo` reads the position back so that asking for more is always safe. On every
   *  engine measured the two numbers are equal. */
  function maxScroll(): number {
    const vp = viewport.value;
    const t = track.value;
    if (!vp) return 0;
    const engine = vp.scrollWidth - vp.clientWidth;
    const all = slots();
    const last = all[all.length - 1];
    if (!t || !last) return Math.max(0, engine);
    const edge = parseFloat(t.style.getPropertyValue("--edge")) || 0;
    return Math.max(
      0,
      engine,
      last.offsetLeft + last.offsetWidth + edge - vp.clientWidth,
    );
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
    return Math.max(0, Math.min(maxScroll(), raw));
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
  /** Re-arm on the next frame (position already on a snap point → no re-snap animation);
   *  clearing the inline override falls back to the stylesheet's `x mandatory`.
   *
   *  GENERATION-GUARDED, and that guard is the whole of CI run 30687323601's WebKit reds. A
   *  rAF is not a promise about the next 16 ms: under load it lands late, and the event loop
   *  dispatches queued INPUT before it runs the rendering update — so a keypress arriving
   *  during the jank is handled BEFORE a rAF the PREVIOUS gesture's settle already queued.
   *  That stale re-arm switched `x mandatory` back on in the MIDDLE of the next glide, while
   *  the track still carried its FLIP translateX; the engine then snapped the scroll back to
   *  the visually-centered (pre-move) card, `centeredIndex()` read that correctly, and
   *  `syncFromScroll` reported the revert as truth. One step silently undone — `gallery-deal`
   *  stranded one card short of kenken, and `gallery-guard`'s ribbon never armed because the
   *  step it depends on had been rolled back. Only the newest gesture may re-arm. */
  function rearmSnap(forGen: number) {
    const vp = viewport.value;
    if (!vp) return;
    requestAnimationFrame(() => {
      if (viewport.value === vp && forGen === gen)
        vp.style.removeProperty("scroll-snap-type");
    });
  }

  function settle() {
    gen++;
    clearAnim();
    rearmSnap(gen);
  }

  /** Instant — mount, resize, PRM. No tween, no report. */
  function jumpTo(i: number) {
    clearAnim();
    recomputeEdges();
    currentIndex = i;
    const vp = viewport.value;
    if (!vp) return;
    const myGen = ++gen; // this gesture owns position — any pending re-arm is stale
    suspendSnap();
    vp.scrollLeft = targetScrollLeft(i);
    rearmSnap(myGen);
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
    const myGen = ++gen;
    suspendSnap(); // snap OFF for the whole glide (re-armed at settle)
    vp.scrollLeft = last; // the ONE position write — instant (snap suspended), never tweened
    // Classic FLIP: scrollLeft now rests at the target, so tx = (last − first) reproduces the
    // pre-move frame (a point renders at x − scrollLeft + tx); the transform then glides to 0,
    // the centered rest pose. scrollLeft itself never moves again this gesture.
    // READ BACK, don't assume: the engine clamps the write to its own scrollable overflow, so
    // the delta the transform inverts has to be what the scroll ACTUALLY did — otherwise the
    // track glides in from a pose the position never left (the `maxScroll` floor above can ask
    // for more travel than a given build will give).
    const dx = vp.scrollLeft - first;
    if (Math.abs(dx) < 0.5) {
      rearmSnap(myGen); // the engine refused the move — no dead animation, snap back on
      return;
    }
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

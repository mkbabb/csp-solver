import { onBeforeUnmount, onMounted, type Ref } from "vue";
import { MOTION } from "@pencil/config/pencilConfig";

/**
 * The carousel track glide (T4-W12 §6) — the same FLIP-on-WAAPI discipline the drawer
 * rides (useControlsDrawer's mover engine), applied to a scroll-snap track. Wave C
 * extracts that engine into `useFlipGlide` and this composable consumes it; Wave B builds
 * the glide inline against the same rules so the seam is proven first.
 *
 * Three position mechanisms, one truth (`scrollLeft`):
 *  · TOUCH / trackpad — native `scroll-snap-type: x mandatory` inertia. On settle we read
 *    the centered card and report it (`onSnap`), so aria + the live region follow a swipe.
 *  · MOUSE / PEN drag — the deck follows the pointer 1:1 (`scrollLeft` written per move) and
 *    the RELEASE settles through `glideTo`, so a drag ends on the same glass curve, through
 *    the same `onSnap` seam, with the a11y contract byte-identical to a swipe's.
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
/** Below this the press is a CLICK, not a drag — the deck never moves and the card selects. */
const DRAG_SLOP = 5;
/** Release velocity (px/ms) above which the deck takes the flick as a card step. */
const FLICK_VPX = 0.45;
/** The shortest interval the velocity is allowed to be measured over. Pointer moves arrive
 *  coalesced, and a pair landing inside the same millisecond divides a real px delta by ~1 —
 *  which the EMA's 0.7 weight then reads as a hard flick out of a gesture that barely moved.
 *  Measured: a two-sample 20px push read −2.2 px/ms and stepped a card it had no business
 *  stepping. Half a frame is the floor; below it the sample accumulates instead. */
const SAMPLE_MS = 8;

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
  /** The live pointer drag: the grab's anchor (`x0`/`sl0`), the previous sample (`px`/`t`) and
   *  the smoothed release velocity. `froze` records that the grab cancelled a glide, so the
   *  no-drag release knows it still owes a settle. */
  let drag: {
    x0: number;
    sl0: number;
    px: number;
    t: number;
    v: number;
    froze: boolean;
  } | null = null;
  let dragging = false;
  let suppressClick = false;

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
    // HOISTED ABOVE THE NO-OP RETURN, and that is the whole of the fix. This gesture owns
    // position from here, so every path out of it — including the one that glides nowhere —
    // is the newest generation and may re-arm.
    const myGen = ++gen;
    const last = targetScrollLeft(i);
    if (Math.abs(first - last) < 0.5) {
      // Already centered — nothing to glide, but NOT nothing to do. Every caller until the
      // pointer drag reached this line with snap still armed, so the bare `return` was
      // harmless for all of them; a drag release arrives with snap SUSPENDED (the move
      // suspended it) and would strand `scroll-snap-type: none` on the viewport forever —
      // touch inertia stops snapping for the rest of the page's life. The invariant this
      // pays: no path out of a drag leaves snap suspended.
      rearmSnap(myGen);
      return;
    }
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
    // A programmatic step or a live drag owns position; do not double-report. The drag's own
    // release reports ONCE, from the settled target, so the deck never announces the cards it
    // merely travelled past.
    if (anim || dragging) return;
    options.onSnap(centeredIndex());
  }
  function onScroll() {
    if (scrollDebounce !== null) clearTimeout(scrollDebounce);
    scrollDebounce = window.setTimeout(reportSnap, 90);
  }

  // ── THE POINTER DRAG (mouse / pen) ──
  // Touch already drags — native snap plus native inertia, untouched here (the `pointerType`
  // bail below is what keeps it that way). What was missing was the mouse: the deck LOOKS like
  // a spread of paper you push, and on a desktop it could only be stepped. The drag writes
  // `scrollLeft` and nothing else, so the one truth stays one truth, and the release hands the
  // target to `glideTo` — the same glass curve every other step rides.
  function onPointerDown(e: PointerEvent) {
    const vp = viewport.value;
    if (!vp || e.pointerType === "touch" || e.button !== 0) return;
    // THE MID-GLIDE FREEZE, and the ORDER IS LOAD-BEARING: read the track's live transform
    // BEFORE `clearAnim()` drops it, then fold it into `scrollLeft`. A point renders at
    // `layout − scrollLeft + tx`, so subtracting tx holds the pose the deck is SHOWING; read
    // after the cancel and the matrix is identity and the deck jumps under the cursor.
    let froze = false;
    if (anim && track.value) {
      const tx = new DOMMatrixReadOnly(getComputedStyle(track.value).transform).m41;
      clearAnim();
      vp.scrollLeft -= tx;
      froze = true;
    }
    // NO POINTER CAPTURE, and that is a measured choice rather than an omission. Capture
    // retargets the compatibility mouse events to the capturing element, so a `click` that
    // began on a card is dispatched at the VIEWPORT instead — measured in Chromium, and it
    // silently kills click-to-select for every plain press. The move/up listeners sit on the
    // WINDOW instead, which is what capture was standing in for: they reach us wherever the
    // pointer goes, and nothing inside the deck (the live board's own handlers among them) can
    // swallow the release. The click a drag leaves behind is then swallowed on its own terms,
    // identically in both engines.
    suppressClick = false; // a release that landed outside the deck can't leave this armed
    drag = {
      x0: e.clientX,
      sl0: vp.scrollLeft,
      px: e.clientX,
      t: e.timeStamp,
      v: 0,
      froze,
    };
  }

  function onPointerMove(e: PointerEvent) {
    const vp = viewport.value;
    const d = drag;
    if (!vp || !d) return;
    const dx = e.clientX - d.x0;
    if (!dragging) {
      if (Math.abs(dx) < DRAG_SLOP) return; // a press under the slop stays a click
      dragging = true;
      ++gen; // this gesture owns position — any pending re-arm is stale
      suspendSnap();
      vp.classList.add("is-dragging");
    }
    const dt = e.timeStamp - d.t;
    if (dt >= SAMPLE_MS) {
      // 0.7/0.3 EMA — the release reads the flick, not the last noisy sample.
      d.v = 0.7 * ((e.clientX - d.px) / dt) + 0.3 * d.v;
      d.t = e.timeStamp;
      d.px = e.clientX;
    }
    vp.scrollLeft = d.sl0 - dx;
  }

  function onPointerUp(e?: PointerEvent) {
    const vp = viewport.value;
    const d = drag;
    drag = null;
    if (!vp || !d) return;
    if (!dragging) {
      // A press that never moved is a click, and the card is free to take it. It may still
      // have frozen a glide, though, and that glide's settle went with it — so hand the
      // position back to `glideTo`, which re-arms snap on every path out.
      if (d.froze) glideTo(centeredIndex());
      return;
    }
    dragging = false;
    vp.classList.remove("is-dragging");
    suppressClick = true;
    // THE RELEASE IS A SAMPLE, and it is the one that decides the gesture. `onPointerMove`
    // SKIPS any pair closer than SAMPLE_MS and leaves the travel to accumulate against the
    // last anchor — but a gesture that ENDS inside that window accumulated into nothing, and
    // `v` is still its initial 0: the hardest flick a mouse can throw reads as a dead settle.
    // MEASURED on linux WebKit (T7-WGATE gallery-swallow-cure §2), the whole defect one
    // millisecond wide: the driver's three interpolated moves for a 160 px flick landed
    // 2/7/7 ms after the press, every one under the floor, `v` stayed 0, `dir` read 0, and the
    // release snapped the deck back to the card it came from. The same push in the run before
    // it landed its third move at 8 ms, sampled, and stepped correctly.
    //
    // So the release folds the outstanding leg in — over its own duration, floored at the same
    // half-frame the sampler uses, so it can never divide a real delta by ~0. Two arms and no
    // third: a leg that spans a full sample window carries information, and a gesture that
    // never sampled at all has nothing else to go on. Anything shorter than a window on top of
    // an existing `v` is left alone — it holds no new information, and folding a zero-travel
    // leg in would DAMP a real flick by the EMA's 0.7.
    const legMs = (e?.timeStamp ?? d.t) - d.t;
    if (legMs >= SAMPLE_MS || d.v === 0) {
      const span = Math.max(SAMPLE_MS, legMs);
      d.v = 0.7 * (((e?.clientX ?? d.px) - d.px) / span) + 0.3 * d.v;
    }
    // READ THE POSITION BACK rather than assuming the writes took (this file's own maxScroll
    // discipline): the engine clamps `scrollLeft` to its scrollable overflow, so where the
    // deck IS is the only honest `from`.
    const from = centeredIndex();
    const dir = d.v < -FLICK_VPX ? 1 : d.v > FLICK_VPX ? -1 : 0;
    const target = Math.max(0, Math.min(slots().length - 1, from + dir));
    options.onSnap(target); // the touch path's own seam — aria, the live region, guard-dismiss
    glideTo(target);
  }

  /** The capture-phase swallow. A release fires a `click` on whatever card sat under the
   *  pointer, and GameCard's own bubble-phase `@click` would select it — a drag that ends over
   *  a card must never choose it. Capture on the ANCESTOR means the card's listener is never
   *  reached; a plain click (no drag) leaves the flag clear and passes straight through. */
  function onClickCapture(e: MouseEvent) {
    if (!suppressClick) return;
    suppressClick = false;
    e.stopPropagation();
    e.preventDefault();
  }
  function onDragStart(e: Event) {
    e.preventDefault(); // no native text/image drag inside the deck
  }

  onMounted(() => {
    const vp = viewport.value;
    vp?.addEventListener("scroll", onScroll, { passive: true });
    vp?.addEventListener("scrollend", reportSnap);
    vp?.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    vp?.addEventListener("click", onClickCapture, { capture: true });
    vp?.addEventListener("dragstart", onDragStart);
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
    vp?.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
    vp?.removeEventListener("click", onClickCapture, { capture: true });
    vp?.removeEventListener("dragstart", onDragStart);
    resizeObs?.disconnect();
    if (scrollDebounce !== null) clearTimeout(scrollDebounce);
    clearAnim();
  });

  return { glideTo, jumpTo };
}

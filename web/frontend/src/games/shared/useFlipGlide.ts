import { MOTION } from "@pencil/config/pencilConfig";

/**
 * useFlipGlide (T4-W12 §8, the M10 distillation) — the FLIP-on-WAAPI mover engine,
 * EXTRACTED verbatim from useControlsDrawer's glide (:156-318) so the drawer AND the
 * gallery's board⇄card fold ride ONE proven primitive. This is the wave's NAMED RISK:
 * the drawer is the four-times-owner-audited surface, so the extraction is a strict
 * no-behavior-change refactor — the drawer's e2e (`drawer.spec`) easing + goldens are
 * byte-for-π unedited — before any second consumer builds on it.
 *
 * The discipline, kept intact (the drawer's §3 S1–S4):
 *  · Classic FLIP: the caller reads FIRST rects pre-flip, lands the target layout ONCE,
 *    reads LAST rects (the single forced layout), and hands each mover a [from → to]
 *    delta. THE CRIT KILL (`flipTransform`): the filtered element's LAYOUT rests at its
 *    FINAL size; the transform scales it to *look* like FIRST, so it rasters ONCE and
 *    only its transform channel tweens — the size is never tweened.
 *  · Explicit [from, to] keyframes, `composite: replace`, `fill: none`: the animation
 *    owns the transform channel outright, then releases to the underlying rest value —
 *    no "previous committed style" to capture as a phantom-teleport base.
 *  · ONE glass curve (`MOTION.curves.drawerGlide` by default), ONE clock (every mover
 *    pinned to the same `startTime` — zero stagger, no pending-start dead frame).
 *  · Mid-glide re-click retargets by REVERSAL (`anim.reverse()`, velocity-plausible,
 *    zero new keyframes).
 *  · The settle clears finished animations + inline origins ONLY (no layout, no
 *    re-raster); the domain's layout re-flip / focus rides `onSettle`. A generation
 *    token voids a stale gesture's finished callback; a guard timer is the never-never
 *    backstop (a glide that can't finish settles late, never never).
 *
 * It owns the animation MECHANICS; the caller owns WHICH elements move, their FLIP
 * deltas, and the settle side-effects (via `onSettle`). Module-level safe (no lifecycle
 * hooks) — the drawer is a module singleton.
 */

/** The FLIP rect inputs — `DOMRect` (from `getBoundingClientRect`) assigns straight in. */
export interface FlipRect {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

const cx = (r: FlipRect) => r.left + r.width / 2;
const cy = (r: FlipRect) => r.top + r.height / 2;

/**
 * The FLIP transform mapping a FIRST rect onto an element whose LAYOUT already rests at
 * the LAST rect — center-anchored translate + uniform scale. THE CRIT KILL lives here:
 * the element's layout size IS the LAST (final) size; the transform scales it to look
 * like FIRST, so the filtered box rasters ONCE at its final size and only its transform
 * tweens. `scale = first.width / last.width`; pair with `transformOrigin: "50% 50%"` so
 * the translate maps centers. (Byte-identical to the drawer host mover's own string.)
 */
export function flipTransform(first: FlipRect, last: FlipRect): string {
  const s = last.width === 0 ? 1 : first.width / last.width;
  return `translate(${cx(first) - cx(last)}px, ${cy(first) - cy(last)}px) scale(${s})`;
}

/** One mover: an element, its FROM transform (the inverted old-pose delta), its TO
 *  transform (the rest pose — identity for a plain FLIP), and an optional origin. */
export interface FlipMover {
  el: HTMLElement;
  from: string;
  to: string;
  transformOrigin?: string;
}

export interface FlipGlideOptions {
  /** Glide duration (ms). The drawer passes 520; a carousel card-step 440. */
  durationMs: number;
  /** The easing — defaults to the ONE house glass curve (`MOTION.curves.drawerGlide`). */
  easing?: string;
  /** Never-never backstop: a glide whose `finished` can't resolve settles late, never
   *  never. Defaults to `durationMs + 220` (the drawer's `SETTLE_GUARD_MS`). */
  settleGuardMs?: number;
  /** Run at settle (natural finish, reversed finish, or the guard) AFTER the movers are
   *  cancelled + origins cleared. The domain's layout re-flip / focus lives here. */
  onSettle?: () => void;
}

export interface FlipGlideController {
  /** Start a glide: one WAAPI animation per mover (`composite: replace`, `fill: none`)
   *  on the glass curve, ALL pinned to one clock. Supersedes any in-flight glide
   *  silently (no `onSettle` — the new gesture owns the settle). */
  run(movers: FlipMover[]): void;
  /** Mid-glide retarget: each mover plays its own curve backwards from its current
   *  pose. Resets the settle guard; a no-op when nothing is in flight. */
  reverse(): void;
  /** Force-settle now: cancel animations, clear inline origins, invoke `onSettle`.
   *  Idempotent — a no-op when no glide is active. */
  settle(): void;
  /** True while movers are in flight. */
  readonly active: boolean;
}

export function useFlipGlide(options: FlipGlideOptions): FlipGlideController {
  const easing = options.easing ?? MOTION.curves.drawerGlide;
  const guardMs = options.settleGuardMs ?? options.durationMs + 220;

  let movers: { el: HTMLElement; anim: Animation }[] = [];
  let settleTimer: number | null = null;
  /** Generation token — a stale gesture's `finished` callback must never settle a
   *  later one (a `run`/`settle` bump voids it). */
  let gen = 0;
  let active = false;

  function clearGuard() {
    if (settleTimer !== null) {
      clearTimeout(settleTimer);
      settleTimer = null;
    }
  }

  /** Cancel the live animations + drop their inline origins — the mechanical teardown
   *  shared by a fresh `run` (which then rebuilds) and a `settle` (which fires domain). */
  function teardown() {
    for (const m of movers) {
      m.anim.cancel();
      m.el.style.transformOrigin = "";
    }
    movers = [];
  }

  /** The settle — the true layout landed at ONSET (classic FLIP), so this clears
   *  finished animations, drops the inline transform-origins, then hands the domain its
   *  layout re-flip / focus via `onSettle`: no layout step, no re-raster, no snap. */
  function settle() {
    if (!active) return;
    gen++; // stale finished-callbacks are void from here
    clearGuard();
    teardown();
    active = false;
    options.onSettle?.();
  }

  function run(specs: FlipMover[]) {
    // A fresh gesture supersedes any prior one WITHOUT firing its settle side-effects
    // (the new gesture owns the settle): clear the guard + old animations, then build.
    // From idle (the drawer's only entry) `movers` is already empty — a strict no-op.
    clearGuard();
    teardown();
    const myGen = ++gen;
    for (const spec of specs) {
      if (spec.transformOrigin != null)
        spec.el.style.transformOrigin = spec.transformOrigin;
      const anim = spec.el.animate([{ transform: spec.from }, { transform: spec.to }], {
        duration: options.durationMs,
        easing,
        composite: "replace",
        fill: "none",
      });
      movers.push({ el: spec.el, anim });
    }
    // One clock, literally (§3-S3): every mover pinned to the same startTime — zero
    // stagger, and the FIRST painted frame already carries motion (no pending-start
    // dead frame — a pending animation renders progress 0 until the UA assigns a start).
    const clock = document.timeline.currentTime;
    if (typeof clock === "number") for (const m of movers) m.anim.startTime = clock;
    active = true;
    // Settle keys off the movers themselves; the guard stays the never-never backstop.
    void Promise.allSettled(movers.map((m) => m.anim.finished)).then(() => {
      if (myGen === gen) settle();
    });
    settleTimer = window.setTimeout(settle, guardMs);
  }

  /** Re-click mid-glide (§3-S4): retarget by REVERSAL — each mover plays its own curve
   *  backwards from its current pose (velocity-plausible, zero new keyframes). The same
   *  `finished` promises resolve at the reversed settle. */
  function reverse() {
    if (!active) return;
    for (const m of movers) m.anim.reverse();
    clearGuard();
    settleTimer = window.setTimeout(settle, guardMs);
  }

  return {
    run,
    reverse,
    settle,
    get active() {
      return active;
    },
  };
}

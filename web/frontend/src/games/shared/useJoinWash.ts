/**
 * useJoinWash — T8-W3 lane C (M14). THE ONE OWNER OF EVERY NUMBER in the join / leave /
 * return language (apotheosis §1c, §2.6).
 *
 * The session stamps `at` and emits events; this module owns the policy and every timing.
 * Nothing here imports the wire, and nothing on the wire knows these numbers — which is the
 * whole point of the ruling: lane C tunes by editing `WASH` below and touching no protocol.
 *
 * THE THREE BEATS (§2.6, verbatim windows):
 *
 *   JOIN    1180ms, ceiling 0.95   J1 well 0–320 · J2 name 140–520 · J3 ring 200–720 ·
 *                                  J4 hold 720–980 · J5 let go 980–1180
 *   LEAVE    740ms, ceiling 0.45   L1 ring retreats 0–420 · L2 name quiets 260–520 ·
 *                                  L3 well closes 420–740        (muted AND reversed)
 *   RETURN   880ms, ceiling 0.65   R1 row 0–280 · R2 name 120–440 · R3 ring 180–620 ·
 *                                  R4 let go 620–880             (a return isn't news)
 *
 * J1/J2, L2/L3, R1/R2 are CSS on the roster row itself (GameControlPanel) and ride no
 * subscriber at all — this module only ARMS them, by naming the row's phase. J3/J5, L1,
 * R3/R4 are the board ring, and they are ONE `createSequenceSubscription` handle, ever.
 *
 * THE FOUR RULES (§2.6):
 *
 *   1  BOOT SUPPRESSION, 1200ms — peers met within 1200ms of the wire starting to carry are
 *      the room you walked into, not arrivals. Measured ground: every page `hi`s and acks on
 *      entry, so joining a room of four fires four events inside one round trip (596ms to
 *      first contact, T6.1). A trailing debounce cannot express this; only the clock can.
 *   2  COALESCE, 400ms — joins inside the window are ONE trace, in the last joiner's ink.
 *   3  PER-ID MIN-GAP, 4000ms — a flapping peer cannot strobe the ring.
 *   4  ONE HANDLE, EVER — a beat arriving past the absorb window supersedes silently
 *      (`useFlipGlide`'s discipline; `SequenceHandle.stop()` never throws in any phase).
 *      Never two rings.
 *
 * RULE 2 IS A LEADING-EDGE ABSORB, and that is a deliberate, stated reading of "400ms
 * trailing" (the one place this file departs from the design's literal mechanism). A trailing
 * debounce delays the ring's onset by 400ms while the roster row — which is `role="log"` and
 * by rule 2's own second sentence NEVER coalesces — lands at once. J1/J2 would then run 400ms
 * ahead of J3 and the table's registration (well at 0, name at 140, ring at 200) would be a
 * fiction. So the first join starts the beat on its own moment; a join inside the next 400ms
 * RE-INKS the running ring in place instead of restarting it. That is "one trace, in the last
 * joiner's ink" exactly, and it is strictly quieter than the restart rule 4 would otherwise
 * license.
 *
 * PRM: nothing runs. `progress` stays 0, so the ring's layer mounts no geometry at all
 * (HandDrawnGrid's `v-for … : []`); the row phases are never armed, so the write-in and the
 * fold never fire; a departing row is dropped same-frame rather than held. Reachable, static,
 * no motion (§2.7).
 *
 * ZERO STEADY-STATE COST: every beat is a finite `sequence` handle that self-unsubscribes,
 * the ring's layer is unmounted at rest (progress 0), and the geometry is grain-BAKED — no
 * `filter=` is ever minted, so the census stays 9.
 */
import { ref, shallowRef, watch } from "vue";
import {
  createSequenceSubscription,
  easeInCubic,
  easeOutCubic,
  linear,
  type SequenceHandle,
} from "@mkbabb/pencil-boil";

/**
 * The session's join/leave event, structurally. This is `SessionEvent` as the apotheosis
 * declares it (§2.1) — typed here rather than imported so the policy composable depends on
 * nothing in the wire's module, which is the fence §1c draws. The session's own export is
 * assignable to this by construction; the binding site (GameBoard) is where the two meet.
 */
export interface JoinWashEvent {
  type: "join" | "rejoin" | "leave";
  id: string;
  slug: string;
  /** the `--color-user-ink` rebinding — playerIdentity's own shape, not a colour string. */
  ink: Record<string, string>;
  /** `performance.now()` at receipt. Every clock comparison below reads THIS, never a
   *  second clock, so a test drives the whole policy by handing it numbers. */
  at: number;
}

/** What `bindJoinWash` needs from the session, and the whole of it. */
export interface JoinWashSource {
  subscribe: (cb: (e: JoinWashEvent) => void) => () => void;
  /** Is the wire carrying? Read REACTIVELY — a false→true edge re-arms boot suppression, and
   *  the edge that matters most carries no event with it: a socket that drops and reconnects
   *  announces nothing on the way down, so a policy that sampled `live` at event time would
   *  never see the edge and the whole re-announce burst would strobe the ring. */
  live: () => boolean;
}

/**
 * EVERY NUMBER. Tuning happens here and nowhere else.
 *
 * `ceiling` is the ring's `stroke-opacity` at its fullest: the join's 0.95 is the progress
 * trace's own weight (someone is here, all the way round the board), the leave's 0.45 is
 * "muted" and the return's 0.65 is the middle rung a return earns — lighter than an arrival,
 * heavier than a departure.
 *
 * J4's 260ms hold (720→980) is the owner knob: "briefly" is the owner's word and this is the
 * design's reading of it. It is the gap between `drawTo` and `fadeFrom` — widen or close it
 * there and nothing else moves.
 */
export const WASH = {
  bootSuppressMs: 1200,
  coalesceMs: 400,
  minGapMs: 4000,
  join: {
    durationMs: 1180,
    ceiling: 0.95,
    drawFrom: 200,
    drawTo: 720,
    fadeFrom: 980,
    fadeTo: 1180,
    /** J1+J2's span — how long the row's own CSS arm stays on before it is disarmed. */
    rowArmMs: 520,
  },
  rejoin: {
    durationMs: 880,
    ceiling: 0.65,
    drawFrom: 180,
    drawTo: 620,
    fadeFrom: 620,
    fadeTo: 880,
    rowArmMs: 440,
  },
  leave: {
    durationMs: 740,
    ceiling: 0.45,
    retractTo: 420,
    /** L2+L3's span — how long a departed row is held on screen before it is dropped. */
    rowHoldMs: 740,
  },
} as const;

/** A window's own 0→1, clamped. */
const span = (t: number, a: number, b: number): number =>
  b <= a ? (t >= b ? 1 : 0) : Math.max(0, Math.min(1, (t - a) / (b - a)));

/**
 * `--ease-fadeOut` is `cubic-bezier(0.32, 0, 0.67, 0)`, whose two y control points are both
 * zero: its output is exactly the bezier parameter cubed, and its x curve (0.32/0.67, either
 * side of the thirds) is linear to within 1% across the whole domain. So the shipped
 * `easeInCubic` IS that curve to a sub-pixel over a 200ms opacity ramp, and the tail needs no
 * bezier solver of its own. `--ease-accelIn` is `easeInCubic` outright.
 */
const fadeOut = easeInCubic;

// ── The state the surfaces read ───────────────────────────────────────────────────────────

/** the board ring's dash front, 0..1 — 0 mounts NO geometry (the PRM form, and the rest pose) */
export const traceProgress = ref(0);
/** the ring's `stroke-opacity` — the per-beat ceiling, ramped out by the beat's own tail */
export const traceOpacity = ref(0);
/** whose ring it is: the peer's `--color-user-ink` rebinding, bound as a style object */
export const traceInk = shallowRef<Record<string, string>>({});
/** id → the row phase currently armed on the roster, so the well's CSS knows which beat */
export const arriving = ref<Record<string, "join" | "rejoin">>({});
/** rows held past their departure for L2/L3 — the well cannot animate a row it has dropped */
export const departing = ref<
  { id: string; slug: string; ink: Record<string, string> }[]
>([]);
/**
 * How many ring beats have started. The single-flight proof reads this beside
 * `schedulerDebugInfo().kinds.sequence`: N beats, one live subscriber.
 */
export const beats = ref(0);

// ── The policy's own memory ───────────────────────────────────────────────────────────────

let handle: SequenceHandle | null = null;
let beatAt = 0;
let beatKind: "join" | "rejoin" | "leave" | null = null;
let bootAt = Number.NEGATIVE_INFINITY;
const lastBeatFor: Record<string, number> = {};
const timers = new Set<ReturnType<typeof setTimeout>>();

function later(fn: () => void, ms: number): void {
  if (ms <= 0) {
    fn();
    return;
  }
  const t = setTimeout(() => {
    timers.delete(t);
    fn();
  }, ms);
  timers.add(t);
}

/** The event stamp's own clock (`SessionEvent.at` IS `performance.now()` at receipt), so the
 *  boot mark and every event are read off one ruler and never two. */
function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function reduced(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function rest(): void {
  traceProgress.value = 0;
  traceOpacity.value = 0;
}

/** Rule 4, the whole of it: one handle, stopped before another is ever started. */
function supersede(): void {
  handle?.stop();
  handle = null;
}

function runRing(e: JoinWashEvent): void {
  supersede();
  traceInk.value = e.ink;
  beatAt = e.at;
  beatKind = e.type;
  beats.value += 1;

  if (e.type === "leave") {
    const c = WASH.leave;
    traceProgress.value = 1;
    traceOpacity.value = c.ceiling;
    handle = createSequenceSubscription({
      durationMs: c.durationMs,
      easing: linear,
      onProgress: (_eased, raw) => {
        const t = raw * c.durationMs;
        // L1 — the ring RETREATS to the corner it started from, at the muted ceiling. It is
        // fully gone by 420ms, and a retracted ring renders nothing, so the beat needs no
        // fade of its own: the un-drawing IS the exit.
        traceProgress.value = 1 - easeInCubic(span(t, 0, c.retractTo));
        traceOpacity.value = c.ceiling;
      },
      onComplete: () => {
        handle = null;
        beatKind = null;
        rest();
      },
    });
  } else {
    const c = e.type === "rejoin" ? WASH.rejoin : WASH.join;
    traceProgress.value = 0;
    traceOpacity.value = c.ceiling;
    handle = createSequenceSubscription({
      durationMs: c.durationMs,
      easing: linear,
      onProgress: (_eased, raw) => {
        const t = raw * c.durationMs;
        // J3 / R3 — the board takes their colour, clockwise from the top-left corner the
        // frame's own trace starts at. J5 / R4 — it lets go; the dash NEVER retracts, so what
        // fades is a completed ring rather than an unfinished one.
        traceProgress.value = easeOutCubic(span(t, c.drawFrom, c.drawTo));
        traceOpacity.value = c.ceiling * (1 - fadeOut(span(t, c.fadeFrom, c.fadeTo)));
      },
      onComplete: () => {
        handle = null;
        beatKind = null;
        rest();
      },
    });
  }
  handle.start();
}

function armRow(e: JoinWashEvent): void {
  if (e.type === "leave") {
    departing.value = [
      ...departing.value.filter((r) => r.id !== e.id),
      { id: e.id, slug: e.slug, ink: e.ink },
    ];
    later(() => {
      departing.value = departing.value.filter((r) => r.id !== e.id);
    }, WASH.leave.rowHoldMs);
    return;
  }
  const c = e.type === "rejoin" ? WASH.rejoin : WASH.join;
  arriving.value = { ...arriving.value, [e.id]: e.type };
  // The arm EXPIRES. A CSS animation replays whenever its element is re-inserted, so a class
  // left on after its beat is an arm that re-fires on the next DOM move of the roster — the
  // exact standing arm T8-W6 rooted out of the reveal wave. It lives from the moment the row
  // is named to the end of its own window, and not one frame longer.
  later(() => {
    const next = { ...arriving.value };
    delete next[e.id];
    arriving.value = next;
  }, c.rowArmMs);
}

function onEvent(e: JoinWashEvent): void {
  if (reduced()) {
    // The instant-cut form of every moment: the ring never renders, the row lands written and
    // open, a departure is removed same-frame. Nothing is armed, so nothing can move.
    rest();
    return;
  }
  if (e.at - bootAt < WASH.bootSuppressMs) return; // rule 1
  if (e.at - (lastBeatFor[e.id] ?? Number.NEGATIVE_INFINITY) < WASH.minGapMs) return; // rule 3

  lastBeatFor[e.id] = e.at;

  // Rule 2 — the absorb. A join landing inside 400ms of a running join's onset re-inks the
  // ring where it stands: one trace, the last joiner's ink, no restart. A leave is never
  // absorbed (it is a different sentence), and it supersedes whatever is in flight.
  const absorbable =
    e.type !== "leave" &&
    beatKind !== null &&
    beatKind !== "leave" &&
    e.at - beatAt < WASH.coalesceMs;

  if (absorbable) traceInk.value = e.ink;
  else runRing(e);

  armRow(e);
}

/**
 * Bind the wash to the session's event stream. Idempotent by replacement — the returned
 * teardown is the only way off, and it resets the policy whole. Called once, by the board.
 */
export function bindJoinWash(src: JoinWashSource): () => void {
  resetJoinWash();
  // Rule 1's edge, watched rather than sampled (see `JoinWashSource.live`). `sync` because the
  // room's own burst can land in the very tick the socket comes up, and a deferred flush would
  // let the first arrivals through the gate the edge exists to close. Binding into an ALREADY
  // live session arms it too — a board that mounts into a room in progress is walking into it.
  bootAt = src.live() ? nowMs() : Number.NEGATIVE_INFINITY;
  const stopLive = watch(
    () => src.live(),
    (isLive, was) => {
      if (isLive && !was) bootAt = nowMs();
    },
    { flush: "sync" },
  );
  const off = src.subscribe(onEvent);

  if (import.meta.env.DEV) {
    // The two-rings audition's driver (T8-W3 lane C's MUST-LOOK gate). It feeds the REAL
    // policy a real event, so what the audition looks at is the shipped beat rather than a
    // mock of it. `import.meta.env.DEV` is a compile-time constant, so a production build
    // folds the branch away and takes the handle with it — the same gate the local wire arm
    // ships behind (useSession.ts).
    (window as unknown as Record<string, unknown>).__joinWashAudition = onEvent;
  }

  return () => {
    stopLive();
    off();
    if (import.meta.env.DEV) {
      delete (window as unknown as Record<string, unknown>).__joinWashAudition;
    }
    resetJoinWash();
  };
}

/** Back to rest: no handle, no timers, no arms, no memory of who beat when. */
export function resetJoinWash(): void {
  supersede();
  for (const t of timers) clearTimeout(t);
  timers.clear();
  beatKind = null;
  beatAt = 0;
  bootAt = Number.NEGATIVE_INFINITY;
  for (const k of Object.keys(lastBeatFor)) delete lastBeatFor[k];
  arriving.value = {};
  departing.value = [];
  traceInk.value = {};
  beats.value = 0;
  rest();
}

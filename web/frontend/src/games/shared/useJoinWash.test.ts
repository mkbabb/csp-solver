/**
 * useJoinWash — the four rules, on the clock (T8-W3 lane C).
 *
 * DETERMINISTIC BY CONSTRUCTION, not by patience: every clock comparison the policy makes reads
 * the event's own `at` stamp, so a test drives the whole of rules 1–3 by handing it numbers and
 * never waits for one. Fake timers cover the two `setTimeout`s the policy owns (the roster row's
 * CSS arm, and the departed row's hold) — the ONE place a real wall clock would otherwise decide
 * whether an assertion is true.
 *
 * The ring itself rides pencil-boil's rAF scheduler and is deliberately NOT asserted frame by
 * frame here: what these rows hold is WHETHER A BEAT WAS SPENT and WHOSE INK IT CARRIES, which
 * is the whole of the policy. `schedulerDebugInfo()` is the estate's own instrument for the
 * other half — one live `sequence` subscriber, however many supersedes ran through it — and rule
 * 4 is proved against it rather than against a mock.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ref } from "vue";
import { schedulerDebugInfo } from "@mkbabb/pencil-boil";
import {
  WASH,
  arriving,
  beats,
  bindJoinWash,
  departing,
  resetJoinWash,
  traceInk,
  traceProgress,
  type JoinWashEvent,
  type JoinWashSource,
} from "./useJoinWash";

const INK = (hue: number) => ({ "--color-user-ink": `oklch(0.5 0.11 ${hue}deg)` });

function evt(over: Partial<JoinWashEvent> & { at: number }): JoinWashEvent {
  return {
    type: "join",
    id: "peer-a",
    slug: "brave-otter",
    ink: INK(137),
    ...over,
  };
}

/**
 * A source under the test's own hand. `live` is a REF, because the policy watches it rather
 * than sampling it — a socket that drops and reconnects announces nothing on the way down, so
 * the edge is the only signal there is, and a plain closure would hide the very case rule 1's
 * re-arm exists for.
 */
function harness(live = true) {
  const isLive = ref(live);
  let emit: ((e: JoinWashEvent) => void) | null = null;
  const src: JoinWashSource = {
    subscribe: (cb) => {
      emit = cb;
      return () => {
        emit = null;
      };
    },
    live: () => isLive.value,
  };
  const stop = bindJoinWash(src);
  return {
    stop,
    setLive: (v: boolean) => {
      isLive.value = v;
    },
    send: (e: JoinWashEvent) => emit?.(e),
  };
}

/** The boot mark is stamped off `performance.now()` — the same clock `SessionEvent.at` is read
 *  from — so the test drives BOTH from one dial and no assertion waits on a wall. */
let clock = 0;

beforeEach(() => {
  vi.useFakeTimers();
  clock = 0;
  vi.spyOn(performance, "now").mockImplementation(() => clock);
  // No PRM in the default environment; the reduced-motion row installs its own matchMedia.
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q }));
  resetJoinWash();
});

afterEach(() => {
  resetJoinWash();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("rule 1 — boot suppression", () => {
  it("spends no beat on the room you walked into", () => {
    // `live` flips false→true on the very frame the room answers, and the four peers already at
    // the table arrive behind it inside one round trip (596ms measured to first contact, T6.1).
    const h = harness(false);
    clock = 900;
    h.setLive(true);
    h.send(evt({ at: 1000, id: "a" }));
    h.send(evt({ at: 1200, id: "b" }));
    h.send(evt({ at: 1596, id: "c" }));
    expect(beats.value).toBe(0);
    expect(arriving.value).toEqual({});
    h.stop();
  });

  it("beats for the arrival that lands after the window", () => {
    const h = harness(false);
    clock = 900;
    h.setLive(true);
    h.send(evt({ at: 1000, id: "a" })); // inside the window
    h.send(evt({ at: 900 + WASH.bootSuppressMs + 1, id: "b" }));
    expect(beats.value).toBe(1);
    h.stop();
  });

  it("a table YOU opened suppresses nothing that comes to it later", () => {
    // You press invite ten minutes into a solo board: `live` goes true at once and there is no
    // room behind it. The joiner who turns up twenty seconds later is an arrival, not furniture.
    const h = harness(false);
    clock = 10_000;
    h.setLive(true);
    h.send(evt({ at: 30_000, id: "a" }));
    expect(beats.value).toBe(1);
    h.stop();
  });

  it("re-arms when the socket drops and comes back", () => {
    const h = harness(false);
    clock = 900;
    h.setLive(true);
    h.send(evt({ at: 5000, id: "b" })); // an honest arrival, well past the window
    expect(beats.value).toBe(1);

    // THE EDGE THAT CARRIES NO EVENT. A dropped socket announces nothing on the way down, so
    // the re-arm has to come off the watch or it never comes at all.
    clock = 6000;
    h.setLive(false);
    h.setLive(true); // the reconnect's `hi` is answered
    h.send(evt({ at: 6100, id: "c" })); // the re-announce, suppressed
    h.send(evt({ at: 6500, id: "d" }));
    h.send(evt({ at: 7100, id: "e" }));
    expect(beats.value).toBe(1);
    // Past the window, an arrival is an arrival again.
    h.send(evt({ at: 6000 + WASH.bootSuppressMs + 1, id: "f" }));
    expect(beats.value).toBe(2);
    h.stop();
  });
});

describe("rule 2 — coalesce", () => {
  it("two joins inside 400ms are ONE trace, in the last joiner's ink", () => {
    const h = harness();
    h.send(evt({ at: 5000, id: "a", ink: INK(137) }));
    expect(beats.value).toBe(1);
    h.send(evt({ at: 5300, id: "b", slug: "keen-lynx", ink: INK(275) }));
    // Absorbed: no second beat, and the ring standing on the board is now keen-lynx's.
    expect(beats.value).toBe(1);
    expect(traceInk.value).toEqual(INK(275));
    h.stop();
  });

  it("but every roster row still lands — a log's whole office", () => {
    const h = harness();
    h.send(evt({ at: 5000, id: "a" }));
    h.send(evt({ at: 5300, id: "b" }));
    expect(Object.keys(arriving.value).sort()).toEqual(["a", "b"]);
    h.stop();
  });

  it("does not absorb a leave — a departure is a different sentence", () => {
    const h = harness();
    h.send(evt({ at: 5000, id: "a" }));
    h.send(evt({ at: 5100, type: "leave", id: "z", slug: "old-wren" }));
    expect(beats.value).toBe(2);
    h.stop();
  });
});

describe("rule 3 — per-id min-gap", () => {
  it("a flapping peer cannot strobe the ring", () => {
    const h = harness();
    h.send(evt({ at: 5000, id: "a" }));
    h.send(evt({ at: 6000, type: "leave", id: "a" }));
    h.send(evt({ at: 7000, id: "a" }));
    h.send(evt({ at: 8000, type: "leave", id: "a" }));
    expect(beats.value).toBe(1);
    h.stop();
  });

  it("and the gate is PER ID — someone else arriving is still news", () => {
    const h = harness();
    h.send(evt({ at: 5000, id: "a" }));
    h.send(evt({ at: 6000, id: "b" })); // past the absorb window, a different peer
    expect(beats.value).toBe(2);
    h.stop();
  });

  it("the same peer is news again once the gap has passed", () => {
    const h = harness();
    h.send(evt({ at: 5000, id: "a" }));
    h.send(evt({ at: 5000 + WASH.minGapMs, id: "a" }));
    expect(beats.value).toBe(2);
    h.stop();
  });
});

describe("rule 4 — one handle, ever", () => {
  it("supersedes silently: three beats, one live subscriber", () => {
    const h = harness();
    const before = schedulerDebugInfo().kinds.sequence;
    h.send(evt({ at: 5000, id: "a" }));
    h.send(evt({ at: 6000, id: "b" })); // mid-flight (join is 1180ms), past the absorb window
    h.send(evt({ at: 7000, id: "c" }));
    expect(beats.value).toBe(3);
    // Never two rings: each start stopped the one before it.
    expect(schedulerDebugInfo().kinds.sequence - before).toBeLessThanOrEqual(1);
    h.stop();
  });

  it("and the teardown leaves nothing subscribed", () => {
    const h = harness();
    const before = schedulerDebugInfo().kinds.sequence;
    h.send(evt({ at: 5000, id: "a" }));
    h.stop();
    expect(schedulerDebugInfo().kinds.sequence).toBe(before);
    expect(traceProgress.value).toBe(0);
  });
});

describe("the return", () => {
  it("is a rejoin, and it takes the return's own ceiling rather than the join's", () => {
    const h = harness();
    h.send(evt({ at: 5000, type: "rejoin", id: "a" }));
    expect(beats.value).toBe(1);
    expect(arriving.value.a).toBe("rejoin");
    h.stop();
  });
});

describe("the roster's two holds", () => {
  it("disarms the row's CSS when its own window closes", () => {
    // An armed class outlives its beat and re-fires on the next DOM move of the roster — the
    // standing arm T8-W6 rooted out of the reveal wave. The arm expires with the window.
    const h = harness();
    h.send(evt({ at: 5000, id: "a" }));
    expect(arriving.value.a).toBe("join");
    vi.advanceTimersByTime(WASH.join.rowArmMs - 1);
    expect(arriving.value.a).toBe("join");
    vi.advanceTimersByTime(2);
    expect(arriving.value.a).toBeUndefined();
    h.stop();
  });

  it("holds a departed row for its 740ms, then drops it", () => {
    const h = harness();
    h.send(evt({ at: 5000, type: "leave", id: "a", slug: "old-wren" }));
    expect(departing.value.map((r) => r.slug)).toEqual(["old-wren"]);
    vi.advanceTimersByTime(WASH.leave.rowHoldMs - 1);
    expect(departing.value).toHaveLength(1);
    vi.advanceTimersByTime(2);
    expect(departing.value).toHaveLength(0);
    h.stop();
  });
});

describe("PRM — the instant-cut form of every moment", () => {
  it("arms nothing, holds nothing, and never renders a ring", () => {
    vi.stubGlobal("matchMedia", (q: string) => ({
      matches: q.includes("reduced-motion"),
      media: q,
    }));
    const h = harness();
    h.send(evt({ at: 5000, id: "a" }));
    h.send(evt({ at: 9100, type: "leave", id: "a" }));
    // progress 0 is what mounts NO geometry at all in HandDrawnGrid, which is the form §2.7
    // asks for: the trace never renders, the row lands written, a departure is gone same-frame.
    expect(traceProgress.value).toBe(0);
    expect(beats.value).toBe(0);
    expect(arriving.value).toEqual({});
    expect(departing.value).toEqual([]);
    h.stop();
  });
});

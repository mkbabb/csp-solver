import { afterEach, describe, expect, it, vi } from "vitest";
import { droppedFrames, relayWire } from "./relayWire";
import type { Handlers, Kind, Msg } from "./useSession";

/**
 * U5 (T7-W4) — THE RECONNECT, which is the whole of what this arm does about a bad network.
 *
 * The socket is the only thing between two players, and the only thing it promises when it
 * drops is that it will come back: a capped backoff ladder, then a RE-SUBSCRIBE and a
 * RE-ANNOUNCE in that order. Every clause of that sentence is a way to be silently wrong —
 * a ladder that walks off to a ten-minute wait on a table left open overnight, a reconnect
 * that announces into a subscription it does not yet hold (the `hi` answered into nothing,
 * so the board never arrives), a reconnect that mints a NEW subscription id and leaves the
 * old one on the relay, or a `leave()` that races the ladder and reconnects a room the page
 * has walked out of.
 *
 * This is also where the SLOW-NETWORK claim lives. The round-2 proposal put it on CDP
 * throttling, which is chromium-only and so a HOLDOUT violation; the thing worth asserting
 * was never the browser's throttle but this ladder, and the ladder is arithmetic. Fake
 * timers and a stub socket make it deterministic — the row measures the code, not the box
 * it ran on, and cannot flake under suite contention.
 */

const RELAY_URL = "wss://relay.invalid/";

type Frame = [string, ...unknown[]];

/**
 * The socket, stubbed to exactly the surface `relayWire` touches: `readyState`/`OPEN`, `send`,
 * `close`, and the three `on*` slots. Every instance is banked, because the ladder's claim is
 * about how many sockets exist and WHEN.
 */
class FakeSocket {
  static readonly OPEN = 1;
  static made: FakeSocket[] = [];
  readyState = 0;
  sent: string[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(readonly url: string) {
    FakeSocket.made.push(this);
  }
  send(text: string): void {
    this.sent.push(text);
  }
  close(): void {
    this.drop();
  }
  /** The relay accepts us. */
  open(): void {
    this.readyState = FakeSocket.OPEN;
    this.onopen?.();
  }
  /** The link dies — an abnormal 1006 is indistinguishable from any other close up here. */
  drop(): void {
    this.readyState = 3;
    this.onclose?.();
  }
  /** One relay→client `["EVENT", sub, event]`, as `relayWire`'s reader wants it. */
  deliver(from: string, kind: Kind | "bye", data: Msg, topic: string): void {
    this.raw(JSON.stringify({ kind, data, from }), topic);
  }
  /** The same frame with whatever `content` a bad peer, a bad version or a bad network put in
   *  it — the shapes `deliver`'s types cannot say. The reader never looks at the `x` tag (the
   *  relay's filter is what routes), so one topic serves. */
  raw(content: string, topic = "t"): void {
    this.onmessage?.({
      data: JSON.stringify([
        "EVENT",
        "s",
        {
          id: "e",
          pubkey: "peer",
          created_at: 0,
          kind: 20_411,
          tags: [["x", topic]],
          content,
          sig: "",
        },
      ]),
    } as MessageEvent);
  }
}

const frames = (s: FakeSocket): Frame[] => s.sent.map((t) => JSON.parse(t) as Frame);
const content = (f: Frame): { kind: string; data: Msg } =>
  JSON.parse((f[1] as { content: string }).content);

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  FakeSocket.made = [];
});

describe("relayWire — a dropped socket comes back, re-subscribes, re-announces", () => {
  it("walks the capped ladder, then REQs before it says hi — and stops when the page leaves", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("WebSocket", FakeSocket);

    const heard: string[] = [];
    const h: Handlers = {
      message: (kind, _d, from) => heard.push(`${kind}:${from}`),
      peer: (id, joined) => heard.push(`peer:${id}:${joined ? "in" : "out"}`),
    };
    // The id is the PAGE's since T8-W3 (§2.9) — the arm no longer mints one, so the
    // ladder is driven under a stated identity rather than a random per-socket name.
    const wire = relayWire("room-u5", RELAY_URL, h, "p-u5reconnect");

    // ── the first open: SUBSCRIBE, then ANNOUNCE, and `carrying` only now ──────────────
    let carried = false;
    void wire.carrying.then(() => (carried = true));
    await Promise.resolve();
    expect(carried, "carrying must not resolve on a socket merely asked for").toBe(
      false,
    );

    const first = FakeSocket.made[0];
    expect(first.url).toBe(RELAY_URL);
    first.open();
    await Promise.resolve();
    expect(carried).toBe(true);

    const opening = frames(first);
    expect(opening).toHaveLength(2);
    expect(
      opening[0][0],
      "REQ first — a `hi` published before the subscription lands is answered into a room this page is not listening to",
    ).toBe("REQ");
    expect(opening[1][0]).toBe("EVENT");
    expect(content(opening[1]).kind).toBe("hi");
    const subId = opening[0][1];
    const filter = opening[0][2];

    // ── the ladder: five drops with no open between them, so `attempt` never resets ────
    // 250 · 500 · 1000 · 2000 · 4000, then 4000 forever. The cap is the point: a table left
    // open overnight must not walk itself out to a ten-minute retry.
    const LADDER = [250, 500, 1000, 2000, 4000, 4000];
    for (const [i, wait] of LADDER.entries()) {
      const live = FakeSocket.made[FakeSocket.made.length - 1];
      live.drop();
      vi.advanceTimersByTime(wait - 1);
      expect(FakeSocket.made, `rung ${i}: no socket before ${wait}ms`).toHaveLength(
        i + 1,
      );
      vi.advanceTimersByTime(1);
      expect(FakeSocket.made, `rung ${i}: one socket at ${wait}ms`).toHaveLength(i + 2);
    }

    // ── the reconnect is a REAL re-subscribe: same id, same filter, same order ─────────
    const back = FakeSocket.made[FakeSocket.made.length - 1];
    back.open();
    const reopening = frames(back);
    expect(reopening.map((f) => f[0])).toEqual(["REQ", "EVENT"]);
    expect(
      reopening[0][1],
      "the same subscription id — a new one leaves the old on the relay",
    ).toBe(subId);
    expect(reopening[0][2]).toEqual(filter);
    expect(
      content(reopening[1]).kind,
      "`hi` IS the re-request: the room answers it with the whole board, so the gap a drop opened closes without a second protocol",
    ).toBe("hi");

    // …and the new socket carries traffic, which is what "re-subscribed" has to mean. The op is
    // WHOLE — all seven fields `toWire` emits — because since T9-W1 §1.3 a frame that cannot be
    // merged is not carried: an op with no stamp is refused at the wire, so an abbreviated
    // fixture would prove the guard rather than the re-subscribe.
    const topic = (filter as Record<string, string[]>)["#x"][0];
    back.deliver(
      "r-peer",
      "op",
      { p: 1, v: 2, s: 0, l: 1, a: "r-peer", e: 1, ea: "r-peer" },
      topic,
    );
    expect(heard).toEqual(["peer:r-peer:in", "op:r-peer"]);

    // ── and the ladder is not a leak: a page that left stays left ──────────────────────
    wire.leave();
    const after = FakeSocket.made.length;
    vi.advanceTimersByTime(60_000);
    expect(
      FakeSocket.made,
      "a socket closing under `leave()` must not reconnect",
    ).toHaveLength(after);
  });
});

/**
 * LD (T9-W1 §1.3) — THE GUARD STANDS BEFORE THE MERGE.
 *
 * The session merges a frame's clock into its own the moment the frame arrives, and judges the
 * frame one line later: `useSession.onMessage`'s `st` arm takes `Math.max(ledger.lamport, d.e)`
 * ABOVE the epoch check, and `admit` takes an op's stamp before it looks at the epoch at all.
 * That order is right — a page that ignores the clock of a write it rejects mints its next
 * stamp behind the room and loses a cell it should have won — which is exactly why the number
 * has to BE a number by the time it arrives. `Math.max` with a NaN is NaN, `++` on that NaN is
 * NaN, every `newer()` against it is false, and the page spends the rest of the session writing
 * digits that lose every comparison. One malformed frame, one dead table, no error anywhere.
 *
 * So the drop belongs on this side of the seam, where the frame is still a frame. The rows
 * below drive the merge's own two lines against a stand-in ledger — the arithmetic is copied,
 * not imported, because the claim is about what the WIRE hands up, and a row that called
 * `admit` would prove the ledger instead.
 */

/** The two merges, verbatim off `useSession.ts` — :677 (`st`) and :144 (`admit`, via `d.l`).
 *  Note the else-arm: `onMessage` routes every word it does not recognise to the op path, so an
 *  unknown kind is not inert, it is an op with no stamp. */
const mergeStandIn =
  (led: { lamport: number }) =>
  (kind: string, d: Msg): void => {
    if (kind === "hi" || kind === "cur") return;
    if (kind === "st") led.lamport = Math.max(led.lamport, d.e as number);
    else led.lamport = Math.max(led.lamport, d.l as number);
  };

/** The counter is module state, so every row reads a DELTA — a reset export would be an API
 *  nothing but a test could want. */
const drops = (): number => droppedFrames();

/** A table with one open socket, and the topic its peers publish on. */
function table(room: string, h: Handlers) {
  vi.stubGlobal("WebSocket", FakeSocket);
  const wire = relayWire(room, RELAY_URL, h, "p-ld-self");
  const sock = FakeSocket.made[FakeSocket.made.length - 1];
  sock.open();
  return { wire, sock, topic: `sudoku-babb-dev/${room}` };
}

describe("relayWire — a malformed frame is dropped and counted, never merged", () => {
  it("an `st` with no clock field cannot poison the lamport, then or ever after", () => {
    const led = { lamport: 0 };
    const merge = mergeStandIn(led);
    const heard: string[] = [];
    const h: Handlers = {
      message: (kind, d, from) => {
        heard.push(`${kind}:${from}`);
        merge(kind, d);
      },
      peer: () => {},
    };
    const { wire, sock, topic } = table("room-ld-st", h);

    // A good board first, so the clock has something to lose.
    sock.deliver("p-peer", "st", { e: 5, ea: "p-peer", c: {}, b: null }, topic);
    expect(led.lamport).toBe(5);

    const before = drops();
    // …and the malformed one: every other field present, the clock field simply absent.
    sock.deliver("p-peer", "st", { ea: "p-peer", c: {}, b: null }, topic);

    expect(
      Number.isFinite(led.lamport),
      "a frame with no clock field must not reach the merge",
    ).toBe(true);
    expect(led.lamport).toBe(5);
    expect(heard, "the malformed frame never became a message").toEqual(["st:p-peer"]);
    expect(drops() - before, "dropped frames are counted").toBe(1);

    // A clock field that is not a number is the same frame by another spelling.
    sock.deliver("p-peer", "st", { e: "soon", ea: "p-peer", c: {}, b: null }, topic);
    expect(led.lamport).toBe(5);
    expect(drops() - before).toBe(2);

    // THE POISON IS PERMANENT where it lands, which is the whole reason the drop is the cure:
    // one NaN and `Math.max` never returns a number again.
    sock.deliver("p-peer", "st", { e: 9, ea: "p-peer", c: {}, b: null }, topic);
    expect(led.lamport, "the room's next board still moves the clock").toBe(9);
    expect(heard).toEqual(["st:p-peer", "st:p-peer"]);
    wire.leave();
  });

  it("the other wire-reads that reach persistent state: op stamp, unknown word, junk envelope", () => {
    const led = { lamport: 3 };
    const merge = mergeStandIn(led);
    const heard: string[] = [];
    const peers: string[] = [];
    const h: Handlers = {
      message: (kind, d, from) => {
        heard.push(`${kind}:${from}`);
        merge(kind, d);
      },
      peer: (id) => peers.push(String(id)),
    };
    const { wire, sock, topic } = table("room-ld-op", h);
    const before = drops();
    /** Each shape judged on its own clock — a poisoned ledger would carry the verdict forward
     *  and one red would read as five. */
    const alone = (why: string, send: () => void): void => {
      led.lamport = 3;
      expect(send, why).not.toThrow();
      expect(Number.isFinite(led.lamport), why).toBe(true);
      expect(led.lamport).toBe(3);
    };

    // `admit` merges an op's stamp UNCONDITIONALLY, above every guard it has.
    alone("an op with no stamp poisons `admit`", () =>
      sock.deliver(
        "p-peer",
        "op",
        { p: 40, v: 7, a: "p-peer", e: 1, ea: "p-peer" },
        topic,
      ),
    );
    // A word this arm does not speak is not inert: `onMessage` reads it as an op.
    alone("an unknown word is read as an op", () =>
      sock.raw(JSON.stringify({ kind: "boop", data: { p: 1 }, from: "p-peer" }), topic),
    );
    // An envelope that is not an object at all — `content` is valid JSON and nothing else.
    alone("a null envelope must not throw", () => sock.raw("null", topic));
    // …and one that carries no `data`, which every arm above this line dereferences.
    alone("an `st` with no data at all must not throw", () =>
      sock.raw(JSON.stringify({ kind: "st", from: "p-peer" }), topic),
    );
    // An id that is not an id keys the roster, the ink and the clock by junk.
    alone("an id that is not a string must not seat a peer", () =>
      sock.raw(JSON.stringify({ kind: "hi", data: {}, from: 7 }), topic),
    );

    expect(heard, "not one of them became a message").toEqual([]);
    expect(peers, "and not one of them seated a peer").toEqual([]);
    expect(drops() - before, "five frames refused, five counted").toBe(5);

    // The table is still a table: the next good op merges exactly as it should.
    sock.deliver(
      "p-peer",
      "op",
      { p: 40, v: 7, l: 8, a: "p-peer", e: 1, ea: "p-peer" },
      topic,
    );
    expect(led.lamport).toBe(8);
    expect(heard).toEqual(["op:p-peer"]);
    wire.leave();
  });

  it("an `st` whose clock is not a clock cannot freeze a cell for good", () => {
    // `onMessage` adopts `d.c` WHOLE (useSession.ts:680) and the attribution walk reads `[1]`
    // off every entry of it (:406). An entry that is not a `[lamport, author]` pair is a cell no
    // write can ever win again — `wins()` compares against an `undefined` lamport and loses —
    // and it outlives the frame that brought it, which is what puts it on this side of the seam
    // with the lamport rather than in the board's own law.
    const held: { clock: Record<string, [number, string]> } = { clock: {} };
    const heard: string[] = [];
    const h: Handlers = {
      message: (kind, d, from) => {
        heard.push(`${kind}:${from}`);
        if (kind === "st") held.clock = (d.c ?? {}) as Record<string, [number, string]>;
      },
      peer: () => {},
    };
    const { wire, sock, topic } = table("room-ld-clock", h);
    const good: Msg = { e: 1, ea: "p-peer", c: { "40": [2, "p-peer"] }, b: null };
    sock.deliver("p-peer", "st", good, topic);
    expect(held.clock["40"]).toEqual([2, "p-peer"]);

    const before = drops();
    sock.deliver("p-peer", "st", { ...good, e: 2, c: { "40": "p-peer" } }, topic);
    sock.deliver("p-peer", "st", { ...good, e: 3, c: { "40": [2] } }, topic);
    sock.deliver("p-peer", "st", { ...good, e: 4, c: [[2, "p-peer"]] }, topic);

    expect(held.clock["40"], "the page keeps the clock it could read").toEqual([
      2,
      "p-peer",
    ]);
    expect(
      typeof held.clock["40"][1],
      "the attribution walk reads `[1]` off every entry",
    ).toBe("string");
    expect(heard).toEqual(["st:p-peer"]);
    expect(drops() - before, "three clocks refused, three counted").toBe(3);
    wire.leave();
  });
});

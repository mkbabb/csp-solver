import { afterEach, describe, expect, it, vi } from "vitest";
import { relayWire } from "./relayWire";
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

const URLS = ["wss://relay.invalid/"];

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
    this.onmessage?.({
      data: JSON.stringify([
        "EVENT",
        "s",
        {
          id: "e",
          pubkey: from,
          created_at: 0,
          kind: 20_411,
          tags: [["x", topic]],
          content: JSON.stringify({ kind, data, from }),
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
    const wire = relayWire("room-u5", URLS, h, "p-u5reconnect");

    // ── the first open: SUBSCRIBE, then ANNOUNCE, and `carrying` only now ──────────────
    let carried = false;
    void wire.carrying.then(() => (carried = true));
    await Promise.resolve();
    expect(carried, "carrying must not resolve on a socket merely asked for").toBe(
      false,
    );

    const first = FakeSocket.made[0];
    expect(first.url).toBe(URLS[0]);
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

    // …and the new socket carries traffic, which is what "re-subscribed" has to mean.
    const topic = (filter as Record<string, string[]>)["#x"][0];
    back.deliver("r-peer", "op", { p: 1, v: 2 }, topic);
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

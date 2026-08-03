import { describe, expect, it } from "vitest";
import { matches, Relay, type Filter, type NostrEvent } from "./relay";

/**
 * The relay's two claims (T6.1), and they are different kinds of claim.
 *
 *   · `matches` is a DECISION — too wide leaks one room's signalling into another, too narrow
 *     is a room that never connects. It is pure, so it is tested as arithmetic.
 *   · the protocol walk is a CONVERSATION — OK, EOSE, fanout to everyone but the sender, and a
 *     subscription that survives being written back to the socket. It rides stub sockets rather
 *     than miniflare: the hibernation API this file uses is three methods
 *     (`acceptWebSocket`, `getWebSockets`, `serialize/deserializeAttachment`) and stubbing them
 *     tests the relay's own logic instead of Cloudflare's runtime. The runtime itself is
 *     verified where it can only be verified — `wrangler dev`, two real pages, a real socket
 *     (the local probe in the T6.1 record).
 *   · T7-W4 adds a third kind: what the relay owes a room when a socket GOES, and what it may
 *     not be handed. Both are born-RED (`evidence/w4/u1-u2-born-red.txt`) — the ghost roster
 *     and the uncapped fanout were live until the rows below.
 *
 * Run from the frontend, whose devDependencies hold vitest:
 *   cd web/frontend && npx vitest run --root ../relay      # `npm run test:unit:relay`
 */

/** The kind the shipped arm publishes on — `relayWire.ts:46`, NIP-01's ephemeral range. */
const EVENT_KIND = 20_411;
/** The topic the shipped arm tags, `sudoku-babb-dev/${room}` — `relayWire.ts:62`. */
const ROOM = "sudoku-babb-dev/room-alpha";
const ELSEWHERE = "sudoku-babb-dev/room-beta";

const ev = (over: Partial<NostrEvent> = {}): NostrEvent => ({
  id: "e1",
  pubkey: "pk1",
  created_at: 1_000,
  kind: EVENT_KIND,
  tags: [["x", ROOM]],
  content: "{}",
  sig: "sig",
  ...over,
});

/**
 * The filter the SHIPPED arm sends: one ephemeral kind, one room on the `x` tag, no `since`
 * (`relayWire.ts:104`). It replaces a fossil — these fixtures were cut against trystero's
 * batched 250-topic filter, and trystero left with the WebRTC it existed to negotiate (T6.2).
 * The set semantics that batch relied on are still the relay's law, so one row still proves
 * them, on this filter.
 */
const shippedFilter = (rooms: string[] = [ROOM], over: Partial<Filter> = {}): Filter => ({
  kinds: [EVENT_KIND],
  "#x": rooms,
  ...over,
});

describe("matches — the fanout's only decision", () => {
  it("takes an event whose kind and tag both satisfy the filter", () => {
    expect(matches(shippedFilter(), ev())).toBe(true);
  });

  it("refuses another room's event on the tag, which is where rooms are separated", () => {
    expect(matches(shippedFilter([ELSEWHERE]), ev())).toBe(false);
  });

  it("refuses another topic's kind", () => {
    expect(matches({ kinds: [20_999] }, ev())).toBe(false);
  });

  it("matches ANY value inside a condition — a filter's condition is a set, not a scalar", () => {
    const f = shippedFilter(["sudoku-babb-dev/room-zero", ROOM, "sudoku-babb-dev/room-omega"]);
    expect(matches(f, ev())).toBe(true);
    expect(matches(f, ev({ tags: [["x", ELSEWHERE]] }))).toBe(false);
  });

  it("`since` is INCLUSIVE — the first frame of a room carries the second it subscribed in", () => {
    // BORN RED against the exclusive reading: the strategy subscribes with `since: now()` in
    // whole seconds and publishes with the same clock, so `created_at === since` is the
    // ORDINARY case for the event that opens a connection, not an edge.
    expect(matches({ since: 1_000 }, ev({ created_at: 1_000 }))).toBe(true);
    expect(matches({ since: 1_001 }, ev({ created_at: 1_000 }))).toBe(false);
    expect(matches({ until: 1_000 }, ev({ created_at: 1_000 }))).toBe(true);
    expect(matches({ until: 999 }, ev({ created_at: 1_000 }))).toBe(false);
  });

  it("an absent condition constrains nothing, and an empty filter takes everything", () => {
    expect(matches({}, ev())).toBe(true);
    expect(matches({ kinds: [EVENT_KIND] }, ev({ tags: [] }))).toBe(true);
  });

  it("reads ids and authors, and a multi-letter key is not a tag filter", () => {
    expect(matches({ ids: ["e1"], authors: ["pk1"] }, ev())).toBe(true);
    expect(matches({ ids: ["other"] }, ev())).toBe(false);
    expect(matches({ authors: ["other"] }, ev())).toBe(false);
    // `limit` and friends are NIP-01 keys this relay has no history to honour; they must not
    // be mistaken for `#l`-style tag filters and silently refuse everything.
    expect(matches({ limit: 10 } as Filter, ev())).toBe(true);
  });

  it("takes an event carrying several values of the same tag letter", () => {
    const many = ev({
      tags: [
        ["x", ELSEWHERE],
        ["x", ROOM],
      ],
    });
    expect(matches(shippedFilter(), many)).toBe(true);
  });
});

// ── The conversation ──────────────────────────────────────────────────────────────────────

/** A socket with the three hibernation methods the relay uses, and a log of what it was sent. */
function stub() {
  let attachment: unknown = null;
  const sent: unknown[][] = [];
  return {
    sent,
    /** What the runtime would carry across a hibernation — read by the budget row. */
    attachment: () => attachment,
    send: (data: string) => void sent.push(JSON.parse(data)),
    close: () => {},
    serializeAttachment: (v: unknown) => {
      // The runtime round-trips this through structured clone across a hibernation, so the
      // stub does too: a relay that stashed a live reference would pass here and fail there.
      attachment = JSON.parse(JSON.stringify(v));
    },
    deserializeAttachment: () => attachment,
  };
}

function relay(...socks: ReturnType<typeof stub>[]) {
  return new Relay({
    acceptWebSocket: () => {},
    getWebSockets: () => socks,
  });
}

const feed = (r: Relay, ws: ReturnType<typeof stub>, frame: unknown[]) =>
  r.webSocketMessage(ws, JSON.stringify(frame));

describe("the NIP-01 walk the shipped arm performs", () => {
  it("REQ is answered EOSE at once — there is no history to wait through", () => {
    const a = stub();
    feed(relay(a), a, ["REQ", "sub1", shippedFilter()]);
    expect(a.sent).toEqual([["EOSE", "sub1"]]);
  });

  it("EVENT is acked to its sender and delivered to the OTHER subscriber, once", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, b, ["REQ", "sub-b", shippedFilter()]);
    feed(r, a, ["EVENT", ev()]);

    expect(a.sent).toEqual([["OK", "e1", true, ""]]);
    expect(b.sent).toEqual([["EOSE", "sub-b"], ["EVENT", "sub-b", ev()]]);
  });

  it("never echoes to the sender, even when the sender subscribed to its own room", () => {
    const a = stub();
    const r = relay(a);
    feed(r, a, ["REQ", "sub-a", shippedFilter()]);
    feed(r, a, ["EVENT", ev()]);
    expect(a.sent).toEqual([["EOSE", "sub-a"], ["OK", "e1", true, ""]]);
  });

  it("a subscriber in another room hears nothing", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, b, ["REQ", "sub-b", shippedFilter([ELSEWHERE])]);
    feed(r, a, ["EVENT", ev()]);
    expect(b.sent).toEqual([["EOSE", "sub-b"]]);
  });

  it("CLOSE ends the delivery, and the socket's other subscription survives it", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, b, ["REQ", "sub-1", shippedFilter()]);
    feed(r, b, ["REQ", "sub-2", shippedFilter()]);
    feed(r, b, ["CLOSE", "sub-1"]);
    feed(r, a, ["EVENT", ev()]);
    expect(b.sent.filter((m) => m[0] === "EVENT")).toEqual([["EVENT", "sub-2", ev()]]);
  });

  it("a malformed frame is answered, never thrown on — one client bug is not an outage", () => {
    const a = stub();
    const r = relay(a);
    r.webSocketMessage(a, "not json at all");
    feed(r, a, ["EVENT", { id: "x" }]);
    feed(r, a, ["WAT", "?"]);
    expect(a.sent.map((m) => m[0])).toEqual(["NOTICE", "OK", "NOTICE"]);
    expect(a.sent[1]).toEqual(["OK", "", false, "invalid: shape"]);
  });
});

// ── What the room is owed when a socket goes, and what it may not be handed ────────────────

/** The `bye` an arm sends for itself, and the one the relay sends on a dead socket's behalf —
 *  same grammar (`useSession.ts:193`, `relayWire.ts:72`), so the client reads one handler. */
const contentOf = (frame: unknown[]): { kind?: string; from?: string; data?: unknown } =>
  JSON.parse((frame[2] as NostrEvent).content);

describe("presence — a socket that leaves is announced (T7-W4 U1)", () => {
  it("announces `bye` to the room on the departed socket's own kind and tag", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, b, ["REQ", "sub-b", shippedFilter()]);
    feed(r, a, ["EVENT", ev()]); // a is in the room the only way this relay knows: it published
    b.sent.length = 0;

    // 1006 is a tab that vanished — no `bye` of its own, which is the whole ghost-roster class.
    r.webSocketClose(a, 1006, "");

    expect(b.sent).toHaveLength(1);
    const [verb, subId, body] = b.sent[0] as [string, string, NostrEvent];
    expect([verb, subId]).toEqual(["EVENT", "sub-b"]);
    expect(body.kind).toBe(EVENT_KIND);
    expect(body.tags).toEqual([["x", ROOM]]);
    expect(contentOf(b.sent[0])).toEqual({ kind: "bye", data: {}, from: "pk1" });
  });

  it("never announces to the socket that left, nor into another room", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, a, ["REQ", "sub-a", shippedFilter()]);
    feed(r, b, ["REQ", "sub-b", shippedFilter([ELSEWHERE])]);
    feed(r, a, ["EVENT", ev()]);
    a.sent.length = 0;
    b.sent.length = 0;

    r.webSocketClose(a, 1006, "");
    expect(a.sent).toEqual([]);
    expect(b.sent).toEqual([]);
  });

  it("says nothing for a socket that never published — it was on nobody's roster", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, b, ["REQ", "sub-b", shippedFilter()]);
    feed(r, a, ["REQ", "sub-a", shippedFilter()]); // subscribed, never spoke
    b.sent.length = 0;

    r.webSocketClose(a, 1000, "");
    expect(b.sent).toEqual([]);
  });
});

describe("the frame cap — a frame past it is refused, not relayed (T7-W4 U2)", () => {
  it("refuses a 5 MB frame, and no subscriber pays for it", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, b, ["REQ", "sub-b", shippedFilter()]);
    b.sent.length = 0;

    feed(r, a, ["EVENT", ev({ content: "x".repeat(5_000_000) })]);

    expect(a.sent).toEqual([["OK", "", false, "invalid: frame too large"]]);
    expect(b.sent).toEqual([]);
  });

  it("passes the worst frame the app can actually produce — a full board `st`", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, b, ["REQ", "sub-b", shippedFilter()]);
    // 9,401 B on the wire: a 9×9 board, every cell inked, nine corner AND nine centre marks on
    // every cell, plus the killer/kenken cage furniture (evidence/w4/frame-sizes.txt).
    const st = ev({ content: JSON.stringify({ kind: "st", data: "b".repeat(9_000) }) });
    feed(r, a, ["EVENT", st]);

    expect(a.sent).toEqual([["OK", "e1", true, ""]]);
    expect(b.sent.filter((m) => m[0] === "EVENT")).toEqual([["EVENT", "sub-b", st]]);
  });
});

describe("the hibernation budget and the fanout's survival (T7-W4 U3, U4)", () => {
  it("the shipped socket's attachment sits far inside the 16,384 B hibernation cap", () => {
    // Cloudflare's `serializeAttachment` ceiling is 16,384 B, and everything this relay must
    // remember across an eviction rides it: the subscriptions, and — since U1 — the envelope
    // the close-announce is cut from. A socket that overran the cap would throw on the REQ.
    const CAP = 16_384;
    const a = stub();
    const r = relay(a);
    feed(r, a, ["REQ", "5f3a9c21", shippedFilter()]);
    feed(r, a, ["EVENT", ev()]);

    const bytes = JSON.stringify(a.attachment()).length;
    // 157 B on this fixture, 172 B on a live room id (a 12-char room, a `r-`+12 hex pubkey) —
    // 1.05% of the cap. The assertion's ceiling is 5% of it; the cap is 95× a live socket.
    expect(bytes).toBeLessThan(CAP / 20);
  });

  it("the fanout survives a socket that dies mid-loop — the rest of the room still hears it", () => {
    // `getWebSockets` is a snapshot; a peer can be gone by the time the loop reaches it, and a
    // throw there used to cost every socket AFTER it in the list (relay.ts:198).
    const a = stub();
    const dead = stub();
    const c = stub();
    const r = relay(a, dead, c);
    feed(r, dead, ["REQ", "sub-dead", shippedFilter()]);
    feed(r, c, ["REQ", "sub-c", shippedFilter()]);
    dead.send = () => {
      throw new Error("the socket went away");
    };

    feed(r, a, ["EVENT", ev()]);

    expect(c.sent.filter((m) => m[0] === "EVENT")).toEqual([["EVENT", "sub-c", ev()]]);
    expect(a.sent).toEqual([["OK", "e1", true, ""]]);
  });
});

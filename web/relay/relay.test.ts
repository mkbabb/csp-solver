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
 *
 * Run from the frontend, whose devDependencies hold vitest:
 *   cd web/frontend && npx vitest run --root ../relay
 */

const ev = (over: Partial<NostrEvent> = {}): NostrEvent => ({
  id: "e1",
  pubkey: "pk1",
  created_at: 1_000,
  kind: 20_123,
  tags: [["x", "room-alpha"]],
  content: "{}",
  sig: "sig",
  ...over,
});

/** The filter trystero's nostr strategy actually sends (batched topics, `since: now`). */
const trysteroFilter = (topics: string[], since = 1_000): Filter => ({
  kinds: topics.map((_, i) => 20_123 + i),
  since,
  "#x": topics,
});

describe("matches — the fanout's only decision", () => {
  it("takes an event whose kind, tag and time all satisfy the filter", () => {
    expect(matches(trysteroFilter(["room-alpha"]), ev())).toBe(true);
  });

  it("refuses another room's event on the tag, which is where rooms are separated", () => {
    expect(matches(trysteroFilter(["room-beta"]), ev())).toBe(false);
  });

  it("refuses another topic's kind", () => {
    expect(matches({ kinds: [20_999] }, ev())).toBe(false);
  });

  it("matches ANY value inside a condition — the strategy batches 250 topics into one", () => {
    const f = trysteroFilter(["room-zero", "room-alpha", "room-omega"]);
    expect(matches(f, ev())).toBe(true);
    expect(matches(f, ev({ tags: [["x", "room-elsewhere"]] }))).toBe(false);
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
    expect(matches({ kinds: [20_123] }, ev({ tags: [] }))).toBe(true);
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
        ["x", "room-other"],
        ["x", "room-alpha"],
      ],
    });
    expect(matches(trysteroFilter(["room-alpha"]), many)).toBe(true);
  });
});

// ── The conversation ──────────────────────────────────────────────────────────────────────

/** A socket with the three hibernation methods the relay uses, and a log of what it was sent. */
function stub() {
  let attachment: unknown = null;
  const sent: unknown[][] = [];
  return {
    sent,
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

describe("the NIP-01 walk trystero actually performs", () => {
  it("REQ is answered EOSE at once — there is no history to wait through", () => {
    const a = stub();
    feed(relay(a), a, ["REQ", "sub1", trysteroFilter(["room-alpha"])]);
    expect(a.sent).toEqual([["EOSE", "sub1"]]);
  });

  it("EVENT is acked to its sender and delivered to the OTHER subscriber, once", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, b, ["REQ", "sub-b", trysteroFilter(["room-alpha"])]);
    feed(r, a, ["EVENT", ev()]);

    expect(a.sent).toEqual([["OK", "e1", true, ""]]);
    expect(b.sent).toEqual([["EOSE", "sub-b"], ["EVENT", "sub-b", ev()]]);
  });

  it("never echoes to the sender, even when the sender subscribed to its own room", () => {
    const a = stub();
    const r = relay(a);
    feed(r, a, ["REQ", "sub-a", trysteroFilter(["room-alpha"])]);
    feed(r, a, ["EVENT", ev()]);
    expect(a.sent).toEqual([["EOSE", "sub-a"], ["OK", "e1", true, ""]]);
  });

  it("a subscriber in another room hears nothing", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, b, ["REQ", "sub-b", trysteroFilter(["room-beta"])]);
    feed(r, a, ["EVENT", ev()]);
    expect(b.sent).toEqual([["EOSE", "sub-b"]]);
  });

  it("CLOSE ends the delivery, and the socket's other subscription survives it", () => {
    const a = stub();
    const b = stub();
    const r = relay(a, b);
    feed(r, b, ["REQ", "sub-1", trysteroFilter(["room-alpha"])]);
    feed(r, b, ["REQ", "sub-2", trysteroFilter(["room-alpha"])]);
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

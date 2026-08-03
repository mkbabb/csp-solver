/**
 * THE RELAY COMES HOME (T6.1) — a Nostr relay, small enough to read, on a hibernating
 * Durable Object.
 *
 * The board became a table at T6 by signalling over PUBLIC Nostr relays, and the measurement
 * that closed the tranche is why this file exists: 47–66 SECONDS to first contact, recorded in
 * `docs/tranches/2026-08-tranche-6/CLOSE.md` — T6 ran process-lite, so that prose is the record
 * of record for every T6 figure this file cites. The relays are strangers' machines carrying
 * strangers' traffic, and a shared board's frames wait in that queue. Nothing about the shipped
 * transport was wrong — the seam is exactly where it should be — so the cure is one origin on
 * our side of it, and this on ours.
 *
 * WHOM IT SERVES is `relayWire.ts` in the SPA, directly and only. trystero was DROPPED at T6.2
 * with the WebRTC arm it existed to negotiate, and the board came onto these frames in their
 * place; the batched topic filters, the hashed per-room kinds, and the offer/answer payloads
 * went the same way. What the shipped client speaks, and nothing else:
 *   · `["EVENT", ev]`      — publish. ONE kind, the constant 20411, tagged `["x", topic]` with
 *                            ONE topic, `sudoku-babb-dev/${room}`. The content is the app's own
 *                            `{kind, data, from, to}` envelope and the payload is the BOARD:
 *                            presence, one cell write, or a whole grid with its clock.
 *                            Answered `["OK", id, true, ""]`, then fanned out.
 *   · `["REQ", subId, f]`  — subscribe. ONE filter, `{kinds: [20411], "#x": [topic]}`, and no
 *                            `since` — the client asks for the room, not for a window of it.
 *                            Answered `["EOSE", subId]` at once: there is no history to walk.
 *   · `["CLOSE", subId]`   — drop the subscription.
 * The client's socket handler reads `[type, subId, payload]` and drops what it cannot read;
 * `["OK", …, false]` and `["NOTICE", msg]` are spelled exactly, because they are the only two
 * ways this relay refuses a frame.
 *
 * `matches` below implements `since` and `until` anyway. That is NIP-01 CONFORMANCE, not the
 * live path: no shipped caller sets either, and a relay that quietly ignores a condition its
 * subscriber declared fans out events that subscriber excluded.
 *
 * WHAT IT DOES NOT DO, deliberately:
 *   · NO PERSISTENCE. Every event here is presence, or a write against a board still being
 *     played — superseded by the next one, and useless to a page that wasn't listening, which
 *     asks the room for the whole board rather than for the event again. A relay that stores
 *     nothing has no storage bill, no eviction policy, and no privacy surface.
 *   · NO SIGNATURE VERIFICATION. `pubkey` is a random id the client mints per page load and
 *     `sig` is the empty string — Schnorr over a throwaway authenticates nobody, and there is
 *     nothing here to verify it against. The room id in the `x` tag is the capability, exactly
 *     as the invite link is the capability upstairs; the trust model is stated in the players
 *     well and it is the same one.
 *
 * HIBERNATION IS THE BILL. `state.acceptWebSocket` hands the socket to the runtime: between
 * messages the object is EVICTED FROM MEMORY and bills no duration, and the sockets stay open
 * across the eviction. `webSocketMessage` reconstructs the object on the next frame. A room
 * idling overnight costs nothing; the free plan's included requests carry a puzzle's traffic
 * with room to spare. The subscriptions therefore CANNOT live in a field — they ride
 * `serializeAttachment`, which survives the eviction with the socket, and since T7-W4 the
 * departing peer's envelope rides beside them for the same reason.
 *
 * ONE INSTANCE, named "relay", for every room. Room separation is the `#x` tag filter and
 * nothing else, since the kind is one constant across every room — so a per-room object would
 * buy isolation the filter already provides and spend a cold start to do it. At sudoku traffic
 * this is the honest arm. If a room ever needs its own object (isolation for a paying tenant,
 * or fanout past what one object should carry), the upgrade is `idFromName(room)` at the
 * `fetch` below plus the room on the URL — the protocol above does not move.
 */

// ── The runtime, as narrowly as this file uses it ────────────────────────────────────────
// Declared here rather than pulled from `@cloudflare/workers-types` so the module imports
// cleanly into vitest (node): nothing at top level touches a Cloudflare global, and the test
// drives `matches` — the only part with a decision in it — with no runtime at all.
interface Sock {
  send(data: string): void;
  close(code?: number, reason?: string): void;
  serializeAttachment(value: unknown): void;
  deserializeAttachment(): unknown;
}
interface State {
  acceptWebSocket(ws: Sock): void;
  getWebSockets(): Sock[];
}
declare const WebSocketPair: { new (): { 0: Sock; 1: Sock } };

// ── NIP-01, the parts that carry a signal ────────────────────────────────────────────────

export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

/** A NIP-01 filter. Every named condition must hold; within one, ANY value matches. `#x` (and
 *  any other single-letter tag key) reads the tag values of that letter. */
export interface Filter {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  since?: number;
  until?: number;
  [tagOrOther: string]: unknown;
}

const has = (set: unknown, v: string | number): boolean =>
  !Array.isArray(set) || (set as (string | number)[]).includes(v);

/**
 * Does this event satisfy this filter? The whole discrimination the relay performs, exported
 * because it is the whole claim — a fanout that matches too widely leaks another room's board
 * into this one, and one that matches too narrowly is a room that never connects.
 *
 * `since`/`until` are INCLUSIVE, which is the NIP-01 reading and also the safe one: whole
 * seconds are a coarse clock, and a client that subscribed with `since: now()` would routinely
 * see the room's first event carry `created_at === since`. An exclusive comparison would drop
 * exactly the frame that opens a connection, on the second it opens. No shipped caller sets
 * either bound — see the header on why both arms are here regardless.
 */
export function matches(filter: Filter, ev: NostrEvent): boolean {
  if (!has(filter.ids, ev.id)) return false;
  if (!has(filter.authors, ev.pubkey)) return false;
  if (!has(filter.kinds, ev.kind)) return false;
  if (typeof filter.since === "number" && ev.created_at < filter.since) return false;
  if (typeof filter.until === "number" && ev.created_at > filter.until) return false;
  for (const key of Object.keys(filter)) {
    if (key.length !== 2 || key[0] !== "#") continue;
    const wanted = filter[key];
    if (!Array.isArray(wanted)) continue;
    const letter = key[1];
    const seen = ev.tags.filter((t) => t[0] === letter).map((t) => t[1]);
    if (!seen.some((v) => (wanted as string[]).includes(v))) return false;
  }
  return true;
}

/** Shape only — see the header on why the signature is not checked. A frame that isn't an
 *  event is answered rather than thrown on, because a relay that drops the socket on one bad
 *  frame turns a client bug into an outage. */
function isEvent(v: unknown): v is NostrEvent {
  const e = v as NostrEvent;
  return (
    !!e &&
    typeof e.id === "string" &&
    typeof e.pubkey === "string" &&
    typeof e.kind === "number" &&
    typeof e.created_at === "number" &&
    typeof e.content === "string" &&
    Array.isArray(e.tags)
  );
}

/** `subId → filters`. */
type Subs = Record<string, Filter[]>;

/**
 * Everything a socket must remember across an eviction, carried on the socket itself. Two
 * things only: what it asked for, and — once it has published — the ENVELOPE it publishes
 * under, which is all `webSocketClose` has left to name the peer that went. Cloudflare's
 * ceiling here is 16,384 B; a shipped socket spends 172 B of it, 1.05% (the budget row).
 */
interface Attachment {
  subs: Subs;
  who?: { pubkey: string; kind: number; tags: string[][] };
}

const attOf = (ws: Sock): Attachment =>
  (ws.deserializeAttachment() as Attachment | null) ?? { subs: {} };

/**
 * The biggest frame this app can produce, with room around it. Measured on the shipped wire
 * (`evidence/w4/frame-sizes.txt`): a REQ is 72 B, an `op` 364 B, and the worst `st` — a 9×9
 * board with every cell inked, nine corner AND nine centre marks on every one, plus the
 * killer/kenken cage furniture — 9,401 B. 64 KiB is ~7× that and ~180× an ordinary frame, so
 * nothing the app sends comes near it, and a frame that does is not this app's. Without the
 * cap a 5 MB `content` is acked and fanned WHOLE, once per subscriber (5,000,144 B each).
 */
const MAX_FRAME = 65_536;

export class Relay {
  constructor(private state: State) {}

  fetch(request: Request): Response {
    if (request.headers.get("Upgrade") !== "websocket")
      return new Response("expected a websocket", { status: 426 });
    const pair = new WebSocketPair();
    // The runtime owns the server half from here: it stays open while this object sleeps.
    this.state.acceptWebSocket(pair[1]);
    return new Response(null, { status: 101, webSocket: pair[0] } as ResponseInit);
  }

  webSocketMessage(ws: Sock, raw: string | ArrayBuffer): void {
    // Refused BEFORE the parse — a relay that `JSON.parse`s 5 MB to decide 5 MB is too much has
    // already paid for it. Code units for a string, not bytes: a UTF-8 byte is never fewer than
    // one UTF-16 code unit, so this never refuses a frame that would have fit.
    if ((typeof raw === "string" ? raw.length : raw.byteLength) > MAX_FRAME)
      return ws.send(JSON.stringify(["OK", "", false, "invalid: frame too large"]));

    let msg: unknown;
    try {
      msg = JSON.parse(typeof raw === "string" ? raw : new TextDecoder().decode(raw));
    } catch {
      return ws.send(JSON.stringify(["NOTICE", "invalid json"]));
    }
    if (!Array.isArray(msg)) return ws.send(JSON.stringify(["NOTICE", "invalid frame"]));
    const [verb, a, ...rest] = msg as [string, string | NostrEvent, ...Filter[]];

    if (verb === "EVENT") {
      if (!isEvent(a)) return ws.send(JSON.stringify(["OK", "", false, "invalid: shape"]));
      // Keep the envelope, never the payload: `webSocketClose` has no frame to read, and this
      // is the only place the socket says who it is. Once per socket, not once per frame — a
      // page publishes under one pubkey for its whole life.
      const att = attOf(ws);
      if (att.who?.pubkey !== a.pubkey) {
        att.who = { pubkey: a.pubkey, kind: a.kind, tags: a.tags };
        ws.serializeAttachment(att);
      }
      ws.send(JSON.stringify(["OK", a.id, true, ""]));
      this.fanout(ws, a);
      return;
    }
    if (verb === "REQ") {
      const att = attOf(ws);
      att.subs[a as string] = rest;
      ws.serializeAttachment(att);
      // No stored events, so the end of the stream is the start of it.
      return ws.send(JSON.stringify(["EOSE", a]));
    }
    if (verb === "CLOSE") {
      const att = attOf(ws);
      delete att.subs[a as string];
      ws.serializeAttachment(att);
      return;
    }
    ws.send(JSON.stringify(["NOTICE", `unsupported: ${String(verb)}`]));
  }

  webSocketClose(ws: Sock, code: number, reason: string): void {
    this.announceLeave(ws);
    // 1006 is "abnormal" and a socket may not be closed WITH it; a peer that vanished gets the
    // normal code instead, which is what a dropped tab is.
    ws.close(code === 1006 ? 1000 : code, reason);
  }

  /**
   * A peer that vanishes without a `bye` lingers on every other roster, because both shipped
   * arms derive presence from traffic and an absence produces no traffic (`relayWire.ts`'s
   * header flags exactly this class). The relay is the only party that knows, so it says so,
   * in the arm's own grammar: `bye` in the content of an ordinary event on the departed
   * socket's own kind and tag, which every subscriber to that room already matches. No payload
   * is read to do it — `pubkey` IS the peer id the client reads as `from` (`relayWire.ts:61,76`
   * mints one per page and publishes under it), so the envelope is enough.
   *
   * This covers the socket that CLOSES: a crashed tab, a page navigated away, a link the
   * runtime gives up on. A peer whose socket stays open while the page behind it is dead is
   * still the roster's problem, and that one wants a presence timeout — cut-2's, not this.
   * A socket that only ever subscribed is on nobody's roster, and gets no announcement.
   * A page that said its OWN `bye` on `pagehide` and then closed produces a second one; the
   * client's `peer(id, false)` is a filter, so the second costs nothing.
   */
  private announceLeave(ws: Sock): void {
    const who = attOf(ws).who;
    if (!who) return;
    this.fanout(ws, {
      id: `bye-${who.pubkey}`,
      pubkey: who.pubkey,
      created_at: Math.floor(Date.now() / 1000),
      kind: who.kind,
      tags: who.tags,
      content: JSON.stringify({ kind: "bye", data: {}, from: who.pubkey }),
      sig: "",
    });
  }

  /** Every OTHER socket whose subscriptions want this event, once per matching subscription —
   *  the sender already has it, and echoing would double every peer's own traffic. */
  private fanout(from: Sock, ev: NostrEvent): void {
    for (const ws of this.state.getWebSockets()) {
      if (ws === from) continue;
      for (const [subId, filters] of Object.entries(attOf(ws).subs)) {
        if (!filters.some((f) => matches(f, ev))) continue;
        try {
          ws.send(JSON.stringify(["EVENT", subId, ev]));
        } catch {
          // The socket died between `getWebSockets` and here; `webSocketClose` owns it.
        }
      }
    }
  }
}

interface Env {
  RELAY: { idFromName(name: string): unknown; get(id: unknown): { fetch(r: Request): Response } };
}

export default {
  fetch(request: Request, env: Env): Response {
    if (request.headers.get("Upgrade") !== "websocket")
      return new Response("sudoku relay — connect a websocket\n", {
        status: 426,
        headers: { "content-type": "text/plain" },
      });
    return env.RELAY.get(env.RELAY.idFromName("relay")).fetch(request);
  },
};

/**
 * THE RELAY COMES HOME (T6.1) — a Nostr relay, small enough to read, on a hibernating
 * Durable Object.
 *
 * The board became a table at T6 by signalling over PUBLIC Nostr relays, and the measurement
 * that closed the tranche is why this file exists: 47–66 SECONDS to first contact. The relays
 * are strangers' machines carrying strangers' traffic, and a sudoku's four signalling messages
 * wait in that queue. Nothing about the shipped transport was wrong — the seam is exactly
 * where it should be — so the cure is one config word on our side of it, and this on ours.
 *
 * WHAT IT SPEAKS is the subset trystero's nostr strategy actually uses, and nothing else
 * (`@trystero-p2p/nostr/dist/index.mjs`, read before writing):
 *   · `["EVENT", ev]`      — publish. Kind is `strToNum(topic) + 20000` (ephemeral by NIP-01's
 *                            own range), tagged `["x", topic]`, content the signalling payload.
 *                            Answered `["OK", id, true, ""]`, then fanned out.
 *   · `["REQ", subId, …f]` — subscribe. The strategy batches up to 250 topics into ONE filter
 *                            `{kinds, since, "#x": [...]}`, so a filter is a set, not a scalar.
 *                            Answered `["EOSE", subId]` at once: there is no history to walk.
 *   · `["CLOSE", subId]`   — drop the subscription.
 * The client's socket handler reads `[type, subId, payload]` and warns on `["OK", …, false]`
 * or `["NOTICE", msg]`, which is why both are spelled exactly.
 *
 * WHAT IT DOES NOT DO, deliberately:
 *   · NO PERSISTENCE. Every event here is presence or a WebRTC offer/answer — worthless one
 *     second later, and the strategy subscribes with `since: now` so it would never read a
 *     stored event anyway. A relay that stores nothing has no storage bill, no eviction
 *     policy, and no privacy surface.
 *   · NO SIGNATURE VERIFICATION. Schnorr over secp256k1 for every frame buys authenticity
 *     of a throwaway keypair the client mints at page load — it authenticates nobody. The
 *     room id in the `x` tag is the capability, exactly as the invite link is the capability
 *     upstairs; the trust model is stated in the players well and it is the same one.
 *
 * HIBERNATION IS THE BILL. `state.acceptWebSocket` hands the socket to the runtime: between
 * messages the object is EVICTED FROM MEMORY and bills no duration, and the sockets stay open
 * across the eviction. `webSocketMessage` reconstructs the object on the next frame. A room
 * idling overnight costs nothing; the free plan's included requests carry a puzzle's traffic
 * with room to spare. The subscriptions therefore CANNOT live in a field — they ride
 * `serializeAttachment`, which survives the eviction with the socket.
 *
 * ONE INSTANCE, named "relay", for every room. Room separation is already the `#x` tag filter
 * — the strategy hashes the room id into both the kind and the tag — so a per-room object
 * would buy isolation the filter already provides and spend a cold start to do it. At
 * sudoku traffic this is the honest arm. If a room ever needs its own object (isolation for a
 * paying tenant, or fanout past what one object should carry), the upgrade is
 * `idFromName(room)` at the `fetch` below plus the room on the URL — the protocol above does
 * not move.
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
 * because it is the whole claim — a fanout that matches too widely leaks another room's
 * signalling into this one, and one that matches too narrowly is a room that never connects.
 *
 * `since`/`until` are INCLUSIVE, and the inclusivity is load-bearing rather than pedantic:
 * the strategy subscribes with `since: now()` in whole seconds and publishes with the same
 * clock, so the first event of a room routinely carries `created_at === since`. An exclusive
 * comparison would drop exactly the frame that opens a connection, on the second it opens.
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

/** `subId → filters`, carried on the socket itself so it survives hibernation. */
type Subs = Record<string, Filter[]>;

const subsOf = (ws: Sock): Subs => (ws.deserializeAttachment() as Subs | null) ?? {};

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
      ws.send(JSON.stringify(["OK", a.id, true, ""]));
      this.fanout(ws, a);
      return;
    }
    if (verb === "REQ") {
      const subs = subsOf(ws);
      subs[a as string] = rest;
      ws.serializeAttachment(subs);
      // No stored events, so the end of the stream is the start of it.
      return ws.send(JSON.stringify(["EOSE", a]));
    }
    if (verb === "CLOSE") {
      const subs = subsOf(ws);
      delete subs[a as string];
      ws.serializeAttachment(subs);
      return;
    }
    ws.send(JSON.stringify(["NOTICE", `unsupported: ${String(verb)}`]));
  }

  webSocketClose(ws: Sock, code: number, reason: string): void {
    // 1006 is "abnormal" and a socket may not be closed WITH it; a peer that vanished gets the
    // normal code instead, which is what a dropped tab is.
    ws.close(code === 1006 ? 1000 : code, reason);
  }

  /** Every OTHER socket whose subscriptions want this event, once per matching subscription —
   *  the sender already has it, and echoing would double every peer's own signalling. */
  private fanout(from: Sock, ev: NostrEvent): void {
    for (const ws of this.state.getWebSockets()) {
      if (ws === from) continue;
      for (const [subId, filters] of Object.entries(subsOf(ws))) {
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

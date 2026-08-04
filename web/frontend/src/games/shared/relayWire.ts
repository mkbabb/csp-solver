/**
 * THE OPS COME OFF THE PEER CONNECTION (T6.2) — the room's third arm, and now the shipped one.
 *
 * T6 signalled over Nostr and carried the board on WebRTC data channels (trystero). The owner's
 * report — "player actions don't update in real time, either. Or choices." — is what that
 * costs. Two mechanisms, both measured on a rig rather than assumed. T6.2 ran process-lite and
 * banked no evidence directory, so those readings survive only in the tranche's close prose,
 * `docs/tranches/2026-08-tranche-6/CLOSE.md`, which is the record of record for them and for
 * every other T6 figure quoted below:
 *
 *   · NO CHANNEL, NO ROOM. trystero's presence IS the data channel: `onPeerJoin` fires when
 *     the channel opens, so a pair that cannot get a channel up (the no-TURN NAT class, README
 *     ruling 3) does not merely lose its ops — it never forms a table at all, and the second
 *     page sits on "connecting…" while the relay socket beside it is healthy and idle. With
 *     `RTCPeerConnection` disabled and the relay untouched, that is exactly what the rig
 *     recorded: relay socket OPEN, roster 1, zero digits crossing, forever.
 *   · A LOST OP IS LOST FOREVER. There is no ack, no gap detection and no anti-entropy above
 *     the transport — `admit()` orders what arrives and says nothing about what does not.
 *     T6's send swallowed its own failure (`.catch(() => {})`, "a send that loses its peer
 *     mid-flight is a leave"), so one dropped write is a cell that disagrees between two pages
 *     until somebody deals a new board.
 *
 * The cure is to stop needing the peer connection. Our relay (`web/relay`, a hibernating
 * Durable Object) already speaks the only NIP-01 verbs anyone here uses — EVENT publishes and
 * fans out to every socket whose REQ filter matches — so the ops ride the SAME frames the
 * signalling did, as ephemeral events on the room's `x` tag. A star through one operator's
 * object: no ICE, no NAT class, no per-pair setup, one ordered reliable stream per page. The
 * relay took no change to serve it at T6.2 — this arm was written against what it already
 * spoke — and the two it has taken since are T7-W4's, both in `relay.ts`: the frame cap, and
 * the close-announce this header's next paragraph owes its cure to.
 *
 * WHAT IT COSTS AND WHAT IT BUYS. trystero leaves with the WebRTC it existed to negotiate, and
 * the close record carries ONE figure for the net of that deletion against this file: −22.4 kB
 * gzip. Its announce interval goes with it. What left WITH it was connection-derived presence:
 * a peer that vanishes without a `bye` (a hard crash, a severed link) has no traffic to be
 * absent from, where `onPeerLeave` used to prune it. The relay is the only party that knows,
 * so since T7-W4 it says the word itself on `webSocketClose` (`relay.ts`'s `announceLeave`).
 * That covers the socket that CLOSES, which is what a crashed tab is. A socket that stays OPEN
 * behind a dead page is nobody's `bye` yet, and wants the presence timeout flagged here:
 * cut-2's, not this.
 *
 * NO SIGNATURES, and the relay agrees — it verifies shape and fans out (see its header: this
 * arm publishes under a random per-page id with an empty `sig`, so there is nothing a
 * signature could authenticate). The room id in the `x` tag is the capability, exactly as the
 * invite link is the capability upstairs.
 */
import type { Handlers, Kind, Msg, Wire } from "./useSession";

/**
 * The ephemeral kind these frames ride. NIP-01 reserves 20000–29999 for "do not store", which
 * is the whole truth about a cell write in flight: the relay keeps nothing, and a page that
 * missed one asks for the board with `hi` rather than for the event again.
 */
const EVENT_KIND = 20411;

/** Backoff for a socket that drops, in ms — capped, because a table left open overnight must
 *  not walk itself out to a ten-minute retry. */
const RETRY_MS = [250, 500, 1000, 2000, 4000];

const hex = (n: number): string =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");

/**
 * Join a room over the relay, directly. `urls[0]` is the relay; a list of one is what a relay
 * you operate means (see `RELAY_URLS`), so the extra entries are a future's problem and this
 * arm reads the first.
 *
 * THE ID COMES IN (T8-W3 §2.9). This arm used to mint `r-<hex>` per socket, which made identity
 * a property of the CONNECTION: a rejoin was a stranger, with a new slug and a new colour, and
 * the digits you left behind were somebody else's. The id is now the page's — read or minted
 * once by `playerIdentity.claimIdentity` and handed down here — so a return to a room is a
 * return, and every function of the id (slug, ink index, authorship) follows for free.
 */
export function relayWire(
  room: string,
  urls: string[],
  h: Handlers,
  selfId: string,
): Wire {
  const topic = `sudoku-babb-dev/${room}`;
  const subId = hex(8);

  let sock: WebSocket | null = null;
  let closed = false;
  let attempt = 0;
  let openNow: (() => void) | null = null;
  const carrying = new Promise<void>((resolve) => (openNow = resolve));

  /** A frame, as the relay's `isEvent` wants it: shape, and nothing it does not read. */
  const frame = (kind: Kind | "bye", data: Msg, to?: string) => [
    "EVENT",
    {
      id: hex(64),
      pubkey: selfId,
      created_at: Math.floor(Date.now() / 1000),
      kind: EVENT_KIND,
      tags: [["x", topic]],
      content: JSON.stringify({ kind, data, from: selfId, to }),
      sig: "",
    },
  ];

  /**
   * A send with nowhere to go is DROPPED, not queued — and it is safe to drop exactly here.
   * Every message this app sends is either idempotent presence (`hi`, re-sent on every
   * reconnect) or a stamped op whose loss is repaired by the `st` that the reconnect's `hi`
   * pulls. Queueing would buy re-delivery of a write the board has already been told about.
   */
  const send = (kind: Kind | "bye", data: Msg, to?: string) => {
    if (sock?.readyState === WebSocket.OPEN)
      sock.send(JSON.stringify(frame(kind, data, to)));
  };

  function connect(): void {
    if (closed) return;
    const ws = new WebSocket(urls[0]);
    sock = ws;
    ws.onopen = () => {
      attempt = 0;
      // Subscribe first, announce second: a `hi` published before the REQ lands would be
      // answered into a subscription this page does not yet hold.
      ws.send(JSON.stringify(["REQ", subId, { kinds: [EVENT_KIND], "#x": [topic] }]));
      // RE-ANNOUNCE on every open, not just the first. A reconnect is a page that may have
      // missed writes, and `hi` is already the re-request — the room answers it with the whole
      // board, so the gap closes itself without a second protocol.
      send("hi", {});
      // THE LINK IS UP, and the table is allowed to say so again (T8-W3). `live` used to be a
      // LATCH — true at the first sign of company and false only on `leaveSession` — so a page
      // whose socket had gone sat behind a green light dropping every write it made. The word
      // is the socket's now, and this is the socket saying it.
      h.link?.(true);
      openNow?.();
    };
    ws.onmessage = (ev: MessageEvent) => {
      let msg: unknown;
      try {
        msg = JSON.parse(String(ev.data));
      } catch {
        return; // a frame this arm cannot read is a frame it has nothing to do about
      }
      if (!Array.isArray(msg) || msg[0] !== "EVENT" || msg.length < 3) return;
      const body = (msg as [string, string, { content?: unknown }])[2];
      if (typeof body?.content !== "string") return;
      let wrapped: { kind: Kind | "bye"; data: Msg; from: string; to?: string };
      try {
        wrapped = JSON.parse(body.content);
      } catch {
        return;
      }
      const { kind, data, from, to } = wrapped;
      if (!from || from === selfId || (to && to !== selfId)) return;
      if (kind === "bye") return h.peer(from, false);
      // Presence is derived from traffic, the `localWire` rule: anything heard from an id IS
      // that id being here. `hi` and its ack make the discovery symmetric whoever opened first.
      h.peer(from, true);
      h.message(kind, data, from);
    };
    ws.onclose = () => {
      if (closed || sock !== ws) return;
      sock = null;
      h.link?.(false); // …and the socket saying it has gone (see `onopen`)
      const wait = RETRY_MS[Math.min(attempt++, RETRY_MS.length - 1)];
      setTimeout(connect, wait);
    };
    // `onerror` needs no handler: every failure mode this arm has ends in `onclose`, which is
    // where the retry lives. A second path would only race it.
  }

  connect();
  const bye = () => send("bye", {});
  addEventListener("pagehide", bye);

  return {
    selfId,
    send: (kind, data, to) => send(kind, data, to),
    leave: () => {
      removeEventListener("pagehide", bye);
      bye();
      closed = true;
      sock?.close();
      sock = null;
    },
    carrying,
  };
}

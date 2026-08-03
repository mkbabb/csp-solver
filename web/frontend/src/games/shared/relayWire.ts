/**
 * THE OPS COME OFF THE PEER CONNECTION (T6.2) — the room's third arm, and now the shipped one.
 *
 * T6 signalled over Nostr and carried the board on WebRTC data channels (trystero). The owner's
 * report — "player actions don't update in real time, either. Or choices." — is what that
 * costs. Two mechanisms, both measured rather than assumed (evidence/t6.2/realtime/):
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
 * relay is UNCHANGED — this arm is written against what it already serves.
 *
 * WHAT IT COSTS AND WHAT IT BUYS. trystero leaves with the WebRTC it existed to negotiate:
 * −61.3 kB of lazy chunk (−23.2 kB gz) against ~2 kB here, and the 5.3 s announce interval
 * goes with it. What leaves WITH it is connection-derived presence: a peer that vanishes
 * without a `bye` (a hard crash, a severed link) lingers on the roster until the room is left,
 * where `onPeerLeave` used to prune it. That is the `localWire` arm's behaviour, shipped since
 * T6 and asserted by the churn row; the honest fix is a relay-side presence timeout, which
 * would be a relay change, and the relay is sealed. FLAGGED, not smuggled.
 *
 * NO SIGNATURES, and the relay agrees — it verifies shape and fans out (see its header on why
 * Schnorr over a throwaway page-load keypair authenticates nobody). The room id in the `x` tag
 * is the capability, exactly as the invite link is the capability upstairs.
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
 */
export function relayWire(room: string, urls: string[], h: Handlers): Wire {
  const selfId = `r-${hex(12)}`;
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

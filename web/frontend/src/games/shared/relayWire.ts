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

// ── The guard (T9-W1 §1.3) ────────────────────────────────────────────────────────
//
// A FRAME IS JUDGED BEFORE IT IS MERGED, and this is the only place that can be true.
//
// The session merges a frame's clock into its own the moment the frame arrives and judges the
// frame one line later: `useSession.onMessage`'s `st` arm takes `Math.max(ledger.lamport, d.e)`
// above the epoch check, and `admit` takes an op's stamp before it looks at the epoch at all.
// That order is RIGHT — a page that ignores the clock of a write it rejects mints its next
// stamp behind the room and loses a cell it should have won — which is exactly why the number
// has to be a number by the time it gets there. `Math.max` with a NaN is NaN, `++` on that NaN
// is NaN, every comparison against it is false, and the page spends the rest of the session
// writing digits that lose. One malformed frame, one dead table, and nothing said anywhere.
//
// So a frame that does not carry what its word owes never becomes a message. It is counted and
// forgotten: the player is told nothing, because there is nothing a player can do about a
// peer's bad frame, and the room already repairs a missing frame the way it repairs a lost op
// — the next `hi` pulls the whole board back.

/** A number the clock can take. `undefined`, `null`, `"soon"` and NaN all fail it; the bare
 *  `as number` this replaces failed none of them. */
const finite = (v: unknown): boolean => typeof v === "number" && Number.isFinite(v);
const str = (v: unknown): v is string => typeof v === "string";
/** A JSON object — not an array, not null, not a bare scalar. */
const bag = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const KINDS: readonly string[] = ["hi", "op", "st", "cur"];
const isKind = (v: unknown): v is Kind => str(v) && KINDS.includes(v);

/**
 * A `[lamport, author]` pair, and the clock that is a map of them. This is the OTHER thing on
 * this path that outlives the frame carrying it: `onMessage` adopts `d.c` whole, `wins()` then
 * compares every later write against whatever landed, and the attribution walk reads `[1]` off
 * each entry. An entry that is not a pair is a cell no write can win again — the same permanent
 * loss as the poisoned lamport, one cell at a time — so it is judged here with it. Exactly two
 * fields: a pair that grew a third is a version this page cannot read, and the room repairs an
 * unread `st` the way it repairs a lost op, with the next `hi`.
 */
const isStamp = (v: unknown): boolean =>
  Array.isArray(v) && v.length === 2 && finite(v[0]) && str(v[1]);
const isClock = (v: unknown): boolean => bag(v) && Object.values(v).every(isStamp);

/**
 * What each word owes, and only what the session reads WITHOUT checking. A field the session
 * already guards for itself (`st`'s `g`/`z`, `cur`'s `p`, an op's `s`) is left to it — this is
 * the poison list, not a schema.
 */
const wellFormed = (kind: Kind, d: Record<string, unknown>): boolean => {
  switch (kind) {
    case "hi":
      return true; // an announce carries an optional ack and nothing else
    case "op":
      // `p`/`v` write a cell; `l`/`a` are the stamp `admit` merges; `e`/`ea` the epoch it judges.
      return (
        finite(d.p) &&
        finite(d.v) &&
        finite(d.l) &&
        str(d.a) &&
        finite(d.e) &&
        str(d.ea)
      );
    case "st":
      // The epoch, plus the two maps the board adopts wholesale. `k`'s VALUES are guarded where
      // they are read (`adoptInk` skips a non-number), so the map itself is all this owes; the
      // clock's are not guarded anywhere, so they are guarded here.
      return (
        finite(d.e) &&
        str(d.ea) &&
        (d.c === undefined || isClock(d.c)) &&
        (d.k === undefined || bag(d.k))
      );
    case "cur":
      return finite(d.e) && str(d.ea);
  }
};

/** Frames refused since this module loaded. Quiet on purpose — it is for the unit and for a
 *  console, never for the player. */
let refused = 0;
const drop = (): void => void refused++;
export const droppedFrames = (): number => refused;

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
      const body: unknown = msg[2];
      if (!bag(body) || !str(body.content)) return;
      let wrapped: unknown;
      try {
        wrapped = JSON.parse(body.content);
      } catch {
        return; // not our envelope, and never was — nothing to count
      }
      // FROM HERE DOWN THE FRAME IS SUSPECT UNTIL IT IS READ. `JSON.parse` returns `any`, and
      // the annotation this used to carry (`{kind, data, from, to}`) asserted every field of it
      // without looking at one — the same lie the `as number` downstairs told, told earlier.
      if (!bag(wrapped)) return drop();
      const { kind, data, from, to } = wrapped;
      if (!str(from) || from === "") return drop(); // an id that is not an id keys everything
      if (to !== undefined && !str(to)) return drop();
      if (from === selfId || (to && to !== selfId)) return; // routing, not malformation
      if (kind === "bye") return h.peer(from, false);
      if (!isKind(kind) || !bag(data) || !wellFormed(kind, data)) return drop();
      // Presence is derived from traffic, the `localWire` rule: anything heard from an id IS
      // that id being here. `hi` and its ack make the discovery symmetric whoever opened first.
      h.peer(from, true);
      // The cast is the one JSON.parse earns: its product IS `Json`, and `wellFormed` has just
      // read the fields the session merges without asking.
      h.message(kind, data as Msg, from);
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

/**
 * THE SESSION (T6 mark 13) — the board becomes a table.
 *
 * Two or more pages write on ONE grid, with no server of our own beyond a relay: an
 * author-stamped op per cell write, and per-cell Lamport-LWW to converge them. No CRDT library
 * is bought, because the problem a CRDT library solves is not the problem here: the board is
 * `pos → digit` over a FIXED index set, cells never move, so there is no sequence to reconcile
 * — just a last-writer rule per cell, which is six lines. (@automerge/automerge-wasm is
 * 2,127,414 B of wasm against a 127,500 B lean band; the arithmetic was never close.)
 *
 * THE SESSION IS THE TABLE, THE GAME IS THE WORKSHEET ON IT (T8-W3, the owner's ruling
 * BAL-T8-1). Through T7 the session was BOARD-bound: the mounted board leaving ended the room,
 * so switching games evicted you and everyone you were playing with heard nothing about it. It
 * is TABLE-bound now. A game switch is a board-replacing act, board-replacing acts already
 * converge by epoch, and so the whole table follows the switcher — the room, the roster and the
 * `?s=` link all survive it, and the only ways out of a room are the leave verb and `pagehide`.
 * Three fields on the `st` carry it: `g` (which game), `z` (at which size) and `k` (who writes
 * in which colour). And because your peer id is now READ FROM A BINDING rather than minted per
 * connection (`playerIdentity.claimIdentity`), coming back to a room is coming back: same slug,
 * same ink, and the cells you wrote are still keyed to you in the clock that already holds them.
 *
 * FIVE MESSAGES, and each earns its place:
 *   · `hi` — "I'm here, and I don't have the board." Presence ACK back to the sender, plus
 *     the board itself from whichever peer holds the lowest id. It is also the RE-REQUEST: a
 *     page that hears an op stamped with an epoch it doesn't hold asks with the same word.
 *   · `op` — one cell write `{p, v, s?, l, a, e, ea}`. `l`/`a` are the Lamport stamp that
 *     decides the cell; `e`/`ea` are the EPOCH, which decides whether the write is even about
 *     the board this page is looking at.
 *   · `st` — the whole board plus its clock, the game it belongs to, the size it is dealt at,
 *     and the room's ink assignment. Sent to a joiner, and broadcast by whoever deals / clears /
 *     solves / undoes a deal / SWITCHES GAME. Board swaps never cross as ops: a deal is a new
 *     board, not 81 writes.
 *   · `cur` — where a peer is looking `{p, e, ea}`, throttled, epoch-stamped, expiring. The one
 *     word that is not state: it never enters the ledger and never rides `st`.
 *   · `bye` — the departure word. Said by a page on `pagehide`, and said FOR the page that
 *     never got to say it by the relay itself, on `webSocketClose` (T7-W4, `relay.ts`'s
 *     `announceLeave`) — both arms derive presence from traffic, and an absence produces
 *     none, so somebody has to speak for the socket that went. It is the one kind that never
 *     reaches `onMessage`: the arms widen their signature to `Kind | "bye"` and filter it into
 *     `peer(id, false)`, which is why the union below counts four and the grammar five.
 *
 * THE EPOCH IS THE ONE NUMBER THAT CAN AGREE. `boardGeneration` is a per-page counter and two
 * pages' counters mean nothing to each other, so it cannot discriminate a stale op across the
 * wire. The epoch can: it is `[lamport, author]` stamped by whoever last published a board,
 * and it rides the same merged clock as everything else. An op from another epoch drops — and
 * with it the whole class of "a digit from the old board lands on the new one".
 *
 * REMOTE OPS NEVER ENTER THE LOCAL UNDO STACK. They apply through the same effects the undo
 * replay uses and are done. Undo stays per-player — you undo YOUR moves — and every
 * `canUndo`/`undoDepth`/`isDirty` consumer is untouched. The one cost is `useUndoHistory`'s
 * no-clobber guard, which is documented there.
 *
 * TRANSPORT IS A SEAM (README ruling 3). Two arms behind the same methods: `relayWire`
 * (`relayWire.ts`, `import()`ed so a solo player pays ZERO bytes for it) and `localWire`
 * (`BroadcastChannel`, 35 lines below) for a second tab on the same device — DEV-only behind
 * `?wire=local` since T7-W4, and what the e2e battery drives, because a relay in CI is a
 * flake machine.
 *
 * THE RELAY IS OURS (T6.1). The public Nostr relay list is ABROGATED, and the measurement is
 * the reason: 47–66 SECONDS to first contact on strangers' machines carrying strangers'
 * traffic, against 596 ms on ours (`docs/tranches/2026-08-tranche-6/CLOSE.md` — T6 ran
 * process-lite, so its close prose is the record of record for every figure it took).
 * `web/relay/relay.ts` is 299 lines of NIP-01, 154 of them code, on a hibernating Durable
 * Object next to the Pages deployment — a band, not a pin: `relay-loc` re-counts it.
 *
 * THE OPS RIDE IT TOO (T6.2), and the seam is what made that one file. Through T6.1 the relay
 * carried only SIGNALLING and the board rode WebRTC data channels; the owner's report — player
 * actions and choices not arriving in real time — is the two ways that fails, and both are in
 * `relayWire.ts`'s header with the rig readings that convicted them. trystero left with the
 * peer connections it existed to negotiate — −22.4 kB gzip off the lazy chunk, by the same
 * close record — and a star through one object replaced a mesh negotiated per pair.
 *
 * NO PLAYER CAP ANYWHERE. Board ops are bytes at human pace, and since T6.2 the topology is a
 * STAR rather than a mesh — one socket per page, fanned out by the relay — so the ceiling that
 * used to be per-pair connection setup is now one object's fanout, and neither is reached at a
 * puzzle's traffic. The room simply isn't capped.
 */
import { computed, reactive, ref } from "vue";
import type { claimIdentity, inkFor, releaseIdentity, slugFor } from "./playerIdentity";
import { mountedGameId, stageBoardFollow } from "./useStagingBridge";

/**
 * OUR relay, and only ours. One entry, because a list of one is what a relay you operate
 * means: no redundancy shuffle, no slowest-of-five, no stranger's queue. `VITE_RELAY_URL`
 * points a local `wrangler dev` (or a chair's re-hostnamed deployment) at the same seam —
 * the probe rig uses it and so does the deploy, so the two never drift into different code.
 *
 * The CSP grant in `public/_headers` NAMES this origin. If the hostname moves, that line
 * moves in the same deploy or the socket is blocked on the edge and nowhere else.
 */
const RELAY_URLS = [
  import.meta.env.VITE_RELAY_URL || "wss://sudoku-relay.mkbabb.workers.dev",
];

/** `[lamport, author]`. Total order, and the tie-break is a peer id, so it is the SAME order
 *  on every page. Used for cells (which write wins) and for epochs (which board wins). */
type Stamp = [number, string];

const newer = (a: Stamp, b: Stamp) => a[0] > b[0] || (a[0] === b[0] && a[1] > b[1]);

/**
 * THE CONVERGENCE RULE, and the whole of it: a write takes a cell iff its stamp is newer than
 * the stamp the cell already holds. The order is TOTAL (the author id breaks every tie), so
 * every page decides the same winner whatever order the ops reach it in — commutative and
 * idempotent, which is convergence. Exported because it IS the claim, and a claim gets a test.
 */
export const wins = (incoming: Stamp, held?: Stamp): boolean =>
  !held || newer(incoming, held);

// ── The op ledger ─────────────────────────────────────────────────────────────────

/** One cell write, decoded off the wire. */
export interface Op {
  pos: number;
  value: number;
  solved: boolean;
  stamp: Stamp;
  epoch: Stamp;
}

/** What a page knows: the highest lamport it has seen, the board it is holding, and who owns
 *  which cell. Three fields that only ever move together, so they are one object. */
export interface Ledger {
  lamport: number;
  epoch: Stamp;
  clock: Record<string, Stamp>;
}

/** `applied` — the cell is the op's. `stale` — an older write, or an older board; drop it.
 *  `ahead` — a write against a board this page hasn't got, so ask for that board. */
export type Verdict = "applied" | "stale" | "ahead";

/**
 * THE LEDGER'S ONE DECISION, and every op in the room passes through it. Pure over its
 * argument — no wire, no Vue, no board — which is what lets the large-run proof drive twenty
 * thousand ops through THIS function rather than through a re-implementation that would prove
 * only itself (T6.1, the condition the trie veto was declined on).
 *
 * Order matters inside it: the lamport merge happens FIRST and unconditionally, because a page
 * that ignores the clock of a write it rejects will mint its next stamp behind the room and
 * lose a cell it should have won.
 */
export function admit(led: Ledger, op: Op): Verdict {
  led.lamport = Math.max(led.lamport, op.stamp[0]);
  if (op.epoch[0] !== led.epoch[0] || op.epoch[1] !== led.epoch[1])
    return newer(op.epoch, led.epoch) ? "ahead" : "stale";
  const pos = String(op.pos);
  if (!wins(op.stamp, led.clock[pos])) return "stale";
  led.clock[pos] = op.stamp;
  return "applied";
}

/** A LOCAL write, stamped into the same ledger the wire's writes land in — one clock, one
 *  rule, no second path for your own digits. */
export function mintOp(
  led: Ledger,
  author: string,
  pos: number,
  value: number,
  solved: boolean,
): Op {
  const stamp: Stamp = [++led.lamport, author];
  led.clock[String(pos)] = stamp;
  return { pos, value, solved, stamp, epoch: led.epoch };
}

/**
 * The kinds `onMessage` routes. The grammar's fifth word, `bye`, is deliberately NOT one: both
 * arms widen their own signature to `Kind | "bye"` and turn it into a roster removal before the
 * session sees it, so no consumer has to handle a departure as a message.
 *
 * `cur` IS THE ONE ADDITION T8-W3 MAKES TO THE WIRE, and it makes it above the relay: the relay
 * speaks ONE nostr kind (20411, `relay.ts`), this word rides INSIDE the content envelope, and
 * the relay stores nothing — so a new client kind never touches `web/relay/` (verified, not
 * assumed). It is presence-of-attention rather than state: `{p, e, ea}`, where `p` is the
 * focused cell or `null` for "they've looked away", and `e`/`ea` are the same epoch stamp an op
 * carries, because a cursor aimed at a board this page no longer holds is exactly as stale as a
 * digit aimed at it. It never enters the ledger and never rides `st`.
 */
export type Kind = "hi" | "op" | "st" | "cur";

/** The wire carries JSON and nothing else — no binary framing to version, and the board blob
 *  is already content-hashed JSON by the undo pool. */
type Json = null | string | number | boolean | Json[] | { [k: string]: Json };
export type Msg = { [k: string]: Json };

/** What a transport owes the session. Everything above this line is arm-agnostic. */
export interface Wire {
  selfId: string;
  send: (kind: Kind, data: Msg, to?: string) => void;
  leave: () => void;
  /** Resolves when this arm is actually carrying — the socket is OPEN, not merely asked for.
   *  It is what the table's "connecting…" line waits on, so an arm that cannot connect never
   *  claims a table (T6.1). */
  carrying: Promise<void>;
}

export interface Handlers {
  message: (kind: Kind, data: Msg, from: string) => void;
  /** joins are idempotent — both shipped arms derive presence from traffic, not from a
   *  connection callback. */
  peer: (id: string, joined: boolean) => void;
  /**
   * The TRANSPORT's own state, and the only thing the two arms legitimately disagree about
   * (T8-W3): a socket opens and drops, a `BroadcastChannel` on this device is up the moment it
   * is constructed and has nothing to drop. Optional for that reason — an arm with no link to
   * lose says `true` once and is done — and it is what retires `live`'s latch.
   */
  link?: (up: boolean) => void;
}

/**
 * The board's side of the seam, registered by `useGameState` at setup and cleared on unmount
 * (the `useStagingBridge` register-a-source pattern). One live board ever, so one slot.
 */
interface SessionSource {
  /** a remote write, through the SAME effects a local write and an undo replay use. */
  applyValue: (pos: number, value: number, solved: boolean) => void;
  /** the whole board + its marks, as the pool blob pair the restore takes back. */
  snapshot: () => unknown;
  /**
   * Adopt a board off the wire, AT THE SIZE IT WAS PUBLISHED AT. The board machine clears its
   * own undo log on the way in.
   *
   * The size is the T8-W3 D-1 cure and it is one parameter (code-proven defect): the blob
   * carries no dimensions — `snapshotBoard` never wrote one and `restoreBoardState` never read
   * one — so a peer adopting a board published after a size-changing Deal poured 256 values
   * into a 9×9 model and silently corrupted. The epoch already names WHICH board; `z` is the
   * same sentence finished.
   */
  restore: (blob: unknown, size: number) => void;
  /** the board's RAW selector size (sudoku 3 = 9×9, kenken 4 = 4×4) — `z` on the epoch. */
  size: () => number;
}

// ── The two arms ──────────────────────────────────────────────────────────────────

/**
 * `BroadcastChannel` — same device, no network. Two tabs, or two Playwright pages in ONE
 * browser context (separate contexts do NOT share the channel, which is the whole shape of
 * the e2e). Presence is derived from traffic: any message from an unseen id IS a join, and
 * a page announces itself with `hi` and acks the announcements it hears, so the two pages
 * find each other whichever opened first.
 *
 * EXPORTED for the parity harness (T7-W4, U6): the seam's whole claim is that both arms hand
 * the same script to the same handlers, and a unit cannot check that on an arm it can't build.
 */
export function localWire(room: string, h: Handlers, selfId: string): Wire {
  const ch = new BroadcastChannel(`board:${room}`);
  const post = (kind: Kind | "bye", data: Msg, to?: string) =>
    ch.postMessage({ kind, data, from: selfId, to });
  ch.onmessage = (ev: MessageEvent) => {
    const { kind, data, from, to } = ev.data as {
      kind: Kind | "bye";
      data: Msg;
      from: string;
      to?: string;
    };
    if (from === selfId || (to && to !== selfId)) return;
    if (kind === "bye") {
      h.peer(from, false);
      return;
    }
    h.peer(from, true);
    h.message(kind, data, from);
  };
  const bye = () => post("bye", {});
  addEventListener("pagehide", bye);
  // A channel on this device has no link to lose, so it says so once and never again — the
  // asymmetry `Handlers.link` exists to name rather than to paper over.
  h.link?.(true);
  return {
    selfId,
    send: post,
    leave: () => {
      removeEventListener("pagehide", bye);
      bye();
      ch.close();
    },
    // A channel on this device is open the moment it is constructed — there is nothing to
    // connect TO. The waiting this arm does is for company, not for a socket.
    carrying: Promise.resolve(),
  };
}

/**
 * The shipped arm: our relay, spoken directly (`relayWire.ts` — its header carries the two
 * measured failures of the WebRTC one it replaces). `import()`ed, so a page playing alone pays
 * ZERO bytes for it; the e2e asserts that absence on solo boot rather than minting a byte gate.
 */
async function loadRelayWire(room: string, h: Handlers, selfId: string): Promise<Wire> {
  const { relayWire } = await import("./relayWire");
  return relayWire(room, RELAY_URLS, h, selfId);
}

/**
 * The same-device arm's opt-in, and DEV-ONLY (T7-W4). Written as ONE `key=value` literal
 * rather than a `get("wire") === "local"` pair because `check-prod-shake.mjs` polices it by
 * substring, and a split pair is a token the minifier never joins — the gate would assert the
 * absence of a string that could not appear, which is the vacuity W6 just finished excising.
 */
const LOCAL_WIRE_PARAM = "wire=local";

/** Does the address bar ask for the same-device arm? Called only behind `import.meta.env.DEV`,
 *  so a build folds the call away and takes the literal with it. */
function asksLocalWire(): boolean {
  const [key, want] = LOCAL_WIRE_PARAM.split("=");
  return new URLSearchParams(window.location.search).get(key) === want;
}

// ── The live session ──────────────────────────────────────────────────────────────

interface Player {
  id: string;
  slug: string;
  /** the `--color-user-ink` rebinding; EMPTY for you, who keep the incumbent blue. */
  ink: Record<string, string>;
  self: boolean;
}

const roomId = ref<string | null>(null);
const selfId = ref("");
/** Ordered by the order THIS page met them — which is what keeps an existing player's ink
 *  from moving when a new one arrives. */
const present = ref<string[]>([]);
/** Every peer this page has ever seen. Departures leave the roster but NOT this map: their
 *  digits are still on the board and must keep their colour. */
const known = ref<Record<string, Omit<Player, "self">>>({});
/** The ledger this page keeps. `reactive` rather than a `ref` of a frozen copy: the ink
 *  computed reads it per cell, and a room of sixteen writing at speed should not re-copy the
 *  whole clock per op to say so. */
const ledger = reactive<Ledger>({ lamport: 0, epoch: [0, ""], clock: {} });
/**
 * Is this page ACTUALLY at the table — carrying on the wire, and answered by the room if it
 * joined someone else's? Until then the well says so out loud (T6.1).
 *
 * IT FOLLOWS THE SOCKET SINCE T8-W3, and the latch it replaces was a lie with a green light on
 * it: truthy at the first sign of company, false only inside `leaveSession`, so a page whose
 * relay socket had dropped went on reading "at the table" while `relayWire.send` discarded every
 * op it was handed (a send with nowhere to go is dropped, by design and correctly). The word is
 * the link's now — down on close, back when the reconnect's `hi` is answered, or immediately for
 * a table this page opened, where being alone was never a failure to connect.
 */
const live = ref(false);
/**
 * Where each peer is looking — `pos`, or `null` for "looked away" (blur, deck open). Never in
 * the ledger, never on an `st`: attention is not state, and a cursor that outlived its board
 * would be a second staleness rule to keep in step with the first.
 */
export const peerCursors = ref<Record<string, number | null>>({});

let wire: Wire | null = null;
let source: SessionSource | null = null;
let ident: {
  slugFor: typeof slugFor;
  inkFor: typeof inkFor;
  claimIdentity: typeof claimIdentity;
  releaseIdentity: typeof releaseIdentity;
} | null = null;
let inkCursor = 0;
/**
 * id → ink index, INCLUDING this page's own and every peer that has left (`k` on the `st`).
 *
 * Ink was arrival-order per page, so "the green digits" was a sentence that could be false on
 * the other screen; and a joiner meeting a departed author's cells had a clock entry with
 * nobody attached to it. The epoch holder's assignment ships with the board it names, an
 * adopting page rebinds from it and extends from `max+1`, and the index is never reassigned —
 * which is the whole of why a rejoiner cannot arrive to find somebody else in their colour.
 */
let inkIndex: Record<string, number> = {};
/** One suppressed publish per adopted board — a flag rather than a timer, because the
 *  generation watch that would echo it runs on Vue's own flush, not on ours. */
let adopted = 0;
/** Did THIS page open the room? A table you opened is one you are at the moment the wire
 *  carries; a table you followed a link to answers for itself. */
let ownTable = false;
/** Which join a callback belongs to — a wire torn down mid-flight must not report the link
 *  state of a room this page has since left. */
let joinStamp = 0;
/** Hand the peer id back at `pagehide` (§2.9) — registered per join, dropped at teardown. */
let releaseOnHide: (() => void) | null = null;

export const session = {
  roomId,
  live,
  /** you first, then everyone else in the order this page met them. */
  players: computed<Player[]>(() => {
    const me = known.value[selfId.value];
    const rows: Player[] = me ? [{ ...me, self: true }] : [];
    for (const id of present.value) {
      const p = known.value[id];
      if (p) rows.push({ ...p, self: false });
    }
    return rows;
  }),
};

/**
 * Per-cell `--color-user-ink` rebindings for every cell a PEER authored. One `:style` at
 * `BoardHost`'s single cell-mount site inks all five games; your own cells bind nothing, so
 * a solo board is byte-identical to the one that shipped.
 */
export const authorInk = computed(() => {
  const out: Record<string, Record<string, string>> = {};
  for (const pos of Object.keys(ledger.clock)) {
    const author = ledger.clock[pos][1];
    if (author === selfId.value) continue;
    const p = known.value[author];
    if (p) out[pos] = p.ink;
  }
  return out;
});

/**
 * WHO WROTE IT (T8-W3, M1) — the naming half of the same clock `authorInk` colours from.
 *
 * The two are deliberately separate consumers of one truth: a style binding that rebinds a var
 * per peer-authored cell, and a NAME the tape can print. Your own cells are in here too, flagged
 * `self`, because "you wrote this" is an answer and a blank is not; and a cell authored by
 * somebody who left before you arrived still resolves, because `k` brought their id in with the
 * board and `slugFor` is pure in it.
 */
export const cellAuthors = computed<Record<string, { slug: string; self: boolean }>>(
  () => {
    const out: Record<string, { slug: string; self: boolean }> = {};
    for (const pos of Object.keys(ledger.clock)) {
      const author = ledger.clock[pos][1];
      const p = known.value[author];
      if (p) out[pos] = { slug: p.slug, self: author === selfId.value };
    }
    return out;
  },
);

// ── The join/leave stream (T8-W3, M14) ────────────────────────────────────────────────
// The animation lane needs three things the roster cannot say: that somebody arrived rather
// than merely being present, WHEN (so a wash can suppress the room you walked into), and
// whether the arrival is a RETURN. All three are here; not one number is. The policy —
// suppression window, coalesce, per-id gap — lives in `useJoinWash`, so the beats are tuned
// without touching the wire.

export interface SessionEvent {
  /** a `rejoin` is a join whose id `known` already holds — detection is free, because the
   *  roster keeps departed peers so their digits keep their colour. */
  type: "join" | "rejoin" | "leave";
  id: string;
  slug: string;
  /** the `--color-user-ink` rebinding, `playerIdentity`'s own shape. */
  ink: Record<string, string>;
  /** `performance.now()` at receipt — the stamp a debounce policy reasons over. */
  at: number;
}

const sessionSubs = new Set<(e: SessionEvent) => void>();

/** Subscribe to arrivals and departures. Returns the unsubscribe — the `registerX` idiom, with
 *  no ring buffer to grow and no replay: a consumer that mounts late missed nothing it could
 *  have animated. */
export function onSessionEvent(cb: (e: SessionEvent) => void): () => void {
  sessionSubs.add(cb);
  return () => sessionSubs.delete(cb);
}

function emitSession(type: SessionEvent["type"], id: string): void {
  if (!sessionSubs.size) return;
  const p = known.value[id];
  const e: SessionEvent = {
    type,
    id,
    slug: p?.slug ?? "",
    ink: p?.ink ?? {},
    at: performance.now(),
  };
  for (const cb of sessionSubs) cb(e);
}

// ── The follower (T8-W3, M13) — the table follows the switcher ─────────────────────────
// App registers ONE consumer at boot and games/shared never imports App. The session stages the
// incoming board before it calls this, so all the follower owns is the page-turn.

let follower: ((game: string) => void) | null = null;

/** The app's page-turn, as the session's one way to ask for a different game. */
export function registerGameFollower(f: (game: string) => void): void {
  follower = f;
}

export function registerSessionSource(s: SessionSource): void {
  source = s;
}

/**
 * Identity-guarded (mount-before-unmount during a scene swap — `useDirtyBoard`'s rule).
 *
 * THE SESSION OUTLIVES THE SCENE (T8-W3). This used to end the session — `clearSessionSource`
 * called `leaveSession()`, so a game switch WAS a leave, silently: the room, the roster and the
 * link went with the board, and nobody was told. That is the trapdoor, and it is dissolved
 * rather than guarded — with this line gone and `?s=` no longer stripped at the switch, there is
 * no eviction path left to fall through. A null source is a tolerated state for the seam's
 * duration: `sendState`/`applyValue` already guard on it, and the incoming mount's own `hi`
 * repairs whatever the gap dropped.
 */
export function clearSessionSource(s: SessionSource): void {
  if (source !== s) return;
  source = null;
}

// ── The address bar ───────────────────────────────────────────────────────────────
// `?s=` is ~12 base36 characters of room id, and it IS the whole capability — the link is
// the invitation, the trust model, and the join, which is what the well's copy says out loud.

const SESSION_PARAM = "s";

export const readSessionParam = (): string | null =>
  new URLSearchParams(window.location.search).get(SESSION_PARAM);

function writeSessionParam(id: string | null): void {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set(SESSION_PARAM, id);
  else url.searchParams.delete(SESSION_PARAM);
  history.replaceState(null, "", url.toString());
}

// ── Joining, leaving, and the wire itself ─────────────────────────────────────────

function mint(id: string): Omit<Player, "self"> {
  const taken = new Set(Object.values(known.value).map((p) => p.slug));
  // EVERY id takes an index, including your own. You still keep `--color-user-ink` — nothing is
  // bound on your cells, so solo is byte-identical — but the OTHER pages ink you from `k`, and
  // a publisher with no index of its own would be the one player the room could not agree
  // about. Everyone else walks the golden angle from where the roster last stopped, so an early
  // peer never re-inks because a late one arrived.
  const index = inkIndex[id] ?? inkCursor++;
  inkIndex[id] = index;
  return {
    id,
    slug: ident!.slugFor(id, taken),
    ink: id === selfId.value ? {} : ident!.inkFor(index),
  };
}

/**
 * Adopt the epoch holder's ink assignment (`k`). Idempotent, and it never reassigns: an index
 * already agreed is written back as itself, the cursor continues from `max+1`, and an id we
 * have never met enters `known` WITHOUT entering the roster — which is how the tape names a
 * peer who left before you sat down.
 */
function adoptInk(k: Record<string, number>): void {
  let top = inkCursor - 1;
  const next = { ...known.value };
  const taken = new Set(Object.values(next).map((p) => p.slug));
  for (const [id, raw] of Object.entries(k)) {
    if (typeof raw !== "number" || !Number.isFinite(raw)) continue;
    const index = Math.trunc(raw);
    inkIndex[id] = index;
    if (index > top) top = index;
    const ink = id === selfId.value ? {} : ident!.inkFor(index);
    const held = next[id];
    if (held) {
      next[id] = { ...held, ink };
    } else {
      const slug = ident!.slugFor(id, taken);
      taken.add(slug);
      next[id] = { id, slug, ink };
    }
  }
  known.value = next;
  inkCursor = top + 1;
}

function onPeer(id: string, joined: boolean): void {
  if (!joined) {
    if (!present.value.includes(id)) return; // a `bye` for a page nobody had is not a departure
    present.value = present.value.filter((p) => p !== id);
    dropCursor(id);
    emitSession("leave", id);
    return;
  }
  live.value = true; // somebody is here, so the table is
  // `known` RETAINS departures, so an id it already holds is somebody coming BACK — the whole
  // of the rejoin detection, and it costs a lookup the roster was doing anyway.
  const returning = !!known.value[id];
  if (!returning) known.value = { ...known.value, [id]: mint(id) };
  if (!present.value.includes(id)) {
    present.value = [...present.value, id];
    emitSession(returning ? "rejoin" : "join", id);
  }
}

/** The link's word, and `live`'s only source outside the room's own traffic. */
function onLink(up: boolean): void {
  if (!up) {
    live.value = false;
    return;
  }
  // A table this page opened is one it is AT as soon as the wire carries; a table it followed a
  // link into is one it is waiting on, and the answer to the reconnect's `hi` is what says so.
  if (ownTable) live.value = true;
}

/** Am I the peer that owes this newcomer the board? The lowest id in the room, excluding the
 *  newcomer itself — every page computes the same answer, so exactly one snapshot is sent. */
const holdsTheBoard = (newcomer: string): boolean =>
  [selfId.value, ...present.value].filter((p) => p !== newcomer).sort()[0] ===
  selfId.value;

function sendState(to?: string): void {
  if (!wire || !source) return;
  // FLATTENED FIRST, and it is not defensive: `postMessage` clones structurally and REFUSES a
  // Vue reactive Proxy, which is what the marks map and the clock are by the time they reach
  // here (found on the e2e's first run — the local arm threw, the epoch never landed, and the
  // op that followed correctly asked for the board again, forever). The board blob IS JSON —
  // the undo pool content-hashes it with `JSON.stringify` — so saying so once here gives both
  // arms one payload rather than two behaviours.
  const plain = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
  wire.send(
    "st",
    plain({
      b: source.snapshot() as Json,
      c: ledger.clock,
      e: ledger.epoch[0],
      ea: ledger.epoch[1],
      // THE EPOCH NAMES ITS WORKSHEET (T8-W3). Three fields, no new message kind: the game the
      // board belongs to, the size it is dealt at, and who writes in which colour. Ops stay
      // seven fields — the epoch discriminates them, so a cell write never needs to say which
      // game it is about. At sixteen players `k` is ~600 B against the relay's 65,536 B frame
      // cap (`relay.ts`), which is not a number this design has to think about twice.
      g: mountedGameId() ?? "",
      z: source.size(),
      k: { ...inkIndex },
    }),
    to,
  );
}

/** An op, between the ledger's shape and the wire's three-letter one. */
const toWire = (o: Op): Msg => ({
  p: o.pos,
  v: o.value,
  s: o.solved ? 1 : 0,
  l: o.stamp[0],
  a: o.stamp[1],
  e: o.epoch[0],
  ea: o.epoch[1],
});
const fromWire = (d: Msg): Op => ({
  pos: d.p as number,
  value: d.v as number,
  solved: !!d.s,
  stamp: [d.l as number, d.a as string],
  epoch: [d.e as number, d.ea as string],
});

function onMessage(kind: Kind, d: Msg, from: string): void {
  if (!wire || !source) return;
  // ANYTHING heard from the room is the room answering: a page that joined someone else's
  // table is at it from here (T6.1).
  live.value = true;
  if (kind === "hi") {
    if (!d.ack) wire.send("hi", { ack: true }, from);
    if (holdsTheBoard(from)) sendState(from);
    return;
  }
  if (kind === "cur") {
    // A cursor against another board is exactly as stale as a digit against one — same
    // discriminant, no second rule. It drops; it does not ask for the board (a `hi` per glance
    // would be a re-request storm, and the next op or `st` asks for itself).
    const e: Stamp = [d.e as number, d.ea as string];
    if (e[0] !== ledger.epoch[0] || e[1] !== ledger.epoch[1]) return;
    const p = typeof d.p === "number" ? d.p : null;
    peerCursors.value = { ...peerCursors.value, [from]: p };
    armCursorExpiry(from);
    return;
  }
  if (kind === "st") {
    const e: Stamp = [d.e as number, d.ea as string];
    ledger.lamport = Math.max(ledger.lamport, e[0]);
    if (!newer(e, ledger.epoch)) return; // an older board than the one this page holds
    ledger.epoch = e;
    ledger.clock = (d.c as Record<string, Stamp>) ?? {};
    adoptInk((d.k as Record<string, number>) ?? {});
    clearCursors(); // a new board is a new set of things to be looking at
    // THE FOLLOW (T8-W3, BAL-T8-1 — the owner's word). A switch is a board-replacing act, and
    // board-replacing acts already converge by epoch, so the whole table follows the switcher
    // through the machinery a deal already rides. Two arms, one rule:
    //   · the same game → adopt in place, carrying `z` (which is also the size cure: a
    //     same-game size change is an adoption at the published size, exactly as a size-
    //     changing Deal re-dimensions this page's own model);
    //   · a different game → stage the board id-keyed and ask the app to turn the page. The
    //     incoming mount consumes the staged blob INSTEAD of its localStorage restore and
    //     counts it `adopted`, so its own generation bump cannot echo a rival epoch back.
    const g = typeof d.g === "string" ? d.g : "";
    const z = typeof d.z === "number" ? d.z : source.size();
    adopted++;
    if (g && g !== mountedGameId()) {
      stageBoardFollow(g, z, d.b);
      follower?.(g);
      return;
    }
    source.restore(d.b, z);
    return;
  }
  // `op` — the cell write, decided by the ledger and by nothing else.
  const op = fromWire(d);
  const verdict = admit(ledger, op);
  // `ahead` — a write against a board this page isn't holding. Ask for that board rather than
  // ink a digit into the wrong grid; an op from an OLDER epoch just drops.
  if (verdict === "ahead") wire.send("hi", {});
  if (verdict !== "applied") return;
  source.applyValue(op.pos, op.value, op.solved);
}

/**
 * Join a room. `starter` is the page that MINTED the id — it opens the first epoch, so a
 * joiner (who starts at `[0, ""]`) always adopts the board rather than two pages staring
 * past each other at epoch zero.
 *
 * IT IS ALSO WHICH TABLE YOU ARE AT, which is what the "connecting…" line reads (T6.1). Open
 * your own table and you are at it as soon as the wire carries — being alone at a table you
 * opened is not a failure to connect. Follow someone's link and you are connecting until that
 * room answers, because a table nobody is sitting at is exactly what you are waiting to learn.
 */
export async function joinSession(room: string, starter = false): Promise<void> {
  if (roomId.value === room) return;
  teardown();
  ident = await import("./playerIdentity");
  // THE ID IS THE PAGE'S, NOT THE CONNECTION'S (§2.9). Read from the binding or minted and
  // persisted here, then handed DOWN to whichever arm carries it — so a return to a room is a
  // return: same slug, same ink index, and the cells you wrote are still keyed to you in the
  // clock that already holds them.
  const id = ident.claimIdentity(room);
  ownTable = starter;
  const stamp = ++joinStamp;
  const handlers: Handlers = {
    message: onMessage,
    peer: onPeer,
    // Guarded on the join it belongs to: a wire torn down mid-flight must not report the link
    // state of a room this page has since left.
    link: (up: boolean) => {
      if (stamp === joinStamp) onLink(up);
    },
  };
  // THE LOCAL ARM IS A DEV FACILITY, and `import.meta.env.DEV` is a compile-time constant —
  // so a build folds this to `false`, the ternary to the relay call, and `localWire` with its
  // literal out of the bundle entirely. It has to leave: read unconditionally the param
  // survived every strip path and rode COPIED INVITE LINKS, where the built page's
  // `BroadcastChannel` answered a `?s=…&wire=local` recipient with a room that never reached
  // off their device — two people at two tables, each seeing one player. The dev server keeps
  // it, which is what the whole MP battery drives (T7-W4).
  const local = import.meta.env.DEV && asksLocalWire();
  selfId.value = id;
  wire = local
    ? localWire(room, handlers, id)
    : await loadRelayWire(room, handlers, id);
  roomId.value = room;
  known.value = { [id]: mint(id) };
  // The claim is held for as long as this page holds the id, and handed back when it goes —
  // otherwise a tab that closed would keep its own name out of its own reach.
  releaseOnHide = () => ident!.releaseIdentity(id);
  addEventListener("pagehide", releaseOnHide);
  if (starter) ledger.epoch = [++ledger.lamport, id];
  wire.send("hi", {});
}

/** The invite act: mint a room, write `?s=` SYNCHRONOUSLY (so the link is whole the instant
 *  it is copied), then open the wire. */
export function startSession(): void {
  const room = Math.random().toString(36).slice(2, 14);
  writeSessionParam(room);
  void joinSession(room, true);
}

/** Drop the wire and everything derived from it. NOT the address bar: `joinSession` tears down
 *  a previous room on its way into a new one, and stripping `?s=` there would delete the
 *  parameter `startSession` had just written — measured, on the first run of the e2e. */
function teardown(): void {
  joinStamp++; // whatever the departing wire says next, it is not about this page's table
  wire?.leave();
  wire = null;
  if (releaseOnHide) {
    removeEventListener("pagehide", releaseOnHide);
    releaseOnHide(); // the name goes back on the shelf; the BINDING stays (§2.9)
    releaseOnHide = null;
  }
  roomId.value = null;
  selfId.value = "";
  present.value = [];
  known.value = {};
  ledger.lamport = 0;
  ledger.epoch = [0, ""];
  ledger.clock = {};
  live.value = false;
  ownTable = false;
  inkCursor = 0;
  inkIndex = {};
  clearCursors();
  adopted = 0;
}

/** The player's act — and the parameter goes with it, because `?s=` on a page that has left is
 *  a link inviting people into an empty room. */
export function leaveSession(): void {
  teardown();
  if (readSessionParam()) writeSessionParam(null);
}

// ── What the board tells the session ──────────────────────────────────────────────

/** A local cell write. Stamps the clock (so the cell is yours) and puts the op on the wire.
 *  Outside a session this is one boolean test and a return — the solo cost of the feature. */
export function noteWrite(pos: number, value: number, solved: boolean): void {
  if (!wire) return;
  wire.send("op", toWire(mintOp(ledger, wire.selfId, pos, value, solved)));
}

// ── WHERE EVERYONE IS LOOKING (T8-W3, the `cur` word) ─────────────────────────────────────
//
// Throttled leading+trailing at ~8 Hz, which is a sweep of a board read as a movement rather
// than as a slideshow, and roughly 300 B a frame. `null` is said out loud — a blur, or the deck
// opening — because "looked away" is a thing a table can see and an absence is not.

/** ~8 Hz. The leading edge is what makes the first glance instant; the trailing edge is what
 *  makes the last one land. */
const CUR_MS = 120;
/**
 * A silent peer's ghost expires. The socket that stays OPEN behind a dead page is nobody's
 * `bye` (the presence timeout is cut-2's, `relayWire.ts`'s own header), so without this a
 * cursor could sit on a cell for as long as the tab was dead — a ghost with nobody behind it.
 * The roster row still lies for that page; this at least stops the board from doing it.
 */
const CUR_EXPIRY_MS = 45000;

let curTimer: ReturnType<typeof setTimeout> | null = null;
/** the position held back inside a throttle window — `undefined` is "nothing waiting", which
 *  `null` cannot mean here because `null` is itself a position. */
let curTrailing: number | null | undefined;
const curExpiry: Record<string, ReturnType<typeof setTimeout>> = {};

/**
 * Say where you are looking. Called at the board's focus seam and at the deck's open, and one
 * boolean test outside a session — the solo cost of the feature.
 */
export function noteFocus(pos: number | null): void {
  if (!wire) return;
  if (curTimer) {
    curTrailing = pos; // inside the window: the LATEST glance is the one that matters
    return;
  }
  wire.send("cur", { p: pos, e: ledger.epoch[0], ea: ledger.epoch[1] });
  curTimer = setTimeout(() => {
    curTimer = null;
    if (curTrailing === undefined) return;
    const held = curTrailing;
    curTrailing = undefined;
    noteFocus(held);
  }, CUR_MS);
}

function armCursorExpiry(id: string): void {
  clearTimeout(curExpiry[id]);
  curExpiry[id] = setTimeout(() => dropCursor(id), CUR_EXPIRY_MS);
}

/** One peer's ghost goes — on their `bye`, or on their silence. */
function dropCursor(id: string): void {
  clearTimeout(curExpiry[id]);
  delete curExpiry[id];
  if (!(id in peerCursors.value)) return;
  const { [id]: _gone, ...rest } = peerCursors.value;
  peerCursors.value = rest;
}

/** Every ghost goes — on an epoch change, and at teardown. */
function clearCursors(): void {
  for (const id of Object.keys(curExpiry)) {
    clearTimeout(curExpiry[id]);
    delete curExpiry[id];
  }
  if (curTimer) {
    clearTimeout(curTimer);
    curTimer = null;
  }
  curTrailing = undefined;
  if (Object.keys(peerCursors.value).length) peerCursors.value = {};
}

/**
 * A board-REPLACING act (deal / clear / solve / an undone deal / a size commit). It opens a
 * new epoch, which is what makes every op still in flight against the old board drop, and
 * the fresh board has no authored cells so the clock empties with it.
 */
export function publishBoard(): void {
  if (!wire) return;
  if (adopted > 0) {
    adopted--; // this bump IS the board we just took off the wire — don't echo it back
    return;
  }
  ledger.epoch = [++ledger.lamport, wire.selfId];
  ledger.clock = {};
  clearCursors(); // the ghosts belonged to the board that just left
  sendState();
}

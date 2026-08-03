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
 * THREE MESSAGES, and each earns its place:
 *   · `hi` — "I'm here, and I don't have the board." Presence ACK back to the sender, plus
 *     the board itself from whichever peer holds the lowest id. It is also the RE-REQUEST: a
 *     page that hears an op stamped with an epoch it doesn't hold asks with the same word.
 *   · `op` — one cell write `{p, v, s?, l, a, e, ea}`. `l`/`a` are the Lamport stamp that
 *     decides the cell; `e`/`ea` are the EPOCH, which decides whether the write is even about
 *     the board this page is looking at.
 *   · `st` — the whole board plus its clock, ~1 KB at 9×9. Sent to a joiner, and broadcast by
 *     whoever deals / clears / solves / undoes a deal. Board swaps never cross as ops: a deal
 *     is a new board, not 81 writes.
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
 * (`BroadcastChannel`, ~20 lines) for a second tab on the same device — which is also what the
 * e2e battery drives, because a relay in CI is a flake machine.
 *
 * THE RELAY IS OURS (T6.1). The public Nostr relay list is ABROGATED, and the measurement is
 * the reason: 47–66 SECONDS to first contact on strangers' machines carrying strangers'
 * traffic. `web/relay/` is ~150 lines of NIP-01 on a hibernating Durable Object next to the
 * Pages deployment.
 *
 * THE OPS RIDE IT TOO (T6.2), and the seam is what made that one file. Through T6.1 the relay
 * carried only SIGNALLING and the board rode WebRTC data channels; the owner's report — player
 * actions and choices not arriving in real time — is the two ways that fails, and both are in
 * `relayWire.ts`'s header with the rig readings that convicted them. trystero left with the
 * peer connections it existed to negotiate: −61.3 kB of lazy chunk for ~2 kB of NIP-01, and a
 * star through one object instead of a mesh that has to be negotiated per pair.
 *
 * NO PLAYER CAP ANYWHERE. Board ops are bytes at human pace, and since T6.2 the topology is a
 * STAR rather than a mesh — one socket per page, fanned out by the relay — so the ceiling that
 * used to be per-pair connection setup is now one object's fanout, and neither is reached at a
 * puzzle's traffic. The room simply isn't capped.
 */
import { computed, reactive, ref } from "vue";
import type { inkFor, slugFor } from "./playerIdentity";

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

export type Kind = "hi" | "op" | "st";

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
  /** adopt a board off the wire. The board machine clears its own undo log on the way in. */
  restore: (blob: unknown) => void;
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
export function localWire(room: string, h: Handlers): Wire {
  const selfId = `local-${Math.random().toString(36).slice(2, 10)}`;
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
async function loadRelayWire(room: string, h: Handlers): Promise<Wire> {
  const { relayWire } = await import("./relayWire");
  return relayWire(room, RELAY_URLS, h);
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
/** Is this page ACTUALLY at the table — carrying on the wire, and answered by the room if it
 *  joined someone else's? Until then the well says so out loud (T6.1). */
const live = ref(false);

let wire: Wire | null = null;
let source: SessionSource | null = null;
let ident: { slugFor: typeof slugFor; inkFor: typeof inkFor } | null = null;
let inkCursor = 0;
/** One suppressed publish per adopted board — a flag rather than a timer, because the
 *  generation watch that would echo it runs on Vue's own flush, not on ours. */
let adopted = 0;

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

export function registerSessionSource(s: SessionSource): void {
  source = s;
}

/** Identity-guarded (mount-before-unmount during a scene swap — `useDirtyBoard`'s rule). A
 *  session is board-bound: the board leaving IS the session ending. */
export function clearSessionSource(s: SessionSource): void {
  if (source !== s) return;
  source = null;
  leaveSession();
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
  return {
    id,
    slug: ident!.slugFor(id, taken),
    // You keep `--color-user-ink`; everyone else walks the golden angle from where the
    // roster last stopped, so an early peer never re-inks because a late one arrived.
    ink: id === selfId.value ? {} : ident!.inkFor(inkCursor++),
  };
}

function onPeer(id: string, joined: boolean): void {
  if (!joined) {
    present.value = present.value.filter((p) => p !== id);
    return;
  }
  live.value = true; // somebody is here, so the table is
  if (!known.value[id]) known.value = { ...known.value, [id]: mint(id) };
  if (!present.value.includes(id)) present.value = [...present.value, id];
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
  if (kind === "st") {
    const e: Stamp = [d.e as number, d.ea as string];
    ledger.lamport = Math.max(ledger.lamport, e[0]);
    if (!newer(e, ledger.epoch)) return; // an older board than the one this page holds
    ledger.epoch = e;
    ledger.clock = (d.c as Record<string, Stamp>) ?? {};
    adopted++;
    source.restore(d.b);
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
  const handlers: Handlers = { message: onMessage, peer: onPeer };
  // THE LOCAL ARM IS A DEV FACILITY, and `import.meta.env.DEV` is a compile-time constant —
  // so a build folds this to `false`, the ternary to the relay call, and `localWire` with its
  // literal out of the bundle entirely. It has to leave: read unconditionally the param
  // survived every strip path and rode COPIED INVITE LINKS, where the built page's
  // `BroadcastChannel` answered a `?s=…&wire=local` recipient with a room that never reached
  // off their device — two people at two tables, each seeing one player. The dev server keeps
  // it, which is what the whole MP battery drives (T7-W4).
  const local = import.meta.env.DEV && asksLocalWire();
  wire = local ? localWire(room, handlers) : await loadRelayWire(room, handlers);
  roomId.value = room;
  selfId.value = wire.selfId;
  known.value = { [wire.selfId]: mint(wire.selfId) };
  if (starter) {
    ledger.epoch = [++ledger.lamport, wire.selfId];
    const mine = wire;
    void wire.carrying.then(() => {
      if (wire === mine) live.value = true; // not a room this page has since left
    });
  }
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
  wire?.leave();
  wire = null;
  roomId.value = null;
  selfId.value = "";
  present.value = [];
  known.value = {};
  ledger.lamport = 0;
  ledger.epoch = [0, ""];
  ledger.clock = {};
  live.value = false;
  inkCursor = 0;
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
  sendState();
}

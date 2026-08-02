/**
 * THE SESSION (T6 mark 13) — the board becomes a table.
 *
 * Two or more pages write on ONE grid, with no server: WebRTC data channels signalled over
 * public Nostr relays (trystero), an author-stamped op per cell write, and per-cell
 * Lamport-LWW to converge them. No CRDT library is bought, because the problem a CRDT
 * library solves is not the problem here: the board is `pos → digit` over a FIXED index set,
 * cells never move, so there is no sequence to reconcile — just a last-writer rule per cell,
 * which is six lines. (@automerge/automerge-wasm is 2,127,414 B of wasm against a 127,500 B
 * lean band; the arithmetic was never close.)
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
 * TRANSPORT IS A SEAM (README ruling 3). Two arms behind four methods: `relayWire` (trystero
 * over Nostr, `import()`ed so a solo player pays ZERO bytes for it) and `localWire`
 * (`BroadcastChannel`, ~20 lines) for a second tab on the same device — which is also what the
 * e2e battery drives, because a public relay in CI is a flake machine. The banked Cloudflare
 * Durable-Object relay lands behind the same four methods if public signalling ever proves
 * unacceptable.
 *
 * NO PLAYER CAP ANYWHERE. Board ops are bytes at human pace; the mesh's practical ceiling is
 * connection setup, not traffic. The room simply isn't capped.
 */
import { computed, ref } from "vue";
import type { inkFor, slugFor } from "./playerIdentity";

/** The app's own namespace on the public relays — rooms are scoped under it. */
const APP_ID = "sudoku-babb-dev";

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

type Kind = "hi" | "op" | "st";

/** The wire carries JSON and nothing else — no binary framing to version, and the board blob
 *  is already content-hashed JSON by the undo pool. */
type Json = null | string | number | boolean | Json[] | { [k: string]: Json };
type Msg = { [k: string]: Json };

/** The four methods a transport owes the session. Everything above this line is arm-agnostic. */
interface Wire {
  selfId: string;
  send: (kind: Kind, data: Msg, to?: string) => void;
  leave: () => void;
}

interface Handlers {
  message: (kind: Kind, data: Msg, from: string) => void;
  /** joins are idempotent — the local arm derives presence from traffic, not from a callback. */
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
 */
function localWire(room: string, h: Handlers): Wire {
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
  };
}

/**
 * trystero over the Nostr strategy — the shipped arm. `import()`ed, so the ~22 KB gz of
 * relay client and crypto never reaches a page that is playing alone; the e2e asserts that
 * absence on solo boot rather than minting a byte gate for it.
 */
async function relayWire(room: string, h: Handlers): Promise<Wire> {
  const { joinRoom, selfId } = await import("trystero/nostr");
  const knock = joinRoom({ appId: APP_ID }, room);
  const acts = (["hi", "op", "st"] as const).map((kind) => {
    const act = knock.makeAction<Msg>(kind);
    act.onMessage = (data, ctx) => h.message(kind, data, ctx.peerId);
    return [kind, act] as const;
  });
  const table = Object.fromEntries(acts) as Record<Kind, (typeof acts)[number][1]>;
  knock.onPeerJoin = (id) => h.peer(id, true);
  knock.onPeerLeave = (id) => h.peer(id, false);
  return {
    selfId,
    send: (kind, data, to) =>
      void table[kind].send(data, to ? { target: to } : undefined).catch(() => {
        // A send that loses its peer mid-flight is a leave, and `onPeerLeave` is already
        // watching for it — there is nothing to retry and nothing to report.
      }),
    leave: () => void knock.leave(),
  };
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
const clock = ref<Record<string, Stamp>>({});

let wire: Wire | null = null;
let source: SessionSource | null = null;
let ident: { slugFor: typeof slugFor; inkFor: typeof inkFor } | null = null;
let lamport = 0;
let epoch: Stamp = [0, ""];
let inkCursor = 0;
/** One suppressed publish per adopted board — a flag rather than a timer, because the
 *  generation watch that would echo it runs on Vue's own flush, not on ours. */
let adopted = 0;

export const session = {
  roomId,
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
  for (const pos of Object.keys(clock.value)) {
    const author = clock.value[pos][1];
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
    plain({ b: source.snapshot() as Json, c: clock.value, e: epoch[0], ea: epoch[1] }),
    to,
  );
}

function onMessage(kind: Kind, d: Msg, from: string): void {
  if (!wire || !source) return;
  if (kind === "hi") {
    if (!d.ack) wire.send("hi", { ack: true }, from);
    if (holdsTheBoard(from)) sendState(from);
    return;
  }
  if (kind === "st") {
    const e: Stamp = [d.e as number, d.ea as string];
    lamport = Math.max(lamport, e[0]);
    if (!newer(e, epoch)) return; // an older board than the one this page holds
    epoch = e;
    clock.value = (d.c as Record<string, Stamp>) ?? {};
    adopted++;
    source.restore(d.b);
    return;
  }
  // `op` — the cell write.
  lamport = Math.max(lamport, d.l as number);
  if (d.e !== epoch[0] || d.ea !== epoch[1]) {
    // A write against a board this page isn't holding. Ask for that board rather than ink a
    // digit into the wrong grid; an op from an OLDER epoch just drops.
    if (newer([d.e as number, d.ea as string], epoch)) wire.send("hi", {});
    return;
  }
  const pos = String(d.p);
  const next: Stamp = [d.l as number, d.a as string];
  if (!wins(next, clock.value[pos])) return;
  clock.value = { ...clock.value, [pos]: next };
  source.applyValue(d.p as number, d.v as number, !!d.s);
}

/**
 * Join a room. `starter` is the page that MINTED the id — it opens the first epoch, so a
 * joiner (who starts at `[0, ""]`) always adopts the board rather than two pages staring
 * past each other at epoch zero.
 */
export async function joinSession(room: string, starter = false): Promise<void> {
  if (roomId.value === room) return;
  teardown();
  ident = await import("./playerIdentity");
  const handlers: Handlers = { message: onMessage, peer: onPeer };
  const local = new URLSearchParams(window.location.search).get("wire") === "local";
  wire = local ? localWire(room, handlers) : await relayWire(room, handlers);
  roomId.value = room;
  selfId.value = wire.selfId;
  known.value = { [wire.selfId]: mint(wire.selfId) };
  if (starter) epoch = [++lamport, wire.selfId];
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
  clock.value = {};
  lamport = 0;
  epoch = [0, ""];
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
  const stamp: Stamp = [++lamport, wire.selfId];
  clock.value = { ...clock.value, [String(pos)]: stamp };
  wire.send("op", {
    p: pos,
    v: value,
    s: solved ? 1 : 0,
    l: stamp[0],
    a: stamp[1],
    e: epoch[0],
    ea: epoch[1],
  });
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
  epoch = [++lamport, wire.selfId];
  clock.value = {};
  sendState();
}

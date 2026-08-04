#!/usr/bin/env node
/**
 * peer.mjs — THE SECOND PLAYER, with no browser attached (T8-W5).
 *
 * A multiplayer frame-timing burst needs a peer at the table, and the obvious way to get one is
 * a second browser context. That way costs a whole second WebKit — compositor, raster threads,
 * its own boil — on the machine whose frame curve is the measurement. The peer would be
 * competing with the thing being measured, and every number would carry it.
 *
 * So the peer is this instead: ~150 lines of node speaking `relayWire.ts`'s wire directly, at
 * the SAME relay the shipped page talks to. It is a real member of the room by every test the
 * app applies — the page's roster counts it, its digits ink in its own colour, its epoch is the
 * page's epoch — and it costs one idle socket. Nothing here is a mock: the frames are the
 * frames `relayWire` builds (NIP-01 EVENT, kind 20411, `x` tag `sudoku-babb-dev/<room>`), and
 * a divergence between this file and that one shows up as a room that never forms.
 *
 * WHAT IT PLAYS. On `st` it takes the board — `{b: {values, given, …}, m}` — and writes into
 * cells that are empty and not given, digits chosen to sit legally in their row and column
 * (`planFrom`, which also says what that choice does NOT check). A real player's move, so the
 * page does the real work: `admit()`, the clock write, `authorInk`'s recompute, the cell's own
 * transition. Writing into givens would exercise a path no player walks.
 *
 * PROOF OF WORK, on stdout as JSON lines, because a burst labelled "multiplayer" that ran
 * against an empty room is a solo burst with a wrong name: `open`, `peer` (the page answered),
 * `state` (the board arrived, with its epoch and how many cells are writable), `op` (each write),
 * `done`. The driver reads these and refuses to bank a window whose peer never reached `state`.
 *
 * Usage:
 *   node peer.mjs --room <id> [--relay wss://…] [--writes N] [--cadence 500] [--start 0] [--hold 0]
 */
import process from "node:process";

const argv = process.argv.slice(2);
const arg = (flag, fallback) => {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : fallback;
};

const ROOM = arg("--room", "");
const RELAY = arg("--relay", "wss://sudoku-relay.mkbabb.workers.dev");
/** How many cell writes to play. 0 = sit at the table and touch nothing (state (b)). */
const WRITES = Number(arg("--writes", "0"));
/** Milliseconds between writes. A human at a grid is 400–2500 ms; the default is the brisk end. */
const CADENCE = Number(arg("--cadence", "500"));
/** Wait this long after the board arrives before the first write — lets the page's own settle
 *  finish so the traffic lands INSIDE the measured window rather than across its edge. */
const START = Number(arg("--start", "0"));
/** Stay connected this long after the last write. 0 = until killed. */
const HOLD = Number(arg("--hold", "0"));

if (!ROOM) {
  process.stderr.write("usage: peer.mjs --room <id> [--relay url] [--writes N] [--cadence ms]\n");
  process.exit(2);
}

const EVENT_KIND = 20411; // relayWire.ts's kind — ephemeral, NIP-01 20000–29999
const topic = `sudoku-babb-dev/${ROOM}`;
const hex = (n) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");
const selfId = `r-${hex(12)}`;
const subId = hex(8);

const say = (o) => process.stdout.write(`${JSON.stringify({ t: Date.now(), ...o })}\n`);

/** The peer's half of the ledger: the room's clock, and the epoch it is writing against. */
let lamport = 0;
let epoch = [0, ""];
/** The last `st` heard, kept so a page that falls behind and asks with `hi` gets an answer —
 *  which is exactly what a real peer holding the board does. */
let lastState = null;
/** Cells this peer may write, and what belongs in them. Filled from the board on `st`. */
let plan = [];
let played = 0;
/** The board side, kept from the plan so a revision lap can walk a digit within 1..side. */
let side = 9;

let sock = null;
let closed = false;
let timer = null;

const frame = (kind, data, to) => [
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

const send = (kind, data, to) => {
  if (sock?.readyState === 1) sock.send(JSON.stringify(frame(kind, data, to)));
};

/**
 * The board, into a move list — a player filling in the grid, not a script stamping cell 0.
 *
 * THE SOLUTION IS NOT ON THE WIRE. The blob's `solved` map is the SOLVER's ink (hint reveals),
 * empty on a board nobody has asked for help on, so a peer cannot play the right answer even
 * though the field's name suggests it can. What it can do is play a *legal-looking* one: for
 * each empty non-given cell, a digit absent from that cell's row and column. Latin constraints
 * only — boxes, cages, thermometers and inequalities are not checked here, so an occasional
 * write lands on a conflict and the page paints its conflict styling. That is a real player's
 * move too, and the alternative (a digit chosen with no regard for the board at all) would
 * paint conflicts on nearly every write and quietly measure a different surface.
 */
function planFrom(b) {
  const values = b?.values ?? {};
  const given = new Set(b?.given ?? []);
  const keys = Object.keys(values);
  const n = Math.round(Math.sqrt(keys.length));
  if (!n || n * n !== keys.length) return [];
  side = n;

  // Row/column occupancy, seeded from what is already on the board and updated as we plan, so
  // the peer never plans two of the same digit into one line.
  const rows = Array.from({ length: n }, () => new Set());
  const cols = Array.from({ length: n }, () => new Set());
  for (const k of keys) {
    const v = Number(values[k]);
    if (!v) continue;
    const p = Number(k);
    rows[Math.floor(p / n)].add(v);
    cols[p % n].add(v);
  }

  const open = keys.filter((p) => !given.has(p) && !Number(values[p]));
  for (let i = open.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [open[i], open[j]] = [open[j], open[i]];
  }

  const moves = [];
  for (const k of open) {
    const p = Number(k);
    const r = Math.floor(p / n);
    const c = p % n;
    let pick = 0;
    for (let v = 1; v <= n; v++) {
      if (!rows[r].has(v) && !cols[c].has(v)) {
        pick = v;
        break;
      }
    }
    if (!pick) continue; // nothing legal left on this line — leave the cell to its owner
    rows[r].add(pick);
    cols[c].add(pick);
    moves.push({ pos: p, value: pick });
  }
  return moves;
}

/**
 * TRAFFIC HAS TO OUTLAST THE WINDOW. An EASY 9×9 has about twenty empty cells, so a plan
 * played once runs dry in ten seconds and a window opening after that measures a quiet room
 * wearing the traffic label. So the plan LOOPS: past the first lap the peer revises cells it
 * already wrote, walking the digit on each pass. A player changing their mind is the same op,
 * the same ledger decision and the same re-ink — and it is the only way to hold a cadence for
 * as long as a matrix cell takes.
 */
function playOne() {
  if (played >= WRITES || !plan.length) return finish();
  const base = plan[played % plan.length];
  const lap = Math.floor(played / plan.length);
  const value = lap === 0 ? base.value : ((base.value - 1 + lap) % side) + 1;
  const stamp = [++lamport, selfId];
  send("op", {
    p: base.pos,
    v: value,
    s: 0,
    l: stamp[0],
    a: stamp[1],
    e: epoch[0],
    ea: epoch[1],
  });
  played++;
  say({ ev: "op", n: played, pos: base.pos, value, lap });
  timer = setTimeout(playOne, CADENCE);
}

function finish() {
  say({ ev: "played", writes: played, planned: plan.length });
  if (HOLD > 0) setTimeout(bye, HOLD);
}

function bye() {
  if (closed) return;
  closed = true;
  clearTimeout(timer);
  send("bye", {});
  say({ ev: "done", writes: played });
  setTimeout(() => {
    sock?.close();
    process.exit(0);
  }, 150);
}

function connect() {
  if (closed) return;
  const ws = new WebSocket(RELAY);
  sock = ws;

  ws.onopen = () => {
    // Subscribe first, announce second — relayWire.ts's order, and for its reason: a `hi`
    // published before the REQ lands is answered into a subscription this peer does not hold.
    ws.send(JSON.stringify(["REQ", subId, { kinds: [EVENT_KIND], "#x": [topic] }]));
    send("hi", {});
    say({ ev: "open", relay: RELAY, room: ROOM, self: selfId });
  };

  ws.onmessage = (evt) => {
    let msg;
    try {
      msg = JSON.parse(String(evt.data));
    } catch {
      return;
    }
    if (!Array.isArray(msg) || msg[0] !== "EVENT" || msg.length < 3) return;
    const body = msg[2];
    if (typeof body?.content !== "string") return;
    let w;
    try {
      w = JSON.parse(body.content);
    } catch {
      return;
    }
    const { kind, data, from, to } = w;
    if (!from || from === selfId || (to && to !== selfId)) return;

    if (kind === "bye") return say({ ev: "peerLeft", from });
    if (kind === "hi") {
      say({ ev: "peer", from, ack: !!data?.ack });
      // Answer an announcement so the page learns this peer without waiting for traffic, and
      // hand back the board if this peer is the one holding it (a page asking again with `hi`
      // is a page that heard an op from an epoch it has not got).
      if (!data?.ack) send("hi", { ack: true }, from);
      if (lastState) send("st", lastState, from);
      return;
    }
    if (kind === "st") {
      const e = [Number(data.e) || 0, String(data.ea ?? "")];
      lamport = Math.max(lamport, e[0]);
      // Only a NEWER board displaces the one this peer is playing — `useSession`'s rule.
      if (!(e[0] > epoch[0] || (e[0] === epoch[0] && e[1] > epoch[1])) && lastState) return;
      epoch = e;
      lastState = data;
      plan = planFrom(data.b?.b ?? data.b);
      // LEAVE THE BOARD UNFINISHED, always. A peer that fills the last cell fires the
      // completion celebration, and a celebration inside a window measuring steady-state boil
      // is a different scenario wearing this one's name — small boards (4×4) would hit it in
      // ten writes.
      if (plan.length > 2) plan = plan.slice(0, plan.length - 2);
      played = 0;
      say({ ev: "state", epoch, writable: plan.length, want: WRITES });
      clearTimeout(timer);
      if (WRITES > 0 && plan.length) timer = setTimeout(playOne, START);
      else if (WRITES > 0) say({ ev: "warn", why: "no writable cell in the board on the wire" });
      return;
    }
    if (kind === "op") {
      lamport = Math.max(lamport, Number(data.l) || 0);
      say({ ev: "remoteOp", pos: data.p, value: data.v });
    }
  };

  ws.onclose = () => {
    if (closed || sock !== ws) return;
    sock = null;
    say({ ev: "reconnect" });
    setTimeout(connect, 500);
  };
}

process.on("SIGTERM", bye);
process.on("SIGINT", bye);
connect();

import { afterEach, describe, expect, it, vi } from "vitest";
import { localWire, type Handlers, type Kind, type Msg, type Wire } from "./useSession";
import { relayWire } from "./relayWire";

/**
 * U6 (T7-W4) — THE PARITY HARNESS. One script, two arms, the same handlers, one outcome.
 *
 * `TRANSPORT IS A SEAM` is a claim the estate makes in prose at the top of `useSession.ts` and
 * nowhere else. The whole session — presence, the epoch, the `hi` re-request, every op — is
 * written once against `Wire`, and everything above that line is arm-agnostic ONLY if the two
 * arms actually behave alike. Nothing checked that. The e2e drives `localWire` (a relay in CI
 * is a flake machine) and production ships `relayWire`, so the arm the battery proves is not
 * the arm anyone plays on, and a divergence — a directed message the local arm honours and the
 * relay arm broadcasts, a `bye` one arm swallows — would show up as a bug report and not as a
 * red.
 *
 * So: the same script, driven through both, against handler objects built by the same factory,
 * and the two logs must be the same string. Peer ids are the one thing that legitimately
 * differs (`local-…` vs `r-…`), so they are normalised to the seat at the table.
 *
 * ONE ASYMMETRY IS REAL, and it is not papered over — it is what shapes the log. `relayWire`
 * announces `hi` on every socket OPEN, because a reconnect is a re-request (U5); `localWire`
 * has no socket to reopen, so its announce is `joinSession`'s and arrives with the script. The
 * boot announce carries no step number, so it never enters the MESSAGE log — but it does make
 * a peer known, and it lands at a different moment in each arm. Hence the two logs:
 *
 *   · `msgs` — ORDERED. Which frames reached which seat, in which order. This is the routing
 *     claim, and order is half of it.
 *   · `present` — SORTED. Who joined and who left. WHEN a page first became known is the boot
 *     announce's business, not the seam's; WHO is at the table is the seam's, and an arm that
 *     lost a `bye` or invented a peer moves this list whatever the order.
 *
 * Both arms derive presence from traffic, so `peer(id, true)` fires on EVERY frame — the
 * documented contract (`Handlers.peer`, "joins are idempotent"). The harness's handler
 * collapses that to transitions exactly as `onPeer` does.
 */

const ROOM = "parity-u6";
const RELAY_URLS = ["wss://relay.invalid/"];

// ── the stub relay: NIP-01's fanout and nothing else ──────────────────────────────────
//
// A REQ banks a filter; an EVENT goes to every OTHER socket whose filter matches. That is the
// entire conversation `relayWire` has, so it is the entire stub — the relay's own logic is
// tested in `web/relay/relay.test.ts` against the relay.

type Filter = { kinds?: number[]; "#x"?: string[] };

class HubSocket {
  static readonly OPEN = 1;
  static hub: HubSocket[] = [];
  readyState = 0;
  filter: Filter | null = null;
  onopen: (() => void) | null = null;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(readonly url: string) {
    HubSocket.hub.push(this);
    queueMicrotask(() => {
      this.readyState = HubSocket.OPEN;
      this.onopen?.();
    });
  }
  send(text: string): void {
    const msg = JSON.parse(text) as [string, ...unknown[]];
    if (msg[0] === "REQ") {
      this.filter = msg[2] as Filter;
      return;
    }
    const ev = msg[1] as { kind: number; tags: string[][] };
    const x = ev.tags.find((t) => t[0] === "x")?.[1];
    for (const peer of HubSocket.hub) {
      if (peer === this || !peer.filter) continue;
      if (!peer.filter.kinds?.includes(ev.kind)) continue;
      if (!peer.filter["#x"]?.includes(String(x))) continue;
      peer.onmessage?.({ data: JSON.stringify(["EVENT", "s", ev]) } as MessageEvent);
    }
  }
  close(): void {
    this.readyState = 3;
    // A closed socket's subscription leaves with it, which is what makes this comparable to
    // `BroadcastChannel.close()` — otherwise a departed page keeps hearing the room.
    this.filter = null;
    HubSocket.hub = HubSocket.hub.filter((s) => s !== this);
    this.onclose?.();
  }
}

// ── the log, and the handlers that write it ───────────────────────────────────────────

/** One page's two records: what reached it, and who it thinks is at the table. */
interface Log {
  msgs: string[];
  present: string[];
}

/** One turn of the loop's check phase, where a `MessagePort` delivery has already landed, at
 *  microseconds rather than a timer's millisecond floor — with the timer as the fallback if a
 *  runtime lacks it. `globalThis`-read rather than a bare reference: `setImmediate` is the
 *  runtime's, not the DOM's, and the app tsconfig knows only the DOM. */
const nextTurn: (fn: () => void) => void =
  (globalThis as { setImmediate?: (fn: () => void) => void }).setImmediate ??
  ((fn) => void setTimeout(fn, 0));

/**
 * DRAIN, don't guess. jsdom ships no `BroadcastChannel`, so under vitest the local arm rides
 * the RUNTIME's — Node's, a `MessagePort` delivered in the loop's message phase, which does not
 * reliably precede a `setTimeout(0)` under load. A fixed turn count measured exactly the rare
 * mismatch a flake row is: 1 red in 3 at a one-turn settle, 0 in 400 rounds in isolation. So
 * the harness turns the loop until the logs stop growing, and the row's timing is a
 * consequence of the transport rather than a number somebody tuned.
 *
 * Called after EVERY step. Serialising the script is what makes the message order a property of
 * the arm rather than of two senders racing into one seat's log.
 */
const drain = async (logs: Log[]): Promise<void> => {
  const size = () => logs.reduce((n, l) => n + l.msgs.length + l.present.length, 0);
  let quiet = 0;
  for (let turn = 0; turn < 12 && quiet < 3; turn++) {
    const before = size();
    await new Promise((r) => nextTurn(() => r(0)));
    await Promise.resolve();
    quiet = size() === before ? quiet + 1 : 0;
  }
};

/**
 * ONE factory, used by both arms — the point of the row is that the handlers cannot tell which
 * transport called them. Ids go in RAW and are seated on the way out (`run`), because the relay
 * arm's boot announce reaches a peer before that peer's own constructor has returned an id to
 * seat it by.
 */
function handlers(log: Log): Handlers {
  const seen = new Set<string>();
  return {
    message: (kind: Kind, data: Msg, from: string) => {
      // The script's frames are numbered; an arm's own boot announce is not (see the header).
      if (typeof data.n === "number") log.msgs.push(`${from} ${kind} #${data.n}`);
    },
    peer: (id: string, joined: boolean) => {
      // `onPeer`'s rule, verbatim: presence is a transition, traffic is not.
      if (joined ? !seen.has(id) : seen.delete(id))
        log.present.push(`${id} ${joined ? "join" : "leave"}`);
      if (joined) seen.add(id);
    },
  };
}

/**
 * THE SCRIPT — the session's own vocabulary, in the order a table actually plays it: two
 * announces, the directed ack, the board, an op each, a directed re-send of the board to a page
 * that asked, and then one player walking out.
 *
 * THREE SEATS, and the third is why. C announces once, as every page does, and then only
 * listens. A two-seat table cannot test `to` AT ALL — the only other socket in the room IS the
 * addressee, so an arm that ignored the field entirely delivers the identical log. Measured,
 * not reasoned: `relayWire`'s `to` check deleted against a two-seat harness left this row
 * GREEN. C is the non-addressee that makes "directed" mean something.
 */
async function run(make: (h: Handlers) => Wire | Promise<Wire>): Promise<string> {
  const fresh = (): Log => ({ msgs: [], present: [] });
  const [A, B, C] = [fresh(), fresh(), fresh()];
  const logs = [A, B, C];
  const a = await make(handlers(A));
  const b = await make(handlers(B));
  const c = await make(handlers(C));
  await Promise.all([a.carrying, b.carrying, c.carrying]);

  const step = async (fn: () => void) => {
    fn();
    await drain(logs);
  };

  await step(() => a.send("hi", { n: 1 }));
  await step(() => b.send("hi", { n: 2 }));
  await step(() => c.send("hi", { n: 3 })); // C's one frame: it announces, then it listens
  await step(() => b.send("hi", { n: 4, ack: true }, a.selfId)); // A hears it, C must not
  await step(() => a.send("st", { n: 5, e: 1, ea: a.selfId, c: {}, b: null }));
  await step(() =>
    a.send("op", { n: 6, p: 40, v: 7, l: 2, a: a.selfId, e: 1, ea: a.selfId }),
  );
  await step(() =>
    b.send("op", { n: 7, p: 40, v: 9, l: 3, a: b.selfId, e: 1, ea: a.selfId }),
  );
  await step(() =>
    a.send("st", { n: 8, e: 4, ea: a.selfId, c: {}, b: null }, b.selfId),
  );
  await step(() => b.leave()); // the `bye` has to be heard before A's channel goes with it
  await step(() => a.leave());
  await step(() => c.leave());

  // The seating: `local-8f3a…` and `r-4c19…` are the one thing that legitimately differs
  // between two arms, so they read as the chair rather than as the id. It happens BEFORE the
  // sort, and that is not a detail — sorting raw ids sorts twelve random base-36 characters,
  // which is a comparison that agrees with itself about nothing.
  const seat = (row: string) =>
    row.split(a.selfId).join("A").split(b.selfId).join("B").split(c.selfId).join("C");
  for (const log of logs) {
    log.msgs = log.msgs.map(seat);
    // `present` sorts — see the header on why WHEN a peer became known is the boot announce's
    // business and WHO is at the table is the seam's.
    log.present = log.present.map(seat).sort();
  }
  return JSON.stringify({ A, B, C }, null, 1);
}

afterEach(() => {
  vi.unstubAllGlobals();
  HubSocket.hub = [];
});

describe("the transport seam — both arms deliver the same script to the same handlers", () => {
  it("localWire and relayWire agree, frame for frame, join for leave", async () => {
    const local = await run((h) => localWire(ROOM, h));

    vi.stubGlobal("WebSocket", HubSocket);
    const relay = await run((h) => relayWire(ROOM, RELAY_URLS, h));

    // The claim, and the only assertion that matters: the seam holds.
    expect(relay).toBe(local);

    // …and it is not three empty logs agreeing. Every clause below is a way an arm can be
    // wrong: #4 reached A and NOT the room (C's `msgs` skips from #2 to #5), #8 reached B and
    // NOT the room (C's skips #8), both ops crossed both ways, and the `bye`s landed on
    // whoever was still at the table when they were sent — B's on A and C, A's on C alone,
    // C's on nobody, so a `bye` that is merely broadcast at the room fails here too.
    expect(JSON.parse(local)).toEqual({
      A: {
        msgs: ["B hi #2", "C hi #3", "B hi #4", "B op #7"],
        present: ["B join", "B leave", "C join"],
      },
      B: {
        msgs: ["A hi #1", "C hi #3", "A st #5", "A op #6", "A st #8"],
        present: ["A join", "C join"],
      },
      C: {
        msgs: ["A hi #1", "B hi #2", "A st #5", "A op #6", "B op #7"],
        present: ["A join", "A leave", "B join", "B leave"],
      },
    });
    // No raw id survived the seating — the comparison is of frames, not of a coincidence.
    expect(local).not.toMatch(/local-|r-[0-9a-f]/);
    expect(relay).not.toMatch(/local-|r-[0-9a-f]/);
  });
});

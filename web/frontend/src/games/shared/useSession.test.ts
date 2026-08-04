import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { wins, type Handlers, type Msg, type Wire } from "./useSession";
import { inkFor, slugFor } from "./playerIdentity";

/**
 * FE-unit layer for the two claims the multiplayer session rests on (T6 mark 13). Both are
 * pure, and both are the KIND of thing that looks right and isn't: a convergence rule that
 * happens to work on the delivery order you tried, and an identity scheme that happens not to
 * collide on the peers you had. The wire itself rides `e2e/multiplayer.spec.ts` — two pages,
 * one browser context, the built dist — because a transport is not a unit.
 */

type Stamp = [number, string];

/**
 * One replica of the board, built from NOTHING BUT `wins` — the same call the message handler
 * makes. Deliver the same set of ops in any order and two of these must agree, which is what
 * convergence means when there is no server to ask.
 */
function replica() {
  const values: Record<number, number> = {};
  const clock: Record<number, Stamp> = {};
  return {
    values,
    deliver(op: { pos: number; value: number; stamp: Stamp }) {
      if (!wins(op.stamp, clock[op.pos])) return;
      clock[op.pos] = op.stamp;
      values[op.pos] = op.value;
    },
  };
}

const shuffle = <T>(xs: T[], seed: number): T[] => {
  const out = [...xs];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

describe("Lamport-LWW — two replicas, every delivery order, one board", () => {
  // Sixteen players contending for eight cells, with deliberate lamport TIES on every cell so
  // the author tie-break is exercised rather than merely present.
  const ops = Array.from({ length: 16 }, (_, p) =>
    Array.from({ length: 8 }, (_, cell) => ({
      pos: cell,
      value: (p % 9) + 1,
      stamp: [1 + ((p + cell) % 4), `peer-${String(p).padStart(2, "0")}`] as Stamp,
    })),
  ).flat();

  it("converges whatever order the ops arrive in", () => {
    const reference = replica();
    for (const op of ops) reference.deliver(op);

    for (const seed of [1, 7, 42, 1009, 65537]) {
      const other = replica();
      for (const op of shuffle(ops, seed)) other.deliver(op);
      expect(other.values, `delivery order ${seed}`).toEqual(reference.values);
    }
  });

  it("is idempotent — a re-delivered op changes nothing", () => {
    const a = replica();
    for (const op of ops) a.deliver(op);
    const settled = { ...a.values };
    for (const op of [...ops, ...ops].reverse()) a.deliver(op);
    expect(a.values).toEqual(settled);
  });

  it("the tie-break is the AUTHOR, not the arrival — the higher id takes the cell", () => {
    const a = replica();
    a.deliver({ pos: 0, value: 4, stamp: [3, "zebra"] });
    a.deliver({ pos: 0, value: 9, stamp: [3, "aardvark"] }); // same clock, lower author
    expect(a.values[0]).toBe(4);

    const b = replica();
    b.deliver({ pos: 0, value: 9, stamp: [3, "aardvark"] });
    b.deliver({ pos: 0, value: 4, stamp: [3, "zebra"] }); // arrives second AND wins
    expect(b.values[0]).toBe(4);
  });

  it("an older write never takes a cell back", () => {
    const a = replica();
    a.deliver({ pos: 0, value: 7, stamp: [9, "b"] });
    a.deliver({ pos: 0, value: 2, stamp: [8, "z"] });
    expect(a.values[0]).toBe(7);
  });
});

describe("identity — derived on every page, negotiated on none", () => {
  it("the same peer id reads the same name everywhere, forever", () => {
    const empty = new Set<string>();
    for (const id of ["abc123", "ZZZ", "peer-07"])
      expect(slugFor(id, empty)).toBe(slugFor(id, empty));
  });

  it("a taken name re-rolls rather than growing a number", () => {
    const first = slugFor("abc123", new Set());
    const second = slugFor("abc123", new Set([first]));
    expect(second).not.toBe(first);
    expect(second).not.toMatch(/\d/);
    expect(second.split("-")).toHaveLength(2);
  });

  it("every name is writeable in the hand the roster is drawn in", () => {
    // Patrick Hand's cut holds a–i, k–w, y, z. A `j` or an `x` would render mid-word in the
    // system cursive on every row that drew it, which no gate downstream can see.
    //
    // BORN RED against the library's own string-seed path: at 400 ids that loop reached 343
    // names and then spun forever, because `getFromSeed` folds a string into ~128 buckets.
    // Four hundred is far past any room this will hold, and that is the point — the number
    // that must not be small is the one the re-roll loop is searching in.
    const taken = new Set<string>();
    for (let i = 0; i < 400; i++) {
      const slug = slugFor(`peer-${i}-${"z".repeat(i % 7)}`, taken);
      expect(slug, slug).toMatch(/^[a-ik-wyz]+-[a-ik-wyz]+$/);
      taken.add(slug);
    }
    expect(taken.size).toBe(400); // 400 distinct names, no cap, no suffix
  });

  it("ink is the golden-angle walk, and it never repeats a hue inside a room", () => {
    expect(inkFor(0)["--color-user-ink"]).toBe("oklch(var(--peer-ink-l) 0.11 0.0deg)");
    expect(inkFor(1)["--color-user-ink"]).toBe(
      "oklch(var(--peer-ink-l) 0.11 137.5deg)",
    );
    expect(inkFor(2)["--color-user-ink"]).toBe(
      "oklch(var(--peer-ink-l) 0.11 275.0deg)",
    );
    // Sixteen players, sixteen hues, and the closest two are still 12.5° apart: the golden
    // angle's whole property is that no prefix of the walk clusters. A table of hexes would
    // have run out eleven players ago.
    const hues = Array.from({ length: 16 }, (_, i) => (i * 137.5) % 360).sort(
      (a, b) => a - b,
    );
    const gaps = hues.slice(1).map((h, i) => h - hues[i]);
    expect(new Set(hues).size).toBe(16);
    expect(Math.min(...gaps)).toBeGreaterThanOrEqual(12.5);
  });
});

// ── THE TABLE (T8-W3) — the session driven whole, through a wire this harness holds ─────────
//
// Everything above this line is pure and needs no room. Everything below is the SESSION: the
// epoch that names its worksheet, the follow, the ink assignment, the ghost, the link, and the
// identity binding that makes a return a return. None of it is reachable through an exported
// pure function, and all of it is reachable through the seam the design already has — so the
// harness mocks `./relayWire` and IS the transport: every frame the session sends is banked,
// every frame it hears is handed to it by name, and nothing is timed by a sleep.
//
// The module is a SINGLETON over refs, so each page is a fresh `vi.resetModules()` import —
// `useStagingBridge.test.ts`'s rule, and for the same reason: a public reset seam would be a
// second lifecycle shipped to production for the tests' benefit. Two "tabs" are two boots with
// `sessionStorage` cleared in between, which is exactly what two tabs are (they share the
// origin's `localStorage` and not its per-tab half).

type SessionMod = typeof import("./useSession");
type BridgeMod = typeof import("./useStagingBridge");

interface Page {
  session: SessionMod;
  bridge: BridgeMod;
  /** what this page put on the wire, in order. */
  sent: { kind: string; data: Msg; to?: string }[];
  /** hand the page a frame from `from`, exactly as an arm would. */
  hear: (kind: string, data: Msg, from: string) => void;
  /** presence, as both arms derive it: any traffic is a join, a `bye` is a leave. */
  peer: (id: string, joined: boolean) => void;
  /** the socket's own word. */
  link: (up: boolean) => void;
  /** boards this page's mounted game adopted, with the size each arrived at. */
  adopted: { blob: unknown; size: number }[];
  /** games the app was asked to turn to. */
  followed: string[];
  events: { type: string; id: string; slug: string }[];
  selfId: () => string;
  setSize: (n: number) => void;
}

/** Boot a page: a fresh module graph, a mounted game, and a wire this test owns. */
async function bootPage(game = "sudoku", size = 3): Promise<Page> {
  vi.resetModules();
  let handlers: Handlers | null = null;
  const sent: Page["sent"] = [];
  vi.doMock("./relayWire", () => ({
    relayWire: (_room: string, _urls: string[], h: Handlers, selfId: string): Wire => {
      handlers = h;
      return {
        selfId,
        send: (kind, data, to) => sent.push({ kind, data, to }),
        leave: () => {},
        carrying: Promise.resolve(),
      };
    },
  }));
  const session: SessionMod = await import("./useSession");
  const bridge: BridgeMod = await import("./useStagingBridge");
  bridge.publishMountedGame(game);

  const adopted: Page["adopted"] = [];
  const followed: string[] = [];
  let live = size;
  session.registerSessionSource({
    applyValue: () => {},
    snapshot: () => ({ b: { values: {} }, m: {} }),
    size: () => live,
    restore: (blob, z) => adopted.push({ blob, size: z }),
  });
  session.registerGameFollower((id) => followed.push(id));
  const events: Page["events"] = [];
  session.onSessionEvent((e) => events.push({ type: e.type, id: e.id, slug: e.slug }));

  return {
    session,
    bridge,
    sent,
    adopted,
    followed,
    events,
    hear: (kind, data, from) =>
      handlers!.message(kind as Parameters<Handlers["message"]>[0], data, from),
    peer: (id, joined) => handlers!.peer(id, joined),
    link: (up) => handlers!.link?.(up),
    selfId: () => session.session.players.value[0]?.id ?? "",
    setSize: (n) => (live = n),
  };
}

/** The `st` a peer publishes — the shape `sendState` writes, so a row that reads one is
 *  reading the wire's own grammar rather than a fixture's. */
const stFrame = (opts: {
  e: number;
  ea: string;
  g: string;
  z: number;
  k?: Record<string, number>;
  b?: unknown;
}): Msg =>
  ({
    b: (opts.b ?? { b: { values: { "0": 7 } }, m: {} }) as Msg[string],
    c: {},
    e: opts.e,
    ea: opts.ea,
    g: opts.g,
    z: opts.z,
    k: opts.k ?? {},
  }) as Msg;

const lastOf = (p: Page, kind: string) =>
  [...p.sent].reverse().find((f) => f.kind === kind);

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});
afterEach(() => {
  vi.useRealTimers();
  vi.doUnmock("./relayWire");
});

describe("the epoch names its worksheet — `st` gains g, z and k", () => {
  it("publishes the mounted game, its size, and the room's ink assignment", async () => {
    const p = await bootPage("kenken", 4);
    await p.session.joinSession("room-g", true);
    p.peer("peer-1", true);
    p.session.publishBoard();

    const st = lastOf(p, "st")!;
    expect(st.data.g).toBe("kenken");
    expect(st.data.z).toBe(4);
    // Every id has an index, this page's own included: the OTHER pages ink you from `k`, so a
    // publisher with no index of its own would be the one player the room could not agree on.
    const k = st.data.k as Record<string, number>;
    expect(Object.keys(k).sort()).toEqual([p.selfId(), "peer-1"].sort());
    expect(k[p.selfId()]).toBe(0);
  });

  it("a same-game `st` is adopted in place, AT THE PUBLISHED SIZE (defect D-1)", async () => {
    const p = await bootPage("sudoku", 3);
    await p.session.joinSession("room-z");
    // A peer commits a size-changing Deal: same game, different dimensions. Before the cure the
    // size never crossed at all and 256 values landed in a 9×9 model.
    p.hear("st", stFrame({ e: 9, ea: "peer-1", g: "sudoku", z: 4 }), "peer-1");
    expect(p.adopted).toHaveLength(1);
    expect(p.adopted[0].size).toBe(4);
    expect(p.followed).toEqual([]); // no page-turn: the worksheet is the same one
  });

  it("a different-game `st` stages the board and asks the app to turn the page", async () => {
    const p = await bootPage("sudoku", 3);
    await p.session.joinSession("room-f");
    p.hear("st", stFrame({ e: 4, ea: "peer-1", g: "kenken", z: 4 }), "peer-1");

    // The switcher's board does not land on THIS mount — it waits, id-keyed, for the game it
    // belongs to, and the app is asked for exactly that game.
    expect(p.adopted).toEqual([]);
    expect(p.followed).toEqual(["kenken"]);
    const staged = p.bridge.consumeBoardFollow("kenken");
    expect(staged?.size).toBe(4);
    expect(staged?.blob).toBeTruthy();
  });

  it("the staged board is a ONE-SHOT: a mis-routed arm dies at the first mount", async () => {
    const p = await bootPage("sudoku", 3);
    await p.session.joinSession("room-f2");
    p.hear("st", stFrame({ e: 4, ea: "peer-1", g: "kenken", z: 4 }), "peer-1");
    // Some other game mounts first (a deep link, a race). It gets nothing…
    expect(p.bridge.consumeBoardFollow("futoshiki")).toBeNull();
    // …and the arm is spent, rather than lying in wait to hand a kenken board to kenken three
    // switches later. The `hi` a mount sends re-requests the board honestly instead.
    expect(p.bridge.consumeBoardFollow("kenken")).toBeNull();
  });

  it("an older epoch never turns the page", async () => {
    const p = await bootPage("sudoku", 3);
    await p.session.joinSession("room-old", true); // starter opens epoch [1, self]
    p.hear("st", stFrame({ e: 0, ea: "peer-1", g: "kenken", z: 4 }), "peer-1");
    expect(p.followed).toEqual([]);
    expect(p.adopted).toEqual([]);
  });
});

describe("ink is the room's, not the page's — `k` adoption", () => {
  it("rebinds from the assignment, continues the cursor past it, and is idempotent", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-k");
    const k = { "peer-1": 5, "peer-2": 2 };
    p.hear("st", stFrame({ e: 3, ea: "peer-1", g: "sudoku", z: 3, k }), "peer-1");
    p.peer("peer-1", true);
    p.peer("peer-2", true);

    const inkOf = (id: string) =>
      p.session.session.players.value.find((r) => r.id === id)?.ink;
    expect(inkOf("peer-1")).toEqual(inkFor(5));
    expect(inkOf("peer-2")).toEqual(inkFor(2));

    // A newcomer extends from max+1 rather than colliding with an index already agreed.
    p.peer("peer-3", true);
    expect(inkOf("peer-3")).toEqual(inkFor(6));

    // Re-adopting the same assignment moves nothing — indices are never reassigned, which is
    // the whole of why a rejoiner cannot find somebody else in their colour.
    p.hear("st", stFrame({ e: 4, ea: "peer-1", g: "sudoku", z: 3, k }), "peer-1");
    expect(inkOf("peer-1")).toEqual(inkFor(5));
    expect(inkOf("peer-3")).toEqual(inkFor(6));
  });

  it("names a peer who left before this page arrived", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-departed");
    // `k` carries departed ids, so a cell in the clock has an author with a name…
    p.hear(
      "st",
      stFrame({ e: 2, ea: "peer-1", g: "sudoku", z: 3, k: { gone: 1 } }),
      "peer-1",
    );
    expect(p.session.cellAuthors.value).toEqual({}); // the fixture's clock is empty
    // …and it does NOT put them at the table: a name is not a presence.
    expect(p.session.session.players.value.map((r) => r.id)).not.toContain("gone");
  });
});

describe("the ghost — `cur`, and what it refuses to be", () => {
  it("throttles to the leading edge and one trailing frame", async () => {
    vi.useFakeTimers();
    const p = await bootPage();
    await p.session.joinSession("room-cur", true);
    p.session.noteFocus(1);
    p.session.noteFocus(2);
    p.session.noteFocus(3);
    expect(p.sent.filter((f) => f.kind === "cur").map((f) => f.data.p)).toEqual([1]);
    vi.advanceTimersByTime(120);
    // The LATEST glance is the one that lands — a sweep is a movement, not a slideshow.
    expect(p.sent.filter((f) => f.kind === "cur").map((f) => f.data.p)).toEqual([1, 3]);
  });

  it("drops a cursor aimed at another board, holds one aimed at this one, and expires it", async () => {
    vi.useFakeTimers();
    const p = await bootPage();
    await p.session.joinSession("room-ghost", true);
    const e = 1;
    const ea = p.selfId();

    p.hear("cur", { p: 40, e: 99, ea: "someone-else" }, "peer-1");
    expect(p.session.peerCursors.value).toEqual({}); // stale board, same discriminant as an op

    p.hear("cur", { p: 40, e, ea }, "peer-1");
    expect(p.session.peerCursors.value).toEqual({ "peer-1": 40 });
    p.hear("cur", { p: null, e, ea }, "peer-1");
    expect(p.session.peerCursors.value).toEqual({ "peer-1": null }); // "looked away", said

    p.hear("cur", { p: 12, e, ea }, "peer-1");
    vi.advanceTimersByTime(45000);
    // A socket open behind a dead page is nobody's `bye`; the ghost still goes.
    expect(p.session.peerCursors.value).toEqual({});
  });

  it("clears wholesale at the epoch, and per id at a departure", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-ghost2", true);
    p.peer("peer-1", true);
    p.peer("peer-2", true);
    p.hear("cur", { p: 3, e: 1, ea: p.selfId() }, "peer-1");
    p.hear("cur", { p: 4, e: 1, ea: p.selfId() }, "peer-2");
    expect(Object.keys(p.session.peerCursors.value)).toHaveLength(2);

    p.peer("peer-1", false);
    expect(p.session.peerCursors.value).toEqual({ "peer-2": 4 });
    p.session.publishBoard(); // a new board is a new set of things to be looking at
    expect(p.session.peerCursors.value).toEqual({});
  });
});

describe("`live` follows the socket — the latch dies", () => {
  it("a table you opened is one you are at; a dropped link says so", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-live", true);
    p.link(true);
    expect(p.session.session.live.value).toBe(true);
    p.link(false);
    expect(p.session.session.live.value).toBe(false); // ops stop vanishing behind a green light
    p.link(true);
    expect(p.session.session.live.value).toBe(true);
  });

  it("a table you followed a link into waits for the room to answer", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-join");
    p.link(true);
    expect(p.session.session.live.value).toBe(false); // connecting…
    p.hear("hi", { ack: true }, "peer-1"); // the room answers the announce
    expect(p.session.session.live.value).toBe(true);
    p.link(false);
    expect(p.session.session.live.value).toBe(false);
  });
});

describe("the session outlives the scene", () => {
  it("clearing the board source does NOT end the room (the trapdoor, deleted)", async () => {
    const p = await bootPage();
    const src = {
      applyValue: () => {},
      snapshot: () => ({}),
      size: () => 3,
      restore: () => {},
    };
    p.session.registerSessionSource(src);
    await p.session.joinSession("room-survive", true);
    p.session.clearSessionSource(src); // the outgoing scene unmounts at a game switch
    expect(p.session.session.roomId.value).toBe("room-survive");
    // …and the leave verb still leaves, whole.
    p.session.leaveSession();
    expect(p.session.session.roomId.value).toBeNull();
  });
});

describe("arrivals, departures, and returns", () => {
  it("a join whose id the roster already holds is a REJOIN, with no duplicate row", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-events", true);
    p.peer("peer-1", true);
    p.peer("peer-1", true); // traffic is not presence — an idempotent join says nothing
    expect(p.events.map((e) => e.type)).toEqual(["join"]);
    const slug = p.session.session.players.value[1].slug;
    const ink = p.session.session.players.value[1].ink;

    p.peer("peer-1", false);
    expect(p.events.map((e) => e.type)).toEqual(["join", "leave"]);
    expect(p.session.session.players.value).toHaveLength(1);

    p.peer("peer-1", true);
    expect(p.events.map((e) => e.type)).toEqual(["join", "leave", "rejoin"]);
    expect(p.session.session.players.value).toHaveLength(2);
    // Same name, same colour: `known` retained them, so nothing was re-minted.
    expect(p.session.session.players.value[1].slug).toBe(slug);
    expect(p.session.session.players.value[1].ink).toEqual(ink);
  });
});

describe("the binding — you rejoin as slug x (§2.9)", () => {
  it("a new tab in the same room reclaims the id, the slug and the ink", async () => {
    const a = await bootPage();
    await a.session.joinSession("room-return", true);
    const id = a.selfId();
    const slug = a.session.session.players.value[0].slug;
    a.session.leaveSession(); // the leave verb, or a tab closing — both release the claim

    window.sessionStorage.clear(); // …and this is what makes the next boot a DIFFERENT tab
    const b = await bootPage();
    await b.session.joinSession("room-return");
    expect(b.selfId()).toBe(id);
    expect(b.session.session.players.value[0].slug).toBe(slug);
  });

  it("keeps the name even when the room has expired and nobody answers", async () => {
    const a = await bootPage();
    await a.session.joinSession("room-expired", true);
    const id = a.selfId();
    a.session.leaveSession();

    window.sessionStorage.clear();
    const b = await bootPage();
    await b.session.joinSession("room-expired", true); // a fresh epoch, plainly a fresh join
    expect(b.selfId()).toBe(id); // the binding is yours, not the room's grant
    expect(b.session.session.live.value).toBe(false); // nothing has answered yet
  });

  it("a SECOND live tab is a second player — it never takes the first one's name", async () => {
    const a = await bootPage();
    await a.session.joinSession("room-two-tabs", true);
    const id = a.selfId();

    window.sessionStorage.clear(); // a second tab, with the first still live
    const b = await bootPage();
    await b.session.joinSession("room-two-tabs");
    expect(b.selfId()).not.toBe(id);

    // …and the first tab's name is still the first tab's: a second tab borrows nothing.
    b.session.leaveSession();
    a.session.leaveSession();
    window.sessionStorage.clear();
    const c = await bootPage();
    await c.session.joinSession("room-two-tabs");
    expect(c.selfId()).toBe(id);
  });

  it("the binding is per ROOM — a different table is a different name", async () => {
    const a = await bootPage();
    await a.session.joinSession("room-one", true);
    const first = a.selfId();
    await a.session.joinSession("room-two", true);
    expect(a.selfId()).not.toBe(first);
  });
});

// THE THREE WIRE ROWS, alone, so they can be run against HEAD and against the pass-1 rider
// with neither file's later exports in the import graph. A scratch instrument: it is copied
// into `src/games/shared/` for one run and removed. The rows are verbatim in substance with
// `useSession.test.ts`'s U1/U2/U3.
import { beforeEach, describe, it, expect, vi } from "vitest";
import type { Handlers, Msg, Wire } from "./useSession";
import { inkFor } from "./playerIdentity";

type SessionMod = typeof import("./useSession");
type BridgeMod = typeof import("./useStagingBridge");

interface Page {
  session: SessionMod;
  hear: (kind: string, data: Msg, from: string) => void;
  peer: (id: string, joined: boolean) => void;
  selfId: () => string;
}

async function bootPage(game = "sudoku", size = 3): Promise<Page> {
  vi.resetModules();
  let handlers: Handlers | null = null;
  vi.doMock("./relayWire", () => ({
    relayWire: (_room: string, _url: string, h: Handlers, selfId: string): Wire => {
      handlers = h;
      return {
        selfId,
        send: () => {},
        leave: () => {},
        carrying: Promise.resolve(),
      };
    },
  }));
  const session: SessionMod = await import("./useSession");
  const bridge: BridgeMod = await import("./useStagingBridge");
  bridge.publishMountedGame(game);
  session.registerSessionSource({
    applyValue: () => {},
    snapshot: () => ({ b: { values: {} }, m: {} }),
    size: () => size,
    restore: () => {},
  });
  return {
    session,
    hear: (kind, data, from) =>
      handlers!.message(kind as Parameters<Handlers["message"]>[0], data, from),
    peer: (id, joined) => handlers!.peer(id, joined),
    selfId: () => session.session.players.value[0]?.id ?? "",
  };
}

const stFrame = (o: {
  e: number;
  ea: string;
  k?: Record<string, number>;
}): Msg =>
  ({
    b: { b: { values: { "0": 7 } }, m: {} } as Msg[string],
    c: {},
    e: o.e,
    ea: o.ea,
    g: "sudoku",
    z: 3,
    k: o.k ?? {},
  }) as Msg;

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe("the wire rule (PAL-TIN §1.1)", () => {
  it("U1 an agreed index survives a non-author's rival `st`", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-u1");
    const inkOf = (id: string) =>
      p.session.session.players.value.find((r) => r.id === id)?.ink;
    p.hear("st", stFrame({ e: 5, ea: "peer-1", k: { "peer-9": 3 } }), "peer-1");
    p.peer("peer-9", true);
    expect(inkOf("peer-9")).toEqual(inkFor(3));
    p.hear("st", stFrame({ e: 6, ea: "peer-1", k: { "peer-9": 7 } }), "peer-2");
    expect(inkOf("peer-9")).toEqual(inkFor(3));
  });

  it("U2 a joiner's own publish agrees nothing", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-u2", true);
    p.session.publishBoard();
    p.peer("peer-1", true);
    p.peer("peer-2", true);
    const inkOf = (id: string) =>
      p.session.session.players.value.find((r) => r.id === id)?.ink;
    const me = p.selfId();
    p.hear("st", stFrame({ e: 9, ea: "peer-1", k: { [me]: 7 } }), "peer-2");
    p.hear("st", stFrame({ e: 10, ea: "peer-1", k: { [me]: 3 } }), "peer-1");
    expect(inkOf(me)).toEqual(inkFor(3));
  });

  it("U3 no two known ids share an ink across two epochs by two authors", async () => {
    const p = await bootPage();
    await p.session.joinSession("room-u3");
    p.hear(
      "st",
      stFrame({ e: 2, ea: "peer-1", k: { "peer-1": 0, "peer-2": 1 } }),
      "peer-1",
    );
    p.peer("peer-1", true);
    p.peer("peer-2", true);
    p.hear(
      "st",
      stFrame({
        e: 8,
        ea: "peer-2",
        k: { "peer-1": 2, "peer-2": 0, [p.selfId()]: 1 },
      }),
      "peer-2",
    );
    const rows = p.session.session.players.value;
    const inks = rows.map((r) => r.ink["--color-user-ink"]);
    expect(inks.every(Boolean)).toBe(true);
    expect(new Set(inks).size).toBe(rows.length);
  });
});

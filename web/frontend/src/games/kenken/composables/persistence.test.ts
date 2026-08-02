import { describe, it, expect, beforeEach } from "vitest";
import { toBase64Url } from "@/lib/base64url";
import { persistence } from "./useKenken";

// KenKen's `?board=` permalink — REAL as of T5-W2 2.4. KenKen is a LATIN family, so its raw
// selector size IS the board side (4..6) and a cage carries an operator ordinal as well as a
// target — the widest clue on the wire, and the one that proves the codec is driven by
// `clues.encode/decode` rather than by anything the persistence layer knows about a cage.

const { encodeBoard, resolveInitialState } = persistence;

const V1 = String.fromCharCode(1);
const encV1 = (b: string) => toBase64Url(V1 + b);

/** Base-36 cell string of length size**2 — kenken is a LATIN family. */
function cells(size: number, vals: Record<number, number> = {}): string {
  let s = "";
  for (let i = 0; i < size ** 2; i++) s += (vals[i] ?? 0).toString(36);
  return s;
}

function go(params: Record<string, string>): void {
  const qs = new URLSearchParams(params).toString();
  window.history.replaceState(null, "", qs ? `/?${qs}` : "/");
}
const boardInBar = () => new URLSearchParams(window.location.search).has("board");

// A 4×4 board: one product cage, one singleton given-cage.
const CAGES = [
  { op: "×" as const, target: 12, cells: [0, 1, 4] },
  { op: "+" as const, target: 3, cells: [15] },
];

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("kenken permalink round-trip", () => {
  it("restores the board AND its operator-cage furniture from ?board= alone", () => {
    go({ game: "kenken", board: encodeBoard(4, { 0: 1, 15: 3 }, 16, CAGES) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("ok");
    expect(s.source).toBe("url-board");
    expect(s.size).toBe(4);
    expect(s.persisted?.values[0]).toBe(1);
    expect([...(s.persisted?.givenCells ?? [])].sort()).toEqual(["0", "15"]);
    expect(s.persisted?.cages).toEqual(CAGES);
  });

  it("an empty cage set round-trips (the 3-part body's empty clue section)", () => {
    go({ game: "kenken", board: encodeBoard(4, { 0: 1 }, 16, []) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("ok");
    expect(s.persisted?.cages).toEqual([]);
  });

  it("an ACCEPTED link stays in the bar", () => {
    go({ game: "kenken", board: encodeBoard(4, { 0: 1 }, 16, CAGES) });
    expect(resolveInitialState().boardLink).toBe("ok");
    expect(boardInBar()).toBe(true);
  });
});

describe("kenken reject-strip: a refused link leaves the address bar", () => {
  it("strips ?board= on every fail-closed arm", () => {
    for (const bad of [
      toBase64Url(`4.${cells(4)}.`), // untagged — the dead v0 ratchet
      "@@@@", // undecodable base64
      "A".repeat(4097), // past the DoS bound
      toBase64Url(String.fromCharCode(2) + `4.${cells(4)}.`), // unknown version
      encV1(`4.${cells(4)}`), // 2-part body: a clue-bearing game needs its clue section
      encV1(`9.${cells(9)}.`), // size out of band
      encV1(`4.${"0".repeat(15)}.`), // short cell count
      encV1(`4.${cells(4)}.3,2,c,0,1`), // TRUNCATED cage: claims 3 cells, 2 follow
      encV1(`4.${cells(4)}.1,9,5,0`), // operator ordinal 9 is not one of the four
    ]) {
      go({ game: "kenken", board: bad });
      expect(resolveInitialState().boardLink).toBe("invalid");
      expect(boardInBar()).toBe(false);
    }
  });

  it("keeps the rest of the query — only ?board= is deleted", () => {
    go({ game: "kenken", board: "@@@@" });
    expect(resolveInitialState().boardLink).toBe("invalid");
    expect(boardInBar()).toBe(false);
    expect(new URLSearchParams(window.location.search).get("game")).toBe("kenken");
  });

  it("an absent link touches nothing", () => {
    go({ game: "kenken" });
    expect(resolveInitialState().boardLink).toBe("absent");
    expect(window.location.search).toBe("?game=kenken");
  });
});

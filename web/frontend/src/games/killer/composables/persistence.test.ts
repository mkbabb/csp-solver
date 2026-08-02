import { describe, it, expect, beforeEach } from "vitest";
import { toBase64Url } from "@/lib/base64url";
import { persistence } from "./useKiller";

// Killer's `?board=` permalink — REAL as of T5-W2 2.4. Same two contracts as thermo's twin
// rows: the cage furniture round-trips through `clues.encode/decode`, and a refused link is
// deleted from the bar rather than left standing describing a board that isn't there.

const { encodeBoard, resolveInitialState } = persistence;

const V1 = String.fromCharCode(1);
const encV1 = (b: string) => toBase64Url(V1 + b);

/** Base-36 cell string of length (size**2)**2 — killer is a BOXED family. */
function cells(size: number, vals: Record<number, number> = {}): string {
  let s = "";
  for (let i = 0; i < size ** 4; i++) s += (vals[i] ?? 0).toString(36);
  return s;
}

function go(params: Record<string, string>): void {
  const qs = new URLSearchParams(params).toString();
  window.history.replaceState(null, "", qs ? `/?${qs}` : "/");
}
const boardInBar = () => new URLSearchParams(window.location.search).has("board");

// A 4×4 (raw size 2) board with two cages.
const CAGES = [
  { sum: 7, cells: [0, 1] },
  { sum: 9, cells: [4, 5, 8] },
];

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("killer permalink round-trip", () => {
  it("restores the board AND its cage furniture from ?board= alone", () => {
    go({ game: "killer", board: encodeBoard(2, { 0: 1, 15: 4 }, 16, CAGES) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("ok");
    expect(s.source).toBe("url-board");
    expect(s.size).toBe(2);
    expect(s.persisted?.values[0]).toBe(1);
    expect([...(s.persisted?.givenCells ?? [])].sort()).toEqual(["0", "15"]);
    expect(s.persisted?.cages).toEqual(CAGES);
  });

  it("an empty cage set round-trips (the 3-part body's empty clue section)", () => {
    go({ game: "killer", board: encodeBoard(2, { 0: 1 }, 16, []) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("ok");
    expect(s.persisted?.cages).toEqual([]);
  });

  it("an ACCEPTED link stays in the bar", () => {
    go({ game: "killer", board: encodeBoard(2, { 0: 1 }, 16, CAGES) });
    expect(resolveInitialState().boardLink).toBe("ok");
    expect(boardInBar()).toBe(true);
  });
});

describe("killer reject-strip: a refused link leaves the address bar", () => {
  it("strips ?board= on every fail-closed arm", () => {
    for (const bad of [
      toBase64Url(`2.${cells(2)}.`), // untagged — the dead v0 ratchet
      "@@@@", // undecodable base64
      "A".repeat(4097), // past the DoS bound
      toBase64Url(String.fromCharCode(2) + `2.${cells(2)}.`), // unknown version
      encV1(`2.${cells(2)}`), // 2-part body: a clue-bearing game needs its clue section
      encV1(`9.${cells(9)}.`), // size out of band
      encV1(`2.${"0".repeat(15)}.`), // short cell count
      encV1(`2.${cells(2)}.2,7,0`), // TRUNCATED cage: claims 2 cells, 1 follows
    ]) {
      go({ game: "killer", board: bad });
      expect(resolveInitialState().boardLink).toBe("invalid");
      expect(boardInBar()).toBe(false);
    }
  });

  it("keeps the rest of the query — only ?board= is deleted", () => {
    go({ game: "killer", board: "@@@@" });
    expect(resolveInitialState().boardLink).toBe("invalid");
    expect(boardInBar()).toBe(false);
    expect(new URLSearchParams(window.location.search).get("game")).toBe("killer");
  });

  it("an absent link touches nothing", () => {
    go({ game: "killer" });
    expect(resolveInitialState().boardLink).toBe("absent");
    expect(window.location.search).toBe("?game=killer");
  });
});

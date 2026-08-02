import { describe, it, expect, beforeEach } from "vitest";
import { toBase64Url } from "@/lib/base64url";
import { persistence } from "./useThermo";

// Thermo's `?board=` permalink — REAL as of T5-W2 2.4 (it was three empty-body no-ops and a
// hard-coded `boardLink: "absent"` before). The codec is the shared one, so the rows here are
// the two contracts a game gets by wiring it: the clue furniture round-trips through
// `clues.encode/decode`, and a link this build refuses LEAVES THE BAR.

const { encodeBoard, resolveInitialState } = persistence;

const V1 = String.fromCharCode(1);
const encV1 = (b: string) => toBase64Url(V1 + b);

/** Base-36 cell string of length (size**2)**2 — thermo is a BOXED family, so a raw 3 is 9×9. */
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

// A 4×4 (raw size 2) board with one two-cell thermometer. Small enough to read.
const THERMOS = [
  [0, 1, 2],
  [7, 11],
];

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("thermo permalink round-trip", () => {
  it("restores the board AND its thermometer furniture from ?board= alone", () => {
    go({ game: "thermo", board: encodeBoard(2, { 0: 1, 15: 4 }, 16, THERMOS) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("ok");
    expect(s.source).toBe("url-board");
    expect(s.size).toBe(2);
    expect(s.persisted?.values[0]).toBe(1);
    expect(s.persisted?.values[15]).toBe(4);
    expect([...(s.persisted?.givenCells ?? [])].sort()).toEqual(["0", "15"]);
    expect(s.persisted?.thermometers).toEqual(THERMOS);
  });

  it("an empty thermometer set round-trips (the 3-part body's empty clue section)", () => {
    go({ game: "thermo", board: encodeBoard(2, { 0: 1 }, 16, []) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("ok");
    expect(s.persisted?.thermometers).toEqual([]);
  });

  it("an ACCEPTED link stays in the bar", () => {
    go({ game: "thermo", board: encodeBoard(2, { 0: 1 }, 16, THERMOS) });
    expect(resolveInitialState().boardLink).toBe("ok");
    expect(boardInBar()).toBe(true);
  });
});

describe("thermo reject-strip: a refused link leaves the address bar", () => {
  it("strips ?board= on every fail-closed arm", () => {
    for (const bad of [
      toBase64Url(`2.${cells(2)}.`), // untagged — the dead v0 ratchet
      "@@@@", // undecodable base64
      "A".repeat(4097), // past the DoS bound, rejected before atob
      toBase64Url(String.fromCharCode(2) + `2.${cells(2)}.`), // unknown version
      encV1(`2.${cells(2)}`), // 2-part body: a clue-bearing game needs its clue section
      encV1(`9.${cells(9)}.`), // size out of band
      encV1(`2.${"0".repeat(15)}.`), // short cell count
      encV1(`2.${cells(2)}.3,0,1`), // TRUNCATED tube: the group claims 3 cells, 2 follow
    ]) {
      go({ game: "thermo", board: bad });
      expect(resolveInitialState().boardLink).toBe("invalid");
      expect(boardInBar()).toBe(false);
    }
  });

  it("keeps the rest of the query — only ?board= is deleted", () => {
    go({ game: "thermo", board: "@@@@" });
    expect(resolveInitialState().boardLink).toBe("invalid");
    expect(boardInBar()).toBe(false);
    expect(new URLSearchParams(window.location.search).get("game")).toBe("thermo");
  });

  it("an absent link touches nothing", () => {
    go({ game: "thermo" });
    expect(resolveInitialState().boardLink).toBe("absent");
    expect(window.location.search).toBe("?game=thermo");
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { toBase64Url } from "@/lib/base64url";
import {
  encodeBoard,
  resolveInitialState,
  persistBoard,
  clearPersistedBoard,
  type PersistedBoard,
} from "./useUrlState";

// FE-unit layer (T4-W2): the Sudoku `?board=` permalink codec. `decodeBoardParam` /
// `readCodecVersion` are module-private (fail-closed by construction), so every branch is
// driven through the public `resolveInitialState()` against a crafted URL + storage — the
// exact surface the app boots on. Playwright could only ever hit the happy path; this
// enumerates the fail-closed set (oversize, bad base64, unknown version, non-canonical size,
// out-of-range/short cells, size mismatch) the wave calls out.

// CODEC_VERSION is 1, private to the codec — reproduce the version byte here to forge frames.
const V1 = String.fromCharCode(1);
const encVer = (v: number, body: string) => toBase64Url(String.fromCharCode(v) + body);
const encV1 = (body: string) => toBase64Url(V1 + body);
const encUntagged = (body: string) => toBase64Url(body); // no version byte at all

/** Base-36 cell string of length size**4 from a sparse {index: value} map (0 elsewhere). */
function cells(size: number, vals: Record<number, number> = {}): string {
  const total = size ** 4;
  let s = "";
  for (let i = 0; i < total; i++) s += (vals[i] ?? 0).toString(36);
  return s;
}

function go(params: Record<string, string>): void {
  const qs = new URLSearchParams(params).toString();
  window.history.replaceState(null, "", qs ? `/?${qs}` : "/");
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("encode/decode round-trip (v1, the encodeBoard path)", () => {
  it("restores a shared board: non-zero cells become the givens, URL wins", () => {
    const board = encodeBoard(3, { 0: 5, 4: 9, 80: 1 }, 81);
    go({ board });
    const s = resolveInitialState();
    expect(s.source).toBe("url-board");
    expect(s.boardLink).toBe("ok");
    expect(s.size).toBe(3);
    expect(s.persisted?.values[0]).toBe(5);
    expect(s.persisted?.values[4]).toBe(9);
    expect(s.persisted?.values[80]).toBe(1);
    expect(s.persisted?.values[1]).toBe(0); // empty cell decoded as 0
    expect([...(s.persisted?.givenCells ?? [])].sort()).toEqual(["0", "4", "80"]);
  });

  it("defaults difficulty to EASY, or takes ?difficulty when present", () => {
    const board = encodeBoard(2, { 0: 3 }, 16);
    go({ board });
    expect(resolveInitialState().difficulty).toBe("EASY");
    go({ board, difficulty: "medium" });
    expect(resolveInitialState().difficulty).toBe("MEDIUM");
  });

  it("encodes empty cells as literal 0 (self-describing size prefix)", () => {
    // Size 2 → 16 cells; a fully blank board round-trips to all-zero values.
    const board = encodeBoard(2, {}, 16);
    go({ board });
    const s = resolveInitialState();
    expect(s.source).toBe("url-board");
    expect(Object.keys(s.persisted?.values ?? {})).toHaveLength(16);
    expect(s.persisted?.givenCells).toHaveLength(0);
  });
});

describe("codec version byte (T4-W3, ratcheted shut T5-W2 2.4d) — tag or nothing", () => {
  it("accepts explicit v1", () => {
    go({ board: encVer(1, `2.${cells(2, { 0: 3 })}`) });
    expect(resolveInitialState().boardLink).toBe("ok");
  });

  it("a round trip through the codec's own encoder still opens", () => {
    go({ board: encodeBoard(3, { 0: 7 }, 3 ** 4) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("ok");
    expect(s.persisted?.values[0]).toBe(7);
  });

  // THE RATCHET IS GONE. An untagged body — the pre-T4-W3 wire, and the only thing the
  // "graceful ratchet" ever accepted — now fails closed like every other malformed link. The
  // byte is mandatory, so there is exactly one accepted wire format.
  it("fails closed on an untagged body (the dead v0 ratchet)", () => {
    go({ board: encUntagged(`3.${cells(3, { 0: 7 })}`) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("fails closed on any version this build does not understand", () => {
    for (const v of [0, 2, 0x2f, 0x33]) {
      go({ board: encVer(v, `3.${cells(3)}`) });
      expect(resolveInitialState().boardLink).toBe("invalid");
    }
  });
});

describe("fail-closed branches", () => {
  it("absent: no ?board → absent", () => {
    go({});
    expect(resolveInitialState().boardLink).toBe("absent");
  });

  it("oversize: raw longer than the 4096 DoS bound rejects before atob", () => {
    go({ board: "A".repeat(4097) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("bad base64: undecodable payload", () => {
    go({ board: "@@@@" });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("non-canonical size: leading space / sign / hex / out-of-range", () => {
    for (const bad of [
      ` 3.${cells(3)}`,
      `-3.${cells(3)}`,
      `0x3.${cells(3)}`,
      `9.${"0".repeat(9)}`,
    ]) {
      go({ board: encV1(bad) });
      expect(resolveInitialState().boardLink).toBe("invalid");
    }
  });

  it("out-of-range cell: value above size**2, or a non-base36 char", () => {
    // size 3 → maxVal 9; 'a' = 10 (over), ' ' = NaN.
    go({ board: encV1(`3.${"a" + "0".repeat(80)}`) });
    expect(resolveInitialState().boardLink).toBe("invalid");
    go({ board: encV1(`3.${" " + "0".repeat(80)}`) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("short / long count: cells.length must equal size**4", () => {
    go({ board: encV1(`3.${"0".repeat(80)}`) });
    expect(resolveInitialState().boardLink).toBe("invalid");
    go({ board: encV1(`3.${"0".repeat(82)}`) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("missing separator dot", () => {
    go({ board: encV1("3") });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("size mismatch: ?size= that disagrees with the board fails closed (URL size still wins)", () => {
    go({ size: "4", board: encodeBoard(3, { 0: 1 }, 81) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("invalid");
    expect(s.source).toBe("url-only");
    expect(s.size).toBe(4);
  });
});

// A rejection that leaves the link standing is a half-rejection: the bar goes on claiming to
// describe a board the app refused to open, and a reload/share re-serves the same lie. Failing
// closed and CLEANING UP are one act, and `dropBoardParam` is the app's one `.delete()` idiom
// for it — the same helper Deal/Clear already call.
describe("a rejected link leaves the address bar", () => {
  const boardInBar = () => new URLSearchParams(window.location.search).has("board");

  it("strips ?board= on the untagged body (the dead v0 ratchet)", () => {
    go({ board: encUntagged(`3.${cells(3, { 0: 7 })}`) });
    expect(resolveInitialState().boardLink).toBe("invalid");
    expect(boardInBar()).toBe(false);
  });

  it("strips ?board= on every other fail-closed arm", () => {
    for (const bad of [
      "A".repeat(4097), // oversize, rejected before atob
      "@@@@", // undecodable base64
      encVer(2, `3.${cells(3)}`), // unknown version
      encV1(`3.${"0".repeat(80)}`), // short cell count
      encV1("3"), // no separator
    ]) {
      go({ board: bad });
      expect(resolveInitialState().boardLink).toBe("invalid");
      expect(boardInBar()).toBe(false);
    }
  });

  it("keeps the rest of the query — only ?board= is deleted", () => {
    // The size-mismatch arm: ?size= wins, and it must survive the cleanup.
    go({ size: "4", difficulty: "hard", board: encodeBoard(3, { 0: 1 }, 81) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("invalid");
    expect(s.size).toBe(4);
    expect(boardInBar()).toBe(false);
    const params = new URLSearchParams(window.location.search);
    expect(params.get("size")).toBe("4");
    expect(params.get("difficulty")).toBe("hard");
  });

  it("an ACCEPTED link stays in the bar — the share permalink is not self-erasing", () => {
    go({ board: encodeBoard(3, { 0: 5 }, 81) });
    expect(resolveInitialState().boardLink).toBe("ok");
    expect(boardInBar()).toBe(true);
  });

  it("an absent link touches nothing", () => {
    go({ size: "3" });
    expect(resolveInitialState().boardLink).toBe("absent");
    expect(window.location.search).toBe("?size=3");
  });
});

describe("bare size / difficulty params (no board)", () => {
  it("a valid ?size / ?difficulty resolves url-only with boardLink absent", () => {
    go({ size: "4" });
    let s = resolveInitialState();
    expect(s.source).toBe("url-only");
    expect(s.size).toBe(4);
    expect(s.boardLink).toBe("absent");

    go({ difficulty: "hard" });
    s = resolveInitialState();
    expect(s.source).toBe("url-only");
    expect(s.difficulty).toBe("HARD");
  });

  it("an invalid ?size is ignored → fresh", () => {
    go({ size: "7" });
    const s = resolveInitialState();
    expect(s.source).toBe("fresh");
    expect(["EASY", "MEDIUM", "HARD"]).toContain(s.difficulty);
  });
});

describe("storage precedence", () => {
  const stored: PersistedBoard = {
    size: 3,
    difficulty: "MEDIUM",
    values: { 0: 4 },
    givenCells: ["0"],
    originalGivenCells: ["0"],
    overriddenCells: [],
    solvedValues: {},
    boardGeneration: 2,
  };

  it("storage-only when no URL", () => {
    persistBoard(stored);
    const s = resolveInitialState();
    expect(s.source).toBe("storage-only");
    expect(s.size).toBe(3);
    expect(s.difficulty).toBe("MEDIUM");
  });

  it("a valid shared board wins over stored state", () => {
    persistBoard(stored);
    go({ board: encodeBoard(2, { 0: 1 }, 16) });
    const s = resolveInitialState();
    expect(s.source).toBe("url-board");
    expect(s.size).toBe(2);
  });

  it("clearPersistedBoard removes the stored state", () => {
    persistBoard(stored);
    clearPersistedBoard();
    go({});
    expect(resolveInitialState().source).toBe("fresh");
  });
});

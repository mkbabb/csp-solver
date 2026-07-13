import { describe, it, expect, beforeEach } from "vitest";
import { toBase64Url } from "@/lib/base64url";
import {
  encodeBoard,
  resolveInitialState,
  persistBoard,
  type PersistedBoard,
} from "./useUrlState";

// FE-unit layer (T4-W2): the Futoshiki `?board=` codec, driven through `resolveInitialState()`
// (the decoder is module-private). The Futoshiki-specific surface is the INEQUALITY furniture
// on the wire — adjacency, dedup, range, and the 3-part body split — the guards a crafted link
// would otherwise weaponize (one floating caret per pair → main-thread freeze). The shared
// fail-closed branches are re-checked lightly here (the port owns its own copy).

const V1 = String.fromCharCode(1);
const encVer = (v: number, body: string) => toBase64Url(String.fromCharCode(v) + body);
const encV1 = (body: string) => toBase64Url(V1 + body);

/** Base-36 cell string of length boardSize**2 (0 elsewhere). */
function cells(boardSize: number, vals: Record<number, number> = {}): string {
  const total = boardSize ** 2;
  let s = "";
  for (let i = 0; i < total; i++) s += (vals[i] ?? 0).toString(36);
  return s;
}

/** Forge a v1 futoshiki body: `${size}.${cells}.${ineqs}`. */
const body = (size: number, vals: Record<number, number>, ineqs: string) =>
  `${size}.${cells(size, vals)}.${ineqs}`;

function go(params: Record<string, string>): void {
  const qs = new URLSearchParams(params).toString();
  window.history.replaceState(null, "", qs ? `/?${qs}` : "/");
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("encode/decode round-trip carries the inequality furniture", () => {
  it("restores values as givens + inequalities in order", () => {
    // size 5: [1,0] horizontal-adjacent, [5,0] vertical-adjacent.
    const board = encodeBoard(5, { 0: 1, 24: 5 }, 25, [
      [1, 0],
      [5, 0],
    ]);
    go({ board });
    const s = resolveInitialState();
    expect(s.source).toBe("url-board");
    expect(s.boardLink).toBe("ok");
    expect(s.boardSize).toBe(5);
    expect(s.persisted?.values[0]).toBe(1);
    expect(s.persisted?.values[24]).toBe(5);
    expect([...(s.persisted?.givenCells ?? [])].sort()).toEqual(["0", "24"]);
    expect(s.persisted?.inequalities).toEqual([
      [1, 0],
      [5, 0],
    ]);
  });

  it("an empty inequality set round-trips (trailing-dot 3-part body)", () => {
    go({ board: encodeBoard(4, { 0: 2 }, 16, []) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("ok");
    expect(s.persisted?.inequalities).toEqual([]);
  });
});

describe("inequality wire-boundary guards", () => {
  it("rejects a non-adjacent pair", () => {
    // size 5: |0-2| = 2 (not 1, not 5) → not orthogonally adjacent.
    go({ board: encV1(body(5, {}, "0-2")) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("rejects a duplicate pair", () => {
    go({ board: encV1(body(5, {}, "1-0,1-0")) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("rejects an out-of-range endpoint", () => {
    go({ board: encV1(body(5, {}, "0-99")) });
    expect(resolveInitialState().boardLink).toBe("invalid");
    // b === totalCells (25) is out of range (>=), even though numerically neat.
    go({ board: encV1(body(5, {}, "0-25")) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("rejects a malformed pair (missing / extra dash, non-integer)", () => {
    for (const ineq of ["0", "0-1-2", "a-b"]) {
      go({ board: encV1(body(5, {}, ineq)) });
      expect(resolveInitialState().boardLink).toBe("invalid");
    }
  });

  it("rejects a pair endpoint with trailing garbage (strict /^\\d+$/, SEC-4)", () => {
    // Pre-fix, `parseInt('1abc', 10)` silently dropped 'abc' → the pair `[0,1]` passed
    // adjacency and the crafted link decoded. The strict endpoint guard now fails it closed,
    // uniform with the size guard. `0-1` alone would be a VALID adjacent pair, so this
    // isolates the leniency (not the adjacency/range/dedup gates).
    for (const ineq of ["0-1abc", "1abc-0", "0- 1", "0-+1", "0-0x1"]) {
      go({ board: encV1(body(5, {}, ineq)) });
      expect(resolveInitialState().boardLink).toBe("invalid");
    }
    // Control: the canonical form of the same pair still decodes.
    go({ board: encV1(body(5, {}, "0-1")) });
    expect(resolveInitialState().boardLink).toBe("ok");
  });

  it("rejects a body that is not exactly 3 dot-parts", () => {
    // Two parts (no inequality section at all) — encodeBoard always emits the trailing dot.
    go({ board: encV1(`5.${cells(5)}`) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });
});

describe("shared fail-closed branches (owned copy)", () => {
  it("absent → absent, no board", () => {
    go({});
    expect(resolveInitialState().boardLink).toBe("absent");
  });

  it("oversize / bad base64 / unknown version", () => {
    go({ board: "A".repeat(4097) });
    expect(resolveInitialState().boardLink).toBe("invalid");
    go({ board: "@@@@" });
    expect(resolveInitialState().boardLink).toBe("invalid");
    go({ board: encVer(2, body(5, {}, "")) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("non-canonical / out-of-band size", () => {
    go({ board: encV1(body(5, {}, "").replace(/^5/, " 5")) });
    expect(resolveInitialState().boardLink).toBe("invalid");
    go({ board: encV1(`9.${cells(9)}.`) }); // 9 not in [4,5,6,7]
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("out-of-range cell value (> boardSize) and short cell count", () => {
    // size 5 → max cell value 5; 6 is over.
    go({ board: encV1(`5.${"6" + "0".repeat(24)}.`) });
    expect(resolveInitialState().boardLink).toBe("invalid");
    go({ board: encV1(`5.${"0".repeat(24)}.`) }); // 24 != 25
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("size mismatch: ?board_size= disagrees with the board", () => {
    go({ board_size: "6", board: encodeBoard(5, { 0: 1 }, 25, []) });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("invalid");
    expect(s.source).toBe("url-only");
    expect(s.boardSize).toBe(6);
  });
});

describe("bare size param + storage", () => {
  it("valid ?board_size resolves url-only", () => {
    go({ board_size: "7" });
    const s = resolveInitialState();
    expect(s.source).toBe("url-only");
    expect(s.boardSize).toBe(7);
    expect(s.boardLink).toBe("absent");
  });

  it("invalid ?board_size is ignored → fresh (default 5)", () => {
    go({ board_size: "3" });
    const s = resolveInitialState();
    expect(s.source).toBe("fresh");
    expect(s.boardSize).toBe(5);
  });

  it("storage-only when no URL", () => {
    const stored: PersistedBoard = {
      boardSize: 6,
      values: { 0: 3 },
      givenCells: ["0"],
      originalGivenCells: ["0"],
      overriddenCells: [],
      inequalities: [[1, 0]],
      solvedValues: {},
      boardGeneration: 1,
    };
    persistBoard(stored);
    const s = resolveInitialState();
    expect(s.source).toBe("storage-only");
    expect(s.boardSize).toBe(6);
  });
});

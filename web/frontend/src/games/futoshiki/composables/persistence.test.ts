import { describe, it, expect, beforeEach } from "vitest";
import { toBase64Url } from "@/lib/base64url";
import { persistence, type PersistedBoard } from "./useFutoshiki";

const { encodeBoard, resolveInitialState, persistBoard } = persistence;

// FE-unit layer (T4-W2, re-homed onto the ONE codec at T5-W2 2.4): the Futoshiki `?board=`
// permalink, driven through `resolveInitialState()` (the decoder is module-private). The
// Futoshiki-specific surface is the INEQUALITY furniture on the wire — adjacency, dedup,
// range, and the 3-part body split — the guards a crafted link would otherwise weaponize (one
// floating caret per pair → main-thread freeze).
//
// THE CLUE SECTION'S FORM CHANGED and it is the wave's one wire break (§1.4.1's row, the
// lead's ballot). The hand-rolled codec spelled a pair `greater-lesser` and joined pairs with
// `,`; the universal one serializes whatever `spec.clues.encode` produces — for futoshiki the
// flat `[greater, lesser, …]` buffer — one base-36 word per element, `,`-joined. So `1-0,5-0`
// is now `1,0,5,0`, and an old inequality-carrying link fails closed (never mis-decodes: a `-`
// is not a canonical base-36 word). Sudoku's wire is untouched — it has no clue section.
//
// Two guard CLASSES moved with it and are asserted below in their new form: a dangling word is
// caught by the codec's round-trip guard (decode → re-encode must equal the incoming buffer),
// and adjacency/dedup/range/pair-count by `inequalitiesWellFormed` via `validateClue`.

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

/** Forge a v1 futoshiki body: `${size}.${cells}.${clueWords}` — the clue section is the flat
 *  `[greater, lesser, …]` buffer, one base-36 word per element, `,`-joined. */
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
    expect(s.size).toBe(5);
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
    go({ board: encV1(body(5, {}, "0,2")) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("rejects a duplicate pair", () => {
    go({ board: encV1(body(5, {}, "1,0,1,0")) });
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("rejects an out-of-range endpoint", () => {
    go({ board: encV1(body(5, {}, "0,2r")) }); // 2r = 99 in base 36
    expect(resolveInitialState().boardLink).toBe("invalid");
    // b === totalCells (25) is out of range (>=), even though numerically neat.
    go({ board: encV1(body(5, {}, "0,p")) }); // p = 25 in base 36
    expect(resolveInitialState().boardLink).toBe("invalid");
  });

  it("rejects a dangling word — the codec's round-trip guard, not a length check", () => {
    // An odd word count decodes to a whole number of pairs with the tail SILENTLY DROPPED,
    // which is exactly what re-encoding catches: the buffer that comes back is shorter than
    // the one that went in, so the link is not what it claims to be.
    for (const ineq of ["0", "0,1,2", "1,0,5"]) {
      go({ board: encV1(body(5, {}, ineq)) });
      expect(resolveInitialState().boardLink).toBe("invalid");
    }
  });

  it("rejects a non-canonical clue word (strict /^[0-9a-z]+$/, SEC-4)", () => {
    // `parseInt` takes leading whitespace, a sign and `0x`, and drops trailing garbage — every
    // one of which would let a crafted word decode to something other than what it reads as.
    // `0,1` alone would be a VALID adjacent pair, so this isolates the leniency from the
    // adjacency/range/dedup gates.
    for (const ineq of ["0, 1", "0,+1", "0,-1", "0,", ",1", "0,1_"]) {
      go({ board: encV1(body(5, {}, ineq)) });
      expect(resolveInitialState().boardLink).toBe("invalid");
    }
    // Control: the canonical form of the same pair still decodes.
    go({ board: encV1(body(5, {}, "0,1")) });
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

  it("oversize / bad base64 / unknown version / untagged", () => {
    go({ board: "A".repeat(4097) });
    expect(resolveInitialState().boardLink).toBe("invalid");
    go({ board: "@@@@" });
    expect(resolveInitialState().boardLink).toBe("invalid");
    go({ board: encVer(2, body(5, {}, "")) });
    expect(resolveInitialState().boardLink).toBe("invalid");
    // The dead v0 ratchet (T5-W2 2.4d): an untagged body is a malformed link, not a legacy one.
    go({ board: toBase64Url(body(5, {}, "")) });
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
    expect(s.size).toBe(6);
  });
});

describe("difficulty persistence (?difficulty= + localStorage round-trip — the W6 residue, T4-WU/U2)", () => {
  it("a valid ?difficulty= resolves url-only and carries the tier (twin of sudoku's)", () => {
    go({ board_size: "6", difficulty: "HARD" });
    const s = resolveInitialState();
    expect(s.source).toBe("url-only");
    expect(s.size).toBe(6);
    expect(s.difficulty).toBe("HARD");
  });

  it("difficulty is case-insensitive on the wire (a lower-cased param upper-cases)", () => {
    go({ board_size: "5", difficulty: "medium" });
    expect(resolveInitialState().difficulty).toBe("MEDIUM");
  });

  it("a bare ?difficulty= (no board_size) still arms url-only at the default size", () => {
    go({ difficulty: "HARD" });
    const s = resolveInitialState();
    expect(s.source).toBe("url-only");
    expect(s.size).toBe(5);
    expect(s.difficulty).toBe("HARD");
  });

  it("an absent or invalid ?difficulty= falls to EASY (never a fabricated tier)", () => {
    go({ board_size: "5" });
    expect(resolveInitialState().difficulty).toBe("EASY");
    go({ board_size: "5", difficulty: "IMPOSSIBLE" });
    expect(resolveInitialState().difficulty).toBe("EASY");
  });

  it("difficulty round-trips through localStorage (storage-only restores the tier)", () => {
    const stored: PersistedBoard = {
      boardSize: 7,
      difficulty: "MEDIUM",
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
    expect(s.difficulty).toBe("MEDIUM");
  });

  it("a shared ?board= adopts the URL difficulty (url-board carries the tier)", () => {
    go({ difficulty: "HARD", board: encodeBoard(5, { 0: 1 }, 25, [[1, 0]]) });
    const s = resolveInitialState();
    expect(s.source).toBe("url-board");
    expect(s.persisted?.difficulty).toBe("HARD");
  });

  it("url difficulty wins over a disagreeing stored tier (URL-wins, twin of sudoku's)", () => {
    const stored: PersistedBoard = {
      boardSize: 6,
      difficulty: "EASY",
      values: { 0: 3 },
      givenCells: ["0"],
      originalGivenCells: ["0"],
      overriddenCells: [],
      inequalities: [[1, 0]],
      solvedValues: {},
      boardGeneration: 1,
    };
    persistBoard(stored);
    go({ board_size: "6", difficulty: "HARD" });
    const s = resolveInitialState();
    expect(s.source).toBe("url-only");
    expect(s.difficulty).toBe("HARD");
  });
});

// The Sudoku port's twin (see its `persistence.test.ts`): a refused link is deleted from the
// bar, never left standing. Futoshiki's `dropBoardParam` is scoped to the active game, so these
// rows carry the `?game=futoshiki` a real deep link always carries.
describe("a rejected link leaves the address bar", () => {
  const boardInBar = () => new URLSearchParams(window.location.search).has("board");

  it("strips ?board= on the fail-closed arms", () => {
    for (const bad of [
      toBase64Url(body(5, {}, "")), // untagged — the dead v0 ratchet
      "@@@@", // undecodable base64
      encVer(2, body(5, {}, "")), // unknown version
      encV1(`5.${cells(5)}`), // 2-part body: no inequality field
      encV1(body(5, {}, "0,2")), // non-adjacent pair
    ]) {
      go({ game: "futoshiki", board: bad });
      expect(resolveInitialState().boardLink).toBe("invalid");
      expect(boardInBar()).toBe(false);
    }
  });

  it("keeps the rest of the query — only ?board= is deleted", () => {
    go({ game: "futoshiki", board_size: "7", board: "@@@@" });
    expect(resolveInitialState().boardLink).toBe("invalid");
    expect(boardInBar()).toBe(false);
    const params = new URLSearchParams(window.location.search);
    expect(params.get("game")).toBe("futoshiki");
    expect(params.get("board_size")).toBe("7");
  });

  it("an ACCEPTED link stays in the bar", () => {
    go({ game: "futoshiki", board: encodeBoard(5, { 0: 1 }, 25, [[1, 0]]) });
    expect(resolveInitialState().boardLink).toBe("ok");
    expect(boardInBar()).toBe(true);
  });
});

describe("bare size param + storage", () => {
  it("valid ?board_size resolves url-only", () => {
    go({ board_size: "7" });
    const s = resolveInitialState();
    expect(s.source).toBe("url-only");
    expect(s.size).toBe(7);
    expect(s.boardLink).toBe("absent");
  });

  it("invalid ?board_size is ignored → fresh (default 5)", () => {
    go({ board_size: "3" });
    const s = resolveInitialState();
    expect(s.source).toBe("fresh");
    expect(s.size).toBe(5);
  });

  it("storage-only when no URL", () => {
    const stored: PersistedBoard = {
      boardSize: 6,
      difficulty: "EASY",
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
    expect(s.size).toBe(6);
  });
});

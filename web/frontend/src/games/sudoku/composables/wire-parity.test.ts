import { describe, it, expect, beforeEach } from "vitest";
import { fromBase64Url } from "@/lib/base64url";
import { persistence } from "./useSudoku";
import { encodeSudoku, encodeUntagged } from "../../../../e2e/wire";

// THE PERMALINK CODEC'S CROSS-CHECK (T7-W6, the dual-path row). The wire has two writers:
// `persistence.ts::encodeBoard`, which the app ships, and `e2e/wire.ts::encodeSudoku`, which
// every spec that pins a board imports. Two grammars, seven spellings of the version byte, and
// until now zero assertion that they agree — the drift is not hypothetical, it's `wire.ts`'s own
// birth certificate: four hand-rolled copies, two of them silently untagged, one of which sent
// affordances.spec.ts chasing a permalink/auto-deal race that was really the W2 strip doing its
// job on a link the spec had malformed. A forked encoder doesn't red the spec that owns it; it
// makes that spec measure a random board while believing it pinned one. So the seam gets a row.
//
// This lives at the UNIT layer deliberately: the e2e lane can't witness the divergence (a spec
// riding a bad frame just measures the wrong board, greenly), and it costs one import — e2e
// already reaches into `../src/`, so the traversal is only new in direction.

const { encodeBoard, resolveInitialState } = persistence;

/**
 * The two signatures disagree on the cell map's key type — `Record<number, number>` on the wire
 * copy, `Record<string, number>` on the codec — while both read the same numeric indices at
 * runtime. One named conversion rather than a cast, so the seam stays visible.
 */
const byString = (cells: Record<number, number>): Record<string, number> =>
  Object.fromEntries(Object.entries(cells));

/** One row per feature of the body the two writers have to spell identically. */
const BOARDS: {
  name: string;
  size: number;
  total: number;
  cells: Record<number, number>;
}[] = [
  { name: "4×4 empty — the all-zero body", size: 2, total: 16, cells: {} },
  {
    name: "9×9 sparse — first, middle and last cell set",
    size: 3,
    total: 81,
    cells: { 0: 5, 40: 9, 80: 1 },
  },
  {
    name: "9×9 dense — every cell carries a digit",
    size: 3,
    total: 81,
    cells: Object.fromEntries(Array.from({ length: 81 }, (_, i) => [i, (i % 9) + 1])),
  },
  {
    // 16×16 is where base-36 stops being decimal: 10..16 spell 'a'..'g', and a writer that
    // reached for `String(v)` instead of `v.toString(36)` passes every 9×9 row above.
    name: "16×16 — values past 9, where base-36 stops being decimal",
    size: 4,
    total: 256,
    cells: { 0: 10, 7: 13, 255: 16 },
  },
];

function go(params: Record<string, string>): void {
  const qs = new URLSearchParams(params).toString();
  window.history.replaceState(null, "", qs ? `/?${qs}` : "/");
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("permalink codec parity — persistence.encodeBoard vs e2e/wire.encodeSudoku", () => {
  for (const b of BOARDS) {
    it(`agrees byte for byte: ${b.name}`, () => {
      expect(encodeSudoku(b.size, b.cells, b.total)).toBe(
        encodeBoard(b.size, byString(b.cells), b.total),
      );
    });
  }

  // Parity alone would hold if BOTH writers drifted together, so the pair is anchored to the
  // decoder that has the final say: the spec-side frame must open with the mandatory version
  // byte AND boot the app's own resolver to a live board.
  it("anchors to the live decoder: the spec-side frame is tagged v1 and boots url-board", () => {
    const board = encodeSudoku(3, { 0: 7, 80: 4 }, 81);
    expect(fromBase64Url(board).charCodeAt(0)).toBe(1);
    go({ board });
    const s = resolveInitialState();
    expect(s.boardLink).toBe("ok");
    expect(s.source).toBe("url-board");
    expect(s.persisted?.values[0]).toBe(7);
    expect(s.persisted?.values[80]).toBe(4);
  });

  // The rows above can fail: `encodeUntagged` is the pre-T4-W3 body the forks actually wrote,
  // and it's the shape parity has to be able to reject.
  it("the comparison bites: the untagged refusal fixture is NOT the codec's output", () => {
    expect(encodeUntagged(3, { 0: 7 }, 81)).not.toBe(
      encodeBoard(3, byString({ 0: 7 }), 81),
    );
  });
});

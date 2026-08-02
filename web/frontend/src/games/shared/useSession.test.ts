import { describe, it, expect } from "vitest";
import { wins } from "./useSession";
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

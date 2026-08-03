import { describe, expect, it } from "vitest";
import { admit, mintOp, type Ledger, type Op } from "./useSession";
import { useUndoHistory } from "./useUndoHistory";

/**
 * THE LARGE RUN (T6.1) — the condition the trie veto was declined on.
 *
 * The estate declined a bespoke persistent trie and shipped the op ledger instead
 * (`useUndoHistory.ts:25-30`, README ruling 2). The price of that ruling is this file: the
 * ledger has to be shown PERFORMANT, ROBUST and able to carry a large run, not merely
 * plausible on the two-page e2e where every op arrives in order and exactly once.
 *
 * So the run here is deliberately worse than a room can be:
 *   · 20,000 ops from 16 authors, minted with COLLIDING lamports (a third of the authors
 *     refuse to merge the room's clock, which is what a lagging tab does), so the author
 *     tie-break decides thousands of cells rather than appearing once.
 *   · Every replica takes the whole stream in its OWN shuffled order — five replicas, five
 *     orders, and one reference in mint order.
 *   · Delivery is unreliable in both directions: one op in eight is delivered TWICE, and
 *     4,000 ops from two dead epochs (one older, one from a board this page hasn't got) ride
 *     the same stream.
 *   · The board is 81 cells and the flood is 20,000 writes, so every cell is contended ~250
 *     times and the clock is asked to stay the size of the board rather than the size of the
 *     history.
 *
 * The functions under test are the SHIPPED ones — `admit` and `mintOp` are what
 * `onMessage`/`noteWrite` call, and `useUndoHistory` is the composable the board mounts. A
 * stress row that re-implemented the rule would prove only that the re-implementation
 * converges.
 *
 * Numbers are printed, not asserted, except as FLOORS: a benchmark in a unit lane measures the
 * runner it happened to land on. The claim is "this is not slow in the way that would matter",
 * and 20,000 ops inside a second is the honest shape of it.
 */

const AUTHORS = 16;
const CELLS = 81;
const OPS = 20_000;
const UNDO_CAP = 200;

/** The room's board, opened by author 00 — one epoch for the whole run. */
const EPOCH: [number, string] = [1, "a00"];
/** Two boards this page is NOT holding: one older, one newer. Ops stamped with either must
 *  never touch a cell. */
const STALE_EPOCH: [number, string] = [1, "a00-ghost"]; // same lamport, LOWER author ⇒ older
const AHEAD_EPOCH: [number, string] = [9_999, "azz"];

const author = (i: number) => `a${String(i).padStart(2, "0")}`;

/** Deterministic PRNG — a stress row that cannot be re-run on the same numbers is an anecdote. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff) / 0x7fffffff;
}

const shuffled = <T>(xs: T[], seed: number): T[] => {
  const out = [...xs];
  const rand = rng(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/**
 * Sixteen authors minting into their own ledgers. Two thirds of them merge the room's clock
 * before writing (a page that has been hearing traffic); the rest do not (a page that has
 * not), which is what mints the lamport ties the author order exists to break.
 */
function mintStream(): { ops: Op[]; ties: number } {
  const leds: Ledger[] = Array.from({ length: AUTHORS }, () => ({
    lamport: 0,
    epoch: EPOCH,
    clock: {},
  }));
  const rand = rng(20_260_801);
  const ops: Op[] = [];
  let high = 0;
  const stamps = new Map<string, number>();
  let ties = 0;

  for (let i = 0; i < OPS; i++) {
    const a = i % AUTHORS;
    if (a % 3 !== 0) leds[a].lamport = Math.max(leds[a].lamport, high);
    const pos = Math.floor(rand() * CELLS);
    const op = mintOp(leds[a], author(a), pos, 1 + Math.floor(rand() * 9), false);
    high = Math.max(high, op.stamp[0]);
    const key = `${op.pos}:${op.stamp[0]}`;
    if (stamps.has(key)) ties++;
    stamps.set(key, (stamps.get(key) ?? 0) + 1);
    ops.push(op);
  }
  return { ops, ties };
}

/** One page's whole state: the ledger the wire writes into, and the board it inks. */
function replica() {
  const values: Record<string, number> = {};
  const led: Ledger = { lamport: 0, epoch: EPOCH, clock: {} };
  return {
    values,
    led,
    /** exactly what `onMessage`'s op branch does, minus the wire. */
    deliver(op: Op): void {
      if (admit(led, op) !== "applied") return;
      values[String(op.pos)] = op.value;
    },
  };
}

/** A board + clock as ONE string, which is what "byte-identical" has to mean to be checkable. */
const fingerprint = (r: ReturnType<typeof replica>): string =>
  JSON.stringify([
    Object.keys(r.values)
      .sort()
      .map((k) => [k, r.values[k]]),
    Object.keys(r.led.clock)
      .sort()
      .map((k) => [k, r.led.clock[k]]),
  ]);

describe("the op ledger under a large run — 20,000 ops, 16 authors", () => {
  const { ops, ties } = mintStream();
  /** The adversarial stream: the flood, plus duplicates, plus two dead epochs. */
  const hostile: Op[] = [
    ...ops,
    ...ops.filter((_, i) => i % 8 === 0), // one in eight, delivered twice
    ...ops.slice(0, 2_000).map((o) => ({ ...o, epoch: STALE_EPOCH, value: 9 }) as Op),
    ...ops
      .slice(2_000, 4_000)
      .map((o) => ({ ...o, epoch: AHEAD_EPOCH, value: 9 }) as Op),
  ];

  it("every replica converges byte-identical, whatever order the flood arrives in", () => {
    const reference = replica();
    const t0 = performance.now();
    for (const op of hostile) reference.deliver(op);
    for (const seed of [1, 7, 42, 1009, 65_537]) {
      const other = replica();
      for (const op of shuffled(hostile, seed)) other.deliver(op);
      expect(fingerprint(other), `delivery order ${seed}`).toBe(fingerprint(reference));
    }
    const ms = performance.now() - t0;
    const applied = hostile.length * 6;

    // The clock is the BOARD's size, not the history's — the whole reason a per-cell LWW
    // needs no compaction pass and no trie. 20,000 writes leave 81 entries.
    expect(Object.keys(reference.led.clock).length).toBeLessThanOrEqual(CELLS);
    expect(Object.keys(reference.values).length).toBeLessThanOrEqual(CELLS);
    // Lamport ties actually happened ON THE SAME CELL — which is the only place a tie decides
    // anything — so the author order was exercised rather than merely available.
    expect(ties).toBeGreaterThan(100);
    // A FLOOR, not a benchmark: 20,000 ops in a second is ~50× a room of sixteen at speed.
    expect(applied / (ms / 1000)).toBeGreaterThan(20_000);

    console.log(
      `[T6.1 large run] ${hostile.length} ops × 6 replicas = ${applied} admits in ` +
        `${ms.toFixed(0)} ms → ${((applied / ms) * 1000).toFixed(0)} ops/sec · ` +
        `clock ${Object.keys(reference.led.clock).length}/${CELLS} entries · ` +
        `lamport ties ${ties} · board ${Object.keys(reference.values).length} cells`,
    );
  });

  it("a dead epoch never touches a cell, however many of them arrive", () => {
    const r = replica();
    for (const op of ops) r.deliver(op);
    const settled = fingerprint(r);
    for (const op of hostile.filter((o) => o.epoch !== EPOCH)) r.deliver(op);
    // 4,000 ops from two other boards, every one of them writing the digit 9, and nothing
    // moved: the epoch decides whether a write is even about this board.
    expect(fingerprint(r)).toBe(settled);
    expect(Object.values(r.values).filter((v) => v === 9).length).toBeLessThan(CELLS);
  });

  it("the lamport merge survives EVERY rejection, including another board's", () => {
    // The one ordering inside `admit` that can be silently wrong: merge FIRST, then judge. A
    // page that skipped the merge on an op it rejects mints its next stamp behind the room and
    // loses a cell it should have won — and the rejection that reaches furthest ahead is the
    // one from a board this page hasn't got yet, which is precisely the op it is about to
    // adopt the board of.
    const r = replica();
    r.deliver({ pos: 0, value: 5, solved: false, stamp: [500, "zzz"], epoch: EPOCH });
    r.deliver({ pos: 0, value: 6, solved: false, stamp: [400, "aaa"], epoch: EPOCH }); // loses
    expect(r.led.lamport).toBe(500);
    // …and one from the board it hasn't got, stamped far ahead.
    r.deliver({
      pos: 0,
      value: 9,
      solved: false,
      stamp: [9_000, "aaa"],
      epoch: AHEAD_EPOCH,
    });
    expect(r.led.lamport).toBe(9_000);
    expect(r.values["0"]).toBe(5); // the foreign board wrote nothing

    // My next write outranks the room rather than trailing it.
    const mine = mintOp(r.led, "me", 0, 7, false);
    expect(mine.stamp[0]).toBe(9_001);
    expect(r.led.clock["0"]).toEqual(mine.stamp);
  });
});

describe("the ledger's undo spine under the same flood", () => {
  /** A page that is WRITING through the flood: its local ops go on the undo stack, the room's
   *  ops come back through `admit`, and the two share one board. */
  function player(id: string) {
    const values: Record<string, number> = {};
    const led: Ledger = { lamport: 0, epoch: EPOCH, clock: {} };
    const sent: Op[] = [];
    const history = useUndoHistory<unknown, unknown>({
      applyValue: (pos, value) => {
        values[String(pos)] = value;
      },
      applyHintInk: (pos, value) => {
        values[String(pos)] = value;
      },
      removeHintInk: (pos, prev) => {
        values[String(pos)] = prev;
      },
      applyMark: () => {},
      restoreBoard: () => {},
      pending: () => false,
      readValue: (pos) => values[String(pos)] ?? 0,
      // The single choke, exactly as `useGameState` wires it.
      onEntry: (e) => {
        if (e.kind === "value") sent.push(mintOp(led, id, e.pos, e.next, false));
      },
    });
    return {
      values,
      led,
      sent,
      history,
      /** True when the write was a real change — `recordEdit` no-ops on `prev === next` (the
       *  immunity primitive), so a re-typed digit is not an op and must not be counted as one. */
      write(pos: number, value: number): boolean {
        const prev = values[String(pos)] ?? 0;
        values[String(pos)] = value;
        history.recordEdit(pos, prev, value);
        return prev !== value;
      },
      hear(op: Op) {
        if (admit(led, op) !== "applied") return;
        values[String(op.pos)] = op.value;
      },
    };
  }

  // 945 ms on the reference box, 7.3 s on the shared CI runner — the braid's wall
  // clock is hardware's, the invariants are ours. The budget is a ceiling for a
  // hung loop, never a performance gate.
  it(
    "the cap holds at 200 through 20,000 of my own writes braided with the room's",
    { timeout: 30_000 },
    () => {
      const me = player("me");
      const room = mintStream().ops;
      const rand = rng(97);
      const t0 = performance.now();
      let mine = 0;
      for (let i = 0; i < OPS; i++) {
        // Braided, not batched: my write, then a handful of the room's, then mine again.
        if (
          rand() < 0.5 &&
          me.write(Math.floor(rand() * CELLS), 1 + Math.floor(rand() * 9))
        )
          mine++;
        me.hear(room[i]);
      }
      const ms = performance.now() - t0;

      expect(me.history._historyLength()).toBe(UNDO_CAP);
      expect(me.history.undoDepth.value).toBe(UNDO_CAP);
      // Nothing pooled: value entries are self-contained deltas, so a flood of them cannot
      // leak board blobs into the pool (the one place a long session could grow memory).
      expect(me.history._poolSize()).toBe(0);
      // The clock stays the board, not the traffic — mine and theirs share the same 81 keys.
      expect(Object.keys(me.led.clock).length).toBeLessThanOrEqual(CELLS);
      expect(me.sent.length).toBe(mine);

      console.log(
        `[T6.1 undo spine] ${mine} local writes + ${OPS} remote ops in ${ms.toFixed(0)} ms → ` +
          `${(((mine + OPS) / ms) * 1000).toFixed(0)} ops/sec · stack ${me.history._historyLength()}/` +
          `${UNDO_CAP} · pool ${me.history._poolSize()} · clock ` +
          `${Object.keys(me.led.clock).length}/${CELLS}`,
      );
    },
  );

  it("the no-clobber guard still holds mid-flood — my undo is spent, their digit stands", () => {
    const me = player("me");
    const room = mintStream().ops;
    for (let i = 0; i < 2_000; i++) me.hear(room[i]);

    // I write cell 40. Then a peer takes it with a strictly newer stamp, mid-flood.
    me.write(40, 3);
    expect(me.values["40"]).toBe(3);
    me.hear({
      pos: 40,
      value: 8,
      solved: false,
      stamp: [me.led.lamport + 1, "zzz-peer"],
      epoch: EPOCH,
    });
    expect(me.values["40"]).toBe(8);

    for (let i = 2_000; i < 6_000; i++) if (room[i].pos !== 40) me.hear(room[i]);

    // BORN RED (T6 mark 13, re-run here under load): without the guard this undo restores my
    // `prev` over the peer's 8 and the LWW clock then propagates the erasure as authoritative.
    const depth = me.history.undoDepth.value;
    me.history.undo();
    expect(me.values["40"]).toBe(8); // theirs stands
    expect(me.history.undoDepth.value).toBe(depth - 1); // mine is spent
  });
});

/**
 * THE THERMO BANK'S OWN GATE (T9-W4 §4.1).
 *
 * A checked-in bank has a failure mode a generated one does not: it can be WRONG and stay wrong,
 * silently, until a reader deals the tier it lives on. The wasm re-validates each record through
 * `decode_thermometers` before dealing it, so a corrupt row surfaces as a typed
 * `INVALID_INPUT` — at the deal, on the reader's screen, which is the wrong place to learn it.
 * This file holds the bank to the same contract one layer earlier, where a corrupt row is a red
 * test instead of a broken board.
 *
 * The record grammar is `bank_pick`'s (`csp-solver/wasm/src/errors.rs`):
 *
 *   [ clueLen, board[0..256], tubes[0..clueLen] ]
 *
 * and the tube buffer is `thermoClue`'s own length-prefixed form — asserted THROUGH that codec
 * rather than re-parsed here, because the bank and the game must agree about what a tube is, and
 * a second parser in a test is exactly how two grammars start drifting.
 */
import { describe, it, expect } from "vitest";
import { THERMO_BANK, thermoTierSource, type ThermoTierKey } from "./templates";
import { thermoClue } from "../clue";

const SIZES = [2, 3, 4];
const TIERS: ThermoTierKey[] = ["easy", "medium", "hard"];
/** A 16×16 board: `(n²)²` cells, the same arithmetic `useThermo`'s `boardSizeOf` does. */
const cellsOf = (n: number) => (n * n) ** 2;

describe("the thermo template bank — the declared source is the true one", () => {
  it("every tier declared `bank` holds records, and every tier declared `livegen` holds none", () => {
    for (const n of SIZES) {
      for (const tier of TIERS) {
        const rows = THERMO_BANK[n][tier];
        const declared = thermoTierSource(n, tier);
        // Both directions. A bank that emptied and a table that went stale are the same defect
        // facing opposite ways, and only one of them is loud without this row.
        if (declared === "bank") expect(rows.length).toBeGreaterThan(0);
        else expect(rows).toHaveLength(0);
      }
    }
  });

  it("an undeclared size is a caller bug, never a silent live-gen", () => {
    expect(() => thermoTierSource(9, "hard")).toThrow(/no tier is declared/);
  });

  it("16×16 MEDIUM and HARD are the banked tiers, and they carry the wave's count", () => {
    expect(thermoTierSource(4, "medium")).toBe("bank");
    expect(thermoTierSource(4, "hard")).toBe("bank");
    expect(THERMO_BANK[4].medium.length + THERMO_BANK[4].hard.length).toBe(32);
  });
});

describe("the thermo template bank — every record is what the wasm will read", () => {
  const banked = SIZES.flatMap((n) =>
    TIERS.flatMap((tier) =>
      THERMO_BANK[n][tier].map((record, i) => ({ n, tier, i, record })),
    ),
  );

  it("holds records at all (an empty census would green every row below)", () => {
    expect(banked.length).toBe(32);
  });

  for (const { n, tier, i, record } of banked) {
    it(`${n}/${tier} #${i}: the record spans exactly its prefix + board + tubes`, () => {
      const total = cellsOf(n);
      const clueLen = record[0];
      // `bank_pick` walks records by this arithmetic alone. A record that is one cell long or
      // short does not fail here — it silently re-frames every record AFTER it.
      expect(record.length).toBe(1 + total + clueLen);

      const board = record.slice(1, 1 + total);
      const side = n * n;
      for (const v of board) {
        expect(Number.isInteger(v)).toBe(true);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(side);
      }
      // A dealt puzzle is neither blank nor finished.
      const givens = board.filter(Boolean).length;
      expect(givens).toBeGreaterThan(0);
      expect(givens).toBeLessThan(total);
    });

    it(`${n}/${tier} #${i}: the tubes decode through the game's own codec`, () => {
      const total = cellsOf(n);
      const clueLen = record[0];
      const tubes = thermoClue.decode(
        Uint32Array.from(record.slice(1 + total, 1 + total + clueLen)),
        n,
      );
      expect(tubes.length).toBeGreaterThan(0);
      for (const path of tubes) {
        // A thermometer is a CHAIN: a one-cell tube states no ordering and is furniture that
        // means nothing, which is a defect the solver would never catch.
        expect(path.length).toBeGreaterThanOrEqual(2);
        expect(path.length).toBeLessThanOrEqual(total);
        for (const cell of path) {
          expect(cell).toBeGreaterThanOrEqual(0);
          expect(cell).toBeLessThan(total);
        }
        // No tube visits a cell twice — a path that doubles back cannot strictly increase.
        expect(new Set(path).size).toBe(path.length);
      }
      // Re-encoding must reproduce the banked bytes: the codec and the bank are one grammar.
      expect(Array.from(thermoClue.encode(tubes))).toEqual(
        record.slice(1 + total, 1 + total + clueLen),
      );
    });
  }

  it("the concatenated buffer walks as N records, exactly as `bank_pick` walks it", () => {
    for (const tier of ["medium", "hard"] as const) {
      const records = THERMO_BANK[4][tier];
      const flat = Uint32Array.from(records.flat());
      const total = cellsOf(4);
      let at = 0;
      let count = 0;
      while (at < flat.length) {
        at += 1 + total + flat[at];
        expect(at).toBeLessThanOrEqual(flat.length);
        count++;
      }
      // The walk must land EXACTLY on the end. One cell over and the wasm reads a truncated
      // record; one cell under and it reads a record nobody wrote.
      expect(at).toBe(flat.length);
      expect(count).toBe(records.length);
    }
  });
});

import { describe, it, expect } from "vitest";
import {
  gradeBoard,
  fillAllForced,
  findHint,
  popcount,
  findStep,
} from "@games/shared/techniqueEngine";
import {
  createBoardAdapter,
  boardHouses,
  inequalityConstraints,
} from "@games/shared/techniqueAdapter";
import type { Inequality } from "./types";

// The futoshiki ladder (T4-W7, lane E2) end-to-end, over the SELF-COMPUTED basic all-different
// substrate — the SAME engine the boxed adapter drives, plus the two inequality rungs. Fixtures
// were synthesized offline by randomized search against this very engine: each is a 5×5 puzzle
// carved from ONE Latin square whose forced-single/forced-elimination solve is deterministic — so
// the solution is unique (forced logic never branches) and equals `SOL5`. Each REQUIRES its target
// technique: the ladder is cheapest-first, so `hardestTechnique` is the cheapest rung that had no
// cheaper alternative at some step.

// The 5×5 cyclic Latin square every fixture is carved from (each row/col a permutation of 1..5).
const SOL5 = [
  1, 2, 3, 4, 5, 2, 3, 4, 5, 1, 3, 4, 5, 1, 2, 4, 5, 1, 2, 3, 5, 1, 2, 3, 4,
];

// A 5×5 solvable by naked/hidden singles alone — no inequalities needed (honest grade: tier 1).
const SINGLES_BOARD = [
  0, 2, 0, 0, 0, 0, 3, 4, 5, 1, 0, 4, 0, 1, 2, 4, 5, 0, 0, 0, 0, 1, 0, 3, 4,
];

// A 5×5 whose solve REQUIRES the endpoint rule (honest grade: tier 2, inequality-forcing). Two
// isolated `>` edges (no run of three), so the chain rung never applies.
const FORCING_BOARD = [
  0, 0, 0, 4, 5, 0, 0, 4, 0, 1, 0, 4, 0, 0, 0, 0, 5, 0, 2, 0, 0, 0, 0, 3, 0,
];
const FORCING_INEQ: Inequality[] = [
  [1, 0], // cell1 > cell0  (row0)
  [11, 10], // cell11 > cell10 (row2)
];

// A 5×5 whose solve REQUIRES a positional chain bound (honest grade: tier 3, inequality-chain).
// A run a<b<c<d across row0's first four cells: the b<c<d tail forces b ≤ 3, a cut no single/
// subset/endpoint rung can make, so the chain rung is load-bearing (proven below).
const CHAIN_BOARD = [
  0, 0, 3, 0, 0, 0, 3, 4, 0, 0, 3, 0, 5, 0, 0, 0, 5, 0, 2, 0, 0, 1, 2, 0, 0,
];
const CHAIN_INEQ: Inequality[] = [
  [1, 0], // a < b
  [2, 1], // b < c
  [3, 2], // c < d
];

// Replay the ladder with one technique BANNED — stop at the first step that needs it. Returns
// true iff the board is left unsolved, i.e. that technique is load-bearing (the twin of E1's
// `!solvesWithoutXWing`). Cheapest-first guarantees the prefix is identical to a rung-less solver.
function stallsWithout(
  values: number[],
  boardSize: number,
  ineq: Inequality[],
  banned: string,
): boolean {
  const adapter = createBoardAdapter("latin", boardSize, ineq);
  const board = values.slice();
  let cands = adapter.computeCandidates(board);
  for (let i = 0; i < 999; i++) {
    const step = findStep({
      n: adapter.n,
      candidates: cands,
      houses: adapter.houses,
      constraints: adapter.constraints,
    });
    if (!step || step.technique === banned) break;
    if (step.targetCell !== null && step.targetValue !== null) {
      board[step.targetCell] = step.targetValue;
      cands = adapter.computeCandidates(board);
    } else {
      for (const e of step.eliminations)
        for (const v of e.values) cands[e.cell] &= ~(1 << v);
    }
  }
  return board.some((v) => v === 0);
}

describe("the futoshiki ladder grades by hardest-technique-required", () => {
  it("a singles-only board grades tier 1 and solves to the unique Latin square", () => {
    const grade = gradeBoard(createBoardAdapter("latin", 5, []), SINGLES_BOARD);
    expect(grade.solved).toBe(true);
    expect(grade.values).toEqual(SOL5);
    expect(grade.tier).toBe(1);
    expect(
      grade.hardestTechnique === "naked-single" ||
        grade.hardestTechnique === "hidden-single",
    ).toBe(true);
  });

  it("an endpoint-rule board grades tier 2 with inequality-forcing as the hardest technique", () => {
    const grade = gradeBoard(
      createBoardAdapter("latin", 5, FORCING_INEQ),
      FORCING_BOARD,
    );
    expect(grade.solved).toBe(true);
    expect(grade.values).toEqual(SOL5);
    expect(grade.tier).toBe(2);
    expect(grade.hardestTechnique).toBe("inequality-forcing");
    // Load-bearing: without the endpoint rule the ladder stalls (singles alone can't finish it).
    expect(stallsWithout(FORCING_BOARD, 5, FORCING_INEQ, "inequality-forcing")).toBe(
      true,
    );
  });

  it("a chain board grades tier 3 with inequality-chain as the hardest technique", () => {
    const grade = gradeBoard(createBoardAdapter("latin", 5, CHAIN_INEQ), CHAIN_BOARD);
    expect(grade.solved).toBe(true);
    expect(grade.values).toEqual(SOL5);
    expect(grade.tier).toBe(3);
    expect(grade.hardestTechnique).toBe("inequality-chain");
    // Load-bearing: with the chain rung banned the ladder stalls — the positional bound is the
    // only rung that makes that cut, exactly as E1's X-wing board needs the fish rung.
    expect(stallsWithout(CHAIN_BOARD, 5, CHAIN_INEQ, "inequality-chain")).toBe(true);
  });

  it("accepts the composable's row-major record shape too", () => {
    const record: Record<string, number> = {};
    CHAIN_BOARD.forEach((v, i) => (record[String(i)] = v));
    expect(gradeBoard(createBoardAdapter("latin", 5, CHAIN_INEQ), record).tier).toBe(3);
  });
});

describe("the corrupted-substrate tripwire (r3 KILL-LIST #3, futoshiki twin) — permanent", () => {
  // The load-bearing invariant, futoshiki flavour: the engine grades over SELF-COMPUTED basic
  // all-different candidates (1..N minus filled row/col peers), NEVER over `propagateFutoshiki`'s
  // masks. Those are the root AC-3 fixpoint over BOTH the all-different AND the inequality
  // constraints (`csp-solver/wasm/src/futoshiki.rs:318-320`: "pins them to singleton masks") —
  // strictly stronger, and over-pruned for grading exactly like sudoku's GAC masks: a board a
  // human solves by the chain rule arrives with that reduction already applied and reads as all
  // naked singles. This board grades tier-3 honestly; reading the AC-pruned substrate collapses
  // it to tier-1. The two substrates MUST differ, and this fails the instant a rung reads the AC
  // masks or the adapter folds inequality bounds into `computeCandidates`.
  const adapter = createBoardAdapter("latin", 5, CHAIN_INEQ);
  const selfComputed = adapter.computeCandidates(CHAIN_BOARD);

  // Model `propagateFutoshiki`'s AC-3 collapse: a uniquely-solvable board's fixpoint pins every
  // empty cell to its solution singleton; filled cells → 0. (Same model E1 used for GAC.)
  const acCollapsed = new Uint32Array(25);
  for (let c = 0; c < 25; c++) acCollapsed[c] = CHAIN_BOARD[c] !== 0 ? 0 : 1 << SOL5[c];

  it("self-computed candidates are NOT equal to the AC-pruned masks", () => {
    expect(selfComputed).not.toEqual(acCollapsed);
  });

  it("AC over-prunes past the human sequence: cells self-computed ambiguous, AC as singletons", () => {
    let overpruned = 0;
    let allAcSingleton = true;
    for (let c = 0; c < 25; c++) {
      if (CHAIN_BOARD[c] !== 0) continue; // only the empty cells the human still reasons over
      if (popcount(acCollapsed[c]) !== 1) allAcSingleton = false;
      if (popcount(selfComputed[c]) >= 2 && popcount(acCollapsed[c]) === 1)
        overpruned++;
    }
    expect(allAcSingleton).toBe(true); // AC left every empty cell a singleton
    expect(overpruned).toBeGreaterThan(0); // basic all-different elimination did not — diverges
  });

  it("the substrate choice is load-bearing: self-computed grades tier-3, AC-collapsed collapses to tier-1", () => {
    expect(
      gradeBoard(createBoardAdapter("latin", 5, CHAIN_INEQ), CHAIN_BOARD).tier,
    ).toBe(3);
    // Had the engine read the AC masks, the cheapest step on the untouched board is already a
    // naked single (every empty cell a singleton), so the grade would collapse to tier-1.
    const acStep = findStep({
      n: adapter.n,
      candidates: acCollapsed,
      houses: adapter.houses,
      constraints: adapter.constraints,
    });
    expect(acStep!.technique).toBe("naked-single");
    expect(acStep!.tier).toBe(1);
  });
});

describe("fill-all-forced (W7 owns the detector; W8 wires the button) — futoshiki", () => {
  it("fills exactly the current naked+hidden singles in one sweep, correct and on empty cells", () => {
    const { placements } = fillAllForced(
      createBoardAdapter("latin", 5, []),
      SINGLES_BOARD,
    );
    expect(placements.length).toBeGreaterThan(0);
    expect(placements.every((p) => SINGLES_BOARD[p.cell] === 0)).toBe(true); // never a given
    expect(placements.every((p) => p.value === SOL5[p.cell])).toBe(true); // never wrong
    expect(
      placements.every(
        (p) => p.technique === "naked-single" || p.technique === "hidden-single",
      ),
    ).toBe(true);
    expect(new Set(placements.map((p) => p.cell))).toEqual(
      forcedCellSet(SINGLES_BOARD, []),
    );
  });

  it("one sweep, no cascade: it stops with cells still empty, and a second sweep makes more progress", () => {
    const first = fillAllForced(createBoardAdapter("latin", 5, []), SINGLES_BOARD);
    expect(first.values.some((v) => v === 0)).toBe(true); // did NOT solve the whole board
    const second = fillAllForced(createBoardAdapter("latin", 5, []), first.values);
    expect(second.placements.length).toBeGreaterThan(0); // cells forced only AFTER the first sweep
  });

  it("does not apply inequality-only deductions: a chain board with no basic single is left untouched", () => {
    // Every empty cell of the chain board still has ≥2 basic all-different candidates (its solve
    // needs an inequality rung first), so the naked+hidden-single sweep must place NOTHING.
    const { placements, values } = fillAllForced(
      createBoardAdapter("latin", 5, CHAIN_INEQ),
      CHAIN_BOARD,
    );
    const cands = createBoardAdapter("latin", 5, CHAIN_INEQ).computeCandidates(
      CHAIN_BOARD,
    );
    const anyBasicSingle = [...cands].some((m) => m !== 0 && popcount(m) === 1);
    if (!anyBasicSingle) {
      expect(placements).toEqual([]);
      expect(values).toEqual(CHAIN_BOARD);
    }
  });
});

describe("findHint over the latin adapter — the cheapest named single (lane E3, two-press hint) — twin", () => {
  const solution = gradeBoard(createBoardAdapter("latin", 5, []), SINGLES_BOARD).values;

  it("names a single on an empty cell, carrying the true forced value + becauseCells", () => {
    const hint = findHint(createBoardAdapter("latin", 5, []), SINGLES_BOARD);
    expect(hint).not.toBeNull();
    expect(["naked-single", "hidden-single"]).toContain(hint!.technique);
    expect(SINGLES_BOARD[hint!.cell]).toBe(0);
    expect(hint!.value).toBe(solution[hint!.cell]);
    expect(hint!.becauseCells.length).toBeGreaterThan(0);
  });

  it("cites only rows/cols as the hidden-single house (no boxes in futoshiki)", () => {
    const hint = findHint(createBoardAdapter("latin", 5, []), SINGLES_BOARD)!;
    if (hint.technique === "hidden-single") {
      expect(["row", "col"]).toContain(hint.houseAxis); // never "box"
    } else {
      expect(hint.houseAxis).toBeUndefined();
    }
  });

  it("prefers the focused cell when it is itself a forced single", () => {
    const cands = createBoardAdapter("latin", 5, []).computeCandidates(SINGLES_BOARD);
    const forced = SINGLES_BOARD.findIndex(
      (v, i) => v === 0 && popcount(cands[i]) === 1,
    );
    expect(forced).toBeGreaterThanOrEqual(0);
    const hint = findHint(createBoardAdapter("latin", 5, []), SINGLES_BOARD, forced)!;
    expect(hint.cell).toBe(forced);
    expect(hint.value).toBe(solution[forced]);
  });

  it("returns null when the board affords no single (the answer-key-reveal fallback case)", () => {
    // The inequality rungs prune candidates but never PLACE a digit, so an all-blank board with
    // only inequality furniture has no single to name — the honest answer-key-reveal fallback.
    expect(
      findHint(createBoardAdapter("latin", 5, CHAIN_INEQ), new Array(25).fill(0)),
    ).toBeNull();
  });
});

describe("deal-time grade latency — futoshiki fixtures", () => {
  it("grades the fixtures well within a frame", () => {
    const cases: [number[], Inequality[]][] = [
      [SINGLES_BOARD, []],
      [FORCING_BOARD, FORCING_INEQ],
      [CHAIN_BOARD, CHAIN_INEQ],
    ];
    const ITERS = 200;
    let total = 0;
    let worst = 0;
    for (let i = 0; i < ITERS; i++) {
      for (const [board, ineq] of cases) {
        const t0 = performance.now();
        gradeBoard(createBoardAdapter("latin", 5, ineq), board);
        const dt = performance.now() - t0;
        total += dt;
        if (dt > worst) worst = dt;
      }
    }
    const mean = total / (ITERS * cases.length);
    console.info(
      `[T4-W7] futoshiki deal-time grade latency (5×5, n=${ITERS * cases.length}): mean ${mean.toFixed(3)}ms, worst ${worst.toFixed(3)}ms`,
    );
    expect(mean).toBeLessThan(10);
  });
});

describe("futoshiki geometry + constraint mapping", () => {
  it("builds 2·N houses (rows + cols only, no boxes), axis-tagged, each N wide", () => {
    const houses = boardHouses("latin", 5);
    expect(houses.length).toBe(10);
    expect(houses.filter((h) => h.axis === "row").length).toBe(5);
    expect(houses.filter((h) => h.axis === "col").length).toBe(5);
    expect(houses.filter((h) => h.axis === "box").length).toBe(0);
    expect(houses.every((h) => h.cells.length === 5)).toBe(true);
    expect(houses.find((h) => h.axis === "row")!.cells).toEqual([0, 1, 2, 3, 4]);
    expect(houses.find((h) => h.axis === "col")!.cells).toEqual([0, 5, 10, 15, 20]);
  });

  it("lifts [greater, lesser] furniture into the engine's Constraint vocabulary", () => {
    expect(
      inequalityConstraints([
        [1, 0],
        [11, 10],
      ]),
    ).toEqual([
      { kind: "inequality", greater: 1, lesser: 0 },
      { kind: "inequality", greater: 11, lesser: 10 },
    ]);
  });
});

// ── test-local helpers ──────────────────────────────────────────────────────────────────

/** The set of cells that are a naked or hidden single on the basic all-different candidates —
 *  an independent re-derivation of "forced", for the fill-all-forced precision check. */
function forcedCellSet(board: number[], ineq: Inequality[]): Set<number> {
  const adapter = createBoardAdapter("latin", 5, ineq);
  const cands = adapter.computeCandidates(board);
  const set = new Set<number>();
  for (let c = 0; c < cands.length; c++)
    if (cands[c] !== 0 && popcount(cands[c]) === 1) set.add(c);
  for (const house of adapter.houses) {
    for (let v = 1; v <= adapter.n; v++) {
      let only = -1;
      let count = 0;
      for (const cell of house.cells) {
        if (cands[cell] & (1 << v)) {
          only = cell;
          if (++count > 1) break;
        }
      }
      if (count === 1 && popcount(cands[only]) > 1) set.add(only);
    }
  }
  return set;
}

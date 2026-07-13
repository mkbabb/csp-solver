import { describe, it, expect } from "vitest";
import {
  findStep,
  findHint,
  gradeBoard,
  fillAllForced,
  fullDomainMask,
  popcount,
  candidateValues,
  TECHNIQUE_TIER,
  type House,
  type Constraint,
  type PuzzleView,
  type TechniqueId,
  type Elimination,
  type Deduction,
  type TechniqueAdapter,
  type GradeResult,
  type ForcedPlacement,
  type FillForcedResult,
} from "./techniqueEngine";

// The game-agnostic core (T4-W7). These units exercise the ladder over the ABSTRACT view —
// hand-built houses + candidate masks, no game, no wasm. The sudoku-specific ladder proofs
// (singles→tier-1, X-wing→tier-3, fill-forced, and the load-bearing self-computed-vs-GAC
// tripwire) live beside the sudoku adapter in games/sudoku/technique/. The shared floor may
// not import a concrete game (eslint boundary), so the house scaffolding here is local.

/** 27 sudoku houses (rows, cols, boxes) for a sub-grid side `size`, axis-tagged. Local test
 *  scaffolding — the production copy is the sudoku adapter's, which this floor can't import. */
function nineHouses(size = 3): House[] {
  const side = size * size;
  const houses: House[] = [];
  for (let r = 0; r < side; r++)
    houses.push({
      cells: Array.from({ length: side }, (_, c) => r * side + c),
      axis: "row",
    });
  for (let c = 0; c < side; c++)
    houses.push({
      cells: Array.from({ length: side }, (_, r) => r * side + c),
      axis: "col",
    });
  for (let br = 0; br < size; br++)
    for (let bc = 0; bc < size; bc++) {
      const cells: number[] = [];
      for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
          cells.push((br * size + r) * side + (bc * size + c));
      houses.push({ cells, axis: "box" });
    }
  return houses;
}

const bits = (...vs: number[]) => vs.reduce((m, v) => m | (1 << v), 0);

describe("bit helpers (the candidate-mask vocabulary)", () => {
  it("fullDomainMask sets bits 1..n and nothing else", () => {
    expect(candidateValues(fullDomainMask(9), 9)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(fullDomainMask(9) & 1).toBe(0); // bit 0 unused
    expect(popcount(fullDomainMask(4))).toBe(4);
  });

  it("popcount counts remaining candidates", () => {
    expect(popcount(0)).toBe(0);
    expect(popcount(bits(3))).toBe(1);
    expect(popcount(bits(1, 4, 9))).toBe(3);
  });
});

describe("findStep — the cheapest applicable deduction over (candidates, houses)", () => {
  it("naked single: a cell with one candidate places it", () => {
    const candidates = new Uint32Array([bits(5), bits(1, 2, 3), bits(1, 2, 3)]);
    const view: PuzzleView = { n: 9, candidates, houses: [{ cells: [0, 1, 2] }] };
    const step = findStep(view);
    expect(step).not.toBeNull();
    expect(step!.technique).toBe("naked-single");
    expect(step!.tier).toBe(1);
    expect(step!.targetCell).toBe(0);
    expect(step!.targetValue).toBe(5);
    expect(step!.eliminations).toEqual([]);
  });

  it("hidden single: a value with one home in a house places it, even at popcount>1", () => {
    // cell0 = {7,8}; the other eight cells share {1..6}. 7 lives nowhere else in the house.
    const candidates = new Uint32Array(9);
    candidates[0] = bits(7, 8);
    for (let i = 1; i < 9; i++) candidates[i] = bits(1, 2, 3, 4, 5, 6);
    const step = findStep({
      n: 9,
      candidates,
      houses: [{ cells: [0, 1, 2, 3, 4, 5, 6, 7, 8] }],
    });
    expect(step!.technique).toBe("hidden-single");
    expect(step!.targetCell).toBe(0);
    expect(step!.targetValue).toBe(7);
  });

  it("naked pair: two cells sharing two candidates evict them from the rest of the house", () => {
    const candidates = new Uint32Array([
      bits(1, 2),
      bits(1, 2),
      bits(1, 2, 3),
      bits(1, 2, 3),
    ]);
    const step: Deduction | null = findStep({
      n: 9,
      candidates,
      houses: [{ cells: [0, 1, 2, 3] }],
    });
    expect(step!.technique).toBe("naked-pair");
    expect(step!.tier).toBe(2);
    expect(step!.targetCell).toBeNull();
    expect(new Set(step!.becauseCells)).toEqual(new Set([0, 1]));
    const elims: Elimination[] = step!.eliminations;
    expect(elims).toEqual([
      { cell: 2, values: [1, 2] },
      { cell: 3, values: [1, 2] },
    ]);
  });

  it("pointing / box-line: a value locked to box∩line leaves the line (label follows the box axis)", () => {
    // Full domain everywhere (no singles/pairs anywhere), then strip 7 from box-0's lower two
    // rows — 7 is now confined to box-0's top row and must leave the rest of that row.
    const candidates = new Uint32Array(81).fill(fullDomainMask(9));
    for (const c of [9, 10, 11, 18, 19, 20]) candidates[c] &= ~(1 << 7);
    const step = findStep({ n: 9, candidates, houses: nineHouses() });
    expect(step!.technique).toBe("pointing");
    expect(step!.tier).toBe(2);
    expect(step!.becauseCandidates).toEqual([7]);
    expect(new Set(step!.becauseCells)).toEqual(new Set([0, 1, 2]));
    expect(new Set(step!.eliminations.map((e) => e.cell))).toEqual(
      new Set([3, 4, 5, 6, 7, 8]),
    );
  });

  it("x-wing: value in the same two columns across two rows leaves those columns elsewhere", () => {
    const candidates = new Uint32Array(81).fill(fullDomainMask(9));
    const idx = (r: number, c: number) => r * 9 + c;
    for (const r of [1, 4])
      for (let c = 0; c < 9; c++)
        if (c !== 2 && c !== 6) candidates[idx(r, c)] &= ~(1 << 7);
    const step = findStep({ n: 9, candidates, houses: nineHouses() });
    expect(step!.technique).toBe("x-wing");
    expect(step!.tier).toBe(3);
    expect(step!.becauseCandidates).toEqual([7]);
    expect(new Set(step!.becauseCells)).toEqual(
      new Set([idx(1, 2), idx(1, 6), idx(4, 2), idx(4, 6)]),
    );
    // 7 rows × 2 cols of victims, all still carrying candidate 7.
    expect(step!.eliminations.length).toBe(14);
    expect(
      step!.eliminations.every((e) => e.values.length === 1 && e.values[0] === 7),
    ).toBe(true);
  });

  it("returns null when no rung applies (a fully-filled / exhausted view)", () => {
    expect(
      findStep({ n: 9, candidates: new Uint32Array(9), houses: [{ cells: [0] }] }),
    ).toBeNull();
  });

  it("does not throw on a single-axis view (no cover axis for the fish rung)", () => {
    // One 'row' house, full-domain cells: no single/pair/pointing fires and there is no 'col'
    // axis for the X-wing cover — the fish rung must skip cleanly, not dereference undefined.
    const candidates = new Uint32Array([
      bits(1, 2, 3, 4),
      bits(1, 2, 3, 4),
      bits(1, 2, 3, 4),
      bits(1, 2, 3, 4),
    ]);
    expect(() =>
      findStep({ n: 4, candidates, houses: [{ cells: [0, 1, 2, 3], axis: "row" }] }),
    ).not.toThrow();
    expect(
      findStep({ n: 4, candidates, houses: [{ cells: [0, 1, 2, 3], axis: "row" }] }),
    ).toBeNull();
  });

  it("cheapest-first: a naked single is returned even when a pair also exists", () => {
    // cell0 is a naked single {4}; cells 1,2 form a {1,2} pair. The single wins.
    const candidates = new Uint32Array([
      bits(4),
      bits(1, 2),
      bits(1, 2),
      bits(1, 2, 3),
    ]);
    const step = findStep({ n: 9, candidates, houses: [{ cells: [0, 1, 2, 3] }] });
    expect(step!.technique).toBe("naked-single");
  });
});

describe("game-agnostic over arbitrary houses (the futoshiki seam)", () => {
  // A 4×4 Latin square — rows + cols only, NO boxes: the shape futoshiki (lane E2) supplies.
  // The same engine grades it with zero sudoku knowledge, proving there is one engine, not two.
  function latinAdapter(): TechniqueAdapter {
    const side = 4;
    const houses: House[] = [];
    for (let r = 0; r < side; r++)
      houses.push({ cells: [0, 1, 2, 3].map((c) => r * side + c), axis: "row" });
    for (let c = 0; c < side; c++)
      houses.push({ cells: [0, 1, 2, 3].map((r) => r * side + c), axis: "col" });
    const full = fullDomainMask(side);
    const peers: Set<number>[] = Array.from({ length: 16 }, () => new Set());
    for (const h of houses)
      for (const cell of h.cells)
        for (const o of h.cells) if (o !== cell) peers[cell].add(o);
    return {
      n: side,
      totalCells: 16,
      houses,
      computeCandidates(values) {
        const cands = new Uint32Array(16);
        for (let c = 0; c < 16; c++) {
          if (values[c] !== 0) continue;
          let used = 0;
          for (const p of peers[c]) if (values[p]) used |= 1 << values[p];
          cands[c] = full & ~used;
        }
        return cands;
      },
    };
  }

  it("gradeBoard solves a rows/cols-only board via the same singles ladder", () => {
    const adapter = latinAdapter();
    const solution = [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1];
    const puzzle = solution.slice();
    for (const i of [0, 5, 10, 15, 3, 6]) puzzle[i] = 0;
    const grade: GradeResult = gradeBoard(adapter, puzzle);
    expect(grade.solved).toBe(true);
    expect(grade.values).toEqual(solution);
    expect(grade.tier).toBe(1); // singles suffice on this board
    expect(grade.hardestTechnique).toBeTruthy();
  });

  it("the all-different ladder ignores view.constraints (inequalities are E2's rungs)", () => {
    // Passing futoshiki-shaped inequality constraints must not change the all-different step.
    const candidates = new Uint32Array([bits(5), bits(1, 2, 3), bits(1, 2, 3)]);
    const constraints: Constraint[] = [{ kind: "inequality", greater: 1, lesser: 2 }];
    const houses: House[] = [{ cells: [0, 1, 2], axis: "row" }];
    const without = findStep({ n: 9, candidates, houses });
    const withC = findStep({ n: 9, candidates, houses, constraints });
    expect(withC).toEqual(without);
    expect(withC!.technique).toBe("naked-single");
  });
});

describe("the inequality rungs (the futoshiki constraint set) over the abstract view", () => {
  it("inequality-forcing: the greater end sheds value 1, the lesser end sheds value n — and is inert without constraints", () => {
    // Two full-domain cells in a house: no all-different step exists, so a step appears ONLY
    // once the inequality is supplied — the rung is genuinely constraint-gated.
    const candidates = new Uint32Array([bits(1, 2, 3, 4, 5), bits(1, 2, 3, 4, 5)]);
    const houses: House[] = [{ cells: [0, 1], axis: "row" }];
    expect(findStep({ n: 5, candidates, houses })).toBeNull(); // no constraints → inert
    const constraints: Constraint[] = [{ kind: "inequality", greater: 0, lesser: 1 }];
    const step = findStep({ n: 5, candidates, houses, constraints });
    expect(step!.technique).toBe("inequality-forcing");
    expect(step!.tier).toBe(2);
    expect(step!.eliminations).toEqual([
      { cell: 0, values: [1] }, // greater can't be the domain minimum
      { cell: 1, values: [5] }, // lesser can't be the domain maximum
    ]);
  });

  it("inequality-chain: a run a<b<c<d bounds each cell by position (tier 3, once forcing is spent)", () => {
    // Chain cells 0<1<2<3 in a COMPLETE 5-cell row (cell4 unconstrained), n=5, with the endpoint
    // (value 1/5) cuts ALREADY applied so forcing is silent. cell4 keeps values 1 and 5 company so
    // there is no hidden single either — leaving the chain rung as the only step. b<c<d forces
    // cell1 ≤ 3, so value 4 leaves cell1 — a cut no endpoint edge alone makes.
    const candidates = new Uint32Array([
      bits(1, 2, 3, 4), // a: value 5 gone (lesser end)
      bits(2, 3, 4), // b: values 1,5 gone (both ends)
      bits(2, 3, 4), // c: values 1,5 gone (both ends)
      bits(2, 3, 4, 5), // d: value 1 gone (greater end)
      bits(1, 2, 3, 4, 5), // e: unconstrained — carries 1 and 5 so neither is a hidden single
    ]);
    const constraints: Constraint[] = [
      { kind: "inequality", greater: 1, lesser: 0 },
      { kind: "inequality", greater: 2, lesser: 1 },
      { kind: "inequality", greater: 3, lesser: 2 },
    ];
    const houses: House[] = [{ cells: [0, 1, 2, 3, 4], axis: "row" }];
    const step = findStep({ n: 5, candidates, houses, constraints });
    expect(step!.technique).toBe("inequality-chain");
    expect(step!.tier).toBe(3);
    expect(step!.eliminations).toEqual([{ cell: 1, values: [4] }]);
    // the highlighted "because" cells are the whole run.
    expect(new Set(step!.becauseCells)).toEqual(new Set([0, 1, 2, 3]));
  });

  it("the chain rung leaves length-2 cuts to forcing: an isolated edge yields no chain step", () => {
    // A single edge (0>1) is only a 2-chain; the chain rung (run ≥ 3) must not fire on it.
    // Both cells share {2,3,4}: no naked/hidden single, forcing already spent (no 1 in the
    // greater cell, no 5 in the lesser), so with only a 2-chain the ladder finds nothing.
    const candidates = new Uint32Array([bits(2, 3, 4), bits(2, 3, 4)]);
    const houses: House[] = [{ cells: [0, 1], axis: "row" }];
    const constraints: Constraint[] = [{ kind: "inequality", greater: 0, lesser: 1 }];
    expect(findStep({ n: 5, candidates, houses, constraints })).toBeNull();
  });
});

describe("findHint — the cheapest named single, focused-cell-first (lane E3)", () => {
  it("names a naked single with becauseCells = [the cell]", () => {
    const hint = findHint(tinyRowAdapter(), [0, 2, 3]);
    expect(hint).toEqual({
      technique: "naked-single",
      cell: 0,
      value: 1,
      becauseCells: [0],
    });
  });

  it("returns null when the board affords no single (the answer-key-reveal fallback case)", () => {
    expect(findHint(tinyRowAdapter(), [0, 0, 0])).toBeNull();
  });

  it("falls through to the board-level single when the preferred cell is not itself forced", () => {
    // preferredCell 1 is filled → not a placeable single; the board's own naked single is named.
    const hint = findHint(tinyRowAdapter(), [0, 2, 3], 1);
    expect(hint!.cell).toBe(0);
    expect(hint!.value).toBe(1);
  });
});

describe("drivers — gradeBoard / fillAllForced shapes and progress", () => {
  it("TECHNIQUE_TIER ranks the ladder 1→3", () => {
    const tierOf = (t: TechniqueId) => TECHNIQUE_TIER[t];
    expect(tierOf("naked-single")).toBe(1);
    expect(tierOf("hidden-single")).toBe(1);
    expect(tierOf("naked-pair")).toBe(2);
    expect(tierOf("pointing")).toBe(2);
    expect(tierOf("box-line")).toBe(2);
    expect(tierOf("x-wing")).toBe(3);
  });

  it("gradeBoard accepts a row-major record and reports steps>0 on a solvable board", () => {
    const adapter = tinyRowAdapter();
    const grade = gradeBoard(adapter, { "0": 0, "1": 2, "2": 3 });
    expect(grade.solved).toBe(true);
    expect(grade.values).toEqual([1, 2, 3]);
    expect(grade.steps).toBeGreaterThan(0);
  });

  it("fillAllForced fills every current single in one sweep and reports each placement", () => {
    const adapter = tinyRowAdapter();
    const result: FillForcedResult = fillAllForced(adapter, [0, 2, 3]);
    const placements: ForcedPlacement[] = result.placements;
    expect(placements).toEqual([{ cell: 0, value: 1, technique: "naked-single" }]);
    expect(result.values).toEqual([1, 2, 3]);
  });
});

/** A degenerate 1×3 "row" (values 1..3, one all-different house) — the smallest adapter that
 *  exercises the driver plumbing without any game. */
function tinyRowAdapter(): TechniqueAdapter {
  const houses: House[] = [{ cells: [0, 1, 2], axis: "row" }];
  const full = fullDomainMask(3);
  return {
    n: 3,
    totalCells: 3,
    houses,
    computeCandidates(values) {
      const cands = new Uint32Array(3);
      for (let c = 0; c < 3; c++) {
        if (values[c] !== 0) continue;
        let used = 0;
        for (const o of [0, 1, 2]) if (o !== c && values[o]) used |= 1 << values[o];
        cands[c] = full & ~used;
      }
      return cands;
    },
  };
}

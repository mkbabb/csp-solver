/**
 * The technique engine (T4-W7) — the layer that was never there. A pure, game-agnostic
 * human-deduction solver that names the *cheapest* logical step for a board and, run to
 * completion, grades it by the hardest technique that step-ladder needed. It replaces the
 * answer-reveal "hint" (a digit copied from the solved key, no reasoning) and the opaque
 * backtrack-proxy difficulty bucket with a measured technique signature.
 *
 * ── THE LOAD-BEARING INVARIANT (r3 KILL-LIST #3, verbatim-binding) ──────────────────────
 * The engine grades over SELF-COMPUTED basic-elimination candidates — a cell's candidates =
 * `1..n minus the values already filled in its all-different houses` — NEVER over the masks
 * `propagateBoard` returns. Those masks are POST-FULL-GAC: at full GAC strength most served
 * boards collapse to all-singleton domains (`propagate_sudoku` in
 * `csp-solver/wasm/src/sudoku.rs`), which is strictly stronger than any human single/pair.
 * Feeding GAC-collapsed masks to a technique grader is corrupted — every empty cell reads
 * as a naked single and the grade collapses to tier-1. The candidate substrate here is the
 * adapter's `computeCandidates`, which does basic elimination and nothing stronger.
 * `techniqueEngine.test.ts` pins this with a permanent tripwire (self-computed candidates
 * asserted NOT equal to the collapsed GAC substrate on a board where GAC over-prunes past
 * the human sequence).
 *
 * ── Game-agnostic by construction ──────────────────────────────────────────────────────
 * The core reasons over an abstract `PuzzleView` — `{ n, candidates, houses, constraints? }` —
 * and knows nothing of sudoku or futoshiki. A per-game *adapter* supplies the two things
 * that differ: the candidate substrate (basic elimination in that game's constraint set) and
 * the house/constraint structure. The all-different rungs (naked/hidden single, naked
 * pair/triple, pointing/box-line, X-wing) are pure functions of `houses` + `candidates`, so
 * every game with all-different houses gets them for free.
 *
 * The seam for futoshiki (lane E2, landed): its adapter supplies rows/cols as `houses` (no
 * boxes, so pointing never fires) and a `computeCandidates` that does ONLY basic all-different
 * elimination — the substrate stays deliberately weak, exactly as sudoku's does. Its signature
 * deductions (inequality-forcing, chains) are the two appended rungs below that read
 * `view.constraints`. Folding the inequality bounds into the substrate would collapse the grade
 * the same way reading GAC masks does — a board that needs the endpoint rule would arrive with
 * that reduction pre-applied and read as tier-1 — so the inequality reasoning lives ONLY in the
 * rungs, never in the candidate function. No second engine — E2 wrote an adapter and appended
 * detectors, never re-implemented the ladder.
 */

// ── Candidate bit convention ────────────────────────────────────────────────────────────
// A cell's candidate set is a bitmask: bit v (1-based) set ⇔ value v is a candidate. Bit 0
// is unused (values are 1..n). A FILLED cell — or a broken cell with no candidates — has
// mask 0 and is never a deduction target. This mirrors the wasm mask convention
// (the solver client's propagate path, bit v = value v) so the two substrates are directly
// comparable in the tripwire test.

/** All bits 1..n set — a cell's full domain before any elimination. */
export function fullDomainMask(n: number): number {
  return (1 << (n + 1)) - 2;
}

/** Population count of a candidate mask (how many candidates remain). */
export function popcount(mask: number): number {
  let count = 0;
  for (let m = mask; m !== 0; m &= m - 1) count++;
  return count;
}

/** The value of a single-bit mask (its only candidate). Undefined behaviour if popcount≠1. */
function singleValue(mask: number): number {
  return 31 - Math.clz32(mask);
}

/** The candidate values of a mask, ascending. */
export function candidateValues(mask: number, n: number): number[] {
  const out: number[] = [];
  for (let v = 1; v <= n; v++) if (mask & (1 << v)) out.push(v);
  return out;
}

// ── The abstract view + deduction vocabulary ────────────────────────────────────────────

/**
 * An all-different group of cells (row-major indices), whose values must be pairwise
 * distinct. Sudoku: rows, cols, boxes. Futoshiki: rows, cols. The optional `axis` tags a
 * house's orientation — only the fish (X-wing) rung consults it, to pick two parallel base
 * houses and their orthogonal cover houses; the single/pair/pointing rungs ignore it.
 */
export interface House {
  cells: number[];
  axis?: string;
}

/**
 * A non-all-different constraint the extended (futoshiki, lane E2) rungs consult. Sudoku
 * supplies none. `inequality` means `cell[greater] > cell[lesser]`; E2's inequality-forcing
 * and chain detectors read these. The core all-different ladder ignores `constraints`
 * entirely, so passing them is inert for sudoku.
 */
export type Constraint = { kind: "inequality"; greater: number; lesser: number };

/** The abstract, game-agnostic puzzle snapshot the ladder reasons over. */
export interface PuzzleView {
  /** Domain size — values are 1..n. */
  n: number;
  /** Self-computed candidate masks, one per cell (row-major). NEVER the GAC masks. */
  candidates: Uint32Array;
  /** All-different houses (rows/cols/boxes for sudoku; rows/cols for futoshiki). */
  houses: House[];
  /** Non-all-different constraints (futoshiki inequalities, lane E2); omitted for sudoku. */
  constraints?: Constraint[];
}

/**
 * The ladder's technique names, ascending difficulty. The two `inequality-*` rungs are the
 * futoshiki constraint set (lane E2); they read `view.constraints` and are inert for the
 * all-different games (sudoku supplies no constraints), so the union is shared by both games.
 */
export type TechniqueId =
  | "naked-single"
  | "hidden-single"
  | "naked-pair"
  | "naked-triple"
  | "pointing"
  | "box-line"
  | "inequality-forcing"
  | "inequality-chain"
  | "x-wing";

/** Difficulty tier per technique — the grade is the max tier the ladder needed. */
export const TECHNIQUE_TIER: Record<TechniqueId, number> = {
  "naked-single": 1,
  "hidden-single": 1,
  "naked-pair": 2,
  "naked-triple": 2,
  pointing: 2,
  "box-line": 2,
  // Futoshiki (E2): the endpoint rule is the tier-2 analogue of pointing; the positional
  // chain bound is the tier-3 analogue of X-wing (a strictly stronger, transitive deduction).
  "inequality-forcing": 2,
  "inequality-chain": 3,
  "x-wing": 3,
};

/** A candidate removal a deduction licenses: drop `values` from cell `cell`. */
export interface Elimination {
  cell: number;
  values: number[];
}

/**
 * The cheapest applicable deduction. A *placement* (naked/hidden single) sets `targetCell`
 * to `targetValue` with no eliminations; an *elimination* technique (pair/triple, pointing,
 * box-line, X-wing) leaves `targetCell`/`targetValue` null and carries the removals in
 * `eliminations`. `becauseCells`/`becauseCandidates` are the reasoning to surface (the cells
 * to highlight, the candidate(s) the argument turns on) — the hint UX (lane E3) renders them.
 */
export interface Deduction {
  technique: TechniqueId;
  tier: number;
  targetCell: number | null;
  targetValue: number | null;
  becauseCells: number[];
  becauseCandidates: number[];
  eliminations: Elimination[];
}

// ── Detectors — each a pure function of the view, cheapest-first ─────────────────────────
// Order matters: findStep returns the FIRST detector that fires, so the cheapest technique
// that makes progress is always the named one. Every elimination detector only returns a
// deduction that actually removes ≥1 present candidate (no no-op steps — the grade loop
// relies on strict progress to terminate).

function findNakedSingle(view: PuzzleView): Deduction | null {
  const { candidates } = view;
  for (let cell = 0; cell < candidates.length; cell++) {
    const mask = candidates[cell];
    if (mask !== 0 && popcount(mask) === 1) {
      const value = singleValue(mask);
      return {
        technique: "naked-single",
        tier: 1,
        targetCell: cell,
        targetValue: value,
        becauseCells: [cell],
        becauseCandidates: [value],
        eliminations: [],
      };
    }
  }
  return null;
}

function findHiddenSingle(view: PuzzleView): Deduction | null {
  const { candidates, houses, n } = view;
  for (const house of houses) {
    for (let v = 1; v <= n; v++) {
      const bit = 1 << v;
      let only = -1;
      let count = 0;
      for (const cell of house.cells) {
        if (candidates[cell] & bit) {
          only = cell;
          if (++count > 1) break;
        }
      }
      // count===1 over an empty cell with ≥2 candidates is the real hidden single; a
      // count===1 cell that is ALSO a naked single is already served by the cheaper rung.
      if (count === 1 && popcount(candidates[only]) > 1) {
        return {
          technique: "hidden-single",
          tier: 1,
          targetCell: only,
          targetValue: v,
          becauseCells: [...house.cells],
          becauseCandidates: [v],
          eliminations: [],
        };
      }
    }
  }
  return null;
}

/**
 * Naked subset (pair k=2, triple k=3): k empty cells in a house whose candidate UNION is
 * exactly k values — those k values are locked to those k cells, so they leave every other
 * cell in the house. Returns the first subset that eliminates a present candidate.
 */
function findNakedSubset(view: PuzzleView, k: 2 | 3): Deduction | null {
  const { candidates, houses } = view;
  for (const house of houses) {
    const empties = house.cells.filter((c) => candidates[c] !== 0);
    if (empties.length <= k) continue; // no cells left to eliminate from
    const combos = kSubsets(empties.length, k);
    for (const combo of combos) {
      let union = 0;
      for (const idx of combo) union |= candidates[empties[idx]];
      if (popcount(union) !== k) continue;
      const subsetCells = combo.map((idx) => empties[idx]);
      const subsetSet = new Set(subsetCells);
      const elims: Elimination[] = [];
      for (const cell of empties) {
        if (subsetSet.has(cell)) continue;
        const removed = candidates[cell] & union;
        if (removed !== 0)
          elims.push({ cell, values: candidateValues(removed, view.n) });
      }
      if (elims.length > 0) {
        return {
          technique: k === 2 ? "naked-pair" : "naked-triple",
          tier: 2,
          targetCell: null,
          targetValue: null,
          becauseCells: subsetCells,
          becauseCandidates: candidateValues(union, view.n),
          eliminations: elims,
        };
      }
    }
  }
  return null;
}

/**
 * Pointing / box-line (locked candidates) — expressed once, house-agnostically: if every
 * empty cell of house A that can hold value v ALSO shares a second house B, then v is locked
 * to A∩B and leaves B outside A. Box→line reads as "pointing"; line→box as "box-line" (the
 * label follows A's axis). For futoshiki, rows and cols meet in a single cell, so no second
 * common house exists and this rung is naturally silent.
 */
function findPointing(view: PuzzleView): Deduction | null {
  const { candidates, houses, n } = view;
  const cellHouses = buildCellHouses(view);
  for (let a = 0; a < houses.length; a++) {
    const house = houses[a];
    for (let v = 1; v <= n; v++) {
      const bit = 1 << v;
      const vCells = house.cells.filter((c) => candidates[c] & bit);
      if (vCells.length < 2) continue; // 0 → nothing; 1 → a hidden single, served earlier
      // Houses (other than A) shared by ALL v-cells = the confinement covers.
      let commons: number[] | null = null;
      for (const cell of vCells) {
        const hs = cellHouses[cell].filter((h) => h !== a);
        commons = commons === null ? hs : commons.filter((h) => hs.includes(h));
        if (commons.length === 0) break;
      }
      if (!commons || commons.length === 0) continue;
      for (const b of commons) {
        const elims: Elimination[] = [];
        for (const cell of houses[b].cells) {
          if (house.cells.includes(cell)) continue; // stays inside A∩B
          if (candidates[cell] & bit) elims.push({ cell, values: [v] });
        }
        if (elims.length > 0) {
          return {
            technique: house.axis === "box" ? "pointing" : "box-line",
            tier: 2,
            targetCell: null,
            targetValue: null,
            becauseCells: vCells,
            becauseCandidates: [v],
            eliminations: elims,
          };
        }
      }
    }
  }
  return null;
}

/**
 * X-wing (basic fish) — for a value v, two parallel base houses (both axis "row", or both
 * "col") whose v-candidates each occupy exactly the SAME two orthogonal cover houses; v then
 * leaves those two covers everywhere outside the base. Uses the `axis` tags so boxes never
 * serve as a base (which would be a mutant fish, out of scope). Applies unchanged to
 * futoshiki rows/cols.
 */
function findXWing(view: PuzzleView): Deduction | null {
  const { candidates, houses, n } = view;
  const cellCover = buildCellAxisHouse(view);
  for (const [baseAxis, coverAxis] of [
    ["row", "col"],
    ["col", "row"],
  ] as const) {
    const coverLane = cellCover[coverAxis];
    if (!coverLane) continue; // a game without this cover axis has no fish on it
    const baseHouses: number[] = [];
    for (let h = 0; h < houses.length; h++)
      if (houses[h].axis === baseAxis) baseHouses.push(h);
    for (let v = 1; v <= n; v++) {
      const bit = 1 << v;
      // Each qualifying base house → the sorted pair of cover houses its two v-cells hit.
      const info: { base: number; vCells: number[]; covers: [number, number] }[] = [];
      for (const h of baseHouses) {
        const vCells = houses[h].cells.filter((c) => candidates[c] & bit);
        if (vCells.length !== 2) continue;
        const c0 = coverLane[vCells[0]];
        const c1 = coverLane[vCells[1]];
        if (c0 === undefined || c1 === undefined || c0 === c1) continue;
        info.push({ base: h, vCells, covers: c0 < c1 ? [c0, c1] : [c1, c0] });
      }
      for (let i = 0; i < info.length; i++) {
        for (let j = i + 1; j < info.length; j++) {
          if (info[i].covers[0] !== info[j].covers[0]) continue;
          if (info[i].covers[1] !== info[j].covers[1]) continue;
          const baseCells = new Set([...info[i].vCells, ...info[j].vCells]);
          const elims: Elimination[] = [];
          for (const cover of info[i].covers) {
            for (const cell of houses[cover].cells) {
              if (baseCells.has(cell)) continue;
              if (candidates[cell] & bit) elims.push({ cell, values: [v] });
            }
          }
          if (elims.length > 0) {
            return {
              technique: "x-wing",
              tier: 3,
              targetCell: null,
              targetValue: null,
              becauseCells: [...baseCells],
              becauseCandidates: [v],
              eliminations: elims,
            };
          }
        }
      }
    }
  }
  return null;
}

// ── The futoshiki constraint set (lane E2) — two rungs over view.constraints ─────────────
// Both read only `view.constraints` (the inequality edges) + `candidates`; a game without
// constraints (sudoku) short-circuits them, so appending them to the shared ladder is inert
// there. The over-prune invariant holds identically: the substrate the adapter hands in is
// basic all-different elimination, and ALL inequality reasoning is these rungs — never folded
// into the candidate function, or a board needing the endpoint rule would grade tier-1.

/** Bits for values in [lo, hi] inclusive (1-based). Empty when lo > hi. */
function rangeMask(lo: number, hi: number): number {
  let m = 0;
  for (let v = lo; v <= hi; v++) m |= 1 << v;
  return m;
}

/**
 * Inequality-forcing (futoshiki, the analogue of pointing) — the endpoint rule every solver
 * learns first: across one printed inequality `greater > lesser`, the greater cell cannot hold
 * the domain MINIMUM (value 1) and the lesser cell cannot hold the domain MAXIMUM (value n). A
 * one-edge, one-step deduction over `view.constraints`. Deliberately the STATIC extreme cut
 * (values 1/n only), NOT the neighbour's live min/max: live-min forcing iterated to fixpoint is
 * exactly arc-consistency over the `<` path, which reaches the full positional bound and would
 * strand the chain rung (nothing would ever *need* it). Keeping forcing to the static extreme
 * makes the chain a strictly stronger, separately-gradeable technique — the futoshiki twin of
 * X-wing ⊋ pointing.
 */
function findInequalityForcing(view: PuzzleView): Deduction | null {
  const { candidates, constraints, n } = view;
  if (!constraints) return null;
  const minBit = 1 << 1;
  const maxBit = 1 << n;
  for (const { greater, lesser } of constraints) {
    const elims: Elimination[] = [];
    const because: number[] = [];
    if (candidates[greater] & minBit) {
      elims.push({ cell: greater, values: [1] });
      because.push(1);
    }
    if (candidates[lesser] & maxBit) {
      elims.push({ cell: lesser, values: [n] });
      because.push(n);
    }
    if (elims.length > 0) {
      return {
        technique: "inequality-forcing",
        tier: 2,
        targetCell: null,
        targetValue: null,
        becauseCells: [greater, lesser],
        becauseCandidates: because,
        eliminations: elims,
      };
    }
  }
  return null;
}

/**
 * Inequality chains (futoshiki) — a maximal ascending run `a < b < c < …` bounds each member by
 * POSITION: the k-th smallest along the run is ≥ k, the k-th largest ≤ n−(k−1). Computed as the
 * longest ascending/descending path length through each cell over the inequality DAG (one linear
 * memoised DP, no path enumeration), so the transitive positional bound lands in a single step.
 * Only claims a cut whose justifying run has length ≥ 3 — the length-2 endpoint cut belongs to
 * inequality-forcing, one rung cheaper — which is what makes the chain a distinct tier-3 rung and
 * not iterated forcing. Reads `view.constraints`; inert for sudoku.
 */
function findInequalityChain(view: PuzzleView): Deduction | null {
  const { candidates, constraints, n } = view;
  if (!constraints || constraints.length === 0) return null;
  const size = candidates.length;
  const up: number[][] = Array.from({ length: size }, () => []); // cell → cells that must exceed it
  const down: number[][] = Array.from({ length: size }, () => []); // cell → cells it must exceed
  for (const { greater, lesser } of constraints) {
    up[lesser].push(greater);
    down[greater].push(lesser);
  }
  // Longest ascending path length through `cell` along `adj`, memoised. `seen` breaks any cycle
  // in corrupt/contradictory constraints (a valid futoshiki's inequalities are acyclic) so the
  // DP never spins — a back-edge is treated as a length-1 stop, not recursed.
  const longest = (
    cell: number,
    adj: number[][],
    memo: Int32Array,
    seen: Uint8Array,
  ): number => {
    if (memo[cell] !== 0) return memo[cell];
    if (seen[cell]) return 1;
    seen[cell] = 1;
    let best = 1;
    for (const nxt of adj[cell])
      best = Math.max(best, 1 + longest(nxt, adj, memo, seen));
    seen[cell] = 0;
    return (memo[cell] = best);
  };
  const belowMemo = new Int32Array(size);
  const aboveMemo = new Int32Array(size);
  const belowSeen = new Uint8Array(size);
  const aboveSeen = new Uint8Array(size);

  for (const { greater, lesser } of constraints) {
    for (const cell of [greater, lesser]) {
      const lb = longest(cell, down, belowMemo, belowSeen); // cells at-or-below → value ≥ lb
      const la = longest(cell, up, aboveMemo, aboveSeen); // cells at-or-above → value ≤ n−(la−1)
      const ub = n - (la - 1);
      const elims: Elimination[] = [];
      const because: number[] = [];
      if (lb >= 3) {
        const removed = candidates[cell] & rangeMask(1, lb - 1);
        if (removed) {
          const vals = candidateValues(removed, n);
          elims.push({ cell, values: vals });
          because.push(...vals);
        }
      }
      if (la >= 3) {
        const removed = candidates[cell] & rangeMask(ub + 1, n);
        if (removed) {
          const vals = candidateValues(removed, n);
          elims.push({ cell, values: vals });
          because.push(...vals);
        }
      }
      if (elims.length > 0) {
        return {
          technique: "inequality-chain",
          tier: 3,
          targetCell: null,
          targetValue: null,
          becauseCells: chainComponent(cell, up, down),
          becauseCandidates: [...new Set(because)],
          eliminations: elims,
        };
      }
    }
  }
  return null;
}

/** The connected run a cell sits in (transitive up + down closure) — the cells a chain hint
 *  highlights. For a line of `<`s this is the linear chain; robust to branches and cycles. */
function chainComponent(cell: number, up: number[][], down: number[][]): number[] {
  const cells = new Set<number>([cell]);
  const stack = [cell];
  while (stack.length > 0) {
    const c = stack.pop()!;
    for (const adj of [down[c], up[c]])
      for (const nxt of adj)
        if (!cells.has(nxt)) {
          cells.add(nxt);
          stack.push(nxt);
        }
  }
  return [...cells];
}

// The ladder, cheapest-first. The two inequality rungs (E2) sit at their tiers — forcing with
// the tier-2 all-different eliminations, the chain just under X-wing at tier 3 — and read
// view.constraints, so they are inert for the constraint-free games. The order is the single
// source of "which technique is cheapest" for both the hint and the grade.
const LADDER: ((view: PuzzleView) => Deduction | null)[] = [
  findNakedSingle,
  findHiddenSingle,
  (v) => findNakedSubset(v, 2),
  (v) => findNakedSubset(v, 3),
  findPointing,
  findInequalityForcing,
  findInequalityChain,
  findXWing,
];

/**
 * The centrepiece: the cheapest applicable deduction over the view, or null if the ladder is
 * exhausted (board solved, or stuck beyond R1–R3). Pure — no mutation of the view.
 */
export function findStep(view: PuzzleView): Deduction | null {
  for (const detect of LADDER) {
    const step = detect(view);
    if (step) return step;
  }
  return null;
}

// ── Per-game seam + drivers ─────────────────────────────────────────────────────────────

/**
 * A per-game adapter: the two things the engine can't know without a game. `computeCandidates`
 * is the SELF-COMPUTED basic-elimination substrate (never GAC); `houses`/`n`/`totalCells`/
 * `constraints` are the structure. One adapter builds them all — `techniqueAdapter.ts`,
 * parameterised by `BoardGeometry` (T5-W2 2.5); the two per-game twins are gone.
 */
export interface TechniqueAdapter {
  n: number;
  totalCells: number;
  houses: House[];
  constraints?: Constraint[];
  /** Basic-elimination candidate masks for the current values (row-major). NEVER GAC masks. */
  computeCandidates(values: number[]): Uint32Array;
}

/** The measured difficulty of a dealt board — the honest grade. */
export interface GradeResult {
  /** Highest tier the ladder needed (1–3); 0 if the board needed no step. */
  tier: number;
  /** The hardest technique that fired — the margin signature keys off this. Null if none. */
  hardestTechnique: TechniqueId | null;
  /** True iff the ladder filled every cell using only R1–R3 logic (no search). */
  solved: boolean;
  /** The board after grading (row-major; 0 = still empty). */
  values: number[];
  /** How many ladder steps were applied. */
  steps: number;
}

function normalizeValues(
  values: number[] | Record<string, number>,
  totalCells: number,
): number[] {
  if (Array.isArray(values)) return values.slice(0, totalCells);
  const out = new Array<number>(totalCells).fill(0);
  for (let i = 0; i < totalCells; i++) out[i] = values[String(i)] ?? 0;
  return out;
}

/**
 * Run the ladder to completion and grade: the hardest technique it needed IS the board's
 * honest difficulty. No search — every step is a forced logical deduction, so the loop is
 * bounded (each iteration fills a cell or strictly shrinks a candidate set). A placement
 * re-derives candidates from the adapter (basic elimination over the new values); an
 * elimination is applied to the working candidate array in place.
 */
export function gradeBoard(
  adapter: TechniqueAdapter,
  values: number[] | Record<string, number>,
): GradeResult {
  const board = normalizeValues(values, adapter.totalCells);
  let candidates = adapter.computeCandidates(board);
  let tier = 0;
  let hardestTechnique: TechniqueId | null = null;
  let steps = 0;
  const stepCap = adapter.totalCells * adapter.n + adapter.totalCells; // generous safety net

  for (;;) {
    const view: PuzzleView = {
      n: adapter.n,
      candidates,
      houses: adapter.houses,
      constraints: adapter.constraints,
    };
    const step = findStep(view);
    if (!step) break;
    if (step.tier > tier) {
      tier = step.tier;
      hardestTechnique = step.technique;
    }
    if (step.targetCell !== null && step.targetValue !== null) {
      board[step.targetCell] = step.targetValue;
      candidates = adapter.computeCandidates(board);
    } else {
      for (const elim of step.eliminations) {
        for (const val of elim.values) candidates[elim.cell] &= ~(1 << val);
      }
    }
    if (++steps > stepCap) break; // unreachable on sound detectors; never spin
  }

  return {
    tier,
    hardestTechnique,
    solved: board.every((v) => v !== 0),
    values: board,
    steps,
  };
}

/** A single forced placement from the fill-all-forced sweep. */
export interface ForcedPlacement {
  cell: number;
  value: number;
  technique: "naked-single" | "hidden-single";
}

export interface FillForcedResult {
  /** Every naked+hidden single present on the board, applied in one sweep. */
  placements: ForcedPlacement[];
  /** The board after the sweep (row-major). */
  values: number[];
}

/**
 * Fill-all-forced (the missing middle rung; W8 wires the button, W7 owns this detector):
 * R1's single detector applied to EVERY cell in one sweep — apply every naked and hidden
 * single present on the current board, then stop. No search, no cascade: a cell that only
 * becomes forced *after* this sweep's fills is left for the next press. This is the honest
 * "fill what's forced," distinct from the whole-board solve and the grade-to-completion loop.
 */
export function fillAllForced(
  adapter: TechniqueAdapter,
  values: number[] | Record<string, number>,
): FillForcedResult {
  const board = normalizeValues(values, adapter.totalCells);
  const candidates = adapter.computeCandidates(board);
  const forced = new Map<number, ForcedPlacement>();

  // Naked singles — one candidate left.
  for (let cell = 0; cell < candidates.length; cell++) {
    const mask = candidates[cell];
    if (mask !== 0 && popcount(mask) === 1) {
      forced.set(cell, { cell, value: singleValue(mask), technique: "naked-single" });
    }
  }
  // Hidden singles — a value with exactly one home in a house (skip cells already forced).
  for (const house of adapter.houses) {
    for (let v = 1; v <= adapter.n; v++) {
      const bit = 1 << v;
      let only = -1;
      let count = 0;
      for (const cell of house.cells) {
        if (candidates[cell] & bit) {
          only = cell;
          if (++count > 1) break;
        }
      }
      if (count === 1 && !forced.has(only) && popcount(candidates[only]) > 1) {
        forced.set(only, { cell: only, value: v, technique: "hidden-single" });
      }
    }
  }

  const placements = [...forced.values()];
  for (const p of placements) board[p.cell] = p.value;
  return { placements, values: board };
}

// ── The named hint (lane E3) — the cheapest single, reasoning first ──────────────────────
// The hint UX asks a narrower question than `findStep`: what is the cheapest PLACEMENT the
// board affords right now, so the second press has a digit to ink? Placements come only from
// singles (naked/hidden), so `findHint` returns the cheapest single — preferring the cell the
// user asked about when it is itself forced, else the cheapest single anywhere. Pure; applies
// no eliminations (an honest "the cheapest single on the board as it stands"). Returns null
// when no single is available (the board needs an elimination first) — the caller degrades to
// the answer-key reveal. `"reveal"` is never returned here; the caller constructs it for that
// unnameable fallback so one `HintResult` shape flows to the UI.

/** The named reasoning a hint surfaces: a forced placement, its cells to highlight, its name. */
export interface HintResult {
  /** `reveal` is the caller's unnameable fallback (answer-key), never returned by `findHint`. */
  technique: "naked-single" | "hidden-single" | "reveal";
  /** The cell the digit will ink into. */
  cell: number;
  /** The forced value. */
  value: number;
  /** The cells to highlight in the peek-laminate tone — the cell itself (naked) or the
   *  house the argument turns on (hidden). */
  becauseCells: number[];
  /** For a hidden single, the axis of the justifying house ("row"|"col"|"box") — drives the
   *  copy ("nowhere else in this box"). Absent for a naked single. */
  houseAxis?: string;
}

/** The cheapest hidden single whose only home in some house is `cell`, with its house axis. */
function hiddenSingleForCell(view: PuzzleView, cell: number): HintResult | null {
  const { candidates, houses, n } = view;
  const mask = candidates[cell];
  if (mask === 0 || popcount(mask) <= 1) return null; // filled, broken, or already a naked single
  for (const house of houses) {
    if (!house.cells.includes(cell)) continue;
    for (let v = 1; v <= n; v++) {
      const bit = 1 << v;
      if (!(mask & bit)) continue;
      let count = 0;
      for (const c of house.cells) if (candidates[c] & bit) count++;
      if (count === 1) {
        return {
          technique: "hidden-single",
          cell,
          value: v,
          becauseCells: [...house.cells],
          houseAxis: house.axis,
        };
      }
    }
  }
  return null;
}

/**
 * The cheapest named single to surface as a hint. Prefers `preferredCell` when it is itself a
 * forced single (the hint explains the cell you asked about); otherwise the cheapest single
 * anywhere — naked before hidden. Null when the board affords no single.
 */
export function findHint(
  adapter: TechniqueAdapter,
  values: number[] | Record<string, number>,
  preferredCell?: number,
): HintResult | null {
  const board = normalizeValues(values, adapter.totalCells);
  const candidates = adapter.computeCandidates(board);
  const view: PuzzleView = {
    n: adapter.n,
    candidates,
    houses: adapter.houses,
    constraints: adapter.constraints,
  };
  const asNaked = (cell: number): HintResult => ({
    technique: "naked-single",
    cell,
    value: singleValue(candidates[cell]),
    becauseCells: [cell],
  });

  // 1) The focused cell, when it is itself forced — explain the cell the user asked about.
  if (
    preferredCell !== undefined &&
    preferredCell >= 0 &&
    preferredCell < board.length &&
    board[preferredCell] === 0
  ) {
    if (popcount(candidates[preferredCell]) === 1) return asNaked(preferredCell);
    const hidden = hiddenSingleForCell(view, preferredCell);
    if (hidden) return hidden;
  }

  // 2) The cheapest single anywhere — naked first (board order), then hidden.
  for (let cell = 0; cell < board.length; cell++) {
    if (
      board[cell] === 0 &&
      candidates[cell] !== 0 &&
      popcount(candidates[cell]) === 1
    ) {
      return asNaked(cell);
    }
  }
  for (let cell = 0; cell < board.length; cell++) {
    if (board[cell] === 0) {
      const hidden = hiddenSingleForCell(view, cell);
      if (hidden) return hidden;
    }
  }
  return null;
}

// ── Small structural helpers over a view's houses ───────────────────────────────────────

/** cell → indices of every house containing it. */
function buildCellHouses(view: PuzzleView): number[][] {
  const map: number[][] = Array.from({ length: view.candidates.length }, () => []);
  view.houses.forEach((house, h) => {
    for (const cell of house.cells) map[cell].push(h);
  });
  return map;
}

/** axis → (cell → the single house of that axis containing it). Used by the fish rung. */
function buildCellAxisHouse(view: PuzzleView): Record<string, (number | undefined)[]> {
  const out: Record<string, (number | undefined)[]> = {};
  view.houses.forEach((house, h) => {
    if (house.axis === undefined) return;
    const lane = (out[house.axis] ??= new Array<number | undefined>(
      view.candidates.length,
    ));
    for (const cell of house.cells) lane[cell] = h;
  });
  return out;
}

/** All k-combinations of indices [0, size). Small k (2–3) over small houses — cheap. */
function kSubsets(size: number, k: number): number[][] {
  const result: number[][] = [];
  const combo: number[] = [];
  (function pick(start: number): void {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < size; i++) {
      combo.push(i);
      pick(i + 1);
      combo.pop();
    }
  })(0);
  return result;
}

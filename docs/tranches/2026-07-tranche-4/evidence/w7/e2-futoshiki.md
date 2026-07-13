# T4-W7 E2 — the futoshiki parity (born-RED greps + test output)

Lane E2 of T4-W7. The SAME `techniqueEngine.ts` E1 built now grades futoshiki — a per-game
adapter plus **two appended rungs**, never a second engine. The ladder is unchanged; futoshiki
differs only in its constraint set: rows/cols houses (no boxes) + the printed inequalities, read
as `view.constraints` by the two `inequality-*` detectors.

Files (this lane's entire footprint — zero-wasm gate GREEN):

- `web/frontend/src/games/shared/techniqueEngine.ts` — extended in place: `TechniqueId` +
  `TECHNIQUE_TIER` gain `inequality-forcing` (tier 2) / `inequality-chain` (tier 3); two new
  private detectors (`findInequalityForcing`, `findInequalityChain` + `rangeMask`/`chainComponent`
  helpers) appended to the shared `LADDER`. No new exports — the ladder is still one ladder.
- `web/frontend/src/games/shared/techniqueEngine.test.ts` — three core units for the rungs over
  the abstract view (forcing + inert-without-constraints; chain positional bound; chain leaves
  length-2 cuts to forcing).
- `web/frontend/src/games/futoshiki/technique/futoshikiTechnique.ts` — the futoshiki adapter
  (rows/cols houses + basic all-different `computeCandidates`; `inequalityConstraints`;
  `gradeFutoshiki`/`fillForcedFutoshiki` per-deal API for the composable, twins of the sudoku
  adapter's).
- `web/frontend/src/games/futoshiki/technique/futoshikiTechnique.test.ts` — the futoshiki ladder
  proofs (singles→tier-1, forcing→tier-2, chain→tier-3, each load-bearing), the substrate
  tripwire (futoshiki twin), fill-forced, latency, geometry.

---

## Gate rows — born RED → closed

| Gate | born-RED state | closed |
|---|---|---|
| **futoshiki parity** | `useFutoshiki.ts:266-289` `hintCell` reveals the focused cell from the peek **answer key** — no technique, no name (twin of the sudoku reveal). No futoshiki technique layer anywhere: the grep below returns empty. | The same `techniqueEngine.ts` grades futoshiki via singles + inequality-forcing + inequality-chain; both games driven off one ladder, **no second implementation**. |
| **substrate (over-prune)** | — | The adapter's `computeCandidates` is **basic all-different only**; the tripwire asserts it ≠ the AC-pruned masks on a board where AC over-prunes past the human sequence. |
| **zero-wasm (R1–R3)** | — | This lane's footprint is `games/shared/techniqueEngine.{ts,test.ts}` (extension) + `games/futoshiki/technique/` (new). **No `csp-solver/`, no `wasm/`, no `scripts/`.** |

**futoshiki born-RED grep** — no technique layer for the second game at base SHA:

```
$ grep -rniE 'naked single|hidden single|inequality-forcing|inequality-chain|technique' \
    web/frontend/src/games/futoshiki --exclude-dir=technique
(empty)
```

---

## The ladder — one engine, futoshiki constraint set

The all-different rungs (naked/hidden single, naked pair/triple) apply unchanged to rows/cols;
pointing is naturally silent (rows and cols meet in a single cell, so no second common house);
X-wing applies to futoshiki rows/cols too. The two appended rungs are the futoshiki signature:

- **inequality-forcing (tier 2, the analogue of pointing)** — the endpoint rule: across a printed
  `greater > lesser`, the greater cell can't hold the domain **minimum** (value 1), the lesser
  can't hold the **maximum** (value n). Deliberately the STATIC extreme cut, NOT the neighbour's
  live min/max — live-min forcing iterated to fixpoint is arc-consistency over the `<` path, which
  reaches the full positional bound and would strand the chain rung, collapsing the futoshiki grade
  the same way GAC masks collapse sudoku's. Keeping forcing static makes the chain a **strictly
  stronger, separately-gradeable** technique (the futoshiki twin of X-wing ⊋ pointing).
- **inequality-chain (tier 3)** — a maximal run `a<b<c<…` bounds each cell by position (k-th
  smallest ≥ k). Computed as the longest ascending/descending path length through each cell over
  the inequality DAG (one linear memoised DP, no path enumeration), so the transitive bound lands
  in one step. Only claims cuts whose justifying run is length ≥ 3 — length-2 belongs to forcing,
  one rung cheaper.

Every fixture is carved from **one** 5×5 Latin square (`SOL5`); each solves by **forced** logic
only (singles + forced eliminations never branch), so its solution is unique and equals `SOL5`.
Each REQUIRES its target technique — cheapest-first means `hardestTechnique` is the cheapest rung
with no cheaper alternative at some step, and the `stallsWithout(…)` replay proves the rung is
load-bearing (the twin of E1's `!solvesWithoutXWing`):

| Fixture | inequalities | grade | proof |
|---|---|---|---|
| singles | none | tier-1, naked/hidden single | solves to `SOL5` on singles alone |
| forcing | two isolated `>` (no run of 3) | tier-2, `inequality-forcing` | banning forcing → ladder stalls |
| chain | a<b<c<d on row0 | tier-3, `inequality-chain` (cuts value 4 from cell 1: b<c<d ⇒ b ≤ 3) | banning chain → ladder stalls |

## The corrupted-substrate tripwire (r3 KILL-LIST #3, futoshiki twin) — permanent unit test

`propagateFutoshiki` runs the **root AC-3 fixpoint over BOTH the all-different AND the inequality
constraints** (`csp-solver/wasm/src/futoshiki.rs:318-320` — *"pins them to singleton masks"*) —
strictly stronger than basic all-different elimination, and over-pruned for grading exactly like
sudoku's GAC masks. The tripwire, on the chain fixture (unique solution):

- self-computed candidates `!==` the AC-collapsed masks (the headline assertion);
- empty cells self-computed as **ambiguous** (popcount ≥ 2) while AC pins them to a singleton —
  AC over-prunes past the human sequence (`overpruned > 0`);
- **every** empty cell is a singleton under the AC substrate — a grader reading it sees all singles;
- load-bearing: self-computed grades **tier-3** (needs a chain); reading the AC substrate would
  grade **tier-1** (`findStep` over it returns a naked single).

Fails the instant a rung reads `propagateFutoshiki`'s masks **or** the adapter folds inequality
bounds into `computeCandidates` — the futoshiki version of the over-prune collapse.

## Named-deduction parity — tomwhite/futoshiki-hints (fetch-confirmed, not vendored)

Strategy order (README + source, fetch-confirmed): **RowAndColumnExclusion** (naked-single by
peer elimination) → **RowInclusion** / **ColumnInclusion** (hidden-single in row / col) →
`MinimumRefutationScore` (a Z3 fallback for anything the simple rules can't reach) — *"a hint for
the next simplest step,"* simplest-first. Inequalities are folded into candidate-narrowing
("candidates eliminated from cells on either side of the inequality"). Our ladder matches the
**order** — singles-by-exclusion, then inclusion, then the inequality rungs (endpoint min/max on
either side, then the positional chain) — and refines it by **naming** forcing vs chain as distinct
gradeable tiers rather than bundling them into a solver call. No code vendored.

## Fill-all-forced — futoshiki

R1's detector over every cell in one sweep (W7 owns it; W8 wires the button): fills **exactly**
the naked+hidden-single set (independent re-derivation), all correct and on empty cells; stops with
cells still empty and a second sweep makes more progress (no cascade); a chain board with no basic
single present is left **untouched** (fill-forced never applies an inequality-only deduction).

## Deal-time grade latency — futoshiki fixtures

```
[T4-W7] futoshiki deal-time grade latency (5×5, n=600): mean 0.037ms, worst 0.403ms
```

Sub-millisecond — pure TS, no search, no wasm.

## Full frontend battery — all GREEN

`vue-tsc -b --force` (0 errors) · `test:unit` (**18** files, **175** tests — E1's 158 + 17 new:
14 futoshiki + 3 core inequality) · `lint:eslint` (clean) · `lint:knip` (clean — every export
consumed, games/futoshiki→games/shared boundary respected) · `prettier --check src/` (clean) ·
`build` (built; the technique layer is test-only until E3/W8 wire it, so the bundle is unchanged).

## Zero-wasm gate — GREEN

This lane's diff touches only `web/frontend/src/games/shared/techniqueEngine.{ts,test.ts}` and
`web/frontend/src/games/futoshiki/technique/`. No `csp-solver/`, no `wasm/`, no
`scripts/sync-csp-solver-vendor.sh`, no release. (The `csp-solver/wasm/src/*.rs` edits in the
working tree are lane E4's telemetry getters, not this lane's.)

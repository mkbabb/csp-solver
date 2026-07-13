# T4-W13 — The new games

**"What other games could we support — KISS, with this engine? Crosswords?" (owner, M8).** The census collapses to one engineering fulcrum: an **n-ary arithmetic-cage family (sum + product), two `revise_impl`s** that clear the engine's n-ary-lambda-blindness wall. That one family, plus a *zero-primitive* thermometer insight, names a coherent, minimal, idiom-true expansion — **one wave, two primitives, three games.** Thermo-Sudoku ships FIRST with zero new constraints, precisely to prove W11's `defineGame` contract before the primitives land. Crosswords are answered on the record: **NO**, on two verified walls. And the deep bench is banked with named re-triggers.

**Dependencies**: ← W11 (`defineGame<TBoard,TCell,TClue>` + Rust `PuzzleClass`; Thermo-Sudoku is the contract's first external proof — one `PuzzleClass`, one payload builder, one furniture slot, zero new constraints). Ratified at ballot **B4**. **Effort**: L.

---

## What the engine can express (the load-bearing survey)

Two walls class every candidate (both re-verified verbatim at base SHA):

- **Wall 1 — n-ary lambdas do not propagate.** `constraint/traits.rs:73-79`, the default `revise`: `match self.scope().len() { 1 => unary, 2 => binary, _ => Revision::Unchanged }`. A `LambdaConstraint` (or any `add_constraint` custom) over **3+ variables gets zero domain pruning** — consulted only by `check()` at assignment time. Unary/binary lambdas *do* propagate. So a game whose core clue is a **sum/product over a cage** solves correctly but **searches blind** past the AllDifferent GAC unless it ships a **new devirtualized constraint with a real `revise_impl`**.
- **Wall 2 — u128 domain ceiling.** `domain/bitset.rs:6-13,38` — `bits: u128`, values `0..128`, hard release `assert!(v < 128, …)`. 81-cell grids fit; thousand-word banks overflow.

**What's free for any AllDifferent-family game:** GAC `AllDifferent(Except)` (`constraint/all_different_except.rs:87-104`, the crown jewel), the binary sugar that propagates (`add_less_than`/`add_greater_than`, `csp/mod.rs:82,98`), the uniqueness-checked hole-dig generator (`sudoku/generate.rs:280-317`; clue-placement analog `futoshiki/generate.rs:90-125`), the `propagate*` pencil-marks path, and — for any game that is "an N×N grid of 1..k integer cells" — the **entire shared shell** (`web/frontend/src/games/shared/`: drawer, pencil-marks, undo, stacked/coarse-pointer layout, solve-tally, DigitPad). The per-game addition is only the worker/wasm module (a copy-paste of `sudoku/solver/protocol.ts` + `wasm/src/sudoku.rs:127,205,246`) and placing the extra clue furniture *before* digging.

---

## Scope

### ROW 1 — Thermo-Sudoku FIRST (zero new constraints — the contract proof)

Latin/Sudoku (`create_sudoku_csp`, `csp-solver/src/puzzles/sudoku/csp.rs:11-55` — **have it in full**) + each thermometer = a **chain of `add_less_than`** along the tube (`csp/mod.rs:82`, **binary, propagates**). **NONE** new engine code.

- **The point of shipping it first:** it proves W11's `defineGame` contract with the smallest possible surface — **one `PuzzleClass`** (a Sudoku variant), **one payload builder** (place thermos on increasing runs of the seeded solution, the mirror of `futoshiki/generate.rs:90 place_inequalities`), **one furniture slot** (the bulb+tube SVG in the pencil idiom). If Thermo can't land cleanly on `defineGame`, the contract isn't ready for Killer/KenKen — so Thermo is the gate on the primitives, not merely the easiest game.
- **Generation:** the Sudoku generator verbatim + place thermos on increasing runs before digging. Grid-of-integers → inherits the whole shell. Cost is purely the thermometer furniture.

### ROW 2 — the two cage primitives (past the n-ary wall) · r3 KILL-LIST #2

x2 headlined "one primitive"; r3 CORRECTED it: **name it an n-ary arithmetic-cage family (sum + product), two `revise_impl`s.** Killer needs sum only (one); **full KenKen including product cages needs two** (r3 §x2). Each is a new devirtualized constraint modeled on the existing `revise_impl` precedents (`all_different.rs:50`, `not_equal.rs:29`, `all_different_except.rs:87`) — real bounds-propagation, NOT an n-ary lambda:

- **`CageSum`** — n-ary, target sum, bounds-propagation `revise_impl` (each cell's domain tightened by the residual `target − Σ(others' min/max)`). Serves Killer and the `+` KenKen cages.
- **`CageProduct`** — n-ary, target product, bounds-propagation `revise_impl` (KenKen values are 1..n, no zeros → clean product bounds, r3 confirmed). Serves the `×` KenKen cages.
- Both register through `add_constraint` (`csp/mod.rs:44`) but as **devirtualized enum variants** (`dispatch.rs` / `constraint/mod.rs:12-18`), so `revise` dispatches to their `revise_impl` — clearing Wall 1 for exactly these two shapes.

### ROW 3 — Killer Sudoku (consumes `CageSum`)

Sudoku (`create_sudoku_csp` — have it in full) + per-cage `AllDifferent` within the cage (**have it**) + **`CageSum` = target** (ROW 2). Generation: Sudoku generator verbatim → partition the solution into cages → sum each cage. Grid-of-integers → inherits the whole shell; **cages render as dotted pencil boundaries + a tiny corner sum** — a native fit for the hand-drawn aesthetic, the highest reuse-to-payoff move in the census.

### ROW 4 — KenKen / Calcudoku (second consumer of the same wave)

Latin square (futoshiki's `seed_latin_square`, `futoshiki/generate.rs:68-82`, verbatim) + cages with `+,−,×,÷` targets. **`−`/`÷` cages are 2-cell → binary lambda, propagate free** (Wall-1 binary path); **`+` cages → `CageSum`**, **`×` cages → `CageProduct`** (ROW 2). New board (not 9×9 boxes) but still grid-of-integers → inherits the shell; cages = hand-drawn cage outlines. Ships as the *second consumer of the same primitive wave* as Killer — naming both costs barely more than naming one.

### ROW 5 — crosswords: DECIDED-retire (the owner's explicit question, two walls) · x2 §2

Crossword construction is **two disjoint problems** ([Steinthal, Columbia](http://www.cs.columbia.edu/~evs/ais/finalprojs/steinthal/); [ResearchGate heuristics-vs-constraints](https://www.researchgate.net/publication/2352510_Constructing_Crossword_Grids_Use_of_Heuristics_vs_Constraints)):

- **(a) Grid-fill** — one variable per slot, domain = words of matching length, `AllDifferent` over slots (**have GAC**), each crossing a **binary** letter-match lambda (**propagates**). A clean CSP — **but a real fill draws thousands of words per length-class, overflowing the u128 ceiling** (Wall 2, `bitset.rs:38`). Works only with a ≤128-word curated bank per slot; even then, letters-not-digits strain the pencil-digit idiom and inherit only part of the shared shell.
- **(b) Clue authoring** — "1-Across: Feline companion (3) → CAT" — is **not a CSP at all**; the engine contributes nothing. It is NLP/knowledge; a computer produces only "dry, dictionary-definition-based clues," and the wordplay that defines real crosswords stays human-driven ([Raise Your Game](https://raiseyourgame.com/2016/10/03/crossword-construction/); [arXiv 2205.09665](https://arxiv.org/pdf/2205.09665)). Delivering it needs a bundled clue corpus or an online LLM — **both break the offline-wasm, KISS, engine-native model.**

**DECIDED: retire (rationale: clue authoring is non-CSP/NLP + offline-model violation; grid-fill alone strays from the digit idiom and hits the u128 domain wall).** The owner's question is answered on the record, not silently dropped (M2/M6).

### ROW 6 — the banked bench (named re-triggers, M5)

| Candidate | Fit | Re-trigger |
|---|---|---|
| **Skyscrapers** | Latin + edge visibility count (n-ary; **check-only** lambda correct for small n where GAC keeps search tiny) | tier-2; a visibility `revise_impl` is wanted, or check-only proves too slow past n=6 |
| **Arrow Sudoku** | Sudoku + sum-along-arrow == circle (reuses `CageSum` with a var target) | after Killer/KenKen ship; a further `CageSum` payoff |
| **Kakuro** | white-run `AllDifferent` + run-`CageSum` | the sum primitive exists; the black/white skeleton + uniqueness generation is the real cost |
| **Sandwich Sudoku** | Sudoku + between-1-and-N positional sum (bespoke propagator) | a positional-sum `revise_impl` is justified by demand |
| **Hidato / Numbrix** | var-per-*number*, `AllDifferent` over positions + binary adjacency (both propagate) | dark-horse; the var↔cell model-inversion friction is accepted |

### ROW 7 — DECIDED-retire on the record (poor engine fit / non-CSP)

| Candidate | Rationale | Disposition |
|---|---|---|
| **Binairo / Takuzu** | simple rules, wrong engine — nothing is all-different; needs 2+ new primitives | **retire** |
| **Hitori** | global connectivity is not CSP-friendly; boolean-var model, shading UI not the digit shell | **retire** |
| **Nonograms / Picross** | solvable by line-DP, not the CSP core — leverages none of `csp-solver` | **retire (wrong tool)** |
| **Word search** | no solving problem; uses neither the engine nor the product identity | **retire** |
| **Full clued crosswords** | ROW 5 two-wall rationale | **retire** |

### ROW 8 — `propagate_stratified` disposition (skeleton ledger seed)

The seed asked the lane to confirm disposition — "no consumer... or fold W13 if the cage primitives want it." **Checked: `propagate_stratified` exists nowhere in `csp-solver/` (grep-empty at base SHA).** The two cage primitives are new `revise_impl`s in the `AllDifferent`/`NotEqual` mold (bounds-propagation over a scope), NOT a stratified propagation scheme — they do not want it. **DECIDED: retire the seed** — no consumer, not present in the tree, no evidence of need.

---

## Gates

Verbatim. Born RED wherever the defect is live at this wave's base SHA.

| Gate | Value |
|---|---|
| Headline | Thermo-Sudoku ships on `defineGame` with zero new constraints (one PuzzleClass + payload builder + furniture slot); `CageSum` + `CageProduct` propagate past the n-ary wall; Killer + KenKen deal unique puzzles on the reused generator; crosswords + the poor-fit set carry DECIDED-retire rows; the bench is banked with re-triggers |

Component checks:

| Gate | Value |
|---|---|
| n-ary wall cleared (**born RED**) | today a cage-sum over 3+ vars modeled as a `LambdaConstraint` returns `Revision::Unchanged` — **zero pruning** (`traits.rs:73-79`, verified: `_ => Revision::Unchanged`); a Killer probe would search blind. After: `CageSum.revise_impl` prunes — a Killer cage tightens member domains by the residual, asserted node-count drop vs the lambda baseline. |
| product cage (**born RED**) | today no product constraint exists (`constraint/mod.rs:12-18` set has none); a `×` KenKen cage over 3 cells gets zero pruning. After: `CageProduct.revise_impl` prunes over 1..n values. |
| Thermo contract proof (**born RED**) | today two games exist (sudoku, futoshiki); no `defineGame`-external game. After: Thermo-Sudoku is a `PuzzleClass` + payload builder + furniture slot with **zero** new constraint code — a `git diff` over Thermo touches no `constraint/`. |
| Killer/KenKen uniqueness | every dealt Killer + KenKen board unique by construction (the reused hole-dig reverts any 2nd-solution removal, `generate.rs:307-313`); a `max_solutions:2` sweep is green (rides W2's uniqueness lane). |
| shell inheritance | Thermo/Killer/KenKen mount the shared `games/shared/` shell (drawer, pencil-marks, undo, DigitPad) with no per-game reimplementation; the per-game code is one wasm module + one worker + the furniture. |
| crosswords on record | a DECIDED-retire row with the two-wall rationale exists in the tranche ledger; the poor-fit set (Binairo/Hitori/Nonograms/Word-search) each carry a retire row; the bench each a named re-trigger. |
| correctness | `cargo test --workspace` green; the two new `revise_impl`s carry differential-oracle tests (a brute-force cage check vs the propagator, the `gac_alldiff` pattern). |

**π/DELTA** (the new games are visual):
- **π (Thermo furniture)**: golden capture of a Thermo board — bulb+tube SVG in the pencil idiom; compare against the born-RED state (no such game).
- **π (Killer cages)**: golden capture of dotted pencil cage boundaries + corner sums on a solved-in-progress board.
- **DELTA (game registry)**: before = two games (sudoku, futoshiki); after = Thermo (proving `defineGame`), then Killer + KenKen. One capture per game.
- **DELTA (KenKen board)**: before = none; after = the non-box Latin board with `+,−,×,÷` cage outlines.
- The propagation gates are **measurement gates** — proven by the node-count drop + differential oracle, banked verbatim, not a pixel capture.

## Seeds

- `x/x2-engine-fit.md` — the constraint-primitive survey (§0, both walls anchored), the per-candidate census (§1, effort classes + verdicts), the crosswords two-problem answer (§2), the ranked KISS set (§3, "one wave, one primitive, three games"), every OUR-code anchor (§4), the market citations (§5).
- `r3/r3-expansion-crit.md` §x2 + KILL-LIST #2 — both walls confirmed verbatim; the primitive-count CORRECTION (sum + product = **two** `revise_impl`s, not one; Killer=one, full KenKen=two); crosswords-NO confirmed sound.
- Anchors verified at base SHA: `constraint/traits.rs:73-79` (n-ary wall), `domain/bitset.rs:6-13,38` (u128), `constraint/mod.rs:12-18` (built-in set), `csp/mod.rs:44,54,66,82,98` (sugar), `all_different.rs:50` + `not_equal.rs:29` + `all_different_except.rs:87-104` (`revise_impl` precedents + GAC), `sudoku/csp.rs:11-55` (Killer/Thermo base), `futoshiki/generate.rs:68-82` (Latin seed for KenKen), `sudoku/generate.rs:280-317` (uniqueness hole-dig), `futoshiki/generate.rs:90-125` (clue-placement analog), `wasm/src/sudoku.rs:127,205,246` (worker template), `games/shared/` (the inherited shell). `propagate_stratified` grep-empty (ROW 8).

## Residual risks

- **Thermo is the gate on the primitives, not a warm-up** — it must land cleanly on W11's `defineGame` (one PuzzleClass + payload + furniture, zero new constraint code). If it can't, the contract isn't ready and Killer/KenKen wait. Sequence Thermo → prove → then `CageSum`/`CageProduct`.
- **`CageProduct` bounds-propagation is the harder of the two** — product bounds over 1..n are clean (no zeros) but the residual arithmetic is trickier than sum; the differential oracle (brute-force cage vs propagator) is the born-RED guard. If `CageProduct` slips, KenKen ships `×` cages as check-only (correct, slower) and the propagator banks — Killer + Thermo + KenKen-minus-fast-product still ratify B4's set.
- **B4 ratifies the set** — Thermo + Killer + KenKen recommended; the owner may elect a subset. Thermo alone still proves the contract; Killer alone still lands `CageSum`; the wave degrades gracefully to any prefix.
- **New board geometry for KenKen** — not 9×9 boxes; the shell inherits because it is grid-of-integers, but the board-scene furniture (cage outlines on a non-box Latin grid) is new render. π/DELTA on the KenKen board face.
- **Crosswords stays retired unless the owner overrides** — the two walls (u128 word-bank overflow, non-CSP clue authoring) are verified, not aesthetic; a curated ≤128-word grid-fill-only variant is the only re-trigger, and it strays from the digit idiom. Do not re-litigate without that scope.
- **The two new `revise_impl`s share `gac/`-adjacent hot code** — like every constraint they compile into the lean wasm; re-measure the lean band after they land (the W6/T3 lean-erosion discipline), don't assume neutrality.

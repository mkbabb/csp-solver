# LANE x2-engine-fit — ENGINE-FIT CENSUS

**Mandate rows:** M8 (game-scope expansion, "what other games… KISS, with this engine? Crosswords?"), M10 (distillation). Razor = KISS; law = the pencil idiom; bar = game-agnostic.

**Deliverable:** per-candidate constraint-mapping + generation + UI-fit + effort class + verdict; the ranked KISS set the tranche should *name*; the crosswords answer specifically.

---

## 0. What the engine actually is (the load-bearing survey)

The census hinges on exactly what the solver can express and *propagate*. Read directly from the tree:

### Constraint primitives that exist
`csp-solver/src/constraint/mod.rs:12-18` exports the entire built-in set:
- **`AllDifferent`** — n-ary, devirtualized, GAC (Régin 1994) default-ON (`all_different_except.rs:87-104` shows the ≥4-scope GAC delegation; the plain `AllDifferent` mirrors it). This is the engine's crown jewel.
- **`AllDifferentExcept`** — n-ary all-different with a reusable sentinel value (`all_different_except.rs:37-53`), GAC for scope ≥4.
- **`NotEqual`** — binary, devirtualized (`dispatch.rs:20-24`).
- **`ImplicationConstraint`** — binary implication.
- **`LambdaConstraint`** — the escape hatch: a boxed `Fn(&[Option<Value>]) -> bool` (`lambda.rs:13-19`). **Critical propagation fact below.**

### Builder sugar (`csp-solver/src/csp/mod.rs`)
- `add_all_different` (60), `add_not_equal` (54), `add_equals` (66, unary lambda), `add_less_than` (82, binary lambda), `add_greater_than` (98, binary lambda), `add_constraint` (44, boxes any `Constraint`).

### THE dividing line — n-ary lambdas do not propagate
`constraint/traits.rs:73-79`, the default `revise`:
```
match self.scope().len() {
    1 => revise_unary_default(...),
    2 => revise_binary_default(...),
    _ => Revision::Unchanged,      // n-ary custom/lambda: NO pruning
}
```
A `LambdaConstraint` (or any `add_constraint` custom) over **3+ variables gets zero domain pruning** — it is only consulted by `check()` at full/partial assignment time (`dispatch.rs:52-59`). Unary and binary lambdas *do* propagate (arc-consistency via `revise_unary/binary_default`). **This is the single fact that classes every candidate below:**
- A game whose clues are **unary or binary** relations → expressible with existing sugar, propagates, near-free (S).
- A game whose core clue is **n-ary** (a sum over a cage, a visibility count over a line, a cardinality over a line, a "straight" over a run) → a `LambdaConstraint` will *solve correctly but search blind* past the AllDifferent GAC. For small n it may be acceptable; for real sizes it needs a **new devirtualized constraint with a real `revise_impl`** (the effort tax). No native SUM / arithmetic / cardinality / GCC / regular / table constraint exists.

### Domain ceiling
`domain/bitset.rs:6-8,38` — `BitsetDomain` is a **u128**; values `0..128`, hard release-`assert!`. So any game whose variable domain exceeds 128 candidates (large word banks; >128-cell path grids) overflows the only production domain. 81-cell grids fit; thousand-word crossword banks do not.

### Optimization surface
COP / branch-and-bound with cost domains exists (`solver/optimize.rs`, `config.rs:43 OptimizationMode`) but it's the bbnf-assignment consumer's; puzzles run `Feasibility` only. Not needed by any candidate here — noted so the census doesn't reach for it.

### What `src/games/shared` already gives (the game-agnostic layer — audited)
`web/frontend/src/games/shared/`:
- `types.ts:10,15` — shared `SolveState` state machine (`idle|solving|solved|failed|error`) + `SolveStats` payload, both games re-export.
- `usePencilMarks.ts:21`, `useUndoHistory.ts:18`, `useControlsDrawer.ts:388`, `useStackedLayout.ts:20`, `useAnswerKeyPeek.ts:25`, `useCoarsePointer.ts:22`, `useButtonAnimation.ts:3`, `solveTally.ts:12` (`formatSolveTally`), `DigitPad.vue`, `DrawerTab.vue`, `scene.css`, `constants.ts`.
- **What's genuinely reusable for a new game:** the drawer choreography, pencil-marks store, undo history, stacked/coarse-pointer layout, the solve-tally stat-line, the digit pad — all game-agnostic *provided the new game is a grid of integer cells with pencil-mark candidates*. That's the true architecture bar: **a new game that is "an N×N (or run/region-partitioned) grid of 1..k integer cells" inherits the entire shell for free.** A game that isn't (binary shade-state, letters, path-of-numbers-across-cells) pays to re-fit the shell.

### Worker protocol (per-game, flat buffers)
`sudoku/solver/protocol.ts` + `futoshiki/…` — `solve`/`generate`/`propagate`/`ping` over flat `Uint32Array`; wasm surface `solveSudoku`/`generateSudoku`/`propagateSudoku` (`wasm/src/sudoku.rs:127,205,246`) and the Futoshiki twin (`wasm/src/futoshiki.rs:206,281,308`). A new game adds one wasm module + one worker; the protocol shape is a copy-paste template. `propagate*` (root AC-3/GAC → per-cell candidate masks) is the pencil-marks engine and is **free for any AllDifferent-based game.**

### Generation is a solved recipe (reusable verbatim)
Both games use the identical pipeline (`sudoku/generate.rs:260-317`, `futoshiki/generate.rs:246-257`):
seed a full solution by solving an empty board with a shuffled first row → hole-dig in random order → keep a hole only if `max_solutions:2` still returns exactly one solution. **Any AllDifferent-family game inherits this uniqueness-checked generator unchanged** — the only per-game addition is placing the extra clue furniture (inequalities for futoshiki; cages/thermos/clues for a new game) *before* digging, exactly as `futoshiki/generate.rs:90 place_inequalities` does.

---

## 1. Per-candidate census

Effort classes fold **engine** (new constraint code) + **generation** + **UI/pencil fit**. S = days, reuses everything; M = a new devirtualized constraint or new board UI; L = multiple new primitives or a paradigm the shell doesn't fit.

| # | Candidate | Core constraint mapping | New engine code | Generation | UI / pencil + shell fit | Effort | Verdict |
|---|-----------|-------------------------|-----------------|-----------|--------------------------|--------|---------|
| 1 | **Thermo-Sudoku / Thermometers** | Latin/Sudoku (AllDifferent — **have it**) + each thermo = a **chain of `add_less_than`** along the tube (`csp/mod.rs:82`, **binary, propagates**) | **NONE** | Sudoku generator verbatim + place thermos on increasing runs of the solution (mirror of `place_inequalities`) | Grid-of-integers → **inherits the whole shell**. Cost is drawing the bulb+tube SVG in the pencil idiom | **S** | **NAME IT.** Zero new constraint types; the KISS-est possible expansion; proves the "variant" architecture |
| 2 | **Killer Sudoku** | Sudoku (`create_sudoku_csp` — **have it in full**) + per-cage: AllDifferent within cage (**have it**) + **cage-SUM = target** (n-ary, **new**) | **ONE** primitive: an n-ary sum constraint with bounds propagation (`revise_impl`) | Sudoku generator verbatim → partition solution into cages → sum each cage | Grid-of-integers → **inherits the whole shell**; cages = dotted pencil boundaries + tiny corner sum (**excellent** hand-drawn fit) | **M** | **NAME IT.** Maximal reuse; the one new primitive is the highest-leverage move in the whole census |
| 3 | **KenKen / Calcudoku** | Latin square (AllDifferent — **have it**) + cages with +,−,×,÷ targets. −/÷ cages are **2-cell → binary lambda, propagate**; +/× cages are n-ary → the **same sum primitive** (+ a product twin) | Shares #2's arithmetic primitive (sum + product); binary −/÷ free | Latin-square seed (futoshiki's `seed_latin_square` verbatim) → partition into cages → assign op+target | New board (not 9×9 boxes) but still grid-of-integers → **inherits the shell**; cages = hand-drawn cage outlines (**excellent** fit) | **M** | **NAME IT.** Delivered by the same arithmetic-cage primitive as Killer — the two are one engine wave |
| 4 | **Hidato / Numbrix** | Var per *number* 1..N, domain = cell indices; **AllDifferent over positions** (**have it**) + "k and k+1 adjacent" = **binary** position-adjacency lambda (**propagates**) | none (both constraints exist/binary) — but a bespoke *var-per-number* model, not var-per-cell | Generate a Hamiltonian-ish path → blank numbers with the uniqueness check | Domain = up to 81 cells (**fits u128**); numbers-in-cells renders in the idiom; but the *var↔cell* inversion means the pencil-mark/propagate wiring is bespoke | **S–M** | **Dark horse — bank it.** Genuinely good engine fit (both constraints propagate); the model inversion is the only friction |
| 5 | **Skyscrapers** | Latin square (AllDifferent — **have it**) + edge clue = "# of left-to-right maxima in the line == k" (**n-ary, no native**) | a visibility propagator (or accept **check-only** lambda: correct, and for n≤6 the AllDifferent GAC keeps search small) | Latin-square seed → compute all edge clues from the solution → drop clues keeping uniqueness (**trivial — clues derive from the full grid**) | Grid-of-integers + border clue numbers → **inherits the shell**; clean pencil fit | **M** (S if check-only accepted at small n) | **Reachable — tier 2.** Best "no new primitive if you tolerate check-only" candidate |
| 6 | **Kakuro** | Each white run = AllDifferent (**have it**) + run-SUM = clue (**the #2 sum primitive**) | reuses #2's sum primitive | Harder: design black/white skeleton + clues with uniqueness (no simple Latin seed) | Black cells w/ split diagonal clue triangles — **weaker** pencil fit; not a full grid → partial shell fit | **M–L** | **Bank behind #2.** Unlocked by the sum primitive but the structure/generation is the real cost |
| 7 | **Str8ts** | Row/col no-repeat among white cells (AllDifferent-ish) + each compartment is a **"straight"** (consecutive set, **n-ary, new**) | a straight/consecutive-set constraint | Latin-ish seed + compartment layout + uniqueness | Black/white split cells; grid-of-integers-ish → partial shell fit | **M–L** | **Bank.** One more n-ary primitive for one game — lower leverage than sum |
| 8 | **Sandwich Sudoku** | Sudoku (**have it**) + clue = sum of digits *between* the 1 and the N in a line (**n-ary + positional, specialized**) | a bespoke positional-sum propagator (hard) | Sudoku generator + derive clues from solution | Grid-of-integers → shell fits; border clues | **M–L** | **Bank / low.** Niche; the propagator is harder than plain sum for one game |
| 9 | **Arrow Sudoku** | Sudoku (**have it**) + sum along arrow == circle value (**n-ary sum, = #2 primitive**) | reuses #2's sum primitive (with a var as the target) | Sudoku generator + place arrows on the solution | Grid-of-integers → shell fits; arrow SVG in idiom | **M** | **Bank behind #2.** Another sum-primitive payoff, after Killer/KenKen |
| 10 | **Binairo / Takuzu** | Binary grid; **equal count of 0/1 per line** (cardinality, n-ary, none), **no 3-in-a-row** (ternary, no propagation), **rows/cols unique** (AllDifferent over *tuples*, **not expressible** — vars are cells) | 2+ new primitives; the crown-jewel AllDifferent **does not apply** | bespoke | binary shade grid; grid-of-integers-ish but domain {1,2} | **L** | **Retire (poor fit).** Simple rules, wrong engine — nothing here is all-different |
| 11 | **Hitori** | Shade cells so unshaded have no line-duplicate + shaded non-adjacent + **unshaded connected** (global reachability) | connectivity is not CSP-friendly; boolean-var model | bespoke | shading UI, not the digit shell | **L** | **Retire (poor fit).** Connectivity breaks the model |
| 12 | **Nonograms / Picross** | Per-line run-length clue = a **regular/automaton (DFA) constraint** | a regular-constraint or a bespoke line-DP solver — **not this engine's shape** | bespoke | binary fill grid, not the digit shell | **L** | **Retire (wrong tool).** Solvable, but by line-DP, not the CSP core — it would leverage none of csp-solver |
| 13 | **Word search generation** | Place words greedily + fill random letters | none — there is **no solving problem** (finding words is trivial) | greedy | not a logic puzzle; letters not digits | — | **Retire.** Uses neither the engine nor the product identity |
| 14 | **Fill-in / Kriss-Kross (word placement)** | Var per slot, domain = words of that length; **AllDifferent over slots** (**have it**) + intersection = **binary** letter-match lambda (**propagates**) | none — but **domain ceiling**: >128 candidate words per slot overflows u128 (`bitset.rs:38`) | needs a curated ≤128-word bank + grid skeleton | letters not digits — pencil idiom is a *stretch*; partial shell fit | **M** (+ domain wall) | **Bank / low.** CSP-clean for *small curated banks* only; strays from the digit idiom |
| 15 | **Clued crosswords (NYT-style)** | **See §2 — the owner's explicit question. Split into two species.** | — | — | — | — | **NO (as a product).** |

---

## 2. The crosswords answer (owner asked "Crosswords?" — M8)

**Crossword construction is two disjoint problems, and the literature treats them as separate** ([Steinthal, Columbia CS](http://www.cs.columbia.edu/~evs/ais/finalprojs/steinthal/); [ResearchGate: heuristics vs constraints](https://www.researchgate.net/publication/2352510_Constructing_Crossword_Grids_Use_of_Heuristics_vs_Constraints)):

**(a) Grid-fill — place words into a skeleton given a word list.** This *is* a CSP and maps onto our engine cleanly: one variable per slot, domain = words of matching length, `AllDifferent` over slots (each word used once — **we have GAC AllDifferent**), and each crossing is a **binary** "slot A's i-th letter == slot B's j-th letter" lambda (**binary → propagates**). The rub is our **u128 domain ceiling** (`bitset.rs:38`): a real fill draws from thousands of words per length-class, which overflows a 128-value bitset. It works only with a **small curated bank** (≤128 words/slot). Even then, letters-not-digits strains the pencil-digit idiom and inherits only part of the shared shell. Effort **M**, and it is a genuine departure from the product's identity.

**(b) Clue authoring — write "1-Across: Feline companion (3) → CAT".** This is **not a CSP at all** and the engine contributes **nothing**. It is an NLP/knowledge task; the literature is explicit that a computer can only produce "dry, dictionary-definition-based clues," while the wordplay that defines real crosswords "can't be written by a computer" and remains human-driven ([Raise Your Game](https://raiseyourgame.com/2016/10/03/crossword-construction/); [arXiv 2205.09665, automated crossword solving](https://arxiv.org/pdf/2205.09665)). Delivering it would require either a bundled clue corpus or an online LLM — both of which **break the offline-wasm, KISS, engine-native model** the whole product is built on.

**Verdict on crosswords: NO for the tranche.** The honest KISS reading: the *grid-fill* is a modest CSP fit but only with a bounded curated bank and at the cost of the digit/pencil idiom and half the shared shell; the *clues* — the thing that makes it a crossword — are entirely outside the engine and outside the offline model. Recommend an explicit **DECIDED: retire (rationale: clue authoring is non-CSP/NLP + offline-model violation; grid-fill alone strays from the digit idiom and hits the u128 domain wall)** row so the owner's question is answered on the record rather than silently dropped (M2/M6 forbid the silent drop).

---

## 3. The ranked KISS set the tranche should NAME

The census collapses to **one engineering fulcrum: a single new n-ary arithmetic-cage constraint (sum, with a product twin) that carries real bounds-propagation** (`revise_impl`, so it clears the §0 n-ary-lambda-blindness wall). That one primitive, plus the *zero-primitive* thermo insight, names a coherent, minimal, idiom-true expansion:

1. **Thermo-Sudoku / Thermometers (S)** — **zero new constraint types.** Chains of the existing `add_less_than` over the Sudoku (or bare Latin-square) machinery. The KISS-est possible new game; it proves the "variant of an existing board" architecture with *no* engine change. Cost is purely the thermo SVG in the pencil idiom.
2. **Killer Sudoku (M)** — reuses `create_sudoku_csp` and GAC AllDifferent **in full**; adds the **one** new primitive (cage-sum). Cages render as dotted pencil boundaries — a native fit for the hand-drawn aesthetic. Highest reuse-to-payoff ratio in the census.
3. **KenKen / Calcudoku (M)** — Latin square (free) + the **same** arithmetic primitive (sum + product; −/÷ are free binary lambdas). Ships as the *second consumer of the same wave* as Killer, so naming both costs barely more than naming one.

**One wave, one primitive, three games** (thermo needs zero; killer + kenken share the arithmetic-cage constraint). That is the tranche-shaped, KISS-honest recommendation.

**Banked behind them (named re-triggers, per M5):** Skyscrapers (tier-2, S–M — the "check-only if small-n" candidate), Arrow Sudoku + Kakuro + Sandwich (all further payoffs of the *same* sum primitive), Hidato/Numbrix (dark-horse, good binary fit, model-inversion friction).
**Retire on the record (DECIDED rows):** Binairo, Hitori, Nonograms, Word-search, full Crosswords — each with the rationale above (wrong engine shape, or non-CSP, or not a solving product).

---

## 4. Anchors (OUR code) — every structural claim

- n-ary lambda no-propagation dividing line: `csp-solver/src/constraint/traits.rs:73-79`.
- Built-in constraint set: `csp-solver/src/constraint/mod.rs:12-18`; dispatch `constraint/dispatch.rs:19-24,52-75`.
- Binary/unary sugar that *does* propagate: `csp-solver/src/csp/mod.rs:54,66,82,98`.
- GAC AllDifferent(Except): `csp-solver/src/constraint/all_different_except.rs:87-104`; GAC core `solver/gac/mod.rs`.
- Domain u128 ceiling (128-value cap, release assert): `csp-solver/src/domain/bitset.rs:6-8,38,56`.
- COP surface (unused by puzzles): `csp-solver/src/solver/optimize.rs:1-45`, `config.rs:43`.
- Sudoku CSP fully built (Killer/Thermo/Arrow base): `csp-solver/src/puzzles/sudoku/csp.rs:11-55`.
- Futoshiki inequality mapping (binary `add_greater_than`): `csp-solver/src/puzzles/futoshiki/csp.rs:132-167`.
- Latin-square seed reusable by KenKen: `csp-solver/src/puzzles/futoshiki/generate.rs:68-82`.
- Uniqueness-checked hole-dig generator (reused verbatim by any AllDiff game): `sudoku/generate.rs:280-317`; clue-placement analog `futoshiki/generate.rs:90-125`.
- Shared game-agnostic shell: `web/frontend/src/games/shared/{types.ts:10,15,usePencilMarks.ts:21,useControlsDrawer.ts:388,useUndoHistory.ts:18,useStackedLayout.ts:20,useAnswerKeyPeek.ts:25,solveTally.ts:12,DigitPad.vue,DrawerTab.vue}`.
- Per-game worker/wasm template: `sudoku/solver/protocol.ts`; wasm `csp-solver/wasm/src/sudoku.rs:127,205,246` + `futoshiki.rs:206,281,308`.

## 5. Citations (market)
- Killer/KenKen/Kakuro as Latin-square + cage CSPs: [math-toolbox KenKen/Calcudoku](https://math-toolbox.com/2020/12/10/kenken-calcudoku-cool-math-latin-squares/); [Killer Sudoku as a CSP (Davies)](https://info.bb-ai.net/student_projects/project_reports/Henry-Davies-Killer-Sudoku.pdf); [generic sudoku/killer/kenken/futoshiki/kakuro solver (rich-newman)](https://github.com/rich-newman/sudoku-killer-kenken-futoshiki-kakuro-solver) — real-world evidence one engine spans exactly this family.
- Crossword = two problems (grid-fill CSP vs clue-authoring human/NLP): [Steinthal, Columbia](http://www.cs.columbia.edu/~evs/ais/finalprojs/steinthal/); [ResearchGate heuristics-vs-constraints](https://www.researchgate.net/publication/2352510_Constructing_Crossword_Grids_Use_of_Heuristics_vs_Constraints); [Raise Your Game — clue writing stays human](https://raiseyourgame.com/2016/10/03/crossword-construction/); [arXiv 2205.09665](https://arxiv.org/pdf/2205.09665).
- Puzzle-type landscape: [logic-puzzles-online, 46 types](https://logic-puzzles-online.com/blog/japanese-logic-puzzles/).

**family_hint:** `engine-fit-census` (expansion/research lane — no defects; feeds tranche authoring).

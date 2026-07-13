# Lane x3 — Hint truth + the better-hint design

Report for tranche-IV formulation. NO source edits made; audit + design + spec only.
Answers the owner's M9 sub-question verbatim: **"Better hints (what are our hint heuristics?)"** and **"better game quality with heuristics that are displayed."**

---

## Part (a) — AUDIT: what the hint IS today (the precise answer to "what are our hint heuristics?")

### Short answer, for the owner
**We have no hint heuristics.** Not one. What we call a "hint" is a **single-cell reveal copied out of the fully-solved answer key.** There is zero notion of a solving *technique* — no naked single, no hidden single, no pair/pointing/X-wing — anywhere in the solver, the wasm surface, or the frontend. The board never tells the player *why* a cell is what it is; it just writes the answer in. Likewise, "difficulty" is a **static bucket label the user picks from a dropdown**, graded once at template-bake time by raw solver **backtrack count** — never re-measured for the board on screen, never displayed as a technique signature.

### The three affordances, at anchors

**1. Hint = reveal-from-solved-solution (one cell).**
`web/frontend/src/games/sudoku/composables/useSudoku.ts:250-275` (`hintCell`) — twin at `web/frontend/src/games/futoshiki/composables/useFutoshiki.ts:245-268`.
- It calls `peekSolution()` (`useSudoku.ts:231-243`), which runs `api.solveBoard(givensOnly, …)` on the **pristine givens** (not the player's current marks), caches the full solution per `boardGeneration`, and returns it.
- Then `const val = solution[key]; values.value[key] = val` — it copies the answer-key digit for the focused cell into the board, tags it in `solvedValues` so it renders in solver-ink tone, and routes it through the reveal draw-in animation (`useSudoku.ts:262-269`).
- Header comment is explicit: *"the hint IS a one-cell solve reveal"* (`useSudoku.ts:264`). No reasoning, no technique, no penalty, no undo entry.

**2. Peek = hold-to-peek full answer-key laminate.**
`web/frontend/src/games/shared/useAnswerKeyPeek.ts:25-76`. Hold (or `K`) lays a read-only laminate of the **entire** solution over the board; release lifts it. Never mutates `values`. Same `peekSolution()` full-solve underneath. It is a whole-answer flash, not a hint.

**3. Pencil marks = propagate-only candidate masks (the closest thing we have to reasoning).**
`web/frontend/src/games/shared/usePencilMarks.ts` + `useSolver.ts:217-227` (`propagateBoard`) → wasm `propagate_sudoku` (`csp-solver/wasm/src/sudoku.rs:205-237`).
- Runs the solver's **root AC-3/GAC to a fixpoint, zero search**, returns each empty cell's surviving-candidate **bitmask**.
- Rendered as small candidate digits **only while the peek gesture is held** (`usePencilMarks.ts:60-78`), and only where propagation actually bit (`cand.length > 0 && cand.length < bs`, line 75) — a full-domain cell is suppressed as noise.
- Header calls out the spoiler problem (`usePencilMarks.ts:5-9`, `sudoku.rs:186-188`): at full GAC strength **most served boards collapse to all-singleton domains**, so the mask for many cells already IS the answer. That's why marks are gated behind the peek, not ambient.
- **This is the raw material for real hints** — a per-cell candidate set — but today it's just drawn, never *reasoned over* or *named*.

### What the difficulty grader actually measures (and where, and how it's shown)

- **Metric:** raw **backtrack count** under a Forward-Checking + FailFirst solve. `csp-solver/src/puzzles/sudoku/generate.rs:50-61` (`measure_difficulty` → `csp.stats().backtracks`).
- **When:** at **template-generation time only** (the `generate_templates` example binary), which sorts puzzles into `data/sudoku_puzzles/{N}/{easy|medium|hard}/` directories. Bands at `generate.rs:156-165`: **Easy `(0,0)`, Medium `(1,MAX)`, Hard `(100,MAX)` — and only for N=3** (`generate.rs:157-159` early-returns `(0,MAX)` for other sizes, i.e. no grading at all for 4×4 or 16×16).
- **At runtime:** difficulty is **not measured**. The dropdown (`EASY/MEDIUM/HARD`) is a **bucket selector** — `getRandomBoard` just picks a pre-baked puzzle from the matching directory (`useSolver.ts:147-170`). The board on screen carries no live grade.
- **What IS shown:** after a *full* solve, a margin stat-line — `solveTally.ts:13-21` — renders `"128 backtracks — 42ms"` from `SolveStats {backtracks, solutionCount, elapsedMs}` (`shared/types.ts:15-19`). That is a **machine-effort readout, not a human-difficulty grade**, and it only appears after the user presses Solve (never for the puzzle as dealt). Backtracks under a machine's MRV search correlate weakly-to-negatively with *human* difficulty — the literature is explicit that clue count and backtrack count are poor difficulty proxies; the hardest-technique-required is the accepted metric ([arXiv 1403.7373](https://arxiv.org/pdf/1403.7373)).

### What partial-solving exists today
- **Full solve** (`solve()`, `useSudoku.ts:181-224`): fills *every* empty cell from a search solution. All-or-nothing.
- **One-cell reveal** (`hintCell`, above).
- **Propagate-only masks** (pencil marks, above) — computed but only rendered, never applied.
- **There is NO middle rung**: no "fill all forced cells," no "apply one logical step," no "propagate and stop." The jump is one cell → the whole board.

### The wasm surface's latent capacity (spec-critical for part b)
- `SudokuSolveResult` (`csp-solver/wasm/src/sudoku.rs:56-111`) exposes `solved / solutionCount / n / solutions / backtracks / budgetExceeded`.
- **The Rust `SolveStats` already computes more than wasm exposes:** `csp-solver/src/config.rs:107-118` has `backtracks`, **`nodes_explored`**, **`propagations`**, `budget_exceeded` — but the wasm getter surfaces **only `backtracks`** (`sudoku.rs:86-90`). `nodes_explored` and `propagations` are computed every solve and thrown away at the boundary.
- **No technique-level trace exists anywhere.** Propagation carries a *constraint*-level "blame" signal on wipe-out (`propagate.rs:1-6,15-17` — `Some(constraint_id)`), but nothing labels a deduction as "naked single in r3c4" or "hidden single 7 in box 2." The information to *derive* those labels is present (candidate masks per cell, house structure), but the solver never emits it as events.

**Family hint:** `hint-is-answer-reveal` (mechanism: reveal copied from a full solve; no logical technique anywhere in the stack) · `difficulty-is-node-count` (mechanism: grade = machine backtracks at bake time, not human technique tier, not shown live).

---

## Part (b) — DESIGN: the technique-grade system

Owner's bar: **KISS is the razor, pencil idiom is the design law, game-agnostic is the architecture bar.** The design below is a ladder — each rung is independently shippable, ordered by value-per-effort, and stops well before the cost cliff.

### The core architectural move (shared by every rung): a **technique engine** over the candidate masks we already compute
The market consensus is unambiguous: real hints and honest difficulty both come from a **human-technique solver** that applies logic strategies in ascending order and records which fired ([St. Olaf Sudoku Assistant](https://www.stolaf.edu/people/hansonr/sudoku/explain.htm); [SudokuWiki strategy ladder](https://www.sudokuwiki.org/x_wing_strategy); [arXiv 1403.7373 §difficulty-by-technique](https://arxiv.org/pdf/1403.7373)). We already have the substrate — `propagateBoard` hands us every cell's candidate bitmask. A technique engine is a **pure function over `(candidateMasks, houses)`** that returns the *cheapest applicable deduction* plus its *name* and *cells involved*. It is game-agnostic by construction: sudoku and futoshiki differ only in their constraint set (houses vs. rows/cols+inequalities), and the engine consumes an abstract `{cells, candidates, constraints}` view.

**Key design decision — where the engine lives:**
- **Option A (recommended, KISS): a TypeScript technique engine in the frontend**, reading the wasm `propagateBoard` masks. Naked/hidden singles, pairs/triples, pointing/box-line, and even X-wing are *cheap* to detect over a candidate-mask array — tens of lines each, no search. Keeps the reasoning in the layer that renders it, needs **zero wasm/Rust changes** for rungs 1-4, no `csp-solver` release, no cross-repo sync. The wasm stays the oracle for the *answer* (validation) and the masks (raw material).
- **Option B (only if a rung demands it): a `csp-solver` 0.5.0 trace API.** Spec'd below, but the ladder is built so **Option A carries rungs 1-4** and Option B is needed **only** for the hardest, chaining techniques (rung 5) where re-deriving state in JS gets fiddly. Do not pay for B until a rung actually needs it.

### The sudoku technique ladder (ascending difficulty = the honest grade)

| Tier | Technique | Detection over masks | Effort | Rung |
|---|---|---|---|---|
| 1 | **Naked single** — cell with one candidate | `popcount(mask)==1` | trivial | R1 |
| 1 | **Hidden single** — candidate v appears in one cell of a house | per house, count cells with bit v | trivial | R1 |
| 2 | **Naked pair/triple** — k cells in a house share k candidates | subset scan within house | small | R2 |
| 2 | **Pointing pair / box-line** — candidate confined to one line within a box (and vice-versa) | intersect box ∩ line candidate positions | small | R2 |
| 3 | **X-wing** | 2 rows where v sits in same 2 cols ⇒ eliminate elsewhere in cols | moderate | R3 |
| 4 | **Swordfish / XY-wing / coloring** | 3-line / chain patterns | higher | banked (R5/retire) |

The **hardest technique the engine had to apply to fully solve the dealt board = that board's honest difficulty grade** — this replaces the backtrack-count bucket. It is the accepted metric ([arXiv 1403.7373](https://arxiv.org/pdf/1403.7373); [Logic Loft technique tiers](https://www.logicloftgames.com/blog/sudoku-solving-techniques/)).

### The futoshiki equivalents (game-agnostic engine, futoshiki constraint set)
- **Naked/hidden singles** — identical (fall straight out of the same mask scan; futoshiki already ships `propagateBoard` with inequalities, `useFutoshiki.ts:274`).
- **Inequality-forcing (min/max pruning)** — a cell on the "greater" end of a chain cannot hold the minimum of its remaining domain; the "lesser" end cannot hold the maximum. This is futoshiki's signature deduction and its analogue of pointing.
- **Inequality chains** — a run `a<b<c<d` bounds each cell by its position in the chain (the k-th smallest ≥ k); the futoshiki analogue of the row/col all-different tightening.
- **Sandwich forcing** — a cell bracketed `x < cell < y` where x,y are near-determined collapses the middle. Analogue of the naked pair.

The futoshiki propagation the wasm already does (`csp-solver/wasm/src/futoshiki.rs` propagate path) encodes the inequality constraints, so the candidate masks *already reflect* inequality pruning — the TS engine only needs to *name* which rule fired, not re-implement the pruning.

### Explanation-grade hints (the "displayed heuristics" the owner asked for)
Each engine deduction returns `{technique, targetCell, becauseCells, becauseCandidates}`. The hint UI, in the pencil idiom:
1. **Draws the reasoning, not the answer first.** Instead of ink-stamping the digit (today's `hintCell`), highlight the `becauseCells` in the peek-laminate tone, write the technique name in the **margin** (the existing `MarginNote`/`solveTally` slot — same home the stat-line uses, `solveTally.ts`), e.g. *"naked single — only 4 fits here"* or *"hidden single — 7 goes nowhere else in this box."* Then, on a second press, ink the digit in.
2. **One grammar, existing animations.** The reveal draw-in (`useSudoku.ts:262-269`) and the peek-laminate highlight are both already built; the hint becomes *highlight-because-cells → name-in-margin → optional-reveal*. No new timing constants (matches the W13 "one grammar" discipline).
3. **Progressive:** first press names the technique + region; second press fills. Mirrors [step-by-step hint apps](https://www.stolaf.edu/people/hansonr/sudoku/explain.htm) but in our pencil-margin voice.

### Partial solving as a facility (the missing middle rung)
Two new, cheap, game-agnostic operations, both pure over masks:
- **"Fill all forced" (one-step):** apply every naked+hidden single currently on the board in one animated sweep, stop. No search. This is the natural product of R1's engine — the same detector, applied to all cells instead of one.
- **"Propagate & stop" (already have the data):** promote today's peek-gated pencil marks to a *toggleable, persistent* candidate overlay (a "notes" mode every serious sudoku app ships). The masks are already computed; this is a UI gate change, not new compute.

### Displayed quality heuristics (grade honestly from the trace, not node counts)
- Replace the dealt-board's static bucket label with the **technique signature**: the board's difficulty card reads *"hardest step: X-wing"* or *"solvable with singles only,"* derived by running the engine to completion at deal time. This is the owner's "better game quality with heuristics that are displayed" (M9), done right.
- **Keep** the post-solve `backtracks — ms` stat-line (`solveTally.ts`) — it's an honest *machine-effort* readout; just stop implying it's *difficulty*. Re-label its intent (engineering telemetry vs. player-facing grade).
- **The generator's grade must move to technique-tier too:** `measure_difficulty` (`generate.rs:51`) should grade by "hardest technique the human-solver needed," not backtrack count — this fixes the N=3-only, machine-metric grading at the source. (A generator-side wave; the runtime engine can front-run it by grading dealt boards live.)

### The csp-solver 0.5.0 trace API delta (spec — needed ONLY for rung 5)
If/when chaining techniques (swordfish, XY-wing, coloring) are wanted and TS re-derivation gets unwieldy, expose a propagation trace from the crate:
- **New wasm export** `explainStep(board, n, constraints) -> DeductionEvent` returning `{technique: enum, target_var, target_val, because_vars: Vec<u32>, because_vals: Vec<u32>}` — the single cheapest logical step, no search.
- **Rust side:** a new `csp_solver::explain` module running the human-technique ladder over the propagated domains, emitting a typed `Deduction`. The candidate masks and house/constraint adjacency it needs already exist (`domain_masks`, `Adjacency`); the constraint-level blame signal (`propagate.rs`) is a starting hook but must be *lifted to technique granularity* (blame today names a constraint, not a strategy).
- **Free win, do regardless:** surface the already-computed `nodes_explored` and `propagations` from `SolveStats` (`config.rs:109-110`) through the wasm getters (`sudoku.rs:86-90` currently drops them) — a two-getter addition, no new compute, richer honest telemetry.
- This is a **clean-break additive API** (new module, new exports) — no aliases, no dual paths; consistent with M2.

### Feasibility + effort + KISS ordering (the rung dispositions)

| Rung | Deliverable | Where | Effort | Wasm/Rust change? | Disposition |
|---|---|---|---|---|---|
| **R1** | Naked + hidden single detector; "fill all forced" one-step; technique-named hint (singles only) | TS engine over existing masks | **S** | **none** | **FOLD — highest value/effort; unlocks honest grading + real hints for the vast majority of dealt boards** |
| **R2** | Pairs/triples + pointing/box-line; futoshiki inequality-forcing + chains | TS engine | **M** | none | **FOLD — completes the "intermediate" tier; futoshiki reaches parity** |
| **R3** | X-wing; live technique-signature difficulty card (replaces bucket label) | TS engine + deal-time grade | **M** | none | **FOLD — this is the "heuristics displayed" the owner named** |
| **R4** | Persistent candidate-notes mode (promote peek marks) | UI gate only | **S** | none | **FOLD — trivial, expected affordance** |
| **R5** | Swordfish/XY-wing/coloring + `explainStep` trace API | csp-solver 0.5.0 + wasm | **L** | **yes (0.5.0)** | **BANK — re-trigger: only when a real board needs a technique R1-R3 can't grade; not on the critical path** |
| **—** | Generator grades by technique-tier (`measure_difficulty` rewrite) | Rust `generate.rs` | **M** | Rust | **FOLD (own wave) — retires the N=3-only backtrack-band grading at source** |

**KISS ordering rationale:** R1-R4 need **zero** solver/wasm/release/cross-repo work — they are pure TypeScript over the candidate masks `propagateBoard` already returns, in the layer that renders them. That is the entire near-term ladder, and it already answers M9's "better hints," "better partial solving," and "heuristics that are displayed." Only R5's chaining techniques justify the 0.5.0 trace API; keep it banked behind a concrete trigger rather than building it speculatively (M5 discipline).

### Cross-repo / gate notes for the tranche author
- Rungs 1-4: **no** `csp-solver` release, **no** wasm rebuild, **no** vendored-sync (`scripts/sync-csp-solver-vendor.sh`) touch — purely `web/frontend/src/games/shared/` (new `techniqueEngine.ts`, game-agnostic) + per-game constraint adapters. Honors the game-agnostic bar.
- R5 + generator-regrade: **need** a `csp-solver` 0.5.0 bump → wasm rebuild → `file:`-linked pkg refresh; the standing `npx-packument-OOM` / deploy-via-`npm run deploy` traps apply to any deploy that follows.
- **Acceptance gates should be born RED:** e.g. "hint names the technique in the margin" fails today (hint reveals the digit with no name); "difficulty card shows technique signature" fails today (shows a static bucket); "one-step fill-all-forced exists" fails today (only whole-board or one-cell).

---

## Evidence index (every OUR-code claim anchored)
- Hint = full-solution reveal: `web/frontend/src/games/sudoku/composables/useSudoku.ts:250-275`, `:231-243`; futoshiki twin `useFutoshiki.ts:245-268`.
- Peek = full-answer laminate: `web/frontend/src/games/shared/useAnswerKeyPeek.ts:25-76`.
- Pencil marks = propagate-only masks, peek-gated: `web/frontend/src/games/shared/usePencilMarks.ts:60-78`; `useSolver.ts:217-227`; wasm `csp-solver/wasm/src/sudoku.rs:205-237` (spoiler note `:186-188`).
- Difficulty = backtrack count at bake time, N=3-only bands: `csp-solver/src/puzzles/sudoku/generate.rs:50-61`, `:156-165`; runtime bucket-select `useSolver.ts:147-170`.
- Stat-line (machine effort, not difficulty): `web/frontend/src/games/shared/solveTally.ts:13-21`; `shared/types.ts:15-19`.
- Wasm exposes only `backtracks`; Rust computes `nodes_explored`+`propagations` and drops them: `csp-solver/wasm/src/sudoku.rs:56-111` vs `csp-solver/src/config.rs:107-118`.
- Constraint-level blame (not technique-level): `csp-solver/src/solver/propagate.rs:1-17`.

## Market citations (every market claim cited)
- Technique tiers + naked/hidden/X-wing definitions: [Logic Loft](https://www.logicloftgames.com/blog/sudoku-solving-techniques/), [SudokuWiki X-wing](https://www.sudokuwiki.org/x_wing_strategy).
- Explanation-grade step hints naming techniques: [St. Olaf Sudoku Assistant](https://www.stolaf.edu/people/hansonr/sudoku/explain.htm), [Sudoku Helper step hints](https://sudoku-online-puzzles.com/sudoku-helper/).
- Difficulty by hardest-technique-required, not clue/backtrack count: [arXiv 1403.7373 "Difficulty Rating of Sudoku Puzzles"](https://arxiv.org/pdf/1403.7373).

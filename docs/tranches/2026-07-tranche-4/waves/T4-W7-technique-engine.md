# T4-W7 — The technique engine

**We have no hint heuristics. Not one. What we call a "hint" is a single-cell reveal copied out of the fully-solved answer key.** Build the layer that was never there: a pure-TS technique engine that names the cheapest human deduction — naked single, hidden single, pointing pair, X-wing — over candidates it computes *itself*, so the hint says *why* and the difficulty grade means *hardest technique required*. The engine is game-agnostic by construction; sudoku and futoshiki differ only in their constraint set. Rungs R1–R3 need **zero** wasm/Rust/release/vendored-sync work — pure TypeScript in `games/shared/`, the layer that renders it.

**Dependencies**: ← W6 (the grade replaces an *honest* substrate — the backtrack-proxy bucket is de-laundered first, or the engine grades over a lie it can't see). Feeds W8 (fill-forced-cells is R1's detector applied to all cells) and W9-B1 (the tally displays `hardestTechnique`; every filled stroke maps to a named step). **Effort**: L.

---

## The substrate correction (r3, VERBATIM — binding on the whole wave)

> **Mechanism CORRECTED (load-bearing for grading):** the masks `propagateBoard` returns are **post-full-GAC** — the wasm's own note (`sudoku.rs:186-188`): *"at full GAC strength most served boards collapse to all-singleton domains."* GAC AllDifferent is **strictly stronger** than naked/hidden singles or pairs. Feeding GAC-collapsed masks to a technique engine to grade "hardest technique required" is **corrupted**: the board arrives more-reduced than any human sequence, so every cell reads as a naked single and the grade collapses. An honest engine must compute **basic-elimination candidates itself in TS** (a cell's candidates = 1..n minus filled row/col/box peers), NOT read the GAC masks. This *strengthens* the zero-wasm claim (the engine needs even less from wasm) but x3's stated substrate ("reason over the candidate masks `propagateBoard` returns") is **wrong for the grading use case**. **Kill: the technique engine grades over self-computed basic candidates, not over `propagateBoard`'s GAC masks — the GAC masks over-prune.** — `r3/r3-expansion-crit.md:58`, KILL-LIST #3

`propagateBoard` (`useSolver.ts:217-227` → `propagateSudoku`, `csp-solver/wasm/src/sudoku.rs:205-237`) stays the oracle for the *answer* (validation) and for the peek-gated pencil-marks render — but it is **not** the grading substrate. The engine's own candidate function is `1..n minus filled row/col/box peers`, computed in TS over `values` + house structure. This is the load-bearing invariant every rung below rests on.

---

## Scope

### The architectural move — one engine over self-computed candidates

A `techniqueEngine.ts` in `web/frontend/src/games/shared/` — a **pure function** over `(selfComputedCandidates, houses)` returning the *cheapest applicable deduction* plus its *name* and *cells involved*: `{ technique, targetCell, targetValue, becauseCells, becauseCandidates }`. Game-agnostic: sudoku and futoshiki supply an abstract `{cells, candidates, constraints}` view and per-game constraint adapters (houses for sudoku; rows/cols + inequalities for futoshiki). **No new wasm/Rust for R1–R3 by design** — the engine consumes only structure the frontend already has.

### The sudoku ladder — ascending difficulty IS the honest grade

The **hardest technique the engine had to apply to fully solve the dealt board = that board's honest difficulty grade** — the accepted metric ([arXiv 1403.7373 *Difficulty Rating of Sudoku Puzzles*](https://arxiv.org/pdf/1403.7373); fetch-verified 1.2 MB PDF, r3 x1). This replaces the backtrack-count bucket W6 de-laundered.

| Tier | Technique | Detection over self-computed candidates | Rung |
|---|---|---|---|
| 1 | **Naked single** — cell with one candidate | `popcount(mask)==1` | **R1** |
| 1 | **Hidden single** — candidate v in one cell of a house | per house, count cells with bit v | **R1** |
| 2 | **Naked pair/triple** — k cells share k candidates | subset scan within house | **R2** |
| 2 | **Pointing pair / box-line** — candidate confined to one line within a box | intersect box ∩ line candidate positions | **R2** |
| 3 | **X-wing** — v in same 2 cols across 2 rows ⇒ eliminate elsewhere | moderate mask scan | **R3** |
| 4+ | **Swordfish / XY-wing / coloring** | 3-line / chain patterns | **R5 (banked)** |

### The futoshiki ladder (same engine, futoshiki constraint set)

- **Naked/hidden singles** — identical mask scan (the engine is constraint-agnostic).
- **Inequality-forcing (min/max pruning)** — a cell on the "greater" end of a chain cannot hold the minimum of its remaining domain; the "lesser" end cannot hold the maximum. Futoshiki's signature deduction, its analogue of pointing.
- **Inequality chains** — a run `a<b<c<d` bounds each cell by position (the k-th smallest ≥ k) — the analogue of row/col all-different tightening.

The futoshiki open-source precedent proves technique-graded hints are tractable for the second game: [tomwhite/futoshiki-hints](https://github.com/tomwhite/futoshiki-hints) — "a hint for the next simplest step," Row/Column Exclusion + Inclusion "adapted from Sudoku," simplest-first (fetch-confirmed, r3 x1:19). The engine computes candidates over `values` incl. inequality forcing itself — it does not read wasm's inequality-pruned masks (same over-prune hazard).

### The hint UX — the answer-reveal hint dies

Today `hintCell` (`useSudoku.ts:250-275`) reveals the focused cell's answer from the peek cache — the header comment is explicit: *"the hint IS a one-cell solve reveal"* (`:264`). No reasoning, no technique, no name. Twin at `useFutoshiki.ts:245-268`.

- **Draw the reasoning, not the answer first.** First press: highlight the `becauseCells` in the peek-laminate tone and write the technique name in the **margin** (the `MarginNote`/`solveTally` slot, `solveTally.ts`) — *"naked single — only 4 fits here"* / *"hidden single — 7 goes nowhere else in this box."* Second press: ink the digit in through the existing reveal draw-in (`useSudoku.ts:262-269`).
- **One grammar, existing animations** — the reveal draw-in and the peek-laminate highlight are both already built; the hint becomes *highlight-because-cells → name-in-margin → optional-reveal*. No new timing constants (W13/T3 "one grammar" discipline).

### The missing middle rung — fill-forced-cells partial solve

Today the jump is one cell → the whole board: **full solve** (`solve()`, `useSudoku.ts:181-224`, all-or-nothing), **one-cell reveal** (`hintCell`), **propagate-only masks** (pencil marks, rendered never applied). No "fill what's forced."

- **"Fill all forced" (one-step)**: apply every naked+hidden single currently on the board in one animated sweep, then stop. No search — the natural product of R1's detector applied to all cells instead of one. Pure over self-computed candidates, game-agnostic. (This is x1's A7 and W8's partial-solve facility — same detector, W8 wires the button; W7 owns the detector.)

### The honest difficulty grade — displayed via W9-B1

Run the engine to completion at deal time; the hardest technique it needed IS the grade. Feeds W9-B1's tally (five tiers = five tally strokes) and margin signature (*"a fresh 9×9 — singles only"* / *"— needs an X-wing"*). W6 de-laundered the bucket to "you asked for medium"; W7 supplies the measurement that replaces it. The three-signal honesty spine holds: FILL (W9 border) ≠ DIFFICULTY (this grade) ≠ CORRECTNESS (the Solve grade).

### Rung dispositions

| Rung | Deliverable | Effort | Wasm/Rust? | Disposition |
|---|---|---|---|---|
| **R1** | Naked + hidden single detector; fill-all-forced one-step; technique-named hint (singles) | S | **none** | **FOLD** — highest value/effort; honest grading + real hints for the vast majority of dealt boards |
| **R2** | Pairs/triples + pointing/box-line; futoshiki inequality-forcing + chains | M | none | **FOLD** — completes the intermediate tier; futoshiki reaches parity |
| **R3** | X-wing; live technique-signature grade (replaces the bucket) | M | none | **FOLD** — this IS "heuristics that are displayed" (M9) |
| **R5** | Swordfish / XY-wing / coloring + `explainStep` trace API | L | **yes (`csp-solver` 0.5.0)** | **BANK** — re-trigger: a real dealt board needs a technique R1–R3 can't grade. Not on the critical path. |

**Free win, do regardless (R1):** surface the already-computed `nodes_explored` + `propagations` from Rust `SolveStats` (`config.rs:108-110`) through the wasm getters (`sudoku.rs:86-90` today drops them — only `backtracks` is exposed). A two-getter addition, no new compute — richer honest telemetry for the machine-effort stat-line. *(This one getter pair is the sole optional wasm touch in the wave; R1's engine itself needs none.)*

---

## Gates

Verbatim. Born RED wherever the defect is live at this wave's base SHA.

| Gate | Value |
|---|---|
| Headline | the hint NAMES the cheapest technique with its `becauseCells` before revealing; the difficulty grade = hardest technique the engine needed; both derived over self-computed basic candidates, never `propagateBoard`'s GAC masks; sudoku + futoshiki both graded; zero wasm/Rust change for R1–R3 |

Component checks:

| Gate | Value |
|---|---|
| substrate (**born RED**) | today no technique layer exists anywhere — grep across `web/frontend/src` for `naked single\|hidden single\|x-wing\|pointing\|swordfish\|technique` returns **empty** (r3 x1:15). After: `techniqueEngine.ts` grades a known singles-only board as tier-1 and a known X-wing board as tier-3 — computing candidates itself, asserted NOT equal to the GAC-collapsed `propagateBoard` masks on a board where GAC over-prunes past the human sequence. |
| hint names the technique (**born RED**) | today `hintCell` (`useSudoku.ts:250-275`) reveals the digit with **no name** — comment "the hint IS a one-cell solve reveal" (`:264`). After: first press highlights `becauseCells` + names the technique in the margin; the digit inks only on a second press. |
| fill-forced (**born RED**) | today only whole-board (`solve()`) or one-cell (`hintCell`) — no middle rung (`x3-hint-heuristics.md:42`). After: "fill all forced" applies every current naked+hidden single in one sweep and stops, no search. |
| grade replaces bucket (**born RED**) | today the difficulty is an opaque bank label, not measured live (`useSolver.ts:52`). After: the dealt board's grade = `hardestTechnique`, wired to W9-B1's tally; W6's "you asked for medium" gives way to the measured signature once graded. |
| futoshiki parity (**born RED**) | today `useFutoshiki.ts:245-268` reveals from the answer key, no technique. After: the same engine grades futoshiki via singles + inequality-forcing + chains; both games driven off one `techniqueEngine.ts`, no second implementation. |
| zero-wasm (R1–R3) | `git diff` over R1–R3 touches only `web/frontend/src/games/shared/` + per-game adapters — no `csp-solver/`, no `wasm/`, no `scripts/sync-csp-solver-vendor.sh`, no release. (The optional `nodes_explored`/`propagations` getters, if taken, are the lone flagged wasm touch.) |

**π/DELTA** (the hint + grade are visual claims):
- **π (named hint)**: golden capture of a hint firing — `becauseCells` highlighted, technique named in the margin — on a fixed seed; compare against the born-RED capture (digit revealed, no name).
- **DELTA (grade signature)**: before = opaque bucket word in the margin; after = *"singles only"* / *"needs an X-wing"* keyed to the engine's `hardestTechnique`. Banked in evidence, one pair per game.
- **DELTA (fill-forced)**: before = board unchanged (no such affordance); after = all forced cells filled in one sweep, non-forced cells untouched.

## Seeds

- `x/x3-hint-heuristics.md` — part (a) the audit ("we have no hint heuristics"; hint=reveal at `useSudoku.ts:250-275`; propagate-only masks; backtrack grade); part (b) the ladder R1–R5, the engine-over-masks design (as CORRECTED below), the hint UX, fill-forced, the rung dispositions (§108-119), the KISS ordering (R1–R4 zero wasm), the cross-repo gate notes (§121-124).
- `r3/r3-expansion-crit.md` §x3 + KILL-LIST #3 — the substrate correction quoted verbatim above (self-computed basic candidates, never GAC masks); the difficulty-band citation correction (deferred to W6-B0); `nodes_explored`/`propagations` free-win confirmed.
- `x/x1-market-assay.md` — A5 (technique-graded hint, the marquee differentiator), A6 (transparent difficulty), A7 (fill-forced partial solve); the two-school hint census (reveal vs technique-graded), sudoku.coach/sudojo + futoshiki-hints citations.
- Anchors verified at base SHA: `useSudoku.ts:250-275` (`:264` comment), `useFutoshiki.ts:245-268`, `useSolver.ts:217-227,147-170`, `wasm/src/sudoku.rs:186-188,205-237,86-90`, `config.rs:108-110`, `solveTally.ts`.

## Residual risks

- **The GAC-mask hazard is the wave's single point of failure** — if any rung reads `propagateBoard`'s masks to grade, the grade collapses (every cell reads naked-single). The substrate gate asserts the engine's self-computed candidates differ from the GAC masks on a board where GAC over-prunes past the human sequence; this is a hard, born-RED test, not a code-review note.
- **R5 stays banked behind a concrete trigger** — the `explainStep` `csp-solver` 0.5.0 trace API is real and spec'd (`x3:101-106`) but speculative until a dealt board needs a chaining technique R1–R3 can't grade. Building it now pays the wasm bump + `npx-packument-OOM`/deploy trap for no shipped board. Do not front-run.
- **Futoshiki inequality-forcing computes over `values`, not wasm's inequality masks** — same over-prune hazard as sudoku; the engine re-derives inequality bounds in TS. Verify parity of the named deduction against tomwhite/futoshiki-hints' strategy order, not against the wasm mask.
- **The grade is deal-time work** — running the engine to completion at deal adds latency; for 9×9 this is cheap (singles-dominated), for a hypothetical X-wing-required board it is bounded by the ladder depth (no search). Probe the grade latency on the live-dug 9×9 path (shares W6-ROW3's concern).
- **W7 owns the detector, W8 wires the button** — fill-forced-cells is R1's detector; W8's partial-solve facility is the UI affordance over it. Keep the detector in `games/shared/techniqueEngine.ts`, not duplicated in W8.

---
## Execution record (2026-07-13)

Workflow `wf_6baf41ef-df0`, 5 lanes (E1 engine-core ∥ E4 telemetry-getters → E2 futoshiki-parity → E3 hint-UX, Fable+DesignSync → adversarial verify). The verify lane died once at a session-limit wall — the hardened script returned `{walled:["V"]}` with all four implementation lanes journaled; resumed post-reset via `resumeFromRunId` + `args:{wallAudit:["V"]}` (lanes cache-replayed at zero cost, V ran audit-first). The limit-wall machinery's first live exercise, exactly to design. Verify verdict: **PASS, no gate failures**.

| Gate | Born-RED | Close |
|---|---|---|
| substrate (the SPOF) | no technique layer anywhere (grep over src/ = incidental comments only) | `techniqueEngine.ts` — pure `findStep(PuzzleView)` over SELF-COMPUTED basic candidates; the permanent tripwire asserts self-computed ≠ GAC-collapsed masks (57 over-pruned cells on the witness board); verify's independent harness proved the X-wing board REQUIRES the rung (ladder stalls without it) and that a GAC substrate collapses the grade to tier-1 — the exact corruption the invariant guards |
| ladder R1–R3 | — | naked/hidden single (t1) · naked pair/triple + locked-candidates pointing (t2, house-agnostic) · X-wing (t3, axis-tagged so boxes never serve as fish base); singles board → tier-1, X-wing board → tier-3, verified fixtures oracle-checked |
| hint names the technique | `hintCell` = answer reveal, "the hint IS a one-cell solve reveal" | first press lights `becauseCells` (the is-because laminate riding the existing marks-fade-in) + names the technique in the margin via `techniqueVoice`; second press inks through the existing reveal draw-in; both games, keyboard AND touch (the WM affordances hold); `pencilConfig.ts` untouched — zero new timing constants |
| fill-forced | whole-board or one-cell, no middle | `fillAllForced` — one sweep, no search, no cascade; deadly-rectangle board untouched; detector-only (W8 wires the button) |
| grade replaces bucket | opaque bank label | `gradeBoard` to completion at deal; `hardestTechnique` on game state; margin signature ("singles only"/"needs an X-wing") supersedes the W6 request-voice once graded; deal-time cost 0.246 ms mean / 0.972 ms worst (n=400, live-dug 9×9 hard) — sub-frame |
| futoshiki parity | reveal-from-answer-key, no technique | same engine, futoshiki adapter: singles + inequality-forcing (t2) + inequality chains (t3), candidates + bounds re-derived in TS over values (never wasm masks); ladder order parity vs tomwhite/futoshiki-hints cited; `stallsWithout` proofs per rung |
| zero-wasm (R1–R3) | — | frontend footprint = `games/shared` + per-game adapters/composables + 2 recut e2e specs; the SOLE wasm touch is the sanctioned free-win: `nodesExplored`/`propagations` getters on both result surfaces (bigint on .d.ts), threaded through protocol → SolveStats for both games, display left to W9-B1; lean wasm 90,249 B, 2,751 B under budget |
| battery (π) | — | frontend all green (vue-tsc, 195 units/19 files, eslint, knip, prettier, build) · rust all green (fmt, clippy -D, workspace, wasm-pack --node 14/14) · e2e 62/62 vs BUILT DIST on :4188 · darwin goldens 4/4, zero moved |

Seal reconciliations: R5 (swordfish/XY-wing + `explainStep`) stays BANKED — no dealt board yet needs a rung R1–R3 can't grade. E3's DesignSync component-card `finalize_plan` is permission-gated and books to the owner (non-blocking). Verify's scratch harness (2 files) deleted at seal; the CONTRIBUTING.md staged-delete continues its ride to W14 untouched.

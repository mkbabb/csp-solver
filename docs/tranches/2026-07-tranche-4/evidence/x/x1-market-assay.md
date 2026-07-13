# LANE x1 — Market assay: sudoku/futoshiki affordance census + OUR-tree audit

Answers owner rows **M9** (affordances "we do not currently expose or provide outright" — better hints, better partial solving, border progress bar, displayed heuristics, game-selection carousel) and feeds **M8/M10**. Scope: research + design spec only, NO source edits. Every OUR claim carries a file:line anchor; every market claim carries a URL.

---

## 0. Method + the razor

Surveyed the live market via web search/fetch (citations inline). Audited our actual Vue tree for each affordance (anchors inline). The bar per owner: **KISS is the razor**, **the pencil idiom is the design law**, **game-agnostic is the architecture bar** — so an affordance only makes the shortlist if it (a) rides facilities the engine *already exposes*, (b) can be drawn in the pencil hand, and (c) lands in `games/shared/` for both games at once.

A structural asymmetry sets our ceiling: **our "solver" is a CSP engine (AC-3 + GAC propagation + search), not a human-technique solver.** It knows *the answer* and *the surviving domains*; it does NOT know "this is a naked single in box 4." That single fact governs which market affordances are cheap (reveal/partial-fill/candidate-display/conflict-check — all fall out of what we have) versus expensive (technique-graded hints, technique-based difficulty — a new solver layer).

---

## 1. Our tree — what we actually expose today (anchored)

| Facility | Where | Behavior |
|---|---|---|
| Full solve | `games/sudoku/composables/useSudoku.ts:181` `solve()` | Fills every empty cell in solver-ink; grades `solved`/`failed`/`error`. |
| Single-cell hint | `useSudoku.ts:250` `hintCell()`; keyboard `H` at `SudokuBoard/SudokuBoard.vue:339` | Reveals the focused cell's answer from the peek cache. **A reveal, not an explanation** — no technique, no rationale, no penalty. |
| Hold-to-peek | `ControlPanel/ControlPanel.vue:82-104`; `useSudoku.ts:231` `peekSolution()` | Press-and-hold ≥350 ms → read-only answer-key laminate overlay; release clears. Never mutates `values`. |
| Pencil marks | `games/shared/usePencilMarks.ts`; render `SudokuBoard/SudokuCell/SudokuCell.vue:142-165` | **Engine-domains only** — the solver's propagated surviving candidates (`propagateBoard`, `useSolver.ts:217`). **Opt-in, peek-gated** (visible only while peek is held), **non-editable**, no corner/center split, shown only where propagation actually pruned (`usePencilMarks.ts:75`). |
| Conflict check | `games/sudoku/SudokuBoard/conflicts.ts`; gate at `SudokuBoard.vue:185` | Pure row/col/box duplicate derivation → red-ghost `aria-invalid` + "check row N" margin. **Gated on `solveState === 'failed'`** — fires only AFTER a Solve grades wrong. One-time idle discoverability whisper "mark it and I'll grade" (`SudokuBoard.vue:400`). **No live mode, no toggle, no "as-you-go".** |
| Undo/redo | `games/shared/useUndoHistory.ts` (cap 128); keys `SudokuBoard.vue:330-343` | Linear `{pos,prev,next}` history, user edits only. **Keyboard-only** (Ctrl/Cmd+Z, Shift+Z) — no on-screen undo button. |
| Difficulty | `useSolver.ts:52`; banks `csp-solver/data/sudoku_puzzles/{3,4}/` | EASY/MEDIUM/HARD drawn from **prebaked template banks**. **Opaque label** — not derived, not technique-transparent, no rating shown. |
| Share / save | `useUrlState.ts` — `shareBoard()` `?board=` permalink + localStorage persist | Copy-link + address-bar restore + auto-save. Solid. |
| Solve tally | `games/shared/solveTally.ts`; `SolveStats` = backtracks/solutionCount/elapsedMs | Engine telemetry in the margin — NOT a play timer. |
| Keyboard grammar | `SudokuBoard.vue:301-348` | Arrows, Home/End, Ctrl+Home/End, digits, K peek, H hint, Ctrl/Cmd+Z. Legend at `pencil/chrome/KeyboardLegend.vue`. |
| Accessibility | `SudokuBoard.vue:248-300` + `DigitPad.vue` | ARIA grid, roving tabindex, live regions (status/alert split), touch DigitPad, coarse-pointer sublabels. **Genuinely strong — ahead of most of the market.** |
| Game switch | `pencil/chrome/HandwrittenLogo/useGameMenu.ts` | Menu toggles sudoku↔futoshiki. **Not a carousel selection screen** (M9's ask). |
| Monetization noise | — | **None.** No ads, hearts/lives, mistake-limit, forced login, streak-pressure, popups. This is a *strength to preserve*, not a gap. |

**Absent entirely** (grep-confirmed, no matches): play timer, daily/dated puzzle, streak/calendar, statistics profile, leaderboard, board-fill progress indicator, technique names anywhere in the tree.

---

## 2. Market census — the affordance families (cited)

**Hint SYSTEM — two schools.**
- *Reveal school* (mass-market): sudoku.com / NYT press "Hint" → reveal one cell; NYT further offers "Reveal Cell / Reveal Box / Reveal Full Solution." ([sudoku.com app](https://apps.apple.com/us/app/sudoku-com-number-games/id1193508329); [NYT via SudokuPulse](https://sudokupulse.com/articles/nyt-sudoku-tips/)) — **this is exactly our tier.**
- *Technique-graded school* (the differentiator): **sudoku.coach** and **sudojo** step a real technique solver: "for every step the Solver makes… techniques are tried in a specific order, and only if the Solver finds something for a technique is the step completed and its result shown" — so the hint NAMES the technique (naked single → … → Simple Coloring) and teaches. ([sudoku.coach solver](https://sudoku.coach/en/solver); [sudojo](https://sudojo.com/en/)). Futoshiki has an open-source analogue: **tomwhite/futoshiki-hints** ("puzzle hints for humans") proving technique-graded hints are tractable for our second game too. ([github](https://github.com/tomwhite/futoshiki-hints))

**Pencil-mark automation.** Manual notes mode is table stakes (sudoku.com "turn on Notes… each time you fill a cell your notes are automatically updated"). NYT adds **auto-fill candidates / "Show Candidates"** (all logical possibilities) AND flags the cost: it "can clutter the grid" / "massive visual noise." Corner-vs-center marks (Snyder notation) are the setter-grade standard in SudokuPad/f-puzzles. ([sudoku.com](https://apps.apple.com/us/app/sudoku-com-number-games/id1193508329); [NYT](https://sudokunyt.net/); [SudokuPad](https://sudokupad.app/)) — the market lesson: auto-candidates must be **opt-in** (which our peek-gating already gets right).

**Error-check modes.** The market norm is a **user-chosen mode**: off (train yourself), check-on-demand (NYT "check your progress at any time"), or live auto-check ("see your mistakes as you go" — sudoku.com, toggleable in Settings). Conflicts render as red digit + red row/col/box background. Turning it OFF is itself promoted as a skill-building setting. ([sudoku.com](https://apps.apple.com/us/app/sudoku-com-number-games/id1193508329); [error-modes overview](https://sudoku-online-puzzles.com/blog/sudoku-mistakes/)) — **we offer only post-Solve grading; no user choice of mode.**

**Difficulty grading.** Best-in-class is **transparent + technique-based**: sudoku.coach grades by the hardest technique the puzzle requires, with a published technique order defining the tiers. ([sudoku.coach difficulty](https://sudoku.coach/en/learn/sudoku-difficulty)). Futoshiki sites grade by grid size × clue/inequality count. ([puzzlenum futoshiki](https://puzzlenum.com/futoshiki/); [thepuzzlelabs](https://www.thepuzzlelabs.com/futoshiki)) — **our EASY/MEDIUM/HARD is an opaque bank label.**

**Progress indication.** Daily-challenge sites show calendar/streak progress; in-puzzle, completion % / cells-remaining is common. M9 specifically wants it "deftly integrated into the border of the board." ([sudoku.com challenges](https://sudoku.com/challenges/daily-sudoku))

**Dailies / streaks / timers / stats / leaderboards.** A whole engagement stack: streak counter (resets on a missed day), countdown to next drop, per-difficulty statistics (best times, win rate, perfect wins), global leaderboards, trophies, color-coded calendar. ([sudoku.com awards/stats](https://sudoku.com/awards); [thesudoku statistics](https://thesudoku.com/statistics)) — **we have none; most of this clashes with KISS + our stateless permalink model (see §4 non-goals).**

**Undo semantics.** "Unlimited undos" is the advertised norm (sudoku.com). ([sudoku.com](https://apps.apple.com/us/app/sudoku-com-number-games/id1193508329)) — ours is capped at 128 and keyboard-only.

**Save / replay / share.** Auto-save + resume is universal; permalink sharing is rarer. **Our `?board=` permalink is at or above market.**

**Accessibility.** Largely poor across the mass market (canvas grids, few live regions). **Ours (ARIA grid + roving tabindex + live regions + DigitPad) is a genuine lead** — a differentiator to keep, not a gap.

**Monetization noise to AVOID.** Ad interstitials, hearts/lives + 3-mistakes-and-out, "auto-fill notes as a laziness trigger / massive visual noise," forced accounts. Sources explicitly frame mistake-limits and auto-fill-clutter as anti-patterns. ([sudoku-online-puzzles mistakes](https://sudoku-online-puzzles.com/blog/sudoku-mistakes/)) — **we are clean; preserve it.**

---

## 3. THE AFFORDANCE MATRIX

Columns: **Best-in-class** (who + how, cited above) · **OURS** (anchored) · **Gap** (P0 broken/lie · P1 live-defect · P2 named-debt · P3 polish — here re-read as *product gap severity*) · **KISS fit** (cost to build within our engine + idiom + game-agnostic bar).

| # | Affordance | Best-in-class | OURS (anchor) | Gap | KISS fit |
|---|---|---|---|---|---|
| A1 | **Manual/editable pencil marks (user notes)** | sudoku.com Notes; NYT; corner+center (SudokuPad) | Engine-domains only, **non-editable, peek-gated** — `usePencilMarks.ts`, `SudokuCell.vue:142` | **P1** — the single biggest table-stakes miss; a solver can't play sudoku *for* you and the user has no place to reason | **HIGH-value / MED-cost.** Shared composable already renders marks; add a user-mark store + pencil-mode toggle in `games/shared/`. Game-agnostic. |
| A2 | **Persistent auto-candidates toggle** | NYT "Show Candidates"; opt-in to avoid clutter | Have `propagateBoard` (`useSolver.ts:217`) but display is **peek-only** | **P2** | **HIGH / LOW.** Ungate the existing engine-domain marks behind a persistent toggle. Owner-lesson honored: keep opt-in. |
| A3 | **Error-check MODE choice (off / on-demand / live)** | sudoku.com Settings toggle; NYT check-anytime | Only post-Solve grading; **no mode, no toggle** — `conflicts.ts`, gate `SudokuBoard.vue:185` | **P1** | **HIGH / LOW.** `findConflicts` is already a pure derivation; add a 3-state setting + ungate live. Cheapest high-value win. |
| A4 | **Board progress indicator on the border** | completion %, cells-remaining; M9 asks for border integration | **None** | **P1** (owner explicitly requested) | **HIGH / LOW.** Pure derivation over `values`; draw as a boil-ink border fill on `HandDrawnOutline`. Pencil-idiomatic, game-agnostic. |
| A5 | **Technique-graded hint ("naked single, row 3")** | sudoku.coach/sudojo step solver; futoshiki-hints | Reveal only — `hintCell()` names nothing | **P1** — the marquee differentiator; also satisfies M9 "heuristics that are displayed" | **HIGH / HIGH-cost.** Needs a *human-technique* layer atop the CSP engine (naked/hidden singles, pointing pairs…). Feasible per futoshiki-hints; scope as its own wave or bank. |
| A6 | **Transparent, technique-based difficulty** | sudoku.coach grades by hardest technique | Opaque bank label — `useSolver.ts:52` | **P2** | **MED / HIGH.** Shares A5's technique layer. Defer/bank until A5 exists; then difficulty = free byproduct. |
| A7 | **Partial-solve / "fill what's forced"** | (candidate elimination is the manual form) | Full-solve or single-cell only | **P2** — M9 "better partial solving" | **MED / LOW.** Engine already propagates singletons; add "fill all forced cells" using `propagateBoard` results (domain size 1). Game-agnostic. |
| A8 | **Corner vs center marks** | SudokuPad/f-puzzles Snyder standard | Single graphite cluster | **P3** | **MED / MED** — rides A1. Setter-grade nicety; lower priority for a casual audience. |
| A9 | **On-screen undo/redo affordance + unlimited** | sudoku.com "unlimited undos", visible button | Cap 128, **keyboard-only** — `useUndoHistory.ts` | **P3** | **LOW / LOW.** Raise/remove cap; the DigitPad/drawer could host visible undo. |
| A10 | **Game-selection carousel** | (Wii-Shop metaphor is M9's own) | Menu toggle only — `useGameMenu.ts` | **P2** (owner requested, ties to M8 expansion) | **MED / MED.** Board-morphs-to-carousel; designed in our idiom, game-agnostic — its own design wave. |
| A11 | **Play timer** | universal | None | **P3** | **LOW / LOW** — but see §4: pressure-timer partly clashes with the calm pencil idiom; make it optional/off-by-default. |
| A12 | **Dailies / streak / calendar** | sudoku.com stack | None | **P3** (engagement, not core) | **LOW-fit** — needs dated puzzle infra + persistent identity; **§4 non-goal** unless owner elects. |
| A13 | **Statistics / leaderboard / trophies** | sudoku.com stack | None | out-of-idiom | **AVOID** — competitive/monetization-adjacent; clashes with the calm, ad-free product. |
| A14 | **Row/col/box peer highlighting on selection** | sudoku.com highlights related units | Not on selection (only conflict/reveal tints) | **P2** | **MED / LOW.** Pure derivation on `focusedPos`; a faint pencil wash over the active unit. Aids scanning, game-agnostic. |
| A15 | **Accessibility (ARIA grid, live regions, touch pad)** | mostly poor | **Strong** — `SudokuBoard.vue:248`, `DigitPad.vue` | **LEAD** | preserve; a differentiator. |
| A16 | **Permalink share / auto-save** | rare / common | **Strong** — `useUrlState.ts` | **AT/ABOVE** | preserve. |
| A17 | **Ad-free / no mistake-limit / no forced login** | anti-pattern in mass market | **Clean** | **LEAD** | preserve; a design law, not a feature. |

---

## 4. KISS-weighted shortlist — what we SHOULD provide

Ranked by (product value × idiom fit) ÷ build cost. All land in `games/shared/` → game-agnostic by construction.

**Tier 1 — cheap wins on facilities we already own (do these first):**
1. **A3 · Error-check mode toggle (off / on-demand / live).** `findConflicts` is already a pure, gated derivation — ungate + add a 3-state setting. Highest value-per-line in the whole assay. Honor the market lesson: default to *on-demand*, never a mistake-counter.
2. **A4 · Border progress indicator.** Owner asked for it by name (M9). Pure `values` derivation drawn as boil-ink fill on the existing `HandDrawnOutline`. Pencil-native.
3. **A2 · Persistent auto-candidates toggle.** `propagateBoard` already exists; just let engine-domain marks show without holding peek. Keep opt-in (NYT clutter lesson).

**Tier 2 — the real gap, table-stakes, moderate cost:**
4. **A1 · Editable user pencil marks + pencil-mode.** The one affordance every serious client has and we lack. Add a user-mark store beside the engine marks; toggle center/corner (A8) as a follow-on. This is what makes it a *game you play*, not a solver you watch.
5. **A7 · "Fill forced cells" partial-solve.** Trivial atop propagation (domain-size-1 cells). Satisfies M9 "better partial solving" cheaply.
6. **A14 · Peer-unit highlight on selection.** Low cost, high everyday utility.

**Tier 3 — the marquee differentiator, own wave / bank:**
7. **A5 + A6 · Technique-graded hints + transparent difficulty.** The sudoku.coach class. Requires a human-technique solver layer atop the CSP engine (the engine knows the answer, not the *reason*). Feasible (futoshiki-hints proves the second game), but it's a genuine build — scope as a dedicated wave or **bank with a named re-trigger**. Once it exists, displayed heuristics (M9) and transparent grading (A6) both fall out for free.
8. **A10 · Game-selection carousel.** Its own design wave (M8/M9); board-morphs-to-carousel in our idiom.

**Explicit NON-GOALS (decide, don't re-book):** A12 dailies/streak, A13 stats/leaderboard/trophies, and *pressure* timers (A11). They demand dated-puzzle infra + persistent identity + a competitive frame that clashes with the calm, ad-free, permalink-stateless product. **Retire with rationale** unless the owner elects them — and if A11 timer lands, off-by-default and non-punitive.

**Preserve as differentiators (not gaps):** A15 accessibility, A16 permalink/save, A17 ad-free/no-mistake-limit. The market's monetization noise is our contrast; guard it.

---

## 5. family_hints (for the campaign registry)

- `market-gap-editable-marks` (A1/A8) — user cannot reason on the board; engine-only marks.
- `market-gap-errorcheck-mode` (A3) — no user choice of check timing; post-Solve only.
- `market-gap-progress-border` (A4) — owner-named affordance absent.
- `market-gap-technique-layer` (A5/A6/A7 partial) — CSP engine lacks a human-technique layer; blocks graded hints + transparent difficulty + displayed heuristics.
- `market-gap-selection-carousel` (A10) — M8/M9 game-agnostic selection screen absent.
- `idiom-preserve-no-monetization` (A13/A12/A11) — engagement stack is a deliberate non-goal, not a backlog omission.

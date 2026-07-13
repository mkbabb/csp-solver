# LANE r3-expansion-crit — REFUTE-PASS over x1–x6

Adversarial re-derivation of the six expansion lanes at their own anchors. Every wall re-read from the tree; market feasibility spot-fetched; twin arithmetic re-run with the lane's own probes. Verdict per claim + a kill list of statements that must NOT propagate into the tranche as written.

Net: the six lanes are **substantially sound**. No verdict is REFUTED. Six CORRECTIONS, all folded below; two are load-bearing enough to gate authoring (x3 difficulty-band citation; x6 2,300 floor).

---

## x1 — MARKET MATRIX

### OURS column (anchored) — CONFIRMED
Re-verified the load-bearing OURS anchors independently:
- **Hint = one-cell reveal:** `useSudoku.ts:250` `hintCell`; `:264` verbatim comment *"the hint IS a one-cell solve reveal"*. CONFIRMED.
- **Pencil marks = propagate-only masks:** `propagateBoard` (`useSolver.ts:217`) returns a `Uint32Array` of per-cell candidate bitmasks from `propagateSudoku` (`wasm/src/sudoku.rs:205-237`). CONFIRMED.
- **"Absent entirely" set:** grep across `web/frontend/src` for technique names (`naked single|hidden single|x-wing|pointing|swordfish|technique`), play-timer, and board-fill/progressbar all return **empty**. The three born-RED premises (no technique layer, no timer, no progress indicator) are CONFIRMED true today.
- **No router:** `grep vue-router|createRouter` empty; URL truth is `?game=` via `history.replaceState` (`App.vue:88`). CONFIRMED.

### Market claims (fetch) — CONFIRMED where fetchable; premise holds
- **futoshiki technique hints tractable** ([tomwhite/futoshiki-hints](https://github.com/tomwhite/futoshiki-hints)): FETCH-CONFIRMED. README gives "a hint for the next simplest step," names Row/Column Exclusion + Inclusion strategies "adapted from Sudoku," ordered simplest-first. Backs x1:41 and the "second game can be technique-graded too" load-bearing premise. CONFIRMED.
- **sudoku.coach step-solver / technique-based difficulty** (x1:41,47): the two sudoku.coach URLs are a JS SPA — WebFetch returns only the cookie banner, so the *specific* citation is UNVERIFIABLE-BY-FETCH. The underlying premise (technique-graded solvers exist; hardest-technique is the accepted difficulty metric) is independently corroborated by the futoshiki-hints repo and the arXiv paper (real, 1.2 MB PDF downloaded, title *Difficulty Rating of Sudoku Puzzles*). Premise stands; flag the sudoku.coach citations as "cited, not fetch-reproducible."
- The app-store / NYT / sudoku.com affordance claims (Notes auto-update, auto-check toggle, Reveal tiers) were not individually fetched (app-store pages are thin and JS-gated); they are standard, uncontested domain facts and not load-bearing for any tree verdict.

### CORRECTION (already folded by x5, confirmed here)
- **A4 anchor wrong:** x1:72,95 route the progress border onto `HandDrawnOutline`. The board border is the closed `frame` path inside **`HandDrawnGrid`** (`HandDrawnGrid.vue:151-159` — *"the frame-line is the grid's only CLOSED path"*). x5 already corrected this; I confirm x5 is right and x1 is wrong. **Kill: do not carry x1's `HandDrawnOutline` progress-host into the tranche.**

**Verdict x1: CONFIRMED** (matrix stands; one anchor corrected via x5; sudoku.coach citations non-reproducible but premise corroborated).

---

## x2 — ENGINE-FIT

### Wall 1 — n-ary lambda blindness — CONFIRMED verbatim
`constraint/traits.rs:73-79`: `match self.scope().len() { 1 => unary, 2 => binary, _ => Revision::Unchanged }`. n-ary custom/lambda gets **zero pruning**; only `check()` consults it at assignment time. The doc comment (`:64-72`) independently confirms the intent (unary/binary lambdas propagate; n-ary do not). CONFIRMED.

### Wall 2 — u128 domain ceiling — CONFIRMED verbatim
`domain/bitset.rs:6-13` `bits: u128`; `:38` release `assert!(v < 128, …)`; `:56` `range` asserts `n <= 128`. Values `0..128`, hard release-assert (explicitly R7, not debug). 81-cell grids fit; thousand-word banks overflow. CONFIRMED.

### ONE-PRIMITIVE claim — CORRECTED (count loose; feasibility intact)
x2 headlines "one wave, one primitive, three games" and "a single new n-ary arithmetic-cage constraint (sum, with a product twin)." Re-derived:
- **Killer:** sum-cage only → one new n-ary sum constraint with `revise_impl`. TRUE.
- **KenKen +/− cages:** − is 2-cell → binary lambda (propagates, Wall-1 binary path). + is n-ary → the same sum. TRUE.
- **KenKen ×/÷ cages:** ÷ is 2-cell binary lambda (free). **× is n-ary and needs a SEPARATE product constraint** — product bounds-propagation is a distinct `revise_impl` from sum. x2 discloses this ("+ a product twin", "sum + product"), but the "**one** primitive" banner undercounts: to serve KenKen *including product cages* you ship **two** n-ary constraints (sum + product), not one.
- Feasibility of the product propagator holds (KenKen values are 1..n, no zeros → clean product bounds).

**Kill: the tranche must name the primitive as "an n-ary arithmetic-cage family (sum + product), two `revise_impl`s," not "one primitive." Killer alone is one; full KenKen is two.**

### Crosswords-NO — CONFIRMED sound
Grid-fill = AllDifferent-over-slots (have GAC) + binary letter-match crossings (propagate) — a clean CSP, **but** a real word bank exceeds the u128 ceiling (Wall 2), so it works only with ≤128 words/slot; letters strain the digit idiom. Clue authoring is non-CSP/NLP and breaks the offline-wasm model. Both legs rest on verified walls. Verdict NO is correct; the recommended DECIDED-retire row is the right disposition. CONFIRMED.

**Verdict x2: CONFIRMED** on both walls + crosswords; **CORRECTED** on the primitive count (sum + product = two, not one).

---

## x3 — HINT / HEURISTICS

### zero-wasm-change for rungs 1–4 — CONFIRMED (disposition); mechanism CORRECTED
- Disposition CONFIRMED: `propagateBoard`→`propagateSudoku` already returns per-cell candidate bitmasks (`sudoku.rs:190-194`, one `u32`/cell, bit v = value v survives). A TS technique engine (naked/hidden singles, pairs, pointing, X-wing) is pure logic over a mask array + house arithmetic — needs **no** new wasm/Rust for R1–R4. TRUE.
- **Mechanism CORRECTED (load-bearing for grading):** the masks `propagateBoard` returns are **post-full-GAC** — the wasm's own note (`sudoku.rs:186-188`): *"at full GAC strength most served boards collapse to all-singleton domains."* GAC AllDifferent is **strictly stronger** than naked/hidden singles or pairs. Feeding GAC-collapsed masks to a technique engine to grade "hardest technique required" is **corrupted**: the board arrives more-reduced than any human sequence, so every cell reads as a naked single and the grade collapses. An honest engine must compute **basic-elimination candidates itself in TS** (a cell's candidates = 1..n minus filled row/col/box peers), NOT read the GAC masks. This *strengthens* the zero-wasm claim (the engine needs even less from wasm) but x3's stated substrate ("reason over the candidate masks `propagateBoard` returns", x3:58,61) is **wrong for the grading use case**. **Kill: the technique engine grades over self-computed basic candidates, not over `propagateBoard`'s GAC masks — the GAC masks over-prune.**

### difficulty-grade honesty vs generate.rs truth — CONFIRMED in substance; citation CORRECTED
- Substance CONFIRMED: runtime difficulty is an opaque bucket the user picks; the bake-time grade is a machine **backtrack count** (`measure_difficulty`, `generate.rs:51-61`); no live grade is shown; the post-solve `backtracks — ms` stat-line is machine effort, not human difficulty. All TRUE.
- **Citation CORRECTED:** x3:34 (and x5:116,133 inheriting it) cite `generate.rs:156-165` as *the* grading bands and read the `n != 3` early-return as "no grading for 4×4/16×16." But `expected_backtrack_band` is `#[cfg(debug_assertions)]` (`generate.rs:155`) and its own doc (`:142-154`) states it is *"Consulted solely by the debug-build consistency assertion … never a release-path gate"* — a sanity check that catches gross wrong-directory mismatches, not the grader. The grader is `measure_difficulty` (backtracks). The N=3-only observation is real but it describes the **debug assertion's** band table, not the live/bake grading authority. **Kill: do not tell the tranche "difficulty is graded by the N=3-only bands at generate.rs:156-165" — those are a debug consistency assertion. The grade is backtrack count (`measure_difficulty`); the honest defect is "backtrack-proxy bucket, not shown live," which x5's Gate B-0 must re-anchor off `measure_difficulty`, not the debug band.**

### wasm drops nodes_explored/propagations — CONFIRMED
`SudokuSolveResult` stores only `backtracks: u64` (`sudoku.rs:62`); getters expose solved/solutionCount/n/solutions/backtracks/budgetExceeded — no `nodes_explored`/`propagations` getter. Rust `SolveStats` computes all three (`config.rs:108-110`). The "free win: surface two more getters" is real. CONFIRMED.

**Verdict x3: CONFIRMED** (feasibility, ladder, zero-wasm R1–R4); **CORRECTED** twice — the grading substrate is self-computed basic candidates (not GAC masks), and the difficulty-band citation is a debug assertion (not the grader).

---

## x4 — CAROUSEL

### House-grammar anchors — CONFIRMED
- `game`/`scene` ref split (`App.vue:68-70`), seam flip (`:112`), PRM same-frame cut (`:92`), `replaceState` URL truth (`:88`), no-router (grep empty), games hardcoded via `type GameId` literal + `gameOptions` (`:35-36`). Every structural anchor x4 leans on is verified. The registry need (to make "a third game is a data row") is genuinely justified by the hardcoded `GameId`.
- The drawer FLIP-on-WAAPI + "never tween filtered layout size" discipline that x4 reuses for the board⇄card fold is consistent with x4's own §5.1 (scale-transform, one raster) — no contradiction found.

### State-machine / URL / PRM — CONFIRMED, holes honestly flagged
- The `view/snappedIndex/enteredFrom` machine, `?view=gallery` add-on, deep-link parse, and PRM branches all mirror existing patterns. No unhandled transition found.
- The **mid-game guard** (dirty+different → light ribbon) is correctly flagged as a **ratify-me** default, not asserted as settled — x4 is honest that it adds friction the app lacks today (`App.vue:86-87` strips board silently). No overreach.
- **One soft spot (not a hole):** the `useFlipGlide` extraction from `useControlsDrawer` (the claimed M10 win) is asserted, not proven — the drawer engine tweens between two layout *classes* whereas the board⇄card is a pure scale; they share the "measure FIRST/LAST rects, animate transform on one glass curve, one clock" skeleton, so the extraction is plausible, but it is an unverified refactor, not a fact. Ledger as a Wave-C risk, not a certainty.

**Verdict x4: CONFIRMED** implementable on the cited machinery; guard honestly balloted; the `useFlipGlide` extraction is plausible-but-unproven (Wave-C risk, not a hole).

---

## x5 — PROGRESS / QUALITY

### HandDrawnGrid frame correction — CONFIRMED
`HandDrawnGrid.vue:151-159` — the frame-line is *"the grid's only CLOSED path"*, `class="grid-line frame-line"`; steady state renders `frameCount` `boil-frame-layer` siblings bound to `steadyFrames` (`:202-209`), opacity-swapped on the beat; `.solve-success .grid-line { stroke: gold !important }` (`index.css:352-353`). x5's correction of x1's A4 anchor is fully CONFIRMED, and the completion hand-off target (gold flood) is real.

### dashoffset-on-baked-pose mechanics — CONFIRMED
The design mirrors the existing grain-baked filterless pose grammar (`HandDrawnOutline`/`steadyFrames`): a dedicated `frameCount` grain-baked trace layer, opacity-swapped on the **same** `boilFrame` beat (compositor-only, zero steady-state raster), with `strokeDashoffset = 1000·(1−progress)` changing **only on fill events** (a cheap paint on a plain stroked path, not a `SourceGraphic`/filter re-raster, and not a beat-driven event). It composes with the pose swap without reintroducing per-beat raster because the trace poses are static geometry, exactly like the frame poses they hug. Mechanism sound. CONFIRMED.

### crayon-blue reservation — CORRECTED
x5:55 asserts *"Blue is unreserved: gold=success, rose=failure, green/orange=the difficulty buckets."* But `--color-focus-sketch: #3A7BC4` (`index.css:177`) is documented as *"keyboard focus ring — crayon-blue darkened one step."* The keyboard **focus ring is crayon-blue-derived**. So blue is **not** unreserved: a keyboard-focused board would show a blue focus ring co-occurring with the persistent blue progress trace (`#4A90D9` vs `#3A7BC4` — adjacent hues, distinct elements). Not a hard collision, but x5's "unreserved" overstates and the co-occurrence is unflagged. **Kill/soften: the progress trace shares the blue family with the keyboard focus affordance — either pick a hue with more separation or acknowledge the focused-board co-occurrence (P3 design caveat).**

**Verdict x5: CONFIRMED** on the frame correction + zero-raster dashoffset mechanics; **CORRECTED** on "blue is unreserved" (focus ring derives from crayon-blue).

---

## x6 — DISTILLATION

### twin arithmetic — CONFIRMED (minor overcount)
Re-ran the lane's own `comm -12`/`codeonly` probes (spot-diffed 4 of 16 pairs + the two byte-identity pairs):

| Pair | x6 identical | re-run | Δ |
|---|---:|---:|---|
| ControlPanel.vue | 453 | **453** | exact |
| SolverErrorNote.vue | 95 | **93** | −2 |
| Cell.vue | 320 | **310** | −10 |
| Board.vue | 455 | **436** | −19 |
| classifyError.ts | byte-identical | **0 diff** | ✓ |
| solverError.ts | byte-identical | **0 diff** | ✓ |

My comment-strip is marginally more aggressive (x6 overcounts Board/Cell by ~10–19 lines) but direction and magnitude hold; the byte-identical solver files reproduce exactly. The **~1,700-line twin-duplication floor is defensible.** CONFIRMED.

### 2,300-line reduction floor — CORRECTED (inflated by ~389+ soft LOC)
Two components of the "TOTAL (floor) ~2,300" don't survive scrutiny:
- **FilterTuner −389 is largely illusory.** `App.vue:31` gates it behind `import.meta.env.DEV` (`defineAsyncComponent`), `:158` comment *"absent from prod builds,"* and `rafInstrumentation.ts:20-21` confirms DEV-only DCE. It is also a **live dev tool** its consumers depend on (`pencilConfig.ts:145`, `SvgFilters.vue:29`, `gridPaths.ts:174`, `HandDrawnOutline.vue:60` all cite "FilterTuner-live" reactivity) — you would not delete it. So −389 counts toward **neither** the ship bundle (already gone) **nor** a sane source deletion. x6's own row hedges ("−389 *if* excisable") but the total table (`x6:158`) banks it as floor.
- **W-excise-PWA is "−?"** (unmeasured) yet sits in the total.

Strip both and the defensible floor is **~1,600 (twin shells) + the solver-seam/idiom/deal rows ≈ ~1,900**, not 2,300. The core twin-shell reduction (~1,600) is solid; the "2,300" headline is padded. **Kill: quote the distillation floor as ~1,600–1,900 defensible (twin shells + solver seam + deal), and treat FilterTuner (already DEV-gated) and PWA (unmeasured) as separate, not as LOC in the reduction total.**
- PWA surface is REAL and abrogatable: `package.json:41` `vite-plugin-pwa ^1.3.0`; `vite.config.ts:192` `VitePWA({ workbox: {…} })`. The W-excise-PWA *row* is valid; only its LOC is unquantified.

### r2-contradiction adjudication (section-slotted shells vs vanity-DRY) — CONFIRMED
Both are right at their grain, and x6's "r2 declined the wrong shape" is fair:
- r2 rejected merging the **files** into one flag-driven component — correct, because the furniture (difficulty section, FutoshikiCaret, subgrid lines) genuinely diverges.
- x6 proposes extracting a **shell that takes section/furniture slots** — correct, because ControlPanel is **92% verbatim** (453/485), and the divergence is *localized* (Sudoku's difficulty section + the n≥2 mobile tab-toggle), not pervasive. A slot-shell is not a lossy merge.
- **Caveat (x6's own):** the cell-shell is MED-HIGH risk (hottest render path, perf-P0/E7 idle-0-paint invariant) and the board-scene-shell is HIGH (owner-audited drawer/completion choreography). The adjudication is sound but the reduction is **not cheap** — it is gated behind the full π/DELTA visual-golden + idle-paint born-RED obligation x6 itself specifies. Confirmed as a legitimate grain distinction, not a free win.

**Verdict x6: CONFIRMED** twin arithmetic + r2 adjudication; **CORRECTED** 2,300 floor (defensible floor ~1,600–1,900; FilterTuner already DEV-gated, PWA unmeasured).

---

## KILL LIST (must not propagate into the tranche as written)

1. **x1 A4 host:** progress border attaches to `HandDrawnGrid`'s `frame` path, **not** `HandDrawnOutline`. (x5 already corrected; carry x5's anchor.)
2. **x2 "one primitive, three games":** name it "an n-ary arithmetic-cage family (**sum + product**), two `revise_impl`s." Killer = one (sum); full KenKen incl. product cages = two.
3. **x3 grading substrate:** the technique engine grades over **self-computed basic-elimination candidates**, NOT `propagateBoard`'s GAC masks — GAC over-prunes (boards collapse to singletons, `sudoku.rs:186-188`), corrupting the grade.
4. **x3/x5 difficulty-band citation:** `generate.rs:156-165` is a `#[cfg(debug_assertions)]` **consistency assertion "never a release-path gate,"** not the grader. The bake grade is backtrack count (`measure_difficulty`, `generate.rs:51`). Re-anchor x5's Gate B-0 accordingly; keep the substantive "opaque bucket, backtrack proxy, not shown live" finding.
5. **x5 "blue is unreserved":** `--color-focus-sketch` (#3A7BC4) is crayon-blue-derived (the keyboard focus ring). The blue progress trace co-occurs with the focus ring on a focused board — separate the hue or flag the co-occurrence.
6. **x6 2,300-line floor:** defensible floor is **~1,600–1,900** (twin shells + solver seam + deal). FilterTuner (−389) is already `import.meta.env.DEV`-gated and DCE'd from prod (and is a kept dev tool) — remove it from the reduction total; PWA excision is a valid row but its LOC is unmeasured.

## Rerunnable probes
```sh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
# Wall 1 (n-ary blindness) / Wall 2 (u128)
sed -n '73,79p' csp-solver/src/constraint/traits.rs
sed -n '35,60p' csp-solver/src/domain/bitset.rs
# x3 difficulty band is DEBUG-ONLY
sed -n '142,165p' csp-solver/src/puzzles/sudoku/generate.rs   # note #[cfg(debug_assertions)]
# x3 wasm drops nodes/propagations
grep -n 'backtracks\|nodes_explored\|propagations' csp-solver/wasm/src/sudoku.rs csp-solver/src/config.rs
# x3 GAC-collapse spoiler note
sed -n '186,194p' csp-solver/wasm/src/sudoku.rs
# x5 crayon-blue vs focus ring
grep -n 'crayon-blue\|focus-sketch' web/frontend/src/assets/index.css
# x6 twin overlap (re-run)
cd web/frontend/src; codeonly(){ sed -E '/^[[:space:]]*\/\//d;/^[[:space:]]*\*/d;/^[[:space:]]*$/d' "$1"|sed 's/^[[:space:]]*//'; }
comm -12 <(codeonly games/sudoku/ControlPanel/ControlPanel.vue|sort) <(codeonly games/futoshiki/ControlPanel/ControlPanel.vue|sort)|wc -l  # 453
diff <(sed -E '/^[[:space:]]*[*/]/d' games/sudoku/solver/classifyError.ts) <(sed -E '/^[[:space:]]*[*/]/d' games/futoshiki/solver/classifyError.ts)  # empty
# x6 FilterTuner already DEV-gated
grep -n 'FilterTuner' App.vue
# x6 PWA surface real
grep -n 'vite-plugin-pwa\|VitePWA' ../package.json ../vite.config.ts
```

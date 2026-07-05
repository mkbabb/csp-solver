# Pass 3 — `futoshiki-wave-spec` (adversarial hardening)

**Agent**: futoshiki-wave-spec · Pass 3, grand tranche development · Repo: `CSC411_HW2_ProgrammingQuestion`
**Mandate**: the owner ratified (2026-07-04) Futoshiki as a **committed product wave** (API route + storybook-language frontend), superseding Pass-2 synthesis's own default ("showcase for this tranche... booked behind a real product decision," `synthesis-pass2.md` Q3/`synthesis-pass1.md` N7/P8). This report is the wave spec, produced and then adversarially attacked in the same pass, per the critique-agent contract: a claim survives only if it holds under my own best attack.
**Method**: read-grounded spec (every claim below is anchored to a file:line or a directly-run command) + one small measured probe (own throwaway worktree, primary tree untouched — see §0).

**Headline verdict**: the wave is **buildable but not as cheap as "route + frontend" reads** — it is a from-scratch product surface (API, generation, wasm, frontend visual grammar) sitting on top of a solver that is fully correct for *solving* but has **zero generation, zero difficulty rating, and a default solve configuration that cannot even complete an unconstrained N≥6 board within its own node budget** (measured below, a new finding — not previously documented in any Pass-1/2/2.5 report). The spec below is complete and self-consistent; five items are marked **UNPROVEN** with explicit prototype-gates, and one item (the config bug) is not a "gate" but a **required fix** — the wave cannot ship without it regardless of board-size scope.

---

## 0. Method note — worktree, no primary-repo writes

No worktree was pre-assigned to this agent. Per precept ("work only in your isolated worktree or scratch dirs"), I created my own throwaway worktree at commit `91bb8b0d` (the audited tip) rather than touch the primary tree or an already-dirty sibling worktree (`wf_34cf008e-c2c-2` was found mid-edit by another Pass-3 agent — untouched):

```
git worktree add /private/tmp/.../scratchpad/futoshiki-probe-wt 91bb8b0d
```

One throwaway example (`csp-solver/examples/probe_futoshiki_gen.rs`, this worktree only, never staged) was added to measure generation feasibility — mirroring `rust-owned-puzzle-data.md` §3's Sudoku phase-transition method. Full output captured at `pass3/futoshiki-gen-probe-output.txt`. Darwin arm64, `cargo build --release`, single-run-per-cell, no criterion resampling — same bounded-blowup discipline as that report ("if it blows the cap, that IS the data"). The primary repo (`git status` there) is unchanged by this work; the probe worktree is left in place as an evidence trail, per this tranche's own convention (sibling worktrees from Pass 2 are still present, unremoved).

---

## 1. Ground truth — what exists today (the actual baseline, not the aspirational one)

Confirmed by direct read, not assumed:

| Layer | State |
|---|---|
| **Rust solver** (`csp-solver/src/puzzles/futoshiki/{mod,csp}.rs`) | Complete for *solving*: `FutoshikiPuzzle::parse` (a **CLI text-file format** — `N` / fixed-cell indices / fixed-cell values / inequality-A-sides / inequality-B-sides, newline-delimited — this is the CSC411 assignment's own file format, not a JSON API shape), `create_futoshiki_csp`, `solve_futoshiki`. Row+column all-different (no subgrid — Futoshiki is a plain N×N Latin square, structurally weaker than Sudoku's 3-constraint cell neighborhood), arbitrary-pair `add_greater_than`/`add_less_than` (no adjacency check — see F4). |
| **Rust generation** | **Does not exist.** No `futoshiki/generate.rs`, no `rng.rs`, no `transform.rs` (confirmed: `find csp-solver/src/puzzles/futoshiki` returns only `mod.rs`+`csp.rs`). No `measure_difficulty` equivalent. Zero difficulty concept at all. |
| **Rust tests** | 2 tests (`tests/futoshiki.rs`): a 4×4 fixed-puzzle solve, and a 3×3 fully-open Latin-square count (=12). No uniqueness test, no invalid-input test, no adjacency test, no size-6+ test. |
| **PyO3 bindings** (`csp-solver/src/py.rs`) | **Zero Futoshiki symbols.** `grep -n "futoshiki\|Futoshiki" py.rs` returns nothing. The module exports Sudoku convenience API only. |
| **wasm bindings** (`csp-solver/wasm/src/isomorphic.rs`) | Same — zero Futoshiki-specific wrapper. The **generic** `Csp` wasm class (`add_variable`, `add_greater_than`, `add_less_than`, `add_all_different`, `add_equals`, `solve`) already exists and is sufficient to hand-assemble a Futoshiki CSP client-side today, with zero new Rust code — a genuine reuse point, not a gap (see §3.3). |
| **FastAPI** (`web/api/`) | **Zero Futoshiki route, zero Futoshiki Pydantic model.** The only two live artifacts are (a) a **dead fixture** `web/api/src/app/data/sample_input.txt` (5×5 CLI-format sample, zero route/test references — already flagged P2 in `rust-puzzles.md`, untouched since), and (b) a **false advertisement**: `main.py:17`, `description="Sudoku & Futoshiki puzzle solver API"` — still present at HEAD, confirmed by direct grep. `synthesis-pass1.md` P8/`synthesis-pass2.md` both flagged this and defaulted to "remove the claim, book the surface separately." **The owner's ratification changes the fix**: landing this wave makes the ad *true* instead of deleting it — a better outcome than Pass-2's own default, worth noting explicitly since it changes the disposition of an already-filed finding. |
| **Legacy Python solver** (`app/solver/futoshiki.py` per `web/api/CLAUDE.md`'s file tree) | **Does not exist in the actual tree.** `web/api/src/app` has no `solver/` directory at all (confirmed: `find web/api/src/app -name "*.py"` lists only `api/` and `__init__.py`) — `web/api/CLAUDE.md`'s file tree is stale on this point (a docs-accuracy gap, out of this report's scope to fix, flagged for the fold pass). |
| **Frontend** (`web/frontend/src/`) | **Zero Futoshiki component, zero mention in any design doc.** `design-union.md` (49KB, Pass 2.5's full component-mapping spec) contains **zero occurrences** of "futoshiki," "inequality," or "caret" (confirmed by direct grep across all of `pass2/` and `pass25/`). The frontend has **no router** (`web/frontend/CLAUDE.md`: "No router, no state library"), **no Storybook.js** (confirmed: no `storybook` in `package.json`, no `.storybook/` directory). |
| **Two-layer topology** (`src/sudoku/` + `src/skin/`) | Prototyped in Pass 2 (`two-layer-frontend.md`, worktree `wf_8e868dc7-61a-15`) but **not landed on master** — the live tree is still the flat `components/custom/` layout I read directly. Path aliases are `@sudoku`/`@skin`, and an ESLint boundary rule bans `@sudoku/*` from `skin/**`. This alias is **sudoku-named, not puzzle-generic** — see F8. |

**One terminology trap worth resolving before any of the rest of this spec is read**: the task brief's phrase "storybook frontend" and `design-union.md`'s own title ("THE STORYBOOK-GLASS UNION SPEC") both use "storybook" to mean the **pop-up-picture-book visual diegesis** (Yoshi's-Story-derived hand-drawn aesthetic) that the whole frontend is already built in — **not** the component-development tool Storybook.js. I confirmed this by reading `design-union.md` in full: every one of its ~15 uses of "storybook" is in phrases like "storybook page," "storybook identity," "storybook-coded" — describing the diegetic register, never the npm package. **This spec treats "storybook frontend" as "a Vue component built in the existing hand-drawn visual language," not as a request to add Storybook.js tooling.** If the owner meant the literal tool, that is a materially different (and much larger — new devDependency surface, `.storybook/` config, story files per component) ask that this spec does not cost; flagging the ambiguity rather than guessing wrong silently.

---

## 2. THE SPEC

### 2.1 Rust core additions

**2.1.1 Required fix (not a gate — a precondition): swap the shipped solve config.** `solve_futoshiki()` (`csp.rs:112-119`) currently uses `Pruning::ForwardChecking` + `Ordering::FailFirst`, no backjumping — the same config the crate's tests exercise at N=3/4 only. **Measured** (§4.1 below): this config cannot find a solution to an *unconstrained* N≥6 Futoshiki board within the crate's own default 1,000,000-node budget. Fix: mirror `py.rs::solve_sudoku`'s production override (`Pruning::Ac3` + `Ordering::DomWdeg`) — measured to solve N=4..9 unconstrained boards in **0 backtracks, sub-0.1ms** each. This is a one-line change to `csp.rs:113-114`, but it is load-bearing for every board size ≥6 the wave might ever support, and it is untested today because `tests/futoshiki.rs` never exercises N≥5.

**2.1.2 New: `csp-solver/src/puzzles/futoshiki/generate.rs`.** Mirrors `sudoku/generate.rs`'s shape exactly:
- `fn seed_latin_square(n: u32, rng: &mut SimpleRng) -> Vec<u32>` — solve an empty `FutoshikiPuzzle` (Ac3+DomWdeg, first solution) to get a complete Latin square. (Not a dedicated Latin-square-construction algorithm — reuses the existing solver, same pattern Sudoku's own `generate_board_slow` uses for its seed step.)
- `fn place_inequalities(square: &[u32], n: u32, count: usize, rng: &mut SimpleRng) -> Vec<(usize, usize)>` — **new logic, no Sudoku analog**: pick `count` orthogonally-adjacent cell pairs (the only pairs a caret can visually represent — see F4) whose values already satisfy `>`/`<` in the seed square, so the seed itself remains a valid, non-conflicting starting point.
- `fn generate_board_slow(n, difficulty, target_holes, inequality_count, rng) -> (Vec<u32>, Vec<(usize,usize)>)` — hole-dig with a `max_solutions: 2` uniqueness check identical in shape to Sudoku's loop (`generate.rs:143-160`), except the CSP built at each candidate removal must include **both** the surviving fixed cells **and** the full inequality set (removing a value doesn't remove an inequality clue — inequalities are typically presented as permanent grid furniture in real Futoshiki puzzles, printed on the board itself, not "givens" that can be blanked).
- `measure_difficulty` equivalent: same backtrack-count-under-FC+FailFirst recipe as Sudoku's (`generate.rs:19-30`) — reusable verbatim once the CSP-builder signature accepts an inequality list.

**2.1.3 Validation additions to `create_futoshiki_csp`** (or a new `FutoshikiPuzzle::from_parts` constructor, since `parse()` is the only current entry point and it's a CLI-format parser, not fit for network input — see F11): every `(a, b)` inequality pair must satisfy `|row(a)-row(b)| + |col(a)-col(b)| == 1` (orthogonal adjacency) and both indices `< n*n`. Reject otherwise with a typed error (mirrors `api-error-taxonomy.md`'s `CspError::InvalidInput` — Futoshiki gets **no new error variant**, it reuses the existing four-variant family verbatim).

### 2.2 API surface (FastAPI)

New `web/api/src/app/api/routes/futoshiki.py`, mirroring `board.py`'s shape:

```
GET  /api/v1/futoshiki/random/{board_size}                       — generate (see F3: no difficulty tiers ship in v1)
POST /api/v1/futoshiki/solve                                      — solve a given board + inequality set
```

Pydantic models (`web/api/src/app/api/models/futoshiki.py`):

```python
class FutoshikiSolveRequest(BaseModel):
    values: dict[str, int]                    # same shape as SolveRequest.values
    inequalities: list[tuple[int, int]]        # (a, b) meaning cell_a > cell_b
    board_size: int = Field(ge=4, le=7)        # NOTE: not "size" — see F5

class FutoshikiSolveResponse(BaseModel):
    solved: bool
    values: dict[str, int]

class FutoshikiBoardResponse(BaseModel):
    values: dict[str, int]
    inequalities: list[tuple[int, int]]
    board_size: int
```

Error taxonomy: **reused verbatim**, zero new variants. `INVALID_INPUT` now also fires on non-adjacent inequality pairs (F4) and out-of-range `board_size`. `NOT_FOUND` fires when no pre-generated template exists for a `(board_size)` — Futoshiki ships **without a difficulty parameter in v1** (F3), so the route surface is deliberately smaller than Sudoku's `/random/{size}/{difficulty}`.

### 2.3 wasm surface (Option C, flat wire format)

Two viable shapes, genuinely different cost profiles:

**(a) Zero new Rust — generic `Csp` wasm class, client-assembled.** The frontend builds the CSP by hand: `n*n` calls to `add_variable([1..n])`, one `add_equals` per given, one `add_greater_than`/`add_less_than` per inequality, `2n` calls to `add_all_different` (rows+cols), then `solve(config)`. Every primitive already exists and already ships (`isomorphic.rs:328-464`, gated behind the `full-mirror` feature per `client-wasm-solve.md` §2.2 — **note**: the deploy-fork build currently compiles with `--no-default-features` → **sudoku-flat-wire only**, meaning the generic `Csp` class is presently **excluded from the shipped bundle** and would need `full-mirror` re-enabled or the generic class re-homed into the always-on module, a real (small) build-graph change, not zero-cost as it first appears).

**(b) New `csp-solver/wasm/src/futoshiki.rs`** — purpose-built flat wire, mirroring `sudoku.rs`'s pattern exactly (the pattern Option C's own gate already validated: flat `Uint32Array`, no string-keyed maps, seeded RNG since wasm has no wall clock):

```ts
export class FutoshikiSolveResult {
  readonly solved: boolean;
  readonly n: number;
  readonly backtracks: bigint;
  readonly solutions: Uint32Array;       // n*n per solution, concatenated
}
export function solveFutoshiki(
  board: Uint32Array, n: number,
  inequalities: Uint32Array,             // flat pairs [a0,b0,a1,b1,...]
  max_solutions?: number | null,
): FutoshikiSolveResult;
// generateFutoshiki(...) — UNPROVEN, gated (see G1/G2)
```

**Recommendation: (b).** It matches the already-shipped Sudoku wasm pattern exactly (one more purpose-built module, not a second axis of variation), keeps the deploy-fork bundle's `--no-default-features` posture intact (no need to re-enable `full-mirror` just for Futoshiki), and gets the same bit-parity-vs-native testing discipline `client-wasm-solve.md` §4 already established a harness for. Cost: ~120-180 lines (`sudoku.rs` is 179 L for a strictly harder surface — Futoshiki's wire is simpler, no subgrid parameter).

### 2.4 Frontend surface (storybook-language)

Reading `design-union.md` §3's component-mapping table against what Futoshiki actually needs, row by row:

| Sudoku component (existing) | Futoshiki analog | Change needed |
|---|---|---|
| `SudokuBoard.vue` | `FutoshikiBoard.vue` | New file, ~90% copy — same CSS-grid-of-inputs-over-absolute-SVG structure (`SudokuBoard.vue:102-140`). **One real difference**: `generateGridPaths(boardSize, subgridSize, ...)` (`gridPaths.ts:54`) already degrades gracefully to "no subgrid tier" when called with `subgridSize === boardSize` — the loop condition `i % subgridSize === 0` (`gridPaths.ts:81,98`) is never true for `i` in `1..<boardSize` when `subgridSize === boardSize`, so every line falls into `cellLines`, none into `subgridLines`. **This is a genuine zero-cost reuse point, not a gap** — Futoshiki's uniform Latin-square grid (no box divisions) is already exactly what this function produces when handed `n=boardSize`. Confirmed by reading the loop logic directly, not run live (cheap to verify with one `vitest` case — worth doing, not worth gating on). |
| `SudokuCell.vue` | `FutoshikiCell.vue` | Same input/glyph/ghost-rect structure; digit range is `1..boardSize` same as Sudoku's per-subgrid digit range — no new logic. |
| `HandwrittenGlyph.vue` + `glyphPaths.ts`/`glyphRegistry.ts` | Reused for digits verbatim. | **New**: caret glyphs. `glyphPaths.ts` currently has digit variants (0-9) and letters (A-G) only — no `<`/`>` entries. Needs 2-3 hand-drawn variants each for `<` and `>` (or one variant set mirrored, if the hand-drawn asymmetry of a mirrored `<`↔`>` reads acceptably — **untested**, flag as a design-review item, not a technical gate), registered through the same `pickVariantIndex`/`cellHash` spatial-hash mechanism (`glyphRegistry.ts:31-40`) so adjacent carets don't all render identically. |
| — (no equivalent) | **`FutoshikiCaret.vue`** (new, no pure-pencil precedent) | Positioned at cell-boundary midpoints using the *same* `cellSize = viewBoxSize / boardSize` math `gridPaths.ts` already computes (`gridPaths.ts:60`) — a caret between cell `(r,c)` and `(r,c+1)` sits at `x = (c+1)*cellSize`, `y = r*cellSize + cellSize/2`, rotated 90° for vertical neighbors. Renders as a hand-drawn glyph (soul-tier, per `design-union.md` row 2's rule: "no hover-glass over cells" — the union skin's own precedent says relational/soul geometry between cells stays untouched by the sheet ladder, so carets get **zero** union treatment, which is actually the *easy* part of this spec). |
| `HandDrawnGrid.vue` boil | Reused verbatim for the grid; carets need their **own** boil-frame set (a caret is a glyph, not a line — its "boil" should ride the same digit-wiggle mechanism `glyphAnimations.ts::createGlyphWiggle` already provides, not `gridPaths.ts`'s line-boil, since carets are closer to "small drawn marks" than "long lines"). No new animation *system* — a reuse of an existing one, applied to a new glyph class. |
| `useSudoku.ts` | `useFutoshiki.ts` | New composable, ~70% copy of `useSudoku.ts`'s state shape (`values`, `givenCells`, `solveState`, `boardGeneration`) plus a new `inequalities: Array<[number,number]>` field that is **never** user-editable (it's board furniture, not a given cell) and therefore doesn't participate in `overriddenCells`/`originalGivenCells` bookkeeping at all — a real, if small, divergence from Sudoku's state model worth calling out explicitly rather than copy-pasting blind. |
| Union sheet lader (vellum ControlPanel, washi tooltips, answer-key laminate) | **Inherited unchanged.** | The union's own component table (row 1/2: board+cells are SOUL, untouched by glass) already establishes the rule this spec needs: Futoshiki's board+glyphs+carets are soul-tier by the same argument that applies to Sudoku's grid+glyphs, so they get **zero** sheet treatment — nothing here to design, the existing verdict already covers it by extension. The answer-key laminate (`design-union.md` row 9) is board-shape-agnostic in its own spec (`AnswerKeyLaminate.vue` reads `cellRects`, not a Sudoku-specific shape) — it should work unmodified for a Futoshiki board's `peekSolution()` once `useFutoshiki.ts` exposes the same `originalGivenCells`-keyed solve call `useSudoku.ts` does. **Genuinely low-cost reuse, not hand-waved** — but untested against a non-square-subgrid board, since the laminate has never been built against anything but Sudoku (see G5). |

**Route/navigation**: given "no router, no state library" is a stated, deliberate architectural convention (`web/frontend/CLAUDE.md`, user memory), the default recommendation is a **puzzle-type selector within the existing single-page app** (a tab/segmented-control swapping `SudokuBoard`↔`FutoshikiBoard` and `useSudoku`↔`useFutoshiki`, no `vue-router`), **not** introducing client-side routing for a second page. If "route" in the owner's ratification meant an actual `/futoshiki` browser path, that is a materially larger, unstated architectural reversal (first router in the app's history) and should be confirmed explicitly before work starts — flagging the ambiguity rather than silently picking the cheap reading.

---

## 3. THE ATTACK — self-critique of the spec above

### F1 (CRITICAL, NEW FINDING, MEASURED) — the shipped `solve_futoshiki()` default cannot solve an unconstrained board at N≥6

```
n= 4  solutions_found=1  backtracks=        87  nodes_explored=        46  budget_exceeded=false  time=0.040ms
n= 5  solutions_found=1  backtracks=    140562  nodes_explored=     40007  budget_exceeded=false  time=60.170ms
n= 6  solutions_found=0  backtracks=   4561484  nodes_explored=   1000000  budget_exceeded=true   time=2093.235ms
n= 7  solutions_found=0  backtracks=   6460917  nodes_explored=   1000000  budget_exceeded=true   time=3247.684ms
n= 8  solutions_found=0  backtracks=   7561799  nodes_explored=   1000000  budget_exceeded=true   time=4456.779ms
n= 9  solutions_found=0  backtracks=   8881541  nodes_explored=   1000000  budget_exceeded=true   time=8551.157ms
```
(`pass3/futoshiki-gen-probe-output.txt` §1, full transcript)

Under the exact config `solve_futoshiki()` ships today (`Pruning::ForwardChecking` + `Ordering::FailFirst`, no backjumping — `csp.rs:113-114`), an **empty** N×N Futoshiki board (zero fixed cells, zero inequalities — just row+column all-different, i.e. "does any Latin square of this order exist," which is trivially true for every N) **fails to find any solution at N≥6**, hitting the crate's default 1,000,000-node budget every time and returning an empty solution vector. This was never caught because `tests/futoshiki.rs` only exercises N=3/4. It is not a hypothetical edge case: any Futoshiki product surface with a board-size selector reaching N=6 or above would hit this on the very first "generate a blank/trivial board" call, today, with zero other changes.

**Confirmed fixable**: switching to `Pruning::Ac3` + `Ordering::DomWdeg` (mirroring `py.rs::solve_sudoku`'s own production override) solves N=4 through N=9 in **0 backtracks each, sub-0.1ms** (§4.1, part 1b of the transcript). This is not a gate — it is a **required precondition fix**, one line, verified by direct measurement, that must land before any wave work proceeds, independent of which board sizes the wave ultimately ships.

### F2 (CRITICAL, MEASURED) — generation feasibility has a real, worse-than-Sudoku phase-transition cliff

Even after F1's fix, stripping cells from a seeded Latin square (no inequality constraints at all — the hardest, least-pruned case) shows a cliff that arrives at **higher** clue density than Sudoku's own already-fragile cliff (`rust-owned-puzzle-data.md` §3.3 found Sudoku's cliff between 50-60% at N=5; mine finds Futoshiki's between roughly 30-50%, worsening with N):

```
n= 6 keep=0.50 (18/36)  solved=true   backtracks=     10951  time=5ms
n= 6 keep=0.40 (14/36)  solved=true   backtracks=     12264  time=4ms
n= 6 keep=0.30 (10/36)  solved=false  backtracks=   5234539  time=2395ms
n= 7 keep=0.50 (24/49)  solved=true   backtracks=   1487618  time=857ms
n= 7 keep=0.40 (19/49)  solved=false  backtracks=   5289778  time=2567ms
n= 8 keep=0.60 (38/64)  solved=true   backtracks=    353299  time=245ms
n= 8 keep=0.50 (32/64)  solved=false  backtracks=   7230521  time=4919ms
```
(`pass3/futoshiki-gen-probe-output.txt` §2)

This is the expected direction — Futoshiki has one fewer all-different constraint per cell neighborhood than Sudoku (2 vs 3), so weaker propagation at the same board size — but the magnitude matters for the wave's scope: **N=8 already struggles at 50% clue density** (a plausible "medium" target) in under 5 seconds using a deterministic (non-randomized, adversarial-ish) strip pattern. A real generator's randomized retry loop would cost *more*, not less, per the same logic `rust-owned-puzzle-data.md` §3.2 already established for Sudoku (hole-digging's own loop crosses progressively lower effective densities and has a nontrivial timeout rate even for targets that finish comfortably above the measured floor).

**Important limitation of this measurement, stated honestly**: my probe places **zero inequality constraints** — it measures the pure Latin-square-completion floor, not full Futoshiki. Real inequality clues are additional binary constraints and should provide *some* extra pruning at the same fixed-cell count, which could push the real cliff lower (more forgiving) than what I measured. But inequality clues are also weak, local, boxed-`Custom`-dispatch constraints (F10) — I did not, and given this report's scope could not cheaply, measure whether their pruning contribution is large enough to matter at N=7/8. **This is exactly the gap G1 gates.**

**Part 3 (`max_solutions:2` uniqueness-checked hole-digging at ~75% target density) succeeded trivially (0-1ms) for N=5/6/7** — mirroring Sudoku's own finding that a high-clue-density tier is the only comfortably tractable one. This is genuine evidence for a conservative default: **ship N=4-7 at a single high-density ("Easy"-only) tier first**, exactly Sudoku's own N=5-Easy-only precedent (`rust-owned-puzzle-data.md` §3.5), rather than promising a Medium/Hard ladder with no measurement behind it.

### F3 (HIGH) — "difficulty" has no defined semantics for Futoshiki at all

Sudoku's `Difficulty` enum (EASY/MEDIUM/HARD) is defined by hole-count fractions (`generate.rs:132-136`) calibrated against Sudoku's own solved-board structure. Futoshiki has:
- A different clue vocabulary (fixed-cell count **and** inequality-clue count are both tunable — real commercial Futoshiki typically uses a *lower* fixed-cell density than Sudoku and compensates with inequality clues; there is no established formula in this repo, and I did not find or measure one).
- A measurably different (and by F2, worse) propagation-strength profile at the same board size, so Sudoku's backtrack-count difficulty bands (`web/api/CLAUDE.md`: "EASY (0 backtracks), MEDIUM (<50), HARD (>100)") **do not transfer** — they'd need their own calibration, which requires the generation prototype (G1) to exist first.
- No literature/prior-art anchor cited anywhere in this repo's own docs for Futoshiki difficulty (unlike Sudoku, where `sota-sudoku.md` at least cites a clue-density convention).

**Recommendation**: ship v1 with **no difficulty parameter** (route is `GET /futoshiki/random/{board_size}` only, single fixed high-clue-density tier) rather than fabricate EASY/MEDIUM/HARD bands with no measurement behind them — an honest scope reduction, not a missing feature.

### F4 (HIGH) — adjacency is unenforced at the solver boundary but load-bearing at the render boundary

`create_futoshiki_csp` (`csp.rs:88-91`) accepts **any** `(a, b)` cell-index pair for `add_greater_than` — there is no geometric-adjacency check anywhere in the Rust core. A caller could submit `cell 0 > cell 15` on a 4×4 board (opposite corners) and the solver would happily accept and solve it. The frontend's caret-rendering scheme (§2.4) has **no visual representation for a non-adjacent inequality** — a caret is drawn at a shared cell edge; there is no edge to draw it on for a non-adjacent pair. This is a genuine INVALID_INPUT gap that must be closed at the API/wasm boundary (§2.1.3), not left implicit — a valid-per-solver, unrenderable-per-frontend puzzle is exactly the kind of contract mismatch the existing `api-error-taxonomy.md` machinery exists to catch, and Futoshiki is the first surface that needs a *new* validation rule (adjacency) inside that otherwise-reused taxonomy.

### F5 (MEDIUM) — `size` means two different things across the two puzzle types, and reusing the name is a live footgun

Sudoku's API `size` parameter is the **subgrid** side length (board is `size²`; `size=3` → 9×9). Futoshiki has no subgrid — its natural size parameter is the **board** side length directly. If the Futoshiki route reuses the literal string `size` for a differently-scaled quantity, any shared frontend code, shared validation, or a future generic "puzzle size" concept silently breaks. §2.2's spec above deliberately names it `board_size` to avoid this — flagging it explicitly here because it is exactly the kind of naming collision `api-error-taxonomy.md` §2 built a whole contract-test mechanism for (`Difficulty`'s five-way parity check) precisely because "two things share a name" bugs are cheap to introduce and expensive to trace. **Recommendation**: if this wave lands, add one contract-test line asserting `board_size` never appears as a bare `size` alias anywhere in the new files — cheap insurance given the precedent.

### F6 (MEDIUM) — caret a11y is a genuinely novel case, not just "apply the existing pattern"

`design-refinement.md` §4 already specs the semantic baseline for the *board* (ARIA `grid`/`gridcell`, roving tabindex, per-cell `aria-label` derivation) and the existing convention for decorative glyphs (`aria-hidden="true"`, parent carries the label — §4.4). A caret sits **between** two gridcells with no native ARIA relationship primitive for that. The mechanically-correct application of the existing convention is: caret SVGs get `aria-hidden="true"`, and the constraint gets folded into **both** adjacent cells' `aria-label`s (e.g., "row 2, column 3, must be greater than the cell to its right"), read naturally on arrow-key cell-to-cell navigation the same way "given clue"/"your entry" labels already are (`design-refinement.md` §4.1). This is a coherent, in-convention design — but it has **never been run past a real screen reader** (neither has the rest of the board's a11y spec, per `fe-components-audit.md`'s own framing — this is not a regression, just an unverified spec, same status as the baseline it extends). **What's genuinely new here, not inherited**: is "must be greater than the cell to its right" the right verbal frame vs. "than the cell above" for a differently-shaped inequality, and does doubling every inequality's announcement onto *both* endpoints create redundant verbosity for a densely-constrained board (a 7×7 with a dozen carets could mean several cells carry 2-3 relational clauses each)? **Untested, not merely "should be fine."**

### F7 (MEDIUM) — the frontend spec above has zero design-review precedent behind it

Every Sudoku-side design decision this report leans on (`design-union.md`, `design-refinement.md`) was itself produced, then attacked, in a dedicated pass with named agents, screenshots, and measured perf gates. The Futoshiki frontend spec in §2.4 is this report's own first-draft synthesis — grounded in real code (the `gridPaths.ts` subgrid-degradation reuse point is a genuine, verifiable fact, not a guess) but **not** independently reviewed by a design-focused pass the way every Sudoku surface was. The caret glyph aesthetic in particular (hand-drawn `<`/`>` marks, mirrored-vs-distinct variants, boil treatment) is a **visual judgment call with no prior art in this repo** and no SOTA citation the way `handdrawn-games-sota.md` grounded the Sudoku union skin. This spec should not be read as "design-approved" — it is "technically coherent, not yet aesthetically reviewed."

### F8 (MEDIUM) — two-layer topology and alias naming create a real sequencing dependency

The `src/sudoku/`+`src/skin/` topology (`two-layer-frontend.md`) is prototyped but **unlanded** on master — the live tree is still flat `components/custom/`. Two consequences for this wave: (1) if the topology lands first, new Futoshiki files should target `src/futoshiki/`+`src/skin/`, and the ESLint boundary rule (currently banning `@sudoku/*` from `skin/**`) needs a symmetric `@futoshiki/*` rule added, not just copy-pasted; (2) the `@sudoku` alias name itself is **puzzle-specific, not domain-generic** — a second puzzle type is the first real test of whether that naming choice scales, and it doesn't cleanly (there is no natural "`@futoshiki` mirrors `@sudoku`" without also asking whether both should really be `@puzzles/sudoku`+`@puzzles/futoshiki` under one alias root). **This wave is the forcing function that should settle that naming question, not inherit it as an afterthought.**

### F9 (MEDIUM, INHERITED — not new, but directly load-bearing here) — the GAC-all-different kernel gap

`synthesis-pass1.md`'s P1 finding ("GAC all-different never runs on the solve path... Sudoku/Futoshiki run at forward-checking strength despite docs claiming otherwise") applies to Futoshiki's row/col all-different constraints identically to Sudoku's. F1/F2's measurements are effectively a **direct, Futoshiki-specific confirmation** of that P1 finding's real-world cost — the empty-board failure at N≥6 (F1) and the density cliff (F2) are exactly what "weaker-than-advertised propagation" predicts. `rust-owned-puzzle-data.md`'s own handoff (§9) already asked whoever lands the GAC fix to re-run the Sudoku N=5 phase-transition experiment afterward; **this report extends that same request to my Futoshiki probe** — if GAC-all-different lands for real, F2's cliff should be re-measured before finalizing which board sizes/tiers ship.

### F10 (LOW) — inequality constraints sit on the slow dispatch path by construction

`add_greater_than`/`add_less_than` (`lib.rs:203-226`) build a `LambdaConstraint` — the boxed/dynamic `Custom` variant of `ConstraintEnum`, per the crate's own devirtualization design (`csp-solver/CLAUDE.md`: "ConstraintEnum — devirtualized dispatch (NotEqual, AllDifferent, Custom)"). Every inequality clue in every Futoshiki puzzle therefore runs through the slower path, never the fast devirtualized one `NotEqual`/`AllDifferent` get. At the clue counts real Futoshiki puzzles use (single-digit-to-low-teens inequality clues per board) this is very unlikely to be the dominant cost next to F1/F2's all-different-driven search blowup — flagged for completeness and because a future perf pass on this surface should know where to look first, not because it's a wave-blocking finding on its own.

### F11 (LOW) — `FutoshikiPuzzle::parse`'s wire format is a CLI artifact, not an API shape, and must not leak

`parse()` (`csp.rs:29-68`) reads the CSC411 assignment's own multi-line whitespace-delimited file format (`N` / fixed-cell indices / values / inequality A-sides / B-sides — the exact shape of the dead `sample_input.txt` fixture). This is fine as an internal/CLI convenience but must **not** become (or leak into) the JSON API contract — §2.2's Pydantic models deliberately use the same `dict[str,int]`-keyed shape Sudoku's `SolveRequest` already established, plus a `list[tuple[int,int]]` for inequalities, rather than round-tripping the text format through HTTP. Worth stating explicitly since the parser is the *only* existing "puzzle in, puzzle out" convenience function today, and it would be an easy, wrong shortcut to expose it directly.

### F12 (COST/SCOPE, no severity) — this is not a small wave

Rough, file-count-based sizing (not a time estimate — this repo's own prior prototypes show wide variance per beat): **Rust** — 1 fix (F1) + 1 new module (`generate.rs`, ~150-200 L per Sudoku's own analog) + validation (~30 L) + tests (uniqueness, adjacency-rejection, N≥6 solve — none exist today). **PyO3** — a new `FutoshikiCSP`/`create_futoshiki_csp`/`solve_futoshiki`/(maybe)`create_random_futoshiki_board` block in `py.rs`, mirroring the Sudoku section's ~150 lines, plus the `maturin develop --release --features py` rebuild+reinstall cycle every PyO3 change requires (a real cycle-time cost this tranche's own reports repeatedly flag, e.g. `rust-owned-puzzle-data.md` §9). **wasm** — one new module (~150-180 L, `futoshiki.rs`), one bit-parity harness run (`client-wasm-solve.md` §4's own pattern). **FastAPI** — 1 route file + 1 model file + service-layer wiring into the already-built DI skeleton (`api-error-taxonomy.md` §4's `SudokuService` gets a `FutoshikiService` sibling). **Frontend** — ~5 new components (`FutoshikiBoard`, `FutoshikiCell`, `FutoshikiCaret`, plus glyph additions to `glyphPaths.ts`/`glyphRegistry.ts`) + 1 new composable (`useFutoshiki.ts`) + navigation decision (§2.4). This is a **multi-file, multi-crate, multi-language wave touching every layer of the stack**, gated behind a solver-level bug fix nobody had previously found. "Route + storybook frontend" undersells it if read as "thin wrapper around an already-done solver" — the solver's *solving* is done; everything else (generation, difficulty, validation, wire format, visual grammar, a11y) is new.

---

## 4. Prototype gates (explicit, measurable — what must be proven before the wave ships each capability)

| Gate | What it proves | Pass bar | Owner-facing risk if skipped |
|---|---|---|---|
| **G0 — config fix (F1)** | The one-line `Ac3`+`DomWdeg` swap actually fixes N=6-9 unconstrained solve, with a regression test at N≥6 added to `tests/futoshiki.rs` | `cargo test --test futoshiki` green including a new N=6+ case; `budget_exceeded=false` at N up to the max shipped board size | **Required precondition, not optional** — every other gate below is unreachable until this lands |
| **G1 — real (with-inequalities) generation cost** | Whether F2's no-inequality floor is representative, or whether real inequality clues meaningfully improve hole-digging cost at N=7/8 | Extend the probe: place a realistic inequality count (5-15 per board, adjacency-valid) before hole-digging; measure wall-clock at 3+ target densities per N∈{5,6,7,8}, 5+ trials each (this report ran single-trial only — a real gate needs the multi-trial discipline `rust-owned-puzzle-data.md` §3.2 used) | Shipping a board-size/difficulty combo that hangs a request thread in production (exactly the `/board/random` gap `rust-owned-puzzle-data.md` §3.4 already found for Sudoku — Futoshiki must not repeat it) |
| **G2 — difficulty rating** | Whether a backtrack-count band (or any other metric) meaningfully separates "easy" from "hard" Futoshiki instances at the shipped board sizes | A calibration run: generate N boards at varying clue/inequality densities, plot backtrack-count distribution, confirm bands don't overlap into meaninglessness (the failure mode `rust-owned-puzzle-data.md` §5 avoided for Sudoku by scoping the assertion to N=3 only, where a band was actually measured) | Shipping a fabricated EASY/MEDIUM/HARD label with no measured separation behind it — worse than shipping no label (F3's recommendation) |
| **G3 — adjacency validation, end-to-end** | The F4 gap is actually closed at every boundary (Rust constructor, PyO3, wasm, Pydantic) | A negative-control test per boundary (mirroring `api-error-taxonomy.md` §2.3's negative-control discipline): submit a non-adjacent pair, confirm `INVALID_INPUT`/400/422 at each layer, not a silent accept | A puzzle that solves server-side but cannot render client-side — a worse failure than an outright rejection, because it surfaces as a rendering bug, not an API error |
| **G4 — caret a11y, live screen-reader pass** | F6's spec actually reads sensibly under VoiceOver/NVDA, including the verbosity question on densely-constrained boards | Manual pass (or an axe-core/automated-a11y-tool run at minimum) against a built prototype board with ≥8 inequality clues on a 7×7 | Shipping an a11y story that is "spec-coherent" but untested, on a genuinely novel (no-prior-art-in-repo) interaction shape |
| **G5 — answer-key laminate on a non-Sudoku board shape** | Whether `AnswerKeyLaminate.vue`'s `cellRects`-driven layout genuinely generalizes, or was implicitly tuned against Sudoku's subgrid geometry | Build the Futoshiki board, mount the laminate, confirm solution glyphs land correctly over cells with carets present (carets must not visually collide with the laminate's glyph layer) | A union-skin feature that reads as "reused for free" turning out to need its own layout pass once carets are in the scene |
| **G6 — bit-parity, wasm vs native (Option C)** | The new `futoshiki.rs` wasm module matches native `solve_futoshiki` exactly, same discipline as `client-wasm-solve.md` §4 | 0 mismatches across a representative case set (fixed puzzles + a few generated-once-G1-lands boards), at each shipped board size | Silent client/server solve divergence — the exact failure class Option C's own gate was built to catch for Sudoku |

---

## 5. Verdict

**Holds, with amendments.** The wave is coherent and buildable end-to-end — every layer has a concrete spec, and every reuse claim in §2 is grounded in a specific, checked file:line, not asserted. But it does **not** hold as originally read ("route + frontend" as a thin wrapper around a finished solver): this report surfaces one **required, previously-undiscovered fix** (F1 — the shipped default config cannot solve its own unconstrained board at N≥6, verified by direct measurement) and one **real, measured feasibility risk** (F2 — a generation cliff at higher clue density than Sudoku's own already-fragile one) that must be closed or explicitly scoped around before the wave can honestly claim any board size beyond a conservative N=4-7, single-density-tier v1. Five further items (F3-F7, F9) are genuine open questions this spec answers with a stated default and an explicit gate, not silently — that is the amendment this report is making to the ratified plan: **ship it, but ship the F1 fix first as a precondition, ship v1 scoped to N=4-7 with no difficulty parameter (F3), and treat G1/G2/G4/G5 as pre-launch gates rather than post-launch cleanup**, since G1 in particular (generation cost with real inequality clues) is the one number that could change the shippable board-size range from what §2's spec assumes.

---

## Appendix — evidence files

- `pass3/futoshiki-gen-probe-output.txt` — full transcript of the 3-part measurement (empty-board seed cost at 2 configs, density-sweep, hole-dig-loop analog), Darwin arm64, `cargo build --release`, single-run-per-cell.
- Probe source: `/private/tmp/.../scratchpad/futoshiki-probe-wt/csp-solver/examples/probe_futoshiki_gen.rs` (throwaway worktree, not staged, not pushed — primary tree unmodified).

# T5-W2 LANE R — RUST EDGES (move 2.7 entire + two W0 adjudications)

**Tree** `csp-solver/` + `csp-solver/wasm/`. No frontend file touched (`git status` carries zero
`web/` paths). No commit, no push, no dev server. Base `a3ada202` (master).

**Method** nine rows, worked sequentially, `cargo test --workspace` green after each. Every number
below re-derived at this exit, not carried.

---

## The rows

| # | Row | Landed | Where |
|---|---|---|---|
| 1 | `assignment.rs` 607 L, the unwaived god module (U-09) | split along its two solve paths | `src/builder/assignment{.rs,/error.rs,/lap.rs,/branch_and_bound.rs}` |
| 2 | `cage.rs` 558 L — extract the inline test block | 253 L out, size + colocation edict both resolved | `tests/cage_revise.rs` |
| 3 | `search.rs` waiver re-derived | 504 → **534 L**, argument re-inspected, count made re-derivable | `src/solver/search.rs:27-43` |
| 4 | FUTOSHIKI CONFORMS | `create_futoshiki_csp(board, n, ineq) -> (Csp, given)` / `solve_futoshiki(…, &SolveConfig) -> Option<Vec<u32>>` | 11 files, zero shims |
| 5 | `from_difficulty` on `SudokuClass` | 5/5 `PuzzleClass` symmetry | `src/puzzles/sudoku/generate.rs:366` |
| 6 | CH-29 — the N=5 arg-range refusal fold (T3 §1 FOLD-DO) | refuses at the argument, exits 2 | `examples/generate_templates.rs:83-94` |
| 7 | wasm family dedup | `board_total` hoisted · `.code` on 5/5 generate verbs · `n()` naming ADJUDICATED (below) · `CspTimeoutError` WIRED | `wasm/src/*`, `src/error.rs`, `src/py/*` |
| 8 | `gac_timing_probe` panic (W0 adjudication 5) | FIXED budget-aware; both wall-time figures re-derived from two completing runs | `examples/gac_timing_probe.rs`, `docs/benchmarks.md` |
| 9 | `iai_queens.rs:8`'s dead 1,585,722 (W0 adjudication 7) | comment now cites the enforced mechanism, states no number | `benches/iai_queens.rs:1-16` |

---

## 1 — `assignment.rs` split

607 L, zero test lines, unmoved since T3, named in no waiver (rust-gestalt R1-1). The seam is the
module's own headline: **two solve paths**, dispatched on shape by `solve()`.

| file | L | holds |
|---|---:|---|
| `assignment.rs` | 284 | module docs, `SENTINEL`, the builder + its setters, `solve` / `solve_branch_and_bound` dispatch, `AssignmentSolution` |
| `assignment/branch_and_bound.rs` | 186 | the general CSP path + `DEFAULT_NODE_BUDGET` |
| `assignment/error.rs` | 90 | `AssignmentError` + `Display` + `Error` |
| `assignment/lap.rs` | 90 | the closed-form Kuhn-Munkres path + its `SCALE` |

**Public API unchanged.** `lib.rs:33`'s `pub use builder::assignment::{AssignmentBuilder,
AssignmentError, AssignmentSolution, SENTINEL, assignment}` resolves identically; both solve paths
are `pub(super)` inherent methods in descendant modules, so no field and no fn widened — a
descendant module already sees its ancestor's private items. Bodies moved verbatim (the only edits:
`super::kuhn_munkres` → `crate::builder::kuhn_munkres` for the module's new depth, intra-doc links
requalified, and the step comments renumbered from 1 in their new home).

## 2 — `cage.rs` test extraction

`#[cfg(test)] mod tests` opened at `:306`; production was 305 L and the trailing 253 L were **9**
test fns (rust-gestalt R1-2 says 11 — re-derived: `git show HEAD:…/cage.rs | grep -c '#\[test\]'`
→ **9**, and the row's own file:line list names 9). Extracted to `tests/cage_revise.rs`, 9 tests,
assertions unchanged.

The extraction is not a copy: the inline tests called `pub(crate) revise_impl`, which an
integration test cannot reach. Rather than widen it, every call now crosses
`ConstraintEnum::revise` — **the exact devirtualized arm `Csp` runs in production**. Zero
visibility widened; the tests moved closer to the shipped path, not further.

`grep -rn 'cfg(test)' csp-solver/src` → **1 hit**, `src/builder/kuhn_munkres.rs:135`, and it is
**structurally required**: `builder.rs:12` declares `mod kuhn_munkres;` PRIVATE, so an integration
test cannot reach `minimize` at all. Extracting it would mean making the module public — widening
the crate's API to move a test. Recorded, not "left".

## 3 — `search.rs` waiver

The waiver read "At 504 LOC the module sits four lines over the file budget"; HEAD was 528 and the
file had grown twice without the waiver being re-derived. The argument was re-inspected against the
tree and **still stands** (`BranchBound` impls `SearchPolicy` and calls `search`, so a split forces
`trait SearchPolicy`, `fn search` and `enum Step` — all private — to `pub(super)`). Rewritten with
the current count (**534 L**, this waiver included), its history (504 → 516 → 528 → 534), and an
explicit clause separating the two: the argument is a property of the module's *shape*, so growth
does not expire it, but the count is a citation and gets re-derived on every touch. The three cited
item names lost their line numbers — a self-referential line number in a comment rots on the next
edit of that same comment.

## 4 — FUTOSHIKI CONFORMS

Futoshiki was the 1-of-5 divergence, on three axes at once (R2-2): a sparse `FutoshikiPuzzle`
struct instead of `(board, n)`, no `given` return, no `&SolveConfig`, and `Vec<Vec<u32>>` where the
other four return `Option<Vec<u32>>`.

```rust
// before
create_futoshiki_csp(&FutoshikiPuzzle) -> Csp<BitsetDomain>
solve_futoshiki(&FutoshikiPuzzle) -> Vec<Vec<u32>>          // Ac3+Mrv+usize::MAX baked in

// after — kenken's signature, exactly
create_futoshiki_csp(board: &[u32], n: u32, inequalities: &[(usize, usize)])
    -> (Csp<BitsetDomain>, Vec<(VarId, u32)>)
solve_futoshiki(board: &[u32], n: u32, inequalities: &[(usize, usize)], config: &SolveConfig)
    -> Option<Vec<u32>>
```

`FutoshikiPuzzle` is **deleted**, not deprecated. It was the sparse encoding — the divergence
itself — and keeping it beside the dense board would have been the second path the wave exists to
kill. Its two real jobs re-homed as free functions in the same module:

* `from_parts`'s validation → **`validate_futoshiki(board, n, inequalities) -> Result<(), CspError>`**,
  same rules (indices in range, values `0..=n`, every caret orthogonally adjacent), now board-shaped
  and still the single implementation every boundary shares.
* `parse` (the CSC411 CLI text fixture format) → **`parse_futoshiki(input) -> (n, board, inequalities)`**.
  Its tests-only status and six `unwrap`s are R2-3's row, not this one; it is conformed, not judged.

Consequences, all landed:

* the generator's `csp_from_board` adapter (which existed only to build a `FutoshikiPuzzle`) is
  **gone**; its four call sites take `create_futoshiki_csp` directly and thread the returned `given`.
  Futoshiki's givens stopped being a wall of `add_equals` constraints and now ride the same
  `sudoku_given` seam the other four families use.
* the wasm wire's `validated_puzzle` became **`decode_inequalities`** — the futoshiki twin of
  `decode_cages` / `decode_thermometers`, so all five wires now read `board_total` + `decode_*`.
* `propagateFutoshiki` gained the explicit given-pinning loop its four siblings have (it used to
  rely on `add_equals` reaching the root fixpoint).
* every call site updated: `tests/{futoshiki,futoshiki_difficulty,oracle_and_invariance,gac_kernel_beats}.rs`,
  `benches/futoshiki.rs`, `wasm/tests/futoshiki_parity.rs`, `wasm/src/futoshiki.rs`,
  `src/puzzles/futoshiki{.rs,/generate.rs}`. **Zero compat shims, zero aliases.**
* the **python surface rides it as a correction**: PyO3 has no `solve_futoshiki` (R2-7), so
  `src/py/config.rs:23`'s claim of one is now cured to say the PyO3 surface is sudoku-only.
  `wasm/src/futoshiki.rs`'s twin claim ("the shipped native `solve_futoshiki` **and PyO3
  `solve_futoshiki`** paths") is cured the same way.

**Trajectory note, disclosed.** Moving futoshiki's givens from `add_equals` constraints onto the
given seam changes the *search trajectory* for futoshiki (not the solution set: the enumerate-all
and the `max_solutions: 2` uniqueness verdicts are trajectory-invariant, which is why every
generated board and every uniqueness check is unchanged and the whole suite is green).
`measure_difficulty`'s backtrack counts are trajectory-dependent by construction; no test or doc
pins a futoshiki backtrack figure, and the suite confirms it.

## 5 — `SudokuClass::from_difficulty`

`SudokuClass` was the only `PuzzleClass` witness without one (R2-4). Added; both brace-construction
sites in `tests/puzzle_class.rs` now go through it, so the constructor has consumers rather than
being surface for its own sake.

## 6 — CH-29, the N=5 fold

T3 §1 (`A13-deferred-delineation.md:65`, `C-deferred-disposition.md:42`) booked this as **FOLD-DO —
"touch the file, add the arg-range refusal"**, trigger = next file touch. The trigger never fired
(the file's last commit was `22514bae`, 2026-07-10) and T3's close claimed a fold that never
landed. This is that touch:

```
$ cargo run --release --example generate_templates -- 5 easy 1
generate_templates: N=5 is out of range — the shipped tiers are N=2,3,4. N=5 (25x25) is refused
by the locked N=5 policy: the library rejects that tier at the API, so a bank generated for it
could never be read back.
$ echo $?
2
```

The header's `5 -> 25x25` advertisement is gone, replaced by the refusal and its reason, with T3 §1
and CH-29 cited in the code-adjacent doc line.

## 7 — wasm family dedup

**`board_total` → its declared home.** `wasm/src/errors.rs:3-9` states the module's whole purpose
("those moves live here, in one place both wires depend on"); it hosted `coded_error`,
`flatten_solutions`, `domain_masks` and not this. Now:
`pub(crate) fn board_total(board: &[u32], side: u32) -> Result<usize, JsValue>`, taking the **board
side** — the Latin wires pass `board_size`, the boxed wires pass `n * n`. Three near-verbatim
copies (thermo, killer, kenken) and two inlined checks (sudoku ×2, futoshiki) collapse to five call
sites of one fn with one message vocabulary. The module doc, which still said "both purpose-built
game surfaces", now names all five.

**`.code` on 5/5 `generate*`.** `generateSudoku` (2 sites), `generateThermo`, `generateKiller`
threw a bare `JsError` with no `.code`; a JS caller could not discriminate a bad `n` from any other
failure on three of the five verbs (R4-5). All three now return `Result<_, JsValue>` and throw
`coded_error("INVALID_INPUT", …)`, matching `generateFutoshiki` / `generateKenKen`. The wire's five
families are now `JsError`-free; the only remaining `JsError` in the crate is
`wasm/src/assignment.rs` (`solveAssignmentCop`), which is feature-gated out of the lean ship and is
not one of the five families — flagged, not silently swept in.
`wasm/tests/verb_boundary.rs` asserts `instanceof Error` **and** `.code === "INVALID_INPUT"` on all
15 verbs, so the cure has a guard.

### `n()` naming — ADJUDICATED, and the row is REFUSED as specified

The row asks for "`n()` naming unified". Re-derived at citation, the premise does not hold, and the
unification as literally specified would be a lie in the wire and a break in the frontend:

* `n` on the sudoku/thermo/killer wire is the **sub-grid** side — `n = 3` is a 9×9 board.
* `board_size` on the futoshiki/kenken wire is the **board** side — `board_size = 5` is a 5×5 board.

These are two different quantities, and the 3/2 split follows the boxed/Latin geometry axis exactly,
not an accident of authorship. The repo already ruled on it (F5, quoted verbatim at
`wasm/src/futoshiki.rs:101-104`: "Named `boardSize`, never bare `n`/`size` — Sudoku's `n` is the
*subgrid* side, a different quantity"). Renaming either one to match the other would make the
getter's name disagree with its value.

It is also **out of this lane's fence**: `result.n` is read live by three frontend workers
(`games/{sudoku,thermo,killer}/solver/solver.worker.ts`), this lane may not edit frontend files,
and W2's solver-spine lane is rewriting those same five workers into one this wave. A wire rename
here would land a break in another lane's blast radius mid-wave.

**What was actually unified** — the part that was genuinely two vocabularies for one concept: the
board-length check. It had two spellings of the same sentence (`"(n*n)² = … for n = …"` vs
`"board_size² = … for board_size = …"`) across five files; it is now one fn, one message, one
`side` parameter, with the boxed/Latin difference expressed where it belongs (at the call site, as
`n * n` vs `board_size`) and documented once in `errors.rs`.

**Handed up** to the team lead: if the wire genuinely should speak one word, the honest move is
`subgridSize` for the boxed trio (not `n`→`boardSize`, which would change the value's meaning), and
it must ride the frontend lane, not this one.

### `CspTimeoutError` — WIRED, per the RESERVE's own terms

The RESERVE (T3-W4, ballot Q2/R-3) reads: *"RESERVE is a permanent recorded disposition… the
variant has no constructor… **If the cancel-driver ever lands, the reserved variant is the wire
point.**"* Read first, as instructed — and its condition is **met**: the cancel-driver landed.
`SolveConfig::cancel` (`config.rs:85`), `SolveStats::cancelled` (`config.rs:120`), the kernel guard
(`search.rs:231-234`), and the PyO3 `CancelToken` (`py/config.rs`) are all live at HEAD. So the
terms say wire it, and neither "wire something new" nor "remove" was ever a free choice.

Landed as one seam:

```rust
CspError::aborted(stats: &SolveStats) -> Option<CspError>
//  cancelled       ⇒ Timeout          (the caller's own act outranks the library's cap)
//  budget_exceeded ⇒ BudgetExceeded
//  neither         ⇒ None — a completed search that found nothing is a PROOF, not an abort
```

`py/sudoku.rs` was the site that conflated them: `if solutions.is_empty() && budget_exceeded` raised
`BudgetExceededError`, and a **cancelled** search fell through to `Ok(False)` — reporting "no
solution exists" for a search the caller stopped, which is exactly the conflation the whole
`CspError` family exists to prevent. It now calls `CspError::aborted`, so `CspTimeoutError` is
raisable for the first time since it was registered. Four born-tests in `tests/error.rs` pin all
three arms plus the both-flags precedence. The two `// reserved: no constructor until cancel-driver`
comments are gone — the constructor exists.

**Not touched, deliberately:** R5-3, the `"UNSAT"` vs `"UNSATISFIABLE"` drift between
`error.rs:92-95` and the five wasm literals. The gestalt's own disposition is "**ruling first** —
the shipped side is wasm" (the frontend contract asserts `"UNSAT"` at
`web/frontend/src/games/shared/solver/transport.test.ts:134`). A lane that picked a side would be
ruling by patch, and either direction breaks a live consumer. Handed up.

## 8 — `gac_timing_probe` (W0 adjudication 5) — FIXED, figures re-derived

The probe asserted `off.solved && on.solved` and aborted at
`examples/gac_timing_probe.rs:264` on `template::N4/hard/template-1`, which GAC-off cannot clear
inside the production budget — so the harness produced **nothing**, and its two wall-time figures
were unre-runnable.

The assertion was wrong, not the corpus. A ratio between a completed solve and a budget abort is
not a speedup; it is a comparison of two different events. The probe now discriminates:

* a state that found no solution **and hit its budget** → the board is recorded in a `Budget-dead`
  section by name with both node counts, and **excluded from every aggregate**;
* a state that found no solution and **did not** hit its budget → still aborts the run, loudly, as
  a soundness defect (the corpus is all-solvable by construction).

It completes in ~4m20s. Two consistency-checked runs banked
(`gac-timing-probe-after.txt`, `…-run2.txt`):

| | run 1 | run 2 |
|---|---|---|
| corpus aggregate (47 of 50 scored) | 64.81× | 65.73× |
| N=4 hard bucket (2 scored) | 73.12× | 73.98× |
| N=4 medium bucket (10) | 27.89× | 27.53× |
| nodes off→on (deterministic) | 1,153,388 → 7,094 | identical |
| budget-dead, GAC-off | `template::N4/hard/{1,2,3}` — 1M nodes, no solution (GAC-on: 203/644/281) | identical |

`docs/benchmarks.md` and `README.md` restamped off those runs: the aggregate row, the bucket row, a
new row for the three boards GAC-off cannot finish, and the minority cost re-derived
(Al Escargot 0.46×, Golden Nugget 0.61×, Inkala 0.35× — the old prose said 0.40–0.42 / 0.56 /
0.30–0.33). The stamp-note prose that said the probe "aborts on today's bank" is replaced by the
honest reading of the jump: **12.6× → 64.8× is the N=4 fixture re-cut at `d4faa412`, not a faster
propagator**, and it is said in those words.

## 9 — `iai_queens.rs:8` (W0 adjudication 7)

The comment asserted "1,585,722 instructions across 3 ephemeral runners" — a P6-era measurement
that outlived its own gate by two tranches and is wrong by **56,270** against the enforced golden
(`benches/iai_queens.baseline` = 1,529,452, graded ±2% by `iai_gate.sh`). The comment now names the
mechanism and states **no number**, with the reason it states none. The doc-truth `iai-golden-figure`
row (which gates the prose side) stays GREEN; the baseline file is **untouched**.

---

## Gates at exit

| gate | result | evidence |
|---|---|---|
| `cargo test --workspace` | **0 failed**, 30 `test result: ok` blocks, 212 passed (208 attributes + 4 doctests) across 28 binaries | `gate-cargo-test-workspace.txt` |
| god-modules >500 unwaived | **0** (was 3) + the waiver table | `gate-god-module-census.txt` |
| `make wasm` lean build | succeeds; **121,137 B** darwin, **−1,248 B** vs HEAD | `gate-lean-wasm-size.txt` |
| wasm verb boundary tests | **15** (gates.W2.rustEdges.wasmVerbBoundaryTests), all 15 verbs, all green | `gate-wasm-pack-test.txt`, `wasm/tests/verb_boundary.rs` |
| test count re-derived + restamped | 204 → **212**; 3 doc sites restamped | `doc-truth-GREEN-after.txt` |
| `scripts/check-doc-truth.mjs` | **0 RED / 13 GREEN** | `doc-truth-GREEN-after.txt` |
| iai baseline | **untouched** (`git diff --stat` shows no `iai_queens.baseline`) | below |
| `cargo fmt --all --check` / `cargo clippy --workspace --all-targets` | clean (one transitive `proc-macro-error2` future-incompat notice, not ours) | — |

**Test count, re-derived.** 204 → 212 total. The delta is +4 native `#[test]` (the `CspError::aborted`
arms) and +4 doctests unchanged; the 9 cage tests moved without changing the count, and the binary
count went 26 → 28 (`tests/cage_revise.rs`, `wasm/tests/verb_boundary.rs`). wasm-side
`#[wasm_bindgen_test]` went 14 → **29** (+15 verb-boundary), executed by `wasm-pack test --node`,
never by `cargo test`.

**iai baseline / instruction drift.** `benches/iai_queens.baseline` is byte-untouched. Callgrind
cannot run on arm64-darwin, so the ±2% band is graded on the runner and this lane cannot measure
it. The honest expectation: the bench is 8-queens under `LambdaConstraint` + `AllDifferent` + Ac3 +
FailFirst, and **nothing in this lane touches that path** — the search kernel, `ac3`, the
constraint dispatch, the orderings and the domains are unmodified; `assignment.rs` is pure code
motion (same items, same bodies, same monomorphization), and the futoshiki/wasm work is not on the
queens path at all. If the iai lane reds, it is a real finding and must be read as one, **not
absorbed by a re-baseline**.

## Rows handed up (not this lane's to rule)

1. **R5-3 `"UNSAT"` ≠ `"UNSATISFIABLE"`** — needs a ruling; the shipped side is wasm, and the
   frontend test pins `"UNSAT"`.
2. **`n()` vs `board_size()`** — refused as specified, with the derivation above. A real
   unification is `subgridSize` on the boxed trio, and it belongs to a lane that may edit the
   frontend.
3. **`wasm/src/assignment.rs`'s untyped `JsError`s** — outside the five families, feature-gated out
   of the lean ship, consumed by bbnf-buddy. Same class as R4-5; not folded in silently.
4. **`FutoshikiPuzzle::parse` (now `parse_futoshiki`)** — R2-3's tests-only row with six `unwrap`s,
   conformed here but not judged.
5. **`src/builder/kuhn_munkres.rs:135`'s inline test mod** — structurally required (private
   module); the colocation edict cannot reach it without a public-API widening.

## Environment hazard, logged

Mid-lane, a concurrent process ran `git checkout` between branches in this working tree
(`git reflog`: `HEAD@{0} checkout: moving from t5-w1-canary-fe-unit to master`), which reverted
every modified file and deleted every untracked one — acts 1–3 and the first evidence drop were
lost from disk and rebuilt from scratch. Everything this lane wrote is since mirrored outside the
repo after each act (`scratchpad/w2r-sync.sh save|restore`, 41 paths) so a second wipe costs one
command. Flagged for the lead: parallel lanes sharing one checkout will keep doing this, and the
lane that loses is the one not holding the branch.

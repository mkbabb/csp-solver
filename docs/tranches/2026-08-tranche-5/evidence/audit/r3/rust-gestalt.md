# RUST-GESTALT — the solver estate at HEAD

**Scope** `csp-solver/` + `csp-solver/wasm/` at `71456713d9f7361af80f09e1a456fc9787507e78` (2026-08-01).
**Baseline for deltas** `bbeb2b87` (T3 ship). **Read-only**: no edits, no commits, no installs.
**Method** every row carries `file:line` or the command that produced it. `UNKNOWN` where the record is silent.

**Headline.** The engine is healthy — clippy clean on both crates `--all-targets`, zero `#[ignore]`,
the T3 `gac/` split held, devirtualized dispatch intact, `include_dir!` embed live. The rot is at the
*edges*: three `src/` modules breach 500 L (one of them the never-split T3 carry-over), the wasm seam
is five hand-copied family files at up to **0.86 line-for-line identity**, the futoshiki native surface
is the sole shape divergence in an otherwise symmetric five-family API, the **204** tests on disk are
not the 208 on the record, and the `CspError` taxonomy that `src/error.rs` calls "the single vocabulary
every layer shares" is contradicted at the wasm boundary by its own code strings.

---

## §1 Module sizes — three breaches, one genuine

`find csp-solver/src csp-solver/wasm/src -name '*.rs' -exec wc -l {} + | sort -rn`

| file | HEAD | T3 (`bbeb2b87`) | Δ | waiver on record |
|---|---:|---:|---:|---|
| `src/builder/assignment.rs` | **607** | 607 | 0 | **none** |
| `src/constraint/cage.rs` | **558** | — (born `f8950257`, T4-W13) | +558 | **none** |
| `src/solver/search.rs` | **528** | 516 | +12 (`d4faa412`) | yes, `search.rs:28–38` |
| `src/solver/gac.rs` | 464 | 464 (`gac/mod.rs`) | 0 | n/a |
| `src/puzzles/sudoku/generate.rs` | 405 | 317 | +88 | n/a |

**R1-1 — `assignment.rs` 607 L is the only true god module.** Zero lines of it are tests; it has moved
zero lines since T3 and is named in no waiver. It is the crate's largest production file by 79 L.
(`grep -c '#\[cfg(test)\]' src/builder/assignment.rs` → 0.)

**R1-2 — `cage.rs` breaches 500 *only because of inline tests.*** `#[cfg(test)] mod tests` opens at
`src/constraint/cage.rs:306`; production is 305 L, the trailing 252 L are 11 test fns
(`:337,:362,:374,:384,:394,:407,:417,:523,:541` + helpers). Under the standing 2026-07-07 edict — "all
test files MUST be placed in a `tests/` dir, NEVER inline" — this is a *colocation* row, and moving it
resolves the size row for free. Same shape at `src/builder/kuhn_munkres.rs:135` (130 of 265 L inline).
These two are the only inline test mods left in `src/`
(`grep -rn --include='*.rs' '#\[cfg(test)\]' src wasm/src` → exactly 2 hits).

**R1-3 — the `search.rs` waiver's own number is 24 lines stale.** `src/solver/search.rs:29` reads
"At 504 LOC the module sits four lines over the file budget." HEAD is **528**. The waiver's *argument*
(splitting `BranchBound` out forces `SearchPolicy`/`search`/`Step` to widen to `pub(super)` — an
encapsulation regression) still stands on inspection; the cited magnitude does not, and the file has
grown twice since the waiver was written without the waiver being re-derived. Per the T2–T4 lesson
"numbers re-derived at citation," this is a live drift.

**R1-4 — the T3 `gac/` regression is cured and held.** T3 appendix B recorded `gac/mod.rs` 470→555.
At HEAD the module is a split dir under budget: `src/solver/gac.rs` 464 + `src/solver/gac/matching.rs` 203
+ `src/solver/gac/scratch.rs` 148. No regression.

**R1-5 — `tests/` files are the largest in the estate; edict scope is UNKNOWN.**
`tests/solver.rs` 1439 (was 1615 at T3 — shrank), `tests/lattice.rs` 977 (flat), `wasm/tests/dualization.rs` 465.
The 2026-07-04 order says "break files >500 lines"; the precept text that survives
(`docs/precepts/audits/REAUDIT-2026-04-30/03-substrate-deadcode.md:111`) scopes the rule to
`mod.rs/utils.rs/common.rs/helpers.rs`. Whether integration-test files bind is not settled on the record.
Flagged, not asserted.

---

## §2 The 0.6.0 five-family surface — symmetric but for futoshiki

**R2-1 — four of five native families are shape-identical.** Both seams conform exactly:

```
create_X_csp(board: &[u32], n: u32, [clues]) -> (Csp<BitsetDomain>, Vec<(VarId, u32)>)
solve_X    (board: &[u32], n: u32, [clues], config: &SolveConfig) -> Option<Vec<u32>>
```

sudoku `csp.rs:65,81` · thermo `csp.rs:34,98` · killer `csp.rs:45,111` · kenken `csp.rs:103,193`.

**R2-2 — futoshiki is the lone divergence, on three axes at once.**
`src/puzzles/futoshiki/csp.rs:132` — `create_futoshiki_csp(&FutoshikiPuzzle) -> Csp<BitsetDomain>`:
takes a struct, not `(board, n)`, and returns **no `given` tuple**, so it can't feed the
`solve_with_given` path its four siblings ride.
`src/puzzles/futoshiki/csp.rs:178` — `solve_futoshiki(&FutoshikiPuzzle) -> Vec<Vec<u32>>`: takes **no
`&SolveConfig`** and hard-codes `Ac3 + Mrv + max_solutions: usize::MAX` internally (`:180–184`), returning
*all* solutions where the other four return `Option<Vec<u32>>`. The F1 override is thus baked into
futoshiki and passed by the caller for everyone else — the same policy expressed two ways.
Consequence: the wasm wire has to hand-build a `FutoshikiPuzzle` through `validated_puzzle`
(`wasm/src/futoshiki.rs:191`) while the other four call `board_total` + `decode_*`.

**R2-3 — `FutoshikiPuzzle::parse` is vestigial product surface.** `src/puzzles/futoshiki/csp.rs:31`, a
CSC411 CLI text-format reader carrying six `unwrap()`s (`:33,:39,:45,:54,:60`). Consumers: `tests/futoshiki.rs:63,94`
and `tests/oracle_and_invariance.rs:372` — **tests only**. No shipped surface (wasm, py, frontend) parses text.

**R2-4 — `PuzzleClass` impls are symmetric; one constructor is missing.** All five name the same five
seams with no config-flag leakage (futoshiki `generate.rs:356`, sudoku `:364`, thermo `:181`, killer `:185`,
kenken `:244`). But `SudokuClass` (`src/puzzles/sudoku/generate.rs:357`) is the **only** class without a
`from_difficulty(n, difficulty)` constructor — futoshiki `:347`, thermo `:172`, killer `:180`, kenken `:239`
all have one. Callers of `SudokuClass` must brace-construct; callers of the other four need not.

**R2-5 — the difficulty axis is 2-of-5, deliberately, but it leaks a wrong name to JS.**
`Difficulty` is defined twice (sudoku `generate.rs:33`, futoshiki `:49`) and reused: thermo/killer import
sudoku's (`thermo/generate.rs:20`, `killer/generate.rs:24`), kenken imports futoshiki's — each documented
in the module header as a deliberate no-fourth-mirror. `measure_difficulty` exists only for sudoku
(`generate.rs:52`) and futoshiki (`:234`); thermo/killer/kenken have no measurement surface.
`tests/difficulty_parity.rs` guards the mirror set structurally (2 tests, discovery guard over `SCAN_ROOTS`).
The leak is on the JS side — see R4-6.

**R2-6 — the crate-root re-export is asymmetric.** `src/lib.rs:40` — `pub use puzzles::sudoku;` re-exports
one family at the root; the other four are reachable only through `puzzles::`. No rationale on the record.

**R2-7 — PyO3 exposes 1 of 5 families, and two docs claim otherwise.** `src/py.rs:56–60` adds
`SudokuDifficulty`, `SudokuCSP`, `create_sudoku_csp`, `solve_sudoku`, `create_random_board` — nothing else.
Two live doc sites assert a PyO3 futoshiki that does not exist: `src/py/config.rs:23` ("the `cancel=`
argument of `solve_sudoku`/`solve_futoshiki`") and `csp-solver/wasm/src/futoshiki.rs:238–239` ("the shipped
native `solve_futoshiki` **and PyO3 `solve_futoshiki`** paths"). Whether the 1-of-5 py surface is an
election or an omission: **UNKNOWN** — no record found.

---

## §3 Test estate — 204, not 208; oracles thin on the new three

**R3-1 — the count on the record is stale by four.**
`cargo test --workspace --lib --tests -- --list 2>/dev/null | grep -c ": test"` → **204**.
Breakdown: 190 across 22 integration files + **14** `unittests` (the two inline `src/` mods, §R1-2).
The 208 figure traces to `evidence/wgate/g2-counts.md` at `d70073f3` (T4 gate); HEAD is later.
Not a regression claim — a citation that must be re-derived, not carried.

**R3-2 — the wasm crate contributes zero native tests.** Workspace total == csp-solver total (204 both).
`wasm/tests/{dualization,futoshiki_parity}.rs` are `wasm_bindgen_test` only (5 + 9 = 14), executed by
`wasm-pack test --node csp-solver/wasm` (`.github/workflows/ci.yml:322–323`), never by `cargo test`.

**R3-3 — zero ignored, zero flaky-marked.** `grep -rn --include='*.rs' -e '#\[ignore' -e 'flaky'` over
`csp-solver/` returns one `#[should_panic(expected = "does not match its claimed difficulty")]`
(`tests/sudoku_generate.rs:44`, legitimate) and one historical note (`tests/solver.rs:1327`: six
`#[ignore]`d hard-9×9 stress tests **DELETED** at T4-W2 F5 rather than left rotting — correct disposition).

**R3-4 — clippy is clean.** `cargo clippy -p csp-solver -p csp-solver-wasm --all-targets` → one warning,
and it is transitive (`proc-macro-error2 v2.0.1` future-rejection notice), not ours. No `#[allow(dead_code)]`
and no `#[allow(unused…)]` anywhere in `src/` or `wasm/src/`.

**R3-5 — oracle coverage, per family.**

| oracle (independent of the solver) | site |
|---|---|
| AllDifferent brute force, GAC-on | `tests/oracle_and_invariance.rs:104` |
| N-Queens GAC on/off set identity | `tests/oracle_and_invariance.rs:190` |
| Futoshiki 4×4 brute force | `tests/oracle_and_invariance.rs:306` |
| CageSum / CageProduct vs cartesian brute force | `tests/cage.rs:106,153` |
| Cage `revise` soundness, randomized | `src/constraint/cage.rs:523,541` |
| Assignment COP vs exhaustive permutation | `wasm/tests/dualization.rs:97` |

Sudoku, Killer and KenKen inherit soundness through the AllDifferent + cage oracles (their cages are the
tested primitives; `tests/cage.rs:237` fixes a 4×4 Killer/KenKen partition explicitly). **Thermo has no
independent oracle at any level.** Its four tests (`tests/thermo.rs:32,72,90,100`) are all self-referential —
the same engine deals the board and re-solves it; `thermometers_hold` (`:24`) checks a seed invariant, not
solver soundness. Defensible (a tube is a chain of the already-oracled `add_less_than`), but it is the one
family with no differential guard of its own.

**R3-6 — `PuzzleClass` byte-parity covers 2 of 5.** `tests/puzzle_class.rs:54` (sudoku vs
`generate_board_seeded`), `:75`/`:96` (futoshiki vs the difficulty + tuned generators). Thermo/killer/kenken
were *born* through the dealer, so there is no incumbent to diff against — structural, not an omission,
but it means the dealer's contract is pinned by two families and asserted for three.

**R3-7 — 12 of the 15 shipped wasm verbs have no boundary test.** The 14 `wasm_bindgen_test`s cover
`solveAssignmentCop` (5) and the futoshiki wire (9: parity `futoshiki_parity.rs:106,116,139`, error contract
`:178,187,196,204,212,220`). **Zero** wasm-side tests for sudoku, thermo, killer, or kenken —
`solve*`/`propagate*`/`generate*` for four families cross the boundary untested. Only futoshiki has a
native-vs-wasm parity guard.

**R3-8 — the lean ship recipe is never test-executed.** `wasm-pack test --node csp-solver/wasm`
(`ci.yml:323`) builds with **default features** (`assignment` on). The deployed artifact is
`--no-default-features` (`ci.yml:361`). No test run exercises the exact byte-shipped feature set.

---

## §4 The wasm seam — 15 verbs, five hand-copied files

**R4-1 — the verb census is exact.** 15 = 5 families × {`solve*`, `propagate*`, `generate*`}, plus
`solveAssignmentCop`/`assignmentSentinel` (feature-gated out of the lean build) and `init`
(`wasm/src/lib.rs:66`). All 15 have live frontend consumers
(`grep -rl <verb> web/frontend/src` → 1–3 files each); `solveAssignmentCop`/`assignmentSentinel` → **0**
(documented as bbnf-buddy's, an external consumer).

**R4-2 — parametric duplication, measured.** Comment/blank-stripped, family names normalized to `X`,
`difflib.SequenceMatcher` matching-block ratio over `min(len)`:

| pair | matched lines | ratio |
|---|---:|---:|
| `thermo.rs` ↔ `killer.rs` | 183 | **0.86** |
| `killer.rs` ↔ `kenken.rs` | 183 | **0.84** |
| `thermo.rs` ↔ `kenken.rs` | 157 | 0.73 |
| `sudoku.rs` ↔ `thermo.rs` / `killer.rs` | 116 | 0.67 |
| `futoshiki.rs` ↔ `kenken.rs` | 147 | 0.67 |

Native side is no better: `thermo/csp.rs` ↔ `killer/csp.rs` **0.89**, `killer/generate.rs` ↔
`kenken/generate.rs` **0.74**. Each of the five wasm files repeats verbatim: the identical
`SolveConfig { Ac3, Mrv, max_solutions.unwrap_or(1).max(1), node_budget…or(Some(1_000_000)) }` block, the
identical four-line stats destructure, the identical `budget_exceeded && solution_count == 0` early return,
and an 8-getter `*SolveResult` pyclass-analogue (40 getter fns across five files, all bodies `self.field`).

**R4-3 — `board_total` is triplicated while its declared home stands empty.**
`wasm/src/thermo.rs:179`, `wasm/src/killer.rs:189`, `wasm/src/kenken.rs:205` — three near-verbatim copies
(kenken's differs only by `n*n` → `board_size`). `sudoku.rs:154` and `futoshiki.rs:197` inline the *same*
length check a fourth and fifth time. Meanwhile `wasm/src/errors.rs:3–9` states the module's whole purpose:
"Those moves live here, in one place both wires depend on, so neither game module back-depends on the other."
It hosts `coded_error`, `flatten_solutions`, `domain_masks` — and not this.

**R4-4 — accessor naming splits 3/2 on the JS wire.** `n()` at `sudoku.rs:84`, `thermo.rs:63,125`,
`killer.rs:64,126`; `board_size()` at `futoshiki.rs:105,179`, `kenken.rs:65,127`. Same split on the fn
parameters. Two vocabularies for one concept, visible to every JS caller.

**R4-5 — FAIL-EXPLICIT splits down the middle of `generate*`.** Two of five throw a typed, `.code`-carrying
error: `generateFutoshiki` (`futoshiki.rs:357` → `Result<_, JsValue>` + `coded_error("INVALID_INPUT", …)`)
and `generateKenKen` (`kenken.rs:325`, same). Three of five throw a bare untyped `JsError` with **no `.code`**:
`generateSudoku` (`sudoku.rs:278,288`), `generateThermo` (`thermo.rs:307`), `generateKiller` (`killer.rs:313`).
A JS caller cannot discriminate a bad-`n` from any other failure on three of the five generate verbs, while
the other two hand it `INVALID_INPUT`. Same verb family, two contracts.

**R4-6 — the KenKen wire imports a Futoshiki type name.** `generateKenKen(board_size, difficulty: FutoshikiDifficulty, seed)`
at `wasm/src/kenken.rs:327`; `generateKiller`/`generateThermo` take `SudokuDifficulty` (`killer.rs:309`,
`thermo.rs:302`). Five games, two wire enums — coherent as a core-axis decision (R2-5), leaky as a JS
surface: the KenKen consumer must `import { FutoshikiDifficulty }`.

**R4-7 — the lean path itself is sound; its self-description is stale in two places.**
Verified: `wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release --no-default-features`
(`ci.yml:361`), band fail `>127,500 B` (`ci.yml:444,465`), on-disk `wasm/pkg/csp_solver_wasm_bg.wasm` **122,385 B**
— inside band. Stale text:
- `.github/workflows/ci.yml:331` calls the lean artifact the "**sudoku + futoshiki** surface"; `ci.yml:375`
  in the *same file* says "the five puzzle families." Same-file contradiction.
- `csp-solver/wasm/Cargo.toml:7` `description = "… the sudoku, futoshiki, and assignment solve surfaces."`
  (`publish = false`, so it reaches no registry — but it is the crate's self-statement).
- `csp-solver/wasm/src/errors.rs:3` "**Both** purpose-built game surfaces — `crate::sudoku` and
  `crate::futoshiki`" — five consumers now.
`csp-solver/wasm/README.md` is five-family honest (`:11,29,41,56`). `csp-solver/README.md` likewise (`:121–123,181–184`).

---

## §5 Dead / vestigial surface beyond `set_domain` + `abi3`

Known rows re-confirmed, then five new.

**R5-0 (confirmed) — `set_domain`.** `src/variable.rs:57`. `grep -rnw --include='*.rs' 'set_domain' src wasm/src tests benches examples`
returns **exactly one line: its own definition.** Zero call sites anywhere, including tests.

**R5-0b (confirmed) — `abi3`.** `csp-solver/Cargo.toml:16`. `grep -rn abi3 .github pyproject.toml Makefile` → **no hits**.
The feature is never built by any lane.

**R5-1 (new) — `CspError::Timeout` is unconstructible, and its Python exception is therefore unraisable.**
`src/error.rs:64`, self-labelled at `:63` "reserved: no constructor until cancel-driver." Every reference is
a `match` arm or an assertion: `error.rs:78,95`, `py/errors.rs:60`, `tests/error.rs:30`. No construction site
in the tree. `CspTimeoutError` is registered on the Python module (`src/py.rs:71`) and can never be raised.

**R5-2 (new) — `ImplicationConstraint` has no path into the solver.**
`src/constraint/implication.rs:19` (99 L), re-exported at `src/constraint.rs:17`. It has **no `ConstraintEnum`
variant** (`src/constraint/dispatch.rs:27–34` lists NotEqual/AllDifferent/AllDifferentExcept/CageSum/CageProduct/Custom)
and **no builder method** — `grep -rnw add_implication` over `src wasm/src tests benches examples` → **0 hits**.
Its only constructor site in the entire estate is `tests/implication.rs` (10 tests). Public surface reachable
only by a caller hand-boxing it into `Custom(Box<dyn Constraint<D>>)`, which nothing does.

**R5-3 (new) — the wasm arm of the `CspError` taxonomy was never built, and the two vocabularies now disagree.**
`src/error.rs:17–19` documents "wasm via a typed **`WasmCspError`** that stamps a `.code` onto a genuine
`Error` instance"; `error.rs:88` names "**`CspJsError`.code**." `grep -rn 'WasmCspError\|CspJsError'` over the
tree returns **only those two doc lines** — neither type exists. The wasm side hand-rolls string literals
(`wasm/src/errors.rs:26` `coded_error`), with no compile-time tie to `CspError::code()`. And they have drifted:

| `CspError::code()` (`error.rs:92–95`) | wasm literal | sites |
|---|---|---|
| `"UNSATISFIABLE"` | **`"UNSAT"`** | `sudoku.rs:253`, `futoshiki.rs:338`, `thermo.rs:284`, `killer.rs:290`, `kenken.rs:308` |
| `"BUDGET_EXCEEDED"` | `"BUDGET_EXCEEDED"` | 5 sites |
| `"INVALID_INPUT"` | `"INVALID_INPUT"` | 22 sites |
| `"TIMEOUT"` | — | never emitted |

`src/error.rs:86–89` asserts of `code()`: "**This exact string** is what … a wasm `CspJsError.code` carries
across that boundary — the single vocabulary every layer of the taxonomy shares." That claim is **false at
HEAD** for the `Unsatisfiable` variant. Note the frontend contract is `"UNSAT"`
(`web/frontend/src/games/shared/solver/transport.test.ts:134`), so the wasm side is the one that ships and
`error.rs` is the one that is wrong — the fix direction is not obvious and belongs in a ruling, not a patch.

**R5-4 (new) — `src/solver/monotonic.rs` is a public module with no public item.**
`src/solver.rs:7` declares `pub mod monotonic;`; its sole item `propagate_monotonic` is `pub(crate)`
(`src/solver/monotonic.rs:21`). An empty node in the published doc tree.

**R5-5 (new) — the `AssignmentError` → `CspError` lossy mapping is still open.**
`src/error.rs:126–132`: `Infeasible` collapses onto `Unsatisfiable` because `AssignmentError` has no
budget-exhaustion variant. `error.rs:119–125` calls this "a separate, already ledgered item" — it is
still un-landed at HEAD, and it is the same conflation (`BudgetExceeded` vs infeasible) that the whole
`CspError` family exists to prevent, surviving inside the family's own conversion.

---

## Disposition summary

| § | row | severity | fix shape |
|---|---|---|---|
| 1 | `assignment.rs` 607 L, unwaived, unmoved since T3 | **HIGH** | split or waive on the record |
| 1 | `cage.rs` 558 / `kuhn_munkres.rs` 265 inline test mods | MED | move to `tests/`; resolves the size row |
| 1 | `search.rs` waiver cites 504, file is 528 | MED | re-derive the number in place |
| 2 | futoshiki's `create_/solve_` shape diverges from four siblings | **HIGH** | conform to `(board, n, clues, config)` |
| 2 | `SudokuClass` lacks `from_difficulty` | LOW | add |
| 2 | `FutoshikiPuzzle::parse` — tests-only, 6 unwraps | MED | delete or move behind `#[cfg(test)]` |
| 2 | py surface is 1-of-5; two docs claim a py futoshiki | MED | rule on scope, then fix the two doc lines |
| 3 | 204 tests on disk vs 208 on the record | MED | re-derive at citation |
| 3 | thermo has no independent oracle | MED | one brute-force 4×4 |
| 3 | 12 of 15 wasm verbs untested at the boundary | **HIGH** | parity tests in the futoshiki mold |
| 3 | lean `--no-default-features` build never test-run | MED | second `wasm-pack test` lane |
| 4 | 0.84–0.86 duplication across five wasm family files | **HIGH** | one generic solve/propagate shell + a per-family CSP fn |
| 4 | `board_total` ×3 (+2 inlined) while `errors.rs` is the declared home | MED | hoist |
| 4 | `n()` vs `board_size()` 3/2 split on the JS wire | MED | pick one |
| 4 | `generate*` FAIL-EXPLICIT 2-typed / 3-untyped | **HIGH** | `coded_error` on all five |
| 4 | KenKen wire imports `FutoshikiDifficulty` | LOW | alias or a neutral name |
| 4 | `ci.yml:331` + `wasm/Cargo.toml:7` + `errors.rs:3` two-family stale | LOW | text |
| 5 | `CspError` wasm arm never built; `"UNSAT"` ≠ `"UNSATISFIABLE"` | **HIGH** | ruling first — the shipped side is wasm |
| 5 | `CspError::Timeout` unconstructible, `CspTimeoutError` unraisable | MED | land the cancel-driver or drop both |
| 5 | `ImplicationConstraint` unreachable from any builder | MED | add `add_implication` or excise |
| 5 | `set_domain` zero call sites; `abi3` zero build lanes | LOW | excise (known) |
| 5 | `monotonic` public module, no public item | LOW | `pub(crate) mod` |
| 5 | `AssignmentError::Infeasible` still conflates budget/infeasible | MED | the ledgered variant |

**Commands of record**
- `git rev-parse HEAD` → `71456713d9f7361af80f09e1a456fc9787507e78`
- `cargo test --workspace --lib --tests -- --list 2>/dev/null | grep -c ": test"` → `204`
- `cargo clippy -p csp-solver -p csp-solver-wasm --all-targets` → 1 warning, transitive only
- `find csp-solver/src csp-solver/wasm/src -name '*.rs' -exec wc -l {} + | sort -rn` → 11,276 L total, three files >500
- `wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm` → `122385` (band 127,500)

ROW-COMPLETE

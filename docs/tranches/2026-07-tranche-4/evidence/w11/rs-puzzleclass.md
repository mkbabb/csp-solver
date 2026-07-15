# T4-W11 · lane RS — the `PuzzleClass` trait (rust keystone half)

Base HEAD `7d51f562`. Rust workspace only — zero frontend edits (CEN measures FE
read-only in parallel). The trait is **declared** and **implemented for both
shipped games**; W13 lands the generic `generate_by_digging<C: PuzzleClass>` and
the cage primitives. Additive minor on `csp-solver` 0.5.0.

## Born-RED probe (base, before the row)

```
$ grep -rn 'PuzzleClass' csp-solver/src csp-solver/wasm/src
$ echo $?
1
```

Empty at base — the P12 absence, rust side. After the row: 12 refs in `src/`.

## The trait surface (`csp-solver/src/puzzles/class.rs`)

`pub trait PuzzleClass` — the intersection the two shipped generators already
satisfy, drawn so one generic hole-digging dealer drives both. Divergence is
associated types + per-family methods, never config flags (the god-interface
guard; there is not one boolean toggle on the trait).

| Item | Kind | Sudoku | Futoshiki |
|---|---|---|---|
| `type Clue` | assoc type | `()` | `(usize, usize)` — a caret `a>b` |
| `type Puzzle` | assoc type | `Vec<u32>` | `(Vec<u32>, Vec<(usize,usize)>)` |
| `seed_solution(&self, rng)` | method | fixed shuffled first row + skeleton solve | `seed_latin_square` |
| `place_clues(&self, solution, rng)` | method | empty (no furniture) | `place_inequalities` |
| `solve_candidate(&self, board, clues, max)` | method | `sudoku_csp_skeleton` + `solve_with_given(gen_config, sudoku_given)` | `csp_from_board` + `solve_with_given(gen_config, &[])` |
| `target_holes(&self, board_len)` | method | difficulty bands (`/4`, `/1.75`, `/1.25`) | `holes_for_density` |
| `assemble(&self, board, clues)` | method | `board` | `(board, clues)` |

The **base-CSP seam** is `solve_candidate` (each family builds its own CSP
behind it — `Csp`/`VarId`/domain stay implementation detail, absorbing the
givens-threading divergence: sudoku threads givens through `solve_with_given`
against a shared skeleton, futoshiki bakes them into `csp_from_board`). The
**clue-furniture seam** is `place_clues`. Seed/target/assemble are the other
three genuine shared seams. Static dispatch (`<C: PuzzleClass>`) — no `dyn`, so
associated types are free.

The witness types are colocated with the generation code they delegate to, so
each method is a literal call into the function `generate_board_slow_with_rng` /
`generate_with_rng` already use:

- `SudokuClass { n, difficulty }` — `csp-solver/src/puzzles/sudoku/generate.rs`
- `FutoshikiClass { n, keep_density, inequality_count }` (+ `from_difficulty`) — `csp-solver/src/puzzles/futoshiki/generate.rs`

## The two impl seams — byte-identity, proven not asserted

`tests/puzzle_class.rs` is the W13 dealer written locally over the trait
(`deal_via_trait<C>`: one seeded RNG threaded seed→clues→dig, exactly as the
shipped generators do). It asserts the dealt puzzle equals the shipped seeded
generator **bit-for-bit**:

- sudoku n∈{2,3} × {Easy,Medium,Hard} × seed∈{1,7,42,12345} == `generate_board_seeded`
- futoshiki n∈{4,5,6} × {Easy,Medium,Hard} × seed∈{1,7,42} == `generate_futoshiki_difficulty_seeded`
- futoshiki tuned knobs × seed∈{3,99} == `generate_futoshiki_tuned_seeded`
- structural: seed is a `0`-free full grid; sudoku places no clues, futoshiki's carets hold on the seed

Byte-identity holds because the RNG call sequence is identical (shuffle first-row
→ [sudoku: none / futoshiki: shuffle pairs] → shuffle indices) and the solver
consumes no RNG. Sudoku's skeleton reuse is a speed optimization the dealt board
does not depend on (solution *counts* are reuse-invariant), so `solve_candidate`
rebuilding fresh per candidate deals the same board. **This is the RS acceptance
proof that the trait is the true intersection, not merely compiling.**

The existing `generate_board_slow_with_rng` / `generate_with_rng` bodies are
**unchanged** — the impls delegate; only additive items were introduced (a
`gen_config(max)` helper in sudoku/generate.rs naming the `Ac3`+`FailFirst` pair
the inline seed/uniqueness configs already spell out).

## Gates

| Gate | Command | Result |
|---|---|---|
| born-RED | `grep -rn PuzzleClass csp-solver/src` | empty (exit 1) at base |
| fmt | `cargo fmt --check` | clean |
| clippy | `cargo clippy --workspace --all-targets -- -D warnings` | clean (`warnings=deny`, `clippy::all=deny`) |
| tests | `cargo test --workspace` | **178 passed, 0 failed** |
| wasm | `cargo build -p csp-solver-wasm --target wasm32-unknown-unknown` | clean |

Test count: **174 baseline (unedited, all green) + 4 new** = 178. No existing
test was touched — the invariant suite passes unedited (x6 A6). The 4 new tests
are additive acceptance for the trait.

`proc-macro-error2` future-incompat is a pre-existing transitive-dep note
(pyo3's macro chain), not a `-D warnings` failure — clippy finished green.

## Semver posture — additive minor, no break

Every change is a **new pub item** or a **visibility widening**; no existing pub
item changed signature or behavior:

- NEW: `puzzles::PuzzleClass` (+ crate-root re-export `csp_solver::PuzzleClass`)
- NEW: `puzzles::sudoku::SudokuClass`, `puzzles::futoshiki::FutoshikiClass`
- WIDENED: `SimpleRng` `pub(crate)` → `pub` (module `puzzles::sudoku::rng` too),
  required because the trait names `&mut SimpleRng` in a pub signature — under
  `warnings=deny` a `pub(crate)` type there trips `private_interfaces`. The
  seeded generators already froze `SimpleRng`'s LCG as a public contract (their
  seeded output depends on it); promoting the type only names it. Re-exported as
  `puzzles::class::SimpleRng` beside the trait that consumes it.

`0.5.0` → additive `0.5.x`. No breaking change to any existing pub item.

## Handoff to W13

`generate_by_digging<C: PuzzleClass>` is `deal_via_trait` (see the test) minus
the test scaffold. Thermo/Killer/KenKen ship as one `impl PuzzleClass` each — no
new generator. If a family later needs sudoku's skeleton reuse for speed, the
trait absorbs it additively (a defaulted prepared-context method); the dealt
board is reuse-invariant, so it is an optimization, not a contract change.

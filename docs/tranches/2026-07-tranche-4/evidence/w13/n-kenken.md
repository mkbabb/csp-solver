# T4-W13 · lane N — KENKEN / CALCUDOKU (ROW 4, the second cage consumer)

KenKen/Calcudoku lands on W11's `defineGame`/`PuzzleClass` contract as the FIFTH puzzle
family and the SECOND consumer of the W13 cage-primitive wave — the exclusive consumer of
lane P's `CageProduct`. A cage is one of `+`→`CageSum`, `×`→`CageProduct` (both lane P), or
`−`/`÷`→a 2-cell binary lambda that propagates via the engine's free `revise_binary_default`
path (Wall-1's binary sugar). So KenKen ships **zero new engine constraints of its own** — it
CONSUMES both cage primitives plus the free binary path, the far end of the contract Thermo's
zero-constraint proof (T), P's two `revise_impl`s, and Killer's `CageSum` consumption (K) set
up. One `KenKenClass` impl + one payload builder (`partition_into_cages`) + one furniture slot
(`KenKenCage.vue`) + one wasm/worker module + one `defineGame` declaration.

Base: the T4-W11 sealed contract atop the concurrent T + P + K tree. Lane N followed
`w13/t-thermo.md` + `k-killer.md`'s per-game recipe (the path worn smooth) and consumes P's
`add_cage_sum`/`add_cage_product` + the existing `LambdaConstraint` — zero interaction with,
zero edit to, any lane's surface.

## THE NEW BOARD GEOMETRY — the boxless Latin grid (the spec's flagged new render)

KenKen is the first family that is NOT a Sudoku variant: the board is a plain `n×n` Latin
square (row + column all-different, **no sub-grid boxes**), values `1..=n`, `boardSize` the
side directly (F5), sizes 4/5/6 (the futoshiki banding, minus 7 — product cages stay legible
at ≤6). The seed is the futoshiki `seed_latin_square` recipe over KenKen's own boxless CSP.
The furniture face (`KenKenCage.vue`) draws the cage outlines + `"12×"`-style operator targets
on that box-less grid — the π capture (`kenken-furniture-face.png`).

## THE CONTRACT DISCIPLINE — proven, not asserted

| Gate | Probe | Result |
|---|---|---|
| **zero `constraint/` edits (lane N)** | `git status csp-solver/src/constraint/` | only P's `cage.rs`/`dispatch.rs` in the tree — KenKen authors no propagator; `+`/`×` are `add_cage_sum`/`add_cage_product`, `−`/`÷` are `add_constraint(LambdaConstraint…)` (the free binary path) |
| **zero `games/shared/**` edits (lane N)** | `git status` grep — none of the shared diffs are kenken's | the shared shell was drawn right; KenKen inherits it whole (the `games/shared` diffs in the tree are the concurrent W12 lane's) |
| new game = the five slots | footprint | one `KenKenClass` + one payload builder (`partition_into_cages`) + one furniture slot (`KenKenCage`) + one wasm/worker module + one `defineGame` (`kenkenGame`) |

Lane-N footprint (additive): NEW `puzzles/kenken.rs` + `puzzles/kenken/{csp,generate}.rs` +
`wasm/src/kenken.rs` + `tests/kenken.rs` + `games/kenken/**`; edited only `puzzles.rs`
(`pub mod kenken`, +3) and `wasm/src/lib.rs` (`mod kenken` + `pub use` + doc bullet, +22 — all
additive, zero deletions).

## RUST — `KenKenClass` + `create_kenken_csp`, the `CageProduct`/`CageSum`/binary consumer

- **`create_kenken_csp`** (`kenken/csp.rs`): row + column all-different over `n×n` cells of
  domain `1..=n` (**no box** — the KenKen geometry) + per cage its operator constraint before
  `finalize`. `+`→`add_cage_sum`, `×`→`add_cage_product` (both the lane-P n-ary bounds
  propagators — they prune past the n-ary-lambda wall); `−`→`|a−b|==target`, `÷`→
  `max/min==target` (divisibility) as 2-cell `LambdaConstraint`s (they prune via the free
  binary-revise path). Unlike Killer, a cage carries NO `AllDifferent`: a KenKen cage may
  repeat a value across cells sharing neither row nor column (the Latin constraint is the only
  all-different).
- **`CageOp` + `KenKenCage`** (`kenken/csp.rs`): `KenKenCage {op, target, cells}` — the FIFTH
  `PuzzleClass::Clue` kind, none of sudoku's `()`, futoshiki's `(a,b)`, thermo's `Vec<usize>`,
  or killer's `KillerCage`. `CageOp{Add,Sub,Mul,Div}` carries the stable wire ordinal
  (`ordinal`/`from_ordinal`), single-sourcing the codec mapping.
- **`KenKenClass`** (`kenken/generate.rs`): `Puzzle = (Vec<u32>, Vec<KenKenCage>)`. Reuses the
  futoshiki `Difficulty` axis verbatim (KenKen IS a Latin family → **no fifth Difficulty
  mirror**; `difficulty_parity` unedited), mapped to a cage-size band (Easy=pairs, Hard=up to
  4-cell). `partition_into_cages` grows contiguous cages over the seed, then `assign_operator`
  reads each target off the seed (`+`→Σ, `×`→Π, `−`→|a−b|, `÷`→max/min) — the mirror of
  `place_inequalities`/`place_thermometers`/`partition_into_cages` picking furniture the seed
  satisfies. `target_holes` = the whole board (classic KenKen is cages-only; a given survives
  only where the cages underdetermine — the digger reverts any second-solution blank).
- **`generate_by_digging<C>`** (W11's handoff dealer): KenKen deals through it, no new
  generator. Dealt boards come back all-blank (pure cages-only KenKen) for the seeds tested.

| Rust gate | Result |
|---|---|
| `cargo fmt --check` | clean |
| `cargo clippy --workspace --all-targets -- -D warnings` | clean (only the pre-existing `proc-macro-error2` transitive note) |
| `cargo test --workspace` | **208 passed** = 201 baseline (T+P+K) UNEDITED + 7 additive (`tests/kenken.rs`) |
| **uniqueness sweep** (`max_solutions:2`) | GREEN — `dealt_kenken_boards_are_unique_by_construction`: n∈{4,5} × {Easy,Medium,Hard} × {1,7,42} each deal exactly one solution; it is a valid Latin square; every operator cage holds on it; every given agrees |
| **all four operators dealt** | `kenken_deals_every_operator_kind` — the union of cage ops across n∈{5,6} × seeds 1..8 is exactly `{Add,Sub,Mul,Div}`; each is proven SOLVED by the sweep's `cages_hold` |
| **CageProduct consumption (born-RED)** | `kenken_consumes_cage_product_and_prunes_at_the_root` — a bare 6×6 with one 3-cell `×`-6 cage prunes 4 and 5 (neither divides 6) from each member at root AC-3, leaving {1,2,3,6}. A pure n-ary lambda leaves 1..=6 (the product wall P cleared) |
| **CageSum consumption** | `kenken_consumes_cage_sum_and_prunes_at_the_root` — a 3-cell `+`-6 cage caps each member at 4, pruning 5/6 |
| **binary cages propagate free** | `kenken_binary_cages_propagate_free` — a `−`-5 cage collapses each member to {1,6}; a `÷`-2 cage drops 5 — via `revise_binary_default`, no new constraint |
| `difficulty_parity` | UNEDITED — KenKen added no `Difficulty` definition anywhere (reuses `futoshiki::Difficulty` core, `FutoshikiDifficulty` wire, futoshiki `Difficulty` FE type); both parity tests pass |

## WASM — the per-game wire (`solveKenKen` / `generateKenKen` / `propagateKenKen`)

Modeled on the sudoku/futoshiki/thermo/killer wires: flat `Uint32Array` **Latin** board
(`board_size²`, `0` = blank) + a **length-prefixed-with-op-and-target** cage buffer
(`[k, op, target, c, …]` per cage — the op ordinal is the extra field vs Killer's sum-cage
wire). Reuses `FutoshikiDifficulty` (no new wire mirror). `board_size`, never bare `n` (F5).
`decode_cages` rejects a truncated buffer / unknown op ordinal / a non-2-cell `−`/`÷` cage /
an out-of-range cell with a coded `INVALID_INPUT`. `wasm-pack --target web` build clean;
clippy clean; `solveKenKen`/`generateKenKen`/`propagateKenKen` exported.

### THE LEAN BAND — measured by isolation (the final wave figure)

Built once with kenken and once with it reverted (`mod kenken`/`pub use` commented), the
concurrent T/P/K tree held constant in both — the `make wasm` lean recipe (`wasm-pack …
--profile wasm-release --no-default-features`, wasm-opt applied):

| build | `csp_solver_wasm_bg.wasm` |
|---|---|
| without kenken (T+P+K present, isolated on this machine) | 112,487 B |
| **with kenken (`make wasm` lean)** | **121,855 B** |
| Δ from kenken add | **+9,368 B** |
| budget | 93,000 B |

**Attribution:** the +9.4 KB is the FIFTH game's WIRE SURFACE —
`solveKenKen`/`generateKenKen`/`propagateKenKen` + the `KenKenSolveResult`/`KenKenPuzzleData`
structs and their wasm-bindgen glue + `create_kenken_csp` + `generate_by_digging::<KenKenClass>`
+ `partition_into_cages` + the op-cage codec — **not constraint bloat** (KenKen adds zero
constraints; `CageSum`/`CageProduct` already compiled into the base at P's +2,608 B; the
`−`/`÷` binary lambdas reuse the existing `LambdaConstraint`). It is the same per-game-wire
cost sudoku/futoshiki/thermo(+9,766)/killer(+10,152) each pay. **Reading (the T/K/P flag):**
the 93,000 B budget was framed for new-constraint code; it does not account for five full
per-game wires. **Absolute joint: 121,855 B, over the ceiling — the five per-game wires, not
the cages.** Decision (revise the games-wave budget to +per-game-wire, or share the five
wires' result structs) rides the joint seal / WM lean reconciliation. Flagged, not silently
absorbed.

## FE — the thin consumer (zero shared edits)

- **Solver twin** (`games/kenken/solver/`): `protocol.ts` (threads the op-cage buffer),
  `solver.worker.ts` (`solveKenKen`/`generateKenKen`/`propagateKenKen`), `useSolver.ts`
  (conforms to `SolverPayloads<KenKenCage[]>` — Latin `board_size` sizing), `kenkenWire.ts`
  (the `[k,op,target,cells…]` codec, round-trip unit-tested, op-glyph↔ordinal single-sourced).
- **`game.ts`**: `kenkenGame = defineGame<…, KenKenCage[]>` — the real fifth-clue contract
  proof. Reuses `FutoshikiCell` (KenKen cells ARE plain Latin cells — ceil-√ marks, no
  subgrid) + the futoshiki `Difficulty`; the divergences are `clueFurniture: KenKenCage` + the
  op-cage payload + the 4/5/6 size band.
- **`useKenken.ts`**: a thin `useGameState` adapter (the R5 grammar) — the Latin identity
  `boardSizeOf` (like Futoshiki) + the cage furniture threading (like Killer). Reuses the
  futoshiki technique for Latin grading with an EMPTY inequality set (cage-blind — the cage
  relations ride the authoritative wasm solve/propagate, exactly as Killer's sudoku grader
  ignores cages). The `cages` ref is the sole furniture, carried through undo/persist.
- **`KenKenCage.vue`**: the furniture — dotted, inset, hand-drawn cage boundaries + a tiny
  corner target with its operator glyph (`"12×"`; a singleton prints a bare given number), ONE
  SVG over the box-less cell grid (`#overlay` slot). Deterministic STATIC corner jitter →
  PRM-safe; both themes; `aria-hidden`. Authored in-repo in the pencil idiom — `DesignSync` is
  a design-system SYNC tool (pushes a local library to claude.ai design projects), not a
  component generator and not the right instrument for authoring a game component; the pencil
  furniture is authored directly (the T/K precedent).

| FE battery | Result |
|---|---|
| `vue-tsc -b --force` | **exit 0** — incl. `useKenken`'s inference against the shared machine + `defineGame<…, KenKenCage[]>`. (A transient error in the concurrent W12 `games/shared/useDirtyBoard.ts` — created 12:58, NOT this lane's — was fixed by W12 mid-run at 13:14; my footprint carried zero errors throughout) |
| `test:unit` | **307 passed / 29 files** — 298 killer baseline + 9 kenken (kenkenWire 3 + game 6, incl. the `KenKenCage` mount render + singleton/operator label), zero regressions |
| `lint:eslint` | exit 0 (kenken/** is outside the four boundary globs — unrestricted, imports `@games/futoshiki`/`@games/shared`) |
| `lint:knip` | exit 0 (`game.test.ts` + `kenkenWire.test.ts` are the non-orphan anchors until W12 wires `GAMES[]`) |
| `prettier --check src/` | kenken files clean (the one warn is W12's concurrent `pencil/chrome/GameGallery/GameCard.vue`, not this lane) |
| `build` | exit 0 (kenken tree-shaken from the app dist — declaration layer until W12's `GAMES[]` row) |

## π — the furniture face

`kenken-furniture-face.png` (+ the `kenken-furniture-preview.html` harness): the `KenKenCage`
render over a REAL dealt board (`generate_kenken_seeded(6, Medium, 42)`, 18 cages, all-blank
cages-only) mid-solve, both themes. Every operator kind reads — `30×`, `7+`, `6×`, `2−`, `5÷`,
`10+`, `3−`, `8+`, `24×`, `4−`, `2÷` — plus the singleton bare given `3`. The cages read as
PENCIL (dotted, inset, jittered) on the BOXLESS Latin grid (no sub-grid box rules — the new
geometry), the sum/op label in each cage's corner cell. Evidence, not a repo golden — the
born-RED state is "no such game". The board-scene golden rides the W12 joint seal.

## SCOPE — what rides the joint seal (graceful degradation, honest)

- **The mountable scene/board** (`KenKenGame.vue`/`KenKenBoard.vue`) is NOT built this lane,
  exactly as T/K deferred theirs. `game.ts` + `useKenken` + `useSolver` + `KenKenCage` are
  complete and battery-green; the scene wiring + the `GAMES[]` registry row are W12's carousel
  seam ("App-level switch smoke rides the joint seal"). The FE proof is the component mount +
  the contract acceptance.
- **The `?board=` share permalink** is v1-deferred (`boardLink: "absent"`, `writeShareUrl`
  no-op); board + cages round-trip across a reload via a kenken-own localStorage key
  (`kenken-board-v1`), not (yet) across a shared URL.
- **CageProduct did NOT degrade to `×`-check-only** — P landed real product propagation (its
  §2 clause was not exercised), so KenKen ships `×` cages with full bounds-propagation. The
  spec's graceful-degradation prefix (KenKen minus fast product) was not needed.

## HEADLINE

KenKen/Calcudoku lands on `defineGame`/`PuzzleClass` as the FIFTH family and the exclusive
`CageProduct` consumer, with **zero `constraint/` edits, zero `games/shared/**` edits** (it
consumes `add_cage_sum` + `add_cage_product` + the free binary-lambda path, authors no
propagator); rust 208 green (201 T+P+K baseline unedited + 7 additive) incl. the
`max_solutions:2` uniqueness sweep, the all-four-operators-dealt gate, and the born-RED
CageProduct root-prune proof; FE battery green incl. the real `defineGame<…, KenKenCage[]>` +
the operator-cage furniture on the NEW boxless Latin board; `difficulty_parity` unedited.
**B4's Thermo+Killer+KenKen set is proven end to end.** One flag (shared with T/K/P): the lean
band is 121,855 B (over the 93,000 budget) — the fifth per-game wire surface (+9,368 B), not
constraint bloat; a budget/refactor call for the joint seal.

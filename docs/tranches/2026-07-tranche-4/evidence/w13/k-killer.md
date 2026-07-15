# T4-W13 · lane K — KILLER-SUDOKU (ROW 3, the `CageSum` consumer)

Killer-Sudoku lands on W11's `defineGame`/`PuzzleClass` contract as the FOURTH puzzle
family and the first CONSUMER of lane P's `CageSum` primitive. A cage is one existing
`AllDifferent` (≥2 cells) plus one `CageSum` = target — so Killer ships **zero new engine
constraints of its own**, exactly the back-half of the contract Thermo's zero-constraint
proof (T) and P's two `revise_impl`s set up. One `KillerClass` impl + one payload builder
(`partition_into_cages`) + one furniture slot (`KillerCage.vue`) + one wasm/worker module +
one `defineGame` declaration.

Base: the T4-W11 sealed contract atop the concurrent T (thermo) + P (cages) tree. Lane K
followed `w13/t-thermo.md`'s per-game recipe verbatim (the path worn smooth) and consumes
P's `Csp::add_cage_sum` — zero interaction with, zero edit to, either lane's surface.

## THE CONTRACT DISCIPLINE — proven, not asserted

| Gate | Probe | Result |
|---|---|---|
| **zero `constraint/` edits (lane K)** | killer defines no constraint; `grep revise_impl\|ConstraintEnum:: killer/**` | only a DOC mention in `csp.rs` — Killer consumes `add_cage_sum` (P) + `add_all_different` (existing), authors no propagator |
| **zero `games/shared/**` edits (lane K)** | lane-K footprint is NEW dirs + `puzzles.rs`/`wasm/lib.rs` only | the shared shell was drawn right; Killer inherits it whole |
| new game = the five slots | footprint | one `KillerClass` + one payload builder (`partition_into_cages`) + one furniture slot (`KillerCage`) + one wasm/worker module + one `defineGame` (`killerGame`) |

Lane-K footprint (additive): NEW `puzzles/killer.rs` + `puzzles/killer/{csp,generate}.rs` +
`wasm/src/killer.rs` + `tests/killer.rs` + `games/killer/**`; edited only `puzzles.rs`
(`pub mod killer`, +2) and `wasm/src/lib.rs` (`mod killer` + `pub use` + doc bullet, +14).
The `constraint/dispatch.rs` (+18), `csp.rs` (`add_cage_sum`), and `games/shared` /
`App.vue` / `registry.ts` / `pencil/**` diffs in the tree are the CONCURRENT P and W12
lanes' — untouched by lane K.

## RUST — `KillerClass` + `create_killer_csp`, the `CageSum` consumer

- **`create_killer_csp`** (`killer/csp.rs`): the Sudoku skeleton (row/col/box all-different,
  reusing `sudoku_given`) + per cage an `AllDifferent` (skipped for a singleton) and a
  `CageSum` = target, added before `finalize`. `CageSum` is the devirtualized n-ary
  propagator → **it prunes** (bounds consistency), not the n-ary-lambda wall.
- **`KillerClass`** (`killer/generate.rs`): `PuzzleClass` with `Clue = KillerCage {sum,cells}`
  (the FOURTH clue kind — none of sudoku's `()`, futoshiki's `(a,b)`, thermo's `Vec<usize>`),
  `Puzzle = (Vec<u32>, Vec<KillerCage>)`. Reuses the sudoku `Difficulty` axis verbatim (a
  Killer-Sudoku IS a Sudoku variant → **no fourth Difficulty mirror**; `difficulty_parity`
  2/2 unedited). `partition_into_cages` grows contiguous, size-banded (2..=4 + singleton
  fallback), value-DISTINCT cages over the seed — so each cage's all-different + sum hold on
  the seed (the mirror of `futoshiki::place_inequalities` / `thermo::place_thermometers`).
- **`generate_by_digging<C>`** (W11's handoff dealer): Killer deals through it, no new
  generator. Every cell lands in exactly one cage → the whole board is a partition; a
  singleton cage's `CageSum` pins its cell even when dug.

| Rust gate | Result |
|---|---|
| `cargo fmt --check` | clean |
| `cargo clippy --workspace --all-targets -- -D warnings` | clean (only the pre-existing `proc-macro-error2` transitive note) |
| `cargo test --workspace` | **201 passed** = 197 baseline (T+P) UNEDITED + 4 additive (`tests/killer.rs`) |
| **uniqueness sweep** (`max_solutions:2`) | GREEN — `dealt_killer_boards_are_unique_by_construction`: n∈{2,3} × {Easy,Medium} × 4 seeds each deal exactly one solution; givens agree; every cage (all-different + sum) holds on it |
| **CageSum consumption / prunes** | `killer_consumes_cage_sum_and_prunes_at_the_root` — a bare 9×9 with one 3-cell sum-6 cage caps each member at 4 (others'-min residual) at root AC-3, pruning 5..9. The SAME window `cage.rs`'s unit test banks; a pure n-ary lambda leaves 1..=9 (the wall P cleared) |
| **cage partition** | `dealt_boards_carry_holes_and_a_cage_partition` — every cell in exactly one in-range cage, sums positive, board dug |
| `difficulty_parity` | **2/2 unedited** — Killer added no `Difficulty` definition to any scanned root |

## WASM — the per-game wire (`solveKiller` / `generateKiller` / `propagateKiller`)

Modeled on the sudoku/futoshiki/thermo wires: flat `Uint32Array` board (`(n*n)²`, `0` =
blank) + a **length-prefixed-with-sum** cage buffer (`[k, sum, c, …]` per cage — variable
size, so not the fixed `[a,b]` pairs the caret wire uses). Reuses `SudokuDifficulty` (no new
wire mirror). `wasm-pack --target web` build clean; clippy clean.

### THE LEAN BAND — measured, over budget by the per-game wire (a FINDING, mirroring T)

| build | `csp_solver_wasm_bg.wasm` |
|---|---|
| prior joint (T+P, no killer) | 102,612 B |
| **with killer (`make wasm` lean, `--no-default-features` + wasm-opt)** | **112,764 B** |
| Δ from killer add | **+10,152 B** |
| budget | 93,000 B |

**Attribution:** the +10.1 KB is the fourth game's WIRE SURFACE —
`solveKiller`/`generateKiller`/`propagateKiller` + the `KillerSolveResult`/`KillerPuzzleData`
result structs and their wasm-bindgen glue (getters/free/from_abi) + `create_killer_csp` +
`generate_by_digging::<KillerClass>` + `partition_into_cages` — **not constraint bloat**
(Killer adds zero constraints; `CageSum`/`CageProduct` already compiled into the base at P's
+2,608 B). It is the same per-game-wire cost `sudoku`/`futoshiki`/`thermo` each pay
(thermo's cut was +9,766 B). **Reading (same as T's flag):** the 93,000 B budget was framed
for new-constraint code; it does not account for a full per-game wire. Decision — revise the
games-wave budget to +per-game-wire, or share the four wires' result structs (a wire
refactor beyond this lane) — rides the joint seal / WM lean reconciliation. Flagged, not
silently absorbed.

## FE — the thin consumer (zero shared edits)

- **Solver twin** (`games/killer/solver/`): `protocol.ts` (threads the cage buffer),
  `solver.worker.ts` (`solveKiller`/`generateKiller`/`propagateKiller`), `useSolver.ts`
  (conforms to `SolverPayloads<KillerCage[]>` — the fourth-arg clue seam), `killerWire.ts`
  (the `[k,sum,cells…]` codec, round-trip unit-tested).
- **`game.ts`**: `killerGame = defineGame<…, KillerCage[]>` — the real contract proof.
  Reuses `SudokuCell` (killer cells ARE sudoku cells) + the sudoku size/difficulty
  selectors; the ONE divergence is `clueFurniture: KillerCage` and the cage payload.
- **`useKiller.ts`**: a thin `useGameState` adapter (the R5 grammar) — reuses the sudoku
  subgrid math/node-budget/technique; the `cages` ref is the sole furniture, threaded into
  solve/propagate and carried through undo/persist (the mirror of futoshiki's `inequalities`
  / thermo's `thermometers`).
- **`KillerCage.vue`**: the furniture — dotted, inset, hand-drawn cage boundaries + a tiny
  corner sum per cage, ONE SVG over the cell grid (`#overlay` slot). Deterministic STATIC
  corner jitter → PRM-safe by construction; both themes; `aria-hidden` decorative. Authored
  in-repo in the pencil idiom (per T's precedent: `DesignSync` is a design-system *sync*
  tool that pushes a local library to claude.ai design projects — not a component generator,
  and not the right/safe instrument for authoring a game component; the correct action is to
  author the pencil furniture directly).

| FE battery | Result |
|---|---|
| `vue-tsc -b --force` | **exit 0** — incl. `useKiller`'s generic inference against the shared machine + `defineGame<…, KillerCage[]>` |
| `test:unit` | **298 passed / 27 files** — 290 in-tree baseline + 8 killer (killerWire 3 + game 5, incl. the `KillerCage` mount render), zero regressions |
| `lint:eslint` | exit 0 |
| `lint:knip` | exit 0 (`game.test.ts` is the non-orphan anchor until W12 wires `GAMES[]`) |
| `prettier --check src/` | clean (all matched files) |
| `build` | exit 0, killer tree-shaken from the app dist (declaration layer until W12's `GAMES[]` row) |

## π — the furniture face

`killer-furniture-face.png` (+ the `killer-furniture-preview.html` harness): the `KillerCage`
render over a REAL dealt board (`generate_killer_seeded(3, Easy, 42)`, 34 cages) mid-solve
(givens dark, a partial user fill in accent, the rest blank), both themes. The cages read as
PENCIL (dotted, inset, jittered), not CAD; the sums sit in each cage's corner cell. Evidence,
not a repo golden — the born-RED state is "no such game". The board-scene golden (furniture
over the live `GameBoard`) rides the W12 joint seal.

## SCOPE — what rides the joint seal (graceful degradation, honest)

- **The mountable scene/board** (`KillerGame.vue` / `KillerBoard.vue` — thin `GameScene`/
  `GameBoard` consumers) is NOT built this lane, exactly as T deferred Thermo's. `game.ts`
  (the contract declaration) + `useKiller` + `useSolver` + `KillerCage` are complete and
  battery-green; the scene wiring + the `GAMES[]` registry row are W12's carousel seam
  ("App-level switch smoke rides the joint seal"). The FE proof is the component mount
  (`KillerCage.vue`) + the contract acceptance, per the cross-wave spec.
- **The `?board=` share permalink** is v1-deferred for Killer (`boardLink: "absent"`,
  `writeShareUrl` no-op); board + cages round-trip across a reload via a killer-own
  localStorage key (`killer-board-v1`), not (yet) across a shared URL.

## HEADLINE

Killer-Sudoku lands on `defineGame`/`PuzzleClass` CONSUMING lane P's `CageSum` with **zero
`constraint/` edits, zero `games/shared/**` edits** (lane K adds no propagator, only
`add_cage_sum` + `add_all_different` calls); rust 201 green (197 T+P baseline unedited + 4
additive) incl. the `max_solutions:2` uniqueness sweep + the root-prune consumption proof; FE
battery green incl. the real `defineGame<…, KillerCage[]>` + the dotted-cage furniture;
`difficulty_parity` 2/2. **B4's Thermo+Killer prefix is proven end to end.** One flag (shared
with T): the lean band is 112,764 B (over the 93,000 budget) — the fourth per-game wire
surface, not constraint bloat; a budget/refactor call for the joint seal.

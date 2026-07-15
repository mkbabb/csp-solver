# T4-W13 · lane T — THERMO-SUDOKU (ROW 1, the contract proof)

Thermo-Sudoku ships FIRST with **zero new engine constraints** — the point being to prove
W11's `defineGame`/`PuzzleClass` contract before the Killer/KenKen cage primitives land. A
thermometer is a chain of binary `add_less_than` (Wall-1's free propagating path), so the
whole game is one `PuzzleClass` impl + one payload builder + one furniture slot + one
wasm/worker module + one `defineGame` declaration. **The gate on the primitives is GREEN.**

Base: the T4-W11 sealed contract (`PuzzleClass` in `puzzles/class.rs`, `defineGame` in
`games/registry.ts`, the five shared shells). Working tree is shared with the concurrent
W12 lane (it owns `registry.ts` / `App.vue` / `pencil/**` — its edits there are NOT this
lane's).

## THE CONTRACT DISCIPLINE — proven, not asserted

| Gate | Probe | Result |
|---|---|---|
| **zero `constraint/` edits** | `git diff --stat -- 'csp-solver/src/constraint/**'` | **EMPTY** — a thermometer is `add_less_than`, no new constraint |
| **zero `games/shared/**` edits** | `git diff --stat -- 'web/frontend/src/games/shared/**'` | **EMPTY** — the whole point; the shell was drawn right |
| new game = the five slots | footprint | one `ThermoClass` + one payload builder (`place_thermometers`) + one furniture slot (`ThermoTube`) + one wasm/worker module + one `defineGame` (`thermoGame`) |

Rust footprint (additive): NEW `puzzles/thermo.rs` + `puzzles/thermo/{csp,generate}.rs` +
`wasm/src/thermo.rs` + `tests/thermo.rs`; edited only `puzzles.rs` (`pub mod thermo`),
`puzzles/class.rs` (the `generate_by_digging<C>` dealer W11 handed off), `wasm/src/lib.rs`
(`mod thermo`), `tests/thermo_acceptance.rs` (grown from the W11 stub into the real module).
FE footprint: NEW `games/thermo/**` only.

## RUST — `ThermoClass` + the generic dealer

- **`create_thermo_csp`** (`thermo/csp.rs`): the Sudoku skeleton (row/col/box all-different,
  reusing `sudoku_given`) + each thermometer a chain of `add_less_than` bulb→tip, added
  before `finalize`. Binary sugar → **it propagates** (no n-ary lambda, Wall-1 free path).
- **`ThermoClass`** (`thermo/generate.rs`): `PuzzleClass` with `Clue = Thermometer =
  Vec<usize>` (the THIRD clue kind), `Puzzle = (Vec<u32>, Vec<Thermometer>)`. Reuses the
  sudoku `Difficulty` axis verbatim (a Thermo-Sudoku IS a Sudoku variant → **no fourth
  Difficulty mirror**; `difficulty_parity` 2/2 unedited). `place_thermometers` grows tubes
  on strictly-ascending orthogonal runs of the seed (the mirror of
  `futoshiki::place_inequalities`).
- **`generate_by_digging<C: PuzzleClass>`** landed in `class.rs` — the W11 handoff shape
  `tests/puzzle_class.rs` proved reproduces the shipped generators byte-for-byte. Thermo
  deals through it, no new generator.

| Rust gate | Result |
|---|---|
| `cargo fmt --check` | clean |
| `cargo clippy --workspace --all-targets -- -D warnings` | clean (only the pre-existing `proc-macro-error2` transitive note) |
| `cargo test --workspace` | **184 passed** = 179 baseline UNEDITED + 5 additive (thermo.rs 4, thermo_acceptance.rs +1) |
| **uniqueness sweep** (`max_solutions:2`) | GREEN — n∈{2,3} × {Easy,Medium} × 4 seeds each deal exactly one solution; givens agree with it; thermometers hold on it |
| **free-path prunes (born-RED sense)** | `a_thermometer_chain_prunes_the_free_path` — a bare `c0<c1<c2<c3` chain on an empty 9×9, root AC-3 drops 7/9 from the bulb and 1..3 from the tip: the binary chain propagates with **zero new constraint code** |
| `difficulty_parity` | **2/2 unedited** — Thermo added no `Difficulty` definition to any of the three scanned roots |

## WASM — the per-game wire (`solveThermo` / `generateThermo` / `propagateThermo`)

Modeled on the sudoku/futoshiki wires: flat `Uint32Array` board (`(n*n)²`, `0` = blank) +
a **length-prefixed** thermometer buffer (`[k, c, c, …]` per tube — variable-length, so
not the fixed `[a,b]` pairs the caret wire uses). Reuses `SudokuDifficulty` (no new wire
mirror). `wasm-pack --node`/`--target web` build clean; clippy clean.

### THE LEAN BAND — measured, over budget (a FINDING)

| | bytes |
|---|---|
| base (no-thermo lean, `--no-default-features`) | 90,238 |
| **thermo lean (`wasm-pack --profile wasm-release --no-default-features`)** | **100,004** |
| budget | 93,000 |
| Δ vs base | **+9,766** · **over budget by 7,004** |

**Attribution (twiggy, release codegen):** the +9.7 KB is the third game's WIRE SURFACE —
`solveThermo`/`generateThermo`/`propagateThermo` + the `ThermoSolveResult`/`ThermoPuzzleData`
result structs and their wasm-bindgen glue (getters/describe/from_abi/free) + `create_thermo_csp`
+ `generate_by_digging::<ThermoClass>` — spread across ~40 small functions, **mirroring the
per-game cost `sudoku` and `futoshiki` each already pay**. It is NOT constraint bloat
(thermo adds zero constraints). Hygiene fixes already applied trimmed the first cut
(100,710 → 100,004): dropped a `sort_unstable` that dragged in the whole unstable-sort
codegen, reused the already-compiled `sudoku_given` instead of a thermo twin, and replaced
the `flat_map` box loop with explicit push loops.

**Reading:** the 93,000 B budget was framed for *new-constraint* code (only +2,762 over
base) — it does not account for a full per-game wire (~+9.7 KB, the established cost of
`sudoku`/`futoshiki` each). No cheap reduction flips the verdict (reusing `SudokuSolveResult`
would save ~1.3 KB and add cross-module coupling). **Decision for the joint seal:** either
revise the games-wave budget to +per-game-wire, or share the three wires' result structs
(a wire refactor beyond this graceful-degradation lane). Flagged, not silently absorbed
(the "measure, don't assume" discipline).

## FE — the thin consumer (zero shared edits)

- **Solver twin** (`games/thermo/solver/`): `protocol.ts` (threads the thermometer buffer),
  `solver.worker.ts` (`solveThermo`/`generateThermo`/`propagateThermo`), `useSolver.ts`
  (conforms to `SolverPayloads<ThermoLine[]>` — the fourth-arg clue seam), `thermoWire.ts`
  (the length-prefixed codec, round-trip unit-tested).
- **`game.ts`**: `thermoGame = defineGame<…, ThermoLine[]>` — the FE contract proof made
  real (W11's `registry.test.ts` stub was the compile-time version). Reuses `SudokuCell`
  (thermo cells ARE sudoku cells) + the sudoku size/difficulty selectors; the ONE divergence
  is `clueFurniture: ThermoTube` and the thermometer payload.
- **`useThermo.ts`**: a thin `useGameState` adapter (the R5 grammar) — reuses the sudoku
  subgrid math/node-budget/technique; the `thermometers` ref is the sole furniture, threaded
  into solve/propagate and carried through undo/persist (the mirror of futoshiki's
  `inequalities`).
- **`ThermoTube.vue`**: the furniture — bulb + tube SVG overlay in the pencil idiom
  (deterministic STATIC jitter → PRM-safe by construction; both themes; `aria-hidden`
  decorative). Authored in-repo: `DesignSync` is a design-system *sync* tool (pushes a local
  library to the user's claude.ai design projects) — not a component generator, and not the
  right/safe instrument for authoring a game component; the pencil-idiom furniture is
  authored directly, the correct action.

| FE battery | Result |
|---|---|
| `vue-tsc -b --force` | **exit 0** — the whole FE type-checks, incl. `useThermo`'s generic inference against the shared machine |
| `test:unit` | **284 passed / 24 files** — 278 in-tree baseline + 6 thermo (thermoWire 3 + game 3), zero regressions |
| `lint:eslint` | exit 0 |
| `lint:knip` | exit 0 (`game.test.ts` is the non-orphan anchor until W12 wires `GAMES[]`) |
| `prettier --check src/` | thermo files clean (2 warns are W12's concurrent `pencil/chrome/GameGallery/**`, not this lane) |
| `build` | exit 0, 192 modules |

## π — the furniture face

`thermo-furniture-face.png` (+ the `thermo-furniture-preview.html` harness): the `ThermoTube`
render over a REAL dealt board (`generate_thermo_seeded(3, Easy, 42)`, 9 tubes), both themes.
Evidence, not a repo golden — the born-RED state is "no such game". The board-scene golden
(furniture over the live `GameBoard`) rides the W12 joint seal.

## SCOPE — what rides the joint seal (graceful degradation, honest)

- **The mountable scene/board** (`ThermoGame.vue` / `ThermoBoard.vue` — thin `GameScene`/
  `GameBoard` consumers) is NOT built this lane. `game.ts` (the contract declaration) +
  `useThermo` + `useSolver` + `ThermoTube` are complete and battery-green; the scene wiring
  + the `GAMES[]` registry row are W12's carousel seam (the cross-wave spec: "App-level
  switch smoke rides the joint seal"). App-level render/e2e ride that seal.
- **The `?board=` share permalink** is v1-deferred for Thermo (`boardLink: "absent"`,
  `writeShareUrl` no-op); the board + tubes round-trip across a reload via a thermo-own
  localStorage key, not (yet) across a shared URL. Documented in `thermoUrlState.ts`.

## HEADLINE

Thermo-Sudoku lands on `defineGame`/`PuzzleClass` with **zero `constraint/` edits, zero
`games/shared/**` edits** (git-diff-proven); rust 184 green (179 baseline unedited + 5
additive) incl. uniqueness + the free-path-prunes proof; FE battery green incl. the real
`defineGame<…, ThermoLine[]>` + furniture; `difficulty_parity` 2/2. **The contract is ready
— Killer/KenKen may proceed.** One flag: the lean band is 100,004 B (over the 93,000 budget
by 7,004) — the per-game wire surface, not constraint bloat; a budget/refactor call for the
joint seal.

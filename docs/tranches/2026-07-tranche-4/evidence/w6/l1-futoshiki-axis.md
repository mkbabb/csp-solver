# T4-W6 · L1 — Futoshiki grows a difficulty axis (GEN-2)

Lane L1 of wave T4-W6 (generation truth). Scope: ROW 1 only — wire an explicit
`Difficulty` axis through the tuned seeded futoshiki generator, surface it on the
wasm `generateFutoshiki` wire, prove it with seeded-determinism + ladder-
monotonicity + per-tier-uniqueness tests (born-RED first), rebuild the lean pkg.
No `web/frontend` source touched (L3 threads the frontend); the generated `pkg/`
is this lane's output.

Machine: darwin 25.4.0, aarch64. Toolchain: cargo nightly (default). Base wave
lean wasm baseline: 86,734 B.

---

## What changed

- `csp-solver/src/puzzles/futoshiki/generate.rs` — new `pub enum Difficulty
  { Easy, Medium, Hard }` with two private rungs: `keep_density()` (0.6 / 0.45 /
  0.3 — the ladder the wave spec names) and `inequality_count(n)` (n / 1.5n / 2n —
  carets rise as givens fall). New `pub fn generate_futoshiki_difficulty_seeded(n,
  difficulty, seed)` maps the enum to its rung and defers to the already-existing
  `generate_futoshiki_tuned_seeded`. The single-tier `generate_futoshiki` /
  `generate_futoshiki_seeded` entries are unchanged.
- `csp-solver/src/puzzles/futoshiki.rs` — re-export `Difficulty` +
  `generate_futoshiki_difficulty_seeded`.
- `csp-solver/wasm/src/futoshiki.rs` — new `#[wasm_bindgen] pub enum
  FutoshikiDifficulty` (flat re-declaration, twin of `SudokuDifficulty`) +
  `From<FutoshikiDifficulty> for futoshiki::Difficulty`. `generateFutoshiki`
  gains a `difficulty` argument: `(board_size, seed)` →
  `(board_size, difficulty, seed)`, mirroring `generateSudoku(n, difficulty,
  seed)`.
- `csp-solver/tests/futoshiki_difficulty.rs` — NEW born-RED gate file (3 tests).
- `csp-solver/wasm/tests/futoshiki_parity.rs` — `generate_wire_matches_native_*`
  now threads the three difficulty tiers through the wire↔native comparison;
  the out-of-range negative-control passes an explicit difficulty.
- `csp-solver/tests/difficulty_parity.rs` — registered the two new
  `Difficulty`-shaped enums in `SIBLING_DEFINITIONS` (`PascalCase`), plus a W6
  reconciliation note. This is the FAM-1 orphaned-gate guard: an unregistered
  Difficulty-shaped `enum` fails `no_unscanned_difficulty_definitions_exist` by
  construction.
- Version: `csp-solver` and `csp-solver-wasm` `0.4.0 → 0.5.0`; CHANGELOG stanza.
  **Manifest only — NOT published.** (Flagged for the team lead.)

---

## Gate 1 — futoshiki difficulty axis (born RED → GREEN)

### Born-RED: the axis does not exist at the base SHA

`generateFutoshiki(board_size, seed)` took no difficulty; there was "no
`Difficulty` type at any layer." The new test file references the not-yet-
existent symbols, so the crate does not compile — the axis's absence made
material:

```
$ cargo test --test futoshiki_difficulty
   Compiling csp-solver v0.4.0 (…/csp-solver)
error[E0432]: unresolved imports `csp_solver::puzzles::futoshiki::Difficulty`,
              `csp_solver::puzzles::futoshiki::generate_futoshiki_difficulty_seeded`
  --> csp-solver/tests/futoshiki_difficulty.rs:17:5
   |
17 |     Difficulty, FutoshikiPuzzle, create_futoshiki_csp, generate_futoshiki_difficulty_seeded,
   |     ^^^^^^^^^^ no `Difficulty` in `puzzles::futoshiki`
   |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ no `generate_futoshiki_difficulty_seeded` in `puzzles::futoshiki`
error: could not compile `csp-solver` (test "futoshiki_difficulty") due to 1 previous error
```

Value-level baseline — the shipped single-tier generator deals a flat 19
givens / 6 blanks / 5 carets on a 5×5 **every seed** (there is only one tier):

```
== BORN-RED BASELINE: shipped single-tier generate_futoshiki_seeded (N=5) ==
seed  givens  blanks  ineqs
   0      19       6      5
   1      19       6      5
   2      19       6      5
   3      19       6      5
   4      19       6      5
```

### GREEN: three distinct givens-tiers, seeded-deterministic, each unique 30/30

```
$ cargo test -p csp-solver --test futoshiki_difficulty
running 3 tests
test givens_strictly_decrease_easy_to_hard ... ok
test axis_is_seeded_deterministic ... ok
test each_tier_is_unique_30_of_30 ... ok
test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.36s
```

The ladder (N=5, 30 seeds/tier). Givens fall strictly 15 → 11 → 8; carets rise
5 → 7 → 10; each tier unique 30/30:

```
== AFTER: generate_futoshiki_difficulty_seeded ladder (N=5) ==
Easy    givens 15-15   blanks 10-10   ineqs 5-5     unique 30/30
Medium  givens 11-11   blanks 14-14   ineqs 7-7     unique 30/30
Hard    givens 8-8     blanks 17-17   ineqs 10-10   unique 30/30

== per-seed strict monotonicity (givens E>M>H), N=5, first 8 seeds ==
seed   E   M   H  strict?
    1  15  11   8  true
    2  15  11   8  true
    3  15  11   8  true
    7  15  11   8  true
   42  15  11   8  true
   99  15  11   8  true
12345  15  11   8  true
61453  15  11   8  true
```

(The ladder table above was produced by a temporary `examples/` probe deleted
before the battery; the assertions it demonstrates are permanently enforced by
`futoshiki_difficulty.rs`.)

Gate mapping — spec "After: `generateFutoshiki(n, difficulty, seed)` deals
~0.6/0.45/0.3 keep-density tiers, each unique 30/30, givens strictly decreasing
Easy→Hard": keep 0.6→15 givens, 0.45→11, 0.3→8 (25-cell board); unique 30/30 per
tier; strictly decreasing every seed. **CLOSED.**

---

## Gate 2 — Difficulty-parity registry (born RED → GREEN)

Adding two `Difficulty`-shaped enums tripped the FAM-1 orphaned-gate guard.

Born-RED (mid-battery, before registration):

```
---- no_unscanned_difficulty_definitions_exist stdout ----
found Difficulty-shaped definition(s) not in SIBLING_DEFINITIONS … :
["src/puzzles/futoshiki/generate.rs", "wasm/src/futoshiki.rs"]
```

GREEN (both registered as `PascalCase` siblings):

```
$ cargo test -p csp-solver --test difficulty_parity
running 2 tests
test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s
```

**CLOSED.**

---

## Gate — correctness (native + wasm)

`cargo test --workspace` green; the existing futoshiki suite (uniqueness by
construction, F1 regression, from_parts validation) holds:

```
$ cargo test -p csp-solver --test futoshiki
running 11 tests
test result: ok. 11 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s
```

Full workspace: no failures. Rust battery, verbatim:

```
$ cargo fmt --check                                  → FMT CLEAN
$ cargo clippy --workspace --all-targets -- -D warnings
    Checking csp-solver v0.5.0
    Checking csp-solver-wasm v0.5.0
    Finished `dev` profile … (clean; only the pre-existing proc-macro-error2
    future-incompat NOTE, not our code)
$ cargo test --workspace                             → 0 failures
```

Native↔wasm parity (G6) — the difficulty axis marshals bit-identically across
the wasm boundary, 0 mismatches. Run under the node harness (`wasm-pack test
--node`, from `csp-solver/wasm/`):

```
     Running tests/futoshiki_parity.rs
running 9 tests
test parity_generated_boards_n4_to_n7 ... ok
test parity_fixed_boards ... ok
test generate_wire_matches_native_n4_to_n7 ... ok   ← now iterates Easy/Medium/Hard
test result: ok. 9 passed; 0 failed; 0 ignored; 0 filtered out; finished in 0.71s
```

**CLOSED.**

---

## wasm ship build + byte budget

Built with the ONLY sanctioned recipe from repo root:

```
$ make -C csp-solver/wasm wasm
   Compiling csp-solver v0.5.0
   Compiling csp-solver-wasm v0.5.0
    Finished `wasm-release` profile [optimized]
[INFO]: Optimizing wasm binaries with `wasm-opt`…
[INFO]: ✨   Done
```

New lean artifact:

```
bytes:  87,152 B   (baseline 86,734 B; delta +418 B)
sha256: 1ac5e4becf5b5bd01b2527a1ebad4ecf97822d068fb327f8930d87d1c3d8ac76
file:   csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm
```

CI byte budget (`.github/workflows/ci.yml`, "lean raw-size budget (fail >93 KB)"):
fail threshold `93000` B. **87,152 < 93,000 — clears with 5,848 B headroom.**

Generated surface (`pkg/csp_solver_wasm.d.ts`):

```
export enum FutoshikiDifficulty { … }
export function generateFutoshiki(board_size: number, difficulty: FutoshikiDifficulty, seed: number): FutoshikiPuzzleData;
```

`pkg/package.json` → `@mkbabb/csp-solver-wasm@0.5.0`; no stray `pkg/.gitignore`.

---

## Version bump — FLAGGED, not published

`csp-solver 0.4.0 → 0.5.0` (crates.io-publishable) + `csp-solver-wasm 0.4.0 →
0.5.0` (`publish = false`, npm `file:`-linked). Manifest + CHANGELOG + Cargo.lock
updated; **nothing published.** Rationale: the `generateFutoshiki` signature
change is BREAKING for `@mkbabb/csp-solver-wasm`; the core crate gains additive
public surface (`Difficulty`, `generate_futoshiki_difficulty_seeded`). Minor bump
per the repo's pre-1.0 discipline (breaking/new surface across the 0.x minor
slot). The team lead owns the publish decision and reconciliation with W5 (which
also touched toolchain/manifests concurrently) — confirm whether 0.4.0 ever
reached crates.io before publishing 0.5.0.

## Lane boundary notes

- `web/frontend` source untouched. The worker still calls the 2-arg
  `generateFutoshiki(req.boardSize, req.seed)` — L3's edit; the regenerated
  3-arg `pkg/` surface is ready for it. No `constants.ts` `difficultyOptions`
  written here (L3).
- The π (futoshiki selector) and DELTA (margin de-launder) captures are ROW-1-
  adjacent / ROW-4 UI concerns, not this lane; the axis's proof is this probe
  table + the parity run, banked verbatim above.

# T4-W6 — consolidated gate table (VERIFY lane)

Adversarial re-verification of wave T4-W6 (generation truth), integrated working
tree, 2026-07-13. Machine: darwin 25.4.0, aarch64. Every gate re-run verbatim;
nothing trusted from the lane reports. Base SHA `8c6af343` (all W6 work is
uncommitted in the working tree).

**VERDICT: WAVE RED — one wave-owned blocker.** `cargo test --workspace` FAILS on
`difficulty_parity::no_unscanned_difficulty_definitions_exist` (cross-lane
integration miss, L1↔L3). Every other measurement gate is GREEN. One further red
(darwin golden `toggle-crest-dark`) is attributable to the concurrent T4-WM lane,
not W6.

## Component gates

| Gate | born-RED (reproduced) | close (re-run) | evidence pointer |
|---|---|---|---|
| 16×16 monotone (GEN-1) | **YES** — restored the base 16×16 Hard bank (`git checkout HEAD -- data/.../4/hard/template-*.json`), rebuilt+ran `zzz_gen_truth_probe`: `VERDICT: FAIL` exit 1, 3 inversions (hard max 0 < medium 300000; hard deep-search 0% < medium 10%; Hard 0%<50%) | **GREEN** — regenerated bank: exit 0, `easy 0/0/0%  ≤ medium 0/300000/10% ≤ hard 300000/300000/100%`, givens 192≥113≥94. Disposition (a). | `l2-grading-corpus.md`; probe `csp-solver/examples/zzz_gen_truth_probe.rs` |
| 9×9 tiers distinct (GEN-1) | **YES** (FC proxy bimodal — Easy≡Medium both 0 bt) | **GREEN via (b)** honest clue-count re-derivation — `clue_count_ladder_is_monotone_across_served_tiers` (in `sudoku_generate` 10/10). Live search grade deferred to W7 (recorded). | `l2-grading-corpus.md` |
| futoshiki difficulty axis (GEN-2) | **YES** — `generate_futoshiki_difficulty_seeded`/`Difficulty` were unresolved symbols at base (file did not compile) | **GREEN** — `cargo test --test futoshiki_difficulty` 3/3; wasm seeded-determinism 48 deals ×2 = 0 mismatches; ladder 5×5 givens 15/11/8, carets 5/7/10, strictly decreasing E>M>H at n=4..7 | `l1-futoshiki-axis.md`; VERIFY node script `scratchpad/futoshiki-determinism.mjs` |
| B-0 de-launder (ROW 4) | **YES** — base `freshBoardCopy` = "a fresh 9×9, medium" (bucket as measured fact), `git show HEAD:…/SudokuBoard.vue` | **GREEN** — current: `a fresh N×N` + ` — you asked for ${difficultyWord}` (request voice); ungraded board → no tier; prop doc updated | `l3-surface.md`; `SudokuBoard/SudokuBoard.vue:443-446` |
| corpus/live-gen parity (GEN-3) | n/a (coverage gap, not a live defect) | **GREEN** — `live_dealt_tiers_are_unique_and_within_the_corpus_bar` (node-count invariant, 25 deals). In-browser wall-time probe deferred to the e2e lane (recorded). | `l2-grading-corpus.md` |
| uniqueness gates (GEN-4) | **YES** — `verify_bank_uniqueness` ran in no CI lane; sudoku live-gen had zero tests | **GREEN** — `verify_bank_uniqueness` 45/45 unique exit 0; live-gen sweep green; both wired into ci.yml `rust` job (YAML parses; steps confirmed in job) | ci.yml `rust` job; `l2-grading-corpus.md` |
| correctness | — | **RED** — `cargo test --workspace` FAILS: `difficulty_parity::no_unscanned_difficulty_definitions_exist` panics on two unregistered frontend futoshiki `Difficulty` sites. Exactly 1 failing test workspace-wide (`--no-fail-fast` inventory). | see BLOCKER below |
| native==wasm parity | n/a | **GREEN** — `wasm-pack test --node`: `futoshiki_parity` 9/9 incl. difficulty-threaded `generate_wire_matches_native_n4_to_n7`; `dualization` 5/5 | `scratchpad/wasm-parity.log` |
| L4 identity (GENREUSE/VALUES/MRV) | n/a (refactor identity) | **GREEN** — VERIFY harness digest current-tree == base-SHA: `3ce40ab5cab45c11` over 37 cases (25 sudoku slow-dig + 12 futoshiki, each ×{FailFirst,Mrv}) | `scratchpad/idh/` |
| wasm byte budget | n/a | **GREEN** — `make -C csp-solver/wasm wasm` → 89,995 B, sha256 `1402f40a…cb8c6`; CI fail>93,000 → clears, 3,005 B headroom | `l4-solver-micro.md`; `scratchpad/wasm-build.log` |
| π (futoshiki selector) | size-only at base | **GREEN** — PNGs banked; selector renders Easy/Medium/Hard; `npm run build` green | `pi-futoshiki-panel-*.png`; `l3-surface.md` |
| DELTA (margin) | "a fresh 9×9, medium" | **GREEN** — "you asked for medium" (source-diff verified) | `SudokuBoard.vue` |
| iai gate | n/a | **DEFERRED** — no Valgrind on arm64-macOS; benches compile clean. Golden 1529452 ±2% must re-measure on CI Linux. | `benches/iai_gate.sh` |

## Full battery (VERIFY re-run)

- **Rust**: `cargo fmt --check` CLEAN; `cargo clippy --workspace --all-targets -- -D warnings` clean (only pre-existing proc-macro-error2 note); `cargo test --workspace` **RED (1 failure)** — see blocker.
- **Frontend**: `vue-tsc -b --force` GREEN (exit 0 — L3's reported RED cleared once the concurrent WM `useLongPress` file settled); `test:unit` 133/133; `lint:eslint` 0; `lint:knip` 0; `prettier --check src/` 0; `npm run build` GREEN (wasm chunk 89.99 kB ships).
- **Golden (darwin)**: **3/4** — `logo-light`, `cell-light`, `grid-corner-light` pass; `toggle-crest-dark` FAILS (1214 px, ratio 0.03) — attributed to concurrent T4-WM (`DarkModeToggle.vue` diff stamped "T4-WM rank 1: PINNED to pose 0", flips `is-pose-active` sunFrame→0). NOT a W6 file. Explained diff; not a W6 failure.

## BLOCKER (wave-owned) — `difficulty_parity` RED

`csp-solver/tests/difficulty_parity.rs::no_unscanned_difficulty_definitions_exist`
scans `SCAN_ROOTS` = `["src","wasm/src","../web/frontend/src"]` for
Difficulty-shaped declarations and asserts the discovered set == `SIBLING_DEFINITIONS`.
L1 registered only the two Rust enums (it ran before L3's frontend edits existed).
L3 then added two frontend futoshiki sites the scanner now discovers but no lane
registered:

- `web/frontend/src/games/futoshiki/types.ts:39` — `export type Difficulty = "EASY" | "MEDIUM" | "HARD";` — a genuine definition (twin of the registered `games/sudoku/types.ts`).
- `web/frontend/src/games/futoshiki/solver/useSolver.ts:46` — a comment "…the wasm `FutoshikiDifficulty` is a numeric enum (Easy/Medium/Hard = …" — a heuristic false-positive (line contains both `Difficulty` and `enum `). The sudoku twin has no such comment, so its useSolver.ts is not discovered.

Consequence: `cargo test --workspace` non-zero → the CI **`rust` lane fails**.
This voids the wave's own `correctness` gate and the "difficulty-parity registry"
close L1 claims.

**Remedy (team lead / a follow-up lane — VERIFY did not fix):**
1. Register `../web/frontend/src/games/futoshiki/types.ts` in `SIBLING_DEFINITIONS` as `Casing::Verbatim` (its source spells `EASY|MEDIUM|HARD`).
2. For `useSolver.ts`: reword the line-46 comment so it does not carry `enum ` + `Difficulty` on one line (the clean fix — it is not a definition), matching the sudoku twin which is not registered. (Registering it as `Verbatim` would also pass, but institutionalizes a comment as a "definition".)

## Outstanding for the team lead

- **BLOCKER above** — must land before the wave closes; CI rust lane is currently RED.
- **toggle-crest-dark golden** (WM, not W6) — reconcile with T4-WM: re-mint the darwin AND linux `toggle-crest-dark` goldens from the runner of record, or treat the pose-pin as a WM defect.
- **Version publish** — `csp-solver` 0.5.0 (crates.io) + `csp-solver-wasm` 0.5.0 (file:-linked) staged in manifests+lock+CHANGELOG, NOT published. `generateFutoshiki` gaining an argument is BREAKING for the wasm pkg. Confirm 0.4.0's crates.io state and reconcile with W5 before publishing.
- **iai gate** — re-measure on CI Linux/Valgrind (golden 1529452 ±2%); per L4, expect a small VALUES-driven decrease — re-baseline deliberately, do not auto-mint.
- **Linux goldens** — none owed from W6 (no W6-owned golden moved); the only darwin move is WM's toggle.
- **Futoshiki difficulty is runtime-only** (not persisted to `?difficulty=`/localStorage) — a mild sudoku↔futoshiki asymmetry L3 flagged; lead decides if URL/persistence threading is in scope.

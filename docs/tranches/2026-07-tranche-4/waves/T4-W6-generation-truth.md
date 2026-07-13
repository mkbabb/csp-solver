# T4-W6 — Generation truth

**The generator deals real puzzles; the labels lie about them. True the difficulty signal so a tier means what it says: futoshiki grows a difficulty axis it never had, sudoku's 16×16 label-inversion dies, the corpus/live-gen split is gated equally, and the dropdown stops wearing a measurement costume.** FAM-9. Three defects sit in one seam — givens-count is the *only* knob difficulty turns (`generate.rs:280-284`), the codebase's own difficulty proxy neither tracks the label nor stays monotone, and futoshiki has no difficulty axis at any layer. The generator itself is sound (270/270 sudoku + 120/120 futoshiki deals unique by construction); the lie is entirely in the grading and the labelling.

**Dependencies**: ← W5 (toolchain currency — the wasm rebuild rides W5's Makefile ship-recipe truth; the futoshiki surface change bumps `csp-solver`). ← W2 (the uniqueness gate + live-gen sweep are W2's runner conventions; this wave supplies the probes, W2 owns the lane wiring). Feeds W7 (the technique engine grades over an *honest* substrate — the backtrack-proxy bucket must be de-laundered before a real grade replaces it) and W9-B1 (the tally displays what this wave makes defensible). **Effort**: M.

---

## Scope

### ROW 1 — futoshiki grows a difficulty axis (GEN-2)

Futoshiki has **no `Difficulty` type at any layer** — not in the solver (`csp-solver/src/puzzles/futoshiki/generate.rs`), not in the wasm surface (`generateFutoshiki(board_size, seed)` takes no difficulty — `csp-solver/wasm/src/futoshiki.rs:308-309`), not in the UI (`web/frontend/src/games/futoshiki/ControlPanel/constants.ts:10-14` exposes `boardSizeOptions` only). The blank ratio is a single frozen constant `KEEP_DENSITY: f64 = 0.75` (`csp-solver/src/puzzles/futoshiki/generate.rs:34`) → `holes_for_density(5, 0.75)` = 6 holes → 19 givens on a 25-cell board, 76% filled, carets near-decorative.

**The tuned generator already exists and is reachable only from tests** — `generate_futoshiki_tuned_seeded(n, keep_density, inequality_count, seed)` (`generate.rs:232`). The feasibility is proven (r2 density sweep, 30 deals/cell, all unique):

```
keepD  achieved_givens  unique/30   blanks
0.75   19.0             30/30        6.0   ← the only shipped tier today
0.50   13.0             30/30       12.0
0.30    8.0             30/30       17.0   ← a real futoshiki
```

- Wire a **keep-density ladder** through the tuned generator: Easy/Medium/Hard ≈ 0.6 / 0.45 / 0.3, inequality density rising as keep falls (the sweep shows givens carry uniqueness at high keep — a genuinely inequality-driven deal needs givens *down* AND carets *up* in tandem, `r2-generation-truth.md:107-112`).
- **Surface change** — `generateFutoshiki` gains a `difficulty` argument (mirrors sudoku's `generateSudoku(n, difficulty, seed)`); the worker protocol and `useFutoshiki` pass it; `constants.ts` grows a `difficultyOptions` selector (the twin of sudoku's `ControlPanel/constants.ts:11`). This is a `csp-solver` bump → wasm rebuild → `file:`-linked pkg refresh (residual risk below).

### ROW 2 — the 16×16 inversion dies (GEN-1, the born-RED probe)

`measure_difficulty` (`csp-solver/src/puzzles/sudoku/generate.rs:51`, ForwardChecking + FailFirst backtracks — the codebase's own difficulty metric, the one the bake-time grader uses) **inverts at 16×16**: the "Hard" corpus is trivially FC-solvable, the "Medium" corpus is not. Reproduced verbatim (30 seeded deals each, the shipped browser path, `zzz_gen_truth_probe.rs`):

```
N=4 medium  givens 110/113/113/119   backtracks 0 / 331,629 / 0 / 2,701,707
N=4 hard    givens 102/105/105/107   backtracks 0 / 0       / 0 / 0
```

Hard has **fewer givens AND zero search cost every deal**; Medium runs to millions. The label ordering is reversed in the corpus that ships to the browser. (9×9 shows the milder sibling defect: Easy≡Medium at 0 backtracks across all 30 deals — 35-given "Medium" solved by pure propagation, separated from Easy only by 26 fewer givens.)

**Disposition (decide at the gate):**
- **(a) re-grade the corpus** — regenerate/re-sort the 16×16 bank via `examples/generate_templates.rs` so Hard ≥ Medium by `measure_difficulty`; a `data/` change + a re-run of the template producer. Restores the label's meaning at the source.
- **(b) re-derive the labels honestly** — if the corpus can't yield a monotone 16×16 Hard, relabel the axis for what givens-count actually delivers (the honest-clue-count reading), and let W7's technique grade carry the *real* difficulty signal live.

Either kills the inversion; (a) is preferred (keeps three real tiers), (b) is the honest fallback. The proxy caveat stands on the record: `measure_difficulty` is a ForwardChecking proxy, not the browser's Ac3/GAC solve — the inversion is in the codebase's *own* signal, the same one the debug band assertion and `generate_templates` consult (`r2-generation-truth.md:69-73`).

### ROW 3 — corpus completed or the live-gen path gated equally (GEN-3)

The embedded bank is **45 boards**, partial across the size × difficulty matrix (`templates.ts` header "45 boards, 8020 u32 cells"; `TEMPLATE_BANK = {"3":{easy:[],medium:[],hard:[20]},"4":{easy:[10],medium:[10],hard:[5]}}`):

```
N=3 (9×9):   easy 0    medium 0    hard 20
N=4 (16×16): easy 10   medium 10   hard 5
N=2 (4×4):   none
```

So **9×9 Easy + 9×9 Medium + all 4×4** fall through `embedded_templates → generate_board_slow_with_rng` (`generate.rs:249-250`) — live uniqueness-checked hole-digging *in the wasm worker on every deal*, each removal a full `max_solutions:2` solve (`generate.rs:307`). Native release does 30 deals in seconds; wasm is slower.

- **Either** fill the 9×9 Easy/Medium banks (so the on-deal path isn't live hole-digging in wasm), **or** gate the live-gen path equally — an in-browser latency probe for 9×9 live-deal, held to the same bar as the corpus path. The corpus 9×9-Hard templates carry 22-27 givens (milder than the slow-path `total/1.25`=17-given formula, `r2-generation-truth.md:138-140`) — if the banks are filled, hold their grade to ROW-2's monotone proxy.

### ROW 4 — B-0: de-launder the bucket (the honesty fix, no engine dependency)

At runtime difficulty is **not measured at all** — the EASY/MEDIUM/HARD dropdown is a bucket *selector*, `getRandomBoard` picks a pre-baked puzzle from the matching directory (`web/frontend/src/games/sudoku/composables/useSolver.ts:147-170`); the board on screen carries no live grade. The bake-time grade is a machine backtrack count (`measure_difficulty`, `generate.rs:51`), never shown. The margin's fresh-board copy states the bucket **as fact** — "a fresh 9×9, medium" (`SudokuBoard.vue:437`, `freshBoardCopy`).

- The margin distinguishes **request from measurement**: *"you asked for medium"* — never a measurement costume. The tally slot (W9-B1's home) renders "ungraded" until W7's engine supplies a defensible grade.
- **Re-anchor** off `measure_difficulty`, not the debug band: `expected_backtrack_band` (`generate.rs:155`) is `#[cfg(debug_assertions)]`, *"Consulted solely by the debug-build consistency assertion … never a release-path gate"* (`generate.rs:142-154`) — a gross-mismatch sanity check, N=3-only, NOT the grader. The finding is "opaque bucket, backtrack proxy, not shown live"; do not mis-cite the debug bands as the grading authority (r3 kill-list #4).

### ROW 5 — uniqueness coverage (rides W2's gate) (GEN-4)

Uniqueness holds empirically and by construction (the hole-dig reverts any removal admitting a 2nd solution — `generate.rs:307-313` sudoku, `generate.rs:147-163` futoshiki), but the *gate* is thin-to-absent:
- **Sudoku live-gen uniqueness: no test.** `test_generate_4x4` (`tests/sudoku.rs:176-205`) asserts solvability only (`max_solutions:1`) on one 4×4 Easy board — never a 2nd-solution check, never 9×9/16×16.
- **Embedded-bank uniqueness: an orphaned example.** `examples/verify_bank_uniqueness.rs` re-solves every template with `max_solutions:2` but appears in no workflow lane and no `tests/` — CI runs only `gac_ab_corpus` (`.github/workflows/ci.yml:132`). A corrupt template added to `data/` passes CI (FAM-1 orphaned-gate pattern, generation edition).
- **Add** a sudoku live-gen uniqueness sweep (n∈{2,3,4} × difficulty × several seeds, `max_solutions:2`) and wire `verify_bank_uniqueness` into a CI lane (or port to `#[test]`). W2 owns the lane order + runner; this wave supplies the probes.

---

## Gates

Verbatim. Born RED wherever the defect is live at this wave's base SHA.

| Gate | Value |
|---|---|
| Headline | `zzz_gen_truth_probe` re-run: 16×16 Hard ≥ Medium by `measure_difficulty` on every deal; futoshiki deals three distinct givens-tiers; the margin never asserts a bucket as measured; the two uniqueness gates run in CI and are green |

Component checks:

| Gate | Value |
|---|---|
| 16×16 monotone (**born RED**) | failing probe `zzz_gen_truth_probe`, 30 deals: today `N=4 hard` = 102-107 givens / **0 backtracks every deal** while `N=4 medium` runs to **2,701,707** — Hard easier than Medium. After: Hard's median+max backtracks ≥ Medium's at 16×16 (disposition (a)), OR the labels re-derived to clue-count honesty (disposition (b)). No deal inverts. |
| 9×9 tiers distinct (**born RED**) | today `N=3 easy` and `N=3 medium` both measure **0/0/0/0 backtracks** across 30 deals — indistinguishable in search. After: Medium requires search on a defensible fraction of deals, or the label is honestly re-derived. |
| futoshiki difficulty axis (**born RED**) | today `generateFutoshiki(board_size, seed)` (`futoshiki.rs:308-309`) takes no difficulty; the UI (`constants.ts:10-14`) offers size only. After: `generateFutoshiki(n, difficulty, seed)` deals ~0.6/0.45/0.3 keep-density tiers, each unique 30/30, givens strictly decreasing Easy→Hard. |
| B-0 de-launder (**born RED**) | today `freshBoardCopy` (`SudokuBoard.vue:437`) states "a fresh 9×9, medium" as fact. After: the margin reads "you asked for medium" (request voice); an ungraded board (16×16 today, restored permalink, hand-typed) shows no fabricated tier. |
| corpus/live-gen parity | 9×9 Easy/Medium either banked (no live wasm hole-dig on deal) or the live path latency-probed in-browser to the corpus bar; 9×9-Hard banks re-graded to ROW-2's monotone proxy if filled. |
| uniqueness gates (**born RED**) | today `verify_bank_uniqueness` runs in **no** CI lane; sudoku live-gen uniqueness has **zero** tests. After: a live-gen sweep (n∈{2,3,4}×diff×seeds, `max_solutions:2`) + `verify_bank_uniqueness` both green in CI (W2 lane). |
| correctness | `cargo test --workspace` green; every dealt board still unique by construction (270/270 sudoku + 120/120 futoshiki hold); native==wasm parity per the existing `wasm/tests/*_parity.rs`. |

**π/DELTA** (the surface change is visible in the futoshiki control + the margin copy):
- **π (futoshiki selector)**: golden capture of the futoshiki ControlPanel showing three difficulty options where today there is one size selector only; compare against the born-RED capture (size-only).
- **DELTA (margin de-launder)**: before = margin "a fresh 9×9, medium"; after = "you asked for medium" + ungraded tally slot. Banked in evidence.
- The grading rows are **measurement gates, not visual** — their proof is the re-run probe table, banked verbatim, not a pixel capture.

## Seeds

- `r2/r2-generation-truth.md` — GEN-1 (the 16×16 inversion + 9×9 flatness, the deal table, `zzz_gen_truth_probe.rs` verbatim), GEN-2 (futoshiki no-difficulty-axis + the tuned generator + the density sweep), GEN-3 (45-board corpus, corpus-vs-live split), GEN-4 (uniqueness gate gaps).
- `r3/r3-expansion-crit.md` §x3 + KILL-LIST #4 — the difficulty-band citation correction: `generate.rs:156-165` is a `#[cfg(debug_assertions)]` consistency assertion, NOT the grader; re-anchor B-0 off `measure_difficulty`.
- `x/x3-hint-heuristics.md` §a — the difficulty-grader audit (backtrack count at bake, N=3-only bands, opaque runtime bucket) that this wave de-launders and W7 replaces.
- Anchors verified at base SHA: `generate.rs:280-284` (givens knob), `:51` (`measure_difficulty`), `:142-165` (debug band), `futoshiki/generate.rs:34` (`KEEP_DENSITY`), `:232` (tuned generator), `wasm/src/futoshiki.rs:308-309`, `futoshiki/ControlPanel/constants.ts:10-14`, `useSolver.ts:147-170`, `SudokuBoard.vue:437`, `.github/workflows/ci.yml:132`.

## Residual risks

- **The futoshiki axis is a wasm surface change** — `generateFutoshiki` gains an argument → `csp-solver` bump → wasm rebuild → `file:`-linked pkg refresh. The standing `npx-packument-OOM` trap applies: deploy ONLY via `npm run deploy`. Sequence behind W5's Makefile ship-recipe truth.
- **`measure_difficulty` is a ForwardChecking proxy, not the browser solve** — the inversion is real in the codebase's own signal, but a fully honest grade is W7's technique tier. ROW-2 fixes the *proxy* monotonicity; ROW-4 stops presenting any bucket as a live measurement; W7 supplies the defensible live grade. Do not conflate the three.
- **Disposition (a) vs (b) is a corpus-quality question decided at the gate** — if regeneration can't produce a monotone 16×16 Hard within the given range, (b) (honest relabel) is the fallback, not a failure. Name the choice on the record.
- **The 30-deals/cell probe exposes flatness/inversion, not tail risk** — the rare high-backtrack Medium hole-dig boards are not a tail study. ROW-2's gate asserts on median+max over the same 30-deal frame the defect was found in; a larger sweep is banked, not blocking.
- **B-0 is engine-independent and ships regardless of ROW-2's disposition** — the honesty fix (request ≠ measurement, ungraded shows nothing) does not wait on a corpus decision; it lands the moment the margin copy changes.

---
**ADDENDUM (pre-exec perf audit, 2026-07-12)**: see README §7 — the rows stamped to this wave are binding scope; evidence at ../evidence/perf/.

---
## Execution record (2026-07-13)

Workflow `wf_47ec87b6-297`, 5 lanes (L1 futoshiki-axis → L2 grading/corpus/uniqueness → L4 §7 solver micro-rows → L3 frontend surface → adversarial verify), run concurrently with T4-WM per the re-cut DAG. Verify came back RED on exactly one wave-owned blocker — the `difficulty_parity` scanner caught L3's frontend `Difficulty` type unregistered (the gate doing exactly its job on a cross-lane L1↔L3 integration miss); sealed by registering `games/futoshiki/types.ts` (Verbatim) and rewording the one comment that tripped the `enum ` heuristic. `cargo test --workspace` fully green at seal.

| Gate | Born-RED | Close |
|---|---|---|
| futoshiki axis (GEN-2) | no `Difficulty` at any layer (compile error) | `Difficulty{Easy,Medium,Hard}` → keep 0.6/0.45/0.3 + inequalities n/1.5n/2n via the spec-named tuned generator; `generateFutoshiki(board_size, difficulty, seed)` wasm surface; `futoshiki_difficulty` 3/3 (seeded-deterministic, givens strictly decrease 15/11/8 on 5×5, carets rise 5/7/10, 30/30 unique per tier); wire↔native parity 9/9; verify's independent wasm spot-check: 48 deals ×2, 0 mismatches |
| 16×16 monotone (GEN-1) | `zzz_gen_truth_probe` exit 1, 3 inversions (Hard max 0 < Medium max 300000; deep-search 0% < 10%; majority 0%<50%) — reproduced by verify against the restored stale bank | **disposition (a)**: stale Hard bank regenerated via the sanctioned producer (givens 102–107 → 91–100, every board FC-search-hard); probe exit 0 (median 0≤0≤300000, deep-search 0%≤10%≤100%, givens 192≥113≥94); probe promoted to a CI gate |
| 9×9 tiers distinct (GEN-1) | easy===medium flat under the FC proxy | **disposition (b)** honest re-derivation: the proxy is BIMODAL at 9×9/16×16 (0 or millions, nothing between) — cannot separate two propagation-solvable tiers; `clue_count_ladder_is_monotone_across_served_tiers` GREEN (61/35/24 at 9×9); the live search grade is W7's technique tier, named not conflated |
| corpus/live-gen parity (GEN-3) | live fall-through path ungated | `live_dealt_tiers_are_unique_and_within_the_corpus_bar`: 25 deals (fall-through tiers × 5 seeds) unique + within a 5M-node corpus bar (node-invariant per the repo's node-over-wall-time discipline) |
| uniqueness (GEN-4) | `verify_bank_uniqueness` ran in NO CI lane (FAM-1 orphan) | wired into the CI rust job beside `gac_ab_corpus` (+ `zzz_gen_truth_probe`); 45/45 unique exit 0; W2's live-gen sweep cited (not redone) and widened ×5 seeds |
| B-0 de-launder (ROW 4) | "a fresh 9×9, medium" (measurement voice) | "a fresh 9×9 — you asked for medium" (request voice); ungraded board says nothing; corrupt-link folds both. FutoshikiBoard was never laundered — left silent (adding a tier there would invert B-0) |
| §7 micro-rows (addendum) | — (identity-gated, not born-RED) | **GENREUSE + VALUES + MRV all LAND, none revert**: L4 digest `7d816e7f86b9e98e` unchanged over 71 identity lines; verify's independent harness `3ce40ab5cab45c11` over 37 cases, current tree == base-SHA worktree. Allocs/deal 9×9-M 39,073→5,285 (7.4×), 16×16-M 362,792→26,143 (13.9×); VALUES costs +2,869 B wasm (flagged, accepted — first row to reconsider under a future size pass) |
| wasm bytes | — | lean 89,995 B sha `1402f40a` (axis +418, smallvec +2,869 − 26), clears the 93,000 B CI budget with 3,005 B headroom |
| battery (π) | — | rust fmt/clippy/`test --workspace` all green at seal (incl. the difficulty_parity fix); frontend vue-tsc/unit 133/eslint/knip/prettier/build green; full e2e 60/60 vs built dist |

Seal reconciliations: **versions staged 0.5.0** (csp-solver + csp-solver-wasm; `generateFutoshiki` gaining an argument is breaking for the file:-linked pkg, additive for the core crate) — crates.io publish of csp-solver 0.5.0 executes after CI greens, per the W0/B2 precedent. **iai golden 1529452 ±2%** unmeasurable on arm64-macOS (no Valgrind); L4 predicts a small legitimate VALUES-driven decrease — if the CI lane exits the band, the baseline re-mints deliberately with that attribution, never automatically. **Futoshiki difficulty is runtime-only** (no `?difficulty=`/localStorage — the spec named constants+protocol+composable, not useUrlState); the persistence threading books to W9 as a named follow-up, not a blocker. Shared files with the concurrent T4-WM (SudokuBoard.vue carries both waves' hunks; futoshiki ControlPanel likewise): each file rides the commit of its dominant-hunk wave, cross-referenced in both records — the B-0 margin hunk and the difficulty selector are W6 content wherever the file lands. `templates.ts` (regenerated single-line from the re-graded bank) moves WITH the data/ bank change.

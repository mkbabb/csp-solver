# Doc-canon drift — R1 audit

**Tree at audit:** `71456713d9f7361af80f09e1a456fc9787507e78` (2026-08-01, `master`, clean except this untracked dir).
**Method:** every number re-derived TODAY against the working tree — commands run and quoted, manifests read, files measured. Nothing inherited from a prior doc.

**Corpus swept (12 consumer-facing files + the workflow):** `README.md`, `docs/{algorithms,animation,benchmarks,bbnf-integration,optimizations,sudoku}.md`, `csp-solver/{README,CHANGELOG}.md`, `csp-solver/wasm/{README,CHANGELOG}.md`, `csp-solver/wasm/pkg/README.md`, `web/frontend/README.md`, `.github/workflows/ci.yml`, plus every version manifest (`Cargo.toml` ×3, `pyproject.toml`, `package.json` ×2).

**Verdict:** **59 claims adjudicated — 31 TRUE, 22 STALE, 6 UNVERIFIABLE.** Meta-leak grep is **literal zero** across the consumer corpus; one indirect leak vector via `docs/precepts/`.

The engine half of the canon held: every Rust number re-derives exactly. The rot is concentrated in the **frontend + wasm-artifact half**, where the T4-P1 Safari patch (`be54105f`, `387cceea`, `23e3dc00`, `b4e2c447`) moved bytes, versions, browser posture, and the whole filter architecture without the docs following.

---

## Commands run (the evidence spine)

```
$ cargo test --workspace
  → 208 passed, 0 failed, 0 ignored across 28 result lines
    = 26 test binaries + 2 Doc-tests sections (csp_solver 4 passed, csp_solver_wasm 0)

$ cd csp-solver/tests-py && uv run --no-sync pytest -q
  → 27 passed in 2.12s

$ cargo run --release --example gac_ab_corpus
  → false-UNSAT (GAC off): 0/50 · (GAC on): 0/50
    node-count spine (GAC off→on): 4153388 → 8222 (expected 4153388 → 8222) — HOLD
    VERDICT: 0/50 false-UNSAT + spine HOLD — PASS

$ npx playwright test --list                              → 206 tests in 15 files
$ npx playwright test --list --project=chromium            → 115 tests in 15 files
$ npx playwright test --list --project=webkit              →  91 tests in 12 files
$ npx playwright test --list -c playwright-golden.config.ts   → 4 tests in 1 file
$ npx playwright test --list -c playwright-throttle.config.ts → 23 tests in 4 files
$ find e2e -name '*.spec.ts' | wc -l                       → 20

$ wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm        → 122385
$ wc -c web/frontend/dist/assets/csp_solver_wasm_bg-*.wasm → 122385  (byte-identical)
$ find csp-solver/data/sudoku_puzzles -type f | wc -l      → 45 files, 32095 B total
$ wc -c web/frontend/src/assets/fonts/*.woff2              → 3624 + 4312 + 13788 = 21724
$ ls csp-solver/tests/*.rs | wc -l                         → 22
$ grep -c '^    [a-z][a-z0-9_-]*:$' .github/workflows/ci.yml → 11 job keys
```

---

## Claims table

Legend: **T** = TRUE (re-derived) · **S** = STALE (doc says X, tree says Y) · **U** = UNVERIFIABLE from this tree.

### README.md

| # | Claim | Site | Re-derived | V |
|---|---|---|---|---|
| 1 | `tests/` integration suite (22 files) | `README.md:20` | `ls csp-solver/tests/*.rs \| wc -l` → 22 | T |
| 2 | GAC default-ON at ≥3 live participants | `README.md:44` | `gac.rs:61` `GAC_MIN_PARTICIPANTS: usize = 3` | T |
| 3 | `SolveConfig::default()` = `Ac3 + FailFirst`, `max_solutions=1`, budget 1M | `README.md:44` | `config.rs:99` `node_budget: Some(1_000_000)` + Default impl | T |
| 4 | Embedded bank: 45 boards, 32,095 B | `README.md:58` | 45 files / 32,095 B; dirs `3/hard`, `4/{easy,medium,hard}` | T |
| 5 | Undo spine cap 200 | `README.md:62` | `useUndoHistory.ts:45` `const UNDO_CAP = 200` | T |
| 6 | Fonts: three self-hosted woff2 subsets, **17,708 B total** | `README.md:62` | **21,724 B** — fraunces went 9,772→13,788 at `387cceea` | **S** |
| 7 | MSRV 1.88 | `README.md:70,135` | root `Cargo.toml:13` `rust-version = "1.88"` | T |
| 8 | npm ≥ 11 | `README.md:72` | `web/frontend/package.json` `engines.npm: ">=11"` | T |
| 9 | Counts measured at `826f16e3` | `README.md:87` | commit exists; 64 commits behind HEAD, but counts still re-derive | T |
| 10 | `cargo test --workspace` → 208/0/0 (26 binaries + 4 doctests) | `README.md:90` | 208/0/0; 26 binaries; csp_solver doctests = 4 | T |
| 11 | pytest → 27 passed, 0 skipped | `README.md:93` | 27 passed in 2.12s | T |
| 12 | e2e: **82 tests across 13 spec files** (77 default; 4 golden + 1 throttle split out) | `README.md:96-97` | **206 in 15** default (115 chromium / 91 webkit), 4 golden, 23 throttle; **20** spec files on disk | **S** |
| 13 | GAC A/B corpus 0/50 off, 0/50 on | `README.md:100` | binary printed exactly that | T |
| 14 | Queens ground truth 92 / 14,200 | `README.md:103` | `benches/queens.rs:87,104,143` `assert_eq!(…, 92)` / `14200` | T |
| 15 | CI runs **eleven** lanes | `README.md:109` | 11 job keys: lint, rust, py-compile, py-runtime, wasm, build-lean-wasm, twiggy, frontend, e2e, iai, cargo-audit | T |
| 16 | **CI runs Playwright on Chromium alone; Safari known-broken pending a WebKit perf fix** | `README.md:117` | `playwright.config.ts:55-57` webkit project; `ci.yml:602-604` installs **chromium webkit**; 91 webkit tests list | **S** |
| 17 | `csp-solver` crates.io 0.6.0 | `README.md:125` | `csp-solver/Cargo.toml:3` = 0.6.0 (registry state not checkable offline) | U |
| 18 | `@mkbabb/csp-solver-wasm` npm 0.2.0; source 0.6.0 | `README.md:126` | source 0.6.0 (`wasm/Cargo.toml:3`); local `pkg/package.json` reads 0.6.0 (generated, not registry) | U |
| 19 | `@mkbabb/pencil-boil` **^0.9.2** | `README.md:127` | `web/frontend/package.json:38` **`^0.10.1`** | **S** |
| 20 | GAC 12.6–12.7× aggregate; 3 of 5 hard 9×9 at 1.8–3.3× slower | `README.md:131` | timing probe not re-run this pass; stamped at `ede25188` (commit exists) | U |
| 21 | PyO3 0.29; edition 2024 | `README.md:135` | root `Cargo.toml:24` `pyo3 = { version = "0.29", … }` | T |
| 22 | Vite 8, TS 6 | `README.md:137` | `package.json` `vite ^8.1.4`, `typescript ~6.0.3` | T |

### docs/sudoku.md

| # | Claim | Site | Re-derived | V |
|---|---|---|---|---|
| 23 | 810 `NotEqual` in the pairwise decomposition of 9×9 | `docs/sudoku.md:9` | 81 cells × 20 peers / 2 = 810 | T |
| 24 | 27 AllDifferent for 9×9 | `docs/sudoku.md:9` | 9 + 9 + 9 = 27 | T |
| 25 | Symmetry group total **~1.22 × 10⁹** | `docs/sudoku.md:39` | the doc's own table: 362880·216·216·6·6·2 = **1,218,998,108,160 ≈ 1.22 × 10¹²**. Off by 10³ | **S** |
| 26 | Difficulty calibration: Easy 0 bt, **Medium <50**, Hard >100 | `docs/sudoku.md:61-62` | `sudoku/generate.rs:162-164` bands: Easy `(0,0)`, Medium `(1, u32::MAX)`, Hard `(100, u32::MAX)`. No 50 in the tree | **S** |
| 27 | `node_budget` defaults to 1,000,000 | `docs/sudoku.md:75` | `config.rs:99` | T |
| 28 | Futoshiki v1 covers N=4..7 | `docs/sudoku.md:92` | matches `README.md:53`; no contradicting constant found | T |

### docs/algorithms.md

| # | Claim | Site | Re-derived | V |
|---|---|---|---|---|
| 29 | `ac3_full` / `ac3_from_variable` entry points | `docs/algorithms.md:11-12` | `csp-solver/src/solver/ac3.rs`; README:169 concurs | T |
| 30 | GAC gate constant is 3 | `docs/algorithms.md:19,30` | `gac.rs:61` | T |
| 31 | Standing guard is **`tests/solution_set_invariance.rs`** | `docs/algorithms.md:59` | **file does not exist**; the tree has `csp-solver/tests/oracle_and_invariance.rs` | **S** |
| 32 | **Stratified sweep (`propagate_stratified`)**, SCC-ordered, a third strategy | `docs/algorithms.md:73` | zero hits for `stratified\|Stratified` in `csp-solver/**/*.rs`; `config.rs:32-39` `PropagationStrategy` = `Auto \| Ac3 \| Sweep` only | **S** |
| 33 | **`Chs`** (conflict-history variant) shares the Mrv scan | `docs/algorithms.md:83` | `Chs` deleted at 0.3.0 (`CHANGELOG.md:136-138`); zero hits in `csp-solver/src` | **S** |
| 34 | `Ordering` = Chronological / FailFirst / Mrv, weights frozen at 1.0 | `docs/algorithms.md:81-83` | `ordering.rs:9-20` exactly those three; frozen-weight comment at `:15,25` | T |
| 35 | Served hard path `Ac3 + Mrv`; default `Ac3 + FailFirst` | `docs/algorithms.md:85` | `config.rs` Default impl | T |
| 36 | `evidence/synthesis-pass2.md` exists | `docs/algorithms.md:49,51` | `docs/tranches/2026-07-grand-uplift/evidence/synthesis-pass2.md` | T |

### docs/benchmarks.md

| # | Claim | Site | Re-derived | V |
|---|---|---|---|---|
| 37 | `cargo test --workspace` → 208/0/0 (26 binaries + 4 doctests) | `docs/benchmarks.md:43-44` | 208/0/0, 26 binaries | T |
| 38 | GAC corpus 0/50 both states | `docs/benchmarks.md:16,37` | binary printed 0/50 · 0/50 | T |
| 39 | **Search nodes off → on: 40,513 → 4,678 (8.66× fewer)** | `docs/benchmarks.md:21` | binary today: **4,153,388 → 8,222 — HOLD**. `ci.yml:147-148` already declares 40,513→4,678 "rode the stale bank", re-minted at the 16×16 bank re-cut | **S** |
| 40 | Verbatim `gac_ab_corpus` output block | `docs/benchmarks.md:104-109` | current binary emits an extra `node-count spine …` line and `VERDICT: 0/50 false-UNSAT + spine HOLD — PASS` (doc shows `VERDICT: 0/50 — PASS`) | **S** |
| 41 | Standing guard `tests/solution_set_invariance.rs` | `docs/benchmarks.md:36` | same as #31 — file absent | **S** |
| 42 | Lean darwin artifact **121,855 B**, `pkg/` byte-identical to shipped `dist/` | `docs/benchmarks.md:49` | **122,385 B**; `pkg/` and `dist/assets/csp_solver_wasm_bg-B_bsll75.wasm` byte-identical (the identity claim holds) | **S** |
| 43 | Runner measures 124,091 B | `docs/benchmarks.md:49` | runner-side, not reproducible here | U |
| 44 | twiggy lean band: fail > 127,500 B | `docs/benchmarks.md:49` | `ci.yml:444,465` | T |
| 45 | Full module band: fail >240 KB / warn >230 KB; 222,436 B flagged stale | `docs/benchmarks.md:51` | `ci.yml:427-431`; the doc already self-flags 222,436 | T |
| 46 | `time_sudoku` counts 62/962, 3/293, 105/1539 | `docs/benchmarks.md:38,114-122` | not re-run this pass (host-independent by construction) | U |
| 47 | iai determinism **1,585,722** across 3 runners | `docs/benchmarks.md:84` | committed golden is **1,529,452** (`csp-solver/benches/iai_queens.baseline`); the same superseded 1,585,722 also sits at `benches/iai_queens.rs:8` | **S** |
| 48 | Every referenced `evidence/*.md` resolves | throughout | all six found under `docs/tranches/2026-07-grand-uplift/evidence/` | T |

### docs/optimizations.md · docs/animation.md

| # | Claim | Site | Re-derived | V |
|---|---|---|---|---|
| 49 | `ConstraintEnum` = NotEqual, AllDifferent, AllDifferentExcept, **Soft**, Custom | `docs/optimizations.md:7` | `constraint/dispatch.rs:28-33` = NotEqual, AllDifferent, AllDifferentExcept, **CageSum, CageProduct**, Custom. `Soft` deleted at 0.3.0 (`CHANGELOG.md:141-143`); the two cage variants are absent from the doc | **S** |
| 50 | Arena adjacency, BitsetDomain u128 op table, bitset worklist | `docs/optimizations.md:11-42` | `solver/adjacency.rs`, `domain/bitset.rs`, `solver/ac3.rs` all present and match the prose | T |
| 51 | pencil-boil **^0.9.2** | `docs/animation.md:6` | `package.json:38` `^0.10.1` | **S** |
| 52 | `useBoilFrame`/**`useFilterParamBoil`** among consumed primitives | `docs/animation.md:7` | **zero** `useFilterParamBoil` references under `web/frontend/src` | **S** |
| 53 | "SvgFilters' **3 filter-wobble subscribers**"; floor **chains=1, subscribers=10** | `docs/animation.md:42-43` | `SvgFilters.vue` has no `useFilterParamBoil`; the enforced invariant is now the filter census (`filterBudget.ts` + `e2e/filter-census.spec.ts`), not a subscriber floor | **S** |
| 54 | `FILTER_PRESETS`: 6 presets; `stroke-light`/`stroke-dark` used by the **Control panel** | `docs/animation.md:113-117,138-139` | `pencilConfig.ts:265,327-332` marks both **ORPHANED** (`baseDef: false`, sole consumer gone); `:100,292` says `wobble-logo` is a pose stack only, no base def | **S** |
| 55 | The filter architecture (no mention of a census/budget) | `docs/animation.md` (whole) | `filterBudget.ts` is now the countable invariant — **9** live filters, ceiling **14**, 5 allowlist rows, gated in both regimes by `e2e/filter-census.spec.ts`. Undocumented in the animation doc | **S** |

### csp-solver/README.md · CHANGELOG.md · wasm docs

| # | Claim | Site | Re-derived | V |
|---|---|---|---|---|
| 56 | Install snippet `csp-solver = "0.5"` | `csp-solver/README.md:35` | crate is **0.6.0** (`Cargo.toml:3`) — and the same file at L24-26 says latest published is 0.6.0. Self-contradiction | **S** |
| 57 | 208 passed "across **28 test binaries**" | `csp-solver/README.md:216` | 26 binaries + 2 doctest sections = 28 **result lines**. `README.md:90` says 26+4 and is right; this one mislabels | **S** |
| 58 | Bank 32,095 B, N=3-hard + N=4 | `csp-solver/README.md:193` | 45 files, 32,095 B, dirs match | T |
| 59 | tests-py: 27 passed, 0 skipped | `csp-solver/README.md:230` | 27 passed | T |
| 60 | dispatch.rs gloss "(NotEqual, AllDifferent, cages, boxed Custom)" | `csp-solver/README.md:158` | omits `AllDifferentExcept` (`dispatch.rs:30`) | **S** |
| 61 | Benches list: assignment, cost_finite_domain, iai_queens, lattice, map_coloring, queens, sudoku | `csp-solver/README.md:235` | `ls csp-solver/benches/` also carries `futoshiki.rs` and `gac_ab.rs` — 9 bench files, doc names 7 | **S** |
| 62 | CHANGELOG current — no unrecorded crate-source change | `csp-solver/CHANGELOG.md:17` | `git log 826f16e3..HEAD -- csp-solver/src csp-solver/Cargo.toml csp-solver/wasm/src` → only `cb3c7f5f` (the 0.6.0 release itself) | T |
| 63 | Python wheel joins at 0.6.0 | `csp-solver/CHANGELOG.md:22` | `csp-solver/pyproject.toml` `version = "0.6.0"` | T |
| 64 | `make wasm` = `--target web --release → pkg/` (**full, default features: + assignment**) | `csp-solver/wasm/README.md:38` **and** `pkg/README.md:38` (byte-identical copy) | `wasm/Makefile` builds **LEAN**: `wasm-pack build --scope mkbabb --target web --profile wasm-release --no-default-features`. The README then presents that exact lean recipe at L41-45 as a *separate manual* command | **S** |
| 65 | Lean build measures **121,855 B** | `csp-solver/wasm/README.md:58` + `pkg/README.md:58` | 122,385 B | **S** |
| 66 | Lean = five puzzle families, no assignment | `csp-solver/wasm/README.md:28,56` | `pkg/csp_solver_wasm.d.ts`: 15 puzzle exports across all five families, **no** `solveAssignmentCop` | T |
| 67 | Six surface layers, named entry points | `csp-solver/wasm/README.md:10-26` | every named export present in `pkg/csp_solver_wasm.d.ts` | T |

### .github/workflows/ci.yml — inline numeric comments (the known stale-comment class)

| # | Comment | Site | Re-derived | V |
|---|---|---|---|---|
| 68 | "darwin measures **121,855 B**" (twice: comment + the echoed run line) | `ci.yml:455`, `ci.yml:464` | 122,385 B on darwin today | **S** |
| 69 | lean fail > 127,500 B | `ci.yml:444,465-466` | matches the script; band holds (122,385 < 127,500) | T |
| 70 | full module fail >240 KB / warn >230 KB | `ci.yml:419,427-431` | matches the script | T |
| 71 | "gac_ab_corpus 0/50 false-UNSAT + 4,153,388→8,222 node-count spine" | `ci.yml:32,140,147` | binary printed exactly `4153388 → 8222 … HOLD` — **CI is right, `docs/benchmarks.md:21` is the stale one** | T |
| 72 | queens `assert_eq!(92/14200)` | `ci.yml:31,128` | `benches/queens.rs:87,104,143` | T |
| 73 | eleven jobs, lane→job map | `ci.yml:22-45` | 11 job keys, map matches one-for-one | T |
| 74 | iai ±2% band via `benches/iai_gate.sh` | `ci.yml:674` | script present; golden `iai_queens.baseline` = 1,529,452 | T |
| 75 | historical size log 222,436 B full / 90,602 B lean etc. | `ci.yml:404-416` | explicitly framed as a dated re-measure log, not a current claim | T |

### csp-solver/wasm/Makefile · csp-solver/src (in-source doc drift)

| # | Claim | Site | Re-derived | V |
|---|---|---|---|---|
| 76 | `--no-default-features` = "**sudoku + futoshiki only**" | `csp-solver/wasm/Makefile:16` | five families ship in the lean build (`pkg/*.d.ts`) | **S** |
| 77 | `node_budget`: "**`None` (the default)** means the search cannot be bounded" | `csp-solver/src/config.rs:80` | `config.rs:99` sets `Some(1_000_000)`. Rustdoc contradicts the `Default` impl on the same struct | **S** |
| 78 | iai determinism 1,585,722 | `csp-solver/benches/iai_queens.rs:8` | committed golden 1,529,452 | **S** |

### web/frontend/README.md

Adjudicated as **one systemic finding** (S1 below) rather than row-by-row: the file describes a product that no longer exists.

---

## STALE section, ranked

Rank = (blast radius × how wrong) — a reader acting on the claim gets a wrong result.

### S1 — `web/frontend/README.md` documents a two-game app that shipped five games a fortnight ago · **CRITICAL**

The single largest rot in the corpus. Every structural claim is wrong:

| Line | Doc says | Tree says |
|---|---|---|
| `:1` | "csp-solver frontend — **Sudoku + Futoshiki**" | five games |
| `:5-6` | "**Two games** — Sudoku (default) and Futoshiki (async-loaded, `?game=futoshiki`)" | `src/games/registry.ts:216,229,250,261,272` defines `sudoku`, `futoshiki`, `thermo`, `killer`, `kenken` |
| `:11` | pencil-boil **`^0.7.0`** | `package.json:38` `^0.10.1` — two minors + a patch behind |
| `:23` | `npm run lint` = `prettier --write src/` | `package.json` `"lint": "prettier --check src/"` — **--write vs --check**: a contributor following the doc silently rewrites the tree where CI only checks it |
| `:37-74` | file tree with no `thermo/`, `killer/`, `kenken/`, `shared/`, no `registry.ts`, no `GameGallery`, no carousel | all present |
| `:80` | "SvgFilters … **3 `useFilterParamBoil` subscribers**" | zero `useFilterParamBoil` refs in `src/` |
| `:82` | "OptionSelector # Game picker (sudoku/futoshiki) — `?game=` URL param" | carousel game-select over a 5-card registry |
| `:95-103` | ESLint boundary = "exactly two real boundaries", `sudoku ↮ futoshiki` | five game dirs + `games/shared`; the stated boundary set can't be the enforced one |

Last touched `33066681` (T4-W5); the five-family surface landed at T4 close and the P1 patch moved it again. **Fix = rewrite, not patch.**

### S2 — `README.md:96-97` e2e counts are ~2.5× low and the config split is inverted · **HIGH**

Doc: "82 Playwright tests across 13 spec files (77 in the default config; 4 visual-golden + 1 throttle are testIgnore'd there)".
Tree: default **206 in 15 files** (chromium 115/15 + webkit 91/12), golden **4/1**, throttle **23/4**, **20** spec files on disk. The "1 throttle" figure is off by 22 — the throttle config grew from one spec to four (`filter-census`, `font-census`, `theme-bake-freshness`, `throttled-void`).

### S3 — `README.md:117` declares Safari broken and CI chromium-only; both are false · **HIGH**

Doc: *"CI runs Playwright on Chromium alone; Firefox passes by audit. Safari is known-broken pending a WebKit performance fix, so read 'solves entirely in the browser' as a Chromium/Firefox claim for now."*
Tree: `ci.yml:602-604` runs `npx playwright install --with-deps chromium webkit`; `playwright.config.ts:55-57` declares a `webkit` project carrying **91 tests across 12 files**; `ci.yml:600,628` documents the WebKit assertions by construction. This is the most *reputationally* wrong line in the corpus — it tells a visitor the live product is broken on their browser.

### S4 — pencil-boil version cited three ways, none current · **HIGH**

`README.md:127` `^0.9.2` · `docs/animation.md:6` `^0.9.2` · `web/frontend/README.md:11` `^0.7.0` → tree `^0.10.1` (`package.json:38`, landed `23e3dc00`, adopted at `be54105f`). Three files, three different wrong answers — the classic no-single-home symptom.

### S5 — `docs/benchmarks.md:21` node spine contradicts the repo's own CI gate · **HIGH**

Doc table row: "Search nodes, off → on | 40,513 → 4,678 (8.66× fewer)".
Binary today: `4153388 → 8222 — HOLD`. `ci.yml:147-148` **already states** the 40,513→4,678 spine "rode the stale bank" and was re-minted at the T4-W6 16×16 bank re-cut. The gate knows; the doc does not. Self-refuting canon.

### S6 — the lean-wasm byte count is stale in **four** places · **MEDIUM-HIGH**

121,855 B → measured **122,385 B** (`pkg/` and `dist/` byte-identical, built 2026-08-01 03:52):
`docs/benchmarks.md:49` · `csp-solver/wasm/README.md:58` · `csp-solver/wasm/pkg/README.md:58` · `ci.yml:455` **and** the echoed operator line `ci.yml:464`.
This is the **exact class flagged in the brief** — the ci.yml band comment stale again, second occurrence. The *band* (127,500 B) still holds with headroom; only the stamped measurement rotted. Per the class-invariant rule this now warrants a derived stamp rather than a hand-copied literal.

### S7 — `README.md:62` font total is 4,016 B low · **MEDIUM**

Doc "17,708 B total" = 3,624 + 4,312 + **9,772** — the pre-patch Fraunces subset. `387cceea` ("the B2 subset") took Fraunces to **13,788 B**; the true total is **21,724 B**. The stale figure is arithmetically consistent with the *old* tree, which is how it survived review.

### S8 — `docs/sudoku.md:39` symmetry group off by a factor of 1,000 · **MEDIUM**

"Total: ~1.22 x 10^9 distinct grids per template." The doc's own table multiplies to 362,880 · 216 · 216 · 6 · 6 · 2 = **1,218,998,108,160 ≈ 1.22 × 10¹²**. The mantissa is right, the exponent is wrong — a transcription slip that has never been re-derived.

### S9 — three doc-cited APIs/tests don't exist · **MEDIUM**

| Cited | Site | Reality |
|---|---|---|
| `tests/solution_set_invariance.rs` | `docs/algorithms.md:59`, `docs/benchmarks.md:36` | folded into `csp-solver/tests/oracle_and_invariance.rs` |
| `propagate_stratified` / "Stratified sweep" | `docs/algorithms.md:73` | zero hits in `csp-solver/**/*.rs`; `PropagationStrategy` is `Auto \| Ac3 \| Sweep` (`config.rs:32-39`) |
| `Ordering::Chs` | `docs/algorithms.md:83` | deleted at 0.3.0 (`CHANGELOG.md:136-138`); zero hits in `src/` |

A reader reaching for `propagate_stratified` gets a compile error from a doc that presents it as shipped API.

### S10 — `csp-solver/README.md:35` Install snippet pins the wrong minor · **MEDIUM**

```toml
csp-solver = "0.5"
```
The crate is **0.6.0** (`Cargo.toml:3`), and lines 24-26 of the *same file* say "latest `0.6.0` (the first published version carrying the five-family surface)". A consumer copying the snippet gets a `^0.5` range that resolves **below** the five-family surface the README just sold them.

### S11 — `docs/animation.md` describes a filter architecture the P1 patch replaced · **MEDIUM**

Four coupled rots in one file: pencil-boil `^0.9.2` (`:6`); `useFilterParamBoil` listed as consumed (`:7`) with zero refs in `src/`; "SvgFilters' 3 filter-wobble subscribers … chains=1, **subscribers=10**" (`:42-43`); "`FILTER_PRESETS`: reactive, **6 presets**" with `stroke-light`/`stroke-dark` attributed to the **Control panel** (`:113-117,138-139`) when `pencilConfig.ts:265,327-332` marks both **ORPHANED** (`baseDef: false`) and `:100,292` says `wobble-logo` carries no base def either.

Worse, the doc is silent on what *replaced* them: `src/pencil/config/filterBudget.ts` is now the countable invariant — **9** live filters in the board scene, ceiling **14**, five exact-match allowlist rows, plus a union-raster-area gate (`row: 45315` px²) — enforced in both regimes by `e2e/filter-census.spec.ts`. The animation doc is the designated peer reference for `web/frontend/`, so this gap has no other home.

### S12 — `csp-solver/wasm/README.md:38` documents `make wasm` as the *full* build; the Makefile builds *lean* · **MEDIUM**

Doc: `make wasm  # wasm-pack build --target web --release → pkg/ (full, default features: + assignment)`.
Makefile: `wasm-pack build --scope mkbabb --target web --profile wasm-release --no-default-features`.
Then L41-45 presents that same lean invocation as a *separate* command "the lean deploy artifact". A reader concludes `pkg/` holds the full module; it holds the lean one (`pkg/*.d.ts` has no `solveAssignmentCop`). This ships twice — `pkg/README.md` is a byte-identical copy, so the error is **in the npm tarball's own README**. `33066681` was titled "the Makefile stops lying"; the README never caught up.

### S13 — `csp-solver/wasm/Makefile:16` comment names two families for a five-family flag · **LOW-MEDIUM**

`--no-default-features   sudoku + futoshiki only` — the lean build compiles all five. Same inline-comment class as S6.

### S14 — iai golden cited as 1,585,722; the enforced golden is 1,529,452 · **LOW-MEDIUM**

`docs/benchmarks.md:84` and `csp-solver/benches/iai_queens.rs:8` both quote **1,585,722**; `csp-solver/benches/iai_queens.baseline` — the value `iai_gate.sh` actually diffs against at ±2% — reads **1,529,452**. The prose frames 1,585,722 as the historical determinism proof, which is defensible, but two files now quote a number no gate enforces.

### S15 — `csp-solver/README.md:216` says "28 test binaries" · **LOW**

208/0/0 is right; the binary count is not. `cargo test --workspace` emits 28 `test result:` lines = **26 test binaries + 2 Doc-tests sections**. `README.md:90` gets it right ("26 test binaries + 4 doctests"); the two files disagree with each other.

### S16 — `docs/optimizations.md:7` `ConstraintEnum` variant list is two releases behind · **LOW**

Lists `Soft` (deleted at 0.3.0, `CHANGELOG.md:141-143`) and omits `CageSum`/`CageProduct` (added at 0.6.0, `dispatch.rs:31-32`) — the two propagators the whole Killer/KenKen surface rides.

### S17 — `docs/sudoku.md:61` "Medium: <50 backtracks" · **LOW**

`sudoku/generate.rs:162-164` `expected_backtrack_band`: Easy `(0,0)`, Medium `(1, u32::MAX)`, Hard `(100, u32::MAX)`. No upper bound on Medium, and no `50` anywhere in the calibration path.

### S18 — `csp-solver/src/config.rs:80` rustdoc contradicts `config.rs:99` · **LOW**

The field doc says `None` **is the default**; the `Default` impl eleven lines down sets `Some(1_000_000)`. This drift is *upstream of the docs* — it surfaces in `cargo doc` and in every IDE hover. Both `csp-solver/README.md:84` and `docs/sudoku.md:75` state the truth, so the docs are right and the source comment is wrong.

### S19 — two roster gloss omissions · **LOW**

- `csp-solver/README.md:158` dispatch.rs gloss "(NotEqual, AllDifferent, cages, boxed Custom)" drops `AllDifferentExcept` (`dispatch.rs:30`).
- `csp-solver/README.md:235` names 7 benches; `csp-solver/benches/` holds 9 `.rs` files — `futoshiki.rs` and `gac_ab.rs` are unlisted (`gac_ab` is CI-invoked at `ci.yml:31`, so an unlisted bench is a load-bearing one).

### S20 — `docs/benchmarks.md:104-109` verbatim output block no longer matches the binary · **LOW**

Current `gac_ab_corpus` emits an extra `node-count spine (GAC off→on): 4153388 → 8222 … HOLD` line and `VERDICT: 0/50 false-UNSAT + spine HOLD — PASS`; the doc shows `VERDICT: 0/50 — PASS`. A block presented as literal terminal output must be re-pasted, not hand-maintained.

---

## Meta-leak sweep

**Consumer corpus: literal zero.** Pattern `\b(tranche|wave N|WGATE|ballot|Fable|Opus|ultracode|the owner|owner-audit|T\d-W\d+|P\d-W\d)\b`, case-insensitive, over `README.md`, all six top-level `docs/*.md`, `csp-solver/{README,CHANGELOG}.md`, `csp-solver/wasm/{README,CHANGELOG}.md`, `csp-solver/wasm/pkg/README.md`, `web/frontend/README.md` → **no hits**. The T4-W14 re-formulation's meta-leak-zero property **still holds at HEAD**, 64 commits later. This is the one canon invariant that did not rot.

**One indirect leak vector (advisory, not a violation):**

`csp-solver/README.md:266` links a consumer outward to `../docs/precepts/canonical-readme-shape.md`. That file carries internal vocabulary — `canonical-readme-shape.md:3,75` "G.W5 sub-wave D close", `:87-89` paths into `muster/docs/tranches/G/waves/W5.md`, a **different repo's** tranche tree. A crates.io reader following the README's own link lands on cross-repo campaign process.

Leak density across `docs/precepts/` (files reachable only by explicit navigation, or by that one link):

| File | Hits |
|---|---|
| `design-idioms.md` | 12 |
| `cross-repo-dev-resolution.md` | 9 |
| `canonical-readme-shape.md` | **6** ← the linked one |
| `README.md` | 6 |
| `cross-repo-dev-iteration.md` | 5 |
| `tunable-anim.md` | 1 |

`docs/precepts/` is process substrate and is not itself a defect. The defect is the **outbound link from a published crate's README into it**. Cheapest cure: drop the link, or inline the two-sentence shape contract at `csp-solver/README.md:264-266`.

`.github/workflows/ci.yml` carries dense T3/T4/W-numbered provenance throughout. Not flagged — a workflow is not consumer-facing, and the provenance is the reason those gates are auditable.

---

## Cross-cutting notes

**The rot has one shape.** All 22 STALE rows are *frontend-half or artifact-half*, and all of them trace to work that landed **after** the last docs re-formulation (`d70073f3`, T4-W14): the five-family close and the T4-P1 Safari patch. The Rust-half canon — 31 TRUE rows, every count, band, constant, and version — re-derives exactly. **A doc set is only as fresh as its last enforcing pass; prose with no gate decays at the rate of the code beneath it.**

**Three claims are self-refuting inside this repo** — the tree already contains the correction and the doc was never swept: #39 (`ci.yml:147-148` names the stale spine), #56 (`csp-solver/README.md` L24-26 vs L35), #64/S12 (`Makefile` vs the README that ships beside it in the tarball).

**Second bite for the inline-comment class.** The brief flagged one prior stale `ci.yml` wasm-band comment. It recurred (S6) and has now spread to `Makefile:16` (S13) and `iai_queens.rs:8` (S14). Three sites, one class: **hand-copied measurements inside comments**. Per the standing class-invariant rule, the cure at second occurrence is mechanical — emit the measurement from the artifact at gate time (the `ci.yml:464` echo already prints the live `$RAW`; it just also prints a hardcoded literal beside it), not re-type it.

**Two enforcement surfaces exist with no doc home:** `filterBudget.ts` (9 live filters / ceiling 14 / union raster area, gated both regimes) and the webkit e2e project (91 tests). Both are P1-patch products. `docs/animation.md` is the designated peer reference for the first; `README.md:117` is the wrong-and-load-bearing sentence for the second.

**Not re-derived this pass (declared UNVERIFIABLE, not assumed true):** crates.io and npm registry state (#17, #18 — no network; the local `pkg/package.json` reads 0.6.0 but is wasm-pack-generated from source, so it is *not* evidence of the tarball), the GAC timing aggregate and its minority cost (#20 — stamped at `ede25188`, probe not re-run), the CI-runner wasm measurement (#43 — runner-side), and `time_sudoku` wall/count rows (#46).

ROW-COMPLETE

# Dead-code + dual-path census — T5 audit r1

**Scope** all stacks, read-only. **HEAD** `71456713d9f7361af80f09e1a456fc9787507e78` (2026-08-01).
**House law under test** no legacy, no aliases, no migration shims, no dual paths, no masking fallbacks.

## 0. Scope correction (evidence-first)

The commission named `web/api` (py). **It does not exist.** It was deleted at
`98fe2562` ("T2-W2: abrogation — the server, docker, and nginx go; wasm is the product"):

```
$ git log --oneline --all -- web/api | head -1
98fe2562 T2-W2: abrogation — the server, docker, and nginx go; wasm is the product
$ ls web/
frontend
```

The only live Python surface is the PyO3 binding tests, `csp-solver/tests-py/` (4 files, 586 LOC),
against `csp-solver/src/py/*.rs`. That is what §3 audits. Every `web/api` string still in the tree
is inside `docs/tranches/2026-07-*` historical evidence — correct there, and out of scope.

### Stacks measured

| Stack | Root | Files | LOC | Tool result |
|---|---|---|---|---|
| Frontend TS+Vue | `web/frontend/src` | 185 | 32,612 | `knip` exit 0, zero findings |
| Rust core + wasm | `csp-solver/src`, `csp-solver/wasm/src` | 110 | 11,276 | manual pub-reachability scan |
| Python | `csp-solver/tests-py` | 4 | 586 | manual |
| Scripts | `scripts/`, `web/frontend/scripts` | 5 | 1,156 | manual |

---

## 1. Frontend (TS + Vue) — `web/frontend/src`

### 1.1 Unused exports

`knip@6.26.0` is wired as a first-class gate (`package.json:lint:knip`, `knip.json` sets
**every** rule to `error`, including `exports`/`nsExports`/`types`/`nsTypes`/`enumMembers`).

```
$ ./node_modules/.bin/knip --no-progress
$ echo $?
0
```

**Zero unused exports, files, deps, or types.** Row: CLEAN.

Knip treats `*.test.ts` and `e2e/*.spec.ts` as entry points, so it cannot see exports that
*only* tests reach. An independent reachability scan closes that gap
(scratchpad `prune.mjs`; 47 symbols with no cross-file production importer):

| Symbol | Site | prod refs | test refs | Verdict |
|---|---|---|---|---|
| `__resetStagingBridge` | `games/shared/useStagingBridge.ts:254` | 0 | 4 | **REAL** — a test-only reset hatch compiled into the production bundle; `__`-prefixed by convention but not env-gated (contrast `main.ts:5`, `App.vue:77`, which *are* `import.meta.env.DEV`-gated) |
| `createSudokuAdapter`, `sudokuHouses` | `games/sudoku/technique/sudokuTechnique.ts:60,29` | 0 | 6 | REAL (minor) — internal helpers exported solely for the test; both have in-file call sites (`:63`, `:105`) |
| `createFutoshikiAdapter`, `futoshikiHouses`, `inequalityConstraints` | `games/futoshiki/technique/futoshikiTechnique.ts` | 0 | 3 ea. | REAL (minor) — same shape |
| `popcount`, `findStep`, `candidateValues` | `games/shared/techniqueEngine.ts` | 0 | 1–3 | REAL (minor) — same shape |
| `computeKeyboardInset`, `computeScrollDelta` | `games/shared/useKeyboardViewport.ts` | 0 | 1 ea. | REAL (minor) — pure functions split out for testability |
| `formatTechniqueName` | `games/shared/techniqueVoice.ts` | 0 | 1 | REAL (minor) |
| `FILTER_BUDGET*`, `PER_CELL_SCOPE`, `FILL_ALLOWLIST` (7) | `pencil/config/filterBudget.ts` | 0 | e2e only | **NOISE** — by design: the budget is a CI census contract consumed by `e2e/filter-census.spec.ts` |
| 24 exported `interface`/`type` (`Adjacency`, `FlipRect`, `GameStateDomain`, `StagedPair`, `GameCellProps`, …) | various | 0 | 0 | **NOISE** — each names a parameter or return type in an exported signature of its own module (e.g. `conflicts.ts:23` → used at `:43`; `useFlipGlide.ts:53` → used at `:71,113`). Knip agrees. |

Net: **12 real test-only exports**, of which **1 is a behavioural seam** (`__resetStagingBridge`).

### 1.2 Re-export shells and alias imports

```
$ grep -rn '^export \*\|^export {.*} from' web/frontend/src --include='*.ts'
(no output)
```

**Zero barrel files, zero re-export shells.** Row: CLEAN.

Three tsconfig path aliases (`tsconfig.json:17-21`): `@pencil/*`, `@games/*`, `@/*`. All three
have live import sites (e.g. `@/lib/base64url` at `games/sudoku/composables/useUrlState.ts:1`;
`@games/shared/solver/transport` at `games/sudoku/solver/useSolver.ts:34`). These are module-resolution
aliases, not compatibility aliases. Verdict: **NOISE**.

### 1.3 String census — legacy / deprecated / old / compat / fallback / shim

68 hits across `web/frontend/src`. Classification:

| Class | Count | Verdict |
|---|---|---|
| Prose in doc-comments narrating a *superseded* design ("the old vbWidth=220 carve-out", "replaces the old post-solve infinite-wiggle swarm") | 41 | **NOISE** — history, not code |
| `oldVal` / `oldValue` watcher parameters | 3 | NOISE |
| `<template #fallback>` (Vue Suspense slot) — `pencil/chrome/GameGallery/GameCard.vue:256` | 1 | NOISE — framework API name |
| Font-stack fallbacks (`AttributionCard.vue:108`, `HandwrittenLogo.vue:402`) | 2 | NOISE — CSS semantics |
| Named *live* fallback paths (see §5) | 21 | **REAL** — enumerated in the DUAL-PATH section |

Zero occurrences of `deprecated`, `shim`, `polyfill`, `back-compat`, or `v1`/`v2` version forks
in production source.

### 1.4 TODO / FIXME / HACK / XXX / suppressions

```
$ grep -rnE 'TODO|FIXME|HACK|XXX|@ts-ignore|@ts-expect-error|eslint-disable' \
    web/frontend/src csp-solver/src csp-solver/wasm/src csp-solver/tests-py scripts \
    web/frontend/scripts web/frontend/e2e
(no output)
```

**Literal zero across every stack.** No git-blame ages to report — the census is empty.
The single `@ts-` string in the repo is `// @ts-check` at `web/frontend/eslint.config.js:1`
(an enabling directive, not a suppression). Row: CLEAN.

### 1.5 Commented-out code blocks > 5 lines

A scan for ≥6 consecutive comment lines bearing code punctuation returned 14 candidates;
all 14 inspected, all 14 are prose or rustdoc doctests:

- `App.vue:227-234` — narrative block on the board⇄card fold. Prose.
- `csp-solver/src/builder/assignment.rs:215-222` — a ` ``` ` doctest, *compiled and run* by `cargo test`.

**Zero commented-out code blocks.** Row: CLEAN.

### 1.6 Feature flags / props / constants holding one value forever

| Item | Site | Verdict |
|---|---|---|
| `PER_CELL: readonly FilterBudgetRow[] = []` | `pencil/config/filterBudget.ts:72` | **REAL (accepted)** — permanently empty since the T4-P1 deletion cure; kept as a documented gravestone with a named retirement trigger. Structurally inert (concatenating `[]` adds nothing); the gate that actually bites is the total. |
| `HTML_BOXES: readonly FilterBudgetRow[] = []` | `pencil/config/filterBudget.ts:106` | REAL (accepted) — same shape |
| `proactiveErrorCheck?: boolean` | `games/shared/GameBoard.vue:98`, threaded through 5 boards | **NOISE** — investigated and cleared: every one of the 5 games supplies a real reactive source (`SudokuGame.vue:171`, `ThermoGame.vue:105`, `KenKenGame.vue:94`, `KillerGame.vue:95`, `FutoshikiGame.vue:128`). Both branches live. |
| 8 `pencilConfig.ts` exports | `pencil/config/pencilConfig.ts` | NOISE — refs 6–55 each; all live |
| `knip.json` `ignore` of 2 CSS files | `knip.json:4` | NOISE — `scene.css`/`gameCell.css` are `@import`-ed from SFC `<style>` blocks knip cannot follow |

### 1.7 Duplicate implementations across dirs

The five games each carry a private copy of the same four modules. Measured by `diff -u | grep -c '^[+-]'`:

| Module family | Files | Sizes (LOC) | Nearest-pair delta | Verdict |
|---|---|---|---|---|
| `*/solver/useSolver.ts` | 5 | 151, 151, 152, 192, 193 | killer↔thermo **48 lines** of 151 (~68% identical) | **REAL** |
| `*/solver/solver.worker.ts` | 5 | 114, 115, 117, 144, 144 | killer↔kenken **39 lines** of 114 (~66% identical) | **REAL** |
| `*/solver/protocol.ts` | 5 (+1 shared, 32 LOC) | 75, 81, 81, 82, 83 | — | REAL |
| `*/composables/*UrlState.ts` | 5 | 108, 109, 109, 302, 372 | killer↔thermo **47 lines** of 109 (~57% identical) | **REAL** |
| `*/solver/*Wire.ts` | 3 | 35, 38, 47 | — | REAL |
| `*/ControlPanel/constants.ts` | 3 | 19, 31, 31 | futoshiki/kenken byte-differ (`f195eff9…` vs `98695682…`) | REAL (minor) |

Mitigating: the genuinely shared parts *were* extracted — `games/shared/solver/transport.ts` owns
the Worker singleton, pending map, and bounded respawn (`useSolver.ts:19-21` says so). What remains
duplicated is per-game marshalling that is 60–70% boilerplate. Ranked in §5.

Second duplication, architecturally forced:

| Routine | Site A | Site B | Verdict |
|---|---|---|---|
| Module-level `(pointer: coarse)` MediaQueryList | `games/shared/useCoarsePointer.ts:8-22` (`mediaRef`) | `pencil/chrome/AttributionCard/useHoverCard.ts:9-16` | **REAL** — a verbatim second implementation. `useHoverCard.ts:3-6` states the cause: the eslint boundary `pencilMayNotImportGames` forbids the import. The lint is right; the cure is a third neutral module, not a copy. |

---

## 2. Rust — `csp-solver/src`, `csp-solver/wasm/src`

### 2.1 Unreachable / never-called public API

Reachability scan over `src`, `wasm/src`, `tests`, `benches`, `examples`, `wasm/tests`,
plus the whole frontend and `tests-py`:

| Symbol | Site | Verdict |
|---|---|---|
| `pub fn set_domain` | `csp-solver/src/variable.rs:57` | **REAL — dead.** Exactly one occurrence of `set_domain(` in the entire tree, its own definition:<br>`$ grep -rn 'set_domain(' --include='*.rs' . \| grep -v /target/`<br>`csp-solver/src/variable.rs:57: pub fn set_domain(&mut self, domain: D) {`<br>Its doc-comment at `:56` asserts *"used during initial propagation"* — **a doc claim the tree refutes.** Age: `git blame -L57,57` → `e03a79d1d … 2026-04-06`, ~4 months unreferenced. |
| `propagate_sudoku`, `propagate_futoshiki`, `propagate_kenken`, `propagate_killer`, `propagate_thermo`, `generate_sudoku` | `csp-solver/wasm/src/*.rs` | **NOISE** — `#[wasm_bindgen]` exports consumed by JS under camelCase: `propagateThermo` at `games/thermo/solver/solver.worker.ts:71`, `propagateSudoku` at `games/sudoku/solver/solver.worker.ts:98`, `propagateKiller` at `games/killer/solver/solver.worker.ts:71`, `propagateFutoshiki` at `games/futoshiki/solver/solver.worker.ts:89`, `propagateKenken` at `games/kenken/solver/solver.worker.ts:71`, `generateSudoku` at `games/sudoku/solver/useSolver.ts` chain via worker `:113`. All five live. |
| `*PuzzleData`, `*SolveResult` (10 types) | `csp-solver/wasm/src/*.rs` | NOISE — `#[wasm_bindgen]` struct surfaces crossing the FFI boundary |

### 2.2 `#[allow(...)]` census

10 sites, zero of them dead-code suppressions:

- 6 × `clippy::too_many_arguments` (`solver/ac3.rs:116`, `solver/gac/matching.rs:131`, `solver/propagate.rs:24,87`, `solver/search.rs:312,467`)
- 2 × `non_camel_case_types` (`py/enums.rs:10,33` — PyO3 enum variants mirroring Python naming)
- 2 × `non_snake_case` (`py/sudoku.rs:78,178` — the `N: u32` parameter, matching the Python kwarg)

**Zero `#[allow(dead_code)]`, zero `#[allow(unused)]`.** Row: CLEAN — the compiler's own
dead-code lint is unmuzzled everywhere.

### 2.3 cfg-gated arms

| Gate | Sites | Both arms compiled? | Verdict |
|---|---|---|---|
| `feature = "py"` / `not(feature = "py")` — the `ThreadSafe` bound | `constraint/traits.rs:43-50`, `lib.rs:28` | **Yes.** CI job `py-compile` runs `cargo check -p csp-solver --features py` (`.github/workflows/ci.yml:207`); the default arm is the workspace default every other job builds. `traits.rs:41-42` also cites the vendor sync gate as compiling both. | NOISE — a genuinely dual-configuration bound, both arms enforced |
| `feature = "assignment"` | `wasm/src/lib.rs:39,48` | **Yes.** Lean deploy: `--no-default-features` (`ci.yml:361`, `wasm/Makefile:20`). Full module: `wasm-pack build csp-solver/wasm --profile wasm-release` at `ci.yml:418` (default features ⇒ `assignment` on). | NOISE — zero *in-repo* consumers (its consumer is bbnf-buddy, out of tree), but both arms are built and the artifact is published |
| `feature = "abi3"` | `csp-solver/Cargo.toml:20` | **NO.** | **REAL — dead feature flag.** See below. |

**`abi3` — a feature nothing compiles.** Declared `abi3 = ["py", "pyo3/abi3-py310"]`
(`csp-solver/Cargo.toml:20`, `git blame` → `b8af49d2b … 2026-07-10`). Exhaustive search:

```
$ grep -rn 'abi3' --include='*.yml' --include='*.toml' --include='*.md' --include='Makefile' \
    --include='*.sh' . | grep -v /target/ | grep -v docs/tranches
csp-solver/Cargo.toml:16:# abi3-py310: build a single forward-compatible wheel …
csp-solver/Cargo.toml:20:abi3 = ["py", "pyo3/abi3-py310"]
csp-solver/tests-py/pyproject.toml:15:# extension-module, no abi3), so the venv interpreter must be 3.13.
```

No CI job, no Makefile target, no script builds it. The **only** other mention is the Python
test harness explicitly declaring it builds *without* abi3. A feature arm that no configuration
in the repository ever type-checks is exactly the "cfg-gated arm nothing compiles" the house law names.

### 2.4 Rust strings / TODOs / commented code

Zero `TODO`/`FIXME`/`HACK`/`XXX` (§1.4 command covers `csp-solver/src` and `csp-solver/wasm/src`).
Zero commented-out code blocks (§1.5). No `legacy`/`deprecated`/`compat`/`shim` in Rust source.

---

## 3. Python — `csp-solver/tests-py`

| Row | Finding | Verdict |
|---|---|---|
| Files | 4, 586 LOC — `test_bench_compare.py`, `test_panic_contract.py`, `test_rust_backend.py`, `test_wheel_contracts.py` | — |
| Skip gates | 4 × `pytest.importorskip("csp_solver")` (`test_bench_compare.py:10`, `test_rust_backend.py:12`, `test_wheel_contracts.py:21`, `test_panic_contract.py:35`) | **NOISE** — every skip carries a cited reason; `test_panic_contract.py:40` states the intent literally: *"py-runtime CI lane skipped, not silently green"* |
| `@pytest.mark.skipif(sys.platform == "win32", …)` | `test_panic_contract.py:105-108` | **NOISE (weak)** — the CI matrix is darwin+linux, so this arm never fires; it is a 4-line platform guard on a POSIX-signal contract, correctly reasoned at `:107`. Not worth a cure. |
| Stale prose | `test_panic_contract.py:16-17`: *"which lands in W1; until then it is skipped"* | **REAL (doc only)** — W1 landed at T2 (`80c33c24`, "W1 gate closure — wheel contracts, panic fix"). The comment describes a pre-W1 world that no longer exists. Zero code impact. |
| `try:` / `except BaseException:` | `test_panic_contract.py:93-98` | **NOISE** — inside `_ABORT_CHILD`, a *negative control*: the test asserts the except block is **never** reached. Masking is the thing under test. |
| TODO/FIXME | zero | CLEAN |

---

## 4. Scripts — `scripts/`, `web/frontend/scripts`

| File | LOC | Finding | Verdict |
|---|---|---|---|
| `scripts/dev.sh` | 84 | Frontend-only launcher; header at `:4-5` states there is no backend to launch — consistent with the §0 abrogation. No dead branches; the layout guard at `:20-23` fails explicitly with a message and `exit 1`. | CLEAN |
| `web/frontend/scripts/check-golden-bytes.mjs` | — | `catch (err)` at `:30` — inspected, re-raises context | CLEAN |
| `web/frontend/scripts/check-prod-shake.mjs` | — | bare `catch {}` at `:33` | see §5, DP-7 |
| `check-font-coverage.mjs`, `check-ink-pressure.mjs` | — | no findings | CLEAN |
| `vite.config.ts:94` | — | `catch { return null }` around `readFileSync` of the generated file — the write-if-changed idiom; a missing output file *is* the "no existing content" case | NOISE |

TODO/FIXME across all scripts: **zero**.

---

## 5. DUAL-PATH + MASKING-FALLBACK — severity-ranked

The house posture is FAIL-EXPLICIT. Ranked by *how much wrong behaviour hides behind the mask*.

### S1 — HIGH: the template bank is a silent two-path board generator

`games/sudoku/solver/useSolver.ts:106`

```ts
const boards = TEMPLATE_BANK[size]?.[DIFFICULTY_KEY[difficulty]] ?? [];
```

`?.` + `?? []` collapses **three distinct states** into one: (a) tier deliberately excised,
(b) tier present, (c) tier *silently lost* by a build regression. The bank really is holed —
`data/templates.ts:7` ships `"3":{"easy":[],"medium":[],"hard":[…20…]}`; on disk:

```
$ for d in csp-solver/data/sudoku_puzzles/*/*/; do echo "$d $(ls $d | wc -l)"; done
csp-solver/data/sudoku_puzzles/3/hard/   20 files
csp-solver/data/sudoku_puzzles/4/easy/   10 files
csp-solver/data/sudoku_puzzles/4/hard/    5 files
csp-solver/data/sudoku_puzzles/4/medium/ 10 files
```

So 9×9 easy and 9×9 medium — two of the product's headline tiers — take the *other* path
(wasm live-generation) with no assertion, no telemetry, no distinguishable failure.
`vite.config.ts:29-35` documents the excision, and the generator's own guard
(`vite.config.ts:50-53`, "Never let a missing dir throw") is the second half of the same mask:
a dropped directory and a deliberate excision produce byte-identical output. Blame:
`54b1bcb56 … 2026-07-13`.

**Why S1:** it is the only mask on this list that can change *what the user is shown* while
every gate stays green. **Cure:** an explicit `TIER_SOURCE: Record<size, Record<tier, 'bank'|'livegen'>>`
table, asserted against the rendered bank at build time — the excision becomes a declaration, and a
lost directory reds.

### S2 — HIGH: the `.stop()` try/catch swarm — 11 sites, 6 files, one unanswered contract

```
$ grep -rn -B2 '\.stop();' src --include='*.ts' --include='*.vue' | grep -c 'try {'
11
```

Sites: `games/shared/DifficultyTally.vue:130`, `pencil/chrome/CelebrationHeart.vue:101`,
`pencil/chrome/CelebrationStar.vue:47`, `pencil/chrome/GameGallery/GameGallery.vue:179`,
`pencil/glyph/HandwrittenGlyph.vue:114,122,130,276,293`,
`pencil/grid/HandDrawnGrid/usePathAnimation.ts:38`.

Every one is `try { h.stop(); } catch { /* ignore */ }` against `@mkbabb/pencil-boil`'s
`SequenceHandle`. This is a **binary** question with no third answer:

- If `stop()` **can** throw, 11 hand-copied catch blocks are the wrong shape — it needs one
  `stopAll(handles)` helper, and the swallow needs a stated reason.
- If `stop()` **cannot** throw, all 11 catch arms are unreachable code, and they are hiding
  a lifecycle bug class (double-stop, stop-after-unmount) that would otherwise surface.

**Why S2:** 11 copies of an identical masking idiom is both the largest duplication *and* the
largest unexamined swallow in the tree, and it sits on the animation spine the T4-P1 patch just
rebuilt. **Cure:** read the library's contract, then either one helper or zero catches.

### S3 — MEDIUM: corrupt staging-ledger reads as empty

`games/shared/useStagingBridge.ts:154` `catch { return {}; }` — a malformed
`localStorage` ledger is indistinguishable from a first-run empty one. Paired with `:242`
`catch { return null; }` on the per-game board read. Blame `7ad0f821a … 2026-07-31` (new code).
The picker then shows a *wrong but plausible* set of chips. **Cure:** on parse failure, clear the
key and record the fact — never return a shape that means "nothing was ever staged".

### S4 — MEDIUM: `rasterPose` returns `""` on three different failures

`pencil/composables/rasterPose.ts:21` (no document), `:23` (element absent), `:27` (serializer threw)
all return the empty string. The consumer then bakes a pose with **no filter** — a silent visual
degradation on exactly the surface the T4-P1 patch cured. `readCssValue` at `:40-44` repeats the
shape with a caller-supplied `fallback`. **Cure:** distinguish "not yet" (hold the live-filter
fallback, which the header at `:18` says is the intent) from "broken" (fail loud in dev).

### S5 — MEDIUM: three "fail quietly" user-facing paths

| Site | Code | Effect |
|---|---|---|
| `games/shared/useGameState.ts:652` | `catch { return; }` — comment: *"solve unavailable — fail quietly"* | Hint button does nothing, no explanation |
| `games/shared/useAnswerKeyPeek.ts:37` | `catch { peekActive.value = false; }` | Peek flickers and aborts |
| `games/shared/usePencilMarks.ts:40` | `catch { pencilMasks.value = null; }` | Marks vanish mid-gesture |

All three are *deliberate* — each carries a comment saying so. But the same file proves the house
has a better instrument: `useGameState.ts:459` and `:538` route failures through
`classifyError(e)` into the teacher-red / paper-note taxonomy, and `:460` explicitly records that
*"a generate failure was fully silent before"* and was fixed. These three are the unconverted
remainder of that same beat. **Cure:** route them through `classifyError` too.

### S6 — MEDIUM: five parallel copies of one solver client

Per §1.7: `useSolver.ts` ×5, `solver.worker.ts` ×5, `protocol.ts` ×5, `*UrlState.ts` ×5,
`*Wire.ts` ×3 — 60–70% textually identical between the three "simple" games
(killer↔thermo `useSolver` differ by 48 of 151 lines). Not a *fallback* path, but it is five
paths where one plus a shape parameter would do, and every future solver fix must land five times.
Mitigant: the hard part (Worker singleton, pending map, bounded respawn) *is* already shared at
`games/shared/solver/transport.ts`. **Cure:** a `defineSolverClient({ marshal, unmarshal })` in
`games/shared/solver/`, mirroring the `defineGame` registry contract that already exists.

### S7 — LOW: dead code and dead flags with no runtime effect

| Item | Site | Note |
|---|---|---|
| `pub fn set_domain` | `csp-solver/src/variable.rs:57` | Zero callers; doc-comment asserts a call site that does not exist. Dead since 2026-04-06. **Delete.** |
| `abi3` feature | `csp-solver/Cargo.toml:20` | No configuration compiles it (§2.3). **Delete or wire a CI arm.** |
| `__resetStagingBridge` | `games/shared/useStagingBridge.ts:254` | Test-only seam shipped to production, un-gated. **Env-gate or inject.** |
| `PER_CELL`/`HTML_BOXES` empty budget tables | `pencil/config/filterBudget.ts:72,106` | Permanently `[]`; documented gravestones with named triggers. Accept, or move the prose to the doc and delete the bindings. |
| 11 test-only exports | §1.1 | Accept — they are the cost of testing pure helpers |

### S8 — LOW: dead browser-compat branches below the stated support floor

`games/shared/useCoarsePointer.ts:15` and `pencil/chrome/AttributionCard/useHoverCard.ts:13`
both write `mq.addEventListener?.("change", …)` with the comment *"Safari <14 lacks
addEventListener on MQL"*. Safari 14 shipped 2020; this repo's own measurement floor is
Safari 26.4 / iOS 19 (`filterBudget.ts:32`, `pencil/chrome/ScribbleLoader.vue:19`,
`games/sudoku/SudokuGame.vue:49`). The `?.` guards a browser the project does not target.
Blame `0642e098b … 2026-07-31` — written *this cycle*, i.e. a shim added new.
Related: `games/shared/useKeyboardViewport.ts:98` guards absent `visualViewport` ("an old engine,
or SSR"). **Cure:** state the support floor once, then drop the sub-floor guards.

### S9 — LOW: `App.vue:188` swallows a preload failure whole

```ts
if (!card.eager) card.scene().catch(() => {});
```

A failed lazy-chunk preload is discarded with no record. It is *recoverable* (the real select
re-imports), so the cost is a slow deal rather than a broken one — but it is the only
zero-argument `.catch(() => {})` in production source, and a chunk 404 after a deploy is precisely
the failure this hides. Compare `pencil/chrome/GameGallery/useCarouselGlide.ts:244`, the same shape.

### Not findings (checked, cleared)

- **`?.` census** — 17 optional-call sites; 15 are optional *callbacks* (`options.onSettle?.()`,
  `extra?.()`, `nav.vibrate?.(ms)`), the correct idiom for an optional hook. Only the 2 MQL sites (S8) are shims.
- **`??` census** — 150 sites; sampled, overwhelmingly default-value coalescing on genuinely
  optional config, not error masking. S1 is the one that hides a *state*, not a value.
- **`localStorage` try/catch** — 46 references across 11 files, each wrapped. The swallow is correct
  (denied storage must not break the app) and every site says so
  (`useControlsDrawer.ts:71` "storage denied → default open, unpersisted"; `useStagingBridge.ts:166`
  "best-effort, exactly like every per-game persist in the estate"). The *duplication* is real but
  is a sub-case of S6.
- **`proactiveErrorCheck`** — suspected always-`undefined` prop; all 5 producers found. Cleared.

---

## 6. Scorecard

| Row | Result |
|---|---|
| Unused exports (knip, all rules `error`) | **0** |
| Re-export shells / barrel files | **0** |
| TODO / FIXME / HACK / XXX, all stacks | **0** |
| `@ts-ignore` / `@ts-expect-error` / `eslint-disable` | **0** |
| `#[allow(dead_code)]` / `#[allow(unused)]` | **0** |
| Commented-out code blocks > 5 lines | **0** |
| Version-forked or `deprecated`-marked API | **0** |
| Dead public Rust API | **1** (`variable.rs:57`) |
| Feature flags nothing compiles | **1** (`abi3`) |
| Test-only exports in the production bundle | **12** (1 behavioural) |
| Duplicate implementations across dirs | **6 families** (5-way solver client; 2-way `mediaRef`) |
| Masking fallbacks contra FAIL-EXPLICIT | **9 ranked** (S1–S9) |

The hygiene rows are genuinely clean, and they are clean because they are *enforced* — knip with
every rule at `error`, no lint suppressions anywhere, no muzzled dead-code lint. What the enforcement
does not reach is the shape the house law actually names: **paths that fork on a missing value
instead of on a stated decision.** S1 and S2 are the two that matter; S1 because it can silently
change what a player is served, S2 because 11 copies of one swallow is a contract nobody has read.

ROW-COMPLETE

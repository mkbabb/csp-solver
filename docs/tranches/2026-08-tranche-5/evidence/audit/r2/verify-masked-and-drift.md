# R2 adversarial verify — masked fallbacks (J1/J2/J3) + doc-canon headliners

**Tree:** `71456713d9f7361af80f09e1a456fc9787507e78` (`master`, clean except the untracked
`docs/tranches/2026-08-tranche-5/`). **Verified 2026-08-01.** Every row below was re-derived by
this pass — commands run and quoted, files read at the cited line. Nothing inherited from R1.

**Sources under audit:** `evidence/audit/r1/dead-code-census.md` §5 (S1, S2, S8) and
`evidence/audit/r1/doc-canon-drift.md` §S2–S10.

**Headline:** the R1 *drift* half holds — 8 of 8 doc headliners re-derive as claimed, with one
count correction. The R1 *masking* half does not: **J1 is DESIGNED-DOCUMENTED in the consumer
README itself** (R1's S1-HIGH is overstated), **J2's "binary question with no third answer" is
already answered by the library source** (all 11 catch arms are provably unreachable, and the
shared helper is importable — the copy is not forced), and **J3's provenance claim is FALSE**
(the shim is three weeks older than R1 says).

---

## Part 1 — J1 · TEMPLATE_BANK

### 1.1 On-disk truth

```
$ find csp-solver/data -type d | sort
csp-solver/data/sudoku_puzzles/{3/hard, 4/easy, 4/hard, 4/medium}

$ for d in csp-solver/data/sudoku_puzzles/*/*/; do echo "$d $(ls $d | wc -l)"; done
3/hard/   20      4/easy/   10      4/hard/    5      4/medium/ 10
$ find csp-solver/data -type f | wc -l  → 45 ;  total bytes → 32,095
```

Generated bank, parsed out of `web/frontend/src/games/sudoku/data/templates.ts:7`:

| size | easy | medium | hard |
|---|---|---|---|
| 3 (9×9) | **0** | **0** | 20 |
| 4 (16×16) | 10 | 10 | 5 |

**Empty pairs: exactly two — (N=3, easy) and (N=3, medium), i.e. 9×9 easy and 9×9 medium.**
Confirms R1's on-disk reading.

### 1.2 The wiring, end to end

`web/frontend/vite.config.ts:26-104` — `sudokuTemplates()` plugin, `buildStart`, `SIZES = [3,4]`,
`DIFFICULTIES = ['easy','medium','hard']`, per-tier `existsSync(dir)` guard at `:50-53` →
`bank[n][d] = []`. Consumer: `games/sudoku/solver/useSolver.ts:106`
`TEMPLATE_BANK[size]?.[DIFFICULTY_KEY[difficulty]] ?? []` → an empty `Uint32Array` → transferred to
the Worker (`solver.worker.ts:117`) → `generateSudoku(n, difficulty, seed, templates)`
(`csp-solver/wasm/src/sudoku.rs:269-296`) → **`if templates.is_empty()`** at `:284` selects
`generate_board_seeded` (hole-dig) over `generate_board_with_templates_seeded`.

### 1.3 USER-FACING consequence on the live-gen path — measured, not asserted

| Axis | Bank path | Live-gen path (the two empty tiers) | Delta |
|---|---|---|---|
| **Latency** | pick index + seeded symmetry transform (`generate.rs:243-257`) — sub-ms | seeded hole-dig (`generate.rs:259-333`) | banked browser p95 (module Worker, lean wasm, Chromium): **9×9-easy 2.98 ms · 9×9-medium 6.84 ms** — `evidence/pass2/P2.md` §THE MEASUREMENT. Off the main thread; round-trip tracks compute within 0.4 ms. Against the wave's stated **≤50 ms** felt-latency budget this is ≥7× headroom. **Not user-detectable.** |
| **Difficulty calibration** | templates minted by the same hole-dig | `target_holes` = `total/4` · `total/1.75` · `total/1.25` (`generate.rs:298-302`) | **ZERO delta — identical by construction.** Proof from the bank itself: every 16×16-easy board carries exactly **64 holes** = `256/4`, the live-gen easy target to the cell. 16×16-medium 137–146 (target 146), 16×16-hard 156–165 and 9×9-hard 54–59 — short of target only where the `max_solutions=2` uniqueness check refuses the dig. The backtrack bands R1 and `docs/sudoku.md:61` argue over (`expected_backtrack_band`, `generate.rs:157-166`) are `#[cfg(debug_assertions)]` and **never gate the release path** (`:145-146` says so literally). |
| **Determinism** | `generate_board_with_templates_seeded(…, seed)` | `generate_board_slow_with_rng(…, SimpleRng::new(seed))` | **ZERO delta.** Both branches are pure functions of `seed`. The frontend passes `seed: Date.now()` (`useSolver.ts:120`) on both, so neither is session-reproducible. |
| **Board variety** | 20 (or 5–10) fixed skeletons × the symmetry group | a fresh skeleton every deal | live-gen is strictly **more** varied |

**Conclusion: routing 9×9 easy/medium to live-gen has no adverse user-facing consequence.**
It is the better path for those two tiers, which is why it was chosen.

### 1.4 Is there a record ACCEPTING this path as designed?

**Yes — four, one of them consumer canon.**

1. **`README.md:58` — the root consumer README states the split exactly right:**
   > "Sudoku's N=2 and N=3 easy/medium boards are dealt live; N=3-hard and all N=4 come from the
   > embedded bank of 45 boards (32,095 B), owned by `csp-solver/data/sudoku_puzzles/` and derived
   > into the SPA at build time."

   Byte-for-byte the on-disk truth in §1.1. **R1's dead-code-census S1 did not consult this line.**
2. `docs/sudoku.md:3,22,51-53` — both paths named, and `:53` states the switch rule verbatim:
   *"When no templates exist for the requested size/difficulty, generation falls back to hole-digging."*
3. `web/frontend/vite.config.ts:29-35` — the in-tree rationale ("the fast-path bank now ships only
   the tiers whose native generate breaches the in-browser budget"). Landed `22514bae` (2026-07-10),
   the same commit as the excision.
4. `docs/tranches/2026-07-tranche-2/waves/T2-W4-data-reshape.md:24-33` — the ratification, on the P2
   measurement: *"Excise unconditionally (≥7× headroom on every reproduction): N=2 all tiers,
   **N=3-easy**, **N=3-medium**"*; *"**KEEP the N=3-hard bank** unless a confirmation run on a genuine
   low-power device clears p95 ≤ 50 ms"*; *"**KEEP the N=4-hard bank** — the >1 s native generate wall
   is real"*. Line `:31` authors the very guard R1 calls "the second half of the same mask":
   *"the conservative split needs `SIZES=[3,4]` **plus** an `existsSync(dir)` guard in the Vite plugin
   (`readdirSync` throws ENOENT on a git-rm'd difficulty dir; missing dir → `bank[n][d]=[]` → `?? []`
   → live-gen)."* Shipped `22514bae` + `54aa94a5` (`2026-07-tranche-2/README.md:50`).

### 1.5 VERDICT J1 — **DESIGNED-DOCUMENTED**

Documented at `README.md:58` (consumer), `docs/sudoku.md:3,22,53` (peer reference),
`vite.config.ts:29-35` (in-tree), ratified at `T2-W4-data-reshape.md:24-33` on `evidence/pass2/P2.md`.

**R1's S1 severity is OVERSTATED and its central claim unsupported.** S1 asserts the mask "is the
only mask on this list that can change *what the user is shown* while every gate stays green."
It cannot: §1.3 shows both branches produce identically-calibrated, equally-deterministic boards,
and the two empty tiers are the ones the record deliberately routed there.

**The residual real row, narrowed:** no assertion binds tier presence to a stated decision, so a
*lost* `3/hard` or `4/hard` directory would degrade silently to live-gen — and those are the two
tiers the wave explicitly refused to route there (3/hard: desktop p95 22–25 ms, contended 31.5 ms,
only ~1.6–2.1× headroom, the low-power confirmation run never made; 4/hard: the >1 s generate wall,
banked at `T2-W4:30`, not re-derived this pass). The blast is **a slower deal, never a wrong one** —
the hole-dig still proves uniqueness per hole (`generate.rs:322-329`), it just runs long when the
target is unreachable (16×16-hard target 204 vs the bank's observed 156–165 ceiling). R1's proposed
cure (an explicit `TIER_SOURCE` table asserted at build time) is **right in kind, wrong in stated
stakes**: it converts a latency-regression risk into a red build, not a correctness one.

**Second-order note (unflagged by R1):** `generate_board_with_templates_seeded` — the *only* path
the browser ever takes — deliberately omits the R13 difficulty-consistency assertion that its
native twin runs, with the rationale stated at `generate.rs:233-242`. So the "future template
loader mixes up the directory" scenario has **no** guard on the shipped path, only on the native
debug one. That is the sharper version of R1's concern and it is DESIGNED-DOCUMENTED at that
docstring.

---

## Part 2 — J2 · the `try { stop() } catch { ignore }` swarm

### 2.1 Independent count

```
$ grep -rn "\.stop()" src --include='*.ts' --include='*.vue' | wc -l          → 17
$ grep -rn -B2 "\.stop();" src --include='*.ts' --include='*.vue' | grep -c 'try {'  → 11
```

**11 sites across 6 files — R1's count CONFIRMED.** Its enumeration is not: R1 lists **ten**
entries, cites `HandwrittenGlyph.vue:276,293` (the `catch` lines, not the `try` lines), and
**omits the site at `:178` entirely**. Corrected roster (`try` line):

| # | Site |
|---|---|
| 1 | `src/games/shared/DifficultyTally.vue:130` |
| 2 | `src/pencil/chrome/CelebrationHeart.vue:101` |
| 3 | `src/pencil/chrome/CelebrationStar.vue:45` |
| 4 | `src/pencil/chrome/GameGallery/GameGallery.vue:179` |
| 5–10 | `src/pencil/glyph/HandwrittenGlyph.vue:114, 122, 130, **178**, 274, 291` |
| 11 | `src/pencil/grid/HandDrawnGrid/usePathAnimation.ts:38` |

### 2.2 The contract is not open — it is answered in the installed source

`@mkbabb/pencil-boil@0.10.1` (`package.json:36` `^0.10.1`; installed 0.10.1 — ships TS source, no
`dist/`). `SequenceHandle` is declared at `node_modules/@mkbabb/pencil-boil/src/vue.ts:642-645`;
its `stop` is `vue.ts:672-676`:

```ts
function stop() {
  sub.active = false;
  subscribers.delete(sub);
  maybeStopScheduler();
}
```

Three total statements: a boolean write, `Set.prototype.delete` (total), and
`maybeStopScheduler()` (`vue.ts:265-270` — two guarded early returns, a boolean write, and
`stopChain()`). `BoilHandle.stop` (`vue.ts:326-329`, impl `:343-347`) is the identical shape.
Under PRM, `createStrokeDrawIn` returns an inert `{ start: () => {}, stop: () => {} }`
(`vue.ts:713-717`). **The only `throw` statements in the entire package are
`src/raster.ts:131,155,173`, all inside `rasterizePose` — nowhere on any stop path.**

**Corroboration from the repo's own code:** five in-tree call sites already invoke `.stop()` on the
same handle type **unguarded** — `pencil/composables/boilBeat.ts:50`,
`pencil/chrome/GameGallery/GameCard.vue:124`, `pencil/glyph/glyphAnimations.ts:77,130,173`. The
last two are the `GlyphAnimHandle` wrappers (`stop: () => seq.stop()`) that `HandwrittenGlyph.vue`
then wraps in six try/catch blocks — the file guards a call whose own body calls `.stop()` naked.

**⇒ All 11 catch arms are unreachable code.** This resolves R1's S2 to its second horn: they are
hiding a lifecycle bug class (double-stop, stop-after-unmount) that would otherwise surface.
Note `stop()` is idempotent by construction, so double-stop is benign — the swallow is
*inert*, not *dangerous*. Severity: R1's HIGH is too strong; this is a **duplication/inertness**
row, not a masking one.

### 2.3 Is a shared helper importable under the boundary lints? — **YES, the copy is NOT forced**

`web/frontend/eslint.config.js` (201 L) declares four boundaries: `pencilMayNotImportGames` (`:36-53`),
`sudokuMayNotImportFutoshiki` (`:57-80`), `futoshikiMayNotImportSudoku` (`:81-`),
`sharedMayNotImportGames` (`:114-`), plus `pencilDepthPattern` (`:25-31`, blocks `@pencil/*/*/*/*`
and deeper) and `appShellDepthRule`.

- 10 of the 11 sites live under `src/pencil/**`; intra-pencil imports are unrestricted.
- The one games-side site is `games/shared/DifficultyTally.vue`. `games → pencil` is *"expected and
  unrestricted"* (`eslint.config.js:35`), subject only to the depth rule.
- A helper at `src/pencil/composables/stopAll.ts` resolves as `@pencil/composables/stopAll` —
  **depth 2**, well inside the depth-3 ceiling.
- **Proven, not inferred:** `DifficultyTally.vue:48` already does
  `import { useBeatFrame } from "@pencil/composables/boilBeat"` — the exact import shape, same
  directory, already green under the lints.

**VERDICT J2:** count 11 CONFIRMED (roster corrected); the contract question is **CLOSED — `stop()`
cannot throw**; the helper is importable by all six files. R1's S2 stands as a real duplication
finding at reduced severity, and its "binary question with no third answer" framing is resolved
here rather than left open.

---

## Part 3 — J3 · Safari <14 MQL shims

### 3.1 Sites

`games/shared/useCoarsePointer.ts:12-16` and `pencil/chrome/AttributionCard/useHoverCard.ts:8-13`,
both `mq.addEventListener?.("change", …)` under the comment *"Safari <14 lacks addEventListener
on MQL"*.

### 3.2 Provenance — **R1's blame is WRONG**

```
$ git log -S 'Safari <14' --reverse -- web/frontend/src
7c967416 | 2026-07-11 | T3-W11: UI completeness + security …
b8acf3f7 | 2026-07-13 | T4-WM: the mobile recut …

$ git log -S 'addEventListener?.("change"' --reverse -- web/frontend/src
7c967416 | 2026-07-11   b4d7aedf | 2026-07-11   b8acf3f7 | 2026-07-13   0642e098 | 2026-07-31

$ git log -L 8,16:web/frontend/src/pencil/chrome/AttributionCard/useHoverCard.ts
b8acf3f7 | 2026-07-13
```

R1 states: *"Blame `0642e098b … 2026-07-31` — written **this cycle**, i.e. a shim added new."*
`git show 0642e098 -- web/frontend/src/games/shared/useCoarsePointer.ts` shows the diff **hoists**
the pre-existing `mediaRef` block — comment and `?.` carried verbatim — into a generalized
`mediaRef(query, initial)` for the P1-W4 panel-twin work. **The shim was authored 2026-07-11
(`7c967416`, T3-W11), twenty days earlier.** `useHoverCard.ts`'s copy dates to `b8acf3f7`
(2026-07-13). **FALSE as stated.**

### 3.3 "Below-floor" — **partially confirmed, on a weaker basis than R1 gives**

R1 cites *"this repo's own measurement floor is Safari 26.4 / iOS 19"* at `filterBudget.ts:32`,
`ScribbleLoader.vue:19`, `SudokuGame.vue:49` (plus `composables/useTheme.ts:25`). Reading those
lines: every one names a **perf-rig device** (`perf-rig-iphone16`, "real MobileSafari iOS 19",
"real Safari 26.4"), not a declared support floor. **There is no browserslist and no stated
support floor anywhere in the tree.** The only compiled floor is `vite.config.ts:257`
`target: 'es2020'` (+ `tsconfig.json:3` `"target": "ES2020"`).

That floor does not fully retire the guard: optional chaining is Safari 13.1, MQL
`addEventListener` is Safari 14 — a Safari 13.1 client would parse the bundle and reach the guard.
So the branch is **dead in practice** (untested, untargeted, six years past) but not **provably**
dead by build target.

**VERDICT J3:** *authored 2026-07-31* — **FALSE** (2026-07-11 / 2026-07-13). *Below-floor* —
**PLAUSIBLE, not proven**: no declared floor exists to be below; the honest cure is R1's own
("state the support floor once, then drop the sub-floor guards"), and the first half of that
sentence is the missing artifact.

---

## Part 4 — doc headliners

Legend: **TRUE-STALE** = the drift claim re-derives · **FALSE** = the claim does not hold as stated.

| # | Headliner | Verdict | Evidence (re-derived this pass) |
|---|---|---|---|
| 1 | root `README.md:96-97` e2e "82 tests across 13 spec files (77 default; 4 golden + 1 throttle)" | **TRUE-STALE** | `npx playwright test --list` → **206 tests in 15 files**; `--project=chromium` → **115 in 15**; `--project=webkit` → **91 in 12**; `-c playwright-golden.config.ts` → **4 in 1**; `-c playwright-throttle.config.ts` → **23 in 4**; `find e2e -name '*.spec.ts' \| wc -l` → **20**. The "1 throttle" is off by 22. (No tests executed.) |
| 2 | `README.md:117` "CI runs Playwright on Chromium alone; Safari is known-broken pending a WebKit performance fix" | **TRUE-STALE** | `.github/workflows/ci.yml:604` `npx playwright install --with-deps chromium webkit`; `:600-601` documents *why* webkit ("P1 G3.4 wordmark integrity asserts in WebKit by construction"); `web/frontend/playwright.config.ts:52-58` declares a `webkit` project (testIgnore = other configs + `mobile-*` + `share-truth`), carrying 91 tests in 12 files per row 1. Both halves false. |
| 3 | `docs/benchmarks.md:21` node spine "40,513 → 4,678 (8.66× fewer)" self-refuted | **TRUE-STALE** | `cargo run --release --example gac_ab_corpus` → `false-UNSAT (GAC off): 0/50 · (GAC on): 0/50` · `node-count spine (GAC off→on): 4153388 → 8222 (expected 4153388 → 8222) — HOLD` · `VERDICT: 0/50 false-UNSAT + spine HOLD — PASS`. `ci.yml:140,146-148` already names the doc's figure stale: *"re-minted at T4-W6's 16×16 Hard bank re-cut; the T3 spine 40,513→4,678 rode the stale bank."* Self-refuting canon confirmed. (This also makes `docs/benchmarks.md:104-109`'s verbatim block stale — the binary now emits the spine line and the longer VERDICT.) |
| 4 | lean-wasm 121,855 B in **SIX** sites vs on-disk 122,385 | **number TRUE-STALE · count FALSE (four, not six)** | `wc -c` → **122,385 B** for *both* `csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm` and `web/frontend/dist/assets/csp_solver_wasm_bg-B_bsll75.wasm`; sha256 identical `cdabecfb240b63ea984f152956d12d2c98e0df8f92d46f6cc788b4de5297f9b2` (both mtime 2026-08-01 03:52). Literal `121,855` in the consumer corpus + workflow = **4 sites**: `docs/benchmarks.md:49`, `csp-solver/wasm/README.md:57`, `csp-solver/wasm/pkg/README.md:57`, `.github/workflows/ci.yml:455`. R1 said "four places" but listed five refs; the fifth (`ci.yml:464`) echoes **124,091**, not 121,855, so it is a runner claim (UNVERIFIABLE here), not a fifth instance. Note R1's line numbers `:58` for both wasm READMEs are off by one (truth `:57`). **Cause is not source drift:** `git log 826f16e3..HEAD -- csp-solver/src csp-solver/wasm/src csp-solver/Cargo.toml csp-solver/wasm/Cargo.toml Cargo.lock` → `cb3c7f5f` (Cargo.toml version line only), `c49a73ca` (wasm Cargo.toml version line only), `981353c0` (Cargo.lock, 2 lines). Zero `.rs` changes. The +530 B is toolchain/metadata (local rustc 1.97.0, wasm-pack 0.15.0), so the doc figure is an **unpinned dated stamp**, not a wrong measurement. The band holds: 122,385 < 127,500 (`ci.yml:444,465`). |
| 5 | `docs/sudoku.md:39` symmetry total "~1.22 x 10^9" | **TRUE** (never-true, not drift) | The doc's own table (`:32-37`): 9! = 362,880 · 216 · 216 · 6 · 6 · 2 = **1,218,998,108,160 ≈ 1.22 × 10¹²**. Mantissa right, exponent short by 10³. Nothing in the tree moved — this was wrong when written. |
| 6a | ghost API — `tests/solution_set_invariance.rs` (`docs/algorithms.md:59`, `docs/benchmarks.md:36`) | **TRUE-STALE** (path only) | `ls csp-solver/tests/` → 22 files, no such name. The harness lives at `csp-solver/tests/oracle_and_invariance.rs`; its module doc `:1-5` names the fold explicitly (*"the single home for the two … `gac_alldiff_oracle`, `futoshiki_engine_probe`, `solution_set_invariance`"*) and `:22-23` states the invariant. **The test exists; the cited path does not.** |
| 6b | ghost API — `propagate_stratified` / "Stratified sweep" (`docs/algorithms.md:73`) | **TRUE-STALE** | `grep -r 'stratified\|Stratified' csp-solver/src csp-solver/wasm/src \| wc -l` → **0**. `csp-solver/src/config.rs:32-39` `PropagationStrategy` = `Auto \| Ac3 \| Sweep`. The doc presents it as a shipped third strategy with a named fn. |
| 6c | ghost API — `Ordering::Chs` (`docs/algorithms.md:83`) | **TRUE-STALE** | `grep -r '\bChs\b' csp-solver/src \| wc -l` → **0**. `csp-solver/src/ordering.rs:9-20` = `Chronological \| FailFirst \| Mrv`; `src/py/enums.rs:36-39` = `CHRONOLOGICAL \| FAIL_FIRST \| MRV`. The doc says *"the name replaces the former `DomWdeg`"* — asserting `Chs` is a current name. Deleted at 0.3.0 (`csp-solver/CHANGELOG.md:136-138`). |
| 7 | `csp-solver/README.md:35` Install `csp-solver = "0.5"` | **TRUE-STALE** | `csp-solver/Cargo.toml:3` `version = "0.6.0"`. Same file `:23-24`: *"The crate publishes to crates.io, latest `0.6.0` (the first published version carrying the five-family surface)."* A consumer copying `"0.5"` gets a `^0.5` range resolving **below** the five-family surface the README sells eleven lines up. Self-contradiction confirmed. |
| 8 | `README.md:127` `@mkbabb/pencil-boil` `^0.9.2` | **TRUE-STALE** | `web/frontend/package.json:36` `"@mkbabb/pencil-boil": "^0.10.1"`; installed tree reports **0.10.1**. Cited three ways, none current: `README.md:127` `^0.9.2` · `docs/animation.md:5-6` `^0.9.2` · `web/frontend/README.md:11` `^0.7.0`. |

### Bonus row re-derived (R1 §S7, checked because it sits in the same README paragraph)

`README.md:62` "three self-hosted woff2 subsets … **17,708 B** total" — `wc -c` → 3,624 +
**13,788** + 4,312 = **21,724 B**. **TRUE-STALE**, 4,016 B low. The stale figure is arithmetically
consistent with the pre-`387cceea` Fraunces subset (9,772 B), which is how it survived review.

---

## Standing corrections to R1

| R1 claim | Status | Correction |
|---|---|---|
| dead-code-census S1 — template bank is a "silent two-path generator", HIGH, "the only mask that can change what the user is shown" | **OVERSTATED** | DESIGNED-DOCUMENTED at `README.md:58` + `docs/sudoku.md:53` + `vite.config.ts:29-35` + `T2-W4-data-reshape.md:24-33`. No calibration, determinism, or correctness delta (§1.3). Real residual = a *lost* `3/hard`/`4/hard` dir degrading to a slower deal. |
| dead-code-census S2 — "a binary question with no third answer", unanswered | **ANSWERED** | `stop()` cannot throw (`pencil-boil/src/vue.ts:672-676`, `:265-270`; only throws are `raster.ts:131,155,173`). All 11 arms unreachable; 5 in-tree sites already call it naked. Duplication row, not a masking row. |
| dead-code-census S2 site roster | **INCOMPLETE** | Ten entries for a count of 11; `HandwrittenGlyph.vue:178` omitted; `:276,293` are `catch` lines (`try` at `:274,291`). |
| dead-code-census S8 — shims "written this cycle" (`0642e098`, 2026-07-31) | **FALSE** | `7c967416` 2026-07-11 / `b8acf3f7` 2026-07-13; `0642e098` hoisted verbatim. |
| dead-code-census S8 — "this repo's own measurement floor is Safari 26.4 / iOS 19" | **CATEGORY ERROR** | Those four sites name perf-rig devices. No browserslist, no declared support floor. Only compiled floor is `es2020` (`vite.config.ts:257`), which does not fully retire the guard (Safari 13.1 parses `?.` but lacks MQL `addEventListener`). |
| doc-canon-drift S6 — lean-wasm stale in "four places" | **COUNT OK, REFS OFF** | Four is right; `ci.yml:464` is not one of them (it carries 124,091). Both wasm-README refs are `:57`, not `:58`. Cause is toolchain, not source: zero `.rs` changes `826f16e3..HEAD`. |
| brief's premise — 121,855 in **SIX** sites | **FALSE** | Four in the consumer corpus + workflow. (40 further occurrences exist across `docs/tranches/2026-07-tranche-4/**` — dated campaign records, not canon; those are correct *as of their stamp*.) |

## UNKNOWN / not established this pass

- The `>1 s` 16×16-hard native generate wall (`T2-W4:30`) — cited from the banked record, **not
  re-derived**. It is the sole load-bearing justification for keeping `4/hard`.
- Whether `122,385 B` reproduces on the CI runner (the `124,091 B` runner figure at `ci.yml:455,464`
  is not measurable from this host). Runner-side rows stay UNVERIFIABLE.
- `pkg/` is gitignored build output; `122,385 B` is a **local** 2026-08-01 03:52 build under
  rustc 1.97.0 / wasm-pack 0.15.0. HEAD-faithful as to source (§Part 4 row 4), not as to toolchain pin.

ROW-COMPLETE

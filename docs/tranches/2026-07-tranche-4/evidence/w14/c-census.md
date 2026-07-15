# T4-W14—Lane C census (the superseding contract)

Re-verified at live HEAD `826f16e3` (`826f16e381407b9aa491304fa264dcb5f10ed3d6`, master,
2026-07-15). The wave spec's census was stamped at `65425697`, nine waves back; every
integer and line-anchor below **supersedes** the spec where the two disagree. The product
is five games, a carousel game-select, an undo spine, assists/marks, and a technique engine.
The working tree is clean but for the one staged deletion `D CONTRIBUTING.md` (absent on disk).

This file is the D-lanes' work order. Anchors are `file:line` at this HEAD.

---

## 1. Versions + registries—source vs registry, per artifact

Registries confirmed by live query, never assumed (team-lead ruling #2):

| Artifact | Source (at HEAD) | Registry (confirmed) | Split? |
|---|---|---|---|
| `csp-solver` (crate) | `0.5.0` (`csp-solver/Cargo.toml`) | crates.io **`0.5.0` published** (API: versions `[0.5.0, 0.4.0, 0.3.0, 0.2.0, 0.1.0]`) | **aligned**—0.5.0 IS on crates.io |
| `@mkbabb/csp-solver-wasm` (npm) | `0.5.0` (`csp-solver/wasm/Cargo.toml`, `csp-solver/wasm/pkg/package.json`) | npm **`0.2.0`** (`npm view` → `['0.1.0','0.1.1','0.2.0']`) | **SPLIT**—source 0.5.0, npm 0.2.0; 0.4.0/0.5.0 never published to npm |
| `@mkbabb/pencil-boil` (npm, frontend dep) | pin `^0.9.2` (`web/frontend/package.json`); pkg `0.9.2` (`/Users/mkbabb/Programming/pencil-boil/package.json`) | npm **`0.9.2` published** (top of `['…,0.9.0,0.9.1,0.9.2']`) | **aligned** |

- The frontend **file-links** the lean wasm build: `"@mkbabb/csp-solver-wasm": "file:../../csp-solver/wasm/pkg"` (`web/frontend/package.json`). It never consumes the npm tarball, so the npm-0.2.0 lag is inert at runtime but must be stated honestly.
- crates.io query: `curl -s https://crates.io/api/v1/crates/csp-solver` → `max_version 0.5.0`. So **csp-solver 0.5.0 IS published**—the CHANGELOG's "_Staged, unpublished_" note (below) is now false.
- Honest doc line for the wasm package: **"source 0.5.0; npm 0.2.0; the SPA file-links the lean build, not the registry package."** Do NOT write "0.5.0 on npm" or "0.4.0 on npm."

**Version lies to restamp (root `README.md:113-115`):**
- `:113` `csp-solver | crates.io | 0.3.0—published` → **`0.5.0`—published**.
- `:114` `@mkbabb/csp-solver-wasm | npm | 0.2.0—…` → npm 0.2.0 is CORRECT; add the source/registry split (source 0.5.0).
- `:115` `@mkbabb/pencil-boil | npm (frontend dep) | ^0.7.0` → **`^0.9.2`**.
- `csp-solver/README.md:24` "both at `0.3.0`—published" → `0.5.0`; `:32` `csp-solver = "0.3"` → `"0.5"`.
- `csp-solver/wasm/README.md:4` "`0.4.0` on npm." → the source/registry split line.
- `docs/animation.md:6` pencil-boil `^0.7.0` → **`^0.9.2`** (P1 version-truth probe hit).

`grep -n '0\.7\.0' docs/animation.md README.md` → two hits today: `README.md:115`, `docs/animation.md:6`.

---

## 2. Counts at HEAD

| Count | Live value | Doc claim today | Anchor |
|---|---|---|---|
| e2e `test(` cases | **82** across **13** spec files | "43 … in 8 files" (stale); spec's "44" also stale | `README.md:91` |
| e2e config split | **77 default** + **4 golden** + **1 throttle** = 82 |—| default config `testIgnore`s `visual-golden` (4) + `throttled-void` (1): `web/frontend/playwright.config.ts:11` |
| frontend unit (`test(`/`it(`) | **307** across **29** vitest files | not cited in README | `web/frontend/vitest.config.ts` |
| Rust tests (static `#[test]`) | **205** core + **14** wasm `wasm_bindgen_test` | "171 passed, 0 failed, 6 ignored (21 binaries)"—b4d7aedf-era | `README.md:85`, `csp-solver/README.md:196` |
| tests-py | **16** `def test_` (parametrized → **27** pytest cases) | "27 passed, 0 skipped" | `README.md:88`, `csp-solver/README.md:210` |
| CI lanes | **11 jobs** | "nine jobs" (stale—omits `build-lean-wasm`, `cargo-audit`) | `README.md:103`, `.github/workflows/ci.yml` |
| lean wasm | **121,855 B** (darwin) | "86,746 B", "≤93 KB" (both stale two-game figures) | `README.md:103`, `docs/benchmarks.md:51`, `csp-solver/wasm/README.md:46` |

- **REQUIRES-RUN before restamp:** the Rust pass/ignored/binary triple and the tests-py case count need `cargo test --workspace` and `uv run pytest` respectively; the static greps above are proxies. The +34 Rust delta (171→~205) is consistent with the three new native puzzle families (kenken/killer/thermo) plus the W6 futoshiki-difficulty and generation-truth tests. Restamp with the RUN figure, stamped `measured at 826f16e3, <host>, 2026-07-15`.
- **CI jobs (11), exact keys** (`ci.yml`): `lint` (`:81`), `rust` (`:107`, carries build+test AND the queens/gac/corpus smokes), `py-compile` (`:181`), `py-runtime` (`:223`), `wasm` (`:298`), `build-lean-wasm` (`:339`), `twiggy` (`:377`), `frontend` (`:478`), `e2e` (`:543`), `iai` (`:656`), `cargo-audit` (`:723`). The README perimeter must say **eleven**, not nine.

---

## 3. The lean-band reconciliation (three competing figures—document all)

The shipped/served artifact is the **lean five-game** wasm. `pkg/` == `dist/` byte-identical.

- **121,855 B**—darwin-measured lean five-game (`wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm`; `web/frontend/dist/assets/csp_solver_wasm_bg-BECxa0-b.wasm` identical). **This is the authoritative shipped figure.**
- **124,091 B**—runner-measured lean (toolchain divergence; `ci.yml:455,464`).
- **124,500 B**—the W13 *analytic re-derivation* (base + per-game-wire linear model; `docs/tranches/2026-07-tranche-4/evidence/w13/j1-mount.md:98`). This is the figure the team-lead ruling cites as "the re-derived ceiling."
- **127,500 B**—the **CI-enforced** fail budget (`ci.yml:444,456,465`), ~2.6% headroom over the runner-measured artifact.
- **93 KB / 92,897 B / 90,602 B / 86,746 B**—all the OLD **two-game** ceiling/measurements, stale everywhere they still appear.

**Doc guidance (team-lead ruling #3):** wherever the wasm figures appear, write the lean shipped size as **121,855 B** (darwin; runner 124,091 B), inside the five-game band—and name the band correctly. The analytic re-derivation is **124,500 B**; the **CI gate** is **fail >127,500 B**. Do not conflate the two: "under the 124,500 B ceiling" is the analytic story; "the CI band, fail >127,500 B" is the gate. The old 93 KB was the two-game ceiling.

**Full-module figure—OPEN.** The recorded `222,436 B` (`README.md:103`, `benchmarks.md:51`) is a T2 two-game figure; `188,095 B` (tranche evidence only, not a shipped doc) is a two-game source-full build. Neither was re-measured after the three new families landed, and the full module compiles all five families + `assignment`, so it grew. The lane rewriting `benchmarks.md` must either **re-measure**—`wasm-pack build csp-solver/wasm --scope mkbabb --profile wasm-release && wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm`—or state the full module as "not re-measured this pass; CI enforces fail >240 KB / warn >230 KB." Do NOT reprint 222,436 B as current.

---

## 4. Product census (the shape the docs must describe)

**Five games**, all native Rust puzzle families AND frontend game packages:
- Rust: `csp-solver/src/puzzles/{sudoku,futoshiki,kenken,killer,thermo}/`. Thermo/killer/kenken are **full native families**, not frontend-only variants—the root README directory tree (`:16` `puzzles/ sudoku/, futoshiki/`) is two-game stale.
- Frontend: `web/frontend/src/games/{sudoku,futoshiki,thermo,killer,kenken}/` (+ `shared/`). README `:28`, `:48-55` ("The two games"), `:59` (`{sudoku,futoshiki}`) all two-game stale.
- **Registry / carousel:** `web/frontend/src/games/registry.ts` holds five entries (`sudoku` `:163`, `futoshiki` `:174`, `thermo` `:186`, `killer` `:195`, `kenken` `:204`), each `{id,name,range}`; registration-by-convention (`:214`). The carousel game-select + gallery: `web/frontend/src/games/shared/useGameGallery.ts` (tested `useGameGallery.test.ts`), e2e `gallery.spec.ts` + `gallery-guard.spec.ts`.
- **Undo spine, cap 200:** `web/frontend/src/games/shared/useUndoHistory.ts:45` `const UNDO_CAP = 200` (delta-dominated, flat 100–200; `:42`). Shared across all games via `useGameState.ts`.
- **Assists / marks:** `useAssists.ts`, `useUserMarks.ts` (both tested). The README `:59` affordance list ("undo, hint, pencil marks, hold-to-peek, board+seed permalinks") needs: carousel game-select, assists, the technique-engine hint, and the permalink split.
- **Technique engine + hint grammar:** `web/frontend/src/games/shared/techniqueEngine.ts` + `techniqueVoice.ts` (the hint grammar), with per-game deductive modules **sudoku + futoshiki only**: `sudoku/technique/sudokuTechnique.ts`, `futoshiki/technique/futoshikiTechnique.ts`. Thermo/killer/kenken wire a hint through the shared path but ship no named-technique module. State the technique engine as sudoku+futoshiki; the other three get the solver-derived hint.
- **Difficulty axes:** `EASY/MEDIUM/HARD` (`README.md:126`, guarded by `csp-solver/tests/difficulty_parity.rs`); futoshiki gained its `Difficulty` axis at 0.5.0 (`csp-solver/CHANGELOG.md:23-32`). Each registry entry carries a `range` (size levels).
- **Permalink split (team-lead ruling #3—CONFIRMED in source):**
  - `?board=` permalink: **sudoku** (`sudoku/composables/useUrlState.ts:40,78`—reads `window.location.search`, share-on-demand codec) and **futoshiki** (`futoshiki/composables/useUrlState.ts:31,54`; owns `?board_size=`, shares `?difficulty=`).
  - **localStorage-only v1** (no `?board=`): thermo (`thermo/composables/thermoUrlState.ts:7,81`), killer (`killerUrlState.ts:8,82`), kenken (`kenkenUrlState.ts:8,82`)—each self-documents "the `?board=` share permalink is NOT [supported]" and "the selectors are not URL-synced … they persist to localStorage instead."
- **Declarations landed in-tree by W0** (`docs/precepts/declared-decisions.md`)—the README must write these:
  - **Browser matrix** (`:5-12`): *Supported: Chromium + Firefox.* CI runs Playwright chromium-only (`ci.yml` installs chromium alone; `playwright.config.ts` has no `projects` array); Firefox passes by audit. **Safari is known-broken** pending a WebKit perf fix. (Richer than the spec's stale "chromium-only"—it's Chromium+Firefox supported, Safari known-broken.)
  - **en-only** (`:14-17`): English only, no i18n machinery (`grep -rin i18n src` → 0), `<html lang="en">`.
  - **no-telemetry** (`:21-28`): nothing measured, nothing phoned home; sole third-party hit is the attribution avatar (`avatars.githubusercontent.com`, off first paint, `referrerpolicy="no-referrer"`). Also stated inline at `web/frontend/src/pencil/chrome/AttributionCard/AttributionCard.vue:43` ("no-telemetry-by-design").

---

## 5. Defect census (per gate, born-RED baseline at HEAD)

**Meta-leak (P2 gate—must reach literal ZERO across the gated set).** Total **31 lines** across 12 files: `README.md` 4 (`:82,88,103,119`), `docs/algorithms.md` 1 (`:47`), `docs/animation.md` 3 (`:33,46,70`), `docs/benchmarks.md` 8 (`:5,10,14,37,44,45,51,96`), `docs/sudoku.md` 1 (`:92`), `csp-solver/README.md` 1 (`:210`), `csp-solver/CHANGELOG.md` 9 (`:8,17,33,55,72,101,136,138,139`), `csp-solver/wasm/README.md` 1 (`:46`), `csp-solver/wasm/CHANGELOG.md` 2 (`:3,19`), `csp-solver/csp_solver.pyi` 1 (`:3`). pencil-boil `CHANGELOG.md` **12** (heading parentheticals at `:3,24,44,101,126,157,171` + body); pencil-boil `README.md` **0** (clean). The spec's line anchors are all shifted—use these.

**Em-dash budgets (born-RED counts at HEAD):**
| Doc | Count | Target |
|---|---|---|
| `README.md` | **30** | ≤ 12 |
| `csp-solver/README.md` | **51** | ≤ 20 |
| `docs/animation.md` | **15** | ≤ 8 |
| `docs/benchmarks.md` | 10 | thin (correctio cuts + campaign-framing scrub) |
| `csp-solver/wasm/README.md` | 10 | thin |
| `csp-solver/CHANGELOG.md` | 34 | pure-technical; keep semver, scrub codes |
| `csp-solver/wasm/CHANGELOG.md` | 9 | pure-technical |
| `pencil-boil/CHANGELOG.md` | **52** (spec said 33—grew) | ≤ 2/paragraph in the long entries |
| `pencil-boil/README.md` | **6** (spec said 1—grew) | thin; the `:44`-era lilt stays if still present |
| `docs/sudoku.md` | 1 |—|
| `docs/{algorithms,bbnf-integration,optimizations}.md` | 0 |—|

**Correctio (P3):** one shipped hit—`docs/benchmarks.md:34` "verified sound, not merely fast" (a prior lane asserted Y but left the scaffold—drop "not merely fast"). Also `README.md:119` "not an inherited scratch harness" (spec: cut, keep the first-party fact) and `benchmarks.md:24` "(deeper than the retired figure implied)" (spec: cut). `README.md:107` "retired structurally, not mitigated"—the correctio the spec wants tightened.

**Copula (P3):** one hit—`docs/bbnf-integration.md:16` "The solver **acts as** a dataflow fixpoint engine" → "**is** a dataflow fixpoint engine."

**Superlatives:** `bbnf-integration.md:54` "the critical optimization" → name the path; `:65` "the single biggest codegen win" → name the mechanism.

**Version-row lies:** §1 above.

**Nintendo / Yoshi mark (gate: `grep -rniE 'yoshi|nintendo' README.md docs/ web/frontend/src`):**
- **Shipped doc:** `docs/animation.md:111` "**YOSHI_COLORS**: canonical palette"—cites the code identifier.
- **Source comments (comment-scrub eligible):** `pencilConfig.ts:15` ("Yoshi's Story color palette"), `CelebrationHeart.vue:49` ("the entire Yoshi bounce"), `CrayonHeart.vue:5` ("Yoshi's Story in OUR pencil grammar"), `DarkModeToggle.vue:56` ("Golden spiral—Yoshi's Story style"), `:599,:767` ("the two Yoshi beats", "The Yoshi beats").
- **The identifier `YOSHI_COLORS` is an exported const** (`pencilConfig.ts:17`) imported in `CrayonHeart.vue:28`, `CelebrationStar.vue:21`, `DarkModeToggle.vue:343`, referenced in `heartPaths.ts:25`, `CelebrationStar.vue:24`, `CrayonHeart.vue:63`, `DarkModeToggle.vue:356-357`. **⚠ FLAG (see §7):** renaming it is a cross-file source-symbol change, outside this wave's "docs/comments/config-scrubs only" scope. The gate grep, as written, cannot reach literal zero without that rename. Recommendation: scrub every branded **comment** + the shipped-doc phrasing to unbranded craft language ("plush felt silhouette, stitch-dash inner stroke, reciprocal-axis squash"); ledger the `YOSHI_COLORS` symbol rename as a deferred source change for team-lead adjudication. (All other `yoshi/nintendo` hits are in `docs/tranches/**` audit artifacts, not shipped product.)

**OFL fonts (gate):** three bundled woff2 subsets, **all SIL OFL**—`web/frontend/src/assets/fonts/{patrickhand-subset.woff2 (4,312 B), fraunces-subset.woff2 (9,772 B), firacode-subset.woff2 (3,624 B)}` = **17,708 B** total (matches `README.md:59`). **No OFL text ships anywhere** (no `*OFL*`/`*LICENSE*` near the fonts; only MIT `LICENSE` at `./`, `csp-solver/`, `csp-solver/wasm/`). W14 must place the SIL OFL 1.1 text for each family beside the font assets.

**`_headers` narration (W3 purge):** tranche narration in a live config—**both** `web/frontend/public/_headers` (source) and `web/frontend/dist/_headers` (build artifact), lines `:13,18,24,30,39,62,86,103` (T4-W8, T4-W3, T3-W2, Tranche II/W5/W6). Scrub `public/_headers`; `dist/` regenerates.

**`pkg/` gitignored (not committed):** `.gitignore:73` `csp-solver/wasm/pkg/`—`git ls-files csp-solver/wasm/pkg/` is empty. The wasm README's "The committed `pkg/`" (`csp-solver/wasm/README.md:44`) and "`pkg/` … committed alongside source" (`:85`) are **false**; correct to "gitignored build output, file-linked by the frontend." (The `0.1.0` CHANGELOG entry `wasm/CHANGELOG.md:60-61` "Committed the first `pkg/`" is historical record—it really did once—leave it as history.)

**csp-solver/README nonexistent examples:** `csp-solver/README.md` examples list names `alloc_count`, `parity_probe`, `probe_futoshiki_gen`—**none exist**. Actual `csp-solver/examples/`: `gac_ab_corpus, gac_timing_probe, generate_templates, profile_csp, profile_sudoku, time_sudoku, verify_bank_uniqueness, zzz_gen_truth_probe`. (The spec called these "nonexistent py files"; they're nonexistent **examples**—`probe_futoshiki_gen` is the "never-shipped futoshiki" one.) Correct the list.

**CHANGELOG reconciliation (richer than the spec knew):**
- `csp-solver/CHANGELOG.md` now HAS a `## 0.5.0` entry (`:17`) but line `:19` says "_Staged, unpublished—the team lead owns the … publish._"—**now false**: crates.io has 0.5.0. Correct the note.
- **Malformed 0.5.0 entry:** the `## 0.5.0` block carries **two** `### npm` subsections—`:48-56` (npm 0.4.0→0.5.0) AND `:58-70` (npm 0.2.0→0.4.0). The 0.2.0→0.4.0 npm history is dumped under the 0.5.0 heading. Split it out.
- **The unreconciled 0.4.0 core claim persists:** `csp-solver/CHANGELOG.md:70` and `csp-solver/wasm/CHANGELOG.md:16-17` both say the wasm "aligns … to the core crate's `0.4.0` surface," yet this changelog has **no `## 0.4.0` core row** (headings jump 0.5.0→0.3.0)—while crates.io actually published 0.4.0. Add the missing 0.4.0 core release row, or correct the claim (spec's CHANGELOG-0.4.0 gate, still RED).
- **wasm CHANGELOG is a version behind its own source:** `csp-solver/wasm/CHANGELOG.md` tops at `## 0.4.0` (`:3`) while `csp-solver/wasm/Cargo.toml`/`pkg` are 0.5.0. The 0.5.0 wasm changes live in the CORE changelog (`:48-56`) instead. Add a 0.5.0 wasm entry or reconcile the changelog home. And npm never shipped 0.4.0/0.5.0 (registry 0.2.0)—the 0.4.0 entry documents a source-only version; say so.
- `wasm/CHANGELOG.md:41` "≤93 KB twiggy budget" is the stale two-game band.

**pencil-boil Stage 3—ALREADY RESOLVED (spec item is nine-wave stale):** `/Users/mkbabb/Programming/pencil-boil/README.md:76-94` already describes the beat-parked model (setTimeout aimed at the beat boundary → one rAF → sleep, `:82-83`; sequence-supersede-and-fall-back, `:90-94`), matching the module-map row (`:32`) and the CHANGELOG. **Do NOT "fold the 0.8.0 park model in"—it's folded.** pencil-boil is at 0.9.2; the only pencil-boil work left is the CHANGELOG campaign-code scrub (`:3,24,44,101,126,157,171`) and em-dash thinning in the long 0.8.0/0.9.x entries.

---

## 6. Per-doc contract DELTAS (what still holds, what nine waves changed)

**`README.md` (root)**—biggest rewrite. The spec's KEEP/TIGHTEN/RESTAMP/SCRUB structure holds, but the SUBSTANCE is now five-game:
- `:3` opening—rewrite "two hand-drawn games … Sudoku and Futoshiki" → **five games** (sudoku, futoshiki, thermo, killer, kenken).
- `:16` directory tree `puzzles/ sudoku/, futoshiki/` → **five families**.
- `:28` `src/games/ sudoku/, futoshiki/` → five game dirs.
- `:30` docs list omits `animation.md`—add it.
- `:44` TIGHTEN the 8-clause run-on (spec, still valid).
- `:48-55` "The two games" table → **"The five games"** (five rows); add the carousel game-select prose.
- `:59` frontend—five game dirs; affordance list gains carousel game-select, assists, technique-engine hint, undo cap 200; permalink noted as sudoku/futoshiki only. Font line accurate (17,708 B); add OFL note.
- `:82` SCRUB "tranche-III gate SHA … (T3-W12, the tranche close)" → plain `measured at 826f16e3, <host>, 2026-07-15`.
- `:85` restamp Rust triple (RUN required); `:88` scrub "deleted at W4", keep "27 passed, 0 skipped" (confirm via RUN); `:91` "43 … 8 files" → **82 (or 77 default) across 13 files**.
- `:103` CI—**eleven** jobs (add `build-lean-wasm`, `cargo-audit`); relocate byte-budget archaeology to `benchmarks.md`; restamp lean 121,855 B, band fail >127,500 B, full-module OPEN.
- `:107` tighten the "not mitigated" correctio.
- `:113-115` restamp all three version rows (§1).
- `:119` cut "not an inherited scratch harness" correctio, keep the 12.6–12.7× headline + disclosed minority cost.
- `:137-139` CONTRIBUTING—**INLINE the two-line flow** (team-lead ruling #1: "Branch off master, add the change plus tests, open the PR; CI runs the same gates."), route recipes to `csp-solver/README.md`, and let the `D CONTRIBUTING.md` deletion stand. Do NOT restore the file; do NOT commit.
- **NEW section obligation:** a declarations block (browser matrix / en-only / no-telemetry) sourced from `docs/precepts/declared-decisions.md`.
- Em-dash 30 → ≤ 12.

**`docs/algorithms.md`**—KEEP structurally (strongest doc, 0 em-dashes). SCRUB `:47` "pre-tranche docs" (the spec's `:14` anchor no longer hits; only `:47`). Thin `--` to sentences.

**`docs/animation.md`**—SCRUB `:33` (T3-W12 §6), `:46` (inlined `docs/tranches/…/W8-…` path + a second path), `:70` (tranche-evidence stamp). RESTAMP `:6` pin `^0.7.0`→`^0.9.2`. Correctio cuts `:52`/`:127` (verify still present). `:111` "YOSHI_COLORS" → unbranded (see §5/§7). Keep the pencilConfig reference. Em-dash 15 → ≤ 8. On-idiom lilt at `:19` stays.

**`docs/benchmarks.md`**—correctio cuts `:24`/`:34`; SCRUB campaign framing `:5,10,14,37,44,45,51,96` (keep evidence pointers as plain relative paths, keep every number + repro command). Destination for the README's relocated CI byte-budget prose. Restamp lean 121,855 B; full-module OPEN (§3).

**`docs/bbnf-integration.md`**—copula fix `:16`; superlative fixes `:54`/`:65`. KEEP the six-pass walkthrough. 0 em-dashes.

**`docs/optimizations.md`**—KEEP whole. `:60` "cryptographically robust" is the precise sense, lone instance—leave or swap to "strong."

**`docs/sudoku.md`**—SCRUB `:92` "which the tranche landed" → "which the kernel's AC-3 trail-push fix enables." KEEP the rest. **NOTE:** this doc is now the sole game-specific doc for a five-game estate; consider whether the D-lane extends it or the README carries the other four. (Scope call for the team lead; the census flags it, doesn't decide it.)

**`csp-solver/README.md`**—51 em-dashes / 250 lines → ≤ 20 (prose de-dash; the API-list separators may stay). RESTAMP `:24`/`:32` (0.3.0→0.5.0). SCRUB `:210` "deleted at W4". Correct the nonexistent examples list (§5). Restamp the `:196` Rust triple stamp (RUN). KEEP the API reference + GAC posture + difficulty-casing + file-tree (`:118-146`, accurate).

**`csp-solver/wasm/README.md`**—RESTAMP `:4` "0.4.0 on npm" → source/registry split. SCRUB `:46` (inlined wave path + "≤93 KB" → 127,500 B five-game band, twiggy lane). Correct the "committed `pkg/`" claims `:44,:85` → gitignored. KEEP surface/build/consume. 10 em-dashes → thin.

**`csp-solver/CHANGELOG.md` + `csp-solver/wasm/CHANGELOG.md`**—pure-technical. SCRUB the heading campaign codes (core `:8,17,33,55,72,101,136,138,139`; wasm `:3,19`), keep version+date+semver rationale. Fix the "_Staged, unpublished_" note (`:19`, now false). Split the double-`### npm` 0.5.0 block. Reconcile the missing 0.4.0 core row + the wasm's missing 0.5.0 entry (§5). `wasm:41` "≤93 KB" → 127,500 B.

**`csp-solver/csp_solver.pyi`**—SCRUB `:3` "post-prune (tranche-III) surface" → "current pruned surface." KEEP the stubtest-contract docstring.

**`/Users/mkbabb/Programming/pencil-boil/README.md`**—Stage 3 ALREADY correct (§5)—no fold needed. 6 em-dashes → thin the prose that grew. KEEP the CONTRIBUTING link (`:175`, resolves in that repo). Edit in place, do NOT commit/push.

**`/Users/mkbabb/Programming/pencil-boil/CHANGELOG.md`**—pure-technical, 52 em-dashes. SCRUB the heading campaign codes (`:3,24,44,101,126,157,171`); keep dates + the park engineering narrative. Reduce em-dash density to ≤ 2/paragraph in the long 0.8.0/0.9.x entries. Do NOT commit/push.

---

## 7. Flags for the team lead (forks the census surfaces, does not decide)

1. **`YOSHI_COLORS` symbol rename is out of wave scope.** The Nintendo gate `grep -rniE 'yoshi|nintendo' … web/frontend/src` cannot reach literal zero while the exported const `YOSHI_COLORS` (imported across 4 files) keeps its name—and renaming it is a source-symbol change this docs/comments wave forbids. Options: (a) expand scope to allow the rename (e.g. `PALETTE`/`HEART_COLORS`), (b) scope the gate to comments+docs (identifier exempt as a code symbol), or (c) scrub the branded comments now and ledger the rename as deferred. The census recommends (c): comment + doc scrub this wave, symbol rename deferred.
2. **Rust + tests-py counts REQUIRE a RUN** to restamp honestly (static greps: 205 core `#[test]` + 14 wasm; 16 `def test_` → 27 parametrized). Don't stamp a number you didn't run.
3. **Full-module wasm figure is OPEN** (§3)—re-measure or state "not re-measured; CI fail >240 KB." The lean 121,855 B is authoritative.
4. **Lean-ceiling wording:** the ruling's 124,500 B is the analytic re-derivation; the CI gate is 127,500 B. Docs should carry the measured 121,855 B and name the correct band; the census recommends citing both the analytic ceiling and the CI band rather than collapsing them.
5. **`docs/sudoku.md` is the only game-specific doc for five games**—scope call on whether to extend it or let the README carry thermo/killer/kenken.
6. **CONTRIBUTING inline, deletion stands, no commit** (ruling #1)—the team lead commits the staged `D CONTRIBUTING.md` at seal.

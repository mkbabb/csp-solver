# T4-W14 — Lane D2 record (the csp-solver estate)

Executed against live HEAD `826f16e3`, on Apple M5 Max, 2026-07-15, under the
Lane C census (`c-census.md`) as the superseding contract. No commit. Estate
files (exclusive):

- `csp-solver/README.md`
- `csp-solver/CHANGELOG.md`
- `csp-solver/wasm/README.md`
- `csp-solver/wasm/CHANGELOG.md`
- `csp-solver/csp_solver.pyi`
- `web/frontend/public/_headers` (comment scrub only; policy line untouched)

---

## Registry corroboration (independent of the census)

The census queried the registries; I re-queried to confirm, never assumed:

- **crates.io `csp-solver`**: `curl https://crates.io/api/v1/crates/csp-solver` →
  `max_version 0.5.0`, versions `[0.5.0, 0.4.0, 0.3.0, 0.2.0, 0.1.0]`. Sparse
  index (`index.crates.io/cs/p-/csp-solver`) agrees. So **both 0.5.0 AND 0.4.0
  are published to crates.io** — the CHANGELOG's "_Staged, unpublished_" 0.5.0
  note was false, and the "aligns to the core crate's 0.4.0 surface" claim points
  at a real published version.
- **npm `@mkbabb/csp-solver-wasm`**: `registry.npmjs.org` → latest `0.2.0`,
  versions `['0.1.0','0.1.1','0.2.0']`. Source is `0.5.0`. **SPLIT confirmed:**
  npm never received 0.4.0/0.5.0; the SPA file-links the lean build
  (`"@mkbabb/csp-solver-wasm": "file:../../csp-solver/wasm/pkg"`), so the lag is
  inert at runtime.

Honest doc line used everywhere: source `0.5.0`; the crate publishes to crates.io
at 0.5.0; the wasm npm tarball stays at `0.2.0`; the frontend file-links the lean
build, not the registry package.

## Facts measured this pass (not assumed)

- `cargo test --workspace` → **208 passed, 0 failed, 0 ignored across 28 test
  binaries** (aggregated from every `test result:` line). The old README stamp
  ("171 passed / 6 ignored / 21 binaries, b4d7aedf") was nine waves stale, and the
  6 ignored are now 0. Restamped `measured at 826f16e3, Apple M5 Max, 2026-07-15`.
- Lean wasm `wc -c pkg/csp_solver_wasm_bg.wasm` → **121,855 B**.
- Embedded sudoku bank: **32,095 B** across N=3/hard (20) + N=4/{easy(10),
  medium(10),hard(5)}. The README's "32,533 B / N=4 sparse" was stale; restamped
  to "N=3 hard + N=4 easy/medium/hard, 32,095 B".
- Five native families under `puzzles/` (`sudoku, futoshiki, thermo, killer,
  kenken`), each with an `impl PuzzleClass for *Class` (verified all five).
- Two cage primitives: `CageSum` / `CageProduct` (`constraint/cage.rs`), reached
  on `Csp` via `add_cage_sum` / `add_cage_product` (`csp.rs:146,153`).
- wasm wire surface: `solve*/generate*/propagate*` for all five families
  (`pkg/csp_solver_wasm.d.ts`), plus `solveAssignmentCop`/`assignmentSentinel`
  behind the `assignment` feature. Lean build = `--no-default-features` = the five
  families always compiled; only `assignment` is feature-gated.

---

## Moves by file

### `csp-solver/README.md`
- **Em-dash 51 → 11** (target ≤20). All prose de-dashed by sentence rewrites; the
  11 remaining are the Public-API definition-list separators (`Solving` and
  `Configuration types` bullets), the exempted list idiom. Zero blanket `--`→`—`.
- **Registry-honest restamp**: intro version block (0.3.0-both → source 0.5.0 /
  crates.io 0.5.0 / npm 0.2.0 file-link split); install `csp-solver = "0.3"` →
  `"0.5"`; wasm-surface line ("Sudoku and Futoshiki") → the five puzzle surfaces.
- **New 0.5.x surface carried**: added a `### Puzzle families` block (five
  families, the `PuzzleClass` five-seam trait + `generate_by_digging` dealer, the
  two cage propagators + their `Csp` constructors). Added `add_cage_sum` /
  `add_cage_product` to the Construction row. Futoshiki `Difficulty` axis at
  `0.5.0` noted (the one version-anchored claim, which the 0.5.0 CHANGELOG carries).
- **Structure tree rewritten** to the real HEAD layout: 2018 file-plus-directory
  modules (`csp.rs`, no `mod.rs`), `solver/adjacency.rs` (relocated at 0.4.0),
  `solver/gac.rs` + `gac/scratch.rs`, `constraint/cage.rs`, `builder/kuhn_munkres.rs`,
  `puzzles/class.rs` + all five families, py surface sudoku-only (the nonexistent
  `futoshiki_api.rs` removed). Tree annotations de-dashed (dropped ~19 em-dashes).
- **Examples list corrected**: removed the nonexistent `alloc_count`,
  `parity_probe`, `probe_futoshiki_gen`; added the real `gac_timing_probe`,
  `zzz_gen_truth_probe`.
- **Meta-leak scrub**: `:210` "deleted at W4" removed (the file's only leak).
- **Test triple restamped** to 208/0/0 across 28 binaries at 826f16e3.

### `csp-solver/wasm/README.md`
- **Em-dash 10 → 0.**
- Intro `0.4.0 on npm` → source/registry split line.
- Surface section: three-layer/two-game → six layers, the five families named with
  their `solve*/generate*/propagate*` wire trios + the `assignment` feature layer.
- Build section: lean-band line now carries the measured **121,855 B**, the
  **124,500 B** re-derived analytic ceiling (base + per-game wire), the twiggy CI
  lane, and the distinct CI gate (**fail >127,500 B**); the inlined wave-path
  citation scrubbed.
- `pkg/`-committed claim corrected in two places (build prose + layout tree) to
  "gitignored build output, file-linked by the frontend" (`git ls-files
  csp-solver/wasm/pkg/` is empty; `.gitignore:73`).
- Layout tree gains `errors.rs` + the three new game modules.

### `csp-solver/CHANGELOG.md` (pure-technical band)
- Heading campaign codes scrubbed on every entry (`0.5.0/0.3.0/0.2.0/0.1.0`
  headings + the `Excised` header + the micro-row + the `muster tranche G` line).
- **"_Staged, unpublished_" 0.5.0 note corrected** — crates.io has 0.5.0.
- **Double `### npm` under 0.5.0 split**: the npm `0.2.0 → 0.4.0` block moved out
  from under the 0.5.0 heading.
- **Missing `## 0.4.0` core row added** (crates.io really published it),
  reconstructed from commit `044f2526`: the encapsulation pass (12 `pub`→
  `pub(crate)` demotions under `private_interfaces`, `adjacency.rs` relocation,
  `gac/scratch.rs` split, `ImplicationConstraint` tests, Timeout reserved). This
  reconciles the previously-dangling "aligns to the core crate's 0.4.0 surface"
  claim (the CHANGELOG-0.4.0 gate).
- **Registry honesty**: every npm subsection past 0.2.0 now reads
  `### npm (source-only, not published)` with an inline "npm stays at 0.2.0" note.

### `csp-solver/wasm/CHANGELOG.md` (pure-technical band)
- Heading codes scrubbed (`0.4.0`, `0.2.0`).
- Top registry note added; a `## 0.5.0` entry added (the futoshiki-difficulty
  bump the source carries, tracking core 0.5.0) so the changelog is no longer a
  version behind its own `Cargo.toml`. Both 0.4.0/0.5.0 marked source-only.
- The stale `≤93 KB` band (in the historical 0.2.0 entry) qualified as the
  two-game band "at 0.2.0", with the current five-game band (127,500 B) named.

### `csp-solver/csp_solver.pyi`
- `:3` "post-prune (tranche-III) surface" → "current pruned surface." Stubtest
  docstring kept.

### `web/frontend/public/_headers` (comment scrub only)
- Process narration removed from comments (T4-W8/T4-W3/T3-W2/Tranche II/W5/W6,
  FAM-14, G8-H2, ROW 5, P5, Q4-amended) → plain facts. **Policy lines proven
  byte-identical** (non-comment lines SHA `0734365e…` unchanged; `diff` clean).

---

## Gate results (this estate)

| Gate | Result |
|---|---|
| meta-leak zero (README, both CHANGELOGs, wasm README, .pyi) | **ZERO** across all five |
| `_headers` process-code scrub | **clean** (policy line byte-identical) |
| em-dash `csp-solver/README.md` ≤ 20 | **11** |
| em-dash `csp-solver/wasm/README.md` | **0** (was 10) |
| registry stamps match census | crate 0.5.0 crates.io · wasm npm 0.2.0 / source 0.5.0 · file-link disclosed |
| CHANGELOG 0.4.0 reconciliation | **0.4.0 core row added**; alignment claim now points to a documented + published version |
| correctio / copula / banned-word | **none** in the estate |
| lean-band line | 121,855 B measured · 124,500 B ceiling · twiggy lane · fail >127,500 B |

## Flags for the team lead (surfaced, not decided)

1. **Version-discipline divergence (registry honesty).** `PuzzleClass` (commit
   `38d3f223`, W11) and the cage primitives + thermo/killer/kenken (`f8950257`,
   W13) landed **after** the `0.5.0` Cargo.toml bump (`d4faa412`, W6) with **no
   subsequent version bump**. crates.io `0.5.0` (published at the WM seal, before
   W11/W13) therefore does **not** contain the five-family surface — the current
   source `0.5.0` has grown past the published `0.5.0` tarball, and crates.io
   cannot re-issue `0.5.0`. I wrote the READMEs to describe the HEAD source (five
   families) while keeping the registry lines factual (crates.io latest 0.5.0; I
   never claim the tarball contains the five families) and the CHANGELOGs to
   document the real releases (the 0.5.0 entry is the futoshiki-difficulty release
   that crates.io actually shipped). The clean resolution is a **0.6.0 bump + a
   five-family CHANGELOG row**, which is a source/release change outside this
   docs-only wave. Flagged for adjudication.
2. **tests-py 27/0 kept, not re-run.** The pytest suite needs a maturin wheel
   build; I kept "27 passed, 0 skipped" corroborated by the census static count
   (16 `def test_` → 27 parametrized) and by commit `044f2526`'s body. The Rust
   triple I DID run (208/0/0).
3. **Full-module wasm figure** is not in my estate (benchmarks.md is another
   lane's); the lean 121,855 B is the authoritative shipped figure I carry.

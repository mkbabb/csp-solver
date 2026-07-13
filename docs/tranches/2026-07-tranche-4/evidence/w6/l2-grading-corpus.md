# T4-W6 · L2 — Grading truth: the 16×16 inversion dies, the corpus/live split is gated

Lane L2 of wave T4-W6 (generation truth). Scope: **ROW 2** (the 16×16 inversion,
GEN-1), **ROW 3** (corpus/live-gen parity, GEN-3), **ROW 5** (uniqueness coverage,
GEN-4). No frontend source authored (the one frontend touch is the auto-generated
`templates.ts`, re-derived from `data/` by the vite plugin). The wasm surface is
untouched — the sudoku bank is embedded only in the *core* crate and is not reached
by any lean-wasm export, so the regenerated bank leaves the lean artifact byte-for-
byte L1's (87,152 B); no rebuild.

Machine: darwin 25.4.0, aarch64. Toolchain: cargo nightly (default), `rustc`/clippy
1.97-era. Base wave lean wasm baseline: 86,734 B (L1 moved it to 87,152 B; L2 does
not move it).

---

## The disposition decision (ROW 2, GEN-1)

The spec's preferred close is **(a) re-grade the corpus**; (b) honest relabel is the
fallback if regeneration can't yield a monotone 16×16 Hard. I ran the decision
procedure empirically before choosing.

**The measured cause.** `measure_difficulty` (the codebase's own FC+FailFirst
backtrack proxy) over the *embedded* 16×16 bank, node budget 500K:

```
embedded easy   : givens 192, backtracks [0 ×10]
embedded medium : givens 110-119, backtracks [0 ×8, 23618, 4673908]   (2/10 search)
embedded hard   : givens 102-107, backtracks [0, 0, 0, 0, 0]          (0/5 search)
```

Hard measured **strictly easier than Medium** — fewer givens AND zero search on
every deal. The embedded Hard bank is **stale**: it predates the current
generator. A fresh pool from the *current* `generate_board(4, Hard)` (18 boards,
budget 500K):

```
fresh hard pool (18/18): givens 90-97, every board SATURATES the budget,
                         0.90M - 2.00M backtracks
```

Every fresh Hard board carries millions of FC-backtracks. So disposition **(a) is
feasible and clean**: the current generator already deals genuinely search-hard
16×16 boards; the bank just needs regenerating. **(a) closes the 16×16 rung.**

**The 9×9 rung takes (b).** 9×9 Easy (61 givens) and Medium (35 givens) are
*live-generated* (empty bank) and both measure **0 backtracks** — the FC proxy is
**bimodal** at 9×9/16×16 (a board is either propagation-solvable at 0 or runs to
millions; nothing sits between), so it *cannot* separate two propagation-solvable
tiers. No corpus edit fixes this: the honest signal these tiers deliver is
**clue-count**, and the live search grade is W7's technique tier. So the 9×9
"tiers distinct" rung closes by **honest re-derivation (b)** — gated by a monotone
clue-count ladder, with the FC-flatness recorded as a known proxy limit.

**Recorded: 16×16 closed by (a); 9×9 easy≡medium closed by (b).**

---

## Gate — GEN-1 the born-RED probe (`examples/zzz_gen_truth_probe.rs`)

Promoted from the r2 throwaway to a standing gate: grades the embedded bank by the
`measure_difficulty` config (FC+FailFirst) under a node budget and asserts the tier
labels order honestly — median AND capped-max backtracks and the deep-search
fraction non-decreasing easy→medium→hard, givens non-increasing, and 16×16 Hard
deep-searching on a majority of deals. `measure_difficulty` is deterministic and
the symmetry transform preserves the backtrack count (r2 GEN-1), so grading each
template once *is* grading every deal it produces.

### Born RED — the stale bank inverts

```
$ cargo run -p csp-solver --release --example zzz_gen_truth_probe   # BASE bank
N=3 (9×9):
  hard   20 boards  givens~ 24  bt(cap 300000) median    234 max 300000  deep-search  30%
N=4 (16×16):
  easy   10 boards  givens~192  bt(cap 300000) median      0 max      0  deep-search   0%
  medium 10 boards  givens~113  bt(cap 300000) median      0 max 300000  deep-search  10%
  hard    5 boards  givens~105  bt(cap 300000) median      0 max      0  deep-search   0%

VERDICT: FAIL — 3 label inversion(s):
  - N=4: hard max backtracks 0 < medium max 300000 (search inversion)
  - N=4: hard deep-search 0% < medium 10% (difficulty inversion)
  - N=4: Hard requires deep search on only 0% of deals (< 50% majority) — a Hard tier that rarely searches is the stale-bank inversion
$ echo $?
1
```

(A saturating board's raw backtracks keep climbing to the node cutoff, so two
saturating boards report different tallies; the gate grades each board as
`min(backtracks, 300000)` so "max ≥ max" is cutoff-stable — both saturating ⇒ both
== the ceiling — instead of turning on which runaway accrued more.)

### Cure — regenerate the stale Hard bank (disposition (a))

```
$ SKIP_MEASURE=1 cargo run --release --example generate_templates -- 4 hard 5
  wrote 5/5 template(s) in 12.20s
# givens: 94 / 95 / 92 / 91 / 100  (was 102-107)
```

### GREEN — every banked tier orders honestly

```
$ cargo run -p csp-solver --release --example zzz_gen_truth_probe   # regenerated bank
N=4 (16×16):
  easy   10 boards  givens~192  bt(cap 300000) median      0 max      0  deep-search   0%
  medium 10 boards  givens~113  bt(cap 300000) median      0 max 300000  deep-search  10%
  hard    5 boards  givens~ 94  bt(cap 300000) median 300000 max 300000  deep-search 100%

VERDICT: PASS — every banked tier orders honestly (no inversion)
$ echo $?
0
```

median 0 ≤ 0 ≤ 300000; max 0 ≤ 300000 ≤ 300000; deep-search 0% ≤ 10% ≤ 100%; givens
192 ≥ 113 ≥ 94. **The inversion is dead.** Wired into the CI `rust` lane
(`.github/workflows/ci.yml`, release example beside `gac_ab_corpus`). **CLOSED (a).**

### GEN-1 9×9 — clue-count honesty (disposition (b))

`tests/sudoku_generate.rs :: clue_count_ladder_is_monotone_across_served_tiers`
asserts the *served* givens fall strictly easy>medium>hard at every size — 16×16
192/113/94 (bank), 9×9 61/35/24 (Easy/Medium live, Hard bank), 4×4 all live — the
honest signal the FC proxy can't carry for the propagation-solvable tiers. GREEN
(part of the 10/10 below). The 9×9 easy≡medium FC-flatness is recorded, not
"fixed": it is W7's live grade to supply.

---

## Gate — GEN-3 corpus/live-gen parity (ROW 3)

The fall-through tiers — all 4×4, and 9×9 Easy+Medium (empty bank → live hole-dig
in the wasm worker on every deal) — are now gated equally to the corpus fast path,
as a **node-count invariant** rather than a flaky in-browser wall-time probe (node
counts are machine-invariant, the ci.yml GAC-corpus rationale; the browser-latency
variant belongs to the e2e lane that owns wall-time surfaces).

`tests/sudoku_generate.rs :: live_dealt_tiers_are_unique_and_within_the_corpus_bar`
— for each fall-through tier × 5 seeds (25 deals): asserts the deal is single-
solution (`max_solutions:2`, GEN-4) AND solves within a 5M-node corpus bar
(`budget_exceeded` false — the deal is on the fast-path latency budget). GREEN,
0.27s. The banked 9×9-Hard and all 16×16 stay on the corpus fast path; the 9×9
grade is clue-count-monotone (24 < 35 < 61 givens). **CLOSED (live-path gated).**

---

## Gate — GEN-4 uniqueness coverage (ROW 5)

Two halves, per the spec.

1. **Live-gen sweep.** W2 landed `live_generated_boards_are_unique_across_served_
   sizes` (n∈{2,3,4} Easy, one seed each — cited, not redone). L2 **widens** it with
   the fall-through sweep above (n∈{2,3}×diff×5 seeds, `max_solutions:2`), the breadth
   GEN-4 asked for.
2. **Bank uniqueness de-orphaned.** `examples/verify_bank_uniqueness` re-solves every
   embedded template with `max_solutions:2` — it ran in **no** CI lane (FAM-1
   orphaned-gate: a corrupt `data/` template passed CI). Now wired into the CI `rust`
   lane:

```
$ cargo run -p csp-solver --release --example verify_bank_uniqueness
  N=3 hard   20 boards  unique=20/20  max_bt=101
  N=4 easy   10 boards  unique=10/10  max_bt=64
  N=4 medium 10 boards  unique=10/10  max_bt=158
  N=4 hard    5 boards  unique=5/5  max_bt=7995
  total 45 · unique 45 · non_unique 0 · unsat 0 · budget_trunc 0
  VERDICT: PASS — all boards unique & solvable   (exit 0)
```

The regenerated Hard bank is unique under the production `Ac3+Mrv` solve at
`max_bt=7995` — far below its FC-proxy millions, the honest reminder that
`measure_difficulty` is a *proxy*, not the browser's Ac3/GAC solve (the inversion
was real in the codebase's own signal; the browser solve is cheaper). **CLOSED.**

---

## Full rust battery (verbatim)

```
$ cargo fmt --check                                            → FMT CLEAN
$ cargo clippy --workspace --all-targets -- -D warnings        → clean
    (only the pre-existing proc-macro-error2 future-incompat NOTE, not our code)
$ cargo test --workspace                                       → 0 failures
    tests/sudoku_generate.rs          10 passed   (0.80s)  [+2 L2: live_dealt sweep, clue_count ladder]
    tests/difficulty_parity.rs         2 passed
    tests/futoshiki_difficulty.rs      3 passed
    tests/sudoku.rs                    7 passed
    tests/futoshiki.rs                11 passed
    … every other suite green, no failures
$ cargo run -p csp-solver --release --example zzz_gen_truth_probe   → PASS (exit 0)
$ cargo run -p csp-solver --release --example verify_bank_uniqueness → PASS 45/45 (exit 0)
```

CI YAML re-parses clean (`python3 -c "yaml.safe_load(...)"`). `npx vite build`
succeeds against the new bank (frontend builds; `templates.ts` re-derived, 45 boards
/ 8020 cells unchanged in shape, the five 16×16-Hard rows swapped for the genuinely-
hard boards).

---

## Files changed (L2)

- `csp-solver/data/sudoku_puzzles/4/hard/template-{0..4}.json` — **regenerated**
  (disposition (a); 102-107 → 91-100 givens, each now FC-search-hard)
- `csp-solver/examples/zzz_gen_truth_probe.rs` — **NEW** GEN-1 gate (born-RED→GREEN)
- `csp-solver/tests/sudoku_generate.rs` — **+2 tests**: `live_dealt_tiers_are_unique_
  and_within_the_corpus_bar` (GEN-3+GEN-4), `clue_count_ladder_is_monotone_across_
  served_tiers` (GEN-1 disposition (b))
- `.github/workflows/ci.yml` — **+2 rust-lane steps** (`zzz_gen_truth_probe`,
  `verify_bank_uniqueness`) + lane-map note; surgical, shared with concurrent work
- `web/frontend/src/games/sudoku/data/templates.ts` — **re-derived** by the vite
  `sudokuTemplates` plugin from the regenerated bank (auto-generated, prettier-
  ignored; the only frontend touch)

## Lane boundary notes

- The wasm surface is untouched (bank not embedded in the lean build) — no rebuild,
  no byte-budget move; L1's 87,152 B stands.
- `web/frontend` source untouched save the derived `templates.ts`; the concurrent
  T4-WM edits (DigitPad excision, mobile specs) were left alone.
- Disposition on the record: **16×16 → (a) regenerate; 9×9 easy≡medium → (b) honest
  clue-count re-derivation** (FC proxy bimodal, live search grade deferred to W7).
- ROW 3 closed by gating the live path as a node-count invariant; the in-browser
  latency probe proper is deferred to the e2e-owning lane per the repo's node-over-
  wall-time discipline.

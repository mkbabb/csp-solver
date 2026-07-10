# T2-W4 — Lane A: bank reshape (data)

**Stamp:** `rustc 1.97.0 (2d8144b78 2026-07-07)` · Node `v26.0.0` · Darwin arm64
(Apple M-series) · 2026-07-10. Repo working tree at tranche-2 HEAD `5f9980c8`
(not committed — per wave rule, no commit/push).

Three beats in order (N=5 excision → sparse+compact embed → conservative tier
excision), then the proof triad. All byte counts measured on-disk via
`find csp-solver/data/sudoku_puzzles -name '*.json' -exec cat {} + | wc -c`.

---

## Beat 1 — N=5 excision (R1-ratified)

- `git rm -r csp-solver/data/sudoku_puzzles/5/` — 9 files (N=5-easy only), the
  35,907 B dense subtree. Zero functional breakage: every runtime consumer
  hard-codes N∈{2,3,4} (`vite.config.ts` SIZES, `gac_ab_corpus::template_corpus`'s
  `for n in [2,3,4]`, `create_random_board` call sites), and the bank was never
  wasm-linked (Q2 category A). Dense bank after kill: **214,237 B** (N=2/3/4).
- Companion prose:
  - `docs/sudoku.md:3` → "N=2 through N=4 (4×4 through 16×16 boards) … exposes
    N=2, 3, 4 for all difficulties"; the N=5-easy clause dropped. **DONE.**
  - `docs/benchmarks.md:14` W0 "and one N=5" drop — **CONFIRMED already landed**
    (line 14 reads "112-board … all 107 template-bank puzzles (N=2..4)"; no
    "and one N=5"). Left untouched (W0's territory). NOTE: the tier excision in
    Beat 3 shrinks the live `gac_ab_corpus` run to 50 boards; the 112/107/0-of-112
    literals in benchmarks.md are historical-A/B-decision-corpus prose flagged
    "inherited-trust" and are not this lane's to rewrite — recorded here as a
    known downstream staleness, not a Beat-1 gate item.
  - Optional (non-gating, comment-precision): generalized the "N=5 Medium/Hard"
    sites → "N=5" in `generate.rs` (2 doc-comments) and `sudoku_api.rs` (2 sites).
    Post-kill N=5 is empty for all difficulties, so "Medium/Hard" was imprecise.
- glyphPaths/SIZES consistency (read-only verify): **CONSISTENT.**
  `glyphPaths.ts` registers glyphs `0-9` + `A-G` (ceiling G = value 16 =
  16×16 = N=4). `toDisplayChar` synthesizes `A-G` for `boardSize > 9`. Playable
  `sizeOptions` = {2,3,4}; max offered board is N=4/16×16, rendered through G.
  N=5/25×25 (would need H-P, values 17-25) is excised — no size is offered that
  the glyph system cannot render. No glyph gap.

## Beat 2 — sparse + compact embed (P1 CONFIRMED)

Re-materialized the surviving N=2/3/4 bank via `P1-reshape_bank.py` — deterministic
transform (drop `solution`/`backtracks`, drop zero-holes, strip whitespace), wrapped
form `{"puzzle":{"<pos>":<val>,…}}`. The wrapper is load-bearing: three readers key
on `"puzzle"` — `parse_puzzle_field` (Rust, doc-comment-only change), the Vite
plugin's `data.puzzle`, and `gac_ab_corpus::parse_int_map(_, Some("puzzle"))`.
`parse_puzzle_field` needed no logic change (doc-comment only, per `P1-source.diff`).

```
files reshaped: 107
  N=2: 30 files   9239 ->   1854 B
  N=3: 52 files  77062 ->  15260 B
  N=4: 25 files 127936 ->  28942 B
TOTAL embed: 214237 -> 46056 B  (-78.5% vs. dense-N234)
```

**Surviving embed after Beat 2 = 46,056 B — byte-exact to P1's post-N=5-kill
projection.** Sample: `{"puzzle":{"0":3,"2":1,"4":1,"6":2,…}}` (sparse, compact,
wrapped).

## Beat 3 — tier excision (conservative split, verify-P1-P2 verbatim)

`git rm -rf` N=2 (all tiers) + N=3-easy + N=3-medium. KEPT N=3-hard (the low-power
device confirmation run that would clear its excision has never been made) and N=4
(all tiers — the >1 s native-generate wall is real).

| surviving tier | files | sparse bytes |
|---|---|---|
| N=3-hard | 20 | 3,591 |
| N=4-easy/medium/hard | 25 | 28,942 |
| **total surviving embed** | **45** | **32,533** |

**Surviving embed after Beat 3 = 32,533 B — byte-exact to the conservative-split
projection (28,942 + 3,591).** git status of the data dir: 71 deletions
(9 N=5 + 30 N=2 + 20 N=3-easy + 12 N=3-medium) + 45 modifications (reshaped
survivors).

### Frontend surface (templates plugin + regenerated templates.ts)

`vite.config.ts::sudokuTemplates` updated (atomically, coexisting with W6's
concurrent PWA-plugin add to the same file):
- `SIZES = [2,3,4]` → `SIZES = [3,4]` (N=2 fully excised → key absent → frontend
  `TEMPLATE_BANK[2]?.[…] ?? []` → wasm live-gen).
- per-difficulty `existsSync(dir)` guard: a git-rm'd tier within a surviving size
  (N=3-easy/medium) → `bank[n][d] = []` instead of a `readdirSync` ENOENT throw →
  live-gen fallback. (This is the tooling gap verify-P1-P2 §3 flagged as
  not-in-`P2.diff`; authored here.)

`templates.ts` regenerated (byte-identical to what the updated plugin's `render()`
emits): banner "45 boards, 8020 u32 cells total", keys "3"/"4", N=3 easy:[]
medium:[] hard:[20 boards], N=4 all tiers.

---

## Proof triad

**`cargo test --workspace`:** `151 passed · 0 failed · 6 ignored` — GREEN. (151 vs.
P1's 150 is the tranche-2 working-tree baseline shift — other waves' test
add/deletes; 0 failed is the gate.)

**`cargo run --release --example verify_bank_uniqueness`** (P1 uniqueness harness,
driving the `include_dir!` embed → `parse_puzzle_field` over the surviving bank):
```
  N=3 hard   20 boards  unique=20/20  max_bt=101
  N=4 easy   10 boards  unique=10/10  max_bt=64
  N=4 medium 10 boards  unique=10/10  max_bt=158
  N=4 hard    5 boards  unique=5/5   max_bt=154
total boards 45 · unique 45 · non_unique 0 · unsat 0 · budget_trunc 0 ·
max_backtracks 158 · elapsed 0.033s · VERDICT: PASS — all boards unique & solvable
```
All 45 surviving boards parse from sparse → full M·M vectors and solve to exactly
one solution.

**`cargo run --release --example gac_ab_corpus`** (reshaped bank):
```
# GAC A/B false-UNSAT corpus — 50 boards (production config: Ac3 + Mrv)
false-UNSAT (GAC off): 0/50
false-UNSAT (GAC on):  0/50
VERDICT: 0/50 — PASS
```
**Derived verdict: 0/50 — PASS.** The corpus is 5 named hard 9×9 + 45 surviving
template boards (N=3-hard 20 + N=4 25). The count shrank 112→50 with the tier kills
— **CORRECT**: `corpus.len()` derives the number since W0, and `template_corpus`'s
`fs::read_dir(&dir) else { continue }` cleanly skips the git-rm'd directories with
no crash. Zero false-UNSAT under both GAC states.

## Byte-count ledger (the numbers the wave asked for)

| checkpoint | bytes |
|---|---|
| dense full bank (pre-any-kill) | 298,006 |
| N=5 subtree excised (dense N=2/3/4) | 214,237 |
| **Beat 2 — sparse embed, surviving N=2/3/4** | **46,056** |
| **Beat 3 — sparse embed, conservative split (N=3-hard + N=4)** | **32,533** |
| — of which N=3-hard | 3,591 |
| — of which N=4 (all tiers) | 28,942 |

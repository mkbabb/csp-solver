# Pass-3 Q5 — P1 gate sufficiency: does the 116-board uniqueness sweep cover every `parse_puzzle_field` consumer?

**Author:** Pass-3 critique lane Q5 · **Repo HEAD:** `8913023e` (read-only main tree) ·
**Evidence:** fresh grep census + a worktree build/run of `gac_ab_corpus` against
both the dense bank and a P1-reshaped sparse bank (worktree removed after).

---

## VERDICT

**The 116-board uniqueness sweep is SUFFICIENT for `parse_puzzle_field` itself, but
the question's framing under-counts the format-consumer set. A slightly wider net
is warranted — not because anything breaks (nothing does; proven below), but
because one live bank reader (`gac_ab_corpus`) parses the reshaped files through an
*independent* parser that no P1 gate exercises, and it is a W0/W-GATE re-run
target (D24).**

The three consumers named in the question resolve cleanly:

| Named candidate | Is it a `parse_puzzle_field` / bank-format consumer? | Covered by the P1 gate? |
|---|---|---|
| **template pipeline** (`embedded_templates` → `generate_board_with_templates`) | YES — its sole parse path is `parse_puzzle_field` | **YES** — the sweep drives `embedded_templates` for every (N,diff) |
| **difficulty_parity** | **NO** — a red herring; it `read_to_string`s `.rs`/`.ts`/`.py` *source* and greps for `Difficulty` declarations, never opens `sudoku_puzzles/*.json` | n/a (nothing to cover) |
| **wasm gen** (`generate_sudoku`) | **NO** — takes `templates: Vec<u32>` as a `wasm_bindgen` param; never calls `parse_puzzle_field`. Its JS side is the Vite plugin. | n/a (the JS parse is the Vite plugin, covered by P1's node replica) |

So none of the three *named* consumers needs a wider net. The gap is an **unnamed
fourth reader** the P1 report's own Q5 answer (Finding #3) omitted entirely.

---

## RE-DERIVED CONSUMER SET (fresh grep at HEAD `8913023e`)

Every source that opens `sudoku_puzzles/*.json`
(`grep -rln sudoku_puzzles --include=*.rs/*.ts/*.py/*.mjs`, node_modules/dist stripped):

1. **`csp-solver/src/puzzles/sudoku/generate.rs`** — `parse_puzzle_field` (`:70`), sole
   caller `embedded_templates` (`:104`) over the `include_dir!` embed. Downstream callers
   of `embedded_templates`: `py/sudoku_api.rs:306` (PyO3, KEEP per D3), the inline test
   `embedded_templates_present_and_absent` (`:355`, N=3 only), and P1's new
   `verify_bank_uniqueness` sweep. → **the sweep covers this completely** (all 116 boards,
   all N/diff; parse asserts `board.len()==m*m`).
2. **`web/frontend/vite.config.ts`** — the `sudokuTemplates` plugin (`:47-52`):
   `JSON.parse` → `Object.entries(data.puzzle)` into `new Array(total).fill(0)`. Reads
   N=2/3/4 only (`SIZES=[2,3,4]`). → covered by **P1's node replica**, not by `cargo test`.
3. **`csp-solver/examples/gac_ab_corpus.rs`** — a **second, independent parser**
   (`parse_int_map(content, Some("puzzle"))`, `:23-61`) that bypasses `parse_puzzle_field`.
   Reads N=2/3/4 `sudoku_puzzles`, collects `(pos,val)` pairs, `board_from_given` filters
   `val!=0`. → **exercised by NO P1 gate.**
4. `csp-solver/examples/generate_templates.rs` — the **writer** (generator), edited by P1.
5. `docs/tranches/.../artifacts/gac_ab_corpus.rs` — **archived frozen copy** under `docs/`,
   not a cargo target. Inert.
6. `useSolver.ts` / `templates.ts` — grep-`-l` false positives: a doc-comment and the
   auto-generated output of the Vite plugin respectively; neither opens JSON.

No `.py` reader exists (legacy Python solver deleted). No file under `tests/` or
`wasm/tests/` reads the bank or hard-codes the `solution`/`backtracks` schema
(`grep sudoku_puzzles|embedded_templates|"solution"|"backtracks"|parse_int_map`
over `csp-solver/tests/` + `wasm/tests/` → **none**).

**Live format-parsers: three** — `parse_puzzle_field`, the Vite plugin, and
`gac_ab_corpus::parse_int_map`. P1's gate exercises the first (sweep) and the second
(node replica). **The third is untouched.**

---

## FRESH MEASURED EVIDENCE (worktree at `8913023e`)

Built `gac_ab_corpus` once, ran it against the **dense** committed bank, then ran
`P1-reshape_bank.py` over the worktree bank and re-ran the **same binary** against the
**sparse** bank (no recompile — binary unchanged, reads `CARGO_MANIFEST_DIR/data`):

```
DENSE  (committed):  # corpus 112 boards · false-UNSAT off 0/112 · on 0/112 · VERDICT 0/113 — PASS
reshape:             298006 -> 81963 B (-72.5%)  [byte-exact to P1] · N=5 subtree 35907 · surviving 46056
sample after:        {"puzzle":{"0":3,"2":1,"4":1,"6":2,"7":3,"8":4,"10":3,"11":2,"12":2,"13":3,"14":4,"15":1}}
SPARSE (reshaped):   # corpus 112 boards · false-UNSAT off 0/112 · on 0/112 · VERDICT 0/113 — PASS
```

**`gac_ab_corpus` accepts the reshaped sparse+puzzle-only bank with zero changes —
identical 112-board corpus, identical 0/112 result.** The reshape is semantically
transparent to it: `parse_int_map` reads only `"puzzle"` (still present) and
`board_from_given` already filters zeros, so dense-with-holes and sparse-givens
yield the same board. Dropping `solution`/`backtracks` is invisible (it never read
them from this bank; the only `solution` read is `n5_board` against the *already-excised*
`sudoku_solutions/` bank, which no-ops via `.ok()?`).

**Two corrections to the P1 report fall out of this (both low-severity, neither
changes the PASS):**

- **P1 §BLAST RADIUS / Finding #1 undercounts the bare-form blast radius.** P1 says the
  bare `{…}` (no `"puzzle"` wrapper) alternative "breaks **both** consumers." It breaks
  **three**: `parse_int_map(_, Some("puzzle"))` does
  `json.find("\"puzzle\"").unwrap_or_else(|| panic!("key \"puzzle\" not found"))` — the bare
  form **panics** `gac_ab_corpus` too (code-confirmed, `:27-29`). The chosen wrapped form is
  safe for all three; the recorded justification should read "three consumers."
- **P1 Finding #3 (its own Q5 answer) omits `gac_ab_corpus`.** Its census — "only Rust
  caller is `embedded_templates` … difficulty_parity does not read the bank … wasm never
  calls `parse_puzzle_field` … no wider net needed" — is correct for `parse_puzzle_field`'s
  callers and the named trio, but silent on the independent second parser. "No wider net
  needed" is true for *correctness* (proven) but not for *gate coverage*.

---

## WHY THE GAP MATTERS (not merely pedantic)

`gac_ab_corpus` is not dead scenery — it's a **live W0 + W-GATE artifact**:
- **D24 / W0 literal-refresh** mandates fixing its hard-coded `"0/113 — PASS"` verdict
  string (`:244`) → derive from `corpus.len()` (reproduced here as **112**, not 113), and
  repairing the `benchmarks.md` "Reproducing" section.
- **W-GATE** re-runs it to re-derive the 13.36×-class GAC numbers against **this exact
  bank** (the synthesis notes those ratios "rest on a deleted scratch harness until
  W-GATE commits a probe").

Wave sequencing puts the two events on **opposite sides** of the reshape: W0 edits/runs
`gac_ab_corpus` on the **dense** bank (tranche open), W4 reshapes to **sparse**, then
W-GATE re-runs it on the **sparse** bank. The W4 gate as authored —
"*full uniqueness sweep over the surviving bank green · `cargo test` green · wasm lean
size … · new embed byte-count recorded*" — touches neither the Vite plugin nor
`gac_ab_corpus`. `cargo test --workspace` *compiles* the example (source unchanged →
always green) but **never runs its bank read**. So a future bank-format change (e.g. the
tempting bare-form −1,276 B) would sail through the W4 gate and silently desync
`gac_ab_corpus` — exactly the class of miss the Pass-3 net exists to catch.

---

## WAVE-SPEC AMENDMENT

**T2-W4 (synthesis §2), Gates line — widen the net by one reader.** Replace:

> - Gates: full uniqueness sweep over the surviving bank green · `cargo test` green · wasm lean size still under the 93,000 gate · new embed byte-count recorded.

with:

> - Gates: full uniqueness sweep over the surviving bank green · `cargo test` green ·
>   **`gac_ab_corpus` green against the reshaped bank** (the independent `parse_int_map`
>   reader — an N-post-kill count of `5 hard + surviving-N2/3/4`, verdict `0/N`; it is a
>   W-GATE re-derive target and the *only* live bank-format parser the sweep + `cargo test`
>   do not exercise) · **frontend Vite-plugin parse green** (the node replica, or a real
>   `npm run build` that regenerates `templates.ts` — 107 boards) · wasm lean size still
>   under the 93,000 gate · new embed byte-count recorded.

**T2-W7 / P1 report record edits (two):** (a) P1 §BLAST RADIUS — the bare-form
alternative breaks **three** readers (`parse_puzzle_field`, Vite plugin,
`gac_ab_corpus::parse_int_map`), not two; keep the wrapped form for all three. (b) P1
Finding #3's consumer census must add `gac_ab_corpus` — its "no wider net needed" holds
for correctness (empirically: identical 112-board/0-false-UNSAT on the sparse bank) but
not for gate coverage.

**Everything else in P1 holds as authored:** `parse_puzzle_field` needs no code change
(doc-comment only); the sweep covers it and the template pipeline completely;
`difficulty_parity` and `wasm gen` are correctly out of scope; the 81,963 B / −72.5% /
N=5 35,907 B / surviving 46,056 B numbers all reproduced byte-exact.

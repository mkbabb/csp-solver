# Pass-3 Q2 — N=5 kill blast radius

**Question (synthesis §Residual, Pass-3 dispatch #2):** any consumer beyond the
embed + SIZES + glyphPaths (py tests, data tooling, docs, benches, wasm, e2e)
that references N=5/25×25? Exhaustive grep + verdict.

**Method:** fresh `git grep -n "N=5"` / `"25x25"` / `"25×25"` across the tracked
tree at HEAD `8913023e` (verified match), read every hit in context, traced
each to either a live call path or dead prose, and — for the wasm claim —
built-binary-inspected rather than trusted static reasoning. `.claude/worktrees/`
excluded (stale prior-session worktrees, not the live tree). No prior lane's
"N=5 kill" verdict is quoted without independent re-derivation below.

---

## VERDICT

**The W4 spec line ("N=5 bank + solutions excision … includes glyphPaths/SIZES
consistency check") is CORRECTNESS-COMPLETE but COMPLETENESS-INCOMPLETE.**

Zero functional/test breakage anywhere in the surviving tree — every genuine
runtime consumer already hard-codes N∈{2,3,4} independently of the bank's
on-disk contents, so deleting `csp-solver/data/sudoku_puzzles/5/easy/` (9
files, 35,907 B) trips no red test. But the spec's named check ("embed + SIZES
+ glyphPaths") is narrower than the actual footprint: **6 doc/prose sites**
across `docs/sudoku.md`, `docs/benchmarks.md`, root `CLAUDE.md`, and root
`README.md` describe N=5-easy as a live, currently-served feature and go
stale, and none of them has a named owner in any wave bullet. `docs/sudoku.md`
in particular is mentioned **nowhere** in the synthesis at all — not in W4, not
in W7's fold list (which only names the 4 CLAUDE.md's).

## THE FULL HIT LIST (exhaustive, categorized)

### A — CONFIRMED ZERO RISK (traced to source, no dependency on N=5 data)

| Consumer | Evidence |
|---|---|
| **wasm** | Built binary `csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm` (87,853 B, matches D21 exactly) — `grep -ac '"solution"'` / `'"puzzle"'` / a distinctive board-digit substring all return **0**. Confirmed architecturally: `wasm/src/sudoku.rs::generate_sudoku` calls `generate_board_seeded`/`generate_board_with_templates_seeded`, neither of which touches `embedded_templates`/`SUDOKU_PUZZLES`; those live behind `puzzles/sudoku/generate.rs` and are only called from `py/sudoku_api.rs` (`#[cfg(feature = "py")]`, off in the wasm crate's default-feature dep). The 298 KB/82 KB bank was **never** linked into the wasm artifact, N=5 or not — the kill produces **zero wasm size delta**. |
| **e2e** | `web/frontend/e2e/*.spec.ts` — the only `'5'` hit (`round9.spec.ts:221`) is a cell **value** keystroke (`nativeSetter.call(input, '5')`), unrelated to board size. Zero board-size-5 references. |
| **benches** | `csp-solver/benches/sudoku.rs` uses 5 hardcoded 9×9 literal grids (Al Escargot etc.); zero calls to `embedded_templates`/`generate_board*`. `benches/{map_coloring,assignment,queens,lattice,cost_finite_domain}.rs` numeric `5`s are graph-coloring node ids / cost values, unrelated. |
| **py tests (REHOMED, survive into `csp-solver/tests-py/`)** | `test_rust_backend.py`'s only 2 `create_random_board` call sites: `@pytest.mark.parametrize("n", [2, 3])` and a hardcoded `create_random_board(4, EASY)` — never 5. `test_bench_compare.py`, `test_panic_contract.py` — zero N/size-5 references at all. |
| **`test_wheel_contracts.py` (REHOMED)** | Its two "N=5" hits (lines 271, 273) are prose *inside* a `@pytest.mark.skip(reason="...")` string on `test_budget_exceeded_error_end_to_end`, whose body is `pass` — narrating an out-of-band adversarial fuzz campaign, never a live call. Confirmed dead. |
| **`examples/gac_ab_corpus.rs`** | `template_corpus()` hardcodes `for n in [2u32, 3, 4]` — it **never reads** `data/sudoku_puzzles/5/`. The separate `n5_board()` (opt-in via `--n5`) reads `data/sudoku_solutions/5/board-0.json` — a **different, already-absent directory** (`find … -iname sudoku_solutions` returns nothing repo-wide; the file's own comment confirms: *"the `sudoku_solutions/` bank was excised, so the `--n5` path … now degrades to its existing 'not found, skipping' branch"*). This path is already fully inert at HEAD, independent of and prior to the W4 kill. |
| **`csp-solver/tests/sudoku.rs`, `difficulty_parity.rs`** | Zero N=5 / size references (grep-confirmed). |
| **`generate.rs`'s own inline test** (`embedded_templates_present_and_absent`) | Asserts `embedded_templates(5, Medium).is_empty()` — stays true; never asserts `embedded_templates(5, Easy)` non-empty. Unaffected. |
| **`csp-solver/src/puzzles/futoshiki/generate.rs:33`** ("N=5–7") | **False positive** — Futoshiki's own board-size N (a different game; `VALID_BOARD_SIZES = [4,5,6,7]` in the frontend), collides on the letter "N" only, not Sudoku's subgrid-N. Not a consumer. |
| **`AnswerKeyLaminate.vue:97`** ("4×4 … 25×25") | Comment prose only. Verified the `keyCells` computed is genuinely board-size-agnostic (pure arithmetic off `props.boardSize`) — zero dependency on the bank, `SIZES`, or `glyphPaths`. Cosmetic overclaim, zero functional risk. |

### B — DIES WITH W2, MOOT BY WAVE ORDER (not a W4 residual — W4 `deps: W2`)

`web/api/CLAUDE.md:80,106` · `web/api/src/app/core/errors.py:19` ·
`web/api/src/app/games/futoshiki/service.py:11` ·
`web/api/src/app/games/sudoku/service.py:56,64` ·
`web/api/tests/test_core_errors.py:153` · `web/api/tests/test_sudoku_service.py:65`
— all reference the "N=5 policy," and specifically test/enforce **N=5 Hard**
(already-empty, unaffected either way). None of these 6 files is among the 4
REHOMED wheel-contract files — all die wholesale when `web/api/` is excised in
W2, which the wave graph places strictly before W4. Zero incremental risk, but
confirms the wave-order dependency is load-bearing for this to be moot (a
Pass-3 Q3 concern, not this one).

### C — STALE PROSE, **NO NAMED OWNER IN ANY WAVE BULLET** (the actual gap)

| Site | Problem |
|---|---|
| **`docs/sudoku.md:3`** | *"Handles sub-grid sizes N=2 through N=5 (4x4 through 25x25 boards). The web app exposes N=2, 3, 4 for all difficulties and N=5 at easy only."* Goes stale the moment the bank dies. **This file is named nowhere in the synthesis** (`grep -n "docs/sudoku.md" synthesis-pass1.md` → 0 hits) — not in W4's bullet, not in W7's fold list (which only names the 4 `CLAUDE.md`s + 2 excised docs, not `docs/sudoku.md`). |
| **`docs/benchmarks.md:14`** | *"…all 107 template-bank puzzles (N=2..4), and one N=5…"* — adjacent to but not identical to W0's named fix ("`gac_ab_corpus.rs` hardcoded `0/113` → derive from `corpus.len()` (112) … benchmarks.md 113→112"). That fix corrects the *count*; it doesn't explicitly say to drop the *"and one N=5"* composition clause — which (per category A above) is already double-wrong independent of this kill: the default corpus run never includes an N=5 board at all. Same edit, should be bundled, not currently spelled out. |
| **Root `CLAUDE.md:82,140,169`** | Table row "N=2..5 (web: N=2,3,4 + N=5-easy)", "The origin serves N=5-Easy…", "N=5 is easy-only…" — all describe a live-served feature that both W2 (server excision) and W4 (data excision) retire. Covered *implicitly* by W7's "fold reflects the post-excision tree," but not called out as a named correction the way PyO3-version/MSRV corrections are. |
| **Root `README.md:43,96`** | Same pattern ("N from 2 to 5 … N=5 at easy", "…serveth N=5-Easy…") — same implicit-only W7 coverage. |

### D — CODE-COMMENT PRECISION DRIFT (cosmetic, zero functional risk)

`csp-solver/src/puzzles/sudoku/generate.rs:103,122-126,360` and
`csp-solver/src/py/sudoku_api.rs:301,310,325-326` — 8 doc-comment/inline-comment
sites cite **"N=5 Medium/Hard"** as *the* example of an empty-bank rejection.
Post-kill this is imprecise (N=5 is now empty for *all three* difficulties) but
**not wrong** — the code path (`embedded_templates(N,D).is_empty() → reject`)
already generalizes correctly to N=5-Easy with zero code change (verified: the
"locked N=5 policy" rejection mechanism is difficulty-agnostic, keyed only on
"is the directory empty," which P1 also confirmed needs no logic change). Pure
comment-text nit; optional polish, not a gate item.

### E — SOFT COMPLETENESS GAP (not a break, worth one line)

`csp-solver/examples/generate_templates.rs:17,86` still accepts `N=5` as a
valid CLI arg ("N sub-grid size (2, 3, 4, 5 -> 4x4, 9x9, 16x16, 25x25)"; parse
error message says "N must be an integer (2, 3, 4, or 5)"). Nothing stops a
future `cargo run --example generate_templates -- 5 easy 20` from silently
re-materializing the retired bank — the retirement is enforced only by data
absence, not by tool refusal. Not a break; a soft policy-durability gap.

---

## THE EXACT WAVE-SPEC AMENDMENT

**Target: T2-W4, bullet 1** (currently: *"N=5 bank + solutions excision (28%
of the embed, R1-ratified kill) — can land ahead of the prototypes; includes
`glyphPaths`/`SIZES` consistency check."*)

**Amend to:**

> N=5 bank + solutions excision (28% of the embed, R1-ratified kill) — can
> land ahead of the prototypes; includes `glyphPaths`/`SIZES` consistency
> check **and the following companion prose edits, none of which gates on
> `cargo test`/uniqueness-sweep green (doc-only, verify by grep-for-zero
> post-land):**
> - `docs/sudoku.md:3` — rewrite the size sentence to "N=2 through N=4 (4×4
>   through 16×16)"; drop the N=5-easy clause.
> - `docs/benchmarks.md:14` — when W0's `113→112` fix lands, also drop the
>   `"and one N=5"` composition clause (the default `gac_ab_corpus` run never
>   includes an N=5 board — `template_corpus()` hardcodes N∈{2,3,4}, and the
>   opt-in `--n5`/`n5_board()` path already reads an unrelated, already-excised
>   `sudoku_solutions/5/` directory, distinct from the `sudoku_puzzles/5/`
>   killed here).
> - Root `CLAUDE.md`/`README.md` N=5-easy claims (`CLAUDE.md:82,140,169`,
>   `README.md:43,96`) — call out explicitly as a required correction into
>   W7's fold rather than leaving it to fall out of the general rewrite (W7's
>   gate "every surviving fact single-homed" doesn't itself catch a *retired*
>   fact that a sloppy fold could carry forward verbatim).
> - Optional (comment-precision only, not gating): the 8
>   "N=5 Medium/Hard" comment sites in `generate.rs`/`sudoku_api.rs` →
>   generalize to "N=5" (all difficulties, post-kill).
>
> Gate addition: `git grep -rn "N=5\|25x25\|25×25"` outside
> `docs/precepts/audits/`, `docs/tranches/` returns **zero** hits touching
> Sudoku (the one legitimate survivor, `futoshiki/generate.rs:33`'s "N=5–7," is
> Futoshiki's own board-size N and must remain).

No amendment needed to W0, W2, or W7's structural shape — the gap is a missing
explicit line item inside an existing wave, not a missing wave or a
wave-ordering fix.

---

## Evidence trail (commands run, this session)

- `git grep -n "N=5"` / `"25x25\|25×25"` at HEAD `8913023e`, tracked files only,
  audits/tranches archives excluded — 27 raw hits, all read in context.
- `csp-solver/data/sudoku_puzzles/{2,3,4,5}/` file counts: 30/52/25/9 (N=5 =
  easy-only, 9 files, 108 KiB on disk).
- `vite.config.ts:30` — `const SIZES = [2, 3, 4]` (exact line match to the
  synthesis's own citation).
- `games/sudoku/ControlPanel/constants.ts` — size picker options `{2,3,4}`
  only, no 25×25 entry.
- `glyphRegistry.ts::toDisplayChar` / `glyphPaths.ts` — glyph registry defined
  through `'G'` only (16×16's ceiling); confirms "unrenderable past glyph G."
- `wasm/pkg/csp_solver_wasm_bg.wasm` (87,853 B) — direct byte-grep for
  `"solution"`, `"puzzle"`, and a distinctive N=5 board digit-run: **0
  matches**, confirming the bank (any N) was never wasm-linked.
- `web/api/tests/*.py` file inventory (12 files) cross-checked against the
  synthesis's "4 REHOMED / 8 die" partition — matches exactly; the 2 files with
  live N=5-Hard test assertions (`test_core_errors.py`, `test_sudoku_service.py`)
  are both in the "8 die" set, not REHOMED.
- `csp-solver/data/sudoku_solutions` — repo-wide `find` returns nothing;
  corroborates `gac_ab_corpus.rs`'s own in-code comment that this directory
  was already excised prior to this tranche.

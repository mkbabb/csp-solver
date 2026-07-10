# T2-W4 — Data reshape

**Both prototype gates CLEARED and re-verified—the wave is unconditional except one device-gated branch.** P1 (sparse embed) reproduced byte-exact end-to-end; P2 (browser gen cost) cleared all six tiers 8× over, but its N=3-hard reassurance was re-judged SHAKY—so the excision beat is authored to the conservative split: **keep N=3-hard**.

**Dependencies**: ← W2 (N=5-easy already retired as a feature there). **Effort**: M.

---

## Scope

### N=5 bank excision (R1-ratified kill; can land first)

Delete `csp-solver/data/sudoku_puzzles/5/` (9 files; **35,907 B of the sparse embed**, 28% of the dense one). Zero functional/test breakage anywhere—every runtime consumer hardcodes N∈{2,3,4} independent of the bank's contents, and the bank was **never wasm-linked** (built-binary byte-grep: 0 hits; the kill produces zero wasm size delta)—[`../evidence/pass3/Q2-n5-kill-blast-radius.md`](../evidence/pass3/Q2-n5-kill-blast-radius.md). Includes the `glyphPaths`/`SIZES` consistency check **and the Q2 companion prose edits** (doc-only, verify by grep post-land):

- `docs/sudoku.md:3` — rewrite to "N=2 through N=4 (4×4 through 16×16)"; drop the N=5-easy clause (this file is named nowhere else in the plan—owned here).
- `docs/benchmarks.md:14` — the `"and one N=5"` clause dies with W0's 113→112 edit (booked there; verify it landed).
- Root `CLAUDE.md:82,140,169` / `README.md:43,96` N=5-easy claims → **named corrections into W7's fold** (a sloppy fold could carry a retired fact forward verbatim; W7's gate now catches it).
- Optional, non-gating: generalize the 8 "N=5 Medium/Hard" comment sites in `generate.rs`/`sudoku_api.rs` to "N=5" (the rejection mechanism is difficulty-agnostic and needs zero code change).

### Sparse+compact embed (P1 — CONFIRMED)

Regenerate the bank as `{"puzzle":{"<pos>":<val>,…}}` sparse/compact via [`../evidence/pass2/P1-reshape_bank.py`](../evidence/pass2/P1-reshape_bank.py) (or apply [`../evidence/pass2/P1.diff`](../evidence/pass2/P1.diff)—`git apply --check` clean at HEAD). Numbers, all reproduced byte-exact twice: **298,006 → 81,963 B (−72.5%)** full; N=5 subtree 35,907 B; **surviving embed (post-N=5) 46,056 B**. The wrapped form is load-bearing—the bare `{…}` alternative breaks **three** readers (`parse_puzzle_field`, the Vite plugin's `data.puzzle`, and `gac_ab_corpus::parse_int_map`, which panics on a missing `"puzzle"` key)—Q5's correction to P1's two-consumer count. `parse_puzzle_field` needs no code change (doc-comment only).

### Bank excision → live wasm gen (P2 — the verify-P1-P2 rewrite, verbatim)

Browser hole-dig gen is real and fast (given-fractions seed-deterministic, reproduced byte-exact across 8 fresh runs):

- **Excise unconditionally** (≥7× headroom on every reproduction): N=2 all tiers (1,854 B), **N=3-easy** (8,633 B), **N=3-medium** (3,036 B). Total shed 13,523 B.
- **KEEP the N=3-hard bank** (3,591 B sparse) **unless** a confirmation run on a genuine low-power device clears p95 ≤ 50 ms. Desktop headroom is only ~1.6–2.1× (clean p95 22–25 ms, contended to 31.5 ms); any ≥2× mobile penalty busts; and N=3-hard is the CHEAPEST N=3 tier to retain—P2's "that's where the savings live" is refuted (N=3-easy carries 8,633 B of the 15,260 B N=3 weight).
- **KEEP the N=4-hard bank** — the >1 s native generate wall is real; load-bearing.
- **Tooling gap the executor must author** (not in `P2.diff`): the conservative split needs `SIZES=[3,4]` **plus** an `existsSync(dir)` guard in the Vite plugin (`readdirSync` throws ENOENT on a git-rm'd difficulty dir; missing dir → `bank[n][d]=[]` → `?? []` → live-gen). `P2.diff` as written only flips `SIZES=[4]`—all-or-nothing per size.

Resulting surviving embed: **conservative 32,533 B** (N=4 + N=3-hard) · aggressive 28,942 B (N=4 only, device-gated). Both far under any gate; 3,591 B is the price of zero mobile risk.

## Gates

| Gate | Value |
|---|---|
| Uniqueness | full sweep over the surviving bank green (P1's harness: at the full bank, 116/116 unique, max_backtracks 158, ~0.08 s) |
| Rust | `cargo test --workspace` green — 150/0/6-class |
| **`gac_ab_corpus`** | green against the RESHAPED bank (the independent `parse_int_map` reader—the only live bank-format parser the sweep + `cargo test` don't exercise; a W-GATE re-derive target). Verdict `0/N` with N derived from the post-kill corpus (Q5's widening—empirically pre-cleared: identical 112-board/0-false-UNSAT on the sparse bank) |
| **Vite-plugin parse** | green — the node replica or a real `npm run build` regenerating `templates.ts` over the surviving boards (Q5) |
| wasm | lean size still under the 93,000 raw gate (87,853 B expected—the bank is not wasm-linked) |
| Record | new embed byte-count recorded (expect 32,533 B conservative) |
| N=5 grep | `git grep "N=5\|25x25\|25×25"` outside `docs/precepts/audits/`, `docs/tranches/` → zero Sudoku hits (the one legitimate survivor: `futoshiki/generate.rs:33`'s "N=5–7" is Futoshiki's own board-size N—must remain) (Q2) |

## Seeds

- [`../evidence/pass2/P1.md`](../evidence/pass2/P1.md) + `P1.diff` / `P1-source.diff` / `P1-reshape_bank.py` — the embed reshape.
- [`../evidence/pass2/P2.md`](../evidence/pass2/P2.md) + `P2.diff` — the browser-gen harness (correct its two claims per appendix A before citing).
- [`../evidence/pass3/verify-P1-P2.md`](../evidence/pass3/verify-P1-P2.md) — the re-verification + the byte-costed split this wave is authored to.
- [`../evidence/pass3/Q5-p1-gate-sufficiency.md`](../evidence/pass3/Q5-p1-gate-sufficiency.md) / [`Q2-n5-kill-blast-radius.md`](../evidence/pass3/Q2-n5-kill-blast-radius.md) — the gate widenings.

## Residual risks

- The aggressive branch stays gated on a genuine low-power device run nobody has made—**verify-then-apply** if pulled: measure N=3-hard p95 on the device first, excise second. Until then the conservative split is the wave.
- `generate_templates.rs` still accepts `N=5` as a CLI arg (Q2 §E)—retirement is enforced by data absence, not tool refusal. Soft policy-durability gap; a one-line arg-range tightening is in-scope if touched, not gating.
- Bank-format drift AFTER this wave would sail through `cargo test` (it compiles, never runs the corpus read)—the `gac_ab_corpus` gate line exists precisely for that; keep it in W-GATE too.

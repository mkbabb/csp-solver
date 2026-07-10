# Appendix A — The corrections/refutations ledger

**This ledger governs.** Never quote an original where a row here corrects it; the blacklist entries never appear in any surviving doc. Source of record: [`../evidence/32-synthesis-readiness.md`](../evidence/32-synthesis-readiness.md) §5, folded verbatim into [`../evidence/synthesis-pass1.md`](../evidence/synthesis-pass1.md) §5 with the verify-26..33 supplements, extended here with the Pass-3 additions. Unabridged.

## 1. Refuted — blacklisted as stated

From the readiness gate (12 corpus claims + 1 owner framing):

1. L03: `apiError.ts` dead-code/free-delete (LIVE — split it; the exact keep-set is pinned in [`../evidence/pass3/Q1-w2-manifest-completeness.md`](../evidence/pass3/Q1-w2-manifest-completeness.md) §C).
2. L03 §F: DNS/App-Runner "unresolved" (resolved; OD-4 executed at `d43fae28`).
3. L02: "ratios are load-robust" (low end moved 19→11 under load).
4. L09: `alloc_count.rs` "same hand-rolled binary construction" (uses `add_all_different`/GAC).
5. L12 §2a: "PyO3 boundary already int-keyed" (live path is string-keyed in Rust).
6. L16: keyframes.js KEEP (zero imports; excise — R8).
7. L21: `ci.yml:201` e2e comment (no such match — zero e2e anywhere, stronger).
8. L23 F1: stale root CLAUDE.md (phantom from the prompt snapshot; the file is current).
9. L24: lattice hang "remains live" (fixed at W2 of tranche 1).
10–11. L24: both W9 a11y "materialized risks" (fixed within W9's own landing commit).
12. L25-28: useReducedMotion retirement pending (file gone; consumers migrated) — the row is STRUCK from appendix C.
13. Owner framing: "early frontend lanes saw the old tree, late ones the new" (no frontend-sensitive lane completed pre-move).

From the supplements (verify-26..33):

14. L27's "696 B web-vs-bundler glue delta" (scratch-copy inflation; the `.wasm` is target-identical at 87,853 B — non-material).

**Pass-3 additions:**

15. P2.md: "N=3-hard is where the N=3 embed savings mostly live" (FALSE — sparse N=3-easy is 8,633 B vs N=3-hard's 3,591 B; the device-sensitive tier is the *cheapest* to keep — verify-P1-P2).
16. P2.md's "survives a 2× mobile penalty" reassurance (best-case; under same-desktop contention headroom shrinks to ~1.6×; honest phrasing: "≥2× busts" — verify-P1-P2).
17. W2-spec phrase "native mode is already the replacement — nothing to build" for `dev.sh` (native mode IS the backend launcher; the full frontend-only reduction is specified in T2-W2 — Q1 GAP 1).
18. W3-spec phrase "bbnf sync-gate check first" (inverted sequencing — the gate runs post-commit with `--update <rev>`; "semver-visible" mis-attributes the coupling axis, which is SHA-pin + byte-diff + field-set — Q6).
19. Lane-14/verify-14's "`?board=` precedence scaffolding already exists" (the *principle* transfers; the code doesn't — no board-carrying slot, no URL-built `PersistedBoard`, `hasUrl` ignores board presence — Q7).
20. Lane-14's "param accretion is cosmetic, note only" AS EXTENDED to `?board=` (holds for short tokens; does not extend to a ~256-char board blob — Q7).
21. H5(b)'s "scrollIntoView/**toast**" compression (the toast reading breaks the `role=alert` contract — WCAG 2.2.1 + interactive-content-in-transient-alert; H5(b′) is scrollIntoView-only — Q8).
22. H1 amendment bullet 3 as originally authored (a two-property override leaks five tier-2 paint properties through higher specificity, resurfacing the blue-in-red collision on exactly the focused conflict cell; `animation: none` deletes the only focus affordance — the full-declaration override in T2-W5 replaces it — Q8).
23. L28 F1's root-cause narrative — see the ledger line in §2 (the mandated Pass-3 addition).
24. P4.md's "HARD samples B/C {1:58}, {1:46}" (sample C was a MEDIUM board — every medium template is exactly 46 empties; hard is 54–59 — verify-P3-P4).
25. Residual-#7's three-item enumeration of the verify-33 delta (one short: **H10-defer** was missing; the correct four clauses are H2-elevation-only, H6 enlarge-in-place, H7→I2 swap, H10-defer; H8-centering-only needs no confirmation — Q8 §c).

## 2. Corrected — quote these values, never the originals

From the readiness gate + supplements:

perf band **~10–330×** (not 19–380×) · live-API warm **~16–24 ms**, cold ~47 ms · wasm 9×9-hard **~0.42 ms** · `allow_threads` = **9** call sites · `search.rs` = **517** · web/api tests = **12 files** · edge-served wasm ≈ **38.6 KB** (br-q11 local 32,847 B is a different thing) · dense-with-zeros files = **106** · optimal embed = **81,963 B / −72.5%** (sparse+compact) · `make wasm` = **284,009 B** at current toolchain · `pkg/` is **gitignored, not committed** · e2e "12/14" — originally a pre-HEAD W12 figure; **now measured at HEAD** (P7 baseline, re-reproduced by verify-P5-P7 with identical failing assertions) · one-shot probes = **5** · L20 doc total = **2,158 L** · session walls = **2** reset windows; hangs = **2** · L15 F7 superseded by the **42×32 px** logo-button↔toggle contention · glass-ui reka wrappers **8/9**, reka-ui **2.8.2** transitively installed · L17 measured the `d43fae28` deploy, cited `8913023e` source · embed path now `csp-solver/data/sudoku_puzzles/` · `Ordering::Chs` ≡ **Mrv-arm alias**, off both wires · glyph ceiling in `glyphPaths.ts` · escargot **~0.72 ms/iter** (L26's 0.74 ~3% high) · `assignment.rs:14` not :16 · lean z = **87,853 B** (L27 F6's 88,549 was scratch-inflated) · opt-3 lean = **123,294 B** · caret gap **41.9 / 14.4 px** not ~130 · menu **~99 px** not ~180 · L33's "two blue-boxed 5s" are **red rings around blue ink** · L32's nightly-date self-contradiction (07-09 headline vs 07-02 table; live manifest was 1.99.0-nightly 07-08 — moot once stable is pinned) · L32 doc-hit tally **9** not 6.

**The mandated Pass-3 ledger addition** (verify-P3-P4 A1, source-verified at HEAD):

> **L28 F1 root cause "draw-in phase filtered"** → the grid draw-in was NEVER filtered at HEAD (`pathsVisible` is false until the draw-in batch completes); the **erase phase + per-glyph reveal draw-ins** carry the transition grain re-raster. The 842 ms/s measurement stands.

**Further Pass-3 corrected values:**

- N=5 bank on-disk: **9 files, 35,907 B sparse** (108 KiB dense on disk); surviving sparse embed post-N=5 = **46,056 B**; per-tier N=3 sparse weights: easy **8,633 B** / medium **3,036 B** / hard **3,591 B** (verify-P1-P2, byte-exact re-run).
- `gac_ab_corpus` corpus = **112** boards; the `--n5` path reads the *already-absent* `sudoku_solutions/5/` (a different directory from the `sudoku_puzzles/5/` W4 kills) and no-ops (Q2, Q5).
- P6 run-3 wall time = **~40 s cache-warm** (~2 m cache-cold, runs 1–2) — not "~2m" (verify-P5-P7).
- P5's CDN comparison (487,300 B naive 16-file sum) — accurate at both capture dates, **shelf-life-bound**: Google re-encodes server-side; the self-hosted subset table (3,624 / 9,764 / 3,840 B) is the stable, load-bearing number (verify-P5-P7).
- P5's "zero `fonts.googleapis`/`gstatic` strings under `dist/`" — false literally (explanatory comments remain), true functionally (zero live references; zero CSP violations under instrumentation) (verify-P5-P7).
- P3's grain-hoist effect on re-verification: **−62% desktop / −56% @4×** raster (slightly larger than the −60/−50 claimed); the "+4.7 pp @4× busy" penalty did NOT reproduce (wash) (verify-P3-P4).
- P4 spoiler scope, full-bank re-derivation: **109/116 boards (100% of easy+medium at every size)** collapse to a verbatim answer key under the full-GAC op; AC-3-sans-Régin still collapses **20/20 EASY** (the default surface, `useUrlState.ts:84`); only one-pass naive is ambient-safe (verify-P3-P4).
- `_redirects` line 27 (`/*  /index.html  200`) is the **load-bearing SPA fallback** — the transport edit is a TRIM, never a delete (Q1).

## 3. Stale-echo blacklist (never quote, in any surviving doc)

"83 integration tests" · "107 Python tests" · `search.rs` 507 · "19–380×" · "~33 KB on the wire" · "0.4975 vs 0.6 ms" · the pre-`dc5bd4c4` CLAUDE.md snapshot · "futoshiki G1 0.67 ms" (does not exist in the repo — verify-30) · "0/113" (corpus is 112).

## 4. Standing quote rules

- Lane 24's "still live / materialized" verdicts: quote-only-with-reverification (grade C).
- Wall-clock ms are regimes and ratios, never SLAs (30-repro rule); any beat hard-gating on an absolute ms re-measures locally at execution time.
- The verify-then-apply authoring rule for lanes 26–33 is RELAXED wherever the verifier confirmed the number — which is nearly everywhere (7 of 8 supplements graded A, most numbers byte-exact).
- W-GATE appends the final section here; until it commits the GAC probe, the 13.36×-class ratios are inherited-trust and are cited only with that flag.

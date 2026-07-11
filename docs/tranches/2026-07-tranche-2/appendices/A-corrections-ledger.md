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

`13.36×` · `112-board` · `1.3–2.5×` — **added at T3-W2** (A11 recommendation (a)). The WGATE first-party probe retired the GAC scratch-harness figures *after* this net was authored, which is exactly how the grep hole opened; the perimeter READMEs (`README.md`, `csp-solver/README.md`) carried them as a live headline until T3-W2 retrued them to the first-party `12.6–12.7× / 50-board / 1.8–3.3×`. Three sanctioned survivals, each explanatory not live: (1) `docs/benchmarks.md`'s one flagged historical sentence (§ "GAC default-ON") — the retired figure named to say it's retired; (2) `csp-solver/CHANGELOG.md`'s dated `0.2.0` release note (`13.36×`, `26/113→0/113`) — CHANGELOG-immutable, exempt exactly as the `0/113` carve-out (§4); (3) `csp-solver/examples/gac_timing_probe.rs`'s doc-comment, the committed fix-source naming the "13.36×-class" figure it supersedes.

## 4. Standing quote rules

- Lane 24's "still live / materialized" verdicts: quote-only-with-reverification (grade C).
- Wall-clock ms are regimes and ratios, never SLAs (30-repro rule); any beat hard-gating on an absolute ms re-measures locally at execution time.
- The verify-then-apply authoring rule for lanes 26–33 is RELAXED wherever the verifier confirmed the number — which is nearly everywhere (7 of 8 supplements graded A, most numbers byte-exact).
- W-GATE appends the final section here; the GAC probe is now **committed** (`gac_timing_probe`, `ede25188`) and the aggregate is first-party (§5, "GAC aggregate — first-party close"). The 13.36×-class inherited-trust flag is **discharged**: quote the first-party 12.6–12.7× / 50-board number, not the retired 112-board scratch figure.

## 5. Execution corrections (W-GATE close)

Every number **execution itself** re-corrected — where a landed wave moved a value the authoring-time ledger (§1–3) had fixed. These are not refutations of the plan; they are the plan meeting the compiler, the byte counter, and the font subsetter. Stamped at final HEAD `c14995eb` (Apple M5 Max, 2026-07-10) unless a wave commit is named.

**Test-suite counts.**

- **Suite 150 → 151.** The Pass-1/Pass-2 baseline was `150/0/6`; the surviving suite at final HEAD is **`151/0/6`** (20 test binaries) — the net of this campaign's test add/deletes (substrate-excision deletions `nogoods.rs`/`restart_nogood_soundness.rs` minus the additions `verify_bank_uniqueness`, `gac_kernel_beats`, `all_different_except`, `solution_set_invariance`). `0 failed` was always the gate; the total is now 151. Every surviving doc quotes 151/0/6.
- **tests-py 24/2 → 27/2 (contract truing, `54aa94a5`).** The rehomed wheel-contract suite at `csp-solver/tests-py/` was authored expecting `24 passed / 2 skipped`; the W4 fixup **trued the contract to the conservative bank split** — the wheel-contract assertions that enumerate the shipped bank (tier presence, N-range refusal, sparse-parse round-trip) grew to match the reshaped 45-board / N∈{3,4} reality, landing at **`27 passed / 2 skipped`**. The blacklist entry "107 Python tests" (§3) stands; the live number is 27/2, not the pre-tranche 108/2.

**Wasm sizes — the two chains.**

- **Lean Sudoku artifact: 87,853 → 87,475 → 87,763 → 90,602 B.** Four measured points, one per force:
  - `87,853` — the tranche-1 baseline (`d9781e29`; the §2-corrected lean-z figure).
  - `87,475` — **W1 (`5f9980c8`)**, the stable-pin + `wasm-bindgen` bump: the newer bindgen emitted marginally tighter glue.
  - `87,763` — **W3 (`ed07ba6b`)**, the L26 kernel beats + Q9 battery re-added compiled context (the singletons-pool beat and the GAC-safe variants carry code); this is the figure the W4/W5 gates and the W5 re-gate all re-measured against the lean web-target build.
  - `90,602` — **W6 (`b36b7b9f`)**, the affordance/pencil-marks op surface (opt-in full-GAC marks +1,779 B plus the hint/undo/share wasm-visible surface). This is the deployed final; `benchmarks.md` is stamped to it and the lean twiggy budget (fail >93 KB) holds with ~2.4 KB headroom.
- **Full module: 210,312 → 220,554 B (hungarian/ndarray).** The authoring-time full-module figure was `210,312 B`; the T2-W3 re-measure landed **`220,554 B`** — the delta is the assignment surface's transitive **`ndarray`** pull plus the GAC Hungarian/Régin matching code compiled into the default-features build (which the lean `--no-default-features` build omits). This is the figure stamped into `.github/workflows/ci.yml` and `benchmarks.md`.
- **twiggy WARN band 215 → 230 KB (truing).** The full-module warn threshold was authored at 215 KB — below the trued `220,554 B` full build, so it would have warned on every green build. W-era truing moved it to **warn >230 KB / fail >240 KB**; both hold with headroom. The separate lean budget (fail >93 KB) is unchanged.

**Corpus count: 113 → 112 → 50 (W0 derive, W4 reshape).**

- `113` — tranche-1's static hardcoded `"0/113"` verdict string in `gac_ab_corpus.rs`.
- `112` — **W0 (`7c245bed`)** replaced the hardcoded string with a **`corpus.len()`-derived** count; against HEAD's then-dense bank the derived number was **112** (the §3 blacklist against `0/113` dates from here — "corpus is 112").
- `50` — **W4 (`22514bae`)** reshaped the bank (N=5 kill + conservative tier excision to N=3-hard + N=4); the same `corpus.len()` derivation now yields **50** boards (5 named hard 9×9 + 45 surviving templates), verdict **`0/50` PASS** in both GAC states. The corrected-reality corpus is `0/50`; the historical `112` survives ONLY as the A/B-decision-corpus prose in `benchmarks.md`, flagged inherited-trust.
- **CHANGELOG `0/113` — dated-release exemption (W0 adjudication).** The W0 literal-grep gate bans `0/113` outside `docs/tranches/`. `csp-solver/CHANGELOG.md:67` ("false-UNSAT `26/113→0/113`", the AC-3 `Unsatisfiable` trail-push fix) is **EXEMPT**: it is a dated, released changelog entry describing the soundness fix *at the corpus size that then existed*, not a live claim about the shipped bank. W0 adjudicated changelog history immutable — a dated release note is a record, not a reproducible assertion — so the grep carve-out for `csp-solver/CHANGELOG.md` is sanctioned, not a stale-echo violation.

**Fonts — the Patrick Hand defect and the total.**

- **P5 Patrick Hand subset defect → 4,312 B rebuild.** P5 (and the W5 Lane-T1 rebuild) shipped `patrickhand-subset.woff2` at **3,840 B**, cmap 44 — but the P5-authored `unicode-range` and text-file **omitted glyphs actually rendered by the affordance surface** (the `b` and `×` among them — the "×xN"/hint-copy path the W6 affordances introduced). W6 re-subset Patrick Hand against the true rendered-char set and corrected the `unicode-range`; the rebuilt face measures **4,312 B** on disk (`web/frontend/src/assets/fonts/patrickhand-subset.woff2`, +472 B). The P5 "byte-exact 3,840" row is superseded for this face.
- **Fonts total 17,228 → 17,708 B.** P5's subset total was `17,228 B` (Fira 3,624 + Patrick 3,840 + Fraunces 9,764). With the Patrick Hand correction (3,840 → 4,312) and the Fraunces timestamp-noise settle (9,764 → 9,772), the shipped total is **`17,708 B`** (3,624 + 4,312 + 9,772). Quote 17,708, not 17,228.
- **`assetsInlineLimit` inversion.** The P5 `vite.config.ts` guard was authored as `assetsInlineLimit: (f) => !f.endsWith('.woff2')` — which returns **`true` (force-inline)** for *every non-woff2 asset*, base64-inlining assets that should stay hashed files, and the intent (never inline woff2) only incidentally right. The landed form inverts it correctly: `(filePath) => (filePath.endsWith('.woff2') ? false : undefined)` — **`false` (never inline)** for woff2, **`undefined` (Vite default)** for everything else. The predicate's return-value semantics, not its condition, were the bug.

**Hardening — the H8 raster interaction.**

- **H8-centering ↔ cartoon-shadow raster.** H8 was selected as centering-only (`align-items: center` at ≥md). In execution the centering **interacted with the cartoon-shadow's `translateY(-2px)`**: the S3 layout probe measured board-center − card-center = **−2 px at 1440** — the shadow-offset, not a layout bug, but a real interaction the authoring spec didn't predict (it assumed pixel-flush centering). Recorded as within-spec (the −2 px is the shadow idiom, accepted), not a defect — but the "centering is flush" implication is corrected.

**GAC aggregate — first-party close (13.36× → 12.6–12.7×).**

The tranche's last inherited-trust number is discharged. Lane P1 authored the **committed** `csp-solver/examples/gac_timing_probe.rs` (keeper, sibling of `gac_ab_corpus`) and ran it twice at `ede25188` (`evidence/execution/T2-WGATE-gac-probe.md`, both runs quoted). The 13.36× / 112-board figure — carried from a since-deleted scratch harness — is **retired**; the first-party number is measured on the corrected-reality 50-board post-W4 corpus.

- **Aggregate 13.36× → 12.6–12.7× (12.58× / 12.73×, two consistency-checked runs).** Same class, not materially different — the GAC default-ON decision now rests on a committed, reproducible probe. Deterministic node spine: 40,513 → 4,678 (8.66× search reduction), byte-identical across runs. `benchmarks.md`'s GAC table is re-stamped to this; the retired figure survives as one historical sentence.
- **Minority cost DEEPER than disclosed: 1.3–2.5× → 1.8–3.3× slower.** The retired prose put the three slow named boards at "1.3–2.5× slower" (Al Escargot 0.50×, Golden Nugget 0.79×, Inkala 2010 0.40×). First-party measured: **Al Escargot 0.40–0.42×, Golden Nugget 0.56×, Inkala 2010 0.30–0.33×** — 1.8–3.3× slower, Inkala worst. Direction unchanged (3 of 5 named boards slower ON; aggregate win N=4-dominated), magnitude corrected upward. `benchmarks.md`'s minority-cost row quotes the measured ratios.
- **Node-count row corrected: 41,807 → 5,948 becomes 40,513 → 4,678.** The retired scratch-harness node totals were on the 112-board corpus; the first-party 50-board corpus yields the deterministic 40,513 → 4,678, host-independent and reproduced byte-exact across both runs.

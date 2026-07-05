# W13 — Docs rewrite: the doc-truth ledger

**Last-but-nothing: after the code, one pass, all of it.** Pass-1 G6 catalogued docs lying about code across three CLAUDE.md files, both READMEs, and `docs/`; three passes added corrections the docs don't know about yet. Voice discipline: **`README.md` keeps its archaic-academic register (reserved for it alone); every CLAUDE.md goes pithy house-style**—no unsubstantiated claims, no comparison sentiments, numbers with machine/commit stamps.

**Dependencies**: after all code waves (each item below cites the wave that makes the true sentence true). **Effort**: M (1–2 days).

---

## The doc-truth ledger

| # | Lie / drift (as measured) | Truth source | Fix rides |
|---|---|---|---|
| 1 | GAC "runs on Sudoku" pre-tranche (docs/algorithms.md, docs/sudoku.md)—it ran at forward-checking strength; **and** the Pass-1 causal story itself inverted: the AssignmentBuilder win was the `AcFc→Ac3` wiring (~2,670×), not incrementalization (1.2–1.6×) | Pass-2 D1; `pass3/gac-default-on.md` | W2 makes GAC-on true; write the corrected narrative, both halves |
| 2 | `builder/assignment.rs` doc-comment says `Pruning::AcFc`; code uses `Ac3` | `pass3/builder-ac3-x-morph-lazy.md` §6 | fixed in W2; verify here |
| 3 | `web/api/CLAUDE.md` documents a deleted `app/solver/` package + "107 Python tests" in 6 ghost files (real: 21 pre-tranche) | [`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §3.2 | W4 did the minimal fix; full tree rewrite here |
| 4 | Root `CLAUDE.md`/README command blocks still `cd python`/`cd frontend` (pre-`web/` layout); "83 Rust tests/7 files" (real at closure: 176 across 26 binaries) | Pass-1 G6/D2; [`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §1 | regenerate counts with commit stamps |
| 5 | Futoshiki advertised (`main.py:17` + root docs), no surface | W10 ships the surface | **the ad becomes true—better than deletion** (ratification superseded Pass-1 P8) |
| 6 | Performance claims: docs/benchmarks.md non-reproducible (Platinum claimed 2.57 ms vs 0.44 ms measured; the 7–57× headline non-apples-to-apples); the Pass-2 profile "10–25%" band refuted at load | Pass-1 docs-accuracy; `pass3/profile-numbers-and-ci-cost.md` | rewrite with the W3 posture: what IS proven, machine + commit stamped; disclose the GAC 9×9 minority cost (3/5 named boards 1.3–2.5× slower) and the ~1.8× al_escargot criterion delta alongside the 13.4× aggregate |
| 7 | Difficulty casing policy undocumented (SCREAMING_SNAKE canonical vs idiomatic per-site casing—the exact trap the hardened test guards) | `pass3/difficulty-sixth-definition.md` | document the policy + the `SCAN_ROOTS` extension rule next to the test |
| 8 | Deploy topology: docs describe the dead NCSU deployment; nothing describes A+C | W5/W6 as-ratified | rewrite deploy docs to the shipped topology |
| 9 | "Patched into bbnf-lang via `.cargo/config.toml`"—it's a vendored byte-identical copy pinned at a rev, now with an enforced-compile sync gate | Pass-1 G6; W12 | describe the real mechanism + the `--verify` contract |
| 10 | Phantom components (PencilCursor, SpiralSun); `DarkModeToggle` "50s rotation" comment vs 240 s keyframe; `web/frontend/CLAUDE.md` boil amplitudes 0.8/0.5 vs actual 0.6/0.3; ANIMATION.md grain scale 3.5 vs 2.5, wobble 450 vs 550 ms; dead `DRAW_IN_PRESETS` documented as live | `pass2/design-refinement.md` §7 | W9 deleted the dead config; docs align to source values |
| 11 | `py.rs`/`lib.rs` docstrings claiming isomorphism to a deleted Python solver; wasm README "solveAssignmentCop lands in a future commit" (it shipped) | Pass-1 G6 | rewrite against the W1 tree |
| 12 | `csp-solver/CLAUDE.md` "Zero inline tests" vs the live, correct `error.rs` exception | [`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §2.4 | amend to the two-discipline statement (blackbox `tests/` always; narrow whitebox `#[cfg(test)]` for private contracts) |
| 13 | Directory trees in all three CLAUDE.md files predate the colocation | W1/W4/W7 shapes | regenerate |
| 14 | `max_solutions=1` semantics undocumented (valid-but-different first solution under Ac3 is unspecified behavior) | [`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §7.2 | document at every `max_solutions` surface |
| 15 | Morph provenance after excision | [`morph-excision-spec.md`](../evidence/morph-excision-spec.md) §1.3 | csc411 CHANGELOG trims to the two staying artifacts + forward pointer; the `pre-morph-excision` tag documented |

## Acceptance gate

**Every number cited in any doc traces to a campaign artifact** (this tranche's `evidence/` or the scratchpad reports they cite)—test counts, benchmark values, sizes, percentages, all with commit + machine stamps where they're measurements. A reviewer greps each numeric claim against its named source. MEMORY.md's isomorphism preference: root `CLAUDE.md` and `README.md` state the same facts in their two registers.

## Seed artifacts

- Pass-1 `docs-accuracy.md` + `git-archaeology.md` (the original catalogue), `pass2/design-refinement.md` §7, and the rows above.

## Residual risks

- Doc drift resumes the day this wave ends—the standing mitigations are the contract tests (difficulty parity, taxonomy) and the sync-gate tripwires, which turn the worst drift classes into CI failures instead of prose rot.

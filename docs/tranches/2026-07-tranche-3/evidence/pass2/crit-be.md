# crit-be — REFUTE-BY-DEFAULT critique of the BE cluster (P2-L7, P2-L8)

**Posture:** refute by default; re-derive where cheap. **Targets:** `pass2/P2-L7.md` (W-C authoring
gate), `pass2/P2-L8.md` (P6/Q9 disposition). **Method:** verified gate outputs against the persisted
worktrees + real HEAD `3b75eca2` (not prose). Every row below carries the command that decided it.

**Bottom line: the BE cluster survives the refutation pass nearly intact.** No claim REFUTED. One
mechanism CORRECTED (cosmetic). The load-bearing arithmetic (P2-L7's 12+2+1 count) and the byte-identity
proof (P2-L8) both re-derived clean by direct inspection. The agglomeration's propagated "13 demotions"
is dead — P2-L7's correction to 12 is confirmed independently.

---

## 1. P2-L7 — verifications

| # | Claim | Verdict | Evidence (this pass) |
|---|---|---|---|
| L7-1 | Worktree `wf_977ec162-15b-7` at HEAD `3b75eca2`, clean start | **CONFIRMED** | `.claude/worktrees/wf_977ec162-15b-7` present; `git -C … rev-parse` = `3b75eca2` = repo HEAD |
| L7-2 | Diff = **12 files, +23 −92**, `adjacency.rs → solver/adjacency.rs` a pure rename | **CONFIRMED (exact)** | `git diff --stat` = 12 files, +23 −92; `--name-status` shows `R100 adjacency.rs → solver/adjacency.rs` |
| L7-3 | Ratified count is **12+2+1, not 13+2+1** | **CONFIRMED by direct re-derivation** | The diff's `pub→pub(crate)` pairs enumerate exactly **12** distinct symbol demotions (below), **2** deletions, **1** rename. The agglomeration's 13 (§S9/§0-A0-1) is off by one. |
| L7-4 | The 12 demotion symbols + sites | **CONFIRMED** | Diff pairs: BitsetWorklist(+`::new`), ac3_full, GAC_CORE_CALLS, propagate_monotonic, ZeroCost, CostDomainEval, PropResult, PERMANENT_DEPTH, SearchParams(+5 fields), feasibility_search, branch_and_bound = **12** |
| L7-5 | 2 removals genuinely dead | **CONFIRMED** | `propagate_stratified`: zero callers repo-wide (grep, def only) AND in bbnf — bbnf's own audit flags it "FLIP → DELETE, Zero callers" (`POST-CLOSE-B-substrate.md:56`). `Csp::adjacency()`: zero `.adjacency()` callers repo + bbnf |
| L7-6 | Relocation + 5 importer rewrites; 6th ref dissolves with the accessor | **CONFIRMED** | `pub mod adjacency` (lib.rs) → `pub(crate) mod adjacency` (solver/mod.rs) in diff; accessor deletion (`csp/solve.rs:271-274`) carries the 6th ref |
| L7-7 | `private_interfaces` lint (not E0446) forces items 10–12; `&Adjacency` independently forces them | **PLAUSIBLE** | Not re-triggered this pass; mechanism sound, matches crit-P5's label correction; the demoted param types (`&mut BitsetWorklist`, `&SearchParams`, `&Adjacency`) are visible in the three signatures |
| L7-8 | Full merge bar GREEN (build/clippy/test/queens/py/wasm×2) | **PLAUSIBLE (not re-run)** | Not independently re-run (cost + shared-target contention with the live audit). Substantiated indirectly: diff is visibility-only + 2 verified-dead removals + a rename — no logic edits; both removals confirmed zero-caller. Low risk, but a refute-posture critique cannot stamp CONFIRMED without the run. |
| L7-9 | `cargo doc` **pre-broken at HEAD**; **CI never runs it** | **CONFIRMED** | Ran `cargo doc --no-deps -p csp-solver` at HEAD → errors (`links to private item config`/`csp`/`csp::solve`/`seed_latin_square`/`matching`/`GacScratch`…). `grep -rn 'cargo doc\|rustdoc' .github/workflows/` → **nothing** |
| L7-10 | The lint is "**deny-by-default**" | **CORRECTED (cosmetic)** | rustdoc's own note: `-D rustdoc::private-intra-doc-links` **implied by `-D warnings`** — i.e. a warn-level lint promoted to error by an active `-D warnings` rustdocflag, not deny-by-default. The observable ("plain `cargo doc` fails at HEAD") stands; disposition unaffected |
| L7-11 | Sweep adds 3 new doc errors (branch_and_bound/ZeroCost/CostDomainEval now `pub(crate)`); PERMANENT_DEPTH error disappears | **CONFIRMED (mechanism)** | `optimize.rs:4-6` docs link `[crate::solver::search::branch_and_bound]`, `[ZeroCost]`, `[CostDomainEval]` — all three demoted ⇒ 3 new private-link errors; PERMANENT_DEPTH demoted ⇒ its `SEARCH_ROOT_DEPTH` link no longer public-docs |
| L7-12 | `gac` split premise stale — Tarjan **already** extracted | **CONFIRMED** | `tarjan_scc` at `gac/matching.rs:102` (`pub(super)`). The charter's "Tarjan SCC half out" is a dead seam |
| L7-13 | `gac/mod.rs` (555) split → `scratch.rs` substrate; anatomy | **CONFIRMED (anatomy)** | GacScratch:81, MAX_FAST_INDEX:120, fast_index:128, thread_local:170, with_scratch:177, propagate_gac_core:204, propagate_inner:218, finish_all_consumed:510, resize_tarjan:549 — all match L7's line map. Split is a real, visibility-neutral seam |
| L7-14 | `search.rs` **waiver** — a B&B split would re-widen the private kernel | **CONFIRMED (decisive fact)** | `trait SearchPolicy` (166) and `fn search` (182) are **private** (no `pub`); `Kernel` is `pub(crate)` (75); `branch_and_bound` at 444. Extracting B&B to a sibling forces 166/182 to `pub(super)` — a real encapsulation regression during an encapsulation tranche. The waiver argument holds |

### P2-L7 count re-derivation (the load-bearing correction)

Direct from `git diff HEAD` in the worktree, every `-pub … / +pub(crate) …` pair (excluding the module
relocation and the 5 SearchParams sub-fields, which ride items 1-reloc and 9 respectively):

```
1 BitsetWorklist   2 BitsetWorklist::new   3 ac3_full        4 GAC_CORE_CALLS
5 propagate_monotonic  6 ZeroCost          7 CostDomainEval  8 PropResult
9 PERMANENT_DEPTH  10 SearchParams(+5 fields)  11 feasibility_search  12 branch_and_bound
```
= **12 demotions**; deletions `propagate_stratified` + `Csp::adjacency()` = **2**; rename = **1**.
**12+2+1 stands; the agglomeration's 13 is dead.**

---

## 2. P2-L8 — verifications

| # | Claim | Verdict | Evidence (this pass) |
|---|---|---|---|
| L8-1 | `before` ≡ `afterB2` compiled sha `ce4c092b50…86d0fa7` | **CONFIRMED** | `shasum -a256` both = `ce4c092b50a271e8472e1dfa82d6467e4f01a745a58a05f3d08eef21986d0fa7` |
| L8-2 | `afterB` (pre-fix broken) sha distinct `42c6c83f…` | **CONFIRMED** | `shasum` = `42c6c83fa817520a43b3bd94f12f534cfadff0ac154a1a2b30e42c8e36a0a186` — a real debug cycle, not a fabricated pass |
| L8-3 | probe_baseline ≡ probe_split sha `fac05b99…`, 13,269 B | **CONFIRMED** | both `fac05b992cb8b54…`; `ls` both 13269 B |
| L8-4 | Hold text `C-deferred-foldin.md:108`: FE maintainer, HELD W8 `c14995eb`, against an **SFC `<style>` extraction**, lift on "cascade-layer proof or a visual-diff pass" | **CONFIRMED** | Row reads verbatim: *"a cascade-layer proof or a visual-diff pass lifts the hold — HELD at W8 (`c14995eb`)… an SFC `<style>` extraction changes their cascade layer…"* Owner = FE maintainer ✓ |
| L8-5 | current `index.css` = 454 lines, monolithic | **CONFIRMED** | `wc -l` = 454 |
| L8-6 | Partials 216 / 160 / 73 + 5-line manifest | **CONFIRMED** | `wc -l` theme=216, utilities=160, print=73, index=5 (449+5=454) |
| L8-7 | index.css becomes a **pure `@import` manifest**; `@font-face` moves into theme.css | **CONFIRMED** | manifest is 5 pure `@import` lines; theme.css carries the 3 `@font-face` |
| L8-8 | `../fonts/` rebase at `theme.css:42,51,60` (load-bearing) | **CONFIRMED** | `grep "url('../fonts"` → :42 fraunces, :51 firacode, :60 patrickhand |
| L8-9 | Font-URL smoke guard BUILT + PASS/FAIL/PASS | **CONFIRMED (built) / PLAUSIBLE (3-state)** | `assert-font-urls.mjs` present; logic sound by inspection (RESOLVED regex for `url(/assets/…-<hash>.woff2)`, LEAK regex for relative/literal `fonts/….woff2`, `exit 1` on leak/count-miss). The against-3-real-builds table not re-run this pass |
| L8-10 | HMR parity + dev `curl` HTTP 200 for `../fonts/` | **PLAUSIBLE (not re-run)** | prod byte-identity is proven via L8-1/L8-2 shas; the live dev-serve + curl-200 + HMR-log claims not re-executed (needs a live vite server) |
| L8-11 | Identity is **empirical minified-output**, not "by construction"; PRT arm byte-only | **CONFIRMED (honesty carry)** | correctly restates crit-P6 K24/K25; 449+5=454 closes only under whitespace normalization — the report says so |
| L8-12 | Both branches author-ready; Q9/KISS owner gates externalized to orchestrator | **CONFIRMED (governance)** | ACCEPTED branch artifacts all present (`p6-accepted/{assert-font-urls.mjs, partials/…}`); REJECTED branch = HELD-again record with default-drop. Owner gates honestly not claimed as obtained |

---

## 3. Kill list

1. **Agglomeration "13 demotions"** (§S9, §0-A0-1, and the P2-L7 charter line) — **DEAD**. Direct diff
   re-derivation yields **12** `pub→pub(crate)` symbol demotions. P2-L7's self-correction to 12+2+1 is
   confirmed; the wave text + 0.4.0 semver stanza must read **12+2+1**.
2. **P2-L7's "rustdoc::private_intra_doc_links is deny-by-default"** (P2-L7 §3, line ~102) — **CORRECTED**.
   rustdoc's own diagnostic says the deny is *"implied by `-D warnings`"* — a warn-level lint promoted by
   an active rustdocflag, not a deny-by-default lint. Cosmetic: the redness-at-HEAD observable and the
   W-G disposition are untouched. Fix the one clause in the wave text.

No other claim in either lane was refuted or corrected.

---

## 4. Convergence — per-deduction arithmetic

Baseline 100 (refute-posture: deduct for anything not fully re-derived by this critique, plus any
correction):

| Deduction | Reason | −pts |
|---|---|---|
| Merge bar not independently re-run | P2-L7's load-bearing GO claim (build/clippy/test/queens/py/wasm×2); diff verified coherent + both removals verified dead, so low risk — but a refute pass can't stamp CONFIRMED unrun | −6 |
| `private_interfaces` forcing not re-triggered | Mechanism sound, crit-P5-corroborated, signatures inspected | −2 |
| cargo-doc "deny-by-default" mechanism imprecise | CORRECTED, cosmetic (redness reproduced) | −1 |
| P2-L8 font-URL guard 3-state not re-run | Guard code verified sound by inspection | −2 |
| P2-L8 HMR + dev-curl-200 not re-run | Prod byte-identity independently confirmed via shas | −2 |

**100 − 6 − 2 − 1 − 2 − 2 = 87.**

Reading: both BE-cluster lanes are exceptionally well-evidenced. Everything cheaply re-derivable
(the 12-count, the diff shape, the two dead removals, the stale-Tarjan premise, the private-kernel
waiver fact, all four p6 shas, the hold text, the partial shape + rebase) re-derived **clean**. The 13
points withheld are un-re-run gate outputs (merge bar, guard 3-state, HMR) and one cosmetic correction —
not defects in the lanes' reasoning. The owner gates (Q9/KISS, R7a/b, `propagate_stratified`
remove-vs-wire-in) are honestly externalized, not counted against the lanes.

---

*crit-be, PASS 2. No refutations; one cosmetic correction; the "13" is dead. BE cluster GO stands at 87%.*

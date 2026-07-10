# crit-coherence — REFUTE-by-default critique of the PASS-2 corpus as a whole + P2-L3

**Lane:** `crit-coherence` · PASS 2 · adversarial coherence/fairness pass.
**Targets:** the eight pass-2 lanes (P2-L1…L8) read against each other, the three sibling
critiques (crit-be/fe/py), and the P2-L3 owner memo specifically (internal coherence, fairness of
its pre-arguments). **Method:** re-derive contradictions from the persisted worktrees where cheap,
not from prose. **Posture:** refute by default — I hunt for what the lanes contradict, what the memo
mis-states, and where the corpus over-builds against its own KISS bar.

**Bottom line:** the corpus is *technically* sound (the sibling crits already priced the per-cluster
openness: be 87 / fe 85 / py 78) but has **two live cross-lane contradictions and one owner-facing
factual error** that no single-cluster critique caught, because each stayed inside its cluster. The
coherence gap is concentrated exactly at the seams the eight lanes share. **Convergence 76.**

---

## 1. The findings (most-severe first)

### C1 — P2-L3's "13-demotion" is factually wrong; the same pass re-derived **12**. CORRECTED.

The owner memo (P2-L3) row (e) asks the owner to ratify "**the 13-demotion 0.4.0 semver**" — the
string "13" appears three times: the row header (`P2-L3.md:183`), the question body (`:185` "demotes
13 symbols to `pub(crate)`"), and the summary ballot (`:362`). **But P2-L7 and crit-be, written in the
same pass, both re-derived 12** and explicitly killed the "13" as an agglomeration propagation error
(crit-be kill #1: "Agglomeration '13 demotions' — DEAD"; P2-L7 §2: "the ratified count is **12+2+1,
not 13+2+1**").

I re-derived it independently from the persisted L7 worktree
(`.claude/worktrees/wf_977ec162-15b-7`, working tree vs HEAD `3b75eca2`). The distinct top-level
`pub → pub(crate)` symbols are exactly twelve: `BitsetWorklist`, `BitsetWorklist::new`, `ac3_full`,
`GAC_CORE_CALLS`, `propagate_monotonic`, `ZeroCost`, `CostDomainEval`, `PropResult`, `PERMANENT_DEPTH`,
`SearchParams` (+ its 5 fields), `feasibility_search`, `branch_and_bound`. The two removals
(`propagate_stratified`, `Csp::adjacency()`) appear in the `-pub` minus-set and are **absent** from
the `+pub(crate)` additions — deletions, not demotions. **12 + 2 + 1 confirmed to the symbol.**

Worse, P2-L3 is **internally inconsistent**: its own enumerated list in the row-(e) body
(`:193-196`) names only **eleven** symbols — `BitsetWorklist, SearchParams(+5 fields), PropResult,
propagate_monotonic, PERMANENT_DEPTH, ZeroCost, CostDomainEval, GAC_CORE_CALLS` (=8) `+ 3 forced`
(=11) — it omits `BitsetWorklist::new` that P2-L7/crit-be count to reach 12. So the memo states "13,"
enumerates 11, and the truth is 12. **A ratification memo is the one document where the count must be
exact** — the owner is signing a semver-major surface change against a number that matches neither its
own list nor the re-derived diff. This is not cosmetic in an owner-facing artifact.

**Verdict: CORRECTED.** Fix all three "13" sites in P2-L3 to **12**, and reconcile the row-(e)
enumerated list to the twelve-symbol table in P2-L7 §1 (add `BitsetWorklist::new`). crit-be flagged
the "13" for the agglomeration and P2-L7 charter line but **did not check that P2-L3 still carries
it** — that cross-lane check is this lane's.

### C2 — Shared-home: P2-L5 (`games/shared/`) vs P2-L6 (`src/composables/`), both declaring closure. REFUTED-as-closed.

P2-L5 R6(c)/Q7 rules that cross-game logic "consumed by **both games only, never pencil**" goes to a
**NEW `src/games/shared/`** (`P2-L5.md:91-93`), and declares R6(c) "closed." P2-L6 finding #1/#3
**placed `useUndoHistory.ts` + `usePencilMarks.ts` in `src/composables/`** and declares R13 "closed."
I re-derived the placement from the L6 worktree:
`.claude/worktrees/wf_977ec162-15b-6/web/frontend/src/composables/{useUndoHistory,usePencilMarks}.ts`
— both present in `src/composables/`, neither in `games/shared/`.

Those two composables are the *exact category* P2-L5's rule routes to `games/shared/`: consumed by
both games' composables, never by pencil. **By P2-L5's own stated rule they belong in
`games/shared/`, not `src/composables/`.** Both lanes claim their scope is settled while prescribing
incompatible homes for the same file category. This is a genuine live authoring blocker: W-E (P2-L5)
and W-F (P2-L6) cannot both author as-written. P2-L6 finding #3 flags the tension honestly ("P2-L5's
decision to ratify"), so it is not concealed — but "flagged" ≠ "closed," and P2-L6's own verdict
line says "R13 is **closed**." crit-fe independently caught this (its kill #1, −8). I **confirm** it
as a corpus-level contradiction; it survives refutation.

**Verdict: REFUTED (the "both closed" claim).** One rule must be ratified before authoring. Note the
`useButtonAnimation.ts` case P2-L5 defers (`:119-122`) sits in the same rule's blind spot — it is
also games-only-never-pencil yet routed to "W-F/owner," compounding the unruled category.

### C3 — P2-L3 row (a) reclassifies `PropagationStrategy` → **ratify**, reversing "settled" S4 and P2-L4's applied prune. Unreconciled.

Agglomeration S4 (and synthesis §1.2) treat the py `PropagationStrategy` enum as **unconditionally
pruned**, riding the same commit as the dead-symbol sweep ("its sole remaining use dies with
`propagate_with`… removal rides the same commit"). P2-L4 **applied that deletion** in its spike
(`P2-L4.md:22` "the py `PropagationStrategy` enum" removed). Yet P2-L3 row (a) recommends the
four-class rule under which "`PropagationStrategy` → **ratify** (capability, class iv) — this
**corrects the spec's unconditional prune**" (`P2-L3.md:46`).

The memo is *right* to surface the spec's inconsistency (a capability-bearing enum was being pruned by
the same reflex as a redundant getter). But the corpus never reconciles the consequence: **if the
owner adopts rule 1, S4 is reopened, and P2-L4's stub surface is wrong** — the hand stub's `__all__`
(the "exactly 15 names") and the pruned-surface premise both assume `PropagationStrategy` is gone.
P2-L4 does say its conclusions are "surface-invariant" w.r.t. the *futoshiki* prune (§0), but it does
**not** cover the `PropagationStrategy` reclassification — that enum being kept changes the shipped
py surface and the stub's `__all__`. The memo's own recommendation destabilizes a K-ledger "settled"
item that a sibling lane already built against.

**Verdict: CONFIRMED (a real unreconciled cross-lane dependency).** Not a defect in the memo's
reasoning — it's a defect in the corpus treating S4 as closed while P2-L3 recommends reopening it.

### C4 — pyproject version sequencing re-introduces the S6 lag bug. CONFIRMED (mechanical).

W-A's packaging-truth fix (S6) stamps `pyproject.toml` `0.2.0 → 0.3.0` to match the current crate
(P2-L4 diff table, `P2-L4.md:184`). But W-B+W-C bump the **crate** to **0.4.0** (P2-L3 row e; P2-L1
§2 "the core 0.4.0 W-B+W-C surface"). **No lane states that `pyproject.toml` must then advance to
0.4.0 alongside the crate.** If it stays at 0.3.0, the maturin wheel again stamps a version behind the
crate — *exactly the S6 defect the tranche fixes* ("maturin currently emits a 0.2.0-labelled wheel
from a 0.3.0 crate"). The corpus fixes the lag at 0.2→0.3 and silently re-opens it at 0.3→0.4.

**Verdict: CONFIRMED.** Low severity (one-line wave edit), but a real coherence gap: the version
triple in flight — pyproject (0.3.0), crate (0.4.0), wasm package (0.4.0) — is unaligned, and the
alignment discipline S6 establishes is not carried forward to the crate bump.

### C5 — KISS tension: heavy stub infrastructure (P2-L4) vs the no-PyPI recommendation (P2-L3 f). Unreconciled.

P2-L4 builds a full stub-hygiene apparatus: a CI stubtest lane, a `stubtest_allowlist.txt`, a
module-name/stub-stem tripwire, a declared `__all__`, and an opt-in abi3 feature. P2-L3 row (f)
recommends "**No PyPI intent; abi3 CI-only; drop abi3t**," on the reasoning that adding forward-compat
surface for an absent consumer is against every tranche instinct (`P2-L3.md:241`). Those two are not
contradictory — the stub still types tests-py and editors — but they sit in visible tension: the
memo's KISS logic ("a feature flag with no wheel to carry it is documentation, not capability")
applies with nearly equal force to a **CI stubtest lane defending an unpublished wheel's type surface**.
The corpus over-invests in packaging SOTA (R1's deficit list) for an artifact the same corpus
concludes will never be distributed. Neither lane reconciles the two postures.

**Verdict: CONFIRMED (KISS tension, not a contradiction).** Defensible either way; flagged because a
refute-posture coherence pass must note where the corpus's own KISS bar is applied unevenly — heavy on
py packaging, KISS-strict on abi3t.

---

## 2. Fairness audit of the P2-L3 pre-arguments (the memo's charter obligation)

The memo's remit is "each row pre-argued with evidence both ways so the owner answers in one sitting."
I checked each row for strawmanning, pre-loaded recommendations, and hidden circularity.

| Row | Both-sides fair? | Note |
|---|---|---|
| (a) surface rule | **Fair** | The "line is arbitrary" counter is given real teeth (the `PropagationStrategy` mis-sort), and the recommendation *adopts* that counter rather than dismissing it. Good-faith. |
| (b) futoshiki_api | **Fair but circular-by-design** | The recommendation (remove) hinges on (f)=no-PyPI, which the memo *also* recommends — so the memo recommends the (f) answer that defangs (b)'s strongest counter. The circularity is **disclosed** ("Sequence (b) after (f)"; the counter "evaporates if f = never-PyPI"), so it's honest, not a trick. The keep-and-test side is stated at full strength ("the compile gate is structurally incapable of voting"). |
| (c) sudoku_board/template_count | **Fair** | The "future notebook user gets a more austere API" counter is real and stated; recommendation rebuts on zero-users + git-revival. |
| (d) propagate_stratified | **Fair** | Wire-in is given the strongest treatment ("the substantive option the others dodge"). Recommendation (remove + backlog) is consistent with P2-L7's applied deletion. |
| (e) 13-demotion semver | **Unfair by error, not by argument** | See C1 — the *count* is wrong. The both-ways argument (deprecation cycle vs bump) is fair; the factual premise the owner ratifies is not. |
| (f) PyPI intent | **Fair** | "Self-fulfilling prophecy" counter stated; rebutted on "a flag with no wheel is documentation." |
| (g) CspError::Timeout | **Fair, and the consistency objection is met** | The memo *removes* `propagate_stratified` (d) but *reserves* `Timeout` (g) — both "complete-but-unwired." The distinguishing principle (Timeout's `code()` string is consumed live at 3 other surfaces; propagate_stratified has zero consumers anywhere) is a real, fairly-stated line, so the asymmetry is principled, not arbitrary. The strongest counter ("reserved-for-future is the speculative-surface argument the tranche rejects everywhere") is stated and answered. |
| (h) mod.rs rename | **Fair** | Both "defer = never happens" and "keep motivations separate" stated. |

**Fairness verdict:** the memo's *argumentation* is genuinely even-handed — it repeatedly adopts its
own counters (a, d) rather than knocking them down, and it discloses its one circular dependency
(b→f). The single fairness failure is **factual, not rhetorical**: row (e) asks for ratification of a
miscounted surface (C1). Fix the number and the memo is fair throughout.

---

## 3. Inter-lane consistency ledger (what the eight lanes agree / disagree on)

| Seam | Lanes | Coherent? |
|---|---|---|
| Demotion count | P2-L7=12, crit-be=12, **P2-L3=13** | **NO** (C1) |
| Shared-home for cross-game composables | P2-L5=`games/shared/`, **P2-L6=`src/composables/`** | **NO** (C2) |
| `PropagationStrategy` disposition | S4/P2-L4=prune, **P2-L3(a)=ratify** | **NO** (C3) |
| `propagate_stratified` = remove | P2-L7 (applied), P2-L3(d) (recommend) | YES |
| `futoshiki_api` prune is owner-gated, not settled | P2-L4 §0, P2-L3(b), crit-py KP3 | YES |
| wasm excision is BREAKING → bump | P2-L1, crit-py | YES |
| bbnf gate green on combined diff | P2-L2, crit-py, crit-be (cites bbnf's own audit) | YES |
| `CspError::Timeout` kept (py arm S5 + core variant g) | S5, P2-L3(g) | YES |
| Version stamps aligned across pyproject/crate/wasm | P2-L4=0.3.0, P2-L1/P2-L3=0.4.0 | **PARTIAL** (C4) |
| Byte-identity is empirical-minified, not by-construction | P2-L8, crit-be, agglomeration K24 | YES |
| Re-measure gate integers in-wave (K10/K18) | every lane | YES |

Nine of twelve seams cohere. Three break (C1, C2, C3) and one is partial (C4) — all at the exact
boundaries where two lanes' outputs must compose.

---

## 4. Overengineering / KISS scan (against the tranche's own bar)

- **P2-L8 font-URL guard** — net-new CI machinery whose "sole purpose is to defend a change with no
  behavioral upside" (P2-L8's own words, §3.2). **Self-aware, not incoherent** — P2-L8 surfaces it as
  the drop rationale. No deduction; the honesty is exemplary.
- **P2-L4 stub apparatus vs no-PyPI** — C5, the one genuine KISS tension. Flagged.
- **P2-L5 `games/shared` boundary tripwire** — self-flagged optional ("a tripwire, not a fix"). Fine.
- **P2-L7 `gac/mod.rs → scratch.rs` split** — 555 LOC over the 500 budget; visibility-neutral seam;
  justified. Not overengineering.
- **P2-L7 `search.rs` waiver** — the *anti*-overengineering call (refuses a split that would re-widen
  private kernel surface). Correct restraint.

The corpus mostly holds its KISS line; the one uneven application is C5 (heavy py packaging, strict
abi3t).

---

## 5. Convergence — per-deduction arithmetic

Baseline 100 (coherence of the pass-2 corpus + P2-L3 as a composable whole; deduct per incoherence
that survives refutation):

| # | Deduction | Reason | −pts |
|---|---|---|---|
| C1 | P2-L3 "13-demotion" wrong (re-derived 12; own list names 11); owner-facing ratification doc contradicted by P2-L7+crit-be same pass | material factual incoherence in a signing document | −8 |
| C2 | Shared-home contradiction (P2-L5 `games/shared` vs P2-L6 `src/composables`), both declaring closure; re-derived from L6 worktree | live authoring blocker | −7 |
| C3 | P2-L3(a) reclassifies `PropagationStrategy`→ratify, reversing "settled" S4 + P2-L4's applied deletion; stub `__all__` consequence unreconciled | unreconciled cross-lane dependency | −4 |
| C4 | pyproject 0.3.0 (W-A) never advanced to 0.4.0 with the crate; re-opens the S6 lag bug | mechanical version-alignment gap | −3 |
| C5 | Heavy stub/stubtest/tripwire infra vs no-PyPI recommendation; KISS bar applied unevenly | unreconciled KISS tension | −2 |

**100 − 8 − 7 − 4 − 3 − 2 = 76.**

Reading: the corpus's argumentation and evidence are strong — the P2-L3 memo is fair row-by-row
(§2), nine of twelve inter-lane seams cohere (§3), and the KISS line mostly holds (§4). The 24 points
withheld are **not** technical defects the sibling crits missed on the merits; they are the
*composition* failures that appear only when the eight lanes are read against each other: a stale
count in the owner memo, two incompatible file-home rules each declaring closure, one recommendation
that reopens a "settled" item, and a version-alignment discipline dropped one bump short. All four are
cheap to fix and none refute a lane's core finding — but all four **must** be reconciled before
authoring, because each sits on a seam two waves share.

---

## 6. kill_list (must reconcile before authoring)

1. **P2-L3 "13-demotion" → 12** at `P2-L3.md:183,185,362`; reconcile the row-(e) body list (`:193-196`)
   to P2-L7 §1's twelve-symbol table (it currently names 11). The re-derived truth is **12 + 2 + 1**.
2. **Ratify ONE shared-home rule** before W-E/W-F. If P2-L5's `games/shared/` rule wins,
   P2-L6's `src/composables/{useUndoHistory,usePencilMarks}.ts` MUST relocate there (they are
   cross-game-only, never-pencil — the exact category P2-L5 routes to `games/shared/`). Do not author
   both lanes as-written. Also resolve `useButtonAnimation.ts` under the same rule.
3. **Reconcile P2-L3(a)'s `PropagationStrategy`→ratify with S4 + P2-L4.** If the owner adopts rule 1,
   S4's "unconditional prune" is reopened and P2-L4's stub `__all__` (and the pruned-surface premise)
   must be re-derived to keep `PropagationStrategy`. Flag the dependency in the wave DAG.
4. **Advance `pyproject.toml` to 0.4.0** with the crate in W-B/W-C, not just to 0.3.0 in W-A, or the
   S6 wheel-version lag re-appears.
5. **(Advisory)** Reconcile the P2-L4 stub apparatus against P2-L3(f)'s no-PyPI: keep it (tests-py
   types justify it) or trim it, but state the call — don't leave the KISS bar applied unevenly.

---

*crit-coherence, PASS 2. Two cross-lane contradictions (C1 count, C2 shared-home) re-derived from the
persisted worktrees; one reopened-settled-item (C3); one version gap (C4); one KISS tension (C5). The
P2-L3 memo is fair in argument, wrong in one count. Corpus coherence 76 — author-blocked on five
reconciliations, none of which refute a lane's core finding.*

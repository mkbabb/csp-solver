# T4-WGATE — Lane V: the recertification (adversarial, trusts no lane)

Verdict: **RED** — one specific, in-remit TRUTH-TRACE defect (§2, D6 mod.rs lint id). All
other four gates hold exactly. The defect is a single mis-cited clippy lint identifier in a
terminal ledger row whose *disposition* is otherwise correct; the fix is one token.

Gate SHA (tree of record, measured at HEAD, nothing checked out):
`d70073f30c827d8acebbc1df2388900f29d880b9` — `git rev-parse HEAD` confirms this is the working
tree. CI run of record: `29449438899` (master, `conclusion: success`, 11/11 jobs).
Record under test: `WGATE-record.md` + `evidence/wgate/g2-counts.md`.

---

## Probe 1 — LEDGER COMPLETENESS (enumerated independently)

Enumerated every seeded item from the spec (`T4-WGATE-record-recert.md`) and all 15 families
from `evidence/registry/families.md`; matched each to exactly one terminal row in the record.

| Class | Spec/registry items | Record home | Verdict |
|---|---|---|---|
| DISEASE rows (2+ closes) | prettier global-shadow · W8 mount idle-chunking | §3.1 (2 rows) | COMPLETE, no dup |
| Orphan deferrals | core 0.4.0 publish · mod.rs flip · GPU tile residue · propagate_stratified · keyframes.js · bbnf cadence | §3.2 (6 rows) | COMPLETE, no dup |
| Estate-truth closures | 9 phantom dependabot · java branch · 44 worktrees · v0.3.0/pre-morph · repo bloat B1 | §3.3 (5 rows) | COMPLETE, no dup |
| x1 tier + non-goals | editable marks · error-check · auto-candidates · peer-unit · attribution parity · non-goals | §3.4 (4 rows) | COMPLETE, no dup |
| 15 families | FAM-1 … FAM-15 | §3.5 (15 rows) | COMPLETE — FAM-12 CLOSED-here |
| Ballots | B1 … B5 | §4 (5 rows) | COMPLETE, no dup |

No missing item; no duplicated row; no re-booked (reopened-DECIDED) entry. Every row carries
its re-entry criterion. Every cited wave (W0-W14, WM, WU) exists in `waves/`. **HOLDS.**

## Probe 2 — TRUTH TRACE (14 rows sampled vs cited wave execution records)

Verified each citation against the cited wave file's execution record (not just the spec
section). 13/14 trace exactly; **1 fails**.

| Row | Cited file · claim | Verify | Verdict |
|---|---|---|---|
| prettier DISEASE | W4 §Prettier DISEASE — .prettierrc.json 2-space, --check, plugin live | W4:64-68,132 | TRUE |
| W8 idle-chunking (D7) | W1 exec — retired-with-measurement 89ms@1×/355ms@4× | W1:148 | TRUE |
| core 0.4.0 publish | W0 exec — 0.4.0 published, 147 files, max_version 0.4.0 | W0:125 | TRUE |
| GPU tile residue (D4) | W1 exec — N-layer bake, 0.08/s, superseded | W1:142,148 | TRUE |
| propagate_stratified | W13 ROW 8 — grep-empty, cages are revise_impls, retire | W13:74-76 | TRUE |
| keyframes.js | W11 — six doubled keyframes → one file each | W11:127 | TRUE |
| 9 phantom dependabot | W0 — #50-58 dismissed not_used (422 on no_longer_relevant) | W0:118 | TRUE |
| java branch STAYS | W0 — reversal registered B §5, delete-orders struck | W0:119 | TRUE |
| 44 worktrees pruned | W0 — 44 pruned, wf_34cf008e KEPT | W0:122 | TRUE |
| v0.3.0 tag / pre-morph | W0 — annotated v0.3.0 → 3b75eca2, pre-morph resolved | W0:123 | TRUE |
| x1 tier rows 1-5 | W8 ROWs 1-5 — marks/check/candidates/peer/attribution | W8:11-41 | TRUE |
| non-goals retire | W8 ROW 6 — dailies/stats/pressure DECIDED-retire | W8:50-52 | TRUE |
| B4 new-game set | W13 — Thermo+Killer+KenKen ratified; crosswords retire | W13:132-136 | TRUE |
| **mod.rs flip (D6)** | W4 §mod.rs flip — "`self_named_module_files` clippy lint locks it" | W4 exec:130; Cargo.toml:61 | **FALSE — see RED-1** |

Seal chain — every SHA on master (`git branch --contains`), all 33 probed present:
W0 `429e7983` · W1 `c78cee9d` · W2 `0ea30223` · W3 `7393e7df` · W4 `54b1bcb5`(+`c1dc6f20`) ·
W5 `33066681`(+`8c6af343`) · W6 `d4faa412`(+`602c8de9`) · WM `b8acf3f7`(auth `c2dd6476`, add
`098de1c9`,`3b587b86`) · W7 `6cad6327`(+`7e03c5dc`) · W9 `8875d261` · W8 `df013a36` · WU
`766aa068`(auth `ae2517c2`) · W10 `7d51f562` · W11 `38d3f223` · W13 `f8950257` · W12 `3781ec14`
(+`1056cb18`,`826f16e3`) · W14 `d70073f3` · handoffs `ba98c2bf`,`b9cbb92b`. All exist on master.

CI runs (`gh run view --json conclusion`): `29449438899` (gate) success/11 jobs ·
`29219288631` (W0) success · `29229784491` (W5) success · `29291214817` (W10) success.
**HOLDS except RED-1.**

## Probe 3 — COUNTS (spot re-run, must match g2-counts.md exactly)

| Figure | Re-run command | Measured | g2-counts | Verdict |
|---|---|---|---|---|
| rust triple | `cargo test --workspace` (agg 28 groups) | 208 / 0 / 0 | 208/0/0 | MATCH |
| e2e static | `grep test( e2e/*.spec.ts / ls *.spec.ts` | 83 / 13 files | 83/13 | MATCH |
| bank | `find … \| wc -l` / `cat … \| wc -c` | 45 / 32,095 B | 45/32,095 | MATCH |
| lean wasm | `wc -c pkg/*.wasm` | 121,855 B | 121,855 (darwin) | MATCH |
| goldens | `ls e2e/goldens/*.png` | 8 (4 pairs) | 4 pairs | MATCH |
| versions | source manifests | crate/wasm/pkg 0.5.0 · py 0.4.0 · pb ^0.9.2 | same | MATCH |
| gate CI | `gh run view 29449438899 --json jobs` | 11 jobs, all success | 11 green | MATCH |

Every spot-re-run reproduces g2-counts.md exactly. Gate CI is 11 jobs, all `success`. **HOLDS.**

## Probe 4 — GATE-GRAMMAR

- Certification (§8) discloses the stopping rule as **near-quiet, not literal zero** ("P2s
  ceased at round 3; P3 dust asymptotes at ~1-2 per pass … a literal-zero pass … would launder
  the stopping rule"). Matches `families.md` r5 certification. TRUE.
- Owner reminders (§7) are **actions carried, none blocks the close** — explicit. TRUE.
- Every BANKED row (§5, 7 rows) carries a named re-entry trigger. TRUE.
- No row books to a nonexistent wave (all W0-W14/WM/WU exist). TRUE.
- G2's two flags (F-1 e2e 83 static/82 executed; F-2 pyproject 0.4.0 lag) are booked as
  terminal version-truth rows (§2), not silent reconciliations. TRUE. **HOLDS.**

## Probe 5 — META-LEAK containment (product docs only; docs/tranches/** exempt)

Re-ran the W14 enforcement grep over the shipped product set:
```
grep -rniE 'tranche|WGATE|T[0-9]-W|\bW[0-9]+\b|campaign|muster|grand-uplift' \
  README.md docs/*.md csp-solver/README.md csp-solver/CHANGELOG.md \
  csp-solver/wasm/README.md csp-solver/wasm/CHANGELOG.md \
  csp-solver/csp_solver.pyi web/frontend/public/_headers
→ exit 1 (ZERO matches)
```
Zero across every shipped product doc + `.pyi` + both CHANGELOGs + `_headers`. The WGATE
authoring leaked nothing into the product set. **HOLDS.**

---

## RED-1 — §3.2 D6 mis-cites the enforcing clippy lint (TRUTH TRACE)

**Location:** `WGATE-record.md:82` (§3.2, the `mod.rs → self-named-file flip` row).

**Claim in the record:** "10 `mod.rs` flipped to self-named files + **the `self_named_module_files`
clippy lint locks it**."

**Ground truth (working tree at the gate SHA):**
- `Cargo.toml:61` enforces `mod_module_files = "deny"`.
- `Cargo.toml:54-60` explicitly warns the id is counterintuitive: in clippy 1.97
  `mod_module_files` **bans** mod.rs, while `self_named_module_files` does the **opposite**
  (REQUIRES mod.rs) — "do NOT flip this to `self_named_module_files` — that would force the
  mod.rs layout back."
- `find csp-solver/src -name mod.rs | wc -l` → 0 (the flip landed; disposition is correct).

**Contradiction with the cited file:** the row cites `T4-W4-excision.md §mod.rs flip`. W4's
**execution record** (`T4-W4-excision.md:130`) already corrected this exact inversion: "the
spec's lint name is INVERTED on clippy 1.97 — `self_named_module_files` *requires* mod.rs; the
true lock is `mod_module_files = "deny"` … **D6 closed with the corrected id**." The terminal
WGATE record regressed to the un-corrected (spec-draft) id that W4's own outcome struck.

**Impact:** an auditor following the terminal record to reproduce the lock would grep for
`self_named_module_files`, find it absent from the config (and a comment stating it enforces
the opposite layout), and be misled. This is precisely the auditability harm WGATE exists to
prevent. The *disposition* (mod.rs banned + locked by a clippy lint, flip landed) is true and
verified; only the lint identifier is wrong.

**Fix (one token, team-lead to seal — V does not modify the record):** in
`WGATE-record.md:82`, `self_named_module_files` → `mod_module_files` (matching W4:130 and
`Cargo.toml:61`).

---

## Verdict

**RED.** Four of five gates hold exactly (ledger completeness, counts, gate-grammar,
meta-leak) and 13/14 truth-trace samples trace clean; the seal chain (33 SHAs) and CI runs (4)
verify. The single defect is RED-1: a mis-cited clippy lint id in the terminal ledger row D6
that the cited wave file's own execution record already corrected and the working tree
contradicts. In-remit (TRUTH TRACE), specific (`WGATE-record.md:82`), one-token fix. No other
in-remit reds found. V did not modify the record or commit.

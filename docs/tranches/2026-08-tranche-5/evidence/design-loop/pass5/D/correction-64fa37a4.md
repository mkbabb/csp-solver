# CORRECTION NOTE — beside commit `64fa37a4`, and beside the pass-4 Lane-D dossier

**Pass 5, Lane D · 2026-08-02 · tree `66fa5856` · no history rewrite.**

Pass-4 work order (1), verbatim: *"republish the flake rates from the logs (6/11 · 5/11) and
amend the record where `64fa37a4`'s body errs — a correction note beside the commit, no history
rewrite."* This is that note. The commit stands as written in git; what it says about the flake
rate is corrected here, and every figure below is the stdout of an instrument that anyone can
re-run — `pass5/D/rig/crest-rate-tally.mjs`, banked at `pass5/D/logs/crest-rate-tally.log`.

---

## 1 · THE COMMIT'S OWN SENTENCE

`64fa37a4` — *"T4-P1 Lane D pass 4: re-mint logo-light's darwin baseline"*, 2026-07-31 21:43:07
−0400 — closes with:

> Beside it, corrected on the record: `toggle-crest-dark` was NOT re-baselined and must not be.
> It is green 6/6 in pass 3's banked logs and **green 6/8 here, reding twice at 1028 px** — the
> number the pass-3 dossier quoted was real, its "deterministic" was not.

Two claims, and they do not fare alike.

| the commit says | the logs say | verdict |
|---|---|---|
| green **6/6** in pass 3's banked logs | BASE r1–r3 3/3 green · HEAD r1–r3 3/3 green = **6/6, 0 red** | **CORRECT** — re-derived, unchanged |
| green **6/8** here, **reding twice** | the eight post-remint runs on disk at that moment (`gates-golden-AFTER-r1r2r3.log` 1g/2r + `gates-golden-AFTER-r4r8.log` 4g/1r) = **5 green / 3 red** | **WRONG by one, in the flattering direction** |

The correction: **5/8 green, 3 red — not 6/8 green, 2 red.** The reds are r2, r3 and r4; the
greens are r1, r5, r6, r7, r8. Nothing else in the commit body is disturbed: the re-mint's own
evidence (6/6 deterministic 3948 px across two trees, scoped `-g "logo wordmark"`, 11/11 after,
`golden:bytes` PASS) re-derives exactly as written, and the ruling it carries — *`toggle-crest-dark`
was not re-baselined and must not be* — is correct and is now the team lead's standing row 8.

The pass-4 critique also charged that the two logs "predate the commit by two minutes". That
ordering is **not re-derivable from the tree today** — the logs carry no timestamps and every
file in the banked set shares one checkout mtime. It is left as the critique's observation, not
restated here as fact. What is re-derivable is the count, and the count is what the row was for.

## 2 · THE DOSSIER'S TABLE — the same error, one run later

`pass4/D-report.md:76` (§2's table) and `:299` (§10's sweep) both publish
**✓ 7/11 · ✘ 4/11**, and §2 quotes *"~36%"* off it. The eleven post-remint runs on disk read:

| run | log | toggle-crest-dark |
|---|---|---|
| r1 | `gates-golden-AFTER-r1r2r3.log` | ✓ |
| r2 | `gates-golden-AFTER-r1r2r3.log` | ✘ |
| r3 | `gates-golden-AFTER-r1r2r3.log` | ✘ |
| r4 | `gates-golden-AFTER-r4r8.log` | ✘ 1028 px, ratio 0.03 |
| r5–r8 | `gates-golden-AFTER-r4r8.log` | ✓ ✓ ✓ ✓ |
| FINAL-1 | `gates-FINAL-e2e.log` | ✘ |
| FINAL-2 | `gates-FINAL-e2e.log` | ✓ |
| FINAL-3 | `gates-FINAL-e2e.log` | ✘ |

**6 green / 5 red, n = 11 — a red rate of 45.5%, not ~36%.** The pass-4 registry already
published the corrected pair; this note anchors it to the runs and the files it comes from.

## 3 · TWO MORE RECORD DEFECTS FOUND WHILE COUNTING

**(a) `.margin-note` is not the surface ship 4 re-pitched.** `pass4/D-report.md:§5` row 4 names
`.margin-note`; the rule that carries the ink is **`.margin-note-meta`** (`MarginNote.vue:169`).
`.margin-note` is the strip and it declares no colour of its own. The new ship-4 census was run
FIRST with the dossier's name, and it went red naming the surface — the transcript is
`pass5/D/logs/gate-ship4-BORN-RED.log`, run 2. Corrected in the gate, corrected here; the pass-4
dossier is annotated rather than rewritten.

**(b) `chronic-ledger.md:96`'s "12/25 vs 19/25" does not reconcile to anything.** CH-42's ledger
row cites that pair for the pristine-tree arm. The r3 goldens-estate audit already flagged it
(`audit/r3/goldens-estate.md:156,377` — *"reconciles to no pair of arms above… marked UNKNOWN"*),
and a full walk of every banked crest log in the corpus confirms it: no arm, and no union of
arms, has denominator 25. The derivable arms are the ten in `logs/crest-rate-tally.log`. This is
**not Lane D's row to edit** — the chronic ledger is the r1 audit's file — so it is flagged to
the agglomerator with the replacement table attached, and it is a NEW GAP, not a closure.

## 4 · THE REPUBLISHED RATES, all of them, from the logs

```
arm                                   green   red     n   red-rate   what it is
pass3 MEASURE · BASE r1..r3              3     0     3      0.0%   pre-remint, base dist
pass3 MEASURE · HEAD r1..r3              3     0     3      0.0%   pre-remint, pass-3 HEAD
pass4 D · pre-remint BEFORE              1     0     1      0.0%   the run that opened pass 4
pass4 D · POST-REMINT (the row)          6     5    11     45.5%   D published 7/11 · 4/11
pass4 D · the 8 on disk at 64fa37a4      5     3     8     37.5%   the commit body's 6/8
pass4 MEASURE · head r1..r8              8     0     8      0.0%   non-author, same host, same day
pass4 F3 · final HEAD 1..14              9     5    14     35.7%   F3's rate arm
pass4 F3 · final NO-OP 1..14            11     3    14     21.4%   F3's no-op control arm
pass4 F3 · final BASE 1..7               7     0     7      0.0%   F3's base arm
pass4 A · gates-goldens                  1     0     1      0.0%   Lane A's single sweep

W3-verify · W3 dist (6 runs)     OVER 1 · under-floor 2 · byte-identical 3 · worst 1028 px
W3-verify · HEAD CONTROL (6 runs) OVER 5 · under-floor 0 · byte-identical 1 · worst 1028 px

POOLED across the pass-4 host-day: 43 green · 13 red · n=56 · 23.2%
```

Three things this table settles that no prose in four passes has:

1. **The lead's row 8 re-derives.** "5/6 breach on an unchanged tree, worst 1,028 px" is exactly
   the HEAD-control line — five of six runs over the 0.017 floor, one byte-identical.
2. **MEASURE's arm is the outlier that matters.** 0 red in 8, on the same host, the same day, on
   the same subject, while D read 5 in 11 and F3 read 5 in 14. Three instruments cannot disagree
   this far about a tree; they can disagree this far about a session. That is the sun-crest
   clause's claim, measured.
3. **The pooled 23.2% is printed and disowned in the same breath.** Pooling assumes the arms are
   exchangeable, which is precisely what session-sensitivity denies; it is an upper bound of
   record for the pass-6 audit to argue with, and it authorises nothing.

**NO rate here authorises a re-baseline.** CH-42 is WATCH-ONLY; the lead's row 8 restates it;
the disposition is unchanged (branch-C crop-tighten POST-W4).

## 5 · WHAT WAS AMENDED, AND WHAT WAS NOT

| record | action |
|---|---|
| git history / `64fa37a4`'s body | **untouched** — the order says no history rewrite, and a commit message is not a document you edit |
| `pass4/D-report.md` §2, §10 | **annotated** with an ERRATUM block pointing here; the wrong figures stay visible so the erratum is auditable |
| `pass4-registry.md` | untouched — it already publishes 6/11 · 5/11 correctly |
| `audit/r1/chronic-ledger.md:96` | **not edited** (another author's file) — flagged as a new gap with this table attached |
| this pass's dossier | publishes 6/11 · 5/11 and every arm above, sourced to a re-runnable instrument |

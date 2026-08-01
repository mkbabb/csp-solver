# T5-W0 rows 0.6 + 0.8—record closures

Six rows whose dispositions live outside the in-tree record: banked-and-forgotten (CH-16),
memory-only adjudications (CH-34, CH-60), a pair of sealed records that contradict each other
(D6), and two recap asks the T5 audit read as un-homed (U-07, U-08). Each closes here with its
citation chain.

**HEAD** `e961bdb7` (2026-08-01 14:03:48 -0400). Every figure below is re-derived from the
artifact at that HEAD—the command's in the row, not the prose it came from. Where the
re-derivation contradicts the audit that raised the row, the contradiction is the finding.

**Lane footprint**: this file plus `ledger-diff-after-closures.txt`. No sealed record is
rewritten; the supersessions are written here, citing the superseded row (T5-W0's own rule).

| Row | Disposition | §  |
|---|---|---|
| CH-16 `?board=` permalinks | **SPLIT**—persistence CLOSED-landed `f8950257`; permalink **OPEN**, the audit's "landed" refuted | §1 |
| CH-34 murmur paint-damage | **CLOSED**—T4-W1 QUALIFIED-GREEN lifted in-tree verbatim | §2 |
| CH-60 D-M3 authority overstep | **CLOSED-record**—the ratification + no-precedent clause lifted in-tree verbatim | §3 |
| D6 / D7 / W8 idle-chunking (CH-21) | **DECIDED-retire-with-measurement** stands; T4 `README.md:223`'s FOLD superseded | §4 |
| U-07 "kill all crons" | **CLOSED** at T4-W0 `429e7983`; the audit's zero-grep is pre-W0 | §5 |
| U-08 deploy-workflows clause | **CLOSED** at T4-W0 `429e7983`; subsumed by `65425697`, connection drawn | §6 |

---

## 1. CH-16—`?board=` permalinks for thermo/killer/kenken

**The row as banked.** `docs/tranches/2026-07-tranche-4/WGATE-record.md:175`—
`| ?board= permalinks for thermo/killer/kenken | the v1 localStorage / permalink extension to
the three new games |`.

**The row as audited.** `evidence/audit/r1/chronic-ledger.md:55` and its §4 gap #1 (`:200`)
call it **LANDED, never recorded closed**, on the evidence that
`{thermo,killer,kenken}*UrlState.ts` all exist. `evidence/audit/r2/prompt-recap-matrix.md`'s
second record-integrity note repeats it.

**Re-derived at HEAD—the landing claim is half true, and the audit read the half that isn't.**

The three files exist and were added whole in one commit:

```
git log --diff-filter=A --format='%h %ad %s' --date=short -- <each file>
  f8950257  2026-07-15  T4-W13: the new games — Thermo proves the contract, …
```

Their own headers refuse the permalink:

| File | The refusal | `boardLink` | `writeShareUrl` |
|---|---|---|---|
| `web/frontend/src/games/thermo/composables/thermoUrlState.ts` | `:7-8` "The `?board=` share permalink is NOT yet wired for Thermo" | `:77` hard `"absent"` | `:108` empty body |
| `web/frontend/src/games/killer/composables/killerUrlState.ts` | `:8-10` same, for Killer | `:78` hard `"absent"` | `:109` empty body |
| `web/frontend/src/games/kenken/composables/kenkenUrlState.ts` | `:8-10` same, for KenKen | `:78` hard `"absent"` | `:109` empty body |

And the estate has exactly two readers of the parameter—neither is a new game:

```
grep -rn 'get("board")' web/frontend/src            → 2
  src/games/sudoku/composables/useUrlState.ts:136
  src/games/futoshiki/composables/useUrlState.ts:166
```

**Disposition—SPLIT.**

- **CLOSED-landed**: the localStorage half of the banked row. Per-game persistence under a
  game-own key shipped at `f8950257` (T4-W13); a thermo/killer/kenken board round-trips a
  reload. That's the "v1 localStorage" clause of `WGATE-record.md:175`, and it closes.
- **OPEN**: the permalink half. `?board=` is unwired for all three games, said so in each
  file's own prose, and the trigger stands as banked.

**The class.** File presence was taken for feature presence—proxy≠surface, the first family
in `memory/lessons-from-t2-t4.md`. The cure is the same shape as the rule: the gate reads the
surface (a `?board=` reader), never the file. `chronic-ledger.md:55`, `:200` and the
matrix's record-integrity note are **superseded by this re-derivation** on the permalink half;
their record-gap finding stands on the persistence half.

---

## 2. CH-34—the murmur's full-viewport paint damage

**The gap.** `chronic-ledger.md:83` and §4 gap #2 (`:201`): the only disposition lives in the
team lead's memory ledger, never in-tree. Lost file, re-litigable rejection.

**Lifted verbatim** from `~/.claude/projects/…/memory/t4-formulation-2026-07-12.md:25`
(T4-W1, "ADJUDICATIONS (mine, to record at seal)"), unedited:

> murmur = QUALIFIED-GREEN (grain re-raster disease cured, 56×56/0.01ms cell paints; residual
> ~2.7/s 0.069ms root bookkeeping records disclosed — literal zero needs cell layer promotion,
> REJECTED: 81 compositor layers vs 0.19ms/s)

**In-tree state at HEAD.** The murmur itself is live and unchanged in kind—
`web/frontend/src/pencil/composables/celebration.ts:2` (beat 3, the classroom murmur), `:14`
(the lone-transient ambient floor), `:25-29` (`murmurCells`, the felt heart's seat). The
mechanism the adjudication disclosed then died by another route: P1-W3 deleted the glyph
reference filter outright at `6b8c1ffd` (2026-07-31), recorded at
`web/frontend/src/pencil/glyph/HandwrittenGlyph.vue:50-51`—"the glyph's `url(#grain-static)`
reference filter and the whole `grainOn` hoist apparatus are GONE"—which
`evidence/audit/r1/perf-disposition.md:44` (p1-7) reads as the murmur's grain re-raster dying
with the filter.

**Disposition—CLOSED.** The T4-W1 adjudication is now in-tree at this line. The cell-layer
promotion stays REJECTED at the number it was rejected on (81 compositor layers against
0.19 ms/s); reopening it wants a new measurement, not a new argument.

---

## 3. CH-60—D-M3, the re-baseline authority overstep

**The gap.** `chronic-ledger.md:124` books CH-60 as an OPEN **record row** beside the ratified
re-baseline (CH-43, `:97`). The ratification and its no-precedent clause live only in memory.

**Lifted verbatim** from `memory/t4-formulation-2026-07-12.md:107` (pass-4, "TEAM-LEAD
EXECUTED"), unedited:

> logo-light darwin re-baseline **RATIFIED** (6/6 two trees, 11/11 after; breach stays booked
> D-M3, no precedent)

**The in-tree half already written.** The finding and the recommendation are in the tree—
only the ruling was missing:

- `evidence/design-loop/pass4-registry.md:33-36` (D-M3 maj): the re-baseline "EXECUTED by the
  lane against pass3-registry §2's words ('not any lane') and §4 row 6 ('team-lead election');
  absent from all seven work orders. Strongest evidence in the campaign (6/6 two trees, scoped
  re-mint, 11/11 after, MEASURE 8/8), election cited in the commit — authority, not
  concealment. **Ratification owed**".
- `:258-263` (§5 row 6): "Team lead ratifies or reverts `64fa37a4`'s baseline byte; this
  registry recommends RATIFY, with the process breach already booked as D-M3 — the same act
  may not be cited as precedent for lane-executed re-baselines."
- `64fa37a4` re-derived: 2026-07-31, "T4-P1 Lane D pass 4: re-mint logo-light's darwin
  baseline — 6/6 deterministic red across two trees, including the seal".

**Disposition—CLOSED-record.** Ratified; the breach stays booked; no precedent. A
lane-executed re-baseline still wants a team-lead election beforehand, and this act can't be
cited for one. The forward rule—where a standing no-precedent clause belongs—is W6's
process row, not this file's to write.

---

## 4. D6—the D7/W8 pair carrying opposite dispositions

**The defect.** Two in-tree T4 records close the same row against each other
(`evidence/audit/registry.md:39`; `evidence/audit/r1/perf-disposition.md:39`, p1-2, and its
headline `:204`):

| Site | Date of the record | The disposition, verbatim |
|---|---|---|
| `docs/tranches/2026-07-tranche-4/README.md:223` (§7 addendum, "the pre-execution performance audit (2026-07-12, owner-ordered)") | 2026-07-12, **before execution** | "The 16×16 deal hitch is render-bound, not worker-bound, firing at ~680ms unthrottled on WebKit — the D7/W8-idle-chunking disease row therefore resolves **FOLD into W1's raster-stack mount path**, not retire." |
| `docs/tranches/2026-07-tranche-4/WGATE-record.md:75` (§3.1 DISEASE rows) | 2026-07-15, **at the seal** | "**DECIDED-retire-with-measurement**—the raster-stack bake IS async off the mount burst; the fallback grid geometry keeps cold mount at 89 ms@1× / 355 ms@4×, banked as the do-not-reopen-without-mid-device-trace rationale. No third close" |

**The adjudication of record**, `memory/t4-formulation-2026-07-12.md:25` (T4-W1, same
ADJUDICATIONS clause as §2 above), verbatim:

> D7 = RETIRE-WITH-MEASUREMENT (89ms@1x/355ms@4x banked, bake IS async)

**T5 disposition—DECIDED-retire-with-measurement, one disposition, no third close.**

The FOLD was a pre-execution proposal resting on a premise W1 then measured away: fold the row
into the raster-stack mount path, said the addendum. W1 measured that the bake is already async
off the mount burst—there's no mount-path work left to fold it into. What survives is the
fallback grid geometry at 89 ms@1× / 355 ms@4×, banked as the do-not-reopen floor with its
trigger (a mid-device above-band trace) at `WGATE-record.md:176`. The seal-day record supersedes
the pre-execution one on ordinary grounds: it's later, it's the record of record, and it carries
the measurement.

**`README.md:223`'s FOLD clause is SUPERSEDED** by `WGATE-record.md:75`—cited, not rewritten.
The sealed T4 files stay as sealed; this line is the supersession.

**What doesn't reopen it.** The P1 patch attributed a drawer stall to the grid raster-stack
re-bake (79–195 ms `createImageBitmap` ×4, `evidence/audit/r1/perf-disposition.md:116`,
DNB-14). That's CH-51, which `chronic-ledger.md:115` calls "adjacent, not the same row". The
do-not-reopen floor governs D7/W8 until its own trigger fires.

**The live row.** CH-21 (`chronic-ledger.md:65`)—HELD (healthy), trigger unfired, 2 rides
pre-decision and 3 post. It stays open as a *held* row, and its home is the living ledger
(W6's `docs/tranches/LEDGER.md`), not this file. See §7.

---

## 5. U-07—"Kill all crons, too."

**The ask.** E6, 2026-07-12—
`docs/tranches/2026-07-tranche-4/evidence/corpus/owner-prompts.md:33`.

**The T5 audit row.** `evidence/audit/r2/prompt-recap-matrix.md:341` (and PR-094 at `:154`):
"`grep -rin "kill all cron" docs/tranches/` → **0**. Enumeration-closed at T4-W0 (`CronList`
empty) but homed by no recap row."

**Re-derived at HEAD—the grep is a pre-W0 number, and the recap row exists.**

```
grep -rin "kill all cron" docs/tranches/ | grep -v evidence/w0/record-closures.md   → 20
  14 in the T4 tranche (README:145 · corpus · r1 recap ×6 · w0 gates · the W0 wave file ×5)
   2 in T3's appendix B (`:120`, `:121`)
   4 in the T5 audit itself
```

(This file is excluded from its own grep—it adds 5 hits of its own, and a record that counts
itself proves nothing.)

The home: `docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md:121`, verbatim—

> | **E6 · crons** | 2026-07-12 | *"Kill all crons, too."* | enumerated at T4-W0 open
> (2026-07-12): zero live jobs (`CronList` empty); prior authoring-cron kill = WGATE
> `CronDelete efaae137`; the ask is closed by enumeration |

Landed at `429e7983` (T4-W0, 2026-07-12 22:19:50 -0400)—
`git show 429e7983 -- …/B-prompt-recap.md` shows the row added there. The audit that produced
the zero is `b8772f5c` (2026-07-12 20:20:35 -0400, the T4 pre-execution audit;
`evidence/r1/r1-prompt-recap.md:139` records the grep), and
`git merge-base --is-ancestor b8772f5c 429e7983` confirms it's the ancestor. The row landed one
hour fifty-nine minutes after the grep that missed it. The T5 audit re-cited the figure instead
of re-running it—the "numbers re-derived at citation" rule, and its second bite.

Corroborating in-tree: `docs/tranches/2026-07-tranche-4/README.md:125` ("all crons killed at
E6; no cron armed in T4") and `:145` ("crons killed").

**Present-day enumeration, for the record.** `CronList` in this lane returns exactly one job—
`1bc8d5b2`, session-only, "T5 EXECUTION HEARTBEAT (auto, non-duplicative — the only cron)",
created by the T5 orchestration itself. Repo-side there's nothing scheduled:
`grep -rniE "cron|schedule:" .github/` → 0, across the one workflow file (`ci.yml`).

**Disposition—CLOSED.** Executed at T4-W0 by enumeration, homed at `B-prompt-recap.md:121`
since `429e7983`. `prompt-recap-matrix.md:341`'s "homed by no recap row" clause is **superseded
by this re-derivation**; its enumeration clause stands.

---

## 6. U-08—"deploy workflows to specify"

**The ask.** T3-2's middle clause, 2026-07-10.

**The T5 audit row.** `evidence/audit/r2/prompt-recap-matrix.md:342` (and PR-076 at `:136`):
"`grep -rin "deploy workflow" docs/tranches/2026-07-tranche-3/` → **0**. Subsumed *de facto* by
`65425697`; the connection is nowhere drawn."

**Re-derived at HEAD—one hit, and it's the connection.**

```
grep -rin "deploy workflow" docs/tranches/2026-07-tranche-3/    → 1
```

`docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md:123`, verbatim—

> | **T3-2 · deploy-workflows** | 2026-07-10 | *"deploy workflows to specify"* (the T3-2
> sub-ask) | subsumed by the `npm run deploy` pipeline (wrangler 4.110.0 pinned, `65425697`);
> contract doc trued at `docs/precepts/infra/deploy.md` (T4-W0) |

Same commit as U-07's row, `429e7983`, and the same stale-citation mechanism behind the zero.

**The specification the clause asked for**, re-derived:

- `65425697` (2026-07-12)—"deploy pipeline: pin wrangler 4.110.0 + npm run deploy — the npx
  packument OOM root-caused and closed". Touches `web/frontend/package.json`,
  `package-lock.json`, and the T3 README.
- `web/frontend/package.json:32`—`"deploy": "npm run build && wrangler pages deploy dist
  --project-name=sudoku --branch=master --commit-dirty=true"`; `:61`—`"wrangler": "^4.110.0"`.
- `docs/precepts/infra/deploy.md` (the `docs/precepts` submodule at `8781ebb06c03`)—the one
  command (`:9-19`), the `npx` trap and its root cause (`:21-25`), project/branch/static-output
  contract (`:27-35`), auth and the explicit no-CI-deploy clause (`:37-41`: "there's no CI
  deploy step — the push doesn't ship, the owner runs `npm run deploy`"), rollback (`:43-53`).
- No deploy job exists to specify further: `grep -rn "pages deploy" .github/` → 0, and
  `.github/workflows/` holds one file (`ci.yml`).

**Disposition—CLOSED.** The clause is discharged by the pinned pipeline (`65425697`) and the
precept that writes it down; the connection was drawn at T4-W0 (`429e7983`).
`prompt-recap-matrix.md:342`'s "the connection is nowhere drawn" is **superseded by this
re-derivation**.

---

## 7. What this file moves in the ledger-diff, and what it doesn't

`scripts/ledger-diff.mjs:268-276` builds its disposition corpus from
`docs/tranches/2026-08-tranche-5/waves/*.md` + that tranche's `README.md` (+ `docs/tranches/
LEDGER.md` when present). `evidence/` isn't corpus—by construction, since an audit file that
discharged its own rows would be the record verifying the record.

So the arithmetic doesn't move, and it shouldn't:

- **CH-16, CH-34, CH-60, U-07, U-08** were never orphans. Each is cited by
  `waves/T5-W0-truth-and-record.md` rows 0.6/0.8 (R1 CORPUS). This file is the substance those
  citations point at—the tool checks that a row is named, and naming was never the whole debt.
- **CH-21** (§4's live row) *is* an orphan in the dry-run, and it stays one. Its disposition is
  HELD-healthy with an unfired trigger, and a held row's home is the living ledger—W6's
  `LEDGER.md`, per the triage's own reading. Forcing it green from W0 would be exactly the
  ceremony U-11 indicts.

Before and after: **34 orphans, 220 rows, exit 1**—identical, banked at
`ledger-diff-dryrun-at-HEAD.txt` and `ledger-diff-after-closures.txt`. The other 33 belong to
W5's decide wave and W6's ledger (23 CH − CH-21 = 22 CH, 7 PR, 4 U); they're listed in the
after-run and are not this row's to close.

---

## Traps

The T4 traps ledger (`docs/tranches/2026-07-tranche-4/WGATE-record.md` §6) is sealed, so a new
trap isn't appended there. It's named here and rides forward into W6's `LEDGER.md`.

**D11—deployment-id-in-commit-position.** Cloudflare Pages hands back an 8-hex id shaped
exactly like an abbreviated SHA. Cite one in commit position and every later audit greps it as
a commit, finds nothing, and reads a false gap. That's not hypothetical: it's what
`chronic-ledger.md:203`, `prompt-recap-matrix.md:348-350` and `registry.md:96` each caught
independently.

**Derivation.** `git cat-file -t`, against this repo's own object database, not against prose:
`f1adfca5`, `a8174110`, `781fc09c` all answer *fatal: Not a valid object name*, while the
seals and trees cited beside them in the same sentences—`6800af04`, `52ef014a`, `95b2efd8`,
`71456713`, `c9cd957a`, `23e3dc00`—every one resolves to a commit. The asymmetry is the tell.

**The class is wider than its three named members.** `cce0ffd1`, `0275562b` and `c90d9e06`
resolve to nothing either; they happen to carry deployment vocabulary at every in-tree
citation, so they needed no cure, and that's checked rather than assumed. `7cadf462` heads
`MEMORY.md:6` in commit position and appears nowhere in the tree—a memory-only row, row 0.9's
to true up.

**Cure, this wave.** 13 sites across 8 files took the deployment noun ahead of the id—"CF
deployment `f1adfca5`"—label-only, nothing else moved. The before/after grep, the word-diff,
and the gate run sit in `evidence/w0/deployment-id-sweep.txt`, counts re-derived from the diff
rather than asserted. Nine lines of pre-existing record (twelve occurrences) stand
un-relabeled by enumerated exemption—verbatim quotations, `git` transcripts, and the
statements of the defect itself—each with its reason written out in the sweep; a tenth, the
derivation line just above, joins them for the same cause. One sealed record took a
correction, `patches/p1-safari-ios-performance/waves/p-w4-validate-deploy.md:77`, ordered by
row 0.7 and confined to the label. Occurrences: 31 before, 35 after, the delta being the four
this trap row quotes into being. Net of them the count is flat—the cure inserts words, it
never adds or drops a citation.

**Enforced by.** `gates.json` → `gates.WGATE.deploymentIdVocabulary: true`, with
`waves/T5-WGATE.md:13` binding the close—production state recorded with deployment-id
vocabulary, never in commit position. The forward rule is one line: write the id with its
noun, or don't write it.

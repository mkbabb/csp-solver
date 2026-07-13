# Lane r1-prompt-recap — prompt-recap completeness audit (round 1)

Base: HEAD `65425697`, master. Every corpus row (owner-prompts.md) run to a disposition against tree
truth + the durable recap ledger (`docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md`) and
README §3a/§3b. Findings are ranked; every probe below reruns from repo root.

---

## The full recap table

Disposition column reflects **tree/record truth at HEAD**, NOT what any authored recap asserts. "Recap
home" = where the durable ledger (appendix B) or README homes it; **DROPPED** = the ask is absent from the
recap ledger entirely (a finding when the corpus mandate is "recap ALL prompts").

### Grand tranche era

| Row | Ask | Disposition | Evidence | Recap home |
|---|---|---|---|---|
| G1 | 14-wave grand tranche; releases; morph excised | ADDRESSED | appendix B §1 (SURVIVAL rows); `pre-morph-excision` tag | B §1 |
| G2 | recursive colocation ALL dirs; pencil decoupled | ADDRESSED | B §1 R8; `@pencil/*`/`@games/*` aliases + ESLint boundaries; three-home rule W7 | B §1/§3 |

### Tranche II

| Row | Ask | Disposition | Evidence | Recap home |
|---|---|---|---|---|
| T2-1 | indefatigable / no-workaround / max-parallel / publish+deploy / core defers to Opus-Sonnet | ADDRESSED (posture) | B §4 model-routing row; `fable-for-design-work.md` | B §4 |
| T2-2 | cron robustness + guardrails (no conflict / no bloat / cleanup) | ADDRESSED | B §4 cron trilogy; CronDelete `efaae137` homed WGATE | B §4 |
| T2-3 | resume directive (redeploy all workflows, batches of three) | STANDING | B §4; `t2-execution-progress.md:16-18` | B §4 |

### Tranche III authoring

| Row | Ask | Disposition | Evidence | Recap home |
|---|---|---|---|---|
| T3-1 | full closure requires local project spawn | ADDRESSED | B §4 "Local agent spawn STANDING"; dev server :3001 | B §4 |
| T3-2 | better encapsulation/modularization FE+BE; **deploy workflows to specify**; update tranche set | PARTIAL | encapsulation FOLDED (B §3 Mandate I); tranche set authored. **"deploy workflows to specify" has no recap row** — grep for "deploy workflow" in tranche-3 docs = 0 hits | B §3 (encaps only) |
| T3-3 | sudoku_api.rs split-or-remove | ADDRESSED | `csp-solver/src/py/sudoku.rs` exists (renamed, not deprecated); B §3 | B §3 |
| T3-4 | isomorphic.rs still needed? | ADDRESSED (EXCISED) | `csp-solver/wasm/src/isomorphic.rs` absent; B §3 | B §3 |
| T3-5 | py bindings SOTA research Jul 2026 | ADDRESSED | B §3 (W3 prune + W5 abi3/stub/stubtest) | B §3 |
| T3-6 | 5-step convergence loop | EXECUTED | appendix D; README §1 loop table | B §3/§4 |
| T3-7 | 32-agent audit; NO legacy; fold all; recap all; not-implementation-until-ratified | ADDRESSED | B §3 Mandate II; appendix C fold | B §3 |
| T3-8 | five design findings (a dropdown / b star-preposterous→completion / c dark-toggle / d game-switch / e heart→Yoshi) | ADDRESSED | B §3 four-row table (heart (e) folded into F2-C+F7 felt heart) | B §3 |
| T3-9 | explicate waves + questions | EXECUTED | ballot Q1-Q4 authored | README §2 |
| T3-10 | ratify with idiomatic defaults | EXECUTED | README §4 "Ratification round 2" | README §4 |
| T3-11 | binding ballot (No PyPI / prune / 0.4.0 / three-home / index.css Drop) | ADDRESSED | README §2 Q1-Q4 all at recommended; futoshiki_api.rs absent | README §2 |

### Tranche III execution + owner audits (E-series) — **NOT in the recap ledger (appendix B)**

| Row | Ask | Disposition | Evidence | Recap home |
|---|---|---|---|---|
| E1 | spawn dev server to audit; **the java branch STAYS** | ADDRESSED + **RULING CONTRADICTED IN RECAP** | dev server live; but README §5:135/§4:129 + B:34,110 still order "java branch delete" — see F1 | README prose only; reversal **DROPPED** from B §5 |
| E2 | audit-2 five findings + the drawer feature | ADDRESSED | README §3a; W12 `b4d7aedf` | README §3a (not B) |
| E3 | audit-3 five findings (idle perf, drawer, pencil draw-in, boil, toggle low-res) | ADDRESSED | README §3b; W13 `bbeb2b87` | README §3b (not B) |
| E4 | audit-4 (drawer from under-board; smoother glass curves) | ADDRESSED | README §3b S5/S3′; `MOTION.curves.drawerGlide` | README §3b (not B) |
| E5 | "ALL workflows" scope clarification | ADDRESSED | corpus note; batches-of-three standing | — (not B) |
| E6 | spawn to audit; **fix OOM**; what remains; **Kill all crons, too** | PARTIAL | OOM fixed `65425697`; **"kill all crons" has no recap row** — only pre-existing recovery-cron CronDelete `efaae137` (authoring cleanup, predates E6). See F3 | README §3b (OOM); crons **DROPPED** |
| E7 | Safari perf "god awful"; profile pencil-boil facilities | ADDRESSED→tranche-IV | safari profile evidence (context sheet); genesis of M0 | — (not B; folds to tranche-IV) |

### Tranche-IV formulation mandate (M-series) — THIS campaign's governing prompt

These define the deliverable being formed; disposition = **PENDING (tranche-IV plan folder not yet created** —
`ls docs/tranches/` shows no 2026-07-tranche-4). Not defects; tracked so none is dropped.

| Row | Ask | Disposition |
|---|---|---|
| M0 | Safari bitmap-pose-cache wave + refinement; NOT implementation | PENDING (formulation) |
| M1 | 32-agent deep audit; recap all; every ask homed | IN PROGRESS (this audit) |
| M2 | no-workaround; no-legacy clean breaks; every chronic a DECIDED row; recap all / no silent drops | PENDING |
| M3 | 32-agent orchestration; family registry; adversarial vs close-class lies | IN PROGRESS |
| M4 | Fable owns cognition; Opus/Sonnet fanout; design via Fable+plugin; 3-wide | STANDING |
| M5 | partial progress registry-tracked; terminal disposition per item | PENDING |
| M6 | return contract: plan folder + wave specs RED gates + π/DELTA + dispositions | PENDING |
| M7 | excise legacy; total test re-formulation; **abrogate PWA**; modern rust/wasm; no stale deps; idiomatic Vue/glass-ui; knip-like contrivance census; docs no-meta-language; MIKE-STYLE | PENDING — PWA still live (`vite-plugin-pwa ^1.3.0`, `vite.config.ts:192`, `test:pwa` script), correctly awaiting tranche-IV |

### Standing constraints

| Row | Disposition | Evidence |
|---|---|---|
| NEVER push bbnf-lang origin | STANDING | B §4; sync-gate `--check/--update/--verify` |
| **java branch STAYS** (2026-07-11) | STANDING — but **recap still orders its deletion** (F1) | `git branch -a` shows `java`+`origin/java` present |
| repo has NO CLAUDE.md by design | STANDING | true at HEAD |
| batches of three | STANDING | B §4 |
| ALL FE design on Fable+plugin | STANDING | `fable-for-design-work.md` |
| dev server :3001 alive | STANDING | live |
| deploy via `npm run deploy` only (npx OOM) | ADDRESSED | `65425697` |
| owner-taste items banked at W13 | ADDRESSED | README §3b (crest 1.092, twist −15°, ray-comb, divider 0.9752) |

---

## Findings

### F1 — [P1, borderline P0] The recap orders deletion of the `java` branch the owner ruled STAYS
`family_hint: recap-stale-reversal`

The owner ruling (corpus E1, standing-constraints, and `MEMORY.md`): **"The java branch STAYS"** (2026-07-11).
Yet three live locations in the record still carry the *opposite* as an open, to-be-executed action:

- `docs/tranches/2026-07-tranche-3/README.md:135` — "**R5 worktree purge + `java` branch delete** — standing, owner-side, open … Carried to WGATE."
- `docs/tranches/2026-07-tranche-3/README.md:129` — "worktree purge + **verified-dead `java` branch delete** … ride WGATE."
- `docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md:34` and `:110` — R5 row "OPEN (owner-side) … `java` … carried to WGATE" and "The one open *action* is R5 (worktree purge + `java` delete)."

This is a lie in the record: an executor following the WGATE owner-reminders would delete a branch the owner
explicitly ordered kept. The reversal is not registered — appendix B §5 "Reversals registered this session"
(lines 99-106) lists R4/D2/N9/R9 but **not** the java-stays ruling, because §5 was authored 2026-07-10
(commit `23e89339`), one day BEFORE the 2026-07-11 java ruling, and never reconciled. R5's worktree half may
still be valid; its `java`-delete half is reversed.

Probe:
```
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
git branch -a | grep -i java                    # java + origin/java present (owner: STAYS)
grep -n "java" docs/tranches/2026-07-tranche-3/README.md
grep -n "java" docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md
grep -n "java" /Users/mkbabb/.claude/projects/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/memory/MEMORY.md
```

### F2 — [P2] The durable prompt-recap ledger (appendix B) is frozen pre-execution; every E-series owner audit is absent from it
`family_hint: recap-stale-ledger`

Appendix B declares itself verified "against the live tree at base `3b75eca2`" (line 3) and was last written
at commit `23e89339` on **2026-07-10 19:08** — before ANY execution-era owner audit. All owner asks E1-E7
(2026-07-11/12): the drawer feature, "completion still preposterous / performance god awful," the toggle
recut, the boil non-performance, the OOM, "kill all crons," and the Safari profile — have **zero rows** in
the recap ledger. A token grep confirms the only appendix-B hits for E-series terms are incidental (D2,
CronDelete, R6, class-A). These asks ARE executed and documented in README §3a/§3b prose, so this is a
ledger-staleness / homing gap rather than an execution drop — but the governing mandate is "recap ALL
prompts" and appendix B is that artifact. The recap ledger and README have diverged: appendix B still calls
R5 "the one open action" (line 110) as if execution never happened.

Probe:
```
git log -1 --format="%h %ci" -- docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md   # 23e89339 2026-07-10
grep -cin -E "drawer|owner audit|OOM|safari|W12|W13" docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md  # only incidental hits
```

### F3 — [P3] E6 "Kill all crons, too" has no recap row; only the pre-existing recovery-cron cleanup exists
`family_hint: corpus-gap`

Corpus E6 (2026-07-12) says verbatim "Kill all crons, too." No tranche doc homes this ask
(`grep -rin "kill all cron" docs/tranches/` = 0). The only cron-cleanup on record is the WGATE
`CronDelete efaae137` (README:65), which is the tranche-III *authoring* recovery-cron cleanup homed since
2026-07-10 — it predates E6 and answers T2-2's guardrail, not E6's "kill ALL." Whether other crons existed
at E6-time and were killed is unverifiable from the record; the ask is simply not tracked to a disposition.

Probe:
```
grep -rin "kill all cron\|kill.*cron" docs/tranches/     # 0 hits
grep -n "efaae137\|CronDelete" docs/tranches/2026-07-tranche-3/README.md
```

### F4 — [P3] T3-2's "deploy workflows to specify" sub-ask is unrecapped
`family_hint: corpus-gap`

Corpus T3-2 bundles three asks: encapsulation/modularization (recapped, B §3 Mandate I), **"deploy workflows
to specify,"** and "update the tranche set" (recapped). The middle clause has no recap row and no wave home;
`grep -rin "deploy workflow" docs/tranches/2026-07-tranche-3/` = 0. Likely subsumed by the later
`npm run deploy` pipeline work (`65425697`), but that connection is nowhere drawn — a silent partial.

Probe:
```
grep -rin "deploy workflow" docs/tranches/2026-07-tranche-3/    # 0 hits
```

---

## Corpus additions (asks the compilation homes but the recap ledger missed — themselves findings per lane)

1. The **java-stays reversal** (E1) is a genuine reversal the record never registered (F1).
2. **E1-E7 as a class** are execution-era owner asks the durable recap ledger never absorbed (F2) — the
   corpus correctly lists them; appendix B is the artifact that dropped them.
3. **E6 kill-all-crons** and **T3-2 deploy-workflows** are un-homed sub-asks (F3, F4).

No UNADDRESSED-execution rows found: every substantive owner ask is either executed-in-tree or a correctly
pending tranche-IV formulation target (M-series, PWA/M7). The defects are recap-hygiene: stale reversal,
frozen ledger, un-homed sub-asks.

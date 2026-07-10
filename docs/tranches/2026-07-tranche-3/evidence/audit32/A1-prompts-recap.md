# A1 — Prompts Recap (this execution session)

Every owner directive reconstructed from THIS session — the tranche-2 execution
(commits `7c245bed..3b75eca2`) plus the tranche-III mandates issued 2026-07-10.
Each row is `directive → disposition-at-HEAD → evidence`. Statuses re-verified
against the live tree at HEAD `3b75eca2`, not trusted from the authored recap.

Status vocabulary: **ADDRESSED** (landed at HEAD) · **IN-FLIGHT** (a running
process / tranche-III authoring) · **OPEN** (specified, not yet executed) ·
**STANDING** (a persistent rule, still in force) · **ORPHAN** (asked, no disposition).

The authored recap `docs/tranches/2026-07-tranche-2/appendices/B-prompt-recap.md`
covers the tranche-2 ask-set *through authoring* (the plan). This lane extends it
two ways it does not cover: (a) verified dispositions at post-execution HEAD, and
(b) the **tranche-III** mandates + the **process/cron** directives, which B-recap
predates.

---

## 1. Tranche-2 binding owner constraints (the nine) — ratified 2026-07-06

Source of the nine: `memory/tranche-2-2026-07-06.md:12-21`. Wave-homing:
`B-prompt-recap.md:33-45`.

| # | Constraint | Disposition @ HEAD | Evidence |
|---|---|---|---|
| T2-1 | Demo STAYS; csp-solver repo split DEAD | **ADDRESSED** (void recorded, no code) | `B-prompt-recap.md:35`; W7 record `ede25188`; `web/api` was the only excision, demo/monorepo intact |
| T2-2 | Server abrogation IFF wasm parity+perf; KEEP py/ bindings | **ADDRESSED** | `git log 98fe2562` (W2 abrogation); `web/api` gone (`ls web/api` → No such file); py/ survives (`csp-solver/tests-py/` rehomed, `src/py/` 7 files) |
| T2-3 | Tests NEVER inline — `tests/` dir only | **ADDRESSED** | W3 `ed07ba6b` migrated `error.rs` + `puzzles/sudoku/generate.rs` inline whitebox → `tests/`; "cfg(test)-in-src now zero" |
| T2-4 | ALL CLAUDE.md + superfluous meta docs removed | **ADDRESSED** (fold-not-delete per R2) | W7 `ede25188` "Zero tracked CLAUDE.md remains"; verified `git ls-files '*CLAUDE.md'` (excl worktrees/target) → empty; CONTRIBUTING.md + ANIMATION.md excised |
| T2-5 | Most-modern Rust/wasm; legacy interrogated | **ADDRESSED** | W1 `5f9980c8` (stable pin, MSRV 1.88, PyO3 0.24→0.29, Vite 6→8, TS 6.0.3, Node 24) + W3 substrate excision @0.3.0 |
| T2-6 | Interrogate examples/ benches/ data/ | **ADDRESSED** (with residual) | W3 `ed07ba6b` (fc_chrono excise, sweep variants, iai lane) + W4 `22514bae` (bank 298,006→32,533 B, N=5 kill). **Residual**: 2 stale examples `probe_futoshiki_gen.rs`/`parity_probe.rs` flagged-not-removed (pass1 R7 §4b) |
| T2-7 | Docker removed IFF server goes | **ADDRESSED** | W2 `98fe2562`: compose trio, both Dockerfiles, `.dockerignore`, `web/nginx/`, deploy.sh all excised; verified `git ls-files 'docker-compose*' 'web/nginx/*'` → empty |
| T2-8 | UI affordances / mobile / glass / KISS; pencil-boil in scope | **ADDRESSED** | W5 `49506bf8` (mobile md→lg, 44px floors, grain hoist, pencil-boil 0.7.0) + W6 `b36b7b9f` (R3 bound order 1-8) |
| T2-9 | Fold ALL deferred; recap ALL prompts; precepts; grounded | **ADDRESSED** | Appendices B (recap), C (deferred fold-in), D (convergence 98.2%), A (corrections); `3b75eca2` closes ledger |

## 2. The 2026-07-09 ratifications (R1–R9) — `memory/tranche-2-2026-07-06.md:23-27`

| R | Directive | Disposition @ HEAD | Evidence |
|---|---|---|---|
| R1 | FULL abrogation (+ N=5 kill, box decommission, apiError SPLIT, tests-py rehome) | **ADDRESSED** | W2 `98fe2562` (excision + box decommission collateral-free, A record deleted → NXDOMAIN, OD-4 closed) + W4 `22514bae` (N=5 bank killed) |
| R2 | Fold-not-delete + MIT everywhere | **ADDRESSED** | W7 `ede25188`: CLAUDE.mds → READMEs, MIT root+crates+npm+py |
| R3 | Wholesale affordances + L33 hardening ten | **ADDRESSED** | W6 `b36b7b9f` (print CSS, K-peek exemption, stale-note clear, backtracks stat, undo, permalink, PWA, hint) + W5 (hardening slate H1-H9) |
| R4 | Substrate island excised @0.3.0 (restart/CHS/nogoods, SoftConstraint, dead variable.rs) | **ADDRESSED** | W3 `ed07ba6b` (335 LOC trio, Ordering::Chs, SoftConstraint 5-part island); csp-solver 0.3.0 verified `Cargo.toml` |
| R5 | 28GB worktree purge + java branch delete | **OPEN** (owner-side) | Booked owner-gated `B-prompt-recap.md:58`; NOT done — `git worktree list` → **52** entries; `git branch -a` → `java` + `origin/java` both live |
| R6 | e2e wired into CI | **ADDRESSED** | W0 `7c245bed` (new e2e lane, first-run green, CI 9/9) |
| R7 | rust-toolchain.toml → STABLE + rust-version 1.88 | **ADDRESSED** | W1 `5f9980c8` (stable pin; nightly was vestigial) |
| R8 | @mkbabb/keyframes.js excised | **ADDRESSED** | W1 `5f9980c8` + W5 (excision re-verified; app-local easings → pencil-boil 0.7.0) |
| R9 | never-push-csp-solver-origin RETIRED (bbnf's own STANDS) | **ADDRESSED** (record) + **STANDING** (bbnf) | W7 `ede25188` records retirement; bbnf never-push stands `memory/MEMORY.md` |

## 3. Tranche-2 class-A concrete asks (already-executed at authoring) — `B-prompt-recap.md:19-29`

| Ask | Disposition @ HEAD | Evidence |
|---|---|---|
| Logo → game-selector (wordmark IS picker) | **ADDRESSED** (pre-session) | `8913023e` (pre-tranche-2 execution) |
| Golden √φ typography | **ADDRESSED** (pre-session) | `8913023e` |
| @mbabb attribution fix | **ADDRESSED** (pre-session) | `8913023e` |
| Dev server + CF Pages cutover | **ADDRESSED** | WGATE `3b75eca2`: "DEPLOYED to production at sudoku.babb.dev … five live probes green" |
| Residual D-size-token (logo heights off-token) | **ADDRESSED** | W5 H4 ladder-bind (closes L25-49) `49506bf8` |
| Residual D1 (CDN fonts) | **ADDRESSED** | W5 fonts self-hosted 17,236 B, font-src 'self', Google-Fonts CDN severed `49506bf8` |

## 4. Process directives (this session) — memory ledger themes

Sources: `memory/t2-execution-progress.md:14-18`, `memory/tranche-2-2026-07-06.md:21,29`,
`memory/fable-for-design-work.md`.

| Directive | Disposition @ HEAD | Evidence |
|---|---|---|
| 32-agent audit passes | **IN-FLIGHT** (this very run: `wf_12147ffa-af1`) | `t2-execution-progress.md:14`; tranche-2 ran 33+40+7+13 lanes `B-prompt-recap.md:45` |
| Fable orchestrates/designs/synthesizes; Opus/Sonnet fanout | **STANDING / IN-FLIGHT** | `tranche-2-2026-07-06.md:21`; `fable-for-design-work.md` (ALL frontend design on Fable, never Opus/Sonnet) |
| 3-wide batches (dodge rate walls) | **STANDING** | `tranche-2-2026-07-06.md:29`; `t2-execution-progress.md:14` "batches of three" |
| Workflow-per-wave, gates verbatim from wave files, commit-per-wave + push | **ADDRESSED** (10 waves, 10 SHAs) | `tranche-2-2026-07-06.md:29`; git log W0..WGATE each a distinct commit |
| Stall playbook (transcript idle >20min → stop+resume) | **STANDING** | `tranche-2-2026-07-06.md:29`; folded into cron liveness rule |
| StructuredOutput failures → trust report files | **STANDING** | `tranche-2-2026-07-06.md:29` |
| bbnf-lang NEVER pushed (stands); csp-solver origin push FINE (R9) | **STANDING** | `tranche-2-2026-07-06.md:29`; `memory/MEMORY.md` |
| Redeploy Pages at end (token: value.js/.env) | **ADDRESSED** | WGATE `3b75eca2` production deploy; `t2-execution-progress.md:12` (production_branch=MASTER) |
| Local agent spawn | **STANDING / IN-FLIGHT** | `t2-execution-progress.md:14` "local spawn"; this session's workflows run locally |

### 4a. Cron robustness triad (owner-mandated guardrails) — `t2-execution-progress.md:16-18`

| Directive | Disposition @ HEAD | Evidence |
|---|---|---|
| Resume cron is SESSION-ONLY — re-arm hourly (:43) each new session, exact verbatim command | **STANDING** | `t2-execution-progress.md:16` (verbatim resume string preserved) |
| Guardrail (1) NO conflict — on fire, check liveness FIRST (TaskList + journal mtime); alive+progressing ⇒ NO-OP one-line reply, no redeploy/kill; resume only genuinely-DEAD (exit or idle >20min) | **STANDING** | `t2-execution-progress.md:18` |
| Guardrail (2) NO context bloat — liveness check = one cheap command + short reply; never dump journals on no-op | **STANDING** | `t2-execution-progress.md:18` |
| Guardrail (3) CLEANUP — CronDelete (job `efaae137`) when tranche-III authoring completes + before any deliberate session end | **OPEN / STANDING** | `t2-execution-progress.md:14,18` "Cron efaae137 STAYS until tranche-III authoring completes, then CronDelete" |

## 5. Tranche-III mandates (issued 2026-07-10, this session) — `t2-execution-progress.md:14`

Two waves of scope. These are the live, mostly-OPEN directives the tranche-III
authoring (this audit) discharges.

### 5a. Wave 1 — encapsulation / modularization loop (Pass 1 = `wf_8f3bd831-d64`)

| Directive | Disposition @ HEAD | Evidence |
|---|---|---|
| py bindings SOTA (naming/structuring/library conventions research as of Jul 2026) | **IN-FLIGHT** (audit) | Pass1 `R1-pyo3-python-native-sota.md`, `R8-web-research-*`; R7 §6 notes this is genuinely-unaddressed territory |
| sudoku_api disposition (needed? deprecated?) | **IN-FLIGHT** (audit) | Pass1 `R4-py-game-api-disposition.md`; R7 §5: `sudoku_api.rs` 338 L, live/registered, NOT deprecated |
| isomorphic.rs disposition | **IN-FLIGHT** (audit) | Pass1 `R3-isomorphic-dissection.md`, `crit-proto-P1-isomorphic-excision.md`; R7 §5: kept `full-mirror`-gated for bbnf-buddy's `solveAssignmentCop`, doc-comments stale (say `py.rs`, split to `py/` since W1) |
| The colocation edict (re-apply / verify) | **ADDRESSED** (W8) + re-audited | W8 `c14995eb` grand recursive colocation; Pass1 `R5-fe-structure-audit.md`, `R6-be-structure-audit.md` |

### 5b. Wave 2 — EXPANDED mandate (32-agent deep audit = `wf_12147ffa-af1`, this run)

| Directive | Disposition @ HEAD | Evidence |
|---|---|---|
| perf / library / UI / module-structure deep audit | **IN-FLIGHT** (this audit) | `t2-execution-progress.md:14`; audit32/ lanes |
| NO legacy code; NO workarounds — idiomatic, gestalt; architectural transpositions desirable | **STANDING** (audit posture) | Lane briefing; `tranche-2-2026-07-06.md:10` "DEVELOPMENT ONLY" |
| Fold ALL deferred + chronic items | **IN-FLIGHT** | Pass1 `R7` fold-in list (12 open items incl. god-modules search.rs 504 L / gac/mod.rs 555 L, twins unification, C1/C2 @layer hold) |
| 5-step convergence loop: audit→synthesis→prototypes→critiques(convergence %)→agglomerate, iterate to 100%, then author docs/tranches/ tranche-III set | **IN-FLIGHT** | `t2-execution-progress.md:14`; Pass1 already ran audit+synthesis+prototypes+critiques |
| Dev server at :3000 (do not kill) | **STANDING** | `t2-execution-progress.md:14`; lane briefing |

### 5c. Owner design findings (4) — 8 Fable design lanes — `t2-execution-progress.md:14`

Shots at `scratchpad/tranche3/owner-shots/`. NO modal for completion.

| Finding | Disposition @ HEAD | Evidence |
|---|---|---|
| Dropdown-frame misregistration (border) | **IN-FLIGHT** (audit) | shot `dropdown-border.png`; audit32 `design-f1-dropdown-border.md` |
| Golden completion — NO modal, stars+gold, golden board, heart in Yoshi's-Story language | **IN-FLIGHT** (audit) | shots `solved-star.png`, `heart.png`; audit32 `F2-completion-formulation.md`, `f3-completion-metadata.md` |
| Dark-toggle SVG + storybook transition | **IN-FLIGHT** (audit) | audit32 `F5-dark-toggle-storybook.md`, `f4-darkmode-toggle-svgs.md` |
| Game-switch choreography (keyframes.js re-adoption = OPEN decision row; excised at R8) | **IN-FLIGHT** (open decision) | audit32 `F6-game-switch-transition.md`; tension with R8 excision noted |

## 6. Reversals registered this session (dispositions the owner overturned)

`B-prompt-recap.md:9-17`, W7 `ede25188`.

| Reversal | Was | Now @ HEAD | Evidence |
|---|---|---|---|
| R4 inline-tests | HELD (2 blessed exceptions, W13) | **REVOKED** → migrated (T2-3/W3) | `B-prompt-recap.md:15`; `ed07ba6b` |
| D2 CLAUDE.md | ADDRESSED (rewritten pithy) | **SUPERSEDED** → removal+fold (T2-4/W7) | `B-prompt-recap.md:15`; `ede25188` |
| N9 repo split | re-booked "next tranche" | **VOID** (demo stays) | `B-prompt-recap.md:16`; `tranche-2-2026-07-06.md:13` |
| R9 never-push (csp-solver) | STANDING order | **RETIRED** | `B-prompt-recap.md:17` |

## 7. Open / unaddressed at HEAD (the non-green residue)

Directives asked this session that are NOT closed at HEAD — the tranche-III
authoring's actual worklist:

1. **R5 worktree purge + java-branch delete** — OPEN, owner-gated. 52 worktrees
   live (`git worktree list`), `java`+`origin/java` both present. Verified this lane.
2. **Cron cleanup (guardrail 3)** — CronDelete `efaae137` pending; fires until
   tranche-III authoring completes (`t2-execution-progress.md:14,18`).
3. **Fold-ALL residuals still open** (pass1 R7 summary table): god-modules
   `search.rs` (504 L) / `gac/mod.rs` (555 L, grew from 470); apiError/solverError
   twins unification; C1/C2 `index.css` @layer hold; apiError→errorFiction rename;
   2 stale examples; 4 missing test-doc pointers; R15 `optimization_mode` off py
   wire. All triggered/owned deferrals, none actioned at HEAD.
4. **All four owner design findings** — IN-FLIGHT, no code (design lanes only, this
   audit; nothing ships this tranche per "DEVELOPMENT ONLY").
5. **keyframes.js re-adoption decision** — explicitly an OPEN decision row (tension
   with R8's excision), not yet ruled.

## 8. Completeness assertion

Every owner directive traceable to this session is homed above. The tranche-2
ask-set matches B-prompt-recap's SPECIFIED column exactly (`B-prompt-recap.md:61`),
re-verified green at HEAD except R5 (owner-gated, still open). The tranche-III
mandates (§5) and the cron/process guardrails (§4) are the material this lane adds
beyond the authored recap; they are IN-FLIGHT/STANDING/OPEN as marked — none
ORPHANED (every one has a Pass-1 or audit32 disposition or an explicit owner-gate).
No ORPHAN rows found.

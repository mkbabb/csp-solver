# Appendix B — Prompt recap: every owner ask, three campaigns

The consolidated prompts matrix — the a1/a2/a3 audit lanes unified into one ledger. Every owner directive traceable across **tranche-1** (grand-uplift), **tranche-2**, and **this session** (the tranche-III mandates + the process guardrails), each with its disposition-at-HEAD and its evidence. Sources: **a1** = `audit32/A1-prompts-recap.md` (this-session + tranche-III + cron/process), **a2** = `audit32/A2-prompt-recap-verification.md` (tranche-2 recap re-verified in-tree), **a3** = `audit32/a3-prompts-recap.md` (tranche-1 vs HEAD). Every row re-verified against the live tree at base `3b75eca2`, not trusted from any authored recap.

**Status vocabulary:** **ADDRESSED** (landed at HEAD) · **FOLDED→Wx** (a live tranche-III ask, homed to a wave) · **STANDING** (a persistent rule in force) · **OPEN** (specified, owner-side, not executed) · **OBSOLETED** (premise removed by a later ratification) · **SURVIVAL** (tranche-1 ask holding at HEAD, possibly carried further). No **ORPHAN** rows exist — every ask has a disposition.

---

## 1. Tranche-1 (grand-uplift) — survivals + the five obsoletions (a3)

Source of record: `docs/tranches/2026-07-grand-uplift/appendices/B-prompt-recap.md`, verified against HEAD by a3. **Survivals dominate:** every structural/naming/colocation/aliasing ask holds unchanged or was carried further by tranche-2. Only the load-bearing rows are reproduced.

| Ask | HEAD verdict | Evidence (a3) |
|---|---|---|
| R1 Port solver Py→Rust, isomorphic API | **SURVIVAL, narrowed** | `src/py/` tree + `tests-py/` present; the *isomorphic-with-an-API* half is **moot** — no API left (T2-W2) |
| R3 No god modules >500 L | **REGRESSION (one)** | `gac/mod.rs` 470→555 L via T2-W3's L26/Q9 battery landing in-module — the one concrete tranche-1 drift; tranche-III splits it at the scratch seam (W4, K33) |
| R8 Decouple pencil from CSP domain | **SURVIVAL, reinforced** | `@pencil/*`/`@games/*` aliases + three ESLint boundary blocks; T2-W8 extended it |
| R9/R12/R13 PRM · wasm+morph · publish | **SURVIVAL, advanced** | pencil-boil `^0.7.0`; morph excised to `mkbabb/morph` (`pre-morph-excision` tag); csp-solver 0.3.0 |
| D2 root CLAUDE.md reflects web/ | **OBSOLETED** | CLAUDE.mds folded to READMEs at T2-W7 `ede25188` — the quoted CLAUDE.md context is stale cache (K45) |
| Deploy A+C concomitant · FastAPI reference · OD-5 API-box · OD-3 `morph-wasm/` rename | **OBSOLETED ×5** | all downstream of T2-W2's server abrogation (`98fe2562`) — the surface each presupposes was removed with a recorded rationale |

**a3's bottom line:** one concrete regression (gac/mod.rs, now homed to W4), five obsoletions (all from one owner-sanctioned abrogation), three rows unverifiable from this repo (OD-7, bbnf never-push, R11 COP — external/out-of-scope).

## 2. Tranche-2 — the nine constraints + the nine ratifications (a1/a2)

a2 re-verified `docs/tranches/2026-07-tranche-2/appendices/B-prompt-recap.md` against the landed tree: **9/9 class-B constraints and 8/9 ratifications land verifiably; the 9th (R5) is correctly owner-deferred.** Zero rows claim a landed commit HEAD contradicts. The load-bearing rows:

| # | Constraint / ratification | Disposition | Evidence |
|---|---|---|---|
| T2-2 | Server abrogation IFF wasm parity; KEEP py bindings | **ADDRESSED** | `web/api` gone; `src/py/` survives (7 files); `tests-py/` rehomed |
| T2-3 | Tests NEVER inline — `tests/` only | **ADDRESSED** | W3 `ed07ba6b`: `error.rs` + `generate.rs` whitebox → `tests/`; cfg(test)-in-src zero |
| T2-5 | Most-modern Rust/wasm; legacy interrogated | **ADDRESSED** | W1 `5f9980c8`: stable pin, PyO3 0.29, Vite 8, TS 6, Node 24 |
| R4 | Substrate island excised @0.3.0 | **ADDRESSED** | W3: restart/CHS/nogoods, SoftConstraint, dead variable.rs — 335 LOC trio |
| R5 | 28GB worktree purge + `java` branch delete | **OPEN (owner-side)** | 52 worktrees live, `java` + `origin/java` both present — carried to WGATE ([README §5](../README.md#5-owner-reminders-actions-not-questions--none-gate-authoring)) |
| R6 | e2e wired into CI | **ADDRESSED** | W0 `7c245bed`: new e2e lane, CI 9/9 |
| R8/R9 | keyframes.js excised · never-push (csp-solver) RETIRED | **ADDRESSED** | W1+W5 excision; W7 records retirement — bbnf's own never-push STANDS |

**a2's four precision notes** (phrasing, not execution gaps): R5 genuinely un-done; "fc_chrono excise" is sudoku-bench-scoped only (queens legitimately retains the label); the README §4 affordance pointer is imprecise; the live site may still be pre-tranche pending an owner Pages redeploy (the `_headers` fix now rides W2).

**Tranche-2 class-A asks** — logo→game-selector, golden √φ typography, @mbabb attribution, CF Pages cutover, the D-size-token + CDN-font residuals — all **ADDRESSED** (pre-session `8913023e`/`d43fae28` + W5 `49506bf8`; fonts self-hosted, CSP `font-src 'self'`).

## 3. Tranche-III mandates (issued 2026-07-10) — the two waves of scope

The live, mostly-OPEN directives this tranche discharges (a1 §5). Homed to the wave DAG; **FOLDED→Wx** is the disposition the authoring assigns.

### Mandate I — encapsulation / modularization

| Directive | Disposition | Home |
|---|---|---|
| py bindings SOTA (naming/structuring/library conventions, Jul 2026) | **FOLDED** | W3 (maximal prune) + W5 (abi3 CI-only, hand stub, stubtest) |
| `sudoku_api` disposition (needed? deprecated?) | **FOLDED** | W3 — KEEP-prune-**rename** `py/sudoku_api.rs`→`py/sudoku.rs`, no dir split; NOT deprecated |
| `isomorphic.rs` disposition | **FOLDED** | W3 — EXCISE (460 L, 7 exports); `default=["assignment"]`; npm 0.4.0 BREAKING stanza |
| The colocation edict (re-apply / verify) | **ADDRESSED + re-audited** | done T2-W8 `c14995eb`; W7 extends via the three-home rule |

### Mandate II — the expanded scope

| Directive | Disposition | Home |
|---|---|---|
| perf / library / UI / module-structure deep audit | **FOLDED (the whole tranche)** | W3–W11 |
| NO legacy, NO workarounds — idiomatic, gestalt; architectural transpositions desirable | **STANDING (authoring posture)** | every wave; the note-excisions (L25-02/03/05/07) *shrink* surface to honor it (W3) |
| Fold ALL deferred + chronic items | **FOLDED** | [appendix C](C-deferred-disposition.md) — 27 folds mapped, true chronic set, defer-closed records |
| The 5-step convergence loop, iterated to author-ready, then author the tranche set | **EXECUTED** | [appendix D](D-convergence-record.md) — 64→72/83→91, author-ready |

**The four owner design findings** (a1 §5c, all on Fable design lanes per the standing directive; NO modal for completion):

| Finding | Formulation | Home |
|---|---|---|
| Dropdown-frame border misregistration | F1 px-native HandDrawnOutline + radius-aware wobble | W10 |
| Golden completion — NO modal, stars+gold, golden board, heart in Yoshi's-Story language | F2-C + F3 + F7 (felt heart, YOSHI_COLORS wired) | W9 |
| Dark-toggle SVG + storybook transition | F4 slight pass (M4 dropped, K43) + F5 set-and-rise | W10 |
| Game-switch choreography | F6 page-turn ≈1.05 s; keyframes.js re-adoption ruled CLOSED-REJECT (G3 source-verified) | W10 |

## 4. Meta-directives — process, cron, orchestration (a1 §4)

The directives governing *how* the loop ran, not what it produced. All STANDING or discharged-at-close.

### The recovery-cron trilogy (owner-mandated guardrails, `t2-execution-progress.md:16-18`)

The resume cron is **SESSION-ONLY** — re-armed hourly (:43) each new session with the exact verbatim command. Its three guardrails, in force this whole session:

1. **NO conflict** — on fire, check liveness FIRST (TaskList + journal mtime); alive-and-progressing ⇒ a NO-OP one-line reply, no redeploy/kill; resume **only** a genuinely-dead run (exit, or idle >20 min).
2. **NO context bloat** — the liveness check is one cheap command + a short reply; never dump journals on a no-op.
3. **CLEANUP** — `CronDelete` job `efaae137` when tranche-III authoring completes, and before any deliberate session end. Homed to WGATE (**OPEN/STANDING** until then).

### The other standing process rules

| Directive | Disposition | Evidence |
|---|---|---|
| Local agent spawn | **STANDING** | this session's workflows run locally (`t2-execution-progress.md:14`) |
| 3-wide batches (dodge rate walls) | **STANDING** | `tranche-2-2026-07-06.md:29`; tranche-2 ran 33+40+7+13 lanes in batches |
| Fable orchestrates/designs/synthesizes; Opus/Sonnet fanout; ALL frontend design on Fable | **STANDING** | `fable-for-design-work.md`; the eight design lanes (F1–F8) ran on Fable |
| The 5-step loop: audit→synthesis→prototypes→critiques(convergence %)→agglomerate, iterated to author-ready | **EXECUTED** | five phases: pass-1 (21) → audit-32 (32) → pass-2 (12) → ballot → pass-3 (6+reconciliation); see [appendix D](D-convergence-record.md) |
| Workflow-per-wave, gates verbatim from wave files, commit-per-wave | **STANDING (execution rule)** | the wave files carry verbatim gate tables for exactly this |
| bbnf-lang NEVER pushed; csp-solver origin push FINE (R9) | **STANDING** | `memory/MEMORY.md`; the bbnf sync gate is `--check`/`--update`/`--verify` only |
| Dev server not to be killed | **STANDING** | corrected: the app is the `--port`-bound instance, `:3000` is Vite's HMR socket (K46) |

## 5. Reversals registered this session (a1 §6)

Dispositions the owner overturned, now stable at HEAD:

| Reversal | Was | Now | Evidence |
|---|---|---|---|
| R4 inline-tests | HELD (2 blessed exceptions) | **REVOKED** → migrated | `ed07ba6b` |
| D2 CLAUDE.md | ADDRESSED (rewritten pithy) | **SUPERSEDED** → removal+fold | `ede25188` |
| N9 repo split | re-booked "next tranche" | **VOID** (demo stays) | `tranche-2-2026-07-06.md:13` |
| R9 never-push (csp-solver) | STANDING order | **RETIRED** (bbnf's stands) | W7 record |

## 6. Completeness assertion

Every owner directive traceable across the three campaigns is homed above. Tranche-1's ask-set survives or is explicitly obsoleted by a recorded ratification (a3); tranche-2's matches its own recap's SPECIFIED column and re-verifies green at HEAD save R5 (owner-gated, still open — a2); the tranche-III mandates and the cron/process guardrails are FOLDED/STANDING/OPEN as marked (a1). **No ORPHAN rows** — every ask carries a Pass-1, audit-32, or explicit owner-gate disposition. The one open *action* is R5 (worktree purge + `java` delete), carried to WGATE as an owner reminder, not tranche work.
